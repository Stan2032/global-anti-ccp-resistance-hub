import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import { renderToString } from 'react-dom/server';
import fixture from './fixtures/emergency_alerts.fixture.json';

// Pin the component to a fixture rather than the live alert feed. The real
// emergency_alerts.json is intentionally transient — the component filters out
// entries past their `expires` date — so asserting against it made these
// behavioural tests fail purely with the passage of time. The fixture mirrors
// the real records with a far-future expiry. Content freshness of the live
// feed is covered separately by the content-freshness suite.
vi.mock('../data/emergency_alerts.json', async () => ({
  default: (await import('./fixtures/emergency_alerts.fixture.json')).default,
}));

import EmergencyAlerts from '../components/EmergencyAlerts';

// Mock localStorage: behaves like real storage, with every call recorded.
// Dismissals are read back from storage, so reads must see earlier writes.
let store: Record<string, string> = {};
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

beforeEach(() => {
  store = {};
  mockLocalStorage.getItem.mockReset().mockImplementation((key: string) => store[key] ?? null);
  mockLocalStorage.setItem.mockReset().mockImplementation((key: string, value: string) => { store[key] = value; });
  mockLocalStorage.removeItem.mockReset().mockImplementation((key: string) => { delete store[key]; });
  mockLocalStorage.clear.mockReset().mockImplementation(() => { store = {}; });
  Object.defineProperty(window, 'localStorage', { value: mockLocalStorage, writable: true });
});

/** The fold holding the alerts past the first two. */
const fold = () => screen.getByText(/show --more/).closest('details') as HTMLDetailsElement;
/** An alert's title: its heading. The title is also in its details control's name. */
const heading = (title: RegExp) => screen.getByRole('heading', { level: 3, name: title });
const noHeading = (title: RegExp) => screen.queryByRole('heading', { level: 3, name: title });
/** An alert's card, found by its title. */
const card = (title: RegExp) => heading(title).closest('article') as HTMLElement;
/** The native disclosure holding an alert's details. */
const detailsOf = (title: RegExp) => card(title).querySelector('details') as HTMLDetailsElement;

const LIVE = fixture.filter(a => a.active);

