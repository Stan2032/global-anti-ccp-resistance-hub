import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const DATA_PATH = resolve(__dirname, '../data/security_center_data.json');

describe('Security Center Data Integrity', () => {
  let data;

  beforeAll(() => {
    data = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
  });

  describe('Top-level structure', () => {
    it('has all 5 required sections', () => {
      const requiredSections = [
        'securityTools', 'connectionTestTools',
        'assessmentQuestions', 'emergencyContacts', 'securityGuides'
      ];
      for (const section of requiredSections) {
        expect(data, `Missing section: ${section}`).toHaveProperty(section);
        expect(Array.isArray(data[section]), `${section} should be an array`).toBe(true);
      }
    });
  });

  describe('securityTools', () => {
    it('has at least 5 tools', () => {
      expect(data.securityTools.length).toBeGreaterThanOrEqual(5);
    });

    it('each tool has required fields', () => {
      for (const tool of data.securityTools) {
        expect(tool.id, `Tool missing id`).toBeDefined();
        expect(tool.name, `Tool ${tool.id} missing name`).toBeDefined();
        expect(tool.description, `${tool.name} missing description`).toBeDefined();
        expect(tool.status, `${tool.name} missing status`).toBeDefined();
        expect(tool.download, `${tool.name} missing download URL`).toBeDefined();
        expect(tool.features, `${tool.name} missing features`).toBeDefined();
      }
    });

    it('all download URLs are HTTPS', () => {
      for (const tool of data.securityTools) {
        expect(
          tool.download.startsWith('https://'),
          `${tool.name} download URL not HTTPS: ${tool.download}`
        ).toBe(true);
      }
    });

    it('status is either essential or advanced', () => {
      for (const tool of data.securityTools) {
        expect(
          ['essential', 'advanced'],
          `${tool.name} has invalid status: ${tool.status}`
        ).toContain(tool.status);
      }
    });

    it('features is a non-empty array', () => {
      for (const tool of data.securityTools) {
        expect(Array.isArray(tool.features)).toBe(true);
        expect(tool.features.length, `${tool.name} has no features`).toBeGreaterThan(0);
      }
    });

    it('includes essential privacy tools (Tor, VPN, Signal)', () => {
      const names = data.securityTools.map(t => t.name.toLowerCase());
      const essentialTools = ['tor', 'vpn', 'signal'];
      for (const tool of essentialTools) {
        expect(
          names.some(n => n.includes(tool)),
          `Missing essential tool containing "${tool}"`
        ).toBe(true);
      }
    });
  });

  describe('connectionTestTools', () => {
    it('has at least 3 tools', () => {
      expect(data.connectionTestTools.length).toBeGreaterThanOrEqual(3);
    });

    it('each tool has required fields', () => {
      for (const tool of data.connectionTestTools) {
        expect(tool.id, 'Missing id').toBeDefined();
        expect(tool.name, 'Missing name').toBeDefined();
        expect(tool.url, `${tool.name} missing url`).toBeDefined();
        expect(tool.description, `${tool.name} missing description`).toBeDefined();
      }
    });

    it('all URLs are HTTPS', () => {
      for (const tool of data.connectionTestTools) {
        expect(
          tool.url.startsWith('https://'),
          `${tool.name} URL not HTTPS: ${tool.url}`
        ).toBe(true);
      }
    });
  });

  describe('assessmentQuestions', () => {
    it('has at least 5 questions', () => {
      expect(data.assessmentQuestions.length).toBeGreaterThanOrEqual(5);
    });

    it('each question has required fields', () => {
      for (const q of data.assessmentQuestions) {
        expect(q.id, 'Question missing id').toBeDefined();
        expect(q.question, `Question ${q.id} missing text`).toBeDefined();
        expect(q.category, `Question ${q.id} missing category`).toBeDefined();
        expect(q.weight, `Question ${q.id} missing weight`).toBeDefined();
      }
    });

    it('all question IDs are unique', () => {
      const ids = data.assessmentQuestions.map(q => q.id);
      const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
      expect(dupes, `Duplicate question IDs: ${dupes.join(', ')}`).toEqual([]);
    });

    it('weights are positive numbers', () => {
      for (const q of data.assessmentQuestions) {
        expect(typeof q.weight).toBe('number');
        expect(q.weight, `Question ${q.id} has non-positive weight`).toBeGreaterThan(0);
      }
    });
  });

  describe('emergencyContacts', () => {
    it('has at least 3 contacts', () => {
      expect(data.emergencyContacts.length).toBeGreaterThanOrEqual(3);
    });

    it('each contact has required fields', () => {
      for (const contact of data.emergencyContacts) {
        expect(contact.id, 'Contact missing id').toBeDefined();
        expect(contact.name, 'Contact missing name').toBeDefined();
        expect(contact.type, `${contact.name} missing type`).toBeDefined();
        expect(contact.contact, `${contact.name} missing contact info`).toBeDefined();
        expect(contact.description, `${contact.name} missing description`).toBeDefined();
      }
    });
  });

  describe('securityGuides', () => {
    it('has at least 4 guides', () => {
      expect(data.securityGuides.length).toBeGreaterThanOrEqual(4);
    });

    it('each guide has required fields', () => {
      for (const guide of data.securityGuides) {
        expect(guide.id, 'Guide missing id').toBeDefined();
        expect(guide.title, `Guide ${guide.id} missing title`).toBeDefined();
        expect(guide.topics, `${guide.title} missing topics`).toBeDefined();
        expect(guide.difficulty, `${guide.title} missing difficulty`).toBeDefined();
      }
    });

    it('difficulty is a valid level', () => {
      const validLevels = ['beginner', 'intermediate', 'advanced'];
      for (const guide of data.securityGuides) {
        expect(
          validLevels,
          `${guide.title} has invalid difficulty: ${guide.difficulty}`
        ).toContain(guide.difficulty.toLowerCase());
      }
    });

    it('topics is a non-empty array', () => {
      for (const guide of data.securityGuides) {
        expect(Array.isArray(guide.topics)).toBe(true);
        expect(guide.topics.length, `${guide.title} has no topics`).toBeGreaterThan(0);
      }
    });
  });
});
