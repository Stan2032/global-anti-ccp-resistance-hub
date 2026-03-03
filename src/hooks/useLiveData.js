import { useState, useEffect, useCallback } from 'react';
import { 
  fetchFeedsProgressively, 
  fetchPoliticalPrisoners, 
  fetchStatistics,
  FEED_SOURCES 
} from '../services/liveDataService';

/**
 * Hook for fetching live RSS feeds progressively (articles appear as each source loads)
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
 * Hook for fetching political prisoners data
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
 * Hook for fetching dashboard statistics
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
