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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { useActiveSection } from "@/hooks/use-active-section";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [isCompact, setIsCompact] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check viewport height and set compact mode
    const checkHeight = () => {
      setIsCompact(window.innerHeight < 750);
    };
    
    checkHeight();
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
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
    { name: language === "pt" ? "Início" : nav.home, icon: Home, href: "#hero", sectionId: "hero" },
    { name: nav.projects, icon: Folder, href: "#projects", sectionId: "projects" },
    { name: nav.experience, icon: Briefcase, href: "#experience", sectionId: "experience" },
    { name: nav.education, icon: GraduationCap, href: "#education", sectionId: "education" },
    { name: nav.skills, icon: Code, href: "#skills", sectionId: "skills" },
    { name: nav.certifications, icon: Award, href: "#certifications", sectionId: "certifications" },
  ];

  const sectionIds = sections.map((section) => section.sectionId);
  const activeSection = useActiveSection(sectionIds);

  const socialLinks = [
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/edilbertolimajr/" },
    { name: "GitHub", icon: Github, href: "https://github.com/edlbrtojr/" },
  ];

  const contactInfo = [
    { icon: MapPin, text: "Rio Branco, Brasil", label: "Location" },
    { icon: Phone, text: "+55 68 99283-3888", label: "Phone" },
    { icon: Mail, text: "edlbrtojr@gmail.com", label: "Email" },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-[280px] xl:w-[300px] fixed top-0 left-0 bottom-0 hidden lg:flex flex-col sidebar-glass z-40"
      >
        {/* Profile Section - Adaptive */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`relative ${isCompact ? "p-4" : "p-5"}`}
        >
          <div className={`flex ${isCompact ? "flex-row items-center gap-3" : "flex-col items-center text-center"}`}>
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`relative shrink-0 group ${isCompact ? "" : "mb-3"}`}
            >
              {/* Gradient ring */}
              <div 
                className="absolute -inset-0.5 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--aurora-1)), hsl(var(--aurora-3)), hsl(var(--aurora-2)))",
                  backgroundSize: "200% 200%",
                  animation: "gradient-shift 4s ease infinite",
                }}
              />
              <div className={`relative rounded-full overflow-hidden bg-background ${isCompact ? "w-14 h-14" : "w-20 h-20 xl:w-24 xl:h-24"}`}>
                <img
                  src="/images/profile.jpg"
                  alt="Edilberto A. Lima Jr."
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online indicator */}
              <motion.div
                className={`absolute ${isCompact ? "bottom-0 right-0 w-3 h-3" : "bottom-1 right-1 w-3.5 h-3.5"} rounded-full bg-emerald-500 border-2 border-background`}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Name & Title */}
            <div className={isCompact ? "flex-1 min-w-0" : ""}>
              <h1 className={`font-display font-bold text-foreground leading-tight ${isCompact ? "text-base" : "text-lg"}`}>
                Edilberto A. Lima Jr.
              </h1>
              <p className={`text-muted-foreground ${isCompact ? "text-xs" : "text-sm"} truncate`}>
                {t?.sidebar?.title || "Analyst and Developer"}
              </p>
            </div>
          </div>

          {/* Social & Contact Row */}
          <div className={`flex items-center justify-between ${isCompact ? "mt-3" : "mt-4"}`}>
            {/* Social Links */}
            <div className="flex gap-1.5">
              {socialLinks.map((link) => (
                <Tooltip key={link.name}>
                  <TooltipTrigger asChild>
                    <motion.a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg bg-muted/50 hover:bg-aurora-purple/15 text-muted-foreground hover:text-aurora-purple transition-all duration-300"
                    >
                      <link.icon className="w-4 h-4" />
                    </motion.a>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {link.name}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Contact Info Toggle / Icons */}
            <div className="flex items-center gap-1.5">
              {contactInfo.map((item, idx) => (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 rounded-lg bg-muted/50 hover:bg-aurora-cyan/15 text-muted-foreground hover:text-aurora-cyan transition-all duration-300"
                      onClick={() => {
                        if (item.icon === Mail) {
                          window.location.href = `mailto:${item.text}`;
                        } else if (item.icon === Phone) {
                          window.location.href = `tel:${item.text.replace(/\s/g, '')}`;
                        }
                      }}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <span className="font-medium">{item.label}:</span> {item.text}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Divider with gradient */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Navigation - Takes priority */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 scrollbar-thin">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-widest">
              {t?.sidebar?.navigation || "Navigation"}
            </span>
          </div>

          <div className="space-y-0.5">
            {sections.map((section, index) => {
              const isActive = activeSection === section.sectionId;
              
              return (
                <motion.a
                  key={section.sectionId}
                  href={section.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-aurora-purple/12 text-foreground"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`}
                >
                  {/* Active indicator */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-gradient-to-b from-aurora-purple to-aurora-cyan"
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon */}
                  <div
                    className={`p-1.5 rounded-lg transition-colors duration-300 ${
                      isActive
                        ? "bg-aurora-purple/20 text-aurora-purple"
                        : "bg-muted/50 text-muted-foreground group-hover:bg-aurora-purple/10 group-hover:text-aurora-purple"
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                  </div>

                  {/* Label */}
                  <span className="font-medium text-sm flex-1">{section.name}</span>

                  {/* Active dot */}
                  {isActive && (
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-aurora-purple"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(139, 92, 246, 0.4)",
                          "0 0 0 6px rgba(139, 92, 246, 0)",
                        ],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.a>
              );
            })}
          </div>
        </nav>

        {/* Footer - Always visible */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="shrink-0 p-3 border-t border-border/30"
        >
          <div className="flex items-center justify-between gap-2">
            {/* Quick info */}
            <div className="flex items-center gap-2 px-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">
                {language === "pt" ? "Disponível" : "Available"}
              </span>
            </div>

            {/* Toggle buttons */}
            <div className="flex gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleLanguage}
                      className="h-9 w-9 rounded-lg bg-muted/50 hover:bg-aurora-purple/15 text-muted-foreground hover:text-aurora-purple transition-all"
                    >
                      <Languages className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {language === "en" ? "Mudar para Português" : "Switch to English"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleThemeToggle}
                      className="h-9 w-9 rounded-lg bg-muted/50 hover:bg-aurora-purple/15 text-muted-foreground hover:text-aurora-purple transition-all"
                    >
                      {mounted && (
                        <motion.div
                          initial={false}
                          animate={{ rotate: theme === "dark" ? 0 : 180 }}
                          transition={{ duration: 0.4 }}
                        >
                          {theme === "dark" ? (
                            <Sun className="h-4 w-4" />
                          ) : (
                            <Moon className="h-4 w-4" />
                          )}
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {theme === "dark" 
                    ? (language === "pt" ? "Modo claro" : "Light mode")
                    : (language === "pt" ? "Modo escuro" : "Dark mode")
                  }
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </motion.div>
      </motion.aside>
    </TooltipProvider>
  );
}
