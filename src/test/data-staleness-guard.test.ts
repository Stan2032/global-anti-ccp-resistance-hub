/**
 * Data staleness guard tests
 *
 * Ensures verification dates in data files don't drift beyond acceptable
 * thresholds. This prevents data from silently going stale.
 *
 * IMPORTANT: When dates are updated, these tests track them.
 * If a date ages beyond 90 days, the test fails — prompting review.
 */
import { describe, it, expect } from 'vitest';
import prisonersData from '../data/political_prisoners_research.json';
import sanctionsData from '../data/sanctions_tracker.json';
import casesData from '../data/legal_cases_research.json';
import timelineData from '../data/timeline_events.json';

interface PrisonerRecord {
  output?: { last_verified?: string; prisoner_name?: string };
  error?: string;
}

interface SanctionsFile {
  metadata: { last_updated?: string };
  sanctions: { id: number; target: string; last_updated?: string }[];
}

interface CaseRecord {
  output: { case_name: string; last_verified: string };
  error: string;
}

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
}

const MAX_STALENESS_DAYS = 90;

function daysSince(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

describe('Data Staleness Guard', () => {
  describe('Political Prisoners', () => {
    it('prisoner data was verified within the last 90 days', () => {
      const stale: string[] = [];
      const records = (prisonersData as { results: PrisonerRecord[] }).results;
      for (const r of records) {
        if (r.error || !r.output?.last_verified) continue;
        const days = daysSince(r.output.last_verified);
        if (days > MAX_STALENESS_DAYS) {
          stale.push(`${r.output.prisoner_name}: ${days} days since ${r.output.last_verified}`);
        }
      }
      expect(stale, `Stale prisoner records (>${MAX_STALENESS_DAYS} days):\n${stale.join('\n')}`).toEqual([]);
    });
  });

  describe('Legal Cases', () => {
    it('legal case data was verified within the last 90 days', () => {
      const stale: string[] = [];
      const records = (casesData as { results: CaseRecord[] }).results;
      for (const r of records) {
        if (r.error || !r.output?.last_verified) continue;
        const days = daysSince(r.output.last_verified);
        if (days > MAX_STALENESS_DAYS) {
          stale.push(`${r.output.case_name}: ${days} days since ${r.output.last_verified}`);
        }
      }
      expect(stale, `Stale legal case records (>${MAX_STALENESS_DAYS} days):\n${stale.join('\n')}`).toEqual([]);
    });
  });

  describe('Sanctions Tracker', () => {
    it('sanctions metadata was updated within the last 90 days', () => {
      const data = sanctionsData as SanctionsFile;
      const metaDate = data.metadata?.last_updated;
      if (metaDate) {
        const days = daysSince(metaDate);
        expect(days, `Sanctions metadata is ${days} days old (last: ${metaDate})`).toBeLessThanOrEqual(MAX_STALENESS_DAYS);
      }
    });
  });

  describe('Timeline Events', () => {
    it('most recent timeline event is from the current year', () => {
      const events = timelineData as TimelineEvent[];
      const currentYear = new Date().getFullYear();
      const dates = events.map(e => e.date).filter(Boolean).sort();
      const latestDate = dates[dates.length - 1];
      const latestYear = new Date(latestDate).getFullYear();
      expect(latestYear, `Latest timeline event is from ${latestYear}, expected ${currentYear}`).toBe(currentYear);
    });
  });

  describe('Cross-Dataset Date Consistency', () => {
    it('no future dates in prisoner records', () => {
      const violations: string[] = [];
      const records = (prisonersData as { results: PrisonerRecord[] }).results;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      for (const r of records) {
        if (r.error || !r.output?.last_verified) continue;
        if (r.output.last_verified > tomorrowStr) {
          violations.push(`${r.output.prisoner_name}: future date ${r.output.last_verified}`);
        }
      }
      expect(violations, `Future dates:\n${violations.join('\n')}`).toEqual([]);
    });

    it('no future dates in legal case records', () => {
      const violations: string[] = [];
      const records = (casesData as { results: CaseRecord[] }).results;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      for (const r of records) {
        if (r.error || !r.output?.last_verified) continue;
        if (r.output.last_verified > tomorrowStr) {
          violations.push(`${r.output.case_name}: future date ${r.output.last_verified}`);
        }
      }
      expect(violations, `Future dates:\n${violations.join('\n')}`).toEqual([]);
    });
  });
});
