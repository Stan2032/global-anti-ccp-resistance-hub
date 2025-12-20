# Issues and Blockers - Global Anti-CCP Resistance Hub

## Last Updated: December 20, 2025

---

## 🔴 BLOCKERS (Require User Input)

### 1. GitHub Pages Deployment Failed
**Status:** Blocked
**Error:** "The deployment was rejected or didn't satisfy other protection rules"
**Details:** 
- GitHub Actions workflow runs successfully (build completes)
- Deploy step fails due to environment protection rules
- The `github-pages` environment exists but has protection rules that block automated deployment
**Required Action:** User needs to either:
  - Remove protection rules from github-pages environment in repo settings
  - Or manually approve the deployment in the Actions tab
  - Or configure the environment to allow deployments from branch-3

### 2. GitHub Token Permissions
**Status:** Partially Resolved
**Details:**
- Initial token lacked `workflows` permission - RESOLVED with new token
- Current token (ghp_rDNH...) has full permissions including workflow scope
- Push to branch-3 now works correctly

---

## 🟡 WORKAROUNDS ATTEMPTED

### Deployment Alternatives Tried:
1. ✅ GitHub Pages via GitHub Actions - workflow created but deploy blocked
2. ❌ Vercel - requires OAuth login (user started but didn't complete)
3. 🔄 Netlify Drop - not yet attempted (viable alternative)

---

## 🟢 COMPLETED WORK

### Backend Improvements:
- [x] RSS Feed Service with polling from ICIJ, RFA, HKFP, ASPI
- [x] Simplified feed scheduler (removed Bull/Redis dependency)
- [x] Socket.IO integration for real-time feed broadcasting
- [x] Feed subscription handlers (by source, category, global)
- [x] Database migration for feed_sources and feed_items tables
- [x] Relevance scoring based on CCP-related keywords

### Frontend Improvements:
- [x] SocketContext for singleton socket connections (memory leak fix)
- [x] LiveFeed component with real-time updates
- [x] FeedSourceSelector for filtering by source
- [x] FeedStats dashboard component
- [x] IntelligenceFeeds page with live/static view toggle
- [x] Error boundary implementation
- [x] Fixed Header component undefined securityLevel bug

### Repository:
- [x] All code pushed to branch-3
- [x] Pull Request #1 created (branch-3 → master)
- [x] GitHub Actions workflow for Pages deployment

---

## 📋 TODO (Can Continue Without User)

### High Priority:
- [ ] Try Netlify CLI deployment as alternative
- [ ] Enhance CCP-related keyword database for better relevance scoring
- [ ] Add more verified intelligence sources
- [ ] Create comprehensive educational content about CCP tactics

### Medium Priority:
- [ ] Add Uyghur detention facility database
- [ ] Add Hong Kong political prisoner tracking
- [ ] Add Taiwan threat assessment section
- [ ] Add South China Sea monitoring

### Low Priority:
- [ ] Internationalization (i18n) support
- [ ] Dark/light theme toggle
- [ ] Mobile app version planning

---

## 🔧 TECHNICAL NOTES

### Local Testing:
- Backend runs on port 3000 with SQLite (for testing)
- Frontend builds successfully with Vite
- Production build tested and working locally
- Socket.IO connection works when backend is running

### File Locations:
- Backend: `/home/ubuntu/global-anti-ccp-resistance-hub/backend/`
- Frontend: `/home/ubuntu/global-anti-ccp-resistance-hub/` (root)
- RSS Feed Sources: `/home/ubuntu/rss_feed_sources.md`

---

*This document will be updated as work progresses.*
