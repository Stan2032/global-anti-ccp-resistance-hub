/**
 * Date utilities for age calculation, date formatting, event countdowns, and sharing.
 * Used by profile pages, ProfilesIndex, EventCountdown, EmergencyAlerts, and DataFreshnessIndicator.
 */

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  isToday: boolean;
}

export interface AlertForSharing {
  title: string;
  summary?: string;
  links?: Array<{ url: string }>;
}

export interface FreshnessInfo {
  label: string;
  level: 'fresh' | 'recent' | 'stale';
}

/**
 * The year, month (1–12) and day a date string names, in any timezone.
 *
 * `new Date('2021-02-28')` is midnight UTC, which is still 27 February in the
 * Americas; `new Date('February 28, 2021')` is local midnight. Reading the
 * matching fields of each gives back the date as written, so the result is
 * the same on the build server and in every reader's browser.
 */
function writtenDate(dateStr: string): [number, number, number] | null {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (iso) return [Number(iso[1]), Number(iso[2]), Number(iso[3])];
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
}

/** Today's date in UTC, the same for every reader at a given moment. */
function utcDate(now: Date): [number, number, number] {
  return [now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate()];
}

/**
 * Calculates age from a birth date string, optionally at a given death date.
 *
 * @param birthDate - Birth date in natural language (e.g. "December 8, 1947")
 *                    or year-only (e.g. "1964").
 * @param deathDate - Optional death date. If omitted, age is calculated as of `now`.
 * @param now - The moment to measure to. Components pass `useClock().now`, so
 *              the pre-rendered page and the browser agree (see utils/ssr).
 * @returns Age in years. For year-only inputs, uses simple year subtraction.
 */
export function calculateAge(birthDate: string, deathDate?: string, now: Date = new Date()): number {
  const end = (deathDate && writtenDate(deathDate)) || utcDate(now);

  // With year-only births, exact month/day is unknown, so simple year
  // subtraction is the best available approximation (could be off by 1).
  if (/^\d{4}$/.test(birthDate.trim())) {
    return end[0] - parseInt(birthDate, 10);
  }

  const birth = writtenDate(birthDate);
  if (!birth) return NaN;
  let age = end[0] - birth[0];
  if (end[1] < birth[1] || (end[1] === birth[1] && end[2] < birth[2])) age--;
  return age;
}

/**
 * Calculates time remaining until `eventDate`.
 *
 * @param eventDate - Target date as "YYYY-MM-DD", or null/undefined.
 * @returns A {@link TimeLeft} object with days/hours/minutes/seconds remaining,
 *          plus `isPast` and `isToday` flags. Returns zero-values with
 *          `isPast: true` for invalid or past dates.
 */
export function calculateTimeLeft(eventDate: string | null | undefined, now: Date = new Date()): TimeLeft {
  const fallback: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, isToday: false };
  if (!eventDate || typeof eventDate !== 'string') return fallback;
  
  const parts = eventDate.split('-');
  if (parts.length !== 3) return fallback;
  const [year, month, day] = parts.map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return fallback;
  
  const target = new Date(year, month - 1, day);
  if (isNaN(target.getTime())) return fallback;
  
  const isToday = now.getFullYear() === year && now.getMonth() === month - 1 && now.getDate() === day;
  
  const diff = target.getTime() - now.getTime();
  
  if (diff <= 0 && !isToday) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, isToday: false };
  }

  if (isToday) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false, isToday: true };
  }
  
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return { days, hours, minutes, seconds, isPast: false, isToday: false };
}

/**
 * Formats an emergency alert for sharing on social media.
 *
 * @param alert - The alert to format, or null.
 * @returns A string with emoji-prefixed title, summary, and first link URL.
 *          Returns empty string for null input.
 */
export function formatAlertForSharing(alert: AlertForSharing | null): string {
  if (!alert) return '';
  const lines: string[] = [];
  lines.push(`🚨 ${alert.title}`);
  if (alert.summary) lines.push(`\n${alert.summary}`);
  if (alert.links && alert.links.length > 0) {
    lines.push(`\n🔗 ${alert.links[0].url}`);
  }
  return lines.join('');
}

/**
 * Calculates the number of days since a given date string.
 *
 * @param dateStr - Date in "YYYY-MM-DD" format.
 * @returns Number of days elapsed. Returns 0 for today, negative for future
 *          dates, and `Infinity` for empty/falsy input.
 */
export function daysSince(dateStr: string, now: Date = new Date()): number {
  if (!dateStr) return Infinity;
  const [y, m, d] = dateStr.split('-').map(Number);
  // Counted from midnight UTC, so the build server and every reader agree.
  return Math.floor((now.getTime() - Date.UTC(y, m - 1, d)) / 86400000);
}

/**
 * Categorises a date into freshness tiers for display.
 *
 * @param dateStr - Verification date in "YYYY-MM-DD" format.
 * @returns A {@link FreshnessInfo} with a human-readable `label` and a `level`
 *          of `'fresh'` (≤7 days), `'recent'` (≤30 days), or `'stale'` (>30 days).
 */
export function getFreshnessInfo(dateStr: string, now: Date = new Date()): FreshnessInfo {
  const days = daysSince(dateStr, now);
  if (days <= 0) return { label: 'Verified today', level: 'fresh' };
  if (days === 1) return { label: 'Verified yesterday', level: 'fresh' };
  if (days <= 7) return { label: `Verified ${days} days ago`, level: 'fresh' };
  if (days <= 30) return { label: `Verified ${days} days ago`, level: 'recent' };
  return { label: `Verified ${days} days ago`, level: 'stale' };
}
