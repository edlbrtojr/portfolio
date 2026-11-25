"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/content/types";

/** Hora de agora em Rio Branco (UTC−5): diz a quem escreve se eu estou acordado. */
export function LocalTime({ locale, label }: { locale: Locale; label: string }) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", { hour: "2-digit", minute: "2-digit", timeZone: "America/Rio_Branco" });
    const tick = () => setTime(fmt.format(new Date()));
    // Primeira leitura fora do corpo do efeito; depois, a cada 15 s basta para minutos.
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 15000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [locale]);
  return (
    <span>
      <span className="font-mono text-ink">{time ?? "--:--"}</span> {label}
    </span>
  );
}
