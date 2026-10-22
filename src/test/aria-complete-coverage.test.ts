import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';

/**
 * Tests that ALL interactive components have ARIA attributes.
 * This is the final coverage check — every component with tabs/filters should have ARIA.
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

describe('ARIA Complete Coverage — Final Batch', () => {
  const componentFiles = getComponentFiles();

  // These filter one list. They were marked up as tabs, so a screen reader
  // announced "tab, 1 of 6" and promised a panel for each. They are toggle
  // buttons in a named group; src/test/accessibility-filter-bars.test.tsx checks them.
  const filterComponents = [
    'IPACMembers.tsx',
    'DiasporaSupport.tsx',
  ];

  for (const name of filterComponents) {
    it(`${name} filters with toggle buttons in a named group, not tabs`, () => {
      const file = componentFiles.find(f => f.endsWith(`/${name}`));
      expect(file, `${name} not found`).toBeTruthy();
      const content = readFileSync(file!, 'utf-8');
      expect(content).toContain('role="group"');
      expect(content).toContain('aria-pressed');
      expect(content).not.toContain('role="tab');
    });
  }

  // These used to be tabbed. They now use native <details> sections, which
  // the browser exposes as disclosure widgets without any extra ARIA, and
  // which work before (or without) JavaScript.
  const disclosureComponents = [
    'HongKongStatus.tsx',
    'TaiwanDefenseStatus.tsx',
    'TibetStatus.tsx',
    'XinjiangStatus.tsx',
    'LanguageGuide.tsx',
    'SafetyChecklist.tsx',
    'ContactRepresentatives.tsx',
  ];

  for (const name of disclosureComponents) {
    it(`${name} uses native disclosure sections, not a tab widget`, () => {
      const file = componentFiles.find(f => f.endsWith(`/${name}`));
      expect(file, `${name} not found`).toBeTruthy();
      const content = readFileSync(file!, 'utf-8');
      expect(content).toContain('<DisclosureSection');
      expect(content).not.toContain('role="tab');
    });
  }

  // A tab widget renders one panel at a time, so without JavaScript every
  // other panel is missing from the page; show and hide with <details>
  // instead. A row of buttons over one list is a filter, not tabs.
  it('nothing in src uses the tab roles', () => {
    const sources: string[] = [];
    (function scan(dir: string): void {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
          if (entry !== 'test') scan(full);
        } else if (full.endsWith('.tsx') && !full.includes('.test.')) {
          sources.push(full);
        }
      }
    })(resolve(__dirname, '..'));
    expect(sources.length).toBeGreaterThan(componentFiles.length);

    const offenders = sources
      .filter(file => /role="tab(?:list|panel)?"/.test(readFileSync(file, 'utf-8')))
      .map(file => file.split('/src/')[1]);
    expect(offenders).toEqual([]);
  });

  it('ErrorBoundary has aria-label on action buttons', () => {
    const file = componentFiles.find(f => f.endsWith('/ErrorBoundary.tsx'));
    expect(file).toBeTruthy();
    const content = readFileSync(file!, 'utf-8');
    expect(content).toContain('aria-label');
  });

  it('WorldThreatMap has aria-label on SVG and region buttons', () => {
    const file = componentFiles.find(f => f.endsWith('/WorldThreatMap.tsx'));
    expect(file).toBeTruthy();
    const content = readFileSync(file!, 'utf-8');
    expect(content).toContain('role="img"');
    expect(content).toContain('aria-label');
  });

  it('100% of interactive components now have ARIA attributes', () => {
    let withAria = 0;
    let withInteraction = 0;
    for (const file of componentFiles) {
      const content = readFileSync(file, 'utf-8');
      const hasInteraction = /onClick|onChange|onSubmit/.test(content) && /useState/.test(content);
      if (hasInteraction) {
        withInteraction++;
        if (/aria-/.test(content)) {
          withAria++;
        }
      }
    }
    expect(withInteraction).toBeGreaterThan(30);
    expect(withAria).toBe(withInteraction);
  });
});
