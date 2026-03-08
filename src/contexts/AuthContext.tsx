/**
 * Auth Context — provides authentication state to the React tree.
 *
 * Wraps the app and exposes: user, isAdmin, loading, login, logout.
 * Admin status is checked via the admin_users table after sign-in.
 */
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { signIn, signOut, getSession, checkIsAdmin, onAuthStateChange } from '../services/authService';
import { isSupabaseConfigured } from '../services/supabaseClient';

interface AuthContextValue {
  user: unknown;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<unknown>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<unknown>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(() => isSupabaseConfigured());

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    // Check existing session on mount
    getSession().then(async (session: { user?: unknown } | null) => {
      if (session?.user) {
        setUser(session.user);
        const admin = await checkIsAdmin();
        setIsAdmin(admin);
      }
      setLoading(false);
    });

    // Listen for auth changes (sign in, sign out, token refresh)
    const subscription = onAuthStateChange(async (_event: string, session: { user?: unknown } | null) => {
      if (session?.user) {
        setUser(session.user);
        const admin = await checkIsAdmin();
        setIsAdmin(admin);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => {
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const result = await signIn(email, password);
    return result;
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
