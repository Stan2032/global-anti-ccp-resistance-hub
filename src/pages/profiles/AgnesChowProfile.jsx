import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateAge } from '../../utils/dateUtils';
import GlobalDisclaimer from '../../components/ui/GlobalDisclaimer';
import {
  User, Calendar, MapPin, Scale, AlertTriangle, ExternalLink,
  ChevronDown, ChevronUp, Globe, FileText, BookOpen, Clock,
  ArrowLeft, Shield, Newspaper, Flag, Heart
} from 'lucide-react';

// ─── DATA ──────────────────────────────────────────────────────────
// All dates verified against BBC, HKFP, Amnesty International, Human Rights Watch,
// and Reuters. CCP narrative rebuttals sourced from independent media, not CCP state outlets.

const PROFILE = {
  name: 'Agnes Chow',
  chineseName: '周庭',
  birthDate: 'December 3, 1996',
  birthPlace: 'Hong Kong',
  nationality: 'Chinese (Hong Kong permanent resident)',
  status: 'EXILED',
  currentLocation: 'Toronto, Canada (exile since December 2023)',
  sentence: 'Served 6 months 3 weeks for inciting unauthorized assembly (2020-2021); fled bail in 2023',
  occupation: 'Pro-Democracy Activist, Former Demosistō Deputy Secretary General',
};

const TIMELINE = [
  {
    date: '1996-12-03',
    year: '1996',
    title: 'Born in Hong Kong',
    detail: 'Born in Hong Kong on December 3, 1996.',
    category: 'life',
  },
  {
    date: '2012',
    year: '2012',
    title: 'Joined Scholarism as a secondary school student',
    detail: 'Joined Scholarism, a student activist group founded by Joshua Wong, as a secondary school student. Campaigned against the proposed "Moral and National Education" curriculum, which critics condemned as a CCP-influenced brainwashing program for Hong Kong schools.',
    category: 'activism',
  },
  {
    date: '2014',
    year: '2014',
    title: 'Active participant in the Umbrella Movement',
    detail: 'Participated in the Umbrella Movement (September–December 2014) at age 17. The movement demanded genuine universal suffrage for Hong Kong and saw tens of thousands occupy major roads in protest against Beijing\'s restrictive framework for elections.',
    category: 'activism',
  },
  {
    date: '2016-04',
    year: '2016',
    title: 'Co-founded Demosistō',
    detail: 'Co-founded Demosistō with Joshua Wong and Nathan Law as a pro-democracy political party advocating self-determination for Hong Kong. The party explicitly rejected independence, instead calling for Hong Kong people to have a meaningful say in their own governance through democratic means.',
    category: 'activism',
  },
  {
    date: '2018-01',
    year: '2018',
    title: 'Disqualified from Legislative Council by-election',
    detail: 'Disqualified from running in the Hong Kong Legislative Council by-election. Electoral officials ruled that her party\'s advocacy of self-determination violated the Basic Law — a decision widely criticized as politically motivated and a sign of Beijing\'s tightening grip on Hong Kong\'s electoral system.',
    category: 'persecution',
  },
  {
    date: '2019',
    year: '2019',
    title: 'Active supporter of anti-extradition bill protests',
    detail: 'Active supporter of the 2019 anti-extradition bill protests, which drew millions of Hong Kong residents into the streets opposing a bill that would have allowed extradition to mainland China. The protests evolved into a broader pro-democracy movement.',
    category: 'activism',
  },
  {
    date: '2020-08-10',
    year: '2020',
    title: 'Arrested under the National Security Law',
    detail: 'Arrested under the National Security Law alongside Jimmy Lai and other activists. Accused of "colluding with foreign forces" — a vague charge that could encompass speaking to foreign media or meeting with foreign politicians.',
    category: 'persecution',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-53715783',
  },
  {
    date: '2020-11-23',
    year: '2020',
    title: 'Pleaded guilty to unauthorized assembly charge',
    detail: 'Pleaded guilty to inciting others to take part in an unauthorized assembly on June 21, 2019, alongside Joshua Wong and Ivan Lam. The charge related to a protest outside Hong Kong police headquarters during the anti-extradition bill movement.',
    category: 'persecution',
  },
  {
    date: '2020-12-02',
    year: '2020',
    title: 'Sentenced to 10 months imprisonment',
    detail: 'Sentenced to 10 months imprisonment for unauthorized assembly charges. Amnesty International designated her a prisoner of conscience and called for her immediate release.',
    category: 'persecution',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2020/12/hong-kong-joshua-wong-agnes-chow-and-ivan-lam-jailed/',
  },
  {
    date: '2021-06-12',
    year: '2021',
    title: 'Released from prison',
    detail: 'Released from prison after serving approximately 6 months and 3 weeks with remission. However, she remained subject to strict bail conditions regarding the outstanding NSL investigation, including regular reporting to police.',
    category: 'persecution',
  },
  {
    date: '2021-2023',
    year: '2021–23',
    title: 'Lived under strict bail conditions in Hong Kong',
    detail: 'Lived under strict bail conditions in Hong Kong following her release. Required to report to police regularly regarding the outstanding NSL investigation into "collusion with foreign forces." Described facing intense psychological pressure and surveillance during this period.',
    category: 'persecution',
  },
  {
    date: '2023-09',
    year: '2023',
    title: 'Left Hong Kong for Canada',
    detail: 'Left Hong Kong for Canada, ostensibly to study at the University of Toronto. This departure would later be revealed as the beginning of her exile from Hong Kong.',
    category: 'life',
  },
  {
    date: '2023-12-03',
    year: '2023',
    title: 'Announced exile — will not return to Hong Kong',
    detail: 'On her 27th birthday, publicly announced that she would not return to Hong Kong to meet bail conditions. In a detailed statement, she described the psychological pressure, surveillance, and requirement to "perform patriotic activities" she faced as conditions of her bail — conditions designed to coerce compliance rather than ensure attendance at trial.',
    category: 'international',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-67605633',
  },
  {
    date: '2024-02',
    year: '2024',
    title: 'Hong Kong police issue arrest warrant',
    detail: 'Hong Kong police issued an arrest warrant for Agnes Chow for violating bail conditions. She remains wanted under the National Security Law and cannot return to Hong Kong.',
    category: 'persecution',
    sourceUrl: 'https://hongkongfp.com/2024/02/hong-kong-police-issue-arrest-warrant-agnes-chow/',
  },
];

