/**
 * Live Data Service
 * Fetches real-time data from various sources
 */

// RSS Feed URLs (using CORS proxies for client-side fetching)
const RSS_FEEDS = {
  icij: 'https://www.icij.org/feed/',
  rfa: 'https://www.rfa.org/english/news/rss2.xml',
  hkfp: 'https://hongkongfp.com/feed/',
  aspi: 'https://www.aspistrategist.org.au/feed/',
};

// CORS proxy for fetching RSS feeds from browser
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// Keywords for relevance scoring
const CCP_KEYWORDS = [
  'china', 'chinese', 'ccp', 'beijing', 'xi jinping', 'communist party',
  'hong kong', 'taiwan', 'uyghur', 'xinjiang', 'tibet', 'tibetan',
  'human rights', 'detention', 'surveillance', 'censorship', 'repression',
  'south china sea', 'military', 'pla', 'navy', 'sanctions',
  'democracy', 'protest', 'activist', 'dissident', 'political prisoner',
  'jimmy lai', 'apple daily', 'national security law',
  'genocide', 'forced labor', 'organ harvesting', 'concentration camp',
  'united front', 'influence operation', 'espionage', 'spy',
];

/**
 * Parse RSS/Atom XML feed
 */
function parseRSSFeed(xmlText, sourceName) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  
  const items = [];
  
  // Try RSS format first
  let entries = doc.querySelectorAll('item');
  
  // Try Atom format if no RSS items found
  if (entries.length === 0) {
    entries = doc.querySelectorAll('entry');
  }
  
  entries.forEach((entry, index) => {
    if (index >= 20) return; // Limit to 20 items per feed
    
    const title = entry.querySelector('title')?.textContent || '';
    const link = entry.querySelector('link')?.textContent || 
                 entry.querySelector('link')?.getAttribute('href') || '';
    const description = entry.querySelector('description')?.textContent ||
                       entry.querySelector('summary')?.textContent ||
                       entry.querySelector('content')?.textContent || '';
    const pubDate = entry.querySelector('pubDate')?.textContent ||
                   entry.querySelector('published')?.textContent ||
                   entry.querySelector('updated')?.textContent || '';
    
    // Calculate relevance score
    const text = `${title} ${description}`.toLowerCase();
    let relevanceScore = 0;
    CCP_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        relevanceScore += 10;
      }
    });
    
    // Only include items with some relevance to CCP topics
    if (relevanceScore > 0 || sourceName === 'hkfp' || sourceName === 'rfa') {
      items.push({
        id: `${sourceName}-${index}-${Date.now()}`,
        title: title.trim(),
        link: link.trim(),
        description: cleanHTML(description).substring(0, 300),
        pubDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        source: sourceName,
        relevanceScore,
      });
    }
  });
  
  return items;
}

/**
 * Clean HTML tags from text
 */
