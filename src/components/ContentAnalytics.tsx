/**
 * ContentAnalytics — Privacy-respecting research database metrics dashboard.
 *
 * Derives all analytics from verified JSON datasets with zero user tracking,
 * cookies, or third-party services. Displays record counts, prisoner status
 * breakdowns, geographic coverage, data freshness, and recent activity.
 *
 * @module ContentAnalytics
 */
import React, { useMemo } from 'react';
import {
  Database, Users, Shield, Clock, Globe, BarChart3,
  AlertTriangle, Building2, Scale, TrendingUp, CheckCircle,
  Calendar, FileText, Activity, type LucideIcon
} from 'lucide-react';
import { dataApi } from '../services/dataApi';

/**
 * ContentAnalytics — Research database metrics dashboard.
 *
 * Privacy-respecting analytics: NO user tracking, NO cookies, NO third-party
 * services. All metrics are derived from the platform's verified JSON datasets.
 *
 * Shows:
 * - Total records across all datasets
 * - Political prisoner status breakdown
 * - Geographic coverage analysis
 * - Data freshness indicators
 * - Recent activity timeline
 */

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'DETAINED': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  'DECEASED': { bg: 'bg-slate-500/10', text: 'text-slate-300', border: 'border-slate-500/30' },
  'DISAPPEARED': { bg: 'bg-cyan-500/10', text: 'text-[#22d3ee]', border: 'border-cyan-500/30' },
  'EXILE': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  'RELEASED': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  'AT RISK': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
};

const CATEGORY_COLORS: Record<string, string> = {
  alert: 'text-red-400 bg-red-400/10 border-red-400/30',
  data: 'text-[#22d3ee] bg-[#22d3ee]/10 border-[#22d3ee]/30',
  verification: 'text-green-400 bg-green-400/10 border-green-400/30',
  case_update: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  new_case: 'text-[#22d3ee] bg-[#22d3ee]/10 border-[#22d3ee]/30',
  report: 'text-slate-300 bg-slate-400/10 border-slate-400/30',
};

/** Displayable fields expected on recent update entries */
interface DisplayUpdate {
  id: string;
  date: string;
  title: string;
  category?: string;
  [key: string]: unknown;
}

interface DatasetCardProps {
  icon: LucideIcon;
  label: string;
  count: number;
  detail: string;
  color: string;
}

