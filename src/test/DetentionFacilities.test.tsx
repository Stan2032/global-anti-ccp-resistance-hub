// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock SourceAttribution to simplify rendering
vi.mock('../components/ui/SourceAttribution', () => ({
  default: ({ source }) => <span data-testid="source">{source?.name || 'source'}</span>,
  SourcesList: ({ sources, title }) => (
    <div data-testid="sources-list">
      <span>{title}</span>
      <span>{sources?.length || 0} sources</span>
    </div>
  ),
}));

import DetentionFacilities from '../components/DetentionFacilities';

describe('DetentionFacilities', () => {
  // --- Rendering ---

  it('renders the header', () => {
    render(<DetentionFacilities />);
    expect(screen.getByText('Detention Facility Database')).toBeTruthy();
    expect(screen.getByText('Documented detention centers, prisons, and internment camps')).toBeTruthy();
  });

  it('shows content warning', () => {
    render(<DetentionFacilities />);
    expect(screen.getByText('Sensitive Content Warning')).toBeTruthy();
    expect(screen.getByText(/severe human rights abuses/)).toBeTruthy();
  });

  it('renders facility count statistics', () => {
    render(<DetentionFacilities />);
    // '11' appears twice: total facilities and active facilities (all 11 are active)
    expect(screen.getAllByText('11').length).toBe(2);
    expect(screen.getByText('Facilities Documented')).toBeTruthy();
  });

  it('renders active facilities count', () => {
    render(<DetentionFacilities />);
    expect(screen.getByText('Active Facilities')).toBeTruthy();
  });

  it('renders region count', () => {
    render(<DetentionFacilities />);
    expect(screen.getByText('Regions')).toBeTruthy();
    // 4 unique regions: Xinjiang, Tibet, Hong Kong, Mainland China
    expect(screen.getByText('4')).toBeTruthy();
  });

  // --- Facility Cards ---

  it('renders facility names in the grid', () => {
    render(<DetentionFacilities />);
    expect(screen.getByText('Dabancheng Internment Camp')).toBeTruthy();
  });

  it('renders facility types as badges', () => {
    render(<DetentionFacilities />);
    expect(screen.getAllByText('Internment Camp').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Prison').length).toBeGreaterThan(0);
  });

  // --- Filters ---

  it('renders search input', () => {
    render(<DetentionFacilities />);
    expect(screen.getByPlaceholderText('Search facilities...')).toBeTruthy();
  });

  it('filters facilities by search query', () => {
    render(<DetentionFacilities />);
    const searchInput = screen.getByPlaceholderText('Search facilities...');
    fireEvent.change(searchInput, { target: { value: 'Dabancheng' } });
    expect(screen.getByText('Dabancheng Internment Camp')).toBeTruthy();
    // Other facilities should be filtered out
    expect(screen.queryByText('Drapchi Prison')).toBeFalsy();
  });

  it('shows empty state when no facilities match search', () => {
    render(<DetentionFacilities />);
    const searchInput = screen.getByPlaceholderText('Search facilities...');
    fireEvent.change(searchInput, { target: { value: 'zzzznonexistent' } });
    expect(screen.getByText('No facilities match your search')).toBeTruthy();
  });

  it('filters by region dropdown', () => {
    render(<DetentionFacilities />);
    const regionSelects = screen.getAllByLabelText('Region filter');
    // First dropdown is region filter
    fireEvent.change(regionSelects[0], { target: { value: 'Tibet' } });
    expect(screen.getByText('Drapchi Prison')).toBeTruthy();
    // Xinjiang facilities should be hidden
    expect(screen.queryByText('Dabancheng Internment Camp')).toBeFalsy();
  });

  it('filters by type dropdown', () => {
    render(<DetentionFacilities />);
    const regionSelects = screen.getAllByLabelText('Region filter');
    // Second dropdown is type filter (both have same aria-label)
    fireEvent.change(regionSelects[1], { target: { value: 'Internment Camp' } });
    expect(screen.getByText('Dabancheng Internment Camp')).toBeTruthy();
    // Non-camp facilities should be hidden
    expect(screen.queryByText('Drapchi Prison')).toBeFalsy();
  });

  // --- Detail View ---

  it('shows detail view when facility card is clicked', () => {
    render(<DetentionFacilities />);
    fireEvent.click(screen.getByText('Dabancheng Internment Camp'));
    // Detail view should show back button
    expect(screen.getByText('← Back to all facilities')).toBeTruthy();
    // Should show facility name as heading
    expect(screen.getByText('Estimated Capacity')).toBeTruthy();
    expect(screen.getByText('First Documented')).toBeTruthy();
    expect(screen.getByText('Description')).toBeTruthy();
  });

  it('detail view shows evidence section', () => {
    render(<DetentionFacilities />);
    fireEvent.click(screen.getByText('Dabancheng Internment Camp'));
    expect(screen.getByText('Documented Evidence')).toBeTruthy();
  });

  it('back button returns to facility list', () => {
    render(<DetentionFacilities />);
    fireEvent.click(screen.getByText('Dabancheng Internment Camp'));
    expect(screen.getByText('← Back to all facilities')).toBeTruthy();
    fireEvent.click(screen.getByText('← Back to all facilities'));
    // Should be back in list view
    expect(screen.getByText('Detention Facility Database')).toBeTruthy();
    expect(screen.getByText('Facilities Documented')).toBeTruthy();
  });

  // --- Evidence Toggle ---

  it('toggles evidence section collapse', () => {
    render(<DetentionFacilities />);
    fireEvent.click(screen.getByText('Dabancheng Internment Camp'));
    // Evidence starts expanded (evidence: true in setExpandedSections)
    const toggleButton = screen.getByText('Documented Evidence').closest('button');
    expect(toggleButton).toBeTruthy();
    // Click to collapse
    fireEvent.click(toggleButton);
    // Click again to expand
    fireEvent.click(toggleButton);
    // Should still show evidence header
    expect(screen.getByText('Documented Evidence')).toBeTruthy();
  });

  // --- Research Resources ---

  it('renders research resource links', () => {
    render(<DetentionFacilities />);
    expect(screen.getByText('ASPI Xinjiang Data Project')).toBeTruthy();
    expect(screen.getByText('Xinjiang Police Files')).toBeTruthy();
    expect(screen.getByText('Xinjiang Victims Database')).toBeTruthy();
  });

  it('resource links use HTTPS and open in new tab', () => {
    render(<DetentionFacilities />);
    const aspiLink = screen.getByText('ASPI Xinjiang Data Project').closest('a');
    expect(aspiLink.getAttribute('href')).toBe('https://xjdp.aspi.org.au/');
    expect(aspiLink.getAttribute('target')).toBe('_blank');
    expect(aspiLink.getAttribute('rel')).toContain('noopener');
  });

  // --- Sources List ---

  it('renders the research sources list', () => {
    render(<DetentionFacilities />);
    expect(screen.getByText('Research & Data Sources')).toBeTruthy();
  });
});
