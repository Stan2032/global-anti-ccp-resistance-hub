import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlobalDisclaimer from '../../components/ui/GlobalDisclaimer';
import {
  User, Calendar, MapPin, Scale, AlertTriangle, ExternalLink,
  ChevronDown, ChevronUp, Globe, FileText, BookOpen, Clock,
  ArrowLeft, Shield, Newspaper, Flag, Heart
} from 'lucide-react';

// ─── DATA ──────────────────────────────────────────────────────────
// All dates verified against BBC, HKFP, CPJ, HRW, US State Dept.
// See _agents/thoughts/SESSION_34_VERIFICATION_NOTES.md for verification methodology.
// CCP narrative rebuttals sourced from independent media, not CCP state outlets.

const PROFILE = {
  name: 'Jimmy Lai',
  chineseName: '黎智英',
  birthDate: 'December 8, 1947',
  birthPlace: 'Guangzhou, Guangdong, China',
  nationality: 'British (Hong Kong permanent resident)',
  status: 'IMPRISONED',
  currentLocation: 'Stanley Prison, Hong Kong',
  sentence: '20 years',
  age: 78,
  occupation: 'Media Entrepreneur, Publisher, Pro-Democracy Advocate',
};

const TIMELINE = [
  {
    date: '1947-12-08',
    year: '1947',
    title: 'Born in Guangzhou, China',
    detail: 'Born into poverty during the Chinese Civil War. His father disappeared when he was young, and his mother struggled to support the family under CCP rule.',
    category: 'life',
  },
  {
    date: '1960',
    year: '1960',
    title: 'Fled to Hong Kong as a stowaway',
    detail: 'At age 12, smuggled himself aboard a boat to Hong Kong with nothing. Worked in a garment factory. A foreign sailor gave him a bar of chocolate — his first taste of Western freedom, which he later said shaped his worldview.',
    category: 'life',
  },
  {
    date: '1981',
    year: '1981',
    title: 'Founded Giordano clothing chain',
    detail: 'Built Giordano into one of Asia\'s largest clothing retailers. Later forced out of the company after criticizing Li Peng (Chinese Premier responsible for Tiananmen Square massacre) on a Giordano T-shirt.',
    category: 'business',
  },
  {
    date: '1989-06-04',
    year: '1989',
    title: 'Tiananmen Square massacre',
    detail: 'The massacre deeply affected Lai. He became an outspoken critic of the CCP and began channeling his business success into media advocacy for democracy.',
    category: 'political',
  },
  {
    date: '1995-06-20',
    year: '1995',
    title: 'Founded Apple Daily',
    detail: 'Launched Apple Daily (蘋果日報), which became Hong Kong\'s most-read pro-democracy newspaper. The paper\'s confrontational editorial style and willingness to criticize Beijing made it a CCP target from day one.',
    category: 'business',
    source: 'https://cpj.org/data/people/jimmy-lai/',
  },
  {
    date: '2014',
    year: '2014',
    title: 'Umbrella Movement support',
    detail: 'Publicly supported the Umbrella Movement\'s demands for genuine universal suffrage in Hong Kong. Apple Daily provided extensive coverage of the 79-day occupation. CCP-linked media began targeting Lai personally.',
    category: 'political',
  },
  {
    date: '2019-07',
    year: '2019',
    title: 'Apple Daily covers mass protests',
    detail: 'Apple Daily provided critical coverage of the anti-extradition bill protests. Lai met with US Vice President Mike Pence, Secretary of State Mike Pompeo, and Speaker Nancy Pelosi in Washington. CCP state media labeled him the "black hand" behind the protests.',
    category: 'political',
    source: 'https://hongkongfp.com/tag/jimmy-lai/',
  },
  {
    date: '2020-06-30',
    year: '2020',
    title: 'National Security Law enacted',
    detail: 'Beijing imposed the Hong Kong National Security Law, criminalizing secession, subversion, terrorism, and "collusion with foreign forces" — with penalties up to life imprisonment. The law was widely seen as targeting Lai and Apple Daily.',
    category: 'legal',
    source: 'https://www.bbc.com/news/world-asia-china-52765838',
  },
  {
    date: '2020-08-10',
    year: '2020',
    title: 'Arrested under National Security Law',
    detail: 'Approximately 200 police officers raided Apple Daily\'s newsroom. Lai was arrested along with his two sons and other executives. Images of police rifling through newsroom computers became a global symbol of press freedom under attack.',
    category: 'legal',
    source: 'https://www.bbc.com/news/world-asia-china-53742956',
  },
  {
    date: '2020-12-03',
    year: '2020',
    title: 'Denied bail, remanded in custody',
    detail: 'Hong Kong\'s Court of Final Appeal denied bail. Lai has been continuously detained since this date — over 5 years without freedom.',
    category: 'legal',
  },
  {
    date: '2021-06-17',
    year: '2021',
    title: 'Apple Daily assets frozen',
    detail: 'Hong Kong\'s Security Bureau froze HK$18 million (~US$2.3 million) of assets belonging to three companies linked to Apple Daily, making it impossible to operate.',
    category: 'legal',
    source: 'https://hongkongfp.com/2021/06/17/breaking-hong-kong-freezes-apple-daily-assets-citing-national-security-law/',
  },
  {
    date: '2021-06-24',
    year: '2021',
    title: 'Apple Daily forced to close',
    detail: 'After 26 years of publication, Apple Daily printed its final edition. One million copies sold out within hours, up from its usual 80,000. Hong Kong residents queued through the night to buy the last issue. The closure marked the effective end of press freedom in Hong Kong.',
    category: 'legal',
    source: 'https://www.bbc.com/news/world-asia-china-57578926',
  },
  {
    date: '2021-12-13',
    year: '2021',
    title: 'NSL trial begins',
    detail: 'Trial commenced before three designated National Security Law judges, without a jury — a departure from Hong Kong\'s common law tradition. The prosecution\'s case rested heavily on Apple Daily articles and Lai\'s social media posts.',
    category: 'legal',
  },
  {
    date: '2023-12-18',
    year: '2023',
    title: 'Trial resumes after delays',
    detail: 'After repeated adjournments, the trial resumed. It would span 156 court days — one of the longest criminal trials in Hong Kong history.',
    category: 'legal',
  },
  {
    date: '2025-12-15',
    year: '2025',
    title: 'Found GUILTY on all charges',
    detail: 'Judge Esther Toh delivered the verdict: guilty on all three charges — conspiracy to collude with foreign forces (NSL Article 29), conspiracy to publish seditious publications, and sedition. The judgment relied heavily on Lai\'s journalistic activities and meetings with foreign officials as evidence of "collusion."',
    category: 'legal',
    source: 'https://www.bbc.com/news/articles/cp844kjj37vo',
  },
  {
    date: '2026-02-09',
    year: '2026',
    title: 'Sentenced to 20 years in prison',
    detail: 'Sentenced to 20 years — the harshest sentence yet under the NSL. At 78 years old, it is effectively a life sentence. Lai showed no visible reaction as the sentence was read.',
    category: 'legal',
    source: 'https://www.hrw.org/news/2026/02/09/hong-kong-jimmy-lai-sentenced-20-years',
  },
];

