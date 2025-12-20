# Master Todo List - Resistance Hub Redesigned
**Complete Implementation Roadmap (Dependency-Ordered)**  
**Created:** December 3, 2025  
**Philosophy:** Build foundations first, minimize backtracking through proactive planning

---

## Overview

This todo list is ordered by **logical dependencies** rather than priority. Each completed task enables subsequent tasks. The list is designed to minimize backtracking by building proper foundations upfront and thinking ahead about future needs.

**Total Tasks:** 127  
**Estimated Time:** 380 hours (12 weeks full-time)  
**Phases:** 7 (Foundation → Features → Polish)

---

## PHASE 0: PLANNING & ARCHITECTURE (Week 1)

### 0.1 Database Design & Schema Planning

**Why First:** Everything depends on database structure. Getting this right prevents massive rework later.

- [ ] **0.1.1** Create comprehensive database schema document
  - Define all tables needed for entire platform
  - Include user, authentication, campaigns, intelligence, messages, progress, etc.
  - Document relationships and constraints
  - Plan for scalability and future features
  - **Deliverable:** schema.sql file with full schema
  - **Time:** 8 hours
  - **Future-proofing:** Include fields for future features (notifications, analytics, audit logs)

- [ ] **0.1.2** Design user roles and permissions system
  - Define role types (admin, moderator, user, activist, organizer, helper)
  - Document permission matrix
  - Plan for role-based access control (RBAC)
  - **Deliverable:** roles_permissions.md
  - **Time:** 4 hours
  - **Future-proofing:** Design extensible so new roles can be added without schema changes

- [ ] **0.1.3** Design API endpoint structure
  - Map all endpoints needed for entire platform
  - Define request/response formats
  - Plan versioning strategy
  - Document authentication requirements
  - **Deliverable:** api_specification.md
  - **Time:** 6 hours
  - **Future-proofing:** Design for pagination, filtering, sorting from the start

- [ ] **0.1.4** Design security architecture
  - Plan authentication flow (JWT, refresh tokens, sessions)
  - Plan authorization strategy
  - Plan data encryption strategy
  - Plan rate limiting and DDoS protection
  - **Deliverable:** security_architecture.md
  - **Time:** 6 hours
  - **Future-proofing:** Design for future compliance needs (GDPR, etc.)

- [ ] **0.1.5** Design real-time communication architecture
  - Plan WebSocket strategy
  - Plan message queue strategy
  - Plan notification system architecture
  - **Deliverable:** realtime_architecture.md
  - **Time:** 4 hours
  - **Future-proofing:** Design for horizontal scaling

- [ ] **0.1.6** Create technology stack document
  - Finalize backend framework and versions
  - Finalize database and versions
  - Finalize caching strategy
  - Finalize file storage strategy
  - **Deliverable:** tech_stack.md
  - **Time:** 2 hours

**Phase 0 Total Time:** 30 hours

---

## PHASE 1: BACKEND INFRASTRUCTURE (Weeks 2-3)

### 1.1 Project Setup & Configuration

**Why Second:** Need proper infrastructure before writing feature code.

- [ ] **1.1.1** Initialize Node.js/Express backend project
  - Create project structure
  - Set up package.json with all dependencies
  - Configure ESLint and Prettier
  - Set up .env configuration
  - **Deliverable:** Working Node.js project
  - **Time:** 3 hours

- [ ] **1.1.2** Set up PostgreSQL database
  - Install PostgreSQL locally
  - Create database and user
  - Run schema migrations
  - Verify all tables created correctly
  - **Deliverable:** Running PostgreSQL with schema
  - **Time:** 2 hours

- [ ] **1.1.3** Set up Redis cache
  - Install Redis locally
  - Configure Redis connection
  - Test connection
  - **Deliverable:** Running Redis instance
  - **Time:** 1 hour

- [ ] **1.1.4** Configure environment variables
  - Create .env.example with all variables
  - Document all configuration options
  - Set up environment-specific configs (dev, staging, prod)
  - **Deliverable:** .env configuration system
  - **Time:** 2 hours

- [ ] **1.1.5** Set up logging system
  - Implement structured logging (Winston or Pino)
  - Configure log levels
  - Set up log rotation
  - **Deliverable:** Logging system
  - **Time:** 2 hours
  - **Future-proofing:** Design for centralized logging (ELK stack)

- [ ] **1.1.6** Set up error handling middleware
  - Create global error handler
  - Implement error logging
  - Create error response format
  - **Deliverable:** Error handling system
  - **Time:** 2 hours

### 1.2 Database Layer

**Why Before Features:** All features need database access.

- [ ] **1.2.1** Create database connection pool
  - Set up connection pooling
  - Configure pool settings
  - Test connection reliability
  - **Deliverable:** Database connection module
  - **Time:** 2 hours

- [ ] **1.2.2** Create database migration system
  - Set up migration tool (Knex or Sequelize)
  - Create first migration
  - Document migration process
  - **Deliverable:** Migration system
  - **Time:** 3 hours
  - **Future-proofing:** Design for zero-downtime migrations

- [ ] **1.2.3** Create database seeding system
  - Create seed files for test data
  - Create seed runner
  - Document seeding process
  - **Deliverable:** Seeding system
  - **Time:** 2 hours

- [ ] **1.2.4** Create database query builder/ORM setup
  - Set up query builder (Knex) or ORM (Sequelize/TypeORM)
  - Create base model classes
  - Set up model relationships
  - **Deliverable:** ORM/Query builder configured
  - **Time:** 3 hours

### 1.3 Authentication Infrastructure

**Why Third (but before any features):** Authentication is needed for all user-dependent features.

- [ ] **1.3.1** Implement JWT token system
  - Create JWT generation function
  - Create JWT verification function
  - Implement token refresh logic
  - **Deliverable:** JWT utility functions
  - **Time:** 4 hours
  - **Future-proofing:** Design for token revocation, multiple token types

- [ ] **1.3.2** Implement password hashing
  - Set up bcrypt
  - Create password hashing functions
  - Create password verification functions
  - **Deliverable:** Password hashing utilities
  - **Time:** 2 hours

- [ ] **1.3.3** Create authentication middleware
  - Create middleware to verify JWT
  - Create middleware to check roles/permissions
  - Create middleware for optional auth
  - **Deliverable:** Authentication middleware
  - **Time:** 3 hours

