import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const PUBLIC_DIR = resolve(__dirname, '../../public');
const SW_PATH = resolve(PUBLIC_DIR, 'sw.js');
const OFFLINE_PATH = resolve(PUBLIC_DIR, 'offline.html');

describe('Service Worker (sw.js)', () => {
  let swContent: any;

  beforeAll(() => {
    swContent = readFileSync(SW_PATH, 'utf-8');
  });

  it('exists in public directory', () => {
    expect(existsSync(SW_PATH)).toBe(true);
  });

  // --- Cache Configuration ---

  it('defines a cache name with version', () => {
    expect(swContent).toMatch(/CACHE_NAME\s*=\s*'resistance-hub-v\d+'/);
  });

  it('defines OFFLINE_URL pointing to offline.html', () => {
    expect(swContent).toContain("OFFLINE_URL = '/offline.html'");
  });

  it('precaches the app shell (index, offline, manifest)', () => {
    expect(swContent).toContain("'/index.html'");
    expect(swContent).toContain("'/offline.html'");
    expect(swContent).toContain("'/manifest.json'");
    expect(swContent).toContain("'/'");
  });

  it('precaches icon files', () => {
    expect(swContent).toContain("'/icon-192.png'");
    expect(swContent).toContain("'/icon-512.png'");
  });

  // --- Caching Strategies ---

  it('uses cache-first for hashed assets (/assets/)', () => {
    expect(swContent).toContain("'/assets/'");
    expect(swContent).toContain("'cache-first'");
  });

  it('uses network-first for navigation requests', () => {
    expect(swContent).toContain("request.mode === 'navigate'");
    expect(swContent).toContain("'network-first'");
  });

  it('uses stale-while-revalidate for static files', () => {
    expect(swContent).toContain("'stale-while-revalidate'");
  });

  it('skips cross-origin requests', () => {
    expect(swContent).toContain('self.location.origin');
  });

  // --- Event Listeners ---

  it('registers install event listener', () => {
    expect(swContent).toContain("addEventListener('install'");
  });

  it('registers activate event listener', () => {
    expect(swContent).toContain("addEventListener('activate'");
  });

  it('registers fetch event listener', () => {
    expect(swContent).toContain("addEventListener('fetch'");
  });

  it('calls skipWaiting on install', () => {
    expect(swContent).toContain('self.skipWaiting()');
  });

  it('calls clients.claim on activate', () => {
    expect(swContent).toContain('self.clients.claim()');
  });

  it('cleans up old caches on activate', () => {
    expect(swContent).toContain('caches.keys()');
    expect(swContent).toContain('caches.delete');
  });

  // --- Offline Fallback ---

  it('falls back to offline page for failed navigation', () => {
    expect(swContent).toContain('OFFLINE_URL');
    expect(swContent).toContain("request.mode === 'navigate'");
  });

  // --- Background Sync & Push ---

  it('has background sync handler', () => {
    expect(swContent).toContain("addEventListener('sync'");
    expect(swContent).toContain('sync-reports');
  });

  it('has push notification handler', () => {
    expect(swContent).toContain("addEventListener('push'");
    expect(swContent).toContain('showNotification');
  });

  it('has notification click handler', () => {
    expect(swContent).toContain("addEventListener('notificationclick'");
    expect(swContent).toContain('clients.openWindow');
  });

  // --- Security ---

  it('only processes GET requests', () => {
    expect(swContent).toContain("request.method !== 'GET'");
  });

  it('does not cache cross-origin requests by default', () => {
    // Verify cross-origin skip logic
    expect(swContent).toContain('self.location.origin');
  });
});

describe('Offline Page (offline.html)', () => {
  let offlineContent: any;

  beforeAll(() => {
    offlineContent = readFileSync(OFFLINE_PATH, 'utf-8');
  });

  it('exists in public directory', () => {
    expect(existsSync(OFFLINE_PATH)).toBe(true);
  });

  it('has the correct title', () => {
    expect(offlineContent).toContain('Offline — Resistance Hub');
  });

  it('shows connection status', () => {
    expect(offlineContent).toContain('network_offline');
    expect(offlineContent).toContain('disconnected');
  });

  it('includes security reminder', () => {
    expect(offlineContent).toContain('security_reminder');
    expect(offlineContent).toContain('VPN or Tor');
  });

  it('includes emergency contacts', () => {
    expect(offlineContent).toContain('Front Line Defenders');
    expect(offlineContent).toContain('+353 1 210 0489');
    expect(offlineContent).toContain('Safeguard Defenders');
  });

  it('has auto-reload on connection restore', () => {
    expect(offlineContent).toContain("addEventListener('online'");
    expect(offlineContent).toContain('window.location.reload()');
  });

  it('includes retry button', () => {
    expect(offlineContent).toContain('reconnect --retry');
  });

  it('provides links to cached pages', () => {
    expect(offlineContent).toContain('cached_content');
    expect(offlineContent).toContain('href="/prisoners"');
    expect(offlineContent).toContain('href="/security"');
    expect(offlineContent).toContain('href="/"');
  });

  it('does not contain CCP state media references', () => {
    expect(offlineContent).not.toContain('Xinhua');
    expect(offlineContent).not.toContain('CGTN');
    expect(offlineContent).not.toContain('Global Times');
  });
});
