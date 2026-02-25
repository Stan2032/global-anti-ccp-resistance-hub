# Site Cleanup & Simplification - Comprehensive TODO

**Goal:** Make the site cleaner, more readable, less cluttered, and more professional

**Date:** January 7, 2026  
**Last reviewed:** February 25, 2026 (Session 92)  
**Status:** ~70% complete. Typography ✅, emoji reduction ✅, tab consolidation ✅, nav emojis ✅, accessibility ✅, performance ✅, data migrations ✅, ESLint ✅. Remaining: page merging, visual hierarchy, color standardization.

---

## PRIORITY 1: UI/READABILITY IMPROVEMENTS (IMMEDIATE) — ✅ DONE (Session 84)

> **Completed:** Font sizes bumped (text-xs: 12→14px, text-sm: 14→16px), contrast overrides applied, line-height improved (leading-relaxed), paragraph font-weight increased. All via CSS overrides in index.css.

### 1.1 Typography & Contrast
**Problem:** ~~Text too small, low contrast, hard to read~~ **RESOLVED**

**Tasks:**
- [x] **Increase base font sizes globally**
  - ~~Change `text-sm` (14px) → `text-base` (16px) for body text~~ Done via CSS override (0.9375rem→1rem)
  - ~~Change `text-xs` (12px) → `text-sm` (14px) for secondary text~~ Done via CSS override (0.8125rem→0.875rem)
  - Change `text-base` (16px) → `text-lg` (18px) for important text — Deferred (not needed after text-sm bump)
  - Keep headings as-is (already large) ✅

- [x] **Make text bolder**
  - ~~Change `font-normal` → `font-medium` for body text~~ Paragraph weight set to 450
  - ~~Change `font-semibold` → `font-bold` for emphasis~~ Button weight already 500
  - ~~Add `font-semibold` to all paragraph text~~ Done via p{} rule

- [x] **Improve color contrast**
  - ~~Change `text-slate-400` → `text-slate-300` (lighter, more readable)~~ Override to #a8b5c7 (8.59:1)
  - ~~Change `text-slate-500` → `text-slate-400`~~ Override to #8893a2 (5.74:1)
  - ~~Change `text-gray-400` → `text-gray-300`~~ Override to #a3aebb (7.94:1)
  - ~~Ensure all text meets WCAG AA standards (4.5:1 contrast ratio)~~ All overrides verified

- [x] **Add line-height for readability**
  - ~~Add `leading-relaxed` (1.625) to all paragraph text~~ Done via text-sm and text-base overrides
  - Add `leading-loose` (2) to dense content sections — Deferred (1.625 sufficient)

**Estimated Impact:** ~~Massive improvement in readability~~ ✅ DELIVERED
**Files Affected:** ~~~50 components, global CSS~~ Only index.css (global CSS overrides)

---

## PRIORITY 2: EMOJI REDUCTION (IMMEDIATE) — ✅ DONE (Sessions 18, 62-71)

> **Completed:** 934 → 278 emojis (70% reduction). Navigation emojis all removed — uses plain text labels with terminal aesthetic. Only 6 flag emojis remain in LanguageSelector.jsx. See TODO.md "Recently Completed" section.

### 2.1 Remove Excessive Emojis
**Problem:** ~~170+ emoji instances - looks unprofessional, cluttered~~ **RESOLVED — reduced from 934 to 278 (70%)**

**Tasks:**
- [x] **Remove decorative emojis from navigation**
  - ~~Dashboard 📊 → Dashboard~~ Done — all nav uses plain text
  - ~~Intelligence 📰 → Intelligence~~ Done
  - ~~Directory 👥 → Directory~~ Done
  - ~~Take Action ✊ → Take Action~~ Done
  - ~~Community 💬 → Community~~ Done
  - ~~Resources 🛠️ → Resources~~ Done
  - ~~Education 🎓 → Education~~ Done
  - ~~Security 🛡️ → Security~~ Done

- [x] **Keep only functional emojis**
  - Status indicators: 🟢🟡🔴 (traffic light system) - KEPT
  - Warnings: ⚠️ (important warnings only) - KEPT SPARINGLY
  - Checkmarks: ✅ (completion status) - KEPT FOR LISTS
  - All other decorative emojis removed

- [x] **Replace emojis with text/icons**
  - Lucide React icons used throughout
  - Text labels for categories
  - Colored badges for status

**Target:** Reduce from 170 to ~30 functional emojis only
**Files Affected:** App.jsx, ~40 components

---

## PRIORITY 3: REMOVE REDUNDANT CONTENT (HIGH)

### 3.1 Eliminate Repeated Disclaimers — ✅ MOSTLY DONE (Sessions 34-85)
**Problem:** ~~Same disclaimers repeated on 12+ pages~~ **RESOLVED — GlobalDisclaimer component created and adopted**

