import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlobalDisclaimer from '../../components/ui/GlobalDisclaimer';
import {
  User, Calendar, MapPin, Scale, AlertTriangle, ExternalLink,
  ChevronDown, ChevronUp, Globe, FileText, BookOpen, Clock,
  ArrowLeft, Shield, Newspaper, Flag, Heart, Award, Star
} from 'lucide-react';

// ─── DATA ──────────────────────────────────────────────────────────
// All dates verified against NobelPrize.org, BBC, HRW, NCHRD, Britannica.
// See agent-thoughts/SESSION_46_LIU_XIAOBO_PROFILE.md for verification methodology.
// CCP narrative rebuttals sourced from independent media, not CCP state outlets.

const PROFILE = {
  name: 'Liu Xiaobo',
  chineseName: '刘晓波',
  birthDate: 'December 28, 1955',
  deathDate: 'July 13, 2017',
  birthPlace: 'Changchun, Jilin Province, China',
  deathPlace: 'First Hospital of China Medical University, Shenyang',
  nationality: 'Chinese',
  status: 'DECEASED — DIED IN STATE CUSTODY',
  sentence: '11 years for "inciting subversion of state power"',
  ageAtDeath: 61,
  occupation: 'Literary Critic, Professor, Writer, Human Rights Activist, Nobel Peace Prize Laureate',
};

