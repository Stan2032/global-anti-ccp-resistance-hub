import express from 'express';
import logger from '../utils/logger.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validate, campaignSchema, campaignUpdateSchema } from '../validators/schemas.js';
import * as campaignService from '../services/campaignService.js';

const router = express.Router();

// ============================================================================
// PUBLIC ROUTES (specific paths before parameterized)
// ============================================================================

/**
 * GET /api/v1/campaigns
 * List all campaigns (public access)
 */
router.get('/', async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 30,
      status: req.query.status || 'active',
      campaign_type: req.query.campaign_type,
      priority: req.query.priority,
      search: req.query.search,
      sort_by: req.query.sort_by || 'created_at',
      sort_order: req.query.sort_order || 'DESC'
    };

    const result = await campaignService.getAllCampaigns(filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/campaigns/:id/members
 * Get campaign members (public access)
 */
router.get('/:id/members', async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 30,
      role: req.query.role,
      status: req.query.status || 'active'
    };

    const result = await campaignService.getCampaignMembers(req.params.id, filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/campaigns/:id
 * Get single campaign by ID or slug (public access)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const campaign = await campaignService.getCampaignByIdOrSlug(req.params.id);

    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// AUTHENTICATED ROUTES
// ============================================================================

/**
 * POST /api/v1/campaigns
 * Create new campaign (authenticated users)
 */
router.post('/', authenticateToken, validate(campaignSchema), async (req, res, next) => {
  try {
    const campaign = await campaignService.createCampaign(
      req.validatedBody,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/campaigns/:id
 * Update campaign (creator or admin only)
 */
router.put('/:id', authenticateToken, validate(campaignUpdateSchema), async (req, res, next) => {
  try {
    // Check if user is admin
    const isAdmin = req.user.roles && (req.user.roles.includes('admin') || req.user.roles.includes('moderator'));
    
    const updateData = {
      ...req.validatedBody,
      _isAdmin: isAdmin
    };

    const campaign = await campaignService.updateCampaign(
      req.params.id,
      updateData,
      req.user.id
    );

    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/campaigns/:id
 * Soft delete campaign (creator or admin only)
 */
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const isAdmin = req.user.roles && (req.user.roles.includes('admin') || req.user.roles.includes('moderator'));

    const campaign = await campaignService.deleteCampaign(
      req.params.id,
      req.user.id,
      isAdmin
    );

    res.json({
      success: true,
      data: campaign,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/campaigns/:id/join
 * Join a campaign (authenticated users)
 */
router.post('/:id/join', authenticateToken, async (req, res, next) => {
  try {
    const { role } = req.body;
    
    const result = await campaignService.joinCampaign(
      req.params.id,
      req.user.id,
      role || 'supporter'
    );

    res.status(201).json({
      success: true,
      data: result,
      message: 'Successfully joined campaign'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/campaigns/:id/leave
 * Leave a campaign (authenticated users)
 */
router.post('/:id/leave', authenticateToken, async (req, res, next) => {
  try {
    const result = await campaignService.leaveCampaign(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

export default router;
