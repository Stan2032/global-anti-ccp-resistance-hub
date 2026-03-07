import { useState, useMemo } from 'react';
import { dataApi } from '../services/dataApi';
import {
  MapPin,
  Search,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
  Filter,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  ShieldX,
  Globe,
} from 'lucide-react';

/**
 * OverseasPoliceStationTracker — Interactive tracker of CCP overseas
 * police service stations operating in foreign countries.
 *
 * Uses dataApi.getPoliceStations() to display:
 *   - 30 documented stations across 27 countries
 *   - Filter by status (Closed/Under Investigation/Operating/Unknown)
 *   - Search by country, city, government response
 *   - Expandable station cards with government response, arrest details
 *   - Status summary bar with counts
 *   - Copy-to-clipboard summary
 *
 * All data sourced from verified JSON via dataApi.
 * No external dependencies. No user tracking. Privacy-respecting.
 */

// ── Status config ─────────────────────────────────────

const STATUS_CONFIG = {
  CLOSED: {
    label: 'Closed',
    color: 'text-[#4afa82]',
    bgBadge: 'bg-[#4afa82]/20 text-[#4afa82] border-[#4afa82]/30',
    barColor: 'bg-[#4afa82]',
    Icon: ShieldCheck,
  },
  'UNDER INVESTIGATION': {
    label: 'Under Investigation',
    color: 'text-yellow-400',
    bgBadge: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
    barColor: 'bg-yellow-400',
    Icon: ShieldQuestion,
  },
  OPERATING: {
    label: 'Operating',
    color: 'text-red-400',
    bgBadge: 'bg-red-400/20 text-red-400 border-red-400/30',
    barColor: 'bg-red-400',
    Icon: ShieldX,
  },
  UNKNOWN: {
    label: 'Unknown',
    color: 'text-slate-400',
    bgBadge: 'bg-slate-400/20 text-slate-400 border-slate-400/30',
    barColor: 'bg-slate-400',
    Icon: ShieldAlert,
  },
};

function getStatusConfig(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.UNKNOWN;
}

// ── Clipboard ─────────────────────────────────────────

function buildClipboardText(stations, statusFilter) {
  const lines = [];
  const label = statusFilter || 'All';
  lines.push(`CCP OVERSEAS POLICE STATIONS — ${label}`);
  lines.push('='.repeat(55));
  lines.push(`Stations: ${stations.length}`);
  lines.push('');
  stations.forEach((s) => {
    lines.push(`${s.country} — ${s.city}`);
    lines.push(`  Status: ${s.status}`);
    if (s.closure_date && s.closure_date !== 'N/A') lines.push(`  Closed: ${s.closure_date}`);
    if (s.government_response) lines.push(`  Govt Response: ${s.government_response.slice(0, 120)}...`);
    if (s.linked_to && s.linked_to !== 'Unknown') lines.push(`  Linked to: ${s.linked_to}`);
    lines.push('');
  });
  lines.push('Source: Global Anti-CCP Resistance Hub — verified Tier 1-2 sources');
  lines.push('License: CC BY 4.0');
  return lines.join('\n');
}

// ── Component ─────────────────────────────────────────

