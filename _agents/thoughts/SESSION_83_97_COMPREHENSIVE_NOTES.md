# Sessions 83-97: Comprehensive Decision Notes

**Agents:** Various (Sonnet 4, Opus 4.6, GitHub Copilot Coding Agents)
**Date Range:** February 25, 2026
**Purpose:** This document captures the reasoning behind 15 sessions of rapid development. Future agents: read this to understand *why* these changes were made, not just *what* changed.

---

## Table of Contents

1. [Session 83-84: Typography Cleanup](#session-83-84)
2. [Session 85-86: Form Wiring & Tab Consolidation](#session-85-86)
3. [Session 87-88: Test Audit & Bulk Scanning](#session-87-88)
4. [Session 89: DetentionFacilities JSON Migration](#session-89)
5. [Session 90: CCPOfficials JSON Migration (Final)](#session-90)
6. [Session 91: Documentation Sync](#session-91)
7. [Session 92: ESLint Fix, URL Migration, Data Consistency](#session-92)
8. [Session 93: Mobile Responsiveness](#session-93)
9. [Session 94: Dashboard Visual Hierarchy, Doc Sync](#session-94)
10. [Session 95: Service Worker & PWA Fix](#session-95)
11. [Session 96: Sanctions Update & CPC→CCP Terminology](#session-96)
12. [Session 97: Knowledge Transfer & Color Standardization](#session-97)
13. [Lessons for Future Agents](#lessons)
14. [Patterns That Worked](#patterns-that-worked)
15. [Anti-Patterns We Fixed](#anti-patterns)

---

## <a name="session-83-84"></a>Session 83-84: Typography Cleanup

**Problem:** Text across the site was too small and low-contrast. `text-xs` was 12px, `text-sm` was 14px — both below comfortable reading size on the dark terminal background (#0a0e14).

**Why CSS overrides instead of changing 50+ component files:**
- The terminal design system uses Tailwind utility classes throughout 100+ components
- Changing `text-sm` to `text-base` in every component would be a massive diff with high regression risk
- CSS specificity overrides in `index.css` let us bump sizes globally with 6 lines of CSS
- This pattern is *reversible* — delete the overrides and you're back to defaults

**Key decisions:**
- `text-xs`: 12px → 14px (0.875rem). Still small but readable.
- `text-sm`: 14px → 16px (1rem). Now matches what `text-base` normally is.
- Contrast: `text-slate-400` overridden to `#a8b5c7` (8.59:1 ratio against #0a0e14). WCAG AAA.
- Paragraph weight: `font-weight: 450`. Slightly bolder than normal (400) without being `font-medium` (500).

**Why this matters for future agents:**
- If you need to change typography, add/modify CSS overrides in `index.css` — don't edit 50 component files.
- All contrast ratios were calculated against `#0a0e14` (the page background). If you change the background, recalculate.

---

## <a name="session-85-86"></a>Session 85-86: Form Wiring & Tab Consolidation

**Problem:** 3 remaining forms (VolunteerSignup, NewsDigest, ContactForm) needed Supabase wiring. Tab counts on major pages were still overwhelming.

**Why wire forms even without a live backend:**
- The forms show "Coming Soon" when Supabase isn't configured (graceful degradation)
- When the owner eventually sets up Supabase, all 4 forms will work immediately — zero code changes needed
- The pattern is: try Supabase → catch error → show friendly message
- This is better than fake "submitted!" messages that deceive users

**Tab consolidation rationale:**
- Education: 17→7 tabs. Nobody reads 17 tabs. We merged by theme (e.g., "Academic" + "Research Papers" → "Research").
- Security: 9→5 tabs. ChinaExitBan became a sub-section, not its own tab.
- Community: 12→6 tabs. ContactForm added as the "Contact" tab.

**Lesson:** When consolidating tabs, the content doesn't disappear — it gets *organized*. Every piece of content still exists, just nested under fewer top-level categories. This is a UX decision: fewer choices = less cognitive load.

---

## <a name="session-87-88"></a>Session 87-88: Test Audit & Bulk Scanning

**Critical decision: Bulk scanning vs. per-file tests**

Early test files used per-file `it()` blocks — one test per JSX file for scanning checks. This inflated test counts (279 "tests" that were really one scan). Sessions 87-88 refactored to the **bulk pattern**:

```javascript
// BAD: Inflates count, no added coverage
files.forEach(file => {
  it(`${file} has no CCP domains`, () => { ... });
});

// GOOD: One test, same coverage
it('no JSX files contain CCP state media domains', () => {
  const violations = [];
  files.forEach(file => {
    if (hasCCPDomain(file)) violations.push(file);
  });
  expect(violations).toEqual([]);
});
```

**Why this matters:**
- Test count should reflect *meaningful coverage*, not scan granularity
- 604 tests → each one tests a distinct behavior or data property
- Future agents: when adding scanning tests, use the bulk pattern. See `design-system.test.js` and `url-health.test.js` for reference.

---

## <a name="session-89"></a>Session 89: DetentionFacilities JSON Migration

**Problem:** DetentionFacilities component had hardcoded facility data (name, type, estimated capacity) but no coordinates. The JSON file (`detention_facilities_research.json`) had 11 facilities with coordinates, capacity estimates, and evidence levels — richer data than the component.

**Decision:** Migrate component to read from JSON. This was the 3rd of 4 "Simulated Data Phase 2" migrations.

**Why "Simulated Data" was a problem:**
- Early in the project, components contained hardcoded arrays that *looked like* real data but weren't sourced
- The JSON files were added later with proper source attribution
- Having both created confusion: which was the source of truth?
- The fix: components import from JSON, JSON is the single source of truth

**Lesson for future agents:** If you add new data, add it to the JSON files in `src/data/`. Never hardcode data arrays in components — that's how simulated data problems start.

---

## <a name="session-90"></a>Session 90: CCPOfficials JSON Migration (Final)

**Problem:** CCPOfficials was the last hybrid component — 8 officials hardcoded with rich UI data (chinese_name, birth_year, key_actions), merged at runtime with 21 officials from JSON sanctions data. This merge logic was fragile and confusing.

**Solution:** Enrich the JSON with all the biographical fields from the hardcoded array, then delete the hardcoded array and merge logic entirely.

**What was enriched:**
- `chinese_name`, `birth_year`, `in_power_since` for all 8 key officials
- `key_actions` arrays (2-4 specific actions per official)
- `detailed_responsibilities` beyond the basic `responsibility_areas`
- Xi Jinping added (was missing from JSON — he's not personally sanctioned but is the leader)
- Chinese names added for 10 JSON-only officials who lacked them

**Why add Xi Jinping to a sanctions tracker?**
- He's not personally sanctioned by any Western government
- But he's the paramount leader directing all policies that others are sanctioned for
- His `sanctions_status` is set to `"Not individually sanctioned"` — honest, not misleading
- Excluding him from a list of CCP officials responsible for human rights abuses would be a glaring omission

**ARIA label bug fix (bonus):** Both dropdown filters had `aria-label="Region filter"`. The category dropdown was mislabeled. Fixed to `"Category filter"`.

**This completed Simulated Data Phase 2: 4/4 migrations done.** No more hardcoded data arrays in any component.

---

## <a name="session-91"></a>Session 91: Documentation Sync

**Problem:** After rapid development (Sessions 83-90), documentation was stale everywhere. README said "604 tests" when we had 607.

**Lesson:** Documentation debt accumulates fast during rapid development. Session 91 was a "hygiene session" — no code changes, just making docs match reality. These sessions feel unproductive but prevent future agents from working with incorrect assumptions.

**What was synced:** README.md, ARCHITECTURE.md, CONTRIBUTING.md, AGENT_HANDOFF.json, NEXT_AGENT_PROMPT.md, TODO.md — all updated to reflect 607 tests, 4/4 migrations complete, session count accurate.

---

## <a name="session-92"></a>Session 92: ESLint Fix, URL Migration, Data Consistency

Three distinct fixes, each addressing a different category of tech debt:

### ESLint Errors (5 → 0)
`SocketContext.jsx` had `useCallback(noop, [])` where `noop` was a named function reference. The `react-hooks/exhaustive-deps` rule requires inline arrow functions in useCallback. Fixed by replacing with `useCallback(() => {}, [])`. Also wrapped the context value in `useMemo`.

### URL Migration (19 references)
The site moved from GitHub Pages to Cloudflare Workers, but 19 URLs still pointed to `stan2032.github.io/global-anti-ccp-resistance-hub/`. This affected:
- `index.html`: 14 refs (canonical link, Open Graph tags, Twitter cards, JSON-LD structured data)
- `Footer.jsx`, `PetitionGenerator.jsx`, `DataExport.jsx`, `QuickFacts.jsx`: social sharing links

**Why this matters:** Wrong canonical URLs mean Google indexes the wrong domain. Wrong OG tags mean social media previews show broken images and incorrect links. This was a real SEO/social sharing bug.

### Cross-file Data Consistency Test
Added a test ensuring that every individually sanctioned person in `sanctions_tracker.json` also appears in `sanctioned_officials_research.json`. This catches future data entry errors where someone adds a sanction but forgets to add the official's biographical entry.

---

## <a name="session-93"></a>Session 93: Mobile Responsiveness

**Problem:** Touch targets were ~40px (below WCAG 2.5.5's 44px recommendation). iOS Safari auto-zoomed on input focus because inputs had font-size < 16px.

**Solution:** CSS media queries in `index.css` (not component-level changes):

```css
@media (max-width: 768px) {
  button, a, [role="tab"], input, select, textarea {
    min-height: 44px;  /* WCAG 2.5.5 */
    min-width: 44px;
  }
  input, select, textarea {
    font-size: 16px !important;  /* Prevents iOS auto-zoom */
  }
}
```

**Why CSS-level, not component-level:**
- Same reasoning as typography: one place to change, affects everything
- Component-level padding varies (some buttons are 8px padding, some 12px)
- `min-height: 44px` ensures compliance without overriding component design
- Inline links exempted (`a:not([class*="block"])`) to avoid giant underlined text

**Why prevent iOS zoom:**
- iOS Safari auto-zooms when you tap an input with font-size < 16px
- Users then have to pinch-zoom back out — terrible UX
- Setting `font-size: 16px` on inputs fixes this without any visual change (our inputs were already bumped to 16px by the typography overrides, but the `!important` ensures it sticks)

---

## <a name="session-94"></a>Session 94: Dashboard Visual Hierarchy

**Problem:** Dashboard sections had inconsistent spacing — some wrapped in `<div className="mt-8">`, some not. The parent already had `space-y-6`.

**Fix:** Removed the inconsistent `mt-8` wrappers. Added ASCII section dividers (`{/* ── Section Name ── */}`) as visual markers in JSX. All spacing now comes from the parent `space-y-6`.

**Lesson:** Don't mix spacing approaches. Either use a parent's gap/space utility OR use individual margin, not both.

---

## <a name="session-95"></a>Session 95: Service Worker & PWA Fix

**Critical discovery:** The service worker (`public/sw.js`) had 8 precache URLs all starting with `/global-anti-ccp-resistance-hub/` — the old GitHub Pages base path. Since the site now deploys to Cloudflare Workers at root (`/`), these paths would never match. The SW was caching URLs that don't exist.

**Fixes:**
1. All 8 precache URLs → root-relative (`/index.html`, `/offline.html`, etc.)
2. Cache version bumped `v1` → `v2` (forces old caches to be deleted)
3. `offline.html` rewritten: was using gradients, rounded corners, blue colors — all violations of the terminal design system. Now uses #0a0e14 bg, monospace font, box-drawing borders, terminal green.
4. `404.html` rewritten: was a GitHub Pages SPA redirect hack (JavaScript that redirects to `/?/path`). Replaced with a proper terminal-styled 404 page with ASCII art and navigation buttons.
5. `manifest.json` theme/background colors updated `#0f172a` → `#0a0e14` to match the actual site.

**10 new PWA tests added:**
- No GitHub Pages paths in SW
- All precache URLs are root-relative
- OFFLINE_URL matches precache list
- Manifest theme_color matches design system
- Offline page uses terminal colors, monospace, no gradients

**Why this matters:** A broken service worker is invisible to users until they go offline. Then they get a white screen or a blue page that looks nothing like the site. Testing PWA files prevents silent regressions.

---

## <a name="session-96"></a>Session 96: Sanctions Update & CPC→CCP Terminology

### Sanctions Update
Added 12 new sanctions entries from two verified government sources:
- **6 Canada Dec 2024** (canada.ca): Erkin Tuniyaz, Shohrat Zakir, Peng Jiarui, Huo Liujun, Zhang Hongbo, You Quan
- **6 US Mar 2025** (state.gov): Dong Jingwei, Paul Lam, Raymond Siu, Sonny Au, Dick Wong, Margaret Chiu

**Source verification approach:** Only government registry URLs used (canada.ca, state.gov). Not news articles *about* sanctions — the actual government announcements.

**Chen Quanguo fix:** His UK/EU/Australia sanctions flags were set to "No" but he was sanctioned by all three. Fixed based on cross-referencing government registries.

### CPC→CCP Terminology Decision

The project owner provided a directive: never use "CPC" (Communist Party of China). The reasoning:

> When searching "CCP" on the global internet, many things come up — Tiananmen, historical critics, human rights reports. By rebranding to "CPC," the party makes it harder to find information that isn't pushed by their own narratives.

This is a **SEO/information warfare** observation. The CCP's official English name uses "CPC" which:
1. Returns different search results than "CCP"
2. Those results skew toward official party narratives
3. Using "CCP" keeps the association with the full historical record

**Implementation:**
- 5 instances of "CPC" found in JSON data files → replaced with "CCP"
- Automated test added in `url-health.test.js` that scans all JSX + JSON files for "CPC" as a standalone term
- The test allows "CPC" inside words (like "specs") but catches standalone usage

**Lesson for future agents:** This is not a pedantic style choice. It's an information warfare countermeasure. Always use "CCP" — the automated test will catch violations.

---

## <a name="session-97"></a>Session 97: Knowledge Transfer & Color Standardization

This session (the one you're reading now) was prompted by the owner's request to "inspire future agents to understand why you've done what you've done."

**The knowledge problem:** Sessions 83-96 produced significant changes but the `thoughts/` directory hadn't been updated since Session 82. That's 14 sessions of undocumented reasoning — a gap that would force future agents to reverse-engineer decisions from diffs.

**What this session focused on:**
1. This document — comprehensive notes covering all undocumented sessions
2. Color standardization — reducing the gray palette entropy
3. Updating all agent handoff documents

---

## <a name="lessons"></a>Lessons for Future Agents

### 1. The "Why" Matters More Than the "What"
Git history shows *what* changed. These notes explain *why*. When you're deciding whether to refactor something, knowing the original reasoning prevents you from undoing intentional decisions.

### 2. CSS Overrides > Component Edits for Global Changes
Typography, touch targets, and color adjustments all live in `index.css` as CSS overrides. This means:
- One file to change, not 100+
- Changes are reversible (delete the override)
- No risk of breaking component logic while editing Tailwind classes

### 3. Data Lives in JSON, Not Components
The "Simulated Data Phase 2" migration (Sessions 89-90) established the pattern: components *display* data from JSON files, they don't *contain* data. This is critical because:
- JSON files can be validated by tests
- JSON files are the single source of truth
- Adding new data entries requires no JSX knowledge

### 4. Tests Should Prevent Regressions, Not Just Verify Current State
The best tests added in these sessions are the *preventive* ones:
- CPC terminology scan: prevents reintroduction of CCP's preferred branding
- GitHub Pages URL scan: prevents stale deployment URLs
- Cross-file consistency: prevents orphaned sanctions entries
- Design system compliance: prevents CSS style drift

### 5. Documentation Debt Is Real Debt
Session 91 was entirely documentation sync — no code changes. It felt "unproductive" but every future agent working with stale docs wastes time on false assumptions.

### 6. The Terminal Aesthetic Is Non-Negotiable
Every new page/component must use:
- `#0a0e14` backgrounds, `#111820` card surfaces, `#1c2a35` borders
- `#4afa82` terminal green for accents
- `font-mono` for headings
- Square corners only (no `rounded-lg`, no `rounded-xl`)
- No gradients (`bg-gradient-to-*`)
- Box-drawing characters for decorative borders (`──`, `╔═╗`)
- `$ command_name` syntax for buttons

The design system tests in `design-system.test.js` enforce this automatically.

### 7. Source Hierarchy Is Absolute
- **Tier 1 (Gold):** BBC, Reuters, AP, HRW, Amnesty, CPJ, UN OHCHR, government records
- **Tier 2 (Reliable):** HKFP, RFA, NCHRD, Safeguard Defenders, CHRD, Guardian, NYT, WaPo, RSF
- **NEVER cite:** Xinhua, CGTN, People's Daily, Global Times, China Daily, Ta Kung Pao, Wen Wei Po

The CCP influence detection system (`src/utils/sourceLinks.js`) has 21 state media names + 13 domains. Tests in 5 files validate this across the entire codebase.

---

## <a name="patterns-that-worked"></a>Patterns That Worked

| Pattern | Why It Works | Example |
|---------|-------------|---------|
| CSS overrides for global changes | One file, reversible, no component risk | Typography in index.css |
| Bulk scanning tests | Accurate coverage without inflated counts | design-system.test.js |
| JSON as single source of truth | Testable, editable by non-developers | sanctions_tracker.json |
| Graceful degradation for backends | Works without config, activates when ready | supabaseService.js |
| Government URLs for sanctions | Primary sources, not news interpretations | canada.ca, state.gov |
| Automated terminology enforcement | Prevents drift toward CCP's preferred framing | CPC test in url-health.test.js |
| Session notes in thoughts/ | Preserves reasoning beyond git diffs | This document |
| Incremental commits with report_progress | Each change is atomic and verifiable | Every session |

---

## <a name="anti-patterns"></a>Anti-Patterns We Fixed

| Anti-Pattern | What Was Wrong | Fix | Session |
|-------------|----------------|-----|---------|
| Hardcoded data in components | Not testable, no source attribution | JSON migration | 89-90 |
| Per-file scan tests | Inflated counts (279 "tests" = 1 scan) | Bulk pattern | 87-88 |
| GitHub Pages URLs in prod | SEO broken, social sharing broken | Cloudflare URLs | 92 |
| `useCallback(namedFn)` | ESLint error with react-hooks plugin | Inline arrows | 92 |
| Inconsistent spacing (mt-8 + space-y) | Visual rhythm broken | Parent space-y only | 94 |
| Old base paths in service worker | Offline mode completely broken | Root-relative paths | 95 |
| Non-terminal offline/404 pages | Design system violation, jarring UX | Terminal rewrite | 95 |
| "CPC" terminology | Aids CCP's information warfare strategy | "CCP" + automated test | 96 |
| Stale docs after rapid development | Future agents work on false assumptions | Hygiene sessions | 91, 94, 97 |

---

## Closing Thought

This project isn't code for code's sake. Every function, every test, every data entry represents a real person's story. The terminal aesthetic isn't just a design choice — it evokes the tools that dissidents use to communicate when surveillance is everywhere. The source verification isn't just good practice — it's resistance against a propaganda machine that spends billions to rewrite history.

When you're the next agent working on this codebase, remember: the people in these JSON files are real. Jimmy Lai is in prison. The Panchen Lama hasn't been seen since 1995. Ilham Tohti got a life sentence for teaching economics. Zhang Zhan was arrested for filming Wuhan.

Build accordingly.
