import React, { useState } from 'react';
import { 
  UserX, Shield, AlertTriangle, Search, Filter, 
  ExternalLink, Flag, Globe, Scale, ChevronDown,
  ChevronUp, CheckCircle, XCircle
} from 'lucide-react';

// Import research data
import officialsData from '../data/sanctioned_officials_research.json';

const SanctionBadge = ({ country, status }) => {
  const isYes = status && status.toLowerCase().startsWith('yes');
  const flags = {
    'us': '🇺🇸',
    'uk': '🇬🇧',
    'eu': '🇪🇺',
    'canada': '🇨🇦',
    'australia': '🇦🇺'
  };
  
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
      isYes ? 'bg-green-500/20 text-green-400' : 'bg-[#1c2a35]/50 text-slate-500'
    }`}>
      <span>{flags[country]}</span>
      {isYes ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
    </div>
  );
};

const AreaBadge = ({ area }) => {
  const colors = {
    'Xinjiang': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Hong Kong': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Tibet': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Taiwan': 'bg-green-500/20 text-green-400 border-green-500/30',
    'General': 'bg-red-500/20 text-red-400 border-red-500/30'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[area] || 'bg-gray-500/20 text-gray-400'}`}>
      {area}
    </span>
  );
};

const SanctionedOfficialsTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('all');
  const [expandedOfficial, setExpandedOfficial] = useState(null);

  const officials = officialsData.results.map(r => r.output);

  const filteredOfficials = officials.filter(official => {
    const matchesSearch = official.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         official.position?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = areaFilter === 'all' || official.responsibility_area === areaFilter;
    return matchesSearch && matchesArea;
  });

  const countSanctions = (official) => {
    let count = 0;
    if (official.us_sanctions?.toLowerCase().startsWith('yes')) count++;
    if (official.uk_sanctions?.toLowerCase().startsWith('yes')) count++;
    if (official.eu_sanctions?.toLowerCase().startsWith('yes')) count++;
    if (official.canada_sanctions?.toLowerCase().startsWith('yes')) count++;
    if (official.australia_sanctions?.toLowerCase().startsWith('yes')) count++;
    return count;
  };

  const stats = {
    total: officials.length,
    xinjiang: officials.filter(o => o.responsibility_area === 'Xinjiang').length,
    hongKong: officials.filter(o => o.responsibility_area === 'Hong Kong').length,
    multiSanctioned: officials.filter(o => countSanctions(o) >= 3).length
  };

  return (
    <div className="bg-[#111820]/50 border border-[#1c2a35]/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#1c2a35]/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-500/20">
            <UserX className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Sanctioned CCP Officials</h2>
            <p className="text-slate-400 text-sm">
              Tracking officials sanctioned for human rights abuses • Data from Wide Research
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-[#111820]/30 p-3 text-center">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-slate-400">Officials Tracked</div>
          </div>
          <div className="bg-[#111820]/30 p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.xinjiang}</div>
            <div className="text-xs text-slate-400">Xinjiang-Related</div>
          </div>
          <div className="bg-[#111820]/30 p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.hongKong}</div>
            <div className="text-xs text-slate-400">Hong Kong-Related</div>
          </div>
          <div className="bg-[#111820]/30 p-3 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.multiSanctioned}</div>
            <div className="text-xs text-slate-400">Multi-Sanctioned (3+)</div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
          <span>Sanction Status:</span>
          <span className="flex items-center gap-1">🇺🇸 USA</span>
          <span className="flex items-center gap-1">🇬🇧 UK</span>
          <span className="flex items-center gap-1">🇪🇺 EU</span>
          <span className="flex items-center gap-1">🇨🇦 Canada</span>
          <span className="flex items-center gap-1">🇦🇺 Australia</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-[#1c2a35]/50 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            aria-label="Search"
            type="text"
            placeholder="Search by name or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#111820] border border-[#1c2a35] text-white placeholder-slate-400 focus:outline-none focus:border-[#4afa82]"
          />
        </div>
        <select
          aria-label="Area filter"
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="px-4 py-2 bg-[#111820] border border-[#1c2a35] text-white focus:outline-none focus:border-[#4afa82]"
        >
          <option value="all">All Areas</option>
          <option value="Xinjiang">Xinjiang</option>
          <option value="Hong Kong">Hong Kong</option>
          <option value="Tibet">Tibet</option>
          <option value="Taiwan">Taiwan</option>
          <option value="General">General</option>
        </select>
      </div>

      {/* Officials List */}
      <div className="p-4 max-h-[600px] overflow-y-auto">
        <div className="space-y-3">
          {filteredOfficials.map((official, idx) => (
            <div 
              key={idx} 
              className="bg-[#111820]/30 overflow-hidden"
            >
              <div 
                className="p-4 cursor-pointer hover:bg-[#111820]/50 transition-colors"
                onClick={() => setExpandedOfficial(expandedOfficial === idx ? null : idx)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedOfficial(expandedOfficial === idx ? null : idx) } }}
                role="button"
                tabIndex={0}
                aria-expanded={expandedOfficial === idx}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold">{official.name}</h4>
                      <AreaBadge area={official.responsibility_area} />
                    </div>
                    <p className="text-slate-400 text-sm">{official.position}</p>
                    
                    {/* Sanction Badges */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <SanctionBadge country="us" status={official.us_sanctions} />
                      <SanctionBadge country="uk" status={official.uk_sanctions} />
                      <SanctionBadge country="eu" status={official.eu_sanctions} />
                      <SanctionBadge country="canada" status={official.canada_sanctions} />
                      <SanctionBadge country="australia" status={official.australia_sanctions} />
                    </div>
                  </div>
                  
                  <div className="text-slate-500">
                    {expandedOfficial === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOfficial === idx && (
                <div className="px-4 pb-4 space-y-3 border-t border-[#1c2a35]/50">
                  <div className="pt-3">
                    <div className="text-xs text-slate-500 uppercase mb-1">Key Abuses</div>
                    <p className="text-sm text-red-300">{official.key_abuses}</p>
                  </div>
                  
                  <div>
                    <div className="text-xs text-slate-500 uppercase mb-1">Current Status</div>
                    <p className="text-sm text-slate-300">{official.current_status}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {official.us_sanctions && (
                      <div className="bg-[#1c2a35]/50 p-2 rounded">
                        <span className="text-slate-400">🇺🇸 US:</span> 
                        <span className="text-slate-300 ml-1">{official.us_sanctions}</span>
                      </div>
                    )}
                    {official.uk_sanctions && (
                      <div className="bg-[#1c2a35]/50 p-2 rounded">
                        <span className="text-slate-400">🇬🇧 UK:</span> 
                        <span className="text-slate-300 ml-1">{official.uk_sanctions}</span>
                      </div>
                    )}
                    {official.eu_sanctions && (
                      <div className="bg-[#1c2a35]/50 p-2 rounded">
                        <span className="text-slate-400">🇪🇺 EU:</span> 
                        <span className="text-slate-300 ml-1">{official.eu_sanctions}</span>
                      </div>
                    )}
                    {official.canada_sanctions && (
                      <div className="bg-[#1c2a35]/50 p-2 rounded">
                        <span className="text-slate-400">🇨🇦 Canada:</span> 
                        <span className="text-slate-300 ml-1">{official.canada_sanctions}</span>
                      </div>
                    )}
                    {official.australia_sanctions && (
                      <div className="bg-[#1c2a35]/50 p-2 rounded">
                        <span className="text-slate-400">🇦🇺 Australia:</span> 
                        <span className="text-slate-300 ml-1">{official.australia_sanctions}</span>
                      </div>
                    )}
                  </div>
                  
                  {official.source_url && (
                    <a
                      href={official.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Source
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {filteredOfficials.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            No officials found matching your criteria
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-[#1c2a35]/50 bg-[#111820]/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-slate-400">
            <Scale className="w-4 h-4 inline mr-1" />
            Advocate for more sanctions on human rights abusers
          </div>
          <a
            href="https://home.treasury.gov/policy-issues/financial-sanctions/specially-designated-nationals-and-blocked-persons-list-sdn-human-readable-lists"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            US Treasury SDN List
          </a>
        </div>
      </div>
    </div>
  );
};

export default SanctionedOfficialsTracker;
