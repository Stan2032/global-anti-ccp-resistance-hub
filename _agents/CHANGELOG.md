# CHANGELOG

All notable changes to the Global Anti-CCP Resistance Hub.

## [3.1.0] - 2026-02-25

### Added - Supabase Integration, New Profiles, Cloudflare Fix (Sessions 81-82)
- **Supabase Integration**: @supabase/supabase-js v2.97.0 client + service layer
  - `supabaseClient.js` — graceful null fallback when env vars are unset
  - `supabaseService.js` — 4 form helpers: incident reports, volunteer signups, newsletter, contact messages
  - IncidentReportForm wired to submit to Supabase (hides "Coming Soon" when configured)
  - CSP `connect-src` updated for `https://*.supabase.co`
  - 7 graceful-degradation tests + 1 CSP test

- **3 New Profile Pages** (12→15 total):
  - Tashi Wangchuk — Tibetan language rights advocate, 5yr for "inciting separatism"
  - Ren Zhiqiang — CCP insider, 18yr after criticizing Xi's COVID response
  - Xu Zhiyong — New Citizens Movement founder, 14yr for "subversion"
  - ProfilesIndex, App.jsx routes, GlobalSearch, sitemap.xml all updated

- **Deployment Guides**:
  - `SUPABASE_SETUP.md` — Click-by-click from dashboard to working connection. Single SQL block for tables + RLS.
  - `CLOUDFLARE_DEPLOY.md` — Repo connection, build settings, env vars, troubleshooting.
  - `.env.example` — Documents VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

### Fixed
- **Cloudflare Pages build failure**: Removed stale `pnpm-lock.yaml` that caused Cloudflare to use pnpm instead of npm, breaking `--frozen-lockfile` check
- **Newsletter upsert**: `ignoreDuplicates: true` instead of overwriting `subscribed_at` on re-subscribe

### Changed
- Tests: 535→546 across 26→27 files
- Agent docs: AGENT_HANDOFF.json v6.0→v7.0, NEXT_AGENT_PROMPT.md, TODO.md, TODO_COMPLETED.md all updated

## [3.0.0] - 2026-02-25

### Added - Data Quality & Integrity (Sessions 72-80)
- **CCP Influence Detection System**: Centralized in `sourceLinks.js`
  - 21 CCP state media names + 13 domains in never-cite registry
  - 15 elevated-risk entries (proxy media, United Front, Confucius Institutes, think tanks, Spamouflage)
  - 4 exported utility functions: `isCCPStateMedia()`, `isCCPDomain()`, `getCCPInfluenceRisk()`, `assessSourceRisk()`
  - 37-test dedicated test suite
  - All data test files now import from shared registry (no duplicate blocklists)

- **Timeline Completion**: 22→31 events covering 1989-2026
  - Added: HK Handover (1997), Tiananmen Self-Immolation (2001), 500K Article 23 March (2003), Charter 08 (2008), Nobel Prize (2010), Wukan (2011), Tibet Immolation Wave (2012), Term Limits Abolished (2018), Article 23 Passage (2024)
  - All gaps filled, sorted chronologically with verified Tier 1/2 sources

- **PWA Icons**: Generated icon-192.png and icon-512.png from favicon.svg (were missing)
- **Sitemap**: Removed 4 redirect routes, added 13 missing pages (profiles index + 12 profiles)
- **Sanctions Source URLs**: All 35 entries now link to official government registries
- **Research Schema Consistency**: All 10 JSON files have `source_url` (HTTPS), tests enforce ≥90% coverage
- **Hong Kong Handover** timeline event with BBC/Reuters/UK Gov sources

### Added - Test Coverage (Sessions 72-80)
- 306→535 tests across 17→26 test files
- New test suites: timeline-events, sitemap, manifest/PWA, security-headers, political-prisoners, CCP-tactics, CCP-influence-detection, sanctions-tracker, live-data-service, research-data, security-center

### Changed
- **Dashboard statistics**: Replaced fabricated numbers with real counts from verified JSON data files + source attribution
- **Political prisoners service**: Dynamic import from `political_prisoners_research.json` (62 entries) instead of hardcoded 5-item array
- **Dashboard stat cards**: Honest labels ("In database", "ASPI estimate", "Documented cases") replacing fake change metrics
- **GlobalSearch**: All 12 profile pages now searchable with amber badge type
- **ESLint**: Backend ecmaVersion 2020→2022, 3 `react-hooks/exhaustive-deps` bugs fixed, 0 errors (was 5)
- **CSP headers**: Added CORS proxy domains to `connect-src` (RSS feeds were blocked)
- **HTTP→HTTPS**: Fixed insecure URLs in data files

### Removed
- Dead `feedValidator`/`checkFeedHealth` code (returned fake "operational" status)
- Dead `simulatedLiveData` object and `validateSource` fake timestamp generator
- Fabricated Dashboard statistics and change metrics
- 4 stale redirect routes from sitemap

### Documentation
- Agent documentation centralized and updated (AGENT_HANDOFF.json v6.0)
- TODO split: active tasks in TODO.md, archive in TODO_COMPLETED.md
- AGENTS.md: Agent capability matrix with 14-row task assignment table
- Session thoughts for Sessions 72, 75, 78 documenting decisions
- README: Fixed test count, language count, file references

## [2.31.0] - 2025-12-30

### Added - Security & Memorial Features
- **Victim Memorial Wall Component**: Honoring victims of CCP persecution
  - 15 documented victims across 6 categories (Uyghur, Hong Kong, Tibet, Tiananmen, Dissident, Falun Gong)
  - Detailed victim profiles with dates, locations, causes of death
  - Search and filter by category
  - Verified sources for each victim
  - Statistics dashboard showing victim counts by category
  - Links to memorial organizations (Tiananmen Mothers, UHRP, ICT)
  - Information about incomplete documentation due to CCP censorship
  
- **Offline Mode Manager Component**: Offline access capabilities
  - Service worker integration for offline functionality
  - Cache status monitoring and management
  - Storage usage tracking with quota management
  - Critical pages auto-cached for offline access
  - Enable/disable offline mode with one click
  - Clear cache functionality
  - Instructions for using offline mode
  - Why offline mode matters (censorship, network disruptions, privacy)
  
- **Whistleblower Portal Component**: Secure document submission guidance
  - 4-step guided process for secure submissions
  - Security checklist (Tor, VPN, device security, no personal info)
  - 6 trusted submission organizations (ICIJ, The Intercept, NYT, RFA, HRW, Amnesty)
  - Document type guidance (internal docs, police files, financial records, evidence)
  - Final checklist before submission
  - Links to secure submission portals (SecureDrop, Tor-enabled)
  - Critical security warnings throughout
  - Resources for source protection and anonymity
  
- **AI Disinformation Detector Component**: CCP propaganda pattern analysis
  - Text analysis for 6 propaganda patterns (Denial, Whataboutism, Deflection, Euphemism, Victim Blaming, False Equivalence)
  - Risk score calculation (0-100)
  - Flagged keywords and phrases highlighting
  - Detected pattern breakdown with confidence scores
  - Recommendations based on risk level
  - Example texts for testing
  - Propaganda patterns reference guide
  - Links to resources on CCP propaganda tactics

### Integration
- Victim Memorial Wall added to Community Support page (new 'memorial' tab)
- Offline Mode Manager added to Security Center (new 'offline' tab)
- Whistleblower Portal added to Security Center (new 'whistleblower' tab)
- AI Disinformation Detector added to Education Center (new 'detector' tab)
- All components fully integrated with tab navigation
- Consistent UI/UX across all new features

### Technical Improvements
- Build successful with all 4 new major components
- Total platform now includes 115+ components
- Education Center expanded to 17 tabs
- Security Center expanded to 9 tabs
- Community Support expanded to 12 tabs
- Service worker foundation laid for offline capabilities
- Pattern matching algorithm for propaganda detection

---

## [2.30.0] - 2025-12-28

### Added - Education & Legal Resources
- **Podcast Player Component**: Enhanced podcast library for Education Center
  - 8 curated podcasts covering China, Xinjiang, Hong Kong, Tibet
  - Episode listings with duration and descriptions
  - Category filtering (News & Analysis, Xinjiang, Hong Kong, Tibet, etc.)
  - Direct play links and RSS feed subscriptions
  - Recommended podcasts highlighted
  - Search functionality across titles and descriptions
  
- **Legal Resources Hub Component**: Country-specific legal information
  - 6 countries/regions covered (US, Canada, UK, Australia, Germany, International)
  - Topics: Asylum, Immigration, Transnational Repression, BN(O) Visa, Protection Visa
  - 20+ legal resources with guides, directories, and legal documents
  - Emergency contact information for each country
  - Step-by-step guides for asylum applications
  - How to report CCP harassment to authorities
  - Language support indicators for each resource
  
