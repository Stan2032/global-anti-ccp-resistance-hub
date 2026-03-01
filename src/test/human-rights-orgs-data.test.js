import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const DATA_DIR = resolve(__dirname, '../data');
const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'human_rights_orgs_research.json'), 'utf-8'));

describe('Human rights organizations data integrity', () => {
  it('has a results array', () => {
    expect(data).toHaveProperty('results');
    expect(Array.isArray(data.results)).toBe(true);
  });

  it('contains at least 40 organization entries', () => {
    expect(data.results.length).toBeGreaterThanOrEqual(40);
  });

  it('each entry has required output fields', () => {
    for (const result of data.results) {
      expect(result.output).toBeDefined();
      expect(result.output.organization).toBeTruthy();
      expect(result.output.focus_area).toBeTruthy();
      expect(result.output.org_type).toBeTruthy();
    }
  });

  it('organization names are unique', () => {
    const names = data.results.map(r => r.output.organization);
    expect(new Set(names).size).toBe(names.length);
  });

  it('at least 95% of entries have source_url', () => {
    const withUrl = data.results.filter(r => r.output && r.output.source_url);
    expect(withUrl.length / data.results.length).toBeGreaterThanOrEqual(0.95);
  });

  it('all source_url values use HTTPS', () => {
    for (const result of data.results) {
      if (result.output && result.output.source_url) {
        expect(result.output.source_url).toMatch(/^https:\/\//);
      }
    }
  });

  it('each entry has website and donation_url fields', () => {
    for (const result of data.results) {
      expect(typeof result.output.website).toBe('string');
      expect(typeof result.output.donation_url).toBe('string');
    }
  });

  it('website URLs use HTTPS when present', () => {
    for (const result of data.results) {
      if (result.output.website && result.output.website.length > 0) {
        expect(result.output.website).toMatch(/^https:\/\//);
      }
    }
  });

  it('org_type values are recognized categories', () => {
    const validTypes = ['Advocacy', 'Advocacy, Research', 'Research', 'Legal', 'Direct Support', 'Media', 'Coalition'];
    for (const result of data.results) {
      expect(validTypes, `Unknown org_type: ${result.output.org_type}`).toContain(result.output.org_type);
    }
  });

  it('no entries have error values', () => {
    for (const result of data.results) {
      expect(result.error).toBeFalsy();
    }
  });
});
