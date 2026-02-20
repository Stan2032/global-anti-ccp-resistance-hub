# Global Anti-CCP Resistance Hub - Development To-Do List

> Last Updated: February 20, 2026 (Session 52, Opus 4.6)
> 
> **Location:** `_agents/TODO.md` — All agent documentation is now in the `_agents/` folder.
> See `_agents/README.md` for folder structure and quick start guide.
> 
> This document tracks planned improvements, features, and maintenance tasks for the platform.
> Items are categorized by timeframe and priority.

---

## 🔴 SHORT-TERM (1-2 weeks)

### High Priority
- [ ] **Multilingual Support**: Add translations for key pages (Chinese Traditional, Uyghur, Tibetan, Vietnamese, Korean, Japanese)
- [x] **Mobile App Banner**: Add "Add to Home Screen" prompt for PWA installation ✅
- [ ] **Accessibility Audit**: Run automated accessibility tests and fix any WCAG 2.1 violations
- [x] **Performance Optimization**: Implement code splitting for large components ✅ (Sessions 38-39 — lazy-loaded 81 sub-components across 8 pages, all page bundles now under 50KB)
- [x] **SEO Improvements**: Add meta tags, Open Graph tags, structured data for search engines ✅ (index.html already had OG/Twitter/structured data; Session 40 added per-route meta descriptions for all 14 pages)

### Content Updates
- [x] **Update Political Prisoners Database**: Add recent arrests and releases (December 2025) ✅
- [ ] **News Feed Integration**: Add more RSS feeds from trusted sources
- [ ] **Update Sanctions List**: Add any new sanctions from US, EU, UK, Canada, Australia
- [x] **Jimmy Lai Case Updates**: Updated with Feb 9, 2026 sentencing (20 years) ✅
  - [x] Fix conviction date errors (2024 → 2025, Dec 19 → Dec 15) across 6 files
  - [x] Fix age errors (77 → 78) across 5 files
  - [x] Update sentence from "faces life" to "20 years" across 20+ files
  - [x] Update status from "GUILTY - AWAITING SENTENCING" to "SENTENCED - 20 YEARS"
  - [x] Add February 9, 2026 sentencing as new timeline event ✅
  - [ ] Monitor for appeal proceedings

### Data Verification (Opus 4.6 — requires CCP propaganda detection capability)
- [x] **Verify all timeline event dates**: 21 events verified with direct source links (see DATA_VERIFICATION_LOG.md)
- [x] **Fix Safeguard Defenders report date**: Corrected from 2023-09-14 to 2022-12-04
- [x] **Verify sanctions dates**: Chen Quanguo, Zhu Hailun, Carrie Lam dates confirmed
- [x] **Verify Canada sanctions on Chen Quanguo**: CONFIRMED December 2024 via canada.ca and Canada Gazette ✅
- [x] **Cross-reference Falun Gong death toll**: "4,000+ confirmed deaths in custody" from FDIC (individual named cases); independently corroborated pattern by China Tribunal 2019. Added sourcing note ✅
- [x] **Verify all political prisoner statuses**: Key updates completed ✅
  - [x] Zhang Zhan: Second 4-year sentence CONFIRMED (Sep 2025) via OHCHR, Amnesty, CPJ
  - [x] Xu Zhiyong: Hunger strike CONFIRMED (Oct 4, 2024) via HRW, The Independent, NCHRD. Forced-feeding observed. Critical health.
  - [x] Gui Minhai: Sentence ends Feb 2030 CONFIRMED. Location unknown. No consular access. Via Amnesty, NCHRD, Safeguard Defenders
  - [x] Gedhun Choekyi Nyima: 30th anniversary coverage May 2025 CONFIRMED per existing data
  - [x] Joshua Wong: New NSL collusion charges June 2025 CONFIRMED via Amnesty, HKFP
- [x] **Verify academic experts data**: Checked affiliations, current positions. Fixed: Elliot Sperling (deceased 2017), Sophie Richardson (now CHRD), Elizabeth Economy (title updated), Barnett duplicate removed ✅
- [x] **Verify forced labor companies list**: 30 companies cross-referenced with ASPI "Uyghurs for Sale" report. UFLPA Entity List (144 entities) targets Chinese suppliers, not Western brands — distinction is correct ✅
- [x] **Verify Confucius Institute data**: US: 4 remaining, 104 closed. Many rebranded. Via GAO report ✅
- [x] **Deduplicate data files**: Removed Barnett duplicate from academic experts, merged Taiwan Assoc. for HR duplicate in HR orgs ✅

