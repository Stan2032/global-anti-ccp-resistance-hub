import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Import all language files
import en from '../locales/en.json';
import zhTW from '../locales/zh-TW.json';
import ug from '../locales/ug.json';
import bo from '../locales/bo.json';

// Language configurations
const languages = {
  en: {
    name: 'English',
    nativeName: 'English',
    code: 'en',
    dir: 'ltr',
    translations: en
  },
  'zh-TW': {
    name: 'Traditional Chinese',
    nativeName: '繁體中文',
    code: 'zh-TW',
    dir: 'ltr',
    translations: zhTW
  },
  ug: {
    name: 'Uyghur',
    nativeName: 'ئۇيغۇرچە',
    code: 'ug',
    dir: 'rtl',
    translations: ug
  },
  bo: {
    name: 'Tibetan',
    nativeName: 'བོད་སྐད།',
    code: 'bo',
    dir: 'ltr',
    translations: bo
  }
};

// Default language
const DEFAULT_LANGUAGE = 'en';
const STORAGE_KEY = 'resistance-hub-language';

// Create context
const LanguageContext = createContext(null);

// Helper function to get nested translation
const getNestedTranslation = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// Helper function to interpolate variables
const interpolate = (text, variables = {}) => {
  if (!text) return '';
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });
};

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Try to get saved language from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && languages[saved]) {
        return saved;
      }
      
      // Try to detect browser language
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang) {
        // Check for exact match
        if (languages[browserLang]) {
          return browserLang;
        }
        // Check for language code match (e.g., 'zh' for 'zh-TW')
        const langCode = browserLang.split('-')[0];
        const matchedLang = Object.keys(languages).find(key => key.startsWith(langCode));
        if (matchedLang) {
          return matchedLang;
        }
      }
    }
    return DEFAULT_LANGUAGE;
  });

  // Get current language config
  const language = languages[currentLanguage] || languages[DEFAULT_LANGUAGE];

  // Translation function
  const t = useCallback((key, variables = {}) => {
    const translation = getNestedTranslation(language.translations, key);
    
    if (!translation) {
      // Fallback to English
      const fallback = getNestedTranslation(languages[DEFAULT_LANGUAGE].translations, key);
      if (fallback) {
        return interpolate(fallback, variables);
      }
      // Return key if no translation found
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    
    return interpolate(translation, variables);
  }, [language.translations]);

  // Change language function
  const changeLanguage = useCallback((langCode) => {
    if (languages[langCode]) {
      setCurrentLanguage(langCode);
      localStorage.setItem(STORAGE_KEY, langCode);
      
      // Update document direction for RTL languages
      document.documentElement.dir = languages[langCode].dir;
      document.documentElement.lang = langCode;
    }
  }, []);

  // Set initial document attributes
  useEffect(() => {
    document.documentElement.dir = language.dir;
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage, language.dir]);

  const value = {
    // Current language info
    currentLanguage,
    language,
    languages,
    
    // Translation function
    t,
    
    // Language switching
    changeLanguage,
    
    // Helper to check if current language is RTL
    isRTL: language.dir === 'rtl',
    
    // Get all available languages
    availableLanguages: Object.entries(languages).map(([code, lang]) => ({
      code,
      name: lang.name,
      nativeName: lang.nativeName
    }))
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Custom hook for just the translation function
export function useTranslation() {
  const { t, currentLanguage, isRTL } = useLanguage();
  return { t, currentLanguage, isRTL };
}

export default LanguageContext;
