import { describe, it, expect, vi, afterEach } from 'vitest';
import { calculateAge } from '../utils/dateUtils';

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
});
