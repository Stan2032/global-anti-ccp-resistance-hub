import express from 'express';
import { validate, updateProfileSchema, updateSettingsSchema } from '../validators/schemas.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import * as userService from '../services/userService.js';

const router = express.Router();

// ============================================================================
// GET OWN PROFILE
// ============================================================================
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userService.getUserById(userId);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// UPDATE OWN PROFILE
// ============================================================================
router.put('/profile', authenticateToken, validate(updateProfileSchema), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profileData = req.validatedBody;

    const updatedUser = await userService.updateUserProfile(userId, profileData);

    res.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// UPDATE USER SETTINGS
// ============================================================================
router.put('/settings', authenticateToken, validate(updateSettingsSchema), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const settings = req.validatedBody;

    const updatedSettings = await userService.updateUserSettings(userId, settings);

    res.json({
      success: true,
      data: updatedSettings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// GET USER BY ID (Admin only)
// ============================================================================
router.get('/:id', authenticateToken, requireRole(['admin', 'moderator']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(parseInt(id));

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    next(error);
  }
});

// ============================================================================
// GET USER BY USERNAME (Public)
// ============================================================================
router.get('/username/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await userService.getUserByUsername(username);

    // Only return public information
    const publicUser = {
      id: user.id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      createdAt: user.created_at
    };

    res.json({
      success: true,
      data: publicUser
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    next(error);
  }
});

// ============================================================================
// LIST USERS (Admin only)
// ============================================================================
router.get('/', authenticateToken, requireRole(['admin', 'moderator']), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, sort = '-created_at', status = 'active' } = req.query;

    const result = await userService.listUsers({
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      status
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// DELETE USER (Admin only)
// ============================================================================
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_OPERATION',
          message: 'Cannot delete your own account'
        }
      });
    }

    await userService.softDeleteUser(parseInt(id));

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    next(error);
  }
});

export default router;
