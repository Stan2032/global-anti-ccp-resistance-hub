import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';

/**
 * Tests that interactive UI components have proper ARIA attributes.
 * Focuses on filter/tab patterns and expandable sections.
 */

const COMPONENTS_DIR = resolve(__dirname, '../components');

function getComponentFiles(): string[] {
  const files: string[] = [];
  function scan(dir: string): void {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        scan(full);
      } else if (full.endsWith('.tsx') && !full.includes('.test.')) {
        files.push(full);
      }
    }
  }
  scan(COMPONENTS_DIR);
  return files;
}

describe('ARIA Interactive Coverage', () => {
  const componentFiles = getComponentFiles();

  it('finds component files to audit', () => {
    expect(componentFiles.length).toBeGreaterThan(50);
  });

  it('filter/tab patterns have role="tablist" or role="listbox" on containers', () => {
    const violations: string[] = [];
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      // Files with aria-selected should also have role="tablist" or role="listbox" somewhere
      if (content.includes('aria-selected=') && !content.includes('role="tablist"') && !content.includes('role="listbox"')) {
        const name = file.split('/').pop() ?? file;
        violations.push(name);
      }
    }
    expect(violations, `Missing role="tablist" or role="listbox" in: ${violations.join(', ')}`).toEqual([]);
  });

  it('expandable buttons have aria-expanded', () => {
    const violations: string[] = [];
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Look for toggle patterns: onClick that toggles expand/open/show states
        if (/onClick.*\(.*!.*(?:expanded|isOpen|showMore|openQuestion|expandedStory)/.test(line)) {
          // Check surrounding 5 lines for aria-expanded
          const context = lines.slice(Math.max(0, i - 3), i + 5).join('\n');
          if (!context.includes('aria-expanded')) {
            const name = file.split('/').pop() ?? file;
            violations.push(`${name}:${i + 1}`);
          }
        }
      }
    }
    expect(violations, `Toggle buttons missing aria-expanded:\n${violations.join('\n')}`).toEqual([]);
  });

  it('components with aria-selected buttons use role="tab" or role="option"', () => {
    const violations: string[] = [];
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      if (content.includes('aria-selected=') && !content.includes('role="tab"') && !content.includes('role="option"')) {
        const name = file.split('/').pop() ?? file;
        violations.push(name);
      }
    }
    expect(violations, `Missing role="tab" or role="option" in: ${violations.join(', ')}`).toEqual([]);
  });

  it('LanguageSelector has aria-haspopup for dropdown', () => {
    const content = readFileSync(resolve(COMPONENTS_DIR, 'LanguageSelector.tsx'), 'utf-8');
    expect(content).toContain('aria-haspopup');
    expect(content).toContain('aria-expanded');
  });

  it('at least 20 components have aria- attributes', () => {
    let count = 0;
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      if (/aria-/.test(content)) {
        count++;
      }
    }
    expect(count).toBeGreaterThanOrEqual(20);
  });

  it('no orphaned aria-controls without matching id', () => {
    const violations: string[] = [];
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      const controlsMatches = content.matchAll(/aria-controls="([^"]+)"/g);
      for (const match of controlsMatches) {
        const targetId = match[1];
        if (!content.includes(`id="${targetId}"`)) {
          const name = file.split('/').pop() ?? file;
          violations.push(`${name}: aria-controls="${targetId}" has no matching id`);
        }
      }
    }
    expect(violations, `Orphaned aria-controls:\n${violations.join('\n')}`).toEqual([]);
  });
});
