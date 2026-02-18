import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { organizationSchema, organizationUpdateSchema } from '../validators/schemas.js';
import {
  getAllOrganizations,
  getOrganizationById,
  getOrganizationBySlug,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  searchOrganizations,
  getOrganizationStats
} from '../services/organizationService.js';
import logger from '../utils/logger.js';

const router = express.Router();

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

// GET /api/v1/organizations - Get all organizations (with filters and pagination)
router.get('/', async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search,
      category: req.query.category,
      region: req.query.region,
      verified: req.query.verified === 'true' ? true : req.query.verified === 'false' ? false : undefined,
      status: req.query.status || 'active'
    };

    const pagination = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      sortBy: req.query.sortBy || 'name',
      sortOrder: req.query.sortOrder || 'ASC'
    };

    const result = await getAllOrganizations(filters, pagination);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/organizations/search - Search organizations
router.get('/search', async (req, res, next) => {
  try {
    const { q, category, region, verified, limit } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Search query is required'
        }
      });
    }

    const options = {
      category,
      region,
      verified: verified === 'true' ? true : verified === 'false' ? false : undefined,
      limit: parseInt(limit) || 10
    };

    const results = await searchOrganizations(q, options);

    res.json({
      success: true,
      data: {
        query: q,
        results
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/organizations/stats - Get organization statistics
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await getOrganizationStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/organizations/:id - Get organization by ID
router.get('/:id(\\d+)', async (req, res, next) => {
  try {
    const { id } = req.params;
    const organization = await getOrganizationById(parseInt(id));

    res.json({
      success: true,
      data: organization
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/organizations/by-slug/:slug - Get organization by slug
router.get('/by-slug/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const organization = await getOrganizationBySlug(slug);

    res.json({
      success: true,
      data: organization
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// PROTECTED ROUTES (require authentication and admin/moderator role)
// ============================================================================

// POST /api/v1/organizations - Create new organization
router.post('/',
  authenticateToken,
  requireRole(['admin', 'moderator', 'organizer']),
  validate(organizationSchema),
  async (req, res, next) => {
    try {
      const organization = await createOrganization(req.validatedBody, req.user.id);

      res.status(201).json({
        success: true,
        data: organization,
        message: 'Organization created successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/v1/organizations/:id - Update organization
router.put('/:id',
  authenticateToken,
  requireRole(['admin', 'moderator']),
  validate(organizationUpdateSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const organization = await updateOrganization(
        parseInt(id),
        req.validatedBody,
        req.user.id
      );

      res.json({
        success: true,
        data: organization,
        message: 'Organization updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/v1/organizations/:id - Delete organization
router.delete('/:id',
  authenticateToken,
  requireRole(['admin']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await deleteOrganization(parseInt(id), req.user.id);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