- [ ] **1.3.4** Create session management system
  - Set up Redis session store
  - Create session creation logic
  - Create session validation logic
  - Create session cleanup
  - **Deliverable:** Session management system
  - **Time:** 4 hours

- [ ] **1.3.5** Implement CSRF protection
  - Set up CSRF middleware
  - Create CSRF token generation
  - Create CSRF validation
  - **Deliverable:** CSRF protection system
  - **Time:** 2 hours

- [ ] **1.3.6** Implement rate limiting
  - Set up rate limiting middleware
  - Configure rate limits for different endpoints
  - Set up Redis-backed rate limiting
  - **Deliverable:** Rate limiting system
  - **Time:** 3 hours
  - **Future-proofing:** Design for per-user and per-IP limits

### 1.4 API Foundation

**Why Fourth (but before feature endpoints):** Need proper API structure before building features.

- [ ] **1.4.1** Create API response format standard
  - Define success response format
  - Define error response format
  - Create response wrapper functions
  - **Deliverable:** Response formatting utilities
  - **Time:** 2 hours

- [ ] **1.4.2** Create API validation middleware
  - Set up request validation (Joi or Zod)
  - Create validation schemas
  - Create validation error handling
  - **Deliverable:** Validation system
  - **Time:** 3 hours

- [ ] **1.4.3** Create API documentation system
  - Set up Swagger/OpenAPI
  - Create documentation template
  - Document authentication requirements
  - **Deliverable:** API documentation setup
  - **Time:** 3 hours

- [ ] **1.4.4** Create API versioning system
  - Implement API versioning strategy
  - Create version routing
  - Document versioning approach
  - **Deliverable:** API versioning system
  - **Time:** 2 hours

### 1.5 Email System

**Why Fifth (needed for auth and notifications):** Multiple features depend on email.

- [ ] **1.5.1** Set up email service
  - Choose email provider (SendGrid, Mailgun, etc.)
  - Set up email credentials
  - Create email sending function
  - **Deliverable:** Email service module
  - **Time:** 3 hours

- [ ] **1.5.2** Create email templates
  - Create verification email template
  - Create password reset email template
  - Create notification email template
  - Create base email template
  - **Deliverable:** Email template system
  - **Time:** 3 hours
  - **Future-proofing:** Design for easy template customization

- [ ] **1.5.3** Implement email queue system
  - Set up message queue (Bull with Redis)
  - Create email job handler
  - Implement retry logic
  - **Deliverable:** Email queue system
  - **Time:** 4 hours

**Phase 1 Total Time:** 60 hours

---

## PHASE 2: CORE FEATURES - AUTHENTICATION & USERS (Weeks 4-5)

### 2.1 User Management

**Why First in Phase 2:** All other features depend on users existing.

- [ ] **2.1.1** Create User model
  - Define user table schema
  - Create user model with validations
  - Create user factory for testing
  - **Deliverable:** User model
  - **Time:** 3 hours

- [ ] **2.1.2** Implement user registration API
  - Create POST /api/v1/auth/register endpoint
  - Implement email validation
  - Implement username uniqueness check
  - Create user in database
  - Send verification email
  - **Deliverable:** Registration endpoint
  - **Time:** 6 hours
  - **Future-proofing:** Design for social registration later

- [ ] **2.1.3** Implement email verification
  - Create verification token system
  - Create verification endpoint
  - Handle verification expiration
  - Send verification reminder emails
  - **Deliverable:** Email verification system
  - **Time:** 4 hours

- [ ] **2.1.4** Implement user login API
  - Create POST /api/v1/auth/login endpoint
  - Implement email/password validation
  - Generate JWT tokens
  - Return user data
  - **Deliverable:** Login endpoint
  - **Time:** 4 hours

- [ ] **2.1.5** Implement password reset flow
  - Create POST /api/v1/auth/forgot-password endpoint
  - Create password reset token system
  - Create POST /api/v1/auth/reset-password endpoint
  - Send reset emails
  - **Deliverable:** Password reset system
  - **Time:** 5 hours

- [ ] **2.1.6** Implement token refresh
  - Create POST /api/v1/auth/refresh endpoint
  - Implement refresh token logic
  - Handle token expiration
  - **Deliverable:** Token refresh endpoint
  - **Time:** 3 hours

- [ ] **2.1.7** Implement logout
  - Create POST /api/v1/auth/logout endpoint
  - Implement token blacklisting
  - Clear session
  - **Deliverable:** Logout endpoint
  - **Time:** 2 hours

- [ ] **2.1.8** Create user profile endpoints
  - Create GET /api/v1/users/:id endpoint
  - Create PUT /api/v1/users/:id endpoint
  - Implement profile update validation
  - **Deliverable:** User profile endpoints
  - **Time:** 4 hours

- [ ] **2.1.9** Implement user settings
  - Create user_settings table
  - Create GET /api/v1/users/:id/settings endpoint
  - Create PUT /api/v1/users/:id/settings endpoint
  - **Deliverable:** User settings endpoints
  - **Time:** 4 hours

### 2.2 Frontend Authentication

**Why Second in Phase 2:** Need backend auth before building frontend auth.

- [ ] **2.2.1** Create authentication context
  - Create AuthContext
  - Create useAuth hook
  - Implement auth state management
  - **Deliverable:** Auth context and hook
  - **Time:** 3 hours

- [ ] **2.2.2** Create login page
  - Create login form
  - Implement form validation
  - Implement login submission
  - Handle errors
  - **Deliverable:** Login page
  - **Time:** 4 hours

- [ ] **2.2.3** Create registration page
  - Create registration form
  - Implement form validation
  - Implement registration submission
  - Handle errors
  - **Deliverable:** Registration page
  - **Time:** 4 hours

- [ ] **2.2.4** Create password reset page
  - Create forgot password form
  - Create reset password form
  - Implement form submission
  - Handle errors
  - **Deliverable:** Password reset pages
  - **Time:** 4 hours

- [ ] **2.2.5** Create protected routes
  - Implement route protection
  - Redirect unauthenticated users
  - Implement role-based route protection
  - **Deliverable:** Protected routes
  - **Time:** 3 hours

