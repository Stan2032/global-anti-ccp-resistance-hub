import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlobalDisclaimer from '../../components/ui/GlobalDisclaimer';
import {
  User, Calendar, MapPin, Scale, AlertTriangle, ExternalLink,
  ChevronDown, ChevronUp, Globe, FileText, BookOpen, Clock,
  ArrowLeft, Shield, Award, Heart, GraduationCap
} from 'lucide-react';

// ─── DATA ──────────────────────────────────────────────────────────
// All dates verified against HRW, PEN International, Front Line Defenders,
// European Parliament, USCIRF, Scholars at Risk, Amnesty International.
// See _agents/thoughts/SESSION_44_ILHAM_TOHTI_PROFILE.md for verification methodology.
// CCP narrative rebuttals sourced from independent media, not CCP state outlets.

const PROFILE = {
  name: 'Ilham Tohti',
  chineseName: '伊力哈木·土赫提',
  birthDate: 'October 25, 1969',
  birthPlace: 'Artush, Xinjiang, China',
  nationality: 'Chinese (Uyghur)',
  status: 'IMPRISONED',
  currentLocation: 'Urumqi No. 1 Prison, Xinjiang (reported)',
  sentence: 'Life imprisonment',
  age: 56,
  occupation: 'Economist, Professor at Minzu University of China',
};

