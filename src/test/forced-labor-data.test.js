import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const DATA_DIR = resolve(__dirname, '../data');
const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'forced_labor_companies_research.json'), 'utf-8'));

describe('Forced labor companies data integrity', () => {
  it('has a results array', () => {
    expect(data).toHaveProperty('results');
    expect(Array.isArray(data.results)).toBe(true);
  });

  it('contains at least 25 company entries', () => {
    expect(data.results.length).toBeGreaterThanOrEqual(25);
  });

  it('each entry has required output fields', () => {
    for (const result of data.results) {
      expect(result.output).toBeDefined();
      expect(result.output.company).toBeTruthy();
      expect(result.output.industry).toBeTruthy();
      expect(result.output.connection_type).toBeTruthy();
      expect(result.output.status).toBeTruthy();
    }
  });

  it('company names are unique', () => {
    const names = data.results.map(r => r.output.company);
    expect(new Set(names).size).toBe(names.length);
  });

  it('all entries have source_url using HTTPS', () => {
    for (const result of data.results) {
      expect(result.output.source_url).toBeTruthy();
      expect(result.output.source_url).toMatch(/^https:\/\//);
    }
  });

  it('industries are valid categories', () => {
    const validIndustries = ['Apparel', 'Electronics', 'Technology', 'Food & Beverage', 'Retail', 'Automotive'];
    for (const result of data.results) {
      expect(validIndustries, `Unknown industry: ${result.output.industry}`).toContain(result.output.industry);
    }
  });

  it('each entry has evidence and company_response fields', () => {
    for (const result of data.results) {
      expect(typeof result.output.evidence).toBe('string');
      expect(result.output.evidence.length).toBeGreaterThan(0);
      expect(typeof result.output.company_response).toBe('string');
    }
  });

  it('no entries have error values', () => {
    for (const result of data.results) {
      expect(result.error).toBeFalsy();
    }
  });
});
