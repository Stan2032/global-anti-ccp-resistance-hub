import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Push Service Tests
 *
 * Tests the push notification service module structure and
 * integration points with the Cloudflare Workers API.
 */

const SERVICES_DIR = resolve(__dirname, '../services');

describe('Push Service — module integrity', () => {
  const content = readFileSync(resolve(SERVICES_DIR, 'pushService.js'), 'utf-8');

  it('exports isPushSupported function', () => {
    expect(content).toContain('export function isPushSupported');
  });

  it('exports subscribeToPush function', () => {
    expect(content).toContain('export async function subscribeToPush');
  });

  it('exports unsubscribeFromPush function', () => {
    expect(content).toContain('export async function unsubscribeFromPush');
  });

  it('exports getPushStatus function', () => {
    expect(content).toContain('export async function getPushStatus');
  });

  it('checks for PushManager support', () => {
    expect(content).toContain('PushManager');
  });

  it('checks for serviceWorker support', () => {
    expect(content).toContain('serviceWorker');
  });

  it('checks for Notification support', () => {
    expect(content).toContain("'Notification' in window");
  });

  it('uses VITE_VAPID_PUBLIC_KEY env variable', () => {
    expect(content).toContain('VITE_VAPID_PUBLIC_KEY');
  });

  it('converts VAPID key to Uint8Array', () => {
    expect(content).toContain('urlBase64ToUint8Array');
    expect(content).toContain('Uint8Array');
  });

  it('sends subscription to /api/v1/push/subscribe', () => {
    expect(content).toContain('/api/v1/push');
    expect(content).toContain('/subscribe');
  });

  it('sends unsubscribe to /api/v1/push/unsubscribe', () => {
    expect(content).toContain('/unsubscribe');
  });

  it('uses userVisibleOnly: true for push subscription', () => {
    expect(content).toContain('userVisibleOnly: true');
  });

  it('supports category-based subscriptions', () => {
    expect(content).toContain('categories');
    expect(content).toContain('critical');
    expect(content).toContain('sanctions');
  });

  it('handles missing VAPID key gracefully', () => {
    expect(content).toContain('VAPID key missing');
  });

  it('returns structured results with success/error', () => {
    expect(content).toContain('{ success: true }');
    expect(content).toContain('{ success: false');
  });
});

describe('Push Service — integration with service worker', () => {
  it('service worker handles push events', () => {
    const sw = readFileSync(resolve(__dirname, '../../public/sw.js'), 'utf-8');
    expect(sw).toContain("addEventListener('push'");
    expect(sw).toContain('showNotification');
  });

  it('service worker handles notification clicks', () => {
    const sw = readFileSync(resolve(__dirname, '../../public/sw.js'), 'utf-8');
    expect(sw).toContain("addEventListener('notificationclick'");
    expect(sw).toContain('openWindow');
  });

  it('manifest.json configured for standalone PWA', () => {
    const manifest = JSON.parse(readFileSync(resolve(__dirname, '../../public/manifest.json'), 'utf-8'));
    expect(manifest.display).toBe('standalone');
    expect(manifest.name).toContain('Resistance Hub');
  });
});