const TIMELINE = [
  {
    date: '1969-10-25',
    year: '1969',
    title: 'Born in Artush, Xinjiang',
    detail: 'Born into a Uyghur family in Artush (Atush), a city in the Kizilsu Kirghiz Autonomous Prefecture of Xinjiang. Grew up during the Cultural Revolution, which shaped his understanding of ethnic tensions in China.',
    category: 'life',
  },
  {
    date: '1985',
    year: '1985',
    title: 'Began university studies',
    detail: 'Studied at Northeast Normal University in Changchun, Jilin province, earning a bachelor\'s degree. Later completed a master\'s degree at Minzu University of China (Central University for Nationalities) in Beijing.',
    category: 'academic',
  },
  {
    date: '1994',
    year: '1994',
    title: 'Began teaching at Minzu University',
    detail: 'Joined the faculty of Minzu University of China in Beijing as an economics professor. Over the next two decades, he became one of the most prominent Uyghur intellectuals in China, teaching students about economics, inter-ethnic relations, and the social development of Xinjiang.',
    category: 'academic',
    source: 'https://www.scholarsatrisk.org/2026/01/twelve-years-since-arrest-sar-calls-for-release-of-professor-ilham-tohti/',
  },
  {
    date: '2006',
    year: '2006',
    title: 'Founded Uighurbiz.net',
    detail: 'Created Uighurbiz.net (Uyghur Online), a bilingual Chinese-Uyghur website promoting dialogue between Han Chinese and Uyghurs. The site published articles about Uyghur economic marginalization, cultural erosion, and discrimination — always advocating for dialogue and reform within the Chinese constitutional framework, never independence.',
    category: 'advocacy',
    source: 'https://www.hrw.org/news/2024/09/23/china-free-uyghur-economist-ilham-tohti-life-sentence',
  },
  {
    date: '2008',
    year: '2008',
    title: 'Uighurbiz.net shut down by authorities',
    detail: 'Chinese authorities shut down the website. Tohti was briefly detained and questioned. The site was later allowed to reopen, but was repeatedly censored and disrupted.',
    category: 'legal',
  },
  {
    date: '2009-07',
    year: '2009',
    title: 'Detained after Ürümqi riots',
    detail: 'Following the July 2009 Ürümqi riots that killed nearly 200 people, Tohti was detained for several weeks. He had actually warned beforehand that ethnic tensions could lead to violence if authorities didn\'t address Uyghur grievances. He was released after international pressure, but remained under constant surveillance.',
    category: 'legal',
    source: 'https://www.frontlinedefenders.org/en/case/ilham-tohti-sentenced-life-imprisonment',
  },
  {
    date: '2013-02',
    year: '2013',
    title: 'Passport confiscated, fellowship blocked',
    detail: 'Authorities confiscated Tohti\'s passport and prevented him from traveling to Indiana University for a visiting fellowship. He was detained at Beijing Capital Airport with his daughter Jewher, who was allowed to board the plane alone. It was the last time they saw each other.',
    category: 'legal',
    source: 'https://pen.org/10-years-of-injustice-ilham-tohtis-daughter-on-his-lifelong-advocacy/',
  },
  {
    date: '2013-11',
    year: '2013',
    title: 'Placed under house arrest',
    detail: 'Placed under de facto house arrest in Beijing. Police guards stationed outside his apartment. Students visiting him were questioned and intimidated. Despite this, he continued to write and teach.',
    category: 'legal',
  },
  {
    date: '2014-01-15',
    year: '2014',
    title: 'Arrested in Beijing',
    detail: 'Police raided his home at dawn, taking Tohti away in front of his wife and young children. He was transported to Urumqi, over 2,500 km away, and held incommunicado for months. Authorities denied his family access and refused to confirm his location. Seven of his students were also arrested.',
    category: 'legal',
    source: 'https://www.hrw.org/news/2024/09/23/china-free-uyghur-economist-ilham-tohti-life-sentence',
  },
  {
    date: '2014-07-30',
    year: '2014',
    title: 'Formally charged with "separatism"',
    detail: 'Charged with "splitting the state" (separatism) under Article 103 of China\'s Criminal Law — a charge that can carry the death penalty. The indictment cited his writings, teaching, and website as evidence of "separatist" activity, despite his consistent advocacy for autonomy within the Chinese system, not independence.',
    category: 'legal',
    source: 'https://www.frontlinedefenders.org/en/case/ilham-tohti-sentenced-life-imprisonment',
  },
  {
    date: '2014-09-17',
    year: '2014',
    title: 'Two-day trial begins',
    detail: 'Trial held behind closed doors at Urumqi Intermediate People\'s Court over just two days. Foreign diplomats and journalists were denied access. Tohti\'s lawyer reported that he was brought to court in shackles, had lost significant weight, and appeared to have been mistreated in detention.',
    category: 'legal',
  },
  {
    date: '2014-09-23',
    year: '2014',
    title: 'Sentenced to LIFE IMPRISONMENT',
    detail: 'Found guilty of "separatism" and sentenced to life imprisonment with confiscation of all personal assets. The verdict was universally condemned by the international community. The trial lasted only two days, no credible evidence of violence or separatist activity was presented, and Tohti was denied adequate legal representation.',
    category: 'legal',
    source: 'https://www.amnesty.org/en/latest/news/2024/09/china-world-leaders-must-act-to-end-decade-of-injustice-for-jailed-uyghur-academic/',
  },
  {
    date: '2014-11',
    year: '2014',
    title: 'PEN/Barbara Goldsmith Freedom to Write Award',
    detail: 'PEN American Center awarded Tohti the PEN/Barbara Goldsmith Freedom to Write Award, recognizing his courage in writing about Uyghur rights. His daughter Jewher accepted on his behalf.',
    category: 'recognition',
    source: 'https://www.pen-international.org/cases/professor-ilham-tohti',
  },
  {
    date: '2016',
    year: '2016',
    title: 'Martin Ennals Award',
    detail: 'Received the Martin Ennals Award for Human Rights Defenders, the most prestigious international human rights prize. The jury recognized Tohti\'s peaceful advocacy and described his life sentence as "the price of standing up for the rights of Uyghurs in China."',
    category: 'recognition',
  },
  {
    date: '2017',
    year: '2017',
    title: 'Family visits denied; mass internment begins',
    detail: 'Chinese authorities denied all family contact. Around this time, the mass internment of Uyghurs began in Xinjiang — the very crisis Tohti had tried to prevent through dialogue. An estimated 1-1.8 million Uyghurs were eventually detained in what China called "vocational training centers."',
    category: 'legal',
    source: 'https://www.hrw.org/news/2024/09/23/china-free-uyghur-economist-ilham-tohti-life-sentence',
  },
  {
    date: '2019-10-07',
    year: '2019',
    title: 'Václav Havel Human Rights Prize',
    detail: 'Awarded the Council of Europe\'s Václav Havel Human Rights Prize. The Council described Tohti\'s conviction as "fundamentally unjust" and called for his release.',
    category: 'recognition',
  },
  {
    date: '2019-10-24',
    year: '2019',
    title: 'Sakharov Prize for Freedom of Thought',
    detail: 'The European Parliament awarded Tohti the Sakharov Prize for Freedom of Thought — the EU\'s highest human rights honor. Parliament President David Sassoli announced the award in Strasbourg. Jewher Ilham accepted the prize during the December 2019 plenary session.',
    category: 'recognition',
    source: 'https://www.europarl.europa.eu/sakharovprize/en/ilham-tohti',
  },
  {
    date: '2024-09',
    year: '2024',
    title: '10th anniversary of imprisonment',
    detail: 'The tenth anniversary of Tohti\'s life sentence prompted renewed international calls for his release from Amnesty International, HRW, PEN International, Scholars at Risk, and the EU. Reports indicate he has been subjected to solitary confinement and denied medical care. His health status remains unknown.',
    category: 'legal',
    source: 'https://www.amnesty.org/en/latest/news/2024/09/china-world-leaders-must-act-to-end-decade-of-injustice-for-jailed-uyghur-academic/',
  },
  {
    date: '2026-01',
    year: '2026',
    title: '12 years since arrest — still imprisoned',
    detail: 'Scholars at Risk issued a renewed call for Tohti\'s release on the 12th anniversary of his arrest. He has now been imprisoned for over 11 years, with no family contact since 2017. The mass internment campaign he tried to prevent through peaceful dialogue has been documented as one of the worst human rights crises of the 21st century.',
    category: 'legal',
    source: 'https://www.scholarsatrisk.org/2026/01/twelve-years-since-arrest-sar-calls-for-release-of-professor-ilham-tohti/',
  },
];

