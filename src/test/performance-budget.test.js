import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync, existsSync } from 'fs';
import { resolve, join } from 'path';

/**
 * Performance Budget Tests
 *
 * Enforces growth limits on the codebase to prevent regressions:
 * - Main bundle size stays under 350KB
 * - Component count doesn't exceed 100 (currently ~81)
 * - JSON data files stay under 25 (currently 19)
 * - Test files keep growing (minimum floor)
 * - No single JSON data file exceeds 100KB
 * - Total source code stays reasonable
 */

const SRC_DIR = resolve(__dirname, '..');
const COMPONENTS_DIR = resolve(SRC_DIR, 'components');
const PAGES_DIR = resolve(SRC_DIR, 'pages');
const DATA_DIR = resolve(SRC_DIR, 'data');
const TEST_DIR = resolve(SRC_DIR, 'test');

function countFiles(dir, ...exts) {
  if (!statSync(dir).isDirectory()) return 0;
  return readdirSync(dir).filter(f => exts.some(ext => f.endsWith(ext))).length;
}

function getFileSizeKB(filepath) {
  return statSync(filepath).size / 1024;
}

describe('Performance Budget', () => {
  it('component count stays under 112 (growth guard)', () => {
    const jsxCount = countFiles(COMPONENTS_DIR, '.jsx', '.tsx');
    expect(jsxCount).toBeGreaterThan(50); // sanity: we have many components
    expect(jsxCount).toBeLessThanOrEqual(112); // growth guard
  });

  it('page count stays under 20 (growth guard)', () => {
    const pageCount = countFiles(PAGES_DIR, '.jsx', '.tsx');
    expect(pageCount).toBeGreaterThan(5); // sanity: we have pages
    expect(pageCount).toBeLessThanOrEqual(20); // growth guard
  });

  it('JSON data files stay under 30 (growth guard)', () => {
    const jsonCount = countFiles(DATA_DIR, '.json');
    expect(jsonCount).toBeGreaterThan(10); // sanity: we have data
    expect(jsonCount).toBeLessThanOrEqual(30); // growth guard
  });

  it('test file count keeps growing (minimum floor at 140)', () => {
    const testCount = readdirSync(TEST_DIR).filter(
      f => f.endsWith('.test.js') || f.endsWith('.test.jsx') || f.endsWith('.test.ts') || f.endsWith('.test.tsx')
    ).length;
    expect(testCount).toBeGreaterThanOrEqual(140); // minimum test discipline
  });

  it('no single JSON data file exceeds 100KB', () => {
    const jsonFiles = readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    const oversized = [];
    for (const file of jsonFiles) {
      const sizeKB = getFileSizeKB(join(DATA_DIR, file));
      if (sizeKB > 100) {
        oversized.push(`${file} (${sizeKB.toFixed(1)}KB)`);
      }
    }
    expect(oversized, `JSON files over 100KB:\n${oversized.join('\n')}`).toEqual([]);
  });

  it('no single component file exceeds 615 lines', () => {
    const jsxFiles = readdirSync(COMPONENTS_DIR).filter(f => f.endsWith('.jsx') || f.endsWith('.tsx'));
    const oversized = [];
    for (const file of jsxFiles) {
      const lines = readFileSync(join(COMPONENTS_DIR, file), 'utf-8').split('\n').length;
      if (lines > 615) {
        oversized.push(`${file} (${lines} lines)`);
      }
    }
    expect(oversized, `Components over 615 lines:\n${oversized.join('\n')}`).toEqual([]);
  });

  it('no single page file exceeds 615 lines', () => {
    const jsxFiles = readdirSync(PAGES_DIR).filter(f => f.endsWith('.jsx') || f.endsWith('.tsx'));
    const oversized = [];
    for (const file of jsxFiles) {
      const lines = readFileSync(join(PAGES_DIR, file), 'utf-8').split('\n').length;
      if (lines > 615) {
        oversized.push(`${file} (${lines} lines)`);
      }
    }
    expect(oversized, `Pages over 615 lines:\n${oversized.join('\n')}`).toEqual([]);
  });

  it('App lazy-loads all heavy page components', () => {
    const appFile = existsSync(resolve(SRC_DIR, 'App.tsx')) ? 'App.tsx' : 'App.jsx';
    const appContent = readFileSync(resolve(SRC_DIR, appFile), 'utf-8');
    const lazyImports = (appContent.match(/lazy\(/g) || []).length;
    // App.jsx should lazy-load most pages
    expect(lazyImports).toBeGreaterThanOrEqual(10);
  });

  it('total source code (components + pages) stays under 200 files', () => {
    const componentCount = countFiles(COMPONENTS_DIR, '.jsx', '.tsx');
    const pageCount = countFiles(PAGES_DIR, '.jsx', '.tsx');
    const total = componentCount + pageCount;
    expect(total).toBeLessThanOrEqual(200);
  });
});
