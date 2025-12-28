import React, { useState } from 'react';
import { Headphones, Play, ExternalLink, Search, Filter, Clock, Star } from 'lucide-react';

const PodcastPlayer = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const podcasts = [
    // China-focused podcasts
    {
      title: 'The China Show',
      host: 'China Uncensored',
      category: 'News & Analysis',
      description: 'Weekly deep dives into China news, CCP politics, and human rights issues. Hosted by experts who lived in China.',
      episodes: [
        {
          title: 'Inside China\'s Detention Camps',
          duration: '45:32',
          date: '2024-12-15',
          url: 'https://www.youtube.com/watch?v=example1',
          description: 'Survivor testimony and analysis of the camp system'
        },
        {
          title: 'How the CCP Controls Information',
          duration: '38:20',
          date: '2024-12-08',
          url: 'https://www.youtube.com/watch?v=example2',
          description: 'Deep dive into China\'s censorship apparatus'
        }
      ],
      website: 'https://www.youtube.com/@ChinaUncensored',
      rss: 'https://feeds.buzzsprout.com/example',
      frequency: 'Weekly',
      rating: 4.8,
      recommended: true
    },
    {
      title: 'Little Red Podcast',
      host: 'Louisa Lim & Graeme Smith',
      category: 'Culture & Politics',
      description: 'Exploring Chinese culture, politics, and society through conversations with experts, activists, and cultural figures.',
      episodes: [
        {
          title: 'Hong Kong\'s Lost Freedom',
          duration: '52:15',
          date: '2024-11-28',
          url: 'https://www.littleredpodcast.com/episode1',
          description: 'The erosion of civil liberties since the NSL'
        },
        {
          title: 'Uyghur Diaspora Stories',
          duration: '48:40',
          date: '2024-11-14',
          url: 'https://www.littleredpodcast.com/episode2',
          description: 'Conversations with Uyghurs living in exile'
        }
      ],
      website: 'https://www.littleredpodcast.com',
      rss: 'https://feeds.megaphone.fm/littlered',
      frequency: 'Bi-weekly',
      rating: 4.9,
      recommended: true
    },
    {
      title: 'China Unscripted',
      host: 'China Uncensored Team',
      category: 'News & Analysis',
      description: 'Unfiltered discussions about China, CCP politics, and what it means for the world.',
      episodes: [
        {
          title: 'China\'s Transnational Repression',
          duration: '56:12',
          date: '2024-12-10',
          url: 'https://www.youtube.com/watch?v=example3',
          description: 'How the CCP targets dissidents abroad'
        }
      ],
      website: 'https://www.youtube.com/@ChinaUnscripted',
      rss: 'https://feeds.buzzsprout.com/chinaunscripted',
      frequency: 'Weekly',
      rating: 4.7,
      recommended: true
    },

    // Xinjiang-focused
    {
      title: 'The Uyghur Voices Podcast',
      host: 'Various Hosts',
      category: 'Xinjiang',
      description: 'First-hand accounts from Uyghur survivors, activists, and community members.',
      episodes: [
        {
          title: 'Survivor Story: Escaping the Camps',
          duration: '42:30',
          date: '2024-12-01',
          url: 'https://example.com/uyghur-voices-1',
          description: 'A survivor shares their experience in detention'
        },
        {
          title: 'The Uyghur Diaspora in Turkey',
          duration: '38:45',
          date: '2024-11-15',
          url: 'https://example.com/uyghur-voices-2',
          description: 'Life in exile and advocacy work'
        }
      ],
      website: 'https://www.uyghurvoices.org',
      rss: 'https://feeds.example.com/uyghurvoices',
      frequency: 'Monthly',
      rating: 4.9,
      recommended: true
    },

    // Hong Kong-focused
    {
      title: 'Hong Kong Free Press Podcast',
      host: 'HKFP Team',
      category: 'Hong Kong',
      description: 'In-depth interviews and analysis on Hong Kong\'s fight for freedom and democracy.',
      episodes: [
        {
          title: 'The 47 Democrats: Hong Kong\'s Largest Trial',
          duration: '44:20',
          date: '2024-12-05',
          url: 'https://hongkongfp.com/podcast1',
          description: 'Analysis of the subversion trial'
        },
        {
          title: 'Life Under the NSL',
          duration: '39:15',
          date: '2024-11-20',
          url: 'https://hongkongfp.com/podcast2',
          description: 'How Hong Kongers are adapting to repression'
        }
      ],
      website: 'https://hongkongfp.com/podcast',
      rss: 'https://feeds.hongkongfp.com/podcast',
      frequency: 'Bi-weekly',
      rating: 4.8,
      recommended: true
    },

    // Tibet-focused
    {
      title: 'Voices from Tibet',
      host: 'International Campaign for Tibet',
      category: 'Tibet',
      description: 'Stories from Tibetan activists, monks, and community leaders fighting for freedom.',
      episodes: [
        {
          title: 'The Panchen Lama: 29 Years Missing',
          duration: '35:40',
          date: '2024-11-25',
          url: 'https://savetibet.org/podcast1',
          description: 'The story of the world\'s youngest political prisoner'
        }
      ],
      website: 'https://savetibet.org/podcast',
      rss: 'https://feeds.savetibet.org/podcast',
      frequency: 'Monthly',
      rating: 4.7,
      recommended: false
    },

    // General human rights
    {
      title: 'Intercepted',
      host: 'Jeremy Scahill',
      category: 'Human Rights',
      description: 'Investigative journalism covering human rights, war, and injustice worldwide, including China.',
      episodes: [
        {
          title: 'The Uyghur Genocide',
          duration: '58:30',
          date: '2024-10-15',
          url: 'https://theintercept.com/podcast/uyghur-genocide',
          description: 'Comprehensive investigation into the camps'
        }
      ],
      website: 'https://theintercept.com/podcasts/intercepted/',
      rss: 'https://feeds.theintercept.com/intercepted',
      frequency: 'Weekly',
      rating: 4.6,
      recommended: false
    },

    // Academic & Expert Analysis
    {
      title: 'Sinica Podcast',
      host: 'Kaiser Kuo',
      category: 'Academic',
      description: 'In-depth conversations with leading China experts on politics, culture, and society.',
      episodes: [
        {
          title: 'Adrian Zenz on Xinjiang Research',
          duration: '62:15',
          date: '2024-11-10',
          url: 'https://supchina.com/podcast/adrian-zenz',
          description: 'Leading researcher discusses his findings'
        },
        {
          title: 'Understanding CCP Ideology',
          duration: '55:40',
          date: '2024-10-28',
          url: 'https://supchina.com/podcast/ccp-ideology',
          description: 'Expert analysis of Xi Jinping Thought'
        }
      ],
      website: 'https://supchina.com/series/sinica/',
      rss: 'https://feeds.supchina.com/sinica',
      frequency: 'Weekly',
      rating: 4.8,
      recommended: true
    }
  ];

  const categories = ['all', 'News & Analysis', 'Xinjiang', 'Hong Kong', 'Tibet', 'Human Rights', 'Culture & Politics', 'Academic'];

  const filteredPodcasts = podcasts.filter(podcast => {
    const matchesCategory = selectedCategory === 'all' || podcast.category === selectedCategory;
    const matchesSearch = podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         podcast.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         podcast.host.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const recommendedPodcasts = podcasts.filter(p => p.recommended);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Headphones className="w-8 h-8 text-purple-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Podcast Library</h2>
          <p className="text-slate-400 text-sm">Listen to expert analysis and survivor stories</p>
        </div>
      </div>

      {/* Listening Guide */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-purple-400 font-bold mb-2">🎧 Recommended Listening</h3>
        <p className="text-slate-300 text-sm mb-2">
          Start with these highly-rated podcasts for comprehensive coverage of CCP human rights abuses.
        </p>
        <div className="flex flex-wrap gap-2">
          {recommendedPodcasts.map(podcast => (
            <span key={podcast.title} className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300">
              {podcast.title}
            </span>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search podcasts by title, host, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-900/50 text-slate-400 hover:bg-slate-900 hover:text-white border border-slate-700/50'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-purple-400 mb-1">{podcasts.length}</div>
          <div className="text-sm text-slate-400">Podcasts</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-blue-400 mb-1">{podcasts.reduce((acc, p) => acc + p.episodes.length, 0)}</div>
          <div className="text-sm text-slate-400">Episodes</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-green-400 mb-1">{recommendedPodcasts.length}</div>
          <div className="text-sm text-slate-400">Recommended</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-amber-400 mb-1">{categories.length - 1}</div>
          <div className="text-sm text-slate-400">Categories</div>
        </div>
      </div>

      {/* Podcast List */}
      <div className="space-y-6">
        {filteredPodcasts.map((podcast, index) => (
          <div key={index} className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-5 hover:border-purple-500/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">{podcast.title}</h3>
                  {podcast.recommended && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300">
                      <Star className="w-3 h-3 fill-purple-300" />
                      Recommended
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-sm text-slate-400">by {podcast.host}</span>
                  <span className="text-slate-600">•</span>
                  <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300">
                    {podcast.category}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300">
                    {podcast.frequency}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {podcast.rating}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-slate-300 text-sm mb-4">{podcast.description}</p>

            {/* Recent Episodes */}
            <div className="space-y-3 mb-4">
              <h4 className="text-sm font-semibold text-slate-400">Recent Episodes:</h4>
              {podcast.episodes.map((episode, epIndex) => (
                <div key={epIndex} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-medium text-white text-sm mb-1">{episode.title}</h5>
                      <p className="text-xs text-slate-400 mb-2">{episode.description}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {episode.duration}
                        </span>
                        <span>{episode.date}</span>
                      </div>
                    </div>
                    <a
                      href={episode.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                      title="Listen"
                    >
                      <Play className="w-4 h-4 text-white" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Links */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-700/50">
              <a
                href={podcast.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Website
              </a>
              {podcast.rss && (
                <a
                  href={podcast.rss}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                >
                  RSS Feed
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPodcasts.length === 0 && (
        <div className="text-center py-12">
          <Headphones className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No podcasts match your search criteria</p>
        </div>
      )}

      {/* Listening Tips */}
      <div className="mt-6 bg-slate-900/50 rounded-lg border border-slate-700/50 p-5">
        <h3 className="text-white font-bold mb-3">Listening Tips</h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p>• <strong>Start with recommended:</strong> These podcasts have the best coverage and credibility.</p>
          <p>• <strong>Subscribe via RSS:</strong> Use a podcast app to get automatic updates.</p>
          <p>• <strong>Cross-reference:</strong> Listen to multiple sources to get different perspectives.</p>
          <p>• <strong>Share episodes:</strong> Help spread awareness by sharing important episodes.</p>
          <p>• <strong>Support creators:</strong> Many podcasts rely on donations to continue their work.</p>
        </div>
      </div>
    </div>
  );
};

export default PodcastPlayer;
