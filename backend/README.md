# Resistance Hub Backend API

Backend API for the Global Anti-CCP Resistance Hub platform.

## Features

- ✅ User authentication and authorization (JWT)
- ✅ PostgreSQL database with migrations
- ✅ Redis caching and sessions
- ✅ Real-time WebSocket communication (Socket.IO)
- ✅ Email notifications
- ✅ Comprehensive error handling
- ✅ Request logging and monitoring
- ✅ Rate limiting and security headers
- ✅ Input validation with Joi
- ✅ Docker support

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18+
- **Database:** PostgreSQL 14+
- **Cache:** Redis 7+
- **Real-Time:** Socket.IO 4+
- **Testing:** Jest 29+
- **Containerization:** Docker

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Docker & Docker Compose (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Stan2032/global-anti-ccp-resistance-hub.git
cd resistance-hub-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`

### Development

#### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Redis on port 6379
- Node.js API on port 3000

#### Manual Setup

1. Start PostgreSQL and Redis
2. Run migrations:
```bash
npm run migrate
```

3. Start development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### API Documentation

- **Health Check:** `GET /health`
- **API Docs:** `GET /api/docs` (Swagger UI)
- **OpenAPI Spec:** `GET /api/openapi.json`

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── server.js              # Main application entry point
├── middleware/            # Express middleware
│   ├── auth.js           # Authentication & JWT
│   ├── errorHandler.js   # Error handling
│   └── requestLogger.js  # Request logging
├── routes/               # API route handlers
│   ├── auth.js
│   ├── users.js
│   ├── organizations.js
│   ├── campaigns.js
│   ├── intelligence.js
│   ├── supportRequests.js
│   ├── channels.js
│   ├── modules.js
│   ├── notifications.js
│   ├── statistics.js
│   └── search.js
├── services/             # Business logic
│   └── emailService.js
├── db/                   # Database
│   ├── connection.js     # Database connection
│   ├── migrations/       # Database migrations
│   └── seeds/            # Database seeds
├── cache/                # Caching
│   └── redis.js          # Redis client
├── validators/           # Input validation
│   └── schemas.js        # Joi schemas
└── utils/                # Utilities
    └── logger.js         # Winston logger
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/verify-email` - Verify email
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/logout` - Logout user

### Users
- `GET /api/v1/users/me` - Get current user
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user profile
- `GET /api/v1/users/:id/settings` - Get user settings
- `PUT /api/v1/users/:id/settings` - Update user settings

### Organizations
- `GET /api/v1/organizations` - List organizations (with filters: page, limit, verification_status, organization_type, headquarters_country, search)
- `POST /api/v1/organizations` - Create organization (requires auth)
- `GET /api/v1/organizations/:id` - Get organization by ID
- `GET /api/v1/organizations/slug/:slug` - Get organization by slug
- `PUT /api/v1/organizations/:id` - Update organization (requires auth)
- `PATCH /api/v1/organizations/:id/verification` - Update verification status (requires auth)
- `DELETE /api/v1/organizations/:id` - Delete organization (requires auth)

### Campaigns
- `GET /api/v1/campaigns` - List campaigns (with filters: page, limit, status, campaign_type, priority, organization_id, search)
- `POST /api/v1/campaigns` - Create campaign (requires auth)
- `GET /api/v1/campaigns/:id` - Get campaign by ID
- `GET /api/v1/campaigns/slug/:slug` - Get campaign by slug
- `PUT /api/v1/campaigns/:id` - Update campaign (requires auth, creator only)
- `DELETE /api/v1/campaigns/:id` - Delete campaign (requires auth, creator only)
- `POST /api/v1/campaigns/:id/join` - Join campaign (requires auth)
- `POST /api/v1/campaigns/:id/leave` - Leave campaign (requires auth)
- `GET /api/v1/campaigns/:id/members` - Get campaign members (with filters: page, limit, role, status)
- `PATCH /api/v1/campaigns/:id/progress` - Update campaign progress (requires auth)

### Intelligence
- `GET /api/v1/intelligence` - List intelligence reports
- `POST /api/v1/intelligence` - Create report
- `GET /api/v1/intelligence/:id` - Get report

### Support Requests
- `GET /api/v1/support-requests` - List requests
- `POST /api/v1/support-requests` - Create request
- `POST /api/v1/support-requests/:id/offer-help` - Offer help

### Channels
- `GET /api/v1/channels` - List channels
- `POST /api/v1/channels` - Create channel
- `POST /api/v1/channels/:id/join` - Join channel
- `GET /api/v1/channels/:id/messages` - Get messages
- `POST /api/v1/channels/:id/messages` - Send message

### Modules
- `GET /api/v1/modules` - List modules
- `POST /api/v1/modules/:id/enroll` - Enroll in module
- `GET /api/v1/modules/:id/progress` - Get progress

### Notifications
- `GET /api/v1/notifications` - List notifications
- `POST /api/v1/notifications/:id/read` - Mark as read
- `DELETE /api/v1/notifications/:id` - Delete notification

### Statistics
- `GET /api/v1/statistics` - Get all statistics
- `GET /api/v1/statistics/organizations` - Organization stats
- `GET /api/v1/statistics/campaigns` - Campaign stats

### Search
- `GET /api/v1/search?q=query` - Global search

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `SMTP_*` - Email configuration

## Database

### Migrations

```bash
# Run migrations
npm run migrate

# Rollback migrations
npm run migrate:rollback

# Seed database
npm run seed
```

### Schema

See `PHASE_0_DATABASE_SCHEMA.md` for complete database design.

## Security

- JWT-based authentication
- Password hashing with bcrypt (cost 12)
- CORS protection
- Helmet.js security headers
- Rate limiting
- Input validation with Joi
- SQL injection prevention (parameterized queries)
- CSRF protection (ready)
- E2E encryption for messages (ready)

## Monitoring

- Winston logging
- Request logging middleware
- Error tracking (Sentry ready)
- Performance monitoring (New Relic ready)

## Deployment

### Docker

```bash
# Build image
docker build -t resistance-hub-api .

# Run container
docker run -p 3000:3000 --env-file .env resistance-hub-api
```

### Docker Compose

```bash
docker-compose up -d
```

### Production

See deployment documentation for production setup with Kubernetes, AWS, or DigitalOcean.

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT

## Support

For issues and questions, please create an issue on GitHub.

## Roadmap

- [ ] Phase 1: Backend Infrastructure (In Progress)
- [ ] Phase 2: Authentication & Users
- [ ] Phase 3: Real-time Notifications
- [ ] Phase 4: Data & Statistics
- [ ] Phase 5: Organizations & Campaigns
- [ ] Phase 6: Community Features
- [ ] Phase 7: Education & Security
- [ ] Phase 8: Data Integration
- [ ] Phase 9: Search & Discovery
- [ ] Phase 10: Forms & Submissions
- [ ] Phase 11: File Management
- [ ] Phase 12: Analytics
- [ ] Phase 13: Advanced Features
- [ ] Phase 14: Testing & QA
- [ ] Phase 15: Deployment & Documentation
