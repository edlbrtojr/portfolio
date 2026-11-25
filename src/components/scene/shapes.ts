// Geradores das formas que as partículas assumem a cada etapa do scroll.
// Toda forma devolve exatamente `n` pontos (posição + cor), para que o shader
// possa interpolar ponto a ponto entre duas formas quaisquer.
// Unidade: mundo do three.js; as formas cabem numa caixa de ~4 unidades e a
// escala final por etapa é decidida em `layout.ts` conforme a viewport.

export type Shape = { positions: Float32Array; colors: Float32Array };
export type ShapeKey =
  | "chaos"
  | "name"
  | "sources"
  | "lake"
  | "dashboards"
  | "phone"
  | "tree"
  | "helix"
  | "sphere";

type RGB = [number, number, number];

// Paleta da cena: as camadas do medallion viram as cores do site.
export const PALETTE = {
  ink: [0.93, 0.92, 0.89] as RGB,
  bronze: [0.78, 0.51, 0.29] as RGB,
  silver: [0.72, 0.77, 0.8] as RGB,
  gold: [0.91, 0.73, 0.29] as RGB,
  teal: [0.36, 0.72, 0.66] as RGB,
};

// PRNG determinístico (mulberry32): a mesma forma sai igual a cada carga,
// o que evita "pulos" quando a forma é regenerada no resize.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Um aleatório fixo por partícula (atraso da onda, tamanho, brilho). */
export function randoms(n: number): Float32Array {
  const r = rng(10);
  const a = new Float32Array(n);
  for (let i = 0; i < n; i++) a[i] = r();
  return a;
}

function make(n: number) {
  return { positions: new Float32Array(n * 3), colors: new Float32Array(n * 3) };
}

function put(s: Shape, i: number, x: number, y: number, z: number, c: RGB, jitter = 0, r = Math.random) {
  s.positions[i * 3] = x;
  s.positions[i * 3 + 1] = y;
  s.positions[i * 3 + 2] = z;
  // Variação leve de brilho por ponto: sem ela a forma fica chapada.
  const k = 1 - jitter + r() * jitter * 2;
  s.colors[i * 3] = c[0] * k;
  s.colors[i * 3 + 1] = c[1] * k;
  s.colors[i * 3 + 2] = c[2] * k;
}

function mixRGB(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/** Dados brutos espalhados: o estado de carregamento antes de virar o nome. */
export function chaos(n: number): Shape {
  const r = rng(1);
  const s = make(n);
  for (let i = 0; i < n; i++) {
    put(s, i, (r() - 0.5) * 16, (r() - 0.5) * 10, (r() - 0.5) * 8, mixRGB(PALETTE.silver, PALETTE.bronze, r()), 0.3, r);
  }
  return s;
}

/**
 * O nome amostrado de um canvas 2D. `font` precisa já estar carregada
 * (document.fonts.ready) — senão o canvas usa a fonte de fallback.
 * Largura de projeto: 8 unidades.
 */
export function nameShape(n: number, text: string, font: string): Shape {
  const r = rng(2);
  const s = make(n);
  const W = 1400;
  const H = 320;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return chaos(n);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let size = 240;
  ctx.font = `800 ${size}px ${font}`;
  // Ajusta o corpo até o texto caber com folga lateral.
  while (ctx.measureText(text).width > W * 0.94 && size > 40) {
    size -= 8;
    ctx.font = `800 ${size}px ${font}`;
  }
  ctx.fillText(text, W / 2, H / 2);
  const data = ctx.getImageData(0, 0, W, H).data;
  const pts: number[] = [];
  const step = 3;
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      if (data[(y * W + x) * 4 + 3] > 128) pts.push(x, y);
    }
  }
  const count = pts.length / 2;
  if (count === 0) return chaos(n);
  const scale = 8 / W;
  for (let i = 0; i < n; i++) {
    const k = Math.floor(r() * count);
    const x = (pts[k * 2] - W / 2 + (r() - 0.5) * step) * scale;
    const y = -(pts[k * 2 + 1] - H / 2 + (r() - 0.5) * step) * scale;
    put(s, i, x, y, (r() - 0.5) * 0.15, mixRGB(PALETTE.ink, PALETTE.gold, r() * 0.25), 0.15, r);
  }
  return s;
}

