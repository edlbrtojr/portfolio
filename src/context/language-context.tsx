"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { en } from "@/translations/en";
import { pt } from "@/translations/pt";
import type { Translation } from "@/types/translations";

type Language = "pt" | "en";

export type TranslationType = Translation;

export type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: TranslationType;
};

const defaultTranslations = pt;

const LanguageContext = createContext<LanguageContextType>({
  language: "pt",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: defaultTranslations,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt");
  const [mounted, setMounted] = useState(false);

  // Get the translations based on the current language
  const t = language === "en" ? en : pt;

  // Toggle between English and Portuguese
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "pt" : "en"));
  };

  // Load saved language preference from localStorage
  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "pt")) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("language", language);
    }
  }, [language, mounted]);

  const value = {
    language,
    setLanguage,
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
