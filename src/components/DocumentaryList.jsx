import { useState } from 'react';
import GlobalDisclaimer from './ui/GlobalDisclaimer';
import { Film } from 'lucide-react';

const DocumentaryList = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const documentaries = [
    {
      title: 'The Dissident',
      year: 2020,
      director: 'Bryan Fogel',
      category: 'transnational',
      runtime: '119 min',
      description: 'Investigation into the murder of journalist Jamal Khashoggi, with parallels to CCP transnational repression tactics.',
      whereToWatch: ['Hulu', 'Amazon Prime'],
      rating: '7.3',
      relevance: 'HIGH',
      topics: ['Transnational Repression', 'Press Freedom', 'Surveillance']
    },
    {
      title: 'In the Same Breath',
      year: 2021,
      director: 'Nanfu Wang',
      category: 'covid',
      runtime: '98 min',
      description: 'Documentary examining China and the U.S. governments\' responses to COVID-19, exposing CCP propaganda and censorship.',
      whereToWatch: ['HBO Max'],
      rating: '7.1',
      relevance: 'HIGH',
      topics: ['COVID-19', 'Censorship', 'Propaganda', 'Whistleblowers']
    },
    {
      title: 'One Child Nation',
      year: 2019,
      director: 'Nanfu Wang, Jialing Zhang',
      category: 'domestic',
      runtime: '85 min',
      description: 'Personal exploration of China\'s one-child policy and its devastating human consequences.',
      whereToWatch: ['Amazon Prime'],
      rating: '7.5',
      relevance: 'HIGH',
      topics: ['One-Child Policy', 'Human Rights', 'Forced Abortion']
    },
    {
      title: 'Ask No Questions',
      year: 2020,
      director: 'Jason Loftus',
      category: 'falungong',
      runtime: '77 min',
      description: 'Investigation into the 2001 Tiananmen Square self-immolation incident and CCP propaganda against Falun Gong.',
      whereToWatch: ['Amazon Prime', 'Vimeo'],
      rating: '7.8',
      relevance: 'HIGH',
      topics: ['Falun Gong', 'Propaganda', 'Persecution']
    },
    {
      title: 'Letter from Masanjia',
      year: 2018,
      director: 'Leon Lee',
      category: 'falungong',
      runtime: '76 min',
      description: 'True story of a Falun Gong practitioner who smuggled an SOS letter inside a Halloween decoration made in a Chinese labor camp.',
      whereToWatch: ['Amazon Prime', 'iTunes'],
      rating: '8.0',
      relevance: 'CRITICAL',
      topics: ['Forced Labor', 'Falun Gong', 'Labor Camps']
    },
    {
      title: 'Revolution of Our Times',
      year: 2021,
      director: 'Kiwi Chow',
      category: 'hongkong',
      runtime: '158 min',
      description: 'Comprehensive documentary of the 2019-2020 Hong Kong protests, banned in Hong Kong.',
      whereToWatch: ['Limited Screenings'],
      rating: '8.7',
      relevance: 'CRITICAL',
      topics: ['Hong Kong', 'Protests', 'Democracy', 'NSL']
    },
    {
      title: 'Inside the Red Brick Wall',
      year: 2020,
      director: 'Hong Kong Documentary Filmmakers',
      category: 'hongkong',
      runtime: '88 min',
      description: 'First-hand footage from inside the Polytechnic University siege during the 2019 Hong Kong protests.',
      whereToWatch: ['Limited Screenings'],
      rating: '8.2',
      relevance: 'CRITICAL',
      topics: ['Hong Kong', 'PolyU Siege', 'Protests']
    },
    {
      title: 'Do Not Split',
      year: 2020,
      director: 'Anders Hammer',
      category: 'hongkong',
      runtime: '35 min',
      description: 'Oscar-nominated short documentary following Hong Kong protesters during the 2019-2020 movement.',
      whereToWatch: ['Field of Vision', 'YouTube'],
      rating: '7.4',
      relevance: 'HIGH',
      topics: ['Hong Kong', 'Protests', 'Police Violence']
    },
    {
      title: 'The Hong Konger',
      year: 2024,
      director: 'Various',
      category: 'hongkong',
      runtime: '90 min',
      description: 'Documentary about Jimmy Lai, founder of Apple Daily, and his fight for press freedom.',
      whereToWatch: ['Theatrical Release'],
      rating: '8.0',
      relevance: 'CRITICAL',
      topics: ['Jimmy Lai', 'Press Freedom', 'Apple Daily', 'NSL']
    },
    {
      title: 'China: The Uighur Tragedy',
      year: 2020,
      director: 'France 24',
      category: 'uyghur',
      runtime: '52 min',
      description: 'Investigation into the mass detention of Uyghurs in Xinjiang concentration camps.',
      whereToWatch: ['YouTube', 'France 24'],
      rating: '7.8',
      relevance: 'CRITICAL',
      topics: ['Uyghurs', 'Xinjiang', 'Concentration Camps', 'Genocide']
    },
    {
      title: 'China Undercover',
      year: 2020,
      director: 'PBS Frontline',
      category: 'uyghur',
      runtime: '54 min',
      description: 'Frontline investigation into China\'s mass surveillance and detention of Uyghurs.',
      whereToWatch: ['PBS', 'YouTube'],
      rating: '8.1',
      relevance: 'CRITICAL',
      topics: ['Uyghurs', 'Surveillance', 'Xinjiang', 'Re-education']
    },
    {
      title: 'The Xinjiang Police Files',
      year: 2022,
      director: 'BBC',
      category: 'uyghur',
      runtime: '60 min',
      description: 'BBC investigation based on leaked police files showing the reality inside Xinjiang detention camps.',
      whereToWatch: ['BBC iPlayer', 'YouTube'],
      rating: '8.5',
      relevance: 'CRITICAL',
      topics: ['Uyghurs', 'Police Files', 'Detention', 'Evidence']
    },
    {
      title: 'Tibet: Cry of the Snow Lion',
      year: 2002,
      director: 'Tom Peosay',
      category: 'tibet',
      runtime: '104 min',
      description: 'Comprehensive documentary on Tibet\'s history, culture, and the Chinese occupation.',
      whereToWatch: ['Amazon Prime', 'DVD'],
      rating: '8.0',
      relevance: 'HIGH',
      topics: ['Tibet', 'Occupation', 'Dalai Lama', 'History']
    },
    {
      title: 'When the Dragon Swallowed the Sun',
      year: 2010,
      director: 'Dirk Simon',
      category: 'tibet',
      runtime: '116 min',
      description: 'Documentary exploring the Tibetan freedom movement and the Dalai Lama\'s middle-way approach.',
      whereToWatch: ['Amazon Prime'],
      rating: '7.2',
      relevance: 'HIGH',
      topics: ['Tibet', 'Dalai Lama', 'Freedom Movement']
    },
    {
      title: 'The Gate of Heavenly Peace',
      year: 1995,
      director: 'Carma Hinton, Richard Gordon',
      category: 'tiananmen',
      runtime: '189 min',
      description: 'Definitive documentary on the 1989 Tiananmen Square protests and massacre.',
      whereToWatch: ['Amazon Prime', 'Kanopy'],
      rating: '8.3',
      relevance: 'CRITICAL',
      topics: ['Tiananmen', '1989', 'Democracy Movement', 'Massacre']
    },
    {
      title: 'Tank Man',
      year: 2006,
      director: 'PBS Frontline',
      category: 'tiananmen',
      runtime: '90 min',
      description: 'Investigation into the identity of the iconic Tank Man and the aftermath of Tiananmen.',
      whereToWatch: ['PBS', 'YouTube'],
      rating: '8.0',
      relevance: 'HIGH',
      topics: ['Tiananmen', 'Tank Man', 'Censorship']
    },
    {
      title: 'The Coming War on China',
      year: 2016,
      director: 'John Pilger',
      category: 'geopolitics',
      runtime: '113 min',
      description: 'Documentary examining US-China tensions and military buildup in the Pacific.',
      whereToWatch: ['YouTube', 'Vimeo'],
      rating: '7.6',
      relevance: 'MEDIUM',
      topics: ['US-China Relations', 'Military', 'Pacific']
    },
    {
      title: 'Ai Weiwei: Never Sorry',
      year: 2012,
      director: 'Alison Klayman',
      category: 'artists',
      runtime: '91 min',
      description: 'Profile of dissident artist Ai Weiwei and his confrontations with the Chinese government.',
      whereToWatch: ['Amazon Prime', 'Netflix'],
      rating: '7.4',
      relevance: 'HIGH',
      topics: ['Ai Weiwei', 'Art', 'Dissent', 'Activism']
    },
    {
      title: 'Human Flow',
      year: 2017,
      director: 'Ai Weiwei',
      category: 'artists',
      runtime: '140 min',
      description: 'Ai Weiwei\'s documentary on the global refugee crisis, relevant to understanding displacement.',
      whereToWatch: ['Amazon Prime'],
      rating: '7.1',
      relevance: 'MEDIUM',
      topics: ['Refugees', 'Human Rights', 'Ai Weiwei']
    }
  ];

  const categories = [
    { id: 'all', name: 'All', count: documentaries.length },
    { id: 'hongkong', name: 'Hong Kong', count: documentaries.filter(d => d.category === 'hongkong').length },
    { id: 'uyghur', name: 'Uyghur/Xinjiang', count: documentaries.filter(d => d.category === 'uyghur').length },
    { id: 'tibet', name: 'Tibet', count: documentaries.filter(d => d.category === 'tibet').length },
    { id: 'tiananmen', name: 'Tiananmen', count: documentaries.filter(d => d.category === 'tiananmen').length },
    { id: 'falungong', name: 'Falun Gong', count: documentaries.filter(d => d.category === 'falungong').length },
    { id: 'domestic', name: 'Domestic', count: documentaries.filter(d => d.category === 'domestic').length },
    { id: 'transnational', name: 'Transnational', count: documentaries.filter(d => d.category === 'transnational').length },
  ];

  const filteredDocs = selectedCategory === 'all' 
    ? documentaries 
    : documentaries.filter(d => d.category === selectedCategory);

  const getRelevanceColor = (relevance) => {
    switch (relevance) {
      case 'CRITICAL': return 'bg-red-600';
      case 'HIGH': return 'bg-orange-600';
      case 'MEDIUM': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-[#22d3ee] p-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Film className="w-6 h-6" /> Essential Documentaries</h2>
        <p className="text-slate-300">
          {documentaries.length} documentaries covering CCP human rights abuses, from Hong Kong protests to the Uyghur genocide.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-[#22d3ee] text-[#0a0e14]'
                : 'bg-[#111820] text-slate-300 hover:bg-[#111820]'
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* Documentary Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc, index) => (
          <div key={index} className="bg-[#111820] border border-[#1c2a35] overflow-hidden hover:border-[#2a9a52] transition-colors">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white text-lg">{doc.title}</h3>
                <span className={`${getRelevanceColor(doc.relevance)} text-white text-xs px-2 py-0.5 rounded`}>
                  {doc.relevance}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                <span>{doc.year}</span>
                <span>•</span>
                <span>{doc.runtime}</span>
                <span>•</span>
                <span>⭐ {doc.rating}</span>
              </div>
              
              <p className="text-sm text-slate-400 mb-2">Dir: {doc.director}</p>
              
              <p className="text-sm text-slate-300 mb-3">{doc.description}</p>
              
              {/* Topics */}
              <div className="flex flex-wrap gap-1 mb-3">
                {doc.topics.map((topic, i) => (
                  <span key={i} className="bg-[#111820] text-slate-300 px-2 py-0.5 rounded text-xs">
                    {topic}
                  </span>
                ))}
              </div>
              
              {/* Where to Watch */}
              <div className="border-t border-[#1c2a35] pt-3">
                <p className="text-xs text-slate-500 mb-1">Where to Watch:</p>
                <div className="flex flex-wrap gap-1">
                  {doc.whereToWatch.map((platform, i) => (
                    <span key={i} className="bg-[#111820] text-[#22d3ee] px-2 py-0.5 rounded text-xs">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-4 text-sm text-slate-400">
        <p>
          <strong className="text-white">Note:</strong> Some documentaries may be banned or restricted in certain countries. 
          Use a VPN if necessary to access these important works. Availability may vary by region.
        </p>
      </div>
    </div>
  );
};

export default DocumentaryList;
