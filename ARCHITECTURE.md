# Architecture — Static Site Overview

The Global Anti-CCP Resistance Hub is a **static React single-page application (SPA)** built with Vite 7, React 19, and Tailwind CSS. All content is bundled at build time from JSON data files — no server is required to serve the site.

---

## Build Pipeline

```
src/data/*.json ─────┐
src/pages/*.jsx ─────┤   npm run build     dist/
src/components/*.jsx ─┼─  ────────────── →  ├── index.html
src/locales/*.json ──┤   (Vite + Rollup)   ├── assets/
src/index.css ───────┘                     │   ├── index-*.js      (305KB / 97KB gzip)
                                           │   ├── index-*.css     (86KB / 15KB gzip)
                                           │   ├── vendor-react-*  (11KB)
                                           │   ├── vendor-router-* (35KB)
                                           │   ├── vendor-motion-* (116KB)
                                           │   └── [81 lazy chunks]
                                           └── (static assets)
```

### Key Build Features
- **Manual chunks**: React, React Router, and Framer Motion split into cacheable vendor bundles
- **Lazy loading**: 81 sub-components loaded on demand (all page bundles under 50KB)
- **Base path**: Configurable via `VITE_BASE_PATH` env var — defaults to `/` for Cloudflare, set to `/global-anti-ccp-resistance-hub/` for GitHub Pages

---

## Routing

React Router v7 handles all client-side navigation. Routes are defined in `src/App.jsx`.

```
/                        → Dashboard
/intelligence-feeds      → IntelligenceFeeds (3 tabs: Live Feeds, Regional, CCP Ops)
/political-prisoners     → PoliticalPrisoners
/security-center         → SecurityCenter (5 tabs, includes ChinaExitBan)
/educational-resources   → EducationalResources (7 tabs, includes ConfuciusInstitutes)
/take-action             → TakeAction
/community-support       → CommunitySupport
/resistance-resources    → ResistanceResources
/resistance-directory    → ResistanceDirectory
/data-sources            → DataSources
/profiles                → ProfilesIndex (links to all 15 profiles)
/profiles/:slug          → Individual profile pages (15 total)
```

SPA routing on Cloudflare is handled by `wrangler.jsonc` (`not_found_handling: "single-page-application"`). On GitHub Pages, a `404.html` redirect handles deep links.

---

## Data Layer

All structured content lives in `src/data/` as JSON files. Components import them directly — Vite inlines the data into the JavaScript bundle at build time.

```
src/data/
├── political_prisoners_research.json     # 62 prisoners with status, dates, sources
├── sanctions_tracker.json                # 35 sanctions across US/EU/UK/CA/AU
├── detention_facilities_research.json    # 11 facilities with coordinates, capacity
├── sanctioned_officials_research.json    # CCP officials under international sanctions
├── forced_labor_companies_research.json  # Companies linked to forced labor
├── confucius_institutes_research.json    # Confucius Institutes worldwide
├── timeline_events.json                  # 31 events from 1989–2026
├── security_center_data.json             # Security tools and recommendations
├── data_sources.json                     # RSS sources and source categories
├── academic_experts_research.json        # Expert researchers
├── human_rights_orgs_research.json       # Organizations directory
├── international_responses_research.json # Government responses
├── police_stations_research.json         # CCP overseas police stations
├── recent_news_research.json             # Recent developments
├── ccpTactics.js                         # CCP tactics documentation
├── researchData.js                       # General research data
└── liveDataSources.js                    # Live data source configurations
```

### Why JSON?
- **Verifiable**: Every entry has source URLs that can be checked
- **Testable**: 630 automated tests validate data integrity (required fields, valid URLs, no CCP sources)
- **No runtime dependency**: Data is bundled into JavaScript — the site works offline after initial load
- **Git-auditable**: All changes go through PR review

---

## Component Architecture

### Page Layout
```
App.jsx
├── Header (navigation, language selector, mobile menu)
├── Sidebar (desktop navigation)
├── <Routes>
│   ├── Dashboard
│   ├── IntelligenceFeeds
│   │   ├── Tab: Live Feeds (RSS aggregation)
│   │   ├── Tab: Regional Status (HK, Xinjiang, Tibet, Taiwan)
│   │   └── Tab: CCP Operations (DetentionFacilities, PoliceStationsMap)
│   ├── SecurityCenter
│   │   ├── Tab: Overview
│   │   ├── Tab: Tools
│   │   ├── Tab: Exit Ban Guide (ChinaExitBan)
│   │   ├── Tab: Quiz
│   │   └── Tab: Report (IncidentReportForm)
│   ├── profiles/:slug → Profile pages (5-tab layout each)
│   └── ... (other pages)
└── GlobalDisclaimer (footer)
```

### Lazy Loading
All page-level components and heavy sub-components use `React.lazy()` + `<Suspense>`:
```jsx
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

### Contexts
- **LanguageContext** — 8 locales, provides `t()` translation function
- **ThemeContext** — dark theme (terminal aesthetic is the only theme)
- **SocketContext** — lightweight no-op stub (Socket.IO was removed to save 107KB)

---

## Supabase Integration (Optional)

When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured:
- `src/services/supabaseClient.js` creates a Supabase client
- `src/services/supabaseService.js` provides helpers for 4 form types:
  - `submitIncidentReport()` → `incident_reports` table
  - `submitVolunteerSignup()` → `volunteer_signups` table
  - `submitNewsletterSubscription()` → `newsletter_subscribers` table
  - `submitContactMessage()` → `contact_messages` table

When not configured, the client is `null` and forms display "Coming Soon" notices with links to real organizations.

---

## CCP Influence Detection

`src/services/sourceLinks.js` contains a centralized system for detecting CCP state media:
- 21 state media outlet names (e.g., Xinhua, CGTN, People's Daily, Global Times)
- 13 blocked domains (e.g., xinhuanet.com, cgtn.com, globaltimes.cn)
- 15 elevated-risk entries requiring extra scrutiny
- 4 utility functions: `isCCPSource()`, `isElevatedRisk()`, `getSourceRiskLevel()`, `validateSources()`
- 37 dedicated tests in `src/test/ccp-influence-detection.test.js`

---

## Testing Strategy

630 tests across 34 files using Vitest + jsdom + React Testing Library.

| Category | Files | What it tests |
|----------|-------|---------------|
| Data integrity | 8 files | JSON fields, valid URLs, no CCP sources, chronological order |
| Component tests | 10 files | React components render, user interactions, form submissions |
| Accessibility | 1 file | ARIA labels, keyboard nav, contrast ratios |
| Design system | 1 file | Scans all JSX for prohibited CSS patterns |
| URL health | 1 file | No CCP domains, no insecure HTTP URLs in data |
| i18n | 1 file | All 8 locales have identical key sets |
| Security | 2 files | CSP headers, WebRTC leak detection |
| Services | 2 files | Supabase service, live data service |
| Other | 8 files | Sitemap, manifest/PWA, routes, utilities |

---

## Deployment Options

### Cloudflare Workers (Recommended)
See [CLOUDFLARE_DEPLOY.md](CLOUDFLARE_DEPLOY.md). Uses `wrangler.jsonc` for SPA routing. Global CDN, free tier.

### GitHub Pages
Configured via `.github/workflows/deploy.yml`. Sets `VITE_BASE_PATH=/global-anti-ccp-resistance-hub/` automatically. Triggered on push to `master`.

### Any Static Host
Run `npm run build` and serve the `dist/` directory. Ensure your host serves `index.html` for all routes (SPA fallback).
