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
// All dates verified against Amnesty International, Safeguard Defenders, NCHRD,
// HRW, RSF, Fortify Rights, and Free Gui Minhai campaign.
// CCP narrative rebuttals sourced from independent media, not CCP state outlets.

const PROFILE = {
  name: 'Gui Minhai',
  chineseName: '桂民海',
  birthDate: 'May 5, 1964',
  birthPlace: 'Ningbo, Zhejiang, China',
  nationality: 'Swedish (naturalized 1996; China claims he "voluntarily" renounced it)',
  status: 'IMPRISONED',
  currentLocation: 'Unknown — Chinese authorities refuse to disclose',
  sentence: '10 years for "illegally providing intelligence to foreign countries"',
  sentenceEnd: 'February 2030',
  occupation: 'Publisher, Writer, Bookseller — Co-owner of Mighty Current Media & Causeway Bay Books',
};

const TIMELINE = [
  {
    date: '1964-05-05',
    year: '1964',
    title: 'Born in Ningbo, Zhejiang, China',
    detail: 'Born in Ningbo. Later studied history at Peking University (graduated 1985), then worked as an editor at the People\'s Education Press until 1988.',
    category: 'life',
  },
  {
    date: '1988',
    year: '1988',
    title: 'Emigrated to Sweden',
    detail: 'Left China for Sweden to pursue postgraduate studies at the University of Gothenburg. After the Tiananmen Square massacre in 1989, decided to stay permanently. Became a naturalized Swedish citizen in 1996, formally renouncing Chinese citizenship as required by Swedish law.',
    category: 'life',
  },
  {
    date: '2000s',
    year: '2000s',
    title: 'Founded publishing business in Hong Kong',
    detail: 'Co-founded Mighty Current Media (巨流傳媒) in Hong Kong, which published political gossip books about CCP leaders — a genre popular with mainland Chinese tourists visiting Hong Kong. The bookshop, Causeway Bay Books (銅鑼灣書店), became a well-known destination for banned political literature.',
    category: 'business',
  },
  {
    date: '2015-10-17',
    year: '2015',
    title: 'Abducted from Thailand by Chinese agents',
    detail: 'Disappeared from his holiday apartment in Pattaya, Thailand. Chinese security agents orchestrated the abduction — Thai immigration records show no legal departure. This marked the beginning of the "Causeway Bay Books disappearances" and one of the most brazen examples of CCP cross-border kidnapping.',
    category: 'persecution',
    sourceUrl: 'https://safeguarddefenders.com/en/blog/10-years-gui-minhais-kidnapping',
  },
  {
    date: '2015-10-15',
    year: '2015',
    title: 'Lui Bo disappears from Shenzhen',
    detail: 'Gui\'s colleague Lui Bo (呂波), general manager of Mighty Current, disappeared from Shenzhen. He was the first of four additional Causeway Bay Books associates to vanish in October–December 2015.',
    category: 'persecution',
  },
  {
    date: '2015-12-30',
    year: '2015',
    title: 'Lee Bo abducted from Hong Kong',
    detail: 'Lee Bo (李波), a British citizen and Causeway Bay Books shareholder, disappeared from Hong Kong — the most alarming case because it demonstrated CCP agents operating inside Hong Kong territory. All five booksellers were eventually found in mainland Chinese custody.',
    category: 'persecution',
    sourceUrl: 'https://www.hrw.org/news/2016/10/17/china-release-abducted-swedish-bookseller',
  },
  {
    date: '2016-01-17',
    year: '2016',
    title: 'Forced confession broadcast on Chinese state TV',
    detail: 'Appeared on CCTV in a scripted "confession," claiming he had voluntarily returned to China to face a drunk-driving charge from 2003 in which a woman was killed. He also claimed to have voluntarily surrendered his Swedish passport. The confession bore hallmarks of coercion: he appeared to read from a script, used CCP-standard phrasing, and his daughter Angela said the statements contradicted everything she knew about his views.',
    category: 'persecution',
    sourceUrl: 'https://rsf.org/en/gui-minhai-swedish-publisher-deprived-his-freedom-3000-days',
  },
  {
    date: '2017-10',
    year: '2017',
    title: 'Reportedly released but kept under surveillance',
    detail: 'After serving time for the alleged 2003 drunk-driving incident, Gui was reportedly "released" but was in fact kept under heavy police surveillance in Ningbo. He could not leave China, could not contact the Swedish embassy freely, and was closely monitored by Chinese security services.',
    category: 'persecution',
  },
  {
    date: '2018-01-20',
    year: '2018',
    title: 'Seized from a train in the presence of Swedish diplomats',
    detail: 'While traveling by train from Ningbo to Beijing accompanied by two Swedish diplomats for a medical examination at the Swedish embassy, Chinese plainclothes police boarded the train and physically removed him. This brazen act — abducting someone from the custody of foreign diplomats — sent shockwaves through the international diplomatic community.',
    category: 'persecution',
    sourceUrl: 'https://www.nchrd.org/2025/10/china-end-decade-long-disappearance-of-swedish-publisher-gui-minhai/',
  },
  {
    date: '2018-02',
    year: '2018',
    title: 'Second forced confession on state TV',
    detail: 'Appeared again on CCTV claiming he had been "rescued" from the Swedish diplomats and criticizing Sweden for "orchestrating" the incident. He was made to say he had reinstated his Chinese citizenship. International observers, including RSF and PEN, condemned this as another coerced performance.',
    category: 'persecution',
  },
  {
    date: '2020-02-24',
    year: '2020',
    title: 'Sentenced to 10 years by Ningbo court',
    detail: 'Ningbo Intermediate People\'s Court convicted Gui of "illegally providing intelligence to foreign countries" and sentenced him to 10 years imprisonment. The trial was secret — Swedish diplomats were not notified, his family received no official verdict, and his lawyer was state-appointed. The court also claimed he had "voluntarily" applied to restore Chinese citizenship, which Sweden disputes as coerced.',
    category: 'persecution',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2025/10/china-hong-kong-bookseller-gui-minhai-must-be-released-after-decade-of-cruel-secrecy/',
  },
  {
    date: '2025-08',
    year: '2025',
    title: 'UN Working Group on Arbitrary Detention rules detention arbitrary',
    detail: 'The UN Working Group on Arbitrary Detention (WGAD) formally concluded that Gui Minhai\'s detention is arbitrary under multiple categories of international law. The WGAD called for his immediate and unconditional release, compensation, reparations, and an independent investigation into his deprivation of liberty.',
    category: 'international',
    sourceUrl: 'https://rsf.org/en/china-united-nations-experts-recognise-detention-swedish-publisher-gui-minhai-arbitrary-and',
  },
  {
    date: '2025-10-17',
    year: '2025',
    title: '10th anniversary of abduction — 90 organizations demand release',
    detail: 'On the 10th anniversary of Gui\'s kidnapping from Thailand, a coalition of 90 civil society organizations — including Amnesty International, RSF, Fortify Rights, PEN International, and Safeguard Defenders — issued a joint statement demanding his immediate release and condemning China\'s "decade of cruel secrecy."',
    category: 'international',
    sourceUrl: 'https://www.fortifyrights.org/eas-inv-2025-10-17/',
  },
  {
    date: '2025-12',
    year: '2025',
    title: 'China rejects UN demand for release',
    detail: 'China publicly rejected the UN Working Group\'s ruling, insisting Gui was lawfully convicted and that the matter falls within Chinese judicial sovereignty. China also rejected Sweden\'s ongoing demands for consular access.',
    category: 'persecution',
    sourceUrl: 'https://hongkongfp.com/2025/12/14/china-defends-jailing-chinese-swedish-bookseller-gui-minhai-after-un-group-urges-release/',
  },
];

