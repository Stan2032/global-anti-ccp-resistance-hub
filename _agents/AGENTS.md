# AGENTS.md

## Overview
This document defines the autonomous, semi-autonomous, and human-in-the-loop agents active within the Global Anti-CCP Resistance Hub project. It specifies roles, protocols, boundaries, coordination, and best practices for agent interoperability. It is continuously updated as the system, LLMs, or agent architecture evolve.

## Types of Agents

### 1. Primary LLM Coding Agents
Description: Large language models operating autonomously or semi-autonomously to write, refactor, review, test, and maintain code and documentation.

#### Core Responsibilities:
- Full-stack code writing (backend, frontend, DB, infra)
- Test writing and continuous testing
- System-level refactoring and architectural analysis
- Reviewing previous work (human or LLM) for risks/optimizations
- Task handoff and logging via AGENT_HANDOFF.json
- Raising risks or ambiguous requirements

Note: Per-session model tracking was removed because agents cannot reliably self-identify their model. The project owner primarily uses Opus 4.6. All agents follow the same standing instructions regardless of model.

### 2. Human Collaborators
Primary roles: Product owner, maintainers, project contributors.

#### Core Responsibilities:
- Reviewing and approving LLM output
- Defining project direction, ethical guidelines, and governance
- Data verification and human-in-the-loop approval (critical for claims, moderation, etc)
- Infrastructure oversight and operational security

### 3. Specialized/Narrow Agents (optional/future)
If needed, create purpose-limited sub-agents for specific domains:
- TestAgent (automated regression testing)
- DataCurationAgent (scrape/verify organizations)
- RiskAlertAgent (scan PRs/issues for sensitive data or vulnerabilities)

## Protocols for Collaboration
- All agents must log critical actions and decision rationales in PRs or LLM_JUDGEMENT_LOG.md
- Handoffs between agents/models must include context and recommendations
- No agent should exceed their domain or execute high-risk ops (e.g., destructive DB migration) without human confirmation
- Agents always defer policy/ethics to humans

## Best Practices
- Favor small, testable, reversible changes
- Prefer explicit, documented reasoning in complex/hard-to-reverse tasks
- Flag "unknowns" or design dilemmas clearly for team discussion
- Optimize each workflow for the most competent agent (LLM or human) available
- Iterate: update AGENTS.md and LLM_JUDGEMENT_LOG.md as new agents or approaches are added

## Current Agent Assignment Table

| Domain | Human Oversight? | Notes |
|---|---|---|
| API coding & backend | Yes | Complex multi-step logic, security implications, database design |
| Fact verification & date checking | Yes | Requires cross-referencing multiple sources, detecting propaganda influence |
| CCP narrative analysis (profile pages) | Yes | Requires understanding of CCP disinformation tactics |
| Security reviews & CSP | Yes | Security-critical decisions, threat modeling |
| Test automation & data integrity tests | Yes | Designing test assertions requires understanding what matters |
| UI/UX implementation & design system | Yes | Consistent Tailwind class application, layout work |
| Documentation & onboarding | Yes | Structured writing, consistency |
| i18n translations (UI strings only) | Yes | Sensitive content should NOT be machine-translated |
| Data entry (adding prisoners/sanctions) | Yes | Requires source verification |
| Profile page creation | Yes | Content requires fact verification and narrative analysis |
| Performance optimization | Yes | Code splitting, lazy loading |
| Accessibility (WCAG/ARIA) | Yes | Standard patterns, contrast checks |
| Source URL verification | Yes | Requires judgment on source credibility |
| Policies/moderation/ethics | Required | Ethical decisions must not be delegated to AI |

### Task Complexity Guide

**High-judgment tasks** (require careful reasoning):
- Cross-referencing information across multiple sources
- Detecting CCP propaganda or narrative influence in sources
- Making security-sensitive decisions (CSP, XSS, input sanitization)
- Understanding complex codebases for refactoring
- Verifying factual claims against independent evidence
- Building complex multi-file features (backend APIs, database schemas)

**Mechanical tasks** (standard patterns):
- Rapid, iterative UI changes across many files
- Consistent application of design system patterns
- Writing structured documentation and handoff notes
- Mechanical code changes (find-and-replace, pattern application)
- Quick prototyping and scaffolding
- i18n string translations (navigation-level only)

**No agent should:**
- Machine-translate sensitive human rights content (needs volunteer translators)
- Make policy or ethical decisions
- Cite sources without verification
- Fabricate dates, statistics, or quotes
- Remove working code unless explicitly required

## Known Issues & Troubleshooting

### CodeQL Testing Limitation (Discovered: 2026-02-20)

**Issue:** The `codeql_checker` tool reports "No code changes detected" when running on branches with only documentation changes, leading to ambiguous "0 fails" output that can be misinterpreted as security validation.

**Root Cause:** CodeQL is designed to analyze only changed code files (diff-based analysis for efficiency). When no JavaScript/TypeScript/Python/Java code files are modified, CodeQL skips analysis entirely.

**Impact:** 
- Agents may incorrectly believe code has been security-validated when no analysis actually ran
- Creates false sense of security for documentation-only PRs
- Wastes time re-running a tool that won't produce results

**Identification:** Watch for this exact message from `codeql_checker`:
```
No code changes detected for languages that CodeQL can analyze, so no analysis was performed.
```

**Current Workarounds:**
1. **Pre-check before running CodeQL:**
   ```bash
   git diff origin/master --name-only | grep -E '\.(js|jsx|ts|tsx|py|java)$'
   ```
   If this returns no files, CodeQL won't run.

2. **Alternative security validation for documentation-only changes:**
   - Run `npm audit` for dependency vulnerabilities
   - Run ESLint with security rules
   - Manual code review of changed areas
   - Note in PR description: "No CodeQL analysis (documentation-only changes)"

3. **Periodic full security baseline:**
   - Schedule quarterly full security audits
   - Document security baseline in project docs
   - Track "last full scan" date

**OPEN CHALLENGE:**
This limitation needs a better solution. Potential approaches to investigate:
- Force full codebase analysis option
- Hybrid approach: diff analysis + periodic full scans  
- Alternative security scanning tools that don't require diffs
- Custom wrapper that validates code changes exist before calling CodeQL

See LLM_JUDGEMENT_LOG.md Session 25 for detailed investigation findings and inspiration.

**Agent Responsibilities:**
- **All agents:** Don't misinterpret "0 fails" - always verify analysis actually ran

---

## Change Log
- [2026-03-01] Removed per-session model tracking — agents cannot reliably self-identify their model (Session 133)
- [2026-02-24] Expanded agent assignment table with detailed capability notes
- [2026-02-20] Added CodeQL troubleshooting section
- [2026-02-18] Initial AGENTS.md version

---
This file grows as the codebase and team grow; future agents or model versions should update both their scope and best practices as relevant.
