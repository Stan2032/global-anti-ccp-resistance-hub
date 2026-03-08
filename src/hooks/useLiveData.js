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

/**
 * @typedef {import('../services/liveDataService').FeedItem} FeedItem
 * @typedef {import('../services/liveDataService').FeedSourceMeta} FeedSourceMeta
 * @typedef {import('../services/liveDataService').PlatformStatistics} PlatformStatistics
 */

/**
 * @typedef {Object} LiveFeedsResult
 * @property {FeedItem[]} feeds - Currently loaded feed items
 * @property {boolean} loading - Whether feeds are still loading
 * @property {string|null} error - Error message if fetch failed
 * @property {Date|null} lastUpdated - Timestamp of last successful refresh
 * @property {() => Promise<void>} refresh - Manually trigger a refresh
 * @property {Object<string, FeedSourceMeta>} sources - Feed source metadata
 * @property {Set<string>} loadedSources - Set of source keys that have finished loading
 */

/**
 * Hook for fetching live RSS feeds progressively (articles appear as each source loads).
 *
 * @param {number} [refreshInterval=300000] - Auto-refresh interval in ms (default 5 min, 0 to disable)
 * @returns {LiveFeedsResult} Feed data, loading state, and refresh controls
 */
export function useLiveFeeds(refreshInterval = 300000) { // 5 minutes default
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loadedSources, setLoadedSources] = useState(new Set());

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setFeeds([]);
      setLoadedSources(new Set());
      await fetchFeedsProgressively(
        (newItems) => {
          setFeeds(prev => [...prev, ...newItems]);
        },
        (sourceName) => {
          setLoadedSources(prev => new Set([...prev, sourceName]));
        }
      );
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
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

/**
 * @typedef {Object} PoliticalPrisonerEntry
 * @property {number} id - Sequential record identifier
 * @property {string} name - Prisoner's name
 * @property {string} status - Current status (e.g., "imprisoned", "released")
 * @property {string} sentence - Sentence details
 * @property {string} location - Detention location
 * @property {string} description - Latest news or case summary
 * @property {string} source - Source URL
 * @property {string} confidence - Data confidence level
 * @property {string} lastUpdated - Last verification date
 */

/**
 * @typedef {Object} PoliticalPrisonersResult
 * @property {PoliticalPrisonerEntry[]} prisoners - Array of political prisoner records
 * @property {boolean} loading - Whether data is still loading
 * @property {string|null} error - Error message if fetch failed
 */

/**
 * Hook for fetching political prisoners data from the verified JSON dataset.
 *
 * @returns {PoliticalPrisonersResult} Prisoner data and loading state
 */
export function usePoliticalPrisoners() {
  const [prisoners, setPrisoners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchPoliticalPrisoners();
        setPrisoners(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { prisoners, loading, error };
}

/**
 * @typedef {Object} StatisticsResult
 * @property {PlatformStatistics|null} stats - Statistics data or null while loading
 * @property {boolean} loading - Whether data is still loading
 * @property {string|null} error - Error message if fetch failed
 */

/**
 * Hook for fetching dashboard statistics from the verified JSON dataset.
 *
 * @returns {StatisticsResult} Statistics data and loading state
 */
export function useStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchStatistics();
        setStats(data);
      } catch (err) {
        setError(err.message);
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
