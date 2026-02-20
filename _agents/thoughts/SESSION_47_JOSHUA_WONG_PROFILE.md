# Session 47 — Joshua Wong Profile Page
**Date:** 2026-02-20  
**Agent:** Opus 4.6  
**Task:** Build fifth dedicated profile page — Joshua Wong (imprisoned, ongoing persecution)

## Key Decisions

### 1. Why Joshua Wong Next?
Per TODO.md and Session 46 recommendations, the profile page order was:
1. Jimmy Lai ✅ (Session 43)
2. Ilham Tohti ✅ (Session 44)
3. Gedhun Choekyi Nyima ✅ (Session 45)
4. Liu Xiaobo ✅ (Session 46)
5. **Joshua Wong** ← This session
6. Gui Minhai (next)

Rationale: Joshua Wong is arguably the world's most famous young democracy activist. His case is uniquely dynamic — currently serving one sentence while facing entirely new charges designed to prevent his release. The June 2025 "collusion with foreign forces" charge is a masterclass in CCP legal weaponization.

### 2. Structural Choices — The "Youth Leader" Angle
Wong's profile required a different emphasis than the others:
- **Age context**: He was 14 when he founded Scholarism, 17 during the Umbrella Movement, 23 when Demosistō dissolved, and 24 when arrested in the HK47 sweep. His entire adult life has been defined by activism and persecution.
- **"I love Hong Kong" quote**: This moment from the November 19, 2024 sentencing is the defining image. I placed it in the profile header as the closing italic text — it serves the same rhetorical purpose as Liu Xiaobo's "I Have No Enemies."
- **Dual charges section**: Unlike other profiles with one charge, Wong has TWO separate NSL prosecutions — one concluded, one pending. The charges section needed to handle both, with clear status indicators (GUILTY vs PENDING).

### 3. Color Theme Selection
- Jimmy Lai: Blue (media/democracy)
- Ilham Tohti: Amber (academia/scholarship)
- Panchen Lama: Purple (religious/spiritual)
- Liu Xiaobo: Dark gray with gold (memorial/Nobel)
- **Joshua Wong: Yellow/gold** (youth activism, energy, urgency)

Yellow was chosen because:
- It conveys youthful energy and urgency
- It contrasts with the darker memorial themes used for Liu Xiaobo
- Wong is YOUNG and ALIVE — the profile should feel active, not somber
- The "NEW NSL CHARGE — FACES LIFE" badge in orange adds critical urgency

### 4. CCP Narrative Analysis — 4 Claims Debunked
I identified 4 core CCP narratives about Wong:

1. **"Separatist"** — False. Demosistō advocated self-determination through referendums, not independence. Scholarism was about education, not separation.
2. **"Democratic primary was subversive"** — Absurd by any democratic standard. Primary elections are normal democratic practice. 610,000 people voted.
3. **"Manipulated by foreign forces"** — Testifying before US Congress is standard human rights advocacy. The HKHRDA merely required reviews of autonomy status.
4. **"Fair trial"** — No jury. Hand-picked judges. 96% conviction rate. 3+ years pretrial detention without bail. This mirrors mainland Chinese courts, not common law.

### 5. The Nathan Law Connection
I included a dedicated section on Nathan Law because the June 2025 charges specifically name him as Wong's alleged co-conspirator. This illustrates a CCP pattern: using exiled activists as leverage against imprisoned ones. Wong stayed, Law left — and now the CCP uses Law's exile advocacy as evidence to keep Wong locked up longer.

### 6. Date Verification
| Date | Event | Verified Via |
|------|-------|-------------|
| 1996-10-13 | Birth | Multiple sources, CFHK profile |
| 2011-05-29 | Scholarism founded | TIME, BBC, CFHK |
| 2012-09-08 | MNE curriculum shelved | TIME, BBC |
| 2014-09-26 | Civic Square arrest | HKFP, BBC, Wikipedia |
| 2016-04-10 | Demosistō founded | CFHK, multiple sources |
| 2016-07-21 | Convicted of unlawful assembly | ABC News Australia |
| 2017-08-17 | Sentenced to 6 months on appeal | CNBC |
| 2018-02-06 | CFA overturns sentence | HRF press release |
| 2020-06-30 | NSL imposed, Demosistō dissolved | BBC |
| 2020-12-02 | Sentenced to 13.5 months | BBC |
| 2021-02-28 | HK47 mass arrest | Amnesty International |
| 2024-05-30 | HK47 verdict — guilty | BBC |
| 2024-11-19 | Sentenced 4y8m, shouts "I love Hong Kong" | Hong Kong Watch, WRAL, ITV |
| 2025-06-06 | New NSL collusion charge filed | Amnesty International, Global Voices, Straits Times |

### 7. Hong Kong 47 Trial Statistics
The HK47 trial statistics are devastating:
- 47 defendants, 45 convicted, 2 acquitted (96% conviction rate)
- 118 trial days with no jury
- Most defendants held without bail for 3+ years before sentencing
- Sentences: 4y2m to 10 years
- The 96% conviction rate matches mainland China's 99%+ conviction rate more than Hong Kong's pre-NSL common law standard

## Source Tier Analysis
- **Tier 1 (7 sources):** Amnesty International, BBC News, Hong Kong Watch, CFHK, TIME Magazine, HRF, US State Department
- **Tier 2 (3 sources):** HKFP, CNBC, Global Voices
- **Excluded:** Xinhua, People's Daily, CGTN, Global Times, China Daily, Ta Kung Pao, Wen Wei Po (CCP-controlled or aligned)

## Files Modified
- `src/pages/profiles/JoshuaWongProfile.jsx` — NEW (created)
- `src/App.jsx` — Added lazy import + route
- `src/hooks/useDocumentTitle.js` — Added SEO meta description
- `TODO.md` — Updated
- `agent-thoughts/SESSION_47_JOSHUA_WONG_PROFILE.md` — NEW (this file)

## Next Session Recommendations
- **Gui Minhai profile** — Next in queue. Swedish citizen kidnapped from Thailand by CCP agents. Unique case of cross-border abduction.
- **Profile index page** — Consider creating a `/profiles` landing page now that we have 5 profiles.
- **Update political_prisoners_research.json** — Joshua Wong entry needs "latest_news" updated with June 2025 collusion charge details.
