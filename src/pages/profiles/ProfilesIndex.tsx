/**
 * ProfilesIndex — Index page listing all individual profiles of people
 * targeted by the CCP. Provides search, filtering, and navigation to
 * detailed profile pages.
 *
 * @module ProfilesIndex
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Clock, Scale, AlertTriangle, ExternalLink,
  ArrowRight, Heart, MapPin, Calendar, Filter
} from 'lucide-react';

const PROFILES = [
  {
    name: 'Jimmy Lai',
    chineseName: '黎智英',
    path: '/profiles/jimmy-lai',
    status: 'IMPRISONED',
    statusColor: 'red',
    sentence: '20 years',
    birthDate: 'December 8, 1947',
    role: 'Media Entrepreneur & Publisher',
    summary: 'Founder of Apple Daily newspaper. Arrested under the National Security Law for his pro-democracy journalism.',
    location: 'Stanley Prison, Hong Kong',
    region: 'hong-kong',
    themeGradient: '',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-red-500',
    themeAccent: 'text-red-400',
    built: true,
  },
  {
    name: 'Ilham Tohti',
    chineseName: '伊力哈木·土赫提',
    path: '/profiles/ilham-tohti',
    status: 'IMPRISONED',
    statusColor: 'red',
    sentence: 'Life imprisonment',
    birthDate: 'October 25, 1969',
    role: 'Uyghur Economist & Professor',
    summary: 'Advocate for Han-Uyghur dialogue, sentenced to life for "separatism" despite promoting ethnic harmony.',
    location: 'Urumqi Prison, Xinjiang',
    region: 'uyghur-tibet',
    themeGradient: '',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-cyan-500',
    themeAccent: 'text-cyan-400',
    built: true,
  },
  {
    name: 'Gedhun Choekyi Nyima',
    chineseName: '根敦确吉尼玛',
    path: '/profiles/panchen-lama',
    status: 'DISAPPEARED',
    statusColor: 'cyan',
    sentence: '30 years missing',
    birthDate: 'April 25, 1989',
    role: '11th Panchen Lama',
    summary: 'Second-highest Tibetan Buddhist leader. Abducted by the CCP at age 6, the world\'s youngest political prisoner.',
    location: 'Unknown — enforced disappearance since 1995',
    region: 'uyghur-tibet',
    themeGradient: '',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-[#22d3ee]',
    themeAccent: 'text-[#22d3ee]',
    built: true,
  },
  {
    name: 'Liu Xiaobo',
    chineseName: '刘晓波',
    path: '/profiles/liu-xiaobo',
    status: 'DECEASED',
    statusColor: 'gray',
    sentence: 'Died in custody (2017)',
    birthDate: 'December 28, 1955',
    deathDate: 'July 13, 2017',
    role: 'Nobel Peace Prize Laureate',
    summary: 'Author of Charter 08. First Nobel laureate to die in state custody since Carl von Ossietzky in 1938.',
    location: 'Died in custody — July 13, 2017',
    region: 'mainland',
    themeGradient: '',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-yellow-500',
    themeAccent: 'text-yellow-400',
    built: true,
  },
  {
    name: 'Joshua Wong',
    chineseName: '黃之鋒',
    path: '/profiles/joshua-wong',
    status: 'IMPRISONED',
    statusColor: 'red',
    sentence: '4y 8m + faces life',
    birthDate: 'October 13, 1996',
    role: 'Pro-Democracy Activist',
    summary: 'Founded Scholarism at 14. Sentenced in the Hong Kong 47 case, now facing life on new NSL charge.',
    location: 'Prison, Hong Kong',
    region: 'hong-kong',
    themeGradient: '',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-yellow-500',
    themeAccent: 'text-yellow-400',
    built: true,
  },
  {
    name: 'Gui Minhai',
    chineseName: '桂民海',
    path: '/profiles/gui-minhai',
    status: 'IMPRISONED',
    statusColor: 'red',
    sentence: '10 years (ends Feb 2030)',
    birthDate: 'May 5, 1964',
    role: 'Publisher & Swedish Citizen',
    summary: 'Abducted from Thailand in 2015 for publishing books critical of CCP leaders. Swedish citizenship revoked under duress.',
    location: 'Unknown prison, China',
    region: 'cross-border',
    themeGradient: '',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-[#22d3ee]',
    themeAccent: 'text-[#22d3ee]',
    built: true,
  },
  {
    name: 'Zhang Zhan',
    chineseName: '张展',
    path: '/profiles/zhang-zhan',
    status: 'IMPRISONED',
    statusColor: 'red',
    sentence: '4 years (second sentence)',
    birthDate: 'September 1, 1983',
    role: 'Citizen Journalist',
    summary: 'Jailed for reporting on COVID-19 outbreak in Wuhan. Sentenced again in 2025 after initial release.',
    location: 'Prison, China',
    region: 'mainland',
    themeGradient: '',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-slate-500',
    themeAccent: 'text-slate-400',
    built: true,
  },
  {
    name: 'Gao Zhisheng',
    chineseName: '高智晟',
    path: '/profiles/gao-zhisheng',
    status: 'DISAPPEARED',
    statusColor: 'cyan',
    sentence: 'Disappeared since Aug 2017',
    birthDate: 'April 20, 1966',
    role: 'Human Rights Lawyer',
    summary: 'Named top 10 lawyer by Ministry of Justice in 2001, then convicted for defending Falun Gong practitioners. Disappeared August 2017.',
    location: 'Unknown',
    region: 'mainland',
    themeGradient: '',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-[#22d3ee]',
    themeAccent: 'text-[#22d3ee]',
    built: true,
  },
  {
    name: 'Nathan Law',
    chineseName: '羅冠聰',
    path: '/profiles/nathan-law',
    status: 'EXILED',
    statusColor: 'yellow',
    sentence: 'Wanted under NSL; HK$1M bounty',
    birthDate: 'July 13, 1993',
    role: 'Pro-Democracy Activist, Former Legislator',
    summary: 'Co-founder of Demosistō and youngest legislator in Hong Kong history. Fled to London after the National Security Law was imposed. HK$1 million bounty offered for his arrest.',
    location: 'London, UK (exile)',
    region: 'hong-kong',
    themeGradient: 'from-yellow-900/30 to-[#0a0e14]',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-yellow-500',
    themeAccent: 'text-yellow-400',
    built: true,
  },
  {
    name: 'Cardinal Joseph Zen',
    chineseName: '陳日君',
    path: '/profiles/cardinal-zen',
    status: 'AT RISK',
    statusColor: 'yellow',
    sentence: 'Fined HK$4,000 (Nov 2022)',
    birthDate: 'January 13, 1932',
    role: 'Bishop Emeritus of Hong Kong, Cardinal',
    summary: 'Arrested at age 90 under the NSL alongside 612 Fund trustees. Convicted under the Societies Ordinance. NSL charge remains under review.',
    location: 'Hong Kong',
    region: 'hong-kong',
    themeGradient: 'from-amber-900/30 to-[#0a0e14]',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-amber-500',
    themeAccent: 'text-amber-400',
    built: true,
  },
  {
    name: 'Benny Tai',
    chineseName: '戴耀廷',
    path: '/profiles/benny-tai',
    status: 'IMPRISONED',
    statusColor: 'red',
    sentence: '10 years (HK47 — longest)',
    birthDate: '1964',
    role: 'Law Professor & Democracy Advocate',
    summary: 'Associate Professor at HKU for 30 years. Organized pro-democracy primary elections. Received the longest sentence in the Hong Kong 47 case.',
    location: 'Prison, Hong Kong',
    region: 'hong-kong',
    themeGradient: '',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-red-500',
    themeAccent: 'text-red-400',
    built: true,
  },
  {
    name: 'Agnes Chow',
    chineseName: '周庭',
    path: '/profiles/agnes-chow',
    status: 'EXILED',
    statusColor: 'yellow',
    sentence: 'Released, fled to Canada',
    birthDate: 'December 3, 1996',
    role: 'Pro-Democracy Activist',
    summary: 'Former Demosistō member. Served prison sentence, then fled to Canada in December 2023 rather than comply with NSL bail conditions.',
    location: 'Toronto, Canada (exile)',
    region: 'hong-kong',
    themeGradient: '',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-yellow-500',
    themeAccent: 'text-yellow-400',
    built: true,
  },
  {
    name: 'Tashi Wangchuk',
    chineseName: '扎西文色',
    path: '/profiles/tashi-wangchuk',
    status: 'RELEASED — SURVEILLANCE',
    statusColor: 'yellow',
    sentence: '5 years (served in full)',
    birthDate: '1985',
    role: 'Tibetan Language Rights Advocate',
    summary: 'Imprisoned for 5 years for advocating Tibetan language education through legal channels. Featured in a NYT documentary. Released 2021, under surveillance.',
    location: 'Yushu, Qinghai Province, China',
    region: 'uyghur-tibet',
    themeGradient: '',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-cyan-500',
    themeAccent: 'text-cyan-400',
    built: true,
  },
  {
    name: 'Ren Zhiqiang',
    chineseName: '任志强',
    path: '/profiles/ren-zhiqiang',
    status: 'IMPRISONED',
    statusColor: 'red',
    sentence: '18 years',
    birthDate: 'March 8, 1951',
    role: 'Real Estate Tycoon & Former CCP Member',
    summary: 'CCP insider sentenced to 18 years on corruption charges after publishing an essay criticizing Xi Jinping\'s COVID-19 response.',
    location: 'Prison, China',
    region: 'mainland',
    themeGradient: '',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-red-500',
    themeAccent: 'text-red-400',
    built: true,
  },
  {
    name: 'Xu Zhiyong',
    chineseName: '许志永',
    path: '/profiles/xu-zhiyong',
    status: 'IMPRISONED',
    statusColor: 'red',
    sentence: '14 years',
    birthDate: 'March 2, 1973',
    role: 'Legal Scholar & Civil Rights Advocate',
    summary: 'Founder of the New Citizens Movement. Sentenced to 14 years for "subversion of state power" after peacefully advocating government transparency.',
    location: 'Prison, China',
    region: 'mainland',
    themeGradient: '',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-emerald-500',
    themeAccent: 'text-emerald-400',
    built: true,
  },
];

const REGION_FILTERS = [
  { id: 'all', label: 'All Profiles' },
  { id: 'hong-kong', label: 'Hong Kong' },
  { id: 'mainland', label: 'Mainland China' },
  { id: 'uyghur-tibet', label: 'Uyghur & Tibet' },
  { id: 'cross-border', label: 'Cross-Border' },
];

const statusStyles: Record<string, { badge: string; dot: string }> = {
  red: { badge: 'bg-red-900/50 text-red-300 border-red-700/50', dot: 'bg-red-500' },
  cyan: { badge: 'bg-[#111820]/50 text-[#22d3ee] border-[#1c2a35]', dot: 'bg-[#22d3ee]' },
  gray: { badge: 'bg-gray-800/50 text-slate-300 border-gray-600/50', dot: 'bg-gray-400' },
  yellow: { badge: 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50', dot: 'bg-yellow-500' },
};

const ProfileCard = ({ profile }: { profile: typeof PROFILES[number] }) => {
  const status = statusStyles[profile.statusColor] || statusStyles.red;

  const wrapperProps = profile.built
    ? { to: profile.path, className: 'group block' }
    : { className: 'block opacity-50 cursor-default' };

  const content = (
      <article
        className={`bg-[#0a0e14] border-l-2 ${profile.themeLeftBorder} border ${profile.themeBorder} p-6 transition-all duration-200 ${
          profile.built ? 'hover:border-[#4afa82]/50 hover:shadow-lg hover:shadow-[#4afa82]/10 hover:-translate-y-0.5' : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-[#111820] flex items-center justify-center border ${profile.themeBorder}`}>
              <User className={`w-6 h-6 ${profile.themeAccent}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{profile.name}</h3>
              <p className="text-sm text-slate-400">{profile.chineseName}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${status.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {profile.status}
          </span>
        </div>

        {/* Role */}
        <p className={`text-sm font-medium ${profile.themeAccent} mb-2`}>{profile.role}</p>

        {/* Summary */}
        <p className="text-sm text-slate-300 mb-4 leading-relaxed">{profile.summary}</p>

        {/* Details */}
        <div className="space-y-1.5 text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{profile.sentence}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{profile.location}</span>
          </div>
        </div>

        {/* Footer */}
        {profile.built ? (
          <div className="flex items-center justify-between pt-3 border-t border-[#1c2a35]/50">
            <span className="text-xs text-green-400 font-medium">Full profile available</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#22d3ee] transition-colors" />
          </div>
        ) : (
          <div className="flex items-center justify-between pt-3 border-t border-[#1c2a35]/50">
            <span className="text-xs text-slate-400 font-medium">Profile coming soon</span>
            <Clock className="w-4 h-4 text-slate-600" />
          </div>
        )}
      </article>
  );

  return profile.built ? (
    <Link to={profile.path} className="group block">{content}</Link>
  ) : (
    <div className="block opacity-50 cursor-default">{content}</div>
  );
};