const CHARGES = [
  {
    charge: 'Illegally providing intelligence to foreign countries',
    law: 'Chinese Criminal Law',
    filed: 'c. 2019 (exact date unknown — trial was secret)',
    verdict: 'GUILTY — February 24, 2020',
    sentence: '10 years imprisonment (sentence ends February 2030)',
    detail: 'Convicted by Ningbo Intermediate People\'s Court in a secret trial. The specific "intelligence" was never publicly disclosed. Swedish diplomats were not notified of the trial. Gui\'s lawyer was state-appointed — his family was not allowed to hire independent counsel. The UN Working Group on Arbitrary Detention ruled in August 2025 that the trial violated international fair trial standards.',
  },
  {
    charge: 'Dangerous driving causing death (2003 incident)',
    law: 'Chinese Criminal Law',
    filed: '2015 (invoked retroactively after abduction)',
    verdict: 'Allegedly served — used to justify initial detention',
    sentence: 'Used as pretext for 2015-2017 detention',
    detail: 'Chinese authorities claimed Gui returned "voluntarily" to face charges for a 2003 drunk-driving incident in Ningbo in which a woman was killed. This charge was used to justify the initial period of detention from 2015-2017. However, the manner of his disappearance from Thailand — involving Chinese security agents and no legal departure records — directly contradicts the "voluntary return" claim.',
  },
];

