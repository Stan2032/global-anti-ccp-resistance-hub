# PostgreSQL Caching System

**Status:** ✅ Production Ready  
**Test Coverage:** 20 cache tests + 17 integration tests passing

---

## Overview

High-performance caching layer using PostgreSQL UNLOGGED tables. Provides fast, reliable caching with zero additional infrastructure.

---

## Features

### Core Capabilities

- **Fast Writes** - UNLOGGED tables skip WAL, 2-3x faster than regular tables
- **TTL Support** - Automatic expiration with configurable time-to-live
- **Tag-Based Invalidation** - Group and invalidate related cache entries
- **LRU Eviction** - Memory management through least-recently-used eviction
- **Bulk Operations** - Efficient multi-key get/set operations
- **Pattern Deletion** - Delete cache entries matching SQL LIKE patterns
- **Statistics** - Real-time cache metrics and monitoring
- **Access Tracking** - Hit counts and last access timestamps
- **Wrap Function** - Simple cache-aside pattern implementation

### Benefits

- **Zero Additional Infrastructure** - Uses existing PostgreSQL database
- **Predictable Memory** - No unexpected memory spikes
- **Better Persistence** - More reliable than in-memory-only solutions
- **Familiar Interface** - SQL queries, same connection pool
- **Transaction Support** - Can use with database operations
- **Simple Operations** - One less service to maintain

---

## Quick Start

### Basic Usage

```javascript
import * as cache from './services/cacheService.js';

// Set a cache entry (1 hour TTL)
await cache.set('user:123', { name: 'John', age: 30 }, 3600);

// Get a cache entry
const user = await cache.get('user:123');
// Returns: { name: 'John', age: 30 }

// Delete a cache entry
await cache.del('user:123');

// Check if key exists
const exists = await cache.exists('user:123');
```

### Cache-Aside Pattern

```javascript
// Automatically cache expensive operations
const user = await cache.wrap(`user:${id}`, async () => {
    // This only runs on cache miss
    return await db.query('SELECT * FROM users WHERE id = $1', [id]);
}, 3600);
```

---

## API Reference

### set(key, value, ttl, tags)

Set a cache entry.

**Parameters:**
- `key` (string) - Cache key
- `value` (any) - Value to cache (any JSON-serializable type)
- `ttl` (number) - Time to live in seconds (default: 3600)
- `tags` (string[]) - Tags for invalidation (optional)

**Returns:** Promise<boolean>

**Example:**
```javascript
await cache.set('session:abc', sessionData, 3600, ['session', 'user:123']);
```

### get(key)

Get a cache entry.

**Parameters:**
- `key` (string) - Cache key

**Returns:** Promise<any|null> - Cached value or null if not found/expired

**Example:**
```javascript
const data = await cache.get('session:abc');
```

### del(key)

Delete a cache entry.

**Parameters:**
- `key` (string) - Cache key

**Returns:** Promise<boolean>

**Example:**
```javascript
await cache.del('session:abc');
```

### exists(key)

Check if a cache key exists and is not expired.

**Parameters:**
- `key` (string) - Cache key

**Returns:** Promise<boolean>

**Example:**
```javascript
if (await cache.exists('session:abc')) {
    // Cache hit
}
```

### mget(keys)

Get multiple cache entries.

**Parameters:**
- `keys` (string[]) - Array of cache keys

**Returns:** Promise<Object> - Object with keys and their values

**Example:**
```javascript
const values = await cache.mget(['user:1', 'user:2', 'user:3']);
// Returns: { 'user:1': {...}, 'user:2': {...}, 'user:3': {...} }
```

### mset(entries, ttl)

Set multiple cache entries.

**Parameters:**
- `entries` (Object) - Object with key-value pairs
- `ttl` (number) - Time to live in seconds (default: 3600)

**Returns:** Promise<number> - Number of entries set

**Example:**
```javascript
await cache.mset({
    'user:1': userData1,
    'user:2': userData2,
    'user:3': userData3
}, 3600);
```

### delPattern(pattern)

Delete cache entries matching a SQL LIKE pattern.

**Parameters:**
- `pattern` (string) - SQL LIKE pattern (e.g., 'user:%')

**Returns:** Promise<number> - Number of deleted entries

**Example:**
```javascript
// Delete all user cache entries
await cache.delPattern('user:%');
```

### delByTag(tag)

Delete cache entries by tag.

**Parameters:**
- `tag` (string) - Tag to match

