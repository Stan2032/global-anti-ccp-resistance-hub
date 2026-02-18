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
**Status:** Phase 1 Complete (Dec 30, 2025), Phase 2 In Progress  
**Priority:** CRITICAL - Platform credibility depends on this  
**Agent Action:** Can execute autonomously

#### Completed ✅
- [x] Removed ALL simulated data from `liveDataSources.js`
- [x] Created `SourceAttribution.jsx` component
- [x] Created `EmptyState.jsx` component
- [x] Fixed RSS feed aggregation (no fake fallbacks)
- [x] Created comprehensive DATA_SOURCES.md

#### Next Actions (Can Execute Now)
- [ ] **C1.1** Refactor PoliticalPrisoners.jsx to use `political_prisoners_research.json`
  - Component: 1,149 lines hardcoded
  - JSON file: 60 prisoners with source URLs
  - Add SourceAttribution display
  - **Time:** 4-6 hours
  - **Blocker:** None
  - **Agent Decision:** EXECUTE - Clear refactoring task

- [ ] **C1.2** Refactor DetentionFacilities.jsx to use `detention_facilities_research.json`
  - Component: 572 lines hardcoded
  - JSON file has proper source URLs
  - Link to ASPI satellite imagery
  - **Time:** 3-4 hours
  - **Blocker:** None
  - **Agent Decision:** EXECUTE

- [ ] **C1.3** Refactor CCPOfficials.jsx to use `sanctioned_officials_research.json`
  - Component: 526 lines hardcoded
  - Link to official sanction lists
  - **Time:** 2-3 hours
  - **Blocker:** None
  - **Agent Decision:** EXECUTE

- [ ] **C1.4** Refactor CompanyTracker.jsx to use `forced_labor_companies_research.json`
  - Component: 424 lines
  - Add evidence links display
  - **Time:** 3-4 hours
  - **Blocker:** None
  - **Agent Decision:** EXECUTE

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
**Status:** Foundation Complete, Integration In Progress  
**Priority:** HIGH - Critical for credibility  
**Agent Action:** Can execute autonomously

- [ ] **H1.1** Add SourceAttribution to Timeline component
  - **Time:** 1 hour
  - **Blocker:** None
  - **Agent Decision:** EXECUTE

- [ ] **H1.2** Add SourceAttribution to SanctionsTracker
  - **Time:** 1 hour
  - **Blocker:** None
  - **Agent Decision:** EXECUTE

- [ ] **H1.3** Add SourceAttribution to VictimMemorialWall
  - **Time:** 2 hours
  - **Blocker:** None
  - **Agent Decision:** EXECUTE

- [ ] **H1.4** Integrate DATA_SOURCES.md into navigation
  - **Time:** 30 minutes
  - **Blocker:** None
  - **Agent Decision:** EXECUTE

---

### H2: Remove Redundant Content
**Status:** Not Started  
**Priority:** HIGH - UX improvement  
**From:** SITE_CLEANUP_TODO.md Priority 3  
**Agent Action:** Can execute autonomously

- [ ] **H2.1** Create GlobalDisclaimer component
  - Consolidate 12+ repeated disclaimers
  - **Time:** 2 hours
  - **Blocker:** None
  - **Agent Decision:** EXECUTE

- [ ] **H2.2** Remove duplicate disclaimers from components
  - ~20 components affected
  - **Time:** 3 hours
  - **Blocker:** Depends on H2.1
  - **Agent Decision:** EXECUTE after H2.1

- [ ] **H2.3** Create single source-of-truth for repeated statistics
  - "1 million Uyghurs" appears 8+ times
  - Link instead of repeating
  - **Time:** 2 hours
  - **Blocker:** None
  - **Agent Decision:** EXECUTE

---

## 🟡 MEDIUM PRIORITY: UX & Readability

### M1: Typography & Readability Improvements
**Status:** Not Started  
**Priority:** MEDIUM - Significant UX impact  
**From:** SITE_CLEANUP_TODO.md Priority 1  
**Agent Action:** Can execute autonomously

- [ ] **M1.1** Increase base font sizes globally
  - Change text-sm → text-base
  - Change text-xs → text-sm
  - **Time:** 2 hours
  - **Blocker:** None
  - **Agent Decision:** EXECUTE

- [ ] **M1.2** Improve text contrast
  - Update slate-400 → slate-300
  - Meet WCAG AA standards
  - **Time:** 2 hours
  - **Blocker:** None
  - **Agent Decision:** EXECUTE

- [ ] **M1.3** Add better line-height
  - Add leading-relaxed to paragraphs
  - **Time:** 1 hour
  - **Blocker:** None
  - **Agent Decision:** EXECUTE

---

### M2: Emoji Reduction
**Status:** Not Started  
**Priority:** MEDIUM - Professional appearance  
**From:** SITE_CLEANUP_TODO.md Priority 2  
**Agent Action:** Can execute autonomously

- [ ] **M2.1** Remove decorative navigation emojis
  - Dashboard 📊 → Dashboard
  - 8 items to update
  - **Time:** 30 minutes
  - **Blocker:** None
  - **Agent Decision:** EXECUTE

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
