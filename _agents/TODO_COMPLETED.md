# Completed Tasks Archive

> Moved from `TODO.md` to keep the active task list focused and manageable.
> Items here have been completed and verified across Sessions 1-78.
>
> **Active tasks:** See `_agents/TODO.md`

---

## ✅ SHORT-TERM — COMPLETED

### High Priority (All Done)
- [x] **Multilingual Support**: 8 locale files built (en, zh-CN, zh-TW, vi, ko, ja, ug, bo) with 194 keys each, all translated ✅
- [x] **Mobile App Banner**: Add "Add to Home Screen" prompt for PWA installation ✅
- [x] **Accessibility Audit**: WCAG AA contrast ratios verified for all text colors, ARIA labels added to SVGs/buttons, 20 contrast tests added ✅ (Session 59)
- [x] **Performance Optimization**: Implement code splitting for large components ✅ (Sessions 38-39 — lazy-loaded 81 sub-components across 8 pages, all page bundles now under 50KB)
- [x] **SEO Improvements**: Add meta tags, Open Graph tags, structured data for search engines ✅ (index.html already had OG/Twitter/structured data; Session 40 added per-route meta descriptions for all 14 pages)

### Content Updates (Completed)
- [x] **Update Political Prisoners Database**: Add recent arrests and releases (December 2025) ✅
- [x] **News Feed Integration**: Added 9 RSS feeds from trusted sources (HKFP, RFA China/Uyghur/Tibet, Taiwan News, SCMP, HRW, Amnesty, BBC, Guardian, CPJ) ✅
- [x] **Jimmy Lai Case Updates**: Updated with Feb 9, 2026 sentencing (20 years) ✅
  - [x] Fix conviction date errors (2024 → 2025, Dec 19 → Dec 15) across 6 files
  - [x] Fix age errors (77 → 78) across 5 files
  - [x] Update sentence from "faces life" to "20 years" across 20+ files
  - [x] Update status from "GUILTY - AWAITING SENTENCING" to "SENTENCED - 20 YEARS"
  - [x] Add February 9, 2026 sentencing as new timeline event ✅

### Data Verification (All Done)
- [x] **Verify all timeline event dates**: 22 events verified with direct source links
- [x] **Fix Safeguard Defenders report date**: Corrected from 2023-09-14 to 2022-12-04
- [x] **Verify sanctions dates**: Chen Quanguo, Zhu Hailun, Carrie Lam dates confirmed
- [x] **Verify Canada sanctions on Chen Quanguo**: CONFIRMED December 2024 via canada.ca and Canada Gazette ✅
- [x] **Cross-reference Falun Gong death toll**: "4,000+ confirmed deaths in custody" from FDIC; independently corroborated by China Tribunal 2019. Added sourcing note ✅
- [x] **Verify all political prisoner statuses**: Key updates completed ✅
  - [x] Zhang Zhan: Second 4-year sentence CONFIRMED (Sep 2025) via OHCHR, Amnesty, CPJ
  - [x] Xu Zhiyong: Hunger strike CONFIRMED (Oct 4, 2024) via HRW, The Independent, NCHRD
  - [x] Gui Minhai: Sentence ends Feb 2030 CONFIRMED. Location unknown. No consular access
  - [x] Gedhun Choekyi Nyima: 30th anniversary coverage May 2025 CONFIRMED per existing data
  - [x] Joshua Wong: New NSL collusion charges June 2025 CONFIRMED via Amnesty, HKFP
- [x] **Verify academic experts data**: Checked affiliations, current positions. Fixed: Elliot Sperling (deceased 2017), Sophie Richardson (now CHRD), Elizabeth Economy (title updated), Barnett duplicate removed ✅
- [x] **Verify forced labor companies list**: 30 companies cross-referenced with ASPI "Uyghurs for Sale" report ✅
- [x] **Verify Confucius Institute data**: US: 4 remaining, 104 closed. Many rebranded. Via GAO report ✅
- [x] **Deduplicate data files**: Removed Barnett duplicate from academic experts, merged Taiwan Assoc. for HR duplicate ✅

