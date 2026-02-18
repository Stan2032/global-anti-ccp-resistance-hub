import request from 'supertest';
import app from '../server.js';
import { query } from '../db/connection.js';
import logger from '../utils/logger.js';

describe('Organization Endpoints', () => {
  const testAdmin = {
    email: 'admin@test.com',
    username: 'testadmin',
    password: 'AdminPassword123!@#',
    firstName: 'Admin',
    lastName: 'User'
  };

  const testUser = {
    email: 'user@test.com',
    username: 'testuser',
    password: 'UserPassword123!@#',
    firstName: 'Test',
    lastName: 'User'
  };

  const testOrganization = {
    name: 'Test Resistance Organization',
    description: 'A test organization for resistance activities',
    website: 'https://test-org.example.com',
    email: 'contact@test-org.example.com',
    headquarters_country: 'United States',
    headquarters_city: 'Washington DC',
    organization_type: 'Advocacy',
    focus_areas: ['human_rights', 'democracy']
  };

  let adminToken;
  let userToken;
  let organizationId;

  // Setup before tests
  beforeAll(async () => {
    try {
      // Clean up test data
      await query('DELETE FROM organizations WHERE email = $1', [testOrganization.email]);
      await query('DELETE FROM users WHERE email = $1 OR email = $2', [testAdmin.email, testUser.email]);

      // Register admin user
      const adminResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(testAdmin);
      
      // Make admin user an actual admin (direct database update for testing)
      const adminUserId = adminResponse.body.data.user.id;
      await query(
        `INSERT INTO user_roles (user_id, role_id)
         SELECT $1, id FROM roles WHERE name = 'admin'
         ON CONFLICT (user_id, role_id) DO NOTHING`,
        [adminUserId]
      );

      // Login admin
      const adminLoginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testAdmin.email,
          password: testAdmin.password
        });
      adminToken = adminLoginResponse.body.data.accessToken;

      // Register regular user
      await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);

      // Login user
      const userLoginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      userToken = userLoginResponse.body.data.accessToken;

    } catch (error) {
      logger.error('Test setup error', { error: error.message });
    }
  });

  // Cleanup after tests
  afterAll(async () => {
    try {
      await query('DELETE FROM organizations WHERE email = $1', [testOrganization.email]);
      await query('DELETE FROM users WHERE email = $1 OR email = $2', [testAdmin.email, testUser.email]);
    } catch (error) {
      logger.warn('Cleanup error', { error: error.message });
    }
  });

  // ========================================================================
  // CREATE ORGANIZATION TESTS (Admin only)
  // ========================================================================

  describe('POST /api/v1/organizations', () => {
    it('should create organization when authenticated as admin', async () => {
      const response = await request(app)
        .post('/api/v1/organizations')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testOrganization);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(testOrganization.name);
      expect(response.body.data.slug).toBeDefined();
      expect(response.body.data.verification_status).toBe('verified');

      organizationId = response.body.data.id;
    });

    it('should reject organization creation without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/organizations')
        .send({
          name: 'Another Organization',
          description: 'Test'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject organization creation for non-admin users', async () => {
      const response = await request(app)
        .post('/api/v1/organizations')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Another Organization',
          description: 'Test'
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should reject organization with missing required fields', async () => {
      const response = await request(app)
        .post('/api/v1/organizations')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          description: 'Missing name field'
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  // ========================================================================
  // GET ORGANIZATION TESTS (Public)
  // ========================================================================

  describe('GET /api/v1/organizations', () => {
    it('should list organizations without authentication', async () => {
      const response = await request(app)
        .get('/api/v1/organizations');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.organizations).toBeDefined();
      expect(Array.isArray(response.body.data.organizations)).toBe(true);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/v1/organizations')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(10);
    });

    it('should support search', async () => {
      const response = await request(app)
        .get('/api/v1/organizations')
        .query({ search: 'Test Resistance' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should support filtering by type', async () => {
      const response = await request(app)
        .get('/api/v1/organizations')
        .query({ organization_type: 'Advocacy' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/organizations/:id', () => {
    it('should get single organization by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/organizations/${organizationId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(organizationId);
      expect(response.body.data.name).toBe(testOrganization.name);
    });

    it('should get single organization by slug', async () => {
      const response = await request(app)
        .get('/api/v1/organizations/test-resistance-organization');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(testOrganization.name);
    });

    it('should return 404 for non-existent organization', async () => {
      const response = await request(app)
        .get('/api/v1/organizations/99999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  // ========================================================================
  // UPDATE ORGANIZATION TESTS (Admin only)
  // ========================================================================

  describe('PUT /api/v1/organizations/:id', () => {
    it('should update organization when authenticated as admin', async () => {
      const updates = {
        description: 'Updated description for test organization',
        phone: '+1-555-0123'
      };

      const response = await request(app)
        .put(`/api/v1/organizations/${organizationId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.description).toBe(updates.description);
      expect(response.body.data.phone).toBe(updates.phone);
    });

    it('should reject update without authentication', async () => {
      const response = await request(app)
        .put(`/api/v1/organizations/${organizationId}`)
        .send({ description: 'Updated' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject update for non-admin users', async () => {
      const response = await request(app)
        .put(`/api/v1/organizations/${organizationId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ description: 'Updated' });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  // ========================================================================
  // SUGGEST EDIT TESTS (Authenticated users)
  // ========================================================================

  describe('POST /api/v1/organizations/:id/suggest-edit', () => {
    it('should allow authenticated user to suggest edit', async () => {
      const suggestion = {
        proposed_changes: {
          phone: '+1-555-9999',
          email: 'updated@test-org.example.com'
        },
        reason: 'Contact information has changed'
      };

      const response = await request(app)
        .post(`/api/v1/organizations/${organizationId}/suggest-edit`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(suggestion);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('pending');
      expect(response.body.data.change_type).toBe('edit');
    });

    it('should reject suggestion without authentication', async () => {
      const response = await request(app)
        .post(`/api/v1/organizations/${organizationId}/suggest-edit`)
        .send({
          proposed_changes: { phone: '+1-555-0000' },
          reason: 'Update'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject suggestion without proposed changes', async () => {
      const response = await request(app)
        .post(`/api/v1/organizations/${organizationId}/suggest-edit`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          reason: 'Update without changes'
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });
  });

  // ========================================================================
  // DELETE ORGANIZATION TESTS (Admin only)
  // ========================================================================

  describe('DELETE /api/v1/organizations/:id', () => {
    it('should reject delete without authentication', async () => {
      const response = await request(app)
        .delete(`/api/v1/organizations/${organizationId}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject delete for non-admin users', async () => {
      const response = await request(app)
        .delete(`/api/v1/organizations/${organizationId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should soft delete organization when authenticated as admin', async () => {
      const response = await request(app)
        .delete(`/api/v1/organizations/${organizationId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.deleted_at).toBeDefined();
    });

    it('should not find deleted organization', async () => {
      const response = await request(app)
        .get(`/api/v1/organizations/${organizationId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
