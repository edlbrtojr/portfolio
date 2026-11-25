import Link from "next/link";
import { allProjects, content, homeHref, projectHref, resumeHref } from "@/content";
import type { Locale, Project } from "@/content/types";
import { BrowserFrame } from "./browser-frame";
import { Diagram } from "./diagrams";
import { SceneRoot, StageObserver } from "./scene/scene-root";
import { SiteHeader } from "./site-header";
import { Arrow, ButtonLink, Chips } from "./ui";

export function CasePage({ project, locale }: { project: Project; locale: Locale }) {
  const c = content[locale];
  const list = allProjects(locale);
  const next = list[(list.findIndex((p) => p.slug === project.slug) + 1) % list.length];
  const site = project.links[0];

  return (
    <>
      <SceneRoot name="EDILBERTO" />
      <StageObserver />
      <SiteHeader nav={c.nav} home={homeHref(locale)} resume={resumeHref(locale)} />
      {/* A página inteira é uma etapa só, com a cena recuada atrás do texto. */}
      <main id="conteudo" data-stage={project.stage} data-dim className="relative z-10 pb-24 pt-28">
        <article className="wrap">
          <Link href={`${homeHref(locale)}#projetos`} className="group inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-ink">
            <Arrow className="rotate-180 group-hover:-translate-x-0.5 group-hover:translate-x-0" /> {c.ui.back}
          </Link>

          <header className="mt-8 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="eyebrow">{project.kicker}</p>
              <h1 className="mt-4 text-balance font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">{project.title}</h1>
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">{project.summary}</p>
            </div>
            <dl className="grid content-start gap-5 text-sm lg:col-span-4">
              <div className="border-t border-line-strong pt-3">
                <dt className="eyebrow">{c.ui.role}</dt>
                <dd className="mt-1.5 text-ink">
                  {project.role} · {project.year}
                </dd>
              </div>
              <div className="border-t border-line-strong pt-3">
                <dt className="eyebrow">{c.ui.stack}</dt>
                <dd className="mt-2">
                  <Chips items={project.stack} />
                </dd>
              </div>
              {site && (
                <div className="pt-1">
                  <ButtonLink href={site.href} target="_blank" rel="noopener noreferrer" variant="secondary">
                    {c.ui.visitSite} ↗
                  </ButtonLink>
                </div>
              )}
            </dl>
          </header>

          <div className="mt-14 grid gap-5">
            {project.shots.length > 0
              ? project.shots.map((s, n) => (
                  <BrowserFrame key={s.src} shot={s} url={n === 0 ? site?.label : undefined} aspect={s.frame ?? `${s.width} / ${s.height}`} priority={n === 0} sizes="(min-width: 1280px) 1200px, 100vw" />
                ))
              : project.diagram && (
                  <div className="panel aspect-[16/7] p-6 sm:p-10">
                    <Diagram kind={project.diagram} title={project.title} locale={locale} />
                  </div>
                )}
          </div>

          <section aria-labelledby="overview" className="mt-20 grid gap-6 lg:grid-cols-12">
            <h2 id="overview" className="font-display text-2xl font-bold tracking-tight lg:col-span-4">
              {c.ui.overview}
            </h2>
            <p className="text-pretty text-lg leading-relaxed text-muted lg:col-span-8">{project.details.overview}</p>
          </section>

          <section aria-labelledby="decisions" className="mt-20">
            <h2 id="decisions" className="font-display text-2xl font-bold tracking-tight">
              {c.ui.decisions}
            </h2>
            {/* Cabeçalho só no desktop; no celular o peso da fonte já separa problema e decisão. */}
            <div aria-hidden className="mt-8 hidden grid-cols-12 gap-6 lg:grid">
              <span className="eyebrow col-span-5">{c.ui.problem}</span>
              <span className="eyebrow col-span-7">{c.ui.choice}</span>
            </div>
            <dl className="mt-6 border-t border-line-strong lg:mt-3">
              {project.details.decisions.map((d) => (
                <div key={d.problem} className="grid gap-2 border-b border-line py-6 lg:grid-cols-12 lg:gap-6">
                  <dt className="text-pretty font-display text-lg font-semibold leading-snug text-ink lg:col-span-5">{d.problem}</dt>
                  <dd className="text-pretty leading-relaxed text-muted lg:col-span-7">{d.choice}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="results" className="panel mt-16 p-6 sm:p-8">
            <h2 id="results" className="font-display text-xl font-bold">
              {c.ui.results}
            </h2>
            <ul className="mt-4 space-y-3">
              {project.details.results.map((it) => (
                <li key={it} className="flex gap-3 text-pretty leading-relaxed text-muted">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" />
                  {it}
                </li>
              ))}
            </ul>
          </section>

          <Link
            href={projectHref(locale, next.slug)}
            className="group mt-20 flex flex-col gap-2 border-t border-line-strong pt-8 sm:flex-row sm:items-end sm:justify-between"
          >
            <span>
              <span className="eyebrow">{c.ui.nextProject}</span>
              <span className="mt-2 block font-display text-3xl font-bold tracking-tight transition-colors group-hover:text-gold sm:text-4xl">{next.title}</span>
            </span>
            <Arrow className="size-6 text-gold" />
          </Link>
        </article>
      </main>
    </>
  );
}
