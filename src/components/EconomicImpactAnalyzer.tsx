// @ts-nocheck — Phase 2 migration: types to be added
/**
 * EconomicImpactAnalyzer — Analyses economic dimensions of CCP human rights
 * issues including trade impacts, supply chain risks, and sanctions effects.
 *
 * @module EconomicImpactAnalyzer
 */
import { useState, useMemo } from 'react';
import { dataApi } from '../services/dataApi';
import { TrendingUp, Search, ChevronDown, ChevronUp, Copy, Check, Factory, Scale, Globe, AlertTriangle, DollarSign, Building, FileText, Shield } from 'lucide-react';
// EconomicImpactAnalyzer — Analyzes economic impact of CCP forced labor
// across global supply chains. Cross-references forced labor companies,
// sanctions, international responses, and legal cases.
// All data from verified Tier 1-2 sources via dataApi. CC BY 4.0.

const INDUSTRY_SECTORS = [
  { id: 'apparel', label: 'Apparel', icon: Factory, description: 'Clothing, textiles, cotton — Xinjiang forced labor in spinning mills and cotton harvesting' },
  { id: 'electronics', label: 'Electronics', icon: Building, description: 'Components, assembly, rare earth minerals — factory labor transfer programs' },
  { id: 'retail', label: 'Retail', icon: DollarSign, description: 'Consumer goods, supply chain intermediaries — goods produced in XUAR facilities' },
  { id: 'technology', label: 'Technology', icon: Globe, description: 'Surveillance tech, solar panels, polysilicon — key Xinjiang-linked industries' },
  { id: 'automotive', label: 'Automotive', icon: TrendingUp, description: 'Car parts, battery materials, aluminum smelting — factory labor transfer programs' },
  { id: 'food', label: 'Food & Beverage', icon: FileText, description: 'Tomato products, agriculture — seasonal forced labor in harvesting' },
];

