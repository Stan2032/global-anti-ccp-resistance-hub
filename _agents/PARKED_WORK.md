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

## P1 — Make every lazy component eager during pre-render

**Size:** medium (~20 files, mechanical) · **Value:** high · **Risk:** low if done whole

Finishes the pre-rendering work. Right now page-level content is pre-rendered
but **41 inner sections across all routes still defer** to `<div hidden>` and
need JavaScript, and hydration reports **React #418**.

Both have the same single cause and the same single fix: around 80
sub-components inside pages are `React.lazy` with their own Suspense
boundaries. While any of them can suspend during the pre-render, the route
boundary has to be absent (or React defers the whole page), and its absence
is what makes hydration mismatch.

**Do it in one go:** move every `lazy()` declaration — the ~30 route
components in `App.tsx` and the ~80 sub-component ones inside page files —
into a shared registry with two variants (lazy for the browser, eager for the
pre-render) selected by a build alias. Then restore `RouteBoundary` to always
render `<Suspense>`.

**Do not do half of it.** Session 281 tried exactly that — eager pages only —
and it made things strictly worse: `/prisoners` dropped from 11,336 readable
characters to 1,906, and `$ loading` came back on all 27 routes. Full
numbers and the mechanism are in `docs/MODERNIZATION.md` §16.

**Verify with:** a real browser with JavaScript disabled, not by reasoning.
`scripts/prerender.mjs` prints deferred-block counts; the build fails if the
route-level fallback reappears.

---

## P2 — Normalise the data schema

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
see P3's note on JSON round-tripping.

---

## P3 — Bring component-embedded content under provenance

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

## P4 — Major dependency upgrades

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

Tailwind 4 should ride along with P1 rather than being its own project — that
gives it a mission justification instead of a maintenance one.

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

---

## P7 — Content re-verification at scale

**Size:** large, ongoing · **Value:** high · **Risk:** none technical

63 of 64 prisoner records, 25 legal cases, sanctions metadata and 8
statistics are ~195 days past verification. `npm run test:content` lists
exactly what is overdue.

Joshua Wong was re-verified in Session 281 as a worked example — see
`docs/MODERNIZATION.md` §11 for the method: two independent Tier 1–2 sources
minimum, a third where available, exact string replacement, and any
discrepancy left unresolved rather than guessed.

**A content-freshness failure is never fixed by editing a `last_verified`
date.** That fabricates provenance, which this project forbids.

Sensible batching: the most time-sensitive cases first (anyone with an active
trial or an approaching sentence or release date), then sanctions, then the
long tail.

---

## Closed

| Item | Outcome |
|---|---|
| Snapshot pre-rendering via headless Chromium | Rejected — Cloudflare Workers Builds has no browser. Spike kept at `scripts/prerender-spike.mjs`, findings in §12. Delete the script once P1 lands. |
| Move deployment to Cloudflare Pages | Rejected — Workers with static assets is Cloudflare's recommendation; the official migration runs Pages → Workers. See §15. |
| Eager page registry alone as the #418 fix | Reverted — made no-JS output strictly worse. Superseded by P1. See §16. |
