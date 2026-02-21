import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateAge } from '../../utils/dateUtils';
import GlobalDisclaimer from '../../components/ui/GlobalDisclaimer';
import {
  User, Calendar, MapPin, Scale, AlertTriangle, ExternalLink,
  ChevronDown, ChevronUp, Globe, FileText, BookOpen, Clock,
  ArrowLeft, Shield, Newspaper, Flag, Heart, Book
} from 'lucide-react';

// ─── DATA ──────────────────────────────────────────────────────────
// All dates verified against BBC, HKFP, Amnesty International, Human Rights Watch,
// AP, and Reuters. CCP narrative rebuttals sourced from independent media, not CCP state outlets.

const PROFILE = {
  name: 'Benny Tai',
  chineseName: '戴耀廷',
  birthDate: '1964',
  birthPlace: 'Hong Kong',
  nationality: 'Chinese (Hong Kong permanent resident)',
  status: 'IMPRISONED',
  currentLocation: 'Prison, Hong Kong',
  sentence: '10 years for conspiracy to commit subversion (longest sentence in the HK47 case)',
  occupation: 'Law Professor (University of Hong Kong), Legal Scholar, Democracy Advocate',
};

const TIMELINE = [
  {
    date: '1964',
    year: '1964',
    title: 'Born in Hong Kong',
    detail: 'Born in Hong Kong in 1964.',
    category: 'life',
  },
  {
    date: '1991',
    year: '1991',
    title: 'Joined the University of Hong Kong Faculty of Law',
    detail: 'Joined the University of Hong Kong Faculty of Law as a lecturer, later becoming Associate Professor of Law. He would remain at HKU for 30 years until his dismissal in 2021.',
    category: 'life',
  },
  {
    date: '2013-01',
    year: '2013',
    title: 'Proposed "Occupy Central with Love and Peace"',
    detail: 'Published an article in the Hong Kong Economic Journal proposing "Occupy Central with Love and Peace" — a civil disobedience campaign to pressure Beijing for genuine universal suffrage in Hong Kong\'s elections.',
    category: 'activism',
  },
  {
    date: '2014-09-28',
    year: '2014',
    title: 'Occupy Central / Umbrella Movement began',
    detail: 'Occupy Central/Umbrella Movement began. Benny Tai, along with Chan Kin-man and Rev. Chu Yiu-ming (the "Occupy Trio"), launched the formal occupation after students had already taken to the streets.',
    category: 'activism',
  },
  {
    date: '2019-04-09',
    year: '2019',
    title: 'Convicted with the "Occupy Nine" for public nuisance',
    detail: 'Convicted alongside the "Occupy Nine" for public nuisance offenses related to the 2014 Umbrella Movement. Sentenced to 16 months imprisonment.',
    category: 'persecution',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-47867775',
  },
  {
    date: '2020-06-30',
    year: '2020',
    title: 'National Security Law imposed on Hong Kong',
    detail: 'The National Security Law was imposed on Hong Kong by Beijing, criminalizing secession, subversion, terrorism, and collusion with foreign forces — broadly defined to suppress democratic dissent.',
    category: 'persecution',
  },
  {
    date: '2020-07',
    year: '2020',
    title: 'Organized pro-democracy primary elections',
    detail: 'Organized and promoted unofficial "primary elections" for the pro-democracy camp to coordinate candidates for the September 2020 Legislative Council elections. Over 610,000 Hong Kongers voted in the primaries.',
    category: 'activism',
    sourceUrl: 'https://hongkongfp.com/2020/07/12/over-600000-hongkongers-voted-in-unofficial-primary/',
  },
  {
    date: '2021-01-06',
    year: '2021',
    title: 'Arrested in mass dawn raid — the "Hong Kong 47"',
    detail: 'Arrested alongside 54 other pro-democracy figures in a mass dawn raid for "conspiracy to commit subversion" in connection with the primary elections (the "Hong Kong 47" case).',
    category: 'persecution',
    sourceUrl: 'https://www.bbc.com/news/articles/cx2l4eynl4zo',
  },
  {
    date: '2021-07-28',
    year: '2021',
    title: 'Dismissed from the University of Hong Kong',
    detail: 'Dismissed from the University of Hong Kong by the governing council, ending his 30-year academic career.',
    category: 'persecution',
  },
  {
    date: '2022-02',
    year: '2022',
    title: 'Trial began at West Kowloon Magistrates\' Court',
    detail: 'Trial began at the West Kowloon Magistrates\' Court before three NSL-designated judges (no jury).',
    category: 'persecution',
  },
  {
    date: '2024-05-30',
    year: '2024',
    title: 'Found guilty of conspiracy to commit subversion',
    detail: 'Found guilty of conspiracy to commit subversion alongside 13 other defendants who pleaded not guilty (31 had pleaded guilty earlier).',
    category: 'persecution',
    sourceUrl: 'https://www.bbc.com/news/articles/cx2l4eynl4zo',
  },
  {
    date: '2024-11-19',
    year: '2024',
    title: 'Sentenced to 10 years — longest sentence in the HK47 case',
    detail: 'Sentenced to 10 years imprisonment — the longest sentence in the Hong Kong 47 case. The court identified him as the "organizer" and principal architect of the primary elections.',
    category: 'persecution',
    sourceUrl: 'https://hongkongfp.com/2024/11/19/hong-kong-47-benny-tai-sentenced-to-10-years/',
  },
];