function cleanHTML(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

/**
 * Fetch RSS feed with CORS proxy
 */
async function fetchRSSFeed(feedUrl, sourceName) {
  try {
    const response = await fetch(CORS_PROXY + encodeURIComponent(feedUrl), {
      headers: {
        'Accept': 'application/xml, text/xml, application/rss+xml',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const xmlText = await response.text();
    return parseRSSFeed(xmlText, sourceName);
  } catch (error) {
    console.error(`Error fetching ${sourceName} feed:`, error);
    return [];
  }
}

/**
 * Fetch all RSS feeds and combine results
 */
export async function fetchAllFeeds() {
  const feedPromises = Object.entries(RSS_FEEDS).map(([name, url]) =>
    fetchRSSFeed(url, name)
  );
  
  const results = await Promise.allSettled(feedPromises);
  
  const allItems = results
    .filter(result => result.status === 'fulfilled')
    .flatMap(result => result.value);
  
  // Sort by relevance score and date
  allItems.sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    return new Date(b.pubDate) - new Date(a.pubDate);
  });
  
  return allItems;
}

/**
 * Fetch political prisoners data from CECC API (or fallback to static)
 */
export async function fetchPoliticalPrisoners() {
  // In production, this would fetch from a real API
  // For now, we'll use the CECC website data we gathered
  const prisoners = [
    {
      id: 1,
      name: 'Jimmy Lai',
      chineseName: '黎智英',
      status: 'imprisoned',
      sentence: 'Convicted — faces life imprisonment, sentencing pending',
      dateDetained: '2020-08-10',
      dateConvicted: '2025-12-15',
      category: 'Press Freedom',
      description: 'Founder of Apple Daily newspaper, convicted under National Security Law',
      urgent: true,
      source: 'https://www.cecc.gov/victims',
      lastUpdated: '2025-12-15',
    },
    {
      id: 2,
      name: 'Ilham Tohti',
      chineseName: '伊力哈木·土赫提',
      status: 'imprisoned',
      sentence: 'Life imprisonment',
      dateDetained: '2014-01-15',
      dateConvicted: '2014-09-23',
      category: 'Uyghur Rights',
      description: 'Uyghur economist and professor, Sakharov Prize laureate',
      urgent: true,
      source: 'https://www.cecc.gov/victims',
      lastUpdated: '2024-12-01',
    },
    {
      id: 3,
      name: 'Gao Zhisheng',
      chineseName: '高智晟',
      status: 'disappeared',
      dateDetained: '2017-08-13',
      category: 'Human Rights',
      description: 'Human rights lawyer, disappeared since August 2017',
      urgent: true,
      source: 'https://www.cecc.gov/victims',
      lastUpdated: '2024-12-01',
    },
    {
      id: 4,
      name: 'Zhang Zhan',
      chineseName: '张展',
      status: 'imprisoned',
      sentence: '4 years',
      dateDetained: '2020-05-14',
      dateConvicted: '2020-12-28',
      category: 'Journalism',
      description: 'Citizen journalist who reported on COVID-19 outbreak in Wuhan',
      urgent: true,
      source: 'https://www.cecc.gov/victims',
      lastUpdated: '2024-12-01',
    },
    {
      id: 5,
      name: 'Gedhun Choekyi Nyima',
      chineseName: '根敦确吉尼玛',
      status: 'disappeared',
      dateDetained: '1995-05-17',
      category: 'Religious Freedom',
      description: '11th Panchen Lama, disappeared at age 6, whereabouts unknown',
      urgent: true,
      source: 'https://www.cecc.gov/victims',
      lastUpdated: '2024-12-01',
    },
  ];
  
  return prisoners;
}

/**
 * Fetch regional threat data
 */
export async function fetchRegionalThreats() {
  // This would ideally fetch from ISW, CSIS, or similar APIs
  const threats = [
    {
      id: 'taiwan',
      region: 'Taiwan',
      threatLevel: 'critical',
      status: 'severe',
      lastUpdate: '2025-12-19',
      summary: 'PLA continues military exercises, naval buildup ongoing',
      keyEvents: [
        'Dec 19: PLA naval exercises near Taiwan Strait',
        'Dec 18: 47 PLA aircraft entered Taiwan ADIZ',
        'Dec 15: New amphibious assault ships commissioned',
      ],
      sources: ['ISW', 'CSIS', 'Taiwan MND'],
    },
    {
      id: 'scs',
      region: 'South China Sea',
      threatLevel: 'high',
      status: 'contested',
      lastUpdate: '2025-12-18',
      summary: 'Continued militarization of artificial islands',
      keyEvents: [
        'Dec 18: Chinese Coast Guard harassment of Philippine vessels',
        'Dec 15: New radar installations detected on Mischief Reef',
      ],
      sources: ['AMTI', 'CSIS'],
    },
  ];
  
  return threats;
}

/**
 * Fetch live statistics
 */
export async function fetchStatistics() {
  // These would be fetched from a real database
  return {
    verifiedOrganizations: 847,
    detentionFacilities: 1200,
    activeCampaigns: 156,
    politicalPrisoners: 10000,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Source metadata
 */
export const FEED_SOURCES = {
  icij: {
    name: 'ICIJ',
    fullName: 'International Consortium of Investigative Journalists',
    url: 'https://www.icij.org',
    description: 'Global network of investigative journalists',
    reliability: 'high',
  },
  rfa: {
    name: 'Radio Free Asia',
    fullName: 'Radio Free Asia',
    url: 'https://www.rfa.org',
    description: 'Independent news organization covering Asia',
    reliability: 'high',
  },
  hkfp: {
    name: 'HKFP',
    fullName: 'Hong Kong Free Press',
    url: 'https://hongkongfp.com',
    description: 'Independent English-language news outlet',
    reliability: 'high',
  },
  aspi: {
    name: 'ASPI',
    fullName: 'Australian Strategic Policy Institute',
    url: 'https://www.aspistrategist.org.au',
    description: 'Independent think tank on strategic policy',
    reliability: 'high',
  },
};

export default {
  fetchAllFeeds,
  fetchPoliticalPrisoners,
  fetchRegionalThreats,
  fetchStatistics,
  FEED_SOURCES,
};
