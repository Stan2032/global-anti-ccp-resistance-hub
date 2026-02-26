import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  ThemeProvider,
  useTheme,
  ThemeToggle,
  THEMES,
} from '../contexts/ThemeContext';
import fs from 'fs';
import path from 'path';

// ─── Mock window.matchMedia for jsdom ────────────────────────
const mockMatchMedia = (matches = false) => {
  const listeners = [];
  return vi.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: (_event, handler) => listeners.push(handler),
    removeEventListener: (_event, handler) => {
      const idx = listeners.indexOf(handler);
      if (idx >= 0) listeners.splice(idx, 1);
    },
    dispatchEvent: vi.fn(),
  }));
};

// ─── WCAG 2.1 contrast ratio utilities ──────────────────────
function relativeLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const linearize = (c) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return (
    0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
  );
}

function contrastRatio(c1, c2) {
  let l1 = relativeLuminance(c1);
  let l2 = relativeLuminance(c2);
  if (l1 < l2) [l1, l2] = [l2, l1];
  return (l1 + 0.05) / (l2 + 0.05);
}

// ─── Helper: render inside ThemeProvider ─────────────────────

function ThemeConsumer() {
  const ctx = useTheme();
  return (
    <div>
      <span data-testid="theme">{ctx.theme}</span>
      <span data-testid="resolved">{ctx.resolvedTheme}</span>
      <span data-testid="isDark">{String(ctx.isDark)}</span>
      <span data-testid="isLight">{String(ctx.isLight)}</span>
      <span data-testid="isHighContrast">{String(ctx.isHighContrast)}</span>
      <span data-testid="configName">{ctx.themeConfig.name}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 1. THEME CONSTANTS
// ═══════════════════════════════════════════════════════════

describe('Theme constants', () => {
  it('exports exactly 4 theme identifiers', () => {
    expect(Object.keys(THEMES)).toHaveLength(4);
    expect(THEMES.DARK).toBe('dark');
    expect(THEMES.LIGHT).toBe('light');
    expect(THEMES.SYSTEM).toBe('system');
    expect(THEMES.HIGH_CONTRAST).toBe('high-contrast');
  });
});

// ═══════════════════════════════════════════════════════════
// 2. THEME PROVIDER BEHAVIOUR
// ═══════════════════════════════════════════════════════════

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    window.matchMedia = mockMatchMedia(true); // default: prefers dark
    document.documentElement.classList.remove(
      'theme-dark',
      'theme-light',
      'theme-high-contrast'
    );
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove(
      'theme-dark',
      'theme-light',
      'theme-high-contrast'
    );
  });

  it('defaults to dark theme when no localStorage value exists', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
    });
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(screen.getByTestId('isDark').textContent).toBe('true');
  });

  it('restores theme from localStorage', async () => {
    localStorage.setItem('resistance-hub-theme', 'light');
    await act(async () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
    });
    expect(screen.getByTestId('theme').textContent).toBe('light');
    expect(screen.getByTestId('isLight').textContent).toBe('true');
  });

  it('falls back to dark when localStorage contains invalid value', async () => {
    localStorage.setItem('resistance-hub-theme', 'neon-pink');
    await act(async () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
    });
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('persists theme to localStorage on change', async () => {
    function Setter() {
      const { setTheme } = useTheme();
      return (
        <button onClick={() => setTheme(THEMES.HIGH_CONTRAST)}>set-hc</button>
      );
    }

    await act(async () => {
      render(
        <ThemeProvider>
          <Setter />
        </ThemeProvider>
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('set-hc'));
    });

    expect(localStorage.getItem('resistance-hub-theme')).toBe('high-contrast');
  });

  it('applies theme-{name} class to document.documentElement', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
    });
    // Wait for microtask to resolve
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });
    expect(document.documentElement.classList.contains('theme-dark')).toBe(true);
  });

  it('provides correct themeConfig for each resolved theme', async () => {
    localStorage.setItem('resistance-hub-theme', 'high-contrast');
    await act(async () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
    });
    expect(screen.getByTestId('configName').textContent).toBe('High Contrast');
    expect(screen.getByTestId('isHighContrast').textContent).toBe('true');
  });
});

