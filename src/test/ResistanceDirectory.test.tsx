import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('expands organization details on click', () => {
    renderPage();
    // Click first organization card
    const orgCard = screen.getByText('Uyghur Human Rights Project').closest('button');
    fireEvent.click(orgCard!);
    // Should show expanded details with focus areas and visit link
    expect(screen.getByText('Focus Areas')).toBeTruthy();
    expect(screen.getByText('Visit Website')).toBeTruthy();
  });

  it('collapses organization details on second click', () => {
    renderPage();
    const orgCard = screen.getByText('Uyghur Human Rights Project').closest('button');
    fireEvent.click(orgCard!);
    expect(screen.getByText('Visit Website')).toBeTruthy();
    fireEvent.click(orgCard!);
    expect(screen.queryByText('Visit Website')).toBeNull();
  });

  it('shows aria-expanded on org cards', () => {
    renderPage();
    const orgCard = screen.getByText('Uyghur Human Rights Project').closest('button');
    expect(orgCard!.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(orgCard!);
    expect(orgCard!.getAttribute('aria-expanded')).toBe('true');
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
