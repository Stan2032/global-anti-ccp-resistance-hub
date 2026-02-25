import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const DATA_PATH = resolve(__dirname, '../data/data_sources.json');

describe('Data Sources integrity', () => {
  let data;

  it('data_sources.json exists and is valid JSON', () => {
    expect(existsSync(DATA_PATH)).toBe(true);
    const raw = readFileSync(DATA_PATH, 'utf-8');
    data = JSON.parse(raw);
    expect(data).toBeDefined();
  });

  describe('RSS sources', () => {
    let rssSources;

    it('has rss_sources array with at least 10 sources', () => {
      const raw = readFileSync(DATA_PATH, 'utf-8');
      data = JSON.parse(raw);
      rssSources = data.rss_sources;
      expect(Array.isArray(rssSources)).toBe(true);
      expect(rssSources.length).toBeGreaterThanOrEqual(10);
    });

    it('each RSS source has required fields', () => {
      const raw = readFileSync(DATA_PATH, 'utf-8');
      rssSources = JSON.parse(raw).rss_sources;
      for (const source of rssSources) {
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
      const raw = readFileSync(DATA_PATH, 'utf-8');
      rssSources = JSON.parse(raw).rss_sources;
      for (const source of rssSources) {
        expect(source.url, `Invalid URL for ${source.name}`).toMatch(/^https:\/\//);
      }
    });

    it('all credibility values are High or Medium', () => {
      const raw = readFileSync(DATA_PATH, 'utf-8');
      rssSources = JSON.parse(raw).rss_sources;
      for (const source of rssSources) {
        expect(['High', 'Medium']).toContain(source.credibility);
      }
    });

    it('does not include CCP state media sources', () => {
      const raw = readFileSync(DATA_PATH, 'utf-8');
      rssSources = JSON.parse(raw).rss_sources;
      const ccpMedia = ['Xinhua', 'CGTN', 'People\'s Daily', 'Global Times', 'China Daily'];
      for (const source of rssSources) {
        for (const banned of ccpMedia) {
          expect(source.name, `CCP state media detected: ${source.name}`).not.toContain(banned);
        }
      }
    });
  });

  describe('Major sources', () => {
    let majorSources;

    it('has major_sources array with 4 categories', () => {
      const raw = readFileSync(DATA_PATH, 'utf-8');
      majorSources = JSON.parse(raw).major_sources;
      expect(Array.isArray(majorSources)).toBe(true);
      expect(majorSources.length).toBe(4);
    });

    it('each category has required fields', () => {
      const raw = readFileSync(DATA_PATH, 'utf-8');
      majorSources = JSON.parse(raw).major_sources;
      for (const cat of majorSources) {
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
      const raw = readFileSync(DATA_PATH, 'utf-8');
      majorSources = JSON.parse(raw).major_sources;
      for (const cat of majorSources) {
        for (const source of cat.sources) {
          expect(source).toHaveProperty('name');
          expect(source).toHaveProperty('url');
          expect(source.url, `Invalid URL in ${cat.category}: ${source.name}`).toMatch(/^https:\/\//);
        }
      }
    });

    it('referenced data files exist on disk', () => {
      const raw = readFileSync(DATA_PATH, 'utf-8');
      majorSources = JSON.parse(raw).major_sources;
      const dataDir = resolve(__dirname, '../data');
      for (const cat of majorSources) {
        const filePath = resolve(dataDir, cat.data_file);
        expect(existsSync(filePath), `Missing data file: ${cat.data_file} for ${cat.category}`).toBe(true);
      }
    });

    it('covers expected categories', () => {
      const raw = readFileSync(DATA_PATH, 'utf-8');
      majorSources = JSON.parse(raw).major_sources;
      const categories = majorSources.map(c => c.category);
      expect(categories).toContain('Political Prisoners');
      expect(categories).toContain('Detention Facilities');
      expect(categories).toContain('Sanctioned Officials');
      expect(categories).toContain('Forced Labor Companies');
    });
  });
});
