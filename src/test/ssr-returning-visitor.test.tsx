/**
 * A returning reader arrives with state saved from an earlier visit. The
 * pre-rendered HTML was built without it, so hydration must render exactly
 * that HTML first and apply the saved state afterwards. Reading storage
 * during the first client render makes React discard the page and render it
 * again from scratch (error #418).
 *
 * Each case renders the HTML with empty storage, as the build does, then
 * seeds storage and hydrates, as the reader's browser does.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import React, { act, type ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot, type Root } from 'react-dom/client';
import SafetyChecklist from '../components/SafetyChecklist';
import EmergencyAlerts from '../components/EmergencyAlerts';
import MemorialWall from '../components/MemorialWall';
import NotificationCenter from '../components/NotificationCenter';
import { ThemeProvider, ThemeToggle } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { useLanguage } from '../contexts/languageUtils';
import alertsData from '../data/emergency_alerts.json';

function ShowLanguage() {
  return <span data-testid="language">{useLanguage().language}</span>;
}

let root: Root | null = null;
let container: HTMLElement | null = null;

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
  localStorage.clear();
  document.documentElement.className = '';
  document.documentElement.dir = '';
  vi.restoreAllMocks();
});

async function hydrateAsReturningVisitor(element: ReactElement, saved: Record<string, string>) {
  localStorage.clear();
  const html = renderToString(element);
  for (const [key, value] of Object.entries(saved)) localStorage.setItem(key, value);

  container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);

  const recoverable: unknown[] = [];
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  await act(async () => {
    root = hydrateRoot(container!, element, { onRecoverableError: e => recoverable.push(e) });
  });
  const hydrationWarnings = consoleError.mock.calls
    .map(args => args.map(String).join(' '))
    .filter(text => /hydrat|did not match|didn't match/i.test(text));
  return { html, recoverable, hydrationWarnings, container };
}

describe('returning visitors hydrate without a mismatch', () => {
  it('SafetyChecklist with saved progress', async () => {
    const { html, recoverable, hydrationWarnings, container } =
      await hydrateAsReturningVisitor(<SafetyChecklist />, { safetyChecklist: JSON.stringify(['d1', 'd2', 'd3']) });
    expect(recoverable).toEqual([]);
    expect(hydrationWarnings).toEqual([]);
    // The HTML was built unchecked; the reader's ticks appear after hydration.
    expect(html).not.toContain('✓');
    expect(container.textContent).toContain('✓');
  });

  it('EmergencyAlerts with a dismissed alert', async () => {
    // Dismiss an alert the HTML actually shows (which ones are active depends
    // on today's date).
    localStorage.clear();
    const fresh = renderToString(<EmergencyAlerts />);
    const shown = (alertsData as { id: string; title: string }[]).find(a => fresh.includes(a.title));
    expect(shown, 'at least one alert is rendered').toBeTruthy();

    const { html, recoverable, hydrationWarnings, container } =
      await hydrateAsReturningVisitor(<EmergencyAlerts />, { dismissedAlerts: JSON.stringify([shown!.id]) });
    expect(recoverable).toEqual([]);
    expect(hydrationWarnings).toEqual([]);
    expect(html).toContain(shown!.title);
    expect(container.textContent).not.toContain(shown!.title);
    expect(container.textContent).toContain('show --dismissed (1)');
  });

  it('MemorialWall with candles lit', async () => {
    const { recoverable, hydrationWarnings, container } =
      await hydrateAsReturningVisitor(<MemorialWall />, { 'memorial-candles': JSON.stringify([1, 2, 3]) });
    expect(recoverable).toEqual([]);
    expect(hydrationWarnings).toEqual([]);
    expect(container.textContent).toMatch(/3\s*candles lit in remembrance/);
  });

  it.each(['light', 'high-contrast', 'system'])('the theme, saved as %s', async theme => {
    const tree = <ThemeProvider><ThemeToggle /></ThemeProvider>;
    const { recoverable, hydrationWarnings } =
      await hydrateAsReturningVisitor(tree, { 'resistance-hub-theme': theme });
    expect(recoverable).toEqual([]);
    expect(hydrationWarnings).toEqual([]);
    const expected = theme === 'system' ? /theme-(dark|light)/ : new RegExp(`theme-${theme}`);
    expect(document.documentElement.className).toMatch(expected);
  });

  it('the language, saved as Uyghur (right to left)', async () => {
    const tree = <LanguageProvider><ShowLanguage /></LanguageProvider>;
    const { html, recoverable, hydrationWarnings, container } =
      await hydrateAsReturningVisitor(tree, { language: 'ug' });
    expect(recoverable).toEqual([]);
    expect(hydrationWarnings).toEqual([]);
    expect(html).toContain('>en<');
    expect(container.textContent).toBe('ug');
    expect(document.documentElement.dir).toBe('rtl');
  });
});

describe('nothing is stored for a reader who only reads', () => {
  it('rendering these components writes nothing to storage', async () => {
    localStorage.clear();
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    container = document.createElement('div');
    document.body.appendChild(container);
    const { createRoot } = await import('react-dom/client');
    await act(async () => {
      root = createRoot(container!);
      root.render(
        <LanguageProvider>
          <ThemeProvider>
            <ThemeToggle />
            <SafetyChecklist />
            <EmergencyAlerts />
            <MemorialWall />
            <NotificationCenter />
          </ThemeProvider>
        </LanguageProvider>,
      );
    });
    expect(setItem).not.toHaveBeenCalled();
    expect(localStorage.length).toBe(0);
  });
});

describe('blocked storage', () => {
  // "Block all site data" makes every access to localStorage throw. One
  // unguarded access at the root used to replace every page with the error
  // screen.
  it('the app shell and these components still render, and still work', async () => {
    const own = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() { throw new DOMException('The operation is insecure.', 'SecurityError'); },
    });
    try {
      // Fresh module instances, so the in-memory fallback cannot leak into
      // other tests.
      vi.resetModules();
      const { LanguageProvider: Language } = await import('../contexts/LanguageContext');
      const { ThemeProvider: Theme, ThemeToggle: Toggle } = await import('../contexts/ThemeContext');
      const { default: Checklist } = await import('../components/SafetyChecklist');
      const { createRoot } = await import('react-dom/client');

      container = document.createElement('div');
      document.body.appendChild(container);
      await act(async () => {
        root = createRoot(container!);
        root.render(<Language><Theme><Toggle /><Checklist /></Theme></Language>);
      });
      expect(container.textContent).toContain('Digital Security');

      // Ticking an item works for the rest of the visit, held in memory.
      const box = container.querySelector<HTMLElement>('[role="checkbox"][aria-label="Use a VPN"]');
      expect(box, 'the "Use a VPN" checkbox').toBeTruthy();
      await act(async () => { box!.click(); });
      expect(box!.getAttribute('aria-checked')).toBe('true');
    } finally {
      if (own) Object.defineProperty(window, 'localStorage', own);
      else delete (window as unknown as Record<string, unknown>).localStorage;
    }
  });
});
