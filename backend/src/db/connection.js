import pkg from 'pg';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.DATABASE_POOL_MAX || '10'),
  min: parseInt(process.env.DATABASE_POOL_MIN || '2'),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', { error: err.message });
});

pool.on('connect', () => {
  logger.debug('Database connection established');
});

export const query = (text, params) => {
  const start = Date.now();
  return pool.query(text, params).then(res => {
    const duration = Date.now() - start;
    logger.debug('Executed query', { text, duration, rows: res.rowCount });
    return res;
  }).catch(err => {
    logger.error('Database query error', { text, error: err.message });
    throw err;
  });
};

export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export const closePool = async () => {
  await pool.end();
  logger.info('Database connection pool closed');
};

export default pool;
