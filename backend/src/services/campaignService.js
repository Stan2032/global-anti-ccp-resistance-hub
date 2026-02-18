import { query } from '../db/connection.js';
import logger from '../utils/logger.js';
import { NotFoundError, ConflictError, ValidationError, ForbiddenError } from '../middleware/errorHandler.js';

// ============================================================================
// CREATE CAMPAIGN
// ============================================================================

export const createCampaign = async (campaignData, createdByUserId) => {
  const {
    title,
    slug,
    description,
    longDescription,
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
    bannerImageUrl
  } = campaignData;

  try {
    // Check if slug already exists
    const slugExists = await query(
      'SELECT id FROM campaigns WHERE slug = $1 AND deleted_at IS NULL',
      [slug]
    );

    if (slugExists.rows.length > 0) {
      throw new ConflictError('Campaign slug already exists');
    }

    // Create campaign
    const result = await query(
      `INSERT INTO campaigns (
        title, slug, description, long_description, campaign_type,
        status, priority, goal_description, target_metric, target_value,
        start_date, end_date, created_by, primary_organization_id,
        target_countries, twitter_hashtag, banner_image_url,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW())
      RETURNING *`,
      [
        title,
        slug,
        description,
        longDescription,
        campaignType,
        status,
        priority,
        goalDescription,
        targetMetric,
        targetValue,
        startDate,
        endDate,
        createdByUserId,
        primaryOrganizationId,
        targetCountries || [],
        twitterHashtag,
        bannerImageUrl
      ]
    );

    const campaign = result.rows[0];

    // Automatically add creator as organizer
    await query(
      `INSERT INTO campaign_members (campaign_id, user_id, role, status, joined_at)
       VALUES ($1, $2, 'organizer', 'active', NOW())`,
      [campaign.id, createdByUserId]
    );

    // Update member count
    await query(
      'UPDATE campaigns SET member_count = 1 WHERE id = $1',
      [campaign.id]
    );

    logger.info('Campaign created', { campaignId: campaign.id, title, createdByUserId });
    
    return campaign;
  } catch (error) {
    logger.error('Campaign creation failed', { title, error: error.message });
    throw error;
  }
};

// ============================================================================
// GET ALL CAMPAIGNS
// ============================================================================

