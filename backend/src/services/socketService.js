import logger from '../utils/logger.js';

/**
 * Socket.IO Event Service
 * Centralized event broadcasting and room management
 * Enhanced with comprehensive feed broadcasting capabilities
 */

let io = null;

/**
 * Initialize socket service with Socket.IO instance
 */
export const initializeSocketService = (socketIoInstance) => {
  io = socketIoInstance;
  logger.info('Socket service initialized');
};

/**
 * Get Socket.IO instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initializeSocketService first.');
  }
  return io;
};

/**
 * Check if Socket.IO is initialized
 */
export const isInitialized = () => io !== null;

// ============================================================================
// FEED EVENTS - Enhanced for RSS Aggregation
// ============================================================================

/**
 * Broadcast a single new feed item to all connected clients
 */
export const broadcastNewFeed = (feedItem) => {
  if (!io) return;
  
  const payload = {
    id: feedItem.id,
    title: feedItem.title,
    link: feedItem.link,
    description: feedItem.description,
    author: feedItem.author,
    publishedAt: feedItem.publishedAt || feedItem.published_at,
    sourceName: feedItem.sourceName || feedItem.source_name,
    sourceId: feedItem.sourceId || feedItem.feed_source_id,
    relevanceScore: feedItem.relevanceScore || feedItem.relevance_score,
    categories: feedItem.categories || [],
    imageUrl: feedItem.imageUrl || feedItem.image_url,
    timestamp: new Date().toISOString()
  };

  // Broadcast to all clients
  io.emit('feed:new', payload);
  
  // Also broadcast to source-specific room
  if (payload.sourceId) {
    io.to(`feed:source:${payload.sourceId}`).emit('feed:source:new', payload);
  }

  // Broadcast to category rooms
  if (payload.categories && payload.categories.length > 0) {
    payload.categories.forEach(category => {
      io.to(`feed:category:${category}`).emit('feed:category:new', payload);
    });
  }
  
  logger.debug('Broadcasted new feed item', { feedId: feedItem.id, title: feedItem.title });
};

/**
 * Broadcast multiple new feed items (batch)
 */
export const broadcastNewFeedItems = (feedItems) => {
  if (!io || !feedItems || feedItems.length === 0) return;

  const payload = {
    items: feedItems.map(item => ({
      id: item.id,
      title: item.title,
      link: item.link,
      description: item.description,
      author: item.author,
      publishedAt: item.publishedAt || item.published_at,
      sourceName: item.sourceName || item.source_name,
      sourceId: item.sourceId || item.feed_source_id,
      relevanceScore: item.relevanceScore || item.relevance_score,
      categories: item.categories || [],
      imageUrl: item.imageUrl || item.image_url
    })),
    count: feedItems.length,
    timestamp: new Date().toISOString()
  };

  io.emit('feed:batch', payload);
  
  logger.info('Broadcasted feed batch', { count: feedItems.length });
};

/**
 * Broadcast feed update (e.g., view count, featured status)
 */
export const broadcastFeedUpdate = (feedId, updates) => {
  if (!io) return;
  
  io.emit('feed:update', {
    id: feedId,
    ...updates,
    timestamp: new Date().toISOString()
  });
  
  logger.debug('Broadcasted feed update', { feedId });
};

/**
 * Broadcast feed source status (health, polling status)
 */
export const broadcastFeedSourceStatus = (source) => {
  if (!io) return;

  const payload = {
    id: source.id,
    name: source.name,
    slug: source.slug,
    isActive: source.is_active,
    lastPolledAt: source.last_polled_at,
    lastSuccessfulPollAt: source.last_successful_poll_at,
    consecutiveErrors: source.consecutive_errors,
    lastError: source.last_error,
    timestamp: new Date().toISOString()
  };

  io.emit('feed:source:status', payload);
  io.to(`feed:source:${source.id}`).emit('feed:source:status', payload);

  logger.debug('Broadcasted feed source status', { sourceId: source.id, name: source.name });
};

/**
 * Broadcast feed statistics
 */
export const broadcastFeedStats = (stats) => {
  if (!io) return;

  io.emit('feed:stats', {
    ...stats,
    timestamp: new Date().toISOString()
  });

  logger.debug('Broadcasted feed stats');
};

/**
 * Broadcast breaking news alert
 */
export const broadcastBreakingNews = (feedItem) => {
  if (!io) return;

  const payload = {
    id: feedItem.id,
    title: feedItem.title,
    link: feedItem.link,
    description: feedItem.description,
    sourceName: feedItem.sourceName || feedItem.source_name,
    priority: 'breaking',
    timestamp: new Date().toISOString()
  };

  io.emit('feed:breaking', payload);
  
  logger.info('Broadcasted breaking news', { feedId: feedItem.id, title: feedItem.title });
};

// ============================================================================
// CAMPAIGN EVENTS
// ============================================================================

/**
 * Broadcast campaign update to campaign room
 */
