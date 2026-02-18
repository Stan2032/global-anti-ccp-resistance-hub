import { CacheService } from '../services/cacheService.js';

describe('CacheService', () => {
  let cache;

  beforeEach(() => {
    cache = new CacheService({ defaultTTL: 1000, maxEntries: 5 });
  });

  afterEach(() => {
    cache.stopCleanupInterval();
    cache.clear();
  });

  // ==========================================================================
  // BASIC OPERATIONS
  // ==========================================================================

  describe('set / get', () => {
    it('should store and retrieve a value', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('should store objects', () => {
      const obj = { id: 1, name: 'test' };
      cache.set('obj', obj);
      expect(cache.get('obj')).toEqual(obj);
    });

    it('should return undefined for missing keys', () => {
      expect(cache.get('nonexistent')).toBeUndefined();
    });

    it('should overwrite existing keys', () => {
      cache.set('key1', 'original');
      cache.set('key1', 'updated');
      expect(cache.get('key1')).toBe('updated');
    });
  });

  // ==========================================================================
  // TTL SUPPORT
  // ==========================================================================

  describe('TTL expiration', () => {
    it('should expire entries after TTL', async () => {
      cache.set('short', 'data', { ttl: 50 });
      expect(cache.get('short')).toBe('data');

      await new Promise((r) => setTimeout(r, 80));
      expect(cache.get('short')).toBeUndefined();
    });

    it('should respect custom TTL per entry', async () => {
      cache.set('fast', 'gone', { ttl: 30 });
      cache.set('slow', 'stays', { ttl: 500 });

      await new Promise((r) => setTimeout(r, 60));
      expect(cache.get('fast')).toBeUndefined();
      expect(cache.get('slow')).toBe('stays');
    });

    it('should not expire entries with ttl=0 (infinite)', () => {
      cache.set('forever', 'data', { ttl: 0 });
      expect(cache.get('forever')).toBe('data');
    });
  });

  // ==========================================================================
  // HAS / DELETE
  // ==========================================================================

  describe('has', () => {
    it('should return true for existing keys', () => {
      cache.set('key1', 'val');
      expect(cache.has('key1')).toBe(true);
    });

    it('should return false for missing keys', () => {
      expect(cache.has('nope')).toBe(false);
    });
  });

  describe('delete', () => {
    it('should remove a key', () => {
      cache.set('key1', 'val');
      expect(cache.delete('key1')).toBe(true);
      expect(cache.get('key1')).toBeUndefined();
    });

    it('should return false when deleting nonexistent key', () => {
      expect(cache.delete('nope')).toBe(false);
    });
  });

  // ==========================================================================
  // TAG-BASED INVALIDATION
  // ==========================================================================

  describe('tag-based invalidation', () => {
    it('should invalidate entries by tag', () => {
      cache.set('a', 1, { tags: ['group1'] });
      cache.set('b', 2, { tags: ['group1'] });
      cache.set('c', 3, { tags: ['group2'] });

      const removed = cache.invalidateByTag('group1');
      expect(removed).toBe(2);
      expect(cache.get('a')).toBeUndefined();
      expect(cache.get('b')).toBeUndefined();
      expect(cache.get('c')).toBe(3);
    });

    it('should return 0 for unknown tag', () => {
      expect(cache.invalidateByTag('unknown')).toBe(0);
    });

    it('should handle entries with multiple tags', () => {
      cache.set('x', 10, { tags: ['t1', 't2'] });
      cache.set('y', 20, { tags: ['t2'] });

      cache.invalidateByTag('t1');
      expect(cache.get('x')).toBeUndefined();
      expect(cache.get('y')).toBe(20);
    });
  });

  // ==========================================================================
  // LRU EVICTION
  // ==========================================================================

  describe('LRU eviction', () => {
    it('should evict the least recently used entry when at capacity', () => {
      // maxEntries = 5
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.set('d', 4);
      cache.set('e', 5);

      // Access 'a' to make it recently used
      cache.get('a');

      // Adding a sixth should evict 'b' (the least recently accessed)
      cache.set('f', 6);

      expect(cache.get('a')).toBe(1); // accessed recently, kept
      expect(cache.get('b')).toBeUndefined(); // evicted
      expect(cache.get('f')).toBe(6); // just added
    });

    it('should not evict when overwriting an existing key', () => {
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.set('d', 4);
      cache.set('e', 5);

      // Overwrite 'a' – should NOT trigger eviction
      cache.set('a', 100);
      expect(cache.size).toBe(5);
      expect(cache.get('a')).toBe(100);
      expect(cache.get('b')).toBe(2); // still present
    });
  });

  // ==========================================================================
  // CLEAR & SIZE & STATS
  // ==========================================================================

  describe('clear', () => {
    it('should remove all entries', () => {
      cache.set('a', 1);
      cache.set('b', 2);
      cache.clear();
      expect(cache.size).toBe(0);
      expect(cache.get('a')).toBeUndefined();
    });
  });

  describe('size', () => {
    it('should reflect the number of stored entries', () => {
      expect(cache.size).toBe(0);
      cache.set('a', 1);
      expect(cache.size).toBe(1);
      cache.set('b', 2);
      expect(cache.size).toBe(2);
      cache.delete('a');
      expect(cache.size).toBe(1);
    });
  });

  describe('stats', () => {
    it('should return cache statistics', () => {
      cache.set('a', 1, { tags: ['t1'] });
      cache.set('b', 2, { tags: ['t2'] });
      const s = cache.stats();
      expect(s.size).toBe(2);
      expect(s.maxEntries).toBe(5);
      expect(s.tags).toBe(2);
    });
  });

  // ==========================================================================
  // CLEANUP
  // ==========================================================================

  describe('cleanup', () => {
    it('should remove expired entries', async () => {
      cache.set('short', 'data', { ttl: 30 });
      cache.set('long', 'data', { ttl: 5000 });

      await new Promise((r) => setTimeout(r, 60));

      const removed = cache.cleanup();
      expect(removed).toBe(1);
      expect(cache.get('short')).toBeUndefined();
      expect(cache.get('long')).toBe('data');
    });

    it('should start and stop cleanup interval', () => {
      cache.startCleanupInterval(100);
      expect(cache._cleanupInterval).not.toBeNull();

      cache.stopCleanupInterval();
      expect(cache._cleanupInterval).toBeNull();
    });
  });
});
