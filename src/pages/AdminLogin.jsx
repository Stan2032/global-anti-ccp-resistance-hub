import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authUtils';
import { isSupabaseConfigured, isServiceRoleKeyError } from '../services/supabaseClient';
import { Lock, AlertTriangle, ShieldAlert } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard when auth state confirms admin
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const { error: loginError } = await login(email, password);
    setSubmitting(false);

    if (loginError) {
      setError(loginError);
    }
    // Navigation handled by useEffect when isAdmin updates
  };

  if (isServiceRoleKeyError()) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-[#111820] border border-red-500/50 p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            <h1 className="text-xl font-bold text-white font-mono">Wrong API Key</h1>
          </div>
          <p className="text-red-300 text-sm mb-4 font-mono">
            error: Forbidden use of secret API key in browser
          </p>
          <p className="text-slate-300 text-sm mb-4">
            You set <code className="text-red-400">VITE_SUPABASE_ANON_KEY</code> to the{' '}
            <strong className="text-red-400">service_role (secret)</strong> key. This key bypasses all
            Row Level Security and must <strong>never</strong> be in client-side code.
          </p>
          <div className="bg-[#0a0e14] border border-[#1c2a35] p-4 text-sm font-mono mb-4">
            <p className="text-slate-400 mb-2">$ fix:</p>
            <ol className="text-slate-300 space-y-2 list-decimal list-inside">
              <li>Go to <span className="text-[#4afa82]">Supabase Dashboard → Settings → API</span></li>
              <li>Find the key labeled <span className="text-[#4afa82]">anon / public</span></li>
              <li>Copy that key (NOT the <span className="text-red-400">service_role / secret</span> one)</li>
              <li>Update <span className="text-[#4afa82]">VITE_SUPABASE_ANON_KEY</span> in your environment</li>
              <li>Redeploy</li>
            </ol>
          </div>
          <p className="text-slate-500 text-xs">
            The anon key is safe to expose — RLS policies protect your data.
            See <code>SUPABASE_AUTH_SETUP.md</code> for details.
          </p>
        </div>
      </div>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-[#111820] border border-yellow-500/50 p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <h1 className="text-xl font-bold text-white font-mono">Supabase Not Configured</h1>
          </div>
          <p className="text-slate-300 text-sm mb-4">
            Admin login requires Supabase. Set <code className="text-[#4afa82]">VITE_SUPABASE_URL</code> and{' '}
            <code className="text-[#4afa82]">VITE_SUPABASE_ANON_KEY</code> environment variables.
          </p>
          <p className="text-slate-500 text-xs">
            See <code>SUPABASE_AUTH_SETUP.md</code> for the full setup guide.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-[#111820] border border-[#1c2a35] p-8 max-w-md w-full">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-[#4afa82]" />
          <h1 className="text-xl font-bold text-white font-mono">Admin Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-sm text-slate-400 font-mono mb-1">
              email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-[#0a0e14] border border-[#1c2a35] text-white px-3 py-2 font-mono text-sm focus:border-[#4afa82] focus:outline-none transition-colors"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm text-slate-400 font-mono mb-1">
              password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-[#0a0e14] border border-[#1c2a35] text-white px-3 py-2 font-mono text-sm focus:border-[#4afa82] focus:outline-none transition-colors"
              placeholder="••••••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 p-3 text-red-400 text-sm font-mono">
              <span className="text-red-500">error:</span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-[#4afa82]/10 border border-[#4afa82]/50 hover:bg-[#4afa82]/20 text-[#4afa82] font-mono text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '$ authenticating...' : '$ login'}
          </button>
        </form>

        <p className="text-slate-600 text-xs font-mono mt-6 text-center">
          admin access only — unauthorized access is logged
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
