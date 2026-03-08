// @ts-nocheck — Phase 2 migration: types to be added
/**
 * DataIntegrityMonitor — Monitors data quality across all datasets.
 * Checks for missing fields, broken links, stale records, and
 * source verification status.
 *
 * @module DataIntegrityMonitor
 */
import React, { useState, useMemo } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, Copy, Check, Activity, Database, Clock, Link2, Search } from 'lucide-react';
import { dataApi } from '../services/dataApi';

// ── Health status thresholds ───────────────────────────

const FRESHNESS_THRESHOLDS = { fresh: 7, current: 30 }; // days

function daysSince(dateStr) {
  if (!dateStr) return Infinity;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return Infinity;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

function freshnessStatus(days) {
  if (days <= FRESHNESS_THRESHOLDS.fresh) return 'fresh';
  if (days <= FRESHNESS_THRESHOLDS.current) return 'current';
  return 'stale';
}

const STATUS_CONFIG = {
  fresh: { label: 'Fresh', color: 'text-[#4afa82]', bg: 'bg-green-900/20', border: 'border-[#4afa82]/30', icon: CheckCircle },
  current: { label: 'Current', color: 'text-[#fbbf24]', bg: 'bg-yellow-900/20', border: 'border-[#fbbf24]/30', icon: Clock },
  stale: { label: 'Stale', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-400/30', icon: AlertTriangle },
  pass: { label: 'Pass', color: 'text-[#4afa82]', bg: 'bg-green-900/20', border: 'border-[#4afa82]/30', icon: CheckCircle },
  warn: { label: 'Warning', color: 'text-[#fbbf24]', bg: 'bg-yellow-900/20', border: 'border-[#fbbf24]/30', icon: AlertTriangle },
  fail: { label: 'Fail', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-400/30', icon: XCircle },
};

// ── Validation checks ──────────────────────────────────

function validateUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch { return false; }
}

const CCP_DOMAINS = ['xinhua', 'globaltimes', 'chinadaily', 'cgtn', 'cctv', 'people.com.cn', 'ecns.cn'];

function hasCcpSource(url) {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  return CCP_DOMAINS.some((d) => lower.includes(d));
}

function runDatasetChecks(name, records, fields) {
  const checks = [];
  const count = records.length;

  // Record count
  checks.push({
    name: 'Record count',
    status: count > 0 ? 'pass' : 'fail',
    detail: `${count} records`,
  });

  // Required fields completeness
  if (fields && fields.length > 0) {
    const requiredFields = fields.slice(0, 3); // first 3 fields are typically required
    let missing = 0;
    records.forEach((r) => {
      requiredFields.forEach((f) => {
        if (!r[f] && r[f] !== 0) missing++;
      });
    });
    const completeness = count > 0 ? Math.round(((count * requiredFields.length - missing) / (count * requiredFields.length)) * 100) : 0;
    checks.push({
      name: 'Field completeness',
      status: completeness >= 95 ? 'pass' : completeness >= 80 ? 'warn' : 'fail',
      detail: `${completeness}% of required fields populated`,
    });
  }

  // Source URL validation
  const urlField = fields?.find((f) => f.includes('source') || f.includes('url') || f.includes('website'));
  if (urlField) {
    const withUrls = records.filter((r) => r[urlField]);
    const validUrls = withUrls.filter((r) => validateUrl(r[urlField]));
    const ccpSources = withUrls.filter((r) => hasCcpSource(r[urlField]));
    const coverage = count > 0 ? Math.round((withUrls.length / count) * 100) : 0;

    checks.push({
      name: 'Source URL coverage',
      status: coverage >= 90 ? 'pass' : coverage >= 70 ? 'warn' : 'fail',
      detail: `${coverage}% have source URLs (${withUrls.length}/${count})`,
    });

    if (validUrls.length < withUrls.length) {
      checks.push({
        name: 'URL format validation',
        status: 'warn',
        detail: `${withUrls.length - validUrls.length} malformed URL(s)`,
      });
    } else if (withUrls.length > 0) {
      checks.push({
        name: 'URL format validation',
        status: 'pass',
        detail: 'All URLs well-formed',
      });
    }

    checks.push({
      name: 'CCP source exclusion',
      status: ccpSources.length === 0 ? 'pass' : 'fail',
      detail: ccpSources.length === 0 ? 'No CCP state media sources' : `${ccpSources.length} CCP source(s) detected`,
    });
  }

  // Duplicate detection (by first field)
  if (fields && fields[0] && count > 0) {
    const primaryField = fields[0];
    const values = records.map((r) => (r[primaryField] || '').toLowerCase().trim()).filter(Boolean);
    const unique = new Set(values);
    const dupes = values.length - unique.size;
    checks.push({
      name: 'Duplicate detection',
      status: dupes === 0 ? 'pass' : 'warn',
      detail: dupes === 0 ? 'No duplicates found' : `${dupes} potential duplicate(s)`,
    });
  }

  return checks;
}

// ── Build full integrity report ────────────────────────

function buildIntegrityReport() {
  const summary = dataApi.getDatasetSummary();
  const datasets = [];

  const dataFetchers = {
    political_prisoners: () => dataApi.getPoliticalPrisoners(),
    sanctions: () => dataApi.getSanctions(),
    sanctioned_officials: () => dataApi.getSanctionedOfficials(),
    timeline_events: () => dataApi.getTimelineEvents(),
    forced_labor_companies: () => dataApi.getForcedLaborCompanies(),
    detention_facilities: () => dataApi.getDetentionFacilities(),
    emergency_alerts: () => dataApi.getAlerts(),
    live_statistics: () => dataApi.getStatistics(),
    international_responses: () => dataApi.getInternationalResponses(),
    human_rights_orgs: () => dataApi.getHumanRightsOrgs(),
    police_stations: () => dataApi.getPoliceStations(),
    legal_cases: () => dataApi.getLegalCases(),
  };

  Object.entries(summary.datasets).forEach(([key, meta]) => {
    const fetcher = dataFetchers[key];
    if (!fetcher) return;

    const records = fetcher();
    const checks = runDatasetChecks(key, records, meta.fields);

    // Freshness from lastVerified dates in records
    const dateFields = ['last_verified', 'lastVerified', 'date'];
    let latestDate = null;
    records.forEach((r) => {
      dateFields.forEach((df) => {
        if (r[df] && (!latestDate || r[df] > latestDate)) {
          latestDate = r[df];
        }
      });
    });

    const days = daysSince(latestDate || summary.lastUpdated);
    const freshness = freshnessStatus(days);

    const passCount = checks.filter((c) => c.status === 'pass').length;
    const failCount = checks.filter((c) => c.status === 'fail').length;
    const overallStatus = failCount > 0 ? 'fail' : checks.some((c) => c.status === 'warn') ? 'warn' : 'pass';

    datasets.push({
      key,
      name: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      description: meta.description,
      count: meta.count,
      fields: meta.fields,
      checks,
      freshness,
      freshnessLabel: `${days === Infinity ? 'Unknown' : days + 'd'}`,
      passCount,
      failCount,
      overallStatus,
    });
  });

  // Sort: failures first, then warnings, then passes
  const order = { fail: 0, warn: 1, pass: 2 };
  datasets.sort((a, b) => order[a.overallStatus] - order[b.overallStatus]);

  return datasets;
}

// ── Clipboard ──────────────────────────────────────────

function buildClipboardText(datasets) {
  const lines = [
    'Data Integrity Monitor — Global Anti-CCP Resistance Hub',
    `Generated: ${new Date().toISOString().slice(0, 10)}`,
    `Datasets: ${datasets.length}`,
    '',
  ];
  datasets.forEach((ds) => {
    const statusIcon = ds.overallStatus === 'pass' ? '✓' : ds.overallStatus === 'warn' ? '⚠' : '✗';
    lines.push(`${statusIcon} ${ds.name} (${ds.count} records, ${ds.freshnessLabel})`);
    ds.checks.forEach((c) => {
      const icon = c.status === 'pass' ? '  ✓' : c.status === 'warn' ? '  ⚠' : '  ✗';
      lines.push(`${icon} ${c.name}: ${c.detail}`);
    });
    lines.push('');
  });
  lines.push('License: CC BY 4.0 — Attribution required');
  lines.push('Data: https://github.com/Stan2032/global-anti-ccp-resistance-hub');
  return lines.join('\n');
}

// ── Component ──────────────────────────────────────────

export default function DataIntegrityMonitor() {
  const [expandedDataset, setExpandedDataset] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [copied, setCopied] = useState(false);

  const datasets = useMemo(() => buildIntegrityReport(), []);

  const statusCounts = useMemo(() => {
    const counts = { pass: 0, warn: 0, fail: 0 };
    datasets.forEach((ds) => { counts[ds.overallStatus]++; });
    return counts;
  }, [datasets]);

  const totalChecks = useMemo(() => {
    let pass = 0, warn = 0, fail = 0;
    datasets.forEach((ds) => {
      ds.checks.forEach((c) => {
        if (c.status === 'pass') pass++;
        else if (c.status === 'warn') warn++;
        else fail++;
      });
    });
    return { pass, warn, fail, total: pass + warn + fail };
  }, [datasets]);

  const filteredDatasets = useMemo(() => {
    let result = datasets;
    if (statusFilter) result = result.filter((ds) => ds.overallStatus === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((ds) =>
        ds.name.toLowerCase().includes(q) ||
        ds.description.toLowerCase().includes(q) ||
        ds.key.includes(q)
      );
    }
    return result;
  }, [datasets, statusFilter, searchQuery]);

  const handleCopy = () => {
    navigator.clipboard.writeText(buildClipboardText(datasets));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scorePercent = totalChecks.total > 0 ? Math.round((totalChecks.pass / totalChecks.total) * 100) : 0;

  return (
    <section aria-label="Data Integrity Monitor" className="bg-[#0a0e14] border border-[#1c2a35] p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#4afa82]" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-mono">Data Integrity Monitor</h2>
            <p className="text-slate-300 text-sm mt-1">
              {datasets.length} datasets validated — {totalChecks.pass}/{totalChecks.total} checks passing ({scorePercent}% health score)
            </p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#1c2a35] hover:border-[#22d3ee]/50 text-slate-300 hover:text-[#22d3ee] transition-colors"
          aria-label={copied ? 'Copied to clipboard' : 'Copy integrity report to clipboard'}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
        {(['pass', 'warn', 'fail']).map((status) => {
          const cfg = STATUS_CONFIG[status];
          const Icon = cfg.icon;
          const active = statusFilter === status;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(active ? '' : status)}
              className={`flex flex-col items-center gap-1 p-3 border text-center transition-colors ${
                active ? `${cfg.bg} ${cfg.border} ${cfg.color}` : 'border-[#1c2a35] text-slate-400 hover:border-slate-400/50'
              }`}
              aria-pressed={active}
              aria-label={`Filter by ${cfg.label}: ${statusCounts[status]} datasets`}
            >
              <Icon className={`w-5 h-5 ${active ? cfg.color : 'text-slate-400'}`} aria-hidden="true" />
              <span className={`text-2xl font-bold font-mono ${active ? cfg.color : 'text-slate-200'}`}>{statusCounts[status]}</span>
              <span className="text-xs font-mono">{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* Health score bar */}
      <div className="mb-4">
        <div className="flex h-2 overflow-hidden bg-[#111820] border border-[#1c2a35]">
          {totalChecks.pass > 0 && (
            <div
              className="bg-[#4afa82]"
              style={{ width: `${(totalChecks.pass / totalChecks.total) * 100}%` }}
              aria-label={`${totalChecks.pass} checks passing`}
            />
          )}
          {totalChecks.warn > 0 && (
            <div
              className="bg-[#fbbf24]"
              style={{ width: `${(totalChecks.warn / totalChecks.total) * 100}%` }}
              aria-label={`${totalChecks.warn} checks warning`}
            />
          )}
          {totalChecks.fail > 0 && (
            <div
              className="bg-red-400"
              style={{ width: `${(totalChecks.fail / totalChecks.total) * 100}%` }}
              aria-label={`${totalChecks.fail} checks failing`}
            />
          )}
        </div>
        <div className="flex gap-4 mt-2 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#4afa82] rounded-full" aria-hidden="true" /> Pass ({totalChecks.pass})</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#fbbf24] rounded-full" aria-hidden="true" /> Warn ({totalChecks.warn})</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full" aria-hidden="true" /> Fail ({totalChecks.fail})</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search datasets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#111820] border border-[#1c2a35] text-slate-200 pl-10 pr-4 py-2 text-sm font-mono placeholder:text-slate-400 focus:border-[#22d3ee]/50 focus:outline-none"
          aria-label="Search datasets"
        />
      </div>

      {/* Count */}
      <p className="text-xs font-mono text-slate-400 mb-3">
        Showing {filteredDatasets.length} of {datasets.length} datasets
      </p>

      {/* Dataset cards */}
      <div className="space-y-2">
        {filteredDatasets.map((ds) => {
          const cfg = STATUS_CONFIG[ds.overallStatus];
          const FreshnessIcon = STATUS_CONFIG[ds.freshness]?.icon || Clock;
          const freshnessColor = STATUS_CONFIG[ds.freshness]?.color || 'text-slate-400';
          const expanded = expandedDataset === ds.key;

          return (
            <div
              key={ds.key}
              className={`border ${expanded ? cfg.border : 'border-[#1c2a35]'} bg-[#111820] transition-colors`}
            >
              <button
                onClick={() => setExpandedDataset(expanded ? '' : ds.key)}
                className="w-full flex items-start gap-3 p-3 sm:p-4 text-left"
                aria-expanded={expanded}
                aria-label={`${ds.name}: ${ds.count} records, ${cfg.label} status`}
              >
                <cfg.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.color}`} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-mono text-slate-200">{ds.name}</h3>
                    <span className={`text-xs font-mono px-1.5 py-0.5 ${cfg.bg} ${cfg.color} ${cfg.border} border`}>{cfg.label}</span>
                    <span className={`text-xs font-mono flex items-center gap-1 ${freshnessColor}`}>
                      <FreshnessIcon className="w-3 h-3" aria-hidden="true" />
                      {ds.freshnessLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{ds.description}</p>
                  <div className="flex gap-3 mt-1.5 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Database className="w-3 h-3" aria-hidden="true" />
                      {ds.count} records
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3" aria-hidden="true" />
                      {ds.passCount}/{ds.checks.length} checks
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-slate-400">
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {expanded && (
                <div className="border-t border-[#1c2a35] px-3 sm:px-4 py-3 space-y-2">
                  <p className="text-xs font-mono text-slate-300 mb-2">
                    <Link2 className="w-3 h-3 inline mr-1" aria-hidden="true" />
                    Validation checks ({ds.checks.length})
                  </p>
                  {ds.checks.map((check, idx) => {
                    const checkCfg = STATUS_CONFIG[check.status];
                    const CheckIcon = checkCfg.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs font-mono bg-[#0a0e14] border border-[#1c2a35] px-3 py-2"
                      >
                        <CheckIcon className={`w-3.5 h-3.5 flex-shrink-0 ${checkCfg.color}`} aria-hidden="true" />
                        <span className="text-slate-300 flex-shrink-0">{check.name}</span>
                        <span className="text-slate-400" aria-hidden="true">—</span>
                        <span className={`${checkCfg.color} truncate`}>{check.detail}</span>
                      </div>
                    );
                  })}
                  {ds.fields && ds.fields.length > 0 && (
                    <div className="mt-2 text-xs font-mono text-slate-400">
                      <span className="text-slate-300">Schema: </span>
                      {ds.fields.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredDatasets.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-sm font-mono">
          {searchQuery ? 'No datasets match your search.' : 'No datasets match this filter.'}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-[#1c2a35] flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" aria-hidden="true" />
          Automated validation
        </span>
        <span aria-hidden="true">|</span>
        <span>Tier 1-2 sources only</span>
        <span aria-hidden="true">|</span>
        <span>{scorePercent}% health score</span>
      </div>
    </section>
  );
}
