import { useState } from 'react';

const WorldThreatMap = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  // Data for CCP overseas police stations and influence operations
  const threatData = {
    'North America': {
      countries: [
        { name: 'United States', policeStations: 2, cities: ['New York', 'Los Angeles'], threats: ['Transnational repression', 'Academic infiltration', 'Tech espionage'] },
        { name: 'Canada', policeStations: 3, cities: ['Toronto', 'Vancouver', 'Montreal'], threats: ['Police stations', 'Election interference', 'Diaspora intimidation'] },
      ],
      totalStations: 5,
      riskLevel: 'HIGH'
    },
    'Europe': {
      countries: [
        { name: 'United Kingdom', policeStations: 3, cities: ['London', 'Glasgow', 'Manchester'], threats: ['Police stations', 'Tech theft', 'Media influence'] },
        { name: 'Netherlands', policeStations: 2, cities: ['Amsterdam', 'Rotterdam'], threats: ['Police stations', 'Port infiltration'] },
        { name: 'France', policeStations: 2, cities: ['Paris', 'Lyon'], threats: ['Police stations', 'Academic influence'] },
        { name: 'Germany', policeStations: 2, cities: ['Berlin', 'Frankfurt'], threats: ['Police stations', 'Economic espionage'] },
        { name: 'Italy', policeStations: 9, cities: ['Rome', 'Milan', 'Florence', 'Prato'], threats: ['Largest concentration in Europe', 'Diaspora control'] },
        { name: 'Spain', policeStations: 2, cities: ['Madrid', 'Barcelona'], threats: ['Police stations', 'Port access'] },
        { name: 'Ireland', policeStations: 1, cities: ['Dublin'], threats: ['Police station', 'Tech sector access'] },
        { name: 'Hungary', policeStations: 1, cities: ['Budapest'], threats: ['Police station', 'Political influence'] },
      ],
      totalStations: 24,
      riskLevel: 'CRITICAL'
    },
    'Asia Pacific': {
      countries: [
        { name: 'Japan', policeStations: 2, cities: ['Tokyo', 'Osaka'], threats: ['Police stations', 'Tech espionage', 'Military intelligence'] },
        { name: 'South Korea', policeStations: 1, cities: ['Seoul'], threats: ['Police station', 'Tech theft'] },
        { name: 'Australia', policeStations: 2, cities: ['Sydney', 'Melbourne'], threats: ['Police stations', 'Political interference', 'University infiltration'] },
        { name: 'New Zealand', policeStations: 1, cities: ['Auckland'], threats: ['Police station', 'Political influence'] },
        { name: 'Thailand', policeStations: 1, cities: ['Bangkok'], threats: ['Police station', 'Refugee targeting'] },
        { name: 'Cambodia', policeStations: 1, cities: ['Phnom Penh'], threats: ['Police station', 'Scam operations'] },
      ],
      totalStations: 8,
      riskLevel: 'HIGH'
    },
    'Africa': {
      countries: [
        { name: 'South Africa', policeStations: 2, cities: ['Johannesburg', 'Cape Town'], threats: ['Police stations', 'Resource extraction', 'Debt diplomacy'] },
        { name: 'Tanzania', policeStations: 1, cities: ['Dar es Salaam'], threats: ['Police station', 'Port control'] },
        { name: 'Nigeria', policeStations: 1, cities: ['Lagos'], threats: ['Police station', 'Economic influence'] },
      ],
      totalStations: 4,
      riskLevel: 'MEDIUM'
    },
    'South America': {
      countries: [
        { name: 'Brazil', policeStations: 4, cities: ['São Paulo', 'Rio de Janeiro'], threats: ['Police stations', 'Economic influence', 'Port access'] },
        { name: 'Argentina', policeStations: 2, cities: ['Buenos Aires'], threats: ['Police stations', 'Space facility'] },
        { name: 'Peru', policeStations: 1, cities: ['Lima'], threats: ['Police station', 'Mining interests'] },
      ],
      totalStations: 7,
      riskLevel: 'MEDIUM'
    },
  };

  const hotspots = [
    { id: 'taiwan', name: 'Taiwan Strait', x: 78, y: 42, type: 'military', description: 'Military threat - daily incursions', severity: 'CRITICAL' },
    { id: 'hk', name: 'Hong Kong', x: 76, y: 44, type: 'repression', description: 'NSL enforcement, mass arrests', severity: 'CRITICAL' },
    { id: 'xinjiang', name: 'Xinjiang', x: 68, y: 38, type: 'genocide', description: 'Uyghur genocide, 1M+ detained', severity: 'CRITICAL' },
    { id: 'tibet', name: 'Tibet', x: 65, y: 40, type: 'repression', description: 'Cultural genocide, religious persecution', severity: 'HIGH' },
    { id: 'scs', name: 'South China Sea', x: 74, y: 50, type: 'military', description: 'Illegal island bases, shipping threats', severity: 'HIGH' },
  ];

  const getRiskColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-400 bg-red-900/30 border-red-700';
      case 'HIGH': return 'text-orange-400 bg-orange-900/30 border-orange-700';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-900/30 border-yellow-700';
      default: return 'text-slate-400 bg-slate-900/30 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🌍</span> Global CCP Threat Map
            </h2>
            <p className="text-sm text-slate-400">100+ overseas police stations documented in 53 countries</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-red-400">LIVE THREAT DATA</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative aspect-[2/1] bg-slate-900 overflow-hidden">
        {/* Simplified World Map SVG */}
        <svg viewBox="0 0 100 50" className="w-full h-full">
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(100,116,139,0.2)" strokeWidth="0.1"/>
            </pattern>
          </defs>
          <rect width="100" height="50" fill="url(#grid)"/>
          
          {/* Simplified continent shapes */}
          {/* North America */}
          <path 
            d="M 5 10 Q 15 8 25 12 L 28 20 Q 22 25 18 22 L 10 18 Z" 
            fill={selectedRegion === 'North America' ? 'rgba(239,68,68,0.3)' : 'rgba(71,85,105,0.5)'}
            stroke="rgba(148,163,184,0.5)"
            strokeWidth="0.2"
            className="cursor-pointer transition-colors"
            onClick={() => setSelectedRegion(selectedRegion === 'North America' ? null : 'North America')}
          />
          
          {/* South America */}
          <path 
            d="M 20 28 Q 25 26 28 30 L 26 42 Q 22 45 20 40 L 18 32 Z" 
            fill={selectedRegion === 'South America' ? 'rgba(239,68,68,0.3)' : 'rgba(71,85,105,0.5)'}
            stroke="rgba(148,163,184,0.5)"
            strokeWidth="0.2"
            className="cursor-pointer transition-colors"
            onClick={() => setSelectedRegion(selectedRegion === 'South America' ? null : 'South America')}
          />
          
          {/* Europe */}
          <path 
            d="M 42 12 Q 50 10 55 14 L 54 20 Q 48 22 44 18 L 42 14 Z" 
            fill={selectedRegion === 'Europe' ? 'rgba(239,68,68,0.3)' : 'rgba(71,85,105,0.5)'}
            stroke="rgba(148,163,184,0.5)"
            strokeWidth="0.2"
            className="cursor-pointer transition-colors"
            onClick={() => setSelectedRegion(selectedRegion === 'Europe' ? null : 'Europe')}
          />
          
          {/* Africa */}
          <path 
            d="M 45 24 Q 55 22 58 28 L 55 42 Q 48 44 46 38 L 44 30 Z" 
            fill={selectedRegion === 'Africa' ? 'rgba(239,68,68,0.3)' : 'rgba(71,85,105,0.5)'}
            stroke="rgba(148,163,184,0.5)"
            strokeWidth="0.2"
            className="cursor-pointer transition-colors"
            onClick={() => setSelectedRegion(selectedRegion === 'Africa' ? null : 'Africa')}
          />
          
          {/* Asia */}
          <path 
            d="M 55 12 Q 75 8 85 18 L 82 35 Q 70 38 62 30 L 56 20 Z" 
            fill={selectedRegion === 'Asia Pacific' ? 'rgba(239,68,68,0.3)' : 'rgba(71,85,105,0.5)'}
            stroke="rgba(148,163,184,0.5)"
            strokeWidth="0.2"
            className="cursor-pointer transition-colors"
            onClick={() => setSelectedRegion(selectedRegion === 'Asia Pacific' ? null : 'Asia Pacific')}
          />
          
          {/* Australia */}
          <path 
            d="M 80 38 Q 88 36 92 40 L 90 46 Q 84 48 82 44 L 80 40 Z" 
            fill={selectedRegion === 'Asia Pacific' ? 'rgba(239,68,68,0.3)' : 'rgba(71,85,105,0.5)'}
            stroke="rgba(148,163,184,0.5)"
            strokeWidth="0.2"
            className="cursor-pointer transition-colors"
            onClick={() => setSelectedRegion(selectedRegion === 'Asia Pacific' ? null : 'Asia Pacific')}
          />
          
          {/* China highlighted in red */}
          <path 
            d="M 65 20 Q 78 18 80 28 L 75 35 Q 68 36 65 30 L 64 24 Z" 
            fill="rgba(220,38,38,0.5)"
            stroke="rgba(239,68,68,0.8)"
            strokeWidth="0.3"
          />
          <text x="72" y="28" fill="white" fontSize="2" textAnchor="middle" className="font-bold">CHINA</text>
          
          {/* Hotspots */}
          {hotspots.map((spot) => (
            <g key={spot.id}>
              <circle
                cx={spot.x}
                cy={spot.y}
                r={spot.severity === 'CRITICAL' ? 1.5 : 1}
                fill={spot.severity === 'CRITICAL' ? 'rgba(239,68,68,0.8)' : 'rgba(251,146,60,0.8)'}
                className="animate-pulse cursor-pointer"
                onMouseEnter={() => setHoveredCountry(spot)}
                onMouseLeave={() => setHoveredCountry(null)}
              />
              <circle
                cx={spot.x}
                cy={spot.y}
                r={spot.severity === 'CRITICAL' ? 3 : 2}
                fill="none"
                stroke={spot.severity === 'CRITICAL' ? 'rgba(239,68,68,0.4)' : 'rgba(251,146,60,0.4)'}
                strokeWidth="0.3"
                className="animate-ping"
              />
            </g>
          ))}
        </svg>

        {/* Hover tooltip */}
        {hoveredCountry && (
          <div 
            className="absolute bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl z-10 pointer-events-none"
            style={{ 
              left: `${hoveredCountry.x}%`, 
              top: `${hoveredCountry.y}%`,
              transform: 'translate(-50%, -120%)'
            }}
          >
            <div className="font-bold text-white text-sm">{hoveredCountry.name}</div>
            <div className={`text-xs px-2 py-0.5 rounded inline-block mt-1 ${getRiskColor(hoveredCountry.severity)}`}>
              {hoveredCountry.severity}
            </div>
            <div className="text-xs text-slate-400 mt-1">{hoveredCountry.description}</div>
          </div>
        )}
      </div>

      {/* Region Details Panel */}
      <div className="p-4 border-t border-slate-700">
        {selectedRegion && threatData[selectedRegion] ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">{selectedRegion}</h3>
              <span className={`px-2 py-1 rounded text-xs border ${getRiskColor(threatData[selectedRegion].riskLevel)}`}>
                {threatData[selectedRegion].riskLevel} RISK
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-red-400">{threatData[selectedRegion].totalStations}</div>
                <div className="text-xs text-slate-400">Police Stations</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-400">{threatData[selectedRegion].countries.length}</div>
                <div className="text-xs text-slate-400">Countries Affected</div>
              </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {threatData[selectedRegion].countries.map((country) => (
                <div key={country.name} className="bg-slate-900/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{country.name}</span>
                    <span className="text-xs text-red-400">{country.policeStations} station{country.policeStations > 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Cities: {country.cities.join(', ')}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {country.threats.slice(0, 2).map((threat, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">
                        {threat}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400 mb-4">Click on a region to see detailed threat information</p>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.keys(threatData).map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-slate-700 bg-slate-900/50">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-slate-400">Critical Hotspot</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
            <span className="text-slate-400">High Risk Area</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-600/50 rounded"></span>
            <span className="text-slate-400">China (Source)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldThreatMap;
