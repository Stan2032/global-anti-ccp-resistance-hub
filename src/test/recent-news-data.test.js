import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const DATA_DIR = resolve(__dirname, '../data');
const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'recent_news_research.json'), 'utf-8'));

describe('Recent news data integrity', () => {
  it('has a results array', () => {
    expect(data).toHaveProperty('results');
    expect(Array.isArray(data.results)).toBe(true);
  });

  it('contains at least 15 news entries', () => {
    expect(data.results.length).toBeGreaterThanOrEqual(15);
  });

  it('each entry has required output fields', () => {
    for (const result of data.results) {
      expect(result.output).toBeDefined();
      expect(result.output.topic).toBeTruthy();
      expect(result.output.headline).toBeTruthy();
      expect(result.output.summary).toBeTruthy();
      expect(result.output.date).toBeTruthy();
      expect(result.output.source).toBeTruthy();
    }
  });

  it('all entries have source_url using HTTPS', () => {
    for (const result of data.results) {
      expect(result.output.source_url).toBeTruthy();
      expect(result.output.source_url).toMatch(/^https:\/\//);
    }
  });

  it('dates follow YYYY-MM-DD format', () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    for (const result of data.results) {
      expect(result.output.date).toMatch(dateRegex);
    }
  });

  it('each entry has significance and action_needed fields', () => {
    for (const result of data.results) {
      expect(typeof result.output.significance).toBe('string');
      expect(result.output.significance.length).toBeGreaterThan(0);
      expect(typeof result.output.action_needed).toBe('string');
    }
  });

  it('sources are from recognized news outlets (not CCP state media)', () => {
    const ccpMedia = ['xinhua', 'cgtn', 'people\'s daily', 'global times', 'china daily'];
    for (const result of data.results) {
      const sourceLower = result.output.source.toLowerCase();
      for (const ccp of ccpMedia) {
        expect(sourceLower).not.toContain(ccp);
      }
    }
  });

  it('no entries have error values', () => {
    for (const result of data.results) {
      expect(result.error).toBeFalsy();
    }
  });
});
