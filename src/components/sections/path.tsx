import type { Content } from "@/content/types";

export function PathSection({ path }: { path: Content["path"] }) {
  return (
    <section data-stage="sources" aria-labelledby="path-title" className="flex min-h-[100svh] items-center py-28">
      <div className="wrap">
        <div className="max-w-xl">
          <p className="eyebrow">{path.eyebrow}</p>
          <h2 id="path-title" className="mt-4 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            {path.title}
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted">{path.body}</p>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
            {path.metrics.map((m) => (
              <div key={m.label} className="flex flex-col-reverse border-t border-line-strong pt-3">
                <dt className="mt-1 text-sm leading-snug text-muted">{m.label}</dt>
                <dd className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
