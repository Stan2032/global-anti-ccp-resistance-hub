// Live Data Sources Configuration
// Real-time intelligence feeds and monitoring systems
// Feed configuration data lives in live_data_feeds.json

import liveDataFeeds from './live_data_feeds.json';

const DEBUG = typeof import.meta !== 'undefined' && import.meta.env?.DEV;

export { liveDataFeeds };

export interface FeedItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  source: string;
  link: string;
  severity: string;
  verification: string;
}

export interface FeedItemWithRegion extends FeedItem {
  region: string;
}

export interface FeedData {
  news: FeedItemWithRegion[];
  threats: FeedItemWithRegion[];
  campaigns: FeedItemWithRegion[];
  lastUpdated: string;
  status: string;
  error?: string;
  feedsLoaded: {
    news: number;
    threats: number;
    total: number;
  };
}

export interface CategorizedData {
  critical: FeedItemWithRegion[];
  high: FeedItemWithRegion[];
  medium: FeedItemWithRegion[];
  low: FeedItemWithRegion[];
}

export interface FeedStats {
  activeMonitoring: number;
  documentsProcessed: number;
  threatsDetected: number;
  organizationsTracked: number;
  lastUpdate: string;
  dataSource: string;
  feedStatus?: string;
}

// NO SIMULATED DATA - All data comes from real RSS feeds
// If RSS feeds fail, we show empty state with clear error message

