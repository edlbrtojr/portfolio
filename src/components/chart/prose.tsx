import clsx from "clsx";
import type { Locale, Rich } from "@/content/types";
import { numberNotes, RichText } from "../home/rich-text";
import { MarginNote } from "./margin-note";

type Props = { paragraphs: Rich[]; locale: Locale; copied: string; idPrefix: string; pClass?: string; className?: string };

/**
 * Parágrafos da coluna esquerda com as notas logo depois de cada um. Cada
 * parágrafo é uma linha de largura total (posicionada), para a nota poder
 * morar na coluna da margem do outro lado do rio.
 */
export function Prose({ paragraphs, locale, copied, idPrefix, pClass, className }: Props) {
  const numbered = numberNotes(paragraphs, idPrefix);
  return (
    <div className={className}>
      {paragraphs.map((parts, i) => (
        <div key={i} className="nota-linha">
          <p className={clsx("col", pClass)}>
            <RichText parts={parts} locale={locale} copied={copied} notes={numbered[i].map} />
          </p>
          {numbered[i].list.map((note) => (
            <MarginNote key={note.id} {...note} />
          ))}
        </div>
      ))}
    </div>
  );
}
