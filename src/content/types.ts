import type { ShapeKey } from "@/components/scene/shapes";

export type Locale = "pt" | "en";

/** `frame`: proporção do recorte (a partir do topo) quando a captura tem sobra embaixo. */
export type Shot = { src: string; alt: string; width: number; height: number; frame?: string };
export type ExternalLink = { label: string; href: string };

/**
 * Trecho de texto corrido. Strings simples são texto; objetos viram link ou
 * termo explicado. `href` aceita URL, caminho interno ou um destino especial:
 * "whatsapp", "email" (copia o endereço), "resume:pt" e "resume:en".
 * `term` é a explicação em português simples que aparece ao passar o mouse:
 * resquício do professor de inglês, que explica antes de usar jargão.
 */
export type Inline = string | { text: string; href?: string; term?: string };
export type Rich = Inline[];

/** Projeto com página própria de case. */
export type Project = {
  slug: string;
  title: string;
  /** Uma linha para a lista da home: o que é, em palavras comuns. */
  line: string;
  /** Rótulo discreto na lista (freelance, projeto pessoal); vazio no trabalho principal. */
  tag?: string;
  /** Linha curta acima do título na página do case. */
  kicker: string;
  year: string;
  role: string;
  /**
   * Uma ou duas frases: o que é e qual foi o meu papel. Sem faixa de números:
   * em 20 portfólios de referência nenhum usava KPI embaixo de projeto, e os
   * números internos ("0 cópias", "3 provedores") não diziam nada a quem lê.
   */
  summary: string;
  stack: string[];
  links: ExternalLink[];
  shots: Shot[];
  /** Quando não há tela que possa ser mostrada, um diagrama desenhado no código. */
  diagram?: "order-flow" | "decision-tree";
  stage: ShapeKey;
  details: {
    overview: string;
    /**
     * Problema e decisão em par. Listas separadas de "desafios" e "soluções"
     * deixavam o leitor adivinhar qual resolvia qual, e liam como modelo pronto.
     */
    decisions: Decision[];
    results: string[];
  };
};

export type Decision = { problem: string; choice: string };

export type ArchiveItem = { title: string; year: string; description: string; href?: string };

/** Etapa da trajetória, explorada passando o mouse (ou tocando) no ano. */
export type Step = { year: string; title: string; text: string };

export type Content = {
  locale: Locale;
  meta: { title: string; description: string };
  nav: {
    work: string;
    now: string;
    contact: string;
    resume: string;
    switchLang: string;
    switchLangHref: string;
    skip: string;
    menuOpen: string;
    menuClose: string;
    mainLabel: string;
  };
  /** Abertura: o nome é desenhado pelos vaga-lumes; `line` diz o que eu faço e onde. */
  hero: { name: string; line: string; scrollHint: string };
  /** Bio em primeira pessoa, sem rótulo de seção. */
  bio: Rich[];
  work: { label: string; more: string };
  projects: Project[];
  archive: ArchiveItem[];
  /** Parágrafo no estilo /now, assinado com lugar e data. */
  now: { label: string; body: Rich[]; signature: string };
  past: { label: string; hint: string; steps: Step[]; tools: string };
  contact: { label: string; body: Rich[]; copied: string };
  ui: {
    visitSite: string;
    stack: string;
    role: string;
    back: string;
    overview: string;
    decisions: string;
    problem: string;
    choice: string;
    results: string;
    nextProject: string;
    footer: string;
    localTime: string;
    notFoundTitle: string;
    notFoundBody: string;
    notFoundCta: string;
  };
};
