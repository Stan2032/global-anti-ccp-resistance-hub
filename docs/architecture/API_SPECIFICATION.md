# Phase 0: API Specification & Endpoint Design
**Resistance Hub Redesigned - Complete REST API Architecture**  
**Created:** December 3, 2025  
**Status:** Design Phase - Ready for Implementation

---

## Overview

This document defines all REST API endpoints for the resistance-hub-redesigned platform. The API is designed with:

- **RESTful Principles** - Standard HTTP methods and status codes
- **Versioning** - /api/v1 prefix for future compatibility
- **Authentication** - JWT-based token authentication
- **Pagination** - Consistent pagination for list endpoints
- **Error Handling** - Standardized error response format
- **Documentation** - Swagger/OpenAPI compatible

---

## API Base URL

```
Development: http://localhost:3000/api/v1
Staging: https://staging.resistancehub.org/api/v1
Production: https://resistancehub.org/api/v1
```

---

## Authentication

### JWT Token Format

All authenticated requests require an Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Token Response Format

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Example"
  },
  "message": "Operation successful",
  "timestamp": "2025-12-03T10:30:00Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2025-12-03T10:30:00Z"
}
```

### List Response with Pagination

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Item 1" },
    { "id": 2, "name": "Item 2" }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "hasMore": true
  },
  "timestamp": "2025-12-03T10:30:00Z"
}
```

---

## HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (duplicate) |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## Endpoints by Category

### 1. Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "emailVerified": false
  },
  "message": "Registration successful. Check your email for verification link."
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "username"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

#### Verify Email
```
POST /auth/verify-email
Content-Type: application/json

{
  "token": "verification_token_from_email"
}

Response: 200 OK
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### Refresh Token
```
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response: 200 OK
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

#### Forgot Password
```
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response: 200 OK
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

#### Reset Password
```
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "newSecurePassword123"
}

Response: 200 OK
{
  "success": true,
  "message": "Password reset successful"
}
```

#### Logout
```
POST /auth/logout
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 2. User Endpoints

#### Get Current User
```
GET /users/me
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://...",
    "bio": "Activist for freedom",
    "location": "Hong Kong",
    "website": "https://example.com",
    "organization": "Freedom Movement",
    "expertiseAreas": ["digital-security", "organizing"],
    "createdAt": "2025-12-01T10:00:00Z"
  }
}
```

#### Get User by ID
```
GET /users/:id
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "id": 1,
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://...",
    "bio": "Activist for freedom",
    "location": "Hong Kong",
    "organization": "Freedom Movement",
    "createdAt": "2025-12-01T10:00:00Z"
  }
}
```

#### Update User Profile
```
PUT /users/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio",
  "location": "Hong Kong",
  "website": "https://example.com",
  "organization": "Freedom Movement",
  "expertiseAreas": ["digital-security", "organizing"]
}

Response: 200 OK
{
  "success": true,
  "data": { /* updated user */ }
}
```

#### Get User Settings
```
GET /users/:id/settings
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "notificationPreferences": {
      "emailNotifications": true,
      "pushNotifications": true,
      "campaignUpdates": true
    },
    "privacyLevel": "private"
  }
}
```

#### Update User Settings
```
PUT /users/:id/settings
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "notificationPreferences": {
    "emailNotifications": true,
    "pushNotifications": false
  },
  "privacyLevel": "friends"
}

Response: 200 OK
{
  "success": true,
  "data": { /* updated settings */ }
}
```

---

### 3. Organization Endpoints

#### List Organizations
```
GET /organizations?page=1&limit=20&country=HK&type=NGO&search=freedom
Authorization: Bearer <jwt_token>

Query Parameters:
- page: Page number (default: 1)
- limit: Results per page (default: 20)
- country: Filter by country code
- type: Filter by organization type
- search: Search by name or description
- verified: Filter by verification status (true/false)

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Freedom Movement",
      "slug": "freedom-movement",
      "description": "...",
      "logo": "https://...",
      "website": "https://...",
      "email": "contact@example.com",
      "country": "HK",
      "type": "NGO",
      "focusAreas": ["human-rights", "democracy"],
      "memberCount": 1000,
      "verificationStatus": "verified",
      "trustScore": 0.95
    }
  ],
  "pagination": { /* ... */ }
}
```

#### Get Organization
```
GET /organizations/:id
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "data": { /* organization details */ }
}
```

#### Create Organization
```
POST /organizations
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Freedom Movement",
  "description": "...",
  "website": "https://...",
  "email": "contact@example.com",
  "country": "HK",
  "type": "NGO",
  "focusAreas": ["human-rights", "democracy"],
  "primaryContactName": "John Doe",
  "primaryContactEmail": "john@example.com"
}

Response: 201 Created
{
  "success": true,
  "data": { /* created organization */ }
}
```

