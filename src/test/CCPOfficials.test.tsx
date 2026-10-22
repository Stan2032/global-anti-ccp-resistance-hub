import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

// Mock SourceAttribution and SourcesList
vi.mock('../components/ui/SourceAttribution', () => ({
  default: ({ source }: { source?: { name?: string } }) => <div data-testid="source-attribution">{source?.name}</div>,
  SourcesList: ({ sources }: { sources?: { length: number } }) => <div data-testid="sources-list">{sources?.length} sources</div>,
}));

// Mock GlobalDisclaimer
vi.mock('../components/ui/GlobalDisclaimer', () => ({
  default: ({ type }: { type: string }) => <div data-testid="disclaimer">{type}</div>,
}));

import CCPOfficials from '../components/CCPOfficials';
import officialsData from '../data/sanctioned_officials_research.json';

const OFFICIALS = officialsData.results.map(r => r.output).filter(Boolean);
/** Every official's card: a native <details> named by its heading. */
const cards = () => [...document.querySelectorAll('details')].filter(d => d.querySelector(':scope > summary > h3'));

describe('CCPOfficials', () => {
  it('renders the header with title', () => {
    render(<CCPOfficials />);
    expect(screen.getByText('CCP Officials Database')).toBeTruthy();
  });

  it('renders subtitle', () => {
    render(<CCPOfficials />);
    expect(screen.getByText('Key officials responsible for human rights abuses')).toBeTruthy();
  });

  it('renders stats section', () => {
    render(<CCPOfficials />);
    // Each official's quick facts also say "Sanctioned", so look in the stats.
    const stats = within(screen.getByText('Officials Tracked').closest('.grid') as HTMLElement);
    expect(stats.getByText('Sanctioned')).toBeTruthy();
    expect(stats.getByText('Regions')).toBeTruthy();
    expect(stats.getByText('Categories')).toBeTruthy();
  });

  it('renders search input', () => {
    render(<CCPOfficials />);
    expect(screen.getByPlaceholderText('Search CCP officials...')).toBeTruthy();
  });

  it('renders region filter', () => {
    render(<CCPOfficials />);
    expect(screen.getByLabelText('Filter officials by region')).toBeTruthy();
  });

  it('renders category filter', () => {
    render(<CCPOfficials />);
    expect(screen.getByLabelText('Category filter')).toBeTruthy();
  });

  it('renders sanctioned only checkbox', () => {
    render(<CCPOfficials />);
    expect(screen.getByText('Sanctioned only')).toBeTruthy();
  });

  // Each official's responsibilities, actions, sanctions and sources were
  // in a view that replaced the list when a card was clicked, so none of it
  // reached a reader without JavaScript. Each card is a native <details>.
  it('puts every official in the page as a closed native disclosure', () => {
    render(<CCPOfficials />);
    expect(OFFICIALS.length).toBeGreaterThan(0);
    expect(cards()).toHaveLength(OFFICIALS.length);
    expect(cards().every(d => !d.open)).toBe(true);
    expect(screen.queryByText(/Back to all officials/)).toBeNull();
    expect(screen.queryAllByRole('button', { name: /View/ })).toHaveLength(0);
  });

  it("puts each official's responsibilities and actions in the page before any click", () => {
    render(<CCPOfficials />);
    let checked = 0;
    for (const official of OFFICIALS) {
      const card = cards().find(d => d.querySelector('summary h3')!.textContent === official!.name)!;
      expect(card, official!.name).toBeTruthy();
      const responsibilities = (official!.detailed_responsibilities ?? []) as string[];
      const actions = (official!.key_actions ?? []) as { action: string }[];
      for (const item of responsibilities) expect(card.textContent).toContain(item);
      for (const action of actions) expect(card.textContent).toContain(action.action);
      checked += responsibilities.length + actions.length;
    }
    expect(checked).toBeGreaterThan(OFFICIALS.length);
  });

  it('opens and closes an official natively', () => {
    render(<CCPOfficials />);
    const card = cards()[0];
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(true);
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(false);
  });

  it('filters officials by search query', () => {
    render(<CCPOfficials />);
    const searchInput = screen.getByPlaceholderText('Search CCP officials...');
    fireEvent.change(searchInput, { target: { value: 'zzzznonexistent' } });
    expect(screen.getByText('No officials match your search')).toBeTruthy();
    expect(cards()).toHaveLength(0);
  });

  // These used to assert that a count was at least 0, which always holds.
  it('filters officials by region', () => {
    render(<CCPOfficials />);
    const regionSelect = screen.getByLabelText('Filter officials by region') as HTMLSelectElement;
    const region = [...regionSelect.options].map(o => o.value).find(v => v !== 'all')!;
    fireEvent.change(regionSelect, { target: { value: region } });
    expect(cards().length).toBeGreaterThan(0);
    expect(cards().length).toBeLessThan(OFFICIALS.length);
    expect(cards().every(c => c.querySelector('summary')!.textContent!.includes(region))).toBe(true);
  });

  it('filters officials by category', () => {
    render(<CCPOfficials />);
    const categorySelect = screen.getByLabelText('Category filter') as HTMLSelectElement;
    const category = [...categorySelect.options].map(o => o.value).find(v => v !== 'all')!;
    fireEvent.change(categorySelect, { target: { value: category } });
    expect(cards().length).toBeGreaterThan(0);
    expect(cards().every(c => c.querySelector('summary')!.textContent!.includes(category))).toBe(true);
  });

  it('renders government sanction list sources section', () => {
    render(<CCPOfficials />);
    expect(screen.getByText('Official Government Sanction Lists')).toBeTruthy();
  });
});
