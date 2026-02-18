import { query } from '../db/connection.js';
import logger from '../utils/logger.js';
import { NotFoundError, ConflictError, ValidationError, ForbiddenError } from '../middleware/errorHandler.js';

// ============================================================================
// CREATE CAMPAIGN
// ============================================================================

export const createCampaign = async (campaignData, userId) => {
  try {
    const {
      title,
      slug,
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

    // Check if slug already exists
    const existing = await query('SELECT id FROM campaigns WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      throw new ConflictError('Campaign with this slug already exists');
    }

    const result = await query(
      `INSERT INTO campaigns (
        title, slug, description, long_description, banner_image_url,
        campaign_type, status, priority, goal_description, target_metric, target_value,
        start_date, end_date, created_by, primary_organization_id,
        target_countries, twitter_hashtag, facebook_event_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *`,
      [
        title, slug, description, long_description, banner_image_url,
        campaign_type, status || 'active', priority || 'medium', 
        goal_description, target_metric, target_value,
        start_date, end_date, userId, primary_organization_id,
        Array.isArray(target_countries) ? target_countries : [], 
        twitter_hashtag, facebook_event_url
      ]
    );

    const campaign = result.rows[0];
    logger.info('Campaign created', { campaignId: campaign.id, title: campaign.title });

    return campaign;
  } catch (error) {
    logger.error('Failed to create campaign', { error: error.message });
    throw error;
  }
};

// ============================================================================
// GET CAMPAIGN BY ID
// ============================================================================

export const getCampaignById = async (id) => {
  try {
    const result = await query(
      `SELECT c.*, 
        u.username as creator_username,
        o.name as organization_name
       FROM campaigns c
       LEFT JOIN users u ON c.created_by = u.id
       LEFT JOIN organizations o ON c.primary_organization_id = o.id
       WHERE c.id = $1 AND c.deleted_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Campaign not found');
    }

    return result.rows[0];
  } catch (error) {
    logger.error('Failed to get campaign', { campaignId: id, error: error.message });
    throw error;
  }
};

// ============================================================================
// GET CAMPAIGN BY SLUG
// ============================================================================

export const getCampaignBySlug = async (slug) => {
  try {
    const result = await query(
      `SELECT c.*, 
        u.username as creator_username,
        o.name as organization_name
       FROM campaigns c
       LEFT JOIN users u ON c.created_by = u.id
       LEFT JOIN organizations o ON c.primary_organization_id = o.id
       WHERE c.slug = $1 AND c.deleted_at IS NULL`,
      [slug]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Campaign not found');
    }

    return result.rows[0];
  } catch (error) {
    logger.error('Failed to get campaign by slug', { slug, error: error.message });
    throw error;
  }
};

// ============================================================================
// LIST CAMPAIGNS
// ============================================================================

export const listCampaigns = async (filters = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      campaign_type,
      priority,
      organization_id,
      search
    } = filters;

    const offset = (page - 1) * limit;
    const params = [];
    const conditions = ['c.deleted_at IS NULL'];
    let paramCount = 0;

    // Add filters
    if (status) {
      paramCount++;
      conditions.push(`c.status = $${paramCount}`);
      params.push(status);
    }

    if (campaign_type) {
      paramCount++;
      conditions.push(`c.campaign_type = $${paramCount}`);
      params.push(campaign_type);
    }

    if (priority) {
      paramCount++;
      conditions.push(`c.priority = $${paramCount}`);
      params.push(priority);
    }

    if (organization_id) {
      paramCount++;
      conditions.push(`c.primary_organization_id = $${paramCount}`);
      params.push(organization_id);
    }

    if (search) {
      paramCount++;
      conditions.push(`(c.title ILIKE $${paramCount} OR c.description ILIKE $${paramCount})`);
      params.push(`%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM campaigns c ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    params.push(limit, offset);
    const result = await query(
      `SELECT c.*, 
        u.username as creator_username,
        o.name as organization_name
       FROM campaigns c
       LEFT JOIN users u ON c.created_by = u.id
       LEFT JOIN organizations o ON c.primary_organization_id = o.id
       ${whereClause}
       ORDER BY 
         CASE c.priority
           WHEN 'critical' THEN 1
           WHEN 'high' THEN 2
           WHEN 'medium' THEN 3
           WHEN 'low' THEN 4
         END,
         c.created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      params
    );

    return {
      campaigns: result.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Failed to list campaigns', { error: error.message });
    throw error;
  }
};

// ============================================================================
// UPDATE CAMPAIGN
// ============================================================================

export const updateCampaign = async (id, updateData, userId) => {
  try {
    const campaign = await getCampaignById(id);

    // Check if user is the creator or has admin role
    if (campaign.created_by !== userId) {
      throw new ForbiddenError('Only the campaign creator can update this campaign');
    }

    const allowedFields = [
      'title', 'description', 'long_description', 'banner_image_url',
      'campaign_type', 'status', 'priority', 'goal_description',
      'target_metric', 'target_value', 'current_value', 'progress_percentage',
      'start_date', 'end_date', 'primary_organization_id',
      'target_countries', 'twitter_hashtag', 'facebook_event_url'
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
      return campaign;
    }

    // Add updated_at
    paramCount++;
    updates.push(`updated_at = $${paramCount}`);
    params.push(new Date());

    // Add id for WHERE clause
    paramCount++;
    params.push(id);

    const result = await query(
      `UPDATE campaigns SET ${updates.join(', ')}
       WHERE id = $${paramCount} AND deleted_at IS NULL
       RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Campaign not found');
    }

    logger.info('Campaign updated', { campaignId: id });
    return result.rows[0];
  } catch (error) {
    logger.error('Failed to update campaign', { campaignId: id, error: error.message });
    throw error;
  }
};

// ============================================================================
// DELETE CAMPAIGN (SOFT DELETE)
// ============================================================================

export const deleteCampaign = async (id, userId) => {
  try {
    const campaign = await getCampaignById(id);

    // Check if user is the creator
    if (campaign.created_by !== userId) {
      throw new ForbiddenError('Only the campaign creator can delete this campaign');
    }

    const result = await query(
      `UPDATE campaigns SET deleted_at = $1, updated_at = $1
       WHERE id = $2 AND deleted_at IS NULL
       RETURNING id`,
      [new Date(), id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Campaign not found');
    }

    logger.info('Campaign deleted', { campaignId: id });
    return { success: true };
  } catch (error) {
    logger.error('Failed to delete campaign', { campaignId: id, error: error.message });
    throw error;
  }
};

// ============================================================================
// JOIN CAMPAIGN
// ============================================================================

export const joinCampaign = async (campaignId, userId, role = 'supporter') => {
  try {
    // Check if campaign exists
    await getCampaignById(campaignId);

    // Check if already a member
    const existing = await query(
      'SELECT id FROM campaign_members WHERE campaign_id = $1 AND user_id = $2',
      [campaignId, userId]
    );

    if (existing.rows.length > 0) {
      throw new ConflictError('User is already a member of this campaign');
    }

    // Add member
    const result = await query(
      `INSERT INTO campaign_members (campaign_id, user_id, role)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [campaignId, userId, role]
    );

    // Update member count
    await query(
      `UPDATE campaigns 
       SET member_count = member_count + 1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [campaignId]
    );

    logger.info('User joined campaign', { campaignId, userId });
    return result.rows[0];
  } catch (error) {
    logger.error('Failed to join campaign', { campaignId, userId, error: error.message });
    throw error;
  }
};

// ============================================================================
// LEAVE CAMPAIGN
// ============================================================================

export const leaveCampaign = async (campaignId, userId) => {
  try {
    const result = await query(
      `UPDATE campaign_members 
       SET status = 'left', left_at = CURRENT_TIMESTAMP
       WHERE campaign_id = $1 AND user_id = $2 AND status = 'active'
       RETURNING *`,
      [campaignId, userId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('User is not an active member of this campaign');
    }

    // Update member count
    await query(
      `UPDATE campaigns 
       SET member_count = GREATEST(0, member_count - 1), updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [campaignId]
    );

    logger.info('User left campaign', { campaignId, userId });
    return { success: true };
  } catch (error) {
    logger.error('Failed to leave campaign', { campaignId, userId, error: error.message });
    throw error;
  }
};

// ============================================================================
// GET CAMPAIGN MEMBERS
// ============================================================================

export const getCampaignMembers = async (campaignId, filters = {}) => {
  try {
    const { page = 1, limit = 20, role, status } = filters;
    const offset = (page - 1) * limit;
    const params = [campaignId];
    const conditions = ['cm.campaign_id = $1'];
    let paramCount = 1;

    if (role) {
      paramCount++;
      conditions.push(`cm.role = $${paramCount}`);
      params.push(role);
    }

    if (status) {
      paramCount++;
      conditions.push(`cm.status = $${paramCount}`);
      params.push(status);
    }

    const whereClause = conditions.join(' AND ');

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM campaign_members cm WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    params.push(limit, offset);
    const result = await query(
      `SELECT cm.*, u.username, u.avatar_url, u.expertise_areas
       FROM campaign_members cm
       JOIN users u ON cm.user_id = u.id
       WHERE ${whereClause}
       ORDER BY cm.joined_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      params
    );

    return {
      members: result.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Failed to get campaign members', { campaignId, error: error.message });
    throw error;
  }
};

// ============================================================================
// UPDATE CAMPAIGN PROGRESS
// ============================================================================

export const updateCampaignProgress = async (campaignId, currentValue) => {
  try {
    const campaign = await getCampaignById(campaignId);

    let progressPercentage = 0;
    if (campaign.target_value && campaign.target_value > 0) {
      progressPercentage = Math.min(100, (currentValue / campaign.target_value) * 100);
    }

    const result = await query(
      `UPDATE campaigns
       SET current_value = $1,
           progress_percentage = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [currentValue, progressPercentage, campaignId]
    );

    logger.info('Campaign progress updated', { campaignId, currentValue, progressPercentage });
    return result.rows[0];
  } catch (error) {
    logger.error('Failed to update campaign progress', { campaignId, error: error.message });
    throw error;
  }
};
