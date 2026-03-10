import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import IPACMembers from '../components/IPACMembers';

describe('IPACMembers', () => {
  it('renders the header with title', () => {
    render(<IPACMembers />);
    expect(screen.getByText('Inter-Parliamentary Alliance on China (IPAC)')).toBeTruthy();
  });

  it('renders overview description', () => {
    render(<IPACMembers />);
    expect(screen.getByText(/cross-party group of legislators/)).toBeTruthy();
  });

  it('renders overview statistics', () => {
    render(<IPACMembers />);
    expect(screen.getByText('250+')).toBeTruthy();
    expect(screen.getByText('Legislators')).toBeTruthy();
    expect(screen.getByText('30+')).toBeTruthy();
    expect(screen.getByText('Countries')).toBeTruthy();
    expect(screen.getByText('2020')).toBeTruthy();
    expect(screen.getByText('Founded')).toBeTruthy();
  });

  it('renders country filter buttons', () => {
    render(<IPACMembers />);
    expect(screen.getByText('All Countries')).toBeTruthy();
    // Country names appear in both filter buttons and section headers
    expect(screen.getAllByText(/United States/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/United Kingdom/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/European Parliament/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders all countries by default', () => {
    render(<IPACMembers />);
    expect(screen.getByText('Marco Rubio')).toBeTruthy();
    expect(screen.getByText('Iain Duncan Smith')).toBeTruthy();
    expect(screen.getByText('Reinhard Bütikofer')).toBeTruthy();
    expect(screen.getByText('Gen Nakatani')).toBeTruthy();
  });

  it('filters by US members', () => {
    render(<IPACMembers />);
    // Click the US filter button
    const usButtons = screen.getAllByText(/United States/);
    fireEvent.click(usButtons[0]);
    expect(screen.getByText('Marco Rubio')).toBeTruthy();
    expect(screen.getByText('Jim McGovern')).toBeTruthy();
    expect(screen.queryByText('Iain Duncan Smith')).toBeFalsy();
    expect(screen.queryByText('Reinhard Bütikofer')).toBeFalsy();
  });

  it('filters by UK members', () => {
    render(<IPACMembers />);
    const ukButtons = screen.getAllByText(/United Kingdom/);
    fireEvent.click(ukButtons[0]);
    expect(screen.getByText('Iain Duncan Smith')).toBeTruthy();
    expect(screen.getByText('Tim Loughton')).toBeTruthy();
    expect(screen.queryByText('Marco Rubio')).toBeFalsy();
  });

  it('returns to all countries when All Countries is clicked', () => {
    render(<IPACMembers />);
    const ukButtons = screen.getAllByText(/United Kingdom/);
    fireEvent.click(ukButtons[0]);
    expect(screen.queryByText('Marco Rubio')).toBeFalsy();
    fireEvent.click(screen.getByText('All Countries'));
    expect(screen.getByText('Marco Rubio')).toBeTruthy();
  });

  it('shows party affiliations', () => {
    render(<IPACMembers />);
    // Party labels in parentheses
    expect(screen.getAllByText('(R)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('(D)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('(Con)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('(Greens)').length).toBeGreaterThan(0);
  });

  it('highlights chair roles', () => {
    render(<IPACMembers />);
    const coChairs = screen.getAllByText('Co-Chair');
    expect(coChairs.length).toBeGreaterThan(0);
  });

  it('renders key achievements', () => {
    render(<IPACMembers />);
    expect(screen.getByText('Key Achievements')).toBeTruthy();
    expect(screen.getByText('Coordinated Magnitsky sanctions on CCP officials')).toBeTruthy();
    expect(screen.getByText('Supported Hong Kong democracy activists')).toBeTruthy();
    expect(screen.getByText('Advocated for Uyghur genocide recognition')).toBeTruthy();
  });

  it('renders resources section', () => {
    render(<IPACMembers />);
    expect(screen.getByText('Resources')).toBeTruthy();
    expect(screen.getByText('IPAC Official Website')).toBeTruthy();
    expect(screen.getByText('US CECC')).toBeTruthy();
  });
});
