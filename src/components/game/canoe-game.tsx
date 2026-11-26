"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Content } from "@/content/types";
import type { GameResult } from "./engine";

type Phase = "parado" | "jogando" | "saindo" | "fim";

const fill = (text: string, r: GameResult) => text.replace("{n}", String(r.delivered)).replace("{total}", String(r.total));

/**
 * O jogo da canoa: o botão que o abre (na abertura da home), a camada do jogo
 * com o placar e o cartão do resultado. As regras estão em course.ts e o
 * motor em engine.ts, que só é baixado quando alguém clica.
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
 */
export function CanoeGame({ t }: { t: Content["game"] }) {
  const [phase, setPhase] = useState<Phase>("parado");
  /** Conta as descidas: é o que dispara o efeito que liga o motor. */
  const [run, setRun] = useState(0);
  const [count, setCount] = useState(0);
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const quit = useRef<() => void>(() => {});

  const start = () => {
    if (phase === "jogando" || phase === "saindo") return;
    if (document.documentElement.dataset.webgl !== "on" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setCount(0);
    setStage(0);
    setResult(null);
    setPhase("jogando");
    setRun((n) => n + 1);
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
    import("./engine")
      .then(({ startGame }) => {
        if (cancelled) return;
        const game = startGame(el, {
          onCount: setCount,
          onStage: setStage,
          onLeave: () => setPhase("saindo"),
          onFinish: (r) => {
            setResult(r);
            setPhase("fim");
          },
          onQuit: back,
        });
        if (!game) return back();
        stop = game.stop;
        quit.current = game.quit;
      })
      .catch(back);
    return () => {
      cancelled = true;
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

  return (
    <>
      <button ref={opener} type="button" className="jogo-convite" onClick={start}>
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
          <div ref={layer} className="jogo" role="group" aria-label={t.label} tabIndex={-1} data-saindo={phase === "saindo" ? "" : undefined}>
            <canvas ref={canvas} className="jogo-tela" />
            <div className="jogo-topo">
              {/* Os três estágios do dado, em palavra comum; o da vez acende na cor que ele tem na água. */}
              <p className="jogo-etapas">
                {t.stages.map((name, i) => (
                  <span key={name} data-etapa={i} data-vez={i === stage ? "" : undefined}>
                    {name}
                  </span>
                ))}
              </p>
              <p className="jogo-conta">
                <output>{count}</output> {t.aboard}
              </p>
              <button type="button" className="jogo-sair" onClick={() => quit.current()}>
                {t.quit} <kbd aria-hidden>Esc</kbd>
              </button>
            </div>
            <p className="jogo-dica">
              <span className="jogo-dica-mouse">{t.hintMouse}</span>
              <span className="jogo-dica-toque">{t.hintTouch}</span>
              <span>{t.rule}</span>
            </p>
          </div>,
          document.body,
        )}

      {phase === "fim" &&
        result &&
        createPortal(
          <div ref={card} className="jogo-fim" role="group" aria-labelledby="jogo-fim-titulo" tabIndex={-1}>
            {!empty && (
              // O gráfico que a pessoa trouxe: uma barra por dado entregue, na ordem da carga.
              <div aria-hidden className="jogo-barras">
                {result.bars.map((level, i) => (
                  <span key={i} style={{ height: `${Math.round(18 + level * 82)}%` }} />
                ))}
              </div>
            )}
            <p id="jogo-fim-titulo" className="jogo-fim-titulo">
              {empty ? t.emptyTitle : fill(t.doneTitle, result)}
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
