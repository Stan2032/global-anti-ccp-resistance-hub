# Deployment

> **You do not need to deploy this site. It deploys itself.**
>
> Cloudflare **Workers Builds** is connected to this repository over its Git
> integration. Every push to `master` goes to production; every push to any
> other branch gets its own preview URL, posted as a comment on the pull
> request. There is no deploy command to run and no GitHub Actions workflow
> involved.
>
> Verified 2026-09-19 by watching builds fire on eight consecutive pushes.

---

## Do not migrate this to Cloudflare Pages

This comes up because an earlier version of this guide described a Pages
setup. That description was wrong, and the question is worth settling.

Cloudflare's own guidance, from
[Workers Best Practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/):

> **Use Workers Static Assets for new projects.** […] If you are starting a
> new project, use Workers instead of Pages. Pages continues to work, but new
> features and optimizations are focused on Workers.

The only migration guide Cloudflare publishes runs
[Pages → Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/).
There is no Workers → Pages path, because moving that way is a move onto the
older platform.

Concretely, this project would lose four things by moving to Pages:

| | Why it would break |
|---|---|
| **The REST API** | `api/worker.js` serves `/api/v1/*`. On Pages this has to be rewritten as Pages Functions. |
| **The RSS feed proxy** | `/api/v1/feed` is what stops every reader's browser contacting third-party CORS proxies. It is part of the same Worker. |
| **`html_handling`** | `drop-trailing-slash` is a Workers Static Assets setting. Without it all 26 pre-rendered content URLs answer with a 307 redirect. |
| **Durable Objects, Cron Triggers, fuller observability** | Available to Workers, not to Pages. |

`wrangler.jsonc` is already in the exact shape Cloudflare recommends for a
full-stack app: a `main` entry point plus an `assets` binding.

---

## What is connected today

| | |
|---|---|
| **Platform** | Cloudflare Workers with Static Assets |
| **Worker name** | `global-anti-ccp-resistance-hub` |
| **Production URL** | `https://global-anti-ccp-resistance-hub.stane203.workers.dev` |
| **Production branch** | `master` |
| **Build command** | `npm run build` (Vite build, then `scripts/prerender.mjs`) |
| **Output** | `dist/` — 27 routes pre-rendered to static HTML |
| **Config** | `wrangler.jsonc` |
| **Headers** | `public/_headers` — 6 of 6 security headers verified live |

**CI and deployment are different systems.** GitHub Actions runs the tests;
Cloudflare runs the deploy. **A red CI run does not block a deploy.** If you
want deploys gated on tests, that has to be configured on the Cloudflare side.

---

## Things you may actually want to do, in the dashboard

### Watch a deploy

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign in.
2. **Compute (Workers)** in the left sidebar → select
   **global-anti-ccp-resistance-hub**.
3. Open the **Deployments** tab. Each entry shows the commit, the branch and
   the build log.

Preview URLs for a branch also appear automatically as a comment on the pull
request, so you rarely need the dashboard for this.

### Change build settings

1. Same Worker → **Settings** → **Build**.
2. Build command, production branch and root directory are all here.

Leave the build command as `npm run build`. It runs the pre-render step, and
that step **fails the build** if any content would be invisible to a reader
without JavaScript. That guard is the point.

### Add the Supabase keys (only if you create a Supabase project)

Four forms on the site are inert until these exist. Without them the site
runs in static-only mode and the forms say so.

1. Worker → **Settings** → **Variables and Secrets**.
2. Add, for the **Production** environment:

   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | your project's anon/publishable key |

3. Redeploy for them to take effect — push any commit, or use
   **Deployments → Retry**.

These are build-time variables: Vite inlines anything prefixed `VITE_` into
the client bundle. **Never put a Supabase service-role key here** — it would
ship to every visitor. The anon key is designed to be public and is safe only
while row-level security is enabled on the tables. See `SUPABASE_SETUP.md`.

### Add a custom domain

1. Add the domain to Cloudflare first: **Account Home** → **Add a domain**,
   then follow the nameserver instructions. This creates a *zone*.
2. Worker → **Settings** → **Domains & Routes** → **Add** → **Custom domain**.
3. Enter the hostname (`example.org` or `www.example.org`) and save.

