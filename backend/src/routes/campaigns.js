import express from 'express';
import { validate, createCampaignSchema, updateCampaignSchema } from '../validators/schemas.js';
import { authenticateToken } from '../middleware/auth.js';
import * as campaignService from '../services/campaignService.js';
import logger from '../utils/logger.js';

const router = express.Router();

// ============================================================================
// LIST CAMPAIGNS
// ============================================================================
router.get('/', async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      status: req.query.status,
      campaign_type: req.query.campaign_type,
      priority: req.query.priority,
      organization_id: req.query.organization_id,
      search: req.query.search
    };

    const result = await campaignService.listCampaigns(filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// GET CAMPAIGN BY ID
// ============================================================================
router.get('/:id', async (req, res, next) => {
  try {
    const campaign = await campaignService.getCampaignById(req.params.id);

    res.json({
      success: true,
      data: { campaign }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// GET CAMPAIGN BY SLUG
// ============================================================================
router.get('/slug/:slug', async (req, res, next) => {
  try {
    const campaign = await campaignService.getCampaignBySlug(req.params.slug);

    res.json({
      success: true,
      data: { campaign }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// CREATE CAMPAIGN
// ============================================================================
router.post('/', authenticateToken, validate(createCampaignSchema), async (req, res, next) => {
  try {
    const campaign = await campaignService.createCampaign(req.validatedBody, req.user.id);

    res.status(201).json({
      success: true,
      data: { campaign }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// UPDATE CAMPAIGN
// ============================================================================
router.put('/:id', authenticateToken, validate(updateCampaignSchema), async (req, res, next) => {
  try {
    const campaign = await campaignService.updateCampaign(
      req.params.id,
      req.validatedBody,
      req.user.id
    );

    res.json({
      success: true,
      data: { campaign }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// DELETE CAMPAIGN
// ============================================================================
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    await campaignService.deleteCampaign(req.params.id, req.user.id);

    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// JOIN CAMPAIGN
// ============================================================================
router.post('/:id/join', authenticateToken, async (req, res, next) => {
  try {
    const { role } = req.body;
    const membership = await campaignService.joinCampaign(
      req.params.id,
      req.user.id,
      role || 'supporter'
    );

    res.status(201).json({
      success: true,
      data: { membership }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// LEAVE CAMPAIGN
// ============================================================================
router.post('/:id/leave', authenticateToken, async (req, res, next) => {
  try {
    await campaignService.leaveCampaign(req.params.id, req.user.id);

    res.json({
      success: true,
      message: 'Successfully left campaign'
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// GET CAMPAIGN MEMBERS
// ============================================================================
router.get('/:id/members', async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      role: req.query.role,
      status: req.query.status
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

// ============================================================================
// UPDATE CAMPAIGN PROGRESS
// ============================================================================
router.patch('/:id/progress', authenticateToken, async (req, res, next) => {
  try {
    const { current_value } = req.body;

    if (current_value === undefined) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_VALUE',
          message: 'current_value is required'
        }
      });
    }

    const campaign = await campaignService.updateCampaignProgress(
      req.params.id,
      current_value
    );

    res.json({
      success: true,
      data: { campaign }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
