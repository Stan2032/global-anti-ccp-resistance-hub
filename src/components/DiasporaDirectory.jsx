import React, { useState, useMemo } from 'react';
import { MapPin, Users, Search, ExternalLink, Mail, Globe, Phone } from 'lucide-react';

const DiasporaDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [communityFilter, setCommunityFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');

  const organizations = [
    // Uyghur Organizations
    {
      name: 'Uyghur American Association',
      community: 'Uyghur',
      country: 'United States',
      city: 'Washington, DC',
      description: 'Promotes Uyghur human rights and cultural preservation. Provides community support and advocacy.',
      website: 'https://uyghuramerican.org',
      email: 'contact@uyghuramerican.org',
      phone: '+1-202-349-1496',
      founded: '1998',
      members: '5,000+',
      services: ['Legal Aid', 'Cultural Events', 'Advocacy', 'Community Support'],
      verified: true
    },
    {
      name: 'World Uyghur Congress',
      community: 'Uyghur',
      country: 'Germany',
      city: 'Munich',
      description: 'International organization representing Uyghur diaspora worldwide. Coordinates global advocacy efforts.',
      website: 'https://www.uyghurcongress.org',
      email: 'contact@uyghurcongress.org',
      founded: '2004',
      members: '10,000+',
      services: ['International Advocacy', 'Documentation', 'Coordination'],
      verified: true
    },
    {
      name: 'Uyghur Canadian Society',
      community: 'Uyghur',
      country: 'Canada',
      city: 'Toronto',
      description: 'Serves Uyghur community in Canada with cultural, social, and advocacy programs.',
      website: 'https://uyghurcanadian.com',
      email: 'info@uyghurcanadian.com',
      founded: '2010',
      members: '2,000+',
      services: ['Cultural Preservation', 'Community Events', 'Advocacy'],
      verified: true
    },
    {
      name: 'Uyghur Association of Victoria',
      community: 'Uyghur',
      country: 'Australia',
      city: 'Melbourne',
      description: 'Supports Uyghur community in Australia with cultural activities and human rights advocacy.',
      website: 'https://uyghur.org.au',
      email: 'contact@uyghur.org.au',
      founded: '2012',
      members: '1,500+',
      services: ['Cultural Events', 'Advocacy', 'Community Support'],
      verified: true
    },
    
    // Hong Kong Organizations
    {
      name: 'Hong Kong Democracy Council',
      community: 'Hong Kong',
      country: 'United States',
      city: 'Washington, DC',
      description: 'Advocates for democracy and human rights in Hong Kong. Provides support for HK diaspora.',
      website: 'https://hkdc.us',
      email: 'info@hkdc.us',
      founded: '2019',
      members: '3,000+',
      services: ['Advocacy', 'Policy Research', 'Community Support'],
      verified: true
    },
    {
      name: 'Hong Kong Community Network UK',
      community: 'Hong Kong',
      country: 'United Kingdom',
      city: 'London',
      description: 'Supports Hong Kong diaspora in UK with settlement services and advocacy.',
      website: 'https://hkcommunitynetwork.org.uk',
      email: 'contact@hkcommunitynetwork.org.uk',
      founded: '2020',
      members: '8,000+',
      services: ['Settlement Support', 'Legal Aid', 'Cultural Events', 'Advocacy'],
      verified: true
    },
    {
      name: 'Canadians Supporting Hong Kong',
      community: 'Hong Kong',
      country: 'Canada',
      city: 'Vancouver',
      description: 'Coalition supporting Hong Kong democracy movement and diaspora in Canada.',
      website: 'https://supportinghk.org',
      email: 'info@supportinghk.org',
      founded: '2019',
      members: '5,000+',
      services: ['Advocacy', 'Community Events', 'Political Engagement'],
      verified: true
    },
    {
      name: 'Australia-Hong Kong Link',
      community: 'Hong Kong',
      country: 'Australia',
      city: 'Sydney',
      description: 'Connects Hong Kong diaspora in Australia and advocates for democracy.',
      website: 'https://australiahongkonglink.org',
      email: 'contact@australiahongkonglink.org',
      founded: '2020',
      members: '4,000+',
      services: ['Advocacy', 'Community Support', 'Cultural Preservation'],
      verified: true
    },
    
    // Tibetan Organizations
    {
      name: 'Tibetan Association of Northern California',
      community: 'Tibetan',
      country: 'United States',
      city: 'San Francisco',
      description: 'Serves Tibetan community in Northern California with cultural and social programs.',
      website: 'https://tibetannorcal.org',
      email: 'info@tibetannorcal.org',
      founded: '1997',
      members: '3,000+',
      services: ['Cultural Preservation', 'Language Classes', 'Community Events'],
      verified: true
    },
    {
      name: 'Tibetan Community UK',
      community: 'Tibetan',
      country: 'United Kingdom',
      city: 'London',
      description: 'Represents Tibetan diaspora in UK, organizing cultural events and advocacy.',
      website: 'https://tibetancommunityuk.org',
      email: 'contact@tibetancommunityuk.org',
      founded: '2005',
      members: '2,500+',
      services: ['Cultural Events', 'Advocacy', 'Community Support'],
      verified: true
    },
    {
      name: 'Tibetan Canadian Cultural Centre',
      community: 'Tibetan',
      country: 'Canada',
      city: 'Toronto',
      description: 'Promotes Tibetan culture and supports community in Canada.',
      website: 'https://tibetanculture.ca',
      email: 'info@tibetanculture.ca',
      founded: '2003',
      members: '2,000+',
      services: ['Cultural Preservation', 'Language Classes', 'Religious Services'],
      verified: true
    },
    {
      name: 'Tibetan Community of Australia',
      community: 'Tibetan',
      country: 'Australia',
      city: 'Melbourne',
      description: 'Serves Tibetan diaspora in Australia with cultural and social programs.',
      website: 'https://tibetanaustralia.org',
      email: 'contact@tibetanaustralia.org',
      founded: '2008',
      members: '1,800+',
      services: ['Cultural Events', 'Community Support', 'Advocacy'],
      verified: true
    },
    
    // Chinese Dissident Organizations
    {
      name: 'Human Rights in China',
      community: 'Chinese Dissidents',
      country: 'United States',
      city: 'New York',
      description: 'Monitors and advocates for human rights in China. Supports Chinese dissidents.',
      website: 'https://www.hrichina.org',
      email: 'hrichina@hrichina.org',
      founded: '1989',
      members: 'N/A',
      services: ['Documentation', 'Advocacy', 'Research', 'Legal Support'],
      verified: true
    },
    {
      name: 'Chinese Human Rights Defenders',
      community: 'Chinese Dissidents',
      country: 'United States',
      city: 'Washington, DC',
      description: 'Network of Chinese and international activists promoting human rights in China.',
      website: 'https://www.nchrd.org',
      email: 'media@nchrd.org',
      founded: '2007',
      members: 'N/A',
      services: ['Documentation', 'Advocacy', 'Emergency Assistance'],
      verified: true
    },
    {
      name: 'Independent Chinese PEN Center',
      community: 'Chinese Dissidents',
      country: 'United States',
      city: 'Various',
      description: 'Advocates for freedom of expression and supports imprisoned Chinese writers.',
      website: 'https://www.penchinese.com',
      email: 'info@penchinese.com',
      founded: '2001',
      members: '200+',
      services: ['Advocacy', 'Literary Support', 'Documentation'],
      verified: true
    },
    
    // Taiwanese Organizations
    {
      name: 'Formosan Association for Public Affairs',
      community: 'Taiwanese',
      country: 'United States',
      city: 'Washington, DC',
      description: 'Advocates for Taiwan\'s international participation and self-determination.',
      website: 'https://www.fapa.org',
      email: 'fapa@fapa.org',
      founded: '1982',
      members: '5,000+',
      services: ['Political Advocacy', 'Education', 'Community Engagement'],
      verified: true
    },
    {
      name: 'Taiwanese Canadian Association',
      community: 'Taiwanese',
      country: 'Canada',
      city: 'Toronto',
      description: 'Promotes Taiwanese culture and advocates for Taiwan in Canada.',
      website: 'https://taiwanesecanadian.org',
      email: 'info@taiwanesecanadian.org',
      founded: '1990',
      members: '4,000+',
      services: ['Cultural Events', 'Advocacy', 'Community Support'],
      verified: true
    },
    {
      name: 'Taiwanese Association of Australia',
      community: 'Taiwanese',
      country: 'Australia',
      city: 'Sydney',
      description: 'Serves Taiwanese community in Australia with cultural and social programs.',
      website: 'https://taiwaneseaustralia.org',
      email: 'contact@taiwaneseaustralia.org',
      founded: '1995',
      members: '3,500+',
      services: ['Cultural Preservation', 'Community Events', 'Advocacy'],
      verified: true
    }
  ];

  const communities = ['all', 'Uyghur', 'Hong Kong', 'Tibetan', 'Chinese Dissidents', 'Taiwanese'];
  const countries = ['all', ...new Set(organizations.map(o => o.country))].sort();

  const filteredOrgs = useMemo(() => {
    return organizations.filter(org => {
      const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           org.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           org.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCommunity = communityFilter === 'all' || org.community === communityFilter;
      const matchesCountry = countryFilter === 'all' || org.country === countryFilter;
      return matchesSearch && matchesCommunity && matchesCountry;
    });
  }, [searchTerm, communityFilter, countryFilter]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-purple-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Diaspora Directory</h2>
          <p className="text-slate-400 text-sm">Find local organizations supporting your community</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-purple-400 mb-1">{organizations.length}</div>
          <div className="text-sm text-slate-400">Organizations</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-blue-400 mb-1">{countries.length - 1}</div>
          <div className="text-sm text-slate-400">Countries</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-green-400 mb-1">{communities.length - 1}</div>
          <div className="text-sm text-slate-400">Communities</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-yellow-400 mb-1">50K+</div>
          <div className="text-sm text-slate-400">Total Members</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, city, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={communityFilter}
            onChange={(e) => setCommunityFilter(e.target.value)}
            className="px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            {communities.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'All Communities' : c}</option>
            ))}
          </select>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            {countries.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'All Countries' : c}</option>
            ))}
          </select>

          <div className="text-slate-400 flex items-center gap-2 ml-auto">
            <span className="text-sm">Showing {filteredOrgs.length} organizations</span>
          </div>
        </div>
      </div>

      {/* Organization Cards */}
      <div className="space-y-4">
        {filteredOrgs.map((org, index) => (
          <div key={index} className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-5 hover:border-purple-500/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white">{org.name}</h3>
                  {org.verified && (
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {org.city}, {org.country}
                  </span>
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                    {org.community}
                  </span>
                </div>
              </div>
              <div className="text-right text-sm text-slate-400">
                <div>Founded {org.founded}</div>
                <div className="text-purple-400 font-medium">{org.members} members</div>
              </div>
            </div>

            <p className="text-slate-300 text-sm mb-4">{org.description}</p>

            <div className="mb-4">
              <div className="text-sm font-medium text-slate-300 mb-2">Services Offered:</div>
              <div className="flex flex-wrap gap-2">
                {org.services.map(service => (
                  <span key={service} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-700/50">
              {org.website && (
                <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
                  <Globe className="w-4 h-4" />
                  Website
                </a>
              )}
              {org.email && (
                <a href={`mailto:${org.email}`} className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
                  <Mail className="w-4 h-4" />
                  {org.email}
                </a>
              )}
              {org.phone && (
                <a href={`tel:${org.phone}`} className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
                  <Phone className="w-4 h-4" />
                  {org.phone}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrgs.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No organizations match your search criteria</p>
        </div>
      )}

      {/* Add Organization Notice */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h3 className="text-blue-400 font-bold mb-2">Add Your Organization</h3>
        <p className="text-slate-300 text-sm mb-3">
          If your diaspora organization is not listed, please contact us to be added to this directory.
        </p>
        <a href="mailto:contact@resistance-hub.org" className="text-blue-400 hover:text-blue-300 text-sm underline">
          contact@resistance-hub.org
        </a>
      </div>
    </div>
  );
};

export default DiasporaDirectory;
