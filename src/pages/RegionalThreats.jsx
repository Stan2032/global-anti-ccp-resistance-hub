import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorldThreatMap from '../components/WorldThreatMap';
import PoliceStationsMap from '../components/PoliceStationsMap';
import ChinaExitBan from '../components/ChinaExitBan';
import TaiwanDefenseStatus from '../components/TaiwanDefenseStatus';
import HongKongStatus from '../components/HongKongStatus';
import XinjiangStatus from '../components/XinjiangStatus';
import TibetStatus from '../components/TibetStatus';
import ChinaTechThreats from '../components/ChinaTechThreats';
import GlobalInfluenceMap from '../components/GlobalInfluenceMap';
import RegionalIssues from '../components/RegionalIssues';
import DetentionFacilities from '../components/DetentionFacilities';
import ConfuciusInstituteTracker from '../components/ConfuciusInstituteTracker';
import DetentionFacilitiesTracker from '../components/DetentionFacilitiesTracker';

// Regional Threats Data
const THREATS_DATA = {
  taiwan: {
    name: 'Taiwan',
    status: 'CRITICAL',
    threatLevel: 'SEVERE',
    summary: 'Taiwan faces intensifying military, economic, and diplomatic pressure from the PRC. The PLA continues to build capabilities for a potential invasion while conducting regular military exercises and incursions into Taiwan\'s ADIZ.',
    keyDevelopments: [
      'PLA acquiring Russian airborne equipment for Taiwan invasion (Dec 2025 ISW)',
      'New "Jiutian" drone carrier can deploy 100 attack drones with 7,000km range',
      'US $11.1B arms package to Taiwan (Dec 18, 2025)',
      'China threatens "forceful measures" in response to US arms sales',
      '2026 NDAA signed with $900.6B defense spending, Taiwan focus',
      'Taiwan Navy seeking 1,500 unmanned surface vessels for coastal defense',
      'Continued ADIZ incursions averaging 10+ aircraft daily'
    ],
    scenarios: [
      { name: 'Quarantine/Blockade', probability: 'MEDIUM-HIGH', description: 'Naval and air blockade to strangle Taiwan economically' },
      { name: 'Gray Zone Escalation', probability: 'HIGH', description: 'Continued escalation of ADIZ incursions, cyber attacks' },
      { name: 'Airborne Assault', probability: 'MEDIUM', description: 'PLA Airborne Corps seizes airports with Russian equipment' },
      { name: 'Full Invasion', probability: 'LOW-MEDIUM', description: 'Full-scale amphibious invasion with airborne support' },
      { name: 'Decapitation Strike', probability: 'LOW', description: 'Precision strikes on leadership' }
    ],
    defenseSpending: '$59 billion (2025)',
    allies: ['United States', 'Japan', 'Australia']
  },
  southChinaSea: {
    name: 'South China Sea',
    status: 'CONTESTED',
    threatLevel: 'HIGH',
    summary: 'China continues to militarize artificial islands and assert expansive territorial claims rejected by international law. December 2025 saw unprecedented naval buildup across the region.',
    keyDevelopments: [
      '100+ naval vessels spotted December 2025',
      'Electromagnetic kill zone established',
      'Anti-ship ballistic missile deployments',
      'Regular harassment of Philippine vessels',
      'Illegal fishing fleet operations'
    ],
    artificialIslands: [
      { name: 'Fiery Cross Reef', status: 'Militarized', features: 'Airstrip, radar, missiles' },
      { name: 'Subi Reef', status: 'Militarized', features: 'Airstrip, hangars' },
      { name: 'Mischief Reef', status: 'Militarized', features: 'Airstrip, radar' }
    ],
    affectedCountries: ['Philippines', 'Vietnam', 'Malaysia', 'Brunei', 'Indonesia'],
    legalStatus: 'China\'s claims rejected by 2016 Permanent Court of Arbitration'
  },
  eastChinaSea: {
    name: 'East China Sea',
    status: 'CONTESTED',
    threatLevel: 'HIGH',
    summary: 'Ongoing dispute over Senkaku/Diaoyu Islands with regular Chinese Coast Guard incursions into Japanese territorial waters.',
    keyDevelopments: [
      'Near-daily Coast Guard presence in contiguous zone',
      'ADIZ overlap since 2013',
      'Increased military exercises',
      'Fishing fleet incursions'
    ],
    disputedTerritory: 'Senkaku/Diaoyu Islands',
    parties: ['Japan (administers)', 'China (claims)', 'Taiwan (claims)'],
    usPosition: 'Covered under US-Japan Security Treaty Article 5'
  },
  beltAndRoad: {
    name: 'Belt and Road Initiative',
    status: 'EXPANDING',
    threatLevel: 'MEDIUM',
    summary: 'China\'s global infrastructure initiative has created debt dependencies and strategic footholds across 150+ countries.',
    keyDevelopments: [
      'Sri Lanka Hambantota Port 99-year lease',
      'Pakistan CPEC debt burden',
      'Djibouti military base',
      'Digital Silk Road expansion'
    ],
    debtTrapCases: [
      { country: 'Sri Lanka', project: 'Hambantota Port', outcome: '99-year lease after default' },
      { country: 'Pakistan', project: 'CPEC', outcome: 'Massive debt burden' },
      { country: 'Montenegro', project: 'Highway', outcome: 'Debt reaching 80% GDP' }
    ],
    participatingCountries: 150,
    estimatedInvestment: '$1 trillion+'
  }
};

