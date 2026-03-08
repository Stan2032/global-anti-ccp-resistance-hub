// @ts-nocheck — Phase 2 migration: types to be added
import React, { useState, useMemo } from 'react';
import { Code, Database, Search, Filter, Globe, ChevronDown, ChevronUp, Copy, CheckCircle, BookOpen } from 'lucide-react';
import { dataApi } from '../services/dataApi';

/**
 * DataApiDocs — Auto-generated interactive API documentation.
 *
 * Shows all available methods from the dataApi module with
 * descriptions, parameters, return types, and live record counts.
 * Helps researchers discover and use the data programmatically.
 */

const METHOD_GROUPS = [
  {
    id: 'metadata',
    title: 'Metadata',
    icon: Database,
    methods: [
      {
        name: 'getDatasetSummary',
        description: 'Returns summary statistics for all datasets including record counts, descriptions, and available fields.',
        params: [],
        returns: '{ datasets: { [name]: { count, description, fields } }, totalRecords, lastUpdated }',
        example: "dataApi.getDatasetSummary()",
        live: () => {
          const s = dataApi.getDatasetSummary();
          const total = Object.values(s.datasets).reduce((sum, d) => sum + d.count, 0);
          return `${Object.keys(s.datasets).length} datasets, ${total} total records`;
        },
      },
    ],
  },
  {
    id: 'prisoners',
    title: 'Political Prisoners',
    icon: Database,
    methods: [
      {
        name: 'getPoliticalPrisoners',
        description: 'Returns all documented political prisoner records.',
        params: [],
        returns: 'Array<{ id, prisoner_name, status, location, sentence, ... }>',
        example: "dataApi.getPoliticalPrisoners()",
        live: () => `${dataApi.getPoliticalPrisoners().length} records`,
      },
      {
        name: 'getPoliticalPrisonerByName',
        description: 'Find a specific prisoner by exact name match (case-insensitive).',
        params: [{ name: 'name', type: 'string', description: 'Prisoner name to search for' }],
        returns: 'Object | null',
        example: "dataApi.getPoliticalPrisonerByName('Jimmy Lai')",
        live: () => {
          const p = dataApi.getPoliticalPrisonerByName('Jimmy Lai');
          return p ? `Found: ${p.prisoner_name} (${p.status})` : 'Not found';
        },
      },
      {
        name: 'searchPoliticalPrisoners',
        description: 'Search prisoners across all text fields (name, location, sentence, etc.).',
        params: [{ name: 'query', type: 'string', description: 'Search query' }],
        returns: 'Array<Object>',
        example: "dataApi.searchPoliticalPrisoners('Hong Kong')",
        live: () => `${dataApi.searchPoliticalPrisoners('Hong Kong').length} matches for "Hong Kong"`,
      },
      {
        name: 'getPoliticalPrisonersByStatus',
        description: 'Filter prisoners by status (DETAINED, DECEASED, DISAPPEARED, EXILE, RELEASED, AT RISK).',
        params: [{ name: 'status', type: 'string', description: 'Status to filter by (case-insensitive)' }],
        returns: 'Array<Object>',
        example: "dataApi.getPoliticalPrisonersByStatus('DETAINED')",
        live: () => `${dataApi.getPoliticalPrisonersByStatus('DETAINED').length} currently detained`,
      },
    ],
  },
  {
    id: 'sanctions',
    title: 'Sanctions',
    icon: Filter,
    methods: [
      {
        name: 'getSanctions',
        description: 'Returns all international sanctions records.',
        params: [],
        returns: 'Array<{ country, type, target, role, reason, date, law, status, source_url }>',
        example: "dataApi.getSanctions()",
        live: () => `${dataApi.getSanctions().length} records`,
      },
      {
        name: 'getSanctionsByCountry',
        description: 'Filter sanctions by issuing country (us, uk, eu, canada, australia).',
        params: [{ name: 'country', type: 'string', description: 'Country code (lowercase)' }],
        returns: 'Array<Object>',
        example: "dataApi.getSanctionsByCountry('us')",
        live: () => `${dataApi.getSanctionsByCountry('us').length} US sanctions`,
      },
      {
        name: 'searchSanctions',
        description: 'Search sanctions across all text fields.',
        params: [{ name: 'query', type: 'string', description: 'Search query' }],
        returns: 'Array<Object>',
        example: "dataApi.searchSanctions('Hong Kong')",
        live: () => `${dataApi.searchSanctions('Hong Kong').length} matches`,
      },
    ],
  },
  {
    id: 'officials',
    title: 'Sanctioned Officials',
    icon: Database,
    methods: [
      {
        name: 'getSanctionedOfficials',
        description: 'Returns all sanctioned CCP officials with biographical data.',
        params: [],
        returns: 'Array<{ id, name, position, responsibility_area, key_abuses, current_status, source_url }>',
        example: "dataApi.getSanctionedOfficials()",
        live: () => `${dataApi.getSanctionedOfficials().length} records`,
      },
      {
        name: 'getSanctionedOfficialByName',
        description: 'Find a specific official by exact name match.',
        params: [{ name: 'name', type: 'string', description: 'Official name' }],
        returns: 'Object | null',
        example: "dataApi.getSanctionedOfficialByName('Carrie Lam')",
        live: () => {
          const o = dataApi.getSanctionedOfficialByName('Carrie Lam');
          return o ? `Found: ${o.name}` : 'Not found';
        },
      },
    ],
  },
  {
    id: 'timeline',
    title: 'Timeline Events',
    icon: BookOpen,
    methods: [
      {
        name: 'getTimelineEvents',
        description: 'Returns all chronological events documenting human rights violations.',
        params: [],
        returns: 'Array<{ id, date, title, category, significance, description, sources }>',
        example: "dataApi.getTimelineEvents()",
        live: () => `${dataApi.getTimelineEvents().length} events`,
      },
      {
        name: 'getTimelineEventsByCategory',
        description: 'Filter events by category (e.g., hongkong, uyghur, tibet, mainland).',
        params: [{ name: 'category', type: 'string', description: 'Event category' }],
        returns: 'Array<Object>',
        example: "dataApi.getTimelineEventsByCategory('hongkong')",
        live: () => `${dataApi.getTimelineEventsByCategory('hongkong').length} Hong Kong events`,
      },
      {
        name: 'getTimelineEventsInRange',
        description: 'Filter events within a date range (ISO format).',
        params: [
          { name: 'startDate', type: 'string', description: 'Start date (YYYY-MM-DD)' },
          { name: 'endDate', type: 'string', description: 'End date (YYYY-MM-DD)' },
        ],
        returns: 'Array<Object>',
        example: "dataApi.getTimelineEventsInRange('2020-01-01', '2020-12-31')",
        live: () => `${dataApi.getTimelineEventsInRange('2020-01-01', '2020-12-31').length} events in 2020`,
      },
    ],
  },
  {
    id: 'cross',
    title: 'Cross-Dataset',
    icon: Globe,
    methods: [
      {
        name: 'globalSearch',
        description: 'Search across all datasets simultaneously. Returns results grouped by dataset.',
        params: [{ name: 'query', type: 'string', description: 'Search query (min 2 characters)' }],
        returns: '{ political_prisoners, sanctions, officials, timeline_events, companies, facilities, alerts }',
        example: "dataApi.globalSearch('Hong Kong')",
        live: () => {
          const r = dataApi.globalSearch('Hong Kong');
          const total = Object.values(r).reduce((sum, arr) => sum + (arr?.length || 0), 0);
          return `${total} total matches across all datasets`;
        },
      },
      {
        name: 'getHongKongData',
        description: 'Returns all Hong Kong-related data across all datasets.',
        params: [],
        returns: '{ prisoners, sanctions, officials, timeline, alerts }',
        example: "dataApi.getHongKongData()",
        live: () => {
          const d = dataApi.getHongKongData();
          const total = Object.values(d).reduce((sum, arr) => sum + (arr?.length || 0), 0);
          return `${total} Hong Kong records`;
        },
      },
      {
        name: 'getUyghurData',
        description: 'Returns all Uyghur-related data across all datasets.',
        params: [],
        returns: '{ prisoners, companies, facilities, timeline, alerts }',
        example: "dataApi.getUyghurData()",
        live: () => {
          const d = dataApi.getUyghurData();
          const total = Object.values(d).reduce((sum, arr) => sum + (arr?.length || 0), 0);
          return `${total} Uyghur records`;
        },
      },
    ],
  },
];

