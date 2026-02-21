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
// All dates verified against BBC, Reuters, HKFP, Amnesty International,
// and Human Rights Watch. CCP narrative rebuttals sourced from independent media.

const PROFILE = {
  name: 'Nathan Law',
  chineseName: '羅冠聰',
  birthDate: 'July 13, 1993',
  birthPlace: 'Shenzhen, China (raised in Hong Kong)',
  nationality: 'Chinese (Hong Kong permanent resident) — passport cancelled by Hong Kong authorities',
  status: 'EXILED',
  currentLocation: 'London, UK (exile since July 2020)',
  sentence: 'Wanted under the National Security Law; HK$1 million bounty offered July 2023',
  occupation: 'Pro-Democracy Activist, Former Legislator, Co-founder of Demosistō',
};

const TIMELINE = [
  {
    date: '1993-07-13',
    year: '1993',
    title: 'Born in Shenzhen, China; raised in Hong Kong',
    detail: 'Born in Shenzhen, China. Grew up in Hong Kong, where he would later become a prominent student leader and pro-democracy activist.',
    category: 'life',
  },
  {
    date: '2014',
    year: '2014',
    title: 'Active participant in the Umbrella Movement',
    detail: 'Active participant in the Umbrella Movement as a student leader at Lingnan University. Served as Secretary-General of the Hong Kong Federation of Students, playing a key role in the pro-democracy protests that occupied major roads in Hong Kong for 79 days.',
    category: 'activism',
  },
  {
    date: '2016-04',
    year: '2016',
    title: 'Co-founded Demosistō',
    detail: 'Co-founded Demosistō with Joshua Wong and Agnes Chow. The party advocated for self-determination for Hong Kong through democratic means and became a leading voice for the city\'s younger generation of pro-democracy activists.',
    category: 'activism',
  },
  {
    date: '2016-09-04',
    year: '2016',
    title: 'Elected to Hong Kong Legislative Council at age 23',
    detail: 'Elected to the Hong Kong Legislative Council at age 23, becoming the youngest legislator in Hong Kong history. Won over 50,000 votes, reflecting broad public support for the pro-democracy movement among young Hong Kongers.',
    category: 'activism',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-53262898',
  },
  {
    date: '2017-07-14',
    year: '2017',
    title: 'Disqualified from the Legislative Council',
    detail: 'Disqualified from the Legislative Council by Hong Kong\'s High Court for allegedly improper oath-taking. The court ruled he did not take his oath "solemnly" because he raised his voice and added a phrase. Six pro-democracy legislators were disqualified in total as part of a broader campaign to purge pro-democracy voices from Hong Kong\'s institutions.',
    category: 'persecution',
    sourceUrl: 'https://hongkongfp.com/2017/07/14/breaking-hong-kong-lawmakers-nathan-law-disqualified-court/',
  },
  {
    date: '2018-01-17',
    year: '2018',
    title: 'Sentenced to 8 months imprisonment',
    detail: 'Sentenced to 8 months imprisonment (reduced from conviction on appeal) for his role in the 2014 civic square occupation. Served approximately 4 months. The original community service sentence was increased to imprisonment on appeal by the government.',
    category: 'persecution',
  },
  {
    date: '2020-06-30',
    year: '2020',
    title: 'National Security Law imposed; Demosistō disbanded',
    detail: 'The National Security Law was imposed on Hong Kong by Beijing, criminalizing secession, subversion, terrorism, and collusion with foreign forces. Demosistō disbanded the same day, recognizing the impossibility of continuing political work under the new law.',
    category: 'persecution',
  },
  {
    date: '2020-07-02',
    year: '2020',
    title: 'Fled Hong Kong for London',
    detail: 'Fled Hong Kong for London. Announced his departure publicly, citing the impossibility of continuing political work under the National Security Law. His departure came just two days after the NSL was imposed.',
    category: 'persecution',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-53262898',
  },
  {
    date: '2020-07-31',
    year: '2020',
    title: 'Arrest warrant issued under the NSL',
    detail: 'Hong Kong police issued an arrest warrant for Nathan Law under the National Security Law for "inciting secession" and "colluding with foreign forces." These charges carry a maximum penalty of life imprisonment.',
    category: 'persecution',
  },
  {
    date: '2021-04',
    year: '2021',
    title: 'Granted political asylum in the United Kingdom',
    detail: 'Granted political asylum in the United Kingdom, providing him with legal protection from extradition and affirming the political nature of his persecution.',
    category: 'international',
  },
  {
    date: '2023-07-03',
    year: '2023',
    title: 'HK$1 million bounty offered for his arrest',
    detail: 'Hong Kong authorities offered a HK$1 million bounty for his arrest, alongside seven other overseas activists. The bounty was condemned internationally as an attempt to intimidate diaspora communities and extend authoritarian reach beyond China\'s borders.',
    category: 'persecution',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-66088192',
  },
  {
    date: '2023',
    year: '2023',
    title: 'Passport cancelled by Hong Kong authorities',
    detail: 'Hong Kong cancelled his passport, effectively rendering him stateless. This move demonstrated the punitive reach of the authorities against exiled activists.',
    category: 'persecution',
  },
  {
    date: '2025-09',
    year: '2025',
    title: 'Denied entry to Singapore, deported to the US',
    detail: 'Denied entry to Singapore and deported to the United States. The incident demonstrates the extraterritorial reach of CCP pressure on foreign governments to act against Hong Kong pro-democracy activists.',
    category: 'international',
    sourceUrl: 'https://www.bbc.com/news/articles/c8rv1r11y30o',
  },
];

