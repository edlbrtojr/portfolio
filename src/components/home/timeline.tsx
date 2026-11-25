"use client";

import clsx from "clsx";
import { useState } from "react";
import type { Step } from "@/content/types";

/**
 * Trajetória explorável: os anos numa linha, e passar o mouse (ou tocar, ou
 * focar) mostra a etapa. Todas as etapas ficam no HTML; só a ativa aparece.
 * Começa na mais recente, que é a que o recrutador procura.
 */
export function Timeline({ steps, hint }: { steps: Step[]; hint: string }) {
  const [active, setActive] = useState(steps.length - 1);
  return (
    <div>
      <p className="mt-1 text-sm text-faint">{hint}</p>
      <div role="tablist" className="relative mt-6 flex justify-between">
        <span aria-hidden className="absolute inset-x-2 top-1/2 h-px bg-line-strong" />
        {steps.map((s, i) => (
          <button
            key={s.year}
            type="button"
            role="tab"
            id={`etapa-${s.year}`}
            aria-selected={i === active}
            aria-controls={`painel-${s.year}`}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            className={clsx(
              "relative z-10 min-h-10 rounded-full border px-3 font-mono text-xs transition-colors",
              i === active ? "border-gold bg-gold text-bg" : "border-line-strong bg-bg text-muted hover:text-ink",
            )}
          >
            {s.year}
          </button>
        ))}
      </div>
      {steps.map((s, i) => (
        <div key={s.year} id={`painel-${s.year}`} role="tabpanel" aria-labelledby={`etapa-${s.year}`} hidden={i !== active} className="mt-6 min-h-[7.5rem]">
          <p className="font-display text-xl font-semibold text-ink">{s.title}</p>
          <p className="mt-2 text-pretty leading-relaxed text-muted">{s.text}</p>
        </div>
      ))}
    </div>
  );
}
