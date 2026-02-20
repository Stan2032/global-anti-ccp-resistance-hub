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
    expect(imprisonedBadges.length).toBe(5);
    expect(screen.getByText('DISAPPEARED')).toBeTruthy();
    expect(screen.getByText('DECEASED')).toBeTruthy();
  });

  it('should render links for built profiles', () => {
    renderWithRouter(<ProfilesIndex />);
    const links = screen.getAllByText('Full profile available');
    expect(links.length).toBe(5);
  });

  it('should show coming soon for unbuilt profiles', () => {
    renderWithRouter(<ProfilesIndex />);
    const comingSoon = screen.getAllByText('Profile coming soon');
    expect(comingSoon.length).toBe(3);
  });

  it('should render the Coming Soon section', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(screen.getByText('Coming Soon')).toBeTruthy();
  });

  it('should render source attribution note', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(screen.getByText(/Tier 1 outlets/)).toBeTruthy();
    expect(screen.getByText(/No CCP state media/)).toBeTruthy();
  });

  it('should show profile count summary', () => {
    renderWithRouter(<ProfilesIndex />);
    expect(screen.getByText('5 profiles available')).toBeTruthy();
  });
});
