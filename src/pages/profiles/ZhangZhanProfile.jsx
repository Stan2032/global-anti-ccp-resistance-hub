import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlobalDisclaimer from '../../components/ui/GlobalDisclaimer';
import {
  User, Calendar, MapPin, Scale, AlertTriangle, ExternalLink,
  ChevronDown, ChevronUp, Globe, FileText, BookOpen, Clock,
  ArrowLeft, Shield, Newspaper, Flag, Heart, Book
} from 'lucide-react';

// ─── DATA ──────────────────────────────────────────────────────────
// All dates verified against CPJ, Amnesty International, OHCHR, BBC, RSF, NCHRD, and HKFP.
// CCP narrative rebuttals sourced from independent media, not CCP state outlets.

const PROFILE = {
  name: 'Zhang Zhan',
  chineseName: '张展',
  birthDate: 'September 1, 1983',
  birthPlace: 'Shaanxi Province, China',
  nationality: 'Chinese',
  status: 'IMPRISONED',
  currentLocation: 'Prison, Shanghai, China',
  sentence: '4 years (first, Dec 2020) + 4 years (second, Sep 2025) for "picking quarrels and provoking trouble"',
  age: 42,
  occupation: 'Citizen Journalist, Former Lawyer',
};

const TIMELINE = [
  {
    date: '1983-09-01',
    year: '1983',
    title: 'Born in Shaanxi Province',
    detail: 'Born in Shaanxi Province, China.',
    category: 'life',
  },
  {
    date: '2010s',
    year: '2010s',
    title: 'Practiced as a lawyer in Shanghai',
    detail: 'Practiced as a lawyer in Shanghai before being disbarred for her activism and outspoken views on human rights issues.',
    category: 'life',
  },
  {
    date: '2020-02',
    year: '2020',
    title: 'Traveled to Wuhan to report on COVID-19',
    detail: 'Traveled to Wuhan to independently report on the COVID-19 outbreak, streaming and writing from hospitals, quarantine centers, and residential areas. Her citizen journalism documented conditions that contradicted official CCP narratives about the outbreak\'s severity and the government\'s response.',
    category: 'journalism',
  },
  {
    date: '2020-05-14',
    year: '2020',
    title: 'Detained by Shanghai police',
    detail: 'Detained by Shanghai police after returning from Wuhan. Charged with "picking quarrels and provoking trouble" (寻衅滋事罪) — one of the most widely abused charges in the Chinese criminal justice system.',
    category: 'persecution',
  },
  {
    date: '2020-06',
    year: '2020',
    title: 'Began hunger strike in detention',
    detail: 'Began hunger strike in detention, protesting her imprisonment. This marked the beginning of a pattern of hunger strikes that would severely compromise her health over subsequent years.',
    category: 'persecution',
  },
  {
    date: '2020-09',
    year: '2020',
    title: 'Reports of forced feeding emerged',
    detail: 'Reports emerged of forced feeding via nasal tube. Family was denied access. Her health began deteriorating rapidly due to the hunger strike and forcible feeding.',
    category: 'persecution',
  },
  {
    date: '2020-12-28',
    year: '2020',
    title: 'Sentenced to 4 years by Shanghai court',
    detail: 'Sentenced to 4 years by Shanghai Pudong New Area People\'s Court for "picking quarrels and provoking trouble" for her citizen journalism reporting from Wuhan during the COVID-19 outbreak.',
    category: 'persecution',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-55463241',
  },
  {
    date: '2021-2023',
    year: '2021–2023',
    title: 'Health continued to deteriorate in prison',
    detail: 'Health continued to deteriorate during imprisonment. Multiple reports of severe malnutrition from hunger strikes. Family reported she was "on the verge of death" multiple times. CPJ and Amnesty International repeatedly called for her immediate release on humanitarian grounds.',
    category: 'persecution',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2025/09/china-journalist-zhang-zhan-sentenced-to-prison-again-on-baseless-charges/',
  },
  {
    date: '2024-05-13',
    year: '2024',
    title: 'Released after completing 4-year sentence',
    detail: 'Released from prison after completing her 4-year sentence. Her release was confirmed by Amnesty International and NCHRD.',
    category: 'life',
    sourceUrl: 'https://www.nchrd.org/2024/05/zhang-zhan-released-after-four-years-in-prison/',
  },
  {
    date: '2024-08',
    year: '2024',
    title: 'Re-arrested shortly after release',
    detail: 'Re-arrested shortly after release. Specific charges were initially unclear, but the timing — just months after completing her first sentence for the same journalism — made clear this was a continuation of persecution.',
    category: 'persecution',
    sourceUrl: 'https://cpj.org/2025/09/cpj-urges-china-to-release-journalist-zhang-zhan-as-she-faces-second-trial/',
  },
  {
    date: '2024-10',
    year: '2024',
    title: 'Family reported forced-feeding tube observed',
    detail: 'Family reported forced-feeding tube observed during a visit, confirming that Zhang Zhan had resumed her hunger strike in protest of her re-imprisonment.',
    category: 'persecution',
  },
  {
    date: '2025-09',
    year: '2025',
    title: 'Sentenced to a second 4-year term',
    detail: 'Sentenced to a second 4-year term by Shanghai Pudong New Area People\'s Court for "picking quarrels and provoking trouble." The OHCHR called the second sentencing "deeply disturbing." The repeated use of the same vague charge demonstrates the CCP\'s pattern of using broad criminal statutes to silence persistent critics.',
    category: 'persecution',
    sourceUrl: 'https://www.ohchr.org/en/press-releases/2025/09/china-second-sentencing-zhang-zhan-deeply-disturbing',
  },
  {
    date: '2025',
    year: '2025',
    title: 'Remains imprisoned — health critically deteriorating',
    detail: 'Remains imprisoned. Health status critically deteriorating. International organizations continue to demand her immediate and unconditional release.',
    category: 'persecution',
  },
];

