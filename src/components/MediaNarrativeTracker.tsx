// @ts-nocheck — Phase 2 migration: types to be added
/**
 * MediaNarrativeTracker — Tracks evolving CCP propaganda narratives
 * across state media outlets. Searchable with timeline analysis
 * and counter-narrative resources.
 *
 * @module MediaNarrativeTracker
 */
import { useState, useMemo } from 'react';
import { dataApi } from '../services/dataApi';
import { Newspaper, Search, ChevronDown, ChevronUp, ExternalLink, Copy, Check, AlertTriangle, Eye, Shield, Globe, Scale, Megaphone } from 'lucide-react';
// MediaNarrativeTracker — Tracks CCP state media propaganda narratives,
// cross-referencing with verified evidence from political prisoners, detention
// facilities, forced labor, legal cases, and international responses data.
// All data from verified Tier 1-2 sources via dataApi. CC BY 4.0.

const NARRATIVE_CATEGORIES = [
  { id: 'all', label: 'All Narratives' },
  { id: 'denial', label: 'Denial', icon: Shield, color: 'text-red-400', desc: 'Outright denial of documented abuses' },
  { id: 'deflection', label: 'Deflection', icon: Globe, desc: 'Redirecting attention to other countries', color: 'text-orange-400' },
  { id: 'whataboutism', label: 'Whataboutism', icon: Scale, desc: 'Countering criticism with accusations', color: 'text-yellow-400' },
  { id: 'reframing', label: 'Reframing', icon: Eye, desc: 'Presenting repression as development/security', color: 'text-[#a78bfa]' },
  { id: 'intimidation', label: 'Intimidation', icon: AlertTriangle, desc: 'Threats against critics and dissidents', color: 'text-[#22d3ee]' },
];

