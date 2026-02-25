# Simulated Data Cleanup - Comprehensive TODO List

## Priority: LOW (was CRITICAL — most items resolved)
**Goal:** Remove ALL simulated, fake, mock, or placeholder data. Replace with ONLY real, verified data from credible sources with transparent attribution.

**Last reviewed:** February 25, 2026 (Session 79, Opus 4.6)  
**Status:** Phase 1 ✅ COMPLETE. Phase 2 ✅ MOSTLY COMPLETE (2/4 fully refactored, 2/4 use justified hybrid approach).

### Completed across Sessions 33-78:
- ✅ **VPN/Tor fake detection** removed, honest disclaimers + 3rd-party self-test tools added (Session 33)
- ✅ **Non-functional forms** now show "Coming Soon" notices with links to real organizations (Session 36)
- ✅ **False security claims** removed from IncidentReportForm (Session 36)
- ✅ **Community statistics** marked as "illustrative targets" (Session 37)
- ✅ **simulatedLiveData object** removed from liveDataSources.js, replaced with empty arrays + error status (Session 76)
- ✅ **feedValidator/checkFeedHealth dead code** removed — returned fake "operational" status (Session 78)
- ✅ **fetchStatistics()** now returns counts from actual JSON files with source attribution (Session 76)
- ✅ **fetchPoliticalPrisoners()** imports from political_prisoners_research.json (62 entries) (Session 76)
- ✅ **Dashboard stat cards** use honest labels ("In database", "ASPI estimate", "Documented cases") (Session 76)
- ✅ **PoliticalPrisoners.jsx** fully imports from political_prisoners_research.json (Session 76+)
- ✅ **ForcedLaborTracker.jsx** fully imports from forced_labor_companies_research.json
- ✅ **SanctionsTracker** uses sanctions_tracker.json with source_url fields linking to gov registries (Session 72)

### Remaining (LOW priority — justified hybrid approach):
- 🟡 **DetentionFacilities.jsx** — 10 hardcoded facilities with rich component data (coordinates, satellite imagery links, detailed descriptions). JSON import exists but doesn't contain coordinate/imagery data. **Recommendation:** Keep hybrid approach; enriching JSON with coordinate data is a separate task.
- 🟡 **CCPOfficials.jsx** — 8 hardcoded officials with detailed UI data, merged with JSON sanctions data. **Recommendation:** Keep hybrid approach; the hardcoded data provides UI-specific fields (images, detailed descriptions) not in the JSON research file.

---

## 1. LIVE INTELLIGENCE FEED (liveDataSources.js)

### 1.1 Remove Simulated Live Data Object
**File:** `/src/data/liveDataSources.js`
**Lines:** 149-237

**Subtasks:**
- [ ] 1.1.1 Delete entire `simulatedLiveData` object (lines 149-237)
- [ ] 1.1.2 Remove all references to `simulatedLiveData.recentLeaks`
- [ ] 1.1.3 Remove all references to `simulatedLiveData.threatAlerts`
- [ ] 1.1.4 Remove all references to `simulatedLiveData.campaignUpdates`

### 1.2 Fix Fallback Logic in dataProcessor.aggregateFeeds()
**File:** `/src/data/liveDataSources.js`
**Lines:** 342-343, 354-358

**Current Problem:**
```javascript
const newsData = allNews.length > 0 ? allNews : simulatedLiveData.recentLeaks.slice(0, 5);
const threatData = allHumanRights.length > 0 ? allHumanRights : simulatedLiveData.threatAlerts;
```

**Subtasks:**
- [ ] 1.2.1 Replace fallback to show "No data available" message instead of fake data
- [ ] 1.2.2 Update error handling to return empty arrays with clear status message
- [ ] 1.2.3 Add user-visible error message when RSS feeds fail
- [ ] 1.2.4 Remove `campaigns: simulatedLiveData.campaignUpdates` line (348)
- [ ] 1.2.5 Create real campaign updates RSS feed or remove campaigns section entirely

