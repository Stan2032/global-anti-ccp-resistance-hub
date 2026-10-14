import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock GlobalDisclaimer
vi.mock('../components/ui/GlobalDisclaimer', () => ({
  default: ({ type }: { type: string }) => <div data-testid="disclaimer">{type}</div>,
}));

import ForcedLabourList from '../components/ForcedLabourList';

describe('ForcedLabourList', () => {
  it('renders the header with title', () => {
    render(<ForcedLabourList />);
    expect(screen.getByText('Companies Implicated in Forced Labour')).toBeTruthy();
  });

  it('renders category filter buttons', () => {
    render(<ForcedLabourList />);
    expect(screen.getByText('All')).toBeTruthy();
    expect(screen.getByText('Apparel & Fashion')).toBeTruthy();
    expect(screen.getByText('Technology')).toBeTruthy();
    expect(screen.getByText('Automotive')).toBeTruthy();
  });

  it('renders search input', () => {
    render(<ForcedLabourList />);
    expect(screen.getByPlaceholderText('Search implicated companies...')).toBeTruthy();
  });

  it('renders company cards', () => {
    render(<ForcedLabourList />);
    expect(screen.getByText('Nike')).toBeTruthy();
    expect(screen.getByText('Apple')).toBeTruthy();
    expect(screen.getByText('Volkswagen')).toBeTruthy();
  });

  it('renders status badges', () => {
    render(<ForcedLabourList />);
    expect(screen.getAllByText('IMPLICATED').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CRITICAL').length).toBeGreaterThan(0);
  });

  it('filters companies by category', () => {
    render(<ForcedLabourList />);
    fireEvent.click(screen.getByText('Technology'));
    expect(screen.getByText('Apple')).toBeTruthy();
    expect(screen.getByText('Huawei')).toBeTruthy();
    expect(screen.queryByText('Nike')).toBeFalsy();
    expect(screen.queryByText('Volkswagen')).toBeFalsy();
  });

  it('filters companies by search query', () => {
    render(<ForcedLabourList />);
    const searchInput = screen.getByPlaceholderText('Search implicated companies...');
    fireEvent.change(searchInput, { target: { value: 'Nike' } });
    expect(screen.getByText('Nike')).toBeTruthy();
    expect(screen.queryByText('Apple')).toBeFalsy();
  });

  it('shows no results for non-matching search', () => {
    render(<ForcedLabourList />);
    const searchInput = screen.getByPlaceholderText('Search implicated companies...');
    fireEvent.change(searchInput, { target: { value: 'zzzznonexistent' } });
    expect(screen.getByText('No companies found matching your search.')).toBeTruthy();
  });

  // Each company's ethical alternatives appeared only after a click that
  // needed JavaScript. They are in the page now, in a closed native
  // disclosure named after the company.
  it("puts each company's ethical alternatives in the page, in a closed native disclosure", () => {
    render(<ForcedLabourList />);
    const disclosures = screen.getAllByText(/Ethical Alternatives/).map(s => s.closest('details')!);
    expect(disclosures.length).toBeGreaterThan(0);
    expect(disclosures.every(d => d && !d.open)).toBe(true);
    // Before any click, Nike's alternatives are in its disclosure.
    expect(disclosures[0].textContent).toMatch(/New Balance/);
    expect(disclosures[0].querySelector('summary')!.textContent).toMatch(/to Nike/);
  });

  it('opens and closes the alternatives natively', () => {
    render(<ForcedLabourList />);
    const summary = screen.getAllByText(/Ethical Alternatives/)[0];
    const disclosure = summary.closest('details')!;
    fireEvent.click(summary);
    expect(disclosure.open).toBe(true);
    fireEvent.click(summary);
    expect(disclosure.open).toBe(false);
  });

  it('renders data sources section', () => {
    render(<ForcedLabourList />);
    expect(screen.getByText('Data Sources:')).toBeTruthy();
  });

  it('renders disclaimer section', () => {
    render(<ForcedLabourList />);
    expect(screen.getByText('Important Disclaimer')).toBeTruthy();
  });
});