const CHARGES = [
  {
    charge: 'Picking quarrels and provoking trouble (寻衅滋事罪)',
    law: 'Chinese Criminal Law',
    filed: 'May 2020',
    verdict: 'GUILTY — December 28, 2020',
    sentence: '4 years imprisonment',
    detail: 'Convicted for her citizen journalism reporting from Wuhan during the COVID-19 outbreak. Her reporting included livestreams from hospitals, crematoriums, and quarantine centers that contradicted official CCP narratives about the outbreak\'s severity and the government\'s response.',
  },
  {
    charge: 'Picking quarrels and provoking trouble (寻衅滋事罪)',
    law: 'Chinese Criminal Law',
    filed: 'August 2024',
    verdict: 'GUILTY — September 2025',
    sentence: '4 years imprisonment',
    detail: 'Re-arrested shortly after completing her first sentence. The OHCHR called the second sentencing "deeply disturbing." The repeated use of the same vague charge demonstrates the CCP\'s pattern of using broad criminal statutes to silence persistent critics.',
  },
];

const CCP_NARRATIVES = [
  {
    claim: '"Zhang Zhan spread false information about COVID-19"',
    reality: 'Zhang Zhan\'s reporting from Wuhan documented conditions that have since been confirmed by multiple independent investigations. She filmed overcrowded hospitals, empty streets, and desperate residents — footage that contradicted the CCP\'s claim that everything was under control. No specific false claim has ever been identified in her reporting.',
    sourceUrl: 'https://cpj.org/data/people/zhang-zhan/',
  },
  {
    claim: '"She was lawfully convicted for picking quarrels and provoking trouble"',
    reality: '"Picking quarrels and provoking trouble" (寻衅滋事罪) is one of the most widely abused charges in the Chinese criminal justice system. It is routinely used against journalists, activists, and human rights defenders to criminalize speech and peaceful dissent. The UN OHCHR has specifically criticized this charge as incompatible with international human rights standards.',
    sourceUrl: 'https://www.ohchr.org/en/press-releases/2025/09/china-second-sentencing-zhang-zhan-deeply-disturbing',
  },
  {
    claim: '"Her health is being properly managed in detention"',
    reality: 'Zhang Zhan has been on prolonged hunger strikes protesting her imprisonment. Multiple credible reports document severe malnutrition, forced feeding through nasal tubes, and weight loss to dangerously low levels. Her family reported she was "on the verge of death" multiple times. CPJ and Amnesty International have repeatedly called for her immediate release on humanitarian grounds.',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2025/09/china-journalist-zhang-zhan-sentenced-to-prison-again-on-baseless-charges/',
  },
  {
    claim: '"Her second arrest was unrelated to her journalism"',
    reality: 'She was re-arrested just months after completing her first sentence for the same journalism. The timing and identical charge make clear this is a continuation of persecution for her COVID-19 reporting. The pattern of sequential sentences for the same vague charge is a documented CCP tactic to keep persistent critics permanently imprisoned.',
    sourceUrl: 'https://cpj.org/2025/09/cpj-urges-china-to-release-journalist-zhang-zhan-as-she-faces-second-trial/',
  },
];

