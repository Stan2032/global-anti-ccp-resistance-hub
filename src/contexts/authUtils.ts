/**
 * Auth utilities — hook for consuming the AuthContext.
 *
 * @module authUtils
 */
import { useContext } from 'react';
import AuthContext from './AuthContext';

/** Authentication state and actions provided by AuthProvider. */
export interface AuthState {
  /** Current Supabase user object, or null if logged out */
  user: Record<string, unknown> | null;
  /** Whether the current user has admin privileges */
  isAdmin: boolean;
  /** Whether auth state is still being determined */
  loading: boolean;
  /** Sign-in function */
  login: (email: string, password: string) => Promise<{ user: Record<string, unknown> | null; error: string | null }>;
  /** Sign-out function */
  logout: () => Promise<void>;
}

/**
 * Hook to access authentication state and actions.
 * Must be used inside an `<AuthProvider>`.
 */
export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context as AuthState;
}
