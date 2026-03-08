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

  // Translation function — checks inline translations first, then locale JSON files
  const t = (key: string): string => {
    const keys = key.split('.');
    // 1. Try inline translations for current language
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    // 2. If not found inline, try locale JSON file
    if (!value && translations[language]?.localeData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let localeValue: any = translations[language].localeData;
      for (const k of keys) {
        localeValue = localeValue?.[k];
      }
      value = localeValue;
    }
    // 3. Skip volunteer-needed markers — fall back to English
    if (value === '__VOLUNTEER_TRANSLATION_NEEDED__') {
      value = null;
    }
    // 4. Fall back to English inline, then English locale file
    if (!value) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let enValue: any = translations.en;
      for (const k of keys) {
        enValue = enValue?.[k];
      }
      value = enValue;
    }
    if (!value && enTranslations) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let enLocale: any = enTranslations;
      for (const k of keys) {
        enLocale = enLocale?.[k];
      }
      value = enLocale;
    }
    return value || key;
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
