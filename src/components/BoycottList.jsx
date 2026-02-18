import { useState } from 'react';
import { SourcesList } from './ui/SourceAttribution';

const BoycottList = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlternatives, setShowAlternatives] = useState({});

  const categories = [
    { key: 'all', label: 'All', count: 0 },
    { key: 'apparel', label: 'Apparel & Fashion', count: 0 },
    { key: 'tech', label: 'Technology', count: 0 },
    { key: 'automotive', label: 'Automotive', count: 0 },
    { key: 'retail', label: 'Retail', count: 0 },
    { key: 'food', label: 'Food & Beverage', count: 0 },
  ];

  // Companies implicated in ASPI "Uyghurs for Sale" report and other investigations
  const companies = [
    // Apparel & Fashion
    {
      name: 'Nike',
      category: 'apparel',
      issue: 'Linked to factories using transferred Uyghur workers',
      source: 'ASPI Uyghurs for Sale',
      status: 'IMPLICATED',
      alternatives: ['New Balance (US-made lines)', 'Allbirds', 'Veja'],
      response: 'Denied direct sourcing from Xinjiang'
    },
    {
      name: 'Adidas',
      category: 'apparel',
      issue: 'Supply chain links to Xinjiang cotton and transferred workers',
      source: 'ASPI Uyghurs for Sale',
      status: 'IMPLICATED',
      alternatives: ['Allbirds', 'Veja', 'On Running'],
      response: 'Committed to phase out Xinjiang cotton'
    },
    {
      name: 'H&M',
      category: 'apparel',
      issue: 'Previously sourced from Xinjiang cotton suppliers',
      source: 'ASPI, BCI',
      status: 'IMPROVED',
      alternatives: ['Patagonia', 'Everlane', 'Reformation'],
      response: 'Banned Xinjiang cotton, faced China backlash'
    },
    {
      name: 'Zara (Inditex)',
      category: 'apparel',
      issue: 'Supply chain exposure to Xinjiang cotton',
      source: 'Coalition to End Forced Labour',
      status: 'IMPLICATED',
      alternatives: ['Reformation', 'Everlane', 'Pact'],
      response: 'Limited transparency'
    },
    {
      name: 'Uniqlo',
      category: 'apparel',
      issue: 'Products detained at US border over forced labor concerns',
      source: 'US Customs, ASPI',
      status: 'IMPLICATED',
      alternatives: ['Muji (some products)', 'Everlane'],
      response: 'Denied using Xinjiang cotton'
    },
    {
      name: 'Gap',
      category: 'apparel',
      issue: 'Linked to suppliers using transferred Uyghur workers',
      source: 'ASPI Uyghurs for Sale',
      status: 'IMPLICATED',
      alternatives: ['Patagonia', 'Pact', 'Kotn'],
      response: 'Investigating supply chain'
    },
    {
      name: 'Shein',
      category: 'apparel',
      issue: 'Extensive supply chain in China with minimal transparency',
      source: 'Multiple investigations',
      status: 'HIGH RISK',
      alternatives: ['ThredUp', 'Poshmark', 'Local thrift'],
      response: 'Minimal disclosure'
    },
    {
      name: 'Victoria\'s Secret',
      category: 'apparel',
      issue: 'Cotton supply chain exposure to Xinjiang',
      source: 'Coalition to End Forced Labour',
      status: 'IMPLICATED',
      alternatives: ['Organic Basics', 'Pact'],
      response: 'Limited response'
    },
    
    // Technology
    {
      name: 'Apple',
      category: 'tech',
      issue: 'Suppliers linked to Uyghur labor transfer programs',
      source: 'ASPI Uyghurs for Sale, The Information',
      status: 'IMPLICATED',
      alternatives: ['Fairphone', 'Framework Laptop'],
      response: 'Auditing suppliers, removed some'
    },
    {
      name: 'Samsung',
      category: 'tech',
      issue: 'Supply chain links to factories using transferred workers',
      source: 'ASPI Uyghurs for Sale',
      status: 'IMPLICATED',
      alternatives: ['Fairphone'],
      response: 'Investigating allegations'
    },
    {
      name: 'Dell',
      category: 'tech',
      issue: 'Supplier exposure to forced labor',
      source: 'ASPI Uyghurs for Sale',
      status: 'IMPLICATED',
      alternatives: ['Framework Laptop', 'System76'],
      response: 'Committed to supply chain audits'
    },
    {
      name: 'HP',
      category: 'tech',
      issue: 'Supplier links to Uyghur labor programs',
      source: 'ASPI Uyghurs for Sale',
      status: 'IMPLICATED',
      alternatives: ['Framework Laptop', 'System76'],
      response: 'Investigating supply chain'
    },
    {
      name: 'Huawei',
      category: 'tech',
      issue: 'Directly implicated in Xinjiang surveillance infrastructure',
      source: 'IPVM, ASPI',
      status: 'CRITICAL',
      alternatives: ['Any non-Chinese brand'],
      response: 'Denied involvement'
    },
    {
      name: 'Hikvision',
      category: 'tech',
      issue: 'Surveillance cameras used in Xinjiang detention camps',
      source: 'IPVM, US Entity List',
      status: 'CRITICAL',
      alternatives: ['Axis Communications', 'Bosch'],
      response: 'On US Entity List'
    },
    {
      name: 'DJI',
      category: 'tech',
      issue: 'Drones used for surveillance in Xinjiang',
      source: 'IPVM, US Entity List',
      status: 'HIGH RISK',
      alternatives: ['Skydio', 'Autel (non-China)'],
      response: 'On US Entity List'
    },
    
    // Automotive
    {
      name: 'Volkswagen',
      category: 'automotive',
      issue: 'Factory in Xinjiang, aluminum supply chain exposure',
      source: 'HRW, Der Spiegel',
      status: 'CRITICAL',
      alternatives: ['Toyota', 'Honda', 'Ford'],
      response: 'Defended Xinjiang factory'
    },
    {
      name: 'BMW',
      category: 'automotive',
      issue: 'Aluminum supply chain exposure to Xinjiang',
      source: 'HRW Asleep at the Wheel',
      status: 'IMPLICATED',
      alternatives: ['Toyota', 'Honda'],
      response: 'Investigating supply chain'
    },
    {
      name: 'Mercedes-Benz',
      category: 'automotive',
      issue: 'Aluminum supply chain exposure',
      source: 'HRW Asleep at the Wheel',
      status: 'IMPLICATED',
      alternatives: ['Toyota', 'Volvo'],
      response: 'Committed to due diligence'
    },
    {
      name: 'Tesla',
      category: 'automotive',
      issue: 'Opened showroom in Xinjiang, supply chain concerns',
      source: 'Reuters, HRW',
      status: 'HIGH RISK',
      alternatives: ['Rivian', 'Lucid'],
      response: 'Opened Xinjiang showroom despite criticism'
    },
    {
      name: 'General Motors',
      category: 'automotive',
      issue: 'Aluminum supply chain exposure',
      source: 'HRW Asleep at the Wheel',
      status: 'IMPLICATED',
      alternatives: ['Ford', 'Toyota'],
      response: 'Limited disclosure'
    },
    
    // Retail
    {
      name: 'Amazon',
      category: 'retail',
      issue: 'Sells products from UFLPA-listed entities',
      source: 'Tech Transparency Project',
      status: 'HIGH RISK',
      alternatives: ['Local retailers', 'eBay (with caution)'],
      response: 'Removing some products'
    },
    {
      name: 'Walmart',
      category: 'retail',
      issue: 'Supply chain exposure to Xinjiang cotton',
      source: 'Coalition to End Forced Labour',
      status: 'IMPLICATED',
      alternatives: ['Target', 'Costco'],
      response: 'Investigating supply chain'
    },
    {
      name: 'Costco',
      category: 'retail',
      issue: 'Some products linked to Xinjiang supply chains',
      source: 'Various reports',
      status: 'MONITORING',
      alternatives: ['Local co-ops'],
      response: 'Working on supply chain transparency'
    },
    
    // Food & Beverage
    {
      name: 'Coca-Cola',
      category: 'food',
      issue: 'Supplier links to Uyghur labor programs',
      source: 'ASPI Uyghurs for Sale',
      status: 'IMPLICATED',
      alternatives: ['Local brands', 'Olipop'],
      response: 'Investigating allegations'
    },
    {
      name: 'PepsiCo',
      category: 'food',
      issue: 'Supply chain exposure',
      source: 'ASPI Uyghurs for Sale',
      status: 'IMPLICATED',
      alternatives: ['Local brands'],
      response: 'Committed to supply chain audits'
    },
    {
      name: 'Kraft Heinz',
      category: 'food',
      issue: 'Tomato supply chain exposure to Xinjiang',
      source: 'Adrian Zenz research',
      status: 'HIGH RISK',
      alternatives: ['Local brands', 'Mutti (Italian)'],
      response: 'Limited response'
    }
  ];

  // Update category counts
  categories.forEach(cat => {
    if (cat.key === 'all') {
      cat.count = companies.length;
    } else {
      cat.count = companies.filter(c => c.category === cat.key).length;
    }
  });

  const filteredCompanies = companies.filter(company => {
    const matchesCategory = selectedCategory === 'all' || company.category === selectedCategory;
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'CRITICAL': return 'bg-red-600 text-white';
      case 'HIGH RISK': return 'bg-orange-500 text-white';
      case 'IMPLICATED': return 'bg-yellow-500 text-black';
      case 'IMPROVED': return 'bg-blue-500 text-white';
      case 'MONITORING': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-700/50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">🚫 Boycott Guide: Companies Linked to Forced Labor</h2>
        <p className="text-slate-300">
          These companies have been implicated in reports by ASPI, Human Rights Watch, and other organizations 
          for supply chain links to Uyghur forced labor. Consider alternatives when possible.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            <span className="text-slate-400">Critical: Direct involvement</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-slate-400">High Risk: Significant exposure</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-slate-400">Implicated: Supply chain links</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-slate-400">Improved: Taking action</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
        />
        <svg className="absolute right-4 top-3.5 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat.key
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Companies Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies.map((company, index) => (
          <div
            key={index}
            className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-500 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-white text-lg">{company.name}</h3>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(company.status)}`}>
                {company.status}
              </span>
            </div>
            
            <p className="text-sm text-slate-400 mb-2">{company.issue}</p>
            
            <div className="text-xs text-slate-500 mb-3">
              Source: {company.source}
            </div>
            
            <div className="text-xs text-slate-400 mb-3">
              <span className="text-slate-500">Response:</span> {company.response}
            </div>
            
            <button
              onClick={() => setShowAlternatives({...showAlternatives, [index]: !showAlternatives[index]})}
              className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
            >
              {showAlternatives[index] ? '▼' : '▶'} View Alternatives
            </button>
            
            {showAlternatives[index] && (
              <div className="mt-2 p-2 bg-green-900/20 border border-green-700/50 rounded">
                <p className="text-xs text-green-400 mb-1">Consider instead:</p>
                <div className="flex flex-wrap gap-1">
                  {company.alternatives.map((alt, i) => (
                    <span key={i} className="bg-green-800/50 text-green-300 px-2 py-0.5 rounded text-xs">
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sources */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <SourcesList
          sources={[
            {
              name: 'ASPI: Uyghurs for Sale',
              url: 'https://www.aspi.org.au/report/uyghurs-sale',
              type: 'NGO Report',
              organization: 'Australian Strategic Policy Institute',
              verified: true,
              description: 'Landmark 2020 report identifying 83 companies benefiting from Uyghur forced labor transfer programs.',
            },
            {
              name: 'HRW: Asleep at the Wheel',
              url: 'https://www.hrw.org/report/2024/02/01/asleep-wheel',
              type: 'Human Rights Report',
              organization: 'Human Rights Watch',
              verified: true,
              description: 'Investigation into automotive industry exposure to Xinjiang forced labor, particularly through aluminum supply chains.',
            },
            {
              name: 'Coalition to End Forced Labour in the Uyghur Region',
              url: 'https://enduyghurforcedlabour.org/',
              type: 'NGO Report',
              organization: 'Coalition to End Forced Labour',
              verified: true,
              description: 'Coalition of over 400 organizations calling on brands to exit the Uyghur Region.',
            },
            {
              name: 'US UFLPA Entity List',
              url: 'https://www.dhs.gov/uflpa-entity-list',
              type: 'Government Document',
              organization: 'U.S. Department of Homeland Security',
              verified: true,
              description: 'Official list of entities producing goods with forced labor under the Uyghur Forced Labor Prevention Act.',
            },
          ]}
          title="Sources & Further Reading"
        />
      </div>
    </div>
  );
};

export default BoycottList;
