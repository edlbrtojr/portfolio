"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useRef } from "react";
import { NOTES_MIN_WIDTH, riverX } from "../scene/river-curve";
import { useChart } from "./geometry";

/** Quanto do ângulo do rio a tela acompanha, e o teto em graus. Mais que isso e a captura fica difícil de ler. */
const TILT = 0.3;
const MAX_TILT = 4;

/**
 * A tela de um projeto boiando no rio, como um barco: fica sobre a água na
 * altura do projeto e gira um pouco para o lado em que o rio corre ali.
 *
 * A posição vem da mesma curva do shader (riverX): o componente mede a
 * altura do próprio bloco no documento e publica, em CSS, onde está o centro
 * da água naquela altura (--rio-x, em cqw da carta) e o giro (--rio-giro). O
 * CSS decide o resto (chart.css, .barco), inclusive os limites para a tela
 * nunca entrar na coluna de texto nem sair da moldura.
 *
 * Só na carta inteira (a partir de NOTES_MIN_WIDTH). No celular e no tablet
 * o rio é estreito ou fica na lombada, e a tela vai no fluxo, embaixo do
 * texto, sem variável nenhuma.
 *
 * É um segundo link para o mesmo case (o nome do projeto é o primeiro): fora
 * da ordem de tabulação e da árvore de acessibilidade, para leitor de tela e
 * teclado não passarem duas vezes pelo mesmo destino.
 */
export function Raft({ href, children }: { href: string; children: ReactNode }) {
  const geo = useChart();
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    const block = el?.parentElement;
    const main = el?.closest("main");
    if (!el || !block || !main || !geo) return;
    const place = () => {
      if (geo.W < NOTES_MIN_WIDTH) {
        el.style.removeProperty("--rio-x");
        el.style.removeProperty("--rio-giro");
        return;
      }
      const r = block.getBoundingClientRect();
      const y = (r.top + window.scrollY + r.height / 2) / geo.unit;
      const e = 0.01;
      // Inclinação do curso em px/px; a foz (única coisa que depende da
      // altura do documento) fica muito abaixo do trabalho.
      const slope = ((riverX(y + e, geo.mode) - riverX(y - e, geo.mode)) * geo.W) / (2 * e * geo.unit);
      const tilt = Math.max(-MAX_TILT, Math.min(MAX_TILT, -Math.atan(slope) * (180 / Math.PI) * TILT));
      el.style.setProperty("--rio-x", `${(riverX(y, geo.mode) * 100).toFixed(2)}cqw`);
      el.style.setProperty("--rio-giro", `${tilt.toFixed(2)}deg`);
    };
    place();
    // Fontes e imagens mudam a altura do que está acima e o bloco desce.
    const ro = new ResizeObserver(place);
    ro.observe(main);
    return () => ro.disconnect();
  }, [geo]);

  return (
    <Link ref={ref} href={href} className="barco" tabIndex={-1} aria-hidden data-lantern>
      <span className="barco-deriva">
        <span className="barco-tela">{children}</span>
      </span>
    </Link>
  );
}
