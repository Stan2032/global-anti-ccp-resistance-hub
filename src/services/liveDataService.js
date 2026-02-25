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
  hrw: 'https://www.hrw.org/rss/news',
  amnesty: 'https://www.amnesty.org/en/feed/',
  cpj: 'https://cpj.org/feed/',
  guardian: 'https://www.theguardian.com/world/china/rss',
  bbc: 'https://feeds.bbci.co.uk/news/world/asia/china/rss.xml',
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

// Sources whose content is always relevant (no keyword filtering needed)
const ALWAYS_RELEVANT_SOURCES = ['hkfp', 'rfa', 'hrw', 'amnesty', 'cpj'];

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
    if (relevanceScore > 0 || ALWAYS_RELEVANT_SOURCES.includes(sourceName)) {
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
 * Fetch political prisoners data from verified JSON research file
 * Source: CECC Political Prisoner Database, HRW, Amnesty International, CPJ
 * Data file: src/data/political_prisoners_research.json (62 verified entries)
 */
export async function fetchPoliticalPrisoners() {
  const { default: prisonersData } = await import('../data/political_prisoners_research.json');
  
  return prisonersData.results
    .filter(r => !r.error && r.output)
    .map((r, index) => ({
      id: index + 1,
      name: r.output.prisoner_name,
      status: r.output.status?.toLowerCase() || 'unknown',
      sentence: r.output.sentence || '',
      location: r.output.location || '',
      description: r.output.latest_news || r.input,
      source: r.output.source_url || 'https://www.cecc.gov/victims',
      confidence: r.output.confidence || 'MEDIUM',
      lastUpdated: r.output.last_verified || '',
    }));
}

/**
 * Fetch platform statistics derived from verified data files
 * 
 * Numbers are derived from actual data in the repository's JSON files,
 * not from a live database. They represent documented/verified entries.
 * 
 * Sources:
 * - Political prisoners: CECC database, HRW, Amnesty (62 documented in our database)
 * - Detention facilities: ASPI Xinjiang Data Project estimates 380+ facilities;
 *   broader estimates by researchers suggest 1,000+ across all regions
 *   (Source: ASPI, https://xjdp.aspi.org.au/)
 * - Verified organizations: human_rights_orgs_research.json (49 documented)
 * - Active campaigns: Illustrative target — no live tracking
 */
export async function fetchStatistics() {
  return {
    verifiedOrganizations: 49,
    detentionFacilities: 380,
    activeCampaigns: null,
    politicalPrisoners: 62,
    lastUpdated: '2026-02-20',
    dataNote: 'Counts reflect entries documented in this platform\'s verified database, not global totals.',
    sources: {
      organizations: 'human_rights_orgs_research.json — 49 verified human rights organizations',
      facilities: 'ASPI Xinjiang Data Project (xjdp.aspi.org.au) — 380+ identified facilities',
      prisoners: 'political_prisoners_research.json — 62 verified individual cases (CECC, HRW, Amnesty)',
    },
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
  hrw: {
    name: 'HRW',
    fullName: 'Human Rights Watch',
    url: 'https://www.hrw.org',
    description: 'International human rights organization',
    reliability: 'high',
  },
  amnesty: {
    name: 'Amnesty',
    fullName: 'Amnesty International',
    url: 'https://www.amnesty.org',
    description: 'Global human rights movement',
    reliability: 'high',
  },
  cpj: {
    name: 'CPJ',
    fullName: 'Committee to Protect Journalists',
    url: 'https://cpj.org',
    description: 'Press freedom advocacy organization',
    reliability: 'high',
  },
  guardian: {
    name: 'Guardian',
    fullName: 'The Guardian',
    url: 'https://www.theguardian.com',
    description: 'UK-based independent newspaper',
    reliability: 'high',
  },
  bbc: {
    name: 'BBC',
    fullName: 'BBC News',
    url: 'https://www.bbc.com/news',
    description: 'British public service broadcaster',
    reliability: 'high',
  },
};

export default {
  fetchAllFeeds,
  fetchPoliticalPrisoners,
  fetchStatistics,
  FEED_SOURCES,
};
