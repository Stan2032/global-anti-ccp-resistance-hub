# Phase 0: Database Schema Design
**Resistance Hub Redesigned - Complete Database Architecture**  
**Created:** December 3, 2025  
**Status:** Design Phase - Ready for Implementation

---

## Overview

This document defines the complete database schema for the resistance-hub-redesigned platform. The schema is designed with:

- **Scalability** - Handles growth from thousands to millions of records
- **Flexibility** - Easy to add new features without major schema changes
- **Performance** - Optimized indexes and relationships
- **Data Integrity** - Proper constraints and validations
- **Audit Trail** - Tracking of changes for security and compliance
- **Future-Proofing** - Fields and tables for planned future features

---

## Database Technology

**Primary Database:** PostgreSQL 14+  
**Caching Layer:** Redis (for sessions, notifications, real-time data)  
**Search Engine:** PostgreSQL Full-Text Search (with future option to upgrade to Elasticsearch)  

---

## Core Tables

### 1. Users Table

Stores user account information and authentication data.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url VARCHAR(500),
  bio TEXT,
  
  -- Status and verification
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'deleted')),
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP,
  phone_verified BOOLEAN DEFAULT FALSE,
  
  -- Profile information
  location VARCHAR(255),
  website VARCHAR(500),
  organization VARCHAR(255),
  expertise_areas TEXT[], -- Array of expertise tags
  languages TEXT[], -- Array of language codes
  
  -- Security
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  last_login TIMESTAMP,
  last_ip_address INET,
  
  -- Preferences
  notification_preferences JSONB DEFAULT '{}',
  privacy_level VARCHAR(50) DEFAULT 'private' CHECK (privacy_level IN ('public', 'friends', 'private')),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Future-Proofing:**
- `expertise_areas` - For matching helpers with requests
- `notification_preferences` - For customizable notifications
- `privacy_level` - For future privacy controls
- `deleted_at` - For soft deletes instead of hard deletes

---

### 2. User Roles Table

Defines user roles and permissions.

```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  permissions TEXT[], -- Array of permission codes
  is_system BOOLEAN DEFAULT FALSE, -- System roles can't be deleted
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by INTEGER REFERENCES users(id),
  expires_at TIMESTAMP,
  UNIQUE(user_id, role_id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
```

**Default Roles:**
- `admin` - Full platform access
- `moderator` - Content moderation and user management
- `organizer` - Can create and manage campaigns
- `helper` - Can offer help in community support
- `user` - Standard user with basic features
- `activist` - Verified activist with special features

---

### 3. Organizations Table

Stores information about resistance organizations.

```sql
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  website VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(20),
  
  -- Location and reach
  headquarters_country VARCHAR(100),
  headquarters_city VARCHAR(100),
  operating_countries TEXT[], -- Array of country codes
  
  -- Organization details
  founded_year INTEGER,
  organization_type VARCHAR(100), -- e.g., 'NGO', 'Grassroots', 'Media'
  focus_areas TEXT[], -- Array of focus areas
  member_count INTEGER DEFAULT 0,
  
  -- Verification and trust
  verification_status VARCHAR(50) DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  verified_at TIMESTAMP,
  verified_by INTEGER REFERENCES users(id),
  trust_score DECIMAL(3,2) DEFAULT 0, -- 0-1 scale
  
  -- Social media
  twitter_handle VARCHAR(100),
  facebook_page VARCHAR(255),
  instagram_handle VARCHAR(100),
  
  -- Contact information
  primary_contact_name VARCHAR(255),
  primary_contact_email VARCHAR(255),
  primary_contact_phone VARCHAR(20),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_country ON organizations USING GIN(operating_countries);
CREATE INDEX idx_organizations_verification_status ON organizations(verification_status);
CREATE INDEX idx_organizations_created_at ON organizations(created_at);
```

**Future-Proofing:**
- `trust_score` - For ranking organizations by reliability
- `verification_status` - For community verification system
- `operating_countries` - For geographic filtering
- `focus_areas` - For specialized filtering

---

### 4. Campaigns Table

Stores campaign information and tracking.

```sql
CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  banner_image_url VARCHAR(500),
  
  -- Campaign details
  campaign_type VARCHAR(100), -- e.g., 'Awareness', 'Action', 'Support'
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  
  -- Goals and progress
  goal_description TEXT,
  target_metric VARCHAR(255), -- What we're measuring
  target_value INTEGER, -- Target number
  current_value INTEGER DEFAULT 0, -- Current progress
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  
  -- Dates
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  
  -- Organization and leadership
  created_by INTEGER NOT NULL REFERENCES users(id),
  primary_organization_id INTEGER REFERENCES organizations(id),
  
  -- Geographic scope
  target_countries TEXT[], -- Array of country codes
  
  -- Engagement metrics
  member_count INTEGER DEFAULT 0,
  supporter_count INTEGER DEFAULT 0,
  
  -- Social media
  twitter_hashtag VARCHAR(100),
  facebook_event_url VARCHAR(500),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_campaigns_slug ON campaigns(slug);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX idx_campaigns_start_date ON campaigns(start_date);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at);
```

