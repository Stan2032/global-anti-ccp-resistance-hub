# Site Structure Analysis & Simplification Plan

## Current Structure (14 Pages)

### MAIN PAGES:
1. **Dashboard** - Overview, stats, urgent alerts
2. **Intelligence** (IntelligenceFeeds.jsx) - Live RSS feeds, news
3. **Directory** (ResistanceDirectory.jsx) - Organizations, contacts
4. **Political Prisoners** - Prisoner database
5. **Regional Threats** - Threats by region
6. **Take Action** - Action items, petitions
7. **Campaigns** (CampaignHubs.jsx) - Campaign tracking
8. **Community** (CommunitySupport.jsx) - Forums, support
9. **Communications** (SecureComms.jsx) - Secure messaging tools
10. **Tools** - (embedded in other pages)
11. **CCP Tactics** - Educational content about CCP methods
12. **Education** (EducationalResources.jsx) - Learning materials
13. **Security** (SecurityCenter.jsx) - Security guides
14. **Data Sources** - Source transparency page

---

## PROBLEMS IDENTIFIED:

### 1. **Too Many Similar Pages**
- **Intelligence** vs **Dashboard** - Both show news/alerts
- **Resources** (ResistanceResources.jsx) vs **Education** - Overlap
- **Community** vs **Directory** - Both about connections
- **Take Action** vs **Campaigns** - Both about activism

### 2. **Confusing Navigation**
- 14 top-level pages is overwhelming
- Unclear hierarchy
- Similar content scattered across multiple pages

### 3. **Redundant Content**
- News appears in: Dashboard, Intelligence, Regional Threats
- Resources appear in: Education, Resources, Security
- Actions appear in: Take Action, Campaigns, Dashboard

---

## PROPOSED SIMPLIFICATION (8 Core Pages)

### **CONSOLIDATE TO:**

1. **🏠 Dashboard** (KEEP)
   - Overview, key stats, urgent alerts
   - Quick links to everything
   - Recent news summary

2. **📰 Intelligence** (MERGE: IntelligenceFeeds + Regional Threats)
   - Live RSS feeds
   - Regional threat analysis
   - All news in one place

3. **⛓️ Prisoners & Facilities** (MERGE: Political Prisoners into one focused page)
   - Political prisoner database
   - Detention facilities map
   - Related data

4. **✊ Take Action** (MERGE: Take Action + Campaigns + CampaignHubs)
   - All activism in one place
   - Petitions, campaigns, action items
   - Campaign progress tracking

5. **👥 Community** (MERGE: Community + Directory + Communications)
   - Organization directory
   - Secure communications tools
   - Community forums/support

6. **📚 Resources** (MERGE: Education + Resources + CCP Tactics + Security)
   - Educational materials
   - Security guides
   - CCP tactics database
   - All learning resources

7. **🔍 Data Sources** (KEEP - Important for transparency)
   - Source transparency
   - Methodology
   - Data verification

8. **⚙️ Settings/Tools** (NEW - Consolidate utilities)
   - User preferences
   - Bookmarks
   - Data export
   - Accessibility options

---

## NAVIGATION STRUCTURE

### **Simplified Menu:**
```
🏠 Dashboard
📰 Intelligence
⛓️ Prisoners
✊ Take Action
👥 Community
📚 Resources
🔍 Sources
⚙️ Settings
```

**Benefits:**
- 8 pages instead of 14 (43% reduction)
- Clear purpose for each page
- Logical grouping
- Easier to navigate
- Less overwhelming

---

## IMPLEMENTATION PLAN

### **Phase 1: Merge Pages**
1. Create new combined components
2. Migrate content from old pages
3. Update routing

### **Phase 2: Update Navigation**
1. Simplify App.jsx menu
2. Update all internal links
3. Add breadcrumbs for sub-sections

### **Phase 3: Remove Redundancy**
1. Delete old page files
2. Clean up unused components
3. Update documentation

---

## ESTIMATED IMPACT

**Before:**
- 14 top-level pages
- Confusing navigation
- Duplicate content
- Overwhelming for new users

**After:**
- 8 clear, focused pages
- Intuitive navigation
- Single source of truth for each content type
- Professional, streamlined experience

---

## RECOMMENDATION

**Start with merging the most redundant pages:**
1. Take Action + Campaigns → **Take Action** (biggest overlap)
2. Education + Resources → **Resources** (similar purpose)
3. Intelligence + Regional Threats → **Intelligence** (both news)
4. Community + Directory + SecureComms → **Community** (all about connections)

This alone reduces from 14 → 10 pages immediately.
