import Link from "next/link";
import { allProjects, content, homeHref, projectHref, resumeHref } from "@/content";
import type { Locale, Project } from "@/content/types";
import { BrowserFrame } from "./browser-frame";
import { Diagram } from "./diagrams";
import { SceneRoot, StageObserver } from "./scene/scene-root";
import { SiteHeader } from "./site-header";
import { Arrow, ButtonLink, Chips, Metrics } from "./ui";

export function CasePage({ project, locale }: { project: Project; locale: Locale }) {
  const c = content[locale];
  const list = allProjects(locale);
  const next = list[(list.findIndex((p) => p.slug === project.slug) + 1) % list.length];
  const site = project.links[0];
  const blocks = [
    { title: c.ui.challenges, items: project.details.challenges },
    { title: c.ui.solutions, items: project.details.solutions },
    { title: c.ui.results, items: project.details.results },
  ];

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

          {project.metrics.length > 0 && <Metrics items={project.metrics} className="mt-14 max-w-3xl" />}

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

          <div className="mt-16 grid gap-5 lg:grid-cols-3">
            {blocks.map((b) => (
              <section key={b.title} className="panel p-6">
                <h2 className="font-display text-xl font-bold">{b.title}</h2>
                <ul className="mt-4 space-y-3">
                  {b.items.map((it) => (
                    <li key={it} className="flex gap-3 text-pretty leading-relaxed text-muted">
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" />
                      {it}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

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