const CHARGES = [
  {
    charge: 'Conspiracy to collude with foreign forces',
    law: 'National Security Law, Article 29',
    maxPenalty: 'Life imprisonment',
    evidence: 'Apple Daily articles critical of Beijing; meetings with US officials (Pompeo, Pence, Pelosi); social media posts calling for international sanctions against Hong Kong officials.',
    analysis: 'The prosecution treated standard journalistic activities — publishing, meeting officials, social media — as criminal "collusion." This effectively criminalizes press freedom itself.',
  },
  {
    charge: 'Conspiracy to publish seditious publications',
    law: 'Colonial-era sedition law (Crimes Ordinance, s.10)',
    maxPenalty: '2 years per count',
    evidence: 'Apple Daily editorials criticizing the Hong Kong and Beijing governments.',
    analysis: 'Ironically, the CCP used a British colonial-era law (which the UK itself would consider incompatible with free speech) to prosecute a journalist for criticizing the government.',
  },
  {
    charge: 'Sedition',
    law: 'Colonial-era sedition law (Crimes Ordinance, s.10)',
    maxPenalty: '2 years per count',
    evidence: 'Personal social media posts and public statements.',
    analysis: 'Lai\'s personal expression was treated as seditious — a standard so broad that virtually any criticism of the government could qualify.',
  },
];

