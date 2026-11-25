import Link from "next/link";
import type { Content, Locale, Project } from "@/content/types";
import { projectHref } from "@/content";
import { BrowserFrame } from "../browser-frame";
import { Arrow, ButtonLink, Chips } from "../ui";

type Props = { project: Project; index: number; locale: Locale; ui: Content["ui"] };

export function CaseSection({ project, index, locale, ui }: Props) {
  const titleId = `case-${project.slug}`;
  const site = project.links[0];
  const [main, side] = project.shots;
  return (
    <section aria-labelledby={titleId}>
      <div data-stage={project.stage} className="flex min-h-[100svh] items-center py-28">
        <div className="wrap">
          <div className="max-w-xl">
            <p className="eyebrow">
              <span className="text-gold">{String(index).padStart(2, "0")}</span> · {project.kicker}
            </p>
            <h2 id={titleId} className="mt-4 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              {project.title}
            </h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted">{project.summary}</p>
            {/* Metadado seco no lugar da antiga faixa de números. */}
            <p className="mt-6 text-sm text-muted">
              <span className="text-ink">{project.role}</span> · {project.year}
            </p>
            <Chips items={project.stack} className="mt-5" />
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={projectHref(locale, project.slug)}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 font-medium text-bg transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[#f2c862] active:translate-y-0 active:scale-[0.98]"
              >
                {ui.viewCase} <Arrow />
              </Link>
              {site && (
                <ButtonLink href={site.href} variant="secondary" target="_blank" rel="noopener noreferrer">
                  {site.label} ↗
                </ButtonLink>
              )}
            </div>
          </div>
        </div>
      </div>

      {main && (
        // No celular as capturas empilhadas ocupam ~meia tela; forçar 100svh
        // deixava um vão vazio. Tela cheia só a partir de lg.
        <div data-stage={project.stage} data-dim className="flex items-center py-12 lg:min-h-[100svh] lg:py-24">
          <div className="wrap">
            {side ? (
              // Principal alinhado à borda esquerda, secundário sobreposto e
              // alinhado à direita. Captura em pé (tabela longa) vira 4:5
              // recortada do topo; deitada mantém 16:10 para não cortar texto.
              <div className="relative grid gap-5 lg:block lg:pb-[12%]">
                <BrowserFrame shot={main} url={site?.label} className="lg:w-[78%]" priority={false} />
                <BrowserFrame
                  shot={side}
                  aspect={side.frame ?? (side.height > side.width ? "4 / 5" : "16 / 10")}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className={side.height > side.width && !side.frame ? "lg:absolute lg:bottom-0 lg:right-0 lg:w-[30%]" : "lg:absolute lg:bottom-0 lg:right-0 lg:w-[44%]"}
                />
              </div>
            ) : (
              <BrowserFrame shot={main} url={site?.label} aspect="16 / 9" sizes="(min-width: 1280px) 1200px, 100vw" />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
