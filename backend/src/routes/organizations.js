import express from 'express';
import logger from '../utils/logger.js';
import { authenticateToken, optionalAuth, requireRole } from '../middleware/auth.js';
import * as organizationService from '../services/organizationService.js';

const router = express.Router();

// ============================================================================
// GET ALL ORGANIZATIONS (PUBLIC)
// ============================================================================
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const filters = {
      verificationStatus: req.query.verificationStatus,
      organizationType: req.query.organizationType,
      country: req.query.country,
      search: req.query.search
    };

    const pagination = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 30,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC'
    };

    const result = await organizationService.getAllOrganizations(filters, pagination);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// SEARCH ORGANIZATIONS (PUBLIC)
// ============================================================================
router.get('/search', optionalAuth, async (req, res, next) => {
  try {
    const { q: searchQuery } = req.query;

    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PARAMETER',
          message: 'Search query parameter "q" is required'
        }
      });
    }

    const filters = {
      verificationStatus: req.query.verificationStatus
    };

    const pagination = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20
    };

    const result = await organizationService.searchOrganizations(searchQuery, filters, pagination);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// GET ORGANIZATION BY ID (PUBLIC)
// ============================================================================
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const orgId = parseInt(req.params.id);
    
    if (isNaN(orgId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PARAMETER',
          message: 'Invalid organization ID'
        }
      });
    }

    const organization = await organizationService.getOrganizationById(orgId);

    res.json({
      success: true,
      data: organization
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// CREATE ORGANIZATION (ADMIN ONLY)
// ============================================================================
router.post('/', authenticateToken, requireRole(['admin', 'moderator']), async (req, res, next) => {
  try {
    const organizationData = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      organizationType: req.body.organizationType,
      website: req.body.website,
      headquartersCountry: req.body.headquartersCountry,
      headquartersCity: req.body.headquartersCity,
      operatingCountries: req.body.operatingCountries,
      focusAreas: req.body.focusAreas,
      foundedYear: req.body.foundedYear,
      verificationStatus: req.body.verificationStatus
    };

    const organization = await organizationService.createOrganization(
      organizationData,
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

// ============================================================================
// UPDATE ORGANIZATION (ADMIN ONLY)
// ============================================================================
router.put('/:id', authenticateToken, requireRole(['admin', 'moderator']), async (req, res, next) => {
  try {
    const orgId = parseInt(req.params.id);
    
    if (isNaN(orgId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PARAMETER',
          message: 'Invalid organization ID'
        }
      });
    }

    const updateData = {
      name: req.body.name,
      description: req.body.description,
      organizationType: req.body.organizationType,
      website: req.body.website,
      headquartersCountry: req.body.headquartersCountry,
      headquartersCity: req.body.headquartersCity,
      operatingCountries: req.body.operatingCountries,
      focusAreas: req.body.focusAreas,
      foundedYear: req.body.foundedYear,
      verificationStatus: req.body.verificationStatus,
      logoUrl: req.body.logoUrl,
      email: req.body.email,
      phone: req.body.phone,
      twitterHandle: req.body.twitterHandle,
      facebookPage: req.body.facebookPage,
      instagramHandle: req.body.instagramHandle
    };

    const organization = await organizationService.updateOrganization(
      orgId,
      updateData,
      req.user.id,
      req.user.roles
    );

    res.json({
      success: true,
      data: organization
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// DELETE ORGANIZATION (ADMIN ONLY)
// ============================================================================
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const orgId = parseInt(req.params.id);
    
    if (isNaN(orgId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PARAMETER',
          message: 'Invalid organization ID'
        }
      });
    }

    const result = await organizationService.deleteOrganization(
      orgId,
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

export default router;
