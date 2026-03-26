"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

const translations: Record<string, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.publications": "Publications",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "hero.greeting": "Hi, I'm",
    "hero.available": "Available for work",
    "hero.viewProjects": "View Projects",
    "hero.downloadCV": "Download CV",
    "about.title": "About",
    "about.me": "Me",
    "about.subtitle": "A passionate engineer at the intersection of signal theory and artificial intelligence",
    "projects.featured": "Featured",
    "projects.projects": "Projects",
    "projects.viewAll": "View all",
    "contact.getInTouch": "Get In",
    "contact.touch": "Touch",
    "footer.available": "Available for projects",
    "footer.getInTouch": "Get in touch",
    "footer.builtWith": "Built with",
    "footer.rights": "All rights reserved.",
    "common.backHome": "Back to home",
    "common.readMore": "Read more",
    "common.loading": "Loading...",
  },
};

type Locale = string;

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const t = useCallback(
    (key: string): string => {
      return translations[locale]?.[key] || translations.en?.[key] || key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}

export const availableLocales = Object.keys(translations);

/**
 * To add a new language:
 * 1. Add a new key to the `translations` object above (e.g. "fr")
 * 2. Copy all keys from "en" and translate the values
 * 3. The language will automatically appear in the locale selector
 */
