import { query } from '../db/connection.js';
import logger from '../utils/logger.js';
import { NotFoundError, ValidationError, ForbiddenError, ConflictError } from '../middleware/errorHandler.js';

/**
 * Generate a URL-friendly slug from a string
 */
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Ensure slug is unique by appending a number if necessary
 */
const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const checkQuery = excludeId
      ? 'SELECT id FROM organizations WHERE slug = $1 AND id != $2 AND deleted_at IS NULL'
      : 'SELECT id FROM organizations WHERE slug = $1 AND deleted_at IS NULL';
    
    const params = excludeId ? [slug, excludeId] : [slug];
    const result = await query(checkQuery, params);
    
    if (result.rows.length === 0) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

/**
 * Get all organizations with optional filtering and pagination
 */
export const getAllOrganizations = async (filters = {}) => {
  try {
    const {
      page = 1,
      limit = 30,
      verification_status = 'verified',
      organization_type,
      country,
      search,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = filters;

    const offset = (page - 1) * limit;
    const conditions = ['deleted_at IS NULL'];
    const params = [];
    let paramCounter = 1;

    // Filter by verification status
    if (verification_status) {
      conditions.push(`verification_status = $${paramCounter}`);
      params.push(verification_status);
      paramCounter++;
    }

    // Filter by organization type
    if (organization_type) {
      conditions.push(`organization_type = $${paramCounter}`);
      params.push(organization_type);
      paramCounter++;
    }

    // Filter by country
    if (country) {
      conditions.push(`headquarters_country = $${paramCounter}`);
      params.push(country);
      paramCounter++;
    }

    // Search filter
    if (search) {
      conditions.push(`(
        name ILIKE $${paramCounter} OR 
        description ILIKE $${paramCounter} OR 
        organization_type ILIKE $${paramCounter}
      )`);
      params.push(`%${search}%`);
      paramCounter++;
    }

    // Valid sort columns
    const validSortColumns = ['name', 'created_at', 'updated_at', 'trust_score', 'member_count'];
    const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'created_at';
    const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM organizations ${whereClause}`;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Get organizations
    params.push(limit, offset);
    const selectQuery = `
      SELECT 
        id, name, slug, description, logo_url, website, email, phone,
        headquarters_country, headquarters_city, operating_countries,
        founded_year, organization_type, focus_areas, member_count,
        verification_status, verified_at, trust_score,
        twitter_handle, facebook_page, instagram_handle,
        created_at, updated_at
      FROM organizations
      ${whereClause}
      ORDER BY ${sortColumn} ${sortDirection}
      LIMIT $${paramCounter} OFFSET $${paramCounter + 1}
    `;

    const result = await query(selectQuery, params);

    return {
      organizations: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error getting organizations', { error: error.message });
    throw error;
  }
};

/**
 * Get a single organization by ID or slug
 */
export const getOrganizationByIdOrSlug = async (identifier) => {
  try {
    const isNumeric = !isNaN(identifier);
    const queryText = isNumeric
      ? 'SELECT * FROM organizations WHERE id = $1 AND deleted_at IS NULL'
      : 'SELECT * FROM organizations WHERE slug = $1 AND deleted_at IS NULL';

    const result = await query(queryText, [identifier]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Organization not found');
    }

    return result.rows[0];
  } catch (error) {
    logger.error('Error getting organization', { identifier, error: error.message });
    throw error;
  }
};

/**
 * Create a new organization (admin only)
 */
export const createOrganization = async (organizationData, userId) => {
  try {
    const {
      name,
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
    } = organizationData;

    if (!name) {
      throw new ValidationError('Organization name is required');
    }

    // Generate unique slug
    const baseSlug = generateSlug(name);
    const slug = await ensureUniqueSlug(baseSlug);

    const insertQuery = `
      INSERT INTO organizations (
        name, slug, description, logo_url, website, email, phone,
        headquarters_country, headquarters_city, operating_countries,
        founded_year, organization_type, focus_areas,
        twitter_handle, facebook_page, instagram_handle,
        primary_contact_name, primary_contact_email, primary_contact_phone,
        verification_status, verified_at, verified_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19,
        'verified', NOW(), $20
      ) RETURNING *
    `;

    const result = await query(insertQuery, [
      name,
      slug,
      description || null,
      logo_url || null,
      website || null,
      email || null,
      phone || null,
      headquarters_country || null,
      headquarters_city || null,
      operating_countries || [],
      founded_year || null,
      organization_type || null,
      focus_areas || [],
      twitter_handle || null,
      facebook_page || null,
      instagram_handle || null,
      primary_contact_name || null,
      primary_contact_email || null,
      primary_contact_phone || null,
      userId
    ]);

    // Log audit
    await query(
      `INSERT INTO audit_logs (action, entity_type, entity_id, actor_user_id, new_values)
       VALUES ($1, $2, $3, $4, $5)`,
      ['INSERT', 'organizations', result.rows[0].id, userId, JSON.stringify(result.rows[0])]
    );

    logger.info('Organization created', { organizationId: result.rows[0].id, userId });

    return result.rows[0];
  } catch (error) {
    logger.error('Error creating organization', { error: error.message });
    throw error;
  }
};

/**
 * Update an organization (admin only)
 */
export const updateOrganization = async (id, updateData, userId) => {
  try {
    // Get existing organization
    const existing = await getOrganizationByIdOrSlug(id);

    const {
      name,
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
      primary_contact_phone,
      verification_status
    } = updateData;

    // If name is changing, regenerate slug
    let slug = existing.slug;
    if (name && name !== existing.name) {
      const baseSlug = generateSlug(name);
      slug = await ensureUniqueSlug(baseSlug, id);
    }

    const updateQuery = `
      UPDATE organizations SET
        name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        description = COALESCE($3, description),
        logo_url = COALESCE($4, logo_url),
        website = COALESCE($5, website),
        email = COALESCE($6, email),
        phone = COALESCE($7, phone),
        headquarters_country = COALESCE($8, headquarters_country),
        headquarters_city = COALESCE($9, headquarters_city),
        operating_countries = COALESCE($10, operating_countries),
        founded_year = COALESCE($11, founded_year),
        organization_type = COALESCE($12, organization_type),
        focus_areas = COALESCE($13, focus_areas),
        twitter_handle = COALESCE($14, twitter_handle),
        facebook_page = COALESCE($15, facebook_page),
        instagram_handle = COALESCE($16, instagram_handle),
        primary_contact_name = COALESCE($17, primary_contact_name),
        primary_contact_email = COALESCE($18, primary_contact_email),
        primary_contact_phone = COALESCE($19, primary_contact_phone),
        verification_status = COALESCE($20, verification_status),
        updated_at = NOW()
      WHERE id = $21 AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await query(updateQuery, [
      name || null,
      slug,
      description !== undefined ? description : null,
      logo_url !== undefined ? logo_url : null,
      website !== undefined ? website : null,
      email !== undefined ? email : null,
      phone !== undefined ? phone : null,
      headquarters_country !== undefined ? headquarters_country : null,
      headquarters_city !== undefined ? headquarters_city : null,
      operating_countries !== undefined ? operating_countries : null,
      founded_year !== undefined ? founded_year : null,
      organization_type !== undefined ? organization_type : null,
      focus_areas !== undefined ? focus_areas : null,
      twitter_handle !== undefined ? twitter_handle : null,
      facebook_page !== undefined ? facebook_page : null,
      instagram_handle !== undefined ? instagram_handle : null,
      primary_contact_name !== undefined ? primary_contact_name : null,
      primary_contact_email !== undefined ? primary_contact_email : null,
      primary_contact_phone !== undefined ? primary_contact_phone : null,
      verification_status || null,
      id
    ]);

    // Log audit
    await query(
      `INSERT INTO audit_logs (action, entity_type, entity_id, actor_user_id, old_values, new_values)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['UPDATE', 'organizations', id, userId, JSON.stringify(existing), JSON.stringify(result.rows[0])]
    );

    logger.info('Organization updated', { organizationId: id, userId });

    return result.rows[0];
  } catch (error) {
    logger.error('Error updating organization', { id, error: error.message });
    throw error;
  }
};

/**
 * Soft delete an organization (admin only)
 */
export const deleteOrganization = async (id, userId) => {
  try {
    const existing = await getOrganizationByIdOrSlug(id);

    const result = await query(
      `UPDATE organizations SET deleted_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );

    // Log audit
    await query(
      `INSERT INTO audit_logs (action, entity_type, entity_id, actor_user_id, old_values)
       VALUES ($1, $2, $3, $4, $5)`,
      ['DELETE', 'organizations', id, userId, JSON.stringify(existing)]
    );

    logger.info('Organization deleted', { organizationId: id, userId });

    return result.rows[0];
  } catch (error) {
    logger.error('Error deleting organization', { id, error: error.message });
    throw error;
  }
};

/**
 * Create organization suggestion (authenticated users)
 */
export const createOrganizationSuggestion = async (suggestionData, userId) => {
  try {
    const {
      organization_id,
      change_type,
      proposed_changes,
      reason
    } = suggestionData;

    if (!change_type || !['new', 'edit', 'flag'].includes(change_type)) {
      throw new ValidationError('Invalid change type');
    }

    if (!proposed_changes || Object.keys(proposed_changes).length === 0) {
      throw new ValidationError('Proposed changes are required');
    }

    // If editing or flagging, verify organization exists
    if ((change_type === 'edit' || change_type === 'flag') && organization_id) {
      await getOrganizationByIdOrSlug(organization_id);
    }

    const insertQuery = `
      INSERT INTO organization_suggestions (
        organization_id, suggested_by_user_id, change_type,
        proposed_changes, reason, status
      ) VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *
    `;

    const result = await query(insertQuery, [
      organization_id || null,
      userId,
      change_type,
      JSON.stringify(proposed_changes),
      reason || null
    ]);

    logger.info('Organization suggestion created', { suggestionId: result.rows[0].id, userId });

    return result.rows[0];
  } catch (error) {
    logger.error('Error creating organization suggestion', { error: error.message });
    throw error;
  }
};

/**
 * Get pending organization suggestions (moderator/admin only)
 */
export const getPendingSuggestions = async (filters = {}) => {
  try {
    const {
      page = 1,
      limit = 30,
      status = 'pending',
      change_type
    } = filters;

    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let paramCounter = 1;

    if (status) {
      conditions.push(`os.status = $${paramCounter}`);
      params.push(status);
      paramCounter++;
    }

    if (change_type) {
      conditions.push(`os.change_type = $${paramCounter}`);
      params.push(change_type);
      paramCounter++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM organization_suggestions os ${whereClause}`;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Get suggestions
    params.push(limit, offset);
    const selectQuery = `
      SELECT 
        os.*,
        u.username as suggested_by_username,
        u.email as suggested_by_email,
        o.name as organization_name,
        o.slug as organization_slug
      FROM organization_suggestions os
      LEFT JOIN users u ON os.suggested_by_user_id = u.id
      LEFT JOIN organizations o ON os.organization_id = o.id
      ${whereClause}
      ORDER BY os.created_at DESC
      LIMIT $${paramCounter} OFFSET $${paramCounter + 1}
    `;

    const result = await query(selectQuery, params);

    return {
      suggestions: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error getting pending suggestions', { error: error.message });
    throw error;
  }
};

/**
 * Review organization suggestion (moderator/admin only)
 */
export const reviewSuggestion = async (suggestionId, decision, reviewNotes, userId) => {
  try {
    if (!['approved', 'rejected'].includes(decision)) {
      throw new ValidationError('Invalid decision. Must be approved or rejected');
    }

    // Get the suggestion
    const suggestionResult = await query(
      'SELECT * FROM organization_suggestions WHERE id = $1',
      [suggestionId]
    );

    if (suggestionResult.rows.length === 0) {
      throw new NotFoundError('Suggestion not found');
    }

    const suggestion = suggestionResult.rows[0];

    if (suggestion.status !== 'pending') {
      throw new ValidationError('Suggestion has already been reviewed');
    }

    // Update suggestion status
    const updateQuery = `
      UPDATE organization_suggestions SET
        status = $1,
        reviewed_by_user_id = $2,
        review_notes = $3,
        reviewed_at = NOW(),
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;

    const result = await query(updateQuery, [
      decision,
      userId,
      reviewNotes || null,
      suggestionId
    ]);

    // If approved and it's a new organization, create it
    if (decision === 'approved' && suggestion.change_type === 'new') {
      const proposed = JSON.parse(suggestion.proposed_changes);
      await createOrganization(proposed, userId);
    }

    // If approved and it's an edit, update the organization
    if (decision === 'approved' && suggestion.change_type === 'edit' && suggestion.organization_id) {
      const proposed = JSON.parse(suggestion.proposed_changes);
      await updateOrganization(suggestion.organization_id, proposed, userId);
    }

    logger.info('Suggestion reviewed', { suggestionId, decision, userId });

    return result.rows[0];
  } catch (error) {
    logger.error('Error reviewing suggestion', { suggestionId, error: error.message });
    throw error;
  }
};
