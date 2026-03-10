# Global Anti-CCP Resistance Hub — Active To-Do List

> Last Updated: March 10, 2026 (Session 263)
>
> **Location:** `_agents/TODO.md` — Active tasks only.
> **Completed tasks:** See `_agents/TODO_COMPLETED.md` for full archive.
> **Agent docs:** `_agents/` folder (NEXT_AGENT_PROMPT.md, AGENTS.md, STYLE_GUIDE.md, AGENT_HANDOFF.json)
> **Human decisions:** All Q1-Q11 answered. See `_agents/QUESTIONS_FOR_HUMANS.md` + archives.

---

## 🔴 SHORT-TERM (1-2 weeks)

### Human-Answered Tasks (Q6-Q10, Session 153)
- [x] **Implement basic cache (Q6)**: ✅ Two-layer caching implemented: (1) Static asset Cache-Control headers in `_headers` (immutable for hashed assets, no-cache for HTML/SW), (2) Backend feed routes wired to in-memory cacheService (TTL 5-30 min, tag-based invalidation, LRU eviction). BACKEND_GUIDE.md updated with full caching documentation.
- [x] **Supabase Auth admin login (Q8)**: ✅ IMPLEMENTED Session 157. Frontend auth code: AuthContext + authUtils (auth state management), authService.js (login/logout/admin check), ProtectedRoute (route guard), AdminLogin page (email/password form with "not configured" fallback), AdminDashboard page (tabbed data viewer for all 4 tables). Comprehensive setup guide: `SUPABASE_AUTH_SETUP.md` (7 steps including SQL for admin_users table, RLS policies, and troubleshooting). Human needs to run SQL in Steps 2-4 in Supabase Dashboard.
- [ ] **Cloudflare Onion Routing (Q9)**: ⚠️ DEFERRED — Requires custom domain (not available for `workers.dev` subdomains). Full step-by-step custom domain + onion routing guide available at `guides/CUSTOM_DOMAIN_SETUP.md` (rewritten Session 236 — detailed dashboard walkthrough). Also see `ONION_ROUTING_SETUP.md`. Will activate when custom domain is acquired.

### Standing Instructions (from Q7, Q10)
- **Feature priority (Q7)**: Agents use own judgement. Recommended order: Offline Mode > API Development > Analytics Dashboard.
- **Test strategy (Q10)**: Mix — alternate between test coverage and feature work each session.

### Content Updates
- [x] **Update Sanctions List**: ✅ Verified March 2, 2026. US Mar 2025 round (6 HK officials for transnational repression) already included. EU 2025 sanctions are entity-level (Chinese companies supporting Russia), not individual officials — different category. All 47 entries verified current.
  - 47 entries currently (includes Canada Dec 2024 + US Mar 2025 rounds)
  - Subtask: Check US Treasury SDN list for new China/HK-related designations ✅
  - Subtask: Check UK FCDO sanctions list for updates ✅
  - Subtask: Check EU Council sanctions for new entries ✅ (entity-level only in 2025)
  - Subtask: Verify source_url links still resolve
- [x] **Monitor Jimmy Lai appeal proceedings** — ✅ Updated Session 235
  - ✅ Dec 15, 2025: Found guilty on all 3 NSL charges
  - ✅ Feb 9, 2026: Sentenced to 20 years (harshest NSL sentence)
  - ✅ Feb 26, 2026: Fraud conviction overturned on appeal (separate case)
  - ✅ Mar 2026: Confirmed will NOT appeal NSL sentence (NBC News). UN calls for release (UN News)
  - Subtask: Monitor health status and international pressure
- [x] **Monitor Joshua Wong case** — ✅ Updated Session 150
  - ✅ Jun 6, 2025: New foreign collusion charge filed (max: life imprisonment)
  - ✅ Feb 14, 2026: HK47 appeal dismissed — 4yr 8mo sentence upheld
  - ✅ Mar 6, 2026: Foreign collusion case transferred to High Court (hearing held)
  - Subtask: Monitor foreign collusion trial proceedings — awaiting High Court hearing outcome
  - Subtask: Check for post-hearing developments from HKFP, Amnesty, HRW
- [x] **Add Kwok Yin-sang case** — ✅ Session 150
  - First family member prosecuted under Article 23 (Feb 26, 2026)
  - Father of US-based activist Anna Kwok, sentenced 8 months
  - Added to political_prisoners_research.json + emergency_alerts.json
- [x] **Tibetan Uprising Day data** — ✅ Session 263 (March 10, 2026)
  - Added timeline event #38: 67th anniversary of Tibetan National Uprising (2026-03-10)
  - Added news item: global solidarity protests, 400+ German municipalities raised Tibetan flag
  - Sources: Tibet Post International, Committee for Free HK Foundation, HRW
- [x] **China-Canada sanctions data** — ✅ Session 263 (March 10, 2026)
  - Added timeline event #37: China retaliates against Canadian human rights organizations (2026-03-08)
  - Added news item: asset freezes, entry bans on Canadian orgs/individuals for Uyghur/Tibet work
  - Sources: ICIJ, HRW, Amnesty International
  - New `international` category added to timeline and test validator
- [x] **HRW World Report 2026** — ✅ Session 263 (March 10, 2026)
  - Added news item: "China Repression Deepens, Extends Abroad" (2026-02-04)
  - Direct source URL: https://www.hrw.org/news/2026/02/04/china-repression-deepens-extends-abroad
- [x] **Simulated Data Phase 2**: ✅ ALL COMPLETE (5/5 fully migrated to JSON)
  - ✅ PoliticalPrisoners page → political_prisoners_research.json (DONE)
  - ✅ ForcedLaborTracker → forced_labor_companies_research.json (DONE)
  - ✅ DetentionFacilities → detention_facilities_research.json (DONE — Session 89, 11 facilities with coordinates/capacity/evidence)
  - ✅ CCPOfficials → sanctioned_officials_research.json (DONE — Session 90, JSON enriched with biographical data, hardcoded array removed)

