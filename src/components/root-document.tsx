import { Analytics } from "@vercel/analytics/next";
import { Geist_Mono, Instrument_Serif, Newsreader } from "next/font/google";
import type { ReactNode } from "react";
import type { Locale } from "@/content";
import "@/app/globals.css";

// Três famílias, como numa carta impressa: Instrument Serif para o que é
// nome (o rio, os topônimos), Newsreader para o texto corrido (variável, com
// eixo óptico: 18 px e 28 px pedem desenhos diferentes) e Geist Mono para
// coordenadas, anos e hora. A Instrument Serif só tem peso 400: hierarquia
// vem de tamanho, caixa e espaçamento, nunca de negrito.
const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--nf-display", display: "swap" });
const body = Newsreader({ subsets: ["latin"], axes: ["opsz"], style: ["normal", "italic"], variable: "--nf-body", display: "swap" });
const code = Geist_Mono({ subsets: ["latin"], variable: "--nf-code", display: "swap" });

// Roda antes da primeira pintura: decide se a cena WebGL vai existir. Sem ela
// o CSS mostra a água desenhada em SVG (.rio-agua) sobre um fundo hachurado.
// `?webgl=off` força o fallback, para testar sem desligar a GPU.
const webglProbe = `try{if(/[?&]webgl=off\\b/.test(location.search))throw 0;var c=document.createElement('canvas');var g=c.getContext('webgl2')||c.getContext('webgl');document.documentElement.dataset.webgl=g?'on':'off'}catch(e){document.documentElement.dataset.webgl='off'}`;

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
