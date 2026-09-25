import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import TransnationalRepressionTracker from '../components/TransnationalRepressionTracker';
import { cardsIn, expectDisclosureSections, inSection } from './helpers/disclosure';

// Mock clipboard
Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

describe('TransnationalRepressionTracker', () => {
  // ── Rendering ──────────────────────────────────────────
  it('renders the section title', () => {
    render(<TransnationalRepressionTracker />);
    expect(screen.getByText('Transnational Repression Tracker')).toBeTruthy();
  });

  it('has section aria-label', () => {
    render(<TransnationalRepressionTracker />);
    expect(screen.getByRole('region', { name: 'Transnational Repression Tracker' })).toBeTruthy();
  });

  it('renders description with dataset counts', () => {
    render(<TransnationalRepressionTracker />);
    expect(screen.getAllByText(/police stations/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/legal cases/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/country responses/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Stat Bar ───────────────────────────────────────────
  it('displays countries affected stat', () => {
    render(<TransnationalRepressionTracker />);
    expect(screen.getAllByText(/countries affected/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays active stations stat', () => {
    render(<TransnationalRepressionTracker />);
    expect(screen.getAllByText(/active station/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays stations closed stat', () => {
    render(<TransnationalRepressionTracker />);
    expect(screen.getAllByText(/stations closed/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays arrests made stat', () => {
    render(<TransnationalRepressionTracker />);
    expect(screen.getAllByText(/arrests made/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays enforcement actions stat', () => {
    render(<TransnationalRepressionTracker />);
    expect(screen.getAllByText(/enforcement action/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Threat Distribution ────────────────────────────────
  it('renders threat level summary cards', () => {
    render(<TransnationalRepressionTracker />);
    expect(screen.getAllByText('Critical').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('High').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Moderate').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Low').length).toBeGreaterThanOrEqual(1);
  });

  it('displays country count for each threat level', () => {
    render(<TransnationalRepressionTracker />);
    const countryLabels = screen.getAllByText(/countries?$/);
    expect(countryLabels.length).toBeGreaterThanOrEqual(4);
  });

  // ── Sections ──────────────────────────────────────────
  it('renders every view as a native disclosure section', () => {
    render(<TransnationalRepressionTracker />);
    expectDisclosureSections(['Threat Overview', 'Operations Map', 'Government Responses']);
  });

  // ── Search & Filters ──────────────────────────────────
  it('renders search input', () => {
    render(<TransnationalRepressionTracker />);
    expect(screen.getByPlaceholderText('Search countries, cities, cases...')).toBeTruthy();
  });

  it('renders threat level filter dropdown', () => {
    render(<TransnationalRepressionTracker />);
    expect(screen.getByLabelText('Filter by threat level')).toBeTruthy();
  });

  it('renders government response filter dropdown', () => {
    render(<TransnationalRepressionTracker />);
    expect(screen.getByLabelText('Filter by government response')).toBeTruthy();
  });

  it('search filters country list', () => {
    render(<TransnationalRepressionTracker />);
    const input = screen.getByPlaceholderText('Search countries, cities, cases...');
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('No countries match your filters')).toBeTruthy();
  });

  it('search for United Kingdom shows results', () => {
    render(<TransnationalRepressionTracker />);
    const input = screen.getByPlaceholderText('Search countries, cities, cases...');
    fireEvent.change(input, { target: { value: 'United Kingdom' } });
    expect(screen.queryByText('No countries match your filters')).toBeFalsy();
  });

  // ── Country Cards ──────────────────────────────────────
  it('renders country cards as native disclosures', () => {
    render(<TransnationalRepressionTracker />);
    const cards = cardsIn('Threat Overview');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach(card => expect(card.firstElementChild?.tagName).toBe('SUMMARY'));
  });

  it('a country card opens and closes natively', () => {
    render(<TransnationalRepressionTracker />);
    const [card] = cardsIn('Threat Overview');
    expect(card.open).toBe(false);
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(true);
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(false);
  });


  it('shows police station details without a click, wherever a country has them', () => {
    render(<TransnationalRepressionTracker />);
    const withStations = cardsIn('Threat Overview').filter(card => /Police Stations \(\d+\)/.test(card.textContent ?? ''));
    expect(withStations.length).toBeGreaterThan(0);
  });

  // ── Operations Map View ────────────────────────────────
  it('operations view shows operation type headers', () => {
    render(<TransnationalRepressionTracker />);
    const section = inSection('Operations Map');
    expect(section.getByText('Overseas Police Stations')).toBeTruthy();
  });

  it('operations view groups countries by operation type', () => {
    render(<TransnationalRepressionTracker />);
    const section = inSection('Operations Map');
    // Should show country counts for operation types
    const countLabels = section.getAllByText(/\d+ countr/);
    expect(countLabels.length).toBeGreaterThan(0);
  });

  // ── Government Responses View ──────────────────────────
  it('responses view shows response categories', () => {
    render(<TransnationalRepressionTracker />);
    const section = inSection('Government Responses');
    expect(section.getAllByText('Enforcement Action').length).toBeGreaterThanOrEqual(1);
  });

  it('responses view shows country response details', () => {
    render(<TransnationalRepressionTracker />);
    const section = inSection('Government Responses');
    // Should show station/case counts for countries
    const stationLabels = section.getAllByText(/\d+ station/);
    expect(stationLabels.length).toBeGreaterThan(0);
  });

  // ── Clipboard ──────────────────────────────────────────
  it('renders copy report button', () => {
    render(<TransnationalRepressionTracker />);
    expect(screen.getByLabelText('Copy intelligence report to clipboard')).toBeTruthy();
  });

  it('clicking copy button copies report', async () => {
    render(<TransnationalRepressionTracker />);
    const btn = screen.getByLabelText('Copy intelligence report to clipboard');
    fireEvent.click(btn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    const text = vi.mocked(navigator.clipboard.writeText).mock.calls[0][0];
    expect(text).toContain('TRANSNATIONAL REPRESSION TRACKER');
    expect(text).toContain('Countries affected');
    expect(text).toContain('CC BY 4.0');
  });

  // ── Data Integrity ─────────────────────────────────────
  it('displays real country names from data', () => {
    render(<TransnationalRepressionTracker />);
    // US and UK should appear in the tracker (they have police stations)
    const container = screen.getByRole('region', { name: 'Transnational Repression Tracker' });
    expect(container.textContent).toContain('United');
  });

  it('shows threat level for each country', () => {
    render(<TransnationalRepressionTracker />);
    const threatLabels = screen.getAllByText(/Threat$/);
    expect(threatLabels.length).toBeGreaterThan(0);
  });

  it('shows operations count for each country', () => {
    render(<TransnationalRepressionTracker />);
    const opsLabels = screen.getAllByText(/\d+ operation/);
    expect(opsLabels.length).toBeGreaterThan(0);
  });

  // ── No CCP Sources ─────────────────────────────────────
  it('does not reference CCP state media in source URLs', () => {
    render(<TransnationalRepressionTracker />);
    const container = screen.getByRole('region', { name: 'Transnational Repression Tracker' });
    const text = container.textContent.toLowerCase();
    expect(text).not.toContain('xinhua');
    expect(text).not.toContain('cgtn');
    expect(text).not.toContain('global times');
    expect(text).not.toContain('people\'s daily');
    expect(text).not.toContain('china daily');
  });

  // ── Footer ─────────────────────────────────────────────
  it('renders footer with data attribution', () => {
    render(<TransnationalRepressionTracker />);
    expect(screen.getAllByText(/Tier 1-2 sources only/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/CC BY 4.0/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Accessibility ──────────────────────────────────────
  it('search input has aria-label', () => {
    render(<TransnationalRepressionTracker />);
    expect(screen.getByLabelText('Search transnational repression data')).toBeTruthy();
  });

  it('uses native disclosure cards, not JavaScript-only expanders', () => {
    const { container } = render(<TransnationalRepressionTracker />);
    expect(container.querySelectorAll('[aria-expanded]')).toHaveLength(0);
  });
});
