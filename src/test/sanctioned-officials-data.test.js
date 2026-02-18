import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const DATA_DIR = resolve(__dirname, '../data');
const filePath = resolve(DATA_DIR, 'sanctioned_officials_research.json');
const data = JSON.parse(readFileSync(filePath, 'utf-8'));

describe('sanctioned_officials_research.json specifics', () => {
  it('contains at least 15 official records', () => {
    expect(data.results.length).toBeGreaterThanOrEqual(15);
  });

  it('each official has a name and position', () => {
    for (const result of data.results) {
      expect(result.output).toHaveProperty('name');
      expect(result.output).toHaveProperty('position');
      expect(result.output.name.length).toBeGreaterThan(0);
    }
  });

  it('each official has sanction fields for all tracked countries', () => {
    const sanctionFields = [
      'us_sanctions',
      'uk_sanctions',
      'eu_sanctions',
      'canada_sanctions',
      'australia_sanctions',
    ];

    for (const result of data.results) {
      for (const field of sanctionFields) {
        expect(result.output).toHaveProperty(field);
        // Value must be "Yes - <date>" or "No"
        const val = result.output[field];
        expect(typeof val).toBe('string');
        expect(val === 'No' || val.startsWith('Yes')).toBe(true);
      }
    }
  });

  it('each official has a responsibility_area', () => {
    const validAreas = ['Xinjiang', 'Hong Kong', 'Tibet', 'General'];
    for (const result of data.results) {
      expect(result.output).toHaveProperty('responsibility_area');
      expect(validAreas).toContain(result.output.responsibility_area);
    }
  });

  it('each official has a source_url with valid http(s)', () => {
    for (const result of data.results) {
      expect(result.output).toHaveProperty('source_url');
      expect(result.output.source_url).toMatch(/^https?:\/\//);
    }
  });

  it('at least one official is sanctioned by the US', () => {
    const usSanctioned = data.results.filter(
      (r) => r.output.us_sanctions && r.output.us_sanctions.startsWith('Yes')
    );
    expect(usSanctioned.length).toBeGreaterThan(0);
  });

  it('each official has key_abuses and current_status', () => {
    for (const result of data.results) {
      expect(result.output).toHaveProperty('key_abuses');
      expect(result.output).toHaveProperty('current_status');
      expect(result.output.key_abuses.length).toBeGreaterThan(0);
    }
  });
});
