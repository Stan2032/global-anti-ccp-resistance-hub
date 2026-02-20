import { useState } from 'react';
import { BookOpen } from 'lucide-react';

const TaiwanDefenseStatus = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'military', name: 'Military Balance' },
    { id: 'allies', name: 'Allied Support' },
    { id: 'scenarios', name: 'Scenarios' }
  ];

  const militaryBalance = {
    pla: {
      name: 'PLA (China)',
      personnel: '2,000,000+',
      aircraft: '3,200+',
      naval: '370+ vessels',
      missiles: '1,500+ ballistic',
      advantages: [
        'Overwhelming numerical superiority',
        'Growing amphibious capability',
        'Anti-access/area denial (A2/AD)',
        'Hypersonic missiles',
        'Cyber warfare capabilities'
      ]
    },
    taiwan: {
      name: 'Taiwan (ROC)',
      personnel: '170,000 active',
      aircraft: '400+',
      naval: '90+ vessels',
      missiles: 'Growing arsenal',
      advantages: [
        'Defensive geography (Taiwan Strait)',
        'Modern air defense systems',
        'Anti-ship missiles',
        'Asymmetric warfare doctrine',
        'High morale and training'
      ]
    }
  };

  const usArmsPackages = [
    { date: 'Dec 2025', value: '$11.1B', items: 'Advanced air defense, missiles, drones' },
    { date: 'Aug 2024', value: '$567M', items: 'Drone systems, missiles' },
    { date: 'Dec 2023', value: '$300M', items: 'Tactical systems' },
    { date: 'Jul 2023', value: '$440M', items: 'Ammunition, support equipment' },
    { date: '2022', value: '$1.1B', items: 'Anti-ship missiles, surveillance' }
  ];

  const alliedSupport = [
    {
      country: '🇺🇸 United States',
      commitment: 'Taiwan Relations Act',
      recent: 'Dec 2025: $11.1B arms package, 2026 NDAA Taiwan provisions',
      stance: 'Strategic ambiguity, strong unofficial support'
    },
    {
      country: '🇯🇵 Japan',
      commitment: 'US-Japan Security Treaty',
      recent: 'Increased defense spending, joint exercises',
      stance: 'Taiwan stability is Japanese security concern'
    },
    {
      country: '🇦🇺 Australia',
      commitment: 'AUKUS alliance',
      recent: 'Nuclear submarine program, increased Indo-Pacific focus',
      stance: 'Supports peaceful resolution, opposes unilateral change'
    },
    {
      country: '🇬🇧 United Kingdom',
      commitment: 'AUKUS, Indo-Pacific tilt',
      recent: 'Carrier deployments, parliamentary Taiwan support',
      stance: 'Opposes unilateral change to status quo'
    },
    {
      country: '🇪🇺 European Union',
      commitment: 'One China policy with caveats',
      recent: 'Lithuania Taiwan office, parliamentary visits',
      stance: 'Growing concern about cross-strait tensions'
    }
  ];

  const scenarios = [
    {
      name: 'Gray Zone Escalation',
      probability: 'ONGOING',
      color: 'yellow',
      description: 'Continued ADIZ incursions, cyber attacks, economic pressure, and information warfare.',
      indicators: [
        'Daily ADIZ incursions (10+ aircraft average)',
        'Cyber attacks on infrastructure',
        'Economic coercion campaigns',
        'Disinformation operations'
      ]
    },
    {
      name: 'Quarantine/Blockade',
      probability: 'MEDIUM-HIGH',
      color: 'orange',
      description: 'Naval and air blockade to strangle Taiwan economically without direct invasion.',
      indicators: [
        'Naval buildup in Taiwan Strait',
        'Exercises simulating blockade',
        'Threats to shipping lanes',
        'Energy supply vulnerabilities'
      ]
    },
    {
      name: 'Limited Strikes',
      probability: 'MEDIUM',
      color: 'orange',
      description: 'Precision strikes on military targets, infrastructure, or outlying islands.',
      indicators: [
        'Missile deployments',
        'Intelligence gathering',
        'Targeting of key infrastructure',
        'Kinmen/Matsu vulnerability'
      ]
    },
    {
      name: 'Full Invasion',
      probability: 'LOW-MEDIUM',
      color: 'red',
      description: 'Full-scale amphibious assault with air and naval support.',
      indicators: [
        'Amphibious capability buildup',
        'Russian equipment acquisition',
        'Large-scale exercises',
        'Strategic reserve mobilization'
      ]
    }
  ];

  const recentDevelopments = [
    { date: 'Dec 2025', event: 'US approves $11.1B arms package to Taiwan', type: 'positive' },
    { date: 'Dec 2025', event: 'PLA acquiring Russian airborne equipment for Taiwan scenarios', type: 'negative' },
    { date: 'Dec 2025', event: 'China deploys "Jiutian" drone carrier with 100 attack drones', type: 'negative' },
    { date: 'Dec 2025', event: '2026 NDAA signed with $900.6B defense spending, Taiwan focus', type: 'positive' },
    { date: 'Nov 2025', event: 'Taiwan Navy seeking 1,500 unmanned surface vessels', type: 'positive' },
    { date: 'Oct 2025', event: 'Record 153 PLA aircraft detected in single day', type: 'negative' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-blue-500 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🇹🇼</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Taiwan Defense Status</h2>
            <p className="text-slate-300">Real-time tracking of cross-strait military balance and allied support</p>
          </div>
        </div>
        
        {/* Alert Level */}
        <div className="bg-orange-900/50 border border-orange-700 p-4">
          <div className="flex items-center gap-2">
            <span className="animate-pulse w-3 h-3 bg-orange-500 rounded-full"></span>
            <span className="text-orange-300 font-semibold">ELEVATED THREAT LEVEL</span>
          </div>
          <p className="text-slate-300 text-sm mt-2">
            December 2025: Unprecedented naval buildup across East Asian waters. Over 100 vessels spotted from Yellow Sea through South China Sea.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-[#1c2a35]'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recent Developments */}
          <div className="bg-[#111820] border border-[#1c2a35] p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Developments</h3>
            <div className="space-y-3">
              {recentDevelopments.map((dev, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                    dev.type === 'positive' ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <div>
                    <span className="text-slate-400 text-sm">{dev.date}:</span>
                    <span className="text-slate-200 ml-2">{dev.event}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
              <div className="text-3xl font-bold text-red-400">100nm</div>
              <div className="text-xs text-slate-400">Taiwan Strait Width</div>
            </div>
            <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
              <div className="text-3xl font-bold text-orange-400">10+</div>
              <div className="text-xs text-slate-400">Daily ADIZ Incursions</div>
            </div>
            <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
              <div className="text-3xl font-bold text-green-400">$11.1B</div>
              <div className="text-xs text-slate-400">Latest US Arms Package</div>
            </div>
            <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">23.5M</div>
              <div className="text-xs text-slate-400">Taiwan Population</div>
            </div>
          </div>
        </div>
      )}

      {/* Military Balance Tab */}
      {activeTab === 'military' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* PLA */}
          <div className="bg-red-900/20 border border-red-700 p-6">
            <h3 className="text-xl font-bold text-red-400 mb-4">{militaryBalance.pla.name}</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Personnel:</span>
                <span className="text-white font-semibold">{militaryBalance.pla.personnel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Aircraft:</span>
                <span className="text-white font-semibold">{militaryBalance.pla.aircraft}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Naval Vessels:</span>
                <span className="text-white font-semibold">{militaryBalance.pla.naval}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Missiles:</span>
                <span className="text-white font-semibold">{militaryBalance.pla.missiles}</span>
              </div>
            </div>
            <h4 className="text-sm font-semibold text-red-300 mb-2">Key Advantages:</h4>
            <ul className="space-y-1">
              {militaryBalance.pla.advantages.map((adv, i) => (
                <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  {adv}
                </li>
              ))}
            </ul>
          </div>

          {/* Taiwan */}
          <div className="bg-blue-900/20 border border-blue-700 p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-4">{militaryBalance.taiwan.name}</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Personnel:</span>
                <span className="text-white font-semibold">{militaryBalance.taiwan.personnel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Aircraft:</span>
                <span className="text-white font-semibold">{militaryBalance.taiwan.aircraft}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Naval Vessels:</span>
                <span className="text-white font-semibold">{militaryBalance.taiwan.naval}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Missiles:</span>
                <span className="text-white font-semibold">{militaryBalance.taiwan.missiles}</span>
              </div>
            </div>
            <h4 className="text-sm font-semibold text-blue-300 mb-2">Key Advantages:</h4>
            <ul className="space-y-1">
              {militaryBalance.taiwan.advantages.map((adv, i) => (
                <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  {adv}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Allied Support Tab */}
      {activeTab === 'allies' && (
        <div className="space-y-6">
          {/* US Arms Packages */}
          <div className="bg-[#111820] border border-[#1c2a35] p-6">
            <h3 className="text-xl font-bold text-white mb-4">🇺🇸 US Arms Packages to Taiwan</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-[#1c2a35]">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Value</th>
                    <th className="pb-2">Contents</th>
                  </tr>
                </thead>
                <tbody>
                  {usArmsPackages.map((pkg, i) => (
                    <tr key={i} className="border-b border-[#1c2a35]">
                      <td className="py-2 text-white">{pkg.date}</td>
                      <td className="py-2 text-green-400 font-semibold">{pkg.value}</td>
                      <td className="py-2 text-slate-300">{pkg.items}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Allied Countries */}
          <div className="space-y-4">
            {alliedSupport.map((ally, i) => (
              <div key={i} className="bg-[#111820] border border-[#1c2a35] p-4">
                <h4 className="text-lg font-bold text-white mb-2">{ally.country}</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Commitment:</span>
                    <p className="text-slate-200">{ally.commitment}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Recent Actions:</span>
                    <p className="text-slate-200">{ally.recent}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Stance:</span>
                    <p className="text-slate-200">{ally.stance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scenarios Tab */}
      {activeTab === 'scenarios' && (
        <div className="space-y-4">
          {scenarios.map((scenario, i) => (
            <div key={i} className={`bg-[#111820] border p-6 ${
              scenario.color === 'yellow' ? 'border-yellow-700' :
              scenario.color === 'orange' ? 'border-orange-700' :
              'border-red-700'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-white">{scenario.name}</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  scenario.color === 'yellow' ? 'bg-yellow-900/50 text-yellow-300' :
                  scenario.color === 'orange' ? 'bg-orange-900/50 text-orange-300' :
                  'bg-red-900/50 text-red-300'
                }`}>
                  {scenario.probability}
                </span>
              </div>
              <p className="text-slate-300 mb-4">{scenario.description}</p>
              <h5 className="text-sm font-semibold text-slate-400 mb-2">Warning Indicators:</h5>
              <ul className="grid md:grid-cols-2 gap-2">
                {scenario.indicators.map((ind, j) => (
                  <li key={j} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-slate-500">•</span>
                    {ind}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Resources */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Taiwan Defense Resources</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="https://www.csis.org/programs/china-power-project"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-700 hover:bg-[#1c2a35] p-4 transition-colors"
          >
            <h4 className="text-white font-semibold">CSIS China Power</h4>
            <p className="text-slate-400 text-sm">Interactive military analysis</p>
          </a>
          <a
            href="https://understandingwar.org/research/china-taiwan/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-700 hover:bg-[#1c2a35] p-4 transition-colors"
          >
            <h4 className="text-white font-semibold">ISW China-Taiwan</h4>
            <p className="text-slate-400 text-sm">Daily situation updates</p>
          </a>
          <a
            href="https://www.taiwandefense.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-700 hover:bg-[#1c2a35] p-4 transition-colors"
          >
            <h4 className="text-white font-semibold">Taiwan Defense</h4>
            <p className="text-slate-400 text-sm">Military news and analysis</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TaiwanDefenseStatus;