// RSS Feed Parser using RSS2JSON API (CORS-friendly)
const parseRSSFeed = async (feedUrl: string): Promise<FeedItem[]> => {
  try {
    // Use RSS2JSON API - properly supports CORS
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.warn(`Failed to fetch feed: ${feedUrl}`);
      return [];
    }
    
    const data = await response.json();
    
    if (data.status !== 'ok' || !data.items) {
      console.warn(`Invalid feed data: ${feedUrl}`);
      return [];
    }
    
    // Convert RSS2JSON format to our format
    const feedItems: FeedItem[] = data.items.slice(0, 5).map((item: Record<string, string>, index: number) => ({
      id: `rss_${Date.now()}_${index}`,
      title: item.title || '',
      description: (item.description || '').replace(/<[^>]*>/g, '').substring(0, 200) + '...',
      timestamp: item.pubDate || new Date().toISOString(),
      source: data.feed?.title || feedUrl,
      link: item.link || '',
      severity: 'medium',
      verification: 'verified'
    }));
    
    return feedItems;
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedUrl}:`, error);
    return [];
  }
};

// Cache for RSS feed data (5 minute cache)
const RSS_CACHE_KEY = 'rss_feed_cache';
const RSS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedFeeds = (): FeedData | null => {
  try {
    const cached = localStorage.getItem(RSS_CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached) as { data: FeedData; timestamp: number };
    const age = Date.now() - timestamp;
    
    if (age < RSS_CACHE_DURATION) {
      if (DEBUG) console.log(`Using cached RSS data (${Math.round(age / 1000)}s old)`);
      return data;
    }
    
    // Cache expired
    localStorage.removeItem(RSS_CACHE_KEY);
    return null;
  } catch (error) {
    console.error('Error reading RSS cache:', error);
    return null;
  }
};

const setCachedFeeds = (data: FeedData): void => {
  try {
    localStorage.setItem(RSS_CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error caching RSS data:', error);
  }
};

// Data aggregation and processing functions
export const dataProcessor = {
  // Aggregate data from multiple sources with caching and parallel fetching
  aggregateFeeds: async (): Promise<FeedData> => {
    try {
      // Check cache first
      const cached = getCachedFeeds();
      if (cached) {
        return cached;
      }
      
      if (DEBUG) console.log('Fetching fresh RSS data...');
      
      // Fetch ALL feeds in parallel (not sequential)
      const allFeedPromises: Promise<FeedItemWithRegion[]>[] = [
        ...liveDataFeeds.newsFeeds.map(feed => 
          parseRSSFeed(feed.url)
            .then(items => items.map(item => ({
              ...item,
              region: feed.region,
              source: feed.name
            })))
            .catch((err: unknown) => {
              console.warn(`Failed to fetch ${feed.name}:`, err);
              return [] as FeedItemWithRegion[];
            })
        ),
        ...liveDataFeeds.humanRightsFeeds.map(feed => 
          parseRSSFeed(feed.url)
            .then(items => items.map(item => ({
              ...item,
              region: feed.region,
              source: feed.name,
              severity: 'high'
            })))
            .catch((err: unknown) => {
              console.warn(`Failed to fetch ${feed.name}:`, err);
              return [] as FeedItemWithRegion[];
            })
        )
      ];
      
      // Wait for all feeds with 10 second timeout (reduced from 15)
      const timeout = new Promise<FeedItemWithRegion[][]>((resolve) => 
        setTimeout(() => {
          console.warn('RSS fetch timeout after 10s');
          resolve([]);
        }, 10000)
      );
      
      const results = await Promise.race([
        Promise.all(allFeedPromises),
        timeout
      ]);
      
      // Flatten and separate news vs human rights feeds
      const allItems: FeedItemWithRegion[] = Array.isArray(results) ? results.flat() : [];
      const newsData = allItems.filter(item => item.severity !== 'high');
      const threatData = allItems.filter(item => item.severity === 'high');
      
      if (DEBUG) console.log(`Loaded ${allItems.length} total items (${newsData.length} news, ${threatData.length} threats)`);
      
      const feedData: FeedData = {
        news: newsData,
        threats: threatData,
        campaigns: [],
        lastUpdated: new Date().toISOString(),
        status: (newsData.length === 0 && threatData.length === 0) ? 'feeds_unavailable' : 'operational',
        feedsLoaded: {
          news: newsData.length,
          threats: threatData.length,
          total: allItems.length
        }
      };
      
      // Cache the results
      setCachedFeeds(feedData);
      
      return feedData;
    } catch (error) {
      console.error('Error aggregating feeds:', error);
      // NO FALLBACK TO FAKE DATA - Return empty with error status
      return {
        news: [],
        threats: [],
        campaigns: [],
        lastUpdated: new Date().toISOString(),
        status: 'error',
        error: (error as Error).message || 'Failed to load RSS feeds',
        feedsLoaded: {
          news: 0,
          threats: 0,
          total: 0
        }
      };
    }
  },

  // Process and categorize incoming data
  categorizeData: (data: FeedItemWithRegion[]): CategorizedData => {
    const categories: CategorizedData = {
      critical: [],
      high: [],
      medium: [],
      low: []
    }

    data.forEach(item => {
      const key = item.severity as keyof CategorizedData;
      if (categories[key]) {
        categories[key].push(item)
      }
    })

    return categories
  },

  // Generate statistics from actual feed data
  generateStats: (feedData: FeedData | null): FeedStats => {
    if (!feedData) {
      return {
        activeMonitoring: 0,
        documentsProcessed: 0,
        threatsDetected: 0,
        organizationsTracked: 0,
        lastUpdate: new Date().toISOString(),
        dataSource: 'No data available'
      };
    }

    // Calculate actual statistics from real RSS feed data
    const allItems: FeedItemWithRegion[] = [
      ...(feedData.news || []),
      ...(feedData.threats || []),
      ...(feedData.campaigns || [])
    ];

    const threats = (feedData.threats || []).filter(
      t => t.severity === 'high' || t.severity === 'critical'
    );

    const sources = new Set(
      allItems.map(item => item.source).filter(Boolean)
    );

    return {
      activeMonitoring: allItems.length,
      documentsProcessed: (feedData.news || []).length,
      threatsDetected: threats.length,
      organizationsTracked: sources.size,
      lastUpdate: feedData.lastUpdated || new Date().toISOString(),
      dataSource: 'Real RSS Feeds',
      feedStatus: feedData.status || 'unknown'
    };
  }
}

export default {
  liveDataFeeds,
  dataProcessor
}
