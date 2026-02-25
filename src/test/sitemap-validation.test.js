import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const PUBLIC_DIR = resolve(__dirname, '../../public');
const CANONICAL_URL = 'https://global-anti-ccp-resistance-hub.stane203.workers.dev';

describe('Sitemap & Robots.txt Validation', () => {
  let sitemapContent;
  let robotsContent;

  beforeAll(() => {
    sitemapContent = readFileSync(resolve(PUBLIC_DIR, 'sitemap.xml'), 'utf-8');
    robotsContent = readFileSync(resolve(PUBLIC_DIR, 'robots.txt'), 'utf-8');
  });

  describe('sitemap.xml structure', () => {
    it('is valid XML with urlset root', () => {
      expect(sitemapContent).toContain('<?xml version="1.0"');
      expect(sitemapContent).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
      expect(sitemapContent).toContain('</urlset>');
    });

    it('uses canonical Cloudflare Workers URL (not GitHub Pages)', () => {
      expect(sitemapContent).not.toContain('github.io');
      expect(sitemapContent).not.toContain('github.com');
      expect(sitemapContent).toContain(CANONICAL_URL);
    });

    it('every <loc> uses the canonical base URL', () => {
      const locs = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
      expect(locs.length).toBeGreaterThan(0);
      for (const loc of locs) {
        const url = loc.replace(/<\/?loc>/g, '');
        expect(url).toMatch(new RegExp(`^${CANONICAL_URL.replace(/\./g, '\\.')}`));
      }
    });

    it('every URL has lastmod, changefreq, and priority', () => {
      const urls = sitemapContent.split('<url>').slice(1); // skip before first <url>
      for (const urlBlock of urls) {
        expect(urlBlock).toContain('<lastmod>');
        expect(urlBlock).toContain('<changefreq>');
        expect(urlBlock).toContain('<priority>');
      }
    });
  });

  describe('sitemap route coverage', () => {
    const REQUIRED_ROUTES = [
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

    const REQUIRED_PROFILES = [
      '/profiles/jimmy-lai',
      '/profiles/ilham-tohti',
      '/profiles/panchen-lama',
      '/profiles/liu-xiaobo',
      '/profiles/joshua-wong',
      '/profiles/gui-minhai',
      '/profiles/zhang-zhan',
      '/profiles/gao-zhisheng',
      '/profiles/benny-tai',
      '/profiles/nathan-law',
      '/profiles/cardinal-zen',
      '/profiles/agnes-chow',
      '/profiles/tashi-wangchuk',
      '/profiles/ren-zhiqiang',
      '/profiles/xu-zhiyong',
    ];

    it('includes all main navigation routes', () => {
      const missing = REQUIRED_ROUTES.filter(
        route => !sitemapContent.includes(`${CANONICAL_URL}${route}<`)
      );
      expect(missing).toEqual([]);
    });

    it('includes all 15 profile pages', () => {
      const missing = REQUIRED_PROFILES.filter(
        route => !sitemapContent.includes(`${CANONICAL_URL}${route}<`)
      );
      expect(missing).toEqual([]);
    });

    it('does NOT include redirect routes (campaigns, communications, tactics, threats)', () => {
      const REDIRECT_ROUTES = ['/campaigns', '/communications', '/tactics', '/threats'];
      for (const route of REDIRECT_ROUTES) {
        expect(sitemapContent).not.toContain(`${CANONICAL_URL}${route}<`);
      }
    });

    it('home page has priority 1.0', () => {
      // Find the home URL block
      const homeBlock = sitemapContent.split('<url>').find(b => 
        b.includes(`${CANONICAL_URL}/</loc>`) || b.includes(`${CANONICAL_URL}</loc>`)
      );
      expect(homeBlock).toBeDefined();
      expect(homeBlock).toContain('<priority>1.0</priority>');
    });
  });

  describe('robots.txt', () => {
    it('allows all crawlers', () => {
      expect(robotsContent).toContain('User-agent: *');
      expect(robotsContent).toContain('Allow: /');
    });

    it('references sitemap with canonical URL', () => {
      expect(robotsContent).toContain(`Sitemap: ${CANONICAL_URL}/sitemap.xml`);
    });

    it('does NOT block any content paths', () => {
      expect(robotsContent).not.toContain('Disallow: /');
    });

    it('has crawl-delay for respectful crawling', () => {
      expect(robotsContent).toMatch(/Crawl-delay:\s*\d+/);
    });
  });
});
