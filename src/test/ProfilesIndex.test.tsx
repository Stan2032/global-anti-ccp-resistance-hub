import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilesIndex from '../pages/profiles/ProfilesIndex';
import prisonersData from '../data/political_prisoners_research.json';

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

/** A button in the region filter above the profile grid. */
const regionFilter = (name: RegExp) =>
  within(screen.getByRole('group', { name: 'Filter profiles by region' })).getByRole('button', { name });

describe('ProfilesIndex', () => {
  it('should render the page title', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(screen.getByText('Profiles: Targeted by the CCP')).toBeTruthy();
  });

  it('should render all built profile names', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(screen.getByText('Jimmy Lai')).toBeTruthy();
    expect(screen.getByText('Ilham Tohti')).toBeTruthy();
    expect(screen.getByText('Gedhun Choekyi Nyima')).toBeTruthy();
    expect(screen.getByText('Liu Xiaobo')).toBeTruthy();
    expect(screen.getByText('Joshua Wong')).toBeTruthy();
    expect(screen.getByText('Gui Minhai')).toBeTruthy();
    expect(screen.getByText('Zhang Zhan')).toBeTruthy();
    expect(screen.getByText('Gao Zhisheng')).toBeTruthy();
    expect(screen.getByText('Nathan Law')).toBeTruthy();
    expect(screen.getByText('Cardinal Joseph Zen')).toBeTruthy();
    expect(screen.getByText('Benny Tai')).toBeTruthy();
    expect(screen.getByText('Agnes Chow')).toBeTruthy();
    expect(screen.getByText('Tashi Wangchuk')).toBeTruthy();
    expect(screen.getByText('Ren Zhiqiang')).toBeTruthy();
    expect(screen.getByText('Xu Zhiyong')).toBeTruthy();
  });

  it('should render Chinese names for built profiles', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(screen.getByText('黎智英')).toBeTruthy();
    expect(screen.getByText('黃之鋒')).toBeTruthy();
    expect(screen.getByText('刘晓波')).toBeTruthy();
  });

  it('should show status badges', () => {
    renderWithRouter(<ProfilesIndex />);
    const imprisonedBadges = screen.getAllByText('IMPRISONED');
    expect(imprisonedBadges.length).toBe(8);
    const disappearedBadges = screen.getAllByText('DISAPPEARED');
    expect(disappearedBadges.length).toBe(2);
    expect(screen.getByText('DECEASED')).toBeTruthy();
    const exiledBadges = screen.getAllByText('EXILED');
    expect(exiledBadges.length).toBe(2);
    expect(screen.getByText('AT RISK')).toBeTruthy();
    expect(screen.getByText('RELEASED — SURVEILLANCE')).toBeTruthy();
  });

  it('should render links for built profiles', () => {
    renderWithRouter(<ProfilesIndex />);
    const links = screen.getAllByText('Full profile available');
    expect(links.length).toBe(16);
  });

  it('should not show coming soon section when all profiles are built', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(screen.queryByText('Coming Soon')).toBeNull();
    expect(screen.queryByText('Profile coming soon')).toBeNull();
  });

  it('should render source attribution note', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(screen.getByText(/Tier 1 outlets/)).toBeTruthy();
    expect(screen.getByText(/No CCP state media/)).toBeTruthy();
  });

  it('should show profile count summary', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(screen.getByText('16 detailed profiles')).toBeTruthy();
  });

  it('should link back to political prisoners database', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(screen.getByText('Political Prisoners Database')).toBeTruthy();
    // Hardcoded on the page, so tie it to the data: it said 65 for six months
    // after a duplicate record was removed and the database held 64.
    const cases = prisonersData.results.length;
    expect(cases).toBeGreaterThan(0);
    expect(screen.getByText(new RegExp(`^${cases} total cases in database`))).toBeTruthy();
  });

  // === Region Filter Tests (Session 167) ===

  it('should render the region filters', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(regionFilter(/All Profiles/i)).toBeTruthy();
    expect(regionFilter(/Hong Kong/i)).toBeTruthy();
    expect(regionFilter(/Mainland China/i)).toBeTruthy();
    expect(regionFilter(/Uyghur & Tibet/i)).toBeTruthy();
    expect(regionFilter(/Cross-Border/i)).toBeTruthy();
  });

  it('should have the All Profiles filter on by default', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(regionFilter(/All Profiles/i).getAttribute('aria-pressed')).toBe('true');
  });

  it('should show counts on each filter', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(regionFilter(/All Profiles \(16\)/i)).toBeTruthy();
    expect(regionFilter(/Hong Kong \(7\)/i)).toBeTruthy();
    expect(regionFilter(/Mainland China \(5\)/i)).toBeTruthy();
    expect(regionFilter(/Uyghur & Tibet \(3\)/i)).toBeTruthy();
    expect(regionFilter(/Cross-Border \(1\)/i)).toBeTruthy();
  });

  it('should filter to Hong Kong profiles when its filter is clicked', () => {
    renderWithRouter(<ProfilesIndex />);
    fireEvent.click(regionFilter(/Hong Kong/i));
    // Hong Kong profiles should be visible
    expect(screen.getByText('Jimmy Lai')).toBeTruthy();
    expect(screen.getByText('Joshua Wong')).toBeTruthy();
    expect(screen.getByText('Agnes Chow')).toBeTruthy();
    expect(screen.getByText('Benny Tai')).toBeTruthy();
    expect(screen.getByText('Nathan Law')).toBeTruthy();
    expect(screen.getByText('Cardinal Joseph Zen')).toBeTruthy();
    // Non-HK profiles should be hidden
    expect(screen.queryByText('Ilham Tohti')).toBeNull();
    expect(screen.queryByText('Liu Xiaobo')).toBeNull();
    expect(screen.queryByText('Gui Minhai')).toBeNull();
  });

  it('should filter to Mainland China profiles when its filter is clicked', () => {
    renderWithRouter(<ProfilesIndex />);
    fireEvent.click(regionFilter(/Mainland China/i));
    expect(screen.getByText('Liu Xiaobo')).toBeTruthy();
    expect(screen.getByText('Gao Zhisheng')).toBeTruthy();
    expect(screen.getByText('Zhang Zhan')).toBeTruthy();
    expect(screen.getByText('Ren Zhiqiang')).toBeTruthy();
    expect(screen.getByText('Xu Zhiyong')).toBeTruthy();
    // HK profiles should be hidden
    expect(screen.queryByText('Jimmy Lai')).toBeNull();
    expect(screen.queryByText('Joshua Wong')).toBeNull();
  });

  it('should filter to Uyghur & Tibet profiles when its filter is clicked', () => {
    renderWithRouter(<ProfilesIndex />);
    fireEvent.click(regionFilter(/Uyghur & Tibet/i));
    expect(screen.getByText('Ilham Tohti')).toBeTruthy();
    expect(screen.getByText('Gedhun Choekyi Nyima')).toBeTruthy();
    expect(screen.getByText('Tashi Wangchuk')).toBeTruthy();
    expect(screen.queryByText('Jimmy Lai')).toBeNull();
  });

  it('should filter to Cross-Border profiles when its filter is clicked', () => {
    renderWithRouter(<ProfilesIndex />);
    fireEvent.click(regionFilter(/Cross-Border/i));
    expect(screen.getByText('Gui Minhai')).toBeTruthy();
    expect(screen.queryByText('Jimmy Lai')).toBeNull();
    expect(screen.queryByText('Ilham Tohti')).toBeNull();
  });

  it('should return to all profiles when All is clicked after filtering', () => {
    renderWithRouter(<ProfilesIndex />);
    // Filter to HK
    fireEvent.click(regionFilter(/Hong Kong/i));
    expect(screen.queryByText('Ilham Tohti')).toBeNull();
    // Go back to All
    fireEvent.click(regionFilter(/All Profiles/i));
    expect(screen.getByText('Ilham Tohti')).toBeTruthy();
    expect(screen.getByText('Jimmy Lai')).toBeTruthy();
    expect(screen.getByText('Gui Minhai')).toBeTruthy();
  });

  it('should move aria-pressed to the filter that was clicked', () => {
    renderWithRouter(<ProfilesIndex />);
    const hk = regionFilter(/Hong Kong/i);
    const all = regionFilter(/All Profiles/i);
    fireEvent.click(hk);
    expect(hk.getAttribute('aria-pressed')).toBe('true');
    expect(all.getAttribute('aria-pressed')).toBe('false');
  });

  // The filters narrow one grid, so they are not announced as tabs.
  it('should present the filters as buttons, not tabs', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(screen.queryAllByRole('tablist')).toHaveLength(0);
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    expect(screen.queryAllByRole('tabpanel')).toHaveLength(0);
    expect(screen.getByRole('region', { name: 'Available profiles' })).toBeTruthy();
  });
});
