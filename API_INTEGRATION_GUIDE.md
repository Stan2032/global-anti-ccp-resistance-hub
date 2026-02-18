# API Integration Guide

## Overview

This guide explains how to integrate the backend REST API with the frontend React application. The API provides full CRUD operations for organizations, campaigns, and other core features.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   React      │  │   Custom     │  │  API Client  │     │
│  │  Components  │─▶│    Hooks     │─▶│  (apiClient) │─┐   │
│  └──────────────┘  └──────────────┘  └──────────────┘ │   │
└────────────────────────────────────────────────────────┼───┘
                                                         │
                                    HTTP/HTTPS (REST)   │
                                                         │
┌────────────────────────────────────────────────────────┼───┐
│                         Backend                        │   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │   Express    │  │   Services   │  │  Database    │ │   │
│  │   Routes     │─▶│  (Business)  │─▶│ (PostgreSQL) │◀┘   │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Environment Setup

**Backend (.env):**
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/resistance_hub
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env):**
```bash
VITE_API_URL=http://localhost:3000
```

### 2. Start the Backend

```bash
cd backend
npm install
npm run dev
```

Backend will be available at `http://localhost:3000`

### 3. Use the API Client in Frontend

```javascript
import apiClient from './services/apiClient';
import { useOrganizations, useCampaigns } from './hooks/useAPI';

// In your React component
function MyComponent() {
  const { organizations, loading, error } = useOrganizations();
  
  // ... render your UI
}
```

## API Client Usage

### Organizations API

```javascript
import { organizationsAPI } from './services/apiClient';

// List organizations with filters
const response = await organizationsAPI.list({
  page: 1,
  limit: 20,
  verification_status: 'verified',
  search: 'human rights'
});

// Get single organization
const org = await organizationsAPI.getById(123);
const org = await organizationsAPI.getBySlug('amnesty-international');

// Create organization (requires authentication)
const newOrg = await organizationsAPI.create({
  name: 'New Organization',
  slug: 'new-org',
  description: 'Fighting for freedom',
  // ... other fields
});

// Update organization
await organizationsAPI.update(123, {
  description: 'Updated description'
});

// Delete organization
await organizationsAPI.delete(123);

// Update verification status
await organizationsAPI.updateVerification(123, 'verified');
```

### Campaigns API

```javascript
import { campaignsAPI } from './services/apiClient';

// List campaigns with filters
const response = await campaignsAPI.list({
  page: 1,
  limit: 20,
  status: 'active',
  priority: 'high',
  search: 'free prisoners'
});

// Get single campaign
const campaign = await campaignsAPI.getById(456);
const campaign = await campaignsAPI.getBySlug('free-jimmy-lai');

// Create campaign (requires authentication)
const newCampaign = await campaignsAPI.create({
  title: 'Free Political Prisoners',
  slug: 'free-prisoners',
  description: 'Campaign description',
  start_date: '2024-01-01',
  // ... other fields
});

// Update campaign
await campaignsAPI.update(456, {
  status: 'completed',
  progress_percentage: 100
});

// Join campaign (requires authentication)
await campaignsAPI.join(456, 'supporter');

// Leave campaign
await campaignsAPI.leave(456);

// Get campaign members
const members = await campaignsAPI.getMembers(456, {
  page: 1,
  role: 'supporter'
});

// Update campaign progress
await campaignsAPI.updateProgress(456, 75);

// Delete campaign
await campaignsAPI.delete(456);
```

### Authentication

```javascript
import { authAPI } from './services/apiClient';

// Register new user
await authAPI.register({
  email: 'user@example.com',
  username: 'user123',
  password: 'SecurePass123!@#',
  firstName: 'John',
  lastName: 'Doe'
});

// Login (stores token in localStorage automatically)
await authAPI.login('user@example.com', 'SecurePass123!@#');

// Logout (clears token)
await authAPI.logout();

// Verify email
await authAPI.verifyEmail('verification-token');

// Password reset
await authAPI.forgotPassword('user@example.com');
await authAPI.resetPassword('reset-token', 'NewPass123!@#');
```

## React Hooks

### useOrganizations

Fetch and manage organizations list with automatic loading states.

```javascript
import { useOrganizations } from './hooks/useAPI';

function OrganizationsList() {
  const { 
    organizations, 
    pagination, 
    loading, 
    error, 
    refresh 
  } = useOrganizations({
    page: 1,
    limit: 20,
    verification_status: 'verified'
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {organizations.map(org => (
        <OrganizationCard key={org.id} organization={org} />
      ))}
      <Pagination {...pagination} />
    </div>
  );
}
```

### useOrganization

Fetch single organization by ID.

```javascript
import { useOrganization } from './hooks/useAPI';

function OrganizationDetail({ id }) {
  const { organization, loading, error, refresh } = useOrganization(id);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return <OrganizationDetails org={organization} />;
}
```

### useCampaigns

