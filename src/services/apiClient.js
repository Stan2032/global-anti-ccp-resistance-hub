/**
 * API Client
 * Communicates with the backend REST API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Get authorization header
 */
function getAuthHeader() {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/**
 * Make an API request
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// ============================================================================
// ORGANIZATIONS API
// ============================================================================

export const organizationsAPI = {
  /**
   * List organizations with filters
   */
  list: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.verification_status) queryParams.append('verification_status', filters.verification_status);
    if (filters.organization_type) queryParams.append('organization_type', filters.organization_type);
    if (filters.headquarters_country) queryParams.append('headquarters_country', filters.headquarters_country);
    if (filters.search) queryParams.append('search', filters.search);

    const query = queryParams.toString();
    const endpoint = `/api/v1/organizations${query ? `?${query}` : ''}`;
    
    return apiRequest(endpoint);
  },

  /**
   * Get organization by ID
   */
  getById: async (id) => {
    return apiRequest(`/api/v1/organizations/${id}`);
  },

  /**
   * Get organization by slug
   */
  getBySlug: async (slug) => {
    return apiRequest(`/api/v1/organizations/slug/${slug}`);
  },

  /**
   * Create new organization
   */
  create: async (organizationData) => {
    return apiRequest('/api/v1/organizations', {
      method: 'POST',
      body: JSON.stringify(organizationData),
    });
  },

  /**
   * Update organization
   */
  update: async (id, updateData) => {
    return apiRequest(`/api/v1/organizations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  /**
   * Delete organization
   */
  delete: async (id) => {
    return apiRequest(`/api/v1/organizations/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Update verification status
   */
  updateVerification: async (id, status) => {
    return apiRequest(`/api/v1/organizations/${id}/verification`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// ============================================================================
// CAMPAIGNS API
// ============================================================================

export const campaignsAPI = {
  /**
   * List campaigns with filters
   */
  list: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.campaign_type) queryParams.append('campaign_type', filters.campaign_type);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.organization_id) queryParams.append('organization_id', filters.organization_id);
    if (filters.search) queryParams.append('search', filters.search);

    const query = queryParams.toString();
    const endpoint = `/api/v1/campaigns${query ? `?${query}` : ''}`;
    
    return apiRequest(endpoint);
  },

  /**
   * Get campaign by ID
   */
  getById: async (id) => {
    return apiRequest(`/api/v1/campaigns/${id}`);
  },

  /**
   * Get campaign by slug
   */
  getBySlug: async (slug) => {
    return apiRequest(`/api/v1/campaigns/slug/${slug}`);
  },

  /**
   * Create new campaign
   */
  create: async (campaignData) => {
    return apiRequest('/api/v1/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  },

  /**
   * Update campaign
   */
  update: async (id, updateData) => {
    return apiRequest(`/api/v1/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  /**
   * Delete campaign
   */
  delete: async (id) => {
    return apiRequest(`/api/v1/campaigns/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Join campaign
   */
  join: async (id, role = 'supporter') => {
    return apiRequest(`/api/v1/campaigns/${id}/join`, {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  },

  /**
   * Leave campaign
   */
  leave: async (id) => {
    return apiRequest(`/api/v1/campaigns/${id}/leave`, {
      method: 'POST',
    });
  },

  /**
   * Get campaign members
   */
  getMembers: async (id, filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.role) queryParams.append('role', filters.role);
    if (filters.status) queryParams.append('status', filters.status);

    const query = queryParams.toString();
    const endpoint = `/api/v1/campaigns/${id}/members${query ? `?${query}` : ''}`;
    
    return apiRequest(endpoint);
  },

  /**
   * Update campaign progress
   */
  updateProgress: async (id, currentValue) => {
    return apiRequest(`/api/v1/campaigns/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ current_value: currentValue }),
    });
  },
};

// ============================================================================
// AUTH API
// ============================================================================

export const authAPI = {
  /**
   * Register new user
   */
  register: async (userData) => {
    return apiRequest('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    const response = await apiRequest('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store token
    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }

    return response;
  },

  /**
   * Logout user
   */
  logout: async () => {
    localStorage.removeItem('auth_token');
    return apiRequest('/api/v1/auth/logout', {
      method: 'POST',
    });
  },

  /**
   * Verify email
   */
  verifyEmail: async (token) => {
    return apiRequest('/api/v1/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email) => {
    return apiRequest('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Reset password
   */
  resetPassword: async (token, newPassword) => {
    return apiRequest('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};

// ============================================================================
// USERS API
// ============================================================================

export const usersAPI = {
  /**
   * Get current user profile
   */
  me: async () => {
    return apiRequest('/api/v1/users/me');
  },

  /**
   * Get user by ID
   */
  getById: async (id) => {
    return apiRequest(`/api/v1/users/${id}`);
  },

  /**
   * Update user profile
   */
  updateProfile: async (id, updateData) => {
    return apiRequest(`/api/v1/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  /**
   * Get user settings
   */
  getSettings: async (id) => {
    return apiRequest(`/api/v1/users/${id}/settings`);
  },

  /**
   * Update user settings
   */
  updateSettings: async (id, settings) => {
    return apiRequest(`/api/v1/users/${id}/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

export default {
  organizations: organizationsAPI,
  campaigns: campaignsAPI,
  auth: authAPI,
  users: usersAPI,
};
