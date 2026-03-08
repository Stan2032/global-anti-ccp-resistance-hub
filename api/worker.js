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
    ],
    rateLimit: `${RATE_LIMIT} requests/minute (unauthenticated)`,
    lastUpdated: new Date().toISOString().split('T')[0],
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

      // /api/v1/:dataset — Dataset endpoint
      return handleDataset(segments[0], url);
    } catch (err) {
      return jsonResponse({ error: 'Internal server error' }, 500);
    }
  },
};
