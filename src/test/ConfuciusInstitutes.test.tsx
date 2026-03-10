import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import ConfuciusInstitutes from '../components/ConfuciusInstitutes';

describe('ConfuciusInstitutes', () => {
  it('renders the title', () => {
    render(<ConfuciusInstitutes />);
    expect(screen.getByText('Confucius Institute Tracker')).toBeTruthy();
  });

  it('renders stats section with counts', () => {
    render(<ConfuciusInstitutes />);
    expect(screen.getByText('Closed')).toBeTruthy();
    expect(screen.getByText('Still Active')).toBeTruthy();
    expect(screen.getByText('Countries')).toBeTruthy();
    expect(screen.getByText('500+')).toBeTruthy();
    expect(screen.getByText('Worldwide (est.)')).toBeTruthy();
  });

  it('renders region filter buttons', () => {
    render(<ConfuciusInstitutes />);
    expect(screen.getByText('All Regions')).toBeTruthy();
    expect(screen.getByText('North America')).toBeTruthy();
    expect(screen.getByText('Europe')).toBeTruthy();
    expect(screen.getByText('Asia Pacific')).toBeTruthy();
  });

  it('renders the table with correct headers', () => {
    render(<ConfuciusInstitutes />);
    expect(screen.getByText('University')).toBeTruthy();
    expect(screen.getByText('Country')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('Details')).toBeTruthy();
  });

  it('renders university names in the table', () => {
    render(<ConfuciusInstitutes />);
    expect(screen.getByText('Stanford University')).toBeTruthy();
    expect(screen.getByText('University of Chicago')).toBeTruthy();
    expect(screen.getByText('MIT')).toBeTruthy();
    expect(screen.getByText('McMaster University')).toBeTruthy();
  });

  it('filters institutes by North America region', () => {
    render(<ConfuciusInstitutes />);
    fireEvent.click(screen.getByText('North America'));
    expect(screen.getByText('Stanford University')).toBeTruthy();
    expect(screen.getByText('McMaster University')).toBeTruthy();
    expect(screen.queryByText('University of Edinburgh')).toBeFalsy();
    expect(screen.queryByText('University of Sydney')).toBeFalsy();
  });

  it('filters institutes by Europe region', () => {
    render(<ConfuciusInstitutes />);
    fireEvent.click(screen.getByText('Europe'));
    expect(screen.getByText('University of Edinburgh')).toBeTruthy();
    expect(screen.getByText('LSE')).toBeTruthy();
    expect(screen.queryByText('Stanford University')).toBeFalsy();
  });

  it('renders the Show closed institutes checkbox checked by default', () => {
    render(<ConfuciusInstitutes />);
    const checkbox = screen.getByRole('checkbox');
    expect((checkbox as HTMLInputElement).checked).toBe(true);
  });

  it('hides closed institutes when checkbox is unchecked', () => {
    render(<ConfuciusInstitutes />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(screen.queryByText('Stanford University')).toBeFalsy();
    expect(screen.getByText('Brock University')).toBeTruthy();
  });

  it('shows closed institutes again when checkbox is re-checked', () => {
    render(<ConfuciusInstitutes />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(screen.queryByText('Stanford University')).toBeFalsy();
    fireEvent.click(checkbox);
    expect(screen.getByText('Stanford University')).toBeTruthy();
  });

  it('renders Take Action section', () => {
    render(<ConfuciusInstitutes />);
    expect(screen.getByText('Take Action')).toBeTruthy();
    expect(screen.getByText('If Your University Has One:')).toBeTruthy();
  });

  it('renders status badges for closed and active institutes', () => {
    render(<ConfuciusInstitutes />);
    expect(screen.getAllByText(/^CLOSED/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('ACTIVE').length).toBeGreaterThan(0);
  });
});
