# Questions for Humans — Active Decision Queue

> **Location:** `_agents/QUESTIONS_FOR_HUMANS.md`
> **Purpose:** Ongoing list of questions that require human input. Agents add questions here rather than blocking on decisions.
> **Protocol:** Agents should check this file at session start. When a human answers, agents mark the question ✅ and implement.
> **Previous decisions:** See `_agents/archive/QUESTIONS_FOR_HUMANS.md` for D1-D5 (all answered and implemented).

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

### Q6. Backend Cache System Documentation
**Asked:** Session 127 (Feb 27, 2026)
**Context:** `BACKEND_GUIDE.md` references a backend cache system, but no cache backend has been implemented. The documentation may set inaccurate expectations.
**Options:**
- **A) Remove cache references** from backend docs (keep docs honest about current state)
- **B) Keep as aspirational** — label clearly as "planned feature"
- **C) Implement basic cache** — add Cloudflare KV or Workers Cache API

**Agent recommendation:** Option A — honesty first. Cache can be documented when built.

---

### Q7. Priority Ranking for Medium-Term Features
**Asked:** Session 127 (Feb 27, 2026)
**Context:** The TODO.md lists many medium-term features without prioritization. Agents need guidance on what to build next. Key candidates:
1. **Offline Mode** — cache critical content for censored regions (high impact for target audience)
2. **API Development** — public API for researchers (enables ecosystem growth)
3. **Video Testimonials** — embedded survivor interviews (powerful but needs content sourcing)
4. **Discussion Forums** — moderated activist community space (complex, moderation risk)
5. **Analytics Dashboard** — privacy-respecting usage tracking (helps measure impact)

**Owner input needed:** Pick your top 2-3 priorities, or confirm agents should use their judgment.

---

### Q8. Supabase Auth for Admin Dashboard
**Asked:** Session 127 (Feb 27, 2026)
**Context:** Supabase client + service layer is integrated, all 4 forms are wired. The next logical step is adding Supabase Auth so an admin can view submitted reports. But this raises questions:
- Who should have admin access? Just the owner? Multiple trusted people?
- Should there be role-based access (admin vs. moderator)?
- Is a simple admin-only login sufficient for now?

**Agent recommendation:** Start with single admin login via Supabase Auth (email/password). Add roles later if needed.

---

### Q9. Tor Hidden Service (.onion)
**Asked:** Session 127 (Feb 27, 2026)
**Context:** The site serves activists in censored regions. A .onion address would allow access via Tor without exit node exposure. Cloudflare supports Onion Routing via the `Onion-Location` header.
**Options:**
- **A) Enable Cloudflare Onion Routing** — add `Onion-Location` header (minimal effort, Cloudflare handles it)
- **B) Defer** — not a priority right now
- **C) Set up dedicated .onion** — requires running a Tor hidden service (more complex)

**Agent recommendation:** Option A — it's a single header addition via `public/_headers` and significantly improves accessibility for at-risk users.

---

### Q10. Test Coverage Strategy — Breadth vs. Depth
**Asked:** Session 128 (Mar 1, 2026)
**Context:** We've grown from 654 tests (Session 120) to 947 tests (Session 128). Test coverage is now extensive but ~66 components still lack dedicated test files. Should agents:
- **A) Continue adding component tests** — aim for 100% component coverage (systematic, catches regressions)
- **B) Shift to integration/E2E tests** — test user flows across multiple components (higher value per test)
- **C) Focus on non-test work** — sanctions data updates, new features, content improvements
- **D) Mix** — alternate between test coverage and feature work each session

**Agent recommendation:** Option D — alternating keeps the project balanced. Tests prevent regressions while features deliver user value.

---

### Q11. EmergencyAlerts — Content Freshness
**Asked:** Session 128 (Mar 1, 2026)
**Context:** The EmergencyAlerts component has 4 hardcoded alerts, the oldest from November 2024. For a "live" alerts feature, stale content may reduce credibility. Options:
- **A) Make alerts data-driven** — move to a JSON file that can be updated without code changes
- **B) Add expiry dates** — automatically hide alerts older than N months
- **C) Keep as-is** — static alerts are fine for an archival reference
- **D) Add a "last reviewed" date** — show when alerts were last verified as current

**Agent recommendation:** Option A + B — move to JSON data file with an `expires` field, consistent with the existing data-driven pattern.

---

## ✅ ANSWERED QUESTIONS

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
