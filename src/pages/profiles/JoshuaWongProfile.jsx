import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlobalDisclaimer from '../../components/ui/GlobalDisclaimer';
import {
  User, Calendar, MapPin, Scale, AlertTriangle, ExternalLink,
  ChevronDown, ChevronUp, Globe, FileText, BookOpen, Clock,
  ArrowLeft, Shield, Newspaper, Flag, Heart, Megaphone
} from 'lucide-react';

// ─── DATA ──────────────────────────────────────────────────────────
// All dates verified against BBC, HKFP, Amnesty International, CFHK, TIME.
// See _agents/thoughts/SESSION_47_JOSHUA_WONG_PROFILE.md for verification methodology.
// CCP narrative rebuttals sourced from independent media, not CCP state outlets.

const PROFILE = {
  name: 'Joshua Wong',
  chineseName: '黃之鋒',
  birthDate: 'October 13, 1996',
  birthPlace: 'Hong Kong',
  nationality: 'Chinese (Hong Kong permanent resident)',
  status: 'IMPRISONED',
  currentLocation: 'Stanley Prison, Hong Kong',
  sentence: '4 years 8 months (subversion) + new NSL collusion charge (faces life)',
  age: 29,
  occupation: 'Pro-Democracy Activist, Student Leader, Former Secretary-General of Demosistō',
};