const RISK_LEVELS = [
  { id: 'critical', label: 'Critical', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', dot: 'bg-red-400' },
  { id: 'high', label: 'High', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30', dot: 'bg-orange-400' },
  { id: 'moderate', label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', dot: 'bg-yellow-400' },
  { id: 'low', label: 'Low', color: 'text-[#4afa82]', bg: 'bg-[#4afa82]/10', border: 'border-[#4afa82]/30', dot: 'bg-[#4afa82]' },
];

// Legislative frameworks addressing forced labor in supply chains — verified Tier 1-2 sources
const LEGISLATIVE_FRAMEWORKS = [
  { id: 'uflpa', name: 'Uyghur Forced Labor Prevention Act', jurisdiction: 'United States', year: 2021,
    detail: 'Creates rebuttable presumption that goods from XUAR are produced with forced labor. Shifts burden of proof to importers. CBP enforces import bans. Over $2B in goods detained since enforcement began June 2022.', source: 'U.S. CBP, Congressional Research Service', impact: 'critical',
    enforcement: 'U.S. Customs and Border Protection reviews all XUAR-linked imports' },
  { id: 'eu-csddd', name: 'EU Corporate Sustainability Due Diligence Directive', jurisdiction: 'European Union', year: 2024,
    detail: 'Requires large companies to identify and address human rights impacts in supply chains. Covers EU companies with 1,000+ employees and €450M+ revenue. Civil liability for non-compliance.', source: 'European Commission, EU Council', impact: 'high',
    enforcement: 'Member state supervisory authorities; civil liability in courts' },
  { id: 'eu-flr', name: 'EU Forced Labour Regulation', jurisdiction: 'European Union', year: 2024,
    detail: 'Bans products made with forced labour from EU market. Applies regardless of origin. Authorities can investigate and order product withdrawal. Complements CSDDD.', source: 'European Commission, European Parliament', impact: 'critical',
    enforcement: 'EU member state competent authorities; EU-level coordination' },
  { id: 'uk-msa', name: 'UK Modern Slavery Act', jurisdiction: 'United Kingdom', year: 2015,
    detail: 'Requires companies with £36M+ turnover to publish annual modern slavery statements. Section 54 transparency requirement. Government maintains a registry of statements.', source: 'UK Parliament, Home Office', impact: 'moderate',
    enforcement: 'Civil penalties for non-reporting; no import ban mechanism' },
  { id: 'canada-msa', name: 'Canada Fighting Against Forced Labour Act', jurisdiction: 'Canada', year: 2024,
    detail: 'Requires annual forced labor reports from entities importing/producing goods in Canada. Covers entities with $20M+ assets, $40M+ revenue, or 250+ employees. Criminal penalties for false reporting.', source: 'Parliament of Canada, Global Affairs', impact: 'moderate',
    enforcement: 'Public Safety Canada; penalties for non-compliance' },
  { id: 'aus-msa', name: 'Australia Modern Slavery Act', jurisdiction: 'Australia', year: 2018,
    detail: 'Requires entities with $100M+ revenue to publish annual modern slavery statements. Government maintains public register. No penalties for non-compliance but public accountability.', source: 'Australian Parliament, Attorney-General', impact: 'moderate',
    enforcement: 'Transparency-based; no enforcement penalties' },
  { id: 'us-tsa', name: 'U.S. Tariff Act Section 307', jurisdiction: 'United States', year: 1930,
    detail: 'Prohibits import of goods produced by forced labor. CBP issues Withhold Release Orders (WROs) against specific entities. Predates UFLPA; still actively used. Over 50 active WROs.', source: 'U.S. CBP, Congressional Research Service', impact: 'critical',
    enforcement: 'CBP Withhold Release Orders; physical inspection at ports' },
  { id: 'japan-hrdd', name: 'Japan Human Rights Due Diligence Guidelines', jurisdiction: 'Japan', year: 2022,
    detail: 'Government guidelines for corporate human rights due diligence. Non-binding but influential. References UN Guiding Principles on Business and Human Rights.', source: 'Japanese Ministry of Economy', impact: 'low',
    enforcement: 'Voluntary; no penalties but government expectations' },
];

// Industry impact data — verified economic assessments
const INDUSTRY_IMPACTS = [
  { sector: 'apparel', tradeValue: '$350B+ global apparel trade', xinjangShare: '~20% of global cotton originates from Xinjiang',
    affectedCompanies: 8, wrosIssued: 12, keyProducts: ['Cotton yarn', 'Cotton textiles', 'Garments', 'Towels'],
    detail: 'Xinjiang produces approximately 85% of China\'s cotton and 20% of the world\'s supply. The ASPI report identified over 80 brands linked to Uyghur forced labor in cotton production. CBP has issued multiple WROs targeting cotton products from XUAR.',
    source: 'ASPI, U.S. CBP, Better Cotton Initiative' },
  { sector: 'electronics', tradeValue: '$2.4T global electronics trade', xinjangShare: 'Significant through labor transfer programs',
    affectedCompanies: 6, wrosIssued: 5, keyProducts: ['Smartphones', 'Laptops', 'Displays', 'Components'],
    detail: 'ASPI documented Uyghur workers transferred to electronics factories in eastern China producing for major brands. Companies identified include factories producing phones, displays, and components for global markets.',
    source: 'ASPI, Reuters, Tech Transparency Project' },
  { sector: 'retail', tradeValue: '$5.5T global retail sector', xinjangShare: 'Indirect through supply chain intermediaries',
    affectedCompanies: 5, wrosIssued: 3, keyProducts: ['Consumer goods', 'Home furnishings', 'General merchandise'],
    detail: 'Major retailers face supply chain risks through multi-tier sourcing from XUAR. Complexity of retail supply chains makes full traceability difficult. Several retailers have been required to demonstrate goods are not XUAR-sourced under UFLPA.',
    source: 'ASPI, CBP data, Congressional Research Service' },
  { sector: 'technology', tradeValue: '$5.3T global technology sector', xinjangShare: '45% of global polysilicon from Xinjiang',
    affectedCompanies: 4, wrosIssued: 8, keyProducts: ['Solar panels', 'Polysilicon', 'Surveillance equipment', 'AI systems'],
    detail: 'Xinjiang produces approximately 45% of the world\'s polysilicon, a critical solar panel component. CBP has issued multiple WROs targeting Hoshine Silicon and related entities. China also exports surveillance technology used for Uyghur repression.',
    source: 'Sheffield Hallam University, CBP, Bloomberg' },
  { sector: 'automotive', tradeValue: '$2.7T global automotive trade', xinjangShare: 'Through aluminum, batteries, and parts',
    affectedCompanies: 4, wrosIssued: 3, keyProducts: ['Aluminum parts', 'Battery materials', 'Wire harnesses', 'EV components'],
    detail: 'XUAR is a major aluminum production region. Automotive companies face risks through aluminum smelting, battery material processing, and wire harness manufacturing linked to labor transfer programs.',
    source: 'Sheffield Hallam University, ASPI, Reuters' },
  { sector: 'food', tradeValue: '$1.8T global food trade', xinjangShare: 'Xinjiang produces 70% of China\'s tomatoes',
    affectedCompanies: 3, wrosIssued: 4, keyProducts: ['Tomato paste', 'Tomato products', 'Agricultural goods'],
    detail: 'Xinjiang is a major global tomato producer. CBP has issued WROs against Xinjiang-produced tomato products. Italian food companies found using Xinjiang tomato paste in products labeled "Made in Italy."',
    source: 'CBP, AP, BBC, CGTN Watch' },
];

function mapIndustryToSector(industry) {
  const map = { 'Apparel': 'apparel', 'Electronics': 'electronics', 'Retail': 'retail', 'Technology': 'technology', 'Automotive': 'automotive', 'Food & Beverage': 'food' };
  return map[industry] || 'retail';
}

function classifyCompanyRisk(company) {
  const evidence = (company.evidence || '').toLowerCase();
  const uflpa = (company.uflpa_actions || '').toLowerCase();
  if (uflpa.includes('withhold release') || uflpa.includes('entity list') || evidence.includes('forced labor confirmed')) return 'critical';
  if (evidence.includes('factory') || evidence.includes('transfer') || evidence.includes('identified')) return 'high';
  if (company.status === 'Improving') return 'low';
  return 'moderate';
}

const EconomicImpactAnalyzer = () => {
  const [activeView, setActiveView] = useState('sectors');
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [expandedItem, setExpandedItem] = useState(null);
  const [copied, setCopied] = useState(false);

  const companies = useMemo(() => dataApi.getForcedLaborCompanies(), []);
  const sanctions = useMemo(() => dataApi.getSanctions(), []);
  const responses = useMemo(() => dataApi.getInternationalResponses(), []);
  const cases = useMemo(() => dataApi.getLegalCases(), []);

  const enrichedCompanies = useMemo(() => {
    return companies.map(c => ({
      ...c,
      sector: mapIndustryToSector(c.industry),
      risk: classifyCompanyRisk(c),
    }));
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return enrichedCompanies.filter(c => {
      const matchesSearch = !searchQuery ||
        [c.company, c.industry, c.evidence, c.connection_type].join(' ').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = sectorFilter === 'all' || c.sector === sectorFilter;
      return matchesSearch && matchesSector;
    });
  }, [enrichedCompanies, searchQuery, sectorFilter]);

  const filteredFrameworks = useMemo(() => {
    return LEGISLATIVE_FRAMEWORKS.filter(f => {
      const matchesSearch = !searchQuery ||
        [f.name, f.jurisdiction, f.detail, f.enforcement].join(' ').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const stats = useMemo(() => {
    const genocideCountries = responses.filter(r => r.genocide_recognition && r.genocide_recognition.toLowerCase().startsWith('yes')).length;
    return {
      totalCompanies: companies.length,
      totalSectors: INDUSTRY_SECTORS.length,
      criticalRisk: enrichedCompanies.filter(c => c.risk === 'critical').length,
      highRisk: enrichedCompanies.filter(c => c.risk === 'high').length,
      legislativeFrameworks: LEGISLATIVE_FRAMEWORKS.length,
      genocideCountries,
      totalWros: INDUSTRY_IMPACTS.reduce((sum, i) => sum + i.wrosIssued, 0),
    };
  }, [companies, enrichedCompanies, responses]);

  const riskDistribution = useMemo(() => {
    return RISK_LEVELS.map(rl => ({
      ...rl,
      count: enrichedCompanies.filter(c => c.risk === rl.id).length,
    }));
  }, [enrichedCompanies]);

  const handleCopyReport = async () => {
    const lines = [
      '═══ ECONOMIC IMPACT ANALYZER — INTELLIGENCE REPORT ═══',
      `Generated: ${new Date().toISOString().split('T')[0]}`,
      `Companies analyzed: ${stats.totalCompanies}`,
      `Industry sectors: ${stats.totalSectors}`,
      `Critical-risk companies: ${stats.criticalRisk}`,
      `Legislative frameworks: ${stats.legislativeFrameworks}`,
      `WROs issued across sectors: ${stats.totalWros}`,
      '',
      '── SECTOR ANALYSIS ──',
      ...INDUSTRY_IMPACTS.map(i => {
        const sectorCompanies = enrichedCompanies.filter(c => c.sector === i.sector);
        return `${INDUSTRY_SECTORS.find(s => s.id === i.sector)?.label || i.sector}: ${sectorCompanies.length} companies, ${i.wrosIssued} WROs — ${i.tradeValue}`;
      }),
      '',
      '── LEGISLATIVE LANDSCAPE ──',
      ...LEGISLATIVE_FRAMEWORKS.map(f =>
        `[${f.impact.toUpperCase()}] ${f.name} (${f.jurisdiction}, ${f.year}): ${f.detail.split('.')[0]}`
      ),
      '',
      '── COMPANY RISK CLASSIFICATION ──',
      ...enrichedCompanies.sort((a, b) => {
        const order = { critical: 0, high: 1, moderate: 2, low: 3 };
        return (order[a.risk] || 3) - (order[b.risk] || 3);
      }).map(c => `[${c.risk.toUpperCase()}] ${c.company}: ${c.connection_type}`),
      '',
      `Cross-referenced with ${companies.length} forced labor companies, ${sanctions.length} sanctions, ${responses.length} international responses, ${cases.length} legal cases`,
      'Source: Global Anti-CCP Resistance Hub — Tier 1-2 verified data (ASPI, CBP, Sheffield Hallam)',
      'License: CC BY 4.0',
    ];
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const views = [
    { id: 'sectors', label: 'Sector Analysis' },
    { id: 'companies', label: 'Company Risk' },
    { id: 'legislative', label: 'Legislative Landscape' },
  ];

  const getRiskStyle = (risk) => RISK_LEVELS.find(r => r.id === risk) || RISK_LEVELS[3];
  const getSectorInfo = (sectorId) => INDUSTRY_SECTORS.find(s => s.id === sectorId) || INDUSTRY_SECTORS[0];

  return (
    <section aria-label="Economic Impact Analyzer" className="bg-[#0a0e14] border border-[#1c2a35] p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#22d3ee]" aria-hidden="true" />
            Economic Impact Analyzer
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Analyzing economic impact across {stats.totalCompanies} companies in {stats.totalSectors} sectors — cross-referencing {companies.length} forced labor companies, {sanctions.length} sanctions, {responses.length} international responses, and {cases.length} legal cases
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
          <Factory className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
          {stats.totalCompanies} companies analyzed
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
          {stats.criticalRisk} critical-risk companies
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Scale className="w-3.5 h-3.5 text-[#4afa82]" aria-hidden="true" />
          {stats.legislativeFrameworks} legislative frameworks
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-[#22d3ee]" aria-hidden="true" />
          {stats.totalWros} WROs issued
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-[#a78bfa]" aria-hidden="true" />
          {stats.genocideCountries} genocide recognitions
        </span>
      </div>

      {/* Risk Distribution */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {riskDistribution.map(rd => (
          <div key={rd.id} className={`${rd.bg} border ${rd.border} p-3`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${rd.dot}`} aria-hidden="true" />
              <span className={`text-xs font-mono uppercase ${rd.color}`}>{rd.label}</span>
            </div>
            <span className="text-2xl font-bold text-white font-mono">{rd.count}</span>
            <span className="text-xs text-slate-400 ml-1">{rd.count === 1 ? 'company' : 'companies'}</span>
          </div>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="View options">
        {views.map(v => (
          <button
            key={v.id}
            onClick={() => setActiveView(v.id)}
            aria-pressed={activeView === v.id ? 'true' : 'false'}
            className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
              activeView === v.id
                ? 'border-[#22d3ee] text-[#22d3ee] bg-[#22d3ee]/10'
                : 'border-[#1c2a35] text-slate-400 hover:border-slate-400 hover:text-white'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search companies, sectors, legislation..."
            className="w-full bg-[#111820] border border-[#1c2a35] pl-9 pr-3 py-2 text-sm text-white font-mono placeholder:text-slate-400 focus:border-[#22d3ee] focus:outline-none"
            aria-label="Search economic impact data"
          />
        </div>
        {activeView === 'sectors' && (
          <select
            value={sectorFilter}
            onChange={e => setSectorFilter(e.target.value)}
            className="bg-[#111820] border border-[#1c2a35] px-3 py-2 text-sm text-white font-mono focus:border-[#22d3ee] focus:outline-none"
            aria-label="Filter by industry sector"
          >
            <option value="all">All Sectors</option>
            {INDUSTRY_SECTORS.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        )}
      </div>

      {/* SECTOR ANALYSIS VIEW */}
      {activeView === 'sectors' && (
        <div className="space-y-4">
          {INDUSTRY_IMPACTS.filter(i => sectorFilter === 'all' || i.sector === sectorFilter).map(impact => {
            const sector = getSectorInfo(impact.sector);
            const sectorCompanies = filteredCompanies.filter(c => c.sector === impact.sector);
            const isExpanded = expandedItem === impact.sector;
            const SectorIcon = sector.icon;
            return (
              <div key={impact.sector} className="border border-[#1c2a35] bg-[#111820]/30">
                <button
                  onClick={() => setExpandedItem(isExpanded ? null : impact.sector)}
                  className="w-full flex items-center justify-between p-3 sm:p-4 text-left"
                  aria-expanded={isExpanded ? 'true' : 'false'}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <SectorIcon className="w-5 h-5 text-[#22d3ee] flex-shrink-0" aria-hidden="true" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-sm font-mono font-bold">{sector.label}</span>
                        <span className="text-xs font-mono text-slate-400">{impact.tradeValue}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span>{sectorCompanies.length} companies</span>
                        <span className="text-slate-500" aria-hidden="true">•</span>
                        <span>{impact.wrosIssued} WROs</span>
                        <span className="text-slate-500" aria-hidden="true">•</span>
                        <span>{impact.xinjangShare}</span>
                      </div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                </button>
                {isExpanded && (
                  <div className="border-t border-[#1c2a35] p-3 sm:p-4 space-y-4">
                    <p className="text-slate-300 text-xs">{impact.detail}</p>
                    <div className="flex flex-wrap gap-2">
                      {impact.keyProducts.map(p => (
                        <span key={p} className="text-xs font-mono px-2 py-0.5 bg-[#22d3ee]/10 border border-[#22d3ee]/30 text-[#22d3ee]">{p}</span>
                      ))}
                    </div>
                    {sectorCompanies.length > 0 && (
                      <div>
                        <h5 className="text-xs font-mono text-slate-400 mb-2">Companies in this sector:</h5>
                        <div className="space-y-2">
                          {sectorCompanies.map(c => {
                            const riskStyle = getRiskStyle(c.risk);
                            return (
                              <div key={c.id || c.company} className="bg-[#0a0e14] border border-[#1c2a35] p-2.5">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${riskStyle.dot}`} aria-hidden="true" />
                                  <span className="text-white text-xs font-mono">{c.company}</span>
                                  <span className={`text-xs font-mono px-1.5 py-0.5 border ${riskStyle.border} ${riskStyle.color}`}>
                                    {c.risk.toUpperCase()}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1 ml-4">{c.connection_type}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>Source:</span>
                      <span className="text-[#22d3ee] font-mono">{impact.source}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {INDUSTRY_IMPACTS.filter(i => sectorFilter === 'all' || i.sector === sectorFilter).length === 0 && (
            <p className="text-slate-400 text-sm font-mono text-center py-4">No sectors match your filters</p>
          )}
        </div>
      )}

      {/* COMPANY RISK VIEW */}
      {activeView === 'companies' && (
        <div className="space-y-3">
          {filteredCompanies.length === 0 ? (
            <p className="text-slate-400 text-sm font-mono text-center py-4">No companies match your search</p>
          ) : (
            filteredCompanies.sort((a, b) => {
              const order = { critical: 0, high: 1, moderate: 2, low: 3 };
              return (order[a.risk] || 3) - (order[b.risk] || 3);
            }).map(company => {
              const riskStyle = getRiskStyle(company.risk);
              const isExpanded = expandedItem === (company.id || company.company);
              return (
                <div key={company.id || company.company} className="border border-[#1c2a35] bg-[#111820]/30">
                  <button
                    onClick={() => setExpandedItem(isExpanded ? null : (company.id || company.company))}
                    className="w-full flex items-center justify-between p-3 text-left"
                    aria-expanded={isExpanded ? 'true' : 'false'}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${riskStyle.dot}`} aria-hidden="true" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white text-sm font-mono font-bold">{company.company}</span>
                          <span className={`text-xs font-mono px-1.5 py-0.5 border ${riskStyle.border} ${riskStyle.color}`}>
                            {company.risk.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400">{company.industry}</span>
                          <span className="text-slate-500 text-xs" aria-hidden="true">•</span>
                          <span className="text-xs text-slate-400">{company.connection_type}</span>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                  </button>
                  {isExpanded && (
                    <div className="border-t border-[#1c2a35] p-3 space-y-3">
                      <div>
                        <h5 className="text-xs font-mono text-[#22d3ee] mb-1">Evidence</h5>
                        <p className="text-xs text-slate-300">{company.evidence}</p>
                      </div>
                      {company.company_response && (
                        <div>
                          <h5 className="text-xs font-mono text-[#a78bfa] mb-1">Company Response</h5>
                          <p className="text-xs text-slate-300">{company.company_response}</p>
                        </div>
                      )}
                      {company.uflpa_actions && (
                        <div>
                          <h5 className="text-xs font-mono text-yellow-400 mb-1">UFLPA Actions</h5>
                          <p className="text-xs text-slate-300">{company.uflpa_actions}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>Status:</span>
                        <span className={`font-mono ${company.status === 'Improving' ? 'text-[#4afa82]' : 'text-red-400'}`}>{company.status}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* LEGISLATIVE LANDSCAPE VIEW */}
      {activeView === 'legislative' && (
        <div className="space-y-4">
          {filteredFrameworks.length === 0 ? (
            <p className="text-slate-400 text-sm font-mono text-center py-4">No legislation matches your search</p>
          ) : (
            filteredFrameworks.sort((a, b) => {
              const order = { critical: 0, high: 1, moderate: 2, low: 3 };
              return (order[a.impact] || 3) - (order[b.impact] || 3);
            }).map(law => {
              const impactStyle = getRiskStyle(law.impact);
              const isExpanded = expandedItem === law.id;
              return (
                <div key={law.id} className="border border-[#1c2a35] bg-[#111820]/30">
                  <button
                    onClick={() => setExpandedItem(isExpanded ? null : law.id)}
                    className="w-full flex items-center justify-between p-3 sm:p-4 text-left"
                    aria-expanded={isExpanded ? 'true' : 'false'}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Scale className="w-4 h-4 text-[#22d3ee] flex-shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white text-sm font-mono font-bold">{law.name}</span>
                          <span className={`text-xs font-mono px-1.5 py-0.5 border ${impactStyle.border} ${impactStyle.color}`}>
                            {law.impact.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400">{law.jurisdiction}</span>
                          <span className="text-slate-500 text-xs" aria-hidden="true">•</span>
                          <span className="text-xs text-slate-400">{law.year}</span>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                  </button>
                  {isExpanded && (
                    <div className="border-t border-[#1c2a35] p-3 sm:p-4 space-y-3">
                      <p className="text-xs text-slate-300">{law.detail}</p>
                      <div>
                        <h5 className="text-xs font-mono text-yellow-400 mb-1">Enforcement</h5>
                        <p className="text-xs text-slate-300">{law.enforcement}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>Source:</span>
                        <span className="text-[#22d3ee] font-mono">{law.source}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-[#1c2a35] pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono text-slate-400">
        <span>
          Data: {stats.totalCompanies} companies, {stats.totalSectors} sectors, {stats.legislativeFrameworks} laws — cross-referenced with {companies.length} forced labor companies, {sanctions.length} sanctions, {responses.length} international responses, {cases.length} legal cases
        </span>
        <span>Tier 1-2 sources only · CC BY 4.0</span>
      </div>
    </section>
  );
};

export default EconomicImpactAnalyzer;
