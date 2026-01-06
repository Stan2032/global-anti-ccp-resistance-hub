# Complete Site-Wide To-Do List

## Original User Request Review

**User's Core Requirement:**
> "We wish to remove ourselves from ALL brands that support them, seeing as they have total control over all funds going in and out of any business inside of CCP-Enslaved-China"

**Achievement Status:**
- ✅ Renamed to "Companies Implicated in Forced Labour"
- ✅ Evidence-based (ASPI, HRW, US Customs with source URLs)
- ⚠️ Alternatives from democratic countries (but need stricter verification)
- ❌ Complete removal of China ties (many alternatives still have Chinese components/materials)

---

## PRIORITY 1: Complete Forced Labour List Improvements

### 1.1 Add Stricter Verification System
- [ ] Add "China Exposure Level" rating for each alternative
  - 🟢 **Zero China** - No Chinese components/materials/assembly
  - 🟡 **Minimal China** - Some Chinese components but not assembly
  - 🔴 **Significant China** - Major Chinese involvement (remove from list)
- [ ] Add verification date for each alternative
- [ ] Add "Last Verified" timestamp
- [ ] Create verification methodology document

### 1.2 Enhance Alternative Recommendations
- [ ] Add specific model numbers for "some models" alternatives
- [ ] Add direct purchase links to ethical alternatives
- [ ] Add price range indicators
- [ ] Add availability by region (US/EU/Asia)
- [ ] Remove alternatives that still have significant China ties:
  - [ ] Review Fairphone (uses Chinese components)
  - [ ] Review LG (some China production)
  - [ ] Review all "verify production" notes

### 1.3 Add User Verification Guide
- [ ] Create "How to Verify Manufacturing" section
- [ ] Explain how to read "Made in" labels
- [ ] Explain "Assembled in X with imported components"
- [ ] Provide checklist for researching brands
- [ ] Add links to manufacturing transparency databases

### 1.4 Expand Evidence Base
- [ ] Add more companies with documented evidence
- [ ] Add court case references where available
- [ ] Add shareholder lawsuit information
- [ ] Add government investigation links
- [ ] Add NGO investigation reports

---

## PRIORITY 2: Site-Wide Data Cleanup (Remove ALL Simulated Data)

### 2.1 Components Requiring Full Audit (From SIMULATED_DATA_CLEANUP_TODO.md)

**Large Components (1000+ lines):**
- [ ] **Political Prisoners** (1,149 lines)
  - [ ] Verify all 55 prisoners have source URLs
  - [ ] Compare with JSON file (60 prisoners with sources)
  - [ ] Refactor to use JSON data instead of hardcoded
  - [ ] Add SourceAttribution component display
  
- [ ] **Interactive Timeline** (584 lines)
  - [ ] Verify all historical events have sources
  - [ ] Remove any speculative future events
  - [ ] Add source URLs for all entries

**Medium Components (400-600 lines):**
- [ ] **Detention Facilities** (572 lines)
  - [ ] Verify all facility locations with satellite imagery sources
  - [ ] Add coordinates and map links
  - [ ] Link to ASPI Xinjiang Data Project
  
- [ ] **CCP Officials** (526 lines)
  - [ ] Link to official sanction lists (US, EU, UK, Canada)
  - [ ] Add government source URLs
  - [ ] Verify all positions and allegations

- [ ] **Company Tracker** (424 lines)
  - [ ] Add evidence links for all companies
  - [ ] Verify current status
  - [ ] Link to stock tickers and financial data

- [ ] **Sanctions Tracker** (424 lines)
  - [ ] Link to official government sanction databases
  - [ ] Add effective dates
  - [ ] Add enforcement status

- [ ] **Taiwan Defense Status** (422 lines)
  - [ ] Link to official Taiwan MND sources
  - [ ] Add date stamps for all data
  - [ ] Link to international defense databases

- [ ] **Boycott List** → **Forced Labour List** (419 lines)
  - [x] Renamed and evidence-based
  - [x] Added source URLs
  - [x] Expanded democratic alternatives
  - [ ] Add stricter China exposure verification (see Priority 1)

