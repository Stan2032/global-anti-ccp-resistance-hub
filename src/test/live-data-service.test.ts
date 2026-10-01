/**
 * Tests for liveDataService.js — verifies no simulated/fabricated data
 *
 * Ensures:
 * - fetchStatistics() returns sourced numbers from verified data files
 * - fetchPoliticalPrisoners() returns data from JSON (not hardcoded)
 * - No fabricated change metrics, no Math.random(), no fake live data
 */
import { readFileSync } from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import { fetchStatistics, fetchPoliticalPrisoners, FEED_SOURCES } from '../services/liveDataService';
import prisonersData from '../data/political_prisoners_research.json';
import orgsData from '../data/human_rights_orgs_research.json';

describe('fetchStatistics', () => {
  it('should return sourced statistics, not fabricated numbers', async () => {
    const stats = await fetchStatistics();
    expect(stats).toBeDefined();
    expect(stats.verifiedOrganizations).toBeTypeOf('number');
    expect(stats.detentionFacilities).toBeTypeOf('number');
    expect(stats.politicalPrisoners).toBeTypeOf('number');
  });

  it('should match actual data file counts', async () => {
    const stats = await fetchStatistics();
    // Organizations count should match human_rights_orgs_research.json
    expect(stats.verifiedOrganizations).toBe(orgsData.results.length);
    // Political prisoners count should match political_prisoners_research.json
    const validPrisoners = prisonersData.results.filter(r => !r.error && r.output);
    expect(stats.politicalPrisoners).toBe(validPrisoners.length);
  });

  it('should not return fabricated campaign count', async () => {
    const stats = await fetchStatistics();
    // activeCampaigns should be null (no live tracking) not a fabricated number
    expect(stats.activeCampaigns).toBeNull();
  });

  it('should include source attribution', async () => {
    const stats = await fetchStatistics();
    expect(stats.sources).toBeDefined();
    expect(stats.sources.organizations).toBeDefined();
    expect(stats.sources.facilities).toBeDefined();
    expect(stats.sources.prisoners).toBeDefined();
  });

  it('should include data transparency note', async () => {
    const stats = await fetchStatistics();
    expect(stats.dataNote).toBeDefined();
    expect(stats.dataNote).toContain('verified');
  });

  it('should have static lastUpdated date (not fabricated real-time)', async () => {
    const stats = await fetchStatistics();
    // Should be a fixed date, not Date.now() which would imply live data
    expect(stats.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('fetchPoliticalPrisoners', () => {
  it('should return prisoners from JSON data file', async () => {
    const prisoners = await fetchPoliticalPrisoners();
    expect(prisoners.length).toBeGreaterThan(5);
    // Should have more than the 5 hardcoded entries from before
    expect(prisoners.length).toBe(
      prisonersData.results.filter(r => !r.error && r.output).length
    );
  });

  it('each prisoner should have required fields', async () => {
    const prisoners = await fetchPoliticalPrisoners();
    for (const p of prisoners) {
      expect(p.id).toBeTypeOf('number');
      expect(p.name).toBeTypeOf('string');
      expect(p.name.length).toBeGreaterThan(0);
      expect(p.source).toBeTypeOf('string');
      expect(p.source).toMatch(/^https?:\/\//);
    }
  });

  it('should include key known prisoners', async () => {
    const prisoners = await fetchPoliticalPrisoners();
    const names = prisoners.map(p => p.name);
    expect(names).toContain('Jimmy Lai');
    expect(names).toContain('Ilham Tohti');
    expect(names).toContain('Zhang Zhan');
  });

  it('each prisoner should have source URL', async () => {
    const prisoners = await fetchPoliticalPrisoners();
    for (const p of prisoners) {
      expect(p.source).toBeDefined();
      expect(p.source).toMatch(/^https:\/\//);
    }
  });
});

describe('FEED_SOURCES', () => {
  it('should only contain real news organizations', () => {
    // All sources should be high reliability
    for (const source of Object.values(FEED_SOURCES)) {
      expect(source.reliability).toBe('high');
      expect(source.url).toMatch(/^https:\/\//);
    }
  });

  it('should not contain CCP state media', () => {
    const names = Object.values(FEED_SOURCES).map(s => s.name.toLowerCase());
    const ccpMedia = ['xinhua', 'cgtn', 'global times', 'people\'s daily', 'china daily'];
    for (const media of ccpMedia) {
      expect(names).not.toContain(media);
    }
  });

  it('should have all 9 configured RSS feed sources', () => {
    const keys = Object.keys(FEED_SOURCES);
    expect(keys).toContain('icij');
    expect(keys).toContain('rfa');
    expect(keys).toContain('hkfp');
    expect(keys).toContain('aspi');
    expect(keys).toContain('hrw');
    expect(keys).toContain('amnesty');
    expect(keys).toContain('cpj');
    expect(keys).toContain('guardian');
    expect(keys).toContain('bbc');
    expect(keys.length).toBe(9);
  });
});

/**
 * Feeds are fetched by our own Cloudflare Worker, not by the reader.
 *
 * The browser used to call api.rss2json.com and api.allorigins.win directly.
 * Both learned the reader's IP and which anti-CCP feeds they were pulling —
 * on a site that tells readers in China to use Tor because being identified
 * is dangerous — and a public proxy chose what text got rendered into the
 * page. These tests exist so that cannot come back without someone deciding
 * to delete them.
 */
describe('RSS feeds go through our own Worker', () => {
  const read = (rel: string) =>
    readFileSync(path.resolve(__dirname, rel), 'utf-8');

  /** FEED_SOURCES in api/worker.js: the only URLs the Worker will fetch. */
  const workerFeedSources = (): Record<string, string> => {
    const block = read('../../api/worker.js').match(/const FEED_SOURCES = \{([\s\S]*?)\n\};/);
    expect(block, 'FEED_SOURCES not found in api/worker.js').toBeTruthy();
    return Object.fromEntries(
      [...block![1].matchAll(/^\s*([A-Za-z_][\w]*):\s*'([^']+)'/gm)].map(m => [m[1], m[2]])
    );
  };

  it('no client code contacts a third-party feed proxy', () => {
    for (const rel of ['../services/liveDataService.ts', '../data/liveDataSources.ts']) {
      // Strip comments: both files explain the old behaviour by name.
      const code = read(rel)
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '');
      expect(code, `${rel} still calls a third-party proxy`).not.toContain('api.rss2json.com');
      expect(code, `${rel} still calls a third-party proxy`).not.toContain('api.allorigins.win');
    }
  });

  it('fetched headlines are never cached in browser storage', () => {
    // They would outlast the visit on the reader's device. The cache is in
    // memory; the Worker's edge cache makes refetches cheap.
    const code = read('../data/liveDataSources.ts')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    expect(code).not.toMatch(/localStorage|sessionStorage/);
  });

  it('both feed consumers call the same-origin endpoint', () => {
    expect(read('../services/liveDataService.ts')).toContain('/api/v1/feed?source=');
    expect(read('../data/liveDataSources.ts')).toContain('/api/v1/feed?source=');
  });

  it('the Worker resolves URLs from its allowlist, never from the caller', () => {
    const worker = read('../../api/worker.js');
    // The key is looked up in FEED_SOURCES; a caller-supplied URL would be an
    // open proxy and an SSRF hole.
    expect(worker).toContain("hasOwnProperty.call(FEED_SOURCES, source)");
    expect(worker).not.toMatch(/fetch\(\s*(?:url|request)\.searchParams\.get/);
  });

  it('every feed key the pages request is allowlisted in the Worker', () => {
    const allowlist = workerFeedSources();
    expect(Object.keys(allowlist).length).toBeGreaterThan(0);

    const serviceKeys = [
      ...read('../services/liveDataService.ts')
        .match(/const RSS_FEEDS: readonly string\[\] = \[([\s\S]*?)\];/)![1]
        .matchAll(/'([^']+)'/g),
    ].map(m => m[1]);

    const missing = serviceKeys.filter(k => !(k in allowlist));
    expect(missing, `Keys requested but not allowlisted: ${missing.join(', ')}`).toEqual([]);
  });

  it('live_data_feeds.json ids and urls match the Worker allowlist', () => {
    const allowlist = workerFeedSources();
    const feeds = JSON.parse(read('../data/live_data_feeds.json')) as Record<
      string,
      Array<{ id: string; url: string | null }>
    >;

    const problems: string[] = [];
    for (const group of Object.values(feeds)) {
      if (!Array.isArray(group)) continue;
      for (const feed of group) {
        if (!feed?.url) continue; // entries without a URL are not fetched
        if (!(feed.id in allowlist)) {
          problems.push(`${feed.id}: not in the Worker allowlist`);
        } else if (allowlist[feed.id] !== feed.url) {
          problems.push(`${feed.id}: ${feed.url} != worker's ${allowlist[feed.id]}`);
        }
      }
    }
    // The two lists disagreed about the URLs for the same outlets before the
    // Worker became the single source of truth. This keeps them in step.
    expect(problems, `Feed list drift:\n${problems.join('\n')}`).toEqual([]);
  });
});
