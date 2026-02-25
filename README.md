# Global Anti-CCP Resistance Hub

🌐 **Live Site:** [https://global-anti-ccp-resistance-hub.stane203.workers.dev/](https://global-anti-ccp-resistance-hub.stane203.workers.dev/)

A comprehensive platform for documenting CCP human rights violations, supporting resistance movements, and providing tools for activists and researchers fighting against Chinese Communist Party authoritarianism.

**This is a fully static React single-page application (SPA).** All content is bundled at build time from verified JSON data files — no server or database is required to run the site. An optional [Supabase](SUPABASE_SETUP.md) integration enables form submissions (incident reports, volunteer sign-ups, newsletter, contact).

> **For Developers/Agents:** See [_agents/AGENT_ROADMAP.md](_agents/AGENT_ROADMAP.md) for current task status and [_agents/LLM_JUDGEMENT_LOG.md](_agents/LLM_JUDGEMENT_LOG.md) for decision history.

## Mission

This platform serves as a centralized resource for:

- **Documenting human rights violations** committed by the Chinese Communist Party
- **Supporting political prisoners** and their families
- **Tracking regional security threats** including Taiwan, South China Sea, and Belt and Road expansion
- **Providing secure tools** for activists and journalists operating in hostile environments
- **Aggregating intelligence** from verified sources worldwide
- **Connecting resistance movements** globally

## Features

### 15 Political Prisoner Profiles
- Jimmy Lai, Ilham Tohti, Panchen Lama, Liu Xiaobo, Joshua Wong, Gui Minhai, Agnes Chow, Nathan Law, Benny Tai, Cardinal Zen, Gao Zhisheng, Zhang Zhan, Tashi Wangchuk, Ren Zhiqiang, Xu Zhiyong
- Each profile has 5 tabs: Timeline, Charges/Significance, CCP Narrative Analysis, International Response/Legacy, Sources
- All events sourced from Tier 1-2 outlets (BBC, Reuters, HRW, Amnesty, CPJ)

### Intelligence Dashboard
- 9 RSS feed sources from trusted outlets (HKFP, RFA, Taiwan News, SCMP, BBC, HRW, Amnesty, CPJ, Guardian)
- Regional status panels for Hong Kong, Xinjiang, Tibet, and Taiwan
- CCP Operations tab with detention facility mapping and overseas police stations

### Sanctions Tracker
- 35 sanctioned individuals/entities across US, EU, UK, Canada, and Australia
- Source URLs linking to official government registries (US Treasury SDN, UK FCDO, EU Council)
- Structured JSON data in `src/data/sanctions_tracker.json`

### Political Prisoners Database
- 62 documented political prisoners with source URLs in `src/data/political_prisoners_research.json`
- Status tracking (imprisoned, disappeared, deceased)
- Action items for advocacy

### Regional Threat Assessment
- **Taiwan**: Military buildup, invasion scenarios, defense capabilities
- **South China Sea**: Artificial island militarization, territorial disputes
- **East China Sea**: Senkaku/Diaoyu tensions
- **Belt and Road Initiative**: Debt trap diplomacy cases

### CCP Tactics Documentation
- Mass surveillance technologies
- Detention and "re-education" camps — 11 documented facilities with coordinates
- Forced labor programs and supply chain tracking
- Cultural genocide methods
- Transnational repression operations (102+ overseas police stations)
- Information control and censorship

### CCP Influence Detection
- Centralized system in `src/services/sourceLinks.js`
- 21 state media names + 13 domains in the never-cite blocklist
- 15 elevated-risk entries for sources requiring extra scrutiny
- 4 utility functions, 37 dedicated tests

### Security Tools
- Client-side WebRTC leak detection (runs entirely in-browser, no external APIs)
- Links to reputable VPN/Tor self-test tools (check.torproject.org, ipleak.net, dnsleaktest.com)
- Honest security guidance — no false claims about connection detection
- EFF Surveillance Self-Defense resource integration

### Resistance Resources
- VPN and security tools directory
- Documentation and evidence collection apps
- 200+ advocacy organizations directory
- Independent media sources
- Academic research databases

### Accessibility
- Full keyboard navigation for all interactive elements
- ARIA labels on 208+ interactive elements and ARIA dialog roles on 4 modal overlays
- Screen reader support with skip links and live regions
- WCAG AA compliant text contrast (20 contrast tests)
- Escape key support on all modals

### Internationalization
- 8 language locales with 194 keys each: English, Simplified Chinese, Traditional Chinese, Vietnamese, Korean, Japanese, Uyghur, Tibetan
- Navigation and UI elements translated via machine translation
- Sensitive content marked for human volunteer translation
- Drop-in locale system for adding new languages

## Architecture

This is a **static React SPA** — all data is compiled into the JavaScript bundle at build time. There is no runtime server dependency.

```
src/
├── pages/              # 10 main pages + 15 profiles in profiles/
├── components/         # 100+ React components (lazy-loaded)
├── data/               # 17 JSON/JS data files (the source of truth)
├── services/           # Supabase client, live data service, source links
├── hooks/              # useDocumentTitle, useLiveData, useWebRTCLeakCheck
├── contexts/           # ThemeContext, LanguageContext, SocketContext (stub)
├── locales/            # 8 locale JSON files (en, zh-CN, zh-TW, vi, ko, ja, ug, bo)
└── test/               # 34 Vitest test files, 618 tests
```

### Data Flow

All structured content lives in `src/data/` as JSON files:

| File | Content | Used by |
|------|---------|---------|
| `political_prisoners_research.json` | 62 prisoners with sources | PoliticalPrisoners page |
| `sanctions_tracker.json` | 35 sanctions entries | SanctionsTracker component |
| `detention_facilities_research.json` | 11 facilities with coordinates | DetentionFacilities component |
| `sanctioned_officials_research.json` | CCP officials under sanctions | SanctionedOfficials component |
| `forced_labor_companies_research.json` | Companies linked to forced labor | ForcedLaborTracker component |
| `timeline_events.json` | 31 events (1989–2026) | InteractiveTimeline component |
| `confucius_institutes_research.json` | Confucius Institutes data | ConfuciusInstitutes component |
| `security_center_data.json` | Security tools & recommendations | SecurityCenter page |
| `data_sources.json` | 11 RSS sources + 4 source categories | DataSources page |

Components import JSON directly — Vite bundles it at build time. No API calls needed for core content.

### Design System (Terminal/ASCII Aesthetic)

| Token | Tailwind Class | Hex | Usage |
|-------|---------------|-----|-------|
| Page background | `bg-[#0a0e14]` | `#0a0e14` | Darkest surface |
| Card surface | `bg-[#111820]` | `#111820` | Cards, sidebar, header |
| Border | `border-[#1c2a35]` | `#1c2a35` | All borders, dividers |
| Terminal green | `text-[#4afa82]` | `#4afa82` | Active states, links, accents |
| Terminal dim | `text-[#2a9a52]` | `#2a9a52` | Hover states |
| Terminal cyan | `text-[#22d3ee]` | `#22d3ee` | Info highlights |

**Rules:** No `rounded-lg` or `rounded-xl` (square corners only). No `bg-gradient-to-*`. Headings use `font-mono`. Buttons use `$ command_name` syntax. See [STYLE_GUIDE.md](_agents/STYLE_GUIDE.md) for complete reference.

## Technology Stack

### Frontend (Static SPA)
- **React 19** with **Vite 7** — fast builds, hot module replacement
- **TailwindCSS 3** for styling (terminal/ASCII aesthetic)
- **Framer Motion** for animations
- **React Router v7** for client-side navigation
- **Lucide React** for icons
- **Custom i18n** system with JSON locale files (8 languages, 194 keys each)

### Optional Integrations
- **Supabase** — PostgreSQL database for form submissions (incident reports, volunteer sign-ups, newsletter, contact). See [SUPABASE_SETUP.md](SUPABASE_SETUP.md). Without Supabase, forms display "Coming Soon" notices with links to real organizations.

### Backend (Not Deployed)
A Node.js/Express backend exists in `backend/` but is **not required** — the static SPA works independently. The backend is intended for future server-side features (API, RSS feed polling, admin dashboard). See [API Endpoints](#api-endpoints-backend--not-deployed) below.

### Deployment
- **Live site**: [https://global-anti-ccp-resistance-hub.stane203.workers.dev/](https://global-anti-ccp-resistance-hub.stane203.workers.dev/)
- **Recommended**: Cloudflare Workers — see [CLOUDFLARE_DEPLOY.md](CLOUDFLARE_DEPLOY.md) for step-by-step guide
- **Also supported**: GitHub Pages (via `.github/workflows/deploy.yml`), Vercel, Netlify
- Base path configurable via `VITE_BASE_PATH` environment variable

## Quick Start

### Prerequisites
- Node.js 18+ (20 recommended)
- npm

### Development
```bash
git clone https://github.com/Stan2032/global-anti-ccp-resistance-hub.git
cd global-anti-ccp-resistance-hub
cp .env.example .env    # Optional — only needed for Supabase integration
npm install
npm run dev             # Start dev server at http://localhost:5173
```

### Build
```bash
npm run build           # Produces dist/ (~305KB main bundle, 97KB gzipped)
npm run preview         # Preview production build locally
```

### Testing
```bash
npm test                # Run all 618 tests across 34 files
npm run test:watch      # Watch mode for development
```

### Deploy
```bash
npm run deploy          # Build + deploy to Cloudflare Workers (requires wrangler auth)
```

### Backend (Optional — Not Required for Static Site)
```bash
cd backend
npm install
cp .env.example .env
# Configure PostgreSQL connection and other environment variables
npm start
```

## API Endpoints (Backend — Not Deployed)

> **Note:** These endpoints are part of the Express backend in `backend/` and are **not deployed** as part of the static site. They are documented here for future development.

### Intelligence API (`/api/v1/intelligence`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sources` | GET | List verified intelligence sources |
| `/databases` | GET | Research databases and resources |
| `/tactics` | GET | CCP tactics documentation |
| `/prisoners` | GET | Political prisoners list |
| `/prisoners/:name` | GET | Specific prisoner details |
| `/officials` | GET | Sanctioned CCP officials |
| `/analyze` | POST | Analyze text for CCP relevance |
| `/threats/overview` | GET | Regional threats summary |
| `/threats/taiwan` | GET | Taiwan threat assessment |
| `/threats/south-china-sea` | GET | SCS assessment |
| `/belt-and-road` | GET | BRI debt trap data |
| `/united-front` | GET | UFWD operations |
| `/cyber` | GET | Cyber warfare data |

### Feed API (`/api/v1/feeds`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | List feed items with filters |
| `/sources` | GET | List feed sources |
| `/stats` | GET | Feed statistics |
| `/:id` | GET | Single feed item |
| `/:id/share` | POST | Track shares |
| `/poll` | POST | Trigger immediate poll (admin) |

## Data Sources

### Verified Intelligence Sources
1. **BBC** — International news coverage of China/Hong Kong
2. **Reuters / AP** — Wire service reporting
3. **Human Rights Watch** — Global human rights monitoring
4. **Amnesty International** — Political prisoner documentation
5. **Radio Free Asia** — Uyghur, Tibetan, Hong Kong coverage
6. **Hong Kong Free Press** — Independent Hong Kong journalism
7. **Committee to Protect Journalists** — Press freedom monitoring
8. **CECC** — Congressional-Executive Commission on China
9. **The Guardian** — Investigative reporting

### Research Databases
- ASPI Xinjiang Data Project (380+ detention facilities mapped)
- Xinjiang Victims Database (35,000+ documented victims)
- CECC Political Prisoner Database (10,000+ prisoners)
- Dui Hua Political Prisoner Database (50,000+ records)
- UHRP US Sanctions Tracker

### Source Standards
- **Tier 1 (Gold)**: BBC, Reuters, AP, HRW, Amnesty, CPJ, UN OHCHR, government records
- **Tier 2 (Reliable)**: HKFP, RFA, NCHRD, Safeguard Defenders, The Guardian, NYT, WaPo, RSF
- **Never cite**: Xinhua, CGTN, People's Daily, Global Times, China Daily, Ta Kung Pao, Wen Wei Po — these are CCP state media

## Security Considerations

This platform is designed with security and honesty in mind for users who may be operating in hostile environments:

- No user tracking or analytics
- No cookies beyond essential functionality
- Compatible with Tor browser
- **Honest security approach**: The platform does not claim to detect VPNs, Tor, or connection status. Instead, it provides links to reputable third-party self-test tools.
- Client-side WebRTC leak detection (no data sent to servers)
- Content Security Policy headers configured for Cloudflare Pages
- Does not store user data

**Warning**: If you are in China or communicating with people in China, please use secure communication tools. Visit the **Security Center** on the site for verified tools and guides. The CCP monitors internet traffic and may target activists.

## Contributing

We welcome contributions from researchers, developers, and activists. Data changes are moderated via GitHub PR review from trusted contributors. See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Priority Areas
- **Translation volunteers needed**: Native speakers of Chinese (Simplified/Traditional), Uyghur, and Tibetan to review and translate sensitive content. Machine translations are used for navigation only — human translators are essential for accuracy on human rights topics.
- Additional political prisoner profiles with verifiable sources
- Integration with additional verified data sources
- Sanctions tracker updates (US/EU/UK/Canada/Australia)

See also: [STYLE_GUIDE.md](_agents/STYLE_GUIDE.md) for design conventions, [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for database setup, [CLOUDFLARE_DEPLOY.md](CLOUDFLARE_DEPLOY.md) for deployment.

## License

This project is open source under the MIT License.

## Acknowledgments

This platform builds upon the work of countless human rights organizations, journalists, and activists who risk their lives to document CCP abuses. We honor their courage and dedication.

### Key Organizations
- Amnesty International
- Human Rights Watch
- Uyghur Human Rights Project
- Hong Kong Watch
- International Campaign for Tibet
- China Human Rights Defenders
- Safeguard Defenders

## Disclaimer

This platform aggregates publicly available information from verified sources. The views expressed in aggregated content belong to their original authors. This platform does not advocate for violence or illegal activities.

---

**"The only thing necessary for the triumph of evil is for good men to do nothing."** - Edmund Burke

Stand with the oppressed. Document the truth. Resist authoritarianism.
