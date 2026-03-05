import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import { resolve, join } from 'path';

/**
 * Content Completeness Audit Tests
 *
 * Validates that JSON data files have complete, non-placeholder content:
 * - No empty string values in required fields
 * - No placeholder text (TODO, TBD, PLACEHOLDER, Lorem ipsum)
 * - Key fields are populated (name, title, description, etc.)
 * - Dates are well-formed
 * - No orphaned/broken data references
 */

const DATA_DIR = resolve(__dirname, '..', 'data');

function loadJson(filename) {
  return JSON.parse(readFileSync(join(DATA_DIR, filename), 'utf-8'));
}

function getAllJsonFiles() {
  return readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
}

function flattenValues(obj) {
  const values = [];
  if (typeof obj === 'string') return [obj];
  if (Array.isArray(obj)) {
    for (const item of obj) values.push(...flattenValues(item));
    return values;
  }
  if (obj && typeof obj === 'object') {
    for (const val of Object.values(obj)) values.push(...flattenValues(val));
  }
  return values;
}

describe('Content Completeness Audit', () => {
  it('no placeholder text in any JSON data file', () => {
    const placeholderPatterns = [
      /\bTODO\b/i,
      /\bTBD\b/,
      /\bPLACEHOLDER\b/i,
      /\bLorem ipsum\b/i,
      /\bfoo\b.*\bbar\b/i,
      /\btest\s*data\b/i,
      /\bexample\.com\b/,
      /\bXXX\b/,
    ];

    const violations = [];
    for (const file of getAllJsonFiles()) {
      const data = loadJson(file);
      const allStrings = flattenValues(data).filter(v => typeof v === 'string');
      for (const str of allStrings) {
        for (const pattern of placeholderPatterns) {
          if (pattern.test(str)) {
            violations.push(`${file}: "${str.substring(0, 80)}" matches ${pattern}`);
          }
        }
      }
    }
    expect(violations, `Placeholder text found:\n${violations.join('\n')}`).toEqual([]);
  });

  it('no empty string values in critical fields (name, title, description, id)', () => {
    const criticalFields = ['name', 'title', 'id', 'description', 'prisoner_name', 'target'];
    const violations = [];
    for (const file of getAllJsonFiles()) {
      const data = loadJson(file);
      const items = Array.isArray(data) ? data : (data.results || data.sanctions || [data]);
      if (!Array.isArray(items)) continue;
      for (const item of items) {
        if (typeof item !== 'object' || item === null) continue;
        // Check top-level and nested output object
        const objects = [item, item.output].filter(o => o && typeof o === 'object');
        for (const obj of objects) {
          for (const field of criticalFields) {
            if (field in obj && obj[field] === '') {
              violations.push(`${file}: field "${field}" is empty string`);
            }
          }
        }
      }
    }
    expect(violations, `Empty critical fields found:\n${violations.join('\n')}`).toEqual([]);
  });

  it('political prisoners all have prisoner_name and status in output', () => {
    const data = loadJson('political_prisoners_research.json');
    const prisoners = data.results || [];
    expect(prisoners.length).toBeGreaterThan(0);

    const issues = [];
    for (const p of prisoners) {
      const output = p.output;
      if (!output || typeof output !== 'object') {
        issues.push(`Record missing output: ${(p.input || '').substring(0, 50)}`);
        continue;
      }
      if (!output.prisoner_name) issues.push(`Missing prisoner_name: ${(p.input || '').substring(0, 50)}`);
      if (!output.status) issues.push(`${output.prisoner_name || '?'}: missing status`);
    }
    expect(issues, `Incomplete prisoner records:\n${issues.join('\n')}`).toEqual([]);
  });

  it('emergency alerts all have title, summary, type, and active field', () => {
    const data = loadJson('emergency_alerts.json');
    expect(data.length).toBeGreaterThan(0);

    const issues = [];
    for (const alert of data) {
      if (!alert.title) issues.push(`Alert ${alert.id}: missing title`);
      if (!alert.summary) issues.push(`Alert ${alert.id}: missing summary`);
      if (!alert.type) issues.push(`Alert ${alert.id}: missing type`);
      if (typeof alert.active !== 'boolean') issues.push(`Alert ${alert.id}: active not boolean`);
    }
    expect(issues, `Incomplete alert records:\n${issues.join('\n')}`).toEqual([]);
  });

  it('recent_updates all have id, date, category, title, and description', () => {
    const data = loadJson('recent_updates.json');
    expect(data.length).toBeGreaterThan(0);

    const issues = [];
    for (const entry of data) {
      const required = ['id', 'date', 'category', 'title', 'description'];
      for (const field of required) {
        if (!entry[field]) {
          issues.push(`Update "${entry.id || '?'}": missing ${field}`);
        }
      }
    }
    expect(issues, `Incomplete update records:\n${issues.join('\n')}`).toEqual([]);
  });

  it('sanctions tracker entries have target, country, and reason', () => {
    const data = loadJson('sanctions_tracker.json');
    const entries = data.sanctions || [];
    expect(entries.length).toBeGreaterThan(0);

    const issues = [];
    for (const s of entries) {
      if (!s.target) issues.push(`Missing target: ${JSON.stringify(s).substring(0, 60)}`);
      if (!s.country) issues.push(`${s.target || '?'}: missing country`);
      if (!s.reason) issues.push(`${s.target || '?'}: missing reason`);
    }
    expect(issues, `Incomplete sanctions records:\n${issues.join('\n')}`).toEqual([]);
  });

  it('all date strings in JSON follow ISO format (YYYY-MM-DD)', () => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const dateFieldNames = ['date', 'eventDate', 'lastVerified', 'dateAdded', 'expires',
      'detainedSince', 'sentenceDate', 'dateDesignated'];
    const violations = [];

    for (const file of getAllJsonFiles()) {
      const data = loadJson(file);
      const items = Array.isArray(data) ? data : (data.results || data.sanctions || [data]);
      if (!Array.isArray(items)) continue;

      for (const item of items) {
        if (typeof item !== 'object' || item === null) continue;
        for (const field of dateFieldNames) {
          if (item[field] && typeof item[field] === 'string' && item[field].length > 0) {
            if (!datePattern.test(item[field])) {
              violations.push(`${file}: ${field}="${item[field]}" not ISO format`);
            }
          }
        }
      }
    }
    expect(violations, `Non-ISO date formats:\n${violations.join('\n')}`).toEqual([]);
  });

  it('no duplicate IDs within any single JSON file', () => {
    const violations = [];
    for (const file of getAllJsonFiles()) {
      const data = loadJson(file);
      const items = Array.isArray(data) ? data : (data.results || data.sanctions || []);
      if (!Array.isArray(items)) continue;

      const ids = items.map(i => i.id).filter(Boolean);
      const seen = new Set();
      for (const id of ids) {
        if (seen.has(id)) {
          violations.push(`${file}: duplicate id "${id}"`);
        }
        seen.add(id);
      }
    }
    expect(violations, `Duplicate IDs found:\n${violations.join('\n')}`).toEqual([]);
  });
});
