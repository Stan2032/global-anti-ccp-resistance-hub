-- ============================================================================
-- CACHE TABLE MIGRATION
-- ============================================================================
-- Creates UNLOGGED table for caching to replace Redis
-- UNLOGGED tables don't write to WAL = much faster writes
-- Trade-off: Data lost on crash (acceptable for cache)
-- ============================================================================

-- Drop existing cache table if exists
DROP TABLE IF EXISTS cache CASCADE;

-- Create UNLOGGED cache table
CREATE UNLOGGED TABLE cache (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    inserted_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP,
    tags TEXT[] DEFAULT '{}',
    hit_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_cache_key ON cache (key);
CREATE INDEX idx_cache_expires_at ON cache (expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_cache_tags ON cache USING GIN (tags);
CREATE INDEX idx_cache_last_accessed ON cache (last_accessed_at);

-- Create function to automatically update last_accessed_at on read
CREATE OR REPLACE FUNCTION update_cache_access() RETURNS TRIGGER AS $$
BEGIN
    NEW.last_accessed_at = NOW();
    NEW.hit_count = OLD.hit_count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for cache access tracking (optional, can disable for performance)
-- Commented out by default as it adds overhead on every read
-- CREATE TRIGGER cache_access_trigger
--     BEFORE UPDATE ON cache
--     FOR EACH ROW
--     WHEN (OLD.value = NEW.value) -- Only update if it's a read, not a write
--     EXECUTE FUNCTION update_cache_access();

-- Create procedure to expire old cache entries
CREATE OR REPLACE PROCEDURE expire_cache_entries() AS $$
BEGIN
    -- Delete entries that have explicit expiration times
    DELETE FROM cache
    WHERE expires_at IS NOT NULL AND expires_at < NOW();
    
    -- Delete entries older than 24 hours with no explicit expiration
    DELETE FROM cache
    WHERE expires_at IS NULL AND inserted_at < NOW() - INTERVAL '24 hours';
    
    COMMIT;
END;
$$ LANGUAGE plpgsql;

-- Create procedure for LRU eviction (optional, for memory management)
CREATE OR REPLACE PROCEDURE evict_lru_cache(max_entries INTEGER DEFAULT 10000) AS $$
BEGIN
    -- Keep only the most recently accessed entries
    DELETE FROM cache
    WHERE id NOT IN (
        SELECT id FROM cache
        ORDER BY last_accessed_at DESC NULLS LAST
        LIMIT max_entries
    );
    
    COMMIT;
END;
$$ LANGUAGE plpgsql;

-- Create function to get cache statistics
CREATE OR REPLACE FUNCTION get_cache_stats()
RETURNS TABLE (
    total_entries BIGINT,
    total_size_bytes BIGINT,
    expired_entries BIGINT,
    avg_hit_count NUMERIC,
    oldest_entry TIMESTAMP,
    newest_entry TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT as total_entries,
        pg_total_relation_size('cache')::BIGINT as total_size_bytes,
        COUNT(*) FILTER (WHERE expires_at < NOW())::BIGINT as expired_entries,
        AVG(hit_count)::NUMERIC as avg_hit_count,
        MIN(inserted_at) as oldest_entry,
        MAX(inserted_at) as newest_entry
    FROM cache;
END;
$$ LANGUAGE plpgsql;

-- Install pg_cron extension if not exists (requires superuser)
-- This allows scheduling of cache expiration
-- Note: May need to be run manually with superuser privileges
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule cache expiration to run every hour
-- Uncomment after pg_cron is installed
-- SELECT cron.schedule('cache-expiration', '0 * * * *', $$CALL expire_cache_entries();$$);

-- Schedule LRU eviction to run daily (keeps cache under 10,000 entries)
-- Uncomment after pg_cron is installed
-- SELECT cron.schedule('cache-lru-eviction', '0 0 * * *', $$CALL evict_lru_cache(10000);$$);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON cache TO resistancehub;
GRANT USAGE, SELECT ON SEQUENCE cache_id_seq TO resistancehub;

-- Add comment
COMMENT ON TABLE cache IS 'UNLOGGED cache table for high-performance caching (replaces Redis)';