const CCP_NARRATIVES = [
  {
    claim: '"Gui Minhai voluntarily returned to China to face justice"',
    reality: 'Thai immigration records show no legal departure by Gui from Thailand. Safeguard Defenders has documented that Chinese security agents orchestrated the abduction from his Pattaya apartment. No one "voluntarily returns" to face justice by being secretly extracted from a foreign country without passport stamps, departure records, or any contact with local authorities. His daughter Angela Gui has repeatedly stated he was kidnapped.',
    sourceUrl: 'https://safeguarddefenders.com/en/blog/10-years-gui-minhais-kidnapping',
  },
  {
    claim: '"He voluntarily renounced Swedish citizenship and restored Chinese citizenship"',
    reality: 'Sweden does not recognize the renunciation as valid. Under Swedish law, citizenship cannot be renounced under coercion or while detained by a foreign government. The Swedish government has consistently maintained that Gui Minhai remains a Swedish citizen and has repeatedly demanded consular access — which China has refused. The UN Working Group on Arbitrary Detention specifically noted the citizenship manipulation as part of the arbitrary detention pattern.',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2025/10/china-hong-kong-bookseller-gui-minhai-must-be-released-after-decade-of-cruel-secrecy/',
  },
  {
    claim: '"His confessions on state television were voluntary and genuine"',
    reality: 'Gui appeared in at least two televised "confessions" (January 2016, February 2018) on Chinese state media. Both bore classic hallmarks of coerced confessions documented by Safeguard Defenders in their "Scripted and Staged" report: reading from scripts, using CCP-standard political phrasing, criticizing foreign governments, and expressing "gratitude" to Chinese authorities. These staged confessions are a systematic CCP practice — Safeguard Defenders has documented over 100 similar cases.',
    sourceUrl: 'https://rsf.org/en/gui-minhai-swedish-publisher-deprived-his-freedom-3000-days',
  },
  {
    claim: '"This is an internal Chinese legal matter — foreign interference is unwelcome"',
    reality: 'Gui Minhai is a Swedish citizen who was abducted from Thailand. This involves the sovereignty of at least three countries. The UN Working Group on Arbitrary Detention — a body mandated by the UN Human Rights Council — has formally ruled his detention arbitrary. When a country kidnaps a foreign citizen from a third country, subjects them to secret trials, denies consular access in violation of the Vienna Convention, and forces televised confessions, this is by definition an international matter, not a domestic one.',
    sourceUrl: 'https://www.fortifyrights.org/eas-inv-2025-10-17/',
  },
];