- **Academic Citation Generator Component**: Research paper citation tool
  - 10 key sources pre-formatted for citations
  - 4 citation styles: APA, MLA, Chicago, Harvard
  - One-click copy to clipboard functionality
  - Sources include: UN reports, leaked documents, books, articles, documentaries
  - Direct links to original sources
  - Citation best practices guide
  - Links to additional citation tools (Zotero, Mendeley, Purdue OWL)

### Integration
- Podcast Player replaces PodcastList in Education Center
- Academic Citation Generator added as new tab in Education Center
- Legal Resources Hub added to Resources page
- All components feature search, filtering, and responsive design
- Consistent dark theme styling across all new components

### Technical Improvements
- Build successful with all new components
- Total platform now includes 110+ components
- Education Center expanded to 16 tabs
- Resources page expanded with 3 major new sections

---

## [2.29.0] - 2025-12-26

### Added - New Resource Components
- **Video Testimonials Component**: Embedded video testimonies from survivors
  - Featured testimonies from Sayragul Sauytbay, Mihrigul Tursun, Tursunay Ziyawudun
  - Documentary excerpts from major films
  - Organized by category (Survivor, Documentary, Witness, Expert)
  - Direct YouTube embeds for immediate viewing
  - Content warnings for sensitive material
  
- **Diaspora Directory Component**: Community resources for diaspora groups
  - 12 diaspora communities covered (Uyghur, Hong Kong, Tibetan, Chinese, Mongolian, etc.)
  - Support organizations and contact information
  - Key issues and challenges for each community
  - Resources for legal aid, mental health, advocacy
  - Geographic distribution and population estimates
  
- **Media Bias Guide Component**: Comprehensive guide to evaluating news sources
  - 16 news sources analyzed with credibility ratings
  - Categories: Trustworthy, Use with Caution, CCP Propaganda, Problematic
  - Detailed strengths and weaknesses for each source
  - Funding transparency and bias indicators
  - Tips for evaluating sources and spotting propaganda
  - Search and filter functionality
  
- **Historical Documents Archive Component**: Key documents exposing CCP abuses
  - 15+ critical documents including leaked files and official records
  - Categories: Leaked Documents, Official Documents, Speeches, International Reports
  - Xinjiang Police Files, China Cables, Karakax List
  - UN reports, tribunal judgments, research reports
  - Downloadable documents with verification status
  - Significance ratings (Critical/High/Medium)
  - Document metadata (pages, language, date, source)

### Integration
- All new components integrated into Resources page
- Responsive design with dark theme consistency
- Search and filtering capabilities across all components
- External links to primary sources and documents

---

## [2.28.0] - 2025-12-25

### Added - Wide Research Batch 4
- **Government Response Tracker**: 30 countries/entities researched in parallel
  - Genocide recognition status (12 countries recognized or debated)
  - Sanctions imposed on CCP officials and entities
  - Legislative actions (Magnitsky acts, forced labor laws)
  - Diplomatic actions (Olympic boycotts, ambassador recalls)
  - Overall stance ratings (Strong/Moderate/Weak/Silent)
  - Search and filter by stance or genocide recognition
  - Statistics dashboard showing global response metrics
  - Direct links to official government sources

### Countries Covered
- **Strong Stance**: United States, Lithuania, Czech Republic
- **Moderate Stance**: UK, Canada, Australia, Germany, France, Netherlands, Belgium, Sweden, Norway, Denmark, Finland, Poland, Latvia, Estonia, Japan, New Zealand, Ireland, Switzerland, Austria, Italy, Spain, Portugal, European Union
- **Weak/Silent**: South Korea, Taiwan, India, Philippines

### Research Data
- 30 countries researched in parallel
- All data verified from official government sources
- Integrated into Take Action page

---

## [2.27.0] - 2025-12-24

### Added - Wide Research Batch 3
- **Detention Facilities Tracker (Enhanced)**: 20 regions researched in parallel
  - Detailed facility information including capacity, evidence, and satellite imagery links
  - Regional filtering and search functionality
  - Statistics dashboard showing total facilities and capacity
  - ASPI Xinjiang Data Project integration
- **Forced Labor Tracker**: 30 companies researched in parallel
  - Company status ratings (Avoid, Concern, Improving, Good)
  - Evidence and source citations for each company
  - Industry filtering and search
  - UFLPA enforcement tracking
  - Recommended consumer actions
- **Academic Experts Directory**: 25 leading scholars researched in parallel
  - Expertise areas (Xinjiang, Tibet, Hong Kong, China Politics)
  - Key works and media presence
  - CCP targeting documentation
  - Twitter links and profile sources
  - Credibility verification

### Research Data
- 75 items researched in parallel across 3 categories
- All data verified from credible sources
- Integrated into Regional Threats and Resources pages

---

## [2.26.0] - 2025-12-23

### Added - Wide Research Integration (Batch 2)
- **Confucius Institute Tracker**: 50 countries researched in parallel
  - Total institutes per country with closure tracking
  - Government actions and university responses
  - Filter by status (Open, Closed, Under Review) and region
  - Statistics dashboard with global totals
- **Organizations Directory**: 50 human rights organizations researched
  - Contact information and donation links
  - Focus areas and credibility ratings
  - Key reports and leadership profiles
  - Category filtering (Advocacy, Research, Legal, Media, Direct Support)
- **Sanctioned Officials Tracker**: 20 officials with detailed sanctions data
  - US, UK, EU, Canada, Australia sanctions status
  - Key abuses documented with sources
  - Current positions and status tracking
  - Multi-country sanction comparison

### Research Data
- 120 new parallel research subtasks completed
- Data integrated into Regional Threats, Resources, and CCP Tactics pages
- JSON research files stored in /src/data/

---

## [2.25.0] - 2025-12-21

### Added - Wide Research Integration
- **Parallel Research Execution**: Used Wide Research mode to research 110 items in parallel
- **Political Prisoners Database**: 60 cases researched and verified with current status
  - Updated Jimmy Lai case with December 2025 life sentence verdict
  - Updated Zhang Zhan with second 4-year sentence (September 2025)
  - Verified status of all Hong Kong 47 defendants
  - Added latest news for Xu Zhiyong hunger strike
  - Updated Nathan Law Singapore deportation news
- **Recent News Database**: 20 topics researched with latest developments
  - Jimmy Lai verdict coverage
  - Hong Kong 47 sentencing updates
  - UFLPA enforcement actions
  - Overseas police station investigations
  - Confucius Institute closures
- **Police Stations Database**: 30 locations verified with current status
  - Documented closures in Netherlands, UK, Ireland, Canada
  - Tracked arrests in NYC (2 arrested April 2023)
  - Government responses from 20+ countries
- **Research Dashboard Component**: New interactive dashboard displaying all research data
  - Overview tab with statistics
  - Political Prisoners tab with search and filter
  - Recent News tab with significance ratings
  - Police Stations tab with status tracking
- **Data Export**: All research data available in JSON format

### Technical
- Created `/src/data/` directory for research data storage
- Added `researchData.js` data loader with statistics
- Integrated research results into Dashboard page

---

## [2.24.0] - 2025-12-20

### Added
- **Event Map**: Interactive global map showing upcoming events worldwide with 8 events across 6 cities (London, Toronto, Berlin, New York, Taipei, Melbourne)
- **Detention Facility Database**: Comprehensive database of 12 documented detention facilities with satellite imagery links, capacity estimates, and evidence sources
- **Memorial Wall**: Tribute to victims of CCP repression with 15 documented cases, candle lighting feature, and memorial resources
- **Campaign Progress Tracker**: Track 5 major advocacy campaigns with milestones, metrics, and action items:
  - Free Jimmy Lai (50% complete)
  - End Uyghur Forced Labor (40% complete)
  - Close Overseas Police Stations (80% complete)
  - Support Hong Kong 47 (80% complete)
  - Recognize Uyghur Genocide (80% complete)

### Enhanced
- Community page now has 11 tabs including new Events and Map tabs
- Political Prisoners page now includes Memorial Wall
- Regional Threats page now includes Detention Facility Database
- Take Action page now includes Campaign Progress Tracker

---

## [2.23.0] - 2025-12-20

### Added
- **PWA Install Banner**: Prompts users to install the app on mobile/desktop
  - iOS-specific instructions for Add to Home Screen
  - Android/Chrome install prompt integration
  - Dismissible with 7-day cooldown
  - Benefits display (offline, quick access, no app store)

- **Case Study Deep Dives**: In-depth profiles for major political prisoner cases
  - Jimmy Lai: Complete timeline, charges, verdict, international response
  - Ilham Tohti: Sakharov Prize laureate, life sentence for "separatism"
  - Panchen Lama: 30 years of enforced disappearance
  - Expandable sections, how to help, verified sources

