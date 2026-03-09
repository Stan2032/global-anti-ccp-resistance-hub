// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import VictimStories from '../components/VictimStories';

describe('VictimStories', () => {
  it('renders the header with title', () => {
    render(<VictimStories />);
    expect(screen.getByText('Survivor Stories')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    render(<VictimStories />);
    expect(screen.getByText(/Personal testimonies from survivors/)).toBeTruthy();
  });

  it('renders content warning', () => {
    render(<VictimStories />);
    expect(screen.getByText(/descriptions of torture and trauma/)).toBeTruthy();
  });

  it('renders all category filter buttons', () => {
    render(<VictimStories />);
    expect(screen.getByText('All Stories')).toBeTruthy();
    expect(screen.getByText('Uyghur')).toBeTruthy();
    expect(screen.getByText('Hong Kong')).toBeTruthy();
    expect(screen.getByText('Tibet')).toBeTruthy();
    expect(screen.getByText('Domestic')).toBeTruthy();
    expect(screen.getByText('Transnational')).toBeTruthy();
  });

  it('renders all 8 stories by default', () => {
    render(<VictimStories />);
    expect(screen.getByText('Mihrigul Tursun')).toBeTruthy();
    expect(screen.getByText('Nathan Law')).toBeTruthy();
    expect(screen.getByText('Sayragul Sauytbay')).toBeTruthy();
    expect(screen.getByText('Chen Guangcheng')).toBeTruthy();
    expect(screen.getByText('Tenzin Tsundue')).toBeTruthy();
    expect(screen.getByText('Gui Minhai')).toBeTruthy();
    expect(screen.getByText('Jewher Ilham')).toBeTruthy();
    expect(screen.getByText('Wang Dan')).toBeTruthy();
  });

  it('filters stories by Uyghur category', () => {
    render(<VictimStories />);
    fireEvent.click(screen.getByText('Uyghur'));
    expect(screen.getByText('Mihrigul Tursun')).toBeTruthy();
    expect(screen.getByText('Sayragul Sauytbay')).toBeTruthy();
    expect(screen.getByText('Jewher Ilham')).toBeTruthy();
    expect(screen.queryByText('Nathan Law')).toBeFalsy();
    expect(screen.queryByText('Wang Dan')).toBeFalsy();
  });

  it('filters stories by Hong Kong category', () => {
    render(<VictimStories />);
    fireEvent.click(screen.getByText('Hong Kong'));
    expect(screen.getByText('Nathan Law')).toBeTruthy();
    expect(screen.queryByText('Mihrigul Tursun')).toBeFalsy();
  });

  it('filters stories by Tibet category', () => {
    render(<VictimStories />);
    fireEvent.click(screen.getByText('Tibet'));
    expect(screen.getByText('Tenzin Tsundue')).toBeTruthy();
    expect(screen.queryByText('Nathan Law')).toBeFalsy();
  });

  it('filters stories by Transnational category', () => {
    render(<VictimStories />);
    fireEvent.click(screen.getByText('Transnational'));
    expect(screen.getByText('Gui Minhai')).toBeTruthy();
    expect(screen.queryByText('Mihrigul Tursun')).toBeFalsy();
  });

  it('returns to all stories when All Stories is clicked', () => {
    render(<VictimStories />);
    fireEvent.click(screen.getByText('Uyghur'));
    expect(screen.queryByText('Nathan Law')).toBeFalsy();
    fireEvent.click(screen.getByText('All Stories'));
    expect(screen.getByText('Nathan Law')).toBeTruthy();
  });

  it('shows verified badges', () => {
    render(<VictimStories />);
    const badges = screen.getAllByText('VERIFIED');
    expect(badges.length).toBe(8);
  });

  it('opens story modal when clicking a story card', () => {
    render(<VictimStories />);
    fireEvent.click(screen.getByText('Mihrigul Tursun'));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Sources')).toBeTruthy();
    expect(screen.getByText('CECC Testimony')).toBeTruthy();
  });

  it('closes modal when close button is clicked', () => {
    render(<VictimStories />);
    fireEvent.click(screen.getByText('Mihrigul Tursun'));
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.click(screen.getByText('✕'));
    expect(screen.queryByRole('dialog')).toBeFalsy();
  });

  it('displays story locations', () => {
    render(<VictimStories />);
    expect(screen.getByText('Xinjiang → United States')).toBeTruthy();
    expect(screen.getByText('Hong Kong → United Kingdom')).toBeTruthy();
  });

  it('renders share buttons in modal', () => {
    render(<VictimStories />);
    fireEvent.click(screen.getByText('Mihrigul Tursun'));
    expect(screen.getByText('Copy to Share')).toBeTruthy();
    expect(screen.getByText('Share on Twitter')).toBeTruthy();
  });
});
