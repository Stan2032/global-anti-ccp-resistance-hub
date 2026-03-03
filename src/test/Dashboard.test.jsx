import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock lazy-loaded components
vi.mock('../components/NewsAggregator', () => ({ default: () => <div>NewsAggregator</div> }));
vi.mock('../components/UrgentCaseTimer', () => ({ default: () => <div>UrgentCaseTimer</div> }));
vi.mock('../components/LiveStatistics', () => ({ default: () => <div>LiveStatistics</div> }));
vi.mock('../components/EmergencyAlerts', () => ({ default: () => <div>EmergencyAlerts</div> }));
vi.mock('../components/NewsDigest', () => ({ default: () => <div>NewsDigest</div> }));
vi.mock('../components/RecentUpdates', () => ({ default: () => <div>RecentUpdates</div> }));

// Mock FEED_SOURCES from liveDataService
vi.mock('../services/liveDataService', () => ({
  FEED_SOURCES: {
    icij: { name: 'ICIJ', fullName: 'International Consortium of Investigative Journalists' },
    rfa: { name: 'Radio Free Asia', fullName: 'Radio Free Asia' },
    hkfp: { name: 'HKFP', fullName: 'Hong Kong Free Press' },
    aspi: { name: 'ASPI', fullName: 'Australian Strategic Policy Institute' },
    hrw: { name: 'HRW', fullName: 'Human Rights Watch' },
    amnesty: { name: 'Amnesty', fullName: 'Amnesty International' },
    cpj: { name: 'CPJ', fullName: 'Committee to Protect Journalists' },
    guardian: { name: 'Guardian', fullName: 'The Guardian' },
    bbc: { name: 'BBC', fullName: 'BBC News' },
  },
}));

// Mock useStatistics hook
let mockStatsReturn = {
  stats: null,
  loading: true,
  error: null,
};

vi.mock('../hooks/useLiveData', () => ({
  useStatistics: () => mockStatsReturn,
}));

import Dashboard from '../pages/Dashboard';

