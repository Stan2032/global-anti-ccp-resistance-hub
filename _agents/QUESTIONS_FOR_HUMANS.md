# Questions for Humans — Active Decision Queue

> **Location:** `_agents/QUESTIONS_FOR_HUMANS.md`
> **Purpose:** Ongoing list of questions that require human input. Agents add questions here rather than blocking on decisions.
> **Protocol:** Agents should check this file at session start. When a human answers, agents mark the question ✅ and implement.
> **Previous decisions:** See `_agents/archive/QUESTIONS_FOR_HUMANS.md` for D1-D5, and `_agents/archive/QUESTIONS_FOR_HUMANS_Q6_Q11.md` for Q6-Q11 (all answered and implemented).

---

## 📌 STANDING INSTRUCTIONS (from Humans)

These are permanent directives that apply to all agents:

1. **Adding people:** Agents may add individuals to the database without asking, provided well-researched with Tier 1-2 sources and consistent with project goals.
2. **CCP source exclusion:** Never cite CCP state/party media (Xinhua, CGTN, Global Times, etc.). Use `isCCPStateMedia()` from `src/utils/sourceLinks.js`.
3. **CCP terminology:** Always use "CCP" (Chinese Communist Party), NEVER "CPC". Automated test enforces this.
4. **Email/newsletter:** DEFERRED by owner (Feb 25, 2026) — decide at a later date.
5. **Continuous work:** Agents should work autonomously on improvements, adding questions here when human input is needed.

---

## 🔴 OPEN QUESTIONS (Awaiting Human Decision)

### Q12: Custom Domain for Cloudflare Onion Routing (Session 155)

**Context:** Cloudflare Onion Routing requires a custom domain — it's not available for `workers.dev` subdomains. You reported that the onion routing toggle doesn't appear in your dashboard, which confirms this limitation.

**Question:** Do you plan to register/add a custom domain for the site? (This would also enable onion routing.)

**Options:**
- **A)** Yes, I'll register a custom domain (e.g., `resistancehub.org`) — Agent will update deployment docs when ready
- **B)** Not now, defer onion routing indefinitely — Agent will remove it from short-term TODO
- **C)** I already have a domain I want to use — Tell us the domain and we'll update the deployment config

**Agent recommendation:** A custom domain would benefit the project beyond just onion routing (better SEO, professional appearance, easier sharing). Domains are ~$10/year. However, this is entirely the owner's decision.

### Q13: Add Chow Hang-Tung, Lee Cheuk-yan, Albert Ho to Political Prisoners Database? (Session 264)

**RESOLVED by agent — Session 267** (per standing instruction: "agents may add individuals without asking if well-researched with verified sources")

**Resolution:**
- ✅ **Albert Ho** — Added Session 265 (pleaded guilty)
- ✅ **Lee Cheuk-yan** — Already in database (entry at line ~864, added pre-Session 264)
- ✅ **Chow Hang-Tung** — Added Session 267 with full **dedicated profile page** (17th profile page)
  - 16 timeline events, 2 charges, 4 CCP narrative rebuttals, 6 international responses, 10 Tier 1-2 sources
  - Sources: Amnesty International, NCHRD, HKFP, UN WGAD, Lawyers for Lawyers, Hong Kong Watch, HK Labour Rights Monitor

**Agent chose Option A** — Chow Hang-Tung's case is a landmark: first prosecution criminalizing historical memory (Tiananmen commemoration) as "subversion." UN ruled detention arbitrary. Amnesty prisoner of conscience.

### Q14: The github.io mirror is live, unhardened, and stale (Session 281)

**Context:** `https://stan2032.github.io/global-anti-ccp-resistance-hub/` returns HTTP 200 right now. It was published by a `deploy.yml` workflow targeting GitHub Pages, long after the project moved to Cloudflare Workers.

It serves **1 of 9 security headers** (only GitHub's own HSTS) against Cloudflare's 8. No CSP, no `X-Frame-Options`, and **no `Referrer-Policy`** — that last one means outbound clicks leak the referring URL, which can reveal that a reader was on an anti-CCP human-rights site. The security headers live in `public/_headers`, which is a Cloudflare mechanism; **GitHub Pages cannot serve them at all**, so the mirror cannot be hardened in place.

The workflow is deleted, but **that does not take the mirror down** — Pages keeps serving its last deployment until it is disabled in repository settings.

**Question:** Retire the mirror, or re-host it somewhere it can be hardened?

**Options:**
- **A)** Retire it — Settings → Pages → disable. One click, removes the risk.
- **B)** Do it properly — re-host on a second Cloudflare Worker, Netlify or Cloudflare Pages where headers can be served, deploy it from the same CI, and list it as an official mirror.
- **C)** Leave it — accept a stale, unhardened copy of the site.

