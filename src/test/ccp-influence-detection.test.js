import { describe, it, expect } from 'vitest';
import {
  CCP_NEVER_CITE,
  CCP_ELEVATED_RISK,
  isCCPStateMedia,
  isCCPDomain,
  getCCPInfluenceRisk,
  assessSourceRisk
} from '../utils/sourceLinks.js';

describe('CCP Influence Detection System', () => {
  describe('CCP_NEVER_CITE registry', () => {
    it('has at least 15 CCP state media names', () => {
      expect(CCP_NEVER_CITE.names.length).toBeGreaterThanOrEqual(15);
    });

    it('has at least 10 CCP domains', () => {
      expect(CCP_NEVER_CITE.domains.length).toBeGreaterThanOrEqual(10);
    });

    it('includes all core CCP outlets', () => {
      const required = ['xinhua', 'cgtn', 'global times', "people's daily", 'china daily', 'cctv'];
      for (const outlet of required) {
        expect(
          CCP_NEVER_CITE.names.includes(outlet),
          `Missing required CCP outlet: ${outlet}`
        ).toBe(true);
      }
    });

    it('includes Hong Kong pro-Beijing press', () => {
      const hkOutlets = ['ta kung pao', 'wen wei po'];
      for (const outlet of hkOutlets) {
        expect(
          CCP_NEVER_CITE.names.includes(outlet),
          `Missing HK pro-Beijing outlet: ${outlet}`
        ).toBe(true);
      }
    });

    it('all names are lowercase', () => {
      for (const name of CCP_NEVER_CITE.names) {
        expect(name).toBe(name.toLowerCase());
      }
    });

    it('all domains are lowercase without protocol', () => {
      for (const domain of CCP_NEVER_CITE.domains) {
        expect(domain).toBe(domain.toLowerCase());
        expect(domain).not.toContain('http');
      }
    });
  });

  describe('CCP_ELEVATED_RISK registry', () => {
    it('has at least 10 elevated risk entries', () => {
      expect(CCP_ELEVATED_RISK.length).toBeGreaterThanOrEqual(10);
    });

    it('each entry has required fields', () => {
      for (const entry of CCP_ELEVATED_RISK) {
        expect(entry.name, `Entry missing name`).toBeDefined();
        expect(entry.category, `${entry.name} missing category`).toBeDefined();
        expect(entry.risk, `${entry.name} missing risk`).toBeDefined();
        expect(entry.reason, `${entry.name} missing reason`).toBeDefined();
        expect(entry.source, `${entry.name} missing source attribution`).toBeDefined();
      }
    });

    it('covers proxy media category', () => {
      const proxies = CCP_ELEVATED_RISK.filter(e => e.category === 'ccp_proxy_media');
      expect(proxies.length).toBeGreaterThanOrEqual(3);
    });

    it('covers united front category', () => {
      const uf = CCP_ELEVATED_RISK.filter(e => e.category === 'united_front');
      expect(uf.length).toBeGreaterThanOrEqual(2);
    });

    it('covers CCP think tanks', () => {
      const tanks = CCP_ELEVATED_RISK.filter(e => e.category === 'ccp_think_tank');
      expect(tanks.length).toBeGreaterThanOrEqual(3);
    });

    it('covers Confucius Institute publications', () => {
      const ci = CCP_ELEVATED_RISK.filter(e => e.category === 'confucius_institute');
      expect(ci.length).toBeGreaterThanOrEqual(1);
    });

    it('risk levels are valid', () => {
      const validRisks = ['medium', 'high'];
      for (const entry of CCP_ELEVATED_RISK) {
        expect(
          validRisks.includes(entry.risk),
          `${entry.name} has invalid risk: ${entry.risk}`
        ).toBe(true);
      }
    });

    it('every entry has a verifiable source attribution', () => {
      for (const entry of CCP_ELEVATED_RISK) {
        expect(entry.source.length).toBeGreaterThan(5);
        // Source should not itself be CCP media
        expect(
          isCCPStateMedia(entry.source),
          `${entry.name} source attribution cites CCP media: ${entry.source}`
        ).toBe(false);
      }
    });
  });

  describe('isCCPStateMedia()', () => {
    it('detects Xinhua', () => {
      expect(isCCPStateMedia('Xinhua')).toBe(true);
      expect(isCCPStateMedia('xinhua news agency')).toBe(true);
    });

    it('detects CGTN', () => {
      expect(isCCPStateMedia('CGTN')).toBe(true);
      expect(isCCPStateMedia('cgtn.com/article')).toBe(true);
    });

    it('detects Global Times', () => {
      expect(isCCPStateMedia('Global Times')).toBe(true);
      expect(isCCPStateMedia('globaltimes.cn')).toBe(true);
    });

    it('detects People\'s Daily', () => {
      expect(isCCPStateMedia("People's Daily")).toBe(true);
      expect(isCCPStateMedia('people.com.cn')).toBe(true);
    });

    it('detects China Daily', () => {
      expect(isCCPStateMedia('China Daily')).toBe(true);
    });

    it('detects CCTV', () => {
      expect(isCCPStateMedia('CCTV')).toBe(true);
      expect(isCCPStateMedia('cctv.com')).toBe(true);
    });

    it('detects Hong Kong pro-Beijing press', () => {
      expect(isCCPStateMedia('Ta Kung Pao')).toBe(true);
      expect(isCCPStateMedia('Wen Wei Po')).toBe(true);
    });

    it('is case insensitive', () => {
      expect(isCCPStateMedia('XINHUA')).toBe(true);
      expect(isCCPStateMedia('xinhua')).toBe(true);
      expect(isCCPStateMedia('Xinhua')).toBe(true);
    });

    it('does NOT flag legitimate sources', () => {
      expect(isCCPStateMedia('BBC')).toBe(false);
      expect(isCCPStateMedia('Reuters')).toBe(false);
      expect(isCCPStateMedia('Human Rights Watch')).toBe(false);
      expect(isCCPStateMedia('ASPI')).toBe(false);
      expect(isCCPStateMedia('Amnesty International')).toBe(false);
      expect(isCCPStateMedia('Hong Kong Free Press')).toBe(false);
    });

    it('returns false for null/undefined', () => {
      expect(isCCPStateMedia(null)).toBe(false);
      expect(isCCPStateMedia(undefined)).toBe(false);
      expect(isCCPStateMedia('')).toBe(false);
    });
  });

  describe('isCCPDomain()', () => {
    it('detects CCP media domains', () => {
      expect(isCCPDomain('https://www.xinhua.net/article/123')).toBe(true);
      expect(isCCPDomain('https://www.cgtn.com/politics')).toBe(true);
      expect(isCCPDomain('https://www.globaltimes.cn/page/2024')).toBe(true);
    });

    it('does NOT flag legitimate domains', () => {
      expect(isCCPDomain('https://www.bbc.com/news')).toBe(false);
      expect(isCCPDomain('https://www.hrw.org/report')).toBe(false);
      expect(isCCPDomain('https://www.reuters.com/article')).toBe(false);
    });

    it('handles null/empty input', () => {
      expect(isCCPDomain(null)).toBe(false);
      expect(isCCPDomain('')).toBe(false);
    });
  });

  describe('getCCPInfluenceRisk()', () => {
    it('returns ccp risk for state media', () => {
      const result = getCCPInfluenceRisk('Xinhua');
      expect(result).not.toBeNull();
      expect(result.risk).toBe('ccp');
      expect(result.action).toContain('REJECT');
    });

    it('returns risk for known CCP proxy media', () => {
      const result = getCCPInfluenceRisk('South China Morning Post');
      expect(result).not.toBeNull();
      expect(result.category).toBe('ccp_proxy_media');
      expect(result.risk).toBe('medium');
    });

    it('returns risk for CCP think tanks', () => {
      const result = getCCPInfluenceRisk('Chinese Academy of Social Sciences');
      expect(result).not.toBeNull();
      expect(result.category).toBe('ccp_think_tank');
      expect(result.risk).toBe('high');
    });

    it('returns null for clean sources', () => {
      expect(getCCPInfluenceRisk('BBC')).toBeNull();
      expect(getCCPInfluenceRisk('Human Rights Watch')).toBeNull();
      expect(getCCPInfluenceRisk('Reuters')).toBeNull();
    });

    it('returns null for null/empty input', () => {
      expect(getCCPInfluenceRisk(null)).toBeNull();
      expect(getCCPInfluenceRisk('')).toBeNull();
    });
  });

  describe('assessSourceRisk()', () => {
    it('returns ccp level for state media', () => {
      const result = assessSourceRisk('CGTN');
      expect(result.level).toBe('ccp');
      expect(result.action).toContain('REJECT');
    });

    it('returns none level for verified clean sources', () => {
      const result = assessSourceRisk('BBC');
      expect(result.level).toBe('none');
      expect(result.action).toContain('SAFE');
    });

    it('returns medium for SCMP', () => {
      const result = assessSourceRisk('South China Morning Post');
      expect(result.level).toBe('medium');
    });

    it('returns unknown for unregistered sources', () => {
      const result = assessSourceRisk('Some Random Blog');
      expect(result.level).toBe('unknown');
      expect(result.action).toContain('VERIFY');
    });

    it('returns unknown for null input', () => {
      const result = assessSourceRisk(null);
      expect(result.level).toBe('unknown');
    });
  });
});
