// @ts-nocheck


/**
 * InternationalResponseTracker — Monitors international governmental and
 * institutional responses to CCP human rights abuses. Tracks resolutions,
 * statements, and policy actions.
 *
 * @module InternationalResponseTracker
 */
import { useState, useMemo } from 'react';
import { dataApi } from '../services/dataApi';
import {
  Globe,
  Search,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Shield,
  Scale,
  Landmark,
  Handshake,
  FileText,
  ExternalLink,
  Filter,
} from 'lucide-react';

/**
 * InternationalResponseTracker — Visualises how 30 countries have
 * responded to CCP human rights violations across five dimensions:
 *   genocide recognition, sanctions, legislation, diplomacy, pending proposals.
 *
 * All data sourced from verified JSON via dataApi.
 * No external dependencies. No user tracking. Privacy-respecting.
 */

// ── Stance classification ─────────────────────────────

const STANCE_ORDER = ['Strong', 'Moderate', 'Limited', 'Weak'];

const STANCE_STYLES = {
  Strong: {
    badge: 'bg-[#4afa82]/20 text-[#4afa82] border-[#4afa82]/30',
    dot: 'bg-[#4afa82]',
    bar: 'bg-[#4afa82]',
    width: 'w-full',
  },
  Moderate: {
    badge: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
    dot: 'bg-yellow-400',
    bar: 'bg-yellow-400',
    width: 'w-2/3',
  },
  Limited: {
    badge: 'bg-orange-400/20 text-orange-400 border-orange-400/30',
    dot: 'bg-orange-400',
    bar: 'bg-orange-400',
    width: 'w-1/3',
  },
  Weak: {
    badge: 'bg-red-400/20 text-red-400 border-red-400/30',
    dot: 'bg-red-400',
    bar: 'bg-red-400',
    width: 'w-1/6',
  },
};

function classifyStance(overallStance) {
  if (!overallStance) return 'Weak';
  const lower = overallStance.toLowerCase();
  if (lower.startsWith('strong')) return 'Strong';
  if (lower.startsWith('moderate') || lower.startsWith('active')) return 'Moderate';
  if (lower.startsWith('limited') || lower.startsWith('cautious') || lower.startsWith('growing')) return 'Limited';
  return 'Weak';
}

// ── Dimension icons & labels ──────────────────────────

const DIMENSIONS = [
  { key: 'genocide_recognition', label: 'Genocide Recognition', Icon: Scale },
  { key: 'sanctions_imposed', label: 'Sanctions Imposed', Icon: Shield },
  { key: 'legislative_actions', label: 'Legislative Actions', Icon: Landmark },
  { key: 'diplomatic_actions', label: 'Diplomatic Actions', Icon: Handshake },
  { key: 'pending_proposals', label: 'Pending Proposals', Icon: FileText },
];

// ── Clipboard ─────────────────────────────────────────

function buildClipboardText(responses, stanceFilter) {
  const lines = [];
  const label = stanceFilter || 'All';
  lines.push(`INTERNATIONAL RESPONSES TO CCP VIOLATIONS — ${label}`);
  lines.push('='.repeat(55));
  lines.push(`Total countries: ${responses.length}`);
  lines.push('');
  responses.forEach((r) => {
    lines.push(`[${classifyStance(r.overall_stance)}] ${r.country}`);
    lines.push(`  Genocide Recognition: ${r.genocide_recognition || 'N/A'}`);
    lines.push(`  Sanctions: ${r.sanctions_imposed || 'N/A'}`);
    lines.push(`  Legislation: ${r.legislative_actions || 'N/A'}`);
    lines.push(`  Diplomacy: ${r.diplomatic_actions || 'N/A'}`);
    if (r.pending_proposals) lines.push(`  Pending: ${r.pending_proposals}`);
    lines.push('');
  });
  lines.push('Source: Global Anti-CCP Resistance Hub — verified Tier 1-2 sources');
  return lines.join('\n');
}

// ── Component ─────────────────────────────────────────

