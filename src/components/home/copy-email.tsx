"use client";

import { useRef, useState } from "react";
import { inlineLink } from "./link-style";

/** Clicar copia o e-mail; sem acesso à área de transferência, abre o cliente de e-mail. */
export function CopyEmail({ email, copied, className = inlineLink }: { email: string; copied: string; className?: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setDone(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setDone(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };
  return (
    <>
      <button type="button" onClick={copy} className={`${className} cursor-copy`}>
        {email}
      </button>
      {/* Vazio quando não há aviso: margem aqui deixava um espaço antes da pontuação. */}
      <span aria-live="polite" className="font-mono text-xs text-pen">
        {done ? ` ${copied}` : ""}
      </span>
    </>
  );
}
