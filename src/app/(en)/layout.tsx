import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootDocument } from "@/components/root-document";
import { SITE_URL } from "@/content";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };

export default function EnLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
