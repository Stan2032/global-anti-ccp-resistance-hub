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

## P9 — Card expanders hide their details without JavaScript

**Size:** large but mechanical · **Value:** high · **Risk:** low

The tabs are gone, but the same failure survives one level down. Cards all
over the site (tracker entries, timeline events, tools, guides, FAQ
answers) expand through a React-state button with `aria-expanded`, and the
detail is only rendered once clicked. Without JavaScript the button does
nothing and the detail is not in the HTML. The pre-rendered pages hold
**941** such buttons.

How much they hide, measured in Chromium by opening each expander on its
own, recording the text it adds, and closing it again:

| route | page text | hidden behind expanders |
|---|---|---|
| `/profiles/jimmy-lai` | 6,719 | 3,695 (**+55%**) |
| `/security` | 38,379 | 36,190 (**+94%**) |
| `/intelligence` | 179,228 | 165,447 (**+92%**) |

**Measurement trap.** Clicking every expander at once and measuring once
reported only +2–5%. Many components allow one open card at a time
(`expandedItem === id`), so a bulk click leaves just the last one open. Open
them one at a time.

The fix is the one used for the tabs: a native `<details>`/`<summary>` per
card, with the card's header as the summary. It is keyboard operable and
announced correctly without any ARIA, and a find-in-page match opens it.
Single-open behaviour goes away, which is fine: it existed to save space,
and a closed `<details>` takes no more room than a closed card.

**Done: all 16 profile pages.** They now share `ProfileTimeline`, which
replaced three hand-rolled variants: each event is a native `<details>`, and
"Expand all" renders only once JavaScript runs. The "Show N more narratives"
toggle on two profiles is a `<details>` too. No profile holds React state
any more, and `profile-pages.test.tsx` fails if an `aria-expanded` control
returns. Jimmy Lai's page went from 6,719 to 11,803 characters readable
without JavaScript.

**Done: `/security`.** WhistleblowerGuide's three card lists and
DiasporaSecurityAdvisor's country cards are native `<details>`. The page
went from about 38,400 to 74,930 characters readable without JavaScript.
The tracker-card pattern (a toggle button, then `{isExpanded && (…)}`)
recurs across a dozen components. `cards_to_details.py` in the session
scratchpad converted WhistleblowerGuide mechanically. The rule it follows:
<div>s inside a <summary> become <span>s, since a summary may hold only
phrasing content, with `block` added where the div had no display class.

**Done: `/prisoners`.** Each row in the prisoner list (sentence, health,
latest update, international response, source) is a native `<details>`.
The case-study deep dives, which opened only through a JavaScript click
that swapped the grid for a detail view, are now one `<details>` per case
with the full case file inside. The page went from 16,645 to 66,659
characters readable without JavaScript. CaseTimelineViewer's
`aria-expanded` sits on a combobox (a searchable prisoner picker), not a
content expander, and stays: showing every prisoner's full timeline at
once would be the wrong fix, and the list above it now carries each case.

**Left:** 538 expanders outside the header and nav. By route: `/intelligence`
262, `/education` 92, `/data-sources` 77, `/take-action` 42, `/resources`
30, `/directory` 24, `/` 11. Next: the `/intelligence` trackers.

---

## Small items

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
