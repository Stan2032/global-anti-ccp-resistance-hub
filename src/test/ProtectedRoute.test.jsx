import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';

// Mock auth context
const mockUseAuth = vi.fn();
vi.mock('../contexts/authUtils', () => ({
  useAuth: () => mockUseAuth(),
}));

const renderProtected = () => render(
  <MemoryRouter initialEntries={['/admin']}>
    <Routes>
      <Route path="/admin" element={
        <ProtectedRoute>
          <div>Admin Content</div>
        </ProtectedRoute>
      } />
      <Route path="/admin/login" element={<div>Login Page</div>} />
    </Routes>
  </MemoryRouter>
);

describe('ProtectedRoute', () => {
  it('shows loading state while authenticating', () => {
    mockUseAuth.mockReturnValue({ user: null, isAdmin: false, loading: true });
    renderProtected();
    expect(screen.getByText('authenticating')).toBeTruthy();
  });

  it('redirects to login when not authenticated', () => {
    mockUseAuth.mockReturnValue({ user: null, isAdmin: false, loading: false });
    renderProtected();
    expect(screen.getByText('Login Page')).toBeTruthy();
  });

  it('redirects to login when authenticated but not admin', () => {
    mockUseAuth.mockReturnValue({ user: { id: '1' }, isAdmin: false, loading: false });
    renderProtected();
    expect(screen.getByText('Login Page')).toBeTruthy();
  });

  it('renders children when authenticated as admin', () => {
    mockUseAuth.mockReturnValue({ user: { id: '1' }, isAdmin: true, loading: false });
    renderProtected();
    expect(screen.getByText('Admin Content')).toBeTruthy();
  });

  it('shows loading animation during auth check', () => {
    mockUseAuth.mockReturnValue({ user: null, isAdmin: false, loading: true });
    renderProtected();
    expect(screen.getByText('$')).toBeTruthy();
    expect(screen.getByText('authenticating')).toBeTruthy();
  });
});
