"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { horizonFrac } from "./layout";
import { sceneState } from "./store";

// Noite no rio Acre, num quad de tela cheia: céu, estrelas, a mata com
// açaizeiros no horizonte e a água com o reflexo da mata. Tudo num só
// shader, porque é uma chamada de desenho só, sem textura para baixar.

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
  uniform float uHorizon;
  uniform float uTime;
  uniform float uTravel;
  varying vec2 vUv;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }
  float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(float x) {
    float i = floor(x);
    float f = fract(x);
    return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f));
  }
  float fbm(float x) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(x); x *= 2.03; a *= 0.5; }
    return v;
  }

  // Copas arredondadas lado a lado: o recorte "em bolhas" da mata amazônica.
  float crowns(float x, float cell, float amp, float seed) {
    float id = floor(x / cell);
    float f = fract(x / cell) - 0.5;
    return sqrt(max(0.0, 0.25 - f * f)) * 2.0 * amp * (0.5 + hash(id * 7.1 + seed));
  }

  // Alturas da mata acima da linha d'água, em fração da altura da tela.
  float canopyFar(float x) { return 0.05 + 0.03 * fbm(x * 2.2 + 7.0) + crowns(x, 0.035, 0.012, 3.0); }
  float canopyNear(float x) {
    // Duas grades de copas com larguras que não se dividem (0,043 e 0,067):
    // uma só grade dava o recorte repetido de cerca viva.
    float h = 0.026 + 0.034 * fbm(x * 3.0 + 3.0)
      + max(crowns(x, 0.043, 0.014, 0.0), crowns(x + 0.021, 0.067, 0.02, 5.0) - 0.004);
    // Árvore emergente (tipo sumaúma): copa larga bem acima das outras.
    float cell = 0.37;
    float id = floor(x / cell);
    float f = fract(x / cell) - 0.5;
    if (hash(id * 2.3) > 0.62) h += sqrt(max(0.0, 0.04 - f * f)) / 0.2 * 0.045;
    return h;
  }

  // Açaizeiro: tronco fino acima da mata e folhas compridas que arqueiam para baixo.
  float palm(float x, float y) {
    float cell = 0.21;
    float id = floor(x / cell);
    if (hash(id * 3.7 + 1.0) < 0.6) return 0.0;
    float px = (id + 0.25 + 0.5 * hash(id * 1.3)) * cell;
    float top = canopyNear(px) + 0.045 + 0.04 * hash(id * 5.1);
    float lean = (hash(id * 9.7) - 0.5) * 0.03;
    float tx = px + lean * clamp(y / top, 0.0, 1.0);
    float trunk = step(abs(x - tx), 0.0011) * step(y, top);
    vec2 d = vec2(x - (px + lean), y - top);
    float r = length(d);
    float len = 0.032;
    if (r > len) return trunk;
    // Dobra o espaço para baixo com o quadrado da distância: folha reta perto
    // do tronco, caída na ponta. Nove folhas, girando por palmeira.
    vec2 q = vec2(d.x, d.y + 22.0 * r * r);
    float a = atan(q.y, q.x);
    float sector = 6.28318 / 9.0;
    float da = abs(mod(a + hash(id) * sector, sector) - sector * 0.5);
    float leaf = step(da * r, 0.0011 + 0.0022 * (1.0 - r / len));
    return max(trunk, leaf);
  }

  vec3 forest(float x, float y, vec3 base, vec3 far, vec3 near) {
    vec3 c = base;
    if (y < canopyFar(x)) c = far;
    if (y < canopyNear(x) || palm(x, y) > 0.5) c = near;
    return c;
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 uv = vUv;
    float x = uv.x * aspect;
    float h = uHorizon;

    vec3 skyTop = vec3(0.014, 0.022, 0.032);
    vec3 skyLow = vec3(0.05, 0.085, 0.1);
    vec3 farTrees = vec3(0.026, 0.046, 0.054);
    vec3 nearTrees = vec3(0.006, 0.013, 0.014);
    vec3 col;

    if (uv.y >= h) {
      col = mix(skyLow, skyTop, smoothstep(h, h + 0.6, uv.y));
      // Brilho de lua atrás das formas, à direita, longe do texto.
      vec2 moon = vec2(0.74 * aspect, h + 0.46);
      float md = length(vec2(x, uv.y) - moon);
      col += vec3(0.06, 0.08, 0.085) * exp(-md * md * 9.0);
      // Estrelas: ~0,7% das células de uma grade, piscando devagar.
      vec2 g = vec2(x, uv.y) * 140.0;
      float s = hash2(floor(g));
      if (s > 0.993) {
        float tw = 0.6 + 0.4 * sin(uTime * (0.8 + s * 2.5) + s * 90.0);
        float star = smoothstep(0.14, 0.0, length(fract(g) - 0.5));
        col += vec3(0.7, 0.76, 0.82) * star * tw * smoothstep(h + 0.1, h + 0.32, uv.y) * 0.7;
      }
      col = forest(x, uv.y - h, col, farTrees, nearTrees);
    } else {
      float dd = h - uv.y;
      float depth = dd / h;
      vec3 water = mix(skyLow * 0.8, vec3(0.005, 0.01, 0.014), smoothstep(0.0, 1.0, depth));
      // Reflexo da mata, ondulando mais perto de quem olha.
      float wob = sin(dd * 900.0 / (1.0 + dd * 30.0) + uTime * 1.1) * 0.005 * (0.2 + depth);
      water = forest(x + wob, dd * 1.08, water, mix(water, farTrees, 0.75), mix(water, nearTrees, 0.85));
      // Marolas em perspectiva: mais juntas no horizonte, andando com o scroll.
      float z = 1.0 / (dd + 0.02);
      float rip = sin(z * 1.4 - uTravel * 5.0 + uTime * 0.25 + noise(x * 2.0 + z * 0.2) * 3.0);
      float broken = smoothstep(0.5, 0.85, noise(x * 10.0 / (1.0 + dd * 5.0) + z * 0.6));
      water += skyLow * 0.8 * smoothstep(0.9, 1.0, rip) * broken * (1.0 - depth * 0.5);
      // Rastro da lua: coluna de reflexos picados sob o brilho do céu,
      // alargando perto de quem olha.
      float mx = 0.74 * aspect;
      float width = 0.03 + depth * 0.12;
      float streak = exp(-pow((x - mx) / width, 2.0));
      float glint = smoothstep(0.55, 1.0, sin(z * 3.0 + noise(x * 24.0) * 5.0 - uTravel * 5.0 + uTime * 0.5));
      water += vec3(0.1, 0.13, 0.14) * streak * glint * (1.0 - depth * 0.6);
      // Fio de luz na linha d'água.
      water += skyLow * 0.5 * exp(-dd * 500.0);
      col = water;
    }
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function River({ reducedMotion }: { reducedMotion: boolean }) {
  const { size, viewport } = useThree();
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
          uHorizon: { value: 0.28 },
          uTime: { value: 0 },
          uTravel: { value: 0 },
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
    u.uHorizon.value = horizonFrac(viewport.width, viewport.height);
    u.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime;
    // Suavizado: o scroll chega aos saltos (roda do mouse) e as marolas pulariam.
    u.uTravel.value += (sceneState.travel - u.uTravel.value) * 0.08;
  });

  // renderOrder negativo: desenha antes das partículas, que somam luz por cima.
  return <mesh ref={mesh} geometry={geometry} material={material} renderOrder={-1} frustumCulled={false} />;
}