const CHARGES = [
  {
    charge: '"Inciting secession" and "Colluding with foreign forces" under the National Security Law',
    law: 'Hong Kong National Security Law',
    filed: 'Arrest warrant issued July 31, 2020',
    verdict: 'NEVER TRIED — in exile',
    sentence: 'Maximum penalty: life imprisonment',
    detail: 'Accused under the National Security Law for his pro-democracy advocacy and international lobbying. These charges carry a maximum penalty of life imprisonment. Nathan Law\'s "crimes" include testifying before the US Congress, meeting with foreign politicians, and advocating for sanctions against officials responsible for eroding Hong Kong\'s freedoms.',
  },
  {
    charge: '"Unlawful assembly" (civic square occupation, 2014)',
    law: 'Hong Kong Public Order Ordinance',
    filed: '2014',
    verdict: 'GUILTY — sentenced January 2018',
    sentence: '8 months imprisonment (served approximately 4 months)',
    detail: 'Convicted alongside Joshua Wong and Alex Chow for their roles in the September 2014 civic square occupation that preceded the Umbrella Movement. The original community service sentence was increased to imprisonment on appeal by the government.',
  },
];

const CCP_NARRATIVES = [
  {
    claim: '"Nathan Law is a fugitive from justice who fled to escape prosecution"',
    reality: 'Nathan Law left Hong Kong one day after the NSL was imposed — a law that was drafted in secret in Beijing, with no input from Hong Kong\'s legislature, and which made his peaceful political advocacy a potential life sentence. His departure was an act of self-preservation, not an admission of guilt. He continues to advocate openly for Hong Kong\'s democratic rights from exile.',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-53262898',
  },
  {
    claim: '"The bounty is a normal law enforcement measure"',
    reality: 'Offering HK$1 million bounties for overseas activists — including those living in the UK and US under political asylum — is an extraordinary measure that has been condemned internationally. It represents the CCP\'s attempt to extend its authoritarian reach beyond its borders and intimidate diaspora communities. The bounties target people whose "crimes" consist of speaking publicly about Hong Kong\'s deteriorating freedoms.',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-66088192',
  },
  {
    claim: '"His disqualification from LegCo was a legal matter, not political"',
    reality: 'Nathan Law was elected with over 50,000 votes. His disqualification for allegedly not taking his oath "solemnly enough" was part of a broader campaign to purge pro-democracy legislators from Hong Kong\'s institutions. Six pro-democracy legislators were disqualified in total. The courts were used as instruments of political exclusion.',
    sourceUrl: 'https://hongkongfp.com/2017/07/14/breaking-hong-kong-lawmakers-nathan-law-disqualified-court/',
  },
];

const INTERNATIONAL_RESPONSES = [
  {
    entity: 'United Kingdom',
    response: 'Granted Nathan Law political asylum in 2021. The UK has condemned the bounty as an attempt to "intimidate and silence those who stand up for freedom."',
    sourceUrl: 'https://www.gov.uk/government/news/hong-kong-bounty-uk-response',
  },
  {
    entity: 'United States',
    response: 'Congressional leaders have met with Nathan Law and condemned the warrants. He has testified before Congress multiple times, advocating for sanctions and policy responses to the erosion of Hong Kong\'s autonomy.',
  },
  {
    entity: 'European Parliament',
    response: 'Has invited Nathan Law to testify and condemned the extraterritorial application of the National Security Law.',
  },
  {
    entity: 'Amnesty International',
    response: 'Condemned his persecution and the bounty. Called the NSL charges against him politically motivated.',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2023/07/hong-kong-bounties-overseas-activists/',
  },
  {
    entity: 'Human Rights Watch',
    response: 'Documented the pattern of transnational repression represented by the bounty system targeting overseas Hong Kong activists.',
    sourceUrl: 'https://www.hrw.org/news/2023/07/03/hong-kong-bounties-overseas-activists',
  },
];