const CHARGES = [
  {
    charge: 'Separatism (splitting the state)',
    law: 'Criminal Law of China, Article 103',
    maxPenalty: 'Death penalty or life imprisonment',
    evidence: 'Writings on Uighurbiz.net; university lectures; interviews with foreign media; advocacy for implementation of regional autonomy laws already guaranteed by China\'s own constitution.',
    analysis: 'The prosecution treated peaceful academic writing, teaching, and policy advocacy as criminal "separatism." Tohti never advocated independence — he called for the implementation of China\'s existing regional autonomy laws and for dialogue between Han and Uyghur communities. His conviction effectively criminalized intellectual inquiry itself.',
  },
];

const CCP_NARRATIVES = [
  {
    claim: '"Ilham Tohti is a separatist who incited ethnic hatred and sought to split China."',
    reality: 'Tohti spent his entire career advocating for the opposite — Han-Uyghur dialogue and reconciliation within the Chinese constitutional framework. He explicitly rejected independence, writing: "I never challenged the Chinese system fundamentally, nor did I reject being Chinese. I wanted to improve the system." His website Uighurbiz.net was bilingual specifically to promote cross-ethnic understanding. Every major international human rights organization has confirmed he is a prisoner of conscience, not a separatist.',
    sources: ['HRW', 'PEN International', 'Amnesty International', 'European Parliament', 'Scholars at Risk'],
  },
  {
    claim: '"The trial was conducted in accordance with Chinese law and was fair."',
    reality: 'The two-day trial was closed to foreign observers and diplomats. Tohti appeared in shackles and had visibly lost weight. His lawyers reported he was denied adequate time to prepare a defense. He was held incommunicado for months before the trial. The UN Working Group on Arbitrary Detention found his detention to be arbitrary and in violation of international law. The International Bar Association and multiple legal experts have called the proceedings a sham.',
    sources: ['UN Working Group on Arbitrary Detention', 'Front Line Defenders', 'Amnesty International'],
  },
  {
    claim: '"Tohti\'s writings promoted terrorism and violence."',
    reality: 'Not a single one of Tohti\'s writings advocates violence. His work consistently called for peaceful reform, dialogue, and the implementation of rights already guaranteed by China\'s own constitution. PEN International, which analyzed his writings in detail, found them to be entirely peaceful academic work. He warned that failing to address Uyghur grievances through dialogue would lead to radicalization — a prediction that proved tragically accurate when the mass internment campaign began in 2017.',
    sources: ['PEN International', 'Scholars at Risk', 'USCIRF'],
  },
  {
    claim: '"China\'s policies in Xinjiang are vocational training and poverty alleviation, not repression."',
    reality: 'The mass internment of 1-1.8 million Uyghurs (documented by ASPI, HRW, Amnesty, UHRP, and leaked CCP internal documents known as the "China Cables" and "Xinjiang Police Files") has been characterized as crimes against humanity by multiple independent investigations. The UN High Commissioner for Human Rights found "serious human rights violations" in Xinjiang. China\'s own leaked internal documents describe the camps as "locked" facilities where residents cannot leave. Tohti tried to prevent this through dialogue — and was silenced.',
    sources: ['UN OHCHR', 'ASPI', 'HRW', 'Amnesty International', 'Uyghur Tribunal'],
  },
];

