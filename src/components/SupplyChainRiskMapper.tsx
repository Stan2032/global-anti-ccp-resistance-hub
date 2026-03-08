// @ts-nocheck — Phase 2 migration: types to be added
import { useState, useMemo } from 'react';
import { dataApi } from '../services/dataApi';
import { Factory, Search, ChevronDown, ChevronUp, Copy, Check, AlertTriangle, Shield, ExternalLink, BarChart3, Globe, Package, Scale, Layers } from 'lucide-react';

/**
 * SupplyChainRiskMapper — Corporate supply chain risk analysis
 * cross-referencing forced labour, sanctions, and international responses.
 * Risk classification, industry breakdown, UFLPA tracking, legal landscape.
 * All data sourced from verified JSON via dataApi. CC BY 4.0.
 */

// ── Risk classification ───────────────────────────────

const RISK_LEVELS = ['Critical', 'High', 'Moderate', 'Low'];

const RISK_STYLES = {
  Critical: { badge: 'bg-red-400/20 text-red-400 border border-red-400/30', dot: 'bg-red-400', bar: 'bg-red-400', label: 'Critical Risk', description: 'Direct evidence of forced labor + active enforcement' },
  High: { badge: 'bg-orange-400/20 text-orange-400 border border-orange-400/30', dot: 'bg-orange-400', bar: 'bg-orange-400', label: 'High Risk', description: 'Supply chain links to forced labor with documented evidence' },
  Moderate: { badge: 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30', dot: 'bg-yellow-400', bar: 'bg-yellow-400', label: 'Moderate Risk', description: 'Indirect connections or pending investigations' },
  Low: { badge: 'bg-[#4afa82]/20 text-[#4afa82] border border-[#4afa82]/30', dot: 'bg-[#4afa82]', bar: 'bg-[#4afa82]', label: 'Low Risk', description: 'No current forced labor evidence' },
};

// ── Key legislative frameworks ────────────────────────

const KEY_LEGISLATION = [
  { id: 'uflpa', name: 'Uyghur Forced Labor Prevention Act (UFLPA)', country: 'United States', year: 2021, scope: 'Presumes all goods from Xinjiang use forced labor; importers must prove otherwise', enforcement: 'CBP Withhold Release Orders, Entity List', status: 'Active' },
  { id: 'eu-csddd', name: 'EU Corporate Sustainability Due Diligence Directive', country: 'European Union', year: 2024, scope: 'Mandatory human rights due diligence for large companies operating in EU', enforcement: 'Civil liability, administrative sanctions', status: 'Active' },
  { id: 'uk-msa', name: 'UK Modern Slavery Act', country: 'United Kingdom', year: 2015, scope: 'Requires supply chain transparency statements from large companies', enforcement: 'Mandatory reporting, civil enforcement', status: 'Active' },
  { id: 'canada-s24', name: 'Canada Fighting Against Forced Labour Act (Bill S-211)', country: 'Canada', year: 2023, scope: 'Requires reporting on forced labor in supply chains', enforcement: 'Annual reporting obligation, fines for non-compliance', status: 'Active' },
  { id: 'australia-msa', name: 'Australia Modern Slavery Act', country: 'Australia', year: 2018, scope: 'Mandatory reporting on modern slavery risks in supply chains', enforcement: 'Annual statements, government registry', status: 'Active' },
];

// ── Helpers ───────────────────────────────────────────

function classifyRisk(company) {
  const status = (company.status || '').toLowerCase();
  const uflpa = (company.uflpa_actions || '').toLowerCase();
  const evidence = (company.evidence || '').toLowerCase();
  const connection = (company.connection_type || '').toLowerCase();

  // Critical: direct forced labor evidence + active UFLPA enforcement
  if (
    (uflpa.includes('withhold release') || uflpa.includes('entity list') || uflpa.includes('wro')) &&
    (evidence.includes('forced labor') || evidence.includes('forced labour') || evidence.includes('uyghur'))
  ) {
    return 'Critical';
  }

  // High: documented evidence of forced labor in supply chain
  if (
    status === 'concern' &&
    (evidence.includes('forced labor') || evidence.includes('forced labour') ||
     evidence.includes('uyghur') || evidence.includes('aspi'))
  ) {
    return 'High';
  }

  // Moderate: indirect links or pending investigation
  if (
    connection.includes('supply chain') || connection.includes('indirect') ||
    status === 'concern' || status === 'monitoring'
  ) {
    return 'Moderate';
  }

  return 'Low';
}

function getIndustryIcon(industry) {
  const map = {
    Apparel: '👕',
    Technology: '💻',
    Electronics: '📱',
    Automotive: '🚗',
    Energy: '⚡',
    Solar: '☀️',
    Retail: '🏪',
    Food: '🍽️',
  };
  return map[industry] || '🏭';
}

// ── Component ─────────────────────────────────────────

export default function SupplyChainRiskMapper() {
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [activeView, setActiveView] = useState('companies');
  const [copied, setCopied] = useState(false);

  // ── Fetch & enrich data ─────────────────────────────

  const companies = useMemo(() => {
    const raw = dataApi.getForcedLaborCompanies();
    return raw.map((c) => ({
      ...c,
      riskLevel: classifyRisk(c),
    }));
  }, []);

  const sanctions = useMemo(() => dataApi.getSanctions(), []);
  const responses = useMemo(() => dataApi.getInternationalResponses(), []);

  // ── Derived metrics ─────────────────────────────────

  const industries = useMemo(() => {
    const set = new Set(companies.map((c) => c.industry).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [companies]);

  const riskDistribution = useMemo(() => {
    const dist = { Critical: 0, High: 0, Moderate: 0, Low: 0 };
    companies.forEach((c) => { dist[c.riskLevel]++; });
    return dist;
  }, [companies]);

  const industryRisk = useMemo(() => {
    const map = {};
    companies.forEach((c) => {
      const ind = c.industry || 'Unknown';
      if (!map[ind]) map[ind] = { industry: ind, total: 0, Critical: 0, High: 0, Moderate: 0, Low: 0 };
      map[ind].total++;
      map[ind][c.riskLevel]++;
    });
    return Object.values(map).sort((a, b) => {
      const aScore = a.Critical * 4 + a.High * 3 + a.Moderate * 2 + a.Low;
      const bScore = b.Critical * 4 + b.High * 3 + b.Moderate * 2 + b.Low;
      return bScore - aScore;
    });
  }, [companies]);

  const countriesWithLegislation = useMemo(() => {
    return responses.filter(
      (r) => r.legislative_actions && r.legislative_actions.toLowerCase().includes('forced')
    ).length;
  }, [responses]);

  // ── Filtered data ───────────────────────────────────

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch = !searchQuery || [c.company, c.industry, c.connection_type, c.evidence, c.status]
        .join(' ').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIndustry = industryFilter === 'all' || c.industry === industryFilter;
      const matchesRisk = riskFilter === 'all' || c.riskLevel === riskFilter;
      return matchesSearch && matchesIndustry && matchesRisk;
    });
  }, [companies, searchQuery, industryFilter, riskFilter]);

  // ── Actions ─────────────────────────────────────────

  const handleCopy = () => {
    const lines = [
      'Supply Chain Risk Assessment — Global Anti-CCP Resistance Hub',
      `Generated: ${new Date().toISOString().slice(0, 10)}`,
      `Total companies assessed: ${companies.length}`,
      `Risk distribution: ${RISK_LEVELS.map((l) => `${l}: ${riskDistribution[l]}`).join(', ')}`,
      '',
      ...filtered.map((c) =>
        `• ${c.company || c.id} [${c.riskLevel}] (${c.industry || 'N/A'})\n  Connection: ${c.connection_type || 'N/A'}\n  UFLPA: ${c.uflpa_actions || 'None'}\n  Source: ${c.source_url || 'N/A'}`
      ),
      '',
      'All data verified from Tier 1-2 sources. CC BY 4.0 — Attribution required.',
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  // ── Render ──────────────────────────────────────────

  return (
    <section aria-label="Supply Chain Risk Mapper" className="bg-[#0a0e14] border border-[#1c2a35] p-4 sm:p-6 space-y-6">

      {/* ── Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Factory className="w-5 h-5 text-[#22d3ee]" aria-hidden="true" />
            Supply Chain Risk Mapper
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Cross-referencing {companies.length} companies against forced labor data, sanctions, and {KEY_LEGISLATION.length} legislative frameworks
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#1c2a35] text-slate-300 hover:border-[#22d3ee]/50 hover:text-[#22d3ee] transition-colors self-start"
          aria-label="Copy risk assessment to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy report'}
        </button>
      </div>

      {/* ── Summary cards ──────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {RISK_LEVELS.map((level) => (
          <div key={level} className="bg-[#111820] border border-[#1c2a35] p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 ${RISK_STYLES[level].dot}`} aria-hidden="true" />
              <span className="text-xs font-mono text-slate-400">{RISK_STYLES[level].label}</span>
            </div>
            <span className="text-2xl font-bold text-white font-mono">{riskDistribution[level]}</span>
            <p className="text-xs text-slate-400 mt-1">{RISK_STYLES[level].description}</p>
          </div>
        ))}
      </div>

      {/* ── Stat bar ───────────────────────────────── */}
      <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <Package className="w-3.5 h-3.5 text-[#22d3ee]" aria-hidden="true" />
          {companies.length} companies assessed
        </span>
        <span className="flex items-center gap-1" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Scale className="w-3.5 h-3.5 text-[#a78bfa]" aria-hidden="true" />
          {KEY_LEGISLATION.length} legislative frameworks
        </span>
        <span className="flex items-center gap-1" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-[#4afa82]" aria-hidden="true" />
          {sanctions.length} sanctions tracked
        </span>
        <span className="flex items-center gap-1" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-[#fbbf24]" aria-hidden="true" />
          {countriesWithLegislation} countries with forced labor laws
        </span>
      </div>

      {/* ── View toggle ────────────────────────────── */}
      <div className="flex space-x-1 bg-[#111820]/50 border border-[#1c2a35] p-1">
        {[
          { id: 'companies', label: 'Company Risk', icon: Factory },
          { id: 'industries', label: 'Industry Breakdown', icon: BarChart3 },
          { id: 'legislation', label: 'Legal Landscape', icon: Scale },
        ].map((v) => {
          const Icon = v.icon;
          return (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              className={`flex items-center gap-1.5 flex-1 px-3 py-2 text-xs font-mono transition-colors ${
                activeView === v.id
                  ? 'bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/30'
                  : 'text-slate-400 hover:text-slate-300 border border-transparent'
              }`}
              aria-pressed={activeView === v.id}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              {v.label}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* COMPANY RISK VIEW                              */}
      {/* ═══════════════════════════════════════════════ */}
      {activeView === 'companies' && (
        <div className="space-y-4">

          {/* ── Search + filters ───────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search companies, industries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111820] border border-[#1c2a35] text-slate-200 text-sm font-mono pl-10 pr-4 py-2.5 placeholder:text-slate-400 focus:outline-none focus:border-[#22d3ee]/50"
                aria-label="Search companies"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="bg-[#111820] border border-[#1c2a35] text-slate-300 text-xs font-mono px-3 py-2 focus:outline-none focus:border-[#22d3ee]/50"
                aria-label="Filter by industry"
              >
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind === 'all' ? 'All Industries' : ind}</option>
                ))}
              </select>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-[#111820] border border-[#1c2a35] text-slate-300 text-xs font-mono px-3 py-2 focus:outline-none focus:border-[#22d3ee]/50"
                aria-label="Filter by risk level"
              >
                <option value="all">All Risk Levels</option>
                {RISK_LEVELS.map((level) => (
                  <option key={level} value={level}>{level} ({riskDistribution[level]})</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Results count ──────────────────────── */}
          <p className="text-xs font-mono text-slate-400">
            Showing {filtered.length} of {companies.length} companies
          </p>

          {/* ── Company cards ──────────────────────── */}
          <div className="space-y-2">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-sm font-mono">
                No companies match your filters. Try broadening your search.
              </div>
            )}

            {filtered.map((c) => {
              const isExpanded = expandedId === c.id;
              const style = RISK_STYLES[c.riskLevel];

              return (
                <div key={c.id} className="bg-[#111820] border border-[#1c2a35] hover:border-[#22d3ee]/30 transition-colors">
                  {/* Card header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : c.id)}
                    className="w-full text-left p-4 flex items-start gap-3"
                    aria-expanded={isExpanded}
                    aria-label={`${c.company || c.id} — ${c.riskLevel} risk`}
                  >
                    {/* Industry icon */}
                    <span className="text-lg flex-shrink-0 mt-0.5" aria-hidden="true">
                      {getIndustryIcon(c.industry)}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-mono font-semibold text-sm">{c.company || c.id}</h3>
                        <span className={`px-1.5 py-0.5 text-[10px] font-mono ${style.badge}`}>
                          {c.riskLevel.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                        {c.connection_type || 'No connection type documented'}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-mono flex-wrap">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3" aria-hidden="true" />
                          {c.industry || 'N/A'}
                        </span>
                        {c.status && (
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                            {c.status}
                          </span>
                        )}
                        {c.uflpa_actions && c.uflpa_actions !== 'N/A' && (
                          <span className="flex items-center gap-1 text-[#fbbf24]">
                            <Scale className="w-3 h-3" aria-hidden="true" />
                            UFLPA Action
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-slate-400 flex-shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-[#1c2a35] p-4 space-y-4">
                      {/* Evidence */}
                      {c.evidence && (
                        <div>
                          <h4 className="text-xs font-mono text-slate-300 mb-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-[#fbbf24]" aria-hidden="true" />
                            Evidence
                          </h4>
                          <p className="text-sm text-slate-400 leading-relaxed">{c.evidence}</p>
                        </div>
                      )}

                      {/* Company response */}
                      {c.company_response && (
                        <div>
                          <h4 className="text-xs font-mono text-slate-300 mb-1">Company Response</h4>
                          <p className="text-sm text-slate-400 leading-relaxed">{c.company_response}</p>
                        </div>
                      )}

                      {/* UFLPA actions */}
                      {c.uflpa_actions && (
                        <div className="bg-[#fbbf24]/5 border border-[#fbbf24]/20 p-3">
                          <h4 className="text-xs font-mono text-[#fbbf24] mb-1 flex items-center gap-1">
                            <Scale className="w-3 h-3" aria-hidden="true" />
                            UFLPA Enforcement Status
                          </h4>
                          <p className="text-sm text-slate-300">{c.uflpa_actions}</p>
                        </div>
                      )}

                      {/* Risk assessment */}
                      <div className={`p-3 border ${style.badge}`}>
                        <h4 className="text-xs font-mono mb-1 flex items-center gap-1">
                          <Shield className="w-3 h-3" aria-hidden="true" />
                          Risk Assessment: {style.label}
                        </h4>
                        <p className="text-xs text-slate-300">{style.description}</p>
                      </div>

                      {/* Source */}
                      {c.source_url && (
                        <a
                          href={c.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono border border-[#22d3ee]/30 text-[#22d3ee] hover:bg-[#22d3ee]/10 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                          View source evidence
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* INDUSTRY BREAKDOWN VIEW                        */}
      {/* ═══════════════════════════════════════════════ */}
      {activeView === 'industries' && (
        <div className="space-y-4">
          <p className="text-xs font-mono text-slate-400">
            Risk distribution across {industryRisk.length} industry sectors
          </p>

          {industryRisk.map((ind) => {
            const _maxCount = Math.max(...industryRisk.map((i) => i.total));
            return (
              <div key={ind.industry} className="bg-[#111820] border border-[#1c2a35] p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-mono text-sm flex items-center gap-2">
                    <span aria-hidden="true">{getIndustryIcon(ind.industry)}</span>
                    {ind.industry}
                  </h3>
                  <span className="text-slate-400 text-xs font-mono">{ind.total} companies</span>
                </div>

                {/* Stacked risk bar */}
                <div className="flex h-3 overflow-hidden bg-[#0a0e14] border border-[#1c2a35]">
                  {RISK_LEVELS.map((level) => {
                    const pct = ind.total > 0 ? (ind[level] / ind.total) * 100 : 0;
                    return pct > 0 ? (
                      <div
                        key={level}
                        className={`${RISK_STYLES[level].bar} transition-all`}
                        style={{ width: `${pct}%` }}
                        title={`${level}: ${ind[level]}`}
                        aria-label={`${level}: ${ind[level]} companies`}
                      />
                    ) : null;
                  })}
                </div>

                {/* Breakdown labels */}
                <div className="flex gap-3 mt-2 text-xs font-mono flex-wrap">
                  {RISK_LEVELS.map((level) => ind[level] > 0 && (
                    <span key={level} className="flex items-center gap-1 text-slate-400">
                      <span className={`w-1.5 h-1.5 ${RISK_STYLES[level].dot}`} aria-hidden="true" />
                      {level}: {ind[level]}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* LEGISLATION VIEW                               */}
      {/* ═══════════════════════════════════════════════ */}
      {activeView === 'legislation' && (
        <div className="space-y-4">
          <p className="text-xs font-mono text-slate-400">
            {KEY_LEGISLATION.length} key legislative frameworks targeting forced labor in supply chains
          </p>

          {KEY_LEGISLATION.map((law) => (
            <div key={law.id} className="bg-[#111820] border border-[#1c2a35] p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-white font-mono text-sm font-semibold">{law.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" aria-hidden="true" />
                      {law.country}
                    </span>
                    <span aria-hidden="true">|</span>
                    <span>Enacted: {law.year}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-[#4afa82]/20 text-[#4afa82] border border-[#4afa82]/30 flex-shrink-0">
                  {law.status.toUpperCase()}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-mono text-slate-300 mb-1">Scope</h4>
                <p className="text-sm text-slate-400">{law.scope}</p>
              </div>

              <div>
                <h4 className="text-xs font-mono text-slate-300 mb-1">Enforcement</h4>
                <p className="text-sm text-slate-400">{law.enforcement}</p>
              </div>
            </div>
          ))}

          {/* Compliance advisory */}
          <div className="bg-[#22d3ee]/5 border border-[#22d3ee]/20 p-4">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-[#22d3ee] flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-[#22d3ee] text-sm font-mono font-semibold">Compliance Advisory</p>
                <p className="text-slate-300 text-sm mt-1">
                  Companies with supply chain links to Xinjiang face increasing legal risk across {KEY_LEGISLATION.length} jurisdictions.
                  The UFLPA creates a rebuttable presumption that all goods from Xinjiang involve forced labor,
                  shifting the burden of proof to importers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ─────────────────────────────────── */}
      <div className="border-t border-[#1c2a35] pt-4 space-y-2">
        <p className="text-xs font-mono text-slate-400">
          <Shield className="w-3 h-3 inline mr-1" aria-hidden="true" />
          Data sourced from ASPI, US CBP, Congressional records, and Tier 1-2 media. No CCP state media cited.
        </p>
        <p className="text-xs font-mono text-slate-400">
          Risk classifications are automated assessments based on available evidence.
          CC BY 4.0 — Attribution required.
        </p>
      </div>
    </section>
  );
}
