import React, { useState, useMemo } from 'react';
import {
  Network, Users, Shield, MapPin, AlertTriangle,
  ChevronDown, ChevronUp, ExternalLink, Building2, Scale,
  Target, Globe, Activity, Eye
} from 'lucide-react';
import { dataApi } from '../services/dataApi';

/**
 * InfluenceNetwork — Cross-dataset relationship visualization.
 *
 * Shows connections between CCP power structures, sanctioned officials,
 * political prisoners, detention facilities, and forced labour companies.
 * All data derived from verified research datasets via dataApi.
 *
 * No external graph libraries — pure CSS/React implementation.
 */

const REGION_CONFIG = {
  xinjiang: {
    label: 'Xinjiang',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    description: 'Uyghur genocide, mass detention, forced labor',
  },
  hongkong: {
    label: 'Hong Kong',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    description: 'National Security Law, press freedom crackdown',
  },
  tibet: {
    label: 'Tibet',
    color: 'text-[#4afa82]',
    bg: 'bg-[#4afa82]/10',
    border: 'border-[#4afa82]/30',
    description: 'Cultural destruction, religious persecution',
  },
  central: {
    label: 'Central/National',
    color: 'text-[#22d3ee]',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    description: 'Systemic repression apparatus',
  },
};

const SANCTION_COUNTRIES = ['us', 'uk', 'eu', 'canada', 'australia'];

const SANCTION_FIELDS = {
  us: 'us_sanctions',
  uk: 'uk_sanctions',
  eu: 'eu_sanctions',
  canada: 'canada_sanctions',
  australia: 'australia_sanctions',
};

/**
 * Categorize a sanctioned official into a region.
 */
function getOfficialRegion(official) {
  const area = (official.responsibility_area || '').toLowerCase();
  if (area.includes('xinjiang')) return 'xinjiang';
  if (area.includes('hong kong')) return 'hongkong';
  if (area.includes('tibet')) return 'tibet';
  return 'central';
}

/**
 * Count how many countries have sanctioned an official.
 */
function countSanctions(official) {
  let count = 0;
  for (const country of SANCTION_COUNTRIES) {
    const field = SANCTION_FIELDS[country];
    const val = official[field];
    if (val && typeof val === 'string' && val.toLowerCase().startsWith('yes')) {
      count++;
    }
  }
  return count;
}

/**
 * Get the sanctions list for an official.
 */
function getSanctionsList(official) {
  const result = [];
  for (const country of SANCTION_COUNTRIES) {
    const field = SANCTION_FIELDS[country];
    const val = official[field];
    if (val && typeof val === 'string' && val.toLowerCase().startsWith('yes')) {
      result.push(country.toUpperCase());
    }
  }
  return result;
}