const TIMELINE = [
  {
    date: '1996-10-13',
    year: '1996',
    title: 'Born in Hong Kong',
    detail: 'Born to middle-class Christian parents in Hong Kong. Diagnosed with dyslexia as a child, which he later described as having shaped his determination and unconventional thinking.',
    category: 'life',
  },
  {
    date: '2011-05-29',
    year: '2011',
    title: 'Founded Scholarism',
    detail: 'At age 14, co-founded Scholarism (學民思潮), a student activist group opposing the government\'s proposed "Moral and National Education" curriculum, which critics called CCP-mandated brainwashing. The curriculum praised CCP one-party rule while omitting Tiananmen Square and the Cultural Revolution.',
    category: 'activism',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-29475780',
  },
  {
    date: '2012-09-08',
    year: '2012',
    title: 'Scholarism forces government to shelve national education curriculum',
    detail: 'After months of protests culminating in a mass occupation of government headquarters with over 120,000 supporters, the Hong Kong government shelved the mandatory "Moral and National Education" curriculum indefinitely. A landmark victory for student activism — Wong was just 15 years old.',
    category: 'activism',
    sourceUrl: 'https://time.com/3482556/hong-kong-protest-teenagers/',
  },
  {
    date: '2014-09-22',
    year: '2014',
    title: 'Class boycott begins — Umbrella Movement starts',
    detail: 'Wong and Scholarism organized a week-long class boycott of university and secondary school students to protest Beijing\'s decision to pre-screen candidates for Hong Kong\'s 2017 Chief Executive election, effectively denying genuine universal suffrage.',
    category: 'activism',
  },
  {
    date: '2014-09-26',
    year: '2014',
    title: 'Arrested at Civic Square occupation',
    detail: 'Led protesters to storm Civic Square outside the Central Government Complex. Arrested and detained for approximately 46 hours. This event catalyzed the broader Umbrella Movement that would see tens of thousands occupy major roads for 79 days.',
    category: 'persecution',
    sourceUrl: 'https://hongkongfp.com/2024/09/28/10-years-on-where-are-the-leaders-of-hong-kongs-umbrella-movement-now/',
  },
  {
    date: '2014-10',
    year: '2014',
    title: 'Named TIME\'s "Most Influential Teens" and Person of the Year nominee',
    detail: 'TIME Magazine named Wong one of the most influential teenagers in the world and nominated him for Person of the Year. At 17, he became the international face of Hong Kong\'s democracy movement.',
    category: 'international',
    sourceUrl: 'https://time.com/3482556/hong-kong-protest-teenagers/',
  },
  {
    date: '2015',
    year: '2015',
    title: 'Named in Fortune\'s "World\'s Greatest Leaders"',
    detail: 'Fortune magazine included Wong in its annual list of the World\'s Greatest Leaders, recognizing his role in mobilizing mass civic participation through nonviolent means.',
    category: 'international',
  },
  {
    date: '2016-03',
    year: '2016',
    title: 'Scholarism dissolved',
    detail: 'After the Umbrella Movement failed to achieve its immediate goals, Scholarism was formally dissolved. Wong and other members decided to transition from student activism to formal political engagement.',
    category: 'political',
  },
  {
    date: '2016-04-10',
    year: '2016',
    title: 'Co-founded Demosistō',
    detail: 'Co-founded the political party Demosistō (香港眾志) with Nathan Law and Agnes Chow. The party\'s platform advocated self-determination for Hong Kong through democratic referendums. Wong served as Secretary-General.',
    category: 'political',
    sourceUrl: 'https://thecfhk.org/prisoner/joshua-wong-chi-fung-%E9%BB%83%E4%B9%8B%E9%8B%92/',
  },
  {
    date: '2016-07-21',
    year: '2016',
    title: 'Convicted of unlawful assembly for Civic Square',
    detail: 'Found guilty of "taking part in an unlawful assembly" for the September 2014 Civic Square occupation. Initially sentenced to 80 hours of community service. Nathan Law received 120 hours; Alex Chow received a suspended sentence.',
    category: 'persecution',
    sourceUrl: 'https://www.abc.net.au/news/2016-07-21/hong-kong-student-leader-wong-convicted-for-democracy-protests/7649012',
  },
  {
    date: '2017-08-17',
    year: '2017',
    title: 'Sentenced to 6 months prison on government appeal',
    detail: 'The Department of Justice appealed the community service sentences. Court of Appeal sentenced Wong to 6 months, Nathan Law to 8 months, and Alex Chow to 7 months. The harsher sentences also disqualified them from running for office for 5 years.',
    category: 'persecution',
    sourceUrl: 'https://www.cnbc.com/2017/08/17/occupy-activists-joshua-wong-nathan-law-alex-chow-jailed.html',
  },
  {
    date: '2018-02-06',
    year: '2018',
    title: 'Court of Final Appeal overturns prison sentence',
    detail: 'Hong Kong\'s highest court overturned the prison sentences for Wong, Law, and Chow, ruling that the retrospective application of harsher sentencing guidelines was unjust. However, the court set precedent that future cases could receive prison terms.',
    category: 'life',
    sourceUrl: 'https://archive.hrf.org/press-release-umbrella-movement-leaders-freed-for-now/',
  },
  {
    date: '2019-06',
    year: '2019',
    title: 'Anti-Extradition Bill protests begin — Wong released from prison',
    detail: 'Released from a separate contempt of court sentence just as the 2019 anti-extradition bill protests erupted. Immediately resumed activism, becoming one of the movement\'s most visible figures. Testified before US Congress and met with European leaders.',
    category: 'activism',
  },
  {
    date: '2019-09',
    year: '2019',
    title: 'Testified before US Congress',
    detail: 'Testified before the Congressional-Executive Commission on China (CECC), calling for passage of the Hong Kong Human Rights and Democracy Act. The Act was signed into law in November 2019, mandating annual reviews of Hong Kong\'s special trade status.',
    category: 'international',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-49735960',
  },
  {
    date: '2020-06-30',
    year: '2020',
    title: 'National Security Law imposed — Demosistō dissolved',
    detail: 'Beijing imposed the National Security Law on Hong Kong, criminalizing secession, subversion, terrorism, and collusion with foreign forces. Demosistō immediately disbanded. Wong resigned from the party hours before the law took effect, stating he would continue activism in a personal capacity.',
    category: 'political',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-53206862',
  },
  {
    date: '2020-07-11',
    year: '2020',
    title: 'Participated in pro-democracy primary election',
    detail: 'Participated in an unofficial pro-democracy primary election organized to coordinate opposition candidates for the Legislative Council. Over 610,000 Hong Kong residents voted. Authorities later declared this an act of subversion designed to "paralyze the government."',
    category: 'political',
  },
  {
    date: '2020-12-02',
    year: '2020',
    title: 'Sentenced to 13.5 months for unauthorized assembly',
    detail: 'Sentenced to 13 months and 2 weeks for organizing and participating in an unauthorized assembly near police headquarters on June 21, 2019, during the anti-extradition bill protests.',
    category: 'persecution',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-55147465',
  },
  {
    date: '2021-02-28',
    year: '2021',
    title: 'Arrested in mass "Hong Kong 47" sweep',
    detail: 'Along with 46 other pro-democracy activists, politicians, and organizers, arrested and charged with "conspiracy to commit subversion" under the National Security Law for participating in the July 2020 democratic primary. Most were denied bail. Wong has been in continuous detention since this date.',
    category: 'persecution',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2021/03/hong-kong-47-activists-charged-under-security-law-must-be-released/',
  },
  {
    date: '2024-05-30',
    year: '2024',
    title: 'Hong Kong 47 verdict — guilty of subversion',
    detail: 'Found guilty of conspiracy to commit subversion along with 44 others. Only 2 of the 47 defendants were acquitted. The trial, which began in February 2023, was the largest national security prosecution in Hong Kong\'s history.',
    category: 'persecution',
    sourceUrl: 'https://www.bbc.com/news/articles/cx2l4eynl4zo',
  },
  {
    date: '2024-11-19',
    year: '2024',
    title: 'Sentenced to 4 years 8 months — shouts "I love Hong Kong"',
    detail: 'Sentenced to 4 years and 8 months for subversion. Benny Tai, the lead organizer, received 10 years. As Wong was led from the courtroom, he shouted "I love Hong Kong" — a moment that became an iconic symbol of defiance and was widely covered internationally.',
    category: 'persecution',
    sourceUrl: 'https://www.hongkongwatch.org/all-posts/2024/11/19/hong-kong-watch-strongly-condemns-sentencing-of-45-of-the-hong-kong-47-democrats',
  },
  {
    date: '2025-06-06',
    year: '2025',
    title: 'New NSL charge: "conspiracy to collude with foreign forces"',
    detail: 'While already imprisoned, charged with "conspiring to collude with foreign forces" under the National Security Law. Accused of working with exiled activist Nathan Law between July–November 2020 to encourage foreign sanctions against Hong Kong/China. This charge carries a maximum penalty of life imprisonment and is widely seen as designed to prevent his release in January 2027.',
    category: 'persecution',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2025/06/hong-kong-new-charges-against-joshua-wong-designed-to-prolong-his-stay-behind-bars/',
  },
];

