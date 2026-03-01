import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import DataExport from '../components/DataExport';

describe('DataExport', () => {
  // --- Rendering ---

  it('renders the export header', () => {
    render(<DataExport />);
    expect(screen.getByText('Data Export for Researchers')).toBeTruthy();
    expect(screen.getByText('Download structured data for research and analysis')).toBeTruthy();
  });

  it('renders CC BY 4.0 license notice', () => {
    render(<DataExport />);
    expect(screen.getByText(/Creative Commons Attribution 4.0/)).toBeTruthy();
  });

  // --- Dataset Selection ---

  it('renders all 8 datasets', () => {
    render(<DataExport />);
    expect(screen.getByText('Political Prisoners Database')).toBeTruthy();
    expect(screen.getByText('Overseas Police Stations')).toBeTruthy();
    expect(screen.getByText('Human Rights Organizations')).toBeTruthy();
    expect(screen.getByText('Sanctioned Officials & Entities')).toBeTruthy();
    expect(screen.getByText('Confucius Institutes')).toBeTruthy();
    expect(screen.getByText('Forced Labor Companies')).toBeTruthy();
    expect(screen.getByText('Historical Timeline')).toBeTruthy();
    expect(screen.getByText('Detention Facilities')).toBeTruthy();
  });

  it('shows record counts for datasets', () => {
    render(<DataExport />);
    expect(screen.getByText('62 records')).toBeTruthy(); // prisoners
    expect(screen.getByText('47 records')).toBeTruthy(); // sanctions
    expect(screen.getByText('31 records')).toBeTruthy(); // timeline
  });

  it('renders Select All and Clear buttons', () => {
    render(<DataExport />);
    expect(screen.getByText('Select All')).toBeTruthy();
    expect(screen.getByText('Clear')).toBeTruthy();
  });

  it('selects a dataset when clicked', () => {
    render(<DataExport />);
    fireEvent.click(screen.getByText('Political Prisoners Database'));
    // Summary should show 1 dataset selected
    expect(screen.getByText(/1 dataset selected/)).toBeTruthy();
    expect(screen.getByText(/62 total records/)).toBeTruthy();
  });

  it('deselects a dataset when clicked again', () => {
    render(<DataExport />);
    fireEvent.click(screen.getByText('Political Prisoners Database'));
    expect(screen.getByText(/1 dataset selected/)).toBeTruthy();
    fireEvent.click(screen.getByText('Political Prisoners Database'));
    expect(screen.getByText(/0 datasets selected/)).toBeTruthy();
  });

  it('selects all datasets when Select All is clicked', () => {
    render(<DataExport />);
    fireEvent.click(screen.getByText('Select All'));
    expect(screen.getByText(/8 datasets selected/)).toBeTruthy();
  });

  it('clears all datasets when Clear is clicked', () => {
    render(<DataExport />);
    fireEvent.click(screen.getByText('Select All'));
    fireEvent.click(screen.getByText('Clear'));
    expect(screen.getByText(/0 datasets selected/)).toBeTruthy();
  });

  // --- Format Selection ---

  it('renders all 3 export formats', () => {
    render(<DataExport />);
    expect(screen.getByText('JSON')).toBeTruthy();
    expect(screen.getByText('CSV')).toBeTruthy();
    expect(screen.getByText('Markdown')).toBeTruthy();
  });

  it('shows format descriptions', () => {
    render(<DataExport />);
    expect(screen.getByText(/best for developers/)).toBeTruthy();
    expect(screen.getByText(/best for spreadsheets/)).toBeTruthy();
    expect(screen.getByText(/best for documentation/)).toBeTruthy();
  });

  it('defaults to JSON format', () => {
    render(<DataExport />);
    // Export summary should show JSON format
    expect(screen.getByText(/JSON format/)).toBeTruthy();
  });

  it('updates format when a different format is selected', () => {
    render(<DataExport />);
    fireEvent.click(screen.getByText('CSV'));
    expect(screen.getByText(/CSV format/)).toBeTruthy();
    fireEvent.click(screen.getByText('Markdown'));
    expect(screen.getByText(/MARKDOWN format/)).toBeTruthy();
  });

  // --- Export Button ---

  it('disables Download button when no datasets selected', () => {
    render(<DataExport />);
    const button = screen.getByText('Download Export');
    expect(button.closest('button').disabled).toBe(true);
  });

  it('enables Download button when datasets are selected', () => {
    render(<DataExport />);
    fireEvent.click(screen.getByText('Political Prisoners Database'));
    const button = screen.getByText('Download Export');
    expect(button.closest('button').disabled).toBe(false);
  });

  // --- Export Summary ---

  it('calculates total records across selected datasets', () => {
    render(<DataExport />);
    // Select prisoners (62) and sanctions (47)
    fireEvent.click(screen.getByText('Political Prisoners Database'));
    fireEvent.click(screen.getByText('Sanctioned Officials & Entities'));
    expect(screen.getByText(/2 datasets selected/)).toBeTruthy();
    expect(screen.getByText(/109 total records/)).toBeTruthy();
  });

  // --- Usage Guidelines ---

  it('renders usage guidelines', () => {
    render(<DataExport />);
    expect(screen.getByText('Usage Guidelines')).toBeTruthy();
    expect(screen.getByText('Recommended Uses')).toBeTruthy();
    expect(screen.getByText('Attribution Format')).toBeTruthy();
  });

  it('lists recommended use cases', () => {
    render(<DataExport />);
    expect(screen.getByText(/Academic research/)).toBeTruthy();
    expect(screen.getByText(/Journalism/)).toBeTruthy();
    expect(screen.getByText(/Policy analysis/)).toBeTruthy();
  });
});
