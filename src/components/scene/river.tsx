"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { COLUMN_END, halfRef, NOTES_MIN_WIDTH, NOTES_START, RIVER, RIVER_GLSL, SPINE_TEXT_START } from "./river-curve";
import { sceneState } from "./store";

// A Amazônia vista de cima, à noite, como carta: copas desenhadas uma a uma,
// o rio Acre com brilho de lua, praias nas curvas, lagos em ferradura,
// igarapés e névoa. O mapa anda 1:1 com a página (é o próprio documento), e o
// nome e a correnteza escritos em SVG ficam exatamente sobre a água porque a
// curva vem de river-curve.ts. Uma chamada de desenho, nenhuma textura.

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform vec2 uRes;      // px CSS
  uniform float uDpr;
  uniform float uTime;
  uniform float uScroll;  // window.scrollY, px
  uniform float uMode;    // 0 carta, 1 lombada
  uniform float uNotes;   // 1 quando a coluna de notas existe
  uniform vec3 uLight;    // lanterna: x, y (px da janela, y para baixo), ligada
  uniform float uDim;
  uniform float uTier;    // 0 completo, 1 aparelho modesto
  varying vec2 vUv;
  ${RIVER_GLSL}

  float hash1(float n) { return fract(sin(n) * 43758.5453123); }
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
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

  float fbmLite(vec2 p) { return 0.65 * noise2(p) + 0.35 * noise2(p * 2.03 + 11.7); }

  // Distância ao centro da copa mais próxima (0 no centro, ~0,7 no vão entre
  // copas), guardada pela forest() para a beira do rio: copa perto da margem
  // avança sobre a água.
  float gCrown;

  vec3 forest(vec2 p) {
    vec2 a = crowns(p * 34.0);
    gCrown = a.x;
    // Relevo de cada copa: diferença para um vizinho deslocado (luz da lua
    // vindo de cima à esquerda). É o segundo Worley; aparelho modesto usa
    // um "lit" constante.
    float lit = 0.6;
    if (uTier < 0.5) {
      vec2 b = crowns(p * 34.0 + vec2(0.16, -0.16));
      lit = clamp(((1.0 - a.x) - (1.0 - b.x)) * 2.2 + 0.5, 0.0, 1.0);
    }
    vec3 g1 = vec3(0.03, 0.075, 0.045);
    vec3 g2 = vec3(0.05, 0.085, 0.04);
    vec3 g3 = vec3(0.025, 0.06, 0.055);
    vec3 tone = a.y < 0.33 ? g1 : a.y < 0.66 ? g2 : g3;
    vec3 col = tone * (0.45 + 0.9 * lit) * smoothstep(0.95, 0.35, a.x);
    col = mix(vec3(0.004, 0.01, 0.007), col, smoothstep(0.98, 0.7, a.x));
    // Árvores emergentes (as que furam o dossel): um Worley a mais, só no
    // aparelho completo. No celular fica um Worley por pixel.
    if (uTier < 0.5) {
      vec2 big = crowns(p * 12.0 + 3.1);
      float emergent = smoothstep(0.5, 0.05, big.x) * step(0.8, big.y);
      col = mix(col, vec3(0.06, 0.11, 0.06) * (0.6 + 0.6 * lit), emergent * 0.75);
    }
    // Ipê florido: raro, amarelo ou rosa.
    if (a.y > 0.995) col = mix(col, a.y > 0.9975 ? vec3(0.2, 0.15, 0.035) : vec3(0.16, 0.07, 0.1), smoothstep(0.7, 0.35, a.x) * (0.4 + 0.5 * lit));
    // Uniform: o desvio é o mesmo para todos os pixels, a GPU não paga os dois lados.
    float tex;
    if (uTier < 0.5) tex = fbm2(p * 2.5);
    else tex = fbmLite(p * 2.5);
    col *= 0.7 + 0.6 * tex;
    return col;
  }

  // Centro do rio em unidades da carta (o espaço da mata).
  float riverXU(float y) { return riverX(y) * uRes.x / uUnit; }

  void main() {
    vec2 fc = gl_FragCoord.xy / uDpr;
    // y do documento: a carta é a página, então rolar 1 px move o mapa 1 px.
    float docY = uScroll + (uRes.y - fc.y);
    float wy = docY / uUnit;
    // Mata em unidades: copas quadradas em qualquer proporção de tela.
    vec2 p = vec2(fc.x, docY) / uUnit;

    // Exposição só na mata (~20% abaixo da versão de partículas): a carta é
    // noite fechada, mas a água reflete o céu e tem de ser mais clara que a
    // copa. Com o ×0,8 aplicado em tudo, o rio ficava quase preto e lia como
    // asfalto.
    vec3 col = forest(p) * 0.8;
    float t = uTime;

    // Igarapés: linhas finas e sinuosas, só em parte da mata, com o mesmo
    // tom de água do rio (mais escuro). No aparelho modesto saem: são duas
    // fbm2 por pixel que no celular não se enxergam.
    if (uTier < 0.5) {
      float v = fbm2(p * 2.4 + 20.0);
      float creek = (1.0 - smoothstep(0.0, 0.01, abs(v - 0.5))) * smoothstep(0.5, 0.65, fbm2(p * 0.8 + 5.0));
      col = mix(col, vec3(0.05, 0.066, 0.076), creek * 0.75);
    }

    // Lagos em ferradura: o meandro abandonado, uma ferradura de água parada
    // de ~12 px com as pontas afinando. Antes a
    // máscara do arco estava invertida (sobrava 1/7 do círculo) e a linha
    // tinha ~2 px: lia como um "(" solto na mata, um glitch. Só na carta e
    // só entre a coluna de texto e as notas (nunca atrás de texto), e só no
    // aparelho completo: é um atan por pixel em 3 células.
    if (uTier < 0.5 && uMode < 0.5) {
      float cell = 1.35;
      float cid = floor(p.y / cell);
      for (int k = -1; k <= 1; k++) {
        float id = cid + float(k);
        if (hash1(id * 9.1) < 0.4) continue;
        float cy = (id + 0.5) * cell;
        float side = hash1(id * 3.1) > 0.5 ? 1.0 : -1.0;
        float r = 0.055 + 0.03 * hash1(id * 5.7);
        // Longe da margem (a água mais larga daquela altura, com folga).
        float off = (riverHalfPx(cy) * 1.25 + 26.0) / uUnit + r + 0.04 * hash1(id * 7.3);
        vec2 c = vec2(riverXU(cy) + side * off, cy);
        float lx = (c.x - r) * uUnit / uRes.x;
        float rx = (c.x + r) * uUnit / uRes.x;
        if (lx < ${COLUMN_END + 0.02} || rx > ${NOTES_START - 0.02}) continue;
        // Alongado no sentido do rio, como o meandro que ele foi; um círculo
        // perfeito lia como a letra "C".
        vec2 d = (p - c) * vec2(1.0, 0.62);
        float ring = abs(length(d) - r) * uUnit;
        float ang = mod(atan(d.y, d.x) + hash1(id) * 6.2831, 6.2831);
        // Abertura de ~1,4 rad; as pontas afinam até sumir. Mesmo azul de
        // céu do rio: é água, e tem de ler como água, não como anel cinza.
        float arm = smoothstep(1.2, 1.9, ang) * (1.0 - smoothstep(5.7, 6.25, ang));
        float halfT = 6.0 * arm;
        float lake = 1.0 - smoothstep(halfT - 1.0, halfT + 0.5, ring);
        col = mix(col, vec3(0.13, 0.178, 0.212) * (0.8 + 0.3 * noise2(p * 40.0)), lake);
      }
    }

    // O rio, em px: centro, inclinação e curvatura da mesma curva do SVG.
    float e = 0.01;
    float xc = riverX(wy) * uRes.x;
    float xa = riverX(wy + e) * uRes.x;
    float xb = riverX(wy - e) * uRes.x;
    float slope = (xa - xb) / (2.0 * e * uUnit);
    float curv = (xa + xb - 2.0 * xc) / uUnit;
    float dist = (fc.x - xc) / sqrt(1.0 + slope * slope);
    float side = sign(dist);
    // Largura que varia ±uNoise/2 em trechos de ~180 px: margem paralela e
    // lisa é o que faz um rio parecer estrada. O tamanho do nome em SVG
    // desconta essa variação e a copa (safeHalfPx em river-curve.ts).
    float w = riverHalfPx(wy) * (1.0 + uNoise * (noise2(vec2(wy * 5.0, side * 4.0 + 2.0)) - 0.5));
    // Praia na parte de dentro da curva (o lado para onde aponta a segunda
    // derivada). Areia clara: à noite é a coisa mais clara da mata depois da
    // água. Crescente, não faixa: larga só no ápice da curva e afinando nas
    // pontas. Com clamp(curv × 2500) ela saturava na curva inteira e virava
    // uma tira marrom de largura constante, o acostamento de rodovia.
    float bar = smoothstep(0.00015, 0.0008, abs(curv)) * step(0.0, side * curv);
    float sandW = 0.03 * uUnit * bar * (0.55 + 0.9 * noise2(vec2(wy * 3.0, 9.0)));
    // A areia nasce 2 px dentro da água, então encosta na água clara.
    float sand = (1.0 - smoothstep(w + sandW * 0.6, w + sandW, abs(dist))) * step(w - 2.0, abs(dist)) * bar;
    col = mix(col, vec3(0.16, 0.15, 0.125) * (0.75 + 0.4 * noise2(p * 60.0)), sand);
    // Copa debruçada sobre a água: onde o centro de uma copa cai perto da
    // margem, ela cobre até uOverhang px do rio. É o recorte que diz "mata" e
    // não "acostamento". Do lado da praia não há copa: com ela, a areia
    // ficava separada da água por uma faixa escura e lia como segunda calha.
    float overhang = (1.0 - smoothstep(0.2, 0.72, gCrown)) * uOverhang * (1.0 - bar);
    float water = 1.0 - smoothstep(w - overhang - 1.5, w - overhang + 0.5, abs(dist));

    // Lanterna: halo morno de ~240 px. Gaussiana com sigma de 120 px.
    vec2 lp = vec2(uLight.x, uRes.y - uLight.y);
    float ld = length(fc - lp);
    float lk = exp(-(ld * ld) / (2.0 * 120.0 * 120.0)) * uLight.z;

    // A água: reflete o céu, então é mais clara que a mata. Superfície quase
    // chapada (um degradê do canal para a beira lia como tubo), com a copa
    // espelhada só numa faixa estreita junto do barranco. Só os pixels de
    // água pagam essas contas (região contígua: a GPU quase não diverge).
    if (water > 0.001) {
      float across = clamp(dist / w, -1.0, 1.0);
      float aa = abs(across);
      // Lençóis de luar: manchas largas que ocupam o rio de margem a margem e
      // se esticam ao longo dele, andando bem devagar rio abaixo.
      float moonN;
      if (uTier < 0.5) moonN = fbm2(vec2(across * 0.7 + 3.0, wy * 1.1 - t * 0.02));
      else moonN = noise2(vec2(across * 0.7 + 3.0, wy * 1.1 - t * 0.02));
      float moon = smoothstep(0.42, 0.78, moonN);
      // Azul de céu noturno (--color-water, #8fa6b2, a ~30%; o luar sobe
      // até ~50%). Mais claro, o nome creme escrito em cima perdia contraste.
      // Por cima, um lençol
      // de brilho lento e largo, sem nenhuma linha contínua: faixa paralela à
      // margem (testada) lia como pista de rodovia.
      vec3 sky = vec3(0.13, 0.178, 0.212);
      vec3 riverCol = sky * (0.9 + 0.2 * noise2(vec2(across * 2.0, wy * 4.0 - t * 0.05)));
      // A copa se espelha na beira: faixa escura de borda irregular, mais
      // funda onde a copa debruça.
      // Faixa estreita (o último quinto da meia largura): com ela começando
      // em 55%, a beira da água ficava quase da cor da mata, o rio parecia
      // mais estreito do que é e as letras do nome, que cabem na água
      // medida, pareciam sair dela.
      float mirror = smoothstep(0.76, 1.0, aa + 0.14 * (noise2(vec2(wy * 26.0, side * 5.0)) - 0.5) + overhang / max(w, 1.0));
      // Junto da praia não há copa para espelhar: a água clara vai até a areia.
      mirror *= 1.0 - 0.8 * bar;
      riverCol = mix(riverCol, vec3(0.03, 0.05, 0.05), mirror * 0.7);
      riverCol += vec3(0.11, 0.135, 0.15) * moon * (1.0 - mirror);
      // Cintilação: pontos de ~5 px, raros, concentrados no luar. Duas
      // camadas andando em sentidos opostos fazem cada ponto acender e
      // apagar enquanto desce o rio (antes eram traços brancos parados, que
      // liam como faixa de rodovia).
      float g1 = smoothstep(0.86, 0.98, noise2(vec2(across * 7.0, wy * 180.0 - t * 0.9)));
      float g2 = smoothstep(0.45, 0.8, noise2(vec2(across * 4.0 + 7.0, wy * 70.0 + t * 0.5)));
      float glint = g1 * g2 * moon * (1.0 - mirror);
      glint *= 1.0 + 2.0 * lk;
      riverCol += vec3(0.55, 0.6, 0.62) * glint;
      // Sem fio claro de barranco: debaixo da copa a beira é escura, e um
      // contorno claro e contínuo lia como acostamento. A areia das praias
      // (acima) já marca as curvas.
      col = mix(col, riverCol, water);
    }

    // Névoa baixa com velocidade própria: dá altura ao voo.
    if (uTier < 0.5) {
      float mist = smoothstep(0.55, 0.9, fbm2(p * 1.3 + vec2(t * 0.012, -uScroll / uUnit * 0.3)));
      col += vec3(0.07, 0.085, 0.09) * mist * 0.35;
    }

    col *= 1.0 + lk * vec3(1.2, 0.75, 0.35) * 0.9;
    col *= 0.7 + 0.3 * smoothstep(1.15, 0.25, length(vUv - 0.5) * 1.5);

    // Recuo atrás das colunas de texto: o corpo do texto nunca depende da
    // lanterna nem cai sobre mata clara.
    float xf = fc.x / uRes.x;
    float shadeChart = 0.35 * (1.0 - smoothstep(${COLUMN_END - 0.04}, ${COLUMN_END + 0.03}, xf))
      + 0.15 * uNotes * smoothstep(${NOTES_START - 0.03}, ${NOTES_START + 0.01}, xf);
    float shadeSpine = 0.3 * smoothstep(${SPINE_TEXT_START - 0.05}, ${SPINE_TEXT_START + 0.01}, xf);
    col *= 1.0 - mix(shadeChart, shadeSpine, uMode);
    col *= 1.0 - 0.45 * uDim;
    // A luz da lanterna soma depois do recuo: sobre a mata quase preta
    // (~0,03) o termo só multiplicativo somava ~0,03 e não aparecia. Com
    // +0,08 no centro o halo se vê, e o texto continua com contraste acima
    // de 5:1 mesmo dentro dele (tinta 0,83 sobre ~0,11).
    col += lk * vec3(0.08, 0.05, 0.022) * (1.0 - 0.5 * uDim);
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
          uDpr: { value: 1 },
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uUnit: { value: 900 },
          uAxis: { value: RIVER.chart.axis },
          uAmp: { value: RIVER.chart.amp },
          uHalf: { value: RIVER.chart.half },
          uGrowth: { value: RIVER.chart.growth },
          uStraight: { value: RIVER.chart.straight },
          uHead: { value: RIVER.chart.head },
          uNoise: { value: RIVER.chart.noise },
          uOverhang: { value: RIVER.chart.overhang },
          uHalfRef: { value: 900 },
          uDocH: { value: 0 },
          uMode: { value: 0 },
          uNotes: { value: 1 },
          uLight: { value: new THREE.Vector3(0, 0, 0) },
          uDim: { value: 0 },
          uTier: { value: 0 },
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

  useFrame((state, delta) => {
    const obj = mesh.current;
    if (!obj) return;
    // Material vem do objeto montado (ref), não do escopo do render
    // (regra react-hooks/immutability).
    const u = obj.material.uniforms;
    const s = sceneState;
    const m = RIVER[s.mode];
    (u.uRes.value as THREE.Vector2).set(size.width, size.height);
    u.uDpr.value = state.gl.getPixelRatio();
    // Scroll lido aqui, sem suavização: o SVG do nome rola com a página e o
    // shader tem de estar no mesmo pixel no mesmo quadro.
    const scrollY = window.scrollY;
    u.uScroll.value = scrollY;
    u.uUnit.value = s.unit;
    u.uAxis.value = m.axis;
    u.uAmp.value = m.amp;
    u.uHalf.value = m.half;
    u.uGrowth.value = m.growth;
    u.uStraight.value = m.straight;
    u.uHead.value = s.dim ? 0 : m.head;
    u.uNoise.value = m.noise;
    u.uOverhang.value = m.overhang;
    u.uHalfRef.value = halfRef(s.mode, size.width, s.unit);
    u.uDocH.value = s.docH || scrollY + size.height;
    u.uMode.value = s.mode === "spine" ? 1 : 0;
    u.uNotes.value = size.width >= NOTES_MIN_WIDTH ? 1 : 0;
    u.uTier.value = s.tier === "coarse" ? 1 : 0;
    u.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime;
    u.uDim.value += ((s.dim ? 1 : 0) - u.uDim.value) * 0.08;

    // Lanterna: alvo (topônimo, nota ou foco) vence o ponteiro. Suavizada
    // com constante de tempo, para não depender da taxa de quadros.
    const L = s.light;
    const target = s.lantern.active ? { x: s.lantern.x, y: s.lantern.y - scrollY } : s.pointer.active ? s.pointer : null;
    const want = s.fine && target ? 1 : 0;
    const k = 1 - Math.exp(-delta * (reducedMotion ? 60 : 9));
    if (target) {
      // Ligando do zero: nasce no lugar, sem varrer a tela vindo do canto.
      if (L.on < 0.02) {
        L.x = target.x;
        L.y = target.y;
      }
      L.x += (target.x - L.x) * k;
      L.y += (target.y - L.y) * k;
    }
    L.on += (want - L.on) * (1 - Math.exp(-delta * 4));
    (u.uLight.value as THREE.Vector3).set(L.x, L.y, L.on);
  });

  return <mesh ref={mesh} geometry={geometry} material={material} renderOrder={-1} frustumCulled={false} />;
}
