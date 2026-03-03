import React, { useState, useEffect } from 'react';
import { Siren, AlertTriangle, Info, ExternalLink } from 'lucide-react';
import alertsData from '../data/emergency_alerts.json';
import EventCountdown from './EventCountdown';

const INITIAL_DISPLAY_COUNT = 2;

const EmergencyAlerts = () => {
  const [dismissedAlerts, setDismissedAlerts] = useState(() => {
    const saved = localStorage.getItem('dismissedAlerts');
    return saved ? JSON.parse(saved) : [];
  });
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    localStorage.setItem('dismissedAlerts', JSON.stringify(dismissedAlerts));
  }, [dismissedAlerts]);

  const alerts = alertsData;

  const now = new Date().toISOString().split('T')[0];
  const activeAlerts = alerts.filter(alert => {
    if (!alert.active) return false;
    if (dismissedAlerts.includes(alert.id)) return false;
    if (alert.expires && alert.expires < now) return false;
    return true;
  });

  const displayedAlerts = showAll ? activeAlerts : activeAlerts.slice(0, INITIAL_DISPLAY_COUNT);
  const hiddenCount = activeAlerts.length - INITIAL_DISPLAY_COUNT;

  const dismissAlert = (alertId) => {
    setDismissedAlerts([...dismissedAlerts, alertId]);
  };

  const typeStyles = {
    critical: {
      bg: 'bg-red-900/20',
      border: 'border-l-2 border-l-red-500',
      Icon: Siren,
      badge: 'bg-red-600',
      prefixColor: 'text-red-700',
      prefix: '!!',
    },
    warning: {
      bg: 'bg-yellow-900/15',
      border: 'border-l-2 border-l-yellow-500',
      Icon: AlertTriangle,
      badge: 'bg-yellow-600',
      prefixColor: 'text-yellow-700',
      prefix: '!~',
    },
    info: {
      bg: 'bg-cyan-900/15',
      border: 'border-l-2 border-l-[#22d3ee]',
      Icon: Info,
      badge: 'bg-[#22d3ee]/80',
      prefixColor: 'text-cyan-700',
      prefix: '--',
    },
  };

  const alertBorderBase = 'border-t border-r border-b border-[#1c2a35]';

  if (activeAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      {displayedAlerts.map(alert => {
        const styles = typeStyles[alert.type];
        const isExpanded = expandedAlert === alert.id;
        
        return (
          <div 
            key={alert.id}
            className={`${styles.bg} ${styles.border} ${alertBorderBase} overflow-hidden`}
          >
            {/* Header */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-mono ${styles.prefixColor} text-xs select-none`} aria-hidden="true">{styles.prefix}</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 ${styles.badge} text-white uppercase`}>
                      {alert.type}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{alert.date}</span>
                    {alert.lastVerified && (
                      <span className="text-xs text-slate-400 font-mono" title={`Last verified: ${alert.lastVerified}`}>✓ {alert.lastVerified}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-white">{alert.title}</h3>
                  <p className="text-sm text-slate-300 mt-1">{alert.summary}</p>
                  {alert.eventDate && (
                    <EventCountdown eventDate={alert.eventDate} label={`Countdown to ${alert.title}`} />
                  )}
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-slate-500 hover:text-slate-300 ml-4 font-mono"
                  aria-label="Dismiss alert"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                  className="text-sm text-[#4afa82] hover:text-[#7dffaa] font-mono"
                  aria-label={isExpanded ? 'Collapse alert details' : 'Expand alert details'}
                >
                  {isExpanded ? '$ collapse ↑' : '$ expand --details →'}
                </button>
                <div className="flex space-x-2">
                  {alert.links.slice(0, 2).map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono px-2 py-1 bg-[#111820] hover:bg-[#1c2a35] text-slate-300 border border-[#1c2a35] hover:border-[#2a9a52] transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Expanded Details */}
            {isExpanded && (
              <div className="px-4 pb-4 pt-2 border-t border-[#1c2a35]">
                <p className="text-sm text-slate-300 whitespace-pre-line mb-4">
                  {alert.details}
                </p>
                <div className="flex flex-wrap gap-2">
                  {alert.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono px-3 py-1.5 bg-[#111820] hover:bg-[#1c2a35] text-[#4afa82] border border-[#1c2a35] hover:border-[#2a9a52] transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 inline" /> {link.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      {/* Show more alerts toggle */}
      {hiddenCount > 0 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-2.5 bg-[#111820] hover:bg-[#1c2a35] border border-[#1c2a35] hover:border-[#2a9a52] text-sm text-slate-300 font-mono transition-colors"
        >
          $ show --more ({hiddenCount} more {hiddenCount === 1 ? 'alert' : 'alerts'})
        </button>
      )}
      {showAll && hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full py-2 text-xs text-slate-400 hover:text-[#4afa82] font-mono transition-colors"
        >
          $ collapse --alerts
        </button>
      )}
      
      {/* Show dismissed count */}
      {dismissedAlerts.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => setDismissedAlerts([])}
            className="text-xs text-slate-400 hover:text-[#4afa82] font-mono"
          >
            $ show --dismissed ({dismissedAlerts.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default EmergencyAlerts;
