# Questions for Owner — Items Requiring Human Decisions

**Created:** 2026-02-19 (Session 15, Opus 4.6)  
**Updated:** 2026-02-19 (Session 16, Opus 4.6) — All answers received and implemented  
**Status:** ✅ ALL QUESTIONS ANSWERED

---

## Answers Summary

| Question | Owner's Answer | Implementation Status |
|----------|---------------|----------------------|
| Q1.1: IP Geolocation | **A) No geolocation** | ✅ No changes needed |
| Q1.2: WebRTC Leak Detection | **B) Implement it** | ✅ Built in SecurityCenter (useWebRTCLeakCheck hook) |
| Q2.1: User Submissions | **A) Consider later** | ✅ Deferred |
| Q2.2: Data Moderation | **GitHub PRs from trusted contributors** | ✅ Documented in CONTRIBUTING guidelines |
| Q3.1: Backend Architecture | **A) Stay static now, B) serverless later** | ✅ Documented; see Backend Recommendation below |
| Q3.2: Tech Stack | **Research best fit** | ✅ See Backend Recommendation below |
| Q4.1: Deployment Target | **Cloudflare Pages** | ✅ _redirects + _headers configured |
| Q4.2: Email Service | **Unsure, defer** | ✅ Deferred |
| Q5.1: Languages | **Wait for volunteers; machine translate nav/basic only** | ✅ zh-CN added, i18n enhanced with __VOLUNTEER_TRANSLATION_NEEDED__ fallback |

---

## Backend Recommendation (Q3.2 Research)

### Recommended: Cloudflare Pages Functions + Supabase

Since you've chosen **Cloudflare Pages** for hosting, the natural backend evolution is:

**Phase 1 (Current):** Static site on Cloudflare Pages — ✅ Done

**Phase 2 (When needed):** Add Cloudflare Pages Functions for:
- Contact form submissions → write to Supabase
- Incident report storage → Supabase with row-level security
- Basic API endpoints → edge functions in `/functions` directory

**Phase 3 (If user accounts needed):** Add Supabase Auth + Database:
- Supabase provides: PostgreSQL, Auth (OAuth/email), file storage, real-time
- All free tier, open source core

### Why This Over Vercel + Supabase (Original Recommendation)

| Factor | Cloudflare + Supabase | Vercel + Supabase |
|--------|----------------------|-------------------|
| **Consistency** | Same platform for hosting + functions | Two platforms to manage |
| **Edge performance** | 300+ PoPs, ~10-50ms cold start | 70+ PoPs, ~50-150ms cold start |
| **Free tier** | Unlimited bandwidth, 100K func/day | 100GB bandwidth, 100K func/day |
| **Over-engineering risk** | Lower — functions live alongside static site | Higher — separate deployment pipeline |
| **DDoS protection** | Built-in (critical for activist site) | Add-on |
| **Censorship resistance** | Best-in-class (Cloudflare's network) | Good but not designed for this |

### Implementation When Ready

```
functions/
  api/
    submit-report.js    ← Cloudflare Pages Function
    contact.js          ← Cloudflare Pages Function
```

Each function is ~20 lines connecting to Supabase. No Docker, no server management, no ops overhead.

### Current State
- All **fake** VPN/Tor detection has been removed (it used `Math.random()`)
- Honest disclaimers added: *"This platform cannot detect whether you are using a VPN or Tor"*
- Links to 4 reputable self-test tools added (check.torproject.org, ipleak.net, dnsleaktest.com, mullvad.net/en/check)

### Questions

**Q1.1: Do you want real IP geolocation at all?**  
Real geolocation could show users "You appear to be browsing from [country]" to help them verify their VPN is working. But it has trade-offs:

| Option | Pros | Cons |
|--------|------|------|
| **A) No geolocation** (current) | Zero privacy risk, no API costs, no third-party dependencies | Users must use external tools to verify |
| **B) Client-side via free API** (e.g. ip-api.com) | Simple, free, no backend needed | Accuracy varies, free APIs have rate limits, sends user IP to third party |
| **C) Server-side via MaxMind** | Most accurate, data stays on your server | Requires backend, costs $0-25/month, needs GeoLite2 license |

**My recommendation:** Option A (current state) is appropriate for a static site. If you later add a backend (see Q3 below), Option C becomes viable.

**Q1.2: Do you want WebRTC leak detection?**  
This is a client-side feature that could warn users if their browser is leaking their real IP through WebRTC, even when using a VPN. It requires no backend or API keys.

| Option | Pros | Cons |
|--------|------|------|
| **A) Don't add it** | Simpler, the external tools already test this | Users have to leave the site to check |
| **B) Add client-side WebRTC leak check** | Useful for activists, runs entirely in-browser, no privacy risk | ~50 lines of JS, may not work in all browsers |

**My recommendation:** Option B — it's a genuinely useful security feature with zero privacy risk. I can implement it in ~30 minutes if approved.

---

## 2. Content Policy (HR2)

### Current State
The site currently has no user-generated content — all data is hardcoded in components. But several features imply future UGC: VolunteerSignup, IncidentReportForm, SolidarityWall, LetterCampaign.

### Questions

**Q2.1: What is the plan for user-submitted content?**  
Currently these forms have no backend — they just show a success message without actually sending data anywhere.

