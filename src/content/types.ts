import type { ShapeKey } from "@/components/scene/shapes";

export type Locale = "pt" | "en";

/** `frame`: proporção do recorte (a partir do topo) quando a captura tem sobra embaixo. */
export type Shot = { src: string; alt: string; width: number; height: number; frame?: string };
export type Metric = { value: string; label: string };
export type ExternalLink = { label: string; href: string };

/** Projeto com página própria de case (destaques e "mais projetos"). */
export type Project = {
  slug: string;
  title: string;
  /** Linha curta acima do título: tipo de projeto e estado. */
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

export type ArchiveItem = { title: string; year: string; description: string; stack: string[]; href?: string };

export type Position = { title: string; company: string; period: string; summary: string; current?: boolean };

export type Content = {
  locale: Locale;
  meta: { title: string; description: string };
  nav: {
    work: string;
    career: string;
    services: string;
    contact: string;
    resume: string;
    switchLang: string;
    switchLangHref: string;
    skip: string;
    menuOpen: string;
    menuClose: string;
    mainLabel: string;
  };
  hero: {
    eyebrow: string;
    name: string;
    role: string;
    lead: string;
    ctaPrimary: string;
    ctaWhatsapp: string;
    scrollHint: string;
  };
  /** `steps`: etapas do que eu faço (verbo + uma linha), não contagens. */
  path: { eyebrow: string; title: string; body: string; steps: Metric[] };
  featured: Project[];
  more: { eyebrow: string; title: string; body: string; projects: Project[] };
  archive: { title: string; items: ArchiveItem[] };
  career: {
    eyebrow: string;
    title: string;
    body: string;
    positions: Position[];
    earlier: string;
    education: { degree: string; institution: string; period: string }[];
    educationTitle: string;
    certificationsTitle: string;
    certifications: string;
    skillsTitle: string;
    skills: { group: string; items: string[] }[];
  };
  services: { eyebrow: string; title: string; body: string; items: { title: string; description: string }[]; cta: string };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    whatsapp: string;
    email: string;
    resume: string;
    resumeAlt: string;
    note: string;
  };
  ui: {
    viewCase: string;
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
    notFoundTitle: string;
    notFoundBody: string;
    notFoundCta: string;
  };
};
