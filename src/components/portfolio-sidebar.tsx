"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Folder,
  Github,
  Linkedin,
  Moon,
  Sun,
  Languages,
  Home,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/language-context";
import { useActiveSection } from "@/hooks/use-active-section";
import { TeachingBubble } from "@/components/ui/teaching-bubble";

type NavItem = {
  name: string;
  icon: React.ElementType;
  href: string;
  sectionId: string;
};

export function PortfolioSidebar() {
  const { theme, setTheme } = useTheme();
  const { t, language, toggleLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const defaultNav = {
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    certifications: "Certifications",
    projects: "Projects",
    home: "Home",
  };

  const nav = t?.navigation || defaultNav;

  const sections: NavItem[] = [
    {
      name: language === "pt" ? "Início" : nav.home,
      icon: Home,
      href: "#hero",
      sectionId: "hero",
    },
    {
      name: nav.projects,
      icon: Folder,
      href: "#projects",
      sectionId: "projects",
    },
    {
      name: nav.experience,
      icon: Briefcase,
      href: "#experience",
      sectionId: "experience",
    },
    {
      name: nav.education,
      icon: GraduationCap,
      href: "#education",
      sectionId: "education",
    },
    { name: nav.skills, icon: Code, href: "#skills", sectionId: "skills" },
    {
      name: nav.certifications,
      icon: Award,
      href: "#certifications",
      sectionId: "certifications",
    },
  ];

  const sectionIds = sections.map((section) => section.sectionId);
  const activeSection = useActiveSection(sectionIds);

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/edilbertolimajr/",
    },
    { name: "GitHub", icon: Github, href: "https://github.com/edlbrtojr/" },
  ];

  const contactInfo = [
    { icon: MapPin, text: "Rio Branco, Brasil" },
    { icon: Phone, text: "+55 68 99283-3888" },
    { icon: Mail, text: "edlbrtojr@gmail.com" },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-[320px] fixed top-0 left-0 bottom-0 hidden lg:block sidebar-glass z-40"
    >
      <div className="flex flex-col h-full">
        {/* Profile Section */}
        <div className="p-6 flex flex-col items-center text-center">
          {/* Avatar with animated ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative mb-6 group"
          >
            {/* Animated gradient ring */}
            <div className="absolute -inset-1 rounded-full opacity-75 group-hover:opacity-100 transition-opacity duration-500">
              <div
                className="w-full h-full rounded-full animate-border-flow"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--aurora-1)), hsl(var(--aurora-3)), hsl(var(--aurora-2)), hsl(var(--aurora-5)), hsl(var(--aurora-1)))",
                  backgroundSize: "400% 400%",
                  padding: "3px",
                }}
              >
                <div className="w-full h-full rounded-full bg-background" />
              </div>
            </div>

            {/* Profile image */}
            <div className="relative w-36 h-36 rounded-full overflow-hidden">
              <motion.img
                src="/images/profile.jpg"
                alt="Edilberto A. Lima Jr."
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
              {/* Overlay glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-aurora-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Status indicator */}
            <motion.div
              className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Name and title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl font-display font-bold text-foreground mb-1"
          >
            Edilberto A. Lima Jr.
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-muted-foreground text-sm mb-4"
          >
            {t?.sidebar?.title || "Analyst and Developer"}
          </motion.p>

          {/* Social links */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex gap-2"
          >
            {socialLinks.map((link, index) => (
              <motion.div
                key={link.name}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="aurora-btn rounded-xl hover:bg-aurora-purple/20 hover:text-aurora-purple transition-all duration-300"
                  asChild
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                  >
                    <link.icon className="h-5 w-5" />
                  </a>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <Separator className="bg-border/50 mx-6" />

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="px-6 py-4"
        >
          <div className="space-y-3">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 text-muted-foreground group cursor-default"
              >
                <div className="p-1.5 rounded-lg bg-aurora-purple/10 group-hover:bg-aurora-purple/20 transition-colors duration-300">
                  <item.icon className="h-3.5 w-3.5 text-aurora-purple" />
                </div>
                <span className="text-sm group-hover:text-foreground transition-colors duration-300">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Separator className="bg-border/50 mx-6" />

        {/* Navigation */}
        <div className="px-6 py-4 flex-1 overflow-auto">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3"
          >
            {t?.sidebar?.navigation || "Navigation"}
          </motion.h3>
          <nav className="space-y-1">
            {sections.map((section, index) => {
              const isActive = activeSection === section.sectionId;
              return (
                <motion.a
                  key={section.name}
                  href={section.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative ${
                    isActive
                      ? "bg-aurora-purple/15 text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  {/* Active indicator bar */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-gradient-to-b from-aurora-purple to-aurora-cyan"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>

                  <motion.div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-aurora-purple/20"
                        : "bg-muted/50 group-hover:bg-aurora-purple/10"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <section.icon
                      className={`h-4 w-4 transition-colors duration-300 ${
                        isActive
                          ? "text-aurora-purple"
                          : "text-muted-foreground group-hover:text-aurora-purple"
                      }`}
                    />
                  </motion.div>
                  <span className="font-medium text-sm">{section.name}</span>

                  {/* Active glow dot */}
                  {isActive && (
                    <motion.span
                      className="ml-auto w-2 h-2 rounded-full bg-aurora-purple"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 hsl(var(--aurora-1) / 0.4)",
                          "0 0 0 8px hsl(var(--aurora-1) / 0)",
                        ],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.a>
              );
            })}
          </nav>
        </div>

        {/* Footer with theme and language toggles */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="p-6 border-t border-border/50"
        >
          <div className="flex gap-2 justify-end">
            <TeachingBubble
              content="Click to switch between Portuguese and English"
              storageKey="language-tip-seen"
              side="top"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleLanguage}
                  title={
                    language === "en"
                      ? "Switch to Portuguese"
                      : "Switch to English"
                  }
                  className="aurora-btn rounded-xl border-border/50 hover:border-aurora-purple/50 hover:bg-aurora-purple/10"
                >
                  <Languages className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Toggle language</span>
                </Button>
              </motion.div>
            </TeachingBubble>
            <TeachingBubble
              content="Click to switch between light and dark mode"
              storageKey="theme-tip-seen"
              side="top"
              delay={2000}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleThemeToggle}
                  title={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                  className="aurora-btn rounded-xl border-border/50 hover:border-aurora-purple/50 hover:bg-aurora-purple/10"
                >
                  {mounted && (
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: theme === "dark" ? 0 : 180 }}
                      transition={{ duration: 0.5 }}
                    >
                      {theme === "dark" ? (
                        <Sun className="h-[1.2rem] w-[1.2rem]" />
                      ) : (
                        <Moon className="h-[1.2rem] w-[1.2rem]" />
                      )}
                    </motion.div>
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </motion.div>
            </TeachingBubble>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
