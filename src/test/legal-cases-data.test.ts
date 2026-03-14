/**
 * Data validation tests for legal_cases_research.json
 *
 * Ensures legal case data integrity: required fields, valid statuses,
 * valid jurisdictions, HTTPS source URLs, unique case numbers,
 * date formatting, and cross-referencing consistency.
 */
import { describe, it, expect } from 'vitest';
import casesData from '../data/legal_cases_research.json';

interface LegalCaseKeyDates {
  arrest_date?: string;
  trial_start?: string;
  verdict_date?: string;
  sentencing_date?: string;
  charge_date?: string;
  next_hearing?: string;
  recognition_date?: string;
  vote_date?: string;
  enforcement_date?: string;
  filing_date?: string;
  ruling_date?: string;
  [key: string]: string | undefined;
}

interface LegalCaseOutput {
  case_name: string;
  case_number: string;
  jurisdiction: string;
  court: string;
  defendant: string;
  charges: string;
  status: string;
  key_dates: LegalCaseKeyDates;
  outcome: string;
  significance: string;
  related_persons: string[];
  international_response: string;
  source_url: string;
  last_verified: string;
}

interface LegalCaseRecord {
  input: string;
  output: LegalCaseOutput;
  error: string;
}

const VALID_STATUSES = [
  'CONVICTED', 'PENDING_TRIAL', 'ACQUITTED', 'RECOGNIZED',
  'PASSED', 'UNDER_INVESTIGATION', 'ONGOING', 'ACTIVE',
  'RELEASED', 'CONCLUDED', 'PENDING_INVESTIGATION'
];

const cases: LegalCaseRecord[] = casesData.results;

describe('Legal Cases Data', () => {
  it('has at least 20 legal cases', () => {
    expect(cases.length).toBeGreaterThanOrEqual(20);
  });

  it('every case has required output fields', () => {
    const violations: string[] = [];
    for (const c of cases) {
      if (c.error) continue;
      const o = c.output;
      if (!o.case_name?.trim()) violations.push(`Missing case_name in "${c.input}"`);
      if (!o.case_number?.trim()) violations.push(`Missing case_number in "${c.input}"`);
      if (!o.jurisdiction?.trim()) violations.push(`Missing jurisdiction in "${c.input}"`);
      if (!o.court?.trim()) violations.push(`Missing court in "${c.input}"`);
      if (!o.charges?.trim()) violations.push(`Missing charges in "${c.input}"`);
      if (!o.status?.trim()) violations.push(`Missing status in "${c.input}"`);
      if (!o.outcome?.trim()) violations.push(`Missing outcome in "${c.input}"`);
      if (!o.significance?.trim()) violations.push(`Missing significance in "${c.input}"`);
      if (!o.source_url?.trim()) violations.push(`Missing source_url in "${c.input}"`);
      if (!o.last_verified?.trim()) violations.push(`Missing last_verified in "${c.input}"`);
    }
    expect(violations, `Field violations:\n${violations.join('\n')}`).toEqual([]);
  });

  it('all case numbers are unique', () => {
    const numbers = cases.filter(c => !c.error).map(c => c.output.case_number);
    const duplicates = numbers.filter((n, i) => numbers.indexOf(n) !== i);
    expect(duplicates, `Duplicate case numbers: ${duplicates.join(', ')}`).toEqual([]);
  });

  it('all statuses are from valid set', () => {
    const violations: string[] = [];
    for (const c of cases) {
      if (c.error) continue;
      if (!VALID_STATUSES.includes(c.output.status)) {
        violations.push(`"${c.output.case_name}": invalid status "${c.output.status}"`);
      }
    }
    expect(violations, `Invalid statuses:\n${violations.join('\n')}`).toEqual([]);
  });

  it('all source URLs use HTTPS', () => {
    const violations: string[] = [];
    for (const c of cases) {
      if (c.error) continue;
      if (!c.output.source_url.startsWith('https://')) {
        violations.push(`"${c.output.case_name}": non-HTTPS URL ${c.output.source_url}`);
      }
    }
    expect(violations, `Non-HTTPS URLs:\n${violations.join('\n')}`).toEqual([]);
  });

  it('source URLs are not homepage-only links', () => {
    const violations: string[] = [];
    for (const c of cases) {
      if (c.error) continue;
      try {
        const url = new URL(c.output.source_url);
        if (url.pathname === '/' && !url.search && !url.hash) {
          violations.push(`"${c.output.case_name}": homepage-only URL ${c.output.source_url}`);
        }
      } catch {
        violations.push(`"${c.output.case_name}": invalid URL ${c.output.source_url}`);
      }
    }
    expect(violations, `Homepage-only URLs:\n${violations.join('\n')}`).toEqual([]);
  });

  it('last_verified dates are in YYYY-MM-DD format', () => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const violations: string[] = [];
    for (const c of cases) {
      if (c.error) continue;
      if (!datePattern.test(c.output.last_verified)) {
        violations.push(`"${c.output.case_name}": invalid date format "${c.output.last_verified}"`);
      }
    }
    expect(violations, `Date format violations:\n${violations.join('\n')}`).toEqual([]);
  });

  it('key_dates contain valid ISO date strings', () => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const violations: string[] = [];
    for (const c of cases) {
      if (c.error) continue;
      for (const [key, val] of Object.entries(c.output.key_dates)) {
        if (val && !datePattern.test(val)) {
          violations.push(`"${c.output.case_name}": key_dates.${key} = "${val}" is not YYYY-MM-DD`);
        }
      }
    }
    expect(violations, `Invalid key_dates:\n${violations.join('\n')}`).toEqual([]);
  });

  it('covers multiple jurisdictions', () => {
    const jurisdictions = new Set(
      cases.filter(c => !c.error).map(c => c.output.jurisdiction)
    );
    expect(jurisdictions.size).toBeGreaterThanOrEqual(5);
  });

  it('covers both Hong Kong and international cases', () => {
    const jurisdictions = cases.filter(c => !c.error).map(c => c.output.jurisdiction);
    expect(jurisdictions.some(j => j === 'Hong Kong')).toBe(true);
    expect(jurisdictions.some(j => j !== 'Hong Kong' && j !== 'China')).toBe(true);
  });

  it('related_persons is always an array', () => {
    const violations: string[] = [];
    for (const c of cases) {
      if (c.error) continue;
      if (!Array.isArray(c.output.related_persons)) {
        violations.push(`"${c.output.case_name}": related_persons is not an array`);
      }
    }
    expect(violations, `Invalid related_persons:\n${violations.join('\n')}`).toEqual([]);
  });

  it('no CCP state media source URLs', () => {
    const ccpDomains = ['xinhua', 'globaltimes', 'chinadaily', 'cgtn', 'cctv', 'peoples-daily'];
    const violations: string[] = [];
    for (const c of cases) {
      if (c.error) continue;
      const url = c.output.source_url.toLowerCase();
      for (const domain of ccpDomains) {
        if (url.includes(domain)) {
          violations.push(`"${c.output.case_name}": CCP media domain "${domain}" in URL`);
        }
      }
    }
    expect(violations, `CCP media sources:\n${violations.join('\n')}`).toEqual([]);
  });

  it('significance descriptions are substantive (>30 chars)', () => {
    const violations: string[] = [];
    for (const c of cases) {
      if (c.error) continue;
      if (c.output.significance.length < 30) {
        violations.push(`"${c.output.case_name}": significance too short (${c.output.significance.length} chars)`);
      }
    }
    expect(violations, `Short significance:\n${violations.join('\n')}`).toEqual([]);
  });
});
