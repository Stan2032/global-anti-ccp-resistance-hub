import { describe, it, expect } from 'vitest';
import { readdirSync } from 'fs';
import { resolve } from 'path';
import prisonersData from '../data/political_prisoners_research.json';

/**
 * Each profile page retells its person's prisoner record in its own words,
 * so re-verifying the record does not change the page. In September 2026
 * the records were updated for Chow Hang-Tung (convicted and sentenced) and
 * Joshua Wong (pleaded guilty), while their pages still said "on trial" and
 * "has not entered a plea", and Gao Zhisheng's page kept the "last seen"
 * wording his record had just corrected.
 *
 * REVIEWED names, for each page, the verification of its record it was last
 * checked against. When a record is re-verified after that date, this test
 * fails until the page has been read against the record and the date moved
 * on. Moving the date without reading the page defeats the test, the same
 * as editing a last_verified date would.
 *
 * The pages whose records were last verified in February 2026 were written
 * from the same research; their status and sentence lines were checked
 * against those records in September 2026.
 */
const REVIEWED: Record<string, { page: string; recordVerified: string }> = {
  'Agnes Chow': { page: 'AgnesChowProfile.tsx', recordVerified: '2026-02-20' },
  'Benny Tai': { page: 'BennyTaiProfile.tsx', recordVerified: '2026-02-20' },
  'Cardinal Joseph Zen': { page: 'CardinalZenProfile.tsx', recordVerified: '2026-02-20' },
  'Chow Hang-Tung': { page: 'ChowHangTungProfile.tsx', recordVerified: '2026-09-19' },
  'Gao Zhisheng': { page: 'GaoZhishengProfile.tsx', recordVerified: '2026-09-19' },
  'Gedhun Choekyi Nyima': { page: 'PanchenLamaProfile.tsx', recordVerified: '2026-02-20' },
  'Gui Minhai': { page: 'GuiMinhaiProfile.tsx', recordVerified: '2026-02-20' },
  'Ilham Tohti': { page: 'IlhamTohtiProfile.tsx', recordVerified: '2026-02-20' },
  'Jimmy Lai': { page: 'JimmyLaiProfile.tsx', recordVerified: '2026-09-19' },
  'Joshua Wong': { page: 'JoshuaWongProfile.tsx', recordVerified: '2026-09-19' },
  'Liu Xiaobo': { page: 'LiuXiaoboProfile.tsx', recordVerified: '2026-02-20' },
  'Nathan Law': { page: 'NathanLawProfile.tsx', recordVerified: '2026-02-20' },
  'Ren Zhiqiang': { page: 'RenZhiqiangProfile.tsx', recordVerified: '2026-02-19' },
  'Tashi Wangchuk': { page: 'TashiWangchukProfile.tsx', recordVerified: '2026-02-20' },
  'Xu Zhiyong': { page: 'XuZhiyongProfile.tsx', recordVerified: '2026-02-19' },
  'Zhang Zhan': { page: 'ZhangZhanProfile.tsx', recordVerified: '2026-09-19' },
};

const records = new Map(
  prisonersData.results.map(r => [r.output.prisoner_name, r.output] as const),
);

describe('Profile pages are reviewed when their records are re-verified', () => {
  it('lists every profile page on disk', () => {
    const pages = readdirSync(resolve(__dirname, '../pages/profiles'))
      .filter(f => f.endsWith('Profile.tsx'));
    expect(pages.length).toBeGreaterThan(0);
    expect(Object.values(REVIEWED).map(r => r.page).sort()).toEqual(pages.sort());
  });

  it('names a prisoner record for every page', () => {
    const missing = Object.keys(REVIEWED).filter(name => !records.has(name));
    expect(missing).toEqual([]);
  });

  it('has checked every page against its record as last verified', () => {
    const stale = Object.entries(REVIEWED)
      .filter(([name, { recordVerified }]) => {
        const verified = records.get(name)?.last_verified;
        return verified !== undefined && verified !== null && verified > recordVerified;
      })
      .map(([name, { page, recordVerified }]) =>
        `${page}: checked against ${recordVerified}, but ${name}'s record was re-verified ` +
        `${records.get(name)!.last_verified}. Read the page against the record, fix what it ` +
        `contradicts, then move the date.`);
    expect(stale).toEqual([]);
  });
});
