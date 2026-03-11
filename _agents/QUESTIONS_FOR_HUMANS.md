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

*When you encounter a decision that requires human input, add it here starting with Q14.*

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
