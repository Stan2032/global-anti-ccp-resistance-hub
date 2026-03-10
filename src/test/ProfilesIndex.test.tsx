import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilesIndex from '../pages/profiles/ProfilesIndex';

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

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
    expect(links.length).toBe(15);
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
    expect(screen.getByText('15 detailed profiles')).toBeTruthy();
  });

  it('should link back to political prisoners database', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(screen.getByText('Political Prisoners Database')).toBeTruthy();
    expect(screen.getByText(/64 total cases in database/)).toBeTruthy();
  });

  // === Region Filter Tests (Session 167) ===

  it('should render region filter tabs', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(screen.getByRole('tab', { name: /All Profiles/i })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Hong Kong/i })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Mainland China/i })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Uyghur & Tibet/i })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Cross-Border/i })).toBeTruthy();
  });

  it('should have All Profiles tab active by default', () => {
    renderWithRouter(<ProfilesIndex />);
    const allTab = screen.getByRole('tab', { name: /All Profiles/i });
    expect(allTab.getAttribute('aria-selected')).toBe('true');
  });

  it('should show counts on each filter tab', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(screen.getByRole('tab', { name: /All Profiles \(15\)/i })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Hong Kong \(6\)/i })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Mainland China \(5\)/i })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Uyghur & Tibet \(3\)/i })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Cross-Border \(1\)/i })).toBeTruthy();
  });

  it('should filter to Hong Kong profiles when tab clicked', () => {
    renderWithRouter(<ProfilesIndex />);
    fireEvent.click(screen.getByRole('tab', { name: /Hong Kong/i }));
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

  it('should filter to Mainland China profiles when tab clicked', () => {
    renderWithRouter(<ProfilesIndex />);
    fireEvent.click(screen.getByRole('tab', { name: /Mainland China/i }));
    expect(screen.getByText('Liu Xiaobo')).toBeTruthy();
    expect(screen.getByText('Gao Zhisheng')).toBeTruthy();
    expect(screen.getByText('Zhang Zhan')).toBeTruthy();
    expect(screen.getByText('Ren Zhiqiang')).toBeTruthy();
    expect(screen.getByText('Xu Zhiyong')).toBeTruthy();
    // HK profiles should be hidden
    expect(screen.queryByText('Jimmy Lai')).toBeNull();
    expect(screen.queryByText('Joshua Wong')).toBeNull();
  });

  it('should filter to Uyghur & Tibet profiles when tab clicked', () => {
    renderWithRouter(<ProfilesIndex />);
    fireEvent.click(screen.getByRole('tab', { name: /Uyghur & Tibet/i }));
    expect(screen.getByText('Ilham Tohti')).toBeTruthy();
    expect(screen.getByText('Gedhun Choekyi Nyima')).toBeTruthy();
    expect(screen.getByText('Tashi Wangchuk')).toBeTruthy();
    expect(screen.queryByText('Jimmy Lai')).toBeNull();
  });

  it('should filter to Cross-Border profiles when tab clicked', () => {
    renderWithRouter(<ProfilesIndex />);
    fireEvent.click(screen.getByRole('tab', { name: /Cross-Border/i }));
    expect(screen.getByText('Gui Minhai')).toBeTruthy();
    expect(screen.queryByText('Jimmy Lai')).toBeNull();
    expect(screen.queryByText('Ilham Tohti')).toBeNull();
  });

  it('should return to all profiles when All tab clicked after filtering', () => {
    renderWithRouter(<ProfilesIndex />);
    // Filter to HK
    fireEvent.click(screen.getByRole('tab', { name: /Hong Kong/i }));
    expect(screen.queryByText('Ilham Tohti')).toBeNull();
    // Go back to All
    fireEvent.click(screen.getByRole('tab', { name: /All Profiles/i }));
    expect(screen.getByText('Ilham Tohti')).toBeTruthy();
    expect(screen.getByText('Jimmy Lai')).toBeTruthy();
    expect(screen.getByText('Gui Minhai')).toBeTruthy();
  });

  it('should update aria-selected when switching tabs', () => {
    renderWithRouter(<ProfilesIndex />);
    const hkTab = screen.getByRole('tab', { name: /Hong Kong/i });
    const allTab = screen.getByRole('tab', { name: /All Profiles/i });
    fireEvent.click(hkTab);
    expect(hkTab.getAttribute('aria-selected')).toBe('true');
    expect(allTab.getAttribute('aria-selected')).toBe('false');
  });

  it('should have tablist role on filter container', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(screen.getByRole('tablist', { name: /Filter profiles by region/i })).toBeTruthy();
  });

  it('should have tabpanel role on profiles grid', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(screen.getByRole('tabpanel')).toBeTruthy();
  });
});
