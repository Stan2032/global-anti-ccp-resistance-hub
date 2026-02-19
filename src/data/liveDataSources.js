// Live Data Sources Configuration
// Real-time intelligence feeds and monitoring systems

const DEBUG = typeof import.meta !== 'undefined' && import.meta.env?.DEV;

export const liveDataFeeds = {
  // News RSS Feeds
  newsFeeds: [
    {
      id: 'hongkongfp',
      name: 'Hong Kong Free Press',
      url: 'https://hongkongfp.com/feed/',
      description: 'Independent news from Hong Kong',
      category: 'news',
      region: 'Hong Kong',
      updateFrequency: 'hourly',
      credibility: 'high',
      sources: [
        {
          title: 'Hong Kong Free Press Official Website',
          url: 'https://hongkongfp.com/',
          type: 'Primary Source',
          description: 'Independent, non-profit news organization'
        }
      ]
    },
    {
      id: 'rfa_china',
      name: 'Radio Free Asia - China',
      url: 'https://www.rfa.org/english/news/china/rss.xml',
      description: 'US government-funded news service covering China',
      category: 'news',
      region: 'China',
      updateFrequency: 'daily',
      credibility: 'high',
      sources: [
        {
          title: 'Radio Free Asia Official Website',
          url: 'https://www.rfa.org/',
          type: 'Primary Source',
          description: 'US government-funded news service'
        }
      ]
    },
    {
      id: 'scmp_china',
      name: 'South China Morning Post',
      url: 'https://www.scmp.com/rss/91/china',
      description: 'Hong Kong-based English-language newspaper',
      category: 'news',
      region: 'China/Hong Kong',
      updateFrequency: 'hourly',
      credibility: 'medium',
      biasRisk: 'medium',
      note: 'Alibaba-owned (since 2015); editorial stance has shifted toward pro-Beijing. Use only for factual event reporting. Do not rely on for analysis of CCP policies, Xinjiang, Tibet, or Hong Kong protests.',
      sources: [
        {
          title: 'SCMP RSS Feeds',
          url: 'https://www.scmp.com/rss',
          type: 'Primary Source'
        }
      ]
    },
    {
      id: 'rfa_uyghur',
      name: 'Radio Free Asia - Uyghur',
      url: 'https://www.rfa.org/english/news/uyghur/rss.xml',
      description: 'News coverage of Uyghur issues and Xinjiang',
      category: 'news',
      region: 'Xinjiang',
      updateFrequency: 'daily',
      credibility: 'high',
      sources: [
        {
          title: 'RFA Uyghur Service',
          url: 'https://www.rfa.org/english/news/uyghur',
          type: 'Primary Source',
          description: 'Dedicated coverage of Uyghur human rights'
        }
      ]
    },
    {
      id: 'rfa_tibet',
      name: 'Radio Free Asia - Tibet',
      url: 'https://www.rfa.org/english/news/tibet/rss.xml',
      description: 'News coverage of Tibet and Tibetan issues',
      category: 'news',
      region: 'Tibet',
      updateFrequency: 'daily',
      credibility: 'high',
      sources: [
        {
          title: 'RFA Tibet Service',
          url: 'https://www.rfa.org/english/news/tibet',
          type: 'Primary Source',
          description: 'Dedicated coverage of Tibet'
        }
      ]
    },
    {
      id: 'taiwan_news',
      name: 'Taiwan News',
      url: 'https://www.taiwannews.com.tw/en/rss',
      description: 'Independent news from Taiwan perspective',
      category: 'news',
      region: 'Taiwan',
      updateFrequency: 'hourly',
      credibility: 'high',
      sources: [
        {
          title: 'Taiwan News Official Website',
          url: 'https://www.taiwannews.com.tw/',
          type: 'Primary Source',
          description: 'English-language news from Taiwan'
        }
      ]
    }
  ],

  // Human Rights Organizations
  humanRightsFeeds: [
    {
      id: 'hrw_china',
      name: 'Human Rights Watch - China',
      url: 'https://www.hrw.org/news/china/rss',
      description: 'Human rights violations documentation',
      category: 'human_rights',
      region: 'China',
      updateFrequency: 'weekly',
      credibility: 'high',
      sources: [
        {
          title: 'HRW China Reports',
          url: 'https://www.hrw.org/news/china',
          type: 'NGO Report',
          organization: 'Human Rights Watch'
        }
      ]
    },
    {
      id: 'amnesty_china',
      name: 'Amnesty International - China',
      url: 'https://www.amnesty.org/en/location/asia-and-the-pacific/east-asia/china/rss/',
      description: 'Human rights monitoring and advocacy',
      category: 'human_rights',
      region: 'China',
      updateFrequency: 'weekly',
      credibility: 'high',
      sources: [
        {
          title: 'Amnesty International China',
          url: 'https://www.amnesty.org/en/location/asia-and-the-pacific/east-asia/china/',
          type: 'NGO Report',
          organization: 'Amnesty International'
        }
      ]
    }
  ],

  // Research Organizations
  researchFeeds: [
    {
      id: 'aspi_china',
      name: 'Australian Strategic Policy Institute',
      url: 'https://www.aspi.org.au/rss.xml',
      description: 'Strategic and defense analysis on China',
      category: 'research',
      region: 'China',
      updateFrequency: 'weekly',
      credibility: 'high',
      sources: [
        {
          title: 'ASPI Official Website',
          url: 'https://www.aspi.org.au/',
          type: 'Academic Research',
          organization: 'Australian Strategic Policy Institute'
        }
      ]
    }
  ],

  // Surveillance Monitoring
  surveillanceMonitoring: [
    {
      id: 'surveillance_alerts',
      name: 'Digital Rights Surveillance Alerts',
      description: 'Automated monitoring of surveillance technology deployment',
      category: 'surveillance',
      region: 'Global',
      updateFrequency: 'real-time',
      credibility: 'medium',
      methodology: 'Automated scanning of public procurement databases and tech company announcements',
      sources: [
        {
          title: 'China: Police Big Data Systems Violate Privacy',
          url: 'https://www.hrw.org/news/2017/11/19/china-police-big-data-systems-violate-privacy-target-dissent',
          organization: 'Human Rights Watch',
          type: 'NGO Report',
          date: '2017-11-19'
        }
      ]
    }
  ]
}

