import { query } from '../db/database.js';
import logger from '../utils/logger.js';

/**
 * Generate slug from campaign title
 */
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Create a new campaign
 */
export const createCampaign = async (campaignData, userId) => {
  try {
    const {
      title,
      description,
      longDescription,
      bannerImageUrl,
      campaignType,
      status = 'active',
      priority = 'medium',
      goalDescription,
      targetMetric,
      targetValue,
      startDate,
      endDate,
      primaryOrganizationId,
      targetCountries,
      twitterHashtag,
      facebookEventUrl
    } = campaignData;

    // Generate slug from title
    const slug = generateSlug(title);

    const result = await query(
      `INSERT INTO campaigns (
        title, slug, description, long_description, banner_image_url,
        campaign_type, status, priority, goal_description,
        target_metric, target_value, start_date, end_date,
        created_by, primary_organization_id, target_countries,
        twitter_hashtag, facebook_event_url,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *`,
      [
        title, slug, description, longDescription, bannerImageUrl,
        campaignType, status, priority, goalDescription,
        targetMetric, targetValue, startDate, endDate,
        userId, primaryOrganizationId, targetCountries || [],
        twitterHashtag, facebookEventUrl
      ]
    );

    logger.info('Campaign created', { campaignId: result.rows[0].id, title, userId });
    return result.rows[0];
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      throw new Error('Campaign with this title already exists');
    }
    logger.error('Error creating campaign', { error: error.message });
    throw error;
  }
};

/**
 * Get all campaigns with optional filters
 */
