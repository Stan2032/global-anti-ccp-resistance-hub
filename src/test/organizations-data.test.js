import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const dataPath = resolve(__dirname, '../../organizations-data.json');
const rawData = readFileSync(dataPath, 'utf-8');
const data = JSON.parse(rawData);

describe('organizations-data.json', () => {
  it('has an organizations array', () => {
    expect(data).toHaveProperty('organizations');
    expect(Array.isArray(data.organizations)).toBe(true);
  });

  it('contains at least 20 organizations', () => {
    expect(data.organizations.length).toBeGreaterThanOrEqual(20);
  });

  it('each organization has required fields', () => {
    for (const org of data.organizations) {
      expect(org).toHaveProperty('id');
      expect(org).toHaveProperty('name');
      expect(org).toHaveProperty('category');
      expect(typeof org.id).toBe('string');
      expect(typeof org.name).toBe('string');
      expect(org.id.length).toBeGreaterThan(0);
      expect(org.name.length).toBeGreaterThan(0);
    }
  });

  it('has no duplicate organization ids', () => {
    const ids = data.organizations.map((o) => o.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('each organization with a website has a valid URL', () => {
    for (const org of data.organizations) {
      if (org.website) {
        expect(org.website).toMatch(/^https?:\/\//);
      }
    }
  });
});
