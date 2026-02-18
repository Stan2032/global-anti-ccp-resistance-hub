# Phase 1 Implementation Complete - Backend Infrastructure Setup Guide

## Overview

Phase 1 of the Global Anti-CCP Resistance Hub backend infrastructure is now complete. This document provides instructions for setting up and running the backend server.

## What Was Implemented

### Core Features
✅ Express.js server with comprehensive middleware  
✅ PostgreSQL database with full schema  
✅ JWT authentication system  
✅ Organization CRUD with suggestion workflow  
✅ Campaign management with member tracking  
✅ User profile management  
✅ Security measures (bcrypt, rate limiting, input validation)  
✅ Audit logging for all data changes  
✅ Testing infrastructure with Jest  
✅ Docker Compose setup  

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or Docker)
- npm or pnpm

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://resistance_user:your_password@localhost:5432/resistance_hub
JWT_SECRET=your-super-secret-key-change-this
CORS_ORIGIN=http://localhost:5173
```

### 3. Start PostgreSQL

#### Option A: Using Docker (Recommended)

```bash
docker-compose up -d db
```

This starts PostgreSQL on port 5432 with default credentials.

#### Option B: Local PostgreSQL

Create the database manually:

```sql
CREATE DATABASE resistance_hub;
CREATE USER resistance_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE resistance_hub TO resistance_user;
```

### 4. Run Migrations

```bash
node src/db/runMigrations.js
```

This will:
- Create all database tables
- Set up indexes
- Insert default roles (user, moderator, admin, etc.)
- Seed initial feed sources

### 5. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

## Testing the API

### Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-18T...",
  "uptime": 123.456
}
```

### Register a User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPassword123!@#",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!@#"
  }'
```

Save the `accessToken` from the response.

### Create Organization (Admin Only)

First, make a user an admin:

```sql
-- Connect to database
psql -U resistance_user -d resistance_hub

-- Make user an admin
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.email = 'test@example.com' AND r.name = 'admin';
```

Then create an organization:

```bash
curl -X POST http://localhost:3000/api/v1/organizations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Test Resistance Organization",
    "description": "A test organization for democracy",
    "website": "https://test-org.example.com",
    "organization_type": "Advocacy",
    "headquarters_country": "United States",
    "focus_areas": ["human_rights", "democracy"]
  }'
```

### List Organizations

```bash
curl http://localhost:3000/api/v1/organizations
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm run test:auth
npm run test -- src/tests/organizations.test.js

# Run tests in watch mode
npm run test:watch
```

## Database Management

### View Tables

```bash
# Connect to database
docker-compose exec db psql -U resistancehub -d resistancehub

# List tables
\dt

# View roles
SELECT * FROM roles;

# View users
SELECT id, email, username, status FROM users;
```

### Reset Database

```bash
# Stop containers
docker-compose down -v

# Start fresh
docker-compose up -d db

# Run migrations
node src/db/runMigrations.js
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout

### Organizations
- `GET /api/v1/organizations` - List organizations
- `GET /api/v1/organizations/search?q=...` - Search
- `GET /api/v1/organizations/:id` - Get single organization
- `POST /api/v1/organizations` - Create (admin only)
- `PUT /api/v1/organizations/:id` - Update (admin only)
- `DELETE /api/v1/organizations/:id` - Delete (admin only)
- `POST /api/v1/organizations/:id/suggest-edit` - Suggest edit (authenticated)
- `POST /api/v1/organizations/suggest-new` - Suggest new organization
- `GET /api/v1/organizations/admin/pending-reviews` - Get pending suggestions (moderator)
- `POST /api/v1/organizations/admin/review/:id` - Review suggestion (moderator)

### Campaigns
- `GET /api/v1/campaigns` - List campaigns
- `GET /api/v1/campaigns/:id` - Get single campaign
- `GET /api/v1/campaigns/:id/members` - Get campaign members
- `POST /api/v1/campaigns` - Create campaign
- `PUT /api/v1/campaigns/:id` - Update campaign (creator/admin)
- `DELETE /api/v1/campaigns/:id` - Delete campaign (creator/admin)
- `POST /api/v1/campaigns/:id/join` - Join campaign
- `POST /api/v1/campaigns/:id/leave` - Leave campaign

### Users
- `GET /api/v1/users/:id` - Get public profile
- `GET /api/v1/users/me/profile` - Get own full profile
- `PUT /api/v1/users/me` - Update own profile
- `PUT /api/v1/users/me/settings` - Update settings
- `POST /api/v1/users/me/password` - Change password
- `DELETE /api/v1/users/me` - Delete account
- `GET /api/v1/users` - List users (admin only)

## Security Features

✅ **Password Security**
- bcrypt hashing with 12 rounds
- Minimum 12 characters
- Must contain uppercase, lowercase, number, and special character

✅ **Rate Limiting**
- General: 100 requests per 15 minutes per IP
- Login: 5 attempts per 15 minutes per IP

✅ **Token Security**
- Access tokens expire in 1 hour
- Refresh tokens expire in 7 days
- Tokens include user ID and roles

✅ **Input Validation**
- All inputs validated with Joi schemas
- SQL injection prevention via parameterized queries
- XSS protection via input sanitization

✅ **Audit Logging**
- All data modifications tracked
- Stores old and new values
- Includes user ID and timestamp

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)
```

### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker-compose ps

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Migration Errors

```bash
# Drop all tables and recreate
docker-compose down -v
docker-compose up -d db
node src/db/runMigrations.js
```

### Tests Failing

```bash
# Make sure dependencies are installed
npm install

# Check Jest configuration
cat jest.config.js

# Run with verbose output
npm test -- --verbose
```

## Next Steps

1. **Add More Tests**: Create tests for campaign and user endpoints
2. **Connect Frontend**: Update frontend to use real API instead of static data
3. **Deploy**: Set up CI/CD and deploy to production
4. **Add Features**: Email verification, 2FA, file uploads

## Production Deployment Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random value (32+ characters)
- [ ] Set NODE_ENV=production
- [ ] Use strong database password
- [ ] Enable HTTPS
- [ ] Set proper CORS_ORIGIN to your domain
- [ ] Configure rate limiting appropriately
- [ ] Set up database backups
- [ ] Enable database SSL
- [ ] Configure proper logging
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Review all environment variables

## Support

For issues or questions:
- Check the backend README: `backend/README.md`
- Review the .env.example for configuration options
- Run tests to verify setup: `npm test`

---

**Phase 1 Implementation Complete** ✅  
Backend infrastructure is ready for integration with the frontend.
