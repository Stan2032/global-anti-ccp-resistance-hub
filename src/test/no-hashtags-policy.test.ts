import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';

/**
 * No-Hashtags Policy Enforcement Test
 *
 * User policy (Session 174): Hashtags are considered performative activism
 * and must NOT appear anywhere in the codebase (source files or data files).
 *
 * This test scans ALL TSX and TS source files, and JSON data files to ensure
 * no hashtag patterns (#FreeXxx, #StandWithXxx, etc.) are present.
 *
 * Allowed: CSS hex colors (#fff, #4afa82), JS comments (// #region), 
 * anchored IDs (#section), Markdown headings (# Title), and code comments.
 */

const SRC_DIR = resolve(__dirname, '..');
const DATA_DIR = resolve(SRC_DIR, 'data');

// Recursively find files
function findFiles(dir: string, extensions: string[]): string[] {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === 'node_modules' || entry === 'test') continue;
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...findFiles(full, extensions));
    } else if (extensions.some((ext: string) => entry.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

// Hashtag pattern: # followed by a CamelCase or multi-word tag (e.g. #FreeJoshuaWong, #StandWithHK)
// NOT matching: hex colors (#fff, #4afa82), anchored IDs (#section), single-word lowercase
const HASHTAG_PATTERN = /#(?:Free|Stand|Save|Stop|Support|Resist|Boycott|End|Protect|Justice|Remember|Solidarity|Fight)[A-Z]\w+/g;

describe('No-Hashtags Policy', () => {
  const jsxFiles = findFiles(SRC_DIR, ['.tsx', '.ts']).filter((f: string) => !f.includes('/test/'));
  const jsonFiles = readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

  it('finds source files to scan', () => {
    expect(jsxFiles.length).toBeGreaterThan(50);
    expect(jsonFiles.length).toBeGreaterThan(10);
  });

  it('no JSX/JS source files contain activist hashtags', () => {
    const violations = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const relativePath = filePath.replace(SRC_DIR + '/', '');
      const matches = content.match(HASHTAG_PATTERN);
      if (matches) {
        violations.push(`${relativePath}: ${matches.join(', ')}`);
      }
    }
    expect(violations,
      `Activist hashtags found in source files (policy: no hashtags — see Session 174):\n` +
      violations.join('\n')
    ).toEqual([]);
  });

  it('no JSON data files contain activist hashtags', () => {
    const violations = [];
    for (const fileName of jsonFiles) {
      const content = readFileSync(resolve(DATA_DIR, fileName), 'utf-8');
      const matches = content.match(HASHTAG_PATTERN);
      if (matches) {
        violations.push(`${fileName}: ${matches.join(', ')}`);
      }
    }
    expect(violations,
      `Activist hashtags found in data files (policy: no hashtags — see Session 174):\n` +
      violations.join('\n')
    ).toEqual([]);
  });

  it('no JSON data files contain hashtags field', () => {
    const violations = [];
    for (const fileName of jsonFiles) {
      const content = readFileSync(resolve(DATA_DIR, fileName), 'utf-8');
      if (/"hashtags?"/.test(content)) {
        violations.push(`${fileName}: contains "hashtags" field`);
      }
    }
    expect(violations,
      `"hashtags" field found in data files (should have been removed in Session 174):\n` +
      violations.join('\n')
    ).toEqual([]);
  });

  it('ShareButtons component has no hashtags prop', () => {
    const shareButtonsPath = resolve(SRC_DIR, 'components', 'ShareButtons.tsx');
    const content = readFileSync(shareButtonsPath, 'utf-8');
    expect(content).not.toMatch(/hashtags/i);
  });
});
