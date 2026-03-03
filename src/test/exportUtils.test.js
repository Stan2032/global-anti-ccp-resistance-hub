import { describe, it, expect } from 'vitest';
import { extractRecords, recordsToCsv, recordsToMarkdown } from '../utils/exportUtils';

describe('exportUtils', () => {
  // --- extractRecords ---

  describe('extractRecords', () => {
    it('returns flat arrays unchanged', () => {
      const data = [{ id: 1 }, { id: 2 }];
      expect(extractRecords(data)).toEqual(data);
    });

    it('extracts output from results[] pattern', () => {
      const data = {
        results: [
          { input: 'q1', output: { name: 'Alice' }, error: '' },
          { input: 'q2', output: { name: 'Bob' }, error: '' },
        ]
      };
      const records = extractRecords(data);
      expect(records).toEqual([{ name: 'Alice' }, { name: 'Bob' }]);
    });

    it('extracts sanctions[] from sanctions tracker format', () => {
      const data = {
        metadata: { title: 'Test' },
        sanctions: [{ id: 1, target: 'Person A' }, { id: 2, target: 'Person B' }]
      };
      expect(extractRecords(data)).toEqual(data.sanctions);
    });

    it('returns empty array for null/undefined', () => {
      expect(extractRecords(null)).toEqual([]);
      expect(extractRecords(undefined)).toEqual([]);
    });

    it('returns empty array for objects without results or sanctions', () => {
      expect(extractRecords({ metadata: {} })).toEqual([]);
    });

    it('handles results without output field', () => {
      const data = { results: [{ input: 'q1' }, { input: 'q2' }] };
      const records = extractRecords(data);
      expect(records.length).toBe(2);
    });
  });

  // --- recordsToCsv ---

  describe('recordsToCsv', () => {
    it('generates CSV with headers and rows', () => {
      const records = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ];
      const csv = recordsToCsv(records);
      const lines = csv.split('\n');
      expect(lines[0]).toBe('name,age');
      expect(lines[1]).toBe('Alice,30');
      expect(lines[2]).toBe('Bob,25');
    });

    it('uses explicit fields when provided', () => {
      const records = [{ name: 'Alice', age: 30, extra: 'x' }];
      const csv = recordsToCsv(records, ['name', 'age']);
      expect(csv).toBe('name,age\nAlice,30');
    });

    it('escapes commas in values', () => {
      const records = [{ desc: 'Hello, World' }];
      const csv = recordsToCsv(records);
      expect(csv).toContain('"Hello, World"');
    });

    it('escapes double quotes in values', () => {
      const records = [{ desc: 'He said "hello"' }];
      const csv = recordsToCsv(records);
      expect(csv).toContain('"He said ""hello"""');
    });

    it('escapes newlines in values', () => {
      const records = [{ desc: 'line1\nline2' }];
      const csv = recordsToCsv(records);
      expect(csv).toContain('"line1\nline2"');
    });

    it('handles null/undefined values', () => {
      const records = [{ name: null, city: undefined }];
      const csv = recordsToCsv(records);
      expect(csv).toBe('name,city\n,');
    });

    it('returns empty string for empty array', () => {
      expect(recordsToCsv([])).toBe('');
    });
  });

  // --- recordsToMarkdown ---

  describe('recordsToMarkdown', () => {
    it('generates markdown table with headers, separator, and rows', () => {
      const records = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ];
      const md = recordsToMarkdown(records);
      const lines = md.split('\n');
      expect(lines[0]).toBe('| name | age |');
      expect(lines[1]).toBe('| --- | --- |');
      expect(lines[2]).toBe('| Alice | 30 |');
      expect(lines[3]).toBe('| Bob | 25 |');
    });

    it('uses explicit fields when provided', () => {
      const records = [{ name: 'Alice', age: 30, extra: 'x' }];
      const md = recordsToMarkdown(records, ['name']);
      const lines = md.split('\n');
      expect(lines[0]).toBe('| name |');
      expect(lines[2]).toBe('| Alice |');
    });

    it('escapes pipe characters in values', () => {
      const records = [{ desc: 'a|b' }];
      const md = recordsToMarkdown(records);
      expect(md).toContain('a\\|b');
    });

    it('escapes backslash characters in values', () => {
      const records = [{ desc: 'path\\to\\file' }];
      const md = recordsToMarkdown(records);
      expect(md).toContain('path\\\\to\\\\file');
    });

    it('replaces newlines with spaces', () => {
      const records = [{ desc: 'line1\nline2' }];
      const md = recordsToMarkdown(records);
      expect(md).toContain('line1 line2');
    });

    it('truncates long values at 100 characters', () => {
      const long = 'x'.repeat(200);
      const records = [{ text: long }];
      const md = recordsToMarkdown(records);
      // Should have 97 chars + '...' = 100
      expect(md).toContain('x'.repeat(97) + '...');
    });

    it('handles null/undefined values', () => {
      const records = [{ a: null, b: undefined }];
      const md = recordsToMarkdown(records);
      expect(md).toContain('|  |  |');
    });

    it('returns empty string for empty array', () => {
      expect(recordsToMarkdown([])).toBe('');
    });
  });

  // --- Integration: real data imports ---

  describe('real data extraction', () => {
    it('extracts prisoners from political_prisoners_research.json', async () => {
      const data = await import('../data/political_prisoners_research.json');
      const records = extractRecords(data.default || data);
      expect(records.length).toBeGreaterThanOrEqual(60);
      expect(records[0]).toHaveProperty('prisoner_name');
    });

    it('extracts sanctions from sanctions_tracker.json', async () => {
      const data = await import('../data/sanctions_tracker.json');
      const records = extractRecords(data.default || data);
      expect(records.length).toBeGreaterThanOrEqual(40);
      expect(records[0]).toHaveProperty('target');
    });

    it('extracts timeline events from timeline_events.json', async () => {
      const data = await import('../data/timeline_events.json');
      const records = extractRecords(data.default || data);
      expect(records.length).toBeGreaterThanOrEqual(30);
      expect(records[0]).toHaveProperty('title');
    });

    it('can convert prisoners to CSV', async () => {
      const data = await import('../data/political_prisoners_research.json');
      const records = extractRecords(data.default || data);
      const csv = recordsToCsv(records, ['prisoner_name', 'status', 'location']);
      const lines = csv.split('\n');
      expect(lines[0]).toBe('prisoner_name,status,location');
      expect(lines.length).toBeGreaterThan(60);
    });

    it('can convert timeline to markdown', async () => {
      const data = await import('../data/timeline_events.json');
      const records = extractRecords(data.default || data);
      const md = recordsToMarkdown(records, ['date', 'title', 'category']);
      expect(md).toContain('| date | title | category |');
      expect(md).toContain('| --- | --- | --- |');
      expect(md.split('\n').length).toBeGreaterThan(30);
    });
  });
});
