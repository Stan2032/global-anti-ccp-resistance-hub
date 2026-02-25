# Session 81-82: Supabase Integration, 3 New Profiles, Cloudflare Fix

**Agent:** Sonnet 4 (GitHub Copilot Coding Agent)
**Date:** February 25, 2026
**Duration:** ~1 hour across multiple prompts

## What Was Done

### 1. Three New Profile Pages
- **Tashi Wangchuk**: Tibetan language rights advocate. Sentenced to 5 years for "inciting separatism" after NYT documentary. Released 2021, under surveillance. All Tier 1-2 sources (NYT, BBC, Reuters, Amnesty, PEN).
- **Ren Zhiqiang**: CCP insider who called Xi a "clown" over COVID response. 18 years for corruption (widely viewed as political). Sources: Reuters, BBC, NYT, CPJ.
- **Xu Zhiyong**: Legal scholar, New Citizens Movement founder. 14 years for "subversion." Sources: HRW, BBC, Reuters, NYT, Amnesty.

### 2. Supabase Integration
- Installed @supabase/supabase-js v2.97.0
- Created supabaseClient.js — returns null when VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY are not set
- Created supabaseService.js — 4 form helpers (submitIncidentReport, submitVolunteerSignup, subscribeNewsletter, submitContactMessage) + fetchRows utility
- Wired IncidentReportForm.jsx — submits to Supabase when configured, shows "Coming Soon" otherwise
- Updated CSP in _headers to allow https://*.supabase.co

### 3. Deployment Guides
- SUPABASE_SETUP.md: Click-by-click guide from dashboard to working connection. Single SQL block (tables + RLS) — no two-step confusion.
- CLOUDFLARE_DEPLOY.md: Workers & Pages → Connect Git → build settings → env vars.
- .env.example: Documents both Supabase vars.

### 4. Cloudflare Pages Build Fix
- Root cause: stale pnpm-lock.yaml from early in the project. It didn't have vitest, @testing-library/*, jsdom, @supabase/supabase-js.
- Cloudflare detected pnpm-lock.yaml, used pnpm, got frozen lockfile mismatch.
- Fix: deleted pnpm-lock.yaml. Project uses npm + package-lock.json.

### 5. Tests
- 7 Supabase service graceful-degradation tests (all operations return error when unconfigured)
- 1 CSP test for *.supabase.co in connect-src
- Total: 535→546 tests, 26→27 files

## Decisions Made
- **Newsletter upsert**: Fixed to use `ignoreDuplicates: true` instead of overwriting `subscribed_at` on re-subscribe (code review feedback).
- **Single SQL block**: Merged tables + RLS into one copy-paste instead of two separate steps, after user confusion.
- **No pnpm**: This project uses npm exclusively. pnpm-lock.yaml was a historical artifact.

## What's Next
1. Wire remaining 3 forms (VolunteerSignup, NewsDigest, Contact) to Supabase
2. Add Supabase Auth for admin dashboard
3. User needs to: run SQL in Supabase SQL Editor, then set env vars in Cloudflare
4. Typography improvements (SITE_CLEANUP_TODO.md Priority 1)
