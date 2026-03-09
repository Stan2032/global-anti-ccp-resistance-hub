// @ts-nocheck


/**
 * SourceDiversityAnalyser — Evaluates source diversity across platform
 * datasets. Checks for over-reliance on single sources and flags
 * potential bias concentration.
 *
 * @module SourceDiversityAnalyzer
 */
import React, { useMemo, useState } from 'react';
import { Copy, Check, BarChart3, Shield, AlertTriangle, Globe } from 'lucide-react';
import { dataApi } from '../services/dataApi';

// Tier 1 (Gold) sources — major international outlets and human rights organisations
const TIER_1_DOMAINS = {
  'bbc.com': 'BBC',
  'bbc.co.uk': 'BBC',
  'reuters.com': 'Reuters',
  'apnews.com': 'Associated Press',
  'hrw.org': 'Human Rights Watch',
  'amnesty.org': 'Amnesty International',
  'cpj.org': 'Committee to Protect Journalists',
  'ohchr.org': 'UN OHCHR',
  'treasury.gov': 'US Treasury',
  'home.treasury.gov': 'US Treasury',
  'state.gov': 'US State Department',
  'gov.uk': 'UK Government',
  'legislation.gov.uk': 'UK Government',
  'consilium.europa.eu': 'EU Council',
  'canada.ca': 'Government of Canada',
  'foreignminister.gov.au': 'Government of Australia',
  'un.org': 'United Nations',
};

// Tier 2 (Reliable) sources
const TIER_2_DOMAINS = {
  'hongkongfp.com': 'Hong Kong Free Press',
  'rfa.org': 'Radio Free Asia',
  'nchrd.org': 'NCHRD',
  'safeguarddefenders.com': 'Safeguard Defenders',
  'theguardian.com': 'The Guardian',
  'nytimes.com': 'New York Times',
  'washingtonpost.com': 'Washington Post',
  'rsf.org': 'Reporters Without Borders',
  'frontlinedefenders.org': 'Front Line Defenders',
  'aspi.org.au': 'ASPI',
  'xjdp.aspi.org.au': 'ASPI Xinjiang',
  'cecc.gov': 'CECC',
  'scmp.com': 'South China Morning Post',
  'taipeitimes.com': 'Taipei Times',
  'taiwannews.com.tw': 'Taiwan News',
  'aljazeera.com': 'Al Jazeera',
  'abc.net.au': 'ABC Australia',
  'bnnbloomberg.ca': 'BNN Bloomberg',
  'congress.gov': 'US Congress',
  'legislation.gov.au': 'Australian Government',
};

function extractDomain(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    return hostname;
  } catch {
    // Malformed URLs (non-http strings, text source names) are expected — return null to skip
    return null;
  }
}

function classifySource(domain) {
  if (!domain) return 'unknown';
  for (const d of Object.keys(TIER_1_DOMAINS)) {
    if (domain === d || domain.endsWith('.' + d)) return 'tier1';
  }
  for (const d of Object.keys(TIER_2_DOMAINS)) {
    if (domain === d || domain.endsWith('.' + d)) return 'tier2';
  }
  return 'other';
}

function getSourceName(domain) {
  if (!domain) return 'Unknown';
  for (const [d, name] of Object.entries(TIER_1_DOMAINS)) {
    if (domain === d || domain.endsWith('.' + d)) return name;
  }
  for (const [d, name] of Object.entries(TIER_2_DOMAINS)) {
    if (domain === d || domain.endsWith('.' + d)) return name;
  }
  return domain;
}

