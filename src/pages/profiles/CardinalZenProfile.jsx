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
// All dates verified against BBC, Vatican News, Amnesty International,
// Reuters, and other Tier 1/2 sources. Zero CCP state media cited.

const PROFILE = {
  name: 'Cardinal Joseph Zen',
  chineseName: '陳日君',
  birthDate: 'January 13, 1932',
  birthPlace: 'Shanghai, China',
  nationality: 'Chinese (Hong Kong permanent resident)',
  status: 'AT RISK',
  currentLocation: 'Hong Kong',
  sentence: 'Fined HK$4,000 (approx US$512) in November 2022 for failing to register the 612 Humanitarian Relief Fund. Arrested May 11, 2022 under the NSL',
  occupation: 'Bishop Emeritus of Hong Kong, Cardinal of the Catholic Church',
};

const TIMELINE = [
  {
    date: '1932-01-13',
    year: '1932',
    title: 'Born in Shanghai, China',
    detail: 'Born in Shanghai, China, into a Catholic family.',
    category: 'life',
  },
  {
    date: '1948',
    year: '1948',
    title: 'Fled to Hong Kong',
    detail: 'Fled to Hong Kong ahead of the Communist revolution.',
    category: 'life',
  },
  {
    date: '1961',
    year: '1961',
    title: 'Ordained as a Salesian priest',
    detail: 'Ordained as a Salesian priest in Hong Kong.',
    category: 'religious',
  },
  {
    date: '1996',
    year: '1996–2000s',
    title: 'Teaching in mainland China seminaries',
    detail: 'Spent extended periods teaching in mainland China\'s seminaries, giving him firsthand experience of the CCP\'s restrictions on religious practice.',
    category: 'religious',
  },
  {
    date: '2002-09-23',
    year: '2002',
    title: 'Appointed Bishop of Hong Kong',
    detail: 'Appointed Bishop of Hong Kong by Pope John Paul II (installed 2003).',
    category: 'religious',
  },
  {
    date: '2006-02-22',
    year: '2006',
    title: 'Created Cardinal by Pope Benedict XVI',
    detail: 'Created Cardinal by Pope Benedict XVI — the second Chinese-born cardinal in history.',
    category: 'religious',
  },
  {
    date: '2009',
    year: '2009',
    title: 'Retired as Bishop of Hong Kong',
    detail: 'Retired as Bishop of Hong Kong. Continued to be outspoken on religious freedom and democracy.',
    category: 'life',
  },
  {
    date: '2014',
    year: '2014',
    title: 'Supported the Umbrella Movement',
    detail: 'Supported the Umbrella Movement, visiting protest sites and expressing solidarity with pro-democracy demonstrators.',
    category: 'international',
  },
  {
    date: '2019',
    year: '2019',
    title: 'Co-founded the 612 Humanitarian Relief Fund',
    detail: 'Co-founded the 612 Humanitarian Relief Fund to provide legal and medical aid to those arrested during the 2019 anti-extradition bill protests.',
    category: 'life',
  },
  {
    date: '2020-06-30',
    year: '2020',
    title: 'National Security Law imposed on Hong Kong',
    detail: 'National Security Law imposed on Hong Kong.',
    category: 'persecution',
  },
  {
    date: '2022-05-11',
    year: '2022',
    title: 'Arrested by National Security police',
    detail: 'Arrested by National Security police at age 90, alongside fellow fund trustees (including singer Denise Ho and barrister Margaret Ng), for "collusion with foreign forces."',
    category: 'persecution',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-61414162',
  },
  {
    date: '2022-11',
    year: '2022',
    title: 'Convicted under Societies Ordinance',
    detail: 'Convicted of failing to properly register the 612 Fund under the Societies Ordinance. Fined HK$4,000 (approx US$512). The NSL charge of "collusion with foreign forces" remains under review.',
    category: 'persecution',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-61414162',
  },
  {
    date: '2025-12',
    year: '2025',
    title: 'Appeal heard by Hong Kong appeals court',
    detail: 'Hong Kong appeals court heard appeal against the conviction. Case ongoing.',
    category: 'international',
    sourceUrl: 'https://www.pillarcatholic.com/p/hong-kong-court-hears-cardinal-zen',
  },
];

