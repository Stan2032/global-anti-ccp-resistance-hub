/**
 * CrossDatasetInsightEngine — Analyses connections between datasets
 * (prisoners, sanctions, organisations, cases). Surfaces cross-references
 * and patterns for researchers.
 *
 * @module CrossDatasetInsightEngine
 */
import React, { useState, useMemo } from 'react';
import { Network, Search, Copy, Check, ChevronDown, ChevronUp, Zap, Globe, Users, Scale, Factory, Building, Shield, AlertTriangle, TrendingUp, Link2 } from 'lucide-react';
import { dataApi } from '../services/dataApi';

// ── Insight categories ─────────────────────────────────

const CATEGORY_CONFIG = {
  geographic: { label: 'Geographic', color: 'text-[#22d3ee]', bg: 'bg-cyan-900/20', border: 'border-[#22d3ee]/30', icon: Globe },
  actor: { label: 'Actor Network', color: 'text-[#a78bfa]', bg: 'bg-[#a78bfa]/20', border: 'border-[#a78bfa]/30', icon: Users },
  legal: { label: 'Legal', color: 'text-[#fbbf24]', bg: 'bg-yellow-900/20', border: 'border-[#fbbf24]/30', icon: Scale },
  economic: { label: 'Economic', color: 'text-[#4afa82]', bg: 'bg-green-900/20', border: 'border-[#4afa82]/30', icon: Factory },
  temporal: { label: 'Temporal', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-400/30', icon: TrendingUp },
};

const CATEGORY_ORDER = ['geographic', 'actor', 'legal', 'economic', 'temporal'];

// ── Relationship extraction engine ─────────────────────

function normalizeStr(s) {
  return (s || '').toLowerCase().trim();
}

function extractRegion(text) {
  const t = normalizeStr(text);
  if (/hong\s?kong/.test(t)) return 'Hong Kong';
  if (/xinjiang|uyghur|uighur/.test(t)) return 'Xinjiang/Uyghur';
  if (/tibet/.test(t)) return 'Tibet';
  if (/taiwan/.test(t)) return 'Taiwan';
  if (/inner\s?mongolia/.test(t)) return 'Inner Mongolia';
  return null;
}

function extractRegions(obj) {
  const regions = new Set();
  Object.values(obj).forEach((val) => {
    if (typeof val === 'string') {
      const r = extractRegion(val);
      if (r) regions.add(r);
    }
  });
  return [...regions];
}

function buildInsights(prisoners, officials, sanctions, cases, companies, facilities, stations, responses, orgs, timeline) {
  const insights = [];

  // ── Geographic Clusters ─────────────────────────
  const regionMap = {};
  const addToRegion = (region, dataset, item, label) => {
    if (!region) return;
    if (!regionMap[region]) regionMap[region] = [];
    regionMap[region].push({ dataset, label, item });
  };

  prisoners.forEach((p) => {
    extractRegions(p).forEach((r) => addToRegion(r, 'prisoners', p, p.prisoner_name));
  });
  officials.forEach((o) => {
    extractRegions(o).forEach((r) => addToRegion(r, 'officials', o, o.name));
  });
  sanctions.forEach((s) => {
    extractRegions(s).forEach((r) => addToRegion(r, 'sanctions', s, s.target || s.reason));
  });
  cases.forEach((c) => {
    extractRegions(c).forEach((r) => addToRegion(r, 'cases', c, c.case_name));
  });
  companies.forEach((c) => {
    extractRegions(c).forEach((r) => addToRegion(r, 'companies', c, c.company));
  });
  facilities.forEach((f) => {
    extractRegions(f).forEach((r) => addToRegion(r, 'facilities', f, f.name || f.region));
  });
  stations.forEach((s) => {
    extractRegions(s).forEach((r) => addToRegion(r, 'stations', s, `${s.city}, ${s.country}`));
  });
  timeline.forEach((e) => {
    extractRegions(e).forEach((r) => addToRegion(r, 'timeline', e, e.title));
  });

  Object.entries(regionMap).forEach(([region, items]) => {
    const datasetTypes = new Set(items.map((i) => i.dataset));
    if (datasetTypes.size >= 3) {
      insights.push({
        id: `geo-${region}`,
        category: 'geographic',
        strength: Math.min(datasetTypes.size / 6, 1),
        title: `${region} — ${datasetTypes.size}-dataset convergence`,
        summary: `${items.length} records across ${datasetTypes.size} datasets reference ${region}: ${[...datasetTypes].join(', ')}.`,
        datasets: [...datasetTypes],
        count: items.length,
        items: items.slice(0, 8),
      });
    }
  });

  // ── Actor Network — officials linked to prisoners/cases ─
  officials.forEach((official) => {
    const name = normalizeStr(official.name);
    if (!name) return;
    const nameParts = name.split(/\s+/);
    const linkedPrisoners = prisoners.filter((p) =>
      nameParts.some((part) => part.length > 2 && normalizeStr(p.latest_news || '').includes(part))
    );
    const linkedCases = cases.filter((c) =>
      nameParts.some((part) => part.length > 2 && (
        normalizeStr(c.case_name || '').includes(part) ||
        normalizeStr(c.defendant || '').includes(part) ||
        normalizeStr(c.significance || '').includes(part)
      ))
    );
    const linkedSanctions = sanctions.filter((s) =>
      nameParts.some((part) => part.length > 2 && normalizeStr(s.target || '').includes(part))
    );

    const totalLinks = linkedPrisoners.length + linkedCases.length + linkedSanctions.length;
    if (totalLinks >= 2) {
      const connections = [];
      if (linkedPrisoners.length) connections.push(`${linkedPrisoners.length} prisoner(s)`);
      if (linkedCases.length) connections.push(`${linkedCases.length} case(s)`);
      if (linkedSanctions.length) connections.push(`${linkedSanctions.length} sanction(s)`);
      insights.push({
        id: `actor-${name.replace(/\s+/g, '-')}`,
        category: 'actor',
        strength: Math.min(totalLinks / 5, 1),
        title: `${official.name} — ${totalLinks} cross-dataset links`,
        summary: `Official (${official.position || 'position unknown'}) linked to ${connections.join(', ')}.`,
        datasets: ['officials', ...(linkedPrisoners.length ? ['prisoners'] : []), ...(linkedCases.length ? ['cases'] : []), ...(linkedSanctions.length ? ['sanctions'] : [])],
        count: totalLinks,
        items: [
          { dataset: 'officials', label: official.name, item: official },
          ...linkedPrisoners.slice(0, 2).map((p) => ({ dataset: 'prisoners', label: p.prisoner_name, item: p })),
          ...linkedCases.slice(0, 2).map((c) => ({ dataset: 'cases', label: c.case_name, item: c })),
        ],
      });
    }
  });

  // ── Legal — cases with international sanctions response ─
  cases.forEach((c) => {
    const caseName = normalizeStr(c.case_name || '');
    const caseJurisdiction = normalizeStr(c.jurisdiction || '');
    const relatedResponses = responses.filter((r) =>
      normalizeStr(r.country || '').includes(caseJurisdiction) ||
      normalizeStr(r.legislative_actions || '').includes(caseName.split(/\s+/)[0] || '')
    );
    const relatedSanctions = sanctions.filter((s) =>
      normalizeStr(s.reason || '').split(/\s+/).some((word) =>
        word.length > 3 && caseName.includes(word)
      )
    );
    if (relatedResponses.length + relatedSanctions.length >= 2) {
      insights.push({
        id: `legal-${caseName.replace(/\s+/g, '-').slice(0, 30)}`,
        category: 'legal',
        strength: Math.min((relatedResponses.length + relatedSanctions.length) / 4, 1),
        title: `${c.case_name} — cross-border legal impact`,
        summary: `Legal case linked to ${relatedResponses.length} international response(s) and ${relatedSanctions.length} sanction action(s).`,
        datasets: ['cases', ...(relatedResponses.length ? ['responses'] : []), ...(relatedSanctions.length ? ['sanctions'] : [])],
        count: relatedResponses.length + relatedSanctions.length,
        items: [
          { dataset: 'cases', label: c.case_name, item: c },
          ...relatedResponses.slice(0, 2).map((r) => ({ dataset: 'responses', label: r.country, item: r })),
        ],
      });
    }
  });

  // ── Economic — forced labor companies linked to sanctions/responses ─
  const sanctionedCountries = new Set(responses.filter((r) => r.sanctions_imposed && normalizeStr(r.sanctions_imposed) !== 'none').map((r) => normalizeStr(r.country)));
  const uflpaSanctions = sanctions.filter((s) => normalizeStr(s.law || '').includes('uflpa') || normalizeStr(s.reason || '').includes('forced labor'));
  if (companies.length > 0 && (sanctionedCountries.size > 0 || uflpaSanctions.length > 0)) {
    const companiesWithAction = companies.filter((c) => c.uflpa_actions && normalizeStr(c.uflpa_actions) !== 'none');
    if (companiesWithAction.length > 0) {
      insights.push({
        id: 'economic-uflpa-convergence',
        category: 'economic',
        strength: Math.min(companiesWithAction.length / companies.length, 1),
        title: `UFLPA enforcement — ${companiesWithAction.length} companies with actions`,
        summary: `${companiesWithAction.length}/${companies.length} tracked companies face UFLPA enforcement actions. ${sanctionedCountries.size} countries have imposed related sanctions.`,
        datasets: ['companies', 'sanctions', 'responses'],
        count: companiesWithAction.length,
        items: companiesWithAction.slice(0, 5).map((c) => ({ dataset: 'companies', label: c.company, item: c })),
      });
    }
  }

  // ── Economic — industries cluster ─
  const industryMap = {};
  companies.forEach((c) => {
    const ind = c.industry || 'Unknown';
    if (!industryMap[ind]) industryMap[ind] = [];
    industryMap[ind].push(c);
  });
  Object.entries(industryMap).forEach(([industry, cos]) => {
    if (cos.length >= 2) {
      insights.push({
        id: `economic-industry-${industry.toLowerCase().replace(/\s+/g, '-')}`,
        category: 'economic',
        strength: Math.min(cos.length / 5, 1),
        title: `${industry} sector — ${cos.length} companies flagged`,
        summary: `${cos.length} companies in ${industry} linked to forced labor supply chains.`,
        datasets: ['companies'],
        count: cos.length,
        items: cos.slice(0, 4).map((c) => ({ dataset: 'companies', label: c.company, item: c })),
      });
    }
  });

  // ── Temporal — timeline events linked to sanctions waves ─
  const years = {};
  timeline.forEach((e) => {
    const yr = (e.date || '').slice(0, 4);
    if (yr) {
      if (!years[yr]) years[yr] = { events: [], sanctions: [] };
      years[yr].events.push(e);
    }
  });
  sanctions.forEach((s) => {
    const yr = (s.date || '').slice(0, 4);
    if (yr && years[yr]) years[yr].sanctions.push(s);
  });
  Object.entries(years).forEach(([year, data]) => {
    if (data.events.length > 0 && data.sanctions.length > 0) {
      insights.push({
        id: `temporal-${year}`,
        category: 'temporal',
        strength: Math.min((data.events.length + data.sanctions.length) / 8, 1),
        title: `${year} — ${data.events.length} events triggered ${data.sanctions.length} sanctions`,
        summary: `Temporal correlation: ${data.events.length} documented event(s) and ${data.sanctions.length} sanction action(s) in the same year.`,
        datasets: ['timeline', 'sanctions'],
        count: data.events.length + data.sanctions.length,
        items: [
          ...data.events.slice(0, 2).map((e) => ({ dataset: 'timeline', label: e.title, item: e })),
          ...data.sanctions.slice(0, 2).map((s) => ({ dataset: 'sanctions', label: s.target || s.reason, item: s })),
        ],
      });
    }
  });

  // Sort by strength descending, then by count
  return insights.sort((a, b) => b.strength - a.strength || b.count - a.count);
}

// ── Clipboard ──────────────────────────────────────────

function buildClipboardText(insights, categoryFilter) {
  const filtered = categoryFilter ? insights.filter((i) => i.category === categoryFilter) : insights;
  const lines = [
    'Cross-Dataset Insight Engine — Global Anti-CCP Resistance Hub',
    `Generated: ${new Date().toISOString().slice(0, 10)}`,
    `Insights: ${filtered.length}${categoryFilter ? ` (filtered: ${categoryFilter})` : ''}`,
    '',
  ];
  filtered.forEach((insight) => {
    lines.push(`[${insight.category.toUpperCase()}] ${insight.title}`);
    lines.push(`  ${insight.summary}`);
    lines.push(`  Datasets: ${insight.datasets.join(', ')}`);
    lines.push('');
  });
  lines.push('License: CC BY 4.0 — Attribution required');
  lines.push('Data: https://github.com/Stan2032/global-anti-ccp-resistance-hub');
  return lines.join('\n');
}

// ── Dataset label helper ───────────────────────────────

const DATASET_LABELS = {
  prisoners: 'Political Prisoners',
  officials: 'Sanctioned Officials',
  sanctions: 'Sanctions',
  cases: 'Legal Cases',
  companies: 'Forced Labor',
  facilities: 'Detention Facilities',
  stations: 'Police Stations',
  responses: 'Intl Responses',
  orgs: 'HR Organizations',
  timeline: 'Timeline Events',
};

// ── Component ──────────────────────────────────────────

export default function CrossDatasetInsightEngine() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expandedInsight, setExpandedInsight] = useState('');
  const [copied, setCopied] = useState(false);

  // Load all datasets once via useMemo
  const allData = useMemo(() => ({
    prisoners: dataApi.getPoliticalPrisoners(),
    officials: dataApi.getSanctionedOfficials(),
    sanctions: dataApi.getSanctions(),
    cases: dataApi.getLegalCases(),
    companies: dataApi.getForcedLaborCompanies(),
    facilities: dataApi.getDetentionFacilities(),
    stations: dataApi.getPoliceStations(),
    responses: dataApi.getInternationalResponses(),
    orgs: dataApi.getHumanRightsOrgs(),
    timeline: dataApi.getTimelineEvents(),
  }), []);

  const insights = useMemo(() => buildInsights(
    allData.prisoners, allData.officials, allData.sanctions,
    allData.cases, allData.companies, allData.facilities,
    allData.stations, allData.responses, allData.orgs, allData.timeline
  ), [allData]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORY_ORDER.forEach((c) => { counts[c] = 0; });
    insights.forEach((i) => { counts[i.category] = (counts[i.category] || 0) + 1; });
    return counts;
  }, [insights]);

  const datasetCount = useMemo(() => {
    const sets = new Set();
    insights.forEach((i) => i.datasets.forEach((d) => sets.add(d)));
    return sets.size;
  }, [insights]);

  const filteredInsights = useMemo(() => {
    let result = insights;
    if (categoryFilter) result = result.filter((i) => i.category === categoryFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((i) =>
        i.title.toLowerCase().includes(q) ||
        i.summary.toLowerCase().includes(q) ||
        i.datasets.some((d) => d.includes(q))
      );
    }
    return result;
  }, [insights, categoryFilter, searchQuery]);

  const handleCopy = () => {
    navigator.clipboard.writeText(buildClipboardText(insights, categoryFilter));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section aria-label="Cross-Dataset Insight Engine" className="bg-[#0a0e14] border border-[#1c2a35] p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Network className="w-6 h-6 text-[#22d3ee]" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-mono">Cross-Dataset Insight Engine</h2>
            <p className="text-slate-300 text-sm mt-1">
              {insights.length} insights discovered across {datasetCount} datasets — revealing hidden connections between prisoners, officials, sanctions, cases, and facilities.
            </p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#1c2a35] hover:border-[#22d3ee]/50 text-slate-300 hover:text-[#22d3ee] transition-colors"
          aria-label={copied ? 'Copied to clipboard' : 'Copy insights to clipboard'}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Category filter buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORY_ORDER.map((cat) => {
          const cfg = CATEGORY_CONFIG[cat];
          const Icon = cfg.icon;
          const active = categoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(active ? '' : cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border transition-colors ${
                active
                  ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                  : 'border-[#1c2a35] text-slate-400 hover:text-slate-200 hover:border-slate-400/50'
              }`}
              aria-pressed={active}
              aria-label={`Filter by ${cfg.label}: ${categoryCounts[cat]} insights`}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              {cfg.label}
              <span className={`ml-1 ${active ? cfg.color : 'text-slate-400'}`}>{categoryCounts[cat]}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search insights..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#111820] border border-[#1c2a35] text-slate-200 pl-10 pr-4 py-2 text-sm font-mono placeholder:text-slate-400 focus:border-[#22d3ee]/50 focus:outline-none"
          aria-label="Search insights"
        />
      </div>

      {/* Strength distribution bar */}
      {insights.length > 0 && (
        <div className="mb-6">
          <div className="flex h-2 overflow-hidden bg-[#111820] border border-[#1c2a35]">
            {CATEGORY_ORDER.map((cat) => {
              const pct = (categoryCounts[cat] / insights.length) * 100;
              if (pct === 0) return null;
              const colorMap = {
                geographic: 'bg-[#22d3ee]',
                actor: 'bg-[#a78bfa]',
                legal: 'bg-[#fbbf24]',
                economic: 'bg-[#4afa82]',
                temporal: 'bg-red-400',
              };
              return (
                <div
                  key={cat}
                  className={colorMap[cat]}
                  style={{ width: `${pct}%` }}
                  aria-label={`${CATEGORY_CONFIG[cat].label}: ${categoryCounts[cat]} insights`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {CATEGORY_ORDER.filter((c) => categoryCounts[c] > 0).map((cat) => (
              <span key={cat} className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className={`w-2 h-2 rounded-full ${
                  { geographic: 'bg-[#22d3ee]', actor: 'bg-[#a78bfa]', legal: 'bg-[#fbbf24]', economic: 'bg-[#4afa82]', temporal: 'bg-red-400' }[cat]
                }`} aria-hidden="true" />
                {CATEGORY_CONFIG[cat].label} ({categoryCounts[cat]})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Insight count */}
      <p className="text-xs font-mono text-slate-400 mb-3">
        Showing {filteredInsights.length} of {insights.length} insights
      </p>

      {/* Insight cards */}
      <div className="space-y-2">
        {filteredInsights.map((insight) => {
          const cfg = CATEGORY_CONFIG[insight.category];
          const Icon = cfg.icon;
          const expanded = expandedInsight === insight.id;
          return (
            <div
              key={insight.id}
              className={`border ${expanded ? cfg.border : 'border-[#1c2a35]'} bg-[#111820] transition-colors`}
            >
              <button
                onClick={() => setExpandedInsight(expanded ? '' : insight.id)}
                className="w-full flex items-start gap-3 p-3 sm:p-4 text-left"
                aria-expanded={expanded}
                aria-label={`${insight.title} — ${insight.summary}`}
              >
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.color}`} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-mono px-1.5 py-0.5 ${cfg.bg} ${cfg.color} ${cfg.border} border`}>
                      {cfg.label}
                    </span>
                    {/* Strength indicator */}
                    <span className="flex gap-0.5" aria-label={`Strength: ${Math.round(insight.strength * 100)}%`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          className={`w-1.5 h-1.5 rounded-full ${
                            n <= Math.ceil(insight.strength * 5) ? cfg.color.replace('text-', 'bg-') : 'bg-slate-700'
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </span>
                  </div>
                  <h3 className="text-sm font-mono text-slate-200 mt-1.5">{insight.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{insight.summary}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {insight.datasets.map((d) => (
                      <span key={d} className="text-xs font-mono px-1.5 py-0.5 bg-[#0a0e14] border border-[#1c2a35] text-slate-300">
                        {DATASET_LABELS[d] || d}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0 text-slate-400">
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {expanded && insight.items && insight.items.length > 0 && (
                <div className="border-t border-[#1c2a35] px-3 sm:px-4 py-3 space-y-2">
                  <p className="text-xs font-mono text-slate-300 mb-2">
                    <Link2 className="w-3 h-3 inline mr-1" aria-hidden="true" />
                    Connected records ({insight.items.length})
                  </p>
                  {insight.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs font-mono bg-[#0a0e14] border border-[#1c2a35] px-3 py-2"
                    >
                      <span className="text-[#22d3ee] flex-shrink-0">{DATASET_LABELS[item.dataset] || item.dataset}</span>
                      <span className="text-slate-400" aria-hidden="true">→</span>
                      <span className="text-slate-200 truncate">{item.label}</span>
                    </div>
                  ))}
                  {insight.count > insight.items.length && (
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      + {insight.count - insight.items.length} more connected record(s)
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredInsights.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-sm font-mono">
          {searchQuery ? 'No insights match your search.' : 'No insights found for this category.'}
        </div>
      )}

      {/* Footer attribution */}
      <div className="mt-6 pt-4 border-t border-[#1c2a35] flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3" aria-hidden="true" />
          Tier 1-2 sources only
        </span>
        <span aria-hidden="true">|</span>
        <span>CC BY 4.0</span>
        <span aria-hidden="true">|</span>
        <span>{insights.length} insights from {datasetCount} datasets</span>
      </div>
    </section>
  );
}
