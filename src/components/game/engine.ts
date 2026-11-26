import { chartGeometry } from "../chart/geometry";
import { halfRef, riverHalf, riverX } from "../scene/river-curve";
import { sceneState, wakeScene } from "../scene/store";
import { createSound, type GameSound } from "./sound";
import { buildCourse, CANOE_Y, COURSE_UNITS, cruise, gameRiver, gameSizes, keySpeed, makeChannel, mouseMap, placeCourse, seeded, STAGE_CLEAN, STAGE_GOLD, steer, touches } from "./course";

// O motor do jogo da canoa. As regras são de course.ts; aqui ficam o tempo, o
// teclado e o ponteiro, e o desenho da canoa e dos dados num canvas 2D por
// cima da cena.
//
// O rio é o da cena WebGL: o jogo só entrega ao shader outras constantes de
// curva (sceneState.game) e move a câmera (sceneState.camera), como a viagem
// entre páginas faz. Não há segundo rio desenhado em lugar nenhum.
//
// Uma descida, do começo ao fim:
// 1. `fechando`: a página some (html[data-jogo]) e a cortina da cena desce;
// 2. no escuro, o rio da página dá lugar ao do jogo e a chegada do luar
//    repete: a troca não se vê;
// 3. `descendo`: a câmera desce o percurso; `chegando`: parou na foz;
// 4. `saindo`: a cortina desce, o rio da página volta, a home é rolada até o
//    contato (a foz de verdade, se a descida terminou) e a cortina sobe
//    (`abrindo`).
//
// O laço não é daqui: quem chama `tick` é o Pacer da cena (scene-canvas.tsx),
// antes de desenhar, para a canoa e o rio saírem no mesmo quadro.

/** Quanto leva para apagar e para reacender a cena, ms. Curto: é troca de cenário, não efeito. */
const CLOSE_MS = 260;
const OPEN_MS = 650;
/** Parada na foz antes de sair, ms: tempo de ver a carga inteira virar barra. */
const ARRIVE_MS = 1300;
/** Quantos dados um erro derruba da carga. */
const ERROR_COST = 3;

const BRONZE = "#ff9e54";
const SILVER = "#d6ebff";
const GOLD = "#ffd173";
/** Fundo de noite atrás de cada dado (o --color-bg do site, quase opaco). */
const INK_BACK = "rgb(3 7 5 / 0.8)";

export type GameResult = { delivered: number; total: number; /** Altura de cada barra entregue, de 0 a 1. */ bars: number[] };

export type GameHooks = {
  /** Quantos dados vão na canoa. */
  onCount(n: number): void;
  /** Em que estágio a canoa está: 0 bruto, 1 limpo, 2 pronto. */
  onStage(stage: number): void;
  /** A saída começou (fim do percurso ou desistência): hora de esconder o placar. */
  onLeave(): void;
  /** A descida terminou e a home já está no contato. */
  onFinish(result: GameResult): void;
  /** Saiu no meio (Esc, botão, janela redimensionada, cena perdida). */
  onQuit(): void;
  /** Pausou ou voltou (espaço, botão, ou a janela perdeu o foco). */
  onPause(paused: boolean): void;
};

export type GameOptions = {
  /** Nomes dos três estágios, escritos nas linhas que cruzam o rio. */
  stages: readonly [string, string, string];
  /** Som ligado desde a largada (a escolha da última vez). */
  sound: boolean;
};

export type Game = {
  /** Sai com a cortina, como o Esc. */
  quit(): void;
  /** Desfaz tudo na hora, sem avisar: para quando o componente desmonta. */
  stop(): void;
  setPaused(paused: boolean): void;
  /** Tem de ser chamado dentro de um clique ou tecla: é quando o navegador deixa o áudio começar. */
  setSound(on: boolean): void;
};

type Carried = { ch: string; digit: string; level: number; stage: number; at: number; flip: number; wave: number; x: number; y: number };
type Spark = { kind: "anel" | "perda"; x: number; y: number; at: number; text: string; dir: number };

