# Agent Roadmap - Consolidated Task Prioritization
**Purpose:** Agent-facing roadmap for autonomous progression and task execution  
**Last Updated:** 2026-02-19 (Session 16)  
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
**Status:** ✅ RESOLVED (2026-02-19)  
**Priority:** CRITICAL SECURITY RISK → RESOLVED  
**From:** IMPLEMENTATION_ROADMAP.md Phase 1.1  
**Resolution:** Removed all fake detection; replaced with honest disclaimers and reputable third-party self-test tools

**Original Problem:** Used `Math.random()` to fake VPN/Tor detection  
**Solution:** Instead of implementing real detection (which has privacy implications), we:
1. Removed all fake detection code and misleading security indicators
2. Added honest disclaimers throughout ("This platform cannot detect whether you are using a VPN or Tor")
3. Added "Verify Your Connection" section with 4 reputable third-party self-test tools
4. Deleted orphaned SecurityWarning.jsx and Header.jsx (layout) dead code

**Owner Decisions (2026-02-19, Session 16):**
- **C2.1** No IP geolocation — CLOSED ✅
- **C2.2** No server-side detection — CLOSED ✅  
- [x] **C2.3** WebRTC leak detection — IMPLEMENTED ✅ (Session 16)
  - Built `useWebRTCLeakCheck` hook — runs entirely in-browser, no external APIs
  - Detects local and public IPs via RTCPeerConnection ICE candidates
  - Shows clear pass/fail status with remediation steps
  - **Agent:** Opus 4.6 (security-critical, required understanding of WebRTC/ICE protocols)

- [x] **C2.4** Add honest security warnings ✅ (2026-02-19, Session 8-9)
  - Rewrote SecurityWarning component to remove false VPN/Tor detection claims
  - Added explicit disclaimer: "This platform cannot detect whether you are using a VPN or Tor"
  - Added EFF Surveillance Self-Defense link as security resource
  - Replaced fake "SECURE" badge, "Connection: Secure", "Status: Online" with honest alternatives
  - **Agent:** Opus 4.6 (security-critical, required understanding of threat model)

- [x] **C2.5** Add reputable VPN/Tor self-test tools ✅ (2026-02-19, Session 13)
  - Added "Verify Your Connection" section to SecurityCenter Tools tab
  - 4 reputable third-party tools: check.torproject.org, ipleak.net, dnsleaktest.com, mullvad.net/en/check
  - Each tool has provider attribution and clear description
  - Fixed Tails URL: tails.boum.org → tails.net (domain moved)
  - **Agent:** Opus 4.6 (security-critical, required judgment on which tools are reputable)

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
**Status:** ✅ COMPLETE (2026-02-19)  
**Priority:** MEDIUM - Professional appearance  
**From:** SITE_CLEANUP_TODO.md Priority 2  
**Agent Action:** Executed across Sessions 9-12  
**Best Agent:** Opus 4.6 (judgment on which to keep vs remove) + sub-agents for mechanical execution  
**Result:** 934 → 278 emojis (656 removed, 70%). Remaining 278 = 177 flags + 84 status indicators + 17 intentional content emojis.

- [x] **M2.1** Replace Dashboard emojis with Lucide icons ✅ (Session 9)
  - 17 emojis → Lucide icons (Users, Building2, Target, AlertTriangle, etc.)
  
- [x] **M2.2a** Replace TakeAction emojis ✅ (Session 10)
  - 12 emojis → Lucide icons
  
- [x] **M2.2b** Replace ResistanceResources emojis ✅ (Session 10)
  - 17 emojis → Lucide icons

- [x] **M2.2c** Replace emojis across TakeAction child components ✅ (Session 11)
  - ActivistToolkit (28), SocialMediaToolkit (12 UI), ContactRepresentatives (8)
  - NewsDigest (14), MediaGallery (22), DataExport (12), ActionTracker (14)
  - VolunteerSignup (22), ChinaTechThreats (3), EventRSVP (14), ChinaExitBan (3)
  - WitnessProtection (7), PodcastList (12), SurvivorStories (9)
  - ReportSighting (10), QuickStartGuide (11), LegalResources (4)
  - GlobalSearch (40+), DisinfoTracker (10), LiveStatistics (11)
  - LetterCampaign (6), SourceVerification (6), XinjiangStatus (3)

