import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock IPACMembers to isolate page-level tests
vi.mock('../components/IPACMembers', () => ({ default: () => <div data-testid="ipac-members">IPACMembers</div> }));

import ResistanceDirectory from '../pages/ResistanceDirectory';

const renderPage = () =>
  render(
    <MemoryRouter>
      <ResistanceDirectory />
    </MemoryRouter>
  );

describe('ResistanceDirectory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Header ---

  it('renders the page title', () => {
    renderPage();
    expect(screen.getByText('Resistance Directory')).toBeTruthy();
  });

  it('renders the subtitle about verified organizations', () => {
    renderPage();
    expect(screen.getByText(/Global database of verified organizations fighting CCP authoritarianism/)).toBeTruthy();
  });

  it('renders total organizations count', () => {
    renderPage();
    expect(screen.getByText('Verified Organizations')).toBeTruthy();
  });

  // --- Stats ---

  it('renders all four stat cards', () => {
    renderPage();
    expect(screen.getByText('Categories')).toBeTruthy();
    expect(screen.getByText('Global Reach')).toBeTruthy();
    expect(screen.getByText('Verified')).toBeTruthy();
    expect(screen.getByText('Years Combined')).toBeTruthy();
  });

  // --- Search & Filter ---

  it('renders search input with placeholder', () => {
    renderPage();
    const searchInput = screen.getByPlaceholderText('Search organizations...');
    expect(searchInput).toBeTruthy();
  });

  it('renders category filter dropdown', () => {
    renderPage();
    const filter = screen.getByLabelText('Filter');
    expect(filter).toBeTruthy();
    expect(screen.getByText('All Categories')).toBeTruthy();
  });

  it('renders category pill buttons', () => {
    renderPage();
    // "All" pill should be present with count
    const allPill = screen.getByText(/^All \(/);
    expect(allPill).toBeTruthy();
  });

  it('filters organizations by search text', () => {
    renderPage();
    const searchInput = screen.getByPlaceholderText('Search organizations...');
    fireEvent.change(searchInput, { target: { value: 'Uyghur' } });
    // Should show matching orgs and footer count
    expect(screen.getByText(/Showing \d+ of \d+ verified organizations/)).toBeTruthy();
  });

  it('filters organizations by category pill', () => {
    renderPage();
    // Click a specific category pill (Uyghur Rights should exist)
    const uyghurPill = screen.getByText(/^Uyghur Rights \(/);
    fireEvent.click(uyghurPill);
    // Should filter to Uyghur Rights orgs only
    expect(screen.getByText(/Showing \d+ of \d+ verified organizations/)).toBeTruthy();
  });

  it('filters organizations by dropdown selection', () => {
    renderPage();
    const filter = screen.getByLabelText('Filter');
    fireEvent.change(filter, { target: { value: 'Tibetan Rights' } });
    expect(screen.getByText(/Showing \d+ of \d+ verified organizations/)).toBeTruthy();
  });

  // --- Organization Cards ---

  it('renders organization cards', () => {
    renderPage();
    // First org from data should render
    expect(screen.getByText('Uyghur Human Rights Project')).toBeTruthy();
  });

  it('shows verified checkmark for verified organizations', () => {
    renderPage();
    const verifiedIcons = screen.getAllByTitle('Verified Organization');
    expect(verifiedIcons.length).toBeGreaterThanOrEqual(1);
  });

  it('every organisation carries its focus areas and website without a click', () => {
    const { container } = renderPage();
    const cards = [...container.querySelectorAll('details')];
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach(card => {
      expect(card.open).toBe(false);
      expect(within(card).getByText('Focus Areas')).toBeTruthy();
      const site = within(card).getByText(/Visit Website/).closest('a')!;
      expect(site.getAttribute('href')).toMatch(/^https?:\/\//);
      // The link sits in the body, not inside the summary.
      expect(site.closest('summary')).toBeNull();
    });
  });

  it('an organisation opens and closes natively', () => {
    renderPage();
    const card = screen.getByText('Uyghur Human Rights Project').closest('details')!;
    fireEvent.click(screen.getByText('Uyghur Human Rights Project'));
    expect(card.open).toBe(true);
    fireEvent.click(screen.getByText('Uyghur Human Rights Project'));
    expect(card.open).toBe(false);
  });

  it('puts no link inside a button, and no JavaScript-only expanders', () => {
    // Each card used to be one <button> with the website link inside it.
    const { container } = renderPage();
    expect(container.querySelectorAll('button a, [aria-expanded]')).toHaveLength(0);
  });

  // --- No Results ---

  it('shows no results message for unmatched search', () => {
    renderPage();
    const searchInput = screen.getByPlaceholderText('Search organizations...');
    fireEvent.change(searchInput, { target: { value: 'zzzznonexistent' } });
    expect(screen.getByText('No organizations found matching your criteria')).toBeTruthy();
  });

  // --- Footer & Subcomponents ---

  it('renders footer with showing count', () => {
    renderPage();
    expect(screen.getByText(/Showing \d+ of \d+ verified organizations/)).toBeTruthy();
  });

  it('renders footer help text', () => {
    renderPage();
    expect(screen.getByText(/All organizations are independently verified/)).toBeTruthy();
  });

  it('renders IPACMembers section', () => {
    renderPage();
    expect(screen.getByTestId('ipac-members')).toBeTruthy();
  });

  it('renders GlobalDisclaimer (sensitive type)', () => {
    renderPage();
    expect(screen.getByText('Security Notice')).toBeTruthy();
    expect(screen.getByText(/Verify organizations independently/)).toBeTruthy();
  });

  // --- No framer-motion ---

  it('does not use framer-motion', () => {
    const { container } = renderPage();
    const motionElements = container.querySelectorAll('[data-projection-id]');
    expect(motionElements.length).toBe(0);
  });

  // --- No hashtags ---

  it('contains no hashtags in rendered content', () => {
    const { container } = renderPage();
    const text = container.textContent;
    expect(text).not.toMatch(/#\w+/);
  });
});