const ContentAnalytics = () => {
  const analytics = useMemo(() => {
    const summary = dataApi.getDatasetSummary();
    const prisoners = dataApi.getPoliticalPrisoners();
    const sanctions = dataApi.getSanctions();
    const timeline = dataApi.getTimelineEvents();
    const updates = dataApi.getRecentUpdates() as DisplayUpdate[];
    const alerts = dataApi.getAlerts();
    const facilities = dataApi.getDetentionFacilities();
    const companies = dataApi.getForcedLaborCompanies();

    // Total records across all datasets
    const totalRecords = Object.values(summary.datasets).reduce((sum, d) => sum + d.count, 0);

    // Prisoner status breakdown
    const prisonersByStatus: Record<string, number> = {};
    prisoners.forEach(p => {
      const status = p.status || 'UNKNOWN';
      prisonersByStatus[status] = (prisonersByStatus[status] || 0) + 1;
    });

    // Sanctions by country
    const sanctionsByCountry: Record<string, number> = {};
    sanctions.forEach(s => {
      const country = s.country || 'unknown';
      sanctionsByCountry[country] = (sanctionsByCountry[country] || 0) + 1;
    });

    // Timeline by decade
    const timelineByDecade: Record<string, number> = {};
    timeline.forEach(e => {
      const year = parseInt(e.date?.substring(0, 4));
      if (!isNaN(year)) {
        const decade = `${Math.floor(year / 10) * 10}s`;
        timelineByDecade[decade] = (timelineByDecade[decade] || 0) + 1;
      }
    });

    // Timeline by category
    const timelineByCategory: Record<string, number> = {};
    timeline.forEach(e => {
      const cat = e.category || 'other';
      timelineByCategory[cat] = (timelineByCategory[cat] || 0) + 1;
    });

    // Active vs inactive alerts
    const activeAlerts = alerts.filter(a => a.active).length;
    const criticalAlerts = alerts.filter(a => a.type === 'critical').length;

    // Geographic coverage
    const regions = {
      'Hong Kong': dataApi.getHongKongData().prisoners.length,
      'Uyghur Region': dataApi.getUyghurData().prisoners.length,
      'Tibet': prisoners.filter(p =>
        p.location?.toLowerCase().includes('tibet') ||
        p.prisoner_name?.toLowerCase().includes('tibet')
      ).length,
      'Mainland China': prisoners.filter(p =>
        p.location?.toLowerCase().includes('china') &&
        !p.location?.toLowerCase().includes('hong kong')
      ).length,
    };

    // Recent updates by category
    const updatesByCategory: Record<string, number> = {};
    (updates || []).forEach(u => {
      const cat = u.category || 'other';
      updatesByCategory[cat] = (updatesByCategory[cat] || 0) + 1;
    });

    return {
      summary,
      totalRecords,
      prisoners,
      prisonersByStatus,
      sanctions,
      sanctionsByCountry,
      timeline,
      timelineByDecade,
      timelineByCategory,
      alerts,
      activeAlerts,
      criticalAlerts,
      facilities,
      companies,
      regions,
      updates: updates || [],
      updatesByCategory,
    };
  }, []);

  const COUNTRY_LABELS: Record<string, string> = {
    us: 'United States',
    uk: 'United Kingdom',
    eu: 'European Union',
    canada: 'Canada',
    australia: 'Australia',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border border-[#1c2a35] bg-[#111820] p-4">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-5 h-5 text-[#4afa82]" />
          <h2 className="text-lg font-mono font-bold text-white">Content Analytics</h2>
        </div>
        <p className="text-slate-400 text-sm">
          Research database metrics — {analytics.totalRecords} verified records across {Object.keys(analytics.summary.datasets).length} datasets.
          No user tracking. All metrics derived from verified data.
        </p>
      </div>

      {/* Dataset Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <DatasetCard
          icon={Users}
          label="Political Prisoners"
          count={analytics.prisoners.length}
          detail={`${analytics.prisonersByStatus['DETAINED'] || 0} detained`}
          color="red"
        />
        <DatasetCard
          icon={Scale}
          label="Sanctions"
          count={analytics.sanctions.length}
          detail={`${Object.keys(analytics.sanctionsByCountry).length} countries`}
          color="cyan"
        />
        <DatasetCard
          icon={Clock}
          label="Timeline Events"
          count={analytics.timeline.length}
          detail={`${Object.keys(analytics.timelineByDecade).length} decades covered`}
          color="yellow"
        />
        <DatasetCard
          icon={AlertTriangle}
          label="Emergency Alerts"
          count={analytics.alerts.length}
          detail={`${analytics.activeAlerts} active`}
          color="orange"
        />
        <DatasetCard
          icon={Building2}
          label="Detention Facilities"
          count={analytics.facilities.length}
          detail="Documented sites"
          color="red"
        />
        <DatasetCard
          icon={Globe}
          label="Forced Labor"
          count={analytics.companies.length}
          detail="Linked companies"
          color="yellow"
        />
        <DatasetCard
          icon={Shield}
          label="Sanctioned Officials"
          count={analytics.summary.datasets.sanctioned_officials?.count || 0}
          detail="Named individuals"
          color="orange"
        />
        <DatasetCard
          icon={Activity}
          label="Recent Updates"
          count={analytics.updates.length}
          detail="Changelog entries"
          color="green"
        />
      </div>

      {/* Prisoner Status Breakdown */}
      <div className="border border-[#1c2a35] bg-[#111820] p-4">
        <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-3">
          <span className="text-slate-600" aria-hidden="true">──</span> Prisoner Status Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.entries(analytics.prisonersByStatus)
            .sort(([, a], [, b]) => b - a)
            .map(([status, count]) => {
              const colors = STATUS_COLORS[status] || { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' };
              return (
                <div
                  key={status}
                  className={`p-3 border ${colors.bg} ${colors.border}`}
                >
                  <div className={`text-xl font-bold font-mono ${colors.text}`}>{count}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">{status}</div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Two-column layout: Sanctions + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sanctions by Country */}
        <div className="border border-[#1c2a35] bg-[#111820] p-4">
          <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-3">
            <span className="text-slate-600" aria-hidden="true">──</span> Sanctions by Country
          </h3>
          <div className="space-y-2">
            {Object.entries(analytics.sanctionsByCountry)
              .sort(([, a], [, b]) => b - a)
              .map(([country, count]) => {
                const maxCount = Math.max(...Object.values(analytics.sanctionsByCountry));
                const percentage = Math.round((count / maxCount) * 100);
                return (
                  <div key={country} className="flex items-center gap-3">
                    <span className="text-sm text-slate-300 w-28 truncate font-mono">
                      {COUNTRY_LABELS[country] || country}
                    </span>
                    <div className="flex-1 bg-[#0a0e14] h-5 overflow-hidden">
                      <div
                        className="h-full bg-[#22d3ee]/30 border-r border-[#22d3ee]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono text-[#22d3ee] w-8 text-right">{count}</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Timeline Coverage */}
        <div className="border border-[#1c2a35] bg-[#111820] p-4">
          <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-3">
            <span className="text-slate-600" aria-hidden="true">──</span> Timeline by Decade
          </h3>
          <div className="space-y-2">
            {Object.entries(analytics.timelineByDecade)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([decade, count]) => {
                const maxCount = Math.max(...Object.values(analytics.timelineByDecade));
                const percentage = Math.round((count / maxCount) * 100);
                return (
                  <div key={decade} className="flex items-center gap-3">
                    <span className="text-sm text-slate-300 w-12 font-mono">{decade}</span>
                    <div className="flex-1 bg-[#0a0e14] h-5 overflow-hidden">
                      <div
                        className="h-full bg-[#fbbf24]/30 border-r border-[#fbbf24]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono text-[#fbbf24] w-8 text-right">{count}</span>
                  </div>
                );
              })}
          </div>
          {/* Category breakdown */}
          <div className="mt-4 pt-3 border-t border-[#1c2a35]">
            <h4 className="text-xs font-mono text-slate-400 uppercase mb-2">By Region</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(analytics.timelineByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, count]) => (
                  <span key={cat} className="text-xs font-mono px-2 py-1 bg-[#0a0e14] border border-[#1c2a35] text-slate-300">
                    {cat}: {count}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Geographic Coverage */}
      <div className="border border-[#1c2a35] bg-[#111820] p-4">
        <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-3">
          <span className="text-slate-600" aria-hidden="true">──</span> Geographic Coverage — Political Prisoners
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(analytics.regions).map(([region, count]) => (
            <div key={region} className="p-3 bg-[#0a0e14] border border-[#1c2a35]">
              <div className="text-xl font-bold font-mono text-white">{count}</div>
              <div className="text-xs text-slate-400">{region}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="border border-[#1c2a35] bg-[#111820] p-4">
        <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-3">
          <span className="text-slate-600" aria-hidden="true">──</span> Recent Data Activity
        </h3>
        <div className="space-y-2">
          {analytics.updates.slice(0, 5).map((update) => {
            const catColors = CATEGORY_COLORS[update.category || ''] || 'text-slate-400 bg-slate-400/10 border-slate-400/30';
            return (
              <div key={update.id} className="flex items-start gap-3 p-2 hover:bg-[#0a0e14] transition-colors">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-slate-400">{update.date}</span>
                    <span className={`text-xs font-mono px-1.5 py-0.5 border ${catColors}`}>
                      {update.category?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mt-0.5 truncate">{update.title}</p>
                </div>
              </div>
            );
          })}
        </div>
        {analytics.updates.length > 5 && (
          <div className="mt-2 pt-2 border-t border-[#1c2a35]">
            <p className="text-xs text-slate-400 font-mono">
              + {analytics.updates.length - 5} more entries in changelog
            </p>
          </div>
        )}
      </div>

      {/* Data Quality Footer */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
        <CheckCircle className="w-3.5 h-3.5 text-green-400" />
        <span>All data verified from Tier 1-2 sources (BBC, Reuters, HRW, Amnesty, government records)</span>
      </div>
    </div>
  );
};

/** Reusable dataset summary card */
const DatasetCard = ({ icon: Icon, label, count, detail, color }: DatasetCardProps) => {
  const borderColors: Record<string, string> = {
    red: 'border-l-red-400',
    cyan: 'border-l-[#22d3ee]',
    yellow: 'border-l-[#fbbf24]',
    orange: 'border-l-orange-400',
    green: 'border-l-[#4afa82]',
  };
  return (
    <div className={`bg-[#111820] border border-[#1c2a35] p-3 border-l-2 ${borderColors[color] || 'border-l-slate-400'}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-400 font-mono truncate">{label}</span>
      </div>
      <div className="text-xl font-bold font-mono text-white">{count}</div>
      <div className="text-xs text-slate-400">{detail}</div>
    </div>
  );
};

export default ContentAnalytics;
