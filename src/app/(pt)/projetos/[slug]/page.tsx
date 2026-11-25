import { notFound } from "next/navigation";
import { CasePage } from "@/components/case-page";
import { caseMetadata, caseParams, findProject } from "@/lib/case-route";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => caseParams("pt");

export async function generateMetadata({ params }: Props) {
  return caseMetadata("pt", (await params).slug);
}

export default async function Page({ params }: Props) {
  const project = findProject("pt", (await params).slug);
  if (!project) notFound();
  return <CasePage project={project} locale="pt" />;
}
