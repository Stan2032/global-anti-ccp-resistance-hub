import React, { useState } from 'react';

const QuickFacts = () => {
  const [copiedId, setCopiedId] = useState(null);

  const facts = [
    {
      id: 1,
      category: 'Political Prisoners',
      stat: '1,000+',
      description: 'Political prisoners currently detained in China',
      source: 'Dui Hua Foundation',
      sourceUrl: 'https://duihua.org/',
      hashtags: '#FreePoliticalPrisoners #HumanRights',
      color: 'red'
    },
    {
      id: 2,
      category: 'Overseas Police Stations',
      stat: '102+',
      description: 'CCP police stations operating in 53 countries',
      source: 'Safeguard Defenders',
      sourceUrl: 'https://safeguarddefenders.com/',
      hashtags: '#CCPPoliceStations #TransnationalRepression',
      color: 'orange'
    },
    {
      id: 3,
      category: 'Uyghur Detention',
      stat: '1-3 Million',
      description: 'Uyghurs detained in "re-education" camps',
      source: 'Multiple sources including ASPI',
      sourceUrl: 'https://www.aspi.org.au/',
      hashtags: '#UyghurGenocide #FreeUyghurs',
      color: 'purple'
    },
    {
      id: 4,
      category: 'Hong Kong',
      stat: '260+',
      description: 'Political prisoners under National Security Law',
      source: 'Hong Kong Watch',
      sourceUrl: 'https://www.hongkongwatch.org/',
      hashtags: '#FreeHongKong #StandWithHongKong',
      color: 'yellow'
    },
    {
      id: 5,
      category: 'Forced Labor',
      stat: '83',
      description: 'Global brands linked to Uyghur forced labor',
      source: 'ASPI Uyghurs for Sale Report',
      sourceUrl: 'https://www.aspi.org.au/report/uyghurs-sale',
      hashtags: '#EndForcedLabor #BoycottCCP',
      color: 'blue'
    },
    {
      id: 6,
      category: 'Tibet',
      stat: '29 Years',
      description: 'Gedhun Choekyi Nyima (Panchen Lama) held since age 6',
      source: 'International Campaign for Tibet',
      sourceUrl: 'https://savetibet.org/',
      hashtags: '#FreeTibet #PanchenLama',
      color: 'green'
    },
    {
      id: 7,
      category: 'Transnational Repression',
      stat: '230,000+',
      description: 'People "persuaded" to return to China (2021-2023)',
      source: 'Safeguard Defenders',
      sourceUrl: 'https://safeguarddefenders.com/',
      hashtags: '#TransnationalRepression #CCPAbroad',
      color: 'cyan'
    },
    {
      id: 8,
      category: 'Press Freedom',
      stat: '#179',
      description: 'China\'s ranking out of 180 countries',
      source: 'Reporters Without Borders',
      sourceUrl: 'https://rsf.org/',
      hashtags: '#PressFreedom #FreeSpeech',
      color: 'pink'
    }
  ];

  const colorClasses = {
    red: 'from-red-900/50 to-red-800/30 border-red-700/50',
    orange: 'from-orange-900/50 to-orange-800/30 border-orange-700/50',
    purple: 'from-purple-900/50 to-purple-800/30 border-purple-700/50',
    yellow: 'from-yellow-900/50 to-yellow-800/30 border-yellow-700/50',
    blue: 'from-blue-900/50 to-blue-800/30 border-blue-700/50',
    green: 'from-green-900/50 to-green-800/30 border-green-700/50',
    cyan: 'from-cyan-900/50 to-cyan-800/30 border-cyan-700/50',
    pink: 'from-pink-900/50 to-pink-800/30 border-pink-700/50'
  };

  const copyToClipboard = async (fact) => {
    const text = `📊 ${fact.category}: ${fact.stat}\n\n${fact.description}\n\nSource: ${fact.source}\n${fact.sourceUrl}\n\n${fact.hashtags}\n\nLearn more: https://stan2032.github.io/global-anti-ccp-resistance-hub/`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(fact.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToTwitter = (fact) => {
    const text = `📊 ${fact.category}: ${fact.stat}\n\n${fact.description}\n\nSource: ${fact.source}\n\n${fact.hashtags}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://stan2032.github.io/global-anti-ccp-resistance-hub/')}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">📊</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Quick Facts</h2>
            <p className="text-slate-400">Shareable statistics to spread awareness</p>
          </div>
        </div>
        <p className="text-sm text-slate-400">
          Click any fact card to copy it for sharing on social media. All statistics are sourced from reputable human rights organizations.
        </p>
      </div>

      {/* Facts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {facts.map(fact => (
          <div
            key={fact.id}
            className={`bg-gradient-to-br ${colorClasses[fact.color]} rounded-xl p-5 border transition-transform hover:scale-[1.02] cursor-pointer`}
            onClick={() => copyToClipboard(fact)}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                {fact.category}
              </span>
              {copiedId === fact.id ? (
                <span className="text-green-400 text-xs flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Copied!
                </span>
              ) : (
                <span className="text-slate-500 text-xs">Click to copy</span>
              )}
            </div>
            
            <div className="text-3xl font-bold text-white mb-2">{fact.stat}</div>
            <p className="text-sm text-slate-300 mb-3">{fact.description}</p>
            
            <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
              <a 
                href={fact.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Source: {fact.source} →
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  shareToTwitter(fact);
                }}
                className="p-1.5 rounded bg-slate-700/50 hover:bg-slate-600 transition-colors"
                title="Share on Twitter"
              >
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Tips */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4">📢 How to Use These Facts</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-slate-300">Social Media</h4>
            <p className="text-slate-400">Share on Twitter, Facebook, or Instagram to raise awareness. Use the included hashtags for visibility.</p>
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
