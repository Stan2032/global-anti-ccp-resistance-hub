import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import ContactRepresentatives from '../components/ContactRepresentatives';
import { disclosureFor, expectDisclosureSections, inSection } from './helpers/disclosure';

const TOPICS = [
  'General Human Rights', 'Uyghur Genocide', 'Hong Kong Freedom', 'Tibetan Rights',
  'Taiwan Support', 'Free Jimmy Lai', 'Magnitsky Sanctions',
];

describe('ContactRepresentatives', () => {
  it('renders the header with title', () => {
    render(<ContactRepresentatives />);
    expect(screen.getByText('Contact Your Representatives')).toBeTruthy();
  });

  it('lists every country', () => {
    render(<ContactRepresentatives />);
    expect(screen.getByText('United States')).toBeTruthy();
    expect(screen.getByText('United Kingdom')).toBeTruthy();
    expect(screen.getByText('Canada')).toBeTruthy();
    expect(screen.getByText('Australia')).toBeTruthy();
    expect(screen.getByText('European Union')).toBeTruthy();
  });

  it("shows every country's contact links at once, with nothing to click", () => {
    render(<ContactRepresentatives />);
    const link = (name: string) => screen.getAllByRole('link', { name: `${name} →` });
    expect(link('Find Your Representative')).toHaveLength(1); // US
    expect(link('Find Your Senators')).toHaveLength(1);       // US
    expect(link('Write to Your MP')).toHaveLength(1);         // UK
    expect(link('Contact Your Senator')).toHaveLength(1);     // Canada
    expect(link('Find Your Senator')).toHaveLength(1);        // Australia
    expect(link('Find Your MEP')).toHaveLength(1);            // EU
    expect(link('Find Your MP')).toHaveLength(3);             // UK, Canada, Australia
  });

  it('renders a letter for every topic as a native disclosure section', () => {
    render(<ContactRepresentatives />);
    expect(screen.getByText('Letter Templates')).toBeTruthy();
    expectDisclosureSections(TOPICS);
  });

  it('opens the general letter first', () => {
    render(<ContactRepresentatives />);
    expect(disclosureFor('General Human Rights').open).toBe(true);
    expect(disclosureFor('Uyghur Genocide').open).toBe(false);
    expect(inSection('General Human Rights')
      .getByText('Urging Action on Human Rights Abuses by the Chinese Communist Party')).toBeTruthy();
  });

  it('keeps every letter in the page without interaction', () => {
    render(<ContactRepresentatives />);
    expect(inSection('Uyghur Genocide').getByText('Urgent Action Needed on Uyghur Genocide')).toBeTruthy();
  });

  it('names each copy button after its letter', () => {
    render(<ContactRepresentatives />);
    for (const topic of TOPICS) {
      expect(screen.getByRole('button', { name: `Copy the ${topic} letter` })).toBeTruthy();
    }
  });

  it('copies the letter for its own topic', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<ContactRepresentatives />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy the Uyghur Genocide letter' }));
    expect(await inSection('Uyghur Genocide').findByText('✓ Copied!')).toBeTruthy();
    expect(writeText.mock.calls[0][0]).toMatch(/^Urgent Action Needed on Uyghur Genocide\n\n/);
    // Only that letter's button changed.
    expect(inSection('General Human Rights').getByText('Copy Letter')).toBeTruthy();
  });

  it('renders tips for effective advocacy', () => {
    render(<ContactRepresentatives />);
    expect(screen.getByText('Tips for Effective Advocacy')).toBeTruthy();
    expect(screen.getByText(/Be respectful and professional/)).toBeTruthy();
  });
});