const TIMELINE = [
  {
    date: '1955-12-28',
    year: '1955',
    title: 'Born in Changchun, Jilin Province',
    detail: 'Born into an intellectual family. His father was a professor at Northeast Normal University. Grew up during a period of immense political upheaval in China.',
    category: 'life',
  },
  {
    date: '1969',
    year: '1969',
    title: 'Sent to countryside during Cultural Revolution',
    detail: 'Like millions of Chinese youth, sent to Inner Mongolia for "re-education" during the Cultural Revolution. This formative experience shaped his understanding of political repression.',
    category: 'life',
  },
  {
    date: '1977',
    year: '1977',
    title: 'Enrolled at Jilin University',
    detail: 'Studied Chinese literature after the restoration of the national university entrance exam. Earned his BA in 1982.',
    category: 'academic',
  },
  {
    date: '1984',
    year: '1984',
    title: 'Completed MA at Beijing Normal University',
    detail: 'Earned his Master\'s degree in literature. Began establishing himself as a bold literary critic, earning the nickname "Dark Horse" (黑马) for his iconoclastic critiques of Chinese culture.',
    category: 'academic',
  },
  {
    date: '1988',
    year: '1988',
    title: 'Earned PhD; became visiting scholar abroad',
    detail: 'Completed his PhD in literature at Beijing Normal University. Served as visiting scholar at Columbia University, University of Oslo, and University of Hawaii.',
    category: 'academic',
    source: 'https://www.nobelprize.org/prizes/peace/2010/xiaobo/biographical/',
  },
  {
    date: '1989-04',
    year: '1989',
    title: 'Returned to Beijing for Tiananmen protests',
    detail: 'Cut short his visiting fellowship at Columbia University and returned to Beijing in April 1989 to join the pro-democracy protests. Served as an adviser to student leaders.',
    category: 'political',
  },
  {
    date: '1989-06-02',
    year: '1989',
    title: 'Launched hunger strike at Tiananmen Square',
    detail: 'On June 2, two days before the massacre, Liu and three others began a hunger strike in Tiananmen Square to show solidarity with students. He helped negotiate with the military to allow students to leave the square, likely saving hundreds of lives.',
    category: 'political',
    source: 'https://www.britannica.com/biography/Liu-Xiaobo',
  },
  {
    date: '1989-06-06',
    year: '1989',
    title: 'First arrest — detained after Tiananmen massacre',
    detail: 'Arrested two days after the June 4 massacre. Held in Qincheng Prison. Imprisoned until January 1991. Dismissed from his position at Beijing Normal University.',
    category: 'persecution',
  },
  {
    date: '1991-01',
    year: '1991',
    title: 'Released from first imprisonment',
    detail: 'Released after approximately 20 months in prison. Despite the risk, continued his pro-democracy writing and activism.',
    category: 'persecution',
  },
  {
    date: '1995-05',
    year: '1995',
    title: 'Second detention — petitioned for political reform',
    detail: 'Detained again for co-authoring an open letter calling for political reform and the release of Tiananmen prisoners. Held for approximately 8 months.',
    category: 'persecution',
  },
  {
    date: '1996-10-08',
    year: '1996',
    title: 'Third imprisonment — 3 years "re-education through labor"',
    detail: 'Sentenced to 3 years of "re-education through labor" (劳动教养) for criticizing the Communist Party and advocating for human rights. No trial — administrative detention imposed by police. Released in October 1999.',
    category: 'persecution',
    source: 'https://www.nchrd.org/2017/07/prisoner-of-conscience-liu-xiaobo/',
  },
  {
    date: '2003',
    year: '2003',
    title: 'Became President of Independent Chinese PEN Center',
    detail: 'Elected president of the Independent Chinese PEN Center, an organization defending freedom of expression for Chinese writers. Served until 2007, championing the rights of imprisoned writers.',
    category: 'political',
    source: 'https://pen.org/advocacy-case/liu-xiaobo/',
  },
  {
    date: '2008-12-08',
    year: '2008',
    title: 'Detained — Charter 08 released the next day',
    detail: 'Detained by Beijing police on December 8, 2008, two days before the planned release of Charter 08 — a manifesto calling for constitutional democracy, separation of powers, judicial independence, and human rights. Despite his arrest, Charter 08 was published on December 10 (International Human Rights Day) with over 300 initial signatures, eventually reaching over 10,000.',
    category: 'persecution',
    source: 'https://www.hrw.org/news/2017/07/13/china-democratic-voice-liu-xiaobo-dies-custody',
  },
  {
    date: '2009-06-23',
    year: '2009',
    title: 'Formally arrested and charged',
    detail: 'After six months of "residential surveillance," formally arrested and charged with "inciting subversion of state power" (煽动颠覆国家政权罪) under Article 105 of the Criminal Law.',
    category: 'persecution',
  },
  {
    date: '2009-12-25',
    year: '2009',
    title: 'Sentenced to 11 years in prison',
    detail: 'Trial lasted approximately 2 hours on December 23. On Christmas Day, sentenced to 11 years in prison and 2 years\' deprivation of political rights. The prosecution cited 6 of his articles and Charter 08 as evidence of "inciting subversion." International condemnation was swift and widespread.',
    category: 'persecution',
    source: 'https://www.bbc.com/news/world-asia-china-40597514',
  },
  {
    date: '2010-10-08',
    year: '2010',
    title: 'Awarded Nobel Peace Prize',
    detail: 'The Norwegian Nobel Committee awarded Liu Xiaobo the 2010 Nobel Peace Prize "for his long and non-violent struggle for fundamental human rights in China." China condemned the award as a "blasphemy" and pressured countries not to attend the ceremony. Liu became the first Chinese citizen residing in China to win a Nobel Prize.',
    category: 'international',
    source: 'https://www.nobelprize.org/prizes/peace/2010/xiaobo/facts/',
  },
  {
    date: '2010-12-10',
    year: '2010',
    title: 'Empty chair at Nobel ceremony in Oslo',
    detail: 'Unable to attend or send a representative, Liu\'s Nobel Prize was presented to an empty chair — an image that became one of the most powerful symbols of Chinese repression. China pressured 19 countries to boycott the ceremony. His wife Liu Xia was placed under house arrest to prevent her from attending.',
    category: 'international',
    source: 'https://www.nobelprize.org/prizes/peace/2010/ceremony-speech/',
  },
  {
    date: '2017-05',
    year: '2017',
    title: 'Diagnosed with terminal liver cancer',
    detail: 'After approximately 8.5 years in prison, diagnosed with late-stage liver cancer. The late diagnosis raised serious questions about the adequacy of medical care in Chinese prisons — the cancer had metastasized widely before detection.',
    category: 'medical',
  },
  {
    date: '2017-06-26',
    year: '2017',
    title: 'Granted medical parole — transferred to hospital',
    detail: 'Transferred from Jinzhou Prison to the First Hospital of China Medical University in Shenyang on medical parole. International requests for him to receive treatment in Germany or the United States were denied. Two foreign doctors (one German, one American) who examined Liu confirmed he could have safely traveled abroad for treatment.',
    category: 'medical',
    source: 'https://www.hrw.org/news/2017/07/13/china-democratic-voice-liu-xiaobo-dies-custody',
  },
  {
    date: '2017-07-13',
    year: '2017',
    title: 'Died in state custody at age 61',
    detail: 'Died of multiple organ failure caused by liver cancer at Shenyang hospital, surrounded by security guards. He was the first Nobel Peace Prize laureate to die in state custody since Carl von Ossietzky died under Nazi Germany surveillance in 1938. His body was cremated and ashes scattered at sea within days — his family said under government pressure, preventing any future memorial site.',
    category: 'memorial',
    source: 'https://www.bbc.com/news/world-asia-china-40597514',
  },
  {
    date: '2017-07-15',
    year: '2017',
    title: 'Cremated — ashes scattered at sea',
    detail: 'Liu\'s remains were cremated and his ashes scattered in the sea off Dalian within two days of his death. His brother Liu Xiaoguang read a statement saying the family had "voluntarily" chosen sea burial, but friends and international observers said the family was pressured to prevent the creation of a pilgrimage site for pro-democracy supporters.',
    category: 'memorial',
    source: 'https://www.theguardian.com/world/2017/jul/15/liu-xiaobo-sea-burial-mourning-china',
  },
  {
    date: '2018-07-10',
    year: '2018',
    title: 'Liu Xia finally allowed to leave China',
    detail: 'After 8 years of house arrest (never charged with any crime), Liu Xia was permitted to leave China for Berlin, Germany. She had suffered severe depression during her years of confinement. Her release was widely attributed to German diplomatic pressure.',
    category: 'legacy',
    source: 'https://www.frontlinedefenders.org/en/case/case-history-liu-xia',
  },
];

