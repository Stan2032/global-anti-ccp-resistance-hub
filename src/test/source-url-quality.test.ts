import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Source URL Quality & Specificity Tests
 *
 * "The map is not the territory" — a URL is a pointer to evidence, not the evidence itself.
 * These tests ensure our source URLs are specific, diverse, and actionable:
 * 1. URLs point to specific articles/pages, not just homepages
 * 2. No single source dominates (prevents single-point-of-failure)
 * 3. Source URLs are unique per record (no copy-paste)
 * 4. URLs use reputable domains from known Tier 1-2 sources
 */

const DATA_DIR = resolve(__dirname, '../data');

interface PrisonerOutput {
  prisoner_name: string;
  source_url: string;
  status: string;
  confidence: string;
}

interface PrisonerResult {
  output: PrisonerOutput;
}

interface PrisonersData {
  results: PrisonerResult[];
}

interface SanctionEntry {
  id: string;
  target: string;
  country: string;
  source_url: string;
}

interface SanctionsData {
  sanctions: SanctionEntry[];
  metadata: { last_verified: string };
}

// Tier 1-2 human rights source domains (verified reputable organizations)
const TRUSTED_HR_DOMAINS = [
  'hrw.org', 'amnesty.org', 'bbc.com', 'reuters.com', 'theguardian.com',
  'apnews.com', 'aljazeera.com', 'hongkongfp.com', 'rfa.org', 'voanews.com',
  'pen-international.org', 'pen.org', 'frontlinedefenders.org',
  'ohchr.org', 'house.gov', 'duihua.org', 'pillarcatholic.com',
  'savetibet.org', 'thestandard.com.hk', 'chinaaid.org',
  'article19.org', 'hongkongwatch.org', 'southmongolia.org',
  'rsf.org', 'nchrd.org', 'cecc.gov',
  // Legal and professional organizations
  'ibanet.org',
  // Regional news and research
  'aninews.in', 'thechinaproject.com', 'artnet.com', 'news.artnet.com',
  'npr.org', 'kunm.org',
  // Tibet-specific
  'tibetwatch.org',
  // HK labor rights
  'hklabourrights.org',
  // Reference (acceptable for lesser-known figures)
  'wikipedia.org',
];

// Government sanctions domains
const TRUSTED_GOV_DOMAINS = [
  'treasury.gov', 'cbp.gov', 'bis.gov', 'state.gov',
  'gov.uk', 'eur-lex.europa.eu', 'sanctionsmap.eu',
  'international.gc.ca', 'canada.ca', 'dfat.gov.au',
];

describe('Political Prisoners source URL quality', () => {
  let data: PrisonersData;

  it('loads political prisoners data', () => {
    data = JSON.parse(readFileSync(resolve(DATA_DIR, 'political_prisoners_research.json'), 'utf-8'));
    expect(data.results.length).toBeGreaterThanOrEqual(50);
  });

  it('all source URLs point to specific pages (not homepages)', () => {
    const violations: string[] = [];
    for (const entry of data.results) {
      const url = entry.output.source_url;
      try {
        const parsed = new URL(url);
        if ((!parsed.pathname || parsed.pathname === '/') && !parsed.search) {
          violations.push(`${entry.output.prisoner_name}: homepage-only URL: ${url}`);
        }
      } catch {
        violations.push(`${entry.output.prisoner_name}: invalid URL: ${url}`);
      }
    }
    expect(violations, `Homepage-only source URLs:\n${violations.join('\n')}`).toEqual([]);
  });

  it('source URLs come from known Tier 1-2 human rights sources', () => {
    const violations: string[] = [];
    for (const entry of data.results) {
      const url = entry.output.source_url;
      try {
        const hostname = new URL(url).hostname;
        const isTrusted = TRUSTED_HR_DOMAINS.some(d => hostname.includes(d));
        if (!isTrusted) {
          violations.push(`${entry.output.prisoner_name}: untrusted domain ${hostname} — ${url}`);
        }
      } catch {
        violations.push(`${entry.output.prisoner_name}: invalid URL: ${url}`);
      }
    }
    expect(violations, `Untrusted source domains:\n${violations.join('\n')}`).toEqual([]);
  });

  it('no two prisoners share the exact same source URL (unless co-defendants)', () => {
    // Co-defendants in the same trial may legitimately share a source URL
    const KNOWN_CO_DEFENDANT_URLS = new Set([
      // HK Alliance subversion trial: Chow Hang-tung, Albert Ho
      'https://www.amnesty.org/en/latest/news/2026/01/hong-kong-trial-of-tiananmen-activists-a-cynical-attempt-to-erase-historical-memory/',
    ]);
    const urlMap = new Map<string, string[]>();
    for (const entry of data.results) {
      const url = entry.output.source_url;
      if (KNOWN_CO_DEFENDANT_URLS.has(url)) continue;
      const existing = urlMap.get(url) || [];
      existing.push(entry.output.prisoner_name);
      urlMap.set(url, existing);
    }
    const duplicates: string[] = [];
    for (const [url, names] of urlMap) {
      if (names.length > 1) {
        duplicates.push(`${names.join(', ')} share URL: ${url}`);
      }
    }
    expect(duplicates, `Duplicate source URLs:\n${duplicates.join('\n')}`).toEqual([]);
  });

  it('source diversity: no single domain accounts for >40% of sources', () => {
    const domainCounts = new Map<string, number>();
    for (const entry of data.results) {
      try {
        const hostname = new URL(entry.output.source_url).hostname;
        domainCounts.set(hostname, (domainCounts.get(hostname) || 0) + 1);
      } catch {
        // Skip invalid
      }
    }
    const total = data.results.length;
    for (const [domain, count] of domainCounts) {
      const pct = (count / total) * 100;
      expect(
        pct,
        `Domain ${domain} accounts for ${pct.toFixed(0)}% of sources (${count}/${total}) — diversify`
      ).toBeLessThanOrEqual(40);
    }
  });
});

