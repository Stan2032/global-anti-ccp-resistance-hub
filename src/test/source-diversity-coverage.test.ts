/**
 * Source diversity and geographic coverage tests
 *
 * Validates that data sources span multiple news organizations,
 * geographic regions, and time periods — preventing over-reliance
 * on any single outlet or perspective.
 */
import { describe, it, expect } from 'vitest';
import prisonersData from '../data/political_prisoners_research.json';
import sanctionsData from '../data/sanctions_tracker.json';
import timelineData from '../data/timeline_events.json';
import casesData from '../data/legal_cases_research.json';

interface PrisonerResult {
  output: { source_url: string; prisoner_name: string; location: string };
  error?: string;
}

interface SanctionsFile {
  sanctions: { source_url: string; country: string; target: string }[];
}

interface TimelineEvent {
  source_urls?: Record<string, string> | string[];
  sources?: string[];
  category: string;
}

interface CaseResult {
  output: { source_url: string; jurisdiction: string; case_name: string };
  error: string;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

describe('Source Diversity', () => {
  describe('Political Prisoners', () => {
    const records = (prisonersData as { results: PrisonerResult[] }).results.filter(r => !r.error);

    it('sources span at least 5 different domains', () => {
      const domains = new Set(records.map(r => extractDomain(r.output.source_url)));
      expect(domains.size, `Only ${domains.size} unique source domains found`).toBeGreaterThanOrEqual(5);
    });

    it('no single domain accounts for >50% of sources', () => {
      const domainCounts: Record<string, number> = {};
      for (const r of records) {
        const domain = extractDomain(r.output.source_url);
        domainCounts[domain] = (domainCounts[domain] || 0) + 1;
      }
      const total = records.length;
      const violations: string[] = [];
      for (const [domain, count] of Object.entries(domainCounts)) {
        const pct = (count / total) * 100;
        if (pct > 50) {
          violations.push(`${domain}: ${count}/${total} (${pct.toFixed(1)}%)`);
        }
      }
      expect(violations, `Over-represented domains:\n${violations.join('\n')}`).toEqual([]);
    });

    it('covers multiple geographic regions', () => {
      const locations = new Set(records.map(r => r.output.location.toLowerCase()));
      const hasHK = [...locations].some(l => l.includes('hong kong'));
      const hasXJ = [...locations].some(l => l.includes('xinjiang') || l.includes('uyghur'));
      const hasTibet = [...locations].some(l => l.includes('tibet'));
      expect(hasHK, 'Should have Hong Kong prisoners').toBe(true);
      expect(hasXJ, 'Should have Xinjiang/Uyghur prisoners').toBe(true);
      expect(hasTibet, 'Should have Tibet prisoners').toBe(true);
    });
  });

  describe('Sanctions Tracker', () => {
    const sanctions = (sanctionsData as SanctionsFile).sanctions;

    it('sanctions span at least 4 issuing countries', () => {
      const countries = new Set(sanctions.map(s => s.country.toLowerCase()));
      expect(countries.size, `Only ${countries.size} countries found`).toBeGreaterThanOrEqual(4);
    });

    it('sources span at least 3 different domains', () => {
      const domains = new Set(sanctions.map(s => extractDomain(s.source_url)));
      expect(domains.size, `Only ${domains.size} unique source domains`).toBeGreaterThanOrEqual(3);
    });

    it('includes both individual and entity sanctions', () => {
      // Pattern heuristic: entity targets typically contain organizational words
      const entityKeywords = ['PSB', 'Bureau', 'Corps', 'Department', 'Committee', 'Office'];
      const entities = sanctions.filter(s =>
        s.target && entityKeywords.some(kw => s.target.includes(kw))
      );
      const individuals = sanctions.filter(s =>
        s.target && !entityKeywords.some(kw => s.target.includes(kw))
      );
      expect(individuals.length, 'Should have individual sanctions targets').toBeGreaterThan(0);
      expect(entities.length, 'Should have entity sanctions targets').toBeGreaterThan(0);
    });
  });

  describe('Timeline Events', () => {
    const events = timelineData as TimelineEvent[];

    it('covers multiple event categories', () => {
      const categories = new Set(events.map(e => e.category));
      expect(categories.size, `Only ${categories.size} categories`).toBeGreaterThanOrEqual(4);
    });

    it('events with source_urls have diverse domains', () => {
      const allUrls: string[] = [];
      for (const e of events) {
        if (e.source_urls && typeof e.source_urls === 'object') {
          const urls = Array.isArray(e.source_urls)
            ? e.source_urls as string[]
            : Object.values(e.source_urls as Record<string, string>);
          for (const u of urls) {
            if (typeof u === 'string') allUrls.push(u);
          }
        }
      }
      if (allUrls.length > 0) {
        const domains = new Set(allUrls.map(u => extractDomain(u)));
        expect(domains.size, `Only ${domains.size} unique domains across timeline source_urls`).toBeGreaterThanOrEqual(5);
      }
    });
  });

  describe('Legal Cases', () => {
    const cases = (casesData as { results: CaseResult[] }).results.filter(r => !r.error);

    it('sources span at least 4 different domains', () => {
      const domains = new Set(cases.map(c => extractDomain(c.output.source_url)));
      expect(domains.size, `Only ${domains.size} unique source domains`).toBeGreaterThanOrEqual(4);
    });

    it('covers at least 5 jurisdictions', () => {
      const jurisdictions = new Set(cases.map(c => c.output.jurisdiction));
      expect(jurisdictions.size, `Only ${jurisdictions.size} jurisdictions`).toBeGreaterThanOrEqual(5);
    });

    it('includes both criminal and legislative/tribunal cases', () => {
      // Pattern heuristic: criminal cases typically use "v." or "HKSAR"; legislative cases use "Motion", "Resolution", etc.
      const criminalKeywords = ['v.', 'HKSAR'];
      const legislativeKeywords = ['Motion', 'Tribunal', 'Resolution', 'UFLPA', 'Parliament', 'Assembly'];
      const criminal = cases.filter(c =>
        criminalKeywords.some(kw => c.output.case_name.includes(kw))
      );
      const legislative = cases.filter(c =>
        legislativeKeywords.some(kw => c.output.case_name.includes(kw))
      );
      expect(criminal.length, 'Should have criminal cases').toBeGreaterThan(0);
      expect(legislative.length, 'Should have legislative/tribunal cases').toBeGreaterThan(0);
    });
  });
});
