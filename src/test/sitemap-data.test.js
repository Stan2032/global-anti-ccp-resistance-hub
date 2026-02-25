import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const PUBLIC_DIR = resolve(__dirname, '../../public');
const SITEMAP_PATH = resolve(PUBLIC_DIR, 'sitemap.xml');
const ROBOTS_PATH = resolve(PUBLIC_DIR, 'robots.txt');
const BASE_URL = 'https://global-anti-ccp-resistance-hub.stane203.workers.dev';

describe('Sitemap Data Integrity', () => {
  let sitemapContent;
  let urls;
  let robotsContent;

  beforeAll(() => {
    sitemapContent = readFileSync(SITEMAP_PATH, 'utf-8');
    robotsContent = readFileSync(ROBOTS_PATH, 'utf-8');
    // Extract all <loc> URLs from sitemap
    urls = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  });

  it('is valid XML with urlset root element', () => {
    expect(sitemapContent).toContain('<?xml version="1.0"');
    expect(sitemapContent).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(sitemapContent).toContain('</urlset>');
  });

  it('has exactly 26 URLs (11 main pages + 15 profiles)', () => {
    expect(urls.length).toBe(26);
  });

  it('all URLs use the correct base URL', () => {
    for (const url of urls) {
      expect(url.startsWith(BASE_URL), `URL does not use correct base: ${url}`).toBe(true);
    }
  });

  describe('includes all main page routes', () => {
    const mainRoutes = [
      '/',
      '/intelligence',
      '/prisoners',
      '/take-action',
      '/directory',
      '/community',
      '/education',
      '/security',
      '/resources',
      '/data-sources',
      '/profiles',
    ];

    for (const route of mainRoutes) {
      it(`includes ${route}`, () => {
        const fullUrl = `${BASE_URL}${route}`;
        expect(urls, `Missing route: ${route}`).toContain(fullUrl);
      });
    }
  });

  describe('includes all 15 profile pages', () => {
    const profileSlugs = [
      'jimmy-lai',
      'ilham-tohti',
      'panchen-lama',
      'liu-xiaobo',
      'joshua-wong',
      'gui-minhai',
      'zhang-zhan',
      'gao-zhisheng',
      'benny-tai',
      'nathan-law',
      'cardinal-zen',
      'agnes-chow',
      'tashi-wangchuk',
      'ren-zhiqiang',
      'xu-zhiyong',
    ];

    for (const slug of profileSlugs) {
      it(`includes /profiles/${slug}`, () => {
        const fullUrl = `${BASE_URL}/profiles/${slug}`;
        expect(urls, `Missing profile: ${slug}`).toContain(fullUrl);
      });
    }
  });

  describe('does not include redirect routes', () => {
    const redirectRoutes = ['/threats', '/campaigns', '/tactics', '/communications'];

    for (const route of redirectRoutes) {
      it(`does not include ${route} (consolidated redirect)`, () => {
        const fullUrl = `${BASE_URL}${route}`;
        expect(urls, `Sitemap should not include redirect route: ${route}`).not.toContain(fullUrl);
      });
    }
  });

  describe('lastmod dates are valid', () => {
    it('all entries have lastmod in YYYY-MM-DD format', () => {
      const lastmods = [...sitemapContent.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1]);
      expect(lastmods.length).toBe(urls.length);
      for (const date of lastmods) {
        expect(date, `Invalid lastmod date: ${date}`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });
  });

  describe('priority values are valid', () => {
    it('all entries have priority between 0.0 and 1.0', () => {
      const priorities = [...sitemapContent.matchAll(/<priority>([^<]+)<\/priority>/g)].map(m => parseFloat(m[1]));
      expect(priorities.length).toBe(urls.length);
      for (const p of priorities) {
        expect(p).toBeGreaterThanOrEqual(0.0);
        expect(p).toBeLessThanOrEqual(1.0);
      }
    });

    it('homepage has highest priority (1.0)', () => {
      // Find the entry for the homepage
      const escapedBase = BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const homepageMatch = sitemapContent.match(
        new RegExp(`<loc>${escapedBase}/</loc>[\\s\\S]*?<priority>([^<]+)</priority>`)
      );
      expect(homepageMatch).not.toBeNull();
      expect(parseFloat(homepageMatch[1])).toBe(1.0);
    });
  });

  describe('changefreq values are valid', () => {
    const validFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

    it('all entries have valid changefreq', () => {
      const freqs = [...sitemapContent.matchAll(/<changefreq>([^<]+)<\/changefreq>/g)].map(m => m[1]);
      expect(freqs.length).toBe(urls.length);
      for (const freq of freqs) {
        expect(validFreqs, `Invalid changefreq: ${freq}`).toContain(freq);
      }
    });
  });

  describe('no stale GitHub Pages URLs', () => {
    it('sitemap does not reference github.io', () => {
      expect(sitemapContent).not.toContain('github.io');
    });
  });

  describe('robots.txt', () => {
    it('allows all crawlers', () => {
      expect(robotsContent).toContain('User-agent: *');
      expect(robotsContent).toContain('Allow: /');
    });

    it('references sitemap with canonical URL', () => {
      expect(robotsContent).toContain(`Sitemap: ${BASE_URL}/sitemap.xml`);
    });

    it('does not block any content paths', () => {
      expect(robotsContent).not.toContain('Disallow: /');
    });

    it('has crawl-delay for respectful crawling', () => {
      expect(robotsContent).toMatch(/Crawl-delay:\s*\d+/);
    });
  });
});
