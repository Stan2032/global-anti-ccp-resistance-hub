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

// Calculates age from a birth date string, optionally at a given death date.
// Handles formats: "December 8, 1947", "1964" (year only), "April 25, 1989".
export function calculateAge(birthDate: string, deathDate?: string): number {
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

// Calculates time remaining until eventDate (YYYY-MM-DD).
export function calculateTimeLeft(eventDate: string | null | undefined): TimeLeft {
  const fallback: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, isToday: false };
  if (!eventDate || typeof eventDate !== 'string') return fallback;
  
  const parts = eventDate.split('-');
  if (parts.length !== 3) return fallback;
  const [year, month, day] = parts.map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return fallback;
  
  const now = new Date();
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

// Formats an emergency alert for sharing on social media.
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

// Calculates days since a date string (YYYY-MM-DD). Returns 0 for today, negative for future dates.
export function daysSince(dateStr: string): number {
  if (!dateStr) return Infinity;
  const now = new Date();
  const [y, m, d] = dateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  const diffMs = now.getTime() - target.getTime();
  return Math.floor(diffMs / 86400000);
}

// Formats days since into a human-readable "freshness" label and categorisation level.
export function getFreshnessInfo(dateStr: string): FreshnessInfo {
  const days = daysSince(dateStr);
  if (days <= 0) return { label: 'Verified today', level: 'fresh' };
  if (days === 1) return { label: 'Verified yesterday', level: 'fresh' };
  if (days <= 7) return { label: `Verified ${days} days ago`, level: 'fresh' };
  if (days <= 30) return { label: `Verified ${days} days ago`, level: 'recent' };
  return { label: `Verified ${days} days ago`, level: 'stale' };
}
