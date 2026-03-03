import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ForcedLaborTracker from '../components/ForcedLaborTracker';

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

  it('renders company names from data', () => {
    render(<ForcedLaborTracker />);
    const companyElements = screen.getAllByRole('heading', { level: 4 });
    expect(companyElements.length).toBeGreaterThanOrEqual(1);
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

  it('expands company details on click', () => {
    render(<ForcedLaborTracker />);
    const companyHeaders = screen.getAllByRole('heading', { level: 4 });
    const companyButton = companyHeaders[0].closest('button') || companyHeaders[0].parentElement.closest('button');
    if (companyButton) {
      fireEvent.click(companyButton);
      expect(screen.getAllByText(/Evidence|Company Response|View Source/i).length).toBeGreaterThanOrEqual(1);
    }
  });

  // --- Footer ---

  it('renders data sources in footer', () => {
    render(<ForcedLaborTracker />);
    expect(screen.getByText(/Data from ASPI/)).toBeTruthy();
  });
});
