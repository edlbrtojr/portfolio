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
  X,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useActiveSection } from "@/hooks/use-active-section";
import { TeachingBubble } from "@/components/ui/teaching-bubble";

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
    { icon: MapPin, text: "Rio Branco, Acre, Brasil" },
    { icon: Phone, text: "+55 68 99283-3888" },
    { icon: Mail, text: "edlbrtojr@gmail.com" },
  ];

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="lg:hidden sticky top-0 z-50"
    >
      {/* Glass header bar */}
      <div className="aurora-glass rounded-none border-x-0 border-t-0">
        {/* Gradient accent line */}
        <div className="h-0.5 bg-gradient-to-r from-aurora-purple via-aurora-cyan to-aurora-magenta" />
        
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {/* Avatar with ring */}
            <div className="relative">
              <div
                className="absolute -inset-0.5 rounded-full opacity-75"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--aurora-1)), hsl(var(--aurora-3)))",
                  padding: "2px",
                }}
              >
                <div className="w-full h-full rounded-full bg-background" />
              </div>
              <Avatar className="h-10 w-10 relative">
                <AvatarImage
                  src="/images/profile.jpg"
                  alt="Edilberto A. Lima Jr."
                />
                <AvatarFallback className="bg-aurora-purple/20 text-aurora-purple font-display">
                  EL
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div>
              <h1 className="font-display font-bold text-sm text-foreground">
                Edilberto A. Lima Jr.
              </h1>
              <p className="text-xs text-muted-foreground">
                {t?.sidebar?.title || "Analyst and Developer"}
              </p>
            </div>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="aurora-btn rounded-xl"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] sm:w-[380px] aurora-glass border-l border-border/50 p-0"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col h-full">
                {/* Profile section */}
                <div className="p-6 flex flex-col items-center text-center border-b border-border/50">
                  {/* Animated avatar */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="relative mb-4 group"
                  >
                    <div
                      className="absolute -inset-1 rounded-full opacity-75 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background:
                          "linear-gradient(135deg, hsl(var(--aurora-1)), hsl(var(--aurora-3)), hsl(var(--aurora-2)))",
                        backgroundSize: "200% 200%",
                        animation: "gradient-shift 3s ease infinite",
                        padding: "3px",
                      }}
                    >
                      <div className="w-full h-full rounded-full bg-background" />
                    </div>
                    <div className="relative w-28 h-28 rounded-full overflow-hidden">
                      <img
                        src="/images/profile.jpg"
                        alt="Edilberto A. Lima Jr."
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Status dot */}
                    <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background" />
                  </motion.div>

                  <motion.h1
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-lg font-display font-bold text-foreground"
                  >
                    Edilberto A. Lima Jr.
                  </motion.h1>
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-sm text-muted-foreground mb-4"
                  >
                    {t?.sidebar?.title || "Analyst and Developer"}
                  </motion.p>

                  {/* Social links */}
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="flex gap-2"
                  >
                    {socialLinks.map((link) => (
                      <motion.div
                        key={link.name}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="aurora-btn rounded-xl hover:bg-aurora-purple/20"
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

                {/* Contact info */}
                <div className="p-4 border-b border-border/50">
                  {contactInfo.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                      className="flex items-center gap-3 py-2 text-muted-foreground"
                    >
                      <div className="p-1.5 rounded-lg bg-aurora-purple/10">
                        <item.icon className="h-3.5 w-3.5 text-aurora-purple" />
                      </div>
                      <span className="text-sm">{item.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-auto p-4">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    {t?.sidebar?.navigation || "Navigation"}
                  </h3>
                  <nav className="space-y-1">
                    {sections.map((section, index) => {
                      const isActive = activeSection === section.sectionId;
                      return (
                        <motion.a
                          key={section.name}
                          href={section.href}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.6 + index * 0.08, duration: 0.4 }}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative ${
                            isActive
                              ? "bg-aurora-purple/15 text-foreground"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                        >
                          {/* Active indicator */}
                          {isActive && (
                            <motion.div
                              layoutId="mobileActiveIndicator"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-gradient-to-b from-aurora-purple to-aurora-cyan"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}

                          <div
                            className={`p-1.5 rounded-lg transition-all duration-300 ${
                              isActive
                                ? "bg-aurora-purple/20"
                                : "bg-muted/50"
                            }`}
                          >
                            <section.icon
                              className={`h-4 w-4 ${
                                isActive
                                  ? "text-aurora-purple"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <span className="font-medium text-sm">{section.name}</span>

                          {isActive && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-aurora-purple animate-glow-pulse" />
                          )}
                        </motion.a>
                      );
                    })}
                  </nav>
                </div>

                {/* Footer actions */}
                <div className="p-4 border-t border-border/50">
                  <div className="flex gap-2 justify-center">
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
                          onClick={() =>
                            setTheme(theme === "dark" ? "light" : "dark")
                          }
                          title={
                            theme === "dark"
                              ? "Switch to light mode"
                              : "Switch to dark mode"
                          }
                          className="aurora-btn rounded-xl border-border/50 hover:border-aurora-purple/50 hover:bg-aurora-purple/10"
                        >
                          {mounted && (
                            <motion.div
                              initial={false}
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
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.div>
  );
}
