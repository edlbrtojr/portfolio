// A curva do rio numa fonte só. O shader (river.tsx) desenha a água, o SVG
// (chart/river-type.tsx) escreve o nome e a correnteza em cima dela, e o CSS
// posiciona as colunas de texto nas margens. Se cada um tivesse a própria
// fórmula, o nome escorregaria para fora da água no primeiro ajuste. Mudou uma
// constante aqui, muda nos três.
//
// Unidades: y em "unidades da carta" (1 unidade = altura da janela medida na
// carga, ver chart/geometry.ts), crescendo para baixo no documento. x em
// fração da largura útil W (clientWidth, sem a barra de rolagem).

export type ChartMode = "chart" | "spine";

/** Abaixo disso o rio vira lombada à esquerda e o texto ocupa o resto. */
export const CHART_MIN_WIDTH = 768;
/** Notas de margem só cabem ao lado do rio a partir daqui; abaixo viram rodapé. */
export const NOTES_MIN_WIDTH = 1100;

/**
 * Por que estes números (modo `chart`): a curva oscila ±1,5·amp em torno do
 * eixo, então o rio fica entre 0,4625 e 0,7175 de W. A coluna de texto termina
 * em 0,44 de W (a 1440 px dá 633 px, o mesmo `max-w-[36rem]` da versão
 * anterior com o gutter) e as notas começam em 0,74. Se mexer no eixo ou na
 * amplitude, confira que o rio continua entre COLUMN_END e NOTES_START.
 * No `spine` a lombada fica em 0,11 ± 0,0375 de W e o texto começa em 0,24.
 */
export const RIVER = {
  // `growth`: quanto a meia largura cresce na foz (2 = triplica). `straight`:
  // quanto o meandro se endireita lá (0,8 = sobra 20% da curva). Os dois
  // andam juntos: sem endireitar, a foz larga num ponto de curva fechada
  // (centro em 0,4625) invadia a coluna de texto em 0,04 de W.
  // `maxAspect`: a meia largura usa min(unidade, W / maxAspect) como régua.
  // Em tela retrato no modo carta (tablet de 1024×1366) a unidade é alta e o
  // rio engordava até 0,42–0,76 de W, por cima do texto e das notas.
  // `head`: quanto a meia largura cresce no estirão da abertura, onde o nome
  // está escrito. 1,7 é o teto: a 1440×900 a margem esquerda chega a ~10 px
  // da coluna de texto em y ≈ 0,8 (o teste de river-curve.test.mjs pega se
  // passar). Mais largo que isso, o nome teria de encolher de outro jeito.
  // `noise`: variação da largura ao longo das margens (±noise/2); margem lisa
  // é o que faz rio parecer estrada. `overhang`: px de copa debruçada sobre a
  // água. Os dois entram no tamanho do nome (safeHalfPx): letra nenhuma pode
  // sair da água, nem no ponto mais estreito do recorte.
  chart: { axis: 0.59, amp: 0.085, half: 0.038, growth: 2, straight: 0.8, head: 1.7, maxAspect: 1.6, noise: 0.22, overhang: 8 },
  // Na lombada a foz não alarga: o rio já está colado na borda esquerda e o
  // texto começa em 0,24 de W. Com 54 px de água, 8 px de copa e ±14% de
  // recorte comiam um terço do rio e o nome caía para ~45 px; por isso
  // recorte e copa menores aqui.
  spine: { axis: 0.11, amp: 0.025, half: 0.02, growth: 0, straight: 0, head: 1, maxAspect: Infinity, noise: 0.16, overhang: 3 },
} as const;

/**
 * O estirão da abertura: largura cheia até 1,3 unidade e volta ao normal ao
 * longo de uma tela inteira, até 2,3. Antes ia de 0,7 a 1,5: o rio inchava em
 * volta do nome e afinava de repente logo abaixo, e o contorno lia como
 * marca-texto, não como rio. A largura cheia tem de cobrir o nome enquanto
 * ele desce (NAME.drift) até sumir (NAME.fadeTo).
 */
