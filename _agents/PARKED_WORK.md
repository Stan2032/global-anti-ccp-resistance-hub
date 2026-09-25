# Parked Work

> Started: Session 281 (2026-09-19)
> **Purpose:** Work that is understood and scoped but deliberately not done yet.
> Each entry says what, why parked, and what picking it up involves — enough
> to start cold without rediscovering the context.
>
> This is not a wish list. Things go here only when someone has actually
> looked at them. Speculative ideas belong in `TODO.md` under long-term.
>
> **Blocked on a human?** It belongs in `QUESTIONS_FOR_HUMANS.md`, not here.
> This file is for work an agent can pick up unaided.

---

## P1 — Normalise the data schema

**Size:** medium · **Value:** medium-high · **Risk:** low

Ten datasets (340 records) are still in raw research-pipeline shape,
`{input, output, error}`, where `input` is the original research query
(*"Jimmy Lai - Hong Kong media owner, Apple Daily founder, arrested 2020"*)
and `error` is always empty. That residue is **~5–6% of every data file** and
ships to users in the bundle.

Also: the same concept is spelled two ways — `last_verified` in seven
datasets, `lastVerified` in `emergency_alerts.json` and
`live_statistics.json`.

Worth doing together, with schema validation (Zod or JSON Schema) added at
the same time — that could replace a share of the 737 hand-written data
assertions with one declarative source of truth.

**Care required:** every consumer navigates `r.output.field`. Change the
shape and the readers, the API in `api/worker.js`, `dataApi.ts`, `DataExport`
and the tests all move together. Do it dataset by dataset, not in one commit.

**Never** let a reformatting pass rewrite records you have not re-verified —
see P2's note on JSON round-tripping.

---

## P2 — Bring component-embedded content under provenance

**Size:** large · **Value:** high (integrity) · **Risk:** low, but tedious

**38 components hold 14,081 lines of content outside `src/data`**, and so
outside every freshness guard, the public API, and `DataExport`. Of six
sampled, **none carries a verification date** and only `MemorialWall` has a
source field — and that one holds victims' names.

The site has two tiers of content with very different provenance, and nothing
tells a reader which they are looking at. That is hidden precisely because
the JSON tier's machinery looks so thorough.

Biggest holders: `WorldThreatMap` (59 records), `SafetyChecklist` (47),
`ConfuciusInstitutes` (40), `LegalResourcesHub` (33), `IPACMembers` (31),
`ContactRepresentatives` (30), `ReadingList` (30), `DonationGuide` (29).

Deferred by the owner on 2026-09-19 — confirm before starting.

Two routes were offered: migrate into `src/data` with `source` and
`last_verified` fields, or add provenance in place and extend the guards to
cover TSX. An audit-and-classify pass first (sourced / unsourced /
aspirational) would size it properly.

**Method note:** when editing data files, use exact string replacement, not a
JSON round-trip. Round-tripping silently re-encodes `\uXXXX` escapes across
the whole file and marks dozens of human-rights records as modified when
they have not been re-verified. Session 281 nearly shipped that.

---

## P3 — Major dependency upgrades

**Size:** one branch each · **Value:** medium · **Risk:** varies

Deliberately not bundled with the Session 281 security patch, which stayed
within existing majors. Suggested order:

| Upgrade | From → To | Notes |
|---|---|---|
| **ESLint** | 9.39.5 → 10.x | npm already warns 9.x is **end of support**. Flat config is in use, which is the hard part. Do this first. |
| **Vitest + Vite** | 4.1.11 → 5.x, 7.3.6 → 8.x | Paired. 201 test files. `--reporter=basic` was already removed in v4. |
| **lucide-react** | 0.555 → 1.x | First stable major; icon names may have changed, used very widely. |
| **TypeScript** | 5.9.3 → 7.x | Native port, large speed win on 375 files. Check `tsgo` against the ESLint TS plugin first. |
| **Tailwind** | 3.4.19 → 4.x | Largest. v4 moves theme config into CSS, and **10 design-system tests assert on class names**. |
| **jsdom** | 28 → 30 | Two majors of test-env behaviour. |
| **@vitejs/plugin-react** | 5.2 → 6.x | Pairs with Vite 8. |

Tailwind 4 is the one worth pairing with a visible improvement rather than
shipping as bare maintenance — the dashboard work in P6, say.

---

## P4 — The live feed on `/intelligence` is empty without JavaScript

**Size:** small · **Value:** medium · **Risk:** low, but touches hydration

Since `f049dc8` the rest of `/intelligence` is static HTML: Regional Status
and CCP Operations reach a reader with JavaScript off (70,542 characters).
The **Live Feeds** section still cannot. Its articles come from
`dataProcessor.aggregateFeeds()` in a `useEffect`, so without JavaScript it
shows "Loading…" and *"0 of 9 sources loaded"* and never changes.