**Proposed Fix:**
```javascript
const newsData = allNews.length > 0 ? allNews : [];
const threatData = allHumanRights.length > 0 ? allHumanRights : [];

return {
  news: newsData,
  threats: threatData,
  campaigns: [], // Remove or fetch from real source
  lastUpdated: new Date().toISOString(),
  status: newsData.length === 0 ? 'feeds_unavailable' : 'operational',
  message: newsData.length === 0 ? 'RSS feeds temporarily unavailable. Please check back later.' : null
};
```

### 1.3 Fix generateStats() Function
**File:** `/src/data/liveDataSources.js`
**Lines:** 385-398

**Current Problem:**
```javascript
// Add small random variations to simulate real-time updates
```

**Subtasks:**
- [ ] 1.3.1 Remove random number generation that simulates updates
- [ ] 1.3.2 Calculate actual statistics from real RSS feed data
- [ ] 1.3.3 Count actual documents processed, threats detected, etc. from real sources
- [ ] 1.3.4 If real-time stats unavailable, show static verified numbers with date/source

**Proposed Fix:**
```javascript
generateStats: (feedData) => {
  return {
    activeMonitoring: feedData.news.length + feedData.threats.length,
    documentsProcessed: feedData.news.length, // Actual count from feeds
    threatsDetected: feedData.threats.filter(t => t.severity === 'high' || t.severity === 'critical').length,
    organizationsTracked: new Set(feedData.news.map(n => n.source)).size,
    lastUpdate: new Date().toISOString(),
    dataSource: 'Real RSS Feeds'
  };
}
```

### 1.4 Add More Real RSS Feeds
**File:** `/src/data/liveDataSources.js`

**Subtasks:**
- [ ] 1.4.1 Add The Guardian - China RSS feed
- [ ] 1.4.2 Add BBC News - China RSS feed  
- [ ] 1.4.3 Add Reuters - China RSS feed
- [ ] 1.4.4 Add Associated Press - China RSS feed
- [ ] 1.4.5 Add Financial Times - China RSS feed
- [ ] 1.4.6 Add Taiwan News RSS feed
- [ ] 1.4.7 Add Tibet Post International RSS feed
- [ ] 1.4.8 Add Free Tibet RSS feed
- [ ] 1.4.9 Add International Campaign for Tibet RSS feed
- [ ] 1.4.10 Test all new RSS feeds for proper parsing

---

## 2. LIVE INTELLIGENCE FEED COMPONENT

### 2.1 Update UI to Handle Empty States
**File:** `/src/components/intelligence/LiveIntelligenceFeed.jsx`

**Subtasks:**
- [ ] 2.1.1 Add proper empty state UI when no RSS data available
- [ ] 2.1.2 Show clear error messages when feeds fail
- [ ] 2.1.3 Add "Feed Status" indicator showing which feeds are operational
- [ ] 2.1.4 Remove any hardcoded placeholder items
- [ ] 2.1.5 Add retry button for failed feeds
- [ ] 2.1.6 Show last successful update time

---

## 3. CAMPAIGN UPDATES SYSTEM

### 3.1 Create Real Campaign Updates Source
**Options:**
A. Find RSS feeds from campaign websites
B. Create manual curated list with verified sources
C. Remove campaigns section entirely if no real source available

**Subtasks:**
- [ ] 3.1.1 Research campaign websites for RSS feeds (Free Jimmy Lai, Save Uyghurs, etc.)
- [ ] 3.1.2 If RSS unavailable, create manually curated JSON file with sources
- [ ] 3.1.3 Each campaign update must have: title, date, description, source URL, verification
- [ ] 3.1.4 Add "Last Updated" date to manual campaign data
- [ ] 3.1.5 Document process for updating campaign data

**Example Structure:**
```json
{
  "campaigns": [
    {
      "id": "free-jimmy-lai-2024",
      "title": "UK Parliament Calls for Jimmy Lai Release",
      "date": "2024-12-15",
      "description": "Actual description from verified source",
      "source": {
        "name": "UK Parliament Official Statement",
        "url": "https://actual-url.com",
        "type": "Government Statement",
        "verified": true
      },
      "lastVerified": "2024-12-15"
    }
  ]
}
```

