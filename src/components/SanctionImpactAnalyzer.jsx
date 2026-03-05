import { useState, useMemo } from 'react';
import { dataApi } from '../services/dataApi';
import {
  Shield,
  Search,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  AlertTriangle,
  Users,
  BarChart3,
  ExternalLink,
  Filter,
  Globe,
} from 'lucide-react';

/**
 * SanctionImpactAnalyzer — Cross-dataset analysis of international
 * sanctions against CCP officials.
 *
 * Combines sanctioned_officials and sanctions_tracker datasets to show:
 *   - Officials ranked by sanction coverage (how many countries)
 *   - Coverage classification (Full / Strong / Partial / Unsanctioned)
 *   - Country breakdown (which countries sanction which officials)
 *   - Coverage gaps — officials with limited sanctions
 *   - Copy-to-clipboard summary
 *
 * All data sourced from verified JSON via dataApi.
 * No external dependencies. No user tracking. Privacy-respecting.
 */

// ── Coverage classification ───────────────────────────

const SANCTIONING_COUNTRIES = ['us', 'uk', 'eu', 'canada', 'australia'];

const COVERAGE_ORDER = ['Full', 'Strong', 'Partial', 'Gap'];

const COVERAGE_STYLES = {
  Full: {
    badge: 'bg-[#4afa82]/20 text-[#4afa82] border-[#4afa82]/30',
    dot: 'bg-[#4afa82]',
    bar: 'bg-[#4afa82]',
    label: 'Full Coverage',
    description: 'Sanctioned by all 5 countries',
  },
  Strong: {
    badge: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
    dot: 'bg-yellow-400',
    bar: 'bg-yellow-400',
    label: 'Strong Coverage',
    description: 'Sanctioned by 3-4 countries',
  },
  Partial: {
    badge: 'bg-orange-400/20 text-orange-400 border-orange-400/30',
    dot: 'bg-orange-400',
    bar: 'bg-orange-400',
    label: 'Partial Coverage',
    description: 'Sanctioned by 1-2 countries',
  },
  Gap: {
    badge: 'bg-red-400/20 text-red-400 border-red-400/30',
    dot: 'bg-red-400',
    bar: 'bg-red-400',
    label: 'Coverage Gap',
    description: 'Not sanctioned or data unavailable',
  },
};

const COUNTRY_LABELS = {
  us: 'United States',
  uk: 'United Kingdom',
  eu: 'European Union',
  canada: 'Canada',
  australia: 'Australia',
};

const COUNTRY_FLAGS = {
  us: '🇺🇸',
  uk: '🇬🇧',
  eu: '🇪🇺',
  canada: '🇨🇦',
  australia: '🇦🇺',
};

function isSanctioned(value) {
  if (!value) return false;
  const lower = String(value).toLowerCase();
  return lower.startsWith('yes') || lower.includes('designated') || lower.includes('sanctioned');
}

function getOfficialSanctions(official) {
  const result = {};
  SANCTIONING_COUNTRIES.forEach((c) => {
    result[c] = isSanctioned(official[`${c}_sanctions`]);
  });
  return result;
}

function countSanctions(sanctions) {
  return Object.values(sanctions).filter(Boolean).length;
}

function classifyCoverage(count) {
  if (count >= 5) return 'Full';
  if (count >= 3) return 'Strong';
  if (count >= 1) return 'Partial';
  return 'Gap';
}

// ── Clipboard ─────────────────────────────────────────

