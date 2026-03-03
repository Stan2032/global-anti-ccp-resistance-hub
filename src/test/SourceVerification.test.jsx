import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import SourceVerification from '../components/SourceVerification';

describe('SourceVerification', () => {
  it('renders the header with title', () => {
    render(<SourceVerification />);
    expect(screen.getByText('Source Verification Guide')).toBeTruthy();
  });

  it('renders subtitle', () => {
    render(<SourceVerification />);
    expect(screen.getByText('Verify information and identify reliable sources')).toBeTruthy();
  });

  it('renders all three tab buttons', () => {
    render(<SourceVerification />);
    expect(screen.getByText('Trusted Sources')).toBeTruthy();
    expect(screen.getByText('Sources to Avoid')).toBeTruthy();
    expect(screen.getByText('Verification Tips')).toBeTruthy();
  });

  it('shows Trusted Sources tab by default', () => {
    render(<SourceVerification />);
    expect(screen.getByText('Research Organizations')).toBeTruthy();
    expect(screen.getByText(/Australian Strategic Policy Institute/)).toBeTruthy();
  });

  it('renders all source categories', () => {
    render(<SourceVerification />);
    expect(screen.getByText('Research Organizations')).toBeTruthy();
    expect(screen.getByText('Government & Legal')).toBeTruthy();
    expect(screen.getByText('News & Media')).toBeTruthy();
    expect(screen.getByText('Academic')).toBeTruthy();
  });

  it('renders key sources in default view', () => {
    render(<SourceVerification />);
    expect(screen.getByText(/Safeguard Defenders/)).toBeTruthy();
    expect(screen.getByText(/Human Rights Watch/)).toBeTruthy();
    expect(screen.getByText(/Radio Free Asia/)).toBeTruthy();
    expect(screen.getByText(/Xinjiang Victims Database/)).toBeTruthy();
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

  it('switches to Sources to Avoid tab', () => {
    render(<SourceVerification />);
    fireEvent.click(screen.getByText('Sources to Avoid'));
    expect(screen.getByText('Global Times')).toBeTruthy();
    expect(screen.getByText('CGTN')).toBeTruthy();
    expect(screen.getByText('Xinhua')).toBeTruthy();
    expect(screen.getByText('China Daily')).toBeTruthy();
    expect(screen.getByText('The Grayzone')).toBeTruthy();
  });

  it('shows source type badges on avoid tab', () => {
    render(<SourceVerification />);
    fireEvent.click(screen.getByText('Sources to Avoid'));
    const stateMedia = screen.getAllByText('CCP State Media');
    expect(stateMedia.length).toBe(4);
    expect(screen.getByText('Disinformation Outlet')).toBeTruthy();
  });

  it('switches to Verification Tips tab', () => {
    render(<SourceVerification />);
    fireEvent.click(screen.getByText('Verification Tips'));
    expect(screen.getByText('Check the Source')).toBeTruthy();
    expect(screen.getByText('Look for Primary Documents')).toBeTruthy();
    expect(screen.getByText('Cross-Reference')).toBeTruthy();
    expect(screen.getByText('Check Dates')).toBeTruthy();
    expect(screen.getByText('Beware of Whataboutism')).toBeTruthy();
    expect(screen.getByText('Understand CCP Tactics')).toBeTruthy();
  });

  it('shows CCP disinformation tactics on tips tab', () => {
    render(<SourceVerification />);
    fireEvent.click(screen.getByText('Verification Tips'));
    expect(screen.getByText('Denial')).toBeTruthy();
    expect(screen.getByText('Discrediting')).toBeTruthy();
    expect(screen.getByText('Whataboutism')).toBeTruthy();
    expect(screen.getByText('Flooding')).toBeTruthy();
    expect(screen.getByText('Co-opting')).toBeTruthy();
  });

  it('renders footer guidance', () => {
    render(<SourceVerification />);
    expect(screen.getByText(/cross-reference multiple independent sources/)).toBeTruthy();
  });
});
