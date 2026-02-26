import { describe, it, expect } from 'vitest';
import { STATISTICS, formatStat, getStatSources } from '../data/statistics';

describe('Centralized statistics', () => {
  it('exports a STATISTICS object with required keys', () => {
    const requiredKeys = [
      'uyghurDetention',
      'surveillanceCameras',
      'overseasPoliceStations',
      'hongKong47',
      'confuciusInstitutes',
      'tiananmenYear',
      'organHarvesting',
      'forcedLabor',
      'socialCreditSystem',
      'greatFirewall',
    ];
    for (const key of requiredKeys) {
      expect(STATISTICS[key]).toBeDefined();
      expect(STATISTICS[key].value).toBeTruthy();
      expect(STATISTICS[key].context).toBeTruthy();
      expect(STATISTICS[key].sources).toBeInstanceOf(Array);
      expect(STATISTICS[key].sources.length).toBeGreaterThan(0);
      expect(STATISTICS[key].lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('uses "CCP" terminology, never "CPC"', () => {
    const allText = JSON.stringify(STATISTICS);
    expect(allText).not.toContain('"CPC"');
    expect(allText).not.toContain(' CPC ');
  });

  it('Uyghur detention value reflects the consensus range', () => {
    expect(STATISTICS.uyghurDetention.value).toContain('million');
  });

  it('formatStat returns a readable string', () => {
    const result = formatStat('uyghurDetention');
    expect(result).toContain('million');
    expect(result).toContain('Uyghur');
  });

  it('formatStat returns empty string for unknown key', () => {
    expect(formatStat('nonexistent')).toBe('');
  });

  it('getStatSources returns source array', () => {
    const sources = getStatSources('surveillanceCameras');
    expect(sources).toBeInstanceOf(Array);
    expect(sources.length).toBeGreaterThan(0);
  });

  it('getStatSources returns empty array for unknown key', () => {
    expect(getStatSources('nonexistent')).toEqual([]);
  });

  it('every statistic has at least 2 credible sources', () => {
    for (const [key, stat] of Object.entries(STATISTICS)) {
      expect(stat.sources.length, `${key} should have at least 2 sources`).toBeGreaterThanOrEqual(2);
    }
  });
});
