import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlobalDisclaimer from '../../components/ui/GlobalDisclaimer';
import {
  User, Calendar, MapPin, Scale, AlertTriangle, ExternalLink,
  ChevronDown, ChevronUp, Globe, FileText, BookOpen, Clock,
  ArrowLeft, Shield, Newspaper, Flag, Heart, Eye
} from 'lucide-react';

// ─── DATA ──────────────────────────────────────────────────────────
// All dates verified against HRW, ICT, TCHRD, USCIRF, NED.
// See _agents/thoughts/SESSION_45_PANCHEN_LAMA_PROFILE.md for verification methodology.
// CCP narrative rebuttals sourced from independent media, not CCP state outlets.
// Note: tibet.cn is a CCP state outlet — deliberately excluded from sources.

const PROFILE = {
  name: 'Gedhun Choekyi Nyima',
  tibetanName: '根敦确吉尼玛',
  title: '11th Panchen Lama',
  birthDate: 'April 25, 1989',
  birthPlace: 'Lhari County, Nagqu Prefecture, Tibet',
  nationality: 'Tibetan',
  status: 'DISAPPEARED',
  currentLocation: 'Unknown — not seen since May 17, 1995',
  sentence: 'None — extrajudicial enforced disappearance',
  ageAtAbduction: 6,
  currentAge: 36,
  yearsMissing: 30,
  occupation: '11th Panchen Lama (recognized by the 14th Dalai Lama)',
  parents: 'Konchok Phuntsok (father) and Dechen Chodon (mother)',
  significance: 'Second-highest spiritual leader in Tibetan Buddhism. The Panchen Lama and Dalai Lama historically recognize each other\'s reincarnations — control of the Panchen Lama gives the CCP leverage over the Dalai Lama\'s succession.',
};