const CHARGES = [
  {
    charge: 'Conspiracy to commit subversion (Hong Kong 47)',
    law: 'National Security Law, Article 22',
    filed: 'February 28, 2021',
    verdict: 'GUILTY — May 30, 2024',
    sentence: '4 years 8 months',
    detail: 'Charged for participating in the July 2020 pro-democracy primary election, which the prosecution argued was a conspiracy to "paralyze" the government and force the Chief Executive to resign. Wong pleaded guilty and received a reduced sentence. The trial lasted 118 days with no jury — heard by three National Security Law-designated judges.',
  },
  {
    charge: 'Conspiracy to collude with foreign forces',
    law: 'National Security Law, Article 29',
    filed: 'June 6, 2025',
    verdict: 'PENDING — next hearing August 8, 2025',
    sentence: 'Faces up to LIFE IMPRISONMENT',
    detail: 'Accused of conspiring with Nathan Law (now in exile in the UK) and "other persons unknown" to encourage foreign countries or organizations to impose sanctions on Hong Kong or China between July and November 2020. Amnesty International called these charges "designed to prolong his stay behind bars" and prevent his scheduled January 2027 release.',
  },
];

const CCP_NARRATIVES = [
  {
    claim: '"Joshua Wong is a separatist trying to split Hong Kong from China"',
    reality: 'Wong has repeatedly and explicitly stated he does not advocate Hong Kong independence. Demosistō\'s platform called for self-determination through democratic referendums — a process, not an outcome. Scholarism\'s original cause was opposing CCP-influenced education, not separation. The CCP deliberately conflates demands for democratic elections with separatism to justify prosecution.',
    sourceUrl: 'https://thecfhk.org/prisoner/joshua-wong-chi-fung-%E9%BB%83%E4%B9%8B%E9%8B%92/',
  },
  {
    claim: '"The democratic primary was a subversive plot to paralyze the government"',
    reality: 'Primary elections are standard democratic practice worldwide. The 2020 primary was an informal coordination exercise among pro-democracy candidates, with over 610,000 Hong Kong citizens voluntarily participating. In any functioning democracy, opposition parties organizing to win elections is normal politics, not subversion. The prosecution\'s logic — that winning a legislative majority and exercising veto power constitutes subversion — would criminalize opposition politics in any parliament.',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2021/03/hong-kong-47-activists-charged-under-security-law-must-be-released/',
  },
  {
    claim: '"Wong was manipulated by foreign forces to undermine China"',
    reality: 'Wong testified before the US Congress at the invitation of CECC members — a standard practice for human rights advocates worldwide. The Hong Kong Human Rights and Democracy Act he supported merely required annual reviews of Hong Kong\'s autonomy status, which Beijing promised to maintain until 2047. Advocating for accountability mechanisms is not "foreign interference" — it\'s international human rights advocacy.',
    sourceUrl: 'https://www.bbc.com/news/world-asia-china-49735960',
  },
  {
    claim: '"He received a fair trial under Hong Kong\'s independent judiciary"',
    reality: 'The Hong Kong 47 trial had no jury — a departure from Hong Kong common law tradition. Cases were heard by three judges hand-picked by the Chief Executive under the NSL. 45 of 47 defendants were convicted (96% conviction rate). Defendants were held without bail for over 3 years before sentencing. The UN Human Rights Committee has repeatedly raised concerns about the independence of NSL proceedings.',
    sourceUrl: 'https://www.hongkongwatch.org/all-posts/2024/11/19/hong-kong-watch-strongly-condemns-sentencing-of-45-of-the-hong-kong-47-democrats',
  },
];

