# Web Push Notifications Setup Guide

> **Last Updated:** March 8, 2026 (Session 234)
> **Difficulty:** Intermediate-Advanced
> **Time Required:** 45-90 minutes
> **Prerequisites:** Cloudflare account with Workers, Node.js 18+

---

## Overview

This guide sets up server-side Web Push notifications for the Resistance Hub. When an emergency alert is added (new political prisoner arrest, sanctions update, etc.), subscribed users receive a push notification even when they don't have the site open.

**Architecture:**
```
[Admin adds alert] → [Supabase webhook] → [Cloudflare Worker] → [Web Push API] → [User's browser]
```

**Current state:**
- ✅ Service worker (`sw.js`) already handles `push` events
- ✅ NotificationCenter component already requests permission + displays notifications
- ✅ Manifest.json configured for standalone PWA
- ❌ No server-side push sending capability yet
- ❌ No subscription storage yet

---

## Step 1: Generate VAPID Keys

Web Push requires VAPID (Voluntary Application Server Identification) keys.

```bash
# Install web-push utility globally
npm install -g web-push

# Generate VAPID key pair
web-push generate-vapid-keys --json
```

Output:
```json
{
  "publicKey": "BNx...(86 chars)...==",
  "privateKey": "abc...(43 chars)...="
}
```

**Save both keys securely.** The public key goes in the frontend; the private key stays secret on the server.

---

## Step 2: Add VAPID Keys to Cloudflare Workers

1. Go to **Cloudflare Dashboard** → **Workers & Pages** → your worker → **Settings** → **Variables and Secrets**
2. Add these secrets:

| Variable Name | Value | Type |
|--------------|-------|------|
| `VAPID_PUBLIC_KEY` | `BNx...(your public key)` | Plain text |
| `VAPID_PRIVATE_KEY` | `abc...(your private key)` | Encrypted |
| `VAPID_SUBJECT` | `mailto:admin@your-domain.com` | Plain text |

---

## Step 3: Add VAPID Public Key to Frontend

Add to your `.env` file (or Cloudflare Pages environment variables):

```bash
VITE_VAPID_PUBLIC_KEY=BNx...(your public key)
```

The frontend uses this key when requesting push permission from users.

---

## Step 4: Create Push Subscription Storage

You need somewhere to store user push subscriptions. Two options:

### Option A: Cloudflare KV (Recommended — serverless, free tier)

1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **KV** → **Create a Namespace**
2. Name it: `PUSH_SUBSCRIPTIONS`
3. Go to your Worker → **Settings** → **Bindings** → **KV Namespace Bindings**
4. Add binding: Variable name = `PUSH_SUBS`, KV Namespace = `PUSH_SUBSCRIPTIONS`

### Option B: Supabase Table

If you already have Supabase configured:

```sql
-- Run in Supabase SQL Editor
CREATE TABLE push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  keys_p256dh TEXT NOT NULL,
  keys_auth TEXT NOT NULL,
  categories TEXT[] DEFAULT ARRAY['critical', 'sanctions', 'data', 'action'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_push_at TIMESTAMPTZ
);

-- RLS: Allow anonymous inserts (subscription registration)
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON push_subscriptions
  FOR INSERT TO anon WITH CHECK (true);
-- Only service role can read (for sending pushes)
CREATE POLICY "Service role reads subs" ON push_subscriptions
  FOR SELECT TO service_role USING (true);
```

---

## Step 5: Deploy the Push Worker

The push notification worker has been added to `api/push-worker.js`. It provides:

- `POST /api/v1/push/subscribe` — Register a push subscription
- `POST /api/v1/push/unsubscribe` — Remove a subscription
- `POST /api/v1/push/send` — Send push to all subscribers (admin only, requires API key)

Deploy:
```bash
npx wrangler deploy
```

---

## Step 6: Update Frontend Push Registration

The NotificationCenter component needs to send the subscription to the server when a user enables notifications. This is handled by the `pushSubscription` utility in `src/services/pushService.js`.

Key flow:
1. User clicks "Enable notifications" in NotificationCenter
2. Browser shows permission prompt
3. On grant: `navigator.serviceWorker.ready` → `registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: VAPID_PUBLIC_KEY })`
4. Subscription object sent to `POST /api/v1/push/subscribe`
5. Server stores subscription in KV or Supabase

---

## Step 7: Trigger Push Notifications

### Manual trigger (via API):
```bash
curl -X POST https://your-domain.com/api/v1/push/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-admin-api-key" \
  -d '{
    "title": "🚨 New Political Prisoner",
    "body": "Student activist Zhang Wei detained in Shanghai",
    "url": "/prisoners",
    "category": "critical"
  }'
```

### Automatic trigger (via Supabase webhook):
1. Go to **Supabase Dashboard** → **Database** → **Webhooks**
2. Create webhook on `emergency_alerts` table INSERT
3. URL: `https://your-domain.com/api/v1/push/send`
4. Headers: `X-API-Key: your-admin-api-key`
5. Payload: Map `title`, `body`, `category` from the new row

---

## Step 8: Test End-to-End

1. Open the site in Chrome/Firefox
2. Go to Security Center or Dashboard
3. Click the notification bell → Enable notifications
4. Accept the browser permission prompt
5. Send a test push:

```bash
curl -X POST https://your-domain.com/api/v1/push/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-admin-api-key" \
  -d '{
    "title": "Test Notification",
    "body": "Push notifications are working!",
    "url": "/",
    "category": "data"
  }'
```

6. You should see a browser notification even if the tab is closed

---

## Troubleshooting

### "Permission denied" for notifications
- User may have blocked notifications for the site
- Check: chrome://settings/content/notifications
- On mobile: Settings → Apps → Browser → Notifications

### Push not received
- Check service worker is active: DevTools → Application → Service Workers
- Verify subscription was sent to server: Network tab, look for `/api/v1/push/subscribe`
- Check Cloudflare Worker logs: `npx wrangler tail`

### "NotAllowedError: Registration failed"
- VAPID public key may be incorrect
- Ensure `applicationServerKey` is a valid Uint8Array from base64 conversion

---

## Security Notes

1. **VAPID private key** is a secret — never expose in frontend code
2. **Push subscriptions** contain no PII (just endpoint URLs + encryption keys)
3. **Admin-only sending** — `/push/send` requires API key
4. **Category filtering** — Users only receive categories they opted into
5. **Unsubscribe** — Users can revoke at any time via NotificationCenter