### Expanded Person Profiles (NEW — requested by project owner)
- [ ] **Create detailed person profile pages**: Full timeline pages for key individuals targeted by CCP
  - [x] **Jimmy Lai profile page**: Complete timeline from birth to sentencing ✅ (Session 43)
    - [x] Early life and business career
    - [x] Apple Daily founding (1995) and editorial stance
    - [x] 2014 Umbrella Movement involvement
    - [x] 2019 protest coverage and CCP targeting begins
    - [x] August 10, 2020: Arrested under NSL
    - [x] 2021: Apple Daily forced to close (June 24)
    - [x] 2022-2025: Trial proceedings (156 days)
    - [x] December 15, 2025: Found guilty on all charges
    - [x] February 9, 2026: Sentenced to 20 years
    - [x] CCP narrative control breakdown with sourced rebuttals
    - [x] International response timeline
    - [x] All source links (HRW, CPJ, BBC, US State Dept, HKFP, etc.)
  - [x] **Ilham Tohti profile page**: From academic career to life sentence ✅ (Session 44)
    - [x] Academic work at Minzu University
    - [x] Uighurbiz.net and advocacy for Han-Uyghur dialogue
    - [x] January 15, 2014: Arrested
    - [x] September 23, 2014: Sentenced to life
    - [x] Sakharov Prize (2019), Václav Havel Prize (2019), Martin Ennals Award (2016), PEN Award (2014)
    - [x] CCP "separatist" narrative vs reality (dialogue advocate)
    - [x] 7 students also persecuted
    - [x] 9 Tier 1 sources (HRW, Amnesty, European Parliament, PEN, Front Line Defenders, USCIRF, Scholars at Risk, PEN America, UN OHCHR)
  - [x] **Gedhun Choekyi Nyima (Panchen Lama) profile page** ✅ (Session 45)
    - [x] Recognition by Dalai Lama (May 14, 1995)
    - [x] Abduction (May 17, 1995)
    - [x] 30 years of enforced disappearance — 16-event timeline
    - [x] CCP's installation of Gyaltsen Norbu (Golden Urn ceremony Nov 29, 1995)
    - [x] "Why It Matters" section (religious, political, human significance) — replaces "Charges" since no charges exist
    - [x] CCP narrative analysis: 4 claims debunked (living normally, Golden Urn tradition, Dalai Lama violated procedures, internal matter)
    - [x] International advocacy efforts: 7 organizations + NED Democracy Service Medal 2025
    - [x] 10 sources (9 Tier 1, 1 Tier 2), zero CCP state media
    - [x] Chadrel Rinpoche persecution documented
    - [x] Purple color theme (religious/spiritual differentiation)
  - [x] **Liu Xiaobo profile page** (posthumous) ✅ (Session 46)
    - [x] Charter 08 and Nobel Peace Prize
    - [x] 22-event timeline from 1955 birth to 2018 Liu Xia exile
    - [x] 11-year sentence and death in custody (July 13, 2017)
    - [x] Liu Xia (wife) house arrest and eventual exile — dedicated section
    - [x] CCP narrative analysis: 4 claims debunked (criminal not prisoner, best medical care, Nobel blasphemy, voluntary sea burial)
    - [x] "I Have No Enemies" quote on Legacy tab
    - [x] Ossietzky parallel (first Nobel laureate to die in custody since 1938)
    - [x] 11 sources (9 Tier 1, 2 Tier 2), zero CCP state media
    - [x] Memorial color theme (dark gray with gold Nobel accents)
  - [x] **Joshua Wong profile page** ✅ (Session 47)
    - [x] Scholarism movement (2011-2012) and anti-national education curriculum campaign
    - [x] 2014 Umbrella Movement and Civic Square arrest (September 26, 2014)
    - [x] TIME "Most Influential Teens" (2014) and Fortune "World's Greatest Leaders" (2015)
    - [x] Demosistō founding (April 2016) and dissolution (June 2020)
    - [x] Multiple arrests, convictions, and appeals (2016-2020)
    - [x] Hong Kong 47 case: arrested Feb 28, 2021 → guilty May 30, 2024 → sentenced Nov 19, 2024 (4y8m)
    - [x] "I love Hong Kong" courtroom moment documented
    - [x] June 6, 2025: new NSL collusion charge (faces life imprisonment) — Amnesty calls it "designed to prolong imprisonment"
    - [x] CCP narrative analysis: 4 claims debunked (separatist, subversive primary, foreign manipulation, fair trial)
    - [x] Nathan Law exile connection documented
    - [x] 10 sources (7 Tier 1, 3 Tier 2), zero CCP state media
    - [x] Yellow/gold color theme (youth activism, energy)
  - [x] **Gui Minhai profile page**
    - [x] Causeway Bay Books and cross-border abduction from Thailand
    - [x] Swedish citizenship and diplomatic crisis
    - [x] 10-year espionage sentence
    - [x] 14-event timeline (1964-2025), 2 charges, 4 CCP narratives debunked
    - [x] Causeway Bay Books context section (all 5 booksellers documented)
    - [x] Angela Gui advocacy section
    - [x] UN WGAD ruling (August 2025), 90-org joint statement (October 2025)
    - [x] 10 sources (6 Tier 1, 4 Tier 2), zero CCP state media
    - [x] Teal color theme (publishing/literary differentiation) — Session 54, Opus 4.6
  - [ ] **Additional profiles**: Agnes Chow, Nathan Law, Benny Tai, Cardinal Zen, Gao Zhisheng, Zhang Zhan
  - **Agent note**: Profile pages should be built by Opus 4.6 (fact verification, CCP narrative analysis) with Sonnet 4.5 for UI/layout. Each profile must include direct source links, not just source names.

