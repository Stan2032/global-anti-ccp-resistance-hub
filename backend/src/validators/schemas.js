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
export const organizationSchema = Joi.object({
  name: Joi.string().max(255).required().messages(messages),
  description: Joi.string().allow('').optional(),
  logo_url: Joi.string().uri().max(500).allow(null, '').optional(),
  website: Joi.string().uri().max(500).allow(null, '').optional(),
  email: Joi.string().email().allow(null, '').optional(),
  phone: Joi.string().max(20).allow(null, '').optional(),
  headquarters_country: Joi.string().max(100).allow(null, '').optional(),
  headquarters_city: Joi.string().max(100).allow(null, '').optional(),
  operating_countries: Joi.array().items(Joi.string().max(100)).optional(),
  founded_year: Joi.number().integer().min(1800).max(new Date().getFullYear()).allow(null).optional(),
  organization_type: Joi.string().max(100).allow(null, '').optional(),
  focus_areas: Joi.array().items(Joi.string().max(100)).optional(),
  twitter_handle: Joi.string().max(100).allow(null, '').optional(),
  facebook_page: Joi.string().max(255).allow(null, '').optional(),
  instagram_handle: Joi.string().max(100).allow(null, '').optional(),
  primary_contact_name: Joi.string().max(255).allow(null, '').optional(),
  primary_contact_email: Joi.string().email().allow(null, '').optional(),
  primary_contact_phone: Joi.string().max(20).allow(null, '').optional()
});

export const organizationUpdateSchema = Joi.object({
  name: Joi.string().max(255).optional(),
  description: Joi.string().allow('').optional(),
  logo_url: Joi.string().uri().max(500).allow(null, '').optional(),
  website: Joi.string().uri().max(500).allow(null, '').optional(),
  email: Joi.string().email().allow(null, '').optional(),
  phone: Joi.string().max(20).allow(null, '').optional(),
  headquarters_country: Joi.string().max(100).allow(null, '').optional(),
  headquarters_city: Joi.string().max(100).allow(null, '').optional(),
  operating_countries: Joi.array().items(Joi.string().max(100)).optional(),
  founded_year: Joi.number().integer().min(1800).max(new Date().getFullYear()).allow(null).optional(),
  organization_type: Joi.string().max(100).allow(null, '').optional(),
  focus_areas: Joi.array().items(Joi.string().max(100)).optional(),
  twitter_handle: Joi.string().max(100).allow(null, '').optional(),
  facebook_page: Joi.string().max(255).allow(null, '').optional(),
  instagram_handle: Joi.string().max(100).allow(null, '').optional(),
  primary_contact_name: Joi.string().max(255).allow(null, '').optional(),
  primary_contact_email: Joi.string().email().allow(null, '').optional(),
  primary_contact_phone: Joi.string().max(20).allow(null, '').optional(),
  verification_status: Joi.string().valid('unverified', 'pending', 'verified', 'rejected').optional()
});

export const organizationSuggestionSchema = Joi.object({
  proposed_changes: Joi.object().required().messages(messages),
  reason: Joi.string().max(1000).allow('').optional()
});

export const createOrganizationSchema = Joi.object({
  name: Joi.string().max(255).required().messages(messages),
  description: Joi.string().required().messages(messages),
  website: Joi.string().uri().max(500),
  email: Joi.string().email(),
  country: Joi.string().length(2),
  type: Joi.string().max(100),
  focusAreas: Joi.array().items(Joi.string()),
  primaryContactName: Joi.string().max(255),
  primaryContactEmail: Joi.string().email(),
  primaryContactPhone: Joi.string().max(20)
});

export const updateOrganizationSchema = createOrganizationSchema.fork(
  ['name', 'description'],
  schema => schema.optional()
);

// Campaign schemas
export const campaignSchema = Joi.object({
  title: Joi.string().max(255).required().messages(messages),
  description: Joi.string().required().messages(messages),
  long_description: Joi.string().allow('').optional(),
  banner_image_url: Joi.string().uri().max(500).allow(null, '').optional(),
  campaign_type: Joi.string().max(100).allow(null, '').optional(),
  status: Joi.string().valid('active', 'paused', 'completed', 'archived').optional(),
  priority: Joi.string().valid('critical', 'high', 'medium', 'low').optional(),
  goal_description: Joi.string().allow('').optional(),
  target_metric: Joi.string().max(255).allow(null, '').optional(),
  target_value: Joi.number().integer().min(0).allow(null).optional(),
  start_date: Joi.date().required().messages(messages),
  end_date: Joi.date().min(Joi.ref('start_date')).allow(null).optional(),
  primary_organization_id: Joi.number().integer().allow(null).optional(),
  target_countries: Joi.array().items(Joi.string().max(100)).optional(),
  twitter_hashtag: Joi.string().max(100).allow(null, '').optional(),
  facebook_event_url: Joi.string().uri().max(500).allow(null, '').optional()
});

export const campaignUpdateSchema = Joi.object({
  title: Joi.string().max(255).optional(),
  description: Joi.string().optional(),
  long_description: Joi.string().allow('').optional(),
  banner_image_url: Joi.string().uri().max(500).allow(null, '').optional(),
  campaign_type: Joi.string().max(100).allow(null, '').optional(),
  status: Joi.string().valid('active', 'paused', 'completed', 'archived').optional(),
  priority: Joi.string().valid('critical', 'high', 'medium', 'low').optional(),
  goal_description: Joi.string().allow('').optional(),
  target_metric: Joi.string().max(255).allow(null, '').optional(),
  target_value: Joi.number().integer().min(0).allow(null).optional(),
  current_value: Joi.number().integer().min(0).allow(null).optional(),
  start_date: Joi.date().optional(),
  end_date: Joi.date().allow(null).optional(),
  primary_organization_id: Joi.number().integer().allow(null).optional(),
  target_countries: Joi.array().items(Joi.string().max(100)).optional(),
  twitter_hashtag: Joi.string().max(100).allow(null, '').optional(),
  facebook_event_url: Joi.string().uri().max(500).allow(null, '').optional()
});

export const createCampaignSchema = Joi.object({
  title: Joi.string().max(255).required().messages(messages),
  description: Joi.string().required().messages(messages),
  campaignType: Joi.string().max(100),
  status: Joi.string().valid('active', 'paused', 'completed', 'archived'),
  priority: Joi.string().valid('critical', 'high', 'medium', 'low'),
  goalDescription: Joi.string(),
  targetMetric: Joi.string().max(255),
  targetValue: Joi.number().integer().min(0),
  startDate: Joi.date().required().messages(messages),
  endDate: Joi.date().min(Joi.ref('startDate')),
  targetCountries: Joi.array().items(Joi.string().length(2))
});

export const updateCampaignSchema = createCampaignSchema.fork(
  ['title', 'description', 'startDate'],
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
