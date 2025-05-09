import { Metadata } from "next";
import { en } from "@/translations/en";
import { pt } from "@/translations/pt";
import { ProjectDetailsClient } from "./project-details-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;

  // Get both translations to find the project - we'll use the title for SEO
  const enProject = en.projects.projects.find((p) => p.slug === slug);
  const ptProject = pt.projects.projects.find((p) => p.slug === slug);

  // Use the found project or a fallback
  const title = enProject?.title || ptProject?.title || `Project - ${slug}`;

  return {
    title,
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return <ProjectDetailsClient slug={slug} />;
}
