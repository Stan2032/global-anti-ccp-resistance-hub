# Cloudflare Pages Deployment Guide

Deploy the **Global Anti-CCP Resistance Hub** to Cloudflare Pages for free (unlimited bandwidth, global CDN, automatic HTTPS).

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
| **Build output directory** | `dist` |

### 3. Set Environment Variables

On the same page (or go to **Settings → Environment variables** after creation), add:

| Variable name | Value |
|---------------|-------|
| `VITE_BASE_PATH` | `/` |
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NODE_VERSION` | `20` |

> **Important:** `VITE_BASE_PATH=/` is critical. Without it the site uses
> `/global-anti-ccp-resistance-hub/` (the GitHub Pages path) which breaks
> routing on Cloudflare.

### 4. Click "Save and Deploy"

Cloudflare will:
1. Clone your repo
2. Run `npm install`
3. Run `npm run build`
4. Deploy the `dist/` folder to its global CDN

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
│  GitHub Repo     │ ────────────── │  Cloudflare Pages    │
│  (source code)   │   auto-deploy  │  (builds & hosts)    │
└─────────────────┘                 └──────────────────────┘
                                             │
                                    npm run build
                                             │
                                         dist/ folder
                                             │
                                    ┌────────┴────────┐
                                    │  Global CDN     │
                                    │  (200+ cities)  │
                                    │  HTTPS + HTTP/3 │
                                    └─────────────────┘
                                             │
                                    Browser fetches site
                                             │
                                    ┌────────┴────────┐
                                    │  Supabase       │
                                    │  (database)     │
                                    │  (form writes)  │
                                    └─────────────────┘
```

Every push to your production branch triggers an automatic redeploy.

---

## What Files Support Cloudflare Pages

These files in `public/` are automatically picked up by Cloudflare Pages:

| File | Purpose |
|------|---------|
| `_redirects` | SPA catch-all: `/* /index.html 200` |
| `_headers` | Security headers (CSP, X-Frame-Options, etc.) |
| `robots.txt` | Search engine directives |
| `sitemap.xml` | SEO sitemap |
| `manifest.json` | PWA manifest |

---

## Troubleshooting

### Blank page or broken routes
- Make sure `VITE_BASE_PATH=/` is set in Cloudflare environment variables
- The `_redirects` file with `/* /index.html 200` handles client-side routing

### Forms still show "Coming Soon"
- Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Make sure you've run the SQL from `SUPABASE_SETUP.md` in the Supabase SQL Editor
- Check browser console for connection errors

### Build fails
- Make sure `NODE_VERSION=20` is set in environment variables
- The build command should be `npm run build` (not `pnpm build`)
- Check the Cloudflare build logs for specific errors

### CSS looks wrong
- Clear Cloudflare cache: **Pages project → Deployments → Manage → Purge cache**

---

## GitHub Pages vs Cloudflare Pages

| Feature | GitHub Pages | Cloudflare Pages |
|---------|-------------|-----------------|
| **Base path** | `/global-anti-ccp-resistance-hub/` | `/` |
| **Custom domain** | Yes | Yes |
| **HTTPS** | Yes | Yes |
| **Headers control** | No | Yes (`_headers`) |
| **Redirects** | Limited | Yes (`_redirects`) |
| **Build** | GitHub Actions | Built-in |
| **CDN** | GitHub's CDN | Cloudflare (200+ cities) |
| **Cost** | Free | Free |

You can run both simultaneously. The `VITE_BASE_PATH` env var controls which mode the build uses.
