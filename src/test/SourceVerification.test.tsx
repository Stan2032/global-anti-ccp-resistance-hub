import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import SourceVerification from '../components/SourceVerification';
import { expectDisclosureSections, inSection } from './helpers/disclosure';

describe('SourceVerification', () => {
  it('renders the header with title', () => {
    render(<SourceVerification />);
    expect(screen.getByText('Source Verification Guide')).toBeTruthy();
  });

  it('renders subtitle', () => {
    render(<SourceVerification />);
    expect(screen.getByText('Verify information and identify reliable sources')).toBeTruthy();
  });

  it('renders all three sections as native disclosures', () => {
    render(<SourceVerification />);
    expectDisclosureSections(['Trusted Sources', 'Sources to Avoid', 'Verification Tips']);
  });

  it('shows the Trusted Sources section', () => {
    render(<SourceVerification />);
    const section = inSection('Trusted Sources');
    expect(section.getByText('Research Organizations')).toBeTruthy();
    expect(section.getByText(/Australian Strategic Policy Institute/)).toBeTruthy();
  });

  it('renders all source categories', () => {
    render(<SourceVerification />);
    expect(screen.getByText('Research Organizations')).toBeTruthy();
    expect(screen.getByText('Government & Legal')).toBeTruthy();
    expect(screen.getByText('News & Media')).toBeTruthy();
    expect(screen.getByText('Academic')).toBeTruthy();
  });

  it('renders key sources in the Trusted Sources section', () => {
    render(<SourceVerification />);
    const section = inSection('Trusted Sources');
    expect(section.getByText(/Safeguard Defenders/)).toBeTruthy();
    expect(section.getByText(/Human Rights Watch/)).toBeTruthy();
    expect(section.getByText(/Radio Free Asia/)).toBeTruthy();
    expect(section.getByText(/Xinjiang Victims Database/)).toBeTruthy();
  });

  it('shows reliability badges', () => {
    render(<SourceVerification />);
    const highReliable = screen.getAllByText('Highly Reliable');
    expect(highReliable.length).toBeGreaterThan(5);
  });

  it('search filters sources by name', () => {
    render(<SourceVerification />);
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'ASPI' } });
    expect(screen.getByText(/Australian Strategic Policy Institute/)).toBeTruthy();
    expect(screen.queryByText('Government & Legal')).toBeFalsy();
  });

  it('search filters sources by topic', () => {
    render(<SourceVerification />);
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'Xinjiang' } });
    expect(screen.getByText(/Australian Strategic Policy Institute/)).toBeTruthy();
  });

  it('shows the Sources to Avoid section without interaction', () => {
    render(<SourceVerification />);
    const section = inSection('Sources to Avoid');
    expect(section.getByText('Global Times')).toBeTruthy();
    expect(section.getByText('CGTN')).toBeTruthy();
    expect(section.getByText('Xinhua')).toBeTruthy();
    expect(section.getByText('China Daily')).toBeTruthy();
    expect(section.getByText('The Grayzone')).toBeTruthy();
  });

  it('shows source type badges in the Sources to Avoid section', () => {
    render(<SourceVerification />);
    const section = inSection('Sources to Avoid');
    const stateMedia = section.getAllByText('CCP State Media');
    expect(stateMedia.length).toBe(4);
    expect(section.getByText('Disinformation Outlet')).toBeTruthy();
  });

  it('shows the Verification Tips section without interaction', () => {
    render(<SourceVerification />);
    const section = inSection('Verification Tips');
    expect(section.getByText('Check the Source')).toBeTruthy();
    expect(section.getByText('Look for Primary Documents')).toBeTruthy();
    expect(section.getByText('Cross-Reference')).toBeTruthy();
    expect(section.getByText('Check Dates')).toBeTruthy();
    expect(section.getByText('Beware of Whataboutism')).toBeTruthy();
    expect(section.getByText('Understand CCP Tactics')).toBeTruthy();
  });

  it('shows CCP disinformation tactics in the Verification Tips section', () => {
    render(<SourceVerification />);
    const section = inSection('Verification Tips');
    expect(section.getByText('Denial')).toBeTruthy();
    expect(section.getByText('Discrediting')).toBeTruthy();
    expect(section.getByText('Whataboutism')).toBeTruthy();
    expect(section.getByText('Flooding')).toBeTruthy();
    expect(section.getByText('Co-opting')).toBeTruthy();
  });

  it('renders footer guidance', () => {
    render(<SourceVerification />);
    expect(screen.getByText(/cross-reference multiple independent sources/)).toBeTruthy();
  });
});