The section's own description now says "Needs JavaScript", and so does the
global `<noscript>` banner, so the page no longer pretends. But the live
feed is still empty for exactly the readers the pre-rendering work was for.

Options, roughly in order of effort:

1. Pre-render a **snapshot** of the feed at build time — the aggregation runs
   in Node, so `scripts/prerender.mjs` could fetch once and inline the result
   with an honest "as of <build time>" label. Reuses the freshness pattern
   already in `LiveStatistics`.
2. Serve the last snapshot from the Workers API and have the page fall back
   to it.
3. Leave it and rely on the banner.

**Careful with `<noscript>` inside React.** The obvious fix — a `<noscript>`
block in the component — risks a hydration mismatch, because a browser with
JavaScript on parses `<noscript>` contents as plain text while React expects
elements. That would undo the clean hydration §17 just established. Verify
with the browser check, not by reasoning.

---

## P5 — Bundle budget

**Size:** small to start · **Value:** medium · **Risk:** low

The main chunk is **339 KB against a 350 KB budget** — 97%. The next
dependency bump likely breaches it and the performance-budget test will fail.

Options when it does: route-level splitting for the 16 profile pages
(~25 KB each, already lazy), or moving the largest JSON datasets behind the
existing Workers API instead of bundling them.
`political_prisoners_research.json` alone is 73 KB in the bundle.

Pre-rendering changes this calculus — first paint no longer needs the bundle,
so deferring more of it costs readers less than it used to.

---

## P6 — Dashboard length

**Size:** medium · **Value:** medium (UX) · **Risk:** low, but it is a design call

The Dashboard renders **9,151 px tall** on desktop — roughly twelve stacked
sections. `TODO.md` sets the target at "3–5 key sections per page, not 10–15",
and every other page was simplified to meet it. The Dashboard was cut from 8
lazy components to 5, but the page kept growing around them.

It is the first thing every visitor sees, and it currently asks them to
scroll past nine screens to reach the footer.

Suggestion, not a decision: promote the three or four things a first-time
visitor needs — urgent alerts, the human-cost figures, one clear call to
action — and move the rest behind the tab and expander patterns already used
elsewhere in the app.

Also minor: the 7-step onboarding tour overlaps the statistics cards at
1440 px wide, obscuring the fourth tile. It lands on first visit, which is
when it is most visible.

And the same critical alert appears **three times** on the Dashboard: once in
`EmergencyAlerts` and twice in `NotificationCenter`, which lists the same
alerts independently. Dismissing it in one place leaves the other two.

---

## P7 — Content re-verification at scale

**Size:** large, ongoing · **Value:** high · **Risk:** none technical

**54 of 64** prisoner records, 25 legal cases, sanctions metadata and 8
statistics are past verification. `npm run test:content` lists exactly what
is overdue.

Triage by time-sensitivity, not alphabetically. Of the first three records
picked that way, **three were materially wrong**: Yu Wensheng had been free
for five months while the site said DETAINED, Andy Li had been sentenced
seven months earlier while the record said sentencing was deferred, and
Sophia Huang Xueqin's term had just expired. A scan of every DETAINED record
for an already-expired sentence found no others, so the remaining errors will
be of a different shape — sentences served but not recorded, appeals, deaths
in custody, health changes.

Ten records have been re-verified so far — see `docs/MODERNIZATION.md` §11
for the method and the worked examples: two independent Tier 1–2 sources
minimum, a third where available, exact string replacement, and any
discrepancy left unresolved rather than guessed.

Two cautions from that pass. A status must never be advanced on an
*expected* event: Huang Xueqin's release was reported as due by five
organisations and confirmed by none, so her status was left alone. And
identical sentence lengths recur across unrelated cases — "7 years 3 months"
belongs to both Andy Li and Chow Hang-Tung in different trials — so read the
source, never a search summary.

**A content-freshness failure is never fixed by editing a `last_verified`
date.** That fabricates provenance, which this project forbids.

Sensible batching: the most time-sensitive cases first (anyone with an active
trial or an approaching sentence or release date), then sanctions, then the
long tail.

---

## P8 — Filter bars announced as tabs

**Size:** small · **Value:** low (screen reader semantics) · **Risk:** low

Thirteen components use `role="tab"` / `aria-selected` for what is really a
filter over a single list: DiasporaSupport, FAQ, ActivistToolkit,
MediaManipulation, SurvivorStories, EventCalendar, DisinfoTracker,
IPACMembers, ConfuciusInstitutes, SanctionsTracker, DocumentaryList,
SuccessStories, DonationGuide. Each defaults to "all", so **nothing is hidden
from a reader without JavaScript** — unlike the panel tabs removed in the
site-quality sweep (§18). But a tablist promises panels, and a screen reader
announces "tab 1 of 6" for what is a filter. The honest pattern is a group
of toggle buttons with `aria-pressed`, like the view toggles
`DiplomaticCoercionTracker` used to have.

