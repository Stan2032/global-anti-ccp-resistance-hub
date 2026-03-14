/**
 * Console Usage Hygiene Test
 *
 * Ensures all production code uses the centralized logger utility
 * instead of raw console.log/warn/error. This prevents:
 * - Uncontrolled logging in production
 * - Missing context prefixes
 * - Inconsistent log levels
 *
 * Raw console.* calls are only allowed in:
 * - src/utils/logger.ts (the logger itself)
 * - Test files (src/test/)
 *
 * @module console-hygiene.test
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { resolve, join, relative } from 'path';

const SRC_DIR = resolve(__dirname, '..');

/** Recursively find all .ts and .tsx files in a directory. */
function findFiles(dir: string, exts: string[]): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory() && entry !== 'node_modules' && entry !== 'test') {
      files.push(...findFiles(full, exts));
    } else if (stat.isFile() && exts.some(ext => full.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

describe('Console Usage Hygiene', () => {
  const productionFiles = findFiles(SRC_DIR, ['.ts', '.tsx'])
    .filter(f => !f.includes('/test/'))
    .filter(f => !f.endsWith('.test.ts') && !f.endsWith('.test.tsx'));

  it('found production source files to scan', () => {
    expect(productionFiles.length).toBeGreaterThan(50);
  });

  it('no raw console.log in production code (use logger.debug instead)', () => {
    const violations: string[] = [];
    for (const file of productionFiles) {
      const rel = relative(SRC_DIR, file);
      if (rel === 'utils/logger.ts') continue; // Logger itself is exempt

      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/console\.log\b/) && !lines[i].trim().startsWith('//')) {
          violations.push(`${rel}:${i + 1}: ${lines[i].trim()}`);
        }
      }
    }
    expect(
      violations,
      `Found raw console.log (use logger.debug instead):\n${violations.join('\n')}`
    ).toHaveLength(0);
  });

  it('no raw console.warn in production code (use logger.warn instead)', () => {
    const violations: string[] = [];
    for (const file of productionFiles) {
      const rel = relative(SRC_DIR, file);
      if (rel === 'utils/logger.ts') continue;

      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/console\.warn\b/) && !lines[i].trim().startsWith('//')) {
          violations.push(`${rel}:${i + 1}: ${lines[i].trim()}`);
        }
      }
    }
    expect(
      violations,
      `Found raw console.warn (use logger.warn instead):\n${violations.join('\n')}`
    ).toHaveLength(0);
  });

  it('no raw console.error in production code (use logger.error instead)', () => {
    const violations: string[] = [];
    for (const file of productionFiles) {
      const rel = relative(SRC_DIR, file);
      if (rel === 'utils/logger.ts') continue;

      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/console\.error\b/) && !lines[i].trim().startsWith('//')) {
          violations.push(`${rel}:${i + 1}: ${lines[i].trim()}`);
        }
      }
    }
    expect(
      violations,
      `Found raw console.error (use logger.error instead):\n${violations.join('\n')}`
    ).toHaveLength(0);
  });

  it('logger.ts exists and exports the logger object', async () => {
    const { logger } = await import('../utils/logger');
    expect(logger).toBeDefined();
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });
});
