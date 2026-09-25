import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import LanguageGuide from '../components/LanguageGuide';
import { disclosureFor, expectDisclosureSections, inSection } from './helpers/disclosure';

describe('LanguageGuide', () => {
  it('renders the title', () => {
    render(<LanguageGuide />);
    expect(screen.getByText('Solidarity Phrase Guide')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    render(<LanguageGuide />);
    expect(screen.getByText('Learn key phrases to show support in native languages')).toBeTruthy();
  });

  it('renders every language as a native disclosure section', () => {
    render(<LanguageGuide />);
    expectDisclosureSections(['Cantonese', 'Uyghur', 'Tibetan', 'Mandarin', 'Taiwanese']);
  });

  it('opens Cantonese first', () => {
    render(<LanguageGuide />);
    expect(disclosureFor('Cantonese').open).toBe(true);
    expect(disclosureFor('Uyghur').open).toBe(false);
    const cantonese = inSection('Cantonese');
    expect(cantonese.getByText('Liberate Hong Kong, Revolution of Our Times')).toBeTruthy();
    expect(cantonese.getByText('Five Demands, Not One Less')).toBeTruthy();
    expect(cantonese.getByText('Add Oil / Keep Fighting')).toBeTruthy();
  });

  it("names each language's region in its heading", () => {
    render(<LanguageGuide />);
    const summary = (lang: string) => disclosureFor(lang).querySelector('summary')!.textContent;
    expect(summary('Cantonese')).toContain('Hong Kong');
    expect(summary('Uyghur')).toContain('East Turkestan');
    expect(summary('Tibetan')).toContain('Tibet');
  });

  it('shows the Uyghur phrases without interaction', () => {
    render(<LanguageGuide />);
    const uyghur = inSection('Uyghur');
    expect(uyghur.getByText('Free East Turkestan')).toBeTruthy();
    expect(uyghur.getByText('We will not be silent')).toBeTruthy();
    expect(uyghur.getByRole('img', { name: 'East Turkestan flag' })).toBeTruthy();
  });

  it('shows the Tibetan phrases without interaction', () => {
    render(<LanguageGuide />);
    expect(inSection('Tibetan').getByText('Free Tibet')).toBeTruthy();
  });

  it('shows the Mandarin phrases without interaction', () => {
    render(<LanguageGuide />);
    const mandarin = inSection('Mandarin');
    expect(mandarin.getByText('Never forget June 4th')).toBeTruthy();
    expect(mandarin.getByText('Blank Paper Revolution')).toBeTruthy();
  });

  it('shows the Taiwanese phrases without interaction', () => {
    render(<LanguageGuide />);
    const taiwanese = inSection('Taiwanese');
    expect(taiwanese.getByText('Taiwan is Taiwan')).toBeTruthy();
    expect(taiwanese.getByText('I am Taiwanese')).toBeTruthy();
  });

  it('names each copy button after its language and phrase', () => {
    render(<LanguageGuide />);
    expect(screen.getByRole('button', { name: 'Copy the Cantonese for "Five Demands, Not One Less"' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Copy the Uyghur for "Free East Turkestan"' })).toBeTruthy();
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
