import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { calculateTimeLeft } from '../utils/dateUtils';

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
const EventCountdown = ({ eventDate, label = 'Time remaining' }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(eventDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(eventDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  if (!eventDate) return null;

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
