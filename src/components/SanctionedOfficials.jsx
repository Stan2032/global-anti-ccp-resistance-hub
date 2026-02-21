import { useState, useMemo } from 'react';
import { ExternalLink, Target, Megaphone } from 'lucide-react';
import { SourcesList } from './ui/SourceAttribution';
import researchData from '../data/sanctioned_officials_research.json';

const AREA_TO_CATEGORY = {
  'Xinjiang': 'xinjiang',
  'Hong Kong': 'hongkong',
  'Tibet': 'tibet',
  'General': 'central',
};

const SANCTION_FIELDS = [
  { field: 'us_sanctions', label: 'US' },
  { field: 'uk_sanctions', label: 'UK' },
  { field: 'eu_sanctions', label: 'EU' },
  { field: 'canada_sanctions', label: 'Canada' },
  { field: 'australia_sanctions', label: 'Australia' },
];

const CHINESE_NAMES = {
  'Chen Quanguo': '陈全国',
  'Zhu Hailun': '朱海仑',
  'Wang Junzheng': '王君正',
  'Chen Mingguo': '陈明国',
  'Wang Mingshan': '王明山',
  'Carrie Lam': '林郑月娥',
  'Chris Tang': '邓炳强',
  'John Lee': '李家超',
  'Teresa Cheng': '郑若骅',
  'Erick Tsang': '曾国卫',
  'Xia Baolong': '夏宝龙',
  'Luo Huining': '骆惠宁',
  'Wu Yingjie': '吴英杰',
  'Zheng Yanxiong': '郑雁雄',
  'Wang Yi': '王毅',
  'Zhao Kezhi': '赵克志',
  'Guo Shengkun': '郭声琨',
  'Liu Jianchao': '刘建超',
  'Pema Thinley': '白玛赤林',
};

const HARDCODED_ENTITIES = [
  {
    name: 'Hikvision Executives',
    chinese: '海康威视',
    position: 'Surveillance Technology Company',
    category: 'tech',
    sanctionedBy: ['US'],
    sanctionDates: { US: 'October 2019' },
    reason: 'Providing surveillance technology used in Xinjiang detention camps.',
    currentStatus: 'ENTITY LIST',
    details: 'World\'s largest surveillance camera manufacturer. Equipment used in camps.',
    sourceUrl: 'https://www.federalregister.gov/documents/2019/10/09/2019-22210/addition-of-certain-entities-to-the-entity-list',
  },
  {
    name: 'SenseTime Executives',
    chinese: '商汤科技',
    position: 'AI/Facial Recognition Company',
    category: 'tech',
    sanctionedBy: ['US'],
    sanctionDates: { US: 'December 2021' },
    reason: 'Developing facial recognition technology used to surveil Uyghurs.',
    currentStatus: 'ENTITY LIST',
    details: 'AI company whose technology enables ethnic profiling in Xinjiang.',
    sourceUrl: 'https://home.treasury.gov/news/press-releases/jy0538',
  },
];

function parseSanctionValue(value) {
  if (!value || value === 'No') return null;
  const match = value.match(/^Yes\s*-\s*(.+)$/i);
  return match ? match[1].trim() : 'Yes';
}

function inferSourceType(url) {
  if (!url) return 'Government';
  try {
    const hostname = new URL(url).hostname;
    if (hostname.endsWith('.treasury.gov') || hostname === 'home.treasury.gov'
      || hostname.endsWith('.gov.uk') || hostname.endsWith('.europa.eu')
      || hostname.endsWith('.federalregister.gov'))
      return 'Government';
    if (hostname === 'www.opensanctions.org' || hostname === 'opensanctions.org'
      || hostname === 'safeguarddefenders.com' || hostname === 'www.safeguarddefenders.com')
      return 'NGO Report';
    if (hostname === 'bitterwinter.org' || hostname === 'www.bitterwinter.org')
      return 'News Report';
  } catch {
    // Invalid URL — fall through to default
  }
  return 'Government';
}

function transformResearchEntry(entry) {
  const { output } = entry;
  const sanctionedBy = [];
  const sanctionDates = {};

  for (const { field, label } of SANCTION_FIELDS) {
    const date = parseSanctionValue(output[field]);
    if (date) {
      sanctionedBy.push(label);
      sanctionDates[label] = date;
    }
  }

  return {
    name: output.name,
    chinese: CHINESE_NAMES[output.name] || '',
    position: output.position,
    category: AREA_TO_CATEGORY[output.responsibility_area] || 'central',
    sanctionedBy,
    sanctionDates,
    reason: output.key_abuses,
    currentStatus: output.current_status,
    details: null,
    sourceUrl: output.source_url,
  };
}