- **Reading Progress Tracker**: Track your learning journey
  - 18 reading materials (books, reports, articles)
  - Progress tracking with page numbers
  - 6 achievements to unlock
  - Category and type filtering
  - Essential readings highlighted
  - Progress saved in browser

- **CCP Officials Database**: Key officials responsible for human rights abuses
  - 8 officials profiled (Xi Jinping, Chen Quanguo, Carrie Lam, John Lee, etc.)
  - Sanctions status from US, UK, EU, Canada
  - Areas of responsibility and key actions timeline
  - Searchable and filterable

### Updated
- Political Prisoners page now includes Case Studies section
- Education Center now has 15 tabs including Progress tracker
- CCP Tactics page now includes Officials Database

---

## [2.22.0] - 2025-12-20

### Added
- **Interactive Timeline**: Comprehensive timeline component with 21 key events from 1989-2025
  - Events include: Tiananmen Massacre, Panchen Lama abduction, Falun Gong persecution, Umbrella Movement, 709 Crackdown, Xinjiang camps, NSL, Jimmy Lai verdict
  - Category filtering (Hong Kong, Uyghur, Tibet, Mainland, Falun Gong, Global)
  - Auto-play mode with 3-second intervals
  - Zoom controls for timeline visualization
  - Detailed event cards with casualties, sentences, impact, and sources
  - Critical event highlighting
  - Statistics dashboard

### Updated
- Education Center Timeline tab now uses enhanced InteractiveTimeline component
- TODO.md with current sprint progress

---

## [2.21.0] - 2025-12-20

### Added
- **Multilingual Support Foundation**: Added comprehensive language files for:
  - English (en)
  - Traditional Chinese 繁體中文 (zh-TW)
  - Uyghur ئۇيغۇرچە (ug) with RTL support
  - Tibetan བོད་སྐད། (bo)
- **i18n Context**: Language switching infrastructure with automatic RTL support
- **December 2025 Political Prisoner Updates**:
  - Updated Jimmy Lai case with December 15, 2025 guilty verdict on all 3 charges
  - Added Xin Ruoyu - young mother forcibly disappeared into "black jail" (July 2024)
  - Added Guan Heng - citizen journalist who filmed Uyghur camps, facing deportation from US
- **Enhanced SEO Structured Data**:
  - Dataset schema for Political Prisoners Database
  - EducationalOrganization schema for Education Center
  - FAQPage schema with common questions
  - BreadcrumbList schema for navigation
- **AT RISK Status**: New status category for individuals facing deportation or imminent danger

### Updated
- Political Prisoners Database now includes 57+ documented cases
- CECC 2025 Annual Report references (11,262 political prisoners documented)
- International response tracking for high-profile cases (UK, US, EU condemnations)
- TODO.md with comprehensive development roadmap

---

## [2.20.0] - 2025-12-20

### New Features

#### Witness Protection Guide (Security Center)
- Comprehensive guide for at-risk individuals
- 6 protection levels from basic to emergency
- 15+ organizations offering protection services
- Step-by-step protocols for different risk scenarios
- Resources for asylum seekers, journalists, and activists
- Emergency contact information
- Legal protection guidance

#### Petition Generator (Take Action Page)
- Create custom petitions with 6 templates:
  - Free Political Prisoner
  - End Forced Labor
  - Close Police Stations
  - Protect Hong Kong
  - Support Taiwan
  - Sanction Officials
- Auto-generated petition text
- Customizable fields (name, target, demands)
- Shareable links
- Copy to clipboard functionality

#### Regional Issues (Regional Threats Page)
- Coverage of additional persecuted groups:
  - Inner Mongolia (Mongolian language ban, cultural destruction)
  - Southern Mongolia (mining, displacement)
  - Falun Gong (organ harvesting, persecution)
  - House Christians (church demolitions, arrests)
  - Chinese Dissidents (lawyers, journalists, activists)
- 25+ documented cases with sources
- Key figures and organizations for each group
- Action items and resources

#### Source Verification Tool (Education Center)
- Guide to trusted sources with 15+ vetted organizations:
  - Research: ASPI, Safeguard Defenders, UHRP, HRW, Amnesty, Freedom House
  - Government: Uyghur Tribunal, CECC, UK Foreign Affairs Committee
  - Media: RFA, HKFP, The China Project, AP
  - Academic: Xinjiang Victims Database, Xinjiang Police Files, Dr. Adrian Zenz
- Unreliable sources warning (Global Times, CGTN, Xinhua, China Daily, The Grayzone)
- Verification tips and CCP disinformation tactics guide
- Search and category filtering

#### Quick Start Guide
- Interactive 7-step onboarding tutorial for new users
- Progress tracking with localStorage
- Links to key platform sections
- Skip option for returning users
- Help menu with keyboard shortcuts

### Technical Additions
- WitnessProtection component on Security page (new "protection" tab)
- PetitionGenerator component on Take Action page
- RegionalIssues component on Regional Threats page
- SourceVerification component in Education Center (new "sources" tab)
- QuickStartGuide component with modal interface
- Education Center now has 14 tabs
- Security Center now has 7 tabs

---

## [2.19.0] - 2025-12-20

### New Features

#### Social Media Toolkit (Take Action Page)
- Ready-to-share content for advocacy campaigns
- 3 pre-written Twitter/X threads:
  - Uyghur Genocide 101 (6 tweets)
  - Hong Kong Crackdown Explained (6 tweets)
  - CCP Overseas Police Stations (6 tweets)
- 5 single posts for quick sharing
- 5 hashtag sets by topic (Uyghur, Hong Kong, Tibet, Taiwan, General)
- 7 key dates calendar with hashtags
- Copy-to-clipboard functionality
- Social media tips for maximum impact

#### Event RSVP System (Community Page)
- Track and RSVP to upcoming events
- 6 events including:
  - Global Day of Action for Jimmy Lai
  - Uyghur Genocide Awareness Webinar
  - Tibetan Uprising Day Commemoration
  - Hong Kong Watch Parliamentary Briefing
  - Tiananmen Square Vigil
  - Forced Labor Supply Chain Workshop
- RSVP tracking with localStorage persistence
- Set reminders for events
- Add to Google Calendar integration
- Filter by upcoming, RSVPs, and reminders

#### Disinformation Tracker (Education Center)
- Track and debunk CCP propaganda
- 10 documented false claims with rebuttals:
  - "Vocational training centers" myth
  - Hong Kong protesters as "terrorists"
  - Taiwan "always part of China"
  - Tibet "peaceful liberation"
  - COVID-19 origin conspiracy
  - Police stations as "service centers"
  - Jimmy Lai as "criminal"
  - Birth rate decline "voluntary"
  - Dalai Lama smears
  - "Western bias" deflection
- Severity ratings (Critical, High, Medium)
- Source citations and debunking references
- Tips for countering disinformation

#### Personal Safety Checklist (Security Center)
- Comprehensive security checklist for activists
- 42 items across 6 categories:
  - Digital Security (10 items)
  - Communication (6 items)
  - Physical Safety (6 items)
  - Travel Safety (6 items)
  - Legal Preparation (5 items)
  - Emergency Plan (6 items)
- Priority levels (Critical, High, Medium)
- Progress tracking with localStorage
- Resource links for each item
- Emergency contacts section

### Technical Additions
- SocialMediaToolkit component on Take Action page
- EventRSVP component on Community page (Events tab)
- DisinfoTracker component on Education page (Disinfo tab)
- SafetyChecklist component on Security page (Checklist tab)

---

## [2.18.0] - 2025-12-20

### New Features

#### Donation Guide (Take Action Page)
- Comprehensive guide to supporting human rights organizations
- 17 vetted organizations across 6 categories:
  - Advocacy (6): UHRP, CFU, HKW, CFHK, HKDC, ICT
  - Legal Aid (2): Front Line Defenders, Lawyers for Lawyers
  - Research (3): Safeguard Defenders, Tibet Action Institute, ASPI
  - Independent Media (2): Radio Free Asia, Hong Kong Free Press
  - Direct Support (2): Uyghur American Association, China Aid
- Tax deductibility indicators
- Impact descriptions and ratings
- Direct donation links

#### Letter Writing Campaigns (Take Action Page)
- Ready-to-use letter templates for advocacy
- 4 active campaigns:
  - Free Jimmy Lai (Critical)
  - End Uyghur Forced Labor (High)
  - Investigate CCP Police Stations (High)
  - Support Hong Kong 47 (High)
- Personalization fields (name, location)
- Copy-to-clipboard functionality
- Background context and key asks
- Links to find representatives

