import React, { useState } from 'react';
import { 
  GraduationCap, Search, ExternalLink, ChevronDown, ChevronUp,
  BookOpen, Mic, Twitter, AlertTriangle, Building, Globe,
  FileText, Shield
} from 'lucide-react';

// Import research data
import expertsData from '../data/academic_experts_research.json';

const ExpertiseBadge = ({ expertise }) => {
  const colors = {
    'Xinjiang/Uyghur': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Tibet': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Hong Kong': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'China Politics': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Human Rights': 'bg-red-500/20 text-red-400 border-red-500/30',
    'General China': 'bg-green-500/20 text-green-400 border-green-500/30'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[expertise] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
      {expertise}
    </span>
  );
};

const AcademicExperts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('all');
  const [expandedExpert, setExpandedExpert] = useState(null);

  const experts = expertsData.results.map(r => r.output);

  const expertiseAreas = [...new Set(experts.map(e => e.expertise))].filter(Boolean);

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.affiliation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.key_works?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExpertise = expertiseFilter === 'all' || expert.expertise === expertiseFilter;
    return matchesSearch && matchesExpertise;
  });

  // Calculate statistics
  const xinjiangExperts = experts.filter(e => e.expertise?.includes('Xinjiang') || e.expertise?.includes('Uyghur')).length;
  const tibetExperts = experts.filter(e => e.expertise?.includes('Tibet')).length;
  const hongKongExperts = experts.filter(e => e.expertise?.includes('Hong Kong')).length;
  const targetedExperts = experts.filter(e => e.ccp_targeting && e.ccp_targeting !== 'None documented').length;

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <GraduationCap className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Academic Experts Directory</h2>
            <p className="text-slate-400 text-sm">
              Leading scholars on China human rights • Verified research sources
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-blue-500/10 rounded-lg p-3 text-center border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-400">{xinjiangExperts}</div>
            <div className="text-xs text-slate-400">Xinjiang/Uyghur</div>
          </div>
          <div className="bg-orange-500/10 rounded-lg p-3 text-center border border-orange-500/20">
            <div className="text-2xl font-bold text-orange-400">{tibetExperts}</div>
            <div className="text-xs text-slate-400">Tibet</div>
          </div>
          <div className="bg-yellow-500/10 rounded-lg p-3 text-center border border-yellow-500/20">
            <div className="text-2xl font-bold text-yellow-400">{hongKongExperts}</div>
            <div className="text-xs text-slate-400">Hong Kong</div>
          </div>
          <div className="bg-red-500/10 rounded-lg p-3 text-center border border-red-500/20">
            <div className="text-2xl font-bold text-red-400">{targetedExperts}</div>
            <div className="text-xs text-slate-400">CCP Targeted</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-slate-700/50 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            aria-label="Search"
            type="text"
            placeholder="Search by name, affiliation, or work..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          aria-label="Expertise filter"
          value={expertiseFilter}
          onChange={(e) => setExpertiseFilter(e.target.value)}
          className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Expertise Areas</option>
          {expertiseAreas.map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>

      {/* Experts List */}
      <div className="p-4 max-h-[600px] overflow-y-auto">
        <div className="space-y-3">
          {filteredExperts.map((expert, idx) => (
            <div 
              key={idx} 
              className="bg-slate-700/30 rounded-lg overflow-hidden"
            >
              <div 
                className="p-4 cursor-pointer hover:bg-slate-700/50 transition-colors"
                onClick={() => setExpandedExpert(expandedExpert === idx ? null : idx)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-white font-semibold">{expert.name}</h4>
                      <ExpertiseBadge expertise={expert.expertise} />
                      {expert.ccp_targeting && expert.ccp_targeting !== 'None documented' && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          CCP Target
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Building className="w-3 h-3" />
                      {expert.affiliation || 'Independent'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {expert.twitter && expert.twitter !== 'None' && (
                      <a
                        href={`https://twitter.com/${expert.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    <div className="text-slate-500">
                      {expandedExpert === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedExpert === idx && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-600/50">
                  {expert.key_works && (
                    <div className="pt-3">
                      <div className="text-xs text-slate-500 uppercase mb-1 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        Key Works
                      </div>
                      <p className="text-sm text-slate-300">{expert.key_works}</p>
                    </div>
                  )}
                  
                  {expert.media_presence && expert.media_presence !== 'None documented' && (
                    <div>
                      <div className="text-xs text-slate-500 uppercase mb-1 flex items-center gap-1">
                        <Mic className="w-3 h-3" />
                        Media Presence
                      </div>
                      <p className="text-sm text-blue-300">{expert.media_presence}</p>
                    </div>
                  )}

                  {expert.ccp_targeting && expert.ccp_targeting !== 'None documented' && (
                    <div>
                      <div className="text-xs text-slate-500 uppercase mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        CCP Targeting
                      </div>
                      <p className="text-sm text-red-300">{expert.ccp_targeting}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 pt-2">
                    {expert.twitter && expert.twitter !== 'None' && (
                      <a
                        href={`https://twitter.com/${expert.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                      >
                        <Twitter className="w-3 h-3" />
                        {expert.twitter}
                      </a>
                    )}
                    {expert.source_url && (
                      <a
                        href={expert.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Profile
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {filteredExperts.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            No experts found matching your criteria
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
        <div className="text-sm text-slate-400">
          <Globe className="w-4 h-4 inline mr-1 text-purple-400" />
          These scholars are recognized experts whose work has been cited in government reports, tribunals, and major media outlets.
        </div>
      </div>
    </div>
  );
};

export default AcademicExperts;