const TIMELINE = [
  {
    date: '1989-01-28',
    year: '1989',
    title: '10th Panchen Lama dies at Tashilhunpo Monastery',
    detail: 'Choekyi Gyaltsen, the 10th Panchen Lama, died suddenly at age 50 at Tashilhunpo Monastery in Shigatse, Tibet. Just days before, he had delivered a speech openly criticizing CCP policies in Tibet, stating that Tibet had lost more than it gained under Chinese rule. The circumstances of his death remain suspicious to many Tibetans.',
    category: 'context',
    source: 'https://treasuryoflives.org/biographies/view/Tenth-Panchen-Lama/TBRC_P1650',
  },
  {
    date: '1989-04-25',
    year: '1989',
    title: 'Gedhun Choekyi Nyima born in Lhari County, Tibet',
    detail: 'Born to Konchok Phuntsok and Dechen Chodon in Lhari County, Nagqu Prefecture, Tibet Autonomous Region. A seemingly ordinary Tibetan child whose life would be upended by forces entirely beyond his control.',
    category: 'life',
  },
  {
    date: '1989-06',
    year: '1989',
    title: 'CCP establishes official search committee',
    detail: 'The Chinese government set up an official committee to find the reincarnation of the 10th Panchen Lama, led by Chadrel Rinpoche, the abbot of Tashilhunpo Monastery. The CCP intended to control the selection process to install a politically compliant religious leader.',
    category: 'political',
  },
  {
    date: '1990',
    year: '1990–94',
    title: 'Multi-year search for the reincarnation',
    detail: 'Chadrel Rinpoche led a search team that visited hundreds of families across Tibet. He secretly communicated with the Dalai Lama in exile, sharing photographs and details of candidate boys, following Tibetan Buddhist tradition which requires the Panchen and Dalai Lamas to recognize each other\'s reincarnations.',
    category: 'religious',
  },
  {
    date: '1995-05-14',
    year: '1995',
    title: '14th Dalai Lama recognizes Gedhun Choekyi Nyima as 11th Panchen Lama',
    detail: 'From Dharamsala, India, the 14th Dalai Lama publicly announced Gedhun Choekyi Nyima as the legitimate reincarnation of the 10th Panchen Lama, following traditional Tibetan Buddhist protocols. The boy was 6 years old.',
    category: 'religious',
    source: 'https://www.hrw.org/news/2025/05/15/china/tibet-panchen-lama-forcibly-disappeared-30-years',
  },
  {
    date: '1995-05-17',
    year: '1995',
    title: 'Abducted by Chinese authorities with his family',
    detail: 'Just THREE DAYS after the Dalai Lama\'s announcement, Chinese security forces took 6-year-old Gedhun Choekyi Nyima and his entire family into custody. They have not been seen by any independent observer since this date. This makes him the world\'s youngest political prisoner and the subject of one of the longest-running enforced disappearances in history.',
    category: 'persecution',
    source: 'https://tchrd.org/2025/05/17/30th-anniversary-of-the-enforced-disappearance-of-gedhun-choekyi-nyima/',
  },
  {
    date: '1995-05-17',
    year: '1995',
    title: 'Chadrel Rinpoche arrested',
    detail: 'Chadrel Rinpoche, the abbot who led the search committee and communicated with the Dalai Lama, was arrested in Chengdu on charges of "plotting to split the country" and "leaking state secrets." He was later sentenced to 6 years in prison and 3 years\' deprivation of political rights.',
    category: 'persecution',
    source: 'https://tchrd.org/1997/05/15/profile-chadrel-rinpoche-the-man-who-found-the-xi-panchen-lama/',
  },
  {
    date: '1995-11-29',
    year: '1995',
    title: 'CCP installs Gyaltsen Norbu as their "Panchen Lama"',
    detail: 'Using a "Golden Urn" lottery ceremony at Jokhang Temple in Lhasa — a process historically used only when traditional recognition methods fail — the Chinese government selected Gyaltsen Norbu, enthroning him as their version of the 11th Panchen Lama. He was rejected by most Tibetans, who derisively called him the "CCP\'s Panchen Lama." He now holds political positions including vice president of the CCP-controlled Buddhist Association of China.',
    category: 'political',
    source: 'https://www.cecc.gov/publications/commission-analysis/chinese-installed-panchen-lama-pledges-to-meet-communist-party',
  },
  {
    date: '1997-04',
    year: '1997',
    title: 'Chadrel Rinpoche sentenced to 6 years',
    detail: 'In a closed trial, Chadrel Rinpoche was sentenced to 6 years for "splitting the country" and "leaking state secrets." After release around 2002, he remained under house arrest. His fate remains uncertain.',
    category: 'persecution',
    source: 'https://savetibet.org/chadrel-rinpoche-under-house-arrest/',
  },
  {
    date: '2007',
    year: '2007',
    title: 'CCP claims Gedhun is "living a normal life"',
    detail: 'Chinese officials claimed that Gedhun Choekyi Nyima was "living a normal life" as a regular citizen and "does not wish to be disturbed." This claim has been repeated periodically since, but no independent verification has EVER been permitted. No photographs, video, or proof of life of any kind has been produced.',
    category: 'political',
  },
  {
    date: '2020-05-17',
    year: '2020',
    title: '25th anniversary of disappearance',
    detail: '25 years since Gedhun was last seen. International calls for proof of life intensified. Human Rights Watch, ICT, and USCIRF issued statements demanding access. Chinese government continued to block all independent verification.',
    category: 'international',
    source: 'https://www.hrw.org/news/2025/05/15/china/tibet-panchen-lama-forcibly-disappeared-30-years',
  },
  {
    date: '2022',
    year: '2022',
    title: 'USCIRF calls for his release',
    detail: 'The U.S. Commission on International Religious Freedom issued a formal statement calling for the release of Gedhun Choekyi Nyima and highlighting his case as emblematic of enforced disappearance and religious repression in Tibet.',
    category: 'international',
    source: 'https://www.uscirf.gov/news-room/releases-statements/uscirf-calls-panchen-lamas-release',
  },
  {
    date: '2025-04-25',
    year: '2025',
    title: '36th birthday — European Parliament demands release',
    detail: 'On his 36th birthday, the European Parliament reiterated its unwavering support for his release and demanded the Chinese government immediately disclose his whereabouts. Multiple parliamentary resolutions and statements were issued.',
    category: 'international',
    source: 'https://tibetoffice.eu/european-parliament-calls-for-the-release-of-the-11th-panchen-lama/',
  },
  {
    date: '2025-05-17',
    year: '2025',
    title: '30th anniversary of disappearance — world\'s longest child enforced disappearance',
    detail: '30 years since 6-year-old Gedhun Choekyi Nyima was taken. HRW, ICT, TCHRD, and governments worldwide issued statements. The US State Department called for his release. Now 36 years old, he has spent 83% of his life in enforced disappearance — the entirety of his childhood, adolescence, and young adulthood stolen.',
    category: 'international',
    source: 'https://www.hrw.org/news/2025/05/15/china/tibet-panchen-lama-forcibly-disappeared-30-years',
  },
  {
    date: '2025-06',
    year: '2025',
    title: 'NED Democracy Service Medal awarded',
    detail: 'The National Endowment for Democracy awarded Gedhun Choekyi Nyima the 2025 Democracy Service Medal in absentia. Zeekyab Rinpoche, Abbot of Tashi Lhunpo Monastery in exile, accepted on his behalf. Previous recipients include the Dalai Lama and Taiwan President Tsai Ing-wen.',
    category: 'international',
    source: 'https://www.ned.org/the-11th-panchen-lama-gedhun-choekyi-nyima-2025-democracy-service-medal-honoree/',
  },
  {
    date: '2026-02',
    year: '2026',
    title: 'Still disappeared — no change in status',
    detail: 'As of February 2026, there has been no independent verification of Gedhun Choekyi Nyima\'s well-being, location, or condition. China continues to refuse all requests for access. 30+ years of enforced disappearance with zero evidence of well-being provided.',
    category: 'persecution',
  },
];