#### Update Organization
```
PUT /organizations/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{ /* same fields as create */ }

Response: 200 OK
{
  "success": true,
  "data": { /* updated organization */ }
}
```

#### Delete Organization
```
DELETE /organizations/:id
Authorization: Bearer <jwt_token>

Response: 204 No Content
```

---

### 4. Campaign Endpoints

#### List Campaigns
```
GET /campaigns?page=1&limit=20&status=active&priority=high&search=freedom
Authorization: Bearer <jwt_token>

Query Parameters:
- page: Page number
- limit: Results per page
- status: Filter by status (active, paused, completed, archived)
- priority: Filter by priority (critical, high, medium, low)
- search: Search by title or description
- country: Filter by target country

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Free Jimmy Lai",
      "slug": "free-jimmy-lai",
      "description": "...",
      "status": "active",
      "priority": "critical",
      "targetMetric": "Petition Signatures",
      "targetValue": 100000,
      "currentValue": 45000,
      "progressPercentage": 45,
      "memberCount": 5000,
      "supporterCount": 25000,
      "startDate": "2025-01-01T00:00:00Z",
      "endDate": "2025-12-31T23:59:59Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

#### Get Campaign
```
GET /campaigns/:id
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "data": { /* campaign details */ }
}
```

#### Create Campaign
```
POST /campaigns
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Free Jimmy Lai",
  "description": "...",
  "campaignType": "Action",
  "status": "active",
  "priority": "critical",
  "goalDescription": "Secure release of Jimmy Lai",
  "targetMetric": "Petition Signatures",
  "targetValue": 100000,
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": "2025-12-31T23:59:59Z",
  "targetCountries": ["HK", "US", "UK"]
}

Response: 201 Created
{
  "success": true,
  "data": { /* created campaign */ }
}
```

#### Update Campaign
```
PUT /campaigns/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{ /* same fields as create */ }

Response: 200 OK
{
  "success": true,
  "data": { /* updated campaign */ }
}
```

#### Join Campaign
```
POST /campaigns/:id/join
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "message": "Joined campaign successfully",
  "data": {
    "campaignId": 1,
    "userId": 1,
    "role": "supporter",
    "joinedAt": "2025-12-03T10:30:00Z"
  }
}
```

#### Leave Campaign
```
DELETE /campaigns/:id/leave
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "message": "Left campaign successfully"
}
```

#### Get Campaign Members
```
GET /campaigns/:id/members?page=1&limit=20
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "userId": 1,
      "username": "username",
      "role": "organizer",
      "joinedAt": "2025-12-01T00:00:00Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

---

### 5. Intelligence Endpoints

#### List Intelligence Reports
```
GET /intelligence?page=1&limit=20&severity=critical&source=ICIJ&search=surveillance
Authorization: Bearer <jwt_token>

Query Parameters:
- page: Page number
- limit: Results per page
- severity: Filter by severity (critical, high, medium, low)
- source: Filter by source (ICIJ, ASPI, RFA, HKFP)
- type: Filter by report type
- search: Search by title or content

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "CCP Surveillance Expansion",
      "slug": "ccp-surveillance-expansion",
      "description": "...",
      "severity": "critical",
      "source": "ICIJ",
      "sourceUrl": "https://...",
      "tags": ["surveillance", "privacy"],
      "publishedDate": "2025-12-01T00:00:00Z",
      "viewCount": 5000,
      "shareCount": 1200
    }
  ],
  "pagination": { /* ... */ }
}
```

#### Get Intelligence Report
```
GET /intelligence/:id
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "data": { /* report details with full content */ }
}
```

#### Create Intelligence Report
```
POST /intelligence
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "New CCP Document Leak",
  "description": "...",
  "content": "...",
  "reportType": "Leaked Document",
  "severity": "high",
  "sourceName": "Anonymous Source",
  "sourceUrl": "https://...",
  "sourceType": "ICIJ",
  "tags": ["leaked-document", "corruption"],
  "documentUrl": "https://..."
}

Response: 201 Created
{
  "success": true,
  "data": { /* created report */ }
}
```

---

### 6. Support Request Endpoints

