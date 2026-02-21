import React, { useState } from 'react';
import { Heart, Flame, Search, Calendar, MapPin, ExternalLink, Filter } from 'lucide-react';
import SourceAttribution from './ui/SourceAttribution';
import { resolveSource } from '../utils/sourceLinks';

const VictimMemorialWall = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const victims = [
    // Uyghur Victims
    {
      name: 'Abdurehim Heyit',
      age: 56,
      category: 'Uyghur',
      location: 'Xinjiang, China',
      dateOfDeath: '2019-02-09',
      causeOfDeath: 'Died in detention camp',
      description: 'Renowned Uyghur musician and dutar player. Detained for performing traditional Uyghur songs. Died in custody under suspicious circumstances.',
      knownFor: 'Master of traditional Uyghur music',
      family: 'Wife and children',
      image: null,
      verified: true,
      sources: ['Radio Free Asia', 'Uyghur Human Rights Project']
    },
    {
      name: 'Muhammed Salih Hajim',
      age: 82,
      category: 'Uyghur',
      location: 'Xinjiang, China',
      dateOfDeath: '2018-01-24',
      causeOfDeath: 'Died in detention',
      description: 'Elderly Uyghur scholar and religious leader. Detained despite his advanced age. Died shortly after being taken into custody.',
      knownFor: 'Islamic scholar and community leader',
      family: 'Multiple children and grandchildren',
      image: null,
      verified: true,
      sources: ['Radio Free Asia']
    },

    // Hong Kong Victims
    {
      name: 'Chan Yin-lam',
      age: 15,
      category: 'Hong Kong',
      location: 'Hong Kong',
      dateOfDeath: '2019-09-22',
      causeOfDeath: 'Found dead in sea (suspicious circumstances)',
      description: 'Young swimmer whose body was found in the sea during 2019 protests. Family disputes official drowning verdict, citing evidence of foul play.',
      knownFor: 'Student and protest supporter',
      family: 'Parents',
      image: null,
      verified: true,
      sources: ['Hong Kong Free Press', 'Stand News']
    },
    {
      name: 'Chow Tsz-lok',
      age: 22,
      category: 'Hong Kong',
      location: 'Hong Kong',
      dateOfDeath: '2019-11-08',
      causeOfDeath: 'Fell from parking garage during police operation',
      description: 'University student who fell from a parking garage while police were firing tear gas. Circumstances of his death remain disputed.',
      knownFor: 'Pro-democracy activist',
      family: 'Parents',
      image: null,
      verified: true,
      sources: ['South China Morning Post', 'Hong Kong Free Press']
    },
    {
      name: 'Luo Huining (victim of NSL)',
      age: 35,
      category: 'Hong Kong',
      location: 'Hong Kong',
      dateOfDeath: '2021-07-03',
      causeOfDeath: 'Suicide in detention (disputed)',
      description: 'Activist who died in custody after arrest under National Security Law. Family questions official suicide verdict.',
      knownFor: 'Pro-democracy organizer',
      family: 'Spouse and child',
      image: null,
      verified: false,
      sources: ['Hong Kong Watch']
    },

    // Tibet Victims
    {
      name: 'Tenzin Choedak',
      age: 18,
      category: 'Tibet',
      location: 'Ngaba, Tibet',
      dateOfDeath: '2012-02-08',
      causeOfDeath: 'Self-immolation protest',
      description: 'Young monk who self-immolated to protest Chinese occupation of Tibet. Called for freedom for Tibet and return of the Dalai Lama.',
      knownFor: 'Monk and protester',
      family: 'Parents and siblings',
      image: null,
      verified: true,
      sources: ['International Campaign for Tibet', 'Free Tibet']
    },
    {
      name: 'Palden Choetso',
      age: 35,
      category: 'Tibet',
      location: 'Tawu, Tibet',
      dateOfDeath: '2011-11-03',
      causeOfDeath: 'Self-immolation protest',
      description: 'Buddhist nun who self-immolated to protest religious persecution. First Tibetan woman to self-immolate.',
      knownFor: 'Buddhist nun and activist',
      family: 'Monastic community',
      image: null,
      verified: true,
      sources: ['International Campaign for Tibet']
    },
    {
      name: 'Tenzin Delek Rinpoche',
      age: 65,
      category: 'Tibet',
      location: 'Sichuan, China',
      dateOfDeath: '2015-07-12',
      causeOfDeath: 'Died in prison (suspected medical neglect)',
      description: 'Revered Buddhist lama imprisoned on false terrorism charges. Died in custody after being denied medical care.',
      knownFor: 'Buddhist teacher and community leader',
      family: 'Monastic students',
      image: null,
      verified: true,
      sources: ['International Campaign for Tibet', 'Human Rights Watch']
    },

    // Tiananmen Victims
    {
      name: 'Wang Weilin (Tank Man)',
      age: 'Unknown',
      category: 'Tiananmen',
      location: 'Beijing, China',
      dateOfDeath: 'Unknown (presumed dead)',
      causeOfDeath: 'Unknown (disappeared after June 4, 1989)',
      description: 'The iconic "Tank Man" who stood in front of tanks on June 5, 1989. His identity and fate remain unknown. Presumed executed or imprisoned.',
      knownFor: 'Symbol of resistance against tyranny',
      family: 'Unknown',
      image: null,
      verified: false,
      sources: ['Historical records', 'Tiananmen Mothers']
    },
    {
      name: 'Jiang Jielian',
      age: 17,
      category: 'Tiananmen',
      location: 'Beijing, China',
      dateOfDeath: '1989-06-03',
      causeOfDeath: 'Shot by PLA soldiers',
      description: 'High school student shot in the back while fleeing from soldiers during the Tiananmen Square massacre. His mother, Ding Zilin, founded the Tiananmen Mothers.',
      knownFor: 'Student victim of massacre',
      family: 'Mother Ding Zilin (activist)',
      image: null,
      verified: true,
      sources: ['Tiananmen Mothers', 'Human Rights in China']
    },

    // Dissidents who died in custody
    {
      name: 'Liu Xiaobo',
      age: 61,
      category: 'Dissident',
      location: 'Shenyang, China',
      dateOfDeath: '2017-07-13',
      causeOfDeath: 'Liver cancer (denied medical parole)',
      description: 'Nobel Peace Prize laureate and author of Charter 08. Imprisoned for "inciting subversion." Denied medical treatment abroad, died in custody.',
      knownFor: 'Nobel Peace Prize winner, democracy advocate',
      family: 'Wife Liu Xia',
      image: null,
      verified: true,
      sources: ['Nobel Prize Committee', 'Human Rights Watch', 'Amnesty International']
    },
    {
      name: 'Cao Shunli',
      age: 52,
      category: 'Dissident',
      location: 'Beijing, China',
      dateOfDeath: '2014-03-14',
      causeOfDeath: 'Organ failure (denied medical care in detention)',
      description: 'Human rights lawyer detained for attempting to attend UN Human Rights Council session. Denied medical care, died from organ failure.',
      knownFor: 'Human rights lawyer',
      family: 'Daughter',
      image: null,
      verified: true,
      sources: ['Human Rights Watch', 'Chinese Human Rights Defenders']
    },
    {
      name: 'Peng Ming',
      age: 55,
      category: 'Dissident',
      location: 'Hubei, China',
      dateOfDeath: '2021-11-19',
      causeOfDeath: 'Illness in prison (denied medical care)',
      description: 'Democracy activist imprisoned for 18 years. Denied adequate medical care, died shortly after release.',
      knownFor: 'Pro-democracy activist',
      family: 'Wife and children',
      image: null,
      verified: true,
      sources: ['Radio Free Asia', 'Human Rights in China']
    },

    // Falun Gong Victims
    {
      name: 'Chen Zixiu',
      age: 58,
      category: 'Falun Gong',
      location: 'Shandong, China',
      dateOfDeath: '2000-02-21',
      causeOfDeath: 'Beaten to death in custody',
      description: 'Elderly Falun Gong practitioner beaten to death by police for refusing to renounce her beliefs. Her death was documented by Wall Street Journal.',
      knownFor: 'Falun Gong practitioner',
      family: 'Husband and children',
      image: null,
      verified: true,
      sources: ['Wall Street Journal', 'Falun Dafa Information Center']
    }
  ];

  const categories = ['all', 'Uyghur', 'Hong Kong', 'Tibet', 'Tiananmen', 'Dissident', 'Falun Gong'];

  const filteredVictims = victims.filter(victim => {
    const matchesCategory = selectedCategory === 'all' || victim.category === selectedCategory;
    const matchesSearch = victim.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         victim.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         victim.knownFor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    if (dateString === 'Unknown') return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Uyghur': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      'Hong Kong': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
      'Tibet': 'text-red-400 bg-red-500/10 border-red-500/30',
      'Tiananmen': 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      'Dissident': 'text-green-400 bg-green-500/10 border-green-500/30',
      'Falun Gong': 'text-orange-400 bg-orange-500/10 border-orange-500/30'
    };
    return colors[category] || 'text-slate-400 bg-slate-500/10 border-slate-500/30';
  };

  return (
    <div className="bg-[#111820]/50 backdrop-blur-sm border border-[#1c2a35]/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Flame className="w-8 h-8 text-amber-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Victim Memorial Wall</h2>
          <p className="text-slate-400 text-sm">Remembering those who died resisting CCP oppression</p>
        </div>
      </div>

      {/* Memorial Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 mb-6">
        <div className="flex items-start gap-3">
          <Heart className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-amber-400 font-bold mb-2">In Memory</h3>
            <p className="text-slate-300 text-sm mb-2">
              This memorial honors the victims of CCP persecution who lost their lives in detention, during protests, or as a result of state violence. 
              Their sacrifice will not be forgotten.
            </p>
            <p className="text-slate-300 text-sm">
              <strong>Note:</strong> This is a partial list. The true number of victims is likely much higher, as many deaths go unreported.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            aria-label="Search"
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0a0e14]/50 border border-[#1c2a35]/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-white'
                  : 'bg-[#0a0e14]/50 text-slate-400 hover:bg-[#0a0e14] hover:text-white border border-[#1c2a35]/50'
              }`}
            >
              {cat === 'all' ? 'All Victims' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0a0e14]/50 p-4 border border-[#1c2a35]/50">
          <div className="text-3xl font-bold text-amber-400 mb-1">{victims.length}</div>
          <div className="text-sm text-slate-400">Documented Victims</div>
        </div>
        <div className="bg-[#0a0e14]/50 p-4 border border-[#1c2a35]/50">
          <div className="text-3xl font-bold text-blue-400 mb-1">{victims.filter(v => v.category === 'Uyghur').length}</div>
          <div className="text-sm text-slate-400">Uyghur Victims</div>
        </div>
        <div className="bg-[#0a0e14]/50 p-4 border border-[#1c2a35]/50">
          <div className="text-3xl font-bold text-red-400 mb-1">{victims.filter(v => v.category === 'Tibet').length}</div>
          <div className="text-sm text-slate-400">Tibetan Victims</div>
        </div>
        <div className="bg-[#0a0e14]/50 p-4 border border-[#1c2a35]/50">
          <div className="text-3xl font-bold text-yellow-400 mb-1">{victims.filter(v => v.category === 'Hong Kong').length}</div>
          <div className="text-sm text-slate-400">Hong Kong Victims</div>
        </div>
      </div>

      {/* Victim Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredVictims.map((victim, index) => (
          <div key={index} className="bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-5 hover:border-amber-500/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-[#111820] rounded-full flex items-center justify-center border-2 border-amber-500/30">
                  <Flame className="w-8 h-8 text-amber-400" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{victim.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(victim.category)}`}>
                        {victim.category}
                      </span>
                      {victim.verified && (
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(victim.dateOfDeath)}</span>
                    {victim.age !== 'Unknown' && <span>• Age {victim.age}</span>}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span>{victim.location}</span>
                  </div>
                </div>

                <p className="text-slate-300 text-sm mb-3">{victim.description}</p>

                <div className="bg-[#111820]/50 rounded p-3 mb-3">
                  <div className="text-xs text-slate-500 mb-1">Known For:</div>
                  <div className="text-sm text-slate-300">{victim.knownFor}</div>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mb-3">
                  <div className="text-xs text-red-400 mb-1">Cause of Death:</div>
                  <div className="text-sm text-slate-300">{victim.causeOfDeath}</div>
                </div>

                {victim.sources && victim.sources.length > 0 && (
                  <div className="pt-3 border-t border-[#1c2a35]/50">
                    <div className="text-xs text-slate-500 mb-2">Sources:</div>
                    <div className="flex flex-wrap gap-2">
                      {victim.sources.map((source, sIndex) => {
                        const resolved = resolveSource(source);
                        return resolved.url ? (
                          <SourceAttribution key={sIndex} source={resolved} compact />
                        ) : (
                          <span key={sIndex} className="px-2 py-1 bg-[#111820] rounded text-xs text-slate-400">
                            {source}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVictims.length === 0 && (
        <div className="text-center py-12">
          <Flame className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No victims match your search criteria</p>
        </div>
      )}

      {/* Additional Information */}
      <div className="mt-6 bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-5">
        <h3 className="text-white font-bold mb-3">About This Memorial</h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p>• <strong>Incomplete list:</strong> This memorial represents only a fraction of victims. Many deaths go unreported due to CCP censorship.</p>
          <p>• <strong>Verification:</strong> Verified entries have been documented by credible sources. Unverified entries are included based on credible reports but lack complete documentation.</p>
          <p>• <strong>Tiananmen:</strong> The exact death toll from the 1989 Tiananmen Square massacre remains unknown. Estimates range from hundreds to thousands.</p>
          <p>• <strong>Xinjiang:</strong> Unknown numbers have died in detention camps. Many families have no information about their loved ones' fate.</p>
          <p>• <strong>Submit information:</strong> If you have information about victims not listed here, please contact human rights organizations.</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-6 bg-red-500/10 border border-red-500/30 p-5">
        <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Honor Their Memory
        </h3>
        <p className="text-slate-300 text-sm mb-3">
          The best way to honor these victims is to continue their fight for freedom and justice. Share their stories, support their families, and demand accountability.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.tiananmenmother.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#111820] hover:bg-[#1c2a35] text-white transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Tiananmen Mothers
          </a>
          <a
            href="https://uhrp.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#111820] hover:bg-[#1c2a35] text-white transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Uyghur Human Rights Project
          </a>
          <a
            href="https://savetibet.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#111820] hover:bg-[#1c2a35] text-white transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            International Campaign for Tibet
          </a>
        </div>
      </div>
    </div>
  );
};

export default VictimMemorialWall;
