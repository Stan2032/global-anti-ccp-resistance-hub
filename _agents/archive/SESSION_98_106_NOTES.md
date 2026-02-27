# Sessions 98-106 Decision Notes

> Written during Session 106 as part of merge preparation.
> Previous notes: SESSION_83_97_COMPREHENSIVE_NOTES.md

---

## Session 98: Design System Color Standardization

**What**: Standardized LiuXiaoboProfile.jsx — replaced 21 structural `bg-gray-*`/`border-gray-*` classes with terminal hex palette.

**Why**: The design system test caught rounded corners and gradients, but not gray color violations. Many components still used Tailwind gray scale for structural backgrounds (card surfaces, section backgrounds, divider borders) instead of the terminal hex palette (#0a0e14, #111820, #1c2a35).

**Key Decision — Structural vs Semantic Gray**: Not all gray is wrong. We established a clear rule:
- **Structural gray** (card backgrounds, section backgrounds, divider borders) → MUST use hex palette
- **Semantic gray** (status badges with opacity like `bg-gray-500/20`, color maps in functions, hover states, return statements from color-picker functions) → OK to use Tailwind gray scale

This distinction was encoded into the design-system.test.js with exemption patterns. Future agents should follow this same distinction.

**Test Added**: Automated scan for structural bg-gray and border-gray violations, with smart exemptions for semantic uses.

---

## Session 99: Security Hardening

**What**: Added 3 security headers to `public/_headers`: HSTS, COOP, CORP.

**Why**: This site is used by activists who may be in hostile network environments. HSTS prevents protocol downgrade attacks (forces HTTPS for 1 year). COOP mitigates Spectre-class side-channel attacks. CORP prevents cross-origin resource theft.

**Key Decision**: Used `preload` in HSTS because the site is already HTTPS-only via Cloudflare. This tells browsers to never attempt HTTP, even on first visit (once in preload lists).

**Pattern**: Security headers are file-based (`public/_headers`), not code-based. Cloudflare Workers reads this file and applies headers to all responses. Tests read the file and validate structure.

---

## Session 100: Sitemap & Test Consolidation

**What**: Added robots.txt validation tests and GitHub Pages URL contamination check.

**Anti-Pattern Caught**: Initially created a separate `sitemap-validation.test.js` file that duplicated 12 tests already in `sitemap-data.test.js`. Caught the duplication immediately and consolidated — merged 5 unique new tests into the existing file and deleted the duplicate.

**Lesson for Future Agents**: Before creating a new test file, CHECK if there's already one covering that area. The test suite is organized by data domain (sanctions-tracker-data, sitemap-data, security-headers, etc.). If a file exists for your domain, ADD to it rather than creating a parallel file.

---

## Session 101: SkipLinks i18n

**What**: Fixed SkipLinks component to use `useLanguage()` hook for all 8 locales. Applied terminal design colors.

**Key Challenge**: In the test environment, `t()` returns the translation key as a fallback (e.g., `'skipToMain'` not `'Skip to main content'`). Tests must use regex matchers like `/skip.*main|skipToMain/i` to handle both production text and test fallback.

**Pattern**: When testing i18n components, wrap with `LanguageProvider` and use flexible matchers. Don't assert exact English strings — they'll fail when the translation system returns keys.

---

## Session 102: Timeline JSON Migration

**What**: Migrated Timeline.jsx from 225 lines of hardcoded stale data (25 events ending Dec 2022) to JSON import (31 events through Feb 2026).

**Why**: This was the 5th and final data migration. The component had 3+ years of missing events. The JSON file (`timeline_events.json`) already existed with current data — InteractiveTimeline.jsx was using it — but the legacy Timeline.jsx was still hardcoding.

**Pattern**: Same as all 5 migrations: import JSON, remove hardcoded array, let component render from data. Component shrunk 49%.

---

## Session 103: Orphan Component Cleanup

**What**: Removed 7 orphan components (2,043 lines of dead code). Integrated 2 unique-content orphans into existing pages.

**Decision Process**:
1. Listed all `src/components/*.jsx` files
2. For each, checked if any other file imports it
3. Categorized orphans as "has active replacement" vs "unique content"
4. Removed those with replacements: Timeline→InteractiveTimeline, SanctionedOfficialsTracker→CCPOfficials, DetentionFacilitiesTracker→DetentionFacilities, ConfuciusInstituteTracker→ConfuciusInstitutes, Glossary→GlossaryTerms, PodcastList→PodcastPlayer, LegalResources→LegalResourcesHub
5. Integrated unique ones: ChinaTechThreats→SecurityCenter "Tech Threats" tab, MediaManipulation→EducationalResources "Media" tab

**Prevention**: Added automated orphan detection test that scans all `src/components/*.jsx` and verifies each is imported somewhere.

**Lesson**: Dead code accumulates silently. Automated detection is the only reliable prevention.

---

## Session 104: WCAG Heading Hierarchy + Semantic Buttons

**What**: Fixed 4 invalid h4 headings in TakeAction.jsx (used as labels, not subsections). Converted div[role="button"] to semantic motion.button in CommunitySupport.jsx.

**Why**: WCAG 1.3.1 requires heading levels to not skip (h2→h4 without h3 is invalid). These h4 tags were being used as visual labels ("Sample Message:", "Companies to Avoid:") — they should have been `<p>` or `<strong>` tags, not heading elements.

**Pattern for Semantic Buttons**: When converting `div[role="button"]` to `<button>`:
- Use `type="button"` (prevents form submission)
- Add `text-left w-full` (buttons default to center-aligned)
- Remove `role="button"`, `tabIndex={0}`, and `onKeyDown` handler (all implicit with `<button>`)
- For Framer Motion: use `motion.button` directly (not `motion.div`)

---

## Session 105: Complete Semantic Button Audit

**What**: Converted ALL 7 remaining `div[role="button"]` to semantic `button`/`motion.button` across 7 files.

**Files Changed**: JimmyLaiProfile, PanchenLamaProfile, IlhamTohtiProfile, PoliticalPrisoners, ResistanceDirectory, EducationalResources, ForcedLaborTracker.

**Prevention**: Added automated test scanning all JSX for `role="button"`. 0 violations remain.

**Lesson**: Accessibility fixes are mechanical and systematic. Find all instances, apply the same pattern, add a test to prevent regression. Don't fix one and leave the others.

---

## Session 106: Email Deferral + Merge Preparation

**What**: Owner directive to defer email/newsletter functionality. Updated TODO.md. Prepared branch for merge.

**Owner Quote**: "Let's delay the email part of the todo until a lot later, I'll look into and decide at a later date"

**What was Deferred**:
- Email newsletter subscription (Feature Ideas Backlog)
- Email client integration (Feature Ideas Backlog)
- Email service choice (HR3.3 — was listed as needing human decision)

**Merge Preparation**:
- Updated all test counts to 631 across 6 documentation files
- Updated AGENT_HANDOFF.json to v8.1 (sessions 104→106, 630→631 tests, added CodeQL/design-system-checks/email fields)
- Updated NEXT_AGENT_PROMPT.md with full accomplishment list (28→32 items)
- Wrote this session notes file for knowledge transfer

---

## Patterns for Future Agents

### Effective Patterns (Proven Across 24+ Sessions)
1. **CSS overrides in index.css** — Change font sizes, line heights, colors globally without touching individual components. Additive, minimal, reversible.
2. **Bulk scanning tests** — Collect violations in array, assert empty. Don't create per-file `it()` blocks (inflates counts without adding coverage).
3. **JSON as single source of truth** — Components import from JSON, tests validate JSON. No hardcoded data arrays.
4. **Prevention tests** — Don't just fix an issue; add a test that catches it if reintroduced. See: CPC ban, orphan detection, role="button" prevention, gradient ban, rounded ban, structural gray ban.
5. **Incremental commits** — Small changes, frequent `report_progress`, verify after each change. Don't batch large changes.
6. **Test before creating new files** — Check if a test file already exists for your domain before creating a new one.

### What NOT to Do
1. **Don't create duplicate test files** — Check existing tests first. Consolidate, don't proliferate.
2. **Don't change semantic color usage** — Status badges, color maps, and function return values can use Tailwind gray. Only structural backgrounds/borders need hex.
3. **Don't machine-translate profile content** — Human rights narratives need human translators.
4. **Don't use "CPC"** — Automated test will catch it, but don't even try.
5. **Don't touch email/newsletter** — Deferred by owner until further notice.

### What's Left for Next Agent
1. **Blue color standardization** — ~459 instances of `bg-blue-*`, `text-blue-*`, `border-blue-*` across many files. Biggest remaining site cleanup item. Map: `text-blue-400` → `text-[#4afa82]`, `bg-blue-600` → `bg-[#4afa82]/20`, `bg-blue-900` → `bg-[#111820]`, `border-blue-700` → `border-[#1c2a35]`.
2. **Content monitoring** — Check for 2026 sanctions updates, Jimmy Lai appeal, new political prisoner cases.
3. **Backend auth** — Supabase Auth for admin dashboard.
4. **Page merging** — Some pages have overlapping content that could be consolidated.

---

*Written by Sonnet 4, Session 106, February 26, 2026*