const CHARGES = [
  {
    charge: 'Conspiracy to commit subversion',
    law: 'National Security Law (Article 22)',
    filed: 'January 6, 2021',
    verdict: 'GUILTY — May 30, 2024',
    sentence: '10 years imprisonment (sentenced November 19, 2024)',
    detail: 'Convicted for organizing unofficial primary elections in July 2020 in which over 610,000 Hong Kongers participated. The prosecution argued that the primaries were part of a plan to win a legislative majority and block the government\'s budget, which would force the Chief Executive to resign — an outcome explicitly provided for in Hong Kong\'s Basic Law. The court ruled that using legal mechanisms to challenge the government constituted "subversion."',
  },
  {
    charge: 'Public nuisance (Occupy Central, 2014)',
    law: 'Common Law — Public Nuisance',
    filed: '2017',
    verdict: 'GUILTY — April 9, 2019',
    sentence: '16 months imprisonment',
    detail: 'Convicted as one of the "Occupy Nine" for organizing the 2014 Occupy Central/Umbrella Movement. This earlier conviction established the pattern of criminalizing peaceful democratic advocacy in Hong Kong.',
  },
];

const CCP_NARRATIVES = [
  {
    claim: '"The primary elections were an illegal conspiracy to subvert the government"',
    reality: 'Primary elections are a standard democratic practice worldwide. Over 610,000 Hong Kongers voluntarily participated. The prosecution\'s theory — that winning elections and using legislative powers constitutes "subversion" — criminalizes the very essence of democratic opposition. The Basic Law itself provides for the legislature to block budgets and for the Chief Executive to resign if unable to govern. Using legal provisions is not subversion.',
    sourceUrl: 'https://www.bbc.com/news/articles/cx2l4eynl4zo',
  },
  {
    claim: '"Benny Tai masterminded a plot to paralyze the Hong Kong government"',
    reality: 'Benny Tai organized primary elections to coordinate candidates — a perfectly legal activity in any democracy. His writings explicitly advocated non-violent, legal methods of democratic resistance. His academic work focused on constitutional law and human rights. The 10-year sentence for organizing an election demonstrates that the NSL is used to criminalize democratic participation, not genuine threats to security.',
    sourceUrl: 'https://hongkongfp.com/2024/11/19/hong-kong-47-benny-tai-sentenced-to-10-years/',
  },
  {
    claim: '"The National Security Law targets only a small number of criminals, not ordinary citizens"',
    reality: 'The Hong Kong 47 case alone prosecuted 47 people — including law professors, social workers, journalists, union leaders, and former legislators. Since the NSL\'s imposition, virtually all pro-democracy organizations have disbanded, independent media have closed, and thousands have fled Hong Kong. The case of an internationally respected law professor receiving 10 years for organizing a primary election demonstrates the law\'s sweeping scope.',
    sourceUrl: 'https://www.hrw.org/news/2024/11/19/hong-kong-47-verdicts',
  },
];

