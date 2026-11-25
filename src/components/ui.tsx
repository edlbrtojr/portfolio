import clsx from "clsx";
import type { AnchorHTMLAttributes, ReactNode } from "react";

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