| Option | What happens |
|--------|-------------|
| **A) Keep forms as demo/placeholder** | No changes needed, but should add a note like "Coming soon" |
| **B) Add email-based submissions** | Forms send to a moderation email (needs email service, see Q4.2) |
| **C) Add backend with moderation queue** | Full CMS-style content pipeline (needs backend, see Q3) |

**My recommendation:** If budget is limited, Option B is a practical middle ground. Option A is honest if you're not ready.

**Q2.2: Who moderates new data submissions (prisoners, facilities, companies)?**  
The site has 142 data entries across 4 categories, all manually curated with source URLs. When new information surfaces:

- Who verifies and approves new entries?
- Is there a trusted team or is it just you?
- Should there be a public submission form, or only edits via GitHub PRs?

**My recommendation:** For now, GitHub PRs from trusted contributors. This is the safest approach for a human rights platform.

---

## 3. Backend Architecture (HR1)

### Current State
This is a purely static React app (Vite + React + Tailwind). There is no backend, no database, no authentication.

### Questions

**Q3.1: Do you plan to add a backend?**  
This determines whether many features are feasible (real-time data, user accounts, content moderation).

| Option | Scope | Cost | Timeline |
|--------|-------|------|----------|
| **A) Stay static** (deploy to GitHub Pages / Netlify / Vercel) | Current features only | Free | Now |
| **B) Add lightweight API** (e.g., Vercel serverless functions) | Contact forms, basic data API | Free tier | 1-2 weeks |
| **C) Full backend** (Node.js + PostgreSQL on DigitalOcean/Railway) | User accounts, moderation, real-time feeds | $5-20/month | 4-8 weeks |

**My recommendation:** Option A for now, with Option B as a natural next step when you need form submissions. Option C is only needed if you want user accounts.

**Q3.2: If yes to backend — what tech stack?**  
Only relevant if you answered B or C above.

| Stack | Why |
|-------|-----|
| **Vercel serverless + Supabase** | Generous free tier, works with existing React/Vite, minimal ops |
| **Node.js + Express + PostgreSQL** | Maximum control, well-documented, huge community |
| **Python + FastAPI + PostgreSQL** | If you prefer Python; good for data-heavy features |

**My recommendation:** Vercel serverless + Supabase — it's the lowest-friction path from your current Vite setup and has a generous free tier.

---

## 4. Third-Party Services (HR3)

### Questions

**Q4.1: What's the deployment target?**  
The site builds to static HTML/JS/CSS. Where do you want to host it?

| Option | Cost | SSL | Custom Domain |
|--------|------|-----|---------------|
| **GitHub Pages** | Free | Yes | Yes |
| **Vercel** | Free tier | Yes | Yes, also supports serverless |
| **Netlify** | Free tier | Yes | Yes |
| **Cloudflare Pages** | Free | Yes | Best for censorship-resistant access |

**My recommendation:** Cloudflare Pages — given the site's focus on human rights activism against an authoritarian state, Cloudflare's DDoS protection and global CDN make it the most resilient option.

**Q4.2: Do you need an email service?**  
Only relevant if forms should actually send data (see Q2.1).

If yes: SendGrid free tier (100 emails/day) is the easiest starting point.

---

## 5. Multilingual Support (L2)

### Current State
All content is in English. The site has a `LanguageGuide` component but no i18n infrastructure.

### Questions

**Q5.1: What languages are a priority?**  
Given the site's audience:

| Language | Why |
|----------|-----|
| **Chinese (Simplified/Traditional)** | Primary audience within China, diaspora |
| **Uyghur** | Affected community |
| **Tibetan** | Affected community |
| **Cantonese (Traditional Chinese)** | Hong Kong audience |

**Q5.2: Do you have access to native speakers for translation?**  
Machine translation (e.g., Google Translate API) is an option but produces poor results for sensitive human rights content. Mistranslation of legal or safety information could be dangerous.

**My recommendation:** Don't use machine translation for this content. Wait until native-speaking volunteers are available. I can set up the i18n infrastructure (react-i18next) so translations can be dropped in when ready — that takes ~1 hour.

---

## Summary: What I Can Do Immediately After Each Answer

| Question | If you answer... | I can immediately... |
|----------|-----------------|---------------------|
| Q1.1 | "No geolocation" | Nothing needed (current state is correct) |
| Q1.1 | "Client-side API" | Implement ip-api.com integration (~30 min) |
| Q1.2 | "Yes, add WebRTC check" | Build client-side leak detector (~30 min) |
| Q2.1 | "Keep as demo" | Add "Coming soon" notes to forms (~10 min) |
| Q2.1 | "Email submissions" | Implement after Q4.2 is answered |
| Q3.1 | "Stay static" | Focus on remaining frontend improvements |
| Q3.1 | "Add serverless API" | Scaffold Vercel functions (~2 hours) |
| Q4.1 | Any option | Configure deployment (~30 min) |
| Q5.1 | Any languages | Set up i18n infrastructure (~1 hour) |
| Q5.2 | "Yes, volunteers" | Create translation template files |

---

**To answer:** Simply reply with the question numbers and your choices (e.g., "Q1.1: A, Q1.2: B, Q2.1: A, Q3.1: A, Q4.1: Cloudflare, Q5: defer"). I'll execute immediately.
