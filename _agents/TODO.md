# Global Anti-CCP Resistance Hub — Active To-Do List

> Last Updated: March 2, 2026 (Session 142)
>
> **Location:** `_agents/TODO.md` — Active tasks only.
> **Completed tasks:** See `_agents/TODO_COMPLETED.md` for full archive.
> **Agent docs:** `_agents/` folder (NEXT_AGENT_PROMPT.md, AGENTS.md, STYLE_GUIDE.md, AGENT_HANDOFF.json)

---

## 🔴 SHORT-TERM (1-2 weeks)

### Content Updates
- [ ] **Update Sanctions List**: Check for any new sanctions after March 2025 from US, EU, UK, Canada, Australia
  - 47 entries currently (includes Canada Dec 2024 + US Mar 2025 rounds added in Session 96)
  - Subtask: Check US Treasury SDN list for new China/HK-related designations
  - Subtask: Check UK FCDO sanctions list for updates
  - Subtask: Check EU Council sanctions for new entries
  - Subtask: Verify source_url links still resolve
- [ ] **Monitor Jimmy Lai appeal proceedings**
  - Subtask: Watch for appeal filing date
  - Subtask: Update profile page timeline when new developments occur
- [x] **Simulated Data Phase 2**: ✅ ALL COMPLETE (5/5 fully migrated to JSON)
  - ✅ PoliticalPrisoners page → political_prisoners_research.json (DONE)
  - ✅ ForcedLaborTracker → forced_labor_companies_research.json (DONE)
  - ✅ DetentionFacilities → detention_facilities_research.json (DONE — Session 89, 11 facilities with coordinates/capacity/evidence)
  - ✅ CCPOfficials → sanctioned_officials_research.json (DONE — Session 90, JSON enriched with biographical data, hardcoded array removed)

### Bug Fixes & Polish
- [x] **Mobile responsiveness**: Touch targets, font sizing, iOS zoom prevention (Session 93)
- [ ] **Mobile navigation**: Test hamburger menu on various devices
- [x] **Dark mode**: Theme CSS variables + Tailwind overrides for light/high-contrast (Session 121)

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

### Page 1: Dashboard (282 lines, 6 lazy components) — ✅ SIMPLIFIED (Session 140, 142)
**Was:** 349 lines, 8 lazy components (incl CountdownTimer, ImpactMetrics)
**Now:** 282 lines, 6 lazy components (EmergencyAlerts, UrgentCaseTimer, NewsAggregator, LiveStatistics, NewsDigest, ResearchDashboard)
- [x] **Remove CountdownTimer** — redundant with UrgentCaseTimer (both track Jimmy Lai) ✅
- [x] **Remove ImpactMetrics** — aspirational data without real backend metrics ✅
- [x] **Component files deleted** — 2 orphan .jsx files removed (416 lines) ✅
- [x] **Remove inline `urgentCampaigns` array** — fake supporter counts, overlaps EmergencyAlerts ✅ (Session 142)
- [x] **Simplify quick actions** — 4 → 3 (removed "Join Campaign" duplicate of "Take Action") ✅ (Session 142)
- [ ] **Move ResearchDashboard to Intelligence page** — research fits better there
- **Target reached:** 8 → 6 components, fake data removed ✅

### Page 2: Intelligence Feeds (345 lines, 8 lazy components) — ✅ SIMPLIFIED (Session 139)
**Was:** 360 lines, 11 lazy components, 3 tabs (Feeds/Regional with 5 components/Operations with 6 components)
**Now:** 345 lines, 8 lazy components (HongKongStatus, TibetStatus, XinjiangStatus, TaiwanDefenseStatus, CCPOfficials, WorldThreatMap, DetentionFacilities, SanctionedOfficials)
- [x] **Remove GlobalInfluenceMap** — overlaps WorldThreatMap ✅
- [x] **Remove PoliceStationsMap** — overlaps DetentionFacilities ✅
- [x] **Remove RegionalIssues** — generic, overlaps 4 specific regional components ✅
- [x] **Component files deleted** — 3 orphan .jsx files removed (1,021 lines) ✅
- [ ] **Simplify Feeds tab** — currently has 9 RSS sources rendered inline with hardcoded data
  - Move RSS source definitions to JSON data file
  - Show fewer items by default (5 instead of all)
