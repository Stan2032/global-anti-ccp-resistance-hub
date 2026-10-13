/**
 * Readers visit long after the build. The pre-rendered HTML is computed as
 * of the build, the reader's browser as of the visit, and anything that
 * differs makes React discard the page and render it again (error #418).
 *
 * Measured in Chromium before the fix: 11 of 27 routes failed three days
 * after a build, all 27 after New Year (the footer's year), and /take-action
 * failed on the day of the build itself for readers west of UTC.
 *
 * Each case renders the HTML as the build does, at BUILD, then hydrates it
 * as a reader's browser would days later, reading the build's moment from
 * #root exactly as the real page carries it.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import React, { act, type ComponentType, type ReactElement } from 'react';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { renderToString } from 'react-dom/server';
import { hydrateRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { RENDERED_AT_ATTRIBUTE, setRenderedAt } from '../utils/ssr';
import Footer from '../components/Footer';
import EmergencyAlerts from '../components/EmergencyAlerts';
import LiveStatistics from '../components/LiveStatistics';
import DataFreshnessIndicator from '../components/DataFreshnessIndicator';
import PrintableReport from '../components/PrintableReport';
import PolicyBriefGenerator from '../components/PolicyBriefGenerator';
import UrgentCaseTimer from '../components/UrgentCaseTimer';
import ContentAnalytics from '../components/ContentAnalytics';
import ResearchDashboard from '../components/ResearchDashboard';
import DataApiDocs from '../components/DataApiDocs';
import DataChangelog from '../components/DataChangelog';
import DataComparisonTool from '../components/DataComparisonTool';
import DataExport from '../components/DataExport';
import DataIntegrityMonitor from '../components/DataIntegrityMonitor';
import EmbedWidget from '../components/EmbedWidget';
import SourceDiversityAnalyzer from '../components/SourceDiversityAnalyzer';
import CrossDatasetInsightEngine from '../components/CrossDatasetInsightEngine';
import SourceAttribution from '../components/ui/SourceAttribution';
import Dashboard from '../pages/Dashboard';
import ResistanceDirectory from '../pages/ResistanceDirectory';
import PanchenLamaProfile from '../pages/profiles/PanchenLamaProfile';

// The dashboard's statistics come from the network; their state is not
// what these tests are about.
vi.mock('../hooks/useLiveData', () => ({
  useStatistics: () => ({ stats: null, loading: false, error: null }),
}));

// jsdom has no IntersectionObserver; the animated counters only need it to exist.
globalThis.IntersectionObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
} as unknown as typeof IntersectionObserver;

/** The text of pre-rendered HTML, as a reader without JavaScript sees it. */
function textOf(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent ?? '';
}

const BUILD = new Date('2026-10-01T19:10:00.000Z');
const DAY = 86_400_000;

let root: Root | null = null;
let container: HTMLElement | null = null;
const timezoneAtStart = process.env.TZ;

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
  setRenderedAt(null);
  process.env.TZ = timezoneAtStart;
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/**
 * Render `element` as the build does, then hydrate it `daysLater`, in
 * `readerTimezone` if given (the build runs in UTC).
 */
