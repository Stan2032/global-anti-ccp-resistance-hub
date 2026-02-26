import { describe, it, expect } from 'vitest';
import sanctionsData from '../data/sanctions_tracker.json';
import { isCCPStateMedia } from '../utils/sourceLinks.js';

describe('Sanctions Tracker Data', () => {
  it('has valid metadata', () => {
    expect(sanctionsData.metadata).toBeDefined();
    expect(sanctionsData.metadata.title).toBe('Global Sanctions Tracker');
    expect(sanctionsData.metadata.last_verified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(sanctionsData.metadata.sources.length).toBeGreaterThan(0);
  });

  it('has law_links with valid URLs', () => {
    const laws = Object.entries(sanctionsData.law_links);
    expect(laws.length).toBeGreaterThan(0);
    laws.forEach(([name, url]) => {
      expect(url).toMatch(/^https:\/\//);
      expect(name).toBeTruthy();
    });
  });

  it('has sanctions entries with required fields', () => {
    const requiredFields = ['id', 'country', 'type', 'target', 'role', 'reason', 'date', 'law', 'status'];
    expect(sanctionsData.sanctions.length).toBeGreaterThanOrEqual(18);
    
    sanctionsData.sanctions.forEach(sanction => {
      requiredFields.forEach(field => {
        expect(sanction[field], `Sanction ${sanction.id} missing ${field}`).toBeDefined();
      });
    });
  });

  it('has valid dates in YYYY-MM-DD format', () => {
    sanctionsData.sanctions.forEach(sanction => {
      expect(sanction.date, `Sanction ${sanction.id} invalid date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  it('has unique IDs', () => {
    const ids = sanctionsData.sanctions.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has valid country codes', () => {
    const validCountries = ['us', 'uk', 'eu', 'canada', 'australia'];
    sanctionsData.sanctions.forEach(sanction => {
      expect(validCountries, `Invalid country: ${sanction.country}`).toContain(sanction.country);
    });
  });

  it('has valid sanction types', () => {
    const validTypes = ['individual', 'entity', 'trade', 'visa'];
    sanctionsData.sanctions.forEach(sanction => {
      expect(validTypes, `Invalid type: ${sanction.type}`).toContain(sanction.type);
    });
  });

  it('references only known laws', () => {
    const knownLaws = Object.keys(sanctionsData.law_links);
    sanctionsData.sanctions.forEach(sanction => {
      expect(knownLaws, `Unknown law: ${sanction.law} in sanction ${sanction.id}`).toContain(sanction.law);
    });
  });

  it('covers all 5 sanctioning countries', () => {
    const countries = new Set(sanctionsData.sanctions.map(s => s.country));
    expect(countries.has('us')).toBe(true);
    expect(countries.has('uk')).toBe(true);
    expect(countries.has('eu')).toBe(true);
    expect(countries.has('canada')).toBe(true);
    expect(countries.has('australia')).toBe(true);
  });

  it('does not cite CCP state media sources', () => {
    sanctionsData.metadata.sources.forEach(source => {
      expect(
        isCCPStateMedia(source),
        `Sanctions metadata cites CCP media: "${source}"`
      ).toBe(false);
    });
  });

  it('every entry has a source_url linking to government sanctions registry', () => {
    sanctionsData.sanctions.forEach(sanction => {
      expect(
        sanction.source_url,
        `Sanction ${sanction.id} (${sanction.target}) missing source_url`
      ).toBeDefined();
      expect(
        sanction.source_url.startsWith('https://'),
        `Sanction ${sanction.id} source_url not HTTPS: ${sanction.source_url}`
      ).toBe(true);
    });
  });

  it('source_urls point to government domains', () => {
    const validDomains = [
      'treasury.gov', 'cbp.gov', 'bis.gov', 'state.gov', // US
      'gov.uk',                                     // UK
      'sanctionsmap.eu',                            // EU
      'international.gc.ca', 'canada.ca',           // Canada
      'dfat.gov.au'                                 // Australia
    ];
    sanctionsData.sanctions.forEach(sanction => {
      const url = sanction.source_url;
      const matchesDomain = validDomains.some(d => url.includes(d));
      expect(
        matchesDomain,
        `Sanction ${sanction.id} source_url points to non-government domain: ${url}`
      ).toBe(true);
    });
  });

  describe('Cross-file consistency with sanctioned officials', () => {
    it('all individually sanctioned targets appear in sanctioned_officials_research.json', async () => {
      const { default: officialsData } = await import('../data/sanctioned_officials_research.json');
      const officialNames = new Set(
        officialsData.results.map(r => r.output.name.toLowerCase())
      );

      const individualSanctions = sanctionsData.sanctions.filter(s => s.type === 'individual');
      const missing = individualSanctions.filter(
        s => !officialNames.has(s.target.toLowerCase())
      );

      expect(
        missing.map(s => s.target),
        `Sanctioned individuals not in officials research: ${missing.map(s => s.target).join(', ')}`
      ).toEqual([]);
    });
  });
});
