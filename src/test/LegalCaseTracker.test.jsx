import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import LegalCaseTracker from '../components/LegalCaseTracker';
import { dataApi } from '../services/dataApi';

describe('LegalCaseTracker', () => {
  // ── Rendering ──────────────────────────────────────────

  it('renders the component header', () => {
    render(<LegalCaseTracker />);
    expect(screen.getByText('Legal Case Tracker')).toBeTruthy();
  });

  it('shows case count and jurisdiction count in description', () => {
    render(<LegalCaseTracker />);
    const cases = dataApi.getLegalCases();
    expect(screen.getByText(new RegExp(`${cases.length} court cases`))).toBeTruthy();
  });

  it('has section aria-label', () => {
    render(<LegalCaseTracker />);
    expect(screen.getByRole('region', { name: 'Legal Case Tracker' })).toBeTruthy();
  });

  // ── Status Summary ─────────────────────────────────────

  it('renders status summary buttons with counts', () => {
    render(<LegalCaseTracker />);
    // Should have at least Convicted and Concluded statuses
    expect(screen.getAllByText('Convicted').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Concluded').length).toBeGreaterThanOrEqual(1);
  });

  it('clicking a status button filters cases', () => {
    render(<LegalCaseTracker />);
    const convictedBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Convicted')
    );
    expect(convictedBtns.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(convictedBtns[0]);
    expect(convictedBtns[0].getAttribute('aria-pressed')).toBe('true');
  });

  it('clicking the same status button again clears filter', () => {
    render(<LegalCaseTracker />);
    const convictedBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Convicted')
    );
    fireEvent.click(convictedBtns[0]);
    expect(convictedBtns[0].getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(convictedBtns[0]);
    expect(convictedBtns[0].getAttribute('aria-pressed')).toBe('false');
  });

  // ── Status Distribution Bar ────────────────────────────

  it('renders status distribution bar with aria-labels', () => {
    render(<LegalCaseTracker />);
    const bars = screen.getAllByLabelText(/cases/);
    expect(bars.length).toBeGreaterThanOrEqual(1);
  });

  // ── Jurisdictions ──────────────────────────────────────

  it('renders jurisdiction badges', () => {
    render(<LegalCaseTracker />);
    expect(screen.getByText('Jurisdictions')).toBeTruthy();
    // Hong Kong should be a major jurisdiction
    expect(screen.getAllByText('Hong Kong').length).toBeGreaterThanOrEqual(1);
  });

  it('shows multiple jurisdiction types', () => {
    render(<LegalCaseTracker />);
    // Should have both Hong Kong and US cases at minimum
    const jurisdictions = dataApi.getLegalCases().map((c) => c.jurisdiction);
    const uniqueJurisdictions = [...new Set(jurisdictions)];
    expect(uniqueJurisdictions.length).toBeGreaterThanOrEqual(5);
  });

  // ── Search ─────────────────────────────────────────────

  it('renders search input', () => {
    render(<LegalCaseTracker />);
    expect(screen.getByLabelText('Search legal cases')).toBeTruthy();
  });

  it('filters cases by search query', () => {
    render(<LegalCaseTracker />);
    const input = screen.getByLabelText('Search legal cases');
    fireEvent.change(input, { target: { value: 'Jimmy Lai' } });
    // Should still find Jimmy Lai case
    const buttons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    expect(buttons[0].textContent).toContain('Jimmy Lai');
  });

  it('shows empty state when search has no results', () => {
    render(<LegalCaseTracker />);
    const input = screen.getByLabelText('Search legal cases');
    fireEvent.change(input, { target: { value: 'zzzznonexistent99999' } });
    expect(screen.getByText('No cases match your search')).toBeTruthy();
  });

  // ── Case List ──────────────────────────────────────────

  it('renders case rows with names and status badges', () => {
    render(<LegalCaseTracker />);
    const expandButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    expect(expandButtons.length).toBeGreaterThanOrEqual(10);
  });

  it('shows case jurisdiction under case name', () => {
    render(<LegalCaseTracker />);
    // Jimmy Lai case should show Hong Kong jurisdiction
    const laiButton = screen.getAllByRole('button').find(
      (b) => b.textContent.includes('HKSAR v. Jimmy Lai')
    );
    expect(laiButton).toBeTruthy();
    expect(laiButton.textContent).toContain('Hong Kong');
  });

  // ── Expand/Collapse ────────────────────────────────────

  it('clicking a case expands its details', () => {
    render(<LegalCaseTracker />);
    const caseButton = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-expanded') === 'false'
    );
    fireEvent.click(caseButton);
    expect(caseButton.getAttribute('aria-expanded')).toBe('true');
  });

  it('expanded case shows defendant information', () => {
    render(<LegalCaseTracker />);
    const laiButton = screen.getAllByRole('button').find(
      (b) => b.textContent.includes('HKSAR v. Jimmy Lai')
    );
    fireEvent.click(laiButton);
    expect(screen.getByText('Defendant')).toBeTruthy();
  });

  it('expanded case shows charges', () => {
    render(<LegalCaseTracker />);
    const laiButton = screen.getAllByRole('button').find(
      (b) => b.textContent.includes('HKSAR v. Jimmy Lai')
    );
    fireEvent.click(laiButton);
    expect(screen.getByText('Charges')).toBeTruthy();
  });

  it('expanded case shows key dates', () => {
    render(<LegalCaseTracker />);
    const laiButton = screen.getAllByRole('button').find(
      (b) => b.textContent.includes('HKSAR v. Jimmy Lai')
    );
    fireEvent.click(laiButton);
    expect(screen.getByText('Key Dates')).toBeTruthy();
  });

  it('expanded case shows outcome', () => {
    render(<LegalCaseTracker />);
    const laiButton = screen.getAllByRole('button').find(
      (b) => b.textContent.includes('HKSAR v. Jimmy Lai')
    );
    fireEvent.click(laiButton);
    expect(screen.getByText('Outcome')).toBeTruthy();
  });

  it('expanded case shows significance', () => {
    render(<LegalCaseTracker />);
    const laiButton = screen.getAllByRole('button').find(
      (b) => b.textContent.includes('HKSAR v. Jimmy Lai')
    );
    fireEvent.click(laiButton);
    expect(screen.getByText('Significance')).toBeTruthy();
  });

  it('expanded case shows international response', () => {
    render(<LegalCaseTracker />);
    const laiButton = screen.getAllByRole('button').find(
      (b) => b.textContent.includes('HKSAR v. Jimmy Lai')
    );
    fireEvent.click(laiButton);
    expect(screen.getByText('International Response')).toBeTruthy();
  });

  it('expanded case shows source link', () => {
    render(<LegalCaseTracker />);
    const laiButton = screen.getAllByRole('button').find(
      (b) => b.textContent.includes('HKSAR v. Jimmy Lai')
    );
    fireEvent.click(laiButton);
    const sourceLink = screen.getByText('View source');
    expect(sourceLink).toBeTruthy();
    expect(sourceLink.closest('a').getAttribute('target')).toBe('_blank');
    expect(sourceLink.closest('a').getAttribute('rel')).toContain('noopener');
  });

  it('clicking expanded case collapses it', () => {
    render(<LegalCaseTracker />);
    const caseButton = screen.getAllByRole('button').find(
      (b) => b.getAttribute('aria-expanded') === 'false'
    );
    fireEvent.click(caseButton);
    expect(caseButton.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(caseButton);
    expect(caseButton.getAttribute('aria-expanded')).toBe('false');
  });

  // ── Copy ───────────────────────────────────────────────

  it('renders copy button', () => {
    render(<LegalCaseTracker />);
    expect(screen.getByLabelText('Copy summary to clipboard')).toBeTruthy();
  });

  it('copy button shows success state after click', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<LegalCaseTracker />);
    fireEvent.click(screen.getByLabelText('Copy summary to clipboard'));
    expect(writeText).toHaveBeenCalledTimes(1);
    const text = writeText.mock.calls[0][0];
    expect(text).toContain('Legal Case Tracker');
    expect(text).toContain('CC BY 4.0');
  });

  // ── Filter Indicator ───────────────────────────────────

  it('shows filter indicator and clear button when filtered', () => {
    render(<LegalCaseTracker />);
    const convictedBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Convicted')
    );
    fireEvent.click(convictedBtns[0]);
    expect(screen.getByText('Clear')).toBeTruthy();
  });

  it('clear button removes filter', () => {
    render(<LegalCaseTracker />);
    const convictedBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-pressed') !== null && b.textContent.includes('Convicted')
    );
    fireEvent.click(convictedBtns[0]);
    fireEvent.click(screen.getByText('Clear'));
    expect(convictedBtns[0].getAttribute('aria-pressed')).toBe('false');
  });

  // ── Methodology ────────────────────────────────────────

  it('renders methodology note', () => {
    render(<LegalCaseTracker />);
    expect(screen.getByText(/Tier 1-2 outlets/)).toBeTruthy();
    expect(screen.getByText(/CCP state media is never cited/)).toBeTruthy();
  });

  // ── Data API Integration ───────────────────────────────

  it('dataApi.getLegalCases returns non-empty array', () => {
    const cases = dataApi.getLegalCases();
    expect(cases.length).toBeGreaterThan(0);
  });

  it('dataApi.getLegalCasesByJurisdiction filters by jurisdiction', () => {
    const hkCases = dataApi.getLegalCasesByJurisdiction('Hong Kong');
    expect(hkCases.length).toBeGreaterThan(0);
    hkCases.forEach((c) => {
      expect(c.jurisdiction.toLowerCase()).toContain('hong kong');
    });
  });

  it('dataApi.getLegalCasesByStatus filters by status', () => {
    const convicted = dataApi.getLegalCasesByStatus('CONVICTED');
    expect(convicted.length).toBeGreaterThan(0);
    convicted.forEach((c) => {
      expect(c.status.toUpperCase()).toBe('CONVICTED');
    });
  });

  it('dataApi.searchLegalCases finds cases by query', () => {
    const results = dataApi.searchLegalCases('genocide');
    expect(results.length).toBeGreaterThan(0);
  });

  it('dataApi.getDatasetSummary includes legal_cases', () => {
    const summary = dataApi.getDatasetSummary();
    expect(summary.datasets.legal_cases).toBeDefined();
    expect(summary.datasets.legal_cases.count).toBeGreaterThan(0);
  });

  it('dataApi.globalSearch includes legal_cases results', () => {
    const results = dataApi.globalSearch('genocide');
    expect(results.legal_cases).toBeDefined();
    expect(results.legal_cases.length).toBeGreaterThan(0);
  });

  // ── Data Integrity ─────────────────────────────────────

  it('all cases have required fields', () => {
    const cases = dataApi.getLegalCases();
    cases.forEach((c) => {
      expect(c.case_name).toBeTruthy();
      expect(c.jurisdiction).toBeTruthy();
      expect(c.status).toBeTruthy();
      expect(c.source_url).toBeTruthy();
    });
  });

  it('all source URLs are valid URLs', () => {
    const cases = dataApi.getLegalCases();
    cases.forEach((c) => {
      expect(c.source_url).toMatch(/^https?:\/\//);
    });
  });

  it('no CCP state media sources', () => {
    const bannedDomains = ['xinhua', 'cgtn', 'globaltimes', 'chinadaily', 'people.com.cn'];
    const cases = dataApi.getLegalCases();
    cases.forEach((c) => {
      bannedDomains.forEach((domain) => {
        expect(c.source_url.toLowerCase()).not.toContain(domain);
      });
    });
  });

  it('no CPC terminology in case data', () => {
    const cases = dataApi.getLegalCases();
    const allText = JSON.stringify(cases);
    // Should not contain "CPC" referring to the party (allow "CPC" in other contexts)
    expect(allText).not.toContain('"CPC"');
    expect(allText).not.toContain('Communist Party of China');
    // Positive: "CCP" should be used where the party is referenced
    expect(allText).toContain('CCP');
  });
});
