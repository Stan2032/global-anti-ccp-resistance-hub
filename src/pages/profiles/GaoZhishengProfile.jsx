import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlobalDisclaimer from '../../components/ui/GlobalDisclaimer';
import {
  User, Calendar, MapPin, Scale, AlertTriangle, ExternalLink,
  ChevronDown, ChevronUp, Globe, FileText, BookOpen, Clock,
  ArrowLeft, Shield, Newspaper, Flag, Heart, Book
} from 'lucide-react';

// ─── DATA ──────────────────────────────────────────────────────────
// All dates verified against Amnesty International, NCHRD, Tom Lantos
// Human Rights Commission, ChinaAid, HRW, and BBC.
// CCP narrative rebuttals sourced from independent media, not CCP state outlets.

const PROFILE = {
  name: 'Gao Zhisheng',
  chineseName: '高智晟',
  birthDate: 'April 20, 1966',
  birthPlace: 'Shaanxi Province, China',
  nationality: 'Chinese',
  status: 'DISAPPEARED',
  currentLocation: 'Unknown — last seen August 13, 2017, in Shaanxi Province',
  sentence: '3 years suspended sentence (2006), revoked and served 2011-2014. Disappeared since August 2017.',
  age: 59,
  occupation: 'Human Rights Lawyer — named one of China\'s top 10 lawyers by the Ministry of Justice in 2001',
};

const TIMELINE = [
  {
    date: '1966-04-20',
    year: '1966',
    title: 'Born in Shaanxi Province, China',
    detail: 'Born in Shaanxi Province, China, into a family of extreme poverty.',
    category: 'life',
  },
  {
    date: '1990s',
    year: '1990s',
    title: 'Self-taught law and established legal practice',
    detail: 'Self-taught law, passed the bar exam, and established a legal practice in Beijing.',
    category: 'legal_work',
  },
  {
    date: '2001',
    year: '2001',
    title: 'Named one of China\'s top 10 lawyers',
    detail: 'Named one of China\'s top 10 lawyers by the Ministry of Justice for his pro bono work defending farmers and the disabled.',
    category: 'legal_work',
  },
  {
    date: '2004',
    year: '2004',
    title: 'Began representing persecuted religious groups',
    detail: 'Began representing Falun Gong practitioners and underground Christians facing persecution, drawing CCP attention.',
    category: 'legal_work',
  },
  {
    date: '2005-12',
    year: '2005',
    title: 'Published open letters documenting torture',
    detail: 'Published open letters to the Chinese leadership documenting torture and persecution of Falun Gong practitioners and calling for an end to the crackdown.',
    category: 'legal_work',
    sourceUrl: 'https://www.chinaaid.org/search/label/Gao%20Zhisheng',
  },
  {
    date: '2006-08-15',
    year: '2006',
    title: 'Detained — law license revoked',
    detail: 'Detained by police. His law license was revoked and his firm was shut down.',
    category: 'persecution',
  },
  {
    date: '2006-12-22',
    year: '2006',
    title: 'Convicted of "inciting subversion of state power"',
    detail: 'Convicted of "inciting subversion of state power" and sentenced to 3 years imprisonment, suspended for 5 years. The suspended sentence was widely seen as a tool to control him.',
    category: 'persecution',
  },
  {
    date: '2007-2010',
    year: '2007–2010',
    title: 'Enforced disappearances and torture',
    detail: 'Subjected to repeated enforced disappearances, torture, and house arrest despite the suspended sentence. Documented severe torture including electric shocks, beatings, and sleep deprivation in his memoir "Unwavering Convictions."',
    category: 'persecution',
    sourceUrl: 'https://www.amnesty.org/en/documents/asa17/9497/2019/en/',
  },
  {
    date: '2009-02',
    year: '2009',
    title: 'Disappeared for over a year',
    detail: 'Disappeared for over a year. Later described being held in secret detention and tortured.',
    category: 'persecution',
  },
  {
    date: '2011-12',
    year: '2011',
    title: 'Sent to Shaya Prison in Xinjiang',
    detail: 'Suspended sentence revoked. Sent to Shaya Prison in Xinjiang to serve the original 3-year term.',
    category: 'persecution',
    sourceUrl: 'https://www.nchrd.org/2017/08/gao-zhisheng/',
  },
  {
    date: '2014-08-07',
    year: '2014',
    title: 'Released from Shaya Prison',
    detail: 'Released from Shaya Prison after completing his sentence. Returned to Shaanxi Province under heavy surveillance.',
    category: 'life',
  },
  {
    date: '2014-2017',
    year: '2014–2017',
    title: 'Constant police surveillance in Shaanxi',
    detail: 'Lived under constant police surveillance in his home village in Shaanxi. Allowed almost no contact with the outside world. His wife, Geng He, and children had fled to the United States in 2009.',
    category: 'persecution',
  },
  {
    date: '2017-08-13',
    year: '2017',
    title: 'Last seen — disappeared from home',
    detail: 'Last seen by his family. Disappeared from his home in Shaanxi Province. Chinese authorities have refused to disclose his whereabouts or confirm he is alive.',
    category: 'persecution',
    sourceUrl: 'https://humanrightscommission.house.gov/DFP/Countries/China/Gao-Zhisheng',
  },
  {
    date: '2025-08',
    year: '2025',
    title: 'UN Special Rapporteur calls for disclosure',
    detail: 'UN Special Rapporteur called on the Chinese government to disclose his whereabouts. As of 2026, his location, health, and whether he is alive remain unknown.',
    category: 'international',
  },
];

