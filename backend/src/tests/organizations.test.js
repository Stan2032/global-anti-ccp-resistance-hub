import request from 'supertest';
import app from '../server.js';
import { query } from '../db/connection.js';
import logger from '../utils/logger.js';

describe('Organizations API Endpoints', () => {
  let authToken;
  let userId;
  let testOrgId;

  const testUser = {
    email: 'orgtest@example.com',
    username: 'orgtestuser',
    password: 'TestPassword123!@#',
    firstName: 'Org',
    lastName: 'Test'
  };

  const testOrganization = {
    name: 'Test Human Rights Organization',
    slug: 'test-human-rights-org',
    description: 'A test organization fighting for human rights',
    website: 'https://test-org.example.com',
    email: 'contact@test-org.example.com',
    phone: '+1-555-0123',
    headquarters_country: 'United States',
    headquarters_city: 'Washington DC',
    operating_countries: ['United States', 'United Kingdom', 'Germany'],
    founded_year: 2020,
    organization_type: 'Non-Profit',
    focus_areas: ['Human Rights', 'Political Prisoners', 'Free Speech'],
    twitter_handle: '@testorg',
    facebook_page: 'testorgfb',
    instagram_handle: 'testorginsta',
    primary_contact_name: 'John Doe',
    primary_contact_email: 'john@test-org.example.com',
    primary_contact_phone: '+1-555-0124'
  };

  // Setup: Create test user and authenticate
  beforeAll(async () => {
    try {
      // Clean up any existing test data
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
    } catch (error) {
      logger.error('Test setup error', { error: error.message });
    }
  });

  // Cleanup after all tests
  afterAll(async () => {
    try {
      await query('DELETE FROM organizations WHERE slug = $1', [testOrganization.slug]);
      await query('DELETE FROM users WHERE email = $1', [testUser.email]);
    } catch (error) {
      logger.warn('Cleanup error', { error: error.message });
    }
  });

  // ========================================================================
  // CREATE ORGANIZATION TESTS
  // ========================================================================

  describe('POST /api/v1/organizations', () => {
    it('should create a new organization with valid data', async () => {
      const response = await request(app)
        .post('/api/v1/organizations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testOrganization);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.organization).toBeDefined();
      expect(response.body.data.organization.name).toBe(testOrganization.name);
      expect(response.body.data.organization.slug).toBe(testOrganization.slug);
      expect(response.body.data.organization.verification_status).toBe('unverified');

      testOrgId = response.body.data.organization.id;
    });

    it('should reject creation without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/organizations')
        .send({
          ...testOrganization,
          slug: 'another-test-org'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject duplicate slug', async () => {
      const response = await request(app)
        .post('/api/v1/organizations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testOrganization);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('CONFLICT');
    });

    it('should reject invalid data (missing required fields)', async () => {
      const response = await request(app)
        .post('/api/v1/organizations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Org'
          // Missing slug and description
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });
  });

  // ========================================================================
  // GET ORGANIZATIONS TESTS
  // ========================================================================

  describe('GET /api/v1/organizations', () => {
    it('should list all organizations', async () => {
      const response = await request(app)
        .get('/api/v1/organizations');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.organizations).toBeDefined();
      expect(Array.isArray(response.body.data.organizations)).toBe(true);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter organizations by search term', async () => {
      const response = await request(app)
        .get('/api/v1/organizations')
        .query({ search: 'Test Human Rights' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.organizations.length).toBeGreaterThan(0);
    });

    it('should filter organizations by verification status', async () => {
      const response = await request(app)
        .get('/api/v1/organizations')
        .query({ verification_status: 'unverified' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/v1/organizations')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(10);
    });
  });

  describe('GET /api/v1/organizations/:id', () => {
    it('should get organization by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/organizations/${testOrgId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.organization.id).toBe(testOrgId);
      expect(response.body.data.organization.name).toBe(testOrganization.name);
    });

    it('should return 404 for non-existent organization', async () => {
      const response = await request(app)
        .get('/api/v1/organizations/99999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/organizations/slug/:slug', () => {
    it('should get organization by slug', async () => {
      const response = await request(app)
        .get(`/api/v1/organizations/slug/${testOrganization.slug}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.organization.slug).toBe(testOrganization.slug);
    });

    it('should return 404 for non-existent slug', async () => {
      const response = await request(app)
        .get('/api/v1/organizations/slug/non-existent-slug');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  // ========================================================================
  // UPDATE ORGANIZATION TESTS
  // ========================================================================

  describe('PUT /api/v1/organizations/:id', () => {
    it('should update organization with valid data', async () => {
      const updatedData = {
        description: 'Updated description for the test organization',
        website: 'https://updated-test-org.example.com'
      };

      const response = await request(app)
        .put(`/api/v1/organizations/${testOrgId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.organization.description).toBe(updatedData.description);
      expect(response.body.data.organization.website).toBe(updatedData.website);
    });

    it('should reject update without authentication', async () => {
      const response = await request(app)
        .put(`/api/v1/organizations/${testOrgId}`)
        .send({ description: 'Should not update' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 for non-existent organization', async () => {
      const response = await request(app)
        .put('/api/v1/organizations/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Test' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  // ========================================================================
  // VERIFICATION STATUS TESTS
  // ========================================================================

  describe('PATCH /api/v1/organizations/:id/verification', () => {
    it('should update verification status', async () => {
      const response = await request(app)
        .patch(`/api/v1/organizations/${testOrgId}/verification`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'verified' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.organization.verification_status).toBe('verified');
    });

    it('should reject invalid verification status', async () => {
      const response = await request(app)
        .patch(`/api/v1/organizations/${testOrgId}/verification`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'invalid_status' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // ========================================================================
  // DELETE ORGANIZATION TESTS
  // ========================================================================

  describe('DELETE /api/v1/organizations/:id', () => {
    it('should delete organization (soft delete)', async () => {
      const response = await request(app)
        .delete(`/api/v1/organizations/${testOrgId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBeDefined();
    });

    it('should not list deleted organization', async () => {
      const response = await request(app)
        .get(`/api/v1/organizations/${testOrgId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should reject deletion without authentication', async () => {
      const response = await request(app)
        .delete(`/api/v1/organizations/${testOrgId}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
