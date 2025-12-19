"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Star, Rocket, Folder, ArrowUpRight, TrendingUp } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useState, useEffect } from "react";
import Link from "next/link";

export function Projects() {
  const { t, language } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (!t) {
    return (
      <div className="py-12">
        <div className="aurora-glass rounded-2xl p-8 animate-pulse">
          <div className="h-8 bg-muted/50 rounded w-1/3 mb-4" />
          <div className="h-4 bg-muted/50 rounded w-2/3" />
        </div>
      </div>
    );
  }

  const sortedProjects = [...t.projects.projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return parseInt(b.year) - parseInt(a.year);
  });

  return (
    <section id="projects" className="py-12 relative">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-10 relative z-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-aurora-purple/10 flex items-center justify-center">
            <Folder className="w-6 h-6 text-aurora-purple" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">
              {t.projects.title}
            </h2>
          </div>
        </div>
        <p className="text-muted-foreground max-w-2xl ml-15 pl-0.5">
          {t.projects.subtitle}
        </p>
      </motion.div>

      {/* Projects grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {sortedProjects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`group h-full ${project.featured ? "md:col-span-2" : ""}`}
          >
            <Card
              className={`h-full flex flex-col aurora-glass-iridescent overflow-hidden transition-all duration-500 ${
                project.featured
                  ? "ring-2 ring-amber-400/20 hover:ring-amber-400/40"
                  : ""
              } ${
                hoveredIndex === index
                  ? "translate-y-[-8px] shadow-2xl"
                  : ""
              }`}
              style={{
                transform:
                  hoveredIndex === index && isLoaded
                    ? "perspective(1000px) rotateX(2deg) rotateY(2deg) translateY(-8px)"
                    : "perspective(1000px) rotateX(0deg) rotateY(0deg)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* Featured indicator */}
              {project.featured && (
                <div className="absolute top-0 right-0 flex flex-col gap-1.5">
                  <div className="px-4 py-1.5 bg-gradient-to-l from-amber-500/20 to-transparent rounded-bl-lg">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-medium text-amber-400">
                        {language === "pt" ? "Destaque" : "Featured"}
                      </span>
                    </div>
                  </div>
                  {project.slug === "smilix-multiclinic" && (
                    <div className="px-4 py-1.5 bg-gradient-to-l from-emerald-500/20 to-transparent rounded-bl-lg">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-400">
                          {language === "pt" ? "Rentável" : "Revenue"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Card header */}
              <CardHeader className="pb-3 relative">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        project.featured
                          ? "bg-amber-400/10 group-hover:bg-amber-400/20"
                          : "bg-aurora-purple/10 group-hover:bg-aurora-purple/20"
                      }`}
                    >
                      <Folder
                        className={`w-5 h-5 transition-colors duration-300 ${
                          project.featured
                            ? "text-amber-400"
                            : "text-aurora-purple group-hover:text-aurora-cyan"
                        }`}
                      />
                    </div>
                    <CardTitle
                      className={`${
                        project.featured ? "text-xl" : "text-lg"
                      } font-display font-semibold text-foreground group-hover:text-aurora-purple transition-colors duration-300`}
                    >
                      {project.title}
                    </CardTitle>
                  </div>
                  <Badge
                    variant="outline"
                    className="aurora-badge shrink-0"
                  >
                    {project.year}
                  </Badge>
                </div>
              </CardHeader>

              {/* Card content */}
              <CardContent className="flex-grow pb-4">
                <p
                  className={`text-muted-foreground ${
                    project.featured ? "text-base line-clamp-4" : "text-sm line-clamp-3"
                  } mb-4 leading-relaxed`}
                >
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <motion.span
                      key={techIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + techIndex * 0.05 }}
                      className="px-2.5 py-1 text-xs rounded-lg bg-muted/50 text-muted-foreground border border-border/50 hover:bg-aurora-purple/10 hover:text-aurora-purple hover:border-aurora-purple/20 transition-all duration-300"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </CardContent>

              {/* Card footer with actions */}
              <CardFooter className="pt-4 border-t border-border/50 gap-2 flex-wrap">
                <Link href={`/projects/${project.slug}`} passHref>
                  <Button
                    variant="default"
                    size="sm"
                    className="aurora-btn group/btn rounded-xl"
                    asChild
                  >
                    <span className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      {t.projects.viewProject}
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-y-0 group-hover/btn:translate-x-0 transition-all duration-300" />
                    </span>
                  </Button>
                </Link>

                {project.liveUrl && (
                  <Button
                    variant="default"
                    size="sm"
                    className={`rounded-xl transition-all duration-300 ${
                      project.featured
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
                    }`}
                    asChild
                  >
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Rocket className="h-4 w-4" />
                      <span>{language === "pt" ? "Acessar" : "Visit"}</span>
                    </a>
                  </Button>
                )}

                {project.github && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="aurora-btn rounded-xl"
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
                      className="flex items-center gap-2"
                    >
                      <Github className="h-4 w-4" />
                      <span>GitHub</span>
                    </a>
                  </Button>
                )}
              </CardFooter>

              {/* Hover glow effect */}
              <div
                className={`absolute inset-0 rounded-[inherit] transition-opacity duration-500 pointer-events-none ${
                  hoveredIndex === index ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  background: project.featured
                    ? "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(251, 191, 36, 0.06), transparent 40%)"
                    : "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139, 92, 246, 0.06), transparent 40%)",
                }}
              />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 -right-10 w-40 h-40 bg-aurora-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 -left-10 w-32 h-32 bg-aurora-cyan/5 rounded-full blur-3xl" />
    </section>
  );
}

