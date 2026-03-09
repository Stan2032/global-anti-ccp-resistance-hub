// @ts-nocheck — Phase 2 migration: types to be added

/**
 * TransnationalRepressionTracker — Documents CCP transnational repression
 * tactics including harassment, intimidation, and coercion of diaspora
 * communities worldwide.
 *
 * @module TransnationalRepressionTracker
 */
import { useState, useMemo } from 'react';
import { dataApi } from '../services/dataApi';
import { Globe, Shield, AlertTriangle, Search, ChevronDown, ChevronUp, ExternalLink, Copy, Check, MapPin, Scale, Eye, Users, Lock } from 'lucide-react';
// TransnationalRepressionTracker — Cross-references police stations, legal cases,
// and international responses to map CCP transnational repression globally.
// All data from verified Tier 1-2 sources via dataApi. CC BY 4.0.

const THREAT_LEVELS = [
  { id: 'critical', label: 'Critical', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', dot: 'bg-red-400' },
  { id: 'high', label: 'High', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30', dot: 'bg-orange-400' },
  { id: 'moderate', label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', dot: 'bg-yellow-400' },
  { id: 'low', label: 'Low', color: 'text-[#4afa82]', bg: 'bg-[#4afa82]/10', border: 'border-[#4afa82]/30', dot: 'bg-[#4afa82]' },
];
const OPERATION_TYPES = [
  { id: 'police-station', label: 'Overseas Police Stations', icon: MapPin },
  { id: 'fox-hunt', label: 'Fox Hunt / Sky Net', icon: Eye },
  { id: 'legal-prosecution', label: 'Extraterritorial Prosecution', icon: Scale },
  { id: 'harassment', label: 'Harassment & Intimidation', icon: AlertTriangle },
];
const RESPONSE_STATUSES = [
  { id: 'enforcement', label: 'Enforcement Action', color: 'text-[#4afa82]' },
  { id: 'investigation', label: 'Under Investigation', color: 'text-yellow-400' },
  { id: 'acknowledged', label: 'Acknowledged', color: 'text-orange-400' },
  { id: 'no-action', label: 'No Known Action', color: 'text-red-400' },
];
function classifyThreatLevel(countryData) {
  const { stations, cases, response } = countryData;
  const activeStations = stations.filter(s => s.status === 'ACTIVE').length;
  const investigatingStations = stations.filter(s => s.status === 'UNDER INVESTIGATION').length;
  const arrests = stations.filter(s => (s.arrests_made || '').toLowerCase() === 'yes').length;
  const hasStrongResponse = response && (response.overall_stance || '').toUpperCase() === 'STRONG';
  const hasSanctions = response && response.sanctions_imposed && response.sanctions_imposed !== 'None' && response.sanctions_imposed !== 'N/A';

  if (activeStations > 0 && !hasStrongResponse) return 'critical';
  if (investigatingStations > 0 || (activeStations > 0 && hasStrongResponse)) return 'high';
  if (cases.length > 0 || arrests > 0 || hasSanctions) return 'moderate';
  return 'low';
}
function classifyResponse(countryData) {
  const { stations, response } = countryData;
  const closedStations = stations.filter(s => s.status === 'CLOSED').length;
  const arrests = stations.filter(s => (s.arrests_made || '').toLowerCase() === 'yes').length;

  if (arrests > 0 || closedStations > 0) return 'enforcement';
  if (stations.some(s => s.status === 'UNDER INVESTIGATION')) return 'investigation';
  if (response && response.overall_stance && response.overall_stance !== 'NONE') return 'acknowledged';
  return 'no-action';
}
function buildCountryProfiles(stations, cases, responses) {
  const countryMap = {};
  // Aggregate police stations by country
  stations.forEach(s => {
    const country = s.country;
    if (!countryMap[country]) {
      countryMap[country] = { country, stations: [], cases: [], response: null, operations: [] };
    }
    countryMap[country].stations.push(s);
    countryMap[country].operations.push({
      type: 'police-station',
      detail: `${s.city} — ${s.status}`,
      status: s.status,
      date: s.closure_date || 'Ongoing',
      source: s.source_url,
    });
  });
  // Match legal cases to countries (transnational ones)
  const transnationalJurisdictions = cases.filter(c => {
    const j = (c.jurisdiction || '').toLowerCase();
    return !j.includes('hong kong') && !j.includes('china');
  });
  transnationalJurisdictions.forEach(c => {
    const country = c.jurisdiction.replace(/\s*\(.*\)/, '');
    if (!countryMap[country]) {
      countryMap[country] = { country, stations: [], cases: [], response: null, operations: [] };
    }
    countryMap[country].cases.push(c);
    countryMap[country].operations.push({
      type: c.charges && c.charges.toLowerCase().includes('fox hunt') ? 'fox-hunt' : 'legal-prosecution',
      detail: `${c.case_name} — ${c.status}`,
      status: c.status,
      date: (c.key_dates && (c.key_dates.verdict_date || c.key_dates.charge_date)) || 'Pending',
      source: c.source_url,
    });
  });
  // Match international responses to countries
  responses.forEach(r => { if (countryMap[r.country]) countryMap[r.country].response = r; });
  const profiles = Object.values(countryMap).map(cd => ({
    ...cd, threatLevel: classifyThreatLevel(cd), responseStatus: classifyResponse(cd), operationCount: cd.operations.length,
  }));
  const levelOrder = { critical: 0, high: 1, moderate: 2, low: 3 };
  profiles.sort((a, b) => levelOrder[a.threatLevel] - levelOrder[b.threatLevel] || b.operationCount - a.operationCount);
  return profiles;
}
const TransnationalRepressionTracker = () => {
  const [activeView, setActiveView] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [threatFilter, setThreatFilter] = useState('all');
  const [responseFilter, setResponseFilter] = useState('all');
  const [expandedCountry, setExpandedCountry] = useState(null);
  const [copied, setCopied] = useState(false);
  const stations = useMemo(() => dataApi.getPoliceStations(), []);
  const cases = useMemo(() => dataApi.getLegalCases(), []);
  const responses = useMemo(() => dataApi.getInternationalResponses(), []);
  const countryProfiles = useMemo(
    () => buildCountryProfiles(stations, cases, responses),
    [stations, cases, responses]
  );
  const filtered = useMemo(() => {
    return countryProfiles.filter(cp => {
      const matchesSearch = !searchQuery ||
        [cp.country, ...cp.stations.map(s => s.city), ...cp.cases.map(c => c.case_name)]
          .join(' ').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesThreat = threatFilter === 'all' || cp.threatLevel === threatFilter;
      const matchesResponse = responseFilter === 'all' || cp.responseStatus === responseFilter;
      return matchesSearch && matchesThreat && matchesResponse;
    });
  }, [countryProfiles, searchQuery, threatFilter, responseFilter]);
  const stats = useMemo(() => {
    const totalCountries = countryProfiles.length;
    const totalOps = countryProfiles.reduce((sum, cp) => sum + cp.operationCount, 0);
    const activeStations = stations.filter(s => s.status === 'ACTIVE').length;
    const closedStations = stations.filter(s => s.status === 'CLOSED').length;
    const arrestsMade = stations.filter(s => (s.arrests_made || '').toLowerCase() === 'yes').length;
    const enforcementCountries = countryProfiles.filter(cp => cp.responseStatus === 'enforcement').length;
    return { totalCountries, totalOps, activeStations, closedStations, arrestsMade, enforcementCountries };
  }, [countryProfiles, stations]);
  const threatDistribution = useMemo(() => {
    return THREAT_LEVELS.map(tl => ({
      ...tl,
      count: countryProfiles.filter(cp => cp.threatLevel === tl.id).length,
    }));
  }, [countryProfiles]);

  const handleCopyReport = async () => {
    const lines = [
      '═══ TRANSNATIONAL REPRESSION TRACKER — INTELLIGENCE REPORT ═══',
      `Generated: ${new Date().toISOString().split('T')[0]}`,
      `Countries affected: ${stats.totalCountries}`,
      `Total operations tracked: ${stats.totalOps}`,
      `Active police stations: ${stats.activeStations}`,
      `Stations closed: ${stats.closedStations}`,
      `Arrests made: ${stats.arrestsMade}`,
      `Countries with enforcement action: ${stats.enforcementCountries}`,
      '',
      '── THREAT ASSESSMENT BY COUNTRY ──',
      ...countryProfiles.map(cp =>
        `[${cp.threatLevel.toUpperCase()}] ${cp.country}: ${cp.operationCount} operations — Response: ${cp.responseStatus}`
      ),
      '',
      '── ACTIVE OPERATIONS ──',
      ...countryProfiles.filter(cp => cp.stations.some(s => s.status === 'ACTIVE'))
        .map(cp => `${cp.country}: ${cp.stations.filter(s => s.status === 'ACTIVE').map(s => s.city).join(', ')}`),
      '',
      'Source: Global Anti-CCP Resistance Hub — Tier 1-2 verified data',
      'License: CC BY 4.0',
    ];
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const views = [
    { id: 'overview', label: 'Threat Overview' },
    { id: 'operations', label: 'Operations Map' },
    { id: 'responses', label: 'Government Responses' },
  ];

  const getThreatStyle = (level) => THREAT_LEVELS.find(t => t.id === level) || THREAT_LEVELS[3];
  const getResponseStyle = (status) => RESPONSE_STATUSES.find(r => r.id === status) || RESPONSE_STATUSES[3];

  return (
    <section aria-label="Transnational Repression Tracker" className="bg-[#0a0e14] border border-[#1c2a35] p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Globe className="w-5 h-5 text-red-400" aria-hidden="true" />
            Transnational Repression Tracker
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Cross-referencing {stations.length} police stations, {cases.length} legal cases, and {responses.length} country responses to map CCP operations worldwide
          </p>
        </div>
        <button
          onClick={handleCopyReport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#1c2a35] hover:border-[#22d3ee] text-slate-400 hover:text-[#22d3ee] transition-colors"
          aria-label="Copy intelligence report to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy Report'}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-[#22d3ee]" aria-hidden="true" />
          {stats.totalCountries} countries affected
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
          {stats.activeStations} active stations
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-[#4afa82]" aria-hidden="true" />
          {stats.closedStations} stations closed
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-[#a78bfa]" aria-hidden="true" />
          {stats.arrestsMade} arrests made
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Scale className="w-3.5 h-3.5 text-yellow-400" aria-hidden="true" />
          {stats.enforcementCountries} enforcement actions
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {threatDistribution.map(td => (
          <div key={td.id} className={`${td.bg} border ${td.border} p-3`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${td.dot}`} aria-hidden="true" />
              <span className={`text-xs font-mono uppercase ${td.color}`}>{td.label}</span>
            </div>
            <span className="text-2xl font-bold text-white font-mono">{td.count}</span>
            <span className="text-xs text-slate-400 ml-1">
              {td.count === 1 ? 'country' : 'countries'}
            </span>
          </div>
        ))}
      </div>
      <div className="flex space-x-1" role="group" aria-label="View options">
        {views.map(v => (
          <button
            key={v.id}
            onClick={() => setActiveView(v.id)}
            aria-pressed={activeView === v.id}
            className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
              activeView === v.id
                ? 'border-[#22d3ee] text-[#22d3ee] bg-[#22d3ee]/10'
                : 'border-[#1c2a35] text-slate-400 hover:text-white hover:border-slate-400'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search countries, cities, cases..."
            className="w-full bg-[#0d1117] border border-[#1c2a35] pl-9 pr-3 py-2 text-sm font-mono text-slate-300 placeholder:text-slate-400 focus:border-[#22d3ee] focus:outline-none"
            aria-label="Search transnational repression data"
          />
        </div>
        <select
          value={threatFilter}
          onChange={e => setThreatFilter(e.target.value)}
          className="bg-[#0d1117] border border-[#1c2a35] px-3 py-2 text-sm font-mono text-slate-300 focus:border-[#22d3ee] focus:outline-none"
          aria-label="Filter by threat level"
        >
          <option value="all">All Threat Levels</option>
          {THREAT_LEVELS.map(tl => (
            <option key={tl.id} value={tl.id}>{tl.label}</option>
          ))}
        </select>
        <select
          value={responseFilter}
          onChange={e => setResponseFilter(e.target.value)}
          className="bg-[#0d1117] border border-[#1c2a35] px-3 py-2 text-sm font-mono text-slate-300 focus:border-[#22d3ee] focus:outline-none"
          aria-label="Filter by government response"
        >
          <option value="all">All Responses</option>
          {RESPONSE_STATUSES.map(rs => (
            <option key={rs.id} value={rs.id}>{rs.label}</option>
          ))}
        </select>
      </div>
      {/* OVERVIEW VIEW */}
      {activeView === 'overview' && (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-slate-400 text-sm font-mono py-4 text-center">No countries match your filters</p>
          ) : (
            filtered.map(cp => {
              const threatStyle = getThreatStyle(cp.threatLevel);
              const responseStyle = getResponseStyle(cp.responseStatus);
              const isExpanded = expandedCountry === cp.country;
              return (
                <div key={cp.country} className={`border ${threatStyle.border} ${threatStyle.bg}`}>
                  <button
                    onClick={() => setExpandedCountry(isExpanded ? null : cp.country)}
                    className="w-full flex items-center justify-between p-3 sm:p-4 text-left"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${threatStyle.dot}`} aria-hidden="true" />
                      <div className="min-w-0">
                        <span className="text-white font-mono font-bold text-sm">{cp.country}</span>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <span className={`text-xs font-mono ${threatStyle.color}`}>
                            {threatStyle.label} Threat
                          </span>
                          <span className="text-slate-500 text-xs" aria-hidden="true">•</span>
                          <span className={`text-xs font-mono ${responseStyle.color}`}>
                            {responseStyle.label}
                          </span>
                          <span className="text-slate-500 text-xs" aria-hidden="true">•</span>
                          <span className="text-xs text-slate-400 font-mono">
                            {cp.operationCount} {cp.operationCount === 1 ? 'operation' : 'operations'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-500 w-4 h-4 flex-shrink-0 ml-2">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-[#1c2a35] p-3 sm:p-4 space-y-4">
                      {/* Police Stations */}
                      {cp.stations.length > 0 && (
                        <div>
                          <h4 className="text-xs font-mono text-[#22d3ee] uppercase mb-2 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                            Police Stations ({cp.stations.length})
                          </h4>
                          <div className="space-y-2">
                            {cp.stations.map((s, i) => (
                              <div key={i} className="bg-[#0a0e14] border border-[#1c2a35] p-3">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm text-white font-mono truncate">{s.city}</span>
                                  <span className={`text-xs font-mono px-2 py-0.5 whitespace-nowrap flex-shrink-0 ${
                                    s.status === 'CLOSED' ? 'text-[#4afa82] bg-[#4afa82]/10' :
                                    s.status === 'ACTIVE' ? 'text-red-400 bg-red-400/10' :
                                    'text-yellow-400 bg-yellow-400/10'
                                  }`}>
                                    {s.status}
                                  </span>
                                </div>
                                {s.linked_to && s.linked_to !== 'Unknown' && (
                                  <p className="text-xs text-slate-400 mt-1">Linked to: {s.linked_to}</p>
                                )}
                                {(s.arrests_made || '').toLowerCase() === 'yes' && (
                                  <p className="text-xs text-red-400 mt-1">⚠ Arrests made: {s.arrest_details}</p>
                                )}
                                {s.government_response && (
                                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{s.government_response}</p>
                                )}
                                {s.source_url && (
                                  <a
                                    href={s.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-[#22d3ee] hover:underline mt-1.5"
                                  >
                                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                    Source
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Legal Cases */}
                      {cp.cases.length > 0 && (
                        <div>
                          <h4 className="text-xs font-mono text-[#a78bfa] uppercase mb-2 flex items-center gap-1.5">
                            <Scale className="w-3.5 h-3.5" aria-hidden="true" />
                            Legal Cases ({cp.cases.length})
                          </h4>
                          <div className="space-y-2">
                            {cp.cases.map((c, i) => (
                              <div key={i} className="bg-[#0a0e14] border border-[#1c2a35] p-3">
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-sm text-white font-mono">{c.case_name}</span>
                                  <span className={`text-xs font-mono px-2 py-0.5 whitespace-nowrap flex-shrink-0 ${
                                    c.status === 'CONVICTED' ? 'text-red-400 bg-red-400/10' :
                                    c.status === 'CONCLUDED' ? 'text-[#4afa82] bg-[#4afa82]/10' :
                                    'text-yellow-400 bg-yellow-400/10'
                                  }`}>
                                    {c.status}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{c.charges}</p>
                                {c.significance && (
                                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{c.significance}</p>
                                )}
                                {c.source_url && (
                                  <a
                                    href={c.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-[#22d3ee] hover:underline mt-1.5"
                                  >
                                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                    Source
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* International Response */}
                      {cp.response && (
                        <div>
                          <h4 className="text-xs font-mono text-yellow-400 uppercase mb-2 flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                            International Response
                          </h4>
                          <div className="bg-[#0a0e14] border border-[#1c2a35] p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400 font-mono">Overall Stance:</span>
                              <span className={`text-xs font-mono font-bold ${
                                (cp.response.overall_stance || '').toUpperCase() === 'STRONG' ? 'text-[#4afa82]' :
                                (cp.response.overall_stance || '').toUpperCase() === 'MODERATE' ? 'text-yellow-400' :
                                'text-red-400'
                              }`}>
                                {cp.response.overall_stance}
                              </span>
                            </div>
                            {cp.response.genocide_recognized && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 font-mono">Genocide Recognized:</span>
                                <span className="text-xs text-white font-mono">{cp.response.genocide_recognized}</span>
                              </div>
                            )}
                            {cp.response.sanctions_imposed && cp.response.sanctions_imposed !== 'None' && (
                              <div>
                                <span className="text-xs text-slate-400 font-mono">Sanctions:</span>
                                <p className="text-xs text-slate-300 mt-0.5">{cp.response.sanctions_imposed}</p>
                              </div>
                            )}
                            {cp.response.legislative_actions && cp.response.legislative_actions !== 'None' && (
                              <div>
                                <span className="text-xs text-slate-400 font-mono">Legislative Actions:</span>
                                <p className="text-xs text-slate-300 mt-0.5">{cp.response.legislative_actions}</p>
                              </div>
                            )}
                            {cp.response.source_url && (
                              <a
                                href={cp.response.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-[#22d3ee] hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                Source
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
      {/* OPERATIONS MAP VIEW */}
      {activeView === 'operations' && (
        <div className="space-y-4">
          {OPERATION_TYPES.map(opType => {
            const countriesWithOp = filtered.filter(cp =>
              cp.operations.some(o => o.type === opType.id)
            );
            if (countriesWithOp.length === 0) return null;
            const OpIcon = opType.icon;
            return (
              <div key={opType.id} className="border border-[#1c2a35] bg-[#0d1117]">
                <div className="flex items-center gap-2 p-3 border-b border-[#1c2a35]">
                  <OpIcon className="w-4 h-4 text-[#22d3ee]" aria-hidden="true" />
                  <h4 className="text-sm font-mono text-white font-bold">{opType.label}</h4>
                  <span className="text-xs text-slate-400 font-mono ml-auto">
                    {countriesWithOp.length} {countriesWithOp.length === 1 ? 'country' : 'countries'}
                  </span>
                </div>
                <div className="divide-y divide-[#1c2a35]">
                  {countriesWithOp.map(cp => {
                    const ops = cp.operations.filter(o => o.type === opType.id);
                    const threatStyle = getThreatStyle(cp.threatLevel);
                    return (
                      <div key={cp.country} className="p-3 flex items-start gap-3">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${threatStyle.dot}`} aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <span className="text-sm text-white font-mono">{cp.country}</span>
                          <div className="mt-1 space-y-0.5">
                            {ops.map((o, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="font-mono">{o.detail}</span>
                                {o.source && (
                                  <a
                                    href={o.source}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#22d3ee] hover:underline flex-shrink-0"
                                  >
                                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* GOVERNMENT RESPONSES VIEW */}
      {activeView === 'responses' && (
        <div className="space-y-4">
          {RESPONSE_STATUSES.map(rs => {
            const countriesWithStatus = filtered.filter(cp => cp.responseStatus === rs.id);
            if (countriesWithStatus.length === 0) return null;
            return (
              <div key={rs.id} className="border border-[#1c2a35] bg-[#0d1117]">
                <div className="flex items-center gap-2 p-3 border-b border-[#1c2a35]">
                  <span className={`w-2 h-2 rounded-full ${
                    rs.id === 'enforcement' ? 'bg-[#4afa82]' :
                    rs.id === 'investigation' ? 'bg-yellow-400' :
                    rs.id === 'acknowledged' ? 'bg-orange-400' :
                    'bg-red-400'
                  }`} aria-hidden="true" />
                  <h4 className={`text-sm font-mono font-bold ${rs.color}`}>{rs.label}</h4>
                  <span className="text-xs text-slate-400 font-mono ml-auto">
                    {countriesWithStatus.length} {countriesWithStatus.length === 1 ? 'country' : 'countries'}
                  </span>
                </div>
                <div className="divide-y divide-[#1c2a35]">
                  {countriesWithStatus.map(cp => (
                    <div key={cp.country} className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white font-mono">{cp.country}</span>
                        <div className="flex items-center gap-2">
                          {cp.stations.length > 0 && (
                            <span className="text-xs text-slate-400 font-mono">
                              {cp.stations.length} {cp.stations.length === 1 ? 'station' : 'stations'}
                            </span>
                          )}
                          {cp.cases.length > 0 && (
                            <>
                              <span className="text-slate-500 text-xs" aria-hidden="true">•</span>
                              <span className="text-xs text-slate-400 font-mono">
                                {cp.cases.length} {cp.cases.length === 1 ? 'case' : 'cases'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      {cp.response && (
                        <div className="mt-1 text-xs text-slate-400">
                          {cp.response.diplomatic_actions && cp.response.diplomatic_actions !== 'None' && (
                            <p className="line-clamp-1">Diplomatic: {cp.response.diplomatic_actions}</p>
                          )}
                          {cp.stations.some(s => (s.arrests_made || '').toLowerCase() === 'yes') && (
                            <p className="text-[#4afa82]">✓ Arrests made in connection with CCP operations</p>
                          )}
                          {cp.stations.some(s => s.status === 'CLOSED') && (
                            <p className="text-[#4afa82]">✓ Police stations closed</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-[#1c2a35]">
        <p className="text-xs text-slate-400 font-mono">
          Cross-referencing {stations.length} police stations, {cases.length} legal cases, {responses.length} country responses
        </p>
        <p className="text-xs text-slate-400 font-mono">
          Tier 1-2 sources only <span className="text-slate-500" aria-hidden="true">•</span> CC BY 4.0
        </p>
      </div>
    </section>
  );
};
export default TransnationalRepressionTracker;
