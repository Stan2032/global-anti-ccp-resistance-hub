-- Migration: Create feed sources and feed items tables
-- Created: 2025-12-16
-- Description: Creates tables for RSS feed aggregation and live feed broadcasting

-- ============================================================================
-- FEED SOURCES TABLE
-- ============================================================================
CREATE TABLE feed_sources (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  
  -- Feed details
  feed_url VARCHAR(500) UNIQUE NOT NULL,
  website_url VARCHAR(500),
  feed_type VARCHAR(50) DEFAULT 'rss' CHECK (feed_type IN ('rss', 'atom', 'json')),
  
  -- Source verification and trust
  verification_status VARCHAR(50) DEFAULT 'verified' CHECK (verification_status IN ('verified', 'unverified', 'suspicious')),
  trust_score DECIMAL(3,2) DEFAULT 1.00,
  
  -- Categorization
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  focus_areas TEXT[] DEFAULT '{}',
  
  -- Polling configuration
  is_active BOOLEAN DEFAULT TRUE,
  poll_interval_minutes INTEGER DEFAULT 15,
  last_polled_at TIMESTAMP,
  last_successful_poll_at TIMESTAMP,
  last_error TEXT,
  consecutive_errors INTEGER DEFAULT 0,
  
  -- Feed metadata
  language VARCHAR(10) DEFAULT 'en',
  update_frequency VARCHAR(50),
  
  -- Statistics
  total_items_fetched INTEGER DEFAULT 0,
  items_this_week INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_feed_sources_slug ON feed_sources(slug);
CREATE INDEX idx_feed_sources_is_active ON feed_sources(is_active);
CREATE INDEX idx_feed_sources_last_polled_at ON feed_sources(last_polled_at);
CREATE INDEX idx_feed_sources_category ON feed_sources(category);

-- ============================================================================
-- FEED ITEMS TABLE
-- ============================================================================
CREATE TABLE feed_items (
  id SERIAL PRIMARY KEY,
  feed_source_id INTEGER NOT NULL REFERENCES feed_sources(id) ON DELETE CASCADE,
  
  -- Item identification
  guid VARCHAR(500) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  link VARCHAR(1000) NOT NULL,
  
  -- Content
  description TEXT,
  content TEXT,
  
  -- Authorship and publication
  author VARCHAR(255),
  published_at TIMESTAMP NOT NULL,
  
  -- Categorization
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  
  -- Media
  image_url VARCHAR(1000),
  media_urls TEXT[] DEFAULT '{}',
  
  -- Relevance scoring
  relevance_score DECIMAL(3,2) DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_breaking BOOLEAN DEFAULT FALSE,
  
  -- Engagement tracking
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  
  -- Moderation
  is_visible BOOLEAN DEFAULT TRUE,
  moderation_status VARCHAR(50) DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
  moderated_at TIMESTAMP,
  moderated_by INTEGER REFERENCES users(id),
  moderation_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_feed_items_feed_source_id ON feed_items(feed_source_id);
CREATE INDEX idx_feed_items_guid ON feed_items(guid);
CREATE INDEX idx_feed_items_published_at ON feed_items(published_at DESC);
CREATE INDEX idx_feed_items_is_visible ON feed_items(is_visible);
CREATE INDEX idx_feed_items_is_featured ON feed_items(is_featured);
CREATE INDEX idx_feed_items_is_breaking ON feed_items(is_breaking);
CREATE INDEX idx_feed_items_relevance_score ON feed_items(relevance_score DESC);
CREATE INDEX idx_feed_items_created_at ON feed_items(created_at DESC);

-- ============================================================================
-- USER FEED BOOKMARKS TABLE
-- ============================================================================
CREATE TABLE user_feed_bookmarks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feed_item_id INTEGER NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
  
  -- Bookmark details
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, feed_item_id)
);

CREATE INDEX idx_user_feed_bookmarks_user_id ON user_feed_bookmarks(user_id);
CREATE INDEX idx_user_feed_bookmarks_feed_item_id ON user_feed_bookmarks(feed_item_id);

-- ============================================================================
-- FEED ITEM SHARES TABLE
-- ============================================================================
CREATE TABLE feed_item_shares (
  id SERIAL PRIMARY KEY,
  feed_item_id INTEGER NOT NULL REFERENCES feed_items(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  
  -- Share details
  platform VARCHAR(50) CHECK (platform IN ('twitter', 'facebook', 'telegram', 'whatsapp', 'email', 'copy_link', 'other')),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX idx_feed_item_shares_feed_item_id ON feed_item_shares(feed_item_id);
CREATE INDEX idx_feed_item_shares_user_id ON feed_item_shares(user_id);
CREATE INDEX idx_feed_item_shares_platform ON feed_item_shares(platform);
CREATE INDEX idx_feed_item_shares_created_at ON feed_item_shares(created_at);

-- ============================================================================
-- SEED DATA: Initial Feed Sources
-- ============================================================================
INSERT INTO feed_sources (name, slug, description, feed_url, website_url, category, focus_areas, trust_score, verification_status) VALUES
  (
    'ICIJ',
    'icij',
    'International Consortium of Investigative Journalists - Global investigative journalism on corruption, financial crimes, and human rights violations',
    'https://www.icij.org/feed/',
    'https://www.icij.org',
    'investigative_journalism',
    ARRAY['corruption', 'financial_crimes', 'human_rights', 'ccp_influence'],
    1.00,
    'verified'
  ),
  (
    'Radio Free Asia',
    'radio-free-asia',
    'Independent news on China, Hong Kong, Tibet, Uyghurs, North Korea - Focus on human rights and political repression',
    'https://www.rfa.org/english/rss2.xml',
    'https://www.rfa.org',
    'news',
    ARRAY['china', 'hong_kong', 'tibet', 'uyghurs', 'north_korea', 'human_rights'],
    1.00,
    'verified'
  ),
  (
    'Hong Kong Free Press',
    'hong-kong-free-press',
    'Independent news on Hong Kong - National security law, protests, freedoms',
    'https://hongkongfp.com/feed/',
    'https://hongkongfp.com',
    'news',
    ARRAY['hong_kong', 'national_security_law', 'protests', 'freedoms'],
    1.00,
    'verified'
  ),
  (
    'ASPI - The Strategist',
    'aspi-strategist',
    'Australian Strategic Policy Institute - Research on CCP influence, Xinjiang, cyber threats, Indo-Pacific security',
    'https://www.aspistrategist.org.au/feed/',
    'https://www.aspistrategist.org.au',
    'research',
    ARRAY['ccp_influence', 'xinjiang', 'cyber_threats', 'indo_pacific', 'national_security'],
    1.00,
    'verified'
  );

-- ============================================================================
-- TRIGGERS: Update timestamps
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_feed_sources_updated_at BEFORE UPDATE ON feed_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feed_items_updated_at BEFORE UPDATE ON feed_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
