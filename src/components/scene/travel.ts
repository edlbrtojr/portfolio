import { chartGeometry } from "../chart/geometry";
import { caseOrigin, travelCamera } from "./river-curve";
import { BRANCH_SLOTS, type Port, sceneState, wakeScene } from "./store";

// A viagem entre a home e a página de um projeto. O site é um mapa só
// (river.tsx): em vez de trocar de página num corte, o conteúdo some, a
// câmera segue o braço do rio até o lugar da outra página e o conteúdo dela
// aparece lá. A rota muda de verdade (URL, histórico, <title>): quem anima é
// só a cena, que não desmonta.
//
// A troca de rota é pedida no começo da viagem, não no fim: a página nova
// carrega enquanto a câmera anda. Ela nasce escondida (html[data-viajando])
// e só aparece quando as duas coisas acabaram: a viagem e a montagem
// (settle, chamado pelo ScenePage da página nova).

/**
 * Duração da viagem, ms. O braço tem ~2.000 px a 1440 de largura: abaixo de
 * 1,2 s a mata vira borrão e não se vê o fio de rio; acima de 2 s quem só
 * quer abrir o projeto espera demais.
 */
const DURATION = 1500;
/** Se a página nova não montar nesse tempo depois da viagem, o conteúdo volta a aparecer onde estiver. */
const FAILSAFE = 6000;

let running = false;
let failsafe = 0;

const html = () => document.documentElement;

/** Só há viagem com a cena ligada e sem "reduzir movimento"; fora disso o link navega normalmente. */
export function canTravel() {
  return !running && html().dataset.webgl === "on" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Porto de quem abriu o case direto, sem a home ter medido nada: um lugar
 * plausível no meio da noite. Vale até a home montar (ScenePage) e trocar
 * pelo medido; a viagem de volta lê o porto a cada quadro e se ajusta.
 */
export function portFor(slug: string): Port {
  const s = sceneState;
  let port = s.ports.get(slug);
  if (!port) {
    const taken = new Set([...s.ports.values()].map((p) => p.slot));
    let slot = 0;
    while (taken.has(slot) && slot < BRANCH_SLOTS - 1) slot++;
    port = { y0: 2.6 * s.unit, scroll: 2.1 * s.unit, slot, guess: true };
    s.ports.set(slug, port);
  }
  return port;
}

function release() {
  window.clearTimeout(failsafe);
  sceneState.camera = null;
  html().removeAttribute("data-viajando");
  html().style.removeProperty("scroll-behavior");
  wakeScene();
}

/**
 * Leva a câmera da home ao case (`ir`) ou do case à home (`voltar`).
 * `navigate` troca a rota; é chamado já no começo.
 */
export function travel(direction: "ir" | "voltar", slug: string, navigate: () => void) {
  const s = sceneState;
  const geo = chartGeometry();
  const port = portFor(slug);
  s.branches[port.slot] = port.y0;
  s.activeBranch = port.slot;

  // Os dois extremos do caminho. Na ida, a home é onde a janela está agora e
  // o case é o topo da página dele. Na volta, o case é onde a janela está
  // agora (o leitor pode ter rolado) e a home é o ponto em que ela rola para
  // mostrar o projeto, relido a cada quadro: se a home montar no meio da
  // viagem e medir outro valor, a câmera chega no lugar certo.
  const here = { x: s.origin.x, y: s.origin.y + window.scrollY };
  const homeEnd = () => (direction === "ir" ? here : { x: 0, y: portFor(slug).scroll });
  const pageEnd = direction === "ir" ? caseOrigin(port.y0, geo.W, geo.unit) : here;

  running = true;
  s.camera = here;
  html().dataset.viajando = "";
  // O CSS tem scroll-behavior: smooth; a rolagem até a âncora do projeto na
  // volta levaria meio segundo e a cena ficaria esperando por ela.
  html().style.scrollBehavior = "auto";
  const t0 = performance.now();
  const from = direction === "ir" ? 0 : 1;

  const tick = (now: number) => {
    const k = Math.min(1, (now - t0) / DURATION);
    const eased = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    // O porto pode ter sido remedido (a home montou no meio da volta): o braço aceso acompanha.
    const now_ = portFor(slug);
    s.branches[now_.slot] = now_.y0;
    s.activeBranch = now_.slot;
    s.camera = travelCamera(from + (1 - 2 * from) * eased, homeEnd(), pageEnd, 0.3 * window.innerHeight);
    wakeScene(300);
    if (k < 1) {
      requestAnimationFrame(tick);
      return;
    }
    running = false;
    failsafe = window.setTimeout(release, FAILSAFE);
  };
  requestAnimationFrame(tick);
  navigate();
}

/**
 * Chamado pela página que acabou de montar. Solta a câmera (ela volta a ser
 * posição da página + scroll) e mostra o conteúdo, mas só quando a viagem
 * terminou e o scroll da página nova chegou aonde a câmera está: o Next rola
 * para o topo ou para a âncora um ou dois quadros depois de montar, e soltar
 * antes mostraria um quadro do lugar errado.
 */
export function settle(onArrive?: () => void) {
  const s = sceneState;
  if (!s.camera && !running) {
    html().removeAttribute("data-viajando");
    return () => {};
  }
  let raf = 0;
  let stable = 0;
  let last = Number.NaN;
  const t0 = performance.now();
  const poll = (now: number) => {
    raf = requestAnimationFrame(poll);
    if (running || !s.camera) return;
    const y = s.origin.y + window.scrollY;
    stable = y === last ? stable + 1 : 0;
    last = y;
    // Chegou, ou parou de se mexer (porto chutado: a âncora real é outra), ou passou do limite.
    if (Math.abs(y - s.camera.y) < 2 || (stable >= 6 && now - t0 > 250) || now - t0 > DURATION + 1500) {
      cancelAnimationFrame(raf);
      if (s.page === "home") s.activeBranch = -1;
      release();
      onArrive?.();
    }
  };
  raf = requestAnimationFrame(poll);
  return () => cancelAnimationFrame(raf);
}
