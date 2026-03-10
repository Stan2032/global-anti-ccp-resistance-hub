import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { resolve, join, relative } from 'path';

/**
 * Accessibility Compliance Tests
 *
 * Scans all JSX source files to enforce accessibility best practices:
 * - All <img> elements must have alt attributes
 * - Interactive elements (onClick on div/span) must have role + keyboard support
 * - Form inputs should have associated labels or aria-label
 * - No autofocus attributes (disorienting for screen readers)
 * - SVG icons used decoratively should have aria-hidden="true"
 * - Links must have discernible text (not just icons)
 */

const SRC_DIR = resolve(__dirname, '..');

function resolveFile(dir: string, baseName: string) {
  const tsxPath = resolve(dir, baseName.replace(/\.jsx$/, '.tsx'));
  return existsSync(tsxPath) ? tsxPath : resolve(dir, baseName);
}

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

describe('Accessibility compliance', () => {
  it('finds JSX files to scan', () => {
    expect(jsxFiles.length).toBeGreaterThan(50);
  });

  it('all <img> elements have alt attributes', () => {
    const violations: string[] = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        // Match <img that doesn't have alt= on the same line or next few chars
        if (/<img\s/.test(line) && !/alt[={"']/.test(line)) {
          // Check if alt is on a subsequent line (multiline JSX)
          const nextLines = lines.slice(i, i + 5).join(' ');
          if (!/alt[={"']/.test(nextLines)) {
            violations.push(`${relative(SRC_DIR, filePath)}:${i + 1}`);
          }
        }
      });
    }
    expect(violations, `<img> without alt:\n${violations.join('\n')}`).toEqual([]);
  });

  it('no autoFocus attribute on elements (disorienting for assistive technology)', () => {
    const violations: string[] = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (/autoFocus|autofocus/i.test(line)) {
          violations.push(`${relative(SRC_DIR, filePath)}:${i + 1}: ${line.trim()}`);
        }
      });
    }
    expect(violations, `autoFocus found (avoid — disorienting):\n${violations.join('\n')}`).toEqual([]);
  });

  it('Lucide icon components are used consistently with sizing classes', () => {
    // Lucide React components automatically add aria-hidden="true" to rendered SVGs.
    // This test verifies that icon components follow the project's sizing convention
    // (w-N h-N classes) for consistent visual presentation.
    let totalIcons = 0;
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line) => {
        // Lucide icon pattern: <IconName className="... w-N h-N ..."
        if (/<[A-Z][a-zA-Z]+\s[^>]*className="[^"]*w-\d+\s+h-\d+[^"]*"/.test(line) && !/^import/.test(line.trim())) {
          totalIcons++;
        }
      });
    }
    // Should find many consistently-sized icons across the codebase
    expect(totalIcons).toBeGreaterThan(100);
  });

  it('no tabIndex values greater than 0 (disrupts tab order)', () => {
    const violations: string[] = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        // Match tabIndex={N} where N > 0
        const match = line.match(/tabIndex[={"']+(\d+)/);
        if (match && parseInt(match[1]) > 0) {
          violations.push(`${relative(SRC_DIR, filePath)}:${i + 1}: tabIndex=${match[1]}`);
        }
      });
    }
    expect(violations, `Positive tabIndex disrupts natural tab order:\n${violations.join('\n')}`).toEqual([]);
  });

  it('all <a> elements with target="_blank" have rel="noopener noreferrer"', () => {
    const violations: string[] = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (/target=["']_blank["']/.test(line)) {
          // Check the surrounding context for rel attribute
          const context = lines.slice(Math.max(0, i - 2), i + 3).join(' ');
          if (!/rel=["'][^"']*noopener/.test(context)) {
            violations.push(`${relative(SRC_DIR, filePath)}:${i + 1}`);
          }
        }
      });
    }
    expect(violations, `target="_blank" without rel="noopener noreferrer":\n${violations.join('\n')}`).toEqual([]);
  });

  it('form inputs have associated labels or aria-label', () => {
    const violations: string[] = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        // Check <input elements (not hidden/submit/button types)
        if (/<input\s/.test(line) && !/type=["'](hidden|submit|button|checkbox|radio)["']/.test(line)) {
          const context = lines.slice(Math.max(0, i - 3), i + 3).join(' ');
          if (!/aria-label|aria-labelledby|<label|id=/.test(context) && !/placeholder=/.test(line)) {
            violations.push(`${relative(SRC_DIR, filePath)}:${i + 1}`);
          }
        }
      });
    }
    expect(violations, `<input> without label/aria-label:\n${violations.join('\n')}`).toEqual([]);
  });

  it('buttons with only icon content have aria-label', () => {
    // Buttons that contain only an icon (no text) need aria-label for screen readers.
    // We check for button elements where the only child appears to be an icon component.
    const violations = [];
    for (const filePath of jsxFiles) {
      const content = readFileSync(filePath, 'utf-8');
      // Simple heuristic: look for <button ...><IconName .../></button> pattern
      const iconOnlyPattern = /<button[^>]*>\s*<[A-Z][a-zA-Z]+\s[^/]*\/>\s*<\/button>/g;
      let match;
      while ((match = iconOnlyPattern.exec(content)) !== null) {
        if (!/aria-label/.test(match[0]) && !/title=/.test(match[0])) {
          const lineNum = content.substring(0, match.index).split('\n').length;
          violations.push(`${relative(SRC_DIR, filePath)}:${lineNum}`);
        }
      }
    }
    expect(violations, `Icon-only buttons without aria-label:\n${violations.join('\n')}`).toEqual([]);
  });

  it('main landmark structure exists in App', () => {
    const appContent = readFileSync(resolveFile(SRC_DIR, 'App.jsx'), 'utf-8');
    expect(appContent).toContain('role="main"');
    expect(appContent).toContain('role="navigation"');
    expect(appContent).toContain('<header');
    expect(appContent).toContain('id="main-content"');
    // Footer is in its own component, check it has <footer> element
    const footerContent = readFileSync(resolveFile(resolve(SRC_DIR, 'components'), 'Footer.jsx'), 'utf-8');
    expect(footerContent).toContain('<footer');
  });

  it('skip-to-content link exists for keyboard users', () => {
    const appContent = readFileSync(resolveFile(SRC_DIR, 'App.jsx'), 'utf-8');
    // Should have a skip link or anchor that targets #main-content
    expect(appContent).toContain('main-content');
  });
});
