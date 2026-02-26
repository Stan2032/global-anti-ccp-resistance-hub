import React, { useState } from 'react';
import {
  ClipboardList, Building2, Mountain, Bug, Globe, Siren, Lightbulb, BookOpen, PenSquare,
} from 'lucide-react';
import { STATISTICS } from '../data/statistics';

const DisinfoTracker = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', Icon: ClipboardList },
    { id: 'uyghur', name: 'Uyghur', Icon: Building2 },
    { id: 'hongkong', name: 'Hong Kong', icon: '🇭🇰' },
    { id: 'tibet', name: 'Tibet', Icon: Mountain },
    { id: 'taiwan', name: 'Taiwan', icon: '🇹🇼' },
    { id: 'covid', name: 'COVID-19', Icon: Bug },
    { id: 'general', name: 'General', Icon: Globe },
  ];

  const disinfoAlerts = [
    {
      id: 1,
      claim: '"Vocational training centers" in Xinjiang are voluntary education programs',
      reality: `These are forced detention camps holding ${STATISTICS.uyghurDetention.value} Uyghurs. Leaked documents (China Cables, Xinjiang Police Files) prove forced detention, torture, and political indoctrination.`,
      category: 'uyghur',
      source: 'CCP State Media',
      debunkedBy: ['Xinjiang Police Files', 'China Cables', 'Uyghur Tribunal'],
      severity: 'critical',
      dateSpotted: '2024-12',
      spreadLevel: 'widespread',
    },
    {
      id: 2,
      claim: 'Hong Kong protesters are violent terrorists funded by foreign forces',
      reality: 'The 2019 protests were overwhelmingly peaceful, with 2 million marching on June 16. Police violence was documented by international observers. No evidence of foreign funding.',
      category: 'hongkong',
      source: 'CCP State Media, CGTN',
      debunkedBy: ['Amnesty International', 'Human Rights Watch', 'HKFP'],
      severity: 'high',
      dateSpotted: '2024-11',
      spreadLevel: 'moderate',
    },
    {
      id: 3,
      claim: 'Taiwan has always been part of China',
      reality: 'Taiwan has never been ruled by the PRC. It has been self-governed since 1949 with its own constitution, military, currency, and democratic elections.',
      category: 'taiwan',
      source: 'CCP Officials',
      debunkedBy: ['Historical records', 'International law experts'],
      severity: 'high',
      dateSpotted: '2024-12',
      spreadLevel: 'widespread',
    },
    {
      id: 4,
      claim: 'Tibet was peacefully liberated in 1950',
      reality: 'China invaded Tibet militarily in 1950. The Dalai Lama fled in 1959 after a failed uprising. Over 1.2 million Tibetans died, and 6,000+ monasteries were destroyed.',
      category: 'tibet',
      source: 'CCP State Media',
      debunkedBy: ['International Commission of Jurists', 'Tibet Justice Center'],
      severity: 'high',
      dateSpotted: '2024-10',
      spreadLevel: 'moderate',
    },
    {
      id: 5,
      claim: 'COVID-19 originated from a US military lab',
      reality: 'No credible evidence supports this claim. The virus was first detected in Wuhan, China. WHO investigation found no evidence of US origin.',
      category: 'covid',
      source: 'Chinese Foreign Ministry Spokesman',
      debunkedBy: ['WHO', 'Scientific consensus', 'Multiple investigations'],
      severity: 'high',
      dateSpotted: '2024-09',
      spreadLevel: 'moderate',
    },
    {
      id: 6,
      claim: 'Overseas Chinese police stations are just service centers for license renewals',
      reality: 'Safeguard Defenders documented these stations conducting surveillance, harassment, and coerced returns. Multiple countries have shut them down as illegal.',
      category: 'general',
      source: 'Chinese Embassy Statements',
      debunkedBy: ['Safeguard Defenders', 'FBI', 'RCMP', 'Dutch Government'],
      severity: 'critical',
      dateSpotted: '2024-11',
      spreadLevel: 'moderate',
    },
    {
      id: 7,
      claim: 'Jimmy Lai is a criminal who endangered national security',
      reality: 'Jimmy Lai is a journalist who published factual news. His "crimes" include publishing articles and meeting with foreign officials - normal journalism activities.',
      category: 'hongkong',
      source: 'Hong Kong Government, CGTN',
      debunkedBy: ['RSF', 'CPJ', 'US State Dept', 'UK Foreign Office'],
      severity: 'critical',
      dateSpotted: '2024-12',
      spreadLevel: 'widespread',
    },
    {
      id: 8,
      claim: 'Uyghur birth rate decline is due to voluntary family planning',
      reality: 'Leaked documents prove forced sterilizations and IUD insertions. Birth rates dropped 84% in Uyghur regions while rising in Han areas. This meets the UN definition of genocide.',
      category: 'uyghur',
      source: 'CCP White Papers',
      debunkedBy: ['AP Investigation', 'Newlines Institute', 'Uyghur Tribunal'],
      severity: 'critical',
      dateSpotted: '2024-10',
      spreadLevel: 'moderate',
    },
    {
      id: 9,
      claim: 'The Dalai Lama is a separatist and slave owner',
      reality: 'The Dalai Lama advocates for autonomy, not independence. He has condemned violence and won the Nobel Peace Prize. Claims about slavery are CCP propaganda.',
      category: 'tibet',
      source: 'CCP State Media',
      debunkedBy: ['Nobel Committee', 'Tibet scholars', 'Historical records'],
      severity: 'medium',
      dateSpotted: '2024-08',
      spreadLevel: 'moderate',
    },
    {
      id: 10,
      claim: 'Western media reports on China are biased and anti-China',
      reality: 'Reports are based on leaked documents, satellite imagery, survivor testimonies, and official Chinese sources. Multiple independent investigations reached similar conclusions.',
      category: 'general',
      source: 'CCP Officials, Wolf Warriors',
      debunkedBy: ['Press freedom organizations', 'Academic research'],
      severity: 'medium',
      dateSpotted: '2024-12',
      spreadLevel: 'widespread',
    },
  ];

  const severityColors = {
    critical: 'bg-red-900/30 border-red-700/50',
    high: 'bg-orange-900/30 border-orange-700/50',
    medium: 'bg-yellow-900/30 border-yellow-700/50',
  };

  const severityBadges = {
    critical: 'bg-red-900/50 text-red-400',
    high: 'bg-orange-900/50 text-orange-400',
    medium: 'bg-yellow-900/50 text-yellow-400',
  };

  const filteredAlerts = disinfoAlerts.filter(alert => 
    activeCategory === 'all' || alert.category === activeCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-red-500 p-6">
        <div className="flex items-center mb-4">
          <Siren className="w-8 h-8 mr-3 text-red-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Disinformation Tracker</h2>
            <p className="text-slate-400">Identify and counter CCP propaganda</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          The CCP spends billions on propaganda and disinformation. This tracker documents common 
          false claims, provides factual rebuttals, and links to credible sources.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4 text-center">
          <div className="text-2xl font-bold text-white">{disinfoAlerts.length}</div>
          <div className="text-xs text-slate-400">Claims Tracked</div>
        </div>
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4 text-center">
          <div className="text-2xl font-bold text-red-400">
            {disinfoAlerts.filter(a => a.severity === 'critical').length}
          </div>
          <div className="text-xs text-slate-400">Critical Alerts</div>
        </div>
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">
            {disinfoAlerts.filter(a => a.spreadLevel === 'widespread').length}
          </div>
          <div className="text-xs text-slate-400">Widespread</div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-red-600 text-white'
                : 'bg-[#111820] text-slate-300 hover:bg-[#111820]'
            }`}
          >
            <span>{cat.Icon ? <cat.Icon className="w-4 h-4" /> : cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map(alert => (
          <div 
            key={alert.id}
            className={`border p-5 ${severityColors[alert.severity]}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-0.5 rounded ${severityBadges[alert.severity]}`}>
                  {alert.severity.toUpperCase()}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#111820] text-slate-400">
                  {alert.spreadLevel}
                </span>
              </div>
              <span className="text-xs text-slate-500">{alert.dateSpotted}</span>
            </div>

            {/* False Claim */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-red-400">❌</span>
                <span className="text-xs font-medium text-red-400 uppercase">False Claim</span>
              </div>
              <p className="text-white font-medium italic">"{alert.claim}"</p>
              <p className="text-xs text-slate-500 mt-1">Source: {alert.source}</p>
            </div>

            {/* Reality */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-green-400">✓</span>
                <span className="text-xs font-medium text-green-400 uppercase">Reality</span>
              </div>
              <p className="text-slate-300">{alert.reality}</p>
            </div>

            {/* Debunked By */}
            <div>
              <div className="text-xs text-slate-500 mb-2">Debunked by:</div>
              <div className="flex flex-wrap gap-2">
                {alert.debunkedBy.map((source, idx) => (
                  <span 
                    key={idx}
                    className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How to Counter Disinfo */}
      <div className="bg-[#111820] border border-[#1c2a35] p-4">
        <h3 className="font-medium text-white mb-3 flex items-center gap-2"><Lightbulb className="w-5 h-5" /> How to Counter Disinformation</h3>
        <ul className="text-sm text-slate-300 space-y-2">
          <li>• <strong>Don't amplify</strong> - Avoid sharing false claims, even to debunk them</li>
          <li>• <strong>Lead with truth</strong> - State facts first, then mention the false claim</li>
          <li>• <strong>Cite sources</strong> - Link to credible reports and investigations</li>
          <li>• <strong>Report</strong> - Flag disinformation on social media platforms</li>
          <li>• <strong>Educate</strong> - Help others recognize propaganda techniques</li>
        </ul>
      </div>

      {/* Resources */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
        <h3 className="font-medium text-white mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Fact-Checking Resources</h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <a href="https://www.aspi.org.au/program/international-cyber-policy-centre" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
            ASPI - CCP Influence Tracking
          </a>
          <a href="https://chinadigitaltimes.net/" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
            China Digital Times
          </a>
          <a href="https://www.propublica.org/series/china-propaganda" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
            ProPublica - China Propaganda
          </a>
          <a href="https://www.disinfo.eu/" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
            EU DisinfoLab
          </a>
        </div>
      </div>

      {/* Report Disinfo */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
        <h3 className="font-medium text-white mb-2 flex items-center gap-2"><PenSquare className="w-5 h-5" /> Report Disinformation</h3>
        <p className="text-sm text-slate-400 mb-3">
          Spotted CCP disinformation that should be tracked? Submit it for review.
        </p>
        <a
          href="https://github.com/Stan2032/global-anti-ccp-resistance-hub/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm transition-colors"
        >
          Submit Report
        </a>
      </div>
    </div>
  );
};

export default DisinfoTracker;
