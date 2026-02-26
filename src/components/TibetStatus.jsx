import { useState } from 'react';
import { Mountain, AlertTriangle, BookOpen } from 'lucide-react';

const TibetStatus = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'repression', name: 'Repression' },
    { id: 'selfimmolation', name: 'Self-Immolations' },
    { id: 'cultural', name: 'Cultural Erasure' }
  ];

  const keyStats = [
    { label: 'Years occupied', value: '75', color: 'red' },
    { label: 'Self-immolations', value: '157+', color: 'orange' },
    { label: 'Political prisoners', value: '1,000+', color: 'yellow' },
    { label: 'Monasteries destroyed', value: '6,000+', color: 'blue' }
  ];

  const timeline = [
    { year: '1950', event: 'PLA invasion of Tibet begins' },
    { year: '1959', event: 'Tibetan Uprising; Dalai Lama flees to India' },
    { year: '1966-76', event: 'Cultural Revolution devastates Tibet' },
    { year: '1989', event: 'Martial law declared in Lhasa' },
    { year: '1995', event: 'Panchen Lama (6 years old) abducted by CCP' },
    { year: '2008', event: 'Protests across Tibet; violent crackdown' },
    { year: '2009', event: 'First self-immolation protest' },
    { year: '2020', event: 'Forced labor programs expanded' }
  ];

  const politicalPrisoners = [
    { name: 'Gedhun Choekyi Nyima', status: 'DISAPPEARED', since: '1995', details: '11th Panchen Lama, abducted at age 6' },
    { name: 'Rinchen Tsultrim', status: 'IMPRISONED', since: '2019', details: 'Monk, 4.5 years for "inciting separatism"' },
    { name: 'Tashi Wangchuk', status: 'RELEASED', since: '2016-2021', details: 'Language rights activist' },
    { name: 'Go Sherab Gyatso', status: 'IMPRISONED', since: '2020', details: 'Monk, 10 years for "separatism"' }
  ];

  const selfImmolations = {
    total: 157,
    inside: 131,
    outside: 26,
    deaths: 136,
    byYear: [
      { year: '2009', count: 1 },
      { year: '2011', count: 12 },
      { year: '2012', count: 85 },
      { year: '2013', count: 26 },
      { year: '2014', count: 11 },
      { year: '2015', count: 7 },
      { year: '2016', count: 3 },
      { year: '2017', count: 6 },
      { year: '2018', count: 1 },
      { year: '2019', count: 1 },
      { year: '2022', count: 2 }
    ]
  };

  const culturalErasure = [
    { type: 'Monasteries', stat: '6,000+ destroyed', description: 'During Cultural Revolution and ongoing' },
    { type: 'Language', stat: 'Marginalized', description: 'Mandarin mandatory in schools' },
    { type: 'Nomads', stat: '2M+ relocated', description: 'Forced settlement programs' },
    { type: 'Boarding schools', stat: '1M+ children', description: 'Separated from families' },
    { type: 'Surveillance', stat: 'Pervasive', description: 'Grid management, checkpoints' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-orange-500 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Mountain className="w-10 h-10 text-orange-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Tibet Status</h2>
            <p className="text-slate-300">75 years of occupation and resistance</p>
          </div>
        </div>
        
        <div className="bg-red-900/50 border border-red-700 p-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="text-red-300 font-semibold">OCCUPIED TERRITORY</span>
          </div>
          <p className="text-slate-300 text-sm mt-2">
            Tibet has been under Chinese occupation since 1950. The Dalai Lama remains in exile in India.
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
                ? 'bg-orange-600 text-white'
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
            <h3 className="text-xl font-bold text-white mb-4">Timeline of Occupation</h3>
            <div className="space-y-3">
              {timeline.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-orange-400 font-mono text-sm w-16">{item.year}</span>
                  <span className="text-slate-300">{item.event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Repression Tab */}
      {activeTab === 'repression' && (
        <div className="space-y-4">
          <div className="bg-[#111820] border border-[#1c2a35] p-6">
            <h3 className="text-xl font-bold text-white mb-4">Notable Political Prisoners</h3>
            <div className="space-y-3">
              {politicalPrisoners.map((prisoner, i) => (
                <div key={i} className="bg-[#111820] p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-white font-semibold">{prisoner.name}</span>
                      <p className="text-slate-400 text-sm">{prisoner.details}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      prisoner.status === 'DISAPPEARED' ? 'bg-purple-900/50 text-purple-300' :
                      prisoner.status === 'IMPRISONED' ? 'bg-red-900/50 text-red-300' :
                      'bg-green-900/50 text-green-300'
                    }`}>{prisoner.status}</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">Since: {prisoner.since}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-purple-900/30 border border-purple-700 p-4">
            <h4 className="text-purple-300 font-semibold mb-2">The Missing Panchen Lama</h4>
            <p className="text-slate-300 text-sm">
              Gedhun Choekyi Nyima was recognized as the 11th Panchen Lama by the Dalai Lama in 1995. 
              Three days later, at age 6, he was abducted by Chinese authorities. He has not been seen 
              publicly since and would now be 35 years old. He is the world's longest-held political prisoner.
            </p>
          </div>
        </div>
      )}

      {/* Self-Immolation Tab */}
      {activeTab === 'selfimmolation' && (
        <div className="space-y-4">
          <div className="bg-[#111820] border border-[#1c2a35] p-6">
            <h3 className="text-xl font-bold text-white mb-4">Self-Immolation Protests</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">{selfImmolations.total}</div>
                <div className="text-xs text-slate-400">Total cases</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{selfImmolations.deaths}</div>
                <div className="text-xs text-slate-400">Deaths</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{selfImmolations.inside}</div>
                <div className="text-xs text-slate-400">Inside Tibet</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#22d3ee]">{selfImmolations.outside}</div>
                <div className="text-xs text-slate-400">In exile</div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-white mb-3">By Year</h4>
            <div className="flex flex-wrap gap-2">
              {selfImmolations.byYear.map((item, i) => (
                <div key={i} className="bg-[#111820] rounded px-3 py-1 text-sm">
                  <span className="text-slate-400">{item.year}:</span>
                  <span className="text-orange-400 ml-1 font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-yellow-900/30 border border-yellow-700 p-4">
            <p className="text-yellow-300 text-sm">
              <span className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-yellow-300 flex-shrink-0 mt-0.5" /><span>These acts of protest reflect the desperation of Tibetans under occupation. Most called for Tibetan freedom and the return of the Dalai Lama.</span></span>
            </p>
          </div>
        </div>
      )}

      {/* Cultural Erasure Tab */}
      {activeTab === 'cultural' && (
        <div className="space-y-4">
          <div className="bg-[#111820] border border-[#1c2a35] p-6">
            <h3 className="text-xl font-bold text-white mb-4">Cultural Erasure</h3>
            <div className="space-y-4">
              {culturalErasure.map((item, i) => (
                <div key={i} className="bg-[#111820] p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">{item.type}</span>
                    <span className="text-red-400 font-bold">{item.stat}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-red-900/30 border border-red-700 p-4">
            <h4 className="text-red-300 font-semibold mb-2">Colonial Boarding Schools</h4>
            <p className="text-slate-300 text-sm">
              Over 1 million Tibetan children are in state-run boarding schools where they are 
              separated from families, forbidden to speak Tibetan, and indoctrinated with CCP ideology.
              This mirrors the residential school systems used against Indigenous peoples.
            </p>
          </div>
        </div>
      )}

      {/* Resources */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Tibet Resources</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <a href="https://savetibet.org/" target="_blank" rel="noopener noreferrer" className="bg-[#111820] hover:bg-[#1c2a35] p-4">
            <h4 className="text-white font-semibold">ICT</h4>
            <p className="text-slate-400 text-sm">International Campaign for Tibet</p>
          </a>
          <a href="https://freetibet.org/" target="_blank" rel="noopener noreferrer" className="bg-[#111820] hover:bg-[#1c2a35] p-4">
            <h4 className="text-white font-semibold">Free Tibet</h4>
            <p className="text-slate-400 text-sm">Campaign organization</p>
          </a>
          <a href="https://tibet.net/" target="_blank" rel="noopener noreferrer" className="bg-[#111820] hover:bg-[#1c2a35] p-4">
            <h4 className="text-white font-semibold">CTA</h4>
            <p className="text-slate-400 text-sm">Central Tibetan Administration</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TibetStatus;
