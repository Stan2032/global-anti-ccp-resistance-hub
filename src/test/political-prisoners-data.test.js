import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { isCCPDomain } from '../utils/sourceLinks.js';

const DATA_PATH = resolve(__dirname, '../data/political_prisoners_research.json');

describe('Political Prisoners Research Data Integrity', () => {
  let data;
  let results;

  beforeAll(() => {
    data = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
    results = data.results;
  });

  describe('Structure', () => {
    it('has results array', () => {
      expect(Array.isArray(results)).toBe(true);
    });

    it('has at least 50 entries', () => {
      expect(results.length).toBeGreaterThanOrEqual(50);
    });

    it('every entry has input, output, and error fields', () => {
      for (const entry of results) {
        expect(entry, 'Entry missing "input"').toHaveProperty('input');
        expect(entry, 'Entry missing "output"').toHaveProperty('output');
        expect(entry, 'Entry missing "error"').toHaveProperty('error');
      }
    });

    it('no entries have errors', () => {
      const errorEntries = results.filter(r => r.error && r.error.length > 0);
      expect(errorEntries.length, `${errorEntries.length} entries have errors`).toBe(0);
    });
  });

  describe('Required output fields', () => {
    const requiredFields = [
      'prisoner_name', 'status', 'location', 'sentence',
      'latest_news', 'health_status', 'source_url', 'confidence'
    ];

    it('every entry has all required output fields', () => {
      for (const entry of results) {
        const output = entry.output;
        for (const field of requiredFields) {
          expect(
            output[field],
            `"${output.prisoner_name || entry.input}" missing "${field}"`
          ).toBeDefined();
        }
      }
    });

    it('every entry has a non-empty prisoner_name', () => {
      for (const entry of results) {
        expect(
          entry.output.prisoner_name.length,
          `Empty prisoner_name in: ${entry.input}`
        ).toBeGreaterThan(0);
      }
    });

    it('all prisoner names are unique', () => {
      const names = results.map(r => r.output.prisoner_name);
      const dupes = names.filter((n, i) => names.indexOf(n) !== i);
      expect(dupes, `Duplicate prisoner names: ${dupes.join(', ')}`).toEqual([]);
    });
  });

  describe('Status validation', () => {
    const validStatuses = ['DETAINED', 'RELEASED', 'DECEASED', 'DISAPPEARED', 'EXILE', 'AT RISK'];

    it('all entries use valid status values', () => {
      for (const entry of results) {
        expect(
          validStatuses,
          `"${entry.output.prisoner_name}" has invalid status: "${entry.output.status}"`
        ).toContain(entry.output.status);
      }
    });

    it('has multiple entries with DETAINED status', () => {
      const detained = results.filter(r => r.output.status === 'DETAINED');
      expect(detained.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Confidence validation', () => {
    const validConfidence = ['HIGH', 'MEDIUM', 'LOW'];

    it('all entries use valid confidence levels', () => {
      for (const entry of results) {
        expect(
          validConfidence,
          `"${entry.output.prisoner_name}" has invalid confidence: "${entry.output.confidence}"`
        ).toContain(entry.output.confidence);
      }
    });
  });

  describe('Source URLs', () => {
    it('all source_url fields contain valid HTTPS URLs', () => {
      for (const entry of results) {
        const url = entry.output.source_url;
        expect(
          url.startsWith('https://'),
          `"${entry.output.prisoner_name}" source_url not HTTPS: ${url}`
        ).toBe(true);
      }
    });

    it('no source URLs reference CCP state media', () => {
      for (const entry of results) {
        const url = entry.output.source_url;
        expect(
          isCCPDomain(url),
          `"${entry.output.prisoner_name}" cites CCP source: ${url}`
        ).toBe(false);
      }
    });
  });

  describe('Key prisoners are present', () => {
    const keyPrisoners = [
      { name: 'Jimmy Lai', status: 'DETAINED' },
      { name: 'Ilham Tohti', status: 'DETAINED' },
      { name: 'Joshua Wong', status: 'DETAINED' },
      { name: 'Zhang Zhan', status: 'DETAINED' },
      { name: 'Gui Minhai', status: 'DETAINED' },
    ];

    for (const prisoner of keyPrisoners) {
      it(`includes ${prisoner.name}`, () => {
        const found = results.find(r => r.output.prisoner_name === prisoner.name);
        expect(found, `${prisoner.name} not found in database`).toBeDefined();
        expect(found.output.status).toBe(prisoner.status);
      });
    }
  });

  describe('Data freshness', () => {
    it('at least some entries have last_verified dates', () => {
      const withDates = results.filter(r => r.output.last_verified);
      expect(withDates.length).toBeGreaterThan(0);
    });

    it('last_verified dates are valid calendar dates in YYYY-MM-DD format', () => {
      for (const entry of results) {
        if (entry.output.last_verified) {
          expect(
            entry.output.last_verified,
            `"${entry.output.prisoner_name}" has invalid date format`
          ).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          const d = new Date(entry.output.last_verified);
          expect(
            isNaN(d.getTime()),
            `"${entry.output.prisoner_name}" date "${entry.output.last_verified}" is not a valid calendar date`
          ).toBe(false);
        }
      }
    });
  });
});