**Memorial Components:**
- [ ] **Victim Memorial Wall** (2 components, 984 lines total)
  - [ ] Verify all 15 victims with source URLs
  - [ ] Add memorial organization links
  - [ ] Add family statements where available
  - [ ] Link to official death records/reports

### 2.2 Data Files Requiring Source Attribution
- [ ] **political_prisoners_research.json** - Add "Last Updated" dates
- [ ] **detention_facilities_research.json** - Add verification status
- [ ] **ccp_officials_research.json** - Link to sanction lists
- [ ] **company_tracker_research.json** - Add evidence links
- [ ] **sanctions_tracker_research.json** - Link to official databases
- [ ] **taiwan_defense_research.json** - Add source timestamps
- [ ] **boycott_list_research.json** - Update with new forced labour data
- [ ] **victim_memorial_research.json** - Add source verification
- [ ] **historical_timeline_research.json** - Add source URLs
- [ ] **detention_camps_research.json** - Link to satellite imagery

### 2.3 Remove Remaining Hardcoded Data
- [ ] **InteractiveTimeline.jsx** - Check for any remaining hardcoded events
- [ ] **NewsAggregator.jsx** - Verify only RSS data (already cleaned)
- [ ] **Timeline.jsx** - Verify only historical events with sources (already cleaned)
- [ ] Scan all components for `const data = [` patterns
- [ ] Scan for `useState([{` with large arrays

---

## PRIORITY 3: Site Structure Simplification (From SITE_STRUCTURE_ANALYSIS.md)

### 3.1 Page Consolidation (14 → 8 pages)

**Phase 1: Merge Overlapping Pages**
- [x] Remove Campaigns, Communications, CCP Tactics, Regional Threats from navigation
- [ ] **Merge Take Action + Campaigns**
  - [ ] Move CampaignProgress component to Take Action
  - [ ] Consolidate campaign tracking
  - [ ] Remove CampaignHubs.jsx page
  - [ ] Update all internal links

- [ ] **Merge Community + Communications**
  - [ ] Move SecureComms to Community page
  - [ ] Add Communications as tab in Community
  - [ ] Remove SecureComms.jsx page
  - [ ] Update navigation

- [ ] **Merge Resources + CCP Tactics**
  - [ ] Move CCPTactics content to Resources page
  - [ ] Add as "CCP Tactics" tab
  - [ ] Remove CCPTactics.jsx page
  - [ ] Update links

- [ ] **Merge Intelligence + Regional Threats**
  - [ ] Move RegionalThreats to Intelligence page
  - [ ] Add as "Regional Analysis" tab
  - [ ] Remove RegionalThreats.jsx page
  - [ ] Update navigation

**Phase 2: Remove Redundant Components**
- [ ] Identify duplicate functionality across pages
- [ ] Consolidate similar components
- [ ] Remove unused components
- [ ] Clean up imports

**Phase 3: Update All Internal Links**
- [ ] Search for links to removed pages
- [ ] Update to new consolidated pages
- [ ] Test all navigation flows
- [ ] Update sitemap

### 3.2 Navigation Cleanup
- [x] Reduced navigation from 14 to 10 items
- [ ] Further reduce to 8 core pages
- [ ] Add dropdown menus for sub-sections
- [ ] Improve mobile navigation
- [ ] Add breadcrumbs for deep pages

---

## PRIORITY 4: RSS Feed & Live Data Improvements

### 4.1 RSS Feed Optimization (Completed)
- [x] Implement RSS2JSON API (working)
- [x] Add 5-minute caching
- [x] Parallel fetching
- [x] 10-second timeout
- [ ] Add feed health monitoring
- [ ] Add "Last Updated" timestamps to feed items
- [ ] Add source attribution to each news item
- [ ] Add ability to filter by source

