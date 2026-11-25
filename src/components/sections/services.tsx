import type { Content } from "@/content/types";
import { ButtonLink } from "../ui";

export function ServicesSection({ services, whatsapp }: { services: Content["services"]; whatsapp: string }) {
  return (
    <section id="servicos" data-stage="sphere" aria-labelledby="services-title" className="flex min-h-[100svh] scroll-mt-16 items-center py-28">
      <div className="wrap">
        <div className="max-w-2xl lg:max-w-[46rem]">
          <p className="eyebrow">{services.eyebrow}</p>
          <h2 id="services-title" className="mt-4 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            {services.title}
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted">{services.body}</p>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {services.items.map((s, n) => (
              <li key={s.title} className="panel p-5">
                <p className="font-mono text-xs text-gold">{String(n + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.description}</p>
              </li>
            ))}
          </ul>
          <ButtonLink href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-9">
            {services.cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
