/**
 * Live Data Service
 * Fetches real-time data from various sources
 *
 * RSS feeds are fetched through this site's own Cloudflare Worker
 * (/api/v1/feed?source=KEY), never by the reader's browser from the outlet
 * or a public CORS proxy. Nothing about the reader reaches a third party.
 *
 * Filters content by relevance to CCP human rights topics using keyword scoring.
 *
 * @module liveDataService
 */

import { logger } from '../utils/logger';

/** A single feed item parsed from an RSS/Atom source. */
export interface FeedItem {
  /** Unique identifier (source-index-timestamp) */
  id: string;
  /** Article title */
  title: string;
  /** URL to the article */
  link: string;
  /** First 300 chars of cleaned article text */
  description: string;
  /** ISO 8601 publication date */
  pubDate: string;
  /** Feed source key (e.g. "bbc", "hrw") */
  source: string;
  /** Relevance score based on keyword matching */
  relevanceScore: number;
}

/** Metadata for a feed source. */
export interface FeedSourceMeta {
  /** Short name */
  name: string;
  /** Full organisation name */
  fullName: string;
  /** Website URL */
  url: string;
  /** Brief description */
  description: string;
  /** Reliability rating */
  reliability: 'high' | 'medium' | 'low';
}

/** Platform-level statistics derived from verified data files. */
export interface PlatformStatistics {
  /** Count of verified human rights organisations */
  verifiedOrganizations: number;
  /** Estimated count of detention facilities */
  detentionFacilities: number;
  /** Active campaigns count (null if not tracked) */
  activeCampaigns: number | null;
  /** Count of documented political prisoners */
  politicalPrisoners: number;
  /** Date of last update (YYYY-MM-DD) */
  lastUpdated: string;
  /** Disclaimer about the data */
  dataNote: string;
  /** Source descriptions per category */
  sources: Record<string, string>;
}

/** Shape of a political prisoner record from the research JSON. */
interface PrisonerResearchRecord {
  input: string;
  error?: unknown;
  output?: {
    prisoner_name: string;
    status?: string;
    sentence?: string;
    location?: string;
    latest_news?: string;
    source_url?: string;
    confidence?: string;
    last_verified?: string;
  };
}

