import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SourceDiversityAnalyzer from '../components/SourceDiversityAnalyzer';

describe('SourceDiversityAnalyzer', () => {
  // ── Rendering ──────────────────────────────────────────

  it('renders the component header', () => {
    render(<SourceDiversityAnalyzer />);
    expect(screen.getByText('Source Diversity Analyzer')).toBeTruthy();
    expect(screen.getByText(/Analyzes source quality and diversity/)).toBeTruthy();
  });

  it('renders global summary stats', () => {
    render(<SourceDiversityAnalyzer />);
    expect(screen.getByText('Total References')).toBeTruthy();
    expect(screen.getByText('Unique Domains')).toBeTruthy();
    expect(screen.getAllByText('Tier 1 (Gold)').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Tier 2 (Reliable)').length).toBeGreaterThanOrEqual(1);
  });

  it('displays non-zero source references', () => {
    render(<SourceDiversityAnalyzer />);
    const refEl = screen.getByText('Total References').previousElementSibling;
    const count = parseInt(refEl!.textContent!, 10);
    expect(count).toBeGreaterThan(0);
  });

  it('displays non-zero unique domains', () => {
    render(<SourceDiversityAnalyzer />);
    const domainEl = screen.getByText('Unique Domains').previousElementSibling;
    const count = parseInt(domainEl!.textContent!, 10);
    expect(count).toBeGreaterThan(0);
  });

  // ── Tier Distribution ─────────────────────────────────

  it('renders tier distribution section', () => {
    render(<SourceDiversityAnalyzer />);
    expect(screen.getByText('Source Tier Distribution')).toBeTruthy();
  });

  it('renders tier legend items', () => {
    render(<SourceDiversityAnalyzer />);
    expect(screen.getByText(/Tier 1 —/)).toBeTruthy();
    expect(screen.getByText(/Tier 2 —/)).toBeTruthy();
    expect(screen.getByText(/Other —/)).toBeTruthy();
  });

  it('has tier bars with aria-labels', () => {
    render(<SourceDiversityAnalyzer />);
    const bars = screen.getAllByLabelText(/Tier [12]:/);
    expect(bars.length).toBeGreaterThanOrEqual(1);
  });

  // ── Top Sources ───────────────────────────────────────

  it('renders top sources section', () => {
    render(<SourceDiversityAnalyzer />);
    expect(screen.getByText('Top Sources (All Datasets)')).toBeTruthy();
  });

  it('displays at least one known source', () => {
    render(<SourceDiversityAnalyzer />);
    const container = document.body;
    // Should contain at least one known credible source
    const knownSources = ['BBC', 'Human Rights Watch', 'Reuters', 'Hong Kong Free Press', 'US Treasury', 'ASPI', 'Amnesty'];
    const found = knownSources.some(src => container.textContent.includes(src));
    expect(found).toBe(true);
  });

  it('shows tier badges (T1 or T2) next to sources', () => {
    render(<SourceDiversityAnalyzer />);
    const badges = screen.getAllByText(/^T[12]$/);
    expect(badges.length).toBeGreaterThan(0);
  });

  // ── Dataset Selector ──────────────────────────────────

  it('renders per-dataset breakdown section', () => {
    render(<SourceDiversityAnalyzer />);
    expect(screen.getByText('Per-Dataset Breakdown')).toBeTruthy();
  });

  it('renders all dataset buttons', () => {
    render(<SourceDiversityAnalyzer />);
    expect(screen.getByRole('button', { name: 'All Datasets' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Political Prisoners' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sanctions' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sanctioned Officials' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Timeline Events' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Detention Facilities' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'International Responses' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Police Stations' })).toBeTruthy();
  });

  it('defaults to All Datasets view with aria-pressed', () => {
    render(<SourceDiversityAnalyzer />);
    const allBtn = screen.getByText('All Datasets');
    expect(allBtn.getAttribute('aria-pressed')).toBe('true');
  });

  it('shows dataset grid cards in all view', () => {
    render(<SourceDiversityAnalyzer />);
    // Quality labels should appear on dataset cards
    const qualityLabels = screen.getAllByText(/Excellent|Good|Fair|Needs Review/);
    expect(qualityLabels.length).toBeGreaterThanOrEqual(1);
  });

  // ── Dataset Selection ─────────────────────────────────

  it('switches to single dataset view on click', () => {
    render(<SourceDiversityAnalyzer />);
    const prisonersBtn = screen.getByRole('button', { name: 'Political Prisoners' });
    fireEvent.click(prisonersBtn);
    expect(prisonersBtn.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText('References')).toBeTruthy();
    expect(screen.getByText('Diversity Score')).toBeTruthy();
  });

  it('shows tier breakdown for selected dataset', () => {
    render(<SourceDiversityAnalyzer />);
    fireEvent.click(screen.getByRole('button', { name: 'Sanctions' }));
    expect(screen.getByText('Tier Breakdown')).toBeTruthy();
  });

  it('shows top sources for selected dataset', () => {
    render(<SourceDiversityAnalyzer />);
    fireEvent.click(screen.getByRole('button', { name: 'Sanctions' }));
    expect(screen.getByText('Top Sources')).toBeTruthy();
  });

  it('returns to all view when All Datasets is clicked', () => {
    render(<SourceDiversityAnalyzer />);
    fireEvent.click(screen.getByRole('button', { name: 'Political Prisoners' }));
    expect(screen.getByText('Diversity Score')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'All Datasets' }));
    expect(screen.queryByText('Diversity Score')).toBeFalsy();
  });

  // ── Source Quality Assessment ─────────────────────────

  it('renders source quality assessment', () => {
    render(<SourceDiversityAnalyzer />);
    expect(screen.getByText('Source Quality Assessment')).toBeTruthy();
  });

  it('describes tier 1 sources', () => {
    render(<SourceDiversityAnalyzer />);
    expect(screen.getByText(/BBC, Reuters, AP, Human Rights Watch/)).toBeTruthy();
  });

  it('describes tier 2 sources', () => {
    render(<SourceDiversityAnalyzer />);
    expect(screen.getByText(/Hong Kong Free Press, Radio Free Asia/)).toBeTruthy();
  });

  it('mentions CCP source exclusion', () => {
    render(<SourceDiversityAnalyzer />);
    expect(screen.getByText(/CCP state media.*is never cited/)).toBeTruthy();
  });

  // ── Copy Functionality ────────────────────────────────

  it('renders copy button', () => {
    render(<SourceDiversityAnalyzer />);
    expect(screen.getByLabelText('Copy analysis to clipboard')).toBeTruthy();
    expect(screen.getByText('$ copy_analysis')).toBeTruthy();
  });

  it('copies analysis to clipboard on click', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<SourceDiversityAnalyzer />);
    fireEvent.click(screen.getByLabelText('Copy analysis to clipboard'));
    expect(writeText).toHaveBeenCalledTimes(1);
    const text = writeText.mock.calls[0][0];
    expect(text).toContain('Source Diversity Analysis');
    expect(text).toContain('CC BY 4.0');
  });

  // ── Accessibility ─────────────────────────────────────

  it('has aria-pressed on all filter buttons', () => {
    render(<SourceDiversityAnalyzer />);
    const buttons = screen.getAllByRole('button').filter(b => b.getAttribute('aria-pressed') !== null);
    // All Datasets + 8 dataset buttons = 9
    expect(buttons.length).toBe(9);
  });

  it('has no text-slate-500 on readable text', () => {
    // Ensure compliance with design system
    const component = render(<SourceDiversityAnalyzer />);
    const html = component.container.innerHTML;
    // text-slate-500 should not appear anywhere in this component's output
    expect(html).not.toContain('text-slate-500');
  });

  // ── Data Integrity ────────────────────────────────────

  it('does not list CCP state media in top sources', () => {
    render(<SourceDiversityAnalyzer />);
    // Get text from the top sources section specifically, not the quality assessment disclaimer
    const topSourcesHeading = screen.getByText('Top Sources (All Datasets)');
    const topSourcesSection = topSourcesHeading.closest('div');
    expect(topSourcesSection).not.toBeNull();
    const topText = topSourcesSection!.textContent;
    // CCP state media should never appear as an actual data source
    expect(topText).not.toContain('Xinhua');
    expect(topText).not.toContain('CGTN');
    expect(topText).not.toContain('Global Times');
  });

  it('all dataset cards have quality label and metrics', () => {
    render(<SourceDiversityAnalyzer />);
    // Each dataset card shows refs, domains, T1 percentage
    const refTexts = screen.getAllByText(/refs$/);
    expect(refTexts.length).toBeGreaterThanOrEqual(8);
    const domainTexts = screen.getAllByText(/domains$/);
    expect(domainTexts.length).toBeGreaterThanOrEqual(8);
  });
});