const CHARGES = [
  {
    charge: 'Inciting subversion of state power',
    law: 'Chinese Criminal Law',
    filed: '2006',
    verdict: 'GUILTY — December 22, 2006',
    sentence: '3 years (suspended 5 years, later revoked)',
    detail: 'Convicted for his open letters to CCP leadership documenting persecution of Falun Gong practitioners, underground Christians, and other marginalized groups. His "subversion" consisted entirely of legal advocacy — using the Chinese legal system to defend persecuted clients and writing open letters calling for the rule of law. The suspended sentence was used as a tool of ongoing control, eventually revoked in 2011 to imprison him in remote Xinjiang.',
  },
];

const CCP_NARRATIVES = [
  {
    claim: '"Gao Zhisheng was lawfully convicted and served his sentence"',
    reality: 'Gao was convicted for practicing law — specifically, for defending Falun Gong practitioners and writing open letters. His 3-year suspended sentence was used as a mechanism for years of extrajudicial control: enforced disappearances, torture, and house arrest outside any legal framework. When the suspension was revoked in 2011, he was sent to the most remote prison possible (Shaya, Xinjiang) to isolate him.',
    sourceUrl: 'https://www.nchrd.org/2017/08/gao-zhisheng/',
  },
  {
    claim: '"His whereabouts are a private family matter"',
    reality: 'Gao Zhisheng has been missing since August 13, 2017. His wife Geng He, who fled to the United States with their children in 2009, has had no contact with him. Chinese authorities have refused all requests for information from his family, the UN, and foreign governments. The UN Working Group on Enforced or Involuntary Disappearances has taken up his case. This is a textbook enforced disappearance.',
    sourceUrl: 'https://humanrightscommission.house.gov/DFP/Countries/China/Gao-Zhisheng',
  },
  {
    claim: '"China has an independent judiciary that protects citizens\' rights"',
    reality: 'Gao Zhisheng\'s case demonstrates the Chinese legal system being used as a weapon against a lawyer. He was first honored by the Ministry of Justice (2001), then punished for using the legal skills they praised (2006), tortured in secret detention (2007-2010), imprisoned in remote Xinjiang (2011-2014), and finally disappeared (2017). No independent court has reviewed his disappearance.',
    sourceUrl: 'https://www.amnesty.org/en/documents/asa17/9497/2019/en/',
  },
];

