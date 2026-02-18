import express from 'express';
import { validate, createOrganizationSchema, updateOrganizationSchema } from '../validators/schemas.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import * as organizationService from '../services/organizationService.js';
import logger from '../utils/logger.js';

const router = express.Router();

// ============================================================================
// LIST ORGANIZATIONS
// ============================================================================
router.get('/', async (req, res, next) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      verification_status: req.query.verification_status,
      organization_type: req.query.organization_type,
      headquarters_country: req.query.headquarters_country,
      search: req.query.search
    };

    const result = await organizationService.listOrganizations(filters);

    res.json({
      success: true,
      data: result
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
    const organization = await organizationService.getOrganizationById(req.params.id);

    res.json({
      success: true,
      data: { organization }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// GET ORGANIZATION BY SLUG
// ============================================================================
router.get('/slug/:slug', async (req, res, next) => {
  try {
    const organization = await organizationService.getOrganizationBySlug(req.params.slug);

    res.json({
      success: true,
      data: { organization }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// CREATE ORGANIZATION
// ============================================================================
router.post('/', authenticateToken, validate(createOrganizationSchema), async (req, res, next) => {
  try {
    const organization = await organizationService.createOrganization(req.validatedBody);

    res.status(201).json({
      success: true,
      data: { organization }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// UPDATE ORGANIZATION
// ============================================================================
router.put('/:id', authenticateToken, validate(updateOrganizationSchema), async (req, res, next) => {
  try {
    const organization = await organizationService.updateOrganization(
      req.params.id,
      req.validatedBody
    );

    res.json({
      success: true,
      data: { organization }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// DELETE ORGANIZATION
// ============================================================================
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    await organizationService.deleteOrganization(req.params.id);

    res.json({
      success: true,
      message: 'Organization deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// UPDATE VERIFICATION STATUS (ADMIN ONLY)
// ============================================================================
router.patch('/:id/verification', authenticateToken, async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_STATUS',
          message: 'Verification status is required'
        }
      });
    }

    const organization = await organizationService.updateVerificationStatus(
      req.params.id,
      status,
      req.user.id
    );

    res.json({
      success: true,
      data: { organization }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