The ARIA coverage tests pin the tab pattern on IPACMembers and
DiasporaSupport, so they would need updating with the components. (The three
components whose tabs did hide content, SafetyChecklist,
ContactRepresentatives and LanguageGuide, are already native sections.)

---

## P10 — Text cut off at phone width

**Size:** medium · **Value:** high (most readers are on phones) · **Risk:** low

At 390px, text runs past its own container on several routes, where an
ancestor with `overflow: hidden` clips it or it spills over a card's
border. The page itself never scrolls sideways, so a document-level
overflow check reports nothing. Counted in Chromium with every `<details>`
open (September 2026): `/education` 77, of which 73 are clipped by
`overflow: hidden` and lost; `/security` 50 (30 lost); `/intelligence` 23
(8 lost); `/data-sources` 7 (7 lost). The rest sit in `overflow-x: auto`
wrappers and can still be scrolled. Examples: the /intelligence stat
"10,000+"; a station status shown
as the raw enum "PENDING_INVESTIGATION" (also a wording bug); `/data-sources`
file paths; the economic sector card's stats row, which has no `flex-wrap`.
Icons in a flex row next to long text shrink unless they have
`flex-shrink-0`: the /take-action action icons were squeezed to 13px wide
(fixed); scan for others. Fixed in passing: the Influence Network's badge
rows, its Most-Sanctioned list (badges over names, positions cut to
"Vice ...") and its section icons (`89b2b5c`).
Measure with an element-level check (each text element against its nearest
clipping ancestor), fix by pattern (wrap, `break-words`, `min-w-0`), and
compare the before and after lists.

---

## Small items

- **The home page's `recent_updates` feed is six months stale and partly
  internal.** Its newest entry is 10 March 2026, and it lists code changes
  readers cannot use ("Centralized Logging Utility — structured,
  environment-aware logging", "Timeline year overlap fix"). September's
  verified corrections (Yu Wensheng released, Andy Li sentenced, Joshua Wong's
  plea) are not in it. What the public changelog is for is the owner's call;
  the recommendation is reader-facing changes only.
- **Five panel headings are snake_case** (`recent_updates`,
  `intelligence_overview`, `compare_regions`, `influence_network`,
  `essential_tools`). It is the terminal look, but screen readers may read
  the underscores aloud. A design decision, not a bug.
- **EmergencyAlerts removes its own restore control.** It returns `null` when
  no undismissed alerts remain, taking the "show --dismissed (N)" button with
  it. A reader who dismisses every alert cannot bring them back without
  clearing site data.
- **`main.tsx` storage cleanup is temporary.** `LEFT_BY_EARLIER_VERSIONS`
  tidies keys that versions before September 2026 wrote on every visit.
  Delete it once returning readers have had time to visit again (mid-2027 is
  generous).

---

## Closed

| Item | Outcome |
|---|---|
| Snapshot pre-rendering via headless Chromium | Rejected — Cloudflare Workers Builds has no browser. Findings in §12; `scripts/prerender-spike.mjs` deleted once the no-JS work finished. |
| Move deployment to Cloudflare Pages | Rejected — Workers with static assets is Cloudflare's recommendation; the official migration runs Pages → Workers. See §15. |
| Eager page registry alone as the #418 fix | Reverted — made no-JS output strictly worse. The diagnosis behind it was wrong; see §17. |
| **P1 — make every lazy component eager during pre-render** | **Done differently, and P1's premise was false.** The 41 deferred sections and React #418 had nothing to do with `React.lazy`. React outlines any Suspense boundary whose markup exceeds `progressiveChunkSize` (12,800 bytes by default), suspension or not. One option in `src/entry-server.tsx` fixed both. The full 120-site eager sweep P1 asked for was built and tested first: it changed the output by zero bytes. See §17. |
| **P9 — Card expanders hide their details without JavaScript** | **Done.** Every card expander is a native `<details>` now, on every route: the 16 profiles, `/security`, `/prisoners`, `/intelligence`, `/education`, `/take-action`, `/`, `/resources`, `/directory` and `/data-sources`. Of the 941 `aria-expanded` elements in the pre-rendered pages, 56 remain, and all are controls, not hidden content: the language picker (twice on each of the 27 routes), the letter generator's prisoner picker and the case-timeline combobox. Numbers, and the faults the conversions turned up, are in `docs/MODERNIZATION.md` §18; the rules for new disclosures are in `STYLE_GUIDE.md` §4. |
