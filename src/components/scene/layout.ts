import type { ShapeKey } from "./shapes";

export type Layout = { x: number; y: number; scale: number; opacity: number; sway: number };

// Tamanho de projeto das formas (ver shapes.ts): ~4,2 de altura, nome com 8 de largura.
const SHAPE_SIZE = 4.2;
const NAME_WIDTH = 8;

/**
 * Linha d'água do rio, como fração da altura da tela a partir de baixo. No
 * retrato desce para 20%: o texto do hero fica no pé da tela e as formas
 * precisam de espaço acima da água. Fundo (river.tsx) e reflexo
 * (particles.tsx) leem daqui para a linha bater nos dois.
 */
export function horizonFrac(vw: number, vh: number) {
  return vw / vh < 0.9 ? 0.2 : 0.28;
}

/** A mesma linha d'água em unidades do mundo (plano z = 0, centro da tela = 0). */
export function horizonY(vw: number, vh: number) {
  return (horizonFrac(vw, vh) - 0.5) * vh;
}

/**
 * Onde cada forma fica na tela. Toda forma pronta fica acima da linha d'água,
 * para o reflexo aparecer inteiro no rio. No desktop as formas ocupam a metade
 * direita para o texto (à esquerda) ficar legível; no celular ficam
 * centralizadas e esmaecidas atrás do texto. 0,32 de opacidade foi o máximo em
 * que o texto branco ainda passou com folga no contraste sobre os pontos mais claros.
 */
export function layoutFor(stage: ShapeKey, vw: number, vh: number): Layout {
  const portrait = vw / vh < 0.9;
  if (stage === "chaos") return { x: 0, y: 0, scale: 1, opacity: 0.6, sway: 0 };
  if (stage === "name") {
    const scale = Math.min((vw * 0.88) / NAME_WIDTH, 1.15);
    // No retrato o nome sobe para ~20% da altura: num 390×844 o texto do hero
    // começa em ~31% e, com 22%, nome e texto se encostavam.
    return { x: 0, y: portrait ? vh * 0.3 : vh * 0.12, scale, opacity: 1, sway: 0 };
  }
  if (portrait) {
    // 72% da largura: num 390×844 a forma tem ~0,33 da altura e termina em
    // -0,1 vh, acima da água (-0,3 vh).
    return { x: 0, y: vh * 0.06, scale: (vw * 0.72) / SHAPE_SIZE, opacity: 0.32, sway: 0.6 };
  }
  // Metade da altura (antes 72%): com a água ocupando 28% de baixo, a forma
  // centrada em +0,08 vh termina em -0,17 vh, logo acima da linha (-0,22 vh).
  const scale = Math.min((vh * 0.5) / SHAPE_SIZE, (vw * 0.4) / SHAPE_SIZE);
  return { x: vw * 0.23, y: vh * 0.08, scale, opacity: 1, sway: 1 };
}

export function lerpLayout(a: Layout, b: Layout, t: number): Layout {
  const l = (p: number, q: number) => p + (q - p) * t;
  return { x: l(a.x, b.x), y: l(a.y, b.y), scale: l(a.scale, b.scale), opacity: l(a.opacity, b.opacity), sway: l(a.sway, b.sway) };
}
