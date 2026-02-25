import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

const DATA_DIR = resolve(__dirname, '../data');

// All research JSON files follow the same { results: [...] } structure
const RESEARCH_FILES = readdirSync(DATA_DIR)
  .filter((f) => f.endsWith('_research.json'));

describe('Research data integrity', () => {
  it('data directory contains research JSON files', () => {
    expect(RESEARCH_FILES.length).toBeGreaterThan(0);
  });

  describe.each(RESEARCH_FILES)('%s', (fileName) => {
    const filePath = resolve(DATA_DIR, fileName);
    const raw = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    it('is valid JSON with a results array', () => {
      expect(data).toHaveProperty('results');
      expect(Array.isArray(data.results)).toBe(true);
    });

    it('has at least one result', () => {
      expect(data.results.length).toBeGreaterThan(0);
    });

    it('each result has input, output, and error fields', () => {
      for (const result of data.results) {
        expect(result).toHaveProperty('input');
        expect(result).toHaveProperty('output');
        expect(result).toHaveProperty('error');
      }
    });

    it('no result has a non-empty error string', () => {
      for (const result of data.results) {
        // error should be empty string or falsy for healthy data
        expect(result.error).toBeFalsy();
      }
    });

    it('each output has a source_url with a valid http(s) URL', () => {
      for (const result of data.results) {
        if (result.output && result.output.source_url) {
          expect(result.output.source_url).toMatch(/^https?:\/\//);
        }
      }
    });

    it('at least 90% of entries have a source_url', () => {
      const withSource = data.results.filter(
        (r) => r.output && r.output.source_url
      );
      const ratio = withSource.length / data.results.length;
      expect(ratio).toBeGreaterThanOrEqual(0.9);
    });

    it('all source_url values use HTTPS (not plain HTTP)', () => {
      for (const result of data.results) {
        if (result.output && result.output.source_url) {
          expect(result.output.source_url).toMatch(/^https:\/\//);
        }
      }
    });

    it('confidence field, when present, is HIGH, MEDIUM, or LOW', () => {
      for (const result of data.results) {
        if (result.output && result.output.confidence) {
          expect(['HIGH', 'MEDIUM', 'LOW']).toContain(result.output.confidence);
        }
      }
    });
  });
});

describe('political_prisoners_research.json specifics', () => {
  const filePath = resolve(DATA_DIR, 'political_prisoners_research.json');
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));

  it('contains at least 50 prisoner records', () => {
    expect(data.results.length).toBeGreaterThanOrEqual(50);
  });

  it('each prisoner has a name and status', () => {
    for (const result of data.results) {
      expect(result.output).toHaveProperty('prisoner_name');
      expect(result.output).toHaveProperty('status');
      expect(result.output.prisoner_name.length).toBeGreaterThan(0);
    }
  });
});
