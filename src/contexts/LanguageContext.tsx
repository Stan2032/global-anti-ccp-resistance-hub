import { useState, useEffect, ReactNode } from 'react';
import { translations, LanguageContext } from './languageUtils';
import enTranslations from '../locales/en.json';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage for saved preference
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    // Set RTL if needed
    if (translations[language]?.rtl) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  // Helper to traverse a nested object by dot-separated keys
  const resolve = (obj: Record<string, unknown>, keys: string[]): unknown => {
    let current: unknown = obj;
    for (const k of keys) {
      current = (current as Record<string, unknown>)?.[k];
    }
    return current;
  };

  // Translation function — checks inline translations first, then locale JSON files
  const t = (key: string): string => {
    const keys = key.split('.');
    // 1. Try inline translations for current language
    let value: unknown = resolve(translations[language] as unknown as Record<string, unknown>, keys);
    // 2. If not found inline, try locale JSON file
    if (!value && translations[language]?.localeData) {
      value = resolve(translations[language].localeData, keys);
    }
    // 3. Skip volunteer-needed markers — fall back to English
    if (value === '__VOLUNTEER_TRANSLATION_NEEDED__') {
      value = null;
    }
    // 4. Fall back to English inline, then English locale file
    if (!value) {
      value = resolve(translations.en as unknown as Record<string, unknown>, keys);
    }
    if (!value && enTranslations) {
      value = resolve(enTranslations as Record<string, unknown>, keys);
    }
    return (value as string) || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      translations: translations[language] || translations.en,
      availableLanguages: Object.keys(translations).map(code => ({
        code,
        name: translations[code].name,
        flag: translations[code].flag,
        FlagIcon: translations[code].FlagIcon
      }))
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
