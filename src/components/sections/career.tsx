import type { Content } from "@/content/types";

export function CareerSection({ career }: { career: Content["career"] }) {
  return (
    <section id="trajetoria" aria-labelledby="career-title" className="scroll-mt-16">
      <div data-stage="helix" className="flex min-h-[100svh] items-center py-28">
        <div className="wrap">
          <div className="max-w-2xl">
            <p className="eyebrow">{career.eyebrow}</p>
            <h2 id="career-title" className="mt-4 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              {career.title}
            </h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted">{career.body}</p>
            <ol className="mt-10 space-y-0 border-l border-line-strong">
              {career.positions.map((p) => (
                <li key={`${p.title}-${p.period}`} className="relative pb-7 pl-6 last:pb-0">
                  <span aria-hidden className={`absolute -left-[5px] top-2 size-[9px] rounded-full border ${p.current ? "border-gold bg-gold" : "border-line-strong bg-bg"}`} />
                  <p className="font-mono text-xs text-faint">{p.period}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold leading-snug">
                    {p.title} <span className="font-normal text-muted">· {p.company}</span>
                  </h3>
                  <p className="mt-1 text-muted">{p.summary}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm text-faint">{career.earlier}</p>
          </div>
        </div>
      </div>

      <div data-stage="helix" className="flex min-h-[100svh] items-center py-28">
        <div className="wrap">
          <div className="grid max-w-2xl gap-10">
            <div>
              <h3 className="eyebrow">{career.educationTitle}</h3>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {career.education.map((e) => (
                  <li key={e.degree} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
                    <span className="font-display text-lg font-semibold">
                      {e.degree} <span className="font-normal text-muted">· {e.institution}</span>
                    </span>
                    <span className="font-mono text-xs text-faint">{e.period}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="eyebrow">{career.skillsTitle}</h3>
              <dl className="mt-4 grid gap-5 sm:grid-cols-2">
                {career.skills.map((g) => (
                  <div key={g.group}>
                    <dt className="font-display font-semibold text-ink">{g.group}</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-muted">{g.items.join(" · ")}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h3 className="eyebrow">{career.certificationsTitle}</h3>
              <p className="mt-3 text-pretty leading-relaxed text-muted">{career.certifications}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
