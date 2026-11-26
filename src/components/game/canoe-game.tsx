"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Content } from "@/content/types";
import type { Game, GameResult } from "./engine";

type Phase = "parado" | "jogando" | "saindo" | "fim";

/** Onde fica guardada a escolha de som do jogador, de uma visita para a outra. */
const SOUND_KEY = "jogo-som";

const fill = (text: string, r: GameResult) => text.replace("{n}", String(r.delivered)).replace("{total}", String(r.total));

/** O motor só é baixado quando alguém mostra que vai jogar (mouse ou foco no convite, ou o clique). */
const loadEngine = () => import("./engine");

/** Quadro do gráfico no cartão, em unidades do SVG: a linha ocupa de PAD a W - PAD e sobe ou desce AMP em volta de MID. */
const CHART = { W: 300, H: 84, PAD: 6, MID: 32, AMP: 24, BASE: 70 } as const;

/**
 * O gráfico da descida, no cartão do resultado: o caminho que a canoa fez,
 * deitado (a nascente à esquerda, a foz à direita), com um ponto em cada dado
 * recolhido e uma marca vermelha em cada erro. É o mesmo desenho em que o rio
 * se transforma na chegada (drawFinale em engine.ts): quem viu a animação
 * reconhece; quem pulou tem a legenda. Embaixo, as três etapas do dado nas
 * cores que elas têm na água.
 */
