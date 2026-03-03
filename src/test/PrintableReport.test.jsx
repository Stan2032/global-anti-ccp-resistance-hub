import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import PrintableReport from '../components/PrintableReport';

describe('PrintableReport', () => {
  // --- Initial State (Button) ---

  it('renders generate report button initially', () => {
    render(<PrintableReport />);
    expect(screen.getByText('Generate Report')).toBeTruthy();
  });

  it('generate button has printer icon', () => {
    render(<PrintableReport />);
    expect(screen.getByLabelText('Generate printable report')).toBeTruthy();
  });

  // --- Opening Report ---

  it('shows report panel when button is clicked', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    expect(screen.getByText('$ generate_report')).toBeTruthy();
  });

  it('shows print button when report is open', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    expect(screen.getByLabelText('Print report')).toBeTruthy();
  });

  it('shows close button when report is open', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    expect(screen.getByLabelText('Close report generator')).toBeTruthy();
  });

  // --- Report Content ---

  it('shows report title', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    expect(screen.getByText(/CCP Human Rights Abuses — Summary Report/)).toBeTruthy();
  });

  it('shows KEY STATISTICS section', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    expect(screen.getByText('KEY STATISTICS')).toBeTruthy();
  });

  it('shows key facts data in table', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    expect(screen.getByText('Political prisoners documented')).toBeTruthy();
    expect(screen.getByText('63+')).toBeTruthy();
    expect(screen.getByText('Uyghurs in detention camps')).toBeTruthy();
    expect(screen.getByText('1–3 million')).toBeTruthy();
    expect(screen.getByText('Overseas CCP police stations')).toBeTruthy();
    expect(screen.getByText('102+')).toBeTruthy();
  });

  it('shows source citations for key facts', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    expect(screen.getByText('CECC, HRW, Amnesty')).toBeTruthy();
    expect(screen.getByText('ASPI, OHCHR')).toBeTruthy();
    expect(screen.getByText('Safeguard Defenders')).toBeTruthy();
  });

  it('shows table headers', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    expect(screen.getByText('Metric')).toBeTruthy();
    expect(screen.getByText('Count')).toBeTruthy();
    expect(screen.getByText('Source')).toBeTruthy();
  });

  it('shows URGENT ALERTS section with active alerts', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    expect(screen.getByText(/URGENT ALERTS/)).toBeTruthy();
  });

  it('shows WHAT YOU CAN DO section', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    expect(screen.getByText('WHAT YOU CAN DO')).toBeTruthy();
  });

  it('lists action items', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    expect(screen.getByText(/Contact your elected representatives/)).toBeTruthy();
    expect(screen.getByText(/Support organizations like Hong Kong Watch/)).toBeTruthy();
    expect(screen.getByText(/Share verified information on social media/)).toBeTruthy();
  });

  it('shows CC BY 4.0 license notice', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    expect(screen.getByText(/CC BY 4.0/)).toBeTruthy();
  });

  it('shows Tier 1-2 sources attribution', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    expect(screen.getByText(/Tier 1-2 organizations/)).toBeTruthy();
  });

  // --- Expand / Collapse ---

  it('shows "show full preview" button initially', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    expect(screen.getByText(/show full preview/)).toBeTruthy();
  });

  it('expands preview when "show full preview" clicked', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    fireEvent.click(screen.getByText(/show full preview/));
    // After expanding, the expand button should be gone
    expect(screen.queryByText(/show full preview/)).toBeFalsy();
  });

  it('can collapse expanded preview', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    // Expand
    fireEvent.click(screen.getByText(/show full preview/));
    // Collapse
    fireEvent.click(screen.getByLabelText('Collapse preview'));
    expect(screen.getByText(/show full preview/)).toBeTruthy();
  });

  // --- Close ---

  it('closes report panel when close button clicked', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    expect(screen.getByText('$ generate_report')).toBeTruthy();

    fireEvent.click(screen.getByLabelText('Close report generator'));
    expect(screen.queryByText('$ generate_report')).toBeFalsy();
    expect(screen.getByText('Generate Report')).toBeTruthy();
  });

  // --- Print ---

  it('opens new window and calls print when print button clicked', () => {
    const mockWrite = vi.fn();
    const mockClose = vi.fn();
    const mockPrint = vi.fn();
    const mockOpen = vi.fn(() => ({
      document: { write: mockWrite, close: mockClose },
      print: mockPrint,
    }));
    vi.spyOn(window, 'open').mockImplementation(mockOpen);

    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    fireEvent.click(screen.getByLabelText('Print report'));

    expect(mockOpen).toHaveBeenCalledWith('', '_blank');
    expect(mockWrite).toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalled();
    expect(mockPrint).toHaveBeenCalled();

    window.open.mockRestore();
  });

  it('handles blocked popup gracefully', () => {
    vi.spyOn(window, 'open').mockImplementation(() => null);

    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    // Should not throw
    expect(() => {
      fireEvent.click(screen.getByLabelText('Print report'));
    }).not.toThrow();

    window.open.mockRestore();
  });

  // --- Generated date ---

  it('shows current date in report', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    const now = new Date();
    const monthStr = now.toLocaleDateString('en-US', { month: 'long' });
    const matches = screen.getAllByText(new RegExp(monthStr));
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  // --- All 8 key facts ---

  it('shows all 8 key facts', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    expect(screen.getByText('Political prisoners documented')).toBeTruthy();
    expect(screen.getByText('Uyghurs in detention camps')).toBeTruthy();
    expect(screen.getByText('Overseas CCP police stations')).toBeTruthy();
    expect(screen.getByText('HK political prisoners (NSL)')).toBeTruthy();
    expect(screen.getByText('Forced labor companies flagged')).toBeTruthy();
    expect(screen.getByText('Detention facilities (Xinjiang)')).toBeTruthy();
    expect(screen.getByText('Journalists imprisoned')).toBeTruthy();
    expect(screen.getByText('Sanctioned officials/entities')).toBeTruthy();
  });

  // --- All 6 action items ---

  it('shows all 6 action items', () => {
    render(<PrintableReport />);
    fireEvent.click(screen.getByText('Generate Report'));
    expect(screen.getByText(/Contact your elected representatives/)).toBeTruthy();
    expect(screen.getByText(/Check the UFLPA Entity List/)).toBeTruthy();
    expect(screen.getByText(/Support organizations/)).toBeTruthy();
    expect(screen.getByText(/Share verified information/)).toBeTruthy();
    expect(screen.getByText(/Attend vigils/)).toBeTruthy();
    expect(screen.getByText(/Report suspected CCP interference/)).toBeTruthy();
  });
});
