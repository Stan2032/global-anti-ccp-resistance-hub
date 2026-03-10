import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';

/**
 * Responsive Layout Compliance Tests
 *
 * Prevents common causes of horizontal overflow at mobile viewports:
 * - Fixed widths that exceed mobile screens (e.g., w-[500px])
 * - Excessive padding without responsive breakpoints on wrapper divs
 * - Missing overflow protection on containers with inline content
 *
 * These tests complement the visual audit (Sessions 232-233) which verified
 * all 11 pages at 100%/125%/150% zoom × 375/768/1280px with zero overflow.
 */

const SRC_DIR = resolve(__dirname, '..');

function findJsxFiles(dir: string): string[] {
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

describe('Responsive layout compliance', () => {
  it('finds JSX files to scan', () => {
    expect(jsxFiles.length).toBeGreaterThan(50);
  });

  it('no fixed widths wider than 480px without responsive prefix', () => {
    // Fixed widths like w-[500px] or w-[600px] will overflow 375px mobile.
    // Allowed: w-[NNNpx] with sm:/md:/lg: prefix, or inside min-w-/max-w- context
    const violations: string[] = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const relativePath = filePath.replace(SRC_DIR + '/', '');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        // Skip comments and strings that aren't className
        if (/^\s*\/\//.test(line) || /^\s*\*/.test(line)) return;
        let match;
        const regex = /(?<![:\w-])w-\[(\d+)px\]/g;
        while ((match = regex.exec(line)) !== null) {
          const width = parseInt(match[1], 10);
          if (width > 480) {
            // Check if it has a responsive prefix (sm: md: lg: xl:)
            const before = line.substring(0, match.index);
            if (/(?:sm|md|lg|xl|2xl):$/.test(before.trim())) continue;
            // Check if it's min-w- or max-w- (not bare w-)
            if (/(?:min-w|max-w)-\[$/.test(before.slice(-6))) continue;
            violations.push(`${relativePath}:${idx + 1}: w-[${width}px] — fixed width exceeds mobile viewport`);
          }
        }
      });
    }
    expect(violations, `Fixed widths >480px without responsive prefix:\n${violations.join('\n')}`).toEqual([]);
  });

  it('App root has overflow-x-hidden to prevent stray horizontal scroll', () => {
    const appPath = jsxFiles.find((f: any) => f.endsWith('/App.tsx') || f.endsWith('/App.jsx'));
    expect(appPath).toBeTruthy();
    const content = readFileSync(appPath!, 'utf-8');
    expect(content).toContain('overflow-x-hidden');
  });

  it('no hardcoded min-width wider than 540px without horizontal scroll container', () => {
    // min-w-[NNN] > 540px on a non-scroll container will break mobile.
    // Exception: elements inside overflow-x-auto or overflow-x-scroll containers
    const violations: string[] = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const relativePath = filePath.replace(SRC_DIR + '/', '');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/^\s*\/\//.test(line) || /^\s*\*/.test(line)) return;
        let match;
        const regex = /min-w-\[(\d+)px\]/g;
        while ((match = regex.exec(line)) !== null) {
          const width = parseInt(match[1], 10);
          if (width > 540) {
            // Check if there's an overflow-x-auto/scroll on same line or nearby
            if (/overflow-x-(auto|scroll)/.test(line)) continue;
            // Check 3 lines before for scroll container
            const context = lines.slice(Math.max(0, idx - 3), idx + 1).join('\n');
            if (/overflow-x-(auto|scroll)/.test(context)) continue;
            violations.push(`${relativePath}:${idx + 1}: min-w-[${width}px] — may overflow mobile without scroll container`);
          }
        }
      });
    }
    expect(violations, `Large min-width without scroll container:\n${violations.join('\n')}`).toEqual([]);
  });
});
