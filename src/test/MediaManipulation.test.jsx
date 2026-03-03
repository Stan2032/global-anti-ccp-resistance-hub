import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import MediaManipulation from '../components/MediaManipulation';

describe('MediaManipulation', () => {
  it('renders the header with title', () => {
    render(<MediaManipulation />);
    expect(screen.getByText('CCP Media & Propaganda Tracker')).toBeTruthy();
  });

  it('renders subtitle', () => {
    render(<MediaManipulation />);
    expect(screen.getByText(/Track CCP state media, social media manipulation/)).toBeTruthy();
  });

  it('renders statistics panel', () => {
    render(<MediaManipulation />);
    expect(screen.getByText('Outlets Tracked')).toBeTruthy();
    expect(screen.getByText('Foreign Agents')).toBeTruthy();
    // "Disinfo Networks" appears in both stats and filter button
    expect(screen.getAllByText('Disinfo Networks').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Combined Reach')).toBeTruthy();
    expect(screen.getByText('2B+')).toBeTruthy();
  });

  it('renders all category filter buttons', () => {
    render(<MediaManipulation />);
    expect(screen.getByText('All Media')).toBeTruthy();
    expect(screen.getByText('State Media')).toBeTruthy();
    expect(screen.getByText('Social Media')).toBeTruthy();
    // "Disinfo Networks" appears in both stats and filter
    expect(screen.getAllByText('Disinfo Networks').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Captured Media')).toBeTruthy();
  });

  it('renders all 13 outlets by default', () => {
    render(<MediaManipulation />);
    expect(screen.getByText('CGTN (China Global Television Network)')).toBeTruthy();
    expect(screen.getByText('Xinhua News Agency')).toBeTruthy();
    expect(screen.getByText('Global Times')).toBeTruthy();
    expect(screen.getByText('TikTok / Douyin')).toBeTruthy();
    expect(screen.getByText('WeChat / Weixin')).toBeTruthy();
    expect(screen.getByText('Spamouflage Dragon')).toBeTruthy();
    expect(screen.getByText('South China Morning Post')).toBeTruthy();
  });

  it('filters by State Media category', () => {
    render(<MediaManipulation />);
    fireEvent.click(screen.getByText('State Media'));
    expect(screen.getByText('CGTN (China Global Television Network)')).toBeTruthy();
    expect(screen.getByText('Xinhua News Agency')).toBeTruthy();
    expect(screen.getByText('Global Times')).toBeTruthy();
    expect(screen.getByText("People's Daily")).toBeTruthy();
    expect(screen.getByText('China Daily')).toBeTruthy();
    expect(screen.queryByText('TikTok / Douyin')).toBeFalsy();
    expect(screen.queryByText('Spamouflage Dragon')).toBeFalsy();
  });

  it('filters by Social Media category', () => {
    render(<MediaManipulation />);
    fireEvent.click(screen.getByText('Social Media'));
    expect(screen.getByText('TikTok / Douyin')).toBeTruthy();
    expect(screen.getByText('WeChat / Weixin')).toBeTruthy();
    expect(screen.getByText('50 Cent Army (五毛党)')).toBeTruthy();
    expect(screen.queryByText('CGTN (China Global Television Network)')).toBeFalsy();
  });

  it('filters by Disinfo Networks category', () => {
    render(<MediaManipulation />);
    const disinfoButtons = screen.getAllByText('Disinfo Networks');
    // Click the filter button (second one is the button, first is the stat)
    fireEvent.click(disinfoButtons[1]);
    expect(screen.getByText('Spamouflage Dragon')).toBeTruthy();
    expect(screen.getByText('Dragonbridge')).toBeTruthy();
    expect(screen.queryByText('CGTN (China Global Television Network)')).toBeFalsy();
  });

  it('filters by Captured Media category', () => {
    render(<MediaManipulation />);
    fireEvent.click(screen.getByText('Captured Media'));
    expect(screen.getByText('Phoenix TV')).toBeTruthy();
    expect(screen.getByText('South China Morning Post')).toBeTruthy();
    expect(screen.queryByText('CGTN (China Global Television Network)')).toBeFalsy();
  });

  it('returns to all media when All Media is clicked', () => {
    render(<MediaManipulation />);
    fireEvent.click(screen.getByText('State Media'));
    expect(screen.queryByText('TikTok / Douyin')).toBeFalsy();
    fireEvent.click(screen.getByText('All Media'));
    expect(screen.getByText('TikTok / Douyin')).toBeTruthy();
  });

  it('shows status badges', () => {
    render(<MediaManipulation />);
    const foreignAgent = screen.getAllByText('REGISTERED FOREIGN AGENT');
    expect(foreignAgent.length).toBe(3);
    expect(screen.getByText('UNDER INVESTIGATION')).toBeTruthy();
    expect(screen.getByText('SURVEILLANCE TOOL')).toBeTruthy();
  });

  it('renders how to identify CCP propaganda section', () => {
    render(<MediaManipulation />);
    expect(screen.getByText('How to Identify CCP Propaganda')).toBeTruthy();
    expect(screen.getByText('Red Flags:')).toBeTruthy();
    expect(screen.getByText('Verification Tools:')).toBeTruthy();
    expect(screen.getByText('Report Disinformation:')).toBeTruthy();
  });

  it('shows red flags for propaganda detection', () => {
    render(<MediaManipulation />);
    expect(screen.getByText(/Uses "Chinese government" instead of "CCP"/)).toBeTruthy();
    expect(screen.getByText(/Refers to Taiwan as "Chinese Taipei"/)).toBeTruthy();
    expect(screen.getByText(/Calls Xinjiang camps "vocational training"/)).toBeTruthy();
  });
});
