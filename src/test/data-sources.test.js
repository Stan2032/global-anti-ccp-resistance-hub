import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const DATA_PATH = resolve(__dirname, '../data/data_sources.json');

describe('Data Sources integrity', () => {
  let data;

  beforeAll(() => {
    expect(existsSync(DATA_PATH)).toBe(true);
    data = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
  });

  it('data_sources.json exists and is valid JSON', () => {
    expect(data).toBeDefined();
  });

  describe('RSS sources', () => {
    it('has rss_sources array with at least 10 sources', () => {
      expect(Array.isArray(data.rss_sources)).toBe(true);
      expect(data.rss_sources.length).toBeGreaterThanOrEqual(10);
    });

    it('each RSS source has required fields', () => {
      for (const source of data.rss_sources) {
        expect(source).toHaveProperty('name');
        expect(source).toHaveProperty('url');
        expect(source).toHaveProperty('type');
        expect(source).toHaveProperty('region');
        expect(source).toHaveProperty('frequency');
        expect(source).toHaveProperty('credibility');
        expect(source).toHaveProperty('description');
      }
    });

    it('all RSS source URLs are valid HTTPS', () => {
      for (const source of data.rss_sources) {
        expect(source.url, `Invalid URL for ${source.name}`).toMatch(/^https:\/\//);
      }
    });

    it('all credibility values are High or Medium', () => {
      for (const source of data.rss_sources) {
        expect(['High', 'Medium']).toContain(source.credibility);
      }
    });

    it('does not include CCP state media sources', () => {
      const ccpMedia = ['Xinhua', 'CGTN', 'People\'s Daily', 'Global Times', 'China Daily'];
      for (const source of data.rss_sources) {
        for (const banned of ccpMedia) {
          expect(source.name, `CCP state media detected: ${source.name}`).not.toContain(banned);
        }
      }
    });
  });

  describe('Major sources', () => {
    it('has major_sources array with 4 categories', () => {
      expect(Array.isArray(data.major_sources)).toBe(true);
      expect(data.major_sources.length).toBe(4);
    });

    it('each category has required fields', () => {
      for (const cat of data.major_sources) {
        expect(cat).toHaveProperty('category');
        expect(cat).toHaveProperty('icon_name');
        expect(cat).toHaveProperty('sources');
        expect(cat).toHaveProperty('data_file');
        expect(cat).toHaveProperty('count');
        expect(Array.isArray(cat.sources)).toBe(true);
        expect(cat.sources.length).toBeGreaterThan(0);
      }
    });

    it('each source in categories has name and valid URL', () => {
      for (const cat of data.major_sources) {
        for (const source of cat.sources) {
          expect(source).toHaveProperty('name');
          expect(source).toHaveProperty('url');
          expect(source.url, `Invalid URL in ${cat.category}: ${source.name}`).toMatch(/^https:\/\//);
        }
      }
    });

    it('referenced data files exist on disk', () => {
      const dataDir = resolve(__dirname, '../data');
      for (const cat of data.major_sources) {
        const filePath = resolve(dataDir, cat.data_file);
        expect(existsSync(filePath), `Missing data file: ${cat.data_file} for ${cat.category}`).toBe(true);
      }
    });

    it('covers expected categories', () => {
      const categories = data.major_sources.map(c => c.category);
      expect(categories).toContain('Political Prisoners');
      expect(categories).toContain('Detention Facilities');
      expect(categories).toContain('Sanctioned Officials');
      expect(categories).toContain('Forced Labor Companies');
    });
  });
});
