import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import InfluenceNetwork from '../components/InfluenceNetwork';

describe('InfluenceNetwork', () => {
  // --- Rendering ---

  it('renders the component header', () => {
    render(<InfluenceNetwork />);
    expect(screen.getByText('influence_network')).toBeTruthy();
  });

  it('shows total data points in description', () => {
    render(<InfluenceNetwork />);
    expect(screen.getByText(/data points across/)).toBeTruthy();
  });

  it('renders summary stat cards', () => {
    render(<InfluenceNetwork />);
    expect(screen.getByText('Officials')).toBeTruthy();
    expect(screen.getByText('Prisoners')).toBeTruthy();
    expect(screen.getByText('Sanctions')).toBeTruthy();
    expect(screen.getByText('Facilities')).toBeTruthy();
    expect(screen.getByText('Companies')).toBeTruthy();
    expect(screen.getByText('Events')).toBeTruthy();
  });

  it('shows non-zero values for all stat cards', () => {
    const { container } = render(<InfluenceNetwork />);
    const boldValues = container.querySelectorAll('.text-lg.font-bold.text-white');
    expect(boldValues.length).toBeGreaterThanOrEqual(6);
    for (const el of boldValues) {
      const val = parseInt(el.textContent, 10);
      expect(val).toBeGreaterThan(0);
    }
  });

  // --- Region Selector ---

  it('renders 4 region buttons', () => {
    render(<InfluenceNetwork />);
    expect(screen.getByText('Xinjiang')).toBeTruthy();
    expect(screen.getByText('Hong Kong')).toBeTruthy();
    expect(screen.getByText('Tibet')).toBeTruthy();
    expect(screen.getByText('Central/National')).toBeTruthy();
  });

  it('shows officials and prisoners count per region', () => {
    render(<InfluenceNetwork />);
    const regionButtons = screen.getAllByText(/officials · \d+ prisoners/);
    expect(regionButtons.length).toBe(4);
  });

  it('region buttons have aria-pressed attribute', () => {
    render(<InfluenceNetwork />);
    const xinjiangBtn = screen.getByText('Xinjiang').closest('button');
    expect(xinjiangBtn!.getAttribute('aria-pressed')).toBe('false');
  });

  // --- Region Selection ---

  it('selecting a region shows the detail panel', () => {
    render(<InfluenceNetwork />);
    fireEvent.click(screen.getByText('Xinjiang'));
    expect(screen.getByText('Uyghur genocide, mass detention, forced labor')).toBeTruthy();
  });

  it('selecting Xinjiang shows regional description', () => {
    render(<InfluenceNetwork />);
    fireEvent.click(screen.getByText('Xinjiang'));
    expect(screen.getByText(/Uyghur genocide/)).toBeTruthy();
  });

  it('selecting Hong Kong shows regional description', () => {
    render(<InfluenceNetwork />);
    fireEvent.click(screen.getByText('Hong Kong'));
    expect(screen.getByText(/National Security Law/)).toBeTruthy();
  });

  it('deselecting a region hides the detail panel', () => {
    render(<InfluenceNetwork />);
    const xinjiangBtn = screen.getByText('Xinjiang').closest('button');
    fireEvent.click(xinjiangBtn!);
    expect(screen.getByText(/Uyghur genocide/)).toBeTruthy();
    fireEvent.click(xinjiangBtn!);
    expect(screen.queryByText(/Uyghur genocide/)).toBeNull();
  });

  it('sets aria-pressed to true when region is selected', () => {
    render(<InfluenceNetwork />);
    const xinjiangBtn = screen.getByText('Xinjiang').closest('button');
    fireEvent.click(xinjiangBtn!);
    expect(xinjiangBtn!.getAttribute('aria-pressed')).toBe('true');
  });

  it('switching regions updates the detail panel', () => {
    render(<InfluenceNetwork />);
    fireEvent.click(screen.getByText('Xinjiang'));
    expect(screen.getByText(/Uyghur genocide/)).toBeTruthy();
    fireEvent.click(screen.getByText('Hong Kong'));
    expect(screen.queryByText(/Uyghur genocide/)).toBeNull();
    expect(screen.getByText(/National Security Law/)).toBeTruthy();
  });

  // --- Expandable Sections ---

  it('shows expandable section headers when region selected', () => {
    render(<InfluenceNetwork />);
    fireEvent.click(screen.getByText('Xinjiang'));
    // Should show at least one section (officials, prisoners, timeline, or sanctions)
    const expandButtons = screen.getAllByRole('button', { expanded: false });
    expect(expandButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('expanding officials section shows official names', () => {
    render(<InfluenceNetwork />);
    const xinjiangBtn = screen.getByText('Xinjiang').closest('button');
    fireEvent.click(xinjiangBtn!);
    // Find the section that starts with "Sanctioned Officials (" — the expandable header
    const officialsHeaders = screen.getAllByText(/Sanctioned Officials/);
    const expandableHeader = officialsHeaders.find(
      (el) => el.textContent.includes('(') && el.closest('button')
    );
    if (expandableHeader) {
      fireEvent.click(expandableHeader.closest('button')!);
      // Should show at least one official card
      const cards = document.querySelectorAll('.bg-\\[\\#0a0e14\\]\\/50');
      expect(cards.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('section toggle buttons have aria-expanded', () => {
    render(<InfluenceNetwork />);
    const xinjiangBtn = screen.getByText('Xinjiang').closest('button');
    fireEvent.click(xinjiangBtn!);
    const officialsHeaders = screen.getAllByText(/Sanctioned Officials/);
    const expandableHeader = officialsHeaders.find(
      (el) => el.textContent.includes('(') && el.closest('button')
    );
    if (expandableHeader) {
      const btn = expandableHeader.closest('button');
      expect(btn!.getAttribute('aria-expanded')).toBe('false');
      fireEvent.click(btn!);
      expect(btn!.getAttribute('aria-expanded')).toBe('true');
    }
  });

  // --- Most-Sanctioned Officials ---

  it('renders Most-Sanctioned Officials section', () => {
    render(<InfluenceNetwork />);
    expect(screen.getByText('Most-Sanctioned Officials')).toBeTruthy();
    expect(screen.getByText('(3+ countries)')).toBeTruthy();
  });

  it('shows sanction country badges for highly-sanctioned officials', () => {
    const { container } = render(<InfluenceNetwork />);
    // Sanction badges use bg-red-900/30 — expect at least some for highly-sanctioned officials
    const badges = container.querySelectorAll('.bg-red-900\\/30');
    expect(badges.length).toBeGreaterThan(0);
  });

  // --- International Sanctions ---

  it('renders International Sanctions by Country section', () => {
    render(<InfluenceNetwork />);
    expect(screen.getByText('International Sanctions by Country')).toBeTruthy();
  });

  it('shows all 5 sanction countries', () => {
    render(<InfluenceNetwork />);
    expect(screen.getByText('us')).toBeTruthy();
    expect(screen.getByText('uk')).toBeTruthy();
    expect(screen.getByText('eu')).toBeTruthy();
    expect(screen.getByText('canada')).toBeTruthy();
    expect(screen.getByText('australia')).toBeTruthy();
  });

  // --- Source Policy ---

  it('shows source policy disclaimer', () => {
    render(<InfluenceNetwork />);
    expect(screen.getByText(/Tier 1-2 outlets only/)).toBeTruthy();
    expect(screen.getByText(/CCP state media never cited/)).toBeTruthy();
  });

  // --- No Hashtags ---

  it('contains no hashtags', () => {
    const { container } = render(<InfluenceNetwork />);
    const allText = container.textContent;
    const hashtagMatch = allText.match(/#[a-zA-Z]/);
    expect(hashtagMatch).toBeNull();
  });

  // --- Accessibility ---

  it('decorative icons have aria-hidden', () => {
    const { container } = render(<InfluenceNetwork />);
    const svgs = container.querySelectorAll('svg');
    for (const svg of svgs) {
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    }
  });
});