### Bug Fixes & Polish
> ✅ **ALL COMPLETE** — Sessions 50-215. See `_agents/TODO_COMPLETED.md` and session history for details.
> 47 completed items covering: mobile responsiveness, dark mode, sort/filter, dashboard usability, breadcrumbs, recent updates, region filters, contrast overhaul, deep usability, per-source loading, event countdown, alert sharing, data hygiene, live statistics JSON extraction, real data export, design system enforcement, URL validation, no-hashtags policy, profile page tests, 100% page test coverage, cross-JSON consistency, accessibility audit, keyboard navigation, performance resilience, sitemap freshness, route integrity, defensive coding, meta-test coverage, security audit, performance budget, ARIA live regions, data API, content analytics, API docs, data changelog, influence network, data comparison, advocacy letters, case timeline, international response tracker, sanction impact analyzer, HR org directory, overseas police stations, source diversity, prisoner dashboard, legal case tracker, cross-dataset insights, data integrity monitor.

- [x] **Visual overlap fixes**: ✅ InteractiveTimeline year labels fixed (Session 222) — adaptive 5-year intervals with min-gap endpoint exclusion, min-w-[540px] for mobile horizontal scroll. Verified zero overlaps at 375px (30px gaps), 768px (52px gaps), 1280px (69px gaps). **Full visual audit complete (Sessions 232-233)**: All 11 pages tested at 100%/125%/150% zoom × 375/768/1280px viewports (99 combinations). Zero horizontal overflow, zero heading truncation, zero content-too-narrow issues. Session 232 fixed: QuickStartGuide dot overflow at 375px (WCAG 44px touch target inflating decorative dots), TakeAction horizontal scroll at 375px (p-6→p-4 sm:p-6 + AdvocacyLetterGenerator flex-wrap), added overflow-x-hidden on App root. *(Originally reported by human, Session 221)*
- [x] **Placeholder text standardization**: ✅ Session 225 — All 48 placeholder instances across 30 files standardized to `placeholder:text-slate-400` (Tailwind v3+ syntax). Fixed 2 `placeholder-slate-600` violations, converted 19 `placeholder-slate-500` and 9 `placeholder-slate-400` (old syntax). Added 11th design system compliance test preventing reintroduction. Focus colors also standardized: 7 components fixed from non-terminal colors (emerald/green/cyan/amber/red) to terminal palette (`#4afa82`/`#22d3ee`).
- [x] **Non-functional interactive elements audit & fix**: ✅ Session 230 — Full site audit for broken buttons, forms, and misleading UI. Fixed 9 issues across 8 files:
  - **EducationalResources.jsx**: "Start Course" button (no onClick) → replaced with "Course content coming soon" notice. Download buttons (no onClick, no URL) → replaced with disabled-style indicators.
  - **EventCalendar.jsx**: "Subscribe to Calendar" button (styled active but non-functional) → changed to disabled style with `cursor-not-allowed`.
  - **VolunteerSignup.jsx, ContactForm.jsx, NewsDigest.jsx, IncidentReportForm.jsx**: Forms appear fully functional but data goes nowhere when backend not connected → forms now visually disabled (`opacity-50 pointer-events-none`) when no backend, with existing "Coming Soon" warning.
  - **ReportSighting.jsx**: Form always non-functional (no backend integration at all) → form content disabled with `opacity-50 pointer-events-none`.
  - **ProfilesIndex.jsx**: Unbuilt profile cards look clickable → increased opacity reduction to 50% with `cursor-default`. *(Originally reported by human, Session 230)*
- [x] **Comprehensive site-wide interactive element verification**: ✅ Session 231 — Automated + manual click-based audit across ALL 13 pages (Dashboard, Education, Intelligence, Security, Prisoners, Take Action, Directory, Community, Data Sources, Resources, Profiles Index, 2 individual profiles). Tested 1,000+ buttons, 800+ links, all tabs, all expand/collapse, all search/filter inputs, all forms. Results: **0 genuinely broken interactive elements found**. All buttons fire handlers, all filters filter, all search inputs search, all accordions toggle, all tabs switch content, all navigation links work. The Session 230 "coming soon" approach was adequate — no elements are misleadingly interactive. One minor UX improvement: download resource indicator border removed (was styled like a button). *(Originally reported by human, Session 231)*

### Navigation Simplification (Session 136)
- [x] **Sidebar nav reduced**: 11 items → 7 items (Dashboard, Intelligence, Political Prisoners, Profiles, Take Action, Education, Security)
- [x] **Sidebar width narrowed**: w-64 → w-56 for more content space
- [x] **Pages removed from nav but still routable**: /directory, /community, /resources, /data-sources

---

## 🔵 PAGE SIMPLIFICATION — Comprehensive Task List

> **Goal:** Make each page less overwhelming, more scannable, and easier to use. Reduce cognitive load. Prioritize the most important content and hide or remove the rest.
>
> **Principles:**
> - Show 3-5 key sections per page, not 10-15
> - Remove or hide rarely-used sub-components behind expandable sections
> - Reduce inline hardcoded data arrays — move to JSON or remove if aspirational
> - Cut redundant sub-components that duplicate content across pages
> - Tabs: max 3-4 per page (currently some have 6-7)

### Page 1: Dashboard (275 lines, 5 lazy components) — ✅ SIMPLIFIED (Session 140, 142, 143)
**Was:** 349 lines, 8 lazy components (incl CountdownTimer, ImpactMetrics)
**Now:** 275 lines, 5 lazy components (EmergencyAlerts, UrgentCaseTimer, NewsAggregator, LiveStatistics, NewsDigest)
- [x] **Remove CountdownTimer** — redundant with UrgentCaseTimer (both track Jimmy Lai) ✅
- [x] **Remove ImpactMetrics** — aspirational data without real backend metrics ✅
- [x] **Component files deleted** — 2 orphan .jsx files removed (416 lines) ✅
- [x] **Remove inline `urgentCampaigns` array** — fake supporter counts, overlaps EmergencyAlerts ✅ (Session 142)
- [x] **Simplify quick actions** — 4 → 3 (removed "Join Campaign" duplicate of "Take Action") ✅ (Session 142)
- [x] **Move ResearchDashboard to Intelligence page** — research fits better there ✅ (Session 143)
- **Target reached:** 8 → 5 components, fake data removed ✅

