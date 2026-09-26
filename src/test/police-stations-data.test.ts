import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { STATION_STATUS } from '../services/dataApi';

const DATA_DIR = resolve(__dirname, '../data');
const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'police_stations_research.json'), 'utf-8'));

describe('Police stations data integrity', () => {
  it('has a results array', () => {
    expect(data).toHaveProperty('results');
    expect(Array.isArray(data.results)).toBe(true);
  });

  it('contains at least 25 police station entries', () => {
    expect(data.results.length).toBeGreaterThanOrEqual(25);
  });

  it('each entry has required output fields', () => {
    for (const result of data.results) {
      expect(result.output).toBeDefined();
      expect(result.output.country).toBeTruthy();
      expect(result.output.city).toBeTruthy();
      expect(result.output.status).toBeTruthy();
    }
  });

  it('covers at least 20 different countries', () => {
    const countries = new Set(data.results.map((r: { output: { country: string } }) => r.output.country));
    expect(countries.size).toBeGreaterThanOrEqual(20);
  });

  it('statuses are valid categories', () => {
    // The same list the components compare against (STATION_STATUS).
    const validStatuses: string[] = Object.values(STATION_STATUS);
    for (const result of data.results) {
      expect(validStatuses, `Unknown status: ${result.output.status}`).toContain(result.output.status);
    }
  });

  it('all entries have source_url using HTTPS', () => {
    for (const result of data.results) {
      expect(result.output.source_url).toBeTruthy();
      expect(result.output.source_url).toMatch(/^https:\/\//);
    }
  });

  it('each entry has government_response field', () => {
    for (const result of data.results) {
      expect(typeof result.output.government_response).toBe('string');
    }
  });

  it('no entries have error values', () => {
    for (const result of data.results) {
      expect(result.error).toBeFalsy();
    }
  });

  it('includes expected key countries', () => {
    const countries = new Set(data.results.map((r: { output: { country: string } }) => r.output.country));
    expect(countries.has('United Kingdom')).toBe(true);
    expect(countries.has('Netherlands')).toBe(true);
    expect(countries.has('Canada')).toBe(true);
    expect(countries.has('United States')).toBe(true);
  });
});
