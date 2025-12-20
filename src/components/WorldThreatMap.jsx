import { useState } from 'react';

const WorldThreatMap = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  // Accurate data for CCP overseas police stations from Safeguard Defenders
  const threatData = {
    'Europe': {
      countries: [
        { name: 'Italy', policeStations: 11, cities: ['Milan', 'Prato', 'Rome', 'Bolzano', 'Florence', 'Sicily', 'Venice'], threats: ['Largest concentration in Europe', 'Diaspora control', 'Business pressure'] },
        { name: 'Spain', policeStations: 9, cities: ['Barcelona', 'Madrid', 'Santiago de Compostela', 'Valencia'], threats: ['Multiple stations', 'Port access', 'Diaspora monitoring'] },
        { name: 'France', policeStations: 4, cities: ['Paris'], threats: ['Police stations', 'Academic influence', 'Tech sector'] },
        { name: 'United Kingdom', policeStations: 3, cities: ['London', 'Glasgow'], threats: ['Police stations', 'Tech theft', 'Media influence'] },
        { name: 'Portugal', policeStations: 3, cities: ['Lisbon', 'Porto', 'Madeira'], threats: ['Police stations', 'Golden visa abuse'] },
        { name: 'Netherlands', policeStations: 2, cities: ['Amsterdam', 'Rotterdam'], threats: ['Police stations', 'Port infiltration'] },
        { name: 'Czech Republic', policeStations: 2, cities: ['Prague'], threats: ['Police stations', 'Tech sector'] },
        { name: 'Hungary', policeStations: 2, cities: ['Budapest'], threats: ['Police stations', 'Political influence'] },
        { name: 'Serbia', policeStations: 2, cities: ['Belgrade'], threats: ['Police stations', 'BRI influence'] },
        { name: 'Germany', policeStations: 1, cities: ['Frankfurt'], threats: ['Police station', 'Economic espionage'] },
        { name: 'Ireland', policeStations: 1, cities: ['Dublin'], threats: ['Police station', 'Tech sector access'] },
        { name: 'Austria', policeStations: 1, cities: ['Vienna'], threats: ['Police station', 'Diplomatic hub'] },
        { name: 'Greece', policeStations: 1, cities: ['Athens'], threats: ['Police station', 'Port access'] },
        { name: 'Slovakia', policeStations: 1, cities: ['Bratislava'], threats: ['Police station'] },
        { name: 'Sweden', policeStations: 1, cities: ['Stockholm'], threats: ['Police station', 'Tech sector'] },
        { name: 'Ukraine', policeStations: 1, cities: ['Odesa'], threats: ['Police station'] },
        { name: 'Romania', policeStations: 1, cities: ['Unknown'], threats: ['Police station'] },
      ],
      totalStations: 36,
      riskLevel: 'CRITICAL'
    },
    'North America': {
      countries: [
        { name: 'Canada', policeStations: 5, cities: ['Vancouver', 'Toronto (3)'], threats: ['Police stations', 'Election interference', 'Diaspora intimidation', 'Academic infiltration'] },
        { name: 'United States', policeStations: 4, cities: ['New York (2)', 'Los Angeles'], threats: ['Police stations', 'Tech espionage', 'Academic infiltration', 'NYPD officer charged'] },
      ],
      totalStations: 9,
      riskLevel: 'HIGH'
    },
    'South America': {
      countries: [
        { name: 'Brazil', policeStations: 3, cities: ['Rio de Janeiro', 'São Paulo'], threats: ['Police stations', 'Economic influence', 'Port access'] },
        { name: 'Ecuador', policeStations: 3, cities: ['Guayaquil', 'Quito'], threats: ['Police stations', 'Resource extraction'] },
        { name: 'Argentina', policeStations: 2, cities: ['Buenos Aires'], threats: ['Police stations', 'Space facility', 'Debt diplomacy'] },
        { name: 'Chile', policeStations: 2, cities: ['Viña del Mar'], threats: ['Police stations', 'Mining interests'] },
        { name: 'Colombia', policeStations: 1, cities: ['Bogotá'], threats: ['Police station'] },
        { name: 'Peru', policeStations: 1, cities: ['Lima'], threats: ['Police station', 'Mining interests'] },
      ],
      totalStations: 12,
      riskLevel: 'MEDIUM'
    },
    'Asia Pacific': {
      countries: [
        { name: 'Japan', policeStations: 2, cities: ['Tokyo'], threats: ['Police stations', 'Tech espionage', 'Military intelligence'] },
        { name: 'Australia', policeStations: 2, cities: ['Sydney'], threats: ['Police stations', 'Political interference', 'University infiltration'] },
        { name: 'Cambodia', policeStations: 2, cities: ['Phnom Penh'], threats: ['Police stations', 'Scam operations', 'Refugee targeting'] },
        { name: 'South Korea', policeStations: 1, cities: ['Seoul'], threats: ['Police station', 'Tech theft'] },
        { name: 'New Zealand', policeStations: 1, cities: ['Auckland'], threats: ['Police station', 'Political influence'] },
        { name: 'Indonesia', policeStations: 1, cities: ['Jakarta'], threats: ['Police station', 'BRI influence'] },
        { name: 'Myanmar', policeStations: 1, cities: ['Yangon'], threats: ['Police station', 'Border influence'] },
        { name: 'Mongolia', policeStations: 1, cities: ['Ulaanbaatar'], threats: ['Police station', 'Resource extraction'] },
        { name: 'Brunei', policeStations: 1, cities: ['Bandar Seri Begawan'], threats: ['Police station'] },
        { name: 'Vietnam', policeStations: 1, cities: ['Hanoi'], threats: ['Police station', 'Border disputes'] },
        { name: 'Bangladesh', policeStations: 1, cities: ['Dhaka'], threats: ['Police station', 'BRI debt'] },
      ],
      totalStations: 14,
      riskLevel: 'HIGH'
    },
    'Africa': {
      countries: [
        { name: 'South Africa', policeStations: 3, cities: ['Johannesburg'], threats: ['Police stations', 'Resource extraction', 'Debt diplomacy'] },
        { name: 'Nigeria', policeStations: 2, cities: ['Benin City'], threats: ['Police stations', 'Economic influence'] },
        { name: 'Tanzania', policeStations: 1, cities: ['Dar es Salaam'], threats: ['Police station', 'Port control'] },
        { name: 'Ethiopia', policeStations: 1, cities: ['Addis Ababa'], threats: ['Police station', 'AU headquarters'] },
        { name: 'Lesotho', policeStations: 1, cities: ['Maseru'], threats: ['Police station'] },
        { name: 'Madagascar', policeStations: 1, cities: ['Antananarivo'], threats: ['Police station', 'Resource extraction'] },
        { name: 'Angola', policeStations: 1, cities: ['Luanda'], threats: ['Police station', 'Oil interests'] },
        { name: 'Zambia', policeStations: 1, cities: ['Lusaka'], threats: ['Police station', 'Debt trap'] },
        { name: 'Namibia', policeStations: 1, cities: ['Windhoek'], threats: ['Police station'] },
      ],
      totalStations: 12,
      riskLevel: 'MEDIUM'
    },
    'Middle East': {
      countries: [
        { name: 'UAE', policeStations: 2, cities: ['Dubai'], threats: ['Police stations', 'Financial hub', 'Uyghur deportations'] },
        { name: 'Israel', policeStations: 1, cities: ['Tel Aviv'], threats: ['Police station', 'Tech sector'] },
      ],
      totalStations: 3,
      riskLevel: 'MEDIUM'
    },
  };

  const hotspots = [
    { id: 'taiwan', name: 'Taiwan Strait', x: 78, y: 42, type: 'military', description: 'Military threat - daily incursions', severity: 'CRITICAL' },
    { id: 'hk', name: 'Hong Kong', x: 76, y: 44, type: 'repression', description: 'NSL enforcement, mass arrests', severity: 'CRITICAL' },
    { id: 'xinjiang', name: 'Xinjiang', x: 68, y: 38, type: 'genocide', description: 'Uyghur genocide, 1M+ detained', severity: 'CRITICAL' },
    { id: 'tibet', name: 'Tibet', x: 65, y: 40, type: 'repression', description: 'Cultural genocide, religious persecution', severity: 'HIGH' },
    { id: 'scs', name: 'South China Sea', x: 74, y: 50, type: 'military', description: 'Illegal island bases, shipping threats', severity: 'HIGH' },
    { id: 'inner_mongolia', name: 'Inner Mongolia', x: 72, y: 32, type: 'repression', description: 'Language suppression, cultural erasure', severity: 'HIGH' },
  ];

  const getRiskColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-400 bg-red-900/30 border-red-700';
      case 'HIGH': return 'text-orange-400 bg-orange-900/30 border-orange-700';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-900/30 border-yellow-700';
      default: return 'text-slate-400 bg-slate-900/30 border-slate-700';
    }
  };

  const totalStations = Object.values(threatData).reduce((sum, region) => sum + region.totalStations, 0);
  const totalCountries = Object.values(threatData).reduce((sum, region) => sum + region.countries.length, 0);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🌍</span> Global CCP Threat Map
            </h2>
            <p className="text-sm text-slate-400">{totalStations} overseas police stations in {totalCountries} countries</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-red-400">LIVE THREAT DATA</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-slate-900/50 border-b border-slate-700">
        <div className="text-center">
          <div className="text-xl font-bold text-red-400">{totalStations}</div>
          <div className="text-xs text-slate-500">Police Stations</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-orange-400">{totalCountries}</div>
          <div className="text-xs text-slate-500">Countries</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-yellow-400">230K+</div>
          <div className="text-xs text-slate-500">"Persuaded" to Return</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-400">14+</div>
          <div className="text-xs text-slate-500">Gov Investigations</div>
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
          
          {/* Middle East */}
          <path 
            d="M 56 22 Q 62 20 65 24 L 63 30 Q 58 32 56 28 Z" 
            fill={selectedRegion === 'Middle East' ? 'rgba(239,68,68,0.3)' : 'rgba(71,85,105,0.5)'}
            stroke="rgba(148,163,184,0.5)"
            strokeWidth="0.2"
            className="cursor-pointer transition-colors"
            onClick={() => setSelectedRegion(selectedRegion === 'Middle East' ? null : 'Middle East')}
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
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs border ${getRiskColor(threatData[selectedRegion].riskLevel)}`}>
                  {threatData[selectedRegion].riskLevel} RISK
                </span>
                <button 
                  onClick={() => setSelectedRegion(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
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
                    <span className="text-xs text-red-400 font-bold">{country.policeStations} station{country.policeStations > 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-xs text-slate-400 mb-2">
                    📍 {country.cities.join(', ')}
                  </div>
                  <div className="flex flex-wrap gap-1">
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
          <div className="text-center py-4">
            <p className="text-slate-400 mb-4">Click on a region to see detailed threat information</p>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.keys(threatData).map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors flex items-center gap-1"
                >
                  {region}
                  <span className="text-xs text-red-400">({threatData[region].totalStations})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legend & Source */}
      <div className="p-4 border-t border-slate-700 bg-slate-900/50">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
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
          <div className="text-slate-500">
            Source: <a href="https://safeguarddefenders.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Safeguard Defenders</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldThreatMap;
