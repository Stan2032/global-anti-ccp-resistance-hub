import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve(__dirname, '..');

function getFiles(dir, ext) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'test' && entry.name !== 'node_modules') {
      files.push(...getFiles(full, ext));
    } else if (entry.isFile() && entry.name.endsWith(ext)) {
      files.push(full);
    }
  }
  return files;
}

function relPath(file) {
  return path.relative(path.resolve(SRC_DIR, '..'), file);
}

describe('ARIA Live Regions — loading states are announced to screen readers', () => {
  const jsxFiles = [
    ...getFiles(path.join(SRC_DIR, 'components'), '.jsx'),
    ...getFiles(path.join(SRC_DIR, 'pages'), '.jsx'),
    path.join(SRC_DIR, 'App.jsx'),
  ].filter(f => fs.existsSync(f));

  it('SectionLoader components include role="status"', () => {
    const violations = [];
    for (const file of jsxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const sectionLoaderMatch = content.match(/const SectionLoader\s*=\s*\(\)\s*=>\s*\(/);
      if (sectionLoaderMatch) {
        // Extract SectionLoader body (next ~10 lines)
        const idx = content.indexOf(sectionLoaderMatch[0]);
        const snippet = content.substring(idx, idx + 400);
        if (!snippet.includes('role="status"')) {
          violations.push(`${relPath(file)}: SectionLoader missing role="status"`);
        }
      }
    }
    expect(violations, `SectionLoader without role="status":\n${violations.join('\n')}`).toEqual([]);
  });

  it('LoadingScreen in App.jsx includes role="status"', () => {
    const appFile = path.join(SRC_DIR, 'App.jsx');
    if (!fs.existsSync(appFile)) return;
    const content = fs.readFileSync(appFile, 'utf-8');
    const match = content.match(/const LoadingScreen\s*=\s*\(\)\s*=>\s*\(/);
    if (match) {
      const idx = content.indexOf(match[0]);
      const snippet = content.substring(idx, idx + 600);
      expect(snippet).toContain('role="status"');
    }
  });

  it('animate-spin loading spinners have aria-hidden="true" or are inside role="status"', () => {
    const violations = [];
    for (const file of jsxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('animate-spin') && !line.includes('aria-hidden')) {
          // Check if parent (within 5 lines above) has role="status" or aria-live
          const context = lines.slice(Math.max(0, i - 5), i + 1).join('\n');
          if (!context.includes('role="status"') && !context.includes('aria-live')) {
            // It's OK if the spinner is inside a button (self-describing via button text)
            if (!context.includes('<button') && !context.includes('Button')) {
              violations.push(`${relPath(file)}:${i + 1}: animate-spin without aria-hidden or parent role="status"`);
            }
          }
        }
      }
    }
    expect(violations, `Spinners without aria-hidden:\n${violations.join('\n')}`).toEqual([]);
  });

  it('search result containers have aria-live for dynamic content', () => {
    const searchFile = path.join(SRC_DIR, 'components', 'GlobalSearch.jsx');
    if (!fs.existsSync(searchFile)) return;
    const content = fs.readFileSync(searchFile, 'utf-8');
    // Loading state should have aria-live or role="status"
    expect(
      content.includes('role="status"') || content.includes('aria-live'),
      'GlobalSearch should have role="status" or aria-live on loading/results area'
    ).toBe(true);
  });

  it('all loading text ("loading", "Loading...") containers have role="status" or aria-live', () => {
    const violations = [];
    for (const file of jsxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Match lines with loading text in JSX (not variable names or imports)
        if (
          (line.includes('>Loading...</') || line.includes('>loading data...</') ||
           line.includes('>Searching...</')) &&
          !line.includes('//') && !line.includes('import')
        ) {
          const context = lines.slice(Math.max(0, i - 8), i + 1).join('\n');
          if (!context.includes('role="status"') && !context.includes('aria-live') && !context.includes('sr-only')) {
            violations.push(`${relPath(file)}:${i + 1}: loading text without role="status" or aria-live`);
          }
        }
      }
    }
    expect(violations, `Loading text without ARIA:\n${violations.join('\n')}`).toEqual([]);
  });

  it('at least 8 components/pages have role="status" for loading states', () => {
    let count = 0;
    for (const file of jsxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes('role="status"')) count++;
    }
    // We fixed 7 SectionLoaders + App.jsx + GlobalSearch + NewsAggregator + AdminDashboard + ProtectedRoute + IntelligenceFeeds
    expect(count).toBeGreaterThanOrEqual(8);
  });

  it('decorative cursor blocks (█) have aria-hidden="true"', () => {
    const violations = [];
    for (const file of jsxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('█') && !lines[i].includes('aria-hidden') && !lines[i].includes('select-none')) {
          // Exclude ASCII art blocks (pre tags, multi-line art)
          const context = lines.slice(Math.max(0, i - 3), i + 1).join('\n');
          if (!context.includes('<pre') && !context.includes('aria-hidden="true"') && !context.includes('│')) {
            violations.push(`${relPath(file)}:${i + 1}: decorative █ without aria-hidden`);
          }
        }
      }
    }
    expect(violations, `Decorative blocks without aria-hidden:\n${violations.join('\n')}`).toEqual([]);
  });
});
