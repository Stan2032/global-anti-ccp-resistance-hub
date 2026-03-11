import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { calculateAge, formatAlertForSharing, daysSince, getFreshnessInfo, calculateTimeLeft } from '../utils/dateUtils';

describe('calculateAge', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should calculate age from full date string', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-21'));
    expect(calculateAge('December 8, 1947')).toBe(78); // Jimmy Lai
    expect(calculateAge('January 13, 1932')).toBe(94); // Cardinal Zen
    expect(calculateAge('October 13, 1996')).toBe(29); // Joshua Wong
  });

  it('should calculate age from year-only string', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-21'));
    expect(calculateAge('1964')).toBe(62); // Benny Tai
  });

  it('should calculate age at death when deathDate is provided', () => {
    expect(calculateAge('December 28, 1955', 'July 13, 2017')).toBe(61); // Liu Xiaobo
  });

  it('should handle birthday not yet passed in the year', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-21'));
    // December 3 birthday hasn't passed yet in February
    expect(calculateAge('December 3, 1996')).toBe(29); // Agnes Chow — turns 30 in Dec
  });

  it('should handle birthday already passed in the year', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-21'));
    // January 13 birthday has already passed
    expect(calculateAge('January 13, 1932')).toBe(94); // Cardinal Zen
  });

  it('should calculate correct ages for all profiled individuals', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-21'));

    const profiles = [
      { name: 'Jimmy Lai', birthDate: 'December 8, 1947', expected: 78 },
      { name: 'Ilham Tohti', birthDate: 'October 25, 1969', expected: 56 },
      { name: 'Joshua Wong', birthDate: 'October 13, 1996', expected: 29 },
      { name: 'Gui Minhai', birthDate: 'May 5, 1964', expected: 61 },
      { name: 'Zhang Zhan', birthDate: 'September 1, 1983', expected: 42 },
      { name: 'Gao Zhisheng', birthDate: 'April 20, 1966', expected: 59 },
      { name: 'Nathan Law', birthDate: 'July 13, 1993', expected: 32 },
      { name: 'Cardinal Zen', birthDate: 'January 13, 1932', expected: 94 },
      { name: 'Agnes Chow', birthDate: 'December 3, 1996', expected: 29 },
      { name: 'Panchen Lama', birthDate: 'April 25, 1989', expected: 36 },
    ];

    for (const { name, birthDate, expected } of profiles) {
      expect(calculateAge(birthDate), `${name} age`).toBe(expected);
    }
  });

  it('should calculate correct ages for UrgentCaseTimer individuals', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-21'));

    const urgentCases = [
      { name: 'Jimmy Lai', birthDate: 'December 8, 1947', expected: 78 },
      { name: 'Ilham Tohti', birthDate: 'October 25, 1969', expected: 56 },
      { name: 'Chow Hang-tung', birthDate: 'November 7, 1986', expected: 39 },
      { name: 'Panchen Lama', birthDate: 'April 25, 1989', expected: 36 },
    ];

    for (const { name, birthDate, expected } of urgentCases) {
      expect(calculateAge(birthDate), `${name} age`).toBe(expected);
    }
  });
});

describe('formatAlertForSharing', () => {
  it('formats an alert with title, summary, and link', () => {
    const alert = {
      title: 'Test Alert',
      summary: 'This is a test summary.',
      links: [{ url: 'https://example.com', name: 'Example' }],
    };
    const result = formatAlertForSharing(alert);
    expect(result).toContain('🚨 Test Alert');
    expect(result).toContain('This is a test summary.');
    expect(result).toContain('https://example.com');
    expect(result).not.toContain('#');
  });

  it('does not include hashtags in share text', () => {
    const alert = { title: 'Alert', summary: 'Summary', links: [] };
    const result = formatAlertForSharing(alert);
    expect(result).toContain('🚨 Alert');
    expect(result).toContain('Summary');
    expect(result).not.toContain('#');
  });

  it('handles alert with no links', () => {
    const alert = { title: 'Alert', summary: 'Summary', links: [] };
    const result = formatAlertForSharing(alert);
    expect(result).not.toContain('🔗');
  });

  it('returns empty string for null input', () => {
    expect(formatAlertForSharing(null)).toBe('');
  });

  it('returns empty string for undefined input', () => {
    expect(formatAlertForSharing(undefined as unknown as null)).toBe('');
  });

  it('includes only the first link URL', () => {
    const alert = {
      title: 'Alert',
      summary: 'Summary',
      links: [
        { url: 'https://first.com', name: 'First' },
        { url: 'https://second.com', name: 'Second' },
      ],
    };
    const result = formatAlertForSharing(alert);
    expect(result).toContain('https://first.com');
    expect(result).not.toContain('https://second.com');
  });
});