export const HEAD_FROM = 1.3;
export const HEAD_TO = 2.3;

export const COLUMN_END = 0.44;
export const NOTES_START = 0.74;
export const SPINE_TEXT_START = 0.24;

/** A foz: as últimas 1,5 unidade do documento (o contato). */
export const MOUTH_UNITS = 1.5;

/**
 * O amanhecer: a carta começa em noite fechada e clareia rio abaixo, até o
 * sol nascer na foz (o contato). Em unidades antes do fim do documento:
 * começa 2,4 telas antes (em "agora", depois do trabalho, que se lê à noite)
 * e está inteiro 0,4 tela antes do fim, quando o convite ocupa a tela. Se a
 * ordem das seções mudar, confira que o trabalho continua na noite: os
 * topônimos creme foram desenhados para fundo escuro.
 */
export const DAWN_FROM = 2.4;
export const DAWN_TO = 0.4;

/** 0 noite, 1 sol nascido, para y e a altura do documento em unidades. */
export function dawnAt(y: number, docUnits: number) {
  return Number.isFinite(docUnits) && docUnits > 0 ? smoothstep(docUnits - DAWN_FROM, docUnits - DAWN_TO, y) : 0;
}

/** Passo de amostragem do SVG: 0,02 unidade (~18 px a 900 px) já não mostra quina. */
export const SAMPLE_STEP = 0.02;

// Quatro senoides de períodos que não se repetem juntos: meandros irregulares
// como os do Acre visto de satélite. O ruído com hash de `sin` que havia antes
// saiu de propósito: em float32 (GPU) e float64 (JS) ele dá valores diferentes
// e o nome em SVG descolava da água do shader.
const WAVES: ReadonlyArray<readonly [amp: number, freq: number, phase: number]> = [
  [0.6, 6.8, 0],
  [0.45, 3.1, 1.3],
  [0.25, 11.3, 2.0],
  [0.2, 1.7, 0.4],
];

export function modeFor(width: number): ChartMode {
  return width >= CHART_MIN_WIDTH ? "chart" : "spine";
}

/** Soma das senoides, entre -1,5 e 1,5. */
export function riverWave(y: number) {
  let v = 0;
  for (const [a, f, p] of WAVES) v += a * Math.sin(f * y + p);
  return v;
}