**Returns:** Promise<number> - Number of deleted entries

**Example:**
```javascript
// Delete all entries tagged with 'user'
await cache.delByTag('user');
```

### flush()

Clear all cache entries.

**Returns:** Promise<boolean>

**Example:**
```javascript
await cache.flush();
```

### getStats()

Get cache statistics.

**Returns:** Promise<Object>

**Example:**
```javascript
const stats = await cache.getStats();
// {
//   total_entries: 1234,
//   total_size_bytes: 5242880,
//   expired_entries: 42,
//   avg_hit_count: 15.3,
//   oldest_entry: '2024-12-09T10:00:00Z',
//   newest_entry: '2024-12-09T19:00:00Z'
// }
```

### expire()

Manually trigger cache expiration.

**Returns:** Promise<boolean>

**Example:**
```javascript
await cache.expire();
```

### evict(maxEntries)

Manually trigger LRU eviction.

**Parameters:**
- `maxEntries` (number) - Maximum number of entries to keep (default: 10000)

**Returns:** Promise<boolean>

**Example:**
```javascript
// Keep only 5,000 most recently accessed entries
await cache.evict(5000);
```

### wrap(key, fn, ttl)

Wrap a function with caching (cache-aside pattern).

**Parameters:**
- `key` (string) - Cache key
- `fn` (Function) - Function to execute if cache miss
- `ttl` (number) - Time to live in seconds (default: 3600)

**Returns:** Promise<any> - Cached or computed value

**Example:**
```javascript
const user = await cache.wrap(`user:${id}`, async () => {
    return await db.query('SELECT * FROM users WHERE id = $1', [id]);
}, 3600);
```

---

## Performance Characteristics

### Write Performance

- **UNLOGGED tables:** 2-3x faster than regular tables
- **No WAL overhead:** Writes don't wait for disk sync
- **Bulk operations:** Efficient multi-row inserts

### Read Performance

- **Indexed lookups:** O(log n) with B-tree index
- **Connection pooling:** Reuses database connections
- **Typical latency:** ~2-5ms per operation

### Memory Usage

- **Predictable:** No unexpected memory spikes
- **Configurable:** Via PostgreSQL `shared_buffers`
- **Efficient:** JSONB compression

### Scalability

- **Good for moderate loads:** 1,000-10,000 req/sec
- **Single database:** Not distributed
- **Upgrade path:** DragonflyDB available if needed

---

## Database Schema

```sql
CREATE UNLOGGED TABLE cache (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,           -- Stores {data: actualValue}
    inserted_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP,           -- NULL = never expires
    tags TEXT[] DEFAULT '{}',       -- For tag-based invalidation
    hit_count INTEGER DEFAULT 0,    -- Access tracking
    last_accessed_at TIMESTAMP      -- LRU eviction
);

-- Indexes for performance
CREATE INDEX idx_cache_key ON cache (key);
CREATE INDEX idx_cache_expires_at ON cache (expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_cache_tags ON cache USING GIN (tags);
CREATE INDEX idx_cache_last_accessed ON cache (last_accessed_at);
```

---

## Monitoring

### Check Cache Statistics