// ═══════════════════════════════════════════════════════════
// 3. THEME TOGGLE COMPONENT
// ═══════════════════════════════════════════════════════════

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    window.matchMedia = mockMatchMedia(true);
    document.documentElement.classList.remove(
      'theme-dark',
      'theme-light',
      'theme-high-contrast'
    );
  });

  it('renders a button with accessible label', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );
    });
    const btn = screen.getByRole('button');
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('aria-label')).toContain('theme');
  });

  it('cycles dark → light → high-contrast → dark', async () => {
    function CycleTest() {
      const { resolvedTheme } = useTheme();
      return (
        <>
          <ThemeToggle />
          <span data-testid="current">{resolvedTheme}</span>
        </>
      );
    }

    await act(async () => {
      render(
        <ThemeProvider>
          <CycleTest />
        </ThemeProvider>
      );
    });
    await act(async () => { await new Promise(r => setTimeout(r, 50)); });
    expect(screen.getByTestId('current').textContent).toBe('dark');

    // Click 1: dark → light
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    await act(async () => { await new Promise(r => setTimeout(r, 50)); });
    expect(screen.getByTestId('current').textContent).toBe('light');

    // Click 2: light → high-contrast
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    await act(async () => { await new Promise(r => setTimeout(r, 50)); });
    expect(screen.getByTestId('current').textContent).toBe('high-contrast');

    // Click 3: high-contrast → dark
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    await act(async () => { await new Promise(r => setTimeout(r, 50)); });
    expect(screen.getByTestId('current').textContent).toBe('dark');
  });
});

// ═══════════════════════════════════════════════════════════
// 4. useTheme HOOK — ERROR CASE
// ═══════════════════════════════════════════════════════════

describe('useTheme outside provider', () => {
  it('throws an error when used outside ThemeProvider', () => {
    function Bad() {
      useTheme();
      return null;
    }

    // Suppress React error boundary console output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Bad />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
    consoleSpy.mockRestore();
  });
});

// ═══════════════════════════════════════════════════════════
// 5. CSS THEME SYSTEM — CUSTOM PROPERTY DEFINITIONS
// ═══════════════════════════════════════════════════════════

describe('CSS Theme Variables (index.css)', () => {
  const cssFile = fs.readFileSync(
    path.resolve(__dirname, '../index.css'),
    'utf8'
  );

  // Required CSS custom properties that every theme must define
  const requiredVars = [
    '--th-bg-page',
    '--th-bg-surface',
    '--th-border',
    '--th-text-heading',
    '--th-text-body',
    '--th-text-base',
    '--th-accent',
    '--th-accent-hover',
    '--th-accent-dim',
    '--th-accent-cyan',
    '--th-focus',
  ];

  it(':root defines all required CSS custom properties (dark default)', () => {
    for (const v of requiredVars) {
      expect(cssFile, `Missing ${v} in :root`).toContain(v);
    }
  });

  it('.theme-light defines all required CSS custom properties', () => {
    // Extract the .theme-light block
    const lightBlock = cssFile.slice(
      cssFile.indexOf('.theme-light {'),
      cssFile.indexOf('}', cssFile.indexOf('.theme-light {')) + 1
    );
    for (const v of requiredVars) {
      expect(lightBlock, `Missing ${v} in .theme-light`).toContain(v);
    }
  });

  it('.theme-high-contrast defines all required CSS custom properties', () => {
    const hcBlock = cssFile.slice(
      cssFile.indexOf('.theme-high-contrast {'),
      cssFile.indexOf('}', cssFile.indexOf('.theme-high-contrast {')) + 1
    );
    for (const v of requiredVars) {
      expect(hcBlock, `Missing ${v} in .theme-high-contrast`).toContain(v);
    }
  });

  it('body uses var(--th-bg-page) and var(--th-text-base)', () => {
    expect(cssFile).toContain('var(--th-bg-page)');
    expect(cssFile).toContain('var(--th-text-base)');
  });

  it('headings use var(--th-text-heading)', () => {
    expect(cssFile).toContain('var(--th-text-heading)');
  });

  it('links use var(--th-accent) for color', () => {
    expect(cssFile).toContain('var(--th-accent)');
  });
});

