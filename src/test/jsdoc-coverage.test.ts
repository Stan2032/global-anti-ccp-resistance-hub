/**
 * JSDoc Coverage Enforcement Test
 *
 * Ensures all component and page files start with a JSDoc comment.
 * Prevents undocumented components from being merged.
 *
 * @module jsdoc-coverage.test
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { resolve, join, relative, basename } from 'path';

const SRC_DIR = resolve(__dirname, '..');
const COMPONENTS_DIR = join(SRC_DIR, 'components');
const PAGES_DIR = join(SRC_DIR, 'pages');
const PROFILES_DIR = join(SRC_DIR, 'pages', 'profiles');

function getTsxFiles(dir: string): string[] {
  if (!statSync(dir).isDirectory()) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith('.tsx') && !f.endsWith('.test.tsx'))
    .map(f => join(dir, f));
}

describe('JSDoc documentation coverage', () => {
  const componentFiles = getTsxFiles(COMPONENTS_DIR);
  const pageFiles = getTsxFiles(PAGES_DIR);
  const profileFiles = getTsxFiles(PROFILES_DIR);
  const allFiles = [...componentFiles, ...pageFiles, ...profileFiles];

  it('found component and page files to check', () => {
    expect(allFiles.length).toBeGreaterThanOrEqual(100);
  });

  it('all components have JSDoc comments', () => {
    const missing: string[] = [];
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      // Check first 500 chars for a JSDoc comment (before imports)
      const head = content.slice(0, 500);
      if (!head.includes('/**')) {
        missing.push(relative(SRC_DIR, file));
      }
    }
    expect(missing, `Components missing JSDoc:\n${missing.join('\n')}`).toEqual([]);
  });

  it('all page files have JSDoc comments', () => {
    const missing: string[] = [];
    for (const file of [...pageFiles, ...profileFiles]) {
      const content = readFileSync(file, 'utf-8');
      const head = content.slice(0, 500);
      if (!head.includes('/**')) {
        missing.push(relative(SRC_DIR, file));
      }
    }
    expect(missing, `Pages missing JSDoc:\n${missing.join('\n')}`).toEqual([]);
  });

  it('JSDoc comments include @module tag', () => {
    const missing: string[] = [];
    for (const file of allFiles) {
      const content = readFileSync(file, 'utf-8');
      const head = content.slice(0, 500);
      if (head.includes('/**') && !head.includes('@module')) {
        missing.push(relative(SRC_DIR, file));
      }
    }
    // Allow some flexibility — not all JSDoc needs @module
    // but at least 90% should have it
    const coverage = ((allFiles.length - missing.length) / allFiles.length) * 100;
    expect(coverage).toBeGreaterThanOrEqual(90);
  });

  it('no component files start with bare import (no documentation)', () => {
    const bareImports: string[] = [];
    for (const file of allFiles) {
      const content = readFileSync(file, 'utf-8').trimStart();
      // If the first non-whitespace content is an import statement, it's undocumented
      if (content.startsWith('import ')) {
        bareImports.push(basename(file));
      }
    }
    expect(bareImports, `Files starting with bare import (add JSDoc first):\n${bareImports.join('\n')}`).toEqual([]);
  });
});
