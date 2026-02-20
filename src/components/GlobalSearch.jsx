import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Newspaper, Users, Link, AlertTriangle, Megaphone, Target,
  MessageCircle, Lock, Wrench, BookOpen, GraduationCap, Shield, Globe,
  ShieldAlert, PenLine, Landmark, Siren, CircleDollarSign, Ban, Film,
  FileText, Mic, Search,
} from 'lucide-react';

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Searchable content database
  const searchableContent = [
    // Pages
    { type: 'page', title: 'Dashboard', description: 'Overview of resistance activities', path: '/', Icon: BarChart3, keywords: ['home', 'overview', 'stats'] },
    { type: 'page', title: 'Intelligence Feeds', description: 'Live news and updates', path: '/intelligence', Icon: Newspaper, keywords: ['news', 'rss', 'feeds'] },
    { type: 'page', title: 'Resistance Directory', description: 'Organizations fighting for human rights', path: '/directory', Icon: Users, keywords: ['organizations', 'ngos', 'groups'] },
    { type: 'page', title: 'Political Prisoners', description: 'Documented cases of political detention', path: '/prisoners', Icon: Link, keywords: ['detained', 'imprisoned', 'jail'] },
    { type: 'page', title: 'Regional Threats', description: 'CCP activities by region', path: '/threats', Icon: AlertTriangle, keywords: ['map', 'regions', 'countries'] },
    { type: 'page', title: 'Take Action', description: 'Ways to help and get involved', path: '/take-action', Icon: Megaphone, keywords: ['help', 'volunteer', 'donate', 'petition'] },
    { type: 'page', title: 'Campaigns', description: 'Active advocacy campaigns', path: '/campaigns', Icon: Target, keywords: ['activism', 'campaigns', 'movements'] },
    { type: 'page', title: 'Community', description: 'Connect with other activists', path: '/community', Icon: MessageCircle, keywords: ['forum', 'discussion', 'connect'] },
    { type: 'page', title: 'Communications', description: 'Secure communication tools', path: '/communications', Icon: Lock, keywords: ['secure', 'encrypted', 'privacy'] },
    { type: 'page', title: 'Resources', description: 'Tools and materials', path: '/resources', Icon: Wrench, keywords: ['tools', 'downloads', 'materials'] },
    { type: 'page', title: 'CCP Tactics', description: 'Understanding CCP methods', path: '/tactics', Icon: BookOpen, keywords: ['propaganda', 'influence', 'methods'] },
    { type: 'page', title: 'Education Center', description: 'Learning resources and courses', path: '/education', Icon: GraduationCap, keywords: ['learn', 'courses', 'training'] },
    { type: 'page', title: 'Security Center', description: 'Digital security guidance', path: '/security', Icon: Shield, keywords: ['security', 'privacy', 'protection'] },

    // Political Prisoners
    { type: 'prisoner', title: 'Jimmy Lai', description: 'Hong Kong media mogul, Apple Daily founder', path: '/prisoners', Icon: Link, keywords: ['hong kong', 'apple daily', 'media'] },
    { type: 'prisoner', title: 'Ilham Tohti', description: 'Uyghur economist, life sentence', path: '/prisoners', Icon: Link, keywords: ['uyghur', 'economist', 'xinjiang'] },
    { type: 'prisoner', title: 'Joshua Wong', description: 'Hong Kong democracy activist', path: '/prisoners', Icon: Link, keywords: ['hong kong', 'democracy', 'umbrella'] },
    { type: 'prisoner', title: 'Gedhun Choekyi Nyima', description: 'Panchen Lama, disappeared since 1995', path: '/prisoners', Icon: Link, keywords: ['tibet', 'panchen lama', 'buddhism'] },
    { type: 'prisoner', title: 'Gao Zhisheng', description: 'Human rights lawyer, disappeared', path: '/prisoners', Icon: Link, keywords: ['lawyer', 'disappeared', 'human rights'] },

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

    // Resources
    { type: 'resource', title: 'Security Quiz', description: 'Assess your digital security', path: '/security', Icon: Lock, keywords: ['quiz', 'assessment', 'security'] },
    { type: 'resource', title: 'Documentaries', description: 'Films about CCP human rights abuses', path: '/education', Icon: Film, keywords: ['films', 'movies', 'watch'] },
    { type: 'resource', title: 'Research Papers', description: 'Academic studies and reports', path: '/education', Icon: FileText, keywords: ['research', 'papers', 'academic'] },
    { type: 'resource', title: 'Podcasts', description: 'Audio content about China', path: '/education', Icon: Mic, keywords: ['podcasts', 'audio', 'listen'] },
    { type: 'resource', title: 'Books', description: 'Essential reading list', path: '/education', Icon: BookOpen, keywords: ['books', 'reading', 'literature'] },
  ];

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
        <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center px-4 border-b border-slate-700">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search pages, prisoners, topics, actions..."
              className="flex-1 px-4 py-4 bg-transparent text-white placeholder-slate-400 focus:outline-none"
              aria-label="Global search"
            />
            <kbd className="hidden md:inline-flex items-center px-2 py-1 text-xs text-slate-400 bg-slate-700 rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          {query && (
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-slate-400">
                  <div className="animate-spin w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full mx-auto mb-2" />
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
                            ? 'bg-blue-600/20 border-l-2 border-blue-500'
                            : 'hover:bg-slate-700/50'
                        }`}
                      >
                        <span className="text-2xl mr-3 flex items-center" aria-hidden="true">
                          {result.Icon ? <result.Icon className="w-6 h-6" /> : result.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <span className="font-medium text-white truncate">{result.title}</span>
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded ${
                              result.type === 'page' ? 'bg-blue-900 text-blue-300' :
                              result.type === 'prisoner' ? 'bg-red-900 text-red-300' :
                              result.type === 'topic' ? 'bg-purple-900 text-purple-300' :
                              result.type === 'action' ? 'bg-green-900 text-green-300' :
                              'bg-slate-700 text-slate-300'
                            }`}>
                              {result.type}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 truncate">{result.description}</p>
                        </div>
                        {index === selectedIndex && (
                          <kbd className="hidden md:inline-flex items-center px-2 py-1 text-xs text-slate-400 bg-slate-700 rounded ml-2">
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
                    className="flex items-center px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors text-left"
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
          <div className="px-4 py-3 border-t border-slate-700 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded mr-1">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded mr-1">↓</kbd>
                Navigate
              </span>
              <span className="flex items-center">
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded mr-1">↵</kbd>
                Select
              </span>
            </div>
            <span className="flex items-center">
              <kbd className="px-1.5 py-0.5 bg-slate-700 rounded mr-1">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-700 rounded mr-1">K</kbd>
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
