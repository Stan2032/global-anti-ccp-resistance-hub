# Site Cleanup & Simplification - Comprehensive TODO

**Goal:** Make the site cleaner, more readable, less cluttered, and more professional

**Date:** January 7, 2026

---

## PRIORITY 1: UI/READABILITY IMPROVEMENTS (IMMEDIATE)

### 1.1 Typography & Contrast
**Problem:** Text too small, low contrast, hard to read

**Tasks:**
- [ ] **Increase base font sizes globally**
  - Change `text-sm` (14px) → `text-base` (16px) for body text
  - Change `text-xs` (12px) → `text-sm` (14px) for secondary text
  - Change `text-base` (16px) → `text-lg` (18px) for important text
  - Keep headings as-is (already large)

- [ ] **Make text bolder**
  - Change `font-normal` → `font-medium` for body text
  - Change `font-semibold` → `font-bold` for emphasis
  - Add `font-semibold` to all paragraph text

- [ ] **Improve color contrast**
  - Change `text-slate-400` → `text-slate-300` (lighter, more readable)
  - Change `text-slate-500` → `text-slate-400`
  - Change `text-gray-400` → `text-gray-300`
  - Ensure all text meets WCAG AA standards (4.5:1 contrast ratio)

- [ ] **Add line-height for readability**
  - Add `leading-relaxed` (1.625) to all paragraph text
  - Add `leading-loose` (2) to dense content sections

**Estimated Impact:** Massive improvement in readability
**Files Affected:** ~50 components, global CSS

---

## PRIORITY 2: EMOJI REDUCTION (IMMEDIATE)

### 2.1 Remove Excessive Emojis
**Problem:** 170+ emoji instances - looks unprofessional, cluttered

**Tasks:**
- [ ] **Remove decorative emojis from navigation**
  - Dashboard 📊 → Dashboard
  - Intelligence 📰 → Intelligence
  - Directory 👥 → Directory
  - Take Action ✊ → Take Action
  - Community 💬 → Community
  - Resources 🛠️ → Resources
  - Education 🎓 → Education
  - Security 🛡️ → Security

- [ ] **Keep only functional emojis**
  - Status indicators: 🟢🟡🔴 (traffic light system) - KEEP
  - Warnings: ⚠️ (important warnings only) - KEEP SPARINGLY
  - Checkmarks: ✅ (completion status) - KEEP FOR LISTS
  - Remove all other decorative emojis

- [ ] **Replace emojis with text/icons**
  - Use Lucide React icons instead of emojis
  - Use text labels for categories
  - Use colored badges for status

**Target:** Reduce from 170 to ~30 functional emojis only
**Files Affected:** App.jsx, ~40 components

---

## PRIORITY 3: REMOVE REDUNDANT CONTENT (HIGH)

### 3.1 Eliminate Repeated Disclaimers
**Problem:** Same disclaimers repeated on 12+ pages

**Tasks:**
- [ ] **Create single global disclaimer component**
  - `<GlobalDisclaimer type="verify" />` - "Always verify information"
  - `<GlobalDisclaimer type="sensitive" />` - "Verify organizations before sharing info"
  - `<GlobalDisclaimer type="changing" />` - "Information may change"
  
- [ ] **Remove individual disclaimers from:**
  - CCPOfficials.jsx
  - CaseStudies.jsx
  - CompanyTracker.jsx
  - DocumentaryList.jsx
  - DonationGuide.jsx
  - MediaBiasGuide.jsx
  - AcademicCitationGenerator.jsx
  - VictimMemorialWall.jsx
  - AIDisinfoDetector.jsx
  - ForcedLabourList.jsx
  - ResistanceDirectory.jsx
  - (11 more files)

- [ ] **Add single disclaimer footer to layout**
  - Shows once at bottom of every page
  - Users see it once, not 5 times per page

**Estimated Impact:** Remove ~500 lines of redundant code
**Files Affected:** ~20 components, create 1 new component

### 3.2 Consolidate Repeated Information
**Problem:** Same facts/statistics repeated across multiple pages

**Tasks:**
- [ ] **Audit for repeated content:**
  - "1 million Uyghurs detained" - appears 8+ times
  - "2019 Hong Kong protests" - appears 6+ times
  - "Tiananmen Square 1989" - appears 5+ times
  - ASPI report citations - appears 10+ times
  - HRW report citations - appears 8+ times

- [ ] **Create single source-of-truth pages:**
  - `/facts` - Key statistics with sources
  - `/timeline` - Historical events (one place)
  - `/sources` - All research citations (already exists, use it more)

- [ ] **Link to source-of-truth instead of repeating:**
  - "See [Key Facts](/facts) for details" instead of repeating
  - "See [Timeline](/timeline) for historical context"
  - "See [Data Sources](/data-sources) for research"

**Estimated Impact:** Remove ~1000 lines of redundant content
**Files Affected:** ~30 components

---

## PRIORITY 4: SIMPLIFY PAGE STRUCTURE (HIGH)

### 4.1 Reduce Tab Overload
**Problem:** Some pages have 15+ tabs - overwhelming

