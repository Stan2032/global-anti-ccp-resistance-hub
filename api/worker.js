/**
 * Cloudflare Workers REST API for Global Anti-CCP Resistance Hub
 *
 * Serves JSON data from research datasets at /api/v1/* routes.
 * Falls through to static assets (SPA) for all other routes.
 *
 * Endpoints:
 *   GET /api/v1/                  → API info + endpoint list
 *   GET /api/v1/prisoners         → Political prisoners
 *   GET /api/v1/sanctions         → Sanctions tracker
 *   GET /api/v1/officials         → Sanctioned CCP officials
 *   GET /api/v1/facilities        → Detention facilities
 *   GET /api/v1/companies         → Forced labor companies
 *   GET /api/v1/stations          → Overseas police stations
 *   GET /api/v1/timeline          → Historical timeline
 *   GET /api/v1/alerts            → Emergency alerts
 *   GET /api/v1/updates           → Recent platform updates
 *   GET /api/v1/cases             → Legal cases
 *   GET /api/v1/responses         → International responses
 *   GET /api/v1/orgs              → Human rights organizations
 *   GET /api/v1/stats             → Live statistics
 *   GET /api/v1/search?q=X        → Global search across all datasets
 *   GET /api/v1/feeds             → List of proxied RSS sources
 *   GET /api/v1/feed?source=KEY   → One RSS feed, fetched server-side
 */

// ── Data imports ────────────────────────────────────────
import politicalPrisonersData from '../src/data/political_prisoners_research.json';
import sanctionsData from '../src/data/sanctions_tracker.json';
import officialsData from '../src/data/sanctioned_officials_research.json';
import timelineData from '../src/data/timeline_events.json';
import forcedLaborData from '../src/data/forced_labor_companies_research.json';
import detentionData from '../src/data/detention_facilities_research.json';
import emergencyAlertsData from '../src/data/emergency_alerts.json';
import liveStatisticsData from '../src/data/live_statistics.json';
import recentUpdatesData from '../src/data/recent_updates.json';
import internationalResponsesData from '../src/data/international_responses_research.json';
import humanRightsOrgsData from '../src/data/human_rights_orgs_research.json';
import policeStationsData from '../src/data/police_stations_research.json';
import legalCasesData from '../src/data/legal_cases_research.json';

// ── Constants ───────────────────────────────────────────
const API_VERSION = 'v1';
const RATE_LIMIT = 100; // requests per minute per IP
const CACHE_TTL = 300; // 5 minutes
const rateLimitMap = new Map();

// ── Helpers ─────────────────────────────────────────────

/** Extract records from { results: [{ input, output, error }] } wrapper */
function extractResults(data) {
  const results = data?.results || [];
  return results
    .filter((r) => !r.error)
    .map((r) => ({ id: r.input, ...r.output }));
}

/** Extract records from { results: [{ input, output }] } or return array/object directly */
function getData(data) {
  if (Array.isArray(data)) return data;
  if (data?.results) return extractResults(data);
  if (data?.entries) return data.entries;
  if (data?.alerts) return data.alerts;
  if (data?.events) return data.events;
  if (data?.updates) return data.updates;
  if (data?.statistics) return data.statistics;
  if (data?.cases) return data.cases;
  if (data?.responses) return data.responses;
  if (data?.organizations) return data.organizations;
  if (data?.stations) return data.stations;
  return data;
}

/** Case-insensitive search across all string fields */
function matchesSearch(obj, query) {
  if (!query) return true;
  const lower = query.toLowerCase();
  return Object.values(obj).some((val) => {
    if (typeof val === 'string') return val.toLowerCase().includes(lower);
    if (Array.isArray(val)) return val.some((v) => typeof v === 'string' && v.toLowerCase().includes(lower));
    return false;
  });
}

/** Build JSON response with CORS + cache headers */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
      'Cache-Control': `public, max-age=${CACHE_TTL}, s-maxage=${CACHE_TTL}`,
      'X-Content-Type-Options': 'nosniff',
      'X-API-Version': API_VERSION,
    },
  });
}