---

## 4. COMPONENT-LEVEL HARDCODED DATA AUDIT

### 4.1 Political Prisoners Component ✅ COMPLETE
**File:** `/src/pages/PoliticalPrisoners.jsx`
**Status:** Fully imports from `political_prisoners_research.json` (62 entries). No hardcoded prisoner data.

### 4.2 Detention Facilities Component 🟡 HYBRID (JUSTIFIED)
**File:** `/src/components/DetentionFacilities.jsx` (572 lines)
**Status:** 10 hardcoded facilities with rich data (coordinates, satellite imagery links, capacity estimates). Also imports from `detention_facilities_research.json`. The hardcoded data contains UI-specific fields (lat/lng, image URLs) not present in the JSON research file.
**Recommendation:** Keep hybrid approach. To fully migrate, the JSON file would need to be enriched with coordinate data and satellite imagery URLs — a separate research task.

### 4.3 CCP Officials Component 🟡 HYBRID (JUSTIFIED)
**File:** `/src/components/CCPOfficials.jsx` (526 lines)
**Status:** 8 hardcoded officials with rich UI data (detailed descriptions, images, role context). Merged with `sanctioned_officials_research.json` at runtime. The hardcoded data provides UI-specific fields not in the JSON.
**Recommendation:** Keep hybrid approach. The JSON contains sanctions metadata; the component data contains biographical/contextual information for display.

### 4.4 Company Tracker / ForcedLaborTracker ✅ COMPLETE
**File:** `/src/components/ForcedLaborTracker.jsx`
**Status:** Fully imports from `forced_labor_companies_research.json`. No hardcoded company data.

### 4.5 Sanctions Tracker Component ✅ COMPLETE
**File:** `/src/components/SanctionsTracker.jsx`
**Status:** Fully imports from `sanctions_tracker.json` (35 entries). All entries have `source_url` fields linking to official government registries (US Treasury SDN, UK Gov Sanctions List, EU Sanctions Map, Canada SEMA, Australia DFAT). Tests verify URLs.

### 4.6 Boycott List Component
**File:** `/src/components/BoycottList.jsx` (419 lines)

**Subtasks:**
- [ ] 4.6.1 Verify all boycott recommendations with evidence
- [ ] 4.6.2 Link to investigative reports for each company
- [ ] 4.6.3 Add alternative product recommendations with sources
- [ ] 4.6.4 Add "Last Updated" date
- [ ] 4.6.5 Remove any unverified boycott targets

### 4.7 Taiwan Defense Status Component
**File:** `/src/components/TaiwanDefenseStatus.jsx` (422 lines)

**Subtasks:**
- [ ] 4.7.1 Verify all military data with credible defense sources
- [ ] 4.7.2 Link to: Taiwan MND reports, US DoD China Military Power Report, IISS, CSIS
- [ ] 4.7.3 Add publication date for each statistic
- [ ] 4.7.4 Add "Data as of" date for military capabilities
- [ ] 4.7.5 Remove any estimated/speculative data without sources

### 4.8 Interactive Timeline Component
**File:** `/src/components/InteractiveTimeline.jsx` (584 lines)

**Subtasks:**
- [ ] 4.8.1 Verify all historical events with credible sources
- [ ] 4.8.2 Add source link for each timeline event
- [ ] 4.8.3 Add primary source documents where available
- [ ] 4.8.4 Verify dates with multiple sources
- [ ] 4.8.5 Remove any disputed/unverified events

### 4.9 Memorial Wall Component
**File:** `/src/components/MemorialWall.jsx` (528 lines)

**Subtasks:**
- [ ] 4.9.1 Verify all victim information with credible sources
- [ ] 4.9.2 Add source for each victim (news reports, NGO reports, family statements)
- [ ] 4.9.3 Add verification status for each victim
- [ ] 4.9.4 Link to memorial organizations
- [ ] 4.9.5 Remove any unverified victims

### 4.10 Victim Memorial Wall Component
**File:** `/src/components/VictimMemorialWall.jsx` (456 lines)

