# Content Guide

Standards for all content on the Global Anti-CCP Resistance Hub.
Every fact, statistic, and claim on this site can directly impact the lives
of activists, dissidents, and political prisoners. Accuracy is non-negotiable.

---

## Terminology

### Required: Use "CCP" (Chinese Communist Party)

- ✅ **CCP** — always use this term
- ❌ **CPC** (Communist Party of China) — never use; this is the CCP's preferred
  English name, designed to dilute search results and normalize the regime
- This is enforced by an automated test across all source files

### Other Terminology

| Use This | Not This | Reason |
|----------|----------|--------|
| CCP | CPC | See above |
| Concentration camps | Vocational training centers | CCP euphemism |
| Forced labor | Labor transfer programs | CCP euphemism |
| Surveillance state | Social management | CCP euphemism |
| Political prisoner | Criminal offender | CCP framing |
| East Turkestan (when used by Uyghurs) | N/A | Respect self-determination |
| National Security Law crackdown | Safeguarding national security | CCP framing |

---

## Statistics

### Single Source of Truth

All frequently cited statistics are centralized in `src/data/statistics.js`.
**Import from there** — do not hardcode numbers in component files.

```javascript
import { STATISTICS } from '../data/statistics';

// Use in template:
`${STATISTICS.uyghurDetention.value} Uyghurs detained`
// → "1-3 million Uyghurs detained"
```

### Current Key Statistics

| Key | Value | Context |
|-----|-------|---------|
| `uyghurDetention` | 1-3 million | Detained in internment camps since 2017 |
| `surveillanceCameras` | 600+ million | In China's surveillance networks |
| `overseasPoliceStations` | 100+ | In 53 countries |
| `confuciusInstitutes` | 500+ | Worldwide (many now closed) |
| `forcedLabor` | 1+ million | In forced labor programs |
| `organHarvesting` | Proven beyond reasonable doubt | China Tribunal 2019 |

### Updating Statistics

1. Edit `src/data/statistics.js` — change it in ONE place
2. Update the `lastVerified` date
3. Run tests: `npx vitest run src/test/statistics.test.js`
4. All components importing from this file update automatically

### Rules for Statistics

- Every number must cite **at least 2 independent sources**
- Use ranges when sources disagree (e.g., "1-3 million" not "2 million")
- Include `lastVerified` date in ISO format
- Never round up for dramatic effect — accuracy over impact
- When a statistic changes, update the central file, not individual components

---

## Source Verification

### Three-Tier System

**Tier 1 — Primary Sources (Gold Standard)**
Required for all critical claims (deaths, detentions, sentences, sanctions).

- Government records: US Treasury (OFAC), UK FCDO, EU Council, Canadian Parliament, Australian DFAT
- International bodies: UN OHCHR, ICC, ICJ
- Major wire services: Reuters, Associated Press, AFP
- Established human rights organizations: Human Rights Watch, Amnesty International, CPJ

**Tier 2 — Specialist Sources (Reliable)**
Trusted for context, analysis, and regional expertise.

- Radio Free Asia (RFA), Hong Kong Free Press (HKFP)
- Safeguard Defenders, NCHRD, CHRD, UHRP
- Academic institutions: ASPI, Jamestown Foundation, Hoover Institution
- Quality journalism: BBC, Guardian, NYT, WaPo, The Economist

**Tier 3 — Never Cite**
CCP state media and propaganda outlets. These are blocked site-wide.

- Xinhua, CGTN, People's Daily, Global Times, China Daily
- Ta Kung Pao, Wen Wei Po, tibet.cn, en.people.cn
- Centralized blocklist: `src/services/sourceLinks.js`

### Verification Requirements

- Cross-reference all dates with **2+ independent sources**
- Political prisoner profiles require verification against CECC database
- Sanctions entries need official government registry links
- No fabricated statistics, quotes, or dates — ever

---

## Content Types

### Political Prisoner Profiles

Each profile must include 5 sections:
1. **Timeline** — Key life events with verified dates
2. **Charges** — Official charges and sentence details
3. **CCP Narrative Analysis** — What the CCP claims vs. verified reality
4. **International Response** — Sanctions, statements, advocacy
5. **Sources** — Tier 1/2 sources with links

### Incident Reports

- Focus on facts, not speculation
- Include location, date, type of incident
- Cite the reporting source
- Note if the information is unverified or developing

### Advocacy Content (Letter Templates, Social Media)

- Must be factually accurate
- Statistics should import from `src/data/statistics.js`
- Tone: Urgent but measured — avoid sensationalism
- Always include actionable next steps

---

## Tone & Style

### Voice

- **Authoritative**: Cite sources, use precise language
- **Respectful**: Treat all victims with dignity
- **Urgent but measured**: The facts speak for themselves
- **Accessible**: Write for a global audience, avoid jargon

### What to Avoid

- Sensationalism or emotional manipulation
- Speculation presented as fact
- Dehumanizing language about any group
- Content that could endanger specific individuals
- Unverified claims without proper caveats

---

## Translations

- **Navigation UI**: May use machine translation (8 supported locales)
- **Sensitive content** (victim names, legal terms, human rights terminology):
  Must be reviewed by native speakers
- Translation files: `src/locales/`

---

## Security Considerations for Content

- **Never publish** real-time locations of activists at risk
- **Never publish** information that could identify anonymous sources
- **Always recommend** secure communication tools (Signal, ProtonMail, Tor)
- **Default to anonymity** for any user-submitted content
- See [BACKEND_GUIDE.md](BACKEND_GUIDE.md) for data handling security

---

## Adding New Content

1. **Verify sources** against the three-tier system above
2. **Import statistics** from `src/data/statistics.js` (don't hardcode)
3. **Check terminology** (CCP not CPC, proper euphemism alternatives)
4. **Run tests**: `npx vitest run` — automated checks catch common issues
5. **Follow design system**: See `_agents/STYLE_GUIDE.md` for visual standards

---

## Quick Reference

```
CCP not CPC                          ← Automated test enforces
Statistics from src/data/statistics.js ← Single source of truth
2+ sources for every claim            ← Cross-reference required
Never cite CCP state media            ← Blocklist in sourceLinks.js
Accuracy over impact                  ← Facts speak for themselves
```
