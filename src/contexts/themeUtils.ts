/**
 * Theme utilities — context, constants, and hook for the theme system.
 *
 * @module themeUtils
 */
import React, { createContext, useContext } from 'react';

/** Colour class mappings for a theme. */
export interface ThemeColours {
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
  bg: string;
  bgSecondary: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
}

/** State exposed by the ThemeProvider. */
export interface ThemeState {
  /** Current theme identifier (from THEMES) */
  theme: string;
  /** Actual applied theme after resolving "system" */
  resolvedTheme: string;
  /** Set the current theme */
  setTheme: (theme: string) => void;
  /** Cycle to the next theme */
  toggleTheme: () => void;
  /** Theme colour class mappings */
  themeConfig: ThemeColours;
  /** Convenience flags */
  isDark: boolean;
  isLight: boolean;
  isHighContrast: boolean;
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