#### Company Accountability Tracker (Resources Page)
- Track corporate complicity in CCP human rights abuses
- 19 companies across 6 categories:
  - Fashion (5): Shein, Nike, H&M, Zara, Uniqlo
  - Technology (4): Apple, Dell, Hikvision, TikTok
  - Automotive (3): Volkswagen, Tesla, BMW
  - Retail (3): Amazon, Walmart, Costco
  - Food (2): Coca-Cola, PepsiCo
  - Finance (2): BlackRock, MSCI
- Status ratings: Avoid, Concern, Improving, Good
- Evidence and source citations
- Recommended actions
- Search and category filtering

#### News Digest Subscription (Dashboard)
- Subscribe to curated news updates
- Frequency options: Daily, Weekly, Breaking News Only
- 9 topic categories to customize
- 3 format options: Summary, Detailed, Links Only
- Preview of recent digests
- Alternative news sources

### Technical Additions
- DonationGuide component on Take Action page
- LetterCampaign component on Take Action page
- CompanyTracker component on Resources page
- NewsDigest component on Dashboard

---

## [2.17.0] - 2025-12-20

### New Features

#### Media Gallery (Resources Page)
- Visual documentation of resistance and repression
- 18 items across 5 categories:
  - Hong Kong (4): Umbrella Movement, Lennon Walls, Human Chain, Be Water
  - Uyghur (3): East Turkestan Flag, Camp Satellite Images, Xinjiang Police Files
  - Tibet (3): Tibetan Flag, Self-Immolation Memorials, 2008 Protests
  - Infographics (4): Police Stations Map, Forced Labor Supply Chain, NSL Timeline, Genocide Evidence
  - Symbols (4): Yellow Umbrella, Wilted Bauhinia, Tank Man, Blank Paper
- Click-to-expand detail modal
- Category filtering
- Tags and significance explanations

#### Sanctions Tracker (Take Action Page)
- Track international sanctions on CCP officials and entities
- 18 sanctions from 5 countries:
  - United States (8): Chen Quanguo, Zhu Hailun, Wang Junzheng, XPCC, Hikvision, Carrie Lam, John Lee, Xinjiang Cotton
  - United Kingdom (3): Chen Quanguo, Zhu Hailun, Xinjiang PSB
  - European Union (3): Chen Quanguo, Wang Junzheng, XPCC
  - Canada (2): Chen Quanguo, Wang Junzheng
  - Australia (2): Chen Quanguo, Wang Junzheng
- Filter by country and sanction type
- Statistics dashboard
- Links to official sanction lists

#### Language Phrase Guide (Education Center)
- Solidarity phrases in 5 languages:
  - Cantonese (6 phrases): Hong Kong slogans and greetings
  - Uyghur (6 phrases): Independence slogans and basics
  - Tibetan (6 phrases): Free Tibet slogans and greetings
  - Mandarin (6 phrases): Democracy concepts and slogans
  - Taiwanese (6 phrases): Identity and solidarity phrases
- Native script, romanization, and pronunciation
- Click to copy functionality
- Context and usage notes

#### Volunteer Sign-up (Community Page)
- Comprehensive volunteer application form
- 10 skill categories (translation, research, social media, etc.)
- 12 language options
- 8 areas of interest
- Availability selection
- Security notice for sensitive situations
- Links to partner organizations seeking volunteers

### Technical Additions
- MediaGallery component on Resources page
- SanctionsTracker component on Take Action page
- LanguageGuide component in Education Center (new "phrases" tab)
- VolunteerSignup component on Community page (new "signup" tab)
- Education Center now has 12 tabs
- Community page now has 9 tabs

---

## [2.16.0] - 2025-12-20

### New Features

#### Live Statistics Counter (Dashboard)
- Animated statistics showing the human cost of CCP repression
- 8 key metrics with sources:
  - Political Prisoners: 10,000+
  - Uyghurs Detained: 1.8M+
  - Overseas Police Stations: 102+
  - Confucius Institutes: 407+
  - HK Political Prisoners: 260+
  - Forced Returns: 230,000+
  - Journalists Imprisoned: 44
  - Organ Harvesting Victims: 65,000+
- Animated number counters with intersection observer
- Trend indicators and source citations
- Context cards explaining data significance

#### Solidarity Wall (Community Page)
- Message board for global solidarity
- 8 pre-populated messages from around the world
- Add your own message with name, location, and cause
- Filter by cause (Hong Kong, Uyghur, Tibet, Taiwan, General)
- LocalStorage persistence
- Statistics showing messages, locations, and causes
- Inspirational quotes

#### Emergency Alerts (Dashboard)
- Dismissible alert banners for urgent news
- 4 current alerts:
  - Jimmy Lai verdict (Critical)
  - Uyghur forced labor report (Warning)
  - Taiwan PLA activity (Info)
  - Hong Kong 47 sentencing (Critical)
- Expandable details with action items
- Links to relevant resources
- Dismiss functionality with restore option

#### Knowledge Quiz (Education Center)
- 18 multiple choice questions across 5 categories:
  - Uyghur Crisis (4 questions)
  - Hong Kong (4 questions)
  - Tibet (3 questions)
  - CCP Tactics (4 questions)
  - General (3 questions)
- Category selection before starting
- Explanations after each answer
- Score tracking and results
- Recommendations based on score

### Technical Additions
- LiveStatistics component with AnimatedCounter
- SolidarityWall component on Community page (new "solidarity" tab)
- EmergencyAlerts component at top of Dashboard
- KnowledgeQuiz component in Education Center (new "quiz" tab)
- Education Center now has 11 tabs
- Community page now has 8 tabs

---

## [2.15.0] - 2025-12-20

### New Features

#### Countdown Timer (Dashboard)
- Live countdown to 8 important dates:
  - Tiananmen Square Anniversary (June 4)
  - Hong Kong Handover Anniversary (July 1)
  - Tibetan Uprising Day (March 10)
  - Uyghur Human Rights Day (July 5)
  - Human Rights Day (December 10)
  - Taiwan National Day (October 10)
  - Panchen Lama Abduction Anniversary (May 17)
  - Hong Kong NSL Anniversary (June 30)
- Featured countdown for next upcoming event
- Suggested actions for each date
- Event type badges (memorial, awareness, action, solidarity)
- Links to calendar apps

#### Survivor Stories (Community Page)
- 8 verified testimonies from survivors and activists:
  - Tursunay Ziawudun (Uyghur camp survivor)
  - Gulbahar Haitiwaji (French citizen detained)
  - Nathan Law (Hong Kong activist in exile)
  - Glaciar Chow (HK councillor in exile)
  - Lobsang Sangay (Former Tibetan leader)
  - Ai Weiwei (Artist and activist)
  - Chen Guangcheng (Blind activist)
  - Jewher Ilham (Daughter of Ilham Tohti)
- Category filtering (Uyghur, Hong Kong, Tibet, Dissidents, Family)
- Expandable full stories with sources
- Verified testimony badges
- Links to testimony databases

#### Resource Bookmarks (Resources Page)
- Personal bookmark manager for saving resources
- 6 categories: Resources, Organizations, News, Research, Action, Tools
- 10 suggested bookmarks from key organizations
- Add custom bookmarks with notes
- Export/Import bookmarks as JSON
- LocalStorage persistence

#### Activist Toolkit (Take Action Page)
- 20 downloadable resources across 5 categories:
  - Graphics & Banners (4): Protest banners, profile frames, posters
  - Letter Templates (4): Representative letters, company letters, media pitches
  - Fact Sheets (4): Genocide facts, timelines, maps, company lists
  - How-To Guides (4): Advocacy, protests, security, media interviews
  - Social Media (4): Thread templates, story templates, hashtag guides
- Format and size information
- Category filtering
- Usage guidelines

### Technical Additions
- CountdownTimer component on Dashboard
- SurvivorStories component on Community page (new "stories" tab)
- Bookmarks component on Resources page
- ActivistToolkit component on Take Action page

---

## [2.14.0] - 2025-12-20

### New Features

#### Action Tracker (Take Action Page)
- Personal progress tracking system with gamification elements
- **25 trackable actions** across 5 categories:
  - Raise Awareness (5 actions): Share articles, discuss with friends, create posts, attend/organize events
  - Political Advocacy (5 actions): Sign petitions, email/call/meet representatives, testify at hearings
  - Economic Action (5 actions): Check labels, avoid forced labor companies, donate, divest, support diaspora businesses
  - Self-Education (5 actions): Read articles/books, watch documentaries, take courses, learn languages
  - Direct Support (5 actions): Welcome refugees, volunteer, mentor, provide professional support, host activists
- **Points system** with 5 levels:
  - Level 1: Newcomer (0-49 points)
  - Level 2: Supporter (50-99 points)
  - Level 3: Activist (100-249 points)
  - Level 4: Advocate (250-499 points)
  - Level 5: Champion (500+ points)
