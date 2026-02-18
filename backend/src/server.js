import express from 'express';
import 'express-async-errors';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import logger from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { authenticateToken } from './middleware/auth.js';
import { socketAuthMiddleware } from './middleware/socketAuth.js';
import { initializeSocketService } from './services/socketService.js';
import { handleConnection } from './sockets/handlers.js';
import feedScheduler from './services/feedScheduler.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.'
});

app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/v1/auth', (await import('./routes/auth.js')).default);
app.use('/api/v1/users', (await import('./routes/users.js')).default);
app.use('/api/v1/organizations', (await import('./routes/organizations.js')).default);
app.use('/api/v1/campaigns', (await import('./routes/campaigns.js')).default);
app.use('/api/v1/admin', (await import('./routes/admin.js')).default);
app.use('/api/v1/intelligence', (await import('./routes/intelligence.js')).default);
app.use('/api/v1/support-requests', (await import('./routes/supportRequests.js')).default);
app.use('/api/v1/channels', (await import('./routes/channels.js')).default);
app.use('/api/v1/modules', (await import('./routes/modules.js')).default);
app.use('/api/v1/notifications', (await import('./routes/notifications.js')).default);
app.use('/api/v1/statistics', (await import('./routes/statistics.js')).default);
app.use('/api/v1/search', (await import('./routes/search.js')).default);
app.use('/api/v1/feeds', (await import('./routes/feeds.js')).default);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize Socket.IO service
initializeSocketService(io);

// Socket.IO authentication middleware
io.use(socketAuthMiddleware);

// Socket.IO connection handler
io.on('connection', handleConnection);

// Make io accessible to routes
app.set('io', io);

// Start feed scheduler (polls RSS feeds every 15 minutes)
const FEED_POLL_INTERVAL = parseInt(process.env.FEED_POLL_INTERVAL_MINUTES || '15');
feedScheduler.start(FEED_POLL_INTERVAL);

// Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, HOST, () => {
  logger.info(`Server started`, {
    host: HOST,
    port: PORT,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await feedScheduler.shutdown();
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  await feedScheduler.shutdown();
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
  process.exit(1);
});

export default app;
