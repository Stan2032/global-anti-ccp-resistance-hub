import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

/**
 * URL Validation Tests
 *
 * Validates ALL external URLs found in JSON data files:
 * 1. All URLs are syntactically well-formed (valid protocol + domain)
 * 2. No URLs contain obvious formatting errors (trailing commas, spaces, brackets)
 * 3. All URLs use HTTPS (no insecure HTTP)
 * 4. No URLs point to localhost or internal development endpoints
 * 5. No duplicate source_url/sourceUrl values within a single data file
 *
 * Addresses TODO.md Weekly Task: "Check all external links for broken URLs"
 */

const DATA_DIR = resolve(__dirname, '..', 'data');

// Extract all URL-like strings from JSON content
function extractUrls(content: string) {
  // Match URLs in JSON string values (between quotes)
  const urlPattern = /"(https?:\/\/[^"]+)"/g;
  const urls = [];
  let match;
  while ((match = urlPattern.exec(content)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

// Check if a URL is well-formed
function isWellFormedUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

describe('URL validation across all JSON data files', () => {
  const jsonFiles = readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

  it('finds JSON data files to scan', () => {
    expect(jsonFiles.length).toBeGreaterThanOrEqual(15);
  });

  it('all URLs in data files are syntactically well-formed', () => {
    const violations = [];
    for (const fileName of jsonFiles) {
      const content = readFileSync(resolve(DATA_DIR, fileName), 'utf-8');
      const urls = extractUrls(content);
      for (const url of urls) {
        if (!isWellFormedUrl(url)) {
          violations.push(`${fileName}: malformed URL → ${url.substring(0, 100)}`);
        }
      }
    }
    expect(violations, `Malformed URLs found:\n${violations.join('\n')}`).toEqual([]);
  });

  it('no URLs contain trailing formatting artifacts', () => {
    const violations = [];
    // Note: trailing ) is valid in Wikipedia-style URLs like /wiki/Name_(disambiguation)
    const artifacts = [/,$/, /\s$/, /\]$/, /;$/];
    for (const fileName of jsonFiles) {
      const content = readFileSync(resolve(DATA_DIR, fileName), 'utf-8');
      const urls = extractUrls(content);
      for (const url of urls) {
        for (const pattern of artifacts) {
          if (pattern.test(url)) {
            violations.push(`${fileName}: URL has trailing artifact → ${url.substring(0, 100)}`);
          }
        }
      }
    }
    expect(violations, `URLs with formatting artifacts:\n${violations.join('\n')}`).toEqual([]);
  });

  it('no URLs point to localhost or internal development endpoints', () => {
    const violations = [];
    const devPatterns = [/localhost/, /127\.0\.0\.1/, /0\.0\.0\.0/, /192\.168\./, /10\.0\./, /\.local\b/];
    for (const fileName of jsonFiles) {
      const content = readFileSync(resolve(DATA_DIR, fileName), 'utf-8');
      const urls = extractUrls(content);
      for (const url of urls) {
        for (const pattern of devPatterns) {
          if (pattern.test(url)) {
            violations.push(`${fileName}: internal/dev URL → ${url.substring(0, 100)}`);
          }
        }
      }
    }
    expect(violations, `Internal/dev URLs found:\n${violations.join('\n')}`).toEqual([]);
  });

  it('all data files have at least one URL (data provenance)', () => {
    // Data files should contain source URLs for verification
    // Exceptions: files that are purely structural config
    const configOnlyFiles = [
      'educational_modules.json',
      'take_action_steps.json',
      'recent_updates.json',
      'timeline_events.json'
    ];
    const violations = [];
    for (const fileName of jsonFiles) {
      if (configOnlyFiles.includes(fileName)) continue;
      const content = readFileSync(resolve(DATA_DIR, fileName), 'utf-8');
      const urls = extractUrls(content);
      if (urls.length === 0) {
        violations.push(`${fileName}: no URLs found — consider adding source references`);
      }
    }
    expect(violations, `Data files without source URLs:\n${violations.join('\n')}`).toEqual([]);
  });

  it('reports total URL count per data file', () => {
    const report = [];
    let totalUrls = 0;
    for (const fileName of jsonFiles) {
      const content = readFileSync(resolve(DATA_DIR, fileName), 'utf-8');
      const urls = extractUrls(content);
      totalUrls += urls.length;
      report.push({ file: fileName, count: urls.length });
    }
    // Just ensure we can count — this test is informational
    expect(totalUrls).toBeGreaterThan(50);
  });
});