const CHARGES = [
  {
    charge: 'Inciting others to knowingly take part in an unauthorized assembly',
    law: 'Public Order Ordinance',
    filed: 'November 23, 2020',
    verdict: 'GUILTY — November 23, 2020',
    sentence: '10 months (served ~6 months 3 weeks with remission)',
    detail: 'Convicted alongside Joshua Wong and Ivan Lam for their roles in a protest on June 21, 2019 outside Hong Kong police headquarters. The protest was part of the broader anti-extradition bill movement. Amnesty International designated all three as prisoners of conscience.',
  },
  {
    charge: 'Collusion with foreign forces under the National Security Law',
    law: 'National Security Law (Article 29)',
    filed: 'August 10, 2020 (arrested)',
    verdict: 'Investigation ongoing / bail jumped',
    sentence: 'N/A — fled bail conditions in December 2023',
    detail: 'Arrested alongside Jimmy Lai and others on August 10, 2020. Released on bail but required to report to police regularly. The vague nature of the charge — which could encompass speaking to foreign media or meeting with foreign politicians — exemplifies the chilling effect of the NSL on political expression. No formal charges have been filed.',
  },
];

const CCP_NARRATIVES = [
  {
    claim: '"Agnes Chow violated bail conditions and fled justice"',
    reality: 'Agnes Chow completed her prison sentence and was released. The "bail conditions" related to an NSL investigation that has never resulted in formal charges. She described in her December 2023 statement the intense psychological pressure, surveillance, and requirement to "perform patriotic activities" that she faced as conditions of her bail — conditions designed to coerce compliance rather than ensure attendance at trial.',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-67605633',
  },
  {
    claim: '"She is a separatist who colluded with foreign forces"',
    reality: 'Agnes Chow advocated for self-determination and democratic rights within Hong Kong\'s existing legal framework. Demosistō explicitly rejected independence. Her "foreign collusion" consisted of meeting with foreign politicians and speaking to international media — activities protected under international human rights law. She never advocated violence.',
    sourceUrl: 'https://hongkongfp.com/2023/12/03/explainer-agnes-chow-hong-kong-activist-exile-canada/',
  },
  {
    claim: '"The National Security Law restored stability to Hong Kong"',
    reality: 'The NSL has been used to systematically dismantle Hong Kong\'s civil society. Since its imposition on June 30, 2020, virtually all pro-democracy organizations have disbanded, independent media have closed, and scores of activists, journalists, and politicians have been arrested or forced into exile. Agnes Chow\'s case illustrates how the NSL is used not just for prosecution but for ongoing control through surveillance and bail conditions.',
    sourceUrl: 'https://www.hrw.org/news/2024/06/25/hong-kong-4-years-national-security-law',
  },
];

