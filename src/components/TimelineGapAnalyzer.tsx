// @ts-nocheck


/**
 * TimelineGapAnalyzer — Identifies temporal gaps in the historical
 * timeline data. Highlights periods with sparse documentation for
 * research prioritisation.
 *
 * @module TimelineGapAnalyzer
 */
import { useState, useMemo } from 'react';
import { Calendar, AlertCircle, TrendingUp, Search, Copy, CheckCircle } from 'lucide-react';
import dataApi from '../services/dataApi';

export default function TimelineGapAnalyzer() {
  const [selectedDecade, setSelectedDecade] = useState(null);
  const [copied, setCopied] = useState(false);

  const events = dataApi.getTimelineEvents();

  // Analyze timeline coverage
  const analysis = useMemo(() => {
    if (!events.length) return null;

    const years = events.map((e) => parseInt(e.date.substring(0, 4)));
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    // Identify gaps (years with no events)
    const yearsWithEvents = new Set(years);
    const gaps = [];
    for (let year = minYear; year <= maxYear; year++) {
      if (!yearsWithEvents.has(year)) {
        gaps.push(year);
      }
    }

    // Group consecutive gaps into ranges
    const gapRanges = [];
    let currentRange = null;
    for (const year of gaps) {
      if (!currentRange) {
        currentRange = { start: year, end: year };
      } else if (year === currentRange.end + 1) {
        currentRange.end = year;
      } else {
        gapRanges.push(currentRange);
        currentRange = { start: year, end: year };
      }
    }
    if (currentRange) gapRanges.push(currentRange);

    // Decade breakdown
    const decades = {};
    events.forEach((e) => {
      const year = parseInt(e.date.substring(0, 4));
      const decade = Math.floor(year / 10) * 10;
      if (!decades[decade]) {
        decades[decade] = {
          total: 0,
          critical: 0,
          high: 0,
          medium: 0,
          categories: {},
        };
      }
      decades[decade].total++;
      const sig = e.significance?.toLowerCase() || 'medium';
      if (sig === 'critical') decades[decade].critical++;
      else if (sig === 'high') decades[decade].high++;
      else decades[decade].medium++;

      const cat = e.category || 'other';
      decades[decade].categories[cat] = (decades[decade].categories[cat] || 0) + 1;
    });

    // Category totals
    const categoryTotals = {};
    events.forEach((e) => {
      const cat = e.category || 'other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + 1;
    });

    return {
      totalEvents: events.length,
      yearRange: `${minYear}-${maxYear}`,
      totalYears: maxYear - minYear + 1,
      yearsWithEvents: yearsWithEvents.size,
      gapYears: gaps.length,
      gapRanges,
      decades,
      categoryTotals,
      minYear,
      maxYear,
    };
  }, [events]);

  const copyAnalysis = () => {
    if (!analysis) return;

    const text = `Timeline Coverage Analysis — Global Anti-CCP Resistance Hub

OVERVIEW
• Total Events: ${analysis.totalEvents}
• Year Range: ${analysis.yearRange} (${analysis.totalYears} years)
• Years with Events: ${analysis.yearsWithEvents}
• Gap Years: ${analysis.gapYears}

MAJOR GAPS (2+ consecutive years)
${analysis.gapRanges
  .filter((r) => r.end - r.start >= 1)
  .map((r) => `• ${r.start}-${r.end} (${r.end - r.start + 1} years)`)
  .join('\n') || '• None'}

DECADE BREAKDOWN
${Object.entries(analysis.decades)
  .sort(([a], [b]) => parseInt(a) - parseInt(b))
  .map(
    ([decade, data]) =>
      `${decade}s: ${data.total} events (${data.critical} critical, ${data.high} high, ${data.medium} medium)`
  )
  .join('\n')}

CATEGORY COVERAGE
${Object.entries(analysis.categoryTotals)
  .sort(([, a], [, b]) => b - a)
  .map(([cat, count]) => `• ${cat}: ${count} events`)
  .join('\n')}

Generated: ${new Date().toISOString().split('T')[0]}
Source: https://global-anti-ccp-resistance-hub.stane203.workers.dev/
License: CC BY 4.0`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!analysis) {
    return (
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <p className="text-slate-400">No timeline data available.</p>
      </div>
    );
  }

  const decadeKeys = Object.keys(analysis.decades)
    .map((d) => parseInt(d))
    .sort((a, b) => a - b);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="font-mono text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Search className="w-6 h-6 text-[#4afa82]" />
              Timeline Gap Analyzer
            </h2>
            <p className="text-slate-300">
              Identify periods in CCP human rights history needing more research coverage
            </p>
          </div>
          <button
            onClick={copyAnalysis}
            className="flex items-center gap-2 px-4 py-2 bg-[#0a0e14] border border-[#1c2a35] hover:border-[#4afa82] text-slate-300 hover:text-[#4afa82] transition-colors"
            aria-label="Copy analysis to clipboard"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-sm">Copy Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-[#0a0e14] border border-[#1c2a35] p-4">
            <div className="text-sm text-slate-400 mb-1">Total Events</div>
            <div className="font-mono text-2xl text-white">{analysis.totalEvents}</div>
          </div>
          <div className="bg-[#0a0e14] border border-[#1c2a35] p-4">
            <div className="text-sm text-slate-400 mb-1">Year Range</div>
            <div className="font-mono text-2xl text-white">{analysis.yearRange}</div>
          </div>
          <div className="bg-[#0a0e14] border border-[#1c2a35] p-4">
            <div className="text-sm text-slate-400 mb-1">Coverage</div>
            <div className="font-mono text-2xl text-white">
              {Math.round((analysis.yearsWithEvents / analysis.totalYears) * 100)}%
            </div>
          </div>
          <div className="bg-[#0a0e14] border border-[#1c2a35] p-4">
            <div className="text-sm text-slate-400 mb-1">Gap Years</div>
            <div className="font-mono text-2xl text-[#fbbf24]">{analysis.gapYears}</div>
          </div>
        </div>
      </div>

      {/* Major Gaps */}
      {analysis.gapRanges.filter((r) => r.end - r.start >= 1).length > 0 && (
        <div className="bg-[#111820] border border-[#1c2a35] p-6">
          <h3 className="font-mono text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#fbbf24]" />
            Major Gaps (2+ consecutive years)
          </h3>
          <div className="space-y-3">
            {analysis.gapRanges
              .filter((r) => r.end - r.start >= 1)
              .map((range, idx) => (
                <div
                  key={idx}
                  className="bg-[#0a0e14] border border-[#1c2a35] border-l-4 border-l-[#fbbf24] p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-lg text-white">
                        {range.start} – {range.end}
                      </div>
                      <div className="text-sm text-slate-400">
                        {range.end - range.start + 1} years with no documented events
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-[#fbbf24]/10 border border-[#fbbf24]/30 text-[#fbbf24] text-sm font-mono">
                      RESEARCH NEEDED
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Decade Breakdown */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h3 className="font-mono text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#4afa82]" />
          Event Density by Decade
        </h3>
        <div className="space-y-4">
          {decadeKeys.map((decade) => {
            const data = analysis.decades[decade];
            const maxEvents = Math.max(...Object.values(analysis.decades).map((d) => d.total));
            const barWidth = (data.total / maxEvents) * 100;
            const isSelected = selectedDecade === decade;

            return (
              <div key={decade}>
                <button
                  onClick={() => setSelectedDecade(isSelected ? null : decade)}
                  className="w-full text-left"
                  aria-expanded={isSelected}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-mono text-white">{decade}s</div>
                    <div className="text-sm text-slate-400">
                      {data.total} events ({data.critical} critical, {data.high} high)
                    </div>
                  </div>
                  <div className="h-8 bg-[#0a0e14] border border-[#1c2a35] relative overflow-hidden">
                    <div
                      className="h-full bg-[#4afa82]/20 border-r-2 border-r-[#4afa82] transition-all"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </button>

                {isSelected && (
                  <div className="mt-3 p-4 bg-[#0a0e14] border border-[#1c2a35] space-y-2">
                    <div className="text-sm text-slate-300 font-semibold">Category Breakdown:</div>
                    {Object.entries(data.categories)
                      .sort(([, a], [, b]) => b - a)
                      .map(([cat, count]) => (
                        <div key={cat} className="flex items-center justify-between text-sm">
                          <span className="text-slate-400 capitalize">{cat}</span>
                          <span className="text-white font-mono">{count}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Coverage */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h3 className="font-mono text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#22d3ee]" />
          Coverage by Category
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(analysis.categoryTotals)
            .sort(([, a], [, b]) => b - a)
            .map(([category, count]) => {
              const percentage = ((count / analysis.totalEvents) * 100).toFixed(1);
              return (
                <div key={category} className="bg-[#0a0e14] border border-[#1c2a35] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white capitalize font-medium">{category}</div>
                    <div className="text-slate-400 text-sm font-mono">{count} events</div>
                  </div>
                  <div className="h-2 bg-[#111820] border border-[#1c2a35] relative overflow-hidden">
                    <div
                      className="h-full bg-[#22d3ee]/40"
                      style={{ width: `${percentage}%` }}
                      aria-label={`${percentage}% coverage`}
                    />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{percentage}% of total</div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Research Priorities */}
      <div className="bg-[#111820] border border-[#1c2a35] border-l-4 border-l-[#4afa82] p-6">
        <h3 className="font-mono text-xl font-bold text-white mb-3">Research Priorities</h3>
        <div className="space-y-2 text-slate-300">
          <p className="text-sm">
            Based on this analysis, consider investigating the following areas:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm ml-2">
            {analysis.gapRanges.filter((r) => r.end - r.start >= 1).length > 0 && (
              <li>Document events during identified multi-year gaps</li>
            )}
            {Object.entries(analysis.categoryTotals).find(([, count]) => count < 5) && (
              <li>Expand coverage in underrepresented categories</li>
            )}
            {Object.values(analysis.decades).some((d) => d.total < 3) && (
              <li>Add events to decades with fewer than 3 documented incidents</li>
            )}
            <li>Verify all existing events have Tier 1-2 sources</li>
            <li>Cross-reference with international human rights reports</li>
          </ul>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-sm text-slate-400 text-center">
        Analysis based on {analysis.totalEvents} documented events from {analysis.yearRange}.
        <br />
        This tool helps identify research gaps — not all years will have major documented events.
      </div>
    </div>
  );
}
