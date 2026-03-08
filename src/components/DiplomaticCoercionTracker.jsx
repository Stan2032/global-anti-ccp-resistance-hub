/**
 * DiplomaticCoercionTracker — Tracks diplomatic and economic coercion
 * tactics used by the CCP against nations and international organizations.
 *
 * @module DiplomaticCoercionTracker
 */
import { useState, useMemo } from 'react';
import { dataApi } from '../services/dataApi';
import { Globe, Shield, AlertTriangle, Search, ChevronDown, ChevronUp, Copy, Check, DollarSign, Scale, Users, Ban, Landmark, TrendingDown } from 'lucide-react';
// DiplomaticCoercionTracker — Maps CCP diplomatic & economic coercion against
// nations criticizing its human rights record. Cross-references sanctions,
// international responses, police stations, and legal cases.
// All data from verified Tier 1-2 sources via dataApi. CC BY 4.0.

const COERCION_TYPES = [
  { id: 'trade', label: 'Trade Restrictions', icon: DollarSign, description: 'Import bans, tariffs, informal boycotts, customs delays' },
  { id: 'hostage', label: 'Hostage Diplomacy', icon: Ban, description: 'Arbitrary detention of foreign nationals as political leverage' },
  { id: 'diplomatic', label: 'Diplomatic Threats', icon: Landmark, description: 'Ambassador recalls, downgraded relations, severed ties' },
  { id: 'economic', label: 'Economic Leverage', icon: TrendingDown, description: 'Debt dependency, investment withdrawal, market access threats' },
  { id: 'political', label: 'Political Interference', icon: Users, description: 'Lobby pressure, diaspora mobilization, elite capture' },
];

