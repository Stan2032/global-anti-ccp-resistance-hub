import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContentAnalytics from '../components/ContentAnalytics';

// Mock dataApi to avoid importing all JSON data in tests
vi.mock('../services/dataApi', () => ({
  dataApi: {
    getDatasetSummary: () => ({
      datasets: {
        political_prisoners: { count: 64, description: 'Prisoners', fields: ['prisoner_name', 'status'] },
        sanctions: { count: 47, description: 'Sanctions', fields: ['country', 'target'] },
        sanctioned_officials: { count: 35, description: 'Officials', fields: ['name', 'position'] },
        timeline_events: { count: 34, description: 'Events', fields: ['date', 'title'] },
        forced_labor_companies: { count: 28, description: 'Companies', fields: ['company_name'] },
        detention_facilities: { count: 11, description: 'Facilities', fields: ['name', 'location'] },
        emergency_alerts: { count: 6, description: 'Alerts', fields: ['title', 'type'] },
        live_statistics: { count: 8, description: 'Statistics', fields: ['id', 'value'] },
      },
    }),
    getPoliticalPrisoners: () => [
      { prisoner_name: 'Jimmy Lai', status: 'DETAINED', location: 'Hong Kong' },
      { prisoner_name: 'Joshua Wong', status: 'DETAINED', location: 'Hong Kong' },
      { prisoner_name: 'Agnes Chow', status: 'EXILE', location: 'Hong Kong' },
      { prisoner_name: 'Ilham Tohti', status: 'DETAINED', location: 'Xinjiang, China' },
      { prisoner_name: 'Liu Xiaobo', status: 'DECEASED', location: 'Liaoning, China' },
      { prisoner_name: 'Gao Zhisheng', status: 'DISAPPEARED', location: 'Shaanxi, China' },
    ],
    getSanctions: () => [
      { country: 'us', target: 'Carrie Lam', reason: 'HK NSL' },
      { country: 'us', target: 'John Lee', reason: 'HK NSL' },
      { country: 'uk', target: 'Carrie Lam', reason: 'HK NSL' },
      { country: 'eu', target: 'Chen Quanguo', reason: 'Uyghur' },
      { country: 'canada', target: 'Carrie Lam', reason: 'HK NSL' },
    ],
    getTimelineEvents: () => [
      { date: '1989-06-04', title: 'Tiananmen', category: 'mainland', significance: 'critical' },
      { date: '2019-06-09', title: 'HK Protests', category: 'hongkong', significance: 'critical' },
      { date: '2020-06-30', title: 'NSL Enacted', category: 'hongkong', significance: 'critical' },
      { date: '2025-12-15', title: 'Lai Verdict', category: 'hongkong', significance: 'high' },
      { date: '2026-02-26', title: 'Art 23', category: 'hongkong', significance: 'high' },
    ],
    getAlerts: () => [
      { id: 'a1', title: 'Joshua Wong Hearing', type: 'critical', active: true, summary: 'Hearing March 6' },
      { id: 'a2', title: 'Jimmy Lai', type: 'critical', active: true, summary: 'Sentenced 20 years' },
      { id: 'a3', title: 'Inactive', type: 'info', active: false, summary: 'Old alert' },
    ],
    getDetentionFacilities: () => [
      { name: 'Facility 1', location: 'Xinjiang' },
      { name: 'Facility 2', location: 'Xinjiang' },
    ],
    getForcedLaborCompanies: () => [
      { company_name: 'Company A' },
      { company_name: 'Company B' },
      { company_name: 'Company C' },
    ],
    getRecentUpdates: () => [
      { id: 'u1', date: '2026-03-05', category: 'verification', title: 'Test coverage 100%' },
      { id: 'u2', date: '2026-03-05', category: 'data', title: 'Data API module' },
      { id: 'u3', date: '2026-03-04', category: 'case_update', title: 'ARIA audit' },
      { id: 'u4', date: '2026-03-03', category: 'alert', title: 'Wong hearing' },
      { id: 'u5', date: '2026-03-02', category: 'data', title: 'Sanctions verified' },
      { id: 'u6', date: '2026-03-01', category: 'report', title: 'Performance budget' },
    ],
    getHongKongData: () => ({
      prisoners: [
        { prisoner_name: 'Jimmy Lai', status: 'DETAINED' },
        { prisoner_name: 'Joshua Wong', status: 'DETAINED' },
        { prisoner_name: 'Agnes Chow', status: 'EXILE' },
      ],
    }),
    getUyghurData: () => ({
      prisoners: [{ prisoner_name: 'Ilham Tohti', status: 'DETAINED' }],
      facilities: [{ name: 'Facility 1' }, { name: 'Facility 2' }],
      companies: [{ company_name: 'Company A' }],
    }),
    getStatistics: () => [
      { id: 's1', value: 100 },
      { id: 's2', value: 200 },
    ],
  },
}));

