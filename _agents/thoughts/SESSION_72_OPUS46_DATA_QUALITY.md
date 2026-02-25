# Session 72: Opus 4.6 — Data Quality Audit & Agent Documentation
**Date:** 2026-02-24  
**Agent:** Opus 4.6  
**Focus:** Data quality audit, sanctions source URLs, timeline completeness, agent capability documentation

---

## Context & Entry State
Picked up from Sessions 62-71 (Sonnet 4.5). Repository at 455 tests, 24 files, build clean, 0 lint errors.

Previous agents (Sessions 62-71) focused on:
- 6 new profile pages, design cleanup, accessibility, RSS feeds, sanctions expansion
- Infrastructure: PWA icons, sitemap fixes, CSP fixes, security headers tests
- Data integrity tests: timeline events, sitemap, manifest, security headers, prisoners, security center, CCP tactics

## Key Decisions

### 1. Sanctions Tracker Source URLs
**Decision:** Add `source_url` fields to all 35 sanctions_tracker.json entries.
**Why:** The tracker has law references but individual entries lack direct links to the government sanctions registries they were verified against. This is inconsistent with the project's principle that every claim must have a verifiable source.
**Agent fit:** Opus 4.6 — requires fact verification against government databases and source credibility assessment. Sonnet 4.5 could do the mechanical JSON editing, but Opus should verify the URLs.

### 2. Missing Timeline Event: Hong Kong Handover (July 1, 1997)
**Decision:** Add as a foundational timeline event.
**Why:** The timeline currently starts at Tiananmen (1989-06-04). The 1997 handover is critical context — it's the legal basis for "One Country Two Systems" and the reason Hong Kong's autonomy matters. Without it, the NSL events and Jimmy Lai's case lack their full legal context.
**Source verification:** BBC, Reuters, UK Government archives all document this date unambiguously.
**Agent fit:** Opus 4.6 — adding historical events requires source verification and narrative judgment about significance level. This is critical context, not a "nice to have."

### 3. Agent Capability Documentation
**Decision:** Update AGENTS.md with detailed per-task agent recommendations per the owner's request.
**Why:** The owner explicitly asked for notes on which agent should do which tasks and why. The current table is too high-level.
**Key insight from 70+ sessions of work:**
- **Opus 4.6 excels at:** Fact verification, source credibility assessment, CCP narrative analysis, security reviews, cross-referencing dates, API/backend work, complex multi-step refactoring
- **Sonnet 4.5 excels at:** Rapid UI iteration, design system application, documentation writing, test scaffolding, incremental component fixes, i18n translations
- **Neither should:** Machine-translate sensitive human rights content, make policy decisions, cite unverified sources

### 4. Data Integrity Pattern
**Observation:** The test suite now covers most data files but the sanctions tracker test doesn't verify source URLs exist (because they don't yet). After adding source_url fields, the test should be updated to verify them.

## Side Thoughts

### On Source Verification Rigor
The project has a strong foundation for source verification (Tier 1/Tier 2 system, never-cite list). But there's a gap: the **sanctions tracker** entries were "verified against official government sanctions registries" (per metadata) but don't include the actual registry URLs. This means a future agent can't independently verify the claim without re-doing the research. Adding URLs makes the verification chain transparent.

### On CCP Narrative Detection
The CCP tactics data test checks that no CCP state media is cited. But the check is name-based (checking for "xinhua", "cgtn", etc.). Sophisticated CCP influence extends to:
- Think tanks funded by CCP-linked organizations
- Academic institutions with Confucius Institute partnerships that produce favorable research
- Spamoflague-style social media campaigns that create the appearance of organic support
None of these would be caught by a simple name check. For now, the human review process is the safeguard, but worth noting for future automated detection.

### On the Timeline Gap Between 1989 and 2008
The timeline jumps from Tiananmen (1989) to Tibet protests (2008). Missing foundational events:
- 1997 Hong Kong handover (adding this session)
- 1999 Falun Gong persecution begins (already has 2006 organ harvesting report)
- Could also consider: 2001 self-immolation incident (CCP used to justify persecution), 2003 Article 23 legislation attempt in HK
These are not for this session but worth noting for future work.

## Questions (for human, non-blocking)
None this session — all work is autonomous per standing instructions.
