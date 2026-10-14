/**
 * QuickFacts — Shareable statistics cards with verified data points.
 *
 * Displays key human-rights statistics in a card grid. Each card
 * includes a source link, copy-to-clipboard action, and category colour.
 *
 * @module QuickFacts
 */
import React, { useState } from 'react';
import { BarChart3, Megaphone } from 'lucide-react';
import { logger } from '../utils/logger';
import { useBrowserValue } from '../utils/ssr';
import { SITE_URL } from '../utils/site';

/**
 * QuickFacts — Shareable statistics cards with verified data points.
 * Each fact includes a source link, copy-to-clipboard, and category color.
 *
 * @returns {React.ReactElement} Grid of fact cards
 */
const QuickFacts = () => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  // Copying needs JavaScript, so the button appears only once it runs.
  const scripted = useBrowserValue(() => true, false);

  const facts = [
    {
      id: 1,
      category: 'Political Prisoners',
      stat: '1,000+',
      description: 'Political prisoners currently detained in China',
      source: 'Dui Hua Foundation',
      sourceUrl: 'https://duihua.org/',
      color: 'red'
    },
    {
      id: 2,
      category: 'Overseas Police Stations',
      stat: '102+',
      description: 'CCP police stations operating in 53 countries',
      source: 'Safeguard Defenders',
      sourceUrl: 'https://safeguarddefenders.com/',
      color: 'orange'
    },
    {
      id: 3,
      category: 'Uyghur Detention',
      stat: '1-3 Million',
      description: 'Uyghurs detained in "re-education" camps',
      source: 'Multiple sources including ASPI',
      sourceUrl: 'https://www.aspi.org.au/',
      color: 'cyan'
    },
    {
      id: 4,
      category: 'Hong Kong',
      stat: '260+',
      description: 'Political prisoners under National Security Law',
      source: 'Hong Kong Watch',
      sourceUrl: 'https://www.hongkongwatch.org/',
      color: 'yellow'
    },
    {
      id: 5,
      category: 'Forced Labor',
      stat: '83',
      description: 'Global brands linked to Uyghur forced labor',
      source: 'ASPI Uyghurs for Sale Report',
      sourceUrl: 'https://www.aspi.org.au/report/uyghurs-sale',
      color: 'blue'
    },
    {
      id: 6,
      category: 'Tibet',
      stat: '29 Years',
      description: 'Gedhun Choekyi Nyima (Panchen Lama) held since age 6',
      source: 'International Campaign for Tibet',
      sourceUrl: 'https://savetibet.org/',
      color: 'green'
    },
    {
      id: 7,
      category: 'Transnational Repression',
      stat: '230,000+',
      description: 'People "persuaded" to return to China (2021-2023)',
      source: 'Safeguard Defenders',
      sourceUrl: 'https://safeguarddefenders.com/',
      color: 'cyan'
    },
    {
      id: 8,
      category: 'Press Freedom',
      stat: '#179',
      description: 'China\'s ranking out of 180 countries',
      source: 'Reporters Without Borders',
      sourceUrl: 'https://rsf.org/',
      color: 'pink'
    }
  ];

  const colorClasses: Record<string, string> = {
    red: 'border-l-red-500 border-[#1c2a35]',
    orange: 'border-l-orange-500 border-[#1c2a35]',
    cyan: 'border-l-[#22d3ee] border-[#1c2a35]',
    yellow: 'border-l-yellow-500 border-[#1c2a35]',
    blue: 'border-l-[#22d3ee] border-[#1c2a35]',
    green: 'border-l-green-500 border-[#1c2a35]',
    pink: 'border-l-[#22d3ee] border-[#1c2a35]'
  };

  const copyToClipboard = async (fact: { id: number; category: string; stat: string; description: string; source: string; sourceUrl: string; color: string }) => {
    const text = `📊 ${fact.category}: ${fact.stat}\n\n${fact.description}\n\nSource: ${fact.source}\n${fact.sourceUrl}\n\nLearn more: ${SITE_URL}/`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(fact.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      logger.warn('clipboard', 'Failed to copy:', err);
    }
  };

  // A plain link, so sharing works without JavaScript too.
  const tweetUrl = (fact: { category: string; stat: string; description: string; source: string }) => {
    const text = `📊 ${fact.category}: ${fact.stat}\n\n${fact.description}\n\nSource: ${fact.source}`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(`${SITE_URL}/`)}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#111820] p-6 border border-[#1c2a35]">
        <div className="flex items-center mb-4">
          <BarChart3 className="w-8 h-8 text-slate-300" />
          <div>
            <h2 className="text-2xl font-bold text-white">Quick Facts</h2>
            <p className="text-slate-400">Shareable statistics to spread awareness</p>
          </div>
        </div>
        <p className="text-sm text-slate-400">
          Share a fact from its card. All statistics are sourced from reputable human rights organizations.
        </p>
      </div>

      {/* Facts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {facts.map(fact => (
          <div
            key={fact.id}
            className={`bg-[#0a0e14] border-l-2 ${colorClasses[fact.color]} p-5 border`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                {fact.category}
              </span>
              {scripted && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(fact)}
                  aria-label={`Copy fact: ${fact.category}, ${fact.stat}`}
                  className={`text-xs transition-colors ${copiedId === fact.id ? 'text-green-400' : 'text-slate-400 hover:text-white'}`}
                >
                  {copiedId === fact.id ? '✓ Copied!' : 'Copy'}
                </button>
              )}
            </div>
            
            <div className="text-3xl font-bold text-white mb-2">{fact.stat}</div>
            <p className="text-sm text-slate-300 mb-3">{fact.description}</p>
            
            <div className="flex items-center justify-between pt-3 border-t border-[#1c2a35]/50">
              <a 
                href={fact.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Source: {fact.source} →
              </a>
              <a
                href={tweetUrl(fact)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded bg-[#111820] hover:bg-[#1c2a35] transition-colors"
                title="Share on Twitter"
                aria-label={`Share on Twitter: ${fact.category}`}
              >
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Tips */}
      <div className="bg-[#111820]/50 p-6 border border-[#1c2a35]">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Megaphone className="w-5 h-5" /> How to Use These Facts</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-slate-300">Social Media</h4>
            <p className="text-slate-400">Share on Twitter, Facebook, or Instagram to raise awareness.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-slate-300">Presentations</h4>
            <p className="text-slate-400">Include these statistics in presentations to lawmakers, journalists, or community groups.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-slate-300">Letters & Emails</h4>
            <p className="text-slate-400">Reference these facts when writing to elected officials or media outlets.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickFacts;
