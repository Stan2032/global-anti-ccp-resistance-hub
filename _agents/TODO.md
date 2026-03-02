# Global Anti-CCP Resistance Hub — Active To-Do List

> Last Updated: March 2, 2026 (Session 137)
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

### Page 1: Dashboard (349 lines, 8 lazy components) — MEDIUM priority
**Current:** EmergencyAlerts → stat cards → quick actions → urgent campaigns → News + UrgentCaseTimer → ImpactMetrics → CountdownTimer → LiveStatistics → NewsDigest → ResearchDashboard
- [ ] **Remove CountdownTimer** — redundant with UrgentCaseTimer (both track Jimmy Lai)
- [ ] **Remove ImpactMetrics** — aspirational data without real backend metrics
- [ ] **Move ResearchDashboard to Intelligence page** — research fits better there
- [ ] **Consolidate stat cards** — 4 stat cards are fine, but verify data is real (not placeholder)
- [ ] **Simplify quick actions** — 4 buttons (Take Action, Join Campaign, Security, Find Resources) → reduce to 3 most essential
- [ ] **Remove inline `urgentCampaigns` array** — overlaps with EmergencyAlerts content
- **Target:** 6 components → 4 (EmergencyAlerts, LiveStatistics, NewsAggregator + UrgentCaseTimer, NewsDigest)

### Page 2: Intelligence Feeds (360 lines, 11 lazy components) — HIGH priority
**Current:** 3 tabs: Feeds (inline RSS items), Regional (5 components), Operations (6 components)
- [ ] **Reduce Regional tab** — 5 components (HongKong, Xinjiang, Tibet, Taiwan, RegionalIssues) is overwhelming
  - Consider: show summary cards linking to dedicated sub-pages instead of embedding all 5
- [ ] **Reduce Operations tab** — 6 components (CCPOfficials, WorldThreatMap, DetentionFacilities, PoliceStationsMap, SanctionedOfficials, GlobalInfluenceMap) is far too many
  - Remove GlobalInfluenceMap (overlaps WorldThreatMap)
  - Remove PoliceStationsMap if data is also in DetentionFacilities
  - Consider: show 3 most important, link to /resources for rest
- [ ] **Simplify Feeds tab** — currently has 9 RSS sources rendered inline with hardcoded data
  - Move RSS source definitions to JSON data file
  - Show fewer items by default (5 instead of all)
- [ ] **Research: inline RSS data** — 93 lines of hardcoded `rssFeeds` array (lines 28-120) should be JSON
- **Target:** 11 components → 6-7 (cut 4 from Operations tab)

### Page 3: Political Prisoners (587 lines, 0 lazy components) — MEDIUM priority
**Current:** Large inline page with search/filter, prisoner cards, detail modal — no sub-components
- [ ] **Research: data already in JSON** — verify all data comes from political_prisoners_research.json
- [ ] **Simplify filter UI** — currently has category filter buttons + search; keep it clean
- [ ] **Remove motion animations** — 7 motion.div usages add visual noise without value
- [ ] **Reduce prisoner detail view verbosity** — show key facts (name, status, charges, sentence) prominently
- [ ] **Research: truncate long prisoner lists** — show 10-15 by default with "Show all" button
- **Target:** Keep structure, reduce visual noise and line count by ~100 lines

### Page 4: Take Action (552 lines, 15 lazy components) — HIGHEST priority
**Current:** 7 action steps (hardcoded) + email subscribe form + 15 lazy sub-components all stacked vertically
- [ ] **Remove email subscribe form** — owner DEFERRED email features
- [ ] **Reduce 15 lazy components to 6-8** — many are overlapping:
  - Remove PetitionGenerator (overlaps PetitionLinks)
  - Remove ForcedLaborSupplyChain (overlaps ForcedLabourList)
  - Remove SocialMediaToolkit (aspirational — no real backend)
  - Remove CampaignProgress (aspirational — no real tracking data)
  - Remove LetterCampaign (overlaps ContactRepresentatives)
  - Remove ActionTracker (aspirational — no real user action data)
  - Remove GovernmentResponseTracker (aspirational — no real response data)
- [ ] **Move inline `actions` array (80+ lines)** → JSON data file
- [ ] **Simplify 7 action steps to 5** — merge "Report CCP Harassment" into security page
- [ ] **Add "show more" pattern** — show top 3 actions expanded, rest collapsed
- **Target:** 15 lazy components → 6 (PetitionLinks, ContactRepresentatives, ForcedLabourList, QuickFacts, SanctionsTracker, DonationGuide)

