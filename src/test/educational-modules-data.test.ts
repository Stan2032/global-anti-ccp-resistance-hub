/**
 * Data validation tests for educational_modules.json
 *
 * Ensures module data integrity: unique IDs, required fields,
 * valid categories, levels, and topic arrays.
 */
import { describe, it, expect } from 'vitest';
import modulesData from '../data/educational_modules.json';

interface EducationalModule {
  id: number;
  title: string;
  category: string;
  description: string;
  duration: string;
  level: string;
  lessons: number;
  topics: string[];
}

const VALID_CATEGORIES = ['propaganda', 'security', 'history', 'advocacy', 'skills'];
const VALID_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const modules: EducationalModule[] = modulesData.modules;

describe('Educational Modules Data', () => {
  it('has at least 5 educational modules', () => {
    expect(modules.length).toBeGreaterThanOrEqual(5);
  });

  it('every module has required fields', () => {
    const violations: string[] = [];
    for (const m of modules) {
      if (!m.id) violations.push(`Missing id`);
      if (!m.title?.trim()) violations.push(`Module ${m.id}: missing title`);
      if (!m.category?.trim()) violations.push(`Module ${m.id}: missing category`);
      if (!m.description?.trim()) violations.push(`Module ${m.id}: missing description`);
      if (!m.duration?.trim()) violations.push(`Module ${m.id}: missing duration`);
      if (!m.level?.trim()) violations.push(`Module ${m.id}: missing level`);
      if (typeof m.lessons !== 'number' || m.lessons < 1) violations.push(`Module ${m.id}: invalid lessons count`);
      if (!Array.isArray(m.topics) || m.topics.length === 0) violations.push(`Module ${m.id}: missing topics`);
    }
    expect(violations, `Field violations:\n${violations.join('\n')}`).toEqual([]);
  });

  it('all module IDs are unique', () => {
    const ids = modules.map(m => m.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates, `Duplicate IDs: ${duplicates.join(', ')}`).toEqual([]);
  });

  it('all module titles are unique', () => {
    const titles = modules.map(m => m.title.toLowerCase());
    const duplicates = titles.filter((t, i) => titles.indexOf(t) !== i);
    expect(duplicates, `Duplicate titles: ${duplicates.join(', ')}`).toEqual([]);
  });

  it('all categories are from valid set', () => {
    const violations: string[] = [];
    for (const m of modules) {
      if (!VALID_CATEGORIES.includes(m.category)) {
        violations.push(`Module ${m.id} (${m.title}): invalid category "${m.category}"`);
      }
    }
    expect(violations, `Invalid categories:\n${violations.join('\n')}`).toEqual([]);
  });

  it('all levels are from valid set', () => {
    const violations: string[] = [];
    for (const m of modules) {
      if (!VALID_LEVELS.includes(m.level)) {
        violations.push(`Module ${m.id} (${m.title}): invalid level "${m.level}"`);
      }
    }
    expect(violations, `Invalid levels:\n${violations.join('\n')}`).toEqual([]);
  });

  it('all topics are non-empty strings', () => {
    const violations: string[] = [];
    for (const m of modules) {
      for (const topic of m.topics) {
        if (typeof topic !== 'string' || !topic.trim()) {
          violations.push(`Module ${m.id} (${m.title}): empty/invalid topic`);
        }
      }
    }
    expect(violations, `Topic violations:\n${violations.join('\n')}`).toEqual([]);
  });

  it('duration follows expected format (contains "hours")', () => {
    const violations: string[] = [];
    for (const m of modules) {
      if (!m.duration.toLowerCase().includes('hour')) {
        violations.push(`Module ${m.id} (${m.title}): duration "${m.duration}" doesn't mention hours`);
      }
    }
    expect(violations, `Duration format violations:\n${violations.join('\n')}`).toEqual([]);
  });

  it('descriptions are sufficiently detailed (>20 chars)', () => {
    const violations: string[] = [];
    for (const m of modules) {
      if (m.description.length < 20) {
        violations.push(`Module ${m.id} (${m.title}): description too short (${m.description.length} chars)`);
      }
    }
    expect(violations, `Short descriptions:\n${violations.join('\n')}`).toEqual([]);
  });

  it('covers multiple categories', () => {
    const categories = new Set(modules.map(m => m.category));
    expect(categories.size).toBeGreaterThanOrEqual(3);
  });
});
