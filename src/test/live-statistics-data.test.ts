import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const DATA_PATH = resolve(__dirname, '../data/live_statistics.json');

describe('Live Statistics data integrity', () => {
  let data: Array<{ id: string; label: string; value: number; source: string; sourceUrl: string; lastVerified: string; decimals?: number; icon?: string; description?: string; trend?: string; color?: string; suffix?: string }>;

  beforeAll(() => {
    expect(existsSync(DATA_PATH)).toBe(true);
    data = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
  });

  it('live_statistics.json exists and is valid JSON array', () => {
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(1);
  });

  it('has exactly 8 statistics', () => {
    expect(data.length).toBe(8);
  });

  it('each statistic has required fields', () => {
    for (const stat of data) {
      expect(stat).toHaveProperty('id');
      expect(stat).toHaveProperty('label');
      expect(stat).toHaveProperty('value');
      expect(stat).toHaveProperty('suffix');
      expect(stat).toHaveProperty('icon');
      expect(stat).toHaveProperty('color');
      expect(stat).toHaveProperty('description');
      expect(stat).toHaveProperty('source');
      expect(stat).toHaveProperty('sourceUrl');
      expect(stat).toHaveProperty('trend');
      expect(stat).toHaveProperty('lastVerified');
      expect(typeof stat.id).toBe('string');
      expect(typeof stat.label).toBe('string');
      expect(typeof stat.value).toBe('number');
      expect(typeof stat.suffix).toBe('string');
      expect(typeof stat.icon).toBe('string');
      expect(typeof stat.color).toBe('string');
      expect(typeof stat.description).toBe('string');
      expect(typeof stat.source).toBe('string');
      expect(typeof stat.sourceUrl).toBe('string');
      expect(typeof stat.trend).toBe('string');
      expect(typeof stat.lastVerified).toBe('string');
    }
  });

  it('statistic IDs are unique', () => {
    const ids = data.map((s: { id: string }) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('statistic values are positive numbers', () => {
    for (const stat of data) {
      expect(stat.value).toBeGreaterThan(0);
    }
  });

  it('colors are from valid palette', () => {
    const validColors = ['red', 'cyan', 'orange', 'yellow', 'blue', 'gray'];
    for (const stat of data) {
      expect(validColors).toContain(stat.color);
    }
  });

  it('source URLs are HTTPS', () => {
    for (const stat of data) {
      expect(stat.sourceUrl).toMatch(/^https:\/\//);
    }
  });

  it('no CCP state media URLs in sources', () => {
    const ccpDomains = ['xinhua', 'cgtn', 'globaltimes', 'chinadaily', 'cctv.com', 'people.com.cn'];
    for (const stat of data) {
      const urlLower = stat.sourceUrl.toLowerCase();
      for (const domain of ccpDomains) {
        expect(urlLower).not.toContain(domain);
      }
    }
  });

  it('lastVerified fields are valid ISO dates', () => {
    for (const stat of data) {
      expect(stat.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const parsed = new Date(stat.lastVerified);
      expect(parsed.toString()).not.toBe('Invalid Date');
    }
  });

  it('descriptions do not use CPC terminology', () => {
    for (const stat of data) {
      const combined = `${stat.label} ${stat.description} ${stat.source} ${stat.trend}`;
      expect(combined).not.toMatch(/\bCPC\b/);
    }
  });

  it('icon values are valid icon names or flag identifiers', () => {
    const validIcons = ['Link', 'Building2', 'ShieldAlert', 'Landmark', 'Plane', 'Newspaper', 'HeartCrack', 'flag-hk'];
    for (const stat of data) {
      expect(validIcons).toContain(stat.icon);
    }
  });

  it('decimals field is a non-negative integer when present', () => {
    for (const stat of data) {
      if (stat.decimals !== undefined) {
        expect(Number.isInteger(stat.decimals)).toBe(true);
        expect(stat.decimals).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('includes key statistics: political prisoners, Uyghurs, police stations, organ harvesting', () => {
    const ids = data.map((s: { id: string }) => s.id);
    expect(ids).toContain('prisoners');
    expect(ids).toContain('uyghurs');
    expect(ids).toContain('police-stations');
    expect(ids).toContain('organ-harvesting');
  });
});
