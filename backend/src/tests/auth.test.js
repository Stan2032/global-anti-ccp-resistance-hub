import request from 'supertest';
import app from '../server.js';
import { query } from '../db/database.js';
import logger from '../utils/logger.js';

describe('Authentication Endpoints', () => {
  const testUser = {
    email: 'test@example.com',
    username: 'testuser',
    password: 'TestPassword123!@#',
    firstName: 'Test',
    lastName: 'User'
  };

  let accessToken;
  let refreshToken;
  let userId;

  // Clean up before tests
  beforeAll(async () => {
    try {
      // Delete test user if exists
      await query('DELETE FROM users WHERE email = $1', [testUser.email]);
    } catch (error) {
      logger.warn('Cleanup error', { error: error.message });
    }
  });

  // Clean up after tests
  afterAll(async () => {
    try {
      await query('DELETE FROM users WHERE email = $1', [testUser.email]);
    } catch (error) {
      logger.warn('Cleanup error', { error: error.message });
    }
  });

  // ========================================================================
  // REGISTRATION TESTS
  // ========================================================================

  describe('POST /api/v1/auth/register', () => {
    it('should successfully register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.username).toBe(testUser.username);

      userId = response.body.data.user.id;
    });

    it('should reject duplicate email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('CONFLICT');
    });

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...testUser,
          email: 'invalid-email',
          username: 'anotheruser'
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject weak password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...testUser,
          password: 'weak',
          username: 'anotheruser'
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });
  });

  // ========================================================================
  // LOGIN TESTS
  // ========================================================================

  describe('POST /api/v1/auth/login', () => {
    it('should fail login with unverified email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(422);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should fail login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should fail login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  // ========================================================================
  // EMAIL VERIFICATION TESTS
  // ========================================================================

  describe('POST /api/v1/auth/verify-email', () => {
    it('should fail with missing token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/verify-email')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/verify-email')
        .send({ token: 'invalid-token' });

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    // Note: Testing successful verification requires extracting the actual token
    // from the email or database, which is complex in tests
  });

  // ========================================================================
  // PASSWORD RESET TESTS
  // ========================================================================

  describe('POST /api/v1/auth/forgot-password', () => {
    it('should accept password reset request', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: testUser.email });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBeDefined();
    });

    it('should not reveal if email exists', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      // Same message as for existing email
      expect(response.body.data.message).toBeDefined();
    });

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(422);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  // ========================================================================
  // TOKEN REFRESH TESTS
  // ========================================================================

  describe('POST /api/v1/auth/refresh', () => {
    it('should fail with missing token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  // ========================================================================
  // PROTECTED ENDPOINT TESTS
  // ========================================================================

  describe('GET /api/v1/auth/me', () => {
    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  // ========================================================================
  // LOGOUT TESTS
  // ========================================================================

  describe('POST /api/v1/auth/logout', () => {
    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });
  });
});
