import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

// Mock SourceAttribution to simplify rendering
vi.mock('../components/ui/SourceAttribution', () => ({
  default: ({ source }: { source?: { name?: string } }) => <span data-testid="source">{source?.name || 'source'}</span>,
  SourcesList: ({ sources, title }: { sources?: { name: string }[]; title?: string }) => (
    <div data-testid="sources-list">
      <span>{title}</span>
      <span>{sources?.length || 0} sources</span>
    </div>
  ),
}));

import DetentionFacilities from '../components/DetentionFacilities';
import detentionData from '../data/detention_facilities_research.json';

const FACILITIES = detentionData.facilities;
/** Every facility's card: a native <details> named by its heading. */
const cards = () => [...document.querySelectorAll('details')].filter(d => d.querySelector(':scope > summary > h3'));

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
    expect(screen.getByPlaceholderText('Search detention facilities...')).toBeTruthy();
  });

  it('filters facilities by search query', () => {
    render(<DetentionFacilities />);
    const searchInput = screen.getByPlaceholderText('Search detention facilities...');
    fireEvent.change(searchInput, { target: { value: 'Dabancheng' } });
    expect(screen.getByText('Dabancheng Internment Camp')).toBeTruthy();
    // Other facilities should be filtered out
    expect(screen.queryByText('Drapchi Prison')).toBeFalsy();
  });

  it('shows empty state when no facilities match search', () => {
    render(<DetentionFacilities />);
    const searchInput = screen.getByPlaceholderText('Search detention facilities...');
    fireEvent.change(searchInput, { target: { value: 'zzzznonexistent' } });
    expect(screen.getByText('No facilities match your search')).toBeTruthy();
  });

  it('filters by region dropdown', () => {
    render(<DetentionFacilities />);
    fireEvent.change(screen.getByLabelText('Filter facilities by region'), { target: { value: 'Tibet' } });
    expect(screen.getByText('Drapchi Prison')).toBeTruthy();
    // Xinjiang facilities should be hidden
    expect(screen.queryByText('Dabancheng Internment Camp')).toBeFalsy();
  });

  it('filters by type dropdown', () => {
    render(<DetentionFacilities />);
    fireEvent.change(screen.getByLabelText('Filter facilities by type'), { target: { value: 'Internment Camp' } });
    expect(screen.getByText('Dabancheng Internment Camp')).toBeTruthy();
    // Non-camp facilities should be hidden
    expect(screen.queryByText('Drapchi Prison')).toBeFalsy();
  });

  // --- Every facility, without JavaScript ---
  // Each facility's description, evidence and sources were in a view that
  // replaced the list when a card was clicked, so none of it reached a
  // reader without JavaScript. Each card is a native <details> now.

  it('puts every facility in the page as a closed native disclosure', () => {
    render(<DetentionFacilities />);
    expect(FACILITIES.length).toBeGreaterThan(0);
    expect(cards()).toHaveLength(FACILITIES.length);
    expect(cards().every(d => !d.open)).toBe(true);
    expect(screen.queryByText(/Back to all facilities/)).toBeNull();
  });

  it("puts each facility's description and evidence in the page before any click", () => {
    render(<DetentionFacilities />);
    let evidence = 0;
    for (const facility of FACILITIES) {
      const card = cards().find(d => d.querySelector('summary h3')!.textContent === facility.name)!;
      expect(card, facility.name).toBeTruthy();
      expect(card.textContent).toContain(facility.description);
      for (const item of facility.evidence) expect(card.textContent).toContain(item);
      evidence += facility.evidence.length;
    }
    expect(evidence).toBeGreaterThan(FACILITIES.length);
  });

  it('opens and closes a facility natively', () => {
    render(<DetentionFacilities />);
    const card = cards().find(d => d.querySelector('summary h3')!.textContent === 'Dabancheng Internment Camp')!;
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(true);
    expect(within(card).getByText('Documented Evidence')).toBeTruthy();
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(false);
  });

  // --- Research Resources ---

  // Facilities' own source lists name some of these too, so look in the block.
  const resources = () => within(screen.getByText('Research Resources').parentElement!);

  it('renders research resource links', () => {
    render(<DetentionFacilities />);
    expect(resources().getByText('ASPI Xinjiang Data Project')).toBeTruthy();
    expect(resources().getByText('Xinjiang Police Files')).toBeTruthy();
    expect(resources().getByText('Xinjiang Victims Database')).toBeTruthy();
  });

  it('resource links use HTTPS and open in new tab', () => {
    render(<DetentionFacilities />);
    const aspiLink = resources().getByText('ASPI Xinjiang Data Project').closest('a');
    expect(aspiLink!.getAttribute('href')).toBe('https://xjdp.aspi.org.au/');
    expect(aspiLink!.getAttribute('target')).toBe('_blank');
    expect(aspiLink!.getAttribute('rel')).toContain('noopener');
  });

  // --- Sources List ---

  it('renders the research sources list', () => {
    render(<DetentionFacilities />);
    expect(screen.getByText('Research & Data Sources')).toBeTruthy();
  });
});
