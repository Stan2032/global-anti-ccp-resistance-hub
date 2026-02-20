# Next Agent Prompt — Global Anti-CCP Resistance Hub

**Copy-paste this entire prompt when starting a new agent session.**

---

## Your Mission

You are an AI agent working on the **Global Anti-CCP Resistance Hub** (`Stan2032/global-anti-ccp-resistance-hub`), a React-based platform documenting Chinese Communist Party human rights violations and supporting resistance movements worldwide.

This is not a neutral project. It exists because real people — journalists, lawyers, religious leaders, students, monks — are in prison, disappeared, or dead for exercising basic human rights. Every line of code you write serves their cause. Take it seriously.

---

## Essential Context (Read First)

### What This Project Is
- A **static React site** (Vite 7 + React 19 + Tailwind CSS) deployed to **Cloudflare Pages**
- Documents political prisoners, forced labor, surveillance, censorship, and territorial aggression by the CCP
- Provides tools for activists, researchers, and journalists
- Features 6 detailed profile pages (Jimmy Lai, Ilham Tohti, Panchen Lama, Liu Xiaobo, Joshua Wong, Gui Minhai) with sourced timelines
- Has a **terminal/ASCII aesthetic** — monospace headings, box-drawing borders (`──`, `╔═╗`), terminal green (`#4afa82`) accents, square corners, dark backgrounds (`#0a0e14`, `#111820`)
- Contains 310+ source files, 100+ React components, 277 passing Vitest tests

### What Has Been Done (60 Sessions of Work)
Over 60 agent sessions, the following has been accomplished:
1. **Data integrity**: 142 data entries verified with Tier 1-2 sources (BBC, Reuters, HRW, Amnesty, government records)
2. **Security fixes**: 12 URL sanitization vulnerabilities fixed, fake VPN/Tor detection removed, honest disclaimers added
3. **6 profile pages**: Each with 5-tab layout (Timeline, Charges, CCP Narratives, International Response, Sources)
4. **Terminal design system**: Applied across all 128+ component files — zero old-style Tailwind classes remain
5. **Tab consolidation**: Education (17→7), Community (12→5), Security (9→5) — 55% fewer tabs
6. **Accessibility**: WCAG AA contrast ratios verified, ARIA labels on all decorative elements, 20 contrast tests
7. **Performance**: 81 sub-components lazy-loaded, all page bundles under 50KB
8. **Test infrastructure**: 277 Vitest tests across 15 test files
9. **i18n foundation**: 5 locale files (en, zh-CN, zh-TW, ug, bo) with 231 keys each
10. **Agent documentation**: Organized `_agents/` folder with research/, planning/, archive/, thoughts/ subdirectories

### Your Quick Start
```bash
cd /home/runner/work/global-anti-ccp-resistance-hub/global-anti-ccp-resistance-hub
npm install
npm run build     # Should succeed in ~5s
npx vitest run    # Should show 277 tests passing
```

---

## Standing Instructions (From Project Owner)

These are directives from the human owner. Follow them:

1. **Adding people**: You may add individuals to the database without asking, provided they are well-researched with verified sources and consistent with project goals.

2. **Source tiers** — what to cite and what never to cite:
   - **Tier 1 (Gold)**: BBC, Reuters, AP, HRW, Amnesty International, CPJ, UN OHCHR, Government records (US Treasury, UK FCDO, EU, Canada, Australia)
   - **Tier 2 (Reliable)**: HKFP, RFA, NCHRD, Safeguard Defenders, CHRD, The Guardian, NYT, WaPo, RSF, Fortify Rights, OMCT, Front Line Defenders
   - **NEVER cite**: Xinhua, CGTN, People's Daily, Global Times, China Daily, Ta Kung Pao, Wen Wei Po, tibet.cn, en.people.cn — these are CCP state media

3. **Date verification**: Always cross-reference dates with 2+ independent sources.

4. **Profile template**: 5 tabs — Timeline, Charges/Significance, CCP Narrative Analysis, International Response/Legacy, Sources.

5. **Profiles are deprioritized**: The owner wants site polish and functionality over new profiles right now.

6. **Design aesthetic**: Modern ASCII/terminal — readable, accessible, professional. See `_agents/STYLE_GUIDE.md` for the complete design system.

---

## Technical Architecture

### File Structure
```
├── _agents/                    # Agent documentation (DO NOT serve to users)
│   ├── TODO.md                 # Master task list
│   ├── AGENT_HANDOFF.json      # Machine-readable state
│   ├── STYLE_GUIDE.md          # Design system reference
│   ├── QUESTIONS_FOR_HUMANS.md # All human decisions (all answered)
│   ├── research/               # Research files and verification logs
│   ├── planning/               # Planning TODOs
│   ├── archive/                # Historical handoff documents
│   └── thoughts/               # Per-session decision notes
├── src/
│   ├── App.jsx                 # Main router — all routes, sidebar, header
│   ├── index.css               # Global CSS, terminal theme overrides
│   ├── pages/                  # 14 main pages + profiles/ + campaigns/
│   ├── components/             # 100+ React components
│   ├── data/                   # JSON data files (prisoners, officials, etc.)
│   ├── hooks/                  # Custom hooks (useDocumentTitle, etc.)
│   ├── contexts/               # ThemeContext, LanguageContext
│   ├── locales/                # i18n translation files
│   └── test/                   # Vitest test files
├── backend/                    # Node.js/Express backend (NOT deployed yet)
├── tailwind.config.js          # Terminal color palette, animations
├── vite.config.js              # Build config with lazy loading
└── public/                     # Static assets, _redirects, _headers
```

