
/**
 * InteractiveTimeline — Filterable timeline of CCP human rights events,
 * with source attribution for each event.
 *
 * Every event is in the page as a native <details>, so all of them can be
 * read, opened and found without JavaScript. The strip of dots above is a
 * map of the same list: each dot links to its event.
 *
 * @module InteractiveTimeline
 */
import { useState } from 'react';
import { Calendar, ChevronDown, ZoomIn, ZoomOut } from 'lucide-react';
import SourceAttribution from './ui/SourceAttribution';
import { resolveSource } from '../utils/sourceLinks';
import { useBrowserValue } from '../utils/ssr';
import timelineEvents from '../data/timeline_events.json';

/** Derived from the JSON import so the type stays in sync with the data. */
type TimelineEvent = (typeof timelineEvents)[number];

// Categories kept inline since they include Tailwind CSS classes (not pure data)

const categories = [
  { id: 'all', name: 'All Events', color: 'bg-[#1c2a35]' },
  { id: 'hongkong', name: 'Hong Kong', color: 'bg-yellow-500' },
  { id: 'uyghur', name: 'Uyghur/Xinjiang', color: 'bg-[#22d3ee]' },
  { id: 'tibet', name: 'Tibet', color: 'bg-red-500' },
  { id: 'mainland', name: 'Mainland China', color: 'bg-[#22d3ee]' },
  { id: 'falungong', name: 'Falun Gong', color: 'bg-orange-500' },
  { id: 'global', name: 'Global', color: 'bg-green-500' }
];

/** The id each event's <details> carries, and each dot links to. */
const eventAnchor = (event: { id: number }) => `timeline-event-${event.id}`;

/** A source's own URL, where the event maps its sources to URLs by name. */
const sourceUrlFor = (event: TimelineEvent, source: string): string | undefined => {
  const urls: unknown = event.source_urls;
  return urls && !Array.isArray(urls) ? (urls as Record<string, string | undefined>)[source] : undefined;
};

const getCategoryColor = (category: string): string =>
  categories.find(c => c.id === category)?.color || 'bg-[#1c2a35]';

const getCategoryName = (category: string): string =>
  categories.find(c => c.id === category)?.name ?? category;

const getSignificanceStyle = (significance: string): string => {
  switch (significance) {
    case 'critical': return 'ring-2 ring-red-500';
    case 'high': return 'ring-2 ring-orange-500';
    default: return '';
  }
};

// UTC, so the pre-rendered date and the reader's are the same day: a
// reader west of UTC would otherwise see the day before, and React would
// throw the page away over the mismatch.
const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });

const yearOf = (event: TimelineEvent) => Number(event.date.slice(0, 4));

/** Open an event's <details> when its dot is followed; the link scrolls to it. */
const openEvent = (event: TimelineEvent) => {
  const details = document.getElementById(eventAnchor(event));
  if (details instanceof HTMLDetailsElement) details.open = true;
};

const STATS: { key: 'casualties' | 'detained' | 'participants' | 'sentence' | 'stations'; label: string; tone: string }[] = [
  { key: 'casualties', label: 'Casualties', tone: 'bg-red-900/30 text-red-400' },
  { key: 'detained', label: 'Detained', tone: 'bg-orange-900/30 text-orange-400' },
  { key: 'participants', label: 'Participants', tone: 'bg-[#111820] text-[#22d3ee]' },
  { key: 'sentence', label: 'Sentence', tone: 'bg-[#111820] text-[#22d3ee]' },
  { key: 'stations', label: 'Police Stations', tone: 'bg-green-900/30 text-green-400' },
];

