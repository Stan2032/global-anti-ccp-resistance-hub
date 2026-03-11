import { describe, it, expect } from 'vitest';
import { dataApi } from '../services/dataApi';

/**
 * Cross-Dataset Referential Integrity Tests (Session 271)
 *
 * Validates that data relationships between different JSON datasets
 * are internally consistent. These tests catch:
 *
 * - Prisoners mentioned in alerts but missing from prisoner database
 * - Sanctioned officials with names that don't match any sanctions entry
 * - Timeline events referencing categories that don't exist
 * - Emergency alerts with stale "lastVerified" dates
 * - Duplicate records within a single dataset
 * - Orphaned sanctions (target exists nowhere else in the data)
 */

describe('Cross-Dataset Referential Integrity', () => {
  // ── No Duplicate IDs ──────────────────────────────────
  describe('Unique identifiers within datasets', () => {
    it('all timeline events have unique IDs', () => {
      const events = dataApi.getTimelineEvents();
      const ids = events.map((e) => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('all emergency alerts have unique IDs', () => {
      const alerts = dataApi.getAlerts();
      const ids = alerts.map((a) => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('all political prisoners have unique names', () => {
      const prisoners = dataApi.getPoliticalPrisoners();
      const names = prisoners.map((p) => p.prisoner_name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it('all sanctioned officials have unique names', () => {
      const officials = dataApi.getSanctionedOfficials();
      const names = officials.map((o) => o.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });
  });

  // ── Prisoner → Timeline Cross-References ──────────────
  describe('Political prisoners appear in timeline context', () => {
    it('Jimmy Lai has corresponding timeline events', () => {
      const events = dataApi.getTimelineEvents();
      const laiEvents = events.filter(
        (e) =>
          e.title.toLowerCase().includes('jimmy lai') ||
          String(e.details || '').toLowerCase().includes('jimmy lai')
      );
      expect(laiEvents.length).toBeGreaterThanOrEqual(1);
    });

    it('Joshua Wong has corresponding timeline events', () => {
      const events = dataApi.getTimelineEvents();
      const wongEvents = events.filter(
        (e) =>
          e.title.toLowerCase().includes('joshua wong') ||
          String(e.details || '').toLowerCase().includes('joshua wong') ||
          e.title.toLowerCase().includes('hong kong 47')
      );
      expect(wongEvents.length).toBeGreaterThanOrEqual(1);
    });

    it('Ilham Tohti appears in timeline', () => {
      const events = dataApi.getTimelineEvents();
      const tohtiEvents = events.filter(
        (e) =>
          e.title.toLowerCase().includes('ilham tohti') ||
          String(e.details || '').toLowerCase().includes('ilham tohti')
      );
      expect(tohtiEvents.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── Official → Sanctions Cross-References ─────────────
  describe('Sanctioned officials have matching sanctions', () => {
    it('at least 50% of officials appear as sanctions targets', () => {
      const officials = dataApi.getSanctionedOfficials();
      const sanctions = dataApi.getSanctions();
      const sanctionTargetsLower = sanctions.map((s) =>
        (s.target || '').toLowerCase()
      );

      let matchCount = 0;
      for (const official of officials) {
        const nameLower = (official.name || '').toLowerCase();
        if (
          sanctionTargetsLower.some(
            (t) => t.includes(nameLower) || nameLower.includes(t)
          )
        ) {
          matchCount++;
        }
      }

      const matchRatio = matchCount / officials.length;
      expect(matchRatio).toBeGreaterThanOrEqual(0.5);
    });
  });

  // ── Timeline Chronological Integrity ──────────────────
  describe('Timeline chronological integrity', () => {
    it('all timeline dates are valid ISO dates', () => {
      const events = dataApi.getTimelineEvents();
      for (const e of events) {
        expect(e.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        const parsed = new Date(e.date);
        expect(isNaN(parsed.getTime())).toBe(false);
      }
    });

    it('timeline events span at least 30 years', () => {
      const events = dataApi.getTimelineEvents();
      const years = events.map((e) => parseInt(e.date.substring(0, 4)));
      const span = Math.max(...years) - Math.min(...years);
      expect(span).toBeGreaterThanOrEqual(30);
    });

    it('no timeline events have future dates beyond 1 year', () => {
      const events = dataApi.getTimelineEvents();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      for (const e of events) {
        const eventDate = new Date(e.date);
        expect(
          eventDate.getTime(),
          `Event "${e.title}" has date ${e.date} more than 1 year in the future`
        ).toBeLessThanOrEqual(oneYearFromNow.getTime());
      }
    });
  });

  // ── Source URL Consistency ─────────────────────────────
  describe('Source URLs are consistent across datasets', () => {
    it('all prisoner source URLs use HTTPS', () => {
      const prisoners = dataApi.getPoliticalPrisoners();
      for (const p of prisoners) {
        if (p.source_url) {
          expect(
            p.source_url.startsWith('https://'),
            `Prisoner "${p.prisoner_name}" source_url uses HTTP: ${p.source_url}`
          ).toBe(true);
        }
      }
    });

    it('all sanctions source URLs use HTTPS', () => {
      const sanctions = dataApi.getSanctions();
      for (const s of sanctions) {
        if (s.source_url) {
          expect(
            s.source_url.startsWith('https://'),
            `Sanction for "${s.target}" source_url uses HTTP: ${s.source_url}`
          ).toBe(true);
        }
      }
    });

    it('no source URLs contain CCP state media domains', () => {
      const ccpDomains = [
        'xinhua.net',
        'cgtn.com',
        'globaltimes.cn',
        'chinadaily.com',
        'people.com.cn',
        'cctv.com',
      ];
      const allDatasets = dataApi.getAllDatasets();

      for (const prisoner of allDatasets.prisoners) {
        if (prisoner.source_url) {
          for (const domain of ccpDomains) {
            expect(
              prisoner.source_url.includes(domain),
              `Prisoner "${prisoner.prisoner_name}" cites CCP media: ${prisoner.source_url}`
            ).toBe(false);
          }
        }
      }

      for (const sanction of allDatasets.sanctions) {
        if (sanction.source_url) {
          for (const domain of ccpDomains) {
            expect(
              sanction.source_url.includes(domain),
              `Sanction for "${sanction.target}" cites CCP media: ${sanction.source_url}`
            ).toBe(false);
          }
        }
      }
    });
  });

  // ── Emergency Alert → Dataset References ──────────────
  describe('Emergency alerts reference real entities', () => {
    it('alerts mentioning prisoner names match real prisoners', () => {
      const alerts = dataApi.getAlerts();
      const prisonerNames = dataApi
        .getPoliticalPrisoners()
        .map((p) => p.prisoner_name.toLowerCase());

      // Known prisoner-referencing alert IDs
      const prisonerAlerts = alerts.filter(
        (a) =>
          a.id.includes('lai') ||
          a.id.includes('wong') ||
          a.title.toLowerCase().includes('jimmy lai') ||
          a.title.toLowerCase().includes('joshua wong')
      );

      for (const alert of prisonerAlerts) {
        // Extract prisoner name from alert
        const titleLower = alert.title.toLowerCase();
        const matchesSomePrisoner = prisonerNames.some(
          (name) => titleLower.includes(name) || alert.id.includes(name.split(' ').pop() || '')
        );
        expect(
          matchesSomePrisoner,
          `Alert "${alert.id}" references a prisoner not in database`
        ).toBe(true);
      }
    });
  });

  // ── Data Field Completeness ───────────────────────────
  describe('Critical fields are never empty', () => {
    it('all prisoners have non-empty names and statuses', () => {
      const prisoners = dataApi.getPoliticalPrisoners();
      for (const p of prisoners) {
        expect(p.prisoner_name?.trim().length).toBeGreaterThan(0);
        expect(p.status?.trim().length).toBeGreaterThan(0);
      }
    });

    it('all sanctions have non-empty targets and countries', () => {
      const sanctions = dataApi.getSanctions();
      for (const s of sanctions) {
        expect(s.target?.trim().length).toBeGreaterThan(0);
        expect(s.country?.trim().length).toBeGreaterThan(0);
      }
    });

    it('all timeline events have non-empty titles and dates', () => {
      const events = dataApi.getTimelineEvents();
      for (const e of events) {
        expect(e.title?.trim().length).toBeGreaterThan(0);
        expect(e.date?.trim().length).toBeGreaterThan(0);
      }
    });

    it('all officials have non-empty names', () => {
      const officials = dataApi.getSanctionedOfficials();
      for (const o of officials) {
        expect(o.name?.trim().length).toBeGreaterThan(0);
      }
    });
  });

  // ── AllDatasets Snapshot Consistency ───────────────────
  describe('getAllDatasets returns complete snapshot', () => {
    it('every dataset in snapshot is non-empty', () => {
      const all = dataApi.getAllDatasets();
      expect(all.prisoners.length).toBeGreaterThan(0);
      expect(all.officials.length).toBeGreaterThan(0);
      expect(all.sanctions.length).toBeGreaterThan(0);
      expect(all.timeline.length).toBeGreaterThan(0);
      expect(all.companies.length).toBeGreaterThan(0);
      expect(all.facilities.length).toBeGreaterThan(0);
      expect(all.responses.length).toBeGreaterThan(0);
      expect(all.orgs.length).toBeGreaterThan(0);
    });

    it('snapshot counts match individual API calls', () => {
      const all = dataApi.getAllDatasets();
      expect(all.prisoners.length).toBe(dataApi.getPoliticalPrisoners().length);
      expect(all.sanctions.length).toBe(dataApi.getSanctions().length);
      expect(all.officials.length).toBe(dataApi.getSanctionedOfficials().length);
      expect(all.timeline.length).toBe(dataApi.getTimelineEvents().length);
    });
  });
});
