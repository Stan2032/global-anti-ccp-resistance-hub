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
  
- [ ] **C2.4** Add honest security warnings
  - Can execute - improving existing functionality

---

## 🟠 HIGH PRIORITY: Data Quality & Transparency

### H1: Source Attribution Throughout Site
**Status:** H1.1 & H1.2 Complete (2026-02-19), H1.3-H1.4 In Progress  
**Priority:** HIGH - Critical for credibility  
**Agent Action:** Can execute autonomously  
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

- [ ] **H1.3** Add SourceAttribution to VictimMemorialWall
  - **Time:** 2 hours
  - **Blocker:** None
  - **Agent Decision:** EXECUTE
  - **Best Agent:** Opus 4.6 (sensitive data handling, source verification)
  - **Subtasks:**
    - [ ] Explore VictimMemorialWall component structure
    - [ ] Identify data sources for victims
    - [ ] Add source fields to victim data
    - [ ] Integrate SourceAttribution component
    - [ ] Test and verify

- [ ] **H1.4** Integrate DATA_SOURCES.md into navigation
  - **Time:** 30 minutes
  - **Blocker:** None
  - **Agent Decision:** EXECUTE
  - **Best Agent:** Sonnet 4.5 (simple config/routing change)
  - **Subtasks:**
    - [ ] Check if DataSources route already exists (it does: /data-sources)
    - [ ] Verify DataSources page displays content from DATA_SOURCES.md
    - [ ] Add link in navigation if not already present

---

### H2: Remove Redundant Content
**Status:** Partially Complete - GlobalDisclaimer already adopted by 10 components  
**Priority:** MEDIUM (downgraded - less severe than initially estimated)  
**From:** SITE_CLEANUP_TODO.md Priority 3  
**Agent Action:** Can execute autonomously  
**Note:** Initial estimate of "12+ repeated disclaimers" was overstated. Audit (2026-02-19) found only 3 inline disclaimers remain, and these are domain-specific (legal, tool-specific) which may be intentional.

- [x] **H2.1** Create GlobalDisclaimer component ✅ (Already existed)
  - GlobalDisclaimer already exists at src/components/ui/GlobalDisclaimer.jsx
  - Supports 4 types: verify, sensitive, changing, security
  - Already adopted by 10 components
  - **Agent:** N/A (already done by prior work)

- [ ] **H2.2** Remove remaining inline disclaimers
  - Only 3 components still have inline disclaimers:
    - ForcedLabourList.jsx (lines ~327-342, "Important Disclaimer")
    - AIDisinfoDetector.jsx (lines ~395-400, tool-specific disclaimer)
    - LegalResourcesHub.jsx (legal disclaimer - may need to remain specialized)
  - **Time:** 1 hour (reduced from 3 hours - much less work than estimated)
  - **Blocker:** None, but legal disclaimer may intentionally need custom text
  - **Best Agent:** Sonnet 4.5 (straightforward component replacement)
  - **Agent Decision:** EXECUTE with care for legal disclaimer

- [ ] **H2.3** Create single source-of-truth for repeated statistics
  - "1 million Uyghurs" appears 8+ times
  - Link instead of repeating
  - **Time:** 2 hours
  - **Blocker:** None
  - **Best Agent:** Opus 4.6 (requires cross-file audit and refactoring)
  - **Agent Decision:** EXECUTE

---

## 🟡 MEDIUM PRIORITY: UX & Readability

### M1: Typography & Readability Improvements
**Status:** Not Started  
**Priority:** MEDIUM - Significant UX impact  
**From:** SITE_CLEANUP_TODO.md Priority 1  
**Agent Action:** Can execute autonomously  
**Best Agent:** Sonnet 4.5 (CSS-only changes, low complexity, high volume)  
**Why:** These are mechanical find-and-replace CSS class changes across many files - ideal for a fast agent with good pattern matching.

- [ ] **M1.1** Increase base font sizes globally
  - Change text-sm → text-base
  - Change text-xs → text-sm
  - **Time:** 2 hours
  - **Blocker:** None
  - **Agent Decision:** EXECUTE
  - **Subtasks:**
    - [ ] Audit all components using text-sm for body content
    - [ ] Replace text-sm → text-base in body content (not labels/captions)
    - [ ] Replace text-xs → text-sm in labels/metadata
    - [ ] Visual regression check

- [ ] **M1.2** Improve text contrast
  - Update slate-400 → slate-300
  - Meet WCAG AA standards
  - **Time:** 2 hours
  - **Blocker:** None
  - **Agent Decision:** EXECUTE
  - **Best Agent:** Sonnet 4.5 (mechanical CSS change)

- [ ] **M1.3** Add better line-height
  - Add leading-relaxed to paragraphs
  - **Time:** 1 hour
  - **Blocker:** None
  - **Agent Decision:** EXECUTE
  - **Best Agent:** Sonnet 4.5 (mechanical CSS change)

---

### M2: Emoji Reduction
**Status:** Not Started  
**Priority:** MEDIUM - Professional appearance  
**From:** SITE_CLEANUP_TODO.md Priority 2  
**Agent Action:** Can execute autonomously  
**Best Agent:** Sonnet 4.5 (find-and-replace, straightforward)  
**Why:** Mechanical removal of decorative emojis is a low-risk, high-volume task.

- [ ] **M2.1** Remove decorative navigation emojis
  - Dashboard 📊 → Dashboard
  - 8 items to update
  - **Time:** 30 minutes
  - **Blocker:** None
  - **Agent Decision:** EXECUTE
  - **Subtasks:**
    - [ ] Identify all navigation items with decorative emojis
    - [ ] Remove emojis from nav items
    - [ ] Verify navigation still looks good

- [ ] **M2.2** Keep only functional emojis (status indicators)
  - Keep: 🟢🟡🔴 ⚠️ ✅
  - Remove: All decorative emojis
  - Target: 170 → 30 emojis
  - **Time:** 2 hours
  - **Blocker:** None
  - **Agent Decision:** EXECUTE

---

### M3: Page Consolidation
**Status:** Partially Complete  
**Priority:** MEDIUM - Simplifies navigation  
**From:** SITE_WIDE_TODO.md Priority 3  
**Agent Action:** Can execute autonomously

- [x] Removed 4 pages from navigation (Campaigns, Communications, CCP Tactics, Regional Threats)

- [ ] **M3.1** Merge Take Action + Campaigns
  - Move CampaignProgress to Take Action
  - Remove CampaignHubs.jsx
  - Update internal links
  - **Time:** 3 hours
  - **Blocker:** None
  - **Agent Decision:** EXECUTE

- [ ] **M3.2** Merge Community + Communications
  - Move SecureComms to Community
  - Remove SecureComms.jsx
  - **Time:** 2 hours
  - **Blocker:** None
  - **Agent Decision:** EXECUTE

---

## 🟢 LOWER PRIORITY: Features & Enhancements

### L1: Accessibility Improvements
**Status:** Not Started  
**Priority:** LOW - Important but not blocking  
**From:** TODO.md, SITE_CLEANUP_TODO.md  
**Agent Action:** Can execute autonomously

- [ ] **L1.1** Add ARIA labels to interactive elements
  - **Time:** 4 hours
  - **Blocker:** None
  - **Agent Decision:** EXECUTE when higher priorities complete

- [ ] **L1.2** Improve keyboard navigation
  - **Time:** 3 hours
  - **Blocker:** None
  - **Agent Decision:** EXECUTE when higher priorities complete

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
