# Global Anti-CCP Resistance Hub — Active To-Do List

> Last Updated: March 5, 2026 (Session 203)
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
- [ ] **Cloudflare Onion Routing (Q9)**: ⚠️ DEFERRED — Human reports no onion routing option visible in Cloudflare dashboard. Root cause: Onion Routing requires a custom domain (not available for `workers.dev` subdomains). Setup guide updated in `ONION_ROUTING_SETUP.md`. Will revisit when custom domain is added. See Q12.

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
- [x] **Monitor Jimmy Lai appeal proceedings** — ✅ Updated Session 147
  - ✅ Dec 15, 2025: Found guilty on all 3 NSL charges
  - ✅ Feb 9, 2026: Sentenced to 20 years (harshest NSL sentence)
  - ✅ Feb 26, 2026: Fraud conviction overturned on appeal (separate case)
  - Subtask: Watch for NSL sentence appeal filing
  - Subtask: Monitor health status and UN appeals
- [x] **Monitor Joshua Wong case** — ✅ Updated Session 150
  - ✅ Jun 6, 2025: New foreign collusion charge filed (max: life imprisonment)
  - ✅ Feb 14, 2026: HK47 appeal dismissed — 4yr 8mo sentence upheld
  - Subtask: Monitor foreign collusion trial proceedings
- [x] **Add Kwok Yin-sang case** — ✅ Session 150
  - First family member prosecuted under Article 23 (Feb 26, 2026)
  - Father of US-based activist Anna Kwok, sentenced 8 months
  - Added to political_prisoners_research.json + emergency_alerts.json
- [x] **Simulated Data Phase 2**: ✅ ALL COMPLETE (5/5 fully migrated to JSON)
  - ✅ PoliticalPrisoners page → political_prisoners_research.json (DONE)
  - ✅ ForcedLaborTracker → forced_labor_companies_research.json (DONE)
  - ✅ DetentionFacilities → detention_facilities_research.json (DONE — Session 89, 11 facilities with coordinates/capacity/evidence)
  - ✅ CCPOfficials → sanctioned_officials_research.json (DONE — Session 90, JSON enriched with biographical data, hardcoded array removed)

