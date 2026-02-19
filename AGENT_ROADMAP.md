# Agent Roadmap - Consolidated Task Prioritization
**Purpose:** Agent-facing roadmap for autonomous progression and task execution  
**Last Updated:** 2026-02-18  
**Status:** Active Development

---

## Overview

This document consolidates tasks from multiple TODO files (TODO.md, SITE_WIDE_TODO.md, SITE_CLEANUP_TODO.md, SIMULATED_DATA_CLEANUP_TODO.md, IMPLEMENTATION_ROADMAP.md) and prioritizes them for autonomous agent execution.

**Total Consolidated Tasks:** 500+  
**Prioritization Strategy:** Security → Data Quality → UX → Features  
**Execution Mode:** Autonomous where possible, flag for human review when needed

---

## 🔴 CRITICAL: Security & Data Integrity (Execute First)

### C1: Remove All Simulated Data (CRITICAL - Data Integrity)
**Status:** ✅ COMPLETE (2026-02-18)  
**Priority:** CRITICAL - Platform credibility depends on this  
**Agent Action:** Executed autonomously

#### Completed ✅
- [x] Removed ALL simulated data from `liveDataSources.js` (Dec 30, 2025)
- [x] Created `SourceAttribution.jsx` component
- [x] Created `EmptyState.jsx` component
- [x] Fixed RSS feed aggregation (no fake fallbacks)
- [x] Created comprehensive DATA_SOURCES.md
- [x] **C1.1** ✅ Refactored PoliticalPrisoners.jsx (60 prisoners, 100% sources, 1 security fix)
- [x] **C1.2** ✅ Refactored DetentionFacilities.jsx (20 regions, 17 sources, 8 security fixes)
- [x] **C1.3** ✅ Refactored CCPOfficials.jsx (29 officials, gov sanction URLs, code quality++)
- [x] **C1.4** ✅ Refactored CompanyTracker.jsx (33 companies, ASPI evidence, 3 security fixes)

#### Summary of C1 Achievement
- **Components Refactored:** 4 major components (2,668 total lines)
- **Data Entries:** 142 entries now have source URLs (60 prisoners + 20 regions + 29 officials + 33 companies)
- **Security Fixes:** 12 vulnerabilities resolved (1 + 8 + 0 + 3)
- **Source Attribution:** 100% coverage across all data
- **Approach:** Hybrid JSON + existing data proven effective
- **Result:** Dramatically improved platform credibility and transparency

---

### C2: Fix VPN/Tor Detection Security Issue (CRITICAL - Security)
**Status:** Not Started  
**Priority:** CRITICAL SECURITY RISK  
**From:** IMPLEMENTATION_ROADMAP.md Phase 1.1  
**Agent Decision:** NEEDS HUMAN REVIEW - Security architecture decisions required

**Current Problem:** Uses `Math.random()` to fake VPN/Tor detection

**Tasks Needing Human Input:**
- [ ] **C2.1** Choose IP geolocation API provider (MaxMind vs alternatives)
  - **Decision Required:** Free vs paid tier
  - **Impact:** Privacy implications, cost
  - **Agent Action:** DEFER - Await owner decision

- [ ] **C2.2** Determine security detection strategy
  - **Decision Required:** Client-side vs server-side detection
  - **Impact:** User privacy, accuracy
  - **Agent Action:** DEFER - Security policy needed

**Autonomous Tasks (After Human Decisions):**
- [ ] **C2.3** Implement WebRTC leak detection (client-side)
  - Can execute once detection strategy approved
  
- [x] **C2.4** Add honest security warnings ✅ (2026-02-19)
  - Rewrote SecurityWarning component to remove false VPN/Tor detection claims
  - Added explicit disclaimer: "This platform cannot detect whether you are using a VPN or Tor"
  - Added EFF Surveillance Self-Defense link as security resource
  - Updated Tails URL to current domain (tails.net)
  - **Agent:** Opus 4.6 (security-critical, required understanding of threat model)
  - **Note:** Header component (`src/components/layout/Header.jsx`) also has dead `securityLevel` indicator but is unused (orphan component). Left as-is since it's not rendered.