**Tasks:**
- [x] **Create single global disclaimer component**
  - `<GlobalDisclaimer type="verify" />` - "Always verify information"
  - `<GlobalDisclaimer type="sensitive" />` - "Verify organizations before sharing info"
  - `<GlobalDisclaimer type="changing" />` - "Information may change"
  - `<GlobalDisclaimer type="security" />` - "Take security precautions"
  - Component: `src/components/ui/GlobalDisclaimer.jsx` — supports `compact` mode and custom `className`
  
- [x] **Replace individual disclaimers in:** 9 components + 15 profile pages now use GlobalDisclaimer

- [x] **Remaining custom disclaimers (intentionally kept):**
  - ForcedLabourList.jsx — domain-specific disclaimer about China manufacturing/supply chains
  - LegalResourcesHub.jsx — domain-specific legal advice disclaimer with emergency contact info
  - These contain unique, specific content that doesn't fit generic types — kept as-is by design

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

## PRIORITY 4: SIMPLIFY PAGE STRUCTURE (HIGH) — ✅ MOSTLY DONE (Sessions 62-85)

> **Completed:** Tab consolidation done across all major pages. Education 17→7, Security 9→5, Community 12→6. Page consolidation: 18→14 (4 orphan pages merged + redirects). See below for remaining page merge opportunities.

### 4.1 Reduce Tab Overload
**Problem:** ~~Some pages have 15+ tabs - overwhelming~~ **RESOLVED**

**Tasks:**
- [x] **Education Center: 17 tabs → 7 tabs** ✅
  - Merged similar tabs, removed redundant content, grouped related information
  - Current tabs: Learn, Media, Research, History, Tools, FAQ, Progress

- [x] **Security Center: 9 tabs → 5 tabs** ✅
  - Consolidated tools, removed overlapping content
  - Current tabs: Assess, Tools, Guides, Protect, Whistleblower

- [x] **Community Support: 12 tabs → 6 tabs** ✅
  - Merged support resources, consolidated directories
  - Current tabs: Support, Events, Stories, Report, Volunteer, Contact

- [ ] **Resources Page: Multiple sections → Organized categories**
  - Currently a landing/navigation hub (no tabs), links to other pages
  - Group by type, remove duplicates

**Estimated Impact:** ~~50% reduction in navigation complexity~~ ✅ DELIVERED (58% tab reduction across 3 major pages)

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

## PRIORITY 8: PERFORMANCE OPTIMIZATION (LOW) — ✅ MOSTLY DONE (Sessions 38-39)

> **Completed:** Dead code removal (15 files, 4,648 lines). Lazy-loaded 81 sub-components across 8 pages. All page bundles under 50KB. See TODO.md "Recently Completed" section.

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

## PRIORITY 9: ACCESSIBILITY IMPROVEMENTS (LOW) — ✅ MOSTLY DONE (Sessions 10, 14, 18)

> **Completed:** 208 ARIA/role/tabIndex attributes added across all interactive components. See TODO.md "Recently Completed" section. Full WCAG 2.1 automated audit still outstanding.

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

**After (Current State — Feb 2026):**
- ~6 flag emojis only (97% reduction) ✅
- 14 pages (4 orphan pages merged, redirects in place) ✅
- 7 tabs in Education Center (59% reduction) ✅
- Text sizes bumped globally via CSS overrides ✅
- 1 GlobalDisclaimer component used across 24 files ✅
- Single source-of-truth for facts (partially — timeline + data sources exist) 🟡

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
- [x] Add "Quick Start" guide for new users ✅ (QuickStartGuide component)
- [ ] Add "Most Important Actions" page
- [ ] Add "Weekly Digest" of key updates
- [x] Add "Success Stories" section ✅ (SuccessStories component on TakeAction page)
- [ ] Add "How to Help" prominent CTA

### Feature Ideas:
- [x] Add dark/light mode toggle ✅ (ThemeToggle in ThemeContext)
- [ ] Add font size adjustment
- [x] Add language selector ✅ (8 languages: en, zh-CN, zh-TW, vi, ko, ja, ug, bo)
- [x] Add print-friendly views ✅ (@media print styles for profile pages)
- [ ] Add export to PDF features

### Community Ideas:
- [ ] Add user testimonials
- [ ] Add community forum link
- [ ] Add social media integration
- [x] Add newsletter signup ✅ (NewsDigest component wired to Supabase)
- [x] Add feedback form ✅ (ContactForm component wired to Supabase)

### Technical Ideas:
- [x] Add service worker for offline ✅ (PWA with OfflineModeManager)
- [x] Add PWA manifest ✅ (manifest.json with icons)
- [ ] Add analytics (privacy-respecting)
- [x] Add error boundary components ✅ (ErrorBoundary + RouteErrorBoundary)
- [x] Add automated testing ✅ (607 Vitest tests across 34 files)

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