**Subtasks:**
- [ ] 4.10.1 Verify all 15 documented victims with sources
- [ ] 4.10.2 Add direct links to source articles/reports for each victim
- [ ] 4.10.3 Add verification status clearly displayed
- [ ] 4.10.4 Add "Last Verified" date
- [ ] 4.10.5 Remove any unverified victims

---

## 5. DATA FILES AUDIT

### 5.1 CCP Tactics Data
**File:** `/src/data/ccpTactics.js` (374 lines)

**Subtasks:**
- [ ] 5.1.1 Verify all tactics with credible reports
- [ ] 5.1.2 Add source attribution for each tactic
- [ ] 5.1.3 Link to: HRW reports, Amnesty reports, government reports, academic papers
- [ ] 5.1.4 Add "Last Updated" date
- [ ] 5.1.5 Remove any unverified tactics

### 5.2 Research Data Files
**Files in `/src/data/`:**
- academic_experts_research.json (23K)
- confucius_institutes_research.json (41K)
- detention_facilities_research.json (16K)
- forced_labor_companies_research.json (33K)
- human_rights_orgs_research.json (47K)
- international_responses_research.json (35K)
- police_stations_research.json (29K)
- political_prisoners_research.json (49K)
- recent_news_research.json (30K)
- sanctioned_officials_research.json (19K)

**Subtasks:**
- [ ] 5.2.1 Audit each JSON file for source attribution
- [ ] 5.2.2 Ensure every entry has: source URL, date, verification status
- [ ] 5.2.3 Add "Last Updated" field to each file
- [ ] 5.2.4 Add "Data Collection Methodology" section
- [ ] 5.2.5 Remove any entries without proper sources

---

## 6. SOURCE ATTRIBUTION STANDARDS

### 6.1 Create Source Attribution Component
**New File:** `/src/components/ui/SourceAttribution.jsx`

**Subtasks:**
- [ ] 6.1.1 Create reusable component for displaying sources
- [ ] 6.1.2 Include: source name, URL, date, type, verification status
- [ ] 6.1.3 Add icon for source type (government, NGO, media, academic)
- [ ] 6.1.4 Add "View Source" button that opens in new tab
- [ ] 6.1.5 Add tooltip with source credibility information

**Example:**
```jsx
<SourceAttribution
  source={{
    name: "Human Rights Watch",
    url: "https://www.hrw.org/report/2021/...",
    date: "2021-04-19",
    type: "NGO Report",
    verified: true
  }}
/>
```

### 6.2 Update All Components to Use Source Attribution
**Subtasks:**
- [ ] 6.2.1 Add SourceAttribution component to all data displays
- [ ] 6.2.2 Ensure every claim has visible source
- [ ] 6.2.3 Add "Sources" section to all major components
- [ ] 6.2.4 Link directly to original source documents

---

## 7. EMPTY STATE HANDLING

### 7.1 Create Standard Empty State Component
**New File:** `/src/components/ui/EmptyState.jsx`

**Subtasks:**
- [ ] 7.1.1 Create reusable empty state component
- [ ] 7.1.2 Show clear message when no data available
- [ ] 7.1.3 Explain why data is unavailable
- [ ] 7.1.4 Provide action button (retry, report issue, etc.)
- [ ] 7.1.5 Never show fake/placeholder data

**Example:**
```jsx
<EmptyState
  icon={<AlertTriangle />}
  title="No Data Available"
  message="RSS feeds are temporarily unavailable. This may be due to network issues or source downtime."
  action={{
    label: "Retry",
    onClick: refreshData
  }}
/>
```

---

## 8. DATA VERIFICATION SYSTEM

### 8.1 Add Verification Status to All Data
**Subtasks:**
- [ ] 8.1.1 Add `verified` boolean field to all data entries
- [ ] 8.1.2 Add `verificationDate` field
- [ ] 8.1.3 Add `verificationMethod` field (manual review, cross-referenced, etc.)
- [ ] 8.1.4 Display verification badge on UI
- [ ] 8.1.5 Allow filtering by verification status

### 8.2 Create Data Review Process Documentation
**New File:** `/DATA_VERIFICATION_PROCESS.md`