---

## 🟠 HIGH PRIORITY: Data Quality & Transparency

### H1: Source Attribution Throughout Site
**Status:** ✅ COMPLETE (2026-02-19)  
**Priority:** HIGH - Critical for credibility  
**Agent Action:** Executed autonomously  
**Best Agent:** Opus 4.6 (multi-file refactoring, source verification)  
**Backup Agent:** Sonnet 4.5 (can handle if pattern is clear)

- [x] **H1.1** Add SourceAttribution to Timeline component ✅ (2026-02-19)
  - **Time:** 30 min (faster than estimated - pattern already existed)
  - **Approach:** Added 13 missing sources to SOURCE_REGISTRY in sourceLinks.js
  - **Result:** All 27 timeline source names now resolve to clickable links
  - **Agent:** Opus 4.6 (chosen: required verifying source URLs across multiple organizations)
  - **Subtasks completed:**
    - [x] Identified all unresolved source names in InteractiveTimeline
    - [x] Added European Parliament, Chinese Human Rights Defenders, ASPI, Xinjiang Police Files, Dr. Adrian Zenz, Hong Kong Watch, CNN, UK Foreign Office, Safeguard Defenders, FBI, Uyghur Tribunal, Nobel Committee
    - [x] Added test case verifying all timeline sources resolve
    - [x] Build passes, 123/123 tests pass

- [x] **H1.2** Add SourceAttribution to SanctionsTracker ✅ (2026-02-19)
  - **Time:** 20 min (faster than estimated)
  - **Approach:** Imported SourceAttribution, replaced hardcoded links with component
  - **Result:** 4 government sources now use consistent SourceAttribution rendering
  - **Agent:** Opus 4.6 (chosen: component integration + source registry additions)
  - **Subtasks completed:**
    - [x] Added imports (SourceAttribution, resolveSource) to SanctionsTracker
    - [x] Added US Treasury OFAC, UK Sanctions List, EU Sanctions Map, Canada Sanctions to registry
    - [x] Replaced plain <a> links with SourceAttribution compact components
    - [x] Added test case verifying sanctions sources resolve

- [x] **H1.3** Add SourceAttribution to VictimMemorialWall ✅ (2026-02-19)
  - **Time:** 20 min (faster than estimated - component already used SourceAttribution)
  - **Approach:** VictimMemorialWall already imported SourceAttribution and resolveSource. Only needed to add 6 missing registry entries.
  - **Result:** All 16 victim sources now resolve to clickable links (1 generic "Historical records" intentionally unresolved)
  - **Agent:** Opus 4.6 (chosen: source verification across human rights organizations)
  - **Subtasks completed:**
    - [x] Identified 7 unresolved source names (6 real organizations + 1 generic)
    - [x] Added Tiananmen Mothers, Human Rights in China, Wall Street Journal, Free Tibet, Stand News, Nobel Prize Committee to registry
    - [x] "Historical records" correctly stays unresolved (generic reference, no single URL)
    - [x] Added test case verifying all 16 VictimMemorialWall sources resolve
    - [x] Build passes, 124/124 tests pass

- [x] **H1.4** Integrate DATA_SOURCES.md into navigation ✅ (Already complete)
  - **Finding:** Route `/data-sources` already existed with full navigation integration
  - **Verification:** Confirmed route (App.jsx:366), header nav links (App.jsx:94, 203), footer link (App.jsx:379), RouteAnnouncer mapping
  - **Agent:** N/A (already done by prior work)

---

### H2: Remove Redundant Content
**Status:** Mostly Complete (2026-02-19) — 2 of 3 inline disclaimers addressed  
**Priority:** MEDIUM (downgraded - less severe than initially estimated)  
**From:** SITE_CLEANUP_TODO.md Priority 3  
**Agent Action:** Can execute autonomously  
**Note:** Initial estimate of "12+ repeated disclaimers" was overstated. Audit (2026-02-19) found only 3 inline disclaimers remain, 1 replaced, 2 are domain-specific (should stay as-is).