Fetch and manage campaigns list.

```javascript
import { useCampaigns } from './hooks/useAPI';

function CampaignsList() {
  const { 
    campaigns, 
    pagination, 
    loading, 
    error, 
    refresh 
  } = useCampaigns({
    status: 'active',
    priority: 'high'
  });

  // ... render campaigns
}
```

### useMutation

Generic hook for create/update/delete operations.

```javascript
import { useMutation } from './hooks/useAPI';
import apiClient from './services/apiClient';

function CreateOrganizationForm() {
  const createOrg = useMutation(apiClient.organizations.create);

  const handleSubmit = async (formData) => {
    try {
      const response = await createOrg.mutate(formData);
      console.log('Created:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      {createOrg.loading && <p>Creating...</p>}
      {createOrg.error && <p>Error: {createOrg.error}</p>}
    </form>
  );
}
```

### useAuth

Authentication state management.

```javascript
import { useAuth } from './hooks/useAPI';

function App() {
  const { 
    user, 
    loading, 
    error, 
    login, 
    register, 
    logout, 
    isAuthenticated 
  } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // User is now logged in
    } catch (error) {
      // Handle error
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {isAuthenticated ? (
        <Dashboard user={user} onLogout={logout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}
```

## Error Handling

All API calls return a consistent error structure:

```javascript
{
  success: false,
  error: {
    code: 'ERROR_CODE',
    message: 'Human-readable error message'
  }
}
```

Common error codes:
- `UNAUTHORIZED` (401) - Missing or invalid authentication token
- `FORBIDDEN` (403) - User doesn't have permission
- `NOT_FOUND` (404) - Resource not found
- `CONFLICT` (409) - Duplicate resource (e.g., slug already exists)
- `VALIDATION_ERROR` (422) - Invalid input data
- `SERVER_ERROR` (500) - Internal server error

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token is stored in `localStorage`
4. All authenticated requests include `Authorization: Bearer <token>` header
5. Token is automatically added by the API client

## Pagination

All list endpoints support pagination:

```javascript
{
  data: {
    organizations: [...],
    pagination: {
      total: 150,      // Total number of items
      page: 1,         // Current page
      limit: 20,       // Items per page
      totalPages: 8    // Total number of pages
    }
  }
}
```

## Filtering

### Organizations Filters

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `verification_status` - Filter by verification status ('unverified', 'pending', 'verified', 'rejected')
- `organization_type` - Filter by organization type
- `headquarters_country` - Filter by country
- `search` - Search in name and description

### Campaigns Filters

- `page` - Page number
- `limit` - Items per page
- `status` - Filter by status ('active', 'paused', 'completed', 'archived')
- `campaign_type` - Filter by type
- `priority` - Filter by priority ('critical', 'high', 'medium', 'low')
- `organization_id` - Filter by organization
- `search` - Search in title and description

## Best Practices

### 1. Use Hooks for Data Fetching

```javascript
// ✅ Good - Uses hook with automatic loading/error states
const { organizations, loading, error } = useOrganizations();

// ❌ Avoid - Manual API calls in components
useEffect(() => {
  apiClient.organizations.list().then(setOrganizations);
}, []);
```

### 2. Handle Loading and Error States

```javascript
// ✅ Good - Shows feedback to user
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;

// ❌ Avoid - No feedback
return <OrganizationsList data={organizations} />;
```

### 3. Use useMutation for Write Operations

```javascript
// ✅ Good - Tracks mutation state
const createOrg = useMutation(apiClient.organizations.create);
await createOrg.mutate(data);

// ❌ Avoid - Direct API calls lose state tracking
await apiClient.organizations.create(data);
```

### 4. Refresh Data After Mutations

```javascript
const { organizations, refresh } = useOrganizations();
const deleteOrg = useMutation(apiClient.organizations.delete);

const handleDelete = async (id) => {
  await deleteOrg.mutate(id);
  refresh(); // Refresh the list
};
```

### 5. Check Authentication Before Protected Actions

```javascript
const { isAuthenticated } = useAuth();

return (
  <div>
    {isAuthenticated ? (
      <button onClick={handleJoinCampaign}>Join Campaign</button>
    ) : (
      <Link to="/login">Login to Join</Link>
    )}
  </div>
);
```

## Testing

The backend includes comprehensive test suites:

```bash
cd backend

# Run all tests
npm test

# Run specific test suite
npm test -- organizations.test.js
npm test -- campaigns.test.js

# Run tests in watch mode
npm run test:watch
```

## Next Steps

1. Complete user management API endpoints
2. Implement notifications API with WebSocket integration
3. Build statistics and dashboard APIs
4. Add search functionality
5. Implement file upload for avatars and images
6. Add analytics and reporting

## Support

For issues or questions:
- Backend API: See `backend/README.md`
- Frontend Integration: Check component examples in `src/components/`
- Report bugs: Create an issue on GitHub

## License

MIT
