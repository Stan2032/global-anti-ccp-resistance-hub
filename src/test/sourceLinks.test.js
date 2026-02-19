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
