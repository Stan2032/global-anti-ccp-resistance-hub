# Resistance Hub Backend API

Backend API for the Global Anti-CCP Resistance Hub platform.

> **Status:** NOT YET DEPLOYED. The frontend currently uses Supabase for form submissions.
> See `SUPABASE_SETUP.md` and `BACKEND_GUIDE.md` in the project root for current integration details.

## Features

- ✅ User authentication and authorization (JWT)
- ✅ PostgreSQL database with migrations
- ✅ Email notifications
- ✅ Comprehensive error handling
- ✅ Request logging and monitoring
- ✅ Rate limiting and security headers
- ✅ Input validation with Joi
- ✅ RSS feed polling and aggregation

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18+
- **Database:** PostgreSQL 14+
- **Testing:** Jest 29+

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or use in-memory mock for development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Stan2032/global-anti-ccp-resistance-hub.git
cd global-anti-ccp-resistance-hub/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (see Environment Variables below)

### Development

#### Quick Start (In-Memory Mock Database)

```bash
cd backend
npm install
npm start
```

No PostgreSQL required — automatically uses in-memory mock database in development mode.

#### With PostgreSQL

1. Start PostgreSQL
2. Run migrations:
```bash
npm run setup-db
```

3. Start development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### API Documentation

- **Health Check:** `GET /health`

### Testing

```bash
# Run all tests (requires PostgreSQL)
npm test
```

## Project Structure

```
backend/src/
├── server.js              # Main application entry point
├── middleware/             # Express middleware
│   ├── auth.js            # Authentication & JWT
│   ├── errorHandler.js    # Error handling
│   └── requestLogger.js   # Request logging
├── routes/                # API route handlers
│   ├── auth.js            # Authentication (register, login, refresh, verify, reset)
│   ├── users.js           # User profiles and management
│   ├── organizations.js   # Organization CRUD with verification
│   ├── campaigns.js       # Campaign management
│   ├── intelligence.js    # CCP data, prisoners, officials, threats
│   └── feeds.js           # RSS feed aggregation
├── services/              # Business logic
│   ├── authService.js     # Authentication logic
│   ├── userService.js     # User management
│   ├── campaignService.js # Campaign logic
│   ├── organizationService.js # Organization logic
│   ├── feedService.js     # RSS feed parsing
│   ├── feedScheduler.js   # Scheduled feed polling
│   ├── emailService.js    # Email sending
│   └── cacheService.js    # In-memory LRU cache
├── data/                  # Static data
│   ├── ccpViolationsData.js  # Human rights violation data
│   └── regionalThreats.js    # Regional threat assessments
├── db/                    # Database
│   ├── connection.js      # PostgreSQL connection pool
│   ├── database.js        # Query wrapper (mock in dev)
│   └── runMigrations.js   # Migration runner
├── validators/            # Input validation (Joi schemas)
└── utils/                 # Utilities (Winston logger)
```

## Active API Endpoints

### Authentication (✅ Implemented)
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/verify-email` - Verify email
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user

### Users (✅ Implemented)
- `GET /api/v1/users/profile` - Get own profile
- `PUT /api/v1/users/profile` - Update own profile
- `PUT /api/v1/users/settings` - Update user settings
- `GET /api/v1/users/:id` - Get user by ID (admin/moderator)
- `GET /api/v1/users/username/:username` - Get public profile
- `GET /api/v1/users` - List users (admin/moderator)
- `DELETE /api/v1/users/:id` - Delete user (admin)

### Organizations (✅ Implemented)
- `GET /api/v1/organizations` - List with filters
- `GET /api/v1/organizations/search` - Search
- `GET /api/v1/organizations/:id` - Get by ID or slug
- `POST /api/v1/organizations` - Create (authenticated)
- `PUT /api/v1/organizations/:id` - Update (admin)
- `DELETE /api/v1/organizations/:id` - Delete (admin)
- `POST /api/v1/organizations/:id/verify` - Verify (admin)

### Campaigns (✅ Implemented)
- `GET /api/v1/campaigns` - List with filters
- `GET /api/v1/campaigns/:id` - Get by ID or slug
- `GET /api/v1/campaigns/:id/members` - Get members
- `POST /api/v1/campaigns` - Create (authenticated)
- `PUT /api/v1/campaigns/:id` - Update (creator/admin)
- `DELETE /api/v1/campaigns/:id` - Delete (creator/admin)
- `POST /api/v1/campaigns/:id/join` - Join (authenticated)
- `POST /api/v1/campaigns/:id/leave` - Leave (authenticated)
- `POST /api/v1/campaigns/:id/progress` - Update progress

### Intelligence (✅ Implemented — static data)
- `GET /api/v1/intelligence/sources` - Intelligence sources
- `GET /api/v1/intelligence/databases` - Research databases
- `GET /api/v1/intelligence/tactics` - CCP tactics
- `GET /api/v1/intelligence/prisoners` - Political prisoners
- `GET /api/v1/intelligence/prisoners/:name` - Specific prisoner
- `GET /api/v1/intelligence/officials` - Sanctioned officials
- `GET /api/v1/intelligence/threats/*` - Regional threats
- `POST /api/v1/intelligence/analyze` - Text analysis

### Feeds (✅ Implemented)
- `GET /api/v1/feeds` - List feed items with filters
- `GET /api/v1/feeds/sources` - List feed sources
- `GET /api/v1/feeds/stats` - Feed statistics
- `GET /api/v1/feeds/:id` - Get single feed item
- `POST /api/v1/feeds/:id/share` - Track share event
- `POST /api/v1/feeds/poll` - Trigger immediate poll (admin)

## Environment Variables

Key variables:
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - JWT refresh token secret
- `SMTP_*` - Email configuration (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD)
- `CORS_ORIGIN` - Allowed CORS origin (default: http://localhost:5173)
- `FEED_POLL_INTERVAL_MINUTES` - RSS feed poll interval (default: 15)

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
- Rate limiting (100 req/15min general, 5 req/15min login)
- Input validation with Joi
- SQL injection prevention (parameterized queries)

## Related Documentation

- `SUPABASE_SETUP.md` — Current form submission backend (Supabase)
- `BACKEND_GUIDE.md` — Integration guide and key generation
- `CLOUDFLARE_DEPLOY.md` — Frontend deployment to Cloudflare Workers