const INTERNATIONAL_RESPONSES = [
  {
    entity: 'US Congressional-Executive Commission on China (CECC) / Tom Lantos Human Rights Commission',
    response: 'Repeatedly called for information on Gao\'s whereabouts. Listed him as a political prisoner.',
    sourceUrl: 'https://humanrightscommission.house.gov/DFP/Countries/China/Gao-Zhisheng',
  },
  {
    entity: 'Amnesty International',
    response: 'Designated him a prisoner of conscience. Documented his torture. Called for his release or proof of life.',
    sourceUrl: 'https://www.amnesty.org/en/documents/asa17/9497/2019/en/',
  },
  {
    entity: 'USCIRF (US Commission on International Religious Freedom)',
    response: 'Named Gao as a victim of religious freedom violations. Recommended sanctions.',
  },
  {
    entity: 'Lawyers for Lawyers',
    response: 'Advocacy organization tracking his case. Called for urgent action on his disappearance.',
  },
  {
    entity: 'ChinaAid',
    response: 'Christian human rights organization providing ongoing documentation of his case.',
    sourceUrl: 'https://www.chinaaid.org/search/label/Gao%20Zhisheng',
  },
  {
    entity: 'UN Working Group on Enforced Disappearances',
    response: 'Took up his case after his 2017 disappearance.',
  },
];

const SOURCES = [
  { name: 'Tom Lantos Human Rights Commission', url: 'https://humanrightscommission.house.gov/DFP/Countries/China/Gao-Zhisheng', tier: 1 },
  { name: 'Amnesty International', url: 'https://www.amnesty.org/en/documents/asa17/9497/2019/en/', tier: 1 },
  { name: 'NCHRD (Network of Chinese Human Rights Defenders)', url: 'https://www.nchrd.org/2017/08/gao-zhisheng/', tier: 2 },
  { name: 'Front Line Defenders', url: 'https://www.frontlinedefenders.org/en/case/gao-zhisheng', tier: 2 },
  { name: 'ChinaAid', url: 'https://www.chinaaid.org/search/label/Gao%20Zhisheng', tier: 2 },
  { name: 'BBC', url: 'https://www.bbc.com/news/world-asia-china-41504057', tier: 1 },
  { name: 'Human Rights Watch', url: 'https://www.hrw.org/news/2017/09/14/china-free-missing-rights-lawyer', tier: 1 },
];