- **8 achievements** to unlock:
  - First Steps, Getting Started, Committed, Advocate, Champion, Hero
  - Well-Rounded (all categories), Consistent (7-day streak)
- Progress persistence via localStorage
- Category-specific progress bars
- Celebration animations when completing actions
- Motivational quotes
- Reset progress option

### Technical Additions
- ActionTracker component with localStorage persistence
- Integrated into Take Action page after Quick Facts section

---

## [2.13.0] - 2025-12-20

### Content & Interactive Features

#### Global Influence Map
- Interactive regional map showing CCP activities worldwide
- 6 regions: North America, Europe, Asia-Pacific, Africa, Latin America, Middle East
- Statistics: Police stations, Confucius Institutes, repression cases, influence level
- Category filters: All, Police Stations, Confucius Institutes, Transnational Repression, Political Influence, Economic Coercion
- Threat level indicators (Critical, High, Moderate, Low)
- Recent incidents timeline for each region
- Global totals dashboard
- Added to Regional Threats page

#### Glossary of Terms
- 21 key terms with definitions
- Categories: Organizations, Policies & Laws, Regions, CCP Tactics, Key Figures, Concepts
- Search functionality
- Importance levels (Critical, High, Medium)
- Related terms with clickable links
- Integrated into Education Center

#### FAQ Section
- 20 frequently asked questions
- Categories: Getting Started, Safety & Security, Taking Action, Understanding the Issues
- Expandable accordion interface
- Links to relevant resources
- Added as new tab in Education Center

### Technical Additions
- GlobalInfluenceMap component on Regional Threats page
- Glossary component with search and filtering
- FAQ component with accordion UI
- Education Center now has 10 tabs

---

## [2.12.0] - 2025-12-20

### User Experience Enhancements

#### Print-Friendly Styles
- Optimized CSS for printing reports and prisoner profiles
- Automatic URL display for links when printed
- Page break controls for clean document output
- Hidden navigation and interactive elements in print
- Source attribution header and footer
- Emergency contacts always visible in print

#### Quick Facts Widget
- 8 shareable statistics with sources
- One-click copy to clipboard for social media
- Direct Twitter sharing integration
- Color-coded categories
- Source links to original reports
- Usage tips for advocacy

#### Impact Metrics Dashboard
- Real-time platform statistics
- Recent victories timeline
- Progress tracking visualization
- Call to action messaging

#### Enhanced Footer
- Organized navigation links
- Partner organization directory
- Emergency contacts section
- Security reminder with VPN/Tor links
- GitHub and social sharing links
- CC BY 4.0 and MIT license notices
- Multilingual solidarity message

### Technical Additions
- print.css with comprehensive print media queries
- QuickFacts component on Take Action page
- ImpactMetrics component on Dashboard
- Footer component with structured navigation
- Version updated to v2.12.0

---

## [2.11.0] - 2025-12-20

### Major Platform Enhancements

#### Theme System
- **Dark Mode** (default): Original design with slate/blue color scheme
- **Light Mode**: Bright theme for daytime use
- **High Contrast Mode**: Maximum readability for accessibility
- Theme persistence via localStorage
- System preference detection option
- Theme toggle button in header

#### Global Search (Cmd/Ctrl+K)
- Instant search across all platform content
- Searchable: Pages, Political Prisoners, Topics, Actions, Resources
- Keyboard navigation (↑↓ to navigate, Enter to select, Esc to close)
- Quick links when no query entered
- Result type badges (page, prisoner, topic, action, resource)
- Score-based relevance ranking

#### Data Export for Researchers
- Export 8 datasets: Political Prisoners, Police Stations, Organizations, Sanctioned Officials, Confucius Institutes, Boycott Companies, Timeline, Exit Bans
- Formats: JSON, CSV, Markdown
- CC BY 4.0 license for open research use
- Metadata included (record counts, last updated, schema)
- Usage guidelines and attribution format

#### Progressive Web App (PWA)
- Installable on mobile and desktop
- Offline fallback page with emergency contacts
- Service worker for caching and offline support
- App shortcuts for quick access to key pages
- Push notification infrastructure
- Apple Touch Icon support

### Technical Additions
- ThemeContext with ThemeProvider wrapper
- GlobalSearch component with useGlobalSearch hook
- DataExport component on Resources page
- SearchWrapper and SearchButton utilities
- PWA manifest.json with shortcuts
- Service worker (sw.js) with network-first strategy
- Offline.html fallback page

---

## [2.10.0] - 2025-12-20

### Accessibility Improvements

#### Skip Links & Keyboard Navigation
- Skip links for keyboard users to jump to main content and navigation
- ARIA labels on all interactive elements (buttons, inputs, navigation)
- Focus management utilities for modals and dialogs
- Screen reader announcements for dynamic content
- Accessible tabs, buttons, and progress indicators
- Focus trap hook for modal dialogs
- Keyboard navigation hook for list items

### Educational Content Expansion

#### Podcasts Section (12 shows)
Added curated podcast directory with 12 shows across 7 categories:
- Analysis & Commentary: Sinica Podcast, The Little Red Podcast, ChinaTalk, China in Africa
- News & Current Events: China Unscripted, The China Project
- Hong Kong: Hong Kong Free Press Podcast
- Uyghur Rights: Uyghur Pulse, Xinjiang Victims Database Podcast
- Tibet: Tibet Talks
- Culture & Society: Laowai Talk
- Chinese Language: Dragonfly FM

Features: Featured podcasts, category filtering, episode counts, listening tips

#### Research Papers Section (15 papers)
Added academic research and reports database:
- Genocide Documentation: Newlines Institute Genocide Report, Xinjiang Police Files, China Cables, Uyghur Tribunal Judgment
- Transnational Repression: Safeguard Defenders 110 Report, Freedom House Reports, Bilateral Policing Agreements
- Forced Labor: ASPI Uyghurs for Sale
- Hong Kong: HRW NSL Analysis
- Tibet: Tibet Action Institute Demographics Report
- Influence Operations: ASPI Influence Toolkit, Academic Freedom Under Threat
- Human Rights: China Tribunal Organ Harvesting

Features: Citation counts, page counts, essential reading highlights, search, category filtering

### Performance Optimizations

#### LazyImage Component
- Intersection observer-based lazy loading
- Blur placeholder animation
- Error fallback handling
- Configurable threshold and root margin

#### LazyBackground Component
- Background image lazy loading
- Smooth opacity transitions

#### LazySection Component
- Lazy rendering of heavy sections
- Customizable fallback content

#### Performance Utilities
- Debounce and throttle functions
- Memoization helper
- Virtual scroll calculations
- Performance measurement API wrappers
- Resource hints (preload, prefetch, preconnect)
- Local storage with expiration
- Network status detection
- Battery status detection
- Reduced motion preference detection

### Technical Changes
- Education Center now has 9 tabs: Modules, Resources, Research, Books, Documentaries, Podcasts, Stories, Glossary, Timeline
- Main navigation has ARIA role="navigation" and aria-label
- Search input has proper aria-label
- Notification button has descriptive aria-label

---

## [2.3.0] - 2025-12-20

### Major Features Added

#### Police Stations Map Component
- Comprehensive visualization of **102+ CCP overseas police stations** across **53 countries**
- City-level location data for all stations
- Regional breakdown: Europe (54), Asia Pacific (28), South America (7), North America (5), Africa (4), Middle East (4)
- Government actions tracking (14+ investigations, Netherlands closures, NYC arrests)
- Statistics: 230K+ "persuaded" to return to China
- Interactive regional selection with detailed country breakdowns
- Sources linked (Safeguard Defenders, Newsweek, Brookings, CNN)

#### Contact Representatives Tool
- Multi-country support: US, UK, Canada, Australia, EU
- Direct links to find representatives (House, Senate, MPs, MEPs)
- 7 pre-written letter templates:
  - General Human Rights
  - Uyghur Genocide
  - Hong Kong Freedom
  - Tibetan Rights
  - Taiwan Support
  - Free Jimmy Lai
  - Magnitsky Sanctions
- Copy-to-clipboard functionality
- Tips for effective advocacy

#### Boycott Guide
- Database of **27 companies** linked to Uyghur forced labor
- Categories: Apparel & Fashion, Technology, Automotive, Retail, Food & Beverage
- Status levels: CRITICAL, HIGH RISK, IMPLICATED, IMPROVED, MONITORING
- Alternative ethical brands for each company
- Company responses documented
- Sources: ASPI Uyghurs for Sale, HRW, UFLPA Entity List

#### Timeline of CCP Repression
- Interactive timeline with **28 key events** from 1950-2025
- Category filtering: Hong Kong, Xinjiang, Tibet, Taiwan, Transnational, Domestic
- Significance levels: CRITICAL, HIGH
- Expandable event details with sources
- Color-coded by category