### Page 2: Intelligence Feeds (365 lines, 9 lazy components) — ✅ SIMPLIFIED (Session 139, 143, 144)
**Was:** 360 lines, 11 lazy components, 3 tabs (Feeds/Regional with 5 components/Operations with 6 components)
**Now:** 365 lines, 9 lazy components (HongKongStatus, TibetStatus, XinjiangStatus, TaiwanDefenseStatus, CCPOfficials, WorldThreatMap, DetentionFacilities, SanctionedOfficials, ResearchDashboard)
- [x] **Remove GlobalInfluenceMap** — overlaps WorldThreatMap ✅
- [x] **Remove PoliceStationsMap** — overlaps DetentionFacilities ✅
- [x] **Remove RegionalIssues** — generic, overlaps 4 specific regional components ✅
- [x] **Component files deleted** — 3 orphan .jsx files removed (1,021 lines) ✅
- [x] **Feed truncation** — show 5 articles by default with "Show all" button, reset on filter change ✅ (Session 144)
- [x] **RSS feed config → JSON** — moved liveDataFeeds to live_data_feeds.json, liveDataSources.js imports from JSON ✅ (Session 146)
- **Target reached:** 11 → 8 components ✅, feeds truncated ✅, RSS data→JSON ✅

### Page 3: Political Prisoners (573 lines, 0 lazy components) — ✅ truncation + modal streamlined (Session 142, 145)
**Current:** Large inline page with search/filter, prisoner cards, detail modal — no sub-components
- [x] **Remove motion animations** — 7 motion.div usages removed ✅ (Session 140)
- [x] **Truncate long prisoner lists** — show 15 by default with "Show all X cases" button, resets on filter change ✅ (Session 142)
- [x] **16 tests added** — all passing ✅ (Session 142)
- [x] **Streamline detail modal** — remove redundant charges section (=sentence), merge health sections, merge latestNews+intlResponse, compact key facts grid, source compact ✅ (Session 145)
- [x] **Research: data already in JSON** — ✅ verified: all data from political_prisoners_research.json (line 7)
- **Target:** Keep structure, reduce visual noise ✅ (truncation + modal done)

### Page 4: Take Action (336 lines, 11 lazy components) — ✅ SIMPLIFIED (Session 138, 143, 145, 148, 149)
**Was:** 552 lines, 15 lazy components, email form, duplicate share section
**Now:** 336 lines, 11 lazy components (PetitionLinks, ForcedLabourList, ContactRepresentatives, SuccessStories, QuickFacts, ActivistToolkit, SanctionsTracker, DonationGuide, CompanyTracker, VolunteerSignup, DiasporaSupport)
- [x] **Remove email subscribe form** — owner DEFERRED email features ✅
- [x] **Reduce 15 lazy components to 8** — removed 7 aspirational/overlapping: ✅
  - ✅ PetitionGenerator (overlaps PetitionLinks)
  - ✅ ForcedLaborSupplyChain (overlaps ForcedLabourList)
  - ✅ SocialMediaToolkit (aspirational — no real backend)
  - ✅ CampaignProgress (aspirational — no real tracking data)
  - ✅ LetterCampaign (overlaps ContactRepresentatives)
  - ✅ ActionTracker (aspirational — no real user action data)
  - ✅ GovernmentResponseTracker (aspirational — no real response data)
- [x] **Remove duplicate inline social share section** — ShareButtons already at bottom ✅
- [x] **Component files deleted** — 7 orphan .jsx files removed ✅
- [x] **Move inline `actions` array (80+ lines)** → take_action_steps.json with icon mapping ✅ (Session 143)
- [x] **Add "show more" pattern** — show top 3 actions expanded, rest collapsed ✅ (Session 143)
- [x] **Simplify 8→5 action steps** — merged petitions+boycott, awareness+solidarity, info+security+report ✅ (Session 145)

### Page 5: Education Center (379 lines, 18 lazy components) — ✅ SIMPLIFIED (Session 138) + data extracted (Session 141) + components added (Session 148, 149)
**Was:** 622 lines, 17 lazy components, 7 tabs, 8 modules, framer-motion
**Now:** 379 lines, 18 lazy components, 4 tabs, 5 modules, no framer-motion
- [x] **Reduce 7 tabs to 4**: Learn | Media | Research | Tools ✅ (History merged into Learn, FAQ merged into Tools, Progress removed)
- [x] **Remove ReadingProgress** — aspirational feature (no real user session tracking) ✅
- [x] **Remove AcademicCitationGenerator** — niche utility, rarely used ✅
- [x] **Remove PodcastPlayer** — aspirational (no real podcast content) ✅
- [x] **Remove KnowledgeQuiz** — already have SecurityQuiz on Security page ✅
- [x] **Reduce 8 modules to 5** — removed modules with fake instructor names/ratings ✅
- [x] **Simplify category filter** — 6 → 5 category buttons ✅
- [x] **Remove motion animations** — all motion.div → div, motion.button → button ✅
- [x] **Remove fake data** — student counts, ratings, download counts, progress bars all removed ✅
- [x] **Component files deleted** — 4 orphan .jsx files removed ✅
- [x] **Move inline `modules` array** → JSON file (educational_modules.json) ✅ (Session 141)

### Page 6: Security Center (438 lines, 9 lazy components) — ✅ SIMPLIFIED (Session 139, 148, 149)
**Was:** 613 lines, 8 lazy components, 6 tabs (assess, legacy-assessment, tools, guides, protect, whistleblower, threats), framer-motion
**Now:** 438 lines, 9 lazy components, 4 tabs (Assess, Tools, Guides, Tech Threats), no framer-motion
- [x] **Reduce 6 tabs to 4**: Assess | Tools | Guides | Threats ✅ (Protect merged into Guides, Whistleblower removed, legacy-assessment removed)
- [x] **Remove WhistleblowerPortal** — aspirational (no real secure submission system) ✅
- [x] **Remove OfflineModeManager** — aspirational (PWA caching handles this) ✅
- [x] **Remove legacy-assessment tab** — hidden/redundant with SecurityQuiz ✅
- [x] **Merge Protect tab into Guides** — WitnessProtection now under Guides tab ✅
- [x] **Remove motion animations** — all 19 motion.div/motion.a/motion.button → static HTML ✅
- [x] **Clean up unused state/imports** — legacy assessment state, handlers, 9 unused icons removed ✅
- [x] **Component files deleted** — 2 orphan .jsx files removed (874 lines) ✅
- [x] **17 tests added** — all passing ✅
- [ ] **Move security assessment questions to JSON** — currently imported from JSON already ✅
- **Target reached:** 8 → 6 components, 6 → 4 tabs ✅

