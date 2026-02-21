import { useState } from 'react';
import { Ban, AlertTriangle, Megaphone } from 'lucide-react';

const ChinaExitBan = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const exitBanCases = [
    {
      category: 'foreign_nationals',
      name: 'Liu Kai',
      nationality: '🇺🇸 American',
      occupation: 'Businessman',
      detained_since: '2018',
      status: 'EXIT BAN',
      description: 'American businessman prevented from leaving China over business dispute. Held for over 5 years.',
      source: 'Safeguard Defenders'
    },
    {
      category: 'foreign_nationals',
      name: 'Victor Liu',
      nationality: '🇺🇸 American',
      occupation: 'Student',
      detained_since: '2018',
      status: 'RELEASED 2021',
      description: 'American student held with his mother to pressure his father to return to China. Released after 3 years.',
      source: 'New York Times'
    },
    {
      category: 'foreign_nationals',
      name: 'Cynthia Liu',
      nationality: '🇺🇸 American',
      occupation: 'Consultant',
      detained_since: '2018',
      status: 'RELEASED 2021',
      description: 'American held with her son to pressure her ex-husband. Classic hostage diplomacy case.',
      source: 'New York Times'
    },
    {
      category: 'foreign_nationals',
      name: 'Dominic Barton (family)',
      nationality: '🇨🇦 Canadian',
      occupation: 'Ambassador\'s family',
      detained_since: '2019',
      status: 'THREATENED',
      description: 'Canadian Ambassador\'s family members in China faced implicit threats during Meng Wanzhou case.',
      source: 'Globe and Mail'
    },
    {
      category: 'activists',
      name: 'Yang Maodong (Guo Feixiong)',
      nationality: '🇨🇳 Chinese',
      occupation: 'Human Rights Lawyer',
      detained_since: '2021',
      status: 'EXIT BAN',
      description: 'Prominent human rights lawyer prevented from leaving to see dying wife in US. Wife died before he could leave.',
      source: 'Amnesty International'
    },
    {
      category: 'activists',
      name: 'Xu Zhiyong',
      nationality: '🇨🇳 Chinese',
      occupation: 'Legal Scholar',
      detained_since: '2020',
      status: 'IMPRISONED',
      description: 'Founder of New Citizens Movement. Sentenced to 14 years in 2023 for "subversion."',
      source: 'Human Rights Watch'
    },
    {
      category: 'activists',
      name: 'Ding Jiaxi',
      nationality: '🇨🇳 Chinese',
      occupation: 'Human Rights Lawyer',
      detained_since: '2019',
      status: 'IMPRISONED',
      description: 'Civil rights lawyer sentenced to 12 years for "subversion" in 2023.',
      source: 'Amnesty International'
    },
    {
      category: 'journalists',
      name: 'Haze Fan',
      nationality: '🇨🇳 Chinese',
      occupation: 'Bloomberg Journalist',
      detained_since: '2020',
      status: 'DETAINED',
      description: 'Bloomberg News assistant detained on suspicion of endangering national security.',
      source: 'Committee to Protect Journalists'
    },
    {
      category: 'journalists',
      name: 'Cheng Lei',
      nationality: '🇦🇺 Australian',
      occupation: 'CGTN Anchor',
      detained_since: '2020',
      status: 'IMPRISONED',
      description: 'Australian journalist sentenced to 2 years 11 months for "supplying state secrets."',
      source: 'ABC Australia'
    },
    {
      category: 'business',
      name: 'Michael Spavor',
      nationality: '🇨🇦 Canadian',
      occupation: 'Businessman',
      detained_since: '2018',
      status: 'RELEASED 2021',
      description: 'Detained as retaliation for Meng Wanzhou arrest. Held for over 1,000 days.',
      source: 'Globe and Mail'
    },
    {
      category: 'business',
      name: 'Michael Kovrig',
      nationality: '🇨🇦 Canadian',
      occupation: 'Diplomat',
      detained_since: '2018',
      status: 'RELEASED 2021',
      description: 'Former diplomat detained as retaliation. Classic hostage diplomacy case.',
      source: 'Globe and Mail'
    },
    {
      category: 'business',
      name: 'Ian Stones',
      nationality: '🇬🇧 British',
      occupation: 'Geologist',
      detained_since: '2019',
      status: 'EXIT BAN',
      description: 'British geologist under exit ban for years over business dispute.',
      source: 'BBC'
    },
    {
      category: 'uyghur',
      name: 'Idris Hasan',
      nationality: '🇨🇳 Uyghur',
      occupation: 'IT Worker',
      detained_since: '2021',
      status: 'DETAINED (Morocco)',
      description: 'Uyghur detained in Morocco on Chinese Interpol notice. Facing extradition.',
      source: 'Amnesty International'
    },
    {
      category: 'uyghur',
      name: 'Yidiresi Aishan',
      nationality: '🇨🇳 Uyghur',
      occupation: 'Student',
      detained_since: '2021',
      status: 'DEPORTED',
      description: 'Uyghur student deported from Saudi Arabia to China despite asylum claim.',
      source: 'Human Rights Watch'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Cases', count: exitBanCases.length },
    { id: 'foreign_nationals', name: 'Foreign Nationals', count: exitBanCases.filter(c => c.category === 'foreign_nationals').length },
    { id: 'activists', name: 'Activists', count: exitBanCases.filter(c => c.category === 'activists').length },
    { id: 'journalists', name: 'Journalists', count: exitBanCases.filter(c => c.category === 'journalists').length },
    { id: 'business', name: 'Business People', count: exitBanCases.filter(c => c.category === 'business').length },
    { id: 'uyghur', name: 'Uyghurs', count: exitBanCases.filter(c => c.category === 'uyghur').length },
  ];

  const filteredCases = exitBanCases.filter(c => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status) => {
    if (status.includes('EXIT BAN')) return 'bg-red-600';
    if (status.includes('IMPRISONED') || status.includes('DETAINED')) return 'bg-red-700';
    if (status.includes('RELEASED')) return 'bg-green-600';
    if (status.includes('THREATENED')) return 'bg-yellow-600';
    if (status.includes('DEPORTED')) return 'bg-purple-600';
    return 'bg-slate-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-red-500 p-6">
        <h2 className="text-2xl font-bold text-white mb-2"><Ban className="w-6 h-6 inline mr-1" /> Exit Bans & Hostage Diplomacy</h2>
        <p className="text-slate-300">
          Tracking foreign nationals and Chinese citizens prevented from leaving China or detained abroad at China's request.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">{exitBanCases.filter(c => c.status.includes('EXIT BAN') || c.status.includes('DETAINED') || c.status.includes('IMPRISONED')).length}</div>
            <div className="text-xs text-slate-400">Currently Held</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{exitBanCases.filter(c => c.status.includes('RELEASED')).length}</div>
            <div className="text-xs text-slate-400">Released</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{new Set(exitBanCases.map(c => c.nationality.split(' ')[0])).size}</div>
            <div className="text-xs text-slate-400">Nationalities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">200+</div>
            <div className="text-xs text-slate-400">Estimated Total</div>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-900/30 border border-yellow-700 p-4">
        <h3 className="font-bold text-white mb-2"><AlertTriangle className="w-4 h-4 inline mr-1 text-yellow-400" /> Travel Warning</h3>
        <p className="text-slate-300 text-sm">
          China uses exit bans as a tool of coercion. Foreign nationals, especially those with Chinese heritage, 
          business disputes, or connections to activists, face heightened risk. The US, UK, Canada, and Australia 
          have all issued travel advisories warning of arbitrary detention in China.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <a href="https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/china-travel-advisory.html" 
             target="_blank" rel="noopener noreferrer"
             className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
            🇺🇸 US Advisory
          </a>
          <a href="https://www.gov.uk/foreign-travel-advice/china" 
             target="_blank" rel="noopener noreferrer"
             className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
            🇬🇧 UK Advisory
          </a>
          <a href="https://travel.gc.ca/destinations/china" 
             target="_blank" rel="noopener noreferrer"
             className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
            🇨🇦 Canada Advisory
          </a>
          <a href="https://www.smartraveller.gov.au/destinations/asia/china" 
             target="_blank" rel="noopener noreferrer"
             className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
            🇦🇺 Australia Advisory
          </a>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          aria-label="Search"
          type="text"
          placeholder="Search cases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-[#111820] border border-[#1c2a35] px-4 py-2 text-white"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white'
                  : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35]'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredCases.map((case_, i) => (
          <div key={i} className="bg-[#111820] border border-[#1c2a35] p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{case_.name}</h3>
                <p className="text-sm text-slate-400">{case_.nationality} • {case_.occupation}</p>
              </div>
              <span className={`${getStatusColor(case_.status)} text-white text-xs px-2 py-1 rounded font-bold`}>
                {case_.status}
              </span>
            </div>
            
            <p className="text-slate-300 text-sm mb-3">{case_.description}</p>
            
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Since: {case_.detained_since}</span>
              <span>Source: {case_.source}</span>
            </div>
          </div>
        ))}
      </div>

      {/* What You Can Do */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h3 className="text-xl font-bold text-white mb-4"><Megaphone className="w-5 h-5 inline mr-1" /> What You Can Do</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold text-white mb-2">Before Travel:</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Register with your embassy</li>
              <li>• Share itinerary with family</li>
              <li>• Research business partners</li>
              <li>• Avoid dual nationality issues</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Advocacy:</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Contact representatives</li>
              <li>• Support affected families</li>
              <li>• Share verified cases</li>
              <li>• Support travel advisories</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Resources:</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• <a href="https://safeguarddefenders.com" className="text-blue-400 hover:underline">Safeguard Defenders</a></li>
              <li>• <a href="https://www.dui-hua.org" className="text-blue-400 hover:underline">Dui Hua Foundation</a></li>
              <li>• <a href="https://www.cecc.gov" className="text-blue-400 hover:underline">CECC Database</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChinaExitBan;
