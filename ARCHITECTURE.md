# Architecture — Static Site Overview

The Global Anti-CCP Resistance Hub is a **static React single-page application (SPA)** built with Vite 7, React 19, and Tailwind CSS. All content is bundled at build time from JSON data files — no server is required to serve the site.

---

## Build Pipeline

```
src/data/*.json ─────┐
src/pages/*.tsx ─────┤   npm run build     dist/
src/components/*.tsx ─┼─  ────────────── →  ├── index.html
src/locales/*.json ──┤   (Vite + Rollup)   ├── assets/
src/index.css ───────┘                     │   ├── index-*.js      (310KB / 99KB gzip)
                                           │   ├── index-*.css     (86KB / 15KB gzip)
                                           │   ├── vendor-react-*  (11KB)
                                           │   ├── vendor-router-* (35KB)
                                           │   └── [81 lazy chunks]
                                           └── (static assets)
```

### Key Build Features
- **100% TypeScript**: Entire codebase is TypeScript — 0 JavaScript/JSX files remain (360+ .ts/.tsx files)
- **Manual chunks**: React and React Router split into cacheable vendor bundles
- **Lazy loading**: 81 sub-components loaded on demand (all page bundles under 50KB)
- **Base path**: Configurable via `VITE_BASE_PATH` env var — defaults to `/` for Cloudflare, set to `/global-anti-ccp-resistance-hub/` for GitHub Pages

---

## Routing

React Router v7 handles all client-side navigation. Routes are defined in `src/App.tsx`.

```
/                        → Dashboard
/intelligence            → IntelligenceFeeds (3 tabs: Live Feeds, Regional, CCP Ops)
/prisoners               → PoliticalPrisoners
/security                → SecurityCenter (tabs: Overview, Tools, Guides, Quiz, Report)
/education               → EducationCenter (tabs: Resources, Media, Guides, Tactics)
/take-action             → TakeAction
/community               → CommunitySupport
/resources               → ResistanceResources
/directory               → ResistanceDirectory
/data-sources            → DataSources
/profiles                → ProfilesIndex (links to all 15 profiles)
/profiles/:slug          → Individual profile pages (15 total)
/campaigns               → Redirect → /take-action
/communications          → Redirect → /security
/tactics                 → Redirect → /education
/threats                 → Redirect → /intelligence
```

SPA routing on Cloudflare is handled by `wrangler.jsonc` (`not_found_handling: "single-page-application"`). On GitHub Pages, a `404.html` redirect handles deep links.

---

## Data Layer

All structured content lives in `src/data/` as JSON files. Components import them directly — Vite inlines the data into the JavaScript bundle at build time.

```
src/data/
├── political_prisoners_research.json     # 64 prisoners with status, dates, sources
├── sanctions_tracker.json                # 47 sanctions across US/EU/UK/CA/AU
├── sanctioned_officials_research.json    # 34 CCP officials under international sanctions
├── forced_labor_companies_research.json  # 30 companies linked to forced labor
├── detention_facilities_research.json    # 11 facilities with coordinates, capacity
├── timeline_events.json                  # 40 events from 1989–2026
├── security_center_data.json             # Security tools and recommendations
├── data_sources.json                     # RSS sources and source categories
├── academic_experts_research.json        # Expert researchers
├── human_rights_orgs_research.json       # Organizations directory
├── international_responses_research.json # Government responses
├── police_stations_research.json         # CCP overseas police stations
├── recent_news_research.json             # Recent developments
├── recent_updates.json                   # Platform changelog entries
├── emergency_alerts.json                 # Active emergency alerts
├── live_data_feeds.json                  # Live data source configurations
├── live_statistics.json                  # Live statistics data
├── educational_modules.json              # Educational content modules
├── legal_cases_research.json             # Legal cases data
└── take_action_steps.json                # Action step guides
```

### Why JSON?
- **Verifiable**: Every entry has source URLs that can be checked
- **Testable**: 3,602 automated tests validate data integrity (required fields, valid URLs, no CCP sources)
- **No runtime dependency**: Data is bundled into JavaScript — the site works offline after initial load
- **Git-auditable**: All changes go through PR review

---

## Component Architecture

