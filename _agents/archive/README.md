# The Road We Traveled

> *"Those who cannot remember the past are condemned to repeat it."* - George Santayana

This archive contains historical planning documents, early architectural decisions, and research notes that shaped the Global Anti-CCP Resistance Hub into what it is today.

These files are preserved for:
- Understanding why certain design decisions were made
- Learning from past approaches
- Historical reference and documentation
- Preventing reinvention of already-explored ideas

## Contents

### Phase 0 Planning (Early Architecture)
- `PHASE_0_API_SPECIFICATION.md` - Original API design
- `PHASE_0_DATABASE_SCHEMA.md` - Original database schema
- `PHASE_0_SECURITY_ARCHITECTURE.md` - Security planning
- `PHASE_0_TECHNOLOGY_STACK.md` - Technology choices

### Strategic Planning
- `IMPLEMENTATION_ROADMAP.md` - Original implementation plan
- `MASTER_TODO_LIST.md` - Early comprehensive TODO
- `WIDE_RESEARCH_PLAN.md` - Research methodology
- `OUTREACH_STRATEGY.md` - Community outreach planning

### Audits & Verification
- `FUNCTIONAL_AUDIT_FINDINGS.md` - Feature audit results
- `VERIFICATION_RESULTS.md` - Testing verification
- `DEPLOYMENT_SUCCESS.md` - Deployment milestones
- `WORK_SUMMARY.md` - Work completed summaries

### Research & Analysis
- `REDIS_ALTERNATIVES_RESEARCH.md` - Database alternatives research
- `resistance_hub_strategic_plan.md` - Strategic planning
- `leaked_info_networks.md` - Research on information networks
- `resistance_research_findings.md` - General research findings

### Completed Planning (Archived Feb 26, 2026 — Session 110)
- `SIMULATED_DATA_CLEANUP_TODO.md` - All 5/5 JSON migrations completed
- `SITE_WIDE_TODO.md` - Superseded by TODO.md + SITE_CLEANUP_TODO.md
- `AGENT_ROADMAP.md` - Superseded by TODO.md current sprint
- `SESSION_SUMMARY_FEB18.md` - Superseded by session notes + AGENT_HANDOFF.json

### Completed Audits (Archived Feb 26, 2026 — Session 110)
- `FABRICATION_GAP_AUDIT.md` - One-time fabrication audit, all findings resolved
- `INVESTIGATION_SUMMARY.md` - Executive summary of fabrication audit
- `AUDIT_INTERNAL_SUMMARY.md` - Internal codebase audit, findings acted on
- `CODEBASE_AUDIT_SUMMARY.md` - Codebase status check, findings acted on

### Session Notes (Sessions 33-48, Archived Feb 26, 2026)
These individual session notes are summarized in `_agents/thoughts/SESSION_83_97_COMPREHENSIVE_NOTES.md`:
- `SESSION_33_VERIFICATION_NOTES.md` - Political prisoner data verification
- `SESSION_34_VERIFICATION_NOTES.md` - Sanctioned officials verification
- `SESSION_35_OPUS46_CONTINUATION.md` - Full context review
- `SESSION_36_FORM_HONESTY_FIXES.md` - Form honesty fixes
- `SESSION_37_COMMUNITY_STATS_FIX.md` - Community stats honesty
- `SESSION_38_PERFORMANCE_OPTIMIZATION.md` - Lazy loading
- `SESSION_39_PERFORMANCE_PHASE2.md` - Performance phase 2
- `SESSION_40_SEO_META_DESCRIPTIONS.md` - Per-route SEO
- `SESSION_43_JIMMY_LAI_PROFILE.md` - Jimmy Lai profile page
- `SESSION_44_ILHAM_TOHTI_PROFILE.md` - Ilham Tohti profile page
- `SESSION_45_PANCHEN_LAMA_PROFILE.md` - Panchen Lama profile page
- `SESSION_46_LIU_XIAOBO_PROFILE.md` - Liu Xiaobo memorial page
- `SESSION_47_JOSHUA_WONG_PROFILE.md` - Joshua Wong profile page
- `SESSION_48_HANDOFF_PREPARATION.md` - Handoff preparation

### Frozen Logs & Answered Questions (Archived Feb 26, 2026 — Session 111)
- `CHANGELOG.md` - Full changelog through Session 35 (1,778 lines). Not updated since; superseded by AGENT_HANDOFF.json session blocks
- `LLM_JUDGEMENT_LOG.md` - AI decision log through Session 35 (1,972 lines). Historical record of model decisions and reasoning
- `QUESTIONS_FOR_HUMANS.md` - All questions answered. Standing instructions (e.g. "agents may add people without asking") captured in NEXT_AGENT_PROMPT.md

