import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Newspaper, Users, Link, AlertTriangle, Megaphone, Target,
  MessageCircle, Lock, Wrench, BookOpen, GraduationCap, Shield, Globe,
  ShieldAlert, PenLine, Landmark, Siren, CircleDollarSign, Ban, Film,
  FileText, Mic, Search,
} from 'lucide-react';

// Searchable content database (static — declared outside component to avoid re-creation on each render)
const searchableContent = [
  // Pages
  { type: 'page', title: 'Dashboard', description: 'Overview of resistance activities', path: '/', Icon: BarChart3, keywords: ['home', 'overview', 'stats'] },
  { type: 'page', title: 'Intelligence Feeds', description: 'Live news, updates, and regional threats', path: '/intelligence', Icon: Newspaper, keywords: ['news', 'rss', 'feeds', 'map', 'regions', 'countries', 'threats'] },
  { type: 'page', title: 'Resistance Directory', description: 'Organizations fighting for human rights', path: '/directory', Icon: Users, keywords: ['organizations', 'ngos', 'groups'] },
  { type: 'page', title: 'Political Prisoners', description: 'Documented cases of political detention', path: '/prisoners', Icon: Link, keywords: ['detained', 'imprisoned', 'jail'] },
  { type: 'page', title: 'Take Action', description: 'Ways to help, campaigns, and advocacy', path: '/take-action', Icon: Megaphone, keywords: ['help', 'volunteer', 'donate', 'petition', 'activism', 'campaigns', 'movements'] },
  { type: 'page', title: 'Community', description: 'Connect with other activists', path: '/community', Icon: MessageCircle, keywords: ['forum', 'discussion', 'connect'] },
  { type: 'page', title: 'Resources', description: 'Tools and materials', path: '/resources', Icon: Wrench, keywords: ['tools', 'downloads', 'materials'] },
  { type: 'page', title: 'Education Center', description: 'Learning resources, CCP tactics, and courses', path: '/education', Icon: GraduationCap, keywords: ['learn', 'courses', 'training', 'propaganda', 'influence', 'methods', 'tactics'] },
  { type: 'page', title: 'Security Center', description: 'Digital security and secure communications', path: '/security', Icon: Shield, keywords: ['security', 'privacy', 'protection', 'secure', 'encrypted'] },
  { type: 'page', title: 'Profiles', description: 'Detailed profiles of individuals targeted by the CCP', path: '/profiles', Icon: Users, keywords: ['profiles', 'jimmy lai', 'joshua wong', 'ilham tohti'] },

  // Profile Pages (all 12 individuals)
  { type: 'profile', title: 'Jimmy Lai', description: 'Hong Kong media mogul, Apple Daily founder — sentenced to 20 years', path: '/profiles/jimmy-lai', Icon: Users, keywords: ['hong kong', 'apple daily', 'media', 'nsl', 'press freedom'] },
  { type: 'profile', title: 'Ilham Tohti', description: 'Uyghur economist — life sentence for "separatism"', path: '/profiles/ilham-tohti', Icon: Users, keywords: ['uyghur', 'economist', 'xinjiang', 'sakharov'] },
  { type: 'profile', title: 'Joshua Wong', description: 'Hong Kong democracy activist — sentenced under NSL', path: '/profiles/joshua-wong', Icon: Users, keywords: ['hong kong', 'democracy', 'umbrella', 'demosisto'] },
  { type: 'profile', title: 'Gedhun Choekyi Nyima', description: 'Panchen Lama — disappeared since 1995', path: '/profiles/panchen-lama', Icon: Users, keywords: ['tibet', 'panchen lama', 'buddhism', 'disappeared'] },
  { type: 'profile', title: 'Liu Xiaobo', description: 'Nobel Peace Prize laureate — died in custody 2017', path: '/profiles/liu-xiaobo', Icon: Users, keywords: ['charter 08', 'nobel', 'democracy', 'dissident'] },
  { type: 'profile', title: 'Gui Minhai', description: 'Swedish-Chinese publisher — abducted from Thailand', path: '/profiles/gui-minhai', Icon: Users, keywords: ['causeway bay books', 'publisher', 'sweden', 'abduction'] },
  { type: 'profile', title: 'Zhang Zhan', description: 'Citizen journalist — imprisoned for COVID-19 reporting', path: '/profiles/zhang-zhan', Icon: Users, keywords: ['wuhan', 'covid', 'journalist', 'hunger strike'] },
  { type: 'profile', title: 'Gao Zhisheng', description: 'Human rights lawyer — disappeared since 2017', path: '/profiles/gao-zhisheng', Icon: Users, keywords: ['lawyer', 'disappeared', 'falun gong', 'human rights'] },
  { type: 'profile', title: 'Agnes Chow', description: 'Hong Kong activist — fled to Canada', path: '/profiles/agnes-chow', Icon: Users, keywords: ['hong kong', 'demosisto', 'nsl', 'exile'] },
  { type: 'profile', title: 'Nathan Law', description: 'Hong Kong activist — exiled in London', path: '/profiles/nathan-law', Icon: Users, keywords: ['hong kong', 'demosisto', 'exile', 'uk'] },
  { type: 'profile', title: 'Benny Tai', description: 'Legal scholar — Hong Kong 47 defendant', path: '/profiles/benny-tai', Icon: Users, keywords: ['hong kong', 'occupy central', 'legal scholar', 'hong kong 47'] },
  { type: 'profile', title: 'Cardinal Zen', description: 'Catholic cardinal — arrested under NSL', path: '/profiles/cardinal-zen', Icon: Users, keywords: ['catholic', 'cardinal', 'hong kong', 'religious freedom'] },
  { type: 'profile', title: 'Tashi Wangchuk', description: 'Tibetan language rights advocate — 5 years for "inciting separatism"', path: '/profiles/tashi-wangchuk', Icon: Users, keywords: ['tibet', 'language', 'education', 'separatism'] },
  { type: 'profile', title: 'Ren Zhiqiang', description: 'CCP member — 18 years after criticizing Xi\'s COVID response', path: '/profiles/ren-zhiqiang', Icon: Users, keywords: ['covid', 'corruption', 'real estate', 'xi jinping'] },
  { type: 'profile', title: 'Xu Zhiyong', description: 'Legal scholar — 14 years for New Citizens Movement', path: '/profiles/xu-zhiyong', Icon: Users, keywords: ['new citizens movement', 'legal scholar', 'subversion', 'rights'] },

  // Topics
  { type: 'topic', title: 'Uyghur Genocide', description: 'Documentation of atrocities in Xinjiang', path: '/education', Icon: BookOpen, keywords: ['xinjiang', 'camps', 'genocide', 'forced labor'] },
  { type: 'topic', title: 'Hong Kong Freedom', description: 'Democracy movement and NSL', path: '/education', Icon: BookOpen, keywords: ['nsl', 'democracy', 'protests', '2019'] },
  { type: 'topic', title: 'Tibet Rights', description: 'Tibetan independence movement', path: '/education', Icon: BookOpen, keywords: ['dalai lama', 'buddhism', 'independence'] },
  { type: 'topic', title: 'Taiwan Sovereignty', description: 'Cross-strait relations and defense', path: '/threats', icon: '🇹🇼', keywords: ['cross-strait', 'defense', 'independence'] },
  { type: 'topic', title: 'Transnational Repression', description: 'CCP activities abroad', path: '/tactics', Icon: Globe, keywords: ['police stations', 'fox hunt', 'diaspora'] },
  { type: 'topic', title: 'Overseas Police Stations', description: '102+ stations in 53 countries', path: '/threats', Icon: ShieldAlert, keywords: ['police', 'stations', 'safeguard defenders'] },

  // Actions
  { type: 'action', title: 'Sign Petitions', description: 'Add your voice to active campaigns', path: '/take-action', Icon: PenLine, keywords: ['petition', 'sign', 'campaign'] },
  { type: 'action', title: 'Contact Representatives', description: 'Write to your elected officials', path: '/take-action', Icon: Landmark, keywords: ['congress', 'parliament', 'letter'] },
  { type: 'action', title: 'Report CCP Activity', description: 'Document incidents of repression', path: '/community', Icon: Siren, keywords: ['report', 'incident', 'harassment'] },
  { type: 'action', title: 'Donate', description: 'Support human rights organizations', path: '/take-action', Icon: CircleDollarSign, keywords: ['donate', 'support', 'money'] },
  { type: 'action', title: 'Boycott Guide', description: 'Companies linked to forced labor', path: '/take-action', Icon: Ban, keywords: ['boycott', 'companies', 'forced labor'] },
  { type: 'action', title: 'Contact Us', description: 'Send a message to the Resistance Hub team', path: '/community', Icon: MessageCircle, keywords: ['contact', 'message', 'email', 'feedback', 'help'] },

  // Resources
  { type: 'resource', title: 'Security Quiz', description: 'Assess your digital security', path: '/security', Icon: Lock, keywords: ['quiz', 'assessment', 'security'] },
  { type: 'resource', title: 'Documentaries', description: 'Films about CCP human rights abuses', path: '/education', Icon: Film, keywords: ['films', 'movies', 'watch'] },
  { type: 'resource', title: 'Research Papers', description: 'Academic studies and reports', path: '/education', Icon: FileText, keywords: ['research', 'papers', 'academic'] },
  { type: 'resource', title: 'Podcasts', description: 'Audio content about China', path: '/education', Icon: Mic, keywords: ['podcasts', 'audio', 'listen'] },
  { type: 'resource', title: 'Books', description: 'Essential reading list', path: '/education', Icon: BookOpen, keywords: ['books', 'reading', 'literature'] },
];

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Search function
  const performSearch = useCallback((searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const normalizedQuery = searchQuery.toLowerCase().trim();
    
    const scored = searchableContent.map(item => {
      let score = 0;
      
      // Title match (highest priority)
      if (item.title.toLowerCase().includes(normalizedQuery)) {
        score += 100;
        if (item.title.toLowerCase().startsWith(normalizedQuery)) {
          score += 50;
        }
      }
      
      // Description match
      if (item.description.toLowerCase().includes(normalizedQuery)) {
        score += 30;
      }
      
      // Keyword match
      if (item.keywords.some(k => k.includes(normalizedQuery))) {
        score += 50;
      }
      
      // Exact keyword match
      if (item.keywords.includes(normalizedQuery)) {
        score += 30;
      }

      return { ...item, score };
    });

    const filtered = scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setResults(filtered);
    setSelectedIndex(0);
    setIsLoading(false);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 150);
    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          navigate(results[selectedIndex].path);
          onClose();
          setQuery('');
        }
        break;
      case 'Escape':
        onClose();
        setQuery('');
        break;
      default:
        break;
    }
  };

  // Handle result click
  const handleResultClick = (result) => {
    navigate(result.path);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Search Modal */}
      <div className="fixed inset-x-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50">
        <div className="bg-[#111820] border border-[#1c2a35] shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center px-4 border-b border-[#1c2a35]">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search pages, profiles, topics, actions..."
              className="flex-1 px-4 py-4 bg-transparent text-white placeholder-slate-400 focus:outline-none"
              aria-label="Global search"
            />
            <kbd className="hidden md:inline-flex items-center px-2 py-1 text-xs text-slate-400 bg-[#111820] rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          {query && (
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-slate-400">
                  <div className="animate-spin w-5 h-5 border-2 border-[#1c2a35] border-t-transparent rounded-full mx-auto mb-2" />
                  Searching...
                </div>
              ) : results.length > 0 ? (
                <ul role="listbox" className="py-2">
                  {results.map((result, index) => (
                    <li key={`${result.type}-${result.title}`}>
                      <button
                        role="option"
                        aria-selected={index === selectedIndex}
                        onClick={() => handleResultClick(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                          index === selectedIndex
                            ? 'bg-[#22d3ee]/20 border-l-2 border-[#1c2a35]'
                            : 'hover:bg-[#111820]/50'
                        }`}
                      >
                        <span className="text-2xl mr-3 flex items-center" aria-hidden="true">
                          {result.Icon ? <result.Icon className="w-6 h-6" /> : result.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <span className="font-medium text-white truncate">{result.title}</span>
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded ${
                              result.type === 'page' ? 'bg-[#111820] text-[#22d3ee]' :
                              result.type === 'profile' ? 'bg-amber-900 text-amber-300' :
                              result.type === 'prisoner' ? 'bg-red-900 text-red-300' :
                              result.type === 'topic' ? 'bg-purple-900 text-purple-300' :
                              result.type === 'action' ? 'bg-green-900 text-green-300' :
                              'bg-[#111820] text-slate-300'
                            }`}>
                              {result.type}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 truncate">{result.description}</p>
                        </div>
                        {index === selectedIndex && (
                          <kbd className="hidden md:inline-flex items-center px-2 py-1 text-xs text-slate-400 bg-[#111820] rounded ml-2">
                            ↵
                          </kbd>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center">
                  <Search className="w-10 h-10 mx-auto mb-3 text-slate-500" />
                  <p className="text-slate-400">No results found for "{query}"</p>
                  <p className="text-sm text-slate-500 mt-1">Try different keywords</p>
                </div>
              )}
            </div>
          )}

          {/* Quick Links (when no query) */}
          {!query && (
            <div className="p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Quick Links</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { title: 'Political Prisoners', path: '/prisoners', Icon: Link },
                  { title: 'Take Action', path: '/take-action', Icon: Megaphone },
                  { title: 'Report Incident', path: '/community', Icon: Siren },
                  { title: 'Security Quiz', path: '/security', Icon: Lock },
                ].map(link => (
                  <button
                    key={link.path}
                    onClick={() => handleResultClick(link)}
                    className="flex items-center px-3 py-2 bg-[#111820] hover:bg-[#111820] transition-colors text-left"
                  >
                    <span className="mr-2 flex items-center">
                      {link.Icon ? <link.Icon className="w-4 h-4" /> : link.icon}
                    </span>
                    <span className="text-sm text-slate-300">{link.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-3 border-t border-[#1c2a35] flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <kbd className="px-1.5 py-0.5 bg-[#111820] rounded mr-1">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-[#111820] rounded mr-1">↓</kbd>
                Navigate
              </span>
              <span className="flex items-center">
                <kbd className="px-1.5 py-0.5 bg-[#111820] rounded mr-1">↵</kbd>
                Select
              </span>
            </div>
            <span className="flex items-center">
              <kbd className="px-1.5 py-0.5 bg-[#111820] rounded mr-1">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-[#111820] rounded mr-1">K</kbd>
              to open
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

// Hook for global search keyboard shortcut
export const useGlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
};

export default GlobalSearch;