const INTERNATIONAL_RESPONSES = [
  {
    entity: 'Sweden',
    response: 'Has consistently demanded Gui Minhai\'s release and consular access. Sweden does not recognize his forced renunciation of citizenship. Expelled the Chinese ambassador in 2019 after she threatened a Swedish journalist. Sweden\'s Culture Minister awarded Gui the Tucholsky Prize for persecuted writers in 2019.',
    sourceUrl: 'https://www.nchrd.org/2025/10/china-end-decade-long-disappearance-of-swedish-publisher-gui-minhai/',
  },
  {
    entity: 'United Nations',
    response: 'The UN Working Group on Arbitrary Detention ruled in August 2025 that Gui\'s detention is arbitrary under multiple categories. Called for immediate unconditional release, compensation, reparations, and an independent investigation.',
    sourceUrl: 'https://rsf.org/en/china-united-nations-experts-recognise-detention-swedish-publisher-gui-minhai-arbitrary-and',
  },
  {
    entity: 'European Union',
    response: 'Multiple EU resolutions have condemned the Causeway Bay Books abductions. The European Parliament called for Gui\'s immediate release.',
  },
  {
    entity: 'Amnesty International',
    response: 'Designated Gui Minhai a prisoner of conscience. Called his treatment a "decade of cruel secrecy" and demands his immediate and unconditional release.',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2025/10/china-hong-kong-bookseller-gui-minhai-must-be-released-after-decade-of-cruel-secrecy/',
  },
  {
    entity: 'Reporters Without Borders (RSF)',
    response: 'RSF has tracked Gui\'s detention since day one, documenting over 3,000 days of deprivation of liberty. Co-organized the 90-organization joint statement in October 2025.',
    sourceUrl: 'https://rsf.org/en/gui-minhai-swedish-publisher-deprived-his-freedom-3000-days',
  },
  {
    entity: 'Safeguard Defenders',
    response: 'Published extensive documentation on the abduction, including analysis of Thai immigration records and the pattern of cross-border kidnapping. Co-organized the 10th anniversary joint statement.',
    sourceUrl: 'https://safeguarddefenders.com/en/blog/10-years-gui-minhais-kidnapping',
  },
  {
    entity: 'Fortify Rights',
    response: 'Co-led the coalition of 90 organizations demanding Gui\'s release on the 10th anniversary of his abduction.',
    sourceUrl: 'https://www.fortifyrights.org/eas-inv-2025-10-17/',
  },
  {
    entity: 'PEN International',
    response: 'Awarded Gui Minhai the PEN/Barbara Goldsmith Freedom to Write Award in 2018, recognizing his courage as a persecuted publisher.',
  },
];

const SOURCES = [
  { name: 'Amnesty International', url: 'https://www.amnesty.org/en/latest/news/2025/10/china-hong-kong-bookseller-gui-minhai-must-be-released-after-decade-of-cruel-secrecy/', tier: 1 },
  { name: 'Safeguard Defenders', url: 'https://safeguarddefenders.com/en/blog/10-years-gui-minhais-kidnapping', tier: 2 },
  { name: 'Human Rights Watch', url: 'https://www.hrw.org/news/2016/10/17/china-release-abducted-swedish-bookseller', tier: 1 },
  { name: 'NCHRD (Network of Chinese Human Rights Defenders)', url: 'https://www.nchrd.org/2025/10/china-end-decade-long-disappearance-of-swedish-publisher-gui-minhai/', tier: 2 },
  { name: 'Reporters Without Borders (RSF)', url: 'https://rsf.org/en/gui-minhai-swedish-publisher-deprived-his-freedom-3000-days', tier: 1 },
  { name: 'RSF — UN WGAD ruling coverage', url: 'https://rsf.org/en/china-united-nations-experts-recognise-detention-swedish-publisher-gui-minhai-arbitrary-and', tier: 1 },
  { name: 'Fortify Rights', url: 'https://www.fortifyrights.org/eas-inv-2025-10-17/', tier: 1 },
  { name: 'Hong Kong Free Press (HKFP)', url: 'https://hongkongfp.com/2025/12/14/china-defends-jailing-chinese-swedish-bookseller-gui-minhai-after-un-group-urges-release/', tier: 2 },
  { name: 'Free Gui Minhai Campaign', url: 'https://www.freeguiminhai.com/timeline', tier: 2 },
  { name: 'OMCT (World Organisation Against Torture)', url: 'https://www.omct.org/en/resources/statements/china-arbitrary-detention-of-swedish-publisher-gui-minhai', tier: 1 },
];

