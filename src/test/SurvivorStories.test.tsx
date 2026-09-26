import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

import SurvivorStories from '../components/SurvivorStories';

describe('SurvivorStories', () => {
  it('renders the title', () => {
    render(<SurvivorStories />);
    expect(screen.getByText('Survivor Stories')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    render(<SurvivorStories />);
    expect(screen.getByText('Voices of those who have experienced CCP repression')).toBeTruthy();
  });

  it('renders all category filter buttons', () => {
    render(<SurvivorStories />);
    expect(screen.getByText('All Stories')).toBeTruthy();
    expect(screen.getAllByText('Uyghur').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Hong Kong').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Tibet').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Dissidents').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Family Members').length).toBeGreaterThanOrEqual(1);
  });

  it('renders all 8 stories by default', () => {
    render(<SurvivorStories />);
    expect(screen.getByText('Tursunay Ziawudun')).toBeTruthy();
    expect(screen.getByText('Gulbahar Haitiwaji')).toBeTruthy();
    expect(screen.getByText('Nathan Law')).toBeTruthy();
    expect(screen.getByText('Glaciar Chow')).toBeTruthy();
    expect(screen.getByText('Lobsang Sangay')).toBeTruthy();
    expect(screen.getByText('Ai Weiwei')).toBeTruthy();
    expect(screen.getByText('Chen Guangcheng')).toBeTruthy();
    expect(screen.getByText('Jewher Ilham')).toBeTruthy();
  });

  it('filters stories by Uyghur category', () => {
    render(<SurvivorStories />);
    fireEvent.click(screen.getAllByText('Uyghur')[0]);
    expect(screen.getByText('Tursunay Ziawudun')).toBeTruthy();
    expect(screen.getByText('Gulbahar Haitiwaji')).toBeTruthy();
    expect(screen.queryByText('Nathan Law')).toBeFalsy();
    expect(screen.queryByText('Ai Weiwei')).toBeFalsy();
  });

  it('filters stories by Hong Kong category', () => {
    render(<SurvivorStories />);
    fireEvent.click(screen.getAllByText('Hong Kong')[0]);
    expect(screen.getByText('Nathan Law')).toBeTruthy();
    expect(screen.getByText('Glaciar Chow')).toBeTruthy();
    expect(screen.queryByText('Tursunay Ziawudun')).toBeFalsy();
  });

  it('filters stories by Dissidents category', () => {
    render(<SurvivorStories />);
    fireEvent.click(screen.getAllByText('Dissidents')[0]);
    expect(screen.getByText('Ai Weiwei')).toBeTruthy();
    expect(screen.getByText('Chen Guangcheng')).toBeTruthy();
    expect(screen.queryByText('Nathan Law')).toBeFalsy();
  });

  it('every story is in the page with its sources, folded until opened', () => {
    const { container } = render(<SurvivorStories />);
    expect(container.querySelectorAll('[aria-expanded]')).toHaveLength(0);
    const stories = [...container.querySelectorAll('details')];
    expect(stories).toHaveLength(8);
    stories.forEach(d => {
      expect(d.open).toBe(false);
      expect(within(d).getByText('Sources:')).toBeTruthy();
    });
  });

  it('Read full story opens a story and Show less folds it, natively', () => {
    const { container } = render(<SurvivorStories />);
    const first = container.querySelector('details')!;
    fireEvent.click(within(first).getByText('Read full story →'));
    expect(first.open).toBe(true);
    fireEvent.click(within(first).getByText('Show less ↑'));
    expect(first.open).toBe(false);
  });

  it('names each toggle after its story, for screen readers', () => {
    const { container } = render(<SurvivorStories />);
    const toggles = [...container.querySelectorAll('summary')].map(s => s.textContent);
    expect(toggles).toHaveLength(8);
    expect(new Set(toggles).size).toBe(toggles.length);
    toggles.forEach(t => expect(t).toMatch(/Read full story from \S.* →/));
  });

  it('shows a quote box only where there is a quote', () => {
    // Tursunay Ziawudun's quotes were garbled and are removed until they can
    // be restored from source (Q19); her card must not show an empty box.
    const { container } = render(<SurvivorStories />);
    const quotes = [...container.querySelectorAll('blockquote')];
    expect(quotes.length).toBeGreaterThan(0);
    quotes.forEach(q => expect(q.textContent!.trim()).not.toBe(''));
  });

  it('renders quotes for stories', () => {
    render(<SurvivorStories />);
    expect(screen.getByText(/They wanted to erase everything/)).toBeTruthy();
    expect(screen.getByText(/Exile is not a choice/)).toBeTruthy();
  });

  it('shares the testimonies section with working links', () => {
    // These were two buttons with no handler: "Share on Twitter" and
    // "Copy Link" did nothing for anyone.
    render(<SurvivorStories />);
    expect(screen.getByText('Share Their Stories')).toBeTruthy();
    const share = screen.getByTitle('Share on Twitter/X').closest('a')!;
    expect(decodeURIComponent(share.getAttribute('href')!))
      .toContain('https://global-anti-ccp-resistance-hub.stane203.workers.dev/education#survivor-testimonies');
  });

  it('renders More Testimonies resources section', () => {
    render(<SurvivorStories />);
    const more = within(screen.getByText('More Testimonies').parentElement!);
    expect(more.getByText('Xinjiang Victims Database')).toBeTruthy();
    expect(more.getByText('Uyghur Tribunal')).toBeTruthy();
  });

  it('renders verified badges for all stories', () => {
    render(<SurvivorStories />);
    const badges = screen.getAllByText('✓');
    expect(badges.length).toBe(8);
  });
});