- [ ] **2.2.6** Create user settings page
  - Create settings form
  - Implement settings update
  - Handle settings changes
  - **Deliverable:** Settings page
  - **Time:** 4 hours

- [ ] **2.2.7** Update header with user info
  - Display logged-in user name
  - Add logout button
  - Add user menu
  - **Deliverable:** Updated header
  - **Time:** 2 hours

**Phase 2 Total Time:** 56 hours

---

## PHASE 3: CORE INFRASTRUCTURE - NOTIFICATIONS & REAL-TIME (Weeks 6-7)

### 3.1 Notification System

**Why Third Phase:** Needed for all user-facing features to notify users of updates.

- [ ] **3.1.1** Create Notification model
  - Define notification table schema
  - Create notification types
  - Create notification model
  - **Deliverable:** Notification model
  - **Time:** 3 hours

- [ ] **3.1.2** Create notification API endpoints
  - Create GET /api/v1/users/:id/notifications endpoint
  - Create POST /api/v1/notifications/:id/read endpoint
  - Create DELETE /api/v1/notifications/:id endpoint
  - Create POST /api/v1/notifications/read-all endpoint
  - **Deliverable:** Notification endpoints
  - **Time:** 4 hours

- [ ] **3.1.3** Create notification creation system
  - Create function to create notifications
  - Implement notification deduplication
  - Implement notification filtering
  - **Deliverable:** Notification creation system
  - **Time:** 3 hours

- [ ] **3.1.4** Create notification dropdown component
  - Create NotificationDropdown component
  - Display unread notifications
  - Implement mark as read
  - Implement delete notification
  - **Deliverable:** Notification dropdown
  - **Time:** 4 hours

- [ ] **3.1.5** Fix notification bell button
  - Add onClick handler
  - Show notification count
  - Toggle dropdown
  - **Deliverable:** Working notification bell
  - **Time:** 2 hours

- [ ] **3.1.6** Create notification preferences
  - Create notification_preferences table
  - Create notification preference endpoints
  - Create preference UI
  - **Deliverable:** Notification preferences
  - **Time:** 4 hours

### 3.2 Real-Time Communication

**Why With Notifications:** Both use WebSocket infrastructure.

- [ ] **3.2.1** Set up WebSocket server
  - Install Socket.io
  - Configure Socket.io with Express
  - Set up Socket.io authentication
  - **Deliverable:** WebSocket server
  - **Time:** 4 hours

- [ ] **3.2.2** Create real-time notification system
  - Emit notifications via WebSocket
  - Handle client connections
  - Handle client disconnections
  - **Deliverable:** Real-time notifications
  - **Time:** 4 hours

- [ ] **3.2.3** Create message queue for real-time events
  - Set up Redis pub/sub
  - Create event emitter
  - Handle event broadcasting
  - **Deliverable:** Event system
  - **Time:** 3 hours

**Phase 3 Total Time:** 31 hours

---

## PHASE 4: CORE FEATURES - DATA & STATISTICS (Weeks 8-9)

### 4.1 Statistics System

**Why Fourth Phase:** Foundation for dashboard and analytics.

- [ ] **4.1.1** Create statistics models
  - Create organization_stats table
  - Create campaign_stats table
  - Create intelligence_stats table
  - Create user_stats table
  - **Deliverable:** Statistics models
  - **Time:** 3 hours

- [ ] **4.1.2** Create statistics calculation functions
  - Create function to count organizations
  - Create function to count campaigns
  - Create function to count intelligence
  - Create function to calculate global reach
  - **Deliverable:** Statistics functions
  - **Time:** 4 hours

- [ ] **4.1.3** Create statistics API endpoints
  - Create GET /api/v1/statistics/organizations endpoint
  - Create GET /api/v1/statistics/campaigns endpoint
  - Create GET /api/v1/statistics/intelligence endpoint
  - Create GET /api/v1/statistics/global-reach endpoint
  - Create GET /api/v1/statistics/all endpoint
  - **Deliverable:** Statistics endpoints
  - **Time:** 4 hours

- [ ] **4.1.4** Create statistics caching
  - Implement Redis caching for statistics
  - Set up cache invalidation
  - Create cache warming
  - **Deliverable:** Cached statistics
  - **Time:** 3 hours

- [ ] **4.1.5** Create statistics update jobs
  - Set up scheduled jobs (Bull)
  - Create job to update statistics
  - Set up job scheduling
  - **Deliverable:** Statistics update jobs
  - **Time:** 3 hours

- [ ] **4.1.6** Update dashboard to use real statistics
  - Remove hardcoded numbers
  - Fetch statistics from API
  - Display real data
  - Add loading states
  - **Deliverable:** Updated dashboard
  - **Time:** 3 hours

### 4.2 Intelligence Feed System

**Why With Statistics:** Both are data-heavy features.

- [ ] **4.2.1** Create Intelligence model
  - Define intelligence table schema
  - Create intelligence model
  - **Deliverable:** Intelligence model
  - **Time:** 2 hours

- [ ] **4.2.2** Create intelligence API endpoints
  - Create GET /api/v1/intelligence endpoint
  - Create POST /api/v1/intelligence endpoint
  - Create GET /api/v1/intelligence/:id endpoint
  - Create PUT /api/v1/intelligence/:id endpoint
  - Create DELETE /api/v1/intelligence/:id endpoint
  - **Deliverable:** Intelligence endpoints
  - **Time:** 5 hours

- [ ] **4.2.3** Create intelligence filtering
  - Implement filtering by type
  - Implement filtering by date
  - Implement filtering by source
  - Implement filtering by severity
  - **Deliverable:** Intelligence filtering
  - **Time:** 3 hours

- [ ] **4.2.4** Create intelligence search
  - Implement full-text search
  - Implement search indexing
  - **Deliverable:** Intelligence search
  - **Time:** 4 hours

- [ ] **4.2.5** Verify intelligence feed data
  - Verify all intelligence is real or properly sourced
  - Add source attribution
  - Add timestamps
  - **Deliverable:** Verified intelligence data
  - **Time:** 4 hours

- [ ] **4.2.6** Update IntelligenceFeeds page
  - Fetch data from API
  - Implement real filtering
  - Implement real search
  - Add loading states
  - **Deliverable:** Updated IntelligenceFeeds page
  - **Time:** 4 hours