const CCP_NARRATIVES = [
  {
    claim: '"Jimmy Lai is a foreign agent who conspired with Western governments to destabilize Hong Kong."',
    reality: 'Lai is a Hong Kong businessman who exercised his right to freedom of expression and association. Meeting with foreign officials is standard practice for business leaders, media owners, and civil society figures worldwide. The US, UK, EU, and every major press freedom organization has condemned the charges.',
    sources: ['HRW', 'CPJ', 'Amnesty International', 'RSF'],
  },
  {
    claim: '"Apple Daily was a propaganda tool, not real journalism."',
    reality: 'Apple Daily was Hong Kong\'s most-read newspaper for 26 years, operating under Hong Kong\'s pre-NSL legal framework which guaranteed press freedom under the Basic Law (Article 27). It won multiple journalism awards and was registered as a legitimate news organization.',
    sources: ['CPJ', 'HKFP', 'RSF World Press Freedom Index'],
  },
  {
    claim: '"The trial was fair and followed rule of law."',
    reality: 'The trial was conducted without a jury (contrary to Hong Kong common law tradition), before hand-picked "designated judges," under a law imposed by Beijing without Hong Kong legislative process. The UN Human Rights Committee, the International Bar Association, and multiple bar associations have criticized the NSL\'s incompatibility with fair trial standards.',
    sources: ['UN Human Rights Committee', 'International Bar Association', 'Hong Kong Bar Association'],
  },
  {
    claim: '"Lai could have faced life imprisonment but received a lesser sentence, showing judicial leniency."',
    reality: '20 years for a 78-year-old man is effectively a life sentence. The charge carried a maximum of life imprisonment not because the conduct warranted it, but because the NSL was designed as a tool of political repression with deliberately extreme penalties.',
    sources: ['HRW', 'Amnesty International'],
  },
];

const INTERNATIONAL_RESPONSES = [
  {
    entity: 'United Kingdom',
    response: 'Foreign Secretary David Lammy condemned the verdict, calling it "politically motivated." Summoned Chinese ambassador. UK government has repeatedly called for Lai\'s release, noting his British citizenship.',
    source: 'https://www.gov.uk/government/news/hong-kong-foreign-secretary-statement-on-jimmy-lai-verdict',
  },
  {
    entity: 'United States',
    response: 'State Department spokesperson called for Lai\'s "immediate and unconditional release." Bipartisan Congressional statements condemned the sentencing.',
    source: 'https://www.state.gov/press-releases/',
  },
  {
    entity: 'European Union',
    response: 'EU High Representative issued statement expressing "grave concern" and calling the verdict "incompatible with international human rights obligations."',
    source: 'https://www.eeas.europa.eu/',
  },
  {
    entity: 'Canada',
    response: 'Foreign Minister called verdict "deeply troubling" and reaffirmed Canada\'s commitment to press freedom.',
    source: 'https://www.canada.ca/en/global-affairs.html',
  },
  {
    entity: 'Committee to Protect Journalists',
    response: 'Named Lai one of the world\'s most urgent press freedom cases. Called his prosecution "the clearest example of how the NSL is used to silence independent media."',
    source: 'https://cpj.org/data/people/jimmy-lai/',
  },
  {
    entity: 'Reporters Without Borders',
    response: 'Condemned the sentencing and called on all democratic governments to exert pressure for Lai\'s release.',
    source: 'https://rsf.org/en/jimmy-lai',
  },
];

const SOURCES = [
  { name: 'BBC News', url: 'https://www.bbc.com/news/world-asia-china-53742956', tier: 1 },
  { name: 'Hong Kong Free Press', url: 'https://hongkongfp.com/tag/jimmy-lai/', tier: 1 },
  { name: 'Committee to Protect Journalists', url: 'https://cpj.org/data/people/jimmy-lai/', tier: 1 },
  { name: 'Human Rights Watch', url: 'https://www.hrw.org/tag/jimmy-lai', tier: 1 },
  { name: 'Amnesty International', url: 'https://www.amnesty.org/en/latest/news/?topic=jimmy-lai', tier: 1 },
  { name: 'Reporters Without Borders', url: 'https://rsf.org/en/jimmy-lai', tier: 1 },
  { name: 'US State Department', url: 'https://www.state.gov/', tier: 1 },
  { name: 'Tom Lantos Human Rights Commission', url: 'https://humanrightscommission.house.gov/', tier: 1 },
];