- [ ] **Research: inline RSS data** — 93 lines of hardcoded `rssFeeds` array (lines 28-120) should be JSON
- **Target reached:** 11 → 8 components ✅

### Page 3: Political Prisoners (590 lines, 0 lazy components) — ✅ truncation added (Session 142)
**Current:** Large inline page with search/filter, prisoner cards, detail modal — no sub-components
- [x] **Remove motion animations** — 7 motion.div usages removed ✅ (Session 140)
- [x] **Truncate long prisoner lists** — show 15 by default with "Show all X cases" button, resets on filter change ✅ (Session 142)
- [x] **16 tests added** — all passing ✅ (Session 142)
- [ ] **Research: data already in JSON** — verify all data comes from political_prisoners_research.json
- [ ] **Simplify filter UI** — currently has category filter buttons + search; keep it clean
- [ ] **Reduce prisoner detail view verbosity** — show key facts (name, status, charges, sentence) prominently
- **Target:** Keep structure, reduce visual noise ✅ (truncation done)

### Page 4: Take Action (413 lines, 8 lazy components) — ✅ SIMPLIFIED (Session 138)
**Was:** 552 lines, 15 lazy components, email form, duplicate share section
**Now:** 413 lines, 8 lazy components (PetitionLinks, ForcedLabourList, ContactRepresentatives, SuccessStories, QuickFacts, ActivistToolkit, SanctionsTracker, DonationGuide)
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
- [ ] **Move inline `actions` array (80+ lines)** → JSON data file
- [ ] **Simplify 8 action steps to 5** — merge "Report CCP Harassment" into security page
- [ ] **Add "show more" pattern** — show top 3 actions expanded, rest collapsed

### Page 5: Education Center (347 lines, 13 lazy components) — ✅ SIMPLIFIED (Session 138) + data extracted (Session 141)
**Was:** 622 lines, 17 lazy components, 7 tabs, 8 modules, framer-motion
**Now:** 347 lines, 13 lazy components, 4 tabs, 5 modules, no framer-motion
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

### Page 6: Security Center (419 lines, 6 lazy components) — ✅ SIMPLIFIED (Session 139)
**Was:** 613 lines, 8 lazy components, 6 tabs (assess, legacy-assessment, tools, guides, protect, whistleblower, threats), framer-motion
**Now:** 419 lines, 6 lazy components, 4 tabs (Assess, Tools, Guides, Tech Threats), no framer-motion
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

### Page 7: Community Support (130 lines, 6 lazy components) — ✅ SIMPLIFIED (Session 140)
**Was:** 559 lines, 10 lazy components, 6 tabs, framer-motion, fake data (support requests, volunteers, stats)
**Now:** 130 lines, 6 lazy components (EventCalendar, DiasporaSupport, ReportSighting, SurvivorStories, VolunteerSignup, ContactForm), 4 tabs
- [x] **Page is not in nav** — already removed from navigation in Session 136 ✅
- [x] **Remove 4 aspirational components** — SolidarityWall, VictimMemorialWall, EventRSVP, EventMap ✅
- [x] **Delete 4 orphan component files** — 1,692 lines removed ✅
- [x] **Remove all framer-motion** — 13 motion.div/button usages removed ✅
- [x] **Remove hardcoded fake data** — 6 support requests, 3 volunteer profiles, community stats ✅
- [x] **Reduce 6 tabs to 4** — Support (includes volunteer+contact) | Events | Stories | Report ✅
- [x] **14 tests added** — all passing ✅
- [ ] **Consider merging into other pages** — EventCalendar→Education, SurvivorStories→Education, VolunteerSignup→TakeAction, ContactForm→Security, ReportSighting→Security
- **Target reached:** 10 → 6 components, 6 → 4 tabs ✅

