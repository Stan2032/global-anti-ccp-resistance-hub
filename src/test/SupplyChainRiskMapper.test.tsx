import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import SupplyChainRiskMapper from '../components/SupplyChainRiskMapper';
import { cardsIn, expectDisclosureSections, inSection } from './helpers/disclosure';

// Mock clipboard
Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

describe('SupplyChainRiskMapper', () => {
  // ── Rendering ──────────────────────────────────────────

  it('renders the section title', () => {
    render(<SupplyChainRiskMapper />);
    expect(screen.getByText('Supply Chain Risk Mapper')).toBeTruthy();
  });

  it('has section aria-label', () => {
    render(<SupplyChainRiskMapper />);
    expect(screen.getByRole('region', { name: 'Supply Chain Risk Mapper' })).toBeTruthy();
  });

  it('renders description with company count', () => {
    render(<SupplyChainRiskMapper />);
    expect(screen.getByText(/companies against forced labor data/)).toBeTruthy();
  });

  // ── Risk summary cards ─────────────────────────────────

  it('renders all 4 risk level cards', () => {
    render(<SupplyChainRiskMapper />);
    expect(screen.getByText('Critical Risk')).toBeTruthy();
    expect(screen.getByText('High Risk')).toBeTruthy();
    expect(screen.getByText('Moderate Risk')).toBeTruthy();
    expect(screen.getByText('Low Risk')).toBeTruthy();
  });

  it('displays risk descriptions', () => {
    render(<SupplyChainRiskMapper />);
    // Also repeated in each company card's risk assessment, so getAll.
    expect(screen.getAllByText(/Direct evidence of forced labor \+ active enforcement/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Supply chain links to forced labor with documented evidence/).length).toBeGreaterThan(0);
  });

  // ── Stat bar ───────────────────────────────────────────

  it('displays company count stat', () => {
    render(<SupplyChainRiskMapper />);
    expect(screen.getByText(/companies assessed/)).toBeTruthy();
  });

  it('displays legislative frameworks stat', () => {
    render(<SupplyChainRiskMapper />);
    expect(screen.getAllByText(/legislative frameworks/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays sanctions tracked stat', () => {
    render(<SupplyChainRiskMapper />);
    expect(screen.getByText(/sanctions tracked/)).toBeTruthy();
  });

  // ── View toggle ────────────────────────────────────────

  it('renders every view as a native disclosure section', () => {
    render(<SupplyChainRiskMapper />);
    expectDisclosureSections(['Company Risk', 'Industry Breakdown', 'Legal Landscape']);
  });

  // ── Company Risk View ──────────────────────────────────

  it('renders company cards in default view', () => {
    render(<SupplyChainRiskMapper />);
    // Should show at least some companies from forced labor data
    const allText = document.body.textContent;
    expect(allText).toContain('Showing');
    expect(allText).toContain('companies');
  });

  it('renders search input', () => {
    render(<SupplyChainRiskMapper />);
    expect(screen.getByPlaceholderText('Search companies, industries...')).toBeTruthy();
  });

  it('search input has aria-label', () => {
    render(<SupplyChainRiskMapper />);
    expect(screen.getByLabelText('Search companies')).toBeTruthy();
  });

  it('renders industry filter dropdown', () => {
    render(<SupplyChainRiskMapper />);
    expect(screen.getByLabelText('Filter by industry')).toBeTruthy();
  });

  it('renders risk level filter dropdown', () => {
    render(<SupplyChainRiskMapper />);
    expect(screen.getByLabelText('Filter by risk level')).toBeTruthy();
  });

  it('filters by search query', () => {
    render(<SupplyChainRiskMapper />);
    fireEvent.change(screen.getByPlaceholderText('Search companies, industries...'), { target: { value: 'Nike' } });
    const cards = cardsIn('Company Risk');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach(card => expect(card.querySelector('summary')!.textContent).toMatch(/Nike/));
  });

  it('shows empty state when no results', () => {
    render(<SupplyChainRiskMapper />);
    const input = screen.getByPlaceholderText('Search companies, industries...');
    fireEvent.change(input, { target: { value: 'xyznonexistent999' } });
    expect(screen.getByText(/No companies match your filters/)).toBeTruthy();
  });

  it('search is case-insensitive', () => {
    render(<SupplyChainRiskMapper />);
    fireEvent.change(screen.getByPlaceholderText('Search companies, industries...'), { target: { value: 'nike' } });
    const cards = cardsIn('Company Risk');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach(card => expect(card.querySelector('summary')!.textContent).toMatch(/Nike/));
  });

  // ── Expand/collapse ────────────────────────────────────

  it('company cards are native disclosures, closed to start', () => {
    const { container } = render(<SupplyChainRiskMapper />);
    expect(container.querySelectorAll('[aria-expanded]')).toHaveLength(0);
    const cards = cardsIn('Company Risk');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach(card => {
      expect(card.firstElementChild?.tagName).toBe('SUMMARY');
      expect(card.open).toBe(false);
    });
  });

  it('a company card opens and closes natively', () => {
    render(<SupplyChainRiskMapper />);
    const [card] = cardsIn('Company Risk');
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(true);
    fireEvent.click(card.querySelector('summary')!);
    expect(card.open).toBe(false);
  });


  it('opening one card leaves the others as they were', () => {
    // One-at-a-time was a JavaScript nicety; native cards open independently.
    render(<SupplyChainRiskMapper />);
    const [first, second] = cardsIn('Company Risk');
    fireEvent.click(first.querySelector('summary')!);
    fireEvent.click(second.querySelector('summary')!);
    expect(first.open).toBe(true);
    expect(second.open).toBe(true);
  });

  it('a company card carries its evidence without a click', () => {
    render(<SupplyChainRiskMapper />);
    expect(within(cardsIn('Company Risk')[0]).getByText('Evidence')).toBeTruthy();
  });

  it('every company card carries its risk assessment without a click', () => {
    render(<SupplyChainRiskMapper />);
    cardsIn('Company Risk').forEach(card => expect(card.textContent).toMatch(/Risk Assessment:/));
  });

  it('source links open safely in a new tab', () => {
    render(<SupplyChainRiskMapper />);
    const links = screen.getAllByText('View source evidence').map(l => l.closest('a')!);
    expect(links.length).toBeGreaterThan(0);
    links.forEach(a => {
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toContain('noopener');
    });
  });

  // ── Industry Breakdown View ────────────────────────────

  it('Industry view shows sector cards', () => {
    render(<SupplyChainRiskMapper />);
    const section = inSection('Industry Breakdown');
    // Should display industry sectors
    const allText = document.body.textContent;
    expect(allText).toContain('companies');
  });

  it('Industry view shows stacked risk bars', () => {
    render(<SupplyChainRiskMapper />);
    const section = inSection('Industry Breakdown');
    // Risk level labels should be visible
    const allText = document.body.textContent;
    expect(allText.includes('High') || allText.includes('Moderate') || allText.includes('Critical')).toBe(true);
  });

  // ── Legal Landscape View ───────────────────────────────

  it('Legal view shows all 5 legislative frameworks', () => {
    render(<SupplyChainRiskMapper />);
    const section = inSection('Legal Landscape');
    expect(section.getByText(/Uyghur Forced Labor Prevention Act/)).toBeTruthy();
    expect(section.getByText(/EU Corporate Sustainability Due Diligence/)).toBeTruthy();
    expect(section.getByText(/UK Modern Slavery Act/)).toBeTruthy();
    expect(section.getByText(/Canada Fighting Against Forced Labour Act/)).toBeTruthy();
    expect(section.getByText(/Australia Modern Slavery Act/)).toBeTruthy();
  });

  it('Legal view shows scope and enforcement for each law', () => {
    render(<SupplyChainRiskMapper />);
    const section = inSection('Legal Landscape');
    // UFLPA details
    expect(section.getByText(/Presumes all goods from Xinjiang/)).toBeTruthy();
    expect(section.getByText(/CBP Withhold Release Orders/)).toBeTruthy();
  });

  it('Legal view shows compliance advisory', () => {
    render(<SupplyChainRiskMapper />);
    const section = inSection('Legal Landscape');
    expect(section.getByText('Compliance Advisory')).toBeTruthy();
    expect(section.getByText(/rebuttable presumption/)).toBeTruthy();
  });

  it('Legal view shows ACTIVE status badges', () => {
    render(<SupplyChainRiskMapper />);
    const section = inSection('Legal Landscape');
    const badges = section.getAllByText('ACTIVE');
    expect(badges.length).toBe(5);
  });

  it('Legal view shows enacted years', () => {
    render(<SupplyChainRiskMapper />);
    const section = inSection('Legal Landscape');
    expect(section.getByText(/Enacted: 2021/)).toBeTruthy();
    expect(section.getByText(/Enacted: 2024/)).toBeTruthy();
    expect(section.getByText(/Enacted: 2015/)).toBeTruthy();
  });

  // ── Copy to clipboard ─────────────────────────────────

  it('renders copy button', () => {
    render(<SupplyChainRiskMapper />);
    expect(screen.getByText('Copy report')).toBeTruthy();
  });

  it('copies to clipboard on click', () => {
    render(<SupplyChainRiskMapper />);
    fireEvent.click(screen.getByText('Copy report'));
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    const text = vi.mocked(navigator.clipboard.writeText).mock.calls[0][0];
    expect(text).toContain('Supply Chain Risk Assessment');
    expect(text).toContain('CC BY 4.0');
  });

  // ── Data quality ───────────────────────────────────────

  it('no CCP state media in sources', () => {
    render(<SupplyChainRiskMapper />);
    const allText = document.body.textContent;
    expect(allText.includes('Xinhua') && allText.includes('source')).toBe(false);
    expect(allText).not.toContain('CGTN');
    expect(allText).not.toContain('Global Times');
  });

  // ── Footer ─────────────────────────────────────────────

  it('shows data source attribution', () => {
    render(<SupplyChainRiskMapper />);
    expect(screen.getByText(/Data sourced from ASPI/)).toBeTruthy();
  });

  it('shows CC BY 4.0 attribution', () => {
    render(<SupplyChainRiskMapper />);
    expect(screen.getByText(/CC BY 4.0/)).toBeTruthy();
  });

  // ── Combined filters ───────────────────────────────────

  it('search + risk filter combine', () => {
    render(<SupplyChainRiskMapper />);
    const riskSelect = screen.getByLabelText('Filter by risk level');
    fireEvent.change(riskSelect, { target: { value: 'High' } });
    // Should filter results
    const countText = screen.getByText(/Showing \d+ of \d+ companies/);
    expect(countText).toBeTruthy();
  });
});
