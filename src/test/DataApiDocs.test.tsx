import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import DataApiDocs from '../components/DataApiDocs';

// Each method group is a native <details> whose summary carries its title.
const group = (title: string) => {
  const details = screen.getByText(title).closest('details');
  expect(details, `${title} is a <details>`).toBeTruthy();
  return details as HTMLDetailsElement;
};

// Mock clipboard API
beforeEach(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  });
});

describe('DataApiDocs', () => {
  // ── Header ─────────────────────────────────────────

  it('renders the API Reference header', () => {
    render(<DataApiDocs />);
    expect(screen.getByText('API Reference')).toBeTruthy();
  });

  it('shows total record count in header', () => {
    render(<DataApiDocs />);
    // Should mention verified records
    expect(screen.getByText(/verified records across/)).toBeTruthy();
  });

  it('shows import statement example', () => {
    render(<DataApiDocs />);
    expect(screen.getByText("'../services/dataApi'")).toBeTruthy();
  });

  it('shows method count in header stats', () => {
    render(<DataApiDocs />);
    // Should show "X methods" — multiple instances, use getAllByText
    const methodTexts = screen.getAllByText(/\d+ methods?/);
    expect(methodTexts.length).toBeGreaterThanOrEqual(1);
  });

  it('shows CC BY 4.0 license mention', () => {
    render(<DataApiDocs />);
    expect(screen.getByText('CC BY 4.0')).toBeTruthy();
  });

  // ── Method Groups ──────────────────────────────────

  it('renders all method group headers', () => {
    render(<DataApiDocs />);
    expect(screen.getByText('Metadata')).toBeTruthy();
    expect(screen.getByText('Political Prisoners')).toBeTruthy();
    expect(screen.getByText('Sanctions')).toBeTruthy();
    expect(screen.getByText('Sanctioned Officials')).toBeTruthy();
    expect(screen.getByText('Timeline Events')).toBeTruthy();
    expect(screen.getByText('Cross-Dataset')).toBeTruthy();
  });

  it('shows method counts for each group', () => {
    render(<DataApiDocs />);
    // Multiple groups show "X methods"
    const methodCounts = screen.getAllByText(/\d+ methods?/);
    expect(methodCounts.length).toBeGreaterThanOrEqual(6);
  });

  // ── Expanded Group (Metadata is default) ───────────

  it('expands Metadata group by default', () => {
    render(<DataApiDocs />);
    expect(screen.getByText('getDatasetSummary')).toBeTruthy();
  });

  it('shows method description for expanded group', () => {
    render(<DataApiDocs />);
    expect(screen.getByText(/Returns summary statistics for all datasets/)).toBeTruthy();
  });

  it('shows live example output for expanded methods', () => {
    render(<DataApiDocs />);
    // Metadata live output should mention datasets and records
    expect(screen.getByText(/\d+ datasets, \d+ total records/)).toBeTruthy();
  });

  // ── Toggle Groups ──────────────────────────────────

  it('opens Metadata by default and folds it natively', () => {
    render(<DataApiDocs />);
    const metadata = group('Metadata');
    expect(metadata.open).toBe(true);
    fireEvent.click(screen.getByText('Metadata'));
    expect(metadata.open).toBe(false);
    // Folded, not removed.
    expect(within(metadata).getByText('getDatasetSummary')).toBeTruthy();
  });

  it('carries the Political Prisoners methods without a click', () => {
    render(<DataApiDocs />);
    expect(group('Political Prisoners').open).toBe(false);
    const g = within(group('Political Prisoners'));
    expect(g.getByText('getPoliticalPrisoners')).toBeTruthy();
    expect(g.getByText('getPoliticalPrisonerByName')).toBeTruthy();
    expect(g.getByText('searchPoliticalPrisoners')).toBeTruthy();
    expect(g.getByText('getPoliticalPrisonersByStatus')).toBeTruthy();
  });

  it('carries the Sanctions methods without a click', () => {
    render(<DataApiDocs />);
    expect(group('Sanctions').open).toBe(false);
    const g = within(group('Sanctions'));
    expect(g.getByText('getSanctions')).toBeTruthy();
    expect(g.getByText('getSanctionsByCountry')).toBeTruthy();
    expect(g.getByText('searchSanctions')).toBeTruthy();
  });

  it('carries the Timeline Events methods without a click', () => {
    render(<DataApiDocs />);
    expect(group('Timeline Events').open).toBe(false);
    const g = within(group('Timeline Events'));
    expect(g.getByText('getTimelineEvents')).toBeTruthy();
    expect(g.getByText('getTimelineEventsByCategory')).toBeTruthy();
    expect(g.getByText('getTimelineEventsInRange')).toBeTruthy();
  });

  it('carries the Cross-Dataset methods without a click', () => {
    render(<DataApiDocs />);
    expect(group('Cross-Dataset').open).toBe(false);
    const g = within(group('Cross-Dataset'));
    expect(g.getByText('globalSearch')).toBeTruthy();
    expect(g.getByText('getHongKongData')).toBeTruthy();
    expect(g.getByText('getUyghurData')).toBeTruthy();
  });

  // ── Live Examples ──────────────────────────────────

  it('shows live record counts for Political Prisoners', () => {
    render(<DataApiDocs />);
    fireEvent.click(screen.getByText('Political Prisoners'));
    // Multiple elements have "records", use getAllByText
    const recordTexts = screen.getAllByText(/\d+ records/);
    expect(recordTexts.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/currently detained/)).toBeTruthy();
  });

  it('shows live Jimmy Lai lookup result', () => {
    render(<DataApiDocs />);
    fireEvent.click(screen.getByText('Political Prisoners'));
    expect(screen.getByText(/Found: Jimmy Lai/)).toBeTruthy();
  });

  it('shows live Hong Kong search results', () => {
    render(<DataApiDocs />);
    fireEvent.click(screen.getByText('Political Prisoners'));
    expect(screen.getByText(/matches for "Hong Kong"/)).toBeTruthy();
  });

  it('shows live sanctions count', () => {
    render(<DataApiDocs />);
    fireEvent.click(screen.getByText('Sanctions'));
    expect(screen.getByText(/US sanctions/)).toBeTruthy();
  });

  it('shows live cross-dataset search results', () => {
    render(<DataApiDocs />);
    fireEvent.click(screen.getByText('Cross-Dataset'));
    expect(screen.getByText(/total matches across all datasets/)).toBeTruthy();
  });

  // ── Parameters ─────────────────────────────────────

  it('shows parameter details for methods with params', () => {
    render(<DataApiDocs />);
    fireEvent.click(screen.getByText('Political Prisoners'));
    // findPoliticalPrisoner has a 'name' param
    const nameParams = screen.getAllByText('name');
    expect(nameParams.length).toBeGreaterThanOrEqual(1);
  });

  it('shows return type information for every method', () => {
    render(<DataApiDocs />);
    expect(screen.getAllByText(/returns:/i).length).toBe(screen.getAllByTitle('Copy example').length);
  });

  // ── Copy Button ────────────────────────────────────

  it('renders copy buttons for each method', () => {
    render(<DataApiDocs />);
    // Metadata has 1 method, should have a copy button
    const copyButtons = screen.getAllByTitle('Copy example');
    expect(copyButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('calls clipboard writeText when copy is clicked', () => {
    render(<DataApiDocs />);
    const copyButton = screen.getAllByTitle('Copy example')[0];
    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'dataApi.getDatasetSummary()'
    );
  });

  // ── Accessibility ──────────────────────────────────

  it('uses native disclosures for its method groups', () => {
    const { container } = render(<DataApiDocs />);
    expect(container.querySelectorAll('details').length).toBeGreaterThanOrEqual(6);
    expect(container.querySelectorAll('[aria-expanded]')).toHaveLength(0);
  });

  it('has aria-label on copy buttons', () => {
    render(<DataApiDocs />);
    const copyButtons = screen.getAllByTitle('Copy example');
    copyButtons.forEach(btn => {
      const label = btn.getAttribute('aria-label');
      expect(label).toBeTruthy();
      // Verify label includes "Copy" and a method name
      expect(label).toMatch(/^Copy .+ example$/);
    });
  });

  // ── Footer ─────────────────────────────────────────

  it('shows verified sources footer', () => {
    render(<DataApiDocs />);
    expect(screen.getByText(/All data verified from Tier 1-2 sources/)).toBeTruthy();
  });

  // ── No Hashtags ────────────────────────────────────

  it('contains no hashtags', () => {
    const { container } = render(<DataApiDocs />);
    const text = container.textContent;
    expect(text).not.toMatch(/#\w+/);
  });
});