const CHARGES = [
  {
    charge: 'Inciting subversion of state power (煽动颠覆国家政权罪)',
    article: 'Article 105, Paragraph 2, Criminal Law of the PRC',
    evidence: 'The prosecution cited six of Liu\'s published articles and his role in drafting and organizing Charter 08. The court treated calls for constitutional democracy, separation of powers, and free elections as criminal acts.',
    verdict: 'Guilty — 11 years imprisonment, 2 years deprivation of political rights',
  },
];

const CHARTER_08_DEMANDS = [
  'Constitutional reform and the rule of law',
  'Separation of powers and an independent judiciary',
  'Direct election of public officials at all levels',
  'Freedom of association, assembly, speech, and religion',
  'An end to one-party monopoly of power',
  'Protection of human rights as enshrined in the UN Declaration',
];

const CCP_NARRATIVES = [
  {
    claim: '"Liu Xiaobo was a criminal, not a political prisoner"',
    reality: 'Liu was convicted solely for writing words — six essays and Charter 08, a document calling for democratic reforms. His "crime" was expressing opinions. No violence, no conspiracy, no theft — only ideas. Every major international human rights body classified him as a prisoner of conscience. The charge "inciting subversion" is routinely used to criminalize peaceful dissent in China.',
    sources: ['HRW', 'Amnesty International', 'NCHRD', 'European Parliament'],
  },
  {
    claim: '"He received the best possible medical care"',
    reality: 'Liu was diagnosed with liver cancer only after it had metastasized widely — suggesting years of inadequate prison medical screening. When finally diagnosed, Chinese authorities denied international requests to transfer him to Germany or the US for treatment. Two independent foreign doctors who examined Liu confirmed he could have safely traveled abroad. The late diagnosis and denial of overseas treatment led many observers and fellow dissidents to describe his death as a form of "slow political murder."',
    sources: ['BBC', 'PBS', 'HRW', 'NCHRD'],
  },
  {
    claim: '"The Nobel Prize was a blasphemy and interference in China\'s internal affairs"',
    reality: 'China pressured 19 countries to boycott the Nobel ceremony and placed Liu\'s wife under house arrest to prevent her attending. The Norwegian Nobel Committee\'s mandate — established by Alfred Nobel\'s will — explicitly awards the Peace Prize to those who have "done the most or the best work for fraternity between nations, for the abolition or reduction of standing armies and for the holding and promotion of peace congresses." Liu\'s lifelong non-violent advocacy for human rights exemplifies exactly this. The CCP\'s rage was not about the Prize\'s legitimacy — it was about the global spotlight on their repression.',
    sources: ['NobelPrize.org', 'Britannica', 'Journal of Democracy'],
  },
  {
    claim: '"His ashes were scattered at sea voluntarily by his family"',
    reality: 'Liu\'s cremation and sea burial occurred within 48 hours of his death — an unusually rapid timeline in Chinese culture, where families traditionally observe mourning periods. His brother read a prepared statement calling it "voluntary," but friends and international observers reported the family was pressured by authorities. The clear motivation was to prevent the creation of a memorial or pilgrimage site. The Chinese government feared a grave that could become a symbol of resistance — the same reason they rushed to destroy evidence of the Tiananmen massacre.',
    sources: ['The Guardian', 'BBC', 'NCHRD'],
  },
];

