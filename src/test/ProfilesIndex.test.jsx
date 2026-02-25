import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilesIndex from '../pages/profiles/ProfilesIndex';

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

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
    expect(screen.getByText(/62 total cases in database/)).toBeTruthy();
  });
});
