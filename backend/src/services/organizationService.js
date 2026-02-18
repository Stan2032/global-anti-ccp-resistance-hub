import { query } from '../db/connection.js';
import logger from '../utils/logger.js';
import { NotFoundError, ConflictError, ValidationError } from '../middleware/errorHandler.js';

// ============================================================================
// CREATE ORGANIZATION
// ============================================================================

export const createOrganization = async (orgData) => {
  try {
    const {
      name,
      slug,
      description,
      logo_url,
      website,
      email,
      phone,
      headquarters_country,
      headquarters_city,
      operating_countries,
      founded_year,
      organization_type,
      focus_areas,
      twitter_handle,
      facebook_page,
      instagram_handle,
      primary_contact_name,
      primary_contact_email,
      primary_contact_phone
    } = orgData;

    // Check if slug already exists
    const existing = await query('SELECT id FROM organizations WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      throw new ConflictError('Organization with this slug already exists');
    }

    const result = await query(
      `INSERT INTO organizations (
        name, slug, description, logo_url, website, email, phone,
        headquarters_country, headquarters_city, operating_countries,
        founded_year, organization_type, focus_areas,
        twitter_handle, facebook_page, instagram_handle,
        primary_contact_name, primary_contact_email, primary_contact_phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *`,
      [
        name, slug, description, logo_url, website, email, phone,
        headquarters_country, headquarters_city, 
        Array.isArray(operating_countries) ? operating_countries : [],
        founded_year, organization_type, 
        Array.isArray(focus_areas) ? focus_areas : [],
        twitter_handle, facebook_page, instagram_handle,
        primary_contact_name, primary_contact_email, primary_contact_phone
      ]
    );

    const organization = result.rows[0];
    logger.info('Organization created', { organizationId: organization.id, name: organization.name });

    return organization;
  } catch (error) {
    logger.error('Failed to create organization', { error: error.message });
    throw error;
  }
};

// ============================================================================
// GET ORGANIZATION BY ID
// ============================================================================

export const getOrganizationById = async (id) => {
  try {
    const result = await query(
      'SELECT * FROM organizations WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Organization not found');
    }

    return result.rows[0];
  } catch (error) {
    logger.error('Failed to get organization', { organizationId: id, error: error.message });
    throw error;
  }
};

// ============================================================================
// GET ORGANIZATION BY SLUG
// ============================================================================

export const getOrganizationBySlug = async (slug) => {
  try {
    const result = await query(
      'SELECT * FROM organizations WHERE slug = $1 AND deleted_at IS NULL',
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
// LIST ORGANIZATIONS
// ============================================================================

export const listOrganizations = async (filters = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      verification_status,
      organization_type,
      headquarters_country,
      search
    } = filters;

    const offset = (page - 1) * limit;
    const params = [];
    const conditions = ['deleted_at IS NULL'];
    let paramCount = 0;

    // Add filters
    if (verification_status) {
      paramCount++;
      conditions.push(`verification_status = $${paramCount}`);
      params.push(verification_status);
    }

    if (organization_type) {
      paramCount++;
      conditions.push(`organization_type = $${paramCount}`);
      params.push(organization_type);
    }

    if (headquarters_country) {
      paramCount++;
      conditions.push(`headquarters_country = $${paramCount}`);
      params.push(headquarters_country);
    }

    if (search) {
      paramCount++;
      conditions.push(`(name ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
      params.push(`%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM organizations ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    params.push(limit, offset);
    const result = await query(
      `SELECT * FROM organizations ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      params
    );

    return {
      organizations: result.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Failed to list organizations', { error: error.message });
    throw error;
  }
};

// ============================================================================
// UPDATE ORGANIZATION
// ============================================================================

export const updateOrganization = async (id, updateData) => {
  try {
    const organization = await getOrganizationById(id);

    const allowedFields = [
      'name', 'description', 'logo_url', 'website', 'email', 'phone',
      'headquarters_country', 'headquarters_city', 'operating_countries',
      'founded_year', 'organization_type', 'focus_areas',
      'twitter_handle', 'facebook_page', 'instagram_handle',
      'primary_contact_name', 'primary_contact_email', 'primary_contact_phone'
    ];

    const updates = [];
    const params = [];
    let paramCount = 0;

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        paramCount++;
        updates.push(`${key} = $${paramCount}`);
        params.push(updateData[key]);
      }
    });

    if (updates.length === 0) {
      return organization;
    }

    // Add updated_at
    paramCount++;
    updates.push(`updated_at = $${paramCount}`);
    params.push(new Date());

    // Add id for WHERE clause
    paramCount++;
    params.push(id);

    const result = await query(
      `UPDATE organizations SET ${updates.join(', ')}
       WHERE id = $${paramCount} AND deleted_at IS NULL
       RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Organization not found');
    }

    logger.info('Organization updated', { organizationId: id });
    return result.rows[0];
  } catch (error) {
    logger.error('Failed to update organization', { organizationId: id, error: error.message });
    throw error;
  }
};

// ============================================================================
// DELETE ORGANIZATION (SOFT DELETE)
// ============================================================================

export const deleteOrganization = async (id) => {
  try {
    await getOrganizationById(id); // Check if exists

    const result = await query(
      `UPDATE organizations SET deleted_at = $1, updated_at = $1
       WHERE id = $2 AND deleted_at IS NULL
       RETURNING id`,
      [new Date(), id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Organization not found');
    }

    logger.info('Organization deleted', { organizationId: id });
    return { success: true };
  } catch (error) {
    logger.error('Failed to delete organization', { organizationId: id, error: error.message });
    throw error;
  }
};

// ============================================================================
// UPDATE VERIFICATION STATUS
// ============================================================================

export const updateVerificationStatus = async (id, status, verifiedBy) => {
  try {
    const validStatuses = ['unverified', 'pending', 'verified', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError('Invalid verification status');
    }

    const result = await query(
      `UPDATE organizations
       SET verification_status = $1,
           verified_at = $2,
           verified_by = $3,
           updated_at = $2
       WHERE id = $4 AND deleted_at IS NULL
       RETURNING *`,
      [status, new Date(), verifiedBy, id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Organization not found');
    }

    logger.info('Organization verification status updated', { organizationId: id, status });
    return result.rows[0];
  } catch (error) {
    logger.error('Failed to update verification status', { organizationId: id, error: error.message });
    throw error;
  }
};

// ============================================================================
// UPDATE MEMBER COUNT
// ============================================================================

export const updateMemberCount = async (id) => {
  try {
    // This would typically count from a members table
    // For now, we'll increment/decrement manually
    const result = await query(
      `UPDATE organizations
       SET member_count = member_count + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING member_count`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Organization not found');
    }

    return result.rows[0].member_count;
  } catch (error) {
    logger.error('Failed to update member count', { organizationId: id, error: error.message });
    throw error;
  }
};
