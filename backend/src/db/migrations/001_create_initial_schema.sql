-- Migration: Create initial database schema
-- Created: 2025-12-05
-- Description: Creates all core tables for the Resistance Hub platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- ROLES TABLE
-- ============================================================================
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  permissions TEXT[] DEFAULT '{}',
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_roles_name ON roles(name);

-- ============================================================================
-- USERS TABLE
-- ============================================================================
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
  expertise_areas TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  
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
CREATE INDEX idx_users_email_verified ON users(email_verified);

-- ============================================================================
-- USER ROLES TABLE
-- ============================================================================
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

-- ============================================================================
-- AUTHENTICATION TOKENS TABLE
-- ============================================================================
CREATE TABLE auth_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Token details
  token_type VARCHAR(50) NOT NULL,
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

-- ============================================================================
-- ORGANIZATIONS TABLE
-- ============================================================================
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
  operating_countries TEXT[] DEFAULT '{}',
  
  -- Organization details
  founded_year INTEGER,
  organization_type VARCHAR(100),
  focus_areas TEXT[] DEFAULT '{}',
  member_count INTEGER DEFAULT 0,
  
  -- Verification and trust
  verification_status VARCHAR(50) DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  verified_at TIMESTAMP,
  verified_by INTEGER REFERENCES users(id),
  trust_score DECIMAL(3,2) DEFAULT 0,
  
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
CREATE INDEX idx_organizations_verification_status ON organizations(verification_status);
CREATE INDEX idx_organizations_created_at ON organizations(created_at);

-- ============================================================================
-- CAMPAIGNS TABLE
-- ============================================================================
CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  banner_image_url VARCHAR(500),
  
  -- Campaign details
  campaign_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  
  -- Goals and progress
  goal_description TEXT,
  target_metric VARCHAR(255),
  target_value INTEGER,
  current_value INTEGER DEFAULT 0,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  
  -- Dates
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  
  -- Organization and leadership
  created_by INTEGER NOT NULL REFERENCES users(id),
  primary_organization_id INTEGER REFERENCES organizations(id),
  
  -- Geographic scope
  target_countries TEXT[] DEFAULT '{}',
  
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

-- ============================================================================
-- CAMPAIGN MEMBERS TABLE
-- ============================================================================
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

-- ============================================================================
-- INTELLIGENCE REPORTS TABLE
-- ============================================================================
CREATE TABLE intelligence_reports (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  
  -- Report details
  report_type VARCHAR(100),
  severity VARCHAR(50) DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  
  -- Source information
  source_name VARCHAR(255),
  source_url VARCHAR(500),
  source_type VARCHAR(100),
  source_verified BOOLEAN DEFAULT FALSE,
  
  -- Content
  tags TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  
  -- Media
  document_url VARCHAR(500),
  image_urls TEXT[] DEFAULT '{}',
  
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

-- ============================================================================
-- SUPPORT REQUESTS TABLE
-- ============================================================================
CREATE TABLE support_requests (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  
  -- Request details
  request_type VARCHAR(100),
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

-- ============================================================================
-- HELP OFFERS TABLE
-- ============================================================================
CREATE TABLE help_offers (
  id SERIAL PRIMARY KEY,
  support_request_id INTEGER NOT NULL REFERENCES support_requests(id) ON DELETE CASCADE,
  helper_id INTEGER NOT NULL REFERENCES users(id),
  
  -- Offer details
  message TEXT,
  expertise_areas TEXT[] DEFAULT '{}',
  availability VARCHAR(100),
  
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

-- ============================================================================
-- CHANNELS TABLE
-- ============================================================================
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

-- ============================================================================
-- CHANNEL MEMBERS TABLE
-- ============================================================================
CREATE TABLE channel_members (
  id SERIAL PRIMARY KEY,
  channel_id INTEGER NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Membership details
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'left')),
  
  -- Encryption keys
  public_key TEXT,
  
  -- Metadata
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP,
  
  UNIQUE(channel_id, user_id)
);

CREATE INDEX idx_channel_members_channel_id ON channel_members(channel_id);
CREATE INDEX idx_channel_members_user_id ON channel_members(user_id);

-- ============================================================================
-- MESSAGES TABLE
-- ============================================================================
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  channel_id INTEGER NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  
  -- Message content (encrypted)
  content TEXT NOT NULL,
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

-- ============================================================================
-- MODULES TABLE
-- ============================================================================
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  
  -- Module details
  category VARCHAR(100),
  level VARCHAR(50) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INTEGER,
  
  -- Content
  video_url VARCHAR(500),
  resource_urls TEXT[] DEFAULT '{}',
  
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

-- ============================================================================
-- MODULE ENROLLMENTS TABLE
-- ============================================================================
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

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Notification details
  type VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Related entity
  related_entity_type VARCHAR(100),
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

-- ============================================================================
-- AUDIT LOG TABLE
-- ============================================================================
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  
  -- Action details
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
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

-- ============================================================================
-- FILES TABLE
-- ============================================================================
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

-- ============================================================================
-- ANALYTICS EVENTS TABLE
-- ============================================================================
CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  
  -- Event details
  event_type VARCHAR(100),
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

-- ============================================================================
-- SEED DEFAULT ROLES
-- ============================================================================
INSERT INTO roles (name, description, permissions, is_system) VALUES
  ('admin', 'Full platform access', ARRAY['*'], TRUE),
  ('moderator', 'Content moderation and user management', ARRAY['users:read', 'users:update', 'campaigns:moderate', 'intelligence:moderate'], TRUE),
  ('organizer', 'Create and manage campaigns', ARRAY['campaigns:create', 'campaigns:read', 'campaigns:update', 'campaigns:delete'], TRUE),
  ('helper', 'Offer help in community support', ARRAY['support:read', 'support:help'], TRUE),
  ('user', 'Standard user with basic features', ARRAY['profile:read', 'profile:update', 'campaigns:read', 'intelligence:read'], TRUE),
  ('activist', 'Verified activist with special features', ARRAY['profile:read', 'profile:update', 'campaigns:read', 'campaigns:join', 'intelligence:read', 'support:create', 'support:help'], TRUE)
ON CONFLICT (name) DO NOTHING;