**Phase 4 Total Time:** 40 hours

---

## PHASE 5: CORE FEATURES - ORGANIZATIONS & CAMPAIGNS (Weeks 10-11)

### 5.1 Organization Management

**Why Fifth Phase:** Depends on user authentication.

- [ ] **5.1.1** Create Organization model
  - Define organization table schema
  - Create organization model
  - **Deliverable:** Organization model
  - **Time:** 2 hours

- [ ] **5.1.2** Create organization API endpoints
  - Create GET /api/v1/organizations endpoint
  - Create POST /api/v1/organizations endpoint
  - Create GET /api/v1/organizations/:id endpoint
  - Create PUT /api/v1/organizations/:id endpoint
  - Create DELETE /api/v1/organizations/:id endpoint
  - **Deliverable:** Organization endpoints
  - **Time:** 5 hours

- [ ] **5.1.3** Create organization filtering and search
  - Implement filtering by region
  - Implement filtering by type
  - Implement search
  - **Deliverable:** Organization filtering and search
  - **Time:** 3 hours

- [ ] **5.1.4** Verify organization data
  - Verify all organization contact information
  - Update outdated information
  - Remove invalid organizations
  - Add missing organizations
  - **Deliverable:** Verified organization data
  - **Time:** 8 hours

- [ ] **5.1.5** Create organization verification system
  - Create verification workflow
  - Create verification status types
  - Create verification endpoints
  - **Deliverable:** Organization verification system
  - **Time:** 4 hours

- [ ] **5.1.6** Update ResistanceDirectory page
  - Fetch data from API
  - Implement real filtering
  - Implement real search
  - Add loading states
  - **Deliverable:** Updated ResistanceDirectory page
  - **Time:** 4 hours

### 5.2 Campaign Management

**Why With Organizations:** Similar data structure and features.

- [ ] **5.2.1** Create Campaign model
  - Define campaign table schema
  - Create campaign model
  - **Deliverable:** Campaign model
  - **Time:** 2 hours

- [ ] **5.2.2** Create campaign API endpoints
  - Create GET /api/v1/campaigns endpoint
  - Create POST /api/v1/campaigns endpoint
  - Create GET /api/v1/campaigns/:id endpoint
  - Create PUT /api/v1/campaigns/:id endpoint
  - Create DELETE /api/v1/campaigns/:id endpoint
  - **Deliverable:** Campaign endpoints
  - **Time:** 5 hours

- [ ] **5.2.3** Create campaign membership system
  - Create campaign_members table
  - Create POST /api/v1/campaigns/:id/join endpoint
  - Create DELETE /api/v1/campaigns/:id/leave endpoint
  - Create GET /api/v1/campaigns/:id/members endpoint
  - **Deliverable:** Campaign membership system
  - **Time:** 4 hours

- [ ] **5.2.4** Create campaign progress tracking
  - Create campaign_progress table
  - Create progress calculation logic
  - Create progress update endpoints
  - **Deliverable:** Campaign progress tracking
  - **Time:** 4 hours

- [ ] **5.2.5** Implement campaign notifications
  - Send notification when user joins campaign
  - Send notification when campaign updates
  - Send notification on milestones
  - **Deliverable:** Campaign notifications
  - **Time:** 3 hours

- [ ] **5.2.6** Update Campaigns page
  - Fetch data from API
  - Implement real join/leave
  - Implement real progress tracking
  - Add loading states
  - **Deliverable:** Updated Campaigns page
  - **Time:** 4 hours

- [ ] **5.2.7** Update Dashboard featured campaigns
  - Fetch real campaign data
  - Show real member counts
  - Show real progress
  - **Deliverable:** Updated dashboard campaigns
  - **Time:** 2 hours

**Phase 5 Total Time:** 42 hours

---

## PHASE 6: COMMUNITY FEATURES (Weeks 12-13)

### 6.1 Community Support System

**Why Sixth Phase:** Depends on user authentication and notifications.

- [ ] **6.1.1** Create SupportRequest model
  - Define support_requests table schema
  - Create support request model
  - **Deliverable:** SupportRequest model
  - **Time:** 2 hours

- [ ] **6.1.2** Create support request API endpoints
  - Create GET /api/v1/support-requests endpoint
  - Create POST /api/v1/support-requests endpoint
  - Create GET /api/v1/support-requests/:id endpoint
  - Create PUT /api/v1/support-requests/:id endpoint
  - **Deliverable:** Support request endpoints
  - **Time:** 5 hours

- [ ] **6.1.3** Create help offer system
  - Create help_offers table
  - Create POST /api/v1/support-requests/:id/offer-help endpoint
  - Create GET /api/v1/support-requests/:id/offers endpoint
  - Create PUT /api/v1/help-offers/:id endpoint (accept/reject)
  - **Deliverable:** Help offer system
  - **Time:** 5 hours

- [ ] **6.1.4** Create helper reputation system
  - Create helper_ratings table
  - Create rating endpoints
  - Create reputation calculation
  - **Deliverable:** Helper reputation system
  - **Time:** 4 hours

- [ ] **6.1.5** Implement support notifications
  - Send notification when help offered
  - Send notification when offer accepted
  - Send notification on completion
  - **Deliverable:** Support notifications
  - **Time:** 3 hours

- [ ] **6.1.6** Create mutual aid networks
  - Create networks table
  - Create network endpoints
  - Create network membership
  - **Deliverable:** Mutual aid networks
  - **Time:** 4 hours

- [ ] **6.1.7** Update CommunitySupport page
  - Fetch data from API
  - Implement real offer help
  - Implement real filtering
  - Add loading states
  - **Deliverable:** Updated CommunitySupport page
  - **Time:** 4 hours

### 6.2 Secure Communications

**Why With Community Features:** Both are community-focused.

- [ ] **6.2.1** Create Channel model
  - Define channels table schema
  - Create channel model
  - **Deliverable:** Channel model
  - **Time:** 2 hours

- [ ] **6.2.2** Create channel API endpoints
  - Create GET /api/v1/channels endpoint
  - Create POST /api/v1/channels endpoint
  - Create GET /api/v1/channels/:id endpoint
  - Create PUT /api/v1/channels/:id endpoint
  - **Deliverable:** Channel endpoints
  - **Time:** 4 hours