/** Derivada exata da soma, para tangentes contínuas no SVG. */
function riverWaveDy(y: number) {
  let v = 0;
  for (const [a, f, p] of WAVES) v += a * f * Math.cos(f * y + p);
  return v;
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** 0 no curso, 1 no fim do documento. */
function mouth(y: number, docUnits: number) {
  return Number.isFinite(docUnits) ? smoothstep(docUnits - MOUTH_UNITS, docUnits, y) : 0;
}

/**
 * Centro da água em fração de W, para y em unidades. Sem `docUnits` não há
 * foz (o caminho do nome, no topo, nunca chega lá).
 */
export function riverX(y: number, mode: ChartMode, docUnits = Infinity) {
  const m = RIVER[mode];
  return m.axis + m.amp * riverWave(y) * (1 - m.straight * mouth(y, docUnits));
}

/** Meia largura em unidades de `halfRef`: respira um pouco ao longo do curso e alarga na foz. */
export function riverHalf(y: number, mode: ChartMode, docUnits: number) {
  const m = RIVER[mode];
  const head = 1 + m.head * (1 - smoothstep(HEAD_FROM, HEAD_TO, y));
  return m.half * (1 + 0.2 * Math.sin(2.3 * y)) * (1 + m.growth * mouth(y, docUnits)) * head;
}

/** Régua da meia largura em px (ver `maxAspect`). */
export function halfRef(mode: ChartMode, W: number, unit: number) {
  const cap = RIVER[mode].maxAspect;
  // Infinity = sem teto (W / Infinity daria 0 e o rio sumiria).
  return Number.isFinite(cap) ? Math.min(unit, W / cap) : unit;
}

// GLSL quer "1.0", não "1".
const g = (n: number) => (Number.isInteger(n) ? n.toFixed(1) : String(n));

/**
 * A mesma curva em GLSL, montada das mesmas constantes. Declara as uniforms
 * que usa; quem inclui só precisa preenchê-las.
 */
export const RIVER_GLSL = /* glsl */ `
  uniform float uAxis;
  uniform float uAmp;
  uniform float uHalf;
  uniform float uGrowth;
  uniform float uStraight;
  uniform float uHead;
  uniform float uHalfRef;
  uniform float uUnit;
  uniform float uDocH;
  uniform float uNoise;
  uniform float uOverhang;
  float riverWave(float y) {
    return ${WAVES.map(([a, f, p]) => `${g(a)} * sin(${g(f)} * y + ${g(p)})`).join(" + ")};
  }
  float riverMouth(float y) {
    float docU = uDocH / uUnit;
    return smoothstep(docU - ${g(MOUTH_UNITS)}, docU, y);
  }
  // O mesmo dawnAt do JS (os vaga-lumes apagam por ele).
  float riverDawn(float y) {
    float docU = uDocH / uUnit;
    return smoothstep(docU - ${g(DAWN_FROM)}, docU - ${g(DAWN_TO)}, y);
  }
  float riverX(float y) { return uAxis + uAmp * riverWave(y) * (1.0 - uStraight * riverMouth(y)); }
  // Em px (já multiplicada pela régua de halfRef).
  float riverHalfPx(float y) {
    float head = 1.0 + uHead * (1.0 - smoothstep(${g(HEAD_FROM)}, ${g(HEAD_TO)}, y));
    return uHalf * (1.0 + 0.2 * sin(2.3 * y)) * (1.0 + uGrowth * riverMouth(y)) * head * uHalfRef;
  }
`;

/** Pontos da linha central em px, com o comprimento acumulado (para `startOffset`). */
export type RiverArc = { d: string; y0: number; step: number; len: number[] };

/**
 * O caminho é feito de cúbicas de Hermite com a derivada exata da curva, não
 * de segmentos retos. Numa polilinha a tangente salta a cada amostra, e o
 * <textPath> gira cada letra pela tangente no meio dela: com letras de 270 px
 * deslizando pelo caminho (o nome anda com o scroll), cada salto virava um
 * tranco visível. Com tangente contínua as letras giram suavemente.
 */
export function riverArc(y0: number, y1: number, W: number, unit: number, mode: ChartMode, offset = 0): RiverArc {
  const n = Math.max(2, Math.ceil((y1 - y0) / SAMPLE_STEP));
  const step = (y1 - y0) / n;
  const ampW = RIVER[mode].amp * W;
  // Ponto da curva deslocado `offset` px para a esquerda de quem desce o rio
  // (o "pé" das letras): a linha de base do nome fica paralela ao centro.
  const at = (y: number): [number, number] => {
    const x = riverX(y, mode) * W;
    if (!offset) return [x, y * unit];
    const dx = ampW * riverWaveDy(y);
    const k = offset / Math.hypot(dx, unit);
    return [x - unit * k, y * unit + dx * k];
  };
  const len: number[] = [0];
  const f = (v: number) => v.toFixed(2);
  const h = step / 50;
  let d = "";
  let px = 0;
  let py = 0;
  let pdx = 0;
  let pdy = 0;
  for (let i = 0; i <= n; i++) {
    const y = y0 + i * step;
    const [x, yy] = at(y);
    // Derivada (numérica, para valer também na curva deslocada) vezes um
    // terço do passo: os pontos de controle de Hermite.
    const [xa, ya] = at(y + h);
    const [xb, yb] = at(y - h);
    const dx = ((xa - xb) / (2 * h)) * (step / 3);
    const dy = ((ya - yb) / (2 * h)) * (step / 3);
    if (!i) d = `M${f(x)} ${f(yy)}`;
    else {
      d += `C${f(px + pdx)} ${f(py + pdy)} ${f(x - dx)} ${f(yy - dy)} ${f(x)} ${f(yy)}`;
      len.push(len[i - 1] + Math.hypot(x - px, yy - py));
    }
    px = x;
    py = yy;
    pdx = dx;
    pdy = dy;
  }
  return { d, y0, step, len };
}

/** `d` da linha central entre y0 e y1 (unidades), em px. */
export function riverPathD(y0: number, y1: number, W: number, unit: number, mode: ChartMode) {
  return riverArc(y0, y1, W, unit, mode).d;
}

/** Comprimento ao longo do caminho até a altura y (interpolado entre amostras). */
export function arcAt(arc: RiverArc, y: number) {
  const t = (y - arc.y0) / arc.step;
  const i = Math.min(arc.len.length - 2, Math.max(0, Math.floor(t)));
  const f = Math.min(1, Math.max(0, t - i));
  return arc.len[i] + (arc.len[i + 1] - arc.len[i]) * f;
}

/** O inverso de arcAt: a altura (unidades) em que o caminho atinge o comprimento s. */
export function yAtArc(arc: RiverArc, s: number) {
  const { len } = arc;
  let lo = 0;
  let hi = len.length - 1;
  if (s <= 0) return arc.y0 + (s / Math.max(1e-6, len[1])) * arc.step;
  if (s >= len[hi]) return arc.y0 + hi * arc.step;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (len[mid] <= s) lo = mid;
    else hi = mid;
  }
  return arc.y0 + (lo + (s - len[lo]) / (len[hi] - len[lo])) * arc.step;
}