const CCP_NARRATIVES = [
  {
    claim: '"He is living a normal life as an ordinary citizen and does not wish to be disturbed"',
    reality: 'This claim has been made repeatedly since ~2007, but not once has China permitted ANY independent observer — diplomat, journalist, UN official, or human rights monitor — to verify it. No photograph, video, letter, or audio recording of any kind has ever been produced. An "ordinary citizen" who cannot be seen by anyone for 30 years is not living a normal life — they are disappeared.',
    source: 'HRW, USCIRF, ICT, TCHRD — all confirm no independent verification has ever occurred',
    sourceUrl: 'https://www.hrw.org/news/2025/05/15/china/tibet-panchen-lama-forcibly-disappeared-30-years',
  },
  {
    claim: '"The Golden Urn selection of Gyaltsen Norbu follows historical Tibetan tradition"',
    reality: 'The Golden Urn (金瓶掣签) was introduced by the Qing Dynasty in 1793 as an imperial oversight mechanism, not a Tibetan Buddhist tradition. It was rarely used — many Panchen and Dalai Lama recognitions occurred without it. The CCP invoked it in 1995 specifically to override the Dalai Lama\'s legitimate recognition. Tibetan Buddhist tradition requires the Panchen and Dalai Lamas to recognize each other\'s reincarnations — a tradition the CCP deliberately destroyed.',
    source: 'TIME Magazine, Tashilhunpo Monastery in Exile',
    sourceUrl: 'https://time.com/archive/6728293/tempest-in-a-golden-urn/',
  },
  {
    claim: '"The Dalai Lama violated religious procedures and the selection was invalid"',
    reality: 'The Dalai Lama followed centuries of Tibetan Buddhist tradition by recognizing the Panchen Lama\'s reincarnation — exactly as Panchen and Dalai Lamas have done for each other across multiple reincarnation cycles. The search committee, led by Chadrel Rinpoche (whom the CCP itself appointed), identified the boy through traditional methods. The CCP criminalized a religious process it had no spiritual authority to judge.',
    source: 'ICT, TCHRD',
    sourceUrl: 'https://savetibet.org/panchen-lama',
  },
  {
    claim: '"This is an internal religious matter and not a human rights issue"',
    reality: 'A 6-year-old child was taken from his parents and held incommunicado for 30+ years without charges, trial, or contact with the outside world. This is an enforced disappearance of a CHILD — a violation of the UN Convention on the Rights of the Child (which China ratified in 1992), the International Convention for the Protection of All Persons from Enforced Disappearance, and multiple other international human rights instruments. The UN, EU, US, and virtually every major human rights organization has classified this as a human rights violation.',
    source: 'UN Committee on the Rights of the Child, HRW, Amnesty International',
    sourceUrl: 'https://www.ohchr.org/en/treaty-bodies/crc',
  },
];

