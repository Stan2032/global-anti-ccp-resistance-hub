import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import HongKongStatus from '../components/HongKongStatus';

describe('HongKongStatus', () => {
  // --- Header ---

  it('renders the header with title', () => {
    render(<HongKongStatus />);
    expect(screen.getByText('Hong Kong Freedom Status')).toBeTruthy();
    expect(screen.getByText('Tracking erosion of autonomy since 2020')).toBeTruthy();
  });

  it('shows the status banner', () => {
    render(<HongKongStatus />);
    expect(screen.getByText('ONE COUNTRY, ONE SYSTEM')).toBeTruthy();
    expect(screen.getByText(/Jimmy Lai sentenced to 20 years/)).toBeTruthy();
  });

  // --- Key Statistics ---

  it('renders all 4 key statistics', () => {
    render(<HongKongStatus />);
    expect(screen.getByText('10,000+')).toBeTruthy();
    expect(screen.getByText('Arrested since 2019')).toBeTruthy();
    expect(screen.getByText('291+')).toBeTruthy();
    expect(screen.getByText('Charged under NSL')).toBeTruthy();
    expect(screen.getByText('10+')).toBeTruthy();
    expect(screen.getByText('Media outlets closed')).toBeTruthy();
    expect(screen.getByText('500,000+')).toBeTruthy();
    expect(screen.getByText('Emigrated since 2020')).toBeTruthy();
  });

  // --- Tab Navigation ---

  it('renders all 4 tab buttons', () => {
    render(<HongKongStatus />);
    expect(screen.getByText('Overview')).toBeTruthy();
    expect(screen.getByText('Repressive Laws')).toBeTruthy();
    expect(screen.getByText('Arrests & Trials')).toBeTruthy();
    expect(screen.getByText('Exodus')).toBeTruthy();
  });

  it('shows Overview tab content by default (closed orgs)', () => {
    render(<HongKongStatus />);
    expect(screen.getByText('Closed Organizations')).toBeTruthy();
    expect(screen.getByText('Apple Daily')).toBeTruthy();
    expect(screen.getByText('Stand News')).toBeTruthy();
    expect(screen.getByText('HK Alliance')).toBeTruthy();
    expect(screen.getByText('PTU (95K members)')).toBeTruthy();
  });

  it('switches to Repressive Laws tab', () => {
    render(<HongKongStatus />);
    fireEvent.click(screen.getByText('Repressive Laws'));
    expect(screen.getByText('National Security Law (NSL)')).toBeTruthy();
    expect(screen.getByText('Article 23')).toBeTruthy();
    expect(screen.getByText('Criminalizes secession, subversion, terrorism, and collusion with foreign forces.')).toBeTruthy();
    expect(screen.getByText('Retroactive application')).toBeTruthy();
  });

  it('switches to Arrests & Trials tab', () => {
    render(<HongKongStatus />);
    fireEvent.click(screen.getByText('Arrests & Trials'));
    expect(screen.getByText('Jimmy Lai')).toBeTruthy();
    expect(screen.getByText('SENTENCED')).toBeTruthy();
    expect(screen.getByText('Hong Kong 47')).toBeTruthy();
    expect(screen.getByText('45 CONVICTED')).toBeTruthy();
    expect(screen.getByText('Chow Hang-tung')).toBeTruthy();
  });

  it('switches to Exodus tab', () => {
    render(<HongKongStatus />);
    fireEvent.click(screen.getByText('Exodus'));
    // The 500,000+ appears in both stats and exodus tab — check specific exodus text
    expect(screen.getByText('Estimated emigrants since 2020')).toBeTruthy();
    expect(screen.getByText('180,000+ (BNO)')).toBeTruthy();
  });

  it('hides previous tab content when switching tabs', () => {
    render(<HongKongStatus />);
    // Default is Overview — closed orgs visible
    expect(screen.getByText('Closed Organizations')).toBeTruthy();
    // Switch to Arrests
    fireEvent.click(screen.getByText('Arrests & Trials'));
    expect(screen.queryByText('Closed Organizations')).toBeFalsy();
  });

  // --- Resources ---

  it('renders resource links', () => {
    render(<HongKongStatus />);
    expect(screen.getByText('Hong Kong Watch')).toBeTruthy();
    expect(screen.getByText('HK Democracy Council')).toBeTruthy();
    expect(screen.getByText('CECC Hong Kong')).toBeTruthy();
  });

  it('resource links open in new tab', () => {
    render(<HongKongStatus />);
    const hkwLink = screen.getByText('Hong Kong Watch').closest('a');
    expect(hkwLink.getAttribute('target')).toBe('_blank');
    expect(hkwLink.getAttribute('rel')).toContain('noopener');
    expect(hkwLink.getAttribute('href')).toBe('https://www.hongkongwatch.org/');
  });
});