- [ ] **6.2.3** Create channel membership system
  - Create channel_members table
  - Create POST /api/v1/channels/:id/join endpoint
  - Create DELETE /api/v1/channels/:id/leave endpoint
  - Create GET /api/v1/channels/:id/members endpoint
  - **Deliverable:** Channel membership system
  - **Time:** 3 hours

- [ ] **6.2.4** Create message model and API
  - Create messages table
  - Create POST /api/v1/channels/:id/messages endpoint
  - Create GET /api/v1/channels/:id/messages endpoint
  - Create DELETE /api/v1/messages/:id endpoint
  - **Deliverable:** Message API
  - **Time:** 4 hours

- [ ] **6.2.5** Implement message encryption
  - Choose encryption library (TweetNaCl.js)
  - Implement message encryption
  - Implement message decryption
  - Store encrypted messages
  - **Deliverable:** Message encryption
  - **Time:** 6 hours
  - **Future-proofing:** Design for key exchange and key rotation

- [ ] **6.2.6** Implement real-time messaging
  - Emit messages via WebSocket
  - Handle message delivery
  - Show typing indicators
  - Show online status
  - **Deliverable:** Real-time messaging
  - **Time:** 6 hours

- [ ] **6.2.7** Create message search and history
  - Implement message search
  - Implement message pagination
  - Create message archiving
  - **Deliverable:** Message search and history
  - **Time:** 4 hours

- [ ] **6.2.8** Update SecureCommunications page
  - Fetch data from API
  - Implement real join/leave
  - Implement real messaging
  - Add encryption indicators
  - **Deliverable:** Updated SecureCommunications page
  - **Time:** 5 hours

**Phase 6 Total Time:** 51 hours

---

## PHASE 7: EDUCATION & SECURITY (Weeks 14-15)

### 7.1 Education Center

**Why Seventh Phase:** Less critical than core features, but important for platform value.

- [ ] **7.1.1** Create Module model
  - Define modules table schema
  - Create module model
  - **Deliverable:** Module model
  - **Time:** 2 hours

- [ ] **7.1.2** Create module API endpoints
  - Create GET /api/v1/modules endpoint
  - Create POST /api/v1/modules endpoint
  - Create GET /api/v1/modules/:id endpoint
  - Create PUT /api/v1/modules/:id endpoint
  - **Deliverable:** Module endpoints
  - **Time:** 4 hours

- [ ] **7.1.3** Create module enrollment system
  - Create enrollments table
  - Create POST /api/v1/modules/:id/enroll endpoint
  - Create GET /api/v1/modules/:id/enrollments endpoint
  - **Deliverable:** Module enrollment system
  - **Time:** 3 hours

- [ ] **7.1.4** Create progress tracking for modules
  - Create user_module_progress table
  - Create progress endpoints
  - Implement progress calculation
  - **Deliverable:** Module progress tracking
  - **Time:** 4 hours

- [ ] **7.1.5** Create module completion and certification
  - Create completion logic
  - Create certification generation
  - Create certificate endpoints
  - **Deliverable:** Certification system
  - **Time:** 4 hours

- [ ] **7.1.6** Create module ratings and reviews
  - Create ratings table
  - Create rating endpoints
  - Create review endpoints
  - **Deliverable:** Ratings and reviews
  - **Time:** 3 hours

- [ ] **7.1.7** Update EducationCenter page
  - Fetch data from API
  - Implement real enrollment
  - Implement real progress tracking
  - Add loading states
  - **Deliverable:** Updated EducationCenter page
  - **Time:** 4 hours

### 7.2 Security Center (Real Implementation)

**Why With Education:** Both are learning/assessment focused.

- [ ] **7.2.1** Create real VPN/Tor detection
  - Research WebRTC leak detection
  - Implement WebRTC leak check
  - Research DNS leak detection
  - Implement DNS leak check
  - **Deliverable:** Real VPN/Tor detection
  - **Time:** 12 hours
  - **Critical:** This replaces the fake detection

- [ ] **7.2.2** Create IP geolocation check
  - Choose IP geolocation API (MaxMind)
  - Implement IP lookup
  - Display location information
  - **Deliverable:** IP geolocation
  - **Time:** 4 hours

- [ ] **7.2.3** Create security assessment quiz
  - Create quiz model
  - Create quiz endpoints
  - Implement scoring logic
  - Create result generation
  - **Deliverable:** Security assessment
  - **Time:** 5 hours

- [ ] **7.2.4** Create security tools database
  - Create tools table
  - Create tool endpoints
  - Verify tool information
  - **Deliverable:** Security tools database
  - **Time:** 3 hours

- [ ] **7.2.5** Create security guides database
  - Create guides table
  - Create guide endpoints
  - Create guide content
  - **Deliverable:** Security guides database
  - **Time:** 4 hours

- [ ] **7.2.6** Update SecurityCenter page
  - Implement real VPN/Tor detection
  - Implement real IP geolocation
  - Implement real security assessment
  - Add loading states
  - **Deliverable:** Updated SecurityCenter page
  - **Time:** 4 hours

**Phase 7 Total Time:** 57 hours

---

## PHASE 8: DATA INTEGRATION & SOURCES (Weeks 16-17)

### 8.1 RSS Feed Integration

**Why Eighth Phase:** Depends on intelligence system being ready.

- [ ] **8.1.1** Research and document RSS sources
  - Find ICIJ RSS feed
  - Find ASPI RSS feed
  - Find Radio Free Asia RSS feed
  - Find Hong Kong Free Press RSS feed
  - Document feed URLs and formats
  - **Deliverable:** RSS sources document
  - **Time:** 4 hours

- [ ] **8.1.2** Create RSS feed parser
  - Install RSS parser library
  - Create feed parsing function
  - Handle feed errors
  - **Deliverable:** RSS parser
  - **Time:** 3 hours

- [ ] **8.1.3** Create feed aggregation system
  - Create feed aggregation logic
  - Implement feed deduplication
  - Implement feed normalization
  - **Deliverable:** Feed aggregation
  - **Time:** 4 hours