### 4.2 Add More RSS Feeds
- [ ] Add more Uyghur-focused sources
- [ ] Add more Tibet-focused sources
- [ ] Add more Hong Kong sources
- [ ] Add Taiwan defense news sources
- [ ] Add international human rights sources
- [ ] Verify all feeds are from credible sources

### 4.3 Live Data Transparency
- [ ] Show which feeds are working vs failing
- [ ] Show last successful fetch time
- [ ] Show cache status
- [ ] Add "Refresh" button for manual updates
- [ ] Add feed source credibility ratings

---

## PRIORITY 5: Transparency & Source Attribution

### 5.1 Source Attribution Component (Created)
- [x] Created SourceAttribution.jsx component
- [x] Created EmptyState.jsx component
- [ ] Integrate SourceAttribution throughout site
- [ ] Add to all data displays
- [ ] Add verification badges (verified, unverified, disputed)
- [ ] Add "Report Inaccuracy" button

### 5.2 Data Sources Page (Created)
- [x] Created DATA_SOURCES.md
- [x] Created DataSources.jsx page
- [x] Added to navigation
- [ ] Add interactive source explorer
- [ ] Add source credibility ratings
- [ ] Add methodology explanations
- [ ] Add data update frequencies

### 5.3 Verification System
- [ ] Add "Last Verified" dates to all data
- [ ] Add verification methodology documentation
- [ ] Add community verification system
- [ ] Add "Flag for Review" functionality
- [ ] Add verification status badges

---

## PRIORITY 6: User Experience Improvements

### 6.1 Performance Optimization
- [x] RSS feed caching (5 minutes)
- [x] Parallel RSS fetching
- [ ] Implement service worker for offline access
- [ ] Add progressive loading for large datasets
- [ ] Optimize images
- [ ] Implement lazy loading
- [ ] Add loading skeletons

### 6.2 Search & Filter
- [ ] Add global search across all pages
- [ ] Improve filtering on data-heavy pages
- [ ] Add advanced search options
- [ ] Add search history
- [ ] Add saved searches

### 6.3 Mobile Experience
- [ ] Optimize for mobile screens
- [ ] Improve touch interactions
- [ ] Add swipe gestures
- [ ] Optimize navigation for mobile
- [ ] Test on various devices

### 6.4 Accessibility
- [ ] Add ARIA labels
- [ ] Improve keyboard navigation
- [ ] Add screen reader support
- [ ] Improve color contrast
- [ ] Add text size controls

---

## PRIORITY 7: Content Expansion

### 7.1 Missing Critical Content
- [ ] Add Falun Gong persecution section
- [ ] Add organ harvesting documentation
- [ ] Add Belt and Road Initiative tracking
- [ ] Add CCP influence operations tracker
- [ ] Add academic freedom violations
- [ ] Add journalist harassment cases
- [ ] Add diaspora intimidation cases

### 7.2 Regional Coverage
- [ ] Expand Tibet coverage
- [ ] Expand Inner Mongolia coverage
- [ ] Add Guangdong/Cantonese culture suppression
- [ ] Add Taiwan coercion tactics
- [ ] Add South China Sea aggression
- [ ] Add border conflicts (India, Bhutan)

### 7.3 International Dimensions
- [ ] Add CCP influence in Africa
- [ ] Add CCP influence in Latin America
- [ ] Add CCP influence in Pacific Islands
- [ ] Add debt trap diplomacy cases
- [ ] Add technology transfer theft cases
- [ ] Add intellectual property theft cases

---

## PRIORITY 8: Technical Improvements

### 8.1 Data Management
- [ ] Move all hardcoded data to JSON files
- [ ] Create data update workflow
- [ ] Add data validation
- [ ] Create data backup system
- [ ] Add data versioning

### 8.2 Component Architecture
- [ ] Refactor large components (1000+ lines)
- [ ] Create reusable sub-components
- [ ] Improve component organization
- [ ] Add component documentation
- [ ] Add component tests

### 8.3 Build & Deployment
- [ ] Optimize build size
- [ ] Add build analytics
- [ ] Improve deployment pipeline
- [ ] Add staging environment
- [ ] Add automated testing

