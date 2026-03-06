import { useState, useMemo } from 'react';
import { dataApi } from '../services/dataApi';
import { FileText, Users, Copy, Check, ChevronDown, ChevronUp, Globe, Shield, Scale, Search, AlertTriangle, ExternalLink, Landmark, BarChart3 } from 'lucide-react';

/**
 * PolicyBriefGenerator — Evidence-based policy brief generation
 * cross-referencing political prisoners, sanctions, forced labor,
 * detention facilities, legal cases, international responses, and
 * police stations datasets to produce actionable recommendations.
 *
 * Target audiences: Legislators, Diplomats, Corporate Compliance, Civil Society.
 * All data from verified Tier 1-2 sources via dataApi. CC BY 4.0.
 */

// ── Audience definitions ──────────────────────────────

const AUDIENCES = [
  { id: 'legislator', label: 'Legislators', icon: Landmark, description: 'Parliamentary members and legislative staff' },
  { id: 'diplomat', label: 'Diplomats', icon: Globe, description: 'Foreign ministry officials and international organizations' },
  { id: 'corporate', label: 'Corporate Compliance', icon: Shield, description: 'Supply chain officers and legal compliance teams' },
  { id: 'civil-society', label: 'Civil Society', icon: Users, description: 'NGOs, advocacy groups, and activists' },
];

// ── Topic areas ───────────────────────────────────────

const TOPICS = [
  { id: 'political-detention', label: 'Political Detention', region: 'all' },
  { id: 'forced-labor', label: 'Forced Labor & Supply Chains', region: 'xinjiang' },
  { id: 'transnational-repression', label: 'Transnational Repression', region: 'global' },
  { id: 'genocide-recognition', label: 'Genocide Recognition', region: 'xinjiang' },
  { id: 'hong-kong-nsl', label: 'Hong Kong National Security Law', region: 'hong-kong' },
  { id: 'sanctions-policy', label: 'Sanctions & Accountability', region: 'all' },
];

// ── Brief generation logic ────────────────────────────

