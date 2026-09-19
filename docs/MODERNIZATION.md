# Modernization Audit — September 2026

> Audit date: 2026-09-19. Previous commit: 2026-03-14 (Session 280).
> Roughly six months of drift. This document records what was found, what was
> fixed, and what still needs a decision from the project owner.

---

## 1. Headline findings

| # | Finding | Severity | Status |
|---|---------|----------|--------|
| **0** | **Site served 217 chars without JS — and told at-risk readers to enable JS in Tor**, contradicting its own security guidance | **Critical (mission)** | ⚠️ Message fixed; pre-render is the real fix (§12) |
| 1 | 18 npm vulnerabilities (1 critical, 12 high), incl. `react-router-dom`, which ships to users | **Critical** | ✅ Fixed — 0 remaining |
| 2 | "Last updated" on the statistics dashboard rendered *today's date* regardless of data age | **High (integrity)** | ✅ Fixed |
| 3 | A live, unhardened duplicate of the site at `stan2032.github.io` with 1 of 9 security headers | **High** | ⚠️ Needs owner decision |
| 4 | No CI ran tests, lint, typecheck or audit on any push or PR | **High** | ✅ Fixed |
| 5 | All site content unverified for ~195 days; 9 freshness guards firing | **High (content)** | ⚠️ Needs re-verification |
| 6 | `backend/` is undeployed, unreferenced dead code carrying 26 more vulnerabilities | Medium | ⚠️ Needs owner decision |
| 7 | Supabase is integrated in code but **no Supabase project exists** — all 4 forms are inert | Medium | ⚠️ Needs owner action |
| 8 | Chow Hang-Tung's profile was missing from `sitemap.xml` — unindexed by search engines | Medium | ✅ Fixed |
| 9 | 15 stale Dependabot PRs open since April–July | Low | ✅ 9 superseded; 6 are `backend/` |
| 10 | 14,081 lines of content in 38 components, outside every freshness guard, the API and exports | Medium | 📋 Documented as deferred debt (§13) |

---

## 2. The integrity bug (finding 2)

`LiveStatistics.tsx` contained:

```js
const [lastUpdated] = useState(new Date());
// ...
<div>Last updated: {lastUpdated.toLocaleDateString()}</div>
```

This rendered the **current date on every page load**. A visitor on 19 September
2026 was told the political-prisoner and detention figures were "Last updated:
9/19/2026" when the underlying `live_statistics.json` had `lastVerified:
"2026-03-08"` — 195 days earlier.

This matters more here than it would elsewhere. The project's stated values are
"Truth — every claim sourced, every date verified" and "Transparency — honest
about limitations", and its own documented anti-patterns list *"Optimistic
documentation: never claim something works without verifying it."* The component
was asserting a freshness the data did not have.

**Fix:** the component now derives the date from the *oldest* `lastVerified`
across the dataset — the conservative claim, since the set is only as current as
its stalest entry — renders it via the existing `getFreshnessInfo()` helper
("Verified 195 days ago (2026-03-08)"), and shows an amber caution line when the
data is stale, telling readers to check the per-statistic source before citing.

A regression test (`LiveStatistics.test.tsx`) now fails if the render date is
ever substituted for the verification date again.

---

## 3. Content freshness — separated from code correctness

Nine tests were failing, all purely because time had passed:

```
data-freshness            statistics / sanctions / prisoners stale beyond 180 days
data-staleness-guard      prisoner + legal-case records stale beyond 90 days
cross-data-consistency    critical alert lastVerified 193 days old (max 60)
sitemap-data              lastmod 198 days old (max 30)
EmergencyAlerts (×2)      two alerts expired, so the component filtered them out
```

These guards did their job — they are a dead-man's switch and it fired. But a
permanently-red suite is worse than no suite: real regressions hide in the
noise. That is not hypothetical. Upgrading dependencies introduced three genuine
test failures during this audit, and they were only obvious because the
pre-existing failures had been catalogued first.

So the two signals are now separated:

- **`npm test`** — code correctness. Must be green. Gates every PR. **3691 tests
  across 199 files, all passing.**
- **`npm run test:content`** — content freshness. Runs weekly via
  `.github/workflows/content-freshness.yml` and on demand. **Currently failing,
  correctly**, with 7 signals.

The guards were not weakened and no thresholds were moved. They were routed to
where they are actionable.

> **A content-freshness failure must never be "fixed" by editing a
> `last_verified` date.** That fabricates provenance, which this project
> forbids. It is fixed by re-checking the entry against a Tier 1–2 source.

The two `EmergencyAlerts` failures were a different problem: a *test* defect, not
a content one. Those component tests asserted against the live alerts feed, which
is deliberately transient, so they broke as real alerts aged out. They now run
against `src/test/fixtures/emergency_alerts.fixture.json` and no longer decay.

---

## 4. The duplicate site (finding 3)

`https://stan2032.github.io/global-anti-ccp-resistance-hub/` is **live and
serving HTTP 200**, published by a `deploy.yml` workflow that targeted GitHub
Pages long after the project moved to Cloudflare Workers.

