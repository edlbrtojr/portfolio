"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { arcAt, fitName, NAME, riverArc, riverBanksD, type NameMetrics } from "../scene/river-curve";
import { useChart } from "./geometry";

type Measures = NameMetrics & { H: number };

const ease = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)); // ease-out-expo
const ARRIVAL_MS = 1600;

/**
 * O que mora na água: o nome escrito ao longo do rio e, sem WebGL, a própria
 * água. Tudo aria-hidden: o nome está no h1.
 *
 * O tamanho do nome vem da água (fitName em river-curve.ts): a tinta das
 * letras cabe na parte mais estreita do trecho que ele ocupa, contando o
 * recorte das margens e a copa debruçada. A linha de base corre paralela ao
 * centro do rio, deslocada para o meio da tinta ficar no meio da água.
 *
 * Por que uma camada fixa movida por JS, e não o SVG rolando com a página: a
 * água é redesenhada pelo shader no rAF, com o `scrollY` daquele quadro. Um
 * SVG no fluxo rola pelo compositor, que pode estar um quadro à frente do
 * rAF; no navegador de verdade o nome tremia sobre a água ao rolar. Aqui o
 * SVG e o shader leem o mesmo `window.scrollY` no mesmo quadro.
 *
 * O laço de rAF só roda enquanto há o que fazer (chegada ou scroll); parado,
 * ele dorme e um listener passivo de scroll o acorda.
 *
 * Coordenadas do SVG = coordenadas do documento (o <main> começa em y = 0).
 */
export function RiverType({ name }: { name: string }) {
  const geo = useChart();
  const layer = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const nameText = useRef<SVGTextElement>(null);
  const namePath = useRef<SVGTextPathElement>(null);
  const [m, setM] = useState<Measures | null>(null);
  const arrivalStart = useRef<number | null>(null);

  // Mede depois das fontes (comprimento e tinta dependem da Instrument
  // Serif, não da fonte de fallback) e sempre que o <main> muda de altura.
  useEffect(() => {
    const main = layer.current?.closest("main");
    if (!main || !geo) return;
    let cancelled = false;
    const measure = () => {
      if (cancelled || !nameText.current) return;
      const family = getComputedStyle(nameText.current).fontFamily;
      const ctx = document.createElement("canvas").getContext("2d");
      // Sem canvas: valores da Instrument Serif itálica medidos no navegador.
      let met: NameMetrics = { len100: 327, asc100: 75, desc100: 1 };
      if (ctx) {
        ctx.font = `italic 400 100px ${family}`;
        const t = ctx.measureText(name);
        met = { len100: t.width, asc100: t.actualBoundingBoxAscent, desc100: t.actualBoundingBoxDescent };
      }
      const H = main.offsetHeight;
      setM((prev) => (prev && prev.H === H && prev.len100 === met.len100 && prev.asc100 === met.asc100 ? prev : { H, ...met }));
    };
    const ro = new ResizeObserver(() => document.fonts.ready.then(measure));
    ro.observe(main);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [geo, name]);

  const layout = useMemo(() => {
    if (!geo || !m) return null;
    const { W, unit, mode } = geo;
    const docUnits = m.H / unit;
    const cfg = NAME[mode];
    const fit = fitName(W, unit, mode, m);
    // O caminho começa duas telas acima do topo: é de lá que o nome chega.
    // Ele segue o centro do rio (não a linha de base) e o `dy` do <text>
    // desce a base até o meio da tinta cair no caminho. O espaçamento das
    // letras é medido no caminho: com ele na base, o alto das letras de
    // ~270 px ficava longe dele e, na curva, abria do lado de fora e
    // encavalava do lado de dentro ("Ed  ilbe" e "rto" grudado). No meio da
    // tinta a distorção cai pela metade.
    const nameArc = riverArc(-2.2, Math.min(docUnits, 5), W, unit, mode);
    const final = (arcAt(nameArc, cfg.span[0]) + arcAt(nameArc, cfg.span[1])) / 2 - fit.len / 2;
    const from = arcAt(nameArc, 0) - fit.len - 40;
    return {
      W,
      unit,
      H: m.H,
      nameD: nameArc.d,
      size: fit.size,
      dy: fit.offset,
      final,
      from,
      drift: cfg.drift,
      fadeFrom: cfg.fadeFrom * unit,
      fadeTo: cfg.fadeTo * unit,
      banks: riverBanksD(-0.2, docUnits + 0.2, W, unit, mode, docUnits),
    };
  }, [geo, m]);

  useEffect(() => {
    const s = svg.current;
    const tp = namePath.current;
    if (!layout || !s || !tp) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    // A medida muda quando fontes e imagens terminam de carregar; a chegada
    // continua de onde estava em vez de recomeçar.
    arrivalStart.current ??= performance.now();
    const t0 = arrivalStart.current;
    const { fadeFrom, fadeTo } = layout;
    const text = tp.parentElement as SVGTextElement | null;
    let lastY = Number.NaN;
    let lastOpacity = -1;
    let arriving = !reduced && performance.now() - t0 < ARRIVAL_MS;
    let raf = 0;

    const frame = (now: number) => {
      raf = 0;
      const y = window.scrollY;
      const t = arriving ? Math.min(1, (now - t0) / ARRIVAL_MS) : 1;
      // Parado e sem chegada: dorme até o próximo scroll.
      if (y === lastY && !arriving) return;
      raf = requestAnimationFrame(frame);
      lastY = y;
      s.style.transform = `translate3d(0, ${-y}px, 0)`;
      const opacity = Math.round(Math.min(1, Math.max(0, (fadeTo - y) / (fadeTo - fadeFrom))) * 100) / 100;
      if (text && opacity !== lastOpacity) {
        text.style.opacity = String(opacity);
        // A marca da moldura só volta quando o nome do rio já sumiu: no
        // celular os dois dividiam o canto superior esquerdo.
        root.toggleAttribute("data-nome-visivel", opacity > 0);
        lastOpacity = opacity;
      }
      if (opacity > 0 || arriving) {
        const drift = reduced ? 0 : layout.drift * Math.min(y, fadeTo);
        tp.setAttribute("startOffset", (layout.from + (layout.final - layout.from) * ease(t) + drift).toFixed(2));
      }
      if (t >= 1) arriving = false;
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      root.removeAttribute("data-nome-visivel");
    };
  }, [layout]);

  return (
    <div ref={layer} aria-hidden className="rio-camada">
      <svg
        ref={svg}
        className="rio-tipos"
        data-pronto={layout ? "" : undefined}
        width={layout?.W ?? 0}
        height={layout?.H ?? 0}
        viewBox={layout ? `0 0 ${layout.W} ${layout.H}` : undefined}
      >
        {layout && (
          <>
            <path className="rio-agua" d={layout.banks} />
            <path id="rio-nome-caminho" d={layout.nameD} fill="none" />
          </>
        )}
        {/* O <text> do nome existe desde o primeiro render: é dele que sai a fonte medida. */}
        <text ref={nameText} className="rio-nome" fontSize={layout?.size ?? 100} dy={layout?.dy}>
          {layout && (
            <textPath ref={namePath} href="#rio-nome-caminho" startOffset={layout.from}>
              {[...name].map((ch, i) => (
                <tspan key={i} style={{ "--i": i } as CSSProperties}>
                  {ch}
                </tspan>
              ))}
            </textPath>
          )}
        </text>
      </svg>
    </div>
  );
}