function generateBrief(audience, topic, data) {
  const { prisoners, sanctions, companies, facilities, cases, responses, stations, officials } = data;

  const detainedCount = prisoners.filter(p => (p.status || '').toUpperCase() === 'DETAINED').length;
  const totalPrisoners = prisoners.length;
  const sanctionCount = sanctions.length;
  const companyCount = companies.length;
  const facilityCount = facilities.length;
  const caseCount = cases.length;
  const stationCount = stations.length;
  const officialCount = officials.length;

  const countriesWithSanctions = [...new Set(sanctions.map(s => s.country).filter(Boolean))];
  const countriesRecognizingGenocide = responses
    .filter(r => (r.genocide_recognition || '').toLowerCase().includes('yes') || (r.genocide_recognition || '').toLowerCase().includes('recognized'))
    .map(r => r.country);

  const brief = {
    title: '',
    executive_summary: '',
    key_findings: [],
    recommendations: [],
    evidence_citations: [],
    data_points: {},
  };

  // ── Topic-specific content ──────────────────────────
  if (topic === 'political-detention') {
    brief.title = audience === 'legislator'
      ? 'Legislative Action Required: Political Detention in China'
      : audience === 'diplomat'
        ? 'Diplomatic Brief: Political Prisoners and Arbitrary Detention'
        : audience === 'corporate'
          ? 'Due Diligence Alert: Political Detention and Business Risk'
          : 'Campaign Brief: Advocating for Political Prisoners';

    brief.executive_summary = `The CCP currently holds an estimated ${detainedCount} documented political prisoners across ${facilityCount} known detention facilities. This brief provides evidence-based recommendations for ${AUDIENCES.find(a => a.id === audience)?.label.toLowerCase() || 'stakeholders'} to address systematic political detention.`;

    brief.key_findings = [
      `${totalPrisoners} political prisoners documented with verified case files from Tier 1-2 sources`,
      `${detainedCount} currently detained, including high-profile cases under the National Security Law`,
      `${facilityCount} detention and re-education facilities mapped with satellite evidence`,
      `${caseCount} legal proceedings tracked across multiple jurisdictions`,
    ];

    brief.data_points = { prisoners: totalPrisoners, detained: detainedCount, facilities: facilityCount, cases: caseCount };

  } else if (topic === 'forced-labor') {
    brief.title = audience === 'legislator'
      ? 'Supply Chain Legislation Brief: CCP-Linked Forced Labor'
      : audience === 'corporate'
        ? 'Compliance Advisory: Forced Labor Supply Chain Risks'
        : audience === 'diplomat'
          ? 'Multilateral Brief: Addressing Forced Labor in Global Supply Chains'
          : 'Advocacy Brief: Corporate Accountability for Forced Labor';

    brief.executive_summary = `${companyCount} multinational companies have documented connections to CCP-linked forced labor programs. With ${sanctionCount} international sanctions in effect and expanding legislative frameworks, this brief outlines actionable steps for compliance and accountability.`;

    brief.key_findings = [
      `${companyCount} companies linked to forced labor through verified ASPI and government records`,
      `UFLPA enforcement has resulted in Withhold Release Orders affecting major supply chains`,
      `${countriesWithSanctions.length} countries have imposed sanctions related to Xinjiang forced labor`,
      `EU CSDDD, UK Modern Slavery Act, and comparable laws create overlapping compliance obligations`,
    ];

    brief.data_points = { companies: companyCount, sanctions: sanctionCount, countries: countriesWithSanctions.length };

  } else if (topic === 'transnational-repression') {
    brief.title = audience === 'legislator'
      ? 'Legislative Brief: CCP Transnational Repression Operations'
      : audience === 'diplomat'
        ? 'Diplomatic Advisory: Countering CCP Overseas Interference'
        : audience === 'corporate'
          ? 'Risk Assessment: CCP Influence on International Business'
          : 'Awareness Brief: Transnational Repression and Diaspora Safety';

    brief.executive_summary = `The CCP operates ${stationCount} documented overseas police service stations across multiple countries, conducting surveillance, intimidation, and forced repatriation of dissidents. This constitutes a violation of sovereignty and international law.`;

    brief.key_findings = [
      `${stationCount} overseas police stations documented by Safeguard Defenders and government investigations`,
      `Operations include surveillance, intimidation, and Operation Fox Hunt forced repatriations`,
      `${officialCount} CCP officials sanctioned for involvement in repression activities`,
      `Multiple countries have launched investigations and closed stations`,
    ];

    brief.data_points = { stations: stationCount, officials: officialCount, sanctions: sanctionCount };

  } else if (topic === 'genocide-recognition') {
    brief.title = audience === 'legislator'
      ? 'Parliamentary Brief: Uyghur Genocide Recognition and Response'
      : audience === 'diplomat'
        ? 'Multilateral Brief: Genocide Determination and International Obligations'
        : audience === 'corporate'
          ? 'Compliance Brief: Genocide-Linked Supply Chain Risks'
          : 'Advocacy Brief: Supporting Genocide Recognition';

    brief.executive_summary = `${countriesRecognizingGenocide.length > 0 ? countriesRecognizingGenocide.length : 'Multiple'} parliaments have recognized the treatment of Uyghurs as genocide. With ${facilityCount} documented detention facilities and mounting evidence, this brief outlines the case for recognition and response.`;

    brief.key_findings = [
      countriesRecognizingGenocide.length > 0
        ? `Genocide recognized by: ${countriesRecognizingGenocide.slice(0, 5).join(', ')}${countriesRecognizingGenocide.length > 5 ? ` and ${countriesRecognizingGenocide.length - 5} others` : ''}`
        : 'Multiple international bodies have assessed evidence consistent with genocide',
      `${facilityCount} detention and re-education camps documented with satellite imagery`,
      `Forced sterilization, family separation, and cultural erasure documented by multiple UN bodies`,
      `${caseCount} legal cases in international courts address genocide allegations`,
    ];

    brief.data_points = { recognitions: countriesRecognizingGenocide.length, facilities: facilityCount, cases: caseCount };

  } else if (topic === 'hong-kong-nsl') {
    const hkPrisoners = prisoners.filter(p => (p.location || '').toLowerCase().includes('hong kong') || (p.charges || '').toLowerCase().includes('nsl'));

    brief.title = audience === 'legislator'
      ? 'Legislative Brief: Hong Kong National Security Law Impact'
      : audience === 'diplomat'
        ? 'Diplomatic Assessment: Erosion of Hong Kong Autonomy'
        : audience === 'corporate'
          ? 'Business Risk Brief: Operating Under the National Security Law'
          : 'Civil Liberties Brief: The NSL and Hong Kong Freedoms';

    brief.executive_summary = `Since its imposition in June 2020, the National Security Law has been used to detain ${hkPrisoners.length > 0 ? hkPrisoners.length : 'dozens of'} activists, journalists, and pro-democracy figures. This brief assesses the law's impact and recommends responses.`;

    brief.key_findings = [
      `${hkPrisoners.length > 0 ? hkPrisoners.length : 'Multiple'} political prisoners detained under NSL or related charges`,
      'Jimmy Lai sentenced to 20 years — harshest NSL sentence to date (Feb 2026)',
      'HK47 defendants: 45 convicted, appeals dismissed, sentences of 4-10 years',
      'Press freedom index collapsed; Apple Daily, Stand News forcibly closed',
    ];

    brief.data_points = { hk_prisoners: hkPrisoners.length, nsl_year: 2020 };

  } else if (topic === 'sanctions-policy') {
    brief.title = audience === 'legislator'
      ? 'Sanctions Effectiveness Review: Holding CCP Officials Accountable'
      : audience === 'diplomat'
        ? 'Multilateral Sanctions Coordination Brief'
        : audience === 'corporate'
          ? 'Sanctions Compliance Overview: CCP-Related Designations'
          : 'Advocacy Brief: Strengthening Sanctions Regimes';

    brief.executive_summary = `${sanctionCount} sanctions have been imposed by ${countriesWithSanctions.length} countries against CCP officials and entities. This brief analyzes coverage gaps, enforcement effectiveness, and recommendations for strengthened accountability.`;

    brief.key_findings = [
      `${sanctionCount} total sanctions from ${countriesWithSanctions.length} countries`,
      `${officialCount} named officials across multiple responsibility areas`,
      `Coverage varies significantly — some officials sanctioned by 5 countries, others by only 1`,
      `Key gap: coordinated multilateral sanctions remain rare`,
    ];

    brief.data_points = { sanctions: sanctionCount, officials: officialCount, countries: countriesWithSanctions.length };
  }

  // ── Audience-specific recommendations ────────────────
  if (audience === 'legislator') {
    brief.recommendations = [
      'Introduce or co-sponsor targeted Magnitsky-style sanctions against named officials',
      'Support supply chain due diligence legislation aligned with UFLPA standards',
      'Request classified briefings on transnational repression operations',
      'Allocate funding for human rights monitoring and documentation programs',
      'Join the Inter-Parliamentary Alliance on China (IPAC) for multilateral coordination',
    ];
  } else if (audience === 'diplomat') {
    brief.recommendations = [
      'Raise cases of political prisoners in bilateral and multilateral forums',
      'Coordinate sanctions designations with Five Eyes and EU partners',
      'Support UN Human Rights Council mechanisms for independent monitoring',
      'Engage with diaspora communities to document transnational repression',
      'Establish diplomatic protections for at-risk activists and their families',
    ];
  } else if (audience === 'corporate') {
    brief.recommendations = [
      'Conduct enhanced due diligence on Xinjiang-linked supply chains per UFLPA requirements',
      'Map sub-supplier relationships through cotton, polysilicon, and electronics supply chains',
      'Establish whistleblower mechanisms for forced labor reporting',
      'Publish annual modern slavery statements exceeding minimum legal requirements',
      'Engage with industry coalitions for collective due diligence standards',
    ];
  } else {
    brief.recommendations = [
      'Amplify prisoner cases through coordinated social media campaigns with verified facts',
      'Submit evidence to UN Special Rapporteurs and treaty body mechanisms',
      'Support diaspora organizations with documentation and legal assistance',
      'Monitor and report on transnational repression incidents',
      'Build coalitions with trade unions, faith groups, and academic institutions',
    ];
  }

  // ── Source citations from data ──────────────────────
  brief.evidence_citations = [
    ...prisoners.slice(0, 3).filter(p => p.source_url).map(p => ({ label: `Case: ${p.prisoner_name || p.id}`, url: p.source_url })),
    ...cases.slice(0, 2).filter(c => c.source_url).map(c => ({ label: `Legal: ${c.case_name || c.id}`, url: c.source_url })),
    ...responses.slice(0, 2).filter(r => r.source_url).map(r => ({ label: `Response: ${r.country || r.id}`, url: r.source_url })),
  ];

  return brief;
}

