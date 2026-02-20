import React, { useState, useMemo } from 'react';
import { 
  Building, MapPin, AlertTriangle, CheckCircle, 
  XCircle, Search, Filter, ExternalLink, Globe,
  TrendingDown, School, Shield, Info
} from 'lucide-react';

// Import research data
import confuciusData from '../data/confucius_institutes_research.json';

const StatusBadge = ({ closed, total }) => {
  if (closed >= total && total > 0) {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
        ALL CLOSED
      </span>
    );
  } else if (closed > 0) {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
        PARTIALLY CLOSED
      </span>
    );
  } else if (total > 0) {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
        OPERATING
      </span>
    );
  }
  return (
    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
      NO DATA
    </span>
  );
};

const ConfuciusInstituteTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const institutes = confuciusData.results.map(r => ({
    ...r.output,
    totalInstitutes: typeof r.output.total_institutes === 'number' ? r.output.total_institutes : 0,
    closedCount: typeof r.output.closed_count === 'number' ? r.output.closed_count : 
                 (r.output.closed_count === '' ? 0 : parseInt(r.output.closed_count) || 0)
  }));

  const stats = useMemo(() => {
    const totalInstitutes = institutes.reduce((sum, i) => sum + i.totalInstitutes + i.closedCount, 0);
    const totalClosed = institutes.reduce((sum, i) => sum + i.closedCount, 0);
    const countriesWithCI = institutes.filter(i => i.totalInstitutes > 0 || i.closedCount > 0).length;
    const countriesFullyClosed = institutes.filter(i => i.closedCount > 0 && i.totalInstitutes === 0).length;
    return { totalInstitutes, totalClosed, countriesWithCI, countriesFullyClosed };
  }, [institutes]);

  const filteredInstitutes = institutes.filter(i => {
    const matchesSearch = i.country?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'closed' && i.closedCount >= i.totalInstitutes && i.closedCount > 0) ||
      (statusFilter === 'partial' && i.closedCount > 0 && i.closedCount < i.totalInstitutes) ||
      (statusFilter === 'operating' && i.totalInstitutes > 0 && i.closedCount === 0);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-[#111820]/50 border border-[#1c2a35]/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#1c2a35]/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-500/20">
            <School className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Confucius Institute Tracker</h2>
            <p className="text-slate-400 text-sm">
              Tracking CCP-linked institutes at universities worldwide • Data from Wide Research
            </p>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-700/30 p-3">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Building className="w-4 h-4" />
              Total Institutes
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalInstitutes}</div>
            <div className="text-xs text-slate-500">Worldwide (peak)</div>
          </div>
          <div className="bg-slate-700/30 p-3">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <XCircle className="w-4 h-4" />
              Closed
            </div>
            <div className="text-2xl font-bold text-green-400">{stats.totalClosed}</div>
            <div className="text-xs text-green-500">
              {((stats.totalClosed / stats.totalInstitutes) * 100).toFixed(0)}% closure rate
            </div>
          </div>
          <div className="bg-slate-700/30 p-3">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Globe className="w-4 h-4" />
              Countries
            </div>
            <div className="text-2xl font-bold text-white">{stats.countriesWithCI}</div>
            <div className="text-xs text-slate-500">With CI presence</div>
          </div>
          <div className="bg-slate-700/30 p-3">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Shield className="w-4 h-4" />
              CI-Free
            </div>
            <div className="text-2xl font-bold text-green-400">{stats.countriesFullyClosed}</div>
            <div className="text-xs text-green-500">Countries fully closed</div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-300">
              <strong>What are Confucius Institutes?</strong> CCP-funded programs at foreign universities 
              accused of spreading propaganda, censoring sensitive topics (Tibet, Taiwan, Tiananmen), 
              and conducting espionage. Many countries have closed them due to national security concerns.
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-4 border-b border-[#1c2a35]/50 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            aria-label="Search"
            type="text"
            placeholder="Search by country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          aria-label="Status filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Countries</option>
          <option value="closed">Fully Closed</option>
          <option value="partial">Partially Closed</option>
          <option value="operating">Still Operating</option>
        </select>
      </div>

      {/* Country List */}
      <div className="p-4 max-h-[600px] overflow-y-auto">
        <div className="space-y-3">
          {filteredInstitutes.map((institute, idx) => (
            <div 
              key={idx} 
              className="bg-slate-700/30 p-4 cursor-pointer hover:bg-[#111820]/50 transition-colors"
              onClick={() => setSelectedCountry(selectedCountry === idx ? null : idx)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-white font-semibold">{institute.country}</h4>
                    <StatusBadge closed={institute.closedCount} total={institute.totalInstitutes + institute.closedCount} />
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">
                        {institute.totalInstitutes} operating
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">
                        {institute.closedCount} closed
                      </span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedCountry === idx && (
                    <div className="mt-4 space-y-3 border-t border-slate-600/50 pt-3">
                      {institute.universities_closed && institute.universities_closed !== 'None' && (
                        <div>
                          <div className="text-xs text-slate-500 uppercase mb-1">Universities Closed</div>
                          <div className="text-sm text-slate-300">{institute.universities_closed}</div>
                        </div>
                      )}
                      
                      {institute.government_action && institute.government_action !== 'None' && (
                        <div>
                          <div className="text-xs text-slate-500 uppercase mb-1">Government Action</div>
                          <div className="text-sm text-slate-300">{institute.government_action}</div>
                        </div>
                      )}
                      
                      {institute.controversies && institute.controversies !== 'None' && (
                        <div>
                          <div className="text-xs text-slate-500 uppercase mb-1">Controversies</div>
                          <div className="text-sm text-yellow-300">{institute.controversies}</div>
                        </div>
                      )}
                      
                      {institute.latest_news && (
                        <div>
                          <div className="text-xs text-slate-500 uppercase mb-1">Latest News</div>
                          <div className="text-sm text-blue-300">{institute.latest_news}</div>
                        </div>
                      )}
                      
                      {institute.source_url && (
                        <a
                          href={institute.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Source
                        </a>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="text-slate-500">
                  {selectedCountry === idx ? '▲' : '▼'}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredInstitutes.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            No countries found matching your criteria
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-[#1c2a35]/50 bg-[#111820]/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-slate-400">
            <TrendingDown className="w-4 h-4 inline mr-1 text-green-400" />
            Global trend: Confucius Institutes declining due to security concerns
          </div>
          <a
            href="https://www.nas.org/blogs/article/how_many_confucius_institutes_are_in_the_united_states"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            NAS Confucius Institute Tracker
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConfuciusInstituteTracker;
