import React, { useState } from 'react';
import GlobalDisclaimer from './ui/GlobalDisclaimer';
import { User, Calendar, MapPin, Scale, AlertTriangle, ExternalLink, ChevronDown, ChevronUp, Heart, Share2, BookOpen, Clock, Globe, FileText } from 'lucide-react';

const caseStudies = [
  {
    id: 'jimmy-lai',
    name: 'Jimmy Lai',
    chineseName: '黎智英',
    photo: null,
    status: 'IMPRISONED',
    urgency: 'CRITICAL',
    category: 'Hong Kong',
    birthYear: 1947,
    nationality: 'British',
    occupation: 'Media Tycoon, Founder of Apple Daily',
    summary: 'Hong Kong media mogul and pro-democracy advocate sentenced under the National Security Law for "collusion with foreign forces."',
    timeline: [
      { date: '1947', event: 'Born in Guangzhou, China' },
      { date: '1960', event: 'Fled to Hong Kong at age 12 as a stowaway' },
      { date: '1981', event: 'Founded Giordano clothing chain' },
      { date: '1995', event: 'Founded Apple Daily newspaper' },
      { date: '2014', event: 'Supported Umbrella Movement protests' },
      { date: '2019', event: 'Met with US officials including Mike Pompeo and Nancy Pelosi' },
      { date: '2020-08-10', event: 'Arrested under National Security Law' },
      { date: '2020-12-03', event: 'Denied bail, remanded in custody' },
      { date: '2021-06-24', event: 'Apple Daily forced to close after asset freeze' },
      { date: '2021-12-13', event: 'NSL trial begins' },
      { date: '2023-12-18', event: 'Trial resumes after delays' },
      { date: '2025-12-15', event: 'Found GUILTY on all charges' },
      { date: '2026-02-09', event: 'Sentenced to 20 years in prison' },
    ],
    charges: [
      { charge: 'Conspiracy to collude with foreign forces', law: 'NSL Article 29', maxSentence: 'Life imprisonment' },
      { charge: 'Conspiracy to publish seditious publications', law: 'Colonial-era sedition law', maxSentence: '2 years' },
      { charge: 'Sedition', law: 'Colonial-era sedition law', maxSentence: '2 years' },
    ],
    verdict: {
      date: '2025-12-15',
      outcome: 'GUILTY on all 3 charges',
      sentencing: '20 years in prison (Feb 9, 2026)',
      judge: 'Three designated NSL judges without jury',
    },
    significance: [
      'Highest-profile NSL case involving a foreign national',
      'Test case for press freedom under NSL',
      'Symbol of Hong Kong\'s autonomy erosion',
      'International diplomatic flashpoint',
    ],
    internationalResponse: [
      { country: 'United Kingdom', response: 'Foreign Secretary condemned verdict, summoned Chinese ambassador' },
      { country: 'United States', response: 'State Department called for immediate release' },
      { country: 'European Union', response: 'High Representative issued statement of concern' },
      { country: 'Canada', response: 'Foreign Minister called verdict "deeply troubling"' },
      { country: 'Australia', response: 'Government expressed "grave concerns"' },
    ],
    howToHelp: [
      { action: 'Sign petition', link: 'https://www.change.org/p/free-jimmy-lai', description: 'Join 500,000+ signatures calling for his release' },
      { action: 'Contact representatives', description: 'Urge your government to raise his case' },
      { action: 'Share on social media', hashtags: ['#FreeJimmyLai', '#StandWithHongKong'] },
      { action: 'Support HKDC', link: 'https://hongkongdc.org', description: 'Hong Kong Democracy Council advocacy' },
    ],
    sources: [
      { name: 'BBC', url: 'https://www.bbc.com/news/world-asia-china-53742956' },
      { name: 'Hong Kong Free Press', url: 'https://hongkongfp.com/tag/jimmy-lai/' },
      { name: 'Committee to Protect Journalists', url: 'https://cpj.org/data/people/jimmy-lai/' },
    ],
    quotes: [
      { text: 'I am prepared to pay any price for what I believe.', context: 'Interview before arrest' },
      { text: 'Freedom is not free. We have to fight for it.', context: 'Apple Daily editorial' },
    ],
  },
  {
    id: 'ilham-tohti',
    name: 'Ilham Tohti',
    chineseName: '伊力哈木·土赫提',
    photo: null,
    status: 'IMPRISONED',
    urgency: 'CRITICAL',
    category: 'Uyghur',
    birthYear: 1969,
    nationality: 'Chinese (Uyghur)',
    occupation: 'Economics Professor, Minzu University of China',
    summary: 'Uyghur economist and advocate for Uyghur-Han dialogue, serving life sentence for "separatism" despite never advocating independence.',
    timeline: [
      { date: '1969', event: 'Born in Artush, Xinjiang' },
      { date: '1994', event: 'Began teaching at Minzu University of China' },
      { date: '2006', event: 'Founded Uighurbiz.net website promoting dialogue' },
      { date: '2008', event: 'Website shut down by authorities' },
      { date: '2013-11', event: 'Prevented from traveling to US for fellowship' },
      { date: '2014-01-15', event: 'Arrested at home in Beijing' },
      { date: '2014-09-23', event: 'Sentenced to life imprisonment for "separatism"' },
      { date: '2019-10-24', event: 'Awarded Sakharov Prize for Freedom of Thought' },
      { date: '2022', event: 'Reported to be in poor health in prison' },
    ],
    charges: [
      { charge: 'Separatism', law: 'Criminal Law Article 103', maxSentence: 'Life imprisonment or death' },
    ],
    verdict: {
      date: '2014-09-23',
      outcome: 'GUILTY',
      sentencing: 'Life imprisonment',
      judge: 'Urumqi Intermediate People\'s Court',
    },
    significance: [
      'Imprisoned for advocating dialogue, not independence',
      'Symbol of persecution of moderate Uyghur voices',
      'Sakharov Prize laureate (2019)',
      'His case preceded mass internment campaign',
    ],
    internationalResponse: [
      { country: 'European Parliament', response: 'Awarded Sakharov Prize 2019' },
      { country: 'United States', response: 'State Department called for release' },
      { country: 'PEN International', response: 'Named honorary member' },
      { country: 'United Nations', response: 'UN experts called trial unfair' },
    ],
    howToHelp: [
      { action: 'Learn about his work', description: 'Read his writings on Uyghur-Han relations' },
      { action: 'Support UHRP', link: 'https://uhrp.org', description: 'Uyghur Human Rights Project' },
      { action: 'Contact representatives', description: 'Urge sanctions on officials responsible' },
    ],
    sources: [
      { name: 'European Parliament', url: 'https://www.europarl.europa.eu/sakharovprize/en/ilham-tohti' },
      { name: 'PEN International', url: 'https://pen-international.org/news/ilham-tohti' },
      { name: 'Uyghur Human Rights Project', url: 'https://uhrp.org/ilham-tohti' },
    ],
    quotes: [
      { text: 'I am not a separatist. I have consistently opposed separatism and terrorism.', context: 'Court statement' },
      { text: 'Uyghurs and Han Chinese are not enemies. We must find a way to live together.', context: 'Lecture' },
    ],
  },
  {
    id: 'panchen-lama',
    name: 'Gedhun Choekyi Nyima',
    chineseName: '根敦确吉尼玛',
    photo: null,
    status: 'DISAPPEARED',
    urgency: 'CRITICAL',
    category: 'Tibet',
    birthYear: 1989,
    nationality: 'Tibetan',
    occupation: '11th Panchen Lama (recognized by Dalai Lama)',
    summary: 'Abducted at age 6 after being recognized as the reincarnation of the Panchen Lama. Not seen publicly for 30 years.',
    timeline: [
      { date: '1989-04-25', event: 'Born in Lhari County, Tibet' },
      { date: '1995-05-14', event: 'Recognized as 11th Panchen Lama by Dalai Lama' },
      { date: '1995-05-17', event: 'Abducted by Chinese authorities with family' },
      { date: '1995-11-29', event: 'China installs Gyaltsen Norbu as "official" Panchen Lama' },
      { date: '2020-05-17', event: '25th anniversary of disappearance' },
      { date: '2025-05-17', event: '30th anniversary - still missing' },
    ],
    charges: [
      { charge: 'No formal charges', law: 'Extrajudicial detention', maxSentence: 'N/A' },
    ],
    verdict: {
      date: 'N/A',
      outcome: 'No trial - enforced disappearance',
      sentencing: 'Indefinite detention',
      judge: 'N/A',
    },
    significance: [
      'World\'s youngest political prisoner when abducted',
      'Longest-running enforced disappearance',
      'Symbol of Tibet\'s religious persecution',
      'Second-highest figure in Tibetan Buddhism',
    ],
    internationalResponse: [
      { country: 'United Nations', response: 'Multiple calls for information on his whereabouts' },
      { country: 'United States', response: 'Congress passed resolutions calling for release' },
      { country: 'European Parliament', response: 'Repeated resolutions demanding proof of life' },
    ],
    howToHelp: [
      { action: 'Support ICT', link: 'https://savetibet.org', description: 'International Campaign for Tibet' },
      { action: 'Sign petitions', description: 'Call for proof of life and release' },
      { action: 'Raise awareness', hashtags: ['#FreePanchenLama', '#FreeTibet'] },
    ],
    sources: [
      { name: 'International Campaign for Tibet', url: 'https://savetibet.org/panchen-lama' },
      { name: 'UN Human Rights', url: 'https://www.ohchr.org' },
      { name: 'Tibet Action Institute', url: 'https://tibetaction.net' },
    ],
    quotes: [
      { text: 'The world has a responsibility to know what happened to this child.', context: 'Dalai Lama' },
    ],
  },
];

