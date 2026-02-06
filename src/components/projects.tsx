"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Github,
  Star,
  Rocket,
  Folder,
  ArrowUpRight,
  TrendingUp,
  Calendar,
  Layers,
  Eye,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

type Project = {
  title: string;
  description: string;
  year: string;
  technologies: string[];
  github: boolean;
  live?: boolean;
  liveUrl?: string;
  slug: string;
  featured?: boolean;
  image?: string;
  details?: {
    overview: string;
    challenges: string[];
    solutions: string[];
    results: string[];
  };
};

function FeaturedProjectCard({ project, language, viewText }: { 
  project: Project; 
  language: string;
  viewText: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX: isHovered ? rotateX : 0, 
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className="relative group perspective-1000"
    >
      <div className="relative aurora-glass-glow rounded-3xl overflow-hidden border border-amber-500/20 hover:border-amber-500/40 transition-colors duration-500">
        {/* Glowing border effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-amber-500/20 blur-xl" />
        </div>

        {/* Content grid */}
        <div className="relative grid lg:grid-cols-2 gap-0">
          {/* Left: Image/Visual */}
          <div className="relative h-64 lg:h-auto lg:min-h-[400px] overflow-hidden">
            {project.slug === "smilix-multiclinic" ? (
              <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-teal-950 flex items-center justify-center p-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full max-w-[280px] lg:max-w-[320px]"
                >
                  <Image
                    src="/Smilix Logo com Nome.png"
                    alt="Smilix Logo"
                    width={400}
                    height={120}
                    className="w-full h-auto object-contain drop-shadow-lg transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </motion.div>
                {/* Decorative elements */}
                <div className="absolute top-8 right-8 w-20 h-20 bg-teal-400/20 rounded-full blur-2xl" />
                <div className="absolute bottom-12 left-12 w-16 h-16 bg-amber-400/20 rounded-full blur-xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/80 lg:block hidden" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent lg:hidden" />
              </div>
            ) : project.image ? (
              <div className="absolute inset-0">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/90 lg:block hidden" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent lg:hidden" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-amber-600/20 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 rounded-full border-2 border-dashed border-amber-500/30"
                />
                <Folder className="absolute w-16 h-16 text-amber-500/50" />
              </div>
            )}

            {/* Badges overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/90 text-white text-xs font-semibold shadow-lg shadow-amber-500/30"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                {language === "pt" ? "Destaque" : "Featured"}
              </motion.div>
              {project.slug === "smilix-multiclinic" && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/90 text-white text-xs font-semibold shadow-lg shadow-emerald-500/30"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  {language === "pt" ? "Gerando receita" : "Generating revenue"}
                </motion.div>
              )}
            </div>
          </div>

          {/* Right: Content */}
          <div className="p-6 lg:p-8 flex flex-col justify-center relative z-10">
            {/* Year badge */}
            <div className="flex items-center gap-2 text-amber-500 text-sm font-medium mb-3">
              <Calendar className="w-4 h-4" />
              <span>{project.year}</span>
            </div>

            {/* Title */}
            <h3 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-4 group-hover:text-amber-500 transition-colors duration-300">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-4">
              {project.description}
            </p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.slice(0, 6).map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                >
                  {tech}
                </motion.span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Link href={`/projects/${project.slug}`}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="aurora-btn group/btn rounded-xl px-5">
                    <Eye className="w-4 h-4 mr-2" />
                    {viewText}
                    <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Button>
                </motion.div>
              </Link>

              {project.liveUrl && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl px-5 shadow-lg shadow-amber-500/25"
                    asChild
                  >
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Rocket className="w-4 h-4 mr-2" />
                      {language === "pt" ? "Acessar" : "Visit"}
                    </a>
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500/30 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/30 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
}

function ProjectCard({ project, index, language, viewText }: { 
  project: Project; 
  index: number;
  language: string;
  viewText: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group h-full"
    >
      <div className={`relative h-full aurora-glass rounded-2xl overflow-hidden transition-all duration-500 ${
        isHovered ? "translate-y-[-6px] shadow-xl shadow-aurora-purple/10" : ""
      }`}>
        {/* Animated border gradient */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(34, 211, 238, 0.2), rgba(139, 92, 246, 0.3))",
            backgroundSize: "200% 200%",
            padding: "1px",
          }}
          animate={isHovered ? {
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full rounded-2xl bg-background" />
        </motion.div>

        {/* Content */}
        <div className="relative p-5 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="w-11 h-11 rounded-xl bg-aurora-purple/10 flex items-center justify-center group-hover:bg-aurora-purple/20 transition-colors"
            >
              <Folder className="w-5 h-5 text-aurora-purple" />
            </motion.div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-medium">{project.year}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-display font-semibold text-foreground mb-2 group-hover:text-aurora-purple transition-colors line-clamp-2">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-grow">
            {project.description}
          </p>

          {/* Technologies - compact */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-muted/50 text-muted-foreground border border-border/50"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-aurora-purple/10 text-aurora-purple">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/30">
            <Link href={`/projects/${project.slug}`}>
              <motion.button
                whileHover={{ x: 4 }}
                className="flex items-center gap-1.5 text-sm font-medium text-aurora-purple hover:text-aurora-cyan transition-colors"
              >
                {viewText}
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </Link>

            <div className="flex gap-1.5">
              {project.liveUrl && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              )}
              {project.github && (
                <motion.a
                  href={
                    project.slug === "official-gazette-search"
                      ? "https://github.com/edlbrtojr/BuscaDiarios"
                      : project.slug === "personal-portfolio"
                      ? "https://github.com/edlbrtojr/portfolio"
                      : "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-aurora-purple/10 hover:text-aurora-purple transition-colors"
                >
                  <Github className="w-4 h-4" />
                </motion.a>
              )}
            </div>
          </div>
        </div>

        {/* Hover spotlight effect */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "radial-gradient(400px circle at 50% 0%, rgba(139, 92, 246, 0.08), transparent 60%)",
          }}
        />
      </div>
    </motion.div>
  );
}

export function Projects() {
  const { t, language } = useLanguage();

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

  const featuredProject = sortedProjects.find((p) => p.featured);
  const otherProjects = sortedProjects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-12 relative">
      {/* Background decorations */}
      <div className="absolute top-20 -right-20 w-80 h-80 bg-aurora-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 -left-20 w-60 h-60 bg-aurora-cyan/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 relative z-10"
      >
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            whileHover={{ rotate: [0, -15, 15, 0] }}
            transition={{ duration: 0.5 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-aurora-purple/20 to-aurora-cyan/10 flex items-center justify-center border border-aurora-purple/20"
          >
            <Layers className="w-7 h-7 text-aurora-purple" />
          </motion.div>
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
              {t.projects.title}
            </h2>
            <p className="text-muted-foreground mt-1">
              {t.projects.subtitle}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-aurora-purple animate-pulse" />
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{sortedProjects.length}</span> {language === "pt" ? "projetos" : "projects"}
            </span>
          </div>
          {featuredProject && (
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-muted-foreground">
                <span className="font-semibold text-amber-500">1</span> {language === "pt" ? "em destaque" : "featured"}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Featured Project */}
      {featuredProject && (
        <div className="mb-10">
          <FeaturedProjectCard 
            project={featuredProject} 
            language={language} 
            viewText={t.projects.viewProject}
          />
        </div>
      )}

      {/* Other Projects Grid */}
      {otherProjects.length > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest">
              {language === "pt" ? "Mais projetos" : "More projects"}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {otherProjects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index}
                language={language}
                viewText={t.projects.viewProject}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