function buildClipboardText(officials, coverageFilter) {
  const lines = [];
  const label = coverageFilter || 'All';
  lines.push(`SANCTION IMPACT ANALYSIS — ${label}`);
  lines.push('='.repeat(55));
  lines.push(`Officials analysed: ${officials.length}`);
  lines.push('');
  officials.forEach((o) => {
    const sanctionedBy = SANCTIONING_COUNTRIES.filter((c) => o.sanctions[c]);
    lines.push(`[${o.sanctionCount}/5] ${o.name} — ${o.position || 'Unknown position'}`);
    if (sanctionedBy.length > 0) {
      lines.push(`  Sanctioned by: ${sanctionedBy.map((c) => COUNTRY_LABELS[c]).join(', ')}`);
    }
    const missing = SANCTIONING_COUNTRIES.filter((c) => !o.sanctions[c]);
    if (missing.length > 0 && missing.length < 5) {
      lines.push(`  NOT sanctioned by: ${missing.map((c) => COUNTRY_LABELS[c]).join(', ')}`);
    }
    if (o.key_abuses) lines.push(`  Key abuses: ${o.key_abuses}`);
    lines.push('');
  });
  lines.push('Source: Global Anti-CCP Resistance Hub — verified Tier 1-2 sources');
  lines.push('License: CC BY 4.0');
  return lines.join('\n');
}

// ── Component ─────────────────────────────────────────

