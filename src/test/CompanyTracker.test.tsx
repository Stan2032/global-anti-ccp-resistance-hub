import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import CompanyTracker from '../components/CompanyTracker';

// Mock SourceAttribution and SourcesList (CompanyTracker imports both)
vi.mock('../components/ui/SourceAttribution', () => ({
  default: ({ source }: any) => <div data-testid="source-attribution">{source?.name}</div>,
  SourcesList: ({ sources }: any) => <div data-testid="sources-list">{sources?.length} sources</div>,
}));

// Mock GlobalDisclaimer
vi.mock('../components/ui/GlobalDisclaimer', () => ({
  default: ({ type }: any) => <div data-testid="disclaimer">{type}</div>,
}));

describe('CompanyTracker', () => {
  // --- Header ---

  it('renders the header with title', () => {
    render(<CompanyTracker />);
    expect(screen.getByText('Company Accountability Tracker')).toBeTruthy();
    expect(screen.getByText('Track corporate complicity in CCP human rights abuses')).toBeTruthy();
  });

  // --- Stats ---

  it('renders company statistics', () => {
    render(<CompanyTracker />);
    expect(screen.getByText('Companies Tracked')).toBeTruthy();
    // "Avoid", "Concern", "Improving" appear in both stats and badge labels — use getAllByText
    expect(screen.getAllByText('Avoid').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Concern').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Improving').length).toBeGreaterThanOrEqual(1);
  });

  // --- Search ---

  it('renders search input', () => {
    render(<CompanyTracker />);
    expect(screen.getByPlaceholderText('Search companies...')).toBeTruthy();
  });

  it('filters companies by search term', () => {
    render(<CompanyTracker />);
    const searchInput = screen.getByPlaceholderText('Search companies...');
    fireEvent.change(searchInput, { target: { value: 'Hikvision' } });
    expect(screen.getByText('Hikvision')).toBeTruthy();
    // Non-matching companies should be hidden
    expect(screen.queryByText('TikTok (ByteDance)')).toBeFalsy();
  });

  it('shows no results for non-matching search', () => {
    render(<CompanyTracker />);
    const searchInput = screen.getByPlaceholderText('Search companies...');
    fireEvent.change(searchInput, { target: { value: 'zzzznonexistent' } });
    // The grid should be empty — check that specific companies are gone
    expect(screen.queryByText('Hikvision')).toBeFalsy();
    expect(screen.queryByText('TikTok (ByteDance)')).toBeFalsy();
  });

  // --- Category Filter ---

  it('renders category filter buttons', () => {
    render(<CompanyTracker />);
    expect(screen.getByText('All Companies')).toBeTruthy();
    expect(screen.getByText('Fashion & Apparel')).toBeTruthy();
    expect(screen.getByText('Technology')).toBeTruthy();
    expect(screen.getByText('Automotive')).toBeTruthy();
    expect(screen.getByText('Retail')).toBeTruthy();
  });

  it('filters companies by category', () => {
    render(<CompanyTracker />);
    fireEvent.click(screen.getByText('Technology'));
    // Tech companies should be visible
    expect(screen.getByText('Hikvision')).toBeTruthy();
    // Non-tech hardcoded companies like TikTok are also categorized as tech,
    // so check a non-tech company is hidden
    expect(screen.queryByText('SHEIN')).toBeFalsy();
  });

  // --- Company Cards ---

  it('renders hardcoded company cards', () => {
    render(<CompanyTracker />);
    // Check some hardcoded companies
    expect(screen.getByText('Hikvision')).toBeTruthy();
    expect(screen.getByText('TikTok (ByteDance)')).toBeTruthy();
  });

  it('shows source attribution for companies', () => {
    render(<CompanyTracker />);
    const sources = screen.getAllByTestId('source-attribution');
    expect(sources.length).toBeGreaterThan(0);
  });

  // --- Status Legend ---

  it('renders the status legend', () => {
    render(<CompanyTracker />);
    expect(screen.getByText('Status Legend')).toBeTruthy();
    expect(screen.getByText('Documented serious concerns, recommend avoiding')).toBeTruthy();
    expect(screen.getByText('Documented concerns, needs improvement')).toBeTruthy();
    expect(screen.getByText('Taking steps to address issues')).toBeTruthy();
  });

  // --- Resources ---

  it('renders key research sources', () => {
    render(<CompanyTracker />);
    expect(screen.getByText(/Primary Source: ASPI/)).toBeTruthy();
    expect(screen.getByText('View Full Report')).toBeTruthy();
  });

  it('ASPI report link opens in new tab', () => {
    render(<CompanyTracker />);
    const aspiLink = screen.getByText('View Full Report').closest('a');
    expect(aspiLink!.getAttribute('target')).toBe('_blank');
    expect(aspiLink!.getAttribute('rel')).toContain('noopener');
    expect(aspiLink!.getAttribute('href')).toBe('https://www.aspi.org.au/report/uyghurs-sale');
  });

  // --- Disclaimer ---

  it('renders the disclaimer', () => {
    render(<CompanyTracker />);
    expect(screen.getByTestId('disclaimer')).toBeTruthy();
  });
});
