/**
 * EmergencyAlerts — Active emergency alert display with severity-based styling.
 *
 * Renders every live alert from the emergency data, with countdown timers
 * for dated events. Each alert's details, and the alerts past the first two,
 * are native <details>, so all of it is readable without JavaScript.
 * Dismissing (remembered in localStorage) and copying need JavaScript, so
 * their buttons appear once it runs.
 *
 * @module EmergencyAlerts
 */
import React, { useState } from 'react';
import { Siren, AlertTriangle, Info, ExternalLink, Copy, Check } from 'lucide-react';
import alertsData from '../data/emergency_alerts.json';
import EventCountdown from './EventCountdown';
import { formatAlertForSharing, type AlertForSharing } from '../utils/dateUtils';
import { useBrowserValue, useStoredJson } from '../utils/ssr';

const INITIAL_DISPLAY_COUNT = 2;

/**
 * EmergencyAlerts — Displays live emergency alerts with severity-based styling.
 * Each alert's details open natively; once JavaScript runs, alerts can also
 * be dismissed (remembered in localStorage) and copied for sharing.
 *
 * @returns {React.ReactElement|null} Alert list, or null when there is no
 *   live alert and none dismissed to bring back
 */
const EmergencyAlerts = () => {
  // The HTML shows every live alert; the reader's own dismissals are
  // applied once the page has hydrated.
  const [dismissedAlerts, setDismissedAlerts] = useStoredJson<string[]>('dismissedAlerts', []);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  // Dismissing and copying need JavaScript, so their buttons wait for it.
  const scripted = useBrowserValue(() => true, false);

  const alerts = alertsData;

  const now = new Date().toISOString().split('T')[0];
  const severityOrder: Record<string, number> = { critical: 0, warning: 1, info: 2 };
  const liveAlerts = alerts
    .filter(alert => alert.active && !(alert.expires && alert.expires < now))
    .sort((a, b) => (severityOrder[a.type] ?? 3) - (severityOrder[b.type] ?? 3));
  const activeAlerts = liveAlerts.filter(alert => !dismissedAlerts.includes(alert.id));
  const dismissedCount = liveAlerts.length - activeAlerts.length;

  const shownAlerts = activeAlerts.slice(0, INITIAL_DISPLAY_COUNT);
  const foldedAlerts = activeAlerts.slice(INITIAL_DISPLAY_COUNT);

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts([...dismissedAlerts, alertId]);
  };

  const copyAlertText = async (alert: AlertForSharing & { id: string; type: string }) => {
    try {
      const text = formatAlertForSharing(alert);
      await navigator.clipboard.writeText(text);
      setCopiedId(alert.id as string);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for environments without clipboard API
    }
  };

  const typeStyles: Record<string, { bg: string; border: string; Icon: React.ComponentType<{ className?: string }>; badge: string; prefixColor: string; prefix: string }> = {
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

  // Nothing to show, and nothing dismissed to bring back.
  if (activeAlerts.length === 0 && dismissedCount === 0) {
    return null;
  }

  const renderAlert = (alert: (typeof activeAlerts)[number]) => {
    const styles = typeStyles[alert.type];
    return (
      <article
        key={alert.id}
        className={`${styles.bg} ${styles.border} ${alertBorderBase} overflow-hidden`}
      >
        {/* Header */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                <span className={`font-mono ${styles.prefixColor} text-xs select-none`} aria-hidden="true">{styles.prefix}</span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 ${styles.badge} text-white uppercase whitespace-nowrap`}>
                  {alert.type}
                </span>
                <span className="text-xs text-slate-400 font-mono whitespace-nowrap">{alert.date}</span>
                {alert.lastVerified && (
                  <span className="text-xs text-slate-400 font-mono whitespace-nowrap" title={`Last verified: ${alert.lastVerified}`}>✓ {alert.lastVerified}</span>
                )}
              </div>
              <h3 className="font-bold text-white">{alert.title}</h3>
              <p className="text-sm text-slate-300 mt-1">{alert.summary}</p>
              {alert.eventDate && (
                <EventCountdown eventDate={alert.eventDate} label={`Countdown to ${alert.title}`} />
              )}
            </div>
            {scripted && (
              <button
                type="button"
                onClick={() => dismissAlert(alert.id)}
                className="flex-shrink-0 text-slate-500 hover:text-slate-300 font-mono p-2"
                aria-label={`Dismiss alert: ${alert.title}`}
              >
                <span aria-hidden="true">✕</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {scripted && (
              <button
                type="button"
                onClick={() => copyAlertText(alert)}
                className={`text-xs font-mono px-2 py-1 border transition-colors flex items-center gap-1 ${
                  copiedId === alert.id
                    ? 'bg-green-900/30 border-green-600 text-green-400'
                    : 'bg-[#111820] hover:bg-[#1c2a35] text-slate-300 border-[#1c2a35] hover:border-[#2a9a52]'
                }`}
                aria-label={copiedId === alert.id ? 'Alert copied to clipboard' : 'Copy alert for sharing'}
              >
                {copiedId === alert.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedId === alert.id ? 'Copied!' : 'Share'}
              </button>
            )}
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

        {/* Details: a native disclosure, so they open without JavaScript */}
        <details className="border-t border-[#1c2a35]">
          <summary
            className="px-4 py-2 cursor-pointer list-none text-sm text-[#4afa82] hover:text-[#7dffaa] font-mono
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4afa82]
                       [&::-webkit-details-marker]:hidden"
          >
            <span className="summary-open:hidden">$ expand --details →</span>
            <span className="hidden summary-open:inline">$ collapse ↑</span>
            <span className="sr-only"> for {alert.title}</span>
          </summary>
          <div className="px-4 pb-4 pt-2">
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
        </details>
      </article>
    );
  };

  return (
    <div className="space-y-3 mb-6">
      {shownAlerts.map(renderAlert)}

      {/* The rest, in the page and folded: this opens without JavaScript */}
      {foldedAlerts.length > 0 && (
        <details>
          <summary
            className="w-full py-2.5 bg-[#111820] hover:bg-[#1c2a35] border border-[#1c2a35] hover:border-[#2a9a52]
                       text-sm text-slate-300 font-mono text-center cursor-pointer list-none transition-colors
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4afa82]
                       [&::-webkit-details-marker]:hidden"
          >
            <span className="summary-open:hidden">
              $ show --more ({foldedAlerts.length} more {foldedAlerts.length === 1 ? 'alert' : 'alerts'})
            </span>
            <span className="hidden summary-open:inline">$ collapse --alerts</span>
          </summary>
          <div className="space-y-3 mt-3">
            {foldedAlerts.map(renderAlert)}
          </div>
        </details>
      )}

      {/* Alerts this reader dismissed, to bring back. Never empty-handed:
          it stays when every alert is dismissed. */}
      {dismissedCount > 0 && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setDismissedAlerts([])}
            className="text-xs text-slate-400 hover:text-[#4afa82] font-mono"
          >
            $ show --dismissed ({dismissedCount})
          </button>
        </div>
      )}
    </div>
  );
};

export default EmergencyAlerts;