const CHARGES = [
  {
    charge: 'Failing to register a society (Societies Ordinance)',
    law: 'Societies Ordinance',
    filed: 'May 2022',
    verdict: 'GUILTY — November 2022',
    sentence: 'Fined HK$4,000 (approx US$512)',
    detail: 'Convicted alongside other trustees of the 612 Humanitarian Relief Fund for not properly registering the fund as a society. The fund had provided legal and medical assistance to protesters arrested during the 2019 anti-extradition bill demonstrations. While the fine was minimal, the conviction established the principle that providing humanitarian assistance to arrested protesters can be criminalized.',
  },
  {
    charge: '"Collusion with foreign forces" under the NSL',
    law: 'National Security Law',
    filed: 'Arrested May 11, 2022',
    verdict: 'Investigation status unclear',
    sentence: 'Not yet prosecuted under NSL',
    detail: 'Cardinal Zen was arrested by National Security police alongside other fund trustees. The arrest of a 90-year-old Cardinal — one of the most senior Catholic figures in Asia — sent shockwaves through the international community. While the immediate prosecution focused on the lesser Societies Ordinance charge, the NSL investigation has neither been formally dropped nor proceeded to trial.',
  },
];

const CCP_NARRATIVES = [
  {
    claim: '"Cardinal Zen was arrested for violating the Societies Ordinance, not for his religious or political views"',
    reality: 'The arrest was carried out by National Security police — not ordinary law enforcement — and the initial accusation was "collusion with foreign forces" under the NSL. The subsequent prosecution under the lesser Societies Ordinance charge appears to have been a strategic decision to avoid the international outcry that a full NSL prosecution of a 90-year-old Cardinal would generate. The message was clear: even the most prominent religious leaders are not immune.',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-61414162',
  },
  {
    claim: '"Hong Kong guarantees freedom of religion"',
    reality: 'While Hong Kong\'s Basic Law nominally protects religious freedom, the arrest of Cardinal Zen demonstrates that religious leaders who speak on political matters face prosecution. Cardinal Zen\'s "crime" was providing legal aid to arrested protesters — an act of charity entirely consistent with Catholic social teaching. The arrest has had a chilling effect on religious institutions in Hong Kong.',
    sourceUrl: 'https://www.vaticannews.va/en/church/news/2022-05/cardinal-zen-arrested-hong-kong-national-security-law.html',
  },
  {
    claim: '"The 612 Fund was an illegal organization funding criminal activities"',
    reality: 'The 612 Humanitarian Relief Fund provided legal representation and medical assistance to people arrested during protests — a function similar to bail funds and legal aid organizations worldwide. It was founded by respected civic leaders including a Cardinal, a former legislator, and a barrister. The fund operated openly and publicly. Criminalizing humanitarian legal assistance is a hallmark of authoritarian systems.',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2022/05/hong-kong-arrest-cardinal-zen/',
  },
];

const INTERNATIONAL_RESPONSES = [
  {
    entity: 'The Vatican / Holy See',
    response: 'Expressed that it had "learned with concern the news of the arrest of Cardinal Zen." The Vatican\'s response was notably restrained due to the ongoing Sino-Vatican agreement on bishop appointments. Vatican Secretary of State said the arrest should not be "over-interpreted."',
    sourceUrl: 'https://www.vaticannews.va/en/church/news/2022-05/cardinal-zen-arrested-hong-kong-national-security-law.html',
  },
  {
    entity: 'United States',
    response: 'State Department condemned the arrest. Congressional leaders expressed concern.',
  },
  {
    entity: 'United Kingdom',
    response: 'Expressed concern over the arrest of a 90-year-old cardinal and the broader implications for religious freedom.',
  },
  {
    entity: 'Amnesty International',
    response: 'Condemned the arrest as a "shocking attack on freedom of expression."',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2022/05/hong-kong-arrest-cardinal-zen/',
  },
  {
    entity: 'International Catholic community',
    response: 'Pope Francis did not publicly comment directly, reflecting the delicate balance of the Sino-Vatican agreement, but Catholic leaders worldwide expressed solidarity with Cardinal Zen.',
  },
];