export default function SourceDiversityAnalyzer() {
  const [copied, setCopied] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState('all');

  const analysis = useMemo(() => {
    const datasets = {
      'Political Prisoners': dataApi.getPoliticalPrisoners(),
      'Sanctions': dataApi.getSanctions(),
      'Sanctioned Officials': dataApi.getSanctionedOfficials(),
      'Timeline Events': dataApi.getTimelineEvents(),
      'Forced Labor': dataApi.getForcedLaborCompanies(),
      'Detention Facilities': dataApi.getDetentionFacilities(),
      'International Responses': dataApi.getInternationalResponses(),
      'Police Stations': dataApi.getPoliceStations(),
    };

    const allSources = {};
    const datasetBreakdowns = {};

    for (const [name, records] of Object.entries(datasets)) {
      const urls = [];
      const arr = Array.isArray(records) ? records : [];

      for (const record of arr) {
        if (record?.source_url) urls.push(record.source_url);
        if (record?.sources && Array.isArray(record.sources)) {
          for (const s of record.sources) {
            if (typeof s === 'string' && s.startsWith('http')) urls.push(s);
          }
        }
        if (record?.satellite_evidence && typeof record.satellite_evidence === 'string' && record.satellite_evidence.startsWith('http')) {
          urls.push(record.satellite_evidence);
        }
      }

      const domainCounts = {};
      const tierCounts = { tier1: 0, tier2: 0, other: 0, unknown: 0 };
      const uniqueDomains = new Set();

      for (const url of urls) {
        const domain = extractDomain(url);
        if (domain) {
          uniqueDomains.add(domain);
          domainCounts[domain] = (domainCounts[domain] || 0) + 1;
          const tier = classifySource(domain);
          tierCounts[tier]++;
        } else {
          tierCounts.unknown++;
        }
      }

      // Track globally
      for (const [domain, count] of Object.entries(domainCounts)) {
        allSources[domain] = (allSources[domain] || 0) + count;
      }

      const totalUrls = urls.length;
      const tier1Pct = totalUrls > 0 ? Math.round((tierCounts.tier1 / totalUrls) * 100) : 0;
      const tier2Pct = totalUrls > 0 ? Math.round((tierCounts.tier2 / totalUrls) * 100) : 0;
      const diversityScore = totalUrls > 0
        ? Math.min(100, Math.round((uniqueDomains.size / totalUrls) * 100))
        : 0;

      datasetBreakdowns[name] = {
        totalUrls,
        uniqueDomains: uniqueDomains.size,
        tierCounts,
        tier1Pct,
        tier2Pct,
        topSources: Object.entries(domainCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5),
        diversityScore,
      };
    }

    // Global stats
    const globalDomains = Object.keys(allSources);
    const totalReferences = Object.values(allSources).reduce((a, b) => a + b, 0);
    const topGlobal = Object.entries(allSources)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    let globalTier1 = 0;
    let globalTier2 = 0;
    let globalOther = 0;
    for (const [domain, count] of Object.entries(allSources)) {
      const tier = classifySource(domain);
      if (tier === 'tier1') globalTier1 += count;
      else if (tier === 'tier2') globalTier2 += count;
      else globalOther += count;
    }

    const concentrationRisks = topGlobal
      .filter(([, count]) => count / totalReferences > 0.25)
      .map(([domain, count]) => ({
        domain,
        name: getSourceName(domain),
        count,
        percentage: Math.round((count / totalReferences) * 100),
      }));

    return {
      datasets: datasetBreakdowns,
      global: {
        totalReferences,
        uniqueDomains: globalDomains.length,
        tier1: globalTier1,
        tier2: globalTier2,
        other: globalOther,
        tier1Pct: totalReferences > 0 ? Math.round((globalTier1 / totalReferences) * 100) : 0,
        tier2Pct: totalReferences > 0 ? Math.round((globalTier2 / totalReferences) * 100) : 0,
        topSources: topGlobal,
        concentrationRisks,
      },
    };
  }, []);

  const handleCopy = async () => {
    const lines = [
      'Source Diversity Analysis — Global Anti-CCP Resistance Hub',
      `Generated: ${new Date().toISOString().slice(0, 10)}`,
      '',
      `Total source references: ${analysis.global.totalReferences}`,
      `Unique domains: ${analysis.global.uniqueDomains}`,
      `Tier 1 (Gold): ${analysis.global.tier1Pct}%`,
      `Tier 2 (Reliable): ${analysis.global.tier2Pct}%`,
      '',
      'Top sources:',
      ...analysis.global.topSources.map(([domain, count]) =>
        `  ${getSourceName(domain)}: ${count} references`
      ),
      '',
      'Per-dataset breakdown:',
      ...Object.entries(analysis.datasets).map(([name, data]) =>
        `  ${name}: ${data.totalUrls} refs, ${data.uniqueDomains} unique, ${data.tier1Pct}% Tier 1`
      ),
      '',
      'License: CC BY 4.0 — Attribution required',
      'Data: https://github.com/Stan2032/global-anti-ccp-resistance-hub',
    ];

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  const currentData = selectedDataset === 'all'
    ? null
    : analysis.datasets[selectedDataset];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#111820] border border-[#1c2a35] border-l-4 border-l-[#22d3ee] p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-7 h-7 text-[#22d3ee]" />
            <div>
              <h2 className="text-2xl font-bold font-mono text-white">Source Diversity Analyzer</h2>
              <p className="text-slate-300 text-sm mt-1">
                Analyzes source quality and diversity across all datasets
              </p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-4 py-2 bg-[#0a0e14] border border-[#1c2a35] hover:border-[#4afa82] text-slate-300 hover:text-[#4afa82] font-mono text-sm transition-colors"
            aria-label="Copy analysis to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-[#4afa82]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : '$ copy_analysis'}</span>
          </button>
        </div>
      </div>

      {/* Global Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111820] border border-[#1c2a35] p-4">
          <div className="text-2xl font-bold text-white font-mono">{analysis.global.totalReferences}</div>
          <div className="text-slate-400 text-sm">Total References</div>
        </div>
        <div className="bg-[#111820] border border-[#1c2a35] p-4">
          <div className="text-2xl font-bold text-[#4afa82] font-mono">{analysis.global.uniqueDomains}</div>
          <div className="text-slate-400 text-sm">Unique Domains</div>
        </div>
        <div className="bg-[#111820] border border-[#1c2a35] p-4">
          <div className="text-2xl font-bold text-[#22d3ee] font-mono">{analysis.global.tier1Pct}%</div>
          <div className="text-slate-400 text-sm">Tier 1 (Gold)</div>
        </div>
        <div className="bg-[#111820] border border-[#1c2a35] p-4">
          <div className="text-2xl font-bold text-[#a78bfa] font-mono">{analysis.global.tier2Pct}%</div>
          <div className="text-slate-400 text-sm">Tier 2 (Reliable)</div>
        </div>
      </div>

      {/* Tier Distribution Bar */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h3 className="font-mono text-lg font-bold text-white mb-4">Source Tier Distribution</h3>
        <div className="flex h-6 overflow-hidden mb-3">
          {analysis.global.tier1Pct > 0 && (
            <div
              className="bg-[#22d3ee] flex items-center justify-center text-xs text-[#0a0e14] font-mono font-bold"
              style={{ width: `${analysis.global.tier1Pct}%` }}
              aria-label={`Tier 1: ${analysis.global.tier1Pct}%`}
            >
              {analysis.global.tier1Pct > 8 && `${analysis.global.tier1Pct}%`}
            </div>
          )}
          {analysis.global.tier2Pct > 0 && (
            <div
              className="bg-[#a78bfa] flex items-center justify-center text-xs text-[#0a0e14] font-mono font-bold"
              style={{ width: `${analysis.global.tier2Pct}%` }}
              aria-label={`Tier 2: ${analysis.global.tier2Pct}%`}
            >
              {analysis.global.tier2Pct > 8 && `${analysis.global.tier2Pct}%`}
            </div>
          )}
          {(100 - analysis.global.tier1Pct - analysis.global.tier2Pct) > 0 && (
            <div
              className="bg-slate-700 flex items-center justify-center text-xs text-slate-300 font-mono"
              style={{ width: `${100 - analysis.global.tier1Pct - analysis.global.tier2Pct}%` }}
              aria-label={`Other: ${100 - analysis.global.tier1Pct - analysis.global.tier2Pct}%`}
            >
              {(100 - analysis.global.tier1Pct - analysis.global.tier2Pct) > 8 && `${100 - analysis.global.tier1Pct - analysis.global.tier2Pct}%`}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-[#22d3ee] inline-block" aria-hidden="true" />
            <span className="text-slate-300">Tier 1 — {analysis.global.tier1} refs</span>
          </span>
          <span className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-[#a78bfa] inline-block" aria-hidden="true" />
            <span className="text-slate-300">Tier 2 — {analysis.global.tier2} refs</span>
          </span>
          <span className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-slate-700 inline-block" aria-hidden="true" />
            <span className="text-slate-300">Other — {analysis.global.other} refs</span>
          </span>
        </div>
      </div>

      {/* Concentration Risks */}
      {analysis.global.concentrationRisks.length > 0 && (
        <div className="bg-[#111820] border border-[#1c2a35] border-l-4 border-l-yellow-400 p-6">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h3 className="font-mono text-lg font-bold text-white">Source Concentration Alerts</h3>
          </div>
          <p className="text-slate-300 text-sm mb-3">
            Sources representing over 25% of all references may indicate over-reliance.
          </p>
          {analysis.global.concentrationRisks.map((risk) => (
            <div key={risk.domain} className="flex items-center space-x-3 text-sm text-slate-300">
              <AlertTriangle className="w-4 h-4 text-yellow-400" aria-hidden="true" />
              <span><strong className="text-white">{risk.name}</strong> — {risk.percentage}% of all references ({risk.count} refs)</span>
            </div>
          ))}
        </div>
      )}

      {/* Top Global Sources */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="w-5 h-5 text-[#4afa82]" />
          <h3 className="font-mono text-lg font-bold text-white">Top Sources (All Datasets)</h3>
        </div>
        <div className="space-y-2">
          {analysis.global.topSources.map(([domain, count]) => {
            const tier = classifySource(domain);
            const maxCount = analysis.global.topSources[0]?.[1] || 1;
            const widthPct = Math.max(5, Math.round((count / maxCount) * 100));
            return (
              <div key={domain} className="flex items-center space-x-3">
                <div className="w-40 md:w-48 flex-shrink-0 text-sm text-slate-300 truncate" title={getSourceName(domain)}>
                  {getSourceName(domain)}
                </div>
                <div className="flex-1 h-5 bg-[#0a0e14] overflow-hidden">
                  <div
                    className={`h-full ${tier === 'tier1' ? 'bg-[#22d3ee]' : tier === 'tier2' ? 'bg-[#a78bfa]' : 'bg-slate-600'}`}
                    style={{ width: `${widthPct}%` }}
                    aria-label={`${getSourceName(domain)}: ${count} references`}
                  />
                </div>
                <div className="w-10 text-right text-sm font-mono text-slate-300">{count}</div>
                <span className={`text-xs font-mono px-2 py-0.5 ${
                  tier === 'tier1' ? 'text-[#22d3ee] bg-[#22d3ee]/10' :
                  tier === 'tier2' ? 'text-[#a78bfa] bg-[#a78bfa]/10' :
                  'text-slate-400 bg-slate-700/50'
                }`}>
                  {tier === 'tier1' ? 'T1' : tier === 'tier2' ? 'T2' : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dataset Selector */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h3 className="font-mono text-lg font-bold text-white mb-4">Per-Dataset Breakdown</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedDataset('all')}
            className={`px-3 py-1.5 text-sm font-mono border transition-colors ${
              selectedDataset === 'all'
                ? 'border-[#4afa82] text-[#4afa82] bg-[#4afa82]/10'
                : 'border-[#1c2a35] text-slate-400 hover:border-slate-400'
            }`}
            aria-pressed={selectedDataset === 'all'}
          >
            All Datasets
          </button>
          {Object.keys(analysis.datasets).map((name) => (
            <button
              key={name}
              onClick={() => setSelectedDataset(name)}
              className={`px-3 py-1.5 text-sm font-mono border transition-colors ${
                selectedDataset === name
                  ? 'border-[#4afa82] text-[#4afa82] bg-[#4afa82]/10'
                  : 'border-[#1c2a35] text-slate-400 hover:border-slate-400'
              }`}
              aria-pressed={selectedDataset === name}
            >
              {name}
            </button>
          ))}
        </div>

        {selectedDataset === 'all' ? (
          /* All Datasets Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysis.datasets).map(([name, data]) => {
              const quality = data.tier1Pct + data.tier2Pct;
              const qualityLabel = quality >= 80 ? 'Excellent' : quality >= 60 ? 'Good' : quality >= 40 ? 'Fair' : 'Needs Review';
              const qualityColor = quality >= 80 ? 'text-[#4afa82]' : quality >= 60 ? 'text-[#22d3ee]' : quality >= 40 ? 'text-yellow-400' : 'text-red-400';
              return (
                <button
                  key={name}
                  onClick={() => setSelectedDataset(name)}
                  className="bg-[#0a0e14] border border-[#1c2a35] hover:border-slate-400 p-4 text-left transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-mono text-sm font-bold text-white">{name}</h4>
                    <span className={`text-xs font-mono ${qualityColor}`}>{qualityLabel}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{data.totalUrls} refs</span>
                    <span>{data.uniqueDomains} domains</span>
                    <span>{data.tier1Pct}% T1</span>
                  </div>
                  {/* Mini tier bar */}
                  <div className="flex h-2 mt-2 overflow-hidden">
                    <div className="bg-[#22d3ee]" style={{ width: `${data.tier1Pct}%` }} />
                    <div className="bg-[#a78bfa]" style={{ width: `${data.tier2Pct}%` }} />
                    <div className="bg-slate-700 flex-1" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : currentData && (
          /* Single Dataset Detail */
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0a0e14] border border-[#1c2a35] p-3 text-center">
                <div className="text-lg font-bold text-white font-mono">{currentData.totalUrls}</div>
                <div className="text-slate-400 text-xs">References</div>
              </div>
              <div className="bg-[#0a0e14] border border-[#1c2a35] p-3 text-center">
                <div className="text-lg font-bold text-[#4afa82] font-mono">{currentData.uniqueDomains}</div>
                <div className="text-slate-400 text-xs">Unique Domains</div>
              </div>
              <div className="bg-[#0a0e14] border border-[#1c2a35] p-3 text-center">
                <div className="text-lg font-bold text-[#22d3ee] font-mono">{currentData.diversityScore}%</div>
                <div className="text-slate-400 text-xs">Diversity Score</div>
              </div>
            </div>

            {/* Tier breakdown */}
            <div>
              <h4 className="font-mono text-sm text-white mb-2">Tier Breakdown</h4>
              <div className="flex h-4 overflow-hidden mb-2">
                <div className="bg-[#22d3ee]" style={{ width: `${currentData.tier1Pct}%` }} />
                <div className="bg-[#a78bfa]" style={{ width: `${currentData.tier2Pct}%` }} />
                <div className="bg-slate-700 flex-1" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                <span>Tier 1: {currentData.tierCounts.tier1} ({currentData.tier1Pct}%)</span>
                <span>Tier 2: {currentData.tierCounts.tier2} ({currentData.tier2Pct}%)</span>
                <span>Other: {currentData.tierCounts.other}</span>
              </div>
            </div>

            {/* Top sources for this dataset */}
            {currentData.topSources.length > 0 && (
              <div>
                <h4 className="font-mono text-sm text-white mb-2">Top Sources</h4>
                <div className="space-y-1">
                  {currentData.topSources.map(([domain, count]) => {
                    const tier = classifySource(domain);
                    return (
                      <div key={domain} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{getSourceName(domain)}</span>
                        <span className="flex items-center space-x-2">
                          <span className="font-mono text-slate-400">{count}</span>
                          <span className={`text-xs font-mono px-1.5 ${
                            tier === 'tier1' ? 'text-[#22d3ee]' :
                            tier === 'tier2' ? 'text-[#a78bfa]' :
                            'text-slate-400'
                          }`}>
                            {tier === 'tier1' ? 'T1' : tier === 'tier2' ? 'T2' : '—'}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Source Quality Assessment */}
      <div className="bg-[#111820] border border-[#1c2a35] border-l-4 border-l-[#4afa82] p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Shield className="w-5 h-5 text-[#4afa82]" />
          <h3 className="font-mono text-lg font-bold text-white">Source Quality Assessment</h3>
        </div>
        <div className="space-y-2 text-sm text-slate-300">
          <p>
            <strong className="text-white">Tier 1 (Gold)</strong> sources include BBC, Reuters, AP, Human Rights Watch,
            Amnesty International, CPJ, UN OHCHR, and government records (US Treasury, UK FCDO, EU Council, Canada, Australia).
          </p>
          <p>
            <strong className="text-white">Tier 2 (Reliable)</strong> sources include Hong Kong Free Press, Radio Free Asia,
            Safeguard Defenders, The Guardian, NYT, Washington Post, and ASPI.
          </p>
          <p className="text-slate-400">
            CCP state media (Xinhua, CGTN, People&apos;s Daily, Global Times) is never cited as a source.
            All data undergoes verification against multiple independent sources.
          </p>
        </div>
      </div>
    </div>
  );
}
