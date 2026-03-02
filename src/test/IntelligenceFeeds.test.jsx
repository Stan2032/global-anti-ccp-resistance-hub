import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock lazy-loaded components
vi.mock('../components/HongKongStatus', () => ({ default: () => <div>HongKongStatus</div> }));
vi.mock('../components/TibetStatus', () => ({ default: () => <div>TibetStatus</div> }));
vi.mock('../components/XinjiangStatus', () => ({ default: () => <div>XinjiangStatus</div> }));
vi.mock('../components/TaiwanDefenseStatus', () => ({ default: () => <div>TaiwanDefenseStatus</div> }));
vi.mock('../components/CCPOfficials', () => ({ default: () => <div>CCPOfficials</div> }));
vi.mock('../components/WorldThreatMap', () => ({ default: () => <div>WorldThreatMap</div> }));
vi.mock('../components/DetentionFacilities', () => ({ default: () => <div>DetentionFacilities</div> }));
vi.mock('../components/SanctionedOfficials', () => ({ default: () => <div>SanctionedOfficials</div> }));
vi.mock('../components/ResearchDashboard', () => ({ default: () => <div>ResearchDashboard</div> }));

// Mock useLiveFeeds hook
const mockRefresh = vi.fn();
let mockHookReturn = {
  feeds: [],
  loading: true,
  error: null,
  lastUpdated: null,
  refresh: mockRefresh,
  sources: {
    icij: { name: 'ICIJ', url: 'https://www.icij.org', description: 'Global investigative journalists' },
    rfa: { name: 'Radio Free Asia', url: 'https://www.rfa.org', description: 'Independent news covering Asia' },
    hkfp: { name: 'HKFP', url: 'https://hongkongfp.com', description: 'Independent English-language news' },
  },
};

vi.mock('../hooks/useLiveData', () => ({
  useLiveFeeds: () => mockHookReturn,
}));

import IntelligenceFeeds from '../pages/IntelligenceFeeds';

