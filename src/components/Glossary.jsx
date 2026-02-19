import React, { useState, useMemo } from 'react';
import { BookOpen, Landmark, ScrollText, Map, AlertTriangle, User, Lightbulb, Search } from 'lucide-react';

const Glossary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Terms', Icon: BookOpen },
    { id: 'organizations', name: 'Organizations', Icon: Landmark },
    { id: 'policies', name: 'Policies & Laws', Icon: ScrollText },
    { id: 'regions', name: 'Regions', Icon: Map },
    { id: 'tactics', name: 'CCP Tactics', Icon: AlertTriangle },
    { id: 'people', name: 'Key Figures', Icon: User },
    { id: 'concepts', name: 'Concepts', Icon: Lightbulb },
  ];

  const terms = [
    // Organizations
    {
      term: 'CCP',
      fullName: 'Chinese Communist Party',
      category: 'organizations',
      definition: 'The founding and ruling political party of the People\'s Republic of China. Founded in 1921, it has governed China since 1949 under a one-party system.',
      related: ['PRC', 'Politburo', 'Xi Jinping'],
      importance: 'critical'
    },
    {
      term: 'United Front Work Department',
      fullName: 'UFWD',
      category: 'organizations',
      definition: 'CCP agency responsible for managing relations with non-Party elites and coordinating influence operations abroad.',
      related: ['Influence Operations', 'Overseas Chinese'],
      importance: 'high'
    },
    {
      term: 'MSS',
      fullName: 'Ministry of State Security',
      category: 'organizations',
      definition: 'China\'s primary intelligence and security agency, responsible for espionage, counterintelligence, and political security.',
      related: ['Espionage', 'Transnational Repression'],
      importance: 'high'
    },
    {
      term: 'PLA',
      fullName: 'People\'s Liberation Army',
      category: 'organizations',
      definition: 'The armed forces of the PRC. Unlike most militaries, the PLA reports to the CCP rather than the state.',
      related: ['Taiwan', 'South China Sea'],
      importance: 'high'
    },
    {
      term: 'Confucius Institute',
      fullName: null,
      category: 'organizations',
      definition: 'CCP-funded cultural centers at universities worldwide. Criticized for censorship and surveillance of Chinese students.',
      related: ['United Front', 'Academic Freedom'],
      importance: 'high'
    },
    // Policies
    {
      term: 'National Security Law',
      fullName: 'Hong Kong National Security Law',
      category: 'policies',
      definition: 'Law imposed on Hong Kong in June 2020 criminalizing secession, subversion, terrorism, and collusion with foreign forces.',
      related: ['Hong Kong', 'Article 23', 'Jimmy Lai'],
      importance: 'critical'
    },
    {
      term: 'UFLPA',
      fullName: 'Uyghur Forced Labor Prevention Act',
      category: 'policies',
      definition: 'US law creating a presumption that goods from Xinjiang are made with forced labor and banning their import.',
      related: ['Forced Labor', 'Xinjiang', 'Supply Chain'],
      importance: 'high'
    },
    // Regions
    {
      term: 'Xinjiang',
      fullName: 'Xinjiang Uyghur Autonomous Region',
      category: 'regions',
      definition: 'Northwestern region of China, home to the Uyghur people. Site of mass detention camps and what many governments have declared genocide.',
      related: ['Uyghurs', 'Genocide', 'Camps'],
      importance: 'critical'
    },
    {
      term: 'Tibet',
      fullName: 'Tibet Autonomous Region',
      category: 'regions',
      definition: 'Region occupied by China since 1950. Tibetans face cultural erasure, religious persecution, and restrictions on movement.',
      related: ['Dalai Lama', 'Panchen Lama'],
      importance: 'high'
    },
    {
      term: 'Hong Kong',
      fullName: 'Hong Kong Special Administrative Region',
      category: 'regions',
      definition: 'Former British colony returned to China in 1997. Now under direct CCP control after the 2019-2020 crackdown.',
      related: ['National Security Law', 'One Country Two Systems'],
      importance: 'critical'
    },
    {
      term: 'Taiwan',
      fullName: 'Republic of China (Taiwan)',
      category: 'regions',
      definition: 'Self-governing democracy that the CCP claims as its territory. Faces constant military threats from Beijing.',
      related: ['Cross-Strait', 'ADIZ'],
      importance: 'critical'
    },
    // Tactics
    {
      term: 'Transnational Repression',
      fullName: null,
      category: 'tactics',
      definition: 'Government efforts to silence dissidents and diaspora communities abroad. China is the world\'s leading practitioner.',
      related: ['Police Stations', 'Fox Hunt', 'Harassment'],
      importance: 'critical'
    },
    {
      term: 'Overseas Police Stations',
      fullName: null,
      category: 'tactics',
      definition: 'Unofficial CCP-linked facilities in 53+ countries used to monitor and coerce Chinese nationals abroad.',
      related: ['Transnational Repression', 'Safeguard Defenders'],
      importance: 'critical'
    },
    {
      term: 'Re-education',
      fullName: 'Vocational Education and Training Centers',
      category: 'tactics',
      definition: 'CCP euphemism for concentration camps in Xinjiang where Uyghurs are detained and subjected to forced labor.',
      related: ['Xinjiang', 'Uyghurs', 'Camps'],
      importance: 'critical'
    },
    // People
    {
      term: 'Xi Jinping',
      fullName: null,
      category: 'people',
      definition: 'General Secretary of the CCP since 2012. Most powerful Chinese leader since Mao.',
      related: ['CCP', 'Politburo'],
      importance: 'critical'
    },
    {
      term: 'Jimmy Lai',
      fullName: 'Lai Chee-ying',
      category: 'people',
      definition: 'Hong Kong media mogul convicted on all charges in December 2025 under the National Security Law, faces life imprisonment.',
      related: ['Hong Kong', 'Apple Daily', 'NSL'],
      importance: 'critical'
    },
    {
      term: 'Dalai Lama',
      fullName: 'Tenzin Gyatso, 14th Dalai Lama',
      category: 'people',
      definition: 'Spiritual leader of Tibetan Buddhism, living in exile in India since 1959. Nobel Peace Prize laureate.',
      related: ['Tibet', 'Panchen Lama'],
      importance: 'high'
    },
    // Concepts
    {
      term: 'Genocide',
      fullName: null,
      category: 'concepts',
      definition: 'Acts committed with intent to destroy a national, ethnic, racial, or religious group. Multiple governments have declared China\'s treatment of Uyghurs genocide.',
      related: ['Uyghurs', 'Xinjiang', 'UN Convention'],
      importance: 'critical'
    },
    {
      term: 'Forced Labor',
      fullName: null,
      category: 'concepts',
      definition: 'Work extracted under threat of penalty, without consent. Widespread in Xinjiang through "labor transfer" programs.',
      related: ['UFLPA', 'Supply Chain', 'Xinjiang'],
      importance: 'critical'
    },
    {
      term: 'Exit Ban',
      fullName: null,
      category: 'concepts',
      definition: 'CCP practice of preventing individuals from leaving China, often used to pressure overseas family members.',
      related: ['Hostage Diplomacy', 'Coercion'],
      importance: 'high'
    },
  ];

  const filteredTerms = useMemo(() => {
    return terms.filter(term => {
      const matchesCategory = activeCategory === 'all' || term.category === activeCategory;
      const matchesSearch = searchTerm === '' || 
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (term.fullName && term.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'critical': return 'bg-red-900/50 text-red-400 border-red-700';
      case 'high': return 'bg-orange-900/50 text-orange-400 border-orange-700';
      default: return 'bg-slate-700 text-slate-400 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center mb-4">
          <BookOpen className="w-8 h-8 text-slate-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-white">Glossary of Terms</h2>
            <p className="text-slate-400">Key terminology for understanding CCP threats</p>
          </div>
        </div>
        <div className="relative">
          <input
            aria-label="Search terms..."
            type="text"
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <cat.Icon className="w-4 h-4" />
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="text-sm text-slate-400">
        Showing {filteredTerms.length} of {terms.length} terms
      </div>

      <div className="space-y-4">
        {filteredTerms.map((item, index) => (
          <div key={index} className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold text-white">{item.term}</h3>
                {item.fullName && <p className="text-sm text-slate-400">{item.fullName}</p>}
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium border ${getImportanceColor(item.importance)}`}>
                {item.importance.toUpperCase()}
              </span>
            </div>
            <p className="text-slate-300 mb-4">{item.definition}</p>
            {item.related.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-slate-500">Related:</span>
                {item.related.map((rel, idx) => (
                  <button key={idx} onClick={() => setSearchTerm(rel)} className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors">
                    {rel}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-10 h-10 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">No terms found matching "{searchTerm}"</p>
          <button onClick={() => { setSearchTerm(''); setActiveCategory('all'); }} className="mt-4 text-blue-400 hover:text-blue-300">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Glossary;
