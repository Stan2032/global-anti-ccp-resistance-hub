import React, { useState, useEffect } from 'react';
import { Siren, AlertTriangle, Info, ExternalLink } from 'lucide-react';

const EmergencyAlerts = () => {
  const [dismissedAlerts, setDismissedAlerts] = useState(() => {
    const saved = localStorage.getItem('dismissedAlerts');
    return saved ? JSON.parse(saved) : [];
  });
  const [expandedAlert, setExpandedAlert] = useState(null);

  useEffect(() => {
    localStorage.setItem('dismissedAlerts', JSON.stringify(dismissedAlerts));
  }, [dismissedAlerts]);

  const alerts = [
    {
      id: 'jimmy-lai-verdict',
      type: 'critical',
      title: 'URGENT: Jimmy Lai Sentenced to 20 Years in Prison',
      summary: 'Hong Kong media tycoon Jimmy Lai sentenced to 20 years under NSL',
      details: `On December 15, 2025, Jimmy Lai was found guilty on all charges including "conspiracy to collude with foreign forces" under Hong Kong's National Security Law. On February 9, 2026, he was sentenced to 20 years in prison — the harshest sentence yet under the NSL. This verdict represents a devastating blow to press freedom in Hong Kong.

ACTION NEEDED:
• Contact your representatives to demand his release
• Share his story on social media with #FreeJimmyLai
• Support the Committee for Freedom in Hong Kong
• Sign petitions calling for sanctions on HK officials`,
      date: '2025-12-15',
      links: [
        { name: 'Free Jimmy Lai Campaign', url: 'https://www.freejimmylai.com' },
        { name: 'Hong Kong Watch', url: 'https://www.hongkongwatch.org' },
      ],
      active: true,
    },
    {
      id: 'uyghur-forced-labor',
      type: 'warning',
      title: 'New Report: 57 Global Brands Linked to Uyghur Forced Labor',
      summary: 'Updated ASPI report identifies additional companies in forced labor supply chains',
      details: `The Australian Strategic Policy Institute has released an updated report identifying 57 major global brands with links to Uyghur forced labor in their supply chains.

KEY FINDINGS:
• Fashion, technology, and automotive sectors most affected
• Many companies have failed to conduct adequate due diligence
• Some companies have made improvements, others have not

WHAT YOU CAN DO:
• Check the full list before making purchases
• Contact companies to demand supply chain transparency
• Support the UFLPA enforcement`,
      date: '2024-12-15',
      links: [
        { name: 'ASPI Report', url: 'https://www.aspi.org.au/report/uyghurs-sale' },
        { name: 'Coalition to End Forced Labour', url: 'https://enduyghurforcedlabour.org' },
      ],
      active: true,
    },
    {
      id: 'taiwan-military',
      type: 'info',
      title: 'Taiwan Reports Increased PLA Activity Near Strait',
      summary: 'Taiwan defense ministry reports 47 PLA aircraft detected in past 24 hours',
      details: `Taiwan's Ministry of National Defense has reported increased People's Liberation Army activity near the Taiwan Strait, with 47 aircraft and 12 naval vessels detected in the past 24 hours.

CONTEXT:
• This follows recent diplomatic tensions
• Taiwan has raised its alert level
• International observers are monitoring the situation

STAY INFORMED:
• Follow Taiwan's Ministry of National Defense updates
• Monitor reputable news sources
• Support Taiwan solidarity initiatives`,
      date: '2024-12-18',
      links: [
        { name: 'Taiwan MND', url: 'https://www.mnd.gov.tw' },
        { name: 'Taiwan News', url: 'https://www.taiwannews.com.tw' },
      ],
      active: true,
    },
    {
      id: 'hk-47-sentencing',
      type: 'critical',
      title: 'Hong Kong 47: Mass Sentencing Underway',
      summary: '45 pro-democracy activists sentenced in largest NSL case',
      details: `The Hong Kong 47 case has concluded with 45 activists receiving sentences ranging from 4 to 10 years in prison. This is the largest prosecution under the National Security Law.

NOTABLE SENTENCES:
• Benny Tai: 10 years
• Joshua Wong: 4 years 8 months
• Claudia Mo: 4 years 2 months
• Gwyneth Ho: 7 years

This case represents a systematic dismantling of Hong Kong's pro-democracy movement.`,
      date: '2024-11-19',
      links: [
        { name: 'Hong Kong Watch HK47', url: 'https://www.hongkongwatch.org/hk47' },
      ],
      active: true,
    },
  ];

  const activeAlerts = alerts.filter(alert => alert.active && !dismissedAlerts.includes(alert.id));

  const dismissAlert = (alertId) => {
    setDismissedAlerts([...dismissedAlerts, alertId]);
  };

  const typeStyles = {
    critical: {
      bg: 'bg-red-900/20',
      border: 'border-l-2 border-red-500 border-t border-r border-b border-t-[#1c2a35] border-r-[#1c2a35] border-b-[#1c2a35]',
      Icon: Siren,
      badge: 'bg-red-600',
      prefix: '!!',
    },
    warning: {
      bg: 'bg-yellow-900/15',
      border: 'border-l-2 border-yellow-500 border-t border-r border-b border-t-[#1c2a35] border-r-[#1c2a35] border-b-[#1c2a35]',
      Icon: AlertTriangle,
      badge: 'bg-yellow-600',
      prefix: '!~',
    },
    info: {
      bg: 'bg-cyan-900/15',
      border: 'border-l-2 border-[#22d3ee] border-t border-r border-b border-t-[#1c2a35] border-r-[#1c2a35] border-b-[#1c2a35]',
      Icon: Info,
      badge: 'bg-[#22d3ee]/80',
      prefix: '--',
    },
  };

  if (activeAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      {activeAlerts.map(alert => {
        const styles = typeStyles[alert.type];
        const isExpanded = expandedAlert === alert.id;
        
        return (
          <div 
            key={alert.id}
            className={`${styles.bg} ${styles.border} overflow-hidden`}
          >
            {/* Header */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-mono text-[#1c2a35] text-xs select-none" aria-hidden="true">{styles.prefix}</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 ${styles.badge} text-white uppercase`}>
                      {alert.type}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{alert.date}</span>
                  </div>
                  <h3 className="font-bold text-white">{alert.title}</h3>
                  <p className="text-sm text-slate-300 mt-1">{alert.summary}</p>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-slate-500 hover:text-slate-300 ml-4 font-mono"
                  title="Dismiss alert"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                  className="text-sm text-[#4afa82] hover:text-[#7dffaa] font-mono"
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
      
      {/* Show dismissed count */}
      {dismissedAlerts.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => setDismissedAlerts([])}
            className="text-xs text-slate-500 hover:text-[#4afa82] font-mono"
          >
            $ show --dismissed ({dismissedAlerts.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default EmergencyAlerts;
