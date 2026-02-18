import { query } from '../db/database.js';
import logger from '../utils/logger.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';

// ============================================================================
// GET ALL ORGANIZATIONS (with filtering and pagination)
// ============================================================================

export const getAllOrganizations = async (filters = {}, pagination = {}) => {
  try {
    const {
      search,
      category,
      region,
      verified,
      status = 'active'
    } = filters;

    const {
      page = 1,
      limit = 20,
      sortBy = 'name',
      sortOrder = 'ASC'
    } = pagination;

    const offset = (page - 1) * limit;

    // Build query dynamically based on filters
    let whereConditions = ['deleted_at IS NULL'];
    let params = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    if (search) {
      whereConditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (category) {
      whereConditions.push(`category = $${paramIndex++}`);
      params.push(category);
    }

    if (region) {
      whereConditions.push(`region = $${paramIndex++}`);
      params.push(region);
    }

    if (verified !== undefined) {
      whereConditions.push(`verified = $${paramIndex++}`);
      params.push(verified);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as count FROM organizations ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0]?.count || 0);

    // Get paginated results
    const validSortColumns = ['name', 'created_at', 'established', 'category', 'region'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    params.push(limit, offset);
    const dataResult = await query(
      `SELECT * FROM organizations 
       ${whereClause}
       ORDER BY ${sortColumn} ${order}
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      params
    );

    return {
      organizations: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Failed to get organizations', { error: error.message });
    throw error;
  }
};

// ============================================================================
// GET ORGANIZATION BY ID
// ============================================================================

export const getOrganizationById = async (id) => {
  try {
    const result = await query(
      `SELECT * FROM organizations WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Organization not found');
    }

    return result.rows[0];
  } catch (error) {
    logger.error('Failed to get organization by ID', { id, error: error.message });
    throw error;
  }
};

// ============================================================================
// GET ORGANIZATION BY SLUG
// ============================================================================

export const getOrganizationBySlug = async (slug) => {
  try {
    const result = await query(
      `SELECT * FROM organizations WHERE slug = $1 AND deleted_at IS NULL`,
      [slug]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Organization not found');
    }

    return result.rows[0];
  } catch (error) {
    logger.error('Failed to get organization by slug', { slug, error: error.message });
    throw error;
  }
};

// ============================================================================
// CREATE ORGANIZATION
// ============================================================================

export const createOrganization = async (organizationData, userId) => {
  try {
    const {
      name,
      slug,
      description,
      acronym,
      category,
      region,
      headquarters,
      website,
      focus = [],
      verified = false,
      established,
      logo_url,
      email,
      phone,
      twitter,
      facebook,
      instagram
    } = organizationData;

    // Check if slug already exists
    const existingSlug = await query(
      'SELECT id FROM organizations WHERE slug = $1',
      [slug]
    );

    if (existingSlug.rows.length > 0) {
      throw new ValidationError('An organization with this slug already exists');
    }

    const result = await query(
      `INSERT INTO organizations (
        name, slug, description, acronym, category, region, 
        headquarters, website, focus, verified, established,
        logo_url, email, phone, twitter, facebook, instagram,
        created_by, status, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16, $17, $18, $19, NOW(), NOW()
      ) RETURNING *`,
      [
        name, slug, description, acronym, category, region,
        headquarters, website, focus, verified, established,
        logo_url, email, phone, twitter, facebook, instagram,
        userId, 'active'
      ]
    );

    logger.info('Organization created', { 
      organizationId: result.rows[0].id, 
      name,
      createdBy: userId 
    });

    return result.rows[0];
  } catch (error) {
    logger.error('Failed to create organization', { error: error.message });
    throw error;
  }
};

// ============================================================================
// UPDATE ORGANIZATION
// ============================================================================

export const updateOrganization = async (id, updates, userId) => {
  try {
    // Check if organization exists
    const existing = await getOrganizationById(id);

    const allowedFields = [
      'name', 'slug', 'description', 'acronym', 'category', 'region',
      'headquarters', 'website', 'focus', 'verified', 'established',
      'logo_url', 'email', 'phone', 'twitter', 'facebook', 'instagram',
      'status'
    ];

    // Filter updates to only allowed fields
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    if (Object.keys(filteredUpdates).length === 0) {
      throw new ValidationError('No valid fields to update');
    }

    // If slug is being updated, check for conflicts
    if (filteredUpdates.slug && filteredUpdates.slug !== existing.slug) {
      const existingSlug = await query(
        'SELECT id FROM organizations WHERE slug = $1 AND id != $2',
        [filteredUpdates.slug, id]
      );

      if (existingSlug.rows.length > 0) {
        throw new ValidationError('An organization with this slug already exists');
      }
    }

    // Build update query dynamically
    const setClause = Object.keys(filteredUpdates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const values = [...Object.values(filteredUpdates), id];

    const result = await query(
      `UPDATE organizations 
       SET ${setClause}, updated_at = NOW()
       WHERE id = $${values.length} AND deleted_at IS NULL
       RETURNING *`,
      values
    );

    logger.info('Organization updated', { 
      organizationId: id, 
      updatedBy: userId,
      fields: Object.keys(filteredUpdates)
    });

    return result.rows[0];
  } catch (error) {
    logger.error('Failed to update organization', { id, error: error.message });
    throw error;
  }
};

// ============================================================================
// DELETE ORGANIZATION (soft delete)
// ============================================================================

export const deleteOrganization = async (id, userId) => {
  try {
    // Check if organization exists
    await getOrganizationById(id);

    const result = await query(
      `UPDATE organizations 
       SET deleted_at = NOW(), updated_at = NOW(), status = 'deleted'
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [id]
    );

    logger.info('Organization deleted', { 
      organizationId: id, 
      deletedBy: userId 
    });

    return { success: true, message: 'Organization deleted successfully' };
  } catch (error) {
    logger.error('Failed to delete organization', { id, error: error.message });
    throw error;
  }
};

// ============================================================================
// SEARCH ORGANIZATIONS
// ============================================================================

export const searchOrganizations = async (searchQuery, options = {}) => {
  try {
    const {
      limit = 10,
      category,
      region,
      verified
    } = options;

    let whereConditions = [
      'deleted_at IS NULL',
      'status = $1',
      `(name ILIKE $2 OR description ILIKE $2 OR acronym ILIKE $2)`
    ];
    let params = ['active', `%${searchQuery}%`];
    let paramIndex = 3;

    if (category) {
      whereConditions.push(`category = $${paramIndex++}`);
      params.push(category);
    }

    if (region) {
      whereConditions.push(`region = $${paramIndex++}`);
      params.push(region);
    }

    if (verified !== undefined) {
      whereConditions.push(`verified = $${paramIndex++}`);
      params.push(verified);
    }

    params.push(limit);

    const result = await query(
      `SELECT id, name, slug, acronym, category, region, description, 
              logo_url, verified, established
       FROM organizations
       WHERE ${whereConditions.join(' AND ')}
       ORDER BY 
         CASE WHEN name ILIKE $2 THEN 1 ELSE 2 END,
         verified DESC,
         name ASC
       LIMIT $${paramIndex}`,
      params
    );

    return result.rows;
  } catch (error) {
    logger.error('Organization search failed', { searchQuery, error: error.message });
    throw error;
  }
};

// ============================================================================
// GET ORGANIZATION STATISTICS
// ============================================================================

export const getOrganizationStats = async () => {
  try {
    const result = await query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN verified = true THEN 1 END) as verified,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
        COUNT(DISTINCT category) as categories,
        COUNT(DISTINCT region) as regions
       FROM organizations
       WHERE deleted_at IS NULL`
    );

    return result.rows[0];
  } catch (error) {
    logger.error('Failed to get organization stats', { error: error.message });
    throw error;
  }
};
