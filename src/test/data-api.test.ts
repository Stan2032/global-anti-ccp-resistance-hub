import { describe, it, expect } from 'vitest';
import { dataApi } from '../services/dataApi';

describe('Data API', () => {
  // ── Dataset Summary ─────────────────────────────────
  describe('getDatasetSummary', () => {
    it('returns summary with all datasets', () => {
      const summary = dataApi.getDatasetSummary();
      expect(summary.datasets).toBeDefined();
      const datasetNames = Object.keys(summary.datasets);
      expect(datasetNames).toContain('political_prisoners');
      expect(datasetNames).toContain('sanctions');
      expect(datasetNames).toContain('sanctioned_officials');
      expect(datasetNames).toContain('timeline_events');
      expect(datasetNames).toContain('forced_labor_companies');
      expect(datasetNames).toContain('detention_facilities');
      expect(datasetNames).toContain('emergency_alerts');
      expect(datasetNames).toContain('live_statistics');
    });

    it('includes count, description, and fields for each dataset', () => {
      const summary = dataApi.getDatasetSummary();
      for (const ds of Object.values(summary.datasets)) {
        expect(typeof ds.count).toBe('number');
        expect(ds.count).toBeGreaterThan(0);
        expect(typeof ds.description).toBe('string');
        expect(ds.description.length).toBeGreaterThan(10);
        expect(Array.isArray(ds.fields)).toBe(true);
        expect(ds.fields.length).toBeGreaterThan(3);
      }
    });

    it('includes license and source policy', () => {
      const summary = dataApi.getDatasetSummary();
      expect(summary.license).toBe('CC BY 4.0');
      expect(summary.sourcePolicy).toContain('Tier 1-2');
      expect(summary.sourcePolicy).toContain('CCP state media never cited');
    });
  });

  // ── Political Prisoners ─────────────────────────────
  describe('Political Prisoners', () => {
    it('returns all political prisoners', () => {
      const prisoners = dataApi.getPoliticalPrisoners();
      expect(prisoners.length).toBeGreaterThanOrEqual(60);
      // Each record has a prisoner_name from the output
      prisoners.forEach((p) => {
        expect(p.prisoner_name).toBeTruthy();
      });
    });

    it('finds prisoner by exact name (case-insensitive)', () => {
      const jimmy = dataApi.getPoliticalPrisonerByName('Jimmy Lai');
      expect(jimmy).not.toBeNull();
      expect(jimmy!.prisoner_name).toBe('Jimmy Lai');

      // Case insensitive
      const jimmyLower = dataApi.getPoliticalPrisonerByName('jimmy lai');
      expect(jimmyLower).not.toBeNull();
    });

    it('returns null for non-existent prisoner', () => {
      const result = dataApi.getPoliticalPrisonerByName('Non Existent Person');
      expect(result).toBeNull();
    });

    it('searches prisoners by keyword', () => {
      const hkResults = dataApi.searchPoliticalPrisoners('Hong Kong');
      expect(hkResults.length).toBeGreaterThan(0);
      // All results should contain the keyword somewhere
      hkResults.forEach((p) => {
        const allText = Object.values(p)
          .filter((v) => typeof v === 'string')
          .join(' ')
          .toLowerCase();
        expect(allText).toContain('hong kong');
      });
    });

    it('filters prisoners by status', () => {
      const detained = dataApi.getPoliticalPrisonersByStatus('DETAINED');
      expect(detained.length).toBeGreaterThan(0);
      detained.forEach((p) => {
        expect(p.status.toUpperCase()).toBe('DETAINED');
      });
    });

    it('returns empty for search with no matches', () => {
      const results = dataApi.searchPoliticalPrisoners('xyznonexistent123');
      expect(results).toEqual([]);
    });
  });

  // ── Sanctions ───────────────────────────────────────
  describe('Sanctions', () => {
    it('returns all sanctions entries', () => {
      const sanctions = dataApi.getSanctions();
      expect(sanctions.length).toBeGreaterThanOrEqual(46);
      sanctions.forEach((s) => {
        expect(s.id).toBeTruthy();
        expect(s.country).toBeTruthy();
        expect(s.target).toBeTruthy();
      });
    });

    it('filters sanctions by country', () => {
      const usSanctions = dataApi.getSanctionsByCountry('us');
      expect(usSanctions.length).toBeGreaterThan(0);
      usSanctions.forEach((s) => {
        expect(s.country.toLowerCase()).toBe('us');
      });
    });

    it('searches sanctions by keyword', () => {
      const results = dataApi.searchSanctions('transnational');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  // ── Sanctioned Officials ────────────────────────────
  describe('Sanctioned Officials', () => {
    it('returns all sanctioned officials', () => {
      const officials = dataApi.getSanctionedOfficials();
      expect(officials.length).toBeGreaterThanOrEqual(34);
      officials.forEach((o) => {
        expect(o.name).toBeTruthy();
      });
    });

    it('finds official by exact name', () => {
      const officials = dataApi.getSanctionedOfficials();
      const firstName = officials[0].name;
      const found = dataApi.getSanctionedOfficialByName(firstName);
      expect(found).not.toBeNull();
      expect(found!.name).toBe(firstName);
    });

    it('returns null for non-existent official', () => {
      const result = dataApi.getSanctionedOfficialByName('Not A Real Official');
      expect(result).toBeNull();
    });

    it('searches officials by keyword', () => {
      const results = dataApi.searchSanctionedOfficials('Xinjiang');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  // ── Timeline Events ─────────────────────────────────
  describe('Timeline Events', () => {
    it('returns all timeline events sorted', () => {
      const events = dataApi.getTimelineEvents();
      expect(events.length).toBeGreaterThanOrEqual(34);
      events.forEach((e) => {
        expect(e.id).toBeDefined();
        expect(e.date).toBeTruthy();
        expect(e.title).toBeTruthy();
        expect(e.category).toBeTruthy();
      });
    });

    it('filters by category', () => {
      const hkEvents = dataApi.getTimelineEventsByCategory('hongkong');
      expect(hkEvents.length).toBeGreaterThan(0);
      hkEvents.forEach((e) => {
        expect(e.category).toBe('hongkong');
      });
    });

    it('filters by significance', () => {
      const criticalEvents = dataApi.getTimelineEventsBySignificance('critical');
      expect(criticalEvents.length).toBeGreaterThan(0);
      criticalEvents.forEach((e) => {
        expect(e.significance).toBe('critical');
      });
    });

    it('filters by date range', () => {
      const events2020s = dataApi.getTimelineEventsInRange('2020-01-01', '2025-12-31');
      expect(events2020s.length).toBeGreaterThan(0);
      events2020s.forEach((e) => {
        expect(e.date >= '2020-01-01').toBe(true);
        expect(e.date <= '2025-12-31').toBe(true);
      });
    });

    it('returns empty for range with no events', () => {
      const future = dataApi.getTimelineEventsInRange('2050-01-01', '2060-12-31');
      expect(future).toEqual([]);
    });
  });

  // ── Forced Labor Companies ──────────────────────────
  describe('Forced Labor Companies', () => {
    it('returns all companies', () => {
      const companies = dataApi.getForcedLaborCompanies();
      expect(companies.length).toBeGreaterThanOrEqual(30);
      companies.forEach((c) => {
        expect(c.company).toBeTruthy();
      });
    });

    it('filters by industry', () => {
      const apparel = dataApi.getForcedLaborCompaniesByIndustry('Apparel');
      expect(apparel.length).toBeGreaterThan(0);
      apparel.forEach((c) => {
        expect(c.industry!.toLowerCase()).toBe('apparel');
      });
    });

    it('searches companies by keyword', () => {
      const results = dataApi.searchForcedLaborCompanies('cotton');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  // ── Detention Facilities ────────────────────────────
  describe('Detention Facilities', () => {
    it('returns all facilities', () => {
      const facilities = dataApi.getDetentionFacilities();
      expect(facilities.length).toBeGreaterThanOrEqual(11);
      facilities.forEach((f) => {
        expect(f.name).toBeTruthy();
        expect(f.region).toBeTruthy();
      });
    });

    it('filters by region', () => {
      const xinjiang = dataApi.getDetentionFacilitiesByRegion('Xinjiang');
      expect(xinjiang.length).toBeGreaterThan(0);
      xinjiang.forEach((f) => {
        expect(f.region.toLowerCase()).toBe('xinjiang');
      });
    });

    it('filters by type', () => {
      const facilities = dataApi.getDetentionFacilities();
      const types = [...new Set(facilities.map((f) => f.type))];
      if (types.length > 0) {
        const filtered = dataApi.getDetentionFacilitiesByType(types[0]);
        expect(filtered.length).toBeGreaterThan(0);
      }
    });
  });

  // ── Emergency Alerts ────────────────────────────────
  describe('Emergency Alerts', () => {
    it('returns all alerts including inactive', () => {
      const alerts = dataApi.getAlerts();
      expect(alerts.length).toBeGreaterThanOrEqual(5);
    });

    it('returns only active and non-expired alerts', () => {
      const active = dataApi.getActiveAlerts();
      active.forEach((a) => {
        expect(a.active).toBe(true);
      });
    });

    it('finds alert by ID', () => {
      const alerts = dataApi.getAlerts();
      const first = alerts[0];
      const found = dataApi.getAlertById(first.id);
      expect(found).not.toBeNull();
      expect(found!.id).toBe(first.id);
    });

    it('returns null for non-existent alert ID', () => {
      const result = dataApi.getAlertById('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  // ── Statistics ──────────────────────────────────────
  describe('Statistics', () => {
    it('returns all statistics', () => {
      const stats = dataApi.getStatistics();
      expect(stats.length).toBeGreaterThanOrEqual(8);
      stats.forEach((s) => {
        expect(s.id).toBeTruthy();
        expect(s.label).toBeTruthy();
        expect(s.value).toBeDefined();
      });
    });

    it('finds statistic by ID', () => {
      const stats = dataApi.getStatistics();
      const first = stats[0];
      const found = dataApi.getStatisticById(first.id);
      expect(found).not.toBeNull();
      expect(found!.id).toBe(first.id);
    });
  });

  // ── Recent Updates ──────────────────────────────────
  describe('Recent Updates', () => {
    it('returns all recent updates', () => {
      const updates = dataApi.getRecentUpdates();
      expect(updates.length).toBeGreaterThanOrEqual(20);
    });

    it('returns limited updates when limit specified', () => {
      const updates = dataApi.getRecentUpdates(5);
      expect(updates.length).toBe(5);
    });

    it('filters updates by category', () => {
      const dataUpdates = dataApi.getRecentUpdatesByCategory('data');
      expect(dataUpdates.length).toBeGreaterThan(0);
      dataUpdates.forEach((u) => {
        expect(u.category!.toLowerCase()).toBe('data');
      });
    });
  });

  // ── Cross-dataset Queries ───────────────────────────
  describe('Global Search', () => {
    it('searches across all datasets', () => {
      const results = dataApi.globalSearch('Hong Kong');
      expect(results.political_prisoners).toBeDefined();
      expect(results.sanctions).toBeDefined();
      expect(results.sanctioned_officials).toBeDefined();
      expect(results.forced_labor_companies).toBeDefined();
      expect(results.timeline_events).toBeDefined();

      // Should find results in at least some datasets
      const totalResults = Object.values(results).reduce(
        (sum, arr) => sum + arr.length,
        0
      );
      expect(totalResults).toBeGreaterThan(0);
    });

    it('returns empty for very short queries', () => {
      const results = dataApi.globalSearch('a');
      expect(results).toEqual({});
    });

    it('returns empty for empty query', () => {
      const results = dataApi.globalSearch('');
      expect(results).toEqual({});
    });
  });

  describe('Regional Data Aggregation', () => {
    it('aggregates Hong Kong data', () => {
      const hk = dataApi.getHongKongData();
      expect(hk.prisoners).toBeDefined();
      expect(hk.sanctions).toBeDefined();
      expect(hk.timeline).toBeDefined();
      expect(hk.alerts).toBeDefined();
      expect(hk.timeline.length).toBeGreaterThan(0);
    });

    it('aggregates Uyghur data', () => {
      const uyghur = dataApi.getUyghurData();
      expect(uyghur.prisoners).toBeDefined();
      expect(uyghur.companies).toBeDefined();
      expect(uyghur.facilities).toBeDefined();
      expect(uyghur.sanctions).toBeDefined();
      expect(uyghur.timeline).toBeDefined();
      expect(uyghur.companies.length).toBeGreaterThan(0);
      expect(uyghur.facilities.length).toBeGreaterThan(0);
    });
  });

  // ── Data Integrity ──────────────────────────────────
  describe('Data Integrity', () => {
    it('all prisoners have source URLs', () => {
      const prisoners = dataApi.getPoliticalPrisoners();
      prisoners.forEach((p) => {
        expect(p.source_url).toBeTruthy();
        expect(p.source_url).toMatch(/^https?:\/\//);
      });
    });

    it('all sanctions have source URLs', () => {
      const sanctions = dataApi.getSanctions();
      sanctions.forEach((s) => {
        expect(s.source_url).toBeTruthy();
        expect(s.source_url).toMatch(/^https?:\/\//);
      });
    });

    it('all timeline events have valid dates', () => {
      const events = dataApi.getTimelineEvents();
      events.forEach((e) => {
        expect(e.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it('no dataset contains CCP state media source URLs', () => {
      const ccpDomains = [
        'xinhua', 'cgtn', 'globaltimes', 'chinadaily',
        'people.cn', 'en.people.cn', 'tibet.cn',
      ];

      const allUrls = [
        ...dataApi.getPoliticalPrisoners().map((p) => p.source_url || ''),
        ...dataApi.getSanctions().map((s) => s.source_url || ''),
      ];

      allUrls.forEach((url) => {
        if (url) {
          ccpDomains.forEach((domain) => {
            expect(url.toLowerCase()).not.toContain(domain);
          });
        }
      });
    });

    it('no dataset uses CPC terminology', () => {
      // Check all string values across datasets
      const checkForCPC = (obj: Record<string, unknown>) => {
        Object.values(obj).forEach((val) => {
          if (typeof val === 'string') {
            // Allow "CPC" in compound words like "CECC" or URL paths, but not standalone "CPC"
            const hasCPC = /\bCPC\b/.test(val) && !/CECC|CPC\\.gov/.test(val);
            expect(hasCPC).toBe(false);
          }
        });
      };

      dataApi.getPoliticalPrisoners().forEach(checkForCPC);
      dataApi.getSanctionedOfficials().forEach(checkForCPC);
      dataApi.getTimelineEvents().forEach(checkForCPC);
    });
  });
});
