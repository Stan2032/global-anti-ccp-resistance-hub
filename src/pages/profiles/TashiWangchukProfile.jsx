import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlobalDisclaimer from '../../components/ui/GlobalDisclaimer';
import {
  User, Calendar, MapPin, Scale, AlertTriangle, ExternalLink,
  ChevronDown, ChevronUp, Globe, FileText, BookOpen, Clock,
  ArrowLeft, Shield, Newspaper, Flag, Heart, Book
} from 'lucide-react';

// ─── DATA ──────────────────────────────────────────────────────────
// All dates verified against NYT, BBC, HRW, Amnesty International,
// RFA, and other Tier 1/2 sources. Zero CCP state media cited.

const PROFILE = {
  name: 'Tashi Wangchuk',
  chineseName: '扎西文色',
  birthDate: '1985',
  birthPlace: 'Yushu, Qinghai Province (Kham region of Tibet)',
  nationality: 'Chinese (Tibetan)',
  status: 'RELEASED — UNDER SURVEILLANCE',
  currentLocation: 'Yushu, Qinghai Province, China',
  sentence: '5 years for "inciting separatism" (served full sentence, released January 2021)',
  occupation: 'Shopkeeper & Tibetan Language Rights Advocate',
};

const TIMELINE = [
  {
    date: '1985',
    year: '1985',
    title: 'Born in Yushu, Qinghai Province',
    detail: 'Born into a Tibetan family in Yushu Tibetan Autonomous Prefecture, Qinghai Province — part of the historically Tibetan region of Kham.',
    category: 'life',
  },
  {
    date: '2015',
    year: '2015',
    title: 'Traveled to Beijing to petition for Tibetan language rights',
    detail: 'Traveled from Yushu to Beijing to petition courts for the right of Tibetan children to be educated in their native language. He attempted to file a lawsuit arguing that local governments were failing to implement China\'s own laws protecting minority language education.',
    category: 'activism',
  },
  {
    date: '2015-11-28',
    year: '2015',
    title: 'New York Times published documentary',
    detail: 'The New York Times published a video documentary "A Tibetan\'s Journey for Justice" following Tashi Wangchuk\'s efforts to preserve Tibetan language education through legal channels. The documentary showed him peacefully petitioning for rights guaranteed under Chinese law.',
    category: 'international',
    sourceUrl: 'https://www.nytimes.com/2015/11/29/world/asia/china-tibet-language-education.html',
  },
  {
    date: '2016-01-27',
    year: '2016',
    title: 'Arrested by Chinese authorities',
    detail: 'Detained by police in Yushu, approximately two months after the NYT documentary was published. Initially held in a form of residential surveillance at a designated location (RSDL) — a form of secret detention.',
    category: 'persecution',
    sourceUrl: 'https://www.amnesty.org/en/documents/asa17/8256/2018/en/',
  },
  {
    date: '2016-03',
    year: '2016',
    title: 'Formally charged with "inciting separatism"',
    detail: 'Formally arrested and charged with "inciting separatism" under Article 103 of China\'s Criminal Law. The charge carried a maximum sentence of 15 years. His advocacy for Tibetan language education — conducted through legal channels — was reframed as an attempt to split the nation.',
    category: 'persecution',
    sourceUrl: 'https://www.hrw.org/news/2018/05/22/china-tibetan-language-advocate-faces-verdict',
  },
  {
    date: '2018-01-04',
    year: '2018',
    title: 'Trial at Yushu Intermediate People\'s Court',
    detail: 'Trial began at Yushu Intermediate People\'s Court. Lasted only half a day. Foreign diplomats and journalists were denied access to the courtroom.',
    category: 'persecution',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-42561363',
  },
  {
    date: '2018-05-22',
    year: '2018',
    title: 'Sentenced to 5 years in prison',
    detail: 'Convicted and sentenced to 5 years in prison for "inciting separatism." The conviction was based primarily on his appearance in the NYT documentary and his social media posts advocating for Tibetan language education. Human Rights Watch called the sentence "a gross injustice."',
    category: 'persecution',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-44213391',
  },
  {
    date: '2021-01-28',
    year: '2021',
    title: 'Released after serving full sentence',
    detail: 'Released from prison after serving his entire 5-year sentence. No time was reduced despite calls from international human rights organizations. Reports indicate he remains under surveillance and is restricted from traveling or speaking to foreign media.',
    category: 'life',
    sourceUrl: 'https://www.rfa.org/english/news/tibet/released-01282021172305.html',
  },
];

const CHARGES = [
  {
    charge: '"Inciting separatism" (煽动分裂国家罪)',
    law: 'Article 103, Criminal Law of the PRC',
    filed: 'March 2016',
    verdict: 'GUILTY — May 22, 2018',
    sentence: '5 years imprisonment',
    detail: 'Tashi Wangchuk was convicted of "inciting separatism" for advocating that Tibetan children should be able to learn in their native language. His evidence of "separatism" consisted of: appearing in a New York Times documentary, posting on social media about Tibetan language rights, and attempting to file a lawsuit in Beijing courts arguing that local governments were not implementing China\'s own Regional Ethnic Autonomy Law. At no point did he advocate independence or separatism — he explicitly called for implementation of existing Chinese law. Amnesty International declared him a prisoner of conscience.',
  },
];