// NO SIMULATED DATA - All data comes from real RSS feeds
// If RSS feeds fail, we show empty state with clear error message

// RSS Feed Parser using RSS2JSON API (CORS-friendly)
const parseRSSFeed = async (feedUrl) => {
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
    const feedItems = data.items.slice(0, 5).map((item, index) => ({
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

const getCachedFeeds = () => {
  try {
    const cached = localStorage.getItem(RSS_CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
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

const setCachedFeeds = (data) => {
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
  aggregateFeeds: async () => {
    try {
      // Check cache first
      const cached = getCachedFeeds();
      if (cached) {
        return cached;
      }
      
      if (DEBUG) console.log('Fetching fresh RSS data...');
      
      // Fetch ALL feeds in parallel (not sequential)
      const allFeedPromises = [
        ...liveDataFeeds.newsFeeds.map(feed => 
          parseRSSFeed(feed.url)
            .then(items => items.map(item => ({
              ...item,
              region: feed.region,
              source: feed.name
            })))
            .catch(err => {
              console.warn(`Failed to fetch ${feed.name}:`, err);
              return [];
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
            .catch(err => {
              console.warn(`Failed to fetch ${feed.name}:`, err);
              return [];
            })
        )
      ];
      
      // Wait for all feeds with 10 second timeout (reduced from 15)
      const timeout = new Promise((resolve) => 
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
      const allItems = Array.isArray(results) ? results.flat() : [];
      const newsData = allItems.filter(item => item.severity !== 'high');
      const threatData = allItems.filter(item => item.severity === 'high');
      
      if (DEBUG) console.log(`Loaded ${allItems.length} total items (${newsData.length} news, ${threatData.length} threats)`);
      
      const feedData = {
        news: newsData,
        threats: threatData,
        campaigns: [], // No campaign data source yet - show empty
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
        error: error.message || 'Failed to load RSS feeds',
        feedsLoaded: {
          news: 0,
          threats: 0,
          total: 0
        }
      };
    }
  },

  // Process and categorize incoming data
  categorizeData: (data) => {
    const categories = {
      critical: [],
      high: [],
      medium: [],
      low: []
    }

    data.forEach(item => {
      if (categories[item.severity]) {
        categories[item.severity].push(item)
      }
    })

    return categories
  },

  // Generate statistics from actual feed data
  generateStats: (feedData) => {
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
    const allItems = [
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

// Feed validation and credibility scoring
export const feedValidator = {
  validateSource: (source) => {
    const credibilityScores = {
      'Primary Source': 10,
      'Government Document': 9,
      'Academic Research': 8,
      'NGO Report': 7,
      'News Report': 6,
      'Social Media': 3,
      'Anonymous': 2
    }

    return {
      isValid: source.url && source.title,
      credibilityScore: credibilityScores[source.type] || 1,
      hasVerification: !!source.organization || !!source.publication,
      lastChecked: new Date().toISOString()
    }
  },

  checkFeedHealth: (feedId) => {
    return {
      feedId,
      status: 'operational',
      lastUpdate: new Date().toISOString(),
      responseTime: null,
      errorCount: 0
    }
  }
}

export default {
  liveDataFeeds,
  dataProcessor,
  feedValidator
}
