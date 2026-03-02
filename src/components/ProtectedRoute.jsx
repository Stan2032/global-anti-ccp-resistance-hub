/**
 * ProtectedRoute — wraps admin pages.
 * Redirects to /admin/login if:
 *  - Supabase is not configured
 *  - User is not logged in
 *  - User is not an admin
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authUtils';

const ProtectedRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#4afa82] font-mono text-sm">$</span>
            <span className="text-white font-mono text-sm">authenticating</span>
            <span className="text-[#4afa82] font-mono text-sm animate-pulse">█</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