/** Rate limiting check (per IP, in-memory — resets on Worker restart) */
function checkRateLimit(ip, apiKey) {
  // API key holders bypass rate limiting
  if (apiKey) return true;

  const now = Date.now();
  const windowStart = now - 60_000;
  const entry = rateLimitMap.get(ip) || [];
  const recent = entry.filter((t) => t > windowStart);
  recent.push(now);
  rateLimitMap.set(ip, recent);

  // Prune old entries periodically
  if (rateLimitMap.size > 10_000) {
    for (const [key, times] of rateLimitMap) {
      const filtered = times.filter((t) => t > windowStart);
      if (filtered.length === 0) rateLimitMap.delete(key);
      else rateLimitMap.set(key, filtered);
    }
  }

  return recent.length <= RATE_LIMIT;
}

// ── Prepared datasets ───────────────────────────────────
const datasets = {
  prisoners: { data: () => getData(politicalPrisonersData), label: 'Political Prisoners', description: 'Documented political prisoners in China, Hong Kong, Tibet, and Xinjiang' },
  sanctions: { data: () => getData(sanctionsData), label: 'Sanctions Tracker', description: 'International sanctions against CCP officials and entities' },
  officials: { data: () => getData(officialsData), label: 'Sanctioned Officials', description: 'CCP officials subject to international sanctions' },
  facilities: { data: () => getData(detentionData), label: 'Detention Facilities', description: 'Documented detention and internment facilities' },
  companies: { data: () => getData(forcedLaborData), label: 'Forced Labor Companies', description: 'Companies linked to forced labor supply chains' },
  stations: { data: () => getData(policeStationsData), label: 'Overseas Police Stations', description: 'CCP overseas police service stations worldwide' },
  timeline: { data: () => getData(timelineData), label: 'Timeline', description: 'Key historical events related to CCP human rights violations' },
  alerts: { data: () => getData(emergencyAlertsData), label: 'Emergency Alerts', description: 'Active emergency alerts and urgent cases' },
  updates: { data: () => getData(recentUpdatesData), label: 'Recent Updates', description: 'Platform data updates and verifications' },
  cases: { data: () => getData(legalCasesData), label: 'Legal Cases', description: 'International legal cases related to CCP human rights violations' },
  responses: { data: () => getData(internationalResponsesData), label: 'International Responses', description: 'Government and institutional responses to CCP abuses' },
  orgs: { data: () => getData(humanRightsOrgsData), label: 'Human Rights Organizations', description: 'Organizations working on China-related human rights issues' },
  stats: { data: () => getData(liveStatisticsData), label: 'Live Statistics', description: 'Aggregated statistics across all datasets' },
};

// ── Route Handlers ──────────────────────────────────────

/** GET /api/v1/ — API index */
function handleIndex() {
  const endpoints = Object.entries(datasets).map(([key, { label, description }]) => ({
    endpoint: `/api/${API_VERSION}/${key}`,
    name: label,
    description,
  }));

  return jsonResponse({
    name: 'Global Anti-CCP Resistance Hub API',
    version: API_VERSION,
    description: 'Public read-only API for human rights research data. All data sourced from Tier 1-2 outlets (BBC, Reuters, HRW, Amnesty, government records).',
    license: 'CC BY 4.0',
    documentation: '/data-sources',
    endpoints: [
      ...endpoints,
      { endpoint: `/api/${API_VERSION}/search?q=QUERY`, name: 'Global Search', description: 'Search across all datasets' },
      { endpoint: `/api/${API_VERSION}/feeds`, name: 'Feed Sources', description: 'RSS sources this API will proxy' },
      { endpoint: `/api/${API_VERSION}/feed?source=KEY`, name: 'RSS Feed', description: 'One RSS feed, fetched server-side so readers never contact the outlet directly' },
    ],
    rateLimit: `${RATE_LIMIT} requests/minute (unauthenticated)`,
    lastUpdated: new Date().toISOString().split('T')[0],
  });
}

