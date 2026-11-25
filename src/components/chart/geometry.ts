import { useSyncExternalStore } from "react";
import { modeFor, NOTES_MIN_WIDTH, type ChartMode } from "../scene/river-curve";
import { sceneState } from "../scene/store";

export type ChartGeometry = { W: number; unit: number; mode: ChartMode; notes: boolean };

let current: ChartGeometry | null = null;
const listeners = new Set<() => void>();

/**
 * A unidade da carta é a altura da janela medida na carga, e só é refeita
 * quando a largura muda. No Safari do iPhone a barra de endereço aparece e
 * some no meio da rolagem e mudava `innerHeight`; o rio (que depende da
 * unidade) escorregava sob o texto. Girar o aparelho ou redimensionar a
 * janela muda a largura e refaz tudo.
 *
 * W é `clientWidth`, não `innerWidth`: no Windows a barra de rolagem clássica
 * ocupa 17 px e o rio do shader e o do SVG ficariam desalinhados.
 */
function measure(): ChartGeometry {
  const W = document.documentElement.clientWidth;
  if (current && current.W === W) return current;
  const unit = window.innerHeight;
  current = { W, unit, mode: modeFor(W), notes: W >= NOTES_MIN_WIDTH };
  document.documentElement.style.setProperty("--chart-unit", `${unit}px`);
  sceneState.unit = unit;
  sceneState.mode = current.mode;
  return current;
}

// A barra de rolagem aparece quando a página cresce, sem evento de resize da
// janela: o ResizeObserver no <html> pega essa mudança de largura.
let ro: ResizeObserver | null = null;

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (listeners.size === 1) {
    window.addEventListener("resize", notify);
    ro = new ResizeObserver(notify);
    ro.observe(document.documentElement);
  }
  return () => {
    listeners.delete(cb);
    if (!listeners.size) {
      window.removeEventListener("resize", notify);
      ro?.disconnect();
      ro = null;
    }
  };
}

function notify() {
  const before = current;
  if (measure() !== before) for (const l of listeners) l();
}

/** Garante a medição (e o `sceneState`) mesmo para quem não usa o hook. */
export function chartGeometry() {
  return measure();
}

/** null no servidor e na hidratação; a geometria só existe no navegador. */
export function useChart(): ChartGeometry | null {
  return useSyncExternalStore(subscribe, measure, () => null);
}

const wideQuery = `(min-width: ${NOTES_MIN_WIDTH}px)`;
function subscribeWide(cb: () => void) {
  const mq = window.matchMedia(wideQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * Notas na margem (true) ou em rodapé (false). No servidor assume margem: o
 * HTML das duas formas carrega o mesmo texto, e o celular troca para rodapé
 * logo depois de hidratar.
 */
export function useWideNotes() {
  return useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(wideQuery).matches,
    () => true,
  );
}
