export type Locale = "pt" | "en";

/** `frame`: proporção do recorte (a partir do topo) quando a captura tem sobra embaixo. */
export type Shot = { src: string; alt: string; width: number; height: number; frame?: string };
export type ExternalLink = { label: string; href: string };

/**
 * Trecho de texto corrido. Strings simples são texto; objetos viram link ou
 * termo com nota. `href` aceita URL, caminho interno ou um destino especial:
 * "whatsapp", "email" (copia o endereço), "resume:pt" e "resume:en".
 * `term` é a nota de margem em português simples: resquício do professor,
 * que explica antes de usar jargão.
 */
export type Inline = string | { text: string; href?: string; term?: string };
export type Rich = Inline[];

/**
 * Nome do projeto como aparece na home e no título do case. `note` diz de
 * quem é ou que tipo de trabalho foi ("Observatório da Indústria do Acre",
 * "produto próprio", "freelance") e vai numa linha pequena acima do nome:
 * "Data Lake" e "Plataforma de Dados" sozinhos são substantivos comuns; é o
 * dono que os torna um projeto de verdade para quem lê.
 */
export type Toponym = { name: string; note?: string };

/** Projeto com página própria de case. */
export type Project = {
  slug: string;
  title: string;
  toponym: Toponym;
  rank: "capital" | "cidade";
  /** Uma linha para a home: o que é, em palavras comuns. Vai logo abaixo do nome. */
  line: string;
  /** Rótulo discreto (freelance, projeto pessoal); vazio no trabalho principal. */
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

export type Step = { year: string; title: string; text: string };

/**
 * Notas de professor das páginas de case. `term` é o trecho exato como
 * aparece no texto (contexto e decisões); a primeira ocorrência na página
 * ganha número e nota na margem. A ordem é a prioridade: com no máximo duas
 * notas por parágrafo, os primeiros da lista ganham.
 */
export type Glossary = { term: string; note: string }[];

/**
 * Regra do dono (2026-11-25): texto sem propósito é lixo. Todo campo abaixo
 * tem de ajudar o visitante a entender quem é o Edilberto, achar o trabalho
 * ou falar com ele. Coordenadas, escala da carta, estação do rio, símbolos
 * cartográficos e a lista de fontes do colofão saíram por não fazerem nada
 * disso. Antes de acrescentar campo, responda qual das três coisas ele faz.
 */
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
    /** Botão fixo do celular: abre navegação e contato. */
    menuOpen: string;
    menuClose: string;
    mainLabel: string;
  };
  /** Rodapé: diz que o site é trabalho meu, e com o quê. */
  chart: { colophon: string };
  /**
   * Abertura: o nome, o que eu faço e onde, e os dois caminhos que quem chega
   * procura (ver o trabalho, falar comigo). Substitui a barra de escala e o
   * "role para descer o rio", que não levavam a lugar nenhum.
   */
  hero: { name: string; line: string; cta: { work: string; contact: string }; /** Descrição do retrato da abertura. */ portraitAlt: string };
  /** Bio em primeira pessoa, sem rótulo de seção. */
  bio: Rich[];
  /** `open`: o link de cada projeto principal para o case. */
  work: { label: string; more: string; open: string };
  projects: Project[];
  archive: ArchiveItem[];
  /**
   * Entrada de diário. `signature` é o mês em que o texto foi escrito: mostrar
   * a data de hoje calculada no navegador fingiria um texto sempre recém-escrito.
   */
  now: { label: string; body: Rich[]; signature: string };
  past: { label: string; steps: Step[]; tools: string };
  /** `channels`: um canal por item, cada um dizendo o que é e para que serve. */
  contact: { label: string; invite: Rich; channels: Rich[]; copied: string };
  /** O jargão das páginas de case, explicado na margem (ver Glossary). */
  glossary: Glossary;
  /**
   * O jogo da canoa (components/game). Passa na regra do topo: o visitante
   * faz o que eu faço (recolhe dado bruto e chega com um gráfico) e a descida
   * termina no contato. `start` e `startNote` são o convite da abertura: o
   * que é e quanto tempo toma. `stages`: os três estágios do dado, em palavra
   * comum. `doneTitle` troca `{n}` e `{total}` pelos números da descida;
   * `empty*` é para quem chega sem nenhum dado.
   */
  game: {
    start: string;
    startNote: string;
    /** Nome da camada do jogo para leitor de tela. */
    label: string;
    hintMouse: string;
    hintTouch: string;
    rule: string;
    stages: [string, string, string];
    aboard: string;
    quit: string;
    doneTitle: string;
    doneBody: string;
    emptyTitle: string;
    emptyBody: string;
    again: string;
    close: string;
  };
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
    notFoundTitle: string;
    notFoundBody: string;
    notFoundCta: string;
  };
};