/**
 * Every RSS feed the site reads, and the only URLs this Worker will fetch.
 *
 * ## Why the Worker fetches these instead of the browser
 *
 * Until now the reader's own browser fetched each feed through
 * `api.rss2json.com` or `api.allorigins.win`, two free third-party proxies —
 * the CSP had been widened to permit them. That told both services the
 * reader's IP address and exactly which anti-CCP feeds they were pulling,
 * on a site whose Security Center tells readers in China to use Tor
 * precisely because being identified is dangerous. It also meant a public
 * proxy, if it went down or was interfered with, chose what text got
 * rendered into the page.
 *
 * Fetching here removes both problems. The Worker builds a fresh request,
 * so the upstream outlet and any intermediary see Cloudflare's edge and
 * never the reader. `connect-src` is back to 'self'.
 *
 * ## Why this is a key allowlist and not a URL parameter
 *
 * An endpoint that fetches a URL supplied by the caller is an open proxy
 * and an SSRF hole — it would fetch internal addresses on request. The
 * caller sends a key; the URL is only ever read from this object.
 *
 * This is also the single source of truth for feed URLs. There were two
 * overlapping lists before, in src/services/liveDataService.ts and
 * src/data/live_data_feeds.json, which disagreed about the URLs for the
 * same outlets. A test pins the JSON list to this one.
 */
const FEED_SOURCES = {
  icij: 'https://www.icij.org/feed/',
  rfa: 'https://www.rfa.org/english/news/rss2.xml',
  rfa_china: 'https://www.rfa.org/english/news/china/rss.xml',
  rfa_uyghur: 'https://www.rfa.org/english/news/uyghur/rss.xml',
  rfa_tibet: 'https://www.rfa.org/english/news/tibet/rss.xml',
  hkfp: 'https://hongkongfp.com/feed/',
  hongkongfp: 'https://hongkongfp.com/feed/',
  aspi: 'https://www.aspistrategist.org.au/feed/',
  aspi_china: 'https://www.aspi.org.au/rss.xml',
  hrw: 'https://www.hrw.org/rss/news',
  hrw_china: 'https://www.hrw.org/news/china/rss',
  amnesty: 'https://www.amnesty.org/en/feed/',
  amnesty_china: 'https://www.amnesty.org/en/location/asia-and-the-pacific/east-asia/china/rss/',
  cpj: 'https://cpj.org/feed/',
  guardian: 'https://www.theguardian.com/world/china/rss',
  bbc: 'https://feeds.bbci.co.uk/news/world/asia/china/rss.xml',
  scmp_china: 'https://www.scmp.com/rss/91/china',
  taiwan_news: 'https://www.taiwannews.com.tw/en/rss',
};

const FEED_CACHE_TTL = 600; // 10 minutes — feeds do not change faster than this
const FEED_TIMEOUT_MS = 8000;

/** GET /api/v1/feeds — the sources available to proxy. */
function handleFeedIndex() {
  return jsonResponse({
    description: 'RSS sources fetched server-side so readers never contact them directly.',
    usage: `/api/${API_VERSION}/feed?source=KEY`,
    cacheSeconds: FEED_CACHE_TTL,
    sources: Object.keys(FEED_SOURCES).sort(),
  });
}

/** GET /api/v1/feed?source=KEY — one feed, as the outlet published it. */
async function handleFeed(url) {
  const source = url.searchParams.get('source') || '';
  // hasOwnProperty, not `in`: `source=toString` must not resolve to a function.
  const upstream = Object.prototype.hasOwnProperty.call(FEED_SOURCES, source)
    ? FEED_SOURCES[source]
    : null;

  if (!upstream) {
    return jsonResponse({
      error: 'Unknown feed source.',
      hint: `See /api/${API_VERSION}/feeds for the available keys.`,
    }, 404);
  }

  let upstreamResponse;
  try {
    // A new request, deliberately: nothing from the reader is forwarded.
    upstreamResponse = await fetch(upstream, {
      method: 'GET',
      headers: {
        Accept: 'application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8',
        'User-Agent': 'global-anti-ccp-resistance-hub (+/api/v1/)',
      },
      signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
      cf: { cacheTtl: FEED_CACHE_TTL, cacheEverything: true },
    });
  } catch (_err) {
    return jsonResponse({ error: 'Feed source unreachable.', source }, 502);
  }

  if (!upstreamResponse.ok) {
    return jsonResponse({
      error: 'Feed source returned an error.',
      source,
      upstreamStatus: upstreamResponse.status,
    }, 502);
  }

  const body = await upstreamResponse.text();

  return new Response(body, {
    status: 200,
    headers: {
      // Always XML, whatever the outlet labelled it, and never sniffed as HTML.
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': `public, max-age=${FEED_CACHE_TTL}`,
      'Access-Control-Allow-Origin': '*',
    },
  });
}