const INTERNATIONAL_RESPONSES = [
  {
    entity: 'United States',
    response: 'Condemned the Hong Kong 47 sentencing. Passed the Hong Kong Human Rights and Democracy Act (2019) after Wong\'s Congressional testimony. Imposed sanctions on Hong Kong and Chinese officials.',
    sourceUrl: 'https://www.state.gov/hong-kong-autonomy-act/',
  },
  {
    entity: 'United Kingdom',
    response: 'Called the sentencing "politically motivated." Created BN(O) visa pathway for Hong Kong residents, allowing up to 5.4 million Hong Kongers to apply for residency and eventual citizenship.',
    sourceUrl: 'https://www.bbc.com/news/uk-politics-55597217',
  },
  {
    entity: 'European Union',
    response: 'European Parliament passed multiple resolutions condemning the erosion of Hong Kong\'s autonomy and calling for sanctions on officials responsible for the crackdown.',
  },
  {
    entity: 'Amnesty International',
    response: 'Called June 2025 collusion charges against Wong "designed to prolong his stay behind bars" and demanded his immediate release as a prisoner of conscience.',
    sourceUrl: 'https://www.amnesty.org/en/latest/news/2025/06/hong-kong-new-charges-against-joshua-wong-designed-to-prolong-his-stay-behind-bars/',
  },
  {
    entity: 'Hong Kong Watch',
    response: '"Strongly condemns" the sentencing of the Hong Kong 47. Maintains ongoing advocacy for all defendants and calls for Magnitsky-style sanctions.',
    sourceUrl: 'https://www.hongkongwatch.org/all-posts/2024/11/19/hong-kong-watch-strongly-condemns-sentencing-of-45-of-the-hong-kong-47-democrats',
  },
  {
    entity: 'Committee for Freedom in Hong Kong Foundation',
    response: 'Maintains detailed profiles of all imprisoned Hong Kong activists. Provides legal support coordination and international advocacy for Wong and other political prisoners.',
    sourceUrl: 'https://thecfhk.org/prisoner/joshua-wong-chi-fung-%E9%BB%83%E4%B9%8B%E9%8B%92/',
  },
];

const AWARDS = [
  { year: '2014', award: 'TIME "Most Influential Teens"', org: 'TIME Magazine' },
  { year: '2014', award: 'Person of the Year nominee', org: 'TIME Magazine' },
  { year: '2015', award: 'World\'s Greatest Leaders', org: 'Fortune Magazine' },
  { year: '2018', award: 'Truman-Reagan Medal of Freedom (with Nathan Law)', org: 'Victims of Communism Memorial Foundation' },
];

