/**
 * Cache Service - In-memory cache with TTL support
 * 
 * Provides a lightweight caching layer using an in-memory Map.
 * Designed as a PostgreSQL-free alternative to Redis for simple
 * key-value caching needs.
 *
 * Features:
 * - TTL (Time-To-Live) support with automatic expiration
 * - Tag-based cache invalidation
 * - LRU eviction when max entries exceeded
 * - Namespace support for logical grouping
 */
import logger from '../utils/logger.js';

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes
const DEFAULT_MAX_ENTRIES = 1000;

class CacheService {
  /**
   * @param {object} options
   * @param {number} [options.defaultTTL] - Default TTL in milliseconds
   * @param {number} [options.maxEntries] - Maximum number of cache entries before LRU eviction
   */
  constructor(options = {}) {
    this.defaultTTL = options.defaultTTL || DEFAULT_TTL_MS;
    this.maxEntries = options.maxEntries || DEFAULT_MAX_ENTRIES;

    /** Monotonically increasing counter for LRU ordering */
    this._accessCounter = 0;

    /** @type {Map<string, {value: any, expiresAt: number, tags: string[], lastAccessed: number}>} */
    this.store = new Map();

    /** @type {Map<string, Set<string>>} tag -> set of keys */
    this.tagIndex = new Map();

    this._cleanupInterval = null;
  }

  // ---------------------------------------------------------------------------
  // Core operations
  // ---------------------------------------------------------------------------

  /**
   * Store a value in the cache.
   * @param {string} key
   * @param {any} value
   * @param {object} [options]
   * @param {number} [options.ttl] - TTL in milliseconds (overrides default)
   * @param {string[]} [options.tags] - Tags for group invalidation
   * @returns {boolean} true if stored successfully
   */
  set(key, value, options = {}) {
    const ttl = options.ttl != null ? options.ttl : this.defaultTTL;
    const tags = options.tags || [];

    // Evict if at capacity and key is new
    if (!this.store.has(key) && this.store.size >= this.maxEntries) {
      this._evictLRU();
    }

    // Remove previous entry from tag index if it exists
    const existing = this.store.get(key);
    if (existing) {
      this._removeFromTagIndex(key, existing.tags);
    }

    const entry = {
      value,
      expiresAt: ttl > 0 ? Date.now() + ttl : Infinity,
      tags,
      lastAccessed: ++this._accessCounter
    };

    // Delete and re-set to push key to end of Map iteration order (most recently used)
    this.store.delete(key);
    this.store.set(key, entry);

    // Update tag index
    for (const tag of tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag).add(key);
    }

    logger.debug('Cache SET', { key, ttl, tags });
    return true;
  }

  /**
   * Retrieve a value from the cache.
   * Returns undefined for expired or missing entries.
   * @param {string} key
   * @returns {any|undefined}
   */
  get(key) {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      return undefined;
    }

    // Update access counter for LRU
    entry.lastAccessed = ++this._accessCounter;
    return entry.value;
  }

  /**
   * Check whether a key exists and is not expired.
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== undefined;
  }

  /**
   * Delete a single key from the cache.
   * @param {string} key
   * @returns {boolean} true if key existed
   */
  delete(key) {
    const entry = this.store.get(key);
    if (!entry) return false;

    this._removeFromTagIndex(key, entry.tags);
    this.store.delete(key);
    logger.debug('Cache DELETE', { key });
    return true;
  }

  /**
   * Invalidate all entries that share the given tag.
   * @param {string} tag
   * @returns {number} number of entries removed
   */
  invalidateByTag(tag) {
    const keys = this.tagIndex.get(tag);
    if (!keys) return 0;

    let count = 0;
    for (const key of keys) {
      const entry = this.store.get(key);
      if (entry) {
        this._removeFromTagIndex(key, entry.tags);
        this.store.delete(key);
        count++;
      }
    }
    this.tagIndex.delete(tag);
    logger.debug('Cache INVALIDATE_TAG', { tag, count });
    return count;
  }

  /**
   * Clear all entries from the cache.
   */
  clear() {
    const size = this.store.size;
    this.store.clear();
    this.tagIndex.clear();
    logger.debug('Cache CLEAR', { entriesRemoved: size });
  }

  /**
   * Return the current number of (non-expired) entries.
   * Note: does not actively prune expired entries; use cleanup() for that.
   * @returns {number}
   */
  get size() {
    return this.store.size;
  }

  /**
   * Return basic cache statistics.
   * @returns {{size: number, maxEntries: number, tags: number}}
   */
  stats() {
    return {
      size: this.store.size,
      maxEntries: this.maxEntries,
      tags: this.tagIndex.size
    };
  }

  // ---------------------------------------------------------------------------
  // Maintenance
  // ---------------------------------------------------------------------------

  /**
   * Remove all expired entries.
   * @returns {number} number of entries removed
   */
  cleanup() {
    const now = Date.now();
    let count = 0;

    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) {
        this._removeFromTagIndex(key, entry.tags);
        this.store.delete(key);
        count++;
      }
    }

    if (count > 0) {
      logger.debug('Cache CLEANUP', { removed: count });
    }
    return count;
  }

  /**
   * Start a periodic cleanup interval.
   * @param {number} [intervalMs=60000] - Cleanup interval in ms (default 60s)
   */
  startCleanupInterval(intervalMs = 60_000) {
    this.stopCleanupInterval();
    this._cleanupInterval = setInterval(() => this.cleanup(), intervalMs);
    // Allow the process to exit even if the timer is running
    if (this._cleanupInterval.unref) {
      this._cleanupInterval.unref();
    }
  }

  /**
   * Stop the periodic cleanup interval.
   */
  stopCleanupInterval() {
    if (this._cleanupInterval) {
      clearInterval(this._cleanupInterval);
      this._cleanupInterval = null;
    }
  }

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  /** Evict the least-recently-used entry. */
  _evictLRU() {
    let oldestKey = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.store) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey !== null) {
      logger.debug('Cache LRU_EVICT', { key: oldestKey });
      this.delete(oldestKey);
    }
  }

  /** Remove a key from the tag index for the given tags. */
  _removeFromTagIndex(key, tags) {
    for (const tag of tags) {
      const keys = this.tagIndex.get(tag);
      if (keys) {
        keys.delete(key);
        if (keys.size === 0) {
          this.tagIndex.delete(tag);
        }
      }
    }
  }
}

// Export a singleton instance for application-wide use
const cacheService = new CacheService();
export default cacheService;

// Also export the class for testing / custom instances
export { CacheService };