const INTERNATIONAL_RESPONSES = [
  {
    entity: 'European Parliament',
    response: 'Awarded Tohti the Sakharov Prize for Freedom of Thought (October 24, 2019) — the EU\'s highest human rights honor. Called for his immediate and unconditional release. Renewed calls on the 10th anniversary of his imprisonment in 2024.',
    source: 'https://www.europarl.europa.eu/sakharovprize/en/ilham-tohti',
  },
  {
    entity: 'United States',
    response: 'State Department has repeatedly called for Tohti\'s release. USCIRF lists him as a victim of religious freedom violations. Bipartisan Congressional members have spoken on his case. His daughter Jewher Ilham has testified before Congress.',
    source: 'https://www.uscirf.gov/religious-prisoners-conscience/forb-victims-database/ilham-tohti',
  },
  {
    entity: 'Council of Europe',
    response: 'Awarded Tohti the Václav Havel Human Rights Prize (October 2019), describing his conviction as "fundamentally unjust."',
    source: 'https://www.coe.int/en/web/human-rights-rule-of-law/vaclav-havel-human-rights-prize',
  },
  {
    entity: 'United Nations',
    response: 'The UN Working Group on Arbitrary Detention found Tohti\'s detention to be arbitrary. Multiple UN Special Rapporteurs have called for his release. The 2022 UN OHCHR report on Xinjiang cited his case as emblematic of broader repression.',
    source: 'https://www.ohchr.org/en/documents/country-reports/ohchr-assessment-human-rights-concerns-xinjiang-uyghur-autonomous-region',
  },
  {
    entity: 'PEN International',
    response: 'Named Tohti an honorary member. Awarded PEN/Barbara Goldsmith Freedom to Write Award (2014). Continues to campaign for his release through the PEN International Writers in Prison Committee.',
    source: 'https://www.pen-international.org/cases/professor-ilham-tohti',
  },
  {
    entity: 'Amnesty International',
    response: 'Declared Tohti a prisoner of conscience. Issued a Decade of Injustice report on the 10th anniversary of his sentencing (September 2024), calling on world leaders to demand his release.',
    source: 'https://www.amnesty.org/en/latest/news/2024/09/china-world-leaders-must-act-to-end-decade-of-injustice-for-jailed-uyghur-academic/',
  },
  {
    entity: 'Scholars at Risk',
    response: 'Issued a renewed call for Tohti\'s release on the 12th anniversary of his arrest (January 2026), noting that his case represents a direct attack on academic freedom.',
    source: 'https://www.scholarsatrisk.org/2026/01/twelve-years-since-arrest-sar-calls-for-release-of-professor-ilham-tohti/',
  },
];

