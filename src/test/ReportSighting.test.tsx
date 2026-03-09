// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ReportSighting from '../components/ReportSighting';

describe('ReportSighting', () => {
  it('renders the title', () => {
    render(<ReportSighting />);
    expect(screen.getByText('Report CCP Activity')).toBeTruthy();
  });

  it('renders step 1 question', () => {
    render(<ReportSighting />);
    expect(screen.getByText('What type of activity are you reporting?')).toBeTruthy();
  });

  it('renders all 7 sighting types', () => {
    render(<ReportSighting />);
    expect(screen.getByText('Overseas Police Station')).toBeTruthy();
    expect(screen.getByText('Surveillance Activity')).toBeTruthy();
    expect(screen.getByText('Intimidation/Harassment')).toBeTruthy();
    expect(screen.getByText('United Front Activity')).toBeTruthy();
    expect(screen.getByText('Disinformation Campaign')).toBeTruthy();
    expect(screen.getByText('Institutional Infiltration')).toBeTruthy();
    expect(screen.getByText('Other Activity')).toBeTruthy();
  });

  it('renders progress steps', () => {
    render(<ReportSighting />);
    expect(screen.getByText('Type')).toBeTruthy();
    expect(screen.getByText('Details')).toBeTruthy();
    expect(screen.getByText('Review')).toBeTruthy();
  });

  it('renders Coming Soon notice', () => {
    render(<ReportSighting />);
    expect(screen.getByText('Form Not Yet Connected (Coming Soon)')).toBeTruthy();
  });

  it('advances to step 2 when a sighting type is selected', () => {
    render(<ReportSighting />);
    fireEvent.click(screen.getByText('Overseas Police Station'));
    expect(screen.getByLabelText('Country')).toBeTruthy();
    expect(screen.getByLabelText('e.g., London, New York')).toBeTruthy();
    expect(screen.getByLabelText('Date of Observation')).toBeTruthy();
    expect(screen.getByLabelText('Description of observation')).toBeTruthy();
  });

  it('renders back button on step 2 that returns to step 1', () => {
    render(<ReportSighting />);
    fireEvent.click(screen.getByText('Overseas Police Station'));
    fireEvent.click(screen.getByText('← Back'));
    expect(screen.getByText('What type of activity are you reporting?')).toBeTruthy();
  });

  it('advances to step 3 when country and description are filled', () => {
    render(<ReportSighting />);
    fireEvent.click(screen.getByText('Overseas Police Station'));
    fireEvent.change(screen.getByLabelText('Country'), { target: { value: 'United States' } });
    fireEvent.change(screen.getByLabelText('Description of observation'), { target: { value: 'Suspicious activity observed' } });
    fireEvent.click(screen.getByText('Continue →'));
    expect(screen.getByText('Review Your Report')).toBeTruthy();
  });

  it('shows submit button disabled without consent on step 3', () => {
    render(<ReportSighting />);
    fireEvent.click(screen.getByText('Overseas Police Station'));
    fireEvent.change(screen.getByLabelText('Country'), { target: { value: 'United States' } });
    fireEvent.change(screen.getByLabelText('Description of observation'), { target: { value: 'Test description' } });
    fireEvent.click(screen.getByText('Continue →'));
    const submitBtn = screen.getByText('Submit Report');
    expect(submitBtn.disabled).toBe(true);
  });

  it('submits form and shows confirmation message', () => {
    render(<ReportSighting />);
    fireEvent.click(screen.getByText('Overseas Police Station'));
    fireEvent.change(screen.getByLabelText('Country'), { target: { value: 'United States' } });
    fireEvent.change(screen.getByLabelText('Description of observation'), { target: { value: 'Test description' } });
    fireEvent.click(screen.getByText('Continue →'));
    // Check consent
    fireEvent.click(screen.getByText('I consent to share this information *'));
    fireEvent.click(screen.getByText('Submit Report'));
    expect(screen.getByText('Form Not Yet Active')).toBeTruthy();
    expect(screen.getByText('Safeguard Defenders')).toBeTruthy();
    expect(screen.getByText('FBI Tips')).toBeTruthy();
  });

  it('renders official reporting channels in footer', () => {
    render(<ReportSighting />);
    expect(screen.getByText('Report to Official Channels:')).toBeTruthy();
    expect(screen.getByText(/FBI Tips/)).toBeTruthy();
    expect(screen.getByText(/MI5/)).toBeTruthy();
    expect(screen.getByText(/RCMP/)).toBeTruthy();
    expect(screen.getByText(/ASIO/)).toBeTruthy();
    expect(screen.getByText(/Safeguard Defenders/)).toBeTruthy();
  });
});