const INTERNATIONAL_RESPONSES = [
  {
    entity: 'Human Rights Watch',
    type: 'NGO',
    response: 'Called for his immediate release and independent verification. Published major report on 30th anniversary (May 2025). Described case as "emblematic of China\'s broader assault on Tibetan religious freedom."',
    source: 'https://www.hrw.org/news/2025/05/15/china/tibet-panchen-lama-forcibly-disappeared-30-years',
  },
  {
    entity: 'United States (State Department & USCIRF)',
    type: 'Government',
    response: 'US State Department repeatedly called for his release. USCIRF designated China a "Country of Particular Concern" for religious freedom violations, citing the Panchen Lama case specifically.',
    source: 'https://www.uscirf.gov/news-room/releases-statements/uscirf-calls-panchen-lamas-release',
  },
  {
    entity: 'European Parliament',
    type: 'Government',
    response: 'Adopted multiple resolutions demanding his release and proof of life. In April 2025, demanded China immediately disclose his whereabouts at the 42nd EU-China Inter-Parliamentary Meeting.',
    source: 'https://tibetoffice.eu/european-parliament-calls-for-the-release-of-the-11th-panchen-lama/',
  },
  {
    entity: 'United Nations',
    type: 'International',
    response: 'UN Committee on the Rights of the Child and UN Special Rapporteurs have repeatedly raised his case. Multiple UN human rights mechanisms have called for independent access.',
    source: 'https://www.ohchr.org/en/treaty-bodies/crc',
  },
  {
    entity: 'International Campaign for Tibet (ICT)',
    type: 'NGO',
    response: 'Leading advocacy organization for the Panchen Lama\'s case. Coordinates global campaigns, provides briefings to governments, and maintains the most comprehensive public record of his case.',
    source: 'https://savetibet.org/panchen-lama',
  },
  {
    entity: 'National Endowment for Democracy (NED)',
    type: 'International',
    response: 'Awarded the 2025 Democracy Service Medal to Gedhun Choekyi Nyima in absentia, joining past recipients including the Dalai Lama and Taiwan President Tsai Ing-wen.',
    source: 'https://www.ned.org/the-11th-panchen-lama-gedhun-choekyi-nyima-2025-democracy-service-medal-honoree/',
  },
  {
    entity: 'Tibetan Centre for Human Rights and Democracy (TCHRD)',
    type: 'NGO',
    response: 'Published comprehensive briefing papers and organized global advocacy campaigns marking the 30th anniversary. Documents ongoing violations against Tibetans connected to the Panchen Lama case.',
    source: 'https://tchrd.org/2025/05/17/30th-anniversary-of-the-enforced-disappearance-of-gedhun-choekyi-nyima/',
  },
];

const SOURCES = [
  { name: 'Human Rights Watch', url: 'https://www.hrw.org/news/2025/05/15/china/tibet-panchen-lama-forcibly-disappeared-30-years', tier: 1 },
  { name: 'International Campaign for Tibet', url: 'https://savetibet.org/panchen-lama', tier: 1 },
  { name: 'USCIRF', url: 'https://www.uscirf.gov/news-room/releases-statements/uscirf-calls-panchen-lamas-release', tier: 1 },
  { name: 'UN OHCHR', url: 'https://www.ohchr.org/en/treaty-bodies/crc', tier: 1 },
  { name: 'TCHRD', url: 'https://tchrd.org/2025/05/17/30th-anniversary-of-the-enforced-disappearance-of-gedhun-choekyi-nyima/', tier: 1 },
  { name: 'National Endowment for Democracy', url: 'https://www.ned.org/the-11th-panchen-lama-gedhun-choekyi-nyima-2025-democracy-service-medal-honoree/', tier: 1 },
  { name: 'European Parliament / Tibet Office', url: 'https://tibetoffice.eu/european-parliament-calls-for-the-release-of-the-11th-panchen-lama/', tier: 1 },
  { name: 'CECC (Congressional-Executive Commission on China)', url: 'https://www.cecc.gov/publications/commission-analysis/chinese-installed-panchen-lama-pledges-to-meet-communist-party', tier: 1 },
  { name: 'TIME Magazine', url: 'https://time.com/archive/6728293/tempest-in-a-golden-urn/', tier: 1 },
  { name: 'Tibet.net (Central Tibetan Administration)', url: 'https://tibet.net/wp-content/uploads/2025/12/Panchen-Lama-Briefing-Paper.pdf', tier: 2 },
];

