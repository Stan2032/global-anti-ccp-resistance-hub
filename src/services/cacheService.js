/**
 * Cache Service - PostgreSQL UNLOGGED Tables
 * 
 * High-performance caching layer using PostgreSQL UNLOGGED tables.
 * 
 * Features:
 * - Fast writes (no WAL overhead)
 * - TTL support with automatic expiration
 * - Tag-based cache invalidation
 * - LRU eviction for memory management
 * - Bulk operations (mget, mset)
 * - Pattern-based deletion
 * - Cache statistics and monitoring
 * - Familiar SQL interface
 * - Transaction support
 * - Predictable memory usage
 */

import { query } from '../db/connection.js';
import logger from '../utils/logger.js';

// Default TTL: 1 hour
const DEFAULT_TTL = 3600;

/**
 * Set a cache entry
 * @param {string} key - Cache key
 * @param {any} value - Value to cache (any JSON-serializable type)
 * @param {number} ttl - Time to live in seconds (optional)
 * @param {string[]} tags - Tags for cache invalidation (optional)
 * @returns {Promise<boolean>} Success status
 */
export const set = async (key, value, ttl = DEFAULT_TTL, tags = []) => {
  try {
    const expiresAt = ttl ? new Date(Date.now() + ttl * 1000) : null;
    
    await query(
      `INSERT INTO cache (key, value, expires_at, tags, inserted_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (key) 
       DO UPDATE SET 
         value = EXCLUDED.value,
         expires_at = EXCLUDED.expires_at,
         tags = EXCLUDED.tags,
         inserted_at = NOW()`,
      [key, { data: value }, expiresAt, tags]
    );
    
    logger.debug('Cache set', { key, ttl, tags });
    return true;
  } catch (error) {
    logger.error('Cache set failed', { key, error: error.message });
    return false;
  }
};

/**
 * Get a cache entry
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} Cached value or null if not found/expired
 */
export const get = async (key) => {
  try {
    const result = await query(
      `SELECT value, expires_at 
       FROM cache 
       WHERE key = $1 
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [key]
    );
    
    if (result.rows.length === 0) {
      logger.debug('Cache miss', { key });
      return null;
    }
    
    const cached = result.rows[0];
    logger.debug('Cache hit', { key });
    
    // Update access tracking (async, don't wait)
    query(
      `UPDATE cache 
       SET last_accessed_at = NOW(), hit_count = hit_count + 1 
       WHERE key = $1`,
      [key]
    ).catch(err => logger.error('Cache access tracking failed', { key, error: err.message }));
    
    return cached.value.data;
  } catch (error) {
    logger.error('Cache get failed', { key, error: error.message });
    return null;
  }
};

/**
 * Delete a cache entry
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} Success status
 */
export const del = async (key) => {
  try {
    await query('DELETE FROM cache WHERE key = $1', [key]);
    logger.debug('Cache deleted', { key });
    return true;
  } catch (error) {
    logger.error('Cache delete failed', { key, error: error.message });
    return false;
  }
};

/**
 * Delete multiple cache entries by pattern
 * @param {string} pattern - SQL LIKE pattern (e.g., 'user:%')
 * @returns {Promise<number>} Number of deleted entries
 */
export const delPattern = async (pattern) => {
  try {
    const result = await query(
      'DELETE FROM cache WHERE key LIKE $1 RETURNING id',
      [pattern]
    );
    logger.debug('Cache pattern deleted', { pattern, count: result.rowCount });
    return result.rowCount;
  } catch (error) {
    logger.error('Cache pattern delete failed', { pattern, error: error.message });
    return 0;
  }
};

/**
 * Delete cache entries by tag
 * @param {string} tag - Tag to match
 * @returns {Promise<number>} Number of deleted entries
 */
export const delByTag = async (tag) => {
  try {
    const result = await query(
      'DELETE FROM cache WHERE $1 = ANY(tags) RETURNING id',
      [tag]
    );
    logger.debug('Cache tag deleted', { tag, count: result.rowCount });
    return result.rowCount;
  } catch (error) {
    logger.error('Cache tag delete failed', { tag, error: error.message });
    return 0;
  }
};

/**
 * Check if a cache key exists and is not expired
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} True if exists and not expired
 */
export const exists = async (key) => {
  try {
    const result = await query(
      `SELECT 1 FROM cache 
       WHERE key = $1 
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [key]
    );
    return result.rows.length > 0;
  } catch (error) {
    logger.error('Cache exists check failed', { key, error: error.message });
    return false;
  }
};

