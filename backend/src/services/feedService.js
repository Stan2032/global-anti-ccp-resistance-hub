import Parser from 'rss-parser';
import db from '../db/database.js';
import logger from '../utils/logger.js';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

/**
 * Feed Service
 * Handles RSS feed polling, parsing, and storage
 */
class FeedService {
  /**
   * Get all active feed sources
   */
  async getActiveFeedSources() {
    const query = `
      SELECT * FROM feed_sources
      WHERE is_active = true
      AND deleted_at IS NULL
      ORDER BY last_polled_at ASC NULLS FIRST
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Get feed source by ID
   */
  async getFeedSourceById(id) {
    const query = 'SELECT * FROM feed_sources WHERE id = $1 AND deleted_at IS NULL';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Update feed source polling metadata
   */
  async updateFeedSourcePolling(feedSourceId, success, error = null) {
    const query = `
      UPDATE feed_sources
      SET 
        last_polled_at = CURRENT_TIMESTAMP,
        last_successful_poll_at = CASE WHEN $2 = true THEN CURRENT_TIMESTAMP ELSE last_successful_poll_at END,
        last_error = $3,
        consecutive_errors = CASE WHEN $2 = true THEN 0 ELSE consecutive_errors + 1 END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [feedSourceId, success, error]);
    return result.rows[0];
  }

  /**
   * Check if feed item already exists by GUID
   */
  async feedItemExists(guid) {
    const query = 'SELECT id FROM feed_items WHERE guid = $1';
    const result = await db.query(query, [guid]);
    return result.rows.length > 0;
  }

  /**
   * Create new feed item
   */
  async createFeedItem(feedSourceId, item) {
    const query = `
      INSERT INTO feed_items (
        feed_source_id,
        guid,
        title,
        link,
        description,
        content,
        author,
        published_at,
        categories,
        image_url,
        relevance_score
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      feedSourceId,
      item.guid || item.link,
      item.title,
      item.link,
      item.description || item.contentSnippet || '',
      item.contentEncoded || item.content || '',
      item.creator || item.author || '',
      item.pubDate ? new Date(item.pubDate) : new Date(),
      item.categories || [],
      item.imageUrl || null,
      this.calculateRelevanceScore(item),
    ];

    const result = await db.query(query, values);
    
    // Update feed source statistics
    await this.incrementFeedSourceStats(feedSourceId);
    
    return result.rows[0];
  }

  /**
   * Calculate relevance score based on keywords and recency
   */
  calculateRelevanceScore(item) {
    let score = 0.5; // Base score

    const text = `${item.title} ${item.description || ''} ${item.content || ''}`.toLowerCase();
    
    // High-priority keywords related to CCP, human rights violations
    const criticalKeywords = [
      'ccp', 'china', 'chinese communist party', 'xi jinping',
      'hong kong', 'uyghur', 'xinjiang', 'tibet', 'taiwan',
      'human rights', 'genocide', 'persecution', 'repression',
      'surveillance', 'censorship', 'detention', 'camp',
      'forced labor', 'organ harvesting', 'tiananmen'
    ];

    const mediumKeywords = [
      'beijing', 'protest', 'activist', 'dissident',
      'freedom', 'democracy', 'authoritarian', 'dictatorship',
      'propaganda', 'influence', 'espionage'
    ];

    // Count keyword matches
    let criticalMatches = 0;
    let mediumMatches = 0;

    criticalKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        criticalMatches++;
      }
    });

    mediumKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        mediumMatches++;
      }
    });

    // Boost score based on matches
    score += criticalMatches * 0.15;
    score += mediumMatches * 0.05;

    // Recency boost (newer items get higher scores)
    const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
    const ageInHours = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60);
    
    if (ageInHours < 24) {
      score += 0.1; // Recent news boost
    }

    // Cap score at 1.0
    return Math.min(score, 1.0);
  }

  /**
   * Increment feed source statistics
   */
  async incrementFeedSourceStats(feedSourceId) {
    const query = `
      UPDATE feed_sources
      SET 
        total_items_fetched = total_items_fetched + 1,
        items_this_week = items_this_week + 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await db.query(query, [feedSourceId]);
  }

  /**
   * Parse and store feed items from a single source
   */
  async pollFeedSource(feedSource) {
    logger.info(`Polling feed: ${feedSource.name} (${feedSource.feed_url})`);

    try {
      const feed = await parser.parseURL(feedSource.feed_url);
      
      let newItemsCount = 0;
      const newItems = [];

      for (const item of feed.items) {
        const guid = item.guid || item.link;
        
        // Check if item already exists
        const exists = await this.feedItemExists(guid);
        
        if (!exists) {
          // Extract image URL from various possible locations
          let imageUrl = null;
          if (item.enclosure && item.enclosure.url) {
            imageUrl = item.enclosure.url;
          } else if (item.media && item.media.$) {
            imageUrl = item.media.$.url;
          } else if (item['media:content'] && item['media:content'].$) {
            imageUrl = item['media:content'].$.url;
          }

          const feedItem = await this.createFeedItem(feedSource.id, {
            ...item,
            imageUrl,
          });
          
          newItems.push(feedItem);
          newItemsCount++;
        }
      }

      // Update polling metadata
      await this.updateFeedSourcePolling(feedSource.id, true);

      logger.info(`Successfully polled ${feedSource.name}: ${newItemsCount} new items`);
      
      return {
        success: true,
        feedSourceId: feedSource.id,
        feedSourceName: feedSource.name,
        newItemsCount,
        newItems,
      };

    } catch (error) {
      logger.error(`Error polling feed ${feedSource.name}:`, error);
      
      await this.updateFeedSourcePolling(
        feedSource.id,
        false,
        error.message
      );

      return {
        success: false,
        feedSourceId: feedSource.id,
        feedSourceName: feedSource.name,
        error: error.message,
      };
    }
  }

  /**
   * Poll all active feed sources
   */
  async pollAllFeeds() {
    logger.info('Starting feed polling cycle');

    const feedSources = await this.getActiveFeedSources();
    logger.info(`Found ${feedSources.length} active feed sources`);

    const results = [];

    for (const feedSource of feedSources) {
      const result = await this.pollFeedSource(feedSource);
      results.push(result);
      
      // Small delay between requests to avoid overwhelming sources
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const successCount = results.filter(r => r.success).length;
    const totalNewItems = results.reduce((sum, r) => sum + (r.newItemsCount || 0), 0);

    logger.info(`Feed polling complete: ${successCount}/${feedSources.length} successful, ${totalNewItems} new items`);

    return {
      totalSources: feedSources.length,
      successCount,
      totalNewItems,
      results,
    };
  }

  /**
   * Get recent feed items
   */
  async getRecentFeedItems(limit = 50, offset = 0, filters = {}) {
    let query = `
      SELECT 
        fi.*,
        fs.name as source_name,
        fs.slug as source_slug,
        fs.category as source_category
      FROM feed_items fi
      JOIN feed_sources fs ON fi.feed_source_id = fs.id
      WHERE fi.is_visible = true
      AND fi.deleted_at IS NULL
    `;

    const params = [];
    let paramIndex = 1;

    // Apply filters
    if (filters.sourceId) {
      query += ` AND fi.feed_source_id = $${paramIndex}`;
      params.push(filters.sourceId);
      paramIndex++;
    }

    if (filters.isFeatured) {
      query += ` AND fi.is_featured = true`;
    }

    if (filters.isBreaking) {
      query += ` AND fi.is_breaking = true`;
    }

    if (filters.minRelevanceScore) {
      query += ` AND fi.relevance_score >= $${paramIndex}`;
      params.push(filters.minRelevanceScore);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND fs.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    // Order by relevance and recency
    query += `
      ORDER BY fi.relevance_score DESC, fi.published_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  }

  /**
   * Get feed item by ID
   */
  async getFeedItemById(id) {
    const query = `
      SELECT 
        fi.*,
        fs.name as source_name,
        fs.slug as source_slug,
        fs.website_url as source_website
      FROM feed_items fi
      JOIN feed_sources fs ON fi.feed_source_id = fs.id
      WHERE fi.id = $1
      AND fi.deleted_at IS NULL
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Increment view count for feed item
   */
  async incrementViewCount(feedItemId) {
    const query = `
      UPDATE feed_items
      SET view_count = view_count + 1
      WHERE id = $1
      RETURNING view_count
    `;
    const result = await db.query(query, [feedItemId]);
    return result.rows[0];
  }

  /**
   * Record feed item share
   */
  async recordShare(feedItemId, userId, platform, ipAddress, userAgent) {
    const query = `
      INSERT INTO feed_item_shares (feed_item_id, user_id, platform, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    await db.query(query, [feedItemId, userId, platform, ipAddress, userAgent]);

    // Increment share count
    await db.query(
      'UPDATE feed_items SET share_count = share_count + 1 WHERE id = $1',
      [feedItemId]
    );
  }

  /**
   * Get feed statistics
   */
  async getFeedStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_items,
        COUNT(DISTINCT feed_source_id) as active_sources,
        COUNT(*) FILTER (WHERE published_at > NOW() - INTERVAL '24 hours') as items_today,
        COUNT(*) FILTER (WHERE published_at > NOW() - INTERVAL '7 days') as items_this_week,
        AVG(relevance_score) as avg_relevance_score,
        SUM(view_count) as total_views,
        SUM(share_count) as total_shares
      FROM feed_items
      WHERE deleted_at IS NULL
      AND is_visible = true
    `;
    const result = await db.query(query);
    return result.rows[0];
  }
}

export default new FeedService();
