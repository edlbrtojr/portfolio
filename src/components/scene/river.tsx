"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { COLUMN_END, halfRef, NOTES_MIN_WIDTH, NOTES_START, RIVER, RIVER_GLSL, SPINE_TEXT_START } from "./river-curve";
import { sceneState, wakeScene } from "./store";

/**
 * Duração da chegada do luar. As letras do nome acendem em ~1,9 s (chart.css,
 * `acender`); o luar leva um pouco mais para a mata ainda estar abrindo
 * quando o nome já está escrito.
 */
const REVEAL_S = 2.8;

// A Amazônia vista de cima, como carta: copas desenhadas uma a uma, o rio
// Acre, praias nas curvas e névoa. A página é uma noite inteira descendo o
// rio: abre no luar (a lua na água logo abaixo do nome), clareia rio abaixo e
// o sol nasce na foz, onde está o convite (ver dawnAt em river-curve.ts).
// O mapa anda 1:1 com a página (é o próprio documento), e o
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
  uniform float uDawnOn;  // 1 na home (a noite acaba na foz), 0 nos cases
  uniform float uReveal;  // 0 → 1 na chegada: o luar desce o rio
  varying vec2 vUv;
  ${RIVER_GLSL}

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

  // Worley: distância ao centro da copa mais próxima (x), um sorteio por copa
  // (y) e a distância à segunda mais próxima (z). z - x vai a zero na emenda
  // entre duas copas: é o que deixa desenhar a fresta entre elas. Só com x a
  // copa era um disco com halo escuro em volta e a mata lia como seixo.
  // toCenter: o vetor do pixel até o centro da copa. Dele sai o relevo (de
  // que lado da copa o pixel está em relação à luz) sem um segundo Worley.
  vec3 crowns(vec2 p, out vec2 toCenter) {
    vec2 i = floor(p); vec2 f = fract(p);
    float md = 8.0; float md2 = 8.0; float id = 0.0;
    toCenter = vec2(0.0);
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 g = vec2(float(x), float(y));
        vec2 h = hash2(i + g);
        vec2 r = g + 0.5 + 0.42 * sin(6.2831 * h) - f;
        float d = dot(r, r);
        if (d < md) { md2 = md; md = d; id = h.x; toCenter = r; }
        else if (d < md2) { md2 = d; }
      }
    }
    return vec3(sqrt(md), id, sqrt(md2));
  }

  float fbmLite(vec2 p) { return 0.65 * noise2(p) + 0.35 * noise2(p * 2.03 + 11.7); }

  // Distância ao centro da copa mais próxima (0 no centro, ~0,7 no vão entre
  // copas), guardada pela forest() para a beira do rio: copa perto da margem
  // avança sobre a água.
  float gCrown;

  // blue: a hora azul (o ambiente sobe). warm: o sol rasante (acende o lado
  // iluminado de cada copa).
  vec3 forest(vec2 p, float blue, float warm) {
    // Empena a grade antes do Worley: as células esticam e encolhem em
    // manchas de ~4 copas. Com a grade reta toda copa tinha o mesmo tamanho
    // e, assim que a manhã clareia a mata, ela lia como calçamento.
    vec2 q = p + 0.011 * vec2(noise2(p * 8.0), noise2(p * 8.0 + 31.7));
    vec2 toC;
    vec3 a = crowns(q * 34.0, toC);
    gCrown = a.x;
    // Tufos dentro da copa: diferença do ruído para um ponto deslocado na
    // direção da luz, em ~6 px. Sem eles cada copa era um domo liso, e domo
    // liso lado a lado lê como seixo.
    float tuft = (noise2(q * 140.0) - noise2(q * 140.0 + vec2(0.35, -0.35))) * 0.8;
    // Relevo de cada copa: a luz (a lua e depois o sol) vem de um lado só,
    // então a face da copa virada para ela é clara e a oposta, escura. O
    // + 0,08 arredonda o alto do domo; com mais que isso (0,25, testado) o
    // contraste entre copas vizinhas cai e a mata lê como pano amassado.
    // Antes isto custava um segundo Worley e o aparelho modesto ficava sem
    // relevo nenhum; com o vetor ao centro, vale nos dois.
    float lit = clamp(0.5 - 0.5 * dot(toC / (length(toC) + 0.08), vec2(0.7071, -0.7071)) + tuft, 0.0, 1.0);
    vec3 g1 = vec3(0.03, 0.075, 0.045);
    vec3 g2 = vec3(0.05, 0.085, 0.04);
    vec3 g3 = vec3(0.025, 0.06, 0.055);
    vec3 tone = a.y < 0.33 ? g1 : a.y < 0.66 ? g2 : g3;
    // Cada copa com o seu brilho (árvore nova, árvore velha).
    tone *= 0.8 + 0.45 * fract(a.y * 37.0);
    // À noite o luar só deixa ver o tom; na hora azul a mata esfria, e com
    // o sol vira verde de verdade.
    tone *= mix(vec3(1.0), vec3(0.85, 1.15, 1.2), blue * (1.0 - warm));
    tone *= mix(vec3(1.0), vec3(1.15, 1.4, 0.9), warm);
    // O relevo é só luz: lado iluminado claro, lado de sombra escuro. A
    // fresta entre duas copas (crown → 0) aparece apenas do lado da sombra.
    // Fresta igual em toda a volta (testada) desenhava escama de jacaré, e
    // escurecer a copa do centro para a beira desenhava seixo.
    float crown = smoothstep(0.0, 0.1, a.z - a.x);
    vec3 col = tone * (0.3 + 1.15 * lit);
    col *= mix(0.45 + 0.4 * lit, 1.0, crown);
    // Fio de prata do luar no alto das copas; some quando o dia chega.
    col += vec3(0.02, 0.036, 0.05) * lit * lit * (1.0 - blue);
    // Árvores emergentes (as que furam o dossel): um Worley a mais, só no
    // aparelho completo. No celular fica um Worley por pixel.
    if (uTier < 0.5) {
      vec2 unused;
      vec3 big = crowns(q * 12.0 + 3.1, unused);
      float emergent = smoothstep(0.5, 0.08, big.x) * step(0.72, big.y);
      col = mix(col, vec3(0.06, 0.11, 0.06) * (0.6 + 0.6 * lit), emergent * 0.75);
    }
    // Folhagem: grão de ~2 px por cima dos tufos.
    col *= 0.85 + 0.3 * noise2(q * 380.0);
    // Ipê florido: raro, amarelo ou rosa.
    if (a.y > 0.995) col = mix(col, a.y > 0.9975 ? vec3(0.2, 0.15, 0.035) : vec3(0.16, 0.07, 0.1), smoothstep(0.7, 0.35, a.x) * (0.4 + 0.5 * lit));
    // Uniform: o desvio é o mesmo para todos os pixels, a GPU não paga os dois lados.
    float tex;
    if (uTier < 0.5) tex = fbm2(p * 2.5);
    else tex = fbmLite(p * 2.5);
    col *= 0.7 + 0.6 * tex;
    // Amanhecer: o ambiente sobe 50% na hora azul e mais 30% com o sol. Com
    // o sol baixo o lado da sombra escurece (sombra comprida) e só o lado
    // iluminado de cada copa pega âmbar: a média da mata continua escura,
    // quem clareia são os topos. O texto creme da coluna depende disso e do
    // recuo de main().
    col *= 1.0 + 0.5 * blue + 0.3 * warm;
    col *= mix(1.0, 0.5 + lit, warm);
    col += vec3(0.42, 0.25, 0.08) * warm * lit * lit * lit * (0.5 + 0.7 * tex);
    return col;
  }

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
    // A noite acaba rio abaixo. Por pixel, não por tela: a parte de baixo da
    // janela está mais adiante no rio e clareia antes, então quem rola vê a
    // manhã subindo e sabe que a página está chegando ao fim.
    float dawn = riverDawn(wy) * uDawnOn;
    float blue = smoothstep(0.0, 0.55, dawn);
    float warm = smoothstep(0.45, 1.0, dawn);

    vec3 col = forest(p, blue, warm) * 0.8;
    float t = uTime;

    // Nuvens passando na frente da lua: poças largas de luar andando devagar
    // sobre a mata. Sem elas a noite era um tom só de ponta a ponta e a mata
    // lia como textura chapada; com elas há perto e longe. Duas oitavas
    // (fbmLite) bastam para uma mancha de ~1 tela, inclusive no celular.
    float pool = smoothstep(0.3, 0.75, fbmLite(p * 0.6 + vec2(t * 0.008, t * 0.004)));
    // A abertura está sempre numa poça de luar. A tela do celular tem menos
    // de meia mancha de largura: quando calhava de carregar na sombra de uma
    // nuvem, a primeira impressão era um retângulo preto.
    pool = max(pool, 1.0 - smoothstep(0.7, 1.5, wy));
    col *= mix(0.7, 1.55, pool) * (1.0 - warm) + warm;
    col += vec3(0.002, 0.006, 0.011) * pool * (1.0 - warm);

    // Igarapés e lagos em ferradura saíram (2026-11-25). Em três rodadas de
    // crítica continuaram lendo como defeito de imagem: o igarapé era curva
    // de nível de ruído (laço fechado, risco solto na mata) e o lago, um "C"
    // avulso. Água na carta agora é só o rio. Se voltarem, têm de nascer do
    // rio (afluente que deságua), não de ruído.

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
      // A água é o céu: azul mais claro na hora azul e, com o sol, ouro com
      // manchas de rosa. É o ponto mais claro da página inteira, de
      // propósito, e fica onde está o convite.
      // Primeiro rosa, depois ouro pálido, com nuvens rosadas boiando no
      // reflexo. Pálido de propósito: laranja saturado e chapado (a primeira
      // tentativa) lia como lava, não como céu na água.
      sky = mix(sky, vec3(0.2, 0.3, 0.42), blue);
      float cloudR = smoothstep(0.35, 0.7, noise2(vec2(across * 0.8 + 1.0, wy * 0.9 - t * 0.01)));
      vec3 sun = mix(vec3(0.84, 0.5, 0.5), vec3(1.0, 0.77, 0.47), clamp(smoothstep(0.25, 0.95, warm) - 0.35 * cloudR, 0.0, 1.0));
      sky = mix(sky, sun, smoothstep(0.0, 0.6, warm));
      vec3 riverCol = sky * (0.9 + 0.2 * noise2(vec2(across * 2.0, wy * 4.0 - t * 0.05)));
      // Os dois astros na água, um em cada ponta da noite: a lua logo abaixo
      // do nome (y = 1,08: desponta no pé da primeira tela e chama a rolar) e o sol no
      // meio da última tela (0,42 antes do fim), ao lado do convite. Mancha
      // de brilho alongada no sentido do rio, sem disco: visto de cima, astro
      // na água é um clarão estourado, não um círculo.
      float sunGlow = uDawnOn * exp(-pow((wy - uDocH / uUnit + 0.42) / 0.22, 2.0)) * exp(-across * across / 0.55);
      float moonGlow = (1.0 - uDim) * exp(-pow((wy - 1.08) / 0.075, 2.0)) * exp(-across * across / 0.3);
      // A sombra da nuvem também passa pela água.
      riverCol *= mix(0.8, 1.12, pool) * (1.0 - warm) + warm;
      // A copa se espelha na beira: faixa escura de borda irregular, mais
      // funda onde a copa debruça.
      // Faixa estreita (o último quinto da meia largura): com ela começando
      // em 55%, a beira da água ficava quase da cor da mata, o rio parecia
      // mais estreito do que é e as letras do nome, que cabem na água
      // medida, pareciam sair dela.
      float mirror = smoothstep(0.76, 1.0, aa + 0.14 * (noise2(vec2(wy * 26.0, side * 5.0)) - 0.5) + overhang / max(w, 1.0));
      // Junto da praia não há copa para espelhar: a água clara vai até a areia.
      mirror *= 1.0 - 0.8 * bar;
      riverCol = mix(riverCol, vec3(0.03, 0.05, 0.05) * (1.0 + 1.5 * warm), mirror * 0.7);
      riverCol += mix(vec3(0.11, 0.135, 0.15), vec3(0.14, 0.1, 0.05), warm) * moon * (1.0 - mirror);
      riverCol += (vec3(0.75, 0.62, 0.42) * sunGlow + vec3(0.4, 0.46, 0.5) * moonGlow) * (1.0 - mirror);
      // Cintilação: pontos de ~5 px, raros, concentrados no luar. Duas
      // camadas andando em sentidos opostos fazem cada ponto acender e
      // apagar enquanto desce o rio (antes eram traços brancos parados, que
      // liam como faixa de rodovia).
      // Com o sol a cintilação adensa (limiar mais baixo) e sai do luar: a
      // água inteira faísca.
      float astro = max(sunGlow, moonGlow);
      float g1 = smoothstep(0.86 - 0.2 * warm - 0.2 * astro, 0.98, noise2(vec2(across * 7.0, wy * 180.0 - t * 0.9)));
      float g2 = smoothstep(0.45, 0.8, noise2(vec2(across * 4.0 + 7.0, wy * 70.0 + t * 0.5)));
      float glint = g1 * g2 * mix(moon, 1.0, max(0.7 * warm, astro)) * (1.0 - mirror);
      glint *= 1.0 + 2.0 * lk;
      riverCol += mix(vec3(0.55, 0.6, 0.62), vec3(1.0, 0.92, 0.72), warm) * glint;
      // Sem fio claro de barranco: debaixo da copa a beira é escura, e um
      // contorno claro e contínuo lia como acostamento. A areia das praias
      // (acima) já marca as curvas.
      col = mix(col, riverCol, water);
    }

    // Névoa baixa com velocidade própria: dá altura ao voo.
    // Na hora azul ela engrossa (a cerração de antes do sol) e junta sobre a
    // água; com o sol fica cor de pêssego e rala.
    if (uTier < 0.5) {
      float overWater = exp(-abs(dist) / (w * 2.5 + 1.0));
      float mist = smoothstep(0.55 - 0.14 * blue - 0.1 * blue * overWater, 0.9, fbm2(p * 1.3 + vec2(t * 0.012, -uScroll / uUnit * 0.3)));
      vec3 mistCol = mix(vec3(0.07, 0.085, 0.09), vec3(0.15, 0.19, 0.25), blue);
      mistCol = mix(mistCol, vec3(0.6, 0.4, 0.28), warm);
      col += mistCol * mist * (0.35 + 0.2 * blue);
    }

    col *= 1.0 + lk * vec3(1.2, 0.75, 0.35) * 0.9;
    col *= 0.7 + 0.3 * smoothstep(1.15, 0.25, length(vUv - 0.5) * 1.5);

    // Recuo atrás das colunas de texto: o corpo do texto nunca depende da
    // lanterna nem cai sobre mata clara.
    float xf = fc.x / uRes.x;
    // Com o sol a mata clareia: o recuo da coluna cresce junto (0,35 → 0,55).
    float shadeChart = (0.35 + 0.2 * warm) * (1.0 - smoothstep(${COLUMN_END - 0.04}, ${COLUMN_END + 0.03}, xf))
      + 0.15 * uNotes * smoothstep(${NOTES_START - 0.03}, ${NOTES_START + 0.01}, xf);
    float shadeSpine = 0.3 * smoothstep(${SPINE_TEXT_START - 0.05}, ${SPINE_TEXT_START + 0.01}, xf);
    col *= 1.0 - mix(shadeChart, shadeSpine, uMode);
    col *= 1.0 - 0.45 * uDim;
    // A chegada: a página abre no escuro e o luar desce o rio, da nascente
    // (topo) para baixo, e da água para a mata. 3,3 = 1 + o maior desconto
    // possível (1,27 de distância na lombada + 0,9 de altura): em uReveal = 1
    // todo pixel já está aceso.
    float reveal = smoothstep(0.0, 1.0, uReveal * 3.3 - abs(dist) / (0.7 * uRes.x) - (1.0 - vUv.y) * 0.9);
    col *= mix(0.06, 1.0, reveal);
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
  const revealStart = useRef<number | null>(null);
  // A cena precisa de quadros em ritmo cheio até o luar terminar de descer.
  useEffect(() => wakeScene(REVEAL_S * 1000 + 500), []);

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
          uDawnOn: { value: 0 },
          uReveal: { value: 0 },
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
    // Sem a altura do documento medida o "fim" seria o pé da janela e a
    // abertura piscaria em manhã; nos cases (dim) a noite não acaba.
    u.uDawnOn.value = s.docH && !s.dim ? 1 : 0;
    // O relógio do r3f aqui é o performance.now da página (ver Pacer), então
    // a chegada conta a partir do primeiro quadro desenhado, não do zero.
    revealStart.current ??= state.clock.elapsedTime;
    const r = reducedMotion ? 1 : Math.min(1, (state.clock.elapsedTime - revealStart.current) / REVEAL_S);
    u.uReveal.value = r * r * (3 - 2 * r);

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