#### List Support Requests
```
GET /support-requests?page=1&limit=20&status=open&priority=critical&type=legal
Authorization: Bearer <jwt_token>

Query Parameters:
- page: Page number
- limit: Results per page
- status: Filter by status (open, in_progress, resolved, closed)
- priority: Filter by priority
- type: Filter by request type
- search: Search by title

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Need legal assistance",
      "description": "...",
      "type": "legal",
      "status": "open",
      "priority": "high",
      "location": "Hong Kong",
      "verified": true,
      "responseCount": 3,
      "createdAt": "2025-12-01T00:00:00Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

#### Get Support Request
```
GET /support-requests/:id
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "data": { /* request details */ }
}
```

#### Create Support Request
```
POST /support-requests
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Need legal assistance",
  "description": "...",
  "type": "legal",
  "priority": "high",
  "location": "Hong Kong"
}

Response: 201 Created
{
  "success": true,
  "data": { /* created request */ }
}
```

#### Offer Help
```
POST /support-requests/:id/offer-help
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "message": "I can help with legal advice",
  "expertiseAreas": ["legal", "human-rights"],
  "availability": "Immediate"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": 1,
    "supportRequestId": 1,
    "helperId": 1,
    "status": "pending",
    "createdAt": "2025-12-03T10:30:00Z"
  }
}
```

#### Get Help Offers
```
GET /support-requests/:id/offers
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": 1,
      "helperId": 1,
      "helperName": "John Doe",
      "message": "I can help",
      "expertiseAreas": ["legal"],
      "status": "pending",
      "createdAt": "2025-12-03T10:30:00Z"
    }
  ]
}
```

---

### 7. Channel Endpoints

#### List Channels
```
GET /channels?page=1&limit=20&type=private
Authorization: Bearer <jwt_token>

Query Parameters:
- page: Page number
- limit: Results per page
- type: Filter by channel type (public, private, direct)

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Hong Kong Activists",
      "description": "...",
      "type": "private",
      "encryptionType": "e2e",
      "memberCount": 50,
      "createdAt": "2025-12-01T00:00:00Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

#### Get Channel
```
GET /channels/:id
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "data": { /* channel details */ }
}
```

#### Create Channel
```
POST /channels
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Hong Kong Activists",
  "description": "...",
  "type": "private",
  "encryptionType": "e2e"
}

Response: 201 Created
{
  "success": true,
  "data": { /* created channel */ }
}
```

#### Join Channel
```
POST /channels/:id/join
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "message": "Joined channel successfully"
}
```

#### Get Channel Messages
```
GET /channels/:id/messages?page=1&limit=50
Authorization: Bearer <jwt_token>

Query Parameters:
- page: Page number
- limit: Results per page (max 100)

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": 1,
      "senderId": 1,
      "senderName": "John Doe",
      "content": "Encrypted message content",
      "contentType": "text",
      "encryptionKeyVersion": 1,
      "createdAt": "2025-12-03T10:30:00Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

#### Send Message
```
POST /channels/:id/messages
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "content": "Encrypted message content",
  "contentType": "text"
}

Response: 201 Created
{
  "success": true,
  "data": { /* created message */ }
}
```

---

### 8. Module Endpoints

#### List Modules
```
GET /modules?page=1&limit=20&category=security&level=beginner&search=encryption
Authorization: Bearer <jwt_token>

Query Parameters:
- page: Page number
- limit: Results per page
- category: Filter by category
- level: Filter by level (beginner, intermediate, advanced)
- search: Search by title

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Digital Security Fundamentals",
      "slug": "digital-security-fundamentals",
      "description": "...",
      "category": "security",
      "level": "beginner",
      "durationMinutes": 60,
      "enrollmentCount": 5000,
      "completionCount": 3000,
      "averageRating": 4.8
    }
  ],
  "pagination": { /* ... */ }
}
```

#### Get Module
```
GET /modules/:id
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "data": { /* module details with content */ }
}
```

#### Enroll in Module
```
POST /modules/:id/enroll
Authorization: Bearer <jwt_token>

Response: 201 Created
{
  "success": true,
  "message": "Enrolled in module successfully",
  "data": {
    "moduleId": 1,
    "userId": 1,
    "status": "in_progress",
    "enrolledAt": "2025-12-03T10:30:00Z"
  }
}
```

#### Get Enrollment Progress
```
GET /modules/:id/progress
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "moduleId": 1,
    "status": "in_progress",
    "progressPercentage": 45,
    "timeSpentMinutes": 30,
    "enrolledAt": "2025-12-01T00:00:00Z"
  }
}
```

#### Update Progress
```
PUT /modules/:id/progress
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "progressPercentage": 100,
  "quizScore": 95,
  "passed": true
}

Response: 200 OK
{
  "success": true,
  "data": { /* updated progress */ }
}
```

---

### 9. Notification Endpoints

#### Get Notifications
```
GET /users/:id/notifications?page=1&limit=20&unread=true
Authorization: Bearer <jwt_token>