const INTERNATIONAL_RESPONSES = [
  {
    entity: 'United Kingdom',
    response: 'Called the sentences a "politically motivated" attack on democratic freedoms. The UK specifically condemned Benny Tai\'s 10-year sentence.',
    sourceUrl: 'https://www.gov.uk/government/news/hong-kong-47-sentencing-uk-response',
  },
  {
    entity: 'United States',
    response: 'Called the trial "politically motivated" and demanded the release of all defendants.',
    sourceUrl: 'https://www.state.gov/hong-kong-47-sentencing/',
  },
  {
    entity: 'Australia',
    response: 'Expressed "grave concern" over the sentences.',
  },
  {
    entity: 'European Union',
    response: 'Condemned the verdicts and called for the release of all those convicted.',
  },
  {
    entity: 'Human Rights Watch',
    response: 'Called the sentences "the worst blow yet to Hong Kong\'s civil liberties."',
    sourceUrl: 'https://www.hrw.org/news/2024/11/19/hong-kong-47-verdicts',
  },
  {
    entity: 'Amnesty International',
    response: 'Called the trial "the biggest political prosecution in Hong Kong\'s recent history."',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2024/11/hong-kong-47-sentencing/',
  },
];

const SOURCES = [
  { name: 'BBC', url: 'https://www.bbc.com/news/articles/cx2l4eynl4zo', tier: 1 },
  { name: 'Hong Kong Free Press (HKFP)', url: 'https://hongkongfp.com/2024/11/19/hong-kong-47-benny-tai-sentenced-to-10-years/', tier: 2 },
  { name: 'Human Rights Watch', url: 'https://www.hrw.org/news/2024/11/19/hong-kong-47-verdicts', tier: 1 },
  { name: 'Amnesty International', url: 'https://www.amnesty.org/en/latest/news/2024/11/hong-kong-47-sentencing/', tier: 1 },
  { name: 'Associated Press (AP)', url: 'https://apnews.com/article/hong-kong-47-sentencing', tier: 1 },
  { name: 'Reuters', url: 'https://www.reuters.com/world/asia-pacific/hong-kong-47-democracy-activists-sentenced-2024-11-19/', tier: 1 },
  { name: 'HKFP (primary elections)', url: 'https://hongkongfp.com/2020/07/12/over-600000-hongkongers-voted-in-unofficial-primary/', tier: 2 },
];

