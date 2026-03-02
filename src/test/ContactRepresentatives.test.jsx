import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import ContactRepresentatives from '../components/ContactRepresentatives';

describe('ContactRepresentatives', () => {
  it('renders the header with title', () => {
    render(<ContactRepresentatives />);
    expect(screen.getByText('Contact Your Representatives')).toBeTruthy();
  });

  it('renders country selection buttons', () => {
    render(<ContactRepresentatives />);
    expect(screen.getByText('United States')).toBeTruthy();
    expect(screen.getByText('United Kingdom')).toBeTruthy();
    expect(screen.getByText('Canada')).toBeTruthy();
    expect(screen.getByText('Australia')).toBeTruthy();
    expect(screen.getByText('European Union')).toBeTruthy();
  });

  it('renders topic selection buttons', () => {
    render(<ContactRepresentatives />);
    expect(screen.getByText('General Human Rights')).toBeTruthy();
    expect(screen.getByText('Uyghur Genocide')).toBeTruthy();
    expect(screen.getByText('Hong Kong Freedom')).toBeTruthy();
    expect(screen.getByText('Tibetan Rights')).toBeTruthy();
    expect(screen.getByText('Taiwan Support')).toBeTruthy();
    expect(screen.getByText('Free Jimmy Lai')).toBeTruthy();
    expect(screen.getByText('Magnitsky Sanctions')).toBeTruthy();
  });

  it('shows US contact links by default', () => {
    render(<ContactRepresentatives />);
    expect(screen.getByText('Find Your Representative')).toBeTruthy();
    expect(screen.getByText('Find Your Senators')).toBeTruthy();
  });

  it('switches country contact links when country is changed', () => {
    render(<ContactRepresentatives />);
    fireEvent.click(screen.getByText('United Kingdom'));
    expect(screen.getByText('Find Your MP')).toBeTruthy();
    expect(screen.getByText('Write to Your MP')).toBeTruthy();
  });

  it('renders the letter template section', () => {
    render(<ContactRepresentatives />);
    expect(screen.getByText('Letter Template')).toBeTruthy();
    expect(screen.getByText('Copy Letter')).toBeTruthy();
  });

  it('shows general topic subject line by default', () => {
    render(<ContactRepresentatives />);
    expect(screen.getByText('Urging Action on Human Rights Abuses by the Chinese Communist Party')).toBeTruthy();
  });

  it('switches letter template when topic is changed', () => {
    render(<ContactRepresentatives />);
    fireEvent.click(screen.getByText('Uyghur Genocide'));
    expect(screen.getByText('Urgent Action Needed on Uyghur Genocide')).toBeTruthy();
  });

  it('renders tips for effective advocacy', () => {
    render(<ContactRepresentatives />);
    expect(screen.getByText('Tips for Effective Advocacy')).toBeTruthy();
    expect(screen.getByText(/Be respectful and professional/)).toBeTruthy();
  });

  it('renders the copy letter button', () => {
    render(<ContactRepresentatives />);
    expect(screen.getByText('Copy Letter')).toBeTruthy();
  });
});
