import React, { useState, useEffect } from 'react';
import { Image, Mountain, BarChart3, Megaphone, Umbrella, Palette, Handshake, Droplets, Flag, Satellite, Folder, Shield, Flame, Zap, Map, Link2, Calendar, ClipboardList, Flower2, User, FileText, Landmark } from 'lucide-react';

const MediaGallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') setSelectedItem(null); };
    if (selectedItem) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedItem]);

  const categories = [
    { id: 'all', name: 'All Media', Icon: Image },
    { id: 'hongkong', name: 'Hong Kong', icon: '🇭🇰' },
    { id: 'uyghur', name: 'Uyghur', Icon: Landmark },
    { id: 'tibet', name: 'Tibet', Icon: Mountain },
    { id: 'infographic', name: 'Infographics', Icon: BarChart3 },
    { id: 'symbol', name: 'Symbols', Icon: Megaphone },
  ];

  const mediaItems = [
    // Hong Kong
    {
      id: 1,
      category: 'hongkong',
      title: 'Umbrella Movement 2014',
      description: 'Protesters using umbrellas as shields against tear gas during the 2014 Occupy Central movement',
      year: '2014',
      type: 'photo',
      Icon: Umbrella,
      significance: 'The umbrella became a symbol of peaceful resistance in Hong Kong',
      tags: ['protest', 'umbrella', 'occupy'],
    },
    {
      id: 2,
      category: 'hongkong',
      title: 'Lennon Walls',
      description: 'Colorful post-it note walls with messages of hope and resistance appeared across Hong Kong',
      year: '2019',
      type: 'photo',
      Icon: Palette,
      significance: 'Named after the John Lennon Wall in Prague, these became symbols of free expression',
      tags: ['art', 'messages', 'democracy'],
    },
    {
      id: 3,
      category: 'hongkong',
      title: 'Human Chain',
      description: 'Hong Kong Way - 40km human chain across the city on the 30th anniversary of the Baltic Way',
      year: '2019',
      type: 'photo',
      Icon: Handshake,
      significance: 'Estimated 210,000 people formed a chain across Hong Kong',
      tags: ['solidarity', 'chain', 'anniversary'],
    },
    {
      id: 4,
      category: 'hongkong',
      title: 'Be Water',
      description: 'Protesters practicing "be water" tactics - fluid, formless, and adaptive',
      year: '2019',
      type: 'photo',
      Icon: Droplets,
      significance: 'Inspired by Bruce Lee\'s philosophy, protesters adapted quickly to police movements',
      tags: ['tactics', 'bruce lee', 'movement'],
    },
    
    // Uyghur
    {
      id: 5,
      category: 'uyghur',
      title: 'East Turkestan Flag',
      description: 'The blue flag with white crescent and star represents Uyghur identity and aspirations',
      year: 'Historical',
      type: 'symbol',
      Icon: Flag,
      significance: 'Symbol of Uyghur national identity, banned in China',
      tags: ['flag', 'identity', 'symbol'],
    },
    {
      id: 6,
      category: 'uyghur',
      title: 'Camp Satellite Images',
      description: 'Satellite imagery showing the construction and expansion of detention facilities',
      year: '2018-2020',
      type: 'evidence',
      Icon: Satellite,
      significance: 'ASPI documented over 380 detention facilities using satellite imagery',
      tags: ['evidence', 'satellite', 'camps'],
    },
    {
      id: 7,
      category: 'uyghur',
      title: 'Xinjiang Police Files',
      description: 'Leaked photos showing detained Uyghurs, including children and elderly',
      year: '2022',
      type: 'evidence',
      Icon: Folder,
      significance: 'First visual evidence of mass detention, leaked by hackers',
      tags: ['leak', 'evidence', 'detention'],
    },
    
    // Tibet
    {
      id: 8,
      category: 'tibet',
      title: 'Tibetan National Flag',
      description: 'The snow lion flag represents Tibetan independence and cultural identity',
      year: 'Historical',
      type: 'symbol',
      Icon: Shield,
      significance: 'Displaying this flag in Tibet can result in imprisonment',
      tags: ['flag', 'snow lion', 'independence'],
    },
    {
      id: 9,
      category: 'tibet',
      title: 'Self-Immolation Protests',
      description: 'Memorial images honoring Tibetans who self-immolated in protest',
      year: '2009-present',
      type: 'memorial',
      Icon: Flame,
      significance: 'Over 160 Tibetans have self-immolated since 2009',
      tags: ['memorial', 'sacrifice', 'protest'],
    },
    {
      id: 10,
      category: 'tibet',
      title: 'Free Tibet Protests',
      description: 'Global protests during the 2008 Beijing Olympics torch relay',
      year: '2008',
      type: 'photo',
      Icon: Zap,
      significance: 'Brought international attention to Tibet during the Olympics',
      tags: ['olympics', 'torch', 'global'],
    },
    
    // Infographics
    {
      id: 11,
      category: 'infographic',
      title: 'Overseas Police Stations Map',
      description: 'Visual map showing the global spread of CCP police stations',
      year: '2022',
      type: 'infographic',
      Icon: Map,
      significance: '102+ stations documented in 53 countries',
      tags: ['map', 'police', 'global'],
    },
    {
      id: 12,
      category: 'infographic',
      title: 'Forced Labor Supply Chain',
      description: 'Infographic showing how Uyghur forced labor enters global supply chains',
      year: '2020',
      type: 'infographic',
      Icon: Link2,
      significance: 'Documents connections between detention and major brands',
      tags: ['supply chain', 'brands', 'labor'],
    },
    {
      id: 13,
      category: 'infographic',
      title: 'NSL Impact Timeline',
      description: 'Timeline showing the impact of Hong Kong\'s National Security Law',
      year: '2020-2024',
      type: 'infographic',
      Icon: Calendar,
      significance: 'Documents the systematic dismantling of Hong Kong freedoms',
      tags: ['timeline', 'nsl', 'impact'],
    },
    {
      id: 14,
      category: 'infographic',
      title: 'Genocide Evidence Summary',
      description: 'Visual summary of evidence supporting genocide determination',
      year: '2021',
      type: 'infographic',
      Icon: ClipboardList,
      significance: 'Compiled from Newlines Institute report and Uyghur Tribunal',
      tags: ['genocide', 'evidence', 'legal'],
    },
    
    // Symbols
    {
      id: 15,
      category: 'symbol',
      title: 'Yellow Umbrella',
      description: 'Symbol of Hong Kong\'s pro-democracy movement',
      year: '2014',
      type: 'symbol',
      Icon: Umbrella,
      significance: 'Represents peaceful resistance and protection',
      tags: ['umbrella', 'yellow', 'democracy'],
    },
    {
      id: 16,
      category: 'symbol',
      title: 'Bauhinia Flower (Wilted)',
      description: 'The wilted bauhinia represents Hong Kong\'s fading freedoms',
      year: '2019',
      type: 'symbol',
      Icon: Flower2,
      significance: 'Contrast to the official Hong Kong emblem',
      tags: ['flower', 'freedom', 'hong kong'],
    },
    {
      id: 17,
      category: 'symbol',
      title: 'Tank Man',
      description: 'The iconic image of a man standing before tanks at Tiananmen',
      year: '1989',
      type: 'symbol',
      Icon: User,
      significance: 'One of the most iconic images of peaceful resistance',
      tags: ['tiananmen', 'courage', 'iconic'],
    },
    {
      id: 18,
      category: 'symbol',
      title: 'Blank Paper',
      description: 'White A4 paper became a symbol of protest against censorship',
      year: '2022',
      type: 'symbol',
      Icon: FileText,
      significance: 'Used in protests against zero-COVID and censorship',
      tags: ['censorship', 'protest', 'white paper'],
    },
  ];

  const filteredItems = activeCategory === 'all'
    ? mediaItems
    : mediaItems.filter(item => item.category === activeCategory);

  const getCategoryInfo = (categoryId) => categories.find(c => c.id === categoryId);

  const typeColors = {
    photo: 'bg-blue-900/30 border-blue-700/50',
    symbol: 'bg-purple-900/30 border-purple-700/50',
    infographic: 'bg-green-900/30 border-green-700/50',
    evidence: 'bg-red-900/30 border-red-700/50',
    memorial: 'bg-yellow-900/30 border-yellow-700/50',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-indigo-500 p-6">
        <div className="flex items-center mb-4">
          <Image className="w-8 h-8 text-slate-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-white">Media Gallery</h2>
            <p className="text-slate-400">Visual documentation of resistance and repression</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          Images, symbols, and infographics that document the struggle for freedom. 
          These visuals tell stories that words alone cannot convey.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-indigo-600 text-white'
                : 'bg-[#111820] text-slate-300 hover:bg-[#111820]'
            }`}
          >
            {cat.Icon ? <cat.Icon className="w-4 h-4" /> : <span>{cat.icon}</span>}
            <span>{cat.name}</span>
            <span className="text-xs opacity-70">
              ({mediaItems.filter(i => cat.id === 'all' || i.category === cat.id).length})
            </span>
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => {
          const categoryInfo = getCategoryInfo(item.category);
          
          return (
            <div 
              key={item.id}
              className={`border p-4 cursor-pointer hover:scale-105 transition-transform ${typeColors[item.type]}`}
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-center justify-between mb-3">
                <item.Icon className="w-10 h-10 text-slate-300" />
                <div className="text-right">
                  <span className="text-xs px-2 py-0.5 bg-[#111820] rounded text-slate-300">
                    {item.type}
                  </span>
                  <div className="text-xs text-slate-500 mt-1">{item.year}</div>
                </div>
              </div>
              
              <h3 className="font-bold text-white mb-1">{item.title}</h3>
              <p className="text-sm text-slate-400 mb-2 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  {categoryInfo?.Icon ? <categoryInfo.Icon className="w-3 h-3" /> : categoryInfo?.icon} {categoryInfo?.name}
                </span>
                <span className="text-xs text-indigo-400">View details →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Media detail: ${selectedItem.title}`}
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className={`max-w-lg w-full border p-6 ${typeColors[selectedItem.type]}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <selectedItem.Icon className="w-12 h-12 text-slate-300" />
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{selectedItem.title}</h3>
            <p className="text-slate-300 mb-4">{selectedItem.description}</p>
            
            <div className="bg-[#0a0e14]/50 p-3 mb-4">
              <h4 className="text-sm font-medium text-white mb-1">Significance</h4>
              <p className="text-sm text-slate-400">{selectedItem.significance}</p>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Year: {selectedItem.year}</span>
              <div className="flex flex-wrap gap-1">
                {selectedItem.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-[#111820] rounded text-xs text-slate-400">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Usage Note */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
        <h3 className="font-medium text-white mb-2 flex items-center gap-1"><ClipboardList className="w-4 h-4" /> Using These Images</h3>
        <p className="text-sm text-slate-400">
          These descriptions represent historical events and symbols. When sharing visual content, 
          always credit original sources and photographers. Many images are available through 
          news archives, human rights organizations, and creative commons sources.
        </p>
      </div>
    </div>
  );
};

export default MediaGallery;
