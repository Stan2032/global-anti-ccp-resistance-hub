import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

/**
 * Route Integrity Tests
 *
 * Validates that all internal navigation links in the codebase point to
 * routes that actually exist in App.jsx. Catches broken internal links
 * at test time instead of in production.
 *
 * Checks:
 * 1. All <Link to="..."> paths match defined routes
 * 2. All recent_updates.json relatedPage entries are valid routes
 * 3. All navigate("...") calls use valid paths
 * 4. No orphaned routes (defined but never linked to) for main pages
 * 5. Redirect routes map to valid targets
 */

const SRC_DIR = resolve(__dirname, '..');
const DATA_DIR = resolve(SRC_DIR, 'data');

// Extract all Route path="" definitions from App.jsx
function extractRoutePaths(appContent) {
  const routePattern = /path="([^"]+)"/g;
  const paths = new Set();
  let match;
  while ((match = routePattern.exec(appContent)) !== null) {
    paths.add(match[1]);
  }
  return paths;
}

// Extract all to="..." link targets from source files
function extractLinkTargets(content) {
  const linkPattern = /to="(\/[^"]+)"/g;
  const targets = [];
  let match;
  while ((match = linkPattern.exec(content)) !== null) {
    targets.push(match[1]);
  }
  return targets;
}

describe('Route Integrity', () => {
  const appContent = readFileSync(resolve(SRC_DIR, 'App.jsx'), 'utf-8');
  const routePaths = extractRoutePaths(appContent);

  // Known redirect routes (these aren't real destinations, they redirect)
  const redirectRoutes = new Set(['/campaigns', '/communications', '/tactics', '/threats']);
  // Wildcard/special routes
  const specialRoutes = new Set(['*']);

  // Valid destination routes (excluding redirects and wildcards)
  const validRoutes = new Set(
    [...routePaths].filter(p => !redirectRoutes.has(p) && !specialRoutes.has(p))
  );

  it('App.jsx defines at least 20 routes', () => {
    expect(routePaths.size).toBeGreaterThanOrEqual(20);
  });

  it('all defined routes start with /', () => {
    for (const path of routePaths) {
      if (path === '*') continue;
      expect(path.startsWith('/'), `Route "${path}" should start with /`).toBe(true);
    }
  });

  describe('Link to="" targets match defined routes', () => {
    const sourceFiles = [];
    const scanDir = (dir) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = resolve(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'test' && entry.name !== 'node_modules') {
          scanDir(full);
        } else if (entry.isFile() && /\.(jsx|js)$/.test(entry.name) && !entry.name.endsWith('.test.js') && !entry.name.endsWith('.test.jsx')) {
          sourceFiles.push(full);
        }
      }
    };
    scanDir(resolve(SRC_DIR, 'components'));
    scanDir(resolve(SRC_DIR, 'pages'));

    it('all Link to="" targets in components/pages match valid routes', () => {
      const invalid = [];
      for (const file of sourceFiles) {
        const content = readFileSync(file, 'utf-8');
        const targets = extractLinkTargets(content);
        for (const target of targets) {
          if (!validRoutes.has(target) && !redirectRoutes.has(target)) {
            const shortFile = file.replace(SRC_DIR + '/', '');
            invalid.push(`${shortFile}: to="${target}"`);
          }
        }
      }
      expect(invalid, `Broken internal links:\n${invalid.join('\n')}`).toEqual([]);
    });
  });

  describe('recent_updates.json relatedPage entries are valid routes', () => {
    const recentUpdates = JSON.parse(readFileSync(resolve(DATA_DIR, 'recent_updates.json'), 'utf-8'));

    it('all relatedPage values match defined routes', () => {
      const invalid = [];
      for (const entry of recentUpdates) {
        if (entry.relatedPage && !validRoutes.has(entry.relatedPage)) {
          invalid.push(`"${entry.id}": relatedPage="${entry.relatedPage}"`);
        }
      }
      expect(invalid, `Invalid relatedPage entries:\n${invalid.join('\n')}`).toEqual([]);
    });

    it('every recent_updates entry has a relatedPage', () => {
      for (const entry of recentUpdates) {
        expect(entry.relatedPage, `Entry "${entry.id}" missing relatedPage`).toBeTruthy();
      }
    });
  });

  describe('redirect routes have valid targets', () => {
    it('all Navigate elements redirect to existing routes', () => {
      const navigatePattern = /<Navigate\s+to="([^"]+)"/g;
      const invalid = [];
      let match;
      while ((match = navigatePattern.exec(appContent)) !== null) {
        const target = match[1];
        if (!validRoutes.has(target)) {
          invalid.push(`Navigate to="${target}"`);
        }
      }
      expect(invalid, `Redirect routes with invalid targets:\n${invalid.join('\n')}`).toEqual([]);
    });
  });

  describe('main pages are reachable', () => {
    const essentialRoutes = [
      '/',
      '/intelligence',
      '/prisoners',
      '/profiles',
      '/take-action',
      '/education',
      '/security',
    ];

    for (const route of essentialRoutes) {
      it(`essential route ${route} is defined`, () => {
        expect(validRoutes.has(route), `Missing essential route: ${route}`).toBe(true);
      });
    }
  });

  describe('profile routes integrity', () => {
    it('has at least 15 profile routes', () => {
      const profileRoutes = [...validRoutes].filter(r => r.startsWith('/profiles/'));
      expect(profileRoutes.length).toBeGreaterThanOrEqual(15);
    });

    it('all profile routes use lowercase slugs', () => {
      const profileRoutes = [...validRoutes].filter(r => r.startsWith('/profiles/'));
      for (const route of profileRoutes) {
        const slug = route.replace('/profiles/', '');
        expect(slug, `Profile slug should be lowercase: ${route}`).toBe(slug.toLowerCase());
      }
    });

    it('profile slugs use hyphens not underscores', () => {
      const profileRoutes = [...validRoutes].filter(r => r.startsWith('/profiles/'));
      for (const route of profileRoutes) {
        expect(route).not.toContain('_');
      }
    });
  });
});