#### Advanced CCP Tactics Data
- United Front Work Department (UFWD) tactics:
  - Diaspora Control (CSSAs, hometown associations, WeChat)
  - Political Influence (donations, trips, business deals)
  - Academic Infiltration (Thousand Talents, Confucius Institutes)
  - Religious Manipulation (overseas temples, churches)
- Cognitive Warfare & Information Operations:
  - Wolf Warrior Diplomacy
  - Discourse Power (话语权)
  - Social Media Manipulation
  - Media Capture
- Technological Control & Export:
  - Surveillance Technology Export
  - Data Collection operations
  - Critical Infrastructure control

### Bug Fixes
- Fixed apostrophe syntax error in ContactRepresentatives Taiwan letter template

---

## [2.2.0] - 2025-12-20

### Major Features Added

#### Take Action Page
- **8 numbered action items** inspired by UHRP's effective design
- Email newsletter signup functionality
- Social sharing buttons (Twitter, Facebook, LinkedIn, Telegram, WhatsApp, Email)
- Emergency contacts section (Safeguard Defenders, Freedom House, Front Line Defenders)
- Impact statistics display

#### Interactive World Threat Map
- SVG-based interactive map showing CCP global influence
- **102 overseas police stations** across **53 countries** (verified Safeguard Defenders data)
- Regional breakdown: Europe (36), Asia Pacific (14), Africa (12), South America (12), North America (9), Middle East (3)
- Clickable regions with detailed country data
- Animated hotspots for Taiwan, Hong Kong, Xinjiang, Tibet, South China Sea

#### Incident Report Form
- Multi-step wizard with 9 incident types
- Anonymous reporting option
- Security notices and encryption indicators
- Consent checkbox for data sharing with human rights organizations
- Links to Safeguard Defenders for follow-up

#### Resistance Directory
- **24 verified organizations** across 8 categories
- Search functionality
- Category filtering with pill buttons
- Expandable organization cards with details
- Direct website links and verified badges

#### Petition Links Component
- 6 active petitions with progress bars
- Free Jimmy Lai, End Uyghur Forced Labor, Sanction CCP Officials
- Free Tibet, Protect Taiwan, Close CCP Police Stations
- Expandable details with action items

#### Share Buttons Component
- Twitter/X, Facebook, LinkedIn, Telegram, WhatsApp, Email sharing
- Copy link button with visual feedback
- Customizable hashtags
- Compact mode for inline use

### Data Updates

#### Political Prisoners Database
- **24 documented political prisoners** (up from 17)
- Updated Jimmy Lai status: GUILTY on all charges, faces LIFE SENTENCE (Dec 15, 2025)
- Added Hong Kong 47 members: Benny Tai (10 yrs), Joshua Wong (4y8m), Claudia Mo (4y2m), Gwyneth Ho (7 yrs), Lester Shum (6y9m)
- Added Tibetan monk Rinchen Tsultrim
- Added Uyghur entrepreneur Ekpar Asat

#### Organizations Directory
- Uyghur Rights: UHRP, World Uyghur Congress, Coalition to End Forced Labour, Xinjiang Victims Database
- Tibetan Rights: ICT, Free Tibet, Students for a Free Tibet
- Hong Kong Democracy: Hong Kong Watch, Stand with Hong Kong
- Human Rights: HRW, Amnesty, HRF, Safeguard Defenders, CHRD, Dui Hua, Freedom House
- Press Freedom: RSF, CPJ, PEN International
- Research: ASPI, CSIS
- Democracy: NED, Taiwan Foundation for Democracy
- Government: CECC

### Bug Fixes
- Fixed all navigation links (View Case Details, Join Campaign, View all intelligence)
- Fixed Quick Action buttons on Dashboard (Report Incident, Join Campaign, Secure Comms, Find Resources)
- All links now use React Router for proper client-side navigation

### SEO & Accessibility
- Comprehensive meta tags (title, description, keywords)
- Open Graph tags for Facebook/social sharing
- Twitter Card meta tags
- Structured data (JSON-LD) for WebSite and Organization
- sitemap.xml with all 13 pages
- robots.txt for search engine crawling
- Custom favicon.svg with animated globe and resistance fist
- Noscript fallback message
- Theme color and security headers

### Technical Improvements
- Preconnect hints for external APIs
- Improved loading performance
- Better error handling for RSS feeds

## [2.1.0] - Previous Release

### Features
- Dashboard with live statistics
- Intelligence feeds from ICIJ, Radio Free Asia, HKFP, ASPI
- Political prisoners tracking
- Regional threats monitoring
- CCP tactics documentation
- Education center
- Security center with assessment
- Resources page
- Community features
- Communications page

---

## Data Sources

- **Freedom House** - Transnational Repression Database
- **Safeguard Defenders** - 110 Overseas Police Stations Report
- **Hong Kong Watch** - Political Prisoners Database
- **CECC** - Congressional-Executive Commission on China
- **Amnesty International** - Human Rights Reports
- **Human Rights Watch** - China Documentation
- **UHRP** - Uyghur Human Rights Project
- **ICT** - International Campaign for Tibet

## Contributing

This is an open-source project. Contributions welcome via GitHub.

## License

MIT License - Free to use, modify, and distribute.


## [2.4.0] - 2025-12-20

### Education Center Expansion

#### Documentary List (19 films)
- Hong Kong: Revolution of Our Times, Inside the Red Brick Wall, Do Not Split, The Hong Konger
- Uyghur/Xinjiang: China: The Uighur Tragedy, China Undercover, The Xinjiang Police Files
- Tibet: Tibet: Cry of the Snow Lion, When the Dragon Swallowed the Sun
- Tiananmen: The Gate of Heavenly Peace, Tank Man
- Falun Gong: Ask No Questions, Letter from Masanjia
- Plus COVID, domestic, transnational, and artist documentaries
- Features: Category filtering, relevance ratings, where to watch, topic tags

#### Reading List (21 books)
- Uyghur: In the Camps, The War on the Uyghurs, The Uyghurs
- Hong Kong: Unfree Speech (Joshua Wong), City on Fire, Indelible City
- Tibet: The Dragon in the Land of Snows, Freedom in Exile
- CCP/Politics: The Party, The Third Revolution, Red Roulette
- Surveillance: Surveillance State, We Have Been Harmonized
- Transnational: Hidden Hand, Silent Invasion
- Plus Tiananmen, dissidents, Falun Gong books
- Features: Category filtering, sort options, ISBN lookup, Goodreads/WorldCat links

#### Glossary of Terms (28 definitions)
- CCP Structure: CCP, Politburo, UFWD, MSS
- Laws: NSL, Article 23, Re-education Through Labor
- Xinjiang: Vocational Centers, Strike Hard, Pair Up
- Hong Kong: One Country Two Systems, Yellow Ribbon, Lennon Wall
- Taiwan: One China Policy, Anti-Secession Law, Gray Zone
- Transnational: Fox Hunt, Sky Net, Police Stations
- Propaganda: Wolf Warrior, Discourse Power, 50 Cent Army, Little Pink
- Human Rights: RSDL, Organ Harvesting, Charter 08
- Features: Search in English/Chinese, pinyin, clickable related terms

### CCP Tactics Page Enhancement

#### Sanctioned Officials Database (18 entries)
- Xinjiang: Chen Quanguo, Zhu Hailun, Wang Junzheng, Chen Mingguo, Wang Mingshan
- Hong Kong: Carrie Lam, John Lee, Chris Tang, Stephen Lo, Teresa Cheng, Erick Tsang
- Central: Xia Baolong, Zhang Xiaoming, Luo Huining
- Tibet: Wu Yingjie, Zhang Hongbo
- Tech: Hikvision, SenseTime
- Features: Search, category filtering, sanction flags (US/UK/EU/Canada), dates, details

### Education Center Now Has 6 Tabs
1. Modules (training courses)
2. Resources (downloadable guides)
3. Books (21 essential reads)
4. Documentaries (19 films)
5. Glossary (28 terms with Chinese/pinyin)
6. Timeline (28 historical events)



## [2.5.0] - 2025-12-20

### Dashboard Enhancements

#### News Aggregator
Added curated news section with 8 recent articles from credible sources including Hong Kong Watch, OHCHR, Reuters, Radio Free Asia, and ASPI. Features category filtering (All, Hong Kong, Uyghur, Tibet, Taiwan, Transnational), priority badges (CRITICAL, HIGH, MEDIUM), and live updates indicator.

#### Urgent Case Timer (Compact)
Live detention counters showing years, days, hours, minutes, seconds for Jimmy Lai, Ilham Tohti, and Chow Hang-tung. Updates every second with "View all" link to Political Prisoners page.

### Security Center Upgrade

