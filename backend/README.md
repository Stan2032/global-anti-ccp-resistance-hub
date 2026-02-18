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

### Authentication (✅ Fully Implemented)
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/verify-email` - Verify email
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user

### Users (✅ Fully Implemented)
- `GET /api/v1/users/profile` - Get own profile
- `PUT /api/v1/users/profile` - Update own profile
- `PUT /api/v1/users/settings` - Update user settings
- `GET /api/v1/users/:id` - Get user by ID (admin/moderator only)
- `GET /api/v1/users/username/:username` - Get public profile by username
- `GET /api/v1/users` - List users (admin/moderator only)
- `DELETE /api/v1/users/:id` - Delete user (admin only)

### Organizations (✅ Fully Implemented)
- `GET /api/v1/organizations` - List organizations with filters (search, verification status, type, country, focus area)
- `GET /api/v1/organizations/search` - Search organizations
- `GET /api/v1/organizations/:id` - Get organization by ID or slug
- `POST /api/v1/organizations` - Create organization (authenticated)
- `PUT /api/v1/organizations/:id` - Update organization (admin only)
- `DELETE /api/v1/organizations/:id` - Delete organization (admin only)
- `POST /api/v1/organizations/:id/verify` - Verify organization (admin only)

### Campaigns (✅ Fully Implemented)
- `GET /api/v1/campaigns` - List campaigns with filters (search, status, type, priority, country, organization)
- `GET /api/v1/campaigns/:id` - Get campaign by ID or slug
- `GET /api/v1/campaigns/:id/members` - Get campaign members
- `POST /api/v1/campaigns` - Create campaign (authenticated)
- `PUT /api/v1/campaigns/:id` - Update campaign (creator or admin)
- `DELETE /api/v1/campaigns/:id` - Delete campaign (creator or admin)
- `POST /api/v1/campaigns/:id/join` - Join campaign (authenticated)
- `POST /api/v1/campaigns/:id/leave` - Leave campaign (authenticated)
- `POST /api/v1/campaigns/:id/progress` - Update campaign progress (creator or admin)

### Intelligence (✅ Partially Implemented - Mock Data)
- `GET /api/v1/intelligence/sources` - List intelligence sources
- `GET /api/v1/intelligence/databases` - Research databases
- `GET /api/v1/intelligence/tactics` - CCP tactics documentation
- `GET /api/v1/intelligence/prisoners` - Political prisoners list
- `GET /api/v1/intelligence/prisoners/:name` - Specific prisoner details
- `GET /api/v1/intelligence/officials` - Sanctioned CCP officials
- `GET /api/v1/intelligence/threats/*` - Regional threat assessments
- `POST /api/v1/intelligence/analyze` - Analyze text for CCP relevance

### Feeds (✅ Fully Implemented)
- `GET /api/v1/feeds` - List feed items with filters
- `GET /api/v1/feeds/sources` - List feed sources
- `GET /api/v1/feeds/stats` - Feed statistics
- `GET /api/v1/feeds/:id` - Get single feed item
- `POST /api/v1/feeds/:id/share` - Track share event
- `POST /api/v1/feeds/poll` - Trigger immediate poll (admin)

### Support Requests (⏳ Stub Only)
- Endpoints defined but not yet implemented

### Channels (⏳ Stub Only)
- Endpoints defined but not yet implemented

### Modules (⏳ Stub Only)
- Endpoints defined but not yet implemented

### Notifications (⏳ Stub Only)
- Endpoints defined but not yet implemented

### Statistics (⏳ Stub Only)
- Endpoints defined but not yet implemented

### Search (⏳ Stub Only)
- Endpoints defined but not yet implemented

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

### Development Mode (In-Memory Mock Database)

For development and testing without PostgreSQL, the backend automatically uses an in-memory mock database when:
- `DATABASE_URL` starts with `sqlite://`, or
- `NODE_ENV` is not set to `production`

This allows you to run the backend without setting up PostgreSQL:

```bash
cd backend
npm install
npm start
```

The mock database includes:
- All table structures
- Pre-seeded feed sources (ICIJ, Radio Free Asia, Hong Kong Free Press, ASPI)
- Basic CRUD operations support
- Support for authentication and feed operations

**Note:** Data is lost when the server restarts in mock mode.

### Production Mode (PostgreSQL)

For production with PostgreSQL:

1. Set up PostgreSQL database:
```bash
createdb resistance_hub
```

2. Update `.env` with PostgreSQL connection:
```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@localhost:5432/resistance_hub
```

3. Run migrations:
```bash
npm run setup-db
```

This will:
- Create all tables
- Set up indexes
- Insert default roles
- Seed initial feed sources

### Migrations

```bash
# Run all migrations
npm run setup-db

# Or manually run migrations
node scripts/setup-db.js
```

### Schema

Complete database schema includes:
- **Users & Auth**: users, roles, user_roles, auth_tokens
- **Organizations**: organizations with verification workflow
- **Campaigns**: campaigns, campaign_members with progress tracking
- **Intelligence**: intelligence_reports, feed_sources, feed_items
- **Community**: support_requests, help_offers, channels, channel_members, messages
- **Education**: modules, module_enrollments
- **System**: notifications, audit_logs, analytics_events, files

See migration files in `src/db/migrations/` for complete schema.

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
