import Bull from 'bull';
import feedService from './feedService.js';
import logger from '../utils/logger.js';

/**
 * Feed Scheduler
 * Manages periodic RSS feed polling using Bull queue
 */
class FeedScheduler {
  constructor() {
    this.queue = null;
    this.isRunning = false;
  }

  /**
   * Initialize the feed polling queue
   */
  initialize() {
    if (this.queue) {
      logger.warn('Feed scheduler already initialized');
      return;
    }

    // Create Bull queue for feed polling
    this.queue = new Bull('feed-polling', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
      },
      defaultJobOptions: {
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 200, // Keep last 200 failed jobs
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    });

    // Process feed polling jobs
    this.queue.process(async (job) => {
      logger.info('Processing feed polling job', { jobId: job.id });
      
      try {
        const results = await feedService.pollAllFeeds();
        
        // Emit event for Socket.IO broadcasting (handled in Phase 4)
        if (results.totalNewItems > 0) {
          this.emit('newFeedItems', results);
        }
        
        return results;
      } catch (error) {
        logger.error('Feed polling job failed:', error);
        throw error;
      }
    });

    // Queue event listeners
    this.queue.on('completed', (job, result) => {
      logger.info('Feed polling completed', {
        jobId: job.id,
        totalNewItems: result.totalNewItems,
        successCount: result.successCount,
      });
    });

    this.queue.on('failed', (job, error) => {
      logger.error('Feed polling failed', {
        jobId: job.id,
        error: error.message,
      });
    });

    this.queue.on('error', (error) => {
      logger.error('Feed queue error:', error);
    });

    logger.info('Feed scheduler initialized');
  }

  /**
   * Start periodic feed polling
   */
  async start() {
    if (!this.queue) {
      throw new Error('Feed scheduler not initialized. Call initialize() first.');
    }

    if (this.isRunning) {
      logger.warn('Feed scheduler already running');
      return;
    }

    // Clear any existing jobs
    await this.queue.empty();
    await this.queue.clean(0, 'completed');
    await this.queue.clean(0, 'failed');

    // Schedule repeating job every 15 minutes
    const pollInterval = parseInt(process.env.FEED_POLL_INTERVAL_MINUTES || '15');
    
    await this.queue.add(
      'poll-all-feeds',
      {},
      {
        repeat: {
          every: pollInterval * 60 * 1000, // Convert to milliseconds
        },
        jobId: 'recurring-feed-poll',
      }
    );

    // Also run immediately on startup
    await this.queue.add('poll-all-feeds', {}, { jobId: 'initial-feed-poll' });

    this.isRunning = true;
    logger.info(`Feed scheduler started (polling every ${pollInterval} minutes)`);
  }

  /**
   * Stop periodic feed polling
   */
  async stop() {
    if (!this.queue) {
      return;
    }

    if (!this.isRunning) {
      logger.warn('Feed scheduler not running');
      return;
    }

    // Remove repeating jobs
    await this.queue.removeRepeatable('poll-all-feeds', {
      every: parseInt(process.env.FEED_POLL_INTERVAL_MINUTES || '15') * 60 * 1000,
    });

    this.isRunning = false;
    logger.info('Feed scheduler stopped');
  }

  /**
   * Trigger immediate feed poll
   */
  async pollNow() {
    if (!this.queue) {
      throw new Error('Feed scheduler not initialized');
    }

    logger.info('Triggering immediate feed poll');
    const job = await this.queue.add('poll-all-feeds', {}, { priority: 1 });
    return job;
  }

  /**
   * Get queue statistics
   */
  async getStats() {
    if (!this.queue) {
      return null;
    }

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount(),
      this.queue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      isRunning: this.isRunning,
    };
  }

  /**
   * Event emitter for new feed items (to be used by Socket.IO)
   */
  emit(event, data) {
    // This will be connected to Socket.IO in Phase 4
    logger.debug(`Feed event emitted: ${event}`, { itemCount: data.totalNewItems });
  }

  /**
   * Cleanup and close queue
   */
  async close() {
    if (this.queue) {
      await this.stop();
      await this.queue.close();
      this.queue = null;
      logger.info('Feed scheduler closed');
    }
  }
}

export default new FeedScheduler();
