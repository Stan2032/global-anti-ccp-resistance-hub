import logger from '../utils/logger.js';
import * as socketService from '../services/socketService.js';

/**
 * Socket.IO Event Handlers
 * Handles all socket events from clients including feed subscriptions
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
  
  // Auto-subscribe to global feed updates
  socket.join('feed:global');
  
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
  // Feed subscriptions
  socket.on('feed:subscribe', (options) => handleFeedSubscribe(socket, options));
  socket.on('feed:unsubscribe', (options) => handleFeedUnsubscribe(socket, options));
  socket.on('feed:subscribe:source', (sourceId) => handleFeedSourceSubscribe(socket, sourceId));
  socket.on('feed:unsubscribe:source', (sourceId) => handleFeedSourceUnsubscribe(socket, sourceId));
  socket.on('feed:subscribe:category', (category) => handleFeedCategorySubscribe(socket, category));
  socket.on('feed:unsubscribe:category', (category) => handleFeedCategoryUnsubscribe(socket, category));

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
// FEED HANDLERS
// ============================================================================

const handleFeedSubscribe = (socket, options = {}) => {
  const { sourceId, category, all } = options;

  if (all || (!sourceId && !category)) {
    // Subscribe to all feeds
    socket.join('feed:global');
    logger.info('User subscribed to all feeds', { 
      userId: socket.userId,
      socketId: socket.id 
    });
    socket.emit('feed:subscribed', { type: 'global' });
    return;
  }

  if (sourceId) {
    handleFeedSourceSubscribe(socket, sourceId);
  }

  if (category) {
    handleFeedCategorySubscribe(socket, category);
  }
};

const handleFeedUnsubscribe = (socket, options = {}) => {
  const { sourceId, category, all } = options;

  if (all) {
    socket.leave('feed:global');
    logger.info('User unsubscribed from all feeds', { 
      userId: socket.userId,
      socketId: socket.id 
    });
    socket.emit('feed:unsubscribed', { type: 'global' });
    return;
  }

  if (sourceId) {
    handleFeedSourceUnsubscribe(socket, sourceId);
  }

  if (category) {
    handleFeedCategoryUnsubscribe(socket, category);
  }
};

const handleFeedSourceSubscribe = (socket, sourceId) => {
  if (!sourceId) {
    socket.emit('error', { message: 'Source ID required' });
    return;
  }

  const roomName = `feed:source:${sourceId}`;
  socket.join(roomName);
  
  logger.info('User subscribed to feed source', { 
    userId: socket.userId, 
    sourceId,
    socketId: socket.id 
  });

  socket.emit('feed:source:subscribed', { sourceId });
};

const handleFeedSourceUnsubscribe = (socket, sourceId) => {
  if (!sourceId) {
    socket.emit('error', { message: 'Source ID required' });
    return;
  }

  const roomName = `feed:source:${sourceId}`;
  socket.leave(roomName);
  
  logger.info('User unsubscribed from feed source', { 
    userId: socket.userId, 
    sourceId,
    socketId: socket.id 
  });

  socket.emit('feed:source:unsubscribed', { sourceId });
};

const handleFeedCategorySubscribe = (socket, category) => {
  if (!category) {
    socket.emit('error', { message: 'Category required' });
    return;
  }

  const roomName = `feed:category:${category}`;
  socket.join(roomName);
  
  logger.info('User subscribed to feed category', { 
    userId: socket.userId, 
    category,
    socketId: socket.id 
  });

  socket.emit('feed:category:subscribed', { category });
};

const handleFeedCategoryUnsubscribe = (socket, category) => {
  if (!category) {
    socket.emit('error', { message: 'Category required' });
    return;
  }

  const roomName = `feed:category:${category}`;
  socket.leave(roomName);
  
  logger.info('User unsubscribed from feed category', { 
    userId: socket.userId, 
    category,
    socketId: socket.id 
  });

  socket.emit('feed:category:unsubscribed', { category });
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