/** Fontes de dados num anel, cada uma soltando um fluxo para o centro. */
export function sources(n: number): Shape {
  const r = rng(3);
  const s = make(n);
  // Quantidade escolhida pelo desenho, não pelo lake: abaixo de ~12 o anel
  // parece vazio; acima de ~18 os nós se encostam no celular. O texto ao lado
  // não cita contagem, então não precisa acompanhar o número real de fontes.
  const N = 15;
  const R = 1.9;
  for (let i = 0; i < n; i++) {
    const node = Math.floor(r() * N);
    const a = (node / N) * Math.PI * 2 + Math.PI / 2;
    const nx = Math.cos(a) * R;
    const ny = Math.sin(a) * R * 0.85;
    if (r() < 0.55) {
      // Nó: pequena esfera.
      const u = r() * Math.PI * 2;
      const v = Math.acos(2 * r() - 1);
      const rad = 0.16 * Math.cbrt(r());
      put(s, i, nx + rad * Math.sin(v) * Math.cos(u), ny + rad * Math.sin(v) * Math.sin(u), rad * Math.cos(v), PALETTE.bronze, 0.25, r);
    } else if (r() < 0.85) {
      // Fluxo do nó até o hub central, afinando no caminho.
      const t = r();
      const w = (1 - t) * 0.05;
      put(s, i, nx * (1 - t) + (r() - 0.5) * w, ny * (1 - t) + (r() - 0.5) * w, (r() - 0.5) * w, mixRGB(PALETTE.bronze, PALETTE.gold, t), 0.2, r);
    } else {
      // Hub: onde tudo chega.
      const u = r() * Math.PI * 2;
      const v = Math.acos(2 * r() - 1);
      const rad = 0.42 * Math.cbrt(r());
      put(s, i, rad * Math.sin(v) * Math.cos(u), rad * Math.sin(v) * Math.sin(u), rad * Math.cos(v), PALETTE.gold, 0.2, r);
    }
  }
  return s;
}

/** Medallion: três discos empilhados — bronze, prata e ouro — com fluxos entre eles. */
export function lake(n: number): Shape {
  const r = rng(4);
  const s = make(n);
  const layers: { y: number; c: RGB }[] = [
    { y: -1.15, c: PALETTE.bronze },
    { y: 0, c: PALETTE.silver },
    { y: 1.15, c: PALETTE.gold },
  ];
  const tilt = -0.42; // inclinação para o disco aparecer como elipse em perspectiva
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  for (let i = 0; i < n; i++) {
    let x: number, y: number, z: number, c: RGB;
    if (r() < 0.86) {
      const L = layers[Math.floor(r() * 3)];
      const a = r() * Math.PI * 2;
      // Concentra pontos na borda para o disco ter contorno legível.
      const rad = 1.7 * (r() < 0.35 ? 0.97 + r() * 0.03 : Math.sqrt(r()));
      x = Math.cos(a) * rad;
      z = Math.sin(a) * rad;
      y = L.y + (r() - 0.5) * 0.04;
      c = L.c;
    } else {
      // Colunas de dados subindo de uma camada para a outra.
      const col = Math.floor(r() * 6);
      const a = (col / 6) * Math.PI * 2;
      const t = r();
      x = Math.cos(a) * 0.9 + (r() - 0.5) * 0.04;
      z = Math.sin(a) * 0.9 + (r() - 0.5) * 0.04;
      y = -1.15 + t * 2.3;
      c = t < 0.5 ? mixRGB(PALETTE.bronze, PALETTE.silver, t * 2) : mixRGB(PALETTE.silver, PALETTE.gold, (t - 0.5) * 2);
    }
    // Rotação em X aplicada aqui, uma vez, em vez de no shader.
    put(s, i, x, y * ct - z * st, y * st + z * ct, c, 0.2, r);
  }
  return s;
}