const InfluenceNetwork = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  // Build network data from all datasets
  const network = useMemo(() => {
    const officials = dataApi.getSanctionedOfficials();
    const prisoners = dataApi.getPoliticalPrisoners();
    const sanctions = dataApi.getSanctions();
    const facilities = dataApi.getDetentionFacilities();
    const companies = dataApi.getForcedLaborCompanies();
    const timeline = dataApi.getTimelineEvents();

    // Group officials by region
    const officialsByRegion = {};
    for (const r of Object.keys(REGION_CONFIG)) {
      officialsByRegion[r] = [];
    }
    for (const o of officials) {
      const region = getOfficialRegion(o);
      if (officialsByRegion[region]) {
        officialsByRegion[region].push(o);
      }
    }

    // Group prisoners by region (rough keyword match)
    const prisonersByRegion = {
      xinjiang: prisoners.filter((p) => {
        const text = `${p.prisoner_name} ${p.location} ${p.latest_news || ''}`.toLowerCase();
        return text.includes('uyghur') || text.includes('xinjiang') || text.includes('urumqi');
      }),
      hongkong: prisoners.filter((p) => {
        const text = `${p.prisoner_name} ${p.location} ${p.latest_news || ''}`.toLowerCase();
        return text.includes('hong kong');
      }),
      tibet: prisoners.filter((p) => {
        const text = `${p.prisoner_name} ${p.location} ${p.latest_news || ''}`.toLowerCase();
        return text.includes('tibet');
      }),
      central: prisoners.filter((p) => {
        const text = `${p.prisoner_name} ${p.location} ${p.latest_news || ''}`.toLowerCase();
        return !text.includes('uyghur') && !text.includes('xinjiang') && !text.includes('urumqi') &&
          !text.includes('hong kong') && !text.includes('tibet');
      }),
    };

    // Timeline events by category
    const timelineByRegion = {
      xinjiang: timeline.filter((e) => e.category === 'uyghur'),
      hongkong: timeline.filter((e) => e.category === 'hongkong'),
      tibet: timeline.filter((e) => e.category === 'tibet'),
      central: timeline.filter((e) =>
        e.category !== 'uyghur' && e.category !== 'hongkong' && e.category !== 'tibet'
      ),
    };

    // Sanctions by target region (rough mapping)
    const sanctionsByRegion = {
      xinjiang: sanctions.filter((s) => {
        const text = `${s.target} ${s.reason} ${s.role || ''}`.toLowerCase();
        return text.includes('xinjiang') || text.includes('uyghur');
      }),
      hongkong: sanctions.filter((s) => {
        const text = `${s.target} ${s.reason} ${s.role || ''}`.toLowerCase();
        return text.includes('hong kong');
      }),
      tibet: sanctions.filter((s) => {
        const text = `${s.target} ${s.reason} ${s.role || ''}`.toLowerCase();
        return text.includes('tibet');
      }),
      central: sanctions.filter((s) => {
        const text = `${s.target} ${s.reason} ${s.role || ''}`.toLowerCase();
        return !text.includes('xinjiang') && !text.includes('uyghur') &&
          !text.includes('hong kong') && !text.includes('tibet');
      }),
    };

    // Count total sanctions per country
    const sanctionCountByCountry = {};
    for (const country of SANCTION_COUNTRIES) {
      sanctionCountByCountry[country] = sanctions.filter(
        (s) => s.country === country
      ).length;
    }

    // Most-sanctioned officials (sanctioned by 3+ countries)
    const highlySanctioned = officials
      .map((o) => ({ ...o, sanctionCount: countSanctions(o), sanctions: getSanctionsList(o) }))
      .filter((o) => o.sanctionCount >= 3)
      .sort((a, b) => b.sanctionCount - a.sanctionCount);

    return {
      officials,
      prisoners,
      officialsByRegion,
      prisonersByRegion,
      timelineByRegion,
      sanctionsByRegion,
      sanctionCountByCountry,
      highlySanctioned,
      facilities,
      companies,
      totalConnections:
        officials.length + prisoners.length + sanctions.length +
        facilities.length + companies.length + timeline.length,
    };
  }, []);

  const toggleSection = (section) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const regionData = selectedRegion ? REGION_CONFIG[selectedRegion] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Network className="w-6 h-6 text-[#4afa82]" />
        <div>
          <h2 className="text-xl font-bold text-white font-mono">influence_network</h2>
          <p className="text-slate-400 text-sm">
            Cross-dataset relationship map — {network.totalConnections} data points across{' '}
            {Object.keys(REGION_CONFIG).length} regions
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          { label: 'Officials', value: network.officials.length, Icon: Shield, color: 'text-red-400' },
          { label: 'Prisoners', value: network.prisoners.length, Icon: Users, color: 'text-yellow-400' },
          { label: 'Sanctions', value: dataApi.getSanctions().length, Icon: Scale, color: 'text-[#22d3ee]' },
          { label: 'Facilities', value: network.facilities.length, Icon: Building2, color: 'text-[#4afa82]' },
          { label: 'Companies', value: network.companies.length, Icon: Target, color: 'text-orange-400' },
          { label: 'Events', value: dataApi.getTimelineEvents().length, Icon: Activity, color: 'text-green-400' },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="bg-[#111820] border border-[#1c2a35] p-3 text-center">
            <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} aria-hidden="true" />
            <div className="text-lg font-bold text-white">{value}</div>
            <div className="text-xs text-slate-400">{label}</div>
          </div>
        ))}
      </div>

      {/* Region Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Object.entries(REGION_CONFIG).map(([key, config]) => {
          const officialCount = network.officialsByRegion[key]?.length || 0;
          const prisonerCount = network.prisonersByRegion[key]?.length || 0;
          const isSelected = selectedRegion === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedRegion(isSelected ? null : key)}
              className={`p-3 border text-left transition-colors ${
                isSelected
                  ? `${config.bg} ${config.border} ring-1 ring-current`
                  : 'bg-[#111820] border-[#1c2a35] hover:border-slate-400'
              }`}
              aria-pressed={isSelected}
            >
              <div className={`text-sm font-bold ${config.color}`}>{config.label}</div>
              <div className="text-xs text-slate-400 mt-1">
                {officialCount} officials · {prisonerCount} prisoners
              </div>
            </button>
          );
        })}
      </div>

      {/* Region Detail Panel */}
      {selectedRegion && regionData && (
        <div className={`${regionData.bg} border ${regionData.border} p-4 space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-bold ${regionData.color}`}>{regionData.label}</h3>
              <p className="text-slate-400 text-sm">{regionData.description}</p>
            </div>
            <Globe className={`w-6 h-6 ${regionData.color}`} aria-hidden="true" />
          </div>

          {/* Region Officials */}
          {network.officialsByRegion[selectedRegion]?.length > 0 && (
            <div>
              <button
                onClick={() => toggleSection('officials')}
                className="flex items-center gap-2 text-sm font-semibold text-white w-full text-left"
                aria-expanded={expandedSection === 'officials'}
              >
                <Shield className="w-4 h-4 text-red-400" aria-hidden="true" />
                <span>Sanctioned Officials ({network.officialsByRegion[selectedRegion].length})</span>
                {expandedSection === 'officials'
                  ? <ChevronUp className="w-4 h-4 text-slate-400 ml-auto" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />}
              </button>
              {expandedSection === 'officials' && (
                <div className="mt-2 space-y-2">
                  {network.officialsByRegion[selectedRegion].map((o) => (
                    <div key={o.name} className="bg-[#0a0e14]/50 border border-[#1c2a35] p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{o.name}</span>
                        <div className="flex gap-1">
                          {getSanctionsList(o).map((c) => (
                            <span key={c} className="text-xs bg-red-900/30 text-red-400 px-1.5 py-0.5 rounded">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-400 text-xs mt-1">{o.position}</p>
                      {o.key_abuses && <p className="text-slate-300 text-xs mt-1">{o.key_abuses}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Region Prisoners */}
          {network.prisonersByRegion[selectedRegion]?.length > 0 && (
            <div>
              <button
                onClick={() => toggleSection('prisoners')}
                className="flex items-center gap-2 text-sm font-semibold text-white w-full text-left"
                aria-expanded={expandedSection === 'prisoners'}
              >
                <Users className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                <span>Political Prisoners ({network.prisonersByRegion[selectedRegion].length})</span>
                {expandedSection === 'prisoners'
                  ? <ChevronUp className="w-4 h-4 text-slate-400 ml-auto" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />}
              </button>
              {expandedSection === 'prisoners' && (
                <div className="mt-2 space-y-2">
                  {network.prisonersByRegion[selectedRegion].slice(0, 10).map((p) => (
                    <div key={p.prisoner_name} className="bg-[#0a0e14]/50 border border-[#1c2a35] p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{p.prisoner_name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          p.status === 'DETAINED' ? 'bg-red-900/30 text-red-400' :
                          p.status === 'DECEASED' ? 'bg-slate-700/50 text-slate-300' :
                          p.status === 'DISAPPEARED' ? 'bg-cyan-900/30 text-[#22d3ee]' :
                          p.status === 'AT RISK' ? 'bg-orange-900/30 text-orange-400' :
                          'bg-green-900/30 text-green-400'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                      {p.location && <p className="text-slate-400 text-xs mt-1">{p.location}</p>}
                      {p.sentence && <p className="text-slate-300 text-xs mt-1">{p.sentence}</p>}
                    </div>
                  ))}
                  {network.prisonersByRegion[selectedRegion].length > 10 && (
                    <p className="text-xs text-slate-400 text-center mt-2">
                      + {network.prisonersByRegion[selectedRegion].length - 10} more
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Region Timeline */}
          {network.timelineByRegion[selectedRegion]?.length > 0 && (
            <div>
              <button
                onClick={() => toggleSection('timeline')}
                className="flex items-center gap-2 text-sm font-semibold text-white w-full text-left"
                aria-expanded={expandedSection === 'timeline'}
              >
                <Activity className="w-4 h-4 text-green-400" aria-hidden="true" />
                <span>Timeline Events ({network.timelineByRegion[selectedRegion].length})</span>
                {expandedSection === 'timeline'
                  ? <ChevronUp className="w-4 h-4 text-slate-400 ml-auto" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />}
              </button>
              {expandedSection === 'timeline' && (
                <div className="mt-2 space-y-2">
                  {network.timelineByRegion[selectedRegion]
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .slice(0, 8)
                    .map((e) => (
                      <div key={e.id} className="bg-[#0a0e14]/50 border border-[#1c2a35] p-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{e.title}</span>
                          <span className="text-xs text-slate-400">{e.date}</span>
                        </div>
                        <p className="text-slate-300 text-xs mt-1 line-clamp-2">{e.description}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Region Sanctions */}
          {network.sanctionsByRegion[selectedRegion]?.length > 0 && (
            <div>
              <button
                onClick={() => toggleSection('sanctions')}
                className="flex items-center gap-2 text-sm font-semibold text-white w-full text-left"
                aria-expanded={expandedSection === 'sanctions'}
              >
                <Scale className="w-4 h-4 text-[#22d3ee]" aria-hidden="true" />
                <span>Sanctions ({network.sanctionsByRegion[selectedRegion].length})</span>
                {expandedSection === 'sanctions'
                  ? <ChevronUp className="w-4 h-4 text-slate-400 ml-auto" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />}
              </button>
              {expandedSection === 'sanctions' && (
                <div className="mt-2 space-y-2">
                  {network.sanctionsByRegion[selectedRegion].slice(0, 8).map((s, i) => (
                    <div key={`${s.target}-${i}`} className="bg-[#0a0e14]/50 border border-[#1c2a35] p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{s.target}</span>
                        <span className="text-xs bg-[#22d3ee]/10 text-[#22d3ee] px-1.5 py-0.5 rounded uppercase">
                          {s.country}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs mt-1">{s.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Most-Sanctioned Officials */}
      <div className="bg-[#111820] border border-[#1c2a35] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-5 h-5 text-red-400" aria-hidden="true" />
          <h3 className="text-sm font-bold text-white">Most-Sanctioned Officials</h3>
          <span className="text-xs text-slate-400">(3+ countries)</span>
        </div>
        <div className="space-y-2">
          {network.highlySanctioned.map((o) => (
            <div key={o.name} className="flex items-center justify-between bg-[#0a0e14]/50 border border-[#1c2a35] p-3">
              <div className="min-w-0">
                <span className="text-white text-sm font-medium">{o.name}</span>
                <p className="text-slate-400 text-xs truncate">{o.position}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0 ml-2">
                {o.sanctions.map((c) => (
                  <span key={c} className="text-xs bg-red-900/30 text-red-400 px-1.5 py-0.5 rounded">{c}</span>
                ))}
              </div>
            </div>
          ))}
          {network.highlySanctioned.length === 0 && (
            <p className="text-slate-400 text-sm">No officials sanctioned by 3+ countries found.</p>
          )}
        </div>
      </div>

      {/* International Response by Country */}
      <div className="bg-[#111820] border border-[#1c2a35] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-5 h-5 text-[#22d3ee]" aria-hidden="true" />
          <h3 className="text-sm font-bold text-white">International Sanctions by Country</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SANCTION_COUNTRIES.map((country) => (
            <div key={country} className="bg-[#0a0e14]/50 border border-[#1c2a35] p-3 text-center">
              <div className="text-lg font-bold text-white">
                {network.sanctionCountByCountry[country] || 0}
              </div>
              <div className="text-xs text-slate-400 uppercase">{country}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Source Policy */}
      <div className="text-xs text-slate-400 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
        <span>
          Data sourced from Tier 1-2 outlets only. CCP state media never cited.
          Regional categorization is keyword-based and approximate.
        </span>
      </div>
    </div>
  );
};

export default InfluenceNetwork;