#### Comprehensive Security Quiz
Replaced basic assessment with 10-question interactive quiz covering network security, communications, account security, digital footprint, data security, knowledge, and emergency preparedness. Features progress bar, point-based scoring, security level assessment (EXCELLENT/GOOD/MODERATE/AT RISK), personalized recommendations, and links to EFF, Front Line Defenders, Access Now, and Security in a Box.

### Political Prisoners Page Enhancement

#### Full Urgent Case Timer
Added full-size detention timers for 4 urgent cases: Jimmy Lai (4+ years), Ilham Tohti (10+ years), Chow Hang-tung (3+ years), and Gedhun Choekyi Nyima (29+ years - longest-held political prisoner). Features take action buttons and copy-to-share functionality with hashtags.

### Technical Improvements
- All new components use React hooks and modern patterns
- Privacy-focused design with no data storage
- Responsive layouts for all screen sizes
- Accessible color schemes and contrast ratios



## [2.6.0] - 2025-12-20

### Education Center Enhancements

#### Survivor Stories
Added 8 verified survivor testimonies with full stories, quotes, and sources:
- Mihrigul Tursun (Uyghur camp survivor)
- Nathan Law (Hong Kong activist in exile)
- Sayragul Sauytbay (First to expose camp system)
- Chen Guangcheng (Blind activist who escaped)
- Tenzin Tsundue (Tibetan poet and activist)
- Gui Minhai (Swedish publisher abducted)
- Jewher Ilham (Daughter of Ilham Tohti)
- Wang Dan (Tiananmen student leader)

Features category filtering, full story modals, share to Twitter, and copy to share functionality.

### Resources Page Enhancements

#### Legal Frameworks
Added 10 international legal frameworks for accountability:

Sanctions Laws:
- UFLPA (US Uyghur Forced Labor Prevention Act)
- Global Magnitsky Act (US)
- Hong Kong Human Rights and Democracy Act (US)
- UK Magnitsky Sanctions Regime
- EU Human Rights Sanctions Regime
- Canada Magnitsky Act
- Australia Autonomous Sanctions Act

International Law:
- UN Convention on Genocide
- Universal Declaration of Human Rights
- ICCPR (signed but not ratified by China)

Features expandable details, enforcement information, official source links, and advocacy guidance.

### Summary of All v2.x Features

The platform now includes:
- 24 verified resistance organizations
- 24 documented political prisoners
- 102 overseas police stations mapped
- 28 historical events in timeline
- 27 companies in boycott guide
- 21 essential books
- 19 documentaries
- 18 sanctioned officials
- 10 legal frameworks
- 8 survivor stories
- 8 training modules
- 6 active petition campaigns
- Live detention counters
- Comprehensive security quiz
- Contact representatives tool
- News aggregator with category filtering



## [2.7.0] - 2025-12-20

### CCP Tactics Page Enhancements

#### Confucius Institute Tracker
Added tracking for 36 Confucius Institutes across 12 countries. Shows closed vs active status with closure reasons (security concerns, academic freedom, espionage). Includes region filtering and Take Action guidance with links to NAS, GAO, and ASPI reports.

