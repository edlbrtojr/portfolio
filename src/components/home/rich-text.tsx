import Link from "next/link";
import { Fragment } from "react";
import { resumeHref, whatsappHref } from "@/content";
import type { Locale, Rich } from "@/content/types";
import { NoteTerm } from "../chart/margin-note";
import { CopyEmail } from "./copy-email";
import { inlineLink } from "./link-style";

/** Número e id da nota de um termo; a numeração recomeça a cada seção. */
export type NoteRef = { id: string; n: number; text: string };

type Props = {
  parts: Rich;
  locale: Locale;
  copied: string;
  /** Índice do trecho → nota. Sem ele o termo sai como texto simples. */
  notes?: Record<number, NoteRef>;
  linkClass?: string;
};

export function RichText({ parts, locale, copied, notes, linkClass = inlineLink }: Props) {
  return (
    <>
      {parts.map((p, i) => {
        if (typeof p === "string") return <Fragment key={i}>{p}</Fragment>;
        if (p.term) {
          const note = notes?.[i];
          return note ? <NoteTerm key={i} id={note.id} n={note.n} text={p.text} /> : <Fragment key={i}>{p.text}</Fragment>;
        }
        const href = p.href ?? "";
        if (href === "email") return <CopyEmail key={i} email={p.text} copied={copied} className={linkClass} />;
        if (href.startsWith("/"))
          return (
            <Link key={i} href={href} className={linkClass}>
              {p.text}
            </Link>
          );
        const resolved = href === "whatsapp" ? whatsappHref(locale) : href.startsWith("resume:") ? resumeHref(href.slice(7) as Locale) : href;
        const external = resolved.startsWith("http");
        return (
          <a key={i} href={resolved} className={linkClass} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {p.text}
          </a>
        );
      })}
    </>
  );
}

/**
 * Numera os termos de uma seção (1, 2, 3…) e devolve, por parágrafo, o mapa
 * trecho → nota e a lista de notas na ordem em que aparecem.
 */
export function numberNotes(paragraphs: Rich[], prefix: string) {
  let n = 0;
  return paragraphs.map((parts) => {
    const map: Record<number, NoteRef> = {};
    const list: NoteRef[] = [];
    parts.forEach((p, i) => {
      if (typeof p === "object" && p.term) {
        n += 1;
        const ref = { id: `${prefix}-${n}`, n, text: p.term };
        map[i] = ref;
        list.push(ref);
      }
    });
    return { map, list };
  });
}
