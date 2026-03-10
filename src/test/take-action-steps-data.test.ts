import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const DATA_PATH = resolve(__dirname, '../data/take_action_steps.json');

describe('Take Action Steps data integrity', () => {
  let data: any;

  beforeAll(() => {
    expect(existsSync(DATA_PATH)).toBe(true);
    data = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
  });

  it('take_action_steps.json exists and is valid JSON array', () => {
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(5);
  });

  it('each action has required fields', () => {
    for (const action of data) {
      expect(action).toHaveProperty('number');
      expect(action).toHaveProperty('title');
      expect(action).toHaveProperty('icon');
      expect(action).toHaveProperty('color');
      expect(action).toHaveProperty('description');
      expect(action).toHaveProperty('links');
      expect(typeof action.number).toBe('number');
      expect(typeof action.title).toBe('string');
      expect(typeof action.icon).toBe('string');
      expect(typeof action.description).toBe('string');
      expect(Array.isArray(action.links)).toBe(true);
    }
  });

  it('actions are numbered sequentially starting from 1', () => {
    data.forEach((action: any, index: number) => {
      expect(action.number).toBe(index + 1);
    });
  });

  it('each link has name and url', () => {
    for (const action of data) {
      for (const link of action.links) {
        expect(link).toHaveProperty('name');
        expect(link).toHaveProperty('url');
        expect(typeof link.name).toBe('string');
        expect(typeof link.url).toBe('string');
      }
    }
  });

  it('icon names are valid lucide-react icon names', () => {
    const validIcons = ['Heart', 'Landmark', 'PenLine', 'Ban', 'AlertTriangle', 'Megaphone', 'Handshake', 'Shield'];
    for (const action of data) {
      expect(validIcons).toContain(action.icon);
    }
  });

  it('external links have https URLs', () => {
    for (const action of data) {
      for (const link of action.links) {
        if (!link.internal && !link.action && link.url !== '#newsletter') {
          expect(link.url.startsWith('https://') || link.url === '#').toBe(true);
        }
      }
    }
  });

  it('internal links start with /', () => {
    for (const action of data) {
      for (const link of action.links) {
        if (link.internal) {
          expect(link.url.startsWith('/')).toBe(true);
        }
      }
    }
  });

  it('does not contain CPC terminology', () => {
    const json = JSON.stringify(data);
    expect(json).not.toContain('"CPC"');
    expect(json).not.toContain('Communist Party of China');
  });
});