#### Media & Propaganda Tracker
Added tracking for 14 CCP media and propaganda operations including state media (CGTN, Xinhua, China Daily, Global Times, People's Daily), social media operations (TikTok, WeChat, 50 Cent Army, Little Pink), disinformation networks (Spamouflage Dragon, Dragonbridge), and captured media (Phoenix TV, SCMP). Features "How to Identify CCP Propaganda" guide with verification tools.

### Community Page Enhancements

#### Resistance Calendar
Added 21 key dates for commemorations, protests, and solidarity actions throughout the year. Includes critical events (June 4 Tiananmen, December 10 Human Rights Day), major commemorations (Tibetan Uprising Day, Hong Kong anniversaries), solidarity events (Taiwan National Day), and awareness days (World Press Freedom Day). Features month filtering, event type legend, suggested actions, and priority badges.

### Complete Platform Statistics

The Global Anti-CCP Resistance Hub now includes:

| Category | Count | Description |
|----------|-------|-------------|
| Resistance Organizations | 24 | Verified human rights and advocacy groups |
| Political Prisoners | 24 | Documented cases with live detention counters |
| Overseas Police Stations | 102 | Mapped across 53 countries |
| Historical Events | 28 | Timeline from 1950 to present |
| Companies in Boycott Guide | 27 | With ethical alternatives |
| Essential Books | 21 | Categorized reading list |
| Documentaries | 19 | With viewing platforms |
| Sanctioned Officials | 18 | Under Magnitsky sanctions |
| Media/Propaganda Outlets | 14 | State media and disinfo networks |
| Legal Frameworks | 10 | International laws and sanctions |
| Survivor Stories | 8 | Personal testimonies |
| Training Modules | 8 | Educational courses |
| Petition Campaigns | 6 | Active campaigns with progress |
| Confucius Institutes | 36 | Tracked across 12 countries |
| Calendar Events | 21 | Annual commemorations |
| Glossary Terms | 28 | With Chinese characters |
| Security Quiz Questions | 10 | Digital security assessment |



## [2.8.0] - 2025-12-20

### Community Page Enhancements

#### Diaspora Support Resources
Added comprehensive support resources for Chinese diaspora, Uyghurs, Tibetans, and Hong Kongers facing CCP pressure abroad:

**Legal Aid (3):**
- Safeguard Defenders
- Chinese Human Rights Defenders
- Front Line Defenders (24/7 emergency: +353 1 210 0489)

**Mental Health (2):**
- Uyghur Transitional Justice Database
- Hong Kong Assistance and Resettlement Community

**Immigration Support (3):**
- Hong Kong Watch
- Uyghur Human Rights Project
- Tibet Justice Center

**Digital Security (2):**
- Access Now Digital Security Helpline
- Electronic Frontier Foundation

**Community (2):**
- CSSA Alternatives guidance
- Citizen Lab

Features:
- Emergency contact banner for immediate danger
- Warning signs of transnational repression (8 signs)
- Safety tips for diaspora (digital & physical)
- Multi-language support indicators

### Regional Threats Page Enhancements

#### Exit Bans & Hostage Diplomacy Tracker
Added tracking for 14 documented cases of exit bans and hostage diplomacy:

**Foreign Nationals (4):**
- Liu Kai (American businessman, 5+ years exit ban)
- Victor Liu & Cynthia Liu (Americans, released 2021)
- Dominic Barton family threats

**Activists (3):**
- Yang Maodong (prevented from seeing dying wife)
- Xu Zhiyong (14 years for "subversion")
- Ding Jiaxi (12 years for "subversion")

**Journalists (2):**
- Haze Fan (Bloomberg, detained)
- Cheng Lei (Australian, imprisoned)

**Business People (3):**
- Michael Spavor & Michael Kovrig ("Two Michaels," released 2021)
- Ian Stones (British, exit ban)

**Uyghurs (2):**
- Idris Hasan (detained in Morocco)
- Yidiresi Aishan (deported from Saudi Arabia)

Features:
- Travel warnings from US, UK, Canada, Australia
- Category filtering and search
- Status badges (Exit Ban, Imprisoned, Released, Deported)
- "What You Can Do" guidance
- Links to Safeguard Defenders, Dui Hua, CECC

### Updated Platform Statistics

| Category | Count | Description |
|----------|-------|-------------|
| Resistance Organizations | 24 | Verified human rights and advocacy groups |
| Political Prisoners | 24 | Documented cases with live detention counters |
| Overseas Police Stations | 102 | Mapped across 53 countries |
| Historical Events | 28 | Timeline from 1950 to present |
| Companies in Boycott Guide | 27 | With ethical alternatives |
| Essential Books | 21 | Categorized reading list |
| Documentaries | 19 | With viewing platforms |
| Sanctioned Officials | 18 | Under Magnitsky sanctions |
| Exit Ban Cases | 14 | Hostage diplomacy tracking |
| Media/Propaganda Outlets | 14 | State media and disinfo networks |
| Diaspora Support Orgs | 12 | Legal, mental health, immigration |
| Legal Frameworks | 10 | International laws and sanctions |
| Survivor Stories | 8 | Personal testimonies |
| Training Modules | 8 | Educational courses |
| Petition Campaigns | 6 | Active campaigns with progress |
| Confucius Institutes | 36 | Tracked across 12 countries |
| Calendar Events | 21 | Annual commemorations |
| Glossary Terms | 28 | With Chinese characters |
| Security Quiz Questions | 10 | Digital security assessment |


## [2.9.0] - 2025-12-20

### Take Action Page Enhancements

#### Forced Labor Supply Chain Tracker
Added comprehensive visualization of how Xinjiang forced labor enters global supply chains:

**5 Industries Tracked:**
- 🧵 Cotton & Textiles (85% of China's cotton from Xinjiang)
- ☀️ Solar Panels (35% global polysilicon)
- 🍅 Tomatoes & Food (70% of China's tomatoes)
- 📱 Electronics (complex supply chains)
- 🚗 Automotive (materials and components)

**Features:**
- Visual supply chain stages with risk levels
- Major brands at risk for each industry
- Ethical alternatives
- Relevant legislation (UFLPA, EU directives)
- Links to ASPI, Coalition to End Forced Labour, CBP

### Regional Threats Page Enhancements

#### Taiwan Defense Status Dashboard
Added comprehensive cross-strait situation tracking:

**4 Tabs:**
- Overview: Recent developments, key stats
- Military Balance: PLA vs Taiwan forces comparison
- Allied Support: US arms packages ($11.1B+), allied commitments
- Scenarios: Gray zone, blockade, strikes, invasion probabilities

**Key Features:**
- Elevated threat level indicator
- US arms packages timeline
- Allied countries support tracking
- Scenario probability assessments

#### Hong Kong Freedom Status Dashboard
Added comprehensive tracking of freedom erosion:

**4 Tabs:**
- Overview: Closed organizations, recent developments
- Repressive Laws: NSL, Article 23 details
- Arrests & Trials: Major cases tracking
- Exodus: 500,000+ emigrants, destinations

**Key Stats:**
- 10,000+ arrested since 2019
- 291+ charged under NSL
- 10+ media outlets closed
- 500,000+ emigrated since 2020

### Updated Platform Statistics

| Category | Count |
|----------|-------|
| Supply Chain Industries | 5 |
| Taiwan Arms Packages | 5+ |
| Hong Kong Closed Orgs | 9+ |
| Hong Kong Emigrants | 500,000+ |


## [3.0.0] - 2025-12-20

### Major Release: Comprehensive Regional Status Dashboards

This release adds extensive regional status tracking for all major areas of CCP repression.

### Regional Threats Page - Complete Overhaul

The Regional Threats page now includes 7 major interactive dashboards:

#### 1. World Threat Map
Interactive global visualization of CCP influence operations.

#### 2. Police Stations Map
102 overseas police stations tracked across 53 countries with regional breakdown.

#### 3. Exit Bans & Hostage Diplomacy Tracker
14 documented cases of foreign nationals and activists prevented from leaving China.

#### 4. Taiwan Defense Status
Cross-strait military situation with 4 tabs: Overview, Military Balance, Allied Support, Scenarios.

#### 5. Hong Kong Freedom Status
Tracking freedom erosion with 4 tabs: Overview, Repressive Laws, Arrests & Trials, Exodus.

#### 6. Xinjiang/Uyghur Genocide Status
Comprehensive genocide documentation with 4 tabs: Overview, Detention Camps, Forced Labor, Cultural Genocide.

#### 7. Tibet Status
75 years of occupation tracking with 4 tabs: Overview, Repression, Self-Immolations, Cultural Erasure.

### Directory Page Enhancement

#### IPAC Members Tracker
Added tracking of 250+ legislators from 30+ countries in the Inter-Parliamentary Alliance on China.

### Platform Statistics

| Category | Count |
|----------|-------|
| Interactive Components | 35+ |
| Political Prisoners | 24+ |
| Police Stations | 102 |
| Sanctioned Officials | 18 |
| Organizations | 24 |
| IPAC Legislators | 250+ |
| Books | 21 |
| Documentaries | 19 |
| Glossary Terms | 28 |
| Timeline Events | 28 |
| Calendar Events | 21 |
| Survivor Stories | 8 |
| Supply Chain Industries | 5 |
| Confucius Institutes | 36 |
| Media Outlets Tracked | 14 |


## [3.1.0] - 2025-12-20

### New Components

#### China Tech Threats Dashboard
Added comprehensive tracking of surveillance technology and critical infrastructure risks:
- 8 sanctioned companies (Huawei, Hikvision, SenseTime, etc.)
- Critical infrastructure risks (5G, ports, power grids, undersea cables)
- Data collection risks (TikTok, WeChat, BGI Genomics)
- Global response tracking (8 countries/regions)

#### Success Stories
Added 15 documented victories against CCP influence:
- Two Michaels release
- UFLPA enacted
- Huawei 5G bans
- Confucius Institute closures
- Coordinated Magnitsky sanctions
- UN Xinjiang report
- Genocide declarations
- And more...

### Platform Statistics Update

| Category | Count |
|----------|-------|
| Interactive Components | 40+ |
| Political Prisoners | 24+ |
| Police Stations | 102 |
| Sanctioned Officials | 18 |
| Organizations | 24 |
| IPAC Legislators | 250+ |
| Books | 21 |
| Documentaries | 19 |
| Glossary Terms | 28 |
| Timeline Events | 28 |
| Calendar Events | 21 |
| Survivor Stories | 8 |
| Documented Victories | 15 |
| Tech Companies Tracked | 8 |
| Supply Chain Industries | 5 |
| Confucius Institutes | 36 |
| Media Outlets Tracked | 14 |


## [2.9.0] - 2025-12-20

### Feature Audit & Quality Fixes

#### Data Consistency Fix
- Fixed police station data inconsistency between WorldThreatMap and PoliceStationsMap
- Both components now consistently show **102 stations in 51 countries**

#### Resources Page Refactor
- Converted from duplicated content to a **clean navigation hub**
- 6 navigation cards linking to dedicated pages (Security, Take Action, Directory, Education, Intelligence, Community)
- Retained unique content: Quick Documentation Tools (eyeWitness, ProofMode, Wayback Machine, Archive.today)
- Emergency contacts section preserved

#### Dashboard Improvement
- Replaced loading skeleton "Live Intelligence Feed" with **Intelligence Overview**
- Shows 4 verified sources with "Live RSS Feeds" indicator
- Clear link to full Intelligence Feeds page

### New Features

#### Political Prisoners Database Expansion
Added **31 new verified cases** (now **55+ total**):

**Hong Kong 47:**
- Au Nok-hin, Leung Kwok-hung (Long Hair), Jimmy Sham, Gordon Ng, Tam Tak-chi

**Apple Daily Staff:**
- Cheung Kim-hung, Ryan Law, Yeung Ching-kee

**Tiananmen Vigil Organizers:**
- Albert Ho, Lee Cheuk-yan

**612 Humanitarian Relief Fund:**
- Cardinal Joseph Zen (92 years old), Margaret Ng, Denise Ho, Cyd Ho

**Uyghur:**
- Gulshan Abbas (20 years), Rahile Dawut (disappeared), Yalqun Rozi, Sanubar Tursun

**Tibetan:**
- Go Sherab Gyatso (10 years), Kunchok Jinpa (died in custody), Tashi Wangchuk

**Mainland Dissidents:**
- Wang Quanzhang, Jiang Tianyong, Li Qiaochu, Huang Qi (12 years), Chen Guangcheng

**Stand News:**
- Chung Pui-kuen, Patrick Lam

**Transnational:**
- Gui Minhai (Swedish citizen abducted)

#### Report CCP Activity Feature
New tool in Community page for reporting suspicious CCP activities:

**7 Activity Types:**
1. Overseas Police Station
2. Surveillance Activity
3. Intimidation/Harassment
4. United Front Activity
5. Disinformation Campaign
6. Institutional Infiltration
7. Other Activity

**Features:**
- 3-step wizard (Type → Details → Review)
- Anonymous submission option
- Security warnings (VPN/Tor recommended)
- 39 countries supported
- Links to official reporting channels (FBI, MI5, RCMP, ASIO, Safeguard Defenders)

#### Multi-Language Support
Added **4 languages** with selector in header:
- 🇬🇧 English
- 🇨🇳 Chinese (中文)
- 🏳️ Uyghur (ئۇيغۇرچە)
- 🏔️ Tibetan (བོད་སྐད།)

**Features:**
- RTL (right-to-left) support for Uyghur
- Language preference saved to localStorage
- Context-based translation system with useLanguage hook

#### Success Stories Expansion
Added **10 new victories** (now **25 total**):
- Jimmy Lai Case Global Attention (Dec 2025)
- Safeguard Defenders 110 Report (Sep 2022)
- EU Foreign Agents Transparency (2024)
- Australia FITS Act (Dec 2018)
- Chen Guangcheng Escape (Apr 2012)
- Hikvision/Dahua Entity List (Oct 2019)
- IPAC Formation (Jun 2020)
- Uyghur Tribunal Verdict (Dec 2021)
- Hong Kong 47 Global Solidarity (2021-2024)
- Apple Daily Archives Preserved (2021-2022)

### Updated Platform Statistics

| Category | Count |
|----------|-------|
| Political Prisoners | 55+ |
| Police Stations | 102 |
| Success Stories | 25 |
| Languages | 4 |
| Interactive Components | 45+ |
| Countries Tracked | 51+ |