- [x] **H2.1** Create GlobalDisclaimer component ✅ (Already existed)
  - GlobalDisclaimer already exists at src/components/ui/GlobalDisclaimer.jsx
  - Supports 4 types: verify, sensitive, changing, security
  - Already adopted by 10 components
  - **Agent:** N/A (already done by prior work)

- [x] **H2.2** Remove remaining inline disclaimers ✅ (2026-02-19, partially)
  - **Result:** 1 of 3 replaced; 2 intentionally kept as domain-specific
  - **Agent:** Opus 4.6
  - **Subtasks completed:**
    - [x] AIDisinfoDetector.jsx: Replaced inline disclaimer with `<GlobalDisclaimer type="verify" />`
    - [x] ForcedLabourList.jsx: **KEPT** — domain-specific disclaimer about supply chain complexity with bullet points; cannot be genericized without losing critical information
    - [x] LegalResourcesHub.jsx: **KEPT** — legal disclaimer may need specialized text for legal compliance; flagged for human review
  - **Decision Rationale:** Domain-specific disclaimers serve different purposes than generic "verify" disclaimers. Replacing them would lose important context about supply chain avoidance and legal limitations.

- [ ] **H2.3** Create single source-of-truth for repeated statistics
  - **Status:** DEPRIORITIZED (2026-02-19)
  - **Analysis:** Audit found "1 million" appears in 7 different natural-language contexts (Hong Kong marchers, Uyghur detainees, Apple Daily copies, bounties, Tibetan children). These aren't duplicates — they're prose references in different contexts. Creating a constant would over-engineer and reduce readability.
  - **Recommendation:** Leave as-is. Each instance is in a unique prose context.
  - **Best Agent:** N/A (not recommended to execute)

---

## 🟡 MEDIUM PRIORITY: UX & Readability

### M1: Typography & Readability Improvements
**Status:** ✅ COMPLETE via Global CSS (verified 2026-02-19)  
**Priority:** MEDIUM - Significant UX impact  
**From:** SITE_CLEANUP_TODO.md Priority 1  
**Agent Action:** Verified complete — changes in `index.css` already cover all subtasks  
**Best Agent:** Already done (global CSS approach more efficient than component-level)

- [x] **M1.1** Increase base font sizes globally ✅ (Already in index.css)
  - `text-xs` → 13px (was 12px), `text-sm` → 15px (was 14px) via `!important` overrides
  - Base body font: 16px, line-height: 1.7
  - **Location:** `src/index.css` lines 88-97
  - **Verification:** 2026-02-19 — confirmed these rules are active and applied globally

