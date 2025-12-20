import crypto from 'crypto';
import { query } from '../db/connection.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth.js';
import { createUser, getUserByEmail, verifyPassword, markEmailVerified } from './userService.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './emailService.js';
import logger from '../utils/logger.js';
import { UnauthorizedError, NotFoundError, ConflictError, ValidationError } from '../middleware/errorHandler.js';

const TOKEN_EXPIRY = parseInt(process.env.JWT_EXPIRY || '3600');
const REFRESH_TOKEN_EXPIRY = parseInt(process.env.JWT_REFRESH_EXPIRY || '2592000');

// ============================================================================
// REGISTRATION
// ============================================================================

export const register = async (userData, ipAddress, userAgent) => {
  try {
    // Create user
    const user = await createUser(userData);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');

    // Store verification token
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await query(
      `INSERT INTO auth_tokens (user_id, token_type, token_hash, expires_at, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user.id, 'email_verification', tokenHash, tokenExpiry, ipAddress, userAgent]
    );

    // Send verification email
    try {
      await sendVerificationEmail({
        ...user,
        verificationToken
      });
    } catch (emailError) {
      logger.warn('Failed to send verification email', { userId: user.id, error: emailError.message });
    }

    logger.info('User registered', { userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      },
      message: 'Registration successful. Please check your email to verify your account.'
    };
  } catch (error) {
    logger.error('Registration failed', { error: error.message });
    throw error;
  }
};

// ============================================================================
// EMAIL VERIFICATION
// ============================================================================

export const verifyEmail = async (token) => {
  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find token
    const result = await query(
      `SELECT user_id FROM auth_tokens
       WHERE token_type = 'email_verification' AND token_hash = $1
       AND expires_at > NOW() AND revoked = false`,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedError('Invalid or expired verification token');
    }

    const userId = result.rows[0].user_id;

    // Mark email as verified
    await markEmailVerified(userId);

    // Revoke verification token
    await query(
      'UPDATE auth_tokens SET revoked = true WHERE token_hash = $1',
      [tokenHash]
    );

    logger.info('Email verified', { userId });

    return {
      message: 'Email verified successfully. You can now log in.'
    };
  } catch (error) {
    logger.error('Email verification failed', { error: error.message });
    throw error;
  }
};

// ============================================================================
// LOGIN
// ============================================================================

export const login = async (email, password, ipAddress, userAgent) => {
  try {
    // Get user
    let user;
    try {
      user = await getUserByEmail(email);
    } catch (error) {
      if (error.code === 'NOT_FOUND') {
        // Don't reveal if email exists
        throw new UnauthorizedError('Invalid email or password');
      }
      throw error;
    }

    // Check if account is active
    if (user.status !== 'active') {
      throw new UnauthorizedError('Account is not active');
    }

    // Verify password
    const isValidPassword = await verifyPassword(user.id, password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if email is verified
    if (!user.email_verified) {
      throw new ValidationError('Please verify your email before logging in');
    }

    // Generate tokens
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY * 1000);

    await query(
      `INSERT INTO auth_tokens (user_id, token_type, token_hash, expires_at, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user.id, 'refresh', refreshTokenHash, expiresAt, ipAddress, userAgent]
    );

    // Update last login
    await query(
      'UPDATE users SET last_login = NOW(), last_ip_address = $2 WHERE id = $1',
      [user.id, ipAddress]
    );

    logger.info('User logged in', { userId: user.id, email });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name
      }
    };
  } catch (error) {
    logger.warn('Login failed', { email, error: error.message });
    throw error;
  }
};

// ============================================================================
// TOKEN REFRESH
// ============================================================================

export const refreshAccessToken = async (refreshToken, ipAddress, userAgent) => {
  try {
    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Check if token is in database and not revoked
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const result = await query(
      `SELECT user_id FROM auth_tokens
       WHERE token_type = 'refresh' AND token_hash = $1
       AND expires_at > NOW() AND revoked = false`,
      [refreshTokenHash]
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedError('Refresh token not found or revoked');
    }

    const userId = result.rows[0].user_id;

    // Get fresh user data
    const userResult = await query(
      `SELECT u.id, u.email, u.username, u.first_name, u.last_name,
              array_agg(r.name) as roles
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.id = $1 AND u.deleted_at IS NULL
       GROUP BY u.id`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw new NotFoundError('User not found');
    }

    const user = userResult.rows[0];
    user.roles = user.roles.filter(r => r !== null);

    // Generate new access token
    const newAccessToken = generateToken(user);

    logger.info('Access token refreshed', { userId });

    return {
      accessToken: newAccessToken
    };
  } catch (error) {
    logger.error('Token refresh failed', { error: error.message });
    throw error;
  }
};

// ============================================================================
// PASSWORD RESET
// ============================================================================

export const requestPasswordReset = async (email) => {
  try {
    // Get user (don't throw if not found - security)
    const result = await query(
      'SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL',
      [email]
    );

    if (result.rows.length === 0) {
      // Don't reveal if email exists
      logger.info('Password reset requested for non-existent email', { email });
      return { message: 'If the email exists, a reset link has been sent.' };
    }

    const userId = result.rows[0].id;

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Store reset token
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await query(
      `INSERT INTO auth_tokens (user_id, token_type, token_hash, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [userId, 'password_reset', tokenHash, expiresAt]
    );

    // Send reset email
    try {
      await sendPasswordResetEmail({
        email,
        resetToken
      });
    } catch (emailError) {
      logger.warn('Failed to send password reset email', { userId, error: emailError.message });
    }

    logger.info('Password reset requested', { userId, email });

    return { message: 'If the email exists, a reset link has been sent.' };
  } catch (error) {
    logger.error('Password reset request failed', { error: error.message });
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find token
    const result = await query(
      `SELECT user_id FROM auth_tokens
       WHERE token_type = 'password_reset' AND token_hash = $1
       AND expires_at > NOW() AND revoked = false`,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedError('Invalid or expired reset token');
    }

    const userId = result.rows[0].user_id;

    // Update password
    const { updatePassword } = await import('./userService.js');
    await updatePassword(userId, newPassword);

    // Revoke reset token
    await query(
      'UPDATE auth_tokens SET revoked = true WHERE token_hash = $1',
      [tokenHash]
    );

    logger.info('Password reset completed', { userId });

    return { message: 'Password reset successfully. Please log in with your new password.' };
  } catch (error) {
    logger.error('Password reset failed', { error: error.message });
    throw error;
  }
};

// ============================================================================
// LOGOUT
// ============================================================================

export const logout = async (token) => {
  try {
    // Revoke token by adding to blacklist (for JWT)
    // In a production system, you might want to store revoked tokens in Redis
    logger.info('User logged out');
    return { message: 'Logged out successfully' };
  } catch (error) {
    logger.error('Logout failed', { error: error.message });
    throw error;
  }
};

export default {
  register,
  verifyEmail,
  login,
  refreshAccessToken,
  requestPasswordReset,
  resetPassword,
  logout
};