### Expanded Person Profiles (All 12 Built)
- [x] **Jimmy Lai profile page**: Complete timeline from birth to sentencing ✅ (Session 43)
- [x] **Ilham Tohti profile page**: From academic career to life sentence ✅ (Session 44)
- [x] **Gedhun Choekyi Nyima (Panchen Lama) profile page** ✅ (Session 45)
- [x] **Liu Xiaobo profile page** (posthumous) ✅ (Session 46)
- [x] **Joshua Wong profile page** ✅ (Session 47)
- [x] **Gui Minhai profile page** ✅ (Session 54)
- [x] **Additional profiles**: Agnes Chow, Nathan Law, Benny Tai, Cardinal Zen, Gao Zhisheng, Zhang Zhan — all built ✅ (Session 62)
- **Agent note**: Profile pages should be built by Opus 4.6 (fact verification, CCP narrative analysis) with Sonnet 4.5 for UI/layout. Each profile must include direct source links, not just source names.

### Bug Fixes & Polish (Completed)
- [x] **Clipboard error handling**: Added try/catch to 9 components ✅ (Session 68)
- [x] **Print styles**: A4 print stylesheet for profile pages and reports ✅ (Session 68)
- [x] **Modal accessibility**: Added ARIA dialog roles and Escape key to 4 modal overlays ✅ (Session 69)

---

## ✅ MEDIUM-TERM — COMPLETED

### New Features (Done)
- [x] **Interactive Timeline**: Zoomable, filterable timeline of CCP human rights abuses since 1989 ✅
- [x] **Case Study Deep Dives**: Detailed pages for major cases (Jimmy Lai, Ilham Tohti, Panchen Lama) ✅
- [x] **Podcast Player**: In-app podcast player for recommended shows ✅ (PodcastPlayer.jsx in EducationalResources)
- [x] **Reading Progress Tracker**: Track books and articles read in Education Center ✅
- [x] **Campaign Progress Tracker**: Show real-time progress on petitions and campaigns ✅ (CampaignProgress.jsx in TakeAction)
- [x] **Event Map**: Interactive map showing upcoming events worldwide ✅ (EventMap.jsx in CommunitySupport)
- [x] **Diaspora Directory**: Searchable directory of diaspora organizations by location ✅ (DiasporaSupport.jsx in CommunitySupport)
- [x] **Legal Resources Hub**: Country-specific legal information for asylum, immigration ✅ (LegalResourcesHub.jsx in ResistanceResources)
- [x] **Academic Citation Generator**: Generate citations for research papers ✅ (AcademicCitationGenerator.jsx in EducationalResources)

### Content Expansion (Done)
- [x] **Uyghur Forced Labor Database**: Comprehensive list of companies and products ✅ (ForcedLaborTracker.jsx + forced_labor_companies_research.json with 30 companies)
- [x] **Confucius Institute Tracker**: Built and integrated into EducationalResources Tools tab ✅ (Session 70)
- [x] **CCP Officials Database**: Profiles of key officials involved in repression ✅
- [x] **Detention Facility Database**: Built and integrated into IntelligenceFeeds CCP Operations tab ✅ (Session 71)
- [x] **Media Bias Guide**: Detailed analysis of media coverage of China ✅ (MediaBiasGuide.jsx in ResistanceResources)
- [x] **Historical Documents Archive**: Key speeches, laws, leaked documents ✅ (HistoricalDocuments.jsx in ResistanceResources)
- [x] **Victim Memorial Wall**: Remembering those who died in detention ✅ (VictimMemorialWall.jsx in CommunitySupport)

---

## ✅ HUMAN DECISIONS — ALL RESOLVED (Session 42)

> All D1-D5 answered and implemented. See `QUESTIONS_FOR_HUMANS.md` for details.
> **Standing instruction:** Agents may add individuals to the database without asking, as long as well-researched with verified sources and consistent with project goals.