export default function OverseasPoliceStationTracker() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedStation, setExpandedStation] = useState('');
  const [copied, setCopied] = useState(false);

  // ── Data ────────────────────────────────────────────
  const stations = useMemo(() => dataApi.getPoliceStations(), []);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts = {};
    Object.keys(STATUS_CONFIG).forEach((k) => { counts[k] = 0; });
    stations.forEach((s) => {
      const key = s.status || 'UNKNOWN';
      if (counts[key] !== undefined) counts[key]++;
      else counts.UNKNOWN++;
    });
    return counts;
  }, [stations]);

  // Country count
  const countryCount = useMemo(() => {
    const countries = new Set();
    stations.forEach((s) => { if (s.country) countries.add(s.country); });
    return countries.size;
  }, [stations]);

  // Filtered list
  const filteredStations = useMemo(() => {
    let list = stations;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          (s.country || '').toLowerCase().includes(q) ||
          (s.city || '').toLowerCase().includes(q) ||
          (s.government_response || '').toLowerCase().includes(q) ||
          (s.linked_to || '').toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      list = list.filter((s) => s.status === statusFilter);
    }
    return list;
  }, [stations, searchQuery, statusFilter]);

  // ── Handlers ────────────────────────────────────────
  const handleToggle = (id) => {
    setExpandedStation((prev) => (prev === id ? '' : id));
  };

  const handleCopy = async () => {
    const text = buildClipboardText(filteredStations, statusFilter);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* fallback for older browsers */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusFilter = (key) => {
    setStatusFilter((prev) => (prev === key ? '' : key));
  };

  // ── Render ──────────────────────────────────────────
  return (
    <section
      className="bg-[#0a0e14] border border-[#1c2a35] rounded font-mono"
      aria-label="Overseas Police Station Tracker"
    >
      {/* Header */}
      <div className="border-b border-[#1c2a35] p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-5 h-5 text-red-400" aria-hidden="true" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            CCP Overseas Police Stations
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          {stations.length} documented stations across {countryCount} countries — transnational repression infrastructure
        </p>
      </div>

      {/* Summary Stats */}
      <div className="border-b border-[#1c2a35] p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const count = statusCounts[key] || 0;
            if (count === 0) return null;
            return (
              <button
                key={key}
                onClick={() => handleStatusFilter(key)}
                aria-pressed={statusFilter === key}
                className={`p-3 rounded border text-left transition-colors cursor-pointer ${
                  statusFilter === key
                    ? cfg.bgBadge
                    : 'border-[#1c2a35] hover:border-slate-500'
                }`}
              >
                <div className={`text-2xl font-bold ${cfg.color}`}>{count}</div>
                <div className="text-xs text-slate-400">{cfg.label}</div>
              </button>
            );
          })}
        </div>

        {/* Status bar */}
        <div className="flex h-2 rounded overflow-hidden bg-[#1c2a35]" aria-label="Status distribution">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const pct = stations.length > 0 ? (statusCounts[key] / stations.length) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div
                key={key}
                className={`${cfg.barColor} transition-all`}
                style={{ width: `${pct}%` }}
                title={`${cfg.label}: ${statusCounts[key]}`}
              />
            );
          })}
        </div>
      </div>

      {/* Search + Filter Controls */}
      <div className="border-b border-[#1c2a35] p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search by country, city, response..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-[#0d1117] border border-[#1c2a35] rounded text-sm text-slate-300 placeholder:text-slate-400 focus:outline-none focus:border-[#4afa82]/50"
              aria-label="Search police stations"
            />
          </div>
          {statusFilter && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <span className="text-xs text-slate-400">
                Showing: <span className="text-white">{STATUS_CONFIG[statusFilter]?.label}</span>
              </span>
              <button
                onClick={() => setStatusFilter('')}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Clear
              </button>
            </div>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0d1117] border border-[#1c2a35] rounded text-sm text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
            aria-label={copied ? 'Copied to clipboard' : 'Copy station data to clipboard'}
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

      {/* Station List */}
      <div className="divide-y divide-[#1c2a35]">
        {filteredStations.length === 0 ? (
          <div className="p-6 text-center">
            <MapPin className="w-5 h-5 text-slate-500 mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-slate-400">No stations match your search</p>
          </div>
        ) : (
          filteredStations.map((station) => {
            const isExpanded = expandedStation === station.id;
            const statusCfg = getStatusConfig(station.status);
            const StatusIcon = statusCfg.Icon;

            return (
              <div key={station.id}>
                {/* Station Row */}
                <button
                  onClick={() => handleToggle(station.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`station-${station.id}`}
                  className="w-full text-left p-4 sm:px-6 hover:bg-[#0d1117] transition-colors flex items-center gap-3"
                >
                  <StatusIcon
                    className={`w-4 h-4 flex-shrink-0 ${statusCfg.color}`}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium truncate">
                      {station.country}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {station.city}
                      {station.linked_to && station.linked_to !== 'Unknown' ? ` · Linked to ${station.linked_to}` : ''}
                    </div>
                  </div>
                  {/* Status Badge */}
                  <span className={`hidden sm:inline-block text-xs px-2 py-0.5 rounded border ${statusCfg.bgBadge}`}>
                    {statusCfg.label}
                  </span>
                  {station.arrests_made === 'Yes' && (
                    <AlertTriangle
                      className="w-4 h-4 text-red-400 flex-shrink-0"
                      aria-label="Arrests made"
                    />
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
                    id={`station-${station.id}`}
                    className="px-4 sm:px-6 pb-4 bg-[#0d1117]"
                  >
                    <div className="space-y-3">
                      {/* Status + Location */}
                      <div className="flex flex-wrap gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded border ${statusCfg.bgBadge}`}>
                          {statusCfg.label}
                        </span>
                        {station.closure_date && station.closure_date !== 'N/A' && (
                          <span className="text-xs px-2 py-0.5 rounded border border-[#1c2a35] text-slate-400">
                            Closed: {station.closure_date}
                          </span>
                        )}
                        {station.arrests_made === 'Yes' && (
                          <span className="text-xs px-2 py-0.5 rounded border border-red-400/30 text-red-400 bg-red-400/10">
                            Arrests made
                          </span>
                        )}
                        {station.linked_to && station.linked_to !== 'Unknown' && (
                          <span className="text-xs px-2 py-0.5 rounded border border-[#1c2a35] text-slate-400">
                            Linked to: {station.linked_to}
                          </span>
                        )}
                      </div>

                      {/* Address */}
                      {station.address && station.address !== 'Unknown' && (
                        <div>
                          <div className="text-xs text-slate-400 mb-0.5">Address</div>
                          <div className="text-sm text-slate-300 leading-relaxed">
                            {station.address}
                          </div>
                        </div>
                      )}

                      {/* Government Response */}
                      {station.government_response && (
                        <div>
                          <div className="text-xs text-slate-400 mb-0.5">Government Response</div>
                          <div className="text-sm text-slate-300 leading-relaxed">
                            {station.government_response}
                          </div>
                        </div>
                      )}

                      {/* Arrest Details */}
                      {station.arrest_details && station.arrest_details !== 'N/A' && (
                        <div>
                          <div className="text-xs text-slate-400 mb-0.5">Arrest Details</div>
                          <div className="text-sm text-slate-300 leading-relaxed">
                            {station.arrest_details}
                          </div>
                        </div>
                      )}

                      {/* Latest News */}
                      {station.latest_news && (
                        <div>
                          <div className="text-xs text-slate-400 mb-0.5">Latest News</div>
                          <div className="text-sm text-slate-300 leading-relaxed">
                            {station.latest_news}
                          </div>
                        </div>
                      )}

                      {/* Source Link */}
                      <div className="flex flex-wrap gap-3 pt-2 border-t border-[#1c2a35]">
                        {station.source_url && (
                          <a
                            href={station.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#4afa82] hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                            Source
                          </a>
                        )}
                      </div>
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
          Data sourced from Safeguard Defenders, government statements, and investigative journalism (Tier 1-2 sources).
          CCP overseas police stations are used for transnational repression — harassing, threatening, and coercing Chinese
          nationals abroad to return to China.
          {' '}
          <span className="text-slate-400">
            {filteredStations.length} of {stations.length} stations shown.
          </span>
        </p>
      </div>
    </section>
  );
}
