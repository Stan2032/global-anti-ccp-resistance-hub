/**
 * Push Notification Service
 *
 * Handles Web Push subscription management for the frontend.
 * Works with the Cloudflare Workers API at /api/v1/push/*.
 *
 * Flow:
 * 1. User enables notifications in NotificationCenter
 * 2. Browser asks for permission
 * 3. On grant: subscribe to push via Push API
 * 4. Send subscription to server for storage
 * 5. Server can now send push notifications to this user
 *
 * Privacy: No PII collected. Subscription is just an endpoint URL +
 * encryption keys. Categories are stored locally only.
 */

const API_BASE = '/api/v1/push';

/** Result of a push subscribe/unsubscribe operation. */
export interface PushResult {
  success: boolean;
  error?: string;
}

/** Current push subscription status. */
export interface PushStatus {
  subscribed: boolean;
  endpoint?: string | null;
}

/** Convert a base64 string to a Uint8Array for applicationServerKey. */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/** Check if push notifications are supported. */
export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/** Get the VAPID public key from the environment. */
function getVapidPublicKey(): string | null {
  // eslint-disable-next-line no-undef
  return import.meta?.env?.VITE_VAPID_PUBLIC_KEY || null;
}

/** Subscribe to push notifications. */
export async function subscribeToPush(
  categories: string[] = ['critical', 'sanctions', 'data', 'action']
): Promise<PushResult> {
  if (!isPushSupported()) {
    return { success: false, error: 'Push notifications not supported in this browser' };
  }

  const vapidKey = getVapidPublicKey();
  if (!vapidKey) {
    // VAPID not configured — push subscriptions can't be created
    // This is expected in development/static-only mode
    return { success: false, error: 'Push notifications not configured (VAPID key missing)' };
  }

  try {
    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;

    // Check existing subscription
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Create new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
    }

    // Send subscription to server
    const response = await fetch(`${API_BASE}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        categories,
      }),
    });

    if (!response.ok) {
      const data: Record<string, unknown> = await response.json().catch(() => ({}));
      return { success: false, error: (data.error as string) || `Server error: ${response.status}` };
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

/** Unsubscribe from push notifications. */
export async function unsubscribeFromPush(): Promise<PushResult> {
  if (!isPushSupported()) {
    return { success: false, error: 'Push notifications not supported' };
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      // Notify server
      await fetch(`${API_BASE}/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      }).catch(() => {}); // Best-effort server notification

      // Unsubscribe locally
      await subscription.unsubscribe();
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

/** Get current push subscription status. */
export async function getPushStatus(): Promise<PushStatus> {
  if (!isPushSupported()) {
    return { subscribed: false };
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return {
      subscribed: !!subscription,
      endpoint: subscription?.endpoint || null,
    };
  } catch {
    return { subscribed: false };
  }
}
