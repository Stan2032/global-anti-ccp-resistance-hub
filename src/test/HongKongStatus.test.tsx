import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import HongKongStatus from '../components/HongKongStatus';
import { expectDisclosureSections, inSection } from './helpers/disclosure';

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
    expect(screen.getAllByText('500,000+').length).toBeGreaterThan(0);
    expect(screen.getByText('Emigrated since 2020')).toBeTruthy();
  });

  // --- Sections ---

  it('renders all 4 sections as native disclosures', () => {
    render(<HongKongStatus />);
    expectDisclosureSections(['Overview', 'Repressive Laws', 'Arrests & Trials', 'Exodus']);
  });

  it('shows the Overview section (closed orgs)', () => {
    render(<HongKongStatus />);
    const section = inSection('Overview');
    expect(section.getByText('Closed Organizations')).toBeTruthy();
    expect(section.getByText('Apple Daily')).toBeTruthy();
    expect(section.getByText('Stand News')).toBeTruthy();
    expect(section.getByText('HK Alliance')).toBeTruthy();
    expect(section.getByText('PTU (95K members)')).toBeTruthy();
  });

  it('shows the Repressive Laws section without interaction', () => {
    render(<HongKongStatus />);
    const section = inSection('Repressive Laws');
    expect(section.getByText('National Security Law (NSL)')).toBeTruthy();
    expect(section.getByText('Article 23')).toBeTruthy();
    expect(section.getByText('Criminalizes secession, subversion, terrorism, and collusion with foreign forces.')).toBeTruthy();
    expect(section.getByText('Retroactive application')).toBeTruthy();
  });

  it('shows the Arrests & Trials section without interaction', () => {
    render(<HongKongStatus />);
    const section = inSection('Arrests & Trials');
    expect(section.getByText('Jimmy Lai')).toBeTruthy();
    expect(section.getByText('SENTENCED')).toBeTruthy();
    expect(section.getByText('Hong Kong 47')).toBeTruthy();
    expect(section.getByText('45 CONVICTED')).toBeTruthy();
    expect(section.getByText('Chow Hang-tung')).toBeTruthy();
  });

  it('shows the Exodus section without interaction', () => {
    render(<HongKongStatus />);
    const section = inSection('Exodus');
    // The 500,000+ appears in both the stats and the Exodus section — check specific exodus text
    expect(section.getByText('Estimated emigrants since 2020')).toBeTruthy();
    expect(section.getByText('180,000+ (BNO)')).toBeTruthy();
  });

  it('opening one section hides nothing in the others', () => {
    render(<HongKongStatus />);
    fireEvent.click(screen.getByText('Arrests & Trials'));
    expect(inSection('Overview').getByText('Closed Organizations')).toBeTruthy();
    expect(inSection('Arrests & Trials').getByText('Jimmy Lai')).toBeTruthy();
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
    expect(hkwLink!.getAttribute('target')).toBe('_blank');
    expect(hkwLink!.getAttribute('rel')).toContain('noopener');
    expect(hkwLink!.getAttribute('href')).toBe('https://www.hongkongwatch.org/');
  });
});