### Page 7: Community Support (67 lines, 0 lazy components) — ✅ ALL MERGED (Session 140, 149)
**Was:** 559 lines, 10 lazy components, 6 tabs, framer-motion, fake data (support requests, volunteers, stats)
**Now:** 67 lines, 0 lazy components — all components redistributed to active pages, serves as redirect hub
- [x] **Page is not in nav** — already removed from navigation in Session 136 ✅
- [x] **Remove 4 aspirational components** — SolidarityWall, VictimMemorialWall, EventRSVP, EventMap ✅
- [x] **Delete 4 orphan component files** — 1,692 lines removed ✅
- [x] **Remove all framer-motion** — 13 motion.div/button usages removed ✅
- [x] **Remove hardcoded fake data** — 6 support requests, 3 volunteer profiles, community stats ✅
- [x] **Reduce 6 tabs to 4** — Support (includes volunteer+contact) | Events | Stories | Report ✅
- [x] **14 tests added** — all passing ✅
- [x] **Merge all components into other pages** ✅ (Session 149):
  - ✅ EventCalendar → Education Learn tab
  - ✅ SurvivorStories → Education Learn tab
  - ✅ VolunteerSignup → TakeAction
  - ✅ DiasporaSupport → TakeAction
  - ✅ ReportSighting → Security Tools tab
  - ✅ ContactForm → Security Tools tab
- **Target exceeded:** 10 → 0 components, page now serves as redirect hub ✅

### Page 8: Resistance Resources (264 lines, 2 lazy components) — ✅ SIMPLIFIED (Session 141, 148)
**Was:** 330 lines, 10 lazy components, framer-motion, 3 aspirational components
**Now:** 264 lines, 2 lazy components (DataExport, ForcedLaborTracker), no framer-motion
- [x] **Page is not in nav** — already removed from navigation in Session 136 ✅
- [x] **Remove Bookmarks** — aspirational (no user session persistence) ✅ (Session 141)
- [x] **Remove MediaGallery** — aspirational (no curated media library) ✅ (Session 141)
- [x] **Remove OrganizationsDirectory** — overlaps with ResistanceDirectory page ✅ (Session 141)
- [x] **Remove framer-motion** — 2 motion.div usages removed ✅ (Session 141)
- [x] **12 tests added** — all passing ✅ (Session 141)
- [x] **Merge sub-components into other pages** ✅ (Session 148):
  - ✅ Moved AcademicExperts to Education Research tab
  - ✅ Moved MediaBiasGuide to Education Media tab
  - ✅ Moved HistoricalDocuments to Education Learn tab
  - ✅ Moved CompanyTracker to TakeAction (after boycott section)
  - ✅ Moved LegalResourcesHub to Security Tools tab
  - ✅ DataExport already on DataSources page (Session 146)
- **Target exceeded:** 10 → 2 components, all redistributed ✅

### Page 9: Data Sources (252 lines, 1 lazy component) — ✅ framer-motion removed + DataExport added (Session 140, 146)
**Current:** Static informational page about data methodology. Clean and focused. DataExport lazy-loaded.
- [x] **Remove motion animations** — 17 motion.div/a usages removed ✅
- [x] **Add DataExport here** — natural fit for data-oriented users ✅ (Session 146)
- [ ] **No major structural changes needed** — already well-structured
- **Target:** Keep mostly as-is ✅

### Page 10: Resistance Directory (244 lines, 0 lazy components) — LOW priority
**Current:** Organization search/filter from JSON data. Not in nav.
- [ ] **No major changes needed** — clean search/filter interface
- [ ] **Accessible via footer links and cross-links** — not in main nav
- **Target:** Keep as-is

### Cross-Cutting Simplification Tasks
- [x] **Remove framer-motion completely** — ✅ ALL usages removed, dependency uninstalled (Session 144)
  - ✅ EducationalResources: all motion removed (Session 138)
  - ✅ SecurityCenter: all motion removed (Session 139)
  - ✅ CommunitySupport page: all motion removed (Session 140)
  - ✅ PoliticalPrisoners: all motion removed (Session 140)
  - ✅ DataSources: all motion removed (Session 140)
  - ✅ ResistanceResources: all motion removed (Session 141)
  - ✅ ReportSighting: all motion removed, dependency uninstalled (Session 144)
  - ✅ vendor-motion bundle eliminated (was 116KB/38KB gzip)
- [x] **Audit for aspirational components** — 25 removed total: ✅
  - ✅ Session 138: ActionTracker, CampaignProgress, GovernmentResponseTracker, SocialMediaToolkit, PetitionGenerator, LetterCampaign, ForcedLaborSupplyChain, ReadingProgress, PodcastPlayer, KnowledgeQuiz, AcademicCitationGenerator (11)
  - ✅ Session 139: GlobalInfluenceMap, PoliceStationsMap, RegionalIssues, WhistleblowerPortal, OfflineModeManager (5)
  - ✅ Session 140: SolidarityWall, VictimMemorialWall, EventRSVP, EventMap, CountdownTimer, ImpactMetrics (6)
  - ✅ Session 141: Bookmarks, MediaGallery, OrganizationsDirectory (3)
  - All aspirational components cleaned up ✅
- [x] **Consolidate overlapping components** — 7 of 7 pairs resolved: ✅
  - ✅ PetitionGenerator removed (PetitionLinks kept)
  - ✅ ForcedLaborSupplyChain removed (ForcedLabourList kept)
  - ✅ LetterCampaign removed (ContactRepresentatives kept)
  - ✅ GlobalInfluenceMap removed (WorldThreatMap kept)
  - ✅ PoliceStationsMap removed (DetentionFacilities kept)
  - ✅ RegionalIssues removed (4 specific regional components kept)
  - ✅ VictimMemorialWall removed (MemorialWall kept)
  - Remaining: OrganizationsDirectory ↔ ResistanceDirectory page
