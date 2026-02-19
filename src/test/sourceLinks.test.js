import { describe, it, expect } from 'vitest';
import { resolveSource, resolveSources } from '../utils/sourceLinks';

describe('sourceLinks', () => {
  describe('resolveSource', () => {
    it('should resolve a known source with URL, type, and verified status', () => {
      const result = resolveSource('Amnesty International');
      expect(result.name).toBe('Amnesty International');
      expect(result.url).toBe('https://www.amnesty.org/');
      expect(result.type).toBe('NGO Report');
      expect(result.verified).toBe(true);
    });

    it('should resolve Human Rights Watch correctly', () => {
      const result = resolveSource('Human Rights Watch');
      expect(result.url).toBe('https://www.hrw.org/');
      expect(result.type).toBe('NGO Report');
      expect(result.verified).toBe(true);
    });

    it('should resolve government sources', () => {
      const result = resolveSource('Global Magnitsky Act');
      expect(result.type).toBe('Government');
      expect(result.url).toContain('congress.gov');
      expect(result.verified).toBe(true);
    });

    it('should resolve news sources', () => {
      const result = resolveSource('BBC');
      expect(result.type).toBe('News Report');
      expect(result.verified).toBe(true);
    });

    it('should return null URL for unknown sources', () => {
      const result = resolveSource('Unknown Source Organization');
      expect(result.name).toBe('Unknown Source Organization');
      expect(result.url).toBeNull();
      expect(result.type).toBe('Other');
      expect(result.verified).toBe(false);
    });

    it('should mark state media as unverified', () => {
      const result = resolveSource('Xinhua');
      expect(result.verified).toBe(false);
    });

    it('should resolve all InteractiveTimeline source names', () => {
      const timelineSources = [
        'Tiananmen Papers', 'Amnesty International', 'Human Rights Watch',
        'International Campaign for Tibet', 'UN Committee on the Rights of the Child',
        'Falun Dafa Information Center', 'China Tribunal', 'Radio Free Asia',
        'Hong Kong Free Press', 'PEN International', 'European Parliament',
        'Chinese Human Rights Defenders', 'ASPI', 'Xinjiang Police Files',
        'Dr. Adrian Zenz', 'BBC', 'Reuters', 'New York Times',
        'Committee to Protect Journalists', 'Reporters Without Borders',
        'Hong Kong Watch', 'CNN', 'UK Foreign Office',
        'Safeguard Defenders', 'FBI', 'Uyghur Tribunal', 'Nobel Committee'
      ];
      for (const name of timelineSources) {
        const result = resolveSource(name);
        expect(result.url).not.toBeNull();
        expect(result.name).toBe(name);
      }
    });

    it('should resolve all VictimMemorialWall source names', () => {
      const victimSources = [
        'Radio Free Asia', 'Uyghur Human Rights Project',
        'Hong Kong Free Press', 'Stand News',
        'South China Morning Post', 'Hong Kong Watch',
        'International Campaign for Tibet', 'Free Tibet',
        'Human Rights Watch', 'Tiananmen Mothers',
        'Human Rights in China', 'Nobel Prize Committee',
        'Amnesty International', 'Chinese Human Rights Defenders',
        'Falun Dafa Information Center', 'Wall Street Journal'
      ];
      for (const name of victimSources) {
        const result = resolveSource(name);
        expect(result.url).not.toBeNull();
        expect(result.name).toBe(name);
      }
    });

    it('should resolve SanctionsTracker source names', () => {
      const sanctionSources = [
        'US Treasury OFAC', 'UK Sanctions List',
        'EU Sanctions Map', 'Canada Sanctions - China'
      ];
      for (const name of sanctionSources) {
        const result = resolveSource(name);
        expect(result.url).not.toBeNull();
        expect(result.type).toBe('Government');
        expect(result.verified).toBe(true);
      }
    });
  });

  describe('resolveSources', () => {
    it('should resolve an array of source names', () => {
      const results = resolveSources(['Amnesty International', 'BBC', 'Unknown']);
      expect(results).toHaveLength(3);
      expect(results[0].url).toBe('https://www.amnesty.org/');
      expect(results[1].url).toBe('https://www.bbc.com/');
      expect(results[2].url).toBeNull();
    });

    it('should return empty array for null input', () => {
      expect(resolveSources(null)).toEqual([]);
    });

    it('should return empty array for undefined input', () => {
      expect(resolveSources(undefined)).toEqual([]);
    });

    it('should return empty array for non-array input', () => {
      expect(resolveSources('not an array')).toEqual([]);
    });
  });
});
