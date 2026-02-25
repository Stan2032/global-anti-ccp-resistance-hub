import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const PUBLIC_DIR = resolve(__dirname, '../../public');

describe('PWA Manifest Data Integrity', () => {
  let manifest;

  beforeAll(() => {
    const manifestPath = resolve(PUBLIC_DIR, 'manifest.json');
    manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  });

  describe('required fields', () => {
    it('has name', () => {
      expect(manifest.name).toBeDefined();
      expect(manifest.name.length).toBeGreaterThan(0);
    });

    it('has short_name', () => {
      expect(manifest.short_name).toBeDefined();
      expect(manifest.short_name.length).toBeGreaterThan(0);
    });

    it('has description', () => {
      expect(manifest.description).toBeDefined();
      expect(manifest.description.length).toBeGreaterThan(0);
    });

    it('has start_url', () => {
      expect(manifest.start_url).toBeDefined();
    });

    it('has display mode', () => {
      const validDisplayModes = ['fullscreen', 'standalone', 'minimal-ui', 'browser'];
      expect(validDisplayModes).toContain(manifest.display);
    });

    it('has background_color as valid hex', () => {
      expect(manifest.background_color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it('has theme_color as valid hex', () => {
      expect(manifest.theme_color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  describe('icons', () => {
    it('has at least 2 icons defined', () => {
      expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
    });

    it('has 192x192 icon', () => {
      const icon192 = manifest.icons.find(i => i.sizes === '192x192');
      expect(icon192, 'Missing 192x192 icon entry').toBeDefined();
      expect(icon192.type).toBe('image/png');
    });

    it('has 512x512 icon', () => {
      const icon512 = manifest.icons.find(i => i.sizes === '512x512');
      expect(icon512, 'Missing 512x512 icon entry').toBeDefined();
      expect(icon512.type).toBe('image/png');
    });

    it('all referenced icon files exist on disk', () => {
      for (const icon of manifest.icons) {
        // Strip leading ./ or / to get the filename
        const fileName = icon.src.replace(/^\.\//, '').replace(/^\//, '');
        const filePath = resolve(PUBLIC_DIR, fileName);
        expect(existsSync(filePath), `Icon file missing: ${icon.src} (expected at ${filePath})`).toBe(true);
      }
    });
  });

  describe('shortcuts', () => {
    it('has shortcuts defined', () => {
      expect(manifest.shortcuts).toBeDefined();
      expect(manifest.shortcuts.length).toBeGreaterThan(0);
    });

    it('each shortcut has required fields', () => {
      for (const shortcut of manifest.shortcuts) {
        expect(shortcut.name, 'Shortcut missing name').toBeDefined();
        expect(shortcut.url, 'Shortcut missing url').toBeDefined();
      }
    });

    it('shortcut icon files exist on disk', () => {
      for (const shortcut of manifest.shortcuts) {
        if (shortcut.icons) {
          for (const icon of shortcut.icons) {
            const fileName = icon.src.replace(/^\.\//, '').replace(/^\//, '');
            const filePath = resolve(PUBLIC_DIR, fileName);
            expect(existsSync(filePath), `Shortcut icon missing: ${icon.src}`).toBe(true);
          }
        }
      }
    });
  });

  describe('other PWA files exist', () => {
    it('favicon.svg exists', () => {
      expect(existsSync(resolve(PUBLIC_DIR, 'favicon.svg'))).toBe(true);
    });

    it('offline.html exists', () => {
      expect(existsSync(resolve(PUBLIC_DIR, 'offline.html'))).toBe(true);
    });

    it('sw.js (service worker) exists', () => {
      expect(existsSync(resolve(PUBLIC_DIR, 'sw.js'))).toBe(true);
    });

    it('robots.txt exists', () => {
      expect(existsSync(resolve(PUBLIC_DIR, 'robots.txt'))).toBe(true);
    });

    it('sitemap.xml exists', () => {
      expect(existsSync(resolve(PUBLIC_DIR, 'sitemap.xml'))).toBe(true);
    });

    it('404.html exists', () => {
      expect(existsSync(resolve(PUBLIC_DIR, '404.html'))).toBe(true);
    });
  });
});
