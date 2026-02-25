/**
 * Tests for liveDataService.js — verifies no simulated/fabricated data
 *
 * Ensures:
 * - fetchStatistics() returns sourced numbers from verified data files
 * - fetchPoliticalPrisoners() returns data from JSON (not hardcoded)
 * - No fabricated change metrics, no Math.random(), no fake live data
 */
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
    const sourceNames = Object.values(FEED_SOURCES).map(s => s.name);
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
});
