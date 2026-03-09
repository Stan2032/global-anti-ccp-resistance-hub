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
  isServiceRoleKeyError: vi.fn(() => false),
}));

import { AuthProvider } from '../contexts/AuthContext';
import { useAuth } from '../contexts/authUtils';
import AdminLogin from '../pages/AdminLogin';
import ProtectedRoute from '../components/ProtectedRoute';
import { isSupabaseConfigured, isServiceRoleKeyError } from '../services/supabaseClient';
import { signIn, getSession, checkIsAdmin } from '../services/authService';

const renderWithProviders = (ui: any, { route = '/' } = {}) => {
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
    (isSupabaseConfigured as any).mockReturnValue(true);
    (isServiceRoleKeyError as any).mockReturnValue(false);
    (getSession as any).mockResolvedValue(null);
    (checkIsAdmin as any).mockResolvedValue(false);
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
    (isSupabaseConfigured as any).mockReturnValue(false);
    renderWithProviders(<AdminLogin />);
    await waitFor(() => {
      expect(screen.getByText('Supabase Not Configured')).toBeTruthy();
    });
  });

  it('shows wrong API key error when service_role key is detected', async () => {
    (isServiceRoleKeyError as any).mockReturnValue(true);
    (isSupabaseConfigured as any).mockReturnValue(false);
    renderWithProviders(<AdminLogin />);
    await waitFor(() => {
      expect(screen.getByText('Wrong API Key')).toBeTruthy();
      expect(screen.getByText(/Forbidden use of secret API key/)).toBeTruthy();
    });
  });

  it('shows error on failed login', async () => {
    (signIn as any).mockResolvedValue({ user: null, error: 'Invalid credentials' });
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
    (isSupabaseConfigured as any).mockReturnValue(true);
  });

  it('shows loading state initially', () => {
    (getSession as any).mockReturnValue(new Promise(() => {})); // Never resolves
    renderWithProviders(
      <ProtectedRoute><div>Dashboard</div></ProtectedRoute>
    );
    expect(screen.getByText('authenticating')).toBeTruthy();
  });

  it('redirects to login when not authenticated', async () => {
    (getSession as any).mockResolvedValue(null);
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
    (getSession as any).mockResolvedValue(null);
    let authValues: any;
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