export default function CaseStudies() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'IMPRISONED': return 'bg-red-600';
      case 'DISAPPEARED': return 'bg-yellow-600';
      case 'RELEASED': return 'bg-green-600';
      default: return 'bg-[#1c2a35]';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'CRITICAL': return 'text-red-400 bg-red-900/30 border-red-700';
      case 'HIGH': return 'text-orange-400 bg-orange-900/30 border-orange-700';
      default: return 'text-slate-400 bg-[#111820] border-[#1c2a35]';
    }
  };

  if (selectedCase) {
    const caseData = caseStudies.find(c => c.id === selectedCase);
    
    return (
      <div className="bg-[#111820]/50 border border-[#1c2a35]">
        {/* Header */}
        <div className="p-6 border-b border-[#1c2a35]">
          <button
            onClick={() => setSelectedCase(null)}
            className="text-[#22d3ee] hover:text-[#22d3ee] text-sm mb-4 flex items-center gap-1"
          >
            ← Back to all cases
          </button>
          
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-[#111820] flex items-center justify-center">
              {caseData.photo ? <span className="text-4xl">{caseData.photo}</span> : <User className="w-10 h-10 text-slate-400" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getStatusColor(caseData.status)}`}>
                  {caseData.status}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getUrgencyColor(caseData.urgency)}`}>
                  {caseData.urgency}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#111820] text-slate-300">
                  {caseData.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{caseData.name}</h2>
              <p className="text-slate-400">{caseData.chineseName}</p>
              <p className="text-sm text-slate-500 mt-1">{caseData.occupation}</p>
            </div>
          </div>
          
          <p className="mt-4 text-slate-300">{caseData.summary}</p>
        </div>

        {/* Quick Facts */}
        <div className="p-6 border-b border-[#1c2a35] grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0a0e14]/50 p-3">
            <p className="text-xs text-slate-500 mb-1">Born</p>
            <p className="text-white font-medium">{caseData.birthYear}</p>
          </div>
          <div className="bg-[#0a0e14]/50 p-3">
            <p className="text-xs text-slate-500 mb-1">Nationality</p>
            <p className="text-white font-medium">{caseData.nationality}</p>
          </div>
          <div className="bg-[#0a0e14]/50 p-3">
            <p className="text-xs text-slate-500 mb-1">Status</p>
            <p className="text-white font-medium">{caseData.status}</p>
          </div>
          <div className="bg-[#0a0e14]/50 p-3">
            <p className="text-xs text-slate-500 mb-1">Category</p>
            <p className="text-white font-medium">{caseData.category}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-6 border-b border-[#1c2a35]">
          <button
            onClick={() => toggleSection('timeline')}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#22d3ee]" />
              Timeline
            </h3>
            {expandedSections.timeline ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>
          
          {expandedSections.timeline && (
            <div className="mt-4 space-y-3">
              {caseData.timeline.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-24 flex-shrink-0 text-sm text-slate-500">{item.date}</div>
                  <div className="flex-1">
                    <div className="w-2 h-2 bg-[#22d3ee] rounded-full mt-1.5 -ml-5 mr-3 float-left"></div>
                    <p className="text-slate-300">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Charges & Verdict */}
        <div className="p-6 border-b border-[#1c2a35]">
          <button
            onClick={() => toggleSection('legal')}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-red-400" />
              Charges & Verdict
            </h3>
            {expandedSections.legal ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>
          
          {expandedSections.legal && (
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-2">Charges</h4>
                {caseData.charges.map((charge, i) => (
                  <div key={i} className="bg-red-900/20 border border-red-800 p-3 mb-2">
                    <p className="text-white font-medium">{charge.charge}</p>
                    <p className="text-sm text-slate-400">Law: {charge.law}</p>
                    <p className="text-sm text-red-400">Max sentence: {charge.maxSentence}</p>
                  </div>
                ))}
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-2">Verdict</h4>
                <div className="bg-[#0a0e14]/50 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="text-white">{caseData.verdict.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Outcome</p>
                      <p className="text-red-400 font-semibold">{caseData.verdict.outcome}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Sentence</p>
                      <p className="text-white">{caseData.verdict.sentencing}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Court</p>
                      <p className="text-white">{caseData.verdict.judge}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* International Response */}
        <div className="p-6 border-b border-[#1c2a35]">
          <button
            onClick={() => toggleSection('international')}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-400" />
              International Response
            </h3>
            {expandedSections.international ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>
          
          {expandedSections.international && (
            <div className="mt-4 space-y-2">
              {caseData.internationalResponse.map((response, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#0a0e14]/50 p-3">
                  <Globe className="w-5 h-5 text-slate-300" />
                  <div>
                    <p className="text-white font-medium">{response.country}</p>
                    <p className="text-sm text-slate-400">{response.response}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How to Help */}
        <div className="p-6 border-b border-[#1c2a35]">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-pink-400" />
            How You Can Help
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {caseData.howToHelp.map((action, i) => (
              <div key={i} className="bg-[#0a0e14]/50 p-4 hover:bg-[#0a0e14]/70 transition-colors">
                <p className="text-white font-medium mb-1">{action.action}</p>
                {action.description && <p className="text-sm text-slate-400 mb-2">{action.description}</p>}
                {action.link && (
                  <a href={action.link} target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:text-[#22d3ee] text-sm flex items-center gap-1">
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {action.hashtags && (
                  <div className="flex gap-2 mt-2">
                    {action.hashtags.map((tag, j) => (
                      <span key={j} className="text-[#22d3ee] text-sm">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-slate-400" />
            Sources
          </h3>
          <div className="flex flex-wrap gap-2">
            {caseData.sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#111820] hover:bg-[#1c2a35] text-sm text-slate-300 flex items-center gap-1 transition-colors"
              >
                {source.name} <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111820]/50 p-6 border border-[#1c2a35]">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-[#22d3ee]" />
        <div>
          <h2 className="text-xl font-bold text-white">Case Study Deep Dives</h2>
          <p className="text-sm text-slate-400">In-depth profiles of major political prisoner cases</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {caseStudies.map(caseData => (
          <button
            key={caseData.id}
            onClick={() => {
              setSelectedCase(caseData.id);
              setExpandedSections({ timeline: true, legal: true, international: true });
            }}
            className="bg-[#0a0e14]/50 p-4 text-left hover:bg-[#0a0e14]/70 transition-colors border border-[#1c2a35] hover:border-[#2a9a52]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-[#111820] flex items-center justify-center">
                {caseData.photo ? <span className="text-2xl">{caseData.photo}</span> : <User className="w-6 h-6 text-slate-400" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium text-white ${getStatusColor(caseData.status)}`}>
                    {caseData.status}
                  </span>
                </div>
                <h3 className="text-white font-semibold">{caseData.name}</h3>
              </div>
            </div>
            <p className="text-sm text-slate-400 line-clamp-2">{caseData.summary}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">{caseData.category}</span>
              <span className="text-[#22d3ee] text-sm">Read more →</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-[#0a0e14]/50 border border-[#1c2a35]">
        <p className="text-sm text-slate-400">
          <strong className="text-white">Note:</strong> These case studies are compiled from verified sources including court documents, 
          human rights organizations, and reputable news outlets. All information is regularly updated as cases develop.
        </p>
      </div>
    </div>
  );
}