**Future-Proofing:**
- `progress_percentage` - Auto-calculated from current/target
- `campaign_type` - For filtering by campaign type
- `target_countries` - For geographic targeting
- `supporter_count` - For tracking engagement

---

### 5. Campaign Members Table

Tracks who's participating in campaigns.

```sql
CREATE TABLE campaign_members (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Membership details
  role VARCHAR(50) DEFAULT 'supporter' CHECK (role IN ('organizer', 'contributor', 'supporter')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'left')),
  
  -- Contribution tracking
  contributions_count INTEGER DEFAULT 0,
  last_contribution_at TIMESTAMP,
  
  -- Metadata
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP,
  
  UNIQUE(campaign_id, user_id)
);

CREATE INDEX idx_campaign_members_campaign_id ON campaign_members(campaign_id);
CREATE INDEX idx_campaign_members_user_id ON campaign_members(user_id);
CREATE INDEX idx_campaign_members_role ON campaign_members(role);
```

---

### 6. Intelligence Reports Table

Stores leaked information and intelligence reports.

```sql
CREATE TABLE intelligence_reports (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  
  -- Report details
  report_type VARCHAR(100), -- e.g., 'Leaked Document', 'Security Threat', 'Research'
  severity VARCHAR(50) DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  
  -- Source information
  source_name VARCHAR(255),
  source_url VARCHAR(500),
  source_type VARCHAR(100), -- e.g., 'ICIJ', 'ASPI', 'RFA', 'HKFP'
  source_verified BOOLEAN DEFAULT FALSE,
  
  -- Content
  tags TEXT[], -- Array of tags
  keywords TEXT[], -- Array of keywords for search
  
  -- Media
  document_url VARCHAR(500),
  image_urls TEXT[], -- Array of image URLs
  
  -- Metadata
  published_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Tracking
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0
);

CREATE INDEX idx_intelligence_reports_slug ON intelligence_reports(slug);
CREATE INDEX idx_intelligence_reports_severity ON intelligence_reports(severity);
CREATE INDEX idx_intelligence_reports_source_type ON intelligence_reports(source_type);
CREATE INDEX idx_intelligence_reports_published_date ON intelligence_reports(published_date);
CREATE INDEX idx_intelligence_reports_tags ON intelligence_reports USING GIN(tags);
CREATE INDEX idx_intelligence_reports_keywords ON intelligence_reports USING GIN(keywords);
```

**Future-Proofing:**
- `keywords` - For full-text search
- `view_count` - For analytics
- `source_verified` - For trust scoring

---

### 7. Support Requests Table

Stores community support requests.

```sql
CREATE TABLE support_requests (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  
  -- Request details
  request_type VARCHAR(100), -- e.g., 'Legal Aid', 'Financial', 'Housing', 'Medical'
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  
  -- Requester information
  created_by INTEGER NOT NULL REFERENCES users(id),
  location VARCHAR(255),
  
  -- Verification
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  
  -- Tracking
  response_count INTEGER DEFAULT 0,
  last_response_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

CREATE INDEX idx_support_requests_created_by ON support_requests(created_by);
CREATE INDEX idx_support_requests_status ON support_requests(status);
CREATE INDEX idx_support_requests_priority ON support_requests(priority);
CREATE INDEX idx_support_requests_created_at ON support_requests(created_at);
```

---

### 8. Help Offers Table

Tracks offers to help with support requests.

```sql
CREATE TABLE help_offers (
  id SERIAL PRIMARY KEY,
  support_request_id INTEGER NOT NULL REFERENCES support_requests(id) ON DELETE CASCADE,
  helper_id INTEGER NOT NULL REFERENCES users(id),
  
  -- Offer details
  message TEXT,
  expertise_areas TEXT[], -- Array of expertise areas
  availability VARCHAR(100), -- e.g., 'Immediate', 'This week', 'Next week'
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  
  -- Tracking
  accepted_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_help_offers_support_request_id ON help_offers(support_request_id);
CREATE INDEX idx_help_offers_helper_id ON help_offers(helper_id);
CREATE INDEX idx_help_offers_status ON help_offers(status);
```

---

### 9. Helper Ratings Table

Tracks reputation of helpers.

```sql
CREATE TABLE helper_ratings (
  id SERIAL PRIMARY KEY,
  helper_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rater_id INTEGER NOT NULL REFERENCES users(id),
  
  -- Rating
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  
  -- Context
  help_offer_id INTEGER REFERENCES help_offers(id),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(helper_id, rater_id, help_offer_id)
);

CREATE INDEX idx_helper_ratings_helper_id ON helper_ratings(helper_id);
CREATE INDEX idx_helper_ratings_rater_id ON helper_ratings(rater_id);
```

