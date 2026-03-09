// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SuccessStories from '../components/SuccessStories';

describe('SuccessStories', () => {
  // --- Heading ---

  it('renders the heading', () => {
    render(<SuccessStories />);
    expect(screen.getByText('Victories Against CCP Influence')).toBeTruthy();
  });

  it('renders the subheading', () => {
    render(<SuccessStories />);
    expect(screen.getByText('Documenting successful resistance efforts worldwide')).toBeTruthy();
  });

  // --- Stats ---

  it('renders summary statistics', () => {
    render(<SuccessStories />);
    expect(screen.getByText('Documented Victories')).toBeTruthy();
    expect(screen.getAllByText('Genocide Declarations').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('CI Closures')).toBeTruthy();
  });

  // --- Story entries ---

  it('renders victory titles', () => {
    render(<SuccessStories />);
    expect(screen.getByText('UFLPA Enacted')).toBeTruthy();
    expect(screen.getByText('Two Michaels Released')).toBeTruthy();
    expect(screen.getByText('Huawei 5G Bans')).toBeTruthy();
  });

  it('renders outcome and lessons sections', () => {
    render(<SuccessStories />);
    expect(screen.getAllByText('OUTCOME').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('LESSONS LEARNED').length).toBeGreaterThanOrEqual(1);
  });

  // --- Category filtering ---

  it('renders category filter buttons', () => {
    render(<SuccessStories />);
    expect(screen.getByText(/All Victories/)).toBeTruthy();
    expect(screen.getAllByText(/Sanctions/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Legislation/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Closures/).length).toBeGreaterThanOrEqual(1);
  });

  it('filters victories by category', () => {
    render(<SuccessStories />);
    // Find the Sanctions filter button
    const sanctionsBtn = screen.getAllByText(/Sanctions/).find(el => el.tagName === 'BUTTON' || el.closest('button'));
    fireEvent.click(sanctionsBtn.closest('button') || sanctionsBtn);
    expect(screen.getByText('Coordinated Magnitsky Sanctions')).toBeTruthy();
    expect(screen.getByText('Export Controls on AI Chips')).toBeTruthy();
    // Non-sanctions victory hidden
    expect(screen.queryByText('UFLPA Enacted')).toBeNull();
  });

  it('returns to all victories when All Victories is clicked', () => {
    render(<SuccessStories />);
    const sanctionsBtn = screen.getAllByText(/Sanctions/).find(el => el.tagName === 'BUTTON' || el.closest('button'));
    fireEvent.click(sanctionsBtn.closest('button') || sanctionsBtn);
    expect(screen.queryByText('UFLPA Enacted')).toBeNull();
    fireEvent.click(screen.getByText(/All Victories/));
    expect(screen.getByText('UFLPA Enacted')).toBeTruthy();
  });

  // --- Call to action ---

  it('renders the call to action section', () => {
    render(<SuccessStories />);
    expect(screen.getByText('Help Create More Victories')).toBeTruthy();
    expect(screen.getByText('Take Action Now')).toBeTruthy();
  });
});