### Session Notes (Sessions 72-82, Archived Feb 26, 2026 — Session 111)
These individual session notes are summarized in `_agents/thoughts/SESSION_83_97_COMPREHENSIVE_NOTES.md`:
- `SESSION_72_OPUS46_DATA_QUALITY.md` - Data quality audit & agent documentation
- `SESSION_75_OPUS46_TIMELINE_COMPLETION.md` - Timeline gap completion
- `SESSION_78_OPUS46_MERGE_PREPARATION.md` - Merge preparation & handoff
- `SESSION_81_82_SONNET4_SUPABASE_PROFILES_CLOUDFLARE.md` - Supabase integration, 3 new profiles, Cloudflare fix

### Superseded Documentation
- `README_COMPREHENSIVE.md` - Replaced by current README
- `ISSUES_AND_BLOCKERS.md` - Historical issues (resolved)
- `PLATFORM_FEATURES_SUMMARY.md` - Superseded by current docs

### Build Tooling Artifacts
- `create_placeholders.sh` - One-time script used to scaffold initial page components (historical only)

### Superseded Research (Archived Feb 26, 2026 — Session 112)
- `SITE_STRUCTURE_ANALYSIS.md` - Described old 14-page layout with pages that have since been merged/redirected (RegionalThreats, CampaignHubs, SecureComms, CCPTactics). Current structure captured in AGENT_HANDOFF.json

### Dead Code & Unused Components (Archived Feb 26, 2026 — Session 113)
- `confucius_institutes_research.json` - 41KB Confucius Institute research data (50 entries). Never imported by any component — ConfuciusInstitutes.jsx uses inline data. Useful reference for future integration.
- `EmptyState.jsx` - Reusable empty-state UI component with animations. Never wired into any page. Ready to use when needed.
- `SourceCitation.jsx` - Source citation display component with expandable details. Never imported by other components. Ready for future integration.

### Dead Socket Infrastructure (Archived Feb 26, 2026 — Session 114)
- `SocketContext.jsx` - Lightweight no-op stub for WebSocket context. socket.io-client was removed (Session ~96) and no component ever imported useSocket. SocketProvider wrapper removed from App.jsx. Restore when real WebSocket backend is deployed.
- `useSocket.js` - Complete WebSocket hook library (useSocket, useSocketRoom, useSocketEvent, etc). Never imported by any component after socket.io removal. Ready to restore for real-time features.

### Dead UI Components (Archived Feb 26, 2026 — Session 115)
- `Card.jsx` - Generic card UI component (71 lines). Zero imports anywhere in codebase. Useful pattern for future standardized card layouts.
- `LoadingScreen.jsx` - Animated loading screen with motion effects and rotating icons (96 lines). Never imported — App.jsx defines a simpler inline version. Richer animations available for future use.

### Completed Research (Archived Feb 26, 2026 — Session 120)
These research files were completed and their findings integrated into the codebase. Kept as reference for future ethical-alternatives features:
- `ALTERNATIVES_RATINGS.md` - China exposure ratings for alternative brands (426 lines). Criteria applied but no frontend component references this file.
- `CHINA_EXPOSURE_CRITERIA.md` - Rating methodology for China exposure levels (310 lines). Historical criteria — integrated into research approach.
- `DEMOCRATIC_BRANDS_RESEARCH.md` - Expanded research on brands manufactured in democratic countries (270 lines). Not yet integrated into any component.
- `ETHICAL_ALTERNATIVES_RESEARCH.md` - Zero-China-manufacturing alternatives (148 lines). Not yet integrated into any component.
- `DATA_VERIFICATION_LOG.md` - Accuracy audit log with direct source links (543 lines). Historical record of all verified claims. New verifications tracked in session notes.

### Session Notes (Sessions 83-106, Archived Feb 26, 2026 — Session 120)
Comprehensive notes covering Sessions 83-106. Superseded by AGENT_HANDOFF.json (v9.8+) which captures all relevant context:
- `SESSION_83_97_COMPREHENSIVE_NOTES.md` - 15 sessions of reasoning, patterns, anti-patterns, and lessons learned across profile pages, design system, security, and data migrations.
- `SESSION_98_106_NOTES.md` - 9 sessions covering orphan cleanup, dead code removal, file audits, and documentation consolidation.

---

*Originally archived: January 7, 2026*
*Last updated: February 26, 2026 (Session 120)*

*"The journey of a thousand miles begins with a single step." - Lao Tzu*
