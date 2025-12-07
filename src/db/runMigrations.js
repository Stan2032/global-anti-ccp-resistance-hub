import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from './connection.js';
import logger from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, 'migrations');

// Get all migration files
const getMigrationFiles = () => {
  return fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
};

// Run a single migration
const runMigration = async (filename) => {
  try {
    const filepath = path.join(migrationsDir, filename);
    const sql = fs.readFileSync(filepath, 'utf8');
    
    logger.info(`Running migration: ${filename}`);
    await query(sql);
    logger.info(`✓ Migration completed: ${filename}`);
    
    return true;
  } catch (error) {
    logger.error(`✗ Migration failed: ${filename}`, { error: error.message });
    throw error;
  }
};

// Run all migrations
export const runAllMigrations = async () => {
  try {
    const files = getMigrationFiles();
    
    if (files.length === 0) {
      logger.warn('No migration files found');
      return;
    }

    logger.info(`Found ${files.length} migration(s)`);
    
    for (const file of files) {
      await runMigration(file);
    }
    
    logger.info('All migrations completed successfully');
  } catch (error) {
    logger.error('Migration process failed', { error: error.message });
    throw error;
  }
};

// Run migrations if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllMigrations()
    .then(() => {
      logger.info('Database setup complete');
      process.exit(0);
    })
    .catch(error => {
      logger.error('Database setup failed', { error: error.message });
      process.exit(1);
    });
}

export default runAllMigrations;