// ─── CATEGORY COLORS ───────────────────────────────────────────────
const CATEGORY_COLORS = {
  life: { bg: 'bg-slate-700', text: 'text-slate-200', label: 'Personal' },
  legal_work: { bg: 'bg-emerald-900/60', text: 'text-emerald-200', label: 'Legal Work' },
  persecution: { bg: 'bg-red-900/60', text: 'text-red-200', label: 'Persecution' },
  international: { bg: 'bg-blue-900/60', text: 'text-blue-200', label: 'International' },
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
            <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 mt-2">
              <ExternalLink className="w-3 h-3" /> Source
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────

export default function GaoZhishengProfile() {
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
    { id: 'charges', label: 'Charges & Legal History', icon: Scale },
    { id: 'narratives', label: 'CCP Narratives', icon: AlertTriangle },
    { id: 'response', label: 'International Response', icon: Globe },
    { id: 'sources', label: 'Sources', icon: BookOpen },
  ];

  const daysMissing = Math.floor((new Date() - new Date('2017-08-13')) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <GlobalDisclaimer />

      {/* Back link */}
      <Link to="/profiles" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Profiles
      </Link>

      {/* ─── HEADER ─────────────────────────────────────────── */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-purple-500 p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-purple-900/60 border-2 border-purple-600 flex items-center justify-center flex-shrink-0">
            <Scale className="w-10 h-10 text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{PROFILE.name}</h1>
              <span className="text-lg text-purple-400">{PROFILE.chineseName}</span>
            </div>
            <p className="text-sm text-slate-400 mb-3">{PROFILE.occupation}</p>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white animate-pulse">DISAPPEARED</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                MINISTRY OF JUSTICE TOP 10 LAWYER (2001)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-900/60 text-red-300 border border-red-700">
                ENFORCED DISAPPEARANCE
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-slate-700 text-slate-300">
                Age {PROFILE.age}
              </span>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-purple-400 font-bold text-lg">{daysMissing.toLocaleString()}+</div>
                <div className="text-slate-400 text-xs">Days missing</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-purple-400 font-bold text-lg">20+</div>
                <div className="text-slate-400 text-xs">Years of persecution (2005–present)</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-purple-400 font-bold text-lg">2009</div>
                <div className="text-slate-400 text-xs">Family in exile</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-purple-400 font-bold text-lg">3</div>
                <div className="text-slate-400 text-xs">Open letters published</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3 italic">
              Last seen August 13, 2017. Chinese authorities refuse to disclose his whereabouts or confirm he is alive.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 709 CRACKDOWN CONTEXT ─────────────────────────── */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
        <h3 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
          <Newspaper className="w-4 h-4" /> The 709 Crackdown Context
        </h3>
        <p className="text-sm text-slate-300 mb-3">
          On July 9, 2015, Chinese authorities launched an unprecedented crackdown on human rights lawyers and
          activists, detaining and interrogating over 300 people across China. Though Gao Zhisheng&#39;s persecution
          predates the 709 Crackdown by nearly a decade, he is widely recognized as a precursor to the systematic
          targeting of rights lawyers. His case demonstrated the CCP&#39;s playbook — disbarment, detention, torture,
          forced confessions, and enforced disappearance — that would later be applied on a mass scale during 709.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-purple-400 font-semibold">Gao Zhisheng</span> — Persecution began 2005. Disappeared August 2017. <span className="text-purple-300">Status unknown.</span>
          </div>
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-slate-300 font-semibold">709 Crackdown</span> — July 9, 2015. Over 300 lawyers and activists targeted. Many still detained or under surveillance.
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
              activeTab === id ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white hover:bg-[#111820]'
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
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Clock className="w-5 h-5 text-purple-400" /> Timeline — {TIMELINE.length} Events</h2>
              <div className="flex gap-2">
                <button onClick={expandAll} className="text-xs text-purple-400 hover:text-purple-300">Expand all</button>
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

        {/* CHARGES & LEGAL HISTORY */}
        {activeTab === 'charges' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Scale className="w-5 h-5 text-purple-400" /> Charges & Legal History</h2>

            <div className="bg-purple-900/20 border border-purple-700/50 p-4">
              <h3 className="text-sm font-semibold text-purple-300 mb-2">Current Legal Situation</h3>
              <p className="text-sm text-slate-300">
                Gao Zhisheng completed his 3-year prison sentence in August 2014 but has been missing since
                <strong className="text-purple-400"> August 13, 2017</strong>. He is not known to be facing any current
                charges. His disappearance is extrajudicial — Chinese authorities have provided no legal basis
                for his detention and refuse to confirm whether he is alive.
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

            {/* Family section */}
            <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
              <h3 className="text-sm font-semibold text-purple-400 mb-2">Geng He — Wife and Advocate</h3>
              <p className="text-sm text-slate-300">
                Geng He, Gao Zhisheng&#39;s wife, fled China with their two children in 2009 and resettled in the
                United States. She has become a tireless advocate for his release, testifying before the US Congress
                and engaging with international human rights organizations. She has had no confirmed contact with
                her husband since his disappearance in August 2017.
              </p>
            </div>
          </div>
        )}

        {/* CCP NARRATIVE ANALYSIS */}
        {activeTab === 'narratives' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-purple-400" /> CCP Narrative Analysis</h2>
            <p className="text-sm text-slate-400">
              Gao Zhisheng&#39;s case reveals the CCP&#39;s systematic use of the legal system as a weapon against its own
              lawyers. A man honored by the Ministry of Justice was subsequently convicted, tortured, and disappeared
              for doing the same work they praised. Each claim below is analyzed against independently verifiable facts.
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Globe className="w-5 h-5 text-purple-400" /> International Response</h2>

            {/* Responses */}
            {INTERNATIONAL_RESPONSES.map((r, i) => (
              <div key={i} className="bg-[#111820] border border-[#1c2a35] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Flag className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-semibold text-white">{r.entity}</h3>
                </div>
                <p className="text-sm text-slate-300">{r.response}</p>
                {r.sourceUrl && (
                  <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 mt-2">
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><BookOpen className="w-5 h-5 text-purple-400" /> Sources</h2>
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
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                </a>
              ))}
            </div>
            <div className="bg-red-900/20 border border-red-700/30 p-4 mt-4">
              <h3 className="text-sm font-semibold text-red-300 mb-1">Excluded Sources</h3>
              <p className="text-sm text-slate-400">
                Xinhua, People&#39;s Daily, CGTN, Global Times, China Daily, and all CCP-controlled media were deliberately excluded
                as sources. Any references to state media narratives are included only to document CCP propaganda claims for rebuttal.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