/**
 * Meia largura (px, perpendicular ao curso) que é água com certeza: a menor
 * que o recorte da margem (noise) e a copa debruçada (overhang) deixam, menos
 * 2 px da borda suavizada do shader. É a régua do tamanho do nome.
 */
export function safeHalfPx(y: number, mode: ChartMode, W: number, unit: number) {
  const m = RIVER[mode];
  return riverHalf(y, mode, Infinity) * halfRef(mode, W, unit) * (1 - m.noise / 2) - m.overhang - 2;
}

/**
 * Como o nome se move. `size`: tamanho máximo (fração da unidade na carta, de
 * W na lombada). `span`: trecho da primeira tela em que ele é centrado.
 * `drift`: o nome desce o rio a essa fração da velocidade do scroll.
 * `fadeFrom`/`fadeTo`: telas roladas em que ele esmaece. Na lombada some mais
 * cedo: o nome vertical fica no canto superior esquerdo, onde a marca da
 * moldura reaparece quando o h1 sai da tela.
 *
 * Na carta o nome não desce (drift 0). Logo abaixo da abertura o rio faz
 * uma curva fechada (raio de ~150 px em y ≈ 0,8) e uma letra de 150 px de
 * altura é rígida: descendo para dentro da curva, as hastes saíam pela margem
 * de fora mesmo com a largura certa (captura r3 a 0,6 tela). Parado, ele fica
 * no trecho medido. Na lombada a amplitude é 10 px e a curva é aberta (raio
 * acima de 1.000 px): lá ele desce.
 */
export const NAME = {
  chart: { size: 0.3, span: [0.05, 0.95], drift: 0, fadeFrom: 0.7, fadeTo: 1.2 },
  spine: { size: 0.22, span: [0.05, 0.9], drift: 0.4, fadeFrom: 0.35, fadeTo: 0.8 },
} as const;

/**
 * Métricas da fonte do nome a 100 px (canvas measureText): comprimento e
 * a faixa da tinta acima (asc) e abaixo (desc) da linha de base.
 */
export type NameMetrics = { len100: number; asc100: number; desc100: number };

