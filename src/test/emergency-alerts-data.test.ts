import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const DATA_PATH = resolve(__dirname, '../data/emergency_alerts.json');

describe('Emergency Alerts data integrity', () => {
  let data: Array<{ id: string; type: string; title: string; summary: string; date: string; active: boolean; links?: { name: string; url: string }[] }>;

  beforeAll(() => {
    expect(existsSync(DATA_PATH)).toBe(true);
    data = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
  });

  it('emergency_alerts.json exists and is valid JSON array', () => {
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(1);
  });

  it('each alert has required fields', () => {
    for (const alert of data) {
      expect(alert).toHaveProperty('id');
      expect(alert).toHaveProperty('type');
      expect(alert).toHaveProperty('title');
      expect(alert).toHaveProperty('summary');
      expect(alert).toHaveProperty('details');
      expect(alert).toHaveProperty('date');
      expect(alert).toHaveProperty('links');
      expect(alert).toHaveProperty('active');
      expect(typeof alert.id).toBe('string');
      expect(typeof alert.title).toBe('string');
      expect(typeof alert.summary).toBe('string');
      expect(typeof alert.details).toBe('string');
      expect(typeof alert.date).toBe('string');
      expect(typeof alert.active).toBe('boolean');
      expect(Array.isArray(alert.links)).toBe(true);
    }
  });

  it('alert types are valid', () => {
    const validTypes = ['critical', 'warning', 'info'];
    for (const alert of data) {
      expect(validTypes).toContain(alert.type);
    }
  });

  it('alert dates are valid ISO format (YYYY-MM-DD)', () => {
    for (const alert of data) {
      expect(alert.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const parsed = new Date(alert.date);
      expect(parsed.toString()).not.toBe('Invalid Date');
    }
  });

  it('alert IDs are unique', () => {
    const ids = data.map((a: { id: string }) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each link has name and url', () => {
    for (const alert of data) {
      for (const link of alert.links) {
        expect(link).toHaveProperty('name');
        expect(link).toHaveProperty('url');
        expect(typeof link.name).toBe('string');
        expect(typeof link.url).toBe('string');
        expect(link.url).toMatch(/^https?:\/\//);
      }
    }
  });

  it('no CCP state media URLs in alert links', () => {
    const ccpDomains = ['xinhua', 'cgtn', 'globaltimes', 'chinadaily', 'cctv.com', 'people.com.cn'];
    for (const alert of data) {
      for (const link of alert.links) {
        const urlLower = link.url.toLowerCase();
        for (const domain of ccpDomains) {
          expect(urlLower).not.toContain(domain);
        }
      }
    }
  });

  it('has at least one critical alert', () => {
    const criticals = data.filter((a: { type: string }) => a.type === 'critical');
    expect(criticals.length).toBeGreaterThanOrEqual(1);
  });

  it('no alert uses CPC terminology', () => {
    for (const alert of data) {
      const combined = `${alert.title} ${alert.summary} ${alert.details}`;
      expect(combined).not.toMatch(/\bCPC\b/);
    }
  });

  it('expires field is valid ISO date format when present', () => {
    for (const alert of data) {
      if (alert.expires) {
        expect(alert.expires).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        const parsed = new Date(alert.expires);
        expect(parsed.toString()).not.toBe('Invalid Date');
      }
    }
  });

  it('lastVerified field is valid ISO date format when present', () => {
    for (const alert of data) {
      if (alert.lastVerified) {
        expect(alert.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        const parsed = new Date(alert.lastVerified);
        expect(parsed.toString()).not.toBe('Invalid Date');
      }
    }
  });

  it('expires date is after the alert date when present', () => {
    for (const alert of data) {
      if (alert.expires) {
        expect(alert.expires > alert.date).toBe(true);
      }
    }
  });

  it('ongoing critical alerts without expiry have lastVerified', () => {
    for (const alert of data) {
      if (alert.type === 'critical' && !alert.expires) {
        expect(alert.lastVerified).toBeDefined();
      }
    }
  });

  it('no alerts have hashtags field (removed as performative activism)', () => {
    for (const alert of data) {
      expect(alert.hashtags).toBeUndefined();
    }
  });

  it('eventDate field is valid ISO date format when present', () => {
    for (const alert of data) {
      if (alert.eventDate) {
        expect(alert.eventDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        const parsed = new Date(alert.eventDate);
        expect(parsed.toString()).not.toBe('Invalid Date');
      }
    }
  });
});
