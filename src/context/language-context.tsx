"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { en } from "@/translations/en";
import { pt } from "@/translations/pt";
import type { Translation } from "@/types/translations";
import { getCookie, setCookie } from "@/lib/cookies";

type Language = "pt" | "en";

export type TranslationType = Translation;

export type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: TranslationType;
};

const defaultTranslations = pt;
const DEFAULT_LANGUAGE: Language = "pt";

const LanguageContext = createContext<LanguageContextType>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: defaultTranslations,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start with Portuguese as the default language
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [mounted, setMounted] = useState(false);

  // Get the translations based on the current language
  const t = language === "en" ? en : pt;

  // Toggle between English and Portuguese
  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLang = prev === "en" ? "pt" : "en";
      // Also update cookie when toggling
      if (typeof document !== "undefined") {
        setCookie("language", newLang, 365);
      }
      return newLang;
    });
  };

  // Custom language setter that also updates cookie
  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    if (typeof document !== "undefined") {
      setCookie("language", newLanguage, 365);
    }
  };

  // Load saved language preference from cookie or localStorage
  useEffect(() => {
    setMounted(true);
    // Only load preferences on client-side
    if (typeof window !== "undefined") {
      // First check cookie (set by middleware)
      const cookieLang = getCookie("language") as Language;
      if (cookieLang && (cookieLang === "en" || cookieLang === "pt")) {
        setLanguage(cookieLang);
      } else {
        // Fall back to localStorage if no cookie
        const savedLanguage = localStorage.getItem("language") as Language;
        if (
          savedLanguage &&
          (savedLanguage === "en" || savedLanguage === "pt")
        ) {
          setLanguage(savedLanguage);
          // Also set cookie for consistency
          setCookie("language", savedLanguage, 365);
        }
      }
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      localStorage.setItem("language", language);
      // Also update cookie
      setCookie("language", language, 365);
    }
  }, [language, mounted]);

  const value = {
    language,
    setLanguage: handleSetLanguage,
    toggleLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
