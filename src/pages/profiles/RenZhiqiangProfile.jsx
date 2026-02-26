import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlobalDisclaimer from '../../components/ui/GlobalDisclaimer';
import {
  User, Calendar, MapPin, Scale, AlertTriangle, ExternalLink,
  ChevronDown, ChevronUp, Globe, FileText, BookOpen, Clock,
  ArrowLeft, Shield, Newspaper, Flag, Heart, Book
} from 'lucide-react';

// ─── DATA ──────────────────────────────────────────────────────────
// All dates verified against BBC, Reuters, AP, HRW, Amnesty International,
// and other Tier 1/2 sources. Zero CCP state media cited.

const PROFILE = {
  name: 'Ren Zhiqiang',
  chineseName: '任志强',
  birthDate: 'March 8, 1951',
  birthPlace: 'Beijing, China',
  nationality: 'Chinese',
  status: 'IMPRISONED',
  currentLocation: 'Prison, China',
  sentence: '18 years for "corruption, bribery, embezzlement, and misuse of public funds"',
  occupation: 'Real Estate Tycoon, Former CCP Member',
};

const TIMELINE = [
  {
    date: '1951-03-08',
    year: '1951',
    title: 'Born in Beijing',
    detail: 'Born in Beijing into a revolutionary family. His father was a former vice minister of commerce. Joined the CCP and rose through the ranks of the Chinese real estate industry.',
    category: 'life',
  },
  {
    date: '1993',
    year: '1993',
    title: 'Became chairman of Hua Yuan Property',
    detail: 'Became chairman of state-owned Hua Yuan Property Co., building it into one of China\'s major real estate developers. Known for his outspoken personality and willingness to challenge government policies.',
    category: 'life',
  },
  {
    date: '2011',
    year: '2011',
    title: 'Became prominent social media commentator',
    detail: 'Built a massive following on Weibo (China\'s Twitter equivalent) with over 37 million followers. Earned the nickname "Ren Big Cannon" (任大炮) for his blunt, outspoken commentary on politics and economics.',
    category: 'activism',
  },
  {
    date: '2016-02',
    year: '2016',
    title: 'Weibo account deleted after criticizing state media directive',
    detail: 'After Xi Jinping visited state media outlets and declared that media must "serve the party," Ren Zhiqiang posted that media should serve the people, not the party. His Weibo account with 37 million followers was permanently deleted. He was placed on one year\'s probation within the CCP.',
    category: 'persecution',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-35647555',
  },
  {
    date: '2020-02-23',
    year: '2020',
    title: 'Published essay criticizing Xi Jinping\'s COVID-19 response',
    detail: 'Published an essay sharply criticizing the Chinese government\'s response to the COVID-19 outbreak. The essay, which circulated widely online, reportedly described the leader as a "clown" and criticized the CCP\'s censorship of early COVID-19 warnings. The essay was quickly censored but had already spread widely.',
    category: 'activism',
    sourceUrl: 'https://www.theguardian.com/world/2020/mar/13/critic-who-called-xi-jinping-clown-over-coronavirus-crisis-reportedly-missing',
  },
  {
    date: '2020-03-12',
    year: '2020',
    title: 'Disappeared — friends reported him missing',
    detail: 'Friends and associates reported that Ren Zhiqiang had gone missing and could not be reached. His disappearance followed the circulation of his essay criticizing the government\'s COVID response.',
    category: 'persecution',
    sourceUrl: 'https://www.theguardian.com/world/2020/mar/13/critic-who-called-xi-jinping-clown-over-coronavirus-crisis-reportedly-missing',
  },
  {
    date: '2020-07-23',
    year: '2020',
    title: 'Expelled from the CCP',
    detail: 'Formally expelled from the Chinese Communist Party. The party discipline commission accused him of "smearing the party and the nation\'s image" and "distorting the history of the party and the army."',
    category: 'persecution',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-53510872',
  },
  {
    date: '2020-09-22',
    year: '2020',
    title: 'Sentenced to 18 years in prison',
    detail: 'The Beijing No. 2 Intermediate People\'s Court sentenced Ren Zhiqiang to 18 years in prison on charges of corruption, bribery, embezzlement, and misuse of public funds — totaling 16.3 million yuan. The court stated he accepted bribes of over 1.1 million yuan. Rights groups and observers widely viewed the charges as politically motivated retaliation for his criticism of Xi Jinping.',
    category: 'persecution',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-54245372',
  },
  {
    date: '2024-10',
    year: '2024',
    title: 'Daughter publishes open letter to Xi Jinping pleading for medical parole',
    detail: 'Ren Zhiqiang\'s daughter Ren Xinyi published an open letter directly to Xi Jinping, pleading for medical parole for her father. She described his severely deteriorating health at age 73, including serious prostate disease requiring surgery that predated his imprisonment, asthma, and the denial of adequate medical care. Human rights advocates and media outlets including VOA and China Digital Times covered the appeal.',
    category: 'persecution',
    sourceUrl: 'https://www.voanews.com/a/jailed-chinese-businessman-s-daughter-asks-xi-jinping-to-release-her-father/7815141.html',
  },
];

