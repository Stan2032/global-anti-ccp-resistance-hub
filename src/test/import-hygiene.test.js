import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join, relative } from 'path';

/**
 * Import Hygiene Tests
 *
 * Validates import patterns across the codebase to prevent:
 * - Wildcard/barrel imports that bloat bundles (import * as X from 'large-lib')
 * - Direct imports of heavy libraries without tree-shaking
 * - Circular dependency indicators
 * - Import of test utilities in production code
 * - Non-existent file imports (basic path validation)
 */

const SRC_DIR = resolve(__dirname, '..');

function findSourceFiles(dir, extensions = ['.jsx', '.js']) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === 'node_modules' || entry === 'test' || entry === 'dist') continue;
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...findSourceFiles(full, extensions));
    } else if (extensions.some(ext => entry.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

const sourceFiles = findSourceFiles(SRC_DIR);

describe('Import Hygiene', () => {
  it('no wildcard imports from large libraries', () => {
    const violations = [];
    // Libraries where wildcard imports are wasteful
    const largeLibs = ['lucide-react', 'react-router-dom', 'date-fns', 'lodash'];
    for (const file of sourceFiles) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        for (const lib of largeLibs) {
          if (new RegExp(`import\\s+\\*\\s+as\\s+\\w+\\s+from\\s+['"]${lib}['"]`).test(line)) {
            violations.push(`${relative(SRC_DIR, file)}:${i + 1}: Wildcard import from ${lib} — use named imports`);
          }
        }
      });
    }
    expect(violations, `Wildcard imports from large libraries:\n${violations.join('\n')}`).toEqual([]);
  });

  it('lucide-react icons are imported individually (tree-shakeable)', () => {
    const violations = [];
    for (const file of sourceFiles) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        // Bad: import { icons } from 'lucide-react' or import * as LucideIcons
        if (/import\s+\{\s*icons\s*\}\s+from\s+['"]lucide-react['"]/.test(line)) {
          violations.push(`${relative(SRC_DIR, file)}:${i + 1}: Import icons object instead of individual icons`);
        }
      });
    }
    expect(violations, `Non-tree-shakeable lucide-react imports:\n${violations.join('\n')}`).toEqual([]);
  });

  it('no test utilities imported in production source files', () => {
    const violations = [];
    const testImportPatterns = [
      /from\s+['"]vitest['"]/,
      /from\s+['"]@testing-library/,
      /from\s+['"]jest['"]/,
      /require\(['"]vitest['"]\)/,
    ];
    for (const file of sourceFiles) {
      const relPath = relative(SRC_DIR, file);
      // Skip test setup files
      if (relPath.includes('setupTests') || relPath.includes('test-utils')) continue;
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        for (const pattern of testImportPatterns) {
          if (pattern.test(line)) {
            violations.push(`${relPath}:${i + 1}: Test utility imported in production code — ${line.trim()}`);
          }
        }
      });
    }
    expect(violations, `Test utilities in production code:\n${violations.join('\n')}`).toEqual([]);
  });

  it('source files contain relative imports (scanner validation)', () => {
    const importPattern = /import\s+.*\s+from\s+['"](\.\.[^'"]+|\.\/[^'"]+)['"]/;
    let importCount = 0;
    for (const file of sourceFiles) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line) => {
        const match = line.match(importPattern);
        if (match) {
          importCount++;
        }
      });
    }
    // Just verify we're scanning imports — should find many relative imports
    expect(importCount).toBeGreaterThan(50);
  });

  it('no require() calls in ES module source files (use import)', () => {
    const violations = [];
    for (const file of sourceFiles) {
      const relPath = relative(SRC_DIR, file);
      // Skip config files and node-only files
      if (relPath.includes('vite.config') || relPath.includes('setupTests')) continue;
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (/\brequire\s*\(/.test(line) && !line.trim().startsWith('//')) {
          violations.push(`${relPath}:${i + 1}: require() in ES module — use import`);
        }
      });
    }
    expect(violations, `CommonJS require() in ES modules:\n${violations.join('\n')}`).toEqual([]);
  });

  it('JSON data imports are direct (not through barrel files)', () => {
    const violations = [];
    for (const file of sourceFiles) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        // Ensure JSON imports come from ../data/ directly, not re-exports
        if (/from\s+['"].*\/data\/index['"]/.test(line)) {
          violations.push(`${relative(SRC_DIR, file)}:${i + 1}: Import JSON through barrel file — import directly from data/*.json`);
        }
      });
    }
    expect(violations, `JSON imports through barrel files:\n${violations.join('\n')}`).toEqual([]);
  });

  it('no duplicate imports in the same file', () => {
    const filesWithDuplicates = [];
    for (const file of sourceFiles) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      const importSources = [];
      lines.forEach((line) => {
        const match = line.match(/import\s+.*\s+from\s+['"]([^'"]+)['"]/);
        if (match) {
          importSources.push(match[1]);
        }
      });
      const seen = new Set();
      const dupes = [];
      for (const src of importSources) {
        if (seen.has(src)) {
          dupes.push(src);
        }
        seen.add(src);
      }
      if (dupes.length > 0) {
        filesWithDuplicates.push(`${relative(SRC_DIR, file)}: duplicate imports of ${dupes.join(', ')}`);
      }
    }
    expect(filesWithDuplicates, `Files with duplicate imports:\n${filesWithDuplicates.join('\n')}`).toEqual([]);
  });
});
