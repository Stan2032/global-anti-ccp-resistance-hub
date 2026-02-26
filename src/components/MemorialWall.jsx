import React, { useState, useEffect } from 'react';
import { Heart, Calendar, MapPin, Search, Filter, Flame, ChevronDown } from 'lucide-react';
import { SourcesList } from './ui/SourceAttribution';

const victims = [
  // Tiananmen Square
  {
    id: 1,
    name: 'Wang Weilin',
    chineseName: '王维林',
    aka: 'Tank Man',
    dateOfDeath: null,
    yearOfDeath: '1989 (presumed)',
    placeOfDeath: 'Beijing',
    cause: 'Tiananmen Square',
    category: 'Tiananmen',
    description: 'The unknown protester who stood in front of tanks on June 5, 1989. His fate remains unknown.',
    image: null,
    verified: false,
    source: 'Historical records',
  },
  {
    id: 2,
    name: 'Jiang Jielian',
    chineseName: '蒋捷连',
    dateOfDeath: '1989-06-03',
    yearOfDeath: '1989',
    placeOfDeath: 'Beijing',
    cause: 'Tiananmen Square Massacre',
    category: 'Tiananmen',
    description: '17-year-old high school student killed during the Tiananmen Square massacre. Son of Tiananmen Mothers founder Ding Zilin.',
    image: null,
    verified: true,
    source: 'Tiananmen Mothers',
  },
  // Uyghur Victims
  {
    id: 3,
    name: 'Abdulghafur Hapiz',
    dateOfDeath: '2018-05-27',
    yearOfDeath: '2018',
    placeOfDeath: 'Xinjiang',
    cause: 'Died in detention',
    category: 'Uyghur',
    description: 'Uyghur poet and writer who died in a Xinjiang internment camp. His poetry celebrated Uyghur culture.',
    image: null,
    verified: true,
    source: 'Xinjiang Victims Database',
  },
  {
    id: 4,
    name: 'Abdurehim Heyit',
    chineseName: null,
    dateOfDeath: null,
    yearOfDeath: 'Unknown',
    placeOfDeath: 'Xinjiang',
    cause: 'Detained, fate unknown',
    category: 'Uyghur',
    description: 'Famous Uyghur musician and dutar player. Detained in 2017, reported dead in 2019 though China released a video claiming he was alive.',
    image: null,
    verified: false,
    source: 'RFA, Xinjiang Victims Database',
  },
  {
    id: 5,
    name: 'Mihrigul Tursun\'s Infant Son',
    dateOfDeath: '2015',
    yearOfDeath: '2015',
    placeOfDeath: 'Xinjiang',
    cause: 'Medical neglect in detention',
    category: 'Uyghur',
    description: 'Three-month-old infant who died after being separated from his mother Mihrigul Tursun during her detention.',
    image: null,
    verified: true,
    source: 'Congressional testimony',
  },
  // Tibetan Self-Immolations
  {
    id: 6,
    name: 'Tapey',
    dateOfDeath: '2009-02-27',
    yearOfDeath: '2009',
    placeOfDeath: 'Ngaba, Tibet',
    cause: 'Self-immolation',
    category: 'Tibet',
    description: 'First known Tibetan self-immolation in protest of Chinese rule. A monk from Kirti Monastery.',
    image: null,
    verified: true,
    source: 'ICT, Free Tibet',
  },
  {
    id: 7,
    name: 'Tsewang Norbu',
    dateOfDeath: '2022-02-25',
    yearOfDeath: '2022',
    placeOfDeath: 'Lhasa, Tibet',
    cause: 'Self-immolation',
    category: 'Tibet',
    description: 'Popular Tibetan singer who self-immolated in front of the Potala Palace in Lhasa.',
    image: null,
    verified: true,
    source: 'RFA, ICT',
  },
  {
    id: 8,
    name: 'Tenzin Delek Rinpoche',
    chineseName: null,
    dateOfDeath: '2015-07-12',
    yearOfDeath: '2015',
    placeOfDeath: 'Chuandong Prison',
    cause: 'Died in prison',
    category: 'Tibet',
    description: 'Prominent Tibetan Buddhist lama who died in Chinese prison after 13 years of imprisonment on disputed charges.',
    image: null,
    verified: true,
    source: 'ICT, Free Tibet',
  },
  // Hong Kong
  {
    id: 9,
    name: 'Marco Leung Ling-kit',
    chineseName: '梁凌杰',
    dateOfDeath: '2019-06-15',
    yearOfDeath: '2019',
    placeOfDeath: 'Hong Kong',
    cause: 'Fell during protest',
    category: 'Hong Kong',
    description: '35-year-old protester who fell from a building while displaying anti-extradition bill banners. First death of the 2019 protests.',
    image: null,
    verified: true,
    source: 'HKFP, media reports',
  },
  {
    id: 10,
    name: 'Chow Tsz-lok',
    chineseName: '周梓樂',
    dateOfDeath: '2019-11-08',
    yearOfDeath: '2019',
    placeOfDeath: 'Hong Kong',
    cause: 'Fell during police operation',
    category: 'Hong Kong',
    description: '22-year-old HKUST student who fell from a parking garage during a police operation. His death sparked widespread protests.',
    image: null,
    verified: true,
    source: 'HKFP, media reports',
  },
  // Dissidents
  {
    id: 11,
    name: 'Liu Xiaobo',
    chineseName: '刘晓波',
    dateOfDeath: '2017-07-13',
    yearOfDeath: '2017',
    placeOfDeath: 'Shenyang',
    cause: 'Liver cancer (denied treatment abroad)',
    category: 'Dissident',
    description: 'Nobel Peace Prize laureate and Charter 08 author. Died in custody after being denied permission to seek treatment abroad.',
    image: null,
    verified: true,
    source: 'Nobel Committee, media reports',
  },
  {
    id: 12,
    name: 'Cao Shunli',
    chineseName: '曹顺利',
    dateOfDeath: '2014-03-14',
    yearOfDeath: '2014',
    placeOfDeath: 'Beijing',
    cause: 'Medical neglect in detention',
    category: 'Dissident',
    description: 'Human rights activist who died after being denied medical treatment while in detention.',
    image: null,
    verified: true,
    source: 'Human Rights Watch, Amnesty',
  },
  {
    id: 13,
    name: 'Li Wangyang',
    chineseName: '李旺阳',
    dateOfDeath: '2012-06-06',
    yearOfDeath: '2012',
    placeOfDeath: 'Shaoyang, Hunan',
    cause: 'Suspicious death (ruled suicide)',
    category: 'Dissident',
    description: 'Labor activist who spent 22 years in prison for Tiananmen activism. Found hanged in suspicious circumstances.',
    image: null,
    verified: true,
    source: 'Media reports, HKFP',
  },
  // Falun Gong
  {
    id: 14,
    name: 'Chen Zixiu',
    chineseName: '陈子秀',
    dateOfDeath: '2000-02-21',
    yearOfDeath: '2000',
    placeOfDeath: 'Weifang, Shandong',
    cause: 'Torture in detention',
    category: 'Falun Gong',
    description: '58-year-old Falun Gong practitioner beaten to death in detention. Her case was reported by the Wall Street Journal.',
    image: null,
    verified: true,
    source: 'Wall Street Journal, Falun Dafa Info',
  },
  // Organ Harvesting Victims
  {
    id: 15,
    name: 'Unknown Prisoners of Conscience',
    dateOfDeath: 'Ongoing',
    yearOfDeath: '1999-present',
    placeOfDeath: 'China',
    cause: 'Forced organ harvesting',
    category: 'Organ Harvesting',
    description: 'Estimated 60,000-100,000 prisoners of conscience killed for their organs annually, primarily Falun Gong practitioners and Uyghurs.',
    image: null,
    verified: true,
    source: 'China Tribunal, Kilgour-Matas Report',
  },
];

