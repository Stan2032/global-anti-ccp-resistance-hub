import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { resolve, join, relative } from 'path';

/**
 * Keyboard Navigation & Focus Management Tests
 *
 * Ensures all modal/overlay components support keyboard dismissal (Escape key),
 * validates focus management patterns, and enforces keyboard accessibility standards.
 *
 * Modals must:
 * - Support Escape key to close
 * - Have role="dialog" + aria-modal on overlay modals
 * - Clean up event listeners (useEffect with return)
 */

const SRC_DIR = resolve(__dirname, '..');

function resolveFile(dir, baseName) {
  const tsxPath = resolve(dir, baseName.replace(/\.jsx$/, '.tsx'));
  return existsSync(tsxPath) ? tsxPath : resolve(dir, baseName);
}

function findJsxFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === 'node_modules' || entry === 'test') continue;
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...findJsxFiles(full));
    } else if (entry.endsWith('.jsx') || entry.endsWith('.tsx')) {
      files.push(full);
    }
  }
  return files;
}

const jsxFiles = findJsxFiles(SRC_DIR);

describe('Keyboard navigation & focus management', () => {
  it('finds JSX files to scan', () => {
    expect(jsxFiles.length).toBeGreaterThan(50);
  });

  it('all modal overlays (fixed inset-0) support Escape key to close', () => {
    const violations = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const relPath = relative(SRC_DIR, filePath);
      // Check for modal overlays: fixed inset-0 with z-50 (full-screen overlay)
      if (/fixed\s+inset-0.*z-50|fixed.*z-50.*inset-0/.test(content)) {
        // Must have Escape key handling
        if (!/Escape/.test(content)) {
          violations.push(`${relPath}: has fixed inset-0 z-50 overlay but no Escape key handler`);
        }
      }
    }
    expect(violations, `Modals without Escape key:\n${violations.join('\n')}`).toEqual([]);
  });

  it('Escape key handlers clean up event listeners (useEffect with return)', () => {
    const violations = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const relPath = relative(SRC_DIR, filePath);
      // If file adds Escape listener, it should also remove it
      if (/addEventListener.*keydown.*Escape|Escape.*addEventListener.*keydown/.test(content) ||
          /document\.addEventListener\('keydown'/.test(content)) {
        if (!/removeEventListener/.test(content)) {
          violations.push(`${relPath}: adds keydown listener but never removes it`);
        }
      }
    }
    expect(violations, `Missing cleanup:\n${violations.join('\n')}`).toEqual([]);
  });

  it('modal overlays with role="dialog" have aria-modal attribute', () => {
    const violations = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const relPath = relative(SRC_DIR, filePath);
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (/role="dialog"/.test(line)) {
          // Check nearby context for aria-modal
          const context = lines.slice(Math.max(0, i - 2), i + 3).join(' ');
          if (!/aria-modal/.test(context)) {
            violations.push(`${relPath}:${i + 1}: role="dialog" without aria-modal`);
          }
        }
      });
    }
    expect(violations, `Missing aria-modal:\n${violations.join('\n')}`).toEqual([]);
  });

  it('no onClick on div/span without keyboard equivalent or role', () => {
    // Clickable divs/spans need role="button" + tabIndex + onKeyDown for keyboard access.
    // Exception: stopPropagation-only handlers (prevent click-through on modals).
    const violations = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const relPath = relative(SRC_DIR, filePath);
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        // Match <div or <span with onClick
        if (/<(div|span)\s[^>]*onClick=/.test(line)) {
          // Allow stopPropagation-only handlers
          if (/stopPropagation/.test(line)) return;
          // Must have role, tabIndex, or onKeyDown nearby
          const context = lines.slice(Math.max(0, i - 1), i + 2).join(' ');
          if (!/role=|tabIndex|onKeyDown|onKeyPress/.test(context)) {
            violations.push(`${relPath}:${i + 1}: clickable div/span without keyboard support`);
          }
        }
      });
    }
    expect(violations, `Clickable elements without keyboard support:\n${violations.join('\n')}`).toEqual([]);
  });

  it('focus-visible styles exist in the codebase', () => {
    let focusStyleCount = 0;
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const matches = content.match(/focus-visible|focus:ring|focus:outline|focus:border/g);
      if (matches) focusStyleCount += matches.length;
    }
    // Should have many focus styles across the codebase
    expect(focusStyleCount).toBeGreaterThan(20);
  });

  it('skip-to-content link exists in App', () => {
    const appContent = readFileSync(resolveFile(SRC_DIR, 'App.jsx'), 'utf-8');
    expect(appContent).toContain('main-content');
  });

  it('all components with selectedX state + overlay use Escape key pattern', () => {
    // Check that components using the pattern: useState(null) for selected + fixed inset-0
    // have the useEffect Escape pattern
    const violations = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const relPath = relative(SRC_DIR, filePath);
      // Match files that have both a selected* state and a fixed overlay
      const hasSelectedState = /\[selected\w+,\s*setSelected\w+\]\s*=\s*useState\(null\)/.test(content);
      const hasFixedOverlay = /fixed\s+inset-0|fixed.*inset-0/.test(content);
      if (hasSelectedState && hasFixedOverlay) {
        if (!/Escape/.test(content)) {
          violations.push(`${relPath}: has selectedX state + fixed overlay but no Escape handler`);
        }
      }
    }
    expect(violations, `Components missing Escape:\n${violations.join('\n')}`).toEqual([]);
  });
});