const DataApiDocs = () => {
  const [expandedGroup, setExpandedGroup] = useState('metadata');
  const [copiedMethod, setCopiedMethod] = useState(null);

  const summary = useMemo(() => {
    const s = dataApi.getDatasetSummary();
    const totalRecords = Object.values(s.datasets).reduce((sum, d) => sum + d.count, 0);
    return { ...s, totalRecords };
  }, []);
  const totalMethods = METHOD_GROUPS.reduce((sum, g) => sum + g.methods.length, 0);

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedMethod(text);
      setTimeout(() => setCopiedMethod(null), 2000);
    });
  };

  const toggleGroup = (id) => {
    setExpandedGroup(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-[#4afa82] p-5">
        <div className="flex items-center gap-3 mb-2">
          <Code className="w-6 h-6 text-[#4afa82]" />
          <h2 className="text-xl font-bold text-white font-mono">API Reference</h2>
        </div>
        <p className="text-slate-400 text-sm">
          Programmatic access to {summary.totalRecords} verified records across {Object.keys(summary.datasets).length} datasets.
          Import and use in your code:
        </p>
        <div className="mt-3 bg-[#111820] border border-[#1c2a35] p-3 font-mono text-sm">
          <span className="text-slate-400">import</span>{' '}
          <span className="text-[#22d3ee]">{'{ dataApi }'}</span>{' '}
          <span className="text-slate-400">from</span>{' '}
          <span className="text-[#4afa82]">&apos;../services/dataApi&apos;</span>
          <span className="text-slate-400">;</span>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-mono">
          <span>{totalMethods} methods</span>
          <span className="text-slate-600" aria-hidden="true">|</span>
          <span>{Object.keys(summary.datasets).length} datasets</span>
          <span className="text-slate-600" aria-hidden="true">|</span>
          <span>{summary.totalRecords} records</span>
          <span className="text-slate-600" aria-hidden="true">|</span>
          <span>CC BY 4.0</span>
        </div>
      </div>

      {/* REST API Section */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-[#22d3ee] p-5">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="w-5 h-5 text-[#22d3ee]" />
          <h3 className="text-lg font-bold text-white font-mono">REST API</h3>
        </div>
        <p className="text-slate-400 text-sm mb-3">
          Access the same data via HTTP endpoints. No authentication required for read access.
        </p>
        <div className="bg-[#111820] border border-[#1c2a35] p-3 font-mono text-sm space-y-1">
          <div><span className="text-[#4afa82]">GET</span> <span className="text-slate-300">/api/v1/</span> <span className="text-slate-400">── API info + endpoints</span></div>
          <div><span className="text-[#4afa82]">GET</span> <span className="text-slate-300">/api/v1/prisoners</span> <span className="text-slate-400">── Political prisoners</span></div>
          <div><span className="text-[#4afa82]">GET</span> <span className="text-slate-300">/api/v1/sanctions</span> <span className="text-slate-400">── Sanctions tracker</span></div>
          <div><span className="text-[#4afa82]">GET</span> <span className="text-slate-300">/api/v1/officials</span> <span className="text-slate-400">── Sanctioned officials</span></div>
          <div><span className="text-[#4afa82]">GET</span> <span className="text-slate-300">/api/v1/facilities</span> <span className="text-slate-400">── Detention facilities</span></div>
          <div><span className="text-[#4afa82]">GET</span> <span className="text-slate-300">/api/v1/companies</span> <span className="text-slate-400">── Forced labor companies</span></div>
          <div><span className="text-[#4afa82]">GET</span> <span className="text-slate-300">/api/v1/search?q=X</span> <span className="text-slate-400">── Global search</span></div>
        </div>
        <div className="mt-3 text-xs text-slate-400 font-mono">
          Query params: ?q=search&amp;region=X&amp;category=X&amp;limit=N&amp;offset=N
        </div>
      </div>

      {/* Method Groups */}
      <div className="space-y-2">
        {METHOD_GROUPS.map((group) => {
          const isExpanded = expandedGroup === group.id;
          const GroupIcon = group.icon;
          return (
            <div key={group.id} className="border border-[#1c2a35] bg-[#111820]">
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#1c2a35]/30 transition-colors"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3">
                  <GroupIcon className="w-4 h-4 text-[#22d3ee]" />
                  <span className="font-mono font-bold text-white">{group.title}</span>
                  <span className="text-xs text-slate-400 font-mono">{group.methods.length} methods</span>
                </div>
                {isExpanded
                  ? <ChevronUp className="w-4 h-4 text-slate-400" />
                  : <ChevronDown className="w-4 h-4 text-slate-400" />
                }
              </button>

              {isExpanded && (
                <div className="border-t border-[#1c2a35] p-4 space-y-4">
                  {group.methods.map((method) => (
                    <div key={method.name} className="bg-[#0a0e14] border border-[#1c2a35] p-4">
                      {/* Method signature */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <code className="text-[#4afa82] font-mono text-sm font-bold">{method.name}</code>
                          <span className="text-slate-400 font-mono text-sm">
                            ({method.params.map((p) => p.name).join(', ')})
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(method.example)}
                          className="flex-shrink-0 p-1.5 hover:bg-[#1c2a35] transition-colors"
                          aria-label={`Copy ${method.name} example`}
                          title="Copy example"
                        >
                          {copiedMethod === method.example
                            ? <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                            : <Copy className="w-3.5 h-3.5 text-slate-400" />
                          }
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-slate-400 text-sm mt-1">{method.description}</p>

                      {/* Parameters */}
                      {method.params.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-slate-400 font-mono uppercase">params:</span>
                          <div className="mt-1 space-y-1">
                            {method.params.map((p) => (
                              <div key={p.name} className="flex items-center gap-2 text-xs font-mono">
                                <span className="text-[#22d3ee]">{p.name}</span>
                                <span className="text-slate-400">:</span>
                                <span className="text-yellow-400">{p.type}</span>
                                <span className="text-slate-400"> — {p.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Returns */}
                      <div className="mt-2">
                        <span className="text-xs text-slate-400 font-mono uppercase">returns:</span>
                        <code className="ml-2 text-xs text-yellow-400 font-mono">{method.returns}</code>
                      </div>

                      {/* Live example */}
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="text-[#4afa82] font-mono">$</span>
                        <code className="text-slate-300 font-mono">{method.example}</code>
                        <span className="text-slate-400">→</span>
                        <span className="text-[#22d3ee] font-mono">{method.live()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
        <CheckCircle className="w-3.5 h-3.5 text-green-400" />
        <span>All data verified from Tier 1-2 sources (BBC, Reuters, HRW, Amnesty, government records)</span>
      </div>
    </div>
  );
};

export default DataApiDocs;
