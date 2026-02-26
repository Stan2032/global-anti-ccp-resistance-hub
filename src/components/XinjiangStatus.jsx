import { useState } from 'react';
import { Mountain, BarChart3, BookOpen } from 'lucide-react';

const XinjiangStatus = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'camps', name: 'Detention Camps' },
    { id: 'forcedlabor', name: 'Forced Labor' },
    { id: 'cultural', name: 'Cultural Genocide' }
  ];

  const keyStats = [
    { label: 'Detained (est.)', value: '1-3M', color: 'red' },
    { label: 'Camps identified', value: '380+', color: 'orange' },
    { label: 'Mosques destroyed', value: '16,000+', color: 'yellow' },
    { label: 'Forced labor victims', value: '570,000+', color: 'blue' }
  ];

  const detentionCamps = [
    { name: 'Dabancheng', location: 'Ürümqi', capacity: '10,000+', status: 'ACTIVE', type: 'Mega facility' },
    { name: 'Kashgar', location: 'Kashgar Prefecture', capacity: '20,000+', status: 'ACTIVE', type: 'Multiple facilities' },
    { name: 'Hotan', location: 'Hotan Prefecture', capacity: '15,000+', status: 'ACTIVE', type: 'Multiple facilities' },
    { name: 'Aksu', location: 'Aksu Prefecture', capacity: '8,000+', status: 'ACTIVE', type: 'Industrial complex' }
  ];

  const forcedLaborSectors = [
    { sector: 'Cotton', share: '85%', description: 'Of China\'s cotton from Xinjiang', workers: '570,000+' },
    { sector: 'Polysilicon', share: '35%', description: 'Of global solar panel supply', workers: 'Unknown' },
    { sector: 'Tomatoes', share: '70%', description: 'Of China\'s tomato production', workers: 'Unknown' },
    { sector: 'Electronics', share: 'Various', description: 'Component manufacturing', workers: '80,000+' }
  ];

  const culturalDestruction = [
    { type: 'Mosques', destroyed: '16,000+', description: 'Demolished or damaged since 2017' },
    { type: 'Cemeteries', destroyed: '100+', description: 'Uyghur burial grounds destroyed' },
    { type: 'Religious sites', destroyed: '65%', description: 'Of religious sites damaged' },
    { type: 'Language', status: 'Banned', description: 'Uyghur banned in schools' }
  ];

  const internationalResponse = [
    { country: '🇺🇸 USA', action: 'Genocide declaration, UFLPA, sanctions', year: '2021' },
    { country: '🇬🇧 UK', action: 'Genocide amendment, sanctions', year: '2021' },
    { country: '🇨🇦 Canada', action: 'Genocide declaration, sanctions', year: '2021' },
    { country: '🇪🇺 EU', action: 'Sanctions on officials', year: '2021' },
    { country: '🇳🇱 Netherlands', action: 'Genocide declaration', year: '2021' },
    { country: '🇧🇪 Belgium', action: 'Genocide risk declaration', year: '2021' },
    { country: '🇱🇹 Lithuania', action: 'Genocide declaration', year: '2021' },
    { country: '🇺🇳 UN', action: 'OHCHR report: "crimes against humanity"', year: '2022' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-cyan-500 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Mountain className="w-10 h-10 text-[#22d3ee]" />
          <div>
            <h2 className="text-2xl font-bold text-white">Xinjiang / East Turkistan Status</h2>
            <p className="text-slate-300">Tracking the Uyghur genocide and mass detention</p>
          </div>
        </div>
        
        <div className="bg-red-900/50 border border-red-700 p-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-red-300 font-semibold">GENOCIDE IN PROGRESS</span>
          </div>
          <p className="text-slate-300 text-sm mt-2">
            UN OHCHR (Aug 2022): "Serious human rights violations... may constitute crimes against humanity"
          </p>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {keyStats.map((stat, i) => (
          <div key={i} className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
            <div className={`text-2xl font-bold ${
              stat.color === 'red' ? 'text-red-400' :
              stat.color === 'orange' ? 'text-orange-400' :
              stat.color === 'yellow' ? 'text-yellow-400' :
              'text-[#22d3ee]'
            }`}>{stat.value}</div>
            <div className="text-xs text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[#22d3ee] text-[#0a0e14]'
                : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35]'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-[#111820] border border-[#1c2a35] p-6">
            <h3 className="text-xl font-bold text-white mb-4">International Response</h3>
            <div className="space-y-3">
              {internationalResponse.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-[#111820] p-3">
                  <span className="text-white">{item.country}</span>
                  <div className="text-right">
                    <span className="text-slate-300 text-sm">{item.action}</span>
                    <span className="text-slate-500 text-xs ml-2">({item.year})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Camps Tab */}
      {activeTab === 'camps' && (
        <div className="space-y-4">
          <div className="bg-[#111820] border border-[#1c2a35] p-6">
            <h3 className="text-xl font-bold text-white mb-4">Major Detention Facilities</h3>
            <p className="text-slate-400 text-sm mb-4">
              380+ facilities identified through satellite imagery by ASPI, BuzzFeed News, and researchers
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-[#1c2a35]">
                    <th className="pb-2">Facility</th>
                    <th className="pb-2">Location</th>
                    <th className="pb-2">Capacity</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {detentionCamps.map((camp, i) => (
                    <tr key={i} className="border-b border-[#1c2a35]">
                      <td className="py-2 text-white">{camp.name}</td>
                      <td className="py-2 text-slate-300">{camp.location}</td>
                      <td className="py-2 text-slate-300">{camp.capacity}</td>
                      <td className="py-2">
                        <span className="bg-red-900/50 text-red-300 text-xs px-2 py-0.5 rounded">{camp.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-[#111820] border border-[#1c2a35] p-4">
            <p className="text-[#22d3ee] text-sm">
              <BarChart3 className="w-4 h-4 inline mr-1" /> View satellite imagery at{' '}
              <a href="https://xjdp.aspi.org.au/" target="_blank" rel="noopener noreferrer" className="underline">
                ASPI Xinjiang Data Project
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Forced Labor Tab */}
      {activeTab === 'forcedlabor' && (
        <div className="space-y-4">
          <div className="bg-[#111820] border border-[#1c2a35] p-6">
            <h3 className="text-xl font-bold text-white mb-4">Forced Labor by Sector</h3>
            <div className="space-y-4">
              {forcedLaborSectors.map((sector, i) => (
                <div key={i} className="bg-[#111820] p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">{sector.sector}</span>
                    <span className="text-[#22d3ee] font-bold">{sector.share}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{sector.description}</p>
                  <p className="text-slate-500 text-xs mt-1">Estimated workers: {sector.workers}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-yellow-900/30 border border-yellow-700 p-4">
            <h4 className="text-yellow-300 font-semibold mb-2">Key Legislation</h4>
            <p className="text-slate-300 text-sm">
              🇺🇸 <strong>UFLPA (2021)</strong>: Presumes all goods from Xinjiang made with forced labor, requires proof otherwise for import
            </p>
          </div>
        </div>
      )}

      {/* Cultural Genocide Tab */}
      {activeTab === 'cultural' && (
        <div className="space-y-4">
          <div className="bg-[#111820] border border-[#1c2a35] p-6">
            <h3 className="text-xl font-bold text-white mb-4">Cultural Destruction</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {culturalDestruction.map((item, i) => (
                <div key={i} className="bg-[#111820] p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">{item.type}</span>
                    <span className="text-red-400 font-bold">{item.destroyed || item.status}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[#111820] border border-[#1c2a35] p-6">
            <h4 className="text-lg font-semibold text-white mb-3">Additional Measures</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Forced sterilization of Uyghur women</li>
              <li>• Forced marriages to Han Chinese</li>
              <li>• Children separated from families</li>
              <li>• Mandatory "homestays" by CCP officials</li>
              <li>• Surveillance cameras in homes</li>
              <li>• Biometric data collection</li>
            </ul>
          </div>
        </div>
      )}

      {/* Resources */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Xinjiang Resources</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <a href="https://xjdp.aspi.org.au/" target="_blank" rel="noopener noreferrer" className="bg-[#111820] hover:bg-[#1c2a35] p-4">
            <h4 className="text-white font-semibold">ASPI Xinjiang Data</h4>
            <p className="text-slate-400 text-sm">Satellite imagery of camps</p>
          </a>
          <a href="https://shahit.biz/" target="_blank" rel="noopener noreferrer" className="bg-[#111820] hover:bg-[#1c2a35] p-4">
            <h4 className="text-white font-semibold">Xinjiang Victims Database</h4>
            <p className="text-slate-400 text-sm">35,000+ documented cases</p>
          </a>
          <a href="https://uhrp.org/" target="_blank" rel="noopener noreferrer" className="bg-[#111820] hover:bg-[#1c2a35] p-4">
            <h4 className="text-white font-semibold">UHRP</h4>
            <p className="text-slate-400 text-sm">Uyghur Human Rights Project</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default XinjiangStatus;