const SOURCES = [
  { name: 'BBC (arrest)', url: 'https://www.bbc.com/news/world-asia-china-61414162', tier: 1 },
  { name: 'Vatican News', url: 'https://www.vaticannews.va/en/church/news/2022-05/cardinal-zen-arrested-hong-kong-national-security-law.html', tier: 1 },
  { name: 'Amnesty International', url: 'https://www.amnesty.org/en/latest/news/2022/05/hong-kong-arrest-cardinal-zen/', tier: 1 },
  { name: 'The Independent', url: 'https://www.independent.co.uk/news/world/asia/cardinal-zen-hong-kong-arrested-b2075168.html', tier: 2 },
  { name: 'Pillar Catholic', url: 'https://www.pillarcatholic.com/p/hong-kong-court-hears-cardinal-zen', tier: 2 },
  { name: 'America Magazine', url: 'https://www.americamagazine.org/politics-society/2022/05/11/cardinal-zen-arrested-hong-kong-242953', tier: 2 },
  { name: 'Reuters', url: 'https://www.reuters.com/world/china/hong-kong-cardinal-joseph-zen-arrested-2022-05-11/', tier: 1 },
];

// ─── CATEGORY COLORS ───────────────────────────────────────────────
const CATEGORY_COLORS = {
  life: { bg: 'bg-[#111820]', text: 'text-slate-200', label: 'Personal' },
  religious: { bg: 'bg-emerald-900/60', text: 'text-emerald-200', label: 'Religious' },
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
            <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 mt-2">
              <ExternalLink className="w-3 h-3" /> Source
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────

export default function CardinalZenProfile() {
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <GlobalDisclaimer />

      {/* Back link */}
      <Link to="/profiles" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Profiles
      </Link>

      {/* ─── HEADER ─────────────────────────────────────────── */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-amber-500 p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-amber-900/60 border-2 border-amber-600 flex items-center justify-center flex-shrink-0">
            <Heart className="w-10 h-10 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{PROFILE.name}</h1>
              <span className="text-lg text-amber-400">{PROFILE.chineseName}</span>
            </div>
            <p className="text-sm text-slate-400 mb-3">{PROFILE.occupation}</p>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white">AT RISK</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-900/60 text-purple-300 border border-purple-700">
                CARDINAL OF THE CATHOLIC CHURCH
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-900/60 text-red-300 border border-red-700">
                AGE 90 AT ARREST
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-[#111820] text-slate-300">
                Age {PROFILE.age}
              </span>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-amber-400 font-bold text-lg">90</div>
                <div className="text-slate-400 text-xs">Age at arrest</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-amber-400 font-bold text-lg">1000s</div>
                <div className="text-slate-400 text-xs">Fund beneficiaries</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-amber-400 font-bold text-lg">60+</div>
                <div className="text-slate-400 text-xs">Years of service</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-amber-400 font-bold text-lg">5</div>
                <div className="text-slate-400 text-xs">Fund trustees arrested</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3 italic">
              Convicted under the Societies Ordinance. NSL charge of &quot;collusion with foreign forces&quot; remains under review.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 612 FUND CONTEXT ────────────────────────────────── */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
        <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
          <Newspaper className="w-4 h-4" /> The 612 Humanitarian Relief Fund
        </h3>
        <p className="text-sm text-slate-300 mb-3">
          The 612 Humanitarian Relief Fund was established in 2019 to provide legal and medical assistance to
          individuals arrested during Hong Kong&#39;s anti-extradition bill protests. It was co-founded by Cardinal Zen
          alongside other prominent civic figures. The fund operated openly and publicly before being forced to
          disband under pressure from authorities.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-amber-400 font-semibold">Cardinal Joseph Zen</span> — Bishop Emeritus of Hong Kong. <span className="text-amber-300">Convicted, fined HK$4,000.</span>
          </div>
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-slate-300 font-semibold">Denise Ho</span> — Singer and activist. Co-trustee arrested alongside Cardinal Zen.
          </div>
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-slate-300 font-semibold">Margaret Ng</span> — Barrister and former legislator. Co-trustee arrested alongside Cardinal Zen.
          </div>
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-slate-300 font-semibold">Hui Po-keung &amp; Sze Ching-wee</span> — Academic and activist. Co-trustees also arrested.
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
              activeTab === id ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white hover:bg-[#111820]'
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
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Clock className="w-5 h-5 text-amber-400" /> Timeline — {TIMELINE.length} Events</h2>
              <div className="flex gap-2">
                <button onClick={expandAll} className="text-xs text-amber-400 hover:text-amber-300">Expand all</button>
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Scale className="w-5 h-5 text-amber-400" /> Charges &amp; Legal Status</h2>

            <div className="bg-amber-900/20 border border-amber-700/50 p-4">
              <h3 className="text-sm font-semibold text-amber-300 mb-2">Current Legal Situation</h3>
              <p className="text-sm text-slate-300">
                Cardinal Zen was convicted under the Societies Ordinance in November 2022 and fined HK$4,000.
                The more serious NSL charge of &quot;collusion with foreign forces&quot; has neither been formally dropped
                nor proceeded to trial. At age {calculateAge(PROFILE.birthDate)}, he remains in Hong Kong under ongoing legal jeopardy.
                An appeal against the conviction was heard in December 2025 and the case is ongoing.
              </p>
            </div>

            {CHARGES.map((c, i) => (
              <div key={i} className="bg-[#111820] border border-[#1c2a35] p-5">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-white">{c.charge}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                    c.verdict.startsWith('GUILTY') ? 'bg-red-900/60 text-red-300' : 'bg-[#111820] text-slate-300'
                  }`}>{c.verdict.startsWith('GUILTY') ? 'GUILTY' : 'UNDER REVIEW'}</span>
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-400" /> CCP Narrative Analysis</h2>
            <p className="text-sm text-slate-400">
              The prosecution of Cardinal Zen demonstrates the CCP&#39;s strategy of using lesser charges to avoid
              international backlash while still sending a chilling message. Each claim below is analyzed against
              independently verifiable facts. Zero CCP state media are cited as evidence.
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Globe className="w-5 h-5 text-amber-400" /> International Response</h2>

            {INTERNATIONAL_RESPONSES.map((r, i) => (
              <div key={i} className="bg-[#111820] border border-[#1c2a35] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Flag className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-white">{r.entity}</h3>
                </div>
                <p className="text-sm text-slate-300">{r.response}</p>
                {r.sourceUrl && (
                  <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 mt-2">
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><BookOpen className="w-5 h-5 text-amber-400" /> Sources</h2>
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
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </a>
              ))}
            </div>
            <div className="bg-red-900/20 border border-red-700/30 p-4 mt-4">
              <h3 className="text-sm font-semibold text-red-300 mb-1">Excluded Sources</h3>
              <p className="text-sm text-slate-400">
                Xinhua, People&#39;s Daily, CGTN, Global Times, China Daily, and all CCP-controlled media were deliberately excluded
                as sources. CCP state media coverage of the arrest and trial is referenced only as evidence of the regime&#39;s narrative strategy, not as credible reporting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
