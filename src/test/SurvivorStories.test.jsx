import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('expands a story when Read full story is clicked', () => {
    render(<SurvivorStories />);
    const readMoreButtons = screen.getAllByText('Read full story →');
    fireEvent.click(readMoreButtons[0]);
    expect(screen.getByText('Show less ↑')).toBeTruthy();
    expect(screen.getByText(/Sources:/)).toBeTruthy();
  });

  it('renders quotes for stories', () => {
    render(<SurvivorStories />);
    expect(screen.getByText(/They wanted to erase everything/)).toBeTruthy();
    expect(screen.getByText(/Exile is not a choice/)).toBeTruthy();
  });

  it('renders Share Their Stories section', () => {
    render(<SurvivorStories />);
    expect(screen.getByText('Share Their Stories')).toBeTruthy();
    expect(screen.getByText('Share on Twitter')).toBeTruthy();
  });

  it('renders More Testimonies resources section', () => {
    render(<SurvivorStories />);
    expect(screen.getByText('More Testimonies')).toBeTruthy();
    expect(screen.getByText('Xinjiang Victims Database')).toBeTruthy();
    expect(screen.getByText('Uyghur Tribunal')).toBeTruthy();
  });

  it('renders verified badges for all stories', () => {
    render(<SurvivorStories />);
    const badges = screen.getAllByText('✓');
    expect(badges.length).toBe(8);
  });
});
