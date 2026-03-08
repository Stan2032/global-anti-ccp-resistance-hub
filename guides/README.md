# Setup Guides

Step-by-step instructions for deploying and configuring the Global Anti-CCP Resistance Hub's backend services.

## Available Guides

| Guide | Description | Prerequisites |
|-------|-------------|---------------|
| [Cloudflare Workers API Setup](CLOUDFLARE_WORKERS_API_SETUP.md) | Deploy the public REST API via Cloudflare Workers. 13 dataset endpoints with CORS, rate limiting, and global search. | Cloudflare account, `wrangler` CLI |
| [Web Push Setup](WEB_PUSH_SETUP.md) | Enable server-side push notifications. VAPID key generation, subscription storage (KV or Supabase), and push sending. | Cloudflare Workers deployed, VAPID keys |
| [Custom Domain Setup](CUSTOM_DOMAIN_SETUP.md) | Step-by-step dashboard walkthrough: buy domain, connect to Workers, enable Tor/onion routing, DNSSEC, email forwarding, security hardening. Written as "I'm looking at my dashboard, what next?" | Domain registrar account, Cloudflare account |
| [Supabase Database Management](SUPABASE_DATABASE_MANAGEMENT.md) | Day-to-day database management: viewing submissions, managing admins, monitoring usage, security maintenance. | Supabase project configured |

## Quick Start

1. **Deploy the site** — The site works as a static SPA without any backend. Just `npm run build` and deploy `dist/`.
2. **Add the REST API** — Follow the [Cloudflare Workers API guide](CLOUDFLARE_WORKERS_API_SETUP.md) to expose data endpoints.
3. **Enable push notifications** — Follow the [Web Push guide](WEB_PUSH_SETUP.md) to send alerts to subscribers.
4. **Add a custom domain** — Follow the [Custom Domain guide](CUSTOM_DOMAIN_SETUP.md) for a professional URL and Tor access.

## Related Documentation

- [Supabase Setup](../SUPABASE_SETUP.md) — Database for form submissions (incident reports, volunteer signups, etc.)
- [Supabase Auth Setup](../SUPABASE_AUTH_SETUP.md) — Admin login for viewing submissions
- [Cloudflare Deploy](../CLOUDFLARE_DEPLOY.md) — General deployment to Cloudflare Workers/Pages
- [Onion Routing Setup](../ONION_ROUTING_SETUP.md) — Tor hidden service via Cloudflare (requires custom domain)
- [Backend Guide](../BACKEND_GUIDE.md) — Security architecture, encryption, caching strategy
