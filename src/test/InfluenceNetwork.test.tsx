import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import InfluenceNetwork from '../components/InfluenceNetwork';
import { dataApi } from '../services/dataApi';

const REGIONS = [
  { label: 'Xinjiang', description: 'Uyghur genocide, mass detention, forced labor' },
  { label: 'Hong Kong', description: 'National Security Law, press freedom crackdown' },
  { label: 'Tibet', description: 'Cultural destruction, religious persecution' },
  { label: 'Central/National', description: 'Systemic repression apparatus' },
];

/** A region's <details>, found by the heading in its summary. */
function region(label: string): HTMLDetailsElement {
  const summary = screen.getByRole('heading', { level: 3, name: label }).parentElement!;
  expect(summary.tagName, `${label} heading sits directly in a <summary>`).toBe('SUMMARY');
  expect(summary.parentElement!.tagName).toBe('DETAILS');
  return summary.parentElement as HTMLDetailsElement;
}

/** A region's sections (officials, prisoners, timeline, sanctions). */
function sectionsOf(regionEl: HTMLDetailsElement): HTMLDetailsElement[] {
  return [...regionEl.querySelectorAll('details')];
}

/** The entry cards in a section's body. */
function entriesOf(section: HTMLDetailsElement): Element[] {
  const body = section.querySelector(':scope > summary + div')!;
  return [...body.children].filter((el) => el.tagName === 'DIV');
}

/** The static block headed by this title. */
function sectionBelow(title: string): HTMLElement {
  return screen.getByRole('heading', { level: 3, name: title }).parentElement!.parentElement!;
}

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

  // --- Regions: native disclosures ---

  it('renders the 4 regions as closed native disclosures, each named by a heading', () => {
    render(<InfluenceNetwork />);
    for (const { label } of REGIONS) {
      expect(region(label).open, `${label} starts closed`).toBe(false);
    }
  });

  it('shows officials and prisoners count per region', () => {
    render(<InfluenceNetwork />);
    const regionButtons = screen.getAllByText(/officials · \d+ prisoners/);
    expect(regionButtons.length).toBe(4);
  });

  it('puts every region’s description and sections in the page before any click', () => {
    render(<InfluenceNetwork />);
    for (const { label, description } of REGIONS) {
      const r = region(label);
      expect(within(r).getByText(description)).toBeTruthy();
      expect(sectionsOf(r).length, `${label} has sections`).toBeGreaterThan(0);
    }
  });

  it('lists every entry its title counts: the sections are not cut short', () => {
    render(<InfluenceNetwork />);
    let checked = 0;
    for (const { label } of REGIONS) {
      for (const section of sectionsOf(region(label))) {
        const title = section.querySelector(':scope > summary')!.textContent!;
        const count = Number(title.match(/\((\d+)\)/)![1]);
        expect(entriesOf(section), `${label}: ${title}`).toHaveLength(count);
        checked++;
      }
    }
    expect(checked).toBeGreaterThanOrEqual(REGIONS.length);
  });

  it('lists every Xinjiang official without a click', () => {
    render(<InfluenceNetwork />);
    const expected = dataApi
      .getSanctionedOfficials()
      .filter((o) => (o.responsibility_area || '').toLowerCase().includes('xinjiang'));
    expect(expected.length).toBeGreaterThan(0);
    const officials = sectionsOf(region('Xinjiang')).find((d) =>
      d.querySelector(':scope > summary')!.textContent!.startsWith('Sanctioned Officials'),
    );
    expect(officials).toBeDefined();
    for (const o of expected) {
      expect(within(officials!).getAllByText(o.name).length).toBeGreaterThan(0);
    }
  });

  it('a region and its sections open and close natively', () => {
    render(<InfluenceNetwork />);
    const r = region('Xinjiang');
    fireEvent.click(r.querySelector(':scope > summary')!);
    expect(r.open).toBe(true);
    const [first] = sectionsOf(r);
    fireEvent.click(first.querySelector(':scope > summary')!);
    expect(first.open).toBe(true);
    fireEvent.click(first.querySelector(':scope > summary')!);
    expect(first.open).toBe(false);
    fireEvent.click(r.querySelector(':scope > summary')!);
    expect(r.open).toBe(false);
  });

  it('leaves no button, aria-pressed or aria-expanded control behind', () => {
    const { container } = render(<InfluenceNetwork />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(container.querySelectorAll('[aria-pressed], [aria-expanded]')).toHaveLength(0);
  });

  // --- Most-Sanctioned Officials ---

  it('renders Most-Sanctioned Officials section', () => {
    render(<InfluenceNetwork />);
    expect(screen.getByText('Most-Sanctioned Officials')).toBeTruthy();
    expect(screen.getByText('(3+ countries)')).toBeTruthy();
  });

  it('shows sanction country badges for highly-sanctioned officials', () => {
    render(<InfluenceNetwork />);
    // Sanction badges use bg-red-900/30 — expect at least some for highly-sanctioned officials
    const badges = sectionBelow('Most-Sanctioned Officials').querySelectorAll('.bg-red-900\\/30');
    expect(badges.length).toBeGreaterThan(0);
  });

  // --- Phone width ---

  it('lets sanction badges wrap onto a new line instead of running past the card', () => {
    const { container } = render(<InfluenceNetwork />);
    const countries = ['US', 'UK', 'EU', 'CANADA', 'AUSTRALIA'];
    const badgeGroups = new Set(
      [...container.querySelectorAll('.bg-red-900\\/30')]
        .filter((badge) => countries.includes(badge.textContent!))
        .map((badge) => badge.parentElement!),
    );
    expect(badgeGroups.size).toBeGreaterThan(0);
    for (const group of badgeGroups) {
      expect(group.className).toContain('flex-wrap');
      expect(group.parentElement!.className).toMatch(/flex-wrap|flex-col/);
    }
  });

  it('shows every position and event description in full, none cut off', () => {
    const { container } = render(<InfluenceNetwork />);
    expect(container.querySelectorAll('.truncate, [class*="line-clamp"]')).toHaveLength(0);
  });

  // --- International Sanctions ---

  it('renders International Sanctions by Country section', () => {
    render(<InfluenceNetwork />);
    expect(screen.getByText('International Sanctions by Country')).toBeTruthy();
  });

  it('shows all 5 sanction countries', () => {
    render(<InfluenceNetwork />);
    const countries = within(sectionBelow('International Sanctions by Country'));
    expect(countries.getByText('us')).toBeTruthy();
    expect(countries.getByText('uk')).toBeTruthy();
    expect(countries.getByText('eu')).toBeTruthy();
    expect(countries.getByText('canada')).toBeTruthy();
    expect(countries.getByText('australia')).toBeTruthy();
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