describe('daysSince', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 0 for today', () => {
    vi.setSystemTime(new Date(2026, 2, 3, 12, 0, 0));
    expect(daysSince('2026-03-03')).toBe(0);
  });

  it('returns 1 for yesterday', () => {
    vi.setSystemTime(new Date(2026, 2, 4, 12, 0, 0));
    expect(daysSince('2026-03-03')).toBe(1);
  });

  it('returns 7 for a week ago', () => {
    vi.setSystemTime(new Date(2026, 2, 10, 12, 0, 0));
    expect(daysSince('2026-03-03')).toBe(7);
  });

  it('returns Infinity for null', () => {
    expect(daysSince(null as unknown as string)).toBe(Infinity);
  });

  it('returns Infinity for undefined', () => {
    expect(daysSince(undefined as unknown as string)).toBe(Infinity);
  });
});

describe('getFreshnessInfo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns fresh level for today', () => {
    vi.setSystemTime(new Date(2026, 2, 3, 12, 0, 0));
    const result = getFreshnessInfo('2026-03-03');
    expect(result.label).toBe('Verified today');
    expect(result.level).toBe('fresh');
  });

  it('returns fresh level for yesterday', () => {
    vi.setSystemTime(new Date(2026, 2, 4, 12, 0, 0));
    const result = getFreshnessInfo('2026-03-03');
    expect(result.label).toBe('Verified yesterday');
    expect(result.level).toBe('fresh');
  });

  it('returns fresh level for ≤7 days', () => {
    vi.setSystemTime(new Date(2026, 2, 10, 12, 0, 0));
    const result = getFreshnessInfo('2026-03-03');
    expect(result.level).toBe('fresh');
  });

  it('returns recent level for 8-30 days', () => {
    vi.setSystemTime(new Date(2026, 2, 18, 12, 0, 0));
    const result = getFreshnessInfo('2026-03-03');
    expect(result.level).toBe('recent');
  });

  it('returns stale level for >30 days', () => {
    vi.setSystemTime(new Date(2026, 4, 3, 12, 0, 0));
    const result = getFreshnessInfo('2026-03-03');
    expect(result.level).toBe('stale');
  });
});

describe('calculateTimeLeft', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 4, 12, 0, 0)); // March 4, 2026 noon
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns countdown for future date', () => {
    const result = calculateTimeLeft('2026-03-06');
    expect(result.isPast).toBe(false);
    expect(result.isToday).toBe(false);
    expect(result.days).toBeGreaterThanOrEqual(1);
  });

  it('returns isToday for current date', () => {
    const result = calculateTimeLeft('2026-03-04');
    expect(result.isToday).toBe(true);
    expect(result.isPast).toBe(false);
  });

  it('returns isPast for past date', () => {
    const result = calculateTimeLeft('2026-03-01');
    expect(result.isPast).toBe(true);
    expect(result.isToday).toBe(false);
    expect(result.days).toBe(0);
  });

  it('returns fallback for null', () => {
    const result = calculateTimeLeft(null);
    expect(result.isPast).toBe(true);
    expect(result.days).toBe(0);
  });

  it('returns fallback for undefined', () => {
    const result = calculateTimeLeft(undefined);
    expect(result.isPast).toBe(true);
    expect(result.days).toBe(0);
  });

  it('returns fallback for malformed date string', () => {
    const result = calculateTimeLeft('not-a-date');
    expect(result.isPast).toBe(true);
    expect(result.days).toBe(0);
  });

  it('returns fallback for empty string', () => {
    const result = calculateTimeLeft('');
    expect(result.isPast).toBe(true);
    expect(result.days).toBe(0);
  });

  it('returns fallback for numeric value', () => {
    const result = calculateTimeLeft(12345 as unknown as string);
    expect(result.isPast).toBe(true);
    expect(result.days).toBe(0);
  });

  it('returns fallback for partial date', () => {
    const result = calculateTimeLeft('2026-03');
    expect(result.isPast).toBe(true);
    expect(result.days).toBe(0);
  });
});
