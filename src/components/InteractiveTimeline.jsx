import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Play, Pause, ZoomIn, ZoomOut, Filter, Info, ExternalLink } from 'lucide-react';

const timelineEvents = [
  // 1989
  {
    id: 1,
    date: '1989-06-04',
    title: 'Tiananmen Square Massacre',
    category: 'mainland',
    significance: 'critical',
    description: 'Chinese military violently suppresses pro-democracy protests in Beijing, killing hundreds to thousands of civilians.',
    details: 'Student-led protests calling for democratic reform, freedom of speech, and an end to corruption were met with martial law and military force. The iconic "Tank Man" image became a global symbol of resistance.',
    casualties: '300-3,000+ (estimates vary)',
    impact: 'Began era of political repression, censorship of June 4th anniversary',
    sources: ['Tiananmen Papers', 'Amnesty International', 'Human Rights Watch']
  },
  // 1995
  {
    id: 2,
    date: '1995-05-17',
    title: 'Panchen Lama Abducted',
    category: 'tibet',
    significance: 'critical',
    description: 'Six-year-old Gedhun Choekyi Nyima, recognized as the 11th Panchen Lama by the Dalai Lama, is abducted by Chinese authorities.',
    details: 'Three days after being recognized, the child and his family were taken into custody. China installed their own Panchen Lama. Gedhun has not been seen publicly since, making him the world\'s youngest political prisoner.',
    impact: 'Ongoing disappearance for 30 years, symbol of Tibet\'s religious persecution',
    sources: ['International Campaign for Tibet', 'UN Committee on the Rights of the Child']
  },
  // 1999
  {
    id: 3,
    date: '1999-07-20',
    title: 'Falun Gong Persecution Begins',
    category: 'falungong',
    significance: 'critical',
    description: 'CCP launches nationwide campaign to "eradicate" Falun Gong spiritual practice.',
    details: 'After an estimated 70-100 million practitioners gathered peacefully in Beijing, the CCP declared Falun Gong an "evil cult" and began systematic persecution including imprisonment, torture, and forced organ harvesting.',
    casualties: '4,000+ confirmed deaths in custody',
    impact: 'Ongoing persecution, forced organ harvesting allegations',
    sources: ['Falun Dafa Information Center', 'China Tribunal']
  },
  // 2008
  {
    id: 4,
    date: '2008-03-14',
    title: 'Tibetan Uprising',
    category: 'tibet',
    significance: 'high',
    description: 'Major protests erupt across Tibet on the anniversary of the 1959 uprising, met with violent crackdown.',
    details: 'Protests spread to Tibetan areas in Sichuan, Gansu, and Qinghai. Chinese security forces responded with mass arrests, shootings, and communications blackout.',
    casualties: '200+ killed (Tibetan government-in-exile estimate)',
    impact: 'Increased militarization of Tibet, wave of self-immolations began',
    sources: ['International Campaign for Tibet', 'Human Rights Watch']
  },
  // 2009
  {
    id: 5,
    date: '2009-07-05',
    title: 'Ürümqi Riots',
    category: 'uyghur',
    significance: 'critical',
    description: 'Ethnic violence erupts in Xinjiang\'s capital after Uyghur protests over factory killings.',
    details: 'Protests over the killing of Uyghur workers in Guangdong turned violent. Chinese authorities responded with mass arrests and communications blackout. This event is often cited as justification for later mass internment.',
    casualties: '197 dead (official), 1,000+ (unofficial estimates)',
    impact: 'Preceded mass surveillance and internment campaign',
    sources: ['Radio Free Asia', 'Human Rights Watch']
  },
  // 2014
  {
    id: 6,
    date: '2014-01-15',
    title: 'Ilham Tohti Arrested',
    category: 'uyghur',
    significance: 'critical',
    description: 'Uyghur economist and professor Ilham Tohti arrested on separatism charges.',
    details: 'Tohti, who advocated for dialogue between Uyghurs and Han Chinese and criticized government policies, was sentenced to life imprisonment. He received the Sakharov Prize in 2019.',
    sentence: 'Life imprisonment',
    impact: 'Symbol of persecution of moderate Uyghur voices',
    sources: ['PEN International', 'European Parliament']
  },
  {
    id: 7,
    date: '2014-09-28',
    title: 'Umbrella Movement Begins',
    category: 'hongkong',
    significance: 'critical',
    description: 'Pro-democracy protests erupt in Hong Kong after Beijing announces restrictive election framework.',
    details: 'Protesters occupied major streets for 79 days demanding genuine universal suffrage. Police use of tear gas on September 28 sparked mass participation. The yellow umbrella became a symbol of resistance.',
    participants: '1.2 million+ at peak',
    impact: 'Sparked generation of activists, led to 2019 protests',
    sources: ['Hong Kong Free Press', 'BBC']
  },
  // 2015
  {
    id: 8,
    date: '2015-07-09',
    title: '709 Crackdown',
    category: 'mainland',
    significance: 'critical',
    description: 'Nationwide crackdown on human rights lawyers begins with mass arrests.',
    details: 'Over 300 lawyers, legal assistants, and activists were detained, interrogated, or disappeared. Many were tortured and forced to make televised confessions. The crackdown effectively dismantled China\'s human rights legal community.',
    detained: '300+ lawyers and activists',
    impact: 'Destroyed independent legal advocacy in China',
    sources: ['Chinese Human Rights Defenders', 'Amnesty International']
  },
  {
    id: 9,
    date: '2015-10-15',
    title: 'Causeway Bay Booksellers Abducted',
    category: 'hongkong',
    significance: 'high',
    description: 'Five Hong Kong booksellers who published books critical of CCP leaders are abducted.',
    details: 'Gui Minhai was abducted from Thailand, others from Hong Kong and mainland China. The case demonstrated CCP\'s willingness to conduct extraterritorial operations and sparked fears about Hong Kong\'s autonomy.',
    impact: 'First major cross-border abduction case, Gui Minhai still imprisoned',
    sources: ['Hong Kong Free Press', 'PEN International']
  },
  // 2017
  {
    id: 10,
    date: '2017-04-01',
    title: 'Xinjiang Internment Camps Begin',
    category: 'uyghur',
    significance: 'critical',
    description: 'Mass internment of Uyghurs and other Turkic Muslims begins in Xinjiang.',
    details: 'Under the guise of "vocational training centers," the CCP began detaining an estimated 1-3 million Uyghurs. Leaked documents revealed forced political indoctrination, torture, and cultural destruction.',
    detained: '1-3 million estimated',
    impact: 'Largest mass internment since WWII, declared genocide by multiple governments',
    sources: ['Xinjiang Police Files', 'ASPI', 'Uyghur Tribunal']
  },
  {
    id: 11,
    date: '2017-07-13',
    title: 'Liu Xiaobo Dies in Custody',
    category: 'mainland',
    significance: 'critical',
    description: 'Nobel Peace Prize laureate Liu Xiaobo dies of liver cancer while in custody.',
    details: 'Liu was denied medical parole until his final days. He was serving an 11-year sentence for "inciting subversion" for co-authoring Charter 08, calling for political reform. His wife Liu Xia was held under house arrest for years.',
    impact: 'International outrage, symbol of CCP\'s treatment of dissidents',
    sources: ['Nobel Committee', 'PEN International']
  },
  // 2019
  {
    id: 12,
    date: '2019-06-09',
    title: '2019 Hong Kong Protests Begin',
    category: 'hongkong',
    significance: 'critical',
    description: 'Massive protests erupt against proposed extradition bill, evolving into pro-democracy movement.',
    details: 'What began as opposition to an extradition bill grew into the largest protests in Hong Kong history, with demands for democratic reform and police accountability. The "Five Demands, Not One Less" became the movement\'s rallying cry.',
    participants: '2 million+ at peak (June 16)',
    impact: 'Led to National Security Law, mass emigration',
    sources: ['Hong Kong Free Press', 'Reuters', 'BBC']
  },
  // 2020
  {
    id: 13,
    date: '2020-06-30',
    title: 'National Security Law Imposed',
    category: 'hongkong',
    significance: 'critical',
    description: 'Beijing imposes sweeping National Security Law on Hong Kong, bypassing local legislature.',
    details: 'The law criminalizes secession, subversion, terrorism, and collusion with foreign forces with penalties up to life imprisonment. It effectively ended Hong Kong\'s autonomy and triggered mass arrests of pro-democracy figures.',
    impact: 'End of "One Country, Two Systems," 260+ arrested under NSL',
    sources: ['Hong Kong Watch', 'Amnesty International']
  },
  {
    id: 14,
    date: '2020-08-10',
    title: 'Jimmy Lai Arrested',
    category: 'hongkong',
    significance: 'critical',
    description: 'Media tycoon Jimmy Lai arrested under National Security Law, Apple Daily raided.',
    details: 'Lai, founder of Apple Daily and outspoken pro-democracy advocate, was arrested on collusion charges. His newspaper was forced to close in 2021. He was found guilty on all charges in December 2025.',
    sentence: 'Guilty on all charges (Dec 2025), faces life imprisonment',
    impact: 'End of press freedom in Hong Kong',
    sources: ['Committee to Protect Journalists', 'Hong Kong Free Press']
  },
  // 2021
  {
    id: 15,
    date: '2021-01-06',
    title: 'Hong Kong 47 Mass Arrests',
    category: 'hongkong',
    significance: 'critical',
    description: '47 pro-democracy figures arrested for organizing unofficial primary elections.',
    details: 'The largest mass arrest under the NSL targeted participants in the 2020 democratic primaries. Charges of "conspiracy to commit subversion" carry up to life imprisonment. Most have been denied bail.',
    detained: '47 activists, politicians, lawyers',
    impact: 'Largest NSL prosecution, effectively ended opposition politics',
    sources: ['Hong Kong Free Press', 'Amnesty International']
  },
  {
    id: 16,
    date: '2021-06-24',
    title: 'Apple Daily Forced to Close',
    category: 'hongkong',
    significance: 'critical',
    description: 'Hong Kong\'s largest pro-democracy newspaper publishes final edition after assets frozen.',
    details: 'After police raids, arrests of executives, and asset freezes under NSL, Apple Daily was forced to close after 26 years. The final print run of 1 million copies sold out within hours.',
    impact: 'End of independent media in Hong Kong',
    sources: ['Committee to Protect Journalists', 'Reporters Without Borders']
  },
  // 2022
  {
    id: 17,
    date: '2022-05-24',
    title: 'Xinjiang Police Files Leaked',
    category: 'uyghur',
    significance: 'critical',
    description: 'Massive leak of internal Xinjiang police files provides unprecedented evidence of detention system.',
    details: 'The leak included thousands of photos of detainees, internal speeches by officials, and security protocols. It provided irrefutable evidence of the mass detention system and contradicted CCP claims of "voluntary" vocational training.',
    impact: 'Most significant evidence leak, strengthened genocide findings',
    sources: ['Xinjiang Police Files', 'BBC', 'Dr. Adrian Zenz']
  },
  {
    id: 18,
    date: '2022-11-26',
    title: 'White Paper Protests',
    category: 'mainland',
    significance: 'high',
    description: 'Nationwide protests erupt against Zero-COVID policy, with protesters holding blank white papers.',
    details: 'Following a deadly fire in Ürümqi where COVID lockdowns allegedly hindered rescue efforts, protests spread to major cities. Protesters held blank papers to symbolize censorship and some called for Xi Jinping\'s resignation.',
    participants: 'Thousands across multiple cities',
    impact: 'Largest protests since 1989, led to end of Zero-COVID',
    sources: ['BBC', 'New York Times', 'Reuters']
  },
  // 2023
  {
    id: 19,
    date: '2023-09-14',
    title: 'Safeguard Defenders Report on Police Stations',
    category: 'global',
    significance: 'high',
    description: 'Report reveals 102+ CCP overseas police stations operating in 53 countries.',
    details: 'The investigation documented a network of "overseas police service stations" used for transnational repression, including harassment, intimidation, and coerced returns of Chinese nationals abroad.',
    stations: '102+ in 53 countries',
    impact: 'Multiple countries launched investigations, some stations closed',
    sources: ['Safeguard Defenders', 'FBI', 'European Parliament']
  },
  // 2024
  {
    id: 20,
    date: '2024-11-19',
    title: 'Hong Kong 47 Sentenced',
    category: 'hongkong',
    significance: 'critical',
    description: 'Sentences handed down in largest National Security Law case.',
    details: 'After the longest NSL trial, sentences ranged from 4 to 10 years. Benny Tai received 10 years, Joshua Wong 4 years 8 months. The case effectively criminalized political participation.',
    sentences: '4-10 years for 45 defendants',
    impact: 'Completed destruction of Hong Kong\'s opposition',
    sources: ['Hong Kong Free Press', 'Amnesty International']
  },
  // 2025
  {
    id: 21,
    date: '2025-12-15',
    title: 'Jimmy Lai Found Guilty',
    category: 'hongkong',
    significance: 'critical',
    description: 'Jimmy Lai convicted on all charges after landmark 2-year trial.',
    details: 'The 78-year-old British citizen was found guilty of conspiracy to collude with foreign forces and sedition. He faces life imprisonment. The verdict was condemned by the UK, US, and EU.',
    sentence: 'Guilty on all 3 charges, sentencing pending',
    impact: 'International condemnation, calls for sanctions',
    sources: ['BBC', 'CNN', 'Reuters', 'UK Foreign Office']
  }
];

