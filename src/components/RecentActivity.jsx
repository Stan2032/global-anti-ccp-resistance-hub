import React, { useState, useMemo } from 'react';
import { Clock, AlertTriangle, Users, Scale, FileText, ChevronDown, ChevronUp } from 'lucide-react';

import politicalPrisonersData from '../data/political_prisoners_research.json';
import sanctionsData from '../data/sanctions_tracker.json';
import emergencyAlerts from '../data/emergency_alerts.json';
import recentNews from '../data/recent_news_research.json';

const INITIAL_DISPLAY = 8;

const TYPE_CONFIG = {
  prisoner_update: { Icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-900/30', label: 'Prisoner Update' },
  sanction: { Icon: Scale, color: 'text-cyan-400', bg: 'bg-cyan-900/30', label: 'Sanctions' },
  alert: { Icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-900/30', label: 'Alert' },
  news: { Icon: FileText, color: 'text-[#4afa82]', bg: 'bg-[#4afa82]/10', label: 'News' },
  case_update: { Icon: Users, color: 'text-[#22d3ee]', bg: 'bg-cyan-900/30', label: 'Case Update' },
};

function buildActivityFeed() {
  const activities = [];

  // Recent political prisoner entries — format: { results: [{ output: { prisoner_name, status, last_verified, sentence }}] }
  const prisoners = politicalPrisonersData?.results;
  if (Array.isArray(prisoners)) {
    prisoners
      .filter(p => p.output?.last_verified)
      .sort((a, b) => (b.output.last_verified || '').localeCompare(a.output.last_verified || ''))
      .slice(0, 6)
      .forEach(p => {
        const o = p.output;
        activities.push({
          id: `prisoner-${o.prisoner_name}`,
          type: 'prisoner_update',
          title: `${o.prisoner_name} — ${o.status || 'documented'}`,
          detail: o.sentence || '',
          date: o.last_verified || '',
        });
      });
  }

  // Emergency alerts — format: [{ id, type, title, summary, active, lastVerified, date }]
  if (Array.isArray(emergencyAlerts)) {
    emergencyAlerts
      .filter(a => a.active)
      .forEach(a => {
        activities.push({
          id: `alert-${a.id}`,
          type: 'alert',
          title: a.title,
          detail: a.summary,
          date: a.lastVerified || a.date || '',
        });
      });
  }

  // Recent news items — format: { results: [{ output: { headline, summary, date }}] }
  const news = recentNews?.results;
  if (Array.isArray(news)) {
    news
      .filter(n => n.output?.date)
      .sort((a, b) => (b.output.date || '').localeCompare(a.output.date || ''))
      .slice(0, 5)
      .forEach(n => {
        const o = n.output;
        activities.push({
          id: `news-${o.date}-${o.headline?.slice(0, 20)}`,
          type: 'news',
          title: o.headline,
          detail: o.summary?.slice(0, 120) + (o.summary?.length > 120 ? '…' : ''),
          date: o.date,
        });
      });
  }

  // Sanctions tracker entries — format: { sanctions: [{ target, date, country, role, reason }] }
  const sanctions = sanctionsData?.sanctions;
  if (Array.isArray(sanctions)) {
    sanctions
      .filter(s => s.date)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 3)
      .forEach(s => {
        activities.push({
          id: `sanction-${s.target || s.id}`,
          type: 'sanction',
          title: `${s.target} — ${s.country?.toUpperCase() || 'sanctioned'}`,
          detail: s.reason || s.role || '',
          date: s.date,
        });
      });
  }

  // Sort all by date descending
  activities.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return activities;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

const RecentActivity = () => {
  const [showAll, setShowAll] = useState(false);
  const activities = useMemo(() => buildActivityFeed(), []);
  const displayed = showAll ? activities : activities.slice(0, INITIAL_DISPLAY);

  return (
    <div className="bg-[#111820] border border-[#1c2a35]">
      <div className="p-4 border-b border-[#1c2a35] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#22d3ee]" />
          <h2 className="font-semibold text-white font-mono">recent_activity</h2>
        </div>
        <span className="text-xs text-slate-500 font-mono">{activities.length} events</span>
      </div>

      <div className="divide-y divide-[#1c2a35]">
        {displayed.map((activity) => {
          const config = TYPE_CONFIG[activity.type] || TYPE_CONFIG.news;
          return (
            <div key={activity.id} className="p-3 hover:bg-[#0a0e14]/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`p-1.5 ${config.bg} flex-shrink-0 mt-0.5`}>
                  <config.Icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                    {activity.date && (
                      <span className="text-[10px] text-slate-500 font-mono">{formatDate(activity.date)}</span>
                    )}
                  </div>
                  <p className="text-sm text-white font-mono leading-snug truncate">{activity.title}</p>
                  {activity.detail && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{activity.detail}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activities.length > INITIAL_DISPLAY && (
        <div className="p-3 border-t border-[#1c2a35]">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-center gap-1 text-sm text-[#4afa82] hover:text-[#7dffaa] font-mono transition-colors"
            aria-label={showAll ? 'Show fewer activities' : `Show all ${activities.length} activities`}
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show all {activities.length} events
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