const SOURCES = [
  { name: 'Human Rights Watch', url: 'https://www.hrw.org/news/2024/09/23/china-free-uyghur-economist-ilham-tohti-life-sentence', tier: 1 },
  { name: 'Amnesty International', url: 'https://www.amnesty.org/en/latest/news/2024/09/china-world-leaders-must-act-to-end-decade-of-injustice-for-jailed-uyghur-academic/', tier: 1 },
  { name: 'European Parliament (Sakharov Prize)', url: 'https://www.europarl.europa.eu/sakharovprize/en/ilham-tohti', tier: 1 },
  { name: 'PEN International', url: 'https://www.pen-international.org/cases/professor-ilham-tohti', tier: 1 },
  { name: 'Front Line Defenders', url: 'https://www.frontlinedefenders.org/en/case/ilham-tohti-sentenced-life-imprisonment', tier: 1 },
  { name: 'Scholars at Risk', url: 'https://www.scholarsatrisk.org/2026/01/twelve-years-since-arrest-sar-calls-for-release-of-professor-ilham-tohti/', tier: 1 },
  { name: 'USCIRF', url: 'https://www.uscirf.gov/religious-prisoners-conscience/forb-victims-database/ilham-tohti', tier: 1 },
  { name: 'PEN America', url: 'https://pen.org/10-years-of-injustice-ilham-tohtis-daughter-on-his-lifelong-advocacy/', tier: 1 },
  { name: 'UN OHCHR (Xinjiang Report)', url: 'https://www.ohchr.org/en/documents/country-reports/ohchr-assessment-human-rights-concerns-xinjiang-uyghur-autonomous-region', tier: 1 },
];

// ─── COMPONENT ─────────────────────────────────────────────────────

const categoryColors = {
  life: 'border-blue-500 bg-blue-500/10',
  academic: 'border-emerald-500 bg-emerald-500/10',
  advocacy: 'border-cyan-500 bg-cyan-500/10',
  legal: 'border-red-500 bg-red-500/10',
  recognition: 'border-amber-500 bg-amber-500/10',
};

const categoryLabels = {
  life: 'Personal',
  academic: 'Academic',
  advocacy: 'Advocacy',
  legal: 'Legal',
  recognition: 'Recognition',
};

