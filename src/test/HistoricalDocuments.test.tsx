// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import HistoricalDocuments from '../components/HistoricalDocuments';

describe('HistoricalDocuments', () => {
  it('renders the header with title', () => {
    render(<HistoricalDocuments />);
    expect(screen.getByText('Historical Documents Archive')).toBeTruthy();
  });

  it('renders subtitle', () => {
    render(<HistoricalDocuments />);
    expect(screen.getByText('Key documents exposing CCP human rights abuses')).toBeTruthy();
  });

  it('renders archive notice', () => {
    render(<HistoricalDocuments />);
    expect(screen.getByText('About This Archive')).toBeTruthy();
  });

  it('renders all category filter buttons', () => {
    render(<HistoricalDocuments />);
    expect(screen.getByText('All Documents')).toBeTruthy();
    // These texts appear in both buttons and document cards, so use getAllByText
    expect(screen.getAllByText('Leaked Documents').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Official Documents').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Speeches').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('International Reports').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Historical Documents').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Research Reports').length).toBeGreaterThanOrEqual(1);
  });

  it('renders statistics panel', () => {
    render(<HistoricalDocuments />);
    expect(screen.getAllByText('14').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Documents/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Critical Evidence')).toBeTruthy();
    // "Downloadable" appears in both stats label and document badges
    expect(screen.getAllByText('Downloadable').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Leaked Docs')).toBeTruthy();
  });

  it('renders key documents by default', () => {
    render(<HistoricalDocuments />);
    expect(screen.getByText('Xinjiang Police Files')).toBeTruthy();
    expect(screen.getByText('China Cables')).toBeTruthy();
    expect(screen.getByText('Tiananmen Papers')).toBeTruthy();
    // "Charter 08" appears as both title and tag, use getAllByText
    expect(screen.getAllByText('Charter 08').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Newlines Institute Genocide Report')).toBeTruthy();
    const viewButtons = screen.getAllByText('View Document');
    expect(viewButtons.length).toBe(14);
  });

  it('filters by Leaked Documents category', () => {
    render(<HistoricalDocuments />);
    const leakedBtn = screen.getAllByText('Leaked Documents');
    fireEvent.click(leakedBtn[0]);
    expect(screen.getByText('Xinjiang Police Files')).toBeTruthy();
    expect(screen.getByText('China Cables')).toBeTruthy();
    expect(screen.getByText('Karakax List')).toBeTruthy();
    expect(screen.queryByText('Charter 08')).toBeFalsy();
    expect(screen.queryByText('Tiananmen Papers')).toBeFalsy();
  });

  it('filters by International Reports category', () => {
    render(<HistoricalDocuments />);
    const reportsBtn = screen.getAllByText('International Reports');
    fireEvent.click(reportsBtn[0]);
    expect(screen.getByText('Newlines Institute Genocide Report')).toBeTruthy();
    expect(screen.getByText('Uyghur Tribunal Judgment')).toBeTruthy();
    expect(screen.queryByText('Xinjiang Police Files')).toBeFalsy();
  });

  it('searches documents by title', () => {
    render(<HistoricalDocuments />);
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'Xinjiang' } });
    expect(screen.getByText('Xinjiang Police Files')).toBeTruthy();
    expect(screen.queryByText('Charter 08')).toBeFalsy();
  });

  it('searches documents by tag', () => {
    render(<HistoricalDocuments />);
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'Tiananmen' } });
    expect(screen.getByText('Tiananmen Papers')).toBeTruthy();
  });

  it('shows no results message for empty search', () => {
    render(<HistoricalDocuments />);
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('No documents match your search criteria')).toBeTruthy();
  });

  it('displays significance badges', () => {
    render(<HistoricalDocuments />);
    const criticalBadges = screen.getAllByText('Critical Significance');
    expect(criticalBadges.length).toBeGreaterThan(0);
    const highBadges = screen.getAllByText('High Significance');
    expect(highBadges.length).toBeGreaterThan(0);
  });

  it('renders usage guidelines', () => {
    render(<HistoricalDocuments />);
    expect(screen.getByText('How to Use These Documents')).toBeTruthy();
    expect(screen.getByText(/Cite properly/)).toBeTruthy();
    expect(screen.getByText(/Verify translations/)).toBeTruthy();
  });

  it('returns to all documents when All Documents is clicked', () => {
    render(<HistoricalDocuments />);
    // Filter to Leaked Documents first
    const leakedBtns = screen.getAllByText('Leaked Documents');
    fireEvent.click(leakedBtns[0]); // first is the filter button
    expect(screen.queryAllByText('Charter 08').length).toBe(0);
    // Return to all
    fireEvent.click(screen.getByText('All Documents'));
    expect(screen.getAllByText('Charter 08').length).toBeGreaterThanOrEqual(1);
    const viewButtons = screen.getAllByText('View Document');
    expect(viewButtons.length).toBe(14);
  });
});
