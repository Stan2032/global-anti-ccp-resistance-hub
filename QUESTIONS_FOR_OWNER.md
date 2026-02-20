# Questions for Owner — Items Requiring Human Decisions

**Created:** 2026-02-19 (Session 15, Opus 4.6)  
**Updated:** 2026-02-20 (Session 41, Opus 4.6) — Original Q1-Q5 all answered; 5 new decisions pending  
**Status:** ⏳ 5 DECISIONS PENDING (see below)

---

## 🔴 CURRENT PENDING DECISIONS (5 items)

> These were identified during data verification (Sessions 33-34) and require your input before agents can proceed. Answer with the number and your choice (e.g. "D1: Yes, both" or "D3: Skip").

### D1. Zhang Yuxin — Bad Data in Sanctioned Officials

Our `sanctioned_officials_research.json` has an entry for "Zhang Yuxin — Tibet Military Region Commander" that says **"Information not found."** This name/role combination doesn't match any real sanctioned individual. The actual current commander is Wang Kai.

**Options:**
- **A) Remove the entry entirely** — cleanest approach
- **B) Replace with Che Dalha** — current TAR Party Secretary, continues repressive policies
- **C) Replace with Zhang Qingli** — former TAR Party Secretary during the 2008 crackdown, well-documented abuses
- **D) Replace with both** Che Dalha and Zhang Qingli (remove Zhang Yuxin, add two real entries)

**Agent recommendation:** Option D — both are documented, verified officials involved in Tibetan repression. **Best agent: Opus 4.6** (requires source verification against CCP narratives).

---

### D2. Du Bin — Add to Political Prisoner Database?

Du Bin is a journalist and author arrested **October 15, 2025**, formally charged **December 12, 2025** with "picking quarrels and provoking trouble" (a catch-all charge the CCP uses against dissidents). This is his third detention but first formal charge. He faces up to 5 years.

**Source:** Human Rights Watch (Tier 1 source). Already in our `recent_news_research.json` but NOT in the political prisoner database.

**Options:**
- **A) Yes, add him** — he's a documented political prisoner with verified HRW sourcing
- **B) No, skip** — keep database focused on current scope

**Agent recommendation:** Option A — clear-cut political prisoner case. **Best agent: Opus 4.6**.

---

### D3. Rachung Gendun — Add to Political Prisoner Database?

Rachung Gendun is a Tibetan monk imprisoned for 3.5 years for sending prayer money to monasteries in exile for his uncle Taphun, who self-immolated in March 2022. Released **November 16, 2024** in poor health.

**Source:** Tibet Watch (Tier 2 source). Already in our `recent_news_research.json` but NOT in the political prisoner database.

**Options:**
- **A) Yes, add him** — documents religious persecution and self-immolation response pattern
- **B) No, skip** — he's already released, keep database focused on currently detained

**Agent recommendation:** Option A — even released prisoners document patterns of persecution. **Best agent: Opus 4.6**.

---

### D4. Profile Page Priority — Which Person First?

The TODO lists 6+ detailed person profile pages to build (Jimmy Lai, Ilham Tohti, Gedhun Choekyi Nyima, Liu Xiaobo, Joshua Wong, Gui Minhai, plus extras). Which should be built first?

**Options:**
- **A) Jimmy Lai** — most recent sentencing (Feb 9, 2026), most verified data, highest current media attention
- **B) Ilham Tohti** — life sentence, Sakharov Prize winner, represents Uyghur persecution
- **C) Gedhun Choekyi Nyima** — 30 years disappeared, represents Tibetan persecution
- **D) Your own priority order**

**Agent recommendation:** Option A (Jimmy Lai) — most data already verified, most timely. **Best agent: Opus 4.6 (content/verification) + Sonnet 4.5 (UI/layout)**.

---

### D5. Office of Political Prisoner Advocacy — Track This Policy Proposal?

The Olivia Enos article (Forbes) proposes creating a dedicated US State Department office for political prisoner advocacy, led by a special envoy of ambassador rank. This is a significant policy proposal that could affect how the US government coordinates pressure on the CCP.

**Options:**
- **A) Yes, track it** — add to international responses / policy tracking data
- **B) No, skip** — it's a proposal, not enacted policy; wait until it progresses