**Tasks:**
- [ ] **Education Center: 17 tabs → 8 tabs**
  - Merge similar tabs
  - Remove redundant content
  - Group related information

- [ ] **Security Center: 9 tabs → 5 tabs**
  - Consolidate tools
  - Remove overlapping content

- [ ] **Community Support: 12 tabs → 6 tabs**
  - Merge support resources
  - Consolidate directories

- [ ] **Resources Page: Multiple sections → Organized categories**
  - Group by type
  - Remove duplicates

**Estimated Impact:** 50% reduction in navigation complexity
**Files Affected:** 4 major pages

### 4.2 Consolidate Overlapping Pages
**Problem:** Content appears in multiple places

**Tasks:**
- [ ] **Merge Take Action + Campaigns** (already planned)
  - Single activism hub
  - Remove duplicate campaign info

- [ ] **Merge Communications + Community**
  - Single community page
  - Remove duplicate secure comms info

- [ ] **Merge CCP Tactics + Education**
  - Tactics as education section
  - Remove duplicate propaganda info

- [ ] **Merge Regional Threats + Intelligence**
  - Threats as intelligence category
  - Remove duplicate threat analysis

**Estimated Impact:** 14 pages → 8 pages (43% reduction)
**Files Affected:** 8 pages, navigation, routing

---

## PRIORITY 5: IMPROVE VISUAL HIERARCHY (MEDIUM)

### 5.1 Better Section Organization
**Problem:** Walls of text, unclear structure

**Tasks:**
- [ ] **Add clear visual separators**
  - Use horizontal rules between sections
  - Add background color changes
  - Use cards for distinct content blocks

- [ ] **Improve heading hierarchy**
  - h2 for main sections (larger, bolder)
  - h3 for subsections (medium)
  - h4 for minor sections (smaller)
  - Consistent spacing

- [ ] **Use whitespace effectively**
  - Increase padding between sections
  - Add margins around content blocks
  - Don't cram everything together

- [ ] **Group related content visually**
  - Use bordered containers
  - Use background colors for grouping
  - Use consistent spacing

**Estimated Impact:** Much clearer content structure
**Files Affected:** All pages, global CSS

### 5.2 Simplify Color Scheme
**Problem:** Too many similar grays, inconsistent colors

**Tasks:**
- [ ] **Standardize background colors**
  - Primary bg: `bg-slate-900` (darkest)
  - Secondary bg: `bg-slate-800` (medium)
  - Tertiary bg: `bg-slate-700` (lighter)
  - Remove: slate-850, slate-750, gray-900, etc.

- [ ] **Standardize text colors**
  - Primary text: `text-white` (headings)
  - Secondary text: `text-slate-300` (body)
  - Tertiary text: `text-slate-400` (labels)
  - Remove: slate-200, slate-500, gray-300, etc.

- [ ] **Standardize accent colors**
  - Success: `text-green-400` / `bg-green-900/20`
  - Warning: `text-yellow-400` / `bg-yellow-900/20`
  - Error: `text-red-400` / `bg-red-900/20`
  - Info: `text-blue-400` / `bg-blue-900/20`
  - Remove all other color variations

**Estimated Impact:** Consistent, professional appearance
**Files Affected:** All components, create color guide

---

## PRIORITY 6: REMOVE CLUTTER (MEDIUM)

### 6.1 Simplify Forms and Inputs
**Problem:** Too many fields, overwhelming

**Tasks:**
- [ ] **Reduce form fields**
  - Only ask for essential information
  - Use progressive disclosure (show more if needed)
  - Remove optional fields

- [ ] **Simplify search/filter interfaces**
  - Fewer filter options
  - Clearer labels
  - Better defaults

- [ ] **Remove unnecessary buttons**
  - Combine similar actions
  - Remove redundant options
  - Keep only essential controls

**Estimated Impact:** Faster, easier interactions
**Files Affected:** ~20 components with forms

### 6.2 Reduce Visual Noise
**Problem:** Too many borders, shadows, effects

**Tasks:**
- [ ] **Simplify borders**
  - Use borders only when necessary
  - Consistent border colors
  - Remove double borders

- [ ] **Reduce shadows**
  - Use shadows sparingly
  - Consistent shadow sizes
  - Remove excessive depth effects

- [ ] **Simplify animations**
  - Keep only essential transitions
  - Remove distracting effects
  - Consistent timing

**Estimated Impact:** Cleaner, more professional look
**Files Affected:** All components, global CSS

---

## PRIORITY 7: IMPROVE MOBILE RESPONSIVENESS (MEDIUM)

### 7.1 Mobile-First Text Sizes
**Problem:** Text too small on mobile

**Tasks:**
- [ ] **Increase mobile base font size**
  - Mobile: 16px minimum (current: 14px)
  - Tablet: 16px
  - Desktop: 18px

- [ ] **Improve mobile spacing**
  - Larger tap targets (44px minimum)
  - More padding on mobile
  - Better line height

- [ ] **Simplify mobile navigation**
  - Clearer menu structure
  - Larger touch targets
  - Fewer nested levels