### Bug Fixes & Polish
- [ ] **Test all forms**: Ensure all copy-to-clipboard functions work across browsers
- [ ] **Mobile navigation**: Test hamburger menu on various devices
- [ ] **Print styles**: Test print functionality for all major pages
- [ ] **Dark mode**: Ensure all components respect theme settings

---

## 🟠 MEDIUM-TERM (1-3 months)

### New Features
- [x] **Interactive Timeline**: Zoomable, filterable timeline of CCP human rights abuses since 1989 ✅
- [x] **Case Study Deep Dives**: Detailed pages for major cases (Jimmy Lai, Ilham Tohti, Panchen Lama) ✅
- [ ] **Video Testimonials**: Embedded video interviews with survivors (with consent)
- [ ] **Podcast Player**: In-app podcast player for recommended shows
- [x] **Reading Progress Tracker**: Track books and articles read in Education Center ✅
- [ ] **Campaign Progress Tracker**: Show real-time progress on petitions and campaigns
- [ ] **Event Map**: Interactive map showing upcoming events worldwide
- [ ] **Diaspora Directory**: Searchable directory of diaspora organizations by location
- [ ] **Legal Resources Hub**: Country-specific legal information for asylum, immigration
- [ ] **Academic Citation Generator**: Generate citations for research papers

### Content Expansion
- [ ] **Uyghur Forced Labor Database**: Comprehensive list of companies and products
- [ ] **Confucius Institute Tracker**: Map and status of all CIs worldwide
- [x] **CCP Officials Database**: Profiles of key officials involved in repression ✅
- [ ] **Detention Facility Database**: Satellite imagery and documentation
- [ ] **Media Bias Guide**: Detailed analysis of media coverage of China
- [ ] **Historical Documents Archive**: Key speeches, laws, leaked documents
- [ ] **Victim Memorial Wall**: Remembering those who died in detention

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
- [ ] Email newsletter subscription
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
- [ ] Email client integration
- [ ] Slack/Discord bots
- [ ] Telegram channel
- [ ] WhatsApp broadcast
- [ ] Signal group integration

---

## 🔧 TECHNICAL DEBT

### Code Quality
- [ ] Refactor large components into smaller modules
- [ ] Add TypeScript for type safety
- [ ] Implement comprehensive testing (unit, integration, e2e)
- [ ] Document all components with JSDoc
- [ ] Create component library/design system
- [ ] Standardize error handling
- [ ] Implement logging system

