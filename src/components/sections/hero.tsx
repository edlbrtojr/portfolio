import type { CSSProperties } from "react";
import type { Content } from "@/content/types";
import { ButtonLink } from "../ui";

type Props = { hero: Content["hero"]; whatsapp: string };

const i = (n: number) => ({ "--i": n }) as CSSProperties;

export function Hero({ hero, whatsapp }: Props) {
  return (
    <section data-stage="name" aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col justify-end pb-24 pt-28 sm:pb-20">
      <div className="wrap grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-6">
          <p className="eyebrow enter" style={i(0)}>
            <span aria-hidden className="mr-2 inline-block size-1.5 translate-y-[-2px] rounded-full bg-teal" />
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className="mt-4">
            {/* Nome em HTML: visível sem WebGL; com a cena ativa as partículas o desenham. */}
            <span className="hero-name mb-3 block font-display text-6xl font-extrabold tracking-tight sm:text-7xl">{hero.name}</span>
            <span className="enter block text-balance font-display text-[2rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl" style={i(1)}>
              {hero.role}
            </span>
          </h1>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="enter text-pretty text-[1.05rem] leading-relaxed text-muted sm:text-lg" style={i(2)}>
            {hero.lead}
          </p>
          <div className="enter mt-7 flex flex-col gap-3 sm:flex-row" style={i(3)}>
            <ButtonLink href="#projetos" className="group">
              {hero.ctaPrimary}
            </ButtonLink>
            <ButtonLink href={whatsapp} variant="secondary" target="_blank" rel="noopener noreferrer">
              {hero.ctaWhatsapp}
            </ButtonLink>
          </div>
        </div>
      </div>
      <p aria-hidden className="enter absolute inset-x-0 bottom-6 hidden text-center font-mono text-[0.7rem] uppercase tracking-[0.2em] text-faint sm:block" style={i(5)}>
        {hero.scrollHint} ↓
      </p>
    </section>
  );
}
