# Cloudflare Onion Routing Setup Guide

Enable Tor access for the **Global Anti-CCP Resistance Hub** via Cloudflare's built-in Onion Routing. This allows users in censored regions to access the site through the Tor network without exit node exposure.

> **Why this matters:** Users in mainland China, Hong Kong, and other CCP-influenced territories may be surveilled when accessing human rights content. Onion Routing provides an additional layer of anonymity by serving the site directly over Tor's network — traffic never leaves the Tor circuit.

---

## How Cloudflare Onion Routing Works

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  Tor Browser     │ ──────▶ │  Tor Network     │ ──────▶ │  Cloudflare      │
│  (user)          │         │  (3 relays)      │         │  (.onion service)│
└─────────────────┘         └──────────────────┘         └──────────────────┘
                                                                  │
                                                         Serves site content
                                                         from CDN edge
                                                                  │
                                                         ┌────────┴────────┐
                                                         │  Your site      │
                                                         │  (same content) │
                                                         └─────────────────┘
```

**Key benefits:**
- Traffic stays within the Tor circuit (no exit node needed)
- Cloudflare automatically generates and maintains the `.onion` address
- Zero additional infrastructure — no need to run your own Tor relay
- Same DDoS protection and CDN performance as the regular site
- The `Onion-Location` header automatically redirects Tor Browser users to the `.onion` version

---

## Step-by-Step Setup

### ⚠️ Important: Custom Domain Required

**Cloudflare Onion Routing requires a custom domain with Cloudflare DNS.** It is **not available** for `workers.dev` subdomains. If you only have a `workers.dev` deployment, the "Onion Routing" toggle will not appear in the Network settings.

**To use Onion Routing, you need to:**
1. Register a custom domain (e.g., `resistancehub.org`)
2. Add the domain to Cloudflare (transfer DNS or add as a zone)
3. Create a Worker route or custom domain mapping for the Worker
4. Then the Onion Routing option will appear under Network settings

> **Status (Session 155):** Human owner reports the Onion Routing option is not visible in their Cloudflare dashboard. This is most likely because the site is deployed on `workers.dev` without a custom domain. **Deferred** until a custom domain is added.

### Step 1: Log into Cloudflare Dashboard

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Select your **custom domain zone** (not `workers.dev` — onion routing is not available for `workers.dev` subdomains)

### Step 2: Enable Onion Routing

1. In the left sidebar, click **Network**
2. Scroll down to find **Onion Routing**
3. Toggle it **ON**

> **That's it for Cloudflare configuration.** Cloudflare will automatically:
> - Generate a unique `.onion` address for your site
> - Serve the `Onion-Location` HTTP header on all responses
> - Handle all Tor circuit termination at the edge

### Step 3: Verify the `.onion` Address

After enabling, Cloudflare generates your `.onion` address. You can find it by:

1. Opening your site in **Tor Browser** (download from [torproject.org](https://www.torproject.org/download/))
2. Tor Browser will show a purple pill icon (🟣) in the address bar indicating an `.onion` alternative is available
3. Click the pill icon to switch to the `.onion` version
4. The URL will change to something like `https://yoursite.cfargotunnel.com.onion/` (the exact format is managed by Cloudflare)

Alternatively, check the HTTP response headers:
```bash
# Check for the Onion-Location header (from a non-Tor connection)
curl -sI https://global-anti-ccp-resistance-hub.stane203.workers.dev/ | grep -i onion
# Expected output: Onion-Location: https://xxxxx.onion/
```

### Step 4: Test in Tor Browser

1. Download [Tor Browser](https://www.torproject.org/download/) if you don't have it
2. Navigate to your regular site URL: `https://global-anti-ccp-resistance-hub.stane203.workers.dev/`
3. Tor Browser should automatically detect the `Onion-Location` header and offer to redirect
4. Click the redirect prompt to verify the `.onion` version works
5. Verify that:
   - All pages load correctly
   - Navigation works (SPA routing)
   - No mixed content warnings
   - Security headers are present

### Step 5: (Optional) Document Your `.onion` Address

Once you have the `.onion` address, consider:

1. Adding it to the site's Security Center page so users know about it
2. Adding it to the README.md
3. Sharing it on relevant activist channels

> **Note:** Do NOT hardcode the `.onion` address in the codebase — Cloudflare manages it and it may change if you reconfigure your site. Instead, rely on the automatic `Onion-Location` header redirect.

---

## Frequently Asked Questions

### Q: Do I need to change any code?
**No.** Cloudflare Onion Routing is entirely a dashboard setting. When enabled, Cloudflare automatically injects the `Onion-Location` header into all HTTP responses. The site code, `_headers` file, and `wrangler.jsonc` do not need changes.

### Q: Does this affect non-Tor users?
**No.** Regular browser users are completely unaffected. The `Onion-Location` header is only read by Tor Browser. Other browsers ignore it.

### Q: Does this cost anything?
**No.** Cloudflare Onion Routing is free on all plans, including the free tier.

### Q: Is this the same as running my own Tor hidden service?
**Similar, but simpler.** Running your own `.onion` service requires maintaining a Tor relay. Cloudflare Onion Routing gives you `.onion` access without any infrastructure. The trade-off is that Cloudflare terminates the Tor connection at their edge (they can see the traffic), but for a public website this is acceptable.

### Q: Will the site work in countries that block Tor?
**Tor Browser includes bridge support** for countries that block Tor entry nodes (including China). Users should configure Tor bridges (obfs4, meek, or Snowflake) if direct Tor connections are blocked. This is a Tor client configuration, not something we control on the server side.

### Q: What about Cloudflare Workers sites?
Cloudflare Onion Routing **requires a custom domain** — it is not available for `workers.dev` subdomains. Since this site deploys via `wrangler deploy` (Workers), you must first add a custom domain to Cloudflare, then route the Worker to that domain. Once the custom domain is active, the Onion Routing toggle will appear under Network settings.

> **This is the most likely reason the toggle doesn't appear:** If you're on a `workers.dev` subdomain, you need a custom domain first. See [Cloudflare Custom Domains for Workers](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) for setup instructions.

---

## Troubleshooting

### Tor Browser doesn't show the onion redirect
- Verify Onion Routing is toggled ON in Cloudflare Dashboard → Network
- The `Onion-Location` header may take a few minutes to propagate
- Try clearing your Tor Browser cache and reload
- Check with `curl -sI <your-url> | grep -i onion` to confirm the header is being sent

### Pages load incorrectly on the `.onion` address
- This is usually a Content Security Policy (CSP) issue
- The current CSP in `public/_headers` uses `'self'` which should work for `.onion` since Cloudflare serves the same origin
- If there are issues, you may need to add the `.onion` domain to the CSP `connect-src` directive

### `.onion` address changes
- Cloudflare manages the `.onion` address — it may change if you recreate your site or change zones
- Don't hardcode the `.onion` address in your codebase
- Rely on the `Onion-Location` header for automatic discovery

---

## Related Documentation

- [Cloudflare Onion Routing Docs](https://developers.cloudflare.com/network/onion-routing/)
- [Tor Project](https://www.torproject.org/)
- [CLOUDFLARE_DEPLOY.md](CLOUDFLARE_DEPLOY.md) — Main Cloudflare deployment guide
- [BACKEND_GUIDE.md](BACKEND_GUIDE.md) — Backend security architecture

---

*Created: Session 154 (March 2, 2026)*
*Decision: Q9 — Human chose Option A (Enable Cloudflare Onion Routing)*
