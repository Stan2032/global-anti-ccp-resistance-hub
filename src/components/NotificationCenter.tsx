// @ts-nocheck


/**
 * NotificationCenter — Aggregated notification feed from all platform data sources.
 *
 * Pulls from emergency alerts, recent updates, and sanctions tracker to build
 * a unified notification feed. Supports category filtering, search, browser
 * notification permissions, and clipboard export.
 *
 * @module NotificationCenter
 */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Bell, BellOff, BellRing, Check, Copy, ChevronDown, ChevronUp, Search, Settings, Shield, AlertTriangle, Info, CheckCircle, Clock, ExternalLink, Filter } from 'lucide-react';
import { dataApi } from '../services/dataApi';

// ── Notification categories ─────────────────────────────

const CATEGORIES = {
  critical: { label: 'Critical Alerts', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-400/30', icon: AlertTriangle, description: 'Life-threatening situations, urgent court hearings, new detentions' },
  sanctions: { label: 'Sanctions & Legal', color: 'text-[#fbbf24]', bg: 'bg-yellow-900/20', border: 'border-[#fbbf24]/30', icon: Shield, description: 'New sanctions, legal case updates, policy changes' },
  data: { label: 'Data Updates', color: 'text-[#22d3ee]', bg: 'bg-cyan-900/20', border: 'border-[#22d3ee]/30', icon: Info, description: 'New research data, verified reports, dataset changes' },
  action: { label: 'Action Required', color: 'text-[#a78bfa]', bg: 'bg-[#a78bfa]/20', border: 'border-[#a78bfa]/30', icon: BellRing, description: 'Petition deadlines, advocacy opportunities, events' },
};

const CATEGORY_ORDER = ['critical', 'sanctions', 'data', 'action'];

// ── Build notification feed from live data ──────────────

function buildNotificationFeed() {
  const notifications = [];

  // Pull from emergency alerts (critical)
  const alerts = dataApi.getAlerts();
  (alerts || []).forEach((alert) => {
    if (!alert.active) return;
    notifications.push({
      id: `alert-${alert.id}`,
      category: alert.type === 'critical' ? 'critical' : 'sanctions',
      title: alert.title,
      summary: alert.summary,
      date: alert.date,
      source: 'Emergency Alerts',
      url: null,
      priority: alert.type === 'critical' ? 1 : 2,
    });
  });

  // Pull from recent updates (data / action)
  const updates = dataApi.getRecentUpdates();
  (updates || []).slice(0, 15).forEach((update) => {
    const cat = update.category === 'alert' ? 'critical'
      : update.category === 'case' ? 'sanctions'
      : update.category === 'verified' ? 'data'
      : 'data';
    notifications.push({
      id: `update-${update.id}`,
      category: cat,
      title: update.title,
      summary: update.description?.slice(0, 200) + (update.description?.length > 200 ? '…' : ''),
      date: update.date,
      source: 'Platform Updates',
      url: update.relatedPage || null,
      priority: cat === 'critical' ? 1 : cat === 'sanctions' ? 2 : 3,
    });
  });

  // Pull from sanctions (sanctions)
  const sanctions = dataApi.getSanctions();
  const recentSanctions = (sanctions || [])
    .filter((s) => s.date && s.date >= '2025-01-01')
    .slice(0, 5);
  recentSanctions.forEach((s) => {
    notifications.push({
      id: `sanction-${s.target}-${s.date}`,
      category: 'sanctions',
      title: `${s.country}: ${s.type} against ${s.target}`,
      summary: s.reason,
      date: s.date,
      source: 'Sanctions Tracker',
      url: null,
      priority: 2,
    });
  });

  // Sort by date desc, then priority asc
  notifications.sort((a, b) => {
    const dateCompare = (b.date || '').localeCompare(a.date || '');
    if (dateCompare !== 0) return dateCompare;
    return a.priority - b.priority;
  });

  return notifications;
}

// ── Permission helpers ──────────────────────────────────

function getNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission; // 'default', 'granted', 'denied'
}