const CCP_NARRATIVES = [
  {
    claim: '"Tashi Wangchuk incited separatism by colluding with foreign media"',
    reality: 'Tashi Wangchuk explicitly and repeatedly stated he was not seeking independence for Tibet. He advocated for implementation of China\'s own laws protecting minority language education — specifically the Regional Ethnic Autonomy Law. Speaking to a foreign newspaper is not a crime under international law, and his statements to the NYT did not advocate separatism. The CCP\'s definition of "separatism" has expanded to encompass any Tibetan who publicly discusses cultural erosion.',
    sourceUrl: 'https://www.nytimes.com/2015/11/29/world/asia/china-tibet-language-education.html',
  },
  {
    claim: '"Tibetan language education is fully protected in China"',
    reality: 'Despite constitutional and legal protections for minority languages, Chinese government policies have systematically reduced Tibetan-medium education. In 2010, major protests erupted across Tibetan areas of Qinghai province against plans to replace Tibetan with Mandarin as the language of instruction. Human Rights Watch has documented the progressive elimination of Tibetan-language schooling, with colonial boarding schools separating Tibetan children from their families and culture.',
    sourceUrl: 'https://www.hrw.org/report/2020/03/04/chinas-bilingual-education-policy-tibet',
  },
  {
    claim: '"The trial was conducted fairly and in accordance with Chinese law"',
    reality: 'The trial lasted only half a day. Foreign diplomats and journalists who traveled to the remote courthouse in Yushu were denied access. Tashi Wangchuk\'s lawyer reported that he was not given adequate time to prepare a defense. The conviction was based primarily on his exercise of free expression — speaking to media and posting on social media — rather than any act of violence or genuine separatist activity.',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-42561363',
  },
];

const INTERNATIONAL_RESPONSES = [
  {
    entity: 'United States',
    response: 'The US State Department called for Tashi Wangchuk\'s release and raised his case in annual human rights reports. Members of Congress cited his case as evidence of deteriorating human rights conditions for Tibetans in China.',
  },
  {
    entity: 'European Union',
    response: 'The EU raised Tashi Wangchuk\'s case in its human rights dialogues with China and called for his release.',
  },
  {
    entity: 'Amnesty International',
    response: 'Declared Tashi Wangchuk a prisoner of conscience — imprisoned solely for peacefully exercising his right to freedom of expression. Ran an Urgent Action campaign for his release.',
    sourceUrl: 'https://www.amnesty.org/en/documents/asa17/8256/2018/en/',
  },
  {
    entity: 'Human Rights Watch',
    response: 'Called the sentence "a gross injustice" and stated that "Tashi Wangchuk\'s only crime was to peacefully advocate for Tibetan language education." HRW China Director Sophie Richardson called it "a painful alarm about Beijing\'s tightening grip on Tibet."',
    sourceUrl: 'https://www.hrw.org/news/2018/05/22/china-tibetan-language-advocate-faces-verdict',
  },
  {
    entity: 'United Nations',
    response: 'UN human rights experts called for Tashi Wangchuk\'s release, noting that advocating for minority language rights is protected under international human rights law.',
  },
  {
    entity: 'PEN International',
    response: 'Named Tashi Wangchuk an honorary member, highlighting his case as an example of the criminalization of peaceful expression in China.',
  },
];

const SOURCES = [
  { name: 'New York Times — Documentary', url: 'https://www.nytimes.com/2015/11/29/world/asia/china-tibet-language-education.html', tier: 2 },
  { name: 'BBC — Trial coverage', url: 'https://www.bbc.com/news/world-asia-china-42561363', tier: 1 },
  { name: 'BBC — Sentencing', url: 'https://www.bbc.com/news/world-asia-china-44213391', tier: 1 },
  { name: 'Human Rights Watch', url: 'https://www.hrw.org/news/2018/05/22/china-tibetan-language-advocate-faces-verdict', tier: 1 },
  { name: 'Amnesty International', url: 'https://www.amnesty.org/en/documents/asa17/8256/2018/en/', tier: 1 },
  { name: 'Radio Free Asia — Release', url: 'https://www.rfa.org/english/news/tibet/released-01282021172305.html', tier: 2 },
  { name: 'HRW — Bilingual Education Report', url: 'https://www.hrw.org/report/2020/03/04/chinas-bilingual-education-policy-tibet', tier: 1 },
];