**Agent recommendation:** Option A — it's worth tracking as a "policy development to watch." **Best agent: Opus 4.6**.

---

## ✅ PREVIOUSLY ANSWERED (Sessions 15-16) — Archived for Reference

### Answers Summary

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
> **⚠️ AMENDED (Session 41):** The descriptions below reflect the state as of Session 15 (Feb 19, 2026). Since then:
> - Session 36 added "Coming Soon" notices to all non-functional forms (VolunteerSignup, IncidentReportForm, ReportSighting, NewsDigest)
> - Session 36 removed false security claims ("End-to-end encrypted", "No logs retained") from IncidentReportForm
> - Session 36 replaced misleading success messages with honest notices + links to real organizations
> - Forms no longer "just show a success message" — they now honestly say "Coming Soon"

~~The site currently has no user-generated content — all data is hardcoded in components. But several features imply future UGC: VolunteerSignup, IncidentReportForm, SolidarityWall, LetterCampaign.~~

**Current state (Session 41):** Forms now display "Coming Soon — Backend Not Yet Implemented" notices with links to real human rights organizations. No fake success messages.

### Questions

**Q2.1: What is the plan for user-submitted content?** *(✅ ANSWERED: Option A — "Consider later")*  
~~Currently these forms have no backend — they just show a success message without actually sending data anywhere.~~  
**Update (Session 36):** Forms now show "Coming Soon" notices instead of fake success messages. Option A was implemented.

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

**My recommendation:** ~~Vercel serverless + Supabase — it's the lowest-friction path from your current Vite setup and has a generous free tier.~~ **Update:** Owner chose Cloudflare Pages. Recommendation updated to Cloudflare Pages Functions + Supabase (see Backend Recommendation section above).

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
> **⚠️ AMENDED (Session 41):** The description below was written in Session 15. Since then:
> - i18n infrastructure was built (LanguageContext, t() function, locale files)
> - 5 language files exist: en.json, zh-CN.json, zh-TW.json, ug.json, bo.json (231 keys each)
> - Navigation and common UI strings are translated
> - Content pages remain English-only pending volunteer translators

~~All content is in English. The site has a `LanguageGuide` component but no i18n infrastructure.~~

**Current state (Session 41):** i18n foundation is built with 5 locale files (English, Simplified Chinese, Traditional Chinese, Uyghur, Tibetan). Navigation wired to t() function. Full content translation awaiting volunteer native speakers.

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

> **⚠️ AMENDED (Session 41):** This table was written in Session 15. Most items have since been implemented. Strikethrough = already done.

| Question | If you answer... | I can immediately... | Status |
|----------|-----------------|---------------------|--------|
| Q1.1 | "No geolocation" | Nothing needed (current state is correct) | ✅ Done — owner chose A |
| Q1.1 | "Client-side API" | Implement ip-api.com integration (~30 min) | N/A — owner chose A |
| Q1.2 | "Yes, add WebRTC check" | Build client-side leak detector (~30 min) | ✅ Done — built useWebRTCLeakCheck hook |
| Q2.1 | "Keep as demo" | Add "Coming soon" notes to forms (~10 min) | ✅ Done — Session 36 |
| Q2.1 | "Email submissions" | Implement after Q4.2 is answered | N/A — deferred |
| Q3.1 | "Stay static" | Focus on remaining frontend improvements | ✅ Done — owner chose A |
| Q3.1 | "Add serverless API" | Scaffold Cloudflare functions (~2 hours) | Phase 2 when ready |
| Q4.1 | Any option | Configure deployment (~30 min) | ✅ Done — Cloudflare Pages chosen, _redirects + _headers configured |
| Q5.1 | Any languages | Set up i18n infrastructure (~1 hour) | ✅ Done — 5 locale files built |
| Q5.2 | "Yes, volunteers" | Create translation template files | ✅ Done — locale files ready for volunteer translators |

---

**To answer:** Simply reply with the question numbers and your choices (e.g., "Q1.1: A, Q1.2: B, Q2.1: A, Q3.1: A, Q4.1: Cloudflare, Q5: defer"). I'll execute immediately.
