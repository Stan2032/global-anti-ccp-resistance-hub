import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';

/**
 * Design System Compliance Tests
 *
 * The terminal/ASCII aesthetic requires:
 * - Square corners (no rounded-lg, rounded-xl, rounded-2xl, rounded-3xl)
 * - No gradient backgrounds (no bg-gradient-to-*)
 *
 * Allowed: rounded, rounded-sm, rounded-md (subtle), rounded-full (circles/dots only)
 *
 * These tests scan ALL JSX files in bulk — any violation is reported with
 * the exact file and match. One test per pattern keeps the suite fast while
 * catching every violation.
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

  it('no JSX file uses prohibited rounded classes (rounded-lg/xl/2xl/3xl)', () => {
    const PROHIBITED_ROUNDED = /rounded-(lg|xl|2xl|3xl)/g;
    const violations = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const matches = content.match(PROHIBITED_ROUNDED);
      if (matches) {
        const relativePath = filePath.replace(SRC_DIR + '/', '');
        violations.push(`${relativePath}: ${matches.join(', ')}`);
      }
    }
    expect(violations, `Prohibited rounded classes found:\n${violations.join('\n')}`).toEqual([]);
  });

  it('no JSX file uses gradient backgrounds (bg-gradient-to-*)', () => {
    const GRADIENT_PATTERN = /bg-gradient-to-/g;
    const violations = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const matches = content.match(GRADIENT_PATTERN);
      if (matches) {
        const relativePath = filePath.replace(SRC_DIR + '/', '');
        violations.push(`${relativePath}: ${matches.join(', ')}`);
      }
    }
    expect(violations, `Gradient backgrounds found:\n${violations.join('\n')}`).toEqual([]);
  });
});
