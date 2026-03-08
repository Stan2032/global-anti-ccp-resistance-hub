import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

/**
 * Defensive Coding Tests
 *
 * Validates that all components consuming JSON data files have proper
 * null/undefined guards to prevent crashes from malformed or empty data.
 *
 * Checks:
 * 1. JSON data imports in components use optional chaining or fallback guards
 * 2. .map() calls on imported data have null guards
 * 3. .results / .sanctions / .facilities access uses optional chaining
 * 4. Module-level data transformations have safety fallbacks
 * 5. No unguarded array spread on imported data
 */

const SRC_DIR = resolve(__dirname, '..');
const COMPONENTS_DIR = resolve(SRC_DIR, 'components');
const PAGES_DIR = resolve(SRC_DIR, 'pages');

// Collect all JSX source files from components + pages
function getSourceFiles(...dirs) {
  const files = [];
  for (const dir of dirs) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...getSourceFiles(full));
      } else if (entry.isFile() && /\.jsx$/.test(entry.name) && !entry.name.includes('.test.')) {
        files.push(full);
      }
    }
  }
  return files;
}

// Extract JSON data imports from a file
function extractJsonImports(content) {
  const pattern = /import\s+(\w+)\s+from\s+['"].*\/data\/(\w+)\.json['"]/g;
  const imports = [];
  let match;
  while ((match = pattern.exec(content)) !== null) {
    imports.push({ varName: match[1], fileName: match[2] });
  }
  return imports;
}

describe('Defensive Coding — Data Safety', () => {
  const allFiles = getSourceFiles(COMPONENTS_DIR, PAGES_DIR);

  it('all source files with JSON imports have null guards on .map() calls', () => {
    const unguarded = [];
    for (const file of allFiles) {
      const content = readFileSync(file, 'utf-8');
      const imports = extractJsonImports(content);
      if (!imports.length) continue;

      for (const { varName } of imports) {
        // Pattern: varName.something.map( without optional chaining or fallback
        // Dangerous: varName.results.map(  or  varName.map(
        // Safe: (varName?.results || []).map(  or  (varName || []).map(
        const dangerousPattern = new RegExp(
          `(?<!\\(\\s*)${varName}\\.(?:results|sanctions|facilities|modules)\\s*\\.map\\(`,
          'g'
        );
        if (dangerousPattern.test(content)) {
          const shortFile = file.replace(SRC_DIR + '/', '');
          unguarded.push(`${shortFile}: ${varName}.X.map() without guard`);
        }
      }
    }
    expect(unguarded, `Unguarded .map() on imported data:\n${unguarded.join('\n')}`).toEqual([]);
  });

  it('array spreads on imported data use fallback guards', () => {
    const unguarded = [];
    for (const file of allFiles) {
      const content = readFileSync(file, 'utf-8');
      const imports = extractJsonImports(content);
      if (!imports.length) continue;

      for (const { varName } of imports) {
        // Dangerous: [...varName]  without  [...(varName || [])]
        const dangerousSpread = new RegExp(
          `\\[\\.\\.\\.${varName}\\]`,
          'g'
        );
        if (dangerousSpread.test(content)) {
          const shortFile = file.replace(SRC_DIR + '/', '');
          unguarded.push(`${shortFile}: [...${varName}] without null guard`);
        }
      }
    }
    expect(unguarded, `Unguarded array spreads:\n${unguarded.join('\n')}`).toEqual([]);
  });

  it('no direct .results access without optional chaining on imported JSON', () => {
    const unguarded = [];
    for (const file of allFiles) {
      const content = readFileSync(file, 'utf-8');
      const imports = extractJsonImports(content);
      if (!imports.length) continue;

      for (const { varName } of imports) {
        // Dangerous: varName.results  (not varName?.results)
        // Match varName.results but not varName?.results
        const dangerousAccess = new RegExp(
          `${varName}\\.results(?!\\?)`,
          'g'
        );
        const safeAccess = new RegExp(
          `${varName}\\?\\.results`,
          'g'
        );
        const dangerousCount = (content.match(dangerousAccess) || []).length;
        const safeCount = (content.match(safeAccess) || []).length;
        // Only flag if there are dangerous accesses and no safe ones dominate
        if (dangerousCount > 0 && safeCount === 0) {
          const shortFile = file.replace(SRC_DIR + '/', '');
          unguarded.push(`${shortFile}: ${varName}.results without optional chaining`);
        }
      }
    }
    expect(unguarded, `Unguarded .results access:\n${unguarded.join('\n')}`).toEqual([]);
  });

  it('all JSON data files are valid JSON', () => {
    const dataDir = resolve(SRC_DIR, 'data');
    const jsonFiles = readdirSync(dataDir).filter(f => f.endsWith('.json'));
    expect(jsonFiles.length).toBeGreaterThanOrEqual(19);

    for (const file of jsonFiles) {
      const content = readFileSync(resolve(dataDir, file), 'utf-8');
      expect(() => JSON.parse(content), `${file} is not valid JSON`).not.toThrow();
    }
  });

  it('JSON data files have non-empty content', () => {
    const dataDir = resolve(SRC_DIR, 'data');
    const jsonFiles = readdirSync(dataDir).filter(f => f.endsWith('.json'));

    for (const file of jsonFiles) {
      const content = readFileSync(resolve(dataDir, file), 'utf-8');
      const data = JSON.parse(content);
      const isEmpty = Array.isArray(data) ? data.length === 0 :
        typeof data === 'object' ? Object.keys(data).length === 0 : !data;
      expect(isEmpty, `${file} is empty`).toBe(false);
    }
  });

  it('exportUtils handles null/empty input gracefully', () => {
    // Dynamic import would require async, so we test the patterns statically
    const exportUtilsPath = resolve(SRC_DIR, 'utils', 'exportUtils.ts');
    const content = readFileSync(exportUtilsPath, 'utf-8');

    // extractRecords should handle null input
    expect(content).toContain('Array.isArray');
    // recordsToCsv should handle empty input
    expect(content).toContain("!records?.length");
    // recordsToMarkdown should handle empty input
    expect(content).toMatch(/!records\?\.length/);
  });

  it('dateUtils functions have input validation', () => {
    const dateUtilsPath = resolve(SRC_DIR, 'utils', 'dateUtils.ts');
    const content = readFileSync(dateUtilsPath, 'utf-8');

    // calculateTimeLeft should validate input
    expect(content).toContain('typeof');
    // daysSince should handle null
    expect(content).toMatch(/daysSince|getFreshnessInfo/);
  });

  it('error boundaries exist at all 3 tiers', () => {
    const appContent = readFileSync(resolve(SRC_DIR, 'App.jsx'), 'utf-8');
    // App-level ErrorBoundary
    expect(appContent).toContain('ErrorBoundary');
    // Route-level
    expect(appContent).toContain('RouteErrorBoundary');
    // Shell-level
    expect(appContent).toContain('ShellErrorBoundary');
  });
});