// ─── COMPONENT ─────────────────────────────────────────────────────

const categoryColors = {
  life: 'border-blue-500 bg-blue-500/10',
  business: 'border-emerald-500 bg-emerald-500/10',
  political: 'border-amber-500 bg-amber-500/10',
  legal: 'border-red-500 bg-red-500/10',
};

const categoryLabels = {
  life: 'Personal',
  business: 'Business',
  political: 'Political',
  legal: 'Legal',
};

export default function JimmyLaiProfile() {
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [showAllNarratives, setShowAllNarratives] = useState(false);
  const [activeSection, setActiveSection] = useState('timeline');

  const sections = [
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'charges', label: 'Charges & Verdict', icon: Scale },
    { id: 'narratives', label: 'CCP Narrative Analysis', icon: Shield },
    { id: 'international', label: 'International Response', icon: Globe },
    { id: 'sources', label: 'Sources', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <GlobalDisclaimer />

      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/30 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link
            to="/prisoners"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Political Prisoners
          </Link>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold">{PROFILE.name}</h1>
                <span className="text-lg text-slate-400">{PROFILE.chineseName}</span>
              </div>
              <p className="text-slate-300 mb-2">{PROFILE.occupation}</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="px-2 py-0.5 bg-red-600/30 text-red-300 rounded border border-red-500/30">
                  {PROFILE.status} — {PROFILE.sentence}
                </span>
                <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded">
                  <MapPin className="w-3 h-3 inline mr-1" />{PROFILE.currentLocation}
                </span>
                <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded">
                  Age {PROFILE.age} · {PROFILE.nationality}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="sticky top-14 z-40 bg-slate-800/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex overflow-x-auto gap-1 py-1" role="tablist" aria-label="Profile sections">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                role="tab"
                aria-selected={activeSection === id}
                className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm whitespace-nowrap transition-colors ${
                  activeSection === id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Timeline Section */}
        {activeSection === 'timeline' && (
          <section aria-label="Timeline">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Complete Timeline
            </h2>

            {/* Category Legend */}
            <div className="flex flex-wrap gap-3 mb-6 text-xs">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <span key={key} className={`px-2 py-1 rounded border ${categoryColors[key]}`}>
                  {label}
                </span>
              ))}
            </div>

            <div className="space-y-3">
              {TIMELINE.map((event, i) => (
                <div
                  key={i}
                  className={`border-l-2 pl-4 py-2 cursor-pointer transition-colors rounded-r ${categoryColors[event.category]} hover:bg-slate-800/50`}
                  onClick={() => setExpandedEvent(expandedEvent === i ? null : i)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={expandedEvent === i}
                  aria-label={`${event.year}: ${event.title}`}
                  onKeyDown={(e) => e.key === 'Enter' && setExpandedEvent(expandedEvent === i ? null : i)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-mono min-w-[60px]">{event.year}</span>
                        <h3 className="font-medium text-sm">{event.title}</h3>
                      </div>
                      {expandedEvent === i && (
                        <div className="mt-2 text-sm text-slate-300 leading-relaxed">
                          <p>{event.detail}</p>
                          {event.source && (
                            <a
                              href={event.source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-1 text-blue-400 hover:text-blue-300 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3 h-3" />
                              Source
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    {expandedEvent === i ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Charges & Verdict Section */}
        {activeSection === 'charges' && (
          <section aria-label="Charges and verdict">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-red-400" />
              Charges & Verdict
            </h2>

            {/* Verdict Banner */}
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="font-bold text-red-300">GUILTY — All Charges</span>
              </div>
              <p className="text-sm text-slate-300">
                On <strong>December 15, 2025</strong>, three designated NSL judges (without jury) found Lai guilty on all charges.
                On <strong>February 9, 2026</strong>, he was sentenced to <strong>20 years in prison</strong> — the harshest NSL sentence to date.
                At 78, this is effectively a life sentence.
              </p>
            </div>

            {/* Individual Charges */}
            <div className="space-y-4">
              {CHARGES.map((charge, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <h3 className="font-bold text-red-300 mb-1">{charge.charge}</h3>
                  <p className="text-xs text-slate-400 mb-2">{charge.law} · Max: {charge.maxPenalty}</p>
                  <div className="text-sm text-slate-300 space-y-2">
                    <div>
                      <span className="text-slate-400 font-medium">Evidence cited:</span>
                      <p>{charge.evidence}</p>
                    </div>
                    <div>
                      <span className="text-amber-400 font-medium">Analysis:</span>
                      <p>{charge.analysis}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trial Statistics */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { label: 'Court Days', value: '156' },
                { label: 'Days Detained', value: `${Math.floor((new Date('2026-02-20') - new Date('2020-12-03')) / (1000 * 60 * 60 * 24))}+` },
                { label: 'Sentence', value: '20 years' },
                { label: 'Jury', value: 'None' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                  <div className="text-lg font-bold text-white">{value}</div>
                  <div className="text-xs text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CCP Narrative Analysis Section */}
        {activeSection === 'narratives' && (
          <section aria-label="CCP narrative analysis">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              CCP Narrative Analysis
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              The CCP deploys specific narratives to justify Lai&apos;s imprisonment. Below is each claim with sourced rebuttals.
              None of the rebuttals cite CCP state media (Xinhua, CGTN, Global Times, People&apos;s Daily).
            </p>

            <div className="space-y-4">
              {(showAllNarratives ? CCP_NARRATIVES : CCP_NARRATIVES.slice(0, 2)).map((item, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                  <div className="bg-red-900/20 px-4 py-2 border-b border-slate-700">
                    <span className="text-xs text-red-400 font-bold uppercase">CCP Claim</span>
                    <p className="text-sm text-red-300 mt-1">{item.claim}</p>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-xs text-emerald-400 font-bold uppercase">Reality</span>
                    <p className="text-sm text-slate-300 mt-1">{item.reality}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.sources.map((src) => (
                        <span key={src} className="text-xs px-2 py-0.5 bg-slate-700 text-slate-400 rounded">
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {CCP_NARRATIVES.length > 2 && (
              <button
                onClick={() => setShowAllNarratives(!showAllNarratives)}
                className="mt-3 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                {showAllNarratives ? (
                  <>Show less <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>Show {CCP_NARRATIVES.length - 2} more narratives <ChevronDown className="w-4 h-4" /></>
                )}
              </button>
            )}
          </section>
        )}

        {/* International Response Section */}
        {activeSection === 'international' && (
          <section aria-label="International response">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              International Response
            </h2>

            <div className="space-y-3">
              {INTERNATIONAL_RESPONSES.map((response, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-blue-300">{response.entity}</h3>
                    <a
                      href={response.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-blue-400 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Source
                    </a>
                  </div>
                  <p className="text-sm text-slate-300">{response.response}</p>
                </div>
              ))}
            </div>

            {/* How to Help */}
            <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h3 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                How You Can Help
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { action: 'Contact your representative', desc: 'Ask them to raise Lai\'s case with the Chinese government' },
                  { action: 'Support HKDC', link: 'https://hongkongdc.org', desc: 'Hong Kong Democracy Council' },
                  { action: 'Share on social media', desc: 'Use #FreeJimmyLai and #StandWithHongKong' },
                  { action: 'Support CPJ', link: 'https://cpj.org', desc: 'Committee to Protect Journalists' },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-800 rounded p-3 text-sm">
                    <p className="font-medium text-white">{item.action}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 mt-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Visit
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sources Section */}
        {activeSection === 'sources' && (
          <section aria-label="Sources">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              Sources
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              All sources are independent, non-CCP media. No CCP state outlets (Xinhua, CGTN, Global Times, People&apos;s Daily, CCTV) are cited.
            </p>

            <div className="space-y-2">
              {SOURCES.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg p-3 hover:bg-slate-750 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${source.tier === 1 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="text-sm font-medium text-white">{source.name}</span>
                    <span className="text-xs text-slate-500">Tier {source.tier}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
