import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

import VictimStories from '../components/VictimStories';

// A story's full text is a native <details>; its toggle names the person.
const storyOf = (name: string) => {
  const details = [...document.querySelectorAll('details')]
    .find(d => d.querySelector('summary')!.textContent!.includes(`of ${name}`));
  expect(details, `a <details> holding ${name}'s story`).toBeTruthy();
  return details as HTMLDetailsElement;
};

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

  it('every full story is in the page with its sources, folded until opened', () => {
    // The stories used to open in a modal that only JavaScript could render.
    const { container } = render(<VictimStories />);
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    const stories = [...container.querySelectorAll('details')];
    expect(stories.length).toBe(screen.getAllByText('VERIFIED').length);
    stories.forEach(d => {
      expect(d.open).toBe(false);
      expect(within(d).getByText('Sources')).toBeTruthy();
    });
    const mihrigul = storyOf('Mihrigul Tursun');
    expect(within(mihrigul).getByText('CECC Testimony')).toBeTruthy();
  });

  it('Read full story opens a story and Show less folds it, natively', () => {
    render(<VictimStories />);
    const mihrigul = storyOf('Mihrigul Tursun');
    fireEvent.click(within(mihrigul).getByText('Read full story →'));
    expect(mihrigul.open).toBe(true);
    fireEvent.click(within(mihrigul).getByText('Show less ↑'));
    expect(mihrigul.open).toBe(false);
  });

  it('displays story locations', () => {
    render(<VictimStories />);
    expect(screen.getByText('Xinjiang → United States')).toBeTruthy();
    expect(screen.getByText('Hong Kong → United Kingdom')).toBeTruthy();
  });

  it('offers sharing inside each story', () => {
    render(<VictimStories />);
    const mihrigul = within(storyOf('Mihrigul Tursun'));
    expect(mihrigul.getByText('Copy to Share')).toBeTruthy();
    const tweet = mihrigul.getByText('Share on Twitter').closest('a')!;
    expect(tweet.getAttribute('href')).toContain('Mihrigul%20Tursun');
  });

  it('tells screen readers which category filter is selected', () => {
    render(<VictimStories />);
    const pressed = screen.getAllByRole('button').filter(b => b.getAttribute('aria-pressed') === 'true');
    expect(pressed).toHaveLength(1);
    const other = screen.getAllByRole('button').find(b => b.getAttribute('aria-pressed') === 'false')!;
    fireEvent.click(other);
    expect(other.getAttribute('aria-pressed')).toBe('true');
    expect(pressed[0].getAttribute('aria-pressed')).toBe('false');
  });
});
