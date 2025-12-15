import logger from '../utils/logger.js';
import { requireRole } from '../middleware/socketAuth.js';
import * as socketService from '../services/socketService.js';

/**
 * Socket.IO event handlers
 * Handles all socket events from clients
 */

/**
 * Handle socket connection
 */
export const handleConnection = (socket) => {
  logger.info('User connected', { 
    socketId: socket.id, 
    userId: socket.userId 
  });

  // Auto-subscribe user to their personal notification room
  socket.join(`user:${socket.userId}`);
  
  // Broadcast user online status
  socketService.broadcastUserOnline(socket.userId, {
    socketId: socket.id
  });

  // Set up event handlers
  setupEventHandlers(socket);
};

/**
 * Setup all event handlers for a socket
 */
const setupEventHandlers = (socket) => {
  // Campaign subscriptions
  socket.on('campaign:subscribe', (campaignId) => handleCampaignSubscribe(socket, campaignId));
  socket.on('campaign:unsubscribe', (campaignId) => handleCampaignUnsubscribe(socket, campaignId));
  
  // Channel subscriptions
  socket.on('channel:subscribe', (channelId) => handleChannelSubscribe(socket, channelId));
  socket.on('channel:unsubscribe', (channelId) => handleChannelUnsubscribe(socket, channelId));
  
  // Region subscriptions
  socket.on('region:subscribe', (regionCode) => handleRegionSubscribe(socket, regionCode));
  socket.on('region:unsubscribe', (regionCode) => handleRegionUnsubscribe(socket, regionCode));
  
  // Presence
  socket.on('presence:update', (status) => handlePresenceUpdate(socket, status));
  
  // Disconnect
  socket.on('disconnect', () => handleDisconnect(socket));
  
  // Error handling
  socket.on('error', (error) => handleError(socket, error));
};

// ============================================================================
// CAMPAIGN HANDLERS
// ============================================================================

const handleCampaignSubscribe = (socket, campaignId) => {
  if (!campaignId) {
    socket.emit('error', { message: 'Campaign ID required' });
    return;
  }

  socket.join(`campaign:${campaignId}`);
  logger.info('User subscribed to campaign', { 
    userId: socket.userId, 
    campaignId,
    socketId: socket.id 
  });

  socket.emit('campaign:subscribed', { campaignId });
};

const handleCampaignUnsubscribe = (socket, campaignId) => {
  if (!campaignId) {
    socket.emit('error', { message: 'Campaign ID required' });
    return;
  }

  socket.leave(`campaign:${campaignId}`);
  logger.info('User unsubscribed from campaign', { 
    userId: socket.userId, 
    campaignId,
    socketId: socket.id 
  });

  socket.emit('campaign:unsubscribed', { campaignId });
};

// ============================================================================
// CHANNEL HANDLERS
// ============================================================================

const handleChannelSubscribe = (socket, channelId) => {
  if (!channelId) {
    socket.emit('error', { message: 'Channel ID required' });
    return;
  }

  socket.join(`channel:${channelId}`);
  logger.info('User subscribed to channel', { 
    userId: socket.userId, 
    channelId,
    socketId: socket.id 
  });

  socket.emit('channel:subscribed', { channelId });
};

const handleChannelUnsubscribe = (socket, channelId) => {
  if (!channelId) {
    socket.emit('error', { message: 'Channel ID required' });
    return;
  }

  socket.leave(`channel:${channelId}`);
  logger.info('User unsubscribed from channel', { 
    userId: socket.userId, 
    channelId,
    socketId: socket.id 
  });

  socket.emit('channel:unsubscribed', { channelId });
};

// ============================================================================
// REGION HANDLERS
// ============================================================================

const handleRegionSubscribe = (socket, regionCode) => {
  if (!regionCode) {
    socket.emit('error', { message: 'Region code required' });
    return;
  }

  socket.join(`region:${regionCode}`);
  logger.info('User subscribed to region', { 
    userId: socket.userId, 
    regionCode,
    socketId: socket.id 
  });

  socket.emit('region:subscribed', { regionCode });
};

const handleRegionUnsubscribe = (socket, regionCode) => {
  if (!regionCode) {
    socket.emit('error', { message: 'Region code required' });
    return;
  }

  socket.leave(`region:${regionCode}`);
  logger.info('User unsubscribed from region', { 
    userId: socket.userId, 
    regionCode,
    socketId: socket.id 
  });

  socket.emit('region:unsubscribed', { regionCode });
};

// ============================================================================
// PRESENCE HANDLERS
// ============================================================================

const handlePresenceUpdate = (socket, status) => {
  logger.debug('User presence updated', { 
    userId: socket.userId, 
    status,
    socketId: socket.id 
  });

  // Broadcast presence to relevant rooms
  socket.broadcast.emit('user:presence', {
    userId: socket.userId,
    status,
    timestamp: new Date().toISOString()
  });
};

// ============================================================================
// DISCONNECT HANDLER
// ============================================================================

const handleDisconnect = (socket) => {
  logger.info('User disconnected', { 
    socketId: socket.id, 
    userId: socket.userId 
  });

  // Broadcast user offline status
  socketService.broadcastUserOffline(socket.userId);
};

// ============================================================================
// ERROR HANDLER
// ============================================================================

const handleError = (socket, error) => {
  logger.error('Socket error', { 
    socketId: socket.id, 
    userId: socket.userId,
    error: error.message || error 
  });
};