// ── Component ─────────────────────────────────────────

export default function PolicyBriefGenerator() {
  const [selectedAudience, setSelectedAudience] = useState('legislator');
  const [selectedTopic, setSelectedTopic] = useState('political-detention');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({ findings: true, recommendations: true, citations: false });
  const [copied, setCopied] = useState(false);

  // ── Load all datasets ───────────────────────────────
  const allData = useMemo(() => ({
    prisoners: dataApi.getPoliticalPrisoners(),
    sanctions: dataApi.getSanctions(),
    companies: dataApi.getForcedLaborCompanies(),
    facilities: dataApi.getDetentionFacilities(),
    cases: dataApi.getLegalCases(),
    responses: dataApi.getInternationalResponses(),
    stations: dataApi.getPoliceStations(),
    officials: dataApi.getSanctionedOfficials(),
  }), []);

  // ── Generate brief ──────────────────────────────────
  const brief = useMemo(
    () => generateBrief(selectedAudience, selectedTopic, allData),
    [selectedAudience, selectedTopic, allData]
  );

  // ── Data summary stats ──────────────────────────────
  const stats = useMemo(() => ({
    datasets: 8,
    prisoners: allData.prisoners.length,
    sanctions: allData.sanctions.length,
    cases: allData.cases.length,
    companies: allData.companies.length,
  }), [allData]);

  // ── Filtered topics by search ───────────────────────
  const filteredTopics = useMemo(() => {
    if (!searchQuery) return TOPICS;
    const lower = searchQuery.toLowerCase();
    return TOPICS.filter(t => t.label.toLowerCase().includes(lower));
  }, [searchQuery]);

  // ── Toggle section ──────────────────────────────────
  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // ── Copy brief to clipboard ─────────────────────────
  const handleCopy = () => {
    const text = [
      `POLICY BRIEF: ${brief.title}`,
      `Audience: ${AUDIENCES.find(a => a.id === selectedAudience)?.label}`,
      `Generated: ${new Date().toISOString().slice(0, 10)}`,
      '',
      'EXECUTIVE SUMMARY',
      brief.executive_summary,
      '',
      'KEY FINDINGS',
      ...brief.key_findings.map((f, i) => `${i + 1}. ${f}`),
      '',
      'RECOMMENDATIONS',
      ...brief.recommendations.map((r, i) => `${i + 1}. ${r}`),
      '',
      brief.evidence_citations.length > 0 ? 'EVIDENCE CITATIONS' : '',
      ...brief.evidence_citations.map(c => `• ${c.label}: ${c.url}`),
      '',
      'Source: Global Anti-CCP Resistance Hub — Verified Tier 1-2 data. CC BY 4.0.',
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  // ── Render ──────────────────────────────────────────
  return (
    <section aria-label="Policy Brief Generator" className="bg-[#0a0e14] border border-[#1c2a35] p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#22d3ee]" aria-hidden="true" />
            Policy Brief Generator
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Evidence-based policy briefs cross-referencing {stats.datasets} verified datasets
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#1c2a35] text-slate-300 hover:border-[#22d3ee]/50 hover:text-[#22d3ee] transition-colors self-start"
          aria-label="Copy brief to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy brief'}
        </button>
      </div>

      {/* Stat bar */}
      <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <BarChart3 className="w-3.5 h-3.5 text-[#22d3ee]" aria-hidden="true" />
          {stats.prisoners} prisoners documented
        </span>
        <span aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Scale className="w-3.5 h-3.5 text-[#a78bfa]" aria-hidden="true" />
          {stats.sanctions} sanctions tracked
        </span>
        <span aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-[#4afa82]" aria-hidden="true" />
          {stats.cases} legal cases
        </span>
        <span aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-[#fbbf24]" aria-hidden="true" />
          {stats.companies} companies assessed
        </span>
      </div>

      {/* Audience selector */}
      <div>
        <h3 className="text-sm font-mono text-slate-300 mb-2">Target Audience</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {AUDIENCES.map((aud) => {
            const Icon = aud.icon;
            const isActive = selectedAudience === aud.id;
            return (
              <button
                key={aud.id}
                onClick={() => setSelectedAudience(aud.id)}
                className={`p-3 text-left border transition-colors ${
                  isActive
                    ? 'bg-[#22d3ee]/10 border-[#22d3ee]/30 text-[#22d3ee]'
                    : 'bg-[#111820] border-[#1c2a35] text-slate-400 hover:border-[#22d3ee]/20'
                }`}
                aria-pressed={isActive}
              >
                <Icon className="w-4 h-4 mb-1" aria-hidden="true" />
                <span className="block text-xs font-mono font-semibold">{aud.label}</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">{aud.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic selector with search */}
      <div>
        <h3 className="text-sm font-mono text-slate-300 mb-2">Policy Topic</h3>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111820] border border-[#1c2a35] text-slate-200 text-sm font-mono pl-10 pr-4 py-2 placeholder:text-slate-400 focus:outline-none focus:border-[#22d3ee]/50"
            aria-label="Search policy topics"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {filteredTopics.map((topic) => {
            const isActive = selectedTopic === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`p-2.5 text-left border transition-colors text-xs font-mono ${
                  isActive
                    ? 'bg-[#4afa82]/10 border-[#4afa82]/30 text-[#4afa82]'
                    : 'bg-[#111820] border-[#1c2a35] text-slate-400 hover:border-[#4afa82]/20'
                }`}
                aria-pressed={isActive}
              >
                {topic.label}
              </button>
            );
          })}
          {filteredTopics.length === 0 && (
            <p className="text-slate-400 text-xs font-mono col-span-full py-4 text-center">No topics match your search</p>
          )}
        </div>
      </div>

      {/* Generated brief */}
      <div className="bg-[#111820] border border-[#1c2a35] divide-y divide-[#1c2a35]">
        {/* Brief title */}
        <div className="p-4">
          <h3 className="text-white font-mono font-bold text-sm">{brief.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs font-mono text-slate-400">
            <span>Audience: {AUDIENCES.find(a => a.id === selectedAudience)?.label}</span>
            <span aria-hidden="true">•</span>
            <span>Generated: {new Date().toISOString().slice(0, 10)}</span>
          </div>
        </div>

        {/* Executive summary */}
        <div className="p-4">
          <h4 className="text-xs font-mono text-[#22d3ee] mb-2 flex items-center gap-1">
            <FileText className="w-3 h-3" aria-hidden="true" />
            Executive Summary
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">{brief.executive_summary}</p>
        </div>

        {/* Key data points */}
        {Object.keys(brief.data_points).length > 0 && (
          <div className="p-4">
            <div className="flex flex-wrap gap-3">
              {Object.entries(brief.data_points).map(([key, value]) => (
                <div key={key} className="bg-[#0a0e14] border border-[#1c2a35] px-3 py-2">
                  <span className="text-lg font-bold text-white font-mono">{value.toLocaleString()}</span>
                  <span className="block text-[10px] text-slate-400 font-mono">{key.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key findings (collapsible) */}
        <div>
          <button
            onClick={() => toggleSection('findings')}
            className="w-full p-4 flex items-center justify-between text-left"
            aria-expanded={expandedSections.findings}
          >
            <h4 className="text-xs font-mono text-[#4afa82] flex items-center gap-1">
              <BarChart3 className="w-3 h-3" aria-hidden="true" />
              Key Findings ({brief.key_findings.length})
            </h4>
            {expandedSections.findings
              ? <ChevronUp className="w-4 h-4 text-slate-400" />
              : <ChevronDown className="w-4 h-4 text-slate-400" />
            }
          </button>
          {expandedSections.findings && (
            <div className="px-4 pb-4 space-y-2">
              {brief.key_findings.map((finding, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="text-[#4afa82] font-mono text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
                  <p className="text-slate-300">{finding}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations (collapsible) */}
        <div>
          <button
            onClick={() => toggleSection('recommendations')}
            className="w-full p-4 flex items-center justify-between text-left"
            aria-expanded={expandedSections.recommendations}
          >
            <h4 className="text-xs font-mono text-[#a78bfa] flex items-center gap-1">
              <Scale className="w-3 h-3" aria-hidden="true" />
              Recommendations ({brief.recommendations.length})
            </h4>
            {expandedSections.recommendations
              ? <ChevronUp className="w-4 h-4 text-slate-400" />
              : <ChevronDown className="w-4 h-4 text-slate-400" />
            }
          </button>
          {expandedSections.recommendations && (
            <div className="px-4 pb-4 space-y-2">
              {brief.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="text-[#a78bfa] font-mono text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
                  <p className="text-slate-300">{rec}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Evidence citations (collapsible) */}
        {brief.evidence_citations.length > 0 && (
          <div>
            <button
              onClick={() => toggleSection('citations')}
              className="w-full p-4 flex items-center justify-between text-left"
              aria-expanded={expandedSections.citations}
            >
              <h4 className="text-xs font-mono text-[#fbbf24] flex items-center gap-1">
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                Evidence Citations ({brief.evidence_citations.length})
              </h4>
              {expandedSections.citations
                ? <ChevronUp className="w-4 h-4 text-slate-400" />
                : <ChevronDown className="w-4 h-4 text-slate-400" />
              }
            </button>
            {expandedSections.citations && (
              <div className="px-4 pb-4 space-y-1">
                {brief.evidence_citations.map((cite, i) => (
                  <a
                    key={i}
                    href={cite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-mono text-[#22d3ee] hover:text-[#22d3ee]/80 transition-colors py-1"
                  >
                    <ExternalLink className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                    {cite.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#1c2a35] pt-4">
        <p className="text-xs font-mono text-slate-400">
          <Shield className="w-3 h-3 inline mr-1" aria-hidden="true" />
          Briefs generated from {stats.datasets} verified datasets using Tier 1-2 sources only. No CCP state media cited. CC BY 4.0.
        </p>
      </div>
    </section>
  );
}
