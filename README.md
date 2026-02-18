# Global Anti-CCP Resistance Hub

> **⚠️ Repository Audit Notice (February 18, 2026)**  
> A comprehensive audit was conducted to verify work claims. **Key findings:**
> - ✅ Most work verified (90% of documented features exist)
> - ❌ Cache system missing (documented but files not present)  
> - ⚠️ Test claims unverified (cannot run without environment setup)
> 
> **For Developers/Agents:**
> - 🚀 **[Start Here: Agent Handoff Prompt](AGENT_HANDOFF_PROMPT.md)** - Complete context for next agent (27KB)
> - 📊 [Investigation Summary](INVESTIGATION_SUMMARY.md) - Quick overview
> - 📋 [Full Audit Report](FABRICATION_GAP_AUDIT.md) - Detailed findings
> - 🤖 [Agent Work Log](AGENTS.md) - Work history and protocols
> - 🔄 [Handoff Best Practices](LLM_MODEL_SWAP.md) - Model handoff guide

---

A comprehensive platform for documenting CCP human rights violations, supporting resistance movements, and providing tools for activists and researchers fighting against Chinese Communist Party authoritarianism.

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
- Real-time RSS feed aggregation from verified sources (ICIJ, Radio Free Asia, HKFP, ASPI)
- Relevance scoring based on CCP-related keywords
- Socket.IO-powered live updates

### Political Prisoners Database
- Profiles of notable political prisoners (Jimmy Lai, Ilham Tohti, Gao Zhisheng, etc.)
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
- Forced labor programs
- Cultural genocide methods
- Transnational repression operations
- Information control and censorship

### Resistance Resources
- VPN and security tools
- Documentation and evidence collection apps
- Advocacy organizations directory
- Independent media sources
- Academic research databases

## Technology Stack

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- Framer Motion for animations
- Socket.IO client for real-time updates
- React Router for navigation

### Backend
- Node.js with Express
- Socket.IO for WebSocket connections
- RSS Parser for feed aggregation
- SQLite/PostgreSQL for data storage

## Installation

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Frontend Setup
```bash
cd global-anti-ccp-resistance-hub
pnpm install
pnpm dev
```

### Backend Setup
```bash
cd backend
pnpm install
cp .env.example .env
# Configure your environment variables
pnpm start
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

This platform is designed with security in mind for users who may be operating in hostile environments:

- No user tracking or analytics
- No cookies beyond essential functionality
- Compatible with Tor browser
- Encourages use of VPNs and encrypted communications
- Does not store user data

**Warning**: If you are in China or communicating with people in China, please use secure communication tools. The CCP monitors internet traffic and may target activists.

## Contributing

We welcome contributions from researchers, developers, and activists.

### Priority Areas
- Additional political prisoner profiles
- Translation to other languages (especially Chinese, Uyghur, Tibetan)
- Mobile app development
- Integration with additional data sources
- Accessibility improvements

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
