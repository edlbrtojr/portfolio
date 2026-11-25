import type { Metadata } from "next";
import { content, SITE_URL } from "@/content";
import type { Locale } from "@/content/types";

export function homeMetadata(locale: Locale): Metadata {
  const c = content[locale];
  return {
    metadataBase: new URL(SITE_URL),
    title: c.meta.title,
    description: c.meta.description,
    icons: { icon: "/logo.ico" },
    alternates: { canonical: locale === "pt" ? "/" : "/en", languages: { "pt-BR": "/", en: "/en" } },
    openGraph: {
      type: "website",
      title: c.meta.title,
      description: c.meta.description,
      locale: locale === "pt" ? "pt_BR" : "en_US",
      url: locale === "pt" ? "/" : "/en",
      // Imagem vem do opengraph-image.tsx de cada idioma (convenção do Next).
    },
    twitter: { card: "summary_large_image", title: c.meta.title, description: c.meta.description },
  };
}
