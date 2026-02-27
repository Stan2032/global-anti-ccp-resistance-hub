# Global Anti-CCP Resistance Hub — Active To-Do List

> Last Updated: February 27, 2026 (Session 127)
>
> **Location:** `_agents/TODO.md` — Active tasks only.
> **Completed tasks:** See `_agents/TODO_COMPLETED.md` for full archive.
> **Agent docs:** `_agents/` folder (NEXT_AGENT_PROMPT.md, AGENTS.md, STYLE_GUIDE.md, AGENT_HANDOFF.json)

---

## 🔴 SHORT-TERM (1-2 weeks)

### Content Updates
- [ ] **Update Sanctions List**: Check for any new sanctions after March 2025 from US, EU, UK, Canada, Australia
  - **Agent:** Opus 4.6 (requires source verification against government registries)
  - 47 entries currently (includes Canada Dec 2024 + US Mar 2025 rounds added in Session 96)
  - Subtask: Check US Treasury SDN list for new China/HK-related designations
  - Subtask: Check UK FCDO sanctions list for updates
  - Subtask: Check EU Council sanctions for new entries
  - Subtask: Verify source_url links still resolve
- [ ] **Monitor Jimmy Lai appeal proceedings**
  - **Agent:** Opus 4.6 (requires fact verification, narrative analysis)
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
  - **Agent:** Sonnet 4.5 (UI testing, rapid iteration)
- [x] **Dark mode**: Theme CSS variables + Tailwind overrides for light/high-contrast (Session 121)

---

## 🟠 MEDIUM-TERM (1-3 months)

### New Features
- [ ] **Video Testimonials**: Embedded video interviews with survivors (with consent)
  - **Agent:** Sonnet 4.5 (UI/embedding), Human (content sourcing/consent)

### Technical Improvements
- [ ] **Offline Mode**: Cache critical content for offline access
- [ ] **Push Notifications**: Alert users to breaking news and urgent actions
- [ ] **Analytics Dashboard**: Track platform usage (privacy-respecting)
- [ ] **API Development**: Create public API for researchers to access data
  - **Agent:** Opus 4.6 (backend API design, security implications)
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
1. **Site cleanup** — ✅ SITE_CLEANUP_TODO.md ~99% done (Session 118). Typography ✅, emojis ✅, tabs ✅, disclaimers ✅, ALL non-terminal colors ✅, page merging ✅, dead code removal ✅, accessibility ✅, documentation ✅, content deduplication ✅ (Session 117), form simplification ✅ (Session 117), CONTENT_GUIDE.md ✅ (Session 117), backend socket.io cleanup ✅ (Session 118). File archival ✅ (Session 120: 5 research + 2 thoughts archived, QuickFacts duplicate key fixed). Remaining: aspirational features only
2. **Content updates** — Monitor breaking developments, update sanctions list with 2026 actions
3. **Backend connection Phase 2** — Supabase client + service layer done ✅. All 4 forms wired ✅ (IncidentReport, VolunteerSignup, NewsDigest, ContactForm). Client-side PII encryption ✅ (Session 117). Remaining: add Supabase Auth for admin
4. **Bundle optimization** — ✅ socket.io removed, vendor splitting added, main bundle 421→304KB (133→97KB gzip)
5. **Backend cleanup** — ✅ socket.io dep + 3 socket files (socketAuth.js, socketService.js, handlers.js) removed (Session 118).

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
| **planning/SITE_CLEANUP_TODO.md** | UI readability, emoji reduction, page consolidation | ~97% complete (all priorities substantially done; remaining: content dedup, form simplification) |

---

## 🚀 QUICK START FOR NEW AGENTS

### Essential Reading (in order)
1. **This file (TODO.md)** — What's active, what's next, standing instructions
2. **TODO_COMPLETED.md** — Archive of everything already done
3. **AGENTS.md** — Agent roles, capabilities, protocol, CodeQL troubleshooting
4. **STYLE_GUIDE.md** — Terminal design system reference
5. **AGENT_HANDOFF.json** — Machine-readable state snapshot
6. **thoughts/** — Session-by-session decision logs

### Current State Summary (as of Session 127, Feb 27, 2026)
- **Frontend:** React 19 + Vite 7 + Tailwind, 10 pages + 15 profiles, 95+ components, 895 tests (51 files, all passing)
- **Design:** Terminal/ASCII aesthetic 100% applied. Typography cleanup complete. Design system compliance (8 automated checks) + URL health tests. ALL non-terminal accent colors (blue/purple/indigo/teal/pink) standardized. QuickFacts duplicate key fixed.
- **Site Cleanup:** ~99% complete. Page merging done (4 merges + redirects). Dead code: 0 orphan components. SITE_CLEANUP_TODO.md substantially done. File archival: 73 files in `_agents/archive/`.
- **Mobile:** WCAG 2.5.5 touch targets (44px), mobile font bumps, iOS zoom prevention, responsive grids.
- **Accessibility:** All role="button" divs → semantic buttons. 208+ ARIA attributes across 53+ files. Heading hierarchy, SkipLinks i18n (8 languages). WCAG AA contrast.
- **Backend:** Supabase client + service layer integrated. All 4 forms wired (IncidentReport, VolunteerSignup, NewsDigest, ContactForm). Email service DEFERRED. Backend socket.io fully removed.
- **Bundle:** Main bundle 304KB (97KB gzip). socket.io-client removed. Vendor splitting (react, router, framer-motion).
- **Profile Pages:** 15/15 built (0 coming soon)
- **Data:** 62 political prisoners, 47 sanctioned entities, 34 officials, 30 forced labor companies, 154+ total entries. All 5/5 JSON migrations complete. 0 orphan components.
- **Timeline:** 31 events from 1989-2026, all gaps filled
- **Languages:** 8 locales (en, zh-CN, zh-TW, vi, ko, ja, ug, bo)
- **Security:** 9 headers (HSTS, COOP, CORP, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection). 0 npm vulns. 0 CodeQL alerts.
- **CCP Detection:** Centralized in sourceLinks.js (21 state media + 15 elevated risk entries, 4 utility functions)
- **Terminology:** "CCP" only — never "CPC". Automated test enforces this across all JSX+JSON files.
- **Deployment:** URLs updated to Cloudflare Workers. Service worker paths fixed. Terminal-styled offline/404 pages. Sitemap matches all routes.
- **Lint:** 0 errors, 7 warnings (react-refresh only). 0 npm vulnerabilities.
- **Archive:** 73 files in `_agents/archive/`.
- **Knowledge Transfer:** Machine-readable state in `_agents/AGENT_HANDOFF.json` (v10.6). Questions for humans in `_agents/QUESTIONS_FOR_HUMANS.md`.
- **Test Coverage Highlights:** All 17 JSON data files, all 4 Supabase forms, all 3 hooks, SanctionsTracker, DataExport, InteractiveTimeline, GlobalSearch, Footer, theme system tested.

---

*Active tasks only. For completed work and session history, see `_agents/TODO_COMPLETED.md`.*