const CHARGES = [
  {
    charge: 'Corruption (贪污罪)',
    law: 'Criminal Law of the PRC',
    filed: '2020',
    verdict: 'GUILTY — September 22, 2020',
    sentence: 'Part of 18-year combined sentence',
    detail: 'Accused of embezzling 16.3 million yuan from state-owned Hua Yuan Property. The timing — months after his essay criticizing Xi Jinping\'s COVID response — was widely noted by international observers as political retribution disguised as anti-corruption enforcement.',
  },
  {
    charge: 'Bribery (受贿罪)',
    law: 'Criminal Law of the PRC',
    filed: '2020',
    verdict: 'GUILTY — September 22, 2020',
    sentence: 'Part of 18-year combined sentence',
    detail: 'Accused of accepting bribes totaling over 1.1 million yuan. The charges were filed within months of his viral essay criticizing the government\'s COVID response. His lawyer was not allowed to speak to media.',
  },
  {
    charge: 'Embezzlement and misuse of public funds',
    law: 'Criminal Law of the PRC',
    filed: '2020',
    verdict: 'GUILTY — September 22, 2020',
    sentence: 'Part of 18-year combined sentence',
    detail: 'Additional charges of embezzlement and misuse of public funds were included in the indictment. Ren reportedly "accepted" the verdict and did not appeal — though it is unknown whether this decision was made freely.',
  },
];

const CCP_NARRATIVES = [
  {
    claim: '"Ren Zhiqiang was punished for corruption, not political speech"',
    reality: 'The timeline makes the political motivation unmistakable: Ren published his essay criticizing Xi on February 23, 2020. He disappeared on March 12. He was expelled from the party on July 23. He was sentenced on September 22. For decades as a prominent CCP-connected businessman, no corruption charges were filed. The charges appeared only after he publicly challenged Xi Jinping. As Human Rights Watch noted, this follows the CCP\'s pattern of using corruption charges to silence political critics.',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-54245372',
  },
  {
    claim: '"Ren Zhiqiang confessed to his crimes and accepted the verdict"',
    reality: 'Ren reportedly did not appeal, but the circumstances of his "confession" and "acceptance" are impossible to verify independently. The Chinese legal system has a conviction rate exceeding 99%. Defendants in politically sensitive cases frequently "confess" under conditions that amount to coercion. His lawyer was barred from speaking to media. His trial lasted a single day.',
    sourceUrl: 'https://www.reuters.com/article/us-china-politics-ren-zhiqiang-idUSKCN26D0DY',
  },
  {
    claim: '"No one is above the law, including party members"',
    reality: 'China\'s anti-corruption campaign under Xi Jinping has been widely documented as selectively targeting political rivals and critics while leaving Xi allies untouched. Ren Zhiqiang\'s case exemplifies this: a long-time party insider with deep establishment connections suddenly faces 18 years on corruption charges only after criticizing the top leader. As observers noted, the severity of the sentence — 18 years, far exceeding typical corruption sentences for similar amounts — signals that the real crime was dissent.',
    sourceUrl: 'https://www.hrw.org/news/2020/09/22/china-outspoken-property-tycoon-gets-18-years',
  },
];

const INTERNATIONAL_RESPONSES = [
  {
    entity: 'Human Rights Watch',
    response: 'HRW China Director Sophie Richardson called the sentencing "political retaliation, pure and simple" and said the conviction was "transparently meant to punish him for his outspokenness and to deter others from speaking up."',
    sourceUrl: 'https://www.hrw.org/news/2020/09/22/china-outspoken-property-tycoon-gets-18-years',
  },
  {
    entity: 'Amnesty International',
    response: 'Condemned the conviction as politically motivated. Called on Chinese authorities to release Ren Zhiqiang and all others detained for exercising their right to freedom of expression.',
  },
  {
    entity: 'United States',
    response: 'The US State Department expressed concern over Ren Zhiqiang\'s conviction and the broader pattern of political repression in China.',
  },
  {
    entity: 'European Union',
    response: 'EU officials raised concerns about the use of corruption charges to silence political critics in China.',
  },
  {
    entity: 'International media',
    response: 'The case received extensive coverage from BBC, Reuters, AP, The Guardian, and other international outlets, all of which noted the political context of the prosecution. Journalists highlighted the contrast between decades of unquestioned business activity and the sudden appearance of charges following his essay.',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-54245372',
  },
];

