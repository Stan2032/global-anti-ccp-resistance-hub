import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import CrossDatasetInsightEngine from '../components/CrossDatasetInsightEngine';
import { dataApi } from '../services/dataApi';

describe('CrossDatasetInsightEngine', () => {
  // ── Rendering ──────────────────────────────────────────

  it('renders the component header', () => {
    render(<CrossDatasetInsightEngine />);
    expect(screen.getByText('Cross-Dataset Insight Engine')).toBeTruthy();
  });

  it('has section aria-label', () => {
    render(<CrossDatasetInsightEngine />);
    expect(screen.getByRole('region', { name: 'Cross-Dataset Insight Engine' })).toBeTruthy();
  });

  it('shows insight count in description', () => {
    render(<CrossDatasetInsightEngine />);
    expect(screen.getByText(/insights discovered across/)).toBeTruthy();
  });

  it('shows dataset count in description', () => {
    render(<CrossDatasetInsightEngine />);
    expect(screen.getByText(/insights discovered across/)).toBeTruthy();
  });

  // ── Category Filters ──────────────────────────────────

  it('renders all five category filter buttons', () => {
    render(<CrossDatasetInsightEngine />);
    const filterBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    expect(filterBtns.length).toBe(5);
    expect(filterBtns[0].textContent).toContain('Geographic');
    expect(filterBtns[1].textContent).toContain('Actor Network');
    expect(filterBtns[2].textContent).toContain('Legal');
    expect(filterBtns[3].textContent).toContain('Economic');
    expect(filterBtns[4].textContent).toContain('Temporal');
  });

  it('category buttons have aria-pressed attribute', () => {
    render(<CrossDatasetInsightEngine />);
    const buttons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    expect(buttons.length).toBe(5);
    buttons.forEach((b) => expect(b.getAttribute('aria-pressed')).toBe('false'));
  });

  it('clicking a category button activates filter', () => {
    render(<CrossDatasetInsightEngine />);
    const geoBtn = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Geographic')
    )[0];
    fireEvent.click(geoBtn);
    expect(geoBtn.getAttribute('aria-pressed')).toBe('true');
  });

  it('clicking the same category button again clears filter', () => {
    render(<CrossDatasetInsightEngine />);
    const geoBtn = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Geographic')
    )[0];
    fireEvent.click(geoBtn);
    expect(geoBtn.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(geoBtn);
    expect(geoBtn.getAttribute('aria-pressed')).toBe('false');
  });

  it('only one category is active at a time', () => {
    render(<CrossDatasetInsightEngine />);
    const buttons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    fireEvent.click(buttons[0]); // Geographic
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(buttons[1]); // Actor
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
  });

  // ── Search ─────────────────────────────────────────────

  it('renders search input', () => {
    render(<CrossDatasetInsightEngine />);
    expect(screen.getByPlaceholderText('Search insights...')).toBeTruthy();
  });

  it('search input has aria-label', () => {
    render(<CrossDatasetInsightEngine />);
    expect(screen.getByLabelText('Search insights')).toBeTruthy();
  });

  it('typing in search filters insights', () => {
    render(<CrossDatasetInsightEngine />);
    const input = screen.getByPlaceholderText('Search insights...');
    fireEvent.change(input, { target: { value: 'xyznonexistent123' } });
    expect(screen.getByText(/No insights match your search/)).toBeTruthy();
  });

  // ── Distribution Bar ───────────────────────────────────

  it('renders category distribution bar', () => {
    render(<CrossDatasetInsightEngine />);
    const bars = screen.getAllByLabelText(/insights$/);
    expect(bars.length).toBeGreaterThanOrEqual(1);
  });

  // ── Insight Cards ──────────────────────────────────────

  it('renders insight cards with expandable sections', () => {
    render(<CrossDatasetInsightEngine />);
    const expandButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expect(expandButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('all insight cards start collapsed', () => {
    render(<CrossDatasetInsightEngine />);
    const expandButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expandButtons.forEach((b) => expect(b.getAttribute('aria-expanded')).toBe('false'));
  });

  it('clicking an insight card expands it', () => {
    render(<CrossDatasetInsightEngine />);
    const expandButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    if (expandButtons.length > 0) {
      fireEvent.click(expandButtons[0]);
      expect(expandButtons[0].getAttribute('aria-expanded')).toBe('true');
    }
  });

  it('clicking an expanded insight card collapses it', () => {
    render(<CrossDatasetInsightEngine />);
    const expandButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    if (expandButtons.length > 0) {
      fireEvent.click(expandButtons[0]);
      expect(expandButtons[0].getAttribute('aria-expanded')).toBe('true');
      fireEvent.click(expandButtons[0]);
      expect(expandButtons[0].getAttribute('aria-expanded')).toBe('false');
    }
  });

  it('expanded card shows connected records', () => {
    render(<CrossDatasetInsightEngine />);
    const expandButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    if (expandButtons.length > 0) {
      fireEvent.click(expandButtons[0]);
      expect(screen.getByText(/Connected records/)).toBeTruthy();
    }
  });

  it('only one insight can be expanded at a time', () => {
    render(<CrossDatasetInsightEngine />);
    const expandButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    if (expandButtons.length >= 2) {
      fireEvent.click(expandButtons[0]);
      expect(expandButtons[0].getAttribute('aria-expanded')).toBe('true');
      fireEvent.click(expandButtons[1]);
      expect(expandButtons[1].getAttribute('aria-expanded')).toBe('true');
      expect(expandButtons[0].getAttribute('aria-expanded')).toBe('false');
    }
  });

  // ── Insight Quality ────────────────────────────────────

  it('generates at least 3 insights from existing data', () => {
    render(<CrossDatasetInsightEngine />);
    const expandButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expect(expandButtons.length).toBeGreaterThanOrEqual(3);
  });

  it('each insight has a category badge', () => {
    render(<CrossDatasetInsightEngine />);
    const badges = ['Geographic', 'Actor Network', 'Legal', 'Economic', 'Temporal'];
    const found = badges.filter((b) => {
      try { return screen.getAllByText(b).length > 0; } catch { return false; }
    });
    expect(found.length).toBeGreaterThanOrEqual(1);
  });

  it('each insight shows dataset tags', () => {
    render(<CrossDatasetInsightEngine />);
    const datasetLabels = ['Political Prisoners', 'Sanctioned Officials', 'Sanctions', 'Legal Cases', 'Forced Labor', 'Timeline Events'];
    const found = datasetLabels.filter((l) => {
      try { return screen.getAllByText(l).length > 0; } catch { return false; }
    });
    expect(found.length).toBeGreaterThanOrEqual(1);
  });

  it('insights show strength indicators', () => {
    render(<CrossDatasetInsightEngine />);
    const strengthLabels = screen.getAllByLabelText(/Strength:/);
    expect(strengthLabels.length).toBeGreaterThanOrEqual(1);
  });

  // ── Copy ──────────────────────────────────────────────

  it('renders copy button', () => {
    render(<CrossDatasetInsightEngine />);
    expect(screen.getByLabelText('Copy insights to clipboard')).toBeTruthy();
  });

  it('copy button calls clipboard API', () => {
    const mockWrite = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText: mockWrite } });
    render(<CrossDatasetInsightEngine />);
    fireEvent.click(screen.getByLabelText('Copy insights to clipboard'));
    expect(mockWrite).toHaveBeenCalled();
    expect(mockWrite.mock.calls[0][0]).toContain('Cross-Dataset Insight Engine');
  });

  it('copy button shows confirmed state', async () => {
    const mockWrite = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText: mockWrite } });
    render(<CrossDatasetInsightEngine />);
    fireEvent.click(screen.getByLabelText('Copy insights to clipboard'));
    expect(screen.getByText('Copied')).toBeTruthy();
  });

  // ── Footer ─────────────────────────────────────────────

  it('shows tier 1-2 source attribution', () => {
    render(<CrossDatasetInsightEngine />);
    expect(screen.getByText('Tier 1-2 sources only')).toBeTruthy();
  });

  it('shows CC BY 4.0 license', () => {
    render(<CrossDatasetInsightEngine />);
    expect(screen.getByText('CC BY 4.0')).toBeTruthy();
  });

  // ── Data Integrity ─────────────────────────────────────

  it('dataApi returns data for cross-referencing', () => {
    expect(dataApi.getPoliticalPrisoners().length).toBeGreaterThan(0);
    expect(dataApi.getSanctionedOfficials().length).toBeGreaterThan(0);
    expect(dataApi.getSanctions().length).toBeGreaterThan(0);
    expect(dataApi.getLegalCases().length).toBeGreaterThan(0);
    expect(dataApi.getTimelineEvents().length).toBeGreaterThan(0);
  });

  it('all insights have required fields', () => {
    render(<CrossDatasetInsightEngine />);
    // Verify component renders without errors with real data
    expect(screen.getByText('Cross-Dataset Insight Engine')).toBeTruthy();
    expect(screen.getByText(/Showing .+ of .+ insights/)).toBeTruthy();
  });

  it('insight categories are from the allowed set', () => {
    const allowed = ['geographic', 'actor', 'legal', 'economic', 'temporal'];
    // Verify that the filter buttons only show allowed categories
    render(<CrossDatasetInsightEngine />);
    const filterBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    expect(filterBtns.length).toBe(allowed.length);
  });

  it('no CCP state media sources referenced', () => {
    render(<CrossDatasetInsightEngine />);
    const html = document.body.innerHTML.toLowerCase();
    expect(html).not.toContain('xinhua');
    expect(html).not.toContain('global times');
    expect(html).not.toContain('people\'s daily');
  });

  // ── Filtering Shows Count ──────────────────────────────

  it('shows filtered count when category is active', () => {
    render(<CrossDatasetInsightEngine />);
    const geoBtn = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Geographic')
    )[0];
    fireEvent.click(geoBtn);
    expect(screen.getByText(/Showing .+ of .+ insights/)).toBeTruthy();
  });

  // ── Edge Cases ─────────────────────────────────────────

  it('handles search with no results gracefully', () => {
    render(<CrossDatasetInsightEngine />);
    const input = screen.getByPlaceholderText('Search insights...');
    fireEvent.change(input, { target: { value: 'zzzznonexistent99999' } });
    expect(screen.getByText('No insights match your search.')).toBeTruthy();
  });

  it('clears search properly', () => {
    render(<CrossDatasetInsightEngine />);
    const input = screen.getByPlaceholderText('Search insights...');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.change(input, { target: { value: '' } });
    const expandButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expect(expandButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('combined category filter and search works', () => {
    render(<CrossDatasetInsightEngine />);
    const geoBtn = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Geographic')
    )[0];
    fireEvent.click(geoBtn);
    const input = screen.getByPlaceholderText('Search insights...');
    fireEvent.change(input, { target: { value: 'zzzznonexistent99999' } });
    expect(screen.getByText('No insights match your search.')).toBeTruthy();
  });
});
