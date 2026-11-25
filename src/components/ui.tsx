import clsx from "clsx";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { Metric } from "@/content/types";

// Um par de botões só, no site inteiro: primário (ouro) e secundário (contorno).
const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.95rem] font-medium transition-[transform,background-color,border-color,color] duration-200 ease-out-expo hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]";

export function ButtonLink({
  variant = "primary",
  className,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: "primary" | "secondary"; children: ReactNode }) {
  return (
    <a
      className={clsx(
        base,
        variant === "primary" ? "bg-gold text-bg hover:bg-[#f2c862]" : "border border-line-strong bg-bg/40 text-ink backdrop-blur hover:border-gold hover:text-gold",
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={clsx("size-4 transition-transform duration-200 group-hover:translate-x-0.5", className)}>
      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Chips({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={clsx("flex flex-wrap gap-1.5", className)}>
      {items.map((s) => (
        <li key={s} className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.72rem] text-muted">
          {s}
        </li>
      ))}
    </ul>
  );
}

export function Metrics({ items, className }: { items: Metric[]; className?: string }) {
  return (
    <dl className={clsx("grid grid-cols-3 gap-4", className)}>
      {items.map((m) => (
        // flex-col-reverse: o valor (dd) aparece em cima, mas o leitor de tela
        // lê "rótulo: valor" na ordem semântica.
        // justify-end: em coluna invertida o "início" é embaixo; sem isso o valor
        // descia quando o rótulo tinha menos linhas que o vizinho.
        <div key={m.label} className="flex flex-col-reverse justify-end border-t border-line-strong pt-3">
          <dt className="mt-1 text-sm leading-snug text-muted">{m.label}</dt>
          {/* nowrap: "R$ 0" e "14 dias" quebravam no espaço. Em 390 px cada coluna
              tem ~106 px; text-2xl é o maior tamanho em que "Nenhuma" ainda cabe. */}
          <dd className="whitespace-nowrap font-display text-2xl font-bold tracking-tight text-ink sm:text-4xl">{m.value}</dd>
        </div>
      ))}
    </dl>
  );
}