const INTERNATIONAL_RESPONSES = [
  {
    entity: 'UN OHCHR',
    response: 'Called second sentencing "deeply disturbing." Called for her immediate release.',
    sourceUrl: 'https://www.ohchr.org/en/press-releases/2025/09/china-second-sentencing-zhang-zhan-deeply-disturbing',
  },
  {
    entity: 'Amnesty International',
    response: 'Designated her a prisoner of conscience. Called both sentences "baseless." Demanded immediate and unconditional release.',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2025/09/china-journalist-zhang-zhan-sentenced-to-prison-again-on-baseless-charges/',
  },
  {
    entity: 'CPJ (Committee to Protect Journalists)',
    response: 'Repeatedly called for her release, documented her deteriorating health.',
    sourceUrl: 'https://cpj.org/2025/09/cpj-urges-china-to-release-journalist-zhang-zhan-as-she-faces-second-trial/',
  },
  {
    entity: 'RSF (Reporters Without Borders)',
    response: 'Tracked her case since 2020. Named her in annual press freedom reports.',
    sourceUrl: 'https://rsf.org/en/zhang-zhan',
  },
  {
    entity: 'European Union',
    response: 'Condemned her re-arrest and second sentencing as a violation of press freedom.',
  },
  {
    entity: 'United States',
    response: 'State Department condemned both sentences and called for her release.',
  },
];

const SOURCES = [
  { name: 'OHCHR', url: 'https://www.ohchr.org/en/press-releases/2025/09/china-second-sentencing-zhang-zhan-deeply-disturbing', tier: 1 },
  { name: 'Amnesty International', url: 'https://www.amnesty.org/en/latest/news/2025/09/china-journalist-zhang-zhan-sentenced-to-prison-again-on-baseless-charges/', tier: 1 },
  { name: 'CPJ', url: 'https://cpj.org/2025/09/cpj-urges-china-to-release-journalist-zhang-zhan-as-she-faces-second-trial/', tier: 1 },
  { name: 'CPJ Profile', url: 'https://cpj.org/data/people/zhang-zhan/', tier: 1 },
  { name: 'BBC', url: 'https://www.bbc.com/news/world-asia-china-55463241', tier: 1 },
  { name: 'RSF (Reporters Without Borders)', url: 'https://rsf.org/en/zhang-zhan', tier: 1 },
  { name: 'NCHRD (Network of Chinese Human Rights Defenders)', url: 'https://www.nchrd.org/2024/05/zhang-zhan-released-after-four-years-in-prison/', tier: 2 },
  { name: 'Hong Kong Free Press (HKFP)', url: 'https://hongkongfp.com/2024/05/13/chinese-citizen-journalist-zhang-zhan-released-after-4-years-in-jail-for-covid-reporting/', tier: 2 },
];

