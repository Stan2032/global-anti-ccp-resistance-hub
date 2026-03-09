// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import LanguageGuide from '../components/LanguageGuide';

describe('LanguageGuide', () => {
  it('renders the title', () => {
    render(<LanguageGuide />);
    expect(screen.getByText('Solidarity Phrase Guide')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    render(<LanguageGuide />);
    expect(screen.getByText('Learn key phrases to show support in native languages')).toBeTruthy();
  });

  it('renders all 5 language tabs', () => {
    render(<LanguageGuide />);
    expect(screen.getAllByText('Cantonese').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Uyghur').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Tibetan').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Mandarin').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Taiwanese').length).toBeGreaterThanOrEqual(1);
  });

  it('shows Cantonese phrases by default', () => {
    render(<LanguageGuide />);
    expect(screen.getByText('Liberate Hong Kong, Revolution of Our Times')).toBeTruthy();
    expect(screen.getByText('Five Demands, Not One Less')).toBeTruthy();
    expect(screen.getByText('Add Oil / Keep Fighting')).toBeTruthy();
  });

  it('shows Cantonese region info by default', () => {
    render(<LanguageGuide />);
    expect(screen.getByText('Region: Hong Kong')).toBeTruthy();
  });

  it('switches to Uyghur phrases when Uyghur tab is clicked', () => {
    render(<LanguageGuide />);
    fireEvent.click(screen.getByText('Uyghur'));
    expect(screen.getByText('Free East Turkestan')).toBeTruthy();
    expect(screen.getByText('We will not be silent')).toBeTruthy();
    expect(screen.getByText('Region: East Turkestan')).toBeTruthy();
  });

  it('switches to Tibetan phrases when Tibetan tab is clicked', () => {
    render(<LanguageGuide />);
    fireEvent.click(screen.getByText('Tibetan'));
    expect(screen.getByText('Free Tibet')).toBeTruthy();
    expect(screen.getByText('Region: Tibet')).toBeTruthy();
  });

  it('switches to Mandarin phrases when Mandarin tab is clicked', () => {
    render(<LanguageGuide />);
    fireEvent.click(screen.getByText('Mandarin'));
    expect(screen.getByText('Never forget June 4th')).toBeTruthy();
    expect(screen.getByText('Blank Paper Revolution')).toBeTruthy();
  });

  it('switches to Taiwanese phrases when Taiwanese tab is clicked', () => {
    render(<LanguageGuide />);
    fireEvent.click(screen.getByText('Taiwanese'));
    expect(screen.getByText('Taiwan is Taiwan')).toBeTruthy();
    expect(screen.getByText('I am Taiwanese')).toBeTruthy();
  });

  it('renders phrase cards with native text and romanization', () => {
    render(<LanguageGuide />);
    expect(screen.getByText('光復香港，時代革命')).toBeTruthy();
    expect(screen.getByText('Gwong1 fuk6 Hoeng1 gong2, si4 doi6 gaak3 ming6')).toBeTruthy();
  });

  it('renders tips section', () => {
    render(<LanguageGuide />);
    expect(screen.getByText('Tips for Using These Phrases')).toBeTruthy();
    expect(screen.getByText(/Pronunciation matters/)).toBeTruthy();
  });

  it('renders Learn More resources section', () => {
    render(<LanguageGuide />);
    expect(screen.getByText('Learn More')).toBeTruthy();
    expect(screen.getByText('Cantonese.org - Learn Cantonese')).toBeTruthy();
    expect(screen.getByText('Uyghur American Association')).toBeTruthy();
  });
});
