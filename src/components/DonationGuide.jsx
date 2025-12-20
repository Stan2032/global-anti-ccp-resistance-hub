import React, { useState } from 'react';

const DonationGuide = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeCause, setActiveCause] = useState('all');

  const categories = [
    { id: 'all', name: 'All Organizations', icon: '🌍' },
    { id: 'advocacy', name: 'Advocacy', icon: '📢' },
    { id: 'legal', name: 'Legal Aid', icon: '⚖️' },
    { id: 'research', name: 'Research', icon: '🔬' },
    { id: 'media', name: 'Independent Media', icon: '📰' },
    { id: 'direct', name: 'Direct Support', icon: '🤝' },
  ];

  const causes = [
    { id: 'all', name: 'All Causes' },
    { id: 'uyghur', name: 'Uyghur Rights' },
    { id: 'hongkong', name: 'Hong Kong' },
    { id: 'tibet', name: 'Tibet' },
    { id: 'china', name: 'China/Dissidents' },
    { id: 'general', name: 'General Human Rights' },
  ];

  const organizations = [
    // Uyghur Organizations
    {
      id: 1,
      name: 'Uyghur Human Rights Project',
      acronym: 'UHRP',
      category: 'advocacy',
      cause: 'uyghur',
      description: 'Leading organization documenting Uyghur human rights abuses and advocating for policy change',
      website: 'https://uhrp.org',
      donateUrl: 'https://uhrp.org/donate/',
      taxDeductible: true,
      country: 'USA',
      rating: 'Highly Recommended',
      impact: 'Policy briefings, UN advocacy, victim documentation',
    },
    {
      id: 2,
      name: 'Campaign for Uyghurs',
      acronym: 'CFU',
      category: 'advocacy',
      cause: 'uyghur',
      description: 'Grassroots advocacy organization led by Uyghur activists',
      website: 'https://campaignforuyghurs.org',
      donateUrl: 'https://campaignforuyghurs.org/donate/',
      taxDeductible: true,
      country: 'USA',
      rating: 'Recommended',
      impact: 'Congressional testimony, awareness campaigns',
    },
    {
      id: 3,
      name: 'Uyghur American Association',
      acronym: 'UAA',
      category: 'direct',
      cause: 'uyghur',
      description: 'Community organization supporting Uyghur diaspora and advocacy',
      website: 'https://uyghuramerican.org',
      donateUrl: 'https://uyghuramerican.org/donate',
      taxDeductible: true,
      country: 'USA',
      rating: 'Recommended',
      impact: 'Diaspora support, cultural preservation',
    },
    
    // Hong Kong Organizations
    {
      id: 4,
      name: 'Hong Kong Watch',
      acronym: 'HKW',
      category: 'advocacy',
      cause: 'hongkong',
      description: 'UK-based charity monitoring threats to Hong Kong freedoms',
      website: 'https://hongkongwatch.org',
      donateUrl: 'https://www.hongkongwatch.org/donate',
      taxDeductible: true,
      country: 'UK',
      rating: 'Highly Recommended',
      impact: 'Parliamentary advocacy, prisoner support, sanctions campaigns',
    },
    {
      id: 5,
      name: 'Committee for Freedom in Hong Kong Foundation',
      acronym: 'CFHK',
      category: 'advocacy',
      cause: 'hongkong',
      description: 'US-based organization advocating for Hong Kong democracy',
      website: 'https://cfhk.org',
      donateUrl: 'https://cfhk.org/donate/',
      taxDeductible: true,
      country: 'USA',
      rating: 'Recommended',
      impact: 'Congressional advocacy, awareness campaigns',
    },
    {
      id: 6,
      name: 'Hong Kong Democracy Council',
      acronym: 'HKDC',
      category: 'advocacy',
      cause: 'hongkong',
      description: 'Advocacy organization promoting Hong Kong human rights',
      website: 'https://hkdc.us',
      donateUrl: 'https://hkdc.us/donate/',
      taxDeductible: true,
      country: 'USA',
      rating: 'Recommended',
      impact: 'Policy advocacy, diaspora organizing',
    },
    
    // Tibet Organizations
    {
      id: 7,
      name: 'International Campaign for Tibet',
      acronym: 'ICT',
      category: 'advocacy',
      cause: 'tibet',
      description: 'Leading organization promoting Tibetan human rights and self-determination',
      website: 'https://savetibet.org',
      donateUrl: 'https://savetibet.org/donate/',
      taxDeductible: true,
      country: 'USA',
      rating: 'Highly Recommended',
      impact: 'Congressional advocacy, UN engagement, prisoner support',
    },
    {
      id: 8,
      name: 'Students for a Free Tibet',
      acronym: 'SFT',
      category: 'advocacy',
      cause: 'tibet',
      description: 'Grassroots network of students and activists for Tibetan independence',
      website: 'https://studentsforafreetibet.org',
      donateUrl: 'https://studentsforafreetibet.org/donate/',
      taxDeductible: true,
      country: 'USA',
      rating: 'Recommended',
      impact: 'Youth organizing, direct action, awareness',
    },
    {
      id: 9,
      name: 'Tibet Action Institute',
      acronym: 'TAI',
      category: 'research',
      cause: 'tibet',
      description: 'Strategic research and technology for Tibetan freedom movement',
      website: 'https://tibetaction.net',
      donateUrl: 'https://tibetaction.net/donate/',
      taxDeductible: true,
      country: 'USA',
      rating: 'Recommended',
      impact: 'Digital security, strategic research, training',
    },
    
    // China/Dissidents Organizations
    {
      id: 10,
      name: 'Chinese Human Rights Defenders',
      acronym: 'CHRD',
      category: 'advocacy',
      cause: 'china',
      description: 'Network promoting human rights and empowering grassroots activism in China',
      website: 'https://www.nchrd.org',
      donateUrl: 'https://www.nchrd.org/donate/',
      taxDeductible: true,
      country: 'USA',
      rating: 'Highly Recommended',
      impact: 'Prisoner documentation, UN advocacy, grassroots support',
    },
    {
      id: 11,
      name: 'Safeguard Defenders',
      acronym: 'SD',
      category: 'research',
      cause: 'china',
      description: 'Investigates and exposes CCP transnational repression',
      website: 'https://safeguarddefenders.com',
      donateUrl: 'https://safeguarddefenders.com/en/donate',
      taxDeductible: true,
      country: 'Spain',
      rating: 'Highly Recommended',
      impact: 'Overseas police stations research, RSDL documentation',
    },
    {
      id: 12,
      name: 'China Aid',
      acronym: 'CA',
      category: 'direct',
      cause: 'china',
      description: 'Supports persecuted Christians and human rights defenders in China',
      website: 'https://chinaaid.org',
      donateUrl: 'https://chinaaid.org/donate/',
      taxDeductible: true,
      country: 'USA',
      rating: 'Recommended',
      impact: 'Prisoner support, refugee assistance, documentation',
    },
    
    // Legal Aid
    {
      id: 13,
      name: 'Front Line Defenders',
      acronym: 'FLD',
      category: 'legal',
      cause: 'general',
      description: 'Protects human rights defenders at risk around the world',
      website: 'https://frontlinedefenders.org',
      donateUrl: 'https://www.frontlinedefenders.org/en/donate',
      taxDeductible: true,
      country: 'Ireland',
      rating: 'Highly Recommended',
      impact: '24/7 emergency support, security grants, advocacy',
    },
    {
      id: 14,
      name: 'Lawyers for Lawyers',
      acronym: 'L4L',
      category: 'legal',
      cause: 'general',
      description: 'Supports lawyers who are threatened or persecuted',
      website: 'https://lawyersforlawyers.org',
      donateUrl: 'https://lawyersforlawyers.org/en/donate/',
      taxDeductible: true,
      country: 'Netherlands',
      rating: 'Recommended',
      impact: 'Legal support for persecuted lawyers, advocacy',
    },
    
    // Independent Media
    {
      id: 15,
      name: 'Radio Free Asia',
      acronym: 'RFA',
      category: 'media',
      cause: 'general',
      description: 'Independent news organization covering Asia',
      website: 'https://www.rfa.org',
      donateUrl: 'https://www.rfa.org/about/donate',
      taxDeductible: false,
      country: 'USA',
      rating: 'Recommended',
      impact: 'Independent journalism in Uyghur, Tibetan, Cantonese, Mandarin',
    },
    {
      id: 16,
      name: 'Hong Kong Free Press',
      acronym: 'HKFP',
      category: 'media',
      cause: 'hongkong',
      description: 'Independent, non-profit news outlet covering Hong Kong',
      website: 'https://hongkongfp.com',
      donateUrl: 'https://support.hongkongfp.com/',
      taxDeductible: false,
      country: 'Hong Kong',
      rating: 'Highly Recommended',
      impact: 'Independent journalism, English-language coverage',
    },
    
    // Research
    {
      id: 17,
      name: 'Australian Strategic Policy Institute',
      acronym: 'ASPI',
      category: 'research',
      cause: 'general',
      description: 'Think tank with leading research on Xinjiang and CCP influence',
      website: 'https://www.aspi.org.au',
      donateUrl: 'https://www.aspi.org.au/support-aspi',
      taxDeductible: true,
      country: 'Australia',
      rating: 'Highly Recommended',
      impact: 'Xinjiang Data Project, forced labor research, policy analysis',
    },
  ];

  const filteredOrgs = organizations.filter(org => {
    const categoryMatch = activeCategory === 'all' || org.category === activeCategory;
    const causeMatch = activeCause === 'all' || org.cause === activeCause;
    return categoryMatch && causeMatch;
  });

  const getCategoryInfo = (categoryId) => categories.find(c => c.id === categoryId);

  const ratingColors = {
    'Highly Recommended': 'bg-green-900/30 text-green-400 border-green-700/50',
    'Recommended': 'bg-blue-900/30 text-blue-400 border-blue-700/50',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-6 border border-green-700/50">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">💝</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Donation Guide</h2>
            <p className="text-slate-400">Support organizations fighting for human rights</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          Your donations directly support the fight against CCP authoritarianism. All organizations 
          listed here have been vetted for their impact and transparency.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-white">{organizations.length}</div>
          <div className="text-xs text-slate-400">Organizations</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {organizations.filter(o => o.rating === 'Highly Recommended').length}
          </div>
          <div className="text-xs text-slate-400">Highly Recommended</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {organizations.filter(o => o.taxDeductible).length}
          </div>
          <div className="text-xs text-slate-400">Tax Deductible</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {new Set(organizations.map(o => o.country)).size}
          </div>
          <div className="text-xs text-slate-400">Countries</div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Cause</label>
          <div className="flex flex-wrap gap-2">
            {causes.map(cause => (
              <button
                key={cause.id}
                onClick={() => setActiveCause(cause.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeCause === cause.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cause.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Organizations Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredOrgs.map(org => {
          const categoryInfo = getCategoryInfo(org.category);
          
          return (
            <div 
              key={org.id}
              className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white">{org.name}</h3>
                  <p className="text-xs text-slate-500">{org.acronym} • {org.country}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded border ${ratingColors[org.rating]}`}>
                  {org.rating}
                </span>
              </div>
              
              <p className="text-sm text-slate-400 mb-3">{org.description}</p>
              
              <div className="flex items-center space-x-2 mb-3 text-xs">
                <span className="px-2 py-0.5 bg-slate-700 rounded text-slate-300">
                  {categoryInfo?.icon} {categoryInfo?.name}
                </span>
                {org.taxDeductible && (
                  <span className="px-2 py-0.5 bg-green-900/30 rounded text-green-400">
                    ✓ Tax Deductible
                  </span>
                )}
              </div>
              
              <p className="text-xs text-slate-500 mb-3">
                <strong>Impact:</strong> {org.impact}
              </p>
              
              <div className="flex space-x-2">
                <a
                  href={org.donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  💝 Donate
                </a>
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                >
                  Website
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4">
        <h3 className="font-medium text-white mb-2">💡 Donation Tips</h3>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• <strong>Monthly donations</strong> provide stable funding for ongoing work</li>
          <li>• <strong>Check tax deductibility</strong> based on your country of residence</li>
          <li>• <strong>Employer matching</strong> can double your impact</li>
          <li>• <strong>Spread donations</strong> across multiple organizations for broader impact</li>
          <li>• <strong>Consider smaller orgs</strong> where your donation has outsized impact</li>
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-xs text-slate-500">
        <p>
          <strong>Disclaimer:</strong> This guide is for informational purposes only. We do not receive 
          any compensation from listed organizations. Always verify an organization's current status 
          and tax-deductibility before donating. Ratings are based on publicly available information 
          about impact, transparency, and reputation.
        </p>
      </div>
    </div>
  );
};

export default DonationGuide;