**Subtasks:**
- [ ] 8.2.1 Document how data is collected
- [ ] 8.2.2 Document verification criteria
- [ ] 8.2.3 Document update frequency
- [ ] 8.2.4 Document source credibility assessment
- [ ] 8.2.5 Document process for reporting incorrect data

---

## 9. TESTING & VALIDATION

### 9.1 Create Data Validation Tests
**Subtasks:**
- [ ] 9.1.1 Write tests to check all data has sources
- [ ] 9.1.2 Write tests to validate source URLs are accessible
- [ ] 9.1.3 Write tests to check date formats
- [ ] 9.1.4 Write tests to ensure no placeholder text
- [ ] 9.1.5 Write tests to validate verification status

### 9.2 Manual Review Checklist
**Subtasks:**
- [ ] 9.2.1 Review every page for simulated data
- [ ] 9.2.2 Click every source link to verify it works
- [ ] 9.2.3 Check every statistic has a source
- [ ] 9.2.4 Verify every claim is attributed
- [ ] 9.2.5 Ensure empty states show properly when data unavailable

---

## 10. DOCUMENTATION UPDATES

### 10.1 Update README
**File:** `/README.md`

**Subtasks:**
- [ ] 10.1.1 Add section on data sourcing methodology
- [ ] 10.1.2 List all data sources used
- [ ] 10.1.3 Explain verification process
- [ ] 10.1.4 Add "Data Accuracy" section
- [ ] 10.1.5 Add instructions for reporting incorrect data

### 10.2 Create DATA_SOURCES.md
**New File:** `/DATA_SOURCES.md`

**Subtasks:**
- [ ] 10.2.1 List all RSS feeds used
- [ ] 10.2.2 List all JSON data sources
- [ ] 10.2.3 List all API endpoints (if any)
- [ ] 10.2.4 Document update frequency for each source
- [ ] 10.2.5 Add contact information for data inquiries

---

## PRIORITY ORDER

### Phase 1 (CRITICAL - Do First):
1. Fix liveDataSources.js (Task 1)
2. Fix LiveIntelligenceFeed component (Task 2)
3. Create SourceAttribution component (Task 6.1)
4. Create EmptyState component (Task 7.1)

### Phase 2 (HIGH - Do Next):
5. Audit largest components (Task 4.1-4.10)
6. Add source attribution to all components (Task 6.2)
7. Audit data files (Task 5)

### Phase 3 (MEDIUM):
8. Add verification system (Task 8)
9. Create validation tests (Task 9)

### Phase 4 (FINAL):
10. Update documentation (Task 10)
11. Final manual review

---

## SUCCESS CRITERIA

✅ **Zero simulated/fake/mock data** in entire codebase
✅ **Every data point** has a visible source attribution
✅ **Every source link** is clickable and goes to real URL
✅ **Empty states** show clear messages instead of fake data
✅ **Verification status** displayed for all data
✅ **Documentation** explains data sourcing methodology
✅ **Tests** validate data integrity

---

## ESTIMATED EFFORT

- **Phase 1:** 4-6 hours
- **Phase 2:** 12-16 hours  
- **Phase 3:** 6-8 hours
- **Phase 4:** 4-6 hours

**Total:** 26-36 hours of development work

---

## NOTES

- This is a CRITICAL issue for credibility
- Users must trust that ALL data is real and verified
- Better to show "No data available" than fake data
- Every claim must be traceable to original source
- Transparency builds trust in the platform


---

## UPDATE: December 30, 2025 - Phase 1 Complete

### ✅ COMPLETED

**Phase 1: Foundation & Critical Fixes**
- ✅ Created `SourceAttribution.jsx` component
- ✅ Created `EmptyState.jsx` component
- ✅ Removed ALL simulated data from `liveDataSources.js`
- ✅ Fixed RSS feed aggregation (no fake fallbacks)
- ✅ Fixed `generateStats()` to use real data only
- ✅ Updated `LiveIntelligenceFeed` component
- ✅ Added 3 more RSS feeds (total: 8 real sources)
- ✅ Created comprehensive `DATA_SOURCES.md` documentation

