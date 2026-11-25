"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { ShapeKey } from "./shapes";
import { sceneState, setStage } from "./store";

// three.js só no cliente e fora do bundle inicial: o texto da página aparece
// antes de a cena baixar.
const SceneCanvas = dynamic(() => import("./scene-canvas"), { ssr: false });

type Config = { count: number; reducedMotion: boolean; font: string } | null;

/**
 * Quantas partículas a máquina aguenta. Os cortes vêm do custo de fill:
 * 14 mil pontos a 60 fps foi folgado em notebook com GPU integrada; em
 * celular intermediário (4 núcleos) 6 mil manteve 60 fps.
 */
function particleBudget() {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency || 4;
  if (coarse || window.innerWidth < 768) return cores <= 4 ? 4500 : 6000;
  return cores <= 4 ? 9000 : 14000;
}

export function SceneRoot({ name }: { name: string }) {
  const [config, setConfig] = useState<Config>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // O script do <head> já testou o WebGL antes da primeira pintura.
    if (document.documentElement.dataset.webgl !== "on") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    // O nome é amostrado de um canvas 2D: a fonte precisa estar carregada,
    // senão as partículas desenham a fonte de fallback.
    const font = getComputedStyle(document.documentElement).getPropertyValue("--nf-display").trim() || "sans-serif";
    document.fonts.ready.then(() => {
      if (!cancelled) setConfig({ count: particleBudget(), reducedMotion: reduced.matches, font });
    });
    const onChange = () => setConfig((c) => (c ? { ...c, reducedMotion: reduced.matches } : c));
    reduced.addEventListener("change", onChange);
    return () => {
      cancelled = true;
      reduced.removeEventListener("change", onChange);
    };
  }, []);

  // Ponteiro global: o canvas fica atrás do conteúdo (pointer-events: none),
  // então os eventos do R3F não chegam — lemos direto da janela.
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      sceneState.pointer.active = true;
    };
    const leave = () => {
      sceneState.pointer.active = false;
    };
    const scroll = () => {
      sceneState.travel = window.scrollY / window.innerHeight;
    };
    scroll();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  useEffect(() => {
    if (failed) document.documentElement.dataset.webgl = "off";
  }, [failed]);

  return (
    <div aria-hidden className="scene-layer">
      {config && !failed && (
        <SceneCanvas count={config.count} reducedMotion={config.reducedMotion} font={config.font} name={name} onFail={() => setFailed(true)} />
      )}
    </div>
  );
}

/**
 * Avisa a cena qual etapa vale: a do último elemento com `data-stage` (em
 * ordem do documento) cujo topo já passou do meio da tela. A versão anterior,
 * com IntersectionObserver numa linha fina, só reagia a elementos cruzando a
 * linha: num salto (âncora, recarregar no meio da página) ou num vão entre
 * blocos, nada cruzava e o nome em vaga-lumes ficava preso atrás do texto.
 * Só troca quando o elemento muda, para não desfazer a forma escolhida
 * passando o mouse numa linha da lista de trabalhos.
 */
export function StageObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-stage]"));
    let raf = 0;
    let last: HTMLElement | null = null;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let current: HTMLElement | null = els[0] ?? null;
      for (const el of els) if (el.getBoundingClientRect().top <= mid) current = el;
      if (current && current !== last) {
        last = current;
        setStage(current.dataset.stage as ShapeKey, current.hasAttribute("data-dim"));
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return null;
}
