import type { RiverParams, RiverShape } from "../scene/river-curve";

// O percurso do jogo da canoa: o rio, o que boia nele e as regras de toque.
// Tudo aqui é conta pura, sem DOM nem three.js, para o teste (course.test.mjs)
// descer o rio sem navegador. Quem desenha e lê o teclado é engine.ts.
//
// A ideia do jogo: o visitante faz, em 20 segundos, o que eu faço no
// trabalho. Recolhe dado bruto rio acima, o dado vai sendo limpo no caminho
// e chega à foz (o contato) pronto, em forma de gráfico. São os mesmos três
// estágios que o shader já desenha na água (bronze, silver e gold).
//
// Unidades: as mesmas de river-curve.ts (y em unidades da carta, x em fração
// da largura W). O que termina em Px está em px.

/**
 * Comprimento do percurso, em unidades. Não é a altura da home de propósito:
 * ela muda com o texto e, no celular, tem quase o dobro de telas. Com 9
 * unidades a descida leva ~20 s em qualquer aparelho (ver o teste); é o que o
 * botão promete ("joguinho de 20 segundos"). Se mudar aqui, ou a velocidade,
 * rode o teste e acerte a promessa em content/pt.ts e en.ts.
 */
export const COURSE_UNITS = 9;

/**
 * Onde a carga muda de estágio, em fração do percurso: bruto → limpo → pronto.
 * Ficam dentro das janelas em que o shader faz a mesma troca na água
 * (smoothstep 0,1–0,42 e 0,6–0,9 em river.tsx): a carga vira número quando a
 * água em volta já é quase toda número.
 */
export const STAGE_CLEAN = 0.3;
export const STAGE_GOLD = 0.72;

/** A canoa fica parada nesta fração da altura da janela; quem anda é o rio. */
export const CANOE_Y = 0.6;

/** Velocidade da descida, unidades por segundo: larga devagar e chega rápido. */
export const SPEED = { from: 0.35, to: 0.5 } as const;

/**
 * Com que pressa a canoa vai atrás do alvo do jogador (1/s). Começou em 16 e
 * o Edilberto, jogando em 2026-11-26, achou a sensibilidade "muito alta": a
 * canoa colava no mouse e tremia. Com 10 ela tem peso de barco e o jogador
 * simulado do teste ainda pega os dados. O piso é 8: com 7 a canoa atrasa
 * tanto na curva do monitor largo (1920×1080) que, mesmo no meio do rio,
 * encosta num erro, e o teste "quem não joga também chega" quebra.
 */
export const FOLLOW = 10;

/**
 * Quanto a canoa anda para cada px que o mouse anda. Era 1 para 1 com o
 * cursor escondido: qualquer movimento de mão virava um tranco. 0,6 foi o
 * primeiro corte depois da queixa acima; se ainda parecer nervoso, desça
 * este número antes de mexer em FOLLOW. O dedo continua 1 para 1: a canoa
 * vai para baixo dele, que é o que se espera no toque.
 */
export const MOUSE_GAIN = 0.6;

/**
 * Como o mouse vira posição da canoa: `x = W/2 + (mouse - anchor) * gain`.
 * `gain` só passa de MOUSE_GAIN em janela estreita, onde com 0,6 o mouse
 * bateria na borda da tela antes de a canoa chegar à margem do rio.
 * `anchor` é o ponto do mouse que corresponde ao meio da tela: o motor o põe
 * onde o cursor estava quando o jogador mexeu pela primeira vez (o botão do
 * jogo fica à esquerda, e sem isso a canoa largava indo para a margem), mas
 * só entre `lo` e `hi`, a faixa em que as duas margens continuam ao alcance
 * do mouse em qualquer ponto do percurso (o teste confere).
 */
export function mouseMap(W: number, unit: number) {
  const river = gameRiver(W, unit);
  // O mais longe do meio da tela que a canoa precisa ir: a curva inteira
  // mais a meia largura no trecho mais largo e inclinado.
  const reach = 1.5 * river.amp * W + 1.6 * river.half * unit;
  const gain = Math.max(MOUSE_GAIN, reach / (0.47 * W));
  return { gain, lo: reach / gain, hi: W - reach / gain };
}

/**
 * Velocidade lateral das setas, px/s. Um toque curto é um ajuste fino (22%
 * da unidade por segundo); segurando, chega em 0,35 s a 75%, mais do que o
 * rio anda de lado na curva mais fechada (o teste confere), senão o teclado
 * não alcançaria a margem a tempo. Antes era 75% desde o primeiro quadro: um
 * toque de 100 ms jogava a canoa um terço do rio para o lado.
 */
export function keySpeed(heldSeconds: number, unit: number) {
  const k = Math.min(1, Math.max(0, heldSeconds / 0.35));
  return unit * (0.22 + 0.53 * k * k * (3 - 2 * k));
}