const SOURCES = [
  { name: 'BBC (departure)', url: 'https://www.bbc.com/news/world-asia-china-53262898', tier: 1 },
  { name: 'BBC (bounty)', url: 'https://www.bbc.com/news/world-asia-china-66088192', tier: 1 },
  { name: 'BBC (Singapore)', url: 'https://www.bbc.com/news/articles/c8rv1r11y30o', tier: 1 },
  { name: 'HKFP (disqualification)', url: 'https://hongkongfp.com/2017/07/14/breaking-hong-kong-lawmakers-nathan-law-disqualified-court/', tier: 2 },
  { name: 'Reuters (departure)', url: 'https://www.reuters.com/article/us-hongkong-security-law-idUSKBN2432HC', tier: 1 },
  { name: 'Human Rights Watch', url: 'https://www.hrw.org/news/2023/07/03/hong-kong-bounties-overseas-activists', tier: 1 },
  { name: 'Amnesty International', url: 'https://www.amnesty.org/en/latest/news/2023/07/hong-kong-bounties-overseas-activists/', tier: 1 },
];

// ─── CATEGORY COLORS ───────────────────────────────────────────────
const CATEGORY_COLORS = {
  life: { bg: 'bg-[#111820]', text: 'text-slate-200', label: 'Personal' },
  activism: { bg: 'bg-yellow-900/60', text: 'text-yellow-200', label: 'Activism' },
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

export default function NathanLawProfile() {
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

  const daysInExile = Math.floor((new Date() - new Date('2020-07-02')) / (1000 * 60 * 60 * 24));

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
            <Globe className="w-10 h-10 text-yellow-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{PROFILE.name}</h1>
              <span className="text-lg text-yellow-400">{PROFILE.chineseName}</span>
            </div>
            <p className="text-sm text-slate-400 mb-3">{PROFILE.occupation}</p>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500 text-white animate-pulse">EXILED</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-900/60 text-red-300 border border-red-700">
                HK$1M BOUNTY
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                YOUNGEST LEGISLATOR
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
                <div className="text-yellow-400 font-bold text-lg">50,000+</div>
                <div className="text-slate-400 text-xs">Votes received</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-yellow-400 font-bold text-lg">HK$1M</div>
                <div className="text-slate-400 text-xs">Bounty</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-yellow-400 font-bold text-lg">23</div>
                <div className="text-slate-400 text-xs">Age at election</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3 italic">
              Wanted under the National Security Law. Granted political asylum in the UK. Passport cancelled by Hong Kong authorities.
            </p>
          </div>
        </div>
      </div>

      {/* ─── THE YOUNGEST LEGISLATOR CONTEXT ─────────────────── */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
        <h3 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
          <Newspaper className="w-4 h-4" /> The Youngest Legislator
        </h3>
        <p className="text-sm text-slate-300 mb-3">
          In September 2016, Nathan Law was elected to the Hong Kong Legislative Council at the age of 23, becoming the 
          youngest legislator in Hong Kong history. He won over 50,000 votes on a platform of self-determination for 
          Hong Kong. Less than a year later, he was disqualified by the courts for allegedly not taking his oath 
          &quot;solemnly&quot; — part of a broader campaign that removed six pro-democracy legislators from office. 
          His meteoric rise and forced removal illustrate both the strength of Hong Kong&apos;s democratic aspirations 
          and the lengths to which authorities will go to suppress them.
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

            <div className="bg-red-900/20 border border-red-700/50 p-4">
              <h3 className="text-sm font-semibold text-red-300 mb-2">Current Legal Situation</h3>
              <p className="text-sm text-slate-300">
                Nathan Law is wanted under the Hong Kong National Security Law for &quot;inciting secession&quot; and 
                &quot;colluding with foreign forces.&quot; These charges carry a maximum penalty of <strong className="text-yellow-400">life imprisonment</strong>. 
                A HK$1 million bounty has been offered for his arrest. He has been granted political asylum in the 
                United Kingdom and continues his advocacy from exile in London.
              </p>
            </div>

            {CHARGES.map((c, i) => (
              <div key={i} className="bg-[#111820] border border-[#1c2a35] p-5">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-white">{c.charge}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                    c.verdict.startsWith('GUILTY') ? 'bg-red-900/60 text-red-300' : 'bg-yellow-900/60 text-yellow-300'
                  }`}>{c.verdict.startsWith('GUILTY') ? 'GUILTY' : 'IN EXILE — NEVER TRIED'}</span>
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-400" /> CCP Narrative Analysis</h2>
            <p className="text-sm text-slate-400">
              The CCP has constructed a narrative around Nathan Law that frames political exile as criminal flight 
              and peaceful advocacy as national security threats. Each claim below is analyzed against independently 
              verifiable facts. Zero CCP state media are cited as evidence.
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
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.tier === 1 ? 'bg-emerald-900/60 text-emerald-300' : 'bg-blue-900/60 text-blue-300'}`}>
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
                as sources. CCP state media coverage of Nathan Law is referenced only as evidence of the propaganda narrative, not as credible reporting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
