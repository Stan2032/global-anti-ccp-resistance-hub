/**
 * EmbedWidget — Generates embeddable code snippets for other websites
 *
 * Allows journalists, activists, and researchers to embed live data
 * from the Resistance Hub on their own websites. Generates HTML/iframe
 * code with preview and copy-to-clipboard functionality.
 *
 * Widget types:
 * 1. Political Prisoner Card — Shows a specific prisoner's key info
 * 2. Statistics Badge — Live statistics counter
 * 3. Alert Banner — Emergency alerts with CTA
 * 4. Search Widget — Embeddable search across all datasets
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Code, Copy, CheckCircle, Eye, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { dataApi } from '../services/dataApi';

const SITE_URL = 'https://global-anti-ccp-resistance-hub.stane203.workers.dev';

const WIDGET_TYPES = [
  {
    id: 'prisoner-card',
    label: 'Political Prisoner Card',
    description: 'Embed a card showing key details about a political prisoner',
    icon: '🔒',
  },
  {
    id: 'stats-badge',
    label: 'Statistics Badge',
    description: 'Show a live statistics counter on your website',
    icon: '📊',
  },
  {
    id: 'alert-banner',
    label: 'Alert Banner',
    description: 'Display the latest emergency alert with a call to action',
    icon: '🚨',
  },
];

function generatePrisonerCard(prisoner) {
  if (!prisoner) return '';
  const name = prisoner.prisoner_name || prisoner.name || 'Unknown';
  const status = prisoner.status || 'Detained';
  const sentence = prisoner.sentence || 'Unknown';
  const location = prisoner.location || prisoner.detention_facility || '';
  const statusColor = status.toLowerCase().includes('released') ? '#4afa82' :
    status.toLowerCase().includes('disappeared') ? '#fbbf24' : '#ef4444';

  return `<!-- Resistance Hub: Political Prisoner Card -->
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:400px;background:#0a0e14;border:1px solid #1c2a35;border-left:3px solid ${statusColor};padding:16px;color:#e2e8f0;">
  <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">Political Prisoner</div>
  <div style="font-size:18px;font-weight:700;color:white;margin-bottom:4px;">${name}</div>
  <div style="display:flex;gap:12px;font-size:13px;color:#94a3b8;margin-bottom:8px;">
    <span style="color:${statusColor};">● ${status}</span>
    ${sentence !== 'Unknown' ? `<span>Sentence: ${sentence}</span>` : ''}
  </div>
  ${location ? `<div style="font-size:12px;color:#64748b;">Location: ${location}</div>` : ''}
  <a href="${SITE_URL}/prisoners" target="_blank" rel="noopener" style="display:inline-block;margin-top:12px;font-size:12px;color:#22d3ee;text-decoration:none;">Learn more at Resistance Hub →</a>
</div>`;
}

function generateStatsBadge(stats) {
  if (!stats || !Array.isArray(stats)) return '';
  const items = stats.slice(0, 4);
  const statDivs = items.map(s =>
    `    <div style="text-align:center;"><div style="font-size:24px;font-weight:700;color:#4afa82;">${s.value?.toLocaleString?.() || s.value}</div><div style="font-size:11px;color:#64748b;margin-top:2px;">${s.label}</div></div>`
  ).join('\n');

  return `<!-- Resistance Hub: Statistics Badge -->
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:500px;background:#0a0e14;border:1px solid #1c2a35;padding:16px;color:#e2e8f0;">
  <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">CCP Human Rights Violations</div>
  <div style="display:grid;grid-template-columns:repeat(${Math.min(items.length, 4)},1fr);gap:12px;">
${statDivs}
  </div>
  <a href="${SITE_URL}" target="_blank" rel="noopener" style="display:inline-block;margin-top:12px;font-size:11px;color:#22d3ee;text-decoration:none;">Data: Global Anti-CCP Resistance Hub — CC BY 4.0</a>
</div>`;
}

function generateAlertBanner(alert) {
  if (!alert) return '';
  const bgColor = alert.type === 'critical' ? '#7f1d1d' : '#78350f';
  const borderColor = alert.type === 'critical' ? '#ef4444' : '#fbbf24';

  return `<!-- Resistance Hub: Emergency Alert Banner -->
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;background:${bgColor};border:1px solid ${borderColor};padding:16px;color:#e2e8f0;">
  <div style="font-size:11px;color:${borderColor};text-transform:uppercase;letter-spacing:0.05em;font-weight:700;margin-bottom:6px;">${alert.type === 'critical' ? '🔴 CRITICAL ALERT' : '⚠️ ALERT'}</div>
  <div style="font-size:16px;font-weight:700;color:white;margin-bottom:6px;">${alert.title}</div>
  <div style="font-size:13px;color:#d1d5db;margin-bottom:12px;">${alert.summary}</div>
  <a href="${SITE_URL}/security" target="_blank" rel="noopener" style="display:inline-block;padding:8px 16px;background:${borderColor};color:#0a0e14;font-weight:600;font-size:13px;text-decoration:none;">Take Action →</a>
</div>`;
}

export default function EmbedWidget() {
  const [selectedType, setSelectedType] = useState('prisoner-card');
  const [selectedPrisoner, setSelectedPrisoner] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const prisoners = useMemo(() => dataApi.getPoliticalPrisoners() || [], []);
  const stats = useMemo(() => dataApi.getStatistics() || [], []);
  const alerts = useMemo(() => {
    const allAlerts = dataApi.getAlerts() || [];
    return allAlerts.filter(a => a.active);
  }, []);

  const selectedPrisonerObj = useMemo(() => {
    if (!selectedPrisoner) return prisoners[0] || null;
    return prisoners.find(p =>
      (p.prisoner_name || p.name || '').toLowerCase() === selectedPrisoner.toLowerCase()
    ) || prisoners[0] || null;
  }, [selectedPrisoner, prisoners]);

  const embedCode = useMemo(() => {
    switch (selectedType) {
      case 'prisoner-card':
        return generatePrisonerCard(selectedPrisonerObj);
      case 'stats-badge':
        return generateStatsBadge(stats);
      case 'alert-banner':
        return generateAlertBanner(alerts[0]);
      default:
        return '';
    }
  }, [selectedType, selectedPrisonerObj, stats, alerts]);

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [embedCode]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-[#a78bfa] p-5">
        <div className="flex items-center gap-3 mb-2">
          <Code className="w-6 h-6 text-[#a78bfa]" />
          <h2 className="text-xl font-bold text-white font-mono">Embed Widgets</h2>
        </div>
        <p className="text-slate-400 text-sm">
          Embed live data from the Resistance Hub on your website.
          Copy the HTML code and paste it into your page. Data licensed under CC BY 4.0.
        </p>
      </div>

      {/* Widget Type Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {WIDGET_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`text-left p-4 border transition-colors ${
              selectedType === type.id
                ? 'border-[#a78bfa] bg-[#a78bfa]/10'
                : 'border-[#1c2a35] bg-[#111820] hover:bg-[#1c2a35]/50'
            }`}
            aria-pressed={selectedType === type.id}
          >
            <div className="text-2xl mb-2">{type.icon}</div>
            <div className="font-mono font-bold text-white text-sm">{type.label}</div>
            <div className="text-xs text-slate-400 mt-1">{type.description}</div>
          </button>
        ))}
      </div>

      {/* Config Options */}
      {selectedType === 'prisoner-card' && (
        <div className="bg-[#111820] border border-[#1c2a35] p-4">
          <label className="block text-sm font-mono text-slate-400 mb-2">
            Select Prisoner
          </label>
          <select
            value={selectedPrisoner}
            onChange={(e) => setSelectedPrisoner(e.target.value)}
            className="w-full bg-[#0a0e14] border border-[#1c2a35] text-white p-2 font-mono text-sm"
          >
            {prisoners.map((p) => (
              <option key={p.id || p.prisoner_name} value={p.prisoner_name || p.name || ''}>
                {p.prisoner_name || p.name || 'Unknown'} — {p.status || 'Unknown'}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Preview */}
      <div className="bg-[#111820] border border-[#1c2a35]">
        <button
          onClick={() => setShowPreview(prev => !prev)}
          className="w-full flex items-center justify-between p-4 hover:bg-[#1c2a35]/30 transition-colors"
          aria-expanded={showPreview}
        >
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#a78bfa]" />
            <span className="font-mono font-bold text-white text-sm">Preview</span>
          </div>
          {showPreview ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {showPreview && (
          <div className="border-t border-[#1c2a35] p-4 bg-[#f8f9fa]">
            {selectedType === 'prisoner-card' && selectedPrisonerObj && (
              <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif', maxWidth: 400, background: '#0a0e14', border: '1px solid #1c2a35', borderLeft: `3px solid ${(selectedPrisonerObj.status || '').toLowerCase().includes('released') ? '#4afa82' : (selectedPrisonerObj.status || '').toLowerCase().includes('disappeared') ? '#fbbf24' : '#ef4444'}`, padding: 16, color: '#e2e8f0' }}>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Political Prisoner</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 4 }}>{selectedPrisonerObj.prisoner_name || selectedPrisonerObj.name}</div>
                <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>
                  <span style={{ color: (selectedPrisonerObj.status || '').toLowerCase().includes('released') ? '#4afa82' : (selectedPrisonerObj.status || '').toLowerCase().includes('disappeared') ? '#fbbf24' : '#ef4444' }}>● {selectedPrisonerObj.status}</span>
                  {selectedPrisonerObj.sentence && selectedPrisonerObj.sentence !== 'Unknown' && <span style={{ marginLeft: 12 }}>Sentence: {selectedPrisonerObj.sentence}</span>}
                </div>
                <span style={{ fontSize: 12, color: '#22d3ee' }}>Learn more at Resistance Hub →</span>
              </div>
            )}
            {selectedType === 'stats-badge' && (
              <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif', maxWidth: 500, background: '#0a0e14', border: '1px solid #1c2a35', padding: 16, color: '#e2e8f0' }}>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>CCP Human Rights Violations</div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min((stats || []).length, 4)}, 1fr)`, gap: 12 }}>
                  {(stats || []).slice(0, 4).map((s, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#4afa82' }}>{s.value?.toLocaleString?.() || s.value}</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <span style={{ display: 'inline-block', marginTop: 12, fontSize: 11, color: '#22d3ee' }}>Data: Global Anti-CCP Resistance Hub — CC BY 4.0</span>
              </div>
            )}
            {selectedType === 'alert-banner' && alerts[0] && (
              <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif', maxWidth: 600, background: alerts[0].type === 'critical' ? '#7f1d1d' : '#78350f', border: `1px solid ${alerts[0].type === 'critical' ? '#ef4444' : '#fbbf24'}`, padding: 16, color: '#e2e8f0' }}>
                <div style={{ fontSize: 11, color: alerts[0].type === 'critical' ? '#ef4444' : '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: 6 }}>
                  {alerts[0].type === 'critical' ? '🔴 CRITICAL ALERT' : '⚠️ ALERT'}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 6 }}>{alerts[0].title}</div>
                <div style={{ fontSize: 13, color: '#d1d5db', marginBottom: 12 }}>{alerts[0].summary}</div>
                <span style={{ display: 'inline-block', padding: '8px 16px', background: alerts[0].type === 'critical' ? '#ef4444' : '#fbbf24', color: '#0a0e14', fontWeight: 600, fontSize: 13 }}>Take Action →</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Code Output */}
      <div className="bg-[#0a0e14] border border-[#1c2a35]">
        <div className="flex items-center justify-between p-3 border-b border-[#1c2a35]">
          <span className="font-mono text-sm text-slate-400">HTML Code</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1 text-xs font-mono transition-colors hover:text-[#4afa82] text-slate-400"
            aria-label="Copy embed code to clipboard"
          >
            {copied ? (
              <>
                <CheckCircle className="w-3 h-3 text-[#4afa82]" />
                <span className="text-[#4afa82]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-300 whitespace-pre-wrap break-all max-h-64 overflow-y-auto">
          {embedCode}
        </pre>
      </div>

      {/* Attribution note */}
      <div className="flex items-start gap-2 text-xs text-slate-400 font-mono">
        <ExternalLink className="w-3 h-3 mt-0.5 flex-shrink-0" />
        <span>
          Embed widgets display static HTML with inline styles. No JavaScript required.
          Data is embedded at time of copy — update manually to refresh.
          Licensed under CC BY 4.0 — attribution link is included automatically.
        </span>
      </div>
    </div>
  );
}
