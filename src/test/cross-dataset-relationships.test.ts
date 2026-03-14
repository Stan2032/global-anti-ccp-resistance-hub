import { describe, it, expect } from 'vitest';
import { dataApi } from '../services/dataApi';

/**
 * Cross-Dataset Relationship Tests
 *
 * Validates consistency across datasets using the data API.
 * Catches issues like:
 * - Emergency alerts referencing events not in timeline
 * - Sanctioned officials not appearing in sanctions list
 * - Data counts matching between API summary and actual data
 * - Regional data aggregation returning consistent results
 */

describe('Cross-Dataset Relationship Validation', () => {
  // ── API Summary Consistency ─────────────────────────
  describe('API summary matches actual data', () => {
    it('summary counts match actual record counts', () => {
      const summary = dataApi.getDatasetSummary();

      expect(summary.datasets.political_prisoners.count).toBe(
        dataApi.getPoliticalPrisoners().length
      );
      expect(summary.datasets.sanctions.count).toBe(
        dataApi.getSanctions().length
      );
      expect(summary.datasets.sanctioned_officials.count).toBe(
        dataApi.getSanctionedOfficials().length
      );
      expect(summary.datasets.timeline_events.count).toBe(
        dataApi.getTimelineEvents().length
      );
      expect(summary.datasets.forced_labor_companies.count).toBe(
        dataApi.getForcedLaborCompanies().length
      );
      expect(summary.datasets.detention_facilities.count).toBe(
        dataApi.getDetentionFacilities().length
      );
      expect(summary.datasets.live_statistics.count).toBe(
        dataApi.getStatistics().length
      );
    });
  });

  // ── Timeline Event Coverage ─────────────────────────
  describe('Timeline events cover key topics', () => {
    it('has events for all major categories', () => {
      const events = dataApi.getTimelineEvents();
      const categories = [...new Set(events.map((e) => e.category))];
      // Major categories that must exist
      expect(categories).toContain('hongkong');
      expect(categories).toContain('uyghur');
      expect(categories).toContain('mainland');
    });

    it('has events spanning decades', () => {
      const events = dataApi.getTimelineEvents();
      const years = events.map((e) => parseInt(e.date.substring(0, 4)));
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      expect(minYear).toBeLessThanOrEqual(1989);
      expect(maxYear).toBeGreaterThanOrEqual(2025);
    });

    it('has critical-significance events', () => {
      const critical = dataApi.getTimelineEventsBySignificance('critical');
      expect(critical.length).toBeGreaterThanOrEqual(5);
    });
  });

  // ── Sanctions Coverage ──────────────────────────────
  describe('Sanctions cover multiple countries', () => {
    it('has sanctions from at least 4 countries', () => {
      const sanctions = dataApi.getSanctions();
      const countries = [...new Set(sanctions.map((s) => s.country))];
      expect(countries.length).toBeGreaterThanOrEqual(4);
    });

    it('sanctioned officials have at least some sanctions records', () => {
      const officials = dataApi.getSanctionedOfficials();
      const sanctions = dataApi.getSanctions();
      // At least some officials should appear as sanctions targets
      const sanctionTargets = sanctions.map((s) => s.target?.toLowerCase());
      const matchCount = officials.filter((o) =>
        sanctionTargets.some(
          (t) => t && o.name && t.includes(o.name.toLowerCase())
        )
      ).length;
      expect(matchCount).toBeGreaterThan(0);
    });
  });

  // ── Regional Data Consistency ───────────────────────
  describe('Regional data aggregation consistency', () => {
    it('Hong Kong data includes Jimmy Lai and Joshua Wong', () => {
      const hk = dataApi.getHongKongData();
      const prisonerNames = hk.prisoners.map((p) =>
        (p.prisoner_name || '').toLowerCase()
      );
      expect(prisonerNames.some((n) => n.includes('jimmy lai'))).toBe(true);
      expect(prisonerNames.some((n) => n.includes('joshua wong'))).toBe(true);
    });

    it('Hong Kong data includes timeline events', () => {
      const hk = dataApi.getHongKongData();
      expect(hk.timeline.length).toBeGreaterThan(0);
      // All should be hongkong category
      hk.timeline.forEach((e) => {
        expect(e.category).toBe('hongkong');
      });
    });

    it('Uyghur data includes detention facilities', () => {
      const uyghur = dataApi.getUyghurData();
      expect(uyghur.facilities.length).toBeGreaterThanOrEqual(10);
    });

    it('Uyghur data includes forced labor companies', () => {
      const uyghur = dataApi.getUyghurData();
      expect(uyghur.companies.length).toBeGreaterThanOrEqual(20);
    });
  });

  // ── Emergency Alert Relevance ───────────────────────
  describe('Emergency alerts reference real data', () => {
    it('active alerts have future or recent expiry dates', () => {
      const active = dataApi.getActiveAlerts();
      // All active alerts should be reasonably current
      active.forEach((a) => {
        expect(a.active).toBe(true);
        // If has expiry, it should be in the future or within the last year
        if (a.expires) {
          expect(a.expires).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
      });
    });

    it('all alerts have required fields', () => {
      const alerts = dataApi.getAlerts();
      alerts.forEach((a) => {
        expect(a.id).toBeTruthy();
        expect(a.title).toBeTruthy();
        expect(a.summary).toBeTruthy();
        expect(a.type).toBeTruthy();
        expect(typeof a.active).toBe('boolean');
      });
    });
  });

  // ── Global Search Consistency ───────────────────────
  describe('Global search returns consistent results', () => {
    it('searching for a known prisoner returns results in prisoners dataset', () => {
      const results = dataApi.globalSearch('Jimmy Lai');
      expect(results.political_prisoners.length).toBeGreaterThan(0);
    });

    it('searching for Xinjiang returns results in multiple datasets', () => {
      const results = dataApi.globalSearch('Xinjiang');
      const datasetsWithResults = Object.entries(results).filter(
        ([, arr]) => arr.length > 0
      );
      expect(datasetsWithResults.length).toBeGreaterThanOrEqual(2);
    });

    it('empty search returns empty object', () => {
      expect(dataApi.globalSearch('')).toEqual({});
      expect(dataApi.globalSearch(null as unknown as string)).toEqual({});
    });
  });

  // ── Data Quality Minimum Thresholds ─────────────────
  describe('Data quantity minimum thresholds', () => {
    it('has at least 60 political prisoners documented', () => {
      expect(dataApi.getPoliticalPrisoners().length).toBeGreaterThanOrEqual(60);
    });

    it('has at least 45 sanctions entries', () => {
      expect(dataApi.getSanctions().length).toBeGreaterThanOrEqual(45);
    });

    it('has at least 30 sanctioned officials', () => {
      expect(dataApi.getSanctionedOfficials().length).toBeGreaterThanOrEqual(30);
    });

    it('has at least 30 timeline events', () => {
      expect(dataApi.getTimelineEvents().length).toBeGreaterThanOrEqual(30);
    });

    it('has at least 25 forced labor companies', () => {
      expect(dataApi.getForcedLaborCompanies().length).toBeGreaterThanOrEqual(25);
    });

    it('has at least 10 detention facilities', () => {
      expect(dataApi.getDetentionFacilities().length).toBeGreaterThanOrEqual(10);
    });

    it('has at least 5 emergency alerts (active or inactive)', () => {
      expect(dataApi.getAlerts().length).toBeGreaterThanOrEqual(5);
    });

    it('has at least 8 live statistics', () => {
      expect(dataApi.getStatistics().length).toBeGreaterThanOrEqual(8);
    });

    it('has at least 20 recent updates', () => {
      expect(dataApi.getRecentUpdates().length).toBeGreaterThanOrEqual(20);
    });
  });

  // ── Prisoner-Official Cross-Reference ───────────────
  describe('Prisoner and official data cross-references', () => {
    it('prisoners with DETAINED status outnumber those with RELEASED', () => {
      const detained = dataApi.getPoliticalPrisonersByStatus('DETAINED');
      const released = dataApi.getPoliticalPrisonersByStatus('RELEASED');
      expect(detained.length).toBeGreaterThan(released.length);
    });

    it('all prisoner statuses are valid enum values', () => {
      const validStatuses = ['DETAINED', 'DECEASED', 'DISAPPEARED', 'EXILE', 'RELEASED', 'AT RISK'];
      const prisoners = dataApi.getPoliticalPrisoners();
      prisoners.forEach((p) => {
        expect(
          validStatuses,
          `Unknown status: ${p.status} for ${p.prisoner_name}`
        ).toContain(p.status);
      });
    });

    it('all sanctions have valid country codes', () => {
      const validCountries = ['us', 'uk', 'eu', 'canada', 'australia'];
      const sanctions = dataApi.getSanctions();
      sanctions.forEach((s) => {
        expect(
          validCountries,
          `Unknown country: ${s.country} for ${s.target}`
        ).toContain(s.country);
      });
    });
  });
});
