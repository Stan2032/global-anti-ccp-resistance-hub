import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { isCCPStateMedia } from '../utils/sourceLinks.js';

const DATA_DIR = resolve(__dirname, '../data');

describe('Timeline Events Data Integrity', () => {
  let events;

  beforeAll(() => {
    events = JSON.parse(readFileSync(resolve(DATA_DIR, 'timeline_events.json'), 'utf-8'));
  });

  describe('Structure validation', () => {
    it('has at least 20 timeline events', () => {
      expect(events.length).toBeGreaterThanOrEqual(20);
    });

    it('every event has required fields', () => {
      const requiredFields = ['id', 'date', 'title', 'category', 'significance', 'description', 'details', 'sources'];
      for (const event of events) {
        for (const field of requiredFields) {
          expect(event[field], `Event ${event.id} "${event.title}" missing "${field}"`).toBeDefined();
        }
      }
    });

    it('every event has a non-empty title', () => {
      for (const event of events) {
        expect(event.title.length, `Event ${event.id} has empty title`).toBeGreaterThan(0);
      }
    });

    it('every event has a non-empty description', () => {
      for (const event of events) {
        expect(event.description.length, `Event ${event.id} has empty description`).toBeGreaterThan(0);
      }
    });

    it('every event has at least one source', () => {
      for (const event of events) {
        expect(event.sources.length, `Event ${event.id} "${event.title}" has no sources`).toBeGreaterThanOrEqual(1);
      }
    });

    it('all IDs are unique', () => {
      const ids = events.map(e => e.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('Date validation', () => {
    it('all dates are in YYYY-MM-DD format', () => {
      for (const event of events) {
        expect(event.date, `Event ${event.id} has invalid date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it('all dates parse to valid Date objects', () => {
      for (const event of events) {
        const d = new Date(event.date);
        expect(isNaN(d.getTime()), `Event ${event.id} date "${event.date}" is not a valid date`).toBe(false);
      }
    });

    it('events are in chronological order', () => {
      for (let i = 1; i < events.length; i++) {
        const prev = new Date(events[i - 1].date);
        const curr = new Date(events[i].date);
        expect(
          curr.getTime(),
          `Event ${events[i].id} "${events[i].title}" (${events[i].date}) is before event ${events[i - 1].id} "${events[i - 1].title}" (${events[i - 1].date})`
        ).toBeGreaterThanOrEqual(prev.getTime());
      }
    });
  });

  describe('Category validation', () => {
    const validCategories = ['mainland', 'hongkong', 'uyghur', 'tibet', 'falungong', 'global'];

    it('all events use valid categories', () => {
      for (const event of events) {
        expect(
          validCategories,
          `Event ${event.id} "${event.title}" has invalid category: "${event.category}"`
        ).toContain(event.category);
      }
    });

    it('has events from at least 4 different categories', () => {
      const categories = new Set(events.map(e => e.category));
      expect(categories.size).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Significance validation', () => {
    const validSignificance = ['critical', 'high', 'medium'];

    it('all events use valid significance levels', () => {
      for (const event of events) {
        expect(
          validSignificance,
          `Event ${event.id} "${event.title}" has invalid significance: "${event.significance}"`
        ).toContain(event.significance);
      }
    });

    it('at least half of events are critical significance', () => {
      const critical = events.filter(e => e.significance === 'critical');
      expect(critical.length).toBeGreaterThanOrEqual(Math.floor(events.length / 2));
    });
  });

  describe('Source integrity', () => {
    it('no event cites CCP state media as a source', () => {
      for (const event of events) {
        for (const source of event.sources) {
          expect(
            isCCPStateMedia(source),
            `Event ${event.id} "${event.title}" cites CCP state media: "${source}"`
          ).toBe(false);
        }
      }
    });

    it('no source URL contains CCP state media domains', () => {
      for (const event of events) {
        for (const source of event.sources) {
          expect(
            isCCPStateMedia(source),
            `Event ${event.id} "${event.title}" source contains CCP media reference: "${source}"`
          ).toBe(false);
        }
      }
    });
  });

  describe('Key historical events are present', () => {
    it('includes Tiananmen Square Massacre (1989)', () => {
      const event = events.find(e => e.title === 'Tiananmen Square Massacre');
      expect(event).toBeDefined();
      expect(event.date).toBe('1989-06-04');
      expect(event.category).toBe('mainland');
      expect(event.significance).toBe('critical');
    });

    it('includes National Security Law (2020)', () => {
      const event = events.find(e => e.title === 'National Security Law Imposed');
      expect(event).toBeDefined();
      expect(event.date).toBe('2020-06-30');
      expect(event.category).toBe('hongkong');
    });

    it('includes Xinjiang Internment Camps (2017)', () => {
      const event = events.find(e => e.title === 'Xinjiang Internment Camps Begin');
      expect(event).toBeDefined();
      expect(event.date).toBe('2017-04-01');
      expect(event.category).toBe('uyghur');
    });

    it('includes Panchen Lama abduction (1995)', () => {
      const event = events.find(e => e.title === 'Panchen Lama Abducted');
      expect(event).toBeDefined();
      expect(event.date).toBe('1995-05-17');
      expect(event.category).toBe('tibet');
    });

    it('includes Falun Gong persecution (1999)', () => {
      const event = events.find(e => e.title === 'Falun Gong Persecution Begins');
      expect(event).toBeDefined();
      expect(event.date).toBe('1999-07-20');
      expect(event.category).toBe('falungong');
    });

    it('includes Jimmy Lai sentencing (2026)', () => {
      const event = events.find(e => e.title === 'Jimmy Lai Sentenced to 20 Years');
      expect(event).toBeDefined();
      expect(event.date).toBe('2026-02-09');
      expect(event.sentence).toBe('20 years imprisonment');
    });

    it('includes Hong Kong 47 sentencing (2024)', () => {
      const event = events.find(e => e.title === 'Hong Kong 47 Sentenced');
      expect(event).toBeDefined();
      expect(event.date).toBe('2024-11-19');
    });

    it('includes Umbrella Movement (2014)', () => {
      const event = events.find(e => e.title === 'Umbrella Movement Begins');
      expect(event).toBeDefined();
      expect(event.date).toBe('2014-09-28');
      expect(event.category).toBe('hongkong');
    });

    it('includes 2019 Hong Kong protests', () => {
      const event = events.find(e => e.title === '2019 Hong Kong Protests Begin');
      expect(event).toBeDefined();
      expect(event.date).toBe('2019-06-09');
    });

    it('includes White Paper Protests (2022)', () => {
      const event = events.find(e => e.title === 'White Paper Protests');
      expect(event).toBeDefined();
      expect(event.date).toBe('2022-11-26');
      expect(event.category).toBe('mainland');
    });

    it('includes Hong Kong Handover (1997)', () => {
      const event = events.find(e => e.title === 'Hong Kong Handover');
      expect(event).toBeDefined();
      expect(event.date).toBe('1997-07-01');
      expect(event.category).toBe('hongkong');
      expect(event.significance).toBe('critical');
    });
  });
});
