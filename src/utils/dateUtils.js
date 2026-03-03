/**
 * Date utilities for age calculation, date formatting, and event countdowns.
 * Used by profile pages, ProfilesIndex, and EventCountdown.
 */

/**
 * Calculate age from a birth date string.
 * Handles formats: "December 8, 1947", "1964" (year only), "April 25, 1989"
 * If a death date is provided, calculates age at death instead.
 *
 * @param {string} birthDate - Birth date string
 * @param {string} [deathDate] - Optional death date string
 * @returns {number} Calculated age
 */
export function calculateAge(birthDate, deathDate) {
  const endDate = deathDate ? new Date(deathDate) : new Date();
  const birth = new Date(birthDate);

  // If only a year was provided (e.g. "1964"), Date parses it as Jan 1.
  // With year-only births, exact month/day is unknown, so simple year
  // subtraction is the best available approximation (could be off by 1).
  if (/^\d{4}$/.test(birthDate.trim())) {
    return endDate.getFullYear() - parseInt(birthDate, 10);
  }

  let age = endDate.getFullYear() - birth.getFullYear();
  const monthDiff = endDate.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Calculate time remaining until eventDate.
 * eventDate should be YYYY-MM-DD string.
 *
 * @param {string|null|undefined} eventDate - Target date in YYYY-MM-DD format
 * @returns {{ days: number, hours: number, minutes: number, seconds: number, isPast: boolean, isToday: boolean }}
 */
export function calculateTimeLeft(eventDate) {
  if (!eventDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, isToday: false };
  
  const now = new Date();
  const [year, month, day] = eventDate.split('-').map(Number);
  const target = new Date(year, month - 1, day);
  
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
