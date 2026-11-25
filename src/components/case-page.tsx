import Image from "next/image";
import Link from "next/link";
import { allProjects, content, homeHref, projectHref, resumeHref } from "@/content";
import type { Locale, Project } from "@/content/types";
import { annotate } from "@/lib/annotate";
import { ChartFrame } from "./chart/chart-frame";
import { MarginNote } from "./chart/margin-note";
import { Diagram } from "./diagrams";
import { numberNotes, RichText } from "./home/rich-text";
import { SceneRoot } from "./scene/scene-root";

/**
 * O case como folha de detalhe da carta: mesma moldura, o projeto como
 * topônimo, o texto na coluna esquerda e os problemas anotados na margem, do
 * outro lado do rio. A cena recua (dim) para as capturas mandarem.
 */
export function CasePage({ project, locale }: { project: Project; locale: Locale }) {
  const c = content[locale];
  const list = allProjects(locale);
  const next = list[(list.findIndex((p) => p.slug === project.slug) + 1) % list.length];
  const site = project.links[0];
  const home = homeHref(locale);
  const other: Locale = locale === "pt" ? "en" : "pt";
  const copy = { locale, copied: c.contact.copied };
  // Jargão do contexto e das decisões com nota de professor, numerado na
  // página inteira (1, 2, 3… do contexto até a última decisão).
  const texts = [project.details.overview, ...project.details.decisions.map((d) => d.choice)];
  const rich = annotate(texts, c.glossary);
  const [overview, ...choices] = numberNotes(rich, "nota-caso").map((n, i) => ({ ...n, parts: rich[i] }));

  return (
    <>
      <SceneRoot dim />
      <ChartFrame
        locale={locale}
        nav={c.nav}
        channels={c.contact.channels}
        copied={c.contact.copied}
        home={home}
        resume={resumeHref(locale)}
        switchHref={projectHref(other, project.slug)}
        photos
      />
      <main id="conteudo" tabIndex={-1} className="carta caso">
        <article>
          <p className="col caso-volta">
            {/* Volta ao topônimo exato na carta, não ao topo da home. */}
            <Link href={`${home}#${project.slug}`}>← {c.ui.back}</Link>
          </p>

          <header className="caso-cabeca">
            <p className="col caso-kicker">
              {project.kicker} <span aria-hidden>·</span> <span className="font-mono">{project.year}</span>
            </p>
            {/* Sem a nota do topônimo ("produto próprio", "freelance"): o kicker logo acima já diz a relação. */}
            <h1 className="caso-titulo">
              <span aria-hidden className="topo-nome">
                {project.toponym.name}
              </span>
              <span className="sr-only">{project.title}</span>
            </h1>
            <p className="col caso-resumo">{project.summary}</p>
            <dl className="col caso-ficha">
              <div>
                <dt>{c.ui.role}</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>{c.ui.stack}</dt>
                <dd>{project.stack.join(", ")}.</dd>
              </div>
            </dl>
            {site && (
              <p className="col caso-site">
                <a href={site.href} target="_blank" rel="noopener noreferrer">
                  {c.ui.visitSite} ↗
                </a>
              </p>
            )}
          </header>

          <div className="caso-capturas">
            {project.shots.length > 0
              ? project.shots.map((s, n) => (
                  <figure key={s.src} className="caso-captura" style={{ aspectRatio: s.frame ?? `${s.width} / ${s.height}` }}>
                    <Image src={s.src} alt={s.alt} fill sizes="(min-width: 1100px) 85vw, 100vw" priority={n === 0} />
                  </figure>
                ))
              : project.diagram && (
                  <div className="caso-diagrama">
                    <Diagram kind={project.diagram} title={project.title} locale={locale} />
                  </div>
                )}
          </div>

          <section aria-labelledby="contexto" className="caso-secao">
            <h2 id="contexto" className="col secao-titulo">
              {c.ui.overview}
            </h2>
            <div className="nota-linha">
              <p className="col caso-texto">
                <RichText parts={overview.parts} {...copy} notes={overview.map} />
              </p>
              {overview.list.map((note) => (
                <MarginNote key={note.id} {...note} />
              ))}
            </div>
          </section>

          <section aria-labelledby="decisoes" className="caso-secao">
            <h2 id="decisoes" className="col secao-titulo">
              {c.ui.decisions}
            </h2>
            <dl className="decisoes">
              {project.details.decisions.map((d, i) => (
                <div key={d.problem} className="decisao">
                  <dt className="col">{d.problem}</dt>
                  {/* A nota mora dentro do <dd> (HTML válido); quem a posiciona na margem é a .decisao. */}
                  <dd className="col">
                    <RichText parts={choices[i].parts} {...copy} notes={choices[i].map} />
                    {choices[i].list.map((note) => (
                      <MarginNote key={note.id} {...note} />
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="hoje" className="caso-secao">
            <h2 id="hoje" className="col secao-titulo">
              {c.ui.results}
            </h2>
            <ul className="col caso-hoje">
              {project.details.results.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </section>

          <nav aria-label={c.ui.nextProject} className="caso-rio">
            <Link href={`${home}#${project.slug}`} className="caso-rio-volta">
              ← {c.ui.back}
            </Link>
            <Link href={projectHref(locale, next.slug)} className="caso-rio-abaixo" data-lantern>
              <span className="caso-rio-rotulo">{c.ui.nextProject} →</span>
              <span className="topo-nome">{next.toponym.name}</span>
            </Link>
          </nav>
        </article>
      </main>
    </>
  );
}
