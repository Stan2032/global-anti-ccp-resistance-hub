import { useState } from 'react';
import { SourcesList } from './ui/SourceAttribution';
import { CalendarDays } from 'lucide-react';
import timelineData from '../data/timeline_events.json';

const Timeline = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedEvent, setExpandedEvent] = useState(null);

  const categories = [
    { key: 'all', label: 'All Events', color: 'gray' },
    { key: 'hongkong', label: 'Hong Kong', color: 'yellow' },
    { key: 'uyghur', label: 'Uyghurs', color: 'blue' },
    { key: 'tibet', label: 'Tibet', color: 'orange' },
    { key: 'mainland', label: 'Mainland', color: 'red' },
    { key: 'falungong', label: 'Falun Gong', color: 'purple' },
    { key: 'global', label: 'Global', color: 'cyan' },
  ];

  // Events sourced from timeline_events.json — single source of truth
  const events = timelineData;

  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(e => e.category === selectedCategory);

  const getCategoryColor = (category) => {
    const colors = {
      hongkong: 'border-yellow-500 bg-yellow-500/10',
      uyghur: 'border-blue-500 bg-blue-500/10',
      tibet: 'border-orange-500 bg-orange-500/10',
      mainland: 'border-red-500 bg-red-500/10',
      falungong: 'border-purple-500 bg-purple-500/10',
      global: 'border-cyan-500 bg-cyan-500/10'
    };
    return colors[category] || 'border-gray-500 bg-gray-500/10';
  };

  const getSignificanceColor = (significance) => {
    return significance === 'critical' ? 'bg-red-600' : 'bg-orange-500';
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
          <span className="text-red-400">{filteredEvents.filter(e => e.significance === 'critical').length} critical</span>
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
                  {event.significance.toUpperCase()}
                </span>
              </div>
              
              {/* Description */}
              <p className="text-slate-300 text-sm">{event.description}</p>
              
              {/* Expanded Content */}
              {expandedEvent === index && (
                <div className="mt-4 pt-4 border-t border-[#1c2a35] space-y-3">
                  {event.details && (
                    <p className="text-slate-300 text-sm leading-relaxed">{event.details}</p>
                  )}
                  {event.casualties && (
                    <div className="text-sm">
                      <span className="text-red-400 font-semibold">Casualties:</span>{' '}
                      <span className="text-slate-300">{event.casualties}</span>
                    </div>
                  )}
                  {event.impact && (
                    <div className="text-sm">
                      <span className="text-[#4afa82] font-semibold">Impact:</span>{' '}
                      <span className="text-slate-300">{event.impact}</span>
                    </div>
                  )}
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