const SEVERITY_LEVELS = [
  { id: 'severe', label: 'Severe', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', dot: 'bg-red-400' },
  { id: 'significant', label: 'Significant', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30', dot: 'bg-orange-400' },
  { id: 'moderate', label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', dot: 'bg-yellow-400' },
  { id: 'low', label: 'Low', color: 'text-[#4afa82]', bg: 'bg-[#4afa82]/10', border: 'border-[#4afa82]/30', dot: 'bg-[#4afa82]' },
];

const RESPONSE_LEVELS = [
  { id: 'firm', label: 'Firm Stance', color: 'text-[#4afa82]' },
  { id: 'mixed', label: 'Mixed Response', color: 'text-yellow-400' },
  { id: 'conceded', label: 'Conceded', color: 'text-red-400' },
  { id: 'unknown', label: 'Unknown', color: 'text-slate-400' },
];

// Documented CCP coercion incidents — verified Tier 1-2 sources (BBC, Reuters, AP, HRW, ASPI)
const COERCION_INCIDENTS = [
  { country: 'Australia', incidents: [
    { type: 'trade', year: 2020, detail: 'Wine, barley, coal, beef, lobster import bans following call for COVID-19 inquiry', source: 'BBC, Reuters' },
    { type: 'diplomatic', year: 2020, detail: 'Suspended ministerial-level Strategic Economic Dialogue', source: 'Reuters, AP' },
    { type: 'political', year: 2019, detail: 'Identified CCP-linked political donations and influence operations', source: 'ASPI, ABC' },
  ], trigger: 'Called for independent COVID-19 origins investigation; passed foreign interference laws', response: 'firm' },
  { country: 'Lithuania', incidents: [
    { type: 'trade', year: 2021, detail: 'Blocked all Lithuanian imports; pressured multinationals to cut Lithuania from supply chains', source: 'Reuters, BBC' },
    { type: 'diplomatic', year: 2021, detail: 'Recalled ambassador and downgraded relations to chargé d\'affaires level', source: 'Reuters, AP' },
    { type: 'economic', year: 2022, detail: 'Pressured EU companies to remove Lithuanian components from products', source: 'FT, Reuters' },
  ], trigger: 'Allowed Taiwan to open representative office under the name "Taiwan"', response: 'firm' },
  { country: 'Canada', incidents: [
    { type: 'hostage', year: 2018, detail: 'Detained Michael Kovrig (diplomat) and Michael Spavor (businessman) — "Two Michaels"', source: 'BBC, Reuters, Globe and Mail' },
    { type: 'trade', year: 2019, detail: 'Blocked canola imports citing "pests"; restricted meat and soybean imports', source: 'Reuters, CBC' },
    { type: 'diplomatic', year: 2019, detail: 'Escalating diplomatic threats over Meng Wanzhou extradition proceedings', source: 'BBC, Reuters' },
  ], trigger: 'Arrested Huawei CFO Meng Wanzhou on US extradition request', response: 'firm' },
  { country: 'Norway', incidents: [
    { type: 'trade', year: 2010, detail: 'Blocked Norwegian salmon imports for 6+ years after Nobel Peace Prize to Liu Xiaobo', source: 'BBC, Reuters' },
    { type: 'diplomatic', year: 2010, detail: 'Froze bilateral relations; cancelled ministerial meetings for 6 years', source: 'Reuters, Guardian' },
  ], trigger: 'Nobel Committee awarded 2010 Peace Prize to imprisoned dissident Liu Xiaobo', response: 'conceded' },
  { country: 'South Korea', incidents: [
    { type: 'trade', year: 2017, detail: 'Informal tourism ban; restricted Korean cultural exports; targeted Lotte Group stores', source: 'Reuters, BBC' },
    { type: 'economic', year: 2017, detail: 'Suspended Lotte operations in China; organized consumer boycotts', source: 'Reuters, AP' },
  ], trigger: 'Deployed US THAAD missile defense system', response: 'conceded' },
  { country: 'Sweden', incidents: [
    { type: 'diplomatic', year: 2019, detail: 'CCP ambassador threatened "consequences" for PEN Award to Gui Minhai', source: 'BBC, SVT, Guardian' },
    { type: 'hostage', year: 2015, detail: 'Detained Swedish citizen Gui Minhai (bookseller) from Thailand', source: 'BBC, Reuters, HKFP' },
    { type: 'political', year: 2020, detail: 'Pressure campaign against Swedish officials raising human rights concerns', source: 'HKFP, Guardian' },
  ], trigger: 'Gui Minhai case; Sweden raised human rights concerns at UN', response: 'firm' },
  { country: 'Czech Republic', incidents: [
    { type: 'diplomatic', year: 2020, detail: 'Threatened "heavy price" for Senate President\'s Taiwan visit', source: 'Reuters, BBC' },
    { type: 'economic', year: 2020, detail: 'Pressured Czech companies with China market access threats', source: 'Reuters, HKFP' },
  ], trigger: 'Senate President Miloš Vystrčil visited Taiwan; Prague signed sister-city agreement with Taipei', response: 'firm' },
  { country: 'United Kingdom', incidents: [
    { type: 'diplomatic', year: 2020, detail: 'Sanctioned UK parliamentarians and entities for Xinjiang scrutiny', source: 'BBC, Reuters' },
    { type: 'political', year: 2022, detail: 'Alleged CCP-linked political donations; MI5 warned of CCP agent in Parliament', source: 'BBC, Times, MI5' },
    { type: 'trade', year: 2021, detail: 'Retaliatory sanctions on UK individuals and organizations', source: 'Reuters, BBC' },
  ], trigger: 'Sanctioned CCP officials over Xinjiang; offered BN(O) visa pathway for Hong Kongers', response: 'firm' },
  { country: 'Netherlands', incidents: [
    { type: 'diplomatic', year: 2023, detail: 'Diplomatic pressure against ASML chip export restrictions', source: 'Reuters, FT' },
    { type: 'economic', year: 2023, detail: 'Threatened economic retaliation over semiconductor export controls', source: 'Reuters, BBC' },
  ], trigger: 'Restricted ASML lithography machine exports to China; parliament recognized Uyghur genocide', response: 'firm' },
  { country: 'Japan', incidents: [
    { type: 'trade', year: 2010, detail: 'Blocked rare earth exports during Senkaku/Diaoyu dispute', source: 'Reuters, BBC, NYT' },
    { type: 'hostage', year: 2015, detail: 'Detained multiple Japanese nationals on espionage charges', source: 'Reuters, BBC, NHK' },
    { type: 'diplomatic', year: 2023, detail: 'Escalated military provocations and diplomatic warnings over Taiwan', source: 'Reuters, AP' },
  ], trigger: 'Senkaku Islands dispute; Taiwan Strait security cooperation; semiconductor export controls', response: 'firm' },
  { country: 'Philippines', incidents: [
    { type: 'economic', year: 2012, detail: 'Imposed banana import restrictions; organized tourism boycott', source: 'Reuters, BBC' },
    { type: 'diplomatic', year: 2016, detail: 'Rejected Hague Tribunal ruling on South China Sea', source: 'BBC, Reuters, HKFP' },
    { type: 'political', year: 2022, detail: 'Debt dependency concerns through infrastructure loans', source: 'Reuters, SCMP (non-state)' },
  ], trigger: 'Filed and won South China Sea arbitration case; refused to cede territorial claims', response: 'mixed' },
  { country: 'Mongolia', incidents: [
    { type: 'economic', year: 2016, detail: 'Imposed transit fees and delayed border crossings for Mongolian exports', source: 'Reuters, RFA' },
    { type: 'diplomatic', year: 2016, detail: 'Pressured Mongolia to refuse future Dalai Lama visits', source: 'Reuters, BBC, RFA' },
  ], trigger: 'Dalai Lama visited Mongolia in November 2016', response: 'conceded' },
  { country: 'Germany', incidents: [
    { type: 'diplomatic', year: 2007, detail: 'Cancelled diplomatic events after Merkel met Dalai Lama', source: 'Reuters, BBC' },
    { type: 'political', year: 2023, detail: 'CCP-linked espionage and influence operations in Bundestag', source: 'Reuters, DW' },
    { type: 'economic', year: 2023, detail: 'Leveraged auto industry dependency to moderate China criticism', source: 'Reuters, FT' },
  ], trigger: 'Merkel met Dalai Lama; Bundestag human rights debates; Xinjiang due diligence laws', response: 'mixed' },
  { country: 'France', incidents: [
    { type: 'diplomatic', year: 2008, detail: 'Cancelled EU summit after Sarkozy met Dalai Lama; froze relations', source: 'Reuters, BBC' },
    { type: 'trade', year: 2021, detail: 'Counter-sanctions on EU entities including French researchers', source: 'Reuters, BBC' },
  ], trigger: 'Sarkozy met Dalai Lama; EU Xinjiang sanctions; parliament recognized Uyghur genocide', response: 'firm' },
  { country: 'India', incidents: [
    { type: 'diplomatic', year: 2020, detail: 'Galwan Valley military confrontation killing 20 Indian soldiers', source: 'Reuters, BBC, AP' },
    { type: 'economic', year: 2020, detail: 'India banned 200+ Chinese apps; restricted Chinese investment', source: 'Reuters, BBC' },
    { type: 'trade', year: 2023, detail: 'Ongoing border trade disruptions and visa restrictions', source: 'Reuters, AP' },
  ], trigger: 'Border disputes; hosting Dalai Lama; Quad security partnership', response: 'firm' },
  { country: 'New Zealand', incidents: [
    { type: 'political', year: 2020, detail: 'Identified CCP-linked political donations and influence in academia', source: 'Reuters, NZME, Stuff' },
    { type: 'diplomatic', year: 2021, detail: 'Diplomatic pressure after Five Eyes Xinjiang statements', source: 'Reuters, BBC' },
  ], trigger: 'Five Eyes participation; academic freedom concerns; Xinjiang statements', response: 'mixed' },
  { country: 'Taiwan', incidents: [
    { type: 'diplomatic', year: 2016, detail: 'Poached 9 diplomatic allies (2016-2023); blocked WHO/ICAO participation', source: 'BBC, Reuters, AP' },
    { type: 'economic', year: 2022, detail: 'Banned Taiwanese food imports (fruit, fish); restricted tourism', source: 'Reuters, BBC' },
    { type: 'trade', year: 2023, detail: 'Trade barrier investigations against Taiwan; military exercises as economic disruption', source: 'Reuters, AP, BBC' },
  ], trigger: 'Democratic governance; US arms sales; Pelosi visit; Lai Ching-te inauguration', response: 'firm' },
];

function classifySeverity(country) {
  const count = country.incidents.length;
  const hasHostage = country.incidents.some(i => i.type === 'hostage');
  const hasTrade = country.incidents.some(i => i.type === 'trade');
  const hasDiplomatic = country.incidents.some(i => i.type === 'diplomatic');

  if (hasHostage || count >= 3) return 'severe';
  if (hasTrade && hasDiplomatic) return 'significant';
  if (count >= 2) return 'moderate';
  return 'low';
}

function buildCoercionProfiles(coercionData, responses, sanctions, stations) {
  return coercionData.map(cd => {
    const matchedResponse = responses.find(r =>
      r.country && cd.country && r.country.toLowerCase() === cd.country.toLowerCase()
    );
    const matchedSanctions = sanctions.filter(s =>
      s.country && cd.country && s.country.toLowerCase().includes(cd.country.toLowerCase())
    );
    const matchedStations = stations.filter(s =>
      s.country && cd.country && s.country.toLowerCase() === cd.country.toLowerCase()
    );
    const severity = classifySeverity(cd);
    return {
      ...cd,
      severity,
      matchedResponse,
      sanctionCount: matchedSanctions.length,
      stationCount: matchedStations.length,
      totalIncidents: cd.incidents.length,
    };
  }).sort((a, b) => {
    const order = { severe: 0, significant: 1, moderate: 2, low: 3 };
    return order[a.severity] - order[b.severity] || b.totalIncidents - a.totalIncidents;
  });
}

const DiplomaticCoercionTracker = () => {
  const [activeView, setActiveView] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expandedCountry, setExpandedCountry] = useState(null);
  const [copied, setCopied] = useState(false);

  const responses = useMemo(() => dataApi.getInternationalResponses(), []);
  const sanctions = useMemo(() => dataApi.getSanctions(), []);
  const stations = useMemo(() => dataApi.getPoliceStations(), []);
  const prisoners = useMemo(() => dataApi.getPoliticalPrisoners(), []);

  const profiles = useMemo(
    () => buildCoercionProfiles(COERCION_INCIDENTS, responses, sanctions, stations),
    [responses, sanctions, stations]
  );

  const filtered = useMemo(() => {
    return profiles.filter(p => {
      const matchesSearch = !searchQuery ||
        [p.country, p.trigger, ...p.incidents.map(i => i.detail)]
          .join(' ').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeverity = severityFilter === 'all' || p.severity === severityFilter;
      const matchesType = typeFilter === 'all' || p.incidents.some(i => i.type === typeFilter);
      return matchesSearch && matchesSeverity && matchesType;
    });
  }, [profiles, searchQuery, severityFilter, typeFilter]);

  const stats = useMemo(() => {
    const totalCountries = profiles.length;
    const totalIncidents = profiles.reduce((sum, p) => sum + p.totalIncidents, 0);
    const hostageIncidents = profiles.filter(p => p.incidents.some(i => i.type === 'hostage')).length;
    const tradeRestrictions = profiles.filter(p => p.incidents.some(i => i.type === 'trade')).length;
    const firmResponses = profiles.filter(p => p.response === 'firm').length;
    const concessions = profiles.filter(p => p.response === 'conceded').length;
    return { totalCountries, totalIncidents, hostageIncidents, tradeRestrictions, firmResponses, concessions };
  }, [profiles]);

  const severityDistribution = useMemo(() => {
    return SEVERITY_LEVELS.map(sl => ({
      ...sl,
      count: profiles.filter(p => p.severity === sl.id).length,
    }));
  }, [profiles]);

  const handleCopyReport = async () => {
    const lines = [
      '═══ DIPLOMATIC COERCION TRACKER — INTELLIGENCE REPORT ═══',
      `Generated: ${new Date().toISOString().split('T')[0]}`,
      `Countries targeted: ${stats.totalCountries}`,
      `Total coercion incidents: ${stats.totalIncidents}`,
      `Hostage diplomacy cases: ${stats.hostageIncidents}`,
      `Trade restriction targets: ${stats.tradeRestrictions}`,
      `Countries maintaining firm stance: ${stats.firmResponses}`,
      `Countries that conceded: ${stats.concessions}`,
      '',
      '── SEVERITY ASSESSMENT BY COUNTRY ──',
      ...profiles.map(p =>
        `[${p.severity.toUpperCase()}] ${p.country}: ${p.totalIncidents} incidents — Response: ${p.response} — Trigger: ${p.trigger}`
      ),
      '',
      '── COERCION TACTICS BREAKDOWN ──',
      ...COERCION_TYPES.map(ct => {
        const affected = profiles.filter(p => p.incidents.some(i => i.type === ct.id));
        return `${ct.label}: ${affected.length} countries — ${affected.map(p => p.country).join(', ')}`;
      }),
      '',
      `Cross-referenced with ${responses.length} international responses, ${sanctions.length} sanctions, ${stations.length} police stations, ${prisoners.length} political prisoners`,
      'Source: Global Anti-CCP Resistance Hub — Tier 1-2 verified data',
      'License: CC BY 4.0',
    ];
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const views = [
    { id: 'overview', label: 'Country Overview' },
    { id: 'tactics', label: 'Coercion Tactics' },
    { id: 'outcomes', label: 'Response Outcomes' },
  ];

  const getSeverityStyle = (level) => SEVERITY_LEVELS.find(s => s.id === level) || SEVERITY_LEVELS[3];
  const getResponseStyle = (status) => RESPONSE_LEVELS.find(r => r.id === status) || RESPONSE_LEVELS[3];
  const getTypeInfo = (typeId) => COERCION_TYPES.find(ct => ct.id === typeId) || COERCION_TYPES[0];

  return (
    <section aria-label="Diplomatic Coercion Tracker" className="bg-[#0a0e14] border border-[#1c2a35] p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Landmark className="w-5 h-5 text-red-400" aria-hidden="true" />
            Diplomatic Coercion Tracker
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Mapping {stats.totalIncidents} CCP coercion incidents across {stats.totalCountries} countries — cross-referencing {responses.length} international responses, {sanctions.length} sanctions, and {prisoners.length} political prisoners
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

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-[#22d3ee]" aria-hidden="true" />
          {stats.totalCountries} countries targeted
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
          {stats.totalIncidents} coercion incidents
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Ban className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
          {stats.hostageIncidents} hostage diplomacy
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5 text-yellow-400" aria-hidden="true" />
          {stats.tradeRestrictions} trade restrictions
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-[#4afa82]" aria-hidden="true" />
          {stats.firmResponses} firm responses
        </span>
      </div>

      {/* Severity Distribution */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {severityDistribution.map(sd => (
          <div key={sd.id} className={`${sd.bg} border ${sd.border} p-3`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${sd.dot}`} aria-hidden="true" />
              <span className={`text-xs font-mono uppercase ${sd.color}`}>{sd.label}</span>
            </div>
            <span className="text-2xl font-bold text-white font-mono">{sd.count}</span>
            <span className="text-xs text-slate-400 ml-1">{sd.count === 1 ? 'country' : 'countries'}</span>
          </div>
        ))}
      </div>

      {/* View Toggle */}
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

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search countries, incidents, triggers..."
            className="w-full bg-[#0d1117] border border-[#1c2a35] pl-9 pr-3 py-2 text-sm font-mono text-slate-300 placeholder:text-slate-400 focus:border-[#22d3ee] focus:outline-none"
            aria-label="Search diplomatic coercion data"
          />
        </div>
        <select
          value={severityFilter}
          onChange={e => setSeverityFilter(e.target.value)}
          className="bg-[#0d1117] border border-[#1c2a35] px-3 py-2 text-sm font-mono text-slate-300 focus:border-[#22d3ee] focus:outline-none"
          aria-label="Filter by severity"
        >
          <option value="all">All Severities</option>
          {SEVERITY_LEVELS.map(sl => (
            <option key={sl.id} value={sl.id}>{sl.label}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="bg-[#0d1117] border border-[#1c2a35] px-3 py-2 text-sm font-mono text-slate-300 focus:border-[#22d3ee] focus:outline-none"
          aria-label="Filter by coercion type"
        >
          <option value="all">All Coercion Types</option>
          {COERCION_TYPES.map(ct => (
            <option key={ct.id} value={ct.id}>{ct.label}</option>
          ))}
        </select>
      </div>

      {/* OVERVIEW VIEW */}
      {activeView === 'overview' && (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-slate-400 text-sm font-mono py-4 text-center">No countries match your filters</p>
          ) : (
            filtered.map(profile => {
              const sevStyle = getSeverityStyle(profile.severity);
              const respStyle = getResponseStyle(profile.response);
              const isExpanded = expandedCountry === profile.country;
              return (
                <div key={profile.country} className={`border ${sevStyle.border} ${sevStyle.bg}`}>
                  <button
                    onClick={() => setExpandedCountry(isExpanded ? null : profile.country)}
                    className="w-full flex items-center justify-between p-3 sm:p-4 text-left"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${sevStyle.dot}`} aria-hidden="true" />
                      <div className="min-w-0">
                        <span className="text-white font-mono text-sm font-bold block">{profile.country}</span>
                        <span className="text-slate-400 text-xs block truncate">{profile.trigger}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`hidden sm:inline text-xs font-mono px-2 py-0.5 border ${sevStyle.border} ${sevStyle.color}`}>
                        {profile.severity.toUpperCase()}
                      </span>
                      <span className={`hidden sm:inline text-xs font-mono ${respStyle.color}`}>
                        {respStyle.label}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{profile.totalIncidents} incidents</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-[#1c2a35] p-3 sm:p-4 space-y-4">
                      {/* Trigger */}
                      <div>
                        <span className="text-xs font-mono text-[#22d3ee] uppercase tracking-wide">Trigger</span>
                        <p className="text-slate-300 text-sm mt-1">{profile.trigger}</p>
                      </div>
                      {/* Incidents */}
                      <div>
                        <span className="text-xs font-mono text-[#22d3ee] uppercase tracking-wide">Coercion Incidents</span>
                        <div className="space-y-2 mt-2">
                          {profile.incidents.map((inc, idx) => {
                            const typeInfo = getTypeInfo(inc.type);
                            const TypeIcon = typeInfo.icon;
                            return (
                              <div key={idx} className="flex items-start gap-2 bg-[#111820]/50 p-2">
                                <TypeIcon className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-mono text-[#a78bfa]">{typeInfo.label}</span>
                                    <span className="text-xs text-slate-400">({inc.year})</span>
                                  </div>
                                  <p className="text-slate-300 text-xs mt-0.5">{inc.detail}</p>
                                  <span className="text-xs text-slate-400 italic">Source: {inc.source}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {/* Cross-references */}
                      <div className="flex flex-wrap gap-3 text-xs font-mono">
                        {profile.matchedResponse && (
                          <span className="text-[#22d3ee]">
                            International response: {profile.matchedResponse.overall_stance || 'Documented'}
                          </span>
                        )}
                        {profile.sanctionCount > 0 && (
                          <span className="text-[#a78bfa]">{profile.sanctionCount} related sanctions</span>
                        )}
                        {profile.stationCount > 0 && (
                          <span className="text-red-400">{profile.stationCount} CCP police stations</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TACTICS VIEW */}
      {activeView === 'tactics' && (
        <div className="space-y-6">
          {COERCION_TYPES.map(ct => {
            const affected = filtered.filter(p => p.incidents.some(i => i.type === ct.id));
            const TypeIcon = ct.icon;
            return (
              <div key={ct.id} className="border border-[#1c2a35] bg-[#111820]/30">
                <div className="p-3 sm:p-4 border-b border-[#1c2a35]">
                  <div className="flex items-center gap-2">
                    <TypeIcon className="w-4 h-4 text-[#22d3ee]" aria-hidden="true" />
                    <h4 className="text-sm font-bold text-white font-mono">{ct.label}</h4>
                    <span className="text-xs text-slate-400 font-mono">({affected.length} countries)</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{ct.description}</p>
                </div>
                <div className="divide-y divide-[#1c2a35]">
                  {affected.length === 0 ? (
                    <p className="text-slate-400 text-xs font-mono p-3 text-center">No incidents match current filters</p>
                  ) : (
                    affected.map(p => {
                      const relevantIncidents = p.incidents.filter(i => i.type === ct.id);
                      return (
                        <div key={p.country} className="p-3 flex items-start gap-3">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${getSeverityStyle(p.severity).dot}`} aria-hidden="true" />
                          <div className="min-w-0">
                            <span className="text-white text-sm font-mono font-bold">{p.country}</span>
                            {relevantIncidents.map((ri, idx) => (
                              <p key={idx} className="text-slate-400 text-xs mt-0.5">
                                <span className="text-slate-300">{ri.year}:</span> {ri.detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* OUTCOMES VIEW */}
      {activeView === 'outcomes' && (
        <div className="space-y-6">
          {RESPONSE_LEVELS.map(rl => {
            const countries = filtered.filter(p => p.response === rl.id);
            return (
              <div key={rl.id} className="border border-[#1c2a35] bg-[#111820]/30">
                <div className="p-3 sm:p-4 border-b border-[#1c2a35]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${rl.id === 'firm' ? 'bg-[#4afa82]' : rl.id === 'mixed' ? 'bg-yellow-400' : rl.id === 'conceded' ? 'bg-red-400' : 'bg-slate-400'}`} aria-hidden="true" />
                    <h4 className={`text-sm font-bold font-mono ${rl.color}`}>{rl.label}</h4>
                    <span className="text-xs text-slate-400 font-mono">({countries.length} countries)</span>
                  </div>
                </div>
                <div className="divide-y divide-[#1c2a35]">
                  {countries.length === 0 ? (
                    <p className="text-slate-400 text-xs font-mono p-3 text-center">No countries in this category</p>
                  ) : (
                    countries.map(p => {
                      const sevStyle = getSeverityStyle(p.severity);
                      return (
                        <div key={p.country} className="p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white text-sm font-mono font-bold">{p.country}</span>
                            <span className={`text-xs px-1.5 py-0.5 border ${sevStyle.border} ${sevStyle.color} font-mono`}>
                              {p.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-slate-400 text-xs">
                            <span className="text-slate-300">Trigger:</span> {p.trigger}
                          </p>
                          <p className="text-slate-400 text-xs mt-0.5">
                            {p.totalIncidents} coercion {p.totalIncidents === 1 ? 'incident' : 'incidents'}: {p.incidents.map(i => getTypeInfo(i.type).label).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-[#1c2a35] pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono text-slate-400">
        <span>
          Data: {stats.totalCountries} countries, {stats.totalIncidents} incidents — cross-referenced with {responses.length} international responses, {sanctions.length} sanctions, {stations.length} police stations, {prisoners.length} political prisoners
        </span>
        <span>Tier 1-2 sources only · CC BY 4.0</span>
      </div>
    </section>
  );
};

export default DiplomaticCoercionTracker;
