import React, { useState, useEffect } from 'react';
import { Newspaper, Building2, Landmark, Mountain, Globe, Radio, FileText } from 'lucide-react';
import { dataProcessor } from '../data/liveDataSources';

const NewsAggregator = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch real RSS feed data
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const feedData = await dataProcessor.aggregateFeeds();
        // Combine news and threats into single feed
        const allNews = [...(feedData.news || []), ...(feedData.threats || [])];
        setNews(allNews);
      } catch (error) {
        console.error('Failed to load news:', error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  // NO HARDCODED DATA - All news comes from RSS feeds
  // Removed 10+ hardcoded news items - now using real RSS feeds
  
  /*
  OLD HARDCODED DATA REMOVED:
    {
      id: 1,
      title: 'Jimmy Lai Found Guilty on All Charges, Faces Life Sentence',
      source: 'Hong Kong Watch',
      date: '2025-12-15',
      category: 'hongkong',
      priority: 'CRITICAL',
      summary: 'Media tycoon and pro-democracy activist Jimmy Lai has been found guilty of sedition and collusion with foreign forces under Hong Kong\'s National Security Law.',
      url: 'https://www.hongkongwatch.org/'
    },
    {
      id: 2,
      title: 'UN Experts Call for Release of Uyghur Economist Ilham Tohti',
      source: 'OHCHR',
      date: '2024-12-18',
      category: 'uyghur',
      priority: 'HIGH',
      summary: 'UN human rights experts have renewed calls for China to release Ilham Tohti, who has been imprisoned for over 10 years on separatism charges.',
      url: 'https://www.ohchr.org/'
    },
    {
      id: 3,
      title: 'Taiwan Reports Record Chinese Military Activity Near Island',
      source: 'Reuters',
      date: '2024-12-17',
      category: 'taiwan',
      priority: 'HIGH',
      summary: 'Taiwan\'s defense ministry reported a record number of Chinese military aircraft and vessels operating near the island in the past 24 hours.',
      url: 'https://www.reuters.com/'
    },
    {
      id: 4,
      title: 'Canada Closes Three More CCP Police Stations',
      source: 'Globe and Mail',
      date: '2024-12-16',
      category: 'transnational',
      priority: 'MEDIUM',
      summary: 'Canadian authorities have shut down three additional locations identified as operating as unofficial Chinese police stations.',
      url: 'https://www.theglobeandmail.com/'
    },
    {
      id: 5,
      title: 'Tibetan Monk Sentenced to 4 Years for Sharing Dalai Lama Photos',
      source: 'Radio Free Asia',
      date: '2024-12-15',
      category: 'tibet',
      priority: 'HIGH',
      summary: 'A Tibetan Buddhist monk has been sentenced to four years in prison for sharing images of the Dalai Lama on social media.',
      url: 'https://www.rfa.org/'
    },
    {
      id: 6,
      title: 'EU Sanctions Additional CCP Officials Over Xinjiang Abuses',
      source: 'European Council',
      date: '2024-12-14',
      category: 'uyghur',
      priority: 'HIGH',
      summary: 'The European Union has added new names to its sanctions list targeting Chinese officials involved in human rights abuses in Xinjiang.',
      url: 'https://www.consilium.europa.eu/'
    },
    {
      id: 7,
      title: 'Hong Kong 47: Remaining Defendants Receive Sentences',
      source: 'HKFP',
      date: '2024-12-13',
      category: 'hongkong',
      priority: 'CRITICAL',
      summary: 'The final sentencing in the Hong Kong 47 case has concluded, with defendants receiving sentences ranging from 4 to 10 years.',
      url: 'https://hongkongfp.com/'
    },
    {
      id: 8,
      title: 'Report: CCP Expanding Surveillance Technology Exports to Africa',
      source: 'ASPI',
      date: '2024-12-12',
      category: 'transnational',
      priority: 'MEDIUM',
      summary: 'New research reveals China is accelerating exports of surveillance technology to African nations, raising human rights concerns.',
      url: 'https://www.aspi.org.au/'
    }
  */
  // ^^^ All hardcoded data removed - now using real RSS feeds from dataProcessor

  const categories = [
    { id: 'all', name: 'All News', Icon: Newspaper },
    { id: 'hongkong', name: 'Hong Kong', Icon: Building2 },
    { id: 'uyghur', name: 'Uyghur', Icon: Landmark },
    { id: 'tibet', name: 'Tibet', Icon: Mountain },
    { id: 'taiwan', name: 'Taiwan', icon: '🇹🇼' },
    { id: 'transnational', name: 'Transnational', Icon: Globe },
  ];

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-600';
      case 'HIGH': return 'bg-orange-600';
      case 'MEDIUM': return 'bg-yellow-600';
      default: return 'bg-slate-600';
    }
  };

  const getCategoryInfo = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat || { Icon: FileText };
  };

  if (loading) {
    return (
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/3"></div>
          <div className="h-4 bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Radio className="w-5 h-5" /> Latest Intelligence
        </h2>
        <span className="text-xs text-green-400 flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Live Updates
        </span>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
              selectedCategory === cat.id
                ? 'bg-red-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-[#1c2a35]'
            }`}
          >
            {cat.Icon ? <cat.Icon className="w-3 h-3" /> : <span>{cat.icon}</span>}
            {cat.name}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-3">
        {filteredNews.slice(0, 5).map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#111820] border border-[#1c2a35] p-4 hover:border-red-500/50 transition-colors group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {(() => { const info = getCategoryInfo(item.category); return info.Icon ? <info.Icon className="w-5 h-5" /> : <span className="text-lg">{info.icon}</span>; })()}
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                  <span className="text-xs text-slate-500">{item.source}</span>
                </div>
                <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                  {item.summary}
                </p>
              </div>
              <span className="text-xs text-slate-500 whitespace-nowrap">
                {item.date}
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center">
        <a
          href="/intelligence"
          className="text-red-400 hover:text-red-300 text-sm font-medium"
        >
          View all intelligence →
        </a>
      </div>
    </div>
  );
};

export default NewsAggregator;
