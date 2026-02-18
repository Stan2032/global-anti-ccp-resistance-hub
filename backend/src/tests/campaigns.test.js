import request from 'supertest';
import app from '../server.js';
import { query } from '../db/connection.js';
import logger from '../utils/logger.js';

describe('Campaigns API Endpoints', () => {
  let authToken;
  let userId;
  let testCampaignId;
  let testOrgId;

  const testUser = {
    email: 'campaigntest@example.com',
    username: 'campaigntestuser',
    password: 'TestPassword123!@#',
    firstName: 'Campaign',
    lastName: 'Test'
  };

  const testOrganization = {
    name: 'Campaign Test Organization',
    slug: 'campaign-test-org',
    description: 'Organization for campaign testing',
    website: 'https://campaign-test.example.com',
    organization_type: 'Non-Profit'
  };

  const testCampaign = {
    title: 'Free Political Prisoners Campaign',
    slug: 'free-political-prisoners',
    description: 'Campaign to advocate for the release of political prisoners',
    long_description: 'This is a comprehensive campaign working to secure the release of political prisoners held by authoritarian regimes.',
    banner_image_url: 'https://example.com/banner.jpg',
    campaign_type: 'Advocacy',
    status: 'active',
    priority: 'high',
    goal_description: 'Secure release of 100 political prisoners',
    target_metric: 'Prisoners Released',
    target_value: 100,
    start_date: new Date('2024-01-01').toISOString(),
    end_date: new Date('2025-12-31').toISOString(),
    target_countries: ['China', 'Russia', 'Iran'],
    twitter_hashtag: '#FreePoliticalPrisoners',
    facebook_event_url: 'https://facebook.com/events/test'
  };

  // Setup: Create test user and authenticate
  beforeAll(async () => {
    try {
      // Clean up any existing test data
      await query('DELETE FROM campaign_members WHERE campaign_id IN (SELECT id FROM campaigns WHERE slug = $1)', [testCampaign.slug]);
      await query('DELETE FROM campaigns WHERE slug = $1', [testCampaign.slug]);
      await query('DELETE FROM organizations WHERE slug = $1', [testOrganization.slug]);
      await query('DELETE FROM users WHERE email = $1', [testUser.email]);

      // Register test user
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);

      userId = registerResponse.body.data.user.id;

      // Login to get token
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      authToken = loginResponse.body.data.token;

      // Create test organization
      const orgResponse = await request(app)
        .post('/api/v1/organizations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testOrganization);

      testOrgId = orgResponse.body.data.organization.id;
    } catch (error) {
      logger.error('Test setup error', { error: error.message });
    }
  });

  // Cleanup after all tests
  afterAll(async () => {
    try {
      await query('DELETE FROM campaign_members WHERE campaign_id IN (SELECT id FROM campaigns WHERE slug = $1)', [testCampaign.slug]);
      await query('DELETE FROM campaigns WHERE slug = $1', [testCampaign.slug]);
      await query('DELETE FROM organizations WHERE slug = $1', [testOrganization.slug]);
      await query('DELETE FROM users WHERE email = $1', [testUser.email]);
    } catch (error) {
      logger.warn('Cleanup error', { error: error.message });
    }
  });

  // ========================================================================
  // CREATE CAMPAIGN TESTS
  // ========================================================================

  describe('POST /api/v1/campaigns', () => {
    it('should create a new campaign with valid data', async () => {
      const campaignData = {
        ...testCampaign,
        primary_organization_id: testOrgId
      };

      const response = await request(app)
        .post('/api/v1/campaigns')
        .set('Authorization', `Bearer ${authToken}`)
        .send(campaignData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.campaign).toBeDefined();
      expect(response.body.data.campaign.title).toBe(testCampaign.title);
      expect(response.body.data.campaign.slug).toBe(testCampaign.slug);
      expect(response.body.data.campaign.status).toBe('active');
      expect(response.body.data.campaign.priority).toBe('high');

      testCampaignId = response.body.data.campaign.id;
    });

    it('should reject creation without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/campaigns')
        .send({
          ...testCampaign,
          slug: 'another-campaign'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject duplicate slug', async () => {
      const response = await request(app)
        .post('/api/v1/campaigns')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testCampaign,
          primary_organization_id: testOrgId
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    it('should reject invalid data (missing required fields)', async () => {
      const response = await request(app)
        .post('/api/v1/campaigns')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Campaign'
          // Missing slug, description, start_date
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });
  });

  // ========================================================================
  // GET CAMPAIGNS TESTS
  // ========================================================================

  describe('GET /api/v1/campaigns', () => {
    it('should list all campaigns', async () => {
      const response = await request(app)
        .get('/api/v1/campaigns');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.campaigns).toBeDefined();
      expect(Array.isArray(response.body.data.campaigns)).toBe(true);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter campaigns by status', async () => {
      const response = await request(app)
        .get('/api/v1/campaigns')
        .query({ status: 'active' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.campaigns.every(c => c.status === 'active')).toBe(true);
    });

    it('should filter campaigns by priority', async () => {
      const response = await request(app)
        .get('/api/v1/campaigns')
        .query({ priority: 'high' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should filter campaigns by organization', async () => {
      const response = await request(app)
        .get('/api/v1/campaigns')
        .query({ organization_id: testOrgId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should search campaigns by text', async () => {
      const response = await request(app)
        .get('/api/v1/campaigns')
        .query({ search: 'Political Prisoners' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/campaigns/:id', () => {
    it('should get campaign by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/campaigns/${testCampaignId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.campaign.id).toBe(testCampaignId);
      expect(response.body.data.campaign.title).toBe(testCampaign.title);
    });

    it('should return 404 for non-existent campaign', async () => {
      const response = await request(app)
        .get('/api/v1/campaigns/99999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/campaigns/slug/:slug', () => {
    it('should get campaign by slug', async () => {
      const response = await request(app)
        .get(`/api/v1/campaigns/slug/${testCampaign.slug}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.campaign.slug).toBe(testCampaign.slug);
    });
  });

  // ========================================================================
  // UPDATE CAMPAIGN TESTS
  // ========================================================================

  describe('PUT /api/v1/campaigns/:id', () => {
    it('should update campaign with valid data', async () => {
      const updatedData = {
        description: 'Updated campaign description',
        status: 'paused'
      };

      const response = await request(app)
        .put(`/api/v1/campaigns/${testCampaignId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.campaign.description).toBe(updatedData.description);
      expect(response.body.data.campaign.status).toBe(updatedData.status);
    });

    it('should reject update without authentication', async () => {
      const response = await request(app)
        .put(`/api/v1/campaigns/${testCampaignId}`)
        .send({ description: 'Should not update' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  // ========================================================================
  // CAMPAIGN MEMBERSHIP TESTS
  // ========================================================================

  describe('POST /api/v1/campaigns/:id/join', () => {
    it('should allow user to join campaign', async () => {
      const response = await request(app)
        .post(`/api/v1/campaigns/${testCampaignId}/join`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ role: 'supporter' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.membership).toBeDefined();
      expect(response.body.data.membership.role).toBe('supporter');
    });

    it('should reject duplicate join', async () => {
      const response = await request(app)
        .post(`/api/v1/campaigns/${testCampaignId}/join`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ role: 'supporter' });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    it('should require authentication to join', async () => {
      const response = await request(app)
        .post(`/api/v1/campaigns/${testCampaignId}/join`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/campaigns/:id/members', () => {
    it('should list campaign members', async () => {
      const response = await request(app)
        .get(`/api/v1/campaigns/${testCampaignId}/members`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.members).toBeDefined();
      expect(Array.isArray(response.body.data.members)).toBe(true);
      expect(response.body.data.members.length).toBeGreaterThan(0);
    });

    it('should filter members by role', async () => {
      const response = await request(app)
        .get(`/api/v1/campaigns/${testCampaignId}/members`)
        .query({ role: 'supporter' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/campaigns/:id/leave', () => {
    it('should allow user to leave campaign', async () => {
      const response = await request(app)
        .post(`/api/v1/campaigns/${testCampaignId}/leave`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBeDefined();
    });

    it('should reject leaving if not a member', async () => {
      const response = await request(app)
        .post(`/api/v1/campaigns/${testCampaignId}/leave`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  // ========================================================================
  // CAMPAIGN PROGRESS TESTS
  // ========================================================================

  describe('PATCH /api/v1/campaigns/:id/progress', () => {
    it('should update campaign progress', async () => {
      const response = await request(app)
        .patch(`/api/v1/campaigns/${testCampaignId}/progress`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ current_value: 25 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.campaign.current_value).toBe(25);
      expect(response.body.data.campaign.progress_percentage).toBe(25); // 25/100 * 100
    });

    it('should require authentication to update progress', async () => {
      const response = await request(app)
        .patch(`/api/v1/campaigns/${testCampaignId}/progress`)
        .send({ current_value: 30 });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  // ========================================================================
  // DELETE CAMPAIGN TESTS
  // ========================================================================

  describe('DELETE /api/v1/campaigns/:id', () => {
    it('should delete campaign (soft delete)', async () => {
      const response = await request(app)
        .delete(`/api/v1/campaigns/${testCampaignId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should not list deleted campaign', async () => {
      const response = await request(app)
        .get(`/api/v1/campaigns/${testCampaignId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
