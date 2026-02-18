import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/database.js';
// Cache removed - using direct database queries
import logger from '../utils/logger.js';
import { NotFoundError, ConflictError, ValidationError } from '../middleware/errorHandler.js';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');
// Cache removed - no longer needed

// ============================================================================
// USER CREATION
// ============================================================================

export const createUser = async (userData) => {
  const { email, username, password, firstName, lastName } = userData;

  try {
    // Check if email already exists
    const emailExists = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (emailExists.rows.length > 0) {
      throw new ConflictError('Email already registered');
    }

    // Check if username already exists
    const usernameExists = await query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (usernameExists.rows.length > 0) {
      throw new ConflictError('Username already taken');
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, BCRYPT_ROUNDS);

    // Create user
    const result = await query(
      `INSERT INTO users (email, username, password_hash, first_name, last_name, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, username, first_name, last_name, created_at`,
      [email, username, passwordHash, firstName || null, lastName || null, 'active']
    );

    const user = result.rows[0];

    // Assign default 'user' role
    await query(
      `INSERT INTO user_roles (user_id, role_id)
       SELECT $1, id FROM roles WHERE name = 'user'`,
      [user.id]
    );

    logger.info('User created', { userId: user.id, email });
    return user;
  } catch (error) {
    logger.error('User creation failed', { email, error: error.message });
    throw error;
  }
};

// ============================================================================
// USER RETRIEVAL
// ============================================================================

export const getUserById = async (userId) => {
  try {
    // Query database directly
    const result = await query(
      `SELECT id, email, username, first_name, last_name, avatar_url, bio, 
              location, website, organization, expertise_areas, languages,
              status, email_verified, two_factor_enabled, privacy_level,
              created_at, updated_at
       FROM users
       WHERE id = $1 AND deleted_at IS NULL`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }

    const user = result.rows[0];

    // Get user roles
    const rolesResult = await query(
      `SELECT r.name, r.description
       FROM user_roles ur
       JOIN roles r ON ur.role_id = r.id
       WHERE ur.user_id = $1 AND (ur.expires_at IS NULL OR ur.expires_at > NOW())`,
      [userId]
    );

    user.roles = rolesResult.rows.map(r => r.name);

    logger.debug('User retrieved from database', { userId });
    return user;
  } catch (error) {
    logger.error('Failed to get user', { userId, error: error.message });
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const result = await query(
      `SELECT u.id, u.email, u.username, u.password_hash, u.first_name, u.last_name,
              u.status, u.email_verified, u.two_factor_enabled,
              array_agg(r.name) FILTER (WHERE r.name IS NOT NULL) as roles
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.email = $1 AND u.deleted_at IS NULL
       GROUP BY u.id`,
      [email]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }

    const user = result.rows[0];
    user.roles = user.roles || [];
    
    return user;
  } catch (error) {
    logger.error('Failed to get user by email', { email, error: error.message });
    throw error;
  }
};

export const getUserByUsername = async (username) => {
  try {
    const result = await query(
      `SELECT id, email, username, first_name, last_name, avatar_url, bio,
              status, created_at
       FROM users
       WHERE username = $1 AND deleted_at IS NULL`,
      [username]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }

    return result.rows[0];
  } catch (error) {
    logger.error('Failed to get user by username', { username, error: error.message });
    throw error;
  }
};

// ============================================================================
// USER UPDATE
// ============================================================================

export const updateUserProfile = async (userId, profileData) => {
  try {
    const {
      firstName,
      lastName,
      bio,
      location,
      website,
      organization,
      expertiseAreas,
      languages,
      privacyLevel
    } = profileData;

    const result = await query(
      `UPDATE users
       SET first_name = COALESCE($2, first_name),
           last_name = COALESCE($3, last_name),
           bio = COALESCE($4, bio),
           location = COALESCE($5, location),
           website = COALESCE($6, website),
           organization = COALESCE($7, organization),
           expertise_areas = COALESCE($8, expertise_areas),
           languages = COALESCE($9, languages),
           privacy_level = COALESCE($10, privacy_level),
           updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, email, username, first_name, last_name, bio, location,
                 website, organization, expertise_areas, languages, privacy_level, updated_at`,
      [
        userId,
        firstName,
        lastName,
        bio,
        location,
        website,
        organization,
        expertiseAreas,
        languages,
        privacyLevel
      ]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }


    logger.info('User profile updated', { userId });
    return result.rows[0];
  } catch (error) {
    logger.error('Failed to update user profile', { userId, error: error.message });
    throw error;
  }
};