/** GET /api/v1/:dataset — Return dataset with optional filters */
function handleDataset(datasetKey, url) {
  const config = datasets[datasetKey];
  if (!config) {
    return jsonResponse({ error: 'Dataset not found', available: Object.keys(datasets) }, 404);
  }

  let records = config.data();
  if (!Array.isArray(records)) {
    // Stats or non-array datasets — return directly
    return jsonResponse({ dataset: datasetKey, data: records });
  }

  // Apply query filters
  const params = url.searchParams;
  const query = params.get('q') || params.get('search') || params.get('name');
  const region = params.get('region');
  const category = params.get('category');
  const limit = parseInt(params.get('limit'), 10) || 0;
  const offset = parseInt(params.get('offset'), 10) || 0;

  if (query) {
    records = records.filter((r) => matchesSearch(r, query));
  }

  if (region) {
    const regionLower = region.toLowerCase();
    records = records.filter((r) => {
      const loc = r.region || r.location || r.country || '';
      return typeof loc === 'string' && loc.toLowerCase().includes(regionLower);
    });
  }

  if (category) {
    const catLower = category.toLowerCase();
    records = records.filter((r) => {
      const cat = r.category || r.type || r.sector || '';
      return typeof cat === 'string' && cat.toLowerCase().includes(catLower);
    });
  }

  const total = records.length;

  if (offset > 0) {
    records = records.slice(offset);
  }

  if (limit > 0) {
    records = records.slice(0, limit);
  }

  return jsonResponse({
    dataset: datasetKey,
    total,
    count: records.length,
    offset,
    limit: limit || null,
    data: records,
  });
}

/** GET /api/v1/search?q=X — Global search across all datasets */
function handleSearch(url) {
  const query = url.searchParams.get('q');
  if (!query) {
    return jsonResponse({ error: 'Missing required parameter: q' }, 400);
  }

  const results = {};
  let totalMatches = 0;

  for (const [key, config] of Object.entries(datasets)) {
    if (key === 'stats') continue; // Skip non-searchable
    const records = config.data();
    if (!Array.isArray(records)) continue;
    const matches = records.filter((r) => matchesSearch(r, query));
    if (matches.length > 0) {
      results[key] = { count: matches.length, data: matches.slice(0, 10) }; // Top 10 per dataset
      totalMatches += matches.length;
    }
  }

  return jsonResponse({
    query,
    totalMatches,
    datasets: results,
  });
}

// ── Main Worker Export ──────────────────────────────────

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Only handle /api/* routes — let everything else fall through to static assets
    if (!path.startsWith('/api/')) {
      // Fall through to static assets binding
      if (env.ASSETS) {
        return env.ASSETS.fetch(request);
      }
      // If no ASSETS binding, return 404
      return new Response('Not Found', { status: 404 });
    }

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Only allow GET
    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Method not allowed. Use GET.' }, 405);
    }

    // Rate limiting
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const apiKey = request.headers.get('X-API-Key');
    const validApiKey = env.API_KEY ? apiKey === env.API_KEY : false;

    if (!checkRateLimit(ip, validApiKey)) {
      return jsonResponse({
        error: 'Rate limit exceeded. Maximum 100 requests per minute.',
        retryAfter: 60,
      }, 429);
    }

    // Route matching
    const apiPath = path.replace(`/api/${API_VERSION}`, '').replace(/\/$/, '') || '/';
    const segments = apiPath.split('/').filter(Boolean);

    try {
      // /api/v1/ — Index
      if (segments.length === 0 || apiPath === '/') {
        return handleIndex();
      }

      // /api/v1/search — Global search
      if (segments[0] === 'search') {
        return handleSearch(url);
      }

      // /api/v1/feeds — Proxied RSS source list
      if (segments[0] === 'feeds') {
        return handleFeedIndex();
      }

      // /api/v1/feed — One proxied RSS feed. Awaited so the catch below
      // covers it; the other handlers are synchronous.
      if (segments[0] === 'feed') {
        return await handleFeed(url);
      }

      // /api/v1/:dataset — Dataset endpoint
      return handleDataset(segments[0], url);
    } catch (_err) {
      return jsonResponse({ error: 'Internal server error' }, 500);
    }
  },
};
