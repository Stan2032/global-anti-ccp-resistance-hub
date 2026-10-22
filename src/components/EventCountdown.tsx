/**
 * EventCountdown — Live countdown timer for upcoming events.
 *
 * Displays days, hours, minutes, and seconds in a terminal-style monospace
 * layout. Automatically updates every second and shows contextual messages
 * for same-day and past events.
 *
 * @module EventCountdown
 */
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { calculateTimeLeft, type TimeLeft } from '../utils/dateUtils';
import { useClock } from '../utils/ssr';

/** "20 October 2026" for "2026-10-20", the same in every timezone. */
function formatEventDate(eventDate: string): string {
  const date = new Date(`${eventDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return eventDate;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

interface EventCountdownProps {
  eventDate: string;
  label?: string;
}

/**
 * EventCountdown — Live countdown timer to a future event date.
 * Shows days, hours, minutes, seconds in terminal-style monospace display.
 * Shows "EVENT TODAY" when the date arrives, and "EVENT PASSED" after.
 *
 * @param {Object} props
 * @param {string} props.eventDate - Target date string (parseable by Date constructor)
 * @param {string} [props.label='Time remaining'] - Label text above the countdown
 * @returns {React.ReactElement|null} Countdown display or null if no eventDate
 */
const EventCountdown: React.FC<EventCountdownProps> = ({ eventDate, label = 'Time remaining' }) => {
  // A countdown frozen at the moment the page was built would be wrong for
  // every reader without JavaScript, and would not match the browser's own
  // count when the page hydrates. Until the page is live, show the date.
  const { live } = useClock();
  const [tick, setTick] = useState<{ eventDate: string; timeLeft: TimeLeft } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick({ eventDate, timeLeft: calculateTimeLeft(eventDate) });
    }, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  if (!eventDate) return null;

  if (!live) {
    return (
      <div className="flex items-center gap-2 mt-2 font-mono text-xs text-slate-400">
        <Clock className="w-3 h-3 text-slate-500" aria-hidden="true" />
        <span>Event date: {formatEventDate(eventDate)}</span>
      </div>
    );
  }

  const timeLeft = tick?.eventDate === eventDate ? tick.timeLeft : calculateTimeLeft(eventDate);
  const { days, hours, minutes, seconds, isPast, isToday } = timeLeft;

  if (isPast && !isToday) {
    return (
      <div className="flex items-center gap-2 mt-2 font-mono text-xs text-slate-400">
        <Clock className="w-3 h-3 text-slate-500" />
        <span>Event date has passed</span>
      </div>
    );
  }

  if (isToday) {
    return (
      <div className="flex items-center gap-2 mt-2" role="timer" aria-label={label}>
        <Clock className="w-3 h-3 text-red-400 animate-pulse" />
        <span className="font-mono text-xs font-bold text-red-400 uppercase tracking-wider animate-pulse">
          <span aria-hidden="true">⚡</span> Event today
        </span>
      </div>
    );
  }

  return (
    <div className="mt-2" role="timer" aria-label={label}>
      <div className="flex items-center gap-3">
        <Clock className="w-3 h-3 text-[#fbbf24]" />
        <div className="flex gap-1 font-mono text-xs">
          <span className="bg-[#111820] border border-[#1c2a35] px-1.5 py-0.5 text-[#fbbf24] tabular-nums" aria-label={`${days} days`}>
            {String(days).padStart(2, '0')}d
          </span>
          <span className="bg-[#111820] border border-[#1c2a35] px-1.5 py-0.5 text-[#fbbf24] tabular-nums" aria-label={`${hours} hours`}>
            {String(hours).padStart(2, '0')}h
          </span>
          <span className="bg-[#111820] border border-[#1c2a35] px-1.5 py-0.5 text-[#fbbf24] tabular-nums" aria-label={`${minutes} minutes`}>
            {String(minutes).padStart(2, '0')}m
          </span>
          <span className="bg-[#111820] border border-[#1c2a35] px-1.5 py-0.5 text-[#fbbf24] tabular-nums" aria-label={`${seconds} seconds`}>
            {String(seconds).padStart(2, '0')}s
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCountdown;
