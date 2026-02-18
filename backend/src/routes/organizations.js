import express from 'express';
import logger from '../utils/logger.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validate, organizationSchema, organizationUpdateSchema, organizationSuggestionSchema } from '../validators/schemas.js';
import * as organizationService from '../services/organizationService.js';

const router = express.Router();

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

/**
 * GET /api/v1/organizations
 * List all published organizations (public access)
 */
router.get('/', async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 30,
      verification_status: req.query.verification_status || 'verified',
      organization_type: req.query.organization_type,
      country: req.query.country,
      search: req.query.search,
      sort_by: req.query.sort_by || 'created_at',
      sort_order: req.query.sort_order || 'DESC'
    };

    const result = await organizationService.getAllOrganizations(filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/organizations/search
 * Search organizations (public access)
 */
router.get('/search', async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 30,
      search: req.query.q || req.query.search,
      organization_type: req.query.type,
      country: req.query.country,
      verification_status: 'verified'
    };

    const result = await organizationService.getAllOrganizations(filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/organizations/:id
 * Get single organization by ID or slug (public access)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const organization = await organizationService.getOrganizationByIdOrSlug(req.params.id);

    res.json({
      success: true,
      data: organization
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// AUTHENTICATED ROUTES
// ============================================================================

/**
 * POST /api/v1/organizations/:id/suggest-edit
 * Suggest an edit to an organization (authenticated users)
 */
router.post('/:id/suggest-edit', authenticateToken, validate(organizationSuggestionSchema), async (req, res, next) => {
  try {
    const suggestionData = {
      organization_id: req.params.id,
      change_type: 'edit',
      proposed_changes: req.validatedBody.proposed_changes,
      reason: req.validatedBody.reason
    };

    const suggestion = await organizationService.createOrganizationSuggestion(
      suggestionData,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: suggestion,
      message: 'Edit suggestion submitted successfully. It will be reviewed by moderators.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/organizations/suggest-new
 * Suggest a new organization (authenticated users)
 */
router.post('/suggest-new', authenticateToken, validate(organizationSchema), async (req, res, next) => {
  try {
    const suggestionData = {
      change_type: 'new',
      proposed_changes: req.validatedBody,
      reason: req.body.reason
    };

    const suggestion = await organizationService.createOrganizationSuggestion(
      suggestionData,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: suggestion,
      message: 'New organization suggestion submitted successfully. It will be reviewed by moderators.'
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// MODERATOR/ADMIN ROUTES
// ============================================================================

/**
 * GET /api/v1/organizations/pending-reviews
 * Get pending organization suggestions (moderators/admins only)
 */
router.get('/admin/pending-reviews', authenticateToken, requireRole(['moderator', 'admin']), async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 30,
      status: req.query.status || 'pending',
      change_type: req.query.change_type
    };

    const result = await organizationService.getPendingSuggestions(filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/organizations/admin/review/:suggestionId
 * Review organization suggestion (moderators/admins only)
 */
router.post('/admin/review/:suggestionId', authenticateToken, requireRole(['moderator', 'admin']), async (req, res, next) => {
  try {
    const { decision, review_notes } = req.body;

    if (!decision || !['approved', 'rejected'].includes(decision)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DECISION',
          message: 'Decision must be either approved or rejected'
        }
      });
    }

    const result = await organizationService.reviewSuggestion(
      req.params.suggestionId,
      decision,
      review_notes,
      req.user.id
    );

    res.json({
      success: true,
      data: result,
      message: `Suggestion ${decision} successfully`
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/organizations
 * Create new organization (admins only)
 */
router.post('/', authenticateToken, requireRole(['admin']), validate(organizationSchema), async (req, res, next) => {
  try {
    const organization = await organizationService.createOrganization(
      req.validatedBody,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: organization
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/organizations/:id
 * Update organization (admins only)
 */
router.put('/:id', authenticateToken, requireRole(['admin']), validate(organizationUpdateSchema), async (req, res, next) => {
  try {
    const organization = await organizationService.updateOrganization(
      req.params.id,
      req.validatedBody,
      req.user.id
    );

    res.json({
      success: true,
      data: organization
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/organizations/:id
 * Soft delete organization (admins only)
 */
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const organization = await organizationService.deleteOrganization(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      data: organization,
      message: 'Organization deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
