import type { ChartMode, RiverParams } from "./river-curve";

/**
 * O que a cena desenha enquanto o jogo da canoa roda (game/engine.ts): um rio
 * próprio, mais largo e centrado, com o comprimento do percurso no lugar da
 * altura da home (a foz e o amanhecer são medidos por ele), e a lanterna
 * presa à canoa (`light`, px da janela).
 */
export type GameScene = {
  river: RiverParams;
  docH: number;
  /**
   * A lanterna da canoa. `grow` muda o tamanho do clarão (0 = o da página):
   * no jogo a luz cresce com a carga e encolhe quando um erro derruba dados.
   */
  light: { x: number; y: number; grow: number };
  /** Os vaga-lumes largam a mata e rodeiam a canoa (prêmio de uma fileira de dados sem erro). */
  swarm: boolean;
  /**
   * Por onde a canoa passou: o rio fica limpo ali (river.tsx pinta a faixa).
   * `data` tem TRAIL_SAMPLES pares, um por fatia de altura do percurso: x do
   * centro da faixa (px do mundo) e meia largura (px; 0 = a canoa ainda não
   * passou). `version` sobe a cada escrita, para a textura só ser reenviada
   * à GPU quando mudou.
   */
  trail: { data: Float32Array; version: number };
};

/**
 * Fatias do rastro. O percurso tem ~8.000 px a 900 de altura: com 1.024 dá
 * uma fatia a cada ~8 px, menos que a célula de 12 px em que o rio é
 * desenhado, então a faixa nunca fica com degrau visível.
 */
export const TRAIL_SAMPLES = 1024;

/**
 * Um projeto na home, visto pela cena: de onde sai o braço do rio que leva à
 * página dele (`y0`, px do mundo), onde a home rola para mostrá-lo (`scroll`)
 * e em que posição do vetor de braços ele está (`slot`). `guess` marca o
 * valor chutado de quem abriu o case direto, sem passar pela home: vale até
 * a home montar e medir de verdade.
 */
export type Port = { y0: number; scroll: number; slot: number; guess?: boolean };

/**
 * Quantos braços o shader desenha (uniform de tamanho fixo). Tem de ser pelo
 * menos o número de projetos com página: cada um ocupa a vaga da sua posição
 * na home (measurePorts em scene-page.tsx), e uma vaga além do tamanho do
 * vetor simplesmente não é desenhada. Hoje são oito projetos (eram seis até
 * entrarem o Convokator e o Gerador de QR Code); o laço do shader pula as
 * vagas livres, então vaga sobrando não custa nada.
 */
export const BRANCH_SLOTS = 8;

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
  /** O rio do jogo da canoa; null = a cena desenha a página. */
  game: null as null | GameScene,
  /**
   * Chamado pelo Pacer a cada quadro, antes de a cena desenhar. É por aqui que
   * o jogo anda: a câmera, a canoa (canvas 2D) e o shader têm de sair no mesmo
   * quadro, e dois laços de rAF separados deixariam um deles um quadro atrás.
   */
  tick: null as null | ((now: number) => void),
  /** Cortina: 1 = cena acesa, 0 = no escuro. O jogo troca de rio atrás dela. */
  curtain: 1,
  /** Pede ao River que repita a chegada do luar (consumido no quadro seguinte). */
  replayReveal: false,
};

/** Altura (px) do rio que a cena está desenhando: o percurso do jogo ou a home. 0 = ainda não medida. */
export function riverDocH() {
  return sceneState.game?.docH ?? sceneState.homeDocH;
}

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
