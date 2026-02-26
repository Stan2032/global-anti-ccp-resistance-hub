import React, { useState, useMemo } from 'react';
import IPACMembers from '../components/IPACMembers';
import GlobalDisclaimer from '../components/ui/GlobalDisclaimer';
import { Users, Search, ExternalLink, Globe, MapPin, Calendar, CheckCircle, Filter } from 'lucide-react';
import organizationsData from '../../organizations-data.json';

const organizations = organizationsData.organizations;
const categories = [...new Set(organizations.map(org => org.category))].sort();
const combinedYears = new Date().getFullYear() - Math.min(...organizations.map(o => o.established));

const ResistanceDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOrg, setSelectedOrg] = useState(null);

  // Filter organizations
  const filteredOrgs = useMemo(() => {
    return organizations.filter(org => {
      const matchesSearch = !searchQuery || 
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (org.acronym && org.acronym.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || org.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Category colors
  const getCategoryColor = (category) => {
    const colors = {
      'Uyghur Rights': 'bg-[#111820]/50 text-[#22d3ee] border-[#1c2a35]',
      'Tibetan Rights': 'bg-orange-900/50 text-orange-300 border-orange-700',
      'Hong Kong Democracy': 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
      'Human Rights': 'bg-green-900/50 text-green-300 border-green-700',
      'Press Freedom': 'bg-purple-900/50 text-purple-300 border-purple-700',
      'Research': 'bg-cyan-900/50 text-cyan-300 border-cyan-700',
      'Democracy': 'bg-pink-900/50 text-pink-300 border-pink-700',
      'Government': 'bg-red-900/50 text-red-300 border-red-700',
    };
    return colors[category] || 'bg-[#1c2a35] text-slate-300 border-[#2a9a52]';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Users className="w-10 h-10" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">Resistance Directory</h1>
              <p className="text-[#22d3ee]">
                Global database of verified organizations fighting CCP authoritarianism
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1">
            <span className="text-2xl font-bold">{organizations.length}</span>
            <span className="text-sm text-[#22d3ee]">Verified Organizations</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
          <div className="text-2xl font-bold text-[#22d3ee]">{categories.length}</div>
          <div className="text-xs text-slate-400">Categories</div>
        </div>
        <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{organizations.filter(o => o.region === 'Global').length}</div>
          <div className="text-xs text-slate-400">Global Reach</div>
        </div>
        <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{organizations.filter(o => o.verified).length}</div>
          <div className="text-xs text-slate-400">Verified</div>
        </div>
        <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{combinedYears}+</div>
          <div className="text-xs text-slate-400">Years Combined</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            aria-label="Search"
            type="text"
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111820] border border-[#1c2a35] text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4afa82]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            aria-label="Filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-[#111820] border border-[#1c2a35] text-white focus:outline-none focus:ring-2 focus:ring-[#4afa82]"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-[#22d3ee] text-[#0a0e14]'
              : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35]'
          }`}
        >
          All ({organizations.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-[#22d3ee] text-[#0a0e14]'
                : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35]'
            }`}
          >
            {cat} ({organizations.filter(o => o.category === cat).length})
          </button>
        ))}
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredOrgs.map(org => (
          <button
            type="button"
            key={org.id}
            onClick={() => setSelectedOrg(selectedOrg?.id === org.id ? null : org)}
            aria-expanded={selectedOrg?.id === org.id}
            className={`bg-[#111820] border p-4 cursor-pointer transition-all text-left w-full hover:border-[#1c2a35] ${
              selectedOrg?.id === org.id ? 'border-[#1c2a35] ring-1 ring-[#4afa82]' : 'border-[#1c2a35]'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{org.name}</h3>
                  {org.verified && (
                    <CheckCircle className="w-4 h-4 text-green-400" title="Verified Organization" />
                  )}
                </div>
                {org.acronym && (
                  <span className="text-sm text-slate-400">({org.acronym})</span>
                )}
              </div>
              <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getCategoryColor(org.category)}`}>
                {org.category}
              </span>
            </div>

            <p className="text-sm text-slate-400 mb-3 line-clamp-2">{org.description}</p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {org.headquarters}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Est. {org.established}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {org.region}
              </span>
            </div>

            {/* Expanded Details */}
            {selectedOrg?.id === org.id && (
              <div className="mt-4 pt-4 border-t border-[#1c2a35]">
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Focus Areas</h4>
                  <div className="flex flex-wrap gap-1">
                    {org.focus.map(f => (
                      <span key={f} className="px-2 py-0.5 bg-[#1c2a35] text-slate-300 text-xs rounded">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] text-sm font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Website
                </a>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* No Results */}
      {filteredOrgs.length === 0 && (
        <div className="text-center py-12 bg-[#111820] border border-[#1c2a35]">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No organizations found matching your criteria</p>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
        <p className="text-slate-400 text-sm">
          Showing {filteredOrgs.length} of {organizations.length} verified organizations
        </p>
        <p className="text-slate-500 text-xs mt-1">
          All organizations are independently verified • Click an organization to view details
        </p>
      </div>

      {/* IPAC Members */}
      <div className="mt-8">
        <IPACMembers />
      </div>

      {/* Disclaimer */}
      <GlobalDisclaimer type="sensitive" />
    </div>
  );
};

export default ResistanceDirectory;
