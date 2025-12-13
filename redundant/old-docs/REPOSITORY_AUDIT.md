# Repository Audit & Cleanup Plan

**Date:** December 9, 2024  
**Purpose:** Organize repository structure for maximum usability

---

## Current State Analysis

### Directories Found
1. `/resistance-hub-backend/` - Backend API (Node.js/Express) ✅ KEEP
2. `/resistance-hub-redesigned/` - Frontend (React) ✅ KEEP (deployed version)
3. `/global-anti-ccp-resistance-hub/` - Old frontend + mixed docs ❌ REDUNDANT
4. `/upload/.recovery/` - Recovery files from previous session ❌ REDUNDANT
5. `/page_texts/` - Saved browser page texts ❌ REDUNDANT
6. Root `/home/ubuntu/` - Scattered documentation files 📝 NEEDS ORGANIZATION

---

## File Categorization

### ✅ ESSENTIAL - Backend (`/backend/`)

**Source:** `/resistance-hub-backend/`

**Keep:**
- `package.json`, `package-lock.json`
- `README.md`
- `CACHE_SYSTEM.md`
- `jest.config.js`
- `src/` directory (all code)
- `scripts/` directory
- `.env.example`
- `Dockerfile`, `docker-compose.yml`

---

### ✅ ESSENTIAL - Frontend (`/frontend/`)