### Page 5: Education Center (622 lines, 17 lazy components) — HIGHEST priority
**Current:** 7 tabs (learn, media, research, history, tools, faq, progress) + 10 modules inline + 17 lazy components
- [ ] **Reduce 7 tabs to 3-4**: Learn | Media | Research | Tools (merge history into learn, merge faq into learn, remove progress)
- [ ] **Remove ReadingProgress** — aspirational feature (no real user session tracking)
- [ ] **Remove AcademicCitationGenerator** — niche utility, rarely used
- [ ] **Remove PodcastPlayer** — aspirational (no real podcast content)
- [ ] **Remove KnowledgeQuiz** — already have SecurityQuiz on Security page
- [ ] **Move inline `modules` array (120+ lines of hardcoded data)** → JSON file
- [ ] **Reduce 10 modules to 5** — remove modules with fake instructor names/ratings
- [ ] **Simplify category filter** — 6 category buttons is too many; reduce to 3-4
- [ ] **Remove motion animations** — 17 motion.div imports, adds bundle weight
- **Target:** 17 components → 8-10, 7 tabs → 3-4

### Page 6: Security Center (613 lines, 8 lazy components) — HIGH priority
**Current:** 6 tabs (assess, legacy-assessment, tools, guides, protect, whistleblower, threats) + complex security assessment
- [ ] **Reduce 6 tabs to 3-4**: Assess | Tools | Guides | Threats (merge protect into guides, merge whistleblower into tools)
- [ ] **Simplify security assessment** — currently 100+ lines of assessment logic with questions, scoring, category breakdown
  - Keep assessment but remove redundant "legacy-assessment" tab
- [ ] **Remove WhistleblowerPortal** — aspirational (no real secure submission system)
- [ ] **Remove OfflineModeManager** — aspirational (PWA caching handles this)
- [ ] **Move security assessment questions to JSON** — currently imported from JSON already ✅
- [ ] **Remove motion animations** — 19 motion.div usages
- **Target:** 8 components → 5-6, 6 tabs → 3-4

### Page 7: Community Support (559 lines, 10 lazy components) — HIGH priority
**Current:** 5 tabs (support, events, stories, report, volunteer, contact) + 6 hardcoded support requests + 10 lazy components
- [ ] **Page is not in nav** — already removed from navigation in Session 136
- [ ] **Consider merging into other pages** — or keep as hidden page with reduced content
  - Move EventCalendar to Education page
  - Move SurvivorStories to Education page
  - Move VolunteerSignup to Take Action page
  - Move ContactForm to Security page
  - Move ReportSighting to Security page
- [ ] **Remove hardcoded support requests** — 6 fake support requests with fictional data
- [ ] **Remove SolidarityWall** — aspirational community feature
- [ ] **Remove VictimMemorialWall** — overlaps with MemorialWall component
- [ ] **Remove EventRSVP** — aspirational (no real event system)
- [ ] **Remove EventMap** — aspirational (no real event data)
- **Target:** If keeping page: 10 → 4 components. If merging: redistribute to other pages.

### Page 8: Resistance Resources (330 lines, 10 lazy components) — MEDIUM priority
**Current:** Hub page with cross-links + 10 lazy components. Not in nav.
- [ ] **Page is not in nav** — already removed from navigation in Session 136
- [ ] **Consider merging sub-components into Education or Take Action**:
  - Move CompanyTracker to Take Action (fits with boycott actions)
  - Move AcademicExperts to Education
  - Move MediaBiasGuide to Education
  - Move HistoricalDocuments to Education
  - Move LegalResourcesHub to Security
  - Move DataExport to DataSources page
  - Keep Bookmarks as utility (or remove — aspirational with no user state)
- [ ] **Remove MediaGallery** — aspirational (no curated media library)
- [ ] **Remove OrganizationsDirectory** — overlaps with ResistanceDirectory page
- [ ] **Remove Bookmarks** — aspirational (no user session persistence)
- **Target:** Redistribute useful components, remove page entirely

### Page 9: Data Sources (257 lines, 0 lazy components) — LOW priority
**Current:** Static informational page about data methodology. Clean and focused.
- [ ] **No major changes needed** — already well-structured
- [ ] **Minor: remove motion animations** — 17 motion.div usages for a static info page
- [ ] **Consider: add DataExport here** — natural fit for data-oriented users
- **Target:** Keep mostly as-is, minimal simplification

### Page 10: Resistance Directory (244 lines, 0 lazy components) — LOW priority
**Current:** Organization search/filter from JSON data. Not in nav.
- [ ] **No major changes needed** — clean search/filter interface
- [ ] **Accessible via footer links and cross-links** — not in main nav
- **Target:** Keep as-is

