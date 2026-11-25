import type { ShapeKey } from "./shapes";

// Estado compartilhado entre o DOM (scroll, ponteiro) e o loop do three.js.
// É um objeto mutável de propósito: o loop lê a cada frame e nada aqui deve
// causar re-render do React.
export const sceneState = {
  stage: "name" as ShapeKey,
  /** true quando a seção no centro mostra capturas: a cena recua. */
  dim: false,
  pointer: { x: 0, y: 0, active: false },
};

export function setStage(stage: ShapeKey, dim = false) {
  sceneState.stage = stage;
  sceneState.dim = dim;
}
