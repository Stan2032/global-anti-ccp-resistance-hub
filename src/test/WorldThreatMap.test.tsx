import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import WorldThreatMap from '../components/WorldThreatMap';

describe('WorldThreatMap', () => {
  it('renders the heading', () => {
    render(<WorldThreatMap />);
    expect(screen.getByText('Global CCP Threat Map')).toBeTruthy();
  });

  it('renders region cards', () => {
    render(<WorldThreatMap />);
    const summaries = [...document.querySelectorAll('summary')].map(s => s.textContent);
    expect(summaries.some(t => t!.includes('Europe'))).toBe(true);
    expect(summaries.some(t => t!.includes('North America'))).toBe(true);
  });

  it('shows total police stations per region', () => {
    render(<WorldThreatMap />);
    // Europe has 54 stations
    expect(screen.getByText(/54/)).toBeTruthy();
  });

  // Each region is a native <details>: its countries were rendered only
  // after a click, never without JavaScript, and each country showed two of
  // its threats. The map's hotspots were a mouse-hover tooltip.
  const REGIONS = ['Europe', 'North America', 'South America', 'Asia Pacific', 'Africa', 'Middle East'];
  const regionEntry = (region: string) => {
    const entry = document.getElementById(`threat-region-${region.toLowerCase().replace(/\s+/g, '-')}`);
    expect(entry?.tagName, `${region}'s entry is a <details>`).toBe('DETAILS');
    return entry as HTMLDetailsElement;
  };

  it('renders every region as a closed native disclosure, with its risk level', () => {
    render(<WorldThreatMap />);
    for (const region of REGIONS) {
      const summary = regionEntry(region).querySelector(':scope > summary')!;
      expect(summary.textContent, region).toContain(region);
      expect(summary.textContent, region).toMatch(/(CRITICAL|HIGH|MEDIUM|LOW) RISK/);
      expect(regionEntry(region).open).toBe(false);
    }
    expect(within(regionEntry('Europe')).getByText('CRITICAL RISK')).toBeTruthy();
  });

  it("puts every region's countries in the page before any click", () => {
    render(<WorldThreatMap />);
    const europe = within(regionEntry('Europe'));
    const italy = europe.getByText('Italy').parentElement!.parentElement!;
    expect(within(italy).getByText('9 stations')).toBeTruthy();
    expect(within(italy).getByText(/Rome, Milan, Florence/)).toBeTruthy();
    expect(within(regionEntry('Africa')).getByText('South Africa')).toBeTruthy();
  });

  it("lists all of a country's threats, not the first two", () => {
    render(<WorldThreatMap />);
    const europe = within(regionEntry('Europe'));
    expect(europe.getByText('Largest concentration in Europe')).toBeTruthy();
    expect(europe.getByText('Business pressure')).toBeTruthy();
  });

  it("clicking a region on the map opens that region's entry", () => {
    const { container } = render(<WorldThreatMap />);
    const europePath = [...container.querySelectorAll('path > title')].find(t => t.textContent === 'Europe')!.parentElement!;
    Element.prototype.scrollIntoView = () => {};
    fireEvent.click(europePath);
    expect(regionEntry('Europe').open).toBe(true);
  });

  it('lists the hotspots, which were only a mouse-hover tooltip', () => {
    render(<WorldThreatMap />);
    const list = within(screen.getByRole('heading', { name: 'Hotspots' }).nextElementSibling as HTMLElement);
    expect(list.getAllByRole('listitem').length).toBeGreaterThanOrEqual(6);
    expect(list.getByText('Taiwan Strait')).toBeTruthy();
    expect(list.getByText('Military threat - daily incursions')).toBeTruthy();
  });

  it('does not claim to be live: its figures are fixed in the page', () => {
    render(<WorldThreatMap />);
    expect(screen.queryByText(/LIVE THREAT DATA/)).toBeNull();
  });

  it('renders multiple regions', () => {
    render(<WorldThreatMap />);
    const summaries = [...document.querySelectorAll('summary')].map(s => s.textContent);
    for (const region of REGIONS) {
      expect(summaries.some(t => t!.includes(region)), region).toBe(true);
    }
  });

  it('renders globe icon or map visual', () => {
    const { container } = render(<WorldThreatMap />);
    // Should have some visual element (SVG icons)
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });
});