- [x] **M1.2** Improve text contrast ✅ (2026-02-19)
  - Upgraded `text-slate-400` and `text-slate-500` from #94a3b8 → #a8b5c7 for WCAG AA compliance
  - Upgraded `text-gray-400` and `text-gray-500` from #9ca3af → #a3aebb
  - Contrast ratio on slate-900 (#0f172a): ~5.5:1 (passes WCAG AA for all text sizes)
  - **Agent:** Opus 4.6 (needed to calculate and verify contrast ratios)

- [x] **M1.3** Add better line-height ✅ (Already in index.css)
  - Body: `line-height: 1.7`, paragraphs: `1.75`, lists: `1.8`
  - `text-xs`: `line-height: 1.5`, `text-sm`: `line-height: 1.6`
  - **Location:** `src/index.css` lines 27, 37, 92, 96, 117
  - **Verification:** 2026-02-19 — confirmed these rules are active

---

### M2: Emoji Reduction
**Status:** In Progress (2026-02-19) — Dashboard, TakeAction, ResistanceResources complete  
**Priority:** MEDIUM - Professional appearance  
**From:** SITE_CLEANUP_TODO.md Priority 2  
**Agent Action:** Executing incrementally  
**Best Agent:** Opus 4.6 (requires judgment on which to keep vs remove + Lucide icon replacement)  
**Note:** Original estimate was 170 emojis. Actual count is 934 across 90 files. ~46 emojis replaced so far across 3 pages.

- [x] **M2.1** Replace Dashboard emojis with Lucide icons ✅ (2026-02-19)
  - 17 emoji strings replaced with Lucide React icon components
  - Stat cards: 👥→Users, 🏢→Building2, 🎯→Target, ⛓️→AlertTriangle
  - Quick actions: ✊→Megaphone, 🎯→Target, 🔐→Lock, 📚→BookOpen
  - Section headers: 🚨→AlertTriangle, 📡→Radio, ⚡→Zap, 🔗→Link2
  - Resources: 🧅→Shield, 💬→MessageSquare, 📧→Mail, 💻→Monitor
  - **Agent:** Opus 4.6 (required understanding of icon semantics and Lucide API)

- [x] **M2.2a** Replace TakeAction emojis with Lucide icons ✅ (2026-02-19)
  - 12 emojis replaced: 💰→Heart, 🏛️→Landmark, ✍️→PenLine, 🚫→Ban, 🚨→AlertTriangle, 📢→Megaphone, 🤝→Handshake, 🔐→Shield, ⚠️→AlertTriangle, 📊→BarChart3, 📣→Megaphone
  - ✓ checkmark kept (functional status indicator)
  - **Agent:** Opus 4.6

- [x] **M2.2b** Replace ResistanceResources emojis with Lucide icons ✅ (2026-02-19)
  - 17 emojis replaced: 🔐→Shield, ✊→Megaphone, 🏛️→Landmark, 📚→BookOpen, 📡→Radio, 🤝→Handshake, 📸→Camera, ✓→CheckCircle, 🕸️→Globe, 📄→FileText, 🔍→Search, 🛡️→ShieldCheck, 🛠️→Wrench, 🚨→AlertTriangle, ⚠️→AlertTriangle, 📞→Phone, ✉️→Mail
  - **Agent:** Opus 4.6

- [ ] **M2.2c** Continue emoji reduction in remaining pages
  - Keep: 🟢🟡🔴 ⚠️ ✅ ✓ ✗ ❌ (status), 🇺🇸🇬🇧🇨🇦 (flags — convey info)
  - Remove: Decorative emojis (~300 remaining across ~87 files)
  - **Time:** Multiple sessions — too many files for one pass
  - **Best Agent:** Sonnet 4.5 for mechanical removal in individual components
  - **Strategy:** Prioritize high-traffic pages (EducationalResources, CommunitySupport next)

---

### M3: Page Consolidation
**Status:** DEPRIORITIZED (2026-02-19)  
**Priority:** LOW (downgraded from MEDIUM)  
**From:** SITE_WIDE_TODO.md Priority 3  
**Agent Action:** Deferred — analysis shows merging would create oversized components  
**Note:** TakeAction is already 539 lines with 16 imported components. Merging CampaignHubs (413 lines) would create a 950+ line component, violating the <500 line goal. Better to keep as separate deep-link pages.

- [x] Removed 4 pages from navigation (Campaigns, Communications, CCP Tactics, Regional Threats) ✅

- [ ] **M3.1** Merge Take Action + Campaigns — DEPRIORITIZED
  - **Analysis:** TakeAction already imports CampaignProgress component. Full merger would exceed 500-line limit.
  - **Recommendation:** Keep CampaignHubs as deep-linked page. The `/campaigns` route is linked from Dashboard and TakeAction.
  - **Best Agent:** N/A (not recommended to execute)

- [ ] **M3.2** Merge Community + Communications — DEPRIORITIZED
  - **Analysis:** CommunitySupport (619 lines) + SecureComms (480 lines) = 1,099 lines. Far exceeds limits.
  - **Recommendation:** Keep as separate pages. SecureComms is already linked from Community.
  - **Best Agent:** N/A (not recommended to execute)

---

## 🟢 LOWER PRIORITY: Features & Enhancements

### L1: Accessibility Improvements
**Status:** In Progress (2026-02-19)  
**Priority:** LOW - Important but not blocking  
**From:** TODO.md, SITE_CLEANUP_TODO.md  
**Agent Action:** Executing incrementally

- [x] **L1.1a** Add ARIA labels to TakeAction interactive elements ✅ (2026-02-19)
  - Added aria-expanded/aria-controls to expandable action cards
  - Added role="region"/aria-label to expanded panels
  - Added aria-hidden to decorative SVGs
  - Added aria-label to newsletter form and email input
  - **Agent:** Opus 4.6

- [ ] **L1.1b** Add ARIA labels to remaining pages
  - **Time:** 3 hours
  - **Blocker:** None
  - **Best Agent:** Sonnet 4.5 (mechanical, follows pattern from L1.1a)

- [ ] **L1.2** Improve keyboard navigation
  - **Time:** 3 hours
  - **Blocker:** None
  - **Best Agent:** Sonnet 4.5

---

### L3: Dead Code Audit
**Status:** ✅ AUDIT COMPLETE (2026-02-19) — 12 unused components identified  
**Priority:** LOW - Code quality  
**Agent Action:** Documented — removal deferred to avoid breaking future features  
**Best Agent:** Opus 4.6 (audit), Sonnet 4.5 (removal if approved)

**Truly unused components (never imported anywhere):**
| Component | Lines | Notes |
|-----------|-------|-------|
| `src/components/BoycottList.jsx` | - | Only self-reference |
| `src/components/DiasporaDirectory.jsx` | - | Only self-reference |
| `src/components/LazyImage.jsx` | - | Only self-reference |
| `src/components/VideoTestimonials.jsx` | - | Only self-reference |
| `src/components/features/FeedSourceSelector.jsx` | - | Only self-reference |
| `src/components/features/FeedStats.jsx` | - | Only self-reference |
| `src/components/intelligence/LiveIntelligenceFeed.jsx` | - | Only self-reference |
| `src/components/layout/Header.jsx` | - | App.jsx uses inline header |
| `src/components/layout/Sidebar.jsx` | - | App.jsx uses inline sidebar |
| `src/components/ui/SecurityWarning.jsx` | - | Rewritten in Session 8, still orphaned |
| `src/data/realSources.js` | - | 0 references anywhere |
| `src/utils/performance.js` | - | Only in LazyImage comment |

**Note:** These files are NOT imported by any other file. However, some may have been planned for future use. Removal should be coordinated with project owner.
**Recommendation:** Flag for human review before deletion.

---

### L2: Multilingual Support
**Status:** Foundation Started  
**Priority:** LOW - Future enhancement  
**From:** TODO.md Short-Term High Priority  
**Agent Decision:** DEFER - Requires translation resources

- [ ] **L2.1** Complete i18n infrastructure
  - **Blocker:** Needs translations (human input)
  - **Agent Action:** DEFER

- [ ] **L2.2** Add language files
  - **Blocker:** Needs native speakers
  - **Agent Action:** DEFER

---

## ⏸️ NEEDS HUMAN REVIEW: Blocked or Ambiguous Tasks

### HR1: Backend Implementation Tasks
**Status:** Not Started  
**From:** IMPLEMENTATION_ROADMAP.md Phases 2-4  
**Blocker:** No backend exists yet  
**Agent Decision:** DEFER - Requires architecture decisions

**Tasks Requiring Owner Input:**
- [ ] **HR1.1** Choose backend framework and database
  - Node.js + Express + PostgreSQL?
  - Alternatives?
  - **Decision Required:** Technology stack
  
- [ ] **HR1.2** Choose authentication strategy
  - JWT? OAuth? Both?
  - **Decision Required:** Security requirements

- [ ] **HR1.3** Choose hosting strategy
  - AWS? DigitalOcean? Vercel?
  - **Decision Required:** Budget and scalability needs

**Agent Recommendation:** Frontend improvements should be prioritized while backend architecture is decided. Backend implementation estimated at 380 hours (12 weeks).

---

### HR2: Content Policy Decisions
**Status:** Needs Clarification  
**Blocker:** Moderation and governance policy unclear  
**Agent Decision:** DEFER - Await policy guidance

**Questions for Owner:**
- [ ] **HR2.1** Moderation policy for user-generated content
  - How should community contributions be moderated?
  - Who has moderation authority?
  
- [ ] **HR2.2** Data governance for new submissions
  - What verification process for new prisoners/facilities?
  - Who approves new data?

**Agent Recommendation:** Create MODERATION_POLICY.md and DATA_GOVERNANCE.md documents to clarify these decisions.

---

### HR3: API Key and Service Decisions
**Status:** Needs Selection  
**Blocker:** Requires paid service decisions  
**Agent Decision:** DEFER - Budget implications

**Services Needing Selection:**
- [ ] **HR3.1** IP Geolocation API
  - Options: MaxMind (free/paid), IP2Location, ipapi
  - **Decision Required:** Free tier sufficient? Budget for paid?
  
- [ ] **HR3.2** Email Service
  - Options: SendGrid, Mailgun, AWS SES
  - **Decision Required:** Expected volume? Budget?

**Agent Recommendation:** Start with free tiers where available, document upgrade triggers.

---

## 📊 Execution Strategy

### Autonomous Execution Path (Current Session)
Focus on high-value, low-risk improvements that don't require human decisions:

**Immediate Actions (This Session):**
1. ✅ Create this AGENT_ROADMAP.md
2. ✅ Create LLM_JUDGEMENT_LOG.md
3. 🔄 Execute C1.1: Refactor PoliticalPrisoners.jsx
4. 🔄 Execute C1.2: Refactor DetentionFacilities.jsx
5. 🔄 Execute H1.1-H1.4: Add SourceAttribution throughout
6. 🔄 Execute H2.1-H2.3: Remove redundant content
7. 🔄 Execute M1.1-M1.3: Typography improvements

**Expected Output:** 
- Significantly improved data transparency
- Cleaner, more readable UI
- Reduced code duplication
- Updated documentation

**Time Estimate:** 20-30 hours of autonomous work available

---

### Vertical Feature Slicing Strategy

When encountering blocked tasks, move to different vertical slices:

**Slice 1: Data Quality** (Can progress independently)
- Refactor components to use JSON data
- Add source attribution
- Remove simulated data

**Slice 2: UX Improvements** (Can progress independently)
- Typography and readability
- Emoji reduction
- Color standardization
- Page consolidation

**Slice 3: Code Quality** (Can progress independently)
- Remove redundant code
- Create reusable components
- Improve component organization

**Slice 4: Documentation** (Can progress independently)
- Update README
- Create style guides
- Document data sources

---

## 🔄 Update Frequency

This roadmap will be updated:
- ✅ After each completed task
- ✅ When new tasks are discovered
- ✅ When priorities shift
- ✅ When blockers are resolved
- ✅ At the end of each work session

---

## 📝 Task Lifecycle

**States:**
- 🔴 **CRITICAL** - Security or data integrity issue
- 🟠 **HIGH** - Significant impact, no blockers
- 🟡 **MEDIUM** - Worthwhile improvement
- 🟢 **LOW** - Nice to have
- ⏸️ **BLOCKED** - Awaiting human input
- ✅ **COMPLETE** - Done and verified

**Transitions:**
- Tasks move from BLOCKED → actionable when human input received
- Tasks move UP in priority when dependencies complete
- Tasks move DOWN in priority if blockers discovered

---

## 🎯 Success Metrics

**Data Quality:**
- [ ] 100% of displayed data has source attribution
- [ ] 0% simulated/fake data in codebase
- [ ] All JSON data files integrated into UI

**Code Quality:**
- [ ] 50% reduction in code duplication
- [ ] All components under 500 lines
- [ ] Consistent component patterns

**UX Quality:**
- [ ] Improved text readability (WCAG AA compliant)
- [ ] Reduced visual clutter (emojis: 170 → 30)
- [ ] Simplified navigation (pages: 14 → 8)

**Documentation:**
- [ ] All agent decisions logged
- [ ] Clear handoff notes for human review
- [ ] Up-to-date task status

---

**Agent:** Claude Sonnet 3.5 (2024-10-22)  
**Mode:** Autonomous with human escalation  
**Next Review:** After completing C1.1-C1.4 (data refactoring tasks)
