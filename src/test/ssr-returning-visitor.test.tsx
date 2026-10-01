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
import React, { act, lazy, Suspense, type ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot, type Root } from 'react-dom/client';
import SafetyChecklist from '../components/SafetyChecklist';
import EmergencyAlerts from '../components/EmergencyAlerts';
import MemorialWall from '../components/MemorialWall';
import NotificationCenter from '../components/NotificationCenter';
import { ThemeProvider, ThemeToggle } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { useLanguage } from '../contexts/languageUtils';
import { useTheme } from '../contexts/themeUtils';
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

describe('a first-time reader: nothing above the page changes after hydration', () => {
  // Pages load their code lazily. An update from above that reaches a page
  // still waiting for its code makes React throw the pre-rendered page away
  // and show the loading screen until the code arrives. The theme did that
  // for every reader whose system is light: it read their colour scheme,
  // which HTML built as dark cannot know, although the default theme never
  // uses it. On a slow connection the loading screen stayed for seconds.
  it.each([
    ['light', false],
    ['dark', true],
  ])('the providers render the page once, on a system that prefers %s', async (_scheme, prefersDark) => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' ? prefersDark : false,
      media: query,
      addEventListener() {},
      removeEventListener() {},
    })) as unknown as typeof window.matchMedia;
    try {
      let renders = 0;
      function Page() {
        useTheme();
        useLanguage();
        renders++;
        return <p>page</p>;
      }
      const tree = <LanguageProvider><ThemeProvider><Page /></ThemeProvider></LanguageProvider>;
      localStorage.clear();
      const html = renderToString(tree);
      container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);
      renders = 0;
      await act(async () => {
        root = hydrateRoot(container!, tree);
      });
      expect(renders).toBe(1);
      expect(document.documentElement.className).toContain('theme-dark');
    } finally {
      window.matchMedia = original;
    }
  });
});

describe('a returning reader: saved choices never swap the page for its loading screen', () => {
  // Each page's code loads lazily, so a page can finish hydrating after the
  // providers above it. A saved theme or language changes what they
  // provide. Applied at once, that change reached pages still waiting for
  // their code, and React threw the pre-rendered page away and showed the
  // loading screen until the code arrived: on every visit, for as long as
  // the download took.
  function ShowPreferences() {
    const { language } = useLanguage();
    const { resolvedTheme } = useTheme();
    return <p>{`page in ${language}, ${resolvedTheme}`}</p>;
  }

  // As in the app, the page's boundary sits below a layout, not directly
  // under a provider. (Directly under the provider whose value changes, the
  // deferred value reaches the boundary as it hydrates, and React reports a
  // text mismatch. Nothing in the app is shaped like that.)
  function Layout({ children }: { children: React.ReactNode }) {
    return <main>{children}</main>;
  }

  it.each([
    ['language', { language: 'zh-CN' }, 'page in zh-CN, dark'],
    ['theme', { 'resistance-hub-theme': 'light' }, 'page in en, light'],
    ['theme and language', { language: 'zh-CN', 'resistance-hub-theme': 'light' }, 'page in zh-CN, light'],
  ])('a saved %s', async (_name, saved, applied) => {
    const tree = (page: ReactElement) => (
      <ThemeProvider>
        <LanguageProvider>
          <Layout>
            <Suspense fallback={<p>$ loading system</p>}>{page}</Suspense>
          </Layout>
        </LanguageProvider>
      </ThemeProvider>
    );
    localStorage.clear();
    const html = renderToString(tree(<ShowPreferences />));
    expect(html).toContain('page in en, dark');

    for (const [key, value] of Object.entries(saved)) localStorage.setItem(key, value);
    container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    // The page's code arrives only when the test lets it.
    let arrive!: () => void;
    const code = new Promise<void>(resolve => { arrive = resolve; });
    const LazyPage = lazy(() => code.then(() => ({ default: ShowPreferences })));
    const recoverable: unknown[] = [];
    await act(async () => {
      root = hydrateRoot(container!, tree(<LazyPage />), { onRecoverableError: e => recoverable.push(e) });
    });
    expect(container.textContent, 'the pre-rendered page, while its code loads').toBe('page in en, dark');

    await act(async () => { arrive(); });
    expect(container.textContent).toBe(applied);
    expect(recoverable).toEqual([]);
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
