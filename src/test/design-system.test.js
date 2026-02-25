import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';

/**
 * Design System Compliance Tests
 *
 * The terminal/ASCII aesthetic requires:
 * - Square corners (no rounded-lg, rounded-xl, rounded-2xl, rounded-3xl)
 * - No gradient backgrounds (no bg-gradient-to-*)
 * - No old-style slate backgrounds (no bg-slate-*, border-slate-*)
 *
 * Allowed: rounded, rounded-sm, rounded-md (subtle), rounded-full (circles/dots only)
 */

const SRC_DIR = resolve(__dirname, '..');

// Recursively find all .jsx files in src/
function findJsxFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === 'node_modules' || entry === 'test') continue;
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...findJsxFiles(full));
    } else if (entry.endsWith('.jsx')) {
      files.push(full);
    }
  }
  return files;
}

const jsxFiles = findJsxFiles(SRC_DIR);

describe('Terminal design system compliance', () => {
  it('finds JSX files to scan', () => {
    expect(jsxFiles.length).toBeGreaterThan(50);
  });

  describe('no prohibited rounded classes', () => {
    // rounded-lg, rounded-xl, rounded-2xl, rounded-3xl are prohibited
    const PROHIBITED_ROUNDED = /rounded-(lg|xl|2xl|3xl)/g;

    for (const filePath of jsxFiles) {
      const relativePath = filePath.replace(SRC_DIR + '/', '');
      it(`${relativePath} has no rounded-lg/xl/2xl/3xl`, () => {
        const content = readFileSync(filePath, 'utf-8');
        const matches = content.match(PROHIBITED_ROUNDED);
        expect(matches, `Found prohibited rounded classes: ${matches}`).toBeNull();
      });
    }
  });

  describe('no gradient backgrounds', () => {
    const GRADIENT_PATTERN = /bg-gradient-to-/g;

    for (const filePath of jsxFiles) {
      const relativePath = filePath.replace(SRC_DIR + '/', '');
      it(`${relativePath} has no bg-gradient-to-*`, () => {
        const content = readFileSync(filePath, 'utf-8');
        const matches = content.match(GRADIENT_PATTERN);
        expect(matches, `Found gradient backgrounds: ${matches}`).toBeNull();
      });
    }
  });
});