```javascript
const stats = await cache.getStats();
console.log(`Cache entries: ${stats.total_entries}`);
console.log(`Cache size: ${(stats.total_size_bytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`Expired entries: ${stats.expired_entries}`);
console.log(`Average hit count: ${stats.avg_hit_count}`);
```

### Database Queries

```sql
-- View cache contents
SELECT key, value, inserted_at, expires_at FROM cache LIMIT 10;

-- Count entries
SELECT COUNT(*) FROM cache;

-- Find expired entries
SELECT COUNT(*) FROM cache WHERE expires_at < NOW();

-- View cache size
SELECT pg_size_pretty(pg_total_relation_size('cache'));

-- Top accessed entries
SELECT key, hit_count, last_accessed_at 
FROM cache 
ORDER BY hit_count DESC 
LIMIT 10;
```

---

## Maintenance

### Automatic Expiration (Optional)

Install `pg_cron` extension and schedule:

```sql
-- Install extension (requires superuser)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule hourly expiration
SELECT cron.schedule('cache-expiration', '0 * * * *', $$
    CALL expire_cache_entries();
$$);

-- Schedule daily LRU eviction
SELECT cron.schedule('cache-lru-eviction', '0 0 * * *', $$
    CALL evict_lru_cache(10000);
$$);
```

### Manual Maintenance

```bash
# Run expiration
psql $DATABASE_URL -c "CALL expire_cache_entries();"

# Run LRU eviction
psql $DATABASE_URL -c "CALL evict_lru_cache(10000);"

# Clear all cache
psql $DATABASE_URL -c "TRUNCATE cache;"
```

---

## Testing

### Test Coverage

20 comprehensive tests covering:
- Basic operations (set, get, del, exists)
- TTL and expiration
- Bulk operations (mget, mset)
- Pattern and tag operations
- Wrap function
- Cache statistics
- Cache flush
- All data types
- Update behavior

### Running Tests

```bash
npm test src/tests/cache.test.js
```

### Integration Tests

All 17 authentication tests pass with cache system:
- User registration
- Email verification
- Login/logout
- Password reset
- Token refresh
- Protected endpoints

---

## Troubleshooting

### Cache Not Working

1. **Check table exists:**
   ```sql
   SELECT 1 FROM cache LIMIT 1;
   ```

2. **Check permissions:**
   ```sql
   GRANT SELECT, INSERT, UPDATE, DELETE ON cache TO resistancehub;
   ```

3. **Check logs:**
   ```bash
   tail -f logs/app.log | grep cache
   ```

### Slow Performance

1. **Check indexes:**
   ```sql
   \d cache  -- Should show indexes
   ```

2. **Tune PostgreSQL:**
   ```sql
   -- Increase shared_buffers for more memory caching
   ALTER SYSTEM SET shared_buffers = '256MB';
   ```

3. **Check cache hit rate:**
   ```javascript
   const stats = await cache.getStats();
   console.log(`Avg hits: ${stats.avg_hit_count}`);
   ```

### Memory Issues

1. **Check cache size:**
   ```sql
   SELECT pg_size_pretty(pg_total_relation_size('cache'));
   ```

2. **Run LRU eviction:**
   ```javascript
   await cache.evict(5000);  // Keep only 5,000 entries
   ```

3. **Clear old entries:**
   ```javascript
   await cache.expire();
   ```

---

## Best Practices

### Cache Key Naming

Use consistent, hierarchical naming:
```javascript
// Good
'user:123:profile'
'user:123:settings'
'session:abc123'
'post:456:comments'

// Bad
'user123'
'settings'
'abc123'
```

### TTL Selection

Choose appropriate TTLs based on data volatility:
```javascript
// User profile (changes infrequently) - 1 hour
await cache.set('user:123:profile', data, 3600);

// Session data (needs freshness) - 15 minutes
await cache.set('session:abc', data, 900);

// Configuration (rarely changes) - 24 hours
await cache.set('config:app', data, 86400);

// Real-time data (changes constantly) - 1 minute
await cache.set('stats:live', data, 60);
```

### Tag Usage

Use tags for efficient invalidation:
```javascript
// Set with tags
await cache.set('user:123:profile', data, 3600, ['user', 'profile', 'user:123']);
await cache.set('user:123:settings', data, 3600, ['user', 'settings', 'user:123']);

// Invalidate all user:123 cache
await cache.delByTag('user:123');

// Invalidate all profile cache
await cache.delByTag('profile');
```

### Wrap Function

Use wrap for simple cache-aside pattern:
```javascript
// Good - automatic caching
const user = await cache.wrap(`user:${id}`, async () => {
    return await getUserFromDB(id);
}, 3600);

// Also good - manual control
let user = await cache.get(`user:${id}`);
if (!user) {
    user = await getUserFromDB(id);
    await cache.set(`user:${id}`, user, 3600);
}
```

---

## Production Deployment

### Environment Variables

```bash
# Database connection (cache uses same connection)
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
```

### Monitoring

Set up monitoring for:
- Cache hit rate
- Cache size
- Query performance
- Expired entries count

### Backup

UNLOGGED tables are not included in WAL, so:
- Data is lost on database crash (acceptable for cache)
- No need to backup cache table
- Cache rebuilds automatically on access

---

## Conclusion

The PostgreSQL caching system provides high-performance, reliable caching with zero additional infrastructure. It's production-ready, well-tested, and simple to operate.

**Status:** ✅ Ready for production deployment

---

**Tests:** See `src/tests/cache.test.js` for comprehensive test suite  
**Code:** See `src/services/cacheService.js` for implementation  
**Migration:** See `src/db/migrations/002_create_cache_table.sql` for database schema
