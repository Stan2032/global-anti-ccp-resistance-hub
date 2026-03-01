import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock SourceAttribution to simplify rendering
vi.mock('../components/ui/SourceAttribution', () => ({
  default: ({ source }) => <span data-testid="source-attribution">{source?.name || 'source'}</span>,
}));

import SanctionsTracker from '../components/SanctionsTracker';
import sanctionsData from '../data/sanctions_tracker.json';

describe('SanctionsTracker', () => {
  // --- Rendering ---

  it('renders the tracker header', () => {
    render(<SanctionsTracker />);
    expect(screen.getByText('Global Sanctions Tracker')).toBeTruthy();
    expect(screen.getByText(/Monitoring international sanctions on CCP officials/)).toBeTruthy();
  });

  it('renders stats with correct total count', () => {
    render(<SanctionsTracker />);
    const total = sanctionsData.sanctions.length;
    expect(screen.getByText(String(total))).toBeTruthy();
    expect(screen.getByText('Total Sanctions')).toBeTruthy();
  });

  it('renders individual/entity/country stats', () => {
    render(<SanctionsTracker />);
    expect(screen.getByText('Individuals')).toBeTruthy();
    expect(screen.getByText('Entities')).toBeTruthy();
    expect(screen.getByText('Countries')).toBeTruthy();
  });

  // --- Country Filters ---

  it('renders all country filter buttons', () => {
    render(<SanctionsTracker />);
    expect(screen.getByText('All Countries')).toBeTruthy();
    expect(screen.getByText('United States')).toBeTruthy();
    expect(screen.getByText('United Kingdom')).toBeTruthy();
    expect(screen.getByText('European Union')).toBeTruthy();
    expect(screen.getByText('Canada')).toBeTruthy();
    expect(screen.getByText('Australia')).toBeTruthy();
  });

  it('shows all sanctions by default', () => {
    render(<SanctionsTracker />);
    // Use unique (single-occurrence) targets that only appear once
    // Carrie Lam is US-only, appears exactly once in the data
    expect(screen.getByText('Carrie Lam')).toBeTruthy();
    // Xinjiang Public Security Bureau is UK-only
    expect(screen.getByText('Xinjiang Public Security Bureau')).toBeTruthy();
  });

  it('filters sanctions when a country is clicked', () => {
    render(<SanctionsTracker />);
    // Click "United States"
    fireEvent.click(screen.getByText('United States'));
    
    // US-only target (Carrie Lam) should be visible
    expect(screen.getByText('Carrie Lam')).toBeTruthy();
    
    // UK-only target should NOT be visible
    expect(screen.queryByText('Xinjiang Public Security Bureau')).toBeNull();
  });

  it('returns to all sanctions when All Countries is clicked', () => {
    render(<SanctionsTracker />);
    // Filter to US first
    fireEvent.click(screen.getByText('United States'));
    // UK target should be hidden
    expect(screen.queryByText('Xinjiang Public Security Bureau')).toBeNull();
    // Return to all
    fireEvent.click(screen.getByText('All Countries'));
    // Now UK target should be visible again
    expect(screen.getByText('Xinjiang Public Security Bureau')).toBeTruthy();
  });

  // --- Type Filters ---

  it('renders all sanction type filter buttons', () => {
    render(<SanctionsTracker />);
    expect(screen.getByText('All Types')).toBeTruthy();
    expect(screen.getByText('Individual Sanctions')).toBeTruthy();
    expect(screen.getByText('Entity Sanctions')).toBeTruthy();
    expect(screen.getByText('Trade Restrictions')).toBeTruthy();
    expect(screen.getByText('Visa Bans')).toBeTruthy();
  });

  it('filters by sanction type when type button is clicked', () => {
    render(<SanctionsTracker />);
    
    // Hikvision is US-only entity, Carrie Lam is US-only individual
    // Filter to entity sanctions only
    fireEvent.click(screen.getByText('Entity Sanctions'));
    
    // Entity target should be visible
    expect(screen.getByText('Hikvision')).toBeTruthy();
    
    // Individual-only target should NOT be visible
    expect(screen.queryByText('Carrie Lam')).toBeNull();
  });

  // --- Combined Filters ---

  it('combines country and type filters', () => {
    render(<SanctionsTracker />);
    
    // Filter to US + Entity — should show Hikvision but not UK individual
    fireEvent.click(screen.getByText('United States'));
    fireEvent.click(screen.getByText('Entity Sanctions'));
    
    // US entity should be visible
    expect(screen.getByText('Hikvision')).toBeTruthy();
    
    // US individual should be hidden
    expect(screen.queryByText('Carrie Lam')).toBeNull();
    // UK individual should be hidden
    expect(screen.queryByText('Xinjiang Public Security Bureau')).toBeNull();
  });

  // --- Sanction Details ---

  it('shows sanction details for each entry', () => {
    render(<SanctionsTracker />);
    // Use Carrie Lam — unique US-only individual
    // Target name
    expect(screen.getByText('Carrie Lam')).toBeTruthy();
    // Role (unique to Carrie Lam)
    const carrieLam = sanctionsData.sanctions.find(s => s.target === 'Carrie Lam');
    expect(screen.getByText(carrieLam.role)).toBeTruthy();
    // Reason may be shared across entries, so use getAllByText
    expect(screen.getAllByText(carrieLam.reason).length).toBeGreaterThanOrEqual(1);
    // Date
    expect(screen.getAllByText(carrieLam.date).length).toBeGreaterThanOrEqual(1);
  });

  it('renders law links for sanctions with known laws', () => {
    render(<SanctionsTracker />);
    
    // Find a sanction with a law that has a link
    const sanctionWithLaw = sanctionsData.sanctions.find(
      s => sanctionsData.law_links[s.law]
    );
    
    if (sanctionWithLaw) {
      // The law name should appear as a clickable link
      const lawLinks = screen.getAllByText(new RegExp(sanctionWithLaw.law.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      expect(lawLinks.length).toBeGreaterThanOrEqual(1);
    }
  });

  // --- Call to Action ---

  it('renders the call-to-action section', () => {
    render(<SanctionsTracker />);
    expect(screen.getByText('Advocate for More Sanctions')).toBeTruthy();
    expect(screen.getByText('Contact Representatives')).toBeTruthy();
    expect(screen.getByText('CECC Victims Database')).toBeTruthy();
  });

  it('links to CECC Victims Database with external target', () => {
    render(<SanctionsTracker />);
    const ceccLink = screen.getByText('CECC Victims Database').closest('a');
    expect(ceccLink.href).toBe('https://www.cecc.gov/victims-database');
    expect(ceccLink.target).toBe('_blank');
    expect(ceccLink.rel).toContain('noopener');
  });

  // --- Sources ---

  it('renders the sources section with last verified date', () => {
    render(<SanctionsTracker />);
    expect(screen.getByText('Sources')).toBeTruthy();
    expect(screen.getByText(new RegExp(sanctionsData.metadata.last_verified))).toBeTruthy();
  });
});
