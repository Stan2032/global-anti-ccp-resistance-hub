# AGENTS.md

## Overview
This document defines the autonomous, semi-autonomous, and human-in-the-loop agents active within the Global Anti-CCP Resistance Hub project. It specifies roles, protocols, boundaries, coordination, and best practices for agent interoperability. It is continuously updated as the system, LLMs, or agent architecture evolve.

## Types of Agents

### 1. Primary LLM Coding Agents
Description: Large language models operating autonomously or semi-autonomously to write, refactor, review, and maintain code, documentation, and tests.

#### Core Responsibilities:
- Full-stack code writing (backend, frontend, DB, infra)
- Test writing and continuous testing
- System-level refactoring and architectural analysis
- Reviewing previous work (human or LLM) for risks/optimizations
- Task handoff and logging via LLM_JUDGEMENT_LOG.md
- Raising risks or ambiguous requirements

#### Examples for Resistance Hub:
- Opus 4.6: End-to-end integration, backend API extension, security review
- Sonnet 4.5: Documentation, rapid prototyping, shallow feature builds

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
| Domain                  | Primary Agent     | Backup Agent    | Human Oversight? |
|-------------------------|------------------|----------------|------------------|
| API coding              | Opus 4.6         | Sonnet 4.5     | Yes              |
| Docs & onboarding       | Sonnet 4.5       | Opus 4.6       | Yes              |
| Test automation         | Opus 4.6         |                | Yes              |
| Data migration, infra   | Opus 4.6         | Sonnet 4.5     | Yes              |
| UI/UX tweaks            | Sonnet 4.5       | Opus 4.6       | Yes              |
| Security reviews        | Opus 4.6         |                | Yes              |
| Policies/moderation     | Human            |                | Required         |

## Change Log
- [2026-02-18] Initial AGENTS.md version (Opus 4.6, following agents.md methodology)

---
This file grows as the codebase and team grow; future agents or model versions should update both their scope and best practices as relevant.