### Page Layout
```
App.tsx
├── Header (navigation, language selector, mobile menu)
├── Sidebar (desktop navigation — 7 items)
├── <Routes>
│   ├── Dashboard
│   ├── IntelligenceFeeds
│   │   ├── Tab: Live Feeds (RSS aggregation)
│   │   ├── Tab: Regional Status (HK, Xinjiang, Tibet, Taiwan)
│   │   └── Tab: CCP Operations (DetentionFacilities, PoliceStationsMap)
│   ├── SecurityCenter
│   │   ├── Tab: Overview
│   │   ├── Tab: Tools
│   │   ├── Tab: Guides (ChinaExitBan, WhistleblowerGuide)
│   │   ├── Tab: Quiz
│   │   └── Tab: Report (IncidentReportForm)
│   ├── profiles/:slug → Profile pages (5-tab layout each)
│   └── ... (other pages)
└── GlobalDisclaimer (footer)
```

### Lazy Loading
All page-level components and heavy sub-components use `React.lazy()` + `<Suspense>`:
```tsx
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

### Contexts
- **LanguageContext** — 8 locales, provides `t()` translation function
- **ThemeContext** — dark theme (terminal aesthetic is the only theme)
- **SocketContext** — lightweight no-op stub (Socket.IO was removed to save 107KB)

---

## Supabase Integration (Optional)

When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured:
- `src/services/supabaseClient.ts` creates a Supabase client
- `src/services/supabaseService.ts` provides helpers for 4 form types:
  - `submitIncidentReport()` → `incident_reports` table
  - `submitVolunteerSignup()` → `volunteer_signups` table
  - `submitNewsletterSubscription()` → `newsletter_subscribers` table
  - `submitContactMessage()` → `contact_messages` table

When not configured, the client is `null` and forms display "Coming Soon" notices with links to real organizations.

---

## CCP Influence Detection

Centralized system in `src/utils/sourceLinks.ts` for detecting CCP state media:
- 21 state media outlet names (e.g., Xinhua, CGTN, People's Daily, Global Times)
- 13 blocked domains (e.g., xinhuanet.com, cgtn.com, globaltimes.cn)
- 15 elevated-risk entries requiring extra scrutiny
- 4 utility functions: `isCCPSource()`, `isElevatedRisk()`, `getSourceRiskLevel()`, `validateSources()`
- 37 dedicated tests in `src/test/ccp-influence-detection.test.ts`

---

## Testing Strategy

3,602 tests across 192 files using Vitest + jsdom + React Testing Library.

| Category | Files | What it tests |
|----------|-------|---------------|
| Data integrity | 15+ files | JSON fields, valid URLs, no CCP sources, chronological order, cross-dataset consistency |
| Component tests | 60+ files | React components render, user interactions, form submissions |
| Accessibility | 3 files | ARIA labels, keyboard nav, contrast ratios, heading hierarchy |
| Design system | 1 file | Scans all TSX for prohibited CSS patterns (8 automated checks) |
| URL health | 2 files | No CCP domains, no insecure HTTP URLs in data, HTTPS validation |
| i18n | 1 file | All 8 locales have identical key sets |
| Security | 3 files | CSP headers, WebRTC leak detection, supabase key validation |
| Performance | 3 files | Bundle size budget, performance resilience, responsive layout |
| TypeScript purity | 1 file | Enforces 0 JS/JSX files, no @ts-nocheck, strict mode |
| Services | 4 files | Supabase service, live data service, data API, source links |
| Profile pages | 15 files | All 15 profile pages render with correct data |
| Other | 80+ files | Sitemap, manifest/PWA, routes, utilities, defensive coding, import hygiene |

---

## Deployment Options

### Cloudflare Workers (Recommended)
See [CLOUDFLARE_DEPLOY.md](CLOUDFLARE_DEPLOY.md). Uses `wrangler.jsonc` for SPA routing. Global CDN, free tier.

### GitHub Pages
Configured via `.github/workflows/deploy.yml`. Sets `VITE_BASE_PATH=/global-anti-ccp-resistance-hub/` automatically. Triggered on push to `master`.

### Any Static Host
Run `npm run build` and serve the `dist/` directory. Ensure your host serves `index.html` for all routes (SPA fallback).