const categoryColors = {
  life: 'border-green-500/50 text-green-300',
  context: 'border-[#1c2a35]/50 text-slate-300',
  religious: 'border-[#1c2a35]/50 text-[#22d3ee]',
  political: 'border-amber-500/50 text-amber-300',
  persecution: 'border-red-500/50 text-red-300',
  international: 'border-[#1c2a35]/50 text-[#22d3ee]',
};

const categoryLabels = {
  life: 'Personal',
  context: 'Historical Context',
  religious: 'Religious',
  political: 'Political',
  persecution: 'Persecution',
  international: 'International',
};

export default function PanchenLamaProfile() {
  const [activeSection, setActiveSection] = useState('timeline');
  const [expandedEvent, setExpandedEvent] = useState(null);

  const sections = [
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'significance', label: 'Why It Matters', icon: Eye },
    { id: 'narratives', label: 'CCP Narratives', icon: Shield },
    { id: 'response', label: 'International', icon: Globe },
    { id: 'sources', label: 'Sources', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e14] text-white">
      <GlobalDisclaimer />

      {/* Header */}
      <div className="bg-[#0a0e14] border-b border-[#1c2a35] border-l-2 border-l-[#22d3ee]">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link to="/take-action" className="inline-flex items-center gap-1 text-slate-400 hover:text-white mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Take Action
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Icon */}
            <div className="w-24 h-24 bg-[#111820]/50 border-2 border-[#1c2a35]/50 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-[#22d3ee]" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold">{PROFILE.name}</h1>
                <span className="text-lg text-[#22d3ee]">{PROFILE.tibetanName}</span>
              </div>
              <p className="text-[#22d3ee] font-medium mb-2">{PROFILE.title}</p>
              <p className="text-slate-300 text-sm mb-3 max-w-2xl">{PROFILE.significance}</p>

              {/* Status Banner */}
              <div className="bg-[#111820]/40 border border-[#1c2a35] p-3 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-5 h-5 text-[#22d3ee] animate-pulse" />
                  <span className="font-bold text-[#22d3ee]">ENFORCED DISAPPEARANCE — {PROFILE.yearsMissing} YEARS</span>
                </div>
                <p className="text-sm text-slate-300">
                  Abducted at age {PROFILE.ageAtAbduction} on May 17, 1995. Now {PROFILE.currentAge} years old.
                  Not seen by any independent observer for <strong>{PROFILE.yearsMissing} years</strong>.
                  The world&apos;s longest-running enforced disappearance of a child.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-0.5 bg-[#111820]/50 text-[#22d3ee] rounded">
                  <MapPin className="w-3 h-3 inline mr-1" />{PROFILE.currentLocation}
                </span>
                <span className="px-2 py-0.5 bg-[#111820] text-slate-300 rounded">
                  Born {PROFILE.birthDate} · {PROFILE.birthPlace}
                </span>
                <span className="px-2 py-0.5 bg-[#111820] text-slate-300 rounded">
                  Parents: {PROFILE.parents}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="sticky top-14 z-40 bg-[#111820]/95 backdrop-blur border-b border-[#1c2a35]">
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
                    ? 'bg-[#22d3ee] text-[#0a0e14]'
                    : 'text-slate-400 hover:text-white hover:bg-[#111820]'
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
              <Clock className="w-5 h-5 text-[#22d3ee]" />
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
                <button
                  type="button"
                  key={i}
                  className={`border-l-2 pl-4 py-2 cursor-pointer transition-colors rounded-r text-left w-full ${categoryColors[event.category]} hover:bg-[#111820]/50`}
                  onClick={() => setExpandedEvent(expandedEvent === i ? null : i)}
                  aria-expanded={expandedEvent === i}
                  aria-label={`${event.year}: ${event.title}`}
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
                              className="inline-flex items-center gap-1 mt-1 text-[#22d3ee] hover:text-[#22d3ee] text-xs"
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
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Why It Matters Section (replaces Charges — no formal charges exist) */}
        {activeSection === 'significance' && (
          <section aria-label="Why this case matters">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#22d3ee]" />
              Why This Case Matters
            </h2>

            {/* Key Difference Banner */}
            <div className="bg-[#111820] border border-[#1c2a35] p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-[#22d3ee]" />
                <span className="font-bold text-[#22d3ee]">NO CHARGES — EVER</span>
              </div>
              <p className="text-sm text-slate-300">
                Unlike Jimmy Lai or Ilham Tohti, Gedhun Choekyi Nyima was never charged, tried, or convicted of anything.
                He was a <strong>6-year-old child</strong> when taken. He simply... vanished. For 30 years.
                No legal process. No court. No sentence. Just enforced disappearance of a child.
              </p>
            </div>

            {/* Three Pillars */}
            <div className="space-y-4">
              <div className="bg-[#111820] border border-[#1c2a35] p-4">
                <h3 className="font-bold text-[#22d3ee] mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Religious Significance
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  The Panchen Lama is the second-highest authority in Tibetan Buddhism. Historically, the Panchen Lama
                  and Dalai Lama recognize each other&apos;s reincarnations — creating an unbroken spiritual lineage spanning centuries.
                  By disappearing the Dalai Lama&apos;s chosen Panchen Lama and installing their own puppet, the CCP broke this lineage.
                  When the current Dalai Lama (now 90) dies, the CCP plans to use their installed Panchen Lama to &quot;recognize&quot; a
                  politically compliant 15th Dalai Lama — effectively hijacking the entire Tibetan Buddhist religious hierarchy.
                </p>
              </div>

              <div className="bg-[#111820] border border-[#1c2a35] p-4">
                <h3 className="font-bold text-amber-300 mb-2 flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Political Significance
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  This case is not just about one child — it is about the CCP&apos;s systematic strategy to control
                  Tibetan Buddhism from the top down. The CCP has passed regulations asserting its authority to approve
                  all &quot;reincarnations&quot; of Tibetan Buddhist leaders (2007 Order No. 5). This is an atheist political party
                  claiming the right to control religious succession — an absurdity that reveals the purely political
                  nature of their interference. The disappearance of Gedhun Choekyi Nyima was the opening move in
                  this long-term strategy.
                </p>
              </div>

              <div className="bg-[#111820] border border-[#1c2a35] p-4">
                <h3 className="font-bold text-red-300 mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Human Significance
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  A boy who was 6 years old is now 36. He has never attended school freely, never had a friend outside
                  state custody, never chosen his own path. His parents, Konchok Phuntsok and Dechen Chodon, were taken
                  with him — their fate is equally unknown. Multiple monks connected to his recognition were arrested and
                  imprisoned. This is not abstract politics — this is a stolen childhood, a stolen life, and a family
                  erased from the world.
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { label: 'Age at Abduction', value: '6' },
                { label: 'Years Disappeared', value: '30+' },
                { label: 'Formal Charges', value: '0' },
                { label: 'Independent Verifications', value: '0' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#111820] border border-[#1c2a35] p-3">
                  <div className="text-2xl font-bold text-[#22d3ee]">{stat.value}</div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Others Also Persecuted */}
            <div className="mt-6 bg-amber-900/20 border border-amber-500/30 p-4">
              <h3 className="font-bold text-amber-300 mb-2">Others Persecuted in Connection</h3>
              <ul className="text-sm text-slate-300 space-y-1 list-disc pl-5">
                <li><strong>Chadrel Rinpoche</strong> — Abbot of Tashilhunpo, led search committee. Sentenced 6 years. Under house arrest post-release.</li>
                <li><strong>Multiple monks</strong> at Tashilhunpo Monastery arrested for supporting the Dalai Lama&apos;s recognition</li>
                <li><strong>Gedhun&apos;s parents</strong> (Konchok Phuntsok and Dechen Chodon) — disappeared along with him</li>
                <li><strong>Tibetans possessing photos</strong> of Gedhun Choekyi Nyima have been detained and imprisoned</li>
              </ul>
            </div>
          </section>
        )}

        {/* CCP Narrative Analysis */}
        {activeSection === 'narratives' && (
          <section aria-label="CCP narrative analysis">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              CCP Narrative vs. Reality
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              The CCP&apos;s narrative around the Panchen Lama is particularly insidious because it attempts to
              normalize the enforced disappearance of a child. Below are their key claims, dismantled with verified evidence.
              Zero CCP state media outlets are cited — all sources are independent.
            </p>

            <div className="space-y-6">
              {CCP_NARRATIVES.map((narrative, i) => (
                <div key={i} className="bg-[#111820] border border-[#1c2a35] overflow-hidden">
                  <div className="bg-red-900/30 p-3 border-b border-[#1c2a35]">
                    <div className="flex items-start gap-2">
                      <Newspaper className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs text-red-400 font-medium">CCP CLAIM:</span>
                        <p className="text-sm text-red-200 mt-0.5">{narrative.claim}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs text-green-400 font-medium">REALITY:</span>
                        <p className="text-sm text-slate-300 mt-0.5 leading-relaxed">{narrative.reality}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                          <FileText className="w-3 h-3" />
                          <span>{narrative.source}</span>
                          {narrative.sourceUrl && (
                            <a
                              href={narrative.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#22d3ee] hover:text-[#22d3ee] inline-flex items-center gap-0.5"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Verify
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* International Response */}
        {activeSection === 'response' && (
          <section aria-label="International response">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#22d3ee]" />
              International Response
            </h2>

            <div className="space-y-3">
              {INTERNATIONAL_RESPONSES.map((resp, i) => (
                <div key={i} className="bg-[#111820] border border-[#1c2a35] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      resp.type === 'Government' ? 'bg-[#111820]/50 text-[#22d3ee]' :
                      resp.type === 'NGO' ? 'bg-green-900/50 text-green-300' :
                      'bg-[#111820]/50 text-[#22d3ee]'
                    }`}>
                      {resp.type}
                    </span>
                    <h3 className="font-bold text-white">{resp.entity}</h3>
                  </div>
                  <p className="text-sm text-slate-300">{resp.response}</p>
                  {resp.source && (
                    <a
                      href={resp.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-[#22d3ee] hover:text-[#22d3ee] text-xs"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Source
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Awards */}
            <div className="mt-6 bg-[#111820] border border-[#1c2a35] p-4">
              <h3 className="font-bold text-[#22d3ee] mb-3">Awards & Recognition</h3>
              <div className="space-y-2">
                {[
                  { award: 'NED Democracy Service Medal', year: '2025', note: 'Accepted by Zeekyab Rinpoche on his behalf' },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-[#22d3ee] font-mono text-xs min-w-[40px]">{a.year}</span>
                    <span className="text-white font-medium">{a.award}</span>
                    <span className="text-slate-400 text-xs">— {a.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sources */}
        {activeSection === 'sources' && (
          <section aria-label="Sources">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" />
              Sources
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              All sources are independent — zero CCP state media outlets (Xinhua, People&apos;s Daily, CGTN, Global Times, tibet.cn) are cited.
              Sources are ranked by independence and reliability.
            </p>

            <div className="space-y-2">
              {SOURCES.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#111820] border border-[#1c2a35] hover:bg-[#1c2a35] transition-colors group"
                >
                  <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                    source.tier === 1 ? 'bg-green-900/50 text-green-300 border border-green-500/30' :
                    'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30'
                  }`}>
                    T{source.tier}
                  </span>
                  <span className="text-sm text-white group-hover:text-[#22d3ee] flex-1">{source.name}</span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#22d3ee]" />
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