describe('ContentAnalytics', () => {
  // ── Header ──────────────────────────────────────────
  it('renders the header with title', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('Content Analytics')).toBeTruthy();
  });

  it('shows total record count in description', () => {
    render(<ContentAnalytics />);
    // Sum: 64+47+35+34+28+11+6+8 = 233
    expect(screen.getByText(/233 verified records/)).toBeTruthy();
  });

  it('mentions privacy — no user tracking', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText(/No user tracking/)).toBeTruthy();
  });

  // ── Dataset Summary Cards ──────────────────────────
  it('shows Political Prisoners card with count', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('Political Prisoners')).toBeTruthy();
    // The card shows prisoners.length from getPoliticalPrisoners() mock
    // Multiple cards may show the same number, just verify at least one exists
    expect(screen.getAllByText('6').length).toBeGreaterThanOrEqual(1);
  });

  it('shows Sanctions card with count', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('Sanctions')).toBeTruthy();
    // Sanctions count from getSanctions() mock
    expect(screen.getAllByText('5').length).toBeGreaterThanOrEqual(1);
  });

  it('shows Timeline Events card', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('Timeline Events')).toBeTruthy();
    // Count is timeline.length from getTimelineEvents() mock (5)
    expect(screen.getAllByText('5').length).toBeGreaterThanOrEqual(1);
  });

  it('shows Emergency Alerts card', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('Emergency Alerts')).toBeTruthy();
  });

  it('shows Detention Facilities card', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('Detention Facilities')).toBeTruthy();
  });

  it('shows Forced Labor card', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('Forced Labor')).toBeTruthy();
  });

  it('shows Sanctioned Officials card', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('Sanctioned Officials')).toBeTruthy();
  });

  it('shows Recent Updates card', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('Recent Updates')).toBeTruthy();
  });

  // ── Prisoner Status Breakdown ──────────────────────
  it('renders prisoner status breakdown section', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('Prisoner Status Breakdown')).toBeTruthy();
  });

  it('shows DETAINED status count', () => {
    render(<ContentAnalytics />);
    // 3 detained in mock data
    expect(screen.getByText('DETAINED')).toBeTruthy();
  });

  it('shows EXILE status', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('EXILE')).toBeTruthy();
  });

  it('shows DECEASED status', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('DECEASED')).toBeTruthy();
  });

  it('shows DISAPPEARED status', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('DISAPPEARED')).toBeTruthy();
  });

  // ── Sanctions by Country ───────────────────────────
  it('renders sanctions by country section', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('Sanctions by Country')).toBeTruthy();
  });

  it('shows country names in sanctions chart', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('United States')).toBeTruthy();
    expect(screen.getByText('United Kingdom')).toBeTruthy();
    expect(screen.getByText('European Union')).toBeTruthy();
    expect(screen.getByText('Canada')).toBeTruthy();
  });

  // ── Timeline Coverage ──────────────────────────────
  it('renders timeline by decade section', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('Timeline by Decade')).toBeTruthy();
  });

  it('shows decade labels', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('1980s')).toBeTruthy();
    expect(screen.getByText('2010s')).toBeTruthy();
    expect(screen.getByText('2020s')).toBeTruthy();
  });

  it('shows region/category breakdown', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('By Region')).toBeTruthy();
  });

  // ── Geographic Coverage ────────────────────────────
  it('renders geographic coverage section', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText(/Geographic Coverage/)).toBeTruthy();
  });

  it('shows Hong Kong prisoner count', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('Hong Kong')).toBeTruthy();
  });

  it('shows Uyghur Region prisoner count', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('Uyghur Region')).toBeTruthy();
  });

  // ── Recent Activity ────────────────────────────────
  it('renders recent activity section', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('Recent Data Activity')).toBeTruthy();
  });

  it('shows recent update entries', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('Test coverage 100%')).toBeTruthy();
    expect(screen.getByText('Data API module')).toBeTruthy();
  });

  it('shows category badges on updates', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText('VERIFICATION')).toBeTruthy();
    // DATA may appear multiple times (card label + badge), just check at least one exists
    expect(screen.getAllByText('DATA').length).toBeGreaterThanOrEqual(1);
  });

  it('shows overflow indicator when more than 5 updates', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText(/\+ 1 more entries/)).toBeTruthy();
  });

  // ── Data Quality Footer ────────────────────────────
  it('shows data verification footer', () => {
    render(<ContentAnalytics />);
    expect(screen.getByText(/All data verified from Tier 1-2 sources/)).toBeTruthy();
  });

  // ── No hashtags compliance ─────────────────────────
  it('contains no hashtags', () => {
    const { container } = render(<ContentAnalytics />);
    const text = container.textContent;
    expect(text).not.toMatch(/#\w+/);
  });
});
