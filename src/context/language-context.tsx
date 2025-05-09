"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { en } from "@/translations/en";
import { pt } from "@/translations/pt";

type Language = "pt" | "en";

// Define translation type based on the English translations structure
export type TranslationType = typeof en;

export type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: TranslationType;
};

const defaultTranslations = en;

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: defaultTranslations,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
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
