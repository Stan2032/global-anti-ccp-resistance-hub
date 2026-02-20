# Agent Workspace

This folder is the centralised autonomous area for AI agents working on this project. It contains all agent documentation, decision logs, research, and planning files — everything that is not required for the site to run (backend, frontend, data).

**Future agents: organise this folder however you see fit.** This is your space.

## Quick Start

New agent? Start here:

1. **[TODO.md](./TODO.md)** — Main task list with Quick Start section, session history, and standing instructions
2. **[AGENTS.md](./AGENTS.md)** — Agent role definitions and protocols
3. **[AGENT_HANDOFF.json](./AGENT_HANDOFF.json)** — Machine-readable handoff context (v2.0)
4. **[QUESTIONS_FOR_HUMANS.md](./QUESTIONS_FOR_HUMANS.md)** — Human Q&A log + standing instructions

## Folder Structure

```
_agents/
├── README.md                    ← You are here
├── TODO.md                      ← Main entry point for agents
├── AGENTS.md                    ← Agent roles and protocols
├── AGENT_HANDOFF.json           ← Machine-readable handoff
├── AGENT_ROADMAP.md             ← Task prioritization
├── QUESTIONS_FOR_HUMANS.md      ← Human decisions log
├── LLM_JUDGEMENT_LOG.md         ← Decision rationale (Sessions 1-7)
├── SESSION_SUMMARY.md           ← Session summaries
├── CHANGELOG.md                 ← Project changelog
├── ... (research, audit, and planning files)
├── thoughts/                    ← Per-session agent thoughts (Sessions 33-48)
│   ├── SESSION_33_VERIFICATION_NOTES.md
│   ├── SESSION_34_VERIFICATION_NOTES.md
│   └── ... (14 files)
└── archive/                     ← Historical planning docs (early sessions)
    ├── MASTER_TODO_LIST.md
    ├── IMPLEMENTATION_ROADMAP.md
    └── ... (24 files)
```

## Standing Instructions (from Human)

- **Sources:** Must not be tainted by CCP propaganda. No CCP state media (Xinhua, CGTN, People's Daily, Global Times, etc.)
- **Date verification:** Always cross-reference dates with primary sources
- **Adding people:** If well-researched and fits project goals, add without asking
- **Source tiers:** Tier 1 (major international outlets, human rights orgs) > Tier 2 (credible regional/specialist) > Tier 3 (avoid)

## What's NOT in This Folder

Site-running files remain in the project root:
- `src/` — Frontend source code (React/Vite)
- `backend/` — Backend server
- `public/` — Static assets
- `package.json`, `vite.config.js`, etc. — Build configuration
- `README.md` — Project README
- `organizations-data.json` — Site data
