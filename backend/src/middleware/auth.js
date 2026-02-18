import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    logger.warn('Missing authentication token', { path: req.path, ip: req.ip });
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing authentication token'
      }
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn('Invalid authentication token', { 
        path: req.path, 
        ip: req.ip,
        error: err.message 
      });
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired token'
        }
      });
    }

    req.user = user;
    next();
  });
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }

  next();
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    const userRoles = req.user.roles || [];
    const hasRole = roles.some(role => userRoles.includes(role));

    if (!hasRole) {
      logger.warn('Insufficient permissions', { 
        userId: req.user.id,
        requiredRoles: roles,
        userRoles: userRoles,
        path: req.path
      });
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        }
      });
    }

    next();
  };
};

export const generateToken = (user, expiresIn) => {
  const expiry = expiresIn || parseInt(process.env.JWT_EXPIRY || process.env.JWT_EXPIRES_IN || '3600');
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles || ['user']
    },
    process.env.JWT_SECRET,
    { expiresIn: expiry }
  );
};

export const generateRefreshToken = (user) => {
  const expiry = parseInt(process.env.JWT_REFRESH_EXPIRY || '604800');
  return jwt.sign(
    {
      id: user.id,
      type: 'refresh'
    },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: expiry }
  );
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    logger.error('Invalid refresh token', { error: error.message });
    throw error;
  }
};