---

### 10. Communication Channels Table

Stores encrypted communication channels.

```sql
CREATE TABLE channels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Channel details
  channel_type VARCHAR(50) DEFAULT 'private' CHECK (channel_type IN ('public', 'private', 'direct')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  
  -- Encryption
  encryption_type VARCHAR(50) DEFAULT 'e2e' CHECK (encryption_type IN ('e2e', 'tls', 'none')),
  
  -- Membership
  member_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_channels_channel_type ON channels(channel_type);
CREATE INDEX idx_channels_status ON channels(status);
CREATE INDEX idx_channels_created_by ON channels(created_by);
```

---

### 11. Channel Members Table

Tracks channel membership.

```sql
CREATE TABLE channel_members (
  id SERIAL PRIMARY KEY,
  channel_id INTEGER NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Membership details
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'left')),
  
  -- Encryption keys
  public_key TEXT, -- For E2E encryption
  
  -- Metadata
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP,
  
  UNIQUE(channel_id, user_id)
);

CREATE INDEX idx_channel_members_channel_id ON channel_members(channel_id);
CREATE INDEX idx_channel_members_user_id ON channel_members(user_id);
```

---

### 12. Messages Table

Stores encrypted messages.

```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  channel_id INTEGER NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  
  -- Message content
  content TEXT NOT NULL, -- Encrypted
  content_type VARCHAR(50) DEFAULT 'text' CHECK (content_type IN ('text', 'file', 'image', 'link')),
  
  -- Encryption metadata
  encryption_key_version INTEGER DEFAULT 1,
  
  -- Tracking
  edited_at TIMESTAMP,
  deleted_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_channel_id ON messages(channel_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

---

### 13. Education Modules Table

Stores training modules.

```sql
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  
  -- Module details
  category VARCHAR(100), -- e.g., 'Digital Security', 'Analysis', 'Legal'
  level VARCHAR(50) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INTEGER,
  
  -- Content
  video_url VARCHAR(500),
  resource_urls TEXT[], -- Array of resource URLs
  
  -- Tracking
  enrollment_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  
  -- Metadata
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_modules_slug ON modules(slug);
CREATE INDEX idx_modules_category ON modules(category);
CREATE INDEX idx_modules_level ON modules(level);
```

---

### 14. Module Enrollments Table

Tracks user progress in modules.

```sql
CREATE TABLE module_enrollments (
  id SERIAL PRIMARY KEY,
  module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Progress
  status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  
  -- Completion
  completed_at TIMESTAMP,
  time_spent_minutes INTEGER DEFAULT 0,
  
  -- Assessment
  quiz_score DECIMAL(5,2),
  passed BOOLEAN,
  
  -- Metadata
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(module_id, user_id)
);

CREATE INDEX idx_module_enrollments_module_id ON module_enrollments(module_id);
CREATE INDEX idx_module_enrollments_user_id ON module_enrollments(user_id);
CREATE INDEX idx_module_enrollments_status ON module_enrollments(status);
```

---

### 15. Notifications Table

Stores user notifications.

```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Notification details
  type VARCHAR(100), -- e.g., 'campaign_update', 'help_offered', 'message_received'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Related entity
  related_entity_type VARCHAR(100), -- e.g., 'campaign', 'support_request', 'message'
  related_entity_id INTEGER,
  
  -- Status
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '30 days'
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

---

### 16. Authentication Tokens Table

Stores JWT and refresh tokens.

```sql
CREATE TABLE auth_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Token details
  token_type VARCHAR(50), -- 'access' or 'refresh'
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  
  -- Validity
  expires_at TIMESTAMP NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  revoked_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX idx_auth_tokens_user_id ON auth_tokens(user_id);
CREATE INDEX idx_auth_tokens_expires_at ON auth_tokens(expires_at);
CREATE INDEX idx_auth_tokens_revoked ON auth_tokens(revoked);
```

---

### 17. Audit Log Table

Tracks all important actions for security and compliance.

```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  
  -- Action details
  action VARCHAR(255) NOT NULL, -- e.g., 'user_created', 'campaign_updated'
  entity_type VARCHAR(100), -- e.g., 'user', 'campaign'
  entity_id INTEGER,
  
  -- User who performed action
  actor_user_id INTEGER REFERENCES users(id),
  
  -- Changes
  old_values JSONB,
  new_values JSONB,
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

---

### 18. Files Table

Stores file metadata.

```sql
CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  
  -- File details
  filename VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  
  -- Storage
  storage_path VARCHAR(500) NOT NULL,
  storage_type VARCHAR(50) DEFAULT 'local' CHECK (storage_type IN ('local', 's3', 'other')),
  
  -- Access control
  access_level VARCHAR(50) DEFAULT 'private' CHECK (access_level IN ('public', 'authenticated', 'private')),
  
  -- Tracking
  download_count INTEGER DEFAULT 0,
  
  -- Metadata
  uploaded_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX idx_files_created_at ON files(created_at);
