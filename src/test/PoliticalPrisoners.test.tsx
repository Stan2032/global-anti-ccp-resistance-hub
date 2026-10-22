import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock sub-components
vi.mock('../components/UrgentCaseTimer', () => ({ default: () => <div>UrgentCaseTimer</div> }));
vi.mock('../components/CaseStudies', () => ({ default: () => <div>CaseStudies</div> }));
vi.mock('../components/MemorialWall', () => ({ default: () => <div>MemorialWall</div> }));
vi.mock('../components/ui/SourceAttribution', () => ({ default: ({ source }: { source?: { name?: string } }) => <div>Source: {source?.name}</div> }));

import PoliticalPrisoners from '../pages/PoliticalPrisoners';
import prisonersData from '../data/political_prisoners_research.json';

const records = prisonersData.results.map(r => r.output).filter(Boolean);
/** Every prisoner card on the page, folded or not. */
const cards = () => [...document.querySelectorAll('article')];
/** The disclosure holding the cases past the first 15. */
const folded = () => screen.getByText(/show --all \d+ cases/).closest('details') as HTMLDetailsElement;

const renderPage = () =>
  render(
    <MemoryRouter>
      <PoliticalPrisoners />
    </MemoryRouter>
  );

describe('PoliticalPrisoners', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Header ---

  it('renders the page header', () => {
    renderPage();
    expect(screen.getByText('Political Prisoners')).toBeTruthy();
    expect(screen.getByText(/Documenting individuals detained by the CCP/)).toBeTruthy();
  });

  // --- Stats ---

  it('renders stat cards', () => {
    renderPage();
    expect(screen.getByText('Documented Cases')).toBeTruthy();
    expect(screen.getByText('Currently Imprisoned')).toBeTruthy();
    expect(screen.getByText('Disappeared')).toBeTruthy();
    expect(screen.getByText('Critical Urgency')).toBeTruthy();
  });

  // --- Alert Banner ---

  it('renders the Jimmy Lai alert banner', () => {
    renderPage();
    expect(screen.getByText(/BREAKING: Jimmy Lai Found GUILTY/)).toBeTruthy();
  });

  // --- Filter ---

  it('renders filter buttons', () => {
    renderPage();
    expect(screen.getByText('All Cases')).toBeTruthy();
    // "IMPRISONED" etc. appear in filter buttons AND status badges, use getAllByText
    expect(screen.getAllByText('IMPRISONED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('DISAPPEARED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('DECEASED').length).toBeGreaterThanOrEqual(1);
  });

  it('applies filter when clicked', () => {
    renderPage();
    // Filter button is the first "IMPRISONED" text in a button element
    const imprisonedButtons = screen.getAllByText('IMPRISONED');
    const filterBtn = imprisonedButtons.find(el => el.tagName === 'BUTTON');
    fireEvent.click(filterBtn!);
    // After filtering, the button should be active (red styling)
    expect(filterBtn!.className).toContain('text-red-300');
  });

  // --- Featured Profiles Banner ---

  it('renders featured profiles banner', () => {
    renderPage();
    expect(screen.getByText('── featured_profiles ──')).toBeTruthy();
    expect(screen.getByText('$ view_all_profiles →')).toBeTruthy();
  });

  // --- Every case in the page (Show All / Show Less) ---
  // "Show all" was a button only JavaScript could work, and each card opened
  // a modal only JavaScript could render. Every case is in the page now: the
  // first 15, then the rest in a native disclosure.

  it('puts every case in the page: the first 15, the rest folded', () => {
    renderPage();
    expect(records.length).toBeGreaterThan(15);
    expect(cards()).toHaveLength(records.length);
    expect(folded().open).toBe(false);
    expect(folded().querySelectorAll('article')).toHaveLength(records.length - 15);
  });

  it('shows "show all" button when more than 15 prisoners', () => {
    renderPage();
    expect(screen.getByText(/show --all \d+ cases/)).toBeTruthy();
  });

  it('show all and show less open and close the rest natively', () => {
    renderPage();
    const summary = folded().querySelector(':scope > summary')!;
    expect(within(summary as HTMLElement).getByText('$ show --less')).toBeTruthy();
    fireEvent.click(summary);
    expect(folded().open).toBe(true);
    fireEvent.click(summary);
    expect(folded().open).toBe(false);
  });

  it('a filter keeps every matching case in the page', () => {
    renderPage();
    const filterBtn = screen.getAllByText('IMPRISONED').find(el => el.tagName === 'BUTTON')!;
    fireEvent.click(filterBtn);
    expect(filterBtn.getAttribute('aria-pressed')).toBe('true');
    const detained = records.filter(r => r.status === 'DETAINED').length;
    expect(detained).toBeGreaterThan(0);
    expect(cards()).toHaveLength(detained);
  });

  // --- Each card: native disclosure, no modal ---

  it("puts each card's latest developments in the page before any click", () => {
    renderPage();
    const withNews = records.filter(r => r.latest_news);
    expect(withNews.length).toBeGreaterThan(0);
    for (const r of withNews) {
      const card = cards().find(c => c.querySelector('h3')?.textContent === r.prisoner_name);
      expect(card, r.prisoner_name).toBeTruthy();
      const disclosure = card!.querySelector('details')!;
      expect(disclosure.open).toBe(false);
      expect(disclosure.querySelector('summary')!.textContent).toContain(`for ${r.prisoner_name}`);
      expect(disclosure.textContent).toContain(r.latest_news);
    }
  });

  it('no card is a button, and no link sits inside a button', () => {
    const { container } = renderPage();
    expect(screen.queryAllByRole('button', { name: /View details for/ })).toHaveLength(0);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(container.querySelectorAll('button a')).toHaveLength(0);
  });

  it('encodes the text it shares, so a # or & in a case cannot cut the tweet short', () => {
    renderPage();
    const share = screen.getAllByText('Share on Twitter')[0].closest('a')!;
    const text = new URL(share.href).searchParams.get('text')!;
    expect(text).toMatch(/^Free .+! /);
    expect(share.getAttribute('href')).not.toMatch(/ /);
  });

  // --- Sub-components ---

  it('renders sub-components', () => {
    renderPage();
    expect(screen.getByText('UrgentCaseTimer')).toBeTruthy();
    expect(screen.getByText('CaseStudies')).toBeTruthy();
    expect(screen.getByText('MemorialWall')).toBeTruthy();
  });

  // --- Resources ---

  it('renders additional resources section', () => {
    renderPage();
    const resources = within(screen.getByText('Additional Resources').parentElement!);
    expect(resources.getByText('CECC Database')).toBeTruthy();
    expect(resources.getByText('Dui Hua Foundation')).toBeTruthy();
    expect(resources.getByText('Xinjiang Victims Database')).toBeTruthy();
  });
});