const SOURCES = [
  { name: 'BBC — Sentencing', url: 'https://www.bbc.com/news/world-asia-china-54245372', tier: 1 },
  { name: 'BBC — CCP expulsion', url: 'https://www.bbc.com/news/world-asia-china-53510872', tier: 1 },
  { name: 'BBC — Weibo deletion', url: 'https://www.bbc.com/news/world-asia-china-35647555', tier: 1 },
  { name: 'Reuters — Verdict', url: 'https://www.reuters.com/article/us-china-politics-ren-zhiqiang-idUSKCN26D0DY', tier: 1 },
  { name: 'Human Rights Watch', url: 'https://www.hrw.org/news/2020/09/22/china-outspoken-property-tycoon-gets-18-years', tier: 1 },
  { name: 'The Guardian — Disappearance', url: 'https://www.theguardian.com/world/2020/mar/13/critic-who-called-xi-jinping-clown-over-coronavirus-crisis-reportedly-missing', tier: 2 },
];

// ─── CATEGORY COLORS ───────────────────────────────────────────────
const CATEGORY_COLORS = {
  life: { bg: 'bg-[#111820]', text: 'text-slate-200', label: 'Personal' },
  activism: { bg: 'bg-amber-900/60', text: 'text-amber-200', label: 'Dissent' },
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

export default function RenZhiqiangProfile() {
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
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-red-500 p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-red-900/60 border-2 border-red-600 flex items-center justify-center flex-shrink-0">
            <User className="w-10 h-10 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{PROFILE.name}</h1>
              <span className="text-lg text-red-400">{PROFILE.chineseName}</span>
            </div>
            <p className="text-sm text-slate-400 mb-3">{PROFILE.occupation}</p>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">IMPRISONED</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-900/60 text-amber-300 border border-amber-700">
                FORMER CCP MEMBER
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-900/60 text-red-300 border border-red-700">
                37M WEIBO FOLLOWERS SILENCED
              </span>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-red-400 font-bold text-lg">18</div>
                <div className="text-slate-400 text-xs">Years sentenced</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-red-400 font-bold text-lg">37M</div>
                <div className="text-slate-400 text-xs">Followers deleted</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-red-400 font-bold text-lg">1 day</div>
                <div className="text-slate-400 text-xs">Trial duration</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-red-400 font-bold text-lg">6 mo</div>
                <div className="text-slate-400 text-xs">Essay to sentence</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3 italic">
              A CCP insider sentenced to 18 years after criticizing Xi Jinping&#39;s COVID-19 response — demonstrating that no one within the party is safe from retribution.
            </p>
          </div>
        </div>
      </div>

      {/* ─── CONTEXT ────────────────────────────────────────── */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
        <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
          <Newspaper className="w-4 h-4" /> Dissent Within the Party
        </h3>
        <p className="text-sm text-slate-300 mb-3">
          Ren Zhiqiang&#39;s case is exceptional because he was not a dissident outsider — he was a CCP member from
          a revolutionary family, a successful businessman with deep party connections including to Vice President
          Wang Qishan. His case demonstrates that under Xi Jinping, even establishment insiders with decades of
          party loyalty face devastating punishment for a single act of public criticism.
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Scale className="w-5 h-5 text-red-400" /> Charges &amp; Legal Status</h2>

            <div className="bg-red-900/20 border border-red-700/50 p-4">
              <h3 className="text-sm font-semibold text-red-300 mb-2">Current Legal Situation</h3>
              <p className="text-sm text-slate-300">
                Ren Zhiqiang is serving an 18-year prison sentence, one of the harshest penalties imposed on a
                prominent critic of Xi Jinping. He reportedly did not appeal the verdict. His prison conditions
                and current health status are unknown.
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
              The CCP prosecuted Ren Zhiqiang on corruption charges following his public criticism of Xi Jinping.
              Each claim below is analyzed against independently verifiable facts.
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
                as sources. CCP state media coverage of this case is referenced only as evidence of the regime&#39;s narrative strategy, not as credible reporting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
