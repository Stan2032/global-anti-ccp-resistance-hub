// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import ActivistToolkit from '../components/ActivistToolkit';

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
    const downloadButtons = screen.getAllByText('Download');
    expect(downloadButtons.length).toBe(20);
  });

  it('filters resources by Graphics & Banners category', () => {
    render(<ActivistToolkit />);
    const graphicsButtons = screen.getAllByText('Graphics & Banners');
    fireEvent.click(graphicsButtons[0]);
    const downloadButtons = screen.getAllByText('Download');
    expect(downloadButtons.length).toBe(4);
    expect(screen.getByText('Free Jimmy Lai Banner')).toBeTruthy();
    expect(screen.queryByText('Letter to Representative - Uyghur Genocide')).toBeFalsy();
  });

  it('filters resources by Letter Templates category', () => {
    render(<ActivistToolkit />);
    const templateButtons = screen.getAllByText('Letter Templates');
    fireEvent.click(templateButtons[0]);
    const downloadButtons = screen.getAllByText('Download');
    expect(downloadButtons.length).toBe(4);
    expect(screen.getByText('Letter to Representative - Uyghur Genocide')).toBeTruthy();
  });

  it('filters resources by Fact Sheets category', () => {
    render(<ActivistToolkit />);
    const factButtons = screen.getAllByText('Fact Sheets');
    fireEvent.click(factButtons[0]);
    const downloadButtons = screen.getAllByText('Download');
    expect(downloadButtons.length).toBe(4);
    expect(screen.getByText('Uyghur Genocide Fact Sheet')).toBeTruthy();
  });

  it('returns to all resources when All Resources is clicked', () => {
    render(<ActivistToolkit />);
    const graphicsButtons = screen.getAllByText('Graphics & Banners');
    fireEvent.click(graphicsButtons[0]);
    expect(screen.getAllByText('Download').length).toBe(4);

    const allButtons = screen.getAllByText('All Resources');
    fireEvent.click(allButtons[0]);
    expect(screen.getAllByText('Download').length).toBe(20);
  });

  it('renders usage guidelines', () => {
    render(<ActivistToolkit />);
    expect(screen.getByText('Usage Guidelines')).toBeTruthy();
    expect(screen.getByText(/free for non-commercial/)).toBeTruthy();
  });

  it('renders request resource section', () => {
    render(<ActivistToolkit />);
    expect(screen.getByText('Need Something Specific?')).toBeTruthy();
    expect(screen.getByText('Request a Resource')).toBeTruthy();
  });

  it('displays resource format badges', () => {
    render(<ActivistToolkit />);
    expect(screen.getAllByText('PNG').length).toBeGreaterThan(0);
    expect(screen.getAllByText('PDF').length).toBeGreaterThan(0);
    expect(screen.getAllByText('DOCX').length).toBeGreaterThan(0);
  });
});