Header comparison:

| | Cloudflare (canonical) | github.io mirror |
|---|---|---|
| Security headers present | **8** | **1** (GitHub's own HSTS) |
| Content-Security-Policy | ✅ | ❌ |
| Referrer-Policy | ✅ | ❌ |
| X-Frame-Options | ✅ `DENY` | ❌ |
| Permissions-Policy | ✅ | ❌ |
| Content currency | current build | whenever master last deployed |

The security headers live in `public/_headers`, which is a Cloudflare mechanism.
GitHub Pages cannot serve them at all, so the mirror **cannot be hardened in
place**.

The missing `Referrer-Policy` is the one that matters most for this audience: without
it, outbound clicks leak the referring URL, which can reveal that a reader was
on an anti-CCP human-rights site. The project's own values say "Users of this
site may be in danger. Never compromise their safety."

`deploy.yml` has been **deleted**, not replaced — see §14: Cloudflare Workers
Builds already deploys this repo through its own Git integration, so a GitHub
Actions deploy would have been a second, competing deployer.

**Deleting the workflow does not take the mirror down.** GitHub Pages keeps
serving its last deployment until Pages is disabled in repository settings.

**Decision needed.** `_agents/TODO.md` lists "Mirror Sites: multiple domain
mirrors for accessibility" as a deliberate censorship-resistance goal, so the
mirror may have been wanted. But an *unhardened, silently stale* mirror is not
that. Either:

- **(a) Retire it** — Settings → Pages → disable. Simplest, removes the risk.
- **(b) Do it properly** — run the mirror somewhere that can serve headers
  (a second Cloudflare Worker, Netlify, Cloudflare Pages), deploy it from the
  same CI, and add it to the mirror list in the docs.

Option (b) is the better fit for the project's goals, but it is real work and
should be a deliberate choice rather than an accident of an old workflow.

---

## 5. Dependency upgrade performed

`npm audit fix` and `npm update` both crashed with `Cannot read properties of
null (reading 'edgesOut')` — an npm 10.9.7 arborist bug resolving vitest 4.1.x's
peer graph, not a corrupt lockfile. Resolved by regenerating the lockfile under
npm 12 (`npx npm@12 install`).

Floors were raised explicitly in `package.json` rather than relying on
`npm update`, so a future clean install cannot silently resolve back to a
vulnerable version. All upgrades stayed **within existing majors**.

| Package | From | To | Why |
|---|---|---|---|
| `react-router-dom` | 7.10.0 | 7.18.4 | **HIGH — ships to users** |
| `vitest` | 4.0.18 | 4.1.11 | **CRITICAL** (`@vitest/mocker` path traversal) |
| `vite` | 7.2.4 | 7.3.6 | HIGH (path traversal, `fs.deny` bypass) |
| `postcss` | 8.5.6 | 8.5.28 | HIGH |
| `@supabase/supabase-js` | 2.97.0 | 2.116.0 | pulls patched `ws` |
| `react` / `react-dom` | 19.2 | 19.3 | current |
| `@typescript-eslint/*` | 8.56.1 | 8.70.0 | current |
| `recharts` | 3.5.1 | 3.10.1 | current |
| + 8 others | | | current |

**Result: 18 vulnerabilities → 0.**

### Fallout, and what it exposed

1. **`@types/node` was missing.** It had only ever been present by accidental
   hoisting from a transitive dependency; the clean lockfile dropped it and
   `tsc` broke on `fs`, `path` and `__dirname` in the test suite. It is now a
   declared `devDependency` — latent fragility that the upgrade surfaced rather
   than caused.

2. **Three tests broke on React 19.3.** All asserted that a Suspense fallback
   (`$ loading`) was synchronously visible. React no longer guarantees this when
   a lazy chunk resolves immediately — and in these suites the lazy components
   are `vi.mock`ed, so they resolve instantly. The tests were weak anyway: two
   were named for content they never checked (`"defaults to Assess tab with
   SecurityQuiz"` only asserted a spinner existed). They now assert the lazy
   component actually renders.

3. **A new `react-hooks` rule** (`set-state-in-effect`, plugin 7.1) flagged
   `useLiveData.ts`. This is an async fetch-on-mount, not the derived-state
   anti-pattern the rule targets, so it carries a scoped exemption with a
   written justification rather than a restructure.

4. **Bundle grew 310 KB → 339 KB** (99 → 107 KB gzip). The budget test allows
   350 KB, so this is now at **97% of budget**. Not a problem today; it will
   become one. See §7.

---

## 6. Deferred major upgrades

None of these were attempted. Each is a project in its own right, and doing them
alongside a security patch would have made the diff unreviewable.

| Upgrade | Current → Latest | Effort | Notes |
|---|---|---|---|
| **Tailwind** | 3.4.19 → 4.3.3 | **High** | v4 moves theme config from `tailwind.config.js` into CSS (`@theme`). This project has a 613-line `index.css` plus a custom terminal palette, and **10 design-system compliance tests** assert on class names. Do this alone, on its own branch. |
| **ESLint** | 9.39.5 → 10.11.0 | Medium | npm already warns 9.x is **end of support**. Flat config is already in use, which is the hard part. Mostly rule-preset churn. Do this next. |
| **Vitest** | 4.1.11 → 5.0.1 | Medium | 201 test files. Note `--reporter=basic` was already removed in v4. |
| **Vite** | 7.3.6 → 8.3.0 | Medium | Pairs naturally with the Vitest bump. |
| **TypeScript** | 5.9.3 → 7.0.2 | Medium–High | TS 7 is the native port. Large speed win on a 375-file codebase; check `tsgo` compatibility with the ESLint TS plugin first. |
| **lucide-react** | 0.555.0 → 1.47.0 | Low–Medium | First stable major. Icon names may have changed; used very widely here. |
| **jsdom** | 28.1.0 → 30.1.0 | Low | Two majors of test-env behaviour. |
| **`@vitejs/plugin-react`** | 5.2.0 → 6.1.1 | Low | Pairs with Vite 8. |

**Suggested order:** ESLint 10 (end-of-support, cheapest) → Vitest 5 + Vite 8
(paired) → lucide-react 1 → TypeScript 7 → Tailwind 4 (last, largest).

---

## 7. Architecture observations

### `backend/` should probably go

`backend/` is an Express + PostgreSQL + Socket.io server that is **not deployed,
not referenced by any frontend code, and not covered by the frontend CI**. The
frontend's `SocketContext` was deleted during the TypeScript migration; nothing
imports it.

It carries its own `package-lock.json` with **26 vulnerabilities (15 high)** that
nothing audits, and it generates continuous Dependabot noise — 6 of the 15 open
Dependabot PRs target `backend/` alone.

Its role has been taken over by `api/worker.js` (Cloudflare Workers, 13 REST
endpoints, live) and Supabase.

**Recommendation:** delete it, or move it to an `archive/` branch or tag so the
history is preserved without the maintenance and audit burden. This deletes real
work, so it is the owner's call, not mine.

### Supabase is wired to nothing

The code is complete: `supabaseClient.ts`, `supabaseService.ts`, `AuthContext`,
`ProtectedRoute`, `AdminLogin`, `AdminDashboard`, and all four forms
(IncidentReport, VolunteerSignup, NewsDigest, ContactForm). Setup guides exist
(`SUPABASE_SETUP.md`, `SUPABASE_AUTH_SETUP.md`).

But there is **no Supabase project**. The only project on the account is
"kTasks", which is unrelated. Every form therefore falls back to its "Coming
Soon" state.

The fallback is honest and degrades gracefully — that part is right. But the
feature has been "implemented" since Session 157 and has never once worked in
production.

**Needed from the owner:** create a Supabase project, run the SQL in
`SUPABASE_SETUP.md` steps 2–4, and set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
This is 20 minutes of work and it turns four dead forms live. *(Creating a
project bills to the account, so it was not done unilaterally.)*

### Bundle budget

The main chunk is at 339 KB against a 350 KB budget. The next dependency bump
will likely breach it. Options when that happens: route-level splitting for the
profile pages (16 profiles, ~25 KB each, already lazy), or moving the largest
JSON datasets behind the existing Workers API instead of bundling them.
`political_prisoners_research.json` alone is 73 KB in the bundle.

---

## 8. UI observations

The terminal aesthetic is coherent and well executed. Checked at 1440×900 and
390×844 across Dashboard, Prisoners, Intelligence and a profile page:
**zero horizontal overflow at either width.** Contrast, focus states and ARIA
coverage are genuinely good — this is better than most projects of its size.

Two things stood out:

1. **The Dashboard is 9,151 px tall** on desktop — roughly twelve stacked
   sections (alerts, dashboard, intelligence overview, quick actions, detention
   timers, recent updates, latest intelligence, essential tools, statistics,
   data sources, news digest, notification centre). `_agents/TODO.md` sets the
   target at "3–5 key sections per page, not 10–15", and every other page was
   simplified to meet it. The Dashboard was reduced from 8 lazy components to 5,
   but the *page* kept growing around them. It is the first page every visitor
   sees and currently asks them to scroll past nine screens of content to reach
   the footer.

   Worth considering: promote the 3–4 things a first-time visitor needs
   (urgent alerts, the human-cost figures, one clear call to action) and move
   the rest behind the existing tab/expander patterns already used elsewhere in
   the app.

2. **The onboarding tour overlaps content.** The 7-step welcome popup renders
   over the statistics cards at 1440 px wide, obscuring the fourth tile. Minor,
   but it lands on first visit, which is exactly when it is most visible.

Neither was changed — both are design decisions rather than defects.

---

## 9. What is needed from the project owner

Ranked by impact:

1. **Re-verify content** (or delegate it). ~195 days stale: **63 of 64** prisoner
   records, 25 legal cases, sanctions metadata, 8 statistics.
   `npm run test:content` lists exactly what is overdue. **Do not bump the dates
   without checking the sources.**
   - **Joshua Wong was done during this audit** — see §11. It is the worked
     example of what the rest of this task looks like.
   - Two emergency alerts expired (23 and 26 August) and are now filtered out of
     the UI. Worth deciding whether those events should move to the timeline.
   - The `jimmy-lai-verdict` alert is now the oldest active critical alert at
     193 days.
2. **Decide on the github.io mirror** — retire, or re-host somewhere it can be
   hardened (§4).
3. **Create the Supabase project** to make the four forms live (§7).
4. **Decide on `backend/`** — delete or archive (§7).
5. **Close the 6 `backend/` Dependabot PRs** if `backend/` goes. The other 9 are
   superseded by §5 and can be closed once this lands.
6. **Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`** as Actions secrets
   if automatic deploys are wanted; the workflow skips cleanly without them.

---

## 10. Changes made in this sweep

**Security**
- 18 vulnerabilities → 0; 22 dependency floors raised; lockfile regenerated
- `@types/node` declared explicitly
- Removed two no-op `<meta http-equiv>` security tags (browsers ignore them;
  the X-Frame-Options one said `SAMEORIGIN` while the served header says `DENY`)

**CI** — none of this existed before
- `ci.yml` — lint, typecheck, test, build, plus `npm audit --audit-level=high`
- `content-freshness.yml` — weekly content-staleness alarm
- `deploy.yml` — **deleted**; Cloudflare Workers Builds already deploys via its
  own Git integration (§14). The old workflow published to GitHub Pages.
- `.nvmrc` pinning Node 22
- `npm run verify` / `npm run typecheck` / `npm run test:content` scripts

**Correctness and integrity**
- Statistics dashboard reports real verification dates (§2)
- Chow Hang-Tung added to `sitemap.xml`; the test now derives expected profiles
  from disk, so a missing entry fails loudly instead of going unindexed
- 3 lazy-loading tests fixed and strengthened for React 19.3
- `EmergencyAlerts` tests moved onto a fixture; no longer decay over time
- `caughtErrorsIgnorePattern` added to ESLint config so the repo's `_` prefix
  convention covers catch params (ESLint 9+ defaults `caughtErrors: "all"`)
- `theme-color` corrected `#0f172a` → `#0a0e14` to match the manifest

**Verification:** lint clean, `tsc --noEmit` clean, **3691/3691 tests passing
across 199 files**, production build succeeds, `npm audit` reports 0
vulnerabilities.

---

## 11. Content re-verified during this audit: Joshua Wong

The single most time-sensitive item was checked and updated, as a worked example
of the process the remaining records need.

**What the site said:** "Joshua Wong Foreign Collusion Case — Transferred to High
Court, **Next Hearing Sept 5**" — presented as an upcoming event.

**What actually happened:** Wong **pleaded guilty on 2 September 2026** at the
High Court to conspiracy to collude with foreign forces — his second National
Security Law conviction. Judge William Tam adjourned sentencing, saying he would
decide "as soon as possible". **No sentencing date has been set.** He is already
serving four years and eight months from the Hong Kong 47 case, was originally
due for release in January 2027 before this prosecution, and will not receive
remission on the earlier sentence. Foreign collusion carries a maximum of life.

Verified against two independent Tier 1–2 sources, per the project's
two-source rule, and corroborated by a third:

- [Hong Kong Free Press](https://hongkongfp.com/2026/09/02/breaking-jailed-hong-kong-pro-democracy-campaigner-joshua-wong-pleads-guilty-to-foreign-collusion-charge/)
- [Hong Kong Watch](https://www.hongkongwatch.org/all-posts/2026/9/2/joshua-wong-joshua-wong-pleads-guilty-in-second-hong-kong-national-security-law-trial)
- [Al Jazeera](https://www.aljazeera.com/news/2026/9/2/hong-kong-activist-joshua-wong-pleads-guilty-in-national-security-case)

Updated: the `joshua-wong-hearing` alert (title, summary, details, dates, source
links) and his `political_prisoners_research.json` record (sentence,
latest_news, source_url), both with `last_verified: 2026-09-19`.

**One discrepancy left unresolved.** The site's previous alert said the case was
transferred to the High Court on 6 March 2026; Hong Kong Watch says the transfer
was in May 2026. Rather than pick one, the transfer date was dropped from the
updated copy. It needs a third source before being restated.

Edits were made with exact string replacement rather than a JSON round-trip.
A structured rewrite silently re-encoded `\uXXXX` escapes across unrelated
records — cosmetically harmless, but it would have shown dozens of
human-rights entries as modified when they had not been re-verified.

---

## 12. The one that matters: the site is unreadable to the readers it is for

Added 2026-09-19 after a second pass looking for structural rather than
maintenance problems.

### The contradiction

The site's own guidance tells readers in China to *"use Tor Browser
exclusively"* and to *"consider using Tails OS for maximum security"*
(`FAQ.tsx`), and `DiasporaSecurityAdvisor` says *"use Tor Browser for all
CCP-related research and posting"*.

Tor Browser's **Safer** and **Safest** levels disable JavaScript. That is the
point of them: JavaScript is the primary deanonymisation and fingerprinting
vector.

With JavaScript disabled, the site served **217 characters** — and those
characters said:

> "For security, we recommend using Tor Browser **with JavaScript enabled**."

So a reader who took the site's advice, arrived on Safest, and then read the
fallback message was being told to give up their strongest protection in order
to read us. Everything else — 64 prisoner records, 16 profiles, 69 timeline
events — was invisible.

The `<noscript>` block has been rewritten: it now tells readers on Safer or
Safest to **stay there**, and points to the read-only JSON API, which needs no
JavaScript and is already live (`/api/v1/prisoners` returns 64 records as
`application/json`, verified).

**That is a stopgap, not a fix.** The fix is to pre-render.

### Spike: can this SPA be pre-rendered?

Measured, not estimated. `scripts/prerender-spike.mjs` renders each route in
headless Chromium, snapshots `#root`, and splices it into the real shell —
**zero source changes**.

| Route | Text without JS | gzip | Hydration (JS on) |
|---|---|---|---|
| *(current SPA)* | **667 chars** | — | — |
| `/` | **11,561 chars** | 19.7 KB | ✅ 0 errors |
| `/prisoners` | **17,588 chars** | 22.9 KB | ✅ 0 errors |
| `/profiles/jimmy-lai` | **2,939 chars** | 10.1 KB | ✅ 0 errors |

The prisoner database renders as real HTML — Jimmy Lai, Ilham Tohti and Chow
Hang-Tung all present in the static markup. A no-JS reader on a hostile network
downloads ~23 KB of HTML instead of ~107 KB of JavaScript, and gets content
immediately.

Build cost: ~4s per route, so **≈111s for all 27 sitemap routes**.

### What the spike surfaced

1. **Transient client state gets baked in.** The first run captured the 7-step
   onboarding tour into the static HTML — a no-JS reader would have seen a
   popup they could not dismiss. Fixed by seeding `localStorage` via
   `addInitScript` before the app mounts. Any client-only overlay needs the
   same treatment.
2. **Live-feed pages pre-render to an empty state.** `/intelligence` produced
   only 2,513 chars because its RSS feeds are fetched client-side. That is
   correct behaviour, but those pages keep needing JavaScript for their value
   and should probably be excluded from pre-rendering.
3. **Hydration is clean.** React 19 re-attached to the pre-rendered markup with
   zero console errors on both content routes. The errors on `/` were RSS
   fetches blocked by the sandbox network, not hydration.

### If a proper SSG is preferred over post-build snapshotting

Only **~5 files** touch a browser global on the render or init path and would
need a guard:

```
contexts/ThemeContext.tsx        localStorage + window.matchMedia in useState initialisers
contexts/LanguageContext.tsx     localStorage in useState initialiser
components/EmergencyAlerts.tsx   localStorage in useState initialiser
components/QuickStartGuide.tsx   localStorage in useState initialiser
components/PWAInstallBanner.tsx  window / matchMedia in useState initialiser
```

An earlier count of 62 files was wrong: nearly all of those touch `navigator`
or `document` inside click handlers (clipboard copy, file download), which
never run during server rendering.

This is a much smaller obstacle than the size of the codebase suggests, and it
makes a real SSG (`vite-react-ssg`, or React Router 7's own `prerender`
option) a genuine alternative to snapshotting rather than a rewrite.

### Why this reframes the upgrade plan

Pre-rendering, in one change, addresses four things listed separately as
long-term goals in `_agents/TODO.md`: **Offline Mode**, **Mirror Sites**,
**Tor Hidden Service** and **IPFS Integration**. Static HTML is trivially
mirrorable to an onion service, to IPFS, to a USB stick, or to paper. A
JavaScript bundle is not.

It also means **Tailwind 4 should ride along with this work**, not be done as
its own project — §6's largest deferred item becomes part of a change that has
a mission justification rather than a maintenance one.

---

## 13. Known debt, deliberately deferred

Recorded here rather than acted on, per the owner's decision on 2026-09-19.

### Two-tier content provenance

The integrity apparatus — freshness guards, `last_verified`, source-URL health
checks, CCP-media never-cite enforcement, `DataExport`, the public API, the
data changelog — all operates on `src/data/*.json` (551 KB, ~340 records).

**38 components hold 14,081 lines of content that sits entirely outside it.**
WorldThreatMap (59 records), SafetyChecklist (47), ConfuciusInstitutes (40),
LegalResourcesHub (33), IPACMembers (31), MemorialWall (victims' names).

Of six sampled, **none carries a verification date** and only one
(`MemorialWall`) has any source field. None is covered by a freshness guard,
exposed through the API, or included in exports. Nothing tells a reader which
tier they are looking at.

The thoroughness of the JSON machinery is what hides this: guards going green
says nothing about half the content.

### Data-shape residue

Ten datasets (340 records) are still in raw research-pipeline shape,
`{input, output, error}`, where `input` is the original research query
(*"Jimmy Lai - Hong Kong media owner, Apple Daily founder, arrested 2020"*) and
`error` is always an empty string. That residue is **~5-6% of every data file**
and ships to users in the bundle. Normalising it would also let schema
validation replace a share of the 737 hand-written data assertions.

### Field naming split

The same concept is spelled two ways: `last_verified` in seven datasets,
`lastVerified` in `emergency_alerts.json` and `live_statistics.json`. Worth
settling whenever the schema work happens.

### A correction to an earlier assumption

An initial hypothesis that the test suite had become a bureaucratic conformance
harness was **wrong** and is recorded here so nobody re-derives it. Measured
composition of the 3,521 counted assertions:

| Bucket | Tests | Share |
|---|---|---|
| Component & page behaviour | 2,553 | 72.5% |
| Data & dataset assertions | 737 | 20.9% |
| Conformance / meta / lint-as-test | 231 | 6.6% |

The suite is mostly genuine behaviour coverage. It is not the problem.

---

## 14. Deployment is already automated — by Cloudflare, not GitHub Actions

Found from the PR event stream rather than the repository, which is why it was
missed in the first pass.

Pushing to this branch produced three `cloudflare-workers-and-pages[bot]`
comments reporting **successful production-service builds** for commits
`a72ad38`, `b4b32cf` and `1eeb661`, each with a commit preview URL and a
branch preview URL. Meanwhile GitHub Actions shows **no `deploy.yml` runs at
all** — only `ci.yml`.

So **Cloudflare Workers Builds owns deployment**, via the Git integration,
building from `wrangler.jsonc`. Nothing in the repository says so: there is no
workflow, and neither `CLOUDFLARE_DEPLOY.md` nor the agent handoff mentions
it, which is why the first pass assumed the stale GitHub Pages workflow was
the deploy path.

The Cloudflare Workers deploy workflow written earlier in this audit has
therefore been **deleted**. Had anyone later added `CLOUDFLARE_API_TOKEN` as
an Actions secret, every push to `master` would have deployed twice — once by
Cloudflare Builds and once by Actions, racing each other.

**What this means going forward**

- Deploys happen automatically on push. No secrets to configure; item 6 in §9
  is withdrawn.
- Branch pushes get preview URLs, so changes can be reviewed on a real
  Cloudflare deployment before merge — the branch preview for this work is
  `claude-project-audit-modern-ebde-global-anti-ccp-resistance-hub.stane203.workers.dev`.
- `ci.yml` and `content-freshness.yml` stay in GitHub Actions. Testing and
  deployment live in different systems, which is fine, but worth knowing: **a
  red CI run does not block the Cloudflare deploy.** If gating deploys on tests
  matters, that has to be configured on the Cloudflare side.
- This should be written into `CLOUDFLARE_DEPLOY.md`, which currently describes
  manual `npx wrangler deploy` as the deployment method.

---

## 15. Pre-rendering: implemented (WIP)

Built 2026-09-19 after the §12 spike. **Static generation, not browser
snapshotting** — Cloudflare Workers Builds preinstalls Node but no Chromium,
so the snapshot approach measured in §12 could never have run at deploy time.

### What it does

`vite build` now runs `scripts/prerender.mjs`, which builds a small SSR bundle
and renders every route from `public/sitemap.xml` to real HTML using
`prerender()` from `react-dom/static`. No browser. **27 routes in 0.9s** —
against ~111s for the Chromium approach.

`/prisoners`, measured in a browser with JavaScript disabled:

| | visible text |
|---|---|
| before | 2,186 chars (the noscript notice, and nothing else) |
| after | **11,336 chars** — the prisoner database, readable |

Jimmy Lai, Ilham Tohti and Gao Zhisheng all render without JavaScript.

### The part that was not obvious

`prerender()` alone was not enough. With a `<Suspense>` boundary around the
routes, React put the **entire page** inside `<div hidden id="S:0">` with a
`$RC()` script to swap it in, and emitted the `$ loading` fallback in its
place. The content was in the HTML but invisible without JavaScript — so the
first working version still showed readers an empty page.

React can only defer a subtree if there is a boundary to defer *to*.
`RouteBoundary` in `src/App.tsx` therefore renders its children bare when
`import.meta.env.SSR`, leaving React nowhere to defer and forcing it to wait
for the lazy route and inline the markup. The browser keeps the real boundary.

A build-time guard fails the build if `$ loading` ever reappears in a
pre-rendered route, because that regression is invisible to anyone testing
with JavaScript on.

### Known limitations

1. **41 inner sections still defer.** Components with their own nested
   `<Suspense>` still land in `<div hidden>` and need JavaScript. Page-level
   content is inlined; some sub-sections are not. `/prisoners` inlines its
   database; `/take-action` and `/education` inline less.
2. **Hydration reports React error #418.** The server tree has no route-level
   Suspense boundary and the client's does, so React discards the markup and
   re-renders on the client. Everything works and nothing is lost relative to
   before — JavaScript users were already fully client-rendering — but the
   hydration saving is not yet realised.
   The fix is to keep the boundary on both sides and stop the pages
   suspending: resolve route components eagerly in the SSR build only (an
   `import.meta.glob` page registry aliased per environment), so the boundary
   exists in both trees but never defers. Not done yet.

### Supporting changes

- `src/utils/ssr.ts` — `readStoredValue`, `matchesMediaQuery`, `isBrowser`,
  and `useBrowserValue` (a `useSyncExternalStore` wrapper for values that
  legitimately differ between server and client).
- Eight components read a browser global on the render path and were guarded.
  The §12 estimate of "~5 files" was **wrong**: the scan missed
  `useState<T>(...)` calls because the regex did not allow a generic type
  parameter. `MemorialWall`, `NotificationCenter` and `SafetyChecklist` were
  found only when the build crashed on them.
- `QuickStartGuide` renders nothing during pre-render, via `useBrowserValue`,
  so the onboarding tour is not baked into static HTML where a reader without
  JavaScript could not dismiss it. It still appears normally for everyone else.
- `main.tsx` now calls `hydrateRoot` when markup is present, `createRoot`
  otherwise.
- The `<noscript>` block was rewritten again: it previously said the site
  needed JavaScript to show content, which pre-rendering has made untrue.

### Platform question: should this move to Cloudflare Pages?

**No.** Cloudflare's own guidance is Workers with static assets for new
projects; Pages gets bug fixes while Workers gets the roadmap, and the
official migration guide runs Pages → Workers, not the reverse. This project
is already on the recommended platform, and `api/worker.js` would have to be
rewritten as Pages Functions to move. The only reason to think otherwise was
`CLOUDFLARE_DEPLOY.md` describing Pages, which was simply wrong and is now
corrected.

---

## 16. Attempted and reverted: SSR-only eager page registry

Tried 2026-09-19, measured, reverted. Recorded so nobody spends the time again.

§15 said the fix for the React #418 hydration mismatch was to keep the
Suspense boundary on both sides and stop the pages suspending, by resolving
route components eagerly in the SSR build only. That was built: a
`src/registry.ts` (lazy, browser) and `src/registry.server.ts` (eager,
pre-render), selected by an `@app-registry` alias pointing at one or the
other per build, with `RouteBoundary` restored to always rendering
`<Suspense>`.

**It fixed the mismatch and broke the thing that matters.**

| | before | after the registry |
|---|---|---|
| React #418 | present | **gone** |
| `<div hidden>` blocks | 41 | **67** |
| routes emitting `$ loading` | 0 | **all 27** |
| `/prisoners` text without JS | 11,336 chars | **1,906** — shell only |

### Why

Making the *pages* eager is not enough. Around 80 sub-components inside the
pages are still `React.lazy` with their own Suspense boundaries. Once a
route-level boundary exists again, the first inner component that suspends
defers **the entire route subtree** to that boundary — pages included. The
eager page registry removed one source of suspension while leaving eighty.

With no route boundary, React has nowhere to defer to and must wait, which is
exactly why the shipped version inlines the content.

### What would actually work

Every lazy component reachable during a render must be eager in the SSR
build — the ~80 sub-component `lazy()` calls inside page files as well as the
route components. Then nothing suspends, the boundary can return to both
trees, hydration matches, and all 41 currently-deferred sections inline too.

That is a mechanical sweep of roughly twenty page files, moving their
`lazy()` declarations into the shared registry. It is the right end state.
It was not attempted here because a half-done version is worse than none, as
the table above shows.

### The trade-off as it stands

Shipped: readers without JavaScript get the content; readers with JavaScript
get a hydration mismatch and a client re-render. Since they were fully
client-rendering before this work anyway, nobody is worse off than the
starting point and the at-risk readers are much better off. That is the right
side of the trade to be on while the sweep is outstanding.

**Measure before believing.** Both the #418 fix and this revert were decided
by numbers from a real browser with JavaScript disabled, not by reasoning
about React's behaviour. The reasoning was wrong twice.

