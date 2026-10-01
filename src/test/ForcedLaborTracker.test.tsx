import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ForcedLaborTracker from '../components/ForcedLaborTracker';
import companiesData from '../data/forced_labor_companies_research.json';

describe('ForcedLaborTracker', () => {
  // --- Structure ---

  it('renders the heading', () => {
    render(<ForcedLaborTracker />);
    expect(screen.getByText('Forced Labor Company Tracker')).toBeTruthy();
  });

  it('renders stat boxes', () => {
    render(<ForcedLaborTracker />);
    expect(screen.getAllByText(/Avoid/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Concern/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders search input', () => {
    render(<ForcedLaborTracker />);
    expect(screen.getByPlaceholderText(/Search companies/)).toBeTruthy();
  });

  it('renders industry filter dropdown', () => {
    render(<ForcedLaborTracker />);
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThanOrEqual(1);
  });

  // --- Company Cards ---

  it('renders every company as a native disclosure, closed to start', () => {
    const { container } = render(<ForcedLaborTracker />);
    expect(container.querySelectorAll('[aria-expanded]')).toHaveLength(0);
    const cards = [...container.querySelectorAll('details')];
    expect(cards).toHaveLength(companiesData.results.length);
    cards.forEach((c, i) => {
      expect(c.firstElementChild?.tagName).toBe('SUMMARY');
      expect(c.open).toBe(false);
      expect(c.querySelector('summary')!.textContent).toContain(companiesData.results[i].output.company);
    });
  });

  it('renders status badges', () => {
    render(<ForcedLaborTracker />);
    // Statuses from the data
    const badges = screen.getAllByText(/Avoid|Concern|Improving|Cleared/);
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  // --- Search ---

  it('filters companies by search query', () => {
    render(<ForcedLaborTracker />);
    const searchInput = screen.getByPlaceholderText(/Search companies/);
    fireEvent.change(searchInput, { target: { value: 'zzzznotfound' } });
    expect(screen.getByText(/No companies found/)).toBeTruthy();
  });

  // --- Expand Details ---

  it('every company carries its evidence and source without a click', () => {
    const { container } = render(<ForcedLaborTracker />);
    const cards = [...container.querySelectorAll('details')];
    const withEvidence = companiesData.results.filter(r => r.output.evidence).length;
    const withSource = companiesData.results.filter(r => r.output.source_url).length;
    expect(withEvidence).toBeGreaterThan(0);
    expect(cards.filter(c => within(c).queryByText('Evidence'))).toHaveLength(withEvidence);
    expect(cards.filter(c => within(c).queryByText('View Source'))).toHaveLength(withSource);
  });

  it('a company card opens and closes natively', () => {
    const { container } = render(<ForcedLaborTracker />);
    const card = container.querySelector('details')!;
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(true);
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(false);
  });

  // --- Footer ---

  it('renders data sources in footer', () => {
    render(<ForcedLaborTracker />);
    expect(screen.getByText(/Data from ASPI/)).toBeTruthy();
  });
});