const SanctionedOfficials = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const officials = useMemo(() => {
    const fromResearch = researchData.results
      .filter((entry) => !entry.error || entry.error === '')
      .map(transformResearchEntry);
    return [...fromResearch, ...HARDCODED_ENTITIES];
  }, []);

  const categories = useMemo(() => [
    { id: 'all', name: 'All Officials', count: officials.length },
    { id: 'xinjiang', name: 'Xinjiang', count: officials.filter(o => o.category === 'xinjiang').length },
    { id: 'hongkong', name: 'Hong Kong', count: officials.filter(o => o.category === 'hongkong').length },
    { id: 'central', name: 'Central Govt', count: officials.filter(o => o.category === 'central').length },
    { id: 'tibet', name: 'Tibet', count: officials.filter(o => o.category === 'tibet').length },
    { id: 'tech', name: 'Tech/Surveillance', count: officials.filter(o => o.category === 'tech').length },
  ], [officials]);

  const filteredOfficials = useMemo(() => officials.filter(official => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      official.name.toLowerCase().includes(query) ||
      (official.chinese && official.chinese.includes(searchQuery)) ||
      official.position.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === 'all' || official.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }), [officials, searchQuery, selectedCategory]);

  const allSources = useMemo(() => {
    const seen = new Set();
    return officials
      .filter((o) => o.sourceUrl)
      .reduce((acc, o) => {
        if (!seen.has(o.sourceUrl)) {
          seen.add(o.sourceUrl);
          acc.push({
            name: `${o.name} — Sanctions Record`,
            url: o.sourceUrl,
            type: inferSourceType(o.sourceUrl),
            verified: true,
            description: `Source documentation for sanctions and human rights record of ${o.name}.`,
          });
        }
        return acc;
      }, []);
  }, [officials]);

  const getFlagEmoji = (country) => {
    const flags = { 'US': '🇺🇸', 'UK': '🇬🇧', 'EU': '🇪🇺', 'Canada': '🇨🇦', 'Australia': '🇦🇺' };
    return flags[country] || country;
  };

  const getStatusBadge = (official) => {
    if (official.currentStatus === 'ENTITY LIST') {
      return { label: 'ENTITY LIST', className: 'bg-orange-600 text-white' };
    }
    if (official.sanctionedBy.length === 0) {
      return { label: 'NOT SANCTIONED', className: 'bg-[#1c2a35] text-slate-200' };
    }
    return { label: official.currentStatus || 'SANCTIONED', className: 'bg-red-600 text-white' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-red-500 p-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Target className="w-6 h-6 text-red-400" /> Sanctioned CCP Officials</h2>
        <p className="text-slate-300">
          {officials.length} officials and entities tracked for human rights abuses — sourced from government sanctions databases.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇺🇸</span>
            <span className="text-slate-300">US Global Magnitsky Act</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇬🇧</span>
            <span className="text-slate-300">UK Magnitsky Sanctions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇪🇺</span>
            <span className="text-slate-300">EU Human Rights Sanctions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇨🇦</span>
            <span className="text-slate-300">Canada Magnitsky Act</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇦🇺</span>
            <span className="text-slate-300">Australia Sanctions</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          aria-label="Search"
          type="text"
          placeholder="Search by name, position, or Chinese characters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#111820] border border-[#1c2a35] px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-red-600 text-white'
                : 'bg-[#111820] text-slate-300 hover:bg-[#111820]'
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* Officials Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredOfficials.map((official, index) => {
          const badge = getStatusBadge(official);
          return (
            <div key={index} className="bg-[#111820] border border-[#1c2a35] p-4 hover:border-red-500/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-white text-lg">{official.name}</h3>
                  {official.chinese && <p className="text-red-400">{official.chinese}</p>}
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge.className}`}>
                  {badge.label}
                </span>
              </div>

              <p className="text-sm text-slate-400 mb-2">{official.position}</p>

              <p className="text-sm text-slate-300 mb-3">{official.reason}</p>

              {/* Sanctioned By */}
              {official.sanctionedBy.length > 0 ? (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-slate-500">Sanctioned by:</span>
                  <div className="flex gap-1">
                    {official.sanctionedBy.map((country, i) => (
                      <span key={i} className="text-lg" title={`${country} — ${official.sanctionDates[country] || ''}`}>
                        {getFlagEmoji(country)}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-yellow-500">No international sanctions yet — advocacy needed</span>
                </div>
              )}

              {/* Details */}
              <div className="bg-[#0a0e14]/50 rounded p-2 text-xs text-slate-400">
                {official.details && (
                  <p className="mb-1"><strong className="text-slate-300">Details:</strong> {official.details}</p>
                )}
                {official.sanctionedBy.length > 0 && (
                  <p className="mb-1">
                    <strong className="text-slate-300">Sanction Dates:</strong>{' '}
                    {official.sanctionedBy.map((c) => `${getFlagEmoji(c)} ${official.sanctionDates[c]}`).join('  ·  ')}
                  </p>
                )}
                {official.currentStatus && official.currentStatus !== 'ENTITY LIST' && (
                  <p><strong className="text-slate-300">Current Status:</strong> {official.currentStatus}</p>
                )}
              </div>

              {/* Source Link */}
              {official.sourceUrl && (
                <a
                  href={official.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View Source</span>
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Sources List */}
      <div className="bg-[#111820] border border-[#1c2a35] p-4">
        <SourcesList
          sources={allSources}
          title="Sanctions Data Sources"
          compact={false}
        />
      </div>

      {/* Call to Action */}
      <div className="bg-[#111820] border border-[#1c2a35] p-4">
        <h3 className="font-semibold text-white mb-2 flex items-center gap-2"><Megaphone className="w-5 h-5 text-red-400" /> Advocate for More Sanctions</h3>
        <p className="text-sm text-slate-300 mb-3">
          Many CCP officials responsible for human rights abuses remain unsanctioned. Contact your representatives to demand action.
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://www.cecc.gov/resources/executive-branch-tools-to-address-human-rights-abuses-in-china"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            CECC Sanctions Resources →
          </a>
          <a
            href="https://home.treasury.gov/policy-issues/financial-sanctions/specially-designated-nationals-and-blocked-persons-list-sdn-human-readable-lists"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#111820] hover:bg-[#1c2a35] text-white px-4 py-2 rounded text-sm transition-colors"
          >
            US Treasury SDN List →
          </a>
        </div>
      </div>
    </div>
  );
};

export default SanctionedOfficials;
