/**
 * ChowHangTungProfile — Detailed profile of Chow Hang-Tung, human rights
 * lawyer and Tiananmen vigil organizer. Charged with "inciting subversion"
 * for leading candlelight vigils commemorating June 4th. Detained 4+ years
 * without trial. Representing herself. UN ruled detention arbitrary.
 *
 * @module ChowHangTungProfile
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlobalDisclaimer from '../../components/ui/GlobalDisclaimer';
import {
  User, Calendar, MapPin, Scale, AlertTriangle, ExternalLink,
  ChevronDown, ChevronUp, Globe, FileText, BookOpen, Clock,
  ArrowLeft, Shield, Newspaper, Flag, Heart
} from 'lucide-react';


interface TimelineEventType {
  year: string;
  title: string;
  detail: string;
  category: string;
  sourceUrl?: string;
}

interface TimelineEventProps {
  event: TimelineEventType;
  isExpanded: boolean;
  onToggle: () => void;
}

// ─── DATA ──────────────────────────────────────────────────────────
// All dates verified against Amnesty International, NCHRD, HKFP, UN WGAD,
// Lawyers for Lawyers, and Hong Kong Labour Rights Monitor.
// CCP narrative rebuttals sourced from independent media, not CCP state outlets.

const PROFILE = {
  name: 'Chow Hang-Tung',
  chineseName: '鄒幸彤',
  birthDate: '1985',
  birthPlace: 'Hong Kong',
  nationality: 'Hong Kong Chinese',
  status: 'DETAINED',
  currentLocation: 'Prison, Hong Kong',
  sentence: 'On trial — "inciting subversion of state power" under NSL (max 10 years). Pleaded NOT GUILTY.',
  occupation: 'Human Rights Lawyer, Vice-Chair of Hong Kong Alliance',
};

const TIMELINE = [
  {
    date: '1985',
    year: '1985',
    title: 'Born in Hong Kong',
    detail: 'Born in Hong Kong. Would go on to study law and become one of the city\'s most prominent human rights lawyers.',
    category: 'life',
  },
  {
    date: '2010s',
    year: '2010s',
    title: 'Established career as human rights lawyer',
    detail: 'Built reputation as a fearless human rights lawyer in Hong Kong, taking on politically sensitive cases and advocating for civil liberties. Became increasingly involved in the pro-democracy movement.',
    category: 'activism',
  },
  {
    date: '2019',
    year: '2019',
    title: 'Active role in pro-democracy movement',
    detail: 'Played an active role during the 2019 anti-extradition bill protests, providing legal support to detained protesters and publicly advocating for democratic reform.',
    category: 'activism',
  },
  {
    date: '2020-06-30',
    year: '2020',
    title: 'National Security Law imposed on Hong Kong',
    detail: 'Beijing imposed the National Security Law, criminalizing secession, subversion, terrorism, and collusion with foreign forces. The law effectively ended Hong Kong\'s legal autonomy and made it dangerous to organize public commemorations of Tiananmen.',
    category: 'persecution',
  },
  {
    date: '2020-07',
    year: '2020',
    title: 'Became vice-chairperson of Hong Kong Alliance',
    detail: 'Took on leadership role as vice-chairperson of the Hong Kong Alliance in Support of Patriotic Democratic Movements of China, the organization that had organized Victoria Park\'s annual Tiananmen vigil for three decades.',
    category: 'activism',
  },
  {
    date: '2021-06-04',
    year: '2021',
    title: 'Arrested on June 4th — Tiananmen anniversary',
    detail: 'Arrested on the 32nd anniversary of the Tiananmen massacre for "inciting others to take part in an unauthorized assembly." She had publicly urged Hong Kong people to light candles in memory of the 1989 victims, even as police banned the annual vigil for a second year.',
    category: 'persecution',
    sourceUrl: 'https://hongkongfp.com/2021/06/04/breaking-hong-kong-alliance-vice-chair-chow-hang-tung-arrested-on-tiananmen-anniversary/',
  },
  {
    date: '2021-09-08',
    year: '2021',
    title: 'Charged with inciting subversion under NSL',
    detail: 'Charged alongside Lee Cheuk-yan and Albert Ho with "inciting subversion of state power" under the National Security Law. The charge carries a maximum sentence of 10 years. Authorities alleged that the Hong Kong Alliance\'s organization of Tiananmen vigils constituted subversion of state power.',
    category: 'persecution',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2026/01/hong-kong-trial-of-tiananmen-activists-a-cynical-attempt-to-erase-historical-memory/',
  },
  {
    date: '2021-09',
    year: '2021',
    title: 'Denied bail — pre-trial detention begins',
    detail: 'Courts repeatedly denied bail applications. Chow began what would become more than 4 years of pre-trial detention — the longest pre-trial detention of any NSL defendant. Amnesty International designated her a prisoner of conscience.',
    category: 'persecution',
  },
  {
    date: '2021-09-25',
    year: '2021',
    title: 'Hong Kong Alliance officially disbanded',
    detail: 'The Hong Kong Alliance voted to disband under government pressure, ending the 32-year-old organization. Authorities had demanded it hand over operational details under the NSL, which the Alliance refused.',
    category: 'persecution',
  },
  {
    date: '2023',
    year: '2023',
    title: 'UN Working Group rules detention arbitrary',
    detail: 'The United Nations Working Group on Arbitrary Detention determined that Chow\'s detention was arbitrary and called for her immediate and unconditional release. The Working Group found that the charges arose from activities protected under international human rights law — specifically the rights to freedom of expression and peaceful assembly.',
    category: 'international',
    sourceUrl: 'https://hkchr.org/en/archives/4201',
  },
  {
    date: '2024',
    year: '2024',
    title: 'Over 1,500 days in pre-trial detention',
    detail: 'Passed 1,500 days in pre-trial detention. Reports emerged of prolonged periods of solitary confinement. Amnesty Canada documented that conditions may constitute torture or cruel, inhuman treatment under international law.',
    category: 'persecution',
    sourceUrl: 'https://hklabourrights.org/news/lee-cheuk-yan-chow-hang-tung-1500-days-in-jailed-without-trial/',
  },
  {
    date: '2025-12',
    year: '2025',
    title: 'Amnesty Write for Rights campaign features Chow',
    detail: 'Amnesty International featured Chow Hang-Tung in its global Write for Rights campaign — the world\'s largest human rights letter-writing event. The campaign highlighted her imprisonment for commemorating Tiananmen and called for her release.',
    category: 'international',
    sourceUrl: 'https://amnesty.org.nz/chow/',
  },
  {
    date: '2026-01-22',
    year: '2026',
    title: 'NSL subversion trial begins',
    detail: 'Trial for "inciting subversion of state power" began at West Kowloon Magistrates\' Courts. Chow pleaded not guilty and chose to represent herself — a remarkable decision that demonstrated her legal expertise and defiance. Co-defendants Lee Cheuk-yan also pleaded not guilty; Albert Ho pleaded guilty. Trial expected to last several months.',
    category: 'persecution',
    sourceUrl: 'https://www.nchrd.org/2026/01/hong-kong-drop-charges-against-tiananmen-vigil-organizers-end-sham-trial/',
  },
  {
    date: '2026-02-14',
    year: '2026',
    title: 'Amnesty publishes Valentine\'s poem to Chow',
    detail: 'Amnesty International published a Valentine\'s Day poem dedicated to Chow: "In a world that forces us apart, we still choose each other." The tribute highlighted her courage and sacrifice, and the cruelty of her prolonged detention.',
    category: 'international',
    sourceUrl: 'https://www.amnesty.org/en/latest/campaigns/2026/02/in-a-world-that-forces-us-apart-we-still-choose-each-other-valentines-poem-to-hong-kong-activist-chow-hang-tung/',
  },
  {
    date: '2026-03-06',
    year: '2026',
    title: 'Joint international legal statement demands fair trial',
    detail: 'Lawyers for Lawyers (Netherlands-based) published a joint international legal statement signed by lawyers\' organizations worldwide, demanding that Chow receive a fair trial and calling for the charges to be dropped entirely.',
    category: 'international',
    sourceUrl: 'https://www.lawyersforlawyers.org/wp-content/uploads/2026/03/ChowHangTung_JointStatement_6_3_2026.pdf',
  },
  {
    date: '2026-03-10',
    year: '2026',
    title: 'Defence seeks early acquittal — "no case to answer"',
    detail: 'Defence made a "no case to answer" submission, arguing that prosecutors had failed to present sufficient evidence and had misapplied the law. The court is considering the submission. If successful, Chow could be acquitted before needing to mount a full defence.',
    category: 'persecution',
    sourceUrl: 'https://hongkongfp.com/2026/03/10/lawyers-for-tiananmen-vigil-activist-seek-acquittal-in-subversion-trial/',
  },
];

const CHARGES = [
  {
    charge: 'Inciting subversion of state power (煽動顛覆國家政權罪)',
    law: 'Hong Kong National Security Law (NSL), Article 22/23',
    filed: 'September 2021',
    verdict: 'ON TRIAL — Pleaded NOT GUILTY (January 22, 2026)',
    sentence: 'Maximum 10 years imprisonment',
    detail: 'Charged for her role in organizing the Hong Kong Alliance\'s annual Tiananmen candlelight vigils. The prosecution alleges that commemorating the victims of the 1989 Tiananmen massacre and calling for accountability constitutes "inciting subversion of state power." This is the first prosecution specifically targeting historical memory and commemoration as subversion.',
  },
  {
    charge: 'Inciting others to knowingly take part in an unauthorized assembly',
    law: 'Public Order Ordinance',
    filed: 'June 2021',
    verdict: 'CONVICTED — January 2022',
    sentence: '15 months imprisonment (served)',
    detail: 'Convicted for urging Hong Kong people to light candles on the 32nd anniversary of the Tiananmen massacre (June 4, 2021), after police banned the annual vigil for a second year.',
  },
];

const CCP_NARRATIVES = [
  {
    claim: '"The Hong Kong Alliance was subverting state power through Tiananmen vigils"',
    reality: 'For 30 years, the Victoria Park candlelight vigil was the largest annual Tiananmen commemoration in the world. It was a peaceful, legal gathering that attracted tens of thousands. No government — including Beijing — objected to it until the NSL was imposed in 2020. The prosecution retroactively criminalized three decades of lawful activity.',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2026/01/hong-kong-trial-of-tiananmen-activists-a-cynical-attempt-to-erase-historical-memory/',
  },
  {
    claim: '"Chow Hang-Tung was arrested for violating the law, not for her beliefs"',
    reality: 'Chow was arrested on June 4, 2021 — the anniversary of the Tiananmen massacre — for urging people to light candles in memory of the victims. The timing, the charge, and the target all demonstrate that this is a prosecution of historical memory and peaceful expression, not genuine law enforcement. The UN Working Group on Arbitrary Detention explicitly found her detention to be arbitrary.',
    sourceUrl: 'https://hkchr.org/en/archives/4201',
  },
  {
    claim: '"Her prolonged detention is necessary for national security"',
    reality: 'Chow has been in pre-trial detention since September 2021 — over 4 years — for organizing peaceful candlelight vigils. She poses no security threat. The UN Working Group on Arbitrary Detention, Amnesty International, and international legal observers all agree her detention violates international law. The prolonged pre-trial detention itself may constitute cruel and inhuman treatment.',
    sourceUrl: 'https://www.nchrd.org/2026/01/hong-kong-drop-charges-against-tiananmen-vigil-organizers-end-sham-trial/',
  },
  {
    claim: '"The trial is fair and follows due process"',
    reality: 'The trial is conducted under the NSL framework, which allows government-vetted judges, restrictions on jury trials, and secret proceedings. Chow was denied bail for over 4 years. The prosecution relies heavily on speeches and media appearances from before the NSL was enacted. International legal observers have raised serious concerns about the fairness of proceedings.',
    sourceUrl: 'https://www.lawyersforlawyers.org/wp-content/uploads/2026/03/ChowHangTung_JointStatement_6_3_2026.pdf',
  },
];

const INTERNATIONAL_RESPONSES = [
  {
    entity: 'UN Working Group on Arbitrary Detention',
    response: 'Determined detention to be arbitrary. Called for immediate and unconditional release. Found charges arise from protected activities under international law.',
    sourceUrl: 'https://hkchr.org/en/archives/4201',
  },
  {
    entity: 'Amnesty International',
    response: 'Designated prisoner of conscience. Called trial "a cynical attempt to erase historical memory." Featured in global Write for Rights campaign (2025). Called for immediate and unconditional release.',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2026/01/hong-kong-trial-of-tiananmen-activists-a-cynical-attempt-to-erase-historical-memory/',
  },
  {
    entity: 'NCHRD (Network of Chinese Human Rights Defenders)',
    response: 'Demanded all charges be dropped and vigil organizers released. Published detailed case documentation.',
    sourceUrl: 'https://www.nchrd.org/2026/01/hong-kong-drop-charges-against-tiananmen-vigil-organizers-end-sham-trial/',
  },
  {
    entity: 'Lawyers for Lawyers (Netherlands)',
    response: 'Published joint international legal statement (March 2026) demanding fair trial, signed by lawyers\' organizations worldwide.',
    sourceUrl: 'https://www.lawyersforlawyers.org/wp-content/uploads/2026/03/ChowHangTung_JointStatement_6_3_2026.pdf',
  },
  {
    entity: 'Hong Kong Watch',
    response: 'Published detailed briefings on trial proceedings and human rights developments.',
    sourceUrl: 'https://www.hongkongwatch.org/all-posts/2026/3/11/hong-kong-watch-briefing-on-human-rights-developments-february-2026',
  },
  {
    entity: 'Council of Global Unions / BWI',
    response: 'Published statement condemning prosecution of co-defendant Lee Cheuk-yan, in solidarity with all three Alliance defendants.',
    sourceUrl: 'https://www.bwint.org/BwiNews/NewsDetails?newsId=1081',
  },
];

const SOURCES = [
  { name: 'Amnesty International', url: 'https://www.amnesty.org/en/latest/news/2026/01/hong-kong-trial-of-tiananmen-activists-a-cynical-attempt-to-erase-historical-memory/', tier: 1 },
  { name: 'Amnesty (Write for Rights)', url: 'https://amnesty.org.nz/chow/', tier: 1 },
  { name: 'Amnesty (Valentine\'s poem)', url: 'https://www.amnesty.org/en/latest/campaigns/2026/02/in-a-world-that-forces-us-apart-we-still-choose-each-other-valentines-poem-to-hong-kong-activist-chow-hang-tung/', tier: 1 },
  { name: 'NCHRD', url: 'https://www.nchrd.org/2026/01/hong-kong-drop-charges-against-tiananmen-vigil-organizers-end-sham-trial/', tier: 2 },
  { name: 'Hong Kong Free Press', url: 'https://hongkongfp.com/2026/03/10/lawyers-for-tiananmen-vigil-activist-seek-acquittal-in-subversion-trial/', tier: 2 },
  { name: 'Lawyers for Lawyers (Joint Statement)', url: 'https://www.lawyersforlawyers.org/wp-content/uploads/2026/03/ChowHangTung_JointStatement_6_3_2026.pdf', tier: 2 },
  { name: 'HK Labour Rights Monitor', url: 'https://hklabourrights.org/news/lee-cheuk-yan-chow-hang-tung-1500-days-in-jailed-without-trial/', tier: 2 },
  { name: 'Hong Kong Watch', url: 'https://www.hongkongwatch.org/all-posts/2026/3/11/hong-kong-watch-briefing-on-human-rights-developments-february-2026', tier: 2 },
  { name: 'Amnesty Canada (Solitary confinement)', url: 'https://amnesty.ca/human-rights-news/hong-kong-trial-tiananmen-activists-attempt-erase-historical-memory/', tier: 1 },
  { name: 'HKCHR (UN WGAD ruling)', url: 'https://hkchr.org/en/archives/4201', tier: 2 },
];

// ─── CATEGORY COLORS ───────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  life: { bg: 'bg-[#111820]', text: 'text-slate-200', label: 'Personal' },
  activism: { bg: 'bg-emerald-900/30', text: 'text-emerald-200', label: 'Activism' },
  persecution: { bg: 'bg-red-900/60', text: 'text-red-200', label: 'Persecution' },
  international: { bg: 'bg-cyan-900/40', text: 'text-cyan-200', label: 'International' },
};

// ─── SUB-COMPONENTS ─────────────────────────────────────────────────

const TimelineEvent = ({ event, isExpanded, onToggle }: TimelineEventProps) => {
  const cat = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.life;
  return (
    <div className={`border border-[#1c2a35] overflow-hidden ${cat.bg}`} aria-label={`Timeline event: ${event.title}`}>
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-xs text-slate-400 shrink-0 w-12">{event.year}</span>
          <span className={`text-xs px-1.5 py-0.5 font-mono ${cat.text} ${cat.bg} border border-[#1c2a35] shrink-0`}>
            {cat.label}
          </span>
          <span className="text-sm text-slate-200 truncate">{event.title}</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-[#1c2a35]">
          <p className="text-sm text-slate-300 mt-3 leading-relaxed">{event.detail}</p>
          {event.sourceUrl && (
            <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#4afa82] hover:text-[#2a9a52] mt-2 font-mono">
              <ExternalLink className="w-3 h-3" /> Source <span className="sr-only">(opens in new tab)</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────

const ChowHangTungProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('timeline');
  const [expandedEvents, setExpandedEvents] = useState<Set<number>>(new Set());

  const toggleEvent = (index: number) => {
    setExpandedEvents(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'charges', label: 'Charges', icon: Scale },
    { id: 'narrative', label: 'CCP Narrative', icon: Shield },
    { id: 'response', label: 'International', icon: Globe },
    { id: 'sources', label: 'Sources', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e14] text-white">
      <GlobalDisclaimer />
      {/* Header */}
      <div className="border-b border-[#1c2a35] bg-[#111820]">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link to="/profiles" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#4afa82] mb-4 font-mono">
            <ArrowLeft className="w-4 h-4" /> Back to Profiles
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-16 h-16 bg-[#0a0e14] border border-[#1c2a35] flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-[#4afa82]" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-mono font-bold text-white">{PROFILE.name}</h1>
              <p className="text-lg text-slate-400 font-mono">{PROFILE.chineseName}</p>
              <p className="text-sm text-slate-300 mt-1">{PROFILE.occupation}</p>
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> b. {PROFILE.birthDate}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {PROFILE.birthPlace}</span>
                <span className="flex items-center gap-1"><Flag className="w-3 h-3" /> {PROFILE.nationality}</span>
              </div>
            </div>
            <div className="sm:text-right shrink-0">
              <span className="inline-block px-3 py-1 text-xs font-mono bg-red-900/40 text-red-300 border border-red-800/50">
                <AlertTriangle className="w-3 h-3 inline mr-1" />
                {PROFILE.status}
              </span>
              <p className="text-xs text-slate-400 mt-2 max-w-xs">
                <MapPin className="w-3 h-3 inline mr-1" />
                {PROFILE.currentLocation}
              </p>
            </div>
          </div>

          {/* Sentence banner */}
          <div className="mt-4 p-3 bg-red-900/20 border border-red-800/30">
            <div className="flex items-start gap-2">
              <Scale className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-300 font-mono">Current Sentence / Status</p>
                <p className="text-sm text-slate-300 mt-1">{PROFILE.sentence}</p>
              </div>
            </div>
          </div>

          {/* Key context banner */}
          <div className="mt-3 p-3 bg-[#4afa82]/5 border border-[#4afa82]/20">
            <div className="flex items-start gap-2">
              <Heart className="w-4 h-4 text-[#4afa82] shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">
                <span className="text-[#4afa82] font-mono">Why this case matters:</span>{' '}
                This is the first prosecution that specifically criminalizes the commemoration of a historical event — the Tiananmen massacre — as "subversion." If Chow is convicted, it will establish that remembering the dead is a crime in Hong Kong. The UN has ruled her detention arbitrary. Amnesty International has designated her a prisoner of conscience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#1c2a35] bg-[#0a0e14]">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Profile sections">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-mono whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#4afa82] text-[#4afa82]'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={activeTab} className="max-w-5xl mx-auto px-4 py-8">
        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div>
            <h2 className="text-lg font-mono font-bold text-white mb-1 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#4afa82]" /> Timeline
            </h2>
            <p className="text-sm text-slate-400 mb-6">Key events in Chow Hang-Tung&apos;s life, activism, and persecution.</p>
            <div className="space-y-2">
              {TIMELINE.map((event, i) => (
                <TimelineEvent
                  key={i}
                  event={event}
                  isExpanded={expandedEvents.has(i)}
                  onToggle={() => toggleEvent(i)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Charges Tab */}
        {activeTab === 'charges' && (
          <div>
            <h2 className="text-lg font-mono font-bold text-white mb-1 flex items-center gap-2">
              <Scale className="w-5 h-5 text-red-400" /> Charges & Legal Status
            </h2>
            <p className="text-sm text-slate-400 mb-6">Legal proceedings against Chow Hang-Tung. All charges relate to peaceful activism.</p>
            <div className="space-y-4">
              {CHARGES.map((c, i) => (
                <div key={i} className="border border-[#1c2a35] bg-[#111820] p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <FileText className="w-4 h-4 text-red-400 shrink-0 mt-1" />
                    <div>
                      <h3 className="font-mono text-sm text-white">{c.charge}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{c.law}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mt-3 mb-3">
                    <div><span className="text-slate-400">Filed:</span> {c.filed}</div>
                    <div><span className="text-slate-400">Verdict:</span> <span className={c.verdict.startsWith('ON TRIAL') ? 'text-yellow-400' : 'text-red-400'}>{c.verdict}</span></div>
                    <div className="col-span-2"><span className="text-slate-400">Sentence:</span> {c.sentence}</div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CCP Narrative Tab */}
        {activeTab === 'narrative' && (
          <div>
            <h2 className="text-lg font-mono font-bold text-white mb-1 flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-400" /> CCP Narrative vs. Reality
            </h2>
            <p className="text-sm text-slate-400 mb-6">CCP claims debunked with evidence from independent sources.</p>
            <div className="space-y-4">
              {CCP_NARRATIVES.map((n, i) => (
                <div key={i} className="border border-[#1c2a35] overflow-hidden">
                  <div className="bg-red-900/20 px-4 py-3 border-b border-[#1c2a35]">
                    <p className="text-sm text-red-300 font-mono flex items-start gap-2">
                      <Newspaper className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>CCP Claim: {n.claim}</span>
                    </p>
                  </div>
                  <div className="bg-[#111820] px-4 py-3">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      <span className="text-[#4afa82] font-mono text-xs">REALITY:</span> {n.reality}
                    </p>
                    {n.sourceUrl && (
                      <a href={n.sourceUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#4afa82] hover:text-[#2a9a52] mt-2 font-mono">
                        <ExternalLink className="w-3 h-3" /> Verify <span className="sr-only">(opens in new tab)</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* International Response Tab */}
        {activeTab === 'response' && (
          <div>
            <h2 className="text-lg font-mono font-bold text-white mb-1 flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" /> International Response
            </h2>
            <p className="text-sm text-slate-400 mb-6">How the international community has responded to Chow Hang-Tung&apos;s case.</p>
            <div className="space-y-3">
              {INTERNATIONAL_RESPONSES.map((r, i) => (
                <div key={i} className="border border-[#1c2a35] bg-[#111820] p-4">
                  <h3 className="font-mono text-sm text-[#22d3ee] mb-2">{r.entity}</h3>
                  <p className="text-sm text-slate-300">{r.response}</p>
                  {r.sourceUrl && (
                    <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#4afa82] hover:text-[#2a9a52] mt-2 font-mono">
                      <ExternalLink className="w-3 h-3" /> Source <span className="sr-only">(opens in new tab)</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sources Tab */}
        {activeTab === 'sources' && (
          <div>
            <h2 className="text-lg font-mono font-bold text-white mb-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#4afa82]" /> Sources & Verification
            </h2>
            <p className="text-sm text-slate-400 mb-6">All information verified against Tier 1-2 sources. No CCP state media cited.</p>
            <GlobalDisclaimer type="verify" />
            <div className="mt-6 space-y-2">
              {SOURCES.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-[#1c2a35] bg-[#111820] hover:border-[#4afa82]/30 transition-colors group">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-xs font-mono px-1.5 py-0.5 border ${s.tier === 1 ? 'text-[#4afa82] border-[#4afa82]/30' : 'text-[#22d3ee] border-[#22d3ee]/30'}`}>
                      T{s.tier}
                    </span>
                    <span className="text-sm text-slate-300 truncate">{s.name}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-[#4afa82] shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChowHangTungProfile;
