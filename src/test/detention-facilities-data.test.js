import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const DATA_DIR = resolve(__dirname, '../data');
const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'detention_facilities_research.json'), 'utf-8'));

describe('Detention facilities data integrity', () => {
  describe('regional research entries', () => {
    it('has at least 15 regional research entries', () => {
      expect(data.results.length).toBeGreaterThanOrEqual(15);
    });

    it('each entry has required output fields', () => {
      for (const result of data.results) {
        expect(result.output).toBeDefined();
        expect(result.output.region).toBeTruthy();
        expect(result.output.facility_count).toBeDefined();
      }
    });

    it('at least 80% of entries have source_url', () => {
      const withUrl = data.results.filter(r => r.output && r.output.source_url);
      expect(withUrl.length / data.results.length).toBeGreaterThanOrEqual(0.8);
    });

    it('all source_url values use HTTPS', () => {
      for (const result of data.results) {
        if (result.output && result.output.source_url) {
          expect(result.output.source_url).toMatch(/^https:\/\//);
        }
      }
    });
  });

  describe('individual facility records', () => {
    it('has facilities array', () => {
      expect(data.facilities).toBeDefined();
      expect(Array.isArray(data.facilities)).toBe(true);
    });

    it('has at least 10 individual facilities', () => {
      expect(data.facilities.length).toBeGreaterThanOrEqual(10);
    });

    it('each facility has required fields', () => {
      for (const facility of data.facilities) {
        expect(facility.id).toBeTruthy();
        expect(facility.name).toBeTruthy();
        expect(facility.type).toBeTruthy();
        expect(facility.region).toBeTruthy();
        expect(facility.city).toBeTruthy();
        expect(facility.status).toBeTruthy();
        expect(facility.description).toBeTruthy();
        expect(facility.estimated_capacity).toBeTruthy();
        expect(facility.first_documented).toBeTruthy();
      }
    });

    it('each facility has evidence array with at least 1 item', () => {
      for (const facility of data.facilities) {
        expect(Array.isArray(facility.evidence)).toBe(true);
        expect(facility.evidence.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('each facility has sources array with at least 1 item', () => {
      for (const facility of data.facilities) {
        expect(Array.isArray(facility.sources)).toBe(true);
        expect(facility.sources.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('facility IDs are unique', () => {
      const ids = data.facilities.map(f => f.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('covers at least 3 distinct regions', () => {
      const regions = new Set(data.facilities.map(f => f.region));
      expect(regions.size).toBeGreaterThanOrEqual(3);
    });

    it('includes expected key regions', () => {
      const regions = new Set(data.facilities.map(f => f.region));
      expect(regions.has('Xinjiang')).toBe(true);
      expect(regions.has('Tibet')).toBe(true);
      expect(regions.has('Hong Kong')).toBe(true);
    });

    it('coordinates are valid when present', () => {
      for (const facility of data.facilities) {
        if (facility.coordinates) {
          expect(facility.coordinates.lat).toBeGreaterThanOrEqual(-90);
          expect(facility.coordinates.lat).toBeLessThanOrEqual(90);
          expect(facility.coordinates.lng).toBeGreaterThanOrEqual(-180);
          expect(facility.coordinates.lng).toBeLessThanOrEqual(180);
        }
      }
    });

    it('satellite image URLs use HTTPS when present', () => {
      for (const facility of data.facilities) {
        if (facility.satellite_image_url) {
          expect(facility.satellite_image_url).toMatch(/^https:\/\//);
        }
      }
    });

    it('facility types match expected categories', () => {
      const validTypes = ['Internment Camp', 'Prison', 'Detention Center', 'Maximum Security Prison', 'Secret Detention'];
      for (const facility of data.facilities) {
        expect(validTypes, `Unknown type: ${facility.type}`).toContain(facility.type);
      }
    });
  });
});