### Page 8: Resistance Resources (306 lines, 7 lazy components) — ✅ SIMPLIFIED (Session 141)
**Was:** 330 lines, 10 lazy components, framer-motion, 3 aspirational components
**Now:** 306 lines, 7 lazy components (DataExport, CompanyTracker, ForcedLaborTracker, AcademicExperts, MediaBiasGuide, HistoricalDocuments, LegalResourcesHub), no framer-motion
- [x] **Page is not in nav** — already removed from navigation in Session 136 ✅
- [x] **Remove Bookmarks** — aspirational (no user session persistence) ✅ (Session 141)
- [x] **Remove MediaGallery** — aspirational (no curated media library) ✅ (Session 141)
- [x] **Remove OrganizationsDirectory** — overlaps with ResistanceDirectory page ✅ (Session 141)
- [x] **Remove framer-motion** — 2 motion.div usages removed ✅ (Session 141)
- [x] **12 tests added** — all passing ✅ (Session 141)
- [ ] **Consider merging sub-components into other pages** (future):
  - Move CompanyTracker to Take Action (fits with boycott actions)
  - Move AcademicExperts to Education
  - Move MediaBiasGuide to Education
  - Move HistoricalDocuments to Education
  - Move LegalResourcesHub to Security
  - Move DataExport to DataSources page
- **Target reached:** 10 → 7 components, aspirational removed ✅

### Page 9: Data Sources (240 lines, 0 lazy components) — ✅ framer-motion removed (Session 140)
**Current:** Static informational page about data methodology. Clean and focused.
- [x] **Remove motion animations** — 17 motion.div/a usages removed ✅
- [ ] **No major structural changes needed** — already well-structured
- [ ] **Consider: add DataExport here** — natural fit for data-oriented users
- **Target:** Keep mostly as-is ✅

### Page 10: Resistance Directory (244 lines, 0 lazy components) — LOW priority
**Current:** Organization search/filter from JSON data. Not in nav.
- [ ] **No major changes needed** — clean search/filter interface
- [ ] **Accessible via footer links and cross-links** — not in main nav
- **Target:** Keep as-is

### Cross-Cutting Simplification Tasks
- [ ] **Remove framer-motion from remaining sub-components** — all pages now motion-free
  - ✅ EducationalResources: all motion removed (Session 138)
  - ✅ SecurityCenter: all motion removed (Session 139)
  - ✅ CommunitySupport page: all motion removed (Session 140)
  - ✅ PoliticalPrisoners: all motion removed (Session 140)
  - ✅ DataSources: all motion removed (Session 140)
  - ✅ ResistanceResources: all motion removed (Session 141)
  - Note: vendor-motion bundle (116KB/38KB gzip) still present for sub-components that use it
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
- [ ] **Move hardcoded data to JSON files**:
  - [x] EducationalResources.jsx `modules`/`resources`/`categories` arrays → educational_modules.json ✅ (Session 141)
  - [ ] TakeAction.jsx `actions` array (~80 lines) — contains Icon component references, needs refactor
  - ✅ CommunitySupport.jsx `supportRequests` array — removed entirely (Session 140)
  - ✅ IntelligenceFeeds.jsx `rssFeeds` — already in liveDataService.js

---

## 🟠 MEDIUM-TERM (1-3 months)

### New Features
- [ ] **Video Testimonials**: Embedded video interviews with survivors (with consent)

