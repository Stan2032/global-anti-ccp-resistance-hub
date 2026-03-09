// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import TransnationalRepressionTracker from '../components/TransnationalRepressionTracker';

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

  // ── View Toggle ────────────────────────────────────────
  it('renders all view toggle buttons', () => {
    render(<TransnationalRepressionTracker />);
    expect(screen.getByText('Threat Overview')).toBeTruthy();
    expect(screen.getByText('Operations Map')).toBeTruthy();
    expect(screen.getByText('Government Responses')).toBeTruthy();
  });

  it('Threat Overview is active by default', () => {
    render(<TransnationalRepressionTracker />);
    const btn = screen.getByText('Threat Overview').closest('button');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });

  it('clicking Operations Map switches view', () => {
    render(<TransnationalRepressionTracker />);
    fireEvent.click(screen.getByText('Operations Map'));
    const btn = screen.getByText('Operations Map').closest('button');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });

  it('clicking Government Responses switches view', () => {
    render(<TransnationalRepressionTracker />);
    fireEvent.click(screen.getByText('Government Responses'));
    const btn = screen.getByText('Government Responses').closest('button');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
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
  it('renders country cards in overview', () => {
    render(<TransnationalRepressionTracker />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    expect(expandBtns.length).toBeGreaterThan(0);
  });

  it('clicking a country card expands it', () => {
    render(<TransnationalRepressionTracker />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('clicking expanded country card collapses it', () => {
    render(<TransnationalRepressionTracker />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('expanded card shows police station details', () => {
    render(<TransnationalRepressionTracker />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    // Should show Police Stations section header
    expect(screen.getAllByText(/Police Stations/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Operations Map View ────────────────────────────────
  it('operations view shows operation type headers', () => {
    render(<TransnationalRepressionTracker />);
    fireEvent.click(screen.getByText('Operations Map'));
    expect(screen.getByText('Overseas Police Stations')).toBeTruthy();
  });

  it('operations view groups countries by operation type', () => {
    render(<TransnationalRepressionTracker />);
    fireEvent.click(screen.getByText('Operations Map'));
    // Should show country counts for operation types
    const countLabels = screen.getAllByText(/\d+ countr/);
    expect(countLabels.length).toBeGreaterThan(0);
  });

  // ── Government Responses View ──────────────────────────
  it('responses view shows response categories', () => {
    render(<TransnationalRepressionTracker />);
    fireEvent.click(screen.getByText('Government Responses'));
    expect(screen.getAllByText('Enforcement Action').length).toBeGreaterThanOrEqual(1);
  });

  it('responses view shows country response details', () => {
    render(<TransnationalRepressionTracker />);
    fireEvent.click(screen.getByText('Government Responses'));
    // Should show station/case counts for countries
    const stationLabels = screen.getAllByText(/\d+ station/);
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
    const text = navigator.clipboard.writeText.mock.calls[0][0];
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

  it('view toggle group has aria-label', () => {
    render(<TransnationalRepressionTracker />);
    expect(screen.getByRole('group', { name: 'View options' })).toBeTruthy();
  });

  it('view buttons have aria-pressed attribute', () => {
    render(<TransnationalRepressionTracker />);
    const viewBtns = screen.getByRole('group', { name: 'View options' }).querySelectorAll('button');
    viewBtns.forEach(btn => {
      expect(btn.getAttribute('aria-pressed')).toBeTruthy();
    });
  });

  it('country cards have aria-expanded attribute', () => {
    render(<TransnationalRepressionTracker />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    expandBtns.forEach(btn => {
      expect(btn.getAttribute('aria-expanded')).toBe('false');
    });
  });
});
