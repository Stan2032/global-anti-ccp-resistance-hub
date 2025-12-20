# Issues and Blockers - Global Anti-CCP Resistance Hub

## Last Updated: December 20, 2025

---

## ✅ CURRENT STATUS: Application Fully Functional

All pages tested and working:
- Dashboard with real-time statistics
- Political Prisoners page (6 documented cases)
- Regional Threats page (Taiwan, SCS, ECS, BRI)
- Resistance Resources page (VPNs, advocacy, reporting)
- Intelligence Feeds with live/static toggle
- All other existing pages functional

---

## 🔴 BLOCKERS (Require User Input)

### 1. GitHub Pages Deployment
**Status:** Blocked - needs environment configuration
**Error:** "The deployment was rejected or didn't satisfy other protection rules"
**Details:** 
- GitHub Actions workflow created and pushed
- Build step completes successfully
- Deploy step blocked by environment protection rules

**Required Action:** User needs to:
1. Go to repository Settings → Environments → github-pages
2. Remove or modify protection rules
3. Re-run the workflow from Actions tab

### 2. Alternative Deployment Options
| Platform | Status | Action Required |
|----------|--------|-----------------|
| GitHub Pages | Workflow ready | Configure environment |
| Vercel | Not connected | User OAuth login |
| Netlify | Not attempted | User OAuth login |

---

## 🟢 COMPLETED WORK (This Session)

### New Frontend Pages:
- [x] **PoliticalPrisoners.jsx** - Profiles of Jimmy Lai, Ilham Tohti, Gao Zhisheng, Zhang Zhan, Gedhun Choekyi Nyima, Liu Xiaobo
- [x] **RegionalThreats.jsx** - Taiwan invasion scenarios, SCS militarization, ECS disputes, BRI debt traps
- [x] **ResistanceResources.jsx** - VPN tools, advocacy organizations, reporting channels, emergency contacts

### Backend Enhancements:
- [x] **ccpViolationsData.js** - Comprehensive CCP tactics documentation
- [x] **regionalThreats.js** - Taiwan threat assessment, naval buildup data
- [x] **intelligence.js** - New API endpoints for threats, prisoners, cyber warfare

### Frontend Improvements:
- [x] Updated **App.jsx** with new routes and error boundary
- [x] Updated **Sidebar.jsx** with Human Rights section
- [x] Fixed Header component undefined securityLevel bug
- [x] SocketContext for singleton connections (memory leak fix)

### Documentation:
- [x] Comprehensive **README.md** with full project documentation
- [x] API endpoint documentation
- [x] Security considerations

### Previous Session Work:
- [x] RSS Feed Service (ICIJ, RFA, HKFP, ASPI)
- [x] Simplified feed scheduler (no Redis required)
- [x] Socket.IO real-time broadcasting
- [x] Database migrations for feed tables
- [x] LiveFeed, FeedSourceSelector, FeedStats components

---

## 📊 FEATURE SUMMARY

### Political Prisoners Database
| Name | Status | Urgency |
|------|--------|---------|
| Jimmy Lai | Imprisoned | URGENT |
| Ilham Tohti | Imprisoned | URGENT |
| Gao Zhisheng | Disappeared | URGENT |
| Zhang Zhan | Imprisoned | URGENT |
| Gedhun Choekyi Nyima | Disappeared | URGENT |
| Liu Xiaobo | Deceased | - |

### Regional Threats Covered
| Region | Threat Level | Status |
|--------|--------------|--------|
| Taiwan | SEVERE | CRITICAL |
| South China Sea | HIGH | CONTESTED |
| East China Sea | HIGH | CONTESTED |
| Belt and Road | MEDIUM | EXPANDING |

### Resource Categories
- VPN & Security Tools (Tor, Signal, ProtonVPN, Tails, Psiphon)
- Documentation Tools (eyeWitness, ProofMode, Wayback Machine)
- Advocacy Organizations (Amnesty, HRW, UHRP, HK Watch, ICT, CHRD)
- Reporting Channels (UN HRC, CECC, Xinjiang Victims DB, Safeguard Defenders)
- Independent Media (RFA, HKFP, China Digital Times, Bitter Winter)
- Research Institutions (ASPI, Jamestown, CSIS, MERICS)

---

## 🔧 TECHNICAL NOTES

### Build & Test Commands:
```bash
# Frontend build
cd /home/ubuntu/global-anti-ccp-resistance-hub
pnpm build

# Local testing (without base path)
pnpm vite build --base=/
npx serve dist -l 8080 -s

# Backend start
cd backend
node src/server.js
```

### Repository Status:
- Branch: `branch-3`
- Latest commit: `ae31287` (Add comprehensive resistance features)
- PR #1: branch-3 → master (open)
- All changes pushed to GitHub

### Exposed URLs (temporary):
- Frontend: https://8080-iwz6ydsx638uavegvwzx2-790435eb.manusvm.computer/
- Backend: https://3000-iwz6ydsx638uavegvwzx2-790435eb.manusvm.computer/

---

## 📋 FUTURE ENHANCEMENTS (Suggestions)

### High Priority:
1. Add more political prisoner profiles (expand from 6 to 50+)
2. Integrate real-time news API (NewsAPI, GDELT)
3. Add global search functionality
4. Implement user accounts for saved preferences

### Medium Priority:
5. Multi-language support (Chinese, Uyghur, Tibetan)
6. Interactive maps for detention facilities
7. Mobile app (React Native)
8. Push notifications for urgent alerts

### Low Priority:
9. Data visualization dashboards
10. API rate limiting for public access
11. TypeScript migration
12. Automated testing suite

---

## 📞 DEPLOYMENT ASSISTANCE

When user is ready to deploy:

### Option A: GitHub Pages (Recommended)
1. Go to https://github.com/Stan2032/global-anti-ccp-resistance-hub/settings/pages
2. Ensure "GitHub Actions" is selected as source
3. Go to Settings → Environments → github-pages
4. Remove protection rules or add branch-3 to allowed branches
5. Re-run workflow from Actions tab

### Option B: Vercel
1. Go to https://vercel.com/new
2. Import GitHub repository
3. Build command: `pnpm build`
4. Output directory: `dist`

### Option C: Netlify
1. Go to https://app.netlify.com/drop
2. Drag and drop the `dist` folder
3. Or connect GitHub for automatic deploys

---

*This document tracks progress on the Global Anti-CCP Resistance Hub project.*
