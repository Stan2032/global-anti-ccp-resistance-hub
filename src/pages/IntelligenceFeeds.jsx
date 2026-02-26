import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useLiveFeeds } from '../hooks/useLiveData';

const HongKongStatus = lazy(() => import('../components/HongKongStatus'));
const TibetStatus = lazy(() => import('../components/TibetStatus'));
const XinjiangStatus = lazy(() => import('../components/XinjiangStatus'));
const TaiwanDefenseStatus = lazy(() => import('../components/TaiwanDefenseStatus'));
const CCPOfficials = lazy(() => import('../components/CCPOfficials'));
const WorldThreatMap = lazy(() => import('../components/WorldThreatMap'));
const DetentionFacilities = lazy(() => import('../components/DetentionFacilities'));
const PoliceStationsMap = lazy(() => import('../components/PoliceStationsMap'));
const RegionalIssues = lazy(() => import('../components/RegionalIssues'));
const SanctionedOfficials = lazy(() => import('../components/SanctionedOfficials'));
const GlobalInfluenceMap = lazy(() => import('../components/GlobalInfluenceMap'));

const SectionLoader = () => (
  <div className="flex items-center justify-center py-8">
    <span className="font-mono text-[#4afa82] text-sm">$ loading</span><span className="font-mono text-[#4afa82] text-sm animate-pulse ml-0.5">█</span>
  </div>
);