- [ ] **8.1.4** Create scheduled feed updates
  - Set up feed update jobs
  - Implement feed scheduling
  - Handle feed failures
  - **Deliverable:** Scheduled feed updates
  - **Time:** 3 hours

- [ ] **8.1.5** Implement feed source verification
  - Verify feed authenticity
  - Add source attribution
  - Create source verification system
  - **Deliverable:** Feed source verification
  - **Time:** 3 hours

- [ ] **8.1.6** Test all feeds
  - Test ICIJ feed
  - Test ASPI feed
  - Test RFA feed
  - Test HKFP feed
  - Verify data quality
  - **Deliverable:** Tested feeds
  - **Time:** 4 hours

### 8.2 Data Verification & Quality

**Why With Feeds:** Both involve data quality.

- [ ] **8.2.1** Create data verification workflow
  - Create verification status types
  - Create verification endpoints
  - Create verification UI
  - **Deliverable:** Data verification workflow
  - **Time:** 4 hours

- [ ] **8.2.2** Verify all organization data
  - Check all contact information
  - Update outdated information
  - Remove invalid entries
  - Add missing organizations
  - **Deliverable:** Verified organization data
  - **Time:** 12 hours

- [ ] **8.2.3** Verify all campaign data
  - Check all campaign information
  - Update outdated information
  - Verify campaign goals
  - Verify campaign contacts
  - **Deliverable:** Verified campaign data
  - **Time:** 8 hours

- [ ] **8.2.4** Create data quality metrics
  - Create metrics dashboard
  - Track data quality scores
  - Create quality reports
  - **Deliverable:** Data quality metrics
  - **Time:** 4 hours

**Phase 8 Total Time:** 49 hours

---

## PHASE 9: SEARCH & DISCOVERY (Week 18)

### 9.1 Global Search System

**Why Ninth Phase:** Depends on all data being in system.

- [ ] **9.1.1** Create search index
  - Set up full-text search
  - Create search indexes for all data types
  - Implement search ranking
  - **Deliverable:** Search index
  - **Time:** 5 hours

- [ ] **9.1.2** Create global search API
  - Create GET /api/v1/search endpoint
  - Implement search query parsing
  - Implement search filtering
  - Implement search sorting
  - **Deliverable:** Global search API
  - **Time:** 5 hours

- [ ] **9.1.3** Create search suggestions
  - Implement suggestion algorithm
  - Create suggestion caching
  - Create suggestion endpoints
  - **Deliverable:** Search suggestions
  - **Time:** 3 hours

- [ ] **9.1.4** Create search history
  - Create search_history table
  - Implement search history storage
  - Create search history endpoints
  - **Deliverable:** Search history
  - **Time:** 3 hours

- [ ] **9.1.5** Update header search
  - Implement real search functionality
  - Show search results
  - Implement search filtering
  - Add loading states
  - **Deliverable:** Working header search
  - **Time:** 4 hours

- [ ] **9.1.6** Create search results page
  - Create search results component
  - Display results by type
  - Implement result filtering
  - Add pagination
  - **Deliverable:** Search results page
  - **Time:** 4 hours

**Phase 9 Total Time:** 24 hours

---

## PHASE 10: FORMS & SUBMISSIONS (Week 19)

### 10.1 Form System

**Why Tenth Phase:** Depends on all backend systems being ready.

- [ ] **10.1.1** Create form submission infrastructure
  - Create form submission validation
  - Create form submission handling
  - Create form submission storage
  - **Deliverable:** Form submission system
  - **Time:** 4 hours

- [ ] **10.1.2** Create intelligence report submission form
  - Create form component
  - Implement form validation
  - Create submission endpoint
  - Implement submission notifications
  - **Deliverable:** Intelligence report form
  - **Time:** 4 hours

- [ ] **10.1.3** Create support request submission form
  - Create form component
  - Implement form validation
  - Create submission endpoint
  - Implement submission notifications
  - **Deliverable:** Support request form
  - **Time:** 4 hours

- [ ] **10.1.4** Create contact form
  - Create form component
  - Implement form validation
  - Create submission endpoint
  - Implement submission notifications
  - **Deliverable:** Contact form
  - **Time:** 3 hours

- [ ] **10.1.5** Create organization submission form
  - Create form component
  - Implement form validation
  - Create submission endpoint
  - Implement verification workflow
  - **Deliverable:** Organization submission form
  - **Time:** 4 hours

- [ ] **10.1.6** Create campaign creation form
  - Create form component
  - Implement form validation
  - Create creation endpoint
  - Implement notifications
  - **Deliverable:** Campaign creation form
  - **Time:** 4 hours

**Phase 10 Total Time:** 23 hours

---

## PHASE 11: FILE MANAGEMENT (Week 20)

### 11.1 File Storage & Downloads

**Why Eleventh Phase:** Depends on user system and form system.

- [ ] **11.1.1** Set up file storage system
  - Choose storage solution (S3 or local)
  - Configure file storage
  - Create file upload handler
  - **Deliverable:** File storage system
  - **Time:** 4 hours

- [ ] **11.1.2** Create file upload API
  - Create POST /api/v1/files/upload endpoint
  - Implement file validation
  - Implement file scanning
  - **Deliverable:** File upload API
  - **Time:** 4 hours

- [ ] **11.1.3** Create file download API
  - Create GET /api/v1/files/:id/download endpoint
  - Implement access control
  - Implement download tracking
  - **Deliverable:** File download API
  - **Time:** 3 hours

- [ ] **11.1.4** Create resource library
  - Create resources table
  - Create resource endpoints
  - Organize resources by type
  - **Deliverable:** Resource library
  - **Time:** 4 hours

- [ ] **11.1.5** Create download tracking
  - Track all downloads
  - Create download analytics
  - Create download reports
  - **Deliverable:** Download tracking
  - **Time:** 3 hours

- [ ] **11.1.6** Update download UI
  - Add download buttons
  - Show file information
  - Show download progress
  - Add download history
  - **Deliverable:** Download UI
  - **Time:** 3 hours

**Phase 11 Total Time:** 21 hours

---

## PHASE 12: ANALYTICS & MONITORING (Week 21)

### 12.1 Analytics System

**Why Twelfth Phase:** Depends on all features being implemented.

