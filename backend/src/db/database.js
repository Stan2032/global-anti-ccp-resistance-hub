/**
 * Database wrapper module
 * Supports both PostgreSQL (production) and SQLite (development/testing)
 */
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || '';
const isProduction = process.env.NODE_ENV === 'production';
const useSQLite = DATABASE_URL.startsWith('sqlite://') || !isProduction;

let db;

if (useSQLite) {
  // Use better-sqlite3 for synchronous SQLite (simpler for testing)
  // For now, use an in-memory mock for testing
  logger.info('Using in-memory mock database for testing');
  
  // In-memory storage
  const storage = {
    feed_sources: [
      {
        id: 1,
        name: 'ICIJ',
        slug: 'icij',
        url: 'https://www.icij.org/feed/',
        category: 'investigations',
        is_active: true,
        poll_interval_minutes: 15,
        last_polled_at: null,
        items_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null
      },
      {
        id: 2,
        name: 'Radio Free Asia',
        slug: 'rfa',
        url: 'https://www.rfa.org/english/news/rss2.xml',
        category: 'news',
        is_active: true,
        poll_interval_minutes: 15,
        last_polled_at: null,
        items_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null
      },
      {
        id: 3,
        name: 'Hong Kong Free Press',
        slug: 'hkfp',
        url: 'https://hongkongfp.com/feed/',
        category: 'news',
        is_active: true,
        poll_interval_minutes: 15,
        last_polled_at: null,
        items_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null
      },
      {
        id: 4,
        name: 'ASPI Strategist',
        slug: 'aspi',
        url: 'https://www.aspistrategist.org.au/feed/',
        category: 'analysis',
        is_active: true,
        poll_interval_minutes: 15,
        last_polled_at: null,
        items_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null
      }
    ],
    feed_items: [],
    users: [],
    campaigns: []
  };

  // Mock query function that simulates PostgreSQL responses
  const query = async (text, params = []) => {
    const normalizedQuery = text.toLowerCase().trim();
    
    try {
      // SELECT queries for feed_sources
      if (normalizedQuery.includes('select') && normalizedQuery.includes('feed_sources')) {
        let results = [...storage.feed_sources].filter(s => s.deleted_at === null);
        
        if (normalizedQuery.includes('is_active = true')) {
          results = results.filter(s => s.is_active);
        }
        
        if (normalizedQuery.includes('where id =') && params[0]) {
          results = results.filter(s => s.id === params[0]);
        }
        
        return { rows: results, rowCount: results.length };
      }
      
      // SELECT queries for feed_items
      if (normalizedQuery.includes('select') && normalizedQuery.includes('feed_items')) {
        let results = [...storage.feed_items];
        
        // Handle source_id filter
        if (normalizedQuery.includes('source_id =') && params.length > 0) {
          const sourceIdIndex = normalizedQuery.indexOf('source_id =');
          results = results.filter(item => item.source_id === params[0]);
        }
        
        // Sort by published_at DESC
        results.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        
        // Handle LIMIT and OFFSET
        const limitMatch = normalizedQuery.match(/limit\s+(\d+)/);
        const offsetMatch = normalizedQuery.match(/offset\s+(\d+)/);
        
        if (offsetMatch) {
          results = results.slice(parseInt(offsetMatch[1]));
        }
        if (limitMatch) {
          results = results.slice(0, parseInt(limitMatch[1]));
        }
        
        return { rows: results, rowCount: results.length };
      }
      
      // INSERT into feed_items
      if (normalizedQuery.includes('insert') && normalizedQuery.includes('feed_items')) {
        const newItem = {
          id: storage.feed_items.length + 1,
          source_id: params[0],
          guid: params[1],
          title: params[2],
          link: params[3],
          description: params[4],
          content: params[5],
          author: params[6],
          published_at: params[7],
          image_url: params[8],
          categories: params[9],
          relevance_score: params[10] || 0.5,
          view_count: 0,
          share_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        storage.feed_items.push(newItem);
        return { rows: [newItem], rowCount: 1 };
      }
      
      // UPDATE feed_sources (last_polled_at)
      if (normalizedQuery.includes('update') && normalizedQuery.includes('feed_sources')) {
        const sourceId = params[params.length - 1];
        const source = storage.feed_sources.find(s => s.id === sourceId);
        if (source) {
          source.last_polled_at = new Date().toISOString();
          source.updated_at = new Date().toISOString();
        }
        return { rows: [], rowCount: 1 };
      }
      
      // UPDATE feed_items (view_count, share_count)
      if (normalizedQuery.includes('update') && normalizedQuery.includes('feed_items')) {
        const itemId = params[params.length - 1];
        const item = storage.feed_items.find(i => i.id === itemId);
        if (item) {
          if (normalizedQuery.includes('view_count')) {
            item.view_count = (item.view_count || 0) + 1;
          }
          if (normalizedQuery.includes('share_count')) {
            item.share_count = (item.share_count || 0) + 1;
          }
          item.updated_at = new Date().toISOString();
          return { rows: [item], rowCount: 1 };
        }
        return { rows: [], rowCount: 0 };
      }
      
      // COUNT queries
      if (normalizedQuery.includes('count(*)')) {
        if (normalizedQuery.includes('feed_items')) {
          let count = storage.feed_items.length;
          
          // Filter by date if needed
          if (normalizedQuery.includes('created_at >=')) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            count = storage.feed_items.filter(i => new Date(i.created_at) >= today).length;
          }
          
          return { rows: [{ count }], rowCount: 1 };
        }
        return { rows: [{ count: 0 }], rowCount: 1 };
      }
      
      // SUM queries
      if (normalizedQuery.includes('sum(')) {
        return { rows: [{ sum: 0 }], rowCount: 1 };
      }
      
      // Default empty result
      return { rows: [], rowCount: 0 };
      
    } catch (error) {
      logger.error('Mock database query error', { text, error: error.message });
      throw error;
    }
  };

  db = {
    query,
    getClient: async () => ({ 
      query,
      release: () => {} 
    }),
    closePool: async () => {
      logger.info('Mock database closed');
    },
    pool: null,
    storage // Expose storage for testing
  };
  
} else {
  // Use PostgreSQL for production
  import('./connection.js').then(module => {
    db = {
      query: module.query,
      getClient: module.getClient,
      closePool: module.closePool,
      pool: module.default
    };
  });
}

export default db;
export const query = (text, params) => db.query(text, params);
export const getClient = () => db.getClient();
export const closePool = () => db.closePool();
