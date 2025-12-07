#!/usr/bin/env node

import dotenv from 'dotenv';
import { runAllMigrations } from '../src/db/runMigrations.js';
import logger from '../src/utils/logger.js';

dotenv.config();

async function setupDatabase() {
  try {
    logger.info('Starting database setup...');
    
    // Run migrations
    await runAllMigrations();
    
    logger.info('✓ Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('✗ Database setup failed', { error: error.message });
    process.exit(1);
  }
}

setupDatabase();
