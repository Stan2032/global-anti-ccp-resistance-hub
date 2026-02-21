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
- Features 12 detailed profile pages (Jimmy Lai, Ilham Tohti, Panchen Lama, Liu Xiaobo, Joshua Wong, Gui Minhai, Agnes Chow, Nathan Law, Benny Tai, Cardinal Zen, Gao Zhisheng, Zhang Zhan) with sourced timelines
- Has a **terminal/ASCII aesthetic** — monospace headings, box-drawing borders (`──`, `╔═╗`), terminal green (`#4afa82`) accents, square corners, dark backgrounds (`#0a0e14`, `#111820`)
- Contains 310+ source files, 100+ React components, 298 passing Vitest tests across 16 test files

### What Has Been Done (70 Sessions of Work)
Over 70 agent sessions, the following has been accomplished:
1. **Data integrity**: 142 data entries verified with Tier 1-2 sources (BBC, Reuters, HRW, Amnesty, government records)
2. **Security fixes**: 12 URL sanitization vulnerabilities fixed, fake VPN/Tor detection removed, honest disclaimers added, react-router updated to fix 3 CVEs
3. **12 profile pages**: Each with 5-tab layout (Timeline, Charges, CCP Narratives, International Response, Sources)
4. **Terminal design system**: Applied across all 128+ component files — zero old-style Tailwind classes remain (no bg-slate-*, no border-slate-*, no rounded-lg, no bg-gradient-to-*)
5. **Page consolidation**: 4 orphan pages merged into parent pages, 8 orphan components integrated into page tabs
6. **Accessibility**: WCAG AA contrast ratios verified, ARIA labels on all decorative elements, 20 contrast tests, ARIA dialog roles on 4 modal overlays, Escape key support
7. **Performance**: 81 sub-components lazy-loaded, all page bundles under 50KB
8. **Test infrastructure**: 298 Vitest tests across 16 test files (data integrity, accessibility, i18n, profiles, sanctions, source links)
9. **i18n**: 8 locale files (en, zh-CN, zh-TW, vi, ko, ja, ug, bo) with 194 keys each, all translated
10. **Sanctions tracker**: 35 entries across US/UK/EU/Canada/Australia in structured JSON with data integrity tests
11. **RSS feeds**: 9 feeds from trusted sources (HKFP, RFA×3, Taiwan News, SCMP, BBC, HRW, Amnesty, CPJ, Guardian)
12. **Print styles**: @media print stylesheet for A4 layout
13. **Proper flags**: SVG flag components for East Turkestan and Tibet (replaced generic Lucide icons)
14. **Agent documentation**: Organized `_agents/` folder with research/, planning/, archive/, thoughts/ subdirectories

### Your Quick Start
```bash
cd /home/runner/work/global-anti-ccp-resistance-hub/global-anti-ccp-resistance-hub
npm install
npm run build     # Should succeed in ~5s
npx vitest run    # Should show 298 tests passing across 16 test files
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

5. **Design aesthetic**: Modern ASCII/terminal — readable, accessible, professional. See `_agents/STYLE_GUIDE.md` for the complete design system.

6. **Flags**: Use proper SVG flags for Uyghur (East Turkestan/Kök Bayraq) and Tibetan (Snow Lion) — never generic Lucide icons. Flags are in `src/components/FlagIcons.jsx`.

---

## Technical Architecture

### File Structure
```
├── _agents/                    # Agent documentation (DO NOT serve to users)
│   ├── TODO.md                 # Master task list
│   ├── AGENT_HANDOFF.json      # Machine-readable state (v5.0)
│   ├── NEXT_AGENT_PROMPT.md    # This file
│   ├── STYLE_GUIDE.md          # Design system reference
│   ├── QUESTIONS_FOR_HUMANS.md # All human decisions (all answered)
│   ├── research/               # Research files and verification logs
│   ├── planning/               # Planning TODOs
│   ├── archive/                # Historical handoff documents
│   └── thoughts/               # Per-session decision notes
├── src/
│   ├── App.jsx                 # Main router — all routes, sidebar, header
│   ├── index.css               # Global CSS, terminal theme, print styles
│   ├── pages/                  # 14 main pages + profiles/
│   │   ├── profiles/           # 12 profile pages + ProfilesIndex.jsx
│   │   ├── Dashboard.jsx       # Home page
│   │   ├── IntelligenceFeeds.jsx  # 3-tab: Live Feeds, Regional Status, CCP Operations
│   │   ├── SecurityCenter.jsx  # 5-tab: includes ChinaExitBan
│   │   ├── EducationalResources.jsx  # 7-tab: includes ConfuciusInstitutes
│   │   └── ...                 # TakeAction, CommunitySupport, ResistanceResources, etc.
│   ├── components/             # 100+ React components
│   │   ├── FlagIcons.jsx       # SVG flags (EastTurkestanFlag, TibetanFlag)
│   │   ├── LanguageSelector.jsx # 8-language picker
│   │   ├── SanctionsTracker.jsx # Uses src/data/sanctions_tracker.json
│   │   └── ...
│   ├── data/                   # JSON data files
│   │   ├── sanctions_tracker.json     # 35 sanctions entries
│   │   ├── political_prisoners_research.json
│   │   ├── sanctioned_officials_research.json
│   │   └── ...
│   ├── services/
│   │   └── liveDataService.js  # 9 RSS feeds, ALWAYS_RELEVANT_SOURCES
│   ├── hooks/                  # Custom hooks (useDocumentTitle, etc.)
│   ├── contexts/               # ThemeContext, LanguageContext (8 languages)
│   ├── locales/                # i18n: en, zh-CN, zh-TW, vi, ko, ja, ug, bo
│   └── test/                   # 16 Vitest test files, 298 tests
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

