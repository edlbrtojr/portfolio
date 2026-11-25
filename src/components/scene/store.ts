import type { ChartMode } from "./river-curve";

// Estado compartilhado entre o DOM (scroll, ponteiro, foco) e o loop do
// three.js. É um objeto mutável de propósito: o loop lê a cada quadro e nada
// aqui deve causar re-render do React.
export const sceneState = {
  /** Unidade da carta em px (altura da janela na carga). Ver chart/geometry.ts. */
  unit: 900,
  mode: "chart" as ChartMode,
  /** Altura do documento em px: a foz alarga nas últimas 1,5 unidade. */
  docH: 0,
  /** `coarse`: celular ou máquina de até 4 núcleos (menos Worley, dpr 1). */
  tier: "full" as "full" | "coarse",
  /** Ponteiro fino (mouse/caneta): só aí existe lanterna. */
  fine: false,
  /** true nas páginas de case: a cena recua atrás das capturas. */
  dim: false,
  /** Ponteiro em px da janela. */
  pointer: { x: 0, y: 0, active: false },
  /**
   * Alvo da lanterna em px do documento (rola junto com o elemento):
   * topônimo ou nota sob o mouse, ou o elemento com foco do teclado.
   * `gather`: os vaga-lumes também vão para lá.
   */
  lantern: { x: 0, y: 0, active: false, gather: false },
  /** Lanterna suavizada, em px da janela; escrita pelo River a cada quadro. */
  light: { x: 0, y: 0, on: 0 },
  /**
   * Até quando (performance.now) a cena precisa desenhar mesmo sem animação
   * contínua: transições da lanterna, dos vaga-lumes e do recuo. Ver Pacer.
   */
  wakeUntil: 0,
};

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