export default function IlhamTohtiProfile() {
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
    <div className="min-h-screen bg-[#0a0e14] text-white">
      <GlobalDisclaimer />

      {/* Header */}
      <div className="bg-[#0a0e14] border-b border-[#1c2a35] border-l-2 border-l-cyan-500">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link
            to="/prisoners"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Political Prisoners
          </Link>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-16 h-16 rounded-full bg-cyan-600/20 border-2 border-cyan-500 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-8 h-8 text-cyan-400" />
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
                <span className="px-2 py-0.5 bg-amber-600/30 text-amber-300 rounded border border-amber-500/30">
                  <Award className="w-3 h-3 inline mr-1" />Sakharov Prize Laureate 2019
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
                    ? 'bg-blue-600 text-white'
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
                  className={`border-l-2 pl-4 py-2 cursor-pointer transition-colors rounded-r ${categoryColors[event.category]} hover:bg-[#111820]/50`}
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
            <div className="bg-red-900/30 border border-red-500/30 p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="font-bold text-red-300">GUILTY — Life Imprisonment</span>
              </div>
              <p className="text-sm text-slate-300">
                On <strong>September 23, 2014</strong>, after a closed two-day trial, the Urumqi Intermediate People&apos;s Court found Tohti guilty
                of &quot;separatism&quot; and sentenced him to <strong>life imprisonment</strong> with confiscation of all assets — the harshest
                possible sentence short of death. He was 44 years old. He has now served over 11 years.
              </p>
            </div>

            {/* Individual Charges */}
            <div className="space-y-4">
              {CHARGES.map((charge, i) => (
                <div key={i} className="bg-[#111820] border border-[#1c2a35] p-4">
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
                { label: 'Trial Length', value: '2 days' },
                { label: 'Days Imprisoned', value: `${Math.floor((new Date('2026-02-20') - new Date('2014-01-15')) / (1000 * 60 * 60 * 24))}+` },
                { label: 'Sentence', value: 'Life' },
                { label: 'Family Contact', value: 'None since 2017' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#111820] p-3 border border-[#1c2a35]">
                  <div className="text-lg font-bold text-white">{value}</div>
                  <div className="text-xs text-slate-400">{label}</div>
                </div>
              ))}
            </div>

            {/* Students Persecuted */}
            <div className="mt-6 bg-amber-900/20 border border-amber-500/30 p-4">
              <h3 className="font-bold text-amber-300 mb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Students Also Persecuted
              </h3>
              <p className="text-sm text-slate-300">
                Seven of Tohti&apos;s students were arrested alongside him or shortly after. Several were sentenced to
                prison terms of 3-8 years for &quot;separatism&quot; based solely on their association with Tohti and
                their participation in his website. This collective punishment of students for their professor&apos;s
                peaceful advocacy represents a direct attack on academic freedom.
              </p>
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
              The CCP deploys specific narratives to justify Tohti&apos;s life sentence. Below is each claim with sourced rebuttals.
              None of the rebuttals cite CCP state media (Xinhua, CGTN, Global Times, People&apos;s Daily).
            </p>

            <div className="space-y-4">
              {(showAllNarratives ? CCP_NARRATIVES : CCP_NARRATIVES.slice(0, 2)).map((item, i) => (
                <div key={i} className="bg-[#111820] border border-[#1c2a35] overflow-hidden">
                  <div className="bg-red-900/20 px-4 py-2 border-b border-[#1c2a35]">
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

            {/* Awards Banner */}
            <div className="bg-amber-900/20 border border-amber-500/30 p-4 mb-6">
              <h3 className="font-bold text-amber-300 mb-2 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Major Awards
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { award: 'Sakharov Prize for Freedom of Thought', year: '2019', org: 'European Parliament' },
                  { award: 'Václav Havel Human Rights Prize', year: '2019', org: 'Council of Europe' },
                  { award: 'Martin Ennals Award', year: '2016', org: 'Martin Ennals Foundation' },
                  { award: 'PEN/Barbara Goldsmith Freedom to Write Award', year: '2014', org: 'PEN America' },
                ].map((item, i) => (
                  <div key={i} className="bg-[#111820]/50 rounded p-2 text-sm">
                    <p className="font-medium text-amber-200">{item.award}</p>
                    <p className="text-xs text-slate-400">{item.year} · {item.org}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {INTERNATIONAL_RESPONSES.map((response, i) => (
                <div key={i} className="bg-[#111820] border border-[#1c2a35] p-4">
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
            <div className="mt-6 bg-blue-900/20 border border-blue-500/30 p-4">
              <h3 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                How You Can Help
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { action: 'Contact your representative', desc: 'Urge them to raise Tohti\'s case with the Chinese government' },
                  { action: 'Support UHRP', link: 'https://uhrp.org', desc: 'Uyghur Human Rights Project' },
                  { action: 'Share on social media', desc: 'Use #FreeIlhamTohti and #FreeUyghurs' },
                  { action: 'Support Scholars at Risk', link: 'https://www.scholarsatrisk.org', desc: 'Protecting threatened scholars worldwide' },
                ].map((item, i) => (
                  <div key={i} className="bg-[#111820] rounded p-3 text-sm">
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
                  className="flex items-center justify-between bg-[#111820] border border-[#1c2a35] p-3 hover:bg-slate-750 hover:border-slate-600 transition-colors"
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
