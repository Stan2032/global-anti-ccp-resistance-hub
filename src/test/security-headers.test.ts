import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const HEADERS_PATH = resolve(__dirname, '../../public/_headers');
const INDEX_PATH = resolve(__dirname, '../../index.html');

describe('Security Headers', () => {
  let headersContent: string;
  let indexContent: string;

  beforeAll(() => {
    headersContent = readFileSync(HEADERS_PATH, 'utf-8');
    indexContent = readFileSync(INDEX_PATH, 'utf-8');
  });

  describe('_headers file', () => {
    it('sets X-Frame-Options to DENY', () => {
      expect(headersContent).toContain('X-Frame-Options: DENY');
    });

    it('sets X-Content-Type-Options to nosniff', () => {
      expect(headersContent).toContain('X-Content-Type-Options: nosniff');
    });

    it('sets Referrer-Policy', () => {
      expect(headersContent).toContain('Referrer-Policy: strict-origin-when-cross-origin');
    });

    it('disables camera, microphone, geolocation via Permissions-Policy', () => {
      expect(headersContent).toContain('camera=()');
      expect(headersContent).toContain('microphone=()');
      expect(headersContent).toContain('geolocation=()');
    });

    it('has Content-Security-Policy header', () => {
      expect(headersContent).toContain('Content-Security-Policy:');
    });

    it('CSP restricts default-src to self', () => {
      expect(headersContent).toContain("default-src 'self'");
    });

    it('CSP restricts script-src to self', () => {
      expect(headersContent).toContain("script-src 'self'");
    });

    it('CSP prevents framing via frame-ancestors', () => {
      expect(headersContent).toContain("frame-ancestors 'none'");
    });

    // RSS feeds are fetched by our own Worker (/api/v1/feed), so connect-src
    // does not need to name any third party. It used to name two public CORS
    // proxies, which meant every reader's browser contacted them directly and
    // told them which anti-CCP feeds it wanted. Re-widening this would bring
    // that back silently, so it is asserted rather than left to review.
    it('CSP does not permit third-party CORS proxies', () => {
      expect(headersContent).not.toContain('api.allorigins.win');
      expect(headersContent).not.toContain('api.rss2json.com');
    });

    it('CSP connect-src allows only this origin and Supabase', () => {
      const connectSrc = headersContent.match(/connect-src ([^;]+);/)?.[1].trim();
      expect(connectSrc).toBe("'self' https://*.supabase.co");
    });

    it('CSP allows Supabase connections (*.supabase.co)', () => {
      expect(headersContent).toContain('https://*.supabase.co');
    });

    it('enforces HTTPS via Strict-Transport-Security with preload', () => {
      expect(headersContent).toContain('Strict-Transport-Security:');
      expect(headersContent).toContain('max-age=31536000');
      expect(headersContent).toContain('includeSubDomains');
      expect(headersContent).toContain('preload');
    });

    it('sets Cross-Origin-Opener-Policy to same-origin', () => {
      expect(headersContent).toContain('Cross-Origin-Opener-Policy: same-origin');
    });

    it('sets Cross-Origin-Resource-Policy to same-origin', () => {
      expect(headersContent).toContain('Cross-Origin-Resource-Policy: same-origin');
    });
  });

  describe('Cache-Control headers', () => {
    it('sets immutable caching for hashed assets (/assets/*)', () => {
      expect(headersContent).toContain('/assets/*');
      expect(headersContent).toContain('max-age=31536000');
      expect(headersContent).toContain('immutable');
    });

    it('prevents caching of index.html for SPA updates', () => {
      // index.html must use no-cache so users always get latest bundle references
      const indexSection = headersContent.split('/index.html')[1];
      expect(indexSection).toBeDefined();
      expect(indexSection).toContain('no-cache');
    });

    it('prevents caching of service worker', () => {
      expect(headersContent).toContain('/sw.js');
      const swSection = headersContent.split('/sw.js')[1];
      expect(swSection).toBeDefined();
      expect(swSection).toContain('no-cache');
    });

    it('caches manifest.json for 1 day', () => {
      expect(headersContent).toContain('/manifest.json');
      expect(headersContent).toContain('max-age=86400');
    });
  });

  describe('index.html security', () => {
    // X-Frame-Options and X-Content-Type-Options are only honoured as real
    // HTTP headers. Asserting on <meta> equivalents enshrined a no-op — and
    // the X-Frame-Options meta said SAMEORIGIN while the served header says
    // DENY. Both are covered by the _headers assertions above; here we just
    // make sure the misleading meta tags do not come back.
    it('does not re-add header-only directives as meta tags', () => {
      expect(indexContent).not.toMatch(/http-equiv=["']X-Frame-Options["']/i);
      expect(indexContent).not.toMatch(/http-equiv=["']X-Content-Type-Options["']/i);
    });

    it('has referrer policy meta tag', () => {
      expect(indexContent).toContain('strict-origin-when-cross-origin');
    });

    it('has no preconnect or dns-prefetch to a third party', () => {
      // A preconnect fires on page load whether or not the resource is ever
      // used, so a hint to a CORS proxy leaked every reader's interest before
      // they clicked anything. Feeds come from our own origin now.
      const hints = [...indexContent.matchAll(/<link[^>]+rel=["'](?:preconnect|dns-prefetch)["'][^>]*>/gi)]
        .map(m => m[0])
        .filter(tag => /href=["']https?:\/\//i.test(tag));
      expect(hints, `Third-party connection hints:\n${hints.join('\n')}`).toEqual([]);
    });

    /*
     * These two guard the same class of bug: shipping something the CSP
     * silently refuses.
     *
     * index.html carried an inline service-worker registration and an inline
     * GitHub Pages redirect shim. `script-src 'self'` refused to execute
     * both, so sw.js shipped with every deploy for months and never once
     * registered — the site's entire offline capability did not exist, and
     * nothing failed loudly enough for anyone to notice. index.css imported
     * Inter and JetBrains Mono from fonts.googleapis.com; `style-src 'self'`
     * refused those too, so no reader ever saw either typeface, while their
     * browser still announced itself to Google on every page view.
     *
     * A CSP is only worth having if the app obeys it. These tests fail when
     * the app stops obeying it, instead of the browser quietly doing so.
     */
    it('has no executable inline script (CSP is script-src self)', () => {
      const scripts = [...indexContent.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
      const offenders = scripts
        .filter(([, attrs, body]) => {
          if (/\bsrc=/i.test(attrs)) return false; // external, allowed by 'self'
          if (/type=["']application\/ld\+json["']/i.test(attrs)) return false; // data, not executed
          return body.trim().length > 0;
        })
        .map(([, attrs]) => `<script${attrs}>`);
      expect(
        offenders,
        `Inline scripts the CSP will refuse to execute:\n${offenders.join('\n')}\n` +
          'Move the code into src/ so it is bundled and same-origin.'
      ).toEqual([]);
    });

    it('stylesheets do not import from a third party (CSP is style-src/font-src self)', () => {
      const css = readFileSync(resolve(__dirname, '../index.css'), 'utf-8');
      const imports = [...css.matchAll(/@import\s+url\(\s*['"]?(https?:\/\/[^'")]+)/gi)].map(m => m[1]);
      expect(
        imports,
        `Third-party CSS imports the CSP will refuse:\n${imports.join('\n')}\n` +
          'Self-host the asset instead; do not widen the CSP for a webfont.'
      ).toEqual([]);
    });

    it('does not contain inline script injection patterns', () => {
      expect(indexContent).not.toContain('javascript:');
      expect(indexContent).not.toContain('onclick=');
      expect(indexContent).not.toContain('onerror=');
    });
  });
});
