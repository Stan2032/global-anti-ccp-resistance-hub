# Session 46 — Liu Xiaobo Memorial Profile Page
**Date:** 2026-02-20  
**Agent:** Opus 4.6  
**Task:** Build fourth dedicated profile page — Liu Xiaobo (posthumous)

## Key Decisions

### 1. Why Liu Xiaobo Next?
Per TODO.md and Session 45 agent-thoughts, the profile page order was:
1. Jimmy Lai ✅ (Session 43)
2. Ilham Tohti ✅ (Session 44)
3. Gedhun Choekyi Nyima ✅ (Session 45)
4. **Liu Xiaobo** ← This session
5. Joshua Wong (next)

Rationale: Liu Xiaobo is the most internationally significant Chinese political prisoner — a Nobel Peace Prize laureate who died in state custody. His case draws the most direct parallel to Nazi Germany (Carl von Ossietzky), which is a powerful analytical framework for understanding CCP authoritarianism.

### 2. Structural Adaptation for Posthumous Profile
Liu Xiaobo's profile required DIFFERENT adaptations than the living prisoners:
- **Status badge:** "DECEASED — DIED IN STATE CUSTODY" (not "IMPRISONED")
- **Color theme:** Dark gray/memorial with gold accents (Nobel Prize) — not the blue, amber, or purple used for living profiles
- **"Legacy & Impact" tab** replaces standard "International Response" — his legacy IS the response, and it's ongoing
- **"Charter 08 & Charges" tab** replaces generic "Charges" — Charter 08 is central to understanding WHY he was persecuted
- **Liu Xia section** — added to Charges tab because her persecution is inseparable from his case. She was punished solely for being his wife. 8 years of house arrest with zero charges.

### 3. Color Theme Selection
- Jimmy Lai: Blue (media/democracy)
- Ilham Tohti: Amber (academia/scholarship)
- Panchen Lama: Purple (religious/spiritual)
- **Liu Xiaobo: Dark gray with gold accents** (memorial/Nobel)

Gold was chosen because:
- The Nobel Peace Prize medal is gold
- It provides a warm contrast against the somber memorial gray
- It communicates both dignity and loss
- The dark theme reinforces that this is a memorial, not just a profile

### 4. CCP Narrative Analysis — Source Filtering
I deliberately excluded:
- en.people.cn — identified a propaganda editorial ("Liu Xiaobo's death is unfortunate, but so is the coordinated effort to...") during research. Classic CCP framing: acknowledges death while blaming international community.
- Xinhua, Global Times, CGTN, China Daily — standard state media
- All sources that frame Charter 08 as criminal rather than political

Notable: The CCP's claim that his family "voluntarily" chose sea burial for his ashes is particularly insidious. The 48-hour cremation timeline in Chinese culture is deeply suspicious — it screams coercion. The state clearly wanted to prevent any memorial site.

### 5. Date Verification
| Date | Event | Verified Via |
|------|-------|-------------|
| 1955-12-28 | Birth | NobelPrize.org, Britannica |
| 1989-06-02 | Hunger strike at Tiananmen | Britannica, BBC |
| 1989-06-06 | First arrest | NCHRD, HRW |
| 1996-10-08 | Re-education sentence | NCHRD |
| 2008-12-08 | Detained (Charter 08) | HRW, NCHRD |
| 2009-06-23 | Formally arrested | NCHRD |
| 2009-12-25 | Sentenced to 11 years | BBC, NobelPrize.org |
| 2010-10-08 | Nobel Peace Prize | NobelPrize.org |
| 2010-12-10 | Empty chair ceremony | NobelPrize.org |
| 2017-06-26 | Medical parole | HRW |
| 2017-07-13 | Death | BBC, HRW, NCHRD |
| 2017-07-15 | Sea burial | The Guardian, BBC |
| 2018-07-10 | Liu Xia leaves China | Front Line Defenders |

### 6. The "I Have No Enemies" Statement
Side thought: Liu Xiaobo's final statement is perhaps the most powerful document in modern Chinese dissident history. It's the anti-CCP because it refuses to play their game. They expected anger; he gave forgiveness. They expected divisive rhetoric; he said "I have no enemies." This is strategically brilliant because it denies the CCP the "dangerous radical" narrative they need to justify his imprisonment. It also echoes Mandela, Gandhi, and MLK — placing him in a global tradition of nonviolent resistance that the CCP cannot credibly discredit.

I included this quote prominently on the Legacy tab as the closing element because it encapsulates everything the profile is trying to communicate.

### 7. The Ossietzky Parallel
The comparison to Carl von Ossietzky (Nobel Peace Prize 1935, died under Nazi custody 1938) is not my invention — it's widely noted by Britannica, the Nobel Committee, and HRW. I included it in the profile header because it's the single most devastating factual comparison one can make about the CCP's treatment of political dissidents. This parallel should be front and center for every visitor.

## Source Tier Analysis
- **Tier 1 (9 sources):** NobelPrize.org, HRW, BBC, NCHRD, Britannica, PEN International, Freedom Now, Front Line Defenders, European Parliament
- **Tier 2 (2 sources):** The Guardian, HKFP
- **Excluded:** en.people.cn (CCP propaganda identified during research), Xinhua, People's Daily, Global Times, CGTN, China Daily

## Files Modified
- `src/pages/profiles/LiuXiaoboProfile.jsx` — NEW (created)
- `src/App.jsx` — Added lazy import + route
- `src/hooks/useDocumentTitle.js` — Added SEO meta description
- `TODO.md` — Updated
- `agent-thoughts/SESSION_46_LIU_XIAOBO_PROFILE.md` — NEW (this file)

## Next Session Recommendations
- **Joshua Wong profile** — Next in queue. Currently in prison in Hong Kong (Hong Kong 47 case).
- **Gui Minhai profile** — After Joshua Wong. Swedish citizen kidnapped from Thailand.
- **Profile index page** — Consider creating a `/profiles` landing page that lists all profiles with status indicators.
