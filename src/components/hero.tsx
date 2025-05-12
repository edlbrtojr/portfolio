"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import GlitchText from "./glitch-text";

type HeroContent = {
  greeting: string;
  title: string;
  summary: string;
  downloadResume: string;
  contactMe: string;
  professionalSummaryTitle: string;
  professionalSummary: string;
};

export function Hero() {
  const { t, language } = useLanguage();

  // Default hero content in case t.hero is undefined
  const defaultHero: HeroContent = {
    greeting: "Hello, I'm",
    title: "Analyst and Developer",
    summary:
      "Specialized in Power Platform, Power Apps, Dynamics 365, Microsoft Fabric and Power BI.",
    downloadResume: "Download Resume",
    contactMe: "Contact Me",
    professionalSummaryTitle: "Professional Summary",
    professionalSummary:
      "Developer specialized in Power Platform, Power Apps, Dynamics 365, Microsoft Fabric and Power BI.",
  };

  // Use t.hero if available, otherwise use default
  const hero = t?.hero || defaultHero;

  // Set resume file path based on selected language
  const resumeFileName = language === "pt" ? "resume-pt.pdf" : "resume-en.pdf";

  // Encode the file path to handle special characters
  const resumePath = `/${resumeFileName}`;

  return (
    <section id="hero" className="py-12 md:py-24 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="bg-white/10 dark:bg-slate-800/80 backdrop-filter backdrop-blur-lg border border-white/30 dark:border-white/30 shadow-xl rounded-3xl overflow-hidden mb-10">
          <CardContent className="p-8 md:p-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
              {hero.greeting}
              <GlitchText className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-white">
                <span className="text-blue-300">Edilberto</span>
              </GlitchText>
            </h1>
            <h2 className="text-2xl md:text-3xl text-white/90 mb-6">
              {hero.title}
            </h2>
            <p className="text-lg max-w-2xl mb-8 text-white/90">
              {hero.summary}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="group bg-white/30 hover:bg-white/40 dark:bg-blue-600/80 dark:hover:bg-blue-600 text-white border border-white/30 shadow-sm transition-all duration-300 rounded-xl"
                asChild
              >
                <a href={resumePath} download>
                  <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                  {hero.downloadResume}
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/30 dark:bg-slate-700/90 dark:hover:bg-slate-700 text-white hover:text-white border-white/30 hover:border-white/40 rounded-xl"
              >
                <a href="https://wa.me/5568992833888">{hero.contactMe}</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 dark:bg-slate-800/80 backdrop-filter backdrop-blur-lg border border-white/30 dark:border-white/30 shadow-xl rounded-3xl overflow-hidden group">
          {/* Subtle shine effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent -top-[100%] opacity-0 group-hover:opacity-100 group-hover:animate-[shine_3s_ease-in-out]"></div>

          <CardContent className="p-8 relative z-10 group-hover:bg-white/10 dark:group-hover:bg-slate-700/50 transition-colors duration-500">
            <h3 className="text-xl font-semibold mb-4 text-white">
              {hero.professionalSummaryTitle}
            </h3>
            <p className="text-white/90 dark:text-white/90 leading-relaxed">
              {hero.professionalSummary}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
