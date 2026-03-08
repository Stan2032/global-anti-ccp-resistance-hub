// @ts-nocheck — Phase 2 migration: types to be added
/**
 * DataChangelog — Chronological log of all data changes, additions,
 * and corrections across platform datasets. Provides transparency
 * on data provenance and update frequency.
 *
 * @module DataChangelog
 */
import React, { useState, useMemo } from 'react';
import {
  History,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  ChevronDown,
  ChevronUp,
  Calendar,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { dataApi } from '../services/dataApi';

/**
 * DataChangelog — Research data provenance and verification tracker.
 *
 * Displays dataset health (verification freshness), recent changes,
 * and data provenance information. Helps researchers assess data
 * currency and cite appropriately.
 */

// ── Verification metadata per dataset ─────────────────────
// These track when each dataset was last independently verified
// against primary sources. Dates correspond to the _agents/DATA_VERIFICATION_LOG.md.
const DATASET_VERIFICATION = [
  {
    id: 'political_prisoners',
    name: 'Political Prisoners',
    file: 'political_prisoners_research.json',
    lastVerified: '2026-03-02',
    verificationNote: '63 records verified against BBC, Reuters, HRW, Amnesty. All last_verified fields updated.',
    recordCount: () => dataApi.getPoliticalPrisoners().length,
  },
  {
    id: 'sanctions',
    name: 'Sanctions Tracker',
    file: 'sanctions_tracker.json',
    lastVerified: '2026-03-02',
    verificationNote: '47 entries verified against US Treasury OFAC, UK OFSI, EU Council, Canada SEMA.',
    recordCount: () => dataApi.getSanctions().length,
  },
  {
    id: 'sanctioned_officials',
    name: 'Sanctioned Officials',
    file: 'sanctioned_officials_research.json',
    lastVerified: '2026-02-25',
    verificationNote: 'All officials cross-checked with government sanctions databases.',
    recordCount: () => dataApi.getSanctionedOfficials().length,
  },
  {
    id: 'timeline_events',
    name: 'Timeline Events',
    file: 'timeline_events.json',
    lastVerified: '2026-03-05',
    verificationNote: '34 events spanning 1989-2026. All dates verified with Tier 1-2 sources.',
    recordCount: () => dataApi.getTimelineEvents().length,
  },
  {
    id: 'forced_labor',
    name: 'Forced Labor Companies',
    file: 'forced_labor_companies_research.json',
    lastVerified: '2026-02-26',
    verificationNote: 'Companies verified against UFLPA Entity List and ASPI data.',
    recordCount: () => dataApi.getForcedLaborCompanies().length,
  },
  {
    id: 'detention_facilities',
    name: 'Detention Facilities',
    file: 'detention_facilities_research.json',
    lastVerified: '2026-02-26',
    verificationNote: 'Facilities verified via satellite imagery (ASPI) and survivor testimony.',
    recordCount: () => dataApi.getDetentionFacilities().length,
  },
  {
    id: 'emergency_alerts',
    name: 'Emergency Alerts',
    file: 'emergency_alerts.json',
    lastVerified: '2026-03-05',
    verificationNote: 'Active alerts reviewed and expires/eventDate fields validated.',
    recordCount: () => dataApi.getActiveAlerts().length,
  },
  {
    id: 'live_statistics',
    name: 'Live Statistics',
    file: 'live_statistics.json',
    lastVerified: '2026-03-02',
    verificationNote: 'Statistics cross-referenced with primary research sources.',
    recordCount: () => dataApi.getStatistics().length,
  },
];

/**
 * Compute freshness status for a verification date.
 * @param {string} dateStr — ISO date string (YYYY-MM-DD)
 * @returns {{ status: string, label: string, daysAgo: number }}
 */
function getFreshness(dateStr) {
  const verDate = new Date(dateStr);
  const now = new Date();
  const daysAgo = Math.floor((now - verDate) / (1000 * 60 * 60 * 24));

  if (daysAgo <= 3) return { status: 'fresh', label: 'Verified recently', daysAgo };
  if (daysAgo <= 7) return { status: 'current', label: 'Verified this week', daysAgo };
  if (daysAgo <= 14) return { status: 'aging', label: 'Verified within 2 weeks', daysAgo };
  return { status: 'stale', label: 'Needs re-verification', daysAgo };
}

const STATUS_COLORS = {
  fresh: { bg: 'bg-green-400/10', border: 'border-green-400/30', text: 'text-green-400', icon: CheckCircle },
  current: { bg: 'bg-[#22d3ee]/10', border: 'border-[#22d3ee]/30', text: 'text-[#22d3ee]', icon: CheckCircle },
  aging: { bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', text: 'text-yellow-400', icon: Clock },
  stale: { bg: 'bg-red-400/10', border: 'border-red-400/30', text: 'text-red-400', icon: AlertTriangle },
};

const DataChangelog = () => {
  const [expandedDataset, setExpandedDataset] = useState(null);
  const [showAllUpdates, setShowAllUpdates] = useState(false);

  // Compute dataset health metrics
  const datasets = useMemo(() =>
    DATASET_VERIFICATION.map((d) => ({
      ...d,
      records: d.recordCount(),
      freshness: getFreshness(d.lastVerified),
    })),
    []
  );

  // Get recent data-related updates
  const recentChanges = useMemo(() => {
    const all = dataApi.getRecentUpdates();
    const dataUpdates = all.filter(
      (u) => u.category === 'data' || u.category === 'verification' || u.category === 'case_update'
    );
    return showAllUpdates ? dataUpdates : dataUpdates.slice(0, 5);
  }, [showAllUpdates]);

  const totalDataUpdates = useMemo(() => {
    const all = dataApi.getRecentUpdates();
    return all.filter(
      (u) => u.category === 'data' || u.category === 'verification' || u.category === 'case_update'
    ).length;
  }, []);

  // Summary stats
  const summary = useMemo(() => {
    const fresh = datasets.filter((d) => d.freshness.status === 'fresh').length;
    const current = datasets.filter((d) => d.freshness.status === 'current').length;
    const aging = datasets.filter((d) => d.freshness.status === 'aging').length;
    const stale = datasets.filter((d) => d.freshness.status === 'stale').length;
    const totalRecords = datasets.reduce((sum, d) => sum + d.records, 0);
    return { fresh, current, aging, stale, totalRecords };
  }, [datasets]);

  const toggleDataset = (id) => {
    setExpandedDataset((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-2">
        <History className="w-8 h-8 text-[#22d3ee]" />
        <div>
          <h2 className="text-2xl font-bold text-white">Data Changelog</h2>
          <p className="text-slate-400 text-sm">Verification status and change history for all research datasets</p>
        </div>
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-green-400/10 border border-green-400/30 p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{summary.fresh}</div>
          <div className="text-xs text-slate-400">Fresh</div>
        </div>
        <div className="bg-[#22d3ee]/10 border border-[#22d3ee]/30 p-3 text-center">
          <div className="text-2xl font-bold text-[#22d3ee]">{summary.current}</div>
          <div className="text-xs text-slate-400">Current</div>
        </div>
        <div className="bg-yellow-400/10 border border-yellow-400/30 p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">{summary.aging}</div>
          <div className="text-xs text-slate-400">Aging</div>
        </div>
        <div className="bg-[#111820] border border-[#1c2a35] p-3 text-center">
          <div className="text-2xl font-bold text-white">{summary.totalRecords}</div>
          <div className="text-xs text-slate-400">Total Records</div>
        </div>
      </div>

      {/* Dataset Verification Status */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#4afa82]" />
          Dataset Verification Status
        </h3>
        {datasets.map((dataset) => {
          const style = STATUS_COLORS[dataset.freshness.status];
          const StatusIcon = style.icon;
          const isExpanded = expandedDataset === dataset.id;
          return (
            <div key={dataset.id} className={`${style.bg} border ${style.border} transition-colors`}>
              <button
                onClick={() => toggleDataset(dataset.id)}
                className="w-full flex items-center justify-between p-3 text-left"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <StatusIcon className={`w-4 h-4 ${style.text} flex-shrink-0`} />
                  <div className="min-w-0">
                    <span className="text-white font-medium">{dataset.name}</span>
                    <span className="text-slate-400 text-sm ml-2">({dataset.records} records)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs ${style.text}`}>{dataset.freshness.label}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>
              {isExpanded && (
                <div className="px-3 pb-3 border-t border-[#1c2a35] pt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400">Last verified:</span>
                    <span className="text-white">{dataset.lastVerified}</span>
                    <span className="text-slate-400">({dataset.freshness.daysAgo} days ago)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Database className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400">File:</span>
                    <code className="text-[#22d3ee] text-xs bg-[#0a0e14] px-1.5 py-0.5 rounded">{dataset.file}</code>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <RefreshCw className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{dataset.verificationNote}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Data Changes */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#4afa82]" />
          Recent Data Changes
        </h3>
        <div className="space-y-2">
          {recentChanges.map((update) => (
            <div
              key={update.id}
              className="bg-[#111820] border border-[#1c2a35] p-3 flex items-start gap-3"
            >
              <div className="flex-shrink-0 mt-0.5">
                {update.category === 'verification' ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : update.category === 'case_update' ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Database className="w-4 h-4 text-[#22d3ee]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white text-sm font-medium">{update.title}</span>
                  <span className="text-xs text-slate-400 bg-[#0a0e14] px-1.5 py-0.5 rounded">{update.category}</span>
                </div>
                <p className="text-slate-400 text-xs mt-1">{update.description}</p>
                <div className="text-xs text-slate-400 mt-1">{update.date}</div>
              </div>
            </div>
          ))}
        </div>
        {totalDataUpdates > 5 && (
          <button
            onClick={() => setShowAllUpdates((prev) => !prev)}
            className="text-sm text-[#22d3ee] hover:text-white transition-colors flex items-center gap-1"
          >
            {showAllUpdates ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show fewer
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show all {totalDataUpdates} data changes
              </>
            )}
          </button>
        )}
      </div>

      {/* Source Policy */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] p-4 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-[#4afa82]" />
          <span className="text-white font-medium">Source Policy</span>
        </div>
        <p className="text-slate-400">
          All data is sourced exclusively from Tier 1-2 outlets (BBC, Reuters, AP, HRW, Amnesty International, 
          government records). CCP state media (Xinhua, CGTN, People&apos;s Daily, Global Times) is never cited as a source. 
          Each record includes source URLs for independent verification.
        </p>
      </div>
    </div>
  );
};

export default DataChangelog;
