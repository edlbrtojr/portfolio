"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  Globe,
  Mail,
  MapPin,
  Phone,
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

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

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
    { name: "Portfolio", icon: Globe, href: "#" },
  ];

  return (
    <div className="lg:hidden sticky top-0 z-50 backdrop-blur-xl bg-white/3 border-b border-white/5 shadow-md dark:bg-white/3 dark:border-white/5">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {/* Small cloud effect for mobile */}
            <div className="profile-cloud-effect hidden sm:block absolute w-[140%] h-[140%] top-[-20%] left-[-20%] z-0"></div>
            <Avatar className="h-10 w-10 avatar-icloud relative z-10">
              <AvatarImage
                src="/images/profile.jpg"
                alt="Edilberto A. Lima Jr."
              />
              <AvatarFallback>EL</AvatarFallback>
            </Avatar>
          </div>
          <div className="relative z-10">
            <h1 className="font-bold text-sm text-white dark:text-white">
              Edilberto A. Lima Jr.
            </h1>
            <p className="text-xs text-white/60 dark:text-white/60">
              {t?.sidebar?.title || "Analyst and Developer"}
            </p>
          </div>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="icloud-btn text-white border-white/5 dark:text-white dark:border-white/5"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[350px] overflow-y-auto icloud-panel border-none"
          >
            <div className="flex flex-col h-full">
              <div className="flex flex-col items-center text-center p-4">
                <div className="profile-container">
                  {/* Cloud shape background effect */}
                  <div className="profile-cloud-effect"></div>

                  <Avatar className="h-20 w-20 mb-3 avatar-icloud relative z-10">
                    <AvatarImage
                      src="/images/profile.jpg"
                      alt="Edilberto A. Lima Jr."
                    />
                    <AvatarFallback className="text-xl">EL</AvatarFallback>
                  </Avatar>

                  <h1 className="text-lg font-bold text-white dark:text-white relative z-10">
                    Edilberto A. Lima Jr.
                  </h1>
                  <p className="text-sm text-white/60 dark:text-white/60 relative z-10">
                    {t?.sidebar?.title || "Analyst and Developer"}
                  </p>

                  <div className="flex gap-2 mt-3 relative z-10">
                    {socialLinks.map((link) => (
                      <Button
                        key={link.name}
                        variant="ghost"
                        size="icon"
                        asChild
                        className="icloud-btn text-white border-white/5 dark:text-white dark:border-white/5"
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
              </div>

              <Separator className="bg-white/5" />

              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-white/60">
                  <MapPin className="h-4 w-4 text-white/40" />
                  <span className="text-sm">Rio Branco, Acre, 69920-070</span>
                </div>

                <div className="flex items-center gap-2 text-white/60">
                  <Phone className="h-4 w-4 text-white/40" />
                  <span className="text-sm">+55 68 99283-3888</span>
                </div>

                <div className="flex items-center gap-2 text-white/60">
                  <Mail className="h-4 w-4 text-white/40" />
                  <span className="text-sm">edlbrtojr@gmail.com</span>
                </div>
              </div>

              <Separator className="bg-white/5" />

              <div className="p-4">
                <h3 className="text-sm font-medium mb-3 text-white/80">
                  {t?.sidebar?.navigation || "Navigation"}
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <a
                      key={section.name}
                      href={section.href}
                      className={`flex items-center gap-2 p-2 rounded-md transition-colors backdrop-blur-md ${
                        activeSection === section.sectionId
                          ? "bg-white/8 text-white font-medium"
                          : "text-white/60 hover:bg-white/5 hover:text-white/80"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <section.icon
                        className={`h-4 w-4 ${
                          activeSection === section.sectionId
                            ? "text-blue-300"
                            : "text-white/50"
                        }`}
                      />
                      <span>{section.name}</span>

                      {/* Progress indicator for active section */}
                      {activeSection === section.sectionId && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400/70 shadow-[0_0_5px_rgba(101,157,255,0.3)]" />
                      )}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="mt-auto p-4">
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
                      className="icloud-btn text-white border-white/5"
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
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      title={
                        theme === "dark"
                          ? "Switch to light mode"
                          : "Switch to dark mode"
                      }
                      className="icloud-btn text-white border-white/5"
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
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
