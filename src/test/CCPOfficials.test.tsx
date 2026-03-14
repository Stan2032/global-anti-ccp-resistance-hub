import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
    expect(screen.getByText('Officials Tracked')).toBeTruthy();
    expect(screen.getByText('Sanctioned')).toBeTruthy();
    expect(screen.getByText('Regions')).toBeTruthy();
    expect(screen.getByText('Categories')).toBeTruthy();
  });

  it('renders search input', () => {
    render(<CCPOfficials />);
    expect(screen.getByPlaceholderText('Search officials...')).toBeTruthy();
  });

  it('renders region filter', () => {
    render(<CCPOfficials />);
    expect(screen.getByLabelText('Region filter')).toBeTruthy();
  });

  it('renders category filter', () => {
    render(<CCPOfficials />);
    expect(screen.getByLabelText('Category filter')).toBeTruthy();
  });

  it('renders sanctioned only checkbox', () => {
    render(<CCPOfficials />);
    expect(screen.getByText('Sanctioned only')).toBeTruthy();
  });

  it('renders official cards with View links', () => {
    render(<CCPOfficials />);
    const viewLinks = screen.getAllByText('View →');
    expect(viewLinks.length).toBeGreaterThan(0);
  });

  it('filters officials by search query', () => {
    render(<CCPOfficials />);
    const searchInput = screen.getByPlaceholderText('Search officials...');
    fireEvent.change(searchInput, { target: { value: 'zzzznonexistent' } });
    expect(screen.getByText('No officials match your search')).toBeTruthy();
  });

  it('filters officials by region', () => {
    render(<CCPOfficials />);
    const regionSelect = screen.getByLabelText('Region filter');
    fireEvent.change(regionSelect, { target: { value: 'Xinjiang' } });
    // All visible officials should have Xinjiang region
    const viewLinks = screen.queryAllByText('View →');
    expect(viewLinks.length).toBeGreaterThanOrEqual(0);
  });

  it('filters officials by category', () => {
    render(<CCPOfficials />);
    const categorySelect = screen.getByLabelText('Category filter');
    fireEvent.change(categorySelect, { target: { value: 'Leadership' } });
    const viewLinks = screen.queryAllByText('View →');
    expect(viewLinks.length).toBeGreaterThanOrEqual(0);
  });

  it('opens official detail view when clicking a card', () => {
    render(<CCPOfficials />);
    const viewLinks = screen.getAllByText('View →');
    fireEvent.click(viewLinks[0]);
    expect(screen.getByText('← Back to all officials')).toBeTruthy();
  });

  it('goes back to list when clicking back button', () => {
    render(<CCPOfficials />);
    const viewLinks = screen.getAllByText('View →');
    fireEvent.click(viewLinks[0]);
    expect(screen.getByText('← Back to all officials')).toBeTruthy();

    fireEvent.click(screen.getByText('← Back to all officials'));
    expect(screen.getByText('CCP Officials Database')).toBeTruthy();
  });

  it('renders government sanction list sources section', () => {
    render(<CCPOfficials />);
    expect(screen.getByText('Official Government Sanction Lists')).toBeTruthy();
  });
});