**Key rules**: No `rounded-lg` or `rounded-xl` (square corners only). No `bg-gradient-to-*` (flat surfaces with left-border accents). Headings use `font-mono`. Buttons use `$ command_name` syntax. No `bg-slate-*` or `border-slate-*` anywhere.

### Test Commands
```bash
npx vitest run                           # All 298 tests (16 files)
npx vitest run src/test/ProfilesIndex    # Specific test file
npm run build                            # Production build (~5s)
```

---

## What's Next (Priority Order)

### Priority 1: Backend Connection
The backend exists (`/backend/`) with Express + PostgreSQL but isn't deployed. When ready, connect via Cloudflare Pages Functions + Supabase (see `_agents/QUESTIONS_FOR_HUMANS.md` for full backend recommendation).

### Priority 2: Remaining Orphan Components
`DetentionFacilities` and `PoliceStationsMap` are built but not integrated into any page tab yet.

### Priority 3: Content Monitoring
- Monitor Jimmy Lai appeal proceedings
- Monitor Joshua Wong NSL collusion case
- Update sanctions tracker with any new 2026 actions from US/EU/UK/Canada/Australia
- Add new political prisoner cases as they emerge

### Priority 4: Full Translation
Current 8 locales cover navigation-level UI strings (194 keys). Sensitive human rights content (profile pages, data entries) should NOT be machine-translated — needs volunteer translators.

---

## Completed (previously listed as priorities)

- ✅ **Mobile Testing & Fixes**: Mobile nav overflow fixed, tabs have overflow-x-auto, 404 ASCII art responsive
- ✅ **Page Consolidation**: 4 orphan pages removed + 8 orphan components integrated into page tabs
- ✅ **Multilingual Translations**: 8 locales (en, zh-CN, zh-TW, vi, ko, ja, ug, bo) with 194 keys each
- ✅ **Additional Profiles**: All 12 profiles built (0 coming soon)
- ✅ **Terminal Design System**: 100% complete, zero remaining old-style classes
- ✅ **Flag Icons**: Proper SVG flags for East Turkestan and Tibet
- ✅ **RSS Feeds**: 9 feeds from trusted sources with ALWAYS_RELEVANT_SOURCES
- ✅ **Sanctions Tracker**: 35 entries in structured JSON with data integrity tests
- ✅ **Security**: react-router 7.13.0 (3 CVEs fixed), clipboard error handling (9 components)
- ✅ **Accessibility**: WCAG AA verified, ARIA dialog roles on modals, Escape key support
- ✅ **Print Styles**: @media print A4 layout for profile pages

---

## Known Outstanding Issues

1. **Backend tests**: Require PostgreSQL database, can't run in sandbox. (MEDIUM)
2. **Forms**: All non-functional forms display "Coming Soon" notices with links to real organizations. No backend to submit to yet.
3. **Statistics**: Community statistics are labeled as "illustrative targets" — not live data.
4. **2 remaining orphan components**: DetentionFacilities.jsx and PoliceStationsMap.jsx are built but not integrated. (LOW)

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
- **Generic Lucide icons for flags**: Never use Flag/Mountain/Landmark icons for Uyghur/Tibetan — use proper flag SVGs from FlagIcons.jsx.

---

## Files to Read (In Order)

1. **This file** — You're reading it now ✅
2. `_agents/TODO.md` — Full task list with completion status
3. `_agents/STYLE_GUIDE.md` — Design system reference
4. `_agents/AGENT_HANDOFF.json` — Machine-readable project state (v5.0)
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

**Handoff prepared by:** Sessions 62-70 (Sonnet 4.5)  
**Date:** February 21, 2026  
**Repository state:** 298 tests passing, build clean, terminal design 100% applied, 12 profiles, 8 languages, 35 sanctions  
**Status:** ✅ READY FOR CONTINUED WORK
