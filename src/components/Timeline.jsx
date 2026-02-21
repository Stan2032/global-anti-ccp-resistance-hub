import { useState } from 'react';
import { SourcesList } from './ui/SourceAttribution';
import { CalendarDays } from 'lucide-react';

const Timeline = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedEvent, setExpandedEvent] = useState(null);

  const categories = [
    { key: 'all', label: 'All Events', color: 'gray' },
    { key: 'hongkong', label: 'Hong Kong', color: 'yellow' },
    { key: 'xinjiang', label: 'Xinjiang', color: 'blue' },
    { key: 'tibet', label: 'Tibet', color: 'orange' },
    { key: 'taiwan', label: 'Taiwan', color: 'green' },
    { key: 'transnational', label: 'Transnational', color: 'purple' },
    { key: 'domestic', label: 'Domestic', color: 'red' },
  ];

  // Historical timeline - major documented events
  // Recent news removed (use RSS feeds instead)
  const events = [
    {
      date: '2022-12-04',
      title: 'Safeguard Defenders Police Stations Report',
      category: 'transnational',
      description: 'Report reveals 102 CCP overseas police stations operating in 53 countries, engaging in transnational repression.',
      significance: 'CRITICAL',
      sources: ['Safeguard Defenders']
    },
    {
      date: '2022-09-01',
      title: 'UN Xinjiang Report Released',
      category: 'xinjiang',
      description: 'UN Human Rights Office releases report finding "serious human rights violations" against Uyghurs, including possible crimes against humanity.',
      significance: 'CRITICAL',
      sources: ['UN OHCHR']
    },
    {
      date: '2021-06-24',
      title: 'Apple Daily Forced to Close',
      category: 'hongkong',
      description: 'Pro-democracy newspaper Apple Daily publishes final edition after assets frozen under National Security Law.',
      significance: 'HIGH',
      sources: ['HKFP', 'BBC']
    },
    {
      date: '2021-01-06',
      title: 'Mass Arrest of Hong Kong 47',
      category: 'hongkong',
      description: '47 pro-democracy figures arrested for organizing unofficial primary elections.',
      significance: 'CRITICAL',
      sources: ['Hong Kong Watch']
    },
    {
      date: '2020-08-10',
      title: 'Jimmy Lai Arrested',
      category: 'hongkong',
      description: 'Media tycoon Jimmy Lai arrested under National Security Law, Apple Daily offices raided.',
      significance: 'HIGH',
      sources: ['BBC', 'HKFP']
    },
    {
      date: '2020-06-30',
      title: 'National Security Law Enacted',
      category: 'hongkong',
      description: 'Beijing imposes sweeping National Security Law on Hong Kong, criminalizing secession, subversion, terrorism, and collusion.',
      significance: 'CRITICAL',
      sources: ['BBC', 'Reuters']
    },
    {
      date: '2019-11-27',
      title: 'Hong Kong Human Rights Act Signed',
      category: 'hongkong',
      description: 'US President signs Hong Kong Human Rights and Democracy Act, requiring annual review of Hong Kong\'s autonomy.',
      significance: 'HIGH',
      sources: ['Congress.gov']
    },
    {
      date: '2019-11-16',
      title: 'Xinjiang Papers Leaked',
      category: 'xinjiang',
      description: 'NYT publishes leaked internal CCP documents confirming mass detention of over 1 million Uyghurs in "re-education" camps. ICIJ China Cables follow November 24.',
      significance: 'CRITICAL',
      sources: ['ICIJ', 'NYT']
    },
    {
      date: '2019-06-09',
      title: 'Hong Kong Protests Begin',
      category: 'hongkong',
      description: 'Over 1 million march against extradition bill, beginning months of pro-democracy protests.',
      significance: 'CRITICAL',
      sources: ['BBC', 'SCMP']
    },
    {
      date: '2018-03-11',
      title: 'Xi Jinping Term Limits Removed',
      category: 'domestic',
      description: 'Constitutional amendment removes presidential term limits, allowing Xi Jinping to rule indefinitely.',
      significance: 'CRITICAL',
      sources: ['Reuters', 'BBC']
    },
    {
      date: '2017-08-13',
      title: 'Gao Zhisheng Disappears',
      category: 'domestic',
      description: 'Human rights lawyer Gao Zhisheng disappears after brief release, whereabouts unknown to this day.',
      significance: 'HIGH',
      sources: ['HRW', 'Amnesty']
    },
    {
      date: '2017-07-13',
      title: 'Liu Xiaobo Dies in Custody',
      category: 'domestic',
      description: 'Nobel Peace Prize laureate Liu Xiaobo dies of liver cancer while imprisoned, denied medical parole.',
      significance: 'CRITICAL',
      sources: ['Nobel Committee', 'BBC']
    },
    {
      date: '2015-07-09',
      title: '709 Crackdown Begins',
      category: 'domestic',
      description: 'Mass arrest of over 300 human rights lawyers and activists across China.',
      significance: 'CRITICAL',
      sources: ['CHRD', 'HRW']
    },
    {
      date: '2014-09-28',
      title: 'Umbrella Movement Begins',
      category: 'hongkong',
      description: 'Pro-democracy protests occupy Hong Kong streets for 79 days demanding genuine universal suffrage.',
      significance: 'HIGH',
      sources: ['BBC', 'SCMP']
    },
    {
      date: '2014-01-15',
      title: 'Ilham Tohti Arrested',
      category: 'xinjiang',
      description: 'Uyghur economist Ilham Tohti arrested, later sentenced to life imprisonment for "separatism."',
      significance: 'HIGH',
      sources: ['Amnesty', 'CECC']
    },
    {
      date: '2012-11-15',
      title: 'Xi Jinping Becomes Leader',
      category: 'domestic',
      description: 'Xi Jinping becomes General Secretary of CCP, beginning era of increased repression.',
      significance: 'CRITICAL',
      sources: ['Reuters']
    },
    {
      date: '2010-12-10',
      title: 'Liu Xiaobo Awarded Nobel Peace Prize',
      category: 'domestic',
      description: 'Imprisoned dissident Liu Xiaobo awarded Nobel Peace Prize; empty chair represents him at ceremony.',
      significance: 'HIGH',
      sources: ['Nobel Committee']
    },
    {
      date: '2008-12-10',
      title: 'Charter 08 Published',
      category: 'domestic',
      description: 'Liu Xiaobo and others publish Charter 08 calling for political reform; Liu arrested two days before.',
      significance: 'HIGH',
      sources: ['PEN International']
    },
    {
      date: '2008-03-14',
      title: 'Tibet Uprising',
      category: 'tibet',
      description: 'Protests across Tibet met with violent crackdown; hundreds killed, thousands detained.',
      significance: 'CRITICAL',
      sources: ['ICT', 'HRW']
    },
    {
      date: '1999-07-20',
      title: 'Falun Gong Persecution Begins',
      category: 'domestic',
      description: 'CCP launches campaign to "eradicate" Falun Gong; millions detained, tortured, killed.',
      significance: 'CRITICAL',
      sources: ['Falun Dafa Info Center', 'China Tribunal']
    },
    {
      date: '1997-07-01',
      title: 'Hong Kong Handover',
      category: 'hongkong',
      description: 'Britain returns Hong Kong to China under "One Country, Two Systems" framework.',
      significance: 'HIGH',
      sources: ['BBC']
    },
    {
      date: '1995-05-17',
      title: 'Panchen Lama Abducted',
      category: 'tibet',
      description: '6-year-old Gedhun Choekyi Nyima, recognized as 11th Panchen Lama, abducted by Chinese authorities.',
      significance: 'HIGH',
      sources: ['ICT', 'Free Tibet']
    },
    {
      date: '1989-06-04',
      title: 'Tiananmen Square Massacre',
      category: 'domestic',
      description: 'PLA kills hundreds to thousands of pro-democracy protesters in Beijing.',
      significance: 'CRITICAL',
      sources: ['Tiananmen Mothers', 'BBC']
    },
    {
      date: '1959-03-10',
      title: 'Tibetan Uprising',
      category: 'tibet',
      description: 'Tibetan uprising against Chinese occupation; Dalai Lama flees to India.',
      significance: 'CRITICAL',
      sources: ['ICT']
    },
    {
      date: '1950-10-07',
      title: 'China Invades Tibet',
      category: 'tibet',
      description: 'PLA invades Tibet, beginning occupation that continues to this day.',
      significance: 'CRITICAL',
      sources: ['ICT', 'Free Tibet']
    }
  ];

  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(e => e.category === selectedCategory);

  const getCategoryColor = (category) => {
    const colors = {
      hongkong: 'border-yellow-500 bg-yellow-500/10',
      xinjiang: 'border-blue-500 bg-blue-500/10',
      tibet: 'border-orange-500 bg-orange-500/10',
      taiwan: 'border-green-500 bg-green-500/10',
      transnational: 'border-purple-500 bg-purple-500/10',
      domestic: 'border-red-500 bg-red-500/10'
    };
    return colors[category] || 'border-gray-500 bg-gray-500/10';
  };

  const getSignificanceColor = (significance) => {
    return significance === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111820] p-6 border border-[#1c2a35]">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><CalendarDays className="w-6 h-6" /> Timeline of CCP Repression</h2>
        <p className="text-slate-400">
          Key events documenting the Chinese Communist Party's human rights abuses from 1950 to present.
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="text-slate-400">{filteredEvents.length} events</span>
          <span className="text-red-400">{filteredEvents.filter(e => e.significance === 'CRITICAL').length} critical</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === cat.key
                ? 'bg-red-600 text-white'
                : 'bg-[#111820] text-slate-300 hover:bg-[#111820]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#111820]" />

        {/* Events */}
        <div className="space-y-4">
          {filteredEvents.map((event, index) => (
            <div
              key={index}
              className={`relative pl-12 ${getCategoryColor(event.category)} border-l-4 rounded-r-lg p-4 cursor-pointer hover:bg-opacity-20 transition-colors`}
              onClick={() => setExpandedEvent(expandedEvent === index ? null : index)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedEvent(expandedEvent === index ? null : index) } }}
              role="button"
              tabIndex={0}
              aria-expanded={expandedEvent === index}
            >
              {/* Timeline Dot */}
              <div className={`absolute left-2 top-6 w-4 h-4 rounded-full ${getSignificanceColor(event.significance)} border-2 border-[#0a0e14]`} />
              
              {/* Date */}
              <div className="text-sm text-slate-400 mb-1">{event.date}</div>
              
              {/* Title */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getSignificanceColor(event.significance)} text-white`}>
                  {event.significance}
                </span>
              </div>
              
              {/* Description */}
              <p className="text-slate-300 text-sm">{event.description}</p>
              
              {/* Expanded Content */}
              {expandedEvent === index && (
                <div className="mt-4 pt-4 border-t border-[#1c2a35]">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-slate-400">Sources:</span>
                    {event.sources.map((source, i) => (
                      <span key={i} className="bg-[#111820] text-slate-300 px-2 py-1 rounded text-xs">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Source Organizations */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
        <SourcesList
          sources={[
            {
              name: 'UN OHCHR Xinjiang Assessment',
              url: 'https://www.ohchr.org/en/documents/country-reports/ohchr-assessment-human-rights-concerns-xinjiang-uyghur-autonomous-region',
              type: 'Government Document',
              organization: 'UN Office of the High Commissioner for Human Rights',
              verified: true,
              description: 'Official UN assessment of human rights violations in Xinjiang.',
            },
            {
              name: 'Safeguard Defenders: Overseas Police Stations',
              url: 'https://safeguarddefenders.com/en/blog/110-overseas-chinese-transnational-policing-gone-wild',
              type: 'NGO Report',
              organization: 'Safeguard Defenders',
              verified: true,
              description: 'Investigation documenting CCP overseas police stations in 53 countries.',
            },
            {
              name: 'Human Rights Watch: China',
              url: 'https://www.hrw.org/asia/china-and-tibet',
              type: 'Human Rights Report',
              organization: 'Human Rights Watch',
              verified: true,
              description: 'Comprehensive documentation of human rights abuses across China.',
            },
            {
              name: 'International Campaign for Tibet',
              url: 'https://savetibet.org/',
              type: 'NGO Report',
              organization: 'International Campaign for Tibet',
              verified: true,
              description: 'Documentation of Tibet under Chinese occupation since 1950.',
            },
            {
              name: 'ICIJ: China Cables',
              url: 'https://www.icij.org/investigations/china-cables/',
              type: 'News Report',
              organization: 'International Consortium of Investigative Journalists',
              verified: true,
              description: 'Leaked classified Chinese government documents on Xinjiang detention camps.',
            },
          ]}
          title="Primary Source Organizations"
        />
      </div>
    </div>
  );
};

export default Timeline;