export default function InteractiveTimeline() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  const scripted = useBrowserValue(() => true, false);

  const filteredEvents = selectedCategory === 'all'
    ? timelineEvents
    : timelineEvents.filter(e => e.category === selectedCategory);

  const years = filteredEvents.map(yearOf);
  const yearRange = { min: Math.min(...years), max: Math.max(...years) };

  return (
    <div className="bg-[#111820]/50 p-6 border border-[#1c2a35]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-red-400 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-white">Interactive Timeline</h2>
            <p className="text-sm text-slate-400">Key events in the struggle against CCP authoritarianism</p>
          </div>
        </div>
        {scripted && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
              className="p-2 bg-[#111820] hover:bg-[#1c2a35] transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4 text-slate-300" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
              className="p-2 bg-[#111820] hover:bg-[#1c2a35] transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter timeline events by region">
        {categories.map(category => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategory(category.id)}
            aria-pressed={selectedCategory === category.id}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? `${category.color} text-white`
                : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35]'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* The same events, placed by year. Each dot links to its event below. */}
      <div className="relative mb-6 overflow-x-auto">
        <div className="min-w-[540px] py-8" style={{ transform: `scaleX(${zoomLevel})`, transformOrigin: 'left' }}>
          {/* Year markers — adaptive interval to prevent overlap */}
          <div className="relative h-6 mb-2 mx-4" aria-hidden="true">
            {(() => {
              const span = yearRange.max - yearRange.min;
              const step = span > 25 ? 5 : span > 15 ? 3 : span > 8 ? 2 : 1;
              const minGap = Math.max(2, Math.floor(step / 2));
              const marks = [];
              for (let y = yearRange.min; y <= yearRange.max; y++) {
                const isFirst = y === yearRange.min;
                const isLast = y === yearRange.max;
                const isStep = y % step === 0;
                if (isFirst || isLast) { marks.push(y); continue; }
                if (isStep && (y - yearRange.min) >= minGap && (yearRange.max - y) >= minGap) marks.push(y);
              }
              return marks.map(year => {
                const pct = span === 0 ? 50 : ((year - yearRange.min) / span) * 100;
                return (
                  <span
                    key={year}
                    className="absolute text-xs text-slate-400 -translate-x-1/2 whitespace-nowrap"
                    style={{ left: `${pct}%` }}
                  >
                    {year}
                  </span>
                );
              });
            })()}
          </div>

          {/* Timeline line */}
          <div className="relative h-2 bg-[#111820] rounded-full mx-4">
            {filteredEvents.map(event => {
              const span = yearRange.max - yearRange.min;
              const position = span === 0 ? 50 : ((yearOf(event) - yearRange.min) / span) * 100;
              return (
                <a
                  key={event.id}
                  href={`#${eventAnchor(event)}`}
                  onClick={() => openEvent(event)}
                  className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${getCategoryColor(event.category)} ${getSignificanceStyle(event.significance)} hover:scale-150 focus-visible:scale-150 transition-transform`}
                  style={{ left: `${position}%` }}
                  title={event.title}
                  aria-label={`${yearOf(event)}: ${event.title}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-400 mb-3" role="status">
        {filteredEvents.length === timelineEvents.length
          ? `${timelineEvents.length} events, oldest first`
          : `${filteredEvents.length} of ${timelineEvents.length} events, oldest first`}
      </p>

      {/* Every event, in the page before any click */}
      <ol className="space-y-2">
        {filteredEvents.map(event => (
          <li key={event.id}>
            <details id={eventAnchor(event)} className="border border-[#1c2a35] bg-[#0a0e14]/50 scroll-mt-4">
              <summary
                className="flex items-start gap-3 p-4 cursor-pointer list-none hover:bg-white/5
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4afa82]
                           [&::-webkit-details-marker]:hidden"
              >
                <span
                  className={`mt-1.5 w-3 h-3 rounded-full flex-shrink-0 ${getCategoryColor(event.category)} ${getSignificanceStyle(event.significance)}`}
                  aria-hidden="true"
                />
                <span className="flex-1 min-w-0">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-slate-400">
                    <span className="whitespace-nowrap">{formatDate(event.date)}</span>
                    <span className="text-slate-300">{getCategoryName(event.category)}</span>
                    {event.significance === 'critical' && (
                      <span className="px-1.5 py-0.5 bg-red-600 text-white">Critical</span>
                    )}
                  </span>
                  <span className="block font-semibold text-white mt-1">{event.title}</span>
                </span>
                <ChevronDown
                  className="w-4 h-4 mt-1 flex-shrink-0 text-slate-400 transition-transform summary-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>

              <div className="px-4 pb-4 pt-3 border-t border-[#1c2a35] space-y-4">
                <p className="text-slate-300">{event.description}</p>
                {event.details && (
                  <p className="text-sm text-slate-300 whitespace-pre-line bg-[#111820]/50 p-4">{event.details}</p>
                )}

                {STATS.some(s => event[s.key as keyof TimelineEvent]) && (
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {STATS.filter(s => event[s.key as keyof TimelineEvent]).map(s => (
                      <div key={s.key} className={`p-3 ${s.tone.split(' ')[0]}`}>
                        <dt className={`text-xs mb-1 ${s.tone.split(' ')[1]}`}>{s.label}</dt>
                        <dd className="text-white font-semibold break-words">{String(event[s.key as keyof TimelineEvent])}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {event.impact && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 mb-2">Impact</h3>
                    <p className="text-slate-300">{event.impact}</p>
                  </div>
                )}

                {event.sources?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 mb-2">Sources</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.sources.map((source: string, i: number) => {
                        const resolved = resolveSource(source, sourceUrlFor(event, source));
                        return resolved.url ? (
                          <SourceAttribution key={i} source={resolved} compact />
                        ) : (
                          <span key={i} className="px-2 py-1 bg-[#111820] text-xs text-slate-300">
                            {source}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </details>
          </li>
        ))}
      </ol>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-[#1c2a35]">
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#1c2a35] ring-2 ring-red-500"></div>
            <span className="text-xs text-slate-400">Critical Event</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#1c2a35] ring-2 ring-orange-500"></div>
            <span className="text-xs text-slate-400">High Significance</span>
          </div>
          {categories.slice(1).map(cat => (
            <div key={cat.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
              <span className="text-xs text-slate-400">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111820] p-3 text-center">
          <p className="text-2xl font-bold text-white">{timelineEvents.length}</p>
          <p className="text-xs text-slate-400">Total Events</p>
        </div>
        <div className="bg-[#111820] p-3 text-center">
          <p className="text-2xl font-bold text-white">{yearRange.max - yearRange.min + 1}</p>
          <p className="text-xs text-slate-400">Years Covered</p>
        </div>
        <div className="bg-[#111820] p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{timelineEvents.filter(e => e.significance === 'critical').length}</p>
          <p className="text-xs text-slate-400">Critical Events</p>
        </div>
        <div className="bg-[#111820] p-3 text-center">
          <p className="text-2xl font-bold text-yellow-400">{timelineEvents.filter(e => e.category === 'hongkong').length}</p>
          <p className="text-xs text-slate-400">Hong Kong Events</p>
        </div>
      </div>
    </div>
  );
}
