"use client";

import { useLayoutEffect } from "react";
import { chartGeometry } from "../chart/geometry";
import { caseOrigin } from "./river-curve";
import { sceneState, wakeScene } from "./store";
import { portFor, settle } from "./travel";

/**
 * Mede os portos da home: para cada projeto com página ([data-porto]), de
 * onde sai o braço do rio e onde a home rola para mostrá-lo (o mesmo cálculo
 * que o navegador faz para a âncora #slug, com o scroll-margin-top do CSS).
 * Projeto principal ([data-porto="principal"]) tem o braço sempre desenhado,
 * saindo logo abaixo do bloco, onde não há tela nem texto por cima. Os
 * menores só ganham braço quando alguém clica neles (travel.ts): seis fios
 * cruzando a lista da direita atrapalhavam a leitura.
 */
function measurePorts() {
  const s = sceneState;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  s.ports.clear();
  document.querySelectorAll<HTMLElement>("[data-porto]").forEach((el, slot) => {
    const r = el.getBoundingClientRect();
    const top = r.top + window.scrollY;
    const main = el.dataset.porto === "principal";
    const margin = Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    const y0 = main ? top + r.height + 0.03 * s.unit : top + r.height / 2;
    s.ports.set(el.id, { y0, scroll: Math.min(maxScroll, Math.max(0, top - margin)), slot });
    s.branches[slot] = main || s.activeBranch === slot ? y0 : -1;
  });
}

/**
 * Diz à cena (que não desmonta entre rotas) qual página está aberta e onde
 * ela fica no mundo: a home em (0, 0), um case no fim do braço do projeto.
 * Não desenha nada.
 */
export function ScenePage({ kind, slug }: { kind: "home" | "case"; slug?: string }) {
  // Layout effect: a cena tem de saber da página nova antes do primeiro
  // quadro dela, senão desenha um quadro com a posição da página anterior.
  useLayoutEffect(() => {
    const s = sceneState;
    const geo = chartGeometry();
    s.page = kind;
    let ro: ResizeObserver | null = null;
    if (kind === "home") {
      s.origin = { x: 0, y: 0 };
      const measure = () => {
        s.homeDocH = document.documentElement.scrollHeight;
        measurePorts();
        wakeScene();
      };
      measure();
      // Fontes e imagens mudam a altura dos blocos: os portos descem junto.
      const main = document.getElementById("conteudo");
      if (main) {
        ro = new ResizeObserver(measure);
        ro.observe(main);
      }
    } else if (slug) {
      const port = portFor(slug);
      s.origin = caseOrigin(port.y0, geo.W, geo.unit);
      s.branches[port.slot] = port.y0;
      s.activeBranch = port.slot;
    }
    wakeScene();
    // De volta à home, o braço de um projeto menor (aceso só para a viagem) apaga.
    const stop = settle(kind === "home" ? measurePorts : undefined);
    return () => {
      ro?.disconnect();
      stop();
    };
  }, [kind, slug]);
  return null;
}
