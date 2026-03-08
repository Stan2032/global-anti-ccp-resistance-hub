/**
 * useLiveData — Hooks for fetching live data from RSS feeds and JSON datasets.
 *
 * Provides three hooks:
 * - useLiveFeeds — progressive RSS feed loading with auto-refresh
 * - usePoliticalPrisoners — political prisoner database
 * - useStatistics — dashboard statistics
 *
 * @module useLiveData
 */
import { useState, useEffect, useCallback } from 'react';
import {
  fetchFeedsProgressively,
  fetchPoliticalPrisoners,
  fetchStatistics,
  FEED_SOURCES
} from '../services/liveDataService';

// Re-declare types locally since liveDataService is still JS

/** A single RSS feed item. */
export interface FeedItem {
  id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  relevanceScore: number;
}

/** Metadata describing an RSS feed source. */
export interface FeedSourceMeta {
  name: string;
  fullName: string;
  url: string;
  description: string;
  reliability: 'high' | 'medium' | 'low';
}

/** Platform-wide statistics shown on the dashboard. */
export interface PlatformStatistics {
  verifiedOrganizations: number;
  detentionFacilities: number;
  activeCampaigns: number | null;
  politicalPrisoners: number;
  lastUpdated: string;
  dataNote: string;
  sources: Record<string, string>;
}

/** State returned by the useLiveFeeds hook. */
export interface LiveFeedsResult {
  feeds: FeedItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  sources: Record<string, FeedSourceMeta>;
  loadedSources: Set<string>;
}

/**
 * Hook for fetching live RSS feeds progressively (articles appear as each source loads).
 */
export function useLiveFeeds(refreshInterval: number = 300000): LiveFeedsResult { // 5 minutes default
  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loadedSources, setLoadedSources] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setFeeds([]);
      setLoadedSources(new Set());
      await fetchFeedsProgressively(
        (newItems: FeedItem[]) => {
          setFeeds(prev => [...prev, ...newItems]);
        },
        (sourceName: string) => {
          setLoadedSources(prev => new Set([...prev, sourceName]));
        }
      );
      setLastUpdated(new Date());
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    if (refreshInterval > 0) {
      const interval = setInterval(refresh, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refresh, refreshInterval]);

  return { feeds, loading, error, lastUpdated, refresh, sources: FEED_SOURCES, loadedSources };
}

/** A single political prisoner record from the verified dataset. */
export interface PoliticalPrisonerEntry {
  id: number;
  name: string;
  status: string;
  sentence: string;
  location: string;
  description: string;
  source: string;
  confidence: string;
  lastUpdated: string;
}

/** State returned by the usePoliticalPrisoners hook. */
export interface PoliticalPrisonersResult {
  prisoners: PoliticalPrisonerEntry[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook for fetching political prisoners data from the verified JSON dataset.
 */
export function usePoliticalPrisoners(): PoliticalPrisonersResult {
  const [prisoners, setPrisoners] = useState<PoliticalPrisonerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchPoliticalPrisoners();
        setPrisoners(data);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { prisoners, loading, error };
}

/** State returned by the useStatistics hook. */
export interface StatisticsResult {
  stats: PlatformStatistics | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for fetching dashboard statistics from the verified JSON dataset.
 */
export function useStatistics(): StatisticsResult {
  const [stats, setStats] = useState<PlatformStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchStatistics();
        setStats(data);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { stats, loading, error };
}

export default {
  useLiveFeeds,
  usePoliticalPrisoners,
  useStatistics,
};
