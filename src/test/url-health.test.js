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
function findFiles(dir, extensions) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === 'node_modules' || entry === 'test' || entry === '.git') continue;
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...findFiles(full, extensions));
    } else if (extensions.some(ext => entry.endsWith(ext))) {
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
});

describe('No CCP state media links in JSX source files', () => {
  const jsxFiles = findFiles(SRC_DIR, ['.jsx']);

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
});