const INTERNATIONAL_RESPONSES = [
  { org: 'Norwegian Nobel Committee', action: 'Awarded 2010 Nobel Peace Prize "for his long and non-violent struggle for fundamental human rights in China"', year: '2010' },
  { org: 'European Parliament', action: 'Passed resolution condemning his imprisonment and calling for his release (Resolution 2010/C 305 E/02)', year: '2010' },
  { org: 'US Government', action: 'Called for immediate release; CECC and Tom Lantos Commission held hearings. Secretary Clinton called his sentencing "a violation of internationally recognized norms"', year: '2009-2017' },
  { org: 'PEN International', action: 'Named him Honorary Member; PEN America awarded him the Barbara Goldsmith Freedom to Write Award (2009)', year: '2009' },
  { org: 'Human Rights Watch', action: 'Called his death "a tragedy" and said "the government bore heavy responsibility for his death." Demanded accountability for denied medical treatment', year: '2017' },
  { org: 'Amnesty International', action: 'Designated him a prisoner of conscience. Called his death "a final alarmingly China is heading in a more repressive direction." Campaigned for Liu Xia\'s release', year: '2009-2018' },
  { org: 'German Government', action: 'Offered to treat Liu in German hospitals (denied by China). Successfully negotiated Liu Xia\'s release to Berlin in July 2018', year: '2017-2018' },
  { org: 'UN Human Rights Experts', action: 'Multiple UN Special Rapporteurs called for his release. The UN Working Group on Arbitrary Detention declared his detention arbitrary', year: '2009-2017' },
];

