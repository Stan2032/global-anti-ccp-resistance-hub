# Cloudflare Workers REST API Setup Guide

> **Last Updated:** March 8, 2026 (Session 234)
> **Difficulty:** Intermediate
> **Time Required:** 30-60 minutes
> **Prerequisites:** Cloudflare account, Node.js 18+, npm

---

## Overview

This guide walks you through deploying a public REST API for the Global Anti-CCP Resistance Hub using Cloudflare Workers. The API exposes the same datasets available in the frontend `dataApi.js` module, enabling researchers, journalists, and developers to programmatically access political prisoner data, sanctions records, detention facility information, and more.

**What you'll get:**
- Public REST API at `https://your-domain.com/api/v1/...`
- JSON responses with CORS support
- Rate limiting (100 requests/minute per IP)
- Cache headers for CDN optimization
- Optional API key authentication for write operations

---

## Step 1: Install Wrangler CLI (if not already installed)

```bash
npm install -g wrangler@latest
```

Verify:
```bash
wrangler --version
# Should show v3.x or later
```

---

## Step 2: Authenticate with Cloudflare

```bash
wrangler login
```

This opens your browser. Log in with your Cloudflare account and authorize Wrangler.

---

## Step 3: Verify Current Deployment

The project already deploys as a static site via `wrangler.jsonc`. Verify it works:

```bash
cd /path/to/global-anti-ccp-resistance-hub
npm run build
npx wrangler deploy --dry-run
```

You should see it deploying the `dist/` directory as a static site.

---

## Step 4: Update wrangler.jsonc for API Routes

The `wrangler.jsonc` file has been updated to include a Workers script that handles `/api/*` routes while serving the static SPA for everything else. The configuration now includes:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "global-anti-ccp-resistance-hub",
  "compatibility_date": "2025-09-27",
  "main": "api/worker.js",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application",
    "binding": "ASSETS"
  }
}
```

**What changed:**
- Added `"main": "api/worker.js"` — Points to the API worker script
- Added `"binding": "ASSETS"` — Allows the worker to fall through to static assets

---

## Step 5: Deploy

```bash
npm run build
npx wrangler deploy
```

The API will be live at:
- **Static site:** `https://global-anti-ccp-resistance-hub.stane203.workers.dev/`
- **API endpoint:** `https://global-anti-ccp-resistance-hub.stane203.workers.dev/api/v1/`

---

## Step 6: Verify the API

Test the endpoints:

```bash
# Health check
curl https://global-anti-ccp-resistance-hub.stane203.workers.dev/api/v1/

# Political prisoners
curl https://global-anti-ccp-resistance-hub.stane203.workers.dev/api/v1/prisoners

# Search
curl "https://global-anti-ccp-resistance-hub.stane203.workers.dev/api/v1/search?q=hong+kong"

# Specific prisoner
curl "https://global-anti-ccp-resistance-hub.stane203.workers.dev/api/v1/prisoners?name=jimmy+lai"
```

---

## Step 7: (Optional) Add API Key for Rate Limit Bypass

If you want to allow trusted researchers higher rate limits:

1. Go to Cloudflare Dashboard → Workers → your worker → Settings → Variables
2. Add a secret: `API_KEY` = `your-secret-key-here`
3. Researchers include the key in requests:

```bash
curl -H "X-API-Key: your-secret-key-here" \
  https://your-domain.com/api/v1/prisoners
```

---

## Step 8: (Optional) Custom Domain

If you have a custom domain pointed at Cloudflare:

1. Go to Workers → your worker → Settings → Custom Domains
2. Add your domain (e.g., `api.resistance-hub.org`)
3. API will be available at `https://api.resistance-hub.org/api/v1/`

This also enables Cloudflare Onion Routing (see `guides/CUSTOM_DOMAIN_SETUP.md`).

---

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/` | API info + available endpoints |
| GET | `/api/v1/prisoners` | All political prisoners |
| GET | `/api/v1/prisoners?name=X` | Search by name |
| GET | `/api/v1/prisoners?region=X` | Filter by region |
| GET | `/api/v1/sanctions` | All sanctions entries |
| GET | `/api/v1/officials` | Sanctioned CCP officials |
| GET | `/api/v1/facilities` | Detention facilities |
| GET | `/api/v1/companies` | Forced labor companies |
| GET | `/api/v1/stations` | Overseas police stations |
| GET | `/api/v1/timeline` | Historical timeline |
| GET | `/api/v1/alerts` | Emergency alerts |
| GET | `/api/v1/updates` | Recent updates |
| GET | `/api/v1/cases` | Legal cases |
| GET | `/api/v1/responses` | International responses |
| GET | `/api/v1/orgs` | Human rights organizations |
| GET | `/api/v1/search?q=X` | Global search across all datasets |
| GET | `/api/v1/stats` | Live statistics summary |

---

## Troubleshooting

### "Worker not found" error
- Ensure `api/worker.js` exists and the `main` field in `wrangler.jsonc` points to it
- Run `npx wrangler deploy` (not just `npm run build`)

### CORS errors from frontend
- The worker includes `Access-Control-Allow-Origin: *` headers
- If you need to restrict origins, update `ALLOWED_ORIGINS` in `api/worker.js`

### Rate limiting too aggressive
- Default: 100 requests/minute per IP
- Adjust `RATE_LIMIT` constant in `api/worker.js`
- API key holders bypass rate limiting

### Static site not loading
- The worker falls through to `ASSETS` binding for non-API routes
- Verify `dist/` was built before deploying

---

## Security Notes

1. **Read-only API** — No write endpoints are exposed
2. **No PII** — All data is public information from Tier 1-2 sources
3. **Rate limited** — Prevents abuse and scraping
4. **CORS enabled** — Allows cross-origin research use
5. **Cache-friendly** — Cloudflare CDN caches responses for performance
6. **No API key required** — Public data, open access for researchers
