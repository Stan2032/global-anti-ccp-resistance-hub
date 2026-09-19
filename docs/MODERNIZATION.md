# Modernization Audit — September 2026

> Audit date: 2026-09-19. Previous commit: 2026-03-14 (Session 280).
> Roughly six months of drift. This document records what was found, what was
> fixed, and what still needs a decision from the project owner.

---

## 1. Headline findings

| # | Finding | Severity | Status |
|---|---------|----------|--------|
| 1 | 18 npm vulnerabilities (1 critical, 12 high), incl. `react-router-dom`, which ships to users | **Critical** | ✅ Fixed — 0 remaining |
| 2 | "Last updated" on the statistics dashboard rendered *today's date* regardless of data age | **High (integrity)** | ✅ Fixed |
| 3 | A live, unhardened duplicate of the site at `stan2032.github.io` with 1 of 9 security headers | **High** | ⚠️ Needs owner decision |
| 4 | No CI ran tests, lint, typecheck or audit on any push or PR | **High** | ✅ Fixed |
| 5 | All site content unverified for ~195 days; 9 freshness guards firing | **High (content)** | ⚠️ Needs re-verification |
| 6 | `backend/` is undeployed, unreferenced dead code carrying 26 more vulnerabilities | Medium | ⚠️ Needs owner decision |
| 7 | Supabase is integrated in code but **no Supabase project exists** — all 4 forms are inert | Medium | ⚠️ Needs owner action |
| 8 | Chow Hang-Tung's profile was missing from `sitemap.xml` — unindexed by search engines | Medium | ✅ Fixed |
| 9 | 15 stale Dependabot PRs open since April–July | Low | ✅ 9 superseded; 6 are `backend/` |

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

`deploy.yml` has been replaced with a Cloudflare Workers deploy. **However,
deleting the workflow does not take the mirror down** — GitHub Pages keeps
serving the last deployment until Pages is disabled in repository settings.

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

1. **Re-verify content** (or delegate it). ~195 days stale: 64 prisoner records,
   25 legal cases, sanctions metadata, 8 statistics. `npm run test:content`
   lists exactly what is overdue. **Do not bump the dates without checking the
   sources.**
   - Specifically time-sensitive: the Joshua Wong foreign-collusion hearing was
     scheduled for **5 September 2026** — two weeks before this audit. The alert
     still describes it as upcoming. That outcome needs to be found and recorded.
   - Two emergency alerts expired (23 and 26 August) and are now filtered out of
     the UI. Worth deciding whether those events should move to the timeline.
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
- `deploy.yml` — GitHub Pages → Cloudflare Workers
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
