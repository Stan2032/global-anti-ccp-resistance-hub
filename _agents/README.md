# Agent Workspace

This folder is the centralised autonomous area for AI agents working on this project. It contains all agent documentation, decision logs, research, and planning files — everything that is not required for the site to run (backend, frontend, data).

**Future agents: organise this folder however you see fit.** This is your space.

## Quick Start

New agent? Start here:

1. **[NEXT_AGENT_PROMPT.md](./NEXT_AGENT_PROMPT.md)** — Comprehensive project context and instructions
2. **[TODO.md](./TODO.md)** — Active task list with standing instructions
3. **[STYLE_GUIDE.md](./STYLE_GUIDE.md)** — Terminal design system reference
4. **[AGENT_HANDOFF.json](./AGENT_HANDOFF.json)** — Machine-readable handoff context

## Folder Structure

```
_agents/
├── README.md                    ← You are here
├── TODO.md                      ← Active task list
├── TODO_COMPLETED.md            ← Archive of completed tasks + session history
├── AGENTS.md                    ← Agent roles and protocols
├── AGENT_HANDOFF.json           ← Machine-readable handoff (v9.8+)
├── NEXT_AGENT_PROMPT.md         ← Comprehensive prompt for new agents
├── STYLE_GUIDE.md               ← Terminal design system reference
├── research/                    ← Active research files (referenced by code)
│   ├── DATA_SOURCES.md          ← Referenced by DataSources.jsx
│   └── SOURCE_BIAS_AUDIT.md     ← Referenced by sourceLinks.js
├── planning/                    ← Active planning docs
│   └── SITE_CLEANUP_TODO.md     ← ~99% complete
├── thoughts/                    ← Per-session agent thoughts (empty — notes archived)
└── archive/                     ← 73 historical files (sessions, research, dead code)
    └── README.md                ← Index of all archived files
```

## Standing Instructions (from Human)

- **Sources:** Must not be tainted by CCP propaganda. No CCP state media (Xinhua, CGTN, People's Daily, Global Times, etc.)
- **Date verification:** Always cross-reference dates with primary sources
- **Adding people:** If well-researched and fits project goals, add without asking
- **Source tiers:** Tier 1 (major international outlets, human rights orgs) > Tier 2 (credible regional/specialist) > Tier 3 (avoid)
- **Terminology:** Always "CCP" never "CPC" — automated test enforces this

## What's NOT in This Folder

Site-running files remain in the project root:
- `src/` — Frontend source code (React/Vite)
- `backend/` — Backend server
- `public/` — Static assets
- `package.json`, `vite.config.js`, etc. — Build configuration
- `README.md` — Project README
- `ARCHITECTURE.md`, `CONTRIBUTING.md`, `CONTENT_GUIDE.md` — Project docs
