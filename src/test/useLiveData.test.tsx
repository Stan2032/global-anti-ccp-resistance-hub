import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock the liveDataService module
vi.mock('../services/liveDataService', () => ({
  fetchAllFeeds: vi.fn(),
  fetchFeedsProgressively: vi.fn(),
  fetchPoliticalPrisoners: vi.fn(),
  fetchStatistics: vi.fn(),
  FEED_SOURCES: {
    hkfp: { name: 'Hong Kong Free Press', fullName: 'Hong Kong Free Press', url: 'https://hongkongfp.com/feed/', description: '', reliability: 'high' as const },
    rfa: { name: 'Radio Free Asia', fullName: 'Radio Free Asia', url: 'https://www.rfa.org/english/news/rss2.xml', description: '', reliability: 'high' as const },
  },
}));

import { useLiveFeeds, usePoliticalPrisoners, useStatistics } from '../hooks/useLiveData';
import { fetchFeedsProgressively, fetchPoliticalPrisoners, fetchStatistics } from '../services/liveDataService';

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
      vi.mocked(fetchFeedsProgressively).mockReturnValue(new Promise(() => {})); // never resolves
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
      vi.mocked(fetchFeedsProgressively).mockImplementation(async (onItems, onSourceDone) => {
        onItems(mockFeeds);
        if (onSourceDone) onSourceDone('hkfp');
      });

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

    it('accumulates feeds progressively from multiple sources', async () => {
      const hkfpItems = [{ title: 'HK article', source: 'hkfp' }];
      const rfaItems = [{ title: 'RFA article', source: 'rfa' }];
      vi.mocked(fetchFeedsProgressively).mockImplementation(async (onItems, onSourceDone) => {
        onItems(hkfpItems);
        if (onSourceDone) onSourceDone('hkfp');
        onItems(rfaItems);
        if (onSourceDone) onSourceDone('rfa');
      });

      const { result } = renderHook(() => useLiveFeeds(0));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      expect(result.current.feeds).toHaveLength(2);
      expect(result.current.feeds).toEqual([...hkfpItems, ...rfaItems]);
    });

    it('tracks loadedSources as each source completes', async () => {
      vi.mocked(fetchFeedsProgressively).mockImplementation(async (onItems, onSourceDone) => {
        onItems([{ title: 'Article', source: 'hkfp' }]);
        if (onSourceDone) onSourceDone('hkfp');
        if (onSourceDone) onSourceDone('rfa');
      });

      const { result } = renderHook(() => useLiveFeeds(0));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      expect(result.current.loadedSources).toBeInstanceOf(Set);
      expect(result.current.loadedSources.has('hkfp')).toBe(true);
      expect(result.current.loadedSources.has('rfa')).toBe(true);
    });

    it('resets loadedSources on refresh', async () => {
      vi.mocked(fetchFeedsProgressively).mockImplementation(async (onItems, onSourceDone) => {
        if (onSourceDone) onSourceDone('hkfp');
      });

      const { result } = renderHook(() => useLiveFeeds(0));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(result.current.loadedSources.has('hkfp')).toBe(true);

      vi.mocked(fetchFeedsProgressively).mockImplementation(async (onItems, onSourceDone) => {
        if (onSourceDone) onSourceDone('rfa');
      });
      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.loadedSources.has('hkfp')).toBe(false);
      expect(result.current.loadedSources.has('rfa')).toBe(true);
    });

    it('handles fetch errors', async () => {
      vi.mocked(fetchFeedsProgressively).mockRejectedValue(new Error('Network failure'));

      const { result } = renderHook(() => useLiveFeeds(0));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Network failure');
      expect(result.current.feeds).toEqual([]);
    });

    it('exposes FEED_SOURCES', () => {
      vi.mocked(fetchFeedsProgressively).mockReturnValue(new Promise(() => {}));
      const { result } = renderHook(() => useLiveFeeds(0));
      expect(Object.keys(result.current.sources)).toHaveLength(2);
      expect(result.current.sources['hkfp']).toBeDefined();
    });

    it('provides a refresh function', async () => {
      vi.mocked(fetchFeedsProgressively).mockImplementation(async (onItems, _onSourceDone) => {
        onItems([{ title: 'First fetch' }]);
      });
      const { result } = renderHook(() => useLiveFeeds(0));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(result.current.feeds).toEqual([{ title: 'First fetch' }]);

      vi.mocked(fetchFeedsProgressively).mockImplementation(async (onItems, _onSourceDone) => {
        onItems([{ title: 'Refreshed data' }]);
      });
      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.feeds).toEqual([{ title: 'Refreshed data' }]);
      expect(fetchFeedsProgressively).toHaveBeenCalledTimes(2);
    });

    it('sets up auto-refresh interval', async () => {
      vi.mocked(fetchFeedsProgressively).mockImplementation(async () => {});
      renderHook(() => useLiveFeeds(60000)); // 60s interval

      // Initial fetch
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(fetchFeedsProgressively).toHaveBeenCalledTimes(1);

      // Advance timer to trigger interval
      await act(async () => {
        await vi.advanceTimersByTimeAsync(60000);
      });
      expect(fetchFeedsProgressively).toHaveBeenCalledTimes(2);
    });

    it('cleans up interval on unmount', async () => {
      vi.mocked(fetchFeedsProgressively).mockImplementation(async () => {});
      const { unmount } = renderHook(() => useLiveFeeds(60000));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(fetchFeedsProgressively).toHaveBeenCalledTimes(1);

      unmount();

      // Advance timer — should NOT trigger another fetch
      await act(async () => {
        await vi.advanceTimersByTimeAsync(120000);
      });
      expect(fetchFeedsProgressively).toHaveBeenCalledTimes(1);
    });

    it('skips interval when refreshInterval is 0', async () => {
      vi.mocked(fetchFeedsProgressively).mockImplementation(async () => {});
      renderHook(() => useLiveFeeds(0));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(fetchFeedsProgressively).toHaveBeenCalledTimes(1);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(600000); // 10 minutes
      });
      // Still only the initial fetch
      expect(fetchFeedsProgressively).toHaveBeenCalledTimes(1);
    });
  });

  describe('usePoliticalPrisoners', () => {
    it('starts in loading state', () => {
      vi.mocked(fetchPoliticalPrisoners).mockReturnValue(new Promise(() => {}));
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
      vi.mocked(fetchPoliticalPrisoners).mockResolvedValue(mockPrisoners);

      const { result } = renderHook(() => usePoliticalPrisoners());
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.prisoners).toEqual(mockPrisoners);
      expect(result.current.error).toBeNull();
    });

    it('handles fetch errors', async () => {
      vi.mocked(fetchPoliticalPrisoners).mockRejectedValue(new Error('Failed to load'));

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
      vi.mocked(fetchStatistics).mockReturnValue(new Promise(() => {}));
      const { result } = renderHook(() => useStatistics());
      expect(result.current.loading).toBe(true);
      expect(result.current.stats).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('returns statistics on success', async () => {
      const mockStats = {
        totalPrisoners: 62,
        sanctionsEntries: 46,
        countriesTracked: 30,
      };
      vi.mocked(fetchStatistics).mockResolvedValue(mockStats);

      const { result } = renderHook(() => useStatistics());
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.stats).toEqual(mockStats);
      expect(result.current.error).toBeNull();
    });

    it('handles fetch errors', async () => {
      vi.mocked(fetchStatistics).mockRejectedValue(new Error('Service unavailable'));

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
