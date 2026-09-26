import { useDeferredValue, useEffect, useMemo, ReactNode } from 'react';
import { translations, LanguageContext } from './languageUtils';
import enTranslations from '../locales/en.json';
import { useStoredString } from '../utils/ssr';

/**
 * LanguageProvider — wraps the app tree with i18n translation context.
 *
 * Remembers an explicit language choice in localStorage.
 * Sets document direction (LTR/RTL) based on selected language.
 * Provides a `t(key)` function for dot-path translations with English fallback.
 */
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Hydrates in English, like the pre-rendered HTML, then applies the
  // reader's saved choice. Nothing is stored until the reader picks one, and
  // blocked storage cannot take the app down from here.
  const [savedLanguage, setLanguage] = useStoredString('language', 'en');
  // Deferred, like the theme (see ThemeProvider): applied at once, a saved
  // language made React throw away every page still waiting for its code
  // and show the loading screen until the code arrived.
  const shownLanguage = useDeferredValue(savedLanguage);
  const language = translations[shownLanguage] ? shownLanguage : 'en';

  useEffect(() => {
    // Set RTL if needed
    if (translations[language]?.rtl) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  // The same object until the language changes: a new one on every render
  // would reach the pages just as a new language does.
  const value = useMemo(() => {
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

    return {
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
    };
  }, [language, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
