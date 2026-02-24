import { describe, it, expect } from 'vitest';
import { CCP_TACTICS } from '../data/ccpTactics.js';
import { isCCPStateMedia, CCP_NEVER_CITE } from '../utils/sourceLinks.js';

// Use the shared CCP_NEVER_CITE registry — single source of truth

describe('CCP Tactics Data Integrity', () => {
  describe('Top-level structure', () => {
    it('exports CCP_TACTICS object', () => {
      expect(CCP_TACTICS).toBeDefined();
      expect(typeof CCP_TACTICS).toBe('object');
    });

    it('has at least 4 tactic categories', () => {
      expect(Object.keys(CCP_TACTICS).length).toBeGreaterThanOrEqual(4);
    });

    it('includes core categories: domestic repression, transnational repression, influence operations', () => {
      expect(CCP_TACTICS).toHaveProperty('domesticRepression');
      expect(CCP_TACTICS).toHaveProperty('transnationalRepression');
      expect(CCP_TACTICS).toHaveProperty('influenceOperations');
    });
  });

  describe('Category structure', () => {
    it('each category has title, description, and tactics array', () => {
      for (const [key, category] of Object.entries(CCP_TACTICS)) {
        expect(category.title, `${key} missing title`).toBeDefined();
        expect(category.description, `${key} missing description`).toBeDefined();
        expect(Array.isArray(category.tactics), `${key}.tactics should be an array`).toBe(true);
      }
    });

    it('each category has at least 2 tactics', () => {
      for (const [key, category] of Object.entries(CCP_TACTICS)) {
        if (category.tactics) {
          expect(
            category.tactics.length,
            `${key} has too few tactics`
          ).toBeGreaterThanOrEqual(2);
        }
      }
    });
  });

  describe('Tactic entries', () => {
    const allTactics = Object.entries(CCP_TACTICS)
      .filter(([, cat]) => cat.tactics)
      .flatMap(([catKey, cat]) => cat.tactics.map(t => ({ ...t, category: catKey })));

    it('each tactic has name, description, examples, and sources', () => {
      for (const tactic of allTactics) {
        expect(tactic.name, `Tactic in ${tactic.category} missing name`).toBeDefined();
        expect(tactic.description, `${tactic.name} missing description`).toBeDefined();
        expect(Array.isArray(tactic.examples), `${tactic.name} examples should be array`).toBe(true);
        expect(Array.isArray(tactic.sources), `${tactic.name} sources should be array`).toBe(true);
      }
    });

    it('each tactic has at least 1 example', () => {
      for (const tactic of allTactics) {
        expect(
          tactic.examples.length,
          `${tactic.name} has no examples`
        ).toBeGreaterThan(0);
      }
    });

    it('each tactic has at least 1 source', () => {
      for (const tactic of allTactics) {
        expect(
          tactic.sources.length,
          `${tactic.name} has no sources`
        ).toBeGreaterThan(0);
      }
    });

    it('no tactic cites CCP state media as a source', () => {
      for (const tactic of allTactics) {
        for (const source of tactic.sources) {
          expect(
            isCCPStateMedia(source),
            `${tactic.name} cites CCP media: "${source}"`
          ).toBe(false);
        }
      }
    });
  });

  describe('Key domestic repression tactics', () => {
    it('documents mass surveillance', () => {
      const tactic = CCP_TACTICS.domesticRepression.tactics
        .find(t => t.name.toLowerCase().includes('surveillance'));
      expect(tactic, 'Mass surveillance tactic not found').toBeDefined();
    });

    it('documents arbitrary detention', () => {
      const tactic = CCP_TACTICS.domesticRepression.tactics
        .find(t => t.name.toLowerCase().includes('detention'));
      expect(tactic, 'Arbitrary detention tactic not found').toBeDefined();
    });

    it('documents forced organ harvesting', () => {
      const tactic = CCP_TACTICS.domesticRepression.tactics
        .find(t => t.name.toLowerCase().includes('organ'));
      expect(tactic, 'Forced organ harvesting tactic not found').toBeDefined();
    });

    it('documents internet censorship', () => {
      const tactic = CCP_TACTICS.domesticRepression.tactics
        .find(t => t.name.toLowerCase().includes('censor'));
      expect(tactic, 'Internet censorship tactic not found').toBeDefined();
    });

    it('documents religious persecution', () => {
      const tactic = CCP_TACTICS.domesticRepression.tactics
        .find(t => t.name.toLowerCase().includes('religio'));
      expect(tactic, 'Religious persecution tactic not found').toBeDefined();
    });
  });

  describe('Transnational repression', () => {
    it('includes overseas police stations', () => {
      const tactic = CCP_TACTICS.transnationalRepression.tactics
        .find(t => t.name.toLowerCase().includes('police'));
      expect(tactic, 'Overseas police stations tactic not found').toBeDefined();
    });
  });
});
