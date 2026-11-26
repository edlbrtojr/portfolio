// O som do jogo da canoa: notas sintetizadas na hora (Web Audio), sem arquivo
// nenhum para baixar. Começa desligado e só existe se o jogador ligar no
// placar: site que toca som sem pedir é o que faz a pessoa fechar a aba, e
// muita gente abre portfólio no trabalho.

/**
 * Volume geral. Baixo de propósito: são sons de retorno (peguei, bati,
 * cheguei), não trilha. Chute inicial, ainda sem ajuste de ouvido.
 */
const VOLUME = 0.16;

/** Escala pentatônica maior, em semitons: qualquer sequência dela soa bem, então a coleta nunca desafina. */
const SCALE = [0, 2, 4, 7, 9];

export type GameSound = {
  /** Dado recolhido: a nota sobe a cada dado seguido e volta ao começo depois de um erro. */
  pick(streak: number): void;
  /** Erro atingido. */
  hit(): void;
  /** A canoa cruzou uma linha de etapa. */
  stage(): void;
  /** Chegada à foz. */
  arrive(): void;
  close(): void;
};

/** null onde não há Web Audio. Tem de ser chamado dentro de um gesto do usuário (clique ou tecla). */
export function createSound(): GameSound | null {
  if (typeof AudioContext === "undefined") return null;
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = VOLUME;
  master.connect(ctx.destination);

  /** Uma nota: sobe em 8 ms (sem estalo) e some até `dur`. `to` faz a altura escorregar. */
  const note = (freq: number, dur: number, type: OscillatorType, level = 1, delay = 0, to?: number) => {
    // O navegador pode ter suspendido o contexto (aba em segundo plano); a nota seguinte o acorda.
    if (ctx.state === "suspended") void ctx.resume();
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(level, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  };
  const pitch = (step: number) => 392 * 2 ** ((SCALE[step % SCALE.length] + 12 * Math.floor(step / SCALE.length)) / 12);

  return {
    // Três oitavas e recomeça: 44 dados seguidos passariam do que o ouvido aguenta.
    pick: (streak) => note(pitch(streak % 15), 0.16, "triangle", 0.8),
    hit: () => {
      note(150, 0.3, "sawtooth", 0.7, 0, 55);
      note(90, 0.22, "square", 0.35);
    },
    stage: () => {
      note(pitch(5), 0.22, "sine", 0.7);
      note(pitch(7), 0.3, "sine", 0.7, 0.09);
    },
    arrive: () => [0, 2, 4, 5, 7].forEach((s, i) => note(pitch(s), 0.5, "triangle", 0.7, i * 0.09)),
    close: () => void ctx.close(),
  };
}
