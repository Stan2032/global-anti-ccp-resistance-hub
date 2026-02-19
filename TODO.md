# Global Anti-CCP Resistance Hub - Development To-Do List

> Last Updated: February 19, 2026
> 
> This document tracks planned improvements, features, and maintenance tasks for the platform.
> Items are categorized by timeframe and priority.

---

## 🔴 SHORT-TERM (1-2 weeks)

### High Priority
- [ ] **Multilingual Support**: Add translations for key pages (Chinese Traditional, Uyghur, Tibetan, Vietnamese, Korean, Japanese)
- [x] **Mobile App Banner**: Add "Add to Home Screen" prompt for PWA installation ✅
- [ ] **Accessibility Audit**: Run automated accessibility tests and fix any WCAG 2.1 violations
- [ ] **Performance Optimization**: Implement code splitting for large components, optimize images
- [ ] **SEO Improvements**: Add meta tags, Open Graph tags, structured data for search engines

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
- [ ] **Verify academic experts data**: Check affiliations and current positions
- [ ] **Verify forced labor companies list**: Cross-reference with ASPI and UFLPA entity list
- [x] **Verify Confucius Institute data**: US: 4 remaining, 104 closed. Many rebranded. Via GAO report ✅

### Expanded Person Profiles (NEW — requested by project owner)
- [ ] **Create detailed person profile pages**: Full timeline pages for key individuals targeted by CCP
  - [ ] **Jimmy Lai profile page**: Complete timeline from birth to sentencing
    - [ ] Early life and business career
    - [ ] Apple Daily founding (1995) and editorial stance
    - [ ] 2014 Umbrella Movement involvement
    - [ ] 2019 protest coverage and CCP targeting begins
    - [ ] August 10, 2020: Arrested under NSL
    - [ ] 2021: Apple Daily forced to close (June 24)
    - [ ] 2022-2025: Trial proceedings (156 days)
    - [ ] December 15, 2025: Found guilty on all charges
    - [ ] February 9, 2026: Sentenced to 20 years
    - [ ] CCP narrative control breakdown with sourced rebuttals
    - [ ] International response timeline
    - [ ] All source links (HRW, CPJ, BBC, US State Dept, HKFP, etc.)
  - [ ] **Ilham Tohti profile page**: From academic career to life sentence
    - [ ] Academic work at Minzu University
    - [ ] Uighurbiz.net and advocacy for Han-Uyghur dialogue
    - [ ] January 15, 2014: Arrested
    - [ ] September 23, 2014: Sentenced to life
    - [ ] Sakharov Prize (2019), other awards
    - [ ] CCP "separatist" narrative vs reality (dialogue advocate)
  - [ ] **Gedhun Choekyi Nyima (Panchen Lama) profile page**
    - [ ] Recognition by Dalai Lama (May 14, 1995)
    - [ ] Abduction (May 17, 1995)
    - [ ] 30 years of enforced disappearance
    - [ ] CCP's installation of Gyaltsen Norbu
    - [ ] International advocacy efforts
  - [ ] **Liu Xiaobo profile page** (posthumous)
    - [ ] Charter 08 and Nobel Peace Prize
    - [ ] 11-year sentence and death in custody (July 13, 2017)
    - [ ] Liu Xia (wife) house arrest and eventual exile
  - [ ] **Joshua Wong profile page**
    - [ ] Scholarism movement and Umbrella Revolution
    - [ ] Multiple arrests and sentences
    - [ ] Hong Kong 47 case (4 years 8 months)
  - [ ] **Gui Minhai profile page**
    - [ ] Causeway Bay Books and cross-border abduction from Thailand
    - [ ] Swedish citizenship and diplomatic crisis
    - [ ] 10-year espionage sentence
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

## 🎯 CURRENT SPRINT

### In Progress
1. [ ] Accessibility audit and improvements

### Up Next
1. Performance optimization
2. Mobile App Banner for PWA
3. News Feed Integration

### Recently Completed
- ✅ PWA Install Banner with iOS/Android support
- ✅ Case Study Deep Dives (Jimmy Lai, Ilham Tohti, Panchen Lama)
- ✅ Reading Progress Tracker with achievements
- ✅ CCP Officials Database (8 officials, sanctions tracking)
- ✅ Interactive Timeline with 21 key events (1989-2025)
- ✅ December 2025 political prisoner updates (Jimmy Lai verdict, Xin Ruoyu, Guan Heng)
- ✅ Enhanced SEO with structured data schemas
- ✅ Multilingual Support Foundation (English, Traditional Chinese, Uyghur, Tibetan)
- ✅ Language files and i18n context
- ✅ Witness Protection Guide
- ✅ Petition Generator
- ✅ Regional Issues (Inner Mongolia, Falun Gong, etc.)
- ✅ Source Verification Tool
- ✅ Quick Start Guide

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

*This document is a living guide and should be updated regularly as priorities shift and new needs emerge.*
