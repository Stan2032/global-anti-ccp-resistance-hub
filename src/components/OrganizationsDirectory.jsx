import React, { useState } from 'react';
import { 
  Users, Globe, Heart, Search, Filter, ExternalLink, 
  Star, Building, Newspaper, Scale, BookOpen, 
  Shield, CheckCircle, MapPin
} from 'lucide-react';

// Import research data
import orgsData from '../data/human_rights_orgs_research.json';

const FocusBadge = ({ focus }) => {
  const colors = {
    'Uyghur': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Hong Kong': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Tibet': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Taiwan': 'bg-green-500/20 text-green-400 border-green-500/30',
    'General China': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Media': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Research': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'Legal': 'bg-pink-500/20 text-pink-400 border-pink-500/30'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[focus] || 'bg-gray-500/20 text-gray-400'}`}>
      {focus}
    </span>
  );
};

const TypeIcon = ({ type }) => {
  const icons = {
    'Advocacy': Users,
    'Research': BookOpen,
    'Media': Newspaper,
    'Legal': Scale,
    'Direct Support': Heart,
    'Coalition': Building
  };
  const Icon = icons[type] || Users;
  return <Icon className="w-4 h-4" />;
};

const CredibilityBadge = ({ credibility }) => {
  if (credibility === 'High') {
    return (
      <span className="flex items-center gap-1 text-xs text-green-400">
        <CheckCircle className="w-3 h-3" />
        Highly Credible
      </span>
    );
  }
  return null;
};

const OrganizationsDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [focusFilter, setFocusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const organizations = orgsData.results.map(r => r.output);

  const filteredOrgs = organizations.filter(org => {
    const matchesSearch = org.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.key_work?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFocus = focusFilter === 'all' || org.focus_area === focusFilter;
    const matchesType = typeFilter === 'all' || org.org_type === typeFilter;
    return matchesSearch && matchesFocus && matchesType;
  });

  const focusAreas = [...new Set(organizations.map(o => o.focus_area).filter(Boolean))];
  const orgTypes = [...new Set(organizations.map(o => o.org_type).filter(Boolean))];

  const stats = {
    total: organizations.length,
    highCredibility: organizations.filter(o => o.credibility === 'High').length,
    withDonation: organizations.filter(o => o.donation_url && o.donation_url !== 'N/A').length
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Users className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Human Rights Organizations Directory</h2>
            <p className="text-slate-400 text-sm">
              {stats.total} verified organizations fighting for human rights in China • Data from Wide Research
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-slate-700/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-slate-400">Organizations</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.highCredibility}</div>
            <div className="text-xs text-slate-400">Highly Credible</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.withDonation}</div>
            <div className="text-xs text-slate-400">Accept Donations</div>
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
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          aria-label="Focus filter"
          value={focusFilter}
          onChange={(e) => setFocusFilter(e.target.value)}
          className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Focus Areas</option>
          {focusAreas.map(focus => (
            <option key={focus} value={focus}>{focus}</option>
          ))}
        </select>
        <select
          aria-label="Type filter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Types</option>
          {orgTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Organizations List */}
      <div className="p-4 max-h-[600px] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrgs.map((org, idx) => (
            <div 
              key={idx} 
              className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-600/50 rounded">
                    <TypeIcon type={org.org_type} />
                  </div>
                  <h4 className="text-white font-semibold text-sm">{org.organization}</h4>
                </div>
                <FocusBadge focus={org.focus_area} />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-3 h-3" />
                  <span>{org.headquarters || 'Unknown'}</span>
                  {org.founded_year && (
                    <span className="text-slate-500">• Est. {org.founded_year}</span>
                  )}
                </div>

                <CredibilityBadge credibility={org.credibility} />

                <p className="text-slate-300 text-xs line-clamp-2">
                  {org.key_work}
                </p>

                {org.latest_news && (
                  <p className="text-blue-400 text-xs">
                    <span className="flex items-center gap-1"><Newspaper className="w-3 h-3" /> {org.latest_news}</span>
                  </p>
                )}

                <div className="flex items-center gap-2 pt-2">
                  {org.website && org.website !== 'N/A' && (
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 bg-slate-600/50 rounded text-xs text-slate-300 hover:bg-slate-600"
                    >
                      <Globe className="w-3 h-3" />
                      Website
                    </a>
                  )}
                  {org.donation_url && org.donation_url !== 'N/A' && (
                    <a
                      href={org.donation_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 bg-green-600/30 rounded text-xs text-green-400 hover:bg-green-600/50"
                    >
                      <Heart className="w-3 h-3" />
                      Donate
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredOrgs.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            No organizations found matching your criteria
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
        <div className="text-sm text-slate-400 text-center">
          <Shield className="w-4 h-4 inline mr-1" />
          All organizations verified through Wide Research parallel processing
        </div>
      </div>
    </div>
  );
};

export default OrganizationsDirectory;
