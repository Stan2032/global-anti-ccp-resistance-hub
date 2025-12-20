import express from 'express';
import { validate, registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/schemas.js';
import { authenticateToken } from '../middleware/auth.js';
import * as authService from '../services/authService.js';
import logger from '../utils/logger.js';

const router = express.Router();

// ============================================================================
// REGISTER
// ============================================================================
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { email, username, password, firstName, lastName } = req.validatedBody;
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');

    const result = await authService.register(
      { email, username, password, firstName, lastName },
      ipAddress,
      userAgent
    );

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// VERIFY EMAIL
// ============================================================================
router.post('/verify-email', async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Verification token is required'
        }
      });
    }

    const result = await authService.verifyEmail(token);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// LOGIN
// ============================================================================
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.validatedBody;
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');

    const result = await authService.login(email, password, ipAddress, userAgent);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// REFRESH TOKEN
// ============================================================================
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Refresh token is required'
        }
      });
    }

    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');

    const result = await authService.refreshAccessToken(refreshToken, ipAddress, userAgent);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// FORGOT PASSWORD
// ============================================================================
router.post('/forgot-password', validate(forgotPasswordSchema), async (req, res, next) => {
  try {
    const { email } = req.validatedBody;

    const result = await authService.requestPasswordReset(email);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// RESET PASSWORD
// ============================================================================
router.post('/reset-password', validate(resetPasswordSchema), async (req, res, next) => {
  try {
    const { token, newPassword } = req.validatedBody;

    const result = await authService.resetPassword(token, newPassword);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// LOGOUT
// ============================================================================
router.post('/logout', authenticateToken, async (req, res, next) => {
  try {
    const result = await authService.logout(req.headers.authorization.split(' ')[1]);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// GET CURRENT USER
// ============================================================================
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const { getUserById } = await import('../services/userService.js');
    const user = await getUserById(req.user.id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

export default router;
