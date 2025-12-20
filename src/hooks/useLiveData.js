import { useState, useEffect, useCallback } from 'react';
import { 
  fetchAllFeeds, 
  fetchPoliticalPrisoners, 
  fetchRegionalThreats,
  fetchStatistics,
  FEED_SOURCES 
} from '../services/liveDataService';

/**
 * Hook for fetching live RSS feeds
 */
export function useLiveFeeds(refreshInterval = 300000) { // 5 minutes default
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllFeeds();
      setFeeds(data);
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

  return { feeds, loading, error, lastUpdated, refresh, sources: FEED_SOURCES };
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
 * Hook for fetching regional threats data
 */
export function useRegionalThreats() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchRegionalThreats();
        setThreats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { threats, loading, error };
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
  useRegionalThreats,
  useStatistics,
};
