import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * API Worker Tests
 *
 * Tests the REST API worker logic: data extraction, search, route matching,
 * response formatting, and rate limiting.
 *
 * Most of these read the worker's source, since the Workers runtime isn't
 * available in vitest. The rate-limiting tests call its fetch handler, which
 * needs only the Request and Response globals.
 */

const API_DIR = resolve(__dirname, '../../api');
const DATA_DIR = resolve(__dirname, '../data');

describe('API Worker — data integrity', () => {
  it('worker.js file exists', () => {
    const content = readFileSync(resolve(API_DIR, 'worker.js'), 'utf-8');
    expect(content).toContain('fetch(request');
    expect(content).toContain('/api/v1/');
  });

  it('imports all 13 JSON data files', () => {
    const content = readFileSync(resolve(API_DIR, 'worker.js'), 'utf-8');
    const expectedImports = [
      'political_prisoners_research.json',
      'sanctions_tracker.json',
      'sanctioned_officials_research.json',
      'timeline_events.json',
      'forced_labor_companies_research.json',
      'detention_facilities_research.json',
      'emergency_alerts.json',
      'live_statistics.json',
      'recent_updates.json',
      'international_responses_research.json',
      'human_rights_orgs_research.json',
      'police_stations_research.json',
      'legal_cases_research.json',
    ];
    for (const file of expectedImports) {
      expect(content, `Missing import for ${file}`).toContain(file);
    }
  });

  it('defines all 13 dataset endpoints', () => {
    const content = readFileSync(resolve(API_DIR, 'worker.js'), 'utf-8');
    const endpoints = [
      'prisoners', 'sanctions', 'officials', 'facilities', 'companies',
      'stations', 'timeline', 'alerts', 'updates', 'cases', 'responses',
      'orgs', 'stats',
    ];
    for (const ep of endpoints) {
      expect(content, `Missing endpoint: ${ep}`).toContain(`${ep}:`);
    }
  });

  it('includes CORS headers', () => {
    const content = readFileSync(resolve(API_DIR, 'worker.js'), 'utf-8');
    expect(content).toContain('Access-Control-Allow-Origin');
    expect(content).toContain('Access-Control-Allow-Methods');
  });

  it('includes rate limiting logic', () => {
    const content = readFileSync(resolve(API_DIR, 'worker.js'), 'utf-8');
    expect(content).toContain('checkRateLimit');
    expect(content).toContain('RATE_LIMIT');
    expect(content).toContain('429');
  });

  it('supports query parameters: q, search, name, region, category, limit, offset', () => {
    const content = readFileSync(resolve(API_DIR, 'worker.js'), 'utf-8');
    for (const param of ['q', 'search', 'name', 'region', 'category', 'limit', 'offset']) {
      expect(content, `Missing param support: ${param}`).toContain(`'${param}'`);
    }
  });

  it('returns proper API version header', () => {
    const content = readFileSync(resolve(API_DIR, 'worker.js'), 'utf-8');
    expect(content).toContain('X-API-Version');
    expect(content).toContain("'v1'");
  });

  it('handles OPTIONS preflight correctly', () => {
    const content = readFileSync(resolve(API_DIR, 'worker.js'), 'utf-8');
    expect(content).toContain('OPTIONS');
    expect(content).toContain('204');
    expect(content).toContain('Access-Control-Max-Age');
  });

  it('rejects non-GET methods with 405', () => {
    const content = readFileSync(resolve(API_DIR, 'worker.js'), 'utf-8');
    expect(content).toContain('405');
    expect(content).toContain('Method not allowed');
  });

  it('falls through to ASSETS for non-API routes', () => {
    const content = readFileSync(resolve(API_DIR, 'worker.js'), 'utf-8');
    expect(content).toContain('env.ASSETS');
    expect(content).toContain("!path.startsWith('/api/')");
  });

  it('supports global search endpoint', () => {
    const content = readFileSync(resolve(API_DIR, 'worker.js'), 'utf-8');
    expect(content).toContain('handleSearch');
    expect(content).toContain("segments[0] === 'search'");
  });

  it('API key bypass for rate limiting', () => {
    const content = readFileSync(resolve(API_DIR, 'worker.js'), 'utf-8');
    expect(content).toContain('X-API-Key');
    expect(content).toContain('env.API_KEY');
  });

  it('returns 404 for unknown datasets', () => {
    const content = readFileSync(resolve(API_DIR, 'worker.js'), 'utf-8');
    expect(content).toContain('Dataset not found');
    expect(content).toContain('404');
  });

  it('all referenced JSON data files exist', () => {
    const jsonFiles = [
      'political_prisoners_research.json',
      'sanctions_tracker.json',
      'sanctioned_officials_research.json',
      'timeline_events.json',
      'forced_labor_companies_research.json',
      'detention_facilities_research.json',
      'emergency_alerts.json',
      'live_statistics.json',
      'recent_updates.json',
      'international_responses_research.json',
      'human_rights_orgs_research.json',
      'police_stations_research.json',
      'legal_cases_research.json',
    ];
    for (const file of jsonFiles) {
      const content = readFileSync(resolve(DATA_DIR, file), 'utf-8');
      expect(content.length).toBeGreaterThan(10);
      // Verify valid JSON
      const parsed = JSON.parse(content);
      expect(parsed).toBeTruthy();
    }
  });

  it('CC BY 4.0 license declared in API', () => {
    const content = readFileSync(resolve(API_DIR, 'worker.js'), 'utf-8');
    expect(content).toContain('CC BY 4.0');
  });
});