function RouteChart({ result, label }: { result: GameResult; label: string }) {
  const x = (along: number) => CHART.PAD + along * (CHART.W - 2 * CHART.PAD);
  const y = (across: number) => CHART.MID - across * CHART.AMP;
  const line = result.route.map(([a, c], i) => `${i ? "L" : "M"}${x(a).toFixed(1)} ${y(c).toFixed(1)}`).join("");
  const stops = [0, ...result.gates, 1];
  return (
    <figure aria-hidden className="jogo-rota">
      <svg viewBox={`0 0 ${CHART.W} ${CHART.H}`} width="100%">
        {/* pathLength = 1: a linha se desenha da nascente à foz com um stroke-dashoffset só. */}
        <path className="jogo-rota-linha" d={line} pathLength={1} />
        {result.picks.map(([a, c], i) => (
          <circle key={`d${i}`} className="jogo-rota-dado" cx={x(a)} cy={y(c)} r={1.7} style={{ "--i": i } as CSSProperties} />
        ))}
        {result.hits.map(([a, c], i) => (
          <path key={`e${i}`} className="jogo-rota-erro" d={`M${x(a) - 3} ${y(c) - 3}l6 6m0-6-6 6`} />
        ))}
        {[0, 1, 2].map((i) => (
          <line key={i} className="jogo-rota-etapa" data-etapa={i} x1={x(stops[i]) + (i ? 1.5 : 0)} x2={x(stops[i + 1])} y1={CHART.BASE} y2={CHART.BASE} />
        ))}
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

/**
 * O jogo da canoa: o botão que o abre (na abertura da home), a camada do jogo
 * com o placar e o cartão do resultado. As regras estão em course.ts e o
 * motor em engine.ts.
 *
 * Por que existe: o visitante faz em 20 segundos o que eu faço no trabalho
 * (recolhe dado bruto, que chega à foz limpo e em gráfico), e a descida
 * termina no contato. É entretenimento, mas apresenta o ofício e leva ao
 * convite; não é enfeite.
 *
 * Só com a cena WebGL e sem "reduzir movimento": é uma tela inteira em
 * movimento por 20 s. Nesses dois casos o CSS nem mostra o botão (game.css).
 *
 * A camada e o cartão vão por portal para o <body>: dentro do <main> eles
 * sumiriam junto com a página, que o jogo esconde (html[data-jogo]).
 *
 * O placar responde a quatro perguntas de quem joga, e só a elas: em que
 * etapa o dado está (e o que a etapa quer dizer), quantos dados eu levo,
 * quanto falta (a régua da direita, a mesma da página) e como eu saio.
 */
export function CanoeGame({ t }: { t: Content["game"] }) {
  const [phase, setPhase] = useState<Phase>("parado");
  /** Conta as descidas: é o que dispara o efeito que liga o motor. */
  const [run, setRun] = useState(0);
  const [count, setCount] = useState(0);
  /** O último movimento do placar foi perda (bateu num erro): ele pisca em vermelho. */
  const [loss, setLoss] = useState(false);
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [sound, setSound] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const game = useRef<Game | null>(null);
  const lastCount = useRef(0);
  /** O que o motor recebe na largada; escrito no clique, lido no efeito. */
  const options = useRef({ stages: t.stages, routeLabel: t.routeLabel, sound: false });

  const start = () => {
    if (phase === "jogando" || phase === "saindo") return;
    if (document.documentElement.dataset.webgl !== "on" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let wantSound = false;
    try {
      wantSound = localStorage.getItem(SOUND_KEY) === "1";
    } catch {
      // Navegação privada pode negar o localStorage: o som só começa desligado.
    }
    options.current = { stages: t.stages, routeLabel: t.routeLabel, sound: wantSound };
    lastCount.current = 0;
    setSound(wantSound);
    setCount(0);
    setLoss(false);
    setStage(0);
    setPaused(false);
    setResult(null);
    setPhase("jogando");
    setRun((n) => n + 1);
  };

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    // Dentro do clique: é quando o navegador deixa o áudio começar.
    game.current?.setSound(next);
    try {
      localStorage.setItem(SOUND_KEY, next ? "1" : "0");
    } catch {
      // Sem localStorage a escolha vale só para esta descida.
    }
  };

  useEffect(() => {
    const el = canvas.current;
    if (!run || !el) return;
    let cancelled = false;
    let stop = () => {};
    const back = () => {
      setPhase("parado");
      opener.current?.focus({ preventScroll: true });
    };
    // O foco sai do botão (que some com a página) e vai para a camada: as
    // setas e o Esc são ouvidos na janela, então basta ele não ficar perdido.
    layer.current?.focus({ preventScroll: true });
    loadEngine()
      .then(({ startGame }) => {
        if (cancelled) return;
        const started = startGame(
          el,
          {
            onCount: (n) => {
              setLoss(n < lastCount.current);
              lastCount.current = n;
              setCount(n);
            },
            onStage: setStage,
            onPause: setPaused,
            onLeave: () => setPhase("saindo"),
            onFinish: (r) => {
              setResult(r);
              setPhase("fim");
            },
            onQuit: back,
          },
          options.current,
        );
        if (!started) return back();
        stop = started.stop;
        game.current = started;
      })
      .catch(back);
    return () => {
      cancelled = true;
      game.current = null;
      stop();
    };
  }, [run]);

  // O resultado chega com a página já no contato: o foco vai para o cartão,
  // que é lido inteiro e tem os dois botões.
  useEffect(() => {
    if (phase === "fim") card.current?.focus({ preventScroll: true });
  }, [phase]);

  const playing = phase === "jogando" || phase === "saindo";
  const empty = result?.delivered === 0;
  const all = result !== null && result.delivered === result.total;

  return (
    <>
      <button ref={opener} type="button" className="jogo-convite" onClick={start} onPointerEnter={() => void loadEngine()} onFocus={() => void loadEngine()}>
        {/* Canoa de perfil, com quem rema e o remo na água: diz "barco" antes de a pessoa ler. */}
        <svg aria-hidden viewBox="0 0 34 20" width="34" height="20" className="jogo-convite-canoa">
          <path d="M1 11c2 5 5 7 9 7h14c4 0 7-2 9-7-3 1.8-6 2.4-9 2.4H10c-3 0-6-.6-9-2.4Z" fill="currentColor" />
          <circle cx="15" cy="3.6" r="2.4" fill="currentColor" />
          <path d="M15 7v5.5M11.5 6.5l11 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="jogo-convite-texto">{t.start}</span>
        <span className="jogo-convite-nota">{t.startNote}</span>
      </button>

      {playing &&
        createPortal(
          <div
            ref={layer}
            className="jogo"
            role="group"
            aria-label={t.label}
            tabIndex={-1}
            data-saindo={phase === "saindo" ? "" : undefined}
            data-pausa={paused ? "" : undefined}
          >
            <canvas ref={canvas} className="jogo-tela" />
            <div className="jogo-topo">
              <div className="jogo-etapa">
                {/* Os três estágios do dado, em palavra comum; o da vez acende na cor que ele tem na água. */}
                <p className="jogo-etapas">
                  {t.stages.map((name, i) => (
                    <span key={name} data-etapa={i} data-vez={i === stage ? "" : undefined}>
                      {name}
                    </span>
                  ))}
                </p>
                {/* O que a etapa da vez quer dizer: é aqui que o jogo explica o meu trabalho. */}
                <p key={stage} className="jogo-etapa-nota">
                  {t.stageNotes[stage]}
                </p>
              </div>
              {/* aria-live off: o <output> anunciaria cada um dos 44 dados no leitor de tela. */}
              <p className="jogo-conta">
                <output key={count} aria-live="off" data-mudou={count > 0 || loss ? "" : undefined} data-perda={loss ? "" : undefined}>
                  {count}
                </output>{" "}
                <span>{t.aboard}</span>
              </p>
              <div className="jogo-botoes">
                <button type="button" className="jogo-som" aria-pressed={sound} aria-label={t.sound} onClick={toggleSound}>
                  <svg aria-hidden viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" fill="currentColor" stroke="none" />
                    {sound ? <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11" /> : <path d="m15.5 9.5 5 5m0-5-5 5" />}
                  </svg>
                  <span aria-hidden className="jogo-som-texto">
                    {t.sound}
                  </span>
                </button>
                <button type="button" className="jogo-sair" onClick={() => game.current?.quit()}>
                  {t.quit} <kbd aria-hidden>Esc</kbd>
                </button>
              </div>
            </div>
            {/* Quanto falta: a água sobe como na régua da página, com uma marca em cada troca de etapa. */}
            <div aria-hidden className="jogo-regua">
              <span className="jogo-regua-agua" />
              <span className="jogo-regua-marca" data-marca="1" />
              <span className="jogo-regua-marca" data-marca="2" />
            </div>
            <p className="jogo-dica">
              <span className="jogo-dica-mouse">{t.hintMouse}</span>
              <span className="jogo-dica-toque">{t.hintTouch}</span>
              <span>{t.rule}</span>
            </p>
            {paused && (
              <div className="jogo-pausa">
                <p>{t.paused}</p>
                {/* autoFocus: quem pausou no espaço continua no espaço (ou no Enter). */}
                <button type="button" autoFocus onClick={() => game.current?.setPaused(false)}>
                  {t.resume} <kbd aria-hidden>{t.spaceKey}</kbd>
                </button>
              </div>
            )}
          </div>,
          document.body,
        )}

      {phase === "fim" &&
        result &&
        createPortal(
          <div ref={card} className="jogo-fim" role="group" aria-labelledby="jogo-fim-titulo" tabIndex={-1}>
            <RouteChart result={result} label={t.routeLabel} />
            <p id="jogo-fim-titulo" className="jogo-fim-titulo">
              {empty ? t.emptyTitle : fill(all ? t.perfectTitle : t.doneTitle, result)}
            </p>
            <p className="jogo-fim-texto">{empty ? t.emptyBody : t.doneBody}</p>
            <p className="jogo-fim-acoes">
              <button type="button" onClick={start}>
                {t.again}
              </button>
              <button type="button" onClick={() => setPhase("parado")}>
                {t.close}
              </button>
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}
