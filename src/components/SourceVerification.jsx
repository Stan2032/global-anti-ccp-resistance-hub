import React, { useState } from 'react';
import {
  Search, FileText, RefreshCw, Calendar, AlertTriangle, ScanEye, Lightbulb,
} from 'lucide-react';

const SourceVerification = () => {
  const [activeTab, setActiveTab] = useState('sources');
  const [searchQuery, setSearchQuery] = useState('');

  const trustedSources = [
    {
      category: 'Research Organizations',
      sources: [
        {
          name: 'Australian Strategic Policy Institute (ASPI)',
          url: 'https://www.aspi.org.au/',
          description: 'Leading research on Xinjiang detention facilities, forced labor, and CCP influence operations',
          reliability: 'high',
          focus: ['Xinjiang', 'Surveillance', 'Forced Labor', 'Influence Operations'],
          keyReports: ['Xinjiang Data Project', 'Uyghurs for Sale', 'Mapping China\'s Tech Giants'],
        },
        {
          name: 'Safeguard Defenders',
          url: 'https://safeguarddefenders.com/',
          description: 'Investigates transnational repression, overseas police stations, and forced returns',
          reliability: 'high',
          focus: ['Transnational Repression', 'Police Stations', 'Forced Returns'],
          keyReports: ['110 Overseas', 'Patrol and Persuade', 'Involuntary Returns'],
        },
        {
          name: 'Uyghur Human Rights Project (UHRP)',
          url: 'https://uhrp.org/',
          description: 'Comprehensive research and advocacy on Uyghur human rights',
          reliability: 'high',
          focus: ['Uyghur Rights', 'Genocide', 'Cultural Destruction'],
          keyReports: ['Genocide Reports', 'Forced Labor Research', 'Family Separation'],
        },
        {
          name: 'Human Rights Watch',
          url: 'https://www.hrw.org/',
          description: 'Global human rights organization with extensive China coverage',
          reliability: 'high',
          focus: ['Human Rights', 'Hong Kong', 'Xinjiang', 'Tibet'],
          keyReports: ['China\'s Algorithms of Repression', 'Break Their Lineage'],
        },
        {
          name: 'Amnesty International',
          url: 'https://www.amnesty.org/',
          description: 'Global human rights organization documenting abuses',
          reliability: 'high',
          focus: ['Human Rights', 'Political Prisoners', 'Torture'],
          keyReports: ['Like We Were Enemies in a War', 'Urgent Actions'],
        },
        {
          name: 'Freedom House',
          url: 'https://freedomhouse.org/',
          description: 'Research on freedom, democracy, and transnational repression',
          reliability: 'high',
          focus: ['Freedom Index', 'Transnational Repression', 'Internet Freedom'],
          keyReports: ['Freedom in the World', 'Beijing\'s Global Megaphone'],
        },
      ],
    },
    {
      category: 'Government & Legal',
      sources: [
        {
          name: 'Uyghur Tribunal',
          url: 'https://uyghurtribunal.com/',
          description: 'Independent tribunal that concluded genocide is occurring',
          reliability: 'high',
          focus: ['Genocide Determination', 'Legal Analysis', 'Witness Testimony'],
          keyReports: ['Judgment (December 2021)'],
        },
        {
          name: 'US Congressional-Executive Commission on China (CECC)',
          url: 'https://www.cecc.gov/',
          description: 'US government body monitoring human rights in China',
          reliability: 'high',
          focus: ['Political Prisoners', 'Human Rights', 'Policy'],
          keyReports: ['Annual Reports', 'Political Prisoner Database'],
        },
        {
          name: 'UK Foreign Affairs Committee',
          url: 'https://committees.parliament.uk/committee/78/foreign-affairs-committee/',
          description: 'Parliamentary oversight of UK foreign policy on China',
          reliability: 'high',
          focus: ['UK-China Relations', 'Human Rights', 'Hong Kong'],
          keyReports: ['Xinjiang Reports', 'Hong Kong Reports'],
        },
      ],
    },
    {
      category: 'News & Media',
      sources: [
        {
          name: 'Radio Free Asia (RFA)',
          url: 'https://www.rfa.org/',
          description: 'Independent news with native language reporting from affected regions',
          reliability: 'high',
          focus: ['Breaking News', 'Uyghur', 'Tibetan', 'Cantonese'],
          keyReports: ['Daily News Coverage', 'Investigative Reports'],
        },
        {
          name: 'Hong Kong Free Press',
          url: 'https://hongkongfp.com/',
          description: 'Independent, non-profit news covering Hong Kong',
          reliability: 'high',
          focus: ['Hong Kong', 'Press Freedom', 'NSL'],
          keyReports: ['Daily News', 'NSL Tracker'],
        },
        {
          name: 'The China Project',
          url: 'https://thechinaproject.com/',
          description: 'In-depth analysis and news on China',
          reliability: 'medium-high',
          focus: ['Analysis', 'Business', 'Politics'],
          keyReports: ['Sinica Podcast', 'Daily Briefs'],
        },
        {
          name: 'Associated Press',
          url: 'https://apnews.com/',
          description: 'Major wire service with verified China reporting',
          reliability: 'high',
          focus: ['Breaking News', 'Investigations'],
          keyReports: ['China Cables', 'Xinjiang Investigations'],
        },
      ],
    },
    {
      category: 'Academic',
      sources: [
        {
          name: 'Xinjiang Victims Database',
          url: 'https://shahit.biz/',
          description: 'Comprehensive database of detained Uyghurs with verified cases',
          reliability: 'high',
          focus: ['Individual Cases', 'Documentation', 'Verification'],
          keyReports: ['25,000+ documented cases'],
        },
        {
          name: 'Xinjiang Police Files',
          url: 'https://www.xinjiangpolicefiles.org/',
          description: 'Leaked internal CCP documents and photos from camps',
          reliability: 'high',
          focus: ['Primary Documents', 'Photos', 'Internal Orders'],
          keyReports: ['2022 Document Leak'],
        },
        {
          name: 'Dr. Adrian Zenz',
          url: 'https://adrianzenz.medium.com/',
          description: 'Leading researcher on Xinjiang, birth control, and forced labor',
          reliability: 'high',
          focus: ['Xinjiang', 'Demographics', 'Forced Labor'],
          keyReports: ['Birth Control Research', 'Forced Labor Studies'],
        },
      ],
    },
  ];

  const unreliableSources = [
    {
      name: 'Global Times',
      type: 'CCP State Media',
      reason: 'Official CCP propaganda outlet, frequently publishes disinformation',
      examples: ['Denies Uyghur genocide', 'Attacks researchers', 'Spreads COVID disinformation'],
    },
    {
      name: 'CGTN',
      type: 'CCP State Media',
      reason: 'China Global Television Network is CCP-controlled international propaganda',
      examples: ['Forced confessions aired', 'Xinjiang "documentaries"', 'UK license revoked'],
    },
    {
      name: 'Xinhua',
      type: 'CCP State Media',
      reason: 'Official CCP news agency, no editorial independence',
      examples: ['Official CCP narratives only', 'No critical coverage'],
    },
    {
      name: 'China Daily',
      type: 'CCP State Media',
      reason: 'English-language CCP propaganda, paid inserts in Western newspapers',
      examples: ['Paid supplements in Washington Post, WSJ', 'Denies human rights abuses'],
    },
    {
      name: 'The Grayzone',
      type: 'Disinformation Outlet',
      reason: 'Consistently denies Uyghur genocide, attacks legitimate researchers',
      examples: ['Attacks Adrian Zenz', 'Denies camp existence', 'Promotes CCP narratives'],
    },
    {
      name: 'Confucius Institute Materials',
      type: 'CCP Influence',
      reason: 'Educational materials controlled by CCP, omit sensitive topics',
      examples: ['No mention of Tiananmen', 'Tibet portrayed as "liberation"', 'Taiwan as part of China'],
    },
  ];

  const verificationTips = [
    {
      title: 'Check the Source',
      description: 'Is it from a CCP state media outlet? Is the author credible? What is their track record?',
      Icon: Search,
    },
    {
      title: 'Look for Primary Documents',
      description: 'The best evidence comes from leaked CCP documents, satellite imagery, and firsthand testimony.',
      Icon: FileText,
    },
    {
      title: 'Cross-Reference',
      description: 'Verify claims across multiple independent sources. Be wary of single-source stories.',
      Icon: RefreshCw,
    },
    {
      title: 'Check Dates',
      description: 'Is the information current? Has it been updated or corrected?',
      Icon: Calendar,
    },
    {
      title: 'Beware of Whataboutism',
      description: 'CCP propaganda often deflects by pointing to other countries\' issues rather than addressing claims.',
      Icon: AlertTriangle,
    },
    {
      title: 'Understand CCP Tactics',
      description: 'The CCP uses denial, deflection, and discrediting of sources. Learn to recognize these patterns.',
      Icon: ScanEye,
    },
  ];

  const filteredSources = searchQuery
    ? trustedSources.map(category => ({
        ...category,
        sources: category.sources.filter(source =>
          source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          source.focus.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      })).filter(category => category.sources.length > 0)
    : trustedSources;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-green-500">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">✅</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Source Verification Guide</h2>
            <p className="text-slate-400">Verify information and identify reliable sources</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          In the fight against CCP disinformation, knowing which sources to trust is crucial. 
          This guide helps you verify information and identify credible research.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2">
        {[
          { id: 'sources', name: 'Trusted Sources', icon: '✓' },
          { id: 'avoid', name: 'Sources to Avoid', icon: '✗' },
          { id: 'tips', name: 'Verification Tips', Icon: Lightbulb },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'bg-[#111820] text-slate-300 hover:bg-[#111820]'
            }`}
          >
            <span>{tab.Icon ? <tab.Icon className="w-4 h-4" /> : tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Trusted Sources Tab */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              aria-label="Search"
              type="text"
              placeholder="Search sources by name or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111820] border border-[#1c2a35] px-4 py-3 pl-10 text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
            />
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
          </div>

          {/* Sources by Category */}
          {filteredSources.map((category, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-lg font-semibold text-white">{category.category}</h3>
              <div className="grid gap-3">
                {category.sources.map((source, sidx) => (
                  <div key={sidx} className="bg-[#111820]/50 border border-[#1c2a35] p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white font-medium hover:text-green-400 transition-colors"
                        >
                          {source.name} →
                        </a>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                          source.reliability === 'high' 
                            ? 'bg-green-900/50 text-green-400' 
                            : 'bg-yellow-900/50 text-yellow-400'
                        }`}>
                          {source.reliability === 'high' ? 'Highly Reliable' : 'Reliable'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{source.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {source.focus.map((topic, tidx) => (
                        <span key={tidx} className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                    {source.keyReports && (
                      <div className="text-xs text-slate-500">
                        Key reports: {source.keyReports.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sources to Avoid Tab */}
      {activeTab === 'avoid' && (
        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-700/50 p-4 mb-4">
            <h3 className="font-medium text-red-300 mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Warning</h3>
            <p className="text-sm text-slate-300">
              These sources are known to spread CCP propaganda or disinformation. 
              Information from these sources should be treated with extreme skepticism.
            </p>
          </div>

          <div className="space-y-3">
            {unreliableSources.map((source, idx) => (
              <div key={idx} className="bg-[#111820]/50 border border-red-700/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{source.name}</h4>
                  <span className="text-xs px-2 py-1 bg-red-900/50 text-red-400 rounded">
                    {source.type}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-2">{source.reason}</p>
                <div className="text-xs text-slate-500">
                  Examples: {source.examples.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification Tips Tab */}
      {activeTab === 'tips' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {verificationTips.map((tip, idx) => (
              <div key={idx} className="bg-[#111820]/50 border border-[#1c2a35] p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{tip.Icon ? <tip.Icon className="w-6 h-6" /> : tip.icon}</span>
                  <h4 className="font-medium text-white">{tip.title}</h4>
                </div>
                <p className="text-sm text-slate-400">{tip.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
            <h3 className="font-semibold text-white mb-3">Common CCP Disinformation Tactics</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-red-400">1.</span>
                <div>
                  <h4 className="font-medium text-white">Denial</h4>
                  <p className="text-sm text-slate-400">Flatly denying documented abuses despite overwhelming evidence</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-red-400">2.</span>
                <div>
                  <h4 className="font-medium text-white">Discrediting</h4>
                  <p className="text-sm text-slate-400">Attacking researchers, journalists, and witnesses personally</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-red-400">3.</span>
                <div>
                  <h4 className="font-medium text-white">Whataboutism</h4>
                  <p className="text-sm text-slate-400">Deflecting by pointing to other countries' issues</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-red-400">4.</span>
                <div>
                  <h4 className="font-medium text-white">Flooding</h4>
                  <p className="text-sm text-slate-400">Creating overwhelming amounts of counter-narratives to confuse</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-red-400">5.</span>
                <div>
                  <h4 className="font-medium text-white">Co-opting</h4>
                  <p className="text-sm text-slate-400">Using Western voices and influencers to spread CCP narratives</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-4 text-center">
        <p className="text-sm text-slate-400">
          When in doubt, cross-reference multiple independent sources and look for primary documentation.
        </p>
      </div>
    </div>
  );
};

export default SourceVerification;
