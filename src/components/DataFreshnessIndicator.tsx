/**
 * DataFreshnessIndicator — Visual indicator showing how recently a
 * data source was verified. Uses colour-coded badges (green/amber/red)
 * based on days since last verification.
 *
 * @param {Object} props
 * @param {string} props.lastVerified - ISO date of last verification
 * @returns {React.ReactElement} Freshness badge
 */
import { getFreshnessInfo } from '../utils/dateUtils';
import type { FreshnessInfo } from '../utils/dateUtils';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface LevelConfigEntry {
  Icon: LucideIcon;
  color: string;
  bg: string;
}

const levelConfig: Record<FreshnessInfo['level'], LevelConfigEntry> = {
  fresh: { Icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-900/20' },
  recent: { Icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-900/15' },
  stale: { Icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-900/15' },
};

interface DataFreshnessIndicatorProps {
  lastVerified: string;
  compact?: boolean;
}

const DataFreshnessIndicator: React.FC<DataFreshnessIndicatorProps> = ({ lastVerified, compact = false }) => {
  if (!lastVerified) return null;
  
  const { label, level } = getFreshnessInfo(lastVerified);
  const { Icon, color, bg } = levelConfig[level];

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-mono ${color}`} title={`Last verified: ${lastVerified}`}>
        <Icon className="w-3 h-3" aria-hidden="true" />
        <span>{label}</span>
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-mono ${color} ${bg} border border-[#1c2a35]`} title={`Last verified: ${lastVerified}`}>
      <Icon className="w-3 h-3" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
};

export default DataFreshnessIndicator;
