import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock the liveDataService module
vi.mock('../services/liveDataService', () => ({
  fetchAllFeeds: vi.fn(),
  fetchPoliticalPrisoners: vi.fn(),
  fetchStatistics: vi.fn(),
  FEED_SOURCES: [
    { id: 'hkfp', name: 'Hong Kong Free Press', url: 'https://hongkongfp.com/feed/' },
    { id: 'rfa', name: 'Radio Free Asia', url: 'https://www.rfa.org/english/news/rss2.xml' },
  ],
}));

import { useLiveFeeds, usePoliticalPrisoners, useStatistics } from '../hooks/useLiveData';
import { fetchAllFeeds, fetchPoliticalPrisoners, fetchStatistics } from '../services/liveDataService';

describe('useLiveData hooks', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('useLiveFeeds', () => {
    it('starts in loading state', () => {
      fetchAllFeeds.mockReturnValue(new Promise(() => {})); // never resolves
      const { result } = renderHook(() => useLiveFeeds());
      expect(result.current.loading).toBe(true);
      expect(result.current.feeds).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('returns feed data on success', async () => {
      const mockFeeds = [
        { title: 'Hong Kong activist arrested', source: 'HKFP' },
        { title: 'Sanctions update', source: 'RFA' },
      ];
      fetchAllFeeds.mockResolvedValue(mockFeeds);

      const { result } = renderHook(() => useLiveFeeds(0)); // no refresh interval
      // Flush microtasks to let the async effect resolve
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.feeds).toEqual(mockFeeds);
      expect(result.current.error).toBeNull();
      expect(result.current.lastUpdated).toBeInstanceOf(Date);
    });

    it('handles fetch errors', async () => {
      fetchAllFeeds.mockRejectedValue(new Error('Network failure'));

      const { result } = renderHook(() => useLiveFeeds(0));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Network failure');
      expect(result.current.feeds).toEqual([]);
    });

    it('exposes FEED_SOURCES', () => {
      fetchAllFeeds.mockReturnValue(new Promise(() => {}));
      const { result } = renderHook(() => useLiveFeeds(0));
      expect(result.current.sources).toHaveLength(2);
      expect(result.current.sources[0].id).toBe('hkfp');
    });

    it('provides a refresh function', async () => {
      fetchAllFeeds.mockResolvedValue([{ title: 'First fetch' }]);
      const { result } = renderHook(() => useLiveFeeds(0));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(result.current.feeds).toEqual([{ title: 'First fetch' }]);

      fetchAllFeeds.mockResolvedValue([{ title: 'Refreshed data' }]);
      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.feeds).toEqual([{ title: 'Refreshed data' }]);
      expect(fetchAllFeeds).toHaveBeenCalledTimes(2);
    });

    it('sets up auto-refresh interval', async () => {
      fetchAllFeeds.mockResolvedValue([]);
      renderHook(() => useLiveFeeds(60000)); // 60s interval

      // Initial fetch
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(fetchAllFeeds).toHaveBeenCalledTimes(1);

      // Advance timer to trigger interval
      await act(async () => {
        await vi.advanceTimersByTimeAsync(60000);
      });
      expect(fetchAllFeeds).toHaveBeenCalledTimes(2);
    });

    it('cleans up interval on unmount', async () => {
      fetchAllFeeds.mockResolvedValue([]);
      const { unmount } = renderHook(() => useLiveFeeds(60000));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(fetchAllFeeds).toHaveBeenCalledTimes(1);

      unmount();

      // Advance timer — should NOT trigger another fetch
      await act(async () => {
        await vi.advanceTimersByTimeAsync(120000);
      });
      expect(fetchAllFeeds).toHaveBeenCalledTimes(1);
    });

    it('skips interval when refreshInterval is 0', async () => {
      fetchAllFeeds.mockResolvedValue([]);
      renderHook(() => useLiveFeeds(0));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(fetchAllFeeds).toHaveBeenCalledTimes(1);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(600000); // 10 minutes
      });
      // Still only the initial fetch
      expect(fetchAllFeeds).toHaveBeenCalledTimes(1);
    });
  });

  describe('usePoliticalPrisoners', () => {
    it('starts in loading state', () => {
      fetchPoliticalPrisoners.mockReturnValue(new Promise(() => {}));
      const { result } = renderHook(() => usePoliticalPrisoners());
      expect(result.current.loading).toBe(true);
      expect(result.current.prisoners).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('returns prisoner data on success', async () => {
      const mockPrisoners = [
        { name: 'Jimmy Lai', status: 'imprisoned' },
        { name: 'Zhang Zhan', status: 'imprisoned' },
      ];
      fetchPoliticalPrisoners.mockResolvedValue(mockPrisoners);

      const { result } = renderHook(() => usePoliticalPrisoners());
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.prisoners).toEqual(mockPrisoners);
      expect(result.current.error).toBeNull();
    });

    it('handles fetch errors', async () => {
      fetchPoliticalPrisoners.mockRejectedValue(new Error('Failed to load'));

      const { result } = renderHook(() => usePoliticalPrisoners());
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Failed to load');
      expect(result.current.prisoners).toEqual([]);
    });
  });

  describe('useStatistics', () => {
    it('starts in loading state with null stats', () => {
      fetchStatistics.mockReturnValue(new Promise(() => {}));
      const { result } = renderHook(() => useStatistics());
      expect(result.current.loading).toBe(true);
      expect(result.current.stats).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('returns statistics on success', async () => {
      const mockStats = {
        totalPrisoners: 62,
        sanctionsEntries: 47,
        countriesTracked: 30,
      };
      fetchStatistics.mockResolvedValue(mockStats);

      const { result } = renderHook(() => useStatistics());
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.stats).toEqual(mockStats);
      expect(result.current.error).toBeNull();
    });

    it('handles fetch errors', async () => {
      fetchStatistics.mockRejectedValue(new Error('Service unavailable'));

      const { result } = renderHook(() => useStatistics());
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Service unavailable');
      expect(result.current.stats).toBeNull();
    });
  });
});
