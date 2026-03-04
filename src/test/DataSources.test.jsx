import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock lazy-loaded DataExport component
vi.mock('../components/DataExport', () => ({ default: () => <div>DataExport</div> }));

import DataSources from '../pages/DataSources';

const renderPage = () =>
  render(
    <MemoryRouter>
      <DataSources />
    </MemoryRouter>
  );

describe('DataSources', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Header ---

  it('renders the page header', () => {
    renderPage();
    expect(screen.getByText('Data Sources & Methodology')).toBeTruthy();
  });

  it('renders the subtitle about verified sources', () => {
    renderPage();
    expect(screen.getByText(/never display simulated, fake, or placeholder data/)).toBeTruthy();
  });

  // --- Our Commitment ---

  it('renders transparency commitment section', () => {
    renderPage();
    expect(screen.getByText('Our Commitment to Transparency')).toBeTruthy();
    expect(screen.getByText(/transparency builds trust/)).toBeTruthy();
  });

  it('renders all four commitment checkmarks', () => {
    renderPage();
    expect(screen.getByText('All sources verified and linked')).toBeTruthy();
    expect(screen.getByText('No simulated or fake data')).toBeTruthy();
    expect(screen.getByText('Regular updates and verification')).toBeTruthy();
    expect(screen.getByText('Clear methodology documentation')).toBeTruthy();
  });

  // --- Live RSS Feeds ---

  it('renders live RSS feeds section', () => {
    renderPage();
    expect(screen.getByText('Live Intelligence Feeds (RSS)')).toBeTruthy();
    expect(screen.getByText(/live intelligence feed aggregates real-time/)).toBeTruthy();
  });

  it('renders RSS source cards from JSON data', () => {
    renderPage();
    // First RSS source should always be present
    expect(screen.getByText('Hong Kong Free Press')).toBeTruthy();
  });

  it('renders credibility badges on RSS sources', () => {
    renderPage();
    const badges = screen.getAllByText(/Credibility/);
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  // --- Major Data Sources ---

  it('renders major data sources section', () => {
    renderPage();
    expect(screen.getByText('Major Data Sources by Category')).toBeTruthy();
  });

  it('renders major source categories from JSON data', () => {
    renderPage();
    // Check at least one category renders
    const categoryElements = screen.getAllByText(/Data File:/);
    expect(categoryElements.length).toBeGreaterThanOrEqual(1);
  });

  // --- Export Data ---

  it('renders export data section', () => {
    renderPage();
    expect(screen.getByText('Export Data')).toBeTruthy();
    expect(screen.getByText(/Download our verified datasets/)).toBeTruthy();
  });

  it('renders lazy-loaded DataExport component', () => {
    renderPage();
    // Should show at least one loading indicator for DataExport
    const loaders = screen.getAllByText('$ loading');
    expect(loaders.length).toBeGreaterThanOrEqual(1);
  });

  // --- Documentation ---

  it('renders complete documentation section', () => {
    renderPage();
    expect(screen.getByText('Complete Documentation')).toBeTruthy();
    expect(screen.getByText(/detailed information about our data collection/)).toBeTruthy();
  });

  it('renders link to DATA_SOURCES.md', () => {
    renderPage();
    expect(screen.getByText('View Full DATA_SOURCES.md')).toBeTruthy();
  });

  // --- Report Issues ---

  it('renders issue reporting section', () => {
    renderPage();
    expect(screen.getByText('Found an Issue?')).toBeTruthy();
    expect(screen.getByText('Report on GitHub')).toBeTruthy();
  });

  // --- No framer-motion ---

  it('does not use framer-motion (no motion elements)', () => {
    const { container } = renderPage();
    const motionElements = container.querySelectorAll('[data-projection-id]');
    expect(motionElements.length).toBe(0);
  });
});
