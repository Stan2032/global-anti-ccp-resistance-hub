import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info, ExternalLink, Search } from 'lucide-react';
import GlobalDisclaimer from './ui/GlobalDisclaimer';

const MediaBiasGuide = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mediaSources = [
    // Trustworthy Sources
    {
      name: 'Radio Free Asia (RFA)',
      category: 'Trustworthy',
      rating: 'Highly Reliable',
      bias: 'Slight US Government Perspective',
      description: 'US government-funded but editorially independent. Excellent coverage of China, especially Xinjiang, Tibet, and Hong Kong. Employs native speakers and local sources.',
      strengths: ['On-the-ground reporting', 'Native language coverage', 'Extensive source network', 'Timely breaking news'],
      weaknesses: ['US funding may raise questions', 'Sometimes lacks context'],
      website: 'https://www.rfa.org',
      founded: '1996',
      funding: 'US Government (USAGM)',
      credibility: 95
    },
    {
      name: 'Hong Kong Free Press (HKFP)',
      category: 'Trustworthy',
      rating: 'Highly Reliable',
      bias: 'Pro-Democracy',
      description: 'Independent, non-profit English-language news source focused on Hong Kong. Known for balanced, fact-based reporting on Hong Kong issues.',
      strengths: ['Independent funding', 'Local expertise', 'Fact-checking', 'Transparent sourcing'],
      weaknesses: ['Limited to Hong Kong coverage', 'Pro-democracy stance may affect framing'],
      website: 'https://hongkongfp.com',
      founded: '2015',
      funding: 'Donations, Crowdfunding',
      credibility: 95
    },
    {
      name: 'The China Project (formerly SupChina)',
      category: 'Trustworthy',
      rating: 'Reliable',
      bias: 'Balanced',
      description: 'In-depth analysis of China news and culture. Aims for nuanced, non-sensationalist coverage. Good for understanding context.',
      strengths: ['Nuanced analysis', 'Cultural context', 'Expert contributors', 'Avoids sensationalism'],
      weaknesses: ['Sometimes overly cautious', 'Slower to break news'],
      website: 'https://thechinaproject.com',
      founded: '2016',
      funding: 'Subscriptions, Grants',
      credibility: 90
    },
    {
      name: 'Associated Press (AP) - China Coverage',
      category: 'Trustworthy',
      rating: 'Reliable',
      bias: 'Minimal',
      description: 'Major international news agency with strong China bureau. Fact-based reporting with minimal editorial bias.',
      strengths: ['Fact-checking', 'Multiple sources', 'Global reach', 'Minimal bias'],
      weaknesses: ['Sometimes self-censors to maintain China access', 'Can be cautious'],
      website: 'https://apnews.com/hub/china',
      founded: '1846',
      funding: 'Member Cooperatives',
      credibility: 90
    },
    {
      name: 'Reuters - China Coverage',
      category: 'Trustworthy',
      rating: 'Reliable',
      bias: 'Minimal',
      description: 'International news agency with extensive China coverage. Known for factual, straightforward reporting.',
      strengths: ['Fact-based', 'Financial expertise', 'Global network', 'Breaking news'],
      weaknesses: ['May self-censor for access', 'Sometimes lacks depth'],
      website: 'https://www.reuters.com/places/china',
      founded: '1851',
      funding: 'Thomson Reuters',
      credibility: 90
    },
    {
      name: 'BBC News - China Coverage',
      category: 'Trustworthy',
      rating: 'Reliable',
      bias: 'Slight UK Perspective',
      description: 'British public broadcaster with strong China coverage. Generally balanced but sometimes cautious.',
      strengths: ['In-depth reporting', 'Video content', 'Global reach', 'Fact-checking'],
      weaknesses: ['UK government funding', 'Sometimes self-censors', 'Banned in China'],
      website: 'https://www.bbc.com/news/world/asia/china',
      founded: '1922',
      funding: 'UK License Fees',
      credibility: 85
    },

    // Use with Caution
    {
      name: 'South China Morning Post (SCMP)',
      category: 'Use with Caution',
      rating: 'Mixed Reliability',
      bias: 'Pro-Beijing (Alibaba-owned)',
      description: 'Hong Kong-based English newspaper owned by Alibaba. Was once independent but editorial line has shifted since 2016 acquisition.',
      strengths: ['Local expertise', 'Business coverage', 'Some good journalists remain'],
      weaknesses: ['Alibaba/CCP influence', 'Self-censorship', 'Pro-Beijing editorial line'],
      website: 'https://www.scmp.com',
      founded: '1903',
      funding: 'Alibaba Group',
      credibility: 60
    },
    {
      name: 'The Guardian - China Coverage',
      category: 'Use with Caution',
      rating: 'Generally Reliable',
      bias: 'Left-leaning',
      description: 'British newspaper with China coverage. Generally good but sometimes inconsistent on China issues.',
      strengths: ['Investigative journalism', 'Human rights focus', 'Independent'],
      weaknesses: ['Inconsistent China coverage', 'Sometimes uncritical of CCP', 'Left-wing bias'],
      website: 'https://www.theguardian.com/world/china',
      founded: '1821',
      funding: 'Scott Trust',
      credibility: 75
    },
    {
      name: 'New York Times - China Coverage',
      category: 'Use with Caution',
      rating: 'Generally Reliable',
      bias: 'Liberal',
      description: 'Major US newspaper with strong China bureau. Good investigative work but sometimes inconsistent.',
      strengths: ['Investigative journalism', 'Resources', 'Xinjiang coverage', 'Visual journalism'],
      weaknesses: ['Paywall', 'Sometimes both-sides CCP propaganda', 'Liberal bias'],
      website: 'https://www.nytimes.com/section/world/asia',
      founded: '1851',
      funding: 'Subscriptions',
      credibility: 80
    },

    // CCP State Media (Propaganda)
    {
      name: 'Global Times',
      category: 'CCP Propaganda',
      rating: 'Unreliable',
      bias: 'Extreme Pro-CCP',
      description: 'CCP state media tabloid. Nationalist propaganda outlet. Useful only for understanding CCP messaging.',
      strengths: ['Shows CCP narrative', 'Reveals official positions'],
      weaknesses: ['Pure propaganda', 'Misinformation', 'Nationalist rhetoric', 'No journalistic standards'],
      website: 'https://www.globaltimes.cn',
      founded: '1993',
      funding: 'CCP (People\'s Daily)',
      credibility: 10
    },
    {
      name: 'CGTN (China Global Television Network)',
      category: 'CCP Propaganda',
      rating: 'Unreliable',
      bias: 'Extreme Pro-CCP',
      description: 'CCP state media TV network. Slick propaganda designed for international audiences. Banned in UK and Germany.',
      strengths: ['High production value', 'Shows CCP messaging'],
      weaknesses: ['Pure propaganda', 'Forced confessions', 'Misinformation', 'Banned in multiple countries'],
      website: 'https://www.cgtn.com',
      founded: '2016',
      funding: 'CCP',
      credibility: 5
    },
    {
      name: 'Xinhua News Agency',
      category: 'CCP Propaganda',
      rating: 'Unreliable',
      bias: 'Extreme Pro-CCP',
      description: 'Official CCP state news agency. Pure propaganda. Useful only for official CCP positions.',
      strengths: ['Official CCP statements', 'Breaking CCP announcements'],
      weaknesses: ['Pure propaganda', 'No editorial independence', 'Misinformation'],
      website: 'http://www.xinhuanet.com',
      founded: '1931',
      funding: 'CCP',
      credibility: 10
    },
    {
      name: 'China Daily',
      category: 'CCP Propaganda',
      rating: 'Unreliable',
      bias: 'Extreme Pro-CCP',
      description: 'CCP state media English newspaper. Propaganda disguised as news. Pays for inserts in Western newspapers.',
      strengths: ['Shows CCP narrative'],
      weaknesses: ['Pure propaganda', 'Pays for placement in Western media', 'Misinformation'],
      website: 'https://www.chinadaily.com.cn',
      founded: '1981',
      funding: 'CCP',
      credibility: 10
    },

    // Problematic "Alternative" Sources
    {
      name: 'The Grayzone',
      category: 'Problematic',
      rating: 'Unreliable',
      bias: 'Pro-CCP, Anti-US',
      description: 'Website that denies Uyghur genocide and repeats CCP talking points. Masquerades as "alternative" media.',
      strengths: ['None for China coverage'],
      weaknesses: ['Genocide denial', 'Repeats CCP propaganda', 'Conspiracy theories', 'Funded by unclear sources'],
      website: 'https://thegrayzone.com',
      founded: '2015',
      funding: 'Unclear',
      credibility: 15
    },
    {
      name: 'Qiao Collective',
      category: 'Problematic',
      rating: 'Unreliable',
      bias: 'Extreme Pro-CCP',
      description: 'Diaspora group that denies Uyghur genocide and promotes CCP narratives. Not a credible news source.',
      strengths: ['None'],
      weaknesses: ['Genocide denial', 'CCP propaganda', 'Attacks survivors', 'No journalistic standards'],
      website: 'https://www.qiaocollective.com',
      founded: '2019',
      funding: 'Unclear',
      credibility: 5
    }
  ];

  const categories = ['all', 'Trustworthy', 'Use with Caution', 'CCP Propaganda', 'Problematic'];

  const filteredSources = mediaSources.filter(source => {
    const matchesCategory = selectedCategory === 'all' || source.category === selectedCategory;
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getRatingIcon = (category) => {
    if (category === 'Trustworthy') return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (category === 'Use with Caution') return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    return <XCircle className="w-5 h-5 text-red-400" />;
  };

  const getRatingColor = (category) => {
    if (category === 'Trustworthy') return 'text-green-400 bg-green-500/10 border-green-500/30';
    if (category === 'Use with Caution') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/30';
  };

  return (
    <div className="bg-[#111820]/50 backdrop-blur-sm border border-[#1c2a35]/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Info className="w-8 h-8 text-[#22d3ee]" />
        <div>
          <h2 className="text-2xl font-bold text-white">Media Bias Guide</h2>
          <p className="text-slate-400 text-sm">Evaluate news sources on China and CCP human rights abuses</p>
        </div>
      </div>

      {/* Guide Notice */}
      <div className="bg-[#22d3ee]/10 border border-[#1c2a35] p-4 mb-6">
        <h3 className="text-[#22d3ee] font-bold mb-2">How to Use This Guide</h3>
        <p className="text-slate-300 text-sm mb-2">
          This guide helps you evaluate the reliability of news sources covering China. Always cross-reference multiple sources and check primary documents when possible.
        </p>
        <GlobalDisclaimer type="verify" compact />
      </div>

      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            aria-label="Search"
            type="text"
            placeholder="Search news sources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0a0e14]/50 border border-[#1c2a35]/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4afa82]/50"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#22d3ee] text-[#0a0e14]'
                  : 'bg-[#0a0e14]/50 text-slate-400 hover:bg-[#0a0e14] hover:text-white border border-[#1c2a35]/50'
              }`}
            >
              {cat === 'all' ? 'All Sources' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Media Sources */}
      <div className="space-y-4">
        {filteredSources.map((source, index) => (
          <div key={index} className="bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getRatingIcon(source.category)}
                  <h3 className="text-xl font-bold text-white">{source.name}</h3>
                  <a href={source.website} target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:text-[#22d3ee]">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRatingColor(source.category)}`}>
                    {source.rating}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium border text-slate-400 bg-[#111820] border-[#1c2a35]">
                    Bias: {source.bias}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium border text-slate-400 bg-[#111820] border-[#1c2a35]">
                    Credibility: {source.credibility}%
                  </span>
                </div>
              </div>
            </div>

            <p className="text-slate-300 text-sm mb-4">{source.description}</p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm font-medium text-green-400 mb-2">✓ Strengths:</div>
                <ul className="text-sm text-slate-400 space-y-1">
                  {source.strengths.map((strength, i) => (
                    <li key={i}>• {strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-sm font-medium text-red-400 mb-2">✗ Weaknesses:</div>
                <ul className="text-sm text-slate-400 space-y-1">
                  {source.weaknesses.map((weakness, i) => (
                    <li key={i}>• {weakness}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-3 border-t border-[#1c2a35]/50">
              <span>Founded: {source.founded}</span>
              <span>Funding: {source.funding}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="mt-6 bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-5">
        <h3 className="text-white font-bold mb-3">Tips for Evaluating Sources</h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p>• <strong>Check funding:</strong> Who pays for the outlet? Government, subscriptions, donations, or unclear?</p>
          <p>• <strong>Look for transparency:</strong> Do they cite sources? Provide evidence? Correct errors?</p>
          <p>• <strong>Beware of emotional language:</strong> Propaganda uses extreme language to manipulate emotions.</p>
          <p>• <strong>Cross-reference:</strong> Never rely on a single source for important claims.</p>
          <p>• <strong>Check primary sources:</strong> When possible, read original documents, reports, or testimonies.</p>
          <p>• <strong>Watch for "both-sidesism":</strong> Giving equal weight to CCP propaganda and verified evidence is false balance.</p>
          <p>• <strong>Be skeptical of "alternative" narratives:</strong> Genocide denial is not legitimate journalism.</p>
        </div>
      </div>
    </div>
  );
};

export default MediaBiasGuide;
