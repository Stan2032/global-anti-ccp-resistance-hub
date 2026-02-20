# Session 43 — Jimmy Lai Profile Page

**Agent:** Opus 4.6  
**Date:** 2026-02-20  
**Focus:** First dedicated profile page — Jimmy Lai

---

## Key Decisions

### Why Jimmy Lai First
- Most recent sentencing (Feb 9, 2026) — most timely and newsworthy
- Most verified data already in the codebase (CaseStudies.jsx, political_prisoners_research.json)
- Owner said "choose any order" — this is the recommendation from Sessions 34-42

### Profile Page Architecture

**Decision:** Create standalone page component at `src/pages/profiles/JimmyLaiProfile.jsx` with route `/profiles/jimmy-lai`.

**Why this over other approaches:**
- Considered: Adding tabs to CaseStudies.jsx → rejected (would bloat an already-loaded component)
- Considered: Generic `ProfilePage.jsx` with data props → too early to generalize (only 1 profile so far; will create template when we have 2-3)
- Chosen: Standalone per-person page → allows deep content customization per individual, CCP narrative analysis varies per case

### Data Sourcing & CCP Propaganda Guard

Every fact in the profile is sourced from Tier 1 sources (BBC, HKFP, CPJ, HRW, Amnesty, RSF).

**CCP narrative rebuttals:** I wrote 4 specific CCP claims and their sourced rebuttals:
1. "Foreign agent" claim → rebutted with press freedom standards
2. "Propaganda tool" claim → rebutted with 26 years of legitimate journalism
3. "Fair trial" claim → rebutted with no-jury, designated judges, NSL incompatibility
4. "Judicial leniency" claim → rebutted with 20-years-at-78 being effectively life

**Zero CCP state media cited anywhere** in the profile. Explicit statement at the top of the narrative analysis section.

### Date Verification
- Birth date: Dec 8, 1947 — verified via BBC, CPJ, Britannica
- Apple Daily founding: June 20, 1995 — verified via CPJ, HKFP
- Arrest: Aug 10, 2020 — verified via BBC, HRW
- Apple Daily closure: June 24, 2021 — verified via BBC, HKFP
- Conviction: Dec 15, 2025 — verified via BBC, HRW, CPJ
- Sentencing: Feb 9, 2026 — verified via BBC, HRW, US State Dept

### UI Design Choices
- Tab-based navigation (Timeline, Charges, CCP Narratives, International Response, Sources)
- Color-coded timeline categories (Personal=blue, Business=green, Political=amber, Legal=red)
- Expandable timeline entries to keep initial view clean
- CCP Claim/Reality pattern — red header for claims, green for reality, with source tags
- "How You Can Help" section with concrete actions

---

## What's Next
- Build Ilham Tohti profile page (template from Jimmy Lai)
- Build Gedhun Choekyi Nyima (Panchen Lama) profile page
- Consider creating a generic ProfilePage template after 2-3 profiles exist
- Add link from PoliticalPrisoners page to profile pages
