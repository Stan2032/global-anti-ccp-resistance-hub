import React, { useState } from 'react';
import { Globe } from 'lucide-react';

const GlobalInfluenceMap = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Threats', color: 'slate' },
    { id: 'police', name: 'Police Stations', color: 'red' },
    { id: 'confucius', name: 'Confucius Institutes', color: 'orange' },
    { id: 'repression', name: 'Transnational Repression', color: 'purple' },
    { id: 'influence', name: 'Political Influence', color: 'blue' },
    { id: 'economic', name: 'Economic Coercion', color: 'yellow' },
  ];

  const regions = [
    {
      id: 'north-america',
      name: 'North America',
      countries: ['USA', 'Canada'],
      stats: {
        policeStations: 7,
        confuciusInstitutes: 65,
        repressionCases: 45,
        influenceOps: 'High',
      },
      details: 'Major target for CCP influence operations. Multiple FBI investigations into Chinese police stations. Significant Confucius Institute presence on university campuses.',
      incidents: [
        'NYC Chinese police station arrests (Apr 2023)',
        'FBI Director Wray testimony on CCP threat (2023)',
        'RCMP investigation into police stations (2023)',
      ]
    },
    {
      id: 'europe',
      name: 'Europe',
      countries: ['UK', 'Germany', 'France', 'Netherlands', 'Ireland', 'Spain', 'Italy'],
      stats: {
        policeStations: 54,
        confuciusInstitutes: 180,
        repressionCases: 78,
        influenceOps: 'Very High',
      },
      details: 'Highest concentration of overseas police stations. Netherlands first to shut them down. UK MI5 warned of CCP interference in Parliament.',
      incidents: [
        'Netherlands closes police stations (Oct 2023)',
        'UK arrests suspected Chinese spies (2022)',
        'Germany BfV warns of CCP espionage (2023)',
      ]
    },
    {
      id: 'asia-pacific',
      name: 'Asia-Pacific',
      countries: ['Australia', 'New Zealand', 'Japan', 'South Korea', 'Philippines'],
      stats: {
        policeStations: 12,
        confuciusInstitutes: 45,
        repressionCases: 34,
        influenceOps: 'High',
      },
      details: 'Strategic competition zone. Australia leads in countering CCP influence with foreign interference laws. Japan increasing defense posture.',
      incidents: [
        'ASIO warns of unprecedented espionage (2023)',
        'Australia foreign interference laws (2018)',
        'Philippines South China Sea tensions (ongoing)',
      ]
    },
    {
      id: 'africa',
      name: 'Africa',
      countries: ['South Africa', 'Kenya', 'Nigeria', 'Tanzania', 'Zambia'],
      stats: {
        policeStations: 4,
        confuciusInstitutes: 61,
        repressionCases: 12,
        influenceOps: 'Growing',
      },
      details: 'Belt and Road Initiative focus. Debt-trap diplomacy concerns. Growing media influence through Xinhua and CGTN partnerships.',
      incidents: [
        'Zambia debt concerns (ongoing)',
        'Kenya railway debt issues (2023)',
        'AU headquarters bugging scandal (2018)',
      ]
    },
    {
      id: 'latin-america',
      name: 'Latin America',
      countries: ['Brazil', 'Argentina', 'Peru', 'Chile', 'Mexico'],
      stats: {
        policeStations: 8,
        confuciusInstitutes: 44,
        repressionCases: 8,
        influenceOps: 'Moderate',
      },
      details: 'Expanding economic ties and infrastructure investment. Growing diplomatic pressure on Taiwan recognition.',
      incidents: [
        'Honduras switches recognition to PRC (2023)',
        'Brazil 5G Huawei debate (2021)',
        'Argentina port and space station concerns',
      ]
    },
    {
      id: 'middle-east',
      name: 'Middle East',
      countries: ['UAE', 'Saudi Arabia', 'Israel', 'Turkey', 'Iran'],
      stats: {
        policeStations: 2,
        confuciusInstitutes: 12,
        repressionCases: 6,
        influenceOps: 'Moderate',
      },
      details: 'Strategic energy partnerships. Uyghur deportation concerns in some countries. Growing tech and surveillance exports.',
      incidents: [
        'Saudi-Iran deal brokered by China (2023)',
        'Uyghur deportations from UAE (ongoing)',
        'Huawei 5G in Gulf states',
      ]
    },
  ];

  const getFilteredStats = (region) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'police') return region.stats.policeStations > 0;
    if (activeCategory === 'confucius') return region.stats.confuciusInstitutes > 0;
    if (activeCategory === 'repression') return region.stats.repressionCases > 0;
    return true;
  };

  const getThreatLevel = (region) => {
    const score = region.stats.policeStations * 2 + 
                  region.stats.confuciusInstitutes * 0.5 + 
                  region.stats.repressionCases;
    if (score > 100) return { level: 'Critical', color: 'red' };
    if (score > 50) return { level: 'High', color: 'orange' };
    if (score > 20) return { level: 'Moderate', color: 'yellow' };
    return { level: 'Low', color: 'green' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center mb-4">
          <Globe className="w-8 h-8 text-slate-300" />
          <div>
            <h2 className="text-2xl font-bold text-white">Global CCP Influence Map</h2>
            <p className="text-slate-400">Track CCP activities and influence operations worldwide</p>
          </div>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.filter(getFilteredStats).map(region => {
          const threat = getThreatLevel(region);
          return (
            <div
              key={region.id}
              className={`bg-slate-800/50 rounded-xl border transition-all cursor-pointer ${
                selectedRegion?.id === region.id
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
              onClick={() => setSelectedRegion(selectedRegion?.id === region.id ? null : region)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{region.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    threat.color === 'red' ? 'bg-red-900/50 text-red-400' :
                    threat.color === 'orange' ? 'bg-orange-900/50 text-orange-400' :
                    threat.color === 'yellow' ? 'bg-yellow-900/50 text-yellow-400' :
                    'bg-green-900/50 text-green-400'
                  }`}>
                    {threat.level}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-slate-900/50 rounded p-2">
                    <div className="text-xs text-slate-500">Police Stations</div>
                    <div className="text-lg font-bold text-red-400">{region.stats.policeStations}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded p-2">
                    <div className="text-xs text-slate-500">Confucius Inst.</div>
                    <div className="text-lg font-bold text-orange-400">{region.stats.confuciusInstitutes}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded p-2">
                    <div className="text-xs text-slate-500">Repression Cases</div>
                    <div className="text-lg font-bold text-purple-400">{region.stats.repressionCases}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded p-2">
                    <div className="text-xs text-slate-500">Influence Level</div>
                    <div className="text-lg font-bold text-blue-400">{region.stats.influenceOps}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  {region.countries.join(' • ')}
                </div>
              </div>

              {/* Expanded Details */}
              {selectedRegion?.id === region.id && (
                <div className="border-t border-slate-700 p-4 bg-slate-900/30">
                  <p className="text-sm text-slate-300 mb-3">{region.details}</p>
                  
                  <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Recent Incidents</h4>
                  <ul className="space-y-1">
                    {region.incidents.map((incident, idx) => (
                      <li key={idx} className="text-xs text-slate-400 flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        {incident}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Global Statistics */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Global Totals</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">
              {regions.reduce((sum, r) => sum + r.stats.policeStations, 0)}+
            </div>
            <div className="text-sm text-slate-400">Police Stations</div>
            <div className="text-xs text-slate-500">in 53 countries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">
              {regions.reduce((sum, r) => sum + r.stats.confuciusInstitutes, 0)}+
            </div>
            <div className="text-sm text-slate-400">Confucius Institutes</div>
            <div className="text-xs text-slate-500">worldwide</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">
              {regions.reduce((sum, r) => sum + r.stats.repressionCases, 0)}+
            </div>
            <div className="text-sm text-slate-400">Repression Cases</div>
            <div className="text-xs text-slate-500">documented</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">6</div>
            <div className="text-sm text-slate-400">Regions Affected</div>
            <div className="text-xs text-slate-500">all continents</div>
          </div>
        </div>
      </div>

      {/* Sources */}
      <div className="text-xs text-slate-500 text-center">
        Data sourced from Safeguard Defenders, Freedom House, ASPI, and government reports. 
        Numbers are estimates and subject to change as new information emerges.
      </div>
    </div>
  );
};

export default GlobalInfluenceMap;
