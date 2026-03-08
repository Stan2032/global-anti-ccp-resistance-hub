/**
 * Theme utilities — context, constants, and hook for the theme system.
 *
 * @module themeUtils
 */
import { createContext, useContext } from 'react';

/** Colour class mappings for a theme. */
export interface ThemeColours {
  bg: string;
  text: string;
  border: string;
  accent: string;
  [key: string]: string;
}

/** State exposed by the ThemeProvider. */
export interface ThemeState {
  /** Current theme identifier (from THEMES) */
  theme: string;
  /** Actual applied theme after resolving "system" */
  resolvedTheme: string;
  /** Set the current theme */
  setTheme: (theme: string) => void;
  /** Theme colour class mappings (bg, text, border, accent) */
  colors: ThemeColours;
}

export const ThemeContext = createContext<ThemeState | null>(null);

/** Available theme identifiers. */
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
  HIGH_CONTRAST: 'high-contrast',
} as const;

/**
 * Hook to access theme state and controls.
 * Must be used inside a `<ThemeProvider>`.
 */
export const useTheme = (): ThemeState => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
