import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock the data source to avoid real HTTP calls
vi.mock('../data/liveDataSources', () => ({
  dataProcessor: {
    aggregateFeeds: vi.fn(),
  },
}));

import NewsAggregator from '../components/NewsAggregator';
import { dataProcessor } from '../data/liveDataSources';

describe('NewsAggregator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton initially', () => {
    // Make aggregateFeeds hang so we see loading state
    dataProcessor.aggregateFeeds.mockReturnValue(new Promise(() => {}));
    const { container } = render(<NewsAggregator />);
    expect(container.querySelector('.animate-pulse')).toBeTruthy();
  });

  it('renders header after data loads', async () => {
    dataProcessor.aggregateFeeds.mockResolvedValue({ news: [], threats: [] });
    render(<NewsAggregator />);
    const header = await screen.findByText('Latest Intelligence');
    expect(header).toBeTruthy();
  });

  it('renders category filter buttons', async () => {
    dataProcessor.aggregateFeeds.mockResolvedValue({ news: [], threats: [] });
    render(<NewsAggregator />);
    await screen.findByText('Latest Intelligence');
    expect(screen.getByText('All News')).toBeTruthy();
    expect(screen.getByText('Hong Kong')).toBeTruthy();
    expect(screen.getByText('Uyghur')).toBeTruthy();
    expect(screen.getByText('Tibet')).toBeTruthy();
    expect(screen.getByText('Taiwan')).toBeTruthy();
    expect(screen.getByText('Transnational')).toBeTruthy();
  });

  it('renders news items from RSS feed', async () => {
    dataProcessor.aggregateFeeds.mockResolvedValue({
      news: [
        {
          title: 'Test Hong Kong News',
          source: 'HKFP',
          date: '2026-03-01',
          category: 'hongkong',
          priority: 'HIGH',
          url: 'https://example.com/hk',
        },
        {
          title: 'Test Uyghur News',
          source: 'RFA',
          date: '2026-02-28',
          category: 'uyghur',
          priority: 'CRITICAL',
          url: 'https://example.com/uyghur',
        },
      ],
      threats: [],
    });

    render(<NewsAggregator />);
    expect(await screen.findByText('Test Hong Kong News')).toBeTruthy();
    expect(screen.getByText('Test Uyghur News')).toBeTruthy();
  });

  it('renders View all intelligence link after data loads', async () => {
    dataProcessor.aggregateFeeds.mockResolvedValue({ news: [], threats: [] });
    render(<NewsAggregator />);
    const link = await screen.findByText('View all intelligence →');
    expect(link.closest('a').getAttribute('href')).toBe('/intelligence');
  });

  it('handles fetch errors gracefully without crashing', async () => {
    // Suppress expected console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    dataProcessor.aggregateFeeds.mockRejectedValue(new Error('Network error'));
    render(<NewsAggregator />);
    // Should show the header (empty news state, not a crash)
    const header = await screen.findByText('Latest Intelligence');
    expect(header).toBeTruthy();
    consoleSpy.mockRestore();
  });

  it('combines news and threats from aggregateFeeds', async () => {
    dataProcessor.aggregateFeeds.mockResolvedValue({
      news: [
        { title: 'News Item', source: 'ABC', date: '2026-03-01', category: 'hongkong', url: '#' },
      ],
      threats: [
        { title: 'Threat Item', source: 'DEF', date: '2026-03-01', category: 'transnational', url: '#' },
      ],
    });

    render(<NewsAggregator />);
    expect(await screen.findByText('News Item')).toBeTruthy();
    expect(screen.getByText('Threat Item')).toBeTruthy();
  });

  it('shows Live Updates indicator', async () => {
    dataProcessor.aggregateFeeds.mockResolvedValue({ news: [], threats: [] });
    render(<NewsAggregator />);
    await screen.findByText('Latest Intelligence');
    expect(screen.getByText('Live Updates')).toBeTruthy();
  });
});
