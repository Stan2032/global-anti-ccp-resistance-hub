import { query } from '../db/connection.js';
import logger from '../utils/logger.js';
import { NotFoundError, ValidationError, ForbiddenError } from '../middleware/errorHandler.js';

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
      ? 'SELECT id FROM campaigns WHERE slug = $1 AND id != $2 AND deleted_at IS NULL'
      : 'SELECT id FROM campaigns WHERE slug = $1 AND deleted_at IS NULL';
    
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
 * Calculate progress percentage based on current and target values
 */
const calculateProgress = (currentValue, targetValue) => {
  if (!targetValue || targetValue === 0) return 0;
  return Math.min(100, Math.round((currentValue / targetValue) * 100 * 100) / 100);
};

/**
 * Get all campaigns with optional filtering and pagination
 */
export const getAllCampaigns = async (filters = {}) => {
  try {
    const {
      page = 1,
      limit = 30,
      status = 'active',
      campaign_type,
      priority,
      search,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = filters;

    const offset = (page - 1) * limit;
    const conditions = ['deleted_at IS NULL'];
    const params = [];
    let paramCounter = 1;

    // Filter by status
    if (status) {
      conditions.push(`status = $${paramCounter}`);
      params.push(status);
      paramCounter++;
    }

    // Filter by campaign type
    if (campaign_type) {
      conditions.push(`campaign_type = $${paramCounter}`);
      params.push(campaign_type);
      paramCounter++;
    }

    // Filter by priority
    if (priority) {
      conditions.push(`priority = $${paramCounter}`);
      params.push(priority);
      paramCounter++;
    }

    // Search filter
    if (search) {
      conditions.push(`(
        title ILIKE $${paramCounter} OR 
        description ILIKE $${paramCounter} OR 
        campaign_type ILIKE $${paramCounter}
      )`);
      params.push(`%${search}%`);
      paramCounter++;
    }

    // Valid sort columns
    const validSortColumns = ['title', 'created_at', 'updated_at', 'start_date', 'end_date', 'progress_percentage', 'member_count'];
    const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'created_at';
    const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM campaigns ${whereClause}`;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Get campaigns
    params.push(limit, offset);
    const selectQuery = `
      SELECT 
        c.id, c.title, c.slug, c.description, c.long_description, c.banner_image_url,
        c.campaign_type, c.status, c.priority,
        c.goal_description, c.target_metric, c.target_value, c.current_value, c.progress_percentage,
        c.start_date, c.end_date,
        c.created_by, c.primary_organization_id,
        c.target_countries, c.member_count, c.supporter_count,
        c.twitter_hashtag, c.facebook_event_url,
        c.created_at, c.updated_at,
        u.username as creator_username,
        o.name as organization_name
      FROM campaigns c
      LEFT JOIN users u ON c.created_by = u.id
      LEFT JOIN organizations o ON c.primary_organization_id = o.id
      ${whereClause}
      ORDER BY ${sortColumn} ${sortDirection}
      LIMIT $${paramCounter} OFFSET $${paramCounter + 1}
    `;

    const result = await query(selectQuery, params);

    return {
      campaigns: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error getting campaigns', { error: error.message });
    throw error;
  }
};

/**
 * Get a single campaign by ID or slug
 */
export const getCampaignByIdOrSlug = async (identifier) => {
  try {
    const isNumeric = !isNaN(identifier);
    const queryText = isNumeric
      ? `SELECT c.*, 
          u.username as creator_username, u.email as creator_email,
          o.name as organization_name, o.slug as organization_slug
         FROM campaigns c
         LEFT JOIN users u ON c.created_by = u.id
         LEFT JOIN organizations o ON c.primary_organization_id = o.id
         WHERE c.id = $1 AND c.deleted_at IS NULL`
      : `SELECT c.*, 
          u.username as creator_username, u.email as creator_email,
          o.name as organization_name, o.slug as organization_slug
         FROM campaigns c
         LEFT JOIN users u ON c.created_by = u.id
         LEFT JOIN organizations o ON c.primary_organization_id = o.id
         WHERE c.slug = $1 AND c.deleted_at IS NULL`;

    const result = await query(queryText, [identifier]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Campaign not found');
    }

    return result.rows[0];
  } catch (error) {
    logger.error('Error getting campaign', { identifier, error: error.message });
    throw error;
  }
};

/**
 * Create a new campaign
 */
export const createCampaign = async (campaignData, userId) => {
  try {
    const {
      title,
      description,
      long_description,
      banner_image_url,
      campaign_type,
      status,
      priority,
      goal_description,
      target_metric,
      target_value,
      start_date,
      end_date,
      primary_organization_id,
      target_countries,
      twitter_hashtag,
      facebook_event_url
    } = campaignData;

    if (!title) {
      throw new ValidationError('Campaign title is required');
    }

    if (!description) {
      throw new ValidationError('Campaign description is required');
    }

    if (!start_date) {
      throw new ValidationError('Campaign start date is required');
    }

    // Generate unique slug
    const baseSlug = generateSlug(title);
    const slug = await ensureUniqueSlug(baseSlug);

    const insertQuery = `
      INSERT INTO campaigns (
        title, slug, description, long_description, banner_image_url,
        campaign_type, status, priority,
        goal_description, target_metric, target_value, current_value, progress_percentage,
        start_date, end_date,
        created_by, primary_organization_id,
        target_countries, twitter_hashtag, facebook_event_url
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 0, 0, $12, $13, $14, $15, $16, $17, $18
      ) RETURNING *
    `;

    const result = await query(insertQuery, [
      title,
      slug,
      description,
      long_description || null,
      banner_image_url || null,
      campaign_type || null,
      status || 'active',
      priority || 'medium',
      goal_description || null,
      target_metric || null,
      target_value || null,
      start_date,
      end_date || null,
      userId,
      primary_organization_id || null,
      target_countries || [],
      twitter_hashtag || null,
      facebook_event_url || null
    ]);

    // Log audit
    await query(
      `INSERT INTO audit_logs (action, entity_type, entity_id, actor_user_id, new_values)
       VALUES ($1, $2, $3, $4, $5)`,
      ['INSERT', 'campaigns', result.rows[0].id, userId, JSON.stringify(result.rows[0])]
    );

    logger.info('Campaign created', { campaignId: result.rows[0].id, userId });

    return result.rows[0];
  } catch (error) {
    logger.error('Error creating campaign', { error: error.message });
    throw error;
  }
};

/**
 * Update a campaign
 */
export const updateCampaign = async (id, updateData, userId) => {
  try {
    // Get existing campaign
    const existing = await getCampaignByIdOrSlug(id);

    // Check if user is creator or admin
    if (existing.created_by !== userId && !updateData._isAdmin) {
      throw new ForbiddenError('You can only update campaigns you created');
    }

    const {
      title,
      description,
      long_description,
      banner_image_url,
      campaign_type,
      status,
      priority,
      goal_description,
      target_metric,
      target_value,
      current_value,
      start_date,
      end_date,
      primary_organization_id,
      target_countries,
      twitter_hashtag,
      facebook_event_url
    } = updateData;

    // If title is changing, regenerate slug
    let slug = existing.slug;
    if (title && title !== existing.title) {
      const baseSlug = generateSlug(title);
      slug = await ensureUniqueSlug(baseSlug, id);
    }

    // Calculate progress if current_value or target_value changed
    let progress_percentage = existing.progress_percentage;
    const newCurrentValue = current_value !== undefined ? current_value : existing.current_value;
    const newTargetValue = target_value !== undefined ? target_value : existing.target_value;
    if (current_value !== undefined || target_value !== undefined) {
      progress_percentage = calculateProgress(newCurrentValue, newTargetValue);
    }

    const updateQuery = `
      UPDATE campaigns SET
        title = COALESCE($1, title),
        slug = COALESCE($2, slug),
        description = COALESCE($3, description),
        long_description = COALESCE($4, long_description),
        banner_image_url = COALESCE($5, banner_image_url),
        campaign_type = COALESCE($6, campaign_type),
        status = COALESCE($7, status),
        priority = COALESCE($8, priority),
        goal_description = COALESCE($9, goal_description),
        target_metric = COALESCE($10, target_metric),
        target_value = COALESCE($11, target_value),
        current_value = COALESCE($12, current_value),
        progress_percentage = COALESCE($13, progress_percentage),
        start_date = COALESCE($14, start_date),
        end_date = COALESCE($15, end_date),
        primary_organization_id = COALESCE($16, primary_organization_id),
        target_countries = COALESCE($17, target_countries),
        twitter_hashtag = COALESCE($18, twitter_hashtag),
        facebook_event_url = COALESCE($19, facebook_event_url),
        updated_at = NOW()
      WHERE id = $20 AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await query(updateQuery, [
      title || null,
      slug,
      description || null,
      long_description !== undefined ? long_description : null,
      banner_image_url !== undefined ? banner_image_url : null,
      campaign_type || null,
      status || null,
      priority || null,
      goal_description !== undefined ? goal_description : null,
      target_metric !== undefined ? target_metric : null,
      target_value !== undefined ? target_value : null,
      current_value !== undefined ? current_value : null,
      progress_percentage,
      start_date || null,
      end_date !== undefined ? end_date : null,
      primary_organization_id !== undefined ? primary_organization_id : null,
      target_countries !== undefined ? target_countries : null,
      twitter_hashtag !== undefined ? twitter_hashtag : null,
      facebook_event_url !== undefined ? facebook_event_url : null,
      id
    ]);

    // Log audit
    await query(
      `INSERT INTO audit_logs (action, entity_type, entity_id, actor_user_id, old_values, new_values)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['UPDATE', 'campaigns', id, userId, JSON.stringify(existing), JSON.stringify(result.rows[0])]
    );

    logger.info('Campaign updated', { campaignId: id, userId });

    return result.rows[0];
  } catch (error) {
    logger.error('Error updating campaign', { id, error: error.message });
    throw error;
  }
};

/**
 * Soft delete a campaign
 */
export const deleteCampaign = async (id, userId, isAdmin = false) => {
  try {
    const existing = await getCampaignByIdOrSlug(id);

    // Check if user is creator or admin
    if (existing.created_by !== userId && !isAdmin) {
      throw new ForbiddenError('You can only delete campaigns you created');
    }

    const result = await query(
      `UPDATE campaigns SET deleted_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );

    // Log audit
    await query(
      `INSERT INTO audit_logs (action, entity_type, entity_id, actor_user_id, old_values)
       VALUES ($1, $2, $3, $4, $5)`,
      ['DELETE', 'campaigns', id, userId, JSON.stringify(existing)]
    );

    logger.info('Campaign deleted', { campaignId: id, userId });

    return result.rows[0];
  } catch (error) {
    logger.error('Error deleting campaign', { id, error: error.message });
    throw error;
  }
};

/**
 * Join a campaign (add user as member)
 */
export const joinCampaign = async (campaignId, userId, role = 'supporter') => {
  try {
    // Verify campaign exists
    await getCampaignByIdOrSlug(campaignId);

    // Check if user is already a member
    const memberCheck = await query(
      'SELECT * FROM campaign_members WHERE campaign_id = $1 AND user_id = $2',
      [campaignId, userId]
    );

    if (memberCheck.rows.length > 0) {
      // If user left before, reactivate membership
      if (memberCheck.rows[0].status === 'left') {
        await query(
          `UPDATE campaign_members SET status = 'active', left_at = NULL
           WHERE campaign_id = $1 AND user_id = $2
           RETURNING *`,
          [campaignId, userId]
        );

        // Increment member count
        await query(
          `UPDATE campaigns SET 
            member_count = member_count + 1,
            supporter_count = supporter_count + 1
           WHERE id = $1`,
          [campaignId]
        );

        logger.info('User rejoined campaign', { campaignId, userId });
        return memberCheck.rows[0];
      }

      throw new ValidationError('You are already a member of this campaign');
    }

    // Add user as member
    const result = await query(
      `INSERT INTO campaign_members (campaign_id, user_id, role, status)
       VALUES ($1, $2, $3, 'active')
       RETURNING *`,
      [campaignId, userId, role]
    );

    // Increment member count
    await query(
      `UPDATE campaigns SET 
        member_count = member_count + 1,
        supporter_count = supporter_count + 1
       WHERE id = $1`,
      [campaignId]
    );

    logger.info('User joined campaign', { campaignId, userId, role });

    return result.rows[0];
  } catch (error) {
    logger.error('Error joining campaign', { campaignId, userId, error: error.message });
    throw error;
  }
};

/**
 * Leave a campaign
 */
export const leaveCampaign = async (campaignId, userId) => {
  try {
    // Check if user is a member
    const memberCheck = await query(
      'SELECT * FROM campaign_members WHERE campaign_id = $1 AND user_id = $2 AND status = $3',
      [campaignId, userId, 'active']
    );

    if (memberCheck.rows.length === 0) {
      throw new NotFoundError('You are not a member of this campaign');
    }

    // Update membership status
    await query(
      `UPDATE campaign_members SET status = 'left', left_at = NOW()
       WHERE campaign_id = $1 AND user_id = $2`,
      [campaignId, userId]
    );

    // Decrement member count
    await query(
      `UPDATE campaigns SET 
        member_count = GREATEST(0, member_count - 1),
        supporter_count = GREATEST(0, supporter_count - 1)
       WHERE id = $1`,
      [campaignId]
    );

    logger.info('User left campaign', { campaignId, userId });

    return { message: 'Successfully left campaign' };
  } catch (error) {
    logger.error('Error leaving campaign', { campaignId, userId, error: error.message });
    throw error;
  }
};

/**
 * Get campaign members
 */
export const getCampaignMembers = async (campaignId, filters = {}) => {
  try {
    const {
      page = 1,
      limit = 30,
      role,
      status = 'active'
    } = filters;

    const offset = (page - 1) * limit;
    const conditions = ['cm.campaign_id = $1'];
    const params = [campaignId];
    let paramCounter = 2;

    if (status) {
      conditions.push(`cm.status = $${paramCounter}`);
      params.push(status);
      paramCounter++;
    }

    if (role) {
      conditions.push(`cm.role = $${paramCounter}`);
      params.push(role);
      paramCounter++;
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM campaign_members cm ${whereClause}`;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Get members
    params.push(limit, offset);
    const selectQuery = `
      SELECT 
        cm.*,
        u.username, u.email, u.first_name, u.last_name, u.avatar_url
      FROM campaign_members cm
      JOIN users u ON cm.user_id = u.id
      ${whereClause}
      ORDER BY cm.joined_at DESC
      LIMIT $${paramCounter} OFFSET $${paramCounter + 1}
    `;

    const result = await query(selectQuery, params);

    return {
      members: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error getting campaign members', { campaignId, error: error.message });
    throw error;
  }
};
