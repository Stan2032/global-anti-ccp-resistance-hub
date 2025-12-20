import feedService from './feedService.js';
import * as socketService from './socketService.js';
import logger from '../utils/logger.js';

/**
 * Feed Scheduler
 * Simple interval-based RSS feed polling without external dependencies
 * Replaces Bull/Redis with native setInterval for simplicity
 */
class FeedScheduler {
  constructor() {
    this.intervalId = null;
    this.isRunning = false;
    this.isPollInProgress = false;
    this.stats = {
      totalPolls: 0,
      successfulPolls: 0,
      failedPolls: 0,
      totalItemsFetched: 0,
      lastPollAt: null,
      lastPollDuration: null,
      errors: []
    };
  }

  /**
   * Start periodic feed polling
   * @param {number} intervalMinutes - Polling interval in minutes (default: 15)
   */
  start(intervalMinutes = 15) {
    if (this.isRunning) {
      logger.warn('Feed scheduler already running');
      return;
    }

    const intervalMs = intervalMinutes * 60 * 1000;
    
    logger.info(`Starting feed scheduler (polling every ${intervalMinutes} minutes)`);

    // Run immediately on startup
    this.pollFeeds();

    // Schedule recurring polls
    this.intervalId = setInterval(() => {
      this.pollFeeds();
    }, intervalMs);

    this.isRunning = true;
    logger.info('Feed scheduler started successfully');
  }

  /**
   * Stop periodic feed polling
   */
  stop() {
    if (!this.isRunning) {
      logger.warn('Feed scheduler not running');
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    logger.info('Feed scheduler stopped');
  }

  /**
   * Execute a single poll cycle
   */
  async pollFeeds() {
    // Prevent concurrent polls
    if (this.isPollInProgress) {
      logger.warn('Poll already in progress, skipping');
      return null;
    }

    this.isPollInProgress = true;
    const startTime = Date.now();

    try {
      logger.info('Starting feed poll cycle');
      
      const results = await feedService.pollAllFeeds();
      
      // Update statistics
      this.stats.totalPolls++;
      this.stats.successfulPolls++;
      this.stats.totalItemsFetched += results.totalNewItems;
      this.stats.lastPollAt = new Date().toISOString();
      this.stats.lastPollDuration = Date.now() - startTime;

      // Broadcast new items via Socket.IO
      if (results.totalNewItems > 0) {
        this.broadcastNewItems(results);
      }

      // Broadcast updated statistics
      socketService.broadcastFeedStats({
        ...this.stats,
        feedStats: await feedService.getFeedStatistics()
      });

      logger.info(`Feed poll completed: ${results.totalNewItems} new items in ${this.stats.lastPollDuration}ms`);
      
      return results;

    } catch (error) {
      this.stats.totalPolls++;
      this.stats.failedPolls++;
      this.stats.errors.push({
        timestamp: new Date().toISOString(),
        message: error.message
      });

      // Keep only last 10 errors
      if (this.stats.errors.length > 10) {
        this.stats.errors = this.stats.errors.slice(-10);
      }

      logger.error('Feed poll failed:', error);
      return null;

    } finally {
      this.isPollInProgress = false;
    }
  }

  /**
   * Trigger immediate poll (manual trigger)
   */
  async pollNow() {
    logger.info('Manual feed poll triggered');
    return this.pollFeeds();
  }

  /**
   * Broadcast new feed items to connected clients
   */
  broadcastNewItems(results) {
    // Collect all new items from all sources
    const allNewItems = results.results
      .filter(r => r.success && r.newItems && r.newItems.length > 0)
      .flatMap(r => r.newItems.map(item => ({
        ...item,
        sourceName: r.feedSourceName
      })));

    if (allNewItems.length === 0) return;

    // Broadcast batch of new items
    socketService.broadcastNewFeedItems(allNewItems);

    // Also broadcast individual items for real-time feed updates
    allNewItems.forEach(item => {
      socketService.broadcastNewFeed({
        id: item.id,
        title: item.title,
        link: item.link,
        description: item.description,
        author: item.author,
        publishedAt: item.published_at,
        sourceName: item.sourceName,
        sourceId: item.feed_source_id,
        relevanceScore: item.relevance_score,
        categories: item.categories,
        imageUrl: item.image_url
      });
    });

    logger.info(`Broadcasted ${allNewItems.length} new feed items`);
  }

  /**
   * Get scheduler statistics
   */
  getStats() {
    return {
      ...this.stats,
      isRunning: this.isRunning,
      isPollInProgress: this.isPollInProgress
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      totalPolls: 0,
      successfulPolls: 0,
      failedPolls: 0,
      totalItemsFetched: 0,
      lastPollAt: null,
      lastPollDuration: null,
      errors: []
    };
    logger.info('Feed scheduler stats reset');
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    logger.info('Shutting down feed scheduler...');
    
    this.stop();

    // Wait for any in-progress poll to complete
    if (this.isPollInProgress) {
      logger.info('Waiting for in-progress poll to complete...');
      let waitTime = 0;
      const maxWait = 30000; // 30 seconds max wait
      
      while (this.isPollInProgress && waitTime < maxWait) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        waitTime += 1000;
      }

      if (this.isPollInProgress) {
        logger.warn('Poll did not complete within timeout, forcing shutdown');
      }
    }

    logger.info('Feed scheduler shutdown complete');
  }
}

// Export singleton instance
const feedScheduler = new FeedScheduler();
export default feedScheduler;
