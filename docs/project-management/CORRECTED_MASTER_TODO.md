# Corrected Master Todo List

**Based on:** Actual requirements analysis + conversation with Neil  
**Purpose:** Build a real-time coordination platform for anti-CCP activism  
**Core Need:** Live feeds, shocking statistics, user coordination - NOT complex caching

---

## Key Lessons Learned

1. **Don't over-engineer** - Build what's actually needed
2. **Real-time coordination ≠ Caching** - Need pub/sub, not Redis
3. **Ask better questions** - Validate requirements before building
4. **Simple first** - Add complexity only when proven necessary
5. **Focus on core value** - Shocking, verifiable data that makes people care

---

## Phase 0: Repository Cleanup & Foundation (CURRENT)

**Goal:** Clean workspace before building the right things

### 0.1 Complete Repository Reorganization ⏳ IN PROGRESS
- [ ] Finish moving redundant files to /redundant/
- [ ] Move page_texts to redundant
- [ ] Create clean /backend/, /frontend/, /docs/ structure
- [ ] Push cleaned repository to GitHub
- [ ] Verify structure is clean and navigable

**Why first:** Clean workspace prevents confusion and file loss

**Time:** 1 hour  
**Dependencies:** None

---

## Phase 1: Remove Over-Engineering (CRITICAL)

**Goal:** Remove unnecessary complexity that doesn't serve actual requirements

### 1.1 Remove Caching System
- [ ] Remove PostgreSQL caching service
- [ ] Remove cache migration (002_create_cache_table.sql)
- [ ] Remove cache tests
- [ ] Remove cache documentation
- [ ] Update userService to NOT use caching (just query database directly)
- [ ] Verify authentication tests still pass without caching

**Why:** Caching is over-engineered for current needs. Simple database queries are fast enough.

**Time:** 2 hours  
**Dependencies:** Phase 0 complete

### 1.2 Simplify Backend
- [ ] Remove unnecessary middleware
- [ ] Remove complex error handling (keep simple version)
- [ ] Keep only: authentication, basic CRUD, logging
- [ ] Document what was removed and why

**Why:** Start simple, add complexity only when needed

**Time:** 2 hours  
**Dependencies:** 1.1 complete

---

## Phase 2: Real-Time Infrastructure (CORE REQUIREMENT)

**Goal:** Build pub/sub system for live updates and user coordination

### 2.1 Choose Pub/Sub Technology
- [ ] Research options: Socket.IO vs Server-Sent Events (SSE) vs WebSockets
- [ ] Decision criteria: Simplicity, browser support, scalability
- [ ] Document decision with rationale
- [ ] **Recommendation:** Socket.IO (easiest, most features, good docs)

**Why first:** Need to choose technology before implementing

**Time:** 2 hours  
**Dependencies:** Phase 1 complete

### 2.2 Implement Socket.IO Server
- [ ] Install socket.io package
- [ ] Set up Socket.IO server in Express
- [ ] Create connection handling
- [ ] Implement basic event broadcasting
- [ ] Add authentication to socket connections (JWT)
- [ ] Test connection and disconnection

**Why:** Foundation for all real-time features

**Time:** 4 hours  
**Dependencies:** 2.1 complete

### 2.3 Implement Event System
- [ ] Design event types (new_feed_item, new_campaign, user_action, etc.)
- [ ] Create event publishing service
- [ ] Create event subscription system
- [ ] Implement room-based broadcasting (campaigns, regions, etc.)
- [ ] Add event logging
- [ ] Test event flow end-to-end

**Why:** Enables real-time coordination between users

**Time:** 6 hours  
**Dependencies:** 2.2 complete

### 2.4 Frontend Socket Integration
- [ ] Install socket.io-client in frontend
- [ ] Create socket connection hook
- [ ] Implement auto-reconnection
- [ ] Add connection status indicator
- [ ] Test real-time updates in UI
- [ ] Handle offline/online states

**Why:** Connect frontend to real-time backend

**Time:** 4 hours  
**Dependencies:** 2.3 complete

---

## Phase 3: Live Feed Aggregation (CORE FEATURE)

**Goal:** Real-time aggregation of verified sources with shocking statistics

### 3.1 RSS Feed Polling System
- [ ] Create RSS feed poller service
- [ ] Poll feeds every 5-15 minutes
- [ ] Parse and normalize feed data
- [ ] Store new items in database
- [ ] Publish events when new items arrive
- [ ] Handle feed errors gracefully

**Feeds:**
- ICIJ (International Consortium of Investigative Journalists)
- ASPI (Australian Strategic Policy Institute)
- Radio Free Asia
- Hong Kong Free Press
- Add more verified sources

**Why:** Core content source for the platform