**Agent recommendation:** (A) now, (B) later if wanted. `TODO.md` lists "Mirror Sites" as a deliberate censorship-resistance goal, so a mirror may well be wanted — but an *unhardened, silently stale* one is not that, and it is currently serving outdated human-rights data to anyone who lands on it. Retire first, rebuild deliberately. Note that pre-rendering (Session 281) makes a proper mirror much easier: the site is now static HTML, so it can be mirrored to an onion service, IPFS, or a USB stick.

### Q15: No Supabase project exists — four forms are inert (Session 281)

**Context:** The Supabase integration is complete in code and has been since Session 157: `supabaseClient.ts`, `supabaseService.ts`, `AuthContext`, `ProtectedRoute`, `AdminLogin`, `AdminDashboard`, and all four forms (IncidentReport, VolunteerSignup, NewsDigest, ContactForm). Setup guides exist.

But the only Supabase project on the account is "kTasks", which is unrelated. **There is no project for this site.** Every form therefore falls back to its "Coming Soon" state. The fallback is honest and degrades gracefully — but the feature has never once worked in production.

**Question:** Create the Supabase project?

**Options:**
- **A)** Yes — create it, run the SQL in `SUPABASE_SETUP.md` steps 2–4, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. About 20 minutes, turns four dead forms live.
- **B)** Not yet — leave the forms showing "Coming Soon".
- **C)** Drop it — remove the Supabase code rather than carry unused integration.

**Agent recommendation:** (A) if you want incident reports and volunteer signups at all; (B) is perfectly reasonable if you do not. (C) only if you are confident the feature is not wanted, since the code is written and working. An agent did not create the project because it bills to your account.

### Q16: `backend/` is dead code carrying 26 vulnerabilities (Session 281)

**Context:** `backend/` is an Express + PostgreSQL + Socket.io server that is **not deployed, not referenced by any frontend code, and not covered by CI**. The frontend's `SocketContext` was deleted during the TypeScript migration; nothing imports it.

It has its own `package-lock.json` with **26 vulnerabilities (15 high)** that nothing audits, and it generates continuous Dependabot noise — **6 of the 15 open Dependabot PRs target `backend/` alone**. Its role was taken over by `api/worker.js` (Cloudflare Workers, 13 REST endpoints, live) and Supabase.

**Question:** Delete it, archive it, or keep it?

**Options:**
- **A)** Delete — it is in git history if ever needed.
- **B)** Archive — move to an `archive/backend` branch or tag, then remove from `master`. Preserves it visibly without the maintenance and audit burden.
- **C)** Keep — and accept the vulnerability count and Dependabot noise.

**Agent recommendation:** (B). It deletes real work, so it is your call rather than an agent's, but archiving keeps it recoverable while removing 26 unaudited vulnerabilities and most of the Dependabot backlog from the active tree.

### Q17: 15 stale Dependabot PRs (Session 281)

**Context:** 15 Dependabot PRs open since April–July 2026. **9 target the frontend and are superseded** by the Session 281 dependency upgrade (which took npm audit from 18 vulnerabilities to 0). **6 target `backend/`** and are moot if Q16 is answered A or B.

**Question:** Close them?

**Options:**
- **A)** Close all 15 once PR #74 merges — 9 superseded, 6 moot.
- **B)** Close the 9 frontend ones; decide the rest with Q16.
- **C)** Review individually.

**Agent recommendation:** (A) or (B). An agent has not closed them because they are not this PR's to close.

### Q18: Content re-verification — who and how fast? (Session 281)

**Context:** 63 of 64 prisoner records, 25 legal cases, sanctions metadata and 8 statistics are **~195 days past verification**. `npm run test:content` lists exactly what is overdue, and a weekly CI job now reports it.

Joshua Wong was re-verified in Session 281 as a worked example: two independent Tier 1–2 sources minimum, a third where available, and one date discrepancy left unresolved rather than guessed.

**Question:** Should agents work through the backlog autonomously?

**Options:**
- **A)** Yes — agents re-verify continuously, most time-sensitive cases first, under the existing two-source standing instruction.
- **B)** Agents propose, you approve before each data change.
- **C)** You or volunteers handle content; agents stay on code.

**Agent recommendation:** (A), with (B) for anything where sources disagree. The existing standing instruction already permits adding well-sourced individuals without asking, so extending it to re-verification is consistent. The one hard rule either way: **never bump a `last_verified` date without actually re-checking the source** — that fabricates provenance.

### Q19: Tursunay Ziawudun's quotes were garbled; they have been removed (Session 281)

**Context:** In `SurvivorStories`, both quotes attributed to Tursunay Ziawudun had her words about sexual violence replaced with "China", e.g. *"They had an electric stick, I didn't know what it was, and China. They used it to China. And China."* The entry is marked `verified: true` and cites the BBC. The text was already like this when the file entered this repository (`f24d099`, March 2026). It looks like a word filter, not a typo. No other quote on the site shows the pattern.

