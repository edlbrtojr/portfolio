"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ShapeKey } from "../scene/shapes";
import { setStage } from "../scene/store";
import { Arrow } from "../ui";

export type WorkRow = { slug: string; href: string; year: string; title: string; line: string; tag?: string; stage: ShapeKey };

// Espera antes de trocar a forma: atravessar a lista com o mouse passava por
// três ou quatro linhas e os vaga-lumes recomeçavam a viagem a cada uma.
const HOVER_DELAY_MS = 150;

/**
 * Lista de trabalhos. Passar o mouse (ou focar pelo teclado) numa linha faz
 * os vaga-lumes formarem o desenho daquele projeto. No celular, sem hover,
 * cada linha tem `data-stage` e a troca vem pela linha que cruza o meio da tela.
 */
export function WorkList({ rows }: { rows: WorkRow[] }) {
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const schedule = (stage: ShapeKey) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStage(stage), HOVER_DELAY_MS);
  };

  return (
    <ul className="mt-5 border-b border-line">
      {rows.map((r) => (
        <li key={r.slug} data-stage={r.stage}>
          <Link
            href={r.href}
            onPointerEnter={() => schedule(r.stage)}
            onPointerLeave={() => window.clearTimeout(timer.current)}
            onFocus={() => setStage(r.stage)}
            className="group grid grid-cols-[4.5rem_1fr] gap-x-4 border-t border-line py-5 transition-colors hover:border-line-strong sm:grid-cols-[5.5rem_1fr_auto]"
          >
            <span className="pt-1.5 font-mono text-xs text-faint">{r.year}</span>
            <span>
              <span className="font-display text-lg font-semibold text-ink transition-colors group-hover:text-gold">{r.title}</span>
              {r.tag && <span className="ml-2 whitespace-nowrap text-xs text-faint">{r.tag}</span>}
              <span className="mt-1 block text-pretty leading-relaxed text-muted">{r.line}</span>
            </span>
            <Arrow className="hidden self-center text-faint group-hover:text-gold sm:block" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
