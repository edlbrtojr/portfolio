"use client";

import { useState, useEffect } from "react";
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
  Globe,
  Mail,
  MapPin,
  Phone,
  Home,
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
            <SheetHeader className="text-center pb-4">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full">
              <div className="flex flex-col items-center justify-center text-center p-4">
                {/* Minimalist profile container */}
                <div className="relative w-32 h-32 mb-5 group">
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
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-400/40 dark:bg-blue-400/30 blur-[1px] opacity-0 group-hover:opacity-70 transition-all duration-700 group-hover:translate-x-1 group-hover:-translate-y-1"></div>
                  <div className="absolute -bottom-1 -left-2 w-2 h-2 rounded-full bg-indigo-400/30 dark:bg-indigo-400/20 blur-[1px] opacity-0 group-hover:opacity-70 transition-all duration-700 group-hover:-translate-x-1 group-hover:translate-y-1"></div>

                  {/* Subtle ambient light reflection */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/0 to-white/5 dark:to-white/3 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
                </div>

                <h1 className="text-lg font-bold text-white dark:text-white relative z-10">
                  Edilberto A. Lima Jr.
                </h1>
                <p className="text-sm text-white/60 dark:text-white/60 relative z-10 mb-3">
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

              <Separator className="bg-white/5" />

              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-white/60">
                  <MapPin className="h-4 w-4 text-white/40" />
                  <span className="text-sm">Rio Branco, Acre, Brasil</span>
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
                <h3 className="text-sm font-medium mb-3 text-white/80 text-center">
                  {t?.sidebar?.navigation || "Navigation"}
                </h3>
                <nav className="space-y-2 flex flex-col items-center">
                  {sections.map((section) => (
                    <a
                      key={section.name}
                      href={section.href}
                      className={`flex items-center gap-2 p-2 rounded-md transition-colors backdrop-blur-md w-full justify-center ${
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
                        <span className="ml-2 w-1.5 h-1.5 rounded-full bg-blue-400/70 shadow-[0_0_5px_rgba(101,157,255,0.3)]" />
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
