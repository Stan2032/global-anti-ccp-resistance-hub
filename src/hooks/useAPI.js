/**
 * Custom hooks for API interactions
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

// ============================================================================
// ORGANIZATIONS HOOKS
// ============================================================================

/**
 * Hook to fetch and manage organizations list
 */
export function useOrganizations(initialFilters = {}) {
  const [organizations, setOrganizations] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrganizations = useCallback(async (filters = initialFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.organizations.list(filters);
      setOrganizations(response.data.organizations);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch organizations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return {
    organizations,
    pagination,
    loading,
    error,
    refresh: fetchOrganizations,
  };
}

/**
 * Hook to fetch a single organization
 */
export function useOrganization(id) {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrganization = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.organizations.getById(id);
      setOrganization(response.data.organization);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch organization:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  return {
    organization,
    loading,
    error,
    refresh: fetchOrganization,
  };
}

// ============================================================================
// CAMPAIGNS HOOKS
// ============================================================================

/**
 * Hook to fetch and manage campaigns list
 */
export function useCampaigns(initialFilters = {}) {
  const [campaigns, setCampaigns] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCampaigns = useCallback(async (filters = initialFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.campaigns.list(filters);
      setCampaigns(response.data.campaigns);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch campaigns:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    pagination,
    loading,
    error,
    refresh: fetchCampaigns,
  };
}

/**
 * Hook to fetch a single campaign
 */
export function useCampaign(id) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCampaign = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.campaigns.getById(id);
      setCampaign(response.data.campaign);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch campaign:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  return {
    campaign,
    loading,
    error,
    refresh: fetchCampaign,
  };
}

/**
 * Hook to fetch campaign members
 */
export function useCampaignMembers(campaignId, initialFilters = {}) {
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async (filters = initialFilters) => {
    if (!campaignId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.campaigns.getMembers(campaignId, filters);
      setMembers(response.data.members);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch campaign members:', err);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    pagination,
    loading,
    error,
    refresh: fetchMembers,
  };
}

// ============================================================================
// AUTHENTICATION HOOKS
// ============================================================================

/**
 * Hook for authentication state
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await apiClient.auth.login(email, password);
      setUser(response.data.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const response = await apiClient.auth.register(userData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await apiClient.auth.logout();
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.users.me();
      setUser(response.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}

// ============================================================================
// GENERIC MUTATION HOOK
// ============================================================================

/**
 * Generic hook for API mutations (create, update, delete)
 */
export function useMutation(mutationFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = async (...args) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await mutationFn(...args);
      setData(response.data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  return {
    mutate,
    loading,
    error,
    data,
    reset,
  };
}