const categories = [
  { id: 'all', name: 'All Events', color: 'bg-slate-500' },
  { id: 'hongkong', name: 'Hong Kong', color: 'bg-yellow-500' },
  { id: 'uyghur', name: 'Uyghur/Xinjiang', color: 'bg-blue-500' },
  { id: 'tibet', name: 'Tibet', color: 'bg-red-500' },
  { id: 'mainland', name: 'Mainland China', color: 'bg-purple-500' },
  { id: 'falungong', name: 'Falun Gong', color: 'bg-orange-500' },
  { id: 'global', name: 'Global', color: 'bg-green-500' }
];

export default function InteractiveTimeline() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timelineRef = useRef(null);
  const playIntervalRef = useRef(null);

  const filteredEvents = selectedCategory === 'all' 
    ? timelineEvents 
    : timelineEvents.filter(e => e.category === selectedCategory);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && filteredEvents.length > 0) {
      playIntervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const next = (prev + 1) % filteredEvents.length;
          setSelectedEvent(filteredEvents[next]);
          return next;
        });
      }, 3000);
    }
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, filteredEvents]);

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : filteredEvents.length - 1;
    setCurrentIndex(newIndex);
    setSelectedEvent(filteredEvents[newIndex]);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % filteredEvents.length;
    setCurrentIndex(newIndex);
    setSelectedEvent(filteredEvents[newIndex]);
  };

  const getCategoryColor = (category) => {
    return categories.find(c => c.id === category)?.color || 'bg-slate-500';
  };

  const getSignificanceStyle = (significance) => {
    switch (significance) {
      case 'critical': return 'ring-2 ring-red-500';
      case 'high': return 'ring-2 ring-orange-500';
      default: return '';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getYearRange = () => {
    const years = filteredEvents.map(e => new Date(e.date).getFullYear());
    return { min: Math.min(...years), max: Math.max(...years) };
  };

  const yearRange = getYearRange();

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-red-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Interactive Timeline</h2>
            <p className="text-sm text-slate-400">Key events in the struggle against CCP authoritarianism</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
            className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-slate-300" />
          </button>
          <button
            onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
            className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              setSelectedEvent(null);
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? `${category.color} text-white`
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Timeline Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={handlePrevious}
          className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-300" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`p-3 rounded-lg transition-colors ${
            isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
        </button>
        <button
          onClick={handleNext}
          className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>
        <span className="text-slate-400 text-sm ml-4">
          {currentIndex + 1} / {filteredEvents.length} events
        </span>
      </div>

      {/* Timeline Visualization */}
      <div className="relative mb-6 overflow-x-auto" ref={timelineRef}>
        <div className="min-w-full py-8" style={{ transform: `scaleX(${zoomLevel})`, transformOrigin: 'left' }}>
          {/* Year markers */}
          <div className="flex justify-between mb-2 px-4">
            {Array.from({ length: yearRange.max - yearRange.min + 1 }, (_, i) => yearRange.min + i).map(year => (
              <span key={year} className="text-xs text-slate-500">{year}</span>
            ))}
          </div>
          
          {/* Timeline line */}
          <div className="relative h-2 bg-slate-700 rounded-full mx-4">
            {filteredEvents.map((event, index) => {
              const year = new Date(event.date).getFullYear();
              const position = ((year - yearRange.min) / (yearRange.max - yearRange.min)) * 100;
              return (
                <button
                  key={event.id}
                  onClick={() => {
                    setSelectedEvent(event);
                    setCurrentIndex(index);
                  }}
                  className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${getCategoryColor(event.category)} ${getSignificanceStyle(event.significance)} hover:scale-150 transition-transform cursor-pointer ${
                    selectedEvent?.id === event.id ? 'scale-150 ring-4 ring-white' : ''
                  }`}
                  style={{ left: `${position}%` }}
                  title={event.title}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Details */}
      {selectedEvent ? (
        <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-600">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getCategoryColor(selectedEvent.category)}`}>
                  {categories.find(c => c.id === selectedEvent.category)?.name}
                </span>
                {selectedEvent.significance === 'critical' && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-600 text-white">
                    Critical Event
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
              <p className="text-slate-400">{formatDate(selectedEvent.date)}</p>
            </div>
          </div>
          
          <p className="text-slate-300 mb-4">{selectedEvent.description}</p>
          
          <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
            <p className="text-slate-300 text-sm">{selectedEvent.details}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {selectedEvent.casualties && (
              <div className="bg-red-900/30 rounded-lg p-3">
                <p className="text-xs text-red-400 mb-1">Casualties</p>
                <p className="text-white font-semibold">{selectedEvent.casualties}</p>
              </div>
            )}
            {selectedEvent.detained && (
              <div className="bg-orange-900/30 rounded-lg p-3">
                <p className="text-xs text-orange-400 mb-1">Detained</p>
                <p className="text-white font-semibold">{selectedEvent.detained}</p>
              </div>
            )}
            {selectedEvent.participants && (
              <div className="bg-blue-900/30 rounded-lg p-3">
                <p className="text-xs text-blue-400 mb-1">Participants</p>
                <p className="text-white font-semibold">{selectedEvent.participants}</p>
              </div>
            )}
            {selectedEvent.sentence && (
              <div className="bg-purple-900/30 rounded-lg p-3">
                <p className="text-xs text-purple-400 mb-1">Sentence</p>
                <p className="text-white font-semibold">{selectedEvent.sentence}</p>
              </div>
            )}
            {selectedEvent.stations && (
              <div className="bg-green-900/30 rounded-lg p-3">
                <p className="text-xs text-green-400 mb-1">Police Stations</p>
                <p className="text-white font-semibold">{selectedEvent.stations}</p>
              </div>
            )}
          </div>
          
          {selectedEvent.impact && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-400 mb-2">Impact</h4>
              <p className="text-slate-300">{selectedEvent.impact}</p>
            </div>
          )}
          
          {selectedEvent.sources && (
            <div>
              <h4 className="text-sm font-semibold text-slate-400 mb-2">Sources</h4>
              <div className="flex flex-wrap gap-2">
                {selectedEvent.sources.map((source, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                    {source}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900/50 rounded-lg p-8 border border-slate-600 text-center">
          <Info className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">Click on a timeline marker to view event details</p>
          <p className="text-slate-500 text-sm mt-2">Or press Play to auto-advance through events</p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <h4 className="text-sm font-semibold text-slate-400 mb-3">Legend</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-500 ring-2 ring-red-500"></div>
            <span className="text-xs text-slate-400">Critical Event</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-500 ring-2 ring-orange-500"></div>
            <span className="text-xs text-slate-400">High Significance</span>
          </div>
          {categories.slice(1).map(cat => (
            <div key={cat.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
              <span className="text-xs text-slate-400">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-white">{timelineEvents.length}</p>
          <p className="text-xs text-slate-400">Total Events</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-white">{yearRange.max - yearRange.min + 1}</p>
          <p className="text-xs text-slate-400">Years Covered</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{timelineEvents.filter(e => e.significance === 'critical').length}</p>
          <p className="text-xs text-slate-400">Critical Events</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-yellow-400">{timelineEvents.filter(e => e.category === 'hongkong').length}</p>
          <p className="text-xs text-slate-400">Hong Kong Events</p>
        </div>
      </div>
    </div>
  );
}
