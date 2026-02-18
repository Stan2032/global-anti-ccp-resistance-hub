import express from 'express';
import logger from '../utils/logger.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { query } from '../db/database.js';
import { listUsers } from '../services/userService.js';

const router = express.Router();

// All routes require admin role
router.use(authenticateToken);
router.use(requireRole(['admin']));

// ============================================================================
// LIST ALL USERS (ADMIN)
// ============================================================================
router.get('/users', async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      sort: req.query.sort || '-created_at',
      status: req.query.status || 'active'
    };

    const result = await listUsers(options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// UPDATE USER ROLE (ADMIN)
// ============================================================================
router.put('/users/:id/role', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PARAMETER',
          message: 'Invalid user ID'
        }
      });
    }

    if (!role) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PARAMETER',
          message: 'Role is required'
        }
      });
    }

    // Get role ID
    const roleResult = await query(
      'SELECT id FROM roles WHERE name = $1',
      [role]
    );

    if (roleResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ROLE',
          message: 'Invalid role'
        }
      });
    }

    const roleId = roleResult.rows[0].id;

    // Check if user already has this role
    const existingRole = await query(
      'SELECT id FROM user_roles WHERE user_id = $1 AND role_id = $2',
      [userId, roleId]
    );

    if (existingRole.rows.length > 0) {
      return res.json({
        success: true,
        data: {
          message: 'User already has this role'
        }
      });
    }

    // Assign role
    await query(
      `INSERT INTO user_roles (user_id, role_id, assigned_by)
       VALUES ($1, $2, $3)`,
      [userId, roleId, req.user.id]
    );

    logger.info('User role updated', { userId, role, adminId: req.user.id });

    res.json({
      success: true,
      data: {
        message: 'Role assigned successfully'
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// DEACTIVATE USER (ADMIN)
// ============================================================================
router.delete('/users/:id', async (req, res, next) => {
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

    // Don't allow admins to deactivate themselves
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ACTION',
          message: 'Cannot deactivate your own account'
        }
      });
    }

    // Deactivate user
    const result = await query(
      `UPDATE users SET status = 'inactive', updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, email, username`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    logger.info('User deactivated', { userId, adminId: req.user.id });

    res.json({
      success: true,
      data: {
        message: 'User deactivated successfully',
        user: result.rows[0]
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// VIEW AUDIT LOGS (ADMIN)
// ============================================================================
router.get('/audit-logs', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const filters = {
      tableName: req.query.tableName,
      userId: req.query.userId ? parseInt(req.query.userId) : null,
      action: req.query.action
    };

    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (filters.tableName) {
      paramCount++;
      conditions.push(`table_name = $${paramCount}`);
      params.push(filters.tableName);
    }

    if (filters.userId) {
      paramCount++;
      conditions.push(`changed_by_user_id = $${paramCount}`);
      params.push(filters.userId);
    }

    if (filters.action) {
      paramCount++;
      conditions.push(`action = $${paramCount}`);
      params.push(filters.action);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Note: audit_logs table would need to be created as part of schema
    // For now, return empty result
    res.json({
      success: true,
      data: {
        logs: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// SYSTEM STATISTICS (ADMIN)
// ============================================================================
router.get('/statistics', async (req, res, next) => {
  try {
    // Get user statistics
    const userStats = await query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE status = 'active') as active_users,
        COUNT(*) FILTER (WHERE email_verified = true) as verified_users,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_30d
      FROM users 
      WHERE deleted_at IS NULL
    `);

    // Get organization statistics
    const orgStats = await query(`
      SELECT 
        COUNT(*) as total_organizations,
        COUNT(*) FILTER (WHERE verification_status = 'verified') as verified_organizations,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_organizations_30d
      FROM organizations 
      WHERE deleted_at IS NULL
    `);

    // Get campaign statistics
    const campaignStats = await query(`
      SELECT 
        COUNT(*) as total_campaigns,
        COUNT(*) FILTER (WHERE status = 'active') as active_campaigns,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_campaigns_30d
      FROM campaigns 
      WHERE deleted_at IS NULL
    `);

    res.json({
      success: true,
      data: {
        users: userStats.rows[0],
        organizations: orgStats.rows[0],
        campaigns: campaignStats.rows[0],
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