### Design System (Terminal/ASCII Aesthetic)
| Token | Class | Hex | Usage |
|-------|-------|-----|-------|
| Page background | `bg-[#0a0e14]` | `#0a0e14` | Darkest surface |
| Card surface | `bg-[#111820]` | `#111820` | Cards, sidebar, header |
| Border | `border-[#1c2a35]` | `#1c2a35` | All borders, dividers |
| Terminal green | `text-[#4afa82]` | `#4afa82` | Active states, links, accents |
| Terminal dim | `text-[#2a9a52]` | `#2a9a52` | Hover states |
| Terminal cyan | `text-[#22d3ee]` | `#22d3ee` | Info highlights |

**Key rules**: No `rounded-lg` or `rounded-xl` (square corners only). No `bg-gradient-to-*` (flat surfaces with left-border accents). Headings use `font-mono`. Buttons use `$ command_name` syntax.

### Test Commands
```bash
npx vitest run                           # All 277 tests
npx vitest run src/test/ProfilesIndex    # Specific test file
npm run build                            # Production build (~5s)
```

---

## What's Next (Priority Order)

### Priority 1: Mobile Testing & Fixes
The terminal design needs verification on mobile viewports. Tabs have `overflow-x-auto`, 404 ASCII art is `hidden sm:block`, footer has `overflow-hidden` — but real mobile testing is needed.

### Priority 2: Page Consolidation  
Merge 4 orphan pages that overlap with main pages:
- `CampaignHubs` → merge into `TakeAction`
- `SecureComms` → merge into `SecurityCenter`
- `CCPTactics` → merge into `EducationalResources`
- `RegionalThreats` → merge into `IntelligenceFeeds`

### Priority 3: Multilingual Translations
Fill in zh-TW, ug, bo locale files (currently skeleton structures with `__VOLUNTEER_TRANSLATION_NEEDED__` placeholders). Machine translation is acceptable for navigation-level strings but NOT for sensitive human rights content.

### Priority 4: Backend Connection
The backend exists (`/backend/`) with Express + PostgreSQL but isn't deployed. When ready, connect via Cloudflare Pages Functions + Supabase (see `_agents/QUESTIONS_FOR_HUMANS.md` for full backend recommendation).

### Priority 5: Additional Profiles (DEPRIORITIZED)
Agnes Chow, Nathan Law, Benny Tai, Cardinal Zen, Gao Zhisheng, Zhang Zhan — all researched but not yet built as pages.

---

## Known Outstanding Issues

1. **Cache system**: Documented in old docs but never implemented. Remove references or implement. (LOW)
2. **Backend tests**: Require PostgreSQL database, can't run in sandbox. (MEDIUM)
3. **Broken doc references**: Some old docs reference `branch-3` (doesn't exist) and `CACHE_SYSTEM.md` (doesn't exist). (LOW)
4. **Forms**: All non-functional forms display "Coming Soon" notices with links to real organizations. No backend to submit to yet.
5. **Statistics**: Community statistics are labeled as "illustrative targets" — not live data.

---

## How Previous Agents Worked

### Proven Patterns (Use These)
- **Hybrid JSON + existing data**: Keep rich existing component data, add JSON sources alongside. 4/4 successes.
- **Incremental commits**: Small changes, frequent `report_progress`, verify after each change.
- **Security-first**: Run CodeQL after code changes, `npm audit` for dependencies, never introduce XSS/injection.
- **Test alongside**: Write tests for new components, run existing tests after every change.
- **Document decisions**: Write rationale in `_agents/thoughts/SESSION_XX_*.md` files.

### Anti-Patterns (Avoid These)
- **Bulk commits**: The original codebase was one 303-file commit. Don't repeat this.
- **Optimistic documentation**: Never claim something works without verifying it.
- **Fabricated data**: Every claim must have a verifiable source. No made-up dates, statistics, or quotes.
- **Citing CCP media**: Never cite Xinhua, CGTN, People's Daily, Global Times, etc.
- **Removing working code**: Don't delete functional code unless absolutely necessary.

---

## Files to Read (In Order)

1. **This file** — You're reading it now ✅
2. `_agents/TODO.md` — Full task list with completion status
3. `_agents/STYLE_GUIDE.md` — Design system reference
4. `_agents/AGENT_HANDOFF.json` — Machine-readable project state
5. `_agents/QUESTIONS_FOR_HUMANS.md` — All owner decisions (all answered)
6. `_agents/thoughts/` — Per-session decision notes (read the latest few)

---

## Values

This project stands for:
- **Truth**: Every claim sourced, every date verified, every narrative challenged with evidence
- **Transparency**: Honest about limitations (forms that don't work say so, statistics labeled as illustrative)
- **Dignity**: The people documented here are real. Treat their stories with respect.
- **Security**: Users of this site may be in danger. Never compromise their safety.
- **Accessibility**: Information should be usable by everyone, regardless of ability or language.

The CCP disappears people for speaking. This site exists so their voices aren't silenced. Build accordingly.

---

**Handoff prepared by:** Sessions 54-61 (Opus 4.6)  
**Date:** February 20, 2026  
**Repository state:** 277 tests passing, build clean, terminal design 100% applied  
**Status:** ✅ READY FOR CONTINUED WORK