// ─── CATEGORY COLORS ───────────────────────────────────────────────
const CATEGORY_COLORS = {
  life: { bg: 'bg-[#111820]', text: 'text-slate-200', label: 'Personal' },
  activism: { bg: 'bg-blue-900/60', text: 'text-blue-200', label: 'Activism' },
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
            <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 mt-2">
              <ExternalLink className="w-3 h-3" /> Source
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────

export default function BennyTaiProfile() {
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
    { id: 'charges', label: 'Charges & Verdict', icon: Scale },
    { id: 'narratives', label: 'CCP Narratives', icon: AlertTriangle },
    { id: 'response', label: 'International Response', icon: Globe },
    { id: 'sources', label: 'Sources', icon: BookOpen },
  ];

  const daysDetained = Math.floor((new Date() - new Date('2021-01-06')) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <GlobalDisclaimer />

      {/* Back link */}
      <Link to="/profiles" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Profiles
      </Link>

      {/* ─── HEADER ─────────────────────────────────────────── */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-red-500 p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-red-900/60 border-2 border-red-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-10 h-10 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{PROFILE.name}</h1>
              <span className="text-lg text-red-400">{PROFILE.chineseName}</span>
            </div>
            <p className="text-sm text-slate-400 mb-3">{PROFILE.occupation}</p>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">IMPRISONED</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-900/60 text-orange-300 border border-orange-700">
                HK47 — LONGEST SENTENCE
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#111820] text-slate-300 border border-[#1c2a35]">
                30-YEAR ACADEMIC CAREER DESTROYED
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-[#111820] text-slate-300">
                Age {calculateAge(PROFILE.birthDate)}
              </span>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-red-400 font-bold text-lg">{daysDetained.toLocaleString()}+</div>
                <div className="text-slate-400 text-xs">Days detained</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-red-400 font-bold text-lg">610,000+</div>
                <div className="text-slate-400 text-xs">Primary election voters</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-red-400 font-bold text-lg">47</div>
                <div className="text-slate-400 text-xs">Co-defendants in HK47</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-red-400 font-bold text-lg">30</div>
                <div className="text-slate-400 text-xs">Years at HKU</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3 italic">
              Received the longest sentence in the Hong Kong 47 case — 10 years for organizing a primary election.
            </p>
          </div>
        </div>
      </div>

      {/* ─── THE HONG KONG 47 CASE CONTEXT ────────────────────── */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
        <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
          <Newspaper className="w-4 h-4" /> The Hong Kong 47 Case
        </h3>
        <p className="text-sm text-slate-300 mb-3">
          The Hong Kong 47 is the largest national security prosecution in Hong Kong&#39;s history. In January 2021,
          47 pro-democracy figures — including legislators, academics, social workers, and activists — were arrested
          for organizing or participating in unofficial primary elections held in July 2020. Over 610,000 Hong Kongers
          voted in those primaries. The prosecution argued that coordinating candidates to win a legislative majority
          and potentially block the government&#39;s budget constituted &quot;conspiracy to commit subversion&quot; — despite
          these mechanisms being explicitly provided for in Hong Kong&#39;s Basic Law.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-red-400 font-semibold">Benny Tai</span> — 10 years (longest sentence). Identified as &quot;organizer.&quot; <span className="text-red-300">Imprisoned.</span>
          </div>
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-slate-300 font-semibold">47 defendants total</span> — 45 convicted (31 pleaded guilty, 14 found guilty at trial). 2 acquitted.
          </div>
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-slate-300 font-semibold">No jury trial</span> — Tried before three NSL-designated judges at West Kowloon Magistrates&#39; Court.
          </div>
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-slate-300 font-semibold">Sentences ranged</span> — from 4 years 2 months to 10 years. Many held in pre-trial detention for over 3 years.
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
              activeTab === id ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white hover:bg-[#111820]'
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
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Clock className="w-5 h-5 text-red-400" /> Timeline — {TIMELINE.length} Events</h2>
              <div className="flex gap-2">
                <button onClick={expandAll} className="text-xs text-red-400 hover:text-red-300">Expand all</button>
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

        {/* CHARGES & VERDICT */}
        {activeTab === 'charges' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Scale className="w-5 h-5 text-red-400" /> Charges & Verdict</h2>

            <div className="bg-red-900/20 border border-red-700/50 p-4">
              <h3 className="text-sm font-semibold text-red-300 mb-2">Current Legal Situation</h3>
              <p className="text-sm text-slate-300">
                Benny Tai is serving a 10-year sentence — the longest in the Hong Kong 47 case. The court
                identified him as the &quot;organizer&quot; and principal architect of the 2020 pro-democracy primary
                elections. He was convicted under the National Security Law for organizing an election in which
                over 610,000 people participated voluntarily.
              </p>
            </div>

            {CHARGES.map((c, i) => (
              <div key={i} className="bg-[#111820] border border-[#1c2a35] p-5">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-white">{c.charge}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full font-semibold bg-red-900/60 text-red-300">GUILTY</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                  <div><span className="text-slate-400">Law:</span> <span className="text-slate-200">{c.law}</span></div>
                  <div><span className="text-slate-400">Filed:</span> <span className="text-slate-200">{c.filed}</span></div>
                  <div><span className="text-slate-400">Sentence:</span> <span className="text-red-400 font-semibold">{c.sentence}</span></div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{c.detail}</p>
              </div>
            ))}
          </div>
        )}

        {/* CCP NARRATIVE ANALYSIS */}
        {activeTab === 'narratives' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-400" /> CCP Narrative Analysis</h2>
            <p className="text-sm text-slate-400">
              The prosecution of Benny Tai represents the criminalization of democratic participation itself.
              Each CCP claim below is analyzed against independently verifiable facts. Zero CCP state media are cited as evidence.
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Globe className="w-5 h-5 text-red-400" /> International Response</h2>

            {INTERNATIONAL_RESPONSES.map((r, i) => (
              <div key={i} className="bg-[#111820] border border-[#1c2a35] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Flag className="w-4 h-4 text-red-400" />
                  <h3 className="text-sm font-semibold text-white">{r.entity}</h3>
                </div>
                <p className="text-sm text-slate-300">{r.response}</p>
                {r.sourceUrl && (
                  <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 mt-2">
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><BookOpen className="w-5 h-5 text-red-400" /> Sources</h2>
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
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.tier === 1 ? 'bg-emerald-900/60 text-emerald-300' : 'bg-blue-900/60 text-blue-300'}`}>
                      Tier {s.tier}
                    </span>
                    <span className="text-sm text-white">{s.name}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
                </a>
              ))}
            </div>
            <div className="bg-red-900/20 border border-red-700/30 p-4 mt-4">
              <h3 className="text-sm font-semibold text-red-300 mb-1">Excluded Sources</h3>
              <p className="text-sm text-slate-400">
                Xinhua, People&#39;s Daily, CGTN, Global Times, China Daily, and all CCP-controlled media were deliberately excluded
                as sources. CCP state media coverage of the Hong Kong 47 case is referenced only as evidence of political framing, not as credible reporting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
