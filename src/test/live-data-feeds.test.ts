import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const DATA_PATH = resolve(__dirname, '../data/live_data_feeds.json');

describe('Live Data Feeds JSON integrity', () => {
  let data: Record<string, Array<{ id: string; name: string; url: string; credibility?: string; sources?: string[]; description?: string; category?: string; region?: string; updateFrequency?: string; biasRisk?: string; methodology?: string; note?: string }>>;

  beforeAll(() => {
    expect(existsSync(DATA_PATH)).toBe(true);
    data = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
  });

  it('live_data_feeds.json exists and has required top-level keys', () => {
    expect(data).toHaveProperty('newsFeeds');
    expect(data).toHaveProperty('humanRightsFeeds');
    expect(data).toHaveProperty('researchFeeds');
    expect(data).toHaveProperty('surveillanceMonitoring');
    expect(Array.isArray(data.newsFeeds)).toBe(true);
    expect(Array.isArray(data.humanRightsFeeds)).toBe(true);
    expect(Array.isArray(data.researchFeeds)).toBe(true);
    expect(Array.isArray(data.surveillanceMonitoring)).toBe(true);
  });

  it('has at least 6 news feeds', () => {
    expect(data.newsFeeds.length).toBeGreaterThanOrEqual(6);
  });

  it('has at least 2 human rights feeds', () => {
    expect(data.humanRightsFeeds.length).toBeGreaterThanOrEqual(2);
  });

  it('each news feed has required fields', () => {
    for (const feed of data.newsFeeds) {
      expect(feed).toHaveProperty('id');
      expect(feed).toHaveProperty('name');
      expect(feed).toHaveProperty('url');
      expect(feed).toHaveProperty('description');
      expect(feed).toHaveProperty('category');
      expect(feed).toHaveProperty('region');
      expect(feed).toHaveProperty('credibility');
      expect(typeof feed.id).toBe('string');
      expect(typeof feed.name).toBe('string');
      expect(typeof feed.url).toBe('string');
    }
  });

  it('each human rights feed has required fields', () => {
    for (const feed of data.humanRightsFeeds) {
      expect(feed).toHaveProperty('id');
      expect(feed).toHaveProperty('name');
      expect(feed).toHaveProperty('url');
      expect(feed).toHaveProperty('credibility');
      expect(typeof feed.id).toBe('string');
      expect(typeof feed.url).toBe('string');
    }
  });

  it('all feed URLs use https', () => {
    const allFeeds = [...data.newsFeeds, ...data.humanRightsFeeds, ...data.researchFeeds];
    for (const feed of allFeeds) {
      expect(feed.url).toMatch(/^https:\/\//);
    }
  });

  it('all feed IDs are unique', () => {
    const allFeeds = [
      ...data.newsFeeds,
      ...data.humanRightsFeeds,
      ...data.researchFeeds,
      ...data.surveillanceMonitoring,
    ];
    const ids = allFeeds.map(f => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('credibility values are valid', () => {
    const validCredibility = ['high', 'medium', 'low'];
    const allFeeds = [
      ...data.newsFeeds,
      ...data.humanRightsFeeds,
      ...data.researchFeeds,
      ...data.surveillanceMonitoring,
    ];
    for (const feed of allFeeds) {
      expect(validCredibility).toContain(feed.credibility);
    }
  });

  it('each feed has at least one source', () => {
    const allFeeds = [
      ...data.newsFeeds,
      ...data.humanRightsFeeds,
      ...data.researchFeeds,
      ...data.surveillanceMonitoring,
    ];
    for (const feed of allFeeds) {
      expect(feed).toHaveProperty('sources');
      expect(Array.isArray(feed.sources)).toBe(true);
      expect(feed.sources!.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('does not contain CPC terminology', () => {
    const json = JSON.stringify(data);
    expect(json).not.toContain('"CPC"');
    expect(json).not.toContain('Communist Party of China');
  });
});