const INTERNATIONAL_RESPONSES = [
  {
    entity: 'United Kingdom',
    response: 'Condemned the erosion of freedoms in Hong Kong. The UK has offered a pathway to citizenship for Hong Kong residents through the BN(O) visa scheme.',
  },
  {
    entity: 'Canada',
    response: 'Agnes Chow was granted entry. Canada has expressed concern over Hong Kong\'s deteriorating rights situation.',
  },
  {
    entity: 'Human Rights Watch',
    response: 'Documented the systematic dismantling of civil liberties in Hong Kong, including Agnes Chow\'s case.',
    sourceUrl: 'https://www.hrw.org/news/2024/06/25/hong-kong-4-years-national-security-law',
  },
  {
    entity: 'Amnesty International',
    response: 'Called for all charges against Agnes Chow to be dropped. Designated her a prisoner of conscience during her imprisonment.',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2020/12/hong-kong-joshua-wong-agnes-chow-and-ivan-lam-jailed/',
  },
  {
    entity: 'European Union',
    response: 'Expressed concern over the National Security Law\'s impact on Hong Kong freedoms.',
  },
];

const SOURCES = [
  { name: 'BBC', url: 'https://www.bbc.com/news/world-asia-china-67605633', tier: 1 },
  { name: 'Hong Kong Free Press (HKFP)', url: 'https://hongkongfp.com/2023/12/03/explainer-agnes-chow-hong-kong-activist-exile-canada/', tier: 2 },
  { name: 'Human Rights Watch', url: 'https://www.hrw.org/news/2024/06/25/hong-kong-4-years-national-security-law', tier: 1 },
  { name: 'Amnesty International', url: 'https://www.amnesty.org/en/latest/news/2020/12/hong-kong-joshua-wong-agnes-chow-and-ivan-lam-jailed/', tier: 1 },
  { name: 'Reuters', url: 'https://www.reuters.com/world/china/hong-kong-activist-agnes-chow-says-she-will-not-return-bail-conditions-2023-12-03/', tier: 1 },
  { name: 'BBC (arrest)', url: 'https://www.bbc.com/news/world-asia-china-53715783', tier: 1 },
  { name: 'HKFP (warrant)', url: 'https://hongkongfp.com/2024/02/hong-kong-police-issue-arrest-warrant-agnes-chow/', tier: 2 },
];

