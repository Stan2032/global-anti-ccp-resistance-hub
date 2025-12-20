import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Socket.IO authentication middleware
 * Verifies JWT token from socket handshake
 */
export const socketAuthMiddleware = (socket, next) => {
  try {
    // Get token from auth header or query parameter
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      logger.warn('Socket connection attempt without token', { socketId: socket.id });
      return next(new Error('Authentication required'));
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user info to socket
    socket.userId = decoded.userId;
    socket.userRoles = decoded.roles || [];
    
    logger.info('Socket authenticated', { 
      socketId: socket.id, 
      userId: decoded.userId 
    });
    
    next();
  } catch (error) {
    logger.error('Socket authentication failed', { 
      socketId: socket.id, 
      error: error.message 
    });
    next(new Error('Invalid or expired token'));
  }
};

/**
 * Check if socket user has required role
 */
export const requireRole = (socket, requiredRole) => {
  if (!socket.userRoles || !socket.userRoles.includes(requiredRole)) {
    logger.warn('Socket authorization failed', {
      socketId: socket.id,
      userId: socket.userId,
      requiredRole,
      userRoles: socket.userRoles
    });
    return false;
  }
  return true;
};
