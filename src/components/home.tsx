import type { CSSProperties } from "react";
import { content, homeHref, projectHref, resumeHref } from "@/content";
import type { Locale } from "@/content/types";
import { LocalTime } from "./home/local-time";
import { RichText } from "./home/rich-text";
import { Timeline } from "./home/timeline";
import { WorkList } from "./home/work-list";
import { SceneRoot, StageObserver } from "./scene/scene-root";
import { SiteHeader } from "./site-header";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

// Rótulo de bloco: uma palavra em minúsculas, sem número. O molde
// "01 · RÓTULO" repetido em toda seção era o que dava cara de template.
const label = "text-sm font-medium text-faint";

/**
 * A home é uma página escrita: a abertura com o rio e o nome em vaga-lumes,
 * e depois uma coluna estreita que se lê de cima a baixo. Cada bloco tem um
 * `data-stage`, e os vaga-lumes mudam de desenho conforme a leitura avança.
 */
export function Home({ locale }: { locale: Locale }) {
  const c = content[locale];
  // Blocos separados por padding, não margem: com margem a linha do meio da
  // tela caía no vão entre blocos, nenhuma etapa era detectada e o nome em
  // vaga-lumes ficava por baixo do texto da bio.
  const rows = c.projects.map((p) => ({ slug: p.slug, href: projectHref(locale, p.slug), year: p.year, title: p.title, line: p.line, tag: p.tag, stage: p.stage }));
  return (
    <>
      {/* Nome sem acento/sobrenome nas partículas: 9 letras largas amostram melhor. */}
      <SceneRoot name="EDILBERTO" />
      <StageObserver />
      <SiteHeader nav={c.nav} home={homeHref(locale)} resume={resumeHref(locale)} />
      <main id="conteudo" className="relative z-10">
        {/* Abertura: no desktop a linha fica abaixo do nome (centro da tela);
            no retrato o nome sobe para ~20% e a linha vem logo depois. */}
        <section
          data-stage="name"
          aria-labelledby="hero-title"
          className="relative flex min-h-[100svh] flex-col items-center justify-start pt-[29svh] text-center sm:justify-end sm:pb-[30svh] sm:pt-0"
        >
          <h1 id="hero-title" className="wrap">
            <span className="hero-name mb-3 block font-display text-6xl font-extrabold tracking-tight sm:text-8xl">{c.hero.name}</span>
            <span className="enter mx-auto block max-w-xl text-balance text-lg leading-snug text-muted sm:text-xl" style={i(1)}>
              {c.hero.line}
            </span>
          </h1>
          <p aria-hidden className="enter absolute inset-x-0 bottom-6 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-faint" style={i(4)}>
            {c.hero.scrollHint} ↓
          </p>
        </section>

        <div className="wrap">
          <div className="max-w-[36rem]">
            <section data-stage="sources" aria-label={c.hero.name} className="space-y-6 text-pretty text-xl leading-relaxed text-ink/90">
              {c.bio.map((p, n) => (
                <p key={n}>
                  <RichText parts={p} locale={locale} copied={c.contact.copied} />
                </p>
              ))}
            </section>

            <section id="trabalho" aria-labelledby="work-label" className="pt-32 scroll-mt-0">
              <h2 id="work-label" className={label}>
                {c.work.label}
              </h2>
              <WorkList rows={rows} />
              <details data-stage="tree" className="group mt-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm text-muted transition-colors hover:text-ink [&::-webkit-details-marker]:hidden">
                  {c.work.more}
                  <span aria-hidden className="transition-transform group-open:rotate-180">
                    ↓
                  </span>
                </summary>
                <ul className="mt-2">
                  {c.archive.map((a) => {
                    const row = (
                      <>
                        <span className="font-mono text-xs text-faint">{a.year}</span>
                        <span>
                          <span className="text-ink">{a.title}</span>
                          {a.href && <span aria-hidden className="ml-1 text-gold">↗</span>}
                          <span className="text-muted"> · {a.description}</span>
                        </span>
                      </>
                    );
                    const cls = "grid grid-cols-[4.5rem_1fr] gap-x-4 py-2 text-[0.95rem] leading-relaxed sm:grid-cols-[5.5rem_1fr]";
                    return (
                      <li key={a.title}>
                        {a.href ? (
                          <a href={a.href} target="_blank" rel="noopener noreferrer" className={`${cls} hover:text-gold`}>
                            {row}
                          </a>
                        ) : (
                          <div className={cls}>{row}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </details>
            </section>

            <section id="agora" data-stage="chaos" aria-labelledby="now-label" className="pt-32 scroll-mt-0">
              <h2 id="now-label" className={label}>
                {c.now.label}
              </h2>
              <div className="mt-5 space-y-5 text-pretty text-lg leading-relaxed text-ink/90">
                {c.now.body.map((p, n) => (
                  <p key={n}>
                    <RichText parts={p} locale={locale} copied={c.contact.copied} />
                  </p>
                ))}
              </div>
              <p className="mt-6 font-mono text-xs text-faint">— {c.now.signature}</p>
            </section>

            <section id="trajetoria" data-stage="helix" aria-labelledby="past-label" className="pt-32 scroll-mt-0">
              <h2 id="past-label" className={label}>
                {c.past.label}
              </h2>
              <Timeline steps={c.past.steps} hint={c.past.hint} />
              <p className="mt-4 text-sm leading-relaxed text-faint">{c.past.tools}</p>
            </section>

            {/* min-h: o último bloco precisa chegar ao meio da tela para a
                lua (esfera) aparecer, mesmo com a página no fim do scroll. */}
            <section id="contato" data-stage="sphere" aria-labelledby="contact-label" className="min-h-[55svh] pt-32 scroll-mt-0">
              <h2 id="contact-label" className={label}>
                {c.contact.label}
              </h2>
              <div className="mt-5 space-y-5 text-pretty text-lg leading-relaxed text-ink/90">
                {c.contact.body.map((p, n) => (
                  <p key={n}>
                    <RichText parts={p} locale={locale} copied={c.contact.copied} />
                  </p>
                ))}
              </div>
            </section>
          </div>
        </div>

        <footer className="wrap flex flex-col gap-2 border-t border-line py-6 text-sm text-faint sm:flex-row sm:justify-between">
          <LocalTime locale={locale} label={c.ui.localTime} />
          <span>{c.ui.footer}</span>
        </footer>
      </main>
    </>
  );
}