1. ~~**D1 — Zhang Yuxin bad data**~~ → ✅ Replaced with Che Dalha + Zhang Qingli
2. ~~**D2 — Du Bin**~~ → ✅ Added to political prisoner database
3. ~~**D3 — Rachung Gendun**~~ → ✅ Added to political prisoner database
4. ~~**D4 — Profile page priority**~~ → ✅ Jimmy Lai first (agent's choice)
5. ~~**D5 — Policy tracking**~~ → ✅ Added to US international responses

---

## ✅ CURRENT SPRINT — COMPLETED

- [x] Accessibility audit and improvements ✅ (Sessions 10, 14, 18 — 208 accessibility attributes)
- [x] Performance optimization ✅ (Sessions 38-39 — lazy-loaded 81 sub-components across 8 pages, all page bundles under 50KB)

---

## ✅ RECENTLY COMPLETED (Reverse Chronological)

- ✅ **CCP influence detection system**: Centralized CCP_NEVER_CITE (21 names, 13 domains) + CCP_ELEVATED_RISK (15 entries) in sourceLinks.js with 4 utility functions. 37 tests. Consolidated 4 test files from duplicate blocklists — Session 73
- ✅ **Timeline gaps ALL FILLED**: 8 events added (Charter 08, Nobel Prize, Term Limits, Self-Immolation, HK Article 23 march, Wukan, Tibet immolations, HK Article 23 passage). Timeline now 31 events, 1989-2026 — Sessions 74-75
- ✅ **Simulated data Phase 1**: fetchStatistics() uses actual JSON file counts. fetchPoliticalPrisoners() imports from research file. Dashboard stat cards have honest labels — Session 77
- ✅ **Dead code removed**: feedValidator/checkFeedHealth (returned fake "operational" status, never imported) — Session 77
- ✅ **Schema consistency**: source_url added to all 49 human_rights_orgs entries. Fixed "N/A" strings. Tests enforce ≥90% source_url + HTTPS — Session 77
- ✅ **TODO split**: Active-only TODO.md + archive TODO_COMPLETED.md per owner request — Session 74
- ✅ **Sanctions source URLs**: Added source_url fields to all 35 entries linking to official government registries — Session 72
- ✅ **Hong Kong Handover event**: Added July 1, 1997 to timeline (22→23 events) — Session 72
- ✅ **Security headers tests**: 16 tests for CSP, CORS proxy allowlisting — Session 72
- ✅ **Political prisoners data tests**: 19 tests for field validation, status enums, HTTPS URLs — Session 72
- ✅ **CSP fix**: Added api.allorigins.win and api.rss2json.com to connect-src (RSS feeds were blocked) — Session 72
- ✅ **HTTP→HTTPS fixes**: Ekpar Asat source URL, Confucius Institutes source URL — Session 72
- ✅ **Security center data tests**: 20 tests for tools, assessment questions, emergency contacts — Session 72
- ✅ **CCP tactics data tests**: 15 tests for structure, sources, no CCP media — Session 72
- ✅ **Sitemap fix**: Removed 4 redirect routes, added /profiles + 12 profile pages, updated lastmod dates — Session 72
- ✅ **Sitemap data tests**: 34 tests for route coverage, valid XML structure — Session 72
- ✅ **PWA icons generated**: 192×192 and 512×512 PNG from favicon.svg — Session 72
- ✅ **Manifest/PWA tests**: 20 tests for icon files, manifest fields, shortcut icons — Session 72
- ✅ **Timeline events data tests**: 25 tests for required fields, categories, chronological order — Session 72
- ✅ **Detention facilities data fix**: Empty facility_count → 2 — Session 72
- ✅ **ESLint fixes**: Backend ecmaVersion 2020→2022, removed unused authenticateToken import — Session 72
- ✅ **GlobalSearch expanded**: All 12 profiles now searchable with direct links — Session 72
- ✅ **README fix**: Corrected test count (165→306→495), language count (5→8) — Session 72
- ✅ **5 more orphan components integrated** — DetentionFacilities, PoliceStationsMap, RegionalIssues, SanctionedOfficials, GlobalInfluenceMap into IntelligenceFeeds tabs — Sessions 70-71
- ✅ **8 orphan components integrated** into IntelligenceFeeds (3-tab), SecurityCenter (ChinaExitBan), EducationalResources (ConfuciusInstitutes) — Session 70
- ✅ **ARIA dialog roles + Escape key on 4 modal overlays** — Session 69
- ✅ **Sanctions data expanded 18→35 entries**, extracted to JSON, 10 data integrity tests — Session 69
- ✅ **react-router security fix** (7.11.0→7.13.0, 3 CVEs: CSRF, XSS, SSR XSS) — Session 69
- ✅ **zh-CN bug fix**, added Vietnamese/Korean/Japanese locales (8 languages total) — Session 68
- ✅ **CountdownTimer dates made dynamic** — Session 68
- ✅ **Clipboard error handling** + **print stylesheet** — Session 68
- ✅ **Terminal design migration complete** — zero bg-slate/border-slate classes remain — Sessions 67-68
- ✅ **Page consolidation**: 4 orphan pages merged with Navigate redirects — Session 63
- ✅ **East Turkestan + Tibetan flag SVGs** replace generic Lucide icons — Session 64
- ✅ **5 new RSS feeds** (BBC, HRW, Amnesty, CPJ, Guardian) — Session 65
- ✅ **6 new profile pages**: Zhang Zhan, Agnes Chow, Gao Zhisheng, Benny Tai, Nathan Law, Cardinal Zen — Session 62
- ✅ **All 128 files bulk-updated** with terminal design tokens — Session 58
- ✅ Interactive Timeline with 23 key events (1989-2026)
- ✅ December 2025 political prisoner updates
- ✅ Enhanced SEO with structured data schemas
- ✅ Multilingual Support Foundation (8 languages)
- ✅ Witness Protection Guide
- ✅ Petition Generator
- ✅ Regional Issues (Inner Mongolia, Falun Gong, etc.)
- ✅ Source Verification Tool
- ✅ Source Attribution across all data components (142 entries, 100% coverage)
- ✅ Emoji reduction (934 → 278, 70% removed)
- ✅ Accessibility improvements (208 total ARIA/role/tabIndex attributes)
- ✅ Lint cleanup (289 → 0 errors)
- ✅ Dead code removal (15 files, 4,648 lines)
- ✅ Source bias audit with CCP propaganda detection guide
- ✅ Political prisoner verification (60 records, 100% verified with 2+ sources)
- ✅ Sanctioned officials verification (29 officials, corrected dates, fixed errors)
- ✅ WebRTC leak detection (client-side, zero privacy risk)
- ✅ VPN/Tor fake detection removed, honest disclaimers added
- ✅ Route error boundary for censored-region network failures

---

## 📜 SESSION HISTORY

| Session | Date | Agent | Key Work |
|---------|------|-------|----------|
| 1-5 | Jan 2026 | Sonnet 3.5 | Initial build, 14 pages, 100+ components |
| 6-22 | Feb 18-19 | Opus 4.6 | Data verification, source attribution, security fixes, accessibility |
| 23-25 | Feb 18-19 | Investigation | Fabrication gap audit, AGENT_HANDOFF.json creation |
| 33-34 | Feb 19-20 | Opus 4.6 | Data verification (Zhang Zhan, Xu Zhiyong, Gui Minhai, Joshua Wong), deduplication |
| 35 | Feb 20 | Opus 4.6 | Documentation updates, roadmap V2/V3 sections |
| 36 | Feb 20 | Opus 4.6 | Honest "Coming Soon" notices on 4 non-functional forms |
| 37 | Feb 20 | Opus 4.6 | "Illustrative targets" disclaimer on fake community statistics |
| 38-39 | Feb 20 | Opus 4.6 | Performance: lazy-loaded 81 sub-components (87-93% bundle reduction) |
| 40 | Feb 20 | Opus 4.6 | SEO: per-route meta descriptions for all 14 pages |
| 41 | Feb 20 | Opus 4.6 | Consolidated pending decisions |
| 42 | Feb 20 | Opus 4.6 | Implemented all 5 human decisions (D1-D5) |
| 43 | Feb 20 | Opus 4.6 | Jimmy Lai profile page |
| 44 | Feb 20 | Opus 4.6 | Ilham Tohti profile page |
| 45 | Feb 20 | Opus 4.6 | Panchen Lama profile page |
| 46 | Feb 20 | Opus 4.6 | Liu Xiaobo memorial profile page |
| 47 | Feb 20 | Opus 4.6 | Joshua Wong profile page |
| 48 | Feb 20 | Opus 4.6 | Comprehensive TODO/handoff update |
| 49 | Feb 20 | Opus 4.6 | Final consolidation: annotated 3 satellite TODOs |
| 50 | Feb 20 | Opus 4.6 | Renamed QUESTIONS_FOR_OWNER→QUESTIONS_FOR_HUMANS |
| 51 | Feb 20 | Opus 4.6 | Moved all agent docs to `_agents/` folder |
| 52 | Feb 20 | Opus 4.6 | Fixed stale paths in AGENT_HANDOFF.json |
| 53 | Feb 20 | Opus 4.6 | Reorganized `_agents/`, built Profiles Index page |
| 54 | Feb 20 | Opus 4.6 | Gui Minhai profile page |
| 55 | Feb 20 | Opus 4.6 | ASCII/terminal design overhaul |
| 56 | Feb 20 | Opus 4.6 | Dashboard + EmergencyAlerts terminal redesign |
| 57 | Feb 20 | Opus 4.6 | Terminal aesthetic applied to all 13 remaining pages |
| 58 | Feb 20 | Opus 4.6 | 128 files bulk terminal styling — design system 100% complete |
| 59-61 | Feb 20 | Opus 4.6 | Accessibility audit, WCAG AA, 20 contrast tests |
| 62 | Feb 20 | Sonnet 4.5 | 6 new profile pages (12 total, 0 coming soon) |
| 63 | Feb 20 | Sonnet 4.5 | Page consolidation: 4 orphan pages → redirects |
| 64 | Feb 21 | Sonnet 4.5 | Locale cleanup, nav.profiles key |
| 65 | Feb 21 | Sonnet 4.5 | Flag SVGs for East Turkestan + Tibet |
| 66 | Feb 21 | Sonnet 4.5 | 5 new RSS feeds, mobile nav fix |
| 67 | Feb 21 | Sonnet 4.5 | Terminal design cleanup (97+ files), deleted 4 orphan pages |
| 68 | Feb 21 | Sonnet 4.5 | Clipboard handling, print styles, 3 new locales, dynamic countdown |
| 69 | Feb 21 | Sonnet 4.5 | Sanctions expansion (18→35), ARIA modals, react-router security fix |
| 70-71 | Feb 21 | Sonnet 4.5 | Orphan component integration (13 components → 0 orphans) |
| 72 | Feb 24 | Opus 4.6 | Data quality: docs fixes, lint fixes, PWA icons, sitemap, CSP, timeline events, sanctions URLs, data tests |
| 73 | Feb 24 | Opus 4.6 | CCP influence detection system: centralized registry (21+15 entries), 4 utility functions, 37 tests |
| 74 | Feb 24 | Opus 4.6 | TODO split, 3 timeline events (Charter 08, Nobel Prize, Term Limits), agent capabilities doc |
| 75 | Feb 24 | Opus 4.6 | 5 final timeline events (Self-Immolation, Article 23 march, Wukan, Tibet immolations, Article 23 passage). ALL gaps filled. |
| 76-77 | Feb 25 | Opus 4.6 | Simulated data Phase 1: real JSON data for statistics + prisoners. Dead feedValidator removed. Schema consistency fix. Research data tests. |
| 78 | Feb 25 | Opus 4.6 | Merge preparation: comprehensive handoff documentation update. AGENT_HANDOFF v6.0. |
| 79 | Feb 25 | Opus 4.6 | Phase 2 audit: PoliticalPrisoners + ForcedLaborTracker already migrated. Updated SIMULATED_DATA docs. Fixed stale references. |
| 80 | Feb 25 | Opus 4.6 | Final merge prep: README fixes, CHANGELOG v3.0.0 entry, AGENT_ROADMAP header update, cross-doc consistency check. |

---

*This file is an archive. For active tasks, see `_agents/TODO.md`.*
