import React from 'react';
import { Link } from 'react-router-dom';
import {
  User, Clock, Scale, AlertTriangle, ExternalLink,
  ArrowRight, Heart, MapPin, Calendar
} from 'lucide-react';

const PROFILES = [
  {
    name: 'Jimmy Lai',
    chineseName: '黎智英',
    path: '/profiles/jimmy-lai',
    status: 'IMPRISONED',
    statusColor: 'red',
    sentence: '20 years',
    age: 78,
    role: 'Media Entrepreneur & Publisher',
    summary: 'Founder of Apple Daily newspaper. Arrested under the National Security Law for his pro-democracy journalism.',
    location: 'Stanley Prison, Hong Kong',
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
    age: 56,
    role: 'Uyghur Economist & Professor',
    summary: 'Advocate for Han-Uyghur dialogue, sentenced to life for "separatism" despite promoting ethnic harmony.',
    location: 'Urumqi Prison, Xinjiang',
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
    statusColor: 'purple',
    sentence: '30 years missing',
    age: 36,
    role: '11th Panchen Lama',
    summary: 'Second-highest Tibetan Buddhist leader. Abducted by the CCP at age 6, the world\'s youngest political prisoner.',
    location: 'Unknown — enforced disappearance since 1995',
    themeGradient: '',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-purple-500',
    themeAccent: 'text-purple-400',
    built: true,
  },
  {
    name: 'Liu Xiaobo',
    chineseName: '刘晓波',
    path: '/profiles/liu-xiaobo',
    status: 'DECEASED',
    statusColor: 'gray',
    sentence: 'Died in custody (2017)',
    age: 61,
    role: 'Nobel Peace Prize Laureate',
    summary: 'Author of Charter 08. First Nobel laureate to die in state custody since Carl von Ossietzky in 1938.',
    location: 'Died in custody — July 13, 2017',
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
    age: 29,
    role: 'Pro-Democracy Activist',
    summary: 'Founded Scholarism at 14. Sentenced in the Hong Kong 47 case, now facing life on new NSL charge.',
    location: 'Prison, Hong Kong',
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
    age: 61,
    role: 'Publisher & Swedish Citizen',
    summary: 'Abducted from Thailand in 2015 for publishing books critical of CCP leaders. Swedish citizenship revoked under duress.',
    location: 'Unknown prison, China',
    themeGradient: '',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-teal-500',
    themeAccent: 'text-teal-400',
    built: true,
  },
  {
    name: 'Zhang Zhan',
    chineseName: '张展',
    path: '/profiles/zhang-zhan',
    status: 'IMPRISONED',
    statusColor: 'red',
    sentence: '4 years (second sentence)',
    age: 42,
    role: 'Citizen Journalist',
    summary: 'Jailed for reporting on COVID-19 outbreak in Wuhan. Sentenced again in 2025 after initial release.',
    location: 'Prison, China',
    themeGradient: '',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-slate-500',
    themeAccent: 'text-slate-400',
    built: true,
  },
  {
    name: 'Agnes Chow',
    chineseName: '周庭',
    path: null,
    status: 'EXILED',
    statusColor: 'yellow',
    sentence: 'Released, fled to Canada',
    age: 28,
    role: 'Pro-Democracy Activist',
    summary: 'Former Demosistō (pro-democracy party) member. Released from prison then fled to Canada in December 2023.',
    location: 'Canada (exile)',
    themeGradient: '',
    themeBorder: 'border-[#1c2a35]',
    themeLeftBorder: 'border-l-slate-500',
    themeAccent: 'text-slate-400',
    built: false,
  },
];

const statusStyles = {
  red: { badge: 'bg-red-900/50 text-red-300 border-red-700/50', dot: 'bg-red-500' },
  purple: { badge: 'bg-purple-900/50 text-purple-300 border-purple-700/50', dot: 'bg-purple-500' },
  gray: { badge: 'bg-gray-800/50 text-gray-300 border-gray-600/50', dot: 'bg-gray-400' },
  yellow: { badge: 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50', dot: 'bg-yellow-500' },
};

const ProfileCard = ({ profile }) => {
  const status = statusStyles[profile.statusColor] || statusStyles.red;
  const CardWrapper = profile.built ? Link : 'div';
  const wrapperProps = profile.built
    ? { to: profile.path, className: 'group block' }
    : { className: 'block opacity-75' };

  return (
    <CardWrapper {...wrapperProps}>
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
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
          </div>
        ) : (
          <div className="flex items-center justify-between pt-3 border-t border-[#1c2a35]/50">
            <span className="text-xs text-slate-500 font-medium">Profile coming soon</span>
            <Clock className="w-4 h-4 text-slate-600" />
          </div>
        )}
      </article>
    </CardWrapper>
  );
};

const ProfilesIndex = () => {
  const builtProfiles = PROFILES.filter(p => p.built);
  const upcomingProfiles = PROFILES.filter(p => !p.built);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Profiles: Targeted by the CCP
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
          Detailed profiles of individuals persecuted by the Chinese Communist Party — journalists, 
          activists, religious leaders, and scholars whose stories must not be forgotten.
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {builtProfiles.length} profiles available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            {upcomingProfiles.length} coming soon
          </span>
        </div>
      </div>

      {/* Built Profiles */}
      <section className="mb-10" aria-label="Available profiles">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {builtProfiles.map((profile) => (
            <ProfileCard key={profile.name} profile={profile} />
          ))}
        </div>
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
        <p className="text-xs text-slate-500">
          All profile information is sourced from Tier 1 outlets (BBC, Reuters, AP, HRW, Amnesty International, 
          CPJ, UN OHCHR) and Tier 2 sources (HKFP, RFA, NCHRD, Safeguard Defenders). No CCP state media sources 
          are used. See individual profiles for full source lists.
        </p>
      </div>
    </div>
  );
};

export default ProfilesIndex;
