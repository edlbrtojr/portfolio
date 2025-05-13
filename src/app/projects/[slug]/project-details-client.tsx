"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";

export function ProjectDetailsClient({ slug }: { slug: string }) {
  const { t, language } = useLanguage();

  // Find the project by slug
  const project = t.projects?.projects?.find((p) => p.slug === slug);

  // If project not found, show error
  if (!project) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-4">
          {language === "en" ? "Project not found" : "Projeto não encontrado"}
        </h1>
        <Link href="/" passHref>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === "en" ? "Go Back" : "Voltar"}
          </Button>
        </Link>
      </div>
    );
  }

  // Get project details with fallback values
  const projectDetails = project.details || {
    overview: project.description,
    challenges: [],
    solutions: [],
    results: [],
  };

  // Get related projects
  const relatedProjects = t.projects?.projects
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/#projects" scroll={false} passHref>
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.projectDetails.backToProjects}
          </Button>
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-white/10 dark:bg-slate-800/80 backdrop-filter backdrop-blur-lg border border-white/30 dark:border-white/30 shadow-xl rounded-3xl overflow-hidden group">
              {/* Subtle shine effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent -top-[100%] opacity-0 group-hover:opacity-100 group-hover:animate-[shine_3s_ease-in-out]"></div>

              <CardHeader className="p-8 relative z-10 group-hover:bg-white/10 dark:group-hover:bg-slate-700/50 transition-colors duration-500">
                <CardTitle className="text-3xl md:text-4xl text-white">
                  {project.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-white/70">
                  <Calendar className="h-4 w-4" />
                  <span>{project.year}</span>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8 relative z-10 group-hover:bg-white/10 dark:group-hover:bg-slate-700/50 transition-colors duration-500">
                <p className="text-lg text-white/90">{project.description}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 dark:bg-slate-800/80 backdrop-filter backdrop-blur-lg border border-white/30 dark:border-white/30 shadow-xl rounded-3xl overflow-hidden group">
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent -top-[100%] opacity-0 group-hover:opacity-100 group-hover:animate-[shine_3s_ease-in-out]"></div>

              <CardHeader className="p-8 relative z-10 group-hover:bg-white/10 dark:group-hover:bg-slate-700/50 transition-colors duration-500">
                <CardTitle className="text-white">
                  {t.projectDetails.overview}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8 relative z-10 group-hover:bg-white/10 dark:group-hover:bg-slate-700/50 transition-colors duration-500">
                <p className="text-white/90">
                  {projectDetails.overview || project.description}
                </p>
              </CardContent>
            </Card>

            {/* Challenges and Solutions */}
            {(projectDetails.challenges?.length > 0 ||
              projectDetails.solutions?.length > 0) && (
              <div className="grid md:grid-cols-2 gap-6">
                {projectDetails.challenges?.length > 0 && (
                  <Card className="bg-white/10 dark:bg-slate-800/80 backdrop-filter backdrop-blur-lg border border-white/30 dark:border-white/30 shadow-xl rounded-3xl overflow-hidden group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent -top-[100%] opacity-0 group-hover:opacity-100 group-hover:animate-[shine_3s_ease-in-out]"></div>

                    <CardHeader className="p-6 relative z-10 group-hover:bg-white/10 dark:group-hover:bg-slate-700/50 transition-colors duration-500">
                      <CardTitle className="text-white">
                        {t.projectDetails.challenges}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 relative z-10 group-hover:bg-white/10 dark:group-hover:bg-slate-700/50 transition-colors duration-500">
                      <ul className="list-disc list-inside space-y-2 text-white/90">
                        {projectDetails.challenges.map((challenge, index) => (
                          <li key={index}>{challenge}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {projectDetails.solutions?.length > 0 && (
                  <Card className="bg-white/10 dark:bg-slate-800/80 backdrop-filter backdrop-blur-lg border border-white/30 dark:border-white/30 shadow-xl rounded-3xl overflow-hidden group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent -top-[100%] opacity-0 group-hover:opacity-100 group-hover:animate-[shine_3s_ease-in-out]"></div>

                    <CardHeader className="p-6 relative z-10 group-hover:bg-white/10 dark:group-hover:bg-slate-700/50 transition-colors duration-500">
                      <CardTitle className="text-white">
                        {t.projectDetails.solutions}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 relative z-10 group-hover:bg-white/10 dark:group-hover:bg-slate-700/50 transition-colors duration-500">
                      <ul className="list-disc list-inside space-y-2 text-white/90">
                        {projectDetails.solutions.map((solution, index) => (
                          <li key={index}>{solution}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Results */}
            {projectDetails.results?.length > 0 && (
              <Card className="bg-white/10 dark:bg-slate-800/80 backdrop-filter backdrop-blur-lg border border-white/30 dark:border-white/30 shadow-xl rounded-3xl overflow-hidden group">
                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent -top-[100%] opacity-0 group-hover:opacity-100 group-hover:animate-[shine_3s_ease-in-out]"></div>

                <CardHeader className="p-8 relative z-10 group-hover:bg-white/10 dark:group-hover:bg-slate-700/50 transition-colors duration-500">
                  <CardTitle className="text-white">
                    {t.projectDetails.results}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8 relative z-10 group-hover:bg-white/10 dark:group-hover:bg-slate-700/50 transition-colors duration-500">
                  <ul className="list-disc list-inside space-y-2 text-white/90">
                    {projectDetails.results.map((result, index) => (
                      <li key={index}>{result}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/10 dark:bg-slate-800/80 backdrop-filter backdrop-blur-lg border border-white/30 dark:border-white/30 shadow-xl rounded-3xl overflow-hidden group">
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent -top-[100%] opacity-0 group-hover:opacity-100 group-hover:animate-[shine_3s_ease-in-out]"></div>

              <CardHeader className="p-6 relative z-10 group-hover:bg-white/10 dark:group-hover:bg-slate-700/50 transition-colors duration-500">
                <CardTitle className="text-white">
                  {t.projectDetails.technologies}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 relative z-10 group-hover:bg-white/10 dark:group-hover:bg-slate-700/50 transition-colors duration-500">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              {project.github && (
                <Button
                  variant="outline"
                  className="w-full gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 backdrop-blur-lg"
                  asChild
                >
                  <a
                    href={
                      project.slug === "official-gazette-search"
                        ? "https://github.com/edlbrtojr/BuscaDiarios"
                        : project.slug === "personal-portfolio"
                        ? "https://github.com/edlbrtojr/portfolio"
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4" />
                    {language === "en" ? "View on GitHub" : "Ver no GitHub"}
                  </a>
                </Button>
              )}

              {project.live && (
                <Button
                  variant="outline"
                  className="w-full gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 backdrop-blur-lg"
                  asChild
                >
                  <a
                    href={
                      project.slug === "personal-portfolio"
                        ? "https://edilbertojunior.vercel.app/"
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {language === "en" ? "Live Demo" : "Demo Ao Vivo"}
                  </a>
                </Button>
              )}
            </div>

            {/* Related Projects */}
            {relatedProjects?.length > 0 && (
              <Card className="bg-white/10 dark:bg-slate-800/80 backdrop-filter backdrop-blur-lg border border-white/30 dark:border-white/30 shadow-xl rounded-3xl overflow-hidden group">
                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent -top-[100%] opacity-0 group-hover:opacity-100 group-hover:animate-[shine_3s_ease-in-out]"></div>

                <CardHeader className="p-6 relative z-10 group-hover:bg-white/10 dark:group-hover:bg-slate-700/50 transition-colors duration-500">
                  <CardTitle className="text-white">
                    {t.projectDetails.relatedProjects}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4 relative z-10 group-hover:bg-white/10 dark:group-hover:bg-slate-700/50 transition-colors duration-500">
                  {relatedProjects.map((relatedProject, index) => (
                    <Card
                      key={index}
                      className="bg-white/10 hover:bg-white/20 border-white/30 backdrop-blur-sm transition-colors"
                    >
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-1 text-white">
                          {relatedProject.title}
                        </h4>
                        <p className="text-sm text-white/70 mb-2 line-clamp-2">
                          {relatedProject.description}
                        </p>
                        <Link
                          href={`/projects/${relatedProject.slug}`}
                          passHref
                        >
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-300 hover:text-blue-200"
                          >
                            {t.projects.viewProject}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