/**
 * O rio do jogo: centrado e largo o bastante para haver por onde desviar.
 * O da página não serve: na carta tem ~68 px de largura, e no celular é uma
 * lombada de 54 px colada na borda, embaixo do dedo.
 *
 * - `amp` em px: o menor entre 12% da largura e 14% da altura. No celular
 *   quem limita é a largura (o rio tem de caber na tela); no monitor largo é
 *   a altura, senão a curva pede ~500 px/s de lado e vira reflexo, não remo.
 * - `half` em px: 20% da largura no celular, com teto de 20% da altura (o
 *   celular deitado) e de 110 px. Com teto de 11% da altura, a 844×390 o
 *   canal navegável caía para 32 px e o erro encostado na margem pegava até
 *   a canoa parada no meio do rio (o teste de course.test.mjs acusou).
 * - sem `head`: o estirão largo da abertura existe para caber o nome.
 * - a foz alarga 80% e endireita: a chegada é mansa.
 * - `maxAspect` infinito: a régua é a unidade, e `half` já vem em px / unidade.
 * - `noise` 0,12: o recorte da margem é ruído de GPU, que o JS não reproduz;
 *   a canoa navega pela largura garantida (makeChannel) e com 0,22 a margem
 *   que se vê ficava até 18 px além de onde a canoa para.
 */
export function gameRiver(W: number, unit: number): RiverParams {
  const ampPx = Math.min(0.12 * W, 0.14 * unit);
  const halfPx = Math.min(0.2 * W, 0.2 * unit, 110);
  return { axis: 0.5, amp: ampPx / W, half: halfPx / unit, growth: 0.8, straight: 0.8, head: 0, maxAspect: Infinity, noise: 0.12, overhang: 0 };
}

/** As contas da curva de river-curve.ts, recebidas por parâmetro: este arquivo não importa nada em tempo de execução. */
export type Curve = {
  riverX(y: number, shape: RiverShape, docUnits?: number): number;
  riverHalf(y: number, shape: RiverShape, docUnits: number): number;
  halfRef(shape: RiverShape, W: number, unit: number): number;
};

export type Channel = (yPx: number) => { x: number; half: number };

/**
 * O canal navegável numa altura (px do mundo): o centro da água e a meia
 * largura, na horizontal, que é água com certeza. Mesma conta do shader
 * (distância corrigida pela inclinação), descontando o pior caso do recorte
 * da margem e 2 px da borda suavizada.
 */
export function makeChannel(curve: Curve, river: RiverParams, W: number, unit: number, docUnits = COURSE_UNITS): Channel {
  const ref = curve.halfRef(river, W, unit);
  const e = 0.01;
  return (yPx) => {
    const y = yPx / unit;
    const x = curve.riverX(y, river, docUnits) * W;
    const slope = ((curve.riverX(y + e, river, docUnits) - curve.riverX(y - e, river, docUnits)) * W) / (2 * e * unit);
    const half = (curve.riverHalf(y, river, docUnits) * ref * (1 - river.noise / 2) - 2) * Math.sqrt(1 + slope * slope);
    return { x, half };
  };
}

/** Medidas em px do que se desenha e do que se toca. Menores no celular (em pé ou deitado), onde o rio tem ~130 px. */
export function gameSizes(W: number, unit: number) {
  const compact = Math.min(W, unit) < 600;
  return {
    compact,
    // Um pouco maior desde que a canoa virou ilustração (era 54 × 18 em
    // vetor): abaixo disso o chapéu e o remo do remador viram borrão.
    canoeLen: compact ? 50 : 62,
    canoeWid: compact ? 16 : 20,
    /** Raio de coleta: generoso, o jogo é para entreter, não para punir. */
    grab: compact ? 22 : 28,
    chipW: compact ? 40 : 50,
    chipH: compact ? 18 : 20,
    /** Distância entre os dados da carga, atrás da canoa. */
    gap: compact ? 13 : 15,
    /** Corpo do dado a recolher e do dado na carga. */
    big: compact ? 18 : 21,
    small: compact ? 11 : 12,
    /** Raio da boia escura atrás do dado a recolher e da conta atrás do dado na carga. */
    buoy: compact ? 14 : 17,
    bead: compact ? 6.5 : 7.5,
    /** Quanto o dado fica longe da margem. */
    inset: 16,
  };
}
export type Sizes = ReturnType<typeof gameSizes>;

/**
 * Dado a recolher ou erro a desviar. `off`: posição lateral, de -1 (margem
 * esquerda) a 1. O dado para a `inset` px da margem; o erro, com |off| = 1,
 * encosta nela (placeCourse).
 */
export type CourseItem = { y: number; off: number; kind: "dado" | "erro"; text: string };

/** Os mesmos sinais de dado bruto do rio (GLYPH_SETS.raw em river.tsx). */
const RAW = "?#%;/|~!<>{}$§=";
/**
 * O que estraga dado de verdade. `#REF!` está aí para quem vive em planilha
 * (o convite da home fala com essa pessoa); `NULL` e `NaN`, para quem programa.
 */
