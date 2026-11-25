import type { NextConfig } from "next";

// Slugs do site antigo (/projects/<slug>) que sumiram ou mudaram de nome.
// Links antigos podem estar no LinkedIn e em PDFs de currículo já enviados.
const removed = [
  "personal-portfolio",
  "official-gazette-search",
  "demands-service-desk",
  "document-flow-automation",
  "intranet-redesign",
  "school-attendance",
  "grade-submission",
];

// Sem `ignoreBuildErrors`: a versão anterior publicava com erro de tipo.
// Se o build quebrar por tipo, corrija o tipo — não desligue a checagem.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Duas raízes (pt/en) não têm um layout comum; a 404 de URL desconhecida
    // precisa de app/global-not-found.tsx.
    globalNotFound: true,
  },
  async redirects() {
    return [
      ...removed.map((slug) => ({ source: `/projects/${slug}`, destination: "/#projetos", permanent: true })),
      { source: "/projects/process-library", destination: "/projetos/biblioteca-de-processos", permanent: true },
      { source: "/projects/:slug", destination: "/projetos/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
