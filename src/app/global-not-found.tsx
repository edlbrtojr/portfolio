import type { Metadata } from "next";
import Link from "next/link";
import { RootDocument } from "@/components/root-document";
import { SITE_URL } from "@/content";
import { pt } from "@/content/pt";
import { en } from "@/content/en";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL), title: "404 · Edilberto Lima Jr." };

// Sem rota não dá para saber o idioma; mostra os dois, português primeiro.
export default function GlobalNotFound() {
  return (
    <RootDocument locale="pt">
      <main className="grid min-h-[100svh] place-items-center px-6">
        <div className="max-w-xl">
          <p className="eyebrow">404</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">{pt.ui.notFoundTitle}</h1>
          <p className="mt-4 text-lg text-muted">{pt.ui.notFoundBody}</p>
          <p className="mt-2 text-muted" lang="en">
            {en.ui.notFoundBody}
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/" className="inline-flex min-h-12 items-center rounded-full bg-gold px-6 font-medium text-bg">
              {pt.ui.notFoundCta}
            </Link>
            <Link href="/en" lang="en" className="inline-flex min-h-12 items-center rounded-full border border-line-strong px-6">
              {en.ui.notFoundCta}
            </Link>
          </div>
        </div>
      </main>
    </RootDocument>
  );
}
