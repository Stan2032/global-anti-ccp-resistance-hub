/**
 * PrintableReport — Generates printer-friendly reports from platform
 * data. Supports PDF-style layout with charts, summaries, and
 * source citations.
 *
 * @module PrintableReport
 */
import React, { useState, useRef } from 'react';
import { Printer, Download, FileText, X, ChevronDown, ChevronUp } from 'lucide-react';
import alertsData from '../data/emergency_alerts.json';

const KEY_FACTS = [
  { label: 'Political prisoners documented', value: '63+', source: 'CECC, HRW, Amnesty' },
  { label: 'Uyghurs in detention camps', value: '1–3 million', source: 'ASPI, OHCHR' },
  { label: 'Overseas CCP police stations', value: '102+', source: 'Safeguard Defenders' },
  { label: 'HK political prisoners (NSL)', value: '260+', source: 'Hong Kong Watch' },
  { label: 'Forced labor companies flagged', value: '144+', source: 'US UFLPA Entity List' },
  { label: 'Detention facilities (Xinjiang)', value: '380+', source: 'ASPI Xinjiang Data Project' },
  { label: 'Journalists imprisoned', value: '44', source: 'CPJ, RSF' },
  { label: 'Sanctioned officials/entities', value: '47', source: 'US, UK, EU, CA, AU sanctions' },
];

const ACTION_ITEMS = [
  'Contact your elected representatives about CCP human rights abuses',
  'Check the UFLPA Entity List before purchasing — avoid forced labor products',
  'Support organizations like Hong Kong Watch, Safeguard Defenders, UHRP',
  'Share verified information on social media to raise awareness',
  'Attend vigils, rallies, and awareness events in your community',
  'Report suspected CCP interference to local authorities',
];

const PrintableReport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const activeAlerts = alertsData.filter(a => {
    if (!a.active) return false;
    if (a.expires && a.expires < now.toISOString().split('T')[0]) return false;
    return true;
  });

  const handlePrint = () => {
    const printContent = reportRef.current;
    if (!printContent) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>CCP Human Rights Abuses — Summary Report</title>
      <style>
        body { font-family: 'Courier New', monospace; max-width: 700px; margin: 0 auto; padding: 24px; color: #111; font-size: 13px; line-height: 1.5; }
        h1 { font-size: 18px; border-bottom: 2px solid #111; padding-bottom: 8px; }
        h2 { font-size: 14px; margin-top: 20px; border-bottom: 1px solid #999; padding-bottom: 4px; }
        table { width: 100%; border-collapse: collapse; margin: 8px 0; }
        td, th { border: 1px solid #999; padding: 4px 8px; text-align: left; font-size: 12px; }
        th { background: #eee; font-weight: bold; }
        .alert { border: 1px solid #333; padding: 8px; margin: 6px 0; }
        .alert-title { font-weight: bold; }
        .footer { margin-top: 24px; font-size: 11px; color: #666; border-top: 1px solid #999; padding-top: 8px; }
        ul { padding-left: 20px; }
        li { margin: 4px 0; }
        @media print { body { padding: 0; } }
      </style>
      </head><body>
      ${printContent.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-[#111820] border border-[#1c2a35] text-slate-300 hover:text-[#4afa82] hover:border-[#4afa82] transition-colors font-mono text-sm"
        aria-label="Generate printable report"
      >
        <Printer className="w-4 h-4" />
        Generate Report
      </button>
    );
  }

  return (
    <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-[#4afa82]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#1c2a35]">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#4afa82]" />
          <h3 className="font-mono text-sm font-bold text-white">$ generate_report</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4afa82]/10 border border-[#4afa82]/50 text-[#4afa82] hover:bg-[#4afa82]/20 transition-colors font-mono text-xs"
            aria-label="Print report"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
            aria-label={isExpanded ? 'Collapse preview' : 'Expand preview'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
            aria-label="Close report generator"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className={`p-4 ${isExpanded ? '' : 'max-h-64 overflow-hidden relative'}`}>
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#0a0e14] z-10 pointer-events-none border-t border-[#1c2a35]" />
        )}

        <div ref={reportRef} className="font-mono text-xs text-slate-300 space-y-4">
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '2px solid currentColor', paddingBottom: '4px' }}>
              CCP Human Rights Abuses — Summary Report
            </h1>
            <p style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
              Generated {dateStr} | Source: Global Resistance Hub (globalresistancehub.org)
            </p>
          </div>

          {/* Key Statistics */}
          <div>
            <h2 style={{ fontSize: '13px', fontWeight: 'bold', borderBottom: '1px solid #555', paddingBottom: '2px' }}>
              KEY STATISTICS
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '6px' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #333', padding: '3px 6px', background: '#1c2a35', textAlign: 'left', fontSize: '11px' }}>Metric</th>
                  <th style={{ border: '1px solid #333', padding: '3px 6px', background: '#1c2a35', textAlign: 'left', fontSize: '11px' }}>Count</th>
                  <th style={{ border: '1px solid #333', padding: '3px 6px', background: '#1c2a35', textAlign: 'left', fontSize: '11px' }}>Source</th>
                </tr>
              </thead>
              <tbody>
                {KEY_FACTS.map((f, i) => (
                  <tr key={i}>
                    <td style={{ border: '1px solid #333', padding: '3px 6px', fontSize: '11px' }}>{f.label}</td>
                    <td style={{ border: '1px solid #333', padding: '3px 6px', fontSize: '11px', fontWeight: 'bold' }}>{f.value}</td>
                    <td style={{ border: '1px solid #333', padding: '3px 6px', fontSize: '11px', color: '#888' }}>{f.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Active Alerts */}
          {activeAlerts.length > 0 && (
            <div>
              <h2 style={{ fontSize: '13px', fontWeight: 'bold', borderBottom: '1px solid #555', paddingBottom: '2px' }}>
                URGENT ALERTS ({activeAlerts.length})
              </h2>
              {activeAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} style={{ border: '1px solid #333', padding: '6px', margin: '6px 0' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '11px' }}>[{alert.type?.toUpperCase()}] {alert.title}</div>
                  <div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>{alert.summary}</div>
                </div>
              ))}
              {activeAlerts.length > 3 && (
                <p style={{ fontSize: '10px', color: '#888' }}>+ {activeAlerts.length - 3} more alerts — see full list online</p>
              )}
            </div>
          )}

          {/* Action Items */}
          <div>
            <h2 style={{ fontSize: '13px', fontWeight: 'bold', borderBottom: '1px solid #555', paddingBottom: '2px' }}>
              WHAT YOU CAN DO
            </h2>
            <ul style={{ paddingLeft: '16px', margin: '6px 0' }}>
              {ACTION_ITEMS.map((item, i) => (
                <li key={i} style={{ fontSize: '11px', margin: '3px 0' }}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div style={{ fontSize: '10px', color: '#888', borderTop: '1px solid #555', paddingTop: '6px', marginTop: '12px' }}>
            <p>This report was generated from the Global Anti-CCP Resistance Hub, an open-source platform
              documenting CCP human rights abuses. All data is sourced from verified Tier 1-2 organizations
              (BBC, Reuters, HRW, Amnesty, CPJ, Safeguard Defenders, ASPI).</p>
            <p style={{ marginTop: '4px' }}>License: CC BY 4.0 | Code: MIT | Report date: {dateStr}</p>
          </div>
        </div>
      </div>

      {/* Footer controls */}
      {!isExpanded && (
        <div className="px-4 pb-3">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-[#4afa82] font-mono text-xs hover:underline"
          >
            ▼ show full preview
          </button>
        </div>
      )}
    </div>
  );
};

export default PrintableReport;
