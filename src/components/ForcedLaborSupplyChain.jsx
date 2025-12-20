import { useState } from 'react';

const ForcedLaborSupplyChain = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [showDetails, setShowDetails] = useState(null);

  const supplyChainData = {
    cotton: {
      industry: 'Cotton & Textiles',
      icon: '🧵',
      xinjiangShare: '85%',
      description: 'Xinjiang produces 85% of China\'s cotton and 20% of the world\'s supply. Forced labor is documented at every stage.',
      stages: [
        { name: 'Cotton Picking', risk: 'CRITICAL', description: 'Forced labor documented in cotton fields, including "labor transfer" programs' },
        { name: 'Ginning', risk: 'HIGH', description: 'Processing facilities often use forced labor' },
        { name: 'Spinning', risk: 'HIGH', description: 'Yarn production in Xinjiang factories' },
        { name: 'Weaving/Knitting', risk: 'MEDIUM', description: 'Fabric production, some outside Xinjiang' },
        { name: 'Garment Manufacturing', risk: 'MEDIUM', description: 'Final assembly, often in other provinces or countries' }
      ],
      majorBrands: ['Nike', 'Adidas', 'H&M', 'Zara', 'Uniqlo', 'Gap', 'Shein', 'Victoria\'s Secret'],
      alternatives: ['Organic cotton from India/US', 'Recycled materials', 'Hemp', 'Linen'],
      legislation: ['UFLPA (US)', 'EU Due Diligence Directive (proposed)']
    },
    polysilicon: {
      industry: 'Solar Panels',
      icon: '☀️',
      xinjiangShare: '35%',
      description: 'Xinjiang produces 35% of global polysilicon, a key component in solar panels. Major forced labor concerns.',
      stages: [
        { name: 'Quartz Mining', risk: 'HIGH', description: 'Raw material extraction' },
        { name: 'Polysilicon Production', risk: 'CRITICAL', description: 'Energy-intensive production in Xinjiang using cheap coal power' },
        { name: 'Wafer Manufacturing', risk: 'HIGH', description: 'Slicing polysilicon into wafers' },
        { name: 'Cell Production', risk: 'MEDIUM', description: 'Converting wafers to solar cells' },
        { name: 'Panel Assembly', risk: 'LOW', description: 'Final assembly, often outside China' }
      ],
      majorBrands: ['LONGi', 'JA Solar', 'Trina Solar', 'JinkoSolar', 'Canadian Solar'],
      alternatives: ['US-made polysilicon', 'European manufacturers', 'Thin-film technology'],
      legislation: ['UFLPA (US)', 'Solar panel import bans']
    },
    tomatoes: {
      industry: 'Tomatoes & Food',
      icon: '🍅',
      xinjiangShare: '70%',
      description: 'Xinjiang produces 70% of China\'s tomatoes and supplies major global food brands.',
      stages: [
        { name: 'Farming', risk: 'CRITICAL', description: 'Forced labor in tomato fields' },
        { name: 'Harvesting', risk: 'CRITICAL', description: 'Seasonal forced labor programs' },
        { name: 'Processing', risk: 'HIGH', description: 'Tomato paste production' },
        { name: 'Export', risk: 'MEDIUM', description: 'Shipped to Italy, US, and other markets' },
        { name: 'Final Products', risk: 'LOW', description: 'Incorporated into sauces, ketchup, etc.' }
      ],
      majorBrands: ['Heinz', 'Hunt\'s', 'Various Italian brands'],
      alternatives: ['Italian tomatoes', 'California tomatoes', 'Local sourcing'],
      legislation: ['UFLPA (US)', 'WRO on Xinjiang tomatoes']
    },
    electronics: {
      industry: 'Electronics',
      icon: '📱',
      xinjiangShare: 'Varies',
      description: 'Electronics supply chains are complex. Forced labor documented in component manufacturing and assembly.',
      stages: [
        { name: 'Raw Materials', risk: 'HIGH', description: 'Rare earth mining, some in Xinjiang' },
        { name: 'Component Manufacturing', risk: 'HIGH', description: 'Chips, screens, batteries' },
        { name: 'Sub-assembly', risk: 'MEDIUM', description: 'Circuit boards, modules' },
        { name: 'Final Assembly', risk: 'MEDIUM', description: 'Often in Guangdong or other provinces' },
        { name: 'Packaging', risk: 'LOW', description: 'Final packaging and shipping' }
      ],
      majorBrands: ['Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'Huawei'],
      alternatives: ['Fairphone', 'US-assembled options', 'Refurbished devices'],
      legislation: ['UFLPA (US)', 'EU Conflict Minerals Regulation']
    },
    automotive: {
      industry: 'Automotive',
      icon: '🚗',
      xinjiangShare: 'Varies',
      description: 'Auto parts supply chains include Xinjiang-sourced materials including aluminum, cotton for interiors, and electronics.',
      stages: [
        { name: 'Raw Materials', risk: 'HIGH', description: 'Aluminum, steel, rare earths' },
        { name: 'Parts Manufacturing', risk: 'MEDIUM', description: 'Various components' },
        { name: 'Interior Materials', risk: 'HIGH', description: 'Cotton, leather, plastics' },
        { name: 'Electronics', risk: 'MEDIUM', description: 'Chips, displays, wiring' },
        { name: 'Final Assembly', risk: 'LOW', description: 'Vehicle assembly' }
      ],
      majorBrands: ['Volkswagen', 'BMW', 'Mercedes-Benz', 'Tesla', 'GM', 'Toyota'],
      alternatives: ['EVs with verified supply chains', 'Used vehicles', 'Public transit'],
      legislation: ['UFLPA (US)', 'German Supply Chain Act']
    }
  };

  const industries = [
    { id: 'all', name: 'All Industries' },
    { id: 'cotton', name: 'Cotton & Textiles' },
    { id: 'polysilicon', name: 'Solar Panels' },
    { id: 'tomatoes', name: 'Tomatoes & Food' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'automotive', name: 'Automotive' }
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'CRITICAL': return 'bg-red-600';
      case 'HIGH': return 'bg-orange-600';
      case 'MEDIUM': return 'bg-yellow-600';
      case 'LOW': return 'bg-green-600';
      default: return 'bg-slate-600';
    }
  };

  const filteredData = selectedIndustry === 'all'
    ? Object.entries(supplyChainData)
    : Object.entries(supplyChainData).filter(([key]) => key === selectedIndustry);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 border border-orange-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">🔗 Forced Labor Supply Chains</h2>
        <p className="text-slate-300">
          Track how Xinjiang forced labor enters global supply chains. Understand the risks at each stage.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">85%</div>
            <div className="text-xs text-slate-400">China's Cotton from Xinjiang</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">35%</div>
            <div className="text-xs text-slate-400">Global Polysilicon</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">70%</div>
            <div className="text-xs text-slate-400">China's Tomatoes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">5</div>
            <div className="text-xs text-slate-400">Major Industries Affected</div>
          </div>
        </div>
      </div>

      {/* UFLPA Notice */}
      <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-4">
        <h3 className="font-bold text-white mb-2">📜 Uyghur Forced Labor Prevention Act (UFLPA)</h3>
        <p className="text-slate-300 text-sm">
          Since June 2022, the US presumes all goods from Xinjiang are made with forced labor and bans their import.
          Companies must prove their supply chains are clean to import goods.
        </p>
        <a 
          href="https://www.cbp.gov/trade/forced-labor/UFLPA" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline text-sm mt-2 inline-block"
        >
          Learn more about UFLPA →
        </a>
      </div>

      {/* Industry Filter */}
      <div className="flex flex-wrap gap-2">
        {industries.map((ind) => (
          <button
            key={ind.id}
            onClick={() => setSelectedIndustry(ind.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedIndustry === ind.id
                ? 'bg-orange-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {ind.name}
          </button>
        ))}
      </div>

      {/* Supply Chain Cards */}
      <div className="space-y-6">
        {filteredData.map(([key, data]) => (
          <div key={key} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{data.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{data.industry}</h3>
                    <p className="text-slate-400 text-sm">Xinjiang share: {data.xinjiangShare}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(showDetails === key ? null : key)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  {showDetails === key ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              <p className="text-slate-300 mt-3">{data.description}</p>
            </div>

            {/* Supply Chain Stages */}
            <div className="p-6 bg-slate-900/50">
              <h4 className="text-sm font-semibold text-slate-400 mb-4">SUPPLY CHAIN STAGES</h4>
              <div className="flex flex-wrap items-center gap-2">
                {data.stages.map((stage, i) => (
                  <div key={i} className="flex items-center">
                    <div className="bg-slate-700 rounded-lg p-3 text-center min-w-[120px]">
                      <div className="text-white text-sm font-medium">{stage.name}</div>
                      <span className={`${getRiskColor(stage.risk)} text-white text-xs px-2 py-0.5 rounded mt-1 inline-block`}>
                        {stage.risk}
                      </span>
                    </div>
                    {i < data.stages.length - 1 && (
                      <svg className="w-6 h-6 text-slate-600 mx-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Expanded Details */}
            {showDetails === key && (
              <div className="p-6 border-t border-slate-700">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Stage Details */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Stage Details</h4>
                    <div className="space-y-2">
                      {data.stages.map((stage, i) => (
                        <div key={i} className="text-sm">
                          <span className="text-slate-400">{stage.name}:</span>
                          <span className="text-slate-300 ml-2">{stage.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Major Brands */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Major Brands at Risk</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.majorBrands.map((brand, i) => (
                        <span key={i} className="bg-red-900/50 text-red-300 text-xs px-2 py-1 rounded">
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Alternatives */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Ethical Alternatives</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.alternatives.map((alt, i) => (
                        <span key={i} className="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded">
                          {alt}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3">
                      <h5 className="text-sm font-semibold text-slate-400 mb-1">Relevant Legislation:</h5>
                      <div className="flex flex-wrap gap-2">
                        {data.legislation.map((law, i) => (
                          <span key={i} className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded">
                            {law}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resources */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">📚 Supply Chain Resources</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="https://www.aspi.org.au/report/uyghurs-sale"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-700 hover:bg-slate-600 rounded-lg p-4 transition-colors"
          >
            <h4 className="text-white font-semibold">ASPI: Uyghurs for Sale</h4>
            <p className="text-slate-400 text-sm">Comprehensive report on forced labor in supply chains</p>
          </a>
          <a
            href="https://www.coalitiontoenduyghurforcedlabour.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-700 hover:bg-slate-600 rounded-lg p-4 transition-colors"
          >
            <h4 className="text-white font-semibold">End Uyghur Forced Labour</h4>
            <p className="text-slate-400 text-sm">Coalition of 400+ organizations</p>
          </a>
          <a
            href="https://www.cbp.gov/trade/forced-labor/UFLPA"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-700 hover:bg-slate-600 rounded-lg p-4 transition-colors"
          >
            <h4 className="text-white font-semibold">CBP UFLPA Portal</h4>
            <p className="text-slate-400 text-sm">Official US enforcement information</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForcedLaborSupplyChain;