describe('EmergencyAlerts', () => {
  // --- Every live alert is in the page ---
  // Only the first two alerts were rendered: the rest, and every alert's
  // details, appeared on a click that only JavaScript could handle. Now the
  // rest are folded into a native <details>, and each alert's details are one.

  it('shows the first 2 alerts, and folds the rest into the page', () => {
    render(<EmergencyAlerts />);
    expect(fold().open).toBe(false);
    expect(fold().contains(heading(/Joshua Wong Foreign Collusion Case/))).toBe(false);
    expect(fold().contains(heading(/URGENT: Jimmy Lai Sentenced/))).toBe(false);
    expect(fold().contains(heading(/Hong Kong 47: Appeals Dismissed/))).toBe(true);
    expect(fold().contains(heading(/ESCALATION: Family Member Prosecuted/))).toBe(true);
    expect(fold().querySelectorAll('article')).toHaveLength(LIVE.length - 2);
    // Taiwan military alert is expired (expires 2025-06-18) — should NOT appear
    expect(noHeading(/Taiwan Reports Increased PLA Activity/)).toBeFalsy();
  });

  it('opens and closes the fold natively', () => {
    render(<EmergencyAlerts />);
    const summary = fold().querySelector(':scope > summary')!;
    expect(within(summary as HTMLElement).getByText(`$ show --more (${LIVE.length - 2} more alerts)`)).toBeTruthy();
    fireEvent.click(summary);
    expect(fold().open).toBe(true);
    fireEvent.click(summary);
    expect(fold().open).toBe(false);
  });

  it('puts every live alert in the pre-rendered page, details included, with no JavaScript-only buttons', () => {
    const html = renderToString(<EmergencyAlerts />);
    const page = document.createElement('div');
    page.innerHTML = html;
    expect(LIVE.length).toBeGreaterThan(2);
    for (const alert of LIVE) {
      expect(page.textContent, alert.id).toContain(alert.title);
      expect(page.textContent, alert.id).toContain(alert.details.split('\n')[0]);
    }
    expect(page.querySelectorAll('button')).toHaveLength(0);
  });

  it('shows alert summaries', () => {
    render(<EmergencyAlerts />);
    expect(screen.getByText(/March 6 hearing concluded.*High Court/)).toBeTruthy();
    expect(screen.getByText(/Hong Kong media tycoon Jimmy Lai sentenced/)).toBeTruthy();
    expect(fold().contains(screen.getByText(/Court of Appeal upholds convictions/))).toBe(true);
    expect(fold().contains(screen.getByText(/Father of US-based activist sentenced/))).toBe(true);
  });

  it('renders a type badge for every alert', () => {
    render(<EmergencyAlerts />);
    expect(screen.getAllByText(/^(critical|warning|info)$/)).toHaveLength(LIVE.length);
    expect(screen.getAllByText('critical')).toHaveLength(LIVE.filter(a => a.type === 'critical').length);
  });

  it('renders alert dates', () => {
    render(<EmergencyAlerts />);
    expect(screen.getByText('2026-03-03')).toBeTruthy();
    expect(screen.getByText('2025-12-15')).toBeTruthy();
    expect(fold().contains(screen.getByText('2024-11-19'))).toBe(true);
    expect(fold().contains(screen.getByText('2026-02-26'))).toBe(true);
  });

  // --- External Links ---

  it('renders external action links', () => {
    render(<EmergencyAlerts />);
    expect(screen.getAllByText('Hong Kong Watch').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Free Jimmy Lai Campaign').length).toBeGreaterThanOrEqual(1);
    // NPR Report is on the Kwok alert, in the fold
    expect(screen.getAllByText('NPR Report').every(el => fold().contains(el))).toBe(true);
  });

  it('action links open in new tab with noopener', () => {
    render(<EmergencyAlerts />);
    const hkWatchLink = screen.getAllByText('Hong Kong Watch')[0];
    expect(hkWatchLink.getAttribute('target')).toBe('_blank');
    expect(hkWatchLink.getAttribute('rel')).toContain('noopener');
  });

  // --- Details ---

  it("puts every alert's details in a closed native disclosure", () => {
    render(<EmergencyAlerts />);
    const disclosures = [...document.querySelectorAll('article > details')] as HTMLDetailsElement[];
    expect(disclosures).toHaveLength(LIVE.length);
    expect(disclosures.every(d => !d.open)).toBe(true);
    // The details text is in the page before any click.
    expect(detailsOf(/Joshua Wong Foreign Collusion Case/).textContent).toMatch(/THE CHARGE:/);
  });

  it('opens and closes the details natively', () => {
    render(<EmergencyAlerts />);
    const details = detailsOf(/Joshua Wong Foreign Collusion Case/);
    fireEvent.click(details.querySelector('summary')!);
    expect(details.open).toBe(true);
    fireEvent.click(details.querySelector('summary')!);
    expect(details.open).toBe(false);
  });

  it('shows all links in the details', () => {
    render(<EmergencyAlerts />);
    expect(within(detailsOf(/Joshua Wong Foreign Collusion Case/)).getAllByText(/Hong Kong Watch/).length).toBeGreaterThanOrEqual(1);
  });

  it("names each details control after its alert", () => {
    render(<EmergencyAlerts />);
    for (const alert of LIVE) {
      const summary = [...document.querySelectorAll('article > details > summary')]
        .find(s => s.textContent!.includes(`for ${alert.title}`));
      expect(summary, alert.id).toBeTruthy();
    }
  });

  // --- Dismiss (once JavaScript runs) ---

  it('dismiss button removes an alert', () => {
    render(<EmergencyAlerts />);
    fireEvent.click(screen.getByLabelText(/^Dismiss alert: Joshua Wong Foreign Collusion Case/));
    expect(noHeading(/Joshua Wong Foreign Collusion Case/)).toBeFalsy();
  });

  it('shows dismissed count after dismissing', () => {
    render(<EmergencyAlerts />);
    fireEvent.click(screen.getAllByLabelText(/^Dismiss alert/)[0]);
    expect(screen.getByText(/show --dismissed \(1\)/)).toBeTruthy();
  });

  it('saves dismissed alerts to localStorage', () => {
    render(<EmergencyAlerts />);
    fireEvent.click(screen.getAllByLabelText(/^Dismiss alert/)[0]);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'dismissedAlerts',
      expect.stringContaining('joshua-wong-hearing')
    );
  });

  it('restores dismissed alerts from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(['joshua-wong-hearing', 'jimmy-lai-verdict', 'uyghur-forced-labor']));
    render(<EmergencyAlerts />);
    expect(noHeading(/Joshua Wong Foreign Collusion Case/)).toBeFalsy();
    expect(noHeading(/URGENT: Jimmy Lai Sentenced/)).toBeFalsy();
    expect(noHeading(/100\+ Global Brands Linked/)).toBeFalsy();
    expect(heading(/Hong Kong 47: Appeals Dismissed/)).toBeTruthy();
    expect(heading(/ESCALATION: Family Member Prosecuted/)).toBeTruthy();
  });

  it('show-dismissed button restores all alerts', () => {
    render(<EmergencyAlerts />);
    fireEvent.click(screen.getAllByLabelText(/^Dismiss alert/)[0]);
    fireEvent.click(screen.getByText(/show --dismissed/));
    expect(heading(/Joshua Wong Foreign Collusion Case/)).toBeTruthy();
  });

  // It used to return nothing once every alert was dismissed, taking the
  // restore button with it: the alerts could not be brought back without
  // clearing site data.
  it('keeps the restore button when every alert is dismissed', () => {
    store.dismissedAlerts = JSON.stringify([...LIVE.map(a => a.id), 'taiwan-military']);
    render(<EmergencyAlerts />);
    expect(screen.queryAllByRole('article')).toHaveLength(0);
    const restore = screen.getByText(`$ show --dismissed (${LIVE.length})`);
    fireEvent.click(restore);
    expect(heading(/Joshua Wong Foreign Collusion Case/)).toBeTruthy();
  });

  // --- Accessibility ---

  it('names each dismiss button after its alert', () => {
    render(<EmergencyAlerts />);
    const buttons = screen.getAllByLabelText(/^Dismiss alert: /);
    expect(buttons).toHaveLength(LIVE.length);
    expect(new Set(buttons.map(b => b.getAttribute('aria-label'))).size).toBe(LIVE.length);
  });

  // --- Severity Sorting ---

  it('sorts alerts by severity (critical first, then warning, then info)', () => {
    render(<EmergencyAlerts />);
    const types = screen.getAllByText(/^(critical|warning|info)$/).map(b => b.textContent);
    const lastCriticalIdx = types.lastIndexOf('critical');
    const firstWarningIdx = types.indexOf('warning');
    expect(lastCriticalIdx).toBeGreaterThanOrEqual(0);
    expect(firstWarningIdx).toBeGreaterThanOrEqual(0);
    expect(lastCriticalIdx).toBeLessThan(firstWarningIdx);
  });

  it('Taiwan military alert is excluded (expired and inactive)', () => {
    render(<EmergencyAlerts />);
    expect(noHeading(/Taiwan Reports Increased PLA Activity/)).toBeFalsy();
  });
});
