import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const DATA_DIR = resolve(__dirname, '../data');
const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'international_responses_research.json'), 'utf-8'));

describe('International responses data integrity', () => {
  it('has a results array', () => {
    expect(data).toHaveProperty('results');
    expect(Array.isArray(data.results)).toBe(true);
  });

  it('contains at least 25 country entries', () => {
    expect(data.results.length).toBeGreaterThanOrEqual(25);
  });

  it('each entry has required output fields', () => {
    for (const result of data.results) {
      expect(result.output).toBeDefined();
      expect(result.output.country).toBeTruthy();
      expect(result.output.overall_stance).toBeTruthy();
    }
  });

  it('country names are unique', () => {
    const countries = data.results.map(r => r.output.country);
    expect(new Set(countries).size).toBe(countries.length);
  });

  it('all entries have source_url using HTTPS', () => {
    for (const result of data.results) {
      expect(result.output.source_url).toBeTruthy();
      expect(result.output.source_url).toMatch(/^https:\/\//);
    }
  });

  it('each entry has genocide_recognition and sanctions_imposed fields', () => {
    for (const result of data.results) {
      expect(typeof result.output.genocide_recognition).toBe('string');
      expect(typeof result.output.sanctions_imposed).toBe('string');
    }
  });

  it('each entry has legislative_actions and diplomatic_actions fields', () => {
    for (const result of data.results) {
      expect(typeof result.output.legislative_actions).toBe('string');
      expect(typeof result.output.diplomatic_actions).toBe('string');
    }
  });

  it('includes major world powers', () => {
    const countries = new Set(data.results.map(r => r.output.country));
    expect(countries.has('United States')).toBe(true);
    expect(countries.has('United Kingdom')).toBe(true);
    expect(countries.has('Canada')).toBe(true);
  });

  it('no entries have error values', () => {
    for (const result of data.results) {
      expect(result.error).toBeFalsy();
    }
  });
});