describe('IntelligenceFeeds', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHookReturn = {
      feeds: [],
      loading: true,
      error: null,
      lastUpdated: null,
      refresh: mockRefresh,
      sources: {
        icij: { name: 'ICIJ', url: 'https://www.icij.org', description: 'Global investigative journalists' },
        rfa: { name: 'Radio Free Asia', url: 'https://www.rfa.org', description: 'Independent news covering Asia' },
        hkfp: { name: 'HKFP', url: 'https://hongkongfp.com', description: 'Independent English-language news' },
      },
    };
  });

  // --- Header ---

  it('renders the page header', () => {
    render(<IntelligenceFeeds />);
    expect(screen.getByText('Live Intelligence Feed')).toBeTruthy();
    expect(screen.getByText('Real-time news from verified sources worldwide')).toBeTruthy();
  });

  it('shows Live Connected status', () => {
    render(<IntelligenceFeeds />);
    expect(screen.getByText('Live Connected')).toBeTruthy();
  });

  // --- Tab Navigation ---

  it('renders all 3 tab buttons', () => {
    render(<IntelligenceFeeds />);
    expect(screen.getByText('Live Feeds')).toBeTruthy();
    expect(screen.getByText('Regional Status')).toBeTruthy();
    expect(screen.getByText('CCP Operations')).toBeTruthy();
  });

  it('defaults to Live Feeds tab', () => {
    render(<IntelligenceFeeds />);
    expect(screen.getByText('All Sources')).toBeTruthy();
    expect(screen.getByLabelText('Search')).toBeTruthy();
  });

  // --- Loading State ---

  it('shows loading banner when feeds are loading', () => {
    render(<IntelligenceFeeds />);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText(/Fetching feeds from 3 sources/)).toBeTruthy();
  });

  it('does not show loaded confirmation while loading', () => {
    render(<IntelligenceFeeds />);
    expect(screen.queryByText(/articles loaded from/)).toBeNull();
  });

  // --- Loaded State ---

  it('shows loaded confirmation when feeds are loaded', () => {
    mockHookReturn = {
      ...mockHookReturn,
      loading: false,
      feeds: [
        { id: '1', title: 'Test Article', description: 'Test desc', source: 'icij', pubDate: new Date().toISOString(), link: 'https://example.com', relevanceScore: 10 },
      ],
      lastUpdated: new Date(),
    };
    render(<IntelligenceFeeds />);
    expect(screen.getByText(/1 article loaded from 3 sources/)).toBeTruthy();
  });

  it('does not show loading banner when loaded', () => {
    mockHookReturn = {
      ...mockHookReturn,
      loading: false,
      feeds: [
        { id: '1', title: 'Test Article', description: 'Test desc', source: 'icij', pubDate: new Date().toISOString(), link: 'https://example.com', relevanceScore: 10 },
      ],
      lastUpdated: new Date(),
    };
    render(<IntelligenceFeeds />);
    expect(screen.queryByRole('status')).toBeNull();
  });

  // --- No Source Info Cards ---

  it('does not render individual source info cards', () => {
    render(<IntelligenceFeeds />);
    // Source info cards previously had "Visit source →" links and "LIVE" badges
    expect(screen.queryByText('Visit source →')).toBeNull();
    expect(screen.queryByText('LIVE')).toBeNull();
  });

  // --- Source Filter Buttons ---

  it('renders source filter buttons for all sources', () => {
    render(<IntelligenceFeeds />);
    expect(screen.getByText('All Sources')).toBeTruthy();
    expect(screen.getByText('ICIJ')).toBeTruthy();
    expect(screen.getByText('Radio Free Asia')).toBeTruthy();
    expect(screen.getByText('HKFP')).toBeTruthy();
  });

  // --- Feed Items ---

  it('renders feed articles when loaded', () => {
    mockHookReturn = {
      ...mockHookReturn,
      loading: false,
      feeds: [
        { id: '1', title: 'Hong Kong activist arrested', description: 'Breaking news', source: 'hkfp', pubDate: new Date().toISOString(), link: 'https://example.com/1', relevanceScore: 40 },
        { id: '2', title: 'Sanctions update from EU', description: 'New round', source: 'icij', pubDate: new Date().toISOString(), link: 'https://example.com/2', relevanceScore: 20 },
      ],
      lastUpdated: new Date(),
    };
    render(<IntelligenceFeeds />);
    expect(screen.getByText('Hong Kong activist arrested')).toBeTruthy();
    expect(screen.getByText('Sanctions update from EU')).toBeTruthy();
  });

  it('shows HIGH RELEVANCE badge for high-scoring items', () => {
    mockHookReturn = {
      ...mockHookReturn,
      loading: false,
      feeds: [
        { id: '1', title: 'Important article', description: 'Desc', source: 'hkfp', pubDate: new Date().toISOString(), link: 'https://example.com', relevanceScore: 40 },
      ],
      lastUpdated: new Date(),
    };
    render(<IntelligenceFeeds />);
    expect(screen.getByText('HIGH RELEVANCE')).toBeTruthy();
  });

  // --- Empty State ---

  it('shows empty state when no articles match', () => {
    mockHookReturn = {
      ...mockHookReturn,
      loading: false,
      feeds: [],
      lastUpdated: new Date(),
    };
    render(<IntelligenceFeeds />);
    expect(screen.getByText('No articles found matching your criteria')).toBeTruthy();
  });

  // --- Error State ---

  it('shows error message on fetch error', () => {
    mockHookReturn = {
      ...mockHookReturn,
      loading: false,
      error: 'Network failure',
    };
    render(<IntelligenceFeeds />);
    expect(screen.getByText('Error loading feeds')).toBeTruthy();
    expect(screen.getByText('Network failure')).toBeTruthy();
  });

  // --- Stats Footer ---

  it('shows stats footer with article counts', () => {
    mockHookReturn = {
      ...mockHookReturn,
      loading: false,
      feeds: [
        { id: '1', title: 'Article 1', description: 'Desc', source: 'hkfp', pubDate: new Date().toISOString(), link: 'https://example.com', relevanceScore: 10 },
      ],
      lastUpdated: new Date(),
    };
    render(<IntelligenceFeeds />);
    expect(screen.getByText(/Showing 1 of 1 articles from 3 verified sources/)).toBeTruthy();
  });

  // --- Search ---

  it('filters articles by search query', () => {
    mockHookReturn = {
      ...mockHookReturn,
      loading: false,
      feeds: [
        { id: '1', title: 'Hong Kong protest', description: 'Desc', source: 'hkfp', pubDate: new Date().toISOString(), link: '#', relevanceScore: 10 },
        { id: '2', title: 'EU sanctions round', description: 'Desc', source: 'icij', pubDate: new Date().toISOString(), link: '#', relevanceScore: 10 },
      ],
      lastUpdated: new Date(),
    };
    render(<IntelligenceFeeds />);
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'Hong Kong' } });
    expect(screen.getByText('Hong Kong protest')).toBeTruthy();
    expect(screen.queryByText('EU sanctions round')).toBeNull();
  });

  // --- Refresh ---

  it('calls refresh when Refresh button is clicked', () => {
    mockHookReturn = { ...mockHookReturn, loading: false, lastUpdated: new Date() };
    render(<IntelligenceFeeds />);
    fireEvent.click(screen.getByText('Refresh'));
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  // --- Stable Layout ---

  it('renders feed container with min-height for layout stability', () => {
    render(<IntelligenceFeeds />);
    const container = document.querySelector('.min-h-\\[400px\\]');
    expect(container).toBeTruthy();
  });
});
