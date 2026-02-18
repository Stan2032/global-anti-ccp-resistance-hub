import express from 'express';
import logger from '../utils/logger.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validate, updateProfileSchema, updateSettingsSchema } from '../validators/schemas.js';
import * as userService from '../services/userService.js';

const router = express.Router();

// ============================================================================
// AUTHENTICATED ROUTES (specific paths first)
// ============================================================================

/**
 * GET /api/v1/users/me/profile
 * Get current user's full profile
 */
router.get('/me/profile', authenticateToken, async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/users/me
 * Update current user's profile
 */
router.put('/me', authenticateToken, validate(updateProfileSchema), async (req, res, next) => {
  try {
    const user = await userService.updateUserProfile(req.user.id, req.validatedBody);

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/users/me/settings
 * Update current user's settings
 */
router.put('/me/settings', authenticateToken, validate(updateSettingsSchema), async (req, res, next) => {
  try {
    const user = await userService.updateUserSettings(req.user.id, req.validatedBody);

    res.json({
      success: true,
      data: user,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/users/me/password
 * Change current user's password
 */
router.post('/me/password', authenticateToken, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Current password and new password are required'
        }
      });
    }

    // Verify current password
    const isValid = await userService.verifyPassword(req.user.id, currentPassword);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_PASSWORD',
          message: 'Current password is incorrect'
        }
      });
    }

    // Update password
    await userService.updatePassword(req.user.id, newPassword);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/users/me
 * Delete (deactivate) current user's account
 */
router.delete('/me', authenticateToken, async (req, res, next) => {
  try {
    await userService.softDeleteUser(req.user.id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// ADMIN ROUTES
// ============================================================================

/**
 * GET /api/v1/users
 * List all users (admin only)
 */
router.get('/', authenticateToken, requireRole(['admin', 'moderator']), async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 30,
      status: req.query.status,
      role: req.query.role,
      search: req.query.search,
      sortBy: req.query.sort_by || 'created_at',
      sortOrder: req.query.sort_order || 'DESC'
    };

    const result = await userService.listUsers(options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// PUBLIC ROUTES (parameterized routes last)
// ============================================================================

/**
 * GET /api/v1/users/:id
 * Get public user profile
 */
router.get('/:id', async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);

    // Return only public information
    const publicProfile = {
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar_url: user.avatar_url,
      bio: user.bio,
      organization: user.organization,
      expertise_areas: user.expertise_areas,
      created_at: user.created_at
    };

    // Include additional info if privacy level is public
    if (user.privacy_level === 'public') {
      publicProfile.location = user.location;
      publicProfile.website = user.website;
      publicProfile.languages = user.languages;
    }

    res.json({
      success: true,
      data: publicProfile
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/users/:id
 * Delete a user (admin only)
 */
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    await userService.softDeleteUser(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
