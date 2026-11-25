import type { ShapeKey } from "./shapes";

export type Layout = { x: number; y: number; scale: number; opacity: number; sway: number };

// Tamanho de projeto das formas (ver shapes.ts): ~4,2 de altura, nome com 8 de largura.
const SHAPE_SIZE = 4.2;
const NAME_WIDTH = 8;

/**
 * Onde cada forma fica na tela. Os vaga-lumes voam sobre a floresta vista de
 * cima, então não há linha d'água a respeitar. No desktop as formas ocupam a
 * metade direita, sobre o rio, para o texto (à esquerda) ficar legível; no
 * celular ficam centralizadas e esmaecidas atrás do texto. 0,32 de opacidade
 * foi o máximo em que o texto branco ainda passou com folga no contraste.
 */
export function layoutFor(stage: ShapeKey, vw: number, vh: number): Layout {
  const portrait = vw / vh < 0.9;
  if (stage === "chaos") return { x: 0, y: 0, scale: 1, opacity: 0.6, sway: 0 };
  if (stage === "name") {
    const scale = Math.min((vw * 0.88) / NAME_WIDTH, 1.15);
    // No retrato o nome sobe para ~20% da altura: num 390×844 o texto do hero
    // começa em ~31% e, com 22%, nome e texto se encostavam.
    return { x: 0, y: portrait ? vh * 0.3 : vh * 0.08, scale, opacity: 1, sway: 0 };
  }
  if (portrait) {
    return { x: 0, y: 0, scale: (vw * 0.82) / SHAPE_SIZE, opacity: 0.32, sway: 0.6 };
  }
  const scale = Math.min((vh * 0.66) / SHAPE_SIZE, (vw * 0.4) / SHAPE_SIZE);
  return { x: vw * 0.23, y: 0, scale, opacity: 1, sway: 1 };
}

export function lerpLayout(a: Layout, b: Layout, t: number): Layout {
  const l = (p: number, q: number) => p + (q - p) * t;
  return { x: l(a.x, b.x), y: l(a.y, b.y), scale: l(a.scale, b.scale), opacity: l(a.opacity, b.opacity), sway: l(a.sway, b.sway) };
}
