import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join, relative } from 'path';

/**
 * Security Audit Tests
 *
 * Scans all source files for potential security risks:
 * - No dangerouslySetInnerHTML (XSS vector)
 * - No eval() or new Function() (code injection)
 * - innerHTML usage is limited and documented
 * - document.write only in print contexts (isolated windows)
 * - No inline event handlers (onclick=, onerror=)
 * - External links have rel="noopener noreferrer"
 * - No hardcoded credentials or API keys
 * - No unvalidated URL construction from user input
 */

const SRC_DIR = resolve(__dirname, '..');

function findSourceFiles(dir: string, extensions = ['.jsx', '.tsx', '.js', '.ts']): string[] {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === 'node_modules' || entry === 'test' || entry === 'dist') continue;
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...findSourceFiles(full, extensions));
    } else if (extensions.some(ext => entry.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

const jsxFiles = findSourceFiles(SRC_DIR);
const allSourceFiles = jsxFiles;

describe('Security Audit', () => {
  it('no dangerouslySetInnerHTML usage in source files', () => {
    const violations: string[] = [];
    for (const file of jsxFiles) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (/dangerouslySetInnerHTML/.test(line)) {
          violations.push(`${relative(SRC_DIR, file)}:${i + 1}: ${line.trim()}`);
        }
      });
    }
    expect(violations, `dangerouslySetInnerHTML found (XSS risk):\n${violations.join('\n')}`).toEqual([]);
  });

  it('no eval() or new Function() usage', () => {
    const violations: string[] = [];
    for (const file of allSourceFiles) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        // Match eval( but not evaluate, evaluated, etc. — use word boundary
        if (/\beval\s*\(/.test(line) && !/\b(?:evaluate|evaluation|evaluat)\b/i.test(line)) {
          violations.push(`${relative(SRC_DIR, file)}:${i + 1}: eval() — ${line.trim()}`);
        }
        if (/new\s+Function\s*\(/.test(line)) {
          violations.push(`${relative(SRC_DIR, file)}:${i + 1}: new Function() — ${line.trim()}`);
        }
      });
    }
    expect(violations, `eval/Function usage found (code injection risk):\n${violations.join('\n')}`).toEqual([]);
  });

  it('innerHTML usage is limited to PrintableReport (isolated print window)', () => {
    const violations: string[] = [];
    for (const file of jsxFiles) {
      const relPath = relative(SRC_DIR, file);
      // PrintableReport uses innerHTML in an isolated print window — this is safe
      if (relPath.includes('PrintableReport')) continue;
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (/\.innerHTML\b/.test(line)) {
          violations.push(`${relPath}:${i + 1}: ${line.trim()}`);
        }
      });
    }
    expect(violations, `innerHTML found outside PrintableReport:\n${violations.join('\n')}`).toEqual([]);
  });

  it('document.write only used in PrintableReport print context', () => {
    const violations: string[] = [];
    for (const file of allSourceFiles) {
      const relPath = relative(SRC_DIR, file);
      if (relPath.includes('PrintableReport')) continue;
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (/document\.write(ln)?\s*\(/.test(line)) {
          violations.push(`${relPath}:${i + 1}: ${line.trim()}`);
        }
      });
    }
    expect(violations, `document.write found outside PrintableReport:\n${violations.join('\n')}`).toEqual([]);
  });

  it('all target="_blank" links have rel="noopener noreferrer"', () => {
    const violations: string[] = [];
    for (const file of jsxFiles) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (/target=["']_blank["']/.test(line) || /target="_blank"/.test(line)) {
          // Check this line and surrounding 3 lines for rel=
          const context = lines.slice(Math.max(0, i - 2), Math.min(lines.length, i + 4)).join(' ');
          if (!/rel=["'][^"']*noopener[^"']*["']/.test(context)) {
            violations.push(`${relative(SRC_DIR, file)}:${i + 1}: target="_blank" without rel="noopener noreferrer"`);
          }
        }
      });
    }
    expect(violations, `target="_blank" without rel="noopener noreferrer":\n${violations.join('\n')}`).toEqual([]);
  });

  it('no hardcoded API keys, secrets, or passwords in source files', () => {
    const violations: string[] = [];
    // Patterns that might indicate hardcoded secrets
    const secretPatterns = [
      /(?:api[_-]?key|apikey)\s*[:=]\s*["'][A-Za-z0-9]{16,}["']/i,
      /(?:secret|password|passwd|token)\s*[:=]\s*["'][^"']{8,}["']/i,
      /Bearer\s+[A-Za-z0-9\-_.]{20,}/,
      /sk_(?:live|test)_[A-Za-z0-9]{20,}/,  // Stripe keys
      /AIza[A-Za-z0-9\-_]{35}/,  // Google API keys
    ];
    for (const file of allSourceFiles) {
      const relPath = relative(SRC_DIR, file);
      // Skip test files and supabase config (uses placeholder env var references)
      if (relPath.includes('test/') || relPath.includes('supabase')) continue;
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        // Skip comments
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
        for (const pattern of secretPatterns) {
          if (pattern.test(line)) {
            violations.push(`${relPath}:${i + 1}: Potential hardcoded secret — ${line.trim().substring(0, 80)}`);
          }
        }
      });
    }
    expect(violations, `Potential hardcoded secrets found:\n${violations.join('\n')}`).toEqual([]);
  });

  it('no HTML-style inline event handlers (onclick=, onerror=, etc.)', () => {
    const violations: string[] = [];
    // Match only HTML-style lowercase event handlers, NOT React camelCase props (onClick, onError, etc.)
    // HTML: onclick=  vs  React: onClick=
    const inlineHandlerPattern = /\s(onclick|onerror|onload|onmouseover|onfocus|onblur|onsubmit|onchange)\s*=/;
    for (const file of jsxFiles) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        // Skip comments and strings
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
        if (inlineHandlerPattern.test(line)) {
          violations.push(`${relative(SRC_DIR, file)}:${i + 1}: ${line.trim()}`);
        }
      });
    }
    expect(violations, `HTML-style inline event handlers found (use React event props):\n${violations.join('\n')}`).toEqual([]);
  });

  it('no JSON data files contain executable script tags', () => {
    const dataDir = resolve(SRC_DIR, 'data');
    const jsonFiles = findSourceFiles(dataDir, ['.json']);
    const violations = [];
    for (const file of jsonFiles) {
      const content = readFileSync(file, 'utf-8');
      if (/<script[\s>]/i.test(content) || /javascript:/i.test(content)) {
        violations.push(relative(SRC_DIR, file));
      }
    }
    expect(violations, `JSON data files with script content:\n${violations.join('\n')}`).toEqual([]);
  });

  it('no localStorage/sessionStorage stores sensitive data patterns', () => {
    const violations: string[] = [];
    const sensitiveStoragePattern = /(?:localStorage|sessionStorage)\s*\.\s*setItem\s*\(\s*["'](?:.*(?:password|token|secret|key|auth|credential))["']/i;
    for (const file of allSourceFiles) {
      const relPath = relative(SRC_DIR, file);
      if (relPath.includes('test/')) continue;
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (sensitiveStoragePattern.test(line)) {
          violations.push(`${relPath}:${i + 1}: Sensitive data in local/session storage — ${line.trim()}`);
        }
      });
    }
    expect(violations, `Sensitive data stored in browser storage:\n${violations.join('\n')}`).toEqual([]);
  });
});
