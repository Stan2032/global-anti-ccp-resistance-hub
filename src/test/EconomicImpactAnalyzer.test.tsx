import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import EconomicImpactAnalyzer from '../components/EconomicImpactAnalyzer';
import { expectDisclosureSections, inSection } from './helpers/disclosure';

// Mock clipboard
Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

describe('EconomicImpactAnalyzer', () => {
  // ── Rendering ──────────────────────────────────────────
  it('renders the section title', () => {
    render(<EconomicImpactAnalyzer />);
    expect(screen.getByText('Economic Impact Analyzer')).toBeTruthy();
  });

  it('has section aria-label', () => {
    render(<EconomicImpactAnalyzer />);
    expect(screen.getByRole('region', { name: 'Economic Impact Analyzer' })).toBeTruthy();
  });

  it('renders description with dataset counts', () => {
    render(<EconomicImpactAnalyzer />);
    expect(screen.getAllByText(/companies/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/forced labor companies/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/sanctions/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/international responses/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Stat Bar ───────────────────────────────────────────
  it('displays companies analyzed stat', () => {
    render(<EconomicImpactAnalyzer />);
    expect(screen.getAllByText(/companies analyzed/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays critical-risk companies stat', () => {
    render(<EconomicImpactAnalyzer />);
    expect(screen.getAllByText(/critical-risk companies/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays legislative frameworks stat', () => {
    render(<EconomicImpactAnalyzer />);
    expect(screen.getAllByText(/legislative frameworks/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays WROs issued stat', () => {
    render(<EconomicImpactAnalyzer />);
    expect(screen.getAllByText(/WROs issued/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays genocide recognitions stat', () => {
    render(<EconomicImpactAnalyzer />);
    expect(screen.getAllByText(/genocide recognitions/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Risk Distribution ──────────────────────────────────
  it('renders risk level distribution cards', () => {
    render(<EconomicImpactAnalyzer />);
    expect(screen.getAllByText('Critical').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('High').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Moderate').length).toBeGreaterThanOrEqual(1);
  });

  it('shows company count in risk cards', () => {
    render(<EconomicImpactAnalyzer />);
    const companyLabels = screen.getAllByText(/compan/);
    expect(companyLabels.length).toBeGreaterThanOrEqual(3);
  });

  // ── Sections ──────────────────────────────────────────
  it('renders every view as a native disclosure section', () => {
    render(<EconomicImpactAnalyzer />);
    expectDisclosureSections(['Sector Analysis', 'Company Risk', 'Legislative Landscape']);
  });

  // ── Search ─────────────────────────────────────────────
  it('renders search input', () => {
    render(<EconomicImpactAnalyzer />);
    expect(screen.getByPlaceholderText('Search companies, sectors, legislation...')).toBeTruthy();
  });

  it('search filters sector results', () => {
    render(<EconomicImpactAnalyzer />);
    const input = screen.getByPlaceholderText('Search companies, sectors, legislation...');
    fireEvent.change(input, { target: { value: 'xyznonexistent123' } });
    // The Company Risk section should show no results when search doesn't match
    expect(inSection('Company Risk').getByText('No companies match your search')).toBeTruthy();
  });

  it('search filters legislative results', () => {
    render(<EconomicImpactAnalyzer />);
    const input = screen.getByPlaceholderText('Search companies, sectors, legislation...');
    fireEvent.change(input, { target: { value: 'xyznonexistent123' } });
    expect(inSection('Legislative Landscape').getByText('No legislation matches your search')).toBeTruthy();
  });

  // ── Sector Filter ──────────────────────────────────────
  it('renders sector filter dropdown', () => {
    render(<EconomicImpactAnalyzer />);
    expect(screen.getByLabelText('Filter by industry sector')).toBeTruthy();
  });

  it('sector filter contains All Sectors option', () => {
    render(<EconomicImpactAnalyzer />);
    expect(screen.getByText('All Sectors')).toBeTruthy();
  });

  // ── Sector Analysis View ───────────────────────────────
  it('renders sector cards with industry names', () => {
    render(<EconomicImpactAnalyzer />);
    expect(screen.getAllByText('Apparel').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Electronics').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Technology').length).toBeGreaterThanOrEqual(1);
  });

  it('sector cards show WRO counts', () => {
    render(<EconomicImpactAnalyzer />);
    const wroTexts = screen.getAllByText(/WROs/);
    expect(wroTexts.length).toBeGreaterThanOrEqual(1);
  });

  it('expanding a sector card shows detail', () => {
    render(<EconomicImpactAnalyzer />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    expect(expandBtns.length).toBeGreaterThan(0);
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('collapsing an expanded sector card works', () => {
    render(<EconomicImpactAnalyzer />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('expanded sector shows key products', () => {
    render(<EconomicImpactAnalyzer />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    // First sector is Apparel, should show cotton-related products
    expect(screen.getAllByText(/Cotton|Garments|Towels/).length).toBeGreaterThanOrEqual(1);
  });

  it('expanded sector shows source attribution', () => {
    render(<EconomicImpactAnalyzer />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    expect(screen.getAllByText(/Source:/).length).toBeGreaterThanOrEqual(1);
  });

  // ── Company Risk View ──────────────────────────────────
  it('company risk view shows company names', () => {
    render(<EconomicImpactAnalyzer />);
    const section = inSection('Company Risk');
    // Should show at least some company cards
    const expandBtns = section.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    expect(expandBtns.length).toBeGreaterThan(0);
  });

  it('expanding company shows evidence section', () => {
    render(<EconomicImpactAnalyzer />);
    const section = inSection('Company Risk');
    const expandBtns = section.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    fireEvent.click(expandBtns[0]);
    expect(section.getByText('Evidence')).toBeTruthy();
  });

  it('company risk labels are displayed', () => {
    render(<EconomicImpactAnalyzer />);
    const section = inSection('Company Risk');
    const riskLabels = section.getAllByText(/CRITICAL|HIGH|MODERATE|LOW/);
    expect(riskLabels.length).toBeGreaterThanOrEqual(1);
  });

  // ── Legislative Landscape View ─────────────────────────
  it('legislative view shows framework names', () => {
    render(<EconomicImpactAnalyzer />);
    const section = inSection('Legislative Landscape');
    expect(section.getAllByText(/Uyghur Forced Labor Prevention Act/).length).toBeGreaterThanOrEqual(1);
  });

  it('legislative view shows jurisdictions', () => {
    render(<EconomicImpactAnalyzer />);
    const section = inSection('Legislative Landscape');
    expect(section.getAllByText(/United States/).length).toBeGreaterThanOrEqual(1);
    expect(section.getAllByText(/European Union/).length).toBeGreaterThanOrEqual(1);
  });

  it('expanding legislative framework shows enforcement', () => {
    render(<EconomicImpactAnalyzer />);
    const section = inSection('Legislative Landscape');
    const expandBtns = section.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    expect(expandBtns.length).toBeGreaterThan(0);
    fireEvent.click(expandBtns[0]);
    expect(section.getByText('Enforcement')).toBeTruthy();
  });

  it('legislative framework shows impact level', () => {
    render(<EconomicImpactAnalyzer />);
    const section = inSection('Legislative Landscape');
    const impactLabels = section.getAllByText(/CRITICAL|HIGH|MODERATE|LOW/);
    expect(impactLabels.length).toBeGreaterThanOrEqual(1);
  });

  // ── Copy Report ────────────────────────────────────────
  it('renders copy report button', () => {
    render(<EconomicImpactAnalyzer />);
    expect(screen.getByLabelText('Copy intelligence report to clipboard')).toBeTruthy();
  });

  it('clicking copy report writes to clipboard', async () => {
    render(<EconomicImpactAnalyzer />);
    const btn = screen.getByLabelText('Copy intelligence report to clipboard');
    fireEvent.click(btn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    const clipboardText = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)![0];
    expect(clipboardText).toContain('ECONOMIC IMPACT ANALYZER');
    expect(clipboardText).toContain('CC BY 4.0');
  });

  it('copy report contains sector analysis', async () => {
    render(<EconomicImpactAnalyzer />);
    fireEvent.click(screen.getByLabelText('Copy intelligence report to clipboard'));
    const clipboardText = vi.mocked(navigator.clipboard.writeText).mock.calls.at(-1)![0];
    expect(clipboardText).toContain('SECTOR ANALYSIS');
    expect(clipboardText).toContain('LEGISLATIVE LANDSCAPE');
    expect(clipboardText).toContain('COMPANY RISK');
  });

  // ── Data Integrity ─────────────────────────────────────
  it('has at least 25 forced labor companies', () => {
    render(<EconomicImpactAnalyzer />);
    const container = screen.getByRole('region', { name: 'Economic Impact Analyzer' });
    const text = container.textContent;
    const match = text.match(/(\d+)\s+companies analyzed/);
    expect(match).toBeTruthy();
    expect(parseInt(match![1])).toBeGreaterThanOrEqual(25);
  });

  it('has at least 6 industry sectors', () => {
    render(<EconomicImpactAnalyzer />);
    const container = screen.getByRole('region', { name: 'Economic Impact Analyzer' });
    const text = container.textContent;
    const match = text.match(/(\d+)\s+sectors/);
    expect(match).toBeTruthy();
    expect(parseInt(match![1])).toBeGreaterThanOrEqual(6);
  });

  it('has at least 6 legislative frameworks', () => {
    render(<EconomicImpactAnalyzer />);
    const container = screen.getByRole('region', { name: 'Economic Impact Analyzer' });
    const text = container.textContent;
    const match = text.match(/(\d+)\s+legislative frameworks/);
    expect(match).toBeTruthy();
    expect(parseInt(match![1])).toBeGreaterThanOrEqual(6);
  });

  // ── No CCP Sources ─────────────────────────────────────
  it('does not reference CCP state media as sources', () => {
    render(<EconomicImpactAnalyzer />);
    // Expand one card to check sources
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    if (expandBtns.length > 0) fireEvent.click(expandBtns[0]);
    const container = screen.getByRole('region', { name: 'Economic Impact Analyzer' });
    const text = container.textContent.toLowerCase();
    expect(text).not.toContain('xinhua');
    expect(text).not.toContain('global times');
    expect(text).not.toContain("people's daily");
    expect(text).not.toContain('china daily');
  });

  // ── Footer ─────────────────────────────────────────────
  it('shows Tier 1-2 attribution', () => {
    render(<EconomicImpactAnalyzer />);
    expect(screen.getAllByText(/Tier 1-2 sources only/).length).toBeGreaterThanOrEqual(1);
  });

  it('shows CC BY 4.0 license', () => {
    render(<EconomicImpactAnalyzer />);
    expect(screen.getAllByText(/CC BY 4.0/).length).toBeGreaterThanOrEqual(1);
  });

  it('footer shows cross-reference data counts', () => {
    render(<EconomicImpactAnalyzer />);
    const container = screen.getByRole('region', { name: 'Economic Impact Analyzer' });
    expect(container.textContent).toContain('forced labor companies');
    expect(container.textContent).toContain('sanctions');
    expect(container.textContent).toContain('international responses');
    expect(container.textContent).toContain('legal cases');
  });

  // ── Accessibility ──────────────────────────────────────
  it('search input has aria-label', () => {
    render(<EconomicImpactAnalyzer />);
    expect(screen.getByLabelText('Search economic impact data')).toBeTruthy();
  });

  it('expandable cards have aria-expanded attribute', () => {
    render(<EconomicImpactAnalyzer />);
    const expandBtns = screen.getAllByRole('button').filter(
      b => b.getAttribute('aria-expanded') !== null
    );
    expandBtns.forEach(btn => {
      expect(btn.getAttribute('aria-expanded')).toBe('false');
    });
  });
});
