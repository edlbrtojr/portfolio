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
  };

  // Use t.navigation if available, otherwise use default
  const nav = t?.navigation || defaultNav;

  const sections: NavItem[] = [
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
          {/* Circular profile container with simplified smooth depth effect */}
          <div className="profile-container relative w-[180px] h-[180px] mb-6">
            {/* Outer circle with uniform gradient to create smooth depth */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-100/20 to-indigo-100/5 dark:from-slate-700/40 dark:to-slate-800/20 
                shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] overflow-hidden border border-white/10 dark:border-white/5"
            >
              {/* Gradient overlay to create the impression of depth */}
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20 dark:to-black/30"></div>

              {/* Subtle inner light at top to create realistic lighting */}
              <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent opacity-50 dark:opacity-20"></div>
            </div>

            {/* Cavity effect - a single deeper inset circle */}
            <div
              className="absolute top-1/2 left-1/2 w-[140px] h-[140px] transform -translate-x-1/2 -translate-y-1/2 rounded-full
                shadow-[inset_0_8px_20px_5px_rgba(0,0,0,0.35),inset_0_-4px_8px_rgba(255,255,255,0.1),0_-1px_2px_rgba(255,255,255,0.1)] 
                dark:shadow-[inset_0_8px_25px_5px_rgba(0,0,0,0.5),inset_0_-4px_8px_rgba(255,255,255,0.05),0_-1px_2px_rgba(255,255,255,0.05)]"
            >
              {/* Image container */}
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <img
                  src="/images/profile.jpg"
                  alt="Edilberto A. Lima Jr."
                  className="w-full h-full object-cover"
                />

                {/* Subtle overlay to integrate image with depth effect */}
                <div className="absolute inset-0 shadow-[inset_0_6px_12px_rgba(0,0,0,0.4),inset_0_-3px_6px_rgba(0,0,0,0.3)]"></div>
              </div>
            </div>
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
              <span className="text-sm">Rio Branco, Acre</span>
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
