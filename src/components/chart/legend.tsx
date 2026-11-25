import clsx from "clsx";
import type { Locale, Rich } from "@/content/types";
import { RichText } from "../home/rich-text";

type ListProps = { items: Rich[]; locale: Locale; copied: string; className?: string };

/**
 * Os canais de contato, um por linha, cada um dizendo para que serve. Os
 * símbolos cartográficos (●, ■, ▲) e o título "legenda" saíram: não diziam
 * nada que o texto do item já não dissesse, e "legenda" não avisava que ali
 * estava o contato.
 */
export function ContactList({ items, locale, copied, className }: ListProps) {
  return (
    <ul className={clsx("contato-lista", className)}>
      {items.map((parts, i) => (
        <li key={i}>
          <RichText parts={parts} locale={locale} copied={copied} linkClass="contato-link" />
        </li>
      ))}
    </ul>
  );
}

/** O cartucho no canto da foz: é aqui que o contato mora. */
export function ContactCard(props: ListProps) {
  return (
    <div className="cartucho">
      <ContactList {...props} />
    </div>
  );
}