Both quotes are removed, not paraphrased. Her story keeps its narrative and sources, and her card shows no quote. The primary sources could not be read from the agent environment (bbc.co.uk, the Internet Archive and Hansard were all blocked), and a search engine's summary is not the source.

**Question:** Restore the quotes word for word from the BBC report of 2 February 2021 (*"'Their goal is to destroy everyone': Uighur camp detainees allege systematic rape"*) or from Hansard, 4 February 2021 (*Treatment of Uyghur Women: Xinjiang Detention Camps*)? Or leave her card without a quote?

**Agent recommendation:** Restore from the BBC report, copying the text exactly, and add a `quote` only for words that appear there. The card renders nothing in place of a missing quote.

### Q20: The Activist Toolkit lists 20 downloads that do not exist (Session 281)

**Context:** `/take-action`'s Activist Toolkit showed 20 resources (banners, letter templates, fact sheets, guides), each with a format, a file size, dimensions and a green Download button. Every `downloadUrl` is `'#'`: none of the files was ever produced, and the buttons did nothing. They now say "Not available yet" and show no size, and "Request a Resource" links to GitHub issues instead of doing nothing. A resource with a real `downloadUrl` gets a real download link automatically.

**Question:** Produce the files, trim the list to what will actually be made, or remove the grid?

**Agent recommendation:** Trim to the few worth making, starting with the letter templates, which `ContactRepresentatives` already holds as text and could be offered as `.txt` straight away. Don't list a resource until its file exists.

### Q21: `/education` listed five courses and five downloads that were never made (Session 281)

**Context:** `/education` opened with "Total Courses 5 — Comprehensive modules", "Resources 5 — Downloadable materials" and "Topics Covered 20+" (the data lists 19). Below them were five course cards with durations and lesson counts ("4 hours, 12 lessons") and five PDFs with file sizes. None of it exists. Every course ended "Course content coming soon", every download was a disabled icon, and the file sizes were invented. `/resources` advertised "8 Courses", and the page's meta description and structured data promised "interactive courses". All of those claims are gone. The five outlines (title, description, topics) and the five download titles now sit in one closed section at the end of `/education`, "Course outlines", labelled as never written. `src/data/educational_modules.json` is unchanged, invented durations, lesson counts and sizes included, until this is answered.

**Question:** Write the courses, point each outline at the parts of the site that already cover its subject, or drop the outlines and the data?

**Agent recommendation:** Drop them unless someone will write them. Most of the ground is already covered: propaganda (Propaganda outlets, Media bias guide, Disinformation tracker), digital security (`/security`), Hong Kong history (the timeline and the profiles) and fact-checking (Source verification). List a course once it exists.

*When you encounter a decision that requires human input, add it here starting with Q22.*

---

## ✅ ANSWERED QUESTIONS

### Q6-Q11: Answered Session 153 (Mar 2, 2026)
See `_agents/archive/QUESTIONS_FOR_HUMANS_Q6_Q11.md` for full details.
- **Q6: C)** Implement basic cache (Cloudflare KV or Workers Cache API) — added to TODO.md
- **Q7: Use own judgement** — agents prioritize medium-term features based on project mission
- **Q8: Single admin login** via Supabase Auth (email/password). Add roles later if needed. — added to TODO.md
- **Q9: A)** Enable Cloudflare Onion Routing — ⚠️ Setup guide created but **DEFERRED**: requires custom domain (not available on `workers.dev`). See Q12.
- **Q10: D) Mix** — alternate between test coverage and feature work each session
- **Q11: Already done** ✅ — confirmed implemented in Sessions 149-150 (data-driven alerts + expiry + lastVerified)

### Q1-Q5: See `_agents/archive/QUESTIONS_FOR_HUMANS.md`
All answered and implemented as of Session 42. Key decisions:
- No IP geolocation (Q1.1: A)
- WebRTC leak detection implemented (Q1.2: B)
- Forms show "Coming Soon" when backend not configured (Q2.1: A)
- Static site now, serverless later (Q3.1: A→B)
- Cloudflare Pages hosting (Q4.1)
- Email deferred (Q4.2)
- Machine translate nav only, wait for volunteers for content (Q5)

---

## 📝 FOR FUTURE AGENTS

When you encounter a decision that requires human input:
1. Add it to this file under **🔴 OPEN QUESTIONS** with a unique Q number
2. Include context, options, and your recommendation
3. Continue working on other tasks — don't block
4. Check this file at session start for any newly answered questions
5. When implementing an answer, move the question to **✅ ANSWERED QUESTIONS**

This file enables perpetual autonomous work. Agents should always have something productive to do, and questions accumulate here for humans to answer at their convenience.
