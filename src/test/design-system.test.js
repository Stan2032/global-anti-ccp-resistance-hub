import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join, relative } from 'path';

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

  it('no JSX file uses structural bg-gray-*/border-gray-* for card surfaces or borders', () => {
    // Catches structural gray usage: bg-gray-800/900/950 as card/section backgrounds,
    // border-gray-600/700/800 as structural dividers. These MUST use terminal palette.
    //
    // Exemptions (semantic uses that are intentionally gray):
    // - Color map objects: { gray: 'bg-gray-800...' } — defining a named gray variant
    // - Status/category functions: return 'bg-gray-500/10...' — low-opacity status indicators
    // - Brand colors: 'hover:bg-gray-800' — platform-specific brand hover
    // - Object property assignments: key: 'bg-gray-...' — semantic config
    const STRUCTURAL_GRAY = /(?:^|[\s"])(?:bg-gray-(?:8\d{2}|9\d{2})(?!\/)(?:\s|"|'))|(?:border-gray-[6-8]\d{2}(?!\/)(?:\s|"|'))/;
    const violations = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const relativePath = filePath.replace(SRC_DIR + '/', '');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        // Skip semantic: object property definitions (key: 'bg-gray-...')
        if (/^\s*['"]?\w+['"]?\s*:\s*['"]/.test(line) && /bg-gray-|border-gray-/.test(line)) return;
        // Skip semantic: return statements from color helper functions
        if (/^\s*(default:\s*)?return\s+['"]/.test(line)) return;
        // Skip semantic: ternary/fallback color in inline expressions
        if (/\|\|\s*['"].*bg-gray-/.test(line)) return;
        // Skip semantic: hover states (hover:bg-gray-*)
        if (/hover:bg-gray-/.test(line) && !/(?<![:\w])bg-gray-/.test(line.replace(/hover:bg-gray-\S+/g, ''))) return;
        if (STRUCTURAL_GRAY.test(line)) {
          violations.push(`${relativePath}:${idx + 1}: ${line.trim().substring(0, 100)}`);
        }
      });
    }
    expect(violations,
      `Structural bg-gray-*/border-gray-* found (use terminal palette instead):\n` +
      `  bg-[#0a0e14] for page bg, bg-[#111820] for cards, border-[#1c2a35] for borders\n` +
      violations.join('\n')
    ).toEqual([]);
  });

  it('no orphan component files in src/components/ (all must be imported somewhere)', () => {
    const componentsDir = resolve(SRC_DIR, 'components');
    const componentFiles = readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));

    // Read all non-test source files for import scanning
    const allSourceFiles = [];
    function findAllSourceFiles(dir) {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (entry === 'node_modules' || entry === 'test') continue;
        const stat = statSync(full);
        if (stat.isDirectory()) findAllSourceFiles(full);
        else if (entry.endsWith('.jsx') || entry.endsWith('.js')) allSourceFiles.push(full);
      }
    }
    findAllSourceFiles(SRC_DIR);

    const orphans = [];
    for (const compFile of componentFiles) {
      const compName = compFile.replace('.jsx', '');
      const compPath = resolve(componentsDir, compFile);
      const isImported = allSourceFiles.some(srcFile => {
        if (srcFile === compPath) return false;
        const content = readFileSync(srcFile, 'utf-8');
        return content.includes(`/${compName}'`) || content.includes(`/${compName}"`);
      });
      if (!isImported) orphans.push(compFile);
    }

    expect(orphans,
      `Orphan components found (not imported anywhere):\n` +
      orphans.map(f => `  ${f} — integrate into a page tab or remove`).join('\n')
    ).toEqual([]);
  });

  it('no role="button" on non-button elements (use semantic <button> instead)', () => {
    const violations = [];
    for (const file of jsxFiles) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (line.includes('role="button"')) {
          violations.push(`${relative(SRC_DIR, file)}:${i + 1}: ${line.trim()}`);
        }
      });
    }
    expect(violations,
      `Use semantic <button> or <motion.button> instead of div[role="button"]:\n` +
      violations.join('\n')
    ).toEqual([]);
  });

  it('no Tailwind blue-* classes (use terminal palette: #22d3ee for cyan, #1c2a35 for borders)', () => {
    const BLUE_PATTERN = /(?:bg|text|border|ring)-blue-\d+/g;
    const violations = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const matches = content.match(BLUE_PATTERN);
      if (matches) {
        const relativePath = filePath.replace(SRC_DIR + '/', '');
        violations.push(`${relativePath}: ${[...new Set(matches)].join(', ')}`);
      }
    }
    expect(violations,
      `Tailwind blue-* classes found (use terminal palette instead):\n` +
      `  text-[#22d3ee] for info text, bg-[#22d3ee] for buttons, border-[#1c2a35] for borders\n` +
      violations.join('\n')
    ).toEqual([]);
  });

  it('no non-terminal accent color classes (blue/purple/indigo/teal/pink → terminal palette)', () => {
    const NON_TERMINAL_PATTERN = /(?:bg|text|border|ring)-(?:blue|purple|indigo|teal|pink)-\d+/g;
    const violations = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const matches = content.match(NON_TERMINAL_PATTERN);
      if (matches) {
        const relativePath = filePath.replace(SRC_DIR + '/', '');
        violations.push(`${relativePath}: ${[...new Set(matches)].join(', ')}`);
      }
    }
    expect(violations,
      `Non-terminal accent colors found (use terminal palette instead):\n` +
      `  text-[#22d3ee] for info/accent text, bg-[#22d3ee] for buttons, border-[#1c2a35] for borders\n` +
      `  bg-[#111820] for dark surfaces, text-[#0a0e14] for dark text on cyan bg\n` +
      violations.join('\n')
    ).toEqual([]);
  });

  it('text-slate-500 is only used for decorative icons, disabled states, pipe separators, and bullet decorators', () => {
    // Design rule: ALL readable text must be text-slate-400 or brighter.
    // text-slate-500 is reserved for:
    //   - Decorative icons (same element has w-N h-N sizing)
    //   - Disabled states (same element or className has cursor-not-allowed)
    //   - Pipe separators: content is just |
    //   - Bullet decorators: content is just •
    //   - Hover modifiers: hover:text-slate-500
    //   - Unit labels in timer displays (y, d, h, m, s suffixes)
    //   - Close/dismiss button icons with hover override (hover:text-slate-300 etc.)
    const violations = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const relativePath = filePath.replace(SRC_DIR + '/', '');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (!line.includes('text-slate-500')) return;
        // Skip: hover modifier only (hover:text-slate-500)
        if (/hover:text-slate-500/.test(line) && !/(?<!hover:)text-slate-500/.test(line.replace(/hover:text-slate-500/g, ''))) return;
        // Skip: decorative icon (w-N h-N on same element)
        if (/w-\d+\s+h-\d+|h-\d+\s+w-\d+/.test(line)) return;
        // Skip: disabled states
        if (/cursor-not-allowed/.test(line)) return;
        // Skip: pipe separator or bullet content
        if (/>\s*\|\s*</.test(line) || />\s*•\s*</.test(line)) return;
        // Skip: timer unit labels (single char content like y, d, h, m, s)
        if (/>\s*[ydhms]\s*</.test(line)) return;
        // Skip: hover override on same element (e.g. hover:text-slate-300, hover:text-white)
        if (/hover:text-(?:slate-[1-4]\d\d|white|green|red|cyan|yellow|\[#)/.test(line)) return;
        // Skip: ChevronUp/ChevronDown icons in collapsible elements
        if (/Chevron(?:Up|Down|Left|Right)/.test(line)) return;
        // Skip: icon-only wrappers (parent div/span containing only an icon on next line)
        if (/^<(?:div|span)\s+className="text-slate-500"\s*>$/.test(line.trim())) return;
        // Skip: decorative separator text ("then" between key combos)
        if (/>then</.test(line)) return;
        // Skip: inactive/not-loaded tab states in ternary expressions
        if (/[?:].*text-slate-500.*bg-\[#/.test(line)) return;
        violations.push(`${relativePath}:${idx + 1}: ${line.trim().substring(0, 120)}`);
      });
    }
    expect(violations,
      `text-slate-500 used on readable text (should be text-slate-400 or brighter):\n` +
      `  Allowed ONLY for: decorative icons (w-N h-N), disabled (cursor-not-allowed), pipes (|), bullets (•)\n` +
      violations.join('\n')
    ).toEqual([]);
  });

  it('text-slate-600/700/800/900 is only used for decorative/aria-hidden elements, icons, separators, and disabled states', () => {
    // Design rule: Readable text must be text-slate-400 or brighter.
    // text-slate-600+ is allowed ONLY for:
    //   - aria-hidden="true" decorative elements (ASCII art, borders, fingerprints)
    //   - Decorative icons (same element has w-N h-N sizing)
    //   - Pipe/arrow/dash separators (│, |, ──, ↗, ▸)
    //   - Disabled states (cursor-not-allowed)
    //   - select-none (non-interactive decorative text)
    const violations = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const relativePath = filePath.replace(SRC_DIR + '/', '');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (!/text-slate-[6-9]\d\d/.test(line)) return;
        // Skip: aria-hidden="true" on same element or parent context
        if (/aria-hidden/.test(line)) return;
        // Skip: decorative icons (w-N h-N sizing)
        if (/w-\d+\s+h-\d+|h-\d+\s+w-\d+/.test(line)) return;
        // Skip: disabled states
        if (/cursor-not-allowed/.test(line)) return;
        // Skip: select-none (non-interactive decorative text)
        if (/select-none/.test(line)) return;
        // Skip: pipe/dash/arrow separator content
        if (/>\s*[│|──↗▸]\s*</.test(line)) return;
        // Skip: hover modifiers
        if (/hover:text-slate-[6-9]/.test(line) && !/(?<!hover:)text-slate-[6-9]\d\d/.test(line.replace(/hover:text-slate-[6-9]\d\d/g, ''))) return;
        violations.push(`${relativePath}:${idx + 1}: ${line.trim().substring(0, 120)}`);
      });
    }
    expect(violations,
      `text-slate-600+ used on readable text (should be text-slate-400 or brighter):\n` +
      `  Allowed ONLY for: aria-hidden, decorative icons (w-N h-N), disabled, select-none, separators\n` +
      violations.join('\n')
    ).toEqual([]);
  });

  it('placeholder text uses standardized placeholder:text-slate-400 syntax (no old placeholder-slate-* classes)', () => {
    // Design rule: All placeholder text uses Tailwind v3+ modifier syntax.
    // Correct:   placeholder:text-slate-400
    // Incorrect: placeholder-slate-400, placeholder-slate-500, placeholder-slate-600
    const OLD_PLACEHOLDER = /placeholder-slate-\d+/g;
    const violations = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const matches = content.match(OLD_PLACEHOLDER);
      if (matches) {
        const relativePath = filePath.replace(SRC_DIR + '/', '');
        violations.push(`${relativePath}: ${[...new Set(matches)].join(', ')}`);
      }
    }
    expect(violations,
      `Old-style placeholder-slate-* classes found (use placeholder:text-slate-400 instead):\n` +
      violations.join('\n')
    ).toEqual([]);
  });
});
