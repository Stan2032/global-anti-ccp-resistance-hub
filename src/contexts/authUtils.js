/**
 * Auth utilities — hook for consuming the AuthContext.
 *
 * @module authUtils
 */
import { useContext } from 'react';
import AuthContext from './AuthContext';

/**
 * @typedef {Object} AuthState
 * @property {Object|null} user - Current Supabase user object, or null if logged out
 * @property {boolean} isAdmin - Whether the current user has admin privileges
 * @property {boolean} loading - Whether auth state is still being determined
 * @property {(email: string, password: string) => Promise<{user: Object|null, error: string|null}>} login - Sign-in function
 * @property {() => Promise<void>} logout - Sign-out function
 */

/**
 * Hook to access authentication state and actions.
 * Must be used inside an `<AuthProvider>`.
 *
 * @returns {AuthState} Authentication state and functions
 * @throws {Error} If used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