export default function SanctionImpactAnalyzer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [coverageFilter, setCoverageFilter] = useState('');
  const [expandedOfficial, setExpandedOfficial] = useState('');
  const [copied, setCopied] = useState(false);

  // ── Data enrichment ───────────────────────────────
  const enrichedOfficials = useMemo(() => {
    const officials = dataApi.getSanctionedOfficials();
    return officials
      .map((o) => {
        const sanctions = getOfficialSanctions(o);
        const sanctionCount = countSanctions(sanctions);
        return {
          ...o,
          sanctions,
          sanctionCount,
          coverageCategory: classifyCoverage(sanctionCount),
        };
      })
      .sort((a, b) => b.sanctionCount - a.sanctionCount || (a.name || '').localeCompare(b.name || ''));
  }, []);

  const totalSanctions = useMemo(
    () => dataApi.getSanctions().length,
    []
  );

  // ── Filtering ─────────────────────────────────────
  const filteredOfficials = useMemo(() => {
    let list = enrichedOfficials;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          (o.name || '').toLowerCase().includes(q) ||
          (o.position || '').toLowerCase().includes(q) ||
          (o.responsibility_area || '').toLowerCase().includes(q)
      );
    }
    if (coverageFilter) {
      list = list.filter((o) => o.coverageCategory === coverageFilter);
    }
    return list;
  }, [enrichedOfficials, searchQuery, coverageFilter]);

  // ── Coverage counts ───────────────────────────────
  const coverageCounts = useMemo(() => {
    const counts = { Full: 0, Strong: 0, Partial: 0, Gap: 0 };
    enrichedOfficials.forEach((o) => {
      counts[o.coverageCategory] = (counts[o.coverageCategory] || 0) + 1;
    });
    return counts;
  }, [enrichedOfficials]);

  // ── Country breakdown ─────────────────────────────
  const countryBreakdown = useMemo(() => {
    const counts = {};
    SANCTIONING_COUNTRIES.forEach((c) => {
      counts[c] = enrichedOfficials.filter((o) => o.sanctions[c]).length;
    });
    return counts;
  }, [enrichedOfficials]);

  // ── Handlers ──────────────────────────────────────
  const handleToggle = (name) => {
    setExpandedOfficial((prev) => (prev === name ? '' : name));
  };

  const handleCopy = async () => {
    const text = buildClipboardText(filteredOfficials, coverageFilter);
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

  const handleCoverageFilter = (coverage) => {
    setCoverageFilter((prev) => (prev === coverage ? '' : coverage));
  };

  // ── Render ────────────────────────────────────────
  return (
    <section
      className="bg-[#0a0e14] border border-[#1c2a35] rounded font-mono"
      aria-label="Sanction Impact Analyzer"
    >
      {/* Header */}
      <div className="border-b border-[#1c2a35] p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-[#4afa82]" aria-hidden="true" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            Sanction Impact Analyzer
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          Cross-dataset analysis of {enrichedOfficials.length} sanctioned officials across {totalSanctions} sanctions from 5 countries
        </p>
      </div>

      {/* Summary Stats */}
      <div className="border-b border-[#1c2a35] p-4 sm:p-6">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{enrichedOfficials.length}</div>
            <div className="text-xs text-slate-400">Officials</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{totalSanctions}</div>
            <div className="text-xs text-slate-400">Sanctions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">5</div>
            <div className="text-xs text-slate-400">Countries</div>
          </div>
        </div>

        {/* Country breakdown bar */}
        <div className="space-y-2">
          <div className="text-xs text-slate-400 mb-2">Officials sanctioned per country</div>
          {SANCTIONING_COUNTRIES.map((c) => {
            const count = countryBreakdown[c];
            const pct = enrichedOfficials.length > 0
              ? Math.round((count / enrichedOfficials.length) * 100)
              : 0;
            return (
              <div key={c} className="flex items-center gap-2">
                <span className="w-5 text-center" aria-hidden="true">{COUNTRY_FLAGS[c]}</span>
                <span className="w-16 text-xs text-slate-400 truncate">{COUNTRY_LABELS[c].split(' ')[0]}</span>
                <div className="flex-1 h-2 bg-[#1c2a35] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4afa82] rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-xs text-slate-400 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coverage Filter Buttons */}
      <div className="border-b border-[#1c2a35] p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {COVERAGE_ORDER.map((cov) => {
            const style = COVERAGE_STYLES[cov];
            const isActive = coverageFilter === cov;
            return (
              <button
                key={cov}
                onClick={() => handleCoverageFilter(cov)}
                aria-pressed={isActive}
                className={`rounded border p-2.5 text-center transition-colors cursor-pointer ${
                  isActive
                    ? style.badge
                    : 'border-[#1c2a35] bg-[#0d1117] hover:border-slate-500'
                }`}
              >
                <div className={`text-xl font-bold ${isActive ? '' : 'text-white'}`}>
                  {coverageCounts[cov]}
                </div>
                <div className={`text-xs ${isActive ? '' : 'text-slate-400'}`}>
                  {style.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Search & Copy */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search officials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-[#0d1117] border border-[#1c2a35] rounded text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-[#4afa82]/50"
              aria-label="Search sanctioned officials"
            />
          </div>
          {coverageFilter && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <span className="text-xs text-slate-400">
                Showing: <span className="text-white">{COVERAGE_STYLES[coverageFilter].label}</span>
              </span>
              <button
                onClick={() => setCoverageFilter('')}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Clear
              </button>
            </div>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0d1117] border border-[#1c2a35] rounded text-sm text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
            aria-label={copied ? 'Copied to clipboard' : 'Copy analysis to clipboard'}
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#4afa82]" aria-hidden="true" />
            ) : (
              <Copy className="w-4 h-4" aria-hidden="true" />
            )}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Officials List */}
      <div className="divide-y divide-[#1c2a35]">
        {filteredOfficials.length === 0 ? (
          <div className="p-6 text-center">
            <AlertTriangle className="w-5 h-5 text-slate-500 mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-slate-400">No officials match your search</p>
          </div>
        ) : (
          filteredOfficials.map((official) => {
            const style = COVERAGE_STYLES[official.coverageCategory];
            const isExpanded = expandedOfficial === official.name;
            const unsanctionedCountries = SANCTIONING_COUNTRIES.filter((c) => !official.sanctions[c]);

            return (
              <div key={official.name || official.id}>
                {/* Official Row */}
                <button
                  onClick={() => handleToggle(official.name)}
                  aria-expanded={isExpanded}
                  aria-controls={`official-${(official.name || '').replace(/\s+/g, '-')}`}
                  className="w-full text-left p-4 sm:px-6 hover:bg-[#0d1117] transition-colors flex items-center gap-3"
                >
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium truncate">
                      {official.name}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {official.position || official.responsibility_area || 'CCP Official'}
                    </div>
                  </div>
                  {/* Coverage indicator */}
                  <div className="hidden sm:flex items-center gap-1" aria-label={`Sanctioned by ${official.sanctionCount} of 5 countries`}>
                    {SANCTIONING_COUNTRIES.map((c) => (
                      <span
                        key={c}
                        className={`w-5 h-5 rounded text-center text-[10px] leading-5 ${official.sanctions[c] ? 'bg-[#4afa82]/20 text-[#4afa82]' : 'text-slate-500 bg-[#1c2a35]'}`}
                        title={`${COUNTRY_LABELS[c]}: ${official.sanctions[c] ? 'Sanctioned' : 'Not sanctioned'}`}
                        aria-hidden="true"
                      >
                        {c.toUpperCase().slice(0, 2)}
                      </span>
                    ))}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded border ${style.badge}`}
                  >
                    {official.sanctionCount}/5
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" aria-hidden="true" />
                  )}
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div
                    id={`official-${(official.name || '').replace(/\s+/g, '-')}`}
                    className="px-4 sm:px-6 pb-4 bg-[#0d1117]"
                  >
                    <div className="space-y-3">
                      {/* Position */}
                      {official.position && (
                        <div className="flex gap-3">
                          <Users className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-500" aria-hidden="true" />
                          <div>
                            <div className="text-xs text-slate-400 mb-0.5">Position</div>
                            <div className="text-sm text-slate-300">{official.position}</div>
                          </div>
                        </div>
                      )}

                      {/* Key Abuses */}
                      {official.key_abuses && (
                        <div className="flex gap-3">
                          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-500" aria-hidden="true" />
                          <div>
                            <div className="text-xs text-slate-400 mb-0.5">Key Abuses</div>
                            <div className="text-sm text-slate-300">{official.key_abuses}</div>
                          </div>
                        </div>
                      )}

                      {/* Sanctions by Country */}
                      <div className="flex gap-3">
                        <Globe className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-500" aria-hidden="true" />
                        <div className="flex-1">
                          <div className="text-xs text-slate-400 mb-1">Sanction Status by Country</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {SANCTIONING_COUNTRIES.map((c) => (
                              <div key={c} className="flex items-center gap-2 text-sm">
                                <span aria-hidden="true">{COUNTRY_FLAGS[c]}</span>
                                <span className="text-slate-400">{COUNTRY_LABELS[c]}</span>
                                {official.sanctions[c] ? (
                                  <span className="text-[#4afa82] text-xs">✓ Sanctioned</span>
                                ) : (
                                  <span className="text-red-400 text-xs">✗ Not sanctioned</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Coverage gap warning */}
                      {unsanctionedCountries.length > 0 && unsanctionedCountries.length < 5 && (
                        <div className="mt-2 p-2.5 bg-red-900/10 border border-red-400/20 rounded">
                          <div className="text-xs text-red-400 font-medium mb-1">
                            Advocacy Opportunity
                          </div>
                          <div className="text-xs text-slate-400">
                            {official.name} is not yet sanctioned by{' '}
                            {unsanctionedCountries
                              .map((c) => COUNTRY_LABELS[c])
                              .join(', ')}
                            . Contact representatives to close this gap.
                          </div>
                        </div>
                      )}

                      {/* Current Status */}
                      {official.current_status && (
                        <div className="mt-2 pt-2 border-t border-[#1c2a35]">
                          <div className="text-xs text-slate-400 mb-0.5">Current Status</div>
                          <div className="text-sm text-slate-300">{official.current_status}</div>
                        </div>
                      )}

                      {/* Source */}
                      {official.source_url && (
                        <div className="mt-2 pt-2 border-t border-[#1c2a35]">
                          <a
                            href={official.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#4afa82] hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                            Source
                          </a>
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

      {/* Footer */}
      <div className="border-t border-[#1c2a35] p-4 sm:p-6">
        <p className="text-xs text-slate-400">
          Cross-references sanctioned_officials and sanctions_tracker datasets.
          Sanction status derived from per-country fields in verified research data.
          {' '}
          <span className="text-slate-400">
            {filteredOfficials.length} of {enrichedOfficials.length} officials shown.
          </span>
        </p>
      </div>
    </section>
  );
}
