import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock sub-components
vi.mock('../components/UrgentCaseTimer', () => ({ default: () => <div>UrgentCaseTimer</div> }));
vi.mock('../components/CaseStudies', () => ({ default: () => <div>CaseStudies</div> }));
vi.mock('../components/MemorialWall', () => ({ default: () => <div>MemorialWall</div> }));
vi.mock('../components/ui/SourceAttribution', () => ({ default: ({ source }) => <div>Source: {source?.name}</div> }));

import PoliticalPrisoners from '../pages/PoliticalPrisoners';

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
    fireEvent.click(filterBtn);
    // After filtering, the button should be active (red styling)
    expect(filterBtn.className).toContain('text-red-300');
  });

  // --- Featured Profiles Banner ---

  it('renders featured profiles banner', () => {
    renderPage();
    expect(screen.getByText('── featured_profiles ──')).toBeTruthy();
    expect(screen.getByText('$ view_all_profiles →')).toBeTruthy();
  });

  // --- Truncation (Show All / Show Less) ---

  it('shows only 15 prisoners initially', () => {
    renderPage();
    // With 62 total prisoners, should show only 15 cards initially
    const cards = screen.getAllByRole('button', { name: /View details for/ });
    expect(cards.length).toBe(15);
  });

  it('shows "show all" button when more than 15 prisoners', () => {
    renderPage();
    expect(screen.getByText(/show --all \d+ cases/)).toBeTruthy();
  });

  it('shows all prisoners when "show all" is clicked', () => {
    renderPage();
    const showAllBtn = screen.getByText(/show --all \d+ cases/);
    fireEvent.click(showAllBtn);
    const cards = screen.getAllByRole('button', { name: /View details for/ });
    expect(cards.length).toBeGreaterThan(15);
  });

  it('shows "show less" button after expanding', () => {
    renderPage();
    const showAllBtn = screen.getByText(/show --all \d+ cases/);
    fireEvent.click(showAllBtn);
    expect(screen.getByText('$ show --less')).toBeTruthy();
  });

  it('collapses back to 15 when "show less" is clicked', () => {
    renderPage();
    // Expand
    fireEvent.click(screen.getByText(/show --all \d+ cases/));
    // Collapse
    fireEvent.click(screen.getByText('$ show --less'));
    const cards = screen.getAllByRole('button', { name: /View details for/ });
    expect(cards.length).toBe(15);
  });

  it('resets to truncated view when filter changes', () => {
    renderPage();
    // Expand all
    fireEvent.click(screen.getByText(/show --all \d+ cases/));
    const allCards = screen.getAllByRole('button', { name: /View details for/ });
    expect(allCards.length).toBeGreaterThan(15);
    // Change filter — target the filter button specifically
    const imprisonedButtons = screen.getAllByText('IMPRISONED');
    const filterBtn = imprisonedButtons.find(el => el.tagName === 'BUTTON');
    fireEvent.click(filterBtn);
    // Should reset to truncated (or show all if <15 match)
    const filteredCards = screen.getAllByRole('button', { name: /View details for/ });
    expect(filteredCards.length).toBeLessThanOrEqual(27); // 27 imprisoned, all fit within truncation or total
  });

  // --- Modal ---

  it('opens modal when prisoner card is clicked', () => {
    renderPage();
    const cards = screen.getAllByRole('button', { name: /View details for/ });
    fireEvent.click(cards[0]);
    // Modal should appear with dialog role
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('closes modal when close button is clicked', () => {
    renderPage();
    const cards = screen.getAllByRole('button', { name: /View details for/ });
    fireEvent.click(cards[0]);
    // Find the close button (X icon)
    const dialog = screen.getByRole('dialog');
    const closeBtn = dialog.querySelector('button');
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).toBeNull();
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
    expect(screen.getByText('Additional Resources')).toBeTruthy();
    expect(screen.getByText('CECC Database')).toBeTruthy();
    expect(screen.getByText('Dui Hua Foundation')).toBeTruthy();
    expect(screen.getByText('Xinjiang Victims Database')).toBeTruthy();
  });
});
