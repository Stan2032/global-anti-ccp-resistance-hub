import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const DATA_DIR = resolve(__dirname, '../data');

describe('Critical date consistency across data files', () => {
  describe('Jimmy Lai dates and facts', () => {
    it('timeline_events.json has correct conviction date (Dec 15, 2025)', () => {
      const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'timeline_events.json'), 'utf-8'));
      const laiGuilty = data.find((e) => e.title === 'Jimmy Lai Found Guilty');
      expect(laiGuilty).toBeDefined();
      expect(laiGuilty.date).toBe('2025-12-15');
    });

    it('timeline_events.json has correct sentencing date (Feb 9, 2026)', () => {
      const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'timeline_events.json'), 'utf-8'));
      const laiSentenced = data.find((e) => e.title === 'Jimmy Lai Sentenced to 20 Years');
      expect(laiSentenced).toBeDefined();
      expect(laiSentenced.date).toBe('2026-02-09');
      expect(laiSentenced.sentence).toBe('20 years imprisonment');
    });

    it('timeline_events.json event 14 references 20-year sentence, not life', () => {
      const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'timeline_events.json'), 'utf-8'));
      const laiArrested = data.find((e) => e.id === 14);
      expect(laiArrested).toBeDefined();
      expect(laiArrested.sentence).not.toMatch(/faces life/i);
      expect(laiArrested.sentence).toMatch(/20 years/i);
    });

    it('political_prisoners_research.json has 20-year sentence for Jimmy Lai', () => {
      const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'political_prisoners_research.json'), 'utf-8'));
      const lai = data.results.find((r) => r.output.prisoner_name === 'Jimmy Lai');
      expect(lai).toBeDefined();
      expect(lai.output.sentence).toMatch(/20 years/i);
    });

    it('no data file references "December 19" for Jimmy Lai verdict', () => {
      const hrOrgs = JSON.parse(readFileSync(resolve(DATA_DIR, 'human_rights_orgs_research.json'), 'utf-8'));
      for (const result of hrOrgs.results) {
        const news = result.output?.latest_news || '';
        if (news.toLowerCase().includes('lai')) {
          expect(news).not.toMatch(/December 19/);
        }
      }
    });
  });

  describe('Hong Kong 47 dates', () => {
    it('timeline has correct sentencing date (Nov 19, 2024)', () => {
      const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'timeline_events.json'), 'utf-8'));
      const hk47 = data.find((e) => e.title === 'Hong Kong 47 Sentenced');
      expect(hk47).toBeDefined();
      expect(hk47.date).toBe('2024-11-19');
    });
  });

  describe('Safeguard Defenders report date', () => {
    it('timeline has corrected date (Dec 4, 2022, not Sep 14, 2023)', () => {
      const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'timeline_events.json'), 'utf-8'));
      const sd = data.find((e) => e.title && e.title.includes('Safeguard Defenders'));
      expect(sd).toBeDefined();
      expect(sd.date).toBe('2022-12-04');
      expect(sd.date).not.toBe('2023-09-14');
    });
  });

  describe('Timeline event date ordering', () => {
    it('all events are in chronological order', () => {
      const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'timeline_events.json'), 'utf-8'));
      for (let i = 1; i < data.length; i++) {
        const prevDate = new Date(data[i - 1].date);
        const currDate = new Date(data[i].date);
        expect(currDate.getTime()).toBeGreaterThanOrEqual(
          prevDate.getTime()
        );
      }
    });
  });

  describe('No CCP state media cited as credible source', () => {
    const CCP_OUTLETS = ['Xinhua', 'CGTN', 'Global Times', 'People\'s Daily', 'China Daily'];

    it('timeline_events.json does not cite CCP state media as sources', () => {
      const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'timeline_events.json'), 'utf-8'));
      for (const event of data) {
        if (event.sources) {
          for (const source of event.sources) {
            for (const outlet of CCP_OUTLETS) {
              expect(source).not.toBe(outlet);
            }
          }
        }
      }
    });
  });
});
