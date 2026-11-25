import Image from "next/image";
import Link from "next/link";
import type { Content, Locale } from "@/content/types";
import { projectHref } from "@/content";
import { Diagram } from "../diagrams";
import { Arrow } from "../ui";

type Props = { more: Content["more"]; archive: Content["archive"]; locale: Locale; ui: Content["ui"] };

export function MoreSection({ more, archive, locale, ui }: Props) {
  return (
    <>
      <section data-stage="tree" aria-labelledby="more-title" className="flex min-h-[100svh] items-center py-28">
        <div className="wrap">
          <div className="max-w-2xl">
            <p className="eyebrow">{more.eyebrow}</p>
            <h2 id="more-title" className="mt-4 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              {more.title}
            </h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted">{more.body}</p>
          </div>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {more.projects.map((p) => (
              <li key={p.slug}>
                <Link
                  href={projectHref(locale, p.slug)}
                  className="panel group flex h-full flex-col overflow-hidden transition-[transform,border-color] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-line-strong"
                >
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-surface-2">
                    {p.shots[0] ? (
                      <Image
                        src={p.shots[0].src}
                        alt={p.shots[0].alt}
                        width={p.shots[0].width}
                        height={p.shots[0].height}
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="h-full w-full object-cover object-left-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                      />
                    ) : p.diagram ? (
                      <div className="absolute inset-0 grid place-items-center p-4">
                        <Diagram kind={p.diagram} title={p.title} locale={locale} />
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="eyebrow">{p.kicker}</p>
                    <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">{p.title}</h3>
                    <p className="mt-3 flex-1 text-pretty leading-relaxed text-muted">{p.summary}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold">
                      {ui.viewCase} <Arrow />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section data-stage="tree" data-dim aria-labelledby="archive-title" className="flex min-h-[100svh] items-center py-28">
        <div className="wrap">
          <h2 id="archive-title" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {archive.title}
          </h2>
          <ul className="mt-8 border-t border-line">
            {archive.items.map((item) => {
              const row = (
                <>
                  <span className="font-mono text-sm text-faint md:col-span-2">{item.year}</span>
                  <span className="font-display text-lg font-semibold md:col-span-3">
                    {item.title}
                    {item.href && <span aria-hidden className="ml-1.5 text-gold">↗</span>}
                  </span>
                  <span className="text-pretty text-muted md:col-span-5">{item.description}</span>
                  <span className="font-mono text-xs text-faint md:col-span-2 md:text-right">{item.stack.join(" · ")}</span>
                </>
              );
              const cls = "grid gap-1.5 border-b border-line py-5 md:grid-cols-12 md:items-baseline md:gap-6";
              return (
                <li key={item.title}>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={`${cls} transition-colors hover:bg-surface/60`}>
                      {row}
                    </a>
                  ) : (
                    <div className={cls}>{row}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
