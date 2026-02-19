import express from 'express';
import { validate, validateQuery, createCampaignSchema, updateCampaignSchema, campaignFilterSchema, updateProgressSchema } from '../validators/schemas.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import * as campaignService from '../services/campaignService.js';

const router = express.Router();

// ============================================================================
// GET ALL CAMPAIGNS (with filters)
// ============================================================================
router.get('/', optionalAuth, validateQuery(campaignFilterSchema), async (req, res, next) => {
  try {
    const filters = req.validatedQuery;
    const result = await campaignService.getCampaigns(filters);

    res.json({
      success: true,
      data: result.campaigns,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// GET CAMPAIGN BY ID OR SLUG
// ============================================================================
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if it's a numeric ID or slug
    const campaign = /^\d+$/.test(id)
      ? await campaignService.getCampaignById(parseInt(id))
      : await campaignService.getCampaignBySlug(id);

    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    if (error.message === 'Campaign not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Campaign not found'
        }
      });
    }
    next(error);
  }
});

// ============================================================================
// GET CAMPAIGN MEMBERS
// ============================================================================
router.get('/:id/members', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, status, page = 1, limit = 50 } = req.query;

    const result = await campaignService.getCampaignMembers(parseInt(id), {
      role,
      status,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: result.members,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// CREATE CAMPAIGN (authenticated users)
// ============================================================================
router.post('/', authenticateToken, validate(createCampaignSchema), async (req, res, next) => {
  try {
    const campaignData = req.validatedBody;
    const userId = req.user.id;

    const campaign = await campaignService.createCampaign(campaignData, userId);

    res.status(201).json({
      success: true,
      data: campaign,
      message: 'Campaign created successfully'
    });
  } catch (error) {
    if (error.message === 'Campaign with this title already exists') {
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
// UPDATE CAMPAIGN (creator or admin)
// ============================================================================
router.put('/:id', authenticateToken, validate(updateCampaignSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.validatedBody;
    const userId = req.user.id;

    // Check if user is the creator or admin
    const campaign = await campaignService.getCampaignById(parseInt(id));
    const isCreator = campaign.created_by === userId;
    const isAdmin = req.user.roles && req.user.roles.includes('admin');

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Only campaign creator or admin can update this campaign'
        }
      });
    }

    const updatedCampaign = await campaignService.updateCampaign(parseInt(id), updates, userId);

    res.json({
      success: true,
      data: updatedCampaign,
      message: 'Campaign updated successfully'
    });
  } catch (error) {
    if (error.message === 'Campaign not found or already deleted') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Campaign not found'
        }
      });
    }
    next(error);
  }
});

// ============================================================================
// DELETE CAMPAIGN (creator or admin)
// ============================================================================
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user is the creator or admin
    const campaign = await campaignService.getCampaignById(parseInt(id));
    const isCreator = campaign.created_by === userId;
    const isAdmin = req.user.roles && req.user.roles.includes('admin');

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Only campaign creator or admin can delete this campaign'
        }
      });
    }

    await campaignService.deleteCampaign(parseInt(id), userId);

    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Campaign not found or already deleted' || error.message === 'Campaign not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Campaign not found'
        }
      });
    }
    next(error);
  }
});

// ============================================================================
// JOIN CAMPAIGN (authenticated users)
// ============================================================================
router.post('/:id/join', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { role = 'supporter' } = req.body;

    const result = await campaignService.joinCampaign(parseInt(id), userId, role);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    if (error.message === 'Campaign is not active') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STATUS',
          message: 'Cannot join an inactive campaign'
        }
      });
    }
    if (error.message === 'Already a member of this campaign') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'ALREADY_MEMBER',
          message: error.message
        }
      });
    }
    if (error.message === 'Campaign not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Campaign not found'
        }
      });
    }
    next(error);
  }
});

// ============================================================================
// LEAVE CAMPAIGN (authenticated users)
// ============================================================================
router.post('/:id/leave', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await campaignService.leaveCampaign(parseInt(id), userId);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    if (error.message === 'Not a member of this campaign') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NOT_MEMBER',
          message: error.message
        }
      });
    }
    next(error);
  }
});

// ============================================================================
// UPDATE CAMPAIGN PROGRESS (creator or admin)
// ============================================================================
router.post('/:id/progress', authenticateToken, validate(updateProgressSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentValue } = req.validatedBody;
    const userId = req.user.id;

    // Check if user is the creator or admin
    const campaign = await campaignService.getCampaignById(parseInt(id));
    const isCreator = campaign.created_by === userId;
    const isAdmin = req.user.roles && req.user.roles.includes('admin');

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Only campaign creator or admin can update progress'
        }
      });
    }

    const updatedCampaign = await campaignService.updateCampaignProgress(parseInt(id), currentValue, userId);

    res.json({
      success: true,
      data: updatedCampaign,
      message: 'Campaign progress updated successfully'
    });
  } catch (error) {
    if (error.message === 'Campaign not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Campaign not found'
        }
      });
    }
    next(error);
  }
});

export default router;
