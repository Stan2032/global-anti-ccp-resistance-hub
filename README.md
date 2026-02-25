# Global Anti-CCP Resistance Hub

A comprehensive platform for documenting CCP human rights violations, supporting resistance movements, and providing tools for activists and researchers fighting against Chinese Communist Party authoritarianism.

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

### Intelligence Dashboard
- RSS feed aggregation from verified sources (ICIJ, Radio Free Asia, HKFP, ASPI)
- Relevance scoring based on CCP-related keywords
- Source attribution with clickable links to 164+ verified sources

### Political Prisoners Database
- 62 documented political prisoners with source URLs
- Status tracking (imprisoned, disappeared, deceased)
- Action items for advocacy

### Regional Threat Assessment
- **Taiwan**: Military buildup, invasion scenarios, defense capabilities
- **South China Sea**: Artificial island militarization, territorial disputes
- **East China Sea**: Senkaku/Diaoyu tensions
- **Belt and Road Initiative**: Debt trap diplomacy cases

### CCP Tactics Documentation
- Mass surveillance technologies
- Detention and "re-education" camps
- Forced labor programs and supply chain tracking
- Cultural genocide methods
- Transnational repression operations (102+ overseas police stations)
- Information control and censorship

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
- ARIA labels on 208+ interactive elements
- Screen reader support with skip links and live regions
- WCAG AA compliant text contrast

### Internationalization
- 8 language locales: English, Simplified Chinese, Traditional Chinese, Vietnamese, Korean, Japanese, Uyghur, Tibetan
- Navigation and UI elements translated via machine translation
- Sensitive content marked for human volunteer translation
- Drop-in locale system for adding new languages

## Technology Stack

### Frontend
- React 19 with Vite
- TailwindCSS for styling
- Framer Motion for animations
- React Router v7 for navigation
- Lucide React for icons (replaced 656 decorative emojis)
- Custom i18n system with JSON locale files

### Backend (optional — site works as static SPA)
- Node.js with Express
- Socket.IO for WebSocket connections
- RSS Parser for feed aggregation
- PostgreSQL for data storage

### Deployment
- **Recommended**: Cloudflare Pages (configured with `_redirects` and `_headers`)
- **Also supported**: GitHub Pages, Vercel, Netlify
- Base path configurable via `VITE_BASE_PATH` environment variable

## Installation

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Frontend Setup
```bash
cd global-anti-ccp-resistance-hub
cp .env.example .env    # Configure environment variables
npm install
npm run dev
```

### Running Tests
```bash
npm test                # Run all 535 tests
npm run test:watch      # Watch mode
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm start
```

## API Endpoints

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
1. **ICIJ** - International Consortium of Investigative Journalists
2. **Radio Free Asia** - Uyghur, Tibetan, Hong Kong coverage
3. **Hong Kong Free Press** - Independent HK journalism
4. **ASPI** - Australian Strategic Policy Institute
5. **Human Rights Watch** - Global human rights monitoring
6. **CECC** - Congressional-Executive Commission on China

### Research Databases
- ASPI Xinjiang Data Project (380+ detention facilities mapped)
- Xinjiang Victims Database (35,000+ documented victims)
- CECC Political Prisoner Database (10,000+ prisoners)
- Dui Hua Political Prisoner Database (50,000+ records)
- UHRP US Sanctions Tracker

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

We welcome contributions from researchers, developers, and activists. Data changes are moderated via GitHub PR review from trusted contributors.

### Priority Areas
- **Translation volunteers needed**: Native speakers of Chinese (Simplified/Traditional), Uyghur, and Tibetan to review and translate sensitive content. Machine translations are used for navigation only — human translators are essential for accuracy on human rights topics.
- Additional political prisoner profiles with verifiable sources
- Integration with additional verified data sources
- Mobile app development

Please see [_agents/STYLE_GUIDE.md](_agents/STYLE_GUIDE.md) for visual design and component conventions, and [_agents/research/DATA_SOURCES.md](_agents/research/DATA_SOURCES.md) for source attribution standards.

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
