import React, { useState, useMemo } from 'react';
import IPACMembers from '../components/IPACMembers';
import { Users, Search, ExternalLink, Globe, MapPin, Calendar, CheckCircle, Filter } from 'lucide-react';

// Comprehensive organization database
const organizations = [
  {
    id: "uhrp",
    name: "Uyghur Human Rights Project",
    acronym: "UHRP",
    category: "Uyghur Rights",
    region: "Global",
    headquarters: "Washington, D.C., USA",
    website: "https://uhrp.org/",
    description: "Research-based advocacy organization promoting the rights of Uyghurs and other Turkic peoples in East Turkistan through documentation and international advocacy.",
    focus: ["Research", "Advocacy", "Documentation"],
    verified: true,
    established: 2004
  },
  {
    id: "wuc",
    name: "World Uyghur Congress",
    acronym: "WUC",
    category: "Uyghur Rights",
    region: "Global",
    headquarters: "Munich, Germany",
    website: "https://www.uyghurcongress.org/",
    description: "International organization representing the collective interests of the Uyghur people, advocating for their human rights and self-determination.",
    focus: ["Political Advocacy", "International Relations", "Community Support"],
    verified: true,
    established: 2004
  },
  {
    id: "ict",
    name: "International Campaign for Tibet",
    acronym: "ICT",
    category: "Tibetan Rights",
    region: "Global",
    headquarters: "Washington, D.C., USA",
    website: "https://savetibet.org/",
    description: "Non-profit advocacy group promoting human rights, democratic freedoms and self-determination for Tibetans, inspired by the vision of His Holiness the Dalai Lama.",
    focus: ["Policy Advocacy", "Human Rights", "Cultural Preservation"],
    verified: true,
    established: 1988
  },
  {
    id: "freetibet",
    name: "Free Tibet",
    acronym: null,
    category: "Tibetan Rights",
    region: "Global",
    headquarters: "London, UK",
    website: "https://freetibet.org/",
    description: "Campaign organization standing with Tibetans worldwide for their homeland, future, and against China's occupation.",
    focus: ["Campaigns", "Activism", "Awareness"],
    verified: true,
    established: 1987
  },
  {
    id: "sft",
    name: "Students for a Free Tibet",
    acronym: "SFT",
    category: "Tibetan Rights",
    region: "Global",
    headquarters: "New York, USA",
    website: "https://studentsforafreetibet.org/",
    description: "Grassroots network of students and activists working for Tibetan independence through education, advocacy, and nonviolent direct action.",
    focus: ["Youth Activism", "Education", "Direct Action"],
    verified: true,
    established: 1994
  },
  {
    id: "hkwatch",
    name: "Hong Kong Watch",
    acronym: null,
    category: "Hong Kong Democracy",
    region: "Global",
    headquarters: "London, UK",
    website: "https://www.hongkongwatch.org/",
    description: "UK-registered charity promoting human rights, freedoms and rule of law in Hong Kong through research, advocacy, and international engagement.",
    focus: ["Research", "Advocacy", "Policy"],
    verified: true,
    established: 2017
  },
  {
    id: "swhk",
    name: "Stand with Hong Kong",
    acronym: "SWHK",
    category: "Hong Kong Democracy",
    region: "Global",
    headquarters: "International",
    website: "https://standwithhk.org/",
    description: "Independent grassroots political organization dedicated to fighting for freedom of Hong Kong, co-founded during the 2019-20 protests.",
    focus: ["Grassroots Activism", "International Advocacy", "Protests"],
    verified: true,
    established: 2019
  },
  {
    id: "hrw",
    name: "Human Rights Watch",
    acronym: "HRW",
    category: "Human Rights",
    region: "Global",
    headquarters: "New York, USA",
    website: "https://www.hrw.org/asia/china-and-tibet",
    description: "International NGO conducting research and advocacy on human rights worldwide, with extensive documentation of CCP abuses in China, Tibet, and Xinjiang.",
    focus: ["Research", "Documentation", "Advocacy"],
    verified: true,
    established: 1978
  },
  {
    id: "amnesty",
    name: "Amnesty International",
    acronym: "AI",
    category: "Human Rights",
    region: "Global",
    headquarters: "London, UK",
    website: "https://www.amnesty.org/en/location/asia-and-the-pacific/east-asia/china/",
    description: "Global movement of people fighting injustice and promoting human rights, with extensive campaigns on China's human rights violations.",
    focus: ["Campaigns", "Research", "Urgent Actions"],
    verified: true,
    established: 1961
  },
  {
    id: "hrf",
    name: "Human Rights Foundation",
    acronym: "HRF",
    category: "Human Rights",
    region: "Global",
    headquarters: "New York, USA",
    website: "https://hrf.org/program/chinese-communist-party-disruption-initiative/",
    description: "Nonprofit promoting and protecting human rights globally, with a dedicated CCP Disruption Initiative to increase awareness about CCP attacks on civil liberties.",
    focus: ["CCP Disruption", "Advocacy", "Technology"],
    verified: true,
    established: 2005
  },
  {
    id: "cecc",
    name: "Congressional-Executive Commission on China",
    acronym: "CECC",
    category: "Government",
    region: "USA",
    headquarters: "Washington, D.C., USA",
    website: "https://www.cecc.gov/",
    description: "US government commission monitoring human rights and rule of law in China, maintaining a database of over 10,000 political prisoners.",
    focus: ["Policy", "Research", "Political Prisoner Database"],
    verified: true,
    established: 2000
  },
  {
    id: "safeguard",
    name: "Safeguard Defenders",
    acronym: null,
    category: "Human Rights",
    region: "Global",
    headquarters: "Madrid, Spain",
    website: "https://safeguarddefenders.com/",
    description: "Human rights NGO documenting CCP transnational repression, including overseas police stations and forced repatriations.",
    focus: ["Transnational Repression", "Documentation", "Legal Support"],
    verified: true,
    established: 2016
  },
  {
    id: "chrd",
    name: "Chinese Human Rights Defenders",
    acronym: "CHRD",
    category: "Human Rights",
    region: "Global",
    headquarters: "Washington, D.C., USA",
    website: "https://www.nchrd.org/",
    description: "Network promoting human rights and empowering grassroots activism in China through documentation, research, and advocacy.",
    focus: ["Documentation", "Advocacy", "Support for Defenders"],
    verified: true,
    established: 2005
  },
  {
    id: "duihua",
    name: "Dui Hua Foundation",
    acronym: null,
    category: "Human Rights",
    region: "Global",
    headquarters: "San Francisco, USA",
    website: "https://duihua.org/",
    description: "Organization working to advance human rights through dialogue, maintaining a database of over 50,000 political prisoner records since 1980.",
    focus: ["Prisoner Database", "Dialogue", "Humanitarian Release"],
    verified: true,
    established: 1999
  },
  {
    id: "endfl",
    name: "Coalition to End Forced Labour in the Uyghur Region",
    acronym: "CEFL",
    category: "Uyghur Rights",
    region: "Global",
    headquarters: "International",
    website: "https://enduyghurforcedlabour.org/",
    description: "Coalition of civil society organizations and trade unions working to end state-imposed forced labour in global supply chains connected to Xinjiang.",
    focus: ["Corporate Accountability", "Supply Chains", "Forced Labor"],
    verified: true,
    established: 2020
  },
  {
    id: "aspi",
    name: "Australian Strategic Policy Institute",
    acronym: "ASPI",
    category: "Research",
    region: "Australia",
    headquarters: "Canberra, Australia",
    website: "https://www.aspi.org.au/",
    description: "Independent think tank providing policy-relevant research on strategic and defence issues, with extensive work on Xinjiang detention facilities and CCP influence operations.",
    focus: ["Research", "Policy Analysis", "Xinjiang Documentation"],
    verified: true,
    established: 2001
  },
  {
    id: "csis",
    name: "Center for Strategic and International Studies",
    acronym: "CSIS",
    category: "Research",
    region: "USA",
    headquarters: "Washington, D.C., USA",
    website: "https://www.csis.org/programs/china-power-project",
    description: "Bipartisan policy research organization with China Power Project tracking PLA capabilities and regional security threats.",
    focus: ["Policy Research", "China Analysis", "Security"],
    verified: true,
    established: 1962
  },
  {
    id: "freedomhouse",
    name: "Freedom House",
    acronym: null,
    category: "Human Rights",
    region: "Global",
    headquarters: "Washington, D.C., USA",
    website: "https://freedomhouse.org/country/china",
    description: "Independent watchdog organization dedicated to expanding freedom and democracy, rating China as 'Not Free' and documenting CCP repression.",
    focus: ["Freedom Ratings", "Research", "Advocacy"],
    verified: true,
    established: 1941
  },
  {
    id: "rsf",
    name: "Reporters Without Borders",
    acronym: "RSF",
    category: "Press Freedom",
    region: "Global",
    headquarters: "Paris, France",
    website: "https://rsf.org/en/country/china",
    description: "International NGO defending press freedom worldwide, ranking China as one of the world's worst jailers of journalists.",
    focus: ["Press Freedom", "Journalist Safety", "Advocacy"],
    verified: true,
    established: 1985
  },
  {
    id: "cpj",
    name: "Committee to Protect Journalists",
    acronym: "CPJ",
    category: "Press Freedom",
    region: "Global",
    headquarters: "New York, USA",
    website: "https://cpj.org/asia/china/",
    description: "Independent nonprofit promoting press freedom worldwide by defending journalists' rights, documenting attacks, and advocating for imprisoned journalists in China.",
    focus: ["Journalist Protection", "Documentation", "Advocacy"],
    verified: true,
    established: 1981
  },
  {
    id: "ned",
    name: "National Endowment for Democracy",
    acronym: "NED",
    category: "Democracy",
    region: "Global",
    headquarters: "Washington, D.C., USA",
    website: "https://www.ned.org/",
    description: "Private nonprofit foundation dedicated to the growth and strengthening of democratic institutions around the world, supporting civil society in authoritarian countries.",
    focus: ["Democracy Support", "Civil Society", "Grants"],
    verified: true,
    established: 1983
  },
  {
    id: "taiwanfdn",
    name: "Taiwan Foundation for Democracy",
    acronym: "TFD",
    category: "Democracy",
    region: "Taiwan",
    headquarters: "Taipei, Taiwan",
    website: "https://www.tfd.org.tw/",
    description: "Foundation promoting democracy and human rights in Taiwan and globally, supporting civil society and democratic governance.",
    focus: ["Democracy Promotion", "Human Rights", "Research"],
    verified: true,
    established: 2003
  },
  {
    id: "pen",
    name: "PEN International",
    acronym: null,
    category: "Press Freedom",
    region: "Global",
    headquarters: "London, UK",
    website: "https://www.pen-international.org/",
    description: "Worldwide association of writers promoting literature and defending freedom of expression, campaigning for imprisoned Chinese writers and journalists.",
    focus: ["Writers", "Press Freedom", "Prisoner Campaigns"],
    verified: true,
    established: 1921
  },
  {
    id: "xinjiangvictims",
    name: "Xinjiang Victims Database",
    acronym: null,
    category: "Uyghur Rights",
    region: "Global",
    headquarters: "International",
    website: "https://shahit.biz/",
    description: "Comprehensive database documenting over 35,000 Uyghur detainees with testimonies, photos, and evidence of mass detention in Xinjiang.",
    focus: ["Documentation", "Database", "Evidence"],
    verified: true,
    established: 2018
  }
];