### Technical Improvements
- [ ] **Offline Mode**: Cache critical content for offline access
- [ ] **Push Notifications**: Alert users to breaking news and urgent actions
- [ ] **Analytics Dashboard**: Track platform usage (privacy-respecting)
- [ ] **API Development**: Create public API for researchers to access data
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
1. **🔴 Page simplification** — IN PROGRESS (Session 137-142). All priority pages done:
   - **✅ DONE:** TakeAction (15→8), EducationalResources (17→13, 7→4 tabs), IntelligenceFeeds (11→8), SecurityCenter (8→6, 6→4 tabs)
   - **✅ DONE:** CommunitySupport (10→6, 6→4 tabs, -77%), Dashboard (8→6, urgentCampaigns removed, quickActions 4→3), PoliticalPrisoners (motion removed, truncation added), DataSources (motion removed)
   - **✅ DONE:** ResistanceResources (10→7, aspirational removed), EducationalResources data→JSON
   - **LOW:** ResistanceDirectory (keep as-is)
   - **Cross-cutting remaining:** Move TakeAction `actions` array to JSON (requires icon mapping refactor)
2. **Navigation simplification** — ✅ Session 136: sidebar 11→7 items, width w-64→w-56
3. **Content updates** — Monitor breaking developments, update sanctions list with 2026 actions
4. **Cross-cutting:** Remove aspirational components, consolidate overlaps, move hardcoded data to JSON
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

### Current State Summary (as of Session 142, Mar 2, 2026)
- **Frontend:** React 19 + Vite 7 + Tailwind, 10 pages + 15 profiles, 71 components (was 74), 1208 tests (71 files, all passing)
- **Design:** Terminal/ASCII aesthetic 100% applied. Typography cleanup complete. Design system compliance (8 automated checks) + URL health tests. ALL non-terminal accent colors standardized.
- **Navigation:** Simplified from 11→7 items (Session 136). Sidebar w-56. Pages /directory, /community, /resources, /data-sources still routable but not in nav.
- **Page Simplification:** ALL pages simplified. TakeAction 15→8 (S138). EducationalResources 17→13+data→JSON (S138,S141). IntelligenceFeeds 11→8 (S139). SecurityCenter 8→6, 6→4 tabs (S139). CommunitySupport 10→6, -77% (S140). Dashboard 8→6, urgentCampaigns removed, quickActions 4→3 (S140,S142). ResistanceResources 10→7 (S141). PoliticalPrisoners: motion removed, truncation added (S140,S142). DataSources motion removed (S140). 25 aspirational components deleted. ResistanceDirectory: keep as-is.
- **framer-motion:** Removed from ALL 8 pages that had it. Still used by some sub-components (vendor bundle 116KB/38KB gzip).
- **Mobile:** WCAG 2.5.5 touch targets (44px), mobile font bumps, iOS zoom prevention, responsive grids.
- **Accessibility:** All role="button" divs → semantic buttons. 208+ ARIA attributes across 53+ files. Heading hierarchy, SkipLinks i18n (8 languages). WCAG AA contrast.
- **Backend:** Supabase client + service layer integrated. All 4 forms wired. Email service DEFERRED. Backend socket.io fully removed.
- **Bundle:** Main bundle 301KB (97KB gzip). Vendor splitting (react, router, framer-motion at 116KB/38KB gzip).
- **Profile Pages:** 15/15 built (0 coming soon)
- **Data:** 62 political prisoners, 47 sanctioned entities, 34 officials, 30 forced labor companies, 154+ total entries. All 5/5 JSON migrations complete. Educational modules now in JSON.
- **Languages:** 8 locales (en, zh-CN, zh-TW, vi, ko, ja, ug, bo)
- **Security:** 9 headers. 0 npm vulns. 0 CodeQL alerts.
- **Lint:** 0 errors, 7 warnings. 0 npm vulnerabilities.
- **Test Coverage:** All 18 JSON data files, all 4 Supabase forms, all 3 hooks, key components tested. 1208 tests across 71 files.

---

*Active tasks only. For completed work and session history, see `_agents/TODO_COMPLETED.md`.*
