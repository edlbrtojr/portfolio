import Image from "next/image";
import clsx from "clsx";
import type { Shot } from "@/content/types";

type Props = {
  shot: Shot;
  url?: string;
  /** Proporção do quadro; capturas mais altas são recortadas a partir do topo. */
  aspect?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export function BrowserFrame({ shot, url, aspect = "16 / 10", priority, sizes = "(min-width: 1024px) 66vw, 100vw", className }: Props) {
  return (
    <figure className={clsx("group overflow-hidden rounded-xl border border-line-strong bg-surface shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)]", className)}>
      <div className="flex items-center gap-2 border-b border-line px-3 py-2.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="size-2.5 rounded-full bg-line-strong" />
        {url && <span className="ml-3 truncate rounded-md bg-surface-2 px-3 py-0.5 font-mono text-[0.7rem] text-faint">{url}</span>}
      </div>
      <div className="relative overflow-hidden" style={{ aspectRatio: aspect }}>
        <Image
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          sizes={sizes}
          priority={priority}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.025]"
        />
      </div>
    </figure>
  );
}
