import Joi from 'joi';

// Custom error messages
const messages = {
  'string.email': 'Invalid email format',
  'string.min': 'Must be at least {#limit} characters',
  'string.max': 'Must not exceed {#limit} characters',
  'string.pattern.base': 'Invalid format',
  'any.required': 'This field is required'
};

// Auth schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages(messages),
  username: Joi.string().alphanum().min(3).max(30).required().messages(messages),
  password: Joi.string()
    .min(12)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      ...messages,
      'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character'
    }),
  firstName: Joi.string().max(100),
  lastName: Joi.string().max(100)
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages(messages),
  password: Joi.string().required().messages(messages)
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages(messages)
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages(messages)
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages(messages),
  newPassword: Joi.string()
    .min(12)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      ...messages,
      'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character'
    })
});

// User schemas
export const updateProfileSchema = Joi.object({
  firstName: Joi.string().max(100),
  lastName: Joi.string().max(100),
  bio: Joi.string().max(500),
  location: Joi.string().max(255),
  website: Joi.string().uri().max(500),
  organization: Joi.string().max(255),
  expertiseAreas: Joi.array().items(Joi.string()),
  languages: Joi.array().items(Joi.string().length(2))
});

export const updateSettingsSchema = Joi.object({
  notificationPreferences: Joi.object({
    emailNotifications: Joi.boolean(),
    pushNotifications: Joi.boolean(),
    campaignUpdates: Joi.boolean(),
    messageNotifications: Joi.boolean()
  }),
  privacyLevel: Joi.string().valid('public', 'friends', 'private')
});

// Organization schemas
export const createOrganizationSchema = Joi.object({
  name: Joi.string().max(255).required().messages(messages),
  slug: Joi.string().pattern(/^[a-z0-9-]+$/).max(255).required().messages({
    ...messages,
    'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens'
  }),
  description: Joi.string().required().messages(messages),
  logo_url: Joi.string().uri().max(500),
  website: Joi.string().uri().max(500),
  email: Joi.string().email().max(255),
  phone: Joi.string().max(20),
  headquarters_country: Joi.string().max(100),
  headquarters_city: Joi.string().max(100),
  operating_countries: Joi.array().items(Joi.string().max(100)),
  founded_year: Joi.number().integer().min(1800).max(new Date().getFullYear()),
  organization_type: Joi.string().max(100),
  focus_areas: Joi.array().items(Joi.string()),
  twitter_handle: Joi.string().max(100),
  facebook_page: Joi.string().max(255),
  instagram_handle: Joi.string().max(100),
  primary_contact_name: Joi.string().max(255),
  primary_contact_email: Joi.string().email().max(255),
  primary_contact_phone: Joi.string().max(20)
});

export const updateOrganizationSchema = createOrganizationSchema.fork(
  ['name', 'slug', 'description'],
  schema => schema.optional()
);

// Campaign schemas
export const createCampaignSchema = Joi.object({
  title: Joi.string().max(255).required().messages(messages),
  slug: Joi.string().pattern(/^[a-z0-9-]+$/).max(255).required().messages({
    ...messages,
    'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens'
  }),
  description: Joi.string().required().messages(messages),
  long_description: Joi.string(),
  banner_image_url: Joi.string().uri().max(500),
  campaign_type: Joi.string().max(100),
  status: Joi.string().valid('active', 'paused', 'completed', 'archived'),
  priority: Joi.string().valid('critical', 'high', 'medium', 'low'),
  goal_description: Joi.string(),
  target_metric: Joi.string().max(255),
  target_value: Joi.number().integer().min(0),
  start_date: Joi.date().required().messages(messages),
  end_date: Joi.date().min(Joi.ref('start_date')),
  primary_organization_id: Joi.number().integer(),
  target_countries: Joi.array().items(Joi.string().max(100)),
  twitter_hashtag: Joi.string().max(100),
  facebook_event_url: Joi.string().uri().max(500)
});

export const updateCampaignSchema = createCampaignSchema.fork(
  ['title', 'slug', 'description', 'start_date'],
  schema => schema.optional()
);

// Intelligence schemas
export const createIntelligenceSchema = Joi.object({
  title: Joi.string().max(255).required().messages(messages),
  description: Joi.string().required().messages(messages),
  content: Joi.string(),
  reportType: Joi.string().max(100),
  severity: Joi.string().valid('critical', 'high', 'medium', 'low'),
  sourceName: Joi.string().max(255),
  sourceUrl: Joi.string().uri().max(500),
  sourceType: Joi.string().max(100),
  tags: Joi.array().items(Joi.string()),
  documentUrl: Joi.string().uri().max(500)
});

// Support request schemas
export const createSupportRequestSchema = Joi.object({
  title: Joi.string().max(255).required().messages(messages),
  description: Joi.string().required().messages(messages),
  type: Joi.string().max(100).required().messages(messages),
  priority: Joi.string().valid('critical', 'high', 'medium', 'low'),
  location: Joi.string().max(255)
});

export const offerHelpSchema = Joi.object({
  message: Joi.string().required().messages(messages),
  expertiseAreas: Joi.array().items(Joi.string()),
  availability: Joi.string().max(100)
});

// Channel schemas
export const createChannelSchema = Joi.object({
  name: Joi.string().max(255).required().messages(messages),
  description: Joi.string(),
  type: Joi.string().valid('public', 'private', 'direct'),
  encryptionType: Joi.string().valid('e2e', 'tls', 'none')
});

// Message schemas
export const sendMessageSchema = Joi.object({
  content: Joi.string().required().messages(messages),
  contentType: Joi.string().valid('text', 'file', 'image', 'link')
});

// Module schemas
export const createModuleSchema = Joi.object({
  title: Joi.string().max(255).required().messages(messages),
  description: Joi.string().required().messages(messages),
  content: Joi.string(),
  category: Joi.string().max(100),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced'),
  durationMinutes: Joi.number().integer().min(1),
  videoUrl: Joi.string().uri().max(500),
  resourceUrls: Joi.array().items(Joi.string().uri())
});

// Pagination schema
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().default('-created_at')
});

// Validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details
        }
      });
    }

    req.validatedBody = value;
    next();
  };
};

// Query validation middleware
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details
        }
      });
    }

    req.validatedQuery = value;
    next();
  };
};