export default function InternationalResponseTracker() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stanceFilter, setStanceFilter] = useState('');
  const [expandedCountry, setExpandedCountry] = useState('');
  const [copied, setCopied] = useState(false);

  const responses = useMemo(() => {
    const data = dataApi.getInternationalResponses();
    return [...data].sort((a, b) =>
      (a.country || '').localeCompare(b.country || '')
    );
  }, []);

  const enrichedResponses = useMemo(
    () =>
      responses.map((r) => ({
        ...r,
        stanceCategory: classifyStance(r.overall_stance),
      })),
    [responses]
  );

  const filteredResponses = useMemo(() => {
    let list = enrichedResponses;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) =>
        (r.country || '').toLowerCase().includes(q)
      );
    }
    if (stanceFilter) {
      list = list.filter((r) => r.stanceCategory === stanceFilter);
    }
    return list;
  }, [enrichedResponses, searchQuery, stanceFilter]);

  const stanceCounts = useMemo(() => {
    const counts = { Strong: 0, Moderate: 0, Limited: 0, Weak: 0 };
    enrichedResponses.forEach((r) => {
      counts[r.stanceCategory] = (counts[r.stanceCategory] || 0) + 1;
    });
    return counts;
  }, [enrichedResponses]);

  const handleToggle = (country) => {
    setExpandedCountry((prev) => (prev === country ? '' : country));
  };

  const handleCopy = async () => {
    const text = buildClipboardText(filteredResponses, stanceFilter);
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

  const handleStanceFilter = (stance) => {
    setStanceFilter((prev) => (prev === stance ? '' : stance));
  };

  return (
    <section
      className="bg-[#0a0e14] border border-[#1c2a35] rounded font-mono"
      aria-label="International Response Tracker"
    >
      {/* Header */}
      <div className="border-b border-[#1c2a35] p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-5 h-5 text-[#4afa82]" aria-hidden="true" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            International Response Tracker
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          How {responses.length} countries have responded to CCP human rights violations
        </p>
      </div>

      {/* Summary Bar */}
      <div className="border-b border-[#1c2a35] p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STANCE_ORDER.map((stance) => {
            const style = STANCE_STYLES[stance];
            const isActive = stanceFilter === stance;
            return (
              <button
                key={stance}
                onClick={() => handleStanceFilter(stance)}
                aria-pressed={isActive}
                className={`rounded border p-3 text-center transition-colors cursor-pointer ${
                  isActive
                    ? style.badge
                    : 'border-[#1c2a35] bg-[#0d1117] hover:border-slate-600'
                }`}
              >
                <div className={`text-2xl font-bold ${isActive ? '' : 'text-white'}`}>
                  {stanceCounts[stance]}
                </div>
                <div className={`text-xs ${isActive ? '' : 'text-slate-400'}`}>
                  {stance}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="border-b border-[#1c2a35] p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search countries…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-[#0d1117] border border-[#1c2a35] rounded text-sm text-slate-300 placeholder:text-slate-400 focus:border-[#4afa82] focus:outline-none"
              aria-label="Search countries"
            />
          </div>
          {/* Filter indicator */}
          {stanceFilter && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <span className="text-xs text-slate-400">
                Showing: <span className="text-white">{stanceFilter}</span>
              </span>
              <button
                onClick={() => setStanceFilter('')}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Clear
              </button>
            </div>
          )}
          {/* Copy */}
          <button
            onClick={handleCopy}
            disabled={filteredResponses.length === 0}
            className="flex items-center gap-2 px-3 py-2 border border-[#1c2a35] rounded text-sm text-slate-400 hover:text-white hover:border-slate-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
      </div>

      {/* Country List */}
      <div className="divide-y divide-[#1c2a35]">
        {filteredResponses.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-400">
            No countries match your search
          </div>
        ) : (
          filteredResponses.map((response) => {
            const style = STANCE_STYLES[response.stanceCategory];
            const isExpanded = expandedCountry === response.country;

            return (
              <div key={response.country || response.id}>
                {/* Country Row */}
                <button
                  onClick={() => handleToggle(response.country)}
                  className="w-full text-left p-4 sm:px-6 flex items-center gap-3 hover:bg-[#0d1117] transition-colors"
                  aria-expanded={isExpanded}
                  aria-controls={`details-${response.country}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-sm text-white font-medium">
                    {response.country}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded border ${style.badge}`}
                  >
                    {response.stanceCategory}
                  </span>
                  {/* Strength bar */}
                  <div className="hidden sm:block w-20 h-1.5 bg-[#1c2a35] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${style.bar} ${style.width}`}
                    />
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" aria-hidden="true" />
                  )}
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div
                    id={`details-${response.country}`}
                    className="px-4 sm:px-6 pb-4 bg-[#0d1117]"
                  >
                    <div className="space-y-3">
                      {DIMENSIONS.map(({ key, label, Icon }) => {
                        const value = response[key];
                        if (!value) return null;
                        return (
                          <div key={key} className="flex gap-3">
                            <Icon
                              className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-500"
                              aria-hidden="true"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-slate-400 mb-0.5">
                                {label}
                              </div>
                              <div className="text-sm text-slate-300 leading-relaxed">
                                {value}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {/* Overall Stance */}
                      {response.overall_stance && (
                        <div className="mt-2 pt-2 border-t border-[#1c2a35]">
                          <div className="text-xs text-slate-400 mb-1">Overall Assessment</div>
                          <div className="text-sm text-slate-300 leading-relaxed">
                            {response.overall_stance}
                          </div>
                        </div>
                      )}
                      {/* Source */}
                      {response.source_url && (
                        <div className="mt-2 pt-2 border-t border-[#1c2a35]">
                          <a
                            href={response.source_url}
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
          Data compiled from government records, legislative databases, and Tier 1-2 news sources.
          {' '}
          <span className="text-slate-400">
            {filteredResponses.length} of {responses.length} countries shown.
          </span>
        </p>
      </div>
    </section>
  );
}
