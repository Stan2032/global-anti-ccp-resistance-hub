import { useState } from 'react';

const HongKongStatus = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'laws', name: 'Repressive Laws' },
    { id: 'arrests', name: 'Arrests & Trials' },
    { id: 'exodus', name: 'Exodus' }
  ];

  const keyStats = [
    { label: 'Arrested since 2019', value: '10,000+', color: 'red' },
    { label: 'Charged under NSL', value: '291+', color: 'orange' },
    { label: 'Media outlets closed', value: '10+', color: 'yellow' },
    { label: 'Emigrated since 2020', value: '500,000+', color: 'blue' }
  ];

  const repressiveLaws = [
    {
      name: 'National Security Law (NSL)',
      date: 'June 30, 2020',
      status: 'ACTIVE',
      description: 'Criminalizes secession, subversion, terrorism, and collusion with foreign forces.',
      impact: ['Retroactive application', 'Extradition to mainland', 'Closed trials', 'No bail presumption'],
      cases: '291+ charged'
    },
    {
      name: 'Article 23',
      date: 'March 23, 2024',
      status: 'ACTIVE',
      description: 'Expands NSL with treason, sedition, external interference offenses.',
      impact: ['Life for treason', '20 years for sedition', 'Targets NGOs', 'External interference'],
      cases: 'First prosecutions expected'
    }
  ];

  const majorCases = [
    { name: 'Jimmy Lai', status: 'SENTENCED', charges: 'NSL collusion', details: '20 years (Feb 9, 2026)' },
    { name: 'Hong Kong 47', status: '45 CONVICTED', charges: 'NSL subversion', details: '4-10 year sentences' },
    { name: 'Chow Hang-tung', status: 'IMPRISONED', charges: 'NSL inciting subversion', details: 'Multiple sentences' }
  ];

  const closedOrgs = [
    { name: 'Apple Daily', type: 'Media', date: 'Jun 2021' },
    { name: 'Stand News', type: 'Media', date: 'Dec 2021' },
    { name: 'HK Alliance', type: 'Civil Society', date: 'Sep 2021' },
    { name: 'PTU (95K members)', type: 'Union', date: 'Aug 2021' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-yellow-500 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🇭🇰</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Hong Kong Freedom Status</h2>
            <p className="text-slate-300">Tracking erosion of autonomy since 2020</p>
          </div>
        </div>
        <div className="bg-red-900/50 border border-red-700 p-4">
          <span className="text-red-300 font-semibold">ONE COUNTRY, ONE SYSTEM</span>
          <p className="text-slate-300 text-sm mt-1">Jimmy Lai sentenced to 20 years. Article 23 in force. Two Systems ended 27 years early.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {keyStats.map((stat, i) => (
          <div key={i} className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
            <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</div>
            <div className="text-xs text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium ${activeTab === tab.id ? 'bg-yellow-600 text-white' : 'bg-[#111820] text-slate-300'}`}>
            {tab.name}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="bg-[#111820] border border-[#1c2a35] p-6">
          <h3 className="text-xl font-bold text-white mb-4">Closed Organizations</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {closedOrgs.map((org, i) => (
              <div key={i} className="bg-[#111820] p-3">
                <span className="text-white font-medium">{org.name}</span>
                <span className="text-slate-400 text-sm ml-2">({org.type}, {org.date})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'laws' && (
        <div className="space-y-4">
          {repressiveLaws.map((law, i) => (
            <div key={i} className="bg-[#111820] border border-red-700 p-6">
              <div className="flex justify-between mb-3">
                <h4 className="text-lg font-bold text-white">{law.name}</h4>
                <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full">{law.status}</span>
              </div>
              <p className="text-slate-300 mb-3">{law.description}</p>
              <div className="flex flex-wrap gap-2">
                {law.impact.map((item, j) => (
                  <span key={j} className="bg-red-900/30 text-red-300 text-xs px-2 py-1 rounded">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'arrests' && (
        <div className="space-y-4">
          {majorCases.map((c, i) => (
            <div key={i} className="bg-[#111820] border border-[#1c2a35] p-4">
              <div className="flex justify-between">
                <h4 className="font-bold text-white">{c.name}</h4>
                <span className="bg-red-900/50 text-red-300 text-xs px-2 py-1 rounded">{c.status}</span>
              </div>
              <p className="text-slate-400 text-sm">{c.charges} - {c.details}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'exodus' && (
        <div className="bg-[#111820] border border-[#1c2a35] p-6">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-[#22d3ee]">500,000+</div>
            <div className="text-slate-400">Estimated emigrants since 2020</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between"><span>🇬🇧 UK</span><span className="text-[#22d3ee]">180,000+ (BNO)</span></div>
            <div className="flex justify-between"><span>🇨🇦 Canada</span><span className="text-[#22d3ee]">50,000+</span></div>
            <div className="flex justify-between"><span>🇦🇺 Australia</span><span className="text-[#22d3ee]">20,000+</span></div>
          </div>
        </div>
      )}

      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h3 className="text-lg font-bold text-white mb-4">Resources</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <a href="https://www.hongkongwatch.org/" target="_blank" rel="noopener noreferrer" className="bg-[#111820] hover:bg-[#1c2a35] p-4">
            <h4 className="text-white font-semibold">Hong Kong Watch</h4>
          </a>
          <a href="https://www.hkdc.us/" target="_blank" rel="noopener noreferrer" className="bg-[#111820] hover:bg-[#1c2a35] p-4">
            <h4 className="text-white font-semibold">HK Democracy Council</h4>
          </a>
          <a href="https://www.cecc.gov/freedom-in-hong-kong" target="_blank" rel="noopener noreferrer" className="bg-[#111820] hover:bg-[#1c2a35] p-4">
            <h4 className="text-white font-semibold">CECC Hong Kong</h4>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HongKongStatus;