export const broadcastCampaignUpdate = (campaignId, update) => {
  if (!io) return;
  
  io.to(`campaign:${campaignId}`).emit('campaign:update', {
    campaignId,
    ...update,
    timestamp: new Date().toISOString()
  });
  
  logger.info('Broadcasted campaign update', { campaignId });
};

/**
 * Broadcast new campaign member
 */
export const broadcastCampaignMemberJoined = (campaignId, user) => {
  if (!io) return;
  
  io.to(`campaign:${campaignId}`).emit('campaign:member:joined', {
    campaignId,
    user: {
      id: user.id,
      username: user.username,
      avatarUrl: user.avatar_url
    },
    timestamp: new Date().toISOString()
  });
  
  logger.info('Broadcasted campaign member joined', { campaignId, userId: user.id });
};

/**
 * Broadcast campaign member left
 */
export const broadcastCampaignMemberLeft = (campaignId, userId) => {
  if (!io) return;
  
  io.to(`campaign:${campaignId}`).emit('campaign:member:left', {
    campaignId,
    userId,
    timestamp: new Date().toISOString()
  });
  
  logger.info('Broadcasted campaign member left', { campaignId, userId });
};

// ============================================================================
// NOTIFICATION EVENTS
// ============================================================================

/**
 * Send notification to specific user
 */
export const sendUserNotification = (userId, notification) => {
  if (!io) return;
  
  io.to(`user:${userId}`).emit('notification:new', {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    data: notification.data,
    createdAt: notification.created_at
  });
  
  logger.info('Sent user notification', { userId, notificationId: notification.id });
};

/**
 * Broadcast notification to multiple users
 */
export const broadcastNotificationToUsers = (userIds, notification) => {
  if (!io) return;
  
  userIds.forEach(userId => {
    sendUserNotification(userId, notification);
  });
  
  logger.info('Broadcasted notification to users', { 
    userCount: userIds.length, 
    notificationId: notification.id 
  });
};

// ============================================================================
// STATISTICS EVENTS
// ============================================================================

/**
 * Broadcast statistics update
 */
export const broadcastStatsUpdate = (stats) => {
  if (!io) return;
  
  io.emit('stats:update', {
    ...stats,
    timestamp: new Date().toISOString()
  });
  
  logger.debug('Broadcasted stats update');
};

// ============================================================================
// PRESENCE EVENTS
// ============================================================================

/**
 * Broadcast user online status
 */
export const broadcastUserOnline = (userId, metadata = {}) => {
  if (!io) return;
  
  io.emit('user:online', {
    userId,
    ...metadata,
    timestamp: new Date().toISOString()
  });
  
  logger.debug('Broadcasted user online', { userId });
};

/**
 * Broadcast user offline status
 */
export const broadcastUserOffline = (userId) => {
  if (!io) return;
  
  io.emit('user:offline', {
    userId,
    timestamp: new Date().toISOString()
  });
  
  logger.debug('Broadcasted user offline', { userId });
};

// ============================================================================
// SUPPORT REQUEST EVENTS
// ============================================================================

/**
 * Broadcast new support request
 */
export const broadcastNewSupportRequest = (request) => {
  if (!io) return;
  
  io.emit('support:new', {
    id: request.id,
    type: request.type,
    urgency: request.urgency,
    region: request.region,
    createdAt: request.created_at
  });
  
  logger.info('Broadcasted new support request', { requestId: request.id });
};

/**
 * Broadcast support request update
 */
export const broadcastSupportRequestUpdate = (requestId, update) => {
  if (!io) return;
  
  io.emit('support:update', {
    id: requestId,
    ...update,
    timestamp: new Date().toISOString()
  });
  
  logger.info('Broadcasted support request update', { requestId });
};

// ============================================================================
// ROOM MANAGEMENT
// ============================================================================

/**
 * Get online users count in a room
 */
export const getRoomUserCount = async (roomName) => {
  if (!io) return 0;
  
  const sockets = await io.in(roomName).fetchSockets();
  return sockets.length;
};

/**
 * Get all users in a room
 */
export const getRoomUsers = async (roomName) => {
  if (!io) return [];
  
  const sockets = await io.in(roomName).fetchSockets();
  return sockets.map(socket => ({
    socketId: socket.id,
    userId: socket.userId,
    roles: socket.userRoles
  }));
};

/**
 * Broadcast to specific room
 */
export const broadcastToRoom = (roomName, event, data) => {
  if (!io) return;
  
  io.to(roomName).emit(event, {
    ...data,
    timestamp: new Date().toISOString()
  });
  
  logger.debug('Broadcasted to room', { roomName, event });
};

/**
 * Get all active rooms
 */
export const getActiveRooms = () => {
  if (!io) return [];
  
  const rooms = io.sockets.adapter.rooms;
  const activeRooms = [];
  
  rooms.forEach((sockets, roomName) => {
    // Filter out socket IDs (which are also rooms)
    if (!roomName.includes('-')) {
      activeRooms.push({
        name: roomName,
        size: sockets.size
      });
    }
  });
  
  return activeRooms;
};