/** Normalised political prisoner returned by fetchPoliticalPrisoners. */
export interface NormalisedPrisoner {
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

/**
 * The feeds this page reads, by key.
 *
 * Only keys. The URLs live in FEED_SOURCES in api/worker.js, which is the
 * one place they are written down — this file and
 * src/data/live_data_feeds.json each used to carry their own list, and they
 * disagreed about the URLs for the same outlets.
 */
const RSS_FEEDS: readonly string[] = [
  'icij', 'rfa', 'hkfp', 'aspi', 'hrw', 'amnesty', 'cpj', 'guardian', 'bbc',
];

/**
 * Feeds are fetched from our own Worker, never from the outlet or a public
 * proxy, so nothing about the reader reaches a third party. See the comment
 * on FEED_SOURCES in api/worker.js. The Worker owns the URLs; the browser
 * only ever sends a key.
 */
const FEED_ENDPOINT = '/api/v1/feed?source=';

// Keywords for relevance scoring
const CCP_KEYWORDS: string[] = [
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
const ALWAYS_RELEVANT_SOURCES: string[] = ['hkfp', 'rfa', 'hrw', 'amnesty', 'cpj'];

/** Parse RSS/Atom XML feed. */
function parseRSSFeed(xmlText: string, sourceName: string): FeedItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  
  const items: FeedItem[] = [];
  
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

/** Clean HTML tags from text. */
function cleanHTML(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

/**
 * Fetch one RSS feed through our own Worker.
 *
 * There used to be two strategies here — RSS2JSON, falling back to the
 * allorigins.win CORS proxy — because a browser cannot read a news site's
 * RSS cross-origin. Both were third parties learning the reader's IP and
 * which anti-CCP feeds they wanted, which is a poor trade on a site whose
 * own guidance is that being identified is dangerous. The Worker does the
 * fetch now, so there is one strategy and no third party.
 *
 * An empty array on failure, as before: a feed that will not load must not
 * take the page down with it.
 */
async function fetchRSSFeed(sourceName: string): Promise<FeedItem[]> {
  try {
    const response = await fetch(FEED_ENDPOINT + encodeURIComponent(sourceName), {
      headers: { Accept: 'application/xml, text/xml' },
    });
    if (!response.ok) throw new Error(`feed endpoint HTTP ${response.status}`);
    // `vite dev` has no Worker, so /api/* returns the SPA's HTML with a 200.
    // Without this the feed would parse to zero items and look merely empty.
    const contentType = response.headers.get('content-type') || '';
    if (!/xml/i.test(contentType)) {
      throw new Error(`feed endpoint returned ${contentType || 'no content-type'}, not XML`);
    }
    return parseRSSFeed(await response.text(), sourceName);
  } catch (error: unknown) {
    logger.error('feed', `Error fetching ${sourceName} feed:`, error);
    return [];
  }
}

/** Fetch all RSS feeds and combine results, sorted by relevance then date. */
export async function fetchAllFeeds(): Promise<FeedItem[]> {
  const feedPromises = RSS_FEEDS.map(name =>
    fetchRSSFeed(name)
  );
  
  const results = await Promise.allSettled(feedPromises);
  
  const allItems: FeedItem[] = results
    .filter((result): result is PromiseFulfilledResult<FeedItem[]> => result.status === 'fulfilled')
    .flatMap(result => result.value);
  
  // Sort by relevance score and date
  allItems.sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });
  
  return allItems;
}

/**
 * Fetch feeds progressively — calls onItems(items) as each source finishes.
 * Also calls onSourceDone(sourceName) when each source completes (even if 0 items).
 * This allows the UI to show articles as they arrive and track per-source progress.
 */
export async function fetchFeedsProgressively(
  onItems: (items: FeedItem[]) => void,
  onSourceDone?: (sourceName: string) => void
): Promise<void> {
  const feedPromises = RSS_FEEDS.map(async name => {
    const items = await fetchRSSFeed(name);
    if (items.length > 0) {
      onItems(items);
    }
    if (onSourceDone) {
      onSourceDone(name);
    }
    return items;
  });

  await Promise.allSettled(feedPromises);
}

/**
 * Fetch political prisoners data from verified JSON research file.
 * Source: CECC Political Prisoner Database, HRW, Amnesty International, CPJ
 * Data file: src/data/political_prisoners_research.json
 */
export async function fetchPoliticalPrisoners(): Promise<NormalisedPrisoner[]> {
  const { default: prisonersData } = await import('../data/political_prisoners_research.json') as {
    default: { results: PrisonerResearchRecord[] };
  };
  
  return prisonersData.results
    .filter((r: PrisonerResearchRecord) => !r.error && r.output)
    .map((r: PrisonerResearchRecord, index: number) => ({
      id: index + 1,
      name: r.output!.prisoner_name,
      status: r.output!.status?.toLowerCase() || 'unknown',
      sentence: r.output!.sentence || '',
      location: r.output!.location || '',
      description: r.output!.latest_news || r.input,
      source: r.output!.source_url || 'https://www.cecc.gov/victims',
      confidence: r.output!.confidence || 'MEDIUM',
      lastUpdated: r.output!.last_verified || '',
    }));
}

/**
 * Fetch platform statistics derived from verified data files.
 *
 * Numbers are derived from actual data in the repository's JSON files,
 * not from a live database. They represent documented/verified entries.
 *
 * Sources:
 * - Political prisoners: CECC database, HRW, Amnesty
 * - Detention facilities: ASPI Xinjiang Data Project estimates 380+ facilities;
 *   broader estimates by researchers suggest 1,000+ across all regions
 *   (Source: ASPI, https://xjdp.aspi.org.au/)
 * - Verified organisations: human_rights_orgs_research.json
 * - Active campaigns: Illustrative target — no live tracking
 */
export async function fetchStatistics(): Promise<PlatformStatistics> {
  // Dynamically count from actual data files to prevent hardcoded staleness
  const { default: prisonersData } = await import('../data/political_prisoners_research.json') as {
    default: { results: PrisonerResearchRecord[] };
  };
  const { default: orgsData } = await import('../data/human_rights_orgs_research.json') as {
    default: { results: Array<Record<string, unknown>> };
  };
  const prisonerCount = prisonersData.results.filter(
    (r: PrisonerResearchRecord) => !r.error && r.output
  ).length;
  const orgCount = orgsData.results.length;

  return {
    verifiedOrganizations: orgCount,
    detentionFacilities: 380,
    activeCampaigns: null,
    politicalPrisoners: prisonerCount,
    lastUpdated: '2026-03-11',
    dataNote: 'Counts reflect entries documented in this platform\'s verified database, not global totals.',
    sources: {
      organizations: `human_rights_orgs_research.json — ${orgCount} verified human rights organizations`,
      facilities: 'ASPI Xinjiang Data Project (xjdp.aspi.org.au) — 380+ identified facilities',
      prisoners: `political_prisoners_research.json — ${prisonerCount} verified individual cases (CECC, HRW, Amnesty)`,
    },
  };
}

/** Source metadata for all feed sources. */
export const FEED_SOURCES: Record<string, FeedSourceMeta> = {
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
    description: 'Independent news organisation covering Asia',
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
    description: 'International human rights organisation',
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
    description: 'Press freedom advocacy organisation',
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
  fetchFeedsProgressively,
  fetchPoliticalPrisoners,
  fetchStatistics,
  FEED_SOURCES,
};
