import { useState } from 'react';
import { Monitor, AlertTriangle, BookOpen } from 'lucide-react';

const ChinaTechThreats = () => {
  const [activeTab, setActiveTab] = useState('surveillance');

  const tabs = [
    { id: 'surveillance', name: 'Surveillance Tech' },
    { id: 'infrastructure', name: 'Critical Infrastructure' },
    { id: 'data', name: 'Data Collection' },
    { id: 'response', name: 'Global Response' }
  ];

  const surveillanceCompanies = [
    {
      name: 'Huawei',
      type: 'Telecom/Surveillance',
      status: 'SANCTIONED',
      threat: 'CRITICAL',
      details: '5G infrastructure, Safe City surveillance systems',
      countries: '170+ countries',
      sanctions: ['🇺🇸', '🇬🇧', '🇦🇺', '🇯🇵', '🇸🇪']
    },
    {
      name: 'Hikvision',
      type: 'Surveillance Cameras',
      status: 'SANCTIONED',
      threat: 'CRITICAL',
      details: 'World\'s largest CCTV manufacturer, used in Xinjiang camps',
      countries: '150+ countries',
      sanctions: ['🇺🇸', '🇬🇧', '🇪🇺']
    },
    {
      name: 'Dahua Technology',
      type: 'Surveillance Cameras',
      status: 'SANCTIONED',
      threat: 'HIGH',
      details: 'Facial recognition, used in Xinjiang surveillance',
      countries: '180+ countries',
      sanctions: ['🇺🇸']
    },
    {
      name: 'ZTE',
      type: 'Telecom',
      status: 'SANCTIONED',
      threat: 'HIGH',
      details: 'Telecom equipment, violated Iran sanctions',
      countries: '160+ countries',
      sanctions: ['🇺🇸']
    },
    {
      name: 'SenseTime',
      type: 'AI/Facial Recognition',
      status: 'SANCTIONED',
      threat: 'CRITICAL',
      details: 'AI surveillance, ethnic profiling technology',
      countries: '50+ countries',
      sanctions: ['🇺🇸', '🇬🇧']
    },
    {
      name: 'Megvii (Face++)',
      type: 'AI/Facial Recognition',
      status: 'SANCTIONED',
      threat: 'HIGH',
      details: 'Facial recognition AI used by Chinese police',
      countries: '30+ countries',
      sanctions: ['🇺🇸']
    },
    {
      name: 'iFlytek',
      type: 'Voice Recognition',
      status: 'SANCTIONED',
      threat: 'HIGH',
      details: 'Voice recognition, used for surveillance in Xinjiang',
      countries: '20+ countries',
      sanctions: ['🇺🇸']
    },
    {
      name: 'DJI',
      type: 'Drones',
      status: 'RESTRICTED',
      threat: 'MEDIUM',
      details: '70% global drone market, data security concerns',
      countries: '100+ countries',
      sanctions: ['🇺🇸']
    }
  ];

  const criticalInfrastructure = [
    {
      sector: '5G Networks',
      companies: 'Huawei, ZTE',
      risk: 'CRITICAL',
      concern: 'Backdoor access, data interception, network control',
      affected: '170+ countries with Huawei equipment'
    },
    {
      sector: 'Ports & Shipping',
      companies: 'COSCO, China Merchants',
      risk: 'HIGH',
      concern: 'Strategic chokepoints, intelligence gathering',
      affected: '100+ ports globally'
    },
    {
      sector: 'Power Grids',
      companies: 'State Grid, CGN',
      risk: 'HIGH',
      concern: 'Critical infrastructure control, potential sabotage',
      affected: 'Multiple countries including Philippines, Australia'
    },
    {
      sector: 'Undersea Cables',
      companies: 'HMN Technologies (Huawei Marine)',
      risk: 'CRITICAL',
      concern: 'Internet traffic interception, data surveillance',
      affected: '25% of global undersea cables'
    },
    {
      sector: 'Smart Cities',
      companies: 'Huawei Safe City, Hikvision',
      risk: 'CRITICAL',
      concern: 'Mass surveillance infrastructure export',
      affected: '100+ Safe City projects globally'
    }
  ];

  const dataCollection = [
    {
      app: 'TikTok',
      company: 'ByteDance',
      users: '1B+',
      risk: 'HIGH',
      concerns: 'Data harvesting, algorithm manipulation, CCP access'
    },
    {
      app: 'WeChat',
      company: 'Tencent',
      users: '1.2B+',
      risk: 'CRITICAL',
      concerns: 'Surveillance of diaspora, censorship, data sharing with CCP'
    },
    {
      app: 'BGI Genomics',
      company: 'BGI Group',
      users: 'Millions',
      risk: 'CRITICAL',
      concerns: 'Genetic data collection via COVID tests, prenatal tests'
    },
    {
      app: 'Temu/Pinduoduo',
      company: 'PDD Holdings',
      users: '100M+',
      risk: 'HIGH',
      concerns: 'Aggressive data collection, malware concerns'
    },
    {
      app: 'Shein',
      company: 'Roadget Business',
      users: '150M+',
      risk: 'MEDIUM',
      concerns: 'Supply chain opacity, data collection'
    }
  ];

  const globalResponse = [
    { country: '🇺🇸 USA', actions: 'Entity List, CHIPS Act, TikTok ban attempts, Huawei ban' },
    { country: '🇬🇧 UK', actions: 'Huawei 5G ban by 2027, Hikvision restrictions' },
    { country: '🇦🇺 Australia', actions: 'Huawei 5G ban, foreign investment screening' },
    { country: '🇯🇵 Japan', actions: 'Huawei/ZTE restrictions, economic security law' },
    { country: '🇸🇪 Sweden', actions: 'Complete Huawei/ZTE 5G ban' },
    { country: '🇮🇳 India', actions: 'Banned 200+ Chinese apps including TikTok' },
    { country: '🇪🇺 EU', actions: 'Toolbox approach, member state restrictions' },
    { country: '🇨🇦 Canada', actions: 'Huawei/ZTE 5G ban, TikTok government device ban' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-purple-500 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Monitor className="w-10 h-10 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">China Tech Threats</h2>
            <p className="text-slate-300">Surveillance technology and critical infrastructure risks</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">8</div>
            <div className="text-xs text-slate-400">Sanctioned Companies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">170+</div>
            <div className="text-xs text-slate-400">Countries Affected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">100+</div>
            <div className="text-xs text-slate-400">Safe City Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">2B+</div>
            <div className="text-xs text-slate-400">App Users at Risk</div>
          </div>
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
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-[#1c2a35]'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Surveillance Tech Tab */}
      {activeTab === 'surveillance' && (
        <div className="space-y-4">
          <div className="bg-[#111820] border border-[#1c2a35] p-6">
            <h3 className="text-xl font-bold text-white mb-4">Sanctioned Surveillance Companies</h3>
            <div className="space-y-3">
              {surveillanceCompanies.map((company, i) => (
                <div key={i} className="bg-slate-700/50 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-white font-semibold text-lg">{company.name}</span>
                      <span className="text-slate-400 text-sm ml-2">({company.type})</span>
                    </div>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        company.threat === 'CRITICAL' ? 'bg-red-900/50 text-red-300' :
                        company.threat === 'HIGH' ? 'bg-orange-900/50 text-orange-300' :
                        'bg-yellow-900/50 text-yellow-300'
                      }`}>{company.threat}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        company.status === 'SANCTIONED' ? 'bg-purple-900/50 text-purple-300' :
                        'bg-blue-900/50 text-blue-300'
                      }`}>{company.status}</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm">{company.details}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-slate-500 text-xs">Presence: {company.countries}</span>
                    <div className="flex gap-1">
                      {company.sanctions.map((flag, j) => (
                        <span key={j} className="text-sm">{flag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Critical Infrastructure Tab */}
      {activeTab === 'infrastructure' && (
        <div className="space-y-4">
          <div className="bg-[#111820] border border-[#1c2a35] p-6">
            <h3 className="text-xl font-bold text-white mb-4">Critical Infrastructure Risks</h3>
            <div className="space-y-4">
              {criticalInfrastructure.map((item, i) => (
                <div key={i} className="bg-slate-700/50 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-semibold">{item.sector}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.risk === 'CRITICAL' ? 'bg-red-900/50 text-red-300' :
                      'bg-orange-900/50 text-orange-300'
                    }`}>{item.risk} RISK</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-1">Companies: {item.companies}</p>
                  <p className="text-slate-300 text-sm mb-1">Concern: {item.concern}</p>
                  <p className="text-slate-500 text-xs">Affected: {item.affected}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Data Collection Tab */}
      {activeTab === 'data' && (
        <div className="space-y-4">
          <div className="bg-[#111820] border border-[#1c2a35] p-6">
            <h3 className="text-xl font-bold text-white mb-4">Data Collection Risks</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-[#1c2a35]">
                    <th className="pb-2">App/Service</th>
                    <th className="pb-2">Company</th>
                    <th className="pb-2">Users</th>
                    <th className="pb-2">Risk</th>
                    <th className="pb-2">Concerns</th>
                  </tr>
                </thead>
                <tbody>
                  {dataCollection.map((item, i) => (
                    <tr key={i} className="border-b border-[#1c2a35]">
                      <td className="py-3 text-white font-semibold">{item.app}</td>
                      <td className="py-3 text-slate-300">{item.company}</td>
                      <td className="py-3 text-slate-300">{item.users}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.risk === 'CRITICAL' ? 'bg-red-900/50 text-red-300' :
                          item.risk === 'HIGH' ? 'bg-orange-900/50 text-orange-300' :
                          'bg-yellow-900/50 text-yellow-300'
                        }`}>{item.risk}</span>
                      </td>
                      <td className="py-3 text-slate-400 text-xs">{item.concerns}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-red-900/30 border border-red-700 p-4">
            <h4 className="text-red-300 font-semibold mb-2"><AlertTriangle className="w-4 h-4 inline mr-1" /> BGI Genomics Warning</h4>
            <p className="text-slate-300 text-sm">
              BGI has collected genetic data from millions through COVID tests and prenatal screening. 
              This data could be used for bioweapon development, ethnic targeting, or surveillance.
            </p>
          </div>
        </div>
      )}

      {/* Global Response Tab */}
      {activeTab === 'response' && (
        <div className="space-y-4">
          <div className="bg-[#111820] border border-[#1c2a35] p-6">
            <h3 className="text-xl font-bold text-white mb-4">Global Response to China Tech</h3>
            <div className="space-y-3">
              {globalResponse.map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-700/50 p-3">
                  <span className="text-xl">{item.country.split(' ')[0]}</span>
                  <div>
                    <span className="text-white font-semibold">{item.country.split(' ').slice(1).join(' ')}</span>
                    <p className="text-slate-400 text-sm">{item.actions}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-green-900/30 border border-green-700 p-4">
            <h4 className="text-green-300 font-semibold mb-2">✅ What You Can Do</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Avoid Chinese-made surveillance cameras (Hikvision, Dahua)</li>
              <li>• Use non-Chinese alternatives for smart home devices</li>
              <li>• Be cautious with TikTok, WeChat, and other Chinese apps</li>
              <li>• Support legislation restricting Chinese tech in critical infrastructure</li>
              <li>• Check if your local government uses Chinese surveillance tech</li>
            </ul>
          </div>
        </div>
      )}

      {/* Resources */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h3 className="text-lg font-bold text-white mb-4"><BookOpen className="w-5 h-5 inline mr-1" /> Resources</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <a href="https://www.aspi.org.au/report/mapping-chinas-tech-giants" target="_blank" rel="noopener noreferrer" className="bg-slate-700 hover:bg-[#1c2a35] p-4">
            <h4 className="text-white font-semibold">ASPI Tech Tracker</h4>
            <p className="text-slate-400 text-sm">Mapping China's tech giants</p>
          </a>
          <a href="https://www.csis.org/analysis/chinas-digital-silk-road" target="_blank" rel="noopener noreferrer" className="bg-slate-700 hover:bg-[#1c2a35] p-4">
            <h4 className="text-white font-semibold">CSIS Digital Silk Road</h4>
            <p className="text-slate-400 text-sm">Analysis of tech expansion</p>
          </a>
          <a href="https://www.bis.doc.gov/index.php/policy-guidance/lists-of-parties-of-concern/entity-list" target="_blank" rel="noopener noreferrer" className="bg-slate-700 hover:bg-[#1c2a35] p-4">
            <h4 className="text-white font-semibold">US Entity List</h4>
            <p className="text-slate-400 text-sm">Official sanctions list</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ChinaTechThreats;
