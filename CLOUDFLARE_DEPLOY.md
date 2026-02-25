# Cloudflare Pages Deployment Guide

Deploy the **Global Anti-CCP Resistance Hub** to Cloudflare Pages for free (unlimited bandwidth, global CDN, automatic HTTPS).

> **Prerequisite:** Complete [SUPABASE_SETUP.md](SUPABASE_SETUP.md) first.
> You need your Supabase URL and anon key before setting up Cloudflare.

---

## Step-by-Step Setup

### 1. Connect Your Repository

1. Go to **Cloudflare Dashboard** → **Workers & Pages** (left sidebar)
2. Click **Create** → **Pages** tab → **Connect to Git**
3. Sign in to GitHub when prompted
4. Select the repository: `Stan2032/global-anti-ccp-resistance-hub`
5. Click **Begin setup**

### 2. Configure Build Settings

On the configuration page, set:

| Setting | Value |
|---------|-------|
| **Project name** | `global-anti-ccp-resistance-hub` (or any name you want) |
| **Production branch** | `master` (or whichever branch you want to deploy) |
| **Framework preset** | Select **Vite** (Cloudflare may auto-detect this) |
| **Build command** | `npm run build` |
| **Deploy command** | `npx wrangler deploy` |
| **Root directory** | `/` |

> **How it works:** `npm run build` creates the `dist/` folder, then
> `npx wrangler deploy` deploys it using the `wrangler.jsonc` config in the
> repo root. SPA routing is handled by `not_found_handling` in that file.

### 3. Set Environment Variables

On the same page (or go to **Settings → Environment variables** after creation), add:

| Variable name | Value |
|---------------|-------|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

> **Note:** `VITE_BASE_PATH` is **no longer required** — the build
> automatically detects the Cloudflare environment (`CF_PAGES`) and defaults
> to `/`. You can still override it if needed.
>
> Supabase variables are optional. Without them the site runs in static-only
> mode (forms show "Coming Soon" with links to real organizations).

### 4. Click "Save and Deploy"

Cloudflare will:
1. Clone your repo
2. Run `npm install`
3. Run `npm run build` (produces `dist/`)
4. Run `npx wrangler deploy` (deploys using `wrangler.jsonc` config)

Your site will be live at: `https://your-project-name.pages.dev`

### 5. (Optional) Add a Custom Domain

1. Go to your Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `resistancehub.org`)
4. Follow the DNS instructions (either add a CNAME or transfer DNS to Cloudflare)

---

## How It Works

```
┌─────────────────┐     git push     ┌──────────────────────┐
│  GitHub Repo     │ ────────────── │  Cloudflare           │
│  (source code)   │   auto-deploy  │  (builds & deploys)   │
└─────────────────┘                 └──────────────────────┘
                                             │
                                    npm run build  →  dist/
                                             │
                                    npx wrangler deploy
                                    (reads wrangler.jsonc)
                                             │
                                    ┌────────┴────────┐
                                    │  Global CDN     │
                                    │  (200+ cities)  │
                                    │  HTTPS + HTTP/3 │
                                    └─────────────────┘
                                             │
                                    Browser fetches site
                                    (SPA routing via
                                     not_found_handling)
                                             │
                                    ┌────────┴────────┐
                                    │  Supabase       │
                                    │  (database)     │
                                    │  (form writes)  │
                                    └─────────────────┘
```

Every push to your production branch triggers an automatic redeploy.

---

## What Files Support Cloudflare Deployment

| File | Purpose |
|------|---------|
| `wrangler.jsonc` | Wrangler config — SPA routing via `not_found_handling` |
| `public/_headers` | Security headers (CSP, X-Frame-Options, etc.) |
| `public/robots.txt` | Search engine directives |
| `public/sitemap.xml` | SEO sitemap |
| `public/manifest.json` | PWA manifest |

---

## Troubleshooting

### Blank page or broken routes
- The `wrangler.jsonc` file configures `not_found_handling: "single-page-application"` which serves `index.html` for all unknown routes
- If overriding `VITE_BASE_PATH`, make sure it is set to `/`

### Deploy fails with "Infinite loop detected in _redirects"
- This was fixed — the `_redirects` file was removed because it conflicts with `npx wrangler deploy`. SPA routing is now handled by `wrangler.jsonc`.
- If you see this error, make sure `public/_redirects` does not exist in your repo

### Forms still show "Coming Soon"
- Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Make sure you've run the SQL from `SUPABASE_SETUP.md` in the Supabase SQL Editor
- Check browser console for connection errors

### Build fails
- Make sure `NODE_VERSION=20` is set in environment variables (optional — Node 22 also works)
- The build command should be `npm run build` (not `pnpm build`)
- The deploy command should be `npx wrangler deploy`
- Check the Cloudflare build logs for specific errors

### CSS looks wrong
- Clear Cloudflare cache: **Pages project → Deployments → Manage → Purge cache**

---

## GitHub Pages vs Cloudflare Pages

| Feature | GitHub Pages | Cloudflare |
|---------|-------------|-----------------|
| **Base path** | `/global-anti-ccp-resistance-hub/` | `/` (auto-detected) |
| **Custom domain** | Yes | Yes |
| **HTTPS** | Yes | Yes |
| **Headers control** | No | Yes (`_headers`) |
| **SPA routing** | 404.html fallback | `wrangler.jsonc` `not_found_handling` |
| **Build** | GitHub Actions | Built-in |
| **CDN** | GitHub's CDN | Cloudflare (200+ cities) |
| **Cost** | Free | Free |

You can run both simultaneously. The build auto-detects Cloudflare via the `CF_PAGES` env var.
