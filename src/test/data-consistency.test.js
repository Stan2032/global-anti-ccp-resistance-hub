import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
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
    const CCP_DOMAINS = [
      'xinhua.net', 'cgtn.com', 'globaltimes.cn', 'chinadaily.com',
      'people.com.cn', 'guancha.cn', 'haiwainet.cn', 'cctv.com'
    ];

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

    it('no research data file uses CCP state media source URLs', () => {
      const researchFiles = readdirSync(DATA_DIR)
        .filter((f) => f.endsWith('_research.json'));

      for (const fileName of researchFiles) {
        const content = readFileSync(resolve(DATA_DIR, fileName), 'utf-8');
        for (const domain of CCP_DOMAINS) {
          const regex = new RegExp(`https?://[^"]*${domain.replace('.', '\\.')}`, 'gi');
          const matches = content.match(regex);
          expect(matches, `${fileName} contains CCP source URL with domain ${domain}`).toBeNull();
        }
      }
    });
  });

  describe('Sanctioned officials data integrity', () => {
    it('all verified US sanctions dates are correct', () => {
      const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'sanctioned_officials_research.json'), 'utf-8'));

      // Verified dates from US Treasury press releases
      const verified = {
        'Chen Quanguo': { field: 'us_sanctions', expected: 'July 2020' },
        'Zhu Hailun': { field: 'us_sanctions', expected: 'July 9, 2020' },
        'Carrie Lam': { field: 'us_sanctions', expected: 'August 7, 2020' },
      };

      for (const [name, check] of Object.entries(verified)) {
        const official = data.results.find((r) => r.output.name === name);
        expect(official, `${name} should exist in sanctioned officials`).toBeDefined();
        expect(official.output[check.field]).toContain(check.expected);
      }
    });

    it('each sanctioned official has valid source_url', () => {
      const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'sanctioned_officials_research.json'), 'utf-8'));
      for (const result of data.results) {
        expect(result.output.source_url).toMatch(/^https?:\/\//);
      }
    });
  });

  describe('International responses data integrity', () => {
    it('US genocide recognition date is January 19, 2021', () => {
      const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'international_responses_research.json'), 'utf-8'));
      const us = data.results.find((r) => r.output.country === 'United States');
      expect(us).toBeDefined();
      expect(us.output.genocide_recognition).toContain('January 19, 2021');
    });

    it('Netherlands genocide recognition date is February 25, 2021', () => {
      const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'international_responses_research.json'), 'utf-8'));
      const nl = data.results.find((r) => r.output.country === 'Netherlands');
      expect(nl).toBeDefined();
      expect(nl.output.genocide_recognition).toContain('February 25, 2021');
    });

    it('Lithuania genocide recognition date is May 20, 2021', () => {
      const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'international_responses_research.json'), 'utf-8'));
      const lt = data.results.find((r) => r.output.country === 'Lithuania');
      expect(lt).toBeDefined();
      expect(lt.output.genocide_recognition).toContain('May 20, 2021');
    });

    it('France genocide recognition date is January 20, 2022', () => {
      const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'international_responses_research.json'), 'utf-8'));
      const fr = data.results.find((r) => r.output.country === 'France');
      expect(fr).toBeDefined();
      expect(fr.output.genocide_recognition).toContain('January 20, 2022');
    });

    it('each country has a source_url', () => {
      const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'international_responses_research.json'), 'utf-8'));
      for (const result of data.results) {
        expect(result.output.source_url).toMatch(/^https?:\/\//);
      }
    });
  });

  describe('Zhang Zhan second sentence is recorded', () => {
    it('political_prisoners_research.json reflects second sentence', () => {
      const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'political_prisoners_research.json'), 'utf-8'));
      const zz = data.results.find((r) => r.output.prisoner_name === 'Zhang Zhan');
      expect(zz).toBeDefined();
      expect(zz.output.sentence).toMatch(/second|2025|4 years.*4 years/i);
    });
  });

  describe('Session 29: Verified prisoner data accuracy', () => {
    let prisoners;
    beforeAll(() => {
      prisoners = JSON.parse(readFileSync(resolve(DATA_DIR, 'political_prisoners_research.json'), 'utf-8'));
    });

    it('Ilham Tohti sentencing date is September 23, 2014', () => {
      const tohti = prisoners.results.find((r) => r.output.prisoner_name === 'Ilham Tohti');
      expect(tohti).toBeDefined();
      expect(tohti.output.sentence).toMatch(/September 23, 2014/);
    });

    it('Gao Zhisheng last seen August 13, 2017', () => {
      const gao = prisoners.results.find((r) => r.output.prisoner_name === 'Gao Zhisheng');
      expect(gao).toBeDefined();
      expect(gao.output.latest_news).toMatch(/August 13, 2017/);
    });

    it('Gedhun Choekyi Nyima recognized May 14, abducted May 17, 1995', () => {
      const gcn = prisoners.results.find((r) => r.output.prisoner_name === 'Gedhun Choekyi Nyima');
      expect(gcn).toBeDefined();
      expect(gcn.output.latest_news).toMatch(/May 14, 1995/);
      expect(gcn.output.latest_news).toMatch(/May 17, 1995/);
    });

    it('Ren Zhiqiang sentence is 18 years', () => {
      const ren = prisoners.results.find((r) => r.output.prisoner_name === 'Ren Zhiqiang');
      expect(ren).toBeDefined();
      expect(ren.output.sentence).toMatch(/18 years/);
    });

    it('Rahile Dawut life sentence confirmed via secret 2018 trial', () => {
      const rd = prisoners.results.find((r) => r.output.prisoner_name === 'Rahile Dawut');
      expect(rd).toBeDefined();
      expect(rd.output.sentence).toMatch(/life/i);
      expect(rd.output.latest_news).toMatch(/2018/);
    });

    it('Gui Minhai 10-year sentence at Ningbo court, Feb 2020', () => {
      const gm = prisoners.results.find((r) => r.output.prisoner_name === 'Gui Minhai');
      expect(gm).toBeDefined();
      expect(gm.output.sentence).toMatch(/10 years/);
      expect(gm.output.sentence).toMatch(/Ningbo/i);
    });

    it('Sophia Huang Xueqin 5-year sentence verified', () => {
      const hxq = prisoners.results.find((r) => r.output.prisoner_name === 'Sophia Huang Xueqin');
      expect(hxq).toBeDefined();
      expect(hxq.output.sentence).toMatch(/5 years/);
    });

    it('Ekpar Asat 15-year sentence verified', () => {
      const ea = prisoners.results.find((r) => r.output.prisoner_name === 'Ekpar Asat');
      expect(ea).toBeDefined();
      expect(ea.output.sentence).toMatch(/15 years/);
    });

    it('verified prisoners have last_verified dates', () => {
      const verifiedNames = [
        'Jimmy Lai', 'Ilham Tohti', 'Gao Zhisheng', 'Gedhun Choekyi Nyima',
        'Ren Zhiqiang', 'Rahile Dawut', 'Gui Minhai', 'Ekpar Asat',
        'Sophia Huang Xueqin', 'Wang Jianbing', 'Gulshan Abbas', 'Qin Yongmin',
        'Liu Xiaobo', 'Huang Qi', 'Wang Quanzhang', 'Agnes Chow',
        'Nathan Law', 'Martin Lee', 'Cardinal Joseph Zen', 'Lee Cheuk-yan',
        'Andy Li', 'Tony Chung', 'Ai Weiwei', 'Chen Guangcheng'
      ];
      for (const name of verifiedNames) {
        const p = prisoners.results.find((r) => r.output.prisoner_name === name);
        expect(p, `${name} should exist`).toBeDefined();
        expect(p.output.last_verified, `${name} should have last_verified`).toBeDefined();
      }
    });

    it('timeline Ilham Tohti entry includes sentencing date', () => {
      const events = JSON.parse(readFileSync(resolve(DATA_DIR, 'timeline_events.json'), 'utf-8'));
      const tohti = events.find((e) => e.title === 'Ilham Tohti Arrested');
      expect(tohti).toBeDefined();
      expect(tohti.sentence).toMatch(/September 23, 2014/);
    });

    it('Falun Gong timeline references April 25, 1999 Zhongnanhai protest', () => {
      const events = JSON.parse(readFileSync(resolve(DATA_DIR, 'timeline_events.json'), 'utf-8'));
      const fg = events.find((e) => e.title === 'Falun Gong Persecution Begins');
      expect(fg).toBeDefined();
      expect(fg.details).toMatch(/April 25, 1999/);
    });

    it('Causeway Bay entry includes individual disappearance dates', () => {
      const events = JSON.parse(readFileSync(resolve(DATA_DIR, 'timeline_events.json'), 'utf-8'));
      const cb = events.find((e) => e.title === 'Causeway Bay Booksellers Abducted');
      expect(cb).toBeDefined();
      expect(cb.details).toMatch(/October 14/);
      expect(cb.details).toMatch(/October 17/);
      expect(cb.details).toMatch(/December 30/);
    });
  });

  describe('Session 30: Extended prisoner verification', () => {
    let prisoners;
    beforeAll(() => {
      prisoners = JSON.parse(readFileSync(resolve(DATA_DIR, 'political_prisoners_research.json'), 'utf-8'));
    });

    it('Liu Xiaobo sentenced December 25, 2009 and died July 13, 2017', () => {
      const lxb = prisoners.results.find((r) => r.output.prisoner_name === 'Liu Xiaobo');
      expect(lxb).toBeDefined();
      expect(lxb.output.sentence).toMatch(/December 25, 2009/);
      expect(lxb.output.sentence).toMatch(/July 13, 2017/);
      expect(lxb.output.status).toBe('DECEASED');
    });

    it('Huang Qi sentenced July 29, 2019, 12 years', () => {
      const hq = prisoners.results.find((r) => r.output.prisoner_name === 'Huang Qi');
      expect(hq).toBeDefined();
      expect(hq.output.sentence).toMatch(/July 29, 2019/);
      expect(hq.output.sentence).toMatch(/12 years/);
    });

    it('Wang Quanzhang sentenced Jan 28, 2019, released Apr 5, 2020', () => {
      const wq = prisoners.results.find((r) => r.output.prisoner_name === 'Wang Quanzhang');
      expect(wq).toBeDefined();
      expect(wq.output.sentence).toMatch(/January 28, 2019/);
      expect(wq.output.sentence).toMatch(/April 5, 2020/);
      expect(wq.output.status).toBe('RELEASED');
    });

    it('Lee Cheuk-yan total sentence is 20 months (not 14)', () => {
      const lcy = prisoners.results.find((r) => r.output.prisoner_name === 'Lee Cheuk-yan');
      expect(lcy).toBeDefined();
      expect(lcy.output.sentence).toMatch(/20 months/);
      expect(lcy.output.sentence).not.toMatch(/14 months/);
    });

    it('Cardinal Joseph Zen arrested May 11, 2022, fined November 2022', () => {
      const cjz = prisoners.results.find((r) => r.output.prisoner_name === 'Cardinal Joseph Zen');
      expect(cjz).toBeDefined();
      expect(cjz.output.sentence).toMatch(/May 11, 2022/);
      expect(cjz.output.sentence).toMatch(/November 2022/);
    });

    it('Andy Li guilty plea August 19, 2021, sentencing deferred', () => {
      const al = prisoners.results.find((r) => r.output.prisoner_name === 'Andy Li');
      expect(al).toBeDefined();
      expect(al.output.sentence).toMatch(/August 19, 2021/);
      expect(al.output.sentence).toMatch(/deferred/i);
    });

    it('Tony Chung sentenced November 2021, youngest NSL sentence', () => {
      const tc = prisoners.results.find((r) => r.output.prisoner_name === 'Tony Chung');
      expect(tc).toBeDefined();
      expect(tc.output.sentence).toMatch(/3 years and 7 months/);
      expect(tc.output.sentence).toMatch(/November 2021/);
    });

    it('Martin Lee suspended sentence April 2021', () => {
      const ml = prisoners.results.find((r) => r.output.prisoner_name === 'Martin Lee');
      expect(ml).toBeDefined();
      expect(ml.output.sentence).toMatch(/suspended/i);
      expect(ml.output.sentence).toMatch(/April 2021/);
    });
  });
});
