/**
 * Cache Service Tests - PostgreSQL UNLOGGED Tables
 * 
 * Tests the new PostgreSQL-based caching system
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import * as cache from '../services/cacheService.js';
import { query } from '../db/connection.js';

describe('Cache Service - PostgreSQL UNLOGGED Tables', () => {
  
  beforeAll(async () => {
    // Ensure cache table exists
    await query('SELECT 1 FROM cache LIMIT 1').catch(() => {
      throw new Error('Cache table not found. Run migrations first.');
    });
  });

  beforeEach(async () => {
    // Clear cache before each test
    await cache.flush();
  });

  afterAll(async () => {
    // Clean up
    await cache.flush();
  });

  describe('Basic Operations', () => {
    it('should set and get a cache entry', async () => {
      const key = 'test:key1';
      const value = { foo: 'bar', num: 123 };
      
      const setResult = await cache.set(key, value, 3600);
      expect(setResult).toBe(true);
      
      const getValue = await cache.get(key);
      expect(getValue).toEqual(value);
    });

    it('should return null for non-existent key', async () => {
      const value = await cache.get('non:existent');
      expect(value).toBe(null);
    });

    it('should delete a cache entry', async () => {
      const key = 'test:delete';
      await cache.set(key, 'value', 3600);
      
      const delResult = await cache.del(key);
      expect(delResult).toBe(true);
      
      const getValue = await cache.get(key);
      expect(getValue).toBe(null);
    });

    it('should check if key exists', async () => {
      const key = 'test:exists';
      await cache.set(key, 'value', 3600);
      
      const exists = await cache.exists(key);
      expect(exists).toBe(true);
      
      const notExists = await cache.exists('not:exists');
      expect(notExists).toBe(false);
    });
  });

  describe('TTL and Expiration', () => {
    it('should expire cache entry after TTL', async () => {
      const key = 'test:ttl';
      const value = 'expires soon';
      
      // Set with 1 second TTL
      await cache.set(key, value, 1);
      
      // Should exist immediately
      const immediate = await cache.get(key);
      expect(immediate).toBe(value);
      
      // Wait 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Should be expired
      const expired = await cache.get(key);
      expect(expired).toBe(null);
    }, 10000); // 10 second timeout for this test

    it('should not expire entry with no TTL', async () => {
      const key = 'test:no-ttl';
      const value = 'never expires';
      
      // Set with null TTL (no expiration)
      await cache.set(key, value, null);
      
      // Wait 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Should still exist
      const getValue = await cache.get(key);
      expect(getValue).toBe(value);
    }, 10000);
  });

  describe('Bulk Operations', () => {
    it('should get multiple cache entries', async () => {
      await cache.set('test:bulk1', 'value1', 3600);
      await cache.set('test:bulk2', 'value2', 3600);
      await cache.set('test:bulk3', 'value3', 3600);
      
      const values = await cache.mget(['test:bulk1', 'test:bulk2', 'test:bulk3', 'test:notexist']);
      
      expect(values['test:bulk1']).toBe('value1');
      expect(values['test:bulk2']).toBe('value2');
      expect(values['test:bulk3']).toBe('value3');
      expect(values['test:notexist']).toBeUndefined();
    });

    it('should set multiple cache entries', async () => {
      const entries = {
        'test:mset1': 'value1',
        'test:mset2': { foo: 'bar' },
        'test:mset3': [1, 2, 3]
      };
      
      const count = await cache.mset(entries, 3600);
      expect(count).toBe(3);
      
      const value1 = await cache.get('test:mset1');
      const value2 = await cache.get('test:mset2');
      const value3 = await cache.get('test:mset3');
      
      expect(value1).toBe('value1');
      expect(value2).toEqual({ foo: 'bar' });
      expect(value3).toEqual([1, 2, 3]);
    });
  });

  describe('Pattern and Tag Operations', () => {
    it('should delete entries by pattern', async () => {
      await cache.set('user:1:profile', 'data1', 3600);
      await cache.set('user:2:profile', 'data2', 3600);
      await cache.set('post:1:data', 'data3', 3600);
      
      const count = await cache.delPattern('user:%');
      expect(count).toBe(2);
      
      const user1 = await cache.get('user:1:profile');
      const post1 = await cache.get('post:1:data');
      
      expect(user1).toBe(null);
      expect(post1).toBe('data3');
    });

    it('should delete entries by tag', async () => {
      await cache.set('test:tag1', 'value1', 3600, ['user', 'profile']);
      await cache.set('test:tag2', 'value2', 3600, ['user', 'settings']);
      await cache.set('test:tag3', 'value3', 3600, ['post']);
      
      const count = await cache.delByTag('user');
      expect(count).toBe(2);
      
      const tag1 = await cache.get('test:tag1');
      const tag3 = await cache.get('test:tag3');
      
      expect(tag1).toBe(null);
      expect(tag3).toBe('value3');
    });
  });

  describe('Cache Wrap Function', () => {
    it('should execute function on cache miss', async () => {
      const key = 'test:wrap';
      let executionCount = 0;
      
      const fn = async () => {
        executionCount++;
        return { data: 'computed', count: executionCount };
      };
      
      // First call - cache miss, should execute function
      const result1 = await cache.wrap(key, fn, 3600);
      expect(result1.data).toBe('computed');
      expect(result1.count).toBe(1);
      expect(executionCount).toBe(1);
      
      // Second call - cache hit, should not execute function
      const result2 = await cache.wrap(key, fn, 3600);
      expect(result2.data).toBe('computed');
      expect(result2.count).toBe(1); // Same as first call
      expect(executionCount).toBe(1); // Function not executed again
    });
  });

  describe('Cache Statistics', () => {
    it('should return cache statistics', async () => {
      await cache.set('test:stats1', 'value1', 3600);
      await cache.set('test:stats2', 'value2', 3600);
      await cache.set('test:stats3', 'value3', 3600);
      
      const stats = await cache.getStats();
      
      expect(stats).toBeDefined();
      expect(stats.total_entries).toBeGreaterThanOrEqual(3);
      expect(stats.total_size_bytes).toBeGreaterThan(0);
    });
  });

  describe('Cache Flush', () => {
    it('should flush all cache entries', async () => {
      await cache.set('test:flush1', 'value1', 3600);
      await cache.set('test:flush2', 'value2', 3600);
      
      const flushResult = await cache.flush();
      expect(flushResult).toBe(true);
      
      const value1 = await cache.get('test:flush1');
      const value2 = await cache.get('test:flush2');
      
      expect(value1).toBe(null);
      expect(value2).toBe(null);
    });
  });

  describe('Data Types', () => {
    it('should handle string values', async () => {
      await cache.set('test:string', 'hello world', 3600);
      const value = await cache.get('test:string');
      expect(value).toBe('hello world');
    });

    it('should handle number values', async () => {
      await cache.set('test:number', 12345, 3600);
      const value = await cache.get('test:number');
      expect(value).toBe(12345);
    });

    it('should handle boolean values', async () => {
      await cache.set('test:boolean', true, 3600);
      const value = await cache.get('test:boolean');
      expect(value).toBe(true);
    });

    it('should handle object values', async () => {
      const obj = { foo: 'bar', nested: { a: 1, b: 2 } };
      await cache.set('test:object', obj, 3600);
      const value = await cache.get('test:object');
      expect(value).toEqual(obj);
    });

    it('should handle array values', async () => {
      const arr = [1, 2, 3, { foo: 'bar' }];
      await cache.set('test:array', arr, 3600);
      const value = await cache.get('test:array');
      expect(value).toEqual(arr);
    });

    it('should handle null values', async () => {
      await cache.set('test:null', null, 3600);
      const value = await cache.get('test:null');
      expect(value).toBe(null);
    });
  });

  describe('Update Behavior', () => {
    it('should update existing cache entry', async () => {
      const key = 'test:update';
      
      await cache.set(key, 'value1', 3600);
      const first = await cache.get(key);
      expect(first).toBe('value1');
      
      await cache.set(key, 'value2', 3600);
      const second = await cache.get(key);
      expect(second).toBe('value2');
    });
  });
});
