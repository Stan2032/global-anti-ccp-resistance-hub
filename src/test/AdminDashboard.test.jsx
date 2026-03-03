import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock authUtils
vi.mock('../contexts/authUtils', () => ({
  useAuth: vi.fn(() => ({
    user: { email: 'admin@test.com' },
    logout: vi.fn(),
  })),
}));

// Mock supabaseClient
vi.mock('../services/supabaseClient', () => {
  const mockFrom = vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue({ data: [], error: null }),
  }));
  // Also handle count queries (head: true)
  mockFrom.mockImplementation(() => ({
    select: vi.fn(() => ({
      // for count queries: returns { count: 0 }
      count: 0,
      // for data queries: chainable
      order: vi.fn(() => ({
        limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    })),
  }));
  return {
    default: { from: mockFrom },
  };
});

import { useAuth } from '../contexts/authUtils';
import AdminDashboard from '../pages/AdminDashboard';

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: { email: 'admin@test.com' },
      logout: vi.fn(),
    });
  });

  it('renders the header with title', async () => {
    render(<AdminDashboard />);
    expect(screen.getByText('Admin Dashboard')).toBeTruthy();
  });

  it('displays the user email', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('admin@test.com')).toBeTruthy();
  });

  it('renders the logout button', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('logout')).toBeTruthy();
  });

  it('calls logout when logout button is clicked', () => {
    const mockLogout = vi.fn();
    useAuth.mockReturnValue({
      user: { email: 'admin@test.com' },
      logout: mockLogout,
    });
    render(<AdminDashboard />);
    fireEvent.click(screen.getByText('logout'));
    expect(mockLogout).toHaveBeenCalled();
  });

  it('renders all tab labels', () => {
    render(<AdminDashboard />);
    expect(screen.getAllByText('Incident Reports').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Volunteers').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Newsletter').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Contact Messages').length).toBeGreaterThanOrEqual(1);
  });

  it('switches active tab when clicked', async () => {
    render(<AdminDashboard />);
    // Default tab heading is "Incident Reports" in the data table header
    const tableHeaders = screen.getAllByText('Incident Reports');
    expect(tableHeaders.length).toBeGreaterThanOrEqual(1);

    // Click Volunteers tab
    fireEvent.click(screen.getByText('Volunteers'));
    await waitFor(() => {
      const volunteersHeaders = screen.getAllByText('Volunteers');
      expect(volunteersHeaders.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('renders the refresh button', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('refresh')).toBeTruthy();
  });

  it('renders the info footer about encrypted fields', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/Encrypted fields/)).toBeTruthy();
  });
});