/**
 * Tamanho e lugar do nome escrito no rio. A tinta das letras (asc + desc)
 * tem de caber na água em todo o trecho que o nome ocupa, inclusive enquanto
 * desce com o scroll até sumir. Na rodada anterior o tamanho era fixo
 * (0,3 da unidade, ~270 px) e as hastes do E, do d e do l furavam a margem.
 *
 * Devolve o tamanho em px, o deslocamento da linha de base (para a faixa da
 * tinta ficar centrada no meio da água) e o trecho, em unidades, por onde as
 * letras passam enquanto visíveis.
 */
export function fitName(W: number, unit: number, mode: ChartMode, metrics: NameMetrics) {
  const cfg = NAME[mode];
  const center = riverArc(-0.2, 3, W, unit, mode);
  const top = arcAt(center, cfg.span[0]);
  const bottom = arcAt(center, cfg.span[1]);
  const band = (metrics.asc100 + metrics.desc100) / 100;
  // Até sumir, o nome anda drift × fadeTo telas rio abaixo.
  const driftUnits = cfg.drift * cfg.fadeTo;
  const nominal = mode === "chart" ? cfg.size * unit : cfg.size * W;
  const byLength = (100 * (bottom - top)) / metrics.len100;
  const mid = (top + bottom) / 2;
  let y0 = 0;
  let y1 = 0;
  // Maior tamanho que cabe na água do trecho que ele mesmo ocupa.
  const byWater = (s: number) => {
    const len = (metrics.len100 * s) / 100;
    y0 = yAtArc(center, mid - len / 2);
    // O caminho é mais longo que a altura, então o nome desce no máximo
    // `drift` em y: somar em y é o lado seguro.
    y1 = yAtArc(center, mid + len / 2) + driftUnits;
    let minHalf = Infinity;
    for (let y = y0; y <= y1 + 1e-9; y += 0.005) minHalf = Math.min(minHalf, safeHalfPx(y, mode, W, unit));
    // 1% de folga: a amostragem a cada 0,005 unidade pode passar ao lado do ponto mais estreito.
    return (0.99 * 2 * minHalf) / band;
  };
  let size = Math.min(nominal, byLength);
  for (let k = 0; k < 6; k++) size = Math.min(nominal, byLength, (size + byWater(size)) / 2);
  // Encolher só encurta o trecho (centrado no mesmo ponto) e só alarga a
  // água mínima: depois deste passo a tinta cabe com certeza.
  size = Math.min(size, byWater(size));
  byWater(size);
  const len = (metrics.len100 * size) / 100;
  // Linha de base deslocada para o pé das letras: a tinta vai de -desc a +asc
  // acima dela, então o meio da tinta fica (asc - desc)/2 acima.
  const offset = ((metrics.asc100 - metrics.desc100) / 200) * size;
  return { size, len, offset, top, bottom, y0, y1, band: band * size };
}

/**
 * Contorno da água (as duas margens) para o fallback sem WebGL. A meia
 * largura é perpendicular ao curso, então na horizontal ela cresce com a
 * inclinação: o mesmo que o shader faz ao dividir a distância pela derivada.
 */
export function riverBanksD(y0: number, y1: number, W: number, unit: number, mode: ChartMode, docUnits: number) {
  const n = Math.max(2, Math.ceil((y1 - y0) / SAMPLE_STEP));
  const step = (y1 - y0) / n;
  const left: string[] = [];
  const right: string[] = [];
  const e = 0.005;
  const ref = halfRef(mode, W, unit);
  for (let i = 0; i <= n; i++) {
    const y = y0 + i * step;
    const x = riverX(y, mode, docUnits) * W;
    const slope = ((riverX(y + e, mode, docUnits) - riverX(y - e, mode, docUnits)) / (2 * e)) * (W / unit);
    const off = riverHalf(y, mode, docUnits) * ref * Math.sqrt(1 + slope * slope);
    const yy = (y * unit).toFixed(1);
    left.push(`${(x - off).toFixed(1)} ${yy}`);
    right.push(`${(x + off).toFixed(1)} ${yy}`);
  }
  return `M${left.join("L")}L${right.reverse().join("L")}Z`;
}
