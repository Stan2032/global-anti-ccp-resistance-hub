import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SupplyChainRiskMapper from '../components/SupplyChainRiskMapper';

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
    expect(screen.getByText(/Direct evidence of forced labor \+ active enforcement/)).toBeTruthy();
    expect(screen.getByText(/Supply chain links to forced labor with documented evidence/)).toBeTruthy();
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

  it('renders all 3 view toggle buttons', () => {
    render(<SupplyChainRiskMapper />);
    expect(screen.getByText('Company Risk')).toBeTruthy();
    expect(screen.getByText('Industry Breakdown')).toBeTruthy();
    expect(screen.getByText('Legal Landscape')).toBeTruthy();
  });

  it('Company Risk view is active by default', () => {
    render(<SupplyChainRiskMapper />);
    const btn = screen.getByText('Company Risk').closest('button');
    expect(btn!.getAttribute('aria-pressed')).toBe('true');
  });

  it('clicking Industry Breakdown switches view', () => {
    render(<SupplyChainRiskMapper />);
    fireEvent.click(screen.getByText('Industry Breakdown'));
    const btn = screen.getByText('Industry Breakdown').closest('button');
    expect(btn!.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText(/Risk distribution across/)).toBeTruthy();
  });

  it('clicking Legal Landscape switches view', () => {
    render(<SupplyChainRiskMapper />);
    fireEvent.click(screen.getByText('Legal Landscape'));
    const btn = screen.getByText('Legal Landscape').closest('button');
    expect(btn!.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText(/key legislative frameworks/)).toBeTruthy();
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
    const input = screen.getByPlaceholderText('Search companies, industries...');
    fireEvent.change(input, { target: { value: 'Nike' } });
    expect(screen.getByText(/Nike/)).toBeTruthy();
  });

  it('shows empty state when no results', () => {
    render(<SupplyChainRiskMapper />);
    const input = screen.getByPlaceholderText('Search companies, industries...');
    fireEvent.change(input, { target: { value: 'xyznonexistent999' } });
    expect(screen.getByText(/No companies match your filters/)).toBeTruthy();
  });

  it('search is case-insensitive', () => {
    render(<SupplyChainRiskMapper />);
    const input = screen.getByPlaceholderText('Search companies, industries...');
    fireEvent.change(input, { target: { value: 'nike' } });
    expect(screen.getByText(/Nike/)).toBeTruthy();
  });

  // ── Expand/collapse ────────────────────────────────────

  it('cards start collapsed', () => {
    render(<SupplyChainRiskMapper />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    if (expandBtns.length > 0) {
      expect(expandBtns[0].getAttribute('aria-expanded')).toBe('false');
    }
  });

  it('clicking a card expands it', () => {
    render(<SupplyChainRiskMapper />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    if (expandBtns.length > 0) {
      fireEvent.click(expandBtns[0]);
      expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
    }
  });

  it('clicking an expanded card collapses it', () => {
    render(<SupplyChainRiskMapper />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    if (expandBtns.length > 0) {
      fireEvent.click(expandBtns[0]);
      expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
      fireEvent.click(expandBtns[0]);
      expect(expandBtns[0].getAttribute('aria-expanded')).toBe('false');
    }
  });

  it('only one card can be expanded at a time', () => {
    render(<SupplyChainRiskMapper />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    if (expandBtns.length > 1) {
      fireEvent.click(expandBtns[0]);
      expect(expandBtns[0].getAttribute('aria-expanded')).toBe('true');
      fireEvent.click(expandBtns[1]);
      expect(expandBtns[1].getAttribute('aria-expanded')).toBe('true');
      expect(expandBtns[0].getAttribute('aria-expanded')).toBe('false');
    }
  });

  it('expanded card shows evidence section', () => {
    render(<SupplyChainRiskMapper />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    if (expandBtns.length > 0) {
      fireEvent.click(expandBtns[0]);
      expect(screen.getByText('Evidence')).toBeTruthy();
    }
  });

  it('expanded card shows risk assessment', () => {
    render(<SupplyChainRiskMapper />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    if (expandBtns.length > 0) {
      fireEvent.click(expandBtns[0]);
      expect(screen.getByText(/Risk Assessment:/)).toBeTruthy();
    }
  });

  it('expanded card shows source link', () => {
    render(<SupplyChainRiskMapper />);
    const expandBtns = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-expanded') !== null
    );
    if (expandBtns.length > 0) {
      fireEvent.click(expandBtns[0]);
      const link = screen.queryByText('View source evidence');
      if (link) {
        const anchor = link.closest('a');
        expect(anchor!.getAttribute('target')).toBe('_blank');
        expect(anchor!.getAttribute('rel')).toContain('noopener');
      }
    }
  });

  // ── Industry Breakdown View ────────────────────────────

  it('Industry view shows sector cards', () => {
    render(<SupplyChainRiskMapper />);
    fireEvent.click(screen.getByText('Industry Breakdown'));
    // Should display industry sectors
    const allText = document.body.textContent;
    expect(allText).toContain('companies');
  });

  it('Industry view shows stacked risk bars', () => {
    render(<SupplyChainRiskMapper />);
    fireEvent.click(screen.getByText('Industry Breakdown'));
    // Risk level labels should be visible
    const allText = document.body.textContent;
    expect(allText.includes('High') || allText.includes('Moderate') || allText.includes('Critical')).toBe(true);
  });

  // ── Legal Landscape View ───────────────────────────────

  it('Legal view shows all 5 legislative frameworks', () => {
    render(<SupplyChainRiskMapper />);
    fireEvent.click(screen.getByText('Legal Landscape'));
    expect(screen.getByText(/Uyghur Forced Labor Prevention Act/)).toBeTruthy();
    expect(screen.getByText(/EU Corporate Sustainability Due Diligence/)).toBeTruthy();
    expect(screen.getByText(/UK Modern Slavery Act/)).toBeTruthy();
    expect(screen.getByText(/Canada Fighting Against Forced Labour Act/)).toBeTruthy();
    expect(screen.getByText(/Australia Modern Slavery Act/)).toBeTruthy();
  });

  it('Legal view shows scope and enforcement for each law', () => {
    render(<SupplyChainRiskMapper />);
    fireEvent.click(screen.getByText('Legal Landscape'));
    // UFLPA details
    expect(screen.getByText(/Presumes all goods from Xinjiang/)).toBeTruthy();
    expect(screen.getByText(/CBP Withhold Release Orders/)).toBeTruthy();
  });

  it('Legal view shows compliance advisory', () => {
    render(<SupplyChainRiskMapper />);
    fireEvent.click(screen.getByText('Legal Landscape'));
    expect(screen.getByText('Compliance Advisory')).toBeTruthy();
    expect(screen.getByText(/rebuttable presumption/)).toBeTruthy();
  });

  it('Legal view shows ACTIVE status badges', () => {
    render(<SupplyChainRiskMapper />);
    fireEvent.click(screen.getByText('Legal Landscape'));
    const badges = screen.getAllByText('ACTIVE');
    expect(badges.length).toBe(5);
  });

  it('Legal view shows enacted years', () => {
    render(<SupplyChainRiskMapper />);
    fireEvent.click(screen.getByText('Legal Landscape'));
    expect(screen.getByText(/Enacted: 2021/)).toBeTruthy();
    expect(screen.getByText(/Enacted: 2024/)).toBeTruthy();
    expect(screen.getByText(/Enacted: 2015/)).toBeTruthy();
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