- [ ] **12.1.1** Create event tracking system
  - Create events table
  - Create event types
  - Create event tracking
  - **Deliverable:** Event tracking
  - **Time:** 4 hours

- [ ] **12.1.2** Create analytics API
  - Create GET /api/v1/analytics/events endpoint
  - Create analytics query endpoints
  - Create analytics aggregation
  - **Deliverable:** Analytics API
  - **Time:** 5 hours

- [ ] **12.1.3** Create analytics dashboard
  - Create analytics dashboard page
  - Display usage statistics
  - Display user engagement
  - Display feature usage
  - **Deliverable:** Analytics dashboard
  - **Time:** 5 hours

- [ ] **12.1.4** Create error tracking
  - Set up error tracking (Sentry)
  - Configure error logging
  - Create error dashboard
  - **Deliverable:** Error tracking
  - **Time:** 3 hours

- [ ] **12.1.5** Create performance monitoring
  - Set up APM (Application Performance Monitoring)
  - Monitor API performance
  - Monitor database performance
  - Create performance reports
  - **Deliverable:** Performance monitoring
  - **Time:** 4 hours

**Phase 12 Total Time:** 21 hours

---

## PHASE 13: ADVANCED FEATURES (Weeks 22-24)

### 13.1 Email & Push Notifications

**Why Thirteenth Phase:** Nice-to-have features that depend on core system.

- [ ] **13.1.1** Create email notification system
  - Send email on campaign update
  - Send email on help offer
  - Send email on message received
  - Create email templates
  - **Deliverable:** Email notifications
  - **Time:** 5 hours

- [ ] **13.1.2** Create push notification system
  - Implement Web Push API
  - Create push notification service
  - Send push on important events
  - Allow push opt-in/out
  - **Deliverable:** Push notifications
  - **Time:** 5 hours

- [ ] **13.1.3** Create notification preferences UI
  - Create notification settings page
  - Allow users to customize notifications
  - Allow users to opt-in/out
  - **Deliverable:** Notification preferences UI
  - **Time:** 3 hours

### 13.2 Social & Sharing Features

**Why With Notifications:** Both enhance user engagement.

- [ ] **13.2.1** Create social sharing system
  - Add share buttons
  - Generate share previews
  - Track shares
  - **Deliverable:** Social sharing
  - **Time:** 4 hours

- [ ] **13.2.2** Create user profiles
  - Create user profile pages
  - Display user activity
  - Display user achievements
  - **Deliverable:** User profiles
  - **Time:** 4 hours

- [ ] **13.2.3** Create user following system
  - Create follows table
  - Create follow endpoints
  - Create activity feed
  - **Deliverable:** Following system
  - **Time:** 4 hours

### 13.3 Moderation & Safety

**Why With Advanced Features:** Important for community safety.

- [ ] **13.3.1** Create content reporting system
  - Create reports table
  - Create report endpoints
  - Create moderation queue
  - **Deliverable:** Content reporting
  - **Time:** 4 hours

- [ ] **13.3.2** Create user blocking system
  - Create blocks table
  - Create block endpoints
  - Enforce blocks in messaging
  - **Deliverable:** User blocking
  - **Time:** 3 hours

- [ ] **13.3.3** Create moderation dashboard
  - Create moderation queue UI
  - Create moderation tools
  - Create moderation reports
  - **Deliverable:** Moderation dashboard
  - **Time:** 5 hours

- [ ] **13.3.4** Create content moderation workflow
  - Create moderation statuses
  - Create moderation actions
  - Create moderation logging
  - **Deliverable:** Moderation workflow
  - **Time:** 4 hours

**Phase 13 Total Time:** 41 hours

---

## PHASE 14: TESTING & QUALITY ASSURANCE (Weeks 25-26)

### 14.1 Comprehensive Testing

**Why Last Phase:** Test after all features are built.

- [ ] **14.1.1** Create unit tests
  - Write unit tests for all models
  - Write unit tests for all utilities
  - Achieve 80% code coverage
  - **Deliverable:** Unit tests
  - **Time:** 20 hours

- [ ] **14.1.2** Create integration tests
  - Write integration tests for APIs
  - Write integration tests for workflows
  - Achieve 60% coverage
  - **Deliverable:** Integration tests
  - **Time:** 15 hours

- [ ] **14.1.3** Create E2E tests
  - Write E2E tests for critical flows
  - Test user registration flow
  - Test campaign join flow
  - Test messaging flow
  - **Deliverable:** E2E tests
  - **Time:** 15 hours

- [ ] **14.1.4** Create security tests
  - Test authentication
  - Test authorization
  - Test input validation
  - Test CSRF protection
  - **Deliverable:** Security tests
  - **Time:** 10 hours

- [ ] **14.1.5** Create performance tests
  - Load testing
  - Stress testing
  - Database query optimization
  - **Deliverable:** Performance tests
  - **Time:** 10 hours

- [ ] **14.1.6** Create accessibility tests
  - Test keyboard navigation
  - Test screen reader compatibility
  - Test color contrast
  - **Deliverable:** Accessibility tests
  - **Time:** 5 hours

- [ ] **14.1.7** Manual testing
  - Test all features manually
  - Test on multiple browsers
  - Test on multiple devices
  - Test on mobile
  - **Deliverable:** Manual testing report
  - **Time:** 20 hours

- [ ] **14.1.8** Bug fixes
  - Fix all identified bugs
  - Regression testing
  - Final verification
  - **Deliverable:** Bug-free application
  - **Time:** 15 hours

**Phase 14 Total Time:** 110 hours

---

## PHASE 15: DEPLOYMENT & DOCUMENTATION (Week 27)

### 15.1 Deployment Preparation

**Why Last Phase:** Deploy after everything is tested.

- [ ] **15.1.1** Create deployment documentation
  - Document deployment process
  - Document environment setup
  - Document backup procedures
  - Document recovery procedures
  - **Deliverable:** Deployment documentation
  - **Time:** 5 hours

- [ ] **15.1.2** Set up production environment
  - Set up production database
  - Set up production cache
  - Set up production file storage
  - Configure production environment
  - **Deliverable:** Production environment
  - **Time:** 4 hours

