import { query } from '../db/database.js';
import logger from '../utils/logger.js';

/**
 * Generate slug from organization name
 */
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Create a new organization
 */
export const createOrganization = async (organizationData, userId) => {
  try {
    const {
      name,
      description,
      website,
      email,
      phone,
      headquartersCountry,
      headquartersCity,
      operatingCountries,
      foundedYear,
      organizationType,
      focusAreas,
      logoUrl,
      twitterHandle,
      facebookPage,
      instagramHandle,
      primaryContactName,
      primaryContactEmail,
      primaryContactPhone
    } = organizationData;

    // Generate slug from name
    const slug = generateSlug(name);

    const result = await query(
      `INSERT INTO organizations (
        name, slug, description, website, email, phone,
        headquarters_country, headquarters_city, operating_countries,
        founded_year, organization_type, focus_areas,
        logo_url, twitter_handle, facebook_page, instagram_handle,
        primary_contact_name, primary_contact_email, primary_contact_phone,
        verification_status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 'unverified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *`,
      [
        name, slug, description, website, email, phone,
        headquartersCountry, headquartersCity, operatingCountries || [],
        foundedYear, organizationType, focusAreas || [],
        logoUrl, twitterHandle, facebookPage, instagramHandle,
        primaryContactName, primaryContactEmail, primaryContactPhone
      ]
    );

    logger.info('Organization created', { organizationId: result.rows[0].id, name, userId });
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      throw new Error('Organization with this name already exists');
    }
    logger.error('Error creating organization', { error: error.message });
    throw error;
  }
};

/**
 * Get all organizations with optional filters
 */
export const getOrganizations = async (filters = {}) => {
  try {
    const {
      search,
      verificationStatus,
      organizationType,
      country,
      focusArea,
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = filters;

    const offset = (page - 1) * limit;
    const conditions = ['deleted_at IS NULL'];
    const params = [];
    let paramCount = 1;

    // Add search filter
    if (search) {
      conditions.push(`(name ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }

    // Add verification status filter
    if (verificationStatus) {
      conditions.push(`verification_status = $${paramCount}`);
      params.push(verificationStatus);
      paramCount++;
    }

    // Add organization type filter
    if (organizationType) {
      conditions.push(`organization_type = $${paramCount}`);
      params.push(organizationType);
      paramCount++;
    }

    // Add country filter
    if (country) {
      conditions.push(`headquarters_country = $${paramCount}`);
      params.push(country);
      paramCount++;
    }

    // Add focus area filter
    if (focusArea) {
      conditions.push(`$${paramCount} = ANY(focus_areas)`);
      params.push(focusArea);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Validate sort column
    const validSortColumns = ['created_at', 'updated_at', 'name', 'member_count', 'trust_score'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM organizations ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    const result = await query(
      `SELECT * FROM organizations 
       ${whereClause}
       ORDER BY ${sortColumn} ${validSortOrder}
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...params, limit, offset]
    );

    return {
      organizations: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error getting organizations', { error: error.message });
    throw error;
  }
};

/**
 * Get organization by ID
 */
export const getOrganizationById = async (id) => {
  try {
    const result = await query(
      'SELECT * FROM organizations WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Organization not found');
    }

    return result.rows[0];
  } catch (error) {
    logger.error('Error getting organization', { error: error.message, id });
    throw error;
  }
};

/**
 * Get organization by slug
 */
export const getOrganizationBySlug = async (slug) => {
  try {
    const result = await query(
      'SELECT * FROM organizations WHERE slug = $1 AND deleted_at IS NULL',
      [slug]
    );

    if (result.rows.length === 0) {
      throw new Error('Organization not found');
    }

    return result.rows[0];
  } catch (error) {
    logger.error('Error getting organization by slug', { error: error.message, slug });
    throw error;
  }
};

/**
 * Update organization
 */
export const updateOrganization = async (id, updates, userId) => {
  try {
    const allowedFields = [
      'name', 'description', 'website', 'email', 'phone',
      'headquarters_country', 'headquarters_city', 'operating_countries',
      'founded_year', 'organization_type', 'focus_areas', 'member_count',
      'logo_url', 'twitter_handle', 'facebook_page', 'instagram_handle',
      'primary_contact_name', 'primary_contact_email', 'primary_contact_phone'
    ];

    const updateFields = [];
    const params = [id];
    let paramCount = 2;

    // Build update query dynamically
    for (const [key, value] of Object.entries(updates)) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (allowedFields.includes(snakeKey)) {
        updateFields.push(`${snakeKey} = $${paramCount}`);
        params.push(value);
        paramCount++;
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    // Add updated_at
    updateFields.push('updated_at = CURRENT_TIMESTAMP');

    const result = await query(
      `UPDATE organizations 
       SET ${updateFields.join(', ')}
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      throw new Error('Organization not found or already deleted');
    }

    logger.info('Organization updated', { organizationId: id, userId });
    return result.rows[0];
  } catch (error) {
    logger.error('Error updating organization', { error: error.message, id });
    throw error;
  }
};

/**
 * Delete organization (soft delete)
 */
export const deleteOrganization = async (id, userId) => {
  try {
    const result = await query(
      `UPDATE organizations 
       SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Organization not found or already deleted');
    }

    logger.info('Organization deleted', { organizationId: id, userId });
    return { success: true, id };
  } catch (error) {
    logger.error('Error deleting organization', { error: error.message, id });
    throw error;
  }
};

/**
 * Verify organization (admin only)
 */
export const verifyOrganization = async (id, userId, status = 'verified') => {
  try {
    const validStatuses = ['verified', 'rejected', 'pending', 'unverified'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid verification status');
    }

    const result = await query(
      `UPDATE organizations 
       SET verification_status = $2, 
           verified_at = CASE WHEN $2 = 'verified' THEN CURRENT_TIMESTAMP ELSE verified_at END,
           verified_by = CASE WHEN $2 = 'verified' THEN $3 ELSE verified_by END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id, status, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Organization not found');
    }

    logger.info('Organization verification updated', { organizationId: id, status, userId });
    return result.rows[0];
  } catch (error) {
    logger.error('Error verifying organization', { error: error.message, id });
    throw error;
  }
};

/**
 * Search organizations
 */
export const searchOrganizations = async (searchTerm, limit = 10) => {
  try {
    const result = await query(
      `SELECT id, name, slug, description, logo_url, verification_status, focus_areas
       FROM organizations 
       WHERE deleted_at IS NULL 
         AND (name ILIKE $1 OR description ILIKE $1)
       ORDER BY verification_status DESC, name ASC
       LIMIT $2`,
      [`%${searchTerm}%`, limit]
    );

    return result.rows;
  } catch (error) {
    logger.error('Error searching organizations', { error: error.message });
    throw error;
  }
};