// ─── CATEGORY COLORS ───────────────────────────────────────────────
const CATEGORY_COLORS = {
  life: { bg: 'bg-[#111820]', text: 'text-slate-200', label: 'Personal' },
  activism: { bg: 'bg-cyan-900/60', text: 'text-cyan-200', label: 'Activism' },
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
            <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 mt-2">
              <ExternalLink className="w-3 h-3" /> Source
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────

export default function TashiWangchukProfile() {
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
    { id: 'charges', label: 'Charges & Significance', icon: Scale },
    { id: 'narratives', label: 'CCP Narratives', icon: AlertTriangle },
    { id: 'response', label: 'International Response', icon: Globe },
    { id: 'sources', label: 'Sources', icon: BookOpen },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <GlobalDisclaimer />

      {/* Back link */}
      <Link to="/profiles" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Profiles
      </Link>

      {/* ─── HEADER ─────────────────────────────────────────── */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-cyan-500 p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-cyan-900/60 border-2 border-cyan-600 flex items-center justify-center flex-shrink-0">
            <Book className="w-10 h-10 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{PROFILE.name}</h1>
              <span className="text-lg text-cyan-400">{PROFILE.chineseName}</span>
            </div>
            <p className="text-sm text-slate-400 mb-3">{PROFILE.occupation}</p>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-600 text-white">RELEASED — UNDER SURVEILLANCE</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-900/60 text-cyan-300 border border-cyan-700">
                TIBETAN LANGUAGE ADVOCATE
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#111820]/60 text-[#22d3ee] border border-[#1c2a35]">
                PRISONER OF CONSCIENCE
              </span>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-cyan-400 font-bold text-lg">5</div>
                <div className="text-slate-400 text-xs">Years imprisoned</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-cyan-400 font-bold text-lg">0</div>
                <div className="text-slate-400 text-xs">Acts of violence</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-cyan-400 font-bold text-lg">6M+</div>
                <div className="text-slate-400 text-xs">Tibetans affected</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-cyan-400 font-bold text-lg">½ day</div>
                <div className="text-slate-400 text-xs">Trial duration</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3 italic">
              Imprisoned for 5 years for advocating that Tibetan children should learn their own language — a right guaranteed under Chinese law.
            </p>
          </div>
        </div>
      </div>

      {/* ─── CONTEXT ────────────────────────────────────────── */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
        <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
          <Newspaper className="w-4 h-4" /> Tibetan Language Crisis
        </h3>
        <p className="text-sm text-slate-300 mb-3">
          The CCP has systematically replaced Tibetan-medium education with Mandarin instruction across
          Tibetan areas. Government-run colonial boarding schools now separate hundreds of thousands of
          Tibetan children from their families and culture. Tashi Wangchuk&#39;s case is emblematic: a man
          imprisoned for peacefully advocating that China follow its own laws on minority language education.
        </p>
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
              activeTab === id ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-[#111820]'
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
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Clock className="w-5 h-5 text-cyan-400" /> Timeline — {TIMELINE.length} Events</h2>
              <div className="flex gap-2">
                <button onClick={expandAll} className="text-xs text-cyan-400 hover:text-cyan-300">Expand all</button>
                <span className="text-slate-600">|</span>
                <button onClick={collapseAll} className="text-xs text-slate-400 hover:text-white">Collapse all</button>
              </div>
            </div>
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

        {/* CHARGES & SIGNIFICANCE */}
        {activeTab === 'charges' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Scale className="w-5 h-5 text-cyan-400" /> Charges &amp; Significance</h2>

            <div className="bg-cyan-900/20 border border-cyan-700/50 p-4">
              <h3 className="text-sm font-semibold text-cyan-300 mb-2">Why This Case Matters</h3>
              <p className="text-sm text-slate-300">
                Tashi Wangchuk&#39;s case is a stark demonstration that the CCP treats advocacy for minority cultural
                rights — even through legal channels — as a criminal act. He did not advocate independence, organize
                protests, or commit any act of violence. He attempted to use China&#39;s own legal system to protect
                Tibetan language education. For this, he was imprisoned for five years.
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-cyan-400" /> CCP Narrative Analysis</h2>
            <p className="text-sm text-slate-400">
              The CCP characterized Tashi Wangchuk&#39;s peaceful advocacy for Tibetan language education as
              &quot;inciting separatism.&quot; Each claim below is analyzed against independently verifiable facts.
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Globe className="w-5 h-5 text-cyan-400" /> International Response</h2>

            {INTERNATIONAL_RESPONSES.map((r, i) => (
              <div key={i} className="bg-[#111820] border border-[#1c2a35] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Flag className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-white">{r.entity}</h3>
                </div>
                <p className="text-sm text-slate-300">{r.response}</p>
                {r.sourceUrl && (
                  <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 mt-2">
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><BookOpen className="w-5 h-5 text-cyan-400" /> Sources</h2>
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
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </a>
              ))}
            </div>
            <div className="bg-red-900/20 border border-red-700/30 p-4 mt-4">
              <h3 className="text-sm font-semibold text-red-300 mb-1">Excluded Sources</h3>
              <p className="text-sm text-slate-400">
                Xinhua, People&#39;s Daily, CGTN, Global Times, China Daily, and all CCP-controlled media were deliberately excluded
                as sources. CCP state media coverage of this case is referenced only as evidence of the regime&#39;s narrative strategy, not as credible reporting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
