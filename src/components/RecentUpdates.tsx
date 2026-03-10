/**
 * RecentUpdates — Chronological feed of recent data updates and
 * platform changes. Shows what has been added, updated, or verified.
 *
 * @module RecentUpdates
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronDown, ChevronUp, AlertTriangle, Database, FileCheck, UserPlus, FileText, RefreshCw } from 'lucide-react';
import updates from '../data/recent_updates.json';

const INITIAL_DISPLAY_COUNT = 5;

const CATEGORY_CONFIG = {
  alert: { label: 'ALERT', color: 'text-red-400', bg: 'bg-red-900/30', Icon: AlertTriangle },
  data: { label: 'DATA', color: 'text-[#22d3ee]', bg: 'bg-cyan-900/30', Icon: Database },
  verification: { label: 'VERIFIED', color: 'text-[#4afa82]', bg: 'bg-[#4afa82]/10', Icon: FileCheck },
  case_update: { label: 'CASE', color: 'text-[#fbbf24]', bg: 'bg-yellow-900/30', Icon: RefreshCw },
  new_case: { label: 'NEW', color: 'text-red-400', bg: 'bg-red-900/30', Icon: UserPlus },
  report: { label: 'REPORT', color: 'text-[#22d3ee]', bg: 'bg-cyan-900/30', Icon: FileText },
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const RecentUpdates = () => {
  const [showAll, setShowAll] = useState(false);

  const sortedUpdates = [...(updates || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const displayedUpdates = showAll ? sortedUpdates : sortedUpdates.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = sortedUpdates.length > INITIAL_DISPLAY_COUNT;

  return (
    <div className="bg-[#111820] border border-[#1c2a35]">
      <div className="p-4 border-b border-[#1c2a35] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#4afa82]" />
          <h2 className="font-semibold text-white">recent_updates</h2>
        </div>
        <span className="text-xs font-mono text-slate-400">{sortedUpdates.length} entries</span>
      </div>

      <div className="divide-y divide-[#1c2a35]">
        {displayedUpdates.map((update) => {
          const config = (CATEGORY_CONFIG as Record<string, typeof CATEGORY_CONFIG.data>)[update.category] || CATEGORY_CONFIG.data;
          const CategoryIcon = config.Icon;

          return (
            <div key={update.id} className="p-4 hover:bg-[#0a0e14]/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  <CategoryIcon className={`w-4 h-4 ${config.color}`} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-xs font-mono px-1.5 py-0.5 ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {formatDate(update.date)}
                    </span>
                  </div>
                  <div className="font-mono text-sm text-white mb-1">
                    {update.relatedPage ? (
                      <Link to={update.relatedPage} className="hover:text-[#4afa82] transition-colors">
                        {update.title}
                      </Link>
                    ) : (
                      update.title
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono leading-relaxed">
                    {update.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="p-3 border-t border-[#1c2a35]">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-center gap-2 py-2 text-[#4afa82] hover:text-[#7dffaa] font-mono text-sm transition-colors"
            aria-expanded={showAll}
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>$ collapse --updates</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>$ show --all ({sortedUpdates.length - INITIAL_DISPLAY_COUNT} more)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentUpdates;
