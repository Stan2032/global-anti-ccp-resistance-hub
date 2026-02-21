import React, { useState } from 'react';
import { Headphones, Search, Newspaper, Building2, Landmark, Mountain, Theater, Mic, Radio, RefreshCw, MapPin, Lightbulb, Star } from 'lucide-react';

const PodcastList = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedPodcast, setExpandedPodcast] = useState(null);

  const podcasts = [
    {
      id: 1,
      title: 'Sinica Podcast',
      host: 'Kaiser Kuo & Jeremy Goldkorn',
      category: 'analysis',
      description: 'Weekly discussions on Chinese politics, society, and culture with expert guests. One of the longest-running China podcasts.',
      episodes: 500,
      frequency: 'Weekly',
      language: 'English',
      platform: 'SupChina',
      url: 'https://supchina.com/sinica-podcast/',
      topics: ['Politics', 'Society', 'Culture', 'Economy'],
      rating: 4.8,
      featured: true
    },
    {
      id: 2,
      title: 'The Little Red Podcast',
      host: 'Louisa Lim & Graeme Smith',
      category: 'analysis',
      description: 'Deep dives into China\'s influence operations, propaganda, and global ambitions by two veteran journalists.',
      episodes: 150,
      frequency: 'Bi-weekly',
      language: 'English',
      platform: 'Independent',
      url: 'https://www.thelittleredpodcast.com/',
      topics: ['Influence Operations', 'Propaganda', 'Foreign Policy'],
      rating: 4.9,
      featured: true
    },
    {
      id: 3,
      title: 'China Unscripted',
      host: 'Chris Chappell, Shelley Zhang, Matt Gnaizda',
      category: 'news',
      description: 'Uncensored news and analysis about China, covering human rights, politics, and CCP activities.',
      episodes: 300,
      frequency: 'Multiple per week',
      language: 'English',
      platform: 'YouTube/Podcast',
      url: 'https://www.youtube.com/@ChinaUnscripted',
      topics: ['Human Rights', 'Politics', 'CCP', 'Taiwan'],
      rating: 4.7,
      featured: true
    },
    {
      id: 4,
      title: 'Hong Kong Free Press Podcast',
      host: 'HKFP Team',
      category: 'hongkong',
      description: 'Independent journalism from Hong Kong covering democracy, human rights, and local news.',
      episodes: 100,
      frequency: 'Weekly',
      language: 'English',
      platform: 'HKFP',
      url: 'https://hongkongfp.com/podcast/',
      topics: ['Hong Kong', 'Democracy', 'Press Freedom'],
      rating: 4.8,
      featured: false
    },
    {
      id: 5,
      title: 'Uyghur Pulse',
      host: 'Uyghur Human Rights Project',
      category: 'uyghur',
      description: 'Stories and analysis about the Uyghur crisis, featuring survivor testimonies and expert interviews.',
      episodes: 50,
      frequency: 'Monthly',
      language: 'English',
      platform: 'UHRP',
      url: 'https://uhrp.org/podcast/',
      topics: ['Uyghur Rights', 'Genocide', 'Testimonies'],
      rating: 4.9,
      featured: true
    },
    {
      id: 6,
      title: 'ChinaTalk',
      host: 'Jordan Schneider',
      category: 'analysis',
      description: 'In-depth conversations with China experts on technology, economics, and geopolitics.',
      episodes: 250,
      frequency: 'Weekly',
      language: 'English',
      platform: 'Substack',
      url: 'https://www.chinatalk.media/',
      topics: ['Technology', 'Economics', 'Geopolitics'],
      rating: 4.7,
      featured: false
    },
    {
      id: 7,
      title: 'Tibet Talks',
      host: 'International Campaign for Tibet',
      category: 'tibet',
      description: 'Discussions on Tibetan culture, human rights, and the freedom movement.',
      episodes: 80,
      frequency: 'Bi-weekly',
      language: 'English',
      platform: 'ICT',
      url: 'https://savetibet.org/resources/podcasts/',
      topics: ['Tibet', 'Buddhism', 'Human Rights', 'Culture'],
      rating: 4.6,
      featured: false
    },
    {
      id: 8,
      title: 'The China Project Podcast',
      host: 'Various hosts',
      category: 'analysis',
      description: 'News, analysis, and interviews covering all aspects of modern China.',
      episodes: 400,
      frequency: 'Multiple per week',
      language: 'English',
      platform: 'The China Project',
      url: 'https://thechinaproject.com/podcast/',
      topics: ['News', 'Business', 'Politics', 'Society'],
      rating: 4.6,
      featured: false
    },
    {
      id: 9,
      title: 'Laowai Talk',
      host: 'Various',
      category: 'culture',
      description: 'Perspectives from foreigners living in or studying China, with cultural insights.',
      episodes: 120,
      frequency: 'Weekly',
      language: 'English',
      platform: 'Independent',
      url: '#',
      topics: ['Culture', 'Society', 'Expat Life'],
      rating: 4.4,
      featured: false
    },
    {
      id: 10,
      title: 'Xinjiang Victims Database Podcast',
      host: 'Gene Bunin',
      category: 'uyghur',
      description: 'Documenting individual cases of Uyghur detention through interviews and research.',
      episodes: 30,
      frequency: 'Monthly',
      language: 'English',
      platform: 'XVD',
      url: 'https://shahit.biz/',
      topics: ['Documentation', 'Testimonies', 'Research'],
      rating: 4.9,
      featured: false
    },
    {
      id: 11,
      title: 'Dragonfly FM',
      host: 'Various',
      category: 'news',
      description: 'Chinese-language podcast covering uncensored news and commentary.',
      episodes: 200,
      frequency: 'Daily',
      language: 'Chinese',
      platform: 'Independent',
      url: '#',
      topics: ['News', 'Commentary', 'Analysis'],
      rating: 4.5,
      featured: false
    },
    {
      id: 12,
      title: 'China in Africa Podcast',
      host: 'Eric Olander & Cobus van Staden',
      category: 'analysis',
      description: 'Examining China\'s growing influence and investments across Africa.',
      episodes: 180,
      frequency: 'Weekly',
      language: 'English',
      platform: 'Independent',
      url: 'https://chinaafrica.com/',
      topics: ['Africa', 'BRI', 'Investment', 'Influence'],
      rating: 4.7,
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Podcasts', Icon: Headphones },
    { id: 'analysis', name: 'Analysis & Commentary', Icon: Search },
    { id: 'news', name: 'News & Current Events', Icon: Newspaper },
    { id: 'hongkong', name: 'Hong Kong', Icon: Building2 },
    { id: 'uyghur', name: 'Uyghur Rights', Icon: Landmark },
    { id: 'tibet', name: 'Tibet', Icon: Mountain },
    { id: 'culture', name: 'Culture & Society', Icon: Theater }
  ];

  const filteredPodcasts = selectedCategory === 'all' 
    ? podcasts 
    : podcasts.filter(p => p.category === selectedCategory);

  const featuredPodcasts = podcasts.filter(p => p.featured);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-purple-500 p-6">
        <div className="flex items-center mb-4">
          <Mic className="w-8 h-8 text-purple-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-white">Podcasts & Audio</h2>
            <p className="text-slate-400">Listen and learn from expert voices on China and human rights</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-[#111820]/50 p-3 text-center">
            <div className="text-2xl font-bold text-purple-400">{podcasts.length}</div>
            <div className="text-xs text-slate-400">Podcasts</div>
          </div>
          <div className="bg-[#111820]/50 p-3 text-center">
            <div className="text-2xl font-bold text-purple-400">{podcasts.reduce((sum, p) => sum + p.episodes, 0).toLocaleString()}</div>
            <div className="text-xs text-slate-400">Episodes</div>
          </div>
          <div className="bg-[#111820]/50 p-3 text-center">
            <div className="text-2xl font-bold text-purple-400">{categories.length - 1}</div>
            <div className="text-xs text-slate-400">Categories</div>
          </div>
          <div className="bg-[#111820]/50 p-3 text-center">
            <div className="text-2xl font-bold text-purple-400">{featuredPodcasts.length}</div>
            <div className="text-xs text-slate-400">Featured</div>
          </div>
        </div>
      </div>

      {/* Featured Podcasts */}
      <div className="bg-[#111820]/50 p-6 border border-[#1c2a35]">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <span className="text-yellow-500 mr-2">⭐</span>
          Featured Podcasts
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {featuredPodcasts.map(podcast => (
            <div key={podcast.id} className="bg-[#111820] p-4 border border-[#1c2a35] hover:border-purple-500 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-white">{podcast.title}</h4>
                <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 text-xs rounded-full">Featured</span>
              </div>
              <p className="text-sm text-slate-400 mb-2">Hosted by {podcast.host}</p>
              <p className="text-sm text-slate-300 mb-3">{podcast.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <span>{podcast.episodes} episodes</span>
                  <span>•</span>
                  <span>{podcast.frequency}</span>
                </div>
                <a 
                  href={podcast.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm transition-colors"
                >
                  Listen →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-purple-600 text-white'
                : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35]'
            }`}
          >
            <span className="mr-2"><cat.Icon className="w-4 h-4 inline" /></span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Podcast List */}
      <div className="space-y-4">
        {filteredPodcasts.map(podcast => (
          <div 
            key={podcast.id} 
            className="bg-[#111820]/50 border border-[#1c2a35] overflow-hidden hover:border-purple-500/50 transition-colors"
          >
            <div 
              className="p-4 cursor-pointer"
              onClick={() => setExpandedPodcast(expandedPodcast === podcast.id ? null : podcast.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h4 className="font-bold text-white mr-3">{podcast.title}</h4>
                    {podcast.featured && (
                      <span className="px-2 py-0.5 bg-yellow-900/50 text-yellow-400 text-xs rounded-full">⭐ Featured</span>
                    )}
                  </div>
                  <p className="text-sm text-purple-400 mb-2">Hosted by {podcast.host}</p>
                  <p className="text-sm text-slate-400">{podcast.description}</p>
                </div>
                <div className="ml-4 text-right">
                  <div className="flex items-center text-yellow-400 mb-1">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    <span className="text-sm">{podcast.rating}</span>
                  </div>
                  <span className="text-xs text-slate-500">{podcast.language}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1c2a35]">
                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1"><Radio className="w-3 h-3" /> {podcast.episodes} episodes</span>
                  <span className="inline-flex items-center gap-1"><RefreshCw className="w-3 h-3" /> {podcast.frequency}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {podcast.platform}</span>
                </div>
                <span className={`transform transition-transform ${expandedPodcast === podcast.id ? 'rotate-90' : ''}`}>
                  ▶
                </span>
              </div>
            </div>
            
            {expandedPodcast === podcast.id && (
              <div className="px-4 pb-4 border-t border-[#1c2a35] bg-[#0a0e14]/50">
                <div className="pt-4">
                  <h5 className="text-sm font-medium text-slate-300 mb-2">Topics Covered:</h5>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {podcast.topics.map((topic, idx) => (
                      <span key={idx} className="px-2 py-1 bg-[#111820] text-slate-300 text-xs rounded">
                        {topic}
                      </span>
                    ))}
                  </div>
                  <a 
                    href={podcast.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                  >
                    <Headphones className="w-4 h-4 inline mr-1" /> Listen Now
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Listening Tips */}
      <div className="bg-[#111820]/50 p-6 border border-[#1c2a35]">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5" /> Listening Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
          <div className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            <span>Cross-reference claims with multiple sources</span>
          </div>
          <div className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            <span>Check guest credentials and potential biases</span>
          </div>
          <div className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            <span>Use secure podcast apps that don't track listening habits</span>
          </div>
          <div className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            <span>Download episodes for offline listening in restricted areas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastList;