/**
 * Get multiple cache entries
 * @param {string[]} keys - Array of cache keys
 * @returns {Promise<Object>} Object with keys and their values
 */
export const mget = async (keys) => {
  try {
    const result = await query(
      `SELECT key, value 
       FROM cache 
       WHERE key = ANY($1) 
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [keys]
    );
    
    const cached = {};
    result.rows.forEach(row => {
      cached[row.key] = row.value.data;
    });
    
    logger.debug('Cache mget', { requested: keys.length, found: result.rows.length });
    return cached;
  } catch (error) {
    logger.error('Cache mget failed', { keys, error: error.message });
    return {};
  }
};

/**
 * Set multiple cache entries
 * @param {Object} entries - Object with key-value pairs
 * @param {number} ttl - Time to live in seconds (optional)
 * @returns {Promise<number>} Number of entries set
 */
export const mset = async (entries, ttl = DEFAULT_TTL) => {
  try {
    const expiresAt = ttl ? new Date(Date.now() + ttl * 1000) : null;
    const keys = Object.keys(entries);
    
    // Build bulk insert query
    const values = keys.map((key, i) => {
      const offset = i * 3;
      return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
    }).join(', ');
    
    const params = keys.flatMap(key => [
      key,
      { data: entries[key] },
      expiresAt
    ]);
    
    await query(
      `INSERT INTO cache (key, value, expires_at)
       VALUES ${values}
       ON CONFLICT (key) 
       DO UPDATE SET 
         value = EXCLUDED.value,
         expires_at = EXCLUDED.expires_at,
         inserted_at = NOW()`,
      params
    );
    
    logger.debug('Cache mset', { count: keys.length, ttl });
    return keys.length;
  } catch (error) {
    logger.error('Cache mset failed', { error: error.message });
    return 0;
  }
};

/**
 * Flush all cache entries
 * @returns {Promise<boolean>} Success status
 */
export const flush = async () => {
  try {
    await query('TRUNCATE cache');
    logger.info('Cache flushed');
    return true;
  } catch (error) {
    logger.error('Cache flush failed', { error: error.message });
    return false;
  }
};

/**
 * Get cache statistics
 * @returns {Promise<Object>} Cache statistics
 */
export const getStats = async () => {
  try {
    const result = await query('SELECT * FROM get_cache_stats()');
    return result.rows[0];
  } catch (error) {
    logger.error('Cache stats failed', { error: error.message });
    return null;
  }
};

/**
 * Manually trigger cache expiration
 * @returns {Promise<boolean>} Success status
 */
export const expire = async () => {
  try {
    await query('CALL expire_cache_entries()');
    logger.info('Cache expiration triggered');
    return true;
  } catch (error) {
    logger.error('Cache expiration failed', { error: error.message });
    return false;
  }
};

/**
 * Manually trigger LRU eviction
 * @param {number} maxEntries - Maximum number of entries to keep
 * @returns {Promise<boolean>} Success status
 */
export const evict = async (maxEntries = 10000) => {
  try {
    await query('CALL evict_lru_cache($1)', [maxEntries]);
    logger.info('Cache LRU eviction triggered', { maxEntries });
    return true;
  } catch (error) {
    logger.error('Cache eviction failed', { error: error.message });
    return false;
  }
};

/**
 * Wrap a function with caching
 * @param {string} key - Cache key
 * @param {Function} fn - Function to execute if cache miss
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<any>} Cached or computed value
 */
export const wrap = async (key, fn, ttl = DEFAULT_TTL) => {
  // Try to get from cache
  const cached = await get(key);
  if (cached !== null) {
    return cached;
  }
  
  // Execute function
  const value = await fn();
  
  // Store in cache
  await set(key, value, ttl);
  
  return value;
};

export default {
  set,
  get,
  del,
  delPattern,
  delByTag,
  exists,
  mget,
  mset,
  flush,
  getStats,
  expire,
  evict,
  wrap
};
