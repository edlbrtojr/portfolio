import { Metadata } from "next";
import { en } from "@/translations/en";
import { pt } from "@/translations/pt";
import { ProjectDetailsClient } from "./project-details-client";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // Get both translations to find the project - we'll use the title for SEO
  const enProject = en.projects.projects.find((p) => p.slug === slug);
  const ptProject = pt.projects.projects.find((p) => p.slug === slug);

  // Use the found project or a fallback
  const title = enProject?.title || ptProject?.title || `Project - ${slug}`;

  return {
    title,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  return <ProjectDetailsClient slug={slug} />;
}
