import logger from '../utils/logger.js';
import { ValidationError } from './errorHandler.js';

/**
 * Validation middleware factory
 * Creates middleware that validates request body against a Joi schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');

      logger.warn('Validation failed', {
        path: req.path,
        errors: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message
        }))
      });

      return next(new ValidationError(errorMessage, error.details));
    }

    // Attach validated data to request
    req.validatedBody = value;
    next();
  };
};

/**
 * Validates query parameters against a Joi schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');

      logger.warn('Query validation failed', {
        path: req.path,
        errors: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message
        }))
      });

      return next(new ValidationError(errorMessage, error.details));
    }

    req.validatedQuery = value;
    next();
  };
};

/**
 * Validates route parameters against a Joi schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');

      logger.warn('Params validation failed', {
        path: req.path,
        errors: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message
        }))
      });

      return next(new ValidationError(errorMessage, error.details));
    }

    req.validatedParams = value;
    next();
  };
};
