import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import CommunitySupport from '../pages/CommunitySupport';

describe('CommunitySupport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Header ---

  // It called itself a "Community Support Network" and a "Mutual aid
  // network connecting activists with volunteers and resources". There is
  // no network: the page is a set of links to help elsewhere on the site.
  it('renders the page header, claiming no network', () => {
    render(<CommunitySupport />);
    expect(screen.getByRole('heading', { level: 1, name: 'Community Support' })).toBeTruthy();
    expect(screen.getByText(/Where to find help, and ways to help others/)).toBeTruthy();
    expect(screen.queryByText(/mutual aid network|support network/i)).toBeNull();
  });

  // --- Quick Links to Redistributed Features ---

  it('shows quick links to redistributed features', () => {
    render(<CommunitySupport />);
    expect(screen.getByText('Volunteer & Donate')).toBeTruthy();
    expect(screen.getByText('Report CCP Activity')).toBeTruthy();
    expect(screen.getByText('Key Dates & Events')).toBeTruthy();
    expect(screen.getByText('Survivor Stories')).toBeTruthy();
  });

  // Each card went to the top of a long page (/take-action, /security,
  // /education), where the section it named was one closed row among many.
  it('links each card to a section that exists on its page', () => {
    render(<CommunitySupport />);
    const PAGE_FILES: Record<string, string> = {
      '/take-action': 'TakeAction.tsx',
      '/security': 'SecurityCenter.tsx',
      '/education': 'EducationalResources.tsx',
    };
    const hrefs = screen.getAllByRole('link').map(l => l.getAttribute('href')!);
    expect(hrefs.length).toBe(7);
    for (const href of hrefs) {
      const [path, id] = href.split('#');
      expect(PAGE_FILES[path], href).toBeTruthy();
      expect(id, href).toBeTruthy();
      const page = readFileSync(resolve(__dirname, '../pages', PAGE_FILES[path]), 'utf-8');
      expect(page, href).toContain(`id="${id}"`);
    }
  });

  // --- Support Resources ---

  // Four cards described an "Emergency Relocation Guide", "Trauma Support
  // Resources", a "Legal Support Directory" and a "Fundraising Toolkit", and
  // led nowhere. Three now go to the sections that cover them; nothing on
  // the site covers fundraising, so that card is gone.
  it('renders support resources, each one a link', () => {
    render(<CommunitySupport />);
    expect(screen.getByText('── support_resources ──')).toBeTruthy();
    for (const title of ['Emergency Help', 'Mental Health Support', 'Legal Help']) {
      expect(screen.getByText(title).closest('a'), title).toBeTruthy();
    }
    expect(screen.queryByText(/Fundraising/)).toBeNull();
    expect(screen.queryByText('Emergency Relocation Guide')).toBeNull();
  });

  it('has no card that is not a link', () => {
    const { container } = render(<CommunitySupport />);
    const cards = [...container.querySelectorAll('h3')];
    expect(cards.length).toBe(7);
    expect(cards.filter(h => !h.closest('a')).map(h => h.textContent)).toEqual([]);
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