const categories = ['All', 'Tiananmen', 'Uyghur', 'Tibet', 'Hong Kong', 'Dissident', 'Falun Gong', 'Organ Harvesting'];

export default function MemorialWall() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVictim, setSelectedVictim] = useState(null);
  const [candlesLit, setCandlesLit] = useState(() => {
    const saved = localStorage.getItem('memorial-candles');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') setSelectedVictim(null); };
    if (selectedVictim) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedVictim]);

  const filteredVictims = victims.filter(victim => {
    if (selectedCategory !== 'All' && victim.category !== selectedCategory) return false;
    if (searchQuery && !victim.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const lightCandle = (victimId) => {
    if (!candlesLit.includes(victimId)) {
      const newCandles = [...candlesLit, victimId];
      setCandlesLit(newCandles);
      localStorage.setItem('memorial-candles', JSON.stringify(newCandles));
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Tiananmen': 'bg-red-600',
      'Uyghur': 'bg-[#22d3ee]',
      'Tibet': 'bg-orange-600',
      'Hong Kong': 'bg-yellow-600',
      'Dissident': 'bg-purple-600',
      'Falun Gong': 'bg-green-600',
      'Organ Harvesting': 'bg-gray-600',
    };
    return colors[category] || 'bg-gray-600';
  };

  const totalSelfImmolations = 157; // Documented Tibetan self-immolations
  const tiananmenDeaths = '数百至数千'; // Hundreds to thousands

  return (
    <div className="bg-[#111820]/50 border border-[#1c2a35]">
      {/* Header */}
      <div className="p-6 border-b border-[#1c2a35] bg-[#111820]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#111820] rounded-full flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Memorial Wall</h2>
            <p className="text-sm text-slate-400">Remembering those who lost their lives</p>
          </div>
        </div>
        
        <p className="text-slate-300 text-sm mb-4">
          This memorial honors the victims of CCP repression—those killed in massacres, 
          who died in detention, who self-immolated in protest, or whose organs were harvested. 
          Their sacrifice must never be forgotten.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#0a0e14]/50 p-3 text-center">
            <p className="text-lg font-bold text-red-400">{tiananmenDeaths}</p>
            <p className="text-xs text-slate-500">Tiananmen 1989</p>
          </div>
          <div className="bg-[#0a0e14]/50 p-3 text-center">
            <p className="text-lg font-bold text-orange-400">{totalSelfImmolations}+</p>
            <p className="text-xs text-slate-500">Tibetan Self-Immolations</p>
          </div>
          <div className="bg-[#0a0e14]/50 p-3 text-center">
            <p className="text-lg font-bold text-[#22d3ee]">Unknown</p>
            <p className="text-xs text-slate-500">Uyghur Deaths in Camps</p>
          </div>
          <div className="bg-[#0a0e14]/50 p-3 text-center">
            <p className="text-lg font-bold text-purple-400">60,000+/yr</p>
            <p className="text-xs text-slate-500">Organ Harvesting Est.</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-[#1c2a35] flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            aria-label="Search"
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#111820] border border-[#1c2a35] text-white placeholder-slate-400"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#22d3ee] text-[#0a0e14]'
                  : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Memorial Cards */}
      <div className="p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVictims.map(victim => (
            <div
              key={victim.id}
              className="bg-[#0a0e14]/50 border border-[#1c2a35] overflow-hidden hover:border-[#2a9a52] transition-colors"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getCategoryColor(victim.category)}`}>
                      {victim.category}
                    </span>
                  </div>
                  {victim.verified && (
                    <span className="text-xs text-green-400">✓ Verified</span>
                  )}
                </div>
                
                <h3 className="text-white font-semibold text-lg">{victim.name}</h3>
                {victim.chineseName && (
                  <p className="text-slate-500 text-sm">{victim.chineseName}</p>
                )}
                {victim.aka && (
                  <p className="text-slate-400 text-sm italic">"{victim.aka}"</p>
                )}
                
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {victim.yearOfDeath}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {victim.placeOfDeath}
                  </span>
                </div>
                
                <p className="text-slate-400 text-sm mt-3 line-clamp-3">{victim.description}</p>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1c2a35]">
                  <button
                    onClick={() => lightCandle(victim.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                      candlesLit.includes(victim.id)
                        ? 'bg-orange-600/20 text-orange-400'
                        : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35]'
                    }`}
                  >
                    <Flame className={`w-4 h-4 ${candlesLit.includes(victim.id) ? 'animate-pulse' : ''}`} />
                    {candlesLit.includes(victim.id) ? 'Candle Lit' : 'Light a Candle'}
                  </button>
                  <button
                    onClick={() => setSelectedVictim(victim)}
                    className="text-[#22d3ee] hover:text-[#22d3ee] text-sm"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVictims.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Flame className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No victims match your search</p>
          </div>
        )}
      </div>

      {/* Candles Lit Counter */}
      <div className="p-4 border-t border-[#1c2a35] bg-[#0a0e14]/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-slate-300">
              <strong className="text-white">{candlesLit.length}</strong> candles lit in remembrance
            </span>
          </div>
          <p className="text-xs text-slate-500">Your tributes are saved locally</p>
        </div>
      </div>

      {/* Resources */}
      <div className="p-6 border-t border-[#1c2a35]">
        <SourcesList
          sources={[
            {
              name: 'Tiananmen Mothers',
              url: 'http://www.tiananmenmother.org/',
              type: 'NGO Report',
              organization: 'Tiananmen Mothers',
              verified: true,
              description: 'Documenting victims of the 1989 Tiananmen Square massacre.',
            },
            {
              name: 'Xinjiang Victims Database',
              url: 'https://shahit.biz/eng/',
              type: 'NGO Report',
              organization: 'Shahit.biz',
              verified: true,
              description: '35,000+ documented cases of Uyghur victims of persecution.',
            },
            {
              name: 'ICT Self-Immolation List',
              url: 'https://savetibet.org/resources/self-immolations-by-tibetans/',
              type: 'NGO Report',
              organization: 'International Campaign for Tibet',
              verified: true,
              description: 'Comprehensive list of Tibetan self-immolation protests.',
            },
          ]}
          title="Memorial Resources"
        />
      </div>

      {/* Detail Modal */}
      {selectedVictim && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Memorial details for ${selectedVictim.name}`} onClick={() => setSelectedVictim(null)}>
          <div className="bg-[#111820] max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#1c2a35]" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getCategoryColor(selectedVictim.category)}`}>
                {selectedVictim.category}
              </span>
              
              <h3 className="text-2xl font-bold text-white mt-3">{selectedVictim.name}</h3>
              {selectedVictim.chineseName && (
                <p className="text-slate-400">{selectedVictim.chineseName}</p>
              )}
              {selectedVictim.aka && (
                <p className="text-slate-500 italic">Also known as: "{selectedVictim.aka}"</p>
              )}
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-slate-500">Date of Death</p>
                  <p className="text-white">{selectedVictim.dateOfDeath || selectedVictim.yearOfDeath}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="text-white">{selectedVictim.placeOfDeath}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Cause</p>
                  <p className="text-white">{selectedVictim.cause}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-xs text-slate-500 mb-1">Story</p>
                <p className="text-slate-300">{selectedVictim.description}</p>
              </div>
              
              <div className="mt-4">
                <p className="text-xs text-slate-500 mb-1">Source</p>
                <p className="text-slate-400 text-sm">{selectedVictim.source}</p>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => lightCandle(selectedVictim.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 transition-colors ${
                    candlesLit.includes(selectedVictim.id)
                      ? 'bg-orange-600 text-white'
                      : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35]'
                  }`}
                >
                  <Flame className={`w-5 h-5 ${candlesLit.includes(selectedVictim.id) ? 'animate-pulse' : ''}`} />
                  {candlesLit.includes(selectedVictim.id) ? 'Candle Lit' : 'Light a Candle'}
                </button>
                <button
                  onClick={() => setSelectedVictim(null)}
                  className="px-4 py-2 bg-[#111820] hover:bg-[#1c2a35] text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