- [x] **M2.2d** Replace emojis across remaining components ✅ (Session 12)
  - CompanyTracker, DiasporaSupport, ReadingProgress, CCPOfficials, Bookmarks
  - DonationGuide, Glossary, PetitionGenerator, KnowledgeQuiz, SanctionedOfficials
  - VictimStories, MediaManipulation, SolidarityWall, CountdownTimer
  - SafetyChecklist, PoliceStationsMap, EmergencyAlerts, UrgentCaseTimer
  - RegionalIssues, ForcedLaborSupplyChain, NewsAggregator, EventCalendar
  - LanguageGuide, SanctionsTracker, IncidentReportForm, CCPTactics
  - ResearchPapers, ConfuciusInstitutes, ImpactMetrics, Footer, EventMap
  - CaseStudies, SecurityQuiz, and more

- [x] **Emoji audit final count:**
  - Country flags: 177 KEPT (🇺🇸🇬🇧🇨🇦🇭🇰🇹🇼🇪🇺 etc. — convey information)
  - Status indicators: 84 KEPT (✓✗✅🟢🟡🔴 — functional)
  - Content emojis: 17 KEPT (social share text, accessibility alerts, content warnings)
  - Decorative removed: 656 (70% of original 934)

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
**Status:** ✅ COMPLETE (2026-02-19, Session 14)  
**Priority:** LOW - Important but not blocking  
**From:** TODO.md, SITE_CLEANUP_TODO.md  
**Agent Action:** Executed — all clickable non-button elements now have keyboard support

- [x] **L1.1a** Add ARIA labels to TakeAction interactive elements ✅ (2026-02-19, Session 10)
  - Added aria-expanded/aria-controls to expandable action cards
  - Added role="region"/aria-label to expanded panels
  - Added aria-hidden to decorative SVGs
  - Added aria-label to newsletter form and email input
  - **Agent:** Opus 4.6

- [x] **L1.1b** Add ARIA labels to remaining pages ✅ (2026-02-19, Session 14)
  - Added role/tabIndex/onKeyDown/aria-pressed to 10 page-level card components:
    EducationalResources ModuleCard, CommunitySupport RequestCard, CampaignHubs CampaignCard,
    ResistanceDirectory org cards, CCPTactics CategoryCard + TacticDetail,
    PoliticalPrisoners PrisonerCard + PrisonerModal, RegionalThreats ThreatCard, SecureComms ChannelCard
  - Added role/tabIndex/onKeyDown/aria-expanded to 4 component-level expandable sections:
    ForcedLaborTracker, SanctionedOfficialsTracker, Timeline, LegalResources
  - Fixed generic Card component to conditionally add keyboard support when onClick provided
  - Total ARIA attributes: 36 → 104 (3x improvement)
  - **Agent:** Opus 4.6 (faster than expected — all followed same pattern)

- [x] **L1.2** Improve keyboard navigation ✅ (2026-02-19, Session 14)
  - All 15 clickable non-button elements now support Enter/Space keyboard activation
  - All toggle elements communicate state via aria-expanded/aria-pressed
  - PrisonerModal has role="dialog" aria-modal="true"
  - **Agent:** Opus 4.6 (combined with L1.1b for efficiency)

---