### 🔍 KEY FINDINGS

**Architectural Issue Discovered:**
Most large components use **hardcoded data** instead of reading from JSON files that already have proper source URLs.

**Examples:**
- `PoliticalPrisoners.jsx` (1,149 lines) - Hardcoded, but `political_prisoners_research.json` has 60 prisoners with sources
- `DetentionFacilities.jsx` (572 lines) - Hardcoded with text sources, JSON has proper URLs
- Similar pattern across 10+ components

**Impact:** 
- JSON files have proper source attribution
- Components don't display these sources
- Users can't see source URLs

### 📋 REVISED PRIORITIES

**Phase 2: Component Refactoring (High Priority)**

Instead of manually adding sources to hardcoded data, we should:

1. **Refactor components to use JSON data files** (which already have sources)
2. **Add SourceAttribution display** to show the sources
3. **Remove hardcoded data** from components

**Benefits:**
- Single source of truth (JSON files)
- Easier to maintain and update
- Sources already exist in JSON
- More scalable

**Priority Order:**

1. **Political Prisoners** (Highest Impact)
   - Refactor to read from `political_prisoners_research.json`
   - Add SourceAttribution component
   - Display source URL for each prisoner
   - Estimated effort: 4-6 hours

2. **Detention Facilities** (High Impact)
   - Refactor to read from `detention_facilities_research.json`
   - Add map integration with source attribution
   - Link to ASPI satellite imagery
   - Estimated effort: 3-4 hours

3. **Sanctioned Officials** (Medium Impact)
   - Refactor to read from `sanctioned_officials_research.json`
   - Link directly to official sanction lists
   - Add verification badges
   - Estimated effort: 2-3 hours

4. **Company Tracker** (Medium Impact)
   - Refactor to read from `forced_labor_companies_research.json`
   - Add evidence links
   - Display supply chain sources
   - Estimated effort: 3-4 hours

5. **Other Components** (Lower Priority)
   - Confucius Institutes
   - Police Stations
   - Human Rights Organizations
   - Academic Experts

### 🎯 IMMEDIATE NEXT STEPS

**Quick Win: Add "View Data Sources" Link**
- Add prominent link to DATA_SOURCES.md in main navigation
- Add "Sources" button to each major component
- Shows transparency immediately while refactoring continues

**Example Implementation Needed:**
- Create one fully refactored component as template
- Document the refactoring pattern
- Apply to other components systematically

### 📊 PROGRESS TRACKING

**Transparency Level:**
- ✅ Live feeds: 100% (real RSS with sources)
- ✅ Documentation: 100% (DATA_SOURCES.md created)
- 🔄 Components: 10% (most still use hardcoded data)
- 📋 Source display: 5% (SourceAttribution created but not widely used)

**Target:**
- 🎯 All components: 100% using JSON with sources
- 🎯 All data points: Visible source attribution
- 🎯 All claims: Traceable to original URL

### 💡 LESSONS LEARNED

1. **JSON files are good** - They have proper sources
2. **Components are the problem** - They don't use the JSON files
3. **Refactoring > Manual editing** - More sustainable long-term
4. **Documentation helps** - DATA_SOURCES.md provides immediate transparency
5. **Incremental approach** - One component at a time, use as template

### 🚀 RECOMMENDED APPROACH

**Week 1:**
- Day 1-2: Refactor Political Prisoners component (template)
- Day 3: Document refactoring pattern
- Day 4-5: Refactor Detention Facilities

**Week 2:**
- Day 1-2: Refactor Sanctioned Officials
- Day 3-4: Refactor Company Tracker
- Day 5: Testing and documentation

**Week 3:**
- Refactor remaining components
- Final review and testing
- Update all documentation

---

## TECHNICAL NOTES

### Refactoring Pattern

**Before (Hardcoded):**
```jsx
const prisoners = [
  {
    name: 'Jimmy Lai',
    charges: ['...'],
    // No source URL
  }
];
```

