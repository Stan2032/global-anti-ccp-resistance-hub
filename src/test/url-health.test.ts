import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';
import { CCP_NEVER_CITE } from '../utils/sourceLinks';

/**
 * URL Health & CCP Source Exclusion Tests
 *
 * Scans ALL source files and data files to ensure:
 * 1. No CCP state media domains are used as sources
 * 2. All external URLs use HTTPS
 *
 * Runs in bulk — violations are reported with exact file + match.
 */

const SRC_DIR = resolve(__dirname, '..');
const DATA_DIR = resolve(SRC_DIR, 'data');

// CCP domains from the centralized registry
const CCP_DOMAINS = CCP_NEVER_CITE.domains;

// Recursively find all source files
function findFiles(dir: string, extensions: string[]): string[] {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === 'node_modules' || entry === 'test' || entry === '.git') continue;
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...findFiles(full, extensions));
    } else if (extensions.some((ext: string) => entry.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

describe('URL health across all data files', () => {
  const jsonFiles = readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

  it('finds JSON data files to scan', () => {
    expect(jsonFiles.length).toBeGreaterThanOrEqual(10);
  });

  it('no data file contains CCP state media domain URLs', () => {
    const violations = [];
    for (const fileName of jsonFiles) {
      const content = readFileSync(resolve(DATA_DIR, fileName), 'utf-8');
      for (const domain of CCP_DOMAINS) {
        const escaped = domain.replace(/\./g, '\\.');
        const regex = new RegExp(`https?://[^"'\\s]*${escaped}`, 'gi');
        const matches = content.match(regex);
        if (matches) {
          violations.push(`${fileName}: ${domain} → ${matches.join(', ')}`);
        }
      }
    }
    expect(violations, `CCP domains found in data files:\n${violations.join('\n')}`).toEqual([]);
  });

  it('no data file contains HTTP-only URLs (all must be HTTPS)', () => {
    const violations = [];
    for (const fileName of jsonFiles) {
      const content = readFileSync(resolve(DATA_DIR, fileName), 'utf-8');
      const httpOnlyRegex = /"http:\/\/[^"]+"/g;
      const matches = content.match(httpOnlyRegex);
      if (matches) {
        violations.push(`${fileName}: ${matches.join(', ')}`);
      }
    }
    expect(violations, `HTTP-only URLs found:\n${violations.join('\n')}`).toEqual([]);
  });
  it('source_url fields point to specific pages, not just homepages', () => {
    // "The map is not the territory" — a homepage URL is not a source citation.
    // Every source_url should point to a specific article, document, or record.
    const violations: string[] = [];
    const keyFiles = [
      'sanctions_tracker.json',
      'political_prisoners_research.json',
      'timeline_events.json',
    ];

    for (const fileName of keyFiles) {
      const content = readFileSync(resolve(DATA_DIR, fileName), 'utf-8');
      const data = JSON.parse(content);

      // Extract source_url values from any structure
      const urls: Array<{ name: string; url: string }> = [];

      if (data.sanctions) {
        for (const s of data.sanctions) {
          if (s.source_url) urls.push({ name: `${fileName}:${s.target}`, url: s.source_url });
        }
      }
      if (data.results) {
        for (const r of data.results) {
          const output = r.output || r;
          if (output.source_url) urls.push({ name: `${fileName}:${output.prisoner_name || output.name || 'entry'}`, url: output.source_url });
        }
      }
      if (Array.isArray(data)) {
        for (const item of data) {
          if (item.source_urls && typeof item.source_urls === 'object') {
            for (const url of Object.values(item.source_urls) as string[]) {
              urls.push({ name: `${fileName}:${item.title || 'event'}`, url });
            }
          }
        }
      }

      for (const { name, url } of urls) {
        try {
          const parsed = new URL(url);
          // Check if path is empty or just "/"
          if (!parsed.pathname || parsed.pathname === '/') {
            // Allow if there are query parameters (e.g., eur-lex URLs use query strings)
            if (!parsed.search) {
              violations.push(`${name}: homepage-only URL: ${url}`);
            }
          }
        } catch {
          violations.push(`${name}: invalid URL: ${url}`);
        }
      }
    }

    expect(violations, `Homepage-only source URLs found:\n${violations.join('\n')}`).toEqual([]);
  });
});

describe('No CCP state media links in TSX source files', () => {
  const jsxFiles = findFiles(SRC_DIR, ['.tsx']);

  it('finds JSX files to scan', () => {
    expect(jsxFiles.length).toBeGreaterThan(50);
  });

  it('no JSX file contains CCP state media links in href/url/src attributes', () => {
    const violations = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const relativePath = filePath.replace(SRC_DIR + '/', '');
      for (const domain of CCP_DOMAINS) {
        const escaped = domain.replace(/\./g, '\\.');
        const regex = new RegExp(`(?:href|url|src).*${escaped}`, 'gi');
        const matches = content.match(regex);
        if (matches) {
          violations.push(`${relativePath}: ${domain} → ${matches[0].substring(0, 80)}`);
        }
      }
    }
    expect(violations, `CCP domain links found in JSX:\n${violations.join('\n')}`).toEqual([]);
  });

  it('does not use "CPC" terminology (CCP rebranding)', () => {
    // The CCP promotes "CPC" (Communist Party of China) to dilute search results
    // that surface critical journalism. This project uses "CCP" consistently.
    const violations = [];
    const dataJsonFiles = readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    const allFiles = [
      ...jsxFiles,
      ...dataJsonFiles.map(f => resolve(DATA_DIR, f))
    ];
    for (const filePath of allFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const relativePath = filePath.replace(SRC_DIR + '/', '');
      const matches = content.match(/\bCPC\b/g);
      if (matches) {
        violations.push(`${relativePath}: ${matches.length} instance(s) of "CPC" — use "CCP" instead`);
      }
    }
    expect(violations, `"CPC" found (use "CCP"):\n${violations.join('\n')}`).toEqual([]);
  });
});