function isServiceWorkerSupported() {
  return typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
}

// ── Clipboard ───────────────────────────────────────────

function buildClipboardText(notifications, prefs) {
  const lines = [
    'Notification Center — Global Anti-CCP Resistance Hub',
    `Generated: ${new Date().toISOString().slice(0, 10)}`,
    `Active notifications: ${notifications.length}`,
    '',
    'Notification preferences:',
    ...CATEGORY_ORDER.map((k) => `  ${prefs[k] ? '✓' : '✗'} ${CATEGORIES[k].label}`),
    '',
    'Recent notifications:',
  ];
  notifications.slice(0, 20).forEach((n) => {
    const icon = n.category === 'critical' ? '🔴' : n.category === 'sanctions' ? '🟡' : n.category === 'data' ? '🔵' : '🟣';
    lines.push(`${icon} [${n.date}] ${n.title}`);
    if (n.summary) lines.push(`   ${n.summary.slice(0, 120)}`);
  });
  lines.push('');
  lines.push('License: CC BY 4.0 — Attribution required');
  lines.push('Data: https://github.com/Stan2032/global-anti-ccp-resistance-hub');
  return lines.join('\n');
}

// ── Component ───────────────────────────────────────────

/**
 * NotificationCenter component.
 *
 * @returns {React.ReactElement} Notification center with filters and settings
 */