const SOURCES = [
  { name: 'NobelPrize.org', url: 'https://www.nobelprize.org/prizes/peace/2010/xiaobo/biographical/', tier: 1, description: 'Official Nobel Prize biography and award documentation' },
  { name: 'Human Rights Watch', url: 'https://www.hrw.org/news/2017/07/13/china-democratic-voice-liu-xiaobo-dies-custody', tier: 1, description: 'Obituary and documentation of death in custody' },
  { name: 'BBC News', url: 'https://www.bbc.com/news/world-asia-china-40597514', tier: 1, description: 'Death coverage with verified timeline' },
  { name: 'NCHRD', url: 'https://www.nchrd.org/2017/07/prisoner-of-conscience-liu-xiaobo/', tier: 1, description: 'Chinese Human Rights Defenders — comprehensive prisoner profile' },
  { name: 'Britannica', url: 'https://www.britannica.com/biography/Liu-Xiaobo', tier: 1, description: 'Encyclopedic biography with verified facts' },
  { name: 'PEN International', url: 'https://pen.org/advocacy-case/liu-xiaobo/', tier: 1, description: 'Advocacy case file and freedom of expression analysis' },
  { name: 'Freedom Now', url: 'https://www.freedom-now.org/cases/liu-xiaobo/', tier: 1, description: 'Legal case documentation' },
  { name: 'Front Line Defenders', url: 'https://www.frontlinedefenders.org/en/case/case-history-liu-xia', tier: 1, description: 'Liu Xia case history and timeline' },
  { name: 'European Parliament', url: 'https://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:C:2010:305E:0009:0011:EN:PDF', tier: 1, description: 'Official EU resolution on human rights violations' },
  { name: 'The Guardian', url: 'https://www.theguardian.com/world/2017/jul/15/liu-xiaobo-sea-burial-mourning-china', tier: 2, description: 'Sea burial coverage and family pressure reporting' },
  { name: 'HKFP', url: 'https://hongkongfp.com/2017/07/14/full-charter-08-liu-xiaobos-pro-democracy-manifesto-china-led-jailing/', tier: 2, description: 'Full text of Charter 08 in English' },
];

// ─── CATEGORY COLORS ───────────────────────────────────────────────
const categoryColors = {
  life: 'bg-gray-500',
  academic: 'bg-blue-500',
  political: 'bg-amber-500',
  persecution: 'bg-red-600',
  international: 'bg-yellow-500',
  medical: 'bg-orange-500',
  memorial: 'bg-gray-800',
  legacy: 'bg-emerald-500',
};

const categoryLabels = {
  life: 'Personal',
  academic: 'Academic',
  political: 'Political',
  persecution: 'Persecution',
  international: 'International',
  medical: 'Medical',
  memorial: 'Memorial',
  legacy: 'Legacy',
};

// ─── TABS ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'charges', label: 'Charter 08 & Charges', icon: Scale },
  { id: 'narratives', label: 'CCP Narratives', icon: Shield },
  { id: 'legacy', label: 'Legacy & Impact', icon: Award },
  { id: 'sources', label: 'Sources', icon: FileText },
];

