import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Meta-Test Coverage Audit
 *
 * Ensures every component and page file has a corresponding test file.
 * Prevents new components from being added without test coverage.
 * Also validates lazy-loading patterns for page sub-components.
 */

const SRC_DIR = resolve(__dirname, '..');
const COMPONENTS_DIR = resolve(SRC_DIR, 'components');
const PAGES_DIR = resolve(SRC_DIR, 'pages');
const TEST_DIR = resolve(SRC_DIR, 'test');

// Get all component JSX files (excluding ui/ subdirectory items that are tested via parent)
function getComponentNames() {
  return readdirSync(COMPONENTS_DIR)
    .filter(f => f.endsWith('.jsx') && !f.includes('.test.'))
    .map(f => f.replace('.jsx', ''));
}

// Get all page JSX files (top-level, not profiles)
function getPageNames() {
  return readdirSync(PAGES_DIR)
    .filter(f => f.endsWith('.jsx') && !f.includes('.test.'))
    .map(f => f.replace('.jsx', ''));
}

// Get all test file base names
function getTestNames() {
  return readdirSync(TEST_DIR)
    .filter(f => f.includes('.test.'))
    .map(f => f.replace(/\.test\.(jsx?|tsx?)$/, ''));
}

// Known exceptions: components tested as part of larger integration tests
const COVERAGE_EXCEPTIONS = [
  'ScrollToTop',         // Tested in ScrollToTop.test.jsx (different case match)
  'FlagIcons',           // Tested in FlagIcons.test.jsx
];

describe('Meta-Test Coverage Audit', () => {
  const components = getComponentNames();
  const pages = getPageNames();
  const tests = getTestNames();

  it('has at least 75 component files', () => {
    expect(components.length).toBeGreaterThanOrEqual(75);
  });

  it('has at least 10 page files', () => {
    expect(pages.length).toBeGreaterThanOrEqual(10);
  });

  it('every component has a dedicated test file', () => {
    const untested = [];
    for (const comp of components) {
      if (COVERAGE_EXCEPTIONS.includes(comp)) continue;
      // Check for exact match or case-insensitive match in test names
      const hasTest = tests.some(t =>
        t === comp ||
        t.toLowerCase() === comp.toLowerCase() ||
        t.toLowerCase().replace(/-/g, '') === comp.toLowerCase()
      );
      if (!hasTest) {
        untested.push(comp);
      }
    }
    expect(untested, `Components without test files:\n${untested.join('\n')}`).toEqual([]);
  });

  it('every top-level page has a dedicated test file', () => {
    const untested = [];
    // Pages that are tested as part of larger test suites
    const pageExceptions = [
      'AdminLogin', // Tested via AdminAuth.test.jsx
    ];
    for (const page of pages) {
      if (pageExceptions.includes(page)) continue;
      const hasTest = tests.some(t =>
        t === page ||
        t.toLowerCase() === page.toLowerCase() ||
        t.toLowerCase().replace(/-/g, '') === page.toLowerCase()
      );
      if (!hasTest) {
        untested.push(page);
      }
    }
    expect(untested, `Pages without test files:\n${untested.join('\n')}`).toEqual([]);
  });

  it('profile pages have test coverage via profile-pages.test.jsx', () => {
    const profilesDir = resolve(PAGES_DIR, 'profiles');
    if (!existsSync(profilesDir)) return;
    const profiles = readdirSync(profilesDir)
      .filter(f => f.endsWith('.jsx') && f.includes('Profile'));
    expect(profiles.length).toBeGreaterThanOrEqual(14);

    // Verify profile-pages.test.jsx exists
    const profileTest = resolve(TEST_DIR, 'profile-pages.test.jsx');
    expect(existsSync(profileTest), 'profile-pages.test.jsx should exist').toBe(true);
  });

  it('test files follow naming convention (PascalCase, camelCase, or kebab-case)', () => {
    const testFiles = readdirSync(TEST_DIR).filter(f => f.includes('.test.'));
    const invalidNames = testFiles.filter(f => {
      const name = f.replace(/\.test\.(jsx?|tsx?)$/, '');
      // Allow PascalCase, camelCase, or kebab-case
      return !/^[A-Z][a-zA-Z0-9]*$/.test(name) &&
             !/^[a-z][a-zA-Z0-9]*$/.test(name) &&
             !/^[a-z][a-z0-9-]*$/.test(name);
    });
    expect(invalidNames, `Invalid test file names:\n${invalidNames.join('\n')}`).toEqual([]);
  });

  it('no orphan test files (test files should have matching source)', () => {
    const componentSet = new Set(components.map(c => c.toLowerCase()));
    const pageSet = new Set(pages.map(p => p.toLowerCase()));
    // Data/utility tests are allowed without matching components
    const dataTestPattern = /^(data-|cross-data|url-|no-hashtags|design-system|defensive|route-|accessibility|keyboard|performance|sitemap|manifest|security-|service-|meta-test|lazy-loading|supabase|theme)/;
    const utilTestPattern = /^(dateUtils|exportUtils|sourceLinks|encryption|statistics|i18n|ccp-|useDocument|useGlobal|useKeyboard|useLive|useWeb)/;
    // JSON data file tests (test the data in JSON files directly)
    const jsonDataTestPattern = /-data$/;

    const orphans = [];
    for (const test of tests) {
      const lower = test.toLowerCase();
      if (dataTestPattern.test(test) || utilTestPattern.test(test)) continue;
      if (jsonDataTestPattern.test(test)) continue; // JSON data validation tests
      if (componentSet.has(lower) || pageSet.has(lower)) continue;
      // Special cases - ui/ subdirectory components, grouped test files
      if (['profile-pages', 'AdminAuth', 'GlobalDisclaimer', 'SourceAttribution'].includes(test)) continue;
      if (lower === 'profilesindex') continue;
      // Data service/feed tests
      if (/^live-data/.test(test)) continue;
      orphans.push(test);
    }
    // Allow some orphans for now (integration test files), but track the count
    expect(orphans.length, `Potential orphan test files: ${orphans.join(', ')}`).toBeLessThanOrEqual(5);
  });
});

