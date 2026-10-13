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
within existing majors. Five of the seven are done (October 2026); what each
one found is in `docs/MODERNIZATION.md` §18.

| Upgrade | From → To | Status |
|---|---|---|
| **ESLint** | 9.39.5 → 10.12 | **Done** (`d25b0bc`), with @eslint/js 10, react-refresh 0.5 and globals 17. |
| **Vitest + Vite** | 4.1.11 → 5.0, 7.3.6 → 8.3 | **Done** (`c0cafdc`). Vite 8 (Rolldown) rejects object-form `manualChunks`; the function form also fixed a chunk split that had been silently empty (see P5). Vitest 5 dropped the jest-dom matcher types, restored in `src/test/jest-dom-matchers.d.ts`. |
| **jsdom** | 28 → 30 | **Done** (`c0cafdc`). |
| **@vitejs/plugin-react** | 5.2 → 6.1 | **Done** (`c0cafdc`). |
| **lucide-react** | 0.555 → 1.56 | **Done** (`51c11f9`). Brand icons are gone in 1.x: `Twitter` became `AtSign`. |
| **TypeScript** | 5.9.3 → 7.x | **Blocked.** typescript-eslint supports TypeScript `>=4.8.4 <6.1.0` (checked 2026-10-13, TypeScript 7.0.2 is `latest`). Wait for typescript-eslint to widen its range, then check `tsgo` against it. |
| **Tailwind** | 3.4.19 → 4.x | **Waiting on Q22.** Largest. v4 moves theme config into CSS, and **10 design-system tests assert on class names**. v4 also needs Safari 16.4, Chrome 111 or Firefox 128 and newer: decide which browsers readers in China need first. It is the only fix for the `braces` advisory that turns CI's audit red. |

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

Looked at again in October 2026 and left. Option 1 is less small than it
reads: the client must hydrate with the same feed data the build inlined, so
the snapshot has to be serialised into the page and read back before the
first render, and the build has to fetch nine external feeds, which makes it
depend on the network. Option 3 is the current state.

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

The two smaller Dashboard faults that used to be listed here are fixed
(`3421899`). The same alert no longer appears three times:
`NotificationCenter` points to the alerts at the top of the page instead of
listing them again. The quick-start tour no longer opens over the statistics:
it opens by itself only at 1024 px and wider, and a launcher brings it back.
The length is what remains, and it is the owner's design call.

---

## P7 — Content re-verification at scale

**Size:** large, ongoing · **Value:** high · **Risk:** none technical

**49 of 64** prisoner records, 24 of 25 legal cases, sanctions metadata and
8 statistics are past verification (2026-10-13). `npm run test:content` lists
exactly what is overdue.

Triage by time-sensitivity, not alphabetically. Of the first three records
picked that way, **three were materially wrong**: Yu Wensheng had been free
for five months while the site said DETAINED, Andy Li had been sentenced
seven months earlier while the record said sentencing was deferred, and
Sophia Huang Xueqin's term had just expired. A scan of every DETAINED record
for an already-expired sentence found no others, so the remaining errors will
be of a different shape — sentences served but not recorded, appeals, deaths
in custody, health changes.

Fifteen records have been re-verified so far — see `docs/MODERNIZATION.md`
§11 for the method and the worked examples: two independent Tier 1–2 sources
minimum, a third where available, exact string replacement, and any
discrepancy left unresolved rather than guessed. The third pass (Hong Kong
appeals, 2026-10-13) found Cardinal Zen's appeal decided five weeks earlier
while the site said "case ongoing", and the Hong Kong 47 appellants' records
eight months behind.

**Waiting on a source** (check these first next time):
- **Gwyneth Ho, Leung Kwok-hung:** the 10 August 2026 Court of Appeal
  certificates for a Court of Final Appeal bid. HKFP reports them; a second
  Tier 1–2 source, or the judgment itself, is still needed.
- **Sophia Huang Xueqin:** release unconfirmed since her term ended on
  18 September 2026.
- **Kwok Yin-sang:** his 8-month term ends by late October 2026 at the latest.
  Release unconfirmed.
- **Joshua Wong:** sentencing for foreign collusion pending, no date set.
- **Cardinal Zen:** the trustees' bid at the Court of Final Appeal.
- **Tam Tak-chi:** a release projected for March 2027 by a non-Tier tracker.
- **Tashi Wangchuk (status in doubt):** the sources conflict on whether he is
  free.
  - RFA (2024-11-13) reports a 15-day detention, 20 October to 4 November
    2024, then release under surveillance.
  - Tibet Times reports he was arrested again at home on 10 November 2024 and
    not heard from since; Phayul reported a "state security" arrest.
  - Nothing found after November 2024.

  The record still says RELEASED, and so does his profile page. Settle this
  before anything else in this list.