const ThreatLevelBadge = ({ level }) => {
  const colors = {
    SEVERE: 'bg-red-600',
    HIGH: 'bg-orange-600',
    MEDIUM: 'bg-yellow-600',
    LOW: 'bg-green-600'
  };
  
  return (
    <span className={`${colors[level] || 'bg-gray-500'} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
      {level}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const colors = {
    CRITICAL: 'bg-red-500',
    CONTESTED: 'bg-yellow-500',
    EXPANDING: 'bg-blue-500'
  };
  
  return (
    <span className={`${colors[status] || 'bg-gray-500'} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
      {status}
    </span>
  );
};

const ThreatCard = ({ threat, isSelected, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-slate-800 rounded-lg p-6 cursor-pointer border-2 transition-all ${
        isSelected ? 'border-red-500' : 'border-slate-700 hover:border-slate-500'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{threat.name}</h3>
        <div className="flex gap-2">
          <StatusBadge status={threat.status} />
          <ThreatLevelBadge level={threat.threatLevel} />
        </div>
      </div>
      <p className="text-gray-400 text-sm line-clamp-3">{threat.summary}</p>
    </motion.div>
  );
};

const ThreatDetail = ({ threat }) => {
  if (!threat) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-lg p-6 mt-6"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{threat.name}</h2>
          <p className="text-gray-400">Threat Assessment</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={threat.status} />
          <ThreatLevelBadge level={threat.threatLevel} />
        </div>
      </div>
      
      <p className="text-gray-300 mb-6">{threat.summary}</p>
      
      {/* Key Developments */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Key Developments (2025)</h3>
        <ul className="space-y-2">
          {threat.keyDevelopments.map((dev, i) => (
            <li key={i} className="flex items-start text-gray-300">
              <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {dev}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Taiwan-specific: Scenarios */}
      {threat.scenarios && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Potential Scenarios</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {threat.scenarios.map((scenario, i) => (
              <div key={i} className="bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-white">{scenario.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    scenario.probability.includes('HIGH') ? 'bg-red-900 text-red-300' :
                    scenario.probability.includes('MEDIUM') ? 'bg-yellow-900 text-yellow-300' :
                    'bg-green-900 text-green-300'
                  }`}>
                    {scenario.probability}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{scenario.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* SCS-specific: Artificial Islands */}
      {threat.artificialIslands && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Militarized Artificial Islands</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-slate-700">
                  <th className="pb-2">Island</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Military Features</th>
                </tr>
              </thead>
              <tbody>
                {threat.artificialIslands.map((island, i) => (
                  <tr key={i} className="border-b border-slate-700">
                    <td className="py-2 text-white">{island.name}</td>
                    <td className="py-2">
                      <span className="bg-red-900 text-red-300 text-xs px-2 py-0.5 rounded">
                        {island.status}
                      </span>
                    </td>
                    <td className="py-2 text-gray-300">{island.features}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* BRI-specific: Debt Trap Cases */}
      {threat.debtTrapCases && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Debt Trap Diplomacy Cases</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {threat.debtTrapCases.map((case_, i) => (
              <div key={i} className="bg-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white">{case_.country}</h4>
                <p className="text-gray-400 text-sm">{case_.project}</p>
                <p className="text-red-400 text-sm mt-2">{case_.outcome}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Affected Countries */}
      {threat.affectedCountries && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Affected Countries</h3>
          <div className="flex flex-wrap gap-2">
            {threat.affectedCountries.map((country, i) => (
              <span key={i} className="bg-slate-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                {country}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Legal Status */}
      {threat.legalStatus && (
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-400 uppercase mb-1">International Law</h3>
          <p className="text-gray-300">{threat.legalStatus}</p>
        </div>
      )}
    </motion.div>
  );
};

const RegionalThreats = () => {
  const [selectedThreat, setSelectedThreat] = useState('taiwan');
  
  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Regional Security Threats</h1>
          <p className="text-gray-400">
            Monitoring CCP military expansion, territorial aggression, and influence operations across the Indo-Pacific region.
          </p>
        </div>
        
        {/* World Map */}
        <div className="mb-8">
          <WorldThreatMap />
        </div>
        
        {/* Police Stations Map */}
        <div className="mb-8">
          <PoliceStationsMap />
        </div>
        
        {/* Exit Bans & Hostage Diplomacy */}
        <div className="mb-8">
          <ChinaExitBan />
        </div>
        
        {/* Taiwan Defense Status */}
        <div className="mb-8">
          <TaiwanDefenseStatus />
        </div>
        
        {/* Hong Kong Status */}
        <div className="mb-8">
          <HongKongStatus />
        </div>
        
        {/* Xinjiang Status */}
        <div className="mb-8">
          <XinjiangStatus />
        </div>
        
        {/* Tibet Status */}
        <div className="mb-8">
          <TibetStatus />
        </div>
        
        {/* China Tech Threats */}
        <div className="mb-8">
          <ChinaTechThreats />
        </div>
        
        {/* Alert Banner */}
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-red-400 font-semibold">December 2025: Unprecedented Naval Buildup</h3>
              <p className="text-gray-300 text-sm mt-1">
                China is massing military ships across East Asian waters in what analysts call the "biggest ever" naval deployment.
                Over 100 vessels spotted from Yellow Sea through South China Sea.
              </p>
            </div>
          </div>
        </div>
        
        {/* Threat Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(THREATS_DATA).map(([key, threat]) => (
            <ThreatCard
              key={key}
              threat={threat}
              isSelected={selectedThreat === key}
              onClick={() => setSelectedThreat(key)}
            />
          ))}
        </div>
        
        {/* Selected Threat Detail */}
        <AnimatePresence mode="wait">
          <ThreatDetail key={selectedThreat} threat={THREATS_DATA[selectedThreat]} />
        </AnimatePresence>
        
        {/* Resources */}
        <div className="mt-12 bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Intelligence Sources</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <a
              href="https://www.csis.org/programs/china-power-project"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 hover:bg-slate-600 rounded-lg p-4 transition-colors"
            >
              <h3 className="text-white font-semibold">CSIS China Power</h3>
              <p className="text-gray-400 text-sm">Interactive analysis of China's military capabilities</p>
            </a>
            <a
              href="https://xjdp.aspi.org.au"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 hover:bg-slate-600 rounded-lg p-4 transition-colors"
            >
              <h3 className="text-white font-semibold">ASPI Xinjiang Data</h3>
              <p className="text-gray-400 text-sm">Satellite imagery of detention facilities</p>
            </a>
            <a
              href="https://understandingwar.org/research/china-taiwan/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 hover:bg-slate-600 rounded-lg p-4 transition-colors"
            >
              <h3 className="text-white font-semibold">ISW China-Taiwan</h3>
              <p className="text-gray-400 text-sm">Daily updates on cross-strait tensions</p>
            </a>
            <a
              href="https://amti.csis.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 hover:bg-slate-600 rounded-lg p-4 transition-colors"
            >
              <h3 className="text-white font-semibold">Asia Maritime Initiative</h3>
              <p className="text-gray-400 text-sm">South China Sea monitoring</p>
            </a>
          </div>
        </div>
      </div>

      {/* Global Influence Map */}
      <div className="mt-8">
        <GlobalInfluenceMap />
      </div>

      {/* Other Persecuted Groups */}
      <div className="mb-8">
        <RegionalIssues />
      </div>

      {/* Detention Facility Database */}
      <div className="mb-8">
        <DetentionFacilities />
      </div>
      
      {/* Confucius Institute Tracker */}
      <div className="mb-8">
        <ConfuciusInstituteTracker />
      </div>

      {/* Wide Research: Detention Facilities Tracker */}
      <div className="mb-8">
        <DetentionFacilitiesTracker />
      </div>
    </div>
  );
};

export default RegionalThreats;
