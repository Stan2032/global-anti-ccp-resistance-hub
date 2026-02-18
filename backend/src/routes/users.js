import express from 'express';
import logger from '../utils/logger.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { getUserById, updateUserProfile, updatePassword } from '../services/userService.js';

const router = express.Router();

// ============================================================================
// GET USER BY ID (PUBLIC PROFILE)
// ============================================================================
router.get('/:id', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PARAMETER',
          message: 'Invalid user ID'
        }
      });
    }

    const user = await getUserById(userId);

    // Return only public information
    const publicProfile = {
      id: user.id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      location: user.location,
      website: user.website,
      organization: user.organization,
      expertiseAreas: user.expertise_areas,
      languages: user.languages,
      createdAt: user.created_at
    };

    res.json({
      success: true,
      data: publicProfile
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// GET CURRENT USER PROFILE (AUTHENTICATED)
// ============================================================================
router.get('/me/profile', authenticateToken, async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// UPDATE CURRENT USER PROFILE (AUTHENTICATED)
// ============================================================================
router.put('/me/profile', authenticateToken, async (req, res, next) => {
  try {
    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bio: req.body.bio,
      location: req.body.location,
      website: req.body.website,
      organization: req.body.organization,
      expertiseAreas: req.body.expertiseAreas,
      languages: req.body.languages,
      avatarUrl: req.body.avatarUrl,
      privacyLevel: req.body.privacyLevel
    };

    const user = await updateUserProfile(req.user.id, updateData);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// CHANGE PASSWORD (AUTHENTICATED)
// ============================================================================
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
    const { verifyPassword } = await import('../services/userService.js');
    const isValid = await verifyPassword(req.user.id, currentPassword);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_PASSWORD',
          message: 'Current password is incorrect'
        }
      });
    }

    await updatePassword(req.user.id, newPassword);

    res.json({
      success: true,
      data: {
        message: 'Password updated successfully'
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
