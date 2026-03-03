/**
 * Auth Context — provides authentication state to the React tree.
 *
 * Wraps the app and exposes: user, isAdmin, loading, login, logout.
 * Admin status is checked via the admin_users table after sign-in.
 */
import React, { createContext, useState, useEffect } from 'react';
import { signIn, signOut, getSession, checkIsAdmin, onAuthStateChange } from '../services/authService';
import { isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(() => isSupabaseConfigured());

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    // Check existing session on mount
    getSession().then(async (session) => {
      if (session?.user) {
        setUser(session.user);
        const admin = await checkIsAdmin();
        setIsAdmin(admin);
      }
      setLoading(false);
    });

    // Listen for auth changes (sign in, sign out, token refresh)
    const subscription = onAuthStateChange(async (event, session) => {
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

  const login = async (email, password) => {
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