**Time:** 8 hours  
**Dependencies:** Phase 2 complete

### 3.2 Real-Time Feed Broadcasting
- [ ] Broadcast new feed items via Socket.IO
- [ ] Implement feed filtering (by source, topic, region)
- [ ] Add "breaking news" priority system
- [ ] Create feed subscription system
- [ ] Test real-time feed updates in frontend

**Why:** Users see new information immediately

**Time:** 4 hours  
**Dependencies:** 3.1 complete

---

## Phase 4: Shocking Statistics Dashboard (CORE FEATURE)

**Goal:** Present verifiable, shocking data that makes people care

### 4.1 Data Collection & Verification
- [ ] Research shocking statistics sources:
  - Executions per day/week/month
  - New oppressive laws
  - Detained activists count
  - Surveillance expansion metrics
  - Uyghur detention numbers
  - Hong Kong arrests
  - Tibet restrictions
  - Taiwan threats
- [ ] Document sources for each statistic
- [ ] Create database schema for statistics
- [ ] Build data ingestion pipeline

**Why first:** Need accurate, verifiable data before displaying

**Time:** 12 hours  
**Dependencies:** Phase 3 complete

### 4.2 Real-Time Statistics Calculation
- [ ] Create statistics calculation service
- [ ] Calculate from database (not hardcoded)
- [ ] Update statistics in real-time
- [ ] Broadcast updates via Socket.IO
- [ ] Add historical tracking (trends over time)

**Why:** Real data, not fake numbers

**Time:** 6 hours  
**Dependencies:** 4.1 complete

### 4.3 Shocking Statistics UI
- [ ] Design impactful statistics cards
- [ ] Implement real-time counter animations
- [ ] Add source citations (clickable)
- [ ] Create "shock value" hierarchy (most impactful first)
- [ ] Mobile-optimized display
- [ ] Add share functionality

**Examples:**
- "X people executed this week" (with source)
- "X new surveillance cameras installed today"
- "X Uyghurs detained this month"
- "X days since Hong Kong's freedom was taken"

**Why:** Core value proposition - make people care

**Time:** 8 hours  
**Dependencies:** 4.2 complete

---

## Phase 5: User Coordination Features

**Goal:** Enable activists to coordinate with each other in real-time

### 5.1 User Presence System
- [ ] Track online users
- [ ] Show who's active in campaigns/regions
- [ ] Implement "typing" indicators
- [ ] Add user status (available, busy, offline)

**Why:** Users know who's available to coordinate with

**Time:** 4 hours  
**Dependencies:** Phase 2 complete

### 5.2 Real-Time Notifications
- [ ] Implement notification system via Socket.IO
- [ ] Notification types: mentions, campaign updates, feed items, etc.
- [ ] Browser push notifications (optional)
- [ ] Notification preferences
- [ ] Mark as read functionality
- [ ] Notification history

**Why:** Users stay informed of relevant updates

**Time:** 6 hours  
**Dependencies:** 5.1 complete

### 5.3 Campaign Coordination
- [ ] Real-time campaign updates
- [ ] Live participant count
- [ ] Action item completion tracking
- [ ] Campaign chat/discussion
- [ ] File sharing for campaigns
- [ ] Event scheduling

**Why:** Core coordination functionality

**Time:** 10 hours  
**Dependencies:** 5.2 complete

---

## Phase 6: Organizations & Campaigns (SIMPLIFIED)

**Goal:** Simple CRUD for organizations and campaigns

### 6.1 Organizations CRUD
- [ ] Create organization endpoints (POST, GET, PUT, DELETE)
- [ ] Organization verification system
- [ ] Organization profiles
- [ ] Contact information
- [ ] Region/country tagging
- [ ] Search and filtering

**Why:** Directory of resistance organizations

**Time:** 8 hours  
**Dependencies:** Phase 1 complete

### 6.2 Campaigns CRUD
- [ ] Create campaign endpoints
- [ ] Campaign creation flow
- [ ] Campaign updates
- [ ] Progress tracking
- [ ] Member management
- [ ] Campaign status (active, completed, paused)

**Why:** Coordinate active campaigns

**Time:** 8 hours  
**Dependencies:** 6.1 complete

---

## Phase 7: Community Support (SIMPLIFIED)

**Goal:** Mutual aid network for activists

### 7.1 Support Requests
- [ ] Create support request system
- [ ] Request types (legal, relocation, financial, mental health)
- [ ] Urgency levels
- [ ] Volunteer matching
- [ ] Status tracking
- [ ] Privacy controls

**Why:** Help activists in need

**Time:** 8 hours  
**Dependencies:** Phase 6 complete