const SOURCES = [
  { name: 'Amnesty International', url: 'https://www.amnesty.org/en/latest/news/2025/06/hong-kong-new-charges-against-joshua-wong-designed-to-prolong-his-stay-behind-bars/', tier: 1 },
  { name: 'BBC News', url: 'https://www.bbc.com/news/articles/cx2l4eynl4zo', tier: 1 },
  { name: 'Hong Kong Watch', url: 'https://www.hongkongwatch.org/all-posts/2024/11/19/hong-kong-watch-strongly-condemns-sentencing-of-45-of-the-hong-kong-47-democrats', tier: 1 },
  { name: 'Hong Kong Free Press (HKFP)', url: 'https://hongkongfp.com/2024/09/28/10-years-on-where-are-the-leaders-of-hong-kongs-umbrella-movement-now/', tier: 2 },
  { name: 'Committee for Freedom in Hong Kong Foundation', url: 'https://thecfhk.org/prisoner/joshua-wong-chi-fung-%E9%BB%83%E4%B9%8B%E9%8B%92/', tier: 1 },
  { name: 'TIME Magazine', url: 'https://time.com/3482556/hong-kong-protest-teenagers/', tier: 1 },
  { name: 'Human Rights Foundation (HRF)', url: 'https://archive.hrf.org/press-release-umbrella-movement-leaders-freed-for-now/', tier: 1 },
  { name: 'CNBC', url: 'https://www.cnbc.com/2017/08/17/occupy-activists-joshua-wong-nathan-law-alex-chow-jailed.html', tier: 2 },
  { name: 'Global Voices', url: 'https://globalvoices.org/2025/06/09/jailed-hong-kong-activist-joshua-wong-faces-new-foreign-collusion-charges/', tier: 2 },
  { name: 'US State Department', url: 'https://www.state.gov/hong-kong-autonomy-act/', tier: 1 },
];