describe('Sanctions Tracker source URL quality', () => {
  let data: SanctionsData;

  it('loads sanctions data', () => {
    data = JSON.parse(readFileSync(resolve(DATA_DIR, 'sanctions_tracker.json'), 'utf-8'));
    expect(data.sanctions.length).toBeGreaterThanOrEqual(40);
  });

  it('all source URLs point to government domains', () => {
    const violations: string[] = [];
    for (const s of data.sanctions) {
      try {
        const hostname = new URL(s.source_url).hostname;
        const isGov = TRUSTED_GOV_DOMAINS.some(d => hostname.includes(d));
        if (!isGov) {
          violations.push(`${s.id} (${s.target}): non-government domain ${hostname}`);
        }
      } catch {
        violations.push(`${s.id}: invalid URL: ${s.source_url}`);
      }
    }
    expect(violations, `Non-government sanctions URLs:\n${violations.join('\n')}`).toEqual([]);
  });

  it('sanctions from each country use correct government URL', () => {
    const countryDomains: Record<string, string[]> = {
      'US': ['treasury.gov', 'cbp.gov', 'bis.gov', 'state.gov'],
      'UK': ['gov.uk'],
      'EU': ['eur-lex.europa.eu', 'sanctionsmap.eu'],
      'Canada': ['international.gc.ca', 'canada.ca'],
      'Australia': ['dfat.gov.au'],
    };
    const violations: string[] = [];
    for (const s of data.sanctions) {
      const allowedDomains = countryDomains[s.country];
      if (!allowedDomains) continue; // Skip countries without domain rules
      try {
        const hostname = new URL(s.source_url).hostname;
        const matchesCountry = allowedDomains.some(d => hostname.includes(d));
        if (!matchesCountry) {
          violations.push(`${s.id}: ${s.country} sanction uses wrong domain ${hostname}`);
        }
      } catch {
        violations.push(`${s.id}: invalid URL`);
      }
    }
    expect(violations, `Country-domain mismatches:\n${violations.join('\n')}`).toEqual([]);
  });

  it('sanctions grouped by country use consistent URL patterns', () => {
    // Same-country sanctions should ideally point to the same canonical source
    const countryUrls = new Map<string, Set<string>>();
    for (const s of data.sanctions) {
      if (!countryUrls.has(s.country)) countryUrls.set(s.country, new Set());
      try {
        const hostname = new URL(s.source_url).hostname;
        countryUrls.get(s.country)!.add(hostname);
      } catch {
        // Skip
      }
    }
    // Each country should use at most 4 different government domains
    // (US uses treasury.gov, cbp.gov, bis.gov, state.gov for different sanction types)
    for (const [country, domains] of countryUrls) {
      expect(
        domains.size,
        `${country} sanctions use ${domains.size} different domains: ${[...domains].join(', ')} — consider consolidating`
      ).toBeLessThanOrEqual(4);
    }
  });
});

describe('Timeline Events source URL quality', () => {
  interface TimelineEvent {
    title: string;
    date: string;
    source_urls?: Record<string, string>;
  }

  let events: TimelineEvent[];

  it('loads timeline data', () => {
    events = JSON.parse(readFileSync(resolve(DATA_DIR, 'timeline_events.json'), 'utf-8'));
    expect(events.length).toBeGreaterThanOrEqual(30);
  });

  it('events with source_urls have at least one valid URL', () => {
    const violations: string[] = [];
    for (const event of events) {
      if (event.source_urls) {
        const urls = Object.values(event.source_urls);
        if (urls.length === 0) {
          violations.push(`"${event.title}": empty source_urls object`);
          continue;
        }
        for (const url of urls) {
          if (!url.startsWith('https://')) {
            violations.push(`"${event.title}": non-HTTPS source URL: ${url}`);
          }
        }
      }
    }
    expect(violations, `Timeline source URL issues:\n${violations.join('\n')}`).toEqual([]);
  });

  it('source_urls point to specific articles (not homepages)', () => {
    const violations: string[] = [];
    for (const event of events) {
      if (!event.source_urls) continue;
      for (const [source, url] of Object.entries(event.source_urls)) {
        try {
          const parsed = new URL(url);
          if ((!parsed.pathname || parsed.pathname === '/') && !parsed.search) {
            violations.push(`"${event.title}" [${source}]: homepage-only URL: ${url}`);
          }
        } catch {
          violations.push(`"${event.title}" [${source}]: invalid URL: ${url}`);
        }
      }
    }
    expect(violations, `Homepage-only timeline URLs:\n${violations.join('\n')}`).toEqual([]);
  });
});
