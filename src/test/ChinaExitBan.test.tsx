import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import ChinaExitBan from '../components/ChinaExitBan';

describe('ChinaExitBan', () => {
  it('renders the title', () => {
    render(<ChinaExitBan />);
    expect(screen.getByText('Exit Bans & Hostage Diplomacy')).toBeTruthy();
  });

  it('renders stats section', () => {
    render(<ChinaExitBan />);
    expect(screen.getByText('Currently Held')).toBeTruthy();
    expect(screen.getByText('Released')).toBeTruthy();
    expect(screen.getByText('Nationalities')).toBeTruthy();
    expect(screen.getByText('Estimated Total')).toBeTruthy();
    expect(screen.getByText('200+')).toBeTruthy();
  });

  it('renders all category filter buttons', () => {
    render(<ChinaExitBan />);
    expect(screen.getByText(/All Cases/)).toBeTruthy();
    expect(screen.getByText(/Foreign Nationals/)).toBeTruthy();
    expect(screen.getByText(/^Activists/)).toBeTruthy();
    expect(screen.getByText(/^Journalists \(/)).toBeTruthy();
    expect(screen.getByText(/Business People/)).toBeTruthy();
    expect(screen.getByText(/^Uyghurs/)).toBeTruthy();
  });

  it('renders all cases by default', () => {
    render(<ChinaExitBan />);
    expect(screen.getByText('Liu Kai')).toBeTruthy();
    expect(screen.getByText('Victor Liu')).toBeTruthy();
    expect(screen.getByText('Michael Spavor')).toBeTruthy();
    expect(screen.getByText('Michael Kovrig')).toBeTruthy();
  });

  it('filters cases by category when clicking Foreign Nationals', () => {
    render(<ChinaExitBan />);
    fireEvent.click(screen.getByText(/Foreign Nationals/));
    expect(screen.getByText('Liu Kai')).toBeTruthy();
    expect(screen.getByText('Victor Liu')).toBeTruthy();
    expect(screen.queryByText('Haze Fan')).toBeFalsy();
    expect(screen.queryByText('Idris Hasan')).toBeFalsy();
  });

  it('filters cases by Journalists category', () => {
    render(<ChinaExitBan />);
    fireEvent.click(screen.getByText(/^Journalists \(/));
    expect(screen.getByText('Haze Fan')).toBeTruthy();
    expect(screen.getByText('Cheng Lei')).toBeTruthy();
    expect(screen.queryByText('Liu Kai')).toBeFalsy();
  });

  it('renders the search input', () => {
    render(<ChinaExitBan />);
    expect(screen.getByLabelText('Search')).toBeTruthy();
  });

  it('filters cases by search term', () => {
    render(<ChinaExitBan />);
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'Michael' } });
    expect(screen.getByText('Michael Spavor')).toBeTruthy();
    expect(screen.getByText('Michael Kovrig')).toBeTruthy();
    expect(screen.queryByText('Liu Kai')).toBeFalsy();
  });

  it('renders Travel Warning section', () => {
    render(<ChinaExitBan />);
    expect(screen.getByText('Travel Warning')).toBeTruthy();
    expect(screen.getByText(/China uses exit bans/)).toBeTruthy();
  });

  it('renders What You Can Do section', () => {
    render(<ChinaExitBan />);
    expect(screen.getByText('What You Can Do')).toBeTruthy();
    expect(screen.getByText('Before Travel:')).toBeTruthy();
    expect(screen.getByText('Advocacy:')).toBeTruthy();
    expect(screen.getByText('Resources:')).toBeTruthy();
  });

  it('renders status badges', () => {
    render(<ChinaExitBan />);
    expect(screen.getAllByText('EXIT BAN').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/RELEASED/).length).toBeGreaterThanOrEqual(1);
  });

  it('returns to all cases when All Cases is clicked', () => {
    render(<ChinaExitBan />);
    fireEvent.click(screen.getByText(/^Journalists \(/));
    expect(screen.queryByText('Liu Kai')).toBeFalsy();
    fireEvent.click(screen.getByText(/All Cases/));
    expect(screen.getByText('Liu Kai')).toBeTruthy();
  });
});
