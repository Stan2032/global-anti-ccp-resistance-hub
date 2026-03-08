/**
 * Theme utilities — context, constants, and hook for the theme system.
 *
 * @module themeUtils
 */
import { createContext, useContext } from 'react';

/** @type {import('react').Context<ThemeState|null>} */
export const ThemeContext = createContext(null);

/**
 * Available theme identifiers.
 * @enum {string}
 */
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
  HIGH_CONTRAST: 'high-contrast'
};

/**
 * @typedef {Object} ThemeState
 * @property {string} theme - Current theme identifier (from THEMES)
 * @property {string} resolvedTheme - Actual applied theme after resolving "system"
 * @property {(theme: string) => void} setTheme - Set the current theme
 * @property {Object} colors - Theme color class mappings (bg, text, border, accent)
 */

/**
 * Hook to access theme state and controls.
 * Must be used inside a `<ThemeProvider>`.
 *
 * @returns {ThemeState} Theme state and setter
 * @throws {Error} If used outside of ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
