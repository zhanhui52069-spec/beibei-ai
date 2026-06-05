"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { dictionaries, type Locale } from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof dictionaries)[Locale];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const savedLocale = window.localStorage.getItem("nexusai_locale");

    if (savedLocale === "en" || savedLocale === "zh") {
      setLocale(savedLocale);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("nexusai_locale", locale);
    document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: dictionaries[locale],
    }),
    [locale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
