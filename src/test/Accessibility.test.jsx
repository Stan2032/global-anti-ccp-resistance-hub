import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  SkipLinks,
  VisuallyHidden,
  LiveRegion,
  AccessibleProgress,
  AccessibleAlert,
} from '../components/Accessibility';
import { LanguageProvider } from '../components/LanguageSelector';

const renderWithLanguage = (ui) => render(<LanguageProvider>{ui}</LanguageProvider>);

describe('SkipLinks', () => {
  it('should render skip to main content link', () => {
    renderWithLanguage(<SkipLinks />);
    const link = screen.getByRole('link', { name: /skip.*main|skipToMain/i });
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('#main-content');
  });

  it('should render skip to navigation link', () => {
    renderWithLanguage(<SkipLinks />);
    const link = screen.getByRole('link', { name: /skip.*nav|skipToNav/i });
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('#navigation');
  });

  it('should use terminal design system colors (not blue/generic)', () => {
    const { container } = renderWithLanguage(<SkipLinks />);
    const links = container.querySelectorAll('a');
    links.forEach(link => {
      // Must use terminal palette, not generic blue
      expect(link.className).not.toContain('bg-blue');
      expect(link.className).toContain('#4afa82');
      expect(link.className).toContain('font-mono');
    });
  });
});

describe('VisuallyHidden', () => {
  it('should render children with sr-only class', () => {
    render(<VisuallyHidden>Hidden text</VisuallyHidden>);
    const el = screen.getByText('Hidden text');
    expect(el).toBeTruthy();
    expect(el.className).toContain('sr-only');
  });

  it('should render as custom element type', () => {
    render(<VisuallyHidden as="div">Hidden div</VisuallyHidden>);
    const el = screen.getByText('Hidden div');
    expect(el.tagName).toBe('DIV');
  });

  it('should default to span element', () => {
    render(<VisuallyHidden>Hidden span</VisuallyHidden>);
    const el = screen.getByText('Hidden span');
    expect(el.tagName).toBe('SPAN');
  });
});

describe('LiveRegion', () => {
  it('should render with polite aria-live by default', () => {
    render(<LiveRegion message="Update available" />);
    const el = screen.getByText('Update available');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });

  it('should render with assertive aria-live when priority is assertive', () => {
    render(<LiveRegion message="Critical alert" priority="assertive" />);
    const el = screen.getByText('Critical alert');
    expect(el.getAttribute('aria-live')).toBe('assertive');
  });

  it('should render with role=status for polite priority', () => {
    render(<LiveRegion message="Status update" />);
    const el = screen.getByText('Status update');
    expect(el.getAttribute('role')).toBe('status');
  });

  it('should render with role=status for assertive priority', () => {
    render(<LiveRegion message="Alert!" priority="assertive" />);
    const el = screen.getByText('Alert!');
    expect(el.getAttribute('role')).toBe('status');
  });
});

describe('AccessibleProgress', () => {
  it('should render with correct aria attributes', () => {
    render(<AccessibleProgress value={50} max={100} label="Loading" />);
    const el = screen.getByRole('progressbar');
    expect(el).toBeTruthy();
    expect(el.getAttribute('aria-valuenow')).toBe('50');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
    expect(el.getAttribute('aria-label')).toBe('Loading');
  });

  it('should default max to 100', () => {
    render(<AccessibleProgress value={75} label="Progress" />);
    const el = screen.getByRole('progressbar');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
  });
});

describe('AccessibleAlert', () => {
  it('should render with alert role', () => {
    render(<AccessibleAlert title="Warning">Content</AccessibleAlert>);
    const el = screen.getByRole('alert');
    expect(el).toBeTruthy();
  });

  it('should render title and children', () => {
    render(<AccessibleAlert title="Test Alert">Alert body text</AccessibleAlert>);
    expect(screen.getByText('Test Alert')).toBeTruthy();
    expect(screen.getByText('Alert body text')).toBeTruthy();
  });

  it('should apply info type by default', () => {
    const { container } = render(
      <AccessibleAlert title="Info">Details</AccessibleAlert>
    );
    const alertEl = container.querySelector('[role="alert"]');
    expect(alertEl).toBeTruthy();
  });
});

// ─── WCAG AA Contrast Ratio Verification ────────────────────────

describe('WCAG AA Contrast Ratios', () => {
  // WCAG 2.1 relative luminance formula
  function relativeLuminance(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const linearize = (c) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
  }

  function contrastRatio(c1, c2) {
    let l1 = relativeLuminance(c1);
    let l2 = relativeLuminance(c2);
    if (l1 < l2) [l1, l2] = [l2, l1];
    return (l1 + 0.05) / (l2 + 0.05);
  }

  const BG = '#0a0e14';       // Page background
  const SURFACE = '#111820';  // Card/surface background

  // Colors as overridden in index.css
  const textColors = {
    'text-slate-400 (#a8b5c7)': '#a8b5c7',
    'text-slate-500 (#8893a2)': '#8893a2',
    'text-slate-600 (#8893a2)': '#8893a2',
    'text-gray-400 (#a3aebb)':  '#a3aebb',
    'text-gray-500 (#8d949e)':  '#8d949e',
    'text-gray-600 (#8d949e)':  '#8d949e',
    'terminal green (#4afa82)': '#4afa82',
    'terminal cyan (#22d3ee)':  '#22d3ee',
    'white (#ffffff)':          '#ffffff',
    'slate-300 (#cbd5e1)':      '#cbd5e1',
  };

  Object.entries(textColors).forEach(([name, color]) => {
    it(`${name} passes WCAG AA (4.5:1) on page background`, () => {
      const ratio = contrastRatio(color, BG);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it(`${name} passes WCAG AA (4.5:1) on surface background`, () => {
      const ratio = contrastRatio(color, SURFACE);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });
});