export const getAllCampaigns = async (filters = {}, pagination = {}) => {
  const { 
    status, 
    campaignType, 
    priority,
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
    if (status) {
      paramCount++;
      conditions.push(`status = $${paramCount}`);
      params.push(status);
    }

    if (campaignType) {
      paramCount++;
      conditions.push(`campaign_type = $${paramCount}`);
      params.push(campaignType);
    }

    if (priority) {
      paramCount++;
      conditions.push(`priority = $${paramCount}`);
      params.push(priority);
    }

    if (country) {
      paramCount++;
      conditions.push(`$${paramCount} = ANY(target_countries)`);
      params.push(country);
    }

    if (search) {
      paramCount++;
      conditions.push(`(title ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
      params.push(`%${search}%`);
    }

    const whereClause = conditions.join(' AND ');

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM campaigns WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get campaigns
    const validSortColumns = ['title', 'created_at', 'updated_at', 'start_date', 'priority', 'member_count'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const sortDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const result = await query(
      `SELECT c.*, 
              u.username as creator_username,
              o.name as organization_name
       FROM campaigns c
       LEFT JOIN users u ON c.created_by = u.id
       LEFT JOIN organizations o ON c.primary_organization_id = o.id
       WHERE ${whereClause}
       ORDER BY ${sortColumn} ${sortDirection}
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
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
    logger.error('Failed to get campaigns', { error: error.message });
    throw error;
  }
};

// ============================================================================
// GET CAMPAIGN BY ID
// ============================================================================

export const getCampaignById = async (campaignId) => {
  try {
    const result = await query(
      `SELECT c.*, 
              u.username as creator_username, u.email as creator_email,
              o.name as organization_name, o.slug as organization_slug
       FROM campaigns c
       LEFT JOIN users u ON c.created_by = u.id
       LEFT JOIN organizations o ON c.primary_organization_id = o.id
       WHERE c.id = $1 AND c.deleted_at IS NULL`,
      [campaignId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Campaign not found');
    }

    return result.rows[0];
  } catch (error) {
    logger.error('Failed to get campaign', { campaignId, error: error.message });
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
              o.name as organization_name, o.slug as organization_slug
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
// UPDATE CAMPAIGN
// ============================================================================

export const updateCampaign = async (campaignId, updateData, userId, userRoles) => {
  try {
    // Get existing campaign
    const existing = await getCampaignById(campaignId);

    // Check permissions - only creator, organizers, or admins can update
    const isAdmin = userRoles.includes('admin') || userRoles.includes('moderator');
    const isCreator = existing.created_by === userId;
    
    if (!isAdmin && !isCreator) {
      // Check if user is an organizer
      const memberResult = await query(
        `SELECT role FROM campaign_members 
         WHERE campaign_id = $1 AND user_id = $2 AND status = 'active'`,
        [campaignId, userId]
      );
      
      const isOrganizer = memberResult.rows.length > 0 && memberResult.rows[0].role === 'organizer';
      
      if (!isOrganizer) {
        throw new ForbiddenError('Only campaign creator, organizers, or administrators can update campaigns');
      }
    }

    const {
      title,
      description,
      longDescription,
      campaignType,
      status,
      priority,
      goalDescription,
      targetMetric,
      targetValue,
      currentValue,
      startDate,
      endDate,
      primaryOrganizationId,
      targetCountries,
      twitterHashtag,
      bannerImageUrl
    } = updateData;

    // Calculate progress percentage if target and current values are provided
    let progressPercentage = null;
    if (targetValue && currentValue !== undefined) {
      progressPercentage = (currentValue / targetValue) * 100;
    }

    const result = await query(
      `UPDATE campaigns SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        long_description = COALESCE($3, long_description),
        campaign_type = COALESCE($4, campaign_type),
        status = COALESCE($5, status),
        priority = COALESCE($6, priority),
        goal_description = COALESCE($7, goal_description),
        target_metric = COALESCE($8, target_metric),
        target_value = COALESCE($9, target_value),
        current_value = COALESCE($10, current_value),
        progress_percentage = COALESCE($11, progress_percentage),
        start_date = COALESCE($12, start_date),
        end_date = COALESCE($13, end_date),
        primary_organization_id = COALESCE($14, primary_organization_id),
        target_countries = COALESCE($15, target_countries),
        twitter_hashtag = COALESCE($16, twitter_hashtag),
        banner_image_url = COALESCE($17, banner_image_url),
        updated_at = NOW()
      WHERE id = $18 AND deleted_at IS NULL
      RETURNING *`,
      [
        title,
        description,
        longDescription,
        campaignType,
        status,
        priority,
        goalDescription,
        targetMetric,
        targetValue,
        currentValue,
        progressPercentage,
        startDate,
        endDate,
        primaryOrganizationId,
        targetCountries,
        twitterHashtag,
        bannerImageUrl,
        campaignId
      ]
    );

    logger.info('Campaign updated', { campaignId, userId });
    return result.rows[0];
  } catch (error) {
    logger.error('Failed to update campaign', { campaignId, error: error.message });
    throw error;
  }
};

// ============================================================================
// DELETE (SOFT DELETE) CAMPAIGN
// ============================================================================

export const deleteCampaign = async (campaignId, userId, userRoles) => {
  try {
    // Get existing campaign
    const existing = await getCampaignById(campaignId);

    // Check permissions
    const isAdmin = userRoles.includes('admin');
    const isCreator = existing.created_by === userId;
    
    if (!isAdmin && !isCreator) {
      throw new ForbiddenError('Only campaign creator or administrators can delete campaigns');
    }

    const result = await query(
      `UPDATE campaigns SET deleted_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [campaignId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Campaign not found');
    }

    logger.info('Campaign deleted', { campaignId, userId });
    return { message: 'Campaign deleted successfully' };
  } catch (error) {
    logger.error('Failed to delete campaign', { campaignId, error: error.message });
    throw error;
  }
};

// ============================================================================
// JOIN CAMPAIGN
// ============================================================================

export const joinCampaign = async (campaignId, userId, role = 'supporter') => {
  try {
    // Check if campaign exists
    const campaign = await getCampaignById(campaignId);

    // Check if user is already a member
    const existingMember = await query(
      `SELECT id, status FROM campaign_members 
       WHERE campaign_id = $1 AND user_id = $2`,
      [campaignId, userId]
    );

    if (existingMember.rows.length > 0) {
      // If user left before, reactivate membership
      if (existingMember.rows[0].status === 'left') {
        await query(
          `UPDATE campaign_members 
           SET status = 'active', joined_at = NOW()
           WHERE campaign_id = $1 AND user_id = $2`,
          [campaignId, userId]
        );

        // Update member count
        await updateMemberCount(campaignId);

        return { message: 'Successfully rejoined campaign' };
      }
      
      throw new ConflictError('Already a member of this campaign');
    }

    // Add user as member
    await query(
      `INSERT INTO campaign_members (campaign_id, user_id, role, status, joined_at)
       VALUES ($1, $2, $3, 'active', NOW())`,
      [campaignId, userId, role]
    );

    // Update member count
    await updateMemberCount(campaignId);

    logger.info('User joined campaign', { campaignId, userId, role });
    
    return { message: 'Successfully joined campaign' };
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
    // Check if user is a member
    const memberResult = await query(
      `SELECT id, role FROM campaign_members 
       WHERE campaign_id = $1 AND user_id = $2 AND status = 'active'`,
      [campaignId, userId]
    );

    if (memberResult.rows.length === 0) {
      throw new NotFoundError('Not a member of this campaign');
    }

    const member = memberResult.rows[0];

    // Don't allow organizers to leave if they're the only organizer
    if (member.role === 'organizer') {
      const organizerCount = await query(
        `SELECT COUNT(*) FROM campaign_members 
         WHERE campaign_id = $1 AND role = 'organizer' AND status = 'active'`,
        [campaignId]
      );

      if (parseInt(organizerCount.rows[0].count) <= 1) {
        throw new ValidationError('Cannot leave campaign as the last organizer');
      }
    }

    // Update member status
    await query(
      `UPDATE campaign_members 
       SET status = 'left', left_at = NOW()
       WHERE campaign_id = $1 AND user_id = $2`,
      [campaignId, userId]
    );

    // Update member count
    await updateMemberCount(campaignId);

    logger.info('User left campaign', { campaignId, userId });
    
    return { message: 'Successfully left campaign' };
  } catch (error) {
    logger.error('Failed to leave campaign', { campaignId, userId, error: error.message });
    throw error;
  }
};

// ============================================================================
// GET CAMPAIGN MEMBERS
// ============================================================================

export const getCampaignMembers = async (campaignId, pagination = {}) => {
  const { page = 1, limit = 30 } = pagination;
  const offset = (page - 1) * limit;

  try {
    // Check if campaign exists
    await getCampaignById(campaignId);

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM campaign_members 
       WHERE campaign_id = $1 AND status = 'active'`,
      [campaignId]
    );
    const total = parseInt(countResult.rows[0].count);

    // Get members
    const result = await query(
      `SELECT cm.*, u.username, u.email, u.first_name, u.last_name, u.avatar_url
       FROM campaign_members cm
       JOIN users u ON cm.user_id = u.id
       WHERE cm.campaign_id = $1 AND cm.status = 'active'
       ORDER BY 
         CASE cm.role 
           WHEN 'organizer' THEN 1
           WHEN 'contributor' THEN 2
           WHEN 'supporter' THEN 3
         END,
         cm.joined_at DESC
       LIMIT $2 OFFSET $3`,
      [campaignId, limit, offset]
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
    logger.error('Failed to get campaign members', { campaignId, error: error.message });
    throw error;
  }
};

// ============================================================================
// HELPER: UPDATE MEMBER COUNT
// ============================================================================

const updateMemberCount = async (campaignId) => {
  const result = await query(
    `SELECT COUNT(*) FROM campaign_members 
     WHERE campaign_id = $1 AND status = 'active'`,
    [campaignId]
  );

  const count = parseInt(result.rows[0].count);

  await query(
    'UPDATE campaigns SET member_count = $1, updated_at = NOW() WHERE id = $2',
    [count, campaignId]
  );
};

export default {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  getCampaignBySlug,
  updateCampaign,
  deleteCampaign,
  joinCampaign,
  leaveCampaign,
  getCampaignMembers
};
