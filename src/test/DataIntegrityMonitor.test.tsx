import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import DataIntegrityMonitor from '../components/DataIntegrityMonitor';
import { dataApi } from '../services/dataApi';

// Every card is a native <details>. Fails on none, so a check over each card
// cannot pass on an empty list.
const cards = (container: HTMLElement) => {
  const all = [...container.querySelectorAll('details')];
  expect(all.length, 'cards render as <details>').toBeGreaterThan(0);
  return all;
};

describe('DataIntegrityMonitor', () => {
  // ── Rendering ──────────────────────────────────────────

  it('renders the component header', () => {
    render(<DataIntegrityMonitor />);
    expect(screen.getByText('Data Integrity Monitor')).toBeTruthy();
  });

  it('has section aria-label', () => {
    render(<DataIntegrityMonitor />);
    expect(screen.getByRole('region', { name: 'Data Integrity Monitor' })).toBeTruthy();
  });

  it('shows dataset count and health score in description', () => {
    render(<DataIntegrityMonitor />);
    expect(screen.getByText(/datasets validated.*checks passing/)).toBeTruthy();
  });

  it('shows at least 10 datasets', () => {
    render(<DataIntegrityMonitor />);
    expect(screen.getByText(/\d+ datasets validated/)).toBeTruthy();
    const match = screen.getByText(/(\d+) datasets validated/).textContent!.match(/(\d+) datasets validated/);
    expect(parseInt(match![1])).toBeGreaterThanOrEqual(10);
  });

  // ── Status Summary Cards ───────────────────────────────

  it('renders three status filter cards (Pass/Warning/Fail)', () => {
    render(<DataIntegrityMonitor />);
    const filterBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    expect(filterBtns.length).toBe(3);
  });

  it('status cards have aria-pressed attribute', () => {
    render(<DataIntegrityMonitor />);
    const filterBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    filterBtns.forEach((btn) => {
      expect(btn.getAttribute('aria-pressed')).toBe('false');
    });
  });

  it('clicking a status card activates the filter', () => {
    render(<DataIntegrityMonitor />);
    const filterBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    fireEvent.click(filterBtns[0]); // Pass filter
    expect(filterBtns[0].getAttribute('aria-pressed')).toBe('true');
  });

  it('clicking the same status card again clears the filter', () => {
    render(<DataIntegrityMonitor />);
    const filterBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    fireEvent.click(filterBtns[0]);
    expect(filterBtns[0].getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(filterBtns[0]);
    expect(filterBtns[0].getAttribute('aria-pressed')).toBe('false');
  });

  // ── Health Score Bar ───────────────────────────────────

  it('renders health score bar with pass/warn/fail segments', () => {
    render(<DataIntegrityMonitor />);
    const passBar = screen.getAllByLabelText(/checks passing/);
    expect(passBar.length).toBeGreaterThanOrEqual(1);
  });

  // ── Search ─────────────────────────────────────────────

  it('renders search input', () => {
    render(<DataIntegrityMonitor />);
    expect(screen.getByPlaceholderText('Search datasets...')).toBeTruthy();
  });

  it('search input has aria-label', () => {
    render(<DataIntegrityMonitor />);
    expect(screen.getByLabelText('Search datasets')).toBeTruthy();
  });

  it('typing in search filters datasets', () => {
    render(<DataIntegrityMonitor />);
    const input = screen.getByPlaceholderText('Search datasets...');
    fireEvent.change(input, { target: { value: 'xyznonexistent123' } });
    expect(screen.getByText('No datasets match your search.')).toBeTruthy();
  });

  it('searching for prisoners finds political prisoners dataset', () => {
    render(<DataIntegrityMonitor />);
    const input = screen.getByPlaceholderText('Search datasets...');
    fireEvent.change(input, { target: { value: 'prisoner' } });
    expect(screen.getByText(/Political Prisoners/)).toBeTruthy();
  });

  // ── Dataset Cards ──────────────────────────────────────

  it('renders expandable dataset cards', () => {
    const { container } = render(<DataIntegrityMonitor />);
    const expandBtns = cards(container);
    expect(expandBtns.length).toBeGreaterThanOrEqual(10);
  });

  it('all dataset cards are native disclosures, closed to start', () => {
    const { container } = render(<DataIntegrityMonitor />);
    expect(container.querySelectorAll('[aria-expanded]')).toHaveLength(0);
    cards(container).forEach((c) => {
      expect(c.firstElementChild?.tagName).toBe('SUMMARY');
      expect(c.open).toBe(false);
    });
  });

  it('a dataset card opens and closes natively', () => {
    const { container } = render(<DataIntegrityMonitor />);
    const [first] = cards(container);
    fireEvent.click(first.querySelector('summary')!);
    expect(first.open).toBe(true);
    fireEvent.click(first.querySelector('summary')!);
    expect(first.open).toBe(false);
  });

  it('every dataset card carries its validation checks without a click', () => {
    const { container } = render(<DataIntegrityMonitor />);
    cards(container).forEach((c) => expect(within(c).getByText(/Validation checks \(\d+\)/)).toBeTruthy());
  });

  it('a dataset card shows its record count check without a click', () => {
    const { container } = render(<DataIntegrityMonitor />);
    expect(within(cards(container)[0]).getByText('Record count')).toBeTruthy();
  });

  it('a dataset card shows its schema fields without a click', () => {
    const { container } = render(<DataIntegrityMonitor />);
    expect(within(cards(container)[0]).getByText('Schema:')).toBeTruthy();
  });

  it('opening one dataset leaves the others as they were', () => {
    // One-at-a-time was a JavaScript nicety; native disclosures open independently.
    const { container } = render(<DataIntegrityMonitor />);
    const [first, second] = cards(container);
    fireEvent.click(first.querySelector('summary')!);
    fireEvent.click(second.querySelector('summary')!);
    expect(first.open).toBe(true);
    expect(second.open).toBe(true);
  });

  // ── Copy ───────────────────────────────────────────────

  it('renders copy button', () => {
    render(<DataIntegrityMonitor />);
    expect(screen.getByLabelText('Copy integrity report to clipboard')).toBeTruthy();
  });

  it('copy button calls clipboard API', () => {
    const mockWrite = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText: mockWrite } });
    render(<DataIntegrityMonitor />);
    fireEvent.click(screen.getByLabelText('Copy integrity report to clipboard'));
    expect(mockWrite).toHaveBeenCalled();
    expect(mockWrite.mock.calls[0][0]).toContain('Data Integrity Monitor');
  });

  it('copy button shows confirmed state', () => {
    const mockWrite = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText: mockWrite } });
    render(<DataIntegrityMonitor />);
    fireEvent.click(screen.getByLabelText('Copy integrity report to clipboard'));
    expect(screen.getByText('Copied')).toBeTruthy();
  });

  // ── Data Quality ───────────────────────────────────────

  it('validates real datasets from dataApi', () => {
    expect(dataApi.getPoliticalPrisoners().length).toBeGreaterThan(0);
    expect(dataApi.getSanctions().length).toBeGreaterThan(0);
    expect(dataApi.getSanctionedOfficials().length).toBeGreaterThan(0);
    expect(dataApi.getLegalCases().length).toBeGreaterThan(0);
    expect(dataApi.getTimelineEvents().length).toBeGreaterThan(0);
    expect(dataApi.getDetentionFacilities().length).toBeGreaterThan(0);
  });

  it('check results include CCP source exclusion', () => {
    const { container } = render(<DataIntegrityMonitor />);
    expect(within(cards(container)[0]).getAllByText(/CCP source exclusion|No CCP state media/).length).toBeGreaterThanOrEqual(1);
  });

  it('no CCP state media sources in any dataset', () => {
    const allDatasets = dataApi.getAllDatasets();
    const ccpDomains = ['xinhua', 'globaltimes', 'chinadaily', 'cgtn', 'cctv'];
    Object.values(allDatasets).forEach((records) => {
      if (Array.isArray(records)) {
        records.forEach((r) => {
          const url = r.source_url || r.sourceUrl || '';
          ccpDomains.forEach((domain) => {
            expect(url.toLowerCase()).not.toContain(domain);
          });
        });
      }
    });
  });

  // ── Footer ─────────────────────────────────────────────

  it('shows automated validation attribution', () => {
    render(<DataIntegrityMonitor />);
    expect(screen.getByText('Automated validation')).toBeTruthy();
  });

  it('shows tier 1-2 source policy', () => {
    render(<DataIntegrityMonitor />);
    expect(screen.getByText('Tier 1-2 sources only')).toBeTruthy();
  });

  it('shows health score in footer', () => {
    render(<DataIntegrityMonitor />);
    const footerScores = screen.getAllByText(/% health score/);
    expect(footerScores.length).toBeGreaterThanOrEqual(1);
  });

  // ── Edge Cases ─────────────────────────────────────────

  it('handles combined filter + search gracefully', () => {
    render(<DataIntegrityMonitor />);
    const filterBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null
    );
    fireEvent.click(filterBtns[0]); // Activate Pass filter
    const input = screen.getByPlaceholderText('Search datasets...');
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    // Should show no-results message
    expect(screen.getByText(/No datasets match/)).toBeTruthy();
  });

  it('clearing search restores datasets', () => {
    const { container } = render(<DataIntegrityMonitor />);
    const input = screen.getByPlaceholderText('Search datasets...');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.change(input, { target: { value: '' } });
    const expandBtns = cards(container);
    expect(expandBtns.length).toBeGreaterThanOrEqual(10);
  });

  it('shows "Showing X of Y datasets" count', () => {
    render(<DataIntegrityMonitor />);
    expect(screen.getByText(/Showing \d+ of \d+ datasets/)).toBeTruthy();
  });
});