/** 14 barras — os 14 dashboards da plataforma — com uma linha de tendência por cima. */
export function dashboards(n: number): Shape {
  const r = rng(5);
  const s = make(n);
  const heights = [0.9, 1.4, 1.1, 2.0, 1.6, 2.4, 1.9, 1.2, 1.7, 2.6, 2.1, 1.5, 2.8, 2.3];
  const cols = 7;
  const bw = 0.32;
  const gap = 0.2;
  const width = cols * bw + (cols - 1) * gap;
  for (let i = 0; i < n; i++) {
    if (r() < 0.86) {
      const b = Math.floor(r() * heights.length);
      const row = Math.floor(b / cols);
      const col = b % cols;
      const h = heights[b];
      const x0 = -width / 2 + col * (bw + gap);
      const z0 = row === 0 ? -0.35 : 0.35;
      // Pontos na superfície da barra (face, topo e arestas) — fica mais nítido que volume cheio.
      const face = r();
      let x = x0 + r() * bw;
      let y = -1.4 + r() * h;
      let z = z0 + (r() - 0.5) * bw;
      if (face < 0.2) y = -1.4 + h; // topo
      else if (face < 0.45) x = r() < 0.5 ? x0 : x0 + bw; // laterais
      const t = Math.min(1, (y + 1.4) / 2.8);
      if (row === 1) z += 0;
      put(s, i, x, y, z, mixRGB(PALETTE.silver, PALETTE.gold, t), 0.2, r);
    } else {
      // Linha de tendência acima das barras.
      const t = r();
      const x = -width / 2 + t * width;
      const y = 1.75 + Math.sin(t * 5.5) * 0.18 + t * 0.3;
      put(s, i, x, y + (r() - 0.5) * 0.03, 0.8 + (r() - 0.5) * 0.03, PALETTE.teal, 0.15, r);
    }
  }
  return s;
}

function roundedRectPoint(r: () => number, w: number, h: number, rad: number): [number, number] {
  // Ponto uniforme no perímetro de um retângulo de cantos arredondados.
  const straightW = w - 2 * rad;
  const straightH = h - 2 * rad;
  const arc = (Math.PI / 2) * rad;
  const total = 2 * straightW + 2 * straightH + 4 * arc;
  let d = r() * total;
  const segs: [number, (t: number) => [number, number]][] = [
    [straightW, (t) => [-w / 2 + rad + t * straightW, h / 2]],
    [arc, (t) => [w / 2 - rad + Math.sin(t * Math.PI / 2) * rad, h / 2 - rad + Math.cos(t * Math.PI / 2) * rad]],
    [straightH, (t) => [w / 2, h / 2 - rad - t * straightH]],
    [arc, (t) => [w / 2 - rad + Math.cos(t * Math.PI / 2) * rad, -h / 2 + rad - Math.sin(t * Math.PI / 2) * rad]],
    [straightW, (t) => [w / 2 - rad - t * straightW, -h / 2]],
    [arc, (t) => [-w / 2 + rad - Math.sin(t * Math.PI / 2) * rad, -h / 2 + rad - Math.cos(t * Math.PI / 2) * rad]],
    [straightH, (t) => [-w / 2, -h / 2 + rad + t * straightH]],
    [arc, (t) => [-w / 2 + rad - Math.cos(t * Math.PI / 2) * rad, h / 2 - rad + Math.sin(t * Math.PI / 2) * rad]],
  ];
  for (const [len, f] of segs) {
    if (d <= len) return f(d / len);
    d -= len;
  }
  return [0, 0];
}

/** Celular com conversa de WhatsApp: o atendimento do Milix e do chatbot da distribuidora. */
export function phone(n: number): Shape {
  const r = rng(6);
  const s = make(n);
  const W = 2.0;
  const H = 3.9;
  const bubbles = [
    { x: -0.3, y: 1.15, w: 1.05, h: 0.38, me: false },
    { x: 0.32, y: 0.6, w: 0.95, h: 0.38, me: true },
    { x: -0.22, y: 0.0, w: 1.2, h: 0.55, me: false },
    { x: 0.3, y: -0.62, w: 1.0, h: 0.38, me: true },
    { x: -0.35, y: -1.12, w: 0.85, h: 0.32, me: false },
  ];
  for (let i = 0; i < n; i++) {
    const k = r();
    if (k < 0.34) {
      const [x, y] = roundedRectPoint(r, W, H, 0.32);
      put(s, i, x, y, (r() - 0.5) * 0.05, PALETTE.ink, 0.15, r);
    } else if (k < 0.4) {
      // Barra do topo (nome do contato).
      put(s, i, -0.85 + r() * 1.7, 1.62 + (r() - 0.5) * 0.06, 0, PALETTE.silver, 0.15, r);
    } else {
      const b = bubbles[Math.floor(r() * bubbles.length)];
      const filled = r() < 0.45;
      let x: number, y: number;
      if (filled) {
        x = b.x + (r() - 0.5) * b.w;
        y = b.y + (r() - 0.5) * b.h;
      } else {
        [x, y] = roundedRectPoint(r, b.w, b.h, 0.14);
        x += b.x;
        y += b.y;
      }
      put(s, i, x, y, 0.05, b.me ? PALETTE.gold : PALETTE.teal, 0.25, r);
    }
  }
  return s;
}