### Cross-Cutting Simplification Tasks
- [ ] **Remove framer-motion from pages that don't need it** — CommunitySupport (13), DataSources (17), EducationalResources (17), SecurityCenter (19), PoliticalPrisoners (7) = ~73 motion.div imports across 5 pages
  - Research: removing motion.div → static div saves bundle size (vendor-motion is 116KB/38KB gzip)
  - Start with pages that use motion only for fade-in (no real interactivity)
- [ ] **Audit for aspirational components** — components with no real data/backend that pretend to have features
  - ActionTracker, CampaignProgress, GovernmentResponseTracker, ImpactMetrics, SocialMediaToolkit, PetitionGenerator, LetterCampaign, EventRSVP, EventMap, SolidarityWall, ReadingProgress, PodcastPlayer, Bookmarks, OfflineModeManager, WhistleblowerPortal
  - Decision: remove or clearly label as "coming soon" with minimal UI
- [ ] **Consolidate overlapping components**:
  - PetitionGenerator ↔ PetitionLinks (both handle petitions)
  - ForcedLaborSupplyChain ↔ ForcedLabourList (both track forced labor)
  - LetterCampaign ↔ ContactRepresentatives (both contact officials)
  - VictimMemorialWall ↔ MemorialWall (both memorial features)
  - PoliceStationsMap ↔ DetentionFacilities (both track CCP facilities)
  - GlobalInfluenceMap ↔ WorldThreatMap (both map CCP influence)
  - OrganizationsDirectory ↔ ResistanceDirectory page (both list organizations)
- [ ] **Move hardcoded data to JSON files**:
  - TakeAction.jsx `actions` array (~80 lines)
  - EducationalResources.jsx `modules` array (~120 lines)
  - CommunitySupport.jsx `supportRequests` array (~70 lines)
  - IntelligenceFeeds.jsx `rssFeeds` array (~90 lines)

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
1. **🔴 Page simplification** — NEW (Session 137). Comprehensive per-page task list added above. Priority order:
   - **HIGHEST:** TakeAction (15→6 components), EducationalResources (17→8 components)
   - **HIGH:** IntelligenceFeeds (11→7 components), SecurityCenter (8→5 components), CommunitySupport (10→4 or merge)
   - **MEDIUM:** Dashboard (8→4 components), PoliticalPrisoners (reduce visual noise), ResistanceResources (redistribute)
   - **LOW:** DataSources (minor motion removal), ResistanceDirectory (keep as-is)
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

### Current State Summary (as of Session 137, Mar 2, 2026)
- **Frontend:** React 19 + Vite 7 + Tailwind, 10 pages + 15 profiles, 96 components, 1137 tests (66 files, all passing)
- **Design:** Terminal/ASCII aesthetic 100% applied. Typography cleanup complete. Design system compliance (8 automated checks) + URL health tests. ALL non-terminal accent colors standardized.
- **Navigation:** Simplified from 11→7 items (Session 136). Sidebar w-56. Pages /directory, /community, /resources, /data-sources still routable but not in nav.
- **Page Simplification:** Comprehensive task list created (Session 137). 10 pages analyzed. Priority: TakeAction (15→6), EducationalResources (17→8), IntelligenceFeeds (11→7), SecurityCenter (8→5), CommunitySupport (10→4 or merge). ~15 aspirational components identified for removal. ~7 overlapping component pairs identified for consolidation.
- **Mobile:** WCAG 2.5.5 touch targets (44px), mobile font bumps, iOS zoom prevention, responsive grids.
- **Accessibility:** All role="button" divs → semantic buttons. 208+ ARIA attributes across 53+ files. Heading hierarchy, SkipLinks i18n (8 languages). WCAG AA contrast.
- **Backend:** Supabase client + service layer integrated. All 4 forms wired. Email service DEFERRED. Backend socket.io fully removed.
- **Bundle:** Main bundle 301KB (97KB gzip). Vendor splitting (react, router, framer-motion at 116KB/38KB gzip).
- **Profile Pages:** 15/15 built (0 coming soon)
- **Data:** 62 political prisoners, 47 sanctioned entities, 34 officials, 30 forced labor companies, 154+ total entries. All 5/5 JSON migrations complete.
- **Languages:** 8 locales (en, zh-CN, zh-TW, vi, ko, ja, ug, bo)
- **Security:** 9 headers. 0 npm vulns. 0 CodeQL alerts.
- **Lint:** 0 errors, 7 warnings. 0 npm vulnerabilities.
- **Test Coverage:** All 17 JSON data files, all 4 Supabase forms, all 3 hooks, key components tested. 1137 tests across 66 files.

---

*Active tasks only. For completed work and session history, see `_agents/TODO_COMPLETED.md`.*
