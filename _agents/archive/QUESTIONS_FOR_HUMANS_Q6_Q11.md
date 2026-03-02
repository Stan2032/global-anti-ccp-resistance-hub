# Questions for Humans — Q6-Q11 Archive

> **Archived:** Session 153 (Mar 2, 2026)
> **Source:** `_agents/QUESTIONS_FOR_HUMANS.md`
> **Status:** All Q6-Q11 answered by human owner

---

## Q6. Backend Cache System Documentation ✅ ANSWERED

**Asked:** Session 127 (Feb 27, 2026)
**Human Answer:** **C) Implement basic cache** — add Cloudflare KV or Workers Cache API
**Agent recommendation was:** Option A — honesty first. Cache can be documented when built.
**Action:** Added to TODO.md as implementation task.

**Context:** `BACKEND_GUIDE.md` references a backend cache system, but no cache backend has been implemented. The documentation may set inaccurate expectations.
**Options presented:**
- A) Remove cache references from backend docs (keep docs honest about current state)
- B) Keep as aspirational — label clearly as "planned feature"
- **C) Implement basic cache — add Cloudflare KV or Workers Cache API** ← Human chose this

---

## Q7. Priority Ranking for Medium-Term Features ✅ ANSWERED

**Asked:** Session 127 (Feb 27, 2026)
**Human Answer:** **Use own judgement** — agents should prioritize medium-term features based on project mission
**Action:** Agents prioritize based on impact for at-risk users. Current recommended order:
1. Offline Mode (highest impact for censored regions)
2. API Development (enables ecosystem growth)
3. Analytics Dashboard (helps measure impact)

**Context:** The TODO.md lists many medium-term features without prioritization. Key candidates:
1. Offline Mode — cache critical content for censored regions (high impact for target audience)
2. API Development — public API for researchers (enables ecosystem growth)
3. Video Testimonials — embedded survivor interviews (powerful but needs content sourcing)
4. Discussion Forums — moderated activist community space (complex, moderation risk)
5. Analytics Dashboard — privacy-respecting usage tracking (helps measure impact)

---

## Q8. Supabase Auth for Admin Dashboard ✅ ANSWERED

**Asked:** Session 127 (Feb 27, 2026)
**Human Answer:** **Agent recommendation accepted** — Start with single admin login via Supabase Auth (email/password). Add roles later if needed.
**Action:** Added to TODO.md as implementation task.

**Context:** Supabase client + service layer is integrated, all 4 forms are wired. The next logical step is adding Supabase Auth so an admin can view submitted reports.
**Questions asked:**
- Who should have admin access? → Just the owner for now
- Should there be role-based access? → Not yet, add later if needed
- Is a simple admin-only login sufficient? → Yes

---

## Q9. Tor Hidden Service (.onion) ✅ ANSWERED

**Asked:** Session 127 (Feb 27, 2026)
**Human Answer:** **A) Enable Cloudflare Onion Routing**
**Action:** Setup steps documented for human owner to enable in Cloudflare dashboard.

**Options presented:**
- **A) Enable Cloudflare Onion Routing** — add `Onion-Location` header ← Human chose this
- B) Defer — not a priority right now
- C) Set up dedicated .onion — requires running a Tor hidden service (more complex)

**Setup Steps (for human owner):**
1. Log into Cloudflare Dashboard → your site → **Network** → scroll to **Onion Routing** → toggle ON
2. Cloudflare automatically generates a `.onion` address and serves the `Onion-Location` header
3. No code changes needed — Cloudflare handles the header injection when Onion Routing is enabled
4. Test by visiting site in Tor Browser — it should auto-redirect to the `.onion` address
5. The `.onion` address will appear in Cloudflare dashboard after enabling

---

## Q10. Test Coverage Strategy — Breadth vs. Depth ✅ ANSWERED

**Asked:** Session 128 (Mar 1, 2026)
**Human Answer:** **D) Mix** — alternate between test coverage and feature work each session
**Action:** This is now a standing instruction for all agents.

**Options presented:**
- A) Continue adding component tests — aim for 100% component coverage
- B) Shift to integration/E2E tests — test user flows across multiple components
- C) Focus on non-test work — sanctions data updates, new features, content improvements
- **D) Mix — alternate between test coverage and feature work each session** ← Human chose this

---

## Q11. EmergencyAlerts — Content Freshness ✅ ALREADY IMPLEMENTED

**Asked:** Session 128 (Mar 1, 2026)
**Human Answer:** Confirmed this seems already done (correct — implemented Sessions 149-150)
**Status:** ✅ Fully implemented

**Implementation (Sessions 149-150):**
- Options A + B + D all implemented
- Alerts in `src/data/emergency_alerts.json` (21st JSON data file)
- `expires` field: alerts auto-hide after date passes (no code changes needed)
- `lastVerified` field: shown on each alert as verification date
- Jimmy Lai alert: no expiry (ongoing campaign), lastVerified 2026-03-02
- Taiwan military alert: expires 2025-06-18 (already expired, auto-hidden)
- 13 data integrity tests (incl expiry validation)
