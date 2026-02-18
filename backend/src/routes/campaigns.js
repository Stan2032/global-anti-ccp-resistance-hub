import express from 'express';
import logger from '../utils/logger.js';
import { authenticateToken, optionalAuth, requireRole } from '../middleware/auth.js';
import * as campaignService from '../services/campaignService.js';

const router = express.Router();

// ============================================================================
// GET ALL CAMPAIGNS (PUBLIC)
// ============================================================================
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      campaignType: req.query.campaignType,
      priority: req.query.priority,
      country: req.query.country,
      search: req.query.search
    };

    const pagination = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 30,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC'
    };

    const result = await campaignService.getAllCampaigns(filters, pagination);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// GET CAMPAIGN BY ID (PUBLIC)
// ============================================================================
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const campaignId = parseInt(req.params.id);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PARAMETER',
          message: 'Invalid campaign ID'
        }
      });
    }

    const campaign = await campaignService.getCampaignById(campaignId);

    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// GET CAMPAIGN MEMBERS (PUBLIC)
// ============================================================================
router.get('/:id/members', optionalAuth, async (req, res, next) => {
  try {
    const campaignId = parseInt(req.params.id);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PARAMETER',
          message: 'Invalid campaign ID'
        }
      });
    }

    const pagination = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 30
    };

    const result = await campaignService.getCampaignMembers(campaignId, pagination);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// CREATE CAMPAIGN (AUTHENTICATED)
// ============================================================================
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const campaignData = {
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
      longDescription: req.body.longDescription,
      campaignType: req.body.campaignType,
      status: req.body.status,
      priority: req.body.priority,
      goalDescription: req.body.goalDescription,
      targetMetric: req.body.targetMetric,
      targetValue: req.body.targetValue,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      primaryOrganizationId: req.body.primaryOrganizationId,
      targetCountries: req.body.targetCountries,
      twitterHashtag: req.body.twitterHashtag,
      bannerImageUrl: req.body.bannerImageUrl
    };

    const campaign = await campaignService.createCampaign(
      campaignData,
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

// ============================================================================
// UPDATE CAMPAIGN (CREATOR, ORGANIZER, OR ADMIN)
// ============================================================================
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const campaignId = parseInt(req.params.id);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PARAMETER',
          message: 'Invalid campaign ID'
        }
      });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      longDescription: req.body.longDescription,
      campaignType: req.body.campaignType,
      status: req.body.status,
      priority: req.body.priority,
      goalDescription: req.body.goalDescription,
      targetMetric: req.body.targetMetric,
      targetValue: req.body.targetValue,
      currentValue: req.body.currentValue,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      primaryOrganizationId: req.body.primaryOrganizationId,
      targetCountries: req.body.targetCountries,
      twitterHashtag: req.body.twitterHashtag,
      bannerImageUrl: req.body.bannerImageUrl
    };

    const campaign = await campaignService.updateCampaign(
      campaignId,
      updateData,
      req.user.id,
      req.user.roles
    );

    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// DELETE CAMPAIGN (CREATOR OR ADMIN)
// ============================================================================
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const campaignId = parseInt(req.params.id);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PARAMETER',
          message: 'Invalid campaign ID'
        }
      });
    }

    const result = await campaignService.deleteCampaign(
      campaignId,
      req.user.id,
      req.user.roles
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// JOIN CAMPAIGN (AUTHENTICATED)
// ============================================================================
router.post('/:id/join', authenticateToken, async (req, res, next) => {
  try {
    const campaignId = parseInt(req.params.id);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PARAMETER',
          message: 'Invalid campaign ID'
        }
      });
    }

    const role = req.body.role || 'supporter';

    const result = await campaignService.joinCampaign(
      campaignId,
      req.user.id,
      role
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// LEAVE CAMPAIGN (AUTHENTICATED)
// ============================================================================
router.post('/:id/leave', authenticateToken, async (req, res, next) => {
  try {
    const campaignId = parseInt(req.params.id);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PARAMETER',
          message: 'Invalid campaign ID'
        }
      });
    }

    const result = await campaignService.leaveCampaign(
      campaignId,
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
