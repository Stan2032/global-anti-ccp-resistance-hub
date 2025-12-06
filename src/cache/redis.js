import { createClient } from 'redis';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const client = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error('Max Redis reconnection attempts reached');
        return new Error('Max retries reached');
      }
      return retries * 50;
    }
  }
});

client.on('error', (err) => {
  logger.error('Redis client error', { error: err.message });
});

client.on('connect', () => {
  logger.info('Redis client connected');
});

client.on('ready', () => {
  logger.info('Redis client ready');
});

client.on('reconnecting', () => {
  logger.warn('Redis client reconnecting');
});

// Connect to Redis
await client.connect().catch(err => {
  logger.error('Failed to connect to Redis', { error: err.message });
  process.exit(1);
});

// Cache utility functions
export const set = async (key, value, ttl = 3600) => {
  try {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    if (ttl) {
      await client.setEx(key, ttl, value);
    } else {
      await client.set(key, value);
    }
    logger.debug('Cache set', { key, ttl });
  } catch (error) {
    logger.error('Cache set error', { key, error: error.message });
  }
};

export const get = async (key) => {
  try {
    const value = await client.get(key);
    if (value) {
      logger.debug('Cache hit', { key });
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    logger.debug('Cache miss', { key });
    return null;
  } catch (error) {
    logger.error('Cache get error', { key, error: error.message });
    return null;
  }
};

export const del = async (key) => {
  try {
    await client.del(key);
    logger.debug('Cache deleted', { key });
  } catch (error) {
    logger.error('Cache delete error', { key, error: error.message });
  }
};

export const flush = async () => {
  try {
    await client.flushDb();
    logger.info('Cache flushed');
  } catch (error) {
    logger.error('Cache flush error', { error: error.message });
  }
};

export const close = async () => {
  await client.quit();
  logger.info('Redis connection closed');
};

export default client;
