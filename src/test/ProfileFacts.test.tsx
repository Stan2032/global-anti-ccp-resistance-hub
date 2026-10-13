import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfileFacts from '../components/ProfileFacts';

describe('ProfileFacts', () => {
  it('lists each fact as a term and its description', () => {
    const { container } = render(
      <ProfileFacts location="Stanley Prison, Hong Kong" sentence="20 years" nationality="British" />,
    );
    const terms = [...container.querySelectorAll('dt')].map(dt => dt.textContent);
    const descriptions = [...container.querySelectorAll('dd')].map(dd => dd.textContent);
    expect(terms).toEqual(['Where now', 'Sentence', 'Nationality']);
    expect(descriptions).toEqual(['Stanley Prison, Hong Kong', '20 years', 'British']);
  });

  it('leaves out a fact it is not given', () => {
    render(<ProfileFacts sentence="11 years" nationality="Chinese" />);
    expect(screen.queryByText('Where now')).toBeNull();
    expect(screen.getByText('11 years')).toBeTruthy();
  });

  it('renders nothing when it has no facts', () => {
    const { container } = render(<ProfileFacts />);
    expect(container.innerHTML).toBe('');
  });

  it('keeps its icons out of the accessible name', () => {
    const { container } = render(<ProfileFacts location="Hong Kong" />);
    expect(container.querySelector('dt svg')?.getAttribute('aria-hidden')).toBe('true');
  });
});
