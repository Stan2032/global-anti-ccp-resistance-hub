import React, { useState } from 'react';
import GlobalDisclaimer from './ui/GlobalDisclaimer';
import SourceAttribution, { SourcesList } from './ui/SourceAttribution';
import { User, Search, Filter, AlertTriangle, ExternalLink, Shield, MapPin, Calendar, Scale, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import sanctionedOfficialsData from '../data/sanctioned_officials_research.json';

// Helper function to map JSON sanction data to component format
const mapSanctionData = (jsonOfficial) => {
  const sanctionedBy = [];
  if (jsonOfficial.us_sanctions && jsonOfficial.us_sanctions.toLowerCase().startsWith('yes')) {
    sanctionedBy.push('USA');
  }
  if (jsonOfficial.uk_sanctions && jsonOfficial.uk_sanctions.toLowerCase().startsWith('yes')) {
    sanctionedBy.push('UK');
  }
  if (jsonOfficial.eu_sanctions && jsonOfficial.eu_sanctions.toLowerCase().startsWith('yes')) {
    sanctionedBy.push('EU');
  }
  if (jsonOfficial.canada_sanctions && jsonOfficial.canada_sanctions.toLowerCase().startsWith('yes')) {
    sanctionedBy.push('Canada');
  }
  if (jsonOfficial.australia_sanctions && jsonOfficial.australia_sanctions.toLowerCase().startsWith('yes')) {
    sanctionedBy.push('Australia');
  }
  return sanctionedBy;
};

// Helper function to determine level based on responsibility area
const getOfficialLevel = (responsibilityArea) => {
  if (responsibilityArea === 'National' || responsibilityArea === 'General') {
    return 'National';
  }
  return 'Provincial';
};

// Helper function to determine category based on responsibility area
const getOfficialCategory = (responsibilityArea) => {
  const categoryMap = {
    'Hong Kong': 'Regional',
    'Tibet': 'Regional',
    'Xinjiang': 'Regional',
    'General': 'Leadership'
  };
  return categoryMap[responsibilityArea] || 'Security';
};

// Helper function to get source name based on sanctions
const getSourceName = (sanctionedBy) => {
  const sourceMap = {
    'USA': 'US Treasury OFAC',
    'UK': 'UK Foreign Office',
    'EU': 'EU Sanctions',
    'Canada': 'Canada Global Affairs'
  };
  
  for (const country of ['USA', 'UK', 'EU', 'Canada']) {
    if (sanctionedBy.includes(country)) {
      return sourceMap[country];
    }
  }
  return 'Official Sanctions List';
};

// Helper function to extract year from sanction data
const extractSanctionYear = (official) => {
  const sanctionFields = [
    official.us_sanctions,
    official.uk_sanctions,
    official.eu_sanctions,
    official.canada_sanctions
  ];
  
  for (const field of sanctionFields) {
    if (field) {
      const yearMatch = field.match(/\b(20\d{2})\b/);
      if (yearMatch) {
        return yearMatch[1];
      }
    }
  }
  return null;
};

// Build officials list entirely from JSON data
const officials = sanctionedOfficialsData.results.map((result) => {
  const official = result.output;
  const sanctionedBy = mapSanctionData(official);
  
  return {
    id: official.name.toLowerCase().replace(/\s+/g, '-'),
    name: official.name,
    chineseName: official.chinese_name || '',
    position: official.position,
    level: getOfficialLevel(official.responsibility_area),
    region: official.responsibility_area === 'General' ? 'National' : official.responsibility_area,
    category: getOfficialCategory(official.responsibility_area),
    birthYear: official.birth_year || null,
    inPowerSince: official.in_power_since || null,
    sanctioned: sanctionedBy.length > 0,
    sanctionedBy: sanctionedBy,
    photo: null,
    responsibility: official.detailed_responsibilities || (official.key_abuses ? [official.key_abuses] : []),
    keyActions: official.key_actions || [],
    sources: official.source_url ? [{
      name: getSourceName(sanctionedBy),
      url: official.source_url,
      type: 'Government',
      verified: true,
      date: extractSanctionYear(official)
    }] : [],
    currentStatus: official.current_status
  };
});

// Government sanction list sources
const sanctionSources = [
  {
    name: 'US Treasury OFAC - Specially Designated Nationals List',
    url: 'https://home.treasury.gov/policy-issues/financial-sanctions/specially-designated-nationals-and-blocked-persons-list-sdn-human-readable-lists',
    type: 'Government',
    verified: true,
    organization: 'U.S. Department of the Treasury',
    description: 'Official list of individuals and entities sanctioned by the United States for human rights abuses, including officials responsible for repression in Xinjiang, Hong Kong, and Tibet.'
  },
  {
    name: 'UK Foreign Office - Sanctions List',
    url: 'https://www.gov.uk/government/collections/financial-sanctions-regime-specific-consolidated-lists-and-releases',
    type: 'Government',
    verified: true,
    organization: 'UK Foreign, Commonwealth & Development Office',
    description: 'UK government sanctions list including individuals responsible for serious human rights violations.'
  },
  {
    name: 'EU Sanctions Map',
    url: 'https://www.sanctionsmap.eu/',
    type: 'Government',
    verified: true,
    organization: 'European Union',
    description: 'European Union consolidated list of persons, groups and entities subject to EU financial sanctions.'
  },
  {
    name: 'Global Affairs Canada - Sanctions',
    url: 'https://www.international.gc.ca/world-monde/international_relations-relations_internationales/sanctions/index.aspx',
    type: 'Government',
    verified: true,
    organization: 'Government of Canada',
    description: 'Canadian autonomous sanctions against individuals and entities responsible for grave breaches of international peace and security.'
  }
];

export default function CCPOfficials() {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sanctionedOnly, setSanctionedOnly] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  const regions = ['all', ...new Set(officials.map(o => o.region))];
  const categories = ['all', ...new Set(officials.map(o => o.category))];

  const filteredOfficials = officials.filter(official => {
    if (searchQuery && !official.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !official.chineseName.includes(searchQuery) &&
        !official.position.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (regionFilter !== 'all' && official.region !== regionFilter) return false;
    if (categoryFilter !== 'all' && official.category !== categoryFilter) return false;
    if (sanctionedOnly && !official.sanctioned) return false;
    return true;
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (selectedOfficial) {
    const official = officials.find(o => o.id === selectedOfficial);
    
    return (
      <div className="bg-[#111820]/50 border border-[#1c2a35]">
        {/* Header */}
        <div className="p-6 border-b border-[#1c2a35]">
          <button
            onClick={() => setSelectedOfficial(null)}
            className="text-blue-400 hover:text-blue-300 text-sm mb-4 flex items-center gap-1"
          >
            ← Back to all officials
          </button>
          
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-[#111820] flex items-center justify-center text-4xl">
              {official.photo || <User className="w-10 h-10 text-slate-400" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {official.sanctioned && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-600 text-white">
                    SANCTIONED
                  </span>
                )}
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#111820] text-slate-300">
                  {official.level}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#111820] text-slate-300">
                  {official.region}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{official.name}</h2>
              <p className="text-slate-400">{official.chineseName}</p>
              <p className="text-sm text-slate-500 mt-1">{official.position}</p>
            </div>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="p-6 border-b border-[#1c2a35] grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0a0e14]/50 p-3">
            <p className="text-xs text-slate-500 mb-1">Born</p>
            <p className="text-white font-medium">{official.birthYear}</p>
          </div>
          <div className="bg-[#0a0e14]/50 p-3">
            <p className="text-xs text-slate-500 mb-1">In Power Since</p>
            <p className="text-white font-medium">{official.inPowerSince}</p>
          </div>
          <div className="bg-[#0a0e14]/50 p-3">
            <p className="text-xs text-slate-500 mb-1">Category</p>
            <p className="text-white font-medium">{official.category}</p>
          </div>
          <div className="bg-[#0a0e14]/50 p-3">
            <p className="text-xs text-slate-500 mb-1">Sanctioned</p>
            <p className={`font-medium ${official.sanctioned ? 'text-red-400' : 'text-slate-400'}`}>
              {official.sanctioned ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        {/* Sanctions */}
        {official.sanctioned && official.sanctionedBy && (
          <div className="p-6 border-b border-[#1c2a35]">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-red-400" />
              International Sanctions
            </h3>
            <div className="flex flex-wrap gap-2">
              {official.sanctionedBy.map((country, i) => (
                <span key={i} className="px-3 py-1.5 bg-red-900/30 border border-red-700 text-red-300">
                  {country === 'USA' ? '🇺🇸' : country === 'UK' ? '🇬🇧' : country === 'EU' ? '🇪🇺' : country === 'Canada' ? '🇨🇦' : <Globe className="w-4 h-4 inline-block" />} {country}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Responsibility */}
        <div className="p-6 border-b border-[#1c2a35]">
          <button
            onClick={() => toggleSection('responsibility')}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Areas of Responsibility
            </h3>
            {expandedSections.responsibility ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>
          
          {expandedSections.responsibility !== false && (
            <ul className="mt-4 space-y-2">
              {official.responsibility.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <span className="text-red-400 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Key Actions */}
        <div className="p-6 border-b border-[#1c2a35]">
          <button
            onClick={() => toggleSection('actions')}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Key Actions Timeline
            </h3>
            {expandedSections.actions ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>
          
          {expandedSections.actions !== false && (
            <div className="mt-4 space-y-3">
              {official.keyActions.map((action, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-16 flex-shrink-0 text-sm text-slate-500 font-medium">{action.year}</div>
                  <div className="flex-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 -ml-5 mr-3 float-left"></div>
                    <p className="text-slate-300">{action.action}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sources */}
        <div className="p-6">
          <SourcesList 
            sources={official.sources.filter(s => s.url && s.url !== '#')} 
            title="Official Sources & Documentation"
            compact={false}
          />
          
          {/* Additional references */}
          {official.sources.some(s => !s.url || s.url === '#') && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Additional References</h3>
              <div className="flex flex-wrap gap-2">
                {official.sources.filter(s => !s.url || s.url === '#').map((source, i) => (
                  <span key={i} className="px-2 py-1 bg-[#111820] rounded text-sm text-slate-300">
                    {source.name || source}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Current Status */}
          {official.currentStatus && (
            <div className="mt-4 p-3 bg-[#0a0e14]/50 border border-[#1c2a35]">
              <h3 className="text-xs font-semibold text-slate-400 mb-1">Current Status</h3>
              <p className="text-sm text-slate-300">{official.currentStatus}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111820]/50 p-6 border border-[#1c2a35]">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-red-400" />
        <div>
          <h2 className="text-xl font-bold text-white">CCP Officials Database</h2>
          <p className="text-sm text-slate-400">Key officials responsible for human rights abuses</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0a0e14]/50 p-4 text-center">
          <p className="text-2xl font-bold text-white">{officials.length}</p>
          <p className="text-xs text-slate-500">Officials Tracked</p>
        </div>
        <div className="bg-[#0a0e14]/50 p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{officials.filter(o => o.sanctioned).length}</p>
          <p className="text-xs text-slate-500">Sanctioned</p>
        </div>
        <div className="bg-[#0a0e14]/50 p-4 text-center">
          <p className="text-2xl font-bold text-white">{new Set(officials.map(o => o.region)).size}</p>
          <p className="text-xs text-slate-500">Regions</p>
        </div>
        <div className="bg-[#0a0e14]/50 p-4 text-center">
          <p className="text-2xl font-bold text-white">{new Set(officials.map(o => o.category)).size}</p>
          <p className="text-xs text-slate-500">Categories</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            aria-label="Search"
            type="text"
            placeholder="Search officials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#111820] border border-[#1c2a35] text-white placeholder-slate-400"
          />
        </div>
        <select
          aria-label="Region filter"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="bg-[#111820] text-white text-sm px-3 py-2 border border-[#1c2a35]"
        >
          {regions.map(region => (
            <option key={region} value={region}>{region === 'all' ? 'All Regions' : region}</option>
          ))}
        </select>
        <select
          aria-label="Category filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#111820] text-white text-sm px-3 py-2 border border-[#1c2a35]"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-400 px-3 py-2 bg-[#111820] border border-[#1c2a35]">
          <input
            type="checkbox"
            checked={sanctionedOnly}
            onChange={(e) => setSanctionedOnly(e.target.checked)}
            className="rounded bg-[#1c2a35] border-[#1c2a35]"
          />
          Sanctioned only
        </label>
      </div>

      {/* Officials Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredOfficials.map(official => (
          <button
            key={official.id}
            onClick={() => {
              setSelectedOfficial(official.id);
              setExpandedSections({ responsibility: true, actions: true });
            }}
            className="bg-[#0a0e14]/50 p-4 text-left hover:bg-[#0a0e14]/70 transition-colors border border-[#1c2a35] hover:border-[#2a9a52]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-[#111820] flex items-center justify-center text-2xl">
                {official.photo || <User className="w-6 h-6 text-slate-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {official.sanctioned && (
                    <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-red-600 text-white">
                      SANCTIONED
                    </span>
                  )}
                </div>
                <h3 className="text-white font-semibold truncate">{official.name}</h3>
                <p className="text-xs text-slate-500">{official.chineseName}</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 line-clamp-2 mb-2">{official.position}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="text-xs px-2 py-0.5 bg-[#111820] rounded text-slate-400">{official.region}</span>
                <span className="text-xs px-2 py-0.5 bg-[#111820] rounded text-slate-400">{official.category}</span>
              </div>
              <span className="text-blue-400 text-sm">View →</span>
            </div>
          </button>
        ))}
      </div>

      {filteredOfficials.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No officials match your search</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-[#0a0e14]/50 border border-[#1c2a35]">
        <p className="text-sm text-slate-400">
          <strong className="text-white">Note:</strong> This database documents officials based on their documented roles in human rights abuses. 
          Information is compiled from government sanctions lists, human rights reports, and verified news sources. 
          Sanctions status reflects designations by the US, UK, EU, Canada, and Australia.
        </p>
      </div>
      
      {/* Official Sanction List Sources */}
      <div className="mt-6">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Official Government Sanction Lists
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          Sanction information is sourced from official government databases. Click below to verify sanctions on official government websites:
        </p>
        <SourcesList sources={sanctionSources} title="" compact={false} />
      </div>
    </div>
  );
}