**Estimated Impact:** Much better mobile experience
**Files Affected:** Global CSS, navigation components

---

## PRIORITY 8: PERFORMANCE OPTIMIZATION (LOW)

### 8.1 Reduce Bundle Size
**Problem:** Large JavaScript bundles

**Tasks:**
- [ ] **Remove unused components**
  - Audit for dead code
  - Remove commented code
  - Clean up imports

- [ ] **Optimize images**
  - Compress images
  - Use WebP format
  - Lazy load images

- [ ] **Code splitting**
  - Split large components
  - Lazy load routes
  - Reduce initial bundle

**Estimated Impact:** Faster page loads
**Files Affected:** Build config, all components

---

## PRIORITY 9: ACCESSIBILITY IMPROVEMENTS (LOW)

### 9.1 ARIA Labels and Semantic HTML
**Problem:** Missing accessibility features

**Tasks:**
- [ ] **Add ARIA labels**
  - Label all interactive elements
  - Add descriptions for screen readers
  - Proper heading hierarchy

- [ ] **Keyboard navigation**
  - Ensure all features keyboard accessible
  - Visible focus indicators
  - Logical tab order

- [ ] **Color contrast**
  - Meet WCAG AA standards
  - Don't rely on color alone
  - Test with contrast checkers

**Estimated Impact:** Accessible to all users
**Files Affected:** All interactive components

---

## PRIORITY 10: DOCUMENTATION (LOW)

### 10.1 Update Documentation
**Problem:** Outdated or missing docs

**Tasks:**
- [ ] **Update README.md**
  - Current features
  - Installation instructions
  - Contribution guidelines

- [ ] **Create STYLE_GUIDE.md**
  - Typography standards
  - Color palette
  - Component patterns
  - Emoji usage rules

- [ ] **Create CONTENT_GUIDE.md**
  - Tone and voice
  - Fact-checking process
  - Source requirements
  - Update procedures

**Estimated Impact:** Better maintainability
**Files Affected:** Documentation files

---

## IMPLEMENTATION PLAN

### Phase 1: Quick Wins (1-2 hours)
1. Increase font sizes globally
2. Improve text contrast
3. Remove navigation emojis
4. Create global disclaimer component

### Phase 2: Content Cleanup (2-3 hours)
5. Remove redundant disclaimers
6. Consolidate repeated information
7. Remove excessive emojis from components

### Phase 3: Structure (3-4 hours)
8. Merge overlapping pages
9. Reduce tab counts
10. Improve visual hierarchy

### Phase 4: Polish (2-3 hours)
11. Standardize colors
12. Remove visual clutter
13. Improve mobile responsiveness

### Phase 5: Optimization (2-3 hours)
14. Performance improvements
15. Accessibility fixes
16. Update documentation

**Total Estimated Time:** 10-15 hours
**Total Estimated Impact:** 50% reduction in clutter, 100% improvement in readability

---

## METRICS FOR SUCCESS

**Before:**
- 170 emojis
- 14 pages
- 17 tabs in Education Center
- 1873 instances of small text
- ~500 lines of redundant disclaimers
- ~1000 lines of repeated content

**After (Target):**
- 30 functional emojis (82% reduction)
- 8 pages (43% reduction)
- 8 tabs in Education Center (53% reduction)
- <500 instances of small text (73% reduction)
- 1 global disclaimer component (100% consolidation)
- Single source-of-truth for facts (100% consolidation)

**User Experience:**
- Easier to read (larger, bolder text)
- Less overwhelming (fewer pages, tabs)
- More professional (fewer emojis)
- Less repetitive (no redundant content)
- Clearer structure (better hierarchy)
- Faster (performance optimizations)

---

## ADDITIONAL IDEAS TO CONSIDER

### Content Ideas:
- [ ] Add "Quick Start" guide for new users
- [ ] Add "Most Important Actions" page
- [ ] Add "Weekly Digest" of key updates
- [ ] Add "Success Stories" section
- [ ] Add "How to Help" prominent CTA

### Feature Ideas:
- [ ] Add dark/light mode toggle
- [ ] Add font size adjustment
- [ ] Add language selector (future)
- [ ] Add print-friendly views
- [ ] Add export to PDF features

### Community Ideas:
- [ ] Add user testimonials
- [ ] Add community forum link
- [ ] Add social media integration
- [ ] Add newsletter signup
- [ ] Add feedback form

### Technical Ideas:
- [ ] Add service worker for offline
- [ ] Add PWA manifest
- [ ] Add analytics (privacy-respecting)
- [ ] Add error boundary components
- [ ] Add automated testing

---

## NOTES

**Principles:**
1. **Less is more** - Remove, don't add
2. **Clarity over cleverness** - Simple, direct communication
3. **Consistency** - Same patterns everywhere
4. **Accessibility** - Usable by everyone
5. **Performance** - Fast and responsive

**Questions to Ask:**
- Does this need to be here?
- Is this repeated elsewhere?
- Can this be simpler?
- Is this easy to read?
- Does this help the user?

**What NOT to Change:**
- Core mission and values
- Factual accuracy
- Source attribution
- Data integrity
- Security features
