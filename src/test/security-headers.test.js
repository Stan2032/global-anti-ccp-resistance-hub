import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const HEADERS_PATH = resolve(__dirname, '../../public/_headers');
const INDEX_PATH = resolve(__dirname, '../../index.html');

describe('Security Headers', () => {
  let headersContent;
  let indexContent;

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

    it('CSP allows CORS proxy for RSS feeds (api.allorigins.win)', () => {
      expect(headersContent).toContain('https://api.allorigins.win');
    });

    it('CSP allows RSS2JSON proxy (api.rss2json.com)', () => {
      expect(headersContent).toContain('https://api.rss2json.com');
    });
  });

  describe('index.html security', () => {
    it('has X-Content-Type-Options meta tag', () => {
      expect(indexContent).toContain('X-Content-Type-Options');
    });

    it('has X-Frame-Options meta tag', () => {
      expect(indexContent).toContain('X-Frame-Options');
    });

    it('has referrer policy meta tag', () => {
      expect(indexContent).toContain('strict-origin-when-cross-origin');
    });

    it('has preconnect hint for allorigins CORS proxy', () => {
      expect(indexContent).toContain('preconnect');
      expect(indexContent).toContain('https://api.allorigins.win');
    });

    it('has preconnect hint for rss2json proxy', () => {
      expect(indexContent).toContain('https://api.rss2json.com');
    });

    it('does not contain inline script injection patterns', () => {
      expect(indexContent).not.toContain('javascript:');
      expect(indexContent).not.toContain('onclick=');
      expect(indexContent).not.toContain('onerror=');
    });
  });
});
