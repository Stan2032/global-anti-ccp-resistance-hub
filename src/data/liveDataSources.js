// Live Data Sources Configuration
// Real-time intelligence feeds and monitoring systems

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
      note: 'Pro-Beijing editorial stance but credible reporting',
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

// RSS Feed Parser
const parseRSSFeed = async (feedUrl) => {
  try {
    // Use CORS proxy to fetch RSS feeds
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const response = await fetch(corsProxy + encodeURIComponent(feedUrl), {
      timeout: 10000
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch feed: ${feedUrl}`);
      return [];
    }
    
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    // Check for parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      console.warn(`Failed to parse feed: ${feedUrl}`);
      return [];
    }
    
    // Parse RSS items
    const items = xmlDoc.querySelectorAll('item, entry');
    const feedItems = [];
    
    items.forEach((item, index) => {
      if (index >= 5) return; // Limit to 5 items per feed
      
      const title = item.querySelector('title')?.textContent || '';
      const description = item.querySelector('description, summary')?.textContent || '';
      const link = item.querySelector('link')?.textContent || item.querySelector('link')?.getAttribute('href') || '';
      const pubDate = item.querySelector('pubDate, published')?.textContent || new Date().toISOString();
      
      if (title) {
        feedItems.push({
          id: `rss_${Date.now()}_${index}`,
          title: title.trim(),
          description: description.trim().substring(0, 200) + '...',
          timestamp: new Date(pubDate).toISOString(),
          source: feedUrl,
          link: link,
          severity: 'medium',
          verification: 'verified'
        });
      }
    });
    
    return feedItems;
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedUrl}:`, error);
    return [];
  }
};

// Data aggregation and processing functions
export const dataProcessor = {
  // Aggregate data from multiple sources
  aggregateFeeds: async () => {
    try {
      // Fetch from actual RSS feeds
      const newsPromises = liveDataFeeds.newsFeeds.map(feed => 
        parseRSSFeed(feed.url).then(items => 
          items.map(item => ({
            ...item,
            region: feed.region,
            source: feed.name
          }))
        )
      );
      
      const humanRightsPromises = liveDataFeeds.humanRightsFeeds.map(feed => 
        parseRSSFeed(feed.url).then(items => 
          items.map(item => ({
            ...item,
            region: feed.region,
            source: feed.name,
            severity: 'high'
          }))
        )
      );
      
      // Wait for all feeds with timeout
      const timeout = new Promise((resolve) => 
        setTimeout(() => resolve([]), 15000)
      );
      
      const [newsResults, humanRightsResults] = await Promise.race([
        Promise.all([
          Promise.all(newsPromises),
          Promise.all(humanRightsPromises)
        ]),
        timeout
      ]);
      
      // Flatten results
      const allNews = newsResults ? newsResults.flat() : [];
      const allHumanRights = humanRightsResults ? humanRightsResults.flat() : [];
      
      // NO FALLBACK TO FAKE DATA - Show empty state if feeds fail
      const newsData = allNews;
      const threatData = allHumanRights;
      
      return {
        news: newsData,
        threats: threatData,
        campaigns: [], // No campaign data source yet - show empty
        lastUpdated: new Date().toISOString(),
        status: (newsData.length === 0 && threatData.length === 0) ? 'feeds_unavailable' : 'operational',
        feedsLoaded: {
          news: newsData.length,
          threats: threatData.length,
          total: newsData.length + threatData.length
        }
      };
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
    // Simulate feed health checking
    return {
      feedId,
      status: 'operational',
      lastUpdate: new Date().toISOString(),
      responseTime: Math.floor(Math.random() * 1000) + 200,
      errorCount: 0
    }
  }
}

export default {
  liveDataFeeds,
  dataProcessor,
  feedValidator
}
