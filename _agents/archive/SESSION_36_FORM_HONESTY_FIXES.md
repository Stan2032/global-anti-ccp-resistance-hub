# Session 36 — Opus 4.6 Continuation: Form Honesty Fixes

**Agent:** Opus 4.6 (Claude)  
**Date:** 2026-02-20  
**Session Type:** Continuation from Sessions 1-35  
**Branch:** copilot/read-agents-md-files  
**Focus:** Fix misleading form submission messages — critical honesty/trust issue

---

## 1. What I Did and Why

### The Problem: Forms That Lie

Four components had forms that pretended to submit data but actually did nothing:

1. **IncidentReportForm.jsx** — The worst offender. After "submission" it told users:
   - "Report Submitted Securely" (false — nothing was submitted)
   - "Your report is encrypted and stored securely" (false — no encryption, no storage)
   - "Data is shared with verified human rights organizations" (false — no data goes anywhere)
   - Footer claimed: "End-to-end encrypted", "Tor-compatible", "No logs retained"
   
   **Why this is dangerous:** Someone facing real CCP harassment could fill out this form believing their report was documented and shared with organizations that could help. In reality, their report vanishes the moment they close the tab. This is not just misleading — for activists in danger, it could create a false sense of having sought help.

2. **VolunteerSignup.jsx** — Told users "Your information has been recorded. We'll be in touch soon" with a step-by-step "What Happens Next" checklist. None of this was true.

3. **ReportSighting.jsx** — Told users "Report Submitted" with a green checkmark. Then said "Submit Another Report" — implying the first one went somewhere.

4. **NewsDigest.jsx** — Told users "You're Subscribed!" with specific delivery promises ("daily digest tomorrow morning", "weekly roundup this Sunday"). No email service exists.

### What I Changed

For each form, I made two changes:

**A) Added a visible "Coming Soon" amber banner before the form** explaining:
- The form is not yet connected to a backend
- Data will not be stored or transmitted
- Links to real organizations users can contact directly

**B) Fixed the post-submission success message** to:
- Clearly state data was NOT submitted
- Provide direct links to real organizations (Safeguard Defenders, FBI Tips, HRW, etc.)
- Remove false claims about encryption, storage, or data sharing

### Design Decisions

**Why amber/yellow, not red?** Red implies danger or error. The form isn't broken — it's just not connected yet. Amber communicates "caution/notice" which is the right tone. It also matches the GlobalDisclaimer component's warning style used elsewhere in the site.

**Why keep the forms at all?** The owner decided (Q2.1: "Consider later") to keep them as previews. They demonstrate the intended functionality and may encourage backend development. The key change is adding transparency, not removing features.

**Why link to real organizations in the success message?** If someone fills out a report form, they clearly have something to report. The most helpful response is to direct them to organizations that CAN help, not just say "sorry, not working."

---

## 2. Source Credibility of Linked Organizations

All organizations I linked in the "report directly to" sections are verified Tier 1 or Tier 2 sources per our SOURCE_BIAS_AUDIT.md:

- **Safeguard Defenders** — Tier 1, specializes in CCP transnational repression documentation
- **FBI Tips** — US law enforcement, relevant for US-based incidents
- **Human Rights Watch** — Tier 1, international human rights documentation
- **MI5** — UK security service, relevant for UK-based CCP operations
- **ASIO** — Australian security service, relevant for Australia-based CCP operations
- **UHRP** — Tier 2, Uyghur human rights documentation
- **Hong Kong Watch** — Tier 2, Hong Kong-specific human rights
- **Tibet Action Institute** — Tier 2, Tibet-specific activism
- **Amnesty International** — Tier 1, international human rights
- **Radio Free Asia** — Tier 2, independent Asia journalism
- **Hong Kong Free Press** — Tier 1, independent HK journalism
- **China Digital Times** — Tier 2, China censorship documentation
- **CECC** — Tier 1, US Congressional commission

None of these are CCP-controlled or CCP-influenced. All have documented track records of independent reporting on CCP human rights abuses.

---

## 3. Agent Assignment Notes

| Task | Best Agent | Reasoning |
|------|-----------|-----------|
| Form honesty notices (this session) | Opus 4.6 | Required judgment on what constitutes a misleading claim vs. acceptable placeholder, plus source verification for linked organizations |
| Future backend connection for forms | Opus 4.6 | Security-critical — incident reports need proper encryption, Cloudflare Pages Functions integration |
| Form UI polish after backend exists | Sonnet 4.5 | Standard JSX/CSS work once the backend API is defined |

---

## 4. Remaining Work

The same items from Session 35 remain, plus:
- The form changes from this session are committed and ready for review
- When a backend is eventually added, the `FORM_ACTIVE` flag in IncidentReportForm.jsx can be set to `true` and the Coming Soon notices can be removed

---

## 5. Side Thought: The Broader Honesty Problem

This session revealed a pattern worth documenting: the original site had multiple "fake it till you make it" elements — fake statistics (Active Members: 8,734, Requests Fulfilled: 2,156), fake form submissions, and fake security claims. Previous sessions removed fake VPN/Tor detection (Session 6-8), fake live data (Session 1-5), and fake security levels (Session 13).

This session addresses the last major category: fake form submissions. The remaining fake elements are the community statistics on the CommunitySupport page header (Active Members: 8,734 etc.) — these are hardcoded placeholder numbers, not real data. They should probably be addressed in a future session, but they're less dangerous than false security claims because users are less likely to take action based on inflated member counts.

**Recommendation for future agents:** Look for any remaining element that implies a real backend action when none exists. The principle should be: never tell users something happened when it didn't, especially on a human rights platform where trust is paramount.

---

This file serves as a persistent record of analytical reasoning for future agents to build on.