- [x] **Move hardcoded data to JSON files**:
  - [x] EducationalResources.jsx `modules`/`resources`/`categories` arrays → educational_modules.json ✅ (Session 141)
  - [x] TakeAction.jsx `actions` array (~80 lines) → take_action_steps.json with icon mapping ✅ (Session 143)
  - ✅ CommunitySupport.jsx `supportRequests` array — removed entirely (Session 140)
  - ✅ IntelligenceFeeds.jsx `rssFeeds` — already in liveDataService.js
  - [x] liveDataSources.js feed config → live_data_feeds.json ✅ (Session 146)

---

## 🟠 MEDIUM-TERM (1-3 months)

### New Features
- [x] **Video Testimonials**: ✅ Phase 1 (Session 218): VideoTestimonials component — 10 verified survivor/advocate testimony videos with consent tracking, content warning gates, category/region/search filters, Tier 1-2 source links (BBC, PBS, Al Jazeera, Uyghur Tribunal, CNN, NYT). Privacy-first (no embedded players). Integrated into Education Media tab. Phase 2: Embedded player support (privacy-preserving).

### Technical Improvements
- [x] **Offline Mode**: ✅ Service worker enhanced (Session 155): multi-strategy caching (cache-first for hashed assets, network-first for navigation, stale-while-revalidate for static files). Precaches app shell + icons. Offline page enhanced with cached page links. Bumped to v3.
- [x] **Push Notifications**: ✅ Phase 1 (Session 217): NotificationCenter component — centralized notification hub aggregating emergency alerts, platform updates, and sanctions data. 4 notification categories with filters, browser push permission management, service worker v3 integration, per-category preferences with localStorage persistence, search, expandable cards. Privacy-first (no server tracking). ✅ Phase 2 (Session 234): pushService.js frontend module (subscribe/unsubscribe/status), Web Push API integration ready. Server-side push endpoint documented in `guides/WEB_PUSH_SETUP.md`. Requires VAPID key generation + Cloudflare KV/Supabase for subscription storage.
- [x] **Analytics Dashboard**: ✅ Phase 1 (Session 199): ContentAnalytics component — privacy-respecting content metrics dashboard aggregating insights from all 8 datasets. No user tracking. Integrated into Education Research tab. Phase 2: Server-side usage analytics (if needed).
- [x] **API Development**: Create public API for researchers to access data — ✅ Phase 1 (Session 197): Client-side `dataApi.js` module with structured access to all 8 datasets + search/filter/cross-dataset queries. ✅ Phase 1.5 (Session 200): Interactive API reference documentation (DataApiDocs component). ✅ Phase 2 (Session 234): Cloudflare Workers REST API (`api/worker.js`) with 13 dataset endpoints, CORS, rate limiting (100 req/min), query filters (q, region, category, limit, offset), global search. Falls through to SPA for non-API routes. Setup guide: `guides/CLOUDFLARE_WORKERS_API_SETUP.md`.
- [ ] **Backup System**: Automated backups of all content
- [ ] **Load Testing**: Ensure platform can handle traffic spikes
- [ ] **CDN Integration**: Faster global content delivery

### Community Features
- [ ] **Discussion Forums**: Moderated forums for activists to connect
- [ ] **Mentorship Matching**: Connect experienced activists with newcomers
- [ ] **Skill Sharing**: Platform for activists to offer/request skills
- [ ] **Local Chapter Support**: Tools for organizing local groups
- [ ] **Secure Messaging**: End-to-end encrypted messaging (if feasible)

---

## 🟡 LONG-TERM (3-12 months)

