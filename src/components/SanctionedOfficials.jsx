import { useState } from 'react';

const SanctionedOfficials = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const officials = [
    // Xinjiang Officials
    {
      name: 'Chen Quanguo',
      chinese: '陈全国',
      position: 'Former Party Secretary of Xinjiang',
      category: 'xinjiang',
      sanctionedBy: ['US', 'UK', 'EU', 'Canada'],
      sanctionDate: '2020-07-09',
      reason: 'Architect of mass detention and surveillance of Uyghurs in Xinjiang. Implemented the concentration camp system.',
      status: 'ACTIVE',
      details: 'Oversaw construction of hundreds of detention facilities. Previously implemented similar tactics in Tibet.'
    },
    {
      name: 'Zhu Hailun',
      chinese: '朱海仑',
      position: 'Former Deputy Secretary of Xinjiang',
      category: 'xinjiang',
      sanctionedBy: ['US', 'UK', 'EU', 'Canada'],
      sanctionDate: '2020-07-09',
      reason: 'Responsible for security apparatus in Xinjiang, including mass surveillance and detention.',
      status: 'ACTIVE',
      details: 'Key figure in implementing the Strike Hard campaign against Uyghurs.'
    },
    {
      name: 'Wang Junzheng',
      chinese: '王君正',
      position: 'Party Secretary of Xinjiang Production and Construction Corps',
      category: 'xinjiang',
      sanctionedBy: ['US', 'UK', 'EU', 'Canada'],
      sanctionDate: '2020-07-31',
      reason: 'Oversees forced labor programs in Xinjiang through the XPCC paramilitary organization.',
      status: 'ACTIVE',
      details: 'XPCC controls significant agricultural and industrial production using forced labor.'
    },
    {
      name: 'Chen Mingguo',
      chinese: '陈明国',
      position: 'Director of Xinjiang Public Security Bureau',
      category: 'xinjiang',
      sanctionedBy: ['US', 'UK', 'EU'],
      sanctionDate: '2020-07-09',
      reason: 'Oversees police operations and detention facilities in Xinjiang.',
      status: 'ACTIVE',
      details: 'Responsible for the security apparatus implementing mass detention.'
    },
    {
      name: 'Wang Mingshan',
      chinese: '王明山',
      position: 'Former Director of Xinjiang Public Security Bureau',
      category: 'xinjiang',
      sanctionedBy: ['US'],
      sanctionDate: '2021-03-22',
      reason: 'Involvement in serious human rights abuses against Uyghurs.',
      status: 'ACTIVE',
      details: 'Part of the security leadership implementing repression in Xinjiang.'
    },
    // Hong Kong Officials
    {
      name: 'Carrie Lam',
      chinese: '林郑月娥',
      position: 'Former Chief Executive of Hong Kong',
      category: 'hongkong',
      sanctionedBy: ['US'],
      sanctionDate: '2020-08-07',
      reason: 'Implementing policies that undermined Hong Kong autonomy and suppressed freedom.',
      status: 'ACTIVE',
      details: 'Led Hong Kong during the 2019 protests and implementation of the National Security Law.'
    },
    {
      name: 'Chris Tang',
      chinese: '邓炳强',
      position: 'Secretary for Security, Hong Kong',
      category: 'hongkong',
      sanctionedBy: ['US'],
      sanctionDate: '2020-08-07',
      reason: 'Oversaw police crackdown on pro-democracy protesters.',
      status: 'ACTIVE',
      details: 'Former Commissioner of Police during 2019 protests. Now leads security apparatus.'
    },
    {
      name: 'Stephen Lo',
      chinese: '卢伟聪',
      position: 'Former Commissioner of Police, Hong Kong',
      category: 'hongkong',
      sanctionedBy: ['US'],
      sanctionDate: '2020-08-07',
      reason: 'Led police during initial 2019 protest crackdown.',
      status: 'ACTIVE',
      details: 'Oversaw controversial police tactics during early protests.'
    },
    {
      name: 'John Lee',
      chinese: '李家超',
      position: 'Chief Executive of Hong Kong',
      category: 'hongkong',
      sanctionedBy: ['US'],
      sanctionDate: '2020-08-07',
      reason: 'Key role in implementing National Security Law and suppressing dissent.',
      status: 'ACTIVE',
      details: 'Former Security Secretary, now Chief Executive. Oversaw mass arrests under NSL.'
    },
    {
      name: 'Teresa Cheng',
      chinese: '郑若骅',
      position: 'Former Secretary for Justice, Hong Kong',
      category: 'hongkong',
      sanctionedBy: ['US'],
      sanctionDate: '2020-08-07',
      reason: 'Prosecuted pro-democracy activists and implemented NSL.',
      status: 'ACTIVE',
      details: 'Led prosecutions of thousands of protesters and activists.'
    },
    {
      name: 'Erick Tsang',
      chinese: '曾国卫',
      position: 'Secretary for Constitutional and Mainland Affairs',
      category: 'hongkong',
      sanctionedBy: ['US'],
      sanctionDate: '2020-11-09',
      reason: 'Implementing Beijing\'s policies to undermine Hong Kong autonomy.',
      status: 'ACTIVE',
      details: 'Key figure in electoral "reforms" that eliminated democratic opposition.'
    },
    // Central Government
    {
      name: 'Xia Baolong',
      chinese: '夏宝龙',
      position: 'Director of Hong Kong and Macau Affairs Office',
      category: 'central',
      sanctionedBy: ['US'],
      sanctionDate: '2020-11-09',
      reason: 'Overseeing Beijing\'s policy to undermine Hong Kong autonomy.',
      status: 'ACTIVE',
      details: 'Central government official directing Hong Kong policy from Beijing.'
    },
    {
      name: 'Zhang Xiaoming',
      chinese: '张晓明',
      position: 'Deputy Director of Hong Kong and Macau Affairs Office',
      category: 'central',
      sanctionedBy: ['US'],
      sanctionDate: '2020-11-09',
      reason: 'Key role in formulating policies to suppress Hong Kong freedoms.',
      status: 'ACTIVE',
      details: 'Long-time Beijing official involved in Hong Kong affairs.'
    },
    {
      name: 'Luo Huining',
      chinese: '骆惠宁',
      position: 'Director of Liaison Office in Hong Kong',
      category: 'central',
      sanctionedBy: ['US'],
      sanctionDate: '2020-08-07',
      reason: 'Beijing\'s top representative in Hong Kong, implementing CCP control.',
      status: 'ACTIVE',
      details: 'Oversees Beijing\'s direct involvement in Hong Kong affairs.'
    },
    // Tibet Officials
    {
      name: 'Wu Yingjie',
      chinese: '吴英杰',
      position: 'Party Secretary of Tibet',
      category: 'tibet',
      sanctionedBy: ['US'],
      sanctionDate: '2020-07-09',
      reason: 'Responsible for repression of Tibetan religious and cultural practices.',
      status: 'ACTIVE',
      details: 'Oversees policies restricting Tibetan Buddhism and cultural expression.'
    },
    {
      name: 'Zhang Hongbo',
      chinese: '张洪波',
      position: 'Director of Tibet Public Security Bureau',
      category: 'tibet',
      sanctionedBy: ['US'],
      sanctionDate: '2020-07-09',
      reason: 'Oversees security operations suppressing Tibetan dissent.',
      status: 'ACTIVE',
      details: 'Leads police operations targeting Tibetan activists and religious figures.'
    },
    // Surveillance/Tech
    {
      name: 'Hikvision Executives',
      chinese: '海康威视',
      position: 'Surveillance Technology Company',
      category: 'tech',
      sanctionedBy: ['US'],
      sanctionDate: '2019-10-07',
      reason: 'Providing surveillance technology used in Xinjiang detention camps.',
      status: 'ENTITY LIST',
      details: 'World\'s largest surveillance camera manufacturer. Equipment used in camps.'
    },
    {
      name: 'SenseTime Executives',
      chinese: '商汤科技',
      position: 'AI/Facial Recognition Company',
      category: 'tech',
      sanctionedBy: ['US'],
      sanctionDate: '2021-12-10',
      reason: 'Developing facial recognition technology used to surveil Uyghurs.',
      status: 'ENTITY LIST',
      details: 'AI company whose technology enables ethnic profiling in Xinjiang.'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Officials', count: officials.length },
    { id: 'xinjiang', name: 'Xinjiang', count: officials.filter(o => o.category === 'xinjiang').length },
    { id: 'hongkong', name: 'Hong Kong', count: officials.filter(o => o.category === 'hongkong').length },
    { id: 'central', name: 'Central Govt', count: officials.filter(o => o.category === 'central').length },
    { id: 'tibet', name: 'Tibet', count: officials.filter(o => o.category === 'tibet').length },
    { id: 'tech', name: 'Tech/Surveillance', count: officials.filter(o => o.category === 'tech').length },
  ];

  const filteredOfficials = officials.filter(official => {
    const matchesSearch = searchQuery === '' || 
      official.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      official.chinese.includes(searchQuery) ||
      official.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || official.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFlagEmoji = (country) => {
    const flags = { 'US': '🇺🇸', 'UK': '🇬🇧', 'EU': '🇪🇺', 'Canada': '🇨🇦', 'Australia': '🇦🇺' };
    return flags[country] || country;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-700/50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">🎯 Sanctioned CCP Officials</h2>
        <p className="text-slate-300">
          {officials.length} officials and entities under Magnitsky sanctions for human rights abuses.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇺🇸</span>
            <span className="text-slate-300">US Global Magnitsky Act</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇬🇧</span>
            <span className="text-slate-300">UK Magnitsky Sanctions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇪🇺</span>
            <span className="text-slate-300">EU Human Rights Sanctions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇨🇦</span>
            <span className="text-slate-300">Canada Magnitsky Act</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by name, position, or Chinese characters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* Officials Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredOfficials.map((official, index) => (
          <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-red-500/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-white text-lg">{official.name}</h3>
                <p className="text-red-400">{official.chinese}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                official.status === 'ACTIVE' ? 'bg-red-600 text-white' : 'bg-orange-600 text-white'
              }`}>
                {official.status}
              </span>
            </div>
            
            <p className="text-sm text-slate-400 mb-2">{official.position}</p>
            
            <p className="text-sm text-slate-300 mb-3">{official.reason}</p>
            
            {/* Sanctioned By */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-slate-500">Sanctioned by:</span>
              <div className="flex gap-1">
                {official.sanctionedBy.map((country, i) => (
                  <span key={i} className="text-lg" title={country}>
                    {getFlagEmoji(country)}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Details */}
            <div className="bg-slate-900/50 rounded p-2 text-xs text-slate-400">
              <p><strong className="text-slate-300">Details:</strong> {official.details}</p>
              <p className="mt-1"><strong className="text-slate-300">Sanction Date:</strong> {official.sanctionDate}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <h3 className="font-semibold text-white mb-2">📢 Advocate for More Sanctions</h3>
        <p className="text-sm text-slate-300 mb-3">
          Many CCP officials responsible for human rights abuses remain unsanctioned. Contact your representatives to demand action.
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://www.cecc.gov/resources/executive-branch-tools-to-address-human-rights-abuses-in-china"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            CECC Sanctions Resources →
          </a>
          <a
            href="https://home.treasury.gov/policy-issues/financial-sanctions/specially-designated-nationals-and-blocked-persons-list-sdn-human-readable-lists"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            US Treasury SDN List →
          </a>
        </div>
      </div>
    </div>
  );
};

export default SanctionedOfficials;
