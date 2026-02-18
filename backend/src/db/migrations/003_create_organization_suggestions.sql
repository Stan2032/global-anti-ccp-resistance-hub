-- Migration: Create organization suggestions table
-- Created: 2026-02-18
-- Description: Creates table for user-submitted organization suggestions

-- ============================================================================
-- ORGANIZATION SUGGESTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS organization_suggestions (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
  suggested_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Suggestion details
  change_type VARCHAR(20) NOT NULL CHECK (change_type IN ('new', 'edit', 'flag')),
  proposed_changes JSONB NOT NULL,
  reason TEXT,
  
  -- Status tracking
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by_user_id INTEGER REFERENCES users(id),
  review_notes TEXT,
  reviewed_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_organization_suggestions_organization_id ON organization_suggestions(organization_id);
CREATE INDEX idx_organization_suggestions_suggested_by_user_id ON organization_suggestions(suggested_by_user_id);
CREATE INDEX idx_organization_suggestions_status ON organization_suggestions(status);
CREATE INDEX idx_organization_suggestions_change_type ON organization_suggestions(change_type);
CREATE INDEX idx_organization_suggestions_created_at ON organization_suggestions(created_at DESC);

-- ============================================================================
-- TRIGGER: Update timestamp
-- ============================================================================
CREATE TRIGGER update_organization_suggestions_updated_at BEFORE UPDATE ON organization_suggestions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