- [ ] **15.1.3** Set up CI/CD pipeline
  - Set up GitHub Actions
  - Create build pipeline
  - Create test pipeline
  - Create deployment pipeline
  - **Deliverable:** CI/CD pipeline
  - **Time:** 6 hours

- [ ] **15.1.4** Set up monitoring and alerting
  - Set up application monitoring
  - Set up error tracking
  - Set up performance monitoring
  - Create alerting rules
  - **Deliverable:** Monitoring system
  - **Time:** 4 hours

- [ ] **15.1.5** Create API documentation
  - Document all endpoints
  - Create API examples
  - Create API authentication guide
  - **Deliverable:** API documentation
  - **Time:** 5 hours

- [ ] **15.1.6** Create user documentation
  - Create user guide
  - Create FAQ
  - Create troubleshooting guide
  - **Deliverable:** User documentation
  - **Time:** 5 hours

- [ ] **15.1.7** Create admin documentation
  - Create admin guide
  - Create moderation guide
  - Create maintenance guide
  - **Deliverable:** Admin documentation
  - **Time:** 4 hours

- [ ] **15.1.8** Deploy to production
  - Deploy backend
  - Deploy frontend
  - Run smoke tests
  - Monitor for issues
  - **Deliverable:** Live production system
  - **Time:** 4 hours

- [ ] **15.1.9** Post-deployment monitoring
  - Monitor system health
  - Monitor error rates
  - Monitor performance
  - Respond to issues
  - **Deliverable:** Monitoring report
  - **Time:** 4 hours

**Phase 15 Total Time:** 41 hours

---

## SUMMARY

### Timeline Overview

| Phase | Name | Duration | Hours | Key Deliverables |
|-------|------|----------|-------|------------------|
| 0 | Planning & Architecture | 1 week | 30 | Database schema, API spec, security plan |
| 1 | Backend Infrastructure | 2 weeks | 60 | Express setup, DB, auth, email |
| 2 | Authentication & Users | 2 weeks | 56 | User registration, login, profiles |
| 3 | Notifications & Real-time | 2 weeks | 31 | Notification system, WebSocket |
| 4 | Data & Statistics | 2 weeks | 40 | Real statistics, intelligence feeds |
| 5 | Organizations & Campaigns | 2 weeks | 42 | Organization directory, campaigns |
| 6 | Community Features | 2 weeks | 51 | Support system, secure messaging |
| 7 | Education & Security | 2 weeks | 57 | Education center, real VPN detection |
| 8 | Data Integration | 2 weeks | 49 | RSS feeds, data verification |
| 9 | Search & Discovery | 1 week | 24 | Global search, search results |
| 10 | Forms & Submissions | 1 week | 23 | All form systems |
| 11 | File Management | 1 week | 21 | File storage, downloads |
| 12 | Analytics & Monitoring | 1 week | 21 | Analytics dashboard, error tracking |
| 13 | Advanced Features | 3 weeks | 41 | Email, push, social, moderation |
| 14 | Testing & QA | 2 weeks | 110 | Comprehensive testing |
| 15 | Deployment & Docs | 1 week | 41 | Production deployment |
| **TOTAL** | **Complete Platform** | **27 weeks** | **638 hours** | **Production-ready system** |

### Resource Requirements

**Development Team:**
- 1 Backend Developer (Node.js/Express) - 27 weeks
- 1 Frontend Developer (React) - 27 weeks
- 1 DevOps Engineer - 4 weeks (phases 1, 15)
- 1 QA Engineer - 6 weeks (phases 14-15)

**With Full Team (4 people):** 6-7 weeks  
**With 2 People:** 13-14 weeks  
**With 1 Person:** 27 weeks

### Key Dependencies

```
Phase 0 (Planning)
    ↓
Phase 1 (Infrastructure)
    ↓
Phase 2 (Authentication) ← Required for all user features
    ├→ Phase 3 (Notifications)
    ├→ Phase 4 (Statistics & Data)
    ├→ Phase 5 (Organizations & Campaigns)
    ├→ Phase 6 (Community)
    └→ Phase 7 (Education & Security)
        ↓
    Phase 8 (Data Integration)
        ↓
    Phase 9 (Search)
        ↓
    Phase 10 (Forms)
        ↓
    Phase 11 (Files)
        ↓
    Phase 12 (Analytics)
        ↓
    Phase 13 (Advanced)
        ↓
    Phase 14 (Testing)
        ↓
    Phase 15 (Deployment)
```

### Critical Path Items (Must Do In Order)

1. **Phase 0** - Architecture planning (prevents major rework)
2. **Phase 1** - Infrastructure setup (foundation for everything)
3. **Phase 2** - Authentication (required for all user features)
4. **Phase 7.2.1** - Real VPN/Tor detection (security critical)
5. **Phase 14** - Testing (before production)
6. **Phase 15** - Deployment (final step)

### Backtracking Risk Assessment

**Low Risk (Unlikely to need rework):**
- Phase 0 (Planning) - If done well
- Phase 1 (Infrastructure) - Standard setup
- Phase 2 (Authentication) - Well-defined requirements

**Medium Risk (May need minor adjustments):**
- Phase 3-7 (Features) - May discover missing requirements
- Phase 8 (Data Integration) - May find data quality issues

**Low Risk (Unlikely to need rework):**
- Phase 9-15 (Polish & Deployment) - Built on solid foundation

### Proactive Measures to Minimize Backtracking

1. **Phase 0 is thorough** - Spend extra time on planning
2. **Database design is flexible** - Use migrations for schema changes
3. **API design is extensible** - Plan for future endpoints
4. **Code is modular** - Easy to refactor if needed
5. **Tests are comprehensive** - Catch issues early
6. **Documentation is detailed** - Understand requirements before building

---

## How to Use This Todo List

1. **Print or bookmark this document** - Reference it constantly
2. **Check off items as completed** - Provides motivation and progress tracking
3. **Follow the order strictly** - Don't skip ahead
4. **Backtrack only if necessary** - But be proactive to avoid it
5. **Document any changes** - Keep track of deviations and why
6. **Review dependencies** - Before starting each phase
7. **Plan ahead** - Think about future needs before building

---

**Created:** December 3, 2025  
**Status:** Ready for Implementation  
**Next Step:** Begin Phase 0 - Planning & Architecture
