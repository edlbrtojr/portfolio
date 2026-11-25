import type { ChartMode } from "./river-curve";

/**
 * Um projeto na home, visto pela cena: de onde sai o braço do rio que leva à
 * página dele (`y0`, px do mundo), onde a home rola para mostrá-lo (`scroll`)
 * e em que posição do vetor de braços ele está (`slot`). `guess` marca o
 * valor chutado de quem abriu o case direto, sem passar pela home: vale até
 * a home montar e medir de verdade.
 */
export type Port = { y0: number; scroll: number; slot: number; guess?: boolean };

/** Quantos braços o shader desenha (uniform de tamanho fixo). Hoje há seis projetos com página. */
export const BRANCH_SLOTS = 6;

// Estado compartilhado entre o DOM (scroll, ponteiro, foco) e o loop do
// three.js. É um objeto mutável de propósito: o loop lê a cada quadro e nada
// aqui deve causar re-render do React.
export const sceneState = {
  /** Unidade da carta em px (altura da janela na carga). Ver chart/geometry.ts. */
  unit: 900,
  mode: "chart" as ChartMode,
  /** `coarse`: celular ou máquina de até 4 núcleos (menos Worley, dpr 1). */
  tier: "full" as "full" | "coarse",
  /** Ponteiro fino (mouse/caneta): só aí existe lanterna. */
  fine: false,
  /** Que página está montada. A cena é uma só e não desmonta entre elas (ver root-document.tsx). */
  page: "home" as "home" | "case",
  /**
   * Onde a página montada fica no mundo, px: a home em (0, 0); um case a
   * leste, no fim do braço dele (caseOrigin em river-curve.ts).
   */
  origin: { x: 0, y: 0 },
  /**
   * A câmera durante a viagem entre páginas (canto superior esquerdo da
   * janela, px do mundo). null = parada: a câmera é `origin` + scroll.
   */
  camera: null as null | { x: number; y: number },
  /** Altura do documento da home, px: a foz e o amanhecer são medidos por ela. 0 = ainda não medida. */
  homeDocH: 0,
  /** slug → porto. Preenchido pela home quando monta (ScenePage). */
  ports: new Map<string, Port>(),
  /** y (px do mundo) de onde sai cada braço desenhado; -1 = vaga livre. */
  branches: Array.from({ length: BRANCH_SLOTS }, () => -1),
  /** Vaga do braço que leva à página aberta (ou para onde a câmera viaja); -1 = nenhum. */
  activeBranch: -1,
  /** Ponteiro em px da janela. */
  pointer: { x: 0, y: 0, active: false },
  /**
   * Alvo da lanterna em px do documento (rola junto com o elemento): nome de
   * projeto ou nota sob o mouse, ou o elemento com foco do teclado.
   * `gather`: os vaga-lumes também vão para lá.
   */
  lantern: { x: 0, y: 0, active: false, gather: false },
  /** Lanterna suavizada, em px da janela; escrita pelo River a cada quadro. */
  light: { x: 0, y: 0, on: 0 },
  /**
   * Até quando (performance.now) a cena precisa desenhar mesmo sem animação
   * contínua: transições da lanterna, dos vaga-lumes e da viagem. Ver Pacer.
   */
  wakeUntil: 0,
};

/** Canto superior esquerdo da janela no mundo, px: a câmera em viagem ou a página parada mais o scroll. */
export function cameraNow() {
  return sceneState.camera ?? { x: sceneState.origin.x, y: sceneState.origin.y + window.scrollY };
}

/** Pede quadros por ~1,5 s: o bastante para as suavizações assentarem. */
export function wakeScene(ms = 1500) {
  sceneState.wakeUntil = Math.max(sceneState.wakeUntil, performance.now() + ms);
}

/** Aponta a lanterna para o centro de um elemento (ou apaga, com null). */
export function aimLantern(el: Element | null, gather = true) {
  wakeScene();
  if (!el) {
    sceneState.lantern.active = false;
    sceneState.lantern.gather = false;
    return;
  }
  const r = el.getBoundingClientRect();
  sceneState.lantern.x = r.left + r.width / 2;
  sceneState.lantern.y = r.top + r.height / 2 + window.scrollY;
  sceneState.lantern.active = true;
  sceneState.lantern.gather = gather;
}
