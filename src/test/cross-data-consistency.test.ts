import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve } from 'path';

const DATA_DIR = resolve(__dirname, '../data');

// Load all JSON data files
const loadJSON = (filename: string) => {
  const path = resolve(DATA_DIR, filename);
  return JSON.parse(readFileSync(path, 'utf-8'));
};

describe('Cross-JSON Data Consistency', () => {
  let prisoners: any, alerts: any, sanctions: any, officials: any, recentUpdates: any, forcedLabor: any, detentionFacilities: any;

  beforeAll(() => {
    prisoners = loadJSON('political_prisoners_research.json');
    alerts = loadJSON('emergency_alerts.json');
    sanctions = loadJSON('sanctions_tracker.json');
    officials = loadJSON('sanctioned_officials_research.json');
    recentUpdates = loadJSON('recent_updates.json');
    forcedLabor = loadJSON('forced_labor_companies_research.json');
    detentionFacilities = loadJSON('detention_facilities_research.json');
  });

  // --- All JSON files are loadable ---

  it('all 19 JSON data files exist and are valid JSON', () => {
    const jsonFiles = readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    expect(jsonFiles.length).toBeGreaterThanOrEqual(19);
    for (const file of jsonFiles) {
      const path = resolve(DATA_DIR, file);
      expect(existsSync(path), `${file} does not exist`).toBe(true);
      const content = readFileSync(path, 'utf-8');
      expect(() => JSON.parse(content), `${file} is not valid JSON`).not.toThrow();
    }
  });

  // --- Key prisoners referenced in alerts exist in prisoner database ---

  it('prisoners referenced in alert IDs exist in political_prisoners_research.json', () => {
    const prisonerNames = prisoners.results.map((r: any) => r.output.prisoner_name.toLowerCase());

    // Alerts that reference specific prisoners by name in their IDs
    const prisonerAlertMap = {
      'joshua-wong-hearing': 'joshua wong',
      'jimmy-lai-verdict': 'jimmy lai',
    };

    for (const [alertId, prisonerName] of Object.entries(prisonerAlertMap)) {
      const alert = alerts.find((a: any) => a.id === alertId);
      expect(alert, `Alert "${alertId}" should exist`).toBeDefined();
      expect(
        prisonerNames.includes(prisonerName),
        `Prisoner "${prisonerName}" referenced in alert "${alertId}" not found in prisoner database`
      ).toBe(true);
    }
  });

  // --- Active alerts reference valid data ---

  it('active critical alerts have lastVerified within 60 days', () => {
    const now = new Date();

    for (const alert of alerts.filter((a: any) => a.active && a.type === 'critical')) {
      if (alert.lastVerified) {
        const verifiedDate = new Date(alert.lastVerified);
        const daysSince = (now.getTime() - verifiedDate.getTime()) / (24 * 60 * 60 * 1000);
        expect(
          daysSince,
          `Alert "${alert.id}" lastVerified is ${Math.round(daysSince)} days old (max 60)`
        ).toBeLessThanOrEqual(60);
      }
    }
  });

  // --- Sanctions tracker has matching officials ---

  it('sanctioned officials have entries that appear in sanctions tracker targets', () => {
    const sanctionTargets = sanctions.sanctions.map((s: any) => s.target.toLowerCase());
    // At least some sanctioned officials should appear in the sanctions tracker
    const officialNames = officials.results.map((r: any) => r.output.name.toLowerCase());
    const overlap = officialNames.filter((name: string) =>
      sanctionTargets.some((target: any) => target.includes(name) || name.includes(target))
    );
    expect(
      overlap.length,
      'At least some sanctioned officials should appear in sanctions tracker'
    ).toBeGreaterThan(0);
  });

  // --- Recent updates reference valid pages ---

  it('recent_updates relatedPage values are valid route paths', () => {
    const validRoutePatterns = [
      '/', '/intelligence', '/prisoners', '/profiles', '/take-action',
      '/education', '/security', '/admin', '/admin-login',
      '/directory', '/community', '/resources', '/data-sources',
    ];

    for (const update of recentUpdates) {
      if (update.relatedPage) {
        // Allow exact matches or sub-routes like /profiles/joshua-wong
        const isValid = validRoutePatterns.some(route =>
          update.relatedPage === route || update.relatedPage.startsWith(route + '/')
        );
        expect(
          isValid,
          `Update "${update.id}" has invalid relatedPage: "${update.relatedPage}"`
        ).toBe(true);
      }
    }
  });

  it('recent_updates have valid category values', () => {
    const validCategories = ['alert', 'data', 'verification', 'case_update', 'new_case', 'new_entry', 'report'];

    for (const update of recentUpdates) {
      expect(
        validCategories.includes(update.category),
        `Update "${update.id}" has invalid category: "${update.category}"`
      ).toBe(true);
    }
  });

  it('recent_updates dates are in descending order (newest first)', () => {
    for (let i = 1; i < recentUpdates.length; i++) {
      expect(
        recentUpdates[i - 1].date >= recentUpdates[i].date,
        `Update "${recentUpdates[i].id}" (${recentUpdates[i].date}) is out of order after "${recentUpdates[i - 1].id}" (${recentUpdates[i - 1].date})`
      ).toBe(true);
    }
  });

  // --- Detention facilities reference valid regions ---

  it('detention facilities have valid region values', () => {
    const facilities = detentionFacilities.results || detentionFacilities;
    const facilitiesArray = Array.isArray(facilities) ? facilities : [];

    for (const facility of facilitiesArray) {
      const output = facility.output || facility;
      if (output.region) {
        // Just ensure region is a non-empty string (specific values vary)
        expect(typeof output.region).toBe('string');
        expect(output.region.length).toBeGreaterThan(0);
      }
    }
  });

  // --- No CPC terminology in any data file ---

  it('no data file uses "CPC" terminology (should be "CCP")', () => {
    const jsonFiles = readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    for (const file of jsonFiles) {
      const content = readFileSync(resolve(DATA_DIR, file), 'utf-8');
      // Check for standalone CPC (not part of other words like "CPCCA")
      const matches = content.match(/\bCPC\b/g);
      expect(
        matches,
        `${file} uses "CPC" terminology — should use "CCP" instead`
      ).toBeNull();
    }
  });

  // --- No empty arrays in key data structures ---

  it('key data files have non-empty content', () => {
    expect(prisoners.results.length, 'Political prisoners should have entries').toBeGreaterThan(0);
    expect(alerts.length, 'Emergency alerts should have entries').toBeGreaterThan(0);
    expect(sanctions.sanctions.length, 'Sanctions tracker should have entries').toBeGreaterThan(0);
    expect(officials.results.length, 'Sanctioned officials should have entries').toBeGreaterThan(0);
    expect(recentUpdates.length, 'Recent updates should have entries').toBeGreaterThan(0);
  });

  // --- Forced labor companies data consistency ---

  it('forced labor companies have unique company names', () => {
    const results = forcedLabor.results || forcedLabor;
    const companies = Array.isArray(results) ? results : [];
    const names = companies.map(c => (c.output || c).company_name || (c.output || c).name).filter(Boolean);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size, 'Company names should be unique').toBe(names.length);
  });

  // --- Cross-file date consistency ---

  it('all date fields across data files use YYYY-MM-DD format', () => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    // Check alerts dates
    for (const alert of alerts) {
      expect(alert.date, `Alert "${alert.id}" date format`).toMatch(datePattern);
      if (alert.eventDate) expect(alert.eventDate, `Alert "${alert.id}" eventDate format`).toMatch(datePattern);
      if (alert.lastVerified) expect(alert.lastVerified, `Alert "${alert.id}" lastVerified format`).toMatch(datePattern);
    }

    // Check recent updates dates
    for (const update of recentUpdates) {
      expect(update.date, `Update "${update.id}" date format`).toMatch(datePattern);
    }

    // Check sanctions dates
    for (const sanction of sanctions.sanctions) {
      if (sanction.date) {
        expect(sanction.date, `Sanction "${sanction.id}" date format`).toMatch(datePattern);
      }
    }
  });
});
