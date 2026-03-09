// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import DiasporaSupport from '../components/DiasporaSupport';

describe('DiasporaSupport', () => {
  it('renders the header with title', () => {
    render(<DiasporaSupport />);
    expect(screen.getByText('Diaspora Support Resources')).toBeTruthy();
  });

  it('renders the emergency banner', () => {
    render(<DiasporaSupport />);
    expect(screen.getByText('In Immediate Danger?')).toBeTruthy();
  });

  it('renders warning signs section', () => {
    render(<DiasporaSupport />);
    expect(screen.getByText('Warning Signs of Transnational Repression')).toBeTruthy();
    expect(screen.getByText('Unexpected contact from Chinese officials or police')).toBeTruthy();
  });

  it('renders all category filter buttons', () => {
    render(<DiasporaSupport />);
    expect(screen.getAllByText('All Resources').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Legal Aid').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Mental Health').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Immigration').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Digital Security').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Community').length).toBeGreaterThanOrEqual(1);
  });

  it('renders all organizations by default', () => {
    render(<DiasporaSupport />);
    expect(screen.getByText('Safeguard Defenders')).toBeTruthy();
    expect(screen.getByText('Hong Kong Watch')).toBeTruthy();
    expect(screen.getByText('Electronic Frontier Foundation')).toBeTruthy();
    expect(screen.getByText('Citizen Lab')).toBeTruthy();
  });

  it('filters by Legal Aid category', () => {
    render(<DiasporaSupport />);
    // Get the category button (avoid matching the type label on cards)
    const legalButtons = screen.getAllByText('Legal Aid');
    // Click the filter button (first one is in the filter bar)
    fireEvent.click(legalButtons[0]);
    expect(screen.getByText('Safeguard Defenders')).toBeTruthy();
    expect(screen.getByText('Chinese Human Rights Defenders')).toBeTruthy();
    expect(screen.getByText('Front Line Defenders')).toBeTruthy();
    expect(screen.queryByText('Hong Kong Watch')).toBeFalsy();
    expect(screen.queryByText('Electronic Frontier Foundation')).toBeFalsy();
  });

  it('filters by Digital Security category', () => {
    render(<DiasporaSupport />);
    const dsButtons = screen.getAllByText('Digital Security');
    fireEvent.click(dsButtons[0]);
    expect(screen.getByText('Access Now Digital Security Helpline')).toBeTruthy();
    expect(screen.getByText('Electronic Frontier Foundation')).toBeTruthy();
    expect(screen.queryByText('Safeguard Defenders')).toBeFalsy();
  });

  it('filters by Immigration category', () => {
    render(<DiasporaSupport />);
    fireEvent.click(screen.getByText('Immigration'));
    expect(screen.getByText('Hong Kong Watch')).toBeTruthy();
    expect(screen.getByText('Uyghur Human Rights Project')).toBeTruthy();
    expect(screen.getByText('Tibet Justice Center')).toBeTruthy();
    expect(screen.queryByText('Electronic Frontier Foundation')).toBeFalsy();
  });

  it('returns to all resources when All Resources is clicked', () => {
    render(<DiasporaSupport />);
    const dsButtons = screen.getAllByText('Digital Security');
    fireEvent.click(dsButtons[0]);
    expect(screen.queryByText('Safeguard Defenders')).toBeFalsy();

    const allButtons = screen.getAllByText('All Resources');
    fireEvent.click(allButtons[0]);
    expect(screen.getByText('Safeguard Defenders')).toBeTruthy();
  });

  it('renders safety tips section', () => {
    render(<DiasporaSupport />);
    expect(screen.getByText('Safety Tips for Diaspora')).toBeTruthy();
    expect(screen.getByText('Digital Security:')).toBeTruthy();
    expect(screen.getByText('Physical Security:')).toBeTruthy();
  });

  it('renders emergency contact info', () => {
    render(<DiasporaSupport />);
    expect(screen.getByText(/Front Line Defenders: \+353 1 210 0489/)).toBeTruthy();
  });

  it('renders 24/7 EMERGENCY badge for emergency resources', () => {
    render(<DiasporaSupport />);
    expect(screen.getByText('24/7 EMERGENCY')).toBeTruthy();
  });
});
