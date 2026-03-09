// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import CommunitySupport from '../pages/CommunitySupport';

describe('CommunitySupport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Header ---

  it('renders the page header', () => {
    render(<CommunitySupport />);
    expect(screen.getByText('Community Support Network')).toBeTruthy();
    expect(screen.getByText(/Mutual aid network connecting activists/)).toBeTruthy();
  });

  // --- Quick Links to Redistributed Features ---

  it('shows quick links to redistributed features', () => {
    render(<CommunitySupport />);
    expect(screen.getByText('Volunteer & Donate')).toBeTruthy();
    expect(screen.getByText('Report CCP Activity')).toBeTruthy();
    expect(screen.getByText('Key Dates & Events')).toBeTruthy();
    expect(screen.getByText('Survivor Stories')).toBeTruthy();
  });

  it('links point to correct pages', () => {
    render(<CommunitySupport />);
    const links = screen.getAllByRole('link');
    const hrefs = links.map(l => l.getAttribute('href'));
    expect(hrefs).toContain('/take-action');
    expect(hrefs).toContain('/security');
    expect(hrefs).toContain('/education');
  });

  // --- Support Resources ---

  it('renders support resources section', () => {
    render(<CommunitySupport />);
    expect(screen.getByText('── support_resources ──')).toBeTruthy();
    expect(screen.getByText('Emergency Relocation Guide')).toBeTruthy();
    expect(screen.getByText('Trauma Support Resources')).toBeTruthy();
    expect(screen.getByText('Legal Support Directory')).toBeTruthy();
    expect(screen.getByText('Fundraising Toolkit')).toBeTruthy();
  });

  // --- No tabs (all components redistributed) ---

  it('does not render tabs (components moved to other pages)', () => {
    render(<CommunitySupport />);
    const buttons = screen.queryAllByRole('button');
    const tabTexts = buttons.map(b => b.textContent);
    expect(tabTexts).not.toContain('Support');
    expect(tabTexts).not.toContain('Events');
    expect(tabTexts).not.toContain('Stories');
    expect(tabTexts).not.toContain('Report');
  });

  // --- No framer-motion ---

  it('does not use framer-motion (no motion elements)', () => {
    const { container } = render(<CommunitySupport />);
    const motionElements = container.querySelectorAll('[data-projection-id]');
    expect(motionElements.length).toBe(0);
  });

  // --- No fake data ---

  it('does not render fake support requests', () => {
    render(<CommunitySupport />);
    expect(screen.queryByText('Legal Support for Hong Kong Activist')).toBeNull();
  });

  it('does not render fake volunteer profiles', () => {
    render(<CommunitySupport />);
    expect(screen.queryByText('Anonymous Volunteer')).toBeNull();
  });

  it('does not render fake community statistics', () => {
    render(<CommunitySupport />);
    expect(screen.queryByText('8,734')).toBeNull();
    expect(screen.queryByText('Active Members')).toBeNull();
  });
});
