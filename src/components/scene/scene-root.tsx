"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { chartGeometry } from "../chart/geometry";
import { aimLantern, sceneState, wakeScene } from "./store";

// three.js só no cliente e fora do bundle inicial: o texto da página (e o h1,
// que é o LCP) aparece antes de a cena baixar.
const SceneCanvas = dynamic(() => import("./scene-canvas"), { ssr: false });

type Dpr = number | [number, number];
type Config = { fireflies: number; dpr: Dpr; reducedMotion: boolean; coarse: boolean } | null;

/**
 * Qualidade por aparelho. Celular (ponteiro grosso) ou até 4 núcleos: dpr 1,
 * um Worley por pixel em vez de três, sem igarapés nem névoa, e animação a
 * 30 fps (ver Pacer). No notebook com GPU integrada o shader completo
 * a dpr 1,5 segurou 60 fps; acima disso o custo de preenchimento cresce com o
 * quadrado e o ganho visual numa mata noturna é nulo.
 */
function tierFor() {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency || 4;
  return coarse || cores <= 4 ? "coarse" : "full";
}

export function SceneRoot({ dim = false }: { dim?: boolean }) {
  const [config, setConfig] = useState<Config>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    sceneState.dim = dim;
    wakeScene();
  }, [dim]);

  useEffect(() => {
    // O script do <head> já testou o WebGL (e o ?webgl=off) antes da pintura.
    if (document.documentElement.dataset.webgl !== "on") return;
    const geo = chartGeometry();
    const tier = tierFor();
    sceneState.tier = tier;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const make = () => ({
      // 80 no desktop, 40 no celular: o bastante para a mata parecer viva sem virar ruído.
      fireflies: geo.mode === "spine" ? 40 : 80,
      dpr: (tier === "coarse" ? 1 : [1, 1.5]) as Dpr,
      reducedMotion: reduced.matches,
      coarse: tier === "coarse",
    });
    // Fora do corpo do efeito: setState síncrono aqui renderizaria em cascata.
    const first = window.setTimeout(() => setConfig(make()), 0);
    const onChange = () => setConfig((c) => (c ? { ...c, reducedMotion: reduced.matches } : c));
    reduced.addEventListener("change", onChange);
    return () => {
      window.clearTimeout(first);
      reduced.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    chartGeometry();
    const fine = window.matchMedia("(pointer: fine)");
    const syncFine = () => (sceneState.fine = fine.matches);
    syncFine();
    fine.addEventListener("change", syncFine);

    // O canvas fica atrás do conteúdo (pointer-events: none): os eventos vêm
    // da janela. A lanterna segue o mouse; sobre um topônimo ou nota
    // ([data-lantern]) ela pousa no elemento e chama os vaga-lumes.
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      sceneState.pointer.x = e.clientX;
      sceneState.pointer.y = e.clientY;
      sceneState.pointer.active = true;
      // Com movimento reduzido a cena só desenha quando pedem: a lanterna anda.
      if (sceneState.fine) wakeScene(600);
    };
    const over = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const el = (e.target as Element | null)?.closest?.("[data-lantern]");
      if (el) aimLantern(el, true);
    };
    const out = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-lantern]");
      const to = (e.relatedTarget as Element | null)?.closest?.("[data-lantern]");
      if (el && el !== to && !el.contains(document.activeElement)) aimLantern(null);
    };
    const leave = () => {
      sceneState.pointer.active = false;
    };
    // Teclado: a luz vai para o centro do que recebeu foco dentro do conteúdo.
    const focusIn = (e: FocusEvent) => {
      const t = e.target as Element | null;
      if (!t || !t.closest("#conteudo")) return;
      aimLantern(t, Boolean(t.closest("[data-lantern]")));
    };
    const focusOut = (e: FocusEvent) => {
      if (!e.relatedTarget) aimLantern(null);
    };
    // Altura do documento: a foz alarga nas últimas 1,5 unidade.
    const ro = new ResizeObserver(() => {
      sceneState.docH = document.documentElement.scrollHeight;
    });
    ro.observe(document.body);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerout", out, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.addEventListener("focusin", focusIn);
    document.addEventListener("focusout", focusOut);
    return () => {
      fine.removeEventListener("change", syncFine);
      ro.disconnect();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("focusin", focusIn);
      document.removeEventListener("focusout", focusOut);
    };
  }, []);

  useEffect(() => {
    if (failed) document.documentElement.dataset.webgl = "off";
  }, [failed]);

  return (
    <div aria-hidden className="scene-layer">
      {config && !failed && (
        <SceneCanvas fireflies={config.fireflies} dpr={config.dpr} reducedMotion={config.reducedMotion} coarse={config.coarse} onFail={() => setFailed(true)} />
      )}
    </div>
  );
}
