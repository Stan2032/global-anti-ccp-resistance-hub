import React, { useState } from 'react';
import GlobalDisclaimer from './ui/GlobalDisclaimer';

const CompanyTracker = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Companies' },
    { id: 'fashion', name: 'Fashion & Apparel' },
    { id: 'tech', name: 'Technology' },
    { id: 'auto', name: 'Automotive' },
    { id: 'retail', name: 'Retail' },
    { id: 'food', name: 'Food & Beverage' },
    { id: 'finance', name: 'Finance' },
  ];

  const companies = [
    // Fashion - Problematic
    {
      id: 1,
      name: 'Shein',
      category: 'fashion',
      status: 'avoid',
      issue: 'Documented links to Xinjiang cotton and forced labor',
      evidence: 'Multiple investigations found Xinjiang cotton in products',
      action: 'Avoid purchasing',
      source: 'Bloomberg, Channel 4 Investigation',
      lastUpdated: '2024-11',
    },
    {
      id: 2,
      name: 'Nike',
      category: 'fashion',
      status: 'concern',
      issue: 'Historical supply chain links to Xinjiang',
      evidence: 'ASPI report identified supplier connections',
      action: 'Committed to exit Xinjiang suppliers, verify progress',
      source: 'ASPI Uyghurs for Sale Report',
      lastUpdated: '2024-06',
    },
    {
      id: 3,
      name: 'H&M',
      category: 'fashion',
      status: 'improving',
      issue: 'Took public stance against Xinjiang cotton',
      evidence: 'Faced CCP backlash for human rights stance',
      action: 'Support for taking a stand',
      source: 'Company Statement 2021',
      lastUpdated: '2024-03',
    },
    {
      id: 4,
      name: 'Zara (Inditex)',
      category: 'fashion',
      status: 'concern',
      issue: 'Supply chain transparency concerns',
      evidence: 'Limited visibility into full supply chain',
      action: 'Request supply chain disclosure',
      source: 'Coalition to End Forced Labour',
      lastUpdated: '2024-08',
    },
    {
      id: 5,
      name: 'Uniqlo',
      category: 'fashion',
      status: 'concern',
      issue: 'Products detained under UFLPA',
      evidence: 'US Customs detained shipments',
      action: 'Monitor UFLPA compliance',
      source: 'US CBP Records',
      lastUpdated: '2024-09',
    },
    
    // Tech - Problematic
    {
      id: 6,
      name: 'Apple',
      category: 'tech',
      status: 'concern',
      issue: 'Supplier links to forced labor, censorship compliance',
      evidence: 'Multiple suppliers identified in ASPI report',
      action: 'Demand supply chain transparency',
      source: 'ASPI, The Information',
      lastUpdated: '2024-10',
    },
    {
      id: 7,
      name: 'Dell',
      category: 'tech',
      status: 'concern',
      issue: 'Supplier links to Xinjiang',
      evidence: 'ASPI identified supplier connections',
      action: 'Request supplier audit',
      source: 'ASPI Uyghurs for Sale Report',
      lastUpdated: '2024-06',
    },
    {
      id: 8,
      name: 'Hikvision',
      category: 'tech',
      status: 'avoid',
      issue: 'Directly enables Xinjiang surveillance',
      evidence: 'US Entity List, documented surveillance contracts',
      action: 'Do not purchase, advocate for removal',
      source: 'US Commerce Dept, IPVM',
      lastUpdated: '2024-11',
    },
    {
      id: 9,
      name: 'TikTok (ByteDance)',
      category: 'tech',
      status: 'avoid',
      issue: 'CCP data access, censorship of Xinjiang content',
      evidence: 'Internal documents, content moderation leaks',
      action: 'Consider alternatives, support legislation',
      source: 'BuzzFeed News, Forbes',
      lastUpdated: '2024-11',
    },
    
    // Auto
    {
      id: 10,
      name: 'Volkswagen',
      category: 'auto',
      status: 'avoid',
      issue: 'Factory in Xinjiang, refused to exit',
      evidence: 'Operates factory in Ürümqi despite pressure',
      action: 'Avoid purchasing, contact company',
      source: 'Reuters, DW',
      lastUpdated: '2024-10',
    },
    {
      id: 11,
      name: 'Tesla',
      category: 'auto',
      status: 'concern',
      issue: 'Opened showroom in Xinjiang',
      evidence: 'Xinjiang showroom opened 2022',
      action: 'Contact company, express concern',
      source: 'Reuters',
      lastUpdated: '2024-06',
    },
    {
      id: 12,
      name: 'BMW',
      category: 'auto',
      status: 'concern',
      issue: 'Supply chain concerns',
      evidence: 'Limited supply chain transparency',
      action: 'Request supply chain disclosure',
      source: 'Sheffield Hallam University',
      lastUpdated: '2024-08',
    },
    
    // Retail
    {
      id: 13,
      name: 'Amazon',
      category: 'retail',
      status: 'concern',
      issue: 'Hosts products from Xinjiang suppliers',
      evidence: 'Third-party sellers with Xinjiang links',
      action: 'Check product origins, report violations',
      source: 'Tech Transparency Project',
      lastUpdated: '2024-09',
    },
    {
      id: 14,
      name: 'Walmart',
      category: 'retail',
      status: 'concern',
      issue: 'Supply chain links to Xinjiang',
      evidence: 'Products traced to Xinjiang suppliers',
      action: 'Request supply chain transparency',
      source: 'Congressional Research',
      lastUpdated: '2024-07',
    },
    {
      id: 15,
      name: 'Costco',
      category: 'retail',
      status: 'improving',
      issue: 'Taking steps to audit supply chain',
      evidence: 'Announced enhanced due diligence',
      action: 'Monitor progress',
      source: 'Company Statements',
      lastUpdated: '2024-05',
    },
    
    // Food
    {
      id: 16,
      name: 'Coca-Cola',
      category: 'food',
      status: 'concern',
      issue: 'Supplier links to Xinjiang sugar',
      evidence: 'Supply chain includes Xinjiang-linked suppliers',
      action: 'Request supply chain audit',
      source: 'Sheffield Hallam University',
      lastUpdated: '2024-08',
    },
    {
      id: 17,
      name: 'PepsiCo',
      category: 'food',
      status: 'concern',
      issue: 'Similar supply chain concerns',
      evidence: 'Limited transparency on sourcing',
      action: 'Request supply chain disclosure',
      source: 'Coalition to End Forced Labour',
      lastUpdated: '2024-08',
    },
    
    // Finance
    {
      id: 18,
      name: 'BlackRock',
      category: 'finance',
      status: 'concern',
      issue: 'Investments in companies linked to Xinjiang',
      evidence: 'Holdings in sanctioned entities',
      action: 'Advocate for divestment',
      source: 'Hong Kong Watch Report',
      lastUpdated: '2024-10',
    },
    {
      id: 19,
      name: 'MSCI',
      category: 'finance',
      status: 'concern',
      issue: 'Includes problematic companies in indices',
      evidence: 'Index inclusion of sanctioned entities',
      action: 'Advocate for exclusion criteria',
      source: 'Financial Times',
      lastUpdated: '2024-09',
    },
  ];

  const statusInfo = {
    avoid: {
      color: 'bg-red-900/30 border-red-700/50',
      badge: 'bg-red-900/50 text-red-400',
      label: '🚫 Avoid',
      description: 'Documented serious concerns, recommend avoiding',
    },
    concern: {
      color: 'bg-orange-900/30 border-orange-700/50',
      badge: 'bg-orange-900/50 text-orange-400',
      label: '⚠️ Concern',
      description: 'Documented concerns, needs improvement',
    },
    improving: {
      color: 'bg-yellow-900/30 border-yellow-700/50',
      badge: 'bg-yellow-900/50 text-yellow-400',
      label: '📈 Improving',
      description: 'Taking steps to address issues',
    },
    good: {
      color: 'bg-green-900/30 border-green-700/50',
      badge: 'bg-green-900/50 text-green-400',
      label: '✅ Good',
      description: 'Strong human rights practices',
    },
  };

  const filteredCompanies = companies.filter(company => {
    const categoryMatch = activeCategory === 'all' || company.category === activeCategory;
    const searchMatch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const stats = {
    total: companies.length,
    avoid: companies.filter(c => c.status === 'avoid').length,
    concern: companies.filter(c => c.status === 'concern').length,
    improving: companies.filter(c => c.status === 'improving').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl p-6 border border-orange-700/50">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">🏢</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Company Accountability Tracker</h2>
            <p className="text-slate-400">Track corporate complicity in CCP human rights abuses</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          Many major companies have supply chain links to Xinjiang forced labor or enable CCP surveillance. 
          Use this tracker to make informed purchasing and investment decisions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-slate-400">Companies Tracked</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.avoid}</div>
          <div className="text-xs text-slate-400">Avoid</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">{stats.concern}</div>
          <div className="text-xs text-slate-400">Concern</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.improving}</div>
          <div className="text-xs text-slate-400">Improving</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search companies..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredCompanies.map(company => {
          const status = statusInfo[company.status];
          
          return (
            <div 
              key={company.id}
              className={`rounded-xl border p-4 ${status.color}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-white">{company.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded ${status.badge}`}>
                  {status.label}
                </span>
              </div>
              
              <p className="text-sm text-slate-300 mb-2">{company.issue}</p>
              
              <div className="text-xs text-slate-400 space-y-1 mb-3">
                <p><strong>Evidence:</strong> {company.evidence}</p>
                <p><strong>Recommended Action:</strong> {company.action}</p>
                <p><strong>Source:</strong> {company.source}</p>
              </div>
              
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Updated: {company.lastUpdated}</span>
                <span className="capitalize">{company.category.replace('-', ' ')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <h3 className="font-medium text-white mb-3">📊 Status Legend</h3>
        <div className="grid md:grid-cols-2 gap-2">
          {Object.entries(statusInfo).map(([key, info]) => (
            <div key={key} className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-0.5 rounded ${info.badge}`}>{info.label}</span>
              <span className="text-xs text-slate-400">{info.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
        <h3 className="font-medium text-white mb-2">📚 Research Sources</h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <a href="https://www.aspi.org.au/report/uyghurs-sale" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            ASPI - Uyghurs for Sale
          </a>
          <a href="https://www.shu.ac.uk/helena-kennedy-centre-international-justice/research-and-projects/all-projects/in-broad-daylight" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Sheffield Hallam - In Broad Daylight
          </a>
          <a href="https://enduyghurforcedlabour.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Coalition to End Forced Labour
          </a>
          <a href="https://www.cbp.gov/trade/forced-labor/UFLPA" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            US CBP - UFLPA Enforcement
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-xs text-slate-500">
        <GlobalDisclaimer type="changing" />
      </div>
    </div>
  );
};

export default CompanyTracker;