// ═══════════════════════════════════════════════════════════
// 6. CSS THEME OVERRIDES — TAILWIND ARBITRARY CLASSES
// ═══════════════════════════════════════════════════════════

describe('CSS Tailwind Overrides', () => {
  const cssFile = fs.readFileSync(
    path.resolve(__dirname, '../index.css'),
    'utf8'
  );

  // Light theme must override these dark-mode Tailwind classes
  const lightOverrides = [
    '.theme-light .bg-\\[\\#0a0e14\\]',
    '.theme-light .bg-\\[\\#111820\\]',
    '.theme-light .border-\\[\\#1c2a35\\]',
    '.theme-light .text-\\[\\#4afa82\\]',
    '.theme-light .text-\\[\\#22d3ee\\]',
  ];

  // High-contrast must override these
  const hcOverrides = [
    '.theme-high-contrast .bg-\\[\\#0a0e14\\]',
    '.theme-high-contrast .bg-\\[\\#111820\\]',
    '.theme-high-contrast .border-\\[\\#1c2a35\\]',
    '.theme-high-contrast .text-\\[\\#4afa82\\]',
    '.theme-high-contrast .text-\\[\\#22d3ee\\]',
  ];

  lightOverrides.forEach((selector) => {
    it(`light theme overrides ${selector}`, () => {
      expect(cssFile).toContain(selector.replace(/\\\\/g, '\\'));
    });
  });

  hcOverrides.forEach((selector) => {
    it(`high-contrast theme overrides ${selector}`, () => {
      expect(cssFile).toContain(selector.replace(/\\\\/g, '\\'));
    });
  });

  it('dark-mode contrast overrides are scoped to :root:not(.theme-light):not(.theme-high-contrast)', () => {
    expect(cssFile).toContain(
      ':root:not(.theme-light):not(.theme-high-contrast)'
    );
  });
});

// ═══════════════════════════════════════════════════════════
// 7. WCAG AA CONTRAST — LIGHT AND HIGH-CONTRAST THEMES
//    (Dark theme already tested in Accessibility.test.jsx)
// ═══════════════════════════════════════════════════════════

describe('WCAG AA Contrast — Light Theme', () => {

  // Light theme backgrounds (from CSS vars)
  const LIGHT_BG = '#f8fafc';
  const LIGHT_SURFACE = '#ffffff';

  // Text colors remapped by .theme-light overrides (WCAG AA compliant)
  const lightTextColors = {
    'heading (#0f172a)': '#0f172a',
    'body (#334155)': '#334155',
    'base (#1e293b)': '#1e293b',
    'accent-green (#047857)': '#047857',
    'accent-cyan (#0e7490)': '#0e7490',
    'text-slate-300 remapped (#334155)': '#334155',
    'text-slate-400 remapped (#475569)': '#475569',
  };

  Object.entries(lightTextColors).forEach(([name, color]) => {
    it(`Light: ${name} passes WCAG AA (4.5:1) on page bg`, () => {
      const ratio = contrastRatio(color, LIGHT_BG);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it(`Light: ${name} passes WCAG AA (4.5:1) on surface bg`, () => {
      const ratio = contrastRatio(color, LIGHT_SURFACE);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });
});

describe('WCAG AA Contrast — High-Contrast Theme', () => {
  const HC_BG = '#000000';
  const HC_SURFACE = '#0a0a0a';

  const hcTextColors = {
    'white heading (#ffffff)': '#ffffff',
    'accent amber (#fbbf24)': '#fbbf24',
    'accent cyan (#67e8f9)': '#67e8f9',
    'yellow-300 (#fde68a)': '#fde68a',
  };

  Object.entries(hcTextColors).forEach(([name, color]) => {
    it(`HC: ${name} passes WCAG AA (4.5:1) on page bg`, () => {
      const ratio = contrastRatio(color, HC_BG);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it(`HC: ${name} passes WCAG AA (4.5:1) on surface bg`, () => {
      const ratio = contrastRatio(color, HC_SURFACE);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });
});
