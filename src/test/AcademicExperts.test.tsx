import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import AcademicExperts from '../components/AcademicExperts';
import expertsData from '../data/academic_experts_research.json';

const experts = expertsData.results.map(r => r.output);

/** An expert's card: the <details> whose summary is headed by their name. */
function cardFor(name: string): HTMLDetailsElement {
  const summary = screen.getByRole('heading', { level: 4, name }).parentElement!;
  expect(summary.tagName, `${name}'s heading sits directly in a <summary>`).toBe('SUMMARY');
  return summary.parentElement as HTMLDetailsElement;
}

describe('AcademicExperts', () => {
  it('renders the title', () => {
    render(<AcademicExperts />);
    expect(screen.getByText('Academic Experts Directory')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    render(<AcademicExperts />);
    expect(screen.getByText('Leading scholars on China human rights • Verified research sources')).toBeTruthy();
  });

  it('renders statistics panel with category counts', () => {
    render(<AcademicExperts />);
    expect(screen.getAllByText('Xinjiang/Uyghur').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Tibet').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Hong Kong').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('CCP Targeted')).toBeTruthy();
  });

  it('renders search input', () => {
    render(<AcademicExperts />);
    const searchInput = screen.getByLabelText('Search experts by name, affiliation, or work');
    expect(searchInput).toBeTruthy();
    expect(searchInput.getAttribute('placeholder')).toBe('Search experts by name, affiliation, or work...');
  });

  it('renders expertise filter select', () => {
    render(<AcademicExperts />);
    const filter = screen.getByLabelText('Expertise filter');
    expect(filter).toBeTruthy();
    expect(screen.getByText('All Expertise Areas')).toBeTruthy();
  });

  it('renders expert names', () => {
    render(<AcademicExperts />);
    expect(screen.getByText('Dr. Adrian Zenz')).toBeTruthy();
  });

  it('renders expert affiliations', () => {
    render(<AcademicExperts />);
    expect(screen.getByText('Victims of Communism Memorial Foundation')).toBeTruthy();
  });

  it('filters experts by search term', () => {
    render(<AcademicExperts />);
    const searchInput = screen.getByLabelText('Search experts by name, affiliation, or work');
    fireEvent.change(searchInput, { target: { value: 'Zenz' } });
    expect(screen.getByText('Dr. Adrian Zenz')).toBeTruthy();
  });

  it('shows no results message for unmatched search', () => {
    render(<AcademicExperts />);
    const searchInput = screen.getByLabelText('Search experts by name, affiliation, or work');
    fireEvent.change(searchInput, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('No experts found matching your criteria')).toBeTruthy();
  });

  // Each expert is a native <details>. This was a <div> with a click
  // handler: a keyboard could not reach it, and without JavaScript the key
  // works, media presence and links were not in the page at all.
  it('renders every expert as a closed native disclosure named by a heading', () => {
    render(<AcademicExperts />);
    expect(experts.length).toBeGreaterThan(0);
    for (const expert of experts) {
      expect(cardFor(expert.name).open, expert.name).toBe(false);
    }
  });

  it("puts every expert's key works in the page before any click", () => {
    render(<AcademicExperts />);
    const withWorks = experts.filter(e => e.key_works);
    expect(withWorks.length).toBeGreaterThan(0);
    for (const expert of withWorks) {
      const card = within(cardFor(expert.name));
      expect(card.getByText('Key Works')).toBeTruthy();
      expect(card.getByText(expert.key_works)).toBeTruthy();
    }
  });

  it('an expert card opens and closes natively', () => {
    render(<AcademicExperts />);
    const card = cardFor('Dr. Adrian Zenz');
    fireEvent.click(card.querySelector(':scope > summary')!);
    expect(card.open).toBe(true);
    fireEvent.click(card.querySelector(':scope > summary')!);
    expect(card.open).toBe(false);
  });

  it('keeps links out of the summary, where they would fight the toggle', () => {
    render(<AcademicExperts />);
    const summaries = [...document.querySelectorAll('summary')];
    expect(summaries.length).toBe(experts.length);
    for (const summary of summaries) expect(summary.querySelector('a')).toBeNull();
  });

  it('renders footer note about scholars', () => {
    render(<AcademicExperts />);
    expect(screen.getByText(/scholars are recognized experts whose work has been cited/)).toBeTruthy();
  });
});
