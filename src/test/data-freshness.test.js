import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { STATISTICS } from '../data/statistics';

const DATA_DIR = resolve(__dirname, '../data');

/**
 * Data Freshness Validation Tests
 *
 * Ensures all data files with verification dates are kept reasonably current.
 * These tests act as automated reminders for maintainers to review and update data.
 *
 * Thresholds:
 * - Statistics: lastVerified should be within 180 days
 * - Sanctions metadata: last_verified should be within 180 days
 * - Political prisoners: every entry should have a last_verified date
 * - All JSON data files with metadata.last_verified: within 180 days
 */

const MAX_STALENESS_DAYS = 180;

function daysSince(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - date) / (1000 * 60 * 60 * 24));
}

describe('Data Freshness Validation', () => {
  describe('Centralized statistics freshness', () => {
    it('all statistics have lastVerified dates', () => {
      for (const [key, stat] of Object.entries(STATISTICS)) {
        expect(stat.lastVerified, `${key} missing lastVerified`).toBeDefined();
        expect(stat.lastVerified, `${key} lastVerified not in YYYY-MM-DD format`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it('no statistic is stale (> 180 days since last verification)', () => {
      for (const [key, stat] of Object.entries(STATISTICS)) {
        const days = daysSince(stat.lastVerified);
        expect(
          days,
          `${key} was last verified ${days} days ago (${stat.lastVerified}) — needs review`
        ).toBeLessThanOrEqual(MAX_STALENESS_DAYS);
      }
    });
  });

  describe('Sanctions tracker freshness', () => {
    let sanctionsData;

    it('loads sanctions data', () => {
      sanctionsData = JSON.parse(readFileSync(resolve(DATA_DIR, 'sanctions_tracker.json'), 'utf-8'));
      expect(sanctionsData).toBeDefined();
    });

    it('sanctions metadata has a last_verified date', () => {
      expect(sanctionsData.metadata.last_verified).toBeDefined();
      expect(sanctionsData.metadata.last_verified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('sanctions metadata is not stale (> 180 days)', () => {
      const days = daysSince(sanctionsData.metadata.last_verified);
      expect(
        days,
        `Sanctions tracker was last verified ${days} days ago — needs review`
      ).toBeLessThanOrEqual(MAX_STALENESS_DAYS);
    });
  });

  describe('Political prisoners freshness', () => {
    let prisoners;

    it('loads political prisoners data', () => {
      prisoners = JSON.parse(readFileSync(resolve(DATA_DIR, 'political_prisoners_research.json'), 'utf-8'));
      expect(prisoners.results).toBeDefined();
    });

    it('every prisoner has a last_verified date', () => {
      for (const r of prisoners.results) {
        expect(
          r.output.last_verified,
          `${r.output.prisoner_name} missing last_verified`
        ).toBeDefined();
      }
    });

    it('at least 90% of prisoners verified within 180 days', () => {
      const total = prisoners.results.length;
      const fresh = prisoners.results.filter(r => {
        if (!r.output.last_verified) return false;
        return daysSince(r.output.last_verified) <= MAX_STALENESS_DAYS;
      }).length;
      const freshPercent = (fresh / total) * 100;
      expect(
        freshPercent,
        `Only ${fresh}/${total} (${freshPercent.toFixed(0)}%) prisoners verified within ${MAX_STALENESS_DAYS} days`
      ).toBeGreaterThanOrEqual(90);
    });
  });

  describe('Timeline events completeness', () => {
    let events;

    it('loads timeline data', () => {
      events = JSON.parse(readFileSync(resolve(DATA_DIR, 'timeline_events.json'), 'utf-8'));
      expect(events).toBeDefined();
    });

    it('has at least 30 historical events', () => {
      expect(events.length).toBeGreaterThanOrEqual(30);
    });

    it('covers events from 1989 to present', () => {
      const years = events.map(e => new Date(e.date).getFullYear());
      expect(Math.min(...years)).toBeLessThanOrEqual(1989);
      expect(Math.max(...years)).toBeGreaterThanOrEqual(2024);
    });

    it('includes events from the current decade (2020s)', () => {
      const recent = events.filter(e => new Date(e.date).getFullYear() >= 2020);
      expect(recent.length, 'Should have substantial 2020s coverage').toBeGreaterThanOrEqual(5);
    });
  });

  describe('Cross-file data references', () => {
    it('all sanctioned individuals in sanctions_tracker appear in sanctioned_officials_research', () => {
      const sanctions = JSON.parse(readFileSync(resolve(DATA_DIR, 'sanctions_tracker.json'), 'utf-8'));
      const officials = JSON.parse(readFileSync(resolve(DATA_DIR, 'sanctioned_officials_research.json'), 'utf-8'));

      const officialNames = new Set(
        officials.results.map(r => r.output.name.toLowerCase())
      );

      const individualSanctions = sanctions.sanctions.filter(s => s.type === 'individual');
      const missing = individualSanctions.filter(
        s => !officialNames.has(s.target.toLowerCase())
      );

      expect(
        missing.length,
        `Sanctioned individuals not in officials research: ${missing.map(s => s.target).join(', ')}`
      ).toBe(0);
    });

    it('detention facilities have valid coordinates', () => {
      const facilities = JSON.parse(readFileSync(resolve(DATA_DIR, 'detention_facilities_research.json'), 'utf-8'));

      for (const r of facilities.results) {
        const { latitude, longitude, facility_name } = r.output;
        if (latitude !== undefined && longitude !== undefined) {
          expect(
            typeof latitude === 'number' || !isNaN(parseFloat(latitude)),
            `${facility_name} has invalid latitude: ${latitude}`
          ).toBe(true);
          expect(
            typeof longitude === 'number' || !isNaN(parseFloat(longitude)),
            `${facility_name} has invalid longitude: ${longitude}`
          ).toBe(true);
        }
      }
    });

    it('forced labor companies have valid industry classifications', () => {
      const companies = JSON.parse(readFileSync(resolve(DATA_DIR, 'forced_labor_companies_research.json'), 'utf-8'));

      for (const r of companies.results) {
        expect(r.output.company, 'Company entry missing name').toBeTruthy();
        expect(r.output.industry, `${r.output.company} missing industry`).toBeTruthy();
      }
    });
  });
});
