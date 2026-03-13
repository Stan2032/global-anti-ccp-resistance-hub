/**
 * Data validation tests for recent_updates.json
 *
 * Ensures update records have unique IDs, valid dates,
 * required fields, and consistent category values.
 */
import { describe, it, expect } from 'vitest';
import updatesData from '../data/recent_updates.json';

interface RecentUpdate {
  id: string;
  date: string;
  category: string;
  title: string;
  description: string;
  relatedPage: string;
}

const VALID_CATEGORIES = ['data', 'feature', 'security', 'infrastructure', 'design', 'bugfix', 'alert', 'new_entry', 'verification', 'case_update', 'new_case', 'report'];
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const updates: RecentUpdate[] = updatesData;

describe('Recent Updates Data', () => {
  it('has at least 5 update records', () => {
    expect(updates.length).toBeGreaterThanOrEqual(5);
  });

  it('every update has required fields', () => {
    const violations: string[] = [];
    for (const u of updates) {
      if (!u.id?.trim()) violations.push('Missing id');
      if (!u.date?.trim()) violations.push(`${u.id}: missing date`);
      if (!u.category?.trim()) violations.push(`${u.id}: missing category`);
      if (!u.title?.trim()) violations.push(`${u.id}: missing title`);
      if (!u.description?.trim()) violations.push(`${u.id}: missing description`);
      if (!u.relatedPage?.trim()) violations.push(`${u.id}: missing relatedPage`);
    }
    expect(violations, `Field violations:\n${violations.join('\n')}`).toEqual([]);
  });

  it('all IDs are unique', () => {
    const ids = updates.map(u => u.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates, `Duplicate IDs: ${duplicates.join(', ')}`).toEqual([]);
  });

  it('all dates are valid YYYY-MM-DD format', () => {
    const violations: string[] = [];
    for (const u of updates) {
      if (!DATE_REGEX.test(u.date)) {
        violations.push(`${u.id}: invalid date "${u.date}"`);
      }
    }
    expect(violations, `Date violations:\n${violations.join('\n')}`).toEqual([]);
  });

  it('dates are parseable and not in the future', () => {
    const violations: string[] = [];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    for (const u of updates) {
      const parsed = new Date(u.date);
      if (isNaN(parsed.getTime())) {
        violations.push(`${u.id}: unparseable date "${u.date}"`);
      } else if (parsed > tomorrow) {
        violations.push(`${u.id}: future date "${u.date}"`);
      }
    }
    expect(violations, `Date violations:\n${violations.join('\n')}`).toEqual([]);
  });

  it('all categories are from valid set', () => {
    const violations: string[] = [];
    for (const u of updates) {
      if (!VALID_CATEGORIES.includes(u.category)) {
        violations.push(`${u.id}: unknown category "${u.category}"`);
      }
    }
    expect(violations, `Category violations:\n${violations.join('\n')}`).toEqual([]);
  });

  it('all relatedPage values start with /', () => {
    const violations: string[] = [];
    for (const u of updates) {
      if (!u.relatedPage.startsWith('/')) {
        violations.push(`${u.id}: relatedPage "${u.relatedPage}" doesn't start with /`);
      }
    }
    expect(violations, `Page violations:\n${violations.join('\n')}`).toEqual([]);
  });

  it('descriptions are substantive (>30 chars)', () => {
    const violations: string[] = [];
    for (const u of updates) {
      if (u.description.length < 30) {
        violations.push(`${u.id}: description too short (${u.description.length} chars)`);
      }
    }
    expect(violations, `Short descriptions:\n${violations.join('\n')}`).toEqual([]);
  });

  it('titles are concise (<200 chars)', () => {
    const violations: string[] = [];
    for (const u of updates) {
      if (u.title.length > 200) {
        violations.push(`${u.id}: title too long (${u.title.length} chars)`);
      }
    }
    expect(violations, `Long titles:\n${violations.join('\n')}`).toEqual([]);
  });

  it('updates are sorted by date (newest first)', () => {
    for (let i = 1; i < updates.length; i++) {
      expect(
        updates[i - 1].date >= updates[i].date,
        `Out of order: "${updates[i - 1].id}" (${updates[i - 1].date}) before "${updates[i].id}" (${updates[i].date})`
      ).toBe(true);
    }
  });
});
