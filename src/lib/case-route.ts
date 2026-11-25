import type { Metadata } from "next";
import { allProjects, projectHref, SITE_URL } from "@/content";
import type { Locale } from "@/content/types";

export function caseParams(locale: Locale) {
  return allProjects(locale).map((p) => ({ slug: p.slug }));
}

export function findProject(locale: Locale, slug: string) {
  return allProjects(locale).find((p) => p.slug === slug);
}

export function caseMetadata(locale: Locale, slug: string): Metadata {
  const p = findProject(locale, slug);
  if (!p) return {};
  const title = `${p.title} · Edilberto Lima Jr.`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: p.summary,
    icons: { icon: "/logo.ico" },
    alternates: {
      canonical: projectHref(locale, slug),
      languages: { "pt-BR": projectHref("pt", slug), en: projectHref("en", slug) },
    },
    // Sem captura, herda a imagem do opengraph-image.tsx do idioma.
    openGraph: { title, description: p.summary, ...(p.shots[0] && { images: [{ url: p.shots[0].src }] }) },
  };
}
