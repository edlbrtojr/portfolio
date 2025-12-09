"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
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

  const hero = t?.hero || defaultHero;
  const resumePath = `/api/resume/${language}`;

  return (
    <section id="hero" className="py-8 md:py-16 relative">
      {/* Main hero card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10"
      >
        <Card className="aurora-glass-glow overflow-hidden mb-8 group">
          {/* Decorative gradient blob */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-aurora-purple/20 rounded-full blur-3xl group-hover:bg-aurora-purple/30 transition-colors duration-700" />
          <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-aurora-cyan/20 rounded-full blur-3xl group-hover:bg-aurora-cyan/30 transition-colors duration-700" />

          <CardContent className="p-8 md:p-12 relative">
            {/* Greeting badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aurora-purple/10 border border-aurora-purple/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-aurora-purple" />
              <span className="text-sm font-medium text-aurora-purple">
                {hero.greeting}
              </span>
            </motion.div>

            {/* Name with gradient */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2">
                <GlitchText className="text-gradient">
                  Edilberto
                </GlitchText>
              </h1>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl md:text-2xl lg:text-3xl text-foreground/80 font-medium mb-6"
            >
              {hero.title}
            </motion.h2>

            {/* Summary */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-base md:text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed"
            >
              {hero.summary}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="aurora-btn-primary rounded-xl px-6 group/btn"
                  asChild
                >
                  <a href={resumePath} download className="flex items-center gap-2">
                    <Download className="h-4 w-4 transition-transform group-hover/btn:animate-bounce" />
                    {hero.downloadResume}
                  </a>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="aurora-btn rounded-xl px-6 group/btn"
                  asChild
                >
                  <a
                    href="https://wa.me/5568992833888"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {hero.contactMe}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Professional Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        >
          <Card className="aurora-glass-iridescent overflow-hidden group hover-lift">
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s ease-in-out infinite",
                }}
              />
            </div>

            <CardContent className="p-6 md:p-8 relative">
              {/* Section indicator */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-aurora-purple/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-aurora-purple" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground">
                  {hero.professionalSummaryTitle}
                </h3>
              </div>

              <p className="text-muted-foreground leading-relaxed pl-13">
                {hero.professionalSummary}
              </p>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-50">
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-aurora-purple/30 rounded-tr-xl" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-2 h-2 rounded-full bg-aurora-purple/50 animate-glow-pulse" />
      <div className="absolute bottom-20 left-5 w-3 h-3 rounded-full bg-aurora-cyan/40 animate-float" />
      <div className="absolute top-1/2 right-20 w-1.5 h-1.5 rounded-full bg-aurora-magenta/50 animate-float-reverse" />
    </section>
  );
}