**Source:** `/resistance-hub-redesigned/` (deployed at https://ccp-prop-bnzskb.manus.space)

**Keep:**
- `package.json`, `package-lock.json`
- `README.md`
- `USER_GUIDE.md`
- `index.html`
- `src/` directory (all code)
- `tailwind.config.js`, `postcss.config.js`
- `vite.config.js`, `eslint.config.js`
- `dist/` (built files)

---

### 📝 ESSENTIAL - Documentation (`/docs/`)

**Architecture & Planning:**
1. `PHASE_0_DATABASE_SCHEMA.md` - Database design ✅ KEEP
2. `PHASE_0_API_SPECIFICATION.md` - API endpoints ✅ KEEP
3. `PHASE_0_SECURITY_ARCHITECTURE.md` - Security design ✅ KEEP
4. `PHASE_0_TECHNOLOGY_STACK.md` - Tech stack decisions ✅ KEEP

**Project Management:**
5. `MASTER_TODO_LIST.md` - 127 tasks roadmap ✅ KEEP
6. `IMPLEMENTATION_ROADMAP.md` - Phase-by-phase plan ✅ KEEP
7. `FUNCTIONAL_AUDIT_FINDINGS.md` - Audit results ✅ KEEP
8. `WORK_COMPLETED_SUMMARY.md` - Progress summary ✅ KEEP

**Research:**
9. `REDIS_ALTERNATIVES_RESEARCH.md` - Caching research ✅ KEEP
10. `resistance_research_findings.md` - Organizations research ✅ KEEP
11. `expanded_organizations_database.md` - Organizations data ✅ KEEP

**Strategic:**
12. `resistance_hub_strategic_plan.md` - Overall strategy ✅ KEEP

**Deployment:**
13. `DEPLOYMENT_GUIDE.md` - How to deploy ✅ KEEP

**Collate These:**
- `DEPLOYMENT_SUCCESS.md` → Merge into `DEPLOYMENT_GUIDE.md`
- `OUTREACH_STRATEGY.md` → Merge into `resistance_hub_strategic_plan.md`
- `PLATFORM_FEATURES_SUMMARY.md` → Merge into `WORK_COMPLETED_SUMMARY.md`
- `README_COMPREHENSIVE.md` → Merge into main `README.md`
- `design_analysis_and_plan.md` + `layout_improvements_plan.md` → Merge into single `DESIGN_DECISIONS.md`
- `leaked_info_networks.md` → Merge into `resistance_research_findings.md`
- `impact_expansion_strategy.md` → Merge into `resistance_hub_strategic_plan.md`

---

### ❌ REDUNDANT - Move to `/redundant/`

**Old Frontend Version:**
- `/global-anti-ccp-resistance-hub/` (entire directory except docs already in `/docs/`)
  - Old React code
  - Outdated components
  - Old dist/ build

**Recovery Files:**
- `/upload/.recovery/` (entire directory)
  - Old propaganda analysis components
  - Old roadmap files
  - Old research notes

**Browser Page Texts:**
- `/page_texts/` (entire directory)
  - Saved browser outputs
  - Testing artifacts

**Duplicate Documentation:**
- Root level scattered `.md` files that are duplicates

**Specific Files to Move:**
1. `COMPREHENSIVE_AUDIT_PLAN.md` - Superseded by FUNCTIONAL_AUDIT_FINDINGS.md
2. `AUDIT_FINDINGS_DETAILED.md` - Duplicate
3. `POST_FIX_VERIFICATION_REPORT.md` - Superseded by WORK_COMPLETED_SUMMARY.md
4. `FINAL_AUDIT_SUMMARY.md` - Duplicate
5. `FUNCTIONAL_AUDIT_CHECKLIST.md` - Superseded
6. `todo.md` (root) - Superseded by MASTER_TODO_LIST.md
7. `todo_final_completion.md` - Superseded

---

## Proposed New Structure

```
/
├── backend/                          # Backend API (Node.js/Express)
│   ├── src/
│   │   ├── server.js
│   │   ├── db/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── utils/
│   │   └── tests/
│   ├── scripts/
│   ├── package.json
│   ├── README.md
│   ├── CACHE_SYSTEM.md
│   ├── .env.example
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── frontend/                         # Frontend (React)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   └── data/
│   ├── dist/
│   ├── package.json
│   ├── README.md
│   ├── USER_GUIDE.md
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── docs/                             # All Documentation
│   ├── architecture/
│   │   ├── DATABASE_SCHEMA.md
│   │   ├── API_SPECIFICATION.md
│   │   ├── SECURITY_ARCHITECTURE.md
│   │   └── TECHNOLOGY_STACK.md
│   ├── project-management/
│   │   ├── MASTER_TODO_LIST.md
│   │   ├── IMPLEMENTATION_ROADMAP.md
│   │   ├── FUNCTIONAL_AUDIT_FINDINGS.md
│   │   └── WORK_COMPLETED_SUMMARY.md
│   ├── research/
│   │   ├── CACHING_RESEARCH.md
│   │   ├── ORGANIZATIONS_DATABASE.md
│   │   └── ORGANIZATIONS_RESEARCH.md
│   ├── strategy/
│   │   ├── STRATEGIC_PLAN.md
│   │   └── DESIGN_DECISIONS.md
│   └── deployment/
│       └── DEPLOYMENT_GUIDE.md
│
├── redundant/                        # Archived/Old Files
│   ├── old-frontend/                 # global-anti-ccp-resistance-hub
│   ├── recovery/                     # upload/.recovery
│   ├── page-texts/                   # page_texts
│   └── superseded-docs/              # Old documentation
│
└── README.md                         # Main project README

```

---

## Collation Plan

### 1. Merge into `DEPLOYMENT_GUIDE.md`
- Add success stories from `DEPLOYMENT_SUCCESS.md`
- Add troubleshooting section

### 2. Merge into `STRATEGIC_PLAN.md`
- Add outreach strategy from `OUTREACH_STRATEGY.md`
- Add impact expansion from `impact_expansion_strategy.md`

### 3. Merge into `WORK_COMPLETED_SUMMARY.md`
- Add platform features from `PLATFORM_FEATURES_SUMMARY.md`

### 4. Create `DESIGN_DECISIONS.md`
- Merge `design_analysis_and_plan.md`
- Merge `layout_improvements_plan.md`

### 5. Merge into `ORGANIZATIONS_RESEARCH.md`
- Merge `resistance_research_findings.md`
- Merge `leaked_info_networks.md`
- Keep `expanded_organizations_database.md` separate (data file)

### 6. Rename Phase 0 docs (remove PHASE_0_ prefix)
- `PHASE_0_DATABASE_SCHEMA.md` → `DATABASE_SCHEMA.md`
- `PHASE_0_API_SPECIFICATION.md` → `API_SPECIFICATION.md`
- `PHASE_0_SECURITY_ARCHITECTURE.md` → `SECURITY_ARCHITECTURE.md`
- `PHASE_0_TECHNOLOGY_STACK.md` → `TECHNOLOGY_STACK.md`

### 7. Rename Research docs
- `REDIS_ALTERNATIVES_RESEARCH.md` → `CACHING_RESEARCH.md`
- `resistance_research_findings.md` → `ORGANIZATIONS_RESEARCH.md`
- `expanded_organizations_database.md` → `ORGANIZATIONS_DATABASE.md`
- `resistance_hub_strategic_plan.md` → `STRATEGIC_PLAN.md`

---

## Action Steps

1. ✅ Create new directory structure
2. ✅ Collate overlapping documentation
3. ✅ Move backend files to `/backend/`
4. ✅ Move frontend files to `/frontend/`
5. ✅ Organize documentation in `/docs/`
6. ✅ Move redundant files to `/redundant/`
7. ✅ Create main `README.md` with project overview
8. ✅ Push to GitHub
9. ✅ Verify structure

---

## Expected Outcome

**Clean Structure:**
- `/backend/` - All backend code
- `/frontend/` - All frontend code
- `/docs/` - All documentation, organized by category
- `/redundant/` - Archived files

**Benefits:**
- Easy navigation
- Clear separation of concerns
- No duplicate files
- Organized documentation
- Professional structure

---

**Status:** Ready to execute cleanup