const PROPAGANDA_NARRATIVES = [
  {
    id: 'xinjiang-vocational',
    category: 'reframing',
    narrative: '"Vocational education and training centers" in Xinjiang provide voluntary skills training',
    source: 'Xinhua, CGTN, Chinese State Council White Paper',
    firstAppeared: '2018-10',
    lastUsed: '2026-02',
    frequency: 'persistent',
    debunkSummary: 'Extensive evidence documents mass internment of 1-1.8 million Uyghurs. Leaked Chinese government cables (China Cables), satellite imagery of expanding facilities with guard towers, survivor testimonies, and UN OHCHR assessment (Aug 2022) confirm systematic detention, forced labor, surveillance, and cultural erasure.',
    evidenceType: ['detention_facilities', 'forced_labor', 'international_responses'],
    evidenceKeywords: { facilities: 'Xinjiang', companies: 'Xinjiang', responses: 'genocide' },
    counterSources: [
      { name: 'UN OHCHR Assessment', url: 'https://www.ohchr.org/en/documents/country-reports/ohchr-assessment-human-rights-concerns-xinjiang-uyghur-autonomous-region' },
      { name: 'ASPI Xinjiang Data Project', url: 'https://xjdp.aspi.org.au/' },
    ],
  },
  {
    id: 'hk-foreign-interference',
    category: 'deflection',
    narrative: 'Hong Kong protests were instigated by "foreign black hands" and "external interference"',
    source: 'People\'s Daily, Global Times, CCTV',
    firstAppeared: '2019-06',
    lastUsed: '2026-03',
    frequency: 'persistent',
    debunkSummary: 'The 2019 movement was a grassroots response to the Extradition Bill, with millions participating. Independent reporting, academic research, and the movement\'s documented leaderless structure contradict foreign instigation claims. The NSL has since been used to prosecute journalists, legislators, and activists.',
    evidenceType: ['political_prisoners', 'legal_cases'],
    evidenceKeywords: { prisoners: 'Hong Kong', cases: 'Hong Kong' },
    counterSources: [
      { name: 'Hong Kong Free Press', url: 'https://hongkongfp.com/' },
      { name: 'Human Rights Watch', url: 'https://www.hrw.org/asia/china-and-tibet/hong-kong' },
    ],
  },
  {
    id: 'nsl-stability',
    category: 'reframing',
    narrative: 'The National Security Law restored stability and prosperity to Hong Kong',
    source: 'Xinhua, China Daily, Hong Kong government',
    firstAppeared: '2020-07',
    lastUsed: '2026-03',
    frequency: 'persistent',
    debunkSummary: 'The NSL has been used to prosecute over 260 people, shut down independent media (Apple Daily, Stand News), disband civil society organizations, and silence political opposition. Press freedom indices rank Hong Kong at historic lows.',
    evidenceType: ['political_prisoners', 'legal_cases'],
    evidenceKeywords: { prisoners: 'NSL', cases: 'NSL' },
    counterSources: [
      { name: 'CPJ Press Freedom', url: 'https://cpj.org/asia/china/' },
      { name: 'Freedom House', url: 'https://freedomhouse.org/country/hong-kong' },
    ],
  },
  {
    id: 'tibet-liberation',
    category: 'reframing',
    narrative: '"Peaceful liberation" of Tibet brought economic development and modernization',
    source: 'Xinhua, China Tibet Online, State Council',
    firstAppeared: '1959-03',
    lastUsed: '2026-01',
    frequency: 'persistent',
    debunkSummary: 'Tibetans face severe restrictions on religious practice, cultural expression, movement, and political participation. Self-immolation protests (150+ since 2009), forced resettlement of nomads, mass surveillance, and the destruction of religious sites document ongoing repression.',
    evidenceType: ['political_prisoners', 'detention_facilities'],
    evidenceKeywords: { prisoners: 'Tibet', facilities: 'Tibet' },
    counterSources: [
      { name: 'Free Tibet', url: 'https://freetibet.org/' },
      { name: 'ICT', url: 'https://savetibet.org/' },
    ],
  },
  {
    id: 'forced-labor-denial',
    category: 'denial',
    narrative: 'No forced labor exists in Xinjiang — workers participate voluntarily in "poverty alleviation" programs',
    source: 'Global Times, CGTN, Chinese Embassy statements',
    firstAppeared: '2020-03',
    lastUsed: '2026-02',
    frequency: 'persistent',
    debunkSummary: 'Government documents, corporate audits, investigative journalism, and the UFLPA enforcement data reveal systematic coerced labor transfers. Over 10,000 shipments blocked under UFLPA. Major brands have been implicated through supply chain investigations.',
    evidenceType: ['forced_labor', 'international_responses'],
    evidenceKeywords: { companies: 'Xinjiang', responses: 'forced labor' },
    counterSources: [
      { name: 'ASPI Uyghurs for Sale', url: 'https://www.aspi.org.au/report/uyghurs-sale' },
      { name: 'Sheffield Hallam University', url: 'https://www.shu.ac.uk/helena-kennedy-centre-international-justice/research-and-projects/all-projects/in-broad-daylight' },
    ],
  },
  {
    id: 'taiwan-internal-affair',
    category: 'intimidation',
    narrative: '"Taiwan is an inalienable part of China" — any support for Taiwan independence will be met with military force',
    source: 'PLA Daily, Xinhua, MFA Spokesperson',
    firstAppeared: '1949-10',
    lastUsed: '2026-03',
    frequency: 'persistent',
    debunkSummary: 'Taiwan has operated as a self-governing democracy since 1949 with its own constitution, military, currency, and elected government. Opinion polls consistently show the majority of Taiwanese do not identify as Chinese. Military threats violate the UN Charter prohibition on the use of force.',
    evidenceType: ['international_responses'],
    evidenceKeywords: { responses: 'Taiwan' },
    counterSources: [
      { name: 'Taiwan Foundation for Democracy', url: 'https://www.tfd.org.tw/en' },
      { name: 'RAND Corporation', url: 'https://www.rand.org/topics/taiwan.html' },
    ],
  },
  {
    id: 'police-stations-service',
    category: 'reframing',
    narrative: 'Overseas "service stations" merely help Chinese nationals with administrative paperwork like driver\'s license renewals',
    source: 'Chinese Embassy statements, MFA Spokesperson',
    firstAppeared: '2022-09',
    lastUsed: '2025-12',
    frequency: 'recurring',
    debunkSummary: 'Safeguard Defenders documented 102+ stations across 53 countries used for transnational repression operations including coerced returns, surveillance, and intimidation of diaspora communities. Multiple countries have launched investigations and closed stations.',
    evidenceType: ['police_stations', 'international_responses', 'legal_cases'],
    evidenceKeywords: { stations: '', responses: 'police', cases: 'police' },
    counterSources: [
      { name: 'Safeguard Defenders', url: 'https://safeguarddefenders.com/en/blog/230000-policing-expands' },
      { name: 'Freedom House Report', url: 'https://freedomhouse.org/report/transnational-repression' },
    ],
  },
  {
    id: 'genocide-lie',
    category: 'denial',
    narrative: '"Genocide" accusations are "the lie of the century" fabricated by anti-China forces',
    source: 'MFA Spokesperson, Global Times, People\'s Daily',
    firstAppeared: '2021-01',
    lastUsed: '2026-02',
    frequency: 'persistent',
    debunkSummary: 'Multiple parliaments and governments have recognized the Uyghur situation as genocide (US, UK, Canada, Netherlands, Belgium, France, Lithuania). The Uyghur Tribunal (Dec 2021) found genocide beyond reasonable doubt. UN OHCHR assessment documented "serious human rights violations."',
    evidenceType: ['international_responses', 'detention_facilities'],
    evidenceKeywords: { responses: 'genocide', facilities: 'Xinjiang' },
    counterSources: [
      { name: 'Uyghur Tribunal Judgment', url: 'https://uyghurtribunal.com/wp-content/uploads/2022/01/Uyghur-Tribunal-Judgment-9th-Dec-21.pdf' },
      { name: 'Newlines Institute Legal Report', url: 'https://newlinesinstitute.org/uyghurs/the-uyghur-genocide-an-examination-of-chinas-breaches-of-the-1948-genocide-convention/' },
    ],
  },
  {
    id: 'sanctions-interference',
    category: 'whataboutism',
    narrative: 'Western sanctions are "interference in internal affairs" — what about racism/inequality in the US/UK/EU?',
    source: 'MFA Spokesperson, CGTN, Global Times',
    firstAppeared: '2020-07',
    lastUsed: '2026-03',
    frequency: 'persistent',
    debunkSummary: 'Targeted sanctions against specific officials responsible for human rights abuses are a recognized tool of international law. The "internal affairs" defense contradicts China\'s own obligations under international human rights treaties it has ratified. Whataboutism does not address the documented abuses.',
    evidenceType: ['sanctions', 'international_responses'],
    evidenceKeywords: { responses: 'sanctions' },
    counterSources: [
      { name: 'OHCHR Treaty Bodies', url: 'https://www.ohchr.org/en/treaty-bodies' },
      { name: 'Global Magnitsky Act', url: 'https://www.congress.gov/bill/114th-congress/senate-bill/284' },
    ],
  },
  {
    id: 'covid-lab-deflection',
    category: 'deflection',
    narrative: 'Calls for COVID-19 origin investigations are "politically motivated" and "anti-China"',
    source: 'MFA Spokesperson, Xinhua, Global Times',
    firstAppeared: '2020-04',
    lastUsed: '2025-06',
    frequency: 'declining',
    debunkSummary: 'The WHO, US intelligence agencies, and independent scientists have called for transparent investigations. China blocked full access for WHO investigators and destroyed early samples. The scientific community broadly supports the need for a thorough, transparent investigation into the pandemic\'s origins.',
    evidenceType: ['international_responses'],
    evidenceKeywords: { responses: 'transparency' },
    counterSources: [
      { name: 'WHO Investigation Report', url: 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/origins-of-the-virus' },
    ],
  },
  {
    id: 'media-freedom',
    category: 'denial',
    narrative: 'China has a free press — foreign journalists face no restrictions',
    source: 'MFA Spokesperson, State Council Information Office',
    firstAppeared: '2008-08',
    lastUsed: '2025-12',
    frequency: 'recurring',
    debunkSummary: 'China ranks near the bottom of press freedom indices (RSF: 172/180). Multiple foreign correspondents have been expelled. Domestic journalists face imprisonment, surveillance, and censorship. The Great Firewall blocks international news sources.',
    evidenceType: ['political_prisoners'],
    evidenceKeywords: { prisoners: 'journalist' },
    counterSources: [
      { name: 'RSF Press Freedom Index', url: 'https://rsf.org/en/country/china' },
      { name: 'FCCC Report', url: 'https://www.fccchina.org/' },
    ],
  },
  {
    id: 'apple-daily-sedition',
    category: 'reframing',
    narrative: 'Apple Daily\'s closure was a legal matter — the newspaper engaged in "seditious" activities threatening national security',
    source: 'Hong Kong government, CCTV, People\'s Daily',
    firstAppeared: '2021-06',
    lastUsed: '2026-02',
    frequency: 'recurring',
    debunkSummary: 'Apple Daily was Hong Kong\'s largest pro-democracy newspaper with a readership of millions. Its closure under the NSL represents the most significant blow to press freedom in Hong Kong\'s history. The CPJ, RSF, and international press freedom organizations unanimously condemned the closure as politically motivated.',
    evidenceType: ['political_prisoners', 'legal_cases'],
    evidenceKeywords: { prisoners: 'Apple Daily', cases: 'Apple Daily' },
    counterSources: [
      { name: 'CPJ Report', url: 'https://cpj.org/2021/06/apple-daily-closure-hong-kong/' },
      { name: 'RSF Condemnation', url: 'https://rsf.org/en/hong-kongs-apple-daily-forced-close-after-police-raids-and-asset-freezes' },
    ],
  },
];

function getEvidenceCounts(narrative, allData) {
  const counts = {};
  if (narrative.evidenceType.includes('political_prisoners')) {
    const kw = narrative.evidenceKeywords.prisoners || '';
    counts.prisoners = kw ? allData.prisoners.filter(p => {
      const text = [p.name, p.nationality, p.charges, p.details, p.location].filter(Boolean).join(' ');
      return text.toLowerCase().includes(kw.toLowerCase());
    }).length : allData.prisoners.length;
  }
  if (narrative.evidenceType.includes('detention_facilities')) {
    const kw = narrative.evidenceKeywords.facilities || '';
    counts.facilities = kw ? allData.facilities.filter(f => {
      const text = [f.name, f.region, f.province, f.type].filter(Boolean).join(' ');
      return text.toLowerCase().includes(kw.toLowerCase());
    }).length : allData.facilities.length;
  }
  if (narrative.evidenceType.includes('forced_labor')) {
    const kw = narrative.evidenceKeywords.companies || '';
    counts.companies = kw ? allData.companies.filter(c => {
      const text = [c.company, c.industry, c.evidence_summary, c.supply_chain_detail].filter(Boolean).join(' ');
      return text.toLowerCase().includes(kw.toLowerCase());
    }).length : allData.companies.length;
  }
  if (narrative.evidenceType.includes('international_responses')) {
    const kw = narrative.evidenceKeywords.responses || '';
    counts.responses = kw ? allData.responses.filter(r => {
      const text = [r.country, r.genocide_recognition, r.sanctions_imposed, r.legislative_actions, r.overall_stance].filter(Boolean).join(' ');
      return text.toLowerCase().includes(kw.toLowerCase());
    }).length : allData.responses.length;
  }
  if (narrative.evidenceType.includes('police_stations')) {
    counts.stations = allData.stations.length;
  }
  if (narrative.evidenceType.includes('legal_cases')) {
    const kw = narrative.evidenceKeywords.cases || '';
    counts.cases = kw ? allData.cases.filter(c => {
      const text = [c.case_name, c.jurisdiction, c.defendant, c.charges, c.significance].filter(Boolean).join(' ');
      return text.toLowerCase().includes(kw.toLowerCase());
    }).length : allData.cases.length;
  }
  if (narrative.evidenceType.includes('sanctions')) {
    counts.sanctions = allData.sanctions.length;
  }
  return counts;
}

const MediaNarrativeTracker = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNarrative, setExpandedNarrative] = useState(null);
  const [copied, setCopied] = useState(false);

  const prisoners = dataApi.getPoliticalPrisoners();
  const facilities = dataApi.getDetentionFacilities();
  const companies = dataApi.getForcedLaborCompanies();
  const responses = dataApi.getInternationalResponses();
  const stations = dataApi.getPoliceStations();
  const cases = dataApi.getLegalCases();
  const sanctions = dataApi.getSanctions();

  const allData = useMemo(() => ({
    prisoners, facilities, companies, responses, stations, cases, sanctions,
  }), [prisoners, facilities, companies, responses, stations, cases, sanctions]);

  const narrativesWithEvidence = useMemo(() => {
    return PROPAGANDA_NARRATIVES.map(n => ({
      ...n,
      evidenceCounts: getEvidenceCounts(n, allData),
    }));
  }, [allData]);

  const filtered = useMemo(() => {
    return narrativesWithEvidence.filter(n => {
      const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
      const matchesSearch = !searchQuery || [n.narrative, n.debunkSummary, n.source, n.category].join(' ').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [narrativesWithEvidence, selectedCategory, searchQuery]);

  const stats = useMemo(() => ({
    total: PROPAGANDA_NARRATIVES.length,
    persistent: PROPAGANDA_NARRATIVES.filter(n => n.frequency === 'persistent').length,
    categories: NARRATIVE_CATEGORIES.filter(c => c.id !== 'all').length,
    totalEvidence: Object.values(allData).reduce((sum, arr) => sum + arr.length, 0),
  }), [allData]);

  const getCategoryStyle = (catId) => NARRATIVE_CATEGORIES.find(c => c.id === catId) || NARRATIVE_CATEGORIES[0];

  const handleCopyReport = async () => {
    const lines = [
      '═══ CCP PROPAGANDA NARRATIVE ANALYSIS — INTELLIGENCE REPORT ═══',
      `Generated: ${new Date().toISOString().split('T')[0]}`,
      `Narratives tracked: ${stats.total}`,
      `Persistent narratives: ${stats.persistent}`,
      `Evidence data points: ${stats.totalEvidence}`,
      '',
      ...filtered.map(n => {
        const cat = getCategoryStyle(n.category);
        const evidenceStr = Object.entries(n.evidenceCounts).map(([k, v]) => `${k}: ${v}`).join(', ');
        return [
          `[${cat.label?.toUpperCase() || n.category.toUpperCase()}] ${n.narrative}`,
          `  Source: ${n.source}`,
          `  Evidence: ${evidenceStr}`,
          `  Debunk: ${n.debunkSummary.substring(0, 150)}...`,
          '',
        ].join('\n');
      }),
      'Source: Global Anti-CCP Resistance Hub — Tier 1-2 verified data',
      'License: CC BY 4.0',
    ];
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section aria-label="Media Narrative Tracker" className="bg-[#0a0e14] border border-[#1c2a35] p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#22d3ee]" aria-hidden="true" />
            Media Narrative Tracker
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Tracking {stats.total} CCP propaganda narratives — debunked with {stats.totalEvidence} verified data points across {prisoners.length} prisoners, {facilities.length} facilities, {companies.length} companies, {responses.length} country responses
          </p>
        </div>
        <button onClick={handleCopyReport} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#1c2a35] hover:border-[#22d3ee] text-slate-400 hover:text-[#22d3ee] transition-colors whitespace-nowrap flex-shrink-0" aria-label="Copy narrative analysis report">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy Report'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Narratives Tracked', value: stats.total, color: 'text-white' },
          { label: 'Persistent', value: stats.persistent, color: 'text-red-400' },
          { label: 'Categories', value: stats.categories, color: 'text-[#22d3ee]' },
          { label: 'Evidence Points', value: stats.totalEvidence, color: 'text-[#4afa82]' },
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
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search narratives..." className="w-full bg-[#111820] border border-[#1c2a35] text-slate-300 text-sm pl-9 pr-3 py-2 font-mono placeholder:text-slate-400 focus:border-[#22d3ee] focus:outline-none" aria-label="Search narratives" />
        </div>
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="bg-[#111820] border border-[#1c2a35] text-slate-300 text-sm px-3 py-2 font-mono focus:border-[#22d3ee] focus:outline-none" aria-label="Filter by category">
          {NARRATIVE_CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Category breakdown */}
      <div className="flex flex-wrap gap-2">
        {NARRATIVE_CATEGORIES.filter(c => c.id !== 'all').map(cat => {
          const count = PROPAGANDA_NARRATIVES.filter(n => n.category === cat.id).length;
          return (
            <button key={cat.id} onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)} className={`px-3 py-1.5 text-xs font-mono border transition-colors ${selectedCategory === cat.id ? `${cat.color} border-current bg-current/10` : 'text-slate-400 border-[#1c2a35] hover:border-slate-400'}`} aria-label={`Filter ${cat.label}`}>
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Narrative Cards */}
      <div className="space-y-3">
        <p className="text-xs text-slate-400 font-mono">{filtered.length} of {stats.total} narratives shown</p>
        {filtered.map(n => {
          const cat = getCategoryStyle(n.category);
          const isExpanded = expandedNarrative === n.id;
          const totalEvidence = Object.values(n.evidenceCounts).reduce((s, v) => s + v, 0);
          return (
            <div key={n.id} className="border border-[#1c2a35] bg-[#111820]/50">
              <button onClick={() => setExpandedNarrative(isExpanded ? null : n.id)} className="w-full text-left p-4 flex items-start justify-between gap-3" aria-expanded={isExpanded} aria-label={`${n.narrative.substring(0, 60)} — ${cat.label}`}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs font-mono px-2 py-0.5 whitespace-nowrap ${cat.color} bg-current/10`}>{cat.label?.toUpperCase()}</span>
                    <span className={`text-xs font-mono px-2 py-0.5 whitespace-nowrap ${n.frequency === 'persistent' ? 'text-red-400 bg-red-400/10' : n.frequency === 'recurring' ? 'text-yellow-400 bg-yellow-400/10' : 'text-slate-400 bg-slate-400/10'}`}>{n.frequency}</span>
                  </div>
                  <p className="text-sm text-white font-mono leading-relaxed">"{n.narrative}"</p>
                  <p className="text-xs text-slate-400 mt-1">Source: {n.source} • {totalEvidence} evidence points</p>
                </div>
                <span className="text-slate-500 flex-shrink-0 mt-1">{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</span>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-[#1c2a35]">
                  {/* Debunk */}
                  <div className="mt-3 space-y-2">
                    <h4 className="text-xs font-mono text-[#4afa82] uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" aria-hidden="true" /> Evidence-Based Debunk
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{n.debunkSummary}</p>
                  </div>

                  {/* Evidence Counts */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Cross-Referenced Evidence</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(n.evidenceCounts).map(([type, count]) => (
                        <span key={type} className="text-xs font-mono px-2 py-1 bg-[#0a0e14] border border-[#1c2a35] text-slate-300">
                          {type}: <span className="text-[#22d3ee]">{count}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Narrative Timeline</h4>
                    <div className="bg-[#0a0e14] border border-[#1c2a35] p-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">First appeared</p>
                        <p className="text-sm text-white font-mono">{n.firstAppeared}</p>
                      </div>
                      <div className="flex-1 mx-4 h-px bg-[#1c2a35] relative">
                        <div className="absolute inset-y-0 left-0 bg-red-400/30" style={{ width: '100%' }} />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Last used</p>
                        <p className="text-sm text-white font-mono">{n.lastUsed}</p>
                      </div>
                    </div>
                  </div>

                  {/* Counter-sources */}
                  {n.counterSources.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Counter-Evidence Sources</h4>
                      <div className="space-y-1">
                        {n.counterSources.map((src, i) => (
                          <a key={i} href={src.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-[#22d3ee] hover:underline">
                            <ExternalLink className="w-3 h-3" aria-hidden="true" /> {src.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-xs text-slate-400 border-t border-[#1c2a35] pt-4 space-y-1">
        <p>Data: {prisoners.length} political prisoners • {facilities.length} detention facilities • {companies.length} forced labor companies • {responses.length} country responses • {stations.length} police stations • {cases.length} legal cases</p>
        <p>Sources: Tier 1-2 verified — OHCHR, ASPI, Safeguard Defenders, CPJ, Freedom House, RSF, HRW, Amnesty International</p>
        <p>License: CC BY 4.0 • Propaganda narratives sourced from Chinese state media (Xinhua, CGTN, Global Times, People's Daily)</p>
      </div>
    </section>
  );
};

export default MediaNarrativeTracker;
