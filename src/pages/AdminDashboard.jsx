/**
 * AdminDashboard — Protected admin panel for managing platform content.
 * Requires Supabase authentication. Displays submission queues, contact
 * messages, and platform statistics.
 *
 * @module AdminDashboard
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authUtils';
import supabase from '../services/supabaseClient';
import { Shield, FileText, Users, Mail, MessageSquare, LogOut, RefreshCw } from 'lucide-react';

const TABS = [
  { id: 'incidents', label: 'Incident Reports', icon: FileText, table: 'incident_reports' },
  { id: 'volunteers', label: 'Volunteers', icon: Users, table: 'volunteer_signups' },
  { id: 'newsletter', label: 'Newsletter', icon: Mail, table: 'newsletter_subscribers' },
  { id: 'contacts', label: 'Contact Messages', icon: MessageSquare, table: 'contact_messages' },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('incidents');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [counts, setCounts] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch counts for all tabs
  useEffect(() => {
    const fetchCounts = async () => {
      const newCounts = {};
      for (const tab of TABS) {
        const { count } = await supabase
          .from(tab.table)
          .select('*', { count: 'exact', head: true });
        newCounts[tab.id] = count || 0;
      }
      setCounts(newCounts);
    };
    fetchCounts();
  }, [refreshKey]);

  // Fetch data for active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      const tab = TABS.find(t => t.id === activeTab);
      const { data: rows, error: fetchError } = await supabase
        .from(tab.table)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (fetchError) {
        setError(fetchError.message);
        setData([]);
      } else {
        setData(rows || []);
      }
      setLoading(false);
    };
    fetchData();
  }, [activeTab, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#4afa82]" />
            <div>
              <h1 className="text-xl font-bold text-white font-mono">Admin Dashboard</h1>
              <p className="text-slate-400 text-xs font-mono">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/20 border border-red-500/30 text-red-400 text-sm font-mono hover:bg-red-900/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            logout
          </button>
        </div>
      </div>

      {/* Tab Counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-4 border font-mono text-left transition-colors ${
              activeTab === tab.id
                ? 'bg-[#4afa82]/10 border-[#4afa82]/50 text-[#4afa82]'
                : 'bg-[#111820] border-[#1c2a35] text-slate-400 hover:border-[#4afa82]/30'
            }`}
          >
            <tab.icon className="w-5 h-5 mb-2" />
            <div className="text-2xl font-bold">{counts[tab.id] ?? '—'}</div>
            <div className="text-xs mt-1">{tab.label}</div>
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-[#111820] border border-[#1c2a35]">
        <div className="flex items-center justify-between p-4 border-b border-[#1c2a35]">
          <h2 className="text-lg font-bold text-white font-mono">
            {TABS.find(t => t.id === activeTab)?.label}
          </h2>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-3 py-1 text-slate-400 hover:text-[#4afa82] font-mono text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            refresh
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center" role="status" aria-live="polite">
            <span className="text-[#4afa82] font-mono text-sm animate-pulse">$ loading data...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <span className="text-red-400 font-mono text-sm">error: {error}</span>
          </div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center">
            <span className="text-slate-400 font-mono text-sm">No records found</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-[#1c2a35]">
                  {Object.keys(data[0]).map(key => (
                    <th key={key} className="text-left px-4 py-3 text-xs font-medium text-slate-400">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={row.id || i} className="border-b border-[#1c2a35]/50 hover:bg-[#1c2a35]/20">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-4 py-2.5 text-slate-300 text-xs max-w-xs truncate">
                        {val === null ? <span className="text-slate-500 cursor-not-allowed">null</span> :
                         typeof val === 'object' ? JSON.stringify(val) :
                         String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-slate-400 text-xs font-mono text-center">
        Encrypted fields (name, email, messages) appear as ciphertext. 
        Non-PII fields (status, dates, types) are readable.
      </div>
    </div>
  );
};

export default AdminDashboard;
