import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

const LAW_LINKS = {
  'Global Magnitsky Act': 'https://www.congress.gov/bill/114th-congress/senate-bill/284',
  'Executive Order 13936': 'https://www.federalregister.gov/documents/2020/07/17/2020-15646/the-presidents-executive-order-on-hong-kong-normalization',
  'UFLPA': 'https://www.cbp.gov/trade/forced-labor/UFLPA',
  'Entity List': 'https://www.bis.doc.gov/index.php/policy-guidance/lists-of-parties-of-concern/entity-list',
  'Hong Kong Autonomy Act': 'https://www.congress.gov/bill/116th-congress/house-bill/7440',
  'UK Magnitsky Sanctions': 'https://www.legislation.gov.uk/uksi/2020/1272/contents',
  'EU Global Human Rights Sanctions': 'https://www.consilium.europa.eu/en/policies/sanctions/',
  'Special Economic Measures Act': 'https://laws-lois.justice.gc.ca/eng/acts/s-14.5/',
  'Autonomous Sanctions Act': 'https://www.legislation.gov.au/Series/C2011A00038',
};

const SanctionsTracker = () => {
  const [activeCountry, setActiveCountry] = useState('all');
  const [activeType, setActiveType] = useState('all');

  const countries = [
    { id: 'all', name: 'All Countries', flag: '🌍' },
    { id: 'us', name: 'United States', flag: '🇺🇸' },
    { id: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
    { id: 'eu', name: 'European Union', flag: '🇪🇺' },
    { id: 'canada', name: 'Canada', flag: '🇨🇦' },
    { id: 'australia', name: 'Australia', flag: '🇦🇺' },
  ];

  const sanctionTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'individual', name: 'Individual Sanctions' },
    { id: 'entity', name: 'Entity Sanctions' },
    { id: 'trade', name: 'Trade Restrictions' },
    { id: 'visa', name: 'Visa Bans' },
  ];

  const sanctions = [
    // US Sanctions
    {
      id: 1,
      country: 'us',
      type: 'individual',
      target: 'Chen Quanguo',
      role: 'Former Xinjiang Party Secretary',
      reason: 'Architect of Uyghur mass detention program',
      date: '2020-07-09',
      law: 'Global Magnitsky Act',
      status: 'active',
    },
    {
      id: 2,
      country: 'us',
      type: 'individual',
      target: 'Zhu Hailun',
      role: 'Former Deputy Secretary, Xinjiang Political and Legal Affairs Commission',
      reason: 'Implementing mass surveillance and detention',
      date: '2020-07-09',
      law: 'Global Magnitsky Act',
      status: 'active',
    },
    {
      id: 3,
      country: 'us',
      type: 'individual',
      target: 'Wang Junzheng',
      role: 'Xinjiang Party Secretary',
      reason: 'Human rights abuses against Uyghurs',
      date: '2021-03-22',
      law: 'Global Magnitsky Act',
      status: 'active',
    },
    {
      id: 4,
      country: 'us',
      type: 'entity',
      target: 'Xinjiang Production and Construction Corps (XPCC)',
      role: 'Paramilitary organization',
      reason: 'Forced labor and human rights abuses',
      date: '2020-07-31',
      law: 'Executive Order 13936',
      status: 'active',
    },
    {
      id: 5,
      country: 'us',
      type: 'trade',
      target: 'All Xinjiang Cotton',
      role: 'Agricultural product',
      reason: 'Presumption of forced labor under UFLPA',
      date: '2022-06-21',
      law: 'UFLPA',
      status: 'active',
    },
    {
      id: 6,
      country: 'us',
      type: 'entity',
      target: 'Hikvision',
      role: 'Surveillance technology company',
      reason: 'Enabling surveillance of Uyghurs',
      date: '2019-10-07',
      law: 'Entity List',
      status: 'active',
    },
    {
      id: 7,
      country: 'us',
      type: 'individual',
      target: 'Carrie Lam',
      role: 'Former Hong Kong Chief Executive',
      reason: 'Implementing National Security Law',
      date: '2020-08-07',
      law: 'Hong Kong Autonomy Act',
      status: 'active',
    },
    {
      id: 8,
      country: 'us',
      type: 'individual',
      target: 'John Lee',
      role: 'Hong Kong Chief Executive',
      reason: 'Undermining Hong Kong autonomy',
      date: '2020-08-07',
      law: 'Hong Kong Autonomy Act',
      status: 'active',
    },
    
    // UK Sanctions
    {
      id: 9,
      country: 'uk',
      type: 'individual',
      target: 'Chen Quanguo',
      role: 'Former Xinjiang Party Secretary',
      reason: 'Serious human rights violations',
      date: '2021-03-22',
      law: 'UK Magnitsky Sanctions',
      status: 'active',
    },
    {
      id: 10,
      country: 'uk',
      type: 'individual',
      target: 'Zhu Hailun',
      role: 'Former Xinjiang Security Chief',
      reason: 'Serious human rights violations',
      date: '2021-03-22',
      law: 'UK Magnitsky Sanctions',
      status: 'active',
    },
    {
      id: 11,
      country: 'uk',
      type: 'entity',
      target: 'Xinjiang Public Security Bureau',
      role: 'Government agency',
      reason: 'Operating detention facilities',
      date: '2021-03-22',
      law: 'UK Magnitsky Sanctions',
      status: 'active',
    },
    
    // EU Sanctions
    {
      id: 12,
      country: 'eu',
      type: 'individual',
      target: 'Chen Quanguo',
      role: 'Former Xinjiang Party Secretary',
      reason: 'Arbitrary detention of Uyghurs',
      date: '2021-03-22',
      law: 'EU Global Human Rights Sanctions',
      status: 'active',
    },
    {
      id: 13,
      country: 'eu',
      type: 'individual',
      target: 'Wang Junzheng',
      role: 'Xinjiang Party Secretary',
      reason: 'Mass surveillance and detention',
      date: '2021-03-22',
      law: 'EU Global Human Rights Sanctions',
      status: 'active',
    },
    {
      id: 14,
      country: 'eu',
      type: 'entity',
      target: 'Xinjiang Production and Construction Corps (XPCC)',
      role: 'Paramilitary organization',
      reason: 'Forced labor programs',
      date: '2021-03-22',
      law: 'EU Global Human Rights Sanctions',
      status: 'active',
    },
    
    // Canada Sanctions
    {
      id: 15,
      country: 'canada',
      type: 'individual',
      target: 'Chen Quanguo',
      role: 'Former Xinjiang Party Secretary',
      reason: 'Gross human rights violations',
      date: '2021-03-22',
      law: 'Special Economic Measures Act',
      status: 'active',
    },
    {
      id: 16,
      country: 'canada',
      type: 'individual',
      target: 'Wang Junzheng',
      role: 'Xinjiang Party Secretary',
      reason: 'Gross human rights violations',
      date: '2021-03-22',
      law: 'Special Economic Measures Act',
      status: 'active',
    },
    
    // Australia Sanctions
    {
      id: 17,
      country: 'australia',
      type: 'individual',
      target: 'Chen Quanguo',
      role: 'Former Xinjiang Party Secretary',
      reason: 'Serious human rights abuses',
      date: '2021-03-22',
      law: 'Autonomous Sanctions Act',
      status: 'active',
    },
    {
      id: 18,
      country: 'australia',
      type: 'individual',
      target: 'Wang Junzheng',
      role: 'Xinjiang Party Secretary',
      reason: 'Serious human rights abuses',
      date: '2021-03-22',
      law: 'Autonomous Sanctions Act',
      status: 'active',
    },
  ];

  const filteredSanctions = sanctions.filter(s => {
    const countryMatch = activeCountry === 'all' || s.country === activeCountry;
    const typeMatch = activeType === 'all' || s.type === activeType;
    return countryMatch && typeMatch;
  });

  const getCountryInfo = (countryId) => countries.find(c => c.id === countryId);

  const typeColors = {
    individual: 'bg-red-900/30 border-red-700/50',
    entity: 'bg-orange-900/30 border-orange-700/50',
    trade: 'bg-yellow-900/30 border-yellow-700/50',
    visa: 'bg-purple-900/30 border-purple-700/50',
  };

  const stats = {
    total: sanctions.length,
    individuals: sanctions.filter(s => s.type === 'individual').length,
    entities: sanctions.filter(s => s.type === 'entity').length,
    countries: new Set(sanctions.map(s => s.country)).size,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-xl p-6 border border-red-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-3xl mr-3">⚖️</span>
            <div>
              <h2 className="text-2xl font-bold text-white">Global Sanctions Tracker</h2>
              <p className="text-slate-400">Monitoring international sanctions on CCP officials and entities</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          Track sanctions imposed by democratic nations on Chinese officials and entities responsible for 
          human rights abuses in Xinjiang, Hong Kong, and Tibet.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-slate-400">Total Sanctions</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.individuals}</div>
          <div className="text-xs text-slate-400">Individuals</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">{stats.entities}</div>
          <div className="text-xs text-slate-400">Entities</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.countries}</div>
          <div className="text-xs text-slate-400">Countries</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Country</label>
          <div className="flex flex-wrap gap-2">
            {countries.map(country => (
              <button
                key={country.id}
                onClick={() => setActiveCountry(country.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeCountry === country.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Type</label>
          <div className="flex flex-wrap gap-2">
            {sanctionTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeType === type.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sanctions List */}
      <div className="space-y-3">
        {filteredSanctions.map(sanction => {
          const countryInfo = getCountryInfo(sanction.country);
          
          return (
            <div 
              key={sanction.id}
              className={`rounded-xl border p-4 ${typeColors[sanction.type]}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{countryInfo?.flag}</span>
                    <span className="font-bold text-white">{sanction.target}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      sanction.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {sanction.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-1">{sanction.role}</p>
                  <p className="text-sm text-slate-300 mb-2">{sanction.reason}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-400">
                      📅 {sanction.date}
                    </span>
                    {LAW_LINKS[sanction.law] ? (
                      <a
                        href={LAW_LINKS[sanction.law]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-800 rounded text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <span>📜 {sanction.law}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-400">
                        📜 {sanction.law}
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-400 capitalize">
                      🏷️ {sanction.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
        <h3 className="font-medium text-white mb-2">📢 Advocate for More Sanctions</h3>
        <p className="text-sm text-slate-300 mb-3">
          Many officials responsible for human rights abuses remain unsanctioned. Contact your representatives 
          to advocate for expanded sanctions.
        </p>
        <div className="flex flex-wrap gap-2">
          <a 
            href="/take-action" 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Contact Representatives
          </a>
          <a 
            href="https://www.cecc.gov/victims-database" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            CECC Victims Database
          </a>
        </div>
      </div>

      {/* Sources */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <h3 className="font-medium text-white mb-2">📚 Sources</h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <a href="https://www.treasury.gov/ofac" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            US Treasury OFAC
          </a>
          <a href="https://www.gov.uk/government/collections/uk-sanctions-list" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            UK Sanctions List
          </a>
          <a href="https://www.sanctionsmap.eu" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            EU Sanctions Map
          </a>
          <a href="https://www.international.gc.ca/world-monde/international_relations-relations_internationales/sanctions/china-chine.aspx" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Canada Sanctions
          </a>
        </div>
      </div>
    </div>
  );
};

export default SanctionsTracker;
