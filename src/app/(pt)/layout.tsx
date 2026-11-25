import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootDocument } from "@/components/root-document";
import { SITE_URL } from "@/content";

// Base para as URLs absolutas da imagem de prévia em toda rota do grupo.
export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };

// Duas raízes (pt e en) para cada idioma ter seu próprio <html lang>. A versão
// anterior trocava o idioma por cookie, o que deixava o inglês sem URL própria.
export default function PtLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="pt">{children}</RootDocument>;
}
