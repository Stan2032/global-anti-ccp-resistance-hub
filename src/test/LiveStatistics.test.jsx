import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import LiveStatistics from '../components/LiveStatistics';

// Mock IntersectionObserver for AnimatedCounter
beforeEach(() => {
  window.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('LiveStatistics', () => {
  // --- Header Rendering ---

  it('renders the header with title', () => {
    render(<LiveStatistics />);
    expect(screen.getByText('The Human Cost')).toBeTruthy();
    expect(screen.getByText(/Real-time statistics on CCP repression/)).toBeTruthy();
  });

  it('renders the emotional context paragraph', () => {
    render(<LiveStatistics />);
    expect(screen.getByText(/These numbers represent real people/)).toBeTruthy();
  });

  it('shows data compilation notice', () => {
    render(<LiveStatistics />);
    expect(screen.getByText(/Data compiled from verified sources/)).toBeTruthy();
  });

  it('displays last updated date', () => {
    render(<LiveStatistics />);
    expect(screen.getByText(/Last updated:/)).toBeTruthy();
  });

  // --- All 8 Statistics Rendered ---

  it('renders Political Prisoners statistic', () => {
    render(<LiveStatistics />);
    expect(screen.getByText('Political Prisoners')).toBeTruthy();
    expect(screen.getByText('Documented political prisoners in China')).toBeTruthy();
    expect(screen.getByText(/CECC, Dui Hua Foundation/)).toBeTruthy();
  });

  it('renders Uyghurs Detained statistic', () => {
    render(<LiveStatistics />);
    expect(screen.getByText('Uyghurs Detained')).toBeTruthy();
    expect(screen.getByText('Estimated Uyghurs in detention camps')).toBeTruthy();
    expect(screen.getByText(/Adrian Zenz, ASPI/)).toBeTruthy();
  });

  it('renders Overseas Police Stations statistic', () => {
    render(<LiveStatistics />);
    expect(screen.getByText('Overseas Police Stations')).toBeTruthy();
    expect(screen.getByText('CCP police stations in 53 countries')).toBeTruthy();
    expect(screen.getAllByText(/Safeguard Defenders/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders Confucius Institutes statistic', () => {
    render(<LiveStatistics />);
    expect(screen.getByText('Confucius Institutes')).toBeTruthy();
    expect(screen.getByText('Propaganda centers worldwide')).toBeTruthy();
  });

  it('renders HK Political Prisoners statistic', () => {
    render(<LiveStatistics />);
    expect(screen.getByText('HK Political Prisoners')).toBeTruthy();
    expect(screen.getByText(/Arrested under National Security Law/)).toBeTruthy();
    expect(screen.getAllByText(/Hong Kong Watch/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders Forced Returns statistic', () => {
    render(<LiveStatistics />);
    expect(screen.getByText('Forced Returns')).toBeTruthy();
    expect(screen.getByText(/People "persuaded" to return to China/)).toBeTruthy();
  });

  it('renders Journalists Imprisoned statistic', () => {
    render(<LiveStatistics />);
    expect(screen.getByText('Journalists Imprisoned')).toBeTruthy();
    expect(screen.getByText(/World's worst jailer of journalists/)).toBeTruthy();
    expect(screen.getAllByText(/CPJ/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders Organ Harvesting Victims statistic', () => {
    render(<LiveStatistics />);
    expect(screen.getByText('Organ Harvesting Victims')).toBeTruthy();
    expect(screen.getByText('Estimated annual forced organ extractions')).toBeTruthy();
    expect(screen.getAllByText(/China Tribunal/).length).toBeGreaterThanOrEqual(1);
  });

  // --- Trend Indicators ---

  it('shows trend indicators for all statistics', () => {
    render(<LiveStatistics />);
    expect(screen.getByText('+47 this month')).toBeTruthy();
    expect(screen.getByText('Ongoing since 2017')).toBeTruthy();
    expect(screen.getByText('14 under investigation')).toBeTruthy();
    expect(screen.getByText('118 closed in US')).toBeTruthy();
    expect(screen.getByText('#1 worldwide')).toBeTruthy();
    expect(screen.getByText('Ongoing crime')).toBeTruthy();
  });

  // --- Context Sections ---

  it('renders "Why These Numbers Matter" section', () => {
    render(<LiveStatistics />);
    expect(screen.getByText('Why These Numbers Matter')).toBeTruthy();
    expect(screen.getByText(/Statistics help document the scale/)).toBeTruthy();
  });

  it('renders "Data Verification" section', () => {
    render(<LiveStatistics />);
    expect(screen.getByText('Data Verification')).toBeTruthy();
    expect(screen.getByText(/compiled from reputable sources/)).toBeTruthy();
  });

  it('renders "Underreported Reality" section', () => {
    render(<LiveStatistics />);
    expect(screen.getByText('Underreported Reality')).toBeTruthy();
    expect(screen.getByText(/likely underestimates/)).toBeTruthy();
  });

  // --- Data Sources ---

  it('renders all 6 data source links', () => {
    render(<LiveStatistics />);
    expect(screen.getByText('Data Sources')).toBeTruthy();
    expect(screen.getByText('Congressional-Executive Commission on China (CECC)')).toBeTruthy();
    expect(screen.getByText('Safeguard Defenders')).toBeTruthy();
    expect(screen.getByText('Australian Strategic Policy Institute (ASPI)')).toBeTruthy();
    expect(screen.getByText('Hong Kong Watch')).toBeTruthy();
    expect(screen.getByText('Committee to Protect Journalists (CPJ)')).toBeTruthy();
    expect(screen.getByText('China Tribunal')).toBeTruthy();
  });

  it('source links open in new tab with noopener', () => {
    render(<LiveStatistics />);
    const ceccLink = screen.getByText('Congressional-Executive Commission on China (CECC)');
    expect(ceccLink.getAttribute('target')).toBe('_blank');
    expect(ceccLink.getAttribute('rel')).toContain('noopener');
    expect(ceccLink.getAttribute('href')).toBe('https://www.cecc.gov');
  });

  it('all source links use HTTPS', () => {
    render(<LiveStatistics />);
    const sources = [
      'Congressional-Executive Commission on China (CECC)',
      'Safeguard Defenders',
      'Australian Strategic Policy Institute (ASPI)',
      'Hong Kong Watch',
      'Committee to Protect Journalists (CPJ)',
      'China Tribunal',
    ];
    sources.forEach(name => {
      const link = screen.getByText(name);
      expect(link.getAttribute('href')).toMatch(/^https:\/\//);
    });
  });

  // --- No CCP State Media ---

  it('does not reference CCP state media sources', () => {
    render(<LiveStatistics />);
    const html = document.body.innerHTML;
    const ccpMedia = ['xinhua', 'cgtn', 'global times', 'people\'s daily', 'china daily'];
    ccpMedia.forEach(source => {
      expect(html.toLowerCase()).not.toContain(source);
    });
  });
});