```

---

### 19. Analytics Events Table

Tracks user behavior and platform usage.

```sql
CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  
  -- Event details
  event_type VARCHAR(100), -- e.g., 'page_view', 'button_click', 'form_submit'
  event_name VARCHAR(255),
  
  -- User
  user_id INTEGER REFERENCES users(id),
  
  -- Context
  page_url VARCHAR(500),
  referrer_url VARCHAR(500),
  
  -- Properties
  properties JSONB,
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
```

---

## Relationships Diagram

```
users
├── user_roles → roles
├── campaign_members → campaigns
├── support_requests
├── help_offers → support_requests
├── helper_ratings
├── channels → channel_members
├── messages → channels
├── module_enrollments → modules
├── notifications
├── auth_tokens
└── files

campaigns
├── campaign_members → users
└── intelligence_reports

organizations
├── campaigns

support_requests
├── help_offers
└── helper_ratings

channels
└── channel_members → users
    └── messages

modules
└── module_enrollments → users
```

---

## Performance Considerations

### Indexes Strategy

1. **Primary Keys** - Automatic indexes on all primary keys
2. **Foreign Keys** - Indexes on all foreign key columns
3. **Filtering Columns** - Indexes on status, type, created_at
4. **Search Columns** - Full-text search indexes on text fields
5. **Array Columns** - GIN indexes for array operations

### Query Optimization

1. **Pagination** - All list queries use LIMIT/OFFSET
2. **Lazy Loading** - Related data loaded on demand
3. **Caching** - Frequently accessed data cached in Redis
4. **Denormalization** - Some counts stored in parent tables
5. **Partitioning** - Large tables partitioned by date (future)

### Scalability

1. **Connection Pooling** - PgBouncer for connection management
2. **Read Replicas** - Separate read-only database replicas
3. **Sharding** - Horizontal partitioning by user_id (future)
4. **Archive Tables** - Old data moved to archive tables (future)

---

## Data Integrity

### Constraints

1. **NOT NULL** - Applied to all required fields
2. **UNIQUE** - Applied to email, username, slugs
3. **CHECK** - Applied to enum-like fields
4. **FOREIGN KEY** - Applied to all relationships
5. **DEFAULT** - Applied to timestamps and status fields

### Cascading Deletes

- User deletion cascades to: roles, campaigns, support_requests, help_offers, enrollments, notifications
- Campaign deletion cascades to: members, intelligence_reports
- Channel deletion cascades to: members, messages
- Support request deletion cascades to: help_offers

---

## Security Considerations

### Sensitive Data

1. **Password Hashes** - Never store plain passwords
2. **Encrypted Messages** - Message content encrypted at rest
3. **Token Hashing** - Tokens hashed before storage
4. **PII Protection** - Phone numbers, addresses encrypted

### Access Control

1. **Row-Level Security** - PostgreSQL RLS policies (future)
2. **User Isolation** - Users can only see their own data
3. **Role-Based Access** - Different permissions per role
4. **Audit Trail** - All changes logged in audit_logs

---

## Future Extensions

### Planned Features

1. **Two-Factor Authentication** - TOTP codes stored in users table
2. **Social Login** - OAuth provider table
3. **Reporting System** - Content reports and moderation
4. **Blocking/Muting** - User blocks and channel mutes
5. **Subscriptions** - Premium features and billing
6. **API Keys** - Developer API access
7. **Webhooks** - Event notifications to external services
8. **Data Export** - User data export functionality

### Scalability Upgrades

1. **Elasticsearch** - Full-text search at scale
2. **Redis Streams** - Real-time event processing
3. **Kafka** - Event streaming for analytics
4. **TimescaleDB** - Time-series data for analytics
5. **Citus** - Distributed PostgreSQL for sharding

---

## Migration Strategy

### Initial Setup

1. Create all tables in order of dependencies
2. Create all indexes
3. Create all constraints
4. Seed initial data (roles, default users)

### Future Migrations

1. Use migration files for all schema changes
2. Test migrations on staging first
3. Plan for zero-downtime migrations
4. Maintain backward compatibility

---

## Conclusion

This schema provides a solid foundation for the resistance-hub-redesigned platform. It's designed to:

- Support all planned features without major rework
- Scale to millions of records
- Maintain data integrity and security
- Enable efficient querying and analytics
- Provide audit trails for compliance

The schema is ready for implementation in Phase 1.

---

**Status:** ✅ Design Complete - Ready for Implementation  
**Next Step:** Create database migration files
