// @ts-nocheck


/**
 * LegalCaseTracker — Tracks active and concluded legal cases against
 * CCP entities. Searchable by jurisdiction, case type, and outcome.
 *
 * @module LegalCaseTracker
 */
import React, { useState, useMemo } from 'react';
import { Scale, Search, Copy, Check, ChevronDown, ChevronUp, Filter, ExternalLink, Calendar, Globe, Shield, AlertTriangle } from 'lucide-react';
import { dataApi } from '../services/dataApi';

// ── Status configuration ──────────────────────────────

const STATUS_CONFIG = {
  CONVICTED: { label: 'Convicted', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-400/30', dot: 'bg-red-400' },
  PENDING_TRIAL: { label: 'Pending Trial', color: 'text-[#fbbf24]', bg: 'bg-yellow-900/20', border: 'border-[#fbbf24]/30', dot: 'bg-[#fbbf24]' },
  PENDING_INVESTIGATION: { label: 'Under Investigation', color: 'text-[#22d3ee]', bg: 'bg-cyan-900/20', border: 'border-[#22d3ee]/30', dot: 'bg-[#22d3ee]' },
  ONGOING: { label: 'Ongoing', color: 'text-[#a78bfa]', bg: 'bg-[#a78bfa]/20', border: 'border-[#a78bfa]/30', dot: 'bg-[#a78bfa]' },
  CONCLUDED: { label: 'Concluded', color: 'text-[#4afa82]', bg: 'bg-green-900/20', border: 'border-[#4afa82]/30', dot: 'bg-[#4afa82]' },
  RELEASED: { label: 'Released', color: 'text-slate-300', bg: 'bg-slate-800/30', border: 'border-slate-400/30', dot: 'bg-slate-400' },
};

const STATUS_ORDER = ['CONVICTED', 'PENDING_TRIAL', 'PENDING_INVESTIGATION', 'ONGOING', 'CONCLUDED', 'RELEASED'];

// ── Clipboard ─────────────────────────────────────────

function buildClipboardText(cases, statusFilter) {
  const lines = [
    'Legal Case Tracker — Global Anti-CCP Resistance Hub',
    `Generated: ${new Date().toISOString().slice(0, 10)}`,
    `Cases: ${cases.length}${statusFilter ? ` (filtered: ${statusFilter})` : ''}`,
    '',
  ];
  cases.forEach((c) => {
    lines.push(`${c.case_name}`);
    lines.push(`  Jurisdiction: ${c.jurisdiction}`);
    lines.push(`  Status: ${c.status}`);
    if (c.outcome) lines.push(`  Outcome: ${c.outcome}`);
    lines.push('');
  });
  lines.push('License: CC BY 4.0 — Attribution required');
  lines.push('Data: https://github.com/Stan2032/global-anti-ccp-resistance-hub');
  return lines.join('\n');
}

// ── Component ─────────────────────────────────────────

export default function LegalCaseTracker() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedCase, setExpandedCase] = useState('');
  const [copied, setCopied] = useState(false);

  const cases = useMemo(() => {
    const data = dataApi.getLegalCases();
    return [...data].sort((a, b) => {
      // Sort by most recent key date descending
      const dateA = getLatestDate(a);
      const dateB = getLatestDate(b);
      return dateB.localeCompare(dateA);
    });
  }, []);

  const statusCounts = useMemo(() => {
    const counts = {};
    STATUS_ORDER.forEach((s) => { counts[s] = 0; });
    cases.forEach((c) => {
      const s = c.status?.toUpperCase() || 'CONCLUDED';
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [cases]);

  const jurisdictionCounts = useMemo(() => {
    const counts = {};
    cases.forEach((c) => {
      const j = c.jurisdiction || 'Unknown';
      counts[j] = (counts[j] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [cases]);

  const filteredCases = useMemo(() => {
    let list = cases;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) =>
        (c.case_name || '').toLowerCase().includes(q) ||
        (c.jurisdiction || '').toLowerCase().includes(q) ||
        (c.defendant || '').toLowerCase().includes(q) ||
        (c.charges || '').toLowerCase().includes(q) ||
        (c.court || '').toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      list = list.filter((c) => (c.status || '').toUpperCase() === statusFilter);
    }
    return list;
  }, [cases, searchQuery, statusFilter]);

  const handleToggle = (caseName) => {
    setExpandedCase((prev) => (prev === caseName ? '' : caseName));
  };

  const handleCopy = async () => {
    const text = buildClipboardText(filteredCases, statusFilter);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter((prev) => (prev === status ? '' : status));
  };

  return (
    <section
      className="bg-[#0a0e14] border border-[#1c2a35] font-mono"
      aria-label="Legal Case Tracker"
    >
      {/* Header */}
      <div className="border-b border-[#1c2a35] p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-1">
          <Scale className="w-5 h-5 text-[#4afa82]" aria-hidden="true" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            Legal Case Tracker
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          Tracking {cases.length} court cases and legal proceedings related to CCP human rights violations across {jurisdictionCounts.length} jurisdictions
        </p>
      </div>

      {/* Status Summary Bar */}
      <div className="border-b border-[#1c2a35] p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {STATUS_ORDER.map((status) => {
            const config = STATUS_CONFIG[status];
            const count = statusCounts[status] || 0;
            if (count === 0) return null;
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                aria-pressed={isActive}
                className={`border p-3 text-center transition-colors cursor-pointer ${
                  isActive
                    ? `${config.border} ${config.bg}`
                    : 'border-[#1c2a35] bg-[#0d1117] hover:border-slate-600'
                }`}
              >
                <div className={`text-xl font-bold ${config.color}`}>
                  {count}
                </div>
                <div className="text-xs text-slate-400">{config.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Distribution Bar */}
      <div className="border-b border-[#1c2a35] p-4 sm:p-6">
        <div className="flex h-2 overflow-hidden mb-3">
          {STATUS_ORDER.map((status) => {
            const count = statusCounts[status] || 0;
            if (count === 0) return null;
            const config = STATUS_CONFIG[status];
            const pct = (count / cases.length) * 100;
            return (
              <div
                key={status}
                className={config.dot}
                style={{ width: `${pct}%` }}
                aria-label={`${config.label}: ${count} cases (${Math.round(pct)}%)`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          {STATUS_ORDER.map((status) => {
            const count = statusCounts[status] || 0;
            if (count === 0) return null;
            const config = STATUS_CONFIG[status];
            return (
              <span key={status} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 ${config.dot}`} aria-hidden="true" />
                <span className="text-slate-400">
                  {config.label}: {count}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Jurisdiction Breakdown */}
      <div className="border-b border-[#1c2a35] p-4 sm:p-6">
        <h3 className="text-sm font-bold text-white mb-3">Jurisdictions</h3>
        <div className="flex flex-wrap gap-2">
          {jurisdictionCounts.map(([jurisdiction, count]) => (
            <span
              key={jurisdiction}
              className="inline-flex items-center gap-1.5 px-2 py-1 border border-[#1c2a35] bg-[#0d1117] text-xs"
            >
              <Globe className="w-3 h-3 text-[#22d3ee]" aria-hidden="true" />
              <span className="text-slate-300">{jurisdiction}</span>
              <span className="text-[#22d3ee] font-bold">{count}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Search & Controls */}
      <div className="border-b border-[#1c2a35] p-4 sm:p-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases, jurisdictions, defendants..."
            className="w-full pl-10 pr-3 py-2 bg-[#0d1117] border border-[#1c2a35] text-sm text-slate-300 placeholder:text-slate-400 focus:border-[#4afa82] focus:outline-none"
            aria-label="Search legal cases"
          />
        </div>
        {/* Filter indicator */}
        {statusFilter && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span className="text-xs text-slate-400">
              Showing: <span className="text-white">{STATUS_CONFIG[statusFilter]?.label || statusFilter}</span>
            </span>
            <button
              onClick={() => setStatusFilter('')}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Clear
            </button>
          </div>
        )}
        {/* Copy */}
        <button
          onClick={handleCopy}
          disabled={filteredCases.length === 0}
          className="flex items-center gap-2 px-3 py-2 border border-[#1c2a35] text-sm text-slate-400 hover:text-white hover:border-slate-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label={copied ? 'Copied to clipboard' : 'Copy summary to clipboard'}
        >
          {copied ? (
            <Check className="w-4 h-4 text-[#4afa82]" aria-hidden="true" />
          ) : (
            <Copy className="w-4 h-4" aria-hidden="true" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Case List */}
      <div className="divide-y divide-[#1c2a35]">
        {filteredCases.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-400">
            No cases match your search
          </div>
        ) : (
          filteredCases.map((legalCase) => {
            const status = (legalCase.status || 'CONCLUDED').toUpperCase();
            const config = STATUS_CONFIG[status] || STATUS_CONFIG.CONCLUDED;
            const isExpanded = expandedCase === legalCase.case_name;
            const latestDate = getLatestDate(legalCase);

            return (
              <div key={legalCase.case_name || legalCase.case_number}>
                {/* Case Row */}
                <button
                  onClick={() => handleToggle(legalCase.case_name)}
                  className="w-full text-left p-4 sm:px-6 flex items-center gap-3 hover:bg-[#0d1117] transition-colors"
                  aria-expanded={isExpanded}
                  aria-controls={`details-${legalCase.case_number}`}
                >
                  <span
                    className={`w-2 h-2 flex-shrink-0 ${config.dot}`}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-white font-medium block truncate">
                      {legalCase.case_name}
                    </span>
                    <span className="text-xs text-slate-400 block truncate">
                      {legalCase.jurisdiction} — {legalCase.court}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 border ${config.border} ${config.bg} ${config.color} flex-shrink-0`}
                  >
                    {config.label}
                  </span>
                  {latestDate && (
                    <span className="text-xs text-slate-400 hidden sm:inline flex-shrink-0">
                      Latest: {latestDate}
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" aria-hidden="true" />
                  )}
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div
                    id={`details-${legalCase.case_number}`}
                    className="px-4 sm:px-6 pb-4 bg-[#0d1117]"
                  >
                    <div className="space-y-3">
                      {/* Case Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-400 text-xs block">Defendant</span>
                          <span className="text-slate-300">{legalCase.defendant || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs block">Charges</span>
                          <span className="text-slate-300">{legalCase.charges || 'N/A'}</span>
                        </div>
                        {legalCase.case_number && (
                          <div>
                            <span className="text-slate-400 text-xs block">Case Number</span>
                            <span className="text-slate-300">{legalCase.case_number}</span>
                          </div>
                        )}
                      </div>

                      {/* Key Dates */}
                      {legalCase.key_dates && Object.keys(legalCase.key_dates).length > 0 && (
                        <div>
                          <span className="text-slate-400 text-xs block mb-1">
                            <Calendar className="w-3 h-3 inline mr-1" aria-hidden="true" />
                            Key Dates
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(legalCase.key_dates).map(([key, value]) => (
                              <span key={key} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0a0e14] border border-[#1c2a35] text-xs">
                                <span className="text-slate-400">{formatDateLabel(key)}:</span>
                                <span className="text-slate-300">{value}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Outcome */}
                      {legalCase.outcome && (
                        <div>
                          <span className="text-slate-400 text-xs block mb-1">Outcome</span>
                          <p className="text-sm text-slate-300">{legalCase.outcome}</p>
                        </div>
                      )}

                      {/* Significance */}
                      {legalCase.significance && (
                        <div className={`p-3 border ${config.border} ${config.bg}`}>
                          <span className="text-slate-400 text-xs block mb-1">
                            <AlertTriangle className="w-3 h-3 inline mr-1" aria-hidden="true" />
                            Significance
                          </span>
                          <p className="text-sm text-slate-300">{legalCase.significance}</p>
                        </div>
                      )}

                      {/* International Response */}
                      {legalCase.international_response && (
                        <div>
                          <span className="text-slate-400 text-xs block mb-1">
                            <Globe className="w-3 h-3 inline mr-1" aria-hidden="true" />
                            International Response
                          </span>
                          <p className="text-sm text-slate-300">{legalCase.international_response}</p>
                        </div>
                      )}

                      {/* Related Persons */}
                      {legalCase.related_persons?.length > 0 && (
                        <div>
                          <span className="text-slate-400 text-xs block mb-1">Related Persons</span>
                          <div className="flex flex-wrap gap-1">
                            {legalCase.related_persons.map((person) => (
                              <span key={person} className="px-2 py-0.5 bg-[#0a0e14] border border-[#1c2a35] text-xs text-slate-300">
                                {person}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Source */}
                      {legalCase.source_url && (
                        <div className="pt-1 flex items-center gap-2">
                          <Shield className="w-3 h-3 text-slate-400" aria-hidden="true" />
                          <a
                            href={legalCase.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#22d3ee] hover:underline inline-flex items-center gap-1"
                          >
                            View source
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                          {legalCase.last_verified && (
                            <span className="text-xs text-slate-400">
                              Verified: {legalCase.last_verified}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Methodology */}
      <div className="border-t border-[#1c2a35] p-4 sm:p-6">
        <p className="text-xs text-slate-400">
          Data sourced from Tier 1-2 outlets (BBC, Reuters, HRW, CPJ, government records, court documents).
          CCP state media is never cited. Includes criminal prosecutions, parliamentary resolutions,
          tribunal findings, and administrative enforcement actions.
        </p>
      </div>
    </section>
  );
}

// ── Helpers ───────────────────────────────────────────

function getLatestDate(legalCase) {
  if (!legalCase.key_dates) return '';
  const dates = Object.values(legalCase.key_dates).filter(Boolean);
  if (dates.length === 0) return '';
  return dates.sort().reverse()[0];
}

function formatDateLabel(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
