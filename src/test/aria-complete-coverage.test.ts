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

  const tabComponents = [
    'HongKongStatus.tsx',
    'TaiwanDefenseStatus.tsx',
    'TibetStatus.tsx',
    'XinjiangStatus.tsx',
    'IPACMembers.tsx',
    'DiasporaSupport.tsx',
    'LanguageGuide.tsx',
  ];

  for (const name of tabComponents) {
    it(`${name} has role="tablist" and role="tab"`, () => {
      const file = componentFiles.find(f => f.endsWith(`/${name}`));
      expect(file, `${name} not found`).toBeTruthy();
      const content = readFileSync(file!, 'utf-8');
      expect(content).toContain('role="tablist"');
      expect(content).toContain('role="tab"');
      expect(content).toContain('aria-selected');
    });
  }

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