**After (JSON + Source Attribution):**
```jsx
import prisonersData from '../data/political_prisoners_research.json';
import SourceAttribution from '../components/ui/SourceAttribution';

// In component:
{prisonersData.results.map(result => (
  <div>
    <h3>{result.output.prisoner_name}</h3>
    <SourceAttribution source={{
      name: 'Source',
      url: result.output.source_url,
      type: 'Verified Report',
      verified: result.output.confidence === 'HIGH'
    }} />
  </div>
))}
```

### JSON File Structure (Already Good)

All JSON files follow this pattern:
```json
{
  "results": [
    {
      "input": "Query/Description",
      "output": {
        "data_field_1": "value",
        "data_field_2": "value",
        "source_url": "https://...",
        "confidence": "HIGH/MEDIUM/LOW"
      },
      "error": ""
    }
  ]
}
```

**This is exactly what we need!** We just need components to use it.

---

## CONCLUSION

**Phase 1 Success:** ✅ Removed all simulated data from live feeds

**Phase 2 Focus:** 🔄 Refactor components to use existing JSON sources

**Timeline:** 2-3 weeks for complete refactoring

**Immediate Value:** DATA_SOURCES.md provides transparency NOW

---

**Next Update:** After completing first component refactor (Political Prisoners)

---

## UPDATE: February 24, 2026 - Session 76

### ✅ COMPLETED

**liveDataService.js — Remaining Simulated Data Removed**
- ✅ `fetchPoliticalPrisoners()`: Replaced 5-item hardcoded array with dynamic import from `political_prisoners_research.json` (62 verified entries)
- ✅ `fetchStatistics()`: Replaced fabricated numbers (847 orgs, 1200 facilities, 156 campaigns, 10000 prisoners) with actual counts derived from JSON data files (49 orgs, 380+ facilities per ASPI, null campaigns, 62 prisoners)
- ✅ Added source attribution metadata to statistics response
- ✅ Added data transparency note explaining counts are documented entries, not global totals

**Dashboard.jsx — Fabricated Metrics Removed**
- ✅ Removed "+12 this week" (fabricated live change metric)
- ✅ Removed "+5 new" (fabricated campaign change metric)
- ✅ Replaced with honest labels: "In database", "ASPI estimate", "Coming soon", "Documented cases"
- ✅ Active Campaigns now shows "—" with "Coming soon" (was showing fabricated "156")

**Tests Added**
- ✅ Created `live-data-service.test.js` (12 tests) verifying:
  - Statistics match actual JSON data file counts
  - No fabricated campaign numbers
  - Source attribution present
  - Static lastUpdated date (not fabricated real-time)
  - Prisoners come from JSON (not hardcoded)
  - No CCP state media in feed sources

**Agent:** Opus 4.6 (Session 76)
**Rationale:** This was an Opus task because it required fact verification (are these numbers real?), source credibility assessment (what should the numbers be?), and careful judgment about what to show vs. hide.

---

## UPDATE: February 25, 2026 - Session 77

### ✅ COMPLETED

**liveDataSources.js — Dead Code Removed**
- ✅ Removed `feedValidator` export (dead code — exported but never imported anywhere)
- ✅ Removed `checkFeedHealth()` function that returned fake `{ status: 'operational' }` without actually checking feed health
- ✅ Removed `validateSource()` that generated fake `lastChecked` timestamps

**human_rights_orgs_research.json — Schema Consistency**
- ✅ Added `source_url` field to all 49 entries (was using `website` field instead — schema mismatch with all other research files)
- ✅ Fixed Formosa Foundation entry: replaced `"N/A"` strings with empty strings (org defunct since 2016)

**research-data.test.js — Strengthened Tests**
- ✅ Added "at least 90% of entries have a source_url" test (catches missing schema fields)
- ✅ Added "all source_url values use HTTPS" test (catches insecure URLs and "N/A" strings)
- ✅ Tests increased from 63→83 (20 new, covering all 10 research files)

**Agent:** Opus 4.6 (Session 77)
**Rationale:** Data schema consistency and test strengthening — the existing research data test had a gap where files without `source_url` silently passed. The new tests would have caught the N/A and schema issues.
