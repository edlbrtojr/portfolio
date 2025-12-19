"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { useLanguage } from "@/context/language-context";
import { useTheme } from "next-themes";
import {
  Menu,
  Moon,
  Sun,
  Languages,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Folder,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Home,
} from "lucide-react";
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

export function MobileHeader() {
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="lg:hidden sticky top-0 z-50"
      >
        {/* Glass header bar */}
        <div className="aurora-glass rounded-none border-x-0 border-t-0">
          {/* Gradient accent line */}
          <div className="h-0.5 bg-gradient-to-r from-aurora-purple via-aurora-cyan to-aurora-magenta opacity-80" />
          
          <div className="flex items-center justify-between px-4 py-3">
            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="absolute -inset-0.5 rounded-full opacity-70"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--aurora-1)), hsl(var(--aurora-3)))",
                  }}
                />
                <Avatar className="h-9 w-9 relative border-2 border-background">
                  <AvatarImage src="/images/profile.jpg" alt="Edilberto A. Lima Jr." />
                  <AvatarFallback className="bg-aurora-purple/20 text-aurora-purple font-display text-xs">
                    EL
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="min-w-0">
                <h1 className="font-display font-bold text-sm text-foreground truncate">
                  Edilberto Lima Jr.
                </h1>
                <p className="text-xs text-muted-foreground truncate">
                  {t?.sidebar?.title || "Analyst & Developer"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Quick theme toggle */}
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-9 w-9 rounded-lg bg-muted/50 hover:bg-aurora-purple/15"
                >
                  {mounted && (
                    theme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )
                  )}
                </Button>
              </motion.div>

              {/* Menu trigger */}
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg bg-muted/50 hover:bg-aurora-purple/15"
                    >
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </motion.div>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-[300px] sm:w-[340px] bg-background/95 backdrop-blur-xl border-l border-border/30 p-0 flex flex-col"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                  </SheetHeader>

                  {/* Gradient accent */}
                  <div className="h-1 bg-gradient-to-r from-aurora-purple via-aurora-cyan to-aurora-magenta opacity-80" />
                  
                  {/* Profile - Compact */}
                  <div className="p-4 border-b border-border/30">
                    <div className="flex items-center gap-3">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative shrink-0"
                      >
                        <div
                          className="absolute -inset-0.5 rounded-full opacity-70"
                          style={{
                            background: "linear-gradient(135deg, hsl(var(--aurora-1)), hsl(var(--aurora-3)), hsl(var(--aurora-2)))",
                            backgroundSize: "200% 200%",
                            animation: "gradient-shift 4s ease infinite",
                          }}
                        />
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-background">
                          <img
                            src="/images/profile.jpg"
                            alt="Edilberto A. Lima Jr."
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background" />
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <h2 className="font-display font-bold text-base text-foreground">
                          Edilberto A. Lima Jr.
                        </h2>
                        <p className="text-sm text-muted-foreground truncate">
                          {t?.sidebar?.title || "Analyst and Developer"}
                        </p>
                      </div>
                    </div>

                    {/* Social & Contact */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-1.5">
                        {socialLinks.map((link) => (
                          <Tooltip key={link.name}>
                            <TooltipTrigger asChild>
                              <motion.a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-lg bg-muted/50 hover:bg-aurora-purple/15 text-muted-foreground hover:text-aurora-purple transition-all"
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

                      <div className="flex gap-1.5">
                        {contactInfo.map((item, idx) => (
                          <Tooltip key={idx}>
                            <TooltipTrigger asChild>
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-lg bg-muted/50 hover:bg-aurora-cyan/15 text-muted-foreground hover:text-aurora-cyan transition-all"
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
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 overflow-y-auto p-3 scrollbar-thin">
                    <div className="px-2 mb-2">
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
                            transition={{ delay: 0.1 + index * 0.05 }}
                            onClick={() => setOpen(false)}
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
                                  layoutId="mobile-active"
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
                              className={`p-1.5 rounded-lg transition-colors ${
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

                  {/* Footer */}
                  <div className="shrink-0 p-3 border-t border-border/30">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 px-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs text-muted-foreground">
                          {language === "pt" ? "Disponível" : "Available"}
                        </span>
                      </div>

                      <div className="flex gap-1.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div whileTap={{ scale: 0.95 }}>
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
                            {language === "en" ? "Português" : "English"}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="h-9 w-9 rounded-lg bg-muted/50 hover:bg-aurora-purple/15 text-muted-foreground hover:text-aurora-purple transition-all"
                              >
                                {mounted && (
                                  theme === "dark" ? (
                                    <Sun className="h-4 w-4" />
                                  ) : (
                                    <Moon className="h-4 w-4" />
                                  )
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
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>
    </TooltipProvider>
  );
}
