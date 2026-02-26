import React, { useState } from 'react';
import { Building2, MapPin, Users, Calendar, ExternalLink, AlertTriangle, Search, Filter, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { SourcesList } from './ui/SourceAttribution';
import detentionResearchData from '../data/detention_facilities_research.json';

// Import facility data from JSON — previously hardcoded in this component
const facilities = (detentionResearchData.facilities || []).map(f => ({
  id: f.id,
  name: f.name,
  chineseName: f.chinese_name,
  type: f.type,
  region: f.region,
  city: f.city,
  coordinates: f.coordinates,
  estimatedCapacity: f.estimated_capacity,
  status: f.status,
  firstDocumented: f.first_documented,
  description: f.description,
  evidence: f.evidence,
  sources: f.sources,
  satelliteImage: f.satellite_image_url || null,
}));

const regions = ['All Regions', 'Xinjiang', 'Tibet', 'Hong Kong', 'Mainland China'];
const types = ['All Types', 'Internment Camp', 'Prison', 'Detention Center', 'Maximum Security Prison', 'Secret Detention'];

// Process research data into source attribution format
const MAX_DESCRIPTION_LENGTH = 100;

// Trusted source domain mappings for categorization
const TRUSTED_SOURCES = {
  'xjdp.aspi.org.au': { type: 'NGO Report', org: 'Australian Strategic Policy Institute (ASPI)', name: 'ASPI Xinjiang Data Project' },
  'www.rand.org': { type: 'Academic Research', org: 'RAND Corporation', name: 'Tibet Prison Analysis' },
  'www.ap.org': { type: 'News Report', org: 'Associated Press', nameTemplate: 'AP Investigation: {region}' },
  'savetibet.org': { type: 'NGO Report', org: 'International Campaign for Tibet', nameTemplate: 'Tibet Report: {region}' },
  'en.wikipedia.org': { type: 'Reference', org: 'Wikipedia', nameTemplate: '{region}' },
  'www.hrw.org': { type: 'Human Rights Report', org: 'Human Rights Watch', nameTemplate: 'HRW Report: {region}' },
  'bitterwinter.org': { type: 'News Report', org: 'Bitter Winter', nameTemplate: '{region}' },
  'www.csd.gov.hk': { type: 'Government Document', org: 'Hong Kong Correctional Services Department', name: 'Hong Kong Prison Facilities' },
  'www.amnesty.org': { type: 'Human Rights Report', org: 'Amnesty International', name: 'Hong Kong Prison Conditions' },
  'www.aninews.in': { type: 'News Report', org: 'ANI News', nameTemplate: '{region}' },
  'faluninfo.net': { type: 'News Report', org: 'Falun Dafa Info Center', nameTemplate: '{region}' }
};

const truncateDescription = (text, maxLength) => {
  if (!text) return 'See source';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const categorizeDomain = (domain, region) => {
  // Check exact domain match first
  if (TRUSTED_SOURCES[domain]) {
    const source = TRUSTED_SOURCES[domain];
    return {
      type: source.type,
      organization: source.org,
      name: source.name || (source.nameTemplate ? source.nameTemplate.replace('{region}', region) : region),
      verified: source.type === 'Government Document' || source.type === 'Academic Research' || 
               source.org.includes('ASPI') || source.org.includes('RAND')
    };
  }
  
  // Fallback for generic sources
  return {
    type: 'Research Report',
    organization: '',
    name: region,
    verified: false
  };
};

const processResearchSources = () => {
  const sources = [];
  const seen = new Set();
  
  detentionResearchData.results.forEach(result => {
    const data = result.output;
    if (data.source_url && !seen.has(data.source_url)) {
      seen.add(data.source_url);
      
      // Parse URL to extract domain (trusted data source, not user input)
      let domain = '';
      try {
        const url = new URL(data.source_url);
        domain = url.hostname;
      } catch {
        // If URL parsing fails, skip this entry
        return;
      }
      
      // Categorize using exact domain matching
      const category = categorizeDomain(domain, data.region);
      
      sources.push({
        name: category.name,
        url: data.source_url,
        type: category.type,
        organization: category.organization,
        verified: category.verified,
        description: `Facility count: ${data.facility_count || 'Unknown'}. Key facilities: ${truncateDescription(data.key_facilities, MAX_DESCRIPTION_LENGTH)}`,
        date: 'Accessed 2024'
      });
    }
  });
  
  return sources;
};

const researchSources = processResearchSources();

export default function DetentionFacilities() {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedType, setSelectedType] = useState('All Types');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  const filteredFacilities = facilities.filter(facility => {
    if (selectedRegion !== 'All Regions' && facility.region !== selectedRegion) return false;
    if (selectedType !== 'All Types' && facility.type !== selectedType) return false;
    if (searchQuery && !facility.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !facility.city.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getTypeColor = (type) => {
    const colors = {
      'Internment Camp': 'bg-red-600',
      'Prison': 'bg-orange-600',
      'Detention Center': 'bg-yellow-600',
      'Maximum Security Prison': 'bg-purple-600',
      'Secret Detention': 'bg-gray-600',
    };
    return colors[type] || 'bg-gray-600';
  };

  const totalCapacity = facilities.reduce((sum, f) => {
    const num = parseInt(f.estimatedCapacity.replace(/[^0-9]/g, '')) || 0;
    return sum + num;
  }, 0);

  if (selectedFacility) {
    const facility = facilities.find(f => f.id === selectedFacility);
    
    return (
      <div className="bg-[#111820]/50 border border-[#1c2a35]">
        {/* Header */}
        <div className="p-6 border-b border-[#1c2a35]">
          <button
            onClick={() => setSelectedFacility(null)}
            className="text-[#22d3ee] hover:text-[#22d3ee] text-sm mb-4 flex items-center gap-1"
          >
            ← Back to all facilities
          </button>
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-[#111820] flex items-center justify-center">
              <Building2 className="w-8 h-8 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getTypeColor(facility.type)}`}>
                  {facility.type}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  facility.status === 'Active' ? 'bg-red-900 text-red-300' : 'bg-gray-700 text-gray-300'
                }`}>
                  {facility.status}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{facility.name}</h2>
              <p className="text-slate-400">{facility.chineseName}</p>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {facility.city}, {facility.region}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="p-6 border-b border-[#1c2a35] grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0a0e14]/50 p-3">
            <p className="text-xs text-slate-500 mb-1">Estimated Capacity</p>
            <p className="text-white font-medium">{facility.estimatedCapacity}</p>
          </div>
          <div className="bg-[#0a0e14]/50 p-3">
            <p className="text-xs text-slate-500 mb-1">First Documented</p>
            <p className="text-white font-medium">{facility.firstDocumented}</p>
          </div>
          <div className="bg-[#0a0e14]/50 p-3">
            <p className="text-xs text-slate-500 mb-1">Region</p>
            <p className="text-white font-medium">{facility.region}</p>
          </div>
          <div className="bg-[#0a0e14]/50 p-3">
            <p className="text-xs text-slate-500 mb-1">Status</p>
            <p className={`font-medium ${facility.status === 'Active' ? 'text-red-400' : 'text-gray-400'}`}>
              {facility.status}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 border-b border-[#1c2a35]">
          <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
          <p className="text-slate-300">{facility.description}</p>
        </div>

        {/* Evidence */}
        <div className="p-6 border-b border-[#1c2a35]">
          <button
            onClick={() => toggleSection('evidence')}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#22d3ee]" />
              Documented Evidence
            </h3>
            {expandedSections.evidence ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>
          
          {expandedSections.evidence !== false && (
            <ul className="mt-4 space-y-2">
              {facility.evidence.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <span className="text-[#22d3ee] mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sources */}
        <div className="p-6 border-b border-[#1c2a35]">
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Sources</h3>
          <div className="flex flex-wrap gap-2">
            {facility.sources.map((source, i) => (
              <span key={i} className="px-2 py-1 bg-[#111820] rounded text-sm text-slate-300">
                {source}
              </span>
            ))}
          </div>
        </div>

        {/* Satellite Imagery Link */}
        {facility.satelliteImage && (
          <div className="p-6">
            <a
              href={facility.satelliteImage}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              View Satellite Imagery (ASPI Xinjiang Data Project)
            </a>
          </div>
        )}

        {/* Coordinates */}
        {facility.coordinates && (
          <div className="px-6 pb-6">
            <p className="text-xs text-slate-500">
              Coordinates: {facility.coordinates.lat.toFixed(4)}°N, {facility.coordinates.lng.toFixed(4)}°E
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#111820]/50 p-6 border border-[#1c2a35]">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-6 h-6 text-red-400" />
        <div>
          <h2 className="text-xl font-bold text-white">Detention Facility Database</h2>
          <p className="text-sm text-slate-400">Documented detention centers, prisons, and internment camps</p>
        </div>
      </div>

      {/* Warning */}
      <div className="mb-6 p-4 bg-red-900/20 border border-red-700">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-300 font-medium">Sensitive Content Warning</p>
            <p className="text-sm text-slate-400 mt-1">
              This database documents facilities where severe human rights abuses have been reported, 
              including torture, forced labor, and deaths in custody.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0a0e14]/50 p-4 text-center">
          <p className="text-2xl font-bold text-white">{facilities.length}</p>
          <p className="text-xs text-slate-500">Facilities Documented</p>
        </div>
        <div className="bg-[#0a0e14]/50 p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{totalCapacity.toLocaleString()}+</p>
          <p className="text-xs text-slate-500">Est. Total Capacity</p>
        </div>
        <div className="bg-[#0a0e14]/50 p-4 text-center">
          <p className="text-2xl font-bold text-white">{new Set(facilities.map(f => f.region)).size}</p>
          <p className="text-xs text-slate-500">Regions</p>
        </div>
        <div className="bg-[#0a0e14]/50 p-4 text-center">
          <p className="text-2xl font-bold text-white">{facilities.filter(f => f.status === 'Active').length}</p>
          <p className="text-xs text-slate-500">Active Facilities</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            aria-label="Search"
            type="text"
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#111820] border border-[#1c2a35] text-white placeholder-slate-400"
          />
        </div>
        <select
          aria-label="Region filter"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="bg-[#111820] text-white text-sm px-3 py-2 border border-[#1c2a35]"
        >
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
        <select
          aria-label="Region filter"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-[#111820] text-white text-sm px-3 py-2 border border-[#1c2a35]"
        >
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Facilities Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredFacilities.map(facility => (
          <button
            key={facility.id}
            onClick={() => {
              setSelectedFacility(facility.id);
              setExpandedSections({ evidence: true });
            }}
            className="bg-[#0a0e14]/50 p-4 text-left hover:bg-[#0a0e14]/70 transition-colors border border-[#1c2a35] hover:border-[#2a9a52]"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-[#111820] flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium text-white ${getTypeColor(facility.type)}`}>
                    {facility.type}
                  </span>
                  {facility.status === 'Active' && (
                    <span className="px-1.5 py-0.5 rounded text-xs bg-red-900 text-red-300">
                      Active
                    </span>
                  )}
                </div>
                <h3 className="text-white font-semibold truncate">{facility.name}</h3>
                <p className="text-xs text-slate-500">{facility.chineseName}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="w-3 h-3" />
                {facility.city}, {facility.region}
              </div>
              <span className="text-xs text-slate-500">Cap: {facility.estimatedCapacity}</span>
            </div>
          </button>
        ))}
      </div>

      {filteredFacilities.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No facilities match your search</p>
        </div>
      )}

      {/* Resources */}
      <div className="mt-6 p-4 bg-[#0a0e14]/50 border border-[#1c2a35]">
        <h3 className="text-sm font-semibold text-white mb-3">Research Resources</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <a
            href="https://xjdp.aspi.org.au/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-[#111820] hover:bg-[#1c2a35] transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-[#22d3ee]" />
            <div>
              <p className="text-sm text-white">ASPI Xinjiang Data Project</p>
              <p className="text-xs text-slate-400">Satellite imagery database</p>
            </div>
          </a>
          <a
            href="https://www.xinjiangpolicefiles.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-[#111820] hover:bg-[#1c2a35] transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-[#22d3ee]" />
            <div>
              <p className="text-sm text-white">Xinjiang Police Files</p>
              <p className="text-xs text-slate-400">Leaked internal documents</p>
            </div>
          </a>
          <a
            href="https://shahit.biz/eng/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-[#111820] hover:bg-[#1c2a35] transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-[#22d3ee]" />
            <div>
              <p className="text-sm text-white">Xinjiang Victims Database</p>
              <p className="text-xs text-slate-400">35,000+ documented victims</p>
            </div>
          </a>
        </div>
      </div>

      {/* Research Sources */}
      <div className="mt-6">
        <SourcesList 
          sources={researchSources} 
          title="Research & Data Sources"
          compact={false}
        />
      </div>
    </div>
  );
}
