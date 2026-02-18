import { query } from '../db/connection.js';
import logger from '../utils/logger.js';
import { NotFoundError, ConflictError, ValidationError, ForbiddenError } from '../middleware/errorHandler.js';

// ============================================================================
// CREATE ORGANIZATION
// ============================================================================

export const createOrganization = async (orgData, createdByUserId) => {
  const {
    name,
    slug,
    description,
    organizationType,
    website,
    headquartersCountry,
    headquartersCity,
    operatingCountries,
    focusAreas,
    foundedYear,
    verificationStatus = 'unverified'
  } = orgData;

  try {
    // Check if slug already exists
    const slugExists = await query(
      'SELECT id FROM organizations WHERE slug = $1 AND deleted_at IS NULL',
      [slug]
    );

    if (slugExists.rows.length > 0) {
      throw new ConflictError('Organization slug already exists');
    }

    // Create organization
    const result = await query(
      `INSERT INTO organizations (
        name, slug, description, organization_type, website,
        headquarters_country, headquarters_city, operating_countries,
        focus_areas, founded_year, verification_status,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING *`,
      [
        name,
        slug,
        description,
        organizationType,
        website,
        headquartersCountry,
        headquartersCity,
        operatingCountries || [],
        focusAreas || [],
        foundedYear,
        verificationStatus
      ]
    );

    const organization = result.rows[0];
    logger.info('Organization created', { organizationId: organization.id, name, createdByUserId });
    
    return organization;
  } catch (error) {
    logger.error('Organization creation failed', { name, error: error.message });
    throw error;
  }
};

// ============================================================================
// GET ALL ORGANIZATIONS
// ============================================================================

export const getAllOrganizations = async (filters = {}, pagination = {}) => {
  const { 
    verificationStatus, 
    organizationType, 
    country,
    search 
  } = filters;
  
  const { 
    page = 1, 
    limit = 30,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  } = pagination;

  try {
    const offset = (page - 1) * limit;
    const params = [];
    const conditions = ['deleted_at IS NULL'];
    let paramCount = 0;

    // Add filters
    if (verificationStatus) {
      paramCount++;
      conditions.push(`verification_status = $${paramCount}`);
      params.push(verificationStatus);
    }

    if (organizationType) {
      paramCount++;
      conditions.push(`organization_type = $${paramCount}`);
      params.push(organizationType);
    }

    if (country) {
      paramCount++;
      conditions.push(`(headquarters_country = $${paramCount} OR $${paramCount} = ANY(operating_countries))`);
      params.push(country);
    }

    if (search) {
      paramCount++;
      conditions.push(`(name ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
      params.push(`%${search}%`);
    }

    const whereClause = conditions.join(' AND ');

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM organizations WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get organizations
    const validSortColumns = ['name', 'created_at', 'updated_at', 'verification_status'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const sortDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const result = await query(
      `SELECT * FROM organizations 
       WHERE ${whereClause}
       ORDER BY ${sortColumn} ${sortDirection}
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
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
    logger.error('Failed to get organizations', { error: error.message });
    throw error;
  }
};

// ============================================================================
// GET ORGANIZATION BY ID
// ============================================================================

export const getOrganizationById = async (orgId) => {
  try {
    const result = await query(
      `SELECT * FROM organizations WHERE id = $1 AND deleted_at IS NULL`,
      [orgId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Organization not found');
    }

    return result.rows[0];
  } catch (error) {
    logger.error('Failed to get organization', { orgId, error: error.message });
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
// UPDATE ORGANIZATION
// ============================================================================

export const updateOrganization = async (orgId, updateData, userId, userRoles) => {
  try {
    // Get existing organization
    const existing = await getOrganizationById(orgId);

    // Check permissions - only admin or verified users can update
    const isAdmin = userRoles.includes('admin') || userRoles.includes('moderator');
    if (!isAdmin) {
      throw new ForbiddenError('Only administrators can update organizations');
    }

    const {
      name,
      description,
      organizationType,
      website,
      headquartersCountry,
      headquartersCity,
      operatingCountries,
      focusAreas,
      foundedYear,
      verificationStatus,
      logoUrl,
      email,
      phone,
      twitterHandle,
      facebookPage,
      instagramHandle
    } = updateData;

    const result = await query(
      `UPDATE organizations SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        organization_type = COALESCE($3, organization_type),
        website = COALESCE($4, website),
        headquarters_country = COALESCE($5, headquarters_country),
        headquarters_city = COALESCE($6, headquarters_city),
        operating_countries = COALESCE($7, operating_countries),
        focus_areas = COALESCE($8, focus_areas),
        founded_year = COALESCE($9, founded_year),
        verification_status = COALESCE($10, verification_status),
        logo_url = COALESCE($11, logo_url),
        email = COALESCE($12, email),
        phone = COALESCE($13, phone),
        twitter_handle = COALESCE($14, twitter_handle),
        facebook_page = COALESCE($15, facebook_page),
        instagram_handle = COALESCE($16, instagram_handle),
        updated_at = NOW()
      WHERE id = $17 AND deleted_at IS NULL
      RETURNING *`,
      [
        name,
        description,
        organizationType,
        website,
        headquartersCountry,
        headquartersCity,
        operatingCountries,
        focusAreas,
        foundedYear,
        verificationStatus,
        logoUrl,
        email,
        phone,
        twitterHandle,
        facebookPage,
        instagramHandle,
        orgId
      ]
    );

    logger.info('Organization updated', { organizationId: orgId, userId });
    return result.rows[0];
  } catch (error) {
    logger.error('Failed to update organization', { orgId, error: error.message });
    throw error;
  }
};

// ============================================================================
// DELETE (SOFT DELETE) ORGANIZATION
// ============================================================================

export const deleteOrganization = async (orgId, userId, userRoles) => {
  try {
    // Check permissions
    const isAdmin = userRoles.includes('admin');
    if (!isAdmin) {
      throw new ForbiddenError('Only administrators can delete organizations');
    }

    const result = await query(
      `UPDATE organizations SET deleted_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [orgId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Organization not found');
    }

    logger.info('Organization deleted', { organizationId: orgId, userId });
    return { message: 'Organization deleted successfully' };
  } catch (error) {
    logger.error('Failed to delete organization', { orgId, error: error.message });
    throw error;
  }
};

// ============================================================================
// SEARCH ORGANIZATIONS
// ============================================================================

export const searchOrganizations = async (searchQuery, filters = {}, pagination = {}) => {
  const { limit = 20, page = 1 } = pagination;
  const offset = (page - 1) * limit;

  try {
    const params = [`%${searchQuery}%`];
    const conditions = ['deleted_at IS NULL'];
    let paramCount = 1;

    conditions.push(`(name ILIKE $1 OR description ILIKE $1)`);

    if (filters.verificationStatus) {
      paramCount++;
      conditions.push(`verification_status = $${paramCount}`);
      params.push(filters.verificationStatus);
    }

    const whereClause = conditions.join(' AND ');

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM organizations WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get organizations
    const result = await query(
      `SELECT * FROM organizations 
       WHERE ${whereClause}
       ORDER BY verification_status DESC, name ASC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
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
    logger.error('Organization search failed', { searchQuery, error: error.message });
    throw error;
  }
};

export default {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  getOrganizationBySlug,
  updateOrganization,
  deleteOrganization,
  searchOrganizations
};