// Get unique categories
const categories = [...new Set(organizations.map(org => org.category))].sort();

const ResistanceDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOrg, setSelectedOrg] = useState(null);

  // Filter organizations
  const filteredOrgs = useMemo(() => {
    return organizations.filter(org => {
      const matchesSearch = !searchQuery || 
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (org.acronym && org.acronym.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || org.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Category colors
  const getCategoryColor = (category) => {
    const colors = {
      'Uyghur Rights': 'bg-blue-900/50 text-blue-300 border-blue-700',
      'Tibetan Rights': 'bg-orange-900/50 text-orange-300 border-orange-700',
      'Hong Kong Democracy': 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
      'Human Rights': 'bg-green-900/50 text-green-300 border-green-700',
      'Press Freedom': 'bg-purple-900/50 text-purple-300 border-purple-700',
      'Research': 'bg-cyan-900/50 text-cyan-300 border-cyan-700',
      'Democracy': 'bg-pink-900/50 text-pink-300 border-pink-700',
      'Government': 'bg-red-900/50 text-red-300 border-red-700',
    };
    return colors[category] || 'bg-slate-700 text-slate-300 border-slate-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Users className="w-10 h-10" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">Resistance Directory</h1>
              <p className="text-blue-100">
                Global database of verified organizations fighting CCP authoritarianism
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1">
            <span className="text-2xl font-bold">{organizations.length}</span>
            <span className="text-sm text-blue-200">Verified Organizations</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{categories.length}</div>
          <div className="text-xs text-slate-400">Categories</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{organizations.filter(o => o.region === 'Global').length}</div>
          <div className="text-xs text-slate-400">Global Reach</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{organizations.filter(o => o.verified).length}</div>
          <div className="text-xs text-slate-400">Verified</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">50+</div>
          <div className="text-xs text-slate-400">Years Combined</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          All ({organizations.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat} ({organizations.filter(o => o.category === cat).length})
          </button>
        ))}
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredOrgs.map(org => (
          <div
            key={org.id}
            onClick={() => setSelectedOrg(selectedOrg?.id === org.id ? null : org)}
            className={`bg-slate-800 border rounded-lg p-4 cursor-pointer transition-all hover:border-blue-500 ${
              selectedOrg?.id === org.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{org.name}</h3>
                  {org.verified && (
                    <CheckCircle className="w-4 h-4 text-green-400" title="Verified Organization" />
                  )}
                </div>
                {org.acronym && (
                  <span className="text-sm text-slate-400">({org.acronym})</span>
                )}
              </div>
              <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getCategoryColor(org.category)}`}>
                {org.category}
              </span>
            </div>

            <p className="text-sm text-slate-400 mb-3 line-clamp-2">{org.description}</p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {org.headquarters}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Est. {org.established}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {org.region}
              </span>
            </div>

            {/* Expanded Details */}
            {selectedOrg?.id === org.id && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Focus Areas</h4>
                  <div className="flex flex-wrap gap-1">
                    {org.focus.map(f => (
                      <span key={f} className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Website
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredOrgs.length === 0 && (
        <div className="text-center py-12 bg-slate-800 border border-slate-700 rounded-lg">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No organizations found matching your criteria</p>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
        <p className="text-slate-400 text-sm">
          Showing {filteredOrgs.length} of {organizations.length} verified organizations
        </p>
        <p className="text-slate-500 text-xs mt-1">
          All organizations are independently verified • Click an organization to view details
        </p>
      </div>

      {/* IPAC Members */}
      <div className="mt-8">
        <IPACMembers />
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
        <p className="text-yellow-300 text-sm">
          <strong>Note:</strong> This directory is for informational purposes. Always verify organizations independently before sharing sensitive information or making donations.
        </p>
      </div>
    </div>
  );
};

export default ResistanceDirectory;