### 7.2 Volunteer Network
- [ ] Volunteer registration
- [ ] Skills/expertise tagging
- [ ] Availability tracking
- [ ] Match volunteers to requests
- [ ] Rating system

**Why:** Connect helpers with those in need

**Time:** 6 hours  
**Dependencies:** 7.1 complete

---

## Phase 8: Education & Security (SIMPLIFIED)

**Goal:** Training resources and security tools

### 8.1 Education Modules
- [ ] Module database
- [ ] Module content (text, video, resources)
- [ ] Progress tracking
- [ ] Completion certificates
- [ ] Module categories

**Why:** Educate activists

**Time:** 6 hours  
**Dependencies:** Phase 6 complete

### 8.2 Security Tools
- [ ] VPN/Tor detection (REAL, not fake)
- [ ] Security assessment quiz
- [ ] Security tool recommendations
- [ ] Emergency procedures
- [ ] Secure communication guides

**Why:** Protect activists

**Time:** 8 hours  
**Dependencies:** 8.1 complete

---

## Phase 9: Search & Discovery

**Goal:** Find relevant content quickly

### 9.1 Global Search
- [ ] Full-text search across all content
- [ ] Search organizations, campaigns, feeds, modules
- [ ] Search filters and facets
- [ ] Search results ranking
- [ ] Search history

**Why:** Users find what they need

**Time:** 8 hours  
**Dependencies:** Phase 6-8 complete

---

## Phase 10: Admin Panel

**Goal:** Manage platform content and users

### 10.1 Admin Dashboard
- [ ] User management
- [ ] Content moderation
- [ ] Organization verification
- [ ] Campaign approval
- [ ] Statistics overview
- [ ] Audit logs viewer

**Why:** Platform management

**Time:** 10 hours  
**Dependencies:** Phase 9 complete

---

## Phase 11: Testing & Quality

**Goal:** Ensure everything works

### 11.1 Backend Tests
- [ ] Test all API endpoints
- [ ] Test real-time events
- [ ] Test authentication
- [ ] Test data integrity
- [ ] Load testing
- [ ] Security testing

**Time:** 12 hours  
**Dependencies:** Phase 10 complete

### 11.2 Frontend Tests
- [ ] Component tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Mobile testing
- [ ] Browser compatibility

**Time:** 10 hours  
**Dependencies:** 11.1 complete

---

## Phase 12: Production Deployment

**Goal:** Deploy to production

### 12.1 Infrastructure Setup
- [ ] Choose hosting (Vercel, Railway, AWS, etc.)
- [ ] Set up database (managed PostgreSQL)
- [ ] Configure environment variables
- [ ] Set up SSL certificates
- [ ] Configure CDN

**Time:** 6 hours  
**Dependencies:** Phase 11 complete

### 12.2 Deployment
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Configure DNS
- [ ] Set up monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Set up analytics

**Time:** 4 hours  
**Dependencies:** 12.1 complete

### 12.3 Launch
- [ ] Final testing in production
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation update
- [ ] Announcement

**Time:** 4 hours  
**Dependencies:** 12.2 complete

---

## Summary

### Total Phases: 13 (0-12)
### Total Estimated Time: ~200 hours (5 weeks full-time)

### Critical Path:
1. **Phase 0:** Clean repository (1h)
2. **Phase 1:** Remove over-engineering (4h)
3. **Phase 2:** Real-time infrastructure (16h) ← MOST IMPORTANT
4. **Phase 3:** Live feeds (12h)
5. **Phase 4:** Shocking statistics (26h) ← CORE VALUE
6. **Phase 5:** User coordination (20h)
7. **Phases 6-12:** Features, testing, deployment (121h)

### What Changed from Previous Plan:
- ❌ **Removed:** Complex caching system (unnecessary)
- ❌ **Removed:** Over-engineered error handling
- ✅ **Added:** Real-time pub/sub (Socket.IO)
- ✅ **Added:** Shocking statistics dashboard (core feature)
- ✅ **Added:** Live feed aggregation with real-time updates
- ✅ **Simplified:** Everything else

### Key Principles:
1. **Build what's needed, not what's cool**
2. **Real-time coordination > Caching**
3. **Simple first, complex later**
4. **Shocking data that makes people care**
5. **Verifiable sources for everything**

---

## Next Steps

**START HERE:**
1. Complete Phase 0 (repository cleanup) - 1 hour
2. Phase 1.1: Remove caching system - 2 hours
3. Phase 2.1: Choose pub/sub technology - 2 hours
4. Phase 2.2: Implement Socket.IO - 4 hours

**Then continue sequentially through phases.**

---

**Last Updated:** December 11, 2024  
**Status:** Ready to execute  
**Based on:** Actual requirements, not assumptions
