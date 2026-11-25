import Link from "next/link";
import { Fragment } from "react";
import { resumeHref, whatsappHref } from "@/content";
import type { Locale, Rich } from "@/content/types";
import { CopyEmail } from "./copy-email";
import { inlineLink } from "./link-style";

/**
 * Termo técnico com legenda ao passar o mouse ou focar (toque, no celular).
 * A legenda fica no DOM, então leitor de tela e buscador leem as duas coisas.
 */
function Term({ text, term }: { text: string; term: string }) {
  return (
    <span tabIndex={0} className="group relative cursor-help outline-none">
      <span className="underline decoration-gold/70 decoration-dotted decoration-2 underline-offset-[6px] group-focus-visible:text-gold">{text}</span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-0 z-30 mb-3 w-[min(17rem,78vw)] translate-y-1 rounded-xl border border-line-strong bg-surface/95 p-3.5 text-[0.9rem] leading-snug text-muted opacity-0 shadow-2xl backdrop-blur transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100"
      >
        {term}
      </span>
    </span>
  );
}

type Props = { parts: Rich; locale: Locale; copied: string };

export function RichText({ parts, locale, copied }: Props) {
  return (
    <>
      {parts.map((p, i) => {
        if (typeof p === "string") return <Fragment key={i}>{p}</Fragment>;
        if (p.term) return <Term key={i} text={p.text} term={p.term} />;
        const href = p.href ?? "";
        if (href === "email") return <CopyEmail key={i} email={p.text} copied={copied} />;
        if (href.startsWith("/"))
          return (
            <Link key={i} href={href} className={inlineLink}>
              {p.text}
            </Link>
          );
        const resolved = href === "whatsapp" ? whatsappHref(locale) : href.startsWith("resume:") ? resumeHref(href.slice(7) as Locale) : href;
        const external = resolved.startsWith("http");
        return (
          <a key={i} href={resolved} className={inlineLink} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {p.text}
          </a>
        );
      })}
    </>
  );
}
