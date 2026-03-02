import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock authService
vi.mock('../services/authService', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn().mockResolvedValue(null),
  checkIsAdmin: vi.fn().mockResolvedValue(false),
  onAuthStateChange: vi.fn(() => ({ unsubscribe: vi.fn() })),
}));

vi.mock('../services/supabaseClient', () => ({
  default: null,
  isSupabaseConfigured: vi.fn(() => true),
}));

import { AuthProvider } from '../contexts/AuthContext';
import { useAuth } from '../contexts/authUtils';
import AdminLogin from '../pages/AdminLogin';
import ProtectedRoute from '../components/ProtectedRoute';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { signIn, getSession, checkIsAdmin } from '../services/authService';

const renderWithProviders = (ui, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('AdminLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isSupabaseConfigured.mockReturnValue(true);
    getSession.mockResolvedValue(null);
    checkIsAdmin.mockResolvedValue(false);
  });

  it('renders login form', async () => {
    renderWithProviders(<AdminLogin />);
    await waitFor(() => {
      expect(screen.getByText('Admin Login')).toBeTruthy();
    });
  });

  it('renders email and password fields', async () => {
    renderWithProviders(<AdminLogin />);
    await waitFor(() => {
      expect(screen.getByLabelText('email')).toBeTruthy();
      expect(screen.getByLabelText('password')).toBeTruthy();
    });
  });

  it('renders login button', async () => {
    renderWithProviders(<AdminLogin />);
    await waitFor(() => {
      expect(screen.getByText('$ login')).toBeTruthy();
    });
  });

  it('shows not configured message when Supabase is unavailable', async () => {
    isSupabaseConfigured.mockReturnValue(false);
    renderWithProviders(<AdminLogin />);
    await waitFor(() => {
      expect(screen.getByText('Supabase Not Configured')).toBeTruthy();
    });
  });

  it('shows error on failed login', async () => {
    signIn.mockResolvedValue({ user: null, error: 'Invalid credentials' });
    renderWithProviders(<AdminLogin />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('email')).toBeTruthy();
    });

    fireEvent.change(screen.getByLabelText('email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('password'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByText('$ login'));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/)).toBeTruthy();
    });
  });

  it('renders unauthorized access warning text', async () => {
    renderWithProviders(<AdminLogin />);
    await waitFor(() => {
      expect(screen.getByText(/unauthorized access is logged/)).toBeTruthy();
    });
  });
});

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isSupabaseConfigured.mockReturnValue(true);
  });

  it('shows loading state initially', () => {
    getSession.mockReturnValue(new Promise(() => {})); // Never resolves
    renderWithProviders(
      <ProtectedRoute><div>Dashboard</div></ProtectedRoute>
    );
    expect(screen.getByText('authenticating')).toBeTruthy();
  });

  it('redirects to login when not authenticated', async () => {
    getSession.mockResolvedValue(null);
    renderWithProviders(
      <ProtectedRoute><div>Dashboard</div></ProtectedRoute>,
      { route: '/admin' }
    );
    await waitFor(() => {
      expect(screen.queryByText('Dashboard')).toBeNull();
    });
  });
});

describe('AuthContext', () => {
  it('provides auth values', async () => {
    getSession.mockResolvedValue(null);
    let authValues;
    const TestComponent = () => {
      authValues = useAuth();
      return <div>test</div>;
    };
    
    renderWithProviders(<TestComponent />);
    await waitFor(() => {
      expect(authValues).toBeDefined();
      expect(authValues.user).toBeNull();
      expect(authValues.isAdmin).toBe(false);
      expect(typeof authValues.login).toBe('function');
      expect(typeof authValues.logout).toBe('function');
    });
  });
});
