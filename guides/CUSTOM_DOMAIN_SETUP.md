# Custom Domain + Onion Routing Setup Guide

> **Last Updated:** March 8, 2026 (Session 234)
> **Difficulty:** Beginner-Intermediate
> **Time Required:** 30-45 minutes
> **Prerequisites:** Cloudflare account, a domain registrar account
> **Cost:** Domain ~$10-15/year, Cloudflare: Free

---

## Overview

A custom domain provides:
1. **Professional URL** (e.g., `resistance-hub.org` instead of `*.workers.dev`)
2. **Cloudflare Onion Routing** — Tor users access the site via `.onion` address automatically
3. **Better SEO** and link sharing
4. **Email forwarding** (optional, via Cloudflare Email Routing)

---

## Step 1: Register a Domain

### Recommended registrars (privacy-friendly):
- **Cloudflare Registrar** — At-cost pricing, free WHOIS privacy, already integrated
- **Njalla** — Privacy-focused, accepts crypto payments, no personal info required
- **Porkbun** — Affordable, free WHOIS privacy

### Suggested domain names:
- `resistance-hub.org`
- `anticcp-hub.org`
- `ccpwatch.org`
- `freetibet-uyghur.org`

### Privacy considerations:
- **Always enable WHOIS privacy** to hide your personal details
- Consider using **Njalla** if you need maximum anonymity (they register on your behalf)
- If using crypto payment, use a privacy coin or mixed Bitcoin

---

## Step 2: Add Domain to Cloudflare

1. Log in to **Cloudflare Dashboard** → **Add a site**
2. Enter your domain name
3. Select the **Free plan**
4. Cloudflare scans existing DNS records
5. **Update nameservers** at your registrar:
   - Cloudflare gives you 2 nameservers (e.g., `nina.ns.cloudflare.com`, `art.ns.cloudflare.com`)
   - Go to your registrar's DNS settings
   - Replace existing nameservers with Cloudflare's
   - Wait 5-30 minutes for propagation

---

## Step 3: Connect Domain to Workers

### Option A: Custom Domain on Worker (Recommended)
1. Go to **Workers & Pages** → your worker (`global-anti-ccp-resistance-hub`)
2. Click **Settings** → **Domains & Routes** → **Custom Domains** → **Add**
3. Enter your domain: `resistance-hub.org`
4. Also add `www.resistance-hub.org` if desired
5. Cloudflare auto-creates DNS records

### Option B: DNS CNAME + Route
1. Go to **DNS** → **Records** → **Add Record**
2. Type: CNAME, Name: `@`, Target: `global-anti-ccp-resistance-hub.stane203.workers.dev`
3. Proxy: ✅ (orange cloud ON)
4. Go to **Workers Routes** → Add route: `resistance-hub.org/*` → your worker

---

## Step 4: Verify HTTPS

1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to **Full (strict)**
3. Go to **Edge Certificates** → Verify certificate is active
4. Test: `curl -I https://resistance-hub.org` should show `HTTP/2 200`

---

## Step 5: Enable Onion Routing (Tor Access)

1. Go to **Network** tab in Cloudflare Dashboard
2. Scroll to **Onion Routing**
3. Toggle **ON**

That's it! Cloudflare automatically:
- Generates a `.onion` address for your site
- Adds `Onion-Location` header to HTTP responses
- Tor Browser users see a 🟣 ".onion available" pill in the address bar

### Verify:
1. Open **Tor Browser**
2. Navigate to `https://resistance-hub.org`
3. Look for the purple pill icon → Click to switch to `.onion` version
4. The site loads identically but through Tor's onion network

---

## Step 6: (Optional) Email Forwarding

Cloudflare Email Routing lets you receive email at your custom domain without running a mail server.

1. Go to **Email** → **Email Routing** → **Get Started**
2. Add a destination address (your personal email)
3. Create routing rules:
   - `admin@resistance-hub.org` → your email
   - `security@resistance-hub.org` → your email
   - `tips@resistance-hub.org` → your email (for whistleblower contact)

---

## Step 7: Update Environment Variables

After domain setup, update these references:

### Cloudflare Workers environment:
```
VITE_SITE_URL=https://resistance-hub.org
```

### Update site metadata:
- `public/sitemap.xml` — Replace old URLs with new domain
- `public/robots.txt` — Update sitemap URL
- `.env.example` — Update example URL
- `index.html` — Update OG meta tags

---

## Step 8: (Optional) Redirect Old Domain

If people are already using the `*.workers.dev` URL:

1. Go to old Workers deployment settings
2. Add a redirect rule:
   ```
   https://global-anti-ccp-resistance-hub.stane203.workers.dev/*
   → https://resistance-hub.org/$1 (301 Permanent Redirect)
   ```

---

## Security Hardening After Domain Setup

### Enable these Cloudflare features:

| Feature | Location | Setting |
|---------|----------|---------|
| DNSSEC | DNS → Settings | Enable |
| HSTS | SSL/TLS → Edge Certificates | Enable (max-age: 1 year, include subdomains) |
| Always Use HTTPS | SSL/TLS → Edge Certificates | ON |
| Auto Minify | Speed → Optimization | HTML + JS + CSS |
| Brotli | Speed → Optimization | ON |
| Early Hints | Speed → Optimization | ON |
| HTTP/3 | Network | ON |
| 0-RTT | Network | ON |
| Bot Fight Mode | Security → Bots | ON |

### Firewall rules (if needed):
- Block by country if experiencing targeted attacks
- Rate limiting already handled by API worker (100 req/min per IP)

---

## Troubleshooting

### Domain not resolving
- Wait 24-48 hours for full DNS propagation
- Check: `dig resistance-hub.org` — should show Cloudflare IPs
- Verify nameservers at registrar match Cloudflare's

### "Too many redirects" error
- Set SSL mode to "Full (strict)" (not "Flexible")
- Disable "Always Use HTTPS" temporarily to debug

### Onion Routing toggle not visible
- Only available when using a custom domain (not `*.workers.dev`)
- Requires Cloudflare DNS (orange cloud proxy ON)

### `.onion` address not showing in Tor Browser
- Clear Tor Browser cache
- Ensure you're accessing the HTTPS version (not HTTP)
- Check: `curl -I https://resistance-hub.org` should include `Onion-Location` header

---

## Cost Summary

| Item | Cost |
|------|------|
| Domain registration | ~$10-15/year |
| Cloudflare plan | Free |
| Onion Routing | Free (included) |
| Email Routing | Free |
| Workers (100K req/day) | Free |
| DNSSEC | Free |
| **Total** | **~$10-15/year** |
