import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const DATA_DIR = resolve(__dirname, '../data');
const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'academic_experts_research.json'), 'utf-8'));

describe('Academic experts data integrity', () => {
  it('has a results array', () => {
    expect(data).toHaveProperty('results');
    expect(Array.isArray(data.results)).toBe(true);
  });

  it('contains at least 20 expert entries', () => {
    expect(data.results.length).toBeGreaterThanOrEqual(20);
  });

  it('each entry has required output fields', () => {
    for (const result of data.results) {
      expect(result.output).toBeDefined();
      expect(result.output.name).toBeTruthy();
      expect(result.output.affiliation).toBeTruthy();
      expect(result.output.expertise).toBeTruthy();
    }
  });

  it('expert names are unique', () => {
    const names = data.results.map(r => r.output.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('all entries have source_url using HTTPS', () => {
    for (const result of data.results) {
      expect(result.output.source_url).toBeTruthy();
      expect(result.output.source_url).toMatch(/^https:\/\//);
    }
  });

  it('each entry has key_works and media_presence fields', () => {
    for (const result of data.results) {
      expect(typeof result.output.key_works).toBe('string');
      expect(result.output.key_works.length).toBeGreaterThan(0);
      expect(typeof result.output.media_presence).toBe('string');
    }
  });

  it('no entries have error values', () => {
    for (const result of data.results) {
      expect(result.error).toBeFalsy();
    }
  });

  it('includes well-known China scholars', () => {
    const names = data.results.map(r => r.output.name.toLowerCase());
    const hasZenz = names.some(n => n.includes('zenz'));
    const hasByler = names.some(n => n.includes('byler'));
    expect(hasZenz || hasByler).toBe(true);
  });
});
