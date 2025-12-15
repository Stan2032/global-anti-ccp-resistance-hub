import logger from '../utils/logger.js';

/**
 * Socket.IO event service
 * Centralized event broadcasting and room management
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

// ============================================================================
// FEED EVENTS
// ============================================================================

/**
 * Broadcast new intelligence feed item
 */
export const broadcastNewFeed = (feedItem) => {
  if (!io) return;
  
  io.emit('feed:new', {
    id: feedItem.id,
    title: feedItem.title,
    source: feedItem.source,
    url: feedItem.url,
    publishedAt: feedItem.published_at,
    priority: feedItem.priority
  });
  
  logger.info('Broadcasted new feed item', { feedId: feedItem.id });
};

/**
 * Broadcast feed update
 */
export const broadcastFeedUpdate = (feedId, updates) => {
  if (!io) return;
  
  io.emit('feed:update', {
    id: feedId,
    ...updates
  });
  
  logger.info('Broadcasted feed update', { feedId });
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
