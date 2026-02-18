# API Documentation

Base URL: `http://localhost:3000/api/v1`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Response Format

All responses follow this structure:

**Success:**
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [ /* optional validation errors */ ]
  }
}
```

## Authentication Endpoints

### Register
`POST /auth/register`

**Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "Password123!@",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "username"
    },
    "message": "Registration successful. Please check your email to verify your account."
  }
}
```

### Login
`POST /auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!@"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "username",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

### Logout
`POST /auth/logout` (Authenticated)

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

### Refresh Token
`POST /auth/refresh`

**Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
```

### Get Current User
`GET /auth/me` (Authenticated)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["user", "admin"]
  }
}
```

## Organizations

### List Organizations
`GET /organizations`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 30, max: 100)
- `sortBy` - Sort field: name, created_at, updated_at, verification_status
- `sortOrder` - ASC or DESC (default: DESC)
- `verificationStatus` - Filter: unverified, pending, verified, rejected
- `organizationType` - Filter by type
- `country` - Filter by country code
- `search` - Search in name and description

**Response:**
```json
{
  "success": true,
  "data": {
    "organizations": [
      {
        "id": 1,
        "name": "Test Organization",
        "slug": "test-org",
        "description": "Description here",
        "website": "https://example.com",
        "verification_status": "verified",
        "organization_type": "non_profit",
        "headquarters_country": "US",
        "focus_areas": ["human_rights"]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 30,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Get Organization
`GET /organizations/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Test Organization",
    "slug": "test-org",
    "description": "Description here",
    // ... all organization fields
  }
}
```

### Search Organizations
`GET /organizations/search?q=searchterm`

**Query Parameters:**
- `q` - Search query (required)
- `page` - Page number
- `limit` - Items per page
- `verificationStatus` - Filter by status

**Response:** Same as List Organizations

### Create Organization
`POST /organizations` (Admin/Moderator only)

**Body:**
```json
{
  "name": "Organization Name",
  "slug": "org-slug",
  "description": "Description",
  "organizationType": "non_profit",
  "website": "https://example.com",
  "headquartersCountry": "US",
  "headquartersCity": "New York",
  "focusAreas": ["human_rights", "democracy"],
  "foundedYear": 2020,
  "verificationStatus": "verified"
}
```

### Update Organization
`PUT /organizations/:id` (Admin/Moderator only)

**Body:** Same fields as Create (all optional)

### Delete Organization
`DELETE /organizations/:id` (Admin only)

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Organization deleted successfully"
  }
}
```

## Campaigns

### List Campaigns
`GET /campaigns`

**Query Parameters:**
- `page`, `limit`, `sortBy`, `sortOrder` - Same as organizations
- `status` - Filter: active, paused, completed, archived
- `campaignType` - Filter by type
- `priority` - Filter: critical, high, medium, low
- `country` - Filter by target country
- `search` - Search in title and description

**Response:**
```json
{
  "success": true,
  "data": {
    "campaigns": [
      {
        "id": 1,
        "title": "Campaign Title",
        "slug": "campaign-slug",
        "description": "Description",
        "status": "active",
        "priority": "high",
        "member_count": 10,
        "creator_username": "creator",
        "organization_name": "Org Name"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

### Get Campaign
`GET /campaigns/:id`

### Get Campaign Members
`GET /campaigns/:id/members`

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": 1,
        "campaign_id": 1,
        "user_id": 1,
        "username": "username",
        "role": "organizer",
        "status": "active",
        "joined_at": "2026-02-18T00:00:00Z"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

### Create Campaign
`POST /campaigns` (Authenticated)

**Body:**
```json
{
  "title": "Campaign Title",
  "slug": "campaign-slug",
  "description": "Description",
  "campaignType": "advocacy",
  "status": "active",
  "priority": "high",
  "goalDescription": "Our goal",
  "startDate": "2026-02-18",
  "endDate": "2026-12-31",
  "primaryOrganizationId": 1,
  "targetCountries": ["US", "UK"]
}
```

### Update Campaign
`PUT /campaigns/:id` (Creator/Organizer/Admin)

**Body:** Same fields as Create (all optional)

### Delete Campaign
`DELETE /campaigns/:id` (Creator/Admin)

### Join Campaign
`POST /campaigns/:id/join` (Authenticated)

**Body:**
```json
{
  "role": "supporter"  // optional, default: supporter
}
```

### Leave Campaign
`POST /campaigns/:id/leave` (Authenticated)

## Users

### Get User Profile
`GET /users/:id` (Public profile)

### Get Own Profile
`GET /users/me/profile` (Authenticated)

### Update Own Profile
`PUT /users/me/profile` (Authenticated)

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "My bio",
  "location": "New York, USA",
  "website": "https://example.com",
  "expertiseAreas": ["activism", "tech"],
  "languages": ["en", "es"]
}
```

### Change Password
`POST /users/me/password` (Authenticated)

**Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!@"
}
```

## Admin Endpoints

All admin endpoints require admin role.

### List Users
`GET /admin/users`

**Query Parameters:**
- `page`, `limit` - Pagination
- `sort` - Sort field (default: -created_at)
- `status` - Filter: active, inactive, suspended

### Assign Role to User
`PUT /admin/users/:id/role`

**Body:**
```json
{
  "role": "admin"  // admin, moderator, organizer, helper, user, activist
}
```

### Deactivate User
`DELETE /admin/users/:id`

### Get Audit Logs
`GET /admin/audit-logs`

**Query Parameters:**
- `page`, `limit` - Pagination
- `tableName` - Filter by table
- `userId` - Filter by user
- `action` - Filter by action type

### Get Statistics
`GET /admin/statistics`

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total_users": 100,
      "active_users": 95,
      "verified_users": 80,
      "new_users_30d": 10
    },
    "organizations": {
      "total_organizations": 50,
      "verified_organizations": 40,
      "new_organizations_30d": 5
    },
    "campaigns": {
      "total_campaigns": 75,
      "active_campaigns": 60,
      "new_campaigns_30d": 8
    }
  }
}
```

## Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Missing or invalid authentication
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists (duplicate)
- `SERVER_ERROR` - Internal server error

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error
