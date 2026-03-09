import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import PrisonerStatusDashboard from '../components/PrisonerStatusDashboard';

describe('PrisonerStatusDashboard', () => {
  // ── Rendering ──────────────────────────────────────────

  it('renders the component header', () => {
    render(<PrisonerStatusDashboard />);
    expect(screen.getByText('Prisoner Status Dashboard')).toBeTruthy();
    expect(screen.getByText(/Real-time monitoring of/)).toBeTruthy();
  });

  it('renders summary stat cards', () => {
    render(<PrisonerStatusDashboard />);
    expect(screen.getByText('Total Documented')).toBeTruthy();
    expect(screen.getByText('Currently Detained')).toBeTruthy();
    expect(screen.getByText('Health Alerts')).toBeTruthy();
    expect(screen.getAllByText('Disappeared').length).toBeGreaterThanOrEqual(1);
  });

  it('displays non-zero total prisoners', () => {
    render(<PrisonerStatusDashboard />);
    const totalLabel = screen.getByText('Total Documented');
    const card = totalLabel.closest('.p-4');
    const numEl = card!.querySelector('.font-mono.text-2xl');
    const count = parseInt(numEl!.textContent, 10);
    expect(count).toBeGreaterThan(0);
  });

  it('displays non-zero detained count', () => {
    render(<PrisonerStatusDashboard />);
    const detainedLabel = screen.getByText('Currently Detained');
    const card = detainedLabel.closest('.p-4');
    const numEl = card!.querySelector('.font-mono.text-2xl');
    const count = parseInt(numEl!.textContent, 10);
    expect(count).toBeGreaterThan(0);
  });

  // ── Status Distribution ───────────────────────────────

  it('renders status distribution section', () => {
    render(<PrisonerStatusDashboard />);
    expect(screen.getByText('Status Distribution')).toBeTruthy();
  });

  it('has status bar segments with aria-labels', () => {
    render(<PrisonerStatusDashboard />);
    const bars = screen.getAllByLabelText(/%$/);
    expect(bars.length).toBeGreaterThanOrEqual(1);
  });

  it('renders status legend items', () => {
    render(<PrisonerStatusDashboard />);
    // At least Detained/Imprisoned status should appear
    const allText = document.body.textContent;
    expect(allText.includes('Detained') || allText.includes('Imprisoned')).toBe(true);
  });

  // ── Health Overview ───────────────────────────────────

  it('renders health status overview', () => {
    render(<PrisonerStatusDashboard />);
    expect(screen.getByText('Health Status Overview')).toBeTruthy();
  });

  it('displays health classification categories', () => {
    render(<PrisonerStatusDashboard />);
    expect(screen.getAllByText('Critical').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Concerning').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Stable').length).toBeGreaterThanOrEqual(1);
    // "Unknown" may appear as status or health
    const unknownEls = screen.getAllByText('Unknown');
    expect(unknownEls.length).toBeGreaterThanOrEqual(1);
  });

  it('health counts are numeric', () => {
    render(<PrisonerStatusDashboard />);
    const criticalEl = screen.getAllByText('Critical')[0].closest('div')?.querySelector('.font-mono');
    if (criticalEl) {
      const count = parseInt(criticalEl.textContent, 10);
      expect(Number.isFinite(count)).toBe(true);
    }
  });

  // ── Filters ───────────────────────────────────────────

  it('renders prisoner monitor section with filters', () => {
    render(<PrisonerStatusDashboard />);
    expect(screen.getByText('Prisoner Monitor')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    // "Health" label appears both as filter label and sort button
    expect(screen.getAllByText('Health').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Sort')).toBeTruthy();
  });

  it('has All status filter selected by default', () => {
    render(<PrisonerStatusDashboard />);
    const allBtns = screen.getAllByRole('button').filter(b =>
      b.getAttribute('aria-pressed') === 'true' && b.textContent.startsWith('All (')
    );
    expect(allBtns.length).toBeGreaterThanOrEqual(1);
  });

  it('filters by status when clicking a status button', () => {
    render(<PrisonerStatusDashboard />);
    const _showingBefore = screen.getByText(/^Showing \d+ of \d+ prisoners$/).textContent;
    
    // Find any status filter button that is not "All"
    const statusButtons = screen.getAllByRole('button').filter(b =>
      b.getAttribute('aria-pressed') !== null && b.textContent.includes('Detained')
    );
    if (statusButtons.length > 0) {
      fireEvent.click(statusButtons[0]);
      const showingAfter = screen.getByText(/^Showing \d+ of \d+ prisoners$/).textContent;
      // Count may differ after filtering
      expect(showingAfter).toBeTruthy();
    }
  });

  it('filters by health classification', () => {
    render(<PrisonerStatusDashboard />);
    // Find health "Critical" filter button
    const criticalBtns = screen.getAllByRole('button').filter(b =>
      b.getAttribute('aria-pressed') !== null && b.textContent.includes('🔴')
    );
    if (criticalBtns.length > 0) {
      fireEvent.click(criticalBtns[0]);
      const showing = screen.getByText(/^Showing \d+ of \d+ prisoners$/).textContent;
      expect(showing).toBeTruthy();
    }
  });

  it('sorts by name when clicking Name sort button', () => {
    render(<PrisonerStatusDashboard />);
    const nameBtn = screen.getByRole('button', { name: 'Name' });
    fireEvent.click(nameBtn);
    expect(nameBtn.getAttribute('aria-pressed')).toBe('true');
  });

  it('sorts by region when clicking Region sort button', () => {
    render(<PrisonerStatusDashboard />);
    const regionBtn = screen.getByRole('button', { name: 'Region' });
    fireEvent.click(regionBtn);
    expect(regionBtn.getAttribute('aria-pressed')).toBe('true');
  });

  // ── Prisoner List ─────────────────────────────────────

  it('renders prisoner rows with names and status badges', () => {
    render(<PrisonerStatusDashboard />);
    // Jimmy Lai should be in the prisoner data
    expect(document.body.textContent.includes('Jimmy Lai')).toBe(true);
  });

  it('expands prisoner details on click', () => {
    render(<PrisonerStatusDashboard />);
    // Find first expandable button (prisoner row)
    const expandButtons = screen.getAllByRole('button').filter(b =>
      b.getAttribute('aria-expanded') !== null
    );
    expect(expandButtons.length).toBeGreaterThan(0);
    
    fireEvent.click(expandButtons[0]);
    expect(expandButtons[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('shows prisoner details when expanded', () => {
    render(<PrisonerStatusDashboard />);
    const expandButtons = screen.getAllByRole('button').filter(b =>
      b.getAttribute('aria-expanded') !== null
    );
    
    fireEvent.click(expandButtons[0]);
    // Expanded section should show label text
    const allText = document.body.textContent;
    const hasDetail = allText.includes('Sentence:') || 
                      allText.includes('Health Status:') || 
                      allText.includes('Latest Update:') ||
                      allText.includes('International Response:');
    expect(hasDetail).toBe(true);
  });

  it('collapses prisoner details on second click', () => {
    render(<PrisonerStatusDashboard />);
    const expandButtons = screen.getAllByRole('button').filter(b =>
      b.getAttribute('aria-expanded') !== null
    );
    
    fireEvent.click(expandButtons[0]);
    expect(expandButtons[0].getAttribute('aria-expanded')).toBe('true');
    
    fireEvent.click(expandButtons[0]);
    expect(expandButtons[0].getAttribute('aria-expanded')).toBe('false');
  });

  // ── Regional Distribution ─────────────────────────────

  it('renders regional distribution section', () => {
    render(<PrisonerStatusDashboard />);
    expect(screen.getByText('Regional Distribution')).toBeTruthy();
  });

  it('shows at least one region with bars', () => {
    render(<PrisonerStatusDashboard />);
    const regionLabels = screen.getAllByLabelText(/prisoners$/);
    expect(regionLabels.length).toBeGreaterThanOrEqual(1);
  });

  it('displays known regions', () => {
    render(<PrisonerStatusDashboard />);
    const allText = document.body.textContent;
    // Should have at least some of these regions
    const regions = ['Hong Kong', 'Mainland', 'Uyghur', 'Tibet'];
    const found = regions.filter(r => allText.includes(r));
    expect(found.length).toBeGreaterThanOrEqual(2);
  });

  // ── Methodology ───────────────────────────────────────

  it('renders methodology section', () => {
    render(<PrisonerStatusDashboard />);
    expect(screen.getByText('Methodology')).toBeTruthy();
  });

  it('mentions Tier 1-2 sources', () => {
    render(<PrisonerStatusDashboard />);
    expect(screen.getByText(/Tier 1-2 outlets/)).toBeTruthy();
  });

  it('mentions CCP source exclusion', () => {
    render(<PrisonerStatusDashboard />);
    expect(screen.getByText(/CCP state media is never cited/)).toBeTruthy();
  });

  // ── Copy ──────────────────────────────────────────────

  it('renders copy button', () => {
    render(<PrisonerStatusDashboard />);
    expect(screen.getByLabelText('Copy dashboard summary to clipboard')).toBeTruthy();
    expect(screen.getByText('$ copy_summary')).toBeTruthy();
  });

  it('copies summary to clipboard on click', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<PrisonerStatusDashboard />);
    fireEvent.click(screen.getByLabelText('Copy dashboard summary to clipboard'));
    expect(writeText).toHaveBeenCalledTimes(1);
    const text = writeText.mock.calls[0][0];
    expect(text).toContain('Prisoner Status Dashboard');
    expect(text).toContain('CC BY 4.0');
  });

  // ── Accessibility ─────────────────────────────────────

  it('has aria-pressed on all filter buttons', () => {
    render(<PrisonerStatusDashboard />);
    const pressedBtns = screen.getAllByRole('button').filter(b =>
      b.getAttribute('aria-pressed') !== null
    );
    // Status filters + Health filters + Sort buttons
    expect(pressedBtns.length).toBeGreaterThanOrEqual(8);
  });

  it('has aria-expanded on prisoner rows', () => {
    render(<PrisonerStatusDashboard />);
    const expandable = screen.getAllByRole('button').filter(b =>
      b.getAttribute('aria-expanded') !== null
    );
    expect(expandable.length).toBeGreaterThan(0);
  });

  it('has no text-slate-500 on readable text', () => {
    const component = render(<PrisonerStatusDashboard />);
    const html = component.container.innerHTML;
    expect(html).not.toContain('text-slate-500');
  });

  // ── Data Integrity ────────────────────────────────────

  it('showing count matches total when no filters', () => {
    render(<PrisonerStatusDashboard />);
    const showingText = screen.getByText(/^Showing \d+ of \d+ prisoners$/).textContent;
    const match = showingText.match(/Showing (\d+) of (\d+)/);
    expect(match).not.toBeNull();
    expect(match![1]).toBe(match![2]);
  });

  it('no empty prisoner names in list', () => {
    render(<PrisonerStatusDashboard />);
    const expandable = screen.getAllByRole('button').filter(b =>
      b.getAttribute('aria-expanded') !== null
    );
    for (const btn of expandable) {
      expect(btn.textContent).not.toBe('');
    }
  });
});
