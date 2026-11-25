"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { sceneState } from "./store";

// A Amazônia vista de cima, à noite: copas desenhadas uma a uma, o rio Acre
// serpenteando com brilho de lua, praias nas curvas, lagos em ferradura,
// igarapés e névoa. Rolar a página é voar rio abaixo. Tudo num shader de tela
// cheia: uma chamada de desenho, nenhuma textura para baixar.

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // Em espaço de tela direto: o fundo não depende da câmera.
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform vec2 uRes;
  uniform float uTime;
  uniform float uTravel;
  uniform float uBias;   // centro do rio, em alturas de tela a partir do meio
  uniform float uAmp;    // amplitude das curvas
  uniform float uShade;  // escurecimento à esquerda, atrás da coluna de texto
  uniform float uWidth;  // meia largura do rio, em alturas de tela
  varying vec2 vUv;

  float hash1(float n) { return fract(sin(n) * 43758.5453123); }
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
  }
  float noise1(float x) {
    float i = floor(x); float f = fract(x);
    return mix(hash1(i), hash1(i + 1.0), f * f * (3.0 - 2.0 * f));
  }
  float noise2(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash2(i).x, b = hash2(i + vec2(1.0, 0.0)).x;
    float c = hash2(i + vec2(0.0, 1.0)).x, d = hash2(i + vec2(1.0, 1.0)).x;
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm2(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise2(p); p = p * 2.03 + 11.7; a *= 0.5; }
    return v;
  }

  // Worley: distância ao centro da copa mais próxima e um sorteio por copa.
  vec2 crowns(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    float md = 8.0; float id = 0.0;
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 g = vec2(float(x), float(y));
        vec2 h = hash2(i + g);
        vec2 r = g + 0.5 + 0.42 * sin(6.2831 * h) - f;
        float d = dot(r, r);
        if (d < md) { md = d; id = h.x; }
      }
    }
    return vec2(sqrt(md), id);
  }

  // Linha central do rio: duas senoides de períodos que não se repetem mais
  // ruído lento. Dá meandros irregulares como os do Acre visto de satélite.
  // Meandros com comprimento de onda de ~0,9 tela: com períodos maiores o rio
  // parecia uma faixa reta. Três senoides fora de fase evitam a curva repetida.
  float riverX(float y) {
    return uBias + uAmp * (0.6 * sin(y * 6.8) + 0.45 * sin(y * 3.1 + 1.3) + 0.25 * sin(y * 11.3 + 2.0))
      + 0.05 * (noise1(y * 2.0) - 0.5);
  }

  vec3 forest(vec2 p) {
    // Cada copa é um domo iluminado de cima à esquerda (luz da lua): a
    // diferença de altura entre o ponto e um vizinho deslocado dá o relevo.
    vec2 a = crowns(p * 34.0);
    vec2 b = crowns(p * 34.0 + vec2(0.16, -0.16));
    float dome = 1.0 - a.x;
    float lit = clamp((dome - (1.0 - b.x)) * 2.2 + 0.5, 0.0, 1.0);
    vec2 big = crowns(p * 12.0 + 3.1);

    // Tons de verde variando por copa.
    vec3 g1 = vec3(0.03, 0.075, 0.045);
    vec3 g2 = vec3(0.05, 0.085, 0.04);
    vec3 g3 = vec3(0.025, 0.06, 0.055);
    vec3 tone = a.y < 0.33 ? g1 : a.y < 0.66 ? g2 : g3;
    vec3 col = tone * (0.45 + 0.9 * lit) * smoothstep(0.95, 0.35, a.x);
    // Vãos entre copas: sombra funda.
    col = mix(vec3(0.004, 0.01, 0.007), col, smoothstep(0.98, 0.7, a.x));
    // Árvores emergentes, maiores e mais claras.
    float emergent = smoothstep(0.5, 0.05, big.x) * step(0.8, big.y);
    col = mix(col, vec3(0.06, 0.11, 0.06) * (0.6 + 0.6 * lit), emergent * 0.75);
    // Ipê florido: copa nítida, rara, amarela ou rosa.
    if (a.y > 0.995) col = mix(col, a.y > 0.9975 ? vec3(0.2, 0.15, 0.035) : vec3(0.16, 0.07, 0.1), smoothstep(0.7, 0.35, a.x) * (0.4 + 0.5 * lit));
    // Manchas mais abertas e mais fechadas na mata.
    col *= 0.7 + 0.6 * fbm2(p * 2.5);
    return col;
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 s = vec2((vUv.x - 0.5) * aspect, vUv.y - 0.5);
    // O mapa sobe com a página, mais devagar que o texto (paralaxe), e anda
    // um fio sozinho para a cena nunca ficar congelada.
    vec2 p = vec2(s.x, s.y - uTravel * 0.55 - uTime * 0.004);

    vec3 col = forest(p);

    // Igarapés: linhas finas e sinuosas, só em parte da mata.
    float v = fbm2(p * 2.4 + 20.0);
    float creek = (1.0 - smoothstep(0.0, 0.01, abs(v - 0.5))) * smoothstep(0.5, 0.65, fbm2(p * 0.8 + 5.0));
    col = mix(col, vec3(0.02, 0.035, 0.045), creek * 0.85);

    // Lagos em ferradura: arcos de água parada perto das curvas do rio.
    float cell = 1.35;
    float cid = floor(p.y / cell);
    for (int k = -1; k <= 1; k++) {
      float id = cid + float(k);
      float cy = (id + 0.5) * cell;
      float side = hash1(id * 3.1) > 0.5 ? 1.0 : -1.0;
      vec2 c = vec2(riverX(cy) + side * (0.14 + 0.06 * hash1(id * 7.3)), cy);
      float r = 0.055 + 0.03 * hash1(id * 5.7);
      vec2 d = p - c;
      float ring = abs(length(d) - r);
      float ang = atan(d.y, d.x) + hash1(id) * 6.2831;
      float arc = step(0.9, mod(ang, 6.2831));
      float lake = (1.0 - smoothstep(0.008, 0.012, ring)) * (1.0 - arc) * step(0.35, hash1(id * 9.1));
      col = mix(col, vec3(0.018, 0.03, 0.038) + 0.03 * noise2(p * 80.0), lake);
    }

    // O rio.
    float e = 0.01;
    float xc = riverX(p.y);
    float dx = (riverX(p.y + e) - riverX(p.y - e)) / (2.0 * e);
    float curv = riverX(p.y + e) + riverX(p.y - e) - 2.0 * xc;
    float dist = (p.x - xc) / sqrt(1.0 + dx * dx);
    float w = uWidth * (1.0 + 0.2 * sin(p.y * 2.3));
    float side = sign(dist);
    // Praia de areia na parte de dentro da curva, mais larga quanto mais fechada a curva.
    // Curvatura em unidades de e²: 0,0004 já é uma curva fechada nesta escala.
    float bar = clamp(abs(curv) * 2500.0, 0.0, 1.0) * step(0.0, side * curv);
    float sand = (1.0 - smoothstep(w, w + 0.03 * bar, abs(dist))) * step(w - 0.002, abs(dist)) * bar;
    col = mix(col, vec3(0.13, 0.115, 0.085) * (0.8 + 0.4 * noise2(p * 60.0)), sand);
    float water = 1.0 - smoothstep(w - 0.004, w, abs(dist));
    // Água barrenta do Acre refletindo a lua: mais clara que a mata, para o
    // rio se ler como rio e não como sombra.
    // Água escura e lisa com reflexos picados de lua, alongados na direção da
    // correnteza. Sem sombra degradê nas margens: ela dava volume de tubo.
    vec3 riverCol = vec3(0.045, 0.055, 0.055);
    // Proporção 3:1 (antes 6:1): mais esticado, os reflexos viravam
    // tracejado de faixa de estrada.
    float glints = noise2(vec2(dist * 220.0, p.y * 75.0 - uTime * 0.6));
    riverCol += vec3(0.16, 0.17, 0.16) * smoothstep(0.8, 0.96, glints) * (0.4 + 0.6 * fbm2(p * 6.0));
    // Barranco: fio claro de lama na beira.
    riverCol = mix(riverCol, vec3(0.1, 0.09, 0.07), smoothstep(w * 0.86, w, abs(dist)) * 0.7);
    col = mix(col, riverCol, water);

    // Névoa baixa, mais rápida que o mapa: dá altura ao voo.
    float mist = smoothstep(0.55, 0.9, fbm2(p * 1.3 + vec2(uTime * 0.012, -uTravel * 0.3)));
    col += vec3(0.07, 0.085, 0.09) * mist * 0.35;

    // Vinheta e área mais escura atrás do texto.
    col *= 0.6 + 0.4 * smoothstep(1.15, 0.25, length(vUv - 0.5) * 1.5);
    col *= mix(1.0 - uShade, 1.0, smoothstep(0.08, 0.62, vUv.x));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function River({ reducedMotion }: { reducedMotion: boolean }) {
  const { size } = useThree();
  const mesh = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        depthWrite: false,
        depthTest: false,
        uniforms: {
          uRes: { value: new THREE.Vector2(1, 1) },
          uTime: { value: 0 },
          uTravel: { value: 0 },
          uBias: { value: 0.3 },
          uAmp: { value: 0.18 },
          uShade: { value: 0.45 },
          uWidth: { value: 0.04 },
        },
      }),
    [],
  );
  const geometry = useMemo(() => new THREE.PlaneGeometry(2, 2), []);
  useEffect(
    () => () => {
      material.dispose();
      geometry.dispose();
    },
    [material, geometry],
  );

  useFrame((state) => {
    const obj = mesh.current;
    if (!obj) return;
    // Material vem do objeto montado (ref), não do escopo do render.
    const u = obj.material.uniforms;
    (u.uRes.value as THREE.Vector2).set(size.width, size.height);
    const aspect = size.width / size.height;
    const portrait = aspect < 0.9;
    // Desktop: rio no terço direito, longe da coluna de texto (que fica à
    // esquerda). Retrato: centrado e com curvas menores, porque não há lado livre.
    u.uBias.value = portrait ? 0 : aspect * 0.2;
    u.uAmp.value = portrait ? aspect * 0.22 : 0.13;
    u.uShade.value = portrait ? 0.25 : 0.45;
    // No retrato a mesma fração da altura dava um rio de ~1/5 da largura da tela.
    u.uWidth.value = portrait ? 0.022 : 0.04;
    u.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime;
    // Suavizado: o scroll chega aos saltos (roda do mouse) e o voo pularia.
    u.uTravel.value += (sceneState.travel - u.uTravel.value) * 0.08;
  });

  // renderOrder negativo: desenha antes das partículas, que somam luz por cima.
  return <mesh ref={mesh} geometry={geometry} material={material} renderOrder={-1} frustumCulled={false} />;
}
