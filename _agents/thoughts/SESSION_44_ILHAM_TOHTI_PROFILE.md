# Session 44 — Ilham Tohti Profile Page

**Agent:** Opus 4.6  
**Date:** 2026-02-20  
**Focus:** Second dedicated profile page — Ilham Tohti

---

## Key Decisions

### Why Ilham Tohti Second
- TODO.md explicitly listed him as "Up Next" after Jimmy Lai (Session 43)
- Owner confirmed agent's choice for ordering (D4)
- Tohti is the most-awarded individual in the database (Sakharov, Václav Havel, Martin Ennals, PEN)
- His case is the quintessential CCP narrative-vs-reality story: advocate for dialogue sentenced as "separatist"

### Profile Architecture — Following Jimmy Lai Template

**Decision:** Create standalone page component at `src/pages/profiles/IlhamTohtiProfile.jsx` with route `/profiles/ilham-tohti`.

**Template reuse from Session 43:**
- Same 5-tab structure (Timeline, Charges, CCP Narratives, International Response, Sources)
- Same CCP Claim/Reality pattern with source tags
- Same accessibility patterns (aria-labels, keyboard navigation, role="tablist")
- Different color theme: cyan gradient header (vs Jimmy Lai's red), reflecting academic/intellectual rather than press freedom

**Customizations for Tohti's case:**
- Added `recognition` category for awards (amber color) — Tohti has 4 major awards vs Lai's focus on press freedom
- Added `advocacy` category for Uighurbiz.net and dialogue work (cyan)
- Added `academic` category for teaching career (emerald)
- Added `GraduationCap` icon to header (vs Lai's `User` icon) — reflects his academic identity
- Added "Students Also Persecuted" section under charges — unique to Tohti's case (7 students arrested)
- Added "Major Awards" banner in International Response — Tohti has more major awards than any other individual in our database

### Data Sourcing & CCP Propaganda Guard

Every fact verified against Tier 1 sources:
- HRW: https://www.hrw.org/news/2024/09/23/china-free-uyghur-economist-ilham-tohti-life-sentence
- Amnesty International: https://www.amnesty.org/en/latest/news/2024/09/china-world-leaders-must-act-to-end-decade-of-injustice-for-jailed-uyghur-academic/
- European Parliament: https://www.europarl.europa.eu/sakharovprize/en/ilham-tohti
- PEN International: https://www.pen-international.org/cases/professor-ilham-tohti
- Front Line Defenders: https://www.frontlinedefenders.org/en/case/ilham-tohti-sentenced-life-imprisonment
- Scholars at Risk: https://www.scholarsatrisk.org/2026/01/twelve-years-since-arrest-sar-calls-for-release-of-professor-ilham-tohti/
- USCIRF: https://www.uscirf.gov/religious-prisoners-conscience/forb-victims-database/ilham-tohti
- PEN America: https://pen.org/10-years-of-injustice-ilham-tohtis-daughter-on-his-lifelong-advocacy/
- UN OHCHR: https://www.ohchr.org/en/documents/country-reports/ohchr-assessment-human-rights-concerns-xinjiang-uyghur-autonomous-region

**Zero CCP state media cited anywhere.**

### Date Verification

| Date | Event | Verified via |
|------|-------|-------------|
| Oct 25, 1969 | Birth | HRW, PEN, Scholars at Risk |
| 1994 | Started at Minzu University | Scholars at Risk |
| 2006 | Founded Uighurbiz.net | HRW, Front Line Defenders |
| July 2009 | Detained after Ürümqi riots | Front Line Defenders |
| Feb 2013 | Passport confiscated, fellowship blocked | PEN America |
| Jan 15, 2014 | Arrested in Beijing | HRW, Front Line Defenders, USCIRF |
| Jul 30, 2014 | Formally charged | Front Line Defenders |
| Sep 17, 2014 | Trial begins | Front Line Defenders |
| Sep 23, 2014 | Life sentence | HRW, Amnesty, PEN, European Parliament |
| 2014 | PEN/Barbara Goldsmith Award | PEN International |
| 2016 | Martin Ennals Award | European Parliament think tank |
| Oct 7, 2019 | Václav Havel Prize | Council of Europe |
| Oct 24, 2019 | Sakharov Prize announced | European Parliament |
| Sep 2024 | 10th anniversary renewed calls | Amnesty, HRW |
| Jan 2026 | 12th anniversary renewed calls | Scholars at Risk |

### CCP Narrative Analysis — 4 Key Rebuttals

1. **"Separatist"** → Never advocated independence; advocated dialogue within Chinese constitutional framework
2. **"Fair trial"** → Two-day closed trial; shackles; incommunicado detention; UN found it arbitrary
3. **"Promoted violence"** → Zero evidence of violence advocacy; PEN analyzed writings as entirely peaceful
4. **"Vocational training"** → Mass internment of 1-1.8M Uyghurs documented as crimes against humanity; Tohti tried to prevent this

### What's Next
- Gedhun Choekyi Nyima (Panchen Lama) profile page — third profile
- Consider creating a generic profile template component after 3 profiles exist
- Add navigation links from PoliticalPrisoners page to profile pages
- Consider adding profile links from CaseStudies component