// ─── CATEGORY COLORS ───────────────────────────────────────────────
const CATEGORY_COLORS = {
  life: { bg: 'bg-[#111820]', text: 'text-slate-200', label: 'Personal' },
  journalism: { bg: 'bg-[#0a0e14]/60', text: 'text-slate-200', label: 'Journalism' },
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
            <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300 mt-2">
              <ExternalLink className="w-3 h-3" /> Source
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────

export default function ZhangZhanProfile() {
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

  const daysDetained = Math.floor((new Date() - new Date('2020-05-14')) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <GlobalDisclaimer />

      {/* Back link */}
      <Link to="/profiles" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Profiles
      </Link>

      {/* ─── HEADER ─────────────────────────────────────────── */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-slate-500 p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-[#0a0e14]/60 border-2 border-[#1c2a35] flex items-center justify-center flex-shrink-0">
            <Newspaper className="w-10 h-10 text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{PROFILE.name}</h1>
              <span className="text-lg text-slate-400">{PROFILE.chineseName}</span>
            </div>
            <p className="text-sm text-slate-400 mb-3">{PROFILE.occupation}</p>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">IMPRISONED</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-900/60 text-orange-300 border border-orange-700">
                PRISONER OF CONSCIENCE
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-900/60 text-blue-300 border border-blue-700">
                COVID-19 JOURNALIST
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-[#111820] text-slate-300">
                Age {PROFILE.age}
              </span>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-slate-400 font-bold text-lg">{daysDetained.toLocaleString()}+</div>
                <div className="text-slate-400 text-xs">Days detained</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-slate-400 font-bold text-lg">2</div>
                <div className="text-slate-400 text-xs">Sentences served</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-slate-400 font-bold text-lg">Multiple</div>
                <div className="text-slate-400 text-xs">Hunger strikes</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-slate-400 font-bold text-lg">6+</div>
                <div className="text-slate-400 text-xs">Countries condemning</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3 italic">
              Sentenced twice for the same vague charge. Currently serving a second 4-year term.
            </p>
          </div>
        </div>
      </div>

      {/* ─── COVID-19 CITIZEN JOURNALISM CONTEXT ─────────────── */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
        <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
          <Newspaper className="w-4 h-4" /> COVID-19 Citizen Journalism
        </h3>
        <p className="text-sm text-slate-300 mb-3">
          Zhang Zhan traveled to Wuhan in February 2020 at the height of the COVID-19 outbreak to independently 
          document what was happening on the ground. Her citizen journalism — livestreams from hospitals, crematoriums, 
          quarantine centers, and residential areas — provided a raw, unfiltered view that contradicted the CCP&#39;s 
          carefully controlled narrative. Her reporting mattered because it was among the earliest independent 
          documentation of the outbreak&#39;s true severity, at a time when Chinese authorities were actively suppressing 
          information and silencing whistleblowers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-slate-300 font-semibold">Hospitals</span> — Filmed overcrowded conditions and overwhelmed medical staff
          </div>
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-slate-300 font-semibold">Quarantine Centers</span> — Documented conditions inside government-run facilities
          </div>
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-slate-300 font-semibold">Residential Areas</span> — Showed empty streets and desperate residents under lockdown
          </div>
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-slate-300 font-semibold">Crematoriums</span> — Provided evidence suggesting death tolls far exceeded official counts
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
              activeTab === id ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white hover:bg-[#111820]'
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
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Clock className="w-5 h-5 text-slate-400" /> Timeline — {TIMELINE.length} Events</h2>
              <div className="flex gap-2">
                <button onClick={expandAll} className="text-xs text-slate-400 hover:text-slate-300">Expand all</button>
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Scale className="w-5 h-5 text-slate-400" /> Charges & Verdict</h2>

            <div className="bg-red-900/20 border border-red-700/50 p-4">
              <h3 className="text-sm font-semibold text-red-300 mb-2">Current Legal Situation</h3>
              <p className="text-sm text-slate-300">
                Zhang Zhan is serving a second 4-year sentence imposed in September 2025 for the same charge 
                as her first conviction. The pattern of sequential sentences for the same vague charge — &quot;picking 
                quarrels and provoking trouble&quot; — is a documented CCP tactic to keep persistent critics 
                permanently imprisoned. Her health remains critically deteriorated from prolonged hunger strikes.
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

            {/* Vague charge context */}
            <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
              <h3 className="text-sm font-semibold text-slate-400 mb-2">&quot;Picking Quarrels and Provoking Trouble&quot; — A Tool of Repression</h3>
              <p className="text-sm text-slate-300">
                The charge of &quot;picking quarrels and provoking trouble&quot; (寻衅滋事罪) is one of the most 
                frequently abused provisions in the Chinese criminal code. It carries a maximum sentence of 5 years 
                and is routinely used to criminalize journalism, activism, and peaceful dissent. The vagueness of the 
                charge gives prosecutors virtually unlimited discretion. Zhang Zhan&#39;s case — sentenced twice under 
                the same charge for the same reporting — exemplifies how this law is weaponized against those who 
                challenge CCP narratives.
              </p>
            </div>
          </div>
        )}

        {/* CCP NARRATIVE ANALYSIS */}
        {activeTab === 'narratives' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-slate-400" /> CCP Narrative Analysis</h2>
            <p className="text-sm text-slate-400">
              Zhang Zhan&#39;s case illustrates the CCP&#39;s systematic suppression of independent reporting on COVID-19. 
              Each claim below is analyzed against independently verifiable facts. Zero CCP state media are cited as evidence.
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Globe className="w-5 h-5 text-slate-400" /> International Response</h2>

            {/* Recognition */}
            <div className="bg-[#0a0e14]/20 border border-[#1c2a35]/30 p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Recognition</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { year: '2020', award: 'Prisoner of Conscience designation', org: 'Amnesty International' },
                  { year: '2021', award: 'Press Freedom Award nominee', org: 'Reporters Without Borders' },
                ].map((a, i) => (
                  <div key={i} className="bg-[#111820]/50 p-3 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0a0e14]/60 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{a.award}</div>
                      <div className="text-xs text-slate-400">{a.org} &bull; {a.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Responses */}
            {INTERNATIONAL_RESPONSES.map((r, i) => (
              <div key={i} className="bg-[#111820] border border-[#1c2a35] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Flag className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-semibold text-white">{r.entity}</h3>
                </div>
                <p className="text-sm text-slate-300">{r.response}</p>
                {r.sourceUrl && (
                  <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300 mt-2">
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><BookOpen className="w-5 h-5 text-slate-400" /> Sources</h2>
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
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-slate-400 transition-colors" />
                </a>
              ))}
            </div>
            <div className="bg-red-900/20 border border-red-700/30 p-4 mt-4">
              <h3 className="text-sm font-semibold text-red-300 mb-1">Excluded Sources</h3>
              <p className="text-sm text-slate-400">
                Xinhua, People&#39;s Daily, CGTN, Global Times, China Daily, and all CCP-controlled media were deliberately excluded 
                as sources. CCP state media coverage of Zhang Zhan&#39;s case is referenced only as evidence of state propaganda, not as credible reporting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
