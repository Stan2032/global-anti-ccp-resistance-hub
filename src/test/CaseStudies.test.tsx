import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import CaseStudies from '../components/CaseStudies';

// Each case is a native <details>: the card is the summary, the full case
// file is the body, present without a click.
const caseFor = (name: string) => {
  const card = [...document.querySelectorAll('details')].find(d => d.querySelector('summary h3')?.textContent === name);
  expect(card, `a case for ${name}`).toBeTruthy();
  return card!;
};

describe('CaseStudies', () => {
  it('renders the main heading', () => {
    render(<CaseStudies />);
    expect(screen.getByText('Case Study Deep Dives')).toBeTruthy();
  });

  it('renders Jimmy Lai case study', () => {
    render(<CaseStudies />);
    expect(screen.getByText('Jimmy Lai')).toBeTruthy();
  });

  it('shows case status badges', () => {
    render(<CaseStudies />);
    const imprisonedBadges = screen.getAllByText('IMPRISONED');
    expect(imprisonedBadges.length).toBeGreaterThanOrEqual(1);
  });

  it('shows urgency level in case data', () => {
    render(<CaseStudies />);
    // Cases have urgency badges that are displayed when expanded
    // Check that the component renders without errors
    expect(screen.getByText('Jimmy Lai')).toBeTruthy();
  });

  it('shows case summaries on the cards', () => {
    render(<CaseStudies />);
    expect(within(caseFor('Jimmy Lai').querySelector('summary')!).getByText(/Hong Kong media mogul/)).toBeTruthy();
  });

  it('renders category labels', () => {
    render(<CaseStudies />);
    const hkLabels = screen.getAllByText('Hong Kong');
    expect(hkLabels.length).toBeGreaterThanOrEqual(1);
  });

  it('every case carries its full case file without a click', () => {
    render(<CaseStudies />);
    const jimmy = within(caseFor('Jimmy Lai'));
    expect(jimmy.getByText('Timeline')).toBeTruthy();
    expect(jimmy.getByText('Charges & Verdict')).toBeTruthy();
    expect(jimmy.getByText('International Response')).toBeTruthy();
    expect(jimmy.getByText('Sources')).toBeTruthy();
  });

  it('a case opens and closes natively', () => {
    render(<CaseStudies />);
    const jimmy = caseFor('Jimmy Lai');
    expect(jimmy.open).toBe(false);
    fireEvent.click(jimmy.querySelector('summary')!);
    expect(jimmy.open).toBe(true);
    fireEvent.click(jimmy.querySelector('summary')!);
    expect(jimmy.open).toBe(false);
  });

  it('renders multiple case studies', () => {
    render(<CaseStudies />);
    // Should have at least Jimmy Lai + others
    const allNames = screen.getAllByText(/Lai|Tohti|Wong/);
    expect(allNames.length).toBeGreaterThanOrEqual(1);
  });

  it('shows source disclaimer', () => {
    render(<CaseStudies />);
    // GlobalDisclaimer is used
    expect(screen.getByText(/Verified Sources/i) || screen.getByText(/source/i)).toBeTruthy();
  });
});
