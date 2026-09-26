import React, { useState, useEffect, useDeferredValue, useMemo, useSyncExternalStore, ReactNode } from 'react';
import { Moon, Sun, Monitor, Contrast } from 'lucide-react';
import { ThemeContext, THEMES, useTheme, type ThemeState } from './themeUtils';
import { matchesMediaQuery, useStoredString } from '../utils/ssr';

interface ThemeColorConfig {
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
  bg: string;
  bgSecondary: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
}

// Theme color configurations
const themeColors: Record<string, ThemeColorConfig> = {
  dark: {
    name: 'Dark Mode',
    Icon: Moon,
    bg: 'bg-[#0a0e14]',
    bgSecondary: 'bg-[#111820]',
    text: 'text-white',
    textSecondary: 'text-slate-400',
    border: 'border-[#1c2a35]',
    accent: 'bg-[#4afa82]',
  },
  light: {
    name: 'Light Mode',
    Icon: Sun,
    bg: 'bg-gray-50',
    bgSecondary: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    accent: 'bg-[#22d3ee]',  // CSS overrides remap in .theme-light
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

const THEME_IDS: readonly string[] = Object.values(THEMES);

/** Follow the system colour scheme; pre-rendered HTML assumes dark. */
function subscribeToColourScheme(notify: () => void): () => void {
  if (typeof window.matchMedia !== 'function') return () => {};
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
}
const systemPrefersDark = () => matchesMediaQuery('(prefers-color-scheme: dark)', true);
const serverPrefersDark = () => true;

/**
 * ThemeProvider — wraps the app tree with theme context.
 *
 * Manages dark/light/high-contrast/system themes. Remembers an explicit
 * choice in localStorage, follows the system preference for "system", and
 * sets the active theme class on `document.documentElement`.
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Hydrates as dark, like the pre-rendered HTML, then applies the reader's
  // saved choice. Nothing is stored until the reader picks a theme.
  const [savedTheme, setTheme] = useStoredString('resistance-hub-theme', THEMES.DARK);
  // A saved choice arrives in a re-render straight after hydration, which
  // React runs at once. Deferred, it reaches the pages in a background
  // render instead, which React holds until each page's code has loaded.
  // Applied at once, it made React throw away every page still waiting for
  // its code and show the loading screen until the code arrived.
  const shownTheme = useDeferredValue(savedTheme);
  const theme = THEME_IDS.includes(shownTheme) ? shownTheme : THEMES.DARK;
  // Only the "system" theme follows the reader's colour scheme, so only it
  // reads one. Reading it for every theme put the client at odds with the
  // pre-rendered HTML (which assumes dark) for every reader whose system is
  // light: the re-render after hydration reached each page before its code
  // had loaded, and React replaced the page with its loading screen.
  const prefersDark = useSyncExternalStore(
    subscribeToColourScheme,
    theme === THEMES.SYSTEM ? systemPrefersDark : serverPrefersDark,
    serverPrefersDark,
  );
  const resolvedTheme: string = theme === THEMES.SYSTEM
    ? (prefersDark ? THEMES.DARK : THEMES.LIGHT)
    : theme;

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
      const colors: Record<string, string> = {
        dark: '#0f172a',
        light: '#f9fafb',
        'high-contrast': '#000000'
      };
      metaThemeColor.setAttribute('content', colors[resolvedTheme] || colors.dark);
    }
  }, [resolvedTheme]);

  // The same object until the theme itself changes: a new one on every
  // render would reach the pages just as a new theme does.
  const value = useMemo<ThemeState>(() => ({
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme: () => {
      const themes = [THEMES.DARK, THEMES.LIGHT, THEMES.HIGH_CONTRAST] as string[];
      const currentIndex = themes.indexOf(resolvedTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      setTheme(themes[nextIndex]);
    },
    themeConfig: themeColors[resolvedTheme] || themeColors.dark,
    isDark: resolvedTheme === THEMES.DARK,
    isLight: resolvedTheme === THEMES.LIGHT,
    isHighContrast: resolvedTheme === THEMES.HIGH_CONTRAST,
  }), [theme, resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * ThemeToggle — compact button that cycles through dark → light → high-contrast.
 *
 * Displays the current theme's icon and provides an accessible label.
 */
export const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const { toggleTheme, themeConfig } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 transition-colors hover:bg-[#1c2a35] focus:outline-none focus:ring-2 focus:ring-[#4afa82] ${className}`}
      aria-label={`Current theme: ${themeConfig.name}. Click to change theme.`}
      title={`Theme: ${themeConfig.name}`}
    >
      <span className="text-lg" aria-hidden="true">
        {themeConfig.Icon && <themeConfig.Icon className="w-4 h-4" />}
      </span>
    </button>
  );
};

/**
 * ThemeSelector — dropdown menu for explicit theme selection.
 *
 * Shows all 4 options (Dark, Light, High Contrast, System Default)
 * with icons and a checkmark on the active theme.
 */
export const ThemeSelector = ({ className = '' }: { className?: string }) => {
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
        className="flex items-center space-x-2 px-3 py-2 bg-[#111820] hover:bg-[#1c2a35] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4afa82]"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span aria-hidden="true">{themeConfig.Icon && <themeConfig.Icon className="w-4 h-4" />}</span>
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
            className="absolute right-0 mt-2 w-48 bg-[#111820] border border-[#1c2a35] shadow-lg z-50 overflow-hidden"
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
                      ? 'bg-[#4afa82]/20 text-[#4afa82]'
                      : 'text-slate-300 hover:bg-[#1c2a35]'
                  }`}
                >
                  <span aria-hidden="true"><t.Icon className="w-4 h-4" /></span>
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
