// @ts-nocheck — Phase 2 migration: types to be added

/**
 * DiasporaSecurityAdvisor — Security guidance tailored for diaspora
 * communities targeted by CCP transnational repression. Covers threat
 * assessment by country, legal protections, and reporting mechanisms.
 *
 * @module DiasporaSecurityAdvisor
 */
import { useState, useMemo } from 'react';
import { dataApi } from '../services/dataApi';
import { Shield, MapPin, AlertTriangle, Search, ChevronDown, ChevronUp, ExternalLink, Copy, Check, Globe, Users, Lock, Eye, Scale } from 'lucide-react';
// DiasporaSecurityAdvisor — personalized security guidance for diaspora communities
// by country, cross-referencing police stations, international responses, and legal cases.
// All data from verified Tier 1-2 sources via dataApi. CC BY 4.0.
const ACTIVITY_TYPES = [
  { id: 'all', label: 'All Activities' },
  { id: 'protest', label: 'Protests & Rallies', icon: Users, risk: 'high' },
  { id: 'online', label: 'Online Activism', icon: Globe, risk: 'moderate' },
  { id: 'journalism', label: 'Journalism & Media', icon: Eye, risk: 'critical' },
  { id: 'legal', label: 'Legal Advocacy', icon: Scale, risk: 'moderate' },
  { id: 'community', label: 'Community Organizing', icon: Users, risk: 'low' },
  { id: 'academic', label: 'Academic Research', icon: Search, risk: 'moderate' },
];
const RISK_LEVELS = [
  { id: 'critical', label: 'Critical', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
  { id: 'high', label: 'High', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  { id: 'moderate', label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  { id: 'low', label: 'Low', color: 'text-[#4afa82]', bg: 'bg-[#4afa82]/10', border: 'border-[#4afa82]/30' },
];
const SAFETY_TIPS = {
  protest: [
    'Use a burner phone — leave your personal device at home',
    'Cover identifying features (tattoos, distinctive clothing)',
    'Use Signal for coordination — set disappearing messages to 24h',
    'Travel in groups of 3+ and establish a buddy system',
    'Designate a legal observer who does not participate',
    'Know your local legal rights regarding assembly and protest',
    'Have a lawyer\'s number written on your arm in permanent marker',
  ],
  online: [
    'Use Tor Browser for all CCP-related research and posting',
    'Never use WeChat, Weibo, or TikTok for activism coordination',
    'Use a VPN + Tor combination for maximum anonymity',
    'Create separate accounts with no link to real identity',
    'Disable location services and metadata on all shared images',
    'Use ProtonMail or Tutanota for encrypted communications',
  ],
  journalism: [
    'Use SecureDrop for source communications where available',
    'Store notes and recordings in encrypted containers (VeraCrypt)',
    'Never carry unencrypted source material across borders',
    'Use separate devices for personal and professional work',
    'Register with Committee to Protect Journalists (CPJ)',
    'Have a trusted contact who knows your schedule and deadlines',
  ],
  legal: [
    'Document all interactions with potential CCP agents',
    'Use encrypted case management systems only',
    'Be aware of Magnitsky Act provisions in your jurisdiction',
    'Connect with international bar associations for mutual support',
    'Report any intimidation to local law enforcement immediately',
  ],
  community: [
    'Vet new members through trusted existing networks',
    'Hold meetings in varied locations — avoid predictable patterns',
    'Keep membership lists encrypted and access-controlled',
    'Use code words for sensitive topics in unencrypted channels',
    'Maintain public and private communication channels separately',
  ],
  academic: [
    'Be aware of Confucius Institute monitoring at your institution',
    'Use institutional VPN when accessing sensitive research',
    'Do not store research on Chinese-manufactured cloud services',
    'Be cautious of unsolicited collaboration requests from PRC-linked institutions',
    'Report any academic intimidation to your institution\'s security office',
  ],
};
function assessCountryRisk(stations, response, cases) {
  let score = 0;
  const activeStations = stations.filter(s => s.status === 'ACTIVE').length;
  const closedStations = stations.filter(s => s.status === 'CLOSED').length;
  const investigating = stations.filter(s => s.status === 'UNDER INVESTIGATION').length;
  const hasArrest = stations.some(s => (s.arrests_made || '').toLowerCase() === 'yes');
  if (activeStations > 0) score += 30;
  if (investigating > 0) score += 10;
  if (closedStations > 0) score -= 10;
  if (hasArrest) score -= 15;
  if (response) {
    const stance = (response.overall_stance || '').toLowerCase();
    if (stance.includes('strong')) score -= 20;
    else if (stance.includes('moderate')) score -= 5;
    else if (stance.includes('weak') || stance === 'none') score += 15;
    if (response.sanctions_imposed && response.sanctions_imposed !== 'None' && response.sanctions_imposed !== 'N/A') score -= 10;
    if (response.genocide_recognition && response.genocide_recognition.toLowerCase().startsWith('yes')) score -= 10;
  } else {
    score += 20;
  }
  if (cases.length > 0) score += 5;
  if (score >= 30) return 'critical';
  if (score >= 15) return 'high';
  if (score >= 0) return 'moderate';
  return 'low';
}
function generateAdvisory(country, risk, stations, response, activity) {
  const lines = [];
  const activeStations = stations.filter(s => s.status === 'ACTIVE');
  const closedStations = stations.filter(s => s.status === 'CLOSED');
  if (activeStations.length > 0) {
    lines.push(`⚠ ${activeStations.length} known CCP police station(s) ACTIVE in ${country}: ${activeStations.map(s => s.city).join(', ')}. Avoid these areas.`);
  }
  if (closedStations.length > 0) {
    lines.push(`✓ ${closedStations.length} station(s) CLOSED by authorities — government has taken enforcement action.`);
  }
  if (response) {
    const stance = (response.overall_stance || '').split(' - ')[0];
    lines.push(`Government stance: ${stance}. ${response.sanctions_imposed && response.sanctions_imposed !== 'None' ? 'Sanctions in place.' : 'No targeted sanctions.'}`);
    if (response.legislative_actions && response.legislative_actions !== 'None') {
      lines.push(`Legislative protections: ${response.legislative_actions.split('.')[0]}.`);
    }
  } else {
    lines.push('No known international response data — exercise increased caution.');
  }
  if (activity && activity !== 'all') {
    const tips = SAFETY_TIPS[activity];
    if (tips) lines.push(`Activity-specific guidance (${ACTIVITY_TYPES.find(a => a.id === activity)?.label}):`);
  }
  return lines;
}
const DiasporaSecurityAdvisor = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCountry, setExpandedCountry] = useState(null);
  const [copied, setCopied] = useState(false);
  const stations = dataApi.getPoliceStations();
  const responses = dataApi.getInternationalResponses();
  const cases = dataApi.getLegalCases();
  const countryProfiles = useMemo(() => {
    const countryMap = {};
    const allCountries = new Set();
    stations.forEach(s => allCountries.add(s.country));
    responses.forEach(r => allCountries.add(r.country));
    const transnationalCases = cases.filter(c => {
      const j = (c.jurisdiction || '').toLowerCase();
      return !j.includes('hong kong') && !j.includes('china');
    });
    transnationalCases.forEach(c => {
      const country = c.jurisdiction.replace(/\s*\(.*\)/, '');
      allCountries.add(country);
    });
    allCountries.forEach(country => {
      const countryStations = stations.filter(s => s.country === country);
      const countryResponse = responses.find(r => r.country === country) || null;
      const countryCases = transnationalCases.filter(c => c.jurisdiction.replace(/\s*\(.*\)/, '') === country);
      const risk = assessCountryRisk(countryStations, countryResponse, countryCases);
      const advisory = generateAdvisory(country, risk, countryStations, countryResponse, selectedActivity);
      countryMap[country] = { country, stations: countryStations, response: countryResponse, cases: countryCases, risk, advisory };
    });
    const levelOrder = { critical: 0, high: 1, moderate: 2, low: 3 };
    return Object.values(countryMap).sort((a, b) => levelOrder[a.risk] - levelOrder[b.risk] || a.country.localeCompare(b.country));
  }, [stations, responses, cases, selectedActivity]);
  const filtered = useMemo(() => {
    return countryProfiles.filter(cp => {
      const matchesSearch = !searchQuery || cp.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry = !selectedCountry || cp.country === selectedCountry;
      return matchesSearch && matchesCountry;
    });
  }, [countryProfiles, searchQuery, selectedCountry]);
  const stats = useMemo(() => ({
    totalCountries: countryProfiles.length,
    critical: countryProfiles.filter(cp => cp.risk === 'critical').length,
    high: countryProfiles.filter(cp => cp.risk === 'high').length,
    withActiveStations: countryProfiles.filter(cp => cp.stations.some(s => s.status === 'ACTIVE')).length,
    withProtection: countryProfiles.filter(cp => cp.response && (cp.response.overall_stance || '').toLowerCase().includes('strong')).length,
  }), [countryProfiles]);
  const getRiskStyle = (level) => RISK_LEVELS.find(r => r.id === level) || RISK_LEVELS[3];
  const handleCopyReport = async () => {
    const target = selectedCountry ? filtered : countryProfiles;
    const lines = [
      '═══ DIASPORA SECURITY ADVISORY — INTELLIGENCE REPORT ═══',
      `Generated: ${new Date().toISOString().split('T')[0]}`,
      `Activity focus: ${ACTIVITY_TYPES.find(a => a.id === selectedActivity)?.label || 'All'}`,
      `Countries assessed: ${target.length}`,
      '',
      ...target.map(cp => {
        const style = getRiskStyle(cp.risk);
        return [`[${style.label.toUpperCase()}] ${cp.country}`, ...cp.advisory.map(l => `  ${l}`), ''].join('\n');
      }),
      'Source: Global Anti-CCP Resistance Hub — Tier 1-2 verified data',
      'License: CC BY 4.0',
    ];
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <section aria-label="Diaspora Security Advisor" className="bg-[#0a0e14] border border-[#1c2a35] p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#22d3ee]" aria-hidden="true" />
            Diaspora Security Advisor
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Personalized security guidance for {stats.totalCountries} countries — cross-referencing {stations.length} police stations, {responses.length} government responses, and {cases.length} legal cases
          </p>
        </div>
        <button onClick={handleCopyReport} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#1c2a35] hover:border-[#22d3ee] text-slate-400 hover:text-[#22d3ee] transition-colors whitespace-nowrap flex-shrink-0" aria-label="Copy security advisory report">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy Report'}
        </button>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Countries', value: stats.totalCountries, color: 'text-white' },
          { label: 'Critical Risk', value: stats.critical, color: 'text-red-400' },
          { label: 'High Risk', value: stats.high, color: 'text-orange-400' },
          { label: 'Active Stations', value: stats.withActiveStations, color: 'text-yellow-400' },
          { label: 'Strong Protection', value: stats.withProtection, color: 'text-[#4afa82]' },
        ].map(s => (
          <div key={s.label} className="bg-[#111820] border border-[#1c2a35] p-3 text-center">
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search country..." className="w-full bg-[#111820] border border-[#1c2a35] text-slate-300 text-sm pl-9 pr-3 py-2 font-mono placeholder:text-slate-400 focus:border-[#22d3ee] focus:outline-none" aria-label="Search countries" />
        </div>
        <select value={selectedActivity} onChange={e => setSelectedActivity(e.target.value)} className="bg-[#111820] border border-[#1c2a35] text-slate-300 text-sm px-3 py-2 font-mono focus:border-[#22d3ee] focus:outline-none" aria-label="Filter by activity type">
          {ACTIVITY_TYPES.map(a => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </select>
        <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} className="bg-[#111820] border border-[#1c2a35] text-slate-300 text-sm px-3 py-2 font-mono focus:border-[#22d3ee] focus:outline-none" aria-label="Filter by country">
          <option value="">All Countries</option>
          {countryProfiles.map(cp => (
            <option key={cp.country} value={cp.country}>{cp.country}</option>
          ))}
        </select>
      </div>
      {/* Country Advisory Cards */}
      <div className="space-y-3">
        <p className="text-xs text-slate-400 font-mono">{filtered.length} of {countryProfiles.length} countries shown</p>
        {filtered.map(cp => {
          const style = getRiskStyle(cp.risk);
          const isExpanded = expandedCountry === cp.country;
          return (
            <div key={cp.country} className={`border ${style.border} ${style.bg}`}>
              <button onClick={() => setExpandedCountry(isExpanded ? null : cp.country)} className="w-full text-left p-4 flex items-center justify-between gap-3" aria-expanded={isExpanded} aria-label={`${cp.country} — ${style.label} risk`}>
                <div className="flex items-center gap-3 min-w-0">
                  <MapPin className={`w-4 h-4 flex-shrink-0 ${style.color}`} aria-hidden="true" />
                  <div className="min-w-0">
                    <span className="text-white font-mono text-sm font-bold">{cp.country}</span>
                    <span className="text-slate-400 text-xs ml-2">
                      {cp.stations.length > 0 ? `${cp.stations.length} station${cp.stations.length > 1 ? 's' : ''}` : ''}
                      {cp.stations.length > 0 && cp.cases.length > 0 ? ' • ' : ''}
                      {cp.cases.length > 0 ? `${cp.cases.length} case${cp.cases.length > 1 ? 's' : ''}` : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-mono px-2 py-0.5 whitespace-nowrap ${style.color} ${style.bg}`}>{style.label.toUpperCase()}</span>
                  <span className="text-slate-500">{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</span>
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-[#1c2a35]">
                  {/* Advisory Lines */}
                  <div className="mt-3 space-y-2">
                    <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Security Advisory</h4>
                    {cp.advisory.map((line, i) => (
                      <p key={i} className="text-sm text-slate-300 font-mono leading-relaxed">{line}</p>
                    ))}
                  </div>
                  {/* Activity-Specific Tips */}
                  {selectedActivity !== 'all' && SAFETY_TIPS[selectedActivity] && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                        {ACTIVITY_TYPES.find(a => a.id === selectedActivity)?.label} Safety Tips
                      </h4>
                      <ul className="space-y-1.5">
                        {SAFETY_TIPS[selectedActivity].map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <Lock className="w-3.5 h-3.5 text-[#22d3ee] mt-0.5 flex-shrink-0" aria-hidden="true" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Police Stations */}
                  {cp.stations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
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
                              }`}>{s.status}</span>
                            </div>
                            {s.government_response && (
                              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{s.government_response}</p>
                            )}
                            {s.source_url && (
                              <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#22d3ee] hover:underline mt-1">
                                <ExternalLink className="w-3 h-3" aria-hidden="true" /> Source
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Government Response */}
                  {cp.response && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Government Response</h4>
                      <div className="bg-[#0a0e14] border border-[#1c2a35] p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm text-white font-mono">Overall Stance</span>
                          <span className="text-xs text-slate-300 font-mono">{(cp.response.overall_stance || '').split(' - ')[0]}</span>
                        </div>
                        {cp.response.genocide_recognition && (
                          <p className="text-xs text-slate-400"><span className="text-slate-300">Genocide recognition:</span> {cp.response.genocide_recognition.substring(0, 80)}{cp.response.genocide_recognition.length > 80 ? '...' : ''}</p>
                        )}
                        {cp.response.sanctions_imposed && cp.response.sanctions_imposed !== 'None' && (
                          <p className="text-xs text-slate-400"><span className="text-slate-300">Sanctions:</span> {cp.response.sanctions_imposed.substring(0, 100)}{cp.response.sanctions_imposed.length > 100 ? '...' : ''}</p>
                        )}
                        {cp.response.source_url && (
                          <a href={cp.response.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#22d3ee] hover:underline">
                            <ExternalLink className="w-3 h-3" aria-hidden="true" /> Source
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Emergency Contacts */}
                  <div className="bg-red-900/20 border border-red-400/30 p-3 space-y-1">
                    <h4 className="text-xs font-mono text-red-400 uppercase tracking-wider">Emergency Resources</h4>
                    <p className="text-xs text-slate-300">Front Line Defenders: <a href="tel:+35312100489" className="text-[#22d3ee] hover:underline">+353 1 210 0489</a></p>
                    <p className="text-xs text-slate-300">Access Now Digital Security: <a href="mailto:help@accessnow.org" className="text-[#22d3ee] hover:underline">help@accessnow.org</a></p>
                    <p className="text-xs text-slate-300">Safeguard Defenders: <a href="https://safeguarddefenders.com" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">safeguarddefenders.com</a></p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Footer */}
      <div className="text-xs text-slate-400 border-t border-[#1c2a35] pt-4 space-y-1">
        <p>Data: {stations.length} police stations • {responses.length} international responses • {cases.length} legal cases</p>
        <p>Sources: Safeguard Defenders, Freedom House, ASPI, parliamentary records — Tier 1-2 verified</p>
        <p>License: CC BY 4.0 • This advisory is informational — consult local legal counsel for specific situations</p>
      </div>
    </section>
  );
};
export default DiasporaSecurityAdvisor;
