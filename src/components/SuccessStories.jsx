import { useState } from 'react';

const SuccessStories = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Victories' },
    { id: 'sanctions', name: 'Sanctions' },
    { id: 'legislation', name: 'Legislation' },
    { id: 'closures', name: 'Closures' },
    { id: 'releases', name: 'Releases' },
    { id: 'awareness', name: 'Awareness' }
  ];

  const victories = [
    {
      title: 'Two Michaels Released',
      date: 'September 2021',
      category: 'releases',
      impact: 'HIGH',
      description: 'Michael Kovrig and Michael Spavor released after 1,000+ days of arbitrary detention in China, following resolution of Meng Wanzhou case.',
      outcome: 'Two Canadian citizens freed',
      lessons: 'International pressure and diplomatic coordination can secure releases'
    },
    {
      title: 'UFLPA Enacted',
      date: 'December 2021',
      category: 'legislation',
      impact: 'CRITICAL',
      description: 'Uyghur Forced Labor Prevention Act signed into law, presuming all goods from Xinjiang made with forced labor.',
      outcome: 'Major supply chain disruption for forced labor products',
      lessons: 'Bipartisan legislation possible on human rights issues'
    },
    {
      title: 'Huawei 5G Bans',
      date: '2020-2023',
      category: 'closures',
      impact: 'CRITICAL',
      description: 'Multiple countries banned Huawei from 5G networks: UK, Australia, Sweden, Japan, Canada, and others.',
      outcome: 'Reduced CCP access to critical infrastructure',
      lessons: 'Security concerns can override economic interests'
    },
    {
      title: 'Confucius Institute Closures',
      date: '2019-2024',
      category: 'closures',
      impact: 'HIGH',
      description: '100+ Confucius Institutes closed at US universities, with similar closures in Europe and Australia.',
      outcome: 'Reduced CCP academic influence',
      lessons: 'Transparency requirements effective at exposing influence operations'
    },
    {
      title: 'Coordinated Magnitsky Sanctions',
      date: 'March 2021',
      category: 'sanctions',
      impact: 'HIGH',
      description: 'US, UK, EU, and Canada simultaneously sanctioned Chinese officials for Xinjiang abuses.',
      outcome: 'First coordinated Western sanctions on China for human rights',
      lessons: 'IPAC coordination enables synchronized action'
    },
    {
      title: 'UN Xinjiang Report',
      date: 'August 2022',
      category: 'awareness',
      impact: 'CRITICAL',
      description: 'UN OHCHR released report finding "serious human rights violations" that "may constitute crimes against humanity."',
      outcome: 'Official UN documentation of abuses',
      lessons: 'Persistent advocacy can achieve institutional recognition'
    },
    {
      title: 'Genocide Declarations',
      date: '2021-2022',
      category: 'legislation',
      impact: 'CRITICAL',
      description: 'US, UK, Canada, Netherlands, Belgium, Lithuania, and Czech Republic declared Uyghur treatment a genocide.',
      outcome: 'Official recognition of genocide',
      lessons: 'Parliamentary motions can establish historical record'
    },
    {
      title: 'Police Station Closures',
      date: '2022-2024',
      category: 'closures',
      impact: 'HIGH',
      description: 'Following Safeguard Defenders report, multiple countries closed CCP overseas police stations.',
      outcome: 'Netherlands, Ireland, Canada closed stations; FBI arrests',
      lessons: 'Investigative journalism drives government action'
    },
    {
      title: 'Hong Kong BN(O) Visa',
      date: 'January 2021',
      category: 'legislation',
      impact: 'HIGH',
      description: 'UK opened pathway to citizenship for 5.4 million Hong Kong BN(O) passport holders.',
      outcome: '150,000+ Hong Kongers moved to UK',
      lessons: 'Immigration policy can provide refuge for persecuted'
    },
    {
      title: 'TikTok Government Bans',
      date: '2023-2024',
      category: 'closures',
      impact: 'MEDIUM',
      description: 'US, UK, EU, Canada, Australia banned TikTok on government devices; India banned entirely.',
      outcome: 'Reduced data security risks for officials',
      lessons: 'Security agencies can drive policy change'
    },
    {
      title: 'Nathan Law Granted Asylum',
      date: 'April 2021',
      category: 'releases',
      impact: 'MEDIUM',
      description: 'UK granted asylum to Hong Kong activist Nathan Law, defying CCP pressure.',
      outcome: 'Safe haven for prominent activist',
      lessons: 'Western countries can provide protection despite CCP threats'
    },
    {
      title: 'Lithuania Taiwan Office',
      date: 'November 2021',
      category: 'awareness',
      impact: 'HIGH',
      description: 'Lithuania allowed Taiwan to open representative office using "Taiwan" name, defying China.',
      outcome: 'Diplomatic breakthrough for Taiwan',
      lessons: 'Small countries can lead on principled positions'
    },
    {
      title: 'Ilham Tohti Sakharov Prize',
      date: 'October 2019',
      category: 'awareness',
      impact: 'MEDIUM',
      description: 'European Parliament awarded Sakharov Prize to imprisoned Uyghur economist Ilham Tohti.',
      outcome: 'International recognition of Uyghur cause',
      lessons: 'Awards keep attention on political prisoners'
    },
    {
      title: 'CHIPS Act Passed',
      date: 'August 2022',
      category: 'legislation',
      impact: 'CRITICAL',
      description: 'US CHIPS and Science Act provides $52B for domestic semiconductor production, reducing China dependence.',
      outcome: 'Major reshoring of critical technology',
      lessons: 'Economic security legislation can pass with bipartisan support'
    },
    {
      title: 'Export Controls on AI Chips',
      date: 'October 2022',
      category: 'sanctions',
      impact: 'CRITICAL',
      description: 'US imposed sweeping export controls on advanced semiconductors and AI chips to China.',
      outcome: 'Significant slowdown of China AI development',
      lessons: 'Technology controls can be effective leverage'
    },
    {
      title: 'Jimmy Lai Case Global Attention',
      date: 'December 2025',
      category: 'awareness',
      impact: 'CRITICAL',
      description: "Jimmy Lai's trial and life sentence drew unprecedented global condemnation from world leaders, UN experts, and press freedom organizations.",
      outcome: 'Massive international spotlight on Hong Kong repression',
      lessons: 'High-profile cases can galvanize global attention'
    },
    {
      title: 'EU Foreign Agents Transparency',
      date: '2024',
      category: 'legislation',
      impact: 'HIGH',
      description: 'EU introduced foreign interference transparency measures targeting CCP influence operations.',
      outcome: 'Increased scrutiny of CCP-linked entities',
      lessons: 'Transparency requirements expose hidden influence'
    },
    {
      title: 'Australia FITS Act',
      date: 'December 2018',
      category: 'legislation',
      impact: 'HIGH',
      description: 'Australia passed Foreign Influence Transparency Scheme Act, first Western country to do so.',
      outcome: 'Model legislation for other democracies',
      lessons: 'Early action can set precedent for allies'
    },
    {
      title: 'Chen Guangcheng Escape',
      date: 'April 2012',
      category: 'releases',
      impact: 'HIGH',
      description: 'Blind lawyer Chen Guangcheng escaped house arrest and reached US Embassy, later granted asylum.',
      outcome: 'Prominent dissident freed, continues advocacy',
      lessons: 'Individual courage combined with diplomatic support can succeed'
    },
    {
      title: 'Hikvision/Dahua Entity List',
      date: 'October 2019',
      category: 'sanctions',
      impact: 'HIGH',
      description: 'US added Hikvision, Dahua, and other surveillance companies to Entity List for Xinjiang abuses.',
      outcome: 'Restricted access to US technology',
      lessons: 'Export controls can target surveillance enablers'
    },
    {
      title: 'IPAC Formation',
      date: 'June 2020',
      category: 'awareness',
      impact: 'HIGH',
      description: 'Inter-Parliamentary Alliance on China formed with 250+ legislators from 30+ countries.',
      outcome: 'Coordinated cross-border legislative action',
      lessons: 'Parliamentary networks amplify individual efforts'
    },
    {
      title: 'Apple Daily Archives Preserved',
      date: '2021-2022',
      category: 'awareness',
      impact: 'MEDIUM',
      description: 'Despite forced closure, Apple Daily archives preserved by activists and institutions worldwide.',
      outcome: 'Historical record of Hong Kong press freedom preserved',
      lessons: 'Digital preservation can defeat censorship'
    },
    {
      title: 'Uyghur Tribunal Verdict',
      date: 'December 2021',
      category: 'awareness',
      impact: 'HIGH',
      description: 'Independent Uyghur Tribunal in London found China guilty of genocide against Uyghurs.',
      outcome: 'Detailed legal findings documenting atrocities',
      lessons: "People's tribunals can establish facts when official bodies fail"
    },
    {
      title: 'Hong Kong 47 Global Solidarity',
      date: '2021-2024',
      category: 'awareness',
      impact: 'HIGH',
      description: 'Worldwide solidarity campaigns for Hong Kong 47 defendants kept international attention on case.',
      outcome: 'Sustained pressure on CCP throughout lengthy trial',
      lessons: 'Sustained campaigns maintain pressure over years'
    },
    {
      title: 'Safeguard Defenders 110 Report',
      date: 'September 2022',
      category: 'awareness',
      impact: 'CRITICAL',
      description: 'NGO report exposed 102+ CCP overseas police stations, triggering global investigations.',
      outcome: '14+ countries launched investigations, multiple closures',
      lessons: 'Investigative NGO work can drive government action'
    }
  ];

  const filteredVictories = selectedCategory === 'all' 
    ? victories 
    : victories.filter(v => v.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🏆</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Victories Against CCP Influence</h2>
            <p className="text-slate-300">Documenting successful resistance efforts worldwide</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{victories.length}</div>
            <div className="text-xs text-slate-400">Documented Victories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">7+</div>
            <div className="text-xs text-slate-400">Genocide Declarations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">100+</div>
            <div className="text-xs text-slate-400">CI Closures</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">10+</div>
            <div className="text-xs text-slate-400">Countries Acting</div>
          </div>
        </div>
      </div>

      {/* Why This Matters */}
      <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-4">
        <h3 className="text-blue-300 font-semibold mb-2">💡 Why Document Victories?</h3>
        <p className="text-slate-300 text-sm">
          Tracking successes helps activists understand what works, maintains morale, and provides 
          templates for future campaigns. Every victory proves that resistance is not futile.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-green-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {cat.name}
            {cat.id !== 'all' && (
              <span className="ml-1 text-xs opacity-70">
                ({victories.filter(v => v.category === cat.id).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Victories List */}
      <div className="space-y-4">
        {filteredVictories.map((victory, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-white">{victory.title}</h3>
                <span className="text-slate-400 text-sm">{victory.date}</span>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full ${
                victory.impact === 'CRITICAL' ? 'bg-green-900/50 text-green-300 border border-green-700' :
                victory.impact === 'HIGH' ? 'bg-blue-900/50 text-blue-300 border border-blue-700' :
                'bg-slate-700 text-slate-300 border border-slate-600'
              }`}>
                {victory.impact} IMPACT
              </span>
            </div>
            
            <p className="text-slate-300 mb-4">{victory.description}</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-3">
                <span className="text-green-400 text-xs font-semibold">OUTCOME</span>
                <p className="text-slate-300 text-sm mt-1">{victory.outcome}</p>
              </div>
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
                <span className="text-blue-400 text-xs font-semibold">LESSONS LEARNED</span>
                <p className="text-slate-300 text-sm mt-1">{victory.lessons}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-3">🎯 Help Create More Victories</h3>
        <p className="text-slate-300 mb-4">
          Every victory started with individuals taking action. You can contribute to the next success story.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="/take-action" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Take Action Now
          </a>
          <a href="/campaigns" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Join a Campaign
          </a>
          <a href="/directory" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Find Organizations
          </a>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;