async function hydrateLater(element: ReactElement, daysLater: number, readerTimezone?: string) {
  // The trailing element makes a component that renders less than the HTML
  // a mismatch; at the end of the root React would quietly drop the extra.
  const tree = <MemoryRouter>{element}<i data-end-of-case /></MemoryRouter>;
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(BUILD);
  process.env.TZ = 'UTC';
  setRenderedAt(BUILD.toISOString());
  const html = renderToString(tree);
  setRenderedAt(null);

  container = document.createElement('div');
  container.id = 'root';
  container.setAttribute(RENDERED_AT_ATTRIBUTE, BUILD.toISOString());
  container.innerHTML = html;
  document.body.appendChild(container);

  if (readerTimezone) process.env.TZ = readerTimezone;
  vi.setSystemTime(new Date(BUILD.getTime() + daysLater * DAY));
  const recoverable: unknown[] = [];
  vi.spyOn(console, 'error').mockImplementation(() => {});
  await act(async () => {
    root = hydrateRoot(container!, tree, { onRecoverableError: e => recoverable.push(e) });
  });
  // Only mismatches. renderToString cannot wait for lazily loaded children,
  // as the build's prerender() does, so React also reports those boundaries
  // as aborted; that is a property of this harness, not of the page.
  const mismatches = recoverable.map(String).filter(e => /Hydration failed|did ?n[o']t match/i.test(e));
  return { html, recoverable: mismatches, container };
}

const profiles = import.meta.glob<{ default: ComponentType }>('../pages/profiles/*Profile.tsx', { eager: true });

const CASES: [string, () => ReactElement][] = [
  ['Footer', () => <Footer />],
  ['EmergencyAlerts', () => <EmergencyAlerts />],
  ['LiveStatistics', () => <LiveStatistics />],
  ['DataFreshnessIndicator', () => <DataFreshnessIndicator lastVerified="2026-09-19" />],
  ['PrintableReport', () => <PrintableReport />],
  ['PolicyBriefGenerator', () => <PolicyBriefGenerator />],
  ['UrgentCaseTimer', () => <UrgentCaseTimer />],
  ['ContentAnalytics', () => <ContentAnalytics />],
  ['ResearchDashboard', () => <ResearchDashboard />],
  ['DataApiDocs', () => <DataApiDocs />],
  ['DataChangelog', () => <DataChangelog />],
  ['DataComparisonTool', () => <DataComparisonTool />],
  ['DataExport', () => <DataExport />],
  ['DataIntegrityMonitor', () => <DataIntegrityMonitor />],
  ['EmbedWidget', () => <EmbedWidget />],
  ['SourceDiversityAnalyzer', () => <SourceDiversityAnalyzer />],
  ['CrossDatasetInsightEngine', () => <CrossDatasetInsightEngine />],
  ['Dashboard', () => <Dashboard />],
  ['ResistanceDirectory', () => <ResistanceDirectory />],
  ...Object.entries(profiles).map(([path, mod]): [string, () => ReactElement] => {
    const Page = mod.default;
    return [path.replace(/^.*\/(\w+)\.tsx$/, '$1'), () => <Page />];
  }),
];

describe('pages hydrate on any day after the build', () => {
  it('covers every profile page', () => {
    expect(Object.keys(profiles).length).toBeGreaterThanOrEqual(16);
  });

  // 3 days: day counts and "N days ago". 60: an alert has expired. 400: a
  // new year, and every birthday.
  for (const [name, make] of CASES) {
    for (const days of [3, 60, 400]) {
      it(`${name}, ${days} days later`, async () => {
        const { recoverable } = await hydrateLater(make(), days);
        expect(recoverable).toEqual([]);
      });
    }
  }
});

describe('readers west of UTC', () => {
  it('see source dates as written, and the page hydrates', async () => {
    const source = (date: string) => ({ name: 'Example', url: 'https://example.org/', type: 'NGO Report', verified: true, description: '', date });
    const { recoverable, container } = await hydrateLater(
      <>
        <SourceAttribution source={source('2024-03-01')} />
        <SourceAttribution source={source('2024-03')} />
        <SourceAttribution source={source('2020')} />
      </>,
      0,
      'Pacific/Pago_Pago',
    );
    expect(recoverable).toEqual([]);
    const text = container.textContent!;
    expect(text).toContain('Published: Mar 1, 2024');
    // A month or a year is not a day: "2024-03" used to read "Mar 1, 2024".
    expect(text).toContain('Published: Mar 2024');
    expect(text).toContain('Published: 2020');
    expect(text).not.toMatch(/Feb 29, 2024|Dec 31, 2019|Jan 1, 2020/);
  });
});

describe('what a reader without JavaScript is told', () => {
  it('a verification date, not an age that is only true on the day of the build', async () => {
    const { html, container } = await hydrateLater(<DataFreshnessIndicator lastVerified="2026-09-19" />, 3);
    expect(textOf(html)).toContain('Verified 2026-09-19');
    expect(textOf(html)).not.toContain('days ago');
    // Once the page is live, the reader's own clock gives the age.
    expect(container.textContent).toContain('Verified 15 days ago');
  });

  it('no "today" on the dashboard, which would be the day of the build', async () => {
    const { html, container } = await hydrateLater(<Dashboard />, 3);
    expect(textOf(html)).not.toContain('October 1, 2026');
    expect(container.textContent).toContain('Sunday, October 4, 2026');
  });

  it("the Panchen Lama's age and years missing, not numbers typed in once", async () => {
    // They were typed in as 36 and 30. He was born on 25 April 1989 and
    // disappeared on 17 May 1995.
    const { html, container } = await hydrateLater(<PanchenLamaProfile />, 400);
    expect(textOf(html)).toContain('ENFORCED DISAPPEARANCE — 31 YEARS');
    expect(textOf(html)).toContain('Abducted at age 6 on May 17, 1995. Now 37 years old.');
    expect(container.textContent).toContain('ENFORCED DISAPPEARANCE — 32 YEARS');
    expect(container.textContent).toContain('Now 38 years old.');
  });
});

describe('the build and the browser agree on the moment', () => {
  it('the pre-render writes the attribute the browser reads', () => {
    const script = readFileSync(resolve(__dirname, '../../scripts/prerender.mjs'), 'utf8');
    expect(script).toContain(`<div id="root" ${RENDERED_AT_ATTRIBUTE}="\${renderedAt}">`);
  });
});
