import express from 'express';
import feedService from '../services/feedService.js';
import feedScheduler from '../services/feedScheduler.js';
import { authenticateToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * @route   GET /api/feeds
 * @desc    Get recent feed items
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

    const items = await feedService.getRecentFeedItems(
      parseInt(limit),
      parseInt(offset),
      filters
    );

    res.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    logger.error('Error fetching feed items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch feed items',
    });
  }
});

/**
 * @route   GET /api/feeds/sources
 * @desc    Get all feed sources
 * @access  Public
 */
router.get('/sources', async (req, res) => {
  try {
    const sources = await feedService.getActiveFeedSources();

    res.json({
      success: true,
      count: sources.length,
      sources,
    });
  } catch (error) {
    logger.error('Error fetching feed sources:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch feed sources',
    });
  }
});

/**
 * @route   GET /api/feeds/stats
 * @desc    Get feed statistics
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await feedService.getFeedStatistics();

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    logger.error('Error fetching feed stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch feed statistics',
    });
  }
});

/**
 * @route   GET /api/feeds/:id
 * @desc    Get single feed item by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await feedService.getFeedItemById(parseInt(id));

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Feed item not found',
      });
    }

    // Increment view count
    await feedService.incrementViewCount(parseInt(id));

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
 * @route   POST /api/feeds/:id/share
 * @desc    Record feed item share
 * @access  Public (optional auth)
 */
router.post('/:id/share', async (req, res) => {
  try {
    const { id } = req.params;
    const { platform } = req.body;

    // Get user ID if authenticated
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = require('jsonwebtoken').verify(
          token,
          process.env.JWT_SECRET
        );
        userId = decoded.userId;
      } catch (err) {
        // Not authenticated, continue as anonymous
      }
    }

    await feedService.recordShare(
      parseInt(id),
      userId,
      platform,
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
 * @route   POST /api/feeds/poll
 * @desc    Trigger immediate feed poll (admin only)
 * @access  Private (Admin)
 */
router.post('/poll', authenticateToken, async (req, res) => {
  try {
    // TODO: Add admin role check
    const job = await feedScheduler.pollNow();

    res.json({
      success: true,
      message: 'Feed poll triggered',
      jobId: job.id,
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
 * @route   GET /api/feeds/scheduler/stats
 * @desc    Get feed scheduler statistics (admin only)
 * @access  Private (Admin)
 */
router.get('/scheduler/stats', authenticateToken, async (req, res) => {
  try {
    // TODO: Add admin role check
    const stats = await feedScheduler.getStats();

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
