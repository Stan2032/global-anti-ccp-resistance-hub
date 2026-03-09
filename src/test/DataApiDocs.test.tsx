// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import DataApiDocs from '../components/DataApiDocs';

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

  it('collapses Metadata when clicked', () => {
    render(<DataApiDocs />);
    // getDatasetSummary should be visible initially
    expect(screen.getByText('getDatasetSummary')).toBeTruthy();
    // Click Metadata to collapse
    fireEvent.click(screen.getByText('Metadata'));
    // getDatasetSummary should be hidden
    expect(screen.queryByText('getDatasetSummary')).toBeNull();
  });

  it('expands Political Prisoners group when clicked', () => {
    render(<DataApiDocs />);
    fireEvent.click(screen.getByText('Political Prisoners'));
    expect(screen.getByText('getPoliticalPrisoners')).toBeTruthy();
    expect(screen.getByText('getPoliticalPrisonerByName')).toBeTruthy();
    expect(screen.getByText('searchPoliticalPrisoners')).toBeTruthy();
    expect(screen.getByText('getPoliticalPrisonersByStatus')).toBeTruthy();
  });

  it('expands Sanctions group when clicked', () => {
    render(<DataApiDocs />);
    fireEvent.click(screen.getByText('Sanctions'));
    expect(screen.getByText('getSanctions')).toBeTruthy();
    expect(screen.getByText('getSanctionsByCountry')).toBeTruthy();
    expect(screen.getByText('searchSanctions')).toBeTruthy();
  });

  it('expands Timeline Events group when clicked', () => {
    render(<DataApiDocs />);
    fireEvent.click(screen.getByText('Timeline Events'));
    expect(screen.getByText('getTimelineEvents')).toBeTruthy();
    expect(screen.getByText('getTimelineEventsByCategory')).toBeTruthy();
    expect(screen.getByText('getTimelineEventsInRange')).toBeTruthy();
  });

  it('expands Cross-Dataset group when clicked', () => {
    render(<DataApiDocs />);
    fireEvent.click(screen.getByText('Cross-Dataset'));
    expect(screen.getByText('globalSearch')).toBeTruthy();
    expect(screen.getByText('getHongKongData')).toBeTruthy();
    expect(screen.getByText('getUyghurData')).toBeTruthy();
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

  it('shows return type information', () => {
    render(<DataApiDocs />);
    // Metadata is expanded by default, showing returns
    expect(screen.getByText(/returns:/i)).toBeTruthy();
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

  it('has aria-expanded on group toggle buttons', () => {
    render(<DataApiDocs />);
    const buttons = screen.getAllByRole('button');
    const expandableButtons = buttons.filter(b => b.getAttribute('aria-expanded') !== null);
    expect(expandableButtons.length).toBeGreaterThanOrEqual(6);
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