---

## PRIORITY 9: Community Features

### 9.1 User Contributions
- [ ] Add "Submit Information" form
- [ ] Add "Report Inaccuracy" system
- [ ] Add verification workflow for submissions
- [ ] Add contributor recognition
- [ ] Add moderation system

### 9.2 Sharing & Outreach
- [ ] Improve social media sharing
- [ ] Add embeddable widgets
- [ ] Create shareable infographics
- [ ] Add email newsletter
- [ ] Add RSS feeds for updates

### 9.3 Localization
- [ ] Add Chinese (Traditional) translation
- [ ] Add Chinese (Simplified) translation
- [ ] Add Uyghur translation
- [ ] Add Tibetan translation
- [ ] Add other language support

---

## PRIORITY 10: Security & Privacy

### 10.1 User Privacy
- [ ] Ensure no tracking of users
- [ ] Add privacy policy
- [ ] Add data handling documentation
- [ ] Ensure GDPR compliance
- [ ] Add Tor support documentation

### 10.2 Content Security
- [ ] Implement content security policy
- [ ] Add HTTPS enforcement
- [ ] Protect against XSS
- [ ] Add rate limiting
- [ ] Add DDoS protection

### 10.3 Whistleblower Protection
- [x] Created WhistleblowerPortal component
- [ ] Add anonymous submission system
- [ ] Add encryption guidance
- [ ] Add security best practices
- [ ] Add legal protection information

---

## IMMEDIATE NEXT STEPS (This Session)

### Step 1: Complete Forced Labour List Verification
1. [ ] Add "China Exposure Level" to each alternative
2. [ ] Remove alternatives with significant China ties
3. [ ] Add specific model numbers
4. [ ] Add verification guide

### Step 2: Continue Page Consolidation
1. [ ] Merge Take Action + Campaigns
2. [ ] Test navigation
3. [ ] Update links

### Step 3: Audit One Major Component
1. [ ] Choose: Political Prisoners (largest)
2. [ ] Refactor to use JSON data
3. [ ] Add SourceAttribution display
4. [ ] Verify all sources

---

## SUCCESS METRICS

**Data Quality:**
- [ ] 100% of data points have source URLs
- [ ] 0% simulated/fake data
- [ ] All sources are credible (ASPI, HRW, gov't, major media)
- [ ] All data has "Last Updated" dates

**Transparency:**
- [ ] Every claim is verifiable
- [ ] Sources are clearly displayed
- [ ] Methodology is documented
- [ ] Limitations are acknowledged

**User Experience:**
- [ ] Site loads in <3 seconds
- [ ] Mobile-friendly
- [ ] Easy navigation
- [ ] Clear information architecture

**Ethical Standards:**
- [ ] No alternatives with China ties
- [ ] Only democratic country alternatives
- [ ] Transparent supply chain information
- [ ] Accountability mechanisms clear

---

## ESTIMATED TIMELINE

**Phase 1 (1-2 weeks):**
- Complete forced labour list verification
- Finish page consolidation
- Remove all simulated data

**Phase 2 (2-3 weeks):**
- Audit all major components
- Refactor to use JSON data
- Add source attribution throughout

**Phase 3 (3-4 weeks):**
- Content expansion
- Technical improvements
- Community features

**Phase 4 (Ongoing):**
- Data updates
- User contributions
- Continuous improvement

---

## NOTES

**Key Principle:**
> "Better to show 'No data available' than fake data"
> "Support ONLY democracies that can be held accountable"
> "Complete transparency in all sources and methodology"

**User's Core Goal:**
> "Remove ourselves from ALL brands that support the CCP, seeing as they have total control over all funds going in and out of any business inside of CCP-Enslaved-China"

This means:
- Zero tolerance for China manufacturing
- Zero tolerance for China materials/components where avoidable
- Transparent about what's unavoidable (e.g., electronics)
- Prioritize democratic countries with accountability