// ─── CATEGORY COLORS ───────────────────────────────────────────────
const CATEGORY_COLORS = {
  life: { bg: 'bg-[#111820]', text: 'text-slate-200', label: 'Personal' },
  activism: { bg: 'bg-[#111820]', text: 'text-[#22d3ee]', label: 'Activism' },
  persecution: { bg: 'bg-red-900/60', text: 'text-red-200', label: 'Persecution' },
  international: { bg: 'bg-emerald-900/60', text: 'text-emerald-200', label: 'International' },
};

// ─── SUB-COMPONENTS ─────────────────────────────────────────────────

const TimelineEvent = ({ event, isExpanded, onToggle }) => {
  const cat = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.life;
  return (
    <div className={`border border-[#1c2a35] overflow-hidden ${cat.bg}`} aria-label={`Timeline event: ${event.title}`}>
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-mono text-slate-400 whitespace-nowrap">{event.year}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${cat.bg} ${cat.text} border border-white/10`}>{cat.label}</span>
          <span className="text-sm font-medium text-white truncate">{event.title}</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
      </button>
      {isExpanded && (
        <div className="px-4 pb-3 border-t border-white/5">
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">{event.detail}</p>
          {event.sourceUrl && (
            <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 mt-2">
              <ExternalLink className="w-3 h-3" /> Source
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────

export default function AgnesChowProfile() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [expandedEvents, setExpandedEvents] = useState(new Set());

  const toggleEvent = (idx) => {
    setExpandedEvents((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const expandAll = () => setExpandedEvents(new Set(TIMELINE.map((_, i) => i)));
  const collapseAll = () => setExpandedEvents(new Set());

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'charges', label: 'Charges & Legal Status', icon: Scale },
    { id: 'narratives', label: 'CCP Narratives', icon: AlertTriangle },
    { id: 'response', label: 'International Response', icon: Globe },
    { id: 'sources', label: 'Sources', icon: BookOpen },
  ];

  const daysInExile = Math.floor((new Date() - new Date('2023-12-03')) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <GlobalDisclaimer />

      {/* Back link */}
      <Link to="/profiles" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Profiles
      </Link>

      {/* ─── HEADER ─────────────────────────────────────────── */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-yellow-500 p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-yellow-900/60 border-2 border-yellow-600 flex items-center justify-center flex-shrink-0">
            <User className="w-10 h-10 text-yellow-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{PROFILE.name}</h1>
              <span className="text-lg text-yellow-400">{PROFILE.chineseName}</span>
            </div>
            <p className="text-sm text-slate-400 mb-3">{PROFILE.occupation}</p>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500 text-yellow-900 animate-pulse">EXILED</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-900/60 text-orange-300 border border-orange-700">
                NSL WANTED
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-[#111820] text-slate-300">
                Age {calculateAge(PROFILE.birthDate)}
              </span>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-yellow-400 font-bold text-lg">{daysInExile.toLocaleString()}+</div>
                <div className="text-slate-400 text-xs">Days in exile</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-yellow-400 font-bold text-lg">12</div>
                <div className="text-slate-400 text-xs">Years active (2012–2023)</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-yellow-400 font-bold text-lg">23</div>
                <div className="text-slate-400 text-xs">Age at first arrest</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-yellow-400 font-bold text-lg">3</div>
                <div className="text-slate-400 text-xs">Co-defendants</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3 italic">
              Currently in exile in Toronto, Canada. Wanted under the National Security Law. Cannot return to Hong Kong.
            </p>
          </div>
        </div>
      </div>

      {/* ─── DEMOSISTŌ CONTEXT ─────────────────────────────── */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
        <h3 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
          <Newspaper className="w-4 h-4" /> The Silencing of Demosistō
        </h3>
        <p className="text-sm text-slate-300 mb-3">
          Demosistō was a pro-democracy political party co-founded by Agnes Chow, Joshua Wong, and Nathan Law in April 2016.
          The party advocated for self-determination for Hong Kong through democratic means — explicitly rejecting independence.
          On June 30, 2020, the day the National Security Law was imposed, Demosistō announced its dissolution.
          Its leaders have since been imprisoned or forced into exile, illustrating the NSL&#39;s devastating impact on
          Hong Kong&#39;s political opposition.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-yellow-400 font-semibold">Agnes Chow</span> — Imprisoned 2020–21. Exiled in Canada since 2023. <span className="text-yellow-300">NSL wanted.</span>
          </div>
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-red-400 font-semibold">Joshua Wong</span> — Imprisoned since 2020. Sentenced to additional 13+ months under NSL. <span className="text-red-300">Still imprisoned.</span>
          </div>
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-yellow-400 font-semibold">Nathan Law</span> — Self-exiled in the UK since July 2020. Wanted under NSL.
          </div>
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-slate-300 font-semibold">Ivan Lam</span> — Co-defendant with Chow and Wong. Sentenced to 7 months for unauthorized assembly.
          </div>
        </div>
      </div>

      {/* ─── TABS ───────────────────────────────────────────── */}
      <div className="flex overflow-x-auto gap-1 bg-[#111820]/50 p-1 border border-[#1c2a35]" role="tablist" aria-label="Profile sections">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`panel-${id}`}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === id ? 'bg-yellow-600 text-white' : 'text-slate-400 hover:text-white hover:bg-[#111820]'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* ─── TAB PANELS ─────────────────────────────────────── */}
      <div id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={activeTab}>
        {/* TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Clock className="w-5 h-5 text-yellow-400" /> Timeline — {TIMELINE.length} Events</h2>
              <div className="flex gap-2">
                <button onClick={expandAll} className="text-xs text-yellow-400 hover:text-yellow-300">Expand all</button>
                <span className="text-slate-600">|</span>
                <button onClick={collapseAll} className="text-xs text-slate-400 hover:text-white">Collapse all</button>
              </div>
            </div>
            {/* Category legend */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(CATEGORY_COLORS).map(([key, val]) => (
                <span key={key} className={`text-xs px-2 py-0.5 rounded-full ${val.bg} ${val.text} border border-white/10`}>{val.label}</span>
              ))}
            </div>
            <div className="space-y-2">
              {TIMELINE.map((event, idx) => (
                <TimelineEvent key={idx} event={event} isExpanded={expandedEvents.has(idx)} onToggle={() => toggleEvent(idx)} />
              ))}
            </div>
          </div>
        )}

        {/* CHARGES & LEGAL STATUS */}
        {activeTab === 'charges' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Scale className="w-5 h-5 text-yellow-400" /> Charges & Legal Status</h2>

            <div className="bg-yellow-900/20 border border-yellow-700/50 p-4">
              <h3 className="text-sm font-semibold text-yellow-300 mb-2">Current Legal Situation</h3>
              <p className="text-sm text-slate-300">
                Agnes Chow completed her prison sentence for unauthorized assembly in June 2021.
                She remains wanted under the National Security Law for allegedly "colluding with foreign forces" —
                a charge that has never been formally prosecuted. In February 2024, Hong Kong police issued an arrest
                warrant after she announced she would not return from Canada. She cannot return to Hong Kong or any
                jurisdiction with an extradition agreement with China.
              </p>
            </div>

            {CHARGES.map((c, i) => (
              <div key={i} className="bg-[#111820] border border-[#1c2a35] p-5">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-white">{c.charge}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                    c.verdict.startsWith('GUILTY') ? 'bg-red-900/60 text-red-300' : 'bg-orange-900/60 text-orange-300'
                  }`}>{c.verdict.startsWith('GUILTY') ? 'GUILTY' : 'BAIL JUMPED'}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                  <div><span className="text-slate-400">Law:</span> <span className="text-slate-200">{c.law}</span></div>
                  <div><span className="text-slate-400">Filed:</span> <span className="text-slate-200">{c.filed}</span></div>
                  <div><span className="text-slate-400">Sentence:</span> <span className="text-red-400 font-semibold">{c.sentence}</span></div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{c.detail}</p>
              </div>
            ))}

            {/* Co-defendants section */}
            <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
              <h3 className="text-sm font-semibold text-yellow-400 mb-2">Co-defendants</h3>
              <p className="text-sm text-slate-300">
                Agnes Chow was convicted alongside <strong className="text-white">Joshua Wong</strong> (sentenced to 13.5 months)
                and <strong className="text-white">Ivan Lam</strong> (sentenced to 7 months) for their roles in the June 21, 2019
                unauthorized assembly. Wong remains imprisoned and has since been convicted of additional charges under the NSL.
                The NSL arrest also linked her to <strong className="text-white">Jimmy Lai</strong>, who faces life imprisonment
                under the same law.
              </p>
            </div>
          </div>
        )}

        {/* CCP NARRATIVE ANALYSIS */}
        {activeTab === 'narratives' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-400" /> CCP Narrative Analysis</h2>
            <p className="text-sm text-slate-400">
              The CCP has framed Agnes Chow&#39;s exile as criminal flight, her activism as separatism, and the National Security Law
              as a stabilizing force. Each claim below is analyzed against independently verifiable facts.
              Zero CCP state media are cited as evidence.
            </p>
            {CCP_NARRATIVES.map((n, i) => (
              <div key={i} className="bg-[#111820] border border-[#1c2a35] overflow-hidden">
                <div className="bg-red-900/30 px-5 py-3 border-b border-red-700/30">
                  <h3 className="text-sm font-semibold text-red-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> CCP Claim #{i + 1}
                  </h3>
                  <p className="text-sm text-red-200 mt-1 italic">{n.claim}</p>
                </div>
                <div className="bg-emerald-900/20 px-5 py-3">
                  <h3 className="text-sm font-semibold text-emerald-300 mb-1">Reality (sourced)</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{n.reality}</p>
                  {n.sourceUrl && (
                    <a href={n.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 mt-2">
                      <ExternalLink className="w-3 h-3" /> Source
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INTERNATIONAL RESPONSE */}
        {activeTab === 'response' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Globe className="w-5 h-5 text-yellow-400" /> International Response</h2>

            {/* Responses */}
            {INTERNATIONAL_RESPONSES.map((r, i) => (
              <div key={i} className="bg-[#111820] border border-[#1c2a35] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Flag className="w-4 h-4 text-yellow-400" />
                  <h3 className="text-sm font-semibold text-white">{r.entity}</h3>
                </div>
                <p className="text-sm text-slate-300">{r.response}</p>
                {r.sourceUrl && (
                  <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 mt-2">
                    <ExternalLink className="w-3 h-3" /> Source
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* SOURCES */}
        {activeTab === 'sources' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><BookOpen className="w-5 h-5 text-yellow-400" /> Sources</h2>
            <p className="text-sm text-slate-400 mb-2">
              All information verified against independent sources. <strong className="text-slate-300">Zero CCP state media cited.</strong> Tier 1 =
              established international news/human rights organizations; Tier 2 = credible independent outlets.
            </p>
            <div className="space-y-2">
              {SOURCES.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between bg-[#111820] border border-[#1c2a35] px-4 py-3 hover:bg-[#111820] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.tier === 1 ? 'bg-emerald-900/60 text-emerald-300' : 'bg-[#111820]/60 text-[#22d3ee]'}`}>
                      Tier {s.tier}
                    </span>
                    <span className="text-sm text-white">{s.name}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-yellow-400 transition-colors" />
                </a>
              ))}
            </div>
            <div className="bg-red-900/20 border border-red-700/30 p-4 mt-4">
              <h3 className="text-sm font-semibold text-red-300 mb-1">Excluded Sources</h3>
              <p className="text-sm text-slate-400">
                Xinhua, People&#39;s Daily, CGTN, Global Times, China Daily, and all CCP-controlled media were deliberately excluded
                as sources. Hong Kong government press releases are referenced only for factual event dates, not as credible analysis.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
