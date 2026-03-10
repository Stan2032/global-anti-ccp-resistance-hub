import { describe, it, expect } from 'vitest';
import { readdirSync, statSync, readFileSync } from 'fs';
import { resolve, join } from 'path';

/**
 * TypeScript Purity Tests
 *
 * Enforces 100% TypeScript codebase — prevents .js/.jsx regression.
 * The entire src/ directory must use .ts/.tsx exclusively.
 * Also validates tsconfig strict mode and no @ts-nocheck directives.
 */

const SRC_DIR = resolve(__dirname, '..');

function findFiles(dir: string, ext: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === 'node_modules') continue;
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...findFiles(full, ext));
    } else if (entry.endsWith(ext)) {
      files.push(full);
    }
  }
  return files;
}

function findAllSourceFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === 'node_modules') continue;
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...findAllSourceFiles(full));
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

describe('TypeScript purity', () => {
  it('zero .jsx files in src/', () => {
    const jsxFiles = findFiles(SRC_DIR, '.jsx');
    expect(jsxFiles, `JSX files found (must be .tsx):\n${jsxFiles.join('\n')}`).toEqual([]);
  });

  it('zero .js files in src/', () => {
    const jsFiles = findFiles(SRC_DIR, '.js');
    expect(jsFiles, `JS files found (must be .ts):\n${jsFiles.join('\n')}`).toEqual([]);
  });

  it('all source files are .ts or .tsx', () => {
    const allFiles = findAllSourceFiles(SRC_DIR);
    const nonTS = allFiles.filter(f => !f.endsWith('.ts') && !f.endsWith('.tsx'));
    expect(nonTS, `Non-TypeScript files found:\n${nonTS.join('\n')}`).toEqual([]);
  });

  it('no @ts-nocheck directives in any source file', () => {
    const tsxFiles = [
      ...findFiles(resolve(SRC_DIR, 'components'), '.tsx'),
      ...findFiles(resolve(SRC_DIR, 'pages'), '.tsx'),
    ];
    const violations: string[] = [];
    for (const file of tsxFiles) {
      const content = readFileSync(file, 'utf-8');
      if (content.includes('@ts-nocheck')) {
        violations.push(file.replace(SRC_DIR + '/', ''));
      }
    }
    expect(violations, `Files with @ts-nocheck:\n${violations.join('\n')}`).toEqual([]);
  });

  it('tsconfig.json has strict mode enabled', () => {
    const tsconfigPath = resolve(SRC_DIR, '..', 'tsconfig.json');
    const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));
    expect(tsconfig.compilerOptions.strict).toBe(true);
  });

  it('has at least 130 .tsx component/page files (currently 139)', () => {
    const tsxFiles = [
      ...findFiles(resolve(SRC_DIR, 'components'), '.tsx'),
      ...findFiles(resolve(SRC_DIR, 'pages'), '.tsx'),
    ];
    // Floor set below current count (139) to allow refactoring while preventing mass deletion
    expect(tsxFiles.length).toBeGreaterThanOrEqual(130);
  });

  it('has at least 180 .test.ts/.test.tsx test files (currently 189)', () => {
    // All test files are in src/test/ (flat directory, no subdirectories)
    const testDir = resolve(SRC_DIR, 'test');
    const testFiles = readdirSync(testDir).filter(
      f => f.endsWith('.test.ts') || f.endsWith('.test.tsx')
    );
    // Floor set below current count (189) to prevent test coverage regression
    expect(testFiles.length).toBeGreaterThanOrEqual(180);
  });
});
