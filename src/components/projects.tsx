"use client";

import { motion, useAnimation } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useState, useEffect } from "react";
import Link from "next/link";

export function Projects() {
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set loaded after initial animations would be complete
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800); // Slightly longer than the initial animation duration

    return () => clearTimeout(timer);
  }, []);

  // Return early if t is not defined yet
  if (!t) {
    return <div>Loading...</div>;
  }

  return (
    <section id="projects" className="py-12 mb-12 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8 relative z-10"
      >
        <h2 className="text-3xl font-bold tracking-tight mb-4 text-white dark:text-white">
          {t.projects.title}
        </h2>
        <p className="text-white/80 dark:text-white/80 max-w-2xl backdrop-blur-sm bg-white/5 p-4 rounded-lg">
          {t.projects.subtitle}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {[...t.projects.projects]
          .sort((a, b) => parseInt(b.year) - parseInt(a.year))
          .map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={
                isLoaded
                  ? {
                      translateY: -5,
                      rotateX: "2deg",
                      rotateY: "2deg",
                      transition: { duration: 0.3 },
                    }
                  : {}
              }
              className={`group h-full ${
                !isLoaded ? "pointer-events-none" : ""
              }`}
            >
              <Card className="h-full flex flex-col icloud-card relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/3 before:to-transparent before:opacity-0 before:group-hover:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none">
                {/* Top shine effect - more subtle now */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r from-transparent via-white/8 to-transparent -top-[100%] ${
                    isLoaded ? "opacity-0 group-hover:opacity-100" : "opacity-0"
                  } group-hover:animate-[shine_2s_ease-in-out]`}
                ></div>

                {/* Edge glow effect - improved for dark mode */}
                <div
                  className={`absolute inset-0 rounded-2xl ${
                    isLoaded ? "opacity-0 group-hover:opacity-100" : "opacity-0"
                  } transition-opacity duration-500 pointer-events-none shadow-[0_0_15px_2px_rgba(101,157,255,0.07)]`}
                ></div>

                <CardHeader
                  className={`backdrop-blur-xl bg-white/10 dark:bg-slate-800/80 relative z-10 pb-4 pt-4 px-6 ${
                    isLoaded ? "group-hover:bg-white/8" : ""
                  } transition-colors duration-300 flex-none h-[75px]`}
                >
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-white/90 dark:text-white/90 relative group/title">
                      {project.title}
                      <span
                        className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400/50 ${
                          isLoaded ? "group-hover/title:w-full" : ""
                        } transition-all duration-500 ease-in-out`}
                      ></span>
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={`bg-white/10 dark:bg-slate-700/80 text-white/70 dark:text-white/70 border-white/5 backdrop-blur-md ${
                        isLoaded
                          ? "group-hover:bg-white/8 group-hover:text-white/90 dark:group-hover:text-white/90"
                          : ""
                      } transition-all duration-300 whitespace-nowrap flex-shrink-0 ml-2`}
                    >
                      {project.year}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent
                  className={`flex-grow backdrop-blur-xl bg-white/10 dark:bg-slate-800/80 relative z-10 ${
                    isLoaded ? "group-hover:bg-white/8" : ""
                  } transition-colors duration-300 px-6 py-4 h-[150px]`}
                >
                  <div className="h-full flex flex-col">
                    <p
                      className={`text-sm text-white/60 dark:text-white/60 ${
                        isLoaded
                          ? "group-hover:text-white/80 dark:group-hover:text-white/80"
                          : ""
                      } transition-colors duration-300 mb-4 line-clamp-3`}
                    >
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className={`text-xs bg-white/10 dark:bg-slate-700/80 text-white/60 dark:text-white/60 border border-white/3 ${
                            isLoaded
                              ? "group-hover:bg-white/8 group-hover:text-white/80 dark:group-hover:text-white/80"
                              : ""
                          } transition-all duration-300`}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter
                  className={`flex gap-2 pt-4 pb-4 px-6 backdrop-blur-xl bg-white/10 dark:bg-slate-800/80 relative z-10 ${
                    isLoaded ? "group-hover:bg-white/8" : ""
                  } transition-colors duration-300 h-[65px] items-center`}
                >
                  <Link href={`/projects/${project.slug}`} passHref>
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-1 icloud-btn text-white dark:text-white hover:shadow-[0_0_15px_rgba(101,157,255,0.15)] transition-all duration-300"
                      asChild
                    >
                      <span>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t.projects.viewProject}
                      </span>
                    </Button>
                  </Link>
                  {project.github && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 icloud-btn text-white dark:text-white border-white/5 hover:shadow-[0_0_15px_rgba(101,157,255,0.1)] transition-all duration-300"
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
                        <span>GitHub</span>
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
      </div>
    </section>
  );
}