/**
 * Os sprites do jogo (public/images/jogo), ilustrados e com fundo
 * transparente (gerados no Codex em 2026-11-26). Medidas do arquivo, para o
 * desenho casar com a física:
 * - canoa: 160 × 288 px, casco centrado em x = 80, da popa (y ≈ 9) à proa
 *   (y = 279), proa para baixo, remo atravessado no colo. É um quadro só: o
 *   gerador não manteve casco e chapéu iguais entre duas poses de remada,
 *   então a remada é sugerida pelas ondinhas na água (drawCanoe).
 * - tronco: 256 × 96 px, deitado; vai por baixo da etiqueta do erro.
 * Se um arquivo não carregar (rede, bloqueador), o jogo cai no desenho em
 * vetor que existia antes: nunca fica sem canoa.
 */
const SPRITE = { canoeW: 160, canoeH: 288, hull: 270, logW: 256, logH: 96 } as const;

function loadSprite(src: string) {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  return img;
}
const ready = (img: HTMLImageElement) => img.complete && img.naturalWidth > 0;

/** Mancha de luz redonda, desenhada uma vez: `shadowBlur` por dado custava caro no celular. */
function halo(color: string, size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  if (g) {
    const r = size / 2;
    const grad = g.createRadialGradient(r, r, 0, r, r, r);
    grad.addColorStop(0, color);
    grad.addColorStop(1, "rgb(0 0 0 / 0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }
  return c;
}

/**
 * Começa uma descida no canvas dado (do tamanho da janela). null se não der
 * para começar. O progresso (0 a 1) e a posição das duas linhas de etapa vão
 * para o elemento pai do canvas como variáveis CSS (--jogo-p, --jogo-m1,
 * --jogo-m2): a régua do placar é CSS puro e não re-renderiza a cada quadro.
 */
export function startGame(canvas: HTMLCanvasElement, hooks: GameHooks, options: GameOptions): Game | null {
  const ctx = canvas.getContext("2d");
  // Sem o canvas da cena montado (three.js ainda baixando) ninguém chamaria o
  // `tick`; com a câmera ocupada há uma viagem entre páginas em curso.
  if (!ctx || sceneState.tick || sceneState.camera || !document.querySelector(".scene-layer canvas")) return null;

  const s = sceneState;
  const root = document.documentElement;
  const { W, unit } = chartGeometry();
  const sizes = gameSizes(W, unit);
  const river = gameRiver(W, unit);
  const docH = COURSE_UNITS * unit;
  const channel = makeChannel({ riverX, riverHalf, halfRef }, river, W, unit);
  const rand = seeded((Math.random() * 2 ** 32) >>> 0);
  const items = placeCourse(buildCourse(rand), channel, unit, sizes).map((it) => ({ ...it, done: false }));
  const total = items.filter((it) => it.kind === "dado").length;
  const family = getComputedStyle(root).getPropertyValue("--nf-code").trim() || "ui-monospace, monospace";
  const fontBig = `700 ${sizes.big}px ${family}`;
  const fontSmall = `700 ${sizes.small}px ${family}`;
  const fontChip = `700 ${sizes.compact ? 11 : 12}px ${family}`;
  const haloData = halo("rgb(255 158 84 / 0.5)", 64);
  const haloError = halo("rgb(255 80 80 / 0.4)", 96);
  const haloLamp = halo("rgb(255 226 160 / 0.85)", 48);
  const canoeSprite = loadSprite("/images/jogo/canoa.png");
  const logSprite = loadSprite("/images/jogo/tronco.png");

  let H = 0;
  let dpr = 1;
  const fit = () => {
    H = canvas.clientHeight || window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
  };
  fit();

  const cam = { x: 0, y: 0 };
  const light = { x: W / 2, y: CANOE_Y * H };
  const canoe = { x: channel(CANOE_Y * H).x, tilt: 0 };
  const carry: Carried[] = [];
  const sparks: Spark[] = [];
  /** Por onde a canoa passou (px do mundo): a carga vem atrás pelo mesmo caminho. */
  const wake: { x: number; y: number }[] = [];
  let phase: "fechando" | "descendo" | "chegando" | "saindo" | "abrindo" | "fim" = "fechando";
  let phaseAt = performance.now();
  let last = phaseAt;
  let lastTick = phaseAt;
  let finished = false;
  let head = 0;
  let stage = 0;
  let bumpAt = -1e9;
  /** Alvo do jogador, px da janela. Até o primeiro comando a canoa segue o meio do rio. */
  let target = canoe.x;
  let input: "nenhum" | "ponteiro" | "teclas" = "nenhum";
  /** Seta segurada (-1, 0, 1) e há quantos segundos: a velocidade cresce com o tempo (keySpeed). */
  let held = 0;
  let heldFor = 0;
  // Mouse: a canoa anda uma fração do que o mouse anda (mouseMap). `aim` é
  // onde o mouse a quer; `glide` é o que sobra de diferença quando o jogador
  // começa a usar o mouse, e some em ~1 s: a canoa nunca salta para o cursor.
  const mouse = mouseMap(W, unit);
  let anchor = W / 2;
  let aim = canoe.x;
  let glide = 0;
  /**
   * Quanto a carga ainda tem de recuar (positivo) ou avançar (negativo), px.
   * O dado novo entra logo atrás da canoa e empurra os outros para trás; o
   * erro derruba os da frente e a fila fecha o vão. Antes o dado novo ia para
   * o fim da fila, que com trinta dados já está fora da tela: o jogador
   * recolhia e não via nada mudar perto dele.
   */
  let slide = 0;
  /** Dados recolhidos em sequência desde o último erro: sobe a nota do som. */
  let streak = 0;
  let paused = false;
  let pausedAt = 0;
  let sound: GameSound | null = null;
  const hud = canvas.parentElement;

  // A canoa percorre de CANOE_Y a (percurso - 1 + CANOE_Y) unidades; a régua
  // do placar mostra essa fração, com uma marca em cada troca de estágio.
  const from = CANOE_Y / COURSE_UNITS;
  const span = (COURSE_UNITS - 1) / COURSE_UNITS;
  hud?.style.setProperty("--jogo-m1", String((STAGE_CLEAN - from) / span));
  hud?.style.setProperty("--jogo-m2", String((STAGE_GOLD - from) / span));
  hud?.style.setProperty("--jogo-p", "0");

  const buzz = (pattern: number | number[]) => {
    // Só o Android vibra; onde não há, a chamada nem existe.
    if ("vibrate" in navigator) navigator.vibrate(pattern);
  };

  const lose = (n: number, now: number) => {
    const out = carry.splice(0, n);
    slide -= out.length * sizes.gap;
    out.forEach((c, i) => sparks.push({ kind: "perda", x: c.x, y: c.y, at: now, text: c.stage ? c.digit : c.ch, dir: i % 2 ? 1 : -1 }));
    if (out.length) hooks.onCount(carry.length);
  };

  const step = (now: number, dt: number) => {
    const endY = docH - H;
    if (phase === "descendo") {
      cam.y = Math.min(endY, cam.y + cruise(cam.y, endY, unit, now - phaseAt) * dt);
      if (cam.y >= endY - 0.5) {
        phase = "chegando";
        phaseAt = now;
        // A chegada: uma onda de brilho corre a carga, da canoa para trás.
        carry.forEach((c, i) => (c.wave = now + 250 + i * 22));
        sound?.arrive();
        buzz([15, 70, 15]);
      }
    } else if (now - phaseAt > ARRIVE_MS) {
      finished = true;
      leave(now);
      return;
    }

    const cy = cam.y + CANOE_Y * H;
    const lane = channel(cy);
    if (input === "teclas") {
      if (held) heldFor += dt;
      // O alvo não sai do rio: senão, depois de segurar a seta contra a
      // margem, a seta contrária levaria um tempo morto para fazer efeito.
      target = Math.min(lane.x + lane.half, Math.max(lane.x - lane.half, target + held * keySpeed(heldFor, unit) * dt));
    } else if (input === "ponteiro") {
      glide *= Math.exp(-dt * 2);
      target = aim + glide;
    } else target = lane.x;
    const x = steer(canoe.x, target, dt, lane, sizes);
    // A proa aponta para onde a canoa vai: o desvio lateral contra o avanço.
    // Até 0,45 rad (~26°) e sem pressa: com o ângulo livre a canoa girava
    // quase de lado a cada movimento brusco e o jogo parecia nervoso.
    const forward = Math.max(120, cruise(cam.y, endY, unit, now - phaseAt));
    const lean = phase === "descendo" ? Math.atan2((x - canoe.x) / Math.max(dt, 1e-3), forward) * 0.7 : 0;
    const want = Math.max(-0.45, Math.min(0.45, lean));
    canoe.tilt += (want - canoe.tilt) * (1 - Math.exp(-dt * 6));
    canoe.x = x;
    light.x = x;
    light.y = CANOE_Y * H + sizes.canoeLen / 2;

    for (let i = head; i < items.length; i++) {
      const it = items[i];
      if (it.py < cam.y - 90) {
        if (i === head) head++;
        continue;
      }
      if (it.py > cam.y + H + 90) break;
      if (it.done || !touches(it.kind, it.px - x, it.py - cy, sizes)) continue;
      it.done = true;
      if (it.kind === "dado") {
        // Barras vizinhas com alturas parecidas: no fim lê como gráfico, não como ruído.
        const prev = carry[0]?.level ?? 0.5;
        const level = Math.min(1, Math.max(0.12, prev + (rand() - 0.5) * 0.5));
        carry.unshift({ ch: it.text, digit: String(Math.floor(rand() * 10)), level, stage: 0, at: now, flip: -1e9, wave: -1e9, x, y: cy });
        slide += sizes.gap;
        sparks.push({ kind: "anel", x: it.px, y: it.py, at: now, text: "", dir: 0 });
        hooks.onCount(carry.length);
        sound?.pick(streak++);
      } else {
        lose(ERROR_COST, now);
        bumpAt = now;
        streak = 0;
        sound?.hit();
        buzz(40);
      }
    }

    // A carga segue a canoa pelo caminho que ela fez, um dado a cada `gap` px.
    if (!wake.length || cy - wake[wake.length - 1].y >= 2) wake.push({ x, y: cy });
    if (wake.length > 900) wake.splice(0, 300);
    slide *= Math.exp(-dt * 14);
    let j = wake.length - 1;
    for (let i = 0; i < carry.length; i++) {
      const c = carry[i];
      const wy = cy - sizes.canoeLen / 2 - 12 - i * sizes.gap + slide;
      while (j > 0 && wake[j].y > wy) j--;
      c.x = wake[j].x;
      c.y = wy;
      // Cada dado muda de estágio quando ele mesmo cruza a marca: a troca
      // sobe pela carga como uma onda, da canoa para trás.
      const at = wy / docH;
      const goal = at > STAGE_GOLD ? 2 : at > STAGE_CLEAN ? 1 : 0;
      if (goal > c.stage && now - c.at > 300 && now - c.flip > 260) {
        c.stage += 1;
        c.flip = now;
      }
    }
    // Parada na foz, o que ainda não virou barra vira: chega tudo pronto.
    if (phase === "chegando") {
      for (const c of carry) {
        if (c.stage < 2 && now - c.flip > 200) {
          c.stage += 1;
          c.flip = now;
        }
      }
    }

    const here = cy / docH > STAGE_GOLD ? 2 : cy / docH > STAGE_CLEAN ? 1 : 0;
    if (here !== stage) {
      stage = here;
      hooks.onStage(here);
      sound?.stage();
    }
    hud?.style.setProperty("--jogo-p", Math.min(1, Math.max(0, (cy / docH - from) / span)).toFixed(4));
  };

  /**
   * As duas linhas de etapa, presas ao rio na altura em que o dado muda de
   * estágio. O jogador vê a troca chegando e entende por que a carga mudou de
   * cara ao cruzar: sem elas a mudança parecia acontecer do nada.
   */
  const drawGates = () => {
    const gates = [
      { at: STAGE_CLEAN, color: SILVER, label: options.stages[1] },
      { at: STAGE_GOLD, color: GOLD, label: options.stages[2] },
    ];
    for (const gate of gates) {
      const wy = gate.at * docH;
      const sy = wy - cam.y;
      if (sy < -30 || sy > H + 30) continue;
      const lane = channel(wy);
      ctx.save();
      ctx.strokeStyle = gate.color;
      ctx.globalAlpha *= 0.85;
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 7]);
      ctx.beginPath();
      ctx.moveTo(lane.x - lane.half, sy);
      ctx.lineTo(lane.x + lane.half, sy);
      ctx.stroke();
      ctx.setLineDash([]);
      // O nome do estágio numa etiqueta escura no meio da linha, como placa sobre o rio.
      ctx.font = fontChip;
      const text = gate.label.toUpperCase();
      const w = ctx.measureText(text).width + 18;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.roundRect(lane.x - w / 2, sy - 11, w, 22, 11);
      ctx.fillStyle = "rgb(3 7 5 / 0.92)";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = gate.color;
      ctx.fillText(text, lane.x, sy + 1);
      ctx.restore();
    }
  };

  const drawCanoe = (now: number) => {
    const L = sizes.canoeLen;
    const w = sizes.canoeWid;
    const hull = (k: number) => {
      ctx.beginPath();
      ctx.moveTo(0, (L / 2) * k);
      ctx.bezierCurveTo(w * 0.62 * k, L * 0.28 * k, w * 0.62 * k, -L * 0.28 * k, 0, (-L / 2) * k);
      ctx.bezierCurveTo(-w * 0.62 * k, -L * 0.28 * k, -w * 0.62 * k, L * 0.28 * k, 0, (L / 2) * k);
    };
    ctx.save();
    ctx.translate(canoe.x, CANOE_Y * H + Math.sin(now / 520) * 1.5);
    // Canvas gira no sentido horário; a proa (para baixo) tem de ir para o lado do desvio.
    ctx.rotate(-canoe.tilt);
    // Sombra na água: separa o casco do rio, que debaixo da lanterna é claro.
    ctx.save();
    ctx.translate(2.5, 3);
    hull(1.06);
    ctx.fillStyle = "rgb(0 0 0 / 0.4)";
    ctx.fill();
    ctx.restore();
    const stroke = Math.sin(now / 240);
    if (ready(canoeSprite)) {
      // A remada: uma ondinha abre na água de um lado, depois do outro, na
      // altura do remo. O sprite é parado; sem isto a canoa parecia à deriva.
      const beat = (now / 700) % 2;
      const grow = beat % 1;
      ctx.beginPath();
      ctx.arc((beat < 1 ? -1 : 1) * (w / 2 + 5), L * 0.04, 3 + 8 * grow, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = `rgb(237 235 230 / ${(0.55 * (1 - grow)).toFixed(3)})`;
      ctx.stroke();
      // A escala leva o casco do arquivo ao comprimento da física.
      const k = L / SPRITE.hull;
      ctx.drawImage(canoeSprite, (-SPRITE.canoeW / 2) * k, (-SPRITE.canoeH / 2) * k, SPRITE.canoeW * k, SPRITE.canoeH * k);
      // A lamparina já está no desenho, na ponta da proa; o clarão por cima é o que a liga à luz na água.
      ctx.drawImage(haloLamp, -12, L / 2 - 15, 24, 24);
      ctx.restore();
      return;
    }
    // Reserva em vetor, para quando os sprites não carregam.
    // Madeira escura com contorno quase preto: a primeira versão era cor de
    // mel e desaparecia na água dourada da foz.
    hull(1);
    ctx.fillStyle = "#a06a34";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1a0f06";
    ctx.stroke();
    hull(0.7);
    ctx.fillStyle = "#5b3a1a";
    ctx.fill();
    // Remo: troca de lado a cada remada.
    const sideways = (stroke > 0 ? 1 : -1) * (w / 2 + 3 + 7 * Math.abs(stroke));
    ctx.beginPath();
    ctx.moveTo(0, -L * 0.06);
    ctx.lineTo(sideways, L * 0.1 - 5 * Math.abs(stroke));
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#e7d3ad";
    ctx.stroke();
    // Quem rema.
    ctx.beginPath();
    ctx.arc(0, -L * 0.08, w * 0.24, 0, Math.PI * 2);
    ctx.fillStyle = "#edebe6";
    ctx.fill();
    // A lanterna na proa: é ela que acende a água em volta (sceneState.game.light).
    ctx.drawImage(haloLamp, -12, L / 2 - 19, 24, 24);
    ctx.beginPath();
    ctx.arc(0, L / 2 - 7, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = "#fff1c9";
    ctx.fill();
    ctx.restore();
  };

  const draw = (now: number, alpha: number) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = alpha;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Tranco de quando a canoa pega um erro.
    const jolt = Math.max(0, 1 - (now - bumpAt) / 320);
    if (jolt > 0) ctx.translate(Math.sin(now / 17) * 6 * jolt, Math.cos(now / 23) * 4 * jolt);

    drawGates();

    // A carga. Cada dado vai sobre uma conta escura: sem ela, o número prata
    // sumia na água clara da noite e a barra dourada, na água dourada da foz
    // (captura do primeiro teste no navegador). Primeiro o fundo de todas,
    // depois os sinais, para a conta de um dado não cobrir o sinal do vizinho.
    const barW = 6 + 26;
    for (const c of carry) {
      const sy = c.y - cam.y;
      if (sy < -20) continue;
      ctx.fillStyle = INK_BACK;
      if (c.stage === 2) ctx.fillRect(c.x - barW / 2 - 3, sy - sizes.gap / 2, barW + 6, sizes.gap);
      else {
        ctx.beginPath();
        ctx.arc(c.x, sy, sizes.bead, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    for (const c of carry) {
      const sy = c.y - cam.y;
      if (sy < -20) continue;
      // Ao mudar de estágio o dado pisca em branco e assenta na cor nova. Na
      // chegada, a onda (`wave`) faz o mesmo brilho correr a carga inteira.
      const sinceWave = now - c.wave;
      const pop = Math.max(0, 1 - (now - c.flip) / 260, sinceWave >= 0 && sinceWave < 260 ? 1 - sinceWave / 260 : 0);
      const color = c.stage === 2 ? GOLD : c.stage === 1 ? SILVER : BRONZE;
      ctx.fillStyle = pop > 0.5 ? "#ffffff" : color;
      if (c.stage === 2) {
        // Barra deitada, todas saindo da mesma linha: a fila inteira lê como gráfico de barras.
        ctx.fillRect(c.x - barW / 2, sy - 3.5, 6 + c.level * 26, 7);
      } else {
        ctx.font = fontSmall;
        ctx.fillText(c.stage ? c.digit : c.ch, c.x, sy + 0.5);
      }
    }

    for (let i = head; i < items.length; i++) {
      const it = items[i];
      const sy = it.py - cam.y + Math.sin(now / 420 + it.py) * 2;
      if (sy > H + 60) break;
      if (it.done || sy < -60) continue;
      if (it.kind === "dado") {
        // Boia escura com aro: é o que separa o dado a recolher dos sinais
        // que o próprio rio leva, de noite e de manhã.
        ctx.drawImage(haloData, it.px - 30, sy - 30, 60, 60);
        ctx.beginPath();
        ctx.arc(it.px, sy, sizes.buoy, 0, Math.PI * 2);
        ctx.fillStyle = INK_BACK;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = BRONZE;
        ctx.stroke();
        ctx.font = fontBig;
        ctx.fillStyle = BRONZE;
        ctx.fillText(it.text, it.px, sy + 1);
      } else {
        const w = sizes.chipW;
        const h = sizes.chipH;
        ctx.drawImage(haloError, it.px - w, sy - w, w * 2, w * 2);
        ctx.font = fontChip;
        let plateW: number = w;
        let plateH: number = h;
        // O erro boia num tronco: obstáculo de rio, que se entende sem ler a
        // etiqueta. Com o tronco, a etiqueta encolhe para o tamanho do texto
        // e deixa a madeira aparecer nas pontas e nas bordas. O tronco é 30%
        // mais largo que a área que de fato bate: raspar a ponta dele não
        // conta, e errar para o lado do jogador é melhor que o contrário.
        if (ready(logSprite)) {
          const lw = w * 1.3;
          const lh = (lw * SPRITE.logH) / SPRITE.logW;
          ctx.drawImage(logSprite, it.px - lw / 2, sy - lh / 2, lw, lh);
          plateW = Math.min(w, ctx.measureText(it.text).width + 12);
          plateH = h - 5;
        }
        ctx.beginPath();
        ctx.roundRect(it.px - plateW / 2, sy - plateH / 2, plateW, plateH, 4);
        ctx.fillStyle = "rgb(92 14 20 / 0.94)";
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#ff6b6b";
        ctx.stroke();
        ctx.font = fontChip;
        ctx.fillStyle = "#ffdede";
        ctx.fillText(it.text, it.px, sy + 1);
      }
    }

    drawCanoe(now);

    for (let i = sparks.length - 1; i >= 0; i--) {
      const p = sparks[i];
      const k = (now - p.at) / (p.kind === "anel" ? 380 : 700);
      if (k >= 1) {
        sparks.splice(i, 1);
        continue;
      }
      const sy = p.y - cam.y;
      ctx.globalAlpha = alpha * (1 - k);
      if (p.kind === "anel") {
        ctx.beginPath();
        ctx.arc(p.x, sy, 10 + 24 * k, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = BRONZE;
        ctx.stroke();
      } else {
        // Dado perdido: sai de lado, vermelho, e fica para trás com a correnteza.
        ctx.font = fontSmall;
        ctx.fillStyle = "#ff6b6b";
        ctx.fillText(p.text, p.x + p.dir * 46 * k, sy);
      }
      ctx.globalAlpha = alpha;
    }

    // Bater num erro tinge a tela de vermelho por um instante: o tranco
    // sozinho passava despercebido quando a canoa estava longe do centro.
    if (jolt > 0) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = `rgb(255 60 60 / ${(0.16 * jolt).toFixed(3)})`;
      ctx.fillRect(0, 0, W, H);
    }
  };

  const setPaused = (on: boolean) => {
    // Só a descida pausa: a troca de cenário e a chegada são curtas e não dependem do jogador.
    if (on === paused || (on && phase !== "descendo")) return;
    const now = performance.now();
    paused = on;
    if (on) {
      pausedAt = now;
      held = 0;
    } else {
      // O tempo parado não conta para a arrancada nem para o freio da descida.
      phaseAt += now - pausedAt;
      last = now;
    }
    hooks.onPause(on);
  };

  const setSound = (on: boolean) => {
    if (on && !sound) sound = createSound();
    else if (!on && sound) {
      sound.close();
      sound = null;
    }
  };

  /** Desfaz o que o jogo mudou na cena e na página. Sem animação. */
  const restore = () => {
    s.game = null;
    s.camera = null;
    root.removeAttribute("data-jogo");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const unlisten = () => {
    window.clearInterval(watchdog);
    canvas.removeEventListener("pointerdown", onPointer);
    canvas.removeEventListener("pointermove", onPointer);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("keyup", onKey);
    window.removeEventListener("blur", onBlur);
    window.removeEventListener("wheel", block);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisible);
  };

  const stop = () => {
    if (phase === "fim") return;
    phase = "fim";
    unlisten();
    setSound(false);
    restore();
    s.tick = null;
    s.curtain = 1;
    wakeScene();
  };

  /** Saída sem cortina, avisando quem chamou: a cena sumiu ou a janela mudou de largura. */
  const abort = () => {
    if (phase === "fim") return;
    stop();
    hooks.onQuit();
  };

  function leave(now: number) {
    if (phase === "saindo" || phase === "abrindo" || phase === "fim") return;
    // Antes de o rio trocar não há o que apagar: volta direto.
    if (phase === "fechando") return abort();
    if (paused) {
      paused = false;
      hooks.onPause(false);
    }
    phase = "saindo";
    phaseAt = now;
    hooks.onLeave();
  }

  const tick = (now: number) => {
    try {
      lastTick = now;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      const t = now - phaseAt;
      if (phase === "fechando") {
        s.curtain = 1 - Math.min(1, t / CLOSE_MS);
        if (t < CLOSE_MS) return;
        // No escuro: entra o rio do jogo, a câmera vai para a nascente e o luar chega de novo.
        s.game = { river, docH, light };
        s.camera = cam;
        s.replayReveal = true;
        s.curtain = 1;
        phase = "descendo";
        phaseAt = now;
        return;
      }
      if (phase === "saindo") {
        s.curtain = 1 - Math.min(1, t / CLOSE_MS);
        draw(now, s.curtain);
        if (t < CLOSE_MS) return;
        restore();
        // Quem desceu até a foz chega ao contato: é lá que o rio da home deságua.
        if (finished) window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
        phase = "abrindo";
        phaseAt = now;
        return;
      }
      if (phase === "abrindo") {
        s.curtain = Math.min(1, t / OPEN_MS);
        if (t < OPEN_MS) return;
        phase = "fim";
        unlisten();
        // O acorde da chegada ainda está soando quando a cortina sobe: o áudio fecha um pouco depois.
        const ringing = sound;
        sound = null;
        if (ringing) window.setTimeout(ringing.close, 1200);
        s.tick = null;
        s.curtain = 1;
        wakeScene();
        // O gráfico do cartão segue a ordem da coleta: o primeiro dado recolhido é a primeira barra.
        if (finished) hooks.onFinish({ delivered: carry.length, total, bars: carry.map((c) => c.level).reverse() });
        else hooks.onQuit();
        return;
      }
      if (phase === "fim") return;
      if (paused) {
        // Pausado: o rio para, mas a cena continua viva (a canoa boia, a água cintila).
        draw(now, 1);
        return;
      }
      step(now, dt);
      if (phase === "descendo" || phase === "chegando") draw(now, phase === "descendo" ? Math.min(1, t / 500) : 1);
    } catch (err) {
      // Um erro aqui se repetiria a cada quadro com a página escondida: melhor devolver a página.
      console.error(err);
      abort();
    }
  };

  function onPointer(e: PointerEvent) {
    // Pausado, um clique ou toque na tela continua (mexer o mouse, não).
    if (paused) {
      if (e.type === "pointerdown") setPaused(false);
      else return;
    }
    if (e.pointerType === "touch") {
      // O dedo manda 1 para 1: a canoa vai para baixo dele.
      aim = e.clientX;
      glide = 0;
    } else {
      if (input !== "ponteiro") {
        // Primeiro movimento do mouse (ou volta do teclado): o ponto em que
        // o cursor está passa a valer a posição atual da canoa, até onde as
        // margens continuam ao alcance; o resto da diferença escoa em `glide`.
        anchor = Math.min(mouse.hi, Math.max(mouse.lo, e.clientX - (canoe.x - W / 2) / mouse.gain));
        glide = canoe.x - (W / 2 + (e.clientX - anchor) * mouse.gain);
      }
      aim = W / 2 + (e.clientX - anchor) * mouse.gain;
    }
    input = "ponteiro";
  }
  function onKey(e: KeyboardEvent) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const down = e.type === "keydown";
    if (e.key === "Escape") {
      if (down) leave(performance.now());
      return;
    }
    const onButton = e.target instanceof HTMLButtonElement;
    // Espaço ou P pausa e continua. Num botão com foco o espaço é do botão
    // (o "continuar" da pausa já faz a mesma coisa; os dois juntos se anulariam).
    if (e.key === "p" || e.key === "P" || (e.key === " " && !onButton)) {
      e.preventDefault();
      if (down && !e.repeat) setPaused(!paused);
      return;
    }
    const dir = e.key === "ArrowLeft" || e.key === "a" || e.key === "A" ? -1 : e.key === "ArrowRight" || e.key === "d" || e.key === "D" ? 1 : 0;
    if (dir) {
      e.preventDefault();
      if (paused) return;
      if (down) {
        // Do mouse para o teclado: o alvo passa a ser onde a canoa está, não onde o mouse ficou.
        if (input !== "teclas") target = canoe.x;
        // Seta nova (a repetição automática da tecla não conta): a arrancada recomeça devagar.
        if (held !== dir) heldFor = 0;
        held = dir;
        input = "teclas";
      } else if (held === dir) held = 0;
      return;
    }
    // A página está escondida: seta para baixo e Page Down não podem rolá-la por baixo do jogo.
    if (down && ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(e.key)) e.preventDefault();
  }
  function onBlur() {
    // A janela perdeu o foco (outra aba, outro programa, uma notificação): o
    // rio não pode continuar descendo sozinho com o jogador olhando para outro lado.
    held = 0;
    setPaused(true);
  }
  function block(e: Event) {
    e.preventDefault();
  }
  function onResize() {
    // A largura mudou (janela redimensionada, celular girado): o rio do jogo
    // foi calculado para a outra. Devolve a página em vez de remendar.
    if (document.documentElement.clientWidth !== W) abort();
    else fit();
  }
  function onVisible() {
    lastTick = performance.now();
    if (document.hidden) setPaused(true);
  }
  // Se a cena parar de chamar o `tick` (contexto WebGL perdido), a página
  // ficaria escondida para sempre. Com a aba em segundo plano o rAF para de
  // propósito: aí não conta.
  const watchdog = window.setInterval(() => {
    if (!document.hidden && performance.now() - lastTick > 2500) abort();
  }, 1000);

  canvas.addEventListener("pointerdown", onPointer);
  canvas.addEventListener("pointermove", onPointer);
  window.addEventListener("keydown", onKey);
  window.addEventListener("keyup", onKey);
  window.addEventListener("blur", onBlur);
  window.addEventListener("wheel", block, { passive: false });
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisible);

  root.dataset.jogo = "";
  s.tick = tick;
  wakeScene();
  if (options.sound) setSound(true);

  return { quit: () => leave(performance.now()), stop, setPaused, setSound };
}