Other notes from the third pass:
- **Hada:** no 2026 report from any source.
- **The 612 Fund case, WKCC 986/2022:** the case number could not be
  confirmed.

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

## Small items

- **`/prisoners` lists the same prisoners twice.** The card grid (every case,
  15 open and the rest folded) and the status dashboard below it both list
  the 64 records. Which to keep, or how to divide them, is an editorial call
  for the owner.
- **The threat map's region totals and its country lists disagree.** Europe
  states 54 stations, but its countries add up to 52; Asia Pacific states 28
  against 26. Checking which is right is content work (P7).
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
- **Ren Zhiqiang's charges list leaves out abuse of power.** His verified
  record gives the sentence as "18 years for corruption, bribery,
  embezzlement of public funds, and abuse of power", and his page's header
  now says so (`363f695`). The page's Charges section still lists three
  charges, one of them "Embezzlement and misuse of public funds", and no
  abuse of power. Writing that charge's card needs its detail sourced:
  content work (P7).
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
| **P5 — Bundle budget** | **Closed by the Vite 8 upgrade** (`c0cafdc`). The main chunk had been 339–341 KB against a 350 KB budget because the object-form `manualChunks` had never split React out: under Vite 7 the `vendor-react` chunk was empty and React sat in the main chunk. With the function form Vite 8 requires, React and the router get their own cacheable chunks: the main chunk is now **147 KB** and `vendor-react` 219 KB. First-load JavaScript is about the same gzipped (127.5 KB, from 125.7 KB), so this restored headroom under the budget; it did not make the site lighter. |
| Eager page registry alone as the #418 fix | Reverted — made no-JS output strictly worse. The diagnosis behind it was wrong; see §17. |
| **P1 — make every lazy component eager during pre-render** | **Done differently, and P1's premise was false.** The 41 deferred sections and React #418 had nothing to do with `React.lazy`. React outlines any Suspense boundary whose markup exceeds `progressiveChunkSize` (12,800 bytes by default), suspension or not. One option in `src/entry-server.tsx` fixed both. The full 120-site eager sweep P1 asked for was built and tested first: it changed the output by zero bytes. See §17. |
| **P9 — Card expanders hide their details without JavaScript** | **Done.** Every card expander is a native `<details>` now, on every route: the 16 profiles, `/security`, `/prisoners`, `/intelligence`, `/education`, `/take-action`, `/`, `/resources`, `/directory` and `/data-sources`. Of the 941 `aria-expanded` elements in the pre-rendered pages, 56 remain, and all are controls, not hidden content: the language picker (twice on each of the 27 routes), the letter generator's prisoner picker and the case-timeline combobox. Five more that used no `aria-expanded` turned up later, in a scan for click handlers on non-controls: the prisoner grid, the memorial wall's modal, the academic experts' cards, the threat map and the quick facts (`d136284`). Eight more, behind real `<button>`s with no `aria-expanded`, turned up in a third scan, for state that a click sets and that gates markup: the timeline's events, the home page's alerts, company responses, ethical alternatives, and the officials and facilities databases (`d7c399c`, `2b63161`). `DisclosureSection.test.tsx` now fails on both shapes. The alerts fix also closed a small item: dismissing every alert no longer removes the button that brings them back. Numbers, and the faults the conversions turned up, are in `docs/MODERNIZATION.md` §18; the rules for new disclosures are in `STYLE_GUIDE.md` §4. |
| **P10 — Text cut off at phone width** | **Done.** At 390px, 171 text elements on five routes ran past a box that clipped them; none do now (`fd10bd7`). Tables scroll sideways, rows wrap, long tokens break, and text cut on purpose shows in full. A second pass lifted 28 more cuts: summary previews expand when opened, other cut text wraps (`dce786e`). Tests guard clipped tables and summary clamps; the element-level check itself needs a browser and lives outside the repo. See `docs/MODERNIZATION.md` §18. |
| **P8 — Filter bars announced as tabs** | **Done.** Sixteen filter rows in 14 components on `/education`, `/take-action`, `/directory` and `/profiles` were tab widgets over a single list, so a screen reader announced "tab, 1 of 6" and promised panels that did not exist. Each is now a named group of toggle buttons: `role="group"`, an `aria-label` that says what it filters and by what, `aria-pressed` and `type="button"`. Four `<label>`s that labelled no control went with them. A test fails on any tab role in `src`, and `accessibility-filter-bars.test.tsx` checks every group. The profiles index had said "65 total cases" for six months after a duplicate record was removed; it says 64, and its test reads the count from the data. The rule is in `STYLE_GUIDE.md` §4 (Filters). |
