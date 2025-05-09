"use client";

import { useEffect, useState } from "react";
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
  Globe,
  Moon,
  Sun,
  Languages,
  Home,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
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

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme toggle
  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Default navigation labels in case t.navigation is undefined
  const defaultNav = {
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    certifications: "Certifications",
    projects: "Projects",
    home: "Home",
  };

  // Use t.navigation if available, otherwise use default
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

  // Track which section is currently active
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

  return (
    <div className="w-[320px] fixed top-0 left-0 bottom-0 hidden lg:block backdrop-blur-xl bg-white/10 dark:bg-slate-800/80 shadow-xl z-40 border-r border-white/5">
      <div className="flex flex-col h-full">
        <div className="p-6 flex flex-col items-center text-center">
          {/* Minimalist profile container */}
          <div className="relative w-36 h-36 mb-6 group">
            {/* Main image container */}
            <div className="relative w-full h-full rounded-full overflow-hidden transition-transform duration-500 ease-out group-hover:scale-[1.02]">
              {/* The profile image */}
              <img
                src="/images/profile.jpg"
                alt="Edilberto A. Lima Jr."
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08] group-hover:rotate-1"
              />

              {/* Subtle inner shadow */}
              <div className="absolute inset-0 shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)] dark:shadow-[inset_0_2px_6px_rgba(0,0,0,0.3)]"></div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-[0_0_15px_5px_rgba(120,182,255,0.15)] dark:shadow-[0_0_15px_5px_rgba(120,182,255,0.2)]"></div>
            </div>

            {/* Floating decorative elements - subtle dots */}
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-400/40 dark:bg-blue-400/30 blur-[1px] opacity-0 group-hover:opacity-70 transition-all duration-700 group-hover:translate-x-1 group-hover:-translate-y-1"></div>
            <div className="absolute -bottom-1 -left-2 w-3 h-3 rounded-full bg-indigo-400/30 dark:bg-indigo-400/20 blur-[1px] opacity-0 group-hover:opacity-70 transition-all duration-700 group-hover:-translate-x-1 group-hover:translate-y-1"></div>

            {/* Subtle ambient light reflection */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/0 to-white/5 dark:to-white/3 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
          </div>

          <h1 className="text-xl font-bold text-white dark:text-white">
            Edilberto A. Lima Jr.
          </h1>
          <p className="text-white/70 dark:text-white/70 mb-3">
            {t?.sidebar?.title || "Analyst and Developer"}
          </p>

          <div className="flex gap-2">
            {socialLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                size="icon"
                className="icloud-btn text-white hover:bg-white/10 dark:hover:bg-slate-700/50"
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
            ))}
          </div>
        </div>

        <Separator className="bg-white/5 mt-2" />

        <div className="p-6 overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white/70 dark:text-white/70">
              <MapPin className="h-4 w-4 text-white/50 dark:text-white/50" />
              <span className="text-sm">Rio Branco, Brasil</span>
            </div>

            <div className="flex items-center gap-2 text-white/70 dark:text-white/70">
              <Phone className="h-4 w-4 text-white/50 dark:text-white/50" />
              <span className="text-sm">+55 68 99283-3888</span>
            </div>

            <div className="flex items-center gap-2 text-white/70 dark:text-white/70">
              <Mail className="h-4 w-4 text-white/50 dark:text-white/50" />
              <span className="text-sm">edlbrtojr@gmail.com</span>
            </div>
          </div>

          <Separator className="my-6 bg-white/5" />

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white/90 dark:text-white/90">
              {t?.sidebar?.navigation || "Navigation"}
            </h3>
            <div className="flex flex-col space-y-1">
              {sections.map((section) => (
                <a
                  key={section.name}
                  href={section.href}
                  className={`flex items-center gap-2 p-2 rounded-md transition-all duration-300 ${
                    activeSection === section.sectionId
                      ? "bg-white/10 dark:bg-slate-700/80 text-white font-medium backdrop-blur-lg"
                      : "text-white/70 hover:bg-white/5 hover:text-white/90 dark:text-white/70 dark:hover:bg-slate-700/50 dark:hover:text-white/90"
                  }`}
                >
                  <section.icon
                    className={`h-4 w-4 ${
                      activeSection === section.sectionId
                        ? "text-blue-300 scale-110 dark:text-blue-300"
                        : "text-white/70 group-hover:scale-110 transition-transform group-hover:text-white/90 dark:text-white/70"
                    }`}
                  />
                  <span>{section.name}</span>

                  {/* Progress indicator for active section */}
                  {activeSection === section.sectionId && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400/80 shadow-[0_0_5px_rgba(101,157,255,0.5)] dark:bg-blue-400/80 dark:shadow-[0_0_5px_rgba(101,157,255,0.5)]" />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 mt-auto">
          <div className="flex gap-2 justify-end">
            <TeachingBubble
              content="Click to switch between Portuguese and English"
              storageKey="language-tip-seen"
              side="top"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={toggleLanguage}
                title={
                  language === "en"
                    ? "Switch to Portuguese"
                    : "Switch to English"
                }
                className="icloud-btn text-white border-white/5 bg-white/10 dark:bg-slate-700/80 hover:bg-white/15 dark:hover:bg-slate-700/90"
              >
                <Languages className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </TeachingBubble>
            <TeachingBubble
              content="Click to switch between light and dark mode"
              storageKey="theme-tip-seen"
              side="top"
              delay={2000}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handleThemeToggle}
                title={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                className="icloud-btn text-white border-white/5 bg-white/10 dark:bg-slate-700/80 hover:bg-white/15 dark:hover:bg-slate-700/90"
              >
                {mounted && (
                  <>
                    {theme === "dark" ? (
                      <Sun className="h-[1.2rem] w-[1.2rem]" />
                    ) : (
                      <Moon className="h-[1.2rem] w-[1.2rem]" />
                    )}
                  </>
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </TeachingBubble>
          </div>
        </div>
      </div>
    </div>
  );
}
