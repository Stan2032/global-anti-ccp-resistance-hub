# Contributing to the Global Anti-CCP Resistance Hub

Thank you for your interest in contributing. This project documents real human rights violations — every claim must be sourced, every date verified, and every person's story treated with dignity.

---

## Getting Started

### Development Setup

```bash
git clone https://github.com/Stan2032/global-anti-ccp-resistance-hub.git
cd global-anti-ccp-resistance-hub
npm install
npm run dev           # Start dev server at http://localhost:5173
npm test              # Run 631 tests across 34 files
npm run build         # Production build (~5s)
```

### Optional: Supabase (for form submissions)

```bash
cp .env.example .env
# Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
# See SUPABASE_SETUP.md for full instructions
```

Without Supabase, the site works fully — forms display "Coming Soon" notices with links to real organizations.

---

## What You Can Contribute

### 1. Political Prisoner Profiles

Each profile is a React component in `src/pages/profiles/` with 5 tabs:

| Tab | Content |
|-----|---------|
| **Timeline** | Chronological events with dates and source citations |
| **Charges / Significance** | Legal charges and why the case matters |
| **CCP Narrative Analysis** | How CCP state media frames the person vs. the facts |
| **International Response / Legacy** | Statements from governments, NGOs, awards received |
| **Sources** | All cited sources with clickable URLs |

**Requirements:**
- Every date cross-referenced with 2+ independent sources
- Only Tier 1-2 sources (see [Source Standards](#source-standards) below)
- Register the profile route in `src/App.jsx` and add an entry to `src/pages/profiles/ProfilesIndex.jsx`

### 2. Political Prisoner Data

Add entries to `src/data/political_prisoners_research.json`. Each entry needs:
- `name`, `status` (imprisoned/disappeared/deceased/released)
- `detention_start` date, `location`
- `charges` or reasons for detention
- `sources` array with URLs from Tier 1-2 outlets

### 3. Sanctions Tracker Updates

Add entries to `src/data/sanctions_tracker.json`. Each entry needs:
- `name` of sanctioned individual/entity
- `country` that imposed sanctions (US, EU, UK, Canada, Australia)
- `date` of designation
- `source_url` linking to the official government registry (e.g., US Treasury SDN list)
- `reason` for the sanctions

### 4. Timeline Events

Add entries to `src/data/timeline_events.json`:
- `date` (ISO format), `title`, `description`
- `sources` array with Tier 1-2 URLs
- Events should be significant milestones (not minor news items)

### 5. Translations

Locale files are in `src/locales/` (8 languages, 194 keys each). If you're a native speaker:
- Review machine-translated strings for accuracy
- **Navigation/UI strings** may be machine-translated
- **Sensitive human rights content** (profiles, victim stories) must be human-translated

### 6. Code Contributions

See the [Design System](#design-system) section for styling requirements.

---

## Source Standards

### Tier 1 (Gold) — Primary Sources
BBC, Reuters, AP, Human Rights Watch, Amnesty International, Committee to Protect Journalists (CPJ), UN OHCHR, government records (US Treasury, UK FCDO, EU Council, Canada, Australia)

### Tier 2 (Reliable) — Trusted Specialists
Hong Kong Free Press (HKFP), Radio Free Asia (RFA), Network of Chinese Human Rights Defenders (NCHRD), Safeguard Defenders, China Human Rights Defenders (CHRD), The Guardian, New York Times, Washington Post, Reporters Without Borders (RSF), Fortify Rights, OMCT, Front Line Defenders

### Never Cite — CCP State Media
Xinhua, CGTN, People's Daily, Global Times, China Daily, Ta Kung Pao, Wen Wei Po, tibet.cn, en.people.cn

The `src/services/sourceLinks.js` module contains the authoritative blocklist (21 state media names + 13 domains) and utility functions to detect CCP sources programmatically.

---

## Design System

The site uses a **terminal/ASCII aesthetic** — monospace headings, box-drawing borders, dark backgrounds with terminal green accents.

### Colors
| Token | Tailwind Class | Usage |
|-------|---------------|-------|
| Page background | `bg-[#0a0e14]` | Darkest surface |
| Card surface | `bg-[#111820]` | Cards, sidebar, header |
| Border | `border-[#1c2a35]` | All borders, dividers |
| Terminal green | `text-[#4afa82]` | Active states, links, accents |
| Terminal dim | `text-[#2a9a52]` | Hover states |
| Terminal cyan | `text-[#22d3ee]` | Info highlights |

### Prohibited Patterns
- ❌ `rounded-lg`, `rounded-xl`, `rounded-2xl` — use square corners only
- ❌ `bg-gradient-to-*` — use flat surfaces with left-border accents
- ❌ `bg-slate-*`, `border-slate-*` — use the hex values above
- ❌ Generic Lucide icons (Flag, Mountain, Landmark) for Uyghur/Tibetan flags — use SVG components from `src/components/FlagIcons.jsx`

### Required Patterns
- ✅ `font-mono` on headings
- ✅ `$ command_name` syntax on buttons
- ✅ Box-drawing borders (`──`, `╔═╗`) for decorative elements
- ✅ WCAG AA contrast ratios
- ✅ ARIA labels on all interactive elements

See [STYLE_GUIDE.md](_agents/STYLE_GUIDE.md) for the complete design system reference.

---

## Testing

```bash
npm test                              # Run all 631 tests
npx vitest run src/test/FILE_NAME     # Run specific test file
npm run test:watch                    # Watch mode
```

### Test Categories
- **Data integrity**: Verify JSON data files have required fields, valid URLs, no CCP sources
- **Accessibility**: ARIA labels, keyboard navigation, contrast ratios
- **Component tests**: React Testing Library tests for interactive components
- **Design system**: Scan all JSX files for prohibited CSS patterns
- **URL health**: Verify no CCP domains or insecure HTTP URLs in source data
- **i18n**: All 8 locale files have the same 194 keys

### Writing Tests
- Place test files in `src/test/` with `.test.js` or `.test.jsx` extension
- Use the bulk-scan pattern for file-scanning tests (collect violations in array, assert empty) — not per-file `it()` blocks
- See `src/test/design-system.test.js` and `src/test/url-health.test.js` for reference

---

## Pull Request Process

1. **Fork** the repository and create a feature branch
2. Make your changes with **small, focused commits**
3. Ensure `npm test` passes and `npm run build` succeeds
4. Open a PR with a clear description of what you changed and why
5. Data changes (prisoners, sanctions, profiles) will be verified by maintainers against source URLs before merging

---

## Values

- **Truth**: Every claim sourced, every date verified
- **Transparency**: Honest about limitations (forms that don't work say so, statistics labeled as illustrative)
- **Dignity**: The people documented here are real — treat their stories with respect
- **Security**: Users of this site may be in danger — never compromise their safety
- **Accessibility**: Information should be usable by everyone, regardless of ability or language