### Major Features
- [ ] **Mobile Native App**: React Native app for iOS and Android
- [x] **AI-Powered Disinformation Detection**: ✅ AIDisinfoDetector component (Session 70)
- [ ] **Automated News Aggregation**: AI-curated news from trusted sources
- [ ] **Virtual Reality Experiences**: Immersive education about detention camps
- [ ] **Blockchain Verification**: Immutable record of documented abuses
- [ ] **Whistleblower Portal**: ✅ Phase 1 (Session 229): WhistleblowerGuide component — 15 operational security protocols across 5 categories (Identity Protection, Secure Communications, Document Handling, Digital Security, Physical Security). 10 verified submission channels (SecureDrop instances at Guardian/WaPo/NYT/BBC, ICIJ, HRW, Amnesty, ASPI, Citizen Lab, Safeguard Defenders). 6 legal protection frameworks (US WPA, EU Directive, UK PIDA, Canada PSDPA, Australia PID Act, UN mechanisms). Cross-references 3 datasets. Integrated into SecurityCenter Guides tab. 49 tests. Phase 2: Secure submission system for leaked documents.
- [x] **Legal Case Tracker**: ✅ LegalCaseTracker component — 25 cases, 14 jurisdictions (Session 214)
- [x] **Sanctions Impact Tracker**: ✅ SanctionImpactAnalyzer component — 34 officials, 47 sanctions (Session 207)
- [x] **Corporate Accountability Scores**: ✅ Phase 1 (Session 219): SupplyChainRiskMapper component — automated risk classification of 30 companies (Critical/High/Moderate/Low) cross-referencing forced labor data, sanctions, and 5 legislative frameworks (UFLPA, EU CSDDD, UK/Canada/Australia Modern Slavery Acts). Industry breakdown, legal landscape, expandable evidence cards. Phase 2: Scoring methodology with weighted factors.
- [x] **Transnational Repression Tracker**: ✅ Session 221: TransnationalRepressionTracker component — cross-references 30 police stations, 25 legal cases, and 30 international responses to map CCP overseas operations. Threat-level classification per country, government response tracking, 3 analytical views (Threat Overview, Operations Map, Government Responses). Integrated into Intelligence CCP Operations tab. 38 tests.
- [x] **Diaspora Security Advisor**: ✅ Session 222: DiasporaSecurityAdvisor component — personalized security guidance for diaspora communities across 42 countries. Cross-references 30 police stations, 30 international responses, and 25 legal cases to assess per-country risk levels. Activity-specific safety tips for 6 activity types (Protests, Online Activism, Journalism, Legal Advocacy, Community Organizing, Academic Research). Integrated into Security Center Diaspora tab. 32 tests. Also fixed InteractiveTimeline year label overlap.
- [x] **Media Narrative Tracker**: ✅ Session 223: MediaNarrativeTracker component — tracks 12 CCP propaganda narratives across 5 categories (Denial, Deflection, Whataboutism, Reframing, Intimidation). Each narrative cross-referenced with verified evidence from 7 datasets. Evidence-based debunks with counter-source links, narrative timeline, frequency classification. Integrated into Intelligence CCP Operations tab. 31 tests.
- [x] **Genocide Legal Framework**: ✅ Session 224: GenocideLegalFramework component — maps 12 documented CCP violations to 5 international legal instruments (UN Genocide Convention Articles II(a)-II(e), Convention against Torture, ICCPR, ILO Forced Labor Conventions, UN Minority Rights Declaration). 10 genocide recognition entries (governments + tribunals). Cross-references 7 datasets. Legal text display, severity classification, evidence cross-referencing. Integrated into Intelligence CCP Operations tab. 44 tests.
- [x] **Diplomatic Coercion Tracker**: ✅ Session 226: DiplomaticCoercionTracker component — maps 44 CCP coercion incidents across 17 countries (Australia, Lithuania, Canada, Norway, South Korea, Sweden, Czech Republic, UK, Netherlands, Japan, Philippines, Mongolia, Germany, France, India, New Zealand, Taiwan). 5 coercion types (Trade Restrictions, Hostage Diplomacy, Diplomatic Threats, Economic Leverage, Political Interference). 3-view analysis (Country Overview, Coercion Tactics, Response Outcomes). Cross-references 4 datasets. Integrated into Intelligence CCP Operations tab. 43 tests.
- [x] **Censorship Circumvention Guide**: ✅ Session 227: CensorshipCircumventionGuide component — documents 18 CCP internet censorship methods across 5 categories (Great Firewall, Content Filtering, VPN Crackdowns, Social Media Monitoring, Infrastructure Control) and evaluates 10 circumvention tools with safety ratings (Tor, Signal, Psiphon, Tails, Briar, Proton Mail, obfs4, V2Ray, WireGuard, Lantern). 3-view analysis (Censorship Methods, Circumvention Tools, Safety Guide). Cross-references 3 datasets. Integrated into Intelligence CCP Operations tab. 42 tests.

### Research & Documentation
- [ ] **Oral History Project**: Recorded testimonies from survivors
- [ ] **Academic Partnership**: Collaborate with universities for research
- [ ] **Annual Report**: Comprehensive yearly report on CCP human rights abuses
- [x] **Policy Recommendations**: ✅ Phase 1 (Session 220): PolicyBriefGenerator component — evidence-based briefs for 4 audiences (Legislators, Diplomats, Corporate Compliance, Civil Society) across 6 topic areas, cross-referencing 8 datasets. Integrated into Take Action page. Phase 2: PDF export, multilingual briefs.
- [x] **Legal Analysis**: ✅ Phase 1 (Session 224): GenocideLegalFramework component — international law analysis mapping CCP actions to treaty obligations. Phase 2: ICJ proceedings tracker, advisory opinion analysis.
- [ ] **Economic Impact Studies**: ✅ Phase 1 (Session 228): EconomicImpactAnalyzer component — analyzes economic impact of CCP forced labor across 30 companies in 6 industry sectors (Apparel, Electronics, Retail, Technology, Automotive, Food & Beverage). 8 legislative frameworks mapped (UFLPA, EU CSDDD, EU FLR, UK/Canada/Australia Modern Slavery Acts, US Tariff Act s307, Japan HRDD Guidelines). WRO tracking, trade value estimates, risk classification. Cross-references 4 datasets. Integrated into Intelligence CCP Operations tab. 46 tests. Phase 2: Quantitative impact scoring methodology.

### Internationalization
- [ ] **Full Translation**: Complete translation into 10+ languages
- [ ] **Regional Editions**: Localized content for different regions
- [ ] **Cultural Adaptation**: Ensure content is culturally appropriate
- [ ] **Local Partner Integration**: Connect with regional organizations
- [ ] **Multilingual Support Team**: Volunteers for each language

### Platform Evolution
- [ ] **Decentralized Architecture**: Explore decentralized hosting for censorship resistance
- [ ] **Mirror Sites**: Multiple domain mirrors for accessibility
- [ ] **Tor Hidden Service**: .onion address for anonymous access
- [ ] **IPFS Integration**: Distributed content storage
- [ ] **Open Source Community**: Build contributor community

---

## 🟢 PERPETUAL / ONGOING

### Daily Tasks
- [ ] Monitor news for breaking developments
- [ ] Update urgent alerts as needed
- [ ] Check for reported bugs or issues
- [ ] Respond to community feedback
- [ ] Verify new information before adding

### Weekly Tasks
- [ ] Update political prisoner database with new cases
- [ ] Add new events to calendar
- [ ] Review and update sanctions tracker
- [ ] Check all external links for broken URLs
- [ ] Update countdown timers for upcoming dates
- [ ] Review security advisories

### Monthly Tasks
- [ ] Comprehensive content audit
- [ ] Update statistics and metrics
- [ ] Add new research papers and reports
- [ ] Review and update FAQ
- [ ] Performance monitoring and optimization
- [ ] Accessibility review
- [ ] Security audit
- [ ] Backup verification

### Quarterly Tasks
- [ ] Major feature releases
- [ ] User feedback survey
- [ ] Partner organization outreach
- [ ] Content strategy review
- [ ] Technology stack evaluation
- [ ] Legal compliance review

### Annual Tasks
- [ ] Comprehensive platform audit
- [ ] Annual report compilation
- [ ] Strategic planning
- [ ] Major version release
- [ ] Community celebration/recognition

---

## 📋 FEATURE IDEAS BACKLOG