const ERRORS = ["NULL", "NaN", "#REF!"];

/** Gerador determinístico (mulberry32): mesma semente, mesmo percurso. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Forma de cada fila de dados: um arco que encosta num lado do rio e volta.
 * Começava em 0,25 do meio; no celular (canal de ~55 px) isso dava 11 px, e a
 * canoa parada no centro recolhia 61% dos dados sem ninguém remar.
 */
const ARC = [0.4, 0.7, 0.85, 0.7];
/** Distância entre os dados de uma fila e entre uma fila e a próxima, em unidades. */
const ITEM_STEP = 0.11;
const ROW_STEP = 0.62;
/** A primeira fila: a canoa larga em 0,6 e precisa de ~2 s para o jogador entender o comando. */
const FIRST_ROW = 1.3;
/** Nada boia no último trecho: é a chegada. */
const LAST_CLEAR = 0.85;

/**
 * O que boia no rio, em ordem de descida. Filas de quatro dados em arco, ora
 * numa margem, ora na outra: seguir as filas é fazer slalom. A partir da
 * terceira fila pode haver um erro encostado na margem oposta, na altura em
 * que a fila está mais longe dele: dá para pegar todos os dados sem bater em
 * nenhum erro, quem não rema passa pelo meio sem bater, e bate quem erra o
 * lado. As duas primeiras filas vêm limpas para ensinar o comando.
 */
export function buildCourse(rand: () => number, length = COURSE_UNITS): CourseItem[] {
  const items: CourseItem[] = [];
  let side = rand() < 0.5 ? -1 : 1;
  for (let row = 0, y0 = FIRST_ROW; y0 + ITEM_STEP * (ARC.length - 1) <= length - LAST_CLEAR; row++, y0 += ROW_STEP) {
    // Quase sempre troca de margem; uma em quatro repete, para não virar metrônomo.
    if (row > 0 && rand() > 0.25) side = -side;
    const reach = 0.85 + 0.15 * rand();
    ARC.forEach((off, i) => {
      items.push({ y: y0 + i * ITEM_STEP, off: side * off * reach, kind: "dado", text: RAW[Math.floor(rand() * RAW.length)] });
    });
    // A chance de erro sobe rio abaixo: 54% na terceira fila, 90% do meio em diante.
    if (row >= 2 && rand() < Math.min(0.9, 0.4 + 0.07 * row)) {
      items.push({ y: y0 + 2 * ITEM_STEP, off: -side, kind: "erro", text: ERRORS[Math.floor(rand() * ERRORS.length)] });
    }
  }
  return items.sort((a, b) => a.y - b.y);
}

/** Um item do percurso já no mundo, em px. */
export type Placed = CourseItem & { px: number; py: number };

/** Põe cada item na água: o dado a `inset` da margem, o erro inteiro dentro do canal. */
export function placeCourse(items: CourseItem[], channel: Channel, unit: number, sizes: Sizes): Placed[] {
  return items.map((it) => {
    const c = channel(it.y * unit);
    const room = it.kind === "dado" ? c.half - sizes.inset : c.half - sizes.chipW / 2 - 2;
    return { ...it, px: c.x + it.off * Math.max(0, room), py: it.y * unit };
  });
}

/** A canoa tocou o item? `dx`, `dy`: do centro da canoa ao centro do item, px. */
export function touches(kind: CourseItem["kind"], dx: number, dy: number, sizes: Sizes) {
  if (kind === "dado") return Math.abs(dx) < sizes.grab && Math.abs(dy) < sizes.grab;
  return Math.abs(dx) < (sizes.chipW + sizes.canoeWid) / 2 && Math.abs(dy) < sizes.chipH / 2 + 6;
}

/** Onde a canoa está depois de `dt` segundos indo atrás de `target`, sem sair do canal. */
export function steer(x: number, target: number, dt: number, lane: { x: number; half: number }, sizes: Sizes) {
  const room = Math.max(0, lane.half - sizes.canoeWid / 2 - 2);
  const next = x + (target - x) * (1 - Math.exp(-dt * FOLLOW));
  return Math.min(lane.x + room, Math.max(lane.x - room, next));
}

/**
 * Velocidade da câmera, px/s: cresce ao longo da descida, larga em 1,4 s (a
 * tela ainda está acendendo) e freia na última meia unidade, até 30%, para a
 * canoa chegar à foz devagar.
 */
export function cruise(camY: number, endY: number, unit: number, elapsedMs: number) {
  const k = Math.min(1, elapsedMs / 1400);
  const start = k * k * (3 - 2 * k);
  const brake = Math.max(0.3, Math.min(1, (endY - camY) / (0.5 * unit)));
  return unit * (SPEED.from + (SPEED.to - SPEED.from) * Math.min(1, camY / endY)) * Math.max(0.08, start) * brake;
}