Query Parameters:
- page: Page number
- limit: Results per page
- unread: Filter by read status (true/false)

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "campaign_update",
      "title": "Campaign Updated",
      "message": "...",
      "read": false,
      "createdAt": "2025-12-03T10:30:00Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

#### Mark Notification as Read
```
POST /notifications/:id/read
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "message": "Notification marked as read"
}
```

#### Delete Notification
```
DELETE /notifications/:id
Authorization: Bearer <jwt_token>

Response: 204 No Content
```

---

### 10. Statistics Endpoints

#### Get All Statistics
```
GET /statistics
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "organizations": 247,
    "campaigns": 23,
    "intelligence": 156,
    "globalReach": 89,
    "activeUsers": 5000,
    "totalMembers": 312605,
    "supportRequests": 847,
    "helpers": 2500
  }
}
```

#### Get Organization Statistics
```
GET /statistics/organizations
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "total": 247,
    "verified": 189,
    "byCountry": {
      "HK": 45,
      "US": 60,
      "UK": 35
    },
    "byType": {
      "NGO": 120,
      "Grassroots": 85,
      "Media": 42
    }
  }
}
```

#### Get Campaign Statistics
```
GET /statistics/campaigns
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "total": 23,
    "active": 18,
    "completed": 5,
    "totalMembers": 50000,
    "totalSupporters": 312605,
    "averageProgress": 62
  }
}
```

---

### 11. Search Endpoints

#### Global Search
```
GET /search?q=freedom&type=all&page=1&limit=20
Authorization: Bearer <jwt_token>

Query Parameters:
- q: Search query (required)
- type: Filter by type (all, organizations, campaigns, intelligence, users)
- page: Page number
- limit: Results per page

Response: 200 OK
{
  "success": true,
  "data": {
    "organizations": [
      { /* organization results */ }
    ],
    "campaigns": [
      { /* campaign results */ }
    ],
    "intelligence": [
      { /* intelligence results */ }
    ],
    "users": [
      { /* user results */ }
    ]
  },
  "pagination": { /* ... */ }
}
```

---

## Pagination Parameters

All list endpoints support these query parameters:

```
page: integer (default: 1) - Page number
limit: integer (default: 20, max: 100) - Results per page
sort: string (default: -created_at) - Sort field and direction
  Format: "field" or "-field" (- for descending)
```

---

## Rate Limiting

All endpoints are rate-limited:

```
- Anonymous requests: 100 requests per hour
- Authenticated requests: 1000 requests per hour
- Admin requests: Unlimited

Rate limit headers:
- X-RateLimit-Limit: 1000
- X-RateLimit-Remaining: 999
- X-RateLimit-Reset: 1638532200
```

---

## Error Codes

| Code | Message | Solution |
|------|---------|----------|
| INVALID_INPUT | Invalid input data | Check request format |
| UNAUTHORIZED | Missing or invalid token | Provide valid JWT token |
| FORBIDDEN | Insufficient permissions | Check user role |
| NOT_FOUND | Resource not found | Check resource ID |
| DUPLICATE | Resource already exists | Use different value |
| VALIDATION_ERROR | Validation failed | Check field errors |
| RATE_LIMIT | Too many requests | Wait before retrying |
| SERVER_ERROR | Internal server error | Contact support |

---

## Webhooks (Future Feature)

```
POST /webhooks/subscribe
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "url": "https://example.com/webhook",
  "events": ["campaign.created", "message.sent", "support.offered"]
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": 1,
    "url": "https://example.com/webhook",
    "events": ["campaign.created", "message.sent"],
    "active": true,
    "createdAt": "2025-12-03T10:30:00Z"
  }
}
```

---

## API Versioning

The API uses URL versioning:

- Current version: `/api/v1`
- Future versions: `/api/v2`, `/api/v3`, etc.

Old versions are maintained for 6 months after new version release.

---

## Documentation & Testing

- **Swagger UI:** `/api/docs`
- **OpenAPI Spec:** `/api/openapi.json`
- **Postman Collection:** Available at `/api/postman-collection.json`

---

## Conclusion

This API specification provides:

- ✅ Complete endpoint coverage for all features
- ✅ Consistent request/response formats
- ✅ Proper error handling
- ✅ Rate limiting and security
- ✅ Pagination and filtering
- ✅ Future-proof versioning

The API is ready for implementation in Phase 1.

---

**Status:** ✅ Design Complete - Ready for Implementation  
**Next Step:** Create security architecture document