### L3: Dead Code Removal
**Status:** ✅ COMPLETE (2026-02-19, Sessions 13+17)  
**Priority:** LOW - Code quality  
**Agent Action:** Audited in Session 10, deleted in Sessions 13+17 (owner approved via problem statement)  
**Best Agent:** Opus 4.6 (audit and judgment on what's safe to delete)

**15 dead code files deleted (4,648 lines removed):**
| Component | Status | Session | Notes |
|-----------|--------|---------|-------|
| `src/components/BoycottList.jsx` | ✅ Deleted | 13 | Zero imports, never used |
| `src/components/DiasporaDirectory.jsx` | ✅ Deleted | 13 | Zero imports, never used |
| `src/components/LazyImage.jsx` | ✅ Deleted | 13 | Zero imports, never used |
| `src/components/VideoTestimonials.jsx` | ✅ Deleted | 13 | Zero imports, never used |
| `src/components/features/FeedSourceSelector.jsx` | ✅ Deleted | 13 | Zero imports, never used |
| `src/components/features/FeedStats.jsx` | ✅ Deleted | 13 | Zero imports, never used |
| `src/components/intelligence/LiveIntelligenceFeed.jsx` | ✅ Deleted | 13 | Zero imports, never used |
| `src/components/layout/Header.jsx` | ✅ Deleted | 13 | App.jsx uses inline header; had fake securityLevel code |
| `src/components/layout/Sidebar.jsx` | ✅ Deleted | 13 | App.jsx uses inline sidebar |
| `src/components/ui/SecurityWarning.jsx` | ✅ Deleted | 13 | Rewritten in Session 8, orphaned |
| `src/data/realSources.js` | ✅ Deleted | 13 | Zero references anywhere |
| `src/utils/performance.js` | ✅ Deleted | 13 | Only referenced by dead LazyImage.jsx |
| `src/components/layout/Footer.jsx` | ✅ Deleted | 17 | App.jsx uses components/Footer, not layout/Footer |
| `src/components/features/LiveFeed.jsx` | ✅ Deleted | 17 | Zero imports (317 lines dead code) |
| `PRISONERS_DATA_ORIGINAL` in PoliticalPrisoners | ✅ Deleted | 17 | 770 lines of dead hardcoded data replaced by JSON import |

**Verification:** Build passes (4.80s), 142/142 tests pass after deletion. Empty `intelligence/`, `layout/`, `features/` directories removed.

---

### L2: Multilingual Support
**Status:** Infrastructure Complete, Navigation Wired  
**Priority:** LOW - Infrastructure ready, awaiting volunteer translators  
**From:** TODO.md Short-Term High Priority  
**Agent Decision:** Infrastructure COMPLETE, navigation WIRED, content awaits volunteers

**Owner Decision (Session 16):** Wait for native volunteers, machine translate nav/basic words only. Do NOT translate sensitive subjects without human translators.

- [x] **L2.1** i18n infrastructure ✅ (Session 16)
  - Existing LanguageSelector + LanguageProvider system enhanced
  - Locale JSON files wired into translation function via `localeData` property
  - `__VOLUNTEER_TRANSLATION_NEEDED__` markers automatically fall back to English
  - t() function cascades: inline → locale JSON → English fallback
  
- [x] **L2.2** Add zh-CN (Simplified Chinese) ✅ (Session 16)
  - Created `src/locales/zh-CN.json` — full 226-line locale file
  - Split single `zh` entry into `zh-CN` (Simplified) and `zh-TW` (Traditional)
  - Navigation and basic UI words machine-translated (per owner approval)
  - 5 languages now available: English, 简体中文, 繁體中文, ئۇيغۇرچە, བོད་སྐད།

- [x] **L2.4** Wire App.jsx navigation to use t() ✅ (Session 17)
  - MobileNav: All 10 nav items use `t('nav.xxx')` for translated labels
  - DesktopSidebar: All nav items + section titles use `t('nav.xxx')`
  - Added 5 missing nav keys to all 5 locale files
  - Added 18 i18n locale tests verifying key consistency across all languages
  - **Agent:** Opus 4.6

- [ ] **L2.3** Recruit volunteer translators for sensitive content
  - Testimonies, legal info, safety guides MUST be human-translated
  - **Agent Action:** Cannot do — requires human volunteers
  - **Status:** Awaiting native speakers

---

## ⏸️ RESOLVED: Previously Blocked Tasks (Owner Answered)

### HR1: Backend Architecture
**Status:** ✅ DECIDED (Session 16)  
**Owner Decision:** A) Stay static for now, B) add serverless later

**Recommended Stack (researched Session 16):** Cloudflare Pages Functions + Supabase
- Keeps hosting + functions on same platform (Cloudflare)
- Supabase for DB/Auth/Storage when needed (free tier, open source)
- No over-engineering: functions deploy alongside static site
- Best DDoS protection and censorship resistance for activist platform

**Next Steps (when ready):**
- [ ] **HR1.1** Create `/functions/api/` directory structure for Cloudflare Pages Functions
- [ ] **HR1.2** Set up Supabase project (when DB/Auth needed)
- [ ] **HR1.3** Implement first serverless function (contact form or incident report)

---

### HR2: Content Policy
**Status:** ✅ DECIDED (Session 16)  
**Owner Decision:** GitHub PRs from trusted contributors; consider user submissions later

- [x] Moderation via GitHub PR review process
- [ ] Future: Consider email-based submissions

---

### HR3: Service Decisions
**Status:** ✅ PARTIALLY DECIDED (Session 16)  

- [x] **HR3.1** Hosting: Cloudflare Pages ✅ (configured with _redirects + _headers)
- [x] **HR3.2** IP Geolocation: NOT NEEDED (owner decided no geolocation)
- [ ] **HR3.3** Email Service: Deferred for future decision

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
- [x] Reduced visual clutter (emojis: 934 → 278, 70% removed — remaining are intentional flags/status/content)
- [ ] Simplified navigation (pages: 14 → 8)

**Documentation:**
- [ ] All agent decisions logged
- [ ] Clear handoff notes for human review
- [ ] Up-to-date task status

---

**Agent:** Opus 4.6 (Sessions 6-17), Claude Sonnet 3.5 (Sessions 1-5)  
**Mode:** Autonomous with human escalation  
**Next Review:** All autonomous tasks COMPLETE. Remaining tasks (HR1.1-3, HR3.3, L2.3) blocked on human decisions or volunteer recruitment.
