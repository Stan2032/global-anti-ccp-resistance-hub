# Custom Domain Setup — Step-by-Step Dashboard Walkthrough

> **Last Updated:** March 8, 2026 (Session 236)
> **Difficulty:** Beginner — no coding needed, just clicking in dashboards
> **Time Required:** 30-45 minutes (plus up to 24h for DNS propagation)
> **Prerequisites:** Cloudflare account (free), a domain registrar account
> **Cost:** Domain ~$10-15/year, everything else free

---

## What You'll Get

| Feature | Without Custom Domain | With Custom Domain |
|---------|----------------------|--------------------|
| URL | `global-anti-ccp-resistance-hub.stane203.workers.dev` | `resistance-hub.org` |
| Tor / .onion access | ❌ Not available | ✅ Automatic |
| Email forwarding | ❌ Not available | ✅ Free via Cloudflare |
| SEO & link sharing | ⚠️ Generic workers.dev URL | ✅ Professional, memorable |
| DNSSEC | ❌ Not available | ✅ Free |
| Custom security rules | Limited | Full Cloudflare suite |

---

## Part 1: Buy a Domain (10 minutes)

### Option A: Buy Through Cloudflare (Easiest — Already Integrated)

1. Open your browser and go to **[dash.cloudflare.com](https://dash.cloudflare.com)**
2. Log in to your Cloudflare account
3. Look at the **left sidebar** → click **"Domain Registration"**
4. Click **"Register Domain"** (blue button)
5. In the search box, type your desired domain (e.g., `resistance-hub.org`)
6. Cloudflare shows available domains with prices. `.org` domains are typically ~$10-12/year
7. Click **"Purchase"** next to your chosen domain
8. Fill in the registration form:
   - Name, address, etc. (required by ICANN, but Cloudflare **automatically enables WHOIS privacy** — your details will NOT be public)
9. Enter payment (credit card or PayPal)
10. Click **"Complete Purchase"**

✅ **Done!** The domain is already on Cloudflare — skip straight to **Part 2 Step 4** below.

### Option B: Buy Elsewhere + Add to Cloudflare

If you already own a domain or prefer another registrar:

**Privacy-friendly registrars:**
- **Njalla** (njal.la) — Maximum anonymity, registers domains on their behalf, accepts crypto
- **Porkbun** (porkbun.com) — Affordable, free WHOIS privacy
- **Namecheap** (namecheap.com) — Budget option, free WHOIS privacy

After purchasing, continue to **Part 2** below.

---

## Part 2: Add Your Domain to Cloudflare (15 minutes)

> **If you bought the domain through Cloudflare Registrar, skip to Step 4** — your domain is already on Cloudflare.

### Step 1: Add the Site

1. Go to **[dash.cloudflare.com](https://dash.cloudflare.com)**
2. On the home page, you'll see a blue button at the top: **"Add a site"** — click it
3. Type your domain name (e.g., `resistance-hub.org`) into the text field
4. Click **"Continue"**

### Step 2: Select the Free Plan

You'll see a plan selection page with options ranging from Free to Enterprise.

1. Scroll down to the **"Free"** plan (bottom option, $0/month)
2. Click **"Continue"** on the Free plan

Cloudflare will now scan your domain for existing DNS records. This takes 10-30 seconds.

### Step 3: Update Nameservers at Your Registrar

This is the most important step. Cloudflare will show you a page that says:

> **"Change your nameservers"**
>
> Remove any existing nameservers and add the following:
> - `nina.ns.cloudflare.com`
> - `art.ns.cloudflare.com`

*(Your actual nameservers will be different — use what Cloudflare shows you)*

**Now go to your domain registrar:**

**If you used Porkbun:**
1. Log in to porkbun.com → **Domain Management**
2. Click your domain → **Nameservers** (or "Edit" next to nameservers)
3. Delete the existing entries
4. Add the two Cloudflare nameservers exactly as shown
5. Click **Save**

**If you used Namecheap:**
1. Log in to namecheap.com → **Domain List** → click **Manage** next to your domain
2. In the **Nameservers** section, select **"Custom DNS"** from the dropdown
3. Enter the two Cloudflare nameservers
4. Click the **green checkmark** to save

**If you used Njalla:**
1. Log in to njal.la → click your domain
2. Go to **Nameservers** tab
3. Replace existing nameservers with Cloudflare's
4. Click **Update**

After changing nameservers:
1. Go back to the Cloudflare tab
2. Click **"Done, check nameservers"**
3. Cloudflare will email you when nameservers are active (usually 5-30 minutes, sometimes up to 24 hours)

### Step 4: Verify Your Domain is Active

1. Go to **[dash.cloudflare.com](https://dash.cloudflare.com)**
2. Click on your domain in the list
3. Look at the top of the page — you should see a **green "Active"** status
4. If it still says "Pending", wait a bit longer and refresh

> ⏳ **Note:** If you just changed nameservers, it can take up to 24 hours in rare cases. Usually it's 5-30 minutes.

---

## Part 3: Connect Domain to Your Workers Site (5 minutes)

Now we'll point your new domain to the existing Workers deployment.

### Step 1: Go to Workers & Pages

1. From the Cloudflare dashboard home, look at the **left sidebar**
2. Click **"Workers & Pages"**
3. You'll see a list of your deployed projects
4. Click on **"global-anti-ccp-resistance-hub"** (your worker)

### Step 2: Add Custom Domain

1. You're now on the worker's overview page
2. Click the **"Settings"** tab at the top
3. In the left sidebar (or section list), click **"Domains & Routes"**
4. You'll see a section called **"Custom Domains"**
5. Click the **"Add +"** button (or "Add Custom Domain")
6. Type your domain: `resistance-hub.org` (or whatever you registered)
7. Click **"Add Custom Domain"**

Cloudflare will automatically:
- Create the DNS record pointing to your worker
- Provision an SSL certificate (takes 1-2 minutes)

### Step 3: Add the www Subdomain (Optional but Recommended)

Repeat the process:
1. Click **"Add +"** again
2. Type `www.resistance-hub.org`
3. Click **"Add Custom Domain"**

### Step 4: Verify It Works

1. Open a new browser tab
2. Go to `https://resistance-hub.org` (your domain)
3. **You should see the Resistance Hub site!** 🎉
4. Also try `https://resistance-hub.org/api/v1/` — should show the API response

> ⏳ If it doesn't work immediately, wait 2-5 minutes for the SSL certificate to be issued. You can check the status on the Settings → Domains & Routes page — look for a green "Active" badge.

---

## Part 4: Set Up HTTPS Properly (3 minutes)

### Step 1: Set SSL Mode to Full (Strict)

1. From the Cloudflare dashboard, click your domain in the left sidebar (or go to dash.cloudflare.com and click your domain)
2. In the left sidebar, click **"SSL/TLS"**
3. Click **"Overview"**
4. You'll see a section showing your encryption mode with 4 options:
   - Off
   - Flexible
   - Full
   - **Full (strict)** ← Click this one
5. The page auto-saves — you'll see a green confirmation

### Step 2: Enable "Always Use HTTPS"

1. Still in SSL/TLS section, click **"Edge Certificates"** in the sidebar
2. Scroll down to find **"Always Use HTTPS"**
3. Toggle it **ON** (switch should turn blue/green)

This automatically redirects any `http://` visitors to `https://`.

### Step 3: Enable HSTS (Recommended)

1. Still on the Edge Certificates page, scroll down to **"HTTP Strict Transport Security (HSTS)"**
2. Click **"Enable HSTS"**
3. A warning dialog appears — read it, then click **"I understand"**
4. Set these values:
   - **Max-Age:** `12 months` (select from dropdown)
   - **Include subdomains:** ✅ ON
   - **Preload:** ✅ ON
   - **No-Sniff:** ✅ ON
5. Click **"Save"**

### Step 4: Quick Test

Open your terminal or command prompt and run:
```bash
curl -I https://resistance-hub.org
```

You should see:
```
HTTP/2 200
strict-transport-security: max-age=31536000; includeSubDomains; preload
```

---

## Part 5: Enable Onion Routing for Tor Access (1 minute)

This is the feature that **only works with a custom domain** — it's why we're doing all this!

### Step 1: Navigate to Network Settings

1. From the Cloudflare dashboard for your domain
2. In the left sidebar, click **"Network"**

### Step 2: Enable Onion Routing

1. Scroll down the page until you see **"Onion Routing"**
2. Toggle it **ON**

That's it. Cloudflare automatically:
- Generates a unique `.onion` address for your site
- Adds an `Onion-Location` header to every response
- Tor Browser users see a 🟣 purple **".onion available"** pill in the address bar

### Step 3: Verify in Tor Browser

1. Download and open **[Tor Browser](https://www.torproject.org/download/)**
2. Navigate to `https://resistance-hub.org`
3. Look at the address bar — you should see a purple pill icon: **".onion available"**
4. Click the pill → you'll be redirected to the `.onion` version
5. The site loads identically but through Tor's encrypted onion network

> 💡 **Why this matters:** Users in censored regions (China, Iran, etc.) can access the site through Tor without revealing they're visiting a human rights website.

---

## Part 6: Enable DNSSEC (2 minutes)

DNSSEC prevents DNS spoofing attacks — someone pretending to be your domain.

### If Your Domain is Registered at Cloudflare:

1. In the left sidebar, click **"DNS"**
2. Click **"Settings"** (tab at top of DNS page)
3. Find **"DNSSEC"** → Click **"Enable DNSSEC"**
4. ✅ Done — Cloudflare handles everything automatically

### If Your Domain is Registered Elsewhere:

1. In Cloudflare dashboard → **DNS** → **Settings** → **"Enable DNSSEC"**
2. Cloudflare shows you a **DS record** — it looks like this:
   ```
   DS Record:
   Key Tag: 2371
   Algorithm: 13
   Digest Type: 2
   Digest: abc123def456...
   ```
3. Go to your registrar's domain settings
4. Find **"DNSSEC"** or **"DS Records"**
5. Add the DS record from Cloudflare
6. Save

---

## Part 7: Set Up Email Forwarding (5 minutes, optional)

Get professional email addresses like `admin@resistance-hub.org` that forward to your personal email.

### Step 1: Start Email Routing

1. In the Cloudflare left sidebar, click **"Email"**
2. Click **"Email Routing"**
3. If it's your first time, click **"Get Started"**
4. You'll be asked to add a **destination address** — enter your personal email
5. Cloudflare sends a verification email → go check your inbox and click the link

### Step 2: Create Email Addresses

After verification:

1. Click **"Routing Rules"** tab
2. Click **"Create address"**
3. Create these addresses (one at a time):

   | Custom address | Forwards to |
   |---------------|-------------|
   | `admin@resistance-hub.org` | your personal email |
   | `security@resistance-hub.org` | your personal email |
   | `tips@resistance-hub.org` | your personal email |
   | `press@resistance-hub.org` | your personal email |

4. For each: type the address prefix (e.g., `admin`), select your verified destination, click **"Save"**

### Step 3: (Optional) Catch-All Rule

To receive email sent to **any** address at your domain:

1. At the bottom of Routing Rules, find **"Catch-all address"**
2. Set the action to **"Send to an email destination address"**
3. Select your personal email
4. Click **"Save"**

---

## Part 8: Update Your Project Configuration (5 minutes)

Now update the codebase references to use your new domain.

### Step 1: Update Environment Variables in Cloudflare

1. Go to **Workers & Pages** → click your worker
2. Click **"Settings"** → **"Variables"**
3. Add or update: `VITE_SITE_URL` = `https://resistance-hub.org`
4. Click **"Save and Deploy"**

### Step 2: Update These Files in the Repository

Edit these files and replace the old URL with your new domain:

**`public/sitemap.xml`** — Find any `workers.dev` URLs and replace with your domain:
```xml
<loc>https://resistance-hub.org/</loc>
```

**`public/robots.txt`** — Update the sitemap URL:
```
Sitemap: https://resistance-hub.org/sitemap.xml
```

**`index.html`** — Update Open Graph meta tags (for link previews on social media):
```html
<meta property="og:url" content="https://resistance-hub.org" />
```

### Step 3: Redeploy

```bash
npm run build
npx wrangler deploy
```

---

## Part 9: Redirect the Old workers.dev URL (Optional, 3 minutes)

If anyone has bookmarked the old `*.workers.dev` URL, you can redirect them.

### Using Cloudflare Redirect Rules:

1. Go to your domain in the Cloudflare dashboard
2. Left sidebar → **"Rules"** → **"Redirect Rules"**
3. Click **"Create rule"**
4. Set up the rule:
   - **Rule name:** "Redirect old workers.dev"
   - **When incoming requests match:** Custom filter expression
   - **Field:** `Hostname` **Operator:** `equals` **Value:** `global-anti-ccp-resistance-hub.stane203.workers.dev`
   - **Then redirect to:** `https://resistance-hub.org` + same URI path
   - **Status code:** `301` (Permanent Redirect)
5. Click **"Deploy"**

> ⚠️ Note: This only works if the workers.dev hostname passes through this domain's Cloudflare zone. If it doesn't, the old workers.dev URL will simply continue to work alongside the new one (which is fine).

---

## Part 10: Security Hardening Checklist (5 minutes)

Go through each of these in the Cloudflare dashboard for your domain:

### Speed & Performance

1. Left sidebar → **"Speed"** → **"Optimization"** → **"Content Optimization"**
   - **Auto Minify:** Turn ON for `JavaScript`, `CSS`, and `HTML`
   - **Brotli:** Toggle **ON**
   - **Early Hints:** Toggle **ON**

### Network Settings

1. Left sidebar → **"Network"**
   - **HTTP/3 (with QUIC):** Toggle **ON**
   - **0-RTT Connection Resumption:** Toggle **ON**
   - **WebSockets:** Toggle **ON** (in case you add real-time features later)

### Bot Protection

1. Left sidebar → **"Security"** → **"Bots"**
   - **Bot Fight Mode:** Toggle **ON**
   - This blocks known bad bots while allowing legitimate crawlers (Google, Bing)

### Firewall (if targeted by attacks)

1. Left sidebar → **"Security"** → **"WAF"**
2. You can create custom rules to block traffic from specific countries if needed
3. The API worker already has rate limiting (100 req/min per IP), so this is usually not needed

---

## Complete Security Checklist

After finishing all parts above, verify everything is set:

| ✅ | Setting | Where to Check |
|----|---------|----------------|
| ☐ | Domain resolves to your site | Visit `https://your-domain.com` |
| ☐ | SSL mode is "Full (strict)" | SSL/TLS → Overview |
| ☐ | "Always Use HTTPS" is ON | SSL/TLS → Edge Certificates |
| ☐ | HSTS is enabled | SSL/TLS → Edge Certificates |
| ☐ | DNSSEC is enabled | DNS → Settings |
| ☐ | Onion Routing is ON | Network |
| ☐ | HTTP/3 is ON | Network |
| ☐ | Bot Fight Mode is ON | Security → Bots |
| ☐ | Auto Minify is ON | Speed → Optimization |
| ☐ | Brotli is ON | Speed → Optimization |
| ☐ | API works at `/api/v1/` | Visit `https://your-domain.com/api/v1/` |
| ☐ | Tor Browser shows .onion pill | Open site in Tor Browser |

---

## Troubleshooting

### "This site can't be reached" / Domain not resolving
- **Wait longer** — DNS propagation can take 5 minutes to 24 hours
- **Check nameservers:** Run `dig your-domain.org NS` — should show Cloudflare nameservers
- **Verify in Cloudflare:** Dashboard should show domain status as "Active" (green)

### "Too many redirects" or infinite loop
- Go to SSL/TLS → Overview → Set mode to **"Full (strict)"** (not "Flexible")
- If still broken: temporarily turn OFF "Always Use HTTPS" to test

### "SSL handshake failed" / Certificate error
- Custom domain SSL certificates can take up to 15 minutes to issue
- Check: Workers & Pages → your worker → Settings → Domains & Routes → look for green "Active" status
- If stuck: remove the custom domain and re-add it

### Onion Routing toggle is missing
- This ONLY appears when you have a custom domain (not on `*.workers.dev`)
- Make sure you're looking at your **domain** settings, not the worker settings
- Path: dash.cloudflare.com → [your domain] → Network → Onion Routing

### `.onion` address not showing in Tor Browser
- Clear Tor Browser cache: ☰ menu → Settings → Privacy → Clear Data
- Make sure you're visiting the `https://` version (not `http://`)
- Verify the header: `curl -I https://your-domain.com` — look for `Onion-Location:` in the response

### Email forwarding not working
- Check that you **verified** the destination email (Cloudflare sent a confirmation link)
- Go to Email → Email Routing → check that MX records are set correctly (Cloudflare usually does this automatically)
- Check your spam folder

---

## Cost Summary

| Item | Cost | Notes |
|------|------|-------|
| Domain registration | ~$10-15/year | Depends on TLD (.org, .com, etc.) |
| Cloudflare plan | **Free** | Free plan is sufficient |
| SSL certificate | **Free** | Auto-issued by Cloudflare |
| Onion Routing (Tor) | **Free** | Included in free plan |
| Email Routing | **Free** | Up to 200 email addresses |
| DNSSEC | **Free** | Included in free plan |
| Workers (100K req/day) | **Free** | Free plan limit |
| CDN / caching | **Free** | Included in free plan |
| **Total** | **~$10-15/year** | Domain is the only cost |

---

## Privacy Considerations for Domain Registration

If you're concerned about your identity being linked to this project:

1. **Cloudflare Registrar** — Automatically hides your WHOIS info with their redaction service. Your name/address is NOT publicly visible. However, Cloudflare knows who you are.

2. **Njalla** (njal.la) — Registers the domain on THEIR behalf. Even the registrar records show Njalla's info, not yours. Accepts cryptocurrency. Highest anonymity.

3. **Porkbun / Namecheap** — Free WHOIS privacy that hides your info behind a proxy service. Standard level of privacy.

4. **Payment anonymity** — If paying with crypto: use Monero (XMR) for maximum privacy, or use CoinJoin-mixed Bitcoin. Njalla is the only registrar above that accepts crypto directly.

> ⚠️ **Important:** Even with WHOIS privacy, your registrar knows your identity. If you need maximum protection, use Njalla with cryptocurrency and a VPN.