export default function LiuXiaoboProfile() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [expandedEvents, setExpandedEvents] = useState({});

  const toggleEvent = (index) => {
    setExpandedEvents(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Back Navigation */}
      <div className="bg-gray-900/80 border-b border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <Link to="/take-action" className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Take Action
          </Link>
        </div>
      </div>

      {/* Profile Header — Memorial Theme (Dark with Gold Nobel accent) */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-yellow-600/30">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center border-2 border-yellow-500/60">
              <User className="w-10 h-10 text-yellow-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-white">{PROFILE.name}</h1>
                <span className="text-xl text-gray-400">{PROFILE.chineseName}</span>
              </div>
              <p className="text-gray-300 mb-3">{PROFILE.occupation}</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {PROFILE.birthDate} — {PROFILE.deathDate}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {PROFILE.birthPlace}
                </span>
                <span className="px-3 py-1 rounded-full bg-yellow-900/40 text-yellow-300 border border-yellow-700 flex items-center gap-1">
                  <Award className="w-3 h-3" /> Nobel Peace Prize 2010
                </span>
              </div>
              <div className="mt-3">
                <span className="px-4 py-1.5 rounded-full bg-gray-800 text-gray-300 border border-gray-600 text-sm font-semibold inline-flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-red-400" />
                  {PROFILE.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Died age {PROFILE.ageAtDeath} • {PROFILE.deathPlace} • First Nobel Peace Prize laureate to die in state custody since Carl von Ossietzky (Nazi Germany, 1938)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-900/90 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-yellow-400 text-yellow-400'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ─── TIMELINE TAB ─────────────────────────────────────── */}
        {activeTab === 'timeline' && (
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Clock className="w-6 h-6 text-yellow-400" />
              Life Timeline
            </h2>
            <p className="text-gray-400 mb-6">
              From literary critic to China&apos;s most famous political prisoner — and the empty chair that shook a superpower.
            </p>

            {/* Category Legend */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <span key={key} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className={`w-2.5 h-2.5 rounded-full ${categoryColors[key]}`} />
                  {label}
                </span>
              ))}
            </div>

            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700" />
              {TIMELINE.map((event, i) => (
                <div key={i} className="relative pl-10 pb-6" aria-label={`${event.year}: ${event.title}`}>
                  <div className={`absolute left-2.5 w-3.5 h-3.5 rounded-full border-2 border-gray-950 ${categoryColors[event.category] || 'bg-gray-500'}`} />
                  <button
                    onClick={() => toggleEvent(i)}
                    className="w-full text-left group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs text-gray-500 font-mono">{event.year}</span>
                        <h3 className="text-white font-semibold group-hover:text-yellow-300 transition-colors">
                          {event.title}
                        </h3>
                      </div>
                      {expandedEvents[i] ? <ChevronUp className="w-4 h-4 text-gray-500 mt-1" /> : <ChevronDown className="w-4 h-4 text-gray-500 mt-1" />}
                    </div>
                  </button>
                  {expandedEvents[i] && (
                    <div className="mt-2 p-3 bg-gray-800/60 rounded-lg border border-gray-700 text-sm text-gray-300">
                      {event.detail}
                      {event.source && (
                        <a href={event.source} target="_blank" rel="noopener noreferrer" className="block mt-2 text-yellow-400 hover:text-yellow-300 text-xs flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" /> Source
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── CHARGES TAB ──────────────────────────────────────── */}
        {activeTab === 'charges' && (
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Scale className="w-6 h-6 text-yellow-400" />
              Charter 08 & Criminal Charges
            </h2>
            <p className="text-gray-400 mb-6">
              Imprisoned for 11 years for writing words about democracy. His &quot;crime&quot; was co-authoring a document calling for the same rights that exist in every democratic nation.
            </p>

            {/* Charter 08 Summary */}
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-5 mb-6">
              <h3 className="text-lg font-bold text-yellow-300 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" /> What Is Charter 08?
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Charter 08 (零八宪章) is a manifesto released on December 10, 2008 (International Human Rights Day), inspired by Czechoslovakia&apos;s Charter 77. Co-authored by Liu Xiaobo and initially signed by over 300 Chinese intellectuals and activists, it eventually gathered more than 10,000 signatures. It called for:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {CHARTER_08_DEMANDS.map((demand, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    {demand}
                  </li>
                ))}
              </ul>
              <p className="text-gray-400 text-xs mt-4">
                Full text available at:{' '}
                <a href="https://hongkongfp.com/2017/07/14/full-charter-08-liu-xiaobos-pro-democracy-manifesto-china-led-jailing/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300">
                  HKFP — Charter 08 in English <ExternalLink className="w-3 h-3 inline" />
                </a>
              </p>
            </div>

            {/* Formal Charges */}
            {CHARGES.map((c, i) => (
              <div key={i} className="bg-gray-800/60 border border-gray-700 rounded-lg p-5 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-bold">{c.charge}</h3>
                    <p className="text-gray-400 text-xs mt-1">{c.article}</p>
                    <p className="text-gray-300 text-sm mt-3">{c.evidence}</p>
                    <div className="mt-3 px-3 py-2 bg-red-900/30 border border-red-700/50 rounded text-sm">
                      <span className="text-red-300 font-semibold">Verdict: </span>
                      <span className="text-gray-300">{c.verdict}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Trial Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {[
                { label: 'Trial Duration', value: '~2 hours', sub: 'Dec 23, 2009' },
                { label: 'Prison Sentence', value: '11 years', sub: 'Dec 25, 2009' },
                { label: 'Times Imprisoned', value: '4 times', sub: '1989, 1995, 1996, 2008' },
                { label: 'Years in Detention', value: '~17 total', sub: 'Across all detentions' },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-800/40 border border-gray-700 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-yellow-400">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Liu Xia Section */}
            <div className="mt-6 bg-gray-800/40 border border-gray-700 rounded-lg p-5">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                Liu Xia — Punished for Loving Him
              </h3>
              <p className="text-gray-300 text-sm mb-3">
                Liu Xia (刘霞), a poet and artist, married Liu Xiaobo in 1996 while he was serving his third prison term. She was never charged with any crime, yet she became one of China&apos;s most prominent victims of collective punishment:
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span><strong>2010:</strong> Placed under house arrest immediately after Liu Xiaobo won the Nobel Prize. No legal basis. No charges.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span><strong>2010-2018:</strong> 8 years of house arrest. Suffered severe depression. Rarely allowed to leave home. Phone monitored. Visitors blocked.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span><strong>2017:</strong> Allowed brief visits to Liu Xiaobo in hospital before his death. Prevented from speaking publicly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span><strong>July 10, 2018:</strong> Finally permitted to leave China for Berlin, Germany, following intense diplomatic pressure. Currently resides in Germany.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ─── CCP NARRATIVES TAB ───────────────────────────────── */}
        {activeTab === 'narratives' && (
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Shield className="w-6 h-6 text-yellow-400" />
              CCP Narrative Analysis
            </h2>
            <p className="text-gray-400 mb-6">
              What the CCP claims vs. what independent evidence shows. Zero CCP state media sources used below.
            </p>

            <div className="space-y-4">
              {CCP_NARRATIVES.map((n, i) => (
                <div key={i} className="bg-gray-800/60 border border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-red-900/30 px-5 py-3 border-b border-red-800/30">
                    <h3 className="text-red-300 font-semibold text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      CCP CLAIM: {n.claim}
                    </h3>
                  </div>
                  <div className="px-5 py-4">
                    <h4 className="text-emerald-400 font-semibold text-sm mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      REALITY:
                    </h4>
                    <p className="text-gray-300 text-sm">{n.reality}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {n.sources.map((s, j) => (
                        <span key={j} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-gray-800/40 border border-gray-700 rounded-lg p-4 text-sm text-gray-400">
              <strong className="text-gray-300">Source methodology:</strong> All rebuttals sourced from independent international media and human rights organizations. Deliberately excluded: Xinhua, People&apos;s Daily, Global Times, CGTN, China Daily, en.people.cn, and all other CCP-affiliated state media. One People&apos;s Daily English editorial (en.people.cn) was identified as CCP propaganda during research and excluded.
            </div>
          </div>
        )}

        {/* ─── LEGACY TAB ───────────────────────────────────────── */}
        {activeTab === 'legacy' && (
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-400" />
              Legacy & International Impact
            </h2>
            <p className="text-gray-400 mb-6">
              Liu Xiaobo&apos;s legacy transcends his imprisonment and death. His words and courage continue to inspire movements for democracy worldwide.
            </p>

            {/* Awards */}
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-5 mb-6">
              <h3 className="text-lg font-bold text-yellow-300 mb-3 flex items-center gap-2">
                <Star className="w-5 h-5" /> Awards & Honors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { award: 'Nobel Peace Prize', year: '2010', org: 'Norwegian Nobel Committee', note: 'Presented to an empty chair — one of history\'s most powerful images of repression' },
                  { award: 'PEN/Barbara Goldsmith Freedom to Write Award', year: '2009', org: 'PEN America', note: 'For outstanding courage in defense of free expression' },
                  { award: 'Homo Homini Award', year: '2009', org: 'People in Need', note: 'For contribution to the defense of human rights' },
                  { award: 'Honorary Member', year: '2010', org: 'PEN International', note: 'Lifetime honorary membership for imprisoned writers' },
                ].map((a, i) => (
                  <div key={i} className="bg-gray-800/60 border border-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span className="text-white font-semibold text-sm">{a.award}</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">{a.org} • {a.year}</p>
                    <p className="text-gray-300 text-xs mt-1">{a.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* International Response */}
            <h3 className="text-lg font-bold text-white mb-3">International Response</h3>
            <div className="space-y-3">
              {INTERNATIONAL_RESPONSES.map((r, i) => (
                <div key={i} className="flex items-start gap-3 bg-gray-800/40 border border-gray-700 rounded-lg p-4">
                  <Flag className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold text-sm">{r.org}</h4>
                    <p className="text-gray-300 text-sm mt-1">{r.action}</p>
                    <span className="text-gray-500 text-xs">{r.year}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Historical Significance */}
            <div className="mt-6 bg-gray-800/40 border border-gray-700 rounded-lg p-5">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-yellow-400" />
                Historical Significance
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  Liu Xiaobo is the <strong className="text-white">only Nobel Peace Prize laureate to have died in state custody since Carl von Ossietzky</strong>, who died under Nazi surveillance in 1938. The parallel is deliberate and damning — it places the CCP&apos;s treatment of political dissidents in the same historical category as fascist regimes.
                </p>
                <p>
                  The <strong className="text-white">empty chair at the 2010 Nobel ceremony</strong> became one of the most enduring images of 21st-century political repression. It demonstrated that while China could imprison a man, it could not imprison his ideas.
                </p>
                <p>
                  Charter 08 remains a living document. Its demands — constitutional democracy, separation of powers, free elections, human rights — represent the aspirations of millions of Chinese citizens who cannot voice them. Liu paid for these words with his freedom and ultimately his life.
                </p>
              </div>
            </div>

            {/* Final Words */}
            <div className="mt-6 bg-gray-900 border border-yellow-700/30 rounded-lg p-5 text-center">
              <blockquote className="text-lg italic text-yellow-300 mb-3">
                &quot;I have no enemies and no hatred.&quot;
              </blockquote>
              <p className="text-gray-400 text-sm">
                — Liu Xiaobo, statement prepared for his trial, December 23, 2009
              </p>
              <p className="text-gray-500 text-xs mt-2">
                His full statement, titled &quot;I Have No Enemies: My Final Statement,&quot; was read by his wife Liu Xia at the Nobel ceremony. In it, he forgave his persecutors and expressed hope for China&apos;s future.
              </p>
            </div>
          </div>
        )}

        {/* ─── SOURCES TAB ──────────────────────────────────────── */}
        {activeTab === 'sources' && (
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <FileText className="w-6 h-6 text-yellow-400" />
              Sources & References
            </h2>
            <p className="text-gray-400 mb-6">
              {SOURCES.length} sources used for this profile. Zero CCP state media outlets cited.
            </p>

            <div className="space-y-3">
              {SOURCES.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 bg-gray-800/40 border border-gray-700 rounded-lg p-4 hover:border-yellow-600 transition-colors group"
                >
                  <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    s.tier === 1 ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700' : 'bg-blue-900/50 text-blue-300 border border-blue-700'
                  }`}>
                    T{s.tier}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm group-hover:text-yellow-300 transition-colors flex items-center gap-1">
                      {s.name} <ExternalLink className="w-3 h-3 opacity-50" />
                    </h4>
                    <p className="text-gray-400 text-xs mt-0.5">{s.description}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-6 bg-gray-800/40 border border-gray-700 rounded-lg p-4 text-sm text-gray-400">
              <strong className="text-gray-300">Source tier definitions:</strong>
              <ul className="mt-2 space-y-1">
                <li><span className="text-emerald-400">Tier 1 (Gold standard):</span> Government records, Nobel Committee, BBC, HRW, Amnesty, NCHRD, Britannica, Freedom Now, PEN, European Parliament</li>
                <li><span className="text-blue-400">Tier 2 (Reliable):</span> HKFP, The Guardian — editorially independent, well-sourced</li>
              </ul>
              <p className="mt-2"><strong className="text-gray-300">Excluded:</strong> Xinhua, People&apos;s Daily, Global Times, CGTN, China Daily, en.people.cn, and all other CCP-affiliated state media</p>
            </div>
          </div>
        )}
      </div>

      <GlobalDisclaimer />
    </div>
  );
}
