/**
 * Centralized logging utility for the Global Anti-CCP Resistance Hub.
 *
 * Provides structured, level-gated logging that can be controlled per-environment:
 * - In production (`import.meta.env.PROD`): only errors are logged.
 * - In development (`import.meta.env.DEV`): all levels are logged.
 * - Debug logging can be enabled in production via `localStorage.setItem('debug', 'true')`.
 *
 * Usage:
 *   import { logger } from '../utils/logger';
 *   logger.error('component', 'Failed to copy:', err);
 *   logger.warn('feed', 'RSS fetch timeout');
 *   logger.debug('cache', 'Using cached data', { age: 5000 });
 *
 * @module logger
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

/** Check if running in development mode. */
const isDev = (): boolean => {
  try {
    return !!import.meta.env?.DEV;
  } catch {
    return false;
  }
};

/** Check if debug mode is explicitly enabled via localStorage. */
const isDebugEnabled = (): boolean => {
  try {
    return typeof window !== 'undefined' && localStorage.getItem('debug') === 'true';
  } catch {
    return false;
  }
};

/** Get the current minimum log level. */
const getMinLevel = (): number => {
  if (isDev() || isDebugEnabled()) return LOG_LEVELS.debug;
  return LOG_LEVELS.warn; // Production: only errors and warnings
};

/**
 * Log a message at the specified level.
 *
 * @param level - The severity level.
 * @param context - A short label identifying the source (e.g. 'feed', 'clipboard', 'encryption').
 * @param args - The message and any additional data to log.
 */
const log = (level: LogLevel, context: string, ...args: unknown[]): void => {
  if (LOG_LEVELS[level] > getMinLevel()) return;

  const prefix = `[${context}]`;

  switch (level) {
    case 'error':
      console.error(prefix, ...args);
      break;
    case 'warn':
      console.warn(prefix, ...args);
      break;
    case 'info':
      console.info(prefix, ...args);
      break;
    case 'debug':
      console.log(prefix, ...args);
      break;
  }
};

/** Structured logger with level-specific methods. */
export const logger = {
  /** Log an error — always logged in all environments. */
  error: (context: string, ...args: unknown[]) => log('error', context, ...args),

  /** Log a warning — logged in development and production. */
  warn: (context: string, ...args: unknown[]) => log('warn', context, ...args),

  /** Log an informational message — logged in development only. */
  info: (context: string, ...args: unknown[]) => log('info', context, ...args),

  /** Log a debug message — logged in development or when debug mode is enabled. */
  debug: (context: string, ...args: unknown[]) => log('debug', context, ...args),
};
