/**
 * ProfileTimeline — the event timeline on each prisoner profile page.
 *
 * Each event is a native <details>: the year and title are the summary, the
 * detail and its source are the body. It opens with no JavaScript at all,
 * and a find-in-page match opens the event that contains it.
 *
 * It replaces three hand-rolled variants spread over fifteen profile pages,
 * all built on React state. Those rendered an event's detail only after a
 * click, so a reader without JavaScript got the titles and nothing else:
 * on Jimmy Lai's page that was a third of the page's text, sources
 * included. One variant also nested the Source link inside the toggle
 * button, which is invalid HTML and confuses screen readers.
 *
 * "Expand all" and "Collapse all" appear only once JavaScript is running,
 * so a reader without it never sees a button that does nothing.
 *
 * @module ProfileTimeline
 */
import { useRef } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { useBrowserValue } from '../utils/ssr';

export interface TimelineEntry {
  year: string;
  title: string;
  detail?: string;
  sourceUrl?: string;
  /** Short category label shown beside the year, e.g. "Persecution". */
  label?: string;
  /** Border and background classes that colour this event by category. */
  tone?: string;
  /** Tailwind text colour for the category label. */
  labelTone?: string;
}

export function ProfileTimeline({ events }: { events: readonly TimelineEntry[] }) {
  const list = useRef<HTMLOListElement>(null);
  const scripted = useBrowserValue(() => true, false);

  const setAll = (open: boolean) => {
    list.current?.querySelectorAll('details').forEach(d => { d.open = open; });
  };

  return (
    <div>
      {scripted && (
        <div className="flex gap-3 mb-3 text-xs">
          <button type="button" onClick={() => setAll(true)} className="text-[#22d3ee] hover:underline">
            Expand all
          </button>
          <button type="button" onClick={() => setAll(false)} className="text-slate-400 hover:underline">
            Collapse all
          </button>
        </div>
      )}
      <ol ref={list} className="space-y-2">
        {events.map((event, i) => (
          <li key={i}>
            <details className={`border ${event.tone ?? 'border-[#1c2a35] bg-[#111820]'}`}>
              <summary
                className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none
                           hover:bg-white/5 focus-visible:outline focus-visible:outline-2
                           focus-visible:outline-[#4afa82] [&::-webkit-details-marker]:hidden"
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-slate-400 whitespace-nowrap">{event.year}</span>
                  {event.label && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border border-white/10 ${event.labelTone ?? 'text-slate-200'}`}>
                      {event.label}
                    </span>
                  )}
                  <span className="text-sm font-medium text-white">{event.title}</span>
                </span>
                <ChevronDown
                  className="w-4 h-4 text-slate-400 flex-shrink-0 transition-transform summary-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              {(event.detail || event.sourceUrl) && (
                <div className="px-4 pb-3 border-t border-white/5">
                  {event.detail && (
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">{event.detail}</p>
                  )}
                  {event.sourceUrl && (
                    <a
                      href={event.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-[#22d3ee] hover:text-white"
                    >
                      <ExternalLink className="w-3 h-3" aria-hidden="true" /> Source
                    </a>
                  )}
                </div>
              )}
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ProfileTimeline;
