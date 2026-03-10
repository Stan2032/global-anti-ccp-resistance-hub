import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Performance & Resilience Tests
 *
 * Enforces error boundary patterns and performance best practices:
 * - All lazy-loaded components must be wrapped with error boundaries
 * - Shell components (modals, banners, guides) use ShellErrorBoundary
 * - Footer uses React.memo for render optimization
 * - ErrorBoundary components exist and follow correct patterns
 */

const SRC_DIR = resolve(__dirname, '..');

function resolveFile(dir: string, baseName: string) {
  const tsxPath = resolve(dir, baseName.replace(/\.jsx$/, '.tsx'));
  return existsSync(tsxPath) ? tsxPath : resolve(dir, baseName);
}

const appContent = readFileSync(resolveFile(SRC_DIR, 'App.jsx'), 'utf-8');

describe('Performance & resilience', () => {
  it('App imports ShellErrorBoundary', () => {
    expect(appContent).toContain("import ShellErrorBoundary from './components/ShellErrorBoundary'");
  });

  it('all Suspense-wrapped shell components have ShellErrorBoundary', () => {
    // Shell components (outside RouteErrorBoundary) with Suspense should also have ShellErrorBoundary
    const shellComponents = ['GlobalSearch', 'QuickStartGuide', 'PWAInstallBanner'];
    for (const comp of shellComponents) {
      // Find the Suspense block containing this component
      const regex = new RegExp(`<ShellErrorBoundary>[\\s\\S]*?<${comp}`, 'm');
      expect(appContent, `${comp} should be wrapped in ShellErrorBoundary`).toMatch(regex);
    }
  });

  it('KeyboardShortcutsHelp has ShellErrorBoundary', () => {
    const regex = /<ShellErrorBoundary>[\s\S]*?<KeyboardShortcutsHelp/m;
    expect(appContent).toMatch(regex);
  });

  it('ShellErrorBoundary exists and renders null on error', () => {
    const shellBoundary = readFileSync(resolveFile(resolve(SRC_DIR, 'components'), 'ShellErrorBoundary.jsx'), 'utf-8');
    expect(shellBoundary).toContain('class ShellErrorBoundary');
    expect(shellBoundary).toContain('getDerivedStateFromError');
    expect(shellBoundary).toContain('return null');
    expect(shellBoundary).toContain('componentDidCatch');
  });

  it('ErrorBoundary exists with recovery UI', () => {
    const boundary = readFileSync(resolveFile(resolve(SRC_DIR, 'components'), 'ErrorBoundary.jsx'), 'utf-8');
    expect(boundary).toContain('class ErrorBoundary');
    expect(boundary).toContain('getDerivedStateFromError');
    expect(boundary).toContain('Try Again');
    expect(boundary).toContain('handleReset');
  });

  it('RouteErrorBoundary handles chunk load errors', () => {
    const routeBoundary = readFileSync(resolveFile(resolve(SRC_DIR, 'components'), 'RouteErrorBoundary.jsx'), 'utf-8');
    expect(routeBoundary).toContain('ChunkLoadError');
    expect(routeBoundary).toContain('isChunkError');
    expect(routeBoundary).toContain('Failed to load page');
  });

  it('route content is wrapped with RouteErrorBoundary', () => {
    expect(appContent).toContain('<RouteErrorBoundary>');
    expect(appContent).toContain('</RouteErrorBoundary>');
    // Routes should be inside RouteErrorBoundary
    const routeSection = appContent.match(/<RouteErrorBoundary>[\s\S]*?<\/RouteErrorBoundary>/);
    expect(routeSection).not.toBeNull();
    expect(routeSection![0]).toContain('<Routes>');
  });

  it('Footer uses React.memo for render optimization', () => {
    const footer = readFileSync(resolveFile(resolve(SRC_DIR, 'components'), 'Footer.jsx'), 'utf-8');
    expect(footer).toMatch(/export default React\.memo\(Footer\)/);
  });

  it('top-level App is wrapped with ErrorBoundary', () => {
    // The App function should return content wrapped in ErrorBoundary
    expect(appContent).toMatch(/<ErrorBoundary>[\s\S]*<ThemeProvider>/);
    expect(appContent).toMatch(/<\/ThemeProvider>[\s\S]*<\/ErrorBoundary>/);
  });

  it('three error boundary types cover all error scenarios', () => {
    // Full-page: ErrorBoundary (wraps entire app)
    expect(appContent).toContain('ErrorBoundary');
    // Route-level: RouteErrorBoundary (wraps route content with recovery UI)
    expect(appContent).toContain('RouteErrorBoundary');
    // Shell-level: ShellErrorBoundary (wraps non-critical components, renders null on error)
    expect(appContent).toContain('ShellErrorBoundary');
  });
});
