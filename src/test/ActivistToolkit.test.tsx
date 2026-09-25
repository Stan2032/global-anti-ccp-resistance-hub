import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import ActivistToolkit from '../components/ActivistToolkit';

// Each resource card ends in a Download link, or says it is not available.
const resourceActions = () => screen.getAllByText(/^(Download|Not available yet)$/);

describe('ActivistToolkit', () => {
  it('renders the header with title', () => {
    render(<ActivistToolkit />);
    expect(screen.getByText('Activist Toolkit')).toBeTruthy();
  });

  it('renders subtitle', () => {
    render(<ActivistToolkit />);
    expect(screen.getByText('Downloadable resources for advocacy and awareness')).toBeTruthy();
  });

  it('renders all category filter buttons', () => {
    render(<ActivistToolkit />);
    expect(screen.getAllByText('All Resources').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Graphics & Banners').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Letter Templates').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Fact Sheets').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('How-To Guides').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Social Media').length).toBeGreaterThanOrEqual(1);
  });

  it('renders all resources by default', () => {
    render(<ActivistToolkit />);
    const downloadButtons = resourceActions();
    expect(downloadButtons.length).toBe(20);
  });

  it('filters resources by Graphics & Banners category', () => {
    render(<ActivistToolkit />);
    const graphicsButtons = screen.getAllByText('Graphics & Banners');
    fireEvent.click(graphicsButtons[0]);
    const downloadButtons = resourceActions();
    expect(downloadButtons.length).toBe(4);
    expect(screen.getByText('Free Jimmy Lai Banner')).toBeTruthy();
    expect(screen.queryByText('Letter to Representative - Uyghur Genocide')).toBeFalsy();
  });

  it('filters resources by Letter Templates category', () => {
    render(<ActivistToolkit />);
    const templateButtons = screen.getAllByText('Letter Templates');
    fireEvent.click(templateButtons[0]);
    const downloadButtons = resourceActions();
    expect(downloadButtons.length).toBe(4);
    expect(screen.getByText('Letter to Representative - Uyghur Genocide')).toBeTruthy();
  });

  it('filters resources by Fact Sheets category', () => {
    render(<ActivistToolkit />);
    const factButtons = screen.getAllByText('Fact Sheets');
    fireEvent.click(factButtons[0]);
    const downloadButtons = resourceActions();
    expect(downloadButtons.length).toBe(4);
    expect(screen.getByText('Uyghur Genocide Fact Sheet')).toBeTruthy();
  });

  it('returns to all resources when All Resources is clicked', () => {
    render(<ActivistToolkit />);
    const graphicsButtons = screen.getAllByText('Graphics & Banners');
    fireEvent.click(graphicsButtons[0]);
    expect(resourceActions().length).toBe(4);

    const allButtons = screen.getAllByText('All Resources');
    fireEvent.click(allButtons[0]);
    expect(resourceActions().length).toBe(20);
  });

  it('renders usage guidelines', () => {
    render(<ActivistToolkit />);
    expect(screen.getByText('Usage Guidelines')).toBeTruthy();
    expect(screen.getByText(/free for non-commercial/)).toBeTruthy();
  });

  it('renders request resource section', () => {
    render(<ActivistToolkit />);
    expect(screen.getByText('Need Something Specific?')).toBeTruthy();
    const request = screen.getByText('Request a Resource on GitHub').closest('a')!;
    expect(request.getAttribute('href')).toBe('https://github.com/Stan2032/global-anti-ccp-resistance-hub/issues/new');
    expect(request.getAttribute('rel')).toContain('noopener');
  });

  it('offers no download that does nothing', () => {
    // Every resource's downloadUrl is still '#': no file exists yet (Q20).
    // Each card says so, and shows no size for a file that does not exist.
    render(<ActivistToolkit />);
    expect(screen.queryAllByText('Download')).toHaveLength(0);
    expect(screen.getAllByText('Not available yet')).toHaveLength(20);
    expect(screen.queryByText('2MB')).toBeNull();
    expect(screen.queryAllByRole('button').filter(b => /download|request/i.test(b.textContent!))).toHaveLength(0);
  });

  it('displays resource format badges', () => {
    render(<ActivistToolkit />);
    expect(screen.getAllByText('PNG').length).toBeGreaterThan(0);
    expect(screen.getAllByText('PDF').length).toBeGreaterThan(0);
    expect(screen.getAllByText('DOCX').length).toBeGreaterThan(0);
  });
});