### User Requests (to be prioritized)
- [ ] ~~Email newsletter subscription~~ — **DEFERRED by owner** (decide later)
- [ ] RSS feed for platform updates
- [x] ~~Embeddable widgets for other websites~~ ✅ (Session 234: EmbedWidget component — prisoner cards, statistics badges, alert banners with inline HTML/CSS, no JS required. CC BY 4.0 attribution auto-included.)
- [ ] Browser extension for quick access
- [ ] Desktop app (Electron)
- [ ] Voice assistant integration
- [ ] Accessibility mode toggle
- [ ] Reading mode for long content
- [ ] Annotation/highlighting tools
- [ ] Personal notes feature

### Experimental Ideas
- [ ] Gamification expansion (badges, leaderboards)
- [ ] AR experiences for protests
- [ ] AI chatbot for FAQ
- [ ] Machine translation for user content
- [ ] Sentiment analysis of news coverage
- [ ] Network visualization of CCP influence
- [ ] Predictive analytics for threat assessment
- [ ] Crowdsourced verification system

### Integration Ideas
- [ ] Social media auto-posting
- [ ] Calendar app sync
- [ ] Task manager integration
- [ ] ~~Email client integration~~ — **DEFERRED by owner** (decide later)
- [ ] Slack/Discord bots
- [ ] Telegram channel
- [ ] WhatsApp broadcast
- [ ] Signal group integration

---

## 🔧 TECHNICAL DEBT

### Code Quality
- [x] ~~Refactor large components into smaller modules~~ ✅ (81+ lazy-loaded sub-components across pages)
- [x] ~~Add TypeScript for type safety~~ ✅ (100% TypeScript — 0 .js/.jsx files, 360 .ts/.tsx files)
- [x] ~~Implement comprehensive testing (unit, integration, e2e)~~ ✅ (895 tests across 51 files, all 17 JSON data files, all 4 forms, all 3 hooks, key components tested)
- [ ] Document all components with JSDoc
- [x] ~~Create component library/design system~~ ✅ (STYLE_GUIDE.md + 8 automated checks)
- [x] ~~Standardize error handling~~ ✅ (ErrorBoundary + RouteErrorBoundary)
- [x] ~~Implement logging system~~ ✅ (Centralized `src/utils/logger.ts` — 4 levels, context prefixes, environment-gated. All 27 console.* calls migrated from 14 files. 8 tests.)

### Infrastructure
- [ ] Set up staging environment
- [x] ~~Implement CI/CD improvements~~ ✅ (GitHub Actions deploy.yml to Cloudflare Workers)
- [x] ~~Add automated security scanning~~ ✅ (CodeQL via GitHub, 0 alerts)
- [ ] Set up monitoring and alerting
- [x] ~~Implement rate limiting~~ ✅ (Session 234: 100 req/min per IP in api/worker.js, API key bypass)
- [ ] Add DDoS protection (Cloudflare provides basic protection)
- [x] ~~Configure proper caching headers~~ ✅ (public/_headers with security + cache headers)

### Backend Cleanup
- [x] ~~**Remove socket.io from backend**~~ ✅ (Session 118: socket.io dep + 3 socket files removed. Session 120: 6 stub routes removed, README updated.)
- [ ] **Audit backend dependencies** — Run `npm audit` when backend is next active.

### Documentation
- [x] ~~Create developer documentation~~ ✅ (ARCHITECTURE.md + README.md)
- [x] ~~Write contribution guidelines~~ ✅ (CONTRIBUTING.md)
- [x] ~~Document API endpoints~~ ✅ (Session 234: REST API reference in DataApiDocs component + guides/CLOUDFLARE_WORKERS_API_SETUP.md)
- [x] ~~Create user guides~~ ✅ (guides/ folder: API setup, Web Push, Custom Domain, Supabase DB management)
- [x] ~~Write security documentation~~ ✅ (SecurityCenter page + SUPABASE_SETUP.md + CLOUDFLARE_DEPLOY.md)
- [x] ~~Maintain changelog~~ ✅ (archived — session notes serve this purpose)

---

## 📊 METRICS TO TRACK

### Platform Health
- Page load times
- Error rates
- Uptime percentage
- Mobile vs desktop usage
- Browser distribution
- Geographic distribution

### User Engagement
- Daily/monthly active users
- Pages per session
- Time on site
- Return visitor rate
- Feature usage rates
- Search queries

### Impact Metrics
- Petitions signed
- Letters sent
- Actions completed
- Resources downloaded
- Social shares
- Media mentions

---

## ✅ HUMAN DECISIONS — ALL RESOLVED

> All D1-D5 answered and implemented. See `_agents/archive/QUESTIONS_FOR_HUMANS.md` for details.
> **Standing instruction:** Agents may add individuals to the database without asking, as long as well-researched with verified sources and consistent with project goals.

---

## 🎯 CURRENT SPRINT

### Up Next
1. **🔴 Page simplification** — ✅ COMPLETE (Session 137-149). All priority pages done:
   - **✅ DONE:** TakeAction (15→11, CompanyTracker+VolunteerSignup+DiasporaSupport added), EducationalResources (17→18, +AcademicExperts+MediaBiasGuide+HistoricalDocuments+EventCalendar+SurvivorStories), IntelligenceFeeds (11→9, ResearchDashboard moved in, feed truncation, RSS→JSON), SecurityCenter (8→9, +LegalResourcesHub+ReportSighting+ContactForm)
   - **✅ DONE:** CommunitySupport (10→0, ALL 6 components redistributed S149), Dashboard (8→5, urgentCampaigns removed, quickActions 4→3, ResearchDashboard moved out), PoliticalPrisoners (motion removed, truncation added, modal streamlined), DataSources (motion removed, DataExport added)
   - **✅ DONE:** ResistanceResources (10→2, 5 components redistributed to other pages S148)
   - **✅ DONE:** EmergencyAlerts→JSON (21st data file, Session 149)
   - **✅ DONE:** framer-motion completely removed — dependency uninstalled, vendor bundle eliminated (Session 144)
   - **LOW:** ResistanceDirectory (keep as-is)
   - **Cross-cutting complete:** All data→JSON migrations done ✅ (21 JSON files), framer-motion eliminated ✅, Community fully merged ✅