### Bug Fixes & Polish
- [x] **Mobile responsiveness**: Touch targets, font sizing, iOS zoom prevention (Session 93)
- [x] **Mobile navigation**: 13 tests added for hamburger menu (Session 149) — toggle, 7 nav items, backdrop close, active state, urgent campaign, branding
- [x] **Dark mode**: Theme CSS variables + Tailwind overrides for light/high-contrast (Session 121)
- [x] **Sort By for Live Feed (Session 155)**: Added "Sort by" dropdown to Intelligence Feeds page — Relevancy (default), Newest First, Oldest First. Integrated with existing search + source filter. 6 tests added.
- [x] **Dashboard usability (Session 160)**: Emergency alerts collapse after 2 (show more button), QuickStartGuide converted from blocking modal to non-blocking bottom-right toast, removed duplicate hardcoded Jimmy Lai alert.
- [x] **Breadcrumbs + Back to Top (Session 161)**: Auto-generated breadcrumb navigation on all sub-pages (e.g., `home > Profiles > Jimmy Lai`). Back to Top floating button appears after 400px scroll. 61 new tests for 7 components (BackToTop, Breadcrumbs, QuickStartGuide, ProtectedRoute, CaseStudies, WorldThreatMap, SearchWrapper).
- [x] **RecentUpdates changelog (Session 166)**: Dashboard widget showing chronological feed of 12 verified data changes (new cases, sanctions, case updates, reports). Category badges (ALERT, DATA, VERIFIED, CASE, NEW, REPORT), "show more" pattern (5 initially), links to related pages. New `recent_updates.json` data file (22nd JSON). 25 tests. Replaced auto-generated RecentActivity with curated editorial approach.
- [x] **Region filter tabs on Profiles page (Session 167)**: Filter profiles by Hong Kong (6), Mainland China (5), Uyghur & Tibet (3), Cross-Border (1). Accessible tablist/tabpanel with counts and aria-selected state. Dual Session 166 discrepancy fixed (test count 1933→1936). 11 new filter tests (1947 total).
- [x] **Usability & contrast overhaul (Session 168)**: Per human request — reduce cognitive load, improve separation/contrast on every element. Dashboard spacing increased (space-y-6→space-y-8), section label headers added (Recent Updates, Live News, Security Tools, Statistics, News Digest), stat cards get colored left-borders for visual categorization, Detention Timer gets red urgency border. Fixed ALL low-contrast decorative text (text-[#1c2a35]→text-slate-600/700) across App.jsx, Footer.jsx, Breadcrumbs.jsx, Dashboard.jsx. Standardized entire codebase from text-gray-* → text-slate-* (8 files). PoliticalPrisoners stat cards get borders + colored urgency borders. All tab bars improved with background fill. Resource cards get borders. Modal gets border. Emergency contacts get borders. Intelligence/Education/Security pages spacing increased. All 1947 tests pass.
- [x] **Deep usability pass (Session 169)**: Continued Session 168 overhaul. Standardized spacing: space-y-6 → space-y-8 on 46 top-level component/page containers (28 components, 11 profile pages, 7 main pages). Improved text contrast: text-slate-500 → text-slate-400 for ALL readable labels/text across 72 files (field labels like "Location:", "Sentence:", "Date", timestamps, descriptions, Chinese names, metadata, helper text). Kept slate-500 only for decorative icons, disabled states, and pipe separators. Breadcrumbs navigation text upgraded for visibility. All 1947 tests pass.
- [x] **Per-source progressive loading (Session 171)**: Intelligence feeds now show per-source loading progress during fetch. Added onSourceDone callback to fetchFeedsProgressively(), loadedSources tracking in useLiveFeeds hook. Loading banner shows "X of 9 sources loaded" with real progress bar and per-source checkmarks. Source filter buttons show loaded indicator. Fixed Dashboard intelligence overview to import actual FEED_SOURCES (was hardcoding 4 sources, now shows all 9 dynamically). Added Dashboard section landmarks (5 sections with id + aria-labelledby) and jump navigation bar. 1959 tests (132 files, all passing).
- [x] **EventCountdown + ESLint fixes (Session 172)**: Fixed 3 ESLint errors from Session 171 (unused fetchAllFeeds import, unused onSourceDone params). New EventCountdown component shows live countdown (days/hours/minutes/seconds) to emergency alert events with eventDate field. Integrated into EmergencyAlerts — Joshua Wong hearing shows "02d XXh XXm XXs" countdown to March 6. calculateTimeLeft() utility added to dateUtils.js. Terminal-styled with yellow #fbbf24 countdown blocks. Shows "Event today" with pulsing red on event day. 13 new tests. 1972 tests (133 files, all passing).
- [x] **Alert sharing + Data freshness (Session 173)**: Added hashtags field to all 6 emergency alerts (e.g. #FreeJoshuaWong, #FreeJimmyLai, #FreeUyghurs). New Copy/Share button on each alert — copies formatted text with emoji, summary, link, and hashtags to clipboard for social media. New formatAlertForSharing() utility. New DataFreshnessIndicator component shows color-coded "Verified X days ago" badges (green ≤7d, yellow 8-30d, red >30d). Integrated into PoliticalPrisoners page header. daysSince() and getFreshnessInfo() utilities added to dateUtils.js. 29 new tests. 2001 tests (134 files, all passing).
- [x] **Remove all hashtags (Session 174)**: Per human request — hashtags are considered performative activism. Removed hashtags from: emergency_alerts.json (all 6 alerts), formatAlertForSharing() utility, ShareButtons.jsx (prop + display + Twitter URL param), QuickFacts.jsx (all 8 facts + clipboard + twitter text + usage tips), UrgentCaseTimer.jsx (all 4 cases + share text), CaseStudies.jsx (data + rendering), ActivistToolkit.jsx (Hashtag Guide → Social Media Guide), PrintableReport.jsx, TakeAction.jsx, ccpTactics.js, recent_news_research.json, PoliticalPrisoners.jsx, VictimStories.jsx, EventCalendar.jsx, IlhamTohtiProfile.jsx, JimmyLaiProfile.jsx, and 2 emergency alert detail texts. Share functionality preserved — just without hashtags. 20 files changed. Tests updated. 1999 tests (134 files, all passing).
- [x] **Data hygiene + Alert sorting + Timer accessibility (Session 175)**: Taiwan PLA alert deactivated (expired 9 months ago). EmergencyAlerts now sorts by severity (critical → warning → info) so most urgent alerts always appear first. UrgentCaseTimer enhanced: added `role="timer"` + `aria-label` to all detention counters (both compact and full), added "Detained since" formatted date (e.g. "December 3, 2020") with Calendar icon. 6 new tests (severity sort, Taiwan exclusion, ARIA timer role, aria-labels, detained-since dates). 2005 tests (134 files, all passing).
- [x] **LiveStatistics data→JSON + design fix (Session 176)**: Extracted 8 inline statistics from LiveStatistics.jsx → live_statistics.json (23rd JSON data file). Each statistic now has sourceUrl and lastVerified fields for data provenance. Fixed design system violation: source attribution text was text-slate-600 (below minimum), corrected to text-slate-400. ICON_MAP pattern resolves icon name strings to Lucide components. 13 new data validation tests (structure, uniqueness, URL safety, CCP source exclusion, CPC terminology check). 2018 tests (135 files, all passing).
- [x] **Real data export for researchers (Session 177)**: DataExport component now exports REAL data from 7 JSON files (was placeholder text). New exportUtils.js with extractRecords() (handles results[].output, flat array, sanctions[] patterns), recordsToCsv() (proper CSV with escaping), recordsToMarkdown() (markdown tables with pipe escaping + truncation). Dataset record counts now dynamic from JSON. Confucius Institutes dataset removed (no separate JSON file — data is part of organizations). 25 new tests (unit + real data integration). 2043 tests (136 files, all passing).
- [x] **Design system enforcement + text contrast fixes (Session 178)**: Fixed 10 remaining text-slate-500 violations across 8 files (App.jsx, RecentUpdates, WorldThreatMap, SecurityQuiz, AdminDashboard, KeyboardShortcutsHelp, Dashboard, SecurityCenter). All readable text now uses text-slate-400 or brighter. Removed duplicate CSS class on AdminDashboard table headers. New automated design system test enforces text-slate-500 rules (allowed only for decorative icons, disabled states, pipe separators, bullet decorators). Added recent_updates.json entry for Session 177 data export. 2045 tests (136 files, all passing).
- [x] **URL validation + data verification (Session 179)**: New url-validation.test.js with 6 tests: validates all URLs in 19 JSON data files are well-formed, have no formatting artifacts, no localhost/dev endpoints, and data provenance checks. Updated lastVerified dates across emergency_alerts.json and live_statistics.json (→2026-03-04). Added recent_updates.json entry for Session 178 design system work. Fixed RecentUpdates test to handle "show more" threshold with 14 entries. 2051 tests (137 files, all passing).
- [x] **No-hashtags policy + design enforcement + DataSources tests (Session 180)**: New no-hashtags-policy.test.js (5 tests): automated enforcement of user's no-hashtags policy — scans all JSX/JS source files and JSON data files for activist hashtag patterns, verifies no "hashtags" field in data, verifies ShareButtons has no hashtags prop. New 10th design system check: text-slate-600/700/800/900 only allowed for aria-hidden, decorative icons, disabled states, select-none, separators. Fixed 3 readable-text contrast violations (AdminLogin, AdminDashboard, Dashboard). New DataSources.test.jsx (15 tests): first test coverage for DataSources page (header, commitment, RSS feeds, categories, export, docs, issues). Added recent_updates.json entry (15 entries total). 2072 tests (139 files, all passing).
- [x] **Profile page test coverage (Session 181)**: New profile-pages.test.jsx (144 tests): first dedicated test coverage for all 15 political prisoner profiles. Tests: renders without crashing, displays name/Chinese name, status badge, back navigation, tab structure, Sources tab with CCP source exclusion statement, Timeline default content, ARIA accessibility (tablist/tabpanel/aria-selected), GlobalDisclaimer, no-hashtags compliance, data integrity (unique names, valid statuses). Added recent_updates.json entry (16 entries total). 2216 tests (140 files, all passing).
- [x] **100% page test coverage (Session 182)**: New ResistanceDirectory.test.jsx (22 tests): the last untested page now has dedicated test coverage. Tests: header, stats, search filtering, category pills, dropdown filter, org card expansion/collapse, aria-expanded, no-results state, footer, IPACMembers, GlobalDisclaimer, no-hashtags compliance. Every page and component in the app now has dedicated tests. Added recent_updates.json entry (17 entries total). 2238 tests (141 files, all passing).
- [x] **Cross-JSON data consistency tests (Session 183)**: New cross-data-consistency.test.js (12 tests): validates referential integrity across all 19 JSON data files. Tests: all JSON files loadable, prisoner-alert cross-references (Joshua Wong/Jimmy Lai in both databases), critical alert freshness (lastVerified within 60 days), sanctions-officials overlap, recent_updates route path and category validation, date ordering, detention facility regions, CPC terminology prohibition, non-empty content, forced labor company uniqueness, cross-file date format consistency. Added recent_updates.json entry (18 entries total). 2250 tests (142 files, all passing).
- [x] **Accessibility audit + fixes (Session 184)**: New accessibility-audit.test.js (10 tests): automated accessibility compliance scanning across all JSX source files. Tests: img alt attributes, autoFocus prohibition, icon sizing consistency, tabIndex ordering, target=_blank safety, form input labels, icon-only button aria-labels, landmark structure (App.jsx + Footer.jsx), skip-to-content. Fixed 3 icon-only buttons missing aria-labels: InteractiveTimeline prev/next/play controls, EducationalResources download button. Added recent_updates.json entry (19 entries total). 2260 tests (143 files, all passing).
- [x] **Keyboard navigation audit + fixes (Session 185)**: New keyboard-navigation.test.js (8 tests): modal Escape key enforcement, event listener cleanup validation, aria-modal on role="dialog", clickable div keyboard support, focus-visible styles, skip-to-content, selectedX+overlay pattern enforcement. Fixed 4 components missing Escape key on detail modals (CCPOfficials, CaseStudies, DetentionFacilities, PoliticalPrisoners). Added aria-modal="true" to KeyboardShortcutsHelp dialog. Added recent_updates.json entry (20 entries total). 2268 tests (144 files, all passing).
- [x] **Performance & resilience (Session 186)**: New ShellErrorBoundary component (renders null on error) wraps 4 non-critical shell components: GlobalSearch, KeyboardShortcutsHelp, QuickStartGuide, PWAInstallBanner. Three-tier error boundary architecture: ErrorBoundary (app-level, full-page fallback) → RouteErrorBoundary (route-level, recovery UI for chunk errors) → ShellErrorBoundary (shell-level, silent null). Footer memoized with React.memo. New performance-resilience.test.js (10 tests) enforcing all patterns. Added recent_updates.json entry (21 entries total). 2278 tests (145 files, all passing).
- [x] **Sitemap freshness + countdown robustness (Session 187)**: Updated all 26 sitemap.xml lastmod dates to 2026-03-04. Added sitemap freshness test (rejects lastmod older than 30 days). Hardened calculateTimeLeft() with input validation — malformed dates, non-string types, partial formats now return safe fallback instead of NaN. 9 new calculateTimeLeft unit tests + 1 sitemap freshness test. Added recent_updates.json entry (22 entries total). 2288 tests (145 files, all passing).
- [x] **Route integrity tests (Session 188)**: New route-integrity.test.js (16 tests) validates all internal navigation links match routes in App.jsx. Checks: Link to="" targets in components/pages, recent_updates.json relatedPage entries, Navigate redirect targets, essential route definitions, profile slug format (lowercase, hyphens). Catches broken internal links at test time. Added recent_updates.json entry (23 entries total). 2304 tests (146 files, all passing).
- [x] **Defensive coding audit (Session 189)**: Added null/undefined guards to 7 data-consuming components: LiveStatistics, RecentUpdates, PoliticalPrisoners, CCPOfficials, SanctionsTracker, AcademicExperts, ForcedLaborTracker, DetentionFacilities, SanctionedOfficials. All `.results`, `.sanctions`, `.facilities` access now uses optional chaining with `|| []` fallback. New defensive-coding.test.js (8 tests) enforces guards on all JSON imports — detects unguarded `.map()`, unguarded array spreads, and missing optional chaining. Added recent_updates.json entry (24 entries total). 2312 tests (147 files, all passing).
- [x] **Meta-test coverage audit (Session 190)**: New meta-test-coverage.test.js (17 tests) enforces test discipline: every component has a test file, every page has a test file, profile pages have coverage, test naming convention (PascalCase/camelCase/kebab-case), orphan test detection, lazy-loading enforcement (React.lazy + Suspense + fallback) for all heavy pages, App.jsx route-level lazy loading. Prevents untested components from shipping. Added recent_updates.json entry (25 entries total). 2329 tests (148 files, all passing).
- [x] **Security audit + import hygiene (Session 191)**: New security-audit.test.js (9 tests) — automated scanning for XSS risks: dangerouslySetInnerHTML, eval/Function, innerHTML (limited to PrintableReport print window), document.write, target="_blank" without rel="noopener noreferrer", hardcoded secrets/API keys, HTML-style inline handlers, script tags in JSON data, sensitive storage. New import-hygiene.test.js (7 tests) — tree-shakeable imports, no wildcard imports from large libs, no barrel files for JSON data, no duplicate imports, no test utils in production code, no CommonJS require(). Added recent_updates.json entry (26 entries total). 2345 tests (150 files, all passing).
- [x] **Performance budget + content completeness (Session 192)**: New performance-budget.test.js (9 tests) — enforces growth limits: component count under 100, page count under 20, JSON data files under 30, test file minimum floor (140+), no single JSON file over 100KB, no single component/page over 600 lines, App.jsx lazy-loading enforcement, total source file cap (200). New content-completeness.test.js (8 tests) — validates data quality across all JSON: no placeholder text (TODO/TBD/Lorem ipsum), no empty critical fields (name/title/id), prisoner records have prisoner_name+status, emergency alerts have title+summary+type+active, sanctions have target+country+reason, ISO date format enforcement, no duplicate IDs. Added recent_updates.json entry (27 entries total). 2362 tests (152 files, all passing).
- [x] **ARIA live region audit (Session 193)**: Added role="status" and aria-label="Loading section" to all 7 SectionLoader definitions (Dashboard, EducationalResources, TakeAction, IntelligenceFeeds, ResistanceResources, SecurityCenter, DataSources). Added role="status" to App.jsx LoadingScreen, GlobalSearch searching state, NewsAggregator skeleton, AdminDashboard loading, ProtectedRoute authenticating state. Added aria-hidden="true" to all decorative animate-spin spinners (AIDisinfoDetector, DataExport, IntelligenceFeeds x2, SecurityCenter x2) and cursor block characters (█). New aria-live-regions.test.js (7 tests) enforces: SectionLoaders have role="status", LoadingScreen has role="status", spinners have aria-hidden, search containers have aria-live, loading text has role="status", minimum 8+ components with role="status", decorative █ has aria-hidden. Added recent_updates.json entry (28 entries total). 2369 tests (153 files, all passing).
- [x] **Public data API module (Session 197)**: New `src/services/dataApi.js` — structured access layer for all 8 research JSON datasets. Provides: `getPoliticalPrisoners()`, `getSanctions()`, `getSanctionedOfficials()`, `getTimelineEvents()`, `getForcedLaborCompanies()`, `getDetentionFacilities()`, `getAlerts()`, `getStatistics()`, `getRecentUpdates()`. Each dataset has search, filter-by-field, and find-by-name methods. Cross-dataset: `globalSearch()`, `getHongKongData()`, `getUyghurData()`, `getDatasetSummary()`. New data-api.test.js (46 tests) covers all methods + data integrity (source URLs, no CCP media, no CPC terminology, valid dates). Sitemap lastmod dates refreshed to 2026-03-05. Added recent_updates.json entry (30 entries total). 2415 tests (154 files, all passing).
- [x] **Test coverage cleanup + cross-dataset validation (Session 198)**: Removed orphaned MobileNavigation.test.jsx (229 lines — component was inlined into App.jsx). Added ShellErrorBoundary.test.jsx (7 tests — silent error handling, sibling isolation, null render on error). Added cross-dataset-relationships.test.js (27 tests — API summary consistency, timeline coverage, sanctions multi-country validation, regional data aggregation, prisoner status enums, data quantity thresholds). Updated meta-test-coverage.test.js (removed ShellErrorBoundary exception + MobileNavigation orphan skip). 100% component test coverage achieved. 2436 tests (155 files, all passing).
- [x] **Content Analytics dashboard (Session 199)**: New `src/components/ContentAnalytics.jsx` — privacy-respecting research database metrics dashboard. Uses `dataApi` to aggregate insights from all 8 datasets: dataset summary cards (8), prisoner status breakdown, sanctions by country bar chart, timeline coverage by decade, geographic coverage (HK/Uyghur/Tibet/Mainland), recent data activity timeline. Terminal palette compliant. Lazy-loaded into Education Center Research tab. ContentAnalytics.test.jsx (30 tests). Added recent_updates.json entry (32 entries total). 2466 tests (156 files, all passing).
- [x] **API Reference documentation (Session 200)**: New `src/components/DataApiDocs.jsx` — auto-generated interactive API documentation for the dataApi module. Shows all 16 methods grouped by category (Metadata, Political Prisoners, Sanctions, Officials, Timeline, Cross-Dataset) with descriptions, parameter types, return types, copy-to-clipboard examples, and live data counts. Integrated into Data Sources page. DataApiDocs.test.jsx (28 tests). Added recent_updates.json entry (33 entries total). 2494 tests (157 files, all passing).
- [x] **Data Changelog (Session 201)**: New `src/components/DataChangelog.jsx` — research data provenance and verification tracker. Shows dataset health overview (Fresh/Current/Aging status for all 8 datasets), expandable details per dataset (verification date, file path, notes, days since verified), recent data changes timeline (filtered from recent_updates.json), and source policy disclosure. Integrated into Data Sources page. DataChangelog.test.jsx (22 tests). Added recent_updates.json entry (34 entries total). 2516 tests (158 files, all passing).
- [x] **CCP Influence Network (Session 202)**: New `src/components/InfluenceNetwork.jsx` — cross-dataset relationship visualization showing connections between sanctioned officials, political prisoners, sanctions, detention facilities, forced labor companies, and timeline events across 4 regions (Xinjiang, Hong Kong, Tibet, Central/National). Features: summary stats (6 datasets), region selector with expandable detail panels (officials, prisoners, timeline, sanctions per region), most-sanctioned officials ranking (3+ countries), international sanctions by country breakdown. Terminal palette compliant. Integrated into Intelligence Feeds → CCP Operations tab. InfluenceNetwork.test.jsx (23 tests). Added recent_updates.json entry (35 entries total). 2539 tests (159 files, all passing).
- [x] **Data Comparison Tool (Session 203)**: New `src/components/DataComparisonTool.jsx` — side-by-side regional comparison dashboard for researchers. Compares CCP violation data across 4 regions (Hong Kong, Xinjiang/Uyghur, Tibet, Mainland/National): political prisoners, sanctions, officials, timeline events, detention facilities. Features: comparison table with bar indicators, expandable detail breakdowns (status, country), copy-to-clipboard summary with CC BY 4.0 attribution, 2-3 region selector. Terminal palette compliant. Integrated into Data Sources page. DataComparisonTool.test.jsx (31 tests). Fixed RecentUpdates.test.jsx VERIFIED category to check visible items only. Added recent_updates.json entry (36 entries total). 2570 tests (160 files, all passing).

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
- [ ] **Video Testimonials**: Embedded video interviews with survivors (with consent)

### Technical Improvements
- [x] **Offline Mode**: ✅ Service worker enhanced (Session 155): multi-strategy caching (cache-first for hashed assets, network-first for navigation, stale-while-revalidate for static files). Precaches app shell + icons. Offline page enhanced with cached page links. Bumped to v3.
- [ ] **Push Notifications**: Alert users to breaking news and urgent actions
- [x] **Analytics Dashboard**: ✅ Phase 1 (Session 199): ContentAnalytics component — privacy-respecting content metrics dashboard aggregating insights from all 8 datasets. No user tracking. Integrated into Education Research tab. Phase 2: Server-side usage analytics (if needed).
- [ ] **API Development**: Create public API for researchers to access data — ✅ Phase 1 (Session 197): Client-side `dataApi.js` module with structured access to all 8 datasets + search/filter/cross-dataset queries. ✅ Phase 1.5 (Session 200): Interactive API reference documentation (DataApiDocs component). Phase 2: REST API via Cloudflare Workers.
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
- [ ] **AI-Powered Disinformation Detection**: Tool to analyze articles for CCP propaganda
- [ ] **Automated News Aggregation**: AI-curated news from trusted sources
- [ ] **Virtual Reality Experiences**: Immersive education about detention camps
- [ ] **Blockchain Verification**: Immutable record of documented abuses
- [ ] **Whistleblower Portal**: Secure submission system for leaked documents
- [ ] **Legal Case Tracker**: Track court cases related to CCP abuses worldwide
- [ ] **Sanctions Impact Tracker**: Measure effectiveness of sanctions
- [ ] **Corporate Accountability Scores**: Comprehensive ratings for companies

### Research & Documentation
- [ ] **Oral History Project**: Recorded testimonies from survivors
- [ ] **Academic Partnership**: Collaborate with universities for research
- [ ] **Annual Report**: Comprehensive yearly report on CCP human rights abuses
- [ ] **Policy Recommendations**: Evidence-based policy briefs for governments
- [ ] **Legal Analysis**: International law analysis of CCP actions
- [ ] **Economic Impact Studies**: Research on forced labor in supply chains

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
- [ ] Embeddable widgets for other websites
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
- [ ] Add TypeScript for type safety
- [x] ~~Implement comprehensive testing (unit, integration, e2e)~~ ✅ (895 tests across 51 files, all 17 JSON data files, all 4 forms, all 3 hooks, key components tested)
- [ ] Document all components with JSDoc
- [x] ~~Create component library/design system~~ ✅ (STYLE_GUIDE.md + 8 automated checks)
- [x] ~~Standardize error handling~~ ✅ (ErrorBoundary + RouteErrorBoundary)
- [ ] Implement logging system

### Infrastructure
- [ ] Set up staging environment
- [x] ~~Implement CI/CD improvements~~ ✅ (GitHub Actions deploy.yml to Cloudflare Workers)
- [x] ~~Add automated security scanning~~ ✅ (CodeQL via GitHub, 0 alerts)
- [ ] Set up monitoring and alerting
- [ ] Implement rate limiting
- [ ] Add DDoS protection (Cloudflare provides basic protection)
- [x] ~~Configure proper caching headers~~ ✅ (public/_headers with security + cache headers)

### Backend Cleanup
- [x] ~~**Remove socket.io from backend**~~ ✅ (Session 118: socket.io dep + 3 socket files removed. Session 120: 6 stub routes removed, README updated.)
- [ ] **Audit backend dependencies** — Run `npm audit` when backend is next active.

### Documentation
- [x] ~~Create developer documentation~~ ✅ (ARCHITECTURE.md + README.md)
- [x] ~~Write contribution guidelines~~ ✅ (CONTRIBUTING.md)
- [ ] Document API endpoints (when backend API is deployed)
- [ ] Create user guides
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

### Current State Summary (as of Session 179, Mar 4, 2026)
- **Frontend:** React 19 + Vite 7 + Tailwind, 10 pages + 15 profiles, 80 components, 2051 tests (137 files, all passing)
- **Design:** Terminal/ASCII aesthetic 100% applied. Typography cleanup complete. Design system compliance (9 automated checks) + URL health tests. ALL non-terminal accent colors standardized. Contrast overhaul: ALL decorative text-[#1c2a35] replaced with visible text-slate-600/700 (Session 168). ALL text-gray-* standardized to text-slate-* (Session 168). ALL readable labels upgraded from text-slate-500 to text-slate-400 across 72+ files (Session 169, 178). ALL top-level containers use space-y-8 (Session 169). Session 178: Automated text-slate-500 enforcement test added — catches future violations.
- **Navigation:** Simplified from 11→7 items (Session 136). Sidebar w-56. Breadcrumb navigation on all sub-pages (Session 161). Back to Top floating button (Session 161). Keyboard shortcuts for power users: `/` search, `?` help, `g+d/i/p/r/t/e/s` navigation (Session 164). Dashboard section jump navigation bar (Session 171). Pages /directory, /community, /resources, /data-sources still routable but not in nav. Mobile nav tested (13 tests, Session 149).
- **Intelligence Feeds (Session 171):** Per-source progressive loading with real progress bar (X/9 sources). onSourceDone callback in fetchFeedsProgressively(). loadedSources tracking in useLiveFeeds hook. Dashboard intelligence overview now imports actual FEED_SOURCES (9 sources, was hardcoded 4).
- **Emergency Alerts (Session 172-175):** EventCountdown component integrated — alerts with eventDate field show live countdown (days/hours/minutes/seconds). Joshua Wong hearing countdown active. calculateTimeLeft() utility in dateUtils.js. Shows "Event today" with pulsing red on event day. Session 173: Share/Copy button on each alert — copies formatted text to clipboard. formatAlertForSharing() utility generates clean social media text. Session 174: All hashtags removed per human request (considered performative activism). Share functionality preserved without hashtags. Session 175: Alerts now sorted by severity (critical → warning → info). Taiwan PLA alert deactivated (expired). UrgentCaseTimer enhanced with role="timer" ARIA attributes and "Detained since" formatted dates.
- **Data Freshness (Session 173):** New DataFreshnessIndicator component shows color-coded "Verified X days ago" badges (green ≤7d, yellow 8-30d, red >30d). daysSince() and getFreshnessInfo() utilities in dateUtils.js. Integrated into PoliticalPrisoners page header.
- **Page Simplification:** ALL pages simplified + data extracted + components redistributed. CommunitySupport fully merged: EventCalendar+SurvivorStories→Education, VolunteerSignup+DiasporaSupport→TakeAction, ReportSighting+ContactForm→Security (Session 149). EmergencyAlerts→JSON with auto-expiry (Session 149-150).
- **Usability (Sessions 160-175):** Emergency alerts collapse (top 2 shown, rest behind "show more"). QuickStartGuide is non-blocking toast (was full-screen modal). Duplicate hardcoded Jimmy Lai alert removed. Breadcrumbs auto-generated from URL. Back to Top button after 400px scroll. Keyboard shortcuts with `?` help modal (Session 164). PrintableReport component for offline activist distribution (Session 165). RecentUpdates changelog widget on Dashboard (Session 166). Region filter tabs on Profiles page (Session 167). Session 168: Dashboard section label headers, colored stat card borders, tab bar improvements, resource/modal/contact borders, all decorative text visibility fixed. Session 169: Deep pass — 46 components/pages upgraded to space-y-8, 72 files upgraded readable labels text-slate-500→text-slate-400, breadcrumbs text improved. Session 172: EventCountdown live timer on emergency alerts. Session 173: Alert share buttons + data freshness indicators. Session 174: Hashtags removed from all social sharing (20 files). Session 175: Alert severity sorting, Taiwan alert deactivated, UrgentCaseTimer ARIA + detained-since dates.
- **ESLint:** 0 errors, 0 warnings. LanguageSelector→languageUtils.js+LanguageContext.jsx. ThemeContext→themeUtils.js+ThemeContext.jsx. useGlobalSearch extracted to hooks/ (S147). Session 172: Fixed 3 errors from Session 171.
- **framer-motion:** COMPLETELY REMOVED (Session 144). Dependency uninstalled. vendor-motion bundle eliminated (was 116KB/38KB gzip). Zero framer-motion in any source file.
- **Mobile:** WCAG 2.5.5 touch targets (44px), mobile font bumps, iOS zoom prevention, responsive grids. Hamburger menu tested (13 tests).
- **Accessibility:** All role="button" divs → semantic buttons. 208+ ARIA attributes across 53+ files. Heading hierarchy, SkipLinks i18n (8 languages). WCAG AA contrast. EventCountdown uses role="timer" + aria-labels (Session 172).
- **Backend:** Supabase client + service layer integrated. All 4 forms wired. Email service DEFERRED. Backend socket.io fully removed. Supabase Auth: login/logout/admin check (Session 157). Service_role key detection guard (Session 158).
- **Bundle:** Main bundle 308KB (99KB gzip). Vendor splitting (react, router). No more framer-motion vendor chunk.
- **Profile Pages:** 15/15 built (0 coming soon). Region filter tabs: Hong Kong, Mainland China, Uyghur & Tibet, Cross-Border (Session 167).
- **Data:** 63 political prisoners (incl Kwok Yin-sang), 47 sanctioned entities, 34 officials, 30 forced labor companies, 155+ total entries. All data→JSON migrations complete. 23 total JSON data files (incl live_statistics.json). EmergencyAlerts: 6 alerts with auto-expiry + eventDate countdown + share support — no hashtags (incl Joshua Wong Mar 6 hearing alert, Session 164/172/174). Joshua Wong profile updated through Feb 2026 appeal dismissal. 25 recent news items. 12 centralized statistics (incl HK NSL arrests, UFLPA entity list). Political prisoners count updated to 63 across all components (Session 165).
- **Content:** Sanctions verified current as of Mar 2026. Joshua Wong HK47 appeal dismissed Feb 2026, new foreign collusion charge ongoing (next hearing Mar 6, 2026). Joshua Wong hearing CRITICAL alert with live countdown added (Session 164/172). Kwok Yin-sang case added (first family prosecution under Art 23). Gao Zhisheng profile enriched with wife's Capitol Hill appeal Aug 2025. UN forced labor report Jan 2026 added to news.
- **Languages:** 8 locales (en, zh-CN, zh-TW, vi, ko, ja, ug, bo)
- **Security:** 9 headers. 0 npm vulns. 0 CodeQL alerts. Service_role key detection in supabaseClient.js.
- **Lint:** 0 errors, 0 warnings. 0 npm vulnerabilities.
- **Test Coverage:** ALL 80 components tested. All 23 JSON data files, all 4 Supabase forms, all 5 hooks tested. 0 untested components remain. 2051 tests across 137 files. exportUtils.js: 25 tests (extractRecords, recordsToCsv, recordsToMarkdown + real data integration). Design system: 9 automated compliance checks (Session 178). URL validation: 6 tests across all 19 JSON data files (Session 179).

---

*Active tasks only. For completed work and session history, see `_agents/TODO_COMPLETED.md`.*
