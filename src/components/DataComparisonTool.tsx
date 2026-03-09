// @ts-nocheck — Phase 2 migration: types to be added

/**
 * DataComparisonTool — Side-by-side comparison of records across
 * datasets. Helps researchers identify cross-references, conflicts,
 * and corroborating evidence.
 *
 * @module DataComparisonTool
 */
import React, { useState, useMemo } from 'react';
import {
  GitCompareArrows,
  Users,
  Scale,
  Shield,
  Clock,
  Building2,
  ChevronDown,
  ChevronUp,
  MapPin,
  AlertTriangle,
  BarChart3,
  Copy,
  Check,
} from 'lucide-react';
import { dataApi } from '../services/dataApi';

/**
 * DataComparisonTool — Side-by-side regional comparison for researchers.
 *
 * Compares CCP human rights violation data across four regions:
 * Hong Kong, Xinjiang/Uyghur, Tibet, and Mainland/National.
 * All data derived from verified JSON datasets via dataApi.
 *
 * No external dependencies. No user tracking. Privacy-respecting.
 */

const REGIONS = [
  { id: 'hongkong', label: 'Hong Kong', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  { id: 'uyghur', label: 'Xinjiang / Uyghur', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { id: 'tibet', label: 'Tibet', color: 'text-[#4afa82]', bg: 'bg-[#4afa82]/10', border: 'border-[#4afa82]/30' },
  { id: 'mainland', label: 'Mainland / National', color: 'text-[#22d3ee]', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
];

const REGION_KEYWORDS = {
  hongkong: ['hong kong', 'hk'],
  uyghur: ['uyghur', 'xinjiang', 'urumqi', 'uyghurs'],
  tibet: ['tibet', 'tibetan', 'lhasa'],
  mainland: ['mainland', 'beijing', 'national', 'china'],
};

function matchesRegion(text, regionId) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return REGION_KEYWORDS[regionId].some((kw) => lower.includes(kw));
}

function classifyPrisoner(prisoner) {
  const text = [prisoner.prisoner_name, prisoner.location, prisoner.latest_news, prisoner.sentence]
    .filter(Boolean)
    .join(' ');
  for (const region of REGIONS) {
    if (matchesRegion(text, region.id)) return region.id;
  }
  return 'mainland';
}

function classifyTimeline(event) {
  const cat = (event.category || '').toLowerCase();
  if (cat === 'hongkong') return 'hongkong';
  if (cat === 'uyghur') return 'uyghur';
  if (cat === 'tibet') return 'tibet';
  return 'mainland';
}

function classifySanction(sanction) {
  const text = [sanction.target, sanction.reason, sanction.role].filter(Boolean).join(' ');
  for (const region of REGIONS) {
    if (matchesRegion(text, region.id)) return region.id;
  }
  return 'mainland';
}

const DataComparisonTool = () => {
  const [selectedRegions, setSelectedRegions] = useState(['hongkong', 'uyghur']);
  const [expandedMetric, setExpandedMetric] = useState(null);
  const [copied, setCopied] = useState(false);

  const data = useMemo(() => {
    const prisoners = dataApi.getPoliticalPrisoners();
    const sanctions = dataApi.getSanctions();
    const officials = dataApi.getSanctionedOfficials();
    const timeline = dataApi.getTimelineEvents();
    const facilities = dataApi.getDetentionFacilities();

    // Classify data by region
    const prisonersByRegion = {};
    const sanctionsByRegion = {};
    const timelineByRegion = {};
    const officialsByRegion = {};
    const facilitiesByRegion = {};

    for (const r of REGIONS) {
      prisonersByRegion[r.id] = [];
      sanctionsByRegion[r.id] = [];
      timelineByRegion[r.id] = [];
      officialsByRegion[r.id] = [];
      facilitiesByRegion[r.id] = [];
    }

    prisoners.forEach((p) => {
      const region = classifyPrisoner(p);
      if (prisonersByRegion[region]) prisonersByRegion[region].push(p);
    });

    sanctions.forEach((s) => {
      const region = classifySanction(s);
      if (sanctionsByRegion[region]) sanctionsByRegion[region].push(s);
    });

    timeline.forEach((e) => {
      const region = classifyTimeline(e);
      if (timelineByRegion[region]) timelineByRegion[region].push(e);
    });

    officials.forEach((o) => {
      const area = (o.responsibility_area || '').toLowerCase();
      if (area.includes('hong kong')) officialsByRegion.hongkong.push(o);
      else if (area.includes('xinjiang')) officialsByRegion.uyghur.push(o);
      else if (area.includes('tibet')) officialsByRegion.tibet.push(o);
      else officialsByRegion.mainland.push(o);
    });

    facilities.forEach((f) => {
      const region = (f.region || '').toLowerCase();
      if (region.includes('xinjiang')) facilitiesByRegion.uyghur.push(f);
      else if (region.includes('tibet')) facilitiesByRegion.tibet.push(f);
      else facilitiesByRegion.mainland.push(f);
    });

    // Status breakdown per region
    const statusByRegion = {};
    for (const r of REGIONS) {
      const regionPrisoners = prisonersByRegion[r.id];
      statusByRegion[r.id] = {
        DETAINED: regionPrisoners.filter((p) => p.status === 'DETAINED').length,
        RELEASED: regionPrisoners.filter((p) => p.status === 'RELEASED').length,
        DISAPPEARED: regionPrisoners.filter((p) => p.status === 'DISAPPEARED').length,
        DECEASED: regionPrisoners.filter((p) => p.status === 'DECEASED').length,
        EXILE: regionPrisoners.filter((p) => p.status === 'EXILE').length,
        'AT RISK': regionPrisoners.filter((p) => p.status === 'AT RISK').length,
      };
    }

    // Sanctions by country per region
    const sanctionCountries = ['us', 'uk', 'eu', 'canada', 'australia'];
    const sanctionsByCountryByRegion = {};
    for (const r of REGIONS) {
      sanctionsByCountryByRegion[r.id] = {};
      for (const country of sanctionCountries) {
        sanctionsByCountryByRegion[r.id][country] = sanctionsByRegion[r.id].filter(
          (s) => s.country === country
        ).length;
      }
    }

    return {
      prisonersByRegion,
      sanctionsByRegion,
      timelineByRegion,
      officialsByRegion,
      facilitiesByRegion,
      statusByRegion,
      sanctionsByCountryByRegion,
      totals: {
        prisoners: prisoners.length,
        sanctions: sanctions.length,
        officials: officials.length,
        timeline: timeline.length,
        facilities: facilities.length,
      },
    };
  }, []);

  const toggleRegion = (regionId) => {
    setSelectedRegions((prev) => {
      if (prev.includes(regionId)) {
        return prev.length > 1 ? prev.filter((r) => r !== regionId) : prev;
      }
      return prev.length < 3 ? [...prev, regionId] : prev;
    });
  };

  const toggleMetric = (metric) => {
    setExpandedMetric((prev) => (prev === metric ? null : metric));
  };

  const handleCopySummary = async () => {
    const lines = ['Regional Data Comparison — Global Resistance Hub', ''];
    for (const regionId of selectedRegions) {
      const region = REGIONS.find((r) => r.id === regionId);
      if (!region) continue;
      lines.push(`${region.label}:`);
      lines.push(`  Political Prisoners: ${data.prisonersByRegion[regionId].length}`);
      lines.push(`  Sanctions Actions: ${data.sanctionsByRegion[regionId].length}`);
      lines.push(`  Sanctioned Officials: ${data.officialsByRegion[regionId].length}`);
      lines.push(`  Timeline Events: ${data.timelineByRegion[regionId].length}`);
      lines.push(`  Detention Facilities: ${data.facilitiesByRegion[regionId].length}`);
      lines.push('');
    }
    lines.push('Source: Global Anti-CCP Resistance Hub');
    lines.push('License: CC BY 4.0');
    lines.push(`Accessed: ${new Date().toISOString().split('T')[0]}`);

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  const selected = REGIONS.filter((r) => selectedRegions.includes(r.id));

  const metrics = [
    {
      id: 'prisoners',
      label: 'Political Prisoners',
      Icon: Users,
      getValue: (regionId) => data.prisonersByRegion[regionId].length,
      getDetail: (regionId) => {
        const status = data.statusByRegion[regionId];
        return Object.entries(status)
          .filter(([, count]) => count > 0)
          .map(([s, count]) => `${s}: ${count}`)
          .join(', ');
      },
    },
    {
      id: 'sanctions',
      label: 'Sanctions Actions',
      Icon: Scale,
      getValue: (regionId) => data.sanctionsByRegion[regionId].length,
      getDetail: (regionId) => {
        const byCountry = data.sanctionsByCountryByRegion[regionId];
        return Object.entries(byCountry)
          .filter(([, count]) => count > 0)
          .map(([country, count]) => `${country.toUpperCase()}: ${count}`)
          .join(', ');
      },
    },
    {
      id: 'officials',
      label: 'Sanctioned Officials',
      Icon: Shield,
      getValue: (regionId) => data.officialsByRegion[regionId].length,
      getDetail: (regionId) => {
        const officials = data.officialsByRegion[regionId];
        return officials.length > 0
          ? officials.slice(0, 3).map((o) => o.name).join(', ') + (officials.length > 3 ? ` +${officials.length - 3} more` : '')
          : 'None documented';
      },
    },
    {
      id: 'timeline',
      label: 'Timeline Events',
      Icon: Clock,
      getValue: (regionId) => data.timelineByRegion[regionId].length,
      getDetail: (regionId) => {
        const events = data.timelineByRegion[regionId];
        if (events.length === 0) return 'None';
        const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date));
        return `Latest: ${sorted[0].title} (${sorted[0].date})`;
      },
    },
    {
      id: 'facilities',
      label: 'Detention Facilities',
      Icon: Building2,
      getValue: (regionId) => data.facilitiesByRegion[regionId].length,
      getDetail: (regionId) => {
        const facilities = data.facilitiesByRegion[regionId];
        if (facilities.length === 0) return 'None documented';
        const types = [...new Set(facilities.map((f) => f.type).filter(Boolean))];
        return types.length > 0 ? `Types: ${types.join(', ')}` : `${facilities.length} facilities`;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <GitCompareArrows className="w-6 h-6 text-[#22d3ee]" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-bold text-white font-mono">compare_regions</h2>
            <p className="text-slate-400 text-sm">
              Side-by-side comparison of CCP human rights data across regions
            </p>
          </div>
        </div>
        <button
          onClick={handleCopySummary}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111820] border border-[#1c2a35] text-slate-300 hover:text-[#22d3ee] hover:border-[#22d3ee]/50 transition-colors font-mono text-xs"
          aria-label="Copy comparison summary to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#4afa82]" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy Summary'}
        </button>
      </div>

      {/* Region Selector */}
      <div>
        <p className="text-xs text-slate-400 mb-2">Select 2-3 regions to compare:</p>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((region) => {
            const isSelected = selectedRegions.includes(region.id);
            const isDisabled = !isSelected && selectedRegions.length >= 3;
            return (
              <button
                key={region.id}
                onClick={() => !isDisabled && toggleRegion(region.id)}
                disabled={isDisabled}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors border ${
                  isSelected
                    ? `${region.bg} ${region.border} ${region.color}`
                    : isDisabled
                      ? 'bg-[#111820] border-[#1c2a35] text-slate-400 cursor-not-allowed opacity-50'
                      : 'bg-[#111820] border-[#1c2a35] text-slate-300 hover:border-slate-400'
                }`}
                aria-pressed={isSelected}
              >
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                {region.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-[#111820] border border-[#1c2a35] overflow-hidden">
        {/* Table Header */}
        <div className={`grid gap-px bg-[#1c2a35]`} style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
          <div className="bg-[#0a0e14] p-3 font-mono text-xs text-slate-400">
            <BarChart3 className="w-4 h-4 inline mr-1" aria-hidden="true" />
            Metric
          </div>
          {selected.map((region) => (
            <div key={region.id} className={`bg-[#0a0e14] p-3 text-center ${region.color} font-mono text-xs font-bold`}>
              {region.label}
            </div>
          ))}
        </div>

        {/* Metric Rows */}
        {metrics.map((metric) => {
          const isExpanded = expandedMetric === metric.id;
          const MetricIcon = metric.Icon;
          const values = selected.map((r) => metric.getValue(r.id));
          const maxValue = Math.max(...values, 1);

          return (
            <div key={metric.id}>
              <button
                onClick={() => toggleMetric(metric.id)}
                className="w-full grid gap-px bg-[#1c2a35] hover:bg-[#1c2a35]/50 transition-colors"
                style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}
                aria-expanded={isExpanded}
              >
                <div className="bg-[#111820] p-3 flex items-center gap-2 text-left">
                  <MetricIcon className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm text-slate-300">{metric.label}</span>
                  {isExpanded
                    ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 ml-auto flex-shrink-0" aria-hidden="true" />
                    : <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-auto flex-shrink-0" aria-hidden="true" />}
                </div>
                {selected.map((region, i) => (
                  <div key={region.id} className="bg-[#111820] p-3 text-center">
                    <span className="text-lg font-bold text-white">{values[i]}</span>
                    {/* Bar indicator */}
                    <div className="mt-1.5 h-1 bg-[#1c2a35] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          region.id === 'hongkong' ? 'bg-yellow-400' :
                          region.id === 'uyghur' ? 'bg-red-400' :
                          region.id === 'tibet' ? 'bg-[#4afa82]' :
                          'bg-[#22d3ee]'
                        }`}
                        style={{ width: `${Math.round((values[i] / maxValue) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div
                  className="grid gap-px bg-[#1c2a35]"
                  style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}
                >
                  <div className="bg-[#0a0e14]/80 p-3 text-xs text-slate-400 italic">
                    Breakdown
                  </div>
                  {selected.map((region) => (
                    <div key={region.id} className="bg-[#0a0e14]/80 p-3 text-xs text-slate-300">
                      {metric.getDetail(region.id) || 'No data'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Totals Row */}
        <div
          className="grid gap-px bg-[#1c2a35]"
          style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}
        >
          <div className="bg-[#0a0e14] p-3 font-mono text-xs text-[#4afa82] font-bold">
            TOTAL DATA POINTS
          </div>
          {selected.map((region) => {
            const total =
              data.prisonersByRegion[region.id].length +
              data.sanctionsByRegion[region.id].length +
              data.officialsByRegion[region.id].length +
              data.timelineByRegion[region.id].length +
              data.facilitiesByRegion[region.id].length;
            return (
              <div key={region.id} className="bg-[#0a0e14] p-3 text-center">
                <span className="text-lg font-bold text-[#4afa82]">{total}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Source note */}
      <div className="text-xs text-slate-400 flex items-start gap-1.5">
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          Regional classification is keyword-based and approximate. Some records may span multiple regions.
          Data sourced from Tier 1-2 outlets only (BBC, Reuters, HRW, Amnesty). CCP state media never cited.
          {' '}Total database: {data.totals.prisoners} prisoners, {data.totals.sanctions} sanctions,{' '}
          {data.totals.officials} officials, {data.totals.timeline} timeline events,{' '}
          {data.totals.facilities} facilities.
        </span>
      </div>
    </div>
  );
};

export default DataComparisonTool;
