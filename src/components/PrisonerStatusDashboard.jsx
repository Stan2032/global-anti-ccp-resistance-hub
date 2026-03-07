import React, { useMemo, useState } from 'react';
import { Copy, Check, AlertTriangle, Heart, Clock, Users, Eye, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { dataApi } from '../services/dataApi';

const STATUS_CONFIG = {
  DETAINED: { label: 'Detained', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-400/30', sort: 1 },
  IMPRISONED: { label: 'Imprisoned', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-400/30', sort: 1 },
  DISAPPEARED: { label: 'Disappeared', color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-400/30', sort: 2 },
  'AT RISK': { label: 'At Risk', color: 'text-[#fbbf24]', bg: 'bg-yellow-900/20', border: 'border-yellow-400/30', sort: 3 },
  EXILE: { label: 'In Exile', color: 'text-[#22d3ee]', bg: 'bg-cyan-900/20', border: 'border-[#22d3ee]/30', sort: 4 },
  RELEASED: { label: 'Released', color: 'text-[#4afa82]', bg: 'bg-green-900/20', border: 'border-[#4afa82]/30', sort: 5 },
  DECEASED: { label: 'Deceased', color: 'text-slate-400', bg: 'bg-slate-800/50', border: 'border-slate-400/30', sort: 6 },
};

const HEALTH_KEYWORDS = {
  critical: ['torture', 'deteriorating', 'critical', 'malnutrition', 'denied medical', 'force-fed', 'organ'],
  concerning: ['poor', 'concern', 'ill', 'condition', 'weight loss', 'untreated', 'solitary'],
  unknown: ['unknown', 'no information', 'no access', 'denied visit', 'incommunicado'],
};

function classifyHealth(healthStatus) {
  if (!healthStatus) return 'unknown';
  const lower = healthStatus.toLowerCase();
  if (HEALTH_KEYWORDS.critical.some(k => lower.includes(k))) return 'critical';
  if (HEALTH_KEYWORDS.concerning.some(k => lower.includes(k))) return 'concerning';
  if (HEALTH_KEYWORDS.unknown.some(k => lower.includes(k))) return 'unknown';
  return 'stable';
}

function getHealthConfig(classification) {
  switch (classification) {
    case 'critical': return { label: 'Critical', color: 'text-red-400', icon: '🔴' };
    case 'concerning': return { label: 'Concerning', color: 'text-yellow-400', icon: '🟡' };
    case 'stable': return { label: 'Stable', color: 'text-[#4afa82]', icon: '🟢' };
    default: return { label: 'Unknown', color: 'text-slate-400', icon: '⚪' };
  }
}

function classifyRegion(prisoner) {
  const fields = [
    prisoner.location,
    prisoner.prisoner_name,
    prisoner.latest_news,
    prisoner.sentence,
  ].filter(Boolean).join(' ').toLowerCase();

  if (fields.includes('hong kong') || fields.includes('hk')) return 'Hong Kong';
  if (fields.includes('xinjiang') || fields.includes('uyghur') || fields.includes('uighur')) return 'Uyghur';
  if (fields.includes('tibet')) return 'Tibet';
  if (fields.includes('falun') || fields.includes('gong')) return 'Falun Gong';
  return 'Mainland';
}

export default function PrisonerStatusDashboard() {
  const [copied, setCopied] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [healthFilter, setHealthFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [sortBy, setSortBy] = useState('urgency');

  const analysis = useMemo(() => {
    const prisoners = dataApi.getPoliticalPrisoners();

    const enriched = prisoners.map(p => {
      const healthClass = classifyHealth(p.health_status);
      const region = classifyRegion(p);
      const status = (p.status || 'UNKNOWN').toUpperCase();
      const statusConf = STATUS_CONFIG[status] || STATUS_CONFIG.DETAINED;

      return {
        ...p,
        healthClass,
        region,
        normalizedStatus: status,
        statusConf,
        isUrgent: status === 'DETAINED' || status === 'IMPRISONED' || status === 'DISAPPEARED',
        hasHealthAlert: healthClass === 'critical' || healthClass === 'concerning',
      };
    });

    const statusCounts = {};
    const healthCounts = { critical: 0, concerning: 0, stable: 0, unknown: 0 };
    const regionCounts = {};

    for (const p of enriched) {
      statusCounts[p.normalizedStatus] = (statusCounts[p.normalizedStatus] || 0) + 1;
      healthCounts[p.healthClass]++;
      regionCounts[p.region] = (regionCounts[p.region] || 0) + 1;
    }

    return {
      prisoners: enriched,
      total: enriched.length,
      statusCounts,
      healthCounts,
      regionCounts,
      urgentCount: enriched.filter(p => p.isUrgent).length,
      healthAlertCount: enriched.filter(p => p.hasHealthAlert).length,
    };
  }, []);

  const filtered = useMemo(() => {
    let list = analysis.prisoners;

    if (statusFilter !== 'all') {
      list = list.filter(p => p.normalizedStatus === statusFilter);
    }
    if (healthFilter !== 'all') {
      list = list.filter(p => p.healthClass === healthFilter);
    }

    // Sort
    list = [...list].sort((a, b) => {
      if (sortBy === 'urgency') {
        if (a.statusConf.sort !== b.statusConf.sort) return a.statusConf.sort - b.statusConf.sort;
        const healthOrder = { critical: 0, concerning: 1, unknown: 2, stable: 3 };
        return (healthOrder[a.healthClass] || 9) - (healthOrder[b.healthClass] || 9);
      }
      if (sortBy === 'health') {
        const healthOrder = { critical: 0, concerning: 1, unknown: 2, stable: 3 };
        return (healthOrder[a.healthClass] || 9) - (healthOrder[b.healthClass] || 9);
      }
      if (sortBy === 'name') {
        return (a.prisoner_name || '').localeCompare(b.prisoner_name || '');
      }
      if (sortBy === 'region') {
        return (a.region || '').localeCompare(b.region || '');
      }
      return 0;
    });

    return list;
  }, [analysis.prisoners, statusFilter, healthFilter, sortBy]);

  const handleCopy = async () => {
    const lines = [
      'Prisoner Status Dashboard — Global Anti-CCP Resistance Hub',
      `Generated: ${new Date().toISOString().slice(0, 10)}`,
      `Total documented: ${analysis.total}`,
      '',
      'Status Breakdown:',
      ...Object.entries(analysis.statusCounts).map(([s, c]) => `  ${s}: ${c}`),
      '',
      'Health Alerts:',
      `  Critical: ${analysis.healthCounts.critical}`,
      `  Concerning: ${analysis.healthCounts.concerning}`,
      `  Unknown: ${analysis.healthCounts.unknown}`,
      '',
      'Urgent Cases (health alerts):',
      ...analysis.prisoners
        .filter(p => p.hasHealthAlert)
        .map(p => `  ${p.prisoner_name} — ${p.health_status || 'Details unavailable'}`),
      '',
      'License: CC BY 4.0 — Attribution required',
      'Data: https://github.com/Stan2032/global-anti-ccp-resistance-hub',
    ];

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#111820] border border-[#1c2a35] border-l-4 border-l-red-400 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <Eye className="w-7 h-7 text-red-400" />
            <div>
              <h2 className="text-2xl font-bold font-mono text-white">Prisoner Status Dashboard</h2>
              <p className="text-slate-300 text-sm mt-1">
                Real-time monitoring of {analysis.total} documented political prisoners
              </p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-4 py-2 bg-[#0a0e14] border border-[#1c2a35] hover:border-[#4afa82] text-slate-300 hover:text-[#4afa82] font-mono text-sm transition-colors"
            aria-label="Copy dashboard summary to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-[#4afa82]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : '$ copy_summary'}</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111820] border border-[#1c2a35] p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Users className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <span className="text-slate-400 text-sm">Total Documented</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{analysis.total}</div>
        </div>
        <div className="bg-[#111820] border border-[#1c2a35] border-l-4 border-l-red-400 p-4">
          <div className="flex items-center space-x-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-red-400" aria-hidden="true" />
            <span className="text-slate-400 text-sm">Currently Detained</span>
          </div>
          <div className="text-2xl font-bold text-red-400 font-mono">{analysis.urgentCount}</div>
        </div>
        <div className="bg-[#111820] border border-[#1c2a35] border-l-4 border-l-yellow-400 p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Heart className="w-4 h-4 text-yellow-400" aria-hidden="true" />
            <span className="text-slate-400 text-sm">Health Alerts</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400 font-mono">{analysis.healthAlertCount}</div>
        </div>
        <div className="bg-[#111820] border border-[#1c2a35] p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <span className="text-slate-400 text-sm">Disappeared</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400 font-mono">
            {analysis.statusCounts.DISAPPEARED || 0}
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h3 className="font-mono text-lg font-bold text-white mb-4">Status Distribution</h3>
        <div className="flex h-6 overflow-hidden mb-3">
          {Object.entries(analysis.statusCounts)
            .sort(([a], [b]) => (STATUS_CONFIG[a]?.sort || 9) - (STATUS_CONFIG[b]?.sort || 9))
            .map(([status, count]) => {
              const conf = STATUS_CONFIG[status] || STATUS_CONFIG.DETAINED;
              const pct = Math.round((count / analysis.total) * 100);
              return (
                <div
                  key={status}
                  className={`${conf.bg} border-r border-[#0a0e14] flex items-center justify-center text-xs font-mono font-bold ${conf.color}`}
                  style={{ width: `${pct}%` }}
                  aria-label={`${conf.label}: ${pct}%`}
                >
                  {pct > 8 && `${pct}%`}
                </div>
              );
            })}
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          {Object.entries(analysis.statusCounts)
            .sort(([a], [b]) => (STATUS_CONFIG[a]?.sort || 9) - (STATUS_CONFIG[b]?.sort || 9))
            .map(([status, count]) => {
              const conf = STATUS_CONFIG[status] || STATUS_CONFIG.DETAINED;
              return (
                <span key={status} className="flex items-center space-x-1">
                  <span className={`w-2.5 h-2.5 ${conf.bg} border ${conf.border} inline-block`} aria-hidden="true" />
                  <span className="text-slate-300">{conf.label}: {count}</span>
                </span>
              );
            })}
        </div>
      </div>

      {/* Health Overview */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Heart className="w-5 h-5 text-red-400" />
          <h3 className="font-mono text-lg font-bold text-white">Health Status Overview</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(analysis.healthCounts).map(([classification, count]) => {
            const conf = getHealthConfig(classification);
            return (
              <div key={classification} className="bg-[#0a0e14] border border-[#1c2a35] p-3 text-center">
                <div className="text-lg mb-1" aria-hidden="true">{conf.icon}</div>
                <div className={`text-xl font-bold font-mono ${conf.color}`}>{count}</div>
                <div className="text-slate-400 text-xs">{conf.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h3 className="font-mono text-lg font-bold text-white mb-4">Prisoner Monitor</h3>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div>
            <span className="text-slate-400 text-xs block mb-1">Status</span>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2 py-1 text-xs font-mono border transition-colors ${
                  statusFilter === 'all'
                    ? 'border-[#4afa82] text-[#4afa82] bg-[#4afa82]/10'
                    : 'border-[#1c2a35] text-slate-400 hover:border-slate-400'
                }`}
                aria-pressed={statusFilter === 'all'}
              >
                All ({analysis.total})
              </button>
              {Object.entries(analysis.statusCounts)
                .sort(([a], [b]) => (STATUS_CONFIG[a]?.sort || 9) - (STATUS_CONFIG[b]?.sort || 9))
                .map(([status, count]) => {
                  const conf = STATUS_CONFIG[status] || STATUS_CONFIG.DETAINED;
                  return (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-2 py-1 text-xs font-mono border transition-colors ${
                        statusFilter === status
                          ? 'border-[#4afa82] text-[#4afa82] bg-[#4afa82]/10'
                          : 'border-[#1c2a35] text-slate-400 hover:border-slate-400'
                      }`}
                      aria-pressed={statusFilter === status}
                    >
                      {conf.label} ({count})
                    </button>
                  );
                })}
            </div>
          </div>
          <div>
            <span className="text-slate-400 text-xs block mb-1">Health</span>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setHealthFilter('all')}
                className={`px-2 py-1 text-xs font-mono border transition-colors ${
                  healthFilter === 'all'
                    ? 'border-[#4afa82] text-[#4afa82] bg-[#4afa82]/10'
                    : 'border-[#1c2a35] text-slate-400 hover:border-slate-400'
                }`}
                aria-pressed={healthFilter === 'all'}
              >
                All
              </button>
              {['critical', 'concerning', 'unknown', 'stable'].map(h => {
                const conf = getHealthConfig(h);
                return (
                  <button
                    key={h}
                    onClick={() => setHealthFilter(h)}
                    className={`px-2 py-1 text-xs font-mono border transition-colors ${
                      healthFilter === h
                        ? 'border-[#4afa82] text-[#4afa82] bg-[#4afa82]/10'
                        : 'border-[#1c2a35] text-slate-400 hover:border-slate-400'
                    }`}
                    aria-pressed={healthFilter === h}
                  >
                    {conf.icon} {conf.label} ({analysis.healthCounts[h]})
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <span className="text-slate-400 text-xs block mb-1">Sort</span>
            <div className="flex flex-wrap gap-1">
              {[
                { key: 'urgency', label: 'Urgency' },
                { key: 'health', label: 'Health' },
                { key: 'name', label: 'Name' },
                { key: 'region', label: 'Region' },
              ].map(s => (
                <button
                  key={s.key}
                  onClick={() => setSortBy(s.key)}
                  className={`px-2 py-1 text-xs font-mono border transition-colors ${
                    sortBy === s.key
                      ? 'border-[#22d3ee] text-[#22d3ee] bg-[#22d3ee]/10'
                      : 'border-[#1c2a35] text-slate-400 hover:border-slate-400'
                  }`}
                  aria-pressed={sortBy === s.key}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="text-slate-400 text-sm mb-3 font-mono">
          Showing {filtered.length} of {analysis.total} prisoners
        </div>

        {/* Prisoner list */}
        <div className="space-y-2">
          {filtered.map((p, idx) => {
            const healthConf = getHealthConfig(p.healthClass);
            const isExpanded = expanded === idx;
            return (
              <div key={p.prisoner_name || idx} className={`border ${p.statusConf.border} bg-[#0a0e14] transition-colors`}>
                <button
                  onClick={() => setExpanded(isExpanded ? null : idx)}
                  className="w-full text-left p-3 flex items-center justify-between"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <span className="text-sm" aria-hidden="true">{healthConf.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="text-white font-mono text-sm font-bold truncate">{p.prisoner_name || 'Unknown'}</span>
                        <span className={`text-xs font-mono px-1.5 py-0.5 ${p.statusConf.bg} ${p.statusConf.color}`}>
                          {p.statusConf.label}
                        </span>
                        <span className="text-xs text-slate-400">{p.region}</span>
                      </div>
                      {p.location && (
                        <div className="text-xs text-slate-400 truncate">{p.location}</div>
                      )}
                    </div>
                  </div>
                  {isExpanded
                    ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3 space-y-2 border-t border-[#1c2a35]">
                    {p.sentence && (
                      <div className="pt-2">
                        <span className="text-slate-400 text-xs">Sentence:</span>
                        <p className="text-slate-300 text-sm">{p.sentence}</p>
                      </div>
                    )}
                    {p.health_status && (
                      <div>
                        <span className="text-slate-400 text-xs">Health Status:</span>
                        <p className={`text-sm ${healthConf.color}`}>{p.health_status}</p>
                      </div>
                    )}
                    {p.latest_news && (
                      <div>
                        <span className="text-slate-400 text-xs">Latest Update:</span>
                        <p className="text-slate-300 text-sm">{p.latest_news}</p>
                      </div>
                    )}
                    {p.international_response && (
                      <div>
                        <span className="text-slate-400 text-xs">International Response:</span>
                        <p className="text-slate-300 text-sm">{p.international_response}</p>
                      </div>
                    )}
                    {p.source_url && (
                      <div className="pt-1">
                        <a
                          href={p.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#22d3ee] text-xs hover:underline font-mono"
                        >
                          $ view_source →
                        </a>
                      </div>
                    )}
                    {p.confidence && (
                      <div className="flex items-center space-x-1 pt-1">
                        <Shield className="w-3 h-3 text-slate-400" aria-hidden="true" />
                        <span className="text-xs text-slate-400">Confidence: {p.confidence}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-400 font-mono text-sm">
            No prisoners match the selected filters
          </div>
        )}
      </div>

      {/* Regional Summary */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h3 className="font-mono text-lg font-bold text-white mb-4">Regional Distribution</h3>
        <div className="space-y-2">
          {Object.entries(analysis.regionCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([region, count]) => {
              const maxCount = Math.max(...Object.values(analysis.regionCounts));
              const widthPct = Math.max(5, Math.round((count / maxCount) * 100));
              return (
                <div key={region} className="flex items-center space-x-3">
                  <div className="w-28 flex-shrink-0 text-sm text-slate-300">{region}</div>
                  <div className="flex-1 h-5 bg-[#0a0e14] overflow-hidden">
                    <div
                      className="h-full bg-[#22d3ee]/60"
                      style={{ width: `${widthPct}%` }}
                      aria-label={`${region}: ${count} prisoners`}
                    />
                  </div>
                  <div className="w-8 text-right text-sm font-mono text-slate-300">{count}</div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Methodology Note */}
      <div className="bg-[#111820] border border-[#1c2a35] border-l-4 border-l-[#22d3ee] p-6">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-5 h-5 text-[#22d3ee]" />
          <h3 className="font-mono text-lg font-bold text-white">Methodology</h3>
        </div>
        <div className="space-y-2 text-sm text-slate-300">
          <p>
            Health classifications are derived from keyword analysis of verified health status reports.
            &quot;Critical&quot; includes documented torture, deteriorating conditions, and denied medical care.
            &quot;Concerning&quot; covers poor conditions, illness, and untreated ailments.
          </p>
          <p className="text-slate-400">
            All data sourced from Tier 1-2 outlets (BBC, Reuters, HRW, Amnesty, CECC).
            CCP state media is never cited. Last verification dates are maintained per-record.
          </p>
        </div>
      </div>
    </div>
  );
}