// ─── CATEGORY COLORS ───────────────────────────────────────────────
const CATEGORY_COLORS = {
  life: { bg: 'bg-[#111820]', text: 'text-slate-200', label: 'Personal' },
  business: { bg: 'bg-[#111820]', text: 'text-[#22d3ee]', label: 'Publishing' },
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
            <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#22d3ee] hover:text-[#22d3ee] mt-2">
              <ExternalLink className="w-3 h-3" /> Source
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────

export default function GuiMinhaiProfile() {
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

  const daysDetained = Math.floor((new Date() - new Date('2015-10-17')) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <GlobalDisclaimer />

      {/* Back link */}
      <Link to="/profiles" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Profiles
      </Link>

      {/* ─── HEADER ─────────────────────────────────────────── */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-[#22d3ee] p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-[#111820] border-2 border-[#1c2a35] flex items-center justify-center flex-shrink-0">
            <Book className="w-10 h-10 text-[#22d3ee]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{PROFILE.name}</h1>
              <span className="text-lg text-[#22d3ee]">{PROFILE.chineseName}</span>
            </div>
            <p className="text-sm text-slate-400 mb-3">{PROFILE.occupation}</p>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">IMPRISONED</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#111820]/60 text-[#22d3ee] border border-[#1c2a35]">
                SWEDISH CITIZEN
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-900/60 text-orange-300 border border-orange-700">
                CROSS-BORDER ABDUCTION
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-[#111820] text-slate-300">
                Age {calculateAge(PROFILE.birthDate)}
              </span>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-[#22d3ee] font-bold text-lg">{daysDetained.toLocaleString()}+</div>
                <div className="text-slate-400 text-xs">Days detained</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-[#22d3ee] font-bold text-lg">5</div>
                <div className="text-slate-400 text-xs">Booksellers abducted</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-[#22d3ee] font-bold text-lg">3</div>
                <div className="text-slate-400 text-xs">Countries violated</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-[#22d3ee] font-bold text-lg">90+</div>
                <div className="text-slate-400 text-xs">Orgs demanding release</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3 italic">
              Only one of the five Causeway Bay Books booksellers still imprisoned. Sentence due to end February 2030.
            </p>
          </div>
        </div>
      </div>

      {/* ─── CAUSEWAY BAY BOOKS CONTEXT ─────────────────────── */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
        <h3 className="text-sm font-semibold text-[#22d3ee] mb-3 flex items-center gap-2">
          <Newspaper className="w-4 h-4" /> The Causeway Bay Books Disappearances (October–December 2015)
        </h3>
        <p className="text-sm text-slate-300 mb-3">
          Gui Minhai was one of five people associated with Causeway Bay Books and Mighty Current Media who disappeared 
          in late 2015. All were later found in mainland Chinese custody. The case demonstrated the CCP&#39;s willingness 
          to conduct cross-border abductions — from Thailand, mainland China, and even Hong Kong itself — to silence 
          publishers of politically sensitive books.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-red-400 font-semibold">Gui Minhai</span> — Abducted from Thailand (Oct 17, 2015). <span className="text-red-300">Still imprisoned.</span>
          </div>
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-slate-300 font-semibold">Lee Bo</span> — Abducted from Hong Kong (Dec 30, 2015). British citizen. Released.
          </div>
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-slate-300 font-semibold">Lui Bo</span> — Disappeared from Shenzhen (Oct 15, 2015). Released.
          </div>
          <div className="bg-[#0a0e14]/50 rounded p-2">
            <span className="text-slate-300 font-semibold">Lam Wing-kee</span> — Detained in China. Released, fled to Taiwan. Now runs a bookshop in Taipei.
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
              activeTab === id ? 'bg-[#22d3ee] text-[#0a0e14]' : 'text-slate-400 hover:text-white hover:bg-[#111820]'
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
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Clock className="w-5 h-5 text-[#22d3ee]" /> Timeline — {TIMELINE.length} Events</h2>
              <div className="flex gap-2">
                <button onClick={expandAll} className="text-xs text-[#22d3ee] hover:text-[#22d3ee]">Expand all</button>
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Scale className="w-5 h-5 text-[#22d3ee]" /> Charges & Verdict</h2>

            <div className="bg-red-900/20 border border-red-700/50 p-4">
              <h3 className="text-sm font-semibold text-red-300 mb-2">Current Legal Situation</h3>
              <p className="text-sm text-slate-300">
                Gui Minhai is serving a 10-year sentence imposed in a secret trial. His sentence is due to end 
                in <strong className="text-[#22d3ee]">February 2030</strong>, but given the CCP&#39;s pattern of extending 
                sentences or filing new charges (as seen with Joshua Wong), there is no guarantee of release. 
                His location, health status, and access to legal counsel remain unknown.
              </p>
            </div>

            {CHARGES.map((c, i) => (
              <div key={i} className="bg-[#111820] border border-[#1c2a35] p-5">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-white">{c.charge}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                    c.verdict.startsWith('GUILTY') ? 'bg-red-900/60 text-red-300' : 'bg-[#111820] text-slate-300'
                  }`}>{c.verdict.startsWith('GUILTY') ? 'GUILTY' : 'SERVED AS PRETEXT'}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                  <div><span className="text-slate-400">Law:</span> <span className="text-slate-200">{c.law}</span></div>
                  <div><span className="text-slate-400">Filed:</span> <span className="text-slate-200">{c.filed}</span></div>
                  <div><span className="text-slate-400">Sentence:</span> <span className="text-red-400 font-semibold">{c.sentence}</span></div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{c.detail}</p>
              </div>
            ))}

            {/* Angela Gui section */}
            <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
              <h3 className="text-sm font-semibold text-[#22d3ee] mb-2">Angela Gui — Daughter and Advocate</h3>
              <p className="text-sm text-slate-300">
                Angela Gui, Gui Minhai&#39;s daughter, has become one of the most prominent advocates for his release. 
                Based in the UK, she has testified before European and US legislative bodies, engaged with media, 
                and maintained the Free Gui Minhai campaign. She has had no contact with her father since his 
                2020 sentencing and does not know his location or health status.
              </p>
            </div>
          </div>
        )}

        {/* CCP NARRATIVE ANALYSIS */}
        {activeTab === 'narratives' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-[#22d3ee]" /> CCP Narrative Analysis</h2>
            <p className="text-sm text-slate-400">
              The Gui Minhai case is one of the clearest examples of CCP narrative manipulation: forced televised confessions, 
              fabricated citizenship changes, and the reframing of an international kidnapping as a "voluntary return." 
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Globe className="w-5 h-5 text-[#22d3ee]" /> International Response</h2>

            {/* Awards */}
            <div className="bg-[#111820] border border-[#1c2a35] p-5">
              <h3 className="text-sm font-semibold text-[#22d3ee] mb-3">Awards & Recognition</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { year: '2018', award: 'PEN/Barbara Goldsmith Freedom to Write Award', org: 'PEN America' },
                  { year: '2019', award: 'Tucholsky Prize for persecuted writers', org: 'Swedish PEN' },
                ].map((a, i) => (
                  <div key={i} className="bg-[#111820]/50 p-3 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#111820] flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-[#22d3ee]" />
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
                  <Flag className="w-4 h-4 text-[#22d3ee]" />
                  <h3 className="text-sm font-semibold text-white">{r.entity}</h3>
                </div>
                <p className="text-sm text-slate-300">{r.response}</p>
                {r.sourceUrl && (
                  <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#22d3ee] hover:text-[#22d3ee] mt-2">
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#22d3ee]" /> Sources</h2>
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
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-[#22d3ee] transition-colors" />
                </a>
              ))}
            </div>
            <div className="bg-red-900/20 border border-red-700/30 p-4 mt-4">
              <h3 className="text-sm font-semibold text-red-300 mb-1">Excluded Sources</h3>
              <p className="text-sm text-slate-400">
                Xinhua, People&#39;s Daily, CGTN, Global Times, China Daily, and all CCP-controlled media were deliberately excluded 
                as sources. CCTV footage of Gui&#39;s forced confessions is referenced only as evidence of coercion, not as credible testimony.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
