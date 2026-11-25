import { Analytics } from "@vercel/analytics/next";
import { Bricolage_Grotesque, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";
import type { Locale } from "@/content";
import "@/app/globals.css";
import { SceneRoot } from "./scene/scene-root";

// Tipografia sem serifa (2026-11-25, pedido do Edilberto: a versão com
// Instrument Serif + Newsreader em tudo "tinha pegada editorial até demais";
// o site é de um desenvolvedor, não uma revista):
// - Bricolage Grotesque para nomes e títulos (variável em peso e largura,
//   com desenho próprio em corpo grande);
// - Geist para o texto corrido e Geist Mono para anos, hora, papel e stack;
// - a Instrument Serif itálica ficou só no nome escrito no rio, que é
//   assinatura e precisa de letra que acompanhe curva. Se ela sair de lá,
//   refaça as métricas de fallback em river-type.tsx e no teste da curva.
const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"], variable: "--nf-display", display: "swap" });
const body = Geist({ subsets: ["latin"], variable: "--nf-body", display: "swap" });
const code = Geist_Mono({ subsets: ["latin"], variable: "--nf-code", display: "swap" });
const river = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["italic"], variable: "--nf-river", display: "swap" });

// Roda antes da primeira pintura: decide se a cena WebGL vai existir. Sem ela
// o CSS mostra a água desenhada em SVG (.rio-agua) sobre um fundo hachurado.
// `?webgl=off` força o fallback, para testar sem desligar a GPU.
const webglProbe = `try{if(/[?&]webgl=off\\b/.test(location.search))throw 0;var c=document.createElement('canvas');var g=c.getContext('webgl2')||c.getContext('webgl');document.documentElement.dataset.webgl=g?'on':'off'}catch(e){document.documentElement.dataset.webgl='off'}`;

/**
 * `scene`: a cena WebGL mora aqui, uma por documento, e atravessa as trocas
 * de rota sem desmontar (é o que permite a câmera viajar pelo braço do rio
 * entre a home e um projeto). A 404 global passa `false`: quem cai lá só
 * precisa do caminho de volta.
 */
export function RootDocument({ locale, children, scene = true }: { locale: Locale; children: ReactNode; scene?: boolean }) {
  return (
    <html lang={locale === "pt" ? "pt-BR" : "en"} className={`${display.variable} ${body.variable} ${code.variable} ${river.variable}`} suppressHydrationWarning>
      {/* A regra no-head-element é do Pages Router; no App Router o <head> no layout raiz é o caminho documentado. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: webglProbe }} />
      </head>
      <body>
        {scene && <SceneRoot />}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
