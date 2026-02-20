import { useState } from 'react';
import { Monitor, Landmark, Smartphone, Bot, Drama, Radio, BarChart3, Globe, Search } from 'lucide-react';

const MediaManipulation = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mediaOutlets = [
    // State Media
    {
      name: 'CGTN (China Global Television Network)',
      category: 'state_media',
      type: 'Television',
      status: 'REGISTERED FOREIGN AGENT',
      description: 'International arm of CCTV, broadcasts in 6 languages. Required to register as foreign agent in US (2019) and UK.',
      reach: '100M+ viewers',
      concerns: ['Forced confessions aired', 'Xinjiang propaganda', 'Hong Kong disinformation'],
      countries: ['US', 'UK', 'EU']
    },
    {
      name: 'Xinhua News Agency',
      category: 'state_media',
      type: 'News Wire',
      status: 'REGISTERED FOREIGN AGENT',
      description: 'Official state news agency, largest news agency in the world by correspondents. Registered as foreign mission in US.',
      reach: '200+ bureaus worldwide',
      concerns: ['CCP propaganda', 'Surveillance of journalists', 'Content deals with Western media'],
      countries: ['Global']
    },
    {
      name: 'China Daily',
      category: 'state_media',
      type: 'Newspaper',
      status: 'REGISTERED FOREIGN AGENT',
      description: 'English-language daily, paid inserts in major Western newspapers (Washington Post, WSJ, etc.)',
      reach: '900K+ circulation',
      concerns: ['Paid propaganda inserts', 'Undisclosed CCP funding', 'Influence operations'],
      countries: ['US', 'UK', 'EU', 'Africa']
    },
    {
      name: 'Global Times',
      category: 'state_media',
      type: 'Tabloid',
      status: 'CCP CONTROLLED',
      description: 'Nationalist tabloid known for aggressive rhetoric. English edition targets international audience.',
      reach: '2M+ circulation',
      concerns: ['Wolf warrior rhetoric', 'Threats against critics', 'Disinformation campaigns'],
      countries: ['Global']
    },
    {
      name: 'People\'s Daily',
      category: 'state_media',
      type: 'Newspaper',
      status: 'CCP ORGAN',
      description: 'Official newspaper of the CCP Central Committee. Sets party line on all issues.',
      reach: '3M+ circulation',
      concerns: ['Official CCP propaganda', 'Policy signals', 'International editions'],
      countries: ['China', 'Global']
    },
    
    // Social Media Operations
    {
      name: 'TikTok / Douyin',
      category: 'social_media',
      type: 'Platform',
      status: 'UNDER INVESTIGATION',
      description: 'ByteDance-owned platform with 1B+ users. Subject to Chinese national security laws requiring data sharing.',
      reach: '1B+ users',
      concerns: ['Data collection', 'Algorithm manipulation', 'Content suppression', 'CCP access to data'],
      countries: ['Global']
    },
    {
      name: 'WeChat / Weixin',
      category: 'social_media',
      type: 'Platform',
      status: 'SURVEILLANCE TOOL',
      description: 'Tencent super-app with 1.2B users. Heavily censored, monitored by CCP. Used to surveil diaspora.',
      reach: '1.2B+ users',
      concerns: ['Diaspora surveillance', 'Censorship', 'Data sharing with CCP', 'Transnational repression'],
      countries: ['Global']
    },
    {
      name: '50 Cent Army (五毛党)',
      category: 'social_media',
      type: 'Troll Network',
      status: 'ACTIVE',
      description: 'Government-paid commenters posting pro-CCP content. Estimated 2M+ posts per year.',
      reach: '488M+ posts (estimated)',
      concerns: ['Coordinated inauthentic behavior', 'Narrative manipulation', 'Harassment campaigns'],
      countries: ['China', 'Global']
    },
    {
      name: 'Little Pink (小粉红)',
      category: 'social_media',
      type: 'Nationalist Movement',
      status: 'ACTIVE',
      description: 'Young nationalist netizens who attack critics of China. Mobilized for harassment campaigns.',
      reach: 'Millions of participants',
      concerns: ['Coordinated harassment', 'Doxxing', 'Threats against critics'],
      countries: ['Global']
    },
    
    // Content Farms
    {
      name: 'Spamouflage Dragon',
      category: 'disinfo_network',
      type: 'Disinformation Network',
      status: 'IDENTIFIED BY META/GOOGLE',
      description: 'Largest known CCP-linked influence operation. Uses fake accounts across platforms.',
      reach: 'Millions of fake accounts',
      concerns: ['Election interference', 'COVID disinformation', 'Anti-US content'],
      countries: ['US', 'Taiwan', 'Global']
    },
    {
      name: 'Dragonbridge',
      category: 'disinfo_network',
      type: 'Disinformation Network',
      status: 'IDENTIFIED BY MANDIANT',
      description: 'Pro-China influence operation targeting rare earth mining, COVID origins, Hong Kong.',
      reach: 'Cross-platform',
      concerns: ['Industrial espionage support', 'Narrative warfare', 'Platform manipulation'],
      countries: ['US', 'EU', 'Australia']
    },
    
    // Foreign Media Capture
    {
      name: 'Phoenix TV',
      category: 'captured_media',
      type: 'Television',
      status: 'CCP LINKED',
      description: 'Hong Kong-based, claims independence but has documented CCP ties. Broadcasts in US.',
      reach: '360M+ households',
      concerns: ['Undisclosed CCP ties', 'Self-censorship', 'Pro-Beijing coverage'],
      countries: ['Hong Kong', 'US', 'Global']
    },
    {
      name: 'South China Morning Post',
      category: 'captured_media',
      type: 'Newspaper',
      status: 'ALIBABA OWNED',
      description: 'Hong Kong English daily, acquired by Alibaba in 2016. Increasing self-censorship noted.',
      reach: '5M+ monthly readers',
      concerns: ['Self-censorship', 'Editorial changes post-acquisition', 'Soft propaganda'],
      countries: ['Hong Kong', 'Global']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Media', Icon: Monitor },
    { id: 'state_media', name: 'State Media', Icon: Landmark },
    { id: 'social_media', name: 'Social Media', Icon: Smartphone },
    { id: 'disinfo_network', name: 'Disinfo Networks', Icon: Bot },
    { id: 'captured_media', name: 'Captured Media', Icon: Drama },
  ];

  const filteredMedia = selectedCategory === 'all'
    ? mediaOutlets
    : mediaOutlets.filter(m => m.category === selectedCategory);

  const getStatusColor = (status) => {
    if (status.includes('FOREIGN AGENT')) return 'bg-yellow-600';
    if (status.includes('INVESTIGATION')) return 'bg-orange-600';
    if (status.includes('SURVEILLANCE') || status.includes('ACTIVE')) return 'bg-red-600';
    if (status.includes('IDENTIFIED')) return 'bg-purple-600';
    if (status.includes('CCP')) return 'bg-red-700';
    return 'bg-slate-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-purple-500 p-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Radio className="w-6 h-6" /> CCP Media & Propaganda Tracker</h2>
        <p className="text-slate-300">
          Track CCP state media, social media manipulation, and disinformation networks operating globally.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
          <p className="text-3xl font-bold text-red-400">{mediaOutlets.length}</p>
          <p className="text-sm text-slate-400">Outlets Tracked</p>
        </div>
        <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
          <p className="text-3xl font-bold text-yellow-400">5</p>
          <p className="text-sm text-slate-400">Foreign Agents</p>
        </div>
        <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
          <p className="text-3xl font-bold text-purple-400">2</p>
          <p className="text-sm text-slate-400">Disinfo Networks</p>
        </div>
        <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
          <p className="text-3xl font-bold text-white">2B+</p>
          <p className="text-sm text-slate-400">Combined Reach</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-red-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-[#1c2a35]'
            }`}
          >
            <cat.Icon className="w-4 h-4" />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Media Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredMedia.map((media, i) => (
          <div key={i} className="bg-[#111820] border border-[#1c2a35] p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{media.name}</h3>
                <p className="text-sm text-slate-400">{media.type}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(media.status)}`}>
                {media.status}
              </span>
            </div>
            
            <p className="text-slate-300 text-sm mb-4">{media.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
              <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> {media.reach}</span>
              <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {media.countries.join(', ')}</span>
            </div>
            
            <div className="border-t border-[#1c2a35] pt-4">
              <p className="text-xs text-slate-500 mb-2">Concerns:</p>
              <div className="flex flex-wrap gap-2">
                {media.concerns.map((concern, j) => (
                  <span key={j} className="bg-red-900/50 text-red-300 text-xs px-2 py-1 rounded">
                    {concern}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How to Identify */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Search className="w-5 h-5" /> How to Identify CCP Propaganda</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-2">Red Flags:</h4>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>• Uses "Chinese government" instead of "CCP"</li>
              <li>• Refers to Taiwan as "Chinese Taipei"</li>
              <li>• Calls Xinjiang camps "vocational training"</li>
              <li>• Describes Hong Kong protests as "riots"</li>
              <li>• Uses "hurting feelings of Chinese people"</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Verification Tools:</h4>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>
                <a href="https://www.propornot.com" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
                  PropOrNot →
                </a>
              </li>
              <li>
                <a href="https://www.hamiltonindex.net" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
                  Hamilton 2.0 Dashboard →
                </a>
              </li>
              <li>
                <a href="https://euvsdisinfo.eu" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
                  EUvsDisinfo →
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Report Disinformation:</h4>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>• Report to platform (Twitter, Facebook, YouTube)</li>
              <li>• Document with screenshots</li>
              <li>• Share with fact-checkers</li>
              <li>• Alert researchers (ASPI, DFRLab)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaManipulation;
