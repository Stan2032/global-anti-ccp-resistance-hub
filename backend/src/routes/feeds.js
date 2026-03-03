import express from 'express';
import feedService from '../services/feedService.js';
import feedScheduler from '../services/feedScheduler.js';
import cacheService from '../services/cacheService.js';
import { authenticateToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Cache TTLs
const FEED_LIST_TTL = 10 * 60 * 1000; // 10 minutes for feed listings
const FEED_SOURCES_TTL = 30 * 60 * 1000; // 30 minutes for source list
const FEED_STATS_TTL = 5 * 60 * 1000; // 5 minutes for statistics

/**
 * @route   GET /api/v1/feeds
 * @desc    Get recent feed items with optional filters
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const {
      limit = 50,
      offset = 0,
      sourceId,
      category,
      featured,
      breaking,
      minRelevance,
    } = req.query;

    const filters = {};
    if (sourceId) filters.sourceId = parseInt(sourceId);
    if (category) filters.category = category;
    if (featured === 'true') filters.isFeatured = true;
    if (breaking === 'true') filters.isBreaking = true;
    if (minRelevance) filters.minRelevanceScore = parseFloat(minRelevance);

    // Build cache key from query parameters
    const cacheKey = `feeds:list:${JSON.stringify({ limit, offset, ...filters })}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json(cached);
    }

    const items = await feedService.getRecentFeedItems(
      parseInt(limit),
      parseInt(offset),
      filters
    );

    const response = {
      success: true,
      count: items.length,
      items,
    };

    cacheService.set(cacheKey, response, { ttl: FEED_LIST_TTL, tags: ['feeds'] });
    res.set('X-Cache', 'MISS');
    res.set('Cache-Control', 'public, max-age=600');
    res.json(response);
  } catch (error) {
    logger.error('Error fetching feed items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch feed items',
    });
  }
});

/**
 * @route   GET /api/v1/feeds/sources
 * @desc    Get all active feed sources
 * @access  Public
 */
router.get('/sources', async (req, res) => {
  try {
    const cacheKey = 'feeds:sources';
    const cached = cacheService.get(cacheKey);
    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json(cached);
    }

    const sources = await feedService.getActiveFeedSources();

    const response = {
      success: true,
      count: sources.length,
      sources,
    };

    cacheService.set(cacheKey, response, { ttl: FEED_SOURCES_TTL, tags: ['feeds', 'sources'] });
    res.set('X-Cache', 'MISS');
    res.set('Cache-Control', 'public, max-age=1800');
    res.json(response);
  } catch (error) {
    logger.error('Error fetching feed sources:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch feed sources',
    });
  }
});

/**
 * @route   GET /api/v1/feeds/stats
 * @desc    Get feed statistics
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    const cacheKey = 'feeds:stats';
    const cached = cacheService.get(cacheKey);
    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json(cached);
    }

    const feedStats = await feedService.getFeedStatistics();
    const schedulerStats = feedScheduler.getStats();

    const response = {
      success: true,
      stats: {
        feeds: feedStats,
        scheduler: schedulerStats,
        cache: cacheService.stats(),
      },
    };

    cacheService.set(cacheKey, response, { ttl: FEED_STATS_TTL, tags: ['feeds', 'stats'] });
    res.set('X-Cache', 'MISS');
    res.set('Cache-Control', 'public, max-age=300');
    res.json(response);
  } catch (error) {
    logger.error('Error fetching feed stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch feed statistics',
    });
  }
});

/**
 * @route   GET /api/v1/feeds/:id
 * @desc    Get single feed item by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    const feedId = parseInt(id);
    if (isNaN(feedId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid feed item ID',
      });
    }

    const item = await feedService.getFeedItemById(feedId);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Feed item not found',
      });
    }

    // Increment view count
    await feedService.incrementViewCount(feedId);

    res.json({
      success: true,
      item,
    });
  } catch (error) {
    logger.error('Error fetching feed item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch feed item',
    });
  }
});

/**
 * @route   POST /api/v1/feeds/:id/share
 * @desc    Record feed item share
 * @access  Public (optional auth)
 */
router.post('/:id/share', async (req, res) => {
  try {
    const { id } = req.params;
    const { platform } = req.body;

    const feedId = parseInt(id);
    if (isNaN(feedId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid feed item ID',
      });
    }

    // Validate platform
    const validPlatforms = ['twitter', 'facebook', 'telegram', 'whatsapp', 'email', 'copy_link', 'other'];
    if (platform && !validPlatforms.includes(platform)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid platform',
      });
    }

    // Get user ID if authenticated (optional)
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = await import('jsonwebtoken');
        const token = authHeader.substring(7);
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch {
        // Not authenticated, continue as anonymous
      }
    }

    await feedService.recordShare(
      feedId,
      userId,
      platform || 'other',
      req.ip,
      req.headers['user-agent']
    );

    res.json({
      success: true,
      message: 'Share recorded',
    });
  } catch (error) {
    logger.error('Error recording share:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record share',
    });
  }
});

/**
 * @route   POST /api/v1/feeds/poll
 * @desc    Trigger immediate feed poll (admin only)
 * @access  Private (Admin)
 */
router.post('/poll', authenticateToken, async (req, res) => {
  try {
    // TODO: Add admin role check
    const result = await feedScheduler.pollNow();

    // Invalidate feed cache after a fresh poll
    cacheService.invalidateByTag('feeds');

    res.json({
      success: true,
      message: 'Feed poll triggered',
      result: result ? {
        totalSources: result.totalSources,
        successCount: result.successCount,
        totalNewItems: result.totalNewItems,
      } : null,
    });
  } catch (error) {
    logger.error('Error triggering feed poll:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger feed poll',
    });
  }
});

/**
 * @route   GET /api/v1/feeds/scheduler/stats
 * @desc    Get feed scheduler statistics
 * @access  Public (for monitoring)
 */
router.get('/scheduler/stats', async (req, res) => {
  try {
    const stats = feedScheduler.getStats();

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    logger.error('Error fetching scheduler stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scheduler statistics',
    });
  }
});

export default router;