// ─── CATEGORY COLORS ───────────────────────────────────────────────
const CATEGORY_COLORS = {
  life: { bg: 'bg-[#111820]', text: 'text-slate-200', label: 'Personal' },
  activism: { bg: 'bg-yellow-900/60', text: 'text-yellow-200', label: 'Activism' },
  political: { bg: 'bg-blue-900/60', text: 'text-blue-200', label: 'Political' },
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

export default function JoshuaWongProfile() {
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

  const daysDetained = Math.floor((new Date() - new Date('2021-02-28')) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <GlobalDisclaimer />

      {/* Back link */}
      <Link to="/prisoners" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Political Prisoners
      </Link>

      {/* ─── HEADER ─────────────────────────────────────────── */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-yellow-500 p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-yellow-900/60 border-2 border-yellow-600 flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-10 h-10 text-yellow-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{PROFILE.name}</h1>
              <span className="text-lg text-yellow-400">{PROFILE.chineseName}</span>
            </div>
            <p className="text-sm text-slate-400 mb-3">{PROFILE.occupation}</p>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">IMPRISONED</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-900/60 text-orange-300 border border-orange-700">
                NEW NSL CHARGE — FACES LIFE
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-[#111820] text-slate-300">
                Age {PROFILE.age}
              </span>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-yellow-400 font-bold text-lg">{daysDetained.toLocaleString()}+</div>
                <div className="text-slate-400 text-xs">Days detained</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-yellow-400 font-bold text-lg">14</div>
                <div className="text-slate-400 text-xs">Age at first activism</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-yellow-400 font-bold text-lg">6+</div>
                <div className="text-slate-400 text-xs">Times arrested</div>
              </div>
              <div className="bg-[#111820]/50 p-2 text-center">
                <div className="text-yellow-400 font-bold text-lg">120,000</div>
                <div className="text-slate-400 text-xs">Mobilized (2012)</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3 italic">
              "I love Hong Kong" — shouted as he was led from the courtroom after sentencing, November 19, 2024
            </p>
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

        {/* CHARGES & VERDICT */}
        {activeTab === 'charges' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Scale className="w-5 h-5 text-yellow-400" /> Charges & Verdict</h2>

            <div className="bg-red-900/20 border border-red-700/50 p-4">
              <h3 className="text-sm font-semibold text-red-300 mb-2">⚠️ Current Legal Situation</h3>
              <p className="text-sm text-slate-300">
                Wong is currently serving a 4 year 8 month sentence for subversion while simultaneously facing new "collusion with foreign forces" charges 
                that carry a maximum penalty of <strong className="text-red-400">life imprisonment</strong>. Amnesty International has called these new charges 
                "designed to prolong his stay behind bars" beyond his scheduled January 2027 release date.
              </p>
            </div>

            {CHARGES.map((c, i) => (
              <div key={i} className="bg-[#111820] border border-[#1c2a35] p-5">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-white">{c.charge}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                    c.verdict.startsWith('GUILTY') ? 'bg-red-900/60 text-red-300' : 'bg-orange-900/60 text-orange-300'
                  }`}>{c.verdict.startsWith('GUILTY') ? 'GUILTY' : 'PENDING'}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                  <div><span className="text-slate-400">Law:</span> <span className="text-slate-200">{c.law}</span></div>
                  <div><span className="text-slate-400">Filed:</span> <span className="text-slate-200">{c.filed}</span></div>
                  <div><span className="text-slate-400">Sentence:</span> <span className="text-red-400 font-semibold">{c.sentence}</span></div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{c.detail}</p>
              </div>
            ))}

            {/* Hong Kong 47 Context */}
            <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
              <h3 className="text-sm font-semibold text-yellow-400 mb-3">The Hong Kong 47 — Largest NSL Trial in History</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="text-center p-2 bg-[#0a0e14]/50 rounded">
                  <div className="text-white font-bold">47</div>
                  <div className="text-xs text-slate-400">Defendants</div>
                </div>
                <div className="text-center p-2 bg-[#0a0e14]/50 rounded">
                  <div className="text-white font-bold">45</div>
                  <div className="text-xs text-slate-400">Convicted</div>
                </div>
                <div className="text-center p-2 bg-[#0a0e14]/50 rounded">
                  <div className="text-white font-bold">2</div>
                  <div className="text-xs text-slate-400">Acquitted</div>
                </div>
                <div className="text-center p-2 bg-[#0a0e14]/50 rounded">
                  <div className="text-white font-bold">118</div>
                  <div className="text-xs text-slate-400">Trial days</div>
                </div>
              </div>
              <p className="text-sm text-slate-300">
                The trial was conducted without a jury — a departure from Hong Kong common law tradition. Three judges were hand-picked by the 
                Chief Executive under NSL provisions. Most defendants were denied bail and spent over 3 years in pretrial detention. Sentences ranged 
                from 4 years 2 months to 10 years. The 96% conviction rate mirrors mainland Chinese courts, not the independent judiciary Hong Kong 
                was promised under "One Country, Two Systems."
              </p>
            </div>

            {/* Nathan Law in exile */}
            <div className="bg-[#111820]/50 border border-[#1c2a35] p-5">
              <h3 className="text-sm font-semibold text-blue-400 mb-2">Nathan Law — Co-Founder of Demosistō, Now in Exile</h3>
              <p className="text-sm text-slate-300">
                Nathan Law, co-founder of Demosistō with Wong, fled Hong Kong in July 2020 shortly after the National Security Law was imposed. 
                He was granted political asylum in the United Kingdom. The new June 2025 "collusion" charges against Wong specifically name Nathan Law 
                as the person Wong allegedly conspired with — demonstrating how the CCP uses exiled activists as leverage to extend imprisonment of 
                those who chose to stay.
              </p>
            </div>
          </div>
        )}

        {/* CCP NARRATIVE ANALYSIS */}
        {activeTab === 'narratives' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-400" /> CCP Narrative Analysis</h2>
            <p className="text-sm text-slate-400">
              CCP narratives about Joshua Wong follow a pattern of deliberately conflating democratic participation with criminal subversion. 
              Each claim below is analyzed against independently verifiable facts. Zero CCP state media (Xinhua, CGTN, People's Daily, Global Times) 
              are cited as evidence — only as examples of propaganda to be debunked.
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

            {/* Awards */}
            <div className="bg-yellow-900/20 border border-yellow-700/30 p-5">
              <h3 className="text-sm font-semibold text-yellow-300 mb-3">Awards & Recognition</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {AWARDS.map((a, i) => (
                  <div key={i} className="bg-[#111820]/50 p-3 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-900/60 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{a.award}</div>
                      <div className="text-xs text-slate-400">{a.org} • {a.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                Xinhua, People's Daily, CGTN, Global Times, China Daily, Ta Kung Pao, Wen Wei Po, and all CCP-controlled 
                or CCP-aligned media were deliberately excluded as sources. These outlets systematically frame democratic participation 
                as criminal subversion and refer to activists as "anti-China" elements.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