Cloudflare issues the certificate. DNS records are created for you.

### Turn on Onion Routing, for Tor readers

[Onion Routing](https://developers.cloudflare.com/network/onion-routing/)
serves the site through the Tor network without exit nodes, so a Tor reader's
traffic is never exposed at an exit node it does not control. It is available
on **all plans, including Free**.

1. Cloudflare dashboard → select your **domain** (not the Worker).
2. **Network** in the sidebar.
3. Set **Onion Routing** to **On**.

> **This requires a custom domain.** The setting lives on a zone, and a
> `*.workers.dev` subdomain is not a zone. Until a domain is added, there is
> no Network page to turn it on from. That is the main practical argument for
> doing the custom domain.

---

## One thing that does need doing: the GitHub Pages mirror

A second copy of this site is live at
`https://stan2032.github.io/global-anti-ccp-resistance-hub/`.

Measured 2026-09-19, it serves **1 of 6** key security headers — only
`Strict-Transport-Security`. The Cloudflare deployment serves **6 of 6**.
Missing on the mirror:

- **`Content-Security-Policy`** — nothing constrains what the page may load
  or connect to.
- **`Referrer-Policy`** — a reader who follows an outbound link tells the
  destination they came from an anti-CCP human rights site. For this
  audience that is the actual risk, not a theoretical one.
- `X-Frame-Options`, `Permissions-Policy`, `X-Content-Type-Options`.

GitHub Pages cannot serve custom headers at all — there is no `_headers`
equivalent — so this cannot be fixed, only turned off. The mirror is also
frozen at whatever was last published to it, so it will drift further from
the real site with every deploy.

**Deleting the workflow did not take it down.** The workflow only published
to it; the site stays up until Pages is disabled on the repository.

To turn it off:

1. Go to `https://github.com/Stan2032/global-anti-ccp-resistance-hub`.
2. **Settings** (top tab) → **Pages** (left sidebar, under "Code and
   automation").
3. Under **Build and deployment**, set **Source** to **None**.
   - If there is no **None** option, the site is being published from a
     branch: use the **Branch** dropdown and select **None**, then **Save**.
4. Optionally delete the `gh-pages` branch if one exists:
   **Code** → **Branches** → bin icon next to `gh-pages`.

Then confirm it is gone — this should return `404`:

```
curl -s -o /dev/null -w "%{http_code}\n" \
  https://stan2032.github.io/global-anti-ccp-resistance-hub/
```

If you would rather keep a mirror for censorship resilience, keep it
deliberately: a second Cloudflare Worker, or an IPFS copy, either of which
can carry the same headers. A mirror is a reasonable thing to want; this
particular one just cannot be secured.

---

## Troubleshooting

**A deploy did not fire.** Check **Settings → Build** that the repository is
still connected and the production branch is `master`. Workers Builds can
disconnect if the GitHub App's permissions are revoked.

**The build failed with "sections were written into `<div hidden>`".** This
is the pre-render guard doing its job: something on the page would have been
invisible to a reader with JavaScript disabled. Do not bypass it. See
`docs/MODERNIZATION.md` §17.

**Routes 404 or return the wrong page.** `not_found_handling` and
`html_handling` in `wrangler.jsonc` control this. `drop-trailing-slash` is
deliberate — see the comment in that file.

**Forms still say "Coming Soon".** The Supabase variables are missing, or
the SQL in `SUPABASE_SETUP.md` has not been run.

**Stale CSS or content.** Worker → **Deployments** → confirm the newest
deployment is the commit you expect. Assets are content-hashed, so a genuine
stale asset is rare; a stale *deployment* is the usual cause.

---

## Do not do these

- **Do not add a GitHub Actions deploy workflow.** One existed and was
  deleted. With `CLOUDFLARE_API_TOKEN` set, every push to `master` would
  deploy twice and the two would race. Cloudflare already deploys.
- **Do not run `npx wrangler deploy` as the normal path.** It pushes your
  local build straight to production, skipping CI and the pre-render guard.
  It is a fallback for when the Git integration is broken.
- **Do not migrate to Pages.** See the top of this file.
