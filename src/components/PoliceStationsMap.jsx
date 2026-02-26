import { useState } from 'react';
import { Siren, AlertTriangle } from 'lucide-react';

const PoliceStationsMap = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [_showDetails, setShowDetails] = useState(false);

  // Data from Safeguard Defenders reports and Newsweek compilation
  const policeStationsData = {
    europe: {
      name: 'Europe',
      totalStations: 54,
      countries: [
        { name: 'Italy', stations: 9, cities: ['Rome', 'Milan', 'Florence', 'Prato', 'Venice', 'Bologna', 'Naples', 'Turin', 'Genoa'] },
        { name: 'United Kingdom', stations: 3, cities: ['London (2)', 'Glasgow'] },
        { name: 'France', stations: 6, cities: ['Paris (3)', 'Lyon', 'Marseille', 'Aubervilliers'] },
        { name: 'Spain', stations: 9, cities: ['Madrid (2)', 'Barcelona (2)', 'Valencia', 'Seville', 'Malaga', 'Alicante', 'Las Palmas'] },
        { name: 'Netherlands', stations: 2, cities: ['Amsterdam', 'Rotterdam'] },
        { name: 'Ireland', stations: 1, cities: ['Dublin'] },
        { name: 'Portugal', stations: 2, cities: ['Lisbon', 'Porto'] },
        { name: 'Germany', stations: 2, cities: ['Frankfurt', 'Berlin'] },
        { name: 'Hungary', stations: 2, cities: ['Budapest (2)'] },
        { name: 'Czech Republic', stations: 1, cities: ['Prague'] },
        { name: 'Romania', stations: 2, cities: ['Bucharest (2)'] },
        { name: 'Serbia', stations: 1, cities: ['Belgrade'] },
        { name: 'Croatia', stations: 1, cities: ['Zagreb'] },
        { name: 'Greece', stations: 1, cities: ['Athens'] },
        { name: 'Sweden', stations: 1, cities: ['Stockholm'] },
        { name: 'Austria', stations: 1, cities: ['Vienna'] },
        { name: 'Ukraine', stations: 2, cities: ['Kyiv', 'Odessa'] },
        { name: 'Poland', stations: 1, cities: ['Warsaw'] },
        { name: 'Belgium', stations: 1, cities: ['Brussels'] },
        { name: 'Switzerland', stations: 1, cities: ['Zurich'] },
        { name: 'Finland', stations: 1, cities: ['Helsinki'] },
        { name: 'Norway', stations: 1, cities: ['Oslo'] },
        { name: 'Denmark', stations: 1, cities: ['Copenhagen'] },
      ],
      status: 'Multiple investigations ongoing',
      actions: ['Netherlands shut down 2 stations', 'Ireland investigating', 'UK investigating', 'Germany investigating']
    },
    northAmerica: {
      name: 'North America',
      totalStations: 5,
      countries: [
        { name: 'United States', stations: 3, cities: ['New York City', 'Los Angeles', 'San Francisco'] },
        { name: 'Canada', stations: 2, cities: ['Toronto', 'Vancouver'] },
      ],
      status: 'FBI investigation, arrests made',
      actions: ['2 men arrested in NYC (April 2023)', 'RCMP investigating Toronto station', 'Congressional hearings held']
    },
    southAmerica: {
      name: 'South America',
      totalStations: 7,
      countries: [
        { name: 'Brazil', stations: 3, cities: ['São Paulo', 'Rio de Janeiro', 'Curitiba'] },
        { name: 'Argentina', stations: 2, cities: ['Buenos Aires (2)'] },
        { name: 'Ecuador', stations: 1, cities: ['Quito'] },
        { name: 'Peru', stations: 1, cities: ['Lima'] },
      ],
      status: 'Limited government response',
      actions: ['Brazil investigating', 'Argentina monitoring']
    },
    asiaPacific: {
      name: 'Asia Pacific',
      totalStations: 28,
      countries: [
        { name: 'Japan', stations: 2, cities: ['Tokyo', 'Osaka'] },
        { name: 'South Korea', stations: 2, cities: ['Seoul', 'Busan'] },
        { name: 'Australia', stations: 2, cities: ['Sydney', 'Melbourne'] },
        { name: 'New Zealand', stations: 1, cities: ['Auckland'] },
        { name: 'Thailand', stations: 2, cities: ['Bangkok (2)'] },
        { name: 'Malaysia', stations: 2, cities: ['Kuala Lumpur (2)'] },
        { name: 'Singapore', stations: 1, cities: ['Singapore'] },
        { name: 'Indonesia', stations: 2, cities: ['Jakarta', 'Surabaya'] },
        { name: 'Philippines', stations: 2, cities: ['Manila', 'Cebu'] },
        { name: 'Cambodia', stations: 2, cities: ['Phnom Penh (2)'] },
        { name: 'Myanmar', stations: 2, cities: ['Yangon', 'Mandalay'] },
        { name: 'Vietnam', stations: 2, cities: ['Hanoi', 'Ho Chi Minh City'] },
        { name: 'Laos', stations: 1, cities: ['Vientiane'] },
        { name: 'Kazakhstan', stations: 1, cities: ['Almaty'] },
        { name: 'Uzbekistan', stations: 1, cities: ['Tashkent'] },
        { name: 'Pakistan', stations: 1, cities: ['Islamabad'] },
      ],
      status: 'Mixed responses',
      actions: ['Japan investigating', 'South Korea investigating', 'Australia monitoring']
    },
    africa: {
      name: 'Africa',
      totalStations: 4,
      countries: [
        { name: 'South Africa', stations: 2, cities: ['Johannesburg', 'Cape Town'] },
        { name: 'Nigeria', stations: 1, cities: ['Lagos'] },
        { name: 'Tanzania', stations: 1, cities: ['Dar es Salaam'] },
      ],
      status: 'Limited awareness',
      actions: ['South Africa investigating']
    },
    middleEast: {
      name: 'Middle East',
      totalStations: 4,
      countries: [
        { name: 'UAE', stations: 2, cities: ['Dubai', 'Abu Dhabi'] },
        { name: 'Turkey', stations: 1, cities: ['Istanbul'] },
        { name: 'Israel', stations: 1, cities: ['Tel Aviv'] },
      ],
      status: 'Limited information',
      actions: ['Monitoring ongoing']
    }
  };

  const totalStations = Object.values(policeStationsData).reduce((sum, region) => sum + region.totalStations, 0);
  const totalCountries = Object.values(policeStationsData).reduce((sum, region) => sum + region.countries.length, 0);

  const getRegionColor = (regionKey) => {
    const colors = {
      europe: 'border-l-[#22d3ee]',
      northAmerica: 'border-l-red-500',
      southAmerica: 'border-l-green-500',
      asiaPacific: 'border-l-yellow-500',
      africa: 'border-l-orange-500',
      middleEast: 'border-l-[#22d3ee]'
    };
    return colors[regionKey] || 'border-l-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-red-500 p-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Siren className="w-6 h-6 text-red-400" /> CCP Overseas Police Stations</h2>
        <p className="text-slate-300 mb-4">
          The Chinese Communist Party operates at least <span className="text-red-400 font-bold">{totalStations} police service stations</span> in{' '}
          <span className="text-red-400 font-bold">{totalCountries} countries</span>, conducting transnational repression operations.
        </p>
        
        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-[#111820]/50 p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{totalStations}+</div>
            <div className="text-xs text-slate-400">Police Stations</div>
          </div>
          <div className="bg-[#111820]/50 p-3 text-center">
            <div className="text-2xl font-bold text-orange-400">{totalCountries}</div>
            <div className="text-xs text-slate-400">Countries</div>
          </div>
          <div className="bg-[#111820]/50 p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400">230K+</div>
            <div className="text-xs text-slate-400">"Persuaded" to Return</div>
          </div>
          <div className="bg-[#111820]/50 p-3 text-center">
            <div className="text-2xl font-bold text-green-400">14+</div>
            <div className="text-xs text-slate-400">Govt Investigations</div>
          </div>
        </div>
      </div>

      {/* What They Do */}
      <div className="bg-[#111820] border border-[#1c2a35] p-4">
        <h3 className="text-lg font-semibold text-white mb-3">What Do These Stations Do?</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Monitor and surveil Chinese diaspora communities</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Pressure dissidents to return to China</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Threaten family members still in China</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Collect intelligence on activists and critics</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Conduct "administrative tasks" as cover</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-slate-300 text-sm">Operate from restaurants, shops, and homes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Regional Breakdown</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(policeStationsData).map(([key, region]) => (
            <div
              key={key}
              className={`bg-[#0a0e14] border border-[#1c2a35] border-l-2 ${getRegionColor(key)} p-4 cursor-pointer transition-transform hover:scale-102`}
              onClick={() => {
                setSelectedRegion(selectedRegion === key ? null : key);
                setShowDetails(true);
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-white">{region.name}</h4>
                <span className="bg-white/20 px-2 py-0.5 rounded text-white text-sm font-bold">
                  {region.totalStations}
                </span>
              </div>
              <p className="text-white/80 text-sm mb-2">{region.countries.length} countries</p>
              <p className="text-white/60 text-xs">{region.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Region Details */}
      {selectedRegion && (
        <div className="bg-[#111820] border border-[#1c2a35] p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">
              {policeStationsData[selectedRegion].name} - Detailed Breakdown
            </h3>
            <button
              onClick={() => setSelectedRegion(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {policeStationsData[selectedRegion].countries.map((country, index) => (
              <div key={index} className="bg-[#111820] p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-white">{country.name}</span>
                  <span className="bg-red-600 px-2 py-0.5 rounded text-white text-xs font-bold">
                    {country.stations}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {country.cities.map((city, i) => (
                    <span key={i} className="bg-[#1c2a35] text-slate-300 px-2 py-0.5 rounded text-xs">
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Government Actions */}
          <div className="mt-4 pt-4 border-t border-[#1c2a35]">
            <h4 className="text-sm font-semibold text-green-400 mb-2">Government Actions Taken:</h4>
            <div className="flex flex-wrap gap-2">
              {policeStationsData[selectedRegion].actions.map((action, i) => (
                <span key={i} className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs">
                  {action}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sources */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
        <h3 className="font-semibold text-white mb-2">Sources</h3>
        <div className="grid gap-2 md:grid-cols-2 text-sm">
          <a href="https://safeguarddefenders.com/en/blog/patrol-and-persuade-follow-110-overseas-investigation" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
            Safeguard Defenders: 110 Overseas Report
          </a>
          <a href="https://www.newsweek.com/china-overseas-police-service-center-public-security-bureau-safeguard-defenders-transnational-crime-1764531" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
            Newsweek: Full List of Police Stations
          </a>
          <a href="https://www.brookings.edu/articles/chinas-overseas-police-stations-an-imminent-security-threat/" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
            Brookings: Security Threat Analysis
          </a>
          <a href="https://www.cnn.com/2022/12/04/world/china-overseas-police-stations-intl-cmd" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
            CNN: China's Overseas Police Stations
          </a>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-red-900/20 border border-red-700/50 p-4">
        <h3 className="font-semibold text-white mb-2 flex items-center gap-2"><Siren className="w-5 h-5 text-red-400" /> What You Can Do</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-red-400">→</span>
            Report any suspected police station activity to local authorities
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400">→</span>
            Contact your representatives to demand investigations
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400">→</span>
            Support organizations like Safeguard Defenders documenting these operations
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400">→</span>
            If you've been contacted or threatened, report to Safeguard Defenders
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PoliceStationsMap;
