import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const DATA_DIR = resolve(__dirname, '../data');
const filePath = resolve(DATA_DIR, 'sanctioned_officials_research.json');
const data = JSON.parse(readFileSync(filePath, 'utf-8'));

describe('sanctioned_officials_research.json specifics', () => {
  it('contains at least 20 official records', () => {
    expect(data.results.length).toBeGreaterThanOrEqual(20);
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

  it('includes Xi Jinping as paramount leader', () => {
    const xi = data.results.find(r => r.output.name === 'Xi Jinping');
    expect(xi).toBeDefined();
    expect(xi.output.responsibility_area).toBe('General');
    expect(xi.output.current_status).toBe('In power');
  });

  it('key officials have biographical data (chinese_name, birth_year, key_actions)', () => {
    const keyNames = ['Xi Jinping', 'Chen Quanguo', 'Carrie Lam', 'John Lee', 'Wang Junzheng', 'Zhu Hailun', 'Zhao Kezhi', 'Wang Yi'];
    for (const name of keyNames) {
      const result = data.results.find(r => r.output.name === name);
      expect(result, `${name} should be in the data`).toBeDefined();
      expect(result.output.chinese_name, `${name} should have chinese_name`).toBeTruthy();
      expect(result.output.birth_year, `${name} should have birth_year`).toBeGreaterThan(1900);
      expect(result.output.key_actions, `${name} should have key_actions`).toBeInstanceOf(Array);
      expect(result.output.key_actions.length, `${name} should have at least 3 key_actions`).toBeGreaterThanOrEqual(3);
      expect(result.output.detailed_responsibilities, `${name} should have detailed_responsibilities`).toBeInstanceOf(Array);
    }
  });

  it('key_actions entries have year and action fields', () => {
    const withActions = data.results.filter(r => r.output.key_actions && r.output.key_actions.length > 0);
    expect(withActions.length).toBeGreaterThanOrEqual(8);
    for (const result of withActions) {
      for (const action of result.output.key_actions) {
        expect(action).toHaveProperty('year');
        expect(action).toHaveProperty('action');
        expect(action.year).toBeGreaterThanOrEqual(2000);
        expect(action.action.length).toBeGreaterThan(0);
      }
    }
  });
});
