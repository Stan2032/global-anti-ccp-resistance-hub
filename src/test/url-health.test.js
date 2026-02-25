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
 * 3. No data files contain HTTP-only URLs
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

  describe('no CCP state media domains in data files', () => {
    for (const fileName of jsonFiles) {
      it(`${fileName} contains no CCP state media domains`, () => {
        const content = readFileSync(resolve(DATA_DIR, fileName), 'utf-8');
        for (const domain of CCP_DOMAINS) {
          const escaped = domain.replace(/\./g, '\\.');
          const regex = new RegExp(`https?://[^"'\\s]*${escaped}`, 'gi');
          const matches = content.match(regex);
          expect(matches, `Found CCP domain ${domain} in ${fileName}: ${matches}`).toBeNull();
        }
      });
    }
  });

  describe('all URLs in data files use HTTPS', () => {
    for (const fileName of jsonFiles) {
      it(`${fileName} has no HTTP-only URLs`, () => {
        const content = readFileSync(resolve(DATA_DIR, fileName), 'utf-8');
        // Match "http://" that's NOT "https://"
        const httpOnlyRegex = /"http:\/\/[^"]+"/g;
        const matches = content.match(httpOnlyRegex);
        expect(matches, `Found HTTP-only URLs in ${fileName}: ${matches}`).toBeNull();
      });
    }
  });
});

describe('No CCP state media links in JSX source files', () => {
  const jsxFiles = findFiles(SRC_DIR, ['.jsx']);

  it('finds JSX files to scan', () => {
    expect(jsxFiles.length).toBeGreaterThan(50);
  });

  for (const filePath of jsxFiles) {
    const relativePath = filePath.replace(SRC_DIR + '/', '');
    it(`${relativePath} contains no CCP state media links`, () => {
      const content = readFileSync(filePath, 'utf-8');
      for (const domain of CCP_DOMAINS) {
        const escaped = domain.replace(/\./g, '\\.');
        // Only check href/url/src attributes and string literals, not comments
        const regex = new RegExp(`(?:href|url|src).*${escaped}`, 'gi');
        const matches = content.match(regex);
        expect(matches, `Found CCP domain ${domain} link in ${relativePath}: ${matches}`).toBeNull();
      }
    });
  }
});