export default function NotificationCenter() {
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [expandedId, setExpandedId] = useState('');
  const [copied, setCopied] = useState(false);

  // Notification preferences (stored in localStorage)
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem('notification-prefs');
      return saved ? JSON.parse(saved) : { critical: true, sanctions: true, data: true, action: true };
    } catch {
      return { critical: true, sanctions: true, data: true, action: true };
    }
  });

  const [permissionStatus, setPermissionStatus] = useState(getNotificationPermission);
  const swSupported = isServiceWorkerSupported();

  // Persist prefs
  useEffect(() => {
    try { localStorage.setItem('notification-prefs', JSON.stringify(prefs)); } catch { /* noop */ }
  }, [prefs]);

  const notifications = useMemo(() => buildNotificationFeed(), []);

  const categoryCounts = useMemo(() => {
    const counts = { critical: 0, sanctions: 0, data: 0, action: 0 };
    notifications.forEach((n) => { counts[n.category]++; });
    return counts;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    let result = notifications;
    if (activeCategory) result = result.filter((n) => n.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((n) =>
        n.title.toLowerCase().includes(q) ||
        (n.summary || '').toLowerCase().includes(q) ||
        n.source.toLowerCase().includes(q)
      );
    }
    return result;
  }, [notifications, activeCategory, searchQuery]);

  const visibleNotifications = showAll ? filteredNotifications : filteredNotifications.slice(0, 10);

  const toggleCategory = useCallback((cat) => {
    setActiveCategory((prev) => (prev === cat ? '' : cat));
  }, []);

  const togglePref = useCallback((cat) => {
    setPrefs((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return;
    try {
      const result = await Notification.requestPermission();
      setPermissionStatus(result);
    } catch {
      /* noop */
    }
  }, []);

  const handleCopy = useCallback(() => {
    try {
      navigator.clipboard.writeText(buildClipboardText(filteredNotifications, prefs));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  }, [filteredNotifications, prefs]);

  return (
    <section aria-label="Notification Center" className="bg-[#0a0e14] border border-[#1c2a35] p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-[#22d3ee]" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-mono">Notification Center</h2>
            <p className="text-slate-400 text-sm mt-1">
              {notifications.length} active notifications across {CATEGORY_ORDER.filter((c) => categoryCounts[c] > 0).length} categories
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border transition-colors ${
              showSettings ? 'border-[#22d3ee]/50 text-[#22d3ee] bg-cyan-900/20' : 'border-[#1c2a35] text-slate-300 hover:border-[#22d3ee]/50 hover:text-[#22d3ee]'
            }`}
            aria-pressed={showSettings}
            aria-label="Toggle notification settings"
          >
            <Settings className="w-3.5 h-3.5" aria-hidden="true" />
            Settings
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#1c2a35] text-slate-300 hover:border-[#22d3ee]/50 hover:text-[#22d3ee] transition-colors"
            aria-label={copied ? 'Copied to clipboard' : 'Copy notification feed to clipboard'}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="bg-[#111820] border border-[#1c2a35] p-4 space-y-4">
          <h3 className="text-sm font-mono text-slate-200 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#22d3ee]" aria-hidden="true" />
            Notification Preferences
          </h3>

          {/* Browser permission status */}
          <div className="flex items-center gap-3 p-3 bg-[#0a0e14] border border-[#1c2a35]">
            {permissionStatus === 'granted' ? (
              <>
                <CheckCircle className="w-4 h-4 text-[#4afa82] flex-shrink-0" aria-hidden="true" />
                <span className="text-sm text-slate-300 font-mono">Browser notifications enabled</span>
              </>
            ) : permissionStatus === 'denied' ? (
              <>
                <BellOff className="w-4 h-4 text-red-400 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm text-slate-300 font-mono">Browser notifications blocked — update in browser settings</span>
              </>
            ) : permissionStatus === 'unsupported' ? (
              <>
                <AlertTriangle className="w-4 h-4 text-[#fbbf24] flex-shrink-0" aria-hidden="true" />
                <span className="text-sm text-slate-300 font-mono">Browser notifications not supported</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 text-[#fbbf24] flex-shrink-0" aria-hidden="true" />
                <span className="text-sm text-slate-300 font-mono flex-1">Browser notifications not enabled</span>
                <button
                  onClick={requestPermission}
                  className="text-xs font-mono px-2 py-1 border border-[#22d3ee]/30 text-[#22d3ee] hover:bg-cyan-900/20 transition-colors"
                >
                  Enable
                </button>
              </>
            )}
          </div>

          {/* Service worker status */}
          <div className="flex items-center gap-3 p-3 bg-[#0a0e14] border border-[#1c2a35]">
            {swSupported ? (
              <>
                <CheckCircle className="w-4 h-4 text-[#4afa82] flex-shrink-0" aria-hidden="true" />
                <span className="text-sm text-slate-300 font-mono">Service worker active — push notifications supported</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-[#fbbf24] flex-shrink-0" aria-hidden="true" />
                <span className="text-sm text-slate-300 font-mono">Service worker not available</span>
              </>
            )}
          </div>

          {/* Category toggles */}
          <div className="space-y-2">
            <p className="text-xs font-mono text-slate-400">Select which notification categories you want to receive:</p>
            {CATEGORY_ORDER.map((cat) => {
              const cfg = CATEGORIES[cat];
              const Icon = cfg.icon;
              return (
                <button
                  key={cat}
                  onClick={() => togglePref(cat)}
                  className={`w-full flex items-center gap-3 p-3 border text-left transition-colors ${
                    prefs[cat] ? `${cfg.bg} ${cfg.border}` : 'bg-[#0a0e14] border-[#1c2a35] opacity-60'
                  }`}
                  aria-pressed={prefs[cat]}
                  aria-label={`${cfg.label}: ${prefs[cat] ? 'enabled' : 'disabled'}`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${prefs[cat] ? cfg.color : 'text-slate-400'}`} aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-mono ${prefs[cat] ? 'text-slate-200' : 'text-slate-400'}`}>{cfg.label}</span>
                    <p className="text-xs text-slate-400 mt-0.5">{cfg.description}</p>
                  </div>
                  <div className={`w-8 h-5 rounded-full flex items-center transition-colors ${prefs[cat] ? 'bg-[#4afa82]/30 justify-end' : 'bg-[#1c2a35] justify-start'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full mx-0.5 transition-colors ${prefs[cat] ? 'bg-[#4afa82]' : 'bg-slate-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Privacy note */}
          <p className="text-xs text-slate-400 font-mono">
            <Shield className="w-3 h-3 inline mr-1" aria-hidden="true" />
            Preferences stored locally only. No data sent to servers. No tracking.
          </p>
        </div>
      )}

      {/* Category filter buttons */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_ORDER.map((cat) => {
          const cfg = CATEGORIES[cat];
          const Icon = cfg.icon;
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border transition-colors ${
                active ? `${cfg.bg} ${cfg.border} ${cfg.color}` : 'border-[#1c2a35] text-slate-400 hover:border-slate-400/50'
              }`}
              aria-pressed={active}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              {cfg.label}
              <span className={`ml-1 ${active ? cfg.color : 'text-slate-400'}`}>({categoryCounts[cat]})</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#111820] border border-[#1c2a35] text-slate-200 pl-10 pr-4 py-2 text-sm font-mono placeholder:text-slate-400 focus:border-[#22d3ee]/50 focus:outline-none"
          aria-label="Search notifications"
        />
      </div>

      {/* Count */}
      <p className="text-xs font-mono text-slate-400">
        Showing {visibleNotifications.length} of {filteredNotifications.length} notifications
      </p>

      {/* Notification feed */}
      <div className="space-y-2">
        {visibleNotifications.map((n) => {
          const cfg = CATEGORIES[n.category] || CATEGORIES.data;
          const Icon = cfg.icon;
          const expanded = expandedId === n.id;

          return (
            <div
              key={n.id}
              className={`border ${expanded ? cfg.border : 'border-[#1c2a35]'} bg-[#111820] transition-colors`}
            >
              <button
                onClick={() => setExpandedId(expanded ? '' : n.id)}
                className="w-full flex items-start gap-3 p-3 sm:p-4 text-left"
                aria-expanded={expanded}
                aria-label={`${n.title} — ${cfg.label}`}
              >
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.color}`} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-mono text-slate-200 leading-snug">{n.title}</h3>
                    <span className={`text-xs font-mono px-1.5 py-0.5 ${cfg.bg} ${cfg.color} ${cfg.border} border`}>{cfg.label}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs font-mono text-slate-400">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    <span>{n.date}</span>
                    <span aria-hidden="true">|</span>
                    <span>{n.source}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-slate-400">
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {expanded && (
                <div className="border-t border-[#1c2a35] px-3 sm:px-4 py-3 space-y-2">
                  {n.summary && (
                    <p className="text-sm text-slate-300 font-mono leading-relaxed">{n.summary}</p>
                  )}
                  {n.url && (
                    <a
                      href={n.url}
                      className="inline-flex items-center gap-1 text-xs font-mono text-[#22d3ee] hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      View related page
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show more / no results */}
      {filteredNotifications.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-sm font-mono">
          {searchQuery ? 'No notifications match your search.' : 'No notifications in this category.'}
        </div>
      )}

      {!showAll && filteredNotifications.length > 10 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-2 text-sm font-mono text-[#22d3ee] border border-[#1c2a35] hover:border-[#22d3ee]/50 transition-colors"
        >
          Show all {filteredNotifications.length} notifications
        </button>
      )}

      {showAll && filteredNotifications.length > 10 && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full py-2 text-sm font-mono text-[#22d3ee] border border-[#1c2a35] hover:border-[#22d3ee]/50 transition-colors"
        >
          Show less
        </button>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-[#1c2a35] flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3" aria-hidden="true" />
          Privacy-first — no tracking
        </span>
        <span aria-hidden="true">|</span>
        <span>Preferences stored locally</span>
        <span aria-hidden="true">|</span>
        <span>Push via service worker v3</span>
      </div>
    </section>
  );
}