2. **Navigation simplification** — ✅ Session 136: sidebar 11→7 items, width w-64→w-56
3. **ESLint cleanup** — ✅ Session 148: 0 errors + 0 warnings. Split mixed component/non-component exports: LanguageSelector→languageUtils.js+LanguageContext.jsx, ThemeContext→themeUtils.js+ThemeContext.jsx.
4. **Content updates** — ✅ Session 147-151: Jimmy Lai fraud appeal overturned Feb 26, 2026 added. Joshua Wong HK47 appeal dismissed Feb 2026, foreign collusion proceedings ongoing. Kwok Yin-sang case added (first family prosecution, Feb 2026). Sanctions verified current. Session 151: Added NSL arrest statistics (386 arrested, 176 convicted), UFLPA entity list count (144 companies), UN Jan 2026 forced labor report, HK47 appeal dismissal Amnesty response. Gao Zhisheng profile enriched with wife's Capitol Hill testimony.
5. **Backend connection Phase 2** — Supabase client + service layer done ✅. Remaining: add Supabase Auth for admin

### What Needs Human Decisions
1. ~~Email service choice for forms~~ — **DEFERRED by owner** (Feb 25, 2026): "Let's delay the email part until a lot later, I'll look into and decide at a later date"
2. Whether to implement backend cache system or remove documentation referencing it
3. Priority ranking for medium-term features

---

## 📝 NOTES

### Design Principles
1. **Verifiable**: All information must be sourced and fact-checked
2. **Accessible**: Works for users of all abilities and technical levels
3. **Secure**: Protects user privacy and safety
4. **Actionable**: Every page should lead to concrete actions
5. **Comprehensive**: One-stop resource for all anti-CCP activism needs

### Standing Instructions from Humans
- **Adding people to site:** Agents may add individuals without asking, as long as well-researched with verified sources (Tier 1: BBC, Reuters, AP, HRW, Amnesty, CPJ, OHCHR, government records; Tier 2: HKFP, RFA, NCHRD, Safeguard Defenders, CHRD)
- **CCP source exclusion:** Never cite CCP state/party media. Use `isCCPStateMedia()` from `src/utils/sourceLinks.js` — the centralized CCP influence detection registry
- **CCP terminology:** Always use "CCP" (Chinese Communist Party), NEVER "CPC" (Communist Party of China). The CCP promotes "CPC" to dilute critical search results. Automated test in url-health.test.js enforces this.
- **Date verification:** Always cross-reference dates with 2+ independent sources
- **Profile template:** Follow established pattern (5 tabs: Timeline, Charges/Significance, CCP Narrative Analysis, International Response/Legacy, Sources)

---

## 📂 RELATED TODO FILES

| File | Focus | Status |
|------|-------|--------|
| **TODO_COMPLETED.md** | Archive of all completed tasks + session history | Reference only |
| **archive/SIMULATED_DATA_CLEANUP_TODO.md** | Remove all fake/simulated data | ✅ ALL COMPLETE (archived) |
| **planning/SITE_CLEANUP_TODO.md** | UI readability, emoji reduction, page consolidation | ~99% complete |
| **TODO.md § PAGE SIMPLIFICATION** | Per-page component reduction tasks (this file) | 🔴 NEW — Session 137 |

---

## 🚀 QUICK START FOR NEW AGENTS

### Essential Reading (in order)
1. **This file (TODO.md)** — What's active, what's next, standing instructions
2. **TODO_COMPLETED.md** — Archive of everything already done
3. **AGENTS.md** — Agent roles, capabilities, protocol, CodeQL troubleshooting
4. **STYLE_GUIDE.md** — Terminal design system reference
5. **AGENT_HANDOFF.json** — Machine-readable state snapshot
6. **thoughts/** — Session-by-session decision logs

### Current State Summary (as of Session 263, Mar 10, 2026)
- **Frontend:** React 19 + Vite 7 + Tailwind, 10 pages + 15 profiles, 108+ components, 3602 tests (192 files, all passing). **100% TypeScript** — 360+ .ts/.tsx files, 0 .js/.jsx.
- **Build:** 310KB (99KB gzip), ~5.7s build time. 0 TSC errors, 0 ESLint errors, 0 npm vulnerabilities, 0 CodeQL alerts.
- **Design:** Terminal/ASCII aesthetic 100% applied. 10+ automated design system compliance checks. Square corners only, terminal green (#4afa82), WCAG AA contrast throughout.
- **Navigation:** 7 nav items (Dashboard, Intelligence, Political Prisoners, Profiles, Take Action, Education, Security). Sidebar w-56. Breadcrumbs, Back to Top, keyboard shortcuts (`/` search, `?` help).
- **Data:** 63 political prisoners, 47 sanctions, 34 officials, 30 forced labor companies, 38 timeline events, 31 news items, 65 recent updates. 20 JSON data files. All data verified with Tier 1-2 sources.
- **Analytical Tools:** 15+ major components built (LegalCaseTracker, SanctionImpactAnalyzer, TransnationalRepressionTracker, DiasporaSecurityAdvisor, MediaNarrativeTracker, GenocideLegalFramework, DiplomaticCoercionTracker, CensorshipCircumventionGuide, EconomicImpactAnalyzer, WhistleblowerGuide, PolicyBriefGenerator, and more).
- **Languages:** 8 locales (en, zh-CN, zh-TW, vi, ko, ja, ug, bo)
- **Security:** 9 headers. Supabase Auth admin login. Service_role key detection. WebRTC leak check.
- **Profile Pages:** 15/15 built with 5-tab layout each. Region filter tabs.
- **Emergency Alerts:** 5 active (Jimmy Lai 20yr, Joshua Wong collusion, HK47, Kwok family, Uyghur forced labor). Auto-expiry, event countdown, severity sorting.
- **API:** REST API via Cloudflare Workers (13 endpoints, rate limiting). Client-side dataApi module.
- **Offline:** Service worker v3 with multi-strategy caching.
- **Content (Mar 10):** Tibetan Uprising Day data added. China-Canada sanctions added. HRW World Report 2026 added. Joshua Wong hearing (Mar 6) — monitoring for outcome.

---

*Active tasks only. For completed work and session history, see `_agents/TODO_COMPLETED.md`.*