/** Árvore de decisão: os fluxos da Biblioteca de Processos e a máquina de estados do chatbot. */
export function tree(n: number): Shape {
  const r = rng(7);
  const s = make(n);
  const nodes: { x: number; y: number }[] = [];
  const edges: [number, number][] = [];
  const levels = [1, 2, 4, 6];
  let id = 0;
  const byLevel: number[][] = [];
  levels.forEach((count, L) => {
    const row: number[] = [];
    for (let k = 0; k < count; k++) {
      nodes.push({ x: (k - (count - 1) / 2) * (3.6 / Math.max(count, 2)), y: 1.6 - L * 1.05 });
      row.push(id++);
    }
    byLevel.push(row);
  });
  for (let L = 1; L < byLevel.length; L++) {
    byLevel[L].forEach((child, k) => {
      const parents = byLevel[L - 1];
      edges.push([parents[Math.min(parents.length - 1, Math.floor((k * parents.length) / byLevel[L].length))], child]);
    });
  }
  for (let i = 0; i < n; i++) {
    if (r() < 0.5) {
      const nd = nodes[Math.floor(r() * nodes.length)];
      // Nó como cartão (retângulo pequeno), como no editor de fluxos.
      const [x, y] = r() < 0.6 ? roundedRectPoint(r, 0.62, 0.3, 0.08) : [(r() - 0.5) * 0.5, (r() - 0.5) * 0.2];
      put(s, i, nd.x + x, nd.y + y, (r() - 0.5) * 0.05, nd.y > 1 ? PALETTE.gold : PALETTE.ink, 0.2, r);
    } else {
      const [a, b] = edges[Math.floor(r() * edges.length)];
      const t = r();
      const A = nodes[a];
      const B = nodes[b];
      // Aresta em "cotovelo" suave (curva S), não reta.
      const e = t * t * (3 - 2 * t);
      put(s, i, A.x + (B.x - A.x) * e, A.y - 0.15 + (B.y - A.y + 0.3) * t, 0, PALETTE.teal, 0.2, r);
    }
  }
  return s;
}

/** Hélice: a trajetória, de professor de inglês a engenheiro de dados. */
export function helix(n: number): Shape {
  const r = rng(8);
  const s = make(n);
  const turns = 2.6;
  const H = 4.0;
  for (let i = 0; i < n; i++) {
    const t = r();
    const strand = r() < 0.5 ? 0 : Math.PI;
    const a = t * turns * Math.PI * 2 + strand;
    const y = -H / 2 + t * H;
    if (r() < 0.82) {
      put(s, i, Math.cos(a) * 1.1 + (r() - 0.5) * 0.06, y, Math.sin(a) * 1.1 + (r() - 0.5) * 0.06, mixRGB(PALETTE.bronze, PALETTE.gold, t), 0.2, r);
    } else {
      // Degraus ligando as duas fitas.
      const k = Math.round(t * 22) / 22;
      const a2 = k * turns * Math.PI * 2;
      const u = r() * 2 - 1;
      put(s, i, Math.cos(a2) * 1.1 * u, -H / 2 + k * H, Math.sin(a2) * 1.1 * u, PALETTE.silver, 0.2, r);
    }
  }
  return s;
}

/** Esfera de Fibonacci com anel: o fim do caminho, o contato. */
export function sphere(n: number): Shape {
  const r = rng(9);
  const s = make(n);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    if (r() < 0.8) {
      const k = i % Math.floor(n * 0.8);
      const y = 1 - (k / (n * 0.8 - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const a = golden * k;
      const R = 1.55;
      put(s, i, Math.cos(a) * rad * R, y * R, Math.sin(a) * rad * R, mixRGB(PALETTE.silver, PALETTE.gold, (y + 1) / 2), 0.25, r);
    } else {
      const a = r() * Math.PI * 2;
      const R = 2.3 + (r() - 0.5) * 0.08;
      const tilt = 0.35;
      const x = Math.cos(a) * R;
      const z = Math.sin(a) * R;
      put(s, i, x, z * Math.sin(tilt) * 0.5, z * Math.cos(tilt), PALETTE.gold, 0.2, r);
    }
  }
  return s;
}
