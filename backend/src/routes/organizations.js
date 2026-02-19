import express from 'express';
import { validate, validateQuery, createOrganizationSchema, updateOrganizationSchema, organizationFilterSchema } from '../validators/schemas.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import * as organizationService from '../services/organizationService.js';

const router = express.Router();

// ============================================================================
// GET ALL ORGANIZATIONS (with filters)
// ============================================================================
router.get('/', validateQuery(organizationFilterSchema), async (req, res, next) => {
  try {
    const filters = req.validatedQuery;
    const result = await organizationService.getOrganizations(filters);

    res.json({
      success: true,
      data: result.organizations,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// SEARCH ORGANIZATIONS
// ============================================================================
router.get('/search', async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_SEARCH',
          message: 'Search query must be at least 2 characters'
        }
      });
    }

    const results = await organizationService.searchOrganizations(q, parseInt(limit));

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// GET ORGANIZATION BY ID
// ============================================================================
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if it's a numeric ID or slug
    const organization = /^\d+$/.test(id)
      ? await organizationService.getOrganizationById(parseInt(id))
      : await organizationService.getOrganizationBySlug(id);

    res.json({
      success: true,
      data: organization
    });
  } catch (error) {
    if (error.message === 'Organization not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Organization not found'
        }
      });
    }
    next(error);
  }
});

// ============================================================================
// CREATE ORGANIZATION (authenticated users)
// ============================================================================
router.post('/', authenticateToken, validate(createOrganizationSchema), async (req, res, next) => {
  try {
    const organizationData = req.validatedBody;
    const userId = req.user.id;

    const organization = await organizationService.createOrganization(organizationData, userId);

    res.status(201).json({
      success: true,
      data: organization,
      message: 'Organization created successfully'
    });
  } catch (error) {
    if (error.message === 'Organization with this name already exists') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE',
          message: error.message
        }
      });
    }
    next(error);
  }
});

// ============================================================================
// UPDATE ORGANIZATION (admin only)
// ============================================================================
router.put('/:id', authenticateToken, requireRole(['admin']), validate(updateOrganizationSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.validatedBody;
    const userId = req.user.id;

    const organization = await organizationService.updateOrganization(parseInt(id), updates, userId);

    res.json({
      success: true,
      data: organization,
      message: 'Organization updated successfully'
    });
  } catch (error) {
    if (error.message === 'Organization not found or already deleted') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Organization not found'
        }
      });
    }
    next(error);
  }
});

// ============================================================================
// DELETE ORGANIZATION (admin only)
// ============================================================================
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await organizationService.deleteOrganization(parseInt(id), userId);

    res.json({
      success: true,
      message: 'Organization deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Organization not found or already deleted') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Organization not found'
        }
      });
    }
    next(error);
  }
});

// ============================================================================
// VERIFY ORGANIZATION (admin only)
// ============================================================================
router.post('/:id/verify', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status = 'verified' } = req.body;
    const userId = req.user.id;

    const organization = await organizationService.verifyOrganization(parseInt(id), userId, status);

    res.json({
      success: true,
      data: organization,
      message: `Organization ${status} successfully`
    });
  } catch (error) {
    if (error.message === 'Organization not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Organization not found'
        }
      });
    }
    if (error.message === 'Invalid verification status') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STATUS',
          message: error.message
        }
      });
    }
    next(error);
  }
});

export default router;