const ProfilesIndex = () => {
  const [activeRegion, setActiveRegion] = useState('all');
  const builtProfiles = PROFILES.filter(p => p.built);
  const upcomingProfiles = PROFILES.filter(p => !p.built);
  const filteredProfiles = activeRegion === 'all'
    ? builtProfiles
    : builtProfiles.filter(p => p.region === activeRegion);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb / Back link to prisoners database */}
      <Link to="/prisoners" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#4afa82] transition-colors mb-6 font-mono">
        <ArrowRight className="w-4 h-4 rotate-180" /> Political Prisoners Database
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Profiles: Targeted by the CCP
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
          Detailed profiles of individuals persecuted by the Chinese Communist Party — journalists, 
          activists, religious leaders, and scholars whose stories must not be forgotten.
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {builtProfiles.length} detailed profiles
          </span>
          <Link to="/prisoners" className="flex items-center gap-1.5 hover:text-[#4afa82] transition-colors">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            63 total cases in database →
          </Link>
        </div>
      </div>

      {/* Region Filter Tabs */}
      <div className="mb-6" role="tablist" aria-label="Filter profiles by region">
        <div className="flex flex-wrap gap-2">
          {REGION_FILTERS.map((filter) => {
            const count = filter.id === 'all'
              ? builtProfiles.length
              : builtProfiles.filter(p => p.region === filter.id).length;
            const isActive = activeRegion === filter.id;
            return (
              <button
                key={filter.id}
                role="tab"
                aria-selected={isActive}
                aria-controls="profiles-grid"
                onClick={() => setActiveRegion(filter.id)}
                className={`px-3 py-1.5 text-sm font-mono transition-colors ${
                  isActive
                    ? 'bg-[#4afa82]/10 text-[#4afa82] border border-[#4afa82]/30'
                    : 'bg-[#111820] text-slate-400 border border-[#1c2a35] hover:text-white hover:border-slate-500'
                }`}
              >
                {filter.label} <span className="text-xs opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Built Profiles */}
      <section className="mb-10" aria-label="Available profiles" id="profiles-grid" role="tabpanel">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProfiles.map((profile) => (
            <ProfileCard key={profile.name} profile={profile} />
          ))}
        </div>
        {filteredProfiles.length === 0 && (
          <p className="text-slate-400 text-center py-8 font-mono">No profiles match this filter.</p>
        )}
      </section>

      {/* Upcoming Profiles */}
      {upcomingProfiles.length > 0 && (
        <section aria-label="Upcoming profiles">
          <h2 className="text-xl font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-500" />
            Coming Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingProfiles.map((profile) => (
              <ProfileCard key={profile.name} profile={profile} />
            ))}
          </div>
        </section>
      )}

      {/* Source Note */}
      <div className="mt-10 p-4 bg-[#111820]/50 border border-[#1c2a35]/50">
        <p className="text-xs text-slate-400">
          All profile information is sourced from Tier 1 outlets (BBC, Reuters, AP, HRW, Amnesty International, 
          CPJ, UN OHCHR) and Tier 2 sources (HKFP, RFA, NCHRD, Safeguard Defenders). No CCP state media sources 
          are used. See individual profiles for full source lists.
        </p>
      </div>
    </div>
  );
};

export default ProfilesIndex;