### Infrastructure
- [ ] Set up staging environment
- [ ] Implement CI/CD improvements
- [ ] Add automated security scanning
- [ ] Set up monitoring and alerting
- [ ] Implement rate limiting
- [ ] Add DDoS protection
- [ ] Configure proper caching headers

### Documentation
- [ ] Create developer documentation
- [ ] Write contribution guidelines
- [ ] Document API endpoints
- [ ] Create user guides
- [ ] Write security documentation
- [ ] Maintain changelog

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

## ✅ HUMAN DECISIONS — ALL RESOLVED (Session 42)

> All D1-D5 answered and implemented. See `QUESTIONS_FOR_HUMANS.md` for details.
> **Standing instruction:** Agents may add individuals to the database without asking, as long as well-researched with verified sources and consistent with project goals.

1. ~~**D1 — Zhang Yuxin bad data**~~ → ✅ Replaced with Che Dalha + Zhang Qingli
2. ~~**D2 — Du Bin**~~ → ✅ Added to political prisoner database
3. ~~**D3 — Rachung Gendun**~~ → ✅ Added to political prisoner database
4. ~~**D4 — Profile page priority**~~ → ✅ Jimmy Lai first (agent's choice)
5. ~~**D5 — Policy tracking**~~ → ✅ Added to US international responses

---

## 🎯 CURRENT SPRINT

### In Progress
1. [x] Accessibility audit and improvements ✅ (Sessions 10, 14, 18 — 208 accessibility attributes)
2. [x] Performance optimization ✅ (Sessions 38-39 — lazy-loaded 81 sub-components across 8 pages, all page bundles under 50KB)

### Up Next
1. **Website design polish** — Extend ASCII/terminal aesthetic to page content components (Dashboard cards, stat blocks, alerts)
2. **Mobile navigation testing** — Verify ASCII design works across viewport sizes
3. **Accessibility audit** — Ensure terminal aesthetic maintains WCAG AA contrast ratios
4. Additional profiles (deprioritized per project owner): Agnes Chow, Nathan Law, Benny Tai, Cardinal Zen, Gao Zhisheng, Zhang Zhan

### Recently Completed
- ✅ **ASCII/terminal design overhaul** — sidebar, header, footer, loading screen, 404 page redesigned with monospace typography, box-drawing borders, terminal-green accents, scanline effects. All 257 tests pass. — Session 55, Opus 4.6
- ✅ Gui Minhai profile page at `/profiles/gui-minhai`: 14-event timeline, 2 charges, 4 CCP narratives debunked, Causeway Bay Books context section (all 5 booksellers), Angela Gui advocacy section, UN WGAD ruling, 90-org joint statement, 10 sources, teal theme — Session 54, Opus 4.6
- ✅ Profile index page at `/profiles`: lists all 5 built profiles + 3 upcoming with status indicators, links, color themes, source attribution note, navigation link — Session 53, Opus 4.6
- ✅ Reorganized `_agents/` folder: moved 12 research/audit files to `research/`, 3 satellite TODOs to `planning/`, 7 historical files to `archive/` — top level reduced from 29+ files to 10 core files — Session 53, Opus 4.6
- ✅ Joshua Wong profile page: dedicated /profiles/joshua-wong route with 21-event timeline, dual charges section (subversion guilty + collusion pending), CCP narrative analysis (4 claims debunked), Nathan Law exile connection, "I love Hong Kong" courtroom moment, 10 sources, yellow/gold theme — Session 47, Opus 4.6
- ✅ Liu Xiaobo memorial profile page: dedicated /profiles/liu-xiaobo route with 22-event timeline, Charter 08 & Charges tab, CCP narrative analysis (4 claims debunked), Legacy & Impact tab, Liu Xia persecution section, "I Have No Enemies" quote, Ossietzky parallel, 11 sources, memorial color theme — Session 46, Opus 4.6
- ✅ Gedhun Choekyi Nyima (Panchen Lama) profile page: dedicated /profiles/panchen-lama route with 16-event timeline, "Why It Matters" section (no charges to analyze — unique), CCP narrative analysis (4 claims debunked), 7 international responses, NED Democracy Service Medal 2025, 10 sources — Session 45, Opus 4.6
- ✅ Ilham Tohti profile page: dedicated /profiles/ilham-tohti route with 19-event timeline, charges, CCP narrative analysis (4 claim/reality pairs), 7 international responses, 9 Tier 1 sources — Session 44, Opus 4.6
- ✅ Jimmy Lai profile page: dedicated /profiles/jimmy-lai route with complete timeline, charges, CCP narrative analysis, international response, sources — Session 43, Opus 4.6
- ✅ D1-D5 human decisions implemented: Zhang Yuxin→Che Dalha+Zhang Qingli, Du Bin+Rachung Gendun added, policy proposal tracked — Session 42, Opus 4.6
- ✅ SEO improvements: per-route meta descriptions for all 14 pages, 2 new tests — Session 40, Opus 4.6
- ✅ Performance optimization Phase 2: lazy-loaded 28 more sub-components across Dashboard, CommunitySupport, CCPTactics, SecurityCenter — Session 39, Opus 4.6
- ✅ Performance optimization: lazy-loaded 53 sub-components across TakeAction, EducationalResources, RegionalThreats, ResistanceResources — Session 38, Opus 4.6
- ✅ Add "illustrative targets" disclaimer to fake community statistics (CommunitySupport page) — Session 37, Opus 4.6
- ✅ Add "Coming Soon" notices to non-functional forms (VolunteerSignup, IncidentReportForm, ReportSighting, NewsDigest) — Session 36, Opus 4.6
- ✅ Fix misleading security claims in IncidentReportForm footer ("End-to-end encrypted", "No logs retained") — Session 36
- ✅ Fix false success messages ("Report Submitted Securely", "You're Subscribed!") with honest notices + links to real organizations — Session 36
- ✅ PWA Install Banner with iOS/Android support
- ✅ Case Study Deep Dives (Jimmy Lai, Ilham Tohti, Panchen Lama)
- ✅ Reading Progress Tracker with achievements
- ✅ CCP Officials Database (29 officials, sanctions tracking, verified sources)
- ✅ Interactive Timeline with 21 key events (1989-2025)
- ✅ December 2025 political prisoner updates (Jimmy Lai verdict, Xin Ruoyu, Guan Heng)
- ✅ Enhanced SEO with structured data schemas
- ✅ Multilingual Support Foundation (English, Simplified Chinese, Traditional Chinese, Uyghur, Tibetan)
- ✅ Language files and i18n context with navigation wired to t()
- ✅ Witness Protection Guide
- ✅ Petition Generator
- ✅ Regional Issues (Inner Mongolia, Falun Gong, etc.)
- ✅ Source Verification Tool
- ✅ Quick Start Guide
- ✅ Source Attribution across all data components (142 entries, 100% coverage)
- ✅ Emoji reduction (934 → 278, 70% removed)
- ✅ Accessibility improvements (208 total ARIA/role/tabIndex attributes)
- ✅ Lint cleanup (289 → 11 errors, 96% reduction)
- ✅ Dead code removal (15 files, 4,648 lines)
- ✅ Source bias audit with CCP propaganda detection guide
- ✅ Political prisoner verification (60 records, 100% verified with 2+ sources)
- ✅ Sanctioned officials verification (29 officials, corrected dates, fixed errors)
- ✅ WebRTC leak detection (client-side, zero privacy risk)
- ✅ VPN/Tor fake detection removed, honest disclaimers added
- ✅ Route error boundary for censored-region network failures

---

## 📝 NOTES

### Design Principles
1. **Verifiable**: All information must be sourced and fact-checked
2. **Accessible**: Works for users of all abilities and technical levels
3. **Secure**: Protects user privacy and safety
4. **Actionable**: Every page should lead to concrete actions
5. **Comprehensive**: One-stop resource for all anti-CCP activism needs

### Content Guidelines
1. Primary sources preferred over secondary
2. Multiple independent sources for major claims
3. Clear attribution and citation
4. Regular updates to maintain accuracy
5. Balanced coverage of all affected groups

### Security Considerations
1. No user tracking or analytics that could identify individuals
2. No server-side storage of sensitive user data
3. All data export in user-controlled formats
4. Clear security warnings where appropriate
5. Regular security audits

---

---

## 📂 RELATED TODO FILES

> **Important:** These satellite TODO files live in `_agents/planning/` and were created in earlier sessions (Jan 2026). Each file has been annotated with completion status as of Session 49.

| File | Focus | Status |
|------|-------|--------|
| **planning/SIMULATED_DATA_CLEANUP_TODO.md** | Remove all fake/simulated data from the codebase | Phase 1 ✅ complete. Phase 2 (component refactoring to use JSON data) still outstanding — **highest priority satellite work** |
| **planning/SITE_CLEANUP_TODO.md** | UI readability, emoji reduction, page consolidation | ~40% complete (emoji reduction, code splitting, accessibility all done). Typography and page consolidation still outstanding |
| **planning/SITE_WIDE_TODO.md** | Forced labor alternatives with China exposure verification | Still outstanding — good feature work for future sessions |

---

## 🚀 QUICK START FOR NEW AGENTS

### Essential Reading (in order)
1. **This file (TODO.md)** — What's done, what's next, standing instructions
2. **AGENTS.md** — Agent roles, capabilities, protocol, CodeQL troubleshooting
3. **AGENT_ROADMAP.md** — Detailed task history with subtask breakdowns and agent assignments
4. **QUESTIONS_FOR_HUMANS.md** — All resolved decisions + standing instruction on adding people
5. **thoughts/** — Session-by-session decision logs (14 files, Sessions 33-48)
6. **AGENT_HANDOFF.json** — Machine-readable state snapshot (updated Session 48)
7. **LLM_JUDGEMENT_LOG.md** — Formal decision rationale log (Sessions 6-35)
8. **Satellite TODOs** — See "Related TODO Files" section above for `planning/SIMULATED_DATA_CLEANUP_TODO.md`, `planning/SITE_CLEANUP_TODO.md`, `planning/SITE_WIDE_TODO.md`

### Current State Summary (as of Session 55, Feb 20, 2026)
- **Frontend:** React + Vite + Tailwind, 16 pages, 100+ components, 257 tests (all passing)
- **Design:** ASCII/terminal aesthetic — monospace headings (JetBrains Mono), terminal-green (#4afa82) accents, box-drawing borders, square corners, CRT scanline effects
- **Backend:** Express + PostgreSQL (exists but untested in sandbox — needs real DB)
- **Profile Pages Built:** 6 (Jimmy Lai, Ilham Tohti, Panchen Lama, Liu Xiaobo, Joshua Wong, Gui Minhai)
- **Profile Pages Queued (deprioritized):** Agnes Chow, Nathan Law, Benny Tai, Cardinal Zen, Gao Zhisheng, Zhang Zhan
- **Data:** 60 political prisoners, 29 sanctioned officials, 33 forced labor companies, 142 total entries with 100% source attribution
- **Performance:** All 8 major pages lazy-loaded (81 sub-components), all page bundles under 50KB
- **Forms:** 4 non-functional forms have honest "Coming Soon" disclaimers (Session 36)
- **Community stats:** Marked as "illustrative targets" (Session 37)
- **i18n Foundation:** 5 language files built (en, zh-CN, zh-TW, ug, bo), translations not yet filled

### Standing Instructions from Humans
- **Adding people to site:** Agents may add individuals without asking, as long as well-researched with verified sources (Tier 1: BBC, Reuters, AP, HRW, Amnesty, CPJ, OHCHR, government records; Tier 2: HKFP, RFA, NCHRD, Safeguard Defenders, CHRD)
- **CCP source exclusion:** Never cite Xinhua, CGTN, People's Daily, Global Times, China Daily, Ta Kung Pao, Wen Wei Po, tibet.cn, en.people.cn, or any CCP state/party media
- **Date verification:** Always cross-reference dates with 2+ independent sources
- **Profile template:** Follow established pattern (5 tabs: Timeline, Charges/Significance, CCP Narrative Analysis, International Response/Legacy, Sources)

### What's Immediately Actionable (no human input needed)
1. **Gui Minhai profile page** — next in queue, data exists in political_prisoners_research.json
2. **Profile index page** at `/profiles` — list all profiles with status indicators and links
3. **Additional profiles** — Agnes Chow, Nathan Law, Benny Tai, Cardinal Zen, Gao Zhisheng, Zhang Zhan
4. **Accessibility audit** — run automated WCAG 2.1 tests
5. **Multilingual translations** — fill in zh-TW, ug, bo locale files (currently skeleton)
6. **News feed integration** — add RSS feeds from trusted sources
7. **Update sanctions list** — check for new US/EU/UK/Canada/Australia sanctions

### What Needs Human Decisions
1. Email service choice for forms (HR3.3 in AGENT_ROADMAP.md)
2. Whether to implement backend cache system or remove documentation referencing it
3. Priority ranking for medium-term features (video testimonials, podcast player, event map, etc.)

---

## 📜 SESSION HISTORY

| Session | Date | Agent | Key Work |
|---------|------|-------|----------|
| 1-5 | Jan 2026 | Sonnet 3.5 | Initial build, 14 pages, 100+ components |
| 6-22 | Feb 18-19 | Opus 4.6 | Data verification, source attribution, security fixes, accessibility |
| 23-25 | Feb 18-19 | Investigation | Fabrication gap audit, AGENT_HANDOFF.json creation |
| 33-34 | Feb 19-20 | Opus 4.6 | Data verification (Zhang Zhan, Xu Zhiyong, Gui Minhai, Joshua Wong), deduplication |
| 35 | Feb 20 | Opus 4.6 | Documentation updates, roadmap V2/V3 sections |
| 36 | Feb 20 | Opus 4.6 | Honest "Coming Soon" notices on 4 non-functional forms, removed false security claims |
| 37 | Feb 20 | Opus 4.6 | "Illustrative targets" disclaimer on fake community statistics |
| 38-39 | Feb 20 | Opus 4.6 | Performance: lazy-loaded 81 sub-components across 8 pages (87-93% bundle reduction) |
| 40 | Feb 20 | Opus 4.6 | SEO: per-route meta descriptions for all 14 pages, 2 new tests (248 total) |
| 41 | Feb 20 | Opus 4.6 | Consolidated pending decisions, amended outdated questions |
| 42 | Feb 20 | Opus 4.6 | Implemented all 5 human decisions (D1-D5), standing instruction recorded |
| 43 | Feb 20 | Opus 4.6 | Jimmy Lai profile page (16 timeline events, 3 charges, 4 CCP narratives debunked) |
| 44 | Feb 20 | Opus 4.6 | Ilham Tohti profile page (19 events, Sakharov Prize, 7 students persecuted) |
| 45 | Feb 20 | Opus 4.6 | Panchen Lama profile page (16 events, "Why It Matters" section, Golden Urn debunked) |
| 46 | Feb 20 | Opus 4.6 | Liu Xiaobo memorial profile page (22 events, Charter 08, posthumous/memorial treatment) |
| 47 | Feb 20 | Opus 4.6 | Joshua Wong profile page (21 events, dual charges, HK47 trial, yellow theme) |
| 48 | Feb 20 | Opus 4.6 | Comprehensive TODO/handoff update for branch merge |
| 49 | Feb 20 | Opus 4.6 | Final consolidation: annotated 3 satellite TODOs, added Related TODO Files section |
| 50 | Feb 20 | Opus 4.6 | Renamed QUESTIONS_FOR_OWNER→QUESTIONS_FOR_HUMANS, fixed duplicate aria-label build warning |
| 51 | Feb 20 | Opus 4.6 | Moved all agent docs to `_agents/` folder, updated cross-references |
| 52 | Feb 20 | Opus 4.6 | Final cross-reference cleanup: fixed stale paths in AGENT_HANDOFF.json |
| 53 | Feb 20 | Opus 4.6 | Reorganized `_agents/` folder (research/, planning/ subdirs), built Profiles Index page at /profiles with 9 tests |
| 54 | Feb 20 | Opus 4.6 | Gui Minhai profile page: 14-event timeline, Causeway Bay Books context, 4 CCP narratives debunked, 10 sources, teal theme |
| 55 | Feb 20 | Opus 4.6 | ASCII/terminal design overhaul: monospace headings, box-drawing borders, terminal-green accents, redesigned sidebar/header/footer/loading/404 |

---

*This document is a living guide and should be updated regularly as priorities shift and new needs emerge.*
