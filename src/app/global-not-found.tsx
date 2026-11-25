import type { Metadata } from "next";
import Link from "next/link";
import { RootDocument } from "@/components/root-document";
import { SITE_URL } from "@/content";
import { pt } from "@/content/pt";
import { en } from "@/content/en";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL), title: "404 · Edilberto Lima Jr." };

// Sem rota não dá para saber o idioma; mostra os dois, português primeiro.
// Sem cena WebGL e sem desenho: quem cai aqui só precisa saber o que houve e
// ter o caminho de volta.
export default function GlobalNotFound() {
  return (
    <RootDocument locale="pt" scene={false}>
      <div aria-hidden className="moldura" />
      <main className="fim-do-mapa">
        <div className="col fim-texto">
          <p className="font-mono fim-cota">404</p>
          <h1 className="fim-titulo">{pt.ui.notFoundTitle}</h1>
          <p className="fim-corpo">{pt.ui.notFoundBody}</p>
          <p className="fim-corpo" lang="en">
            <span className="italic">{en.ui.notFoundTitle}</span> {en.ui.notFoundBody}
          </p>
          <p className="fim-links">
            <Link href="/">← {pt.ui.notFoundCta}</Link>
            <Link href="/en" lang="en">
              ← {en.ui.notFoundCta}
            </Link>
          </p>
        </div>
      </main>
    </RootDocument>
  );
}
