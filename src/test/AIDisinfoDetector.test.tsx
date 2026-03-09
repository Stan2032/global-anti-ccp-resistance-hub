import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import AIDisinfoDetector from '../components/AIDisinfoDetector';

describe('AIDisinfoDetector', () => {
  it('renders the title', () => {
    render(<AIDisinfoDetector />);
    expect(screen.getByText('AI Disinformation Detector')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    render(<AIDisinfoDetector />);
    expect(screen.getByText(/Analyze text for CCP propaganda patterns/)).toBeTruthy();
  });

  it('renders the textarea for pasting text', () => {
    render(<AIDisinfoDetector />);
    expect(screen.getByLabelText('Paste text to analyze:')).toBeTruthy();
  });

  it('renders the Analyze Text button', () => {
    render(<AIDisinfoDetector />);
    expect(screen.getByText('Analyze Text')).toBeTruthy();
  });

  it('has Analyze Text button disabled when textarea is empty', () => {
    render(<AIDisinfoDetector />);
    const button = screen.getByText('Analyze Text').closest('button');
    expect(button!.disabled).toBe(true);
  });

  it('enables Analyze Text button when text is entered', () => {
    render(<AIDisinfoDetector />);
    const textarea = screen.getByLabelText('Paste text to analyze:');
    fireEvent.change(textarea, { target: { value: 'some text to analyze' } });
    const button = screen.getByText('Analyze Text').closest('button');
    expect(button!.disabled).toBe(false);
  });

  it('renders example texts section', () => {
    render(<AIDisinfoDetector />);
    expect(screen.getByText('CCP Propaganda Example')).toBeTruthy();
    expect(screen.getByText('Neutral Reporting Example')).toBeTruthy();
  });

  it('renders Load Example buttons', () => {
    render(<AIDisinfoDetector />);
    const buttons = screen.getAllByText('Load Example');
    expect(buttons.length).toBe(2);
  });

  it('loads example text when Load Example is clicked', () => {
    render(<AIDisinfoDetector />);
    const loadButtons = screen.getAllByText('Load Example');
    fireEvent.click(loadButtons[0]);
    const textarea = screen.getByLabelText('Paste text to analyze:');
    expect((textarea as HTMLInputElement).value).toContain('vocational training');
  });

  it('renders Common CCP Propaganda Patterns section', () => {
    render(<AIDisinfoDetector />);
    expect(screen.getByText('Common CCP Propaganda Patterns')).toBeTruthy();
  });

  it('renders all propaganda pattern categories', () => {
    render(<AIDisinfoDetector />);
    expect(screen.getByText('Denial')).toBeTruthy();
    expect(screen.getByText('Whataboutism')).toBeTruthy();
    expect(screen.getByText('Deflection')).toBeTruthy();
    expect(screen.getByText('Euphemism')).toBeTruthy();
    expect(screen.getByText('Victim Blaming')).toBeTruthy();
    expect(screen.getByText('False Equivalence')).toBeTruthy();
  });

  it('renders external resource links', () => {
    render(<AIDisinfoDetector />);
    expect(screen.getByText(/Freedom House/)).toBeTruthy();
    expect(screen.getByText(/ASPI/)).toBeTruthy();
    expect(screen.getByText(/NED/)).toBeTruthy();
  });
});