describe('API Worker — wrangler configuration', () => {
  it('wrangler.jsonc references api/worker.js', () => {
    const content = readFileSync(resolve(__dirname, '../../wrangler.jsonc'), 'utf-8');
    expect(content).toContain('api/worker.js');
  });

  it('wrangler.jsonc has ASSETS binding for SPA fallback', () => {
    const content = readFileSync(resolve(__dirname, '../../wrangler.jsonc'), 'utf-8');
    expect(content).toContain('ASSETS');
    expect(content).toContain('single-page-application');
  });
});

describe('API Worker — rate limiting', () => {
  // The limiter's state lives at module scope, so each test loads a fresh copy.
  const loadWorker = async () => {
    vi.resetModules();
    return (await import('../../api/worker.js')).default;
  };
  const get = (
    worker: Awaited<ReturnType<typeof loadWorker>>,
    ip: string,
    env: Record<string, string> = {},
    headers: Record<string, string> = {},
  ): Promise<Response> =>
    worker.fetch(
      new Request('https://hub.test/api/v1/', { headers: { 'CF-Connecting-IP': ip, ...headers } }),
      env,
    );

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-09-27T00:00:00Z'));
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('allows 100 requests a minute from one address, then refuses until the minute passes', async () => {
    const worker = await loadWorker();
    for (let i = 0; i < 100; i++) {
      expect((await get(worker, '203.0.113.1')).status).toBe(200);
    }
    expect((await get(worker, '203.0.113.1')).status).toBe(429);
    expect((await get(worker, '203.0.113.2')).status, 'another address is not limited').toBe(200);

    vi.setSystemTime(Date.now() + 60_000);
    expect((await get(worker, '203.0.113.1')).status).toBe(200);
  });

  it('does not limit a caller with the API key', async () => {
    const worker = await loadWorker();
    const env = { API_KEY: 'key' };
    for (let i = 0; i < 101; i++) {
      expect((await get(worker, '203.0.113.1', env, { 'X-API-Key': 'key' })).status).toBe(200);
    }
    expect((await get(worker, '203.0.113.1', env, { 'X-API-Key': 'wrong' })).status).toBe(200);
  });

  it("forgets a reader's address within two minutes of their last request", async () => {
    // The limiter's map is private; the spy finds it by the first entry set
    // for the reader's address.
    const set = vi.spyOn(Map.prototype, 'set');
    const worker = await loadWorker();
    const reader = '198.51.100.7';
    const other = '203.0.113.9';
    const t0 = Date.now();

    await get(worker, reader);
    const index = set.mock.calls.findIndex(([key]) => key === reader);
    expect(index, 'no map entry was set for the address').toBeGreaterThanOrEqual(0);
    const limiter = set.mock.contexts[index] as Map<string, number[]>;
    expect(limiter).toBeInstanceOf(Map);

    vi.setSystemTime(t0 + 1_000);
    await get(worker, reader);

    // 59 seconds after the reader's last request the limit still needs it.
    vi.setSystemTime(t0 + 60_000);
    await get(worker, other);
    expect(limiter.has(reader)).toBe(true);

    // 119 seconds after, it must be gone, though the reader never came back.
    vi.setSystemTime(t0 + 120_000);
    await get(worker, other);
    expect(limiter.has(reader)).toBe(false);
  });
});