const IntelligenceFeeds = () => {
  const { feeds, loading, error, lastUpdated, refresh, sources } = useLiveFeeds(300000);
  const [selectedSource, setSelectedSource] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('feeds');

  // Filter feeds based on source and search
  const filteredFeeds = useMemo(() => {
    return feeds.filter(feed => {
      const matchesSource = selectedSource === 'all' || feed.source === selectedSource;
      const matchesSearch = !searchQuery || 
        feed.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feed.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSource && matchesSearch;
    });
  }, [feeds, selectedSource, searchQuery]);

  // Format relative time
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get source badge color
  const getSourceColor = (source) => {
    const colors = {
      icij: 'bg-[#111820] text-[#22d3ee] border-[#1c2a35]',
      rfa: 'bg-[#111820] text-[#22d3ee] border-[#1c2a35]',
      hkfp: 'bg-[#4afa82]/10 text-[#4afa82] border-[#4afa82]/30',
      aspi: 'bg-orange-900/20 text-orange-300 border-orange-700/50',
    };
    return colors[source] || 'bg-[#1c2a35] text-slate-300 border-[#2a9a52]';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Live Intelligence Feed</h1>
            <p className="text-[#22d3ee]">
              Real-time news from verified sources worldwide
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-green-300">Live Connected</span>
            </div>
            {lastUpdated && (
              <span className="text-xs text-[#22d3ee]">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex space-x-1 border-b border-[#1c2a35] overflow-x-auto">
        {[
          { id: 'feeds', label: 'Live Feeds' },
          { id: 'regional', label: 'Regional Status' },
          { id: 'operations', label: 'CCP Operations' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-mono text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-[#4afa82] border-b-2 border-[#4afa82]'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'feeds' && (<>
      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={refresh}
          disabled={loading}
          className="px-4 py-2 bg-[#4afa82]/20 hover:bg-[#4afa82]/30 disabled:bg-[#111820] text-[#4afa82] border border-[#4afa82]/30 font-medium transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            aria-label="Search"
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#111820] border border-[#1c2a35] text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4afa82] focus:border-transparent"
          />
        </div>
        
        {/* Source Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSource('all')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              selectedSource === 'all'
                ? 'bg-[#4afa82]/20 text-[#4afa82] border border-[#4afa82]'
                : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35]'
            }`}
          >
            All Sources
          </button>
          {Object.entries(sources).map(([key, source]) => (
            <button
              key={key}
              onClick={() => setSelectedSource(key)}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                selectedSource === key
                  ? 'bg-[#4afa82]/20 text-[#4afa82] border border-[#4afa82]'
                  : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35]'
              }`}
            >
              {source.name}
            </button>
          ))}
        </div>
      </div>

      {/* Source Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(sources).map(([key, source]) => (
          <div key={key} className="bg-[#111820] border border-[#1c2a35] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">{source.name}</span>
              <span className="px-2 py-0.5 bg-green-900/50 text-green-400 text-xs rounded-full border border-green-700">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-2">{source.description}</p>
            <a 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-[#22d3ee] hover:text-white"
            >
              Visit source →
            </a>
          </div>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 p-4 text-red-300">
          <p className="font-medium">Error loading feeds</p>
          <p className="text-sm text-red-400 mt-1">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && feeds.length === 0 && (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-[#111820] border border-[#1c2a35] p-4 animate-pulse">
              <div className="h-4 bg-[#1c2a35] rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-[#1c2a35] rounded w-full mb-2"></div>
              <div className="h-3 bg-[#1c2a35] rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Feed Items */}
      {!loading && filteredFeeds.length === 0 && (
        <div className="text-center py-12 bg-[#111820] border border-[#1c2a35]">
          <p className="text-slate-400">No articles found matching your criteria</p>
        </div>
      )}

      <div className="space-y-4">
        {filteredFeeds.map((item) => (
          <article
            key={item.id}
            className="bg-[#111820] border border-[#1c2a35] p-4 sm:p-6 hover:border-[#2a9a52] transition-colors"
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getSourceColor(item.source)}`}>
                {sources[item.source]?.name || item.source.toUpperCase()}
              </span>
              <span className="text-xs text-slate-500">
                {formatTime(item.pubDate)}
              </span>
              {item.relevanceScore > 30 && (
                <span className="px-2 py-0.5 bg-red-900/50 text-red-300 text-xs rounded border border-red-700">
                  HIGH RELEVANCE
                </span>
              )}
            </div>
            
            <h2 className="text-lg font-semibold text-white mb-2 hover:text-white">
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
            </h2>
            
            {item.description && (
              <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                {item.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#22d3ee] hover:text-white text-sm font-medium"
              >
                Read full article →
              </a>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-[#1c2a35] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-[#1c2a35] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Stats Footer */}
      <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
        <p className="text-slate-400 text-sm">
          Showing {filteredFeeds.length} of {feeds.length} articles from {Object.keys(sources).length} verified sources
        </p>
        <p className="text-slate-500 text-xs mt-1">
          Data refreshes automatically every 5 minutes • Relevance scored by CCP-related keywords
        </p>
      </div>
      </>)}

      {activeTab === 'regional' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── hong_kong_status ──</h2>
            <Suspense fallback={<SectionLoader />}><HongKongStatus /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── xinjiang_status ──</h2>
            <Suspense fallback={<SectionLoader />}><XinjiangStatus /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── tibet_status ──</h2>
            <Suspense fallback={<SectionLoader />}><TibetStatus /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── taiwan_defense ──</h2>
            <Suspense fallback={<SectionLoader />}><TaiwanDefenseStatus /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── regional_issues ──</h2>
            <Suspense fallback={<SectionLoader />}><RegionalIssues /></Suspense>
          </div>
        </div>
      )}

      {activeTab === 'operations' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── ccp_officials ──</h2>
            <Suspense fallback={<SectionLoader />}><CCPOfficials /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── world_threat_map ──</h2>
            <Suspense fallback={<SectionLoader />}><WorldThreatMap /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── detention_facilities ──</h2>
            <Suspense fallback={<SectionLoader />}><DetentionFacilities /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── overseas_police_stations ──</h2>
            <Suspense fallback={<SectionLoader />}><PoliceStationsMap /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── sanctioned_officials ──</h2>
            <Suspense fallback={<SectionLoader />}><SanctionedOfficials /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── global_influence_map ──</h2>
            <Suspense fallback={<SectionLoader />}><GlobalInfluenceMap /></Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntelligenceFeeds;