export const updateUserSettings = async (userId, settings) => {
  try {
    const { notificationPreferences, privacyLevel } = settings;

    const result = await query(
      `UPDATE users
       SET notification_preferences = COALESCE($2::jsonb, notification_preferences),
           privacy_level = COALESCE($3, privacy_level),
           updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, notification_preferences, privacy_level, updated_at`,
      [
        userId,
        notificationPreferences ? JSON.stringify(notificationPreferences) : null,
        privacyLevel
      ]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }


    logger.info('User settings updated', { userId });
    return result.rows[0];
  } catch (error) {
    logger.error('Failed to update user settings', { userId, error: error.message });
    throw error;
  }
};

// ============================================================================
// PASSWORD MANAGEMENT
// ============================================================================

export const verifyPassword = async (userId, password) => {
  try {
    const result = await query(
      'SELECT password_hash FROM users WHERE id = $1 AND deleted_at IS NULL',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }

    const passwordHash = result.rows[0].password_hash;
    const isValid = await bcryptjs.compare(password, passwordHash);

    return isValid;
  } catch (error) {
    logger.error('Password verification failed', { userId, error: error.message });
    throw error;
  }
};

export const updatePassword = async (userId, newPassword) => {
  try {
    const passwordHash = await bcryptjs.hash(newPassword, BCRYPT_ROUNDS);

    const result = await query(
      `UPDATE users
       SET password_hash = $2, updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, email`,
      [userId, passwordHash]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }

    // Invalidate all auth tokens
    await query(
      'UPDATE auth_tokens SET revoked = true WHERE user_id = $1',
      [userId]
    );


    logger.info('User password updated', { userId });
    return result.rows[0];
  } catch (error) {
    logger.error('Failed to update password', { userId, error: error.message });
    throw error;
  }
};

// ============================================================================
// EMAIL VERIFICATION
// ============================================================================

export const markEmailVerified = async (userId) => {
  try {
    const result = await query(
      `UPDATE users
       SET email_verified = true, email_verified_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, email, email_verified`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }


    logger.info('User email verified', { userId });
    return result.rows[0];
  } catch (error) {
    logger.error('Failed to verify email', { userId, error: error.message });
    throw error;
  }
};

// ============================================================================
// USER LISTING
// ============================================================================

export const listUsers = async (options = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = '-created_at',
      status = 'active'
    } = options;

    const offset = (page - 1) * limit;
    const sortField = sort.replace('-', '');
    const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';

    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) as count FROM users WHERE status = $1 AND deleted_at IS NULL',
      [status]
    );

    const total = parseInt(countResult.rows[0].count);

    // Get users
    const result = await query(
      `SELECT id, email, username, first_name, last_name, avatar_url,
              status, email_verified, created_at
       FROM users
       WHERE status = $1 AND deleted_at IS NULL
       ORDER BY ${sortField} ${sortOrder}
       LIMIT $2 OFFSET $3`,
      [status, limit, offset]
    );

    return {
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Failed to list users', { error: error.message });
    throw error;
  }
};

// ============================================================================
// USER DELETION
// ============================================================================

export const softDeleteUser = async (userId) => {
  try {
    const result = await query(
      `UPDATE users
       SET deleted_at = NOW(), status = 'deleted', updated_at = NOW()
       WHERE id = $1
       RETURNING id, email`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }


    // Revoke all auth tokens
    await query(
      'UPDATE auth_tokens SET revoked = true WHERE user_id = $1',
      [userId]
    );

    logger.info('User soft deleted', { userId });
    return result.rows[0];
  } catch (error) {
    logger.error('Failed to delete user', { userId, error: error.message });
    throw error;
  }
};

export default {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  updateUserProfile,
  updateUserSettings,
  verifyPassword,
  updatePassword,
  markEmailVerified,
  listUsers,
  softDeleteUser
};
