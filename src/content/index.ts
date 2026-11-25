import { en } from "./en";
import { pt } from "./pt";
import type { Content, Locale, Project } from "./types";

export const content: Record<Locale, Content> = { pt, en };

export const SITE_URL = "https://www.edilberto.dev.br";
export const WHATSAPP_URL = "https://wa.me/5568992833888";
export const LINKEDIN_URL = "https://www.linkedin.com/in/edilbertolimajr/";
export const GITHUB_URL = "https://github.com/edlbrtojr";

/** Todos os projetos com página de case, na ordem em que aparecem na home. */
export function allProjects(locale: Locale): Project[] {
  return content[locale].projects;
}

export function homeHref(locale: Locale) {
  return locale === "pt" ? "/" : "/en";
}

export function projectHref(locale: Locale, slug: string) {
  return locale === "pt" ? `/projetos/${slug}` : `/en/projects/${slug}`;
}

/** WhatsApp com a primeira mensagem já escrita: quem chega não trava no "oi". */
export function whatsappHref(locale: Locale) {
  const text = locale === "pt" ? "Olá, Edilberto! Vi seu portfólio e quero conversar sobre " : "Hi Edilberto! I saw your portfolio and I'd like to talk about ";
  return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
}

export function resumeHref(locale: Locale) {
  return `/api/resume/${locale}`;
}

export type { Content, Locale, Project };
