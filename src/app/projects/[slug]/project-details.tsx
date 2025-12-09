"use client";

import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Github,
  Lightbulb,
  Target,
  Trophy,
  Folder,
  Sparkles,
  Code2,
  Rocket,
  ChevronRight,
  Star,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";

export function ProjectDetails({ slug }: { slug: string }) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredTech, setHoveredTech] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  if (!t) {
    return (
      <div className="w-full mx-auto py-12 px-4">
        <div className="aurora-glass rounded-2xl p-8 animate-pulse">
          <div className="h-8 bg-muted/50 rounded w-1/3 mb-4" />
          <div className="h-4 bg-muted/50 rounded w-2/3" />
        </div>
      </div>
    );
  }

  const project = t.projects?.projects?.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="w-full mx-auto py-12 px-4 min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-aurora-purple/10 flex items-center justify-center mx-auto mb-6">
            <Folder className="w-10 h-10 text-aurora-purple" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4 text-foreground">
            {language === "en" ? "Project not found" : "Projeto não encontrado"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {language === "en"
              ? "The project you're looking for doesn't exist or has been moved."
              : "O projeto que você procura não existe ou foi movido."}
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => router.back()}
              className="aurora-btn-primary rounded-xl px-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === "en" ? "Go Back" : "Voltar"}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const projectDetails = project.details || {
    overview: project.description,
    challenges: [],
    solutions: [],
    results: [],
  };

  const relatedProjects = t.projects?.projects
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div ref={containerRef} className="w-full mx-auto pb-16 relative">
      {/* Hero Section with Parallax */}
      <motion.div
        style={{ y: headerY, opacity: headerOpacity }}
        className="relative overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-aurora-purple/10 via-transparent to-transparent" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-aurora-purple/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-aurora-cyan/20 rounded-full blur-3xl animate-float-reverse" />

        <div className="px-4 md:px-8 pt-8 pb-12">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/#projects" scroll={false}>
              <Button
                variant="ghost"
                className="group mb-8 rounded-xl hover:bg-aurora-purple/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                {t.projectDetails.backToProjects}
              </Button>
            </Link>
          </motion.div>

          {/* Project Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="aurora-glass-glow overflow-hidden border-0 relative">
              {/* Featured badge */}
              {project.featured && (
                <div className="absolute top-4 right-4 z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30"
                  >
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-medium text-amber-400">
                      {language === "pt" ? "Destaque" : "Featured"}
                    </span>
                  </motion.div>
                </div>
              )}

              <CardHeader className="p-8 md:p-10 pb-6">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-aurora-purple/20 to-aurora-cyan/20 flex items-center justify-center shrink-0 border border-aurora-purple/20"
                  >
                    <Folder className="w-10 h-10 text-aurora-purple" />
                  </motion.div>

                  <div className="flex-1">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <CardTitle className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
                        {project.title}
                      </CardTitle>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-wrap items-center gap-4 text-muted-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-aurora-cyan" />
                        <span>{project.year}</span>
                      </div>
                      {project.technologies.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Code2 className="h-4 w-4 text-aurora-purple" />
                          <span>
                            {project.technologies.length}{" "}
                            {language === "pt" ? "tecnologias" : "technologies"}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-8 md:px-10 pb-8 md:pb-10">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg md:text-xl text-muted-foreground leading-relaxed"
                >
                  {project.description}
                </motion.p>

                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-4 mt-8"
                >
                  {project.liveUrl && (
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        className="aurora-btn-primary rounded-xl px-6 h-12 text-base group"
                        asChild
                      >
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Rocket className="w-5 h-5 mr-2 transition-transform group-hover:-translate-y-0.5" />
                          {language === "pt" ? "Acessar Projeto" : "Visit Project"}
                        </a>
                      </Button>
                    </motion.div>
                  )}
                  {project.github && (
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        variant="outline"
                        className="aurora-btn rounded-xl px-6 h-12 text-base"
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
                          <Github className="w-5 h-5 mr-2" />
                          GitHub
                        </a>
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 md:px-8 space-y-8"
      >
        {/* Technologies Section */}
        <motion.div variants={itemVariants}>
          <Card className="aurora-glass-iridescent overflow-hidden">
            <CardHeader className="p-6 md:p-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aurora-purple/20 to-aurora-cyan/20 flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-aurora-purple" />
                </div>
                <div>
                  <CardTitle className="text-xl font-display font-semibold text-foreground">
                    {t.projectDetails.technologies}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === "pt"
                      ? "Stack tecnológica utilizada"
                      : "Technology stack used"}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 md:px-8 pb-8">
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.1 + index * 0.05,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.1, y: -4 }}
                    onHoverStart={() => setHoveredTech(index)}
                    onHoverEnd={() => setHoveredTech(null)}
                    className={`relative px-4 py-2 rounded-xl font-medium text-sm cursor-default transition-all duration-300 ${
                      hoveredTech === index
                        ? "bg-aurora-purple/20 text-aurora-purple border-aurora-purple/40"
                        : "bg-muted/30 text-foreground border-border/50"
                    } border`}
                  >
                    {tech}
                    {hoveredTech === index && (
                      <motion.div
                        layoutId="techHighlight"
                        className="absolute inset-0 bg-aurora-purple/10 rounded-xl -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Overview Section */}
        <motion.div variants={itemVariants}>
          <Card className="aurora-glass overflow-hidden group hover:border-aurora-purple/20 transition-colors duration-500">
            <CardHeader className="p-6 md:p-8 pb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 rounded-xl bg-aurora-purple/10 flex items-center justify-center group-hover:bg-aurora-purple/20 transition-colors duration-300"
                >
                  <Sparkles className="w-6 h-6 text-aurora-purple" />
                </motion.div>
                <CardTitle className="text-xl font-display font-semibold text-foreground">
                  {t.projectDetails.overview}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-6 md:px-8 pb-8">
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                {projectDetails.overview || project.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Challenges and Solutions Grid */}
        {(projectDetails.challenges?.length > 0 ||
          projectDetails.solutions?.length > 0) && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Challenges */}
            {projectDetails.challenges?.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="aurora-glass overflow-hidden h-full group hover:border-aurora-magenta/20 transition-colors duration-500">
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-12 h-12 rounded-xl bg-aurora-magenta/10 flex items-center justify-center group-hover:bg-aurora-magenta/20 transition-colors duration-300"
                      >
                        <Target className="w-6 h-6 text-aurora-magenta" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-lg font-display font-semibold text-foreground">
                          {t.projectDetails.challenges}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {projectDetails.challenges.length}{" "}
                          {language === "pt" ? "desafios" : "challenges"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <ul className="space-y-4">
                      {projectDetails.challenges.map((challenge, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 text-sm text-muted-foreground group/item"
                        >
                          <span className="w-6 h-6 rounded-lg bg-aurora-magenta/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-aurora-magenta/20 transition-colors">
                            <Zap className="w-3.5 h-3.5 text-aurora-magenta" />
                          </span>
                          <span className="group-hover/item:text-foreground transition-colors">
                            {challenge}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Solutions */}
            {projectDetails.solutions?.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="aurora-glass overflow-hidden h-full group hover:border-aurora-cyan/20 transition-colors duration-500">
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-12 h-12 rounded-xl bg-aurora-cyan/10 flex items-center justify-center group-hover:bg-aurora-cyan/20 transition-colors duration-300"
                      >
                        <Lightbulb className="w-6 h-6 text-aurora-cyan" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-lg font-display font-semibold text-foreground">
                          {t.projectDetails.solutions}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {projectDetails.solutions.length}{" "}
                          {language === "pt" ? "soluções" : "solutions"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <ul className="space-y-4">
                      {projectDetails.solutions.map((solution, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 text-sm text-muted-foreground group/item"
                        >
                          <span className="w-6 h-6 rounded-lg bg-aurora-cyan/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-aurora-cyan/20 transition-colors">
                            <CheckCircle2 className="w-3.5 h-3.5 text-aurora-cyan" />
                          </span>
                          <span className="group-hover/item:text-foreground transition-colors">
                            {solution}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        )}

        {/* Results Section */}
        {projectDetails.results?.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="aurora-glass-iridescent overflow-hidden relative">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />

              <CardHeader className="p-6 md:p-8 pb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center"
                  >
                    <Trophy className="w-6 h-6 text-amber-500" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-xl font-display font-semibold text-foreground">
                      {t.projectDetails.results}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === "pt"
                        ? "Impacto e conquistas do projeto"
                        : "Project impact and achievements"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 md:px-8 pb-8 relative">
                <div className="grid sm:grid-cols-2 gap-4">
                  {projectDetails.results.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="p-4 rounded-xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                          <Star className="w-4 h-4 text-amber-500" />
                        </span>
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          {result}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Related Projects */}
        {relatedProjects?.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground">
                {t.projectDetails.relatedProjects}
              </h2>
              <Link href="/#projects">
                <Button variant="ghost" className="group text-muted-foreground hover:text-foreground">
                  {language === "pt" ? "Ver todos" : "View all"}
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((relatedProject, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Link href={`/projects/${relatedProject.slug}`}>
                    <Card className="aurora-glass overflow-hidden h-full cursor-pointer group hover:border-aurora-purple/30 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-aurora-purple/10 flex items-center justify-center shrink-0 group-hover:bg-aurora-purple/20 transition-colors duration-300">
                            <Folder className="w-6 h-6 text-aurora-purple" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-display font-semibold text-foreground group-hover:text-aurora-purple transition-colors duration-300 line-clamp-1">
                              {relatedProject.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {relatedProject.year}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {relatedProject.description}
                        </p>

                        <div className="flex items-center text-aurora-purple text-sm font-medium group-hover:gap-2 transition-all duration-300">
                          <span>{t.projects.viewProject}</span>
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
