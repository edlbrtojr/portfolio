"use client";

import { ProjectDetails } from "./project-details";

export function ProjectDetailsClient({ slug }: { slug: string }) {
  return <ProjectDetails slug={slug} />;
}