const renderDashboard = () =>
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStatsReturn = {
      stats: null,
      loading: true,
      error: null,
    };
  });

  // --- Header ---

  it('renders the dashboard header', () => {
    renderDashboard();
    expect(screen.getByText('resistance_dashboard')).toBeTruthy();
    expect(screen.getByText(/coordinating worldwide resistance/)).toBeTruthy();
  });

  it('shows systems online indicator', () => {
    renderDashboard();
    expect(screen.getByText('systems: online')).toBeTruthy();
  });

  // --- Stats Grid ---

  it('renders all 4 stat card titles', () => {
    renderDashboard();
    expect(screen.getByText('Verified Organizations')).toBeTruthy();
    expect(screen.getByText('Detention Facilities')).toBeTruthy();
    expect(screen.getByText('Active Campaigns')).toBeTruthy();
    expect(screen.getByText('Political Prisoners')).toBeTruthy();
  });

  it('shows loading state for stats', () => {
    renderDashboard();
    // When loading, stat values show '...'
    const dots = screen.getAllByText('...');
    expect(dots.length).toBeGreaterThanOrEqual(2);
  });

  it('shows stat values when loaded', () => {
    mockStatsReturn = {
      stats: {
        verifiedOrganizations: 49,
        detentionFacilities: 380,
        politicalPrisoners: 63,
      },
      loading: false,
      error: null,
    };
    renderDashboard();
    expect(screen.getByText('49')).toBeTruthy();
    expect(screen.getByText('380+')).toBeTruthy();
    expect(screen.getByText('63')).toBeTruthy();
  });

  it('shows stat labels', () => {
    renderDashboard();
    expect(screen.getByText('In database')).toBeTruthy();
    expect(screen.getByText('ASPI estimate')).toBeTruthy();
    expect(screen.getByText('Coming soon')).toBeTruthy();
    expect(screen.getByText('Documented cases')).toBeTruthy();
  });

  // --- Intelligence Overview ---

  it('renders intelligence overview section', () => {
    renderDashboard();
    expect(screen.getByText('intelligence_overview')).toBeTruthy();
    expect(screen.getByText('$ feeds --live →')).toBeTruthy();
  });

  it('lists verified intelligence sources from FEED_SOURCES', () => {
    renderDashboard();
    expect(screen.getByText('ICIJ')).toBeTruthy();
    expect(screen.getByText('Radio Free Asia')).toBeTruthy();
    expect(screen.getByText('HKFP')).toBeTruthy();
    expect(screen.getByText('ASPI')).toBeTruthy();
    expect(screen.getByText('HRW')).toBeTruthy();
    expect(screen.getByText('Amnesty')).toBeTruthy();
    expect(screen.getByText('CPJ')).toBeTruthy();
    expect(screen.getByText('Guardian')).toBeTruthy();
    expect(screen.getByText('BBC')).toBeTruthy();
  });

  it('shows correct source count from FEED_SOURCES', () => {
    renderDashboard();
    expect(screen.getByText('9')).toBeTruthy();
  });

  it('has link to live feeds', () => {
    renderDashboard();
    expect(screen.getByText('$ access --live-feeds')).toBeTruthy();
  });

  // --- Quick Actions ---

  it('renders quick actions section', () => {
    renderDashboard();
    expect(screen.getByText('quick_actions')).toBeTruthy();
  });

  it('renders all 3 quick action buttons', () => {
    renderDashboard();
    expect(screen.getByText('Take Action')).toBeTruthy();
    // "Security" appears in both quick actions and jump nav — use getAllByText
    expect(screen.getAllByText('Security').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Education')).toBeTruthy();
  });

  // --- Essential Tools ---

  it('renders essential security tools', () => {
    renderDashboard();
    expect(screen.getByText('essential_tools')).toBeTruthy();
    expect(screen.getByText('Tor Browser')).toBeTruthy();
    expect(screen.getByText('Signal')).toBeTruthy();
    expect(screen.getByText('ProtonMail')).toBeTruthy();
    expect(screen.getByText('Tails OS')).toBeTruthy();
  });

  it('links to external tool URLs', () => {
    renderDashboard();
    const torLink = screen.getByText('Tor Browser').closest('a');
    expect(torLink.getAttribute('href')).toBe('https://www.torproject.org/download/');
    expect(torLink.getAttribute('rel')).toContain('noopener');
  });

  // --- Footer ---

  it('renders dashboard footer', () => {
    renderDashboard();
    expect(screen.getByText(/resistance_hub v2\.11/)).toBeTruthy();
    expect(screen.getByText('// together we resist authoritarianism')).toBeTruthy();
  });

  // --- Lazy-loaded Sections ---

  it('renders suspense fallbacks for lazy-loaded sections', () => {
    renderDashboard();
    // Lazy components show loading fallback or actual content
    const loadingIndicators = screen.getAllByText('$ loading');
    expect(loadingIndicators.length).toBeGreaterThanOrEqual(1);
  });

  // --- Accessible Section Landmarks ---

  it('renders section landmarks with IDs for navigation', () => {
    renderDashboard();
    const container = document.body;
    expect(container.querySelector('#recent-updates')).toBeTruthy();
    expect(container.querySelector('#live-news')).toBeTruthy();
    expect(container.querySelector('#security-tools')).toBeTruthy();
    expect(container.querySelector('#statistics')).toBeTruthy();
    expect(container.querySelector('#news-digest')).toBeTruthy();
  });

  it('renders section headings with aria-labelledby', () => {
    renderDashboard();
    const sections = document.querySelectorAll('section[aria-labelledby]');
    expect(sections.length).toBe(5);
    sections.forEach(section => {
      const headingId = section.getAttribute('aria-labelledby');
      expect(section.querySelector(`#${headingId}`)).toBeTruthy();
    });
  });

  it('renders section jump navigation with anchor links', () => {
    renderDashboard();
    const nav = screen.getByLabelText('Dashboard sections');
    expect(nav).toBeTruthy();
    const links = nav.querySelectorAll('a');
    expect(links.length).toBe(5);
    const hrefs = Array.from(links).map(l => l.getAttribute('href'));
    expect(hrefs).toContain('#recent-updates');
    expect(hrefs).toContain('#live-news');
    expect(hrefs).toContain('#security-tools');
    expect(hrefs).toContain('#statistics');
    expect(hrefs).toContain('#news-digest');
  });
});