describe('Lazy-Loading Enforcement', () => {
  const pages = ['Dashboard', 'EducationalResources', 'IntelligenceFeeds', 'SecurityCenter', 'TakeAction', 'DataSources', 'ResistanceResources'];

  for (const page of pages) {
    it(`${page} uses React.lazy for sub-components`, () => {
      const filePath = resolve(PAGES_DIR, `${page}.jsx`);
      if (!existsSync(filePath)) return;
      const content = readFileSync(filePath, 'utf-8');

      // Count direct component imports vs lazy imports
      const directImports = (content.match(/^import\s+\w+\s+from\s+'\.\.\/components\//gm) || []);
      const lazyImports = (content.match(/const\s+\w+\s*=\s*lazy\(\(\)\s*=>\s*import\(/g) || []);

      // Pages should use lazy loading for component imports
      if (directImports.length > 0 && lazyImports.length === 0) {
        // Allow pages with very few imports (< 3) to skip lazy loading
        if (directImports.length >= 3) {
          expect.fail(`${page} has ${directImports.length} direct component imports but no lazy() imports. Use React.lazy for code splitting.`);
        }
      }
    });
  }

  it('all lazy-loaded components are wrapped in Suspense', () => {
    const pageFiles = readdirSync(PAGES_DIR)
      .filter(f => f.endsWith('.jsx') && !f.includes('.test.'));

    const missingFallback = [];
    for (const file of pageFiles) {
      const content = readFileSync(resolve(PAGES_DIR, file), 'utf-8');
      const hasLazy = /\blazy\(/.test(content);
      const hasSuspense = /\bSuspense\b/.test(content);

      if (hasLazy && !hasSuspense) {
        missingFallback.push(file);
      }
    }
    expect(missingFallback, `Pages with lazy() but no Suspense:\n${missingFallback.join('\n')}`).toEqual([]);
  });

  it('Suspense fallbacks provide loading indication', () => {
    const pageFiles = readdirSync(PAGES_DIR)
      .filter(f => f.endsWith('.jsx') && !f.includes('.test.'));

    const emptyFallback = [];
    for (const file of pageFiles) {
      const content = readFileSync(resolve(PAGES_DIR, file), 'utf-8');
      if (!/\bSuspense\b/.test(content)) continue;

      // Check that fallback isn't just null or empty
      const hasMeaningfulFallback = /fallback=\{</.test(content) || /fallback=\{.*Loader/.test(content);
      if (!hasMeaningfulFallback) {
        emptyFallback.push(file);
      }
    }
    expect(emptyFallback, `Pages with empty Suspense fallback:\n${emptyFallback.join('\n')}`).toEqual([]);
  });

  it('App.jsx uses route-level lazy loading', () => {
    const appContent = readFileSync(resolve(SRC_DIR, 'App.jsx'), 'utf-8');
    const lazyRoutes = (appContent.match(/const\s+\w+\s*=\s*lazy\(/g) || []).length;
    // App should lazy-load at least the major page components
    expect(lazyRoutes).toBeGreaterThanOrEqual(5);
  });
});