export const getCampaigns = async (filters = {}) => {
  try {
    const {
      search,
      status,
      campaignType,
      priority,
      country,
      organizationId,
      createdBy,
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
      conditions.push(`(title ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }

    // Add status filter
    if (status) {
      conditions.push(`status = $${paramCount}`);
      params.push(status);
      paramCount++;
    }

    // Add campaign type filter
    if (campaignType) {
      conditions.push(`campaign_type = $${paramCount}`);
      params.push(campaignType);
      paramCount++;
    }

    // Add priority filter
    if (priority) {
      conditions.push(`priority = $${paramCount}`);
      params.push(priority);
      paramCount++;
    }

    // Add country filter
    if (country) {
      conditions.push(`$${paramCount} = ANY(target_countries)`);
      params.push(country);
      paramCount++;
    }

    // Add organization filter
    if (organizationId) {
      conditions.push(`primary_organization_id = $${paramCount}`);
      params.push(organizationId);
      paramCount++;
    }

    // Add created by filter
    if (createdBy) {
      conditions.push(`created_by = $${paramCount}`);
      params.push(createdBy);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Validate sort column
    const validSortColumns = ['created_at', 'updated_at', 'title', 'start_date', 'end_date', 'member_count', 'progress_percentage'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM campaigns ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    const result = await query(
      `SELECT c.*, 
        u.username as creator_username,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name,
        o.name as organization_name,
        o.logo_url as organization_logo
       FROM campaigns c
       LEFT JOIN users u ON c.created_by = u.id
       LEFT JOIN organizations o ON c.primary_organization_id = o.id
       ${whereClause}
       ORDER BY c.${sortColumn} ${validSortOrder}
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...params, limit, offset]
    );

    return {
      campaigns: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error getting campaigns', { error: error.message });
    throw error;
  }
};

/**
 * Get campaign by ID
 */
export const getCampaignById = async (id) => {
  try {
    const result = await query(
      `SELECT c.*,
        u.username as creator_username,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name,
        u.email as creator_email,
        o.name as organization_name,
        o.slug as organization_slug,
        o.logo_url as organization_logo
       FROM campaigns c
       LEFT JOIN users u ON c.created_by = u.id
       LEFT JOIN organizations o ON c.primary_organization_id = o.id
       WHERE c.id = $1 AND c.deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Campaign not found');
    }

    return result.rows[0];
  } catch (error) {
    logger.error('Error getting campaign', { error: error.message, id });
    throw error;
  }
};

/**
 * Get campaign by slug
 */
export const getCampaignBySlug = async (slug) => {
  try {
    const result = await query(
      `SELECT c.*,
        u.username as creator_username,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name,
        o.name as organization_name,
        o.slug as organization_slug,
        o.logo_url as organization_logo
       FROM campaigns c
       LEFT JOIN users u ON c.created_by = u.id
       LEFT JOIN organizations o ON c.primary_organization_id = o.id
       WHERE c.slug = $1 AND c.deleted_at IS NULL`,
      [slug]
    );

    if (result.rows.length === 0) {
      throw new Error('Campaign not found');
    }

    return result.rows[0];
  } catch (error) {
    logger.error('Error getting campaign by slug', { error: error.message, slug });
    throw error;
  }
};

/**
 * Update campaign
 */
export const updateCampaign = async (id, updates, userId) => {
  try {
    const allowedFields = [
      'title', 'description', 'long_description', 'banner_image_url',
      'campaign_type', 'status', 'priority', 'goal_description',
      'target_metric', 'target_value', 'current_value', 'progress_percentage',
      'start_date', 'end_date', 'primary_organization_id', 'target_countries',
      'twitter_hashtag', 'facebook_event_url'
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
      `UPDATE campaigns 
       SET ${updateFields.join(', ')}
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      throw new Error('Campaign not found or already deleted');
    }

    logger.info('Campaign updated', { campaignId: id, userId });
    return result.rows[0];
  } catch (error) {
    logger.error('Error updating campaign', { error: error.message, id });
    throw error;
  }
};

/**
 * Delete campaign (soft delete)
 */
export const deleteCampaign = async (id, userId) => {
  try {
    const result = await query(
      `UPDATE campaigns 
       SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Campaign not found or already deleted');
    }

    logger.info('Campaign deleted', { campaignId: id, userId });
    return { success: true, id };
  } catch (error) {
    logger.error('Error deleting campaign', { error: error.message, id });
    throw error;
  }
};

/**
 * Join campaign
 */
export const joinCampaign = async (campaignId, userId, role = 'supporter') => {
  try {
    // Check if campaign exists and is active
    const campaign = await getCampaignById(campaignId);
    if (campaign.status !== 'active') {
      throw new Error('Campaign is not active');
    }

    // Check if user is already a member
    const existing = await query(
      'SELECT * FROM campaign_members WHERE campaign_id = $1 AND user_id = $2',
      [campaignId, userId]
    );

    if (existing.rows.length > 0) {
      if (existing.rows[0].status === 'active') {
        throw new Error('Already a member of this campaign');
      }
      // Reactivate membership
      await query(
        `UPDATE campaign_members 
         SET status = 'active', joined_at = CURRENT_TIMESTAMP
         WHERE campaign_id = $1 AND user_id = $2`,
        [campaignId, userId]
      );
    } else {
      // Add new member
      await query(
        `INSERT INTO campaign_members (campaign_id, user_id, role, status, joined_at)
         VALUES ($1, $2, $3, 'active', CURRENT_TIMESTAMP)`,
        [campaignId, userId, role]
      );
    }

    // Update member count
    await query(
      `UPDATE campaigns 
       SET member_count = (SELECT COUNT(*) FROM campaign_members WHERE campaign_id = $1 AND status = 'active'),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [campaignId]
    );

    logger.info('User joined campaign', { campaignId, userId });
    return { success: true, message: 'Successfully joined campaign' };
  } catch (error) {
    logger.error('Error joining campaign', { error: error.message, campaignId, userId });
    throw error;
  }
};

/**
 * Leave campaign
 */
export const leaveCampaign = async (campaignId, userId) => {
  try {
    const result = await query(
      `UPDATE campaign_members 
       SET status = 'left', left_at = CURRENT_TIMESTAMP
       WHERE campaign_id = $1 AND user_id = $2 AND status = 'active'
       RETURNING id`,
      [campaignId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Not a member of this campaign');
    }

    // Update member count
    await query(
      `UPDATE campaigns 
       SET member_count = (SELECT COUNT(*) FROM campaign_members WHERE campaign_id = $1 AND status = 'active'),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [campaignId]
    );

    logger.info('User left campaign', { campaignId, userId });
    return { success: true, message: 'Successfully left campaign' };
  } catch (error) {
    logger.error('Error leaving campaign', { error: error.message, campaignId, userId });
    throw error;
  }
};

/**
 * Get campaign members
 */
export const getCampaignMembers = async (campaignId, filters = {}) => {
  try {
    const { role, status = 'active', page = 1, limit = 50 } = filters;
    const offset = (page - 1) * limit;

    const conditions = ['cm.campaign_id = $1'];
    const params = [campaignId];
    let paramCount = 2;

    if (role) {
      conditions.push(`cm.role = $${paramCount}`);
      params.push(role);
      paramCount++;
    }

    if (status) {
      conditions.push(`cm.status = $${paramCount}`);
      params.push(status);
      paramCount++;
    }

    const whereClause = conditions.join(' AND ');

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM campaign_members cm WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get members
    const result = await query(
      `SELECT cm.*,
        u.username, u.first_name, u.last_name, u.avatar_url, u.bio
       FROM campaign_members cm
       JOIN users u ON cm.user_id = u.id
       WHERE ${whereClause}
       ORDER BY cm.joined_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...params, limit, offset]
    );

    return {
      members: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error getting campaign members', { error: error.message, campaignId });
    throw error;
  }
};

/**
 * Update campaign progress
 */
export const updateCampaignProgress = async (campaignId, currentValue, userId) => {
  try {
    const campaign = await getCampaignById(campaignId);
    
    let progressPercentage = 0;
    if (campaign.target_value && campaign.target_value > 0) {
      progressPercentage = Math.min(100, (currentValue / campaign.target_value) * 100);
    }

    const result = await query(
      `UPDATE campaigns 
       SET current_value = $2, 
           progress_percentage = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [campaignId, currentValue, progressPercentage]
    );

    logger.info('Campaign progress updated', { campaignId, currentValue, progressPercentage, userId });
    return result.rows[0];
  } catch (error) {
    logger.error('Error updating campaign progress', { error: error.message, campaignId });
    throw error;
  }
};
