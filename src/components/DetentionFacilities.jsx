import React, { useState } from 'react';
import { Building2, MapPin, Users, Calendar, ExternalLink, AlertTriangle, Search, Filter, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { SourcesList } from './ui/SourceAttribution';
import detentionResearchData from '../data/detention_facilities_research.json';

const facilities = [
  // Xinjiang
  {
    id: 'xj-001',
    name: 'Dabancheng Internment Camp',
    chineseName: '达坂城',
    type: 'Internment Camp',
    region: 'Xinjiang',
    city: 'Ürümqi',
    coordinates: { lat: 43.3633, lng: 88.3114 },
    estimatedCapacity: '10,000+',
    status: 'Active',
    firstDocumented: '2018',
    description: 'One of the largest detention facilities in Xinjiang. Satellite imagery shows massive expansion since 2017.',
    evidence: [
      'Satellite imagery from ASPI',
      'Xinjiang Police Files documents',
      'Survivor testimonies',
    ],
    sources: ['ASPI Xinjiang Data Project', 'Xinjiang Police Files', 'BuzzFeed News'],
    satelliteImage: 'https://xjdp.aspi.org.au/',
  },
  {
    id: 'xj-002',
    name: 'Artux City Vocational Skills Education Training Center',
    chineseName: '阿图什市职业技能教育培训中心',
    type: 'Internment Camp',
    region: 'Xinjiang',
    city: 'Artux',
    coordinates: { lat: 39.7164, lng: 76.1683 },
    estimatedCapacity: '8,000+',
    status: 'Active',
    firstDocumented: '2017',
    description: 'Large facility documented in leaked government documents. Features high-security perimeter and watchtowers.',
    evidence: [
      'China Cables leaked documents',
      'Satellite imagery',
      'Drone footage',
    ],
    sources: ['ICIJ China Cables', 'ASPI', 'BBC'],
    satelliteImage: 'https://xjdp.aspi.org.au/',
  },
  {
    id: 'xj-003',
    name: 'Kashgar Detention Center',
    chineseName: '喀什拘留中心',
    type: 'Detention Center',
    region: 'Xinjiang',
    city: 'Kashgar',
    coordinates: { lat: 39.4547, lng: 75.9797 },
    estimatedCapacity: '5,000+',
    status: 'Active',
    firstDocumented: '2017',
    description: 'Multiple facilities in Kashgar area. Documented forced labor and political indoctrination.',
    evidence: [
      'Xinjiang Police Files photos',
      'Survivor testimonies',
      'Satellite imagery',
    ],
    sources: ['Xinjiang Police Files', 'Human Rights Watch', 'AP'],
    satelliteImage: 'https://xjdp.aspi.org.au/',
  },
  {
    id: 'xj-004',
    name: 'Hotan Vocational Training Center',
    chineseName: '和田职业培训中心',
    type: 'Internment Camp',
    region: 'Xinjiang',
    city: 'Hotan',
    coordinates: { lat: 37.1000, lng: 79.9269 },
    estimatedCapacity: '7,000+',
    status: 'Active',
    firstDocumented: '2018',
    description: 'Large-scale facility with documented forced labor programs producing textiles and electronics.',
    evidence: [
      'ASPI forced labor research',
      'Corporate supply chain audits',
      'Satellite imagery',
    ],
    sources: ['ASPI Uyghurs for Sale', 'NYT', 'Reuters'],
    satelliteImage: 'https://xjdp.aspi.org.au/',
  },
  {
    id: 'xj-005',
    name: 'Turpan Detention Facility',
    chineseName: '吐鲁番拘留设施',
    type: 'Prison',
    region: 'Xinjiang',
    city: 'Turpan',
    coordinates: { lat: 42.9513, lng: 89.1895 },
    estimatedCapacity: '3,000+',
    status: 'Active',
    firstDocumented: '2019',
    description: 'High-security prison facility. Multiple reports of torture and deaths in custody.',
    evidence: [
      'Leaked internal documents',
      'Family testimonies',
      'Satellite expansion tracking',
    ],
    sources: ['Xinjiang Victims Database', 'Amnesty International', 'UHRP'],
    satelliteImage: 'https://xjdp.aspi.org.au/',
  },
  // Tibet
  {
    id: 'tb-001',
    name: 'Drapchi Prison',
    chineseName: '扎其监狱',
    type: 'Prison',
    region: 'Tibet',
    city: 'Lhasa',
    coordinates: { lat: 29.6500, lng: 91.1000 },
    estimatedCapacity: '2,000+',
    status: 'Active',
    firstDocumented: '1960s',
    description: 'Tibet\'s largest and most notorious prison. Long history of political prisoner detention and documented torture.',
    evidence: [
      'Decades of survivor testimonies',
      'UN reports',
      'ICT documentation',
    ],
    sources: ['International Campaign for Tibet', 'Human Rights Watch', 'UN Special Rapporteurs'],
    satelliteImage: null,
  },
  {
    id: 'tb-002',
    name: 'Chushur Prison',
    chineseName: '曲水监狱',
    type: 'Prison',
    region: 'Tibet',
    city: 'Chushur',
    coordinates: { lat: 29.3167, lng: 90.7333 },
    estimatedCapacity: '1,500+',
    status: 'Active',
    firstDocumented: '1990s',
    description: 'High-security facility holding many Tibetan political prisoners including monks and nuns.',
    evidence: [
      'TCHRD documentation',
      'Former prisoner accounts',
      'Family testimonies',
    ],
    sources: ['Tibetan Centre for Human Rights and Democracy', 'ICT', 'Free Tibet'],
    satelliteImage: null,
  },
  // Hong Kong
  {
    id: 'hk-001',
    name: 'Lai Chi Kok Reception Centre',
    chineseName: '荔枝角收押所',
    type: 'Detention Center',
    region: 'Hong Kong',
    city: 'Kowloon',
    coordinates: { lat: 22.3333, lng: 114.1500 },
    estimatedCapacity: '1,400',
    status: 'Active',
    firstDocumented: '1970s',
    description: 'Primary remand facility where many pro-democracy activists have been held pending trial.',
    evidence: [
      'Court records',
      'Legal documentation',
      'Media reports',
    ],
    sources: ['HKFP', 'Stand News (archived)', 'Court records'],
    satelliteImage: null,
  },
  {
    id: 'hk-002',
    name: 'Stanley Prison',
    chineseName: '赤柱監獄',
    type: 'Maximum Security Prison',
    region: 'Hong Kong',
    city: 'Stanley',
    coordinates: { lat: 22.2167, lng: 114.2167 },
    estimatedCapacity: '1,500',
    status: 'Active',
    firstDocumented: '1937',
    description: 'Maximum security facility where Jimmy Lai and other high-profile political prisoners are held.',
    evidence: [
      'Court records',
      'Legal visits documentation',
      'Media reports',
    ],
    sources: ['HKFP', 'Reuters', 'BBC'],
    satelliteImage: null,
  },
  // Mainland
  {
    id: 'ml-001',
    name: 'Qincheng Prison',
    chineseName: '秦城监狱',
    type: 'Maximum Security Prison',
    region: 'Mainland China',
    city: 'Beijing',
    coordinates: { lat: 40.2500, lng: 116.3000 },
    estimatedCapacity: '500+',
    status: 'Active',
    firstDocumented: '1958',
    description: 'China\'s most secure prison for high-profile political prisoners and purged officials.',
    evidence: [
      'Historical records',
      'Former prisoner accounts',
      'Official court documents',
    ],
    sources: ['Various historical sources', 'Dui Hua Foundation', 'Media reports'],
    satelliteImage: null,
  },
  {
    id: 'ml-002',
    name: 'Residential Surveillance at a Designated Location (RSDL)',
    chineseName: '指定居所监视居住',
    type: 'Secret Detention',
    region: 'Mainland China',
    city: 'Various',
    coordinates: null,
    estimatedCapacity: 'Unknown',
    status: 'Active',
    firstDocumented: '2013',
    description: 'System of secret detention facilities across China. Detainees held incommunicado for up to 6 months.',
    evidence: [
      'Safeguard Defenders research',
      'Survivor testimonies',
      'Legal documentation',
    ],
    sources: ['Safeguard Defenders', 'Human Rights Watch', 'Amnesty International'],
    satelliteImage: null,
  },
];

const regions = ['All Regions', 'Xinjiang', 'Tibet', 'Hong Kong', 'Mainland China'];
const types = ['All Types', 'Internment Camp', 'Prison', 'Detention Center', 'Maximum Security Prison', 'Secret Detention'];
const statuses = ['All Statuses', 'Active', 'Closed', 'Unknown'];

// Process research data into source attribution format
const processResearchSources = () => {
  const sources = [];
  const seen = new Set();
  
  detentionResearchData.results.forEach(result => {
    const data = result.output;
    if (data.source_url && !seen.has(data.source_url)) {
      seen.add(data.source_url);
      
      // Determine source type and organization
      let type = 'Research Report';
      let organization = '';
      let name = data.region;
      
      if (data.source_url.includes('aspi.org.au')) {
        type = 'NGO Report';
        organization = 'Australian Strategic Policy Institute (ASPI)';
        name = 'ASPI Xinjiang Data Project';
      } else if (data.source_url.includes('rand.org')) {
        type = 'Academic Research';
        organization = 'RAND Corporation';
        name = 'Tibet Prison Analysis';
      } else if (data.source_url.includes('ap.org')) {
        type = 'News Report';
        organization = 'Associated Press';
        name = `AP Investigation: ${data.region}`;
      } else if (data.source_url.includes('savetibet.org')) {
        type = 'NGO Report';
        organization = 'International Campaign for Tibet';
        name = `Tibet Report: ${data.region}`;
      } else if (data.source_url.includes('wikipedia.org')) {
        type = 'Reference';
        organization = 'Wikipedia';
        name = data.region;
      } else if (data.source_url.includes('hrw.org')) {
        type = 'Human Rights Report';
        organization = 'Human Rights Watch';
        name = `HRW Report: ${data.region}`;
      } else if (data.source_url.includes('bitterwinter.org')) {
        type = 'News Report';
        organization = 'Bitter Winter';
        name = data.region;
      } else if (data.source_url.includes('csd.gov.hk')) {
        type = 'Government Document';
        organization = 'Hong Kong Correctional Services Department';
        name = 'Hong Kong Prison Facilities';
      } else if (data.source_url.includes('amnesty.org')) {
        type = 'Human Rights Report';
        organization = 'Amnesty International';
        name = 'Hong Kong Prison Conditions';
      } else if (data.source_url.includes('aninews.in')) {
        type = 'News Report';
        organization = 'ANI News';
        name = data.region;
      } else if (data.source_url.includes('faluninfo.net')) {
        type = 'News Report';
        organization = 'Falun Dafa Info Center';
        name = data.region;
      }
      
      sources.push({
        name,
        url: data.source_url,
        type,
        organization,
        verified: type === 'Government Document' || type === 'Academic Research' || 
                 organization.includes('ASPI') || organization.includes('RAND'),
        description: `Facility count: ${data.facility_count || 'Unknown'}. Key facilities: ${data.key_facilities?.substring(0, 100) || 'See source'}${data.key_facilities?.length > 100 ? '...' : ''}`,
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
      <div className="bg-slate-800/50 rounded-xl border border-slate-700">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <button
            onClick={() => setSelectedFacility(null)}
            className="text-blue-400 hover:text-blue-300 text-sm mb-4 flex items-center gap-1"
          >
            ← Back to all facilities
          </button>
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center">
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
        <div className="p-6 border-b border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Estimated Capacity</p>
            <p className="text-white font-medium">{facility.estimatedCapacity}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">First Documented</p>
            <p className="text-white font-medium">{facility.firstDocumented}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Region</p>
            <p className="text-white font-medium">{facility.region}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Status</p>
            <p className={`font-medium ${facility.status === 'Active' ? 'text-red-400' : 'text-gray-400'}`}>
              {facility.status}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
          <p className="text-slate-300">{facility.description}</p>
        </div>

        {/* Evidence */}
        <div className="p-6 border-b border-slate-700">
          <button
            onClick={() => toggleSection('evidence')}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              Documented Evidence
            </h3>
            {expandedSections.evidence ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>
          
          {expandedSections.evidence !== false && (
            <ul className="mt-4 space-y-2">
              {facility.evidence.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <span className="text-blue-400 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sources */}
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Sources</h3>
          <div className="flex flex-wrap gap-2">
            {facility.sources.map((source, i) => (
              <span key={i} className="px-2 py-1 bg-slate-700 rounded text-sm text-slate-300">
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
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-6 h-6 text-red-400" />
        <div>
          <h2 className="text-xl font-bold text-white">Detention Facility Database</h2>
          <p className="text-sm text-slate-400">Documented detention centers, prisons, and internment camps</p>
        </div>
      </div>

      {/* Warning */}
      <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
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
        <div className="bg-slate-900/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white">{facilities.length}</p>
          <p className="text-xs text-slate-500">Facilities Documented</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{totalCapacity.toLocaleString()}+</p>
          <p className="text-xs text-slate-500">Est. Total Capacity</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white">{new Set(facilities.map(f => f.region)).size}</p>
          <p className="text-xs text-slate-500">Regions</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white">{facilities.filter(f => f.status === 'Active').length}</p>
          <p className="text-xs text-slate-500">Active Facilities</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
          />
        </div>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="bg-slate-700 text-white text-sm rounded-lg px-3 py-2 border border-slate-600"
        >
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-slate-700 text-white text-sm rounded-lg px-3 py-2 border border-slate-600"
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
            className="bg-slate-900/50 rounded-lg p-4 text-left hover:bg-slate-900/70 transition-colors border border-slate-700 hover:border-slate-600"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
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
      <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
        <h3 className="text-sm font-semibold text-white mb-3">Research Resources</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <a
            href="https://xjdp.aspi.org.au/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-sm text-white">ASPI Xinjiang Data Project</p>
              <p className="text-xs text-slate-400">Satellite imagery database</p>
            </div>
          </a>
          <a
            href="https://www.xinjiangpolicefiles.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-sm text-white">Xinjiang Police Files</p>
              <p className="text-xs text-slate-400">Leaked internal documents</p>
            </div>
          </a>
          <a
            href="https://shahit.biz/eng/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-blue-400" />
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
