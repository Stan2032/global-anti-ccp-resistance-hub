import React, { useState } from 'react';
import GlobalDisclaimer from './ui/GlobalDisclaimer';

const ForcedLabourList = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlternatives, setShowAlternatives] = useState({});

  const categories = [
    { key: 'all', label: 'All', count: 0 },
    { key: 'apparel', label: 'Apparel & Fashion', count: 0 },
    { key: 'tech', label: 'Technology', count: 0 },
    { key: 'automotive', label: 'Automotive', count: 0 },
  ];

  // Companies with DOCUMENTED evidence of forced labor links
  // Sources: ASPI "Uyghurs for Sale", HRW reports, US Customs actions, court cases
  const companies = [
    // === APPAREL & FASHION ===
    {
      name: 'Nike',
      category: 'apparel',
      issue: 'Linked to factories using transferred Uyghur workers in forced labor programs',
      evidence: 'Named in ASPI "Uyghurs for Sale" report (2020)',
      sourceUrl: 'https://www.aspi.org.au/report/uyghurs-sale',
      status: 'IMPLICATED',
      alternatives: [
        'New Balance (USA-made 990 series)',
        'Mizuno (Japan)',
        'Onitsuka Tiger (Japan)',
        'Moonstar (Japan)',
      ],
      response: 'Denied direct sourcing from Xinjiang'
    },
    {
      name: 'Adidas',
      category: 'apparel',
      issue: 'Supply chain links to Xinjiang cotton and factories using transferred Uyghur workers',
      evidence: 'Named in ASPI "Uyghurs for Sale" report (2020)',
      sourceUrl: 'https://www.aspi.org.au/report/uyghurs-sale',
      status: 'IMPLICATED',
      alternatives: [
        'New Balance (USA-made lines)',
        'Mizuno (Japan)',
        'Sessile (France)',
        'Komrads (Portugal)',
      ],
      response: 'Committed to phase out Xinjiang cotton'
    },
    {
      name: 'H&M',
      category: 'apparel',
      issue: 'Previously sourced from Xinjiang cotton suppliers',
      evidence: 'Better Cotton Initiative audit findings, ASPI report',
      sourceUrl: 'https://www.aspi.org.au/report/uyghurs-sale',
      status: 'IMPROVED',
      alternatives: [
        'American Giant (USA)',
        'Nudie Jeans (Sweden/Italy)',
        'Organic Basics (Denmark/Portugal)',
        'Saint James (France)',
      ],
      response: 'Banned Xinjiang cotton in 2021, faced China backlash'
    },
    {
      name: 'Zara (Inditex)',
      category: 'apparel',
      issue: 'Supply chain exposure to Xinjiang cotton',
      evidence: 'Coalition to End Forced Labour in the Uyghur Region research',
      sourceUrl: 'https://www.endforcedlabour.org/',
      status: 'IMPLICATED',
      alternatives: [
        'Raleigh Denim (North Carolina, USA)',
        'Nudie Jeans (Sweden/Italy)',
        'Mud Jeans (Netherlands/Tunisia)',
        'OrSlow (Japan)',
      ],
      response: 'Limited transparency on supply chain'
    },
    {
      name: 'Uniqlo',
      category: 'apparel',
      issue: 'Products detained at US border over forced labor concerns',
      evidence: 'US Customs and Border Protection detention orders (2021)',
      sourceUrl: 'https://www.cbp.gov/newsroom/national-media-release/cbp-issues-detention-order-silica-based-products-made-forced-labor',
      status: 'IMPLICATED',
      alternatives: [
        'American Giant (USA)',
        'Muji (Japan-made lines)',
        'Le Slip Français (France)',
        'Trigema (Germany)',
      ],
      response: 'Denied using Xinjiang cotton'
    },
    {
      name: 'Gap Inc.',
      category: 'apparel',
      issue: 'Linked to suppliers using transferred Uyghur workers',
      evidence: 'Named in ASPI "Uyghurs for Sale" report (2020)',
      sourceUrl: 'https://www.aspi.org.au/report/uyghurs-sale',
      status: 'IMPLICATED',
      alternatives: [
        'Buck Mason (USA)',
        'Carhartt (USA-made lines)',
        'Barbour (UK)',
        'Finisterre (UK)',
      ],
      response: 'Investigating supply chain'
    },
    {
      name: 'Shein',
      category: 'apparel',
      issue: 'Extensive China supply chain with minimal transparency, high risk of forced labor',
      evidence: 'Multiple investigations by Bloomberg, Public Eye',
      sourceUrl: 'https://www.publiceye.ch/en/topics/fashion/shein',
      status: 'CRITICAL',
      alternatives: [
        'ThredUp (secondhand)',
        'Poshmark (secondhand)',
        'Local thrift stores',
      ],
      response: 'Minimal disclosure, no transparency'
    },

    // === TECHNOLOGY ===
    {
      name: 'Apple',
      category: 'tech',
      issue: 'Suppliers linked to Uyghur forced labor transfer programs',
      evidence: 'Named in ASPI "Uyghurs for Sale" report, The Information investigations',
      sourceUrl: 'https://www.aspi.org.au/report/uyghurs-sale',
      status: 'IMPLICATED',
      alternatives: [
        'Framework Laptop (USA-designed, Taiwan assembly)',
        'System76 (Colorado, USA)',
        'Fujitsu (Japan - some models)',
      ],
      response: 'Auditing suppliers, removed some from supply chain'
    },
    {
      name: 'Samsung',
      category: 'tech',
      issue: 'Supply chain links to factories using transferred Uyghur workers',
      evidence: 'Named in ASPI "Uyghurs for Sale" report (2020)',
      sourceUrl: 'https://www.aspi.org.au/report/uyghurs-sale',
      status: 'IMPLICATED',
      alternatives: [
        'Sony Xperia (Japan - some models)',
        'Framework Laptop (modular, repairable)',
      ],
      response: 'Investigating allegations'
    },
    {
      name: 'Dell',
      category: 'tech',
      issue: 'Supplier exposure to forced labor in Xinjiang',
      evidence: 'Named in ASPI "Uyghurs for Sale" report (2020)',
      sourceUrl: 'https://www.aspi.org.au/report/uyghurs-sale',
      status: 'IMPLICATED',
      alternatives: [
        'Framework Laptop (USA-designed)',
        'System76 (USA)',
        'Fujitsu (Japan)',
      ],
      response: 'Committed to supply chain audits'
    },
    {
      name: 'HP',
      category: 'tech',
      issue: 'Supplier links to Uyghur forced labor transfer programs',
      evidence: 'Named in ASPI "Uyghurs for Sale" report (2020)',
      sourceUrl: 'https://www.aspi.org.au/report/uyghurs-sale',
      status: 'IMPLICATED',
      alternatives: [
        'Framework Laptop (USA)',
        'System76 (USA)',
        'Panasonic Toughbook (Japan)',
      ],
      response: 'Investigating supply chain'
    },
    {
      name: 'Huawei',
      category: 'tech',
      issue: 'Directly implicated in Xinjiang surveillance infrastructure and forced labor programs',
      evidence: 'IPVM investigations, leaked documents, US Entity List designation',
      sourceUrl: 'https://ipvm.com/reports/huawei-xinjiang',
      status: 'CRITICAL',
      alternatives: [
        'Google Pixel (USA-designed)',
        'Sony Xperia (Japan)',
        'Framework Laptop (modular phone alternative)',
      ],
      response: 'Denied involvement, on US Entity List'
    },
    {
      name: 'Hikvision',
      category: 'tech',
      issue: 'Surveillance cameras used in Xinjiang detention camps and forced labor monitoring',
      evidence: 'IPVM investigations, US Entity List designation (2019)',
      sourceUrl: 'https://ipvm.com/reports/hikvision-xinjiang',
      status: 'CRITICAL',
      alternatives: [
        'Axis Communications (Sweden)',
        'Bosch (Germany)',
        'Hanwha (South Korea)',
        'Panasonic (Japan)',
      ],
      response: 'On US Entity List since 2019'
    },
    {
      name: 'DJI',
      category: 'tech',
      issue: 'Drones used for surveillance in Xinjiang, company has Xinjiang operations',
      evidence: 'IPVM reports, US Entity List designation',
      sourceUrl: 'https://ipvm.com/reports/dji-xinjiang',
      status: 'CRITICAL',
      alternatives: [
        'Skydio (USA)',
        'Autel Robotics (USA division)',
      ],
      response: 'On US Entity List'
    },

    // === AUTOMOTIVE ===
    {
      name: 'Volkswagen',
      category: 'automotive',
      issue: 'Operates factory in Xinjiang, aluminum supply chain exposure to forced labor',
      evidence: 'Human Rights Watch "Asleep at the Wheel" report (2024), Der Spiegel investigations',
      sourceUrl: 'https://www.hrw.org/report/2024/11/18/asleep-wheel/car-companies-complicity-forced-labor-chinas-xinjiang-uyghur',
      status: 'CRITICAL',
      alternatives: [
        'Mazda (Japan)',
        'Subaru (Japan/USA)',
        'Lexus (Japan)',
      ],
      response: 'Defended Xinjiang factory, claimed no forced labor'
    },
    {
      name: 'BMW',
      category: 'automotive',
      issue: 'Aluminum supply chain exposure to Xinjiang forced labor',
      evidence: 'Human Rights Watch "Asleep at the Wheel" report (2024)',
      sourceUrl: 'https://www.hrw.org/report/2024/11/18/asleep-wheel/car-companies-complicity-forced-labor-chinas-xinjiang-uyghur',
      status: 'IMPLICATED',
      alternatives: [
        'Mazda (Japan)',
        'Subaru (Japan/USA)',
        'Hyundai (South Korea)',
        'Renault (France)',
      ],
      response: 'Investigating supply chain'
    },
    {
      name: 'Mercedes-Benz',
      category: 'automotive',
      issue: 'Aluminum supply chain exposure to Xinjiang forced labor',
      evidence: 'Human Rights Watch "Asleep at the Wheel" report (2024)',
      sourceUrl: 'https://www.hrw.org/report/2024/11/18/asleep-wheel/car-companies-complicity-forced-labor-chinas-xinjiang-uyghur',
      status: 'IMPLICATED',
      alternatives: [
        'Mazda (Japan)',
        'Volvo (Sweden)',
        'Genesis (South Korea)',
        'Alfa Romeo (Italy)',
      ],
      response: 'Committed to due diligence'
    },
    {
      name: 'Tesla',
      category: 'automotive',
      issue: 'Opened showroom in Xinjiang (2021), supply chain concerns',
      evidence: 'Reuters reporting, Human Rights Watch concerns',
      sourceUrl: 'https://www.reuters.com/business/autos-transportation/tesla-opens-showroom-xinjiang-china-2022-01-01/',
      status: 'HIGH RISK',
      alternatives: [
        'Rivian (USA)',
        'Lucid (USA)',
        'Hyundai Ioniq (South Korea)',
      ],
      response: 'Opened Xinjiang showroom despite criticism'
    },
    {
      name: 'General Motors',
      category: 'automotive',
      issue: 'Aluminum supply chain exposure to Xinjiang forced labor',
      evidence: 'Human Rights Watch "Asleep at the Wheel" report (2024)',
      sourceUrl: 'https://www.hrw.org/report/2024/11/18/asleep-wheel/car-companies-complicity-forced-labor-chinas-xinjiang-uyghur',
      status: 'IMPLICATED',
      alternatives: [
        'Ford (USA)',
        'Mazda (Japan)',
        'Kia (South Korea)',
        'Fiat (Italy)',
      ],
      response: 'Investigating supply chain'
    },
  ];

  const filteredCompanies = companies.filter(company => {
    const matchesCategory = selectedCategory === 'all' || company.category === selectedCategory;
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.issue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'CRITICAL': return 'bg-red-900/30 text-red-400 border-red-800';
      case 'HIGH RISK': return 'bg-orange-900/30 text-orange-400 border-orange-800';
      case 'IMPLICATED': return 'bg-yellow-900/30 text-yellow-400 border-yellow-800';
      case 'IMPROVED': return 'bg-[#111820] text-[#22d3ee] border-[#1c2a35]';
      default: return 'bg-gray-900/30 text-gray-400 border-gray-800';
    }
  };

  return (
    <div className="bg-[#0a0e14] text-white p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Companies Implicated in Forced Labour</h2>
        <p className="text-slate-400 mb-4">
          Evidence-based list of companies with documented links to forced labor in Xinjiang and other regions.
          All companies listed have verifiable evidence from credible sources including ASPI, Human Rights Watch, 
          US Customs actions, or court proceedings.
        </p>
        
        <div className="bg-yellow-900/20 border border-yellow-800 p-4 mb-4">
          <h3 className="font-bold text-yellow-400 mb-2">Important Disclaimer</h3>
          <p className="text-sm text-slate-300">
            <strong>Complete avoidance of China-made products is extremely difficult</strong>, especially for electronics 
            where Chinese components are ubiquitous. The alternatives listed prioritize brands with:
          </p>
          <ul className="text-sm text-slate-300 ml-4 mt-2 space-y-1">
            <li>• <strong>Zero or minimal China manufacturing</strong></li>
            <li>• <strong>Production in democratic countries</strong> (USA, EU, Japan, S. Korea, Taiwan)</li>
            <li>• <strong>Transparent supply chains</strong></li>
            <li>• <strong>Ethical labor practices</strong></li>
          </ul>
          <p className="text-sm text-slate-300 mt-2">
            However, even "Made in USA" products may contain Chinese components. The goal is to <strong>minimize</strong> 
            support for the CCP-controlled economy where possible.
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <input
          aria-label="Search"
          type="text"
          placeholder="Search companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-[#111820] border border-[#1c2a35] focus:outline-none focus:border-[#4afa82]"
        />
        
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-[#22d3ee] text-[#0a0e14]'
                  : 'bg-[#111820] text-slate-400 hover:bg-[#111820]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Companies List */}
      <div className="space-y-4">
        {filteredCompanies.map((company, index) => (
          <div key={index} className="bg-[#111820] border border-[#1c2a35] p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold">{company.name}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mt-2 ${getStatusColor(company.status)}`}>
                  {company.status}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-red-400 mb-1">Issue:</h4>
                <p className="text-slate-300">{company.issue}</p>
              </div>

              <div>
                <h4 className="font-semibold text-[#22d3ee] mb-1">Evidence:</h4>
                <p className="text-slate-300">{company.evidence}</p>
                <a 
                  href={company.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#22d3ee] hover:text-[#22d3ee] text-sm underline"
                >
                  View Source →
                </a>
              </div>

              <div>
                <h4 className="font-semibold text-slate-400 mb-1">Company Response:</h4>
                <p className="text-slate-300 text-sm italic">{company.response}</p>
              </div>

              <div>
                <button
                  onClick={() => setShowAlternatives({
                    ...showAlternatives,
                    [company.name]: !showAlternatives[company.name]
                  })}
                  className="text-green-400 hover:text-green-300 font-semibold text-sm"
                >
                  {showAlternatives[company.name] ? '▼ Hide' : '▶'} Ethical Alternatives (Democratic Countries Only)
                </button>
                
                {showAlternatives[company.name] && (
                  <div className="mt-2 pl-4 border-l-2 border-green-600">
                    <div className="bg-[#111820] border border-[#1c2a35] rounded p-2 mb-2">
                      <p className="text-xs text-[#22d3ee]">
                        <strong>China Exposure Ratings:</strong> 🟢 Zero (100% no China) | 🟡 Minimal (&lt;10% China components) | 🔴 Significant (avoid)
                      </p>
                    </div>
                    <ul className="space-y-1">
                      {company.alternatives.map((alt, i) => (
                        <li key={i} className="text-green-400 text-sm">
                          ✓ {alt}
                        </li>
                      ))}
                    </ul>
                    <GlobalDisclaimer type="verify" compact />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p>No companies found matching your search.</p>
        </div>
      )}

      <div className="mt-8 p-4 bg-[#111820] border border-[#1c2a35]">
        <h3 className="font-bold mb-2">Data Sources:</h3>
        <ul className="text-sm text-slate-400 space-y-1">
          <li>• <a href="https://www.aspi.org.au/report/uyghurs-sale" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">ASPI - "Uyghurs for Sale" (2020)</a></li>
          <li>• <a href="https://www.hrw.org/report/2024/11/18/asleep-wheel/car-companies-complicity-forced-labor-chinas-xinjiang-uyghur" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">Human Rights Watch - "Asleep at the Wheel" (2024)</a></li>
          <li>• <a href="https://www.cbp.gov/" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">US Customs and Border Protection - Detention Orders</a></li>
          <li>• <a href="https://ipvm.com/" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">IPVM - Surveillance Technology Investigations</a></li>
          <li>• <a href="https://www.endforcedlabour.org/" target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">Coalition to End Forced Labour in the Uyghur Region</a></li>
        </ul>
      </div>
    </div>
  );
};

export default ForcedLabourList;
