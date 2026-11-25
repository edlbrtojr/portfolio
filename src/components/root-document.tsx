import { Analytics } from "@vercel/analytics/next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import type { Locale } from "@/content";
import "@/app/globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--nf-display", display: "swap" });
const body = Geist({ subsets: ["latin"], variable: "--nf-body", display: "swap" });
const code = Geist_Mono({ subsets: ["latin"], variable: "--nf-code", display: "swap" });

// Roda antes da primeira pintura: decide se a cena 3D vai existir, para o
// CSS esconder o nome em HTML só quando as partículas forem desenhá-lo.
// Sem isso o nome apareceria e sumiria logo depois (flash).
const webglProbe = `try{var c=document.createElement('canvas');var g=c.getContext('webgl2')||c.getContext('webgl');document.documentElement.dataset.webgl=g?'on':'off'}catch(e){document.documentElement.dataset.webgl='off'}`;

export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale === "pt" ? "pt-BR" : "en"} className={`${display.variable} ${body.variable} ${code.variable}`} suppressHydrationWarning>
      {/* A regra no-head-element é do Pages Router; no App Router o <head> no layout raiz é o caminho documentado. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: webglProbe }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
