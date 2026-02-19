import React, { createContext, useContext, useState, useEffect } from 'react';
import { Moon, Sun, Monitor, Contrast } from 'lucide-react';

const ThemeContext = createContext(null);

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
  HIGH_CONTRAST: 'high-contrast'
};

// Theme color configurations
const themeColors = {
  dark: {
    name: 'Dark Mode',
    Icon: Moon,
    bg: 'bg-slate-900',
    bgSecondary: 'bg-slate-800',
    text: 'text-white',
    textSecondary: 'text-slate-400',
    border: 'border-slate-700',
    accent: 'bg-blue-600',
  },
  light: {
    name: 'Light Mode',
    Icon: Sun,
    bg: 'bg-gray-50',
    bgSecondary: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    accent: 'bg-blue-500',
  },
  'high-contrast': {
    name: 'High Contrast',
    Icon: Contrast,
    bg: 'bg-black',
    bgSecondary: 'bg-gray-900',
    text: 'text-white',
    textSecondary: 'text-yellow-300',
    border: 'border-yellow-400',
    accent: 'bg-yellow-500',
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('resistance-hub-theme');
    if (saved && Object.values(THEMES).includes(saved)) {
      return saved;
    }
    // Default to dark (the original design)
    return THEMES.DARK;
  });

  const [resolvedTheme, setResolvedTheme] = useState(THEMES.DARK);

  // Handle system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (theme === THEMES.SYSTEM) {
        setResolvedTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      }
    };

    // Set initial resolved theme
    if (theme === THEMES.SYSTEM) {
      setResolvedTheme(mediaQuery.matches ? THEMES.DARK : THEMES.LIGHT);
    } else {
      setResolvedTheme(theme);
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Persist theme to localStorage
  useEffect(() => {
    localStorage.setItem('resistance-hub-theme', theme);
  }, [theme]);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-dark', 'theme-light', 'theme-high-contrast');
    
    // Add current theme class
    root.classList.add(`theme-${resolvedTheme}`);
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const colors = {
        dark: '#0f172a',
        light: '#f9fafb',
        'high-contrast': '#000000'
      };
      metaThemeColor.setAttribute('content', colors[resolvedTheme] || colors.dark);
    }
  }, [resolvedTheme]);

  const toggleTheme = () => {
    const themes = [THEMES.DARK, THEMES.LIGHT, THEMES.HIGH_CONTRAST];
    const currentIndex = themes.indexOf(resolvedTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const value = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    themeConfig: themeColors[resolvedTheme] || themeColors.dark,
    isDark: resolvedTheme === THEMES.DARK,
    isLight: resolvedTheme === THEMES.LIGHT,
    isHighContrast: resolvedTheme === THEMES.HIGH_CONTRAST,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Toggle Button Component
export const ThemeToggle = ({ className = '' }) => {
  const { resolvedTheme, toggleTheme, themeConfig } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      aria-label={`Current theme: ${themeConfig.name}. Click to change theme.`}
      title={`Theme: ${themeConfig.name}`}
    >
      <span className="text-lg" aria-hidden="true">
        {themeConfig.Icon ? <themeConfig.Icon className="w-4 h-4" /> : themeConfig.icon}
      </span>
    </button>
  );
};

// Theme Selector Dropdown Component
export const ThemeSelector = ({ className = '' }) => {
  const { theme, setTheme, themeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: THEMES.DARK, name: 'Dark Mode', Icon: Moon },
    { id: THEMES.LIGHT, name: 'Light Mode', Icon: Sun },
    { id: THEMES.HIGH_CONTRAST, name: 'High Contrast', Icon: Contrast },
    { id: THEMES.SYSTEM, name: 'System Default', Icon: Monitor },
  ];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span aria-hidden="true">{themeConfig.icon}</span>
        <span className="text-sm text-slate-300">{themeConfig.name}</span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <ul
            role="listbox"
            className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden"
          >
            {themes.map((t) => (
              <li key={t.id}>
                <button
                  role="option"
                  aria-selected={theme === t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                    theme === t.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span aria-hidden="true">{t.Icon ? <t.Icon className="w-4 h-4" /> : t.icon}</span>
                  <span className="text-sm">{t.name}</span>
                  {theme === t.id && (
                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ThemeContext;
